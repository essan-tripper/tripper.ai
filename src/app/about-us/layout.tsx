import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We are storytellers, travelers, and seekers — sharing India's sacred journeys. Founded by Essan, documenting pilgrimages, creating merchandise, and building a community around spiritual travel.",
  openGraph: {
    title: "About Us | Tripper by Essan",
    description: "We are storytellers, travelers, and seekers sharing India's sacred journeys.",
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
