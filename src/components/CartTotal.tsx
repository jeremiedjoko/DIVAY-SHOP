"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { Price } from "@/components/Price";

export function CartTotal() {
  const [mounted, setMounted] = useState(false);
  const total = useCart((s) => s.totalUsdCents());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Empêche les erreurs d'hydratation entre le serveur et le localStorage
  if (!mounted) return <span className="opacity-0">0</span>;

  return <Price priceUsdCents={total} />;
}
