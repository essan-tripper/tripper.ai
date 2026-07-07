# Progress

> Current state of the project. What is done, what is risky, and what needs attention.
> Updated: 2026-07-07

## Status: Production-ready (v0.4.0)

---

## Done

- [x] Homepage with hero video, destinations, merch section
- [x] Merch store: magnets and posters product pages with Add to Cart
- [x] Full e-commerce checkout with Razorpay (test mode)
  - [x] Cart with localStorage persistence (Zustand + Zod)
  - [x] Auth-gated checkout (sign-in / sign-up)
  - [x] Address management (create, edit, delete, set default)
  - [x] Razorpay order creation, payment verification, webhooks
  - [x] Order history page (`/order`)
- [x] Authentication: email/password + Google OAuth (better-auth)
- [x] User account page with addresses and order history
- [x] Admin dashboard at `/admin`
  - [x] Orders tab: view all, update delivery status
  - [x] Interest tab: journal email signups
  - [x] Accounts tab: users without orders
  - [x] Server-side admin auth via `ADMIN_EMAILS` env var
- [x] Static pages: About Us, Privacy Policy
- [x] Dark theme UI with custom fonts and animations
- [x] Arcjet security (rate limiting on all API routes)
- [x] Responsive design (mobile + desktop)
- [x] Interest email capture for Journal (waitlist)

---

## In Progress / Next

- [ ] Razorpay LIVE mode key rotation (still on test keys)
- [ ] Order detail page (`/order/[id]` — scaffolded but not linked)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Inventory management (stock levels for magnets/posters)
- [ ] Shipping partner integration
- [ ] Journal product launch (currently waitlist only)
- [ ] SEO optimization (meta tags, sitemap, structured data)

---

## Risky / Needs Care

1. **Razorpay in TEST mode** — `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are for test environment. Switching to live requires `NEXT_PUBLIC_RAZORPAY_KEY_ID` and secret rotation. Webhook endpoint must be updated in Razorpay dashboard.
2. **Arcjet DRY_RUN mode** — all rate limits are non-blocking. Before going live, change `mode: "DRY_RUN"` to `mode: "LIVE"` in all Arcjet rules across API routes.
3. **No tests or linting** — no test suite, no lint, no typecheck. Manual QA only. Risk of regressions during refactors.
4. **drizzle-kit not in package.json scripts** — migrations are manual (`npx drizzle-kit`). Easy to forget when deploying schema changes.
5. **Cart stored in localStorage** — lost on incognito, not shared across devices, not synchronized with DB. User must re-add items if they clear storage.
6. **Admin dashboard has no pagination** — large datasets (orders, users) could cause performance issues as the store scales.
7. **Hardcoded product data** — magnet/poster product lists are in component files (not a CMS or DB). Adding new products requires code changes.
8. **Google OAuth redirect URI** — ensure `NEXT_PUBLIC_APP_URL` matches the deployed domain for OAuth callbacks.
9. **Image assets** — product and destination images are stored in `public/`. No CDN or image optimization pipeline beyond Next.js built-in.
10. **No CI/CD** — manual deploys. No automated checks before production.

---

## Recent Changes (last 30 days)

- Rebranded from old Devanagari name to "Tripper"
- Added admin dashboard
- Added journal interest capture
- Added 3 new magnet shrine images
- Updated footer and navbar branding

---

## Architecture Health

| Component | Status |
|-----------|--------|
| Auth | Stable (better-auth) |
| DB schema | Stable, minor additions needed for future features |
| Cart | Stable, localStorage-based |
| Payments | Test mode, needs live keys |
| Admin | Working, basic feature set |
| UI/UX | Good, responsive, consistent theme |
| Security | Arcjet configured but not enforced (DRY_RUN) |
| Performance | Good (Turbopack, Next.js 15) |
