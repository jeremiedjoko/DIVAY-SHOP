import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-api";
import { STATUSES, type AppointmentStatus } from "@/lib/reservations";

export async function GET() {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(appointments).orderBy(desc(appointments.date), desc(appointments.time));
  return NextResponse.json({ reservations: rows });
}

export async function PATCH(req: Request) {
  if (!(await requireAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: string; status?: string };
  if (!id || !STATUSES.includes(status as AppointmentStatus)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  await db.update(appointments).set({ status: status as AppointmentStatus, updatedAt: new Date() }).where(eq(appointments.id, id));
  return NextResponse.json({ ok: true });
}
