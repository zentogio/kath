# Technical SEO Findings — Studio Kath (kath-ebon.vercel.app)

Audited: 2026-08-09. Live fetch of all 8 known routes (`/`, `/about`, `/collection`, `/contact`, `/privacy`, `/checkout`, `/checkout/payment`, `/checkout/complete`) plus `robots.txt`, `sitemap.xml`, `sitemap-index.xml`, `sitemap_index.xml`, `wp-sitemap.xml`, `.well-known/robots.txt`, `humans.txt`, `ads.txt`, and an IndexNow key-file probe. Cross-checked against source (`astro.config.mjs`, `src/pages/**`, `src/layouts/Layout.astro`, `src/scripts/i18n.ts`) to confirm root cause, not just symptom.

Stack facts confirmed: Astro v7.1.6, static output (no adapter in `astro.config.mjs`, no `output: 'server'`), deployed on Vercel. `render_page.py` reports `is_spa: false` and full `extracted_text` on every route via raw HTML fetch — no client-side rendering is required to see page content.

**Technical Score: 46/100**

Score basis: strong fundamentals (static HTML, SSR content, per-page unique titles/descriptions, proper image dimensions, HTTPS+HSTS, clean URLs) are undercut by a complete absence of crawlability infrastructure (no robots.txt, no sitemap), zero indexation controls (no canonicals, no meta robots anywhere, including on transactional pages that should be excluded), zero structured data, a real duplicate-URL bug (trailing slash), and a full security-header gap. For a pre-launch site this is fixable cheaply, but as currently deployed it would index unpredictably and duplicate itself in search.

---

## Critical

### 1. No robots.txt at all (404)
**Description:** `https://kath-ebon.vercel.app/robots.txt` returns HTTP 404. Verified directly and via `sitemap_discovery.py`, which logged `"warnings": ["robots.txt returned HTTP 404"]` and found zero `declared` sitemap references. Also checked common fallback paths (`/​.well-known/robots.txt`) — also 404. `public/` in the repo contains no `robots.txt` source file, so this isn't a deploy fluke — it was never created.
**Impact:** No mechanism to declare a sitemap to crawlers, no way to block low-value routes (`/checkout`, `/checkout/payment`, `/checkout/complete`) from being crawled, and no documented crawl policy for AI/LLM crawlers ahead of launch.
**Recommendation:** Add `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /checkout
Disallow: /checkout/payment
Disallow: /checkout/complete

Sitemap: https://<production-domain>/sitemap-index.xml
```
Decide AI-crawler policy (GPTBot, ClaudeBot, PerplexityBot, etc.) deliberately rather than by omission before launch.

### 2. No sitemap.xml / sitemap-index.xml (404 on all common paths)
**Description:** Confirmed via `sitemap_discovery.py` — `sitemap.xml`, `sitemap_index.xml`, `sitemap-index.xml`, and `wp-sitemap.xml` all return HTTP 404, and no sitemap is `declared` in robots.txt (because robots.txt doesn't exist) or `found` by heuristic discovery.
**Impact:** With only 8 routes this doesn't block crawling today, but it removes the standard signal for lastmod/priority and is table stakes before launch, especially once product detail state or additional pages are added.
**Recommendation:** Astro has no built-in sitemap for this project (no `@astrojs/sitemap` integration in `package.json`). Add it, configure `site` in `astro.config.mjs` (currently unset — `defineConfig({})` has no `site` field, which also silently disables absolute-URL generation for anything that needs it, e.g. Open Graph/canonical tags added later), and exclude the three checkout routes.

### 3. No canonical tags on any page
**Description:** Grepped raw HTML of all 8 routes for `rel="canonical"` — zero matches anywhere, confirming the brief. Combined with Critical #4 below (trailing-slash duplication), there is currently no signal telling Google which URL variant is authoritative.
**Impact:** Search engines must guess the canonical URL. Low risk today given low domain authority, but this is a load-bearing gap once indexing begins, and it's a five-minute fix.
**Recommendation:** Add `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />` in `Layout.astro` (requires `site` to be set in `astro.config.mjs` first — see #2).

---

## High

### 4. Trailing-slash URL duplication — both `/about` and `/about/` serve 200 with identical content, no redirect, no canonical
**Description:** Verified directly:
```
GET https://kath-ebon.vercel.app/about/  -> HTTP/1.1 200, Etag: "94991b089380b1de6237f705f1bd2772"
GET https://kath-ebon.vercel.app/about   -> HTTP/1.1 200, Etag: "94991b089380b1de6237f705f1bd2772"
```
Same `Etag`, same `Content-Length` (30759 bytes), no redirect either direction. `astro.config.mjs` has no `trailingSlash` setting configured (`defineConfig({})`), which leaves Astro's default (`'ignore'`) in place — Astro does not enforce one form at build/serve time, and there's no canonical tag (Critical #3) to disambiguate after the fact.
**Impact:** Every one of the 8 routes is reachable at two URLs with identical content and no canonicalization — genuine duplicate-content surface area that a canonical tag alone would fix, but which is currently unmitigated on two fronts at once.
**Recommendation:** Set `trailingSlash: 'never'` (or `'always'`) explicitly in `astro.config.mjs` to get build-time consistency, add the canonical tag from #3, and confirm Vercel isn't independently rewriting slash variants once a `vercel.json` is introduced for headers (#6).

### 5. Checkout funnel pages fully indexable with zero noindex — including on preview subdomain
**Description:** `/checkout`, `/checkout/payment`, and `/checkout/complete` all return 200 with unique, crawlable titles ("Checkout — Studio Kath", "Payment — Studio Kath", "Thank You — Studio Kath") and no `<meta name="robots">` tag, no `X-Robots-Tag` header (checked in response headers for all three — absent), and are also not excluded via robots.txt (which doesn't exist, #1). Per PRODUCT.md, checkout is UI-only and not wired to real payment.
**Impact:** These are non-canonical, non-content, transactional-shell pages that provide zero search value and actively look bad indexed (`/checkout/payment` displaying a QR/bank-transfer placeholder UI, `/checkout/complete` showing "No recent order found" as the only real content in the empty-cart state — see extracted text: `"Thank You\nNo recent order found.\nYour cart is empty..."`). If indexed pre-launch, this is a poor first impression and dilutes crawl attention across a tiny site.
**Recommendation:** Add `<meta name="robots" content="noindex, follow">` to the three checkout routes (or a shared `noindex` prop on `Layout.astro` for that subtree), and also `Disallow` them in robots.txt (#1) as defense in depth.

### 6. Missing security headers site-wide (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
**Description:** Response headers captured for all 7 fetched routes (`/`, `/about`, `/collection`, `/contact`, `/privacy`, `/checkout`, `/checkout/payment`, `/checkout/complete`) are identical in structure and none contain `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, or `Permissions-Policy`. Only `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` is present (Vercel default). There is no `vercel.json` in the repo root and no custom headers configuration anywhere in the project, confirming this is a source-level gap, not a fetch artifact.
**Impact:** Not a direct rankings factor, but Google's security/UX signals and browser-side trust indicators are weaker; more importantly this is a real hardening gap (clickjacking via missing `X-Frame-Options`/`frame-ancestors`, MIME-sniffing via missing `X-Content-Type-Options: nosniff`) on a site that will handle checkout-adjacent UI.
**Recommendation:** Add a `vercel.json` with a `headers` block (Astro's static output on Vercel respects Vercel's own headers config since there's no Astro-level middleware for static builds):
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
      { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' fonts.googleapis.com api.fontshare.com; font-src fonts.gstatic.com; script-src 'self'" }
    ]
  }]
}
```
CSP will need tuning against the actual Google Fonts/Fontshare `<link>` tags in `Layout.astro` — test in report-only mode first since the site loads external font CSS synchronously.

### 7. No structured data (JSON-LD) anywhere on the site
**Description:** `render_page.py`'s `structured_data` block reports `"block_count": 0"` on every one of the 7 fetched routes. Grepped raw HTML for `application/ld+json` across all 8 routes — zero matches. Confirmed as stated in the brief.
**Impact:** This is a DTC clothing brand with a `/collection` page listing individual products (name, price, sold-out status all present in `src/data/products.ts`-driven markup) and no `Product`/`Organization`/`BreadcrumbList` schema. Zero eligibility for rich results (price, availability, review stars) once real payment goes live, and weaker entity disambiguation for "Studio Kath" as a brand name in search.
**Recommendation:** Minimum viable schema before launch:
- `Organization` (name, logo, sameAs) on every page via `Layout.astro`.
- `Product` schema per item on `/collection`, sourced from the same `products.ts` data already driving the UI (`offers.availability` mapped from `product.soldOut`).
- `BreadcrumbList` if any deeper product-detail routing is added later.
Do not add `Product` schema with `offers` implying a live transaction until checkout is actually wired to payment — schema misrepresenting purchasability is a Merchant Center / rich-results policy risk.

---

## Medium

### 8. Thai-speaking primary audience gets no indexable Thai content, no `/th/` URLs, and no `hreflang` — client-side-only i18n
**Description:** Confirmed via `src/scripts/i18n.ts`: language switching is done entirely by `document.querySelectorAll('[data-i18n]').forEach(el => el.innerHTML = dict[key][lang])` after the page has already loaded, triggered by a button click (`data-lang-set`) or a stored preference (`getLang()`/`onLangChange`). `document.documentElement.lang` is only updated client-side (`applyAll` sets `document.documentElement.lang = lang`), never server-side — every route's SSR HTML (verified across all 8 fetched pages) has `<html lang="en">` regardless of any stored user language preference. There are no `/th/` (or `?lang=th`) URLs — the same URL serves both languages depending on client JS state — and there is no `<link rel="alternate" hreflang="...">` anywhere in any fetched HTML.
**Impact:** Per PRODUCT.md, the target users are "primarily in Thailand." As built, Google can only ever crawl and index the English variant — Thai text is never present in the HTML response for any crawler (Googlebot does render JS, but on a second, delayed wave, and even then there is no separate URL to index the Thai variant against, no way to serve Thai to Thai searchers via SERPs, and no hreflang to tell Google the relationship even if it did exist). This is a real and significant gap against the stated audience, not a nuance.
**Recommendation:** At minimum, ship the Thai copy that already exists in `dict` (`src/i18n/dict.ts`) as real, crawlable, server-rendered `/th/` routes (Astro supports this cleanly with either file-based `[lang]` routing or a static `i18n` config) with reciprocal `hreflang="en"`/`hreflang="th"`/`hreflang="x-default"` tags. This is flagged as Medium here per audit scope (core crawlability focus) — recommend a follow-up pass from the `seo-hreflang` sub-skill once `/th/` routes exist, since implementation details (URL structure, `x-default` choice, canonical-per-language) are its remit.

### 9. Site-wide e-commerce UI boilerplate (cart drawer, quick-view, size dialog) is injected as crawlable text on every page, including content-thin pages
**Description:** `Layout.astro` unconditionally includes `<CartDrawer />`, `<ProductQuickView />`, and `<SizeSelectDialog />` for all 8 routes. These are `hidden`-attribute (not `display:none` via CSS-only) elements, but their full text content is present in the raw server-rendered HTML on every page. This was caught by an anomaly in `/checkout/complete`'s extracted text: `"Thank You\nNo recent order found...\nSold Out\nAll pieces cut to order...\nSize Guide (in)\nSize\nQuantity"` — text that has nothing to do with a thank-you/empty-cart page. Traced to source: `ProductQuickView.astro` (`Sold Out`, `common.soldOut`) and `SizeSelectDialog.astro` (`Size Guide (in)`, `Quantity`) are globally mounted, not page-specific.
**Impact:** On already-thin pages (`/privacy`, `/checkout/complete`), this boilerplate can outweigh the actual unique page content in the raw HTML, diluting the unique-content signal and potentially confusing content-quality/thin-content heuristics. It's also identical byte-for-byte across all 8 pages, adding to the duplicate-content surface alongside #4.
**Recommendation:** Not urgent to remove functionally (these power real UI interactions), but consider whether `hidden` elements need their full text in the initial HTML on pages where they're never opened (e.g., `/privacy` has no cart/quick-view trigger), or at minimum don't treat this boilerplate as a substitute for building out real unique copy on the thinner pages.

### 10. Deployed only on a `*.vercel.app` preview subdomain — not production-ready for indexing
**Description:** Confirmed the site is served at `kath-ebon.vercel.app`, a Vercel preview/project subdomain, not a custom production domain. No `site` is set in `astro.config.mjs`, and there is no canonical/robots/sitemap infrastructure pointing at a future production domain either.
**Impact:** If this subdomain gets crawled and indexed before the real domain launches, Google will index the wrong host, and post-launch migration (canonical shift, 301s, sitemap swap, GSC property change) will need to happen retroactively. `X-Robots-Tag: noindex` at the Vercel project level for preview deployments is a common safeguard that appears to not be in place — the homepage returned normal cacheable 200s with `X-Vercel-Cache: HIT`, no `X-Robots-Tag`.
**Recommendation:** Either password-protect/deployment-protect the preview subdomain, or add a blanket `X-Robots-Tag: noindex` response header for the `*.vercel.app` host specifically (keeping it off once the real domain is live) so nothing gets indexed against the throwaway host pre-launch.

---

## Low

### 11. No IndexNow key file / no IndexNow integration
**Description:** Probed `https://kath-ebon.vercel.app/indexnow.txt` and equivalent common key-file patterns — 404. No IndexNow submission code found anywhere in `src/` (`grep -r "indexnow"` returned no matches).
**Impact:** Minor — IndexNow (Bing/Yandex/Naver) push-based indexing isn't critical for an 8-page site pre-launch, but it's a cheap win once the sitemap/domain situation (#2, #10) is settled, especially given Naver/Yandex relevance if Thai/regional search engines matter to this audience.
**Recommendation:** Defer until production domain is live (#10) and sitemap exists (#2); then generate an IndexNow key, host it at `/​<key>.txt`, and submit routes on publish via Vercel deploy hooks.

### 12. Render-blocking third-party font CSS on every page (CWV risk, not yet lab-measured)
**Description:** `Layout.astro` loads two synchronous, render-blocking stylesheets on every route: `fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Taviraj...&family=Noto+Sans+Thai...&display=swap` and `api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap`, both via plain `<link rel="stylesheet">` (not preloaded, not inlined, not self-hosted). `preconnect` hints are present for both origins, which helps, but the CSS itself still blocks first paint until two additional round-trips resolve.
**Impact:** Elevated LCP risk on slow/mobile connections (a stated audience is Thailand — mobile-heavy, mixed connection quality) since the hero image (which is `fetchpriority="high"`/`loading="eager"`, correctly marked) still can't paint until render-blocking CSS resolves. `font-display: swap` is set, which limits FOIT/CLS risk from the fonts themselves, but does not address the initial render delay. Note the homepage hero also eager-loads **three** `fetchpriority="high"` images simultaneously (one per hero column, `trousers-sand`, `blouse-papaya-puff`, `vest-set-dusty-blue-2`) — competing high-priority requests that could delay whichever one is the actual LCP element.
**Recommendation:** Self-host the two font families (or at minimum add `rel="preload" as="style"` for the font CSS + `rel="preload" as="font"` for the actual woff2 files) to remove the extra round-trip; reduce the hero to a single `fetchpriority="high"` image (the true above-the-fold LCP candidate) and downgrade the other two hero-column first images to default priority since only one column set is likely the LCP element depending on viewport.

---

## Passed / Confirmed Healthy

- **Static SSR, no CSR dependency:** `is_spa: false` on every route; full text content present in raw (unrendered) HTML fetch — Googlebot doesn't need a second rendering wave to see page content.
- **HTTPS + HSTS:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` present on all routes; `http://` requests get a proper `308 Permanent Redirect` to `https://` (verified directly).
- **Clean URL structure:** All 8 routes use flat, readable, hyphen-free paths with no query-string or ID-based URLs.
- **No broken redirect chains:** `redirect_chain: []` on every fetched route; unknown paths correctly 404 (verified `/nonexistent-page-xyz` → 404, `/About` case-sensitive path → 404, no soft-404s).
- **Unique titles & meta descriptions per page:** All 8 routes have distinct, descriptive `<title>` and `<meta name="description">` values (verified via direct grep of each page's HTML) — no duplication or missing tags.
- **Correct mobile viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1">` present identically on all 8 routes.
- **CLS-conscious image markup:** Product and hero `<img>` tags consistently ship explicit `width`/`height` attributes matching their aspect ratio (verified in `ProductCard.astro` and `index.astro`), which reserves layout space and limits image-driven CLS. `loading="lazy"` is correctly applied to below-the-fold/carousel images, `loading="eager"` reserved for above-the-fold hero images.
- **Descriptive alt text on meaningful images:** Content-bearing images (product shots in `about.astro`, `ProductCard.astro` via `product.alt`) have descriptive alt text; purely decorative hero background slides correctly use `alt=""`.
