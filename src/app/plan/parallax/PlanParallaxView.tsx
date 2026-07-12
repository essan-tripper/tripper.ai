"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { charDhamYatra } from "@/data/itineraries";
import type { ItineraryDay } from "@/data/itineraries";

const cinzel = { fontFamily: "var(--font-cinzel), Georgia, serif" };
const playfair = { fontFamily: "var(--font-playfair), Georgia, serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

export default function PlanParallaxView() {
  const days = charDhamYatra.days;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={pageRef} className="relative bg-[#0a0a0a]">
      <div className="fixed left-0 top-0 bottom-0 w-0.5 bg-white/5 z-50" />
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-0.5 bg-[#f48b29] z-50 origin-top"
        style={{ scaleY: progressScaleY }}
      />

      <HeroSection reduceMotion={reduceMotion} />

      {days.map((day, i) => (
        <DaySection
          key={day.dayNumber}
          day={day}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}

      <OutroSection reduceMotion={reduceMotion} />
    </div>
  );
}

function HeroSection({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={
          reduceMotion ? { y: 0, scale: 1 } : { y, scale }
        }
      >
        <Image
          src={charDhamYatra.coverImage}
          alt={charDhamYatra.title}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>
      <motion.div
        className="relative z-10 text-center px-4 max-w-3xl"
        style={reduceMotion ? { opacity: 1 } : { opacity }}
      >
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-wide"
          style={cinzel}
        >
          {charDhamYatra.title}
        </h1>
        <p
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          style={inter}
        >
          {charDhamYatra.summary}
        </p>
        <div className="mt-12">
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function DaySection({
  day,
  index,
  reduceMotion,
}: {
  day: ItineraryDay;
  index: number;
  reduceMotion: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85],
    [0, 1, 1, 0],
  );
  const cardY = useTransform(scrollYProgress, [0, 0.15, 0.5], [60, 0, 0]);

  const isLeft = index % 2 === 0;
  const bgClass = index % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0e0e0e]";

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen ${bgClass} flex items-center overflow-hidden`}
    >
      <div className="relative w-full px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${
            isLeft ? "md:flex-row" : "md:flex-row-reverse"
          } items-center gap-8 md:gap-12`}
        >
          <motion.div
            className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-[3/2] rounded-xl overflow-hidden"
            style={
              reduceMotion
                ? { scale: 1, y: 0 }
                : { scale: imageScale, y: imageY }
            }
          >
            <Image
              src={day.heroImage}
              alt={day.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            style={
              reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: cardOpacity, y: cardY }
            }
          >
            <div className="bg-[#1a1c1c]/90 backdrop-blur-xl rounded-xl p-8 border border-white/5">
              <div
                className="text-[#f48b29] text-sm font-bold tracking-widest mb-2"
                style={inter}
              >
                DAY {day.dayNumber}
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                style={playfair}
              >
                {day.title}
              </h2>
              <p className="text-white/50 text-sm mb-4" style={inter}>
                {day.location}
              </p>
              <p className="text-white/70 leading-relaxed mb-6" style={inter}>
                {day.description}
              </p>
              <ul className="space-y-2">
                {day.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f48b29] mt-2 shrink-0" />
                    <span style={inter}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OutroSection({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      <motion.div
        className="text-center px-4 max-w-2xl"
        style={
          reduceMotion ? { opacity: 1, y: 0 } : { opacity, y }
        }
      >
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          style={cinzel}
        >
          The Journey Awaits
        </h2>
        <p className="text-lg text-white/60 leading-relaxed mb-8" style={inter}>
          From the ghats of Haridwar to the heights of Kedarnath, every step of
          the Char Dham Yatra is a story waiting to be told. Let us help you
          plan your pilgrimage.
        </p>
        <p className="text-white/40 italic" style={playfair}>
          &ldquo;The mountains are calling, and I must go.&rdquo;
        </p>
      </motion.div>
    </section>
  );
}
