## FEATURES

### ✓ SEO Sprint — Completed 2026-07-12

Full metadata overhaul: root layout with metadataBase, title template, OG/Twitter/verification/icons/manifest. Per-page metadata on all 14 routes. robots.txt, sitemap.xml, not-found.tsx, JSON-LD Organization schema. Favicon assets deployed (ico, svg, 96x96, apple-touch, webmanifest). font-display: swap fixed. poweredByHeader removed.

**Remaining:** og-image.jpg, GSC placeholder swap, Product/BreadcrumbList JSON-LD (future).

---

## UI / UX

Changes ordered by complexity (easiest first). Each item has a git commit message — agent can implement then commit before moving to next. THIS IS IMPORTANT, AFTER EVERY FEATURE CHANGE YOU MUST COMMIT THE CHANGES THEN ONLY MOVE AHEAD.


### 1. High-res image zoom (Amazon/Flipkart style)

**Files:**
- `src/components/DestinationModal.tsx` — desktop carousel section (lines 117-168)

**Note:** Desktop-only feature. Mobile carousel (`md:hidden` block, lines 206-262) is left untouched.

**Current architecture context for desktop carousel:**
- 7 images served from `/Carousel Tips/{name}{index}.jpeg` where `name` is `dham.name` with whitespace stripped (see `getModalImagePath()` at line 26-29)
- Each image rendered via `<Image fill className="object-cover" />` inside a `relative flex-[0_0_100%]` slide
- Carousel is 55% modal width on desktop
- Images are already publicly hosted — paths are raw JPEG files on the server

#### Sub-feature 1a: Source high-res images (OPTION B — resolved)

**Decision:** Use **Option B** — existing images are already 1792×2400px, ample for 2x zoom. No `@2x` variants needed. Same URL for zoom overlay and thumbnail.

#### Sub-feature 1b: Zoom container + cursor tracking

1. **Wrap each desktop slide** content. Current structure (lines 120-133):
   ```tsx
   <div className="relative flex-[0_0_100%] min-w-0 h-full">
     <Image fill className="object-cover" />
   </div>
   ```
   Replace with:
   ```tsx
   <div className="relative flex-[0_0_100%] min-w-0 h-full group/zoom">
     <div
       className="relative w-full h-full overflow-hidden cursor-crosshair"
       onMouseMove={handleMouseMove}
       onMouseLeave={handleMouseLeave}
     >
       <Image
         fill
         className="object-cover pointer-events-none select-none"
         style={{ opacity: isZoomed ? 0 : 1 }}
       />
       {/* Zoom overlay */}
       <div
         className="absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-150"
         style={{
           backgroundImage: `url(${highResUrl})`,
           backgroundSize: `${zoomScale}%`,
           backgroundPosition: `${bgX}% ${bgY}%`,
           opacity: isZoomed ? 1 : 0,
         }}
       />
     </div>
   </div>
   ```

2. **State per slide** — use a single set of zoom state variables (one zoom active at a time):
   ```ts
   const [isZoomed, setIsZoomed] = useState(false);
   const [bgX, setBgX] = useState(50);
   const [bgY, setBgY] = useState(50);
   const zoomScale = 200; // 2x zoom
   ```

3. **Mouse move handler** — percentage-based math:
   ```ts
   function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
     const rect = e.currentTarget.getBoundingClientRect();
     const x = ((e.clientX - rect.left) / rect.width) * 100;
     const y = ((e.clientY - rect.top) / rect.height) * 100;
     setBgX(x);
     setBgY(y);
     setIsZoomed(true);
   }

   function handleMouseLeave() {
     setIsZoomed(false);
   }
   ```

4. **Event routing** — `pointer-events: none` on `<Image>` (already on the zoom overlay via `className="pointer-events-none"`). Mouse events fire on the parent container only.

#### Sub-feature 1c: Preload high-res images — SKIPPED

No preload. Slight flash on first hover is acceptable tradeoff.

#### Sub-feature 1d: Mobile fallback — SKIPPED

Mobile carousel left untouched. Desktop zoom only.

**Commit:**
```
feat: implement high-res image zoom on DestinationModal desktop carousel

Add Amazon-style zoom: 2x resolution on hover with percentage-based
cursor tracking for background-position. pointer-events:none on img
to route events to parent.
```

---

### 2. Switch Razorpay from test mode to live mode

**Prerequisite:** Have live Razorpay keys ready (generated from Razorpay Dashboard → Settings → API Keys).

**Files:**
- `.env` — update key values only (no structure change)

**Changes:**

1. **Replace Razorpay API keys** in `.env`:
   ```
   # Before (test mode)
   RAZORPAY_KEY_ID=rzp_test_T1Fw4or3vqJyU7
   RAZORPAY_KEY_SECRET=T51UqOQwtwshR4tj4Kvo92YX
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_T1F4cd5PvSBaWh

   # After (live mode)
   RAZORPAY_KEY_ID=rzp_live_<your_live_key_id>
   RAZORPAY_KEY_SECRET=<your_live_key_secret>
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_<your_live_key_id>
   ```
   **Important:** `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID` should be the same key.
   The test file had them different — likely a copy-paste issue. Fix during migration.

2. **Set up webhook endpoint** in Razorpay Live Dashboard:
   - Go to Razorpay Dashboard → Settings → Webhooks
   - Add webhook URL: `https://<production-domain>/api/webhooks/razorpay`
   - Events to subscribe: `payment.captured`
   - Secret: use `RAZORPAY_KEY_SECRET` or generate a dedicated webhook secret (update code if using dedicated secret)

3. **Rate limit enforcement** — all API rate limit rules currently use `mode: "DRY_RUN"`.
   If desired, switch to `mode: "LIVE"` per-route.
   Routes and current settings:

   | Route | Current | Suggestion |
   |-------|---------|------------|
   | `/api/checkout` | `DRY_RUN` (10 req/60s) | Keep DRY_RUN until load-tested |
   | `/api/verify-payment` | `DRY_RUN` (20 req/60s) | Switch to LIVE |
   | `/api/orders` | `DRY_RUN` (30 req/60s) | Switch to LIVE |
   | `/api/interest` | `DRY_RUN` (10 req/60s) | Switch to LIVE |
   | `/api/admin/orders` | `DRY_RUN` (30 req/60s) | Switch to LIVE |
   | `/api/webhooks/razorpay` | No rate limit rule | Add slidingWindow `LIVE` (30 req/60s) |

4. **Verify end-to-end:**
   - Place a test order with an admin email (will create ₹1 Razorpay order with live keys)
   - Complete payment in Razorpay test/live checkout UI
   - Verify webhook fires and updates order status
   - Check `/api/orders` returns correct status

5. **Rollback plan:** Keep old test keys saved in password manager or docs/.
   Revert `.env` keys and change `mode: "LIVE"` back to `"DRY_RUN"` if issues arise.

**No code changes needed** — the app reads keys from `.env` via `@/env` at runtime.
`razorpay.ts` (line 4-7) already uses `env.RAZORPAY_KEY_ID` and `env.RAZORPAY_KEY_SECRET`.
All HMAC signatures and webhook verification use the same env vars.

**Commit (single — just env changes + arcjet mode toggle):**
```
feat: switch Razorpay to live mode

Replace test API keys with live keys in .env.
Switch Arcjet rate limits from DRY_RUN to LIVE
on order/payment/interest routes.
Configure webhook URL in Razorpay live dashboard.
```

**Note:** Environment variable change requires a production rebuild/restart.
On Vercel, update env vars in project settings and redeploy — don't commit live keys to the repo.
On self-hosted, update `.env` on the server and restart the process.

### 3. Add a spinner or loader in Google auth button when it goes into loading mode. 