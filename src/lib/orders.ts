// Les commandes vivent dans la table SQL `orders` / `order_lines` (source unique),
// la même que celle lue par l'admin, le livreur et l'espace client.
import { and, desc, eq, or, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { orders, orderLines, users } from "@/db/schema";
import type { Order, OrderStatus, PaymentMethod } from "./types";
import type { ShopCurrency } from "./currency";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

function newOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `DIV-${out}`;
}

type Row = typeof orders.$inferSelect & { lines: (typeof orderLines.$inferSelect)[] };

function toOrder(row: Row): Order {
  const status = row.status.toLowerCase() as OrderStatus;
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    paymentMethod: (row.paymentMethod.toLowerCase() === "card" ? "card" : "cod") as PaymentMethod,
    status: ORDER_STATUSES.includes(status) ? status : "pending",
    customer: {
      email: row.shippingEmail,
      name: row.shippingName,
      phone: row.shippingPhone,
      address: row.shippingAddress,
      city: row.shippingCity,
      postalCode: "",
    },
    lines: row.lines.map((l) => ({
      productId: l.productId ?? "",
      name: l.productName,
      quantity: l.quantity,
      priceCents: l.priceMinor,
      unitMinor: l.priceMinor,
    })),
    totalCents: row.totalMinor,
    totalMinor: row.totalMinor,
    currency: row.currency as ShopCurrency,
    userId: row.userId ?? undefined,
    stripeSessionId: row.stripeSessionId ?? undefined,
    trackingNote: row.trackingNote ?? undefined,
  };
}

export async function saveOrder(order: Order): Promise<void> {
  const total = order.totalMinor ?? order.totalCents;
  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: order.id,
      orderNumber: order.orderNumber ?? newOrderNumber(),
      userId: order.userId ?? null,
      status: order.status.toUpperCase(),
      totalMinor: total,
      currency: order.currency ?? "CDF",
      paymentMethod: order.paymentMethod.toUpperCase(),
      shippingName: order.customer.name,
      shippingEmail: order.customer.email.toLowerCase(),
      shippingPhone: order.customer.phone,
      shippingAddress: order.customer.address,
      shippingCity: order.customer.city,
      stripeSessionId: order.stripeSessionId ?? null,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt ?? order.createdAt),
    });
    for (const l of order.lines) {
      await tx.insert(orderLines).values({
        id: randomUUID(),
        orderId: order.id,
        productId: l.productId || null,
        productName: l.name,
        quantity: l.quantity,
        priceMinor: l.priceCents,
      });
    }
  });
}

/** Suivi public : référence (DIV-XXXXX ou identifiant complet) + e-mail de commande. */
export async function findOrderForTracking(ref: string, email: string) {
  const cleanRef = ref.trim();
  const row = await db.query.orders.findFirst({
    where: and(
      or(eq(orders.id, cleanRef), eq(sql`upper(${orders.orderNumber})`, cleanRef.toUpperCase())),
      eq(sql`lower(${orders.shippingEmail})`, email.trim().toLowerCase()),
    ),
    with: { lines: true },
  });
  return row ? toOrder(row) : undefined;
}

export async function getOrderByStripeSession(sessionId: string) {
  const row = await db.query.orders.findFirst({
    where: eq(orders.stripeSessionId, sessionId),
    with: { lines: true },
  });
  return row ? toOrder(row) : undefined;
}

/** Historique d'une cliente connectée : ses commandes + celles passées en invitée avec son e-mail. */
export async function getOrdersForUser(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  const rows = await db.query.orders.findMany({
    where: user
      ? or(eq(orders.userId, userId), eq(sql`lower(${orders.shippingEmail})`, user.email.toLowerCase()))
      : eq(orders.userId, userId),
    with: { lines: true },
    orderBy: [desc(orders.createdAt)],
  });
  return rows.map(toOrder);
}
