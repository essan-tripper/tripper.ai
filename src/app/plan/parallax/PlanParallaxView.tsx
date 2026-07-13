"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useInView,
} from "framer-motion";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { charDhamYatra } from "@/data/itineraries";
import type { ItineraryDay } from "@/data/itineraries";

const cinzel = { fontFamily: "var(--font-cinzel), Georgia, serif" };
const playfair = { fontFamily: "var(--font-playfair), Georgia, serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

const DharmachakraCanvas = dynamic(() => import("./DharmachakraCanvas"), { ssr: false });

export default function PlanParallaxView() {
  const days = charDhamYatra.days;
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Desktop scroll-snap implementation
  // FIX: removed `scroll-behavior: smooth`. Native smooth-scroll fights with
  // Framer Motion's scroll-linked transforms (both try to drive scroll position /
  // read scroll offset every frame), which is a classic source of stutter.
  // Snap-proximity alone is enough to give the "settling" feel without the conflict.
  useEffect(() => {
    if (reduceMotion) return;

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      const html = document.documentElement;
      if (isDesktop) {
        html.style.scrollSnapType = "y proximity";
      } else {
        html.style.scrollSnapType = "";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.documentElement.style.scrollSnapType = "";
    };
  }, [reduceMotion]);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleDayActive = useCallback((index: number) => {
    setActiveDayIndex(index);
  }, []);

  const scrollToDay = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div ref={pageRef} className="relative bg-[#0a0a0a] overflow-hidden text-white/90">
      {/* Fixed progress bar on left */}
      <div className="fixed left-0 top-0 bottom-0 w-0.5 bg-white/5 z-50" />
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-0.5 bg-[#f48b29] z-50 origin-top"
        style={{ scaleY: progressScaleY }}
      />

      {/* Journey Minimap (Tier 2/3) */}
      {!reduceMotion && (
        <JourneyMinimap
          days={days}
          activeIndex={activeDayIndex}
          onDayClick={scrollToDay}
        />
      )}

      {/* Hero Section with layered depth and 3D WebGL Element */}
      <HeroSection reduceMotion={reduceMotion} mounted={mounted} />

      {/* Center winding travel trail */}
      {!reduceMotion && <TravelTrail scrollYProgress={scrollYProgress} />}

      {/* Day by Day Sections */}
      <div className="relative z-10">
        {days.map((day, i) => (
          <DaySection
            key={day.dayNumber}
            day={day}
            index={i}
            reduceMotion={reduceMotion}
            onDayActive={handleDayActive}
            setSectionEl={(el) => {
              sectionRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* Outro Section */}
      <OutroSection reduceMotion={reduceMotion} />
    </div>
  );
}

// ── Journey Minimap with Rich Preview Tooltips ──
function JourneyMinimap({
  days,
  activeIndex,
  onDayClick,
}: {
  days: ItineraryDay[];
  activeIndex: number;
  onDayClick: (index: number) => void;
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center">
      <div className="absolute top-1 bottom-1 w-px bg-white/10" />

      {days.map((day, i) => {
        const isCompleted = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <button
            key={day.dayNumber}
            onClick={() => onDayClick(i)}
            className="relative z-10 group p-2.5"
            aria-label={`Go to day ${day.dayNumber}: ${day.title}`}
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full border transition-all duration-300",
                isActive &&
                  "border-[#f48b29] bg-[#f48b29] scale-125 shadow-[0_0_12px_rgba(244,139,41,0.6)]",
                isCompleted &&
                  !isActive &&
                  "border-[#f48b29]/40 bg-[#f48b29]/30",
                !isActive &&
                  !isCompleted &&
                  "border-white/30 bg-transparent hover:border-[#f48b29]/50"
              )}
            />

            {/* Rich Hover Preview Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 p-2.5 bg-[#151616]/95 border border-white/10 rounded-lg shadow-2xl flex flex-col gap-2 w-44 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none backdrop-blur-md">
              <div className="relative w-full h-24 rounded overflow-hidden">
                {/* FIX: removed `unoptimized`. If these are remote images, add the
                    domain to next.config.js `images.remotePatterns` instead of
                    bypassing optimization — unoptimized ships full-res source files
                    regardless of this thumbnail's actual display size. */}
                <Image
                  src={day.heroImage}
                  alt={day.title}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-[#f48b29] font-bold tracking-wider uppercase">
                  Day {day.dayNumber}
                </span>
                <h4 className="text-white text-xs font-bold truncate">
                  {day.title}
                </h4>
                <p className="text-zinc-500 text-[10px] truncate">
                  📍 {day.location}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Center winding travel trail component ──
function TravelTrail({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-0 hidden md:block opacity-30 pt-[100vh] pb-[100vh]">
      <svg
        className="w-full h-full text-[#f48b29]/20"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M 50,0 C 20,100 80,200 50,300 C 20,400 80,500 50,600 C 20,700 80,800 50,900 C 20,950 80,980 50,1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <motion.path
          d="M 50,0 C 20,100 80,200 50,300 C 20,400 80,500 50,600 C 20,700 80,800 50,900 C 20,950 80,980 50,1000"
          fill="none"
          stroke="#f48b29"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
    </div>
  );
}

// ── Layered cinematic Hero section with 3D WebGL background ──
function HeroSection({ reduceMotion, mounted }: { reduceMotion: boolean; mounted: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // FIX: only run the WebGL canvas while the hero is actually visible. Previously
  // it kept rendering every frame for the whole session, which is continuous GPU
  // work stacked on top of the scroll-linked transforms below.
  const isHeroInView = useInView(ref, { amount: 0.1 });

  const yStar = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yMountain = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const yCover = useTransform(scrollYProgress, [0, 1], [60, 280]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black lg:snap-center"
    >
      {/* Layer 1: Stars Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-60"
        style={reduceMotion ? {} : { y: yStar }}
      />

      {/* Layer 2: Mountain Outlines SVG */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 z-10 text-[#f48b29]/5 pointer-events-none"
        style={reduceMotion ? {} : { y: yMountain }}
      >
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full fill-none stroke-current"
          strokeWidth="1"
          preserveAspectRatio="none"
        >
          <path d="M 0,220 L 200,160 L 400,280 L 700,120 L 950,220 L 1200,140 L 1440,240 L 1440,320 L 0,320 Z" />
          <path
            d="M 0,260 L 300,200 L 600,290 L 850,180 L 1100,270 L 1440,190"
            strokeDasharray="6 6"
          />
        </svg>
      </motion.div>

      {/* Layer 3: Cover Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduceMotion ? { y: 0, scale: 1 } : { y: yCover, scale }}
      >
        {/* FIX: removed `unoptimized`, added `sizes` (full viewport width here since
            it's a hero background) and `priority` stays since it's above the fold. */}
        <Image
          src={charDhamYatra.coverImage}
          alt={charDhamYatra.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]" />
      </motion.div>

      {/* WebGL 3D rotating Dharmachakra wireframe background — now paused/unmounted off-screen */}
      {mounted && !reduceMotion && isHeroInView && <DharmachakraCanvas />}

      {/* Layer 4: Floating Title Content */}
      <motion.div
        className="relative z-20 text-center px-4 max-w-4xl"
        style={reduceMotion ? { opacity: 1, y: 0 } : { opacity, y: yText }}
      >
        <span
          className="text-[#f48b29] text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold mb-4 block"
          style={cinzel}
        >
          Sacred Pilgrimage Journey
        </span>
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight leading-[0.95]"
          style={{ fontFamily: "var(--font-instrument-serif), serif" }}
        >
          Char Dham <span className="text-[#f48b29]">Yatra</span>
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          style={inter}
        >
          {charDhamYatra.summary}
        </p>

        {/* Floating scroll indicator */}
        <div className="mt-16">
          <motion.div
            className="w-6 h-10 border-2 border-white/20 rounded-full mx-auto flex justify-center"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-3 bg-[#f48b29] rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Day Section with all Tier-1 + Tier-2/3 features ──
function DaySection({
  day,
  index,
  reduceMotion,
  onDayActive,
  setSectionEl,
}: {
  day: ItineraryDay;
  index: number;
  reduceMotion: boolean;
  onDayActive: (index: number) => void;
  setSectionEl: (el: HTMLDivElement | null) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSectionEl(sectionRef.current);
    return () => setSectionEl(null);
  }, [setSectionEl]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Viewport detection for active day minimap tracking
  const isInView = useInView(sectionRef, { amount: 0.5, once: false });

  useEffect(() => {
    if (isInView) onDayActive(index);
  }, [isInView, index, onDayActive]);

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.08, 1.0, 1.08]
  );
  const imageY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const cardY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [120, 0, 0, -120]
  );
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0]
  );
  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.95, 1, 1, 0.95]
  );

  const isLeft = index % 2 === 0;
  const textX = useTransform(
    scrollYProgress,
    [0, 1],
    isLeft ? [180, -180] : [-180, 180]
  );

  const bgClass = index % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0c0c0c]";

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen ${bgClass} flex items-center overflow-hidden border-b border-white/5 py-12 md:py-0 lg:snap-center`}
    >
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0 z-0 h-[120%] -top-[10%] w-full"
        style={reduceMotion ? { scale: 1, y: 0 } : { scale: imageScale, y: imageY }}
      >
        {/* FIX: removed `unoptimized`, added `sizes` for viewport-width hero images. */}
        <Image
          src={day.heroImage}
          alt={day.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Background Large Outline Marquee */}
      {!reduceMotion && (
        <motion.div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[9vw] font-black tracking-[0.2em] text-transparent select-none pointer-events-none z-0 whitespace-nowrap opacity-[0.02]"
          style={{
            x: textX,
            fontFamily: "var(--font-cinzel)",
            WebkitTextStroke: "1px rgba(244,139,41,0.5)",
          }}
        >
          DAY {day.dayNumber} · {day.title.toUpperCase()}
        </motion.div>
      )}

      <div className="relative w-full px-6 md:px-12 lg:px-24 max-w-7xl mx-auto z-30">
        <div className="flex items-center min-h-screen">
          <motion.div
            className={cn(
              "w-full md:w-1/2",
              isLeft ? "mr-auto" : "ml-auto"
            )}
            style={
              reduceMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: cardOpacity, y: cardY, scale: cardScale }
            }
          >
            {/* FIX: backdrop-blur is one of the most expensive CSS properties to
                composite because the browser has to resample everything behind it
                every frame. Here it was on a card that's also animating
                transform/opacity every frame during entrance/exit — the two
                combined were compounding cost.
                Now: blur only turns on once the card has settled into view
                (isInView), when cardY/scale aren't actively changing. While the
                card is transforming in/out, it falls back to a solid translucent
                background that looks close enough and costs nothing extra. */}
            <div
              className={cn(
                "rounded-xl p-8 md:p-10 border border-white/5 shadow-2xl hover:border-[#f48b29]/30 transition-all duration-500",
                isInView
                  ? "bg-[#151616]/80 backdrop-blur-xl"
                  : "bg-[#151616]/95"
              )}
            >
              <div
                className="text-[#f48b29] text-xs font-bold tracking-[0.25em] uppercase mb-3 block"
                style={inter}
              >
                Day {day.dayNumber} · Journey Stop
              </div>

              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide"
                style={playfair}
              >
                {day.title}
              </h2>

              <p
                className="text-zinc-500 text-sm mb-6 font-medium"
                style={inter}
              >
                📍 {day.location}
              </p>
              <p
                className="text-zinc-300 leading-relaxed mb-8 text-base md:text-lg"
                style={inter}
              >
                {day.description}
              </p>

              <div className="border-t border-white/5 pt-6">
                <span className="text-xs uppercase tracking-widest text-[#f48b29] font-semibold block mb-4">
                  Highlights
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {day.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-zinc-400 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f48b29] mt-2 shrink-0 shadow-[0_0_8px_#f48b29]" />
                      <span style={inter}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Cinematic Outro Section ──
function OutroSection({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [60, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden border-t border-white/5 lg:snap-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />

      {!reduceMotion && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 z-20">
          <div className="w-3 h-3 bg-[#f48b29] rounded-full animate-ping absolute inset-0 opacity-75" />
          <div className="w-3 h-3 bg-[#f48b29] rounded-full relative z-10 border-2 border-black" />
        </div>
      )}

      <motion.div
        className="text-center px-6 max-w-3xl relative z-10"
        style={reduceMotion ? { opacity: 1, y: 0 } : { opacity, y }}
      >
        <span
          className="text-[#f48b29] text-xs tracking-[0.3em] uppercase font-bold block mb-4"
          style={cinzel}
        >
          The Journey Culminates
        </span>
        <h2
          className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-wide leading-tight"
          style={cinzel}
        >
          The Journey Awaits
        </h2>
        <p
          className="text-base md:text-lg text-zinc-400 leading-relaxed mb-10"
          style={inter}
        >
          From the sacred ghats of Haridwar to the heights of Kedarnath and
          Badrinath, every stop of the Char Dham Yatra is a story waiting to be
          told. Let us help you craft a custom experience that lives in your
          memory forever.
        </p>

        <div className="relative inline-block px-8 py-4 bg-zinc-900/40 backdrop-blur-md rounded-xl border border-white/5">
          <p
            className="text-white/80 italic text-lg sm:text-xl font-medium tracking-wide"
            style={playfair}
          >
            &ldquo;The mountains are calling, and I must go.&rdquo;
          </p>
          <span className="text-[#f48b29] text-xs uppercase tracking-widest font-semibold block mt-2 text-right">
            — John Muir
          </span>
        </div>
      </motion.div>
    </section>
  );
}