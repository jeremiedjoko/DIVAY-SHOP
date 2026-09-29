import { resolveCartLines } from "./cart-server";
import type { ShopCurrency } from "./currency";
import type { Order, OrderCustomer, PendingCheckout } from "./types";

type CartClientItem = PendingCheckout["items"][number];

export async function buildOrderFromCart(input: {
  paymentMethod: Order["paymentMethod"];
  status: Order["status"];
  currency: ShopCurrency;
  customer: OrderCustomer;
  items: CartClientItem[];
  userId?: string;
  stripeSessionId?: string;
}): Promise<{ order: Order } | { error: string }> {
  const resolved = await resolveCartLines(input.items);
  if ("error" in resolved) return { error: resolved.error };

  const now = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    paymentMethod: input.paymentMethod,
    status: input.status,
    customer: input.customer,
    lines: resolved.lines,
    currency: input.currency,
    totalCents: resolved.totalCents,
    totalMinor: resolved.totalCents,
    userId: input.userId,
    stripeSessionId: input.stripeSessionId,
  };

  return { order };
}
