"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { charDhamYatra } from "@/data/itineraries";
import type { ItineraryDay } from "@/data/itineraries";
import IndiaOutline from "./IndiaOutline";

function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const svgW = 1000;
  const svgH = 1000;
  const x = ((lng - 68) / (97 - 68)) * svgW;
  const y = svgH - ((lat - 8) / (37 - 8)) * svgH;
  return { x, y };
}

function buildRoutePath(days: ItineraryDay[]): string {
  return days
    .map((day, i) => {
      const { x, y } = projectCoords(day.coords.lat, day.coords.lng);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function PlanMapView() {
  const days = charDhamYatra.days;
  const [selectedDay, setSelectedDay] = useState<ItineraryDay>(days[0]);

  const routePath = buildRoutePath(days);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white/90 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8">
          <span
            className="text-[#f48b29] text-xs tracking-[0.25em] uppercase font-medium block text-center md:text-left"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Interactive Map
          </span>
          <h1
            className="mt-2 text-3xl md:text-4xl font-bold text-white text-center md:text-left"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            {charDhamYatra.title}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* SVG Map */}
          <div className="flex-1 bg-[#1a1c1c] rounded-xl p-4 md:p-6 aspect-square md:aspect-auto">
            <svg viewBox="0 0 1000 1000" className="w-full h-auto">
              <IndiaOutline className="text-[#f48b29] opacity-30 w-full h-auto" />

              {/* Route line glow */}
              <motion.path
                d={routePath}
                stroke="#f48b29"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="opacity-20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />

              {/* Route line */}
              <motion.path
                d={routePath}
                stroke="#f48b29"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />

              {/* Day markers */}
              {days.map((day, i) => {
                const { x, y } = projectCoords(day.coords.lat, day.coords.lng);
                const isActive = selectedDay.dayNumber === day.dayNumber;
                return (
                  <g
                    key={day.dayNumber}
                    onClick={() => setSelectedDay(day)}
                    className="cursor-pointer"
                  >
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={isActive ? 14 : 10}
                      fill={isActive ? "#f48b29" : "#1a1c1c"}
                      stroke={isActive ? "#f48b29" : "rgba(244,139,41,0.6)"}
                      strokeWidth={isActive ? 3 : 2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 3 + i * 0.12, duration: 0.3, ease: "backOut" }}
                      whileHover={{ scale: 1.3 }}
                    />
                    <motion.text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dy="0.35em"
                      fill={isActive ? "#0a0a0a" : "#ffffff"}
                      fontSize="11"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.2 + i * 0.12, duration: 0.2 }}
                      style={{ fontFamily: "var(--font-inter)", pointerEvents: "none" }}
                    >
                      {day.dayNumber}
                    </motion.text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Info Panel */}
          <div className="w-full md:w-[400px] lg:w-[480px] shrink-0">
            <DayInfoPanel day={selectedDay} />
          </div>
        </div>
      </div>
    </main>
  );
}

function DayInfoPanel({ day }: { day: ItineraryDay }) {
  return (
    <motion.div
      key={day.dayNumber}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[#1a1c1c] rounded-xl overflow-hidden"
    >
      <div className="relative aspect-video bg-[#0a0a0a]">
        <Image
          src={day.heroImage}
          alt={day.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <span
            className="text-[#f48b29] text-sm font-bold tracking-wider"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Day {day.dayNumber}
          </span>
          <h2
            className="text-2xl font-bold text-white mt-1"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {day.title}
          </h2>
          <p
            className="text-sm text-white/50 mt-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {day.location}
          </p>
        </div>

        <p
          className="text-sm text-white/70 leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {day.description}
        </p>

        <div>
          <h3
            className="text-base font-semibold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Highlights
          </h3>
          <ul className="space-y-2">
            {day.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <Check className="w-4 h-4 text-[#f48b29] shrink-0 mt-0.5" />
                <span style={{ fontFamily: "var(--font-inter)" }}>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
