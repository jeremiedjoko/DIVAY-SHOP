import { db } from "@/db";
import { products, categories, productImages, inventory } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Product } from "./types";
import { slugify } from "./format";

// Images dédiées — fonctionne avec les slugs numériques (anciens) ET les slugs textuels (nouveaux)
const SLUG_TO_IMAGE: Record<string, string> = {
  // Slugs numériques (produits initiaux seedés avec id comme slug)
  "1": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",  // sérum
  "2": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",  // palette
  "3": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",  // argan (garanti)
  "4": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",  // mascara
  "5": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",    // crème karité
  "6": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80&v=2", // rouge à lèvres (anti-cache)
  // Slugs textuels (nouveaux produits ajoutés via le panel admin)
  "serum-eclat-vitamine-c":  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
  "palette-nude-divay":      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
  "huile-capillaire-argan":  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
  "mascara-volume-intense":  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  "creme-hydratante-karite": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
  "rouge-a-levres-velours":  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80&v=2",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  "https://images.unsplash.com/photo-1519415387722-a68315f557af?w=800&q=80",
];

function resolveImage(row: any): string {
  // 1. Priorité absolue : image connue par slug (garantit un beau rendu)
  if (SLUG_TO_IMAGE[row.slug]) return SLUG_TO_IMAGE[row.slug];

  // 2. Image de la BDD si valide et non-placeholder
  const dbUrl = row.images?.[0]?.url;
  if (dbUrl && dbUrl.startsWith("http") && !dbUrl.includes("placeholder")) {
    return dbUrl;
  }

  // 3. Fallback basé sur un hash du nom
  const hash = (row.name ?? "").split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}


// Transforme un produit de la base de données SQLite en objet `Product` pour le frontend
function mapDbProductToFrontend(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceUsdCents: row.priceMinor,
    category: row.category?.name || "Beauté",
    image: resolveImage(row),
    featured: row.isFeatured === 1,
    stock: row.inventory?.quantity || 0,
  };
}


export async function getProducts(): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: eq(products.isActive, 1),
    with: { images: true, inventory: true, category: true },
  });
  return rows.map(mapDbProductToFrontend);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, 1)),
    with: { images: true, inventory: true, category: true },
  });
  return row ? mapDbProductToFrontend(row) : undefined;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: and(eq(products.isFeatured, 1), eq(products.isActive, 1)),
    with: { images: true, inventory: true, category: true },
  });
  return rows.map(mapDbProductToFrontend);
}

export async function getCategories(): Promise<string[]> {
  const rows = await db.select().from(categories);
  return rows.map((c) => c.name).sort();
}

// Fonction gardée pour éviter de casser d'anciennes références, bien qu'elle soit obsolète
export async function saveProducts(p: Product[]): Promise<void> {
  console.warn("saveProducts is obsolete. Use Drizzle DB directly.");
}

export function buildProduct(input: Omit<Product, "id" | "slug"> & { slug?: string }): Product {
  const id = crypto.randomUUID();
  const slug = input.slug?.trim() || slugify(input.name);
  return { ...input, id, slug };
}
