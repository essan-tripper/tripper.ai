import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";

const MerchSection = dynamic(() => import("@/components/MerchSection"), {
  loading: () => <div className="h-[80vh] min-h-[600px] max-h-[900px] md:h-[85vh] bg-[#0a0a0a]" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-96 bg-[#1a1c1c]" />,
});

export default function Home() {
  return (
    <>
      <link rel="preload" href="/videos/desktop.mp4" as="video" type="video/mp4" />
      <main className="min-h-screen overflow-x-hidden">
        <HeroSection />
        <DestinationsSection />
        <MerchSection />
        <Footer />
      </main>
    </>
  );
}