"use client";

import { formatCatalogPrice } from "@/lib/currency";
import { useCart, CartItem } from "@/store/cart";
import { useCurrency } from "@/store/currency";

type Props = {
  overrideItems?: CartItem[]; // Utilisé pour le mode express (1 seul article)
};

export function CartTotal({ overrideItems }: Props) {
  const totalUsdCents = useCart((s) => s.totalUsdCents());
  const currency = useCurrency((s) => s.currency);

  // Si on a des articles override (mode express), calculer leur total à la place
  const displayTotal = overrideItems
    ? overrideItems.reduce((sum, i) => sum + i.priceUsdCents * i.quantity, 0)
    : totalUsdCents;

  return <>{formatCatalogPrice(displayTotal, currency)}</>;
}
