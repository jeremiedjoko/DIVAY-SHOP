import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { products, productImages, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// Correspondance ID (slug numérique) → données correctes
const PRODUCT_FIX: Record<string, { image: string; price: number; stock: number }> = {
  "1": {
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    price: 3200,
    stock: 22,
  },
  "2": {
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
    price: 4500,
    stock: 18,
  },
  "3": {
    image: "https://images.unsplash.com/photo-1608248543803-ba4f4c4aeaeb?w=800&q=80",
    price: 2800,
    stock: 30,
  },
  "4": {
    image: "https://images.unsplash.com/photo-1631730486572-074d9056cf6c?w=800&q=80",
    price: 2200,
    stock: 40,
  },
  "5": {
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    price: 2600,
    stock: 22,
  },
  "6": {
    image: "https://images.unsplash.com/photo-1586495777744-4413d210d7c8?w=800&q=80",
    price: 2400,
    stock: 35,
  },
};

export async function POST() {
  const session = await getSession();
  if (!session?.roles?.includes("SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const allProducts = await db.query.products.findMany({
    with: { images: true, inventory: true },
  });

  const results: string[] = [];

  for (const product of allProducts) {
    const fix = PRODUCT_FIX[product.slug];
    if (!fix) {
      results.push(`⏭️ Slug inconnu: ${product.slug}`);
      continue;
    }

    // 1. Corriger le prix
    await db
      .update(products)
      .set({ priceMinor: fix.price })
      .where(eq(products.id, product.id));

    // 2. Corriger l'image
    const existingImages = product.images ?? [];
    const hasValidImage = existingImages.some(
      (img) => img.url?.startsWith("http") && !img.url.includes("placeholder")
    );

    if (!hasValidImage) {
      // Supprimer les vieilles images invalides
      if (existingImages.length > 0) {
        for (const img of existingImages) {
          await db.delete(productImages).where(eq(productImages.id, img.id));
        }
      }
      // Insérer la bonne image
      await db.insert(productImages).values({
        id: randomUUID(),
        productId: product.id,
        url: fix.image,
        order: 0,
      });
      results.push(`✅ Image corrigée: ${product.name}`);
    } else {
      results.push(`🖼️ Image déjà valide: ${product.name}`);
    }

    // 3. Corriger le stock si 0
    if (product.inventory && product.inventory.quantity === 0) {
      await db
        .update(inventory)
        .set({ quantity: fix.stock })
        .where(eq(inventory.productId, product.id));
      results.push(`📦 Stock corrigé: ${product.name} → ${fix.stock}`);
    }
  }

  return NextResponse.json({ success: true, results });
}
