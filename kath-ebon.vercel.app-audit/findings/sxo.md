# Search Experience Optimization (SXO) Audit — kath-ebon.vercel.app

**SXO Gap Score:** 34/100 (separate from, and not comparable to, the SEO Health Score elsewhere in this audit)

Target site: `/` (home), `/about`, `/collection` (18 products rendered as cards behind JS quick-view modals, not 14 as the brief assumed — see Finding 1 evidence), `/contact`, `/privacy`, plus an unwired `/checkout` → `/checkout/payment` → `/checkout/complete` demo funnel. Fetched via `render_page.py --mode auto` (site is server-rendered Astro, `is_spa: false`, so raw and rendered DOM match) and parsed via `parse_html.py` for all five indexable routes.

---

## Finding 1: No individual product detail pages/URLs — the single biggest SXO structural gap on the site

**Severity:** CRITICAL

**Description:**
Google's dominant, expected page type for any product-specific apparel query ("[product name] [color] [brand]", "buy [product]", or even a rich/Merchant-listing eligible query) is a **dedicated Product Page**: unique URL, `Product`/`Offer` schema with price + availability, multiple images, a purchase CTA, and (eventually) reviews. Studio Kath has no such page for any of its pieces. On `/collection`, every product card is a `<button data-quickview-open="trousers-papaya">`-style JS trigger that opens an in-page modal — there is no `<a href="/collection/trousers-papaya">` or `/product/[slug]` anchor anywhere in the rendered HTML for any of the 18 cards.

This means:
- A query for a specific piece (e.g. "pleated wide-leg trousers papaya Studio Kath") has **no unique URL to rank**. Google can at best rank `/collection`, which contains 18 competing products with no primary subject — a classic page-type/content-type mismatch (Blog/Category page competing where the SERP wants a Product page).
- No product can carry its own `Product` schema (price, availability, image, review), so none of Studio Kath's pieces are eligible for Google Shopping / Merchant listing rich results, image-pack product cards, or "Popular products" carousels — all of which are now standard SERP furniture for apparel queries.
- Deep-linking a specific product from social (Instagram bio link, Line, a press mention) or from paid ads is impossible — every such link can only land on the generic 18-item grid, forcing the visitor to re-find the exact item, which directly contradicts the product brief's stated user intent ("they want to see the craft up close... before deciding, then add to cart").

**Evidence:**
- `collection.html` (rendered) contains 18 `data-quickview-open="<slug>"` buttons (e.g. `trousers-sand`, `trousers-papaya`, `trousers-indigo-gingham`, `crop-top-yellow-gingham`, `trousers-mint`, `collar-set-sky`, `crop-top-lime`, `halter-top-ivory`, `trousers-floral-meadow`, `blouse-green-mandarin`, `blouse-papaya-puff`, `satin-set-powder-blue`, `trousers-taupe-plaid`, `blouse-lavender-puff`, `vest-set-dusty-blue`, `trousers-sage`, `trousers-azure`, `collar-set-peach`) — zero of these are `<a href>` anchors to a unique page; all are JS modal triggers.
- `parse_html.py --url https://kath-ebon.vercel.app/collection` confirms: `"schema": []` (no JSON-LD at all — no `Product`, no `ItemList`, no `Organization`), and the only internal `<a>` targets on the page are `/`, `/about`, `/contact`, `/privacy`, `/checkout`, and repeated links back to `/collection` itself. No product-level URL exists in the link graph.
- Prices ARE present and correctly formatted in the DOM (18 THB prices found, e.g. ฿1,290, ฿1,390, ฿690, ฿2,290 ranging ฿650–฿2,290) plus a functioning "Add to Cart" control and cart drawer ("Your cart is empty.", "Cart" heading) — so the commerce layer exists, it is simply not exposed as crawlable, linkable, indexable pages.
- `Z:\kath\src\pages\` (per the codebase, cross-referenced with `findings/sitemap.md` Finding 4) confirms only 8 static routes exist — `index.astro`, `about.astro`, `collection.astro`, `contact.astro`, `privacy.astro`, `checkout/*` — with no dynamic `[slug].astro` product route.
- SERP confirmation: a search for `"pleated wide-leg trousers papaya small batch"` returns zero small-batch-brand product pages in the pattern Studio Kath would need to compete in — results are dominated by large retailers' own dedicated product URLs (Reiss, Etsy listing pages, Vinted catalog pages, individual Shopify product pages like `belladinotte.com/products/toni-...`), each a unique, schema-bearing product page. This confirms the taxonomy expectation: for product-specific queries, Google surfaces Product Pages, and a listing/category page cannot substitute.

**Recommendation:**
Build a dedicated product detail route (e.g. `/collection/[slug]`) for each of the 18 pieces, generated from the same product data already powering the quick-view modal (title, price, images, color/description are already structured — this is a routing/templating change, not new content). Each page should include:
- A unique, keyword-rich `<title>`/H1 (e.g. "Pleated Wide-Leg Trousers, Papaya — Studio Kath")
- `Product` + `Offer` schema (name, image, price, priceCurrency THB, availability, and — once launched — `AggregateRating`/`Review`)
- Multiple images per product (the site already has multi-angle model shots per product judging from `/about` and `/` reuse of the same product images)
- The existing "Add to Cart" action plus a secondary "Ask about this piece" / custom-order CTA linking to `/contact` pre-filled with the product name, matching the brief's stated secondary CTA
- Internal links from `/collection` cards to these new URLs (in addition to, or instead of, the quick-view modal, which can remain as a progressive enhancement for users already on the product page)
Keep `/collection` as the category/browse page (it is doing that job reasonably well — see Finding 2), but stop treating it as the only landable commerce surface. This is the highest-leverage fix in the audit: it is the only path to Merchant/Shopping-eligible rich results, specific-product rankings, and clean deep-linking from social/press.

---

## Finding 2: `/collection` itself is reasonably well-aligned to SERP expectations for category-level queries — but is undermined by zero schema and thin per-product copy

**Severity:** MEDIUM

**Description:**
For broader, non-product-specific queries (e.g. "Studio Kath collection", "hand-cut clothing Bangkok shop"), Google's expected page type is a Category/Product-Listing page, and `/collection` structurally resembles one: grid of 18 products, each with image, name, price, and an add-to-cart action, H1 "Cut in limited numbers." and meta description referencing "hand-cut, small-batch pieces, numbered and limited." This is a reasonable page-type match at the category level.

However, it under-delivers versus what wins in the SERP taxonomy for this page type: no `ItemList`/`Product` schema (so no rich snippet eligibility, not even at the listing level), no per-product description text beyond a name and price (taxonomy calls for "Description > Specs" — here there is neither, beyond the alt text), and no visible fabric/material/care information on the listing itself (the brief's stated user need is to "see the craft up close" — fabric and stitching detail is not surfaced anywhere on this page, only in image alt text like "A model in bright papaya orange pleated wide-leg trousers").

**Evidence:**
- `parse_html.py` output for `/collection`: `"schema": []`, `"open_graph": {}`, `"twitter_card": {}`, `"canonical": null`, `word_count: 256` across an 18-product page (~14 words/product outside of nav/footer boilerplate).
- H3 headings are product names only ("Pleated Wide-Leg Trousers, Sand", "Gingham Wide-Leg Trousers, Indigo", etc.) with no accompanying fabric/material/craft copy on the page itself.
- No canonical tag on any of the 5 indexable pages checked (`home`, `about`, `collection`, `contact` all return `"canonical": null`), which independently risks duplicate-content ambiguity once query parameters or a future domain migration (flagged in `findings/backlinks.md` Finding 2) are introduced.

**Recommendation:**
- Add `ItemList` schema wrapping the 18 products (each item pointing at its future dedicated product URL per Finding 1), plus `Organization`/`WebSite` schema sitewide (currently absent everywhere — 0 schema blocks found on any of the 5 pages checked).
- Add a one-line fabric/material tag per card (e.g. "Linen · Hand-cut · Limited to 12") directly in the grid — this directly answers the brief's "craft up close" intent at the browse stage, before a shopper commits to opening a product page.
- Set canonical tags on all 5 indexable pages now (self-referencing is sufficient at this stage) to avoid inheriting ambiguity when the domain migrates off `*.vercel.app` (see `findings/backlinks.md` Finding 2).

---

## Finding 3: The target head-term queries in the brief are a poor SERP fit — Google rewards B2B manufacturing/tailoring content, not consumer shopping pages, for these exact phrases

**Severity:** HIGH

**Description:**
This is a keyword-strategy mismatch, distinct from Finding 1/2's page-type mismatch, but material to interpreting "why a page fails to rank." The two head terms named in the brief — "hand-cut small batch clothing Bangkok" and "small batch clothing brand Thailand" — do not currently return a SERP of consumer-facing small clothing brands at all. They return **B2B/service-intent results**: cut-and-sew contract manufacturers, low-MOQ garment-production suppliers, and bespoke men's suit tailors (Wings2Fashion, Nordic Bespoke Tailor, Universal Tailors, Tom's Fashion, etc.). No individual small-batch fashion *brand* website (i.e., a peer of Studio Kath) appears on page one for either phrase.

This tells us Google currently interprets "hand-cut" + "small batch" + "Bangkok/Thailand" as **manufacturing/sourcing intent** (someone looking to *produce* clothing), not shopping intent (someone looking to *buy* a finished piece). If Studio Kath optimizes copy toward these exact phrases expecting to win consumer traffic, it will be competing in the wrong SERP entirely — against Wings2Fashion's manufacturer-directory content, not against Reiss or Etsy-style product pages.

By contrast, "limited edition clothing Bangkok" returns a more relevant SERP (independent Bangkok boutiques, fashion collectives, streetwear stores, an Iconsiam "Boutiques Asia" capsule-collection event) — closer to consumer/discovery intent, but still dominated by editorial/directory content (Numéro, Corner.inc guides, Bangkok Post) rather than any single brand's own site, meaning the opportunity here is more PR/listing-inclusion than direct on-page ranking.

A branded query test — "Studio Kath Bangkok clothing" — surfaces the brand's own Instagram profile (`instagram.com/studio.kath`) but **not** `kath-ebon.vercel.app` anywhere in the visible results, consistent with the domain having zero Common Crawl presence (see `findings/backlinks.md` Finding 1) and no custom domain yet (Finding 2 there).

**Evidence:**
- WebSearch "hand-cut small batch clothing Bangkok" → top results: wings2fashion.com (cut-and-sew manufacturer), tomsfashion.com, nordicbespoketailor.com, omfashionbkk.com, suitcutbespoketailor.com, universaltailor.com — all B2B/bespoke-tailor service pages, zero consumer ready-to-wear brand sites.
- WebSearch "small batch clothing brand Thailand" → wings2fashion.com (×2 pages), leelineapparel.com ("Thailand Clothing Manufacturers"), chiangmaiclothing.wordpress.com, streetwearthailand.com, garment-monster.com — same B2B manufacturing-directory pattern. Only a TikTok discovery page and passing mentions of brands like MUUNSAN/RAVii/TRES surfaced as actual consumer brands, none ranking with owned product pages.
- WebSearch "limited edition clothing Bangkok" → bangkokpost.com (Boutiques Asia event coverage), corner.inc (boutique guide), siam2nite.com, thatbangkoklife.com, numeronetherlands.com — editorial/directory content, no single small-batch brand's own site in top 10.
- WebSearch "Studio Kath Bangkok clothing" → instagram.com/studio.kath appears; `kath-ebon.vercel.app` does not appear in the returned result set at all.

**Recommendation:**
- Do not treat the brief's head terms as primary SEO targets as-written; they currently serve a different (B2B) audience. Reframe toward consumer-intent long-tail variants that match how real buyers search once the brand has visibility, e.g. "Bangkok small-batch women's clothing brand," "hand-cut limited edition [garment type] Bangkok," or increasingly branded queries as awareness grows (Instagram following, press, Boutiques Asia-style event placement).
- Pursue inclusion in the editorial/directory content that *is* ranking for "limited edition clothing Bangkok" (boutique guides, fashion-collective roundups, Bangkok Post-style lifestyle coverage) as a PR/backlink play — this is a faster path to visibility than trying to out-rank manufacturer sites on the manufacturing-flavored head terms. Cross-reference `findings/backlinks.md` for domain-authority sequencing (migrate off `*.vercel.app` before pursuing this outreach).
- Once the custom domain is live and indexed, re-run the branded query check ("Studio Kath") to confirm the website — not just the Instagram profile — surfaces for brand searches.

---

## User Stories (derived from SERP + page signals)

1. **As an intentional Thai luxury-slow-fashion shopper**, I want to zoom into the stitching and fabric of one specific piece I saw on Instagram before I decide to buy it, because quality-over-volume is my entire reason for choosing a small studio over fast fashion, but I'm blocked because there is no dedicated page for that piece — I can only land on the 18-item `/collection` grid and have to visually re-find it. *(Source: Finding 1 — no product URLs; product brief's stated intent to "see the craft up close... before deciding")* — **Awareness/Consideration stage.**

2. **As a shopper who found Studio Kath through a press/boutique-directory mention** (the kind of listing that currently ranks for "limited edition clothing Bangkok"), I want to click through to a specific featured piece, because that's what the editorial content showed me, but I'm blocked because any outbound link can only point at the homepage or the generic collection grid, not the specific product referenced. *(Source: Finding 3 — editorial/directory SERP dominance for the consumer-intent query; Finding 1 — no deep-linkable product URLs)* — **Consideration stage.**

3. **As a shopper deciding between "add to cart" and "custom order,"** I want reassurance that a specific piece is genuinely limited/numbered (not generic marketing language) before I commit ฿1,290–฿2,290, because the brand's whole value proposition is scarcity/craft over mass production, but I'm blocked because the numbered/limited claim ("Cut in limited numbers") lives only as a page-level H1 on `/collection`, not as a specific, trustable data point (e.g. "8 of 12 made") attached to the piece I'm actually looking at. *(Source: `/collection` H1 "Cut in limited numbers," home H2 "A studio, not a factory"; absence of any schema/data-point-level trust signal per Finding 2)* — **Decision stage.**

4. **As a casual browser arriving from a generic Google search** (not yet brand-aware), I want the search result itself to tell me this is a real, buyable clothing brand and not a manufacturer or tailor service, because that's what currently ranks for the phrases this brand would naturally choose, but I'm blocked because Google's current understanding of "hand-cut small batch clothing Bangkok" is B2B/manufacturing, not consumer shopping. *(Source: Finding 3 — SERP composition for both head terms)* — **Awareness stage.**

---

## Persona Scoring

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Intentional Thai luxury-slow-fashion shopper (product brief's primary persona) | 15/25 | 12/25 | 14/25 | 13/25 | 54/100 | Needs Work |
| Casual browser arriving from generic Google search | 8/25 | 14/25 | 10/25 | 12/25 | 44/100 | Needs Work |
| Custom-order inquirer (secondary CTA persona) | 18/25 | 20/25 | 15/25 | 19/25 | 72/100 | Good |
| Editorial/press-referred boutique discoverer | 10/25 | 13/25 | 12/25 | 8/25 | 43/100 | Needs Work |

### Weakest Persona: Editorial/press-referred boutique discoverer (43/100)
**Top issue:** No deep-linkable landing surface — any press/directory mention can only route traffic to the homepage or the full 18-item grid, never to the specific piece that earned the mention, so the referral's context is lost on arrival.
**Recommended fix:** Ship product-level URLs (Finding 1) with clean, shareable slugs (`/collection/trousers-papaya`) specifically so that outreach/PR placements can link to the exact featured piece; add Open Graph tags (currently `{}` — empty — on every page checked) so shared links render a proper preview image/title instead of generic link text.

### Casual browser (44/100)
**Top issue:** Relevance is the binding constraint (8/25) — the queries this persona would plausibly type ("hand-cut small batch clothing Bangkok") return manufacturer/tailor sites, not Studio Kath, per Finding 3, so this persona largely never reaches the site at all in the current SERP landscape.
**Recommended fix:** Reframe target keywords toward genuine consumer-shopping phrasing (Finding 3 recommendation) rather than optimizing existing pages further for terms Google currently classifies as B2B intent.

### Intentional slow-fashion shopper (54/100)
**Top issue:** Clarity is the binding constraint (12/25) — this persona's core question ("can I examine this exact piece's fabric/stitching/fit before deciding?") has no dedicated answer surface; it's answered only partially, at the grid level, via a JS quick-view modal that isn't a shareable/bookmarkable/indexable page.
**Recommended fix:** Finding 1's product page build directly resolves this — each page becomes the "examine before deciding" surface the brief explicitly describes this persona wanting.

### Systemic Issues
- **Trust (avg ~13/25 across personas):** Zero structured data (`Product`, `Organization`, `ItemList`) on any page, zero canonical tags, zero Open Graph/Twitter Card tags across all 5 pages checked. None of this is persona-specific — it's a sitewide absence that caps every persona's trust score simultaneously.
- **Action (avg ~13/25):** The primary CTA ("Add to Cart") only exists inside the collection-grid quick-view modal; there's no persistent, product-anchored CTA a persona could act on from a shared/bookmarked/indexed URL.

### Priority Actions
1. Ship dedicated product pages with `Product` schema and shareable slugs (resolves the binding constraint for 3 of 4 personas — Finding 1).
2. Add sitewide `Organization`/`WebSite` schema, canonical tags, and Open Graph tags (systemic trust gap affecting all personas equally).
3. Reframe target keyword strategy away from the B2B-leaning head terms toward consumer-shopping and editorial/PR-friendly phrasing (Finding 3), so the "casual browser" persona has a realistic path to the site at all.

---

## Page-Type Mismatch Summary

| Query type | SERP-dominant page type | Studio Kath's current page type | Mismatch severity |
|---|---|---|---|
| Product-specific ("pleated wide-leg trousers papaya...") | Product Page (unique URL, Product schema, price/availability) | None exists — only a JS modal on `/collection` | **CRITICAL** |
| Category/browse ("Studio Kath collection", "shop hand-cut clothing") | Category/Listing page | `/collection` — structurally close, but zero schema and thin per-product copy | MEDIUM |
| Brand/craft story ("Studio Kath about", "who makes Studio Kath") | About/Editorial page | `/about` — reasonably aligned (process narrative, H2s "How a piece gets made," "One studio, one size of ambition") | ALIGNED |
| Manufacturing/sourcing-flavored head terms ("hand-cut small batch clothing Bangkok") | B2B Service Page (contract manufacturer/tailor) | No B2B page exists (correctly — this isn't Studio Kath's business), but the brief's head terms target this SERP anyway | HIGH (keyword-strategy mismatch, not a page to fix) |
| Local/"Bangkok" discovery ("limited edition clothing Bangkok") | Editorial/directory listing content | No local/LocalBusiness page or schema exists; no NAP, no map, no `LocalBusiness` schema despite a real Bangkok studio | HIGH |

---

## Limitations

- No access to Google Search Console, so actual impression/click/ranking data for these queries could not be verified — all SERP analysis is based on live WebSearch snapshots at time of audit (2026-08-09) and may shift.
- The site is on a `*.vercel.app` preview subdomain with no recorded Common Crawl presence (see `findings/backlinks.md`), so it currently has no measurable ranking footprint to audit directly — this report is a "SERP-backwards" readiness analysis (what Google rewards vs. what the site offers) rather than a diagnosis of an existing ranking failure.
- PAA boxes, featured snippets, AI Overview presence, and ad density for the target queries were assessed via WebSearch text summaries, not a full visual SERP capture — exact SERP feature layout (e.g. whether an AI Overview appears) could not be independently confirmed pixel-for-pixel.
- Product count discrepancy: the task brief states 14 products; the rendered `/collection` page currently shows 18 product cards. Findings above reflect the observed count (18) as of the render.
- No LocalBusiness/Google Business Profile data was pulled (no My Business listing check performed) — flagged as a cross-skill recommendation below, not assessed in depth here.
- Persona scores are qualitative/evidence-based per the `persona-scoring.md` rubric, not derived from analytics or user testing (none exists pre-launch).

## Cross-Skill Recommendations

- **Missing schema types** (Product, Organization, ItemList, LocalBusiness) across every page → run `/seo schema` for generation once product pages exist.
- **Local intent detected** in the "limited edition clothing Bangkok" SERP and the brand's real Bangkok studio address (referenced in `/about` and `/contact` CTAs) with no LocalBusiness schema or GBP signal found → run `/seo local` for a dedicated Google Business Profile / local-pack analysis.
- **Thin per-product content** on `/collection` (name + price only, no material/fit/care copy) → run `/seo content` for E-E-A-T and content-depth analysis once product pages are scoped.
- **Page-level technical gaps** (no canonical tags, no Open Graph/Twitter Card tags found on any of the 5 pages) → run `/seo page` for a full page-level technical audit.

---

Offer: Generate a PDF report? Use `/seo google report`.
