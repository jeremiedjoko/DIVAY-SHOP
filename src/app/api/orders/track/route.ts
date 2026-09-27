import { NextResponse } from "next/server";
import { z } from "zod";
import { findOrderForTracking } from "@/lib/orders";

const schema = z.object({
  orderId: z.string().min(1),
  email: z.string().email(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") ?? "";
  const email = url.searchParams.get("email") ?? "";

  const parsed = schema.safeParse({ orderId, email });
  if (!parsed.success) {
    return NextResponse.json({ error: "Référence ou e-mail invalide." }, { status: 400 });
  }

  const order = await findOrderForTracking(parsed.data.orderId, parsed.data.email);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Référence ou e-mail invalide." }, { status: 400 });
  }

  const order = await findOrderForTracking(parsed.data.orderId, parsed.data.email);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
