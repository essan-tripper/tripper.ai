"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartItemSchema, type CartItem, type AddToCartInput } from "./validation/cart";

type CartState = {
  items: CartItem[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (input) => {
        const parsed = cartItemSchema.parse(input);
        set((state) => {
          const existing = state.items.find((item) => item.id === parsed.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === parsed.id
                  ? { ...item, quantity: item.quantity + parsed.quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, parsed] };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: "tripper-cart" }
  )
);
