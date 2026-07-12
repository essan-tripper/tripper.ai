import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Itinerary — How We Plan a Trip",
  description: "Browse the Char Dham Yatra day by day with photos, highlights, and detailed descriptions.",
  openGraph: {
    title: "Interactive Itinerary — How We Plan a Trip | Tripper by Essan",
    description: "Browse the Char Dham Yatra day by day with photos and highlights.",
  },
};

export default function ItineraryPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 flex items-center justify-center">
      <p className="text-white/40 text-lg">Interactive Itinerary View — Coming Soon</p>
    </main>
  );
}
