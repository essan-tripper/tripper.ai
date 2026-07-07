## FEATURES

## UI / UX

Changes ordered by complexity (easiest first). Each item has a git commit message — agent can implement then commit before moving to next.

> **Note:** Set `TEST_USER_ID` in `.env` to a test user's ID. When that user checks out, Razorpay receives ₹1 (100 paise) instead of the real total. DB stores the real amount — admin dashboard stays accurate.

---

### 1. Google sign-in/up button restyle

**Files:**
- `src/app/sign-in/page.tsx`
- `src/app/sign-up/page.tsx`
- `public/google-logo.svg`

**Changes:**
1. Replace inline SVG `<path>` elements with `<Image src="/google-logo.svg" width={20} height={20} alt="Google" />`
2. Restyle button to match form theme: `border border-white/20 text-white/80 hover:bg-white/5 bg-transparent` (same as email submit button)
3. Remove `shadow-[0_0_15px_rgba(243,141,49,0.4)] hover:scale-[1.01] active:scale-[0.98]` glow/scale
4. Text: "Sign in with Google" on sign-in, "Sign up with Google" on sign-up
5. Keep existing `handleGoogleSignIn` / `handleGoogleSignUp` handlers

**Commit:**
```
feat: restyle Google sign-in/up button to match form theme

Replace branded orange Google button with dark-themed button
matching form border style. Inline SVG replaced with Google
logo image. Text reads "Sign in/up with Google" respectively.
```

---

### 2. TEST_USER_ID for ₹1 Razorpay test pricing

**Files:**
- `src/env.ts`
- `.env`
- `src/app/api/checkout/route.ts`

**Changes:**
1. Add to `src/env.ts` server schema:
   ```ts
   TEST_USER_ID: z.string().optional(),
   ```
2. Add to `src/env.ts` runtimeEnv:
   ```ts
   TEST_USER_ID: process.env.TEST_USER_ID,
   ```
3. Add to `.env`:
   ```
   # Test user ID — checkout for this user sends ₹1 to Razorpay
   TEST_USER_ID=
   ```
4. In `src/app/api/checkout/route.ts`, after `const amountPaise = totalAmount * 100`, add:
   ```ts
   const razorpayAmount = session.user.id === env.TEST_USER_ID ? 100 : amountPaise;
   ```
5. Replace `amountPaise` with `razorpayAmount` in the `razorpay.orders.create()` call and the response `amount` field.
6. DB inserts remain unchanged — `amountPaise` (real value) is stored in `totalAmount` column.

**Commit:**
```
feat: add TEST_USER_ID env for ₹1 test checkout

Introduce TEST_USER_ID env var. When the authenticated user
matches this ID, Razorpay order is created with ₹1 (100 paise)
instead of real cart total. DB stores real amount unchanged.
```

---

### 3. "Show Interest" → email dialog in merch page

**Files:** `src/app/merch/JournalInterest.tsx`

**Changes:**
1. Add imports: `Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose` from `@/components/ui/dialog`, `Input` from `@/components/ui/input`, `X` from `lucide-react`
2. Remove `showForm` state — no longer needed
3. Wrap the "SHOW INTEREST" button in `<Dialog>` and `<DialogTrigger>`
4. Dialog body:
   - `<DialogHeader>` with `<DialogTitle>` — "Get Notified"
   - email `<Input>` with state
   - `<Button>` to submit — same submit logic as current (POST to `/api/interest`, toast on success, clear on close)
   - `<DialogClose>` with `<X>` icon for manual close
5. On successful submit + toast: close the dialog
6. Keep image + card layout unchanged

**Commit:**
```
feat: replace Show Interest button with email dialog

Add Dialog component for journal interest signup. User enters
email via shadcn Input, submits via existing /api/interest
endpoint, gets success toast on completion.
```

---

### 4. DestinationModal — auto-rotate carousel every 3s

**Files:** `src/components/DestinationModal.tsx`

**Change:** Add autoplay to both desktop and mobile Embla carousels:
- Proposed Solution : `embla-carousel-autoplay` npm package — add plugin to `useEmblaCarousel` options. Simpler and handles pause-on-interaction natively.

**Commit:**
```
feat: auto-rotate DestinationModal carousel every 3 seconds

Add autoplay to desktop and mobile image carousels using
Embla autoplay plugin. Pauses on user interaction.
```

---

### 5. High-res image zoom (Amazon/Flipkart style)

**Files:** `src/components/DestinationModal.tsx` — desktop carousel images

**Change** — this is the most involved feature. Multi-step:

1. **Source images:** Serve high-resolution versions (2-4x display size). Current carousel uses images from `/Carousel Tips/`. Either add `@2x` variants or serve the originals at a larger resolution and downsample with CSS.

2. **Zoom container:** Wrap each carousel slide's `<Image>` in a container. On hover, the container shows the high-res version as `background-image` with `background-size: 200%` (or higher).

3. **Cursor tracking:** Add `onMouseMove` on the parent container. Compute:
   ```
   x% = (cursorX - containerLeft) / containerWidth * 100
   y% = (cursorY - containerTop) / containerHeight * 100
   ```
   Apply to `background-position: {x}% {y}%`. This is the key math that keeps the zoom aligned with cursor — same as Amazon/Flipkart.

4. **Event routing:** `pointer-events: none` on the `<img>` so mouse events fire on the parent container, not the image. Prevents jitter.

5. **Preload:** Use `new Image()` in JS to preload the high-res version on mount/carousel change. No flash on first hover.

6. **Mobile fallback:** No hover on mobile. Option A: tap-to-fullscreen gallery. Option B: pinch-to-zoom via CSS `touch-action`. Decide during implementation.

**Commit (could be split into two if preload is separate):**
```
feat: implement high-res image zoom on DestinationModal

Add Amazon-style zoom: 2-4x resolution image swap on hover,
percentage-based cursor tracking for background-position,
pointer-events:none on img, preload large images to avoid
flash. Mobile tap-to-fullscreen as hover fallback.
```