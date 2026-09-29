import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { products, productImages, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// Pivot : Cosmétiques → Créations Artisanales
const PRODUCT_FIX: Record<string, { name: string; description: string; image: string; price: number; stock: number }> = {
  "1": {
    name: "Sac en pagne « Élégance »",
    description: "Sac à main structuré entièrement recouvert de véritable pagne Wax premium. Finitions dorées et lanière en cuir.",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80",
    price: 4000, // 40.00 USD
    stock: 5,
  },
  "2": {
    name: "Pochette perlée « Royal »",
    description: "Pochette de soirée minutieusement perlée à la main. Idéale pour vos cérémonies et mariages.",
    image: "https://images.unsplash.com/photo-1515562141207-7a8ea4114e17?w=800&q=80",
    price: 5500, // 55.00 USD
    stock: 3,
  },
  "3": {
    name: "Éventail en pagne « Prestige »",
    description: "Éventail pliable avec armature en cuir véritable et tissu wax coloré. L'accessoire chic et pratique.",
    image: "https://images.unsplash.com/photo-1611078759083-a4c3f59e6651?w=800&q=80",
    price: 2500, // 25.00 USD
    stock: 12,
  },
  "4": {
    name: "Stylo perlé « Classy »",
    description: "Stylo à bille de luxe enveloppé de perles artisanales tissées à la main. Un cadeau unique.",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    price: 1200, // 12.00 USD
    stock: 20,
  },
  "5": {
    name: "Collier perles traditionnel",
    description: "Parure de cou majestueuse réalisée avec des perles de rocaille traditionnelles.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    price: 3000, // 30.00 USD
    stock: 4,
  },
  "6": {
    name: "Sac besace Wax urbain",
    description: "Sac bandoulière spacieux et résistant, mêlant toile robuste et motifs wax vibrants.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    price: 4500, // 45.00 USD
    stock: 8,
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
    if (!fix) continue;

    // 1. Mettre à jour Nom, Description et Prix
    await db
      .update(products)
      .set({ 
        name: fix.name,
        description: fix.description,
        priceMinor: fix.price 
      })
      .where(eq(products.id, product.id));

    // 2. Remplacer l'image
    const existingImages = product.images ?? [];
    if (existingImages.length > 0) {
      for (const img of existingImages) {
        await db.delete(productImages).where(eq(productImages.id, img.id));
      }
    }
    await db.insert(productImages).values({
      id: randomUUID(),
      productId: product.id,
      url: fix.image,
      order: 0,
    });

    results.push(`✅ ${product.slug} transformé en : ${fix.name}`);
  }

  return NextResponse.json({ success: true, results });
}
