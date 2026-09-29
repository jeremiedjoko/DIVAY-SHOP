export type ShopCurrency = "USD" | "CDF" | "FC";

export function formatMoney(amountCents: number, _currency?: ShopCurrency): string {
  // Affiche toujours en Francs Congolais
  return `${Math.round(amountCents / 100).toLocaleString("fr-FR")} FC`;
}
