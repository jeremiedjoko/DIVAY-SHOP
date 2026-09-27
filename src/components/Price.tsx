"use client";

import { formatCatalogPrice } from "@/lib/currency";
import { useCurrency } from "@/store/currency";

export function Price({ priceUsdCents }: { priceUsdCents: number }) {
  const currency = useCurrency((s) => s.currency);
  return <>{formatCatalogPrice(priceUsdCents, currency)}</>;
}
