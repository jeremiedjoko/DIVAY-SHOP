import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-api";
import { db } from "@/db";
import { siteSections } from "@/db/schema";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.query.siteSections.findMany({ with: { media: true } });
  return NextResponse.json({ sections: rows });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { sectionKey, mediaId } = await req.json();
  if (!sectionKey) {
    return NextResponse.json({ error: "sectionKey requis." }, { status: 400 });
  }
  await db
    .update(siteSections)
    .set({ mediaId: mediaId ?? null })
    .where(eq(siteSections.sectionKey, sectionKey));
  return NextResponse.json({ ok: true });
}
