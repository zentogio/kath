# Performance / Core Web Vitals Audit — kath-ebon.vercel.app

**Data source:** Lab data only, via local Lighthouse 13.4.1 CLI runs against the live production URLs (mobile emulation, simulated throttling — Moto G Power-class device profile, default Lighthouse mobile network throttling). PageSpeed Insights API and CrUX field data were unavailable — the PSI API key on this environment is rate-limited/not returning data ("PSI rate limit exceeded (240 QPM / 25,000 QPD)"), and no CrUX credentials are configured, so **no real-user (field) 28-day percentile data exists in this report**. All numbers below are single-run lab measurements and should be treated as directional; re-validate against CrUX/PSI field data once the site has enough traffic (or once API access is restored) before treating the 75th-percentile pass/fail thresholds as final.

Pages tested: `/` (home), `/collection`, `/about`, `/contact`. Raw Lighthouse JSON/HTML reports retained at `C:\Users\Zento\AppData\Local\Temp\claude\Z--kath\115318ac-5125-46b6-81f9-bfe9d80bd761\scratchpad\lh\{home,collection,about,contact}.report.json`.

## Summary Table (Lab Data)

| Page | Perf Score | LCP | CLS | TBT | FCP | Total Weight | Image Weight |
|---|---|---|---|---|---|---|---|
| `/` | 69 | **6.2s** (Poor) | 0 (Good) | 0ms | 3.2s | 1,768 KiB | 1,630 KiB (90%) |
| `/collection` | 70 | **5.9s** (Poor) | 0 (Good) | 50ms | 3.3s | 956 KiB | 800 KiB (82%) |
| `/about` | 84 | 3.5s (Needs Improvement) | 0 (Good) | 0ms | 3.2s | 348 KiB | 178 KiB (51%) |
| `/contact` | 86 | 3.2s (Needs Improvement) | 0 (Good) | 0ms | 3.2s | 203 KiB | 30 KiB (14%) |

Against the 2026 thresholds (Good ≤2.5s / NI 2.5–4.0s / Poor >4.0s for LCP; Good ≤0.1 for CLS; TBT is a lab proxy for INP, Good <200ms): **LCP fails "Good" on every page tested**, including two pages (home, collection) that land in the "Poor" band under lab conditions. CLS is excellent everywhere. TBT/INP is not a concern in lab data (see Finding 4).

---

## Finding 1: LCP fails on all four pages — home and collection are in the "Poor" band (5.9–6.2s)

**Severity:** High

**Description:**
LCP exceeds the 2.5s "Good" threshold on every page tested, and on `/` and `/collection` it is more than double the 4.0s "Poor" cutoff. Lighthouse's LCP-breakdown insight attributes the bulk of this to **element render delay** — the LCP element's resource loads quickly, but the browser doesn't paint it for 1.2–2.2s after that, on every page including two (`/about`, `/contact`) where the LCP element is plain paragraph text with no image at all.

**Evidence (LCP subpart breakdown, `lcp-breakdown-insight` audit):**

| Page | TTFB | Resource Load Delay | Resource Load Duration | Element Render Delay | Reported LCP |
|---|---|---|---|---|---|
| `/` | 104ms | 18ms | 51ms | **2,191ms** | 6,203ms |
| `/collection` | 124ms | 16ms | 70ms | **1,581ms** | 5,937ms |
| `/about` | 227ms | — | — | **1,613ms** | 3,542ms |
| `/contact` | 120ms | — | — | **1,177ms** | 3,225ms |

Two things stand out:
1. On `/about` and `/contact` the LCP element is a `<p class="prose">` text node — there's no image to blame, yet render delay is still >1.1s. TTFB + subparts don't fully explain the gap to the final LCP number either, which points to render-blocking CSS/fonts (Finding 2) holding back first paint of text content, consistent with the `render-blocking-insight` savings estimates below (~2.2–2.3s on every page).
2. On `/` and `/collection`, the subparts (TTFB + load delay + load duration + render delay) sum to roughly 2.0–2.4s, well short of the 5.9–6.2s reported LCP. This gap is consistent with the hero carousel / product grid re-triggering LCP candidate selection late (multiple `fetchpriority="high"` images loading and painting in sequence — see Finding 3) — the metric isn't settling on its final candidate until well after the page visually appears interactive.

**Recommendation (priority order):**
1. Eliminate render-blocking font requests (Finding 2) — this is the fastest lever since it affects the render-delay component on all four pages, including the two non-image LCP pages.
2. Stop loading 3+ hero/product images simultaneously with `fetchpriority="high"` (Finding 3) — only the true above-the-fold LCP candidate should carry high priority; treat this as the primary fix for `/` and `/collection` specifically.
3. Re-measure after 1–2 with a real Lighthouse trace (Performance panel, not just the summary audit) to confirm the LCP candidate stops "moving" during carousel initialization.

---

## Finding 2: Two separate font providers (Google Fonts + Fontshare) both render-block, costing ~2.2–2.3s per page

**Severity:** High

**Description:**
Every page loads web fonts from **two independent third-party origins** — Google Fonts (`fonts.googleapis.com`/`fonts.gstatic.com`, serving Libre Caslon Display, Taviraj, Noto Sans Thai) and Fontshare (`api.fontshare.com`/`cdn.fontshare.com`, serving the Switzer variable family in 5 weights). Both font CSS requests are render-blocking, and each spawns its own connection/DNS/TLS chain plus 2–3 chained `.woff2` downloads before text can paint. Lighthouse's `render-blocking-insight` estimates ~2.2–2.3s of savings from this on every page tested.

**Evidence (`render-blocking-insight`, homepage):**
```
https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap   — 3,417 bytes, 1,359ms wasted
https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Taviraj...  — 1,233 bytes, 848ms wasted
https://kath-ebon.vercel.app/_astro/index.iHviT1od.css                            — 2,239 bytes
https://kath-ebon.vercel.app/_astro/Layout.ZCfJlkHQ.css                           — 5,626 bytes, 154ms wasted
```
`third-parties-insight` shows Google Fonts transferring 44,329 bytes and Fontshare transferring 62,152 bytes — 106KB combined, 5 font files across 2 origins, all part of the same critical request chain (confirmed via `network-dependency-tree-insight`, homepage document → font CSS → font files, each hop 750–939ms). Estimated render-blocking savings per page: `/` 2,230ms, `/collection` similar, `/about` 2,240ms, `/contact` 2,270ms.

**Recommendation:**
1. Consolidate to a single font provider if feasible — Switzer (Fontshare) is a paid/licensed variable font that likely can't move to Google Fonts, but consider self-hosting both font families from `/public` (or via `@fontsource`/local `.woff2` files bundled at build time) to cut this down to a single same-origin request with no extra DNS/TLS handshake.
2. Preload the actual font files (not just the CSS) for the above-the-fold weights only: `<link rel="preload" as="font" type="font/woff2" href="..." crossorigin>` for the 1–2 weights actually used in the LCP-critical viewport (e.g. the heading font, body font at the weight used on first paint).
3. Confirm `font-display: swap` is set for all families (it is present in the query strings shown above via `&display=swap`, so `font-display-insight` correctly passes — good, keep this) so at minimum text isn't invisible while fonts load, even before self-hosting is done.
4. Trim to only the weights actually used. Switzer is being requested at 300/400/500/600/700 (5 weights) — audit the codebase for which weights actually render and drop unused ones from the Fontshare query string.

---

## Finding 3: Hero carousel and product-grid images are oversized, over-compressed, and multiple images share `fetchpriority="high"`

**Severity:** High

**Description:**
On the homepage, the hero section renders a strip of images at ~148px display width, but at least 3 of them are served as full-resolution 1206–1608px WebP files with `loading="eager" fetchpriority="high"` — meaning the browser is told to urgently fetch multiple 300+KB images at once, all competing for bandwidth/priority against the one that's actually the LCP candidate. On `/collection`, the same pattern appears in the product grid: images displayed at 651×867–977px are served at up to 1206×1508px source resolution, several also marked `eager`/`high` priority simultaneously.

**Evidence (`image-delivery-insight`):**

Homepage — est. total savings **1,006 KiB**:
```
/products/vest-set-dusty-blue-2.webp   350,210 bytes → 272,253 bytes wasted (compression only; displayed at ~148px width)
/products/trousers-taupe-plaid.webp    327,650 bytes → 249,693 bytes wasted (compression only)
/products/trousers-sand.webp           (additional hero slide, same pattern)
```
All three carry `fetchpriority="high"` / `loading="eager"` in the markup simultaneously (only the first hero slide is actually visible at first paint).

`/collection` — est. total savings across just the first 3 flagged images: **265KB** (out of 424,560 bytes total wasted across 7 flagged images):
```
/products/trousers-sand.webp            197,298 bytes → 103,206 bytes wasted
  - 49,378B from compression
  - 71,797B from serving 843×1053 source for a 651×867 display size
/products/crop-top-yellow-gingham.webp  135,288 bytes → 87,983 bytes wasted
  - all from serving 1206×1508 source for a 651×977 display size
/products/trousers-papaya.webp          113,954 bytes → 74,109 bytes wasted
  - same 1206×1508-for-651×977 oversizing
```
Images account for 90% of total page weight on `/` (1,630 of 1,768 KiB) and 82% on `/collection` (800 of 956 KiB) — this is the single biggest byte-weight lever on both pages, and directly extends the "resource load" and (via priority contention) "render delay" portions of LCP identified in Finding 1.

**Recommendation:**
1. Generate and serve responsive `srcset`/`sizes` variants (Astro's built-in `<Image>`/`getImage()` from `astro:assets`, or a Vercel/Cloudinary image CDN) so a 651px-wide card doesn't download a 1206–1608px source. This alone accounts for the majority of wasted bytes on `/collection`.
2. Increase WebP compression on the hero images specifically — `vest-set-dusty-blue-2.webp` and `trousers-taupe-plaid.webp` are losing 250–272KB each to under-compression, independent of the sizing issue.
3. Only the single true LCP candidate (first visible hero slide / first above-the-fold product image) should carry `fetchpriority="high"` + `loading="eager"`. Every other hero slide/product image should be `loading="lazy"` with default (or `fetchpriority="low"`) priority so it doesn't compete with the actual LCP resource for bandwidth on page load.
4. Consider AVIF as a fallback-first format with WebP fallback for a further ~20-30% size reduction over WebP at equivalent quality, if browser support requirements allow.

---

## Finding 4: JavaScript (Lenis smooth-scroll, QRCode library) is not a performance bottleneck — TBT is 0-50ms, total script weight is ~24KB

**Severity:** Info

**Description:**
The brief for this audit flagged `lenis` (smooth-scroll) and `qrcode` as dependencies worth checking for JS weight/main-thread impact. Lab measurement shows this concern doesn't materialize: **Total Blocking Time is 0ms on 3 of 4 pages and 50ms on `/collection`** (Good threshold is <200ms), and total script transfer weight is only ~24.4–24.5 KB across all 7 script requests on every page tested.

**Evidence (homepage `network-requests`, resourceType=Script):**
```
Layout.astro_astro_type_script_index_0  664 B
Layout.astro_astro_type_script_index_1  5,867 B
Layout.astro_astro_type_script_index_3  1,747 B
Layout.astro_astro_type_script_index_6  1,278 B
Layout.astro_astro_type_script_index_7  1,075 B
state.js                                9,900 B
products.js                             3,942 B
Total: 24,473 bytes transferred (~74KB uncompressed)
```
`long-tasks` audit found exactly **one** long task on the homepage, 167ms, and `bootup-time`/`mainthread-work-breakdown` show only 0.2–1.9s of total JS execution across the entire page lifecycle — not a bottleneck. `forced-reflow-insight` did flag two minor forced synchronous layout events (82.5ms from an inline script, 3.5ms from a `Layout` bundle script) — small enough not to threaten INP, but worth a quick look if Lenis or the quick-view interaction handlers are reading layout properties (`offsetTop`, `getBoundingClientRect`, etc.) inside a scroll/resize handler without batching.

**Recommendation:**
No action needed on JS payload size or main-thread blocking — this is not where the site's performance problems are. If INP needs real-user validation later (lab data has no interaction trace to measure INP directly — `interaction-to-next-paint` audit returned no score in this lab run, which is expected since Lighthouide doesn't simulate user interactions), prioritize testing the `/collection` quick-view modal open/close interaction specifically once field data (CrUX) is available, since that's the one meaningfully interactive surface on the site. Low-priority: investigate the 82.5ms forced reflow source (homepage inline script, byte offset ~21400) if/when touching that code, but it is not currently a Core Web Vitals risk.

---

## Finding 5: CLS is excellent across the board — no action needed

**Severity:** Info

**Description:**
Cumulative Layout Shift measured **0** (perfect) on all four pages tested. All hero and product images carry explicit `width`/`height` attributes (confirmed in markup snippets captured during this audit, e.g. `width="1206" height="1508"`), so no layout shift was observed from image loading, font swapping, or dynamically injected content in this lab run.

**Recommendation:**
No action needed. Keep enforcing explicit `width`/`height` (or `aspect-ratio`) on any new images added to the product catalog or content pages so this remains true — this is the main way CLS regressions get introduced later.

---

## Finding 6: Server response time (TTFB) is excellent — Vercel edge is not a bottleneck

**Severity:** Info

**Description:**
`server-response-time` audit shows the root document responding in 30ms (lab, from the test location) on every page, and TTFB as measured inside the LCP breakdown was 104–227ms across all four pages. This comfortably passes the <200ms TTFB good threshold on `/`, `/collection`, and `/contact`, and is only marginally over on `/about` (227ms) — not a concern.

**Recommendation:**
No action needed. TTFB is not contributing meaningfully to the LCP failures identified in Finding 1 — the problem is entirely render-blocking resources (Finding 2) and image/priority handling (Finding 3), not server/edge latency.

---

## Prioritized Action List

1. **(High, do first)** Fix hero/product image `fetchpriority`/`loading` so only the true LCP candidate is eager+high-priority; add responsive `srcset` sizing and recompress hero WebPs. Expected impact: directly cuts LCP on `/` and `/collection` from Poor (5.9–6.2s) toward Needs-Improvement/Good range, and removes ~1,000 KiB / ~425 KiB of wasted transfer respectively.
2. **(High)** Consolidate/self-host fonts and preload critical font files instead of two render-blocking third-party CSS requests. Expected impact: ~2.2–2.3s of render-blocking savings per page per Lighthouse's own estimate — this is the fix that helps all four pages, including the two where LCP is text-based.
3. **(Medium)** Re-run Lighthouse with a full trace (not just summary audits) on `/` after fixes 1–2 to confirm the LCP candidate stabilizes early rather than "moving" during carousel rotation.
4. **(Low/Info)** No action required on JS weight (Lenis/QRCode are lightweight, TBT 0-50ms) or CLS (already 0). Re-validate INP with real interaction traces once CrUX/field data is available, focusing on the `/collection` quick-view interaction.
5. **(Housekeeping)** Once traffic accrues, re-run this audit against CrUX field data (28-day real-user percentiles) — the current 69-86 Lighthouse performance scores and Poor/Needs-Improvement LCP verdicts are single-run lab measurements on a possibly-cold Vercel edge cache and may not match real-world 75th-percentile figures.
