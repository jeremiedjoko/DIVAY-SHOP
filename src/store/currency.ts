"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopCurrency } from "@/lib/currency";

type CurrencyState = {
  currency: ShopCurrency;
  setCurrency: (currency: ShopCurrency) => void;
};

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "divay-currency" },
  ),
);
