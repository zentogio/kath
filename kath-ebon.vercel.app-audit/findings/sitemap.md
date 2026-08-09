# Sitemap Audit — kath-ebon.vercel.app

## Finding 1: No XML sitemap exists

**Severity:** Medium

**Description:**
The site has no XML sitemap at any conventional location, and no `@astrojs/sitemap` integration is configured in the codebase to generate one.

**Evidence:**
- `GET https://kath-ebon.vercel.app/sitemap.xml` → `404` (Vercel default not-found page: "The page could not be found" / `NOT_FOUND`)
- `GET https://kath-ebon.vercel.app/sitemap-index.xml` → `404` (same Vercel not-found page)
- `GET https://kath-ebon.vercel.app/sitemap_index.xml` → `404`
- `GET https://kath-ebon.vercel.app/wp-sitemap.xml` → `404`
- `GET https://kath-ebon.vercel.app/robots.txt` → `404`, so there is no `Sitemap:` directive anywhere to check either.
- `claude-seo sitemap_discovery.py` confirms: `"found": []`, `"declared": []`, with a warning that `robots.txt` returned HTTP 404.
- `Z:\kath\astro.config.mjs` contains only `defineConfig({})` — no `site` URL is set and no `@astrojs/sitemap` integration is registered.
- `Z:\kath\package.json` has no `@astrojs/sitemap` dependency.
- `Z:\kath\src\pages\` confirms the full route inventory: `index.astro`, `about.astro`, `collection.astro`, `contact.astro`, `privacy.astro`, `checkout/index.astro`, `checkout/payment/index.astro`, `checkout/complete/index.astro` — exactly the 8 routes cited, no dynamic product/category/tag routes exist.

**Recommendation:**
Confirm the complete absence of a sitemap (verified above — no XML sitemap and no robots.txt reference exists anywhere on the domain). This is not currently breaking anything for a site this small, but it should be tracked as a pre-launch gap to close before the checkout flow goes live and search engines are meant to index the site in earnest.

---

## Finding 2: A sitemap is not structurally necessary at this size, but is worth adding as a low-cost freshness/discovery signal

**Severity:** Info

**Description:**
At 8 routes with no product detail pages, no blog, and no category/tag pages, Google can fully discover and crawl this site via normal internal-link crawling (header/footer nav) without a sitemap. XML sitemaps exist primarily to solve *discovery* problems (large or poorly-linked sites, orphaned pages, deep pagination) and to communicate freshness (`lastmod`) for pages Google might otherwise re-crawl infrequently — neither of which is a real problem for an 8-page site with a shallow, fully-linked structure.

That said, a sitemap is nearly free to add via `@astrojs/sitemap` and provides two concrete benefits even now:
1. A clear, authoritative `lastmod` freshness signal (useful once `/about`, `/collection`, or `/privacy` content changes post-launch).
2. A scaffold that will automatically extend to cover per-product pages once those are built, avoiding a manual sitemap-maintenance step later.

**Recommendation:**
Not a blocking issue for launch. Recommend adding `@astrojs/sitemap` as a low-effort, forward-looking improvement rather than treating it as a launch blocker. Note that `astro.config.mjs` currently has no `site` property set — this must be added (e.g. `site: 'https://kath-ebon.vercel.app'` or the eventual production domain) before `@astrojs/sitemap` can generate correct absolute URLs.

---

## Finding 3: Recommended route inclusion/exclusion if a sitemap is added

**Severity:** Info

**Description:**
Of the 8 known routes, 5 are indexable content pages and 3 are transactional checkout steps that should not be submitted for indexing.

**Include (5 routes):**
| Route | Rationale |
|---|---|
| `/` | Primary entry point, highest priority |
| `/about` | Evergreen brand/content page |
| `/collection` | Primary commercial page (all 14 products currently live here as cards) |
| `/contact` | Evergreen utility page |
| `/privacy` | Low priority but legitimately indexable, static content |

**Exclude (3 routes):**
| Route | Rationale |
|---|---|
| `/checkout` | Transactional funnel step, no unique content value, not meant for search discovery |
| `/checkout/payment` | Same — mid-funnel step; also currently not wired to a real payment processor (pre-launch), should not be indexable at all |
| `/checkout/complete` | Confirmation/thank-you page — indexing this can create duplicate low-value pages and, worse, can be discovered by non-purchasing visitors if it were ever indexed |

**Recommendation:**
- If/when `@astrojs/sitemap` is added, use its `filter` option to exclude `/checkout*` routes rather than relying on manual list maintenance, e.g.:
  ```js
  sitemap({
    filter: (page) => !page.includes('/checkout'),
  })
  ```
- Independently of the sitemap, the three checkout routes should also carry `<meta name="robots" content="noindex">` (or be blocked via robots.txt once one exists) since sitemap exclusion alone does not prevent indexing if the pages are otherwise linked or discovered.
- Do not assign `priority`/`changefreq` values if using `@astrojs/sitemap` output — these tags are ignored by Google (and Bing largely ignores them too) and add maintenance overhead for no ranking benefit. If they are emitted by the integration's defaults, that's harmless but not something to hand-tune.

---

## Finding 4: Future guidance — sitemap coverage for individual product pages

**Severity:** Info

**Description:**
There are currently 14 products, but they exist only as cards within `/collection` — there are no per-product detail URLs (e.g. `/collection/[slug]`) yet. If per-product pages are built later, they will need explicit sitemap coverage since they won't be covered by the current 8-route inventory.

**Recommendation:**
When product detail pages are introduced:
- Add them to the sitemap automatically via `@astrojs/sitemap`'s content-collection/route-based generation (or a custom sitemap if using an external data source) rather than hand-maintaining a URL list — at 14 products today this is manageable manually, but it won't scale and is an easy source of drift.
- Set `lastmod` to the actual last-modified date of each product's content (price/description/image changes), not a build-time timestamp — a sitemap where every URL shares an identical `lastmod` (a common artifact of naive "generate at build time" scripts) is a low-value freshness signal and flagged as a Low-severity issue if seen in a future audit.
- Omit `priority`/`changefreq` on product entries — ignored by Google.
- At only 14 products (well under any URL-count or file-size limit), a single `sitemap.xml` is sufficient; a sitemap index with split files is not warranted unless the catalog grows into the thousands.
- If products are ever presented as location-specific or industry-specific duplicate pages (e.g. templated "Product X in [City]" pages), apply the location/programmatic-page quality gates: 30+ near-duplicate pages require 60%+ unique content per page, and 50+ requires explicit justification before publishing — not currently applicable, since the catalog is 14 unique products with presumably unique descriptions/images, but worth flagging if the product line is later regionalized or templated.
