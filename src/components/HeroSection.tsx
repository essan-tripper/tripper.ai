"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingLink from "@/components/LoadingLink";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const isInView = useInView(ref, { margin: "0px 0px -200px 0px" });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  const scrollToDestinations = () => {
    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src={isMobile ? "/videos/mobile.mp4" : "/videos/desktop.mp4"}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c1c]/60 via-[#1a1c1c]/40 to-[#1a1c1c]" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 sm:mb-6"
        >
          <a
            href="https://www.instagram.com/tripper.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f48b29]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Follow the journey on insta
          </a>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl text-white max-w-5xl leading-[0.95] tracking-[-0.02em] mb-4 sm:mb-6 lg:mb-8"
          style={{ fontFamily: "var(--font-instrument-serif), serif" }}
        >
          Indian Pilgrimages{" "}
          <span className="text-[#f48b29]">Reimagined</span>
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-base md:text-xl text-white/80 max-w-xl md:max-w-2xl leading-relaxed mb-6 sm:mb-8 md:mb-12 px-4"
        >
          We turn journeys into stories and sacred places into maps
          you can explore, experience, and carry with you on every trip
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <LoadingLink href="/merch">
          <Button
            size="lg"
            className="bg-[#f48b29] hover:bg-[#924c00] text-white rounded-xl px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg font-medium shadow-[0_8px_30px_rgba(244,139,41,0.4)] hover:shadow-[0_12px_40px_rgba(244,139,41,0.5)] transition-all duration-300 group w-full sm:w-auto hover:cursor-pointer"
          >
            Explore Merch
            <motion.span
              className="ml-2 inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.span>
          </Button>
          </LoadingLink>
          <LoadingLink href="/course">
          <Button
            size="lg"
            variant="outline"
            className="border-[#f48b29]/50 text-[#f48b29] hover:bg-[#f48b29]/10 rounded-xl px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg font-medium backdrop-blur-md w-full sm:w-auto"
          >
            <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Become Tripper 
          </Button>
          </LoadingLink>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToDestinations}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={28} className="sm:w-8 sm:h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
