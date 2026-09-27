"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceUsdCents: product.priceUsdCents,
      image: product.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        compact
          ? "rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800"
          : "w-full rounded-full bg-[#c0476b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9e3457]"
      }
    >
      {added ? "Ajouté ✓" : "Ajouter"}
    </button>
  );
}
