# Full SEO Audit — Studio Kath (kath-ebon.vercel.app)

**Audited:** 2026-08-09
**Business:** Studio Kath — hand-cut, small-batch clothing studio, Bangkok, Thailand. Pre-launch: checkout UI is fully built but not wired to real payment yet. Hybrid model — primarily DTC e-commerce (site, Shopee, Lazada) with a real, appointment-visitable physical studio.
**Site:** 8 routes total (Astro v7.1.6, static SSR, Vercel-hosted on a `*.vercel.app` preview subdomain) — `/`, `/about`, `/collection` (18 products), `/contact`, `/privacy`, `/checkout`, `/checkout/payment`, `/checkout/complete`.

## SEO Health Score: 42 / 100

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 46/100 |
| Content Quality | 23% | 54/100 |
| On-Page SEO / SXO | 20% | 38/100 |
| Schema / Structured Data | 10% | 8/100 |
| Performance (CWV) | 10% | 58/100 |
| AI Search Readiness (GEO) | 10% | 21/100 |
| Images | 5% | 62/100 |

Supplementary specialist audits (E-commerce, Local SEO, Backlinks) are not folded into this weighted score — they fall outside the standard 7-category framework — but their findings are fully reflected in the action plan below, since several of them (no product pages, no GBP signal, subdomain risk) are materially important to this specific business.

**Read this score in context:** this is a pre-launch site. A large share of the gap — zero backlinks, zero reviews, zero AI-citation history — is structurally expected for any brand at this stage, not a quality failure. The score is most useful as a pre-launch punch list, not a verdict on the brand.

---

## Executive Summary

### Top 5 Critical Issues

1. **The About page contains fabricated content that contradicts the real business.** `src/i18n/dict.ts` describes Studio Kath as a bespoke, made-to-measure tailoring house "founded in 2019" — directly contradicting the fixed-SKU, small-batch, S–XL ready-to-wear model described everywhere else on the site (and the footer's `© 2026`). Two independent specialist audits (Content, GEO) flagged this as the single highest-impact problem on the site: if indexed, an AI Overview or ChatGPT answer could confidently tell a customer something false about the brand.
2. **Zero structured data anywhere.** No Organization, LocalBusiness, Product, BreadcrumbList, or WebSite JSON-LD exists on any of the 5 indexable pages — confirmed by four separate audits (Technical, Schema, GEO, Local).
3. **No individual product pages.** All 18 products live only as JS quick-view modals on one `/collection` URL with no `href`, no unique title/schema, and no way to deep-link a specific piece — blocking Google Shopping eligibility, product-level ranking, and social/press deep-links.
4. **No crawlability infrastructure.** No `robots.txt`, no `sitemap.xml`, no canonical tags anywhere — plus a real duplicate-URL bug (`/about` and `/about/` both serve identical 200s with no redirect).
5. **Checkout funnel pages are fully indexable.** `/checkout`, `/checkout/payment`, `/checkout/complete` have no `noindex` despite showing pre-launch placeholder states ("No recent order found") that would look bad if a search visitor landed there first.

### Top 5 Quick Wins

1. Rewrite/delete the fabricated About-page paragraph — a 10-minute content edit with outsized trust/citability payoff.
2. Add `public/robots.txt` and `noindex` the three checkout routes.
3. Add `ClothingStore` + `WebSite` JSON-LD site-wide using the ready-to-use, real-data snippets in [`findings/schema.md`](findings/schema.md) — a single `Layout.astro` change.
4. Fix the `/about` vs `/about/` duplicate URL via `trailingSlash` config, and add self-referencing canonical tags.
5. Give the home-page hero carousel's 8 product images real `alt` text — currently `alt=""` on the site's single most prominent visual, while the same photos have good alt text elsewhere on the page.

---

## Technical SEO — 46/100

**What works:** Static SSR (no JS-rendering dependency), HTTPS+HSTS, clean URLs, unique titles/descriptions, correct viewport meta, CLS-conscious image markup.

**Critical**
- No `robots.txt` (404 on all paths checked)
- No `sitemap.xml`/`sitemap-index.xml` (404, no `@astrojs/sitemap` configured)
- No canonical tags on any page

**High**
- `/about` and `/about/` serve identical content with no redirect (genuine duplicate-URL bug — same ETag, same Content-Length)
- Checkout funnel pages indexable with zero `noindex`
- Security headers absent site-wide (no CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Zero structured data anywhere

**Medium**
- Thai-speaking primary audience gets no indexable Thai content — language toggle is client-side only, no `/th/` URLs, no `hreflang`
- Site-wide cart/quickview/size-dialog UI is injected as crawlable text on every page, diluting unique-content signal on thin pages
- Deployed only on a `*.vercel.app` preview subdomain with no safeguard against indexing the throwaway host

**Low**
- No IndexNow key file/integration
- Render-blocking third-party font CSS (see Performance)

Full detail: [`findings/technical.md`](findings/technical.md) · [`findings/sitemap.md`](findings/sitemap.md)

---

## Content Quality — 54/100

**What works:** The Privacy Notice is specific, PDPA-referenced, and non-generic — a genuine trust strength. Real, quotable process facts exist ("touched by hand at least three times," the 4-step cutting process).

**Critical/High**
- About page's fabricated "bespoke, founded 2019" block contradicts the real business model (see Executive Summary)
- No named founder/maker, no credentials, no process photography of a real person — the biggest credibility gap for a craft-quality claim

**Medium**
- Collection page has no per-product content beyond name + price (18 SKUs, one-line blurbs)
- Content depth is thin with near-verbatim repetition rather than elaboration (the "hand-cut/small-batch" claim restated 3× on the homepage)
- AI citation readiness undercut by buried facts and zero structured data

**Low**
- Contact email is a personal Gmail address (`info.studiokath@gmail.com`), not a branded domain

Full detail: [`findings/content.md`](findings/content.md)

---

## On-Page SEO / Search Experience — 38/100

**What works:** Unique titles/descriptions everywhere; `/about` is well-aligned to SERP expectations for brand/craft-story queries; `/collection` is structurally close to a proper category page.

**Critical**
- No individual product detail pages — the single biggest structural gap on the site (see Executive Summary), confirmed by both the SXO and E-commerce audits independently

**High**
- The original target head-terms ("hand-cut small batch clothing Bangkok", "small batch clothing brand Thailand") currently return B2B/manufacturer SERPs, not consumer shopping results — a keyword-strategy mismatch distinct from the page-type gap. "Limited edition clothing Bangkok" returns a more relevant, boutique/editorial SERP and is a better near-term target.

**Medium**
- `/collection` lacks `ItemList` schema, visible material/craft info per card, and a canonical tag
- No Open Graph or Twitter Card tags on any page

**Persona scoring** (SXO audit): the intentional slow-fashion shopper scores 54/100, a casual searcher 44/100, a custom-order inquirer 72/100, and an editorial/press-referred discoverer 43/100 — the weakest, because there's no product-level URL for a press mention to link to.

Full detail: [`findings/sxo.md`](findings/sxo.md) · [`findings/ecommerce.md`](findings/ecommerce.md)

---

## Schema / Structured Data — 8/100

**Critical**
- Zero JSON-LD anywhere — no Organization, LocalBusiness, Product, BreadcrumbList, or WebSite
- No LocalBusiness markup despite a real, appointment-visitable Bangkok studio address published on `/contact`

**Medium**
- No `WebSite` entity, no `BreadcrumbList` on any interior page

**Deferred (Info)**
- `Product`/`Offer` schema should wait until individual product URLs and live payment both exist — publishing pricing/availability schema against a non-purchasable checkout risks accuracy issues

Ready-to-use JSON-LD (using real, verified Studio Kath data — address, phone, social links) for `ClothingStore`, `WebSite`, and `BreadcrumbList` is included in full in [`findings/schema.md`](findings/schema.md).

---

## Performance (Core Web Vitals) — 58/100

*Lab data only (Lighthouse, mobile emulation) — no CrUX/PSI field data was available in this environment; treat as directional.*

| Page | LCP | CLS | TBT |
|---|---|---|---|
| `/` | 6.2s (Poor) | 0 | 0ms |
| `/collection` | 5.9s (Poor) | 0 | 50ms |
| `/about` | 3.5s (Needs Improvement) | 0 | 0ms |
| `/contact` | 3.2s (Needs Improvement) | 0 | 0ms |

**High**
- LCP fails "Good" on all four pages tested; element render delay (1.2–2.2s) dominates even on the two text-only LCP pages
- Two render-blocking font providers (Google Fonts + Fontshare) cost ~2.2–2.3s per page
- Hero/product images oversized and over-compressed, with 3+ images simultaneously marked `fetchpriority="high"` — 1,006 KiB wasted on the homepage alone

**Info (no action needed)**
- CLS is a perfect 0 everywhere; JS payload (Lenis, QRCode) is lightweight and not a bottleneck; TTFB is excellent

Full detail: [`findings/performance.md`](findings/performance.md)

---

## AI Search Readiness (GEO) — 21/100

*Expected floor for a pre-launch, zero-citation-history domain — read the dimension breakdown, not just the single number.*

**Critical**
- The same fabricated About-page content risks AI engines citing false facts about founding date and business model

**High**
- Zero JSON-LD blocks the machine-readable entity/shopping layer AI engines rely on
- Brand mention/third-party authority signal is realistically at or near zero — no YouTube, Reddit, Wikipedia, or LinkedIn presence, zero Common Crawl footprint

**Medium**
- Passage-level citability is fragmented — no paragraph on the site reaches 100 words, no question-phrased headings
- No FAQ or blog/article content anywhere to build topical (not just brand) AI citation potential

**Positive**
- Fully static/SSR — technically accessible to GPTBot, ClaudeBot, PerplexityBot etc. today, with no rendering-architecture gap to fix

Full detail: [`findings/geo.md`](findings/geo.md)

---

## Images — 62/100

**What works:** Product photography is WebP, well-resolved, and carries distinct descriptive alt text throughout the collection grid and about page. Explicit width/height everywhere — zero CLS from images.

**Medium**
- Home page hero carousel (8 images, the site's single most prominent visual) has empty `alt=""`, while the same photos have good descriptive alt text elsewhere on the page

**High** (overlaps with Performance)
- Hero and product images are oversized/over-compressed for their actual display size

**Info**
- The "9-14 missing alt" count from initial scanning was mostly a false positive — decorative nav/social icons use a bare `alt` attribute, which is spec-equivalent to `alt=""` and not a real accessibility problem since parent links carry accessible names

Full detail: [`findings/visual.md`](findings/visual.md)

---

## Supplementary: E-commerce SEO

Not part of the weighted health score, but central to this business.

- **Critical:** No individual product page URLs (same gap as On-Page SEO)
- **Medium:** Near-duplicate templated descriptions across 5 trouser colorway variants — a thin-content risk once each becomes a separate indexable page; recommend treating colorways as variants of one product page rather than 5 near-identical pages
- **Medium:** Marketplace links (Shopee, Lazada) are storefront-level only, no per-product cross-linking
- **Medium:** Inventory tracked at product level only, no per-size stock signal — a real pre-launch item to close before payment goes live
- **Low:** No shipping/tax line in checkout total; no SKU/GTIN/MPN/brand fields in the product data model
- **Strength:** Product imagery (format, resolution, alt text) is already solid

Full detail: [`findings/ecommerce.md`](findings/ecommerce.md)

## Supplementary: Local SEO

Studio Kath is a hybrid DTC + appointment-visitable-studio business — scored and read accordingly, not as a walk-in retailer.

- **High:** No visible Google Business Profile signals on-site; whether a GBP exists at all is unverified and unverifiable from this tooling — flagged as a manual check
- **Medium:** NAP exists in exactly one unstructured on-page source; the visible address is missing ", Thailand"
- **Medium:** No dedicated "visit the studio" content beyond a single address line
- **Medium:** Social/marketplace brand handles are inconsistent (`studio.kath` / `kathh.studio` / `studiokath`)
- **Low:** No reviews yet — expected pre-launch; plan a steady, non-batched solicitation cadence for later (avoid the "18-day rule" cliff)

Full detail: [`findings/local.md`](findings/local.md)

## Supplementary: Backlinks

Tier 0 data (Common Crawl only — no Moz/Bing API keys configured).

- **Info:** No backlink data exists yet — expected for a pre-launch site, not a red flag; domain absent from Common Crawl entirely (`in_crawl: false`)
- **High:** The site is on a `*.vercel.app` subdomain — any backlinks, PR, or directory listings earned now won't transfer to a future custom domain. **Migrate the domain before any deliberate link-building begins.**

Full detail: [`findings/backlinks.md`](findings/backlinks.md)

---

## Methodology & Limitations

- Rendered via `render_page.py` (raw + Playwright fallback) against the live production URL; cross-checked against the Astro source in `Z:\kath\src` to confirm root causes.
- Performance data is lab-only (local Lighthouse runs) — no CrUX/PSI field data was available (no Google API credentials configured in this environment).
- Backlink data is Tier 0 (Common Crawl + verification crawler only) — no Moz or Bing Webmaster API keys configured.
- Local SEO / GBP status could not be verified — no Maps/GBP API access in this environment; flagged as a manual check throughout.
- Marketplace (Shopee/Lazada) live pricing/competitive data could not be pulled — DataForSEO Merchant tooling only supports Google/Amazon and required cost approval that wasn't sought.
- SERP analysis (SXO audit) is based on live WebSearch snapshots at time of audit and may shift; no Google Search Console access to verify actual impressions/rankings.

See `findings/*.md` for full per-category evidence and `screenshots/` for desktop + mobile captures of all pages plus the cart drawer.
