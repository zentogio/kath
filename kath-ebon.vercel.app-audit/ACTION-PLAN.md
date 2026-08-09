# SEO Action Plan — Studio Kath (kath-ebon.vercel.app)

Prioritized by impact and effort. See [`FULL-AUDIT-REPORT.md`](FULL-AUDIT-REPORT.md) for full evidence behind each item, and `findings/*.md` for per-category detail including ready-to-use code snippets.

---

## Critical — Fix Immediately

| # | Item | Why | Where |
|---|---|---|---|
| 1 | Delete/rewrite the fabricated "Founded in 2019... bespoke tailoring" paragraph | Contradicts the real business model; risks AI engines citing false facts about the brand | `src/i18n/dict.ts` lines ~148–166 (`about.founding1-3`) |
| 2 | Add `public/robots.txt` with `Disallow: /checkout*` and a future `Sitemap:` line | No crawl policy exists at all today | New file |
| 3 | Add `noindex, follow` meta to `/checkout`, `/checkout/payment`, `/checkout/complete` | These are pre-launch demo pages, fully indexable today | `src/pages/checkout/**` |
| 4 | Fix `/about` vs `/about/` duplicate URL | Confirmed live bug — same content, two URLs, no redirect | `astro.config.mjs` (`trailingSlash`) |
| 5 | Add self-referencing canonical tags site-wide | Zero canonicals exist anywhere | `src/layouts/Layout.astro` (needs `site` set in `astro.config.mjs` first) |
| 6 | Add `ClothingStore` + `WebSite` JSON-LD site-wide | Zero structured data anywhere; ready-to-use snippet with real business data already written | `src/layouts/Layout.astro` — snippet in `findings/schema.md` |

---

## High — Fix Within 1 Week

| # | Item | Why | Where |
|---|---|---|---|
| 7 | Build `/collection/[slug]` individual product page routes | Single biggest structural gap — blocks product-level ranking, Shopping eligibility, deep-linking | New dynamic route, `src/data/products.ts` already has the data |
| 8 | Add security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) | Zero security headers beyond default HSTS | New `vercel.json` |
| 9 | Fix LCP: single `fetchpriority="high"` image per page, self-host/preload critical fonts | LCP is "Poor" (5.9–6.2s) on home and collection | `src/layouts/Layout.astro`, hero components |
| 10 | Add descriptive alt text to the 8 home-page hero carousel images | Currently `alt=""` on the site's most prominent visual; same photos have good alt text elsewhere | Hero component |
| 11 | Add named founder/maker content with a real photo | Biggest E-E-A-T gap for a "hand-cut by a person" claim | `src/pages/about.astro` |
| 12 | Manually verify/create a Google Business Profile ("by appointment" hours) | Unknown whether one exists; can't be checked from this tooling | Google Business Profile Manager (external) |
| 13 | Add `Organization` `sameAs` links to Instagram/Facebook/Shopee/Lazada | Free, already-available data; strengthens entity signal | Part of item #6's schema block |

---

## Medium — Fix Within 1 Month

| # | Item | Why | Where |
|---|---|---|---|
| 14 | Add `BreadcrumbList` JSON-LD to the 4 interior pages | Near-free rich-result eligibility given the flat site structure | Snippet in `findings/schema.md` |
| 15 | Add Open Graph + Twitter Card tags site-wide | Currently empty on every page — affects social/AI-chat link previews | `src/layouts/Layout.astro` |
| 16 | Add 80–150 words of real per-product content (fabric, sourcing, run number) | Once product pages exist (#7); closes a thin-content gap at exactly the point buyers want substantiation | Product page template |
| 17 | Consolidate scattered brand-process facts into 1–2 self-contained ~140–160 word passages with question-phrased subheadings | Directly targets how AI Overviews/ChatGPT extract citable answers | `src/pages/about.astro` |
| 18 | Reduce repeated brand-claim phrasing on the homepage; replace with new provenance detail | Same claim restated 3× before any new information appears | `src/pages/index.astro` |
| 19 | Add `ItemList` schema + one-line material/craft tags to `/collection` cards | Strengthens the category-page SERP match; answers "see the craft up close" intent at browse stage | `src/pages/collection.astro` |
| 20 | Align social/marketplace brand handles (`studio.kath` / `kathh.studio` / `studiokath`) | Weakens entity resolution across platforms the brand already controls | Instagram, Facebook (external), then update links in `SocialLinks.astro` |
| 21 | Add the missing ", Thailand" to the visible on-page address | Minor completeness gap in an otherwise-good NAP block | `src/pages/contact.astro`, footer |
| 22 | Expand the `/contact` "visit the studio" section — real photos, what a visit is like, Bangkok wayfinding | Currently one address line; reusable for GBP description later too | `src/pages/contact.astro` |
| 23 | Rewrite the 5 near-duplicate trouser colorway descriptions (or treat as variants of one product page) | Thin/duplicate-content risk the moment product pages (#7) ship | `src/data/products.ts` |
| 24 | Reframe target keywords away from B2B-leaning head terms toward consumer/editorial-friendly phrasing | Current head terms return manufacturer SERPs, not shopping results | Content/marketing strategy, not code |

---

## Low — Backlog

| # | Item | Why |
|---|---|---|
| 25 | Add IndexNow key file/integration | Cheap win, sequence after domain migration and sitemap |
| 26 | Add `@astrojs/sitemap` | Not urgent at 8 routes; auto-extends once product pages exist |
| 27 | Switch contact email off personal Gmail once custom domain is live | Minor trust signal |
| 28 | Add shipping/tax line to checkout total | Fine pre-launch; close before real payment goes live |
| 29 | Add SKU/GTIN/MPN/brand fields to product data model | Relevant once a Merchant Center feed is built |
| 30 | Replace the opaque Lazada short link with a stable storefront URL | Citation-longevity risk |
| 31 | Fix 13px horizontal overflow on mobile (Home, About) | Subtle but noticeable on an otherwise polished layout |
| 32 | Increase mobile nav-link/language-toggle touch targets to ~44px | Below WCAG 2.5.5 guidance |
| 33 | Add `llms.txt` and a deliberate AI-crawler policy in `robots.txt` | Turns ambiguous-by-omission into a documented, intentional stance |
| 34 | Ship real server-rendered `/th/` Thai-language routes with reciprocal `hreflang` | Primary audience is "primarily in Thailand" per product spec, but gets zero indexable Thai content today |

---

## Sequencing Notes

- **Fix the About-page content (#1) before adding any schema (#6, #14)** — don't encode contradictory facts into structured data.
- **Migrate off the `*.vercel.app` subdomain before any deliberate link-building, PR outreach, or directory submissions** — backlink/citation equity earned on the preview subdomain won't transfer automatically.
- **Product pages (#7) are a prerequisite for**: Product/Offer schema, Merchant Center eligibility, per-product content (#16), and fixing the weakest SXO persona (editorial/press-referred discoverers, 43/100).
- **Don't add `Product`/`Offer` schema or fixed opening hours until they're true** — checkout isn't wired to real payment yet, and no visit hours are published; structured data must match real, visible facts.

---

## Offer

A professional PDF version of this report (with charts, metric cards, and the full implementation roadmap) can be generated on request via the report generator. Let me know if you'd like it.
