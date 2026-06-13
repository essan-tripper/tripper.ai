import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.string(),
  productType: z.enum(["magnet", "poster"]),
  label: z.string().min(1),
  image: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive().default(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const addToCartInputSchema = z.object({
  id: z.string(),
  productType: z.enum(["magnet", "poster"]),
  label: z.string().min(1),
  image: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive().default(1),
});

export type AddToCartInput = z.infer<typeof addToCartInputSchema>;
