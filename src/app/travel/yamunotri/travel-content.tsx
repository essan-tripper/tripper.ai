"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { JsonLd } from "@/lib/seo/json-ld";
import { Plane, Train, BusFront } from "lucide-react";

const content = {
  name: "Yamunotri",
  slug: "yamunotri",
  tagline: "Where the Yamuna descends — the first and most intimate stop on the Char Dham circuit",
  heroImage: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Yamunotri_w0upb1.jpg",
  heroAlt: "Yamunotri temple against the Bandarpoonch peak at sunrise",
  region: "Uttarakhand",
  coordinates: { lat: 31.0151, lng: 78.4604, elevation: 3293 },
  aboutParagraphs: [
    "Yamunotri, perched at 3,293 m in Uttarkashi district, is the westernmost shrine of the Char Dham Yatra and the source temple of the Yamuna, the second-holiest river in India. The 19th-century shrine, built by Maharani Gularia of Jaipur, holds a black marble idol of Goddess Yamuna, daughter of the Sun God Surya and twin sister of Yama.",
    "Unlike any other Char Dham shrine, Yamunotri cannot be reached by road — the last 6 km from Janki Chatti must be walked, ridden on a pony, or carried in a palki. The trail climbs 800 m through pine and rhododendron forests alongside the roaring Yamuna, with tea stalls and rest points every few hundred metres.",
    "Beside the temple, Surya Kund — a natural hot spring reaching 88 °C — powers one of Hinduism's most distinctive rituals: pilgrims tie raw rice and potatoes in a cloth, lower them into the boiling water, and offer the cooked prasad to the goddess. When the temple closes on Bhai Dooj, the idol is carried to Kharsali village for winter worship."
  ],
  reach: {
    air: {
      heading: "By Air",
      lines: [
        "Jolly Grant Airport, Dehradun (DED) — 210 km from Janki Chatti",
        "Helicopter services from Dehradun's Sahastradhara Helipad to Kharsali Helipad during yatra season — book via IRCTC heliyatra"
      ]
    },
    train: {
      heading: "By Train",
      lines: [
        "Haridwar (HDR) — 235 km, Rishikesh (RKSH) — 220 km",
        "Well-connected to Delhi, Mumbai, Kolkata via daily trains including Shatabdi and Mussoorie Express"
      ]
    },
    road: {
      heading: "By Road",
      lines: [
        "Delhi → Haridwar → Rishikesh → Barkot → Hanuman Chatti → Janki Chatti (450 km, 12-14 hrs)",
        "Most travellers break overnight at Barkot (45 km before the trek). At Janki Chatti, motorable road ends."
      ]
    }
  },
  bestSeason: {
    intro: "The temple opens on Akshaya Tritiya (late April or early May) and closes on Bhai Dooj (October or November). May–June offers the most comfortable weather (15–20 °C daytime), while September–October brings post-monsoon clarity and thinner crowds.",
    openMonths: [5, 6, 7, 8, 9, 10],
    closedMonthsNote: "The temple is closed from mid-November through mid-April due to heavy snowfall. The idol of Goddess Yamuna is moved to Kharsali village for winter worship."
  },
  stay: {
    tiers: [
      { tier: "Budget", lines: ["GMVN tourist rest houses at Barkot, Hanuman Chatti, and near the temple — ₹800 – 1,500 per night", "Dharamshalas and lodges at Janki Chatti with shared amenities", "Hotel Janki Palace at Janki Chatti (₹1,000 – 1,800 per night) — closest to the trek start"] },
      { tier: "Mid-range", lines: ["GMVN Barkot (₹1,200 – 1,800 per night) — best facilities on the Yamunotri route", "Hotel Himalayan Inn, Barkot (₹1,500 – 2,500 per night) — hot water, restaurant, mountain views", "Yamunotri Cottages near Kharsali Helipad (₹1,800 – 3,000 per night) — scenic mountain views"] },
      { tier: "Premium", lines: ["Blessings Resort near Phoolchatti (₹3,500 – 5,000 per night) — highest-rated on the route", "Helicopter-assisted VIP packages (₹95,000 per person for 2-day round trip from Dehradun)", "All-inclusive Char Dham tour packages with 3-star hotels — ₹12,000 – 20,000 per person"] }
    ]
  },
  food: {
    mustTry: [
      { name: "Aloo Ke Gutke", note: "the universal Garhwali comfort food — cubed potatoes tempered with mustard oil and jakhiya seeds" },
      { name: "Phaanu", note: "a slow-cooked lentil curry from gahat (horse gram), soaked overnight and simmered to a creamy consistency" },
      { name: "Kafuli", note: "a dark-green spinach and fenugreek leaf curry thickened with rice flour, cooked in mustard oil" },
      { name: "Baadi", note: "buckwheat porridge finished with a touch of ghee — light, warming, and deeply nourishing at altitude" }
    ],
    avoid: [
      { name: "Oily or heavy food", note: "fried and greasy dishes worsen altitude sickness — stick to simple dal-rice and light snacks" },
      { name: "Excess tea and caffeine", note: "tea and coffee dehydrate at altitude — drink 3-4 litres of plain water daily instead" }
    ]
  },
  budget: {
    typicalDays: 4,
    rows: [
      { category: "Transport (round trip from Delhi or Haridwar)", range: "₹ 2,500 – 8,000" },
      { category: "Accommodation (3 nights)", range: "₹ 2,400 – 9,000" },
      { category: "Food (meals + snacks)", range: "₹ 1,500 – 4,000" },
      { category: "Pony or Palki (optional, one way)", range: "₹ 1,000 – 5,000" },
      { category: "Miscellaneous (tips, pooja, emergencies)", range: "₹ 1,000 – 3,000" }
    ],
    totalRange: "₹ 8,000 – 29,000 per person, excluding helicopter"
  },
  closing: "Start early, pack light, and let the Yamuna lead you — the climb is the offering."
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
