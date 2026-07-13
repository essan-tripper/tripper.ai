# Variant E — Parallax SVG Map (12 Jyotirlingas)

> Implementation spec for `/plan/travel-jyotirlingas`. This is a single-purpose doc covering one feature in full detail. Read end-to-end before writing code — the math is non-trivial, and this doc specifies every formula, constant, and file path. A junior dev (or a less capable model) should be able to ship this without follow-up questions.

---

## TL;DR

- A **parallax page**: an India map is a fixed full-viewport background; 12 foreground sections scroll over it.
- A **drop-pin marker** on the map moves continuously through the 12 Jyotirlinga positions, following a **Catmull-Rom spline**.
- The pin's position is driven by `useScroll()` from framer-motion.
- All 12 dots are always visible. The **active** dot pulses, scales up, and shows a tooltip. **Tap a dot** → smooth-scroll to that section.
- Highly responsive: works smoothly on phones (375px+) and desktop. Respects `prefers-reduced-motion`.

**Route:** `/plan/travel-jyotirlingas` (5th option in the `/plan` hub, sits next to `/plan/parallax`, `/plan/map`, `/plan/3d`, `/plan/itinerary`).

**Visual style:** dark theme matching the rest of the site. Map outline is a subtle dark gray on `#0a0a0a`; the pin and active dot are the accent color `#f48b29`.

---

## 1. Goal

Show the 12 Jyotirlingas in canonical shloka order as a parallax journey: the user scrolls down a long page; the India map stays fixed in the background; a pin glides through the 12 holy sites in order. Each scroll position corresponds to one stop.

When the user reaches the bottom, the pin is at Ghrishneshwar (#12) and a CTA placeholder invites them to plan a real yatra (the form lands in Phase 2).

This is a **showcase** / storytelling view, not an interactive planner. The page is meant to be scrolled top-to-bottom once.

---

## 2. Data — 12 Jyotirlingas

**File:** `src/data/jyotirlingas.ts`

### 2.1 Type

```ts
// src/data/jyotirlingas.ts
export type Jyotirlinga = {
  id: number                        // 1..12, in shloka order
  name: string                      // "Somnath"
  location: string                  // "Veraval, Gujarat"
  state: string                     // "Gujarat"
  coords: { lat: number; lng: number }
  copy: string                      // 2-3 lines, factual placeholder
}
```

### 2.2 Dataset (12 rows, in shloka order)

Lat/lng are approximate; cartographic accuracy is not required. The numbers are accurate enough that the dots land in the right region on the hand-traced India outline.

| # | Name | Location | State | Lat | Lng |
|---|---|---|---|---|---|
| 1 | Somnath | Veraval | Gujarat | 20.8880 | 70.4017 |
| 2 | Mallikarjuna | Srisailam | Andhra Pradesh | 16.0730 | 78.8681 |
| 3 | Mahakaleshwar | Ujjain | Madhya Pradesh | 23.1828 | 75.7685 |
| 4 | Omkareshwar | Khandwa | Madhya Pradesh | 22.2433 | 76.1517 |
| 5 | Vaidyanath | Deoghar | Jharkhand | 24.4920 | 86.7000 |
| 6 | Bhimashankar | Pune | Maharashtra | 19.0717 | 73.5519 |
| 7 | Rameshwaram | Rameswaram | Tamil Nadu | 9.2881 | 79.3174 |
| 8 | Nageshwar | Dwarka | Gujarat | 22.2453 | 68.9684 |
| 9 | Kashi Vishwanath | Varanasi | Uttar Pradesh | 25.3109 | 83.0107 |
| 10 | Trimbakeshwar | Nashik | Maharashtra | 19.9322 | 73.5306 |
| 11 | Kedarnath | Kedarnath | Uttarakhand | 30.7333 | 79.0667 |
| 12 | Ghrishneshwar | Aurangabad | Maharashtra | 19.8762 | 75.1433 |

### 2.3 Copy (2-3 lines per stop, factual placeholder)

```ts
export const jyotirlingas: Jyotirlinga[] = [
  {
    id: 1,
    name: "Somnath",
    location: "Veraval",
    state: "Gujarat",
    coords: { lat: 20.8880, lng: 70.4017 },
    copy: "The first of the 12 Jyotirlingas, on India's western coast at Veraval. The current temple structure dates to 1951; the site is mentioned in the Rigveda.",
  },
  {
    id: 2,
    name: "Mallikarjuna",
    location: "Srisailam",
    state: "Andhra Pradesh",
    coords: { lat: 16.0730, lng: 78.8681 },
    copy: "On the banks of the Krishna river in Srisailam. One of the few Jyotirlingas also recognized as a Shakti Peetha — a dual shrine.",
  },
  {
    id: 3,
    name: "Mahakaleshwar",
    location: "Ujjain",
    state: "Madhya Pradesh",
    coords: { lat: 23.1828, lng: 75.7685 },
    copy: "The only Jyotirlinga facing south (Dakshinamurti). Famous for the Bhasma Aarti ritual held at dawn.",
  },
  {
    id: 4,
    name: "Omkareshwar",
    location: "Khandwa",
    state: "Madhya Pradesh",
    coords: { lat: 22.2433, lng: 76.1517 },
    copy: "On an island shaped like the Om symbol in the Narmada river. Two temples — Omkareshwar and Mamleshwar — share the Jyotirlinga status.",
  },
  {
    id: 5,
    name: "Vaidyanath",
    location: "Deoghar",
    state: "Jharkhand",
    coords: { lat: 24.4920, lng: 86.7000 },
    copy: "In Deoghar, Jharkhand. Devotees walk the 105-km Shrawan Yatra carrying holy water from the Ganges.",
  },
  {
    id: 6,
    name: "Bhimashankar",
    location: "Pune",
    state: "Maharashtra",
    coords: { lat: 19.0717, lng: 73.5519 },
    copy: "In the Sahyadri range, ~130 km from Pune. Source of the Bhima river and surrounded by dense forest.",
  },
  {
    id: 7,
    name: "Rameshwaram",
    location: "Rameswaram",
    state: "Tamil Nadu",
    coords: { lat: 9.2881, lng: 79.3174 },
    copy: "On Pamban Island, connected to the mainland by the Adam's Bridge. One of the Char Dham sites.",
  },
  {
    id: 8,
    name: "Nageshwar",
    location: "Dwarka",
    state: "Gujarat",
    coords: { lat: 22.2453, lng: 68.9684 },
    copy: "Near Dwarka in Gujarat. The Shiva lingam here is enshrined as Nagnesh — the serpent king.",
  },
  {
    id: 9,
    name: "Kashi Vishwanath",
    location: "Varanasi",
    state: "Uttar Pradesh",
    coords: { lat: 25.3109, lng: 83.0107 },
    copy: "In the heart of Varanasi, on the western bank of the Ganges. One of the 12 Jyotirlingas and one of the holiest Shiva shrines.",
  },
  {
    id: 10,
    name: "Trimbakeshwar",
    location: "Nashik",
    state: "Maharashtra",
    coords: { lat: 19.9322, lng: 73.5306 },
    copy: "Near Nashik, at the source of the Godavari river. One of the four sites of the Kumbh Mela.",
  },
  {
    id: 11,
    name: "Kedarnath",
    location: "Kedarnath",
    state: "Uttarakhand",
    coords: { lat: 30.7333, lng: 79.0667 },
    copy: "In the Himalayas at 3,583 m — the highest of the 12 Jyotirlingas. Open only 6 months a year due to snow.",
  },
  {
    id: 12,
    name: "Ghrishneshwar",
    location: "Aurangabad",
    state: "Maharashtra",
    coords: { lat: 19.8762, lng: 75.1433 },
    copy: "Near the Ellora caves in Aurangabad. The 12th Jyotirlinga, completing the canonical pilgrimage circuit.",
  },
]

export default jyotirlingas
```

**Note on copy:** This is factual placeholder. The founder will replace it with curated copy in a later phase. Each section card carries a `// TODO(founder): replace with real copy` comment in the JSX.

---

## 3. Projection Math (lat/lng → SVG viewBox)

The map is a single SVG with `viewBox="0 0 1000 1000"`. India spans roughly:
- Lat: 8°N to 37°N (range 29°)
- Lng: 68°E to 97°E (range 29°)

We add 1° of padding on each side to keep India inside the viewBox with some breathing room:
- Lat: 6° to 38° (range 32°)
- Lng: 66°E to 98°E (range 32°)

### 3.1 Formula (equirectangular)

```ts
// src/lib/projection.ts
const BOUNDS = {
  minLat: 6,
  maxLat: 38,
  minLng: 66,
  maxLng: 98,
}

const VIEWBOX_WIDTH = 1000
const VIEWBOX_HEIGHT = 1000

export type Point = { x: number; y: number }

export function project(lat: number, lng: number): Point {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VIEWBOX_WIDTH
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEWBOX_HEIGHT
  return { x, y }
}
```

**Why equirectangular:** A simple linear projection. India is roughly 29°×29° in lat/lng, so a linear map is approximately square. We are not building a cartographically accurate map — we need the 12 dots to land in roughly the right region on the hand-traced outline.

**Y-axis inversion (critical, easy to get wrong):** SVG's y-axis points DOWN, but latitude increases UP. So we invert: `y = (maxLat - lat) * scale`. If you forget this, the entire map will be flipped vertically — India ends up looking like a mirror image, with Kedarnath at the bottom and Rameshwaram at the top.

### 3.2 Worked examples

Verify against the dataset above. The numbers must match exactly when the implementer runs the same code.

**Somnath** (lat 20.8880, lng 70.4017):
```
x = (70.4017 - 66) / (98 - 66) * 1000
  = 4.4017 / 32 * 1000
  = 137.55

y = (38 - 20.8880) / (38 - 6) * 1000
  = 17.112 / 32 * 1000
  = 534.75
```
→ (137.55, 534.75) — left-center of the viewBox. ✓ (Somnath is on India's western coast, mid-latitude.)

**Mallikarjuna** (lat 16.0730, lng 78.8681):
```
x = (78.8681 - 66) / 32 * 1000 = 402.13
y = (38 - 16.0730) / 32 * 1000 = 685.22
```
→ (402.13, 685.22) — right-of-center, lower half. ✓ (Srisailam is in central-south India.)

**Mahakaleshwar** (lat 23.1828, lng 75.7685):
```
x = (75.7685 - 66) / 32 * 1000 = 305.27
y = (38 - 23.1828) / 32 * 1000 = 463.04
```
→ (305.27, 463.04) — slightly left of center, slightly above center. ✓ (Ujjain is in central India, mid-latitude.)

**Kedarnath** (lat 30.7333, lng 79.0667):
```
x = (79.0667 - 66) / 32 * 1000 = 408.34
y = (38 - 30.7333) / 32 * 1000 = 227.09
```
→ (408.34, 227.09) — upper-center, near the top. ✓ (Kedarnath is in the Himalayas, the highest of the 12.)

**Rameshwaram** (lat 9.2881, lng 79.3174):
```
x = (79.3174 - 66) / 32 * 1000 = 416.17
y = (38 - 9.2881) / 32 * 1000 = 897.25
```
→ (416.17, 897.25) — near the bottom. ✓ (Rameshwaram is at India's southern tip.)

**Ghrishneshwar** (lat 19.8762, lng 75.1433):
```
x = (75.1433 - 66) / 32 * 1000 = 285.73
y = (38 - 19.8762) / 32 * 1000 = 566.13
```
→ (285.73, 566.13) — left of center, mid-latitude. ✓ (Aurangabad is in central-west India.)

If the implementer's results don't match these to within ±0.1, the projection is broken — likely a sign flip on `y` or a wrong constant.

---

## 4. Catmull-Rom Spline Math

The pin's path is a Catmull-Rom spline through the 12 projected (x, y) points. Straight-line interpolation between the 12 dots would have the pin cut through the Arabian Sea going Somnath → Mallikarjuna. Catmull-Rom produces a smooth curve that bends naturally between consecutive points, like a flight path on a map.

Catmull-Rom takes **4 control points** and produces a smooth curve through the **middle two** (`P1` and `P2`). For our 12 points, we have 11 segments. The first segment uses `P0 = P1` (clamped at the start); the last segment uses `P3 = P_last` (clamped at the end).

### 4.1 Formula (uniform Catmull-Rom, alpha = 0)

For segment from `P1` to `P2` with neighbors `P0` and `P3`, parameter `t ∈ [0, 1]`:

```
P(t) = 0.5 * (
  (2 * P1) +
  (-P0 + P2) * t +
  (2*P0 - 5*P1 + 4*P2 - P3) * t² +
  (-P0 + 3*P1 - 3*P2 + P3) * t³
)
```

Sanity checks:
- `t = 0` → `P(0) = 0.5 * 2*P1 = P1` ✓
- `t = 1` → `P(1) = 0.5 * (2*P1 + (-P0+P2) + (2*P0-5*P1+4*P2-P3) + (-P0+3*P1-3*P2+P3)) = 0.5 * 2*P2 = P2` ✓

```ts
// src/lib/catmull-rom.ts
import type { Point } from './projection'

export function catmullRom(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    ),
    y: 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    ),
  }
}
```

### 4.2 Worked example

First segment: `P0 = Somnath (clamp)`, `P1 = Somnath`, `P2 = Mallikarjuna`, `P3 = Mahakaleshwar`. Coordinates from §3.2:

- `P0 = (137.55, 534.75)`
- `P1 = (137.55, 534.75)`
- `P2 = (402.13, 685.22)`
- `P3 = (305.27, 463.04)`

At `t = 0.5` (midpoint of segment):
```
t2 = 0.25
t3 = 0.125

x = 0.5 * (
  2*137.55 +
  (-137.55 + 402.13) * 0.5 +
  (2*137.55 - 5*137.55 + 4*402.13 - 305.27) * 0.25 +
  (-137.55 + 3*137.55 - 3*402.13 + 305.27) * 0.125
)
= 0.5 * (
  275.10 +
  264.58 * 0.5 +
  (275.10 - 687.75 + 1608.52 - 305.27) * 0.25 +
  (-137.55 + 412.65 - 1206.39 + 305.27) * 0.125
)
= 0.5 * (
  275.10 +
  132.29 +
  890.60 * 0.25 +
  -626.02 * 0.125
)
= 0.5 * (275.10 + 132.29 + 222.65 - 78.25)
= 0.5 * 551.79
= 275.90
```

Linear midpoint between Somnath and Mallikarjuna would be `(137.55 + 402.13) / 2 = 269.84`. The Catmull-Rom midpoint at `t=0.5` is `275.90` — slightly to the right, because `P3` (Mahakaleshwar at `x=305.27`) pulls the curve right. This is correct behavior; the curve is leaning toward the next segment's direction.

If your midpoint x at t=0.5 is `269.84` exactly, you forgot the `P0`/`P3` neighbors — the formula is treating the segment as a straight line.

---

## 5. Polyline Pre-computation

We sample the Catmull-Rom spline at **20 points per segment** and concatenate into one polyline. Total length: 11 × 20 + 1 = **221 points**.

```ts
// src/lib/polyline.ts
import { jyotirlingas } from '@/data/jyotirlingas'
import { project, type Point } from '@/lib/projection'
import { catmullRom } from '@/lib/catmull-rom'

const SAMPLES_PER_SEGMENT = 20

// Pre-compute the 12 anchor points (projected from lat/lng)
const anchors: Point[] = jyotirlingas.map((j) => project(j.coords.lat, j.coords.lng))

// Pre-compute the full polyline (Catmull-Rom sampled densely)
export const polyline: Point[] = []

for (let i = 0; i < anchors.length - 1; i++) {
  const p0 = anchors[Math.max(0, i - 1)]                // CLAMP at start
  const p1 = anchors[i]
  const p2 = anchors[i + 1]
  const p3 = anchors[Math.min(anchors.length - 1, i + 2)] // CLAMP at end
  for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
    const t = s / SAMPLES_PER_SEGMENT
    polyline.push(catmullRom(p0, p1, p2, p3, t))
  }
}
polyline.push(anchors[anchors.length - 1])

// Also export the 12 anchor points for the dots
export const dotPositions: Point[] = anchors

// Sanity check: polyline.length should be 11 * 20 + 1 = 221
export const POLYLINE_LENGTH = polyline.length
```

**Why 20 samples per segment:** Smooth enough that the pin never visibly jitters between adjacent points, but not so many that we waste memory. 221 points × 2 numbers × 8 bytes ≈ 3.5 KB. Negligible.

**Why pre-compute at module load, not per-frame:** The polyline never changes (data is static). Computing once at import is the standard pattern; reading from the array is O(1).

**The clamp lines (`Math.max(0, i - 1)` and `Math.min(...i + 2))` are easy to forget.** If you forget them, the first and last segments will produce wildly wrong positions (using `undefined` neighbors).

---

## 6. Scroll Driver

Framer-motion's `useScroll()` returns a `MotionValue<number>` named `scrollYProgress` that goes from 0 to 1 as the user scrolls from the top of the page to the bottom. We map this to the polyline.

```tsx
// src/app/plan/travel-jyotirlingas/TravelJyotirlingasPage.tsx
import { useEffect } from 'react'
import { useScroll, useMotionValue, useReducedMotion } from 'framer-motion'
import { polyline, dotPositions } from '@/lib/polyline'

export default function TravelJyotirlingasPage() {
  const { scrollYProgress } = useScroll()
  const reducedMotion = useReducedMotion()

  const pinX = useMotionValue(0)
  const pinY = useMotionValue(0)

  useEffect(() => {
    return scrollYProgress.on('change', (t) => {
      // Map t (0..1) to polyline index
      let idx: number
      if (reducedMotion) {
        // Reduced motion: snap to nearest dot, no smooth interpolation
        idx = Math.round(t * (dotPositions.length - 1))
        // For reduced motion, use the dot position directly (no Catmull-Rom)
        const snapped = dotPositions[idx]
        pinX.set(snapped.x)
        pinY.set(snapped.y)
        return
      }

      // Normal mode: smooth interpolation along the Catmull-Rom polyline
      idx = t * (polyline.length - 1)
      const i = Math.floor(idx)
      const frac = idx - i
      const p1 = polyline[i]
      const p2 = polyline[Math.min(polyline.length - 1, i + 1)]
      // Linear interpolation between adjacent polyline samples
      // (the polyline is already dense enough that linear interp is invisible)
      pinX.set(p1.x + (p2.x - p1.x) * frac)
      pinY.set(p1.y + (p2.y - p1.y) * frac)
    })
  }, [scrollYProgress, pinX, pinY, reducedMotion])

  // ... rest of the component
}
```

**Why use `useEffect` + `on('change', ...)`:** This subscribes to the motion value's updates and runs on every frame **without re-rendering React**. The motion value is mutable; the listener pushes new (x, y) into the motion values, which the `motion.g` reads directly via the style prop. This is the standard framer-motion pattern for "do something in response to a scroll value" without throttling the renderer.

**Why the final linear interpolation between `p1` and `p2`:** `idx` is a float (e.g., 73.4). We need to interpolate between `polyline[73]` and `polyline[74]` for smooth motion. The polyline is dense enough (20 samples per segment) that linear interpolation between adjacent points is invisible. The Catmull-Rom already shaped the curve; we just walk it linearly.

**Why `Math.min(polyline.length - 1, i + 1)`:**
At `t = 1.0` (user at very bottom of page), `idx = 220.0`, so `i = 220`, `i + 1 = 221`. We need `polyline[220]` (the last point, which is the 12th anchor) and to not access `polyline[221]` (out of bounds). The `Math.min` clamps it.

---

## 7. Pin Component

The pin is a `motion.g` (SVG group) inside the map SVG. It uses `style={{ x: pinX, y: pinY }}` so framer-motion sets `transform="translate(x, y)"` on the group directly. **No React re-renders** happen during scroll — framer-motion mutates the SVG transform attribute via direct DOM access.

### 7.1 Why motion.g, not motion.div

A `motion.div` would be a separate HTML element overlaid on the SVG. To position it correctly we'd need to convert viewBox coordinates to screen coordinates on every resize. By putting the pin **inside** the SVG as a `motion.g`, we share the SVG's viewBox transform context — pin coordinates are in viewBox space, the SVG handles all the scaling.

### 7.2 The pin SVG itself

```tsx
// src/app/plan/travel-jyotirlingas/Pin.tsx
import { useReducedMotion } from 'framer-motion'

export function Pin() {
  const reducedMotion = useReducedMotion()

  return (
    <g>
      {/* Outer pulsing ring — only when motion is allowed */}
      {!reducedMotion && (
        <circle r="14" fill="#f48b29" opacity="0.25">
          <animate
            attributeName="r"
            values="10;20;10"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Outer solid dot */}
      <circle r="7" fill="#f48b29" stroke="#0a0a0a" strokeWidth="2" />

      {/* Center hole (gives it a "pin" look) */}
      <circle r="2.5" fill="#0a0a0a" />
    </g>
  )
}
```

**Pin sizing in viewBox units:** Outer pulsing ring r=14 to 20, inner solid dot r=7, center hole r=2.5. At 1000-unit viewBox rendered into a 375px phone screen, these become 5.25px, 2.6px, and 0.94px respectively — small but visible. The outer pulsing ring's stroke creates a glow effect even at small sizes.

**Why the center hole:** A solid orange dot is too "blob"-like. A small dark center makes it read as a pin marker.

### 7.3 Mounting the pin

```tsx
<svg viewBox="0 0 1000 1000" className="fixed inset-0 w-full h-full">
  <IndiaOutline />
  <StateBoundaries />
  {jyotirlingas.map((j, i) => (
    <Dot
      key={j.id}
      point={dotPositions[i]}
      active={activeIndex === i}
      onClick={() => jumpToSection(i)}
    />
  ))}
  <motion.g style={{ x: pinX, y: pinY }} className="pointer-events-none">
    <Pin />
  </motion.g>
</svg>
```

`pointer-events-none` on the motion.g so the pin doesn't intercept clicks meant for the dots beneath it.

---

## 8. Dot Rendering

12 dots, one per Jyotirlinga. All visible. Active dot is in accent color and pulses.

### 8.1 The Dot component

```tsx
// src/app/plan/travel-jyotirlingas/Dot.tsx
import { motion, useReducedMotion } from 'framer-motion'
import type { Point } from '@/lib/projection'

type DotProps = {
  point: Point
  active: boolean
  onClick: () => void
}

export function Dot({ point, active, onClick }: DotProps) {
  const reducedMotion = useReducedMotion()

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Invisible larger hit area for mobile (30 viewBox units ≈ 11px on 375px) */}
      <circle cx={point.x} cy={point.y} r="30" fill="transparent" />

      {/* Visible dot */}
      <motion.circle
        cx={point.x}
        cy={point.y}
        animate={{
          r: active ? (reducedMotion ? 8 : [6, 10, 6]) : 4,
        }}
        transition={{
          duration: 1.5,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        fill={active ? '#f48b29' : '#666666'}
      />
    </g>
  )
}
```

**Why a transparent larger circle for hit area:** On a 375px-wide phone, a 4-unit-radius dot is roughly 1.5px — too small to tap. The 30-unit transparent circle gives an 11px hit area, which is the bare minimum for a comfortable tap. The transparent circle doesn't render but does receive pointer events.

**Why `animate` instead of `transition` for the radius:** `motion.circle`'s `r` is an SVG attribute. Framer-motion can animate it directly, but it must be inside `animate` (not as a CSS transition) to be smooth. Using `animate` with a keyframe array `[6, 10, 6]` gives a "breathing" pulse.

**Why `reducedMotion ? 8 : [6, 10, 6]`:** When reduced motion is on, we set the active dot's radius to a static 8 (just bigger than inactive), no animation.

### 8.2 Active dot label

The active dot gets a tooltip showing the temple name. Place it as a separate text element next to the dot:

```tsx
{/* Inside the map SVG, alongside the dot mapping */}
{dotPositions.map((p, i) => (
  <motion.text
    key={`label-${jyotirlingas[i].id}`}
    x={p.x + 14}
    y={p.y + 4}
    fill="#f48b29"
    fontSize="14"
    fontFamily="var(--font-inter)"
    initial={{ opacity: 0 }}
    animate={{ opacity: activeIndex === i ? 1 : 0 }}
    transition={{ duration: 0.3 }}
    style={{ pointerEvents: 'none' }}
  >
    {jyotirlingas[i].name}
  </motion.text>
))}
```

The label fades in over 300ms when the dot becomes active. `pointerEvents: 'none'` so the label doesn't block clicks on the dot.

---

## 9. Active Dot Detection

The "active" dot is the one whose corresponding section is most centered in the viewport. We use **IntersectionObserver** because it's robust to layout changes (variable section heights) and only fires when sections enter/leave the viewport — no per-frame React state updates.

```tsx
// src/app/plan/travel-jyotirlingas/TravelJyotirlingasPage.tsx
import { useEffect, useRef, useState } from 'react'

export default function TravelJyotirlingasPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    jyotirlingas.forEach((_, i) => {
      const el = sectionRefs.current[i]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(i)
          }
        },
        { threshold: [0, 0.5, 1] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // ...
}
```

**Why 0.5 threshold:** The "active" section is the one that occupies at least half the viewport. This makes the active dot transition feel intentional — the dot doesn't flicker as the user scrolls slowly through a boundary.

**Why the section refs:** Each section needs a DOM ref so the observer can attach. The ref array is populated when the section components mount:

```tsx
{jyotirlingas.map((j, i) => (
  <section
    key={j.id}
    ref={(el) => { sectionRefs.current[i] = el }}
    className="min-h-screen flex items-center px-6 md:px-16"
  >
    {/* ... */}
  </section>
))}
```

**Why not use `scrollYProgress` directly to compute activeIndex:** The page is 12×100vh, but the section content might be slightly taller than 100vh on a small screen (e.g., the copy wraps to 4 lines instead of 3), causing the section-to-viewport mapping to drift. IntersectionObserver doesn't care about exact pixel positions; it just observes what's actually in the viewport.

**Sanity check the alignment:** With all sections set to `min-h-screen` (100vh) and the page being 12 viewports tall, when section `i` is 50% in the viewport, `scrollYProgress ≈ i/11`, and the pin is at the `i`-th point in the polyline. Active dot, pin position, and section content are all in sync.

---

## 10. Tap-to-Jump

When the user clicks or taps a dot, smooth-scroll to that section.

```ts
function jumpToSection(index: number) {
  // Each section is 1 viewport tall, so section i starts at i * window.innerHeight
  const targetY = index * window.innerHeight
  window.scrollTo({ top: targetY, behavior: 'smooth' })
}
```

**Why `index * window.innerHeight`:** With each section set to `min-h-screen` (100vh), section `i` starts at exactly `i * 100vh` of scroll. This is the cleanest mapping.

**Reduced motion consideration:** `window.scrollTo({ behavior: 'smooth' })` is an instant jump with animation. On iOS Safari, smooth scroll can sometimes feel laggy. For reduced-motion users, consider falling back to instant:

```ts
function jumpToSection(index: number) {
  const targetY = index * window.innerHeight
  window.scrollTo({
    top: targetY,
    behavior: reducedMotion ? 'auto' : 'smooth',
  })
}
```

**Note on dot click events inside SVG:** SVG `<g>` elements do receive `onClick` events in React, but only if they have a fill or stroke (the transparent hit-area circle handles this). The Pin is `pointer-events-none`, so it won't intercept dot clicks.

---

## 11. Section Layout (Foreground Cards)

12 sections, one per Jyotirlinga. Each is `min-h-screen` tall. Inside each, a card with the stop's copy, positioned on alternating sides so the map shows through the other side.

### 11.1 Pattern: alternating left/right

```
Section 1  [ MAP shows on right, card on left   ]
Section 2  [ card on right, MAP shows on left   ]
Section 3  [ MAP shows on right, card on left   ]
...
Section 12 [ card on right, MAP shows on left   ]
```

The pattern creates a zigzag rhythm as the user scrolls. The map is always visible in the gap on the opposite side from the card.

### 11.2 Code

```tsx
// src/app/plan/travel-jyotirlingas/TravelJyotirlingasPage.tsx
return (
  <>
    {/* Map — fixed background */}
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
      <IndiaMap pinX={pinX} pinY={pinY} activeIndex={activeIndex} />
    </div>

    {/* Foreground sections — scroll over the map */}
    <main className="relative z-10">
      {jyotirlingas.map((j, i) => {
        const isLeft = i % 2 === 0
        return (
          <section
            key={j.id}
            ref={(el) => { sectionRefs.current[i] = el }}
            className="min-h-screen flex items-center px-6 md:px-16"
          >
            <div
              className={cn(
                'w-full md:w-1/2 bg-black/60 backdrop-blur-md p-8 md:p-10 rounded-lg',
                isLeft ? 'mr-auto' : 'ml-auto'
              )}
            >
              <p className="text-xs md:text-sm uppercase tracking-widest text-[#f48b29]">
                Stop {j.id} of 12 · {j.location}, {j.state}
              </p>
              <h2 className="mt-2 text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] text-white">
                {j.name}
              </h2>
              <p className="mt-4 text-base md:text-lg text-zinc-300 leading-relaxed">
                {j.copy}
              </p>
              {/* TODO(founder): replace copy with curated version */}
            </div>
          </section>
        )
      })}

      {/* CTA placeholder at the bottom — see §15 */}
      <CtaPlaceholder />
    </main>
  </>
)
```

**`bg-black/60 backdrop-blur-md`:** A semi-transparent dark card with backdrop blur. The map shows through faintly behind the card, but the card content is readable.

**`font-[family-name:var(--font-cinzel)]`:** Uses the existing site's Cinzel serif for headings, per AGENTS.md.

**`text-[#f48b29]`:** Direct hex value for the accent — Tailwind doesn't have a default class for it.

**`cn()` from `src/lib/utils.ts`:** Use the existing class-merging helper for conditional classes.

### 11.3 Mobile behavior

On mobile, the alternating left/right pattern collapses — the card takes full width (`w-full`), the alternating sides become meaningless. The map is still visible because it's `fixed inset-0` underneath.

The cards are `w-full md:w-1/2`, so on mobile they're full-width and on desktop they're half-width. The map's right or left half shows through on desktop; on mobile, the card fills the screen and the map is only visible between sections (when the user scrolls past the 100vh section height).

If this looks bad on mobile, an alternative: stack the map smaller (e.g., 30vh sticky) above the cards. For v1, keep it simple — full-screen map, full-width cards on mobile, accept that the map is only fully visible between sections.

---

## 12. Reduced Motion

Use framer-motion's `useReducedMotion()` hook. It returns `true` when the user has set `prefers-reduced-motion: reduce` in their OS.

```tsx
import { useReducedMotion } from 'framer-motion'

const reducedMotion = useReducedMotion()  // boolean | null
```

Treat `null` (SSR/initial) the same as `false` (motion allowed).

### 12.1 What changes in reduced motion

| Element | Normal mode | Reduced motion |
|---|---|---|
| Pin position interpolation | Smooth along Catmull-Rom polyline | Snap to nearest dot, no interp |
| Pin pulse ring | Pulsing 2s animation | Hidden (no `<animate>` tags rendered) |
| Active dot pulse | Keyframe radius animation | Static 8-unit radius |
| Active label fade-in | 300ms transition | Still fade (subtle, acceptable) |
| Tap-to-jump scroll | `behavior: 'smooth'` | `behavior: 'auto'` (instant) |
| `prefers-reduced-motion` query | Active | Active |

The `useEffect` in §6 already branches on `reducedMotion` to snap the pin. Apply the same branch in the Pin and Dot components to skip the pulse animations.

---

## 13. Mobile Considerations

### 13.1 SVG auto-scaling

The map SVG has `viewBox="0 0 1000 1000"` and `className="fixed inset-0 w-full h-full"`. CSS scales the SVG to fit the viewport while preserving the viewBox aspect ratio. **No JavaScript resize handlers needed** — the SVG scales automatically.

The pin, dots, and labels are all in viewBox coordinates, so they scale with the SVG. A 7-unit-radius dot on a 1000-unit viewBox becomes:
- 7px on a 1000px-wide desktop
- 2.6px on a 375px-wide phone

Still visible, but small. The pulsing ring (r=14-20) gives the pin visual weight even when small.

### 13.2 Hit areas

Every interactive dot has a transparent 30-unit-radius hit-area circle (per §8.1). On a 375px phone:
- Visible dot: 4 units × (375/1000) = 1.5px (visual only)
- Hit area: 30 units × (375/1000) = 11.25px (tap target)

**11.25px is below the Apple HIG recommendation of 44px** for tap targets. If tap accuracy is a problem in testing, increase the hit area to 50 units (≈ 19px on 375px phone). The trade-off: bigger hit areas overlap, so closely-spaced dots (e.g., Mahakaleshwar and Omkareshwar, both in MP) become harder to tap individually.

**Recommended:** start with 30 units, test on a real phone, increase to 50 only if taps are missing.

### 13.3 Pinch-zoom (do nothing)

iOS Safari and Android Chrome allow pinch-zoom on the page by default. The SVG will scale with the page. **Do not disable zoom** — it would break accessibility for users who need it.

### 13.4 `100dvh` vs `100vh` on mobile

On mobile browsers, `100vh` includes the area behind the URL bar, so a `min-h-screen` section can be slightly taller than the visible viewport. The pin's position is in viewBox space, not screen space, so this doesn't break anything visually — the pin still moves through the map correctly. The minor overshoot is unnoticeable.

**Optional improvement:** use `min-h-[100dvh]` (dynamic viewport height) for sections instead of `min-h-screen`. `dvh` accounts for the URL bar, so sections match the actual visible viewport. Add the Tailwind v4 plugin or use arbitrary values. Skip this for v1.

### 13.5 Touch performance

Animating SVG transform attributes is GPU-accelerated in modern browsers. The pin's position is updated on every scroll frame via the `on('change', ...)` listener. On a low-end phone, you might see 30-45 FPS instead of 60 FPS. This is acceptable — the pin motion is smooth, just not buttery.

If frame rate is bad:
- Throttle the listener to update every other frame (use `requestAnimationFrame` debouncing)
- Reduce `SAMPLES_PER_SEGMENT` from 20 to 10 (less smooth polyline interpolation, but faster)

For v1, ship with 60 FPS target. Optimize only if testing shows issues.

---

## 14. Visual Style

### 14.1 Color palette

| Element | Color | Tailwind / hex | Notes |
|---|---|---|---|
| Page background | `#0a0a0a` | `bg-[#0a0a0a]` | Site bg, behind map |
| Map — India outline | `#2a2a2a` | `stroke-[#2a2a2a]` | Subtle dark gray |
| Map — state boundaries | `#1f1f1f` | `stroke-[#1f1f1f]` | Even subtler; optional in v1 |
| Dot — inactive | `#666666` | `fill-[#666666]` | Muted gray |
| Dot — active | `#f48b29` | `fill-[#f48b29]` | Site accent |
| Pin — solid | `#f48b29` | `fill-[#f48b29]` | Site accent |
| Pin — ring stroke | `#0a0a0a` | `stroke-[#0a0a0a]` | Same as bg, separates pin from map |
| Pin — pulsing ring | `#f48b29 @ 0.25 opacity` | `fill="#f48b29" opacity="0.25"` | Glow effect |
| Section card bg | `bg-black/60` | Tailwind | Semi-transparent, map shows through |
| Section — label | `#f48b29` | `text-[#f48b29]` | Accent, small caps |
| Section — heading | `#ffffff` | `text-white` | Cinzel font |
| Section — body | `#d4d4d8` (zinc-300) | `text-zinc-300` | Readable on dark |

### 14.2 Typography

Use the existing site fonts per AGENTS.md:
- Headings: `var(--font-cinzel)` (Cinzel)
- Body: `var(--font-inter)` (Inter)
- Map label tooltip: `var(--font-inter)` at 14 viewBox units

### 14.3 Spacing

- Section: `min-h-screen` (100vh), `px-6 md:px-16` horizontal padding
- Card: `p-8 md:p-10` internal padding
- Card width: `w-full md:w-1/2`
- Section gap: none (each section is exactly 100vh, no gap between)
- Card → map gap: handled by `w-1/2` (the other half is the map showing through)

---

## 15. India Outline + State Boundaries

### 15.1 Source

Hand-trace a simplified India outline in `IndiaOutline.tsx` (~150 lines of SVG path data). **We own the data**, no license concerns. State boundaries can be hand-traced in `StateBoundaries.tsx` (~200 more lines) or omitted in v1.

### 15.2 Outline path

The country outline is a single `<path d="...">` element. Use a stylized but recognizable shape — the goal is "this reads as India," not "this is a GIS-grade map."

Suggested approach:
1. Find a low-resolution India outline SVG (Wikimedia, public domain) as a reference.
2. Hand-trace it into ~30-50 anchor points.
3. Smooth the result with a Bézier path.

Path data should target the 1000×1000 viewBox. The path should fit roughly:
- Width: 50 to 950 (range 900, with some padding)
- Height: 50 to 950 (range 900, with some padding)

The 12 dots (which we computed to land in the right regions) should fall on or near the outline.

**If the dots fall in the wrong place relative to the outline** (e.g., Somnath is in the sea, Kedarnath is outside the country's borders), the outline is wrong, not the projection. Re-trace or re-position the outline.

### 15.3 State boundaries (v1: optional)

Add a second `<path>` for state boundaries. v1 can ship with just the country outline and a `// TODO(state-boundaries):` comment. Adding state boundaries makes the map feel more textured and helps the user orient, but it's not critical.

If adding:
- Same `viewBox="0 0 1000 1000"`
- `stroke="#1f1f1f" strokeWidth="0.5" fill="none"` (very subtle)
- ~20-30 hand-traced paths (one per state, or grouped by region)

---

## 16. File Structure

```
src/
  app/
    plan/
      travel-jyotirlingas/
        page.tsx                       # server component, exports metadata
        TravelJyotirlingasPage.tsx     # client component, the page (all the logic)
        IndiaMap.tsx                   # SVG: outline + state boundaries + dots + pin
        Pin.tsx                        # the drop-pin marker
        Dot.tsx                        # interactive dot (with hit area)
        CtaPlaceholder.tsx             # bottom CTA (same as other variants)
  data/
    jyotirlingas.ts                    # 12 stops with lat/lng, copy
  lib/
    projection.ts                      # lat/lng → viewBox
    catmull-rom.ts                     # spline formula
    polyline.ts                        # pre-computed Catmull-Rom polyline
```

**Total new files: 9** (3 in `app/plan/travel-jyotirlingas/`, 1 in `data/`, 3 in `lib/`, plus the existing `CtaPlaceholder.tsx` if not yet created).

### 16.1 What each file does

| File | Purpose |
|---|---|
| `page.tsx` | Server component. Exports `metadata` (title, description, OG). Imports and renders `<TravelJyotirlingasPage />`. |
| `TravelJyotirlingasPage.tsx` | Client component. Contains the scroll driver, active-index state, section refs, and the JSX tree. |
| `IndiaMap.tsx` | Pure SVG component. Takes `pinX`, `pinY`, `activeIndex` as props. Renders the outline, dots, and pin. |
| `Pin.tsx` | Pure SVG. The drop-pin shape (outer ring, solid dot, center hole). |
| `Dot.tsx` | Pure SVG. One dot, with hit area and pulse animation. |
| `CtaPlaceholder.tsx` | Same CTA placeholder as variants A-D. Bottom of the page. |
| `jyotirlingas.ts` | The dataset from §2. |
| `projection.ts` | The `project()` function from §3. |
| `catmull-rom.ts` | The `catmullRom()` function from §4. |
| `polyline.ts` | The pre-computed polyline from §5. |

### 16.2 `page.tsx` skeleton

```tsx
// src/app/plan/travel-jyotirlingas/page.tsx
import type { Metadata } from 'next'
import TravelJyotirlingasPage from './TravelJyotirlingasPage'

export const metadata: Metadata = {
  title: 'Travel the 12 Jyotirlingas',
  description:
    'Follow the 12 Jyotirlingas in canonical pilgrimage order — a parallax journey across India on an interactive map.',
  openGraph: {
    title: 'Travel the 12 Jyotirlingas | Tripper by Essan',
    description:
      'Follow the 12 Jyotirlingas in canonical pilgrimage order on an interactive map.',
    type: 'website',
  },
  // No robots — this is public, indexable
}

export default function Page() {
  return <TravelJyotirlingasPage />
}
```

`page.tsx` is a **server component** (no `"use client"` directive). It exists only to export metadata and delegate to the client component. This is the standard Next.js App Router pattern.

### 16.3 `TravelJyotirlingasPage.tsx` skeleton

The full file structure (combining all the code snippets from §6, §9, §10, §11):

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValue, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { jyotirlingas } from '@/data/jyotirlingas'
import { polyline, dotPositions } from '@/lib/polyline'
import { IndiaMap } from './IndiaMap'
import { CtaPlaceholder } from './CtaPlaceholder'

export default function TravelJyotirlingasPage() {
  const { scrollYProgress } = useScroll()
  const reducedMotion = useReducedMotion()
  const pinX = useMotionValue(0)
  const pinY = useMotionValue(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Scroll driver — see §6
  useEffect(() => {
    return scrollYProgress.on('change', (t) => {
      if (reducedMotion) {
        const idx = Math.round(t * (dotPositions.length - 1))
        const snapped = dotPositions[idx]
        pinX.set(snapped.x)
        pinY.set(snapped.y)
        return
      }
      const idx = t * (polyline.length - 1)
      const i = Math.floor(idx)
      const frac = idx - i
      const p1 = polyline[i]
      const p2 = polyline[Math.min(polyline.length - 1, i + 1)]
      pinX.set(p1.x + (p2.x - p1.x) * frac)
      pinY.set(p1.y + (p2.y - p1.y) * frac)
    })
  }, [scrollYProgress, pinX, pinY, reducedMotion])

  // Active dot detection — see §9
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    jyotirlingas.forEach((_, i) => {
      const el = sectionRefs.current[i]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(i)
          }
        },
        { threshold: [0, 0.5, 1] }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Tap-to-jump — see §10
  function jumpToSection(index: number) {
    const targetY = index * window.innerHeight
    window.scrollTo({
      top: targetY,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <>
      {/* Fixed background map */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        <IndiaMap
          pinX={pinX}
          pinY={pinY}
          activeIndex={activeIndex}
          onDotClick={jumpToSection}
        />
      </div>

      {/* Foreground sections */}
      <main className="relative z-10">
        {jyotirlingas.map((j, i) => {
          const isLeft = i % 2 === 0
          return (
            <section
              key={j.id}
              ref={(el) => { sectionRefs.current[i] = el }}
              className="min-h-screen flex items-center px-6 md:px-16"
            >
              <div
                className={cn(
                  'w-full md:w-1/2 bg-black/60 backdrop-blur-md p-8 md:p-10 rounded-lg',
                  isLeft ? 'mr-auto' : 'ml-auto'
                )}
              >
                <p className="text-xs md:text-sm uppercase tracking-widest text-[#f48b29]">
                  Stop {j.id} of 12 · {j.location}, {j.state}
                </p>
                <h2 className="mt-2 text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] text-white">
                  {j.name}
                </h2>
                <p className="mt-4 text-base md:text-lg text-zinc-300 leading-relaxed">
                  {j.copy}
                </p>
                {/* TODO(founder): replace with curated copy */}
              </div>
            </section>
          )
        })}
        <CtaPlaceholder />
      </main>
    </>
  )
}
```

### 16.4 `IndiaMap.tsx` skeleton

```tsx
// src/app/plan/travel-jyotirlingas/IndiaMap.tsx
'use client'

import { motion, type MotionValue, useReducedMotion } from 'framer-motion'
import { jyotirlingas } from '@/data/jyotirlingas'
import { dotPositions } from '@/lib/polyline'
import { Pin } from './Pin'
import { Dot } from './Dot'

type IndiaMapProps = {
  pinX: MotionValue<number>
  pinY: MotionValue<number>
  activeIndex: number
  onDotClick: (index: number) => void
}

export function IndiaMap({ pinX, pinY, activeIndex, onDotClick }: IndiaMapProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* India outline */}
      <path
        d="..."
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* State boundaries (optional) */}
      {/* <StateBoundaries /> */}

      {/* Dots */}
      {dotPositions.map((p, i) => (
        <Dot
          key={jyotirlingas[i].id}
          point={p}
          active={activeIndex === i}
          onClick={() => onDotClick(i)}
        />
      ))}

      {/* Active label */}
      {dotPositions.map((p, i) => (
        <motion.text
          key={`label-${jyotirlingas[i].id}`}
          x={p.x + 14}
          y={p.y + 4}
          fill="#f48b29"
          fontSize="14"
          fontFamily="var(--font-inter)"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeIndex === i ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: 'none' }}
        >
          {jyotirlingas[i].name}
        </motion.text>
      ))}

      {/* Pin (last so it sits on top) */}
      <motion.g style={{ x: pinX, y: pinY }} className="pointer-events-none">
        <Pin />
      </motion.g>
    </svg>
  )
}
```

The `d="..."` for the India outline path is the only major piece of data not specified in this doc — see §15.1 for how to source/trade it.

---

## 17. Build Order (execute top-to-bottom)

1. **Install framer-motion** (if not already installed for variants A/B):
   ```bash
   npm install framer-motion
   ```
   Verify with `npm run build` that nothing breaks.

2. **Write `src/data/jyotirlingas.ts`** — Copy the dataset from §2.3 verbatim. Run `npm run typecheck` and confirm zero errors.

3. **Write `src/lib/projection.ts`** — Copy the `project()` function from §3.1. Verify with the worked examples in §3.2 (use `console.log` if needed, then remove).

4. **Write `src/lib/catmull-rom.ts`** — Copy the `catmullRom()` function from §4.1. Verify with the worked example in §4.2.

5. **Write `src/lib/polyline.ts`** — Copy the polyline pre-computation from §5. Log `POLYLINE_LENGTH` to confirm it equals 221.

6. **Write the India outline** — Hand-trace `IndiaOutline.tsx` (and optionally `StateBoundaries.tsx`). See §15. Verify the 12 dots land in the right regions relative to the outline (visual check in dev server).

7. **Scaffold the route**:
   - `src/app/plan/travel-jyotirlingas/page.tsx` (server, metadata) — see §16.2.
   - `src/app/plan/travel-jyotirlingas/Pin.tsx` — see §7.2.
   - `src/app/plan/travel-jyotirlingas/Dot.tsx` — see §8.1.
   - `src/app/plan/travel-jyotirlingas/IndiaMap.tsx` — see §16.4.
   - `src/app/plan/travel-jyotirlingas/CtaPlaceholder.tsx` — same as other variants (TODO founder to provide contact link).
   - `src/app/plan/travel-jyotirlingas/TravelJyotirlingasPage.tsx` — see §16.3.

8. **Wire the hub** — Add a 5th card to `/plan` (the hub page) linking to `/plan/travel-jyotirlingas`. Title: "Parallax Map" or "Travel the Jyotirlingas." Add the route to `sitemap.ts` with `priority: 0.5, changeFrequency: 'monthly'`.

9. **Typecheck + build**:
   ```bash
   npm run typecheck
   npm run build
   ```
   Both must pass with zero errors.

10. **Smoke test**:
    - `npm run dev` → visit `/plan/travel-jyotirlingas`
    - Verify the map renders, the 12 dots are in the right places, the pin starts at Somnath
    - Scroll slowly → pin moves smoothly along the polyline
    - Scroll fast → pin still tracks (no lag spikes)
    - At each stop, the corresponding dot becomes active (orange + pulse + label)
    - Tap a dot → page smooth-scrolls to that section
    - Open in mobile emulator (375px) → cards fill the width, dots have a tap-friendly hit area, pin still moves
    - Toggle `prefers-reduced-motion: reduce` in DevTools → pin snaps to nearest dot, no pulse animations
    - Tab through with keyboard → all 12 dots are focusable, Enter activates the tap-to-jump

---

## 18. Acceptance Criteria

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` passes with zero errors and zero new warnings.
- [ ] `/plan/travel-jyotirlingas` loads in desktop Chrome without console errors.
- [ ] `/plan/travel-jyotirlingas` loads in mobile Safari (iOS 16+) without console errors.
- [ ] The map renders with all 12 dots visible.
- [ ] The pin starts at Somnath (top-left of the visible map area).
- [ ] Scrolling down the page moves the pin continuously along a smooth path through the 12 dots in order.
- [ ] The pin reaches Ghrishneshwar at the bottom of the page.
- [ ] Each section's content (label, name, copy) matches its corresponding dot.
- [ ] The active dot (whose section is most centered in the viewport) is visibly distinct: accent color, larger radius, pulsing animation, label tooltip.
- [ ] Tapping any dot smooth-scrolls to its corresponding section.
- [ ] On a 375px-wide viewport, the cards fill the width and the pin/dots are still visible and tappable.
- [ ] With `prefers-reduced-motion: reduce` set, the pin snaps to the nearest dot, the pulse animations are disabled, and tap-to-jump is instant.
- [ ] The hub at `/plan` lists this route as the 5th option.
- [ ] `sitemap.xml` includes `/plan/travel-jyotirlingas` with `priority: 0.5, changeFrequency: 'monthly'`.
- [ ] No edits to AGENTS.md, CHANGELOG.md, ROADMAP.md, or PROGRESS.md.
- [ ] No changes to DB schema, auth, cart, Razorpay files, or any other variant's files.

---

## 19. Risks

| Risk | Mitigation |
|---|---|
| Hand-traced India outline is inaccurate, dots fall in the wrong place | Build the outline FIRST (before pin/dot work), visually check the 12 dots land in the right regions, iterate on the path until accurate. |
| Catmull-Rom math is implemented wrong (forgotten clamp, sign flip, wrong coefficients) | Verify with the worked example in §4.2. If your t=0.5 midpoint is exactly the linear midpoint, the neighbors are missing. |
| Projection y-axis is inverted, India appears mirrored | Verify with the worked examples in §3.2. Somnath should be at y=534 (mid), Rameshwaram at y=897 (near bottom), Kedarnath at y=227 (near top). If Rameshwaram is at y=102, the y-flip is wrong. |
| Pin position jumps or stutters on mobile | Verify the polyline is pre-computed (not per-frame). Verify `useEffect` returns the unsubscribe from `on('change', ...)` (otherwise listeners leak). |
| Active dot flickers during scroll | The 0.5 IntersectionObserver threshold should prevent flicker. If it persists, increase to 0.6 or use the scrollYProgress-based approach as a fallback. |
| Dot hit areas overlap on mobile, hard to tap individual dots | The 4 dots in Maharashtra (#6 Bhimashankar, #10 Trimbakeshwar, #12 Ghrishneshwar) and the 2 in MP (#3 Mahakaleshwar, #4 Omkareshwar) are close. Increase the hit area to 50 units (still acceptable, slightly larger). |
| State boundaries look messy or amateur | Defer to a later phase. Ship v1 with just the country outline + a `// TODO(state-boundaries):` comment. |
| Tap-to-jump smooth scroll feels laggy on iOS Safari | Acceptable trade-off for v1. iOS Safari has known issues with `window.scrollTo({ behavior: 'smooth' })` on long pages. If it's a problem, use a manual `requestAnimationFrame` loop to animate `window.scrollY` for ~600ms. |
| The founder doesn't have an India outline SVG to hand-trace from | Use a public-domain reference (Wikimedia's India outline, Natural Earth) to hand-trace. Spend ~30 min on this. The result is owned, license-clean, and only ~150 lines. |
| `useScroll()` returns `null` on first render in some edge cases | Framer-motion's `useScroll()` always returns an object with `scrollYProgress` as a `MotionValue`. The `null` SSR concern is mitigated by marking the page as `'use client'`. |

---

## 20. Open Questions for the Implementer

- **India outline source** — Use a public-domain reference (Wikimedia, Natural Earth) to hand-trace, or does the founder have an SVG already? See §15.
- **State boundaries** — Ship v1 with just the country outline, or include state boundaries from the start? Recommended: country outline only for v1. §15.3.
- **Hit area radius** — Start with 30 units (≈ 11px on 375px phone) per §8.1. Increase to 50 if testing shows tap accuracy issues.
- **Pin design** — A solid orange dot with a pulsing ring (per §7.2) is functional and matches the accent. If the founder wants a more "Google Maps drop pin" look, switch to a teardrop SVG path. The current design is simpler and reads well at small sizes.
- **Active label position** — Per §8.2, the label appears 14 units to the right of the active dot. If a dot is on the right edge of the map, the label might overflow the viewBox. Add a check: if `point.x + 14 + labelWidth > 1000`, render the label to the left of the dot instead.
- **Real copy from founder** — All copy in v1 is factual placeholder. The founder replaces it with curated copy in a later phase. The `// TODO(founder):` comment in each section card marks the placeholder.
- **Founder's contact link** — The CTA placeholder at the bottom needs a `mailto:` or WhatsApp link. Stub with `hello@example.com` and a `// TODO` for the founder to fill in. (Same as variants A-D.)
- **Performance on low-end phones** — If testing on a low-end Android shows < 30 FPS, see §13.5 for optimization options (throttle, reduce samples).

---

## 21. Quick-Reference Constants

| Constant | Value | Where used |
|---|---|---|
| `BOUNDS.minLat` | `6` | `projection.ts` |
| `BOUNDS.maxLat` | `38` | `projection.ts` |
| `BOUNDS.minLng` | `66` | `projection.ts` |
| `BOUNDS.maxLng` | `98` | `projection.ts` |
| `VIEWBOX_WIDTH` / `VIEWBOX_HEIGHT` | `1000` | `projection.ts`, all SVGs |
| `SAMPLES_PER_SEGMENT` | `20` | `polyline.ts` |
| `POLYLINE_LENGTH` | `221` (computed) | `polyline.ts` |
| IntersectionObserver threshold | `[0, 0.5, 1]` | `TravelJyotirlingasPage.tsx` |
| Active dot radius (normal) | `[6, 10, 6]` keyframes | `Dot.tsx` |
| Active dot radius (reduced motion) | `8` static | `Dot.tsx` |
| Inactive dot radius | `4` | `Dot.tsx` |
| Pin solid dot radius | `7` | `Pin.tsx` |
| Pin pulsing ring radius | `[10, 20, 10]` keyframes, 2s | `Pin.tsx` |
| Pin center hole radius | `2.5` | `Pin.tsx` |
| Dot hit area radius | `30` (transparent) | `Dot.tsx` |
| Active label font size | `14` | `IndiaMap.tsx` |
| Active label x-offset | `14` | `IndiaMap.tsx` |
| Section height | `min-h-screen` (100vh) | `TravelJyotirlingasPage.tsx` |
| Card width (desktop) | `md:w-1/2` | `TravelJyotirlingasPage.tsx` |
| Card background | `bg-black/60 backdrop-blur-md` | `TravelJyotirlingasPage.tsx` |
| Map outline stroke | `#2a2a2a`, width `2` | `IndiaMap.tsx` |
| Accent color | `#f48b29` | everywhere |
| Site background | `#0a0a0a` | `TravelJyotirlingasPage.tsx` |

---

**End of spec.** Ship it.
