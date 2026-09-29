import { promises as fs } from "fs";
import path from "path";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Product } from "./types";
import { slugify } from "./format";
import { mediaToDto, pickVariantUrl } from "./media/resolve";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

type DbProductRow = Awaited<ReturnType<typeof fetchDbProducts>>[number];

async function fetchDbProducts(activeOnly: boolean) {
  const rows = await db.query.products.findMany({
    where: activeOnly ? eq(productsTable.isActive, 1) : undefined,
    with: {
      images: { with: { media: true } },
      category: true,
      inventory: true,
    },
  });
  return rows;
}

function mapDbProduct(row: DbProductRow): Product {
  const sortedImages = [...(row.images ?? [])].sort((a, b) => {
    if (a.isMain !== b.isMain) return b.isMain - a.isMain;
    return a.order - b.order;
  });

  let image = "/images/placeholder-product.svg";
  let imageAlt = row.name;
  let imageFocal = { x: 50, y: 50 };
  const gallery: NonNullable<Product["gallery"]> = [];

  for (const img of sortedImages) {
    const dto = img.media ? mediaToDto(img.media) : null;
    const url = (dto ? pickVariantUrl(dto, "md") : null) ?? img.url ?? null;
    if (!url) continue;
    const alt = img.altText ?? dto?.altText ?? row.name;
    if (sortedImages.indexOf(img) === 0) {
      image = url;
      imageAlt = alt;
      if (dto) imageFocal = { x: dto.focalX, y: dto.focalY };
    } else {
      gallery.push({ url, alt, focal: dto ? { x: dto.focalX, y: dto.focalY } : undefined });
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceCents: row.priceMinor,
    category: row.category?.name ?? "Boutique",
    image,
    imageAlt,
    imageFocal,
    gallery,
    featured: row.isFeatured === 1,
    stock: row.inventory?.quantity ?? 0,
  };
}

async function readProductsFile(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function getProducts(): Promise<Product[]> {
  const dbRows = await fetchDbProducts(true);
  if (dbRows.length > 0) return dbRows.map(mapDbProduct);
  return readProductsFile();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await db.query.products.findFirst({
    where: eq(productsTable.slug, slug),
    with: {
      images: { with: { media: true } },
      category: true,
      inventory: true,
    },
  });
  if (row && row.isActive === 1) return mapDbProduct(row);

  const fileProducts = await readProductsFile().catch(() => []);
  return fileProducts.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const dbRows = await fetchDbProducts(true);
  if (dbRows.length > 0) {
    return dbRows.filter((p) => p.isFeatured === 1).map(mapDbProduct);
  }
  const products = await readProductsFile();
  return products.filter((p) => p.featured);
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.category))].sort();
}

export async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export function buildProduct(input: Omit<Product, "id" | "slug"> & { slug?: string }): Product {
  const id = crypto.randomUUID();
  const slug = input.slug?.trim() || slugify(input.name);
  return { ...input, id, slug };
}
