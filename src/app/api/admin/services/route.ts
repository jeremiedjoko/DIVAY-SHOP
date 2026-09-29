import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-api";
import { db } from "@/db";
import { beautyServices } from "@/db/schema";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.query.beautyServices.findMany({ with: { media: true } });
  return NextResponse.json({ services: rows });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug, mediaId } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug requis." }, { status: 400 });
  await db
    .update(beautyServices)
    .set({ mediaId: mediaId ?? null })
    .where(eq(beautyServices.slug, slug));
  return NextResponse.json({ ok: true });
}
