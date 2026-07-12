# ROADMAP

Progress tracker — what's built, what's risky, what needs care.

---

## ✓ Built

### Foundation
- **Next.js 15 App Router**, TypeScript strict, Tailwind CSS v4, shadcn/ui
- **Dark theme** (#0a0a0a bg, #f48b29 accent), cinematic fonts (Cinzel, Instrument Serif, Inter, Playfair)
- **PostgreSQL** via Drizzle ORM, `postgres.js` driver
- **All DB tables**: user, session, account, verification (better-auth generated) + orders, order_items, addresses, interest_emails (hand-written)

### Auth (better-auth)
- Email/password + Google OAuth
- Cookie cache (`maxAge` 5 min) — ~80-95% fewer session DB queries
- Server-prefetched session → client hydration — no first-paint flash
- Security gates (`/admin`, admin API) opt out of cookie cache via `disableCookieCache: true`
- Vendored official better-auth docs at `docs/agents/better-auth/better_auth_official.md`

### Cart (Zustand + localStorage)
- Client-only, key `tripper-cart`, Zod-validated on every mutation
- addItem, removeItem, updateQuantity, clearCart
- Same id = merge quantity

### Payments (Razorpay)
- Full 6-step flow: checkout order creation → Razorpay order → client modal → verify-payment → webhook backup → order history
- HMAC-SHA256 signature verification on both verify-payment and webhook
- Admin email trick: orders from admin emails get ₹1 (test-friendly)
- **Status**: Razorpay keys live in `.env` — switch test→live by updating env values

### Admin Dashboard (`/admin`)
- Gated by `ADMIN_EMAILS` env var
- 3 tabs: Orders (view + update delivery status), Interest (journal waitlist), Accounts (users w/o orders)
- API: PATCH `/api/admin/orders` for delivery status updates

### SEO
- Full metadata: metadataBase, title template, OG/Twitter, verification, icons, manifest, canonical
- Per-page metadata on all 14 routes (public pages unique, auth/admin noindex)
- robots.txt, sitemap.xml (9 URLs), not-found.tsx, JSON-LD Organization schema
- Favicon assets deployed: .ico, .svg, 96x96.png, apple-touch-icon.png, site.webmanifest
- font-display: swap on all 4 fonts
- poweredByHeader: false

### Security (Arcjet)
- Shield (LIVE) + sliding window rate limits (DRY_RUN) on all API routes
- Rate limit configs: checkout (10/60s), verify-payment (20/60s), orders (30/60s), interest (10/60s), admin/orders (30/60s), webhooks (shield only)

### Content Pages
- /about-us, /privacy-policy, /course (standalone)
- sign-in, sign-up, account (address management + order history)

### UI Polish
- **High-res image zoom**: Amazon-style 2x zoom on DestinationModal desktop carousel with percentage-based cursor tracking
- **Carousel autoplay**: embla-carousel-autoplay on DestinationModal (3s intervals)
- **Dual-carousel fix**: separate embla instances + independent index state for mobile/desktop — no desync
- **Close button visible**: white coloring on DialogContent close button
- **Mobile layout fix**: modal scrollable on mobile, text-first carousel-below order
- **Google auth spinner**: Spinner component + "Redirecting..." text on Google sign-in button
- **Footer responsive**: `px-34` → `px-6 sm:px-36`

### CDN (Cloudinary)
- All assets migrated from `public/` to Cloudinary: 8 magnets, 6 posters, hero videos (desktop + mobile)
- Preload link updated; `res.cloudinary.com` already in `remotePatterns`

### Analytics
- Vercel Analytics + Speed Insights in root layout

---

## ⚠️ Risks & Careful Spots

### Payment
- **Race condition**: verify-payment AND webhook can fire for same order. Harmless (both SET `paymentStatus`), but double-charge logic would break if adding email/SMS notifications later
- **No failed/refunded tracking**: payment failures surface as client-side toast + order stays `pending` in DB. No retry/refund workflow
- **Admin ₹1 trick**: admin emails bypass real amount. Fine for testing, unexpected in prod unless documented

### Auth & Security
- **Cookie cache staleness**: up to 5 min window where a revoked/de-admined user can still act. Security gates opt out; user-data endpoints left cached (staleness harmless)
- **Arcjet DRY_RUN**: rate limits logged but not enforced. Switch to LIVE incrementally (verify-payment, orders, interest safest to flip first)
- **ADMIN_EMAILS env var**: single point of admin access. If misconfigured, no one can access `/admin`

### Data & Storage
- **Cart is localStorage-only**: clearing browser storage loses cart. No server sync. Sync to DB if multi-device needed
- **No CMS**: product data hardcoded in components. New products = code changes + deploy
- **Pincode data** (`src/data/pincode-ranges.ts`): auto-generated, do not edit by hand. Regenerate if state boundaries change
- **No image fallbacks**: if Cloudinary goes down or URLs change, all product/hero images break

### SEO Gaps
- **og-image.jpg** — not in `public/`. Default OG fallback is `/LOGO.png` (512×512, not ideal aspect ratio)
- **GSC placeholder** — `layout.tsx:78` has `"YOUR_GOOGLE_SEARCH_CONSOLE_ID"`. Replace before launch
- **Product JSON-LD** + **BreadcrumbList** — not implemented
- **favicon.ico** / **apple-touch-icon.png** — files exist in `public/` (verified)

### Architecture
- **No test suite**: no test runner configured. Adding features risk regressions
- **`npm run lint` / `npm run typecheck` exist** but no test script
- **Migrations manual**: `npx drizzle-kit push` — no package.json script, must remember

---

## 🔮 Future (not started)

- Product JSON-LD + BreadcrumbList structured data
- Failure/refund payment tracking
- Multi-device cart sync (server-side cart)
- CMS integration
- Email/SMS notifications on payment/status change
- Hreflang for Hindi content
- Rate limit LIVE enforcement