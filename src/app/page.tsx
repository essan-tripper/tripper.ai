import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";

export const metadata: Metadata = {
  title: "Tripper by Essan",
  description:
    "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations. Premium pilgrimage magnets, posters, and travel resources.",
  openGraph: {
    title: "Tripper by Essan — Spiritual Journeys in India",
    description:
      "Discover the divine path to Kedarnath, Char Dham, and India's most sacred spiritual destinations.",
    url: "https://tripperbyessan.com",
  },
};

const MerchSection = dynamic(() => import("@/components/MerchSection"), {
  loading: () => <div className="h-[80vh] min-h-[600px] max-h-[900px] md:h-[85vh] bg-[#0a0a0a]" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-96 bg-[#1a1c1c]" />,
});

export default function Home() {
  return (
    <>
      <link rel="preload" href="https://res.cloudinary.com/dbciv3dc2/video/upload/v1783888533/desktop_i1xgyw.mp4" as="video" type="video/mp4" />
      <main className="min-h-screen overflow-x-hidden">
        <HeroSection />
        <DestinationsSection />
        <MerchSection />
        <Footer />
      </main>
    </>
  );
}