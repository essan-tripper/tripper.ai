import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Map — How We Plan a Trip",
  description: "An interactive SVG map of India with an animated route polyline through the Char Dham stops.",
  openGraph: {
    title: "SVG Map — How We Plan a Trip | Tripper by Essan",
    description: "Watch the Char Dham route draw across an interactive SVG map.",
  },
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 flex items-center justify-center">
      <p className="text-white/40 text-lg">SVG Map View — Coming Soon</p>
    </main>
  );
}
