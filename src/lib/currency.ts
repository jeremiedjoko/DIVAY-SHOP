export function formatMoney(priceUsdCents: number): string {
  return (priceUsdCents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "USD",
  });
}
