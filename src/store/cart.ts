"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceUsdCents: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  checkoutSession: CartItem[] | null; // NOUVEAU: Pour commander 1 seul article
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeMultipleItems: (productIds: string[]) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setCheckoutSession: (items: CartItem[] | null) => void;
  clear: () => void;
  totalUsdCents: () => number;
  itemCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutSession: null,
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      removeMultipleItems: (productIds) =>
        set((state) => ({ items: state.items.filter((i) => !productIds.includes(i.productId)) })),
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      setCheckoutSession: (items) => set({ checkoutSession: items }),
      clear: () => set({ items: [], checkoutSession: null }),
      totalUsdCents: () =>
        get().items.reduce((sum, i) => sum + i.priceUsdCents * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "divay-cart" },
  ),
);
