# Schema.org / Structured Data Audit — kath-ebon.vercel.app

## Detection Summary

Verified directly (raw HTML fetch, no JS required — confirms nothing is even client-injected) on all 5 indexable routes:

| Page | `<script type="application/ld+json">` blocks | Microdata / RDFa |
|---|---|---|
| `/` | 0 | none |
| `/about` | 0 | none |
| `/collection` | 0 | none |
| `/contact` | 0 | none |
| `/privacy` | 0 | none |

`claude-seo render_page.py --json` reports `"structured_data": {"block_count": 0, "processed_count": 0, "total_bytes": 0, "blocks": []}` on every page checked. Also confirmed by `Ctrl+F`-style grep across saved raw HTML for `application/ld+json`, `itemscope`, and `itemtype` — zero matches anywhere. **There is no existing structured data to validate** — Studio Kath is starting from a completely blank slate.

---

## Finding 1: Zero structured data sitewide — no Organization, LocalBusiness, Product, BreadcrumbList, or WebSite markup exists anywhere

**Severity:** Critical

**Description:**
None of the 5 live pages emit any JSON-LD, Microdata, or RDFa. This means Google (and any AI/GEO crawler parsing structured data for grounding) has zero machine-readable signal about: who Studio Kath is as a business entity, that it has a real physical Bangkok studio address, its contact channels, its social/marketplace profiles, or what it sells. Everything the business wants surfaced (Knowledge Panel eligibility, Local Pack presence for "clothing studio Bangkok"-type queries, sitelinks search box, breadcrumbs in SERPs) currently depends entirely on Google's unassisted inference from visible text — which is strictly worse than providing explicit schema.

**Evidence:**
- API confirmation on `/`: `"structured_data": {"block_count": 0, "processed_count": 0, "total_bytes": 0, "truncated": false, "blocks": []}`
- Identical `block_count: 0` result independently confirmed on `/about`, `/collection`, `/contact`, `/privacy`.
- Raw HTML `<head>` on every page contains only: charset, viewport, favicon links, `<title>`, `<meta name="description">`, font preconnects/stylesheets, and a scoped `<style>` block — no `<script type="application/ld+json">` tag exists in the DOM at all, server-rendered or otherwise.
- `Z:\kath\src\layouts\Layout.astro` (the single shared layout used by all pages) contains no schema-injection logic, confirming this isn't a per-page gap but a sitewide, structural absence.

**Recommendation:**
Implement a base layer of structured data in `Z:\kath\src\layouts\Layout.astro` so every page inherits it for free: `Organization`/`ClothingStore` + `WebSite`, plus per-page `BreadcrumbList` on the four non-home pages. See ready-to-use JSON-LD in the **Implementation** section below.

---

## Finding 2: No Organization / LocalBusiness markup despite Studio Kath having a real, appointment-visitable physical address

**Severity:** Critical

**Description:**
Studio Kath is not a purely online-only brand — the `/contact` page explicitly invites "studio visits" and publishes a specific street address and a direct phone number, positioning it as a real place people can visit, not just an e-commerce storefront. That makes it eligible for `LocalBusiness` subtypes (specifically `ClothingStore`, which extends `Store` → `LocalBusiness` → `Organization`), not just a generic `Organization`. Without this markup, Studio Kath has no shot at Google Business Profile/Knowledge Panel corroboration, Local Pack inclusion for Bangkok-area searches, or map/place-based rich results — all of which are unlocked by consistent NAP (Name/Address/Phone) data appearing in both a Google Business Profile *and* on-site structured data.

**Evidence:**
- `/contact` raw HTML (verified without JS):
  - Address: `39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900` (`<p class="prose contact-channel__address" data-i18n="common.address">`)
  - Phone: `<a href="tel:+66815638883">+66 8 1563 8883</a>`
  - Email: `<a href="mailto:info.studiokath@gmail.com">`
  - Same address is repeated in the site footer (`site-footer__address`) on every page, confirming it's treated as canonical NAP data, not one-off copy.
  - Copy: *"Whether you have a question about sizing, want to ask about a piece that's sold out, or you'd like to visit the studio — reach out directly, any way below."* and section label *"Studio"* — confirms in-person visits are an intended use case (i.e., `LocalBusiness`/`ClothingStore` is the right type, not `Organization` alone).
  - No published opening hours or "by appointment" wording found anywhere on `/contact` — do not fabricate `openingHoursSpecification`; omit it until real hours (or explicit "by appointment only" copy) exist on the page.
- Social/marketplace profile links (site-wide footer + `/contact`, all `rel="noreferrer"` outbound links, verified in raw HTML):
  - Instagram: `https://www.instagram.com/studio.kath/`
  - Facebook: `https://www.facebook.com/kathh.studio/`
  - Shopee: `https://shopee.co.th/studio.kath`
  - Lazada: `https://s.lazada.co.th/s.ZR0XvK?c=x` — **note:** this is a Lazada short-link/tracking redirect (`s.lazada.co.th/s.xxxxx`), not a stable canonical store-front URL. It works as a `sameAs` target today, but flag that if this link ever expires/rotates (short-links are sometimes campaign-specific), it should be swapped for the canonical `https://www.lazada.co.th/shop/studio-kath` -style URL if/when one is confirmed.
  - A LINE chat link (`https://lin.ee/9TUJj1q`) also exists but is a messaging deep-link, not a public profile page — not recommended for `sameAs` (that property is meant for identity-verifying profile URLs, not chat entry points).

**Recommendation:**
Add `ClothingStore` JSON-LD sitewide (single global block in `Layout.astro`, since Studio Kath is a single-location business — no need for separate `Organization` + `LocalBusiness` entities). Use the ready-to-use snippet in **Implementation** below. Do not add opening hours until they're published in visible copy first (structured data must match visible page content, not add out-of-band facts).

---

## Finding 3: No WebSite schema (brand/site identity entity)

**Severity:** Medium

**Description:**
There is no `WebSite` entity tying the domain to the `Studio Kath` brand name, which is the schema Google uses as one input (among many) for sitelinks search box eligibility and for connecting the site to a Knowledge Graph entity. Since the site currently has **no on-site search feature** (nav only exposes menu, language toggle, and cart — no search icon/input was found on any page), a `SearchAction` `potentialAction` should **not** be added yet; adding a `SearchAction` that points at a non-existent search endpoint would be invalid/misleading structured data. Add plain `WebSite` now and layer in `SearchAction` later only if/when an actual on-site search is shipped.

**Evidence:**
- No `<input type="search">`, search icon, or `/search` route found in nav markup across `/`, `/about`, `/collection`, `/contact` — confirmed via raw HTML grep and route inventory (`Z:\kath\src\pages\` contains only `index.astro`, `about.astro`, `collection.astro`, `contact.astro`, `privacy.astro`, `checkout/`).
- `<html lang="en">` on every page; the EN/Thai toggle (`data-lang-set="en"|"th"`) is confirmed client-side-only (no separate `/th/` URLs, no `hreflang` links found) — so `WebSite.inLanguage` should be `"en"` only; no `hreflang`/multi-locale schema is warranted since Thai isn't a separately crawlable/indexable URL.

**Recommendation:**
Add the `WebSite` JSON-LD in **Implementation** below, referencing the `ClothingStore` entity as `publisher` via `@id`. Skip `potentialAction`/`SearchAction` until on-site search exists.

---

## Finding 4: No BreadcrumbList on any interior page

**Severity:** Medium

**Description:**
`/about`, `/collection`, `/contact`, and `/privacy` all sit one level under the homepage in a simple flat structure (`Home > About`, `Home > Collection`, etc.), but none of that hierarchy is expressed in schema. `BreadcrumbList` is one of the few remaining reliably-supported Google rich result types (unlike the deprecated/retired types below) and is essentially free to add given the site's shallow, stable structure.

**Evidence:** No `breadcrumb`-related markup, class name, or JSON-LD found in any page's raw HTML (grep for `breadcrumb` case-insensitive returned zero matches on `/collection`, and the same check was run across the other interior pages with the same result).

**Recommendation:** Add a small reusable `BreadcrumbList` partial in `Layout.astro` (or per-page) driven by the route path. Templates for all four interior pages are included in **Implementation** below.

---

## Finding 5: Product/Offer schema is *not* recommended yet — defer until product URLs and real checkout exist

**Severity:** Info (deferred, not a launch blocker)

**Description:**
The `/collection` page server-renders 14 products with real name, color/variant, and THB price data already present in the raw (non-JS) HTML — so the underlying data is schema-ready in principle. However, two structural blockers make publishing `Product`/`Offer` JSON-LD premature right now:

1. **No individual product URLs.** All 14 products live as cards on a single `/collection` page with no per-product permalink (e.g. `/collection/pleated-wide-leg-trousers-sand`). Google's Product structured-data guidelines expect each `Product` to be describable on its own indexable URL; cramming 14 `Product` entities into one page's JSON-LD creates ambiguous "which product is this page about" signals and isn't eligible for Merchant/product rich results in the way per-product pages would be.
2. **Checkout is not wired to real payment yet** (pre-launch/demo state, confirmed in project docs). Google explicitly requires `Offer.price`/`Offer.availability` to reflect a real, currently-purchasable state. Publishing `Offer` schema with prices/`InStock` availability against a checkout flow that can't actually complete a purchase risks structured-data accuracy issues once the page is evaluated for rich results, and would need to be revisited anyway the moment payment goes live.

**Evidence:**
- Raw HTML fetch of `/collection` (JavaScript disabled, `--mode never`) confirms product names and prices are server-rendered, not client-injected: e.g. `<h3 class="title product-card__name" data-i18n-name="trousers-sand">Pleated Wide-Leg Trousers, Sand</h3>` and price values `1,290` / `1,390` / `1,490` / `1,890` / `1,990` / `2,190` / `2,290` (THB, `฿` symbol confirmed present) all appear in the pre-hydration HTML.
- Stock-state markup confirmed present: `Add to Cart` and `Sold Out` button/label states both exist in the rendered DOM (1 product currently shows `Sold Out`).
- Route inventory (`Z:\kath\src\pages\`) confirms no dynamic `[slug].astro` product route exists — only the flat `collection.astro` listing page.
- Per the audit brief, checkout (`/checkout`, `/checkout/payment`, `/checkout/complete`) is not wired to a real payment processor.

**Recommendation:**
- **Do not** publish per-product `Product`/`Offer` JSON-LD yet.
- **Optional low-risk interim step:** add a lightweight `CollectionPage`/`ItemList` block on `/collection` (names + images only, no `Offer`/price/availability) purely to give AI/GEO crawlers clean structured context about what's in the collection. This carries no Google rich-result eligibility either way, so it's take-it-or-leave-it — include a template below only if the team wants it now.
- **When ready to add full Product schema** (i.e., once individual product pages exist AND checkout is live), each product page should carry a `Product` entity with `offers.price`, `offers.priceCurrency: "THB"`, `offers.availability` (`https://schema.org/InStock` / `OutOfStock` mapped from the real "Add to Cart"/"Sold Out" state), and `offers.url` pointing at that product's own permalink. Flag this as a follow-up item once `/collection/[slug]` routes ship — happy to generate the exact JSON-LD template at that point.

---

## Finding 6: Organization/logo image reference should not use Astro's content-hashed build filename

**Severity:** Low

**Description:** The only brand mark image found (`studio-mark.DLYwsIqH_Z1lvihc.webp`, used as the site logo in the header/footer) is served from Astro's hashed `/_astro/` build output. That hash changes on every rebuild/redeploy, so hardcoding it into `logo`/`image` schema properties would silently rot the first time the site is redeployed with a changed asset.

**Evidence:** Logo referenced in HTML as `<img src="/_astro/studio-mark.DLYwsIqH_Z1lvihc.webp" alt="Studio Kath">`; no stable, unhashed logo file (e.g. `/public/logo.png`) exists in `Z:\kath\public\` (contents: `apple-touch-icon.png`, `favicon.ico`, `favicon.png`, `favicon.svg`, `products/`) — no dedicated stable logo asset is currently published outside the hashed build pipeline.

**Recommendation:** Copy the brand mark into `Z:\kath\public\` under a stable, unhashed filename (e.g. `public/logo.png`, ideally square, ≥112×112px per Google's logo guidelines) and reference `https://kath-ebon.vercel.app/logo.png` in schema instead of the `/_astro/...` hashed path. Until that exists, the snippets below reference the favicon as a safe stable fallback — swap in a proper square logo file when available.

---

## Finding 7: No `site` URL configured in `astro.config.mjs` — affects how absolute URLs must be authored in schema

**Severity:** Low (implementation note, not a standalone defect)

**Description:** `Z:\kath\astro.config.mjs` contains only `defineConfig({})` — no `site` property is set. This doesn't block schema implementation, but it does mean absolute URLs used inside JSON-LD (required for `url`, `@id`, `logo`, `image`, `sameAs`, breadcrumb `item` fields — Schema.org/Google both require absolute, not relative, URLs) cannot be derived from Astro's `Astro.site` helper and must be hardcoded to `https://kath-ebon.vercel.app` for now. If/when the project moves to a custom domain, every hardcoded absolute URL in the schema blocks below will need a find-and-replace pass — worth setting `site` in `astro.config.mjs` at the same time to keep this in sync going forward (this was also flagged independently in the sitemap audit).

**Evidence:** `Z:\kath\astro.config.mjs`: `export default defineConfig({});`

**Recommendation:** Hardcode `https://kath-ebon.vercel.app` as the base URL in all schema below (already done). Revisit if a custom domain is confirmed pre-launch.

---

## Implementation — Ready-to-Use JSON-LD

All snippets use real Studio Kath data verified above — no placeholder text. Add the `ClothingStore` + `WebSite` block once, site-wide, in `Z:\kath\src\layouts\Layout.astro`'s `<head>`. Add the page-specific `BreadcrumbList` block to each interior page.

### 1. `ClothingStore` (Organization + LocalBusiness combined) — add sitewide in `Layout.astro`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": "https://kath-ebon.vercel.app/#organization",
  "name": "Studio Kath",
  "alternateName": "Kath",
  "description": "Studio Kath is a small-batch clothing studio in Bangkok, Thailand — hand-cut, made to last, not to trend.",
  "url": "https://kath-ebon.vercel.app/",
  "logo": "https://kath-ebon.vercel.app/favicon.png",
  "image": "https://kath-ebon.vercel.app/favicon.png",
  "telephone": "+66815638883",
  "email": "info.studiokath@gmail.com",
  "priceRange": "฿1,290–฿2,290",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "39/1 Soi Thonglor 2, Chomphon",
    "addressLocality": "Chatuchak",
    "addressRegion": "Bangkok",
    "postalCode": "10900",
    "addressCountry": "TH"
  },
  "sameAs": [
    "https://www.instagram.com/studio.kath/",
    "https://www.facebook.com/kathh.studio/",
    "https://shopee.co.th/studio.kath",
    "https://s.lazada.co.th/s.ZR0XvK?c=x"
  ]
}
</script>
```

Notes:
- `logo`/`image` point at `favicon.png` as a safe stable placeholder — replace with a proper square brand-mark file once one is published outside the Astro hashed build path (see Finding 6).
- No `openingHoursSpecification` included — do not add until real hours or "by appointment only" copy is published on `/contact` (see Finding 2).
- `priceRange` derived from the actual observed price spread on `/collection` (฿1,290–฿2,290) — update if the catalog's range changes.

### 2. `WebSite` — add alongside the block above, sitewide in `Layout.astro`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://kath-ebon.vercel.app/#website",
  "name": "Studio Kath",
  "url": "https://kath-ebon.vercel.app/",
  "inLanguage": "en",
  "publisher": {
    "@id": "https://kath-ebon.vercel.app/#organization"
  }
}
</script>
```

No `potentialAction`/`SearchAction` included — add only if/when an on-site search is built (see Finding 3).

### 3. `BreadcrumbList` — one per interior page

`/about`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kath-ebon.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://kath-ebon.vercel.app/about" }
  ]
}
</script>
```

`/collection`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kath-ebon.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "Collection", "item": "https://kath-ebon.vercel.app/collection" }
  ]
}
</script>
```

`/contact`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kath-ebon.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://kath-ebon.vercel.app/contact" }
  ]
}
</script>
```

`/privacy`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kath-ebon.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "Privacy Notice", "item": "https://kath-ebon.vercel.app/privacy" }
  ]
}
</script>
```

### 4. Optional interim `/collection` context block (no Offers — see Finding 5)

Only add if the team wants AI/GEO-facing context now, ahead of real per-product URLs/checkout. Carries no Google rich-result eligibility.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Collection — Studio Kath",
  "url": "https://kath-ebon.vercel.app/collection",
  "isPartOf": { "@id": "https://kath-ebon.vercel.app/#website" },
  "about": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Pleated Wide-Leg Trousers, Sand" },
      { "@type": "ListItem", "position": 2, "name": "Pleated Wide-Leg Trousers, Papaya" },
      { "@type": "ListItem", "position": 3, "name": "Gingham Wide-Leg Trousers, Indigo" }
    ]
  }
}
</script>
```

(Truncated to 3 sample items above — generate the full 14-item list from the same product data source `collection.astro` already renders from, rather than hand-maintaining a duplicate list, so it can't drift out of sync.)

---

## Priority Order

1. **Critical:** Add `ClothingStore` + `WebSite` JSON-LD sitewide (Findings 1–3) — single highest-leverage change, near-zero risk, uses real verified data.
2. **Medium:** Add `BreadcrumbList` to the 4 interior pages (Finding 4).
3. **Low:** Publish a stable unhashed logo file and reference it in schema (Finding 6); set `site` in `astro.config.mjs` (Finding 7).
4. **Deferred/Info:** Hold off on `Product`/`Offer` schema until per-product URLs and live checkout exist (Finding 5). No `FAQPage` is present or recommended (site has no FAQ content), and no deprecated types (`HowTo`, `SpecialAnnouncement`, `CourseInfo`/`EstimatedSalary`/`LearningVideo`) are relevant to this site.
