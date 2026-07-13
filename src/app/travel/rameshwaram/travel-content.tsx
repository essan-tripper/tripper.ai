"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { JsonLd } from "@/lib/seo/json-ld";
import { Plane, Train, BusFront } from "lucide-react";

const content = {
  name: "Rameshwaram",
  slug: "rameshwaram",
  tagline: "Where Lord Rama worshipped Shiva — a sacred island at the edge of India",
  heroImage: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384109/Rameshwaram_zbtrll.jpg",
  heroAlt: "Ramanathaswamy temple gopuram against the sky on Rameswaram island",
  region: "Tamil Nadu",
  coordinates: { lat: 9.2881, lng: 79.3174, elevation: 10 },
  aboutParagraphs: [
    "Ramanathaswamy Temple, located on Rameswaram Island in Tamil Nadu, is one of the twelve Jyotirlinga temples and a sacred Char Dham site. Dedicated to Lord Shiva, it is believed that Lord Rama himself installed the lingam here after his victory over Ravana, seeking atonement. The temple sits on Pamban Island, connected to the mainland by the iconic Pamban Bridge, and marks the southernmost of the four holy abodes of Hinduism.",
    "The temple's architecture is a marvel of Dravidian design, featuring the longest corridor among all Hindu temples in India — a stunning 1,200-pillared hallway stretching nearly 200 metres. Intricate carvings adorn the towering gopurams, and 64 holy theerthams dot the island, with 22 inside the temple itself. Pilgrims bathe in these tanks before offering prayers, a ritual believed to wash away sins.",
    "Beyond its religious significance, Rameswaram offers pristine beaches where the Bay of Bengal meets the Indian Ocean, the haunting ruins of Dhanushkodi, and the Gandhamadhana Parvatham — the island's highest point with panoramic views. The town is also the birthplace of former President Dr. A.P.J. Abdul Kalam, whose memorial is a major draw for visitors."
  ],
  reach: {
    air: {
      heading: "By Air",
      lines: [
        "Madurai International Airport (IXM) — 170 km, connected to Chennai, Bangalore, Hyderabad, Mumbai, Delhi",
        "Tuticorin Airport (142 km) is an alternative with fewer connections"
      ]
    },
    train: {
      heading: "By Train",
      lines: [
        "Rameswaram Railway Station (RMM) — terminus station, 10 min walk from the temple",
        "Direct trains from Chennai (Sethu Express), Madurai, Coimbatore, Tiruchirappalli, Thanjavur"
      ]
    },
    road: {
      heading: "By Road",
      lines: [
        "NH-49 connects Rameswaram to Chennai (527 km), Madurai (170 km), Kanyakumari (315 km)",
        "Regular TNSTC buses from all major Tamil Nadu cities; the Pamban road bridge provides direct access"
      ]
    }
  },
  bestSeason: {
    intro: "The best time to visit Rameswaram is from October to April, when the weather is pleasantly cool with temperatures between 17–30 °C, ideal for temple visits and sightseeing. Winters (November–February) are the most comfortable, while monsoons (July–September) bring moderate rain and fewer crowds.",
    openMonths: [10, 11, 12, 1, 2, 3, 4],
    closedMonthsNote: "Rameswaram is open year-round with no seasonal closures. October to April offers the best weather; summers (March–June) are hot and humid, peaking at 38 °C."
  },
  stay: {
    tiers: [
      { tier: "Budget", lines: ["Dharamshalas and trust-run lodges near the temple — ₹350 – 800 per night", "Basic lodges on Middle Street and North Car Street — ₹500 – 1,200 per night", "Hotel Royal Park — ₹800 – 1,500 per night for a clean, no-frills stay"] },
      { tier: "Mid-range", lines: ["Hotel Guru Residency and Hotel Thirupathi — ₹1,500 – 2,500 per night, AC rooms", "Blue Leaf Residency and Daiwik Hotel — ₹2,000 – 3,500 per night, modern amenities", "TTDC Hotel Tamil Nadu — ₹2,500 – 4,000 per night, sea views"] },
      { tier: "Premium", lines: ["Ocean Paradise Beach Resort — ₹4,000 – 6,000 per night, sea-view rooms", "Hotel Maharaja — ₹3,500 – 5,500 per night, premium rooms and pool", "Heritage homestays near Gandhamadhana Parvatham — ₹4,000 – 7,000 per night"] }
    ]
  },
  food: {
    mustTry: [
      { name: "Banana Leaf Meals", note: "a traditional Tamil spread with rice, sambhar, rasam, poriyal, curd, and appalam — pure vegetarian and soul-satisfying" },
      { name: "Filter Coffee", note: "Rameswaram's signature brew — strong, frothy, and served in a traditional dabara" },
      { name: "Biryani & Parotta", note: "local non-veg staples found at street stalls — mutton thala curry and botti curry are famous among locals" },
      { name: "Payasam & Pongal", note: "sweet payasam (kheer) and Venn pongal (savoury rice-lentil dish) are temple-town favourites" }
    ],
    avoid: [
      { name: "Unhygienic street stall seafood", note: "some beach shacks lack refrigeration — stick to busy, high-turnover places" },
      { name: "Overpriced temple-belt eateries", note: "restaurants on the main temple street often charge 2-3x the rate — walk a block away for honest pricing" }
    ]
  },
  budget: {
    typicalDays: 2,
    rows: [
      { category: "Stay (per night)", range: "₹ 500 – 6,000" },
      { category: "Food (per day)", range: "₹ 300 – 1,200" },
      { category: "Local transport (per day)", range: "₹ 200 – 600" },
      { category: "Temple & activities", range: "₹ 100 – 500" },
      { category: "Miscellaneous (tips, snacks)", range: "₹ 200 – 500" }
    ],
    totalRange: "₹ 5,000 – 15,000 per person for a 2-day trip"
  },
  closing: "From Jyotirlinga darshan to the endless sea at Dhanushkodi — Rameswaram is a pilgrimage that stays with you long after you leave."
};

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function MonthsBar({ openMonths }: { openMonths: number[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center mt-8">
      {months.map((month, i) => {
        const num = i + 1;
        const isRecommended = openMonths.includes(num);
        return (
          <div key={month} className={`w-9 h-9 flex items-center justify-center rounded-full text-[11px] font-bold transition-colors ${isRecommended ? "bg-[#f48b29]/15 text-[#f48b29] border border-[#f48b29]/25" : "text-white/50"}`}>
            {month}
          </div>
        );
      })}
    </div>
  );
}

function TravelSection({ children, className = "", entryX = 0 }: { children: React.ReactNode; className?: string; entryX?: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const prefersReducedMotion = useReducedMotion();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80]);
  return (
    <section ref={ref} className={`min-h-screen w-full flex items-center justify-center px-6 md:px-16 py-24 ${className}`}>
      <motion.div style={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity, y }} className="w-full">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: entryX }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Eyebrow({ text }: { text: string }) {
  return <p className="text-[#f48b29] text-[10px] tracking-[0.25em] uppercase mb-3 font-medium" style={{ fontFamily: "var(--font-cinzel)" }}>{text}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{children}</h2>;
}

function ReachCard({ icon, heading, lines }: { icon: React.ReactNode; heading: string; lines: string[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <div className="text-[#f48b29] mb-3">{icon}</div>
      <h3 className="text-white font-semibold text-sm mb-2">{heading}</h3>
      <ul className="space-y-1.5">
        {lines.map((line, i) => <li key={i} className="text-white/50 text-sm leading-relaxed">{line}</li>)}
      </ul>
    </div>
  );
}

export default function TravelContent() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={prefersReducedMotion ? { scale: 1 } : { scale: 1.06 }}
          transition={{ duration: 25, ease: "linear" }}
        >
          <Image src={content.heroImage} alt={content.heroAlt} fill priority className="object-cover" />
        </motion.div>
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div className="fixed top-0 inset-x-0 z-30 h-[52px] bg-black/40 backdrop-blur-sm flex items-center justify-between px-6">
        <Link href="/" className="text-white/70 text-sm flex items-center gap-1.5 hover:text-white transition-colors"><span className="text-base">←</span> Back to Tripper</Link>
        <span className="text-white/50 text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>Yatra to {content.name}</span>
      </div>
      <div className="relative pt-[52px]">
        <TravelSection className="max-w-[720px] mx-auto">
          <Eyebrow text="01 — ABOUT" />
          <h1 className="text-[clamp(3.2rem,8vw,6rem)] font-bold text-white leading-tight mb-2" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{content.name}</h1>
          <p className="text-2xl md:text-3xl text-white/80 italic mb-6" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{content.tagline}</p>
          <div className="space-y-4">{content.aboutParagraphs.map((p, i) => <p key={i} className="text-base md:text-lg text-white/70 leading-relaxed">{p}</p>)}</div>
        </TravelSection>
        <TravelSection className="max-w-[960px] mx-auto" entryX={80}>
          <Eyebrow text="02 — HOW TO REACH" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReachCard icon={<Plane className="w-6 h-6" />} {...content.reach.air} />
            <ReachCard icon={<Train className="w-6 h-6" />} {...content.reach.train} />
            <ReachCard icon={<BusFront className="w-6 h-6" />} {...content.reach.road} />
          </div>
        </TravelSection>
        <TravelSection className="max-w-[960px] mx-auto">
          <Eyebrow text="03 — BEST SEASON TO VISIT" />
          <SectionTitle>When the sea calls</SectionTitle>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">{content.bestSeason.intro}</p>
          <MonthsBar openMonths={content.bestSeason.openMonths} />
          <p className="text-white/40 text-xs mt-4 text-center">{content.bestSeason.closedMonthsNote}</p>
        </TravelSection>
        <TravelSection className="max-w-[960px] mx-auto" entryX={80}>
          <Eyebrow text="04 — WHERE TO STAY" />
          <SectionTitle>Lodging for every kind of pilgrim</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.stay.tiers.map((tier) => <div key={tier.tier} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"><h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>{tier.tier}</h3><ul className="space-y-2">{tier.lines.map((line, i) => <li key={i} className="text-white/60 text-sm leading-relaxed">{line}</li>)}</ul></div>)}
          </div>
        </TravelSection>
        <TravelSection className="max-w-[960px] mx-auto" entryX={-80}>
          <Eyebrow text="05 — FOOD" />
          <SectionTitle>What to eat in {content.name}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div><h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">Must try</h4><ul className="space-y-3">{content.food.mustTry.map((item) => <li key={item.name}><span className="text-white/80 italic" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{item.name}</span><span className="text-white/50 text-sm"> — {item.note}</span></li>)}</ul></div>
            <div><h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">Eat with caution</h4><ul className="space-y-3">{content.food.avoid.map((item) => <li key={item.name}><span className="text-white/80 italic" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{item.name}</span><span className="text-white/50 text-sm"> — {item.note}</span></li>)}</ul></div>
          </div>
        </TravelSection>
        <TravelSection className="max-w-[880px] mx-auto" entryX={80}>
          <Eyebrow text="06 — BUDGET" />
          <SectionTitle>A pilgrim's rough ledger</SectionTitle>
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
            <div className="divide-y divide-white/10">{content.budget.rows.map((row) => <div key={row.category} className="flex justify-between items-center px-6 py-4"><span className="text-white/70 text-sm">{row.category}</span><span className="text-white/90 text-sm font-medium">{row.range}</span></div>)}</div>
            <div className="px-6 py-4 bg-[#f48b29]/5 border-t border-[#f48b29]/10"><p className="text-white/80 text-sm">Total for a {content.budget.typicalDays}-day yatra: roughly {content.budget.totalRange}</p></div>
          </div>
          <p className="text-white/60 italic text-center mt-8 text-lg" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{content.closing}</p>
        </TravelSection>
        <section className="min-h-[40vh] flex items-center justify-center px-6">
          <Link href="/" className="text-white/60 text-sm tracking-[0.25em] uppercase hover:text-white transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>← Back to Tripper</Link>
        </section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "TouristDestination", name: content.name, description: content.aboutParagraphs[0], image: content.heroImage, address: { "@type": "PostalAddress", addressRegion: content.region, addressCountry: "IN" }, geo: { "@type": "GeoCoordinates", latitude: content.coordinates.lat, longitude: content.coordinates.lng, elevation: content.coordinates.elevation } }} />
    </>
  );
}
