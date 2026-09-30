import { NextResponse } from "next/server";
import { z } from "zod";
import { buildOrderFromCart } from "@/lib/order-factory";
import { getOrderByStripeSession, saveOrder } from "@/lib/orders";
import { consumePendingCheckout } from "@/lib/pending-checkout";
import { getStripe } from "@/lib/stripe";
import { applyStockDelta } from "@/lib/stock";

const bodySchema = z.object({
  sessionId: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Session invalide." }, { status: 400 });
  }

  const existing = await getOrderByStripeSession(parsed.data.sessionId);
  if (existing) {
    return NextResponse.json({ orderId: existing.id });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Paiement non confirmé." }, { status: 402 });
  }

  const checkoutId = session.metadata?.checkoutId;
  if (!checkoutId) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  const pending = await consumePendingCheckout(checkoutId);
  if (!pending) {
    return NextResponse.json({ error: "Panier expiré ou déjà traité." }, { status: 410 });
  }

  if (!pending.currency || !pending.customer) {
    return NextResponse.json({ error: "Données de commande incomplètes." }, { status: 400 });
  }

  const built = await buildOrderFromCart({
    paymentMethod: "card",
    status: "paid",
    currency: pending.currency,
    customer: pending.customer,
    items: pending.items,
    userId: pending.userId,
    stripeSessionId: parsed.data.sessionId,
  });
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  const stock = await applyStockDelta(built.order.lines, "decrement");
  if (!stock.ok) {
    return NextResponse.json({ error: stock.error }, { status: 400 });
  }

  await saveOrder(built.order);

  return NextResponse.json({ orderId: built.order.id });
}
