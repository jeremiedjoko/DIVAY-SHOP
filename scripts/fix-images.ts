/**
 * Script pour mettre à jour les images de tous les produits dans la base de données.
 * Exécuter avec: npx tsx scripts/fix-images.ts
 */
import { db } from "../src/db/index";
import { products, productImages } from "../src/db/schema";
import { eq, like } from "drizzle-orm";
import { randomUUID } from "crypto";

const PRODUCT_IMAGES: Record<string, string> = {
  "serum-eclat-vitamine-c": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
  "palette-nude-divay": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
  "huile-capillaire-argan": "https://images.unsplash.com/photo-1608248543803-ba4f4c4aeaeb?w=800&q=80",
  "mascara-volume-intense": "https://images.unsplash.com/photo-1631730486572-074d9056cf6c?w=800&q=80",
  "creme-hydratante-karite": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
  "rouge-a-levres-velours": "https://images.unsplash.com/photo-1586495777744-4413d210d7c8?w=800&q=80",
};

// Fallback images for products with unknown slugs
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
  "https://images.unsplash.com/photo-1519415387722-a68315f557af?w=800&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80",
];

async function fixImages() {
  console.log("🔍 Récupération de tous les produits...");
  const allProducts = await db.query.products.findMany({
    with: { images: true },
  });

  console.log(`📦 ${allProducts.length} produits trouvés.`);
  let updated = 0;

  for (const product of allProducts) {
    let imageUrl = PRODUCT_IMAGES[product.slug];

    if (!imageUrl) {
      // Trouver une image de secours basée sur l'index
      const idx = allProducts.indexOf(product) % FALLBACK_IMAGES.length;
      imageUrl = FALLBACK_IMAGES[idx];
    }

    const existingImages = product.images ?? [];
    const hasValidImage = existingImages.some(
      (img) => img.url && img.url !== "/placeholder.png" && img.url.startsWith("http")
    );

    if (!hasValidImage) {
      // Supprimer les vieilles images invalides
      if (existingImages.length > 0) {
        await db.delete(productImages).where(eq(productImages.productId, product.id));
      }
      // Insérer la bonne image
      await db.insert(productImages).values({
        id: randomUUID(),
        productId: product.id,
        url: imageUrl,
        order: 0,
      });
      console.log(`✅ Image mise à jour pour: ${product.name} → ${imageUrl}`);
      updated++;
    } else {
      console.log(`⏭️  Déjà une image valide pour: ${product.name}`);
    }
  }

  console.log(`\n✨ Terminé! ${updated} produits mis à jour.`);
  process.exit(0);
}

fixImages().catch((e) => {
  console.error("Erreur:", e);
  process.exit(1);
});
