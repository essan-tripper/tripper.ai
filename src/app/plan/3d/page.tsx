import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Globe — How We Plan a Trip",
  description: "Explore the Char Dham Yatra on an interactive 3D globe with destination markers and camera fly-to.",
  openGraph: {
    title: "3D Globe — How We Plan a Trip | Tripper by Essan",
    description: "Explore the Char Dham Yatra on an interactive 3D globe.",
  },
};

export default function GlobePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 flex items-center justify-center">
      <p className="text-white/40 text-lg">3D Globe View — Coming Soon</p>
    </main>
  );
}
