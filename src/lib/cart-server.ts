import { getProducts } from "./products";
import type { OrderLine } from "./types";

type ClientItem = {
  productId: string;
  quantity: number;
  priceCents: number;
  name: string;
};

export async function resolveCartLines(
  items: ClientItem[],
): Promise<{ lines: OrderLine[]; totalCents: number } | { error: string }> {
  const catalog = await getProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const lines: OrderLine[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) return { error: "Produit invalide dans le panier." };
    if (item.quantity > product.stock) {
      return { error: `Stock insuffisant pour « ${product.name} ».` };
    }
    if (item.priceCents !== product.priceCents) {
      return { error: "Les prix ont changé. Actualisez votre panier." };
    }
    lines.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      priceCents: product.priceCents,
    });
  }

  const totalCents = lines.reduce((s, l) => s + l.priceCents * l.quantity, 0);
  if (totalCents <= 0) return { error: "Panier vide." };
  return { lines, totalCents };
}
