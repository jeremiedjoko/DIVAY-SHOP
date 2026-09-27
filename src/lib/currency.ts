export type ShopCurrency = "USD" | "CDF";

export const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME ?? "DIVAY BEAUTY";

export function getUsdToCdfRate(): number {
  const raw = process.env.NEXT_PUBLIC_USD_TO_CDF;
  const rate = raw ? Number(raw) : 2850;
  return Number.isFinite(rate) && rate > 0 ? rate : 2850;
}

/** Prix catalogue stocké en centimes USD */
export function usdCentsToMinor(centsUsd: number, currency: ShopCurrency): number {
  if (currency === "USD") return centsUsd;
  const dollars = centsUsd / 100;
  const francs = dollars * getUsdToCdfRate();
  return Math.round(francs * 100);
}

export function formatMoney(minorUnits: number, currency: ShopCurrency): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(minorUnits / 100);
  }
  return new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "CDF",
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}

/** Affichage à partir du prix catalogue (centimes USD) */
export function formatCatalogPrice(priceUsdCents: number, currency: ShopCurrency): string {
  return formatMoney(usdCentsToMinor(priceUsdCents, currency), currency);
}

export function stripeCurrencyCode(currency: ShopCurrency): "usd" | "cdf" {
  return currency === "USD" ? "usd" : "cdf";
}
