import { z } from "zod";
import { INDIAN_STATES } from "./india-geo";

export const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(2, "City is required").max(100).regex(/^[A-Za-z\s]+$/, "City must contain only letters and spaces"),
  state: z.enum(INDIAN_STATES, { message: "Select a valid state" }),
  pincode: z.string().min(6, "Valid pincode is required"),
  country: z.literal("India"),
  isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;
