"use client";

export function Price({ priceUsdCents }: { priceUsdCents: number }) {
  // Convertit les centimes en valeur réelle et formate en devise
  const formattedPrice = (priceUsdCents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "USD",
  });

  return <span>{formattedPrice}</span>;
}
