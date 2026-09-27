import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

async function checkLivreur() {
  const session = await getSession();
  return session?.roles?.includes("LIVREUR") || session?.roles?.includes("SUPER_ADMIN");
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkLivreur()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status, trackingNote } = await req.json();

  await db.update(orders)
    .set({ status, trackingNote: trackingNote || null })
    .where(eq(orders.id, id));

  return NextResponse.json({ success: true });
}
