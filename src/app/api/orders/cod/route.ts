import { NextResponse } from "next/server";
import { resolveCartLines } from "@/lib/cart-server";
import { saveOrder } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { checkoutBodySchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = checkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Informations invalides." }, { status: 400 });
  }

  const resolved = await resolveCartLines(parsed.data.items);
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    paymentMethod: "cod",
    status: "pending",
    customer: parsed.data.customer,
    lines: resolved.lines,
    totalCents: resolved.totalCents,
  };

  await saveOrder(order);

  return NextResponse.json({ orderId: order.id });
}
