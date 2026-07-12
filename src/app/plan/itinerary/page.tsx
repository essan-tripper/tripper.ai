import type { Metadata } from "next";
import PlanItineraryView from "./PlanItineraryView";
import { CtaPlaceholder } from "@/lib/plan/cta-placeholder";

export const metadata: Metadata = {
  title: "Interactive Itinerary — How We Plan a Trip",
  description: "Browse the Char Dham Yatra day by day with photos, highlights, and detailed descriptions.",
  openGraph: {
    title: "Interactive Itinerary — How We Plan a Trip | Tripper by Essan",
    description: "Day-by-day breakdown of the Char Dham Yatra itinerary.",
  },
};

export default function ItineraryPage() {
  return (
    <>
      <PlanItineraryView />
      <CtaPlaceholder />
    </>
  );
}
