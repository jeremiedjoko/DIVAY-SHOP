"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export function CartTotal() {
  const [mounted, setMounted] = useState(false);
  const total = useCart((s) => s.totalCents());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <span className="opacity-0">0</span>;

  // Affiche le total en francs congolais (FC)
  return <span>{(total / 100).toLocaleString("fr-FR")} FC</span>;
}
