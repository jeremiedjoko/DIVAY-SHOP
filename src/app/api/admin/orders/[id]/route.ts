import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-api";

const ALLOWED = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string; trackingNote?: string };

  const patch: Partial<typeof orders.$inferInsert> = { updatedAt: new Date() };
  if (body.status !== undefined) {
    const status = body.status.toUpperCase();
    if (!ALLOWED.includes(status)) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    patch.status = status;
  }
  if (body.trackingNote !== undefined) patch.trackingNote = body.trackingNote.slice(0, 300);

  await db.update(orders).set(patch).where(eq(orders.id, id));
  return NextResponse.json({ ok: true });
}
