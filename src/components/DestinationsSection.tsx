"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const dhams = [
  {
    id: 1,
    name: "Kedarnath",
    slug: "kedarnath",
    label: "SACRED CHAR DHAM",
    description:
      "Journey through the Mandakini valley to the throne of Lord Shiva, where ancient stone meets the eternal snows of the Garhwal Himalayas.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384111/Kedarnath_mg8mev.jpg",
  },
  {
    id: 2,
    name: "Badrinath",
    slug: "badrinath",
    label: "SACRED CHAR DHAM",
    description:
      "Ascend to the abode of Lord Vishnu nestled between the Nar and Narayan mountain ranges along the banks of the Alaknanda river.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/badri_cgzxnb.jpg",
  },
  {
    id: 3,
    name: "Gangotri",
    slug: "gangotri",
    label: "SACRED CHAR DHAM",
    description:
      "Follow the sacred Bhagirathi river to its glacial source, where the goddess Ganga descended to earth in the high Himalayas.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384108/gangotri_h5odhj.jpg",
  },
  {
    id: 4,
    name: "Yamunotri",
    slug: "yamunotri",
    label: "SACRED CHAR DHAM",
    description:
      "Trek to the source of river Yamuna and seek the blessings of Goddess Yamunotri amidst the pristine peaks of Bandarpoonch.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Yamunotri_w0upb1.jpg",
  },
  {
    id: 5,
    name: "Dwarka",
    slug: "dwarka",
    label: "CHAR DHAM — WEST",
    description:
      "Walk the shores where Lord Krishna built his magnificent kingdom, a city of gold submerged by the sea after his departure.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/dwarka_tznnnm.jpg",
  },
  {
    id: 6,
    name: "Puri",
    slug: "puri",
    label: "CHAR DHAM — EAST",
    description:
      "Witness the majestic Jagannath temple on the Bay of Bengal shores, where the annual Rath Yatra draws millions of devoted pilgrims.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Jagannath_ths5zz.jpg",
  },
  {
    id: 7,
    name: "Rameshwaram",
    slug: "rameshwaram",
    label: "CHAR DHAM — SOUTH",
    description:
      "Cross the Pamban bridge to the sacred island where Lord Rama prayed before crossing to Lanka, home of the magnificent Ramanathaswamy temple.",
    image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384109/Rameshwaram_zbtrll.jpg",
  },
];

export function ChardhamSectionHeader() {
  return (
    <div className="text-center py-16 px-4">
      <span className="text-[#f48b29] text-xs tracking-[0.2em] uppercase font-medium">
        Dream Destinations
      </span>
      <h2
        className="mt-3 text-4xl sm:text-5xl font-bold text-white"
        style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
      >
        Explore the Famous Dham
      </h2>
      <p className="mt-4 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
        Journey through the Indian sacred pilgrimage sites that form the heart of Hindu spirituality from the majestic Himalayas to Indian Oceans.
      </p>
    </div>
  );
}

export function ChardhamCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  // FIX: added dragFree:false and watchDrag:true (defaults) to ensure swipe works reliably
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  // FIX: onSelect is the single source of truth for `current` state.
  // Previously jumpToSlide also called go() directly, causing a desync
  // between embla's internal index and the React state.
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selected = emblaApi.selectedScrollSnap();
    const prev = emblaApi.previousScrollSnap();
    setDirection(selected >= prev ? 1 : -1);
    setCurrent(selected);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const prev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const next = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleStartYatra = (d: (typeof dhams)[0]) => {
    router.push(`/travel/${d.slug}`);
  };

  // FIX: only call emblaApi.scrollTo — let the "select" event update React state.
  // Previously this called both emblaApi.scrollTo AND go() (direct setState),
  // which raced against embla's onSelect handler and caused button/slide desync.
  const jumpToSlide = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 pb-20">
      <div className="w-full overflow-hidden rounded-2xl bg-black select-none">
        <div className="embla relative w-full" ref={emblaRef}>
          <div className="embla__container flex">
            {dhams.map((d, index) => (
              <div
                key={d.id}
                // FIX: replaced fixed `aspectRatio: "16/7"` (too short on mobile)
                // with a responsive className: square-ish on mobile, wider on sm+.
                // min-h ensures a floor on very small screens.
                className="embla__slide relative flex-shrink-0 w-full aspect-[4/3] sm:aspect-[16/7] min-h-[260px]"
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={d.id}
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.04, x: direction * 40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.97, x: direction * -40 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0 z-0"
                  >
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      priority={index === 0}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${d.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute bottom-8 left-6 sm:left-10 z-20 max-w-[260px] sm:max-w-xs"
                  >
                    <p className="text-[#f48b29] text-[10px] tracking-[0.25em] uppercase mb-1.5 font-medium">
                      {d.label}
                    </p>
                    <h3
                      className="text-3xl sm:text-4xl font-bold text-white mb-2"
                      style={{
                        fontFamily:
                          "var(--font-instrument-serif), Georgia, serif",
                      }}
                    >
                      {d.name}
                    </h3>
                    <p className="text-white/65 text-xs sm:text-sm leading-relaxed mb-4 hidden sm:block">
                      {d.description}
                    </p>
                    <button
                      onClick={() => handleStartYatra(d)}
                      className="border border-white/60 text-white text-[10px] sm:text-xs tracking-widest uppercase px-4 py-2.5 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      START YOUR YATRA
                      <span>→</span>
                    </button>
                  </motion.div>
                </AnimatePresence>

                {index === current && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous"
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white items-center justify-center hover:bg-white/20 transition-all duration-200 text-lg cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next"
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white items-center justify-center hover:bg-white/20 transition-all duration-200 text-lg cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
        {dhams.map((d, index) => (
          <button
            key={d.name}
            onClick={() => jumpToSlide(index)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
              current === index
                ? "bg-[#f48b29] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

    </div>
  );
}

export default function ChardhamSection() {
  return (
    <section id="destinations" className="bg-[#0a0a0a]">
      <ChardhamSectionHeader />
      <ChardhamCarousel />
    </section>
  );
}