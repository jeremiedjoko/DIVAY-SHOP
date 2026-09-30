import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletter } from "@/db/schema";
import { randomUUID } from "crypto";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail invalide." }, { status: 400 });
  }
  try {
    await db.insert(newsletter).values({
      id: randomUUID(),
      email: parsed.data.email.toLowerCase(),
    });
  } catch {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: true });
}
