import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PlanThreeDView = dynamic(() => import("./PlanThreeDView"), { ssr: false });

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
  return <PlanThreeDView />;
}
