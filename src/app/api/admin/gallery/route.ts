import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-api";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = (
    await db.query.galleryItems.findMany({
      with: { media: true },
    })
  ).sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { mediaId?: string; caption?: string; sortOrder?: number };
  if (!body.mediaId) {
    return NextResponse.json({ error: "mediaId requis." }, { status: 400 });
  }
  const id = randomUUID();
  await db.insert(galleryItems).values({
    id,
    mediaId: body.mediaId,
    caption: body.caption ?? null,
    sortOrder: body.sortOrder ?? 0,
    isActive: 1,
  });
  return NextResponse.json({ id }, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as {
    id?: string;
    caption?: string;
    sortOrder?: number;
    isActive?: number;
    mediaId?: string;
  };
  if (!body.id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (body.caption !== undefined) patch.caption = body.caption;
  if (body.sortOrder !== undefined) patch.sortOrder = body.sortOrder;
  if (body.isActive !== undefined) patch.isActive = body.isActive;
  if (body.mediaId !== undefined) patch.mediaId = body.mediaId;

  await db.update(galleryItems).set(patch).where(eq(galleryItems.id, body.id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
  return NextResponse.json({ ok: true });
}
