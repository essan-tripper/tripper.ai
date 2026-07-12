import { z } from "zod";

export const planInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits").optional(),
  message: z.string().min(10, "Please share a bit about your trip"),
});

export type PlanInquiry = z.infer<typeof planInquirySchema>;
