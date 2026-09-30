"use client";

import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/store/wishlist";

export function WishlistButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const has = useWishlist((s) => s.items.some((i) => i.productId === product.id));
  const toggle = useWishlist((s) => s.toggle);

  return (
    <button
      type="button"
      aria-pressed={has}
      aria-label={has ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          image: product.image,
        });
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm transition hover:border-[#c0476b] ${className} ${
        has ? "border-[#c0476b] text-[#c0476b]" : "border-[#f0dde6] text-stone-500"
      }`}
    >
      <Heart className={`h-4 w-4 ${has ? "fill-[#c0476b]" : ""}`} />
    </button>
  );
}
