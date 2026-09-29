import { NextResponse } from "next/server";
import { resolveCartLines } from "@/lib/cart-server";
import { getStripe } from "@/lib/stripe";
import { checkoutBodySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Paiement en ligne non configuré (clé Stripe manquante)." },
      { status: 503 },
    );
  }

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

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: parsed.data.customer.email,
    line_items: resolved.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "eur",
        unit_amount: line.priceCents,
        product_data: { name: line.name },
      },
    })),
    metadata: {
      customerName: parsed.data.customer.name,
      customerPhone: parsed.data.customer.phone,
    },
    success_url: `${origin}/commande/succes?mode=card&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/commande`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Session Stripe indisponible." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
