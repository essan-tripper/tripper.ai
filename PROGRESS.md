# Travel Pages — Design Document

> **Purpose.** A complete spec for building 7 hardcoded `/travel/<slug>` destination pages on the Tripper site. Another agent (or a human) should be able to pick this up and ship the feature without further clarification.
> **Status.** Approved by the user on 2026-07-13. No code yet — this is the contract.

---

## 1. Goal

Replace the `DestinationModal` triggered by the "Start Your Yatra" button on the homepage carousel with **7 dedicated, hardcoded travel pages** — one per Char Dham destination. Each page is a cinematic, scroll-driven editorial experience: a fixed background image with content cards that parallax in and out as the user scrolls. The 6 content sections are **About → How to reach → Best season → Stay → Food → Budget**, in that exact order.

---

## 2. Scope

### 2.1 In scope
- 7 new hardcoded routes: `/travel/kedarnath`, `/travel/badrinath`, `/travel/gangotri`, `/travel/yamunotri`, `/travel/dwarka`, `/travel/puri`, `/travel/rameshwaram`.
- Each page is a fully independent React component (no shared layout component, no `[slug]` dynamic route).
- Per-page content lives as a `const` at the top of the page's own `page.tsx` (one source per destination, easy to customize per place).
- One Cloudinary hero image as the full-bleed fixed background per page.
- Browser scroll + framer-motion `whileInView` / `useScroll` for the parallax in/out motion.
- Per-page SEO metadata + JSON-LD `TouristDestination` schema.
- Add 7 new entries to `src/app/sitemap.ts`.
- Update `src/components/DestinationsSection.tsx` to navigate instead of opening the modal.
- Delete `src/components/DestinationModal.tsx`.

### 2.2 Out of scope (v1)
- No `/travel` index/hub page. A bare `/travel` visit should render the existing 404 (`src/app/not-found.tsx`).
- No navbar entry. These pages are reachable only from the homepage carousel button.
- No merch cross-sell. No journal CTA. No lead capture. No newsletter signup. No "Start planning" form. The pages are pure content.
- No image-finding prompt — the hero image for each destination is the Cloudinary URL already in use on the homepage carousel.
- No map embed (we have static map images in `public/Maps/` for later; v1 omits them).
- No related-destinations cross-links.
- No back-to-top button.
- No comments / social share buttons.

---

## 3. Routes (Hardcoded, One Per Destination)

| Slug | URL | Destination | Cloudinary hero (already in use) |
|---|---|---|---|
| `kedarnath` | `/travel/kedarnath` | Kedarnath | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384111/Kedarnath_mg8mev.jpg` |
| `badrinath` | `/travel/badrinath` | Badrinath | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/badri_cgzxnb.jpg` |
| `gangotri` | `/travel/gangotri` | Gangotri | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384108/gangotri_h5odhj.jpg` |
| `yamunotri` | `/travel/yamunotri` | Yamunotri | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Yamunotri_w0upb1.jpg` |
| `dwarka` | `/travel/dwarka` | Dwarka | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/dwarka_tznnnm.jpg` |
| `puri` | `/travel/puri` | Puri | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Jagannath_ths5zz.jpg` |
| `rameshwaram` | `/travel/rameshwaram` | Rameshwaram | `https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384109/Rameshwaram_zbtrll.jpg` |

Cloudinary is already whitelisted in `next.config.ts`. The other 6 images in `/public/Carousel Tips/<Name>1..7.jpeg` are **not** used in v1.

---

## 4. File Structure

```
src/app/travel/
  kedarnath/
    page.tsx              # full component, content const at top
  badrinath/
    page.tsx
  gangotri/
    page.tsx
  yamunotri/
    page.tsx
  dwarka/
    page.tsx
  puri/
    page.tsx
  rameshwaram/
    page.tsx
```

Each `page.tsx` is a self-contained file. **No shared component.** No `[slug]` folder. No `layout.tsx` (the root layout covers them). The intentional duplication across the 7 files is the "separate pages for flexibility" choice — each destination can deviate structurally without breaking the others.

### 4.1 Modifications to existing files
| File | Change |
|---|---|
| `src/components/DestinationsSection.tsx` | `handleStartYatra` becomes a `router.push(\`/travel/${d.slug}\`)` via `useRouter` from `next/navigation`. Remove `selectedDham`, `modalOpen` state, the `<DestinationModal />` import + render, and the `modalContent` field from each dham object (replaced by per-page content). |
| `src/components/DestinationModal.tsx` | **Delete the file.** |
| `src/app/sitemap.ts` | Append 7 entries — one per slug — at priority `0.7`, `changeFrequency: 'monthly'`. |

The `dhams` array in `DestinationsSection.tsx` keeps `id`, `name`, `label`, `description`, `image`, and gains a new `slug` field. The `modalContent` field is removed.

---

## 5. Page Anatomy

A travel page is a single full-viewport-height column, scrolled vertically. The background image is `position: fixed` and stays put for the entire scroll. Six content cards are stacked one per viewport-height section, each parallaxing in and out as the section enters/exits the viewport.

### 5.1 Top of page (above the first section)
A thin, fixed-position breadcrumb-style nav strip at the very top, always visible, low z-index. Contents:
- Left: small `←` arrow + text "Back to Tripper" linking to `/`
- Right: small text "Yatra to {Destination Name}" in Cinzel uppercase, letter-spaced
- Background: `bg-black/40 backdrop-blur-sm` so it reads on any background tone
- Height: ~52px, padding `px-6`

The strip is `fixed top-0 inset-x-0 z-30`. It does not parallax — it stays put.

### 5.2 Fixed background
- One `<Image>` element with `fill`, `className="object-cover"`, `priority` (it's the LCP).
- Container: `fixed inset-0 -z-10 bg-[#0a0a0a]`.
- Sits behind everything (`-z-10`).
- A dark gradient overlay sits on top of it for text readability: `fixed inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80`. This gradient is the same dark veil used in `DestinationsSection.tsx:204-205`, but slightly stronger (70/40/80) because content cards need contrast.
- Optional Ken Burns: a very slow `scale: 1.0 → 1.06` transform on the bg image, tied to `useScroll().scrollYProgress` over the entire page (10s of scrolling). Subtle — never distracting.

### 5.3 The 6 content sections

Each section is a `<section>` of `min-h-screen w-full flex items-center justify-center px-6 md:px-16`. Inside, a **content card** holds the text. The card is the parallax element — see Motion spec in §6.

The 6 sections, in order:

#### Section 1 — About
- Card: large, centered, max-width ~720px
- Layout: vertical
  - Eyebrow: `01 — ABOUT` in `#f48b29` Cinzel uppercase, letter-spaced
  - Title: destination name in Instrument Serif, `clamp(3.2rem, 8vw, 6rem)`, bold
  - Italic tagline (1 line, Instrument Serif italic, `text-2xl md:text-3xl`, `text-white/80`)
  - 2-3 paragraph body (`text-base md:text-lg text-white/70 leading-relaxed`)
- No accent image, no card border — just text floating in the center. This is the cinematic opener.

#### Section 2 — How to Reach
- Card: centered, max-width ~960px
- Eyebrow: `02 — HOW TO REACH` in `#f48b29` Cinzel
- Title: small heading "By Air · By Train · By Road" or a single h2
- 3-column grid (`grid grid-cols-1 md:grid-cols-3 gap-6`):
  - Each cell: a Lucide icon (`Plane`, `Train`, `BusFront` from `lucide-react`) + sub-heading + 2-3 short lines
- Slide-in: from right (`x: 80 → 0`, opacity `0 → 1`)

#### Section 3 — Best Season
- Card: full-width band, max-width ~960px
- Eyebrow: `03 — BEST SEASON TO VISIT`
- Title: short heading "When the mountains call"
- Body paragraph explaining the seasons
- Below: a horizontal 12-month visual strip (12 small dots/cells, one per month). Months recommended for visiting are highlighted in `#f48b29`; "open" months in `text-white/60`; "closed" months in `text-white/15`. Cell labels use 3-letter abbreviations (`MAY`, `JUN`, ...). This is a single inline component, not a real chart library.
- Slide-in: from left (`x: -80 → 0`, opacity `0 → 1`)

#### Section 4 — Stay
- Card: centered, max-width ~960px
- Eyebrow: `04 — WHERE TO STAY`
- Title: "Lodging for every kind of pilgrim"
- 3-column grid of stay cards:
  - Each card: `bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm`
  - Card heading: tier name (`Budget · Mid-Range · Premium`) in Playfair
  - 3-4 bullet lines (place type, approximate ₹/night range, area)
- Slide-in: from right

#### Section 5 — Food
- Card: centered, max-width ~960px
- Eyebrow: `05 — FOOD`
- Title: "What to eat in {Destination}"
- 2-column grid:
  - Left column: **Must try** — 4-5 dishes with a 1-line description each
  - Right column: **Eat with caution** — 2-3 things to avoid (altitude sickness food, hygiene notes)
- No icons, just text. Italic dish names (Instrument Serif italic) followed by a short dash and the description in Inter.
- Slide-in: from left

#### Section 6 — Budget
- Card: centered, max-width ~880px
- Eyebrow: `06 — BUDGET`
- Title: "A pilgrim's rough ledger"
- 5-row table or list of cost categories:
  - Transport (to & from nearest hub)
  - Last-mile / trek / local taxi
  - Stay (per night × typical nights)
  - Food & water
  - Darshan / pooja / donations
- Each row: category name (left) + `₹ X – Y` range (right)
- A footer line: "Total for a {N}-day yatra: roughly ₹ {min} – ₹ {max} per person, excluding travel to the hub city."
- Slide-in: from right (final push)
- Below the card, centered, a closing line in Instrument Serif italic: "The yatra is not measured in miles. It is measured in steps." (or a similar sign-off, per destination)

### 5.4 End of page
- After section 6, a final section `min-h-[40vh] flex items-center justify-center`. Single line: "← Back to Tripper" in Cinzel uppercase, letter-spaced, links to `/`. The background image is still visible.
- This is the page footer equivalent.

---

## 6. Motion & Scroll Spec

The cinematic "content going in and out of the screen" effect. Two motion systems work together.

### 6.1 Section cards — the parallax in/out
Each of the 6 content cards is a `motion.div`. It uses **`useScroll` with a `target` ref** on the parent `<section>` and a `useTransform` to drive opacity + y-position. The card:
- Enters the viewport from below with `y: 80, opacity: 0`
- Settles in the middle of the section with `y: 0, opacity: 1`
- Exits the top of the section with `y: -80, opacity: 0`
- The transitions are smooth and tied directly to scroll — no spring snapping.

Implementation pattern (pseudo-code spec, **not** code to copy):
```
<motion.section ref={ref} className="min-h-screen ...">
  <motion.div
    style={{
      opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
      y:     useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80]),
    }}>
    ...card content...
  </motion.div>
</motion.section>
```
Where `scrollYProgress` is `useScroll({ target: ref, offset: ['start end', 'end start'] })`.

The thresholds `0.2 → 0.8` mean the card is fully visible for the middle 60% of the section's scroll, fading in the first 20% and out the last 20%. This gives a deliberate, cinematic in-and-out.

### 6.2 Section-to-section slide direction
Sections alternate slide-in direction (the entry animation, **not** the parallax — the parallax always goes bottom-to-top, see 6.1):

| Section | Entry slide |
|---|---|
| 1 — About | Fade-up only (no x-slide; it's the cinematic opener, pure vertical) |
| 2 — How to reach | From right |
| 3 — Best season | From left |
| 4 — Stay | From right |
| 5 — Food | From left |
| 6 — Budget | From right |

Wait — there's a tension here. The parallax spec in 6.1 says cards move on the Y axis only. The "from left/right" entry would be an additional X-axis animation. **Resolution:** the X-slide is the *initial* entry only — when the section first enters the viewport from below. The X-slide is a `useInView`-triggered `motion.div` wrap inside the card that animates from `x: ±80` to `x: 0` on first appearance. The parallax Y-translate from 6.1 still applies independently. The two motion systems do not conflict — one operates on the section's "is it currently in the viewport" boolean, the other operates on continuous scroll progress.

Practical pattern: nest two `motion.div`s. Outer does the parallax (useScroll + useTransform). Inner does the entry slide (whileInView, runs once).

```
<motion.section ref={sectionRef}>
  <motion.div style={parallaxStyle}>           // 6.1 — always active
    <motion.div
      initial={{ x: direction === 'left' ? -80 : 80, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}>
      ...card content...
    </motion.div>
  </motion.div>
</motion.section>
```

### 6.3 Background — Ken Burns (subtle)
A single `motion.div` wrapping the fixed bg image, animated once on mount:
- `initial={{ scale: 1.0 }}`
- `animate={{ scale: 1.06 }}`
- `transition={{ duration: 25, ease: 'linear' }}`
This gives a 25-second slow zoom on the bg image — barely perceptible but adds depth. Resets if the user reloads. (Optional — implementer's call. If it feels too much, drop it.)

### 6.4 Reduced motion
Wrap the page logic in `useReducedMotion()` from framer-motion. If true:
- All `motion.div` initial/whileInView values collapse to `{ opacity: 1, x: 0, y: 0 }` (no motion)
- The Ken Burns is disabled
- The parallax opacity transform becomes a step (just `opacity: 1` when in view)
- The result is a static page with all cards visible. **Always test this path.**

### 6.5 Performance
- The bg `<Image>` uses `priority` because it's the LCP. Other images: none on the page.
- The 6 cards have low DOM weight (text only). The framer-motion `useScroll` calls are cheap because the targets are stable refs.
- Avoid animating `filter` or `backdrop-filter` on the card backgrounds.
- The `prefers-reduced-motion` short-circuit is important — framer-motion is heavy when 6 transforms are always live.

---

## 7. Content Schema

Each `page.tsx` declares a single `const` at the top of the file — the destination's content. The component then renders it. No data import, no shared file. The data is the page.

### 7.1 Schema (TypeScript-style, for the implementing agent's reference)

```ts
type TravelContent = {
  // Identity
  name: string;                 // "Kedarnath"
  slug: string;                 // "kedarnath"
  label: string;                // "SACRED CHAR DHAM" (eyebrow in carousel)
  tagline: string;              // 1 italic line, used in section 1
  heroImage: string;            // Cloudinary URL
  heroAlt: string;              // alt text for the bg image
  // Section 1 — About
  aboutParagraphs: string[];    // 2-3 short paragraphs
  // Section 2 — How to reach
  reach: {
    air: { heading: string; lines: string[] };
    train: { heading: string; lines: string[] };
    road: { heading: string; lines: string[] };
  };
  // Section 3 — Best season
  bestSeason: {
    intro: string;              // 1 paragraph
    openMonths: number[];       // 1-12, the months recommended
    closedMonthsNote: string;   // "Temple closes Nov–Apr due to snowfall"
  };
  // Section 4 — Stay
  stay: {
    tiers: { tier: string; lines: string[] }[];   // 3 tiers
  };
  // Section 5 — Food
  food: {
    mustTry: { name: string; note: string }[];    // 4-5
    avoid: { name: string; note: string }[];      // 2-3
  };
  // Section 6 — Budget
  budget: {
    typicalDays: number;        // e.g. 3
    rows: { category: string; range: string }[];  // 5 rows
    totalRange: string;         // "₹ 8,000 – 14,000 per person"
  };
  // Closing
  closing: string;              // italic sign-off line
};
```

### 7.2 Example — Kedarnath (full reference)

The implementing agent should use this as a guide for tone, length, and density. Replace with researched content for other destinations.

```ts
const content: TravelContent = {
  name: "Kedarnath",
  slug: "kedarnath",
  label: "SACRED CHAR DHAM",
  tagline: "Where Shiva resides among the clouds",
  heroImage: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384111/Kedarnath_mg8mev.jpg",
  heroAlt: "Kedarnath temple against the Garhwal Himalaya at dawn",
  aboutParagraphs: [
    "Perched at 3,583 metres in the Garhwal Himalaya, Kedarnath is the highest of the Char Dham shrines and one of the twelve sacred Jyotirlingas of Shiva.",
    "The stone temple, attributed to the 8th-century reformer Adi Shankaracharya, sits in a glacial meadow above the Mandakini river. It has survived avalanches, earthquakes, and the catastrophic 2013 floods.",
    "The yatra is a 16-kilometre trek from Gaurikund — the last motorable point. Most pilgrims walk; some are carried; a few take a helicopter from Sersi. The path is the preparation. The temple is the destination."
  ],
  reach: {
    air: {
      heading: "By Air",
      lines: [
        "Jolly Grant Airport, Dehradun (DED) — 250 km / 8-9 hrs by road",
        "Daily flights from Delhi; a few from Mumbai in peak season"
      ]
    },
    train: {
      heading: "By Train",
      lines: [
        "Haridwar (HDR) — the most-used railhead, 275 km / 9-10 hrs by road",
        "Rishikesh (RKSH) — slightly closer, 250 km / 8-9 hrs"
      ]
    },
    road: {
      heading: "By Road",
      lines: [
        "Delhi → Haridwar → Rishikesh → Devprayag → Srinagar → Rudraprayag → Gaurikund",
        "Last 16 km Gaurikund → Kedarnath is pedestrian or helicopter only"
      ]
    }
  },
  bestSeason: {
    intro: "The temple is open for roughly six months a year — early May to early November. Outside that window, the shrine closes for the winter and the deity is moved to Ukhimath.",
    openMonths: [5, 6, 9, 10],
    closedMonthsNote: "Closed November through April. The winter seat is at Ukhimath, ~60 km south."
  },
  stay: {
    tiers: [
      { tier: "Budget", lines: ["GMVN guesthouses and dharamshalas", "₹ 500 – 1,200 per night", "Basic bedding, common bathrooms, pure-veg meals"] },
      { tier: "Mid-range", lines: ["Private hotels in Gaurikund or Sitapur", "₹ 1,500 – 3,500 per night", "Hot water, attached bath, recommended for families"] },
      { tier: "Premium", lines: ["Helicopter day-trippers typically skip the overnight", "Limited premium stock near the temple — book months ahead", "₹ 5,000+ for tented camps with attached bath"] }
    ]
  },
  food: {
    mustTry: [
      { name: "Kanda-Mooli-Poori", note: "the classic Garhwali thali — flatbread with radish and onion sabzi" },
      { name: "Kafuli", note: "a slow-cooked spinach stew eaten with steaming rice" },
      { name: "Bal Mithai", note: "a milk-based sweet from the Kumaon-Garhwal belt, brown outside, fudgy inside" },
      { name: "Aloo Ke Gutke", note: "the high-altitude potato fry — every trekker's staple" }
    ],
    avoid: [
      { name: "Street meat", note: "hygiene drops sharply above 2,500 m" },
      { name: "Raw salads at small dhabas", note: "wash it yourself or skip" }
    ]
  },
  budget: {
    typicalDays: 4,
    rows: [
      { category: "Travel to Gaurikund (Delhi → return)", range: "₹ 1,500 – 3,000" },
      { category: "Last-mile trek (porter, pony, or palki)", range: "₹ 1,200 – 4,000" },
      { category: "Stay (3 nights)", range: "₹ 1,500 – 10,000" },
      { category: "Food & water", range: "₹ 600 – 1,500" },
      { category: "Darshan, pooja, donations", range: "₹ 300 – 2,000" }
    ],
    totalRange: "₹ 5,500 – 20,000 per person, excluding Delhi → Haridwar"
  },
  closing: "The yatra is not measured in miles. It is measured in steps."
};
```

### 7.3 Length budget
- `aboutParagraphs`: 3 paragraphs × 40-60 words each (~150 words)
- `reach`: 3 columns × 2-3 lines (concise, factual)
- `bestSeason.intro`: 1 short paragraph (~40 words)
- `stay.tiers`: 3 tiers × 3 short lines
- `food.mustTry`: 4-5 entries, 1-line notes
- `food.avoid`: 2-3 entries
- `budget.rows`: 5 rows
- `closing`: 1 line (~12 words)

Total per page: ~600-800 words of body copy. The page should feel like a long-read magazine spread, not a brochure.

---

## 8. Content Sources & Research Method

For each of the 7 destinations, the implementing agent must fill the `TravelContent` shape with researched, factual data. The agent should not invent distances, prices, or months.

### 8.1 Method (per destination)
1. **Web fetch (primary)** — pull from these sources, in order of preference:
   - Official tourism sites: `uttarakhandtourism.gov.in`, `odishatourism.gov.in`, `gujarattourism.com`, `tamilnadutourism.org`
   - Char Dham official portal: `badrinath-kedarnath.gov.in` (for the 4 Uttarakhand dhams)
   - WikiVoyage or Wikipedia destination pages
   - Recent (2024-2025) travel blogs: Tripoto, Holidify, TripAdvisor forums
2. **Cross-check** — every fact (altitude, distance, price range, month) should appear in at least 2 sources. Flag anything that doesn't cross-check.
3. **Tone** — match the Kedarnath reference in §7.2. Reverent but practical. No marketing fluff. No superlatives ("most beautiful", "world's best") unless they appear in a cited source.

### 8.2 Per-destination research skeleton
For each of the 7 slugs, the agent answers these questions and writes them into the `TravelContent` shape:

| Question | Where it lands in the schema |
|---|---|
| State / region, exact altitude | Used in the about paragraphs |
| Brief 1-line tagline | `tagline` |
| The 2-3 most interesting historical / spiritual facts | `aboutParagraphs` |
| Nearest airport, railhead, last-mile road point | `reach.air`, `reach.train`, `reach.road` |
| Which months is the temple open? | `bestSeason.openMonths`, `bestSeason.closedMonthsNote` |
| 3 lodging tiers with approx ₹/night | `stay.tiers` |
| 4-5 local dishes, 2-3 to avoid | `food.mustTry`, `food.avoid` |
| Typical yatra length, cost breakdown by category | `budget.typicalDays`, `budget.rows`, `budget.totalRange` |
| A short sign-off line that fits the destination's mood | `closing` |

### 8.3 Image alt text
- `heroAlt`: 8-14 words, descriptive, no "image of" prefix. e.g. `"Kedarnath temple against the Garhwal Himalaya at dawn"`.

---

## 9. SEO & Metadata

### 9.1 Per-page metadata export
Each `page.tsx` exports a `metadata` object:

```ts
export const metadata: Metadata = {
  title: "Yatra to Kedarnath",
  description: "Plan a yatra to Kedarnath — how to reach, when to visit, where to stay, what to eat, and what it costs. A practical guide from Tripper by Essan.",
  openGraph: {
    title: "Yatra to Kedarnath | Tripper by Essan",
    description: "Plan a yatra to Kedarnath — how to reach, when to visit, where to stay, what to eat, and what it costs.",
    images: [{ url: <Cloudinary hero URL> }],
    type: "article",
  },
};
```
- `title` follows the root layout's `title.template` (`%s | Tripper by Essan`).
- `description` is ~140-160 chars.
- `openGraph.images[0].url` is the Cloudinary hero URL.

### 9.2 JSON-LD
Each page inlines a `<JsonLd>` component (`src/lib/seo/json-ld.tsx`) at the end of the returned JSX, with `TouristDestination` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Kedarnath",
  "description": "<first about paragraph>",
  "image": "<Cloudinary hero URL>",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Uttarakhand",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.7352,
    "longitude": 79.0669,
    "elevation": 3583
  }
}
```
Coordinates: the implementing agent must look them up per destination. Use a reliable source (Google Maps, OpenStreetMap, WikiData).

### 9.3 Sitemap
Add to `src/app/sitemap.ts` (one entry per slug, append after the existing entries):

```ts
{ url: `${base}/travel/kedarnath`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${base}/travel/badrinath`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${base}/travel/gangotri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${base}/travel/yamunotri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${base}/travel/dwarka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${base}/travel/puri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${base}/travel/rameshwaram`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
```

### 9.4 `robots.ts`
`/travel/` is already allowed (the existing `robots.ts` disallows only `/admin/`, `/api/`, `/account`, `/cart`, `/order`). No change needed.

---

## 10. Visual Tokens (existing site, no new tokens)

Use only what already exists. The implementing agent must NOT introduce new colors, fonts, or spacing scales.

| Token | Value | Source |
|---|---|---|
| Background dark | `#0a0a0a` | `globals.css`, body |
| Accent orange | `#f48b29` | `globals.css`, used throughout |
| Paper / off-white | `#f2ece0` (only in about-us page, optional) | `about-us/page.tsx:7` |
| Surface card | `bg-white/5`, `border-white/10` | `travel-jyotirlingas` and about-us pattern |
| Heading font | `var(--font-instrument-serif), Georgia, serif` | Layout / `DestinationsSection.tsx:225-226` |
| Body font | `var(--font-inter)` | Layout |
| Display serif | `var(--font-playfair)` | about-us / PlanHub |
| Eyebrow / label font | `var(--font-cinzel)` | PlanHub `fontFamily` |
| Italic accent | Instrument Serif italic | about-us pattern |
| Card border-radius | `rounded-2xl` (existing default) | `DestinationsSection.tsx:176` |
| Card backdrop | `bg-white/5 border border-white/10 backdrop-blur-sm` | travel-jyotirlingas pattern |
| Icon library | `lucide-react` only | project rule |
| Section vertical rhythm | `min-h-screen` per section | this doc |

---

## 11. Implementation Order (suggested)

For the implementing agent, ship in this order:

1. **Update `DestinationsSection.tsx`** — add `slug` to each dham, switch `handleStartYatra` to `router.push`, drop the modal state. This change alone makes the existing modal non-functional, so do it in the same commit as step 2.
2. **Delete `DestinationModal.tsx`** — after the import is removed.
3. **Create `/travel/kedarnath/page.tsx`** — full content + motion + metadata. Use this as the canonical reference for the other 6.
4. **Build & test Kedarnath** — fix any visual/motion/SEO issues here before duplicating.
5. **Duplicate the structure for the other 6 destinations** — copy `kedarnath/page.tsx`, swap the content const, swap the hero image, swap the metadata, swap the GeoCoordinates. Each file is independent — do not introduce a shared component.
6. **Update `sitemap.ts`** — append the 7 entries.
7. **Final QA pass** — see §12.

---

## 12. Acceptance Criteria

A travel page is "done" when **all** of the following hold:

### 12.1 Functional
- [ ] Navigating from the homepage carousel's "Start Your Yatra" button on slide N lands on `/travel/<matching-slug>`.
- [ ] All 7 routes resolve to a 200 with a real page (not 404).
- [ ] Bare `/travel` (no slug) returns the 404 page.
- [ ] The back link in the top nav strip returns to `/`.
- [ ] The closing "Back to Tripper" link returns to `/`.
- [ ] The Cloudinary hero image loads (whitelisted already in `next.config.ts`).

### 12.2 Visual
- [ ] Background image is visible, full-bleed, and stays fixed as the user scrolls.
- [ ] All 6 sections render in order: About → How to reach → Best season → Stay → Food → Budget.
- [ ] The dark gradient overlay is strong enough that body text reads clearly on every section, even on bright bg-image areas.
- [ ] Typography matches the rest of the site (Cinzel eyebrows, Instrument Serif headings, Inter body, Playfair for tier headings).
- [ ] No emoji, no marketing copy, no Lorem Ipsum.

### 12.3 Motion
- [ ] Each content card parallaxes in and out: enters from below with opacity 0, settles, exits at the top with opacity 0.
- [ ] Sections 2/4/5/6 have an entry x-slide (alternating right/left/right/right) on first appearance. Section 1 fades up only. Section 3 fades up only (its month strip is a different motion).
- [ ] No jank at 60fps on a mid-range laptop. No layout shift on scroll.
- [ ] With `prefers-reduced-motion: reduce` set, the page renders all 6 cards statically and skips all transforms.

### 12.4 SEO
- [ ] Per-page `<title>` and `<meta name="description">` are unique.
- [ ] Open Graph image is the Cloudinary hero.
- [ ] `TouristDestination` JSON-LD is present and validates against schema.org (use Google's Rich Results Test).
- [ ] All 7 routes appear in `/sitemap.xml`.

### 12.5 Build
- [ ] `npm run build` exits 0.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run lint` exits 0 (this is the `next lint` command per AGENTS.md).
- [ ] `DestinationModal.tsx` is deleted and not imported anywhere.
- [ ] `DestinationsSection.tsx` no longer references `DestinationModal`, `modalContent`, or `modalOpen`.
- [ ] No new dependencies in `package.json` (framer-motion and lucide-react are already present).

---

## 13. Per-Destination Quick Briefs (for the implementing agent's research)

These are starting points — the agent should web-fetch and verify each fact.

### 13.1 Kedarnath
- State: Uttarakhand · Altitude: 3,583 m · Coordinates: ~30.7352°N, 79.0669°E
- Open: May–early Nov (closed mid-Nov–Apr, deity moves to Ukhimath)
- Hub: Haridwar (HDR) rail · Jolly Grant (DED) airport · Gaurikund last road
- 16 km trek from Gaurikund (or helicopter from Sersi/Phata/Guptkashi)
- Region: Garhwal Himalaya, Mandakini valley
- Keywords: Jyotirlinga, Adi Shankaracharya, 2013 floods

### 13.2 Badrinath
- State: Uttarakhand · Altitude: 3,133 m · Coordinates: ~30.7433°N, 79.4938°E
- Open: May–Nov (closes for winter, deity moves to Joshimath)
- Hub: Haridwar (HDR) rail · Jolly Grant (DED) airport · Joshimath last road
- 3 Jyotirlingas are nearby (Uttarakhand has 4 of the dhams)
- Region: Nar-Narayan mountain range, Alaknanda river
- Keywords: Vishnu, Tapt Kund hot springs, Narsimha

### 13.3 Gangotri
- State: Uttarakhand · Altitude: 3,100 m · Coordinates: ~30.9947°N, 78.9397°E
- Open: May–Nov
- Hub: Haridwar rail · Jolly Grant airport · Uttarkashi last road
- ~250 km from Haridwar
- Region: Origin of the Ganges (Bhagirathi), Gaumukh glacier 19 km further
- Keywords: Ganga, King Bhagirath, Gaumukh trek

### 13.4 Yamunotri
- State: Uttarakhand · Altitude: 3,293 m · Coordinates: ~31.0151°N, 78.4604°E
- Open: May–Nov
- Hub: Haridwar rail · Jolly Grant airport · Hanuman Chatti last road
- 6 km trek from Hanuman Chatti (or shared jeep to Janki Chatti, 5 km trek)
- Region: Bandarpoonch peak, source of Yamuna
- Keywords: Surya, thermal springs at Yamunotri, Divya Shila

### 13.5 Dwarka
- State: Gujarat · Altitude: ~5 m (sea level) · Coordinates: ~22.2394°N, 68.9678°E
- Open: Year-round
- Hub: Okha (OKHA) railhead · Porbandar (PBD) airport nearby · Jamnagar (JGA) airport
- Region: Western tip of the Kathiawar peninsula, Gulf of Kutch
- Keywords: Krishna, Dwarkadhish temple, submerged city, Bet Dwarka

### 13.6 Puri
- State: Odisha · Altitude: ~5 m (sea level) · Coordinates: ~19.8135°N, 85.8312°E
- Open: Year-round (Rath Yatra in June/July)
- Hub: Puri (PURI) is a major railhead · Biju Patnaik (BBI) airport, Bhubaneswar (~60 km)
- Region: Bay of Bengal coast
- Keywords: Jagannath, Subhadra, Balabhadra, Rath Yatra, Chandan Yatra

### 13.7 Rameshwaram
- State: Tamil Nadu · Altitude: ~10 m · Coordinates: ~9.2881°N, 79.3174°E
- Open: Year-round
- Hub: Rameshwaram (RMM) railhead · Madurai (IXM) airport (~175 km)
- Region: Pamban island, Gulf of Mannar
- Keywords: Ramanathaswamy temple (longest corridor in India), Rama, Setu, 22 theertham wells

---

## 14. Out-of-Scope Reminders

Don't add these. If the user later asks for them, that's a new feature, not a v1 task.

- A `/travel` index page (404 today, by design)
- A "Travel" entry in the navbar
- A back-to-top button
- A related-destinations carousel at the bottom
- A share-to-social button row
- A print-friendly view
- A "Plan my yatra" lead-capture form
- A booking integration (hotels, transport, helicopter)
- A loading skeleton beyond the bg image's natural load
- A user-account-aware version (no auth in v1)
- Translation / i18n
- A 3D or interactive map

---

## 15. Sign-off

This document is the spec. The implementing agent should treat it as binding. If a decision is missing or unclear, the agent should **stop and ask the user** rather than invent — the user has been explicit that they want alignment before code, not after.

The user retains the right to deviate from this spec on a per-destination basis (that's the whole point of the "7 independent pages" decision). The agent should not refactor v1 to share code across pages unless asked.
