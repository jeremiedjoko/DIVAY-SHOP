import { NextResponse } from "next/server";
import { slotsForDate } from "@/lib/services-catalog";
import { takenTimes } from "@/lib/reservations";

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }
  const taken = await takenTimes(date);
  return NextResponse.json({ slots: slotsForDate(date), taken });
}
