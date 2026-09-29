import { create } from "zustand";

interface CurrencyState {
  currency: "USD" | "FC";
  setCurrency: (c: "USD" | "FC") => void;
}

export const useCurrency = create<CurrencyState>((set) => ({
  currency: "USD",
  setCurrency: (currency) => set({ currency }),
}));
