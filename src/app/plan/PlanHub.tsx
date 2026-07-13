"use client";

import Link from "next/link";
import { Map, Globe2, ScrollText, Route, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const planVariants = [
  {
    label: "Parallax",
    href: "/plan/parallax",
    icon: ScrollText,
    description: "Scroll through the journey as day-by-day sections fade in.",
  },
  {
    label: "SVG Map",
    href: "/plan/map",
    icon: Map,
    description: "Watch the route draw across India. Click any stop for details.",
  },
  {
    label: "3D Globe",
    href: "/plan/3d",
    icon: Globe2,
    description: "Explore destinations on an interactive globe.",
  },
  {
    label: "Interactive Itinerary",
    href: "/plan/itinerary",
    icon: Route,
    description: "Browse day-by-day cards with photos and highlights.",
  },
  {
    label: "Parallax SVG Map",
    href: "/plan/travel-jyotirlingas",
    icon: Compass,
    description: "Follow the 12 Jyotirlingas pilgrimage in order. The map stays fixed as a pin glides through the stops.",
    isFullWidth: true,
  },
];

export default function PlanHub() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span
            className="text-[#f48b29] text-xs tracking-[0.25em] uppercase font-medium"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            The Journey
          </span>
          <h1
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            How We Plan a Trip
          </h1>
          <p
            className="mt-4 text-sm sm:text-base text-white/50 max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Five ways to explore the journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {planVariants.map((variant) => {
            const Icon = variant.icon;
            return (
              <Link
                key={variant.label}
                href={variant.href}
                className={cn(
                  "group flex flex-col gap-4 rounded-xl p-6 transition-all duration-300",
                  "bg-[#1a1c1c] border border-white/10",
                  "hover:border-[#f48b29]/60 hover:shadow-[0_0_24px_rgba(244,139,41,0.15)]",
                  variant.isFullWidth && "sm:col-span-2"
                )}
              >
                <Icon className="w-8 h-8 text-[#f48b29]" />
                <div>
                  <h3
                    className="text-lg font-semibold text-white group-hover:text-[#f48b29] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {variant.label}
                  </h3>
                  <p
                    className="mt-1.5 text-sm text-white/50 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {variant.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
