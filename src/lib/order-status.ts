import type { OrderStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const ORDER_TIMELINE: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
];

export function timelineIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  const idx = ORDER_TIMELINE.indexOf(status);
  return idx === -1 ? 0 : idx;
}
