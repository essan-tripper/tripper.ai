# Booking-Trip Feature — Progress & Implementation Plan

> Single source of truth for the `/plan` storytelling feature. A junior dev should be able to execute this end-to-end without further questions. Update as work progresses.

---

## 0. Decisions Locked (2026-07-13)

| Decision | Value |
|---|---|
| Route structure | **Hub pattern**: `/plan` (landing) with 4 subroutes `/plan/parallax`, `/plan/map`, `/plan/3d`, `/plan/itinerary` |
| Nav treatment (comparison phase) | Only `/plan` link in Navbar + Footer |
| Post-pick plan | **Keep all 4 as a permanent showcase.** Each variant keeps its own route, its own nav entry, its own metadata, and its own sitemap entry. They are framed as a "case study / how we think" section, not a comparison tool. |
| Visual style | 4 implementations of the **same** trip story, so the comparison is apples-to-apples. |
| Lead-capture form + Google Sheet | **Deferred — Phase 2.** Stub the API route now, do not wire UI. |
| Auth / paywall | **None.** This is a public, no-paywall experience. |

---

## 1. Current State

Tripper ships a Next.js 15 App Router merch store (magnets + posters) with Razorpay checkout, better-auth, an admin dashboard, full SEO, and Cloudinary CDN — last release v0.7.0 (2026-07-12). There is currently no storytelling/booking experience; only the merch funnel exists. This plan adds that experience on a new public route.

The new `/plan` feature must honor existing conventions: dark theme (#0a0a0a bg, #f48b29 accent), Tailwind v4 + shadcn/ui, lucide-react icons, cinematic fonts (Cinzel / Instrument Serif / Playfair / Inter), per-page `metadata` exports, no CMS, hardcoded data, `cn()` for class composition.

---

## 2. Goal

Build a `/plan` page that visually explains *how Tripper plans a trip* — itineraries, destinations, routes — across **four** visual treatments. The user (founder) compares them in-browser, then we keep all four as a permanent showcase.

The end of the page is a placeholder CTA (email/WhatsApp link) for now. The form and Google Sheet integration land in Phase 2.

---

## 3. Variants

All four render the **same data** (`src/data/itineraries.ts`) so the comparison is honest.

| ID | Path | What it shows | Library | SSR? |
|---|---|---|---|---|
| A — Parallax | `/plan/parallax` | Vertical scroll story. Sticky hero, sections fade/slide in as you scroll through each day. | `framer-motion` (`useScroll`, `useTransform`) | Client |
| B — SVG Map | `/plan/map` | India outline with animated route polyline. Click a stop → day-detail card. | Hand-traced SVG + `framer-motion` `motion.path` for `pathLength` | Client |
| C — 3D Globe | `/plan/3d` | 3D globe with destination markers. Click a marker → fly camera to that stop. | `three` + `@react-three/fiber` + `@react-three/drei` | Client, dynamic-imported, `ssr: false` |
| D — Interactive Itinerary | `/plan/itinerary` | Clickable day-by-day cards (vertical on mobile, sidebar layout on desktop). Each card: photo, day title, description, highlights. | shadcn `Tabs` + plain Tailwind | Mostly server, light client for tab state |

---

## 4. Architecture

```
/plan                       # Hub — server component, lists the 4 variants
  /parallax                 # Variant A
  /map                      # Variant B
  /3d                       # Variant C
  /itinerary                # Variant D
```

- Each variant is its own route folder with its own `page.tsx` and own component(s). No cross-imports between variants.
- All four read from the **same** data module (`src/data/itineraries.ts`) and the **same** Zod schema (`src/lib/validation/itinerary.ts`).
- Variant C is dynamic-imported with `ssr: false` so Three.js never enters the SSR bundle.
- The hub (`/plan`) is a server component that exports `metadata` and renders four `<Link>` cards. Each card is an `<a>` styled with shadcn `Card` primitive.
- Each variant exports its own `metadata` (title, description, OG) following the pattern in `src/app/about-us/page.tsx`.

---

## 5. Sample Data — Char Dham Yatra

One trip. ~8 days. Brand already has magnets for every stop (Kedarnath, Badrinath, Gangotri, Yamunotri), so the imagery lines up.

**File: `src/data/itineraries.ts`**

```ts
export type ItineraryDay = {
  dayNumber: number
  title: string                 // e.g. "Haridwar → Barkot"
  location: string              // human-readable
  coords: { lat: number; lng: number }    // for map + 3D markers
  description: string           // 2-3 sentences
  heroImage: string             // Cloudinary URL
  highlights: string[]          // 3-4 bullets
}

export type Itinerary = {
  slug: string                  // "char-dham-yatra"
  title: string
  durationDays: number
  coverImage: string            // Cloudinary URL
  summary: string               // 1-2 lines
  days: ItineraryDay[]
}
```

**Days to author (real copy, no Lorem):**

| # | Title | Coords (lat, lng) | Hero asset |
|---|---|---|---|
| 1 | Haridwar arrival | 29.9457, 78.1642 | Cloudinary: `char-dham/day-1-haridwar` |
| 2 | Haridwar → Barkot | 30.8138, 78.2092 | `char-dham/day-2-barkot` |
| 3 | Yamunotri darshan | 30.9997, 78.4611 | `char-dham/day-3-yamunotri` |
| 4 | Barkot → Uttarkashi | 30.7268, 78.4354 | `char-dham/day-4-uttarkashi` |
| 5 | Gangotri darshan | 30.9997, 78.9619 | `char-dham/day-5-gangotri` |
| 6 | Uttarkashi → Guptkashi → Kedarnath | 30.7346, 79.0669 | `char-dham/day-6-kedarnath` |
| 7 | Kedarnath → Badrinath | 30.7433, 79.4938 | `char-dham/day-7-badrinath` |
| 8 | Badrinath → Haridwar departure | 29.9457, 78.1642 | `char-dham/day-8-departure` |

Coords are approximate — exact accuracy not required for either the SVG map (projected to viewBox) or the 3D globe (placed on a sphere).

**File: `src/lib/validation/itinerary.ts`** — Zod schema mirroring the TS types. Call `itinerarySchema.parse()` at module load so missing fields fail loudly in dev.

---

## 6. Files to Create

```
src/app/plan/page.tsx                              # Hub — server component + metadata
src/app/plan/PlanHub.tsx                           # Hub UI (client) — 4 link cards
src/app/plan/parallax/page.tsx                     # Variant A route
src/app/plan/parallax/PlanParallaxView.tsx         # Variant A component (client)
src/app/plan/map/page.tsx                          # Variant B route
src/app/plan/map/PlanMapView.tsx                   # Variant B component (client)
src/app/plan/map/IndiaOutline.tsx                  # Hand-traced SVG path
src/app/plan/3d/page.tsx                           # Variant C route
src/app/plan/3d/PlanThreeDView.tsx                 # Variant C component (client)
src/app/plan/3d/SceneCanvas.tsx                    # dynamic() wrapper, ssr:false
src/app/plan/itinerary/page.tsx                    # Variant D route
src/app/plan/itinerary/PlanItineraryView.tsx       # Variant D component (mixed)
src/components/ui/segmented-control.tsx            # (Optional) only if used inside a variant
src/data/itineraries.ts                            # Char Dham dataset + types
src/lib/validation/itinerary.ts                    # Zod schema
src/lib/plan/cta-placeholder.tsx                   # Bottom CTA component
src/app/api/plan-inquiry/route.ts                  # Phase 2 stub — POST handler
src/lib/validation/plan-inquiry.ts                 # Phase 2 Zod schema
```

---

## 7. Files to Modify

| File | Change |
|---|---|
| `package.json` | Add `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`. Dev: `@types/three`. |
| `src/components/Navbar.tsx` | Add `Plan` link → `/plan`. Use existing `LoadingLink`. Place between `Merch` and the auth links. |
| `src/components/Footer.tsx` | Add `Plan` link in Quick Links column. |
| `src/app/sitemap.ts` | Add 5 URLs: `/plan` (priority 0.7), `/plan/parallax`, `/plan/map`, `/plan/3d`, `/plan/itinerary` (each priority 0.5, changeFrequency `monthly`). |
| `src/env.ts` | Add `PLANNING_APPS_SCRIPT_URL` (Phase 2, but env schema should know about it now). |
| `src/app/robots.ts` | No change — `/plan/*` is public, no need to disallow. |

### Do NOT modify

- `AGENTS.md`, `CHANGELOG.md`, `ROADMAP.md`, `PROGRESS.md` — read-only inputs.
- Any DB schema, auth files, Razorpay files, cart files — irrelevant to this feature.

---

## 8. Tech Stack Per Variant

### A — Parallax
- `framer-motion` for `useScroll`, `useTransform`, `motion.div`
- Cloudinary images as section backgrounds (`next/image` with `fill` + `priority` for the first)
- `prefers-reduced-motion` → disable transforms, only fade opacity

### B — SVG Map
- Hand-traced India outline as a React component (`IndiaOutline.tsx`) — single `<path d="...">`, viewBox `0 0 1000 1000`
- A simple equirectangular projection: `svgX = (lng - 68) * 25`, `svgY = (lat - 8) * -25` (tune visually)
- `motion.path` with `initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}` for the route draw
- Each day = a numbered dot (`<circle>`) at projected coords; click → highlight + scroll day card into view
- Mobile: stack map above the day list; tap dots to expand the corresponding day card

### C — 3D Globe
- `three` + `@react-three/fiber` + `@react-three/drei` (`OrbitControls`, `Sphere`, `Html`)
- Dynamic-import the entire view: `const PlanThreeDView = dynamic(() => import('./PlanThreeDView'), { ssr: false })`
- Earth: wireframe sphere (no texture dependency, fastest path) OR a CC0 Earth texture from a known public CDN. If using a texture, add the CDN domain to `next.config.ts` `remotePatterns`.
- Day markers: small emissive spheres placed via `latLngToVector3` helper (standard equirectangular → unit-sphere conversion)
- Click marker → animate camera with `CameraControls` to a position offset 1.5× the marker's vector
- Mobile fallback: if `window.innerWidth < 768`, render a static message instead of `<Canvas>`. Detect in `useEffect`, do not SSR-guard.

### D — Interactive Itinerary
- shadcn `Tabs` for desktop sidebar layout; on mobile, render the day list stacked with the active day's content below
- No new dependencies
- Each tab trigger is a small vertical bar (day number on top, location subtitle below)
- Active tab shows: hero image, day title, description, highlights as bullets

---

## 9. Build Order (execute top-to-bottom)

1. **Install deps** — `npm install framer-motion three @react-three/fiber @react-three/drei && npm install -D @types/three`. Run `npm run build` immediately to confirm no breakage.

2. **Author the shared data** — Write `src/data/itineraries.ts` (Char Dham, 8 days, real copy). Write `src/lib/validation/itinerary.ts` and validate on import. **Do not proceed until `npm run typecheck` passes.**

3. **Scaffold the hub** — `src/app/plan/page.tsx` (server, metadata) + `src/app/plan/PlanHub.tsx` (client, 4 cards). Cards use shadcn `Card` primitive. Each card links to its variant route. Add a short header above the cards: "How we plan a trip — four views."

4. **Stub all 4 variant routes** — Create each `page.tsx` with a placeholder that says "Variant A — Parallax — coming soon." Confirm all 4 routes load via `npm run dev`. Get the hub → variant navigation working end-to-end.

5. **Build Variant D first (lightest)** — Interactive itinerary. No new deps, mostly server-rendered, fastest to ship. Validates the data shape works for the consumer side.

6. **Build Variant A — Parallax** — `npm install framer-motion` (done in step 1). Use `useScroll` against a tall scroll container; each day section has a sticky image + animated text card. Test on Chrome desktop + Safari iOS.

7. **Build Variant B — SVG Map** — Trace India outline in `IndiaOutline.tsx`. Add the projection helper. Add `motion.path` for the route draw. Implement click-to-select-day.

8. **Build Variant C — 3D Globe** — Dynamic-import the canvas. Wire `OrbitControls` and the day markers. Mobile fallback message. Verify the route's JS chunk in `npm run build` output — should be a separate chunk, not in the initial bundle.

9. **Add CTA placeholder** — `src/lib/plan/cta-placeholder.tsx`. Import at the bottom of each variant view. Email/WhatsApp link in a constant with a `// TODO` comment for the founder to fill in.

10. **Wire Navbar + Footer + Sitemap** — Add `Plan` link to `Navbar.tsx` and `Footer.tsx` (use `LoadingLink`). Add 5 entries to `sitemap.ts`.

11. **Phase 2 stub** — `src/app/api/plan-inquiry/route.ts`. Reads `PLANNING_APPS_SCRIPT_URL` from env, validates body, `fetch()` POSTs to it. Returns `{ ok: true }` on 2xx. **Do not wire to UI.** Add `// TODO(phase-2):` comment at the top.

12. **Typecheck + build** — `npm run typecheck && npm run build`. Both must pass with zero new errors.

13. **Smoke test** — Dev server. Hit `/plan`, navigate to each of the 4 variants, refresh, switch between them. Test mobile viewport (375px) — all variants except C should work; C should show the fallback message. Tab through with keyboard; ensure hub cards and any tabs are reachable.

14. **Hand off to founder** — Open all 4 routes in 4 tabs, take screenshots, present for comparison. (Pick has already been decided = "keep all 4", so the founder's review is just a final polish pass, not a kill/keep decision.)

---

## 10. SEO & Metadata

### Hub (`/plan`)
```ts
export const metadata: Metadata = {
  title: "How We Plan a Trip",
  description: "See how Tripper plans a custom pilgrimage — four ways to explore the journey, from a scrollable story to a 3D globe.",
  openGraph: {
    title: "How We Plan a Trip | Tripper by Essan",
    description: "Four ways to explore a custom Tripper itinerary.",
    type: "website",
  },
  // do NOT set robots — this is public
}
```

### Each variant
- `title`: `<Variant name> — How We Plan a Trip`
- `description`: 1-sentence variant-specific copy
- `openGraph`: same as hub but variant-specific
- All four variants are indexable.

### Sitemap
```ts
{ url: '/plan', priority: 0.7, changeFrequency: 'monthly' },
{ url: '/plan/parallax', priority: 0.5, changeFrequency: 'monthly' },
{ url: '/plan/map', priority: 0.5, changeFrequency: 'monthly' },
{ url: '/plan/3d', priority: 0.5, changeFrequency: 'monthly' },
{ url: '/plan/itinerary', priority: 0.5, changeFrequency: 'monthly' },
```

### JSON-LD (optional, hub only)
A `TouristTrip` schema describing the Char Dham sample. Reuse `src/lib/seo/json-ld.tsx`. Keep it minimal — `name`, `description`, `itinerary`.

---

## 11. Nav / Footer Timeline

| Phase | Nav state | Footer state |
|---|---|---|
| **Now (comparison phase)** | One `Plan` link → `/plan` | One `Plan` link → `/plan` |
| **After post-pick polish (still single nav entry)** | Same | Same |
| **Final showcase state** (all 4 as permanent case studies) | Five entries: `Plan` (hub) + `Parallax` + `Map` + `3D` + `Itinerary` | Same five, in Quick Links column |

The transition to "showcase state" is just an edit to `Navbar.tsx` and `Footer.tsx` — no new files. **Defer this until the founder explicitly signs off on showcase framing.**

For now, ship with the comparison-phase nav. The four variant routes are reachable via the hub and via direct URL.

---

## 12. Phase 2 — Form + Google Sheet (Deferred)

When ready:

1. **Decide form shape** — single contact only, contact + preferences, or multi-step wizard. (Open question — see §14.)
2. **Build the form** — Add to `/plan` hub above the CTA placeholder. Validation with React Hook Form + the existing Zod pattern (or plain `useState` for simpler shape).
3. **Apps Script** — In the founder's Google Sheet: Extensions → Apps Script → paste a `doPost(e)` handler that appends a row. Deploy as Web App, "Execute as Me", "Access: Anyone". Copy the URL.
4. **Env var** — `PLANNING_APPS_SCRIPT_URL=<url>` in `.env`. Add to `src/env.ts` validation.
5. **Wire** — Form's `onSubmit` → `POST /api/plan-inquiry`. Show success toast + thank-you state. Failure → error toast with retry.
6. **Optional** — Mirror rows into a new `plan_inquiries` DB table + admin tab. Only if the founder wants in-app visibility in addition to the Sheet.

---

## 13. Risks

| Risk | Mitigation |
|---|---|
| `three` adds ~150-300 KB gz to `node_modules`; slows `npm run build` even for routes that don't use it | Dynamic-import in Variant C only. Verify in build output that the 3D route is its own chunk. Other routes unaffected. |
| 3D crashes / blank on low-end mobile | Static fallback message when `window.innerWidth < 768`. Detected in `useEffect`, no SSR guard. |
| Hand-traced India outline looks amateur | Stylized outline + state boundaries is fine. If polish needed, swap to Wikimedia outline later (check license). |
| Cloudinary URLs are placeholders during dev | Use real public IDs from founder's Cloudinary account. If absent, fall back to a known free Cloudinary demo asset with a `// TODO` comment. |
| Framer Motion + R3F strict-mode double-render warnings in dev | Both handle it. Ignore unless UI breaks. |
| `sessionStorage` throws in private mode on some browsers | Wrap any `sessionStorage` usage in `try/catch`; degrade to no-persistence. (Not currently used, but flagging if added later.) |
| Bundle bloat if all 4 are heavily client-rendered | D is mostly server-rendered. A and B are client but use only `framer-motion` (~50 KB gz). C is dynamic-imported. Total initial JS for `/plan` should stay under 100 KB gz excluding the 3D chunk. |
| Hub at `/plan` is being used for both the comparison page and (post-pick) the showcase index | Naming: `/plan` stays the hub. If the founder later wants a different home for the feature, restructure before the post-pick nav update. |

---

## 14. Open Questions for the Junior Dev

- **Cloudinary access** — does the founder have an account you can upload to, or should you use placeholder URLs? Ask before building.
- **India outline SVG** — recommended: hand-trace a simplified version in `IndiaOutline.tsx` (~150 lines) so we own it. Alternative: Wikimedia outline (check license). Pick hand-traced.
- **3D Earth texture** — needed, or is a wireframe sphere + accent glow acceptable for Phase 1? Recommended: wireframe + subtle accent glow. Skip texture dependency.
- **Founder's contact link** — what goes in the CTA placeholder's mailto/WhatsApp URL? Stub with `hello@example.com` and a `// TODO` comment.
- **Form shape (Phase 2)** — founder has not decided. Three options: contact only, contact + preferences, multi-step wizard. Ask before Phase 2.
- **Showcase framing copy** — when promoting to showcase state, the hub copy changes from "Compare four views" to something like "Four ways to read a journey". Defer until post-pick.
- **R3F + strict TS** — if `tsc` complains on `<mesh>` / `<group>`, ensure `@react-three/fiber@8.x+` (types shipped). Don't add a separate `@types/react-three-fiber`.
- **Reduced motion** — Variant A (parallax) and C (3D auto-rotate) must respect `prefers-reduced-motion`. Add the check in `useEffect`. Map polyline draw (B) is subtle enough to keep.

---

## 15. Acceptance Criteria

- [ ] `npm run typecheck` and `npm run build` both pass with zero errors and zero new warnings.
- [ ] `/plan` hub renders 4 link cards. Clicking each navigates to the corresponding variant.
- [ ] All 4 variant routes (`/plan/parallax`, `/plan/map`, `/plan/3d`, `/plan/itinerary`) load without console errors on desktop Chrome.
- [ ] All 4 variants render the **same** Char Dham content (same days, same order, same copy).
- [ ] Variant C (`/plan/3d`) is dynamic-imported; the build output shows it as a separate JS chunk, not in the initial bundle.
- [ ] Variant C shows a static fallback message at viewport width ≤ 768px.
- [ ] Each variant exports its own `metadata` (title, description, OG). No page returns the default Next.js metadata.
- [ ] `Plan` appears in `Navbar.tsx` and `Footer.tsx`. No other links to the new routes appear in nav during comparison phase.
- [ ] `sitemap.xml` lists all 5 new URLs with the priorities above.
- [ ] `/api/plan-inquiry` exists, validates with Zod, returns `{ ok: true }` against a test Apps Script URL, but is **not** called from any UI.
- [ ] No edits to `AGENTS.md`, `CHANGELOG.md`, `ROADMAP.md`, or `PROGRESS.md`.
- [ ] No changes to DB schema, auth, cart, or Razorpay files.
- [ ] Mobile smoke test at 375px: hub works, all 4 variants load (C shows fallback), nav/footer usable.

---

## 16. Post-Pick Plan (Showcase State)

When the founder confirms "keep all 4 as showcase":

1. **Update hub copy** — change "Four ways to compare" → "Four ways to read a journey" or similar showcase framing.
2. **Expand nav** — add 4 more entries to `Navbar.tsx`: `Parallax`, `Map`, `3D`, `Itinerary`, each linking to its route. Reuse `LoadingLink`.
3. **Add a case-study section on the hub** — short paragraph above the cards explaining *why* we built four versions, framed as a brand statement ("We prototype in public").
4. **Add OG images per variant** — generate 4 Cloudinary OG images (1200×630) and reference in each route's `metadata.openGraph.images`.
5. **Optionally rename routes** — if the founder dislikes `/plan/3d` (numeric, looks odd), rename to `/plan/globe` or `/plan/three-d`. Same for `/plan/map` vs `/plan/svg-map`. Do this **before** promoting to nav so we don't 404 after launch.
6. **Bump version to v0.8.0** in `CHANGELOG.md` (founder does this — not in our scope).

---

## 17. Done = 

- [ ] All 4 variants built and tested
- [ ] Hub + nav + footer + sitemap wired
- [ ] Phase 2 API stub in place
- [ ] Typecheck + build green
- [ ] Smoke test passed
- [ ] Founder signs off on showcase framing (unlocks nav expansion)
