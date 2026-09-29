const fs = require('fs');
fs.appendFileSync('src/lib/orders.ts', 
export async function findOrderForTracking(id: string) {
  await ensureOrdersFile();
  const raw = await fs.promises.readFile(ORDERS_PATH, 'utf-8');
  const orders = JSON.parse(raw);
  return orders.find((o: any) => o.id === id);
}

export async function getOrderByStripeSession(sessionId: string) {
  await ensureOrdersFile();
  const raw = await fs.promises.readFile(ORDERS_PATH, 'utf-8');
  const orders = JSON.parse(raw);
  return orders.find((o: any) => o.stripeSessionId === sessionId);
}

export async function getOrdersForUser(userId: string) {
  await ensureOrdersFile();
  const raw = await fs.promises.readFile(ORDERS_PATH, 'utf-8');
  const orders = JSON.parse(raw);
  return orders.filter((o: any) => o.customer?.email === userId);
}
);
