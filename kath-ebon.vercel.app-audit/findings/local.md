# Local SEO Audit — Studio Kath (kath-ebon.vercel.app)

**Business type detected:** Hybrid — primarily DTC e-commerce (Shopee, Lazada, on-site cart/checkout), with a real, visitable physical studio disclosed on the `/contact` page. No walk-in retail hours; visits are explicitly by-request ("you'd like to visit the studio — reach out directly"). This is **not** a traditional storefront and should not be scored or optimized like one.

**Industry vertical detected:** Fashion / apparel — small-batch, hand-cut, made-to-order clothing. This doesn't map cleanly to any of the six standard verticals (restaurant, healthcare, legal, home services, real estate, automotive); closest Google-supported `LocalBusiness` subtype is `ClothingStore`, though "appointment-based studio" is a better real-world description than "store." See Finding 6.

**Stage-of-life context (important):** This is a pre-launch/very early-stage brand on a `*.vercel.app` preview subdomain with no confirmed backlinks (see `backlinks.md`) and — as far as this on-page audit can determine — no visible Google Business Profile (GBP) signals at all. A large share of this report's weighted score (GBP 25% + Reviews 20% = 45%) is structurally close to zero for **any** brand at this stage, launched or not. Read the score below as "where local foundations stand today," not as a quality failure.

---

## Local SEO Score: ~14 / 100 (directional, not diagnostic — see caveat above)

| Dimension | Weight | Est. Score | Why |
|---|---|---|---|
| GBP Signals | 25% | ~1/25 | Zero on-page evidence of a GBP (no Maps embed, no place reference, no reviews widget, no posts indicator). Existence of an actual GBP profile is unknown and unverifiable from this tool — flagged as a manual check, not scored as a hard fail. |
| Reviews & Reputation | 20% | 0/20 | No ratings, review count, testimonials, or `aggregateRating` anywhere on Home, About, or Contact. Expected for pre-launch — not a defect, but the readiness gap is real. |
| Local On-Page SEO | 20% | ~7/20 | Address and phone are present in visible text and explicitly invite studio visits (a genuine strength), but there's no dedicated location page, no map, no directions link, no neighborhood/access content. |
| NAP Consistency & Citations | 15% | ~5/15 | NAP is internally consistent between the two places it appears on-site (contact body + footer), but it exists in exactly one canonical source (plain HTML text) with no schema backing and no way to cross-check against GBP/Shopee/Lazada/Facebook listings. |
| Local Schema Markup | 10% | 0/10 | Confirmed zero JSON-LD blocks site-wide (Home, About, Contact all return `structured_data.block_count: 0`). |
| Local Link & Authority Signals | 10% | 0/10 | Domain not in Common Crawl, no confirmed backlinks, no confirmed local citations (see `backlinks.md`). |

---

## Finding 1: No visible Google Business Profile (GBP) signals anywhere on the site — and it's unknown whether a profile even exists

**Severity:** High

**Description:**
Nothing on the rendered Home, About, or Contact pages references a Google Business Profile: no embedded Google Map/iframe, no "View on Google Maps" or directions link, no Place ID, no review-count/star widget, no GBP-sourced photo gallery, no Google Posts callout. This tool has no live Maps/GBP data access in this environment, so I cannot confirm or deny whether a GBP listing for "Studio Kath" currently exists, is verified, or is unclaimed.

Per the reference data in `local-seo-signals.md`, primary GBP category is the single highest-weighted individual local ranking factor (Whitespark 2026, score 193), and an incorrect category is the single worst negative factor (score 176). Right now, this factor group (25% of the overall score) is entirely unaddressed on the visible site, and its real-world status is unknown.

**Evidence:**
- Full rendered HTML of `/contact` (Playwright, `mode=always`) contains no `iframe`, no string match for `maps`, `google.com/maps`, or `place_id`.
- Same check on `/` (home) and `/about` — no Maps embed, no review widget, no GBP badge/link on any page.
- No "Get Directions" or "Find us on Google" CTA anywhere in the nav, footer, or contact channels grid.

**Recommendation:**
1. Manually verify (outside this tool) whether a Google Business Profile for "Studio Kath" already exists at the Thonglor address — search Google Maps directly and check the Business Profile Manager account. This cannot be confirmed from the codebase or this environment.
2. If none exists: create one, category = "Clothing store" (or the closest Google-offered category matching hand-cut/made-to-order apparel — evaluate "Custom tailor" or "Fashion designer" as alternates at setup time, since category choice is the top-weighted factor and hard to change credibly later).
3. Set hours using Google's **"by appointment only"** hours type rather than leaving hours blank or guessing fixed hours — this matches the real business model and avoids showing "Hours unknown" or inaccurate open/closed status, which is itself a negative signal (open-at-search-time is Whitespark factor #5).
4. Do not chase a fully built-out GBP (10+ photos, weekly Posts, services list) before the brand publicly launches — that effort is premature. The realistic near-term bar is: claimed, verified, correct category, correct/matching NAP, "by appointment" hours, link to the live site, and a handful of real studio photos.
5. Re-run this check once a GBP exists and is verified — this is the single highest-leverage item on this list once the brand is ready to accept visits/traffic.

---

## Finding 2: NAP exists in exactly one canonical, un-structured source — no way to verify consistency against GBP or third-party listings

**Severity:** Medium

**Description:**
The address and phone number are visible in plain HTML text in two places on the site (the `/contact` page body and the global footer), and they match each other exactly:

> "39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900"
> `tel:+66815638883` / displayed as "+66 8 1563 8883"

That internal consistency is good. But there is no `LocalBusiness`/`PostalAddress` JSON-LD, no meta tags (no `geo.position`, `ICBM`, or similar), and no structured source of truth anywhere — the address is only readable as free text inside a `<p>` tag, meaning search engines and AI answer engines have to parse it from prose rather than reading an explicit, machine-labeled `PostalAddress`.

Two specific gaps worth flagging:
- The on-page address text omits the country ("...Bangkok Metropolis 10900" — no ", Thailand"). The task brief's confirmed NAP includes ", Thailand," but that string does not actually appear on the live page. For an international/DTC audience this is a minor but real completeness gap.
- Because there's no GBP, no directory listing, and no schema to compare against, **NAP consistency cannot actually be audited from this tool** — there is only one on-page source. Whether this address/phone matches what's on Google Maps, Facebook, Shopee, or Lazada is unverified and needs a manual side-by-side check (see Limitations).

**Evidence:**
- `render_page.py --mode always` on `/contact`: address string appears once in `.contact-channel__address` and once in `.site-footer__address`, byte-identical.
- `tel:+66815638883` href matches the displayed "+66 8 1563 8883" (correct E.164 collapse, no discrepancy there).
- `structured_data.block_count: 0` confirmed on Home, About, and Contact — no JSON-LD anywhere to encode address/phone as structured data.
- No `<meta name="geo.position">`, `og:latitude`, or similar geo meta tags found in rendered head.

**Recommendation:**
1. Add the country to the visible address text ("...Bangkok Metropolis 10900, Thailand") for completeness, independent of schema.
2. Add `LocalBusiness` (or `ClothingStore`) JSON-LD with a structured `PostalAddress` (streetAddress, addressLocality, addressRegion, postalCode, addressCountry) and `telephone` matching the visible text exactly — this is the schema-side fix and is covered in more depth in the separate schema audit; flagging here because it's also the fastest way to make NAP machine-readable and auditable going forward, not just a rich-results nicety.
3. Once a GBP exists (Finding 1), manually cross-check the address and phone format against: Google Business Profile, Facebook Page, Shopee shop info, Lazada shop info, and the LINE Official Account profile. This is a 15-minute manual task this tool cannot perform, and it's the only way to actually validate "NAP consistency" rather than just internal repetition of the same single source.

---

## Finding 3: No dedicated "visit the studio" content — the address is a single line inside a general contact page

**Severity:** Medium

**Description:**
"Dedicated service/location pages" is called out as the #1 local organic ranking factor and the #2 AI-visibility factor (per `local-seo-signals.md`). Right now, the entire "you can visit us" story is one `<p>` tag with an address, sitting in a generic contact grid alongside email, phone, and social icons. There's no framing of the studio as a place — no photos of the space, no description of what a visit involves (is it a fitting? a browse of current pieces? does the customer need to book ahead via LINE first?), no transit/access notes (useful in Bangkok specifically — nearest BTS station, soi navigation, parking), and no internal link from Home or About pointing a browsing visitor toward "you can also visit us in person."

This is appropriately sized as a gap for a brand this size — the fix is not a multi-page "locations" section (this is a single-location hybrid brand, not a multi-location retailer), just meaningfully better use of the one page that already carries this information.

**Evidence:**
- `/contact` extracted text: "Whether you have a question about sizing, want to ask about a piece that's sold out, or you'd like to visit the studio — reach out directly, any way below." followed immediately by Call / Email / Studio (address only) / LINE / social icons — no elaboration on the visit itself.
- `/about` extracted text covers brand story and founder background but contains no mention of the studio as a visitable place (Bangkok/Thonglor only appears via the repeated footer address, not in body copy).
- No internal links from Home or About to `/contact` framed around "visit us" (nav only exposes a generic "Contact" link).

**Recommendation:**
1. Expand the existing Studio block on `/contact` (no new page needed): add 1-2 real photos of the studio interior/exterior, a sentence on what a visit is like, and a note that visits are by appointment/message-first (matches the "we come to you"-style expectation-setting SAB businesses use, adapted for "you come to us, but let us know first").
2. Add a short access note relevant to Bangkok wayfinding (nearest BTS, soi entrance landmark) — low effort, genuinely useful, and adds unique local content beyond a bare address string.
3. Once this is fleshed out, it can also become the description content backing the GBP profile (Finding 1) and the JSON-LD `description`/`hasMap` fields (Finding 6), so this is not throwaway copy — it's reused in at least three places.

---

## Finding 4: Brand handle is inconsistent across social/marketplace citations

**Severity:** Medium

**Description:**
While full NAP consistency can't be checked (Finding 2), the site's own outbound links reveal the brand's *handle* is not consistent across platforms it already controls — which matters for entity resolution (Google/AI systems connecting "Studio Kath" across the web) even though handles aren't literally part of NAP:

| Platform | Linked handle/URL |
|---|---|
| Instagram | `instagram.com/studio.kath/` → handle `studio.kath` |
| Facebook | `facebook.com/kathh.studio/` → handle `kathh.studio` |
| LINE | Displayed as `@studiokath`, but the actual link is an opaque `lin.ee/9TUJj1q` short link |
| Shopee | `shopee.co.th/studio.kath` → handle `studio.kath` |
| Lazada | `s.lazada.co.th/s.ZR0XvK?c=x` — opaque short link, no readable store handle at all |

Three different handle spellings (`studio.kath`, `kathh.studio`, `studiokath`) plus one platform with no discoverable handle in the link itself. This is a small thing individually, but it works against building a single, recognizable entity signal as the brand starts appearing in more places.

**Evidence:** Verbatim `href` values extracted from rendered `/contact` HTML (menu dialog and page body both link the same set).

**Recommendation:**
1. Where the platform allows changing the handle without losing followers/history (Instagram, Facebook), align on one consistent handle — `studiokath` if available, since that's what's already promised in the LINE display text and is the actual brand name.
2. For Lazada, replace the opaque short link with the direct storefront URL (or at minimum verify the short link resolves to a stable, correctly-branded store page) — short links that expire or get reassigned are a real risk for a citation you're relying on long-term.
3. This is a low-cost, one-time cleanup — not an ongoing program. Do it once, not iteratively.

---

## Finding 5: No review or reputation signals anywhere — expected at this stage, but worth planning for deliberately

**Severity:** Low (Info-adjacent — not a current defect)

**Description:**
No star ratings, review counts, testimonial quotes, or `aggregateRating` schema appear anywhere on Home, About, or Contact. For a pre-launch brand with no public storefront traffic yet, this is entirely expected and not something to force. It's flagged here only so it's on the roadmap rather than an afterthought once the brand does launch.

Two data points worth planning around ahead of time (from `local-seo-signals.md`):
- **Magic 10 threshold**: a meaningful ranking bump appears around 10 reviews (Sterling Sky) — worth knowing so early customer outreach for reviews isn't scattered.
- **18-day rule**: rankings can fall off if there's a 3-week gap with zero new reviews once a review history exists — meaning a single launch-week review push followed by silence is worse than a slow, steady trickle. Don't front-load all early reviews into one burst and then stop asking.

**Evidence:** No `aggregateRating`/`Review` schema (0 JSON-LD blocks confirmed sitewide); no testimonial section, star icons, or quote carousel found in rendered HTML on Home, About, or Contact.

**Recommendation:**
1. Don't build review infrastructure before there are real customers to review the product — nothing to do here today.
2. When the GBP profile exists (Finding 1) and the first customers have received pieces, ask for reviews as a normal part of post-purchase follow-up (email or LINE), spaced out rather than batched, to avoid a review-velocity cliff a few weeks after any initial push.
3. Review gating (asking only happy customers, filtering out unhappy ones before they post publicly) is prohibited by both Google's policies and the FTC — worth being aware of before any review-solicitation flow is built, even manually.

---

## Finding 6: No industry-appropriate local schema type defined (cross-reference: schema audit)

**Severity:** Low (see full treatment in the dedicated schema audit)

**Description:**
There is no Schema.org type on the site that identifies Studio Kath as a local business at all — separate from the zero-JSON-LD finding already noted in Finding 2, this is about *which* type would be correct once markup is added. Studio Kath doesn't cleanly fit any single Google-documented `LocalBusiness` subtype: it's not a conventional retail store (no walk-in hours, no public storefront), but it does have a real, visitable, single address. The closest fits are:
- `ClothingStore` (Schema.org-valid subtype of `Store`) — closest "product type" match, but implies retail-hours browsing that doesn't reflect the appointment-only reality.
- Generic `LocalBusiness` with `ClothingStore` as `additionalType` — a reasonable compromise that avoids overclaiming "store" semantics.

Either way, this should be paired with `openingHoursSpecification` reflecting "by appointment," not left blank and not populated with invented fixed hours.

**Evidence:** `structured_data.block_count: 0` on all three rendered pages checked (Home, About, Contact) — confirmed no existing type to evaluate; industry-mapping cross-checked against `local-schema-types.md`.

**Recommendation:** Implement `LocalBusiness` (with `ClothingStore` as `additionalType`) alongside the `Organization`/e-commerce schema already recommended in the main schema audit — do not duplicate that build-out here, just ensure whoever implements it uses the by-appointment hours pattern rather than a generic `Store` template. Full property-level guidance (required vs. recommended fields, geo precision, etc.) lives in the schema audit.

---

## Finding 7: Domain is a Vercel preview subdomain — any local citations built now are built on a throwaway hostname

**Severity:** Low (cross-reference: `backlinks.md` Finding 2, do not double-count)

**Description:**
This is the same domain-migration issue already flagged in the backlink audit, called out here specifically for its local-citation angle: GBP, Facebook, Shopee, Lazada, and any future Tier 1/2 directory listing (Yelp, BBB, Bing Places, Apple Business) would currently need to link back to `kath-ebon.vercel.app`. If/when the brand moves to a permanent domain, every one of those listings needs to be manually revisited and updated — directory citations don't auto-follow a domain change the way a site's own internal links do.

**Evidence:** `render_page.py` confirms production URL is `https://kath-ebon.vercel.app/` with no custom domain attached (same evidence as `backlinks.md` Finding 2).

**Recommendation:** Sequence citation-building (GBP profile URL, Facebook "website" field, any directory submissions) **after** the domain migration already recommended in `backlinks.md`, not before. If GBP setup happens sooner than the domain migration for other reasons, that's fine — just plan to update the website field once the permanent domain is live, and treat that as a checklist item rather than a surprise.

---

## Finding 8 (Info): Thai-language content is not indexable — relevant to local relevance for a Bangkok-based studio

**Severity:** Low

**Description:**
The site has an EN/ไทย language toggle in the header and mobile menu (`data-lang-set="en"`/`"th"`), but no `hreflang` tags and no `/th/`-style URL structure were found in the rendered HTML — the toggle appears to be a client-side text swap rather than separately crawlable/indexable Thai-language pages. For a studio physically located in Bangkok, having genuinely indexable Thai-language content is a relevant local-relevance and AI-visibility signal (Thai-language queries, Thai-language citations/reviews), not just a UX nicety. This overlaps with broader internationalization/technical SEO concerns outside this report's core scope — flagged briefly here for the local angle only.

**Evidence:** No `hreflang` attribute or `/th/` path found via string search across rendered `/contact` HTML; language toggle buttons are plain `<button>` elements with `data-lang-set` attributes, not links to separate URLs.

**Recommendation:** Treat as a lower-priority item for a pre-launch brand; if/when the brand invests in Thai-market SEO specifically, implement real indexable Thai-language pages (or at minimum a Thai `/th/contact` with `hreflang="th"`/`hreflang="en"` reciprocal tags) rather than a JS-only toggle. Not urgent today.

---

## Top Prioritized Actions

1. **[Critical-when-launching / High-now]** Manually verify whether a Google Business Profile exists for Studio Kath; if not, create and verify one with the correct category and "by appointment" hours before any public launch push. (Finding 1)
2. **[High]** Add `LocalBusiness`/`ClothingStore` JSON-LD with structured `PostalAddress`, `telephone`, and `openingHoursSpecification` (by-appointment pattern) — coordinate with the main schema audit's implementation. (Findings 2, 6)
3. **[Medium]** Add the missing country to the visible address text on `/contact` and the footer. (Finding 2)
4. **[Medium]** Expand the Studio block on `/contact` with real photos, a short "what a visit is like" description, and Bangkok-specific access/wayfinding notes. (Finding 3)
5. **[Medium]** Align social/marketplace handles (Instagram, Facebook, Shopee, Lazada, LINE) to one consistent brand handle where platforms allow it. (Finding 4)
6. **[Medium]** Once a GBP profile exists, manually cross-check NAP against Facebook, Shopee, Lazada, and LINE listings for consistency — this tool cannot do this step. (Finding 2, Limitations)
7. **[Low]** Sequence any GBP/directory "website" field updates to point at the permanent domain once the Vercel-subdomain migration (already flagged in `backlinks.md`) happens. (Finding 7)
8. **[Low]** Plan (don't yet execute) a steady, non-batched review-solicitation flow for once real customers exist post-launch. (Finding 5)
9. **[Low]** Replace the opaque Lazada short link with a direct, stable storefront URL if available. (Finding 4)
10. **[Low]** If/when investing in Thai-market SEO specifically, replace the client-side language toggle with real indexable Thai-language pages with reciprocal `hreflang`. (Finding 8)

---

## Limitations Disclaimer

This audit was performed using on-page rendering only (`render_page.py`, Playwright + trafilatura). The following could **not** be assessed and require manual verification or paid tooling:

- **Whether a Google Business Profile exists at all**, its verification status, category, hours, photo count, or review data — no Maps/GBP API or DataForSEO connector was available in this environment.
- **Actual NAP values on Facebook, Shopee, Lazada, or the LINE Official Account** — this report can only confirm what the *website itself* links to, not what those third-party profiles display. A manual side-by-side check is needed to validate true NAP consistency.
- **Tier 1 citation presence** (Yelp, BBB, Apple Business, Bing Places) — checking these reliably requires either live search/API access or direct fetches per-directory, neither of which was available/reliable in this session; per the task brief, this is explicitly called out as something to verify manually rather than guessed at.
- **Proximity-based ranking factors** (55.2% of ranking variance per the Search Atlas ML study) — outside anyone's on-page control and not assessable from a static page audit.
- **Review sentiment, response rate, and velocity** — not assessable because no reviews currently exist anywhere that this tool can see.

None of the above gaps should be read as confirmed problems — they are confirmed **unknowns** that need a manual pass (ideally by whoever has access to the Google Business Profile Manager account, Facebook Page admin, and marketplace seller dashboards) before concluding anything definitive about GBP readiness or cross-platform NAP consistency.
