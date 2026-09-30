import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const rows = await db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, session.userId))
    .orderBy(desc(appointments.date), desc(appointments.time));
  return NextResponse.json({ reservations: rows });
}

// Annulation par la cliente (uniquement ses propres rendez-vous à venir)
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const row = await db.query.appointments.findFirst({ where: (a, { eq }) => eq(a.id, id) });
  if (!row || row.userId !== session.userId) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  if (row.status === "DONE" || row.status === "CANCELLED") {
    return NextResponse.json({ error: "Ce rendez-vous ne peut plus être annulé." }, { status: 400 });
  }
  await db.update(appointments).set({ status: "CANCELLED", updatedAt: new Date() }).where(eq(appointments.id, id));
  return NextResponse.json({ ok: true });
}
