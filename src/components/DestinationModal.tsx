"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DhamModalData {
  id: number;
  name: string;
  label: string;
  modalContent: {
    tagline: string;
    details: string;
  };
}

interface DestinationModalProps {
  dham: DhamModalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getModalImagePath(name: string, index: number): string {
  const normalized = name.replace(/\s+/g, "");
  return `/Carousel Tips/${normalized}${index + 1}.jpeg`;
}

export function DestinationModal({ dham, open, onOpenChange }: DestinationModalProps) {
  // FIX 2: Single carousel instance — one embla ref used for both mobile and desktop.
  // Previously two separate embla instances shared one onSelect handler via `??`,
  // meaning only whichever initialised first drove the dot state, causing desync.
  const [emblaDesktopRef, emblaDesktopApi] = useEmblaCarousel({ loop: true });
  const [emblaMobileRef, emblaMobileApi] = useEmblaCarousel({ loop: true });

  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  // Each carousel tracks its own index independently — no shared state confusion.
  const onDesktopSelect = useCallback(() => {
    if (!emblaDesktopApi) return;
    setDesktopIndex(emblaDesktopApi.selectedScrollSnap());
  }, [emblaDesktopApi]);

  const onMobileSelect = useCallback(() => {
    if (!emblaMobileApi) return;
    setMobileIndex(emblaMobileApi.selectedScrollSnap());
  }, [emblaMobileApi]);

  useEffect(() => {
    if (!emblaDesktopApi) return;
    onDesktopSelect();
    emblaDesktopApi.on("select", onDesktopSelect);
    emblaDesktopApi.on("reInit", onDesktopSelect);
    return () => {
      emblaDesktopApi.off("select", onDesktopSelect);
      emblaDesktopApi.off("reInit", onDesktopSelect);
    };
  }, [emblaDesktopApi, onDesktopSelect]);

  useEffect(() => {
    if (!emblaMobileApi) return;
    onMobileSelect();
    emblaMobileApi.on("select", onMobileSelect);
    emblaMobileApi.on("reInit", onMobileSelect);
    return () => {
      emblaMobileApi.off("select", onMobileSelect);
      emblaMobileApi.off("reInit", onMobileSelect);
    };
  }, [emblaMobileApi, onMobileSelect]);

  // Reset indices when modal opens with a new dham
  useEffect(() => {
    if (open) {
      setDesktopIndex(0);
      setMobileIndex(0);
      emblaDesktopApi?.scrollTo(0, true);
      emblaMobileApi?.scrollTo(0, true);
    }
  }, [open, dham?.id]);

  const desktopPrev = useCallback(() => emblaDesktopApi?.scrollPrev(), [emblaDesktopApi]);
  const desktopNext = useCallback(() => emblaDesktopApi?.scrollNext(), [emblaDesktopApi]);
  const mobilePrev = useCallback(() => emblaMobileApi?.scrollPrev(), [emblaMobileApi]);
  const mobileNext = useCallback(() => emblaMobileApi?.scrollNext(), [emblaMobileApi]);

  if (!dham) return null;

  const modalImages = Array.from({ length: 7 }, (_, i) => getModalImagePath(dham.name, i));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 bg-[#0a0a0a] border-white/10 overflow-hidden",
          // FIX 3: Make close button (×) visible — DialogContent renders the close
          // button internally; override its colour via the [&>button] selector.
          "[&>button]:text-white [&>button]:opacity-80 [&>button]:hover:opacity-100",
          "[&>button]:hover:bg-white [&>button]:hover:text-black",
          "[&>button]:transition-all [&>button]:duration-200",
          "[&>button]:rounded-sm [&>button]:p-1",
          // Layout: stacked on mobile, side-by-side on desktop
          "w-[95vw] max-w-[95vw] md:max-w-[860px]",
          // FIX 1: On mobile, let the whole modal scroll naturally (overflow-y-auto).
          // On desktop keep fixed height with no overflow so panels handle their own scroll.
          "max-h-[92vh] overflow-y-auto md:overflow-hidden",
          "flex flex-col md:flex-row md:h-[600px]"
        )}
      >

        {/* ══════════════════════════════════════════
            DESKTOP ONLY — Left image carousel (55%)
            Hidden on mobile; mobile carousel is below content instead.
        ══════════════════════════════════════════ */}
        <div className="hidden md:block relative md:flex-[0_0_55%] h-full overflow-hidden group">
          <div className="h-full w-full overflow-hidden" ref={emblaDesktopRef}>
            <div className="flex h-full">
              {modalImages.map((img, i) => (
                <div
                  key={`${dham.id}-desktop-${i}`}
                  className="relative flex-[0_0_100%] min-w-0 h-full"
                >
                  <Image
                    src={img}
                    alt={`${dham.name} ${i + 1}`}
                    fill
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Subtle right-edge fade into the dark content panel */}
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0a0a]/50 to-transparent pointer-events-none" />

          <button
            onClick={desktopPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={desktopNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
            {modalImages.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaDesktopApi?.scrollTo(i)}
                className={cn(
                  "transition-all duration-300 rounded-full cursor-pointer",
                  desktopIndex === i
                    ? "w-8 h-1.5 bg-[#f48b29]"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT PANEL — Text content (45% desktop / full mobile)
            FIX 1: On mobile this comes FIRST in the scroll order,
            so user sees text immediately and scrolls down to the carousel.
        ══════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-[0_0_45%] md:h-full md:overflow-y-auto scrollbar-hide">
          <div className="p-6 md:p-8 flex flex-col">

            <p className="text-[#f48b29] text-[10px] tracking-[0.2em] uppercase font-medium mb-3">
              {dham.label}
            </p>

            <h2
              className="text-white text-3xl md:text-4xl font-bold leading-tight mb-2"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {dham.name}
            </h2>

            <p className="text-white/70 text-sm italic mb-5">
              {dham.modalContent.tagline}
            </p>

            <p className="text-white/60 text-sm leading-relaxed">
              {dham.modalContent.details}
            </p>

          </div>
        </div>

        {/* ══════════════════════════════════════════
            MOBILE ONLY — Image carousel below text
            FIX 1: Rendered after text in DOM so it appears below on scroll.
            FIX 2: Uses its own embla instance (emblaMobileRef / emblaMobileApi)
                   with its own index state — dots now stay in sync with swipe.
        ══════════════════════════════════════════ */}
        <div className="md:hidden px-6 pb-8">
          <div
            className={cn(
              "relative w-full rounded-2xl overflow-hidden bg-neutral-900 group",
              "aspect-[4/3]"
            )}
          >
            <div className="h-full w-full overflow-hidden" ref={emblaMobileRef}>
              <div className="flex h-full">
                {modalImages.map((img, i) => (
                  <div
                    key={`${dham.id}-mobile-${i}`}
                    className="relative flex-[0_0_100%] min-w-0 h-full"
                  >
                    <Image
                      src={img}
                      alt={`${dham.name} ${i + 1}`}
                      fill
                      priority={i === 0}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Always-visible prev/next on mobile (no hover required) */}
            <button
              onClick={mobilePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={mobileNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
              {modalImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaMobileApi?.scrollTo(i)}
                  className={cn(
                    "transition-all duration-300 rounded-full cursor-pointer",
                    mobileIndex === i
                      ? "w-8 h-1.5 bg-[#f48b29]"
                      : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}