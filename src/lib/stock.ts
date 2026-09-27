import { getProducts, saveProducts } from "./products";
import type { OrderLine } from "./types";

export async function applyStockDelta(
  lines: OrderLine[],
  direction: "decrement" | "increment",
): Promise<{ ok: true } | { ok: false; error: string }> {
  const products = await getProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) return { ok: false, error: `Produit introuvable : ${line.name}` };
    if (direction === "decrement" && product.stock < line.quantity) {
      return { ok: false, error: `Stock insuffisant pour « ${product.name} ».` };
    }
  }

  for (const line of lines) {
    const product = byId.get(line.productId)!;
    product.stock +=
      direction === "decrement" ? -line.quantity : line.quantity;
  }

  await saveProducts(products);
  return { ok: true };
}
