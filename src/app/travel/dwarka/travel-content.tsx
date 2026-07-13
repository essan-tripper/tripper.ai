"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { JsonLd } from "@/lib/seo/json-ld";
import { Plane, Train, BusFront } from "lucide-react";

const content = {
  name: "Dwarka",
  slug: "dwarka",
  tagline: "Gateway to Heaven — the sacred kingdom of Lord Krishna on the western shore of India",
  heroImage: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/dwarka_tznnnm.jpg",
  heroAlt: "Dwarkadhish temple spire against the evening sky in Dwarka, Gujarat",
  region: "Gujarat",
  coordinates: { lat: 22.2394, lng: 68.9678, elevation: 5 },
  aboutParagraphs: [
    "Dwarka, one of the four sacred Char Dham pilgrimage sites, is an ancient city on the western tip of the Okhamandal Peninsula in Gujarat. Built by Vishwakarma at Lord Krishna's behest, this legendary city was said to have been reclaimed from the Arabian Sea — and later submerged after Krishna's departure. Offshore marine excavations have revealed remnants of a 2000 BCE settlement, confirming its place as one of India's most ancient living cities.",
    "At its heart stands the 2,500-year-old Dwarkadhish Temple (Jagat Mandir), a five-storeyed Chalukya-style limestone and sandstone marvel where the flag is changed five times daily. Pilgrims enter through Swarg Dwar (Heaven's Gate) and exit through Moksha Dwar (Salvation's Gate). The complex includes shrines to Rukmini, Devaki, Balarama, and the Nageshwar Jyotirlinga nearby.",
    "Beyond the temples, Dwarka offers the serene Gomti Ghat where the river meets the sea, the Sudarshan Setu bridge connecting to Bet Dwarka island, Shivrajpur Beach with its white sands, and the Dwarka Lighthouse with panoramic sunset views. The city pulses with devotion during Janmashtami and Diwali, drawing lakhs of pilgrims into its narrow, vibrant lanes."
  ],
  reach: {
    air: {
      heading: "By Air",
      lines: [
        "Jamnagar Airport (JGA) — 130 km, regular flights from Mumbai and Ahmedabad",
        "Porbandar Airport (PBD) — 110 km, limited connectivity"
      ]
    },
    train: {
      heading: "By Train",
      lines: [
        "Dwarka Railway Station (DWK) — 2 km from the temple, on the Ahmedabad–Okha route",
        "Direct trains from Mumbai (Saurashtra Mail), Delhi (Uttaranchal Express), Ahmedabad"
      ]
    },
    road: {
      heading: "By Road",
      lines: [
        "Ahmedabad (440 km, 7-8 hrs), Rajkot (225 km, 4-5 hrs), Jamnagar (130 km, 2.5 hrs) via NH47/NH51",
        "GSRTC runs frequent AC and non-AC buses from major Gujarat cities"
      ]
    }
  },
  bestSeason: {
    intro: "The best time to visit Dwarka is October through March, when the weather is pleasantly cool (9 °C–24 °C) and ideal for temple visits, beach walks, and sightseeing. The peak season coincides with major festivals like Diwali and Janmashtami, adding vibrant cultural energy.",
    openMonths: [10, 11, 12, 1, 2, 3],
    closedMonthsNote: "Dwarka is open year-round with no seasonal closures. Summers (April–June) are hot with temperatures up to 40 °C; monsoon (July–September) brings moderate rainfall but fewer crowds."
  },
  stay: {
    tiers: [
      { tier: "Budget", lines: ["Dharamshalas (Birla, Gayatri, Swaminarayan) — ₹200 – 800 per night", "Budget hotels (Hotel Gomti, Hotel Meera, Toran Guest House) — ₹800 – 2,000 per night", "Best for pilgrims and backpackers — basic but clean, often near the temple"] },
      { tier: "Mid-range", lines: ["Hotel Dwarka Residency, The Dwarkadhish Lords Eco Inn — ₹2,000 – 5,000 per night", "Fortune Hotel Dwarka — modern, centrally located with good amenities", "Comfortable AC rooms with attached bathrooms and reliable service"] },
      { tier: "Premium", lines: ["Devka Beach Resort, Hotel City Heart — ₹5,000 – 8,000 per night", "The Grand Ladhukara — family-friendly with premium facilities", "Rates exceed ₹10,000 during peak festival periods — book well in advance"] }
    ]
  },
  food: {
    mustTry: [
      { name: "Gujarati Thali", note: "an unlimited platter of dal, kadhi, sabzis, roti, rice, and chaas — best at Shrinath Dining Hall" },
      { name: "Khichdi–Osaman", note: "Dwarka's signature comfort meal — rice-lentil khichdi served with spiced lentil soup" },
      { name: "Fafda–Jalebi", note: "crispy gram flour fafda with tangy chutney paired with syrup-soaked jalebis" },
      { name: "Dwarka Peda", note: "milk-based sweet confection from Chappan Bhog — the most popular prasad to take home" }
    ],
    avoid: [
      { name: "Non-vegetarian food", note: "Dwarka is strictly sattvic — non-veg is not available; many restaurants also avoid onion and garlic" },
      { name: "Street water and cut fruits", note: "stick to bottled or filtered water and freshly cooked hot food to avoid stomach issues" }
    ]
  },
  budget: {
    typicalDays: 3,
    rows: [
      { category: "Travel (round trip)", range: "₹ 1,500 – 8,000" },
      { category: "Stay (3 nights)", range: "₹ 600 – 15,000" },
      { category: "Food (3 days)", range: "₹ 1,500 – 5,000" },
      { category: "Local transport & entry", range: "₹ 1,000 – 6,000" },
      { category: "Miscellaneous (prasad, tips)", range: "₹ 500 – 3,000" }
    ],
    totalRange: "₹ 5,000 – 35,000 per person"
  },
  closing: "Let Dwarka guide you closer to divinity — through temple bells, sea breezes, and the timeless grace of Krishna's own kingdom."
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
