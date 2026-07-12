import { z } from "zod";

export const itineraryDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  coords: z.object({ lat: z.number(), lng: z.number() }),
  description: z.string().min(1),
  heroImage: z.string().url(),
  highlights: z.array(z.string().min(1)).min(1),
});

export const itinerarySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  durationDays: z.number().int().min(1),
  coverImage: z.string().url(),
  summary: z.string().min(1),
  days: z.array(itineraryDaySchema).min(1),
});

export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
