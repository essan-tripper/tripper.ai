"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { JsonLd } from "@/lib/seo/json-ld";
import { Plane, Train, BusFront } from "lucide-react";

const content = {
  name: "Puri",
  slug: "puri",
  tagline: "Where the Bay of Bengal meets the chants of ancient hymns — one of the four sacred Char Dham pilgrimages",
  heroImage: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Jagannath_ths5zz.jpg",
  heroAlt: "Jagannath temple towering over Puri's skyline near the Bay of Bengal",
  region: "Odisha",
  coordinates: { lat: 19.8135, lng: 85.8312, elevation: 5 },
  aboutParagraphs: [
    "Puri, known as Purushottama Kshetra, is a sacred coastal city in Odisha that forms one of the four holiest Char Dham pilgrimages. The 12th-century Shree Jagannath Temple, built by King Ananta Varman Chodaganga Deva in Kalinga architecture, towers 65 m over the city and draws millions of devotees annually. The deities — Lord Jagannath, sister Subhadra, and elder brother Balabhadra — are seated on the bejewelled Ratna Simhassana inside.",
    "Beyond its spiritual significance, Puri offers an 8 km golden beach along the Bay of Bengal, vibrant local markets, and a rich cultural heritage expressed through Pattachitra paintings, shell handicrafts, and the world-famous Rath Yatra where the deities ride towering chariots through streets packed with devotees. The temple kitchen, said to be one of the largest in the world, cooks Mahaprasad in earthen pots over firewood using age-old methods.",
    "The city is a microcosm of Odisha's culture, where ancient traditions coexist with seaside leisure. From the aroma of Mahaprasad at Anand Bazaar to the sound of waves at Swargadwar Beach, from sunrise darshan at the temple to sunset seafood by the shore, Puri immerses visitors in devotion, history, and coastal charm."
  ],
  reach: {
    air: {
      heading: "By Air",
      lines: [
        "Biju Patnaik International Airport, Bhubaneswar (BBI) — 60 km, connected to Delhi, Mumbai, Kolkata, Chennai, Bengaluru",
        "Prepaid taxi from the airport (₹1,500 – 2,000, 1.5 hrs); OSRTC buses also available"
      ]
    },
    train: {
      heading: "By Train",
      lines: [
        "Puri Railway Station (PURI) — major terminus, 2.5 km from the temple",
        "Direct trains: Purushottam Exp (Delhi), Howrah-Puri Exp (Kolkata), Konark Exp (Mumbai), Chennai-Puri Exp"
      ]
    },
    road: {
      heading: "By Road",
      lines: [
        "NH-316 connects Puri to Bhubaneswar (60 km, 1.5 hrs) and Cuttack (82 km, 2 hrs)",
        "OSRTC government and private Volvo buses operate frequently from Bhubaneswar's Baramunda bus stand"
      ]
    }
  },
  bestSeason: {
    intro: "The best time to visit Puri is October to February when the weather is cool and pleasant, ideal for temple darshan, beach walks, and sightseeing. The Rath Yatra in June or July offers the most iconic experience, drawing millions of devotees from around the world.",
    openMonths: [10, 11, 12, 1, 2],
    closedMonthsNote: "Puri is open year-round. October–February is ideal (cool, dry); the Rath Yatra (June–July) is unforgettable but crowded. March–May is hot (above 40 °C); July–September brings monsoon rainfall, though the landscape turns lush."
  },
  stay: {
    tiers: [
      { tier: "Budget", lines: ["Hotel Landmark (temple area) — ₹500 – 900 per night, Hotel Sai International — ₹600 – 1,100", "Temple-administered dharamshalas: Nilachal Yatri Niwas & Nilachal Bhakta Niwash on Grand Road", "Zostel Puri — ₹400 – 800 per night for dormitory beds"] },
      { tier: "Mid-range", lines: ["Hotel Nilachal Ashok — ₹900 – 1,600 per night, Panthanivas Puri — ₹1,200 – 2,000", "Mayfair Heritage — well-appointed rooms, spa, sea-facing restaurant (₹2,500 – 4,000)", "Best areas: CT Road (beach access) and Sea Beach Road"] },
      { tier: "Premium", lines: ["Toshali Sands Resort — beachfront with pool, spa, and fine dining (₹4,000 – 7,000)", "Pride Ananya Resort — contemporary rooms, sea views, multi-cuisine dining (₹3,500 – 6,000)", "Taj properties along Marine Drive with private beach access"] }
    ]
  },
  food: {
    mustTry: [
      { name: "Mahaprasad", note: "sacred temple offering cooked in earthen pots — rice, dal, curry, and sweets served on banana leaves at Anand Bazaar" },
      { name: "Khaja", note: "crispy layered sweet made from refined flour and sugar syrup, traditionally offered as prasad" },
      { name: "Chhena Poda", note: "Odisha's signature baked cottage cheese dessert, caramelised outside and soft inside" },
      { name: "Dalma", note: "hearty lentil and vegetable stew tempered with cumin and coconut — a staple Odia dish" }
    ],
    avoid: [
      { name: "Unhygienic street stalls", note: "beachside and temple-lane vendors vary in cleanliness — stick to high-turnover stalls" },
      { name: "Non-veg near the temple", note: "meat, fish, eggs, onion, and garlic are best avoided within the immediate temple vicinity" }
    ]
  },
  budget: {
    typicalDays: 3,
    rows: [
      { category: "Travel (round trip from Bhubaneswar)", range: "₹ 600 – 4,000" },
      { category: "Stay (per night)", range: "₹ 500 – 8,000" },
      { category: "Food (per day)", range: "₹ 200 – 1,500" },
      { category: "Local transport (per day)", range: "₹ 100 – 500" },
      { category: "Sightseeing & misc", range: "₹ 500 – 2,000" }
    ],
    totalRange: "₹ 4,000 – 15,000 per person"
  },
  closing: "Puri is where devotion meets the sea — a timeless coastal town that feeds the soul as generously as it feeds the body."
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
