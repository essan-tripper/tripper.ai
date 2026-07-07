# Changelog

Format: Date [Version] — What changed (files affected, notable behavior shifts, breaking changes).
> Source of truth for version history when git history is unclear. Keep updated per release.

---

## v0.5.0 — 2026-07-07
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
