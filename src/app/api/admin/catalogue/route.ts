import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { products, productImages, inventory, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { applyProductImages } from "@/lib/product-images";

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.query.products.findMany({
    with: { images: true, inventory: true },
  });
  return NextResponse.json({ products: rows });
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, priceMinor, stock, image, isFeatured, mainMediaId, galleryMediaIds } =
    await req.json();

  // Catégorie par défaut
  let catId: string;
  const cats = await db.select().from(categories).where(eq(categories.slug, "soins"));
  if (cats.length === 0) {
    catId = randomUUID();
    await db.insert(categories).values({ id: catId, name: "Soins & Beauté", slug: "soins" });
  } else {
    catId = cats[0].id;
  }

  const productId = randomUUID();
  const slug =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
    "-" +
    productId.slice(0, 6);

  await db.insert(products).values({
    id: productId,
    name,
    slug,
    description: description || "Description",
    priceMinor,
    categoryId: catId,
    isFeatured: isFeatured ? 1 : 0,
    isActive: 1,
  });

  await applyProductImages(productId, {
    mainMediaId: mainMediaId ?? null,
    galleryMediaIds: galleryMediaIds ?? [],
    legacyImageUrl: image ?? null,
  });

  await db.insert(inventory).values({ id: randomUUID(), productId, quantity: stock ?? 0 });

  return NextResponse.json({ success: true });
}
