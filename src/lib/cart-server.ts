import { usdCentsToMinor, type ShopCurrency } from "./currency";
import { getProducts } from "./products";
import type { OrderLine } from "./types";

type ClientItem = {
  productId: string;
  quantity: number;
  priceUsdCents: number;
  name: string;
};

export async function resolveCartLines(
  items: ClientItem[],
  currency: ShopCurrency,
): Promise<{ lines: OrderLine[]; totalMinor: number; totalUsdCents: number } | { error: string }> {
  const catalog = await getProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const lines: OrderLine[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) return { error: "Produit invalide dans le panier." };
    if (item.quantity > product.stock) {
      return { error: `Stock insuffisant pour « ${product.name} ».` };
    }
    if (item.priceUsdCents !== product.priceUsdCents) {
      return { error: "Les prix ont changé. Actualisez votre panier." };
    }
    const unitMinor = usdCentsToMinor(product.priceUsdCents, currency);
    lines.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      priceUsdCents: product.priceUsdCents,
      unitMinor,
    });
  }

  const totalMinor = lines.reduce((s, l) => s + l.unitMinor * l.quantity, 0);
  const totalUsdCents = lines.reduce((s, l) => s + l.priceUsdCents * l.quantity, 0);
  if (totalMinor <= 0) return { error: "Panier vide." };
  return { lines, totalMinor, totalUsdCents };
}
