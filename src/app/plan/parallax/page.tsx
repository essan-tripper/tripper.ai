import type { Metadata } from "next";
import PlanParallaxView from "./PlanParallaxView";

export const metadata: Metadata = {
  title: "Parallax — How We Plan a Trip",
  description:
    "A scroll-driven story through the Char Dham Yatra, with sticky images and fading day cards.",
  openGraph: {
    title: "Parallax — How We Plan a Trip | Tripper by Essan",
    description:
      "Scroll through the Char Dham Yatra with parallax storytelling.",
  },
};

export default function ParallaxPage() {
  return <PlanParallaxView />;
}
