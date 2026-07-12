import type { Metadata } from "next";
import PlanHub from "./PlanHub";

export const metadata: Metadata = {
  title: "How We Plan a Trip",
  description: "See how Tripper plans a custom pilgrimage — four ways to explore the journey, from a scrollable story to a 3D globe.",
  openGraph: {
    title: "How We Plan a Trip | Tripper by Essan",
    description: "Four ways to explore a custom Tripper itinerary.",
  },
};

export default function PlanPage() {
  return <PlanHub />;
}
