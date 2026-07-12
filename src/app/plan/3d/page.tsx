import type { Metadata } from "next";
import { CtaPlaceholder } from "@/lib/plan/cta-placeholder";
import DynamicGlobe from "./DynamicGlobe";

export const metadata: Metadata = {
  title: "3D Globe — How We Plan a Trip",
  description:
    "Explore the Char Dham Yatra on an interactive 3D globe with destination markers and camera fly-to.",
  openGraph: {
    title: "3D Globe — How We Plan a Trip | Tripper by Essan",
    description: "Explore the Char Dham Yatra on an interactive 3D globe.",
  },
};

export default function GlobePage() {
  return (
    <>
      <DynamicGlobe />
      <CtaPlaceholder />
    </>
  );
}
