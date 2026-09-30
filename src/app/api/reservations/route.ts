import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { getSession } from "@/lib/session";
import { getService } from "@/lib/services-catalog";
import { newReference, reservationSchema, takenTimes, validateSlot } from "@/lib/reservations";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vérifiez vos informations (nom et téléphone requis)." }, { status: 400 });
  }
  const d = parsed.data;

  const slotError = validateSlot(d.serviceSlug, d.date, d.time);
  if (slotError) return NextResponse.json({ error: slotError }, { status: 400 });

  if ((await takenTimes(d.date)).includes(d.time)) {
    return NextResponse.json({ error: "Ce créneau vient d'être réservé. Choisissez une autre heure." }, { status: 409 });
  }

  const service = getService(d.serviceSlug)!;
  const session = await getSession();
  const reference = newReference();

  await db.insert(appointments).values({
    id: randomUUID(),
    reference,
    userId: session?.userId ?? null,
    serviceSlug: service.slug,
    serviceName: service.name,
    priceFc: service.price,
    date: d.date,
    time: d.time,
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    notes: d.notes || null,
    status: "PENDING",
  });

  return NextResponse.json({ reference });
}
