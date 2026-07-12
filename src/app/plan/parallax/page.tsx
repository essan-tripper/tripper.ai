import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parallax — How We Plan a Trip",
  description: "A scroll-driven story through the Char Dham Yatra, with sticky images and fading day cards.",
  openGraph: {
    title: "Parallax — How We Plan a Trip | Tripper by Essan",
    description: "Scroll through the Char Dham Yatra with parallax storytelling.",
  },
};

export default function ParallaxPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 flex items-center justify-center">
      <p className="text-white/40 text-lg">Parallax View — Coming Soon</p>
    </main>
  );
}
