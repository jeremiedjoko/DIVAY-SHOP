import { promises as fs } from "fs";
import path from "path";
import type { Order } from "./types";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

async function ensureOrdersFile(): Promise<void> {
  try {
    await fs.access(ORDERS_PATH);
  } catch {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, "[]", "utf-8");
  }
}

export async function saveOrder(order: Order): Promise<void> {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_PATH, "utf-8");
  const orders = JSON.parse(raw) as Order[];
  orders.unshift(order);
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export async function findOrderForTracking(id: string, email: string) {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_PATH, "utf-8");
  const orders = JSON.parse(raw) as Order[];
  return orders.find((o) => o.id === id && o.customer?.email.toLowerCase() === email.toLowerCase());
}

export async function getOrderByStripeSession(sessionId: string) {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_PATH, "utf-8");
  const orders = JSON.parse(raw) as Order[];
  return orders.find(o => (o as any).stripeSessionId === sessionId);
}

export async function getOrdersForUser(userId: string) {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_PATH, "utf-8");
  const orders = JSON.parse(raw) as Order[];
  return orders.filter(o => o.customer?.email === userId);
}
