import { db } from "@/db";
import { orders, orderLines } from "@/db/schema";
import { eq, or, like } from "drizzle-orm";
import type { Order, OrderStatus, PaymentMethod } from "./types";

// Convertit la ligne de la BD en type Order
function mapDbOrder(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    createdAt: new Date(dbOrder.createdAt).toISOString(),
    updatedAt: new Date(dbOrder.updatedAt).toISOString(),
    paymentMethod: dbOrder.paymentMethod.toLowerCase() as PaymentMethod,
    status: dbOrder.status.toLowerCase() as OrderStatus,
    customer: {
      email: dbOrder.shippingEmail,
      name: dbOrder.shippingName,
      phone: dbOrder.shippingPhone,
      address: dbOrder.shippingAddress,
      city: dbOrder.shippingCity,
      postalCode: "",
    },
    lines: (dbOrder.lines || []).map((l: any) => ({
      productId: l.productId,
      name: l.productName,
      quantity: l.quantity,
      priceUsdCents: l.priceMinor,
      unitMinor: l.priceMinor,
    })),
    currency: dbOrder.currency,
    totalMinor: dbOrder.totalMinor,
    userId: dbOrder.userId ?? undefined,
    trackingNote: dbOrder.trackingNote ?? undefined,
  };
}

export async function getAllOrders(): Promise<Order[]> {
  const rows = await db.query.orders.findMany({
    with: { lines: true },
    orderBy: (o, { desc }) => [desc(o.createdAt)],
  });
  return rows.map(mapDbOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const row = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { lines: true },
  });
  return row ? mapDbOrder(row) : undefined;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const rows = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: { lines: true },
    orderBy: (o, { desc }) => [desc(o.createdAt)],
  });
  return rows.map(mapDbOrder);
}

export async function findOrderForTracking(
  orderId: string,
  email: string
): Promise<Order | undefined> {
  const cleanOrderId = orderId.trim();
  const row = await db.query.orders.findFirst({
    where: or(
      eq(orders.id, cleanOrderId),
      eq(orders.orderNumber, cleanOrderId.toUpperCase()),
      like(orders.id, `${cleanOrderId.toLowerCase()}%`),
      like(orders.orderNumber, `%${cleanOrderId.toUpperCase()}%`)
    ),
    with: { lines: true },
  });

  if (!row) return undefined;
  // Vérifier l'email indépendamment de la casse pour plus de flexibilité
  if (row.shippingEmail.toLowerCase() !== email.trim().toLowerCase()) return undefined;

  return mapDbOrder(row);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNote?: string
): Promise<Order | null> {
  await db
    .update(orders)
    .set({
      status: status.toUpperCase(),
      trackingNote: trackingNote ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id));

  const updated = await getOrderById(id);
  return updated ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  console.warn("saveOrder is obsolete for tracking/sqlite.");
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | undefined> {
  // Fonction conservée pour compatibilité avec l'ancien code Stripe
  return undefined;
}

