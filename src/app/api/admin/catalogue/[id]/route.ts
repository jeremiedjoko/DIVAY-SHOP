import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { products, productImages, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { applyProductImages } from "@/lib/product-images";

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.priceMinor !== undefined) updateData.priceMinor = body.priceMinor;
  if (body.isActive !== undefined) updateData.isActive = body.isActive as number;
  if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured as number;

  if (Object.keys(updateData).length > 0) {
    await db.update(products).set(updateData).where(eq(products.id, id));
  }

  if (body.stock !== undefined) {
    await db.update(inventory).set({ quantity: body.stock }).where(eq(inventory.productId, id));
  }

  if (
    body.image !== undefined ||
    body.mainMediaId !== undefined ||
    body.galleryMediaIds !== undefined
  ) {
    await applyProductImages(id, {
      mainMediaId: body.mainMediaId ?? null,
      galleryMediaIds: body.galleryMediaIds ?? [],
      legacyImageUrl: body.image ?? null,
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.update(products).set({ isActive: 0 }).where(eq(products.id, id));
  return NextResponse.json({ success: true });
}
