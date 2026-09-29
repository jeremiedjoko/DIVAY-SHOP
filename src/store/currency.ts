import { create } from "zustand";
import type { ShopCurrency } from "@/lib/currency";

interface CurrencyState {
  currency: ShopCurrency;
  setCurrency: (c: ShopCurrency) => void;
}

export const useCurrency = create<CurrencyState>((set) => ({
  currency: "CDF",
  setCurrency: (currency) => set({ currency }),
}));
