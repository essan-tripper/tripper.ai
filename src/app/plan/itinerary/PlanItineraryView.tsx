"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { charDhamYatra } from "@/data/itineraries";
import type { ItineraryDay } from "@/data/itineraries";

export default function PlanItineraryView() {
  const days = charDhamYatra.days;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white/90 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {charDhamYatra.title}
        </h1>
        <p className="text-white/60 mb-8 md:mb-12">{charDhamYatra.summary}</p>

        {/* Desktop: sidebar tabs */}
        <DesktopView days={days} />

        {/* Mobile: stacked accordion */}
        <MobileView days={days} />
      </div>
    </main>
  );
}

function DesktopView({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="hidden md:block">
      <Tabs
        defaultValue={days[0].dayNumber.toString()}
        orientation="vertical"
        className="flex gap-8"
      >
        <TabsList
          variant="line"
          className="w-72 shrink-0 bg-transparent h-fit flex-col gap-1.5"
        >
          {days.map((day) => (
            <TabsTrigger
              key={day.dayNumber}
              value={day.dayNumber.toString()}
              className="w-full justify-start px-4 py-3 h-auto text-left rounded-lg border border-transparent data-[state=active]:border-[#f48b29] data-[state=active]:bg-[#1a1c1c] data-[state=active]:text-white"
            >
              <div>
                <div className="text-[#f48b29] font-bold text-lg">
                  Day {day.dayNumber}
                </div>
                <div className="text-sm text-white/60">{day.location}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {days.map((day) => (
          <TabsContent
            key={day.dayNumber}
            value={day.dayNumber.toString()}
            className="flex-1 mt-0"
          >
            <DayContent day={day} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function MobileView({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="md:hidden">
      <Accordion type="single" collapsible>
        {days.map((day) => (
          <AccordionItem
            key={day.dayNumber}
            value={day.dayNumber.toString()}
            className="border-[#1a1c1c]"
          >
            <AccordionTrigger className="px-0 py-2 hover:no-underline">
              <div className="flex flex-col items-start w-full gap-2">
                <div className="relative h-24 w-full rounded-lg overflow-hidden bg-[#1a1c1c]">
                  <Image
                    src={day.heroImage}
                    alt={day.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col items-start px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#f48b29] font-bold text-lg">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-white font-semibold">{day.title}</span>
                  </div>
                  <span className="text-sm text-white/60">{day.location}</span>
                  <p className="text-sm text-white/50 text-left line-clamp-2 mt-1">
                    {day.description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <DayContent day={day} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function DayContent({ day }: { day: ItineraryDay }) {
  return (
    <div className="space-y-6">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1a1c1c]">
        <Image
          src={day.heroImage}
          alt={day.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <h2 className="text-2xl font-bold text-white">{day.title}</h2>
      <p className="text-white/70 leading-relaxed">{day.description}</p>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Highlights</h3>
        <ul className="space-y-2">
          {day.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70">
              <Check className="w-5 h-5 text-[#f48b29] shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
