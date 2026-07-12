# Changelog

Format: Date [Version] — What changed (files affected, notable behavior shifts, breaking changes).
> Source of truth for version history when git history is unclear. Keep updated per release.

---

## v0.7.0 — 2026-07-12
**Cloudinary migration, footer responsive fix, carousel autoplay**
- **Cloudinary CDN**: All assets migrated from `public/` — magnets (8), posters (6+2 cart refs),
  hero videos (2), preload link. No config changes needed.
- **Footer responsive** (`src/components/Footer.tsx`): Fixed invalid `px-34` → `px-6 sm:px-36`.
  Footer content no longer touches screen edges on mobile.
- **Carousel autoplay** (`src/components/DestinationsSection.tsx`): Added
  `embla-carousel-autoplay` plugin. Auto-advances every 5s, stops on user interaction.
- **Magnets** (`src/app/magnets/MagnetsComponent.tsx`): 8 magnet product images replaced with
  Cloudinary URLs (Kedarnath, Dwarka, Puri, Rameshwaram, Badrinath, Gangotri, Yamunotri, Pack of 4).
- **Posters** (`src/app/posters/PostersComponent.tsx`): 6 poster gallery images + 2 cart item
  references replaced with Cloudinary URLs (Posters1–Posters6).
- **Hero video** (`src/components/HeroSection.tsx`): desktop.mp4 and mobile.mp4 replaced with
  Cloudinary video URLs. Conditional switching preserved.
- **Preload link** (`src/app/page.tsx`): desktop.mp4 preload `href` updated to Cloudinary URL.
- `next.config.ts` already had `res.cloudinary.com` in `remotePatterns` — no config change needed.
- No database schema changes.
- Typecheck and build pass cleanly.

---

## v0.6.0 — 2026-07-12
**SEO sprint — full metadata, sitemap, robots, JSON-LD, not-found**
- **Root layout** (`src/app/layout.tsx`): Complete metadata rewrite — added `metadataBase`
  (`https://tripperbyessan.com`), `title.template` (`%s | Tripper by Essan`), `openGraph` (type,
  siteName, locale, url, images via `/LOGO.png`), `twitter:card` (summary_large_image + image),
  `robots`, `icons` (favicon.ico, favicon.svg, favicon-96x96.png, apple-touch-icon.png),
  `manifest` (site.webmanifest), `verification` (GSC placeholder), `alternates.canonical`.
  JSON-LD `Organization` schema inlined. Font display fixed: all 4 fonts now use
  `display: "swap"`.
- **Per-page metadata**: All 14 routes now export static `metadata` or `generateMetadata` with
  unique `title`, `description`, `openGraph` per page. Auth/account/cart/order/admin pages set
  `robots: { index: false, follow: false }`. (`src/app/page.tsx`, `merch/page.tsx`,
  `magnets/page.tsx`, `posters/page.tsx`, `cart/page.tsx`, `order/page.tsx`,
  `order/[id]/page.tsx`, `account/page.tsx`, `sign-in/page.tsx`, `sign-up/page.tsx`,
  `about-us/page.tsx`, `privacy-policy/page.tsx`, `course/page.tsx`, `admin/page.tsx`)
- **Client page metadata** — 4 new layout.tsx wrappers (`sign-in/layout.tsx`,
  `sign-up/layout.tsx`, `about-us/layout.tsx`, `course/layout.tsx`) because `"use client"`
  components cannot export `metadata`.
- **robots.txt** (`src/app/robots.ts`): Allow all, disallow admin/api/account/cart/order.
- **Sitemap** (`src/app/sitemap.ts`): 9 public URLs with priority tiers and change frequency.
- **not-found.tsx** (`src/app/not-found.tsx`): Branded 404 page — prevents soft 404s.
- **JSON-LD helper** (`src/lib/seo/json-ld.tsx`): Reusable `<JsonLd>` component for structured data.
- **next.config.ts**: Added `poweredByHeader: false`.
- **Favicon assets**: `public/favicon.ico`, `favicon.svg`, `favicon-96x96.png`,
  `apple-touch-icon.png` deployed. `site.webmanifest` updated with brand colors (#0a0a0a
  theme/background). (`public/site.webmanifest`)
- **Docs**: Added SEO section to `AGENTS.md` (infrastructure table, layout metadata, per-page
  metadata, remaining gaps, favicon assets table). Updated `PROGRESS.md` with full SEO design
  decisions.
- **Remaining**: Create `public/og-image.jpg`, replace GSC placeholder. Product JSON-LD and
  BreadcrumbList for future.
- No database schema changes.

---
**Auth performance — cookie cache + server-prefetched session**
- Enabled better-auth **cookie cache** (`session.cookieCache`, `maxAge` 5 min) in `src/lib/db/auth.ts`.
  Repeat `getSession`/`useSession` calls now read a signed cookie instead of hitting Postgres
  (~80-95% fewer session DB queries).
- Security gates opt out of the cache to avoid stale sessions: `src/app/admin/page.tsx` and
  `src/app/api/admin/orders/route.ts` now pass `query: { disableCookieCache: true }`, so a
  revoked / de-admined user is blocked immediately rather than up to 5 min later.
  - Left cached (own-user data, staleness harmless): checkout, verify-payment, orders,
    address-actions.
- **Server-prefetched session + client hydration**: `src/app/layout.tsx` is now async, calls
  `auth.api.getSession` once, and passes the result to `<AuthProvider initialSession={...}>`.
  `src/components/providers/auth-provider.tsx` uses it as the fallback while the client
  `useSession()` is pending and reports `isPending: false` when present. Removes the first-paint
  auth round trip and the signed-out→signed-in flash. `headers()` opts the app into dynamic
  rendering.
- Docs: expanded the better-auth workflow section in `AGENTS.md` (generated schema, cookie fetch,
  server-prefetch, touch/don't-touch) and pointed it at vendored official docs at
  `docs/agents/better-auth/better_auth_official.md`. Added `ROADMAP.md` and a human-readable
  `README.md`.
- No schema or migration changes — cookie cache is signed with the existing `BETTER_AUTH_SECRET`.

---

## v0.4.0 — 2026-07-01
**Rebrand + Admin Dashboard**
- Replaced old Devanagari brand name with "Tripper" across all pages (footer, about-us, privacy-policy).
- Admin dashboard at `/admin` with 3 tabs: Orders, Interest, Accounts.
  - Orders: view all orders, update delivery status, view items.
  - Interest: view journal email signups.
  - Accounts: view users with no orders.
  - Auth gated by `ADMIN_EMAILS` env var (server-side check).
- Added `interest_emails` table to store journal interest emails.
- Added `/api/interest` endpoint for email capture.
- Added `/api/admin/orders` for admin order status updates.
- Admin UI components: `AdminDashboard.tsx`, `AdminOrdersTable.tsx`, `InterestTab.tsx`, `AccountsTab.tsx`.
- Magnets: crossed-out prices styling, 3 new shrine images (Badrinath, Gangotri, Yamunotri).
- Magnets: "Pack of 4" Vaul sheet.
- Merch: replaced Upcoming badge with "SHOW INTEREST" button for Journal.
- Navbar: updated to stacked Tripper/BYESSAN logo.
- Env var validation added (ADMIN_URL, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, ADMIN_EMAILS).
- Arcjet rate limiting on all API routes (DRY_RUN mode).
- Deprecated: `about-us.html`, `privacy-policy.html`, `course.html`, `links.txt` (moved to pages).

---

## v0.3.0 — 2026-06-14
**Content Pages + Minor Fixes**
- Added About Us page (`/about-us`).
- Added Privacy Policy page (`/privacy-policy`).
- Added Course page (`/course`) — standalone page (not integrated into nav).
- Updated `CartComponent.tsx` — improved cart UI/UX.
- Updated `MagnetsComponent.tsx` — product grid improvements.
- Updated `PostersComponent.tsx` — product grid improvements.
- Updated `Footer.tsx` — added links to new pages.
- Updated `HeroSection.tsx`, `DestinationsSection.tsx` — minor layout tweaks.
- Added `LoadingLink.tsx` component for navigation loading states.
- Updated `next.config.ts` for static export.
- Added `links.txt` (deprecated later).

---

## v0.2.0 — 2026-06-13
**Auth + Razorpay Test Mode**
- Added better-auth with email/password and Google OAuth.
  - Auth routes at `/api/auth/[...all]`.
  - Schema: `user`, `session`, `account`, `verification` tables.
- Added cart checkout flow with Razorpay integration (test mode).
  - `/api/checkout` — creates order in DB + Razorpay order.
  - `/api/verify-payment` — verifies signature, updates order status.
  - `/api/webhooks/razorpay` — handles `payment.captured` events.
  - `CartComponent.tsx` — full checkout flow with auth gating and address check.
- Added address management (`addresses` table).
- Added order history (`orders`, `order_items` tables).
- Added `/account` page with address form and order history.
- Added `/sign-in` and `/sign-up` pages.
- Added Zustand cart store with localStorage persistence.
- Added `prompts.txt` (internal prompts, later deprecated).

---

## v0.1.0 — 2026-06-13
**Initial Release**
- Project scaffold: Next.js 15 App Router, TypeScript strict, Tailwind CSS v4.
- shadcn/ui setup with all base components.
- Home page with hero video, destinations carousel, merch section.
- Merch store: `/merch` → `/magnets`, `/posters` product pages.
- Product display pages: `MagnetsComponent.tsx`, `PostersComponent.tsx`.
- Design: dark theme (#0a0a0a bg, #f48b29 accent), cinematic fonts.
- Assets: hero videos, product images, destination carousel images, maps.
- Database setup: Drizzle ORM + PostgreSQL, `drizzle.config.ts`, `src/lib/db/schema.ts`.
- Arcjet security setup (shield, rate limits).
- Environment variables: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `ARCJET_KEY`.
