"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { JsonLd } from "@/lib/seo/json-ld";
import { Plane, Train, BusFront } from "lucide-react";

const content = {
  name: "Gangotri",
  slug: "gangotri",
  tagline: "Where the Ganges touches earth — the sacred source of the holiest river in Hinduism",
  heroImage: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384108/gangotri_h5odhj.jpg",
  heroAlt: "Gangotri temple on the banks of the Bhagirathi river in the high Himalayas",
  region: "Uttarakhand",
  coordinates: { lat: 30.9947, lng: 78.9397, elevation: 3100 },
  aboutParagraphs: [
    "Gangotri is one of the four sacred Char Dhams in Uttarakhand, sitting at 3,100 m on the banks of the Bhagirathi River. According to Hindu mythology, this is where Goddess Ganga first touched earth after Lord Shiva released her from his matted locks, following King Bhagirath's centuries-long penance.",
    "The town is the gateway to the Gangotri Glacier and Gaumukh — the precise snout of the glacier and the origin of the Bhagirathi, which becomes the Ganges after its confluence at Devprayag. An 18 km trek through the Gangotri National Park leads pilgrims and trekkers to the ice-cold holy waters of Gaumukh.",
    "The Gangotri Temple, built in the 18th century by Gorkha General Amar Singh Thapa, is a white-shuttered shrine amidst pine and deodar groves. The temple opens on Akshaya Tritiya (late April or early May) and closes on Diwali (October–November), after which the idol is moved to Mukhba village for the winter."
  ],
  reach: {
    air: {
      heading: "By Air",
      lines: [
        "Jolly Grant Airport, Dehradun (DED) — 250 km / 9-10 hrs by road",
        "Helicopter services from Dehradun's Sahastradhara Helipad to Harsil during yatra season"
      ]
    },
    train: {
      heading: "By Train",
      lines: [
        "Rishikesh (RKSH) — 240 km / 8-9 hrs by road",
        "Haridwar (HDR) — 270 km, connected to Delhi, Kolkata, and other metros"
      ]
    },
    road: {
      heading: "By Road",
      lines: [
        "Delhi → Rishikesh → Tehri → Uttarkashi → Harsil → Gangotri (500 km, 15-16 hrs)",
        "Regular buses and shared jeeps from Uttarkashi to Gangotri (₹ 170-200 per person)"
      ]
    }
  },
  bestSeason: {
    intro: "The best time to visit Gangotri is during summer and early autumn — May–June and September–October — when the weather is pleasant (10–20 °C days) and the roads are clear. July and August bring heavy monsoon rains that often trigger landslides.",
    openMonths: [5, 6, 9, 10],
    closedMonthsNote: "The temple is closed from November to April due to heavy snowfall. The idol of Goddess Ganga is shifted to Mukhba village near Harsil for winter worship."
  },
  stay: {
    tiers: [
      { tier: "Budget", lines: ["GMVN Tourist Rest House — ₹700 – 1,500 per night, 500 m from temple", "GMVN Yatri Niwas — ₹300 – 800 per night, dormitory and economy rooms", "Dharamshalas and ashrams — ₹200 – 500 per night, run by trusts"] },
      { tier: "Mid-range", lines: ["Hotel Manisha — ₹1,500 – 3,000 per night, family-friendly, near temple", "Prakriti The Retreat (Harsil) — ₹2,500 – 4,000 per night, river views", "Local guesthouses in Harsil — ₹1,500 – 2,500 per night, scenic settings"] },
      { tier: "Premium", lines: ["Himgiri Hotel Dharali — ₹4,000 – 7,000 per night, panoramic Himalayan views", "Nelangana Resorts — ₹5,000 – 8,000 per night, luxury cottages in Dharali", "Golden Heritage Dharali — ₹3,500 – 6,000 per night, boutique homestay"] }
    ]
  },
  food: {
    mustTry: [
      { name: "Phaanu", note: "a lentil pancake served with slow-cooked gravy of gahat (horse gram) and local spices" },
      { name: "Kafuli", note: "a thick spinach-based gravy made with gram flour, garlic, and cumin — the quintessential Pahadi comfort food" },
      { name: "Baadi", note: "finger-millet dough balls served with tangy dal or chutney — a high-energy Himalayan staple" },
      { name: "Chainsoo", note: "roasted black gram cooked into a rich, spicy dal with a distinctive earthy, nutty flavour" }
    ],
    avoid: [
      { name: "Non-vegetarian food & alcohol", note: "strictly prohibited in Gangotri in reverence for the sanctity of the temple town" },
      { name: "Unhygienic street stalls", note: "stick to well-frequented dhabas near the temple where food turnover is high" }
    ]
  },
  budget: {
    typicalDays: 3,
    rows: [
      { category: "Transport (round trip from Rishikesh / Haridwar)", range: "₹ 1,500 – 3,000" },
      { category: "Stay (2 nights)", range: "₹ 1,000 – 6,000" },
      { category: "Food (3 days)", range: "₹ 1,200 – 3,000" },
      { category: "Temple offerings & pooja", range: "₹ 200 – 1,000" },
      { category: "Gaumukh trek guide / pony (optional)", range: "₹ 500 – 2,000" }
    ],
    totalRange: "₹ 4,000 – 15,000 per person"
  },
  closing: "Gangotri is more than a destination — it is a pilgrimage to the very source of faith, where the Himalayas and the divine meet in icy silence."
};

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function MonthsBar({ openMonths, closedMonths }: { openMonths: number[]; closedMonths: number[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center mt-8">
      {months.map((month, i) => {
        const num = i + 1;
        const isRecommended = openMonths.includes(num);
        const isClosed = closedMonths.includes(num);
        return (
          <div key={month} className={`w-9 h-9 flex items-center justify-center rounded-full text-[11px] font-bold transition-colors ${isRecommended ? "bg-[#f48b29]/15 text-[#f48b29] border border-[#f48b29]/25" : isClosed ? "text-white/15" : "text-white/50"}`}>
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
          <SectionTitle>When the mountains call</SectionTitle>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">{content.bestSeason.intro}</p>
          <MonthsBar openMonths={content.bestSeason.openMonths} closedMonths={[11, 12, 1, 2, 3, 4]} />
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
