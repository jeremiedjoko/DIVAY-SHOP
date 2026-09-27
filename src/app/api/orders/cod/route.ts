import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/customer-auth";
import { buildOrderFromCart } from "@/lib/order-factory";
import { saveOrder } from "@/lib/orders";
import { applyStockDelta } from "@/lib/stock";
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

  const user = await getCurrentUser();
  const built = await buildOrderFromCart({
    paymentMethod: "cod",
    status: "pending",
    currency: parsed.data.currency,
    customer: parsed.data.customer,
    items: parsed.data.items,
    userId: user?.id,
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
