# E-commerce SEO Audit — kath-ebon.vercel.app

**Site context:** Studio Kath, a pre-launch, small-batch hand-cut clothing brand in Bangkok. Per `Z:\kath\PRODUCT.md`, the cart UI is fully designed but intentionally **not wired to real payment yet** — the brand isn't taking live orders through the site at this stage. Recommendations below are framed accordingly: what should be fixed **before going live**, and what is fine as-is for now.

**Data sources used:** On-page/static analysis of the live site (`render_page.py --mode auto` against `https://kath-ebon.vercel.app/collection`) and the Astro source (`Z:\kath\src`). DataForSEO Merchant marketplace data was **not** fetched — see Finding 9 for why, and treat all findings below as "On-page analysis (static)".

---

## Finding 1: No individual product page URLs exist — every product is a JS-driven modal, not a crawlable page

**Severity:** Critical

**Description:**
All 18 products live exclusively as `<li>` cards on the single `/collection` route (`Z:\kath\src\pages\collection.astro`). There is no dynamic route file anywhere in `src/pages` (confirmed: no `collection/[slug].astro`, no `products/[slug].astro`, no content-collection-backed product routes — the full route inventory is `index.astro`, `about.astro`, `collection.astro`, `contact.astro`, `privacy.astro`, and the three `checkout/*` steps).

What looks like a "product page" is actually `Z:\kath\src\components\ProductQuickView.astro`, a `<dialog>` modal opened by a `<button data-quickview-open={product.id}>` (see `ProductCard.astro` line 19-24). This is a client-side JS interaction, not a link:
- It has no `href` and does not navigate — clicking it never changes the URL, so a specific product can never be linked to, bookmarked, or shared directly.
- It renders inside the single `/collection` document, so it inherits that page's one `<title>` ("Collection — Studio Kath") and one `<meta description>` for all 18 products — no product ever gets its own title tag, meta description, canonical URL, or Open Graph image.
- Confirmed live via `render_page.py`: the rendered `/collection` HTML contains all 18 product names/prices as plain text/cards, `structured_data.block_count: 0` (no JSON-LD of any kind on the page), and the page is server-rendered (not an SPA — `is_spa: false`), so the *text* is crawlable, but there is nothing for Google to index as a distinct, rankable product entity.

**Evidence:**
- `Z:\kath\src\pages\collection.astro` — single route, maps `products.map(...)` to `<ProductCard>` in a `<ul>`, no per-item route.
- `Z:\kath\src\components\ProductCard.astro` lines 19-24, 38-41 — product name and image open the quickview dialog via `data-quickview-open`, not an anchor.
- `Z:\kath\src\components\ProductQuickView.astro` — a `<dialog>`, confirmed no unique URL/state is ever pushed to `history`.
- `grep -c "id: '" Z:\kath\src\data\products.ts` → 18 (verified product count; see Finding 3 for how these 18 group into 13 distinct designs across colorways).
- `render_page.py --mode auto` on `https://kath-ebon.vercel.app/collection` → single `<title>Collection — Studio Kath</title>`, single `<meta name="description">`, `structured_data.block_count: 0`.
- No `robots.txt` or `sitemap.xml` exists on the domain either (see `sitemap.md` in this audit) — reinforcing that product discovery today depends entirely on Google crawling and interpreting the one `/collection` page's text, with no per-product landing surface at all.

**Impact:**
1. **Organic discovery:** No product can rank for its own long-tail query (e.g. "hand-cut sand pleated wide-leg trousers Bangkok") — all 18 products compete for visibility on one URL targeting one generic title/description.
2. **Google Shopping / Merchant Center:** Free listings and Shopping ads both require each product offer to link to a landing page that contains that specific product's information; a shared `/collection` URL for all 18 SKUs does not meet this requirement, so Merchant Center enrollment is currently not viable even before considering the (separately audited) lack of Product schema.
3. **Analytics/keyword targeting:** GA4/GSC can only report performance for `/collection` as a whole — no per-product impressions, clicks, add-to-cart rate, or query data is possible.
4. **Social/marketplace cross-linking:** There is no URL to put in an Instagram bio link, a Shopee/Lazada listing description, or a QR code that lands a customer on one specific piece (see Finding 4).
5. **No breadcrumbs or related-products module can exist** until there is a product level to link *to* — this is a prerequisite, not an independent gap.

**Recommendation:**
Before treating organic product search as a real acquisition channel (and ideally before or alongside checkout going live), add real per-product routes — e.g. `src/pages/collection/[slug].astro` reading from `src/data/products.ts` (or migrate `products.ts` to an Astro content collection, which would also give each product its own `lastmod` for the sitemap fix already flagged in `sitemap.md`). Each product page should get:
- Its own `<title>` and `<meta description>` (the data already has unique `blurb`/`details` copy per product to draw from).
- A canonical URL and Open Graph/Twitter card image (using the existing product photography).
- Product JSON-LD (tracked in the separate schema audit — not repeated here).
- Breadcrumbs (`Home > Collection > [Product]`) and a simple "you may also like" module once the product level exists.
- The quickview modal can stay as an in-grid convenience/progressive enhancement, but the product name/image should become a real `<a href="/collection/[slug]">` link first, with the modal intercepting the click for users with JS enabled (this preserves the current UX while making every product independently linkable and indexable for users/bots without JS or that follow the link directly, e.g. from search results or social bios).

This is not a "the site is broken" issue — it is fully consistent with a pre-launch site. It is flagged as **Critical** because it is the single structural blocker underneath nearly every other product-SEO and Shopping-visibility gap in this report, and because retrofitting URLs later means re-earning any interim collection-level rankings at the product level from zero.

---

## Finding 2: Zero Product schema/JSON-LD anywhere on the site

**Severity:** High

**Description:**
`structured_data.block_count: 0` on `/collection` (confirmed via `render_page.py`) and no `<script type="application/ld+json">` anywhere in `Z:\kath\src\layouts\Layout.astro` or any page. This is covered in depth by the dedicated schema audit, so it is not re-litigated here — flagged briefly because it compounds Finding 1: even if Product schema were added today, it would have nowhere valid to point (Google's guidelines expect Product schema on a page dedicated to that product, not a shared listing page), so the schema and URL-structure fixes need to land together.

**Evidence:** `render_page.py --mode auto` JSON output, `structured_data.blocks: []`.

**Recommendation:** Sequence with Finding 1 — add Product JSON-LD (name, image, description, sku/offers/price/priceCurrency/availability) per product at the same time individual product URLs are introduced. See the schema-specific audit for field-level requirements.

---

## Finding 3: Near-duplicate, templated product descriptions across colorway variants — a content-uniqueness risk once these become separate indexable pages

**Severity:** Medium

**Description:**
Of the 18 product entries in `Z:\kath\src\data\products.ts`, several are the same silhouette repeated across colorways as fully separate entries, each with nearly identical description copy that differs only in the color-specific clause at the end:

- "Pleated Wide-Leg Trousers" — 5 colorways (`trousers-sand`, `trousers-papaya`, `trousers-mint`, `trousers-sage`, `trousers-azure`), each `details` field reading: *"High-waisted with double front pleats and a wide, straight drop through the leg, in a [cool pastel mint / pale dusty sage / saturated azure]"* — Sand and Papaya use a slightly different but still templated pattern ("...Pairs easily with a cropped top..." / "...A brighter colorway for the same silhouette").
- "Puff-Sleeve Blouse" — 2 colorways (Papaya, Lavender) with distinct copy in this case (this pair is fine).

This isn't a problem today because none of these are separately indexable — they're all just cards on one `/collection` page. But it becomes a real thin/duplicate-content risk the moment Finding 1 is fixed and each colorway gets its own URL: 5 pages that are ~90% identical text, all plausibly targeting the same head query ("wide-leg pleated trousers"), is a textbook keyword-cannibalization and thin-content pattern.

**Evidence:** `Z:\kath\src\data\products.ts` lines 35-36, 51-52, 96-97, 251-252, 266-267 (the five `details` strings for the trouser colorways, template-identical apart from the final color clause).

**Recommendation:** When product pages are built (Finding 1), don't let colorway variants each carry a copy-pasted description. Two reasonable paths: (a) treat colorways as **variants of one product page** with a color swatch selector (one canonical URL, one richer description, `image` per variant) rather than 5 separate thin pages — this is also the more standard Shopping/GMC pattern (`item_group_id`) and avoids the duplication problem entirely; or (b) if separate pages per colorway are kept for merchandising reasons (each is a genuinely limited, non-restocked run per the brand's positioning), write each a materially distinct paragraph, not a find-and-replace of the color word. Given the "hand-cut, small-batch, numbered" positioning in `PRODUCT.md`, option (a) with variant-level uniqueness (e.g., "this is piece run 4 of X in Sand") would also reinforce the brand story better than 5 near-identical pages competing with each other.

---

## Finding 4: Marketplace presence is a generic storefront link only — no per-product cross-linking, and no visible mechanism to keep pricing/positioning consistent with Shopee/Lazada

**Severity:** Medium

**Description:**
The brand links out to Shopee and Lazada storefronts from the Contact page and the shared `SocialLinks` component:
- Shopee: `https://shopee.co.th/studio.kath`
- Lazada: `https://s.lazada.co.th/s.ZR0XvK?c=x`

Both are brand-level storefront/profile URLs, not links to specific product listings. Combined with Finding 1 (no per-product URLs on the direct site), there is currently **no possible reciprocal linking** between a specific product on the direct site and its equivalent listing on Shopee/Lazada (or vice versa) — a shopper looking at "Pleated Wide-Leg Trousers, Sand" on the direct site has no path to that exact item on Shopee, and a Shopee buyer has no path back to that exact item's full story/photography on the direct site.

Separately, `PRODUCT.md`'s own "Anti-references" section is explicit that the direct site "should not read as a discount marketplace (Shopee/Lazada-style): no promo banners, no coupon-code callouts... nothing that undercuts the 'limited, hand-made' claim with mass-retail visual noise." That's a sound positioning call for the on-site experience — but it also means price/positioning parity across channels matters more here than for a typical multi-channel retailer: if the same trousers are discoverable at a different price or bundled with marketplace promo pricing on Shopee/Lazada, that undercuts the direct site's "quality and scarcity over speed and volume" positioning by proxy, even though the direct site itself has no promo UI. There is no evidence in the codebase of any mechanism (feed, manual process, or documentation) to keep the two in sync — that's expected at pre-launch, but worth flagging before scaling marketing spend toward either channel.

**Evidence:**
- `Z:\kath\src\components\SocialLinks.astro` lines 36-48 — `href` values above, generic storefront/profile links only.
- `Z:\kath\src\pages\contact.astro` lines 71-74 — same links surfaced under "Follow & Shop".
- `Z:\kath\PRODUCT.md` line 36 — the anti-discount-marketplace positioning statement.
- Live marketplace product/pricing data could not be pulled for comparison — see Finding 9.

**Recommendation:**
- Short term (no cost, no dependency on Finding 1): none required — the storefront-level link is a reasonable placeholder at this stage.
- Once individual product URLs exist (Finding 1): add a per-product "Also on Shopee / Lazada" link where a matching listing exists, and consider `sameAs` in each product's JSON-LD pointing at the marketplace listing — this is a legitimate trust/consistency signal to Google and reduces the risk of Shopee/Lazada outranking the direct site for the brand's own product names.
- Establish a lightweight price-parity check (even a manual quarterly spot-check) between the direct site and both marketplaces once the direct site starts transacting, specifically because the brand has explicitly positioned itself against "discount marketplace" visual and pricing patterns — a visible price gap between channels is the kind of thing customers screenshot and mention.
- Re-run marketplace-specific analysis (seller landscape, category competitiveness) once Thailand-marketplace data is available — see Finding 9 for the current tooling limitation.

---

## Finding 5: Inventory/availability is tracked at the product level only — no per-size stock signal

**Severity:** Medium

**Description:**
The `Product` interface (`Z:\kath\src\data\products.ts` lines 1-14) has a single `soldOut: boolean` field per product. This drives one badge and one disabled "Add to Cart" state per product (`ProductCard.astro` lines 34, 47-51). There is no per-size stock model anywhere in the codebase: `Z:\kath\src\components\SizeSelectDialog.astro` renders all four sizes (S/M/L/XL) as always-clickable buttons (lines 61-66), and `Z:\kath\src\scripts\size-select.ts` confirms the size-selection logic only tracks which size the user clicked (`activeSize`) — it never checks or disables a size for availability. In a hand-cut, small-batch model where a single size can plausibly sell out before the rest of a run does, a shopper can currently select and "confirm" a size that may not actually exist in stock, with no visual difference between an available and unavailable size.

**Evidence:**
- `Z:\kath\src\data\products.ts` line 13 — `soldOut: boolean;` is the only availability field on the `Product` type; no per-variant/size inventory field exists.
- `Z:\kath\src\components\SizeSelectDialog.astro` lines 61-66 — all `SIZES` rendered identically, no disabled/sold-out state per size.
- `Z:\kath\src\scripts\size-select.ts` — no stock-check logic anywhere in the size-selection or add-to-cart flow.

**Recommendation:** This is a reasonable placeholder for a pre-launch site with no real inventory system behind it yet, but it should be resolved before checkout goes live and starts taking real orders — selling a size that's actually gone is a bad first-order experience. When real inventory is wired up, extend the data model to per-size stock (even a simple boolean per size, or a count) and reflect it in `SizeSelectDialog` (disabled state + label, e.g. "Sold Out" per size button) the same way the product-level badge already works today. This also matters for Merchant Center feed accuracy later (`availability`/`item_group_id` per variant) once product pages and schema exist (Findings 1-2).

---

## Finding 6: Checkout total shows no shipping cost, tax, or delivery estimate — fine for pre-launch, should be resolved before going live

**Severity:** Low

**Description:**
`Z:\kath\src\pages\checkout\index.astro` (lines 13-21) renders line items and a single `Total` row with no shipping, tax, or delivery-timeframe line anywhere in the checkout flow. Since checkout is explicitly not wired to real payment yet (per `PRODUCT.md`), this is expected and not a bug — flagging it here only because it's an "pricing/inventory display gap" in scope for this audit and should be closed before live orders begin, not because it needs attention now.

**Evidence:** `Z:\kath\src\pages\checkout\index.astro` lines 13-21 (`checkout-totals` block, single total row); no shipping/tax fields found in the address form (lines 30-77) or totals section.

**Recommendation:** No action needed pre-launch. Before checkout goes live: add a shipping cost (flat rate, calculated, or "free over ฿X") and clarify whether the listed price is tax-inclusive (Thailand VAT conventions typically expect tax-inclusive display), plus a delivery estimate. This is primarily a conversion/trust issue rather than an SEO one, but worth resolving in the same pass as the payment-processor integration.

---

## Finding 7: No product identifiers (SKU/GTIN/MPN) in the data model — relevant to future Merchant Center feed eligibility

**Severity:** Low

**Description:**
Each product's `id` field (e.g. `trousers-sand`, `collar-set-sky`) is a URL-friendly slug used internally for cart/quickview state — it is not a real SKU, and there is no GTIN, MPN, or brand-identifier field anywhere in `Z:\kath\src\data\products.ts`. For a hand-cut, small-batch brand this is understandable (products likely don't carry GTINs/barcodes at all), but Google Merchant Center's `identifier_exists = false` path requires an explicit declaration once a feed is built — it won't infer this on its own.

**Evidence:** `Z:\kath\src\data\products.ts` — `Product` interface (lines 1-14) has no `sku`, `gtin`, `mpn`, or `brand` fields.

**Recommendation:** Not urgent — no feed exists yet (Finding 1 is the prerequisite). When product pages and schema are introduced, add a `brand` field (Studio Kath) to every product and, since GTINs likely don't apply to hand-cut small-batch pieces, plan to set `identifier_exists: false` explicitly in the eventual Merchant Center feed/Product schema rather than leaving the field empty, which Google treats differently (a missing identifier without the exemption flag can suppress the listing).

---

## Finding 8: Product imagery — solid baseline, worth noting as a strength

**Severity:** Info

**Description:**
Unlike most of the findings above, product imagery is in reasonably good shape already:
- Format: WebP throughout (`Z:\kath\public\products\*.webp`), which is efficient and Google-preferred.
- Resolution: spot-checked `trousers-sand.webp` at 843×1123px — comfortably above the ~800px minimum typically recommended for Shopping-eligible imagery.
- Alt text: every product in `products.ts` has a distinct, descriptive `alt` string (e.g. *"A model in sand-colored pleated wide-leg trousers with a black graphic crop top"*) rather than a generic or missing alt — good for both accessibility and image search.

**Evidence:** `Z:\kath\public\products\` directory listing; `file` output on `trousers-sand.webp` confirming `843x1123, VP8 encoding`; `alt` fields throughout `Z:\kath\src\data\products.ts`.

**Recommendation:** No action needed. Carry this same discipline (real dimensions, descriptive alt text) forward into any future product-page image galleries and zoom views.

---

## Finding 9: No XML sitemap or robots.txt — cross-referenced, relevant to Merchant Center feed discovery

**Severity:** Info

**Description:** Already covered in full in `sitemap.md` from this audit (no `sitemap.xml`, no `robots.txt`, no `@astrojs/sitemap` integration configured). Noted briefly here only because a sitemap becomes more operationally useful once per-product URLs exist (Finding 1) — it gives Google (and a future Merchant Center feed generation step) a single authoritative list of product URLs and freshness signals rather than relying on crawl discovery alone.

**Evidence:** See `Z:\kath\kath-ebon.vercel.app-audit\findings\sitemap.md`, Findings 1 and 4.

**Recommendation:** No separate action beyond what `sitemap.md` already recommends; just sequence the `@astrojs/sitemap` addition after (or alongside) the per-product routes from Finding 1 so it captures them automatically rather than needing a second retrofit.

---

## Finding 10: Marketplace intelligence (Shopee/Lazada live data) could not be fetched — tooling and cost-approval limitation, not a site issue

**Severity:** Info

**Description:** Per this skill's cost guardrails, DataForSEO Merchant API calls require a pre-check via `dataforseo_costs.py check <endpoint>` before running. That check returned `"status": "needs_approval"` (endpoint cost unknown to the local cost database, estimated ~$0.05/call) for the relevant Merchant endpoints, so no live marketplace call was made without explicit approval from the parent orchestrator. Separately, `dataforseo_merchant.py` only supports the `google` and `amazon` marketplaces (confirmed via its `--marketplace {google,amazon}` option) — it does not cover Shopee or Lazada Thailand at all, so even with approval, a direct seller-landscape/pricing comparison against Studio Kath's actual marketplace channels isn't currently possible through this tooling.

**Evidence:** `dataforseo_costs.py check merchant_google_products` / `merchant/google/products/live/advanced` → `{"status": "needs_approval", "approval_reason": "unknown_endpoint", "estimated_cost_usd": 0.05}`; `dataforseo_merchant.py search --help` → `--marketplace {google,amazon}` (no Shopee/Lazada option).

**Recommendation:** Surfacing this limitation to the parent orchestrator rather than proceeding without approval or fabricating marketplace figures. If competitive marketplace pricing/positioning data is needed, either (a) approve the Google Shopping merchant call (low relevance here, since Studio Kath has no Shopping feed to compare against yet — see Finding 1/2) or (b) pull Shopee/Lazada seller-page data manually/via a Thailand-marketplace-specific tool outside this skill's current DataForSEO coverage.
