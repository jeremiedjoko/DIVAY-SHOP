import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { orders, orderLines, products, inventory } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const userId = session?.userId ?? null;

    const body = await req.json();
    const { items, customer, couponCode } = body;
    // items: [{ id: string, quantity: number }]
    // customer: { name, email, phone, address, city, paymentMethod }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
    }

    // Récupérer les produits depuis la BDD pour la sécurité
    const productIds = items.map((i: any) => i.productId || i.id);
    const dbProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      with: { inventory: true }
    });

    if (dbProducts.length !== items.length) {
      return NextResponse.json({ error: "Certains produits n'existent plus." }, { status: 400 });
    }

    let totalMinor = 0;
    const linesToInsert = [];

    // Vérification des stocks et préparation des lignes
    for (const item of items) {
      const pId = item.productId || item.id;
      const p = dbProducts.find((p) => p.id === pId)!;
      if (!p.inventory || p.inventory.quantity < item.quantity) {
        return NextResponse.json({ error: `Stock insuffisant pour ${p.name}` }, { status: 400 });
      }

      totalMinor += p.priceMinor * item.quantity;

      linesToInsert.push({
        id: randomUUID(),
        productId: p.id,
        productName: p.name,
        quantity: item.quantity,
        priceMinor: p.priceMinor,
      });
    }

    // Gestion du Coupon (Promotion)
    if (couponCode) {
      // Lazy load de la table coupons pour éviter les erreurs circulaires si non importée
      const { coupons } = await import("@/db/schema");
      const activeCoupon = await db.query.coupons.findFirst({
        where: (c, { eq, and }) => and(eq(c.code, String(couponCode).toUpperCase()), eq(c.isActive, 1))
      });

      if (activeCoupon) {
        if (activeCoupon.usageLimit !== null && activeCoupon.usedCount >= activeCoupon.usageLimit) {
          return NextResponse.json({ error: "Ce code promo a atteint sa limite d'utilisation." }, { status: 400 });
        }
        
        // Appliquer la réduction
        if (activeCoupon.discountPct) {
          totalMinor = Math.round(totalMinor * (1 - activeCoupon.discountPct / 100));
        } else if (activeCoupon.discountFix) {
          totalMinor = Math.max(0, totalMinor - activeCoupon.discountFix);
        }

        // Incrémenter l'utilisation
        await db.update(coupons)
          .set({ usedCount: activeCoupon.usedCount + 1 })
          .where(eq(coupons.id, activeCoupon.id));
      } else {
        return NextResponse.json({ error: "Code promo invalide ou expiré." }, { status: 400 });
      }
    }

    const orderId = randomUUID();
    const orderNumber = `DIV-${orderId.slice(0, 8).toUpperCase()}`;

    // Insertion transactionnelle (simulée de façon sûre ici pour SQLite local)
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId,
      status: "PENDING",
      totalMinor,
      currency: "USD",
      paymentMethod: customer.paymentMethod || "COD",
      shippingName: customer.name,
      shippingEmail: customer.email,
      shippingPhone: customer.phone,
      shippingAddress: customer.address,
      shippingCity: customer.city,
    });

    for (const line of linesToInsert) {
      await db.insert(orderLines).values({
        ...line,
        orderId,
      });

      // Déduire le stock
      const p = dbProducts.find(prod => prod.id === line.productId)!;
      await db.update(inventory)
        .set({ quantity: p.inventory!.quantity - line.quantity })
        .where(eq(inventory.productId, line.productId));
    }

    return NextResponse.json({ success: true, orderId, orderNumber });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Erreur lors de la validation" }, { status: 500 });
  }
}
