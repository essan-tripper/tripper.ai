"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "lucide-react";
import GlobeScene from "./GlobeScene";
import { charDhamYatra } from "@/data/itineraries";

export default function PlanThreeDView() {
  const [isMobile, setIsMobile] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (isMobile) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white/60 flex items-center justify-center p-8 pt-24">
        <div className="text-center max-w-md">
          <Globe className="w-16 h-16 mx-auto mb-4 text-[#f48b29]" />
          <h2 className="text-xl font-playfair mb-2">3D Globe</h2>
          <p>
            The 3D globe view is best experienced on a larger screen. Visit on
            a desktop or tablet to explore.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-16">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <GlobeScene days={charDhamYatra.days} reducedMotion={reducedMotion} />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </main>
  );
}
