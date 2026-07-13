"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { jyotirlingas } from "@/data/jyotirlingas";
import { polyline, dotPositions } from "@/lib/polyline";
import { IndiaMap } from "./IndiaMap";
import { CtaPlaceholder } from "./CtaPlaceholder";

export default function TravelJyotirlingasPage() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const pinX = useMotionValue(0);
  const pinY = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Scroll driver
  useEffect(() => {
    return scrollYProgress.on("change", (t) => {
      if (reducedMotion) {
        const idx = Math.round(t * (dotPositions.length - 1));
        const snapped = dotPositions[idx];
        if (snapped) {
          pinX.set(snapped.x);
          pinY.set(snapped.y);
        }
        return;
      }
      const idx = t * (polyline.length - 1);
      const i = Math.floor(idx);
      const frac = idx - i;
      const p1 = polyline[i];
      const p2 = polyline[Math.min(polyline.length - 1, i + 1)];
      if (p1 && p2) {
        pinX.set(p1.x + (p2.x - p1.x) * frac);
        pinY.set(p1.y + (p2.y - p1.y) * frac);
      }
    });
  }, [scrollYProgress, pinX, pinY, reducedMotion]);

  // Active dot detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    jyotirlingas.forEach((_, i) => {
      const el = sectionRefs.current[i];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(i);
          }
        },
        { threshold: [0, 0.5, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Tap-to-jump
  function jumpToSection(index: number) {
    const targetY = index * window.innerHeight;
    window.scrollTo({
      top: targetY,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <>
      {/* Fixed background map */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8">
        <div className="w-full h-full max-w-[85vh] max-h-[85vh] aspect-square flex items-center justify-center">
          <IndiaMap
            pinX={pinX}
            pinY={pinY}
            activeIndex={activeIndex}
            onDotClick={jumpToSection}
          />
        </div>
      </div>

      {/* Foreground sections */}
      <main className="relative z-10">
        {jyotirlingas.map((j, i) => {
          const isLeft = i % 2 === 0;
          return (
            <section
              key={j.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className="min-h-screen flex items-center px-6 md:px-16"
            >
              <div
                className={cn(
                  "w-full md:w-1/2 bg-black/60 backdrop-blur-md p-8 md:p-10 rounded-lg border border-white/5",
                  isLeft ? "mr-auto" : "ml-auto"
                )}
              >
                <p className="text-xs md:text-sm uppercase tracking-widest text-[#f48b29]">
                  Stop {j.id} of 12 · {j.location}, {j.state}
                </p>
                <h2
                  className="mt-2 text-3xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  {j.name}
                </h2>
                <p
                  className="mt-4 text-base md:text-lg text-zinc-300 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {j.copy}
                </p>
                {/* TODO(founder): replace with curated copy */}
              </div>
            </section>
          );
        })}
        <CtaPlaceholder />
      </main>
    </>
  );
}
