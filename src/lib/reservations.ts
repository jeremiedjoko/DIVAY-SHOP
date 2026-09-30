import { z } from "zod";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { getService, slotsForDate } from "@/lib/services-catalog";

export const reservationSchema = z.object({
  serviceSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(25),
  email: z.union([z.string().trim().email().max(120), z.literal("")]).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const STATUSES = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"] as const;
export type AppointmentStatus = (typeof STATUSES)[number];

// Date du jour à Kinshasa (UTC+1), indépendante du fuseau du serveur
export function todayISO(): string {
  return new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function takenTimes(date: string): Promise<string[]> {
  const rows = await db
    .select({ time: appointments.time })
    .from(appointments)
    .where(and(eq(appointments.date, date), ne(appointments.status, "CANCELLED")));
  return rows.map((r) => r.time);
}

export function newReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `RDV-${out}`;
}

export function validateSlot(serviceSlug: string, date: string, time: string): string | null {
  if (!getService(serviceSlug)) return "Prestation inconnue.";
  if (date <= todayISO()) return "Choisissez une date à partir de demain.";
  if (!slotsForDate(date).includes(time)) return "Ce créneau est en dehors des horaires d'ouverture.";
  return null;
}
