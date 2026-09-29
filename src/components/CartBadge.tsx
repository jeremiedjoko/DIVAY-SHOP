"use client";

import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCart((state) => state.itemCount());

  // On attend que le composant soit monté pour éviter les erreurs d'hydratation (Next.js vs LocalStorage)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || itemCount === 0) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#8b5a4b] text-[9px] font-bold text-white">
      {itemCount}
    </span>
  );
}
