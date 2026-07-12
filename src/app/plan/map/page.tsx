import type { Metadata } from "next";
import PlanMapView from "./PlanMapView";

export const metadata: Metadata = {
  title: "SVG Map — How We Plan a Trip",
  description: "An interactive SVG map of India with an animated route polyline through the Char Dham stops.",
  openGraph: {
    title: "SVG Map — How We Plan a Trip | Tripper by Essan",
    description: "Watch the Char Dham route draw across India.",
  },
};

export default function MapPage() {
  return <PlanMapView />;
}
