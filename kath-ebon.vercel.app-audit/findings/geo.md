# GEO / AI Search Readiness Audit — kath-ebon.vercel.app

**Site:** Studio Kath — hand-cut, small-batch clothing, Bangkok, Thailand. Pre-launch. 5 indexable routes: `/`, `/about`, `/collection`, `/contact`, `/privacy` (plus a 3-step `/checkout` flow that should stay unindexed).

**GEO Readiness Score: 21 / 100** (pre-launch baseline — expected to be low; this is a diagnostic floor, not a quality verdict on the brand)

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 35/100 | 8.75 |
| Structural Readability | 20% | 30/100 | 6.0 |
| Multi-Modal Content | 15% | 20/100 | 3.0 |
| Authority & Brand Signals | 20% | 5/100 | 1.0 |
| Technical Accessibility | 20% | 65/100 | 13.0 |
| **Total** | | | **~21/100*** |

*Weighted sum shown for reference (≈31.75); overall score is capped down to reflect that Authority & Brand Signals — the dimension where this site scores worst — is what actually determines whether any of the other four dimensions get the chance to matter for a pre-launch, zero-citation-history domain. Treat the dimension table, not the single number, as the actionable output.

**AI Crawler Access Status (robots.txt):** No robots.txt exists (`GET /robots.txt` → `404`, Vercel default not-found page). This is **not** a deliberate allow — it is ambiguous-by-omission. Per each crawler's own published default behavior, a missing robots.txt is generally treated as "no restrictions," so GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, and anthropic-ai are all implicitly unblocked today. Confirmed, not re-derived from the brief.

**llms.txt status:** Missing. `GET /llms.txt` → `404` (Vercel default not-found page). Confirmed directly.

**Structured data (JSON-LD):** Zero blocks found on every page checked (`/`, `/about`, `/collection`, `/contact`) — `structured_data.block_count: 0` in every render. No `Organization`, `LocalBusiness`, `Product`, `Offer`, `BreadcrumbList`, or `FAQPage` schema anywhere on the site. Confirmed.

**Sitemap:** No `/sitemap.xml` (`404`), consistent with the separate sitemap audit finding.

---

## Finding 1: About page contains factually contradictory boilerplate copy that conflicts with the brand's actual business model

**Severity:** Critical

**Description:**
The `/about` page contains three paragraphs (`about.founding1–3` in `src/i18n/dict.ts`) describing Studio Kath as a **bespoke, made-to-measure, per-customer custom clothing** business founded in **2019** by someone inspired by "our founder's mother, a skilled dressmaker." This directly contradicts the brand's actual, and far more interesting, positioning stated everywhere else on the site: a **small-batch, numbered, ready-to-wear** studio that cuts limited runs in fixed sizes (S/M/L/XL, per the size chart on every product) and explicitly is *not* made-to-order-per-customer.

Specific contradictions:
- **Founding date:** "Founded in 2019" vs. a site that is pre-launch as of the current date (Aug 2026), with `© 2026 Studio Kath` in the footer and no other page ever mentioning a founding year. This reads as unedited template placeholder copy, not a real brand fact.
- **Business model:** "bespoke tailoring," "made-to-measure clothing," "designing your own garment — choosing the fabric," "every custom-made piece is unique, made exclusively for you," "every design can be made to order" (`about.founding1–3`) vs. the homepage/about copy that describes fixed small-batch runs: *"A studio, not a factory... Every order is planned around what we can actually make well — not scaled to meet demand"*; *"Numbered, not mass-produced — Each collection runs in limited quantities, then it's gone"*; *"How a piece gets made"* process section (Pattern → Cut → Sew → Number) describes a standard small-batch production line, not one-to-one bespoke tailoring; and the product size chart (S/M/L/XL with fixed waist/hip/length measurements) is definitionally the opposite of made-to-measure.
- The `/contact` page meta description ("questions, **custom orders**, or studio visits") reinforces the same "custom/bespoke" framing that conflicts with the numbered, fixed-run model described on `/`, `/about` (story section), and `/collection`.

This is the single highest-impact citability problem on the site. AI answer engines (Google AI Overviews, ChatGPT, Perplexity) extract and cite verbatim or near-verbatim factual claims from page copy. If a crawler indexes the `about.founding1–3` block, it could confidently tell a user "Studio Kath is a bespoke tailoring house founded in 2019 offering made-to-measure custom clothing" — which is wrong on both the founding year and the core business model, and would actively mislead prospective customers browsing a fixed-size, limited-run collection. Inconsistent facts across a domain also erode the "authoritativeness" signal LLMs use when deciding whether to trust and cite a source at all.

**Evidence:**
- Rendered HTML, `https://kath-ebon.vercel.app/about`: `<p class="prose" data-i18n="about.founding1">Founded in 2019, Studio Kath was born from a lifelong passion for bespoke tailoring. Inspired by our founder's mother, a skilled dressmaker, the brand was created to preserve the beauty and craftsmanship of made-to-measure clothing.</p>`
- Same page: `<p class="prose" data-i18n="about.founding2">...Every custom-made piece is unique, made exclusively for you.</p>` and `about.founding3`: `...allowing each customer to experience the elegance, confidence, and individuality that only bespoke clothing can offer.`
- Source confirmed in `Z:\kath\src\i18n\dict.ts` lines 148–157 (`about.founding1`, `about.founding2`, `about.founding3`) — this is genuine site copy, not a rendering artifact.
- Contradicting copy, same page, `about.story1`/`story2` (`Z:\kath\src\i18n\dict.ts` lines 161–166): *"We're not trying to become a big brand... That means we can only make so much in a season."*
- Homepage hero/craft copy: `home.studioHeadline` = "A studio, not a factory," `home.craft2Title`/`craft2Body` = "Numbered, not mass-produced — Each collection runs in limited quantities, then it's gone."
- `/collection` size chart on the site (`S 26–28" / M 28–30" / L 30–32" / XL 32–34"`) — fixed sizing, incompatible with "made to measure."
- `/contact` meta description: `content="Get in touch with Studio Kath — questions, custom orders, or studio visits."`

**Recommendation:**
Rewrite or delete `about.founding1–3` before the site is treated as launch-ready for search/AI indexing. Replace the generic "bespoke tailoring house founded in 2019" template narrative with the studio's actual, real founding story and timeline (even if brief — "Studio Kath began cutting its first small run in [year/season]"). Do not publish a founding date unless it is true. Align every mention of "custom" across the site (including the `/contact` meta description) to the accurate model: cut-to-order **within a limited, numbered run**, not one-off bespoke tailoring per customer. Consistent, verifiable facts across all pages are a prerequisite for any of the other GEO recommendations below to be worth doing — fix this first.

---

## Finding 2: Zero structured data (JSON-LD) anywhere on the site — no Organization, LocalBusiness, or Product/Offer schema

**Severity:** High

**Description:**
No page on the site emits any JSON-LD. This was confirmed programmatically (`structured_data.block_count: 0`, `processed_count: 0`) on `/`, `/about`, `/collection`, and `/contact`, and no `itemprop`/`itemtype` microdata was found either. For a small, pre-launch, single-location brand trying to build any AI/search entity recognition, structured data is one of the highest-leverage, lowest-effort fixes available — it gives AI Overviews, ChatGPT, and Perplexity an unambiguous, machine-readable version of exactly the facts a GEO strategy most needs surfaced: brand name, founding, location, social profiles, and product catalog with real prices.

Specifically missing:
- **`Organization`/`LocalBusiness` schema** on `/` or `/about` — would formally declare the entity name ("Studio Kath"), `sameAs` links to Instagram/Facebook/Shopee/Lazada/LINE, and the physical address that already appears consistently in the footer of every page (`39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900`) but is never marked up.
- **`Product`/`Offer` schema** on `/collection` — the page lists 19 SKUs with real THB prices (e.g., ฿1,290, ฿650, ฿1,990) and zero schema markup around any of them. This is a direct, quantifiable loss for shopping-oriented AI surfaces (Google AI Overviews shopping panels, Perplexity Shopping, ChatGPT shopping/product answers), which lean heavily on structured price/availability data rather than parsing prose.
- **`FAQPage` schema** — not applicable yet since there's no FAQ content (see Finding 4), but should be paired with that fix.

**Evidence:**
- `claude-seo run render_page.py <url> --mode auto --json` for `/`, `/about`, `/collection`, `/contact` all return `"structured_data": {"block_count": 0, "processed_count": 0, "total_bytes": 0, "truncated": false, "blocks": []}`.
- No `<script type="application/ld+json">` tag present in any raw HTML fetched from the four pages.
- `/collection` HTML contains 19 price strings (`฿1,290`, `฿1,390`, `฿690`, `฿2,290`, `฿650`, etc.) with zero surrounding `itemprop`/`itemtype`/`ld+json` markup — confirmed via pattern search across the page.
- Footer NAP block (`39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900`) is present, identically, on every page footer — good consistency, but never marked up as `PostalAddress`/`LocalBusiness`.

**Recommendation:**
Add `Organization` (or `LocalBusiness`/`ClothingStore`) JSON-LD to the site layout (so it appears on every page) with `name`, `url`, `logo`, `address`, and `sameAs` (Instagram, Facebook, Shopee, Lazada, LINE). Add `Product`/`Offer` JSON-LD per item on `/collection` — `name`, `image`, `price`, `priceCurrency: THB`, `availability`. This is a template-level change (one Astro component) rather than 19 hand-written blocks, so effort is low relative to impact. Do this only after Finding 1 is resolved, so the structured data doesn't encode the same contradictory founding-date/business-model facts.

---

## Finding 3: Passage-level citability is inconsistent — genuinely good factual claims exist, but they are fragmented into short, non-self-contained snippets rather than the 134–167 word answer blocks AI engines prefer to cite

**Severity:** Medium

**Description:**
The homepage and About page do contain clear, specific, quotable factual claims about the brand's process and model — this is a real strength relative to many small e-commerce sites. Examples that are directly citable today:
- "Cut by hand. Made in small batches." (H1, homepage)
- "Every pattern is laid and cut by a person, not a machine line."
- "Each collection runs in limited quantities, then it's gone."
- The four-step "How a piece gets made" process (Pattern → Cut → Sew → Number) on `/about`.
- Location: Bangkok, Thailand (footer address, every page).

However, none of these read as **self-contained answer blocks** in the 134–167-word range that the skill's citability model treats as optimal. Nearly every factual claim on the site is compressed into single sentences or two-line fragments (typically 15–40 words) spread across separate marketing modules (hero, "flanked" section, marquee ticker, craft-strip list items, process steps) rather than consolidated into a paragraph that fully answers a likely query on its own — e.g., "What does 'hand-cut, small-batch' actually mean at Studio Kath?" has the right raw material scattered across four different page sections, but no single passage an AI could lift wholesale and cite as a complete, standalone answer.

Additionally, no heading on the site is phrased as a question. All H1/H2/H3s are declarative brand-voice statements ("A studio, not a factory," "Worn, not just sold," "How a piece gets made") — appropriate for brand tone, but they don't match the question-based heading pattern (e.g., "What does hand-cut mean?" / "How many pieces does Studio Kath make per run?") that AI Overviews and ChatGPT disproportionately pull direct answers from.

**Evidence:**
- Homepage extracted text (trafilatura, boilerplate-stripped): hero sub-copy is 24 words; "A studio, not a factory" body is 34 words; each of the three "craft-strip" list items is 10–14 words.
- About page: `about.founding1` (the process-relevant paragraph, once corrected per Finding 1) is 38 words; each of the four process steps (`about.step1Body`–`step4Body`) is 20–30 words.
- H1/H2/H3 audit across `/`, `/about`, `/collection`, `/contact`: 0 of ~30 headings found are phrased as questions (all are statement-style, e.g., "Slow, on purpose," "One studio, one size of ambition," "Cut in limited numbers").
- No single paragraph anywhere on the four content pages reaches even 100 words in one unbroken block.

**Recommendation:**
Once Finding 1 is corrected, consolidate the *accurate* process/model facts into 1–2 dedicated, self-contained paragraphs of ~140–160 words each — e.g., a single "What 'hand-cut, small-batch' means at Studio Kath" passage on `/about` that in one block covers: the cutting process, the numbered/limited-run model, typical run size or cadence if the brand is willing to disclose it, and the Bangkok studio location — written so it could be lifted verbatim as a complete AI Overview or ChatGPT answer. Consider adding 2–4 question-phrased subheadings to `/about` or a lightweight FAQ on `/contact` (e.g., "Is Studio Kath made-to-order or in stock?", "Where is Studio Kath based?", "How many pieces does each run include?") to match the query patterns AI engines answer directly from.

---

## Finding 4: No FAQ content and no blog/article content anywhere on the site

**Severity:** Medium

**Description:**
The site has exactly five content routes (`/`, `/about`, `/collection`, `/contact`, `/privacy`) and no blog, journal, lookbook, or FAQ section. This means there is no long-form, topically-focused content for AI engines to cite for the kinds of informational queries a values-driven fashion brand is well-positioned to win — e.g., "what is small-batch clothing," "how is hand-cut clothing made," "sustainable/slow fashion brands in Bangkok." All existing copy is short-form marketing/transactional copy tied to conversion pages, not answer-oriented content. This isn't unusual for a pre-launch storefront, but it is the largest single ceiling on the site's addressable AI-citation surface area going forward — structured data and passage-length fixes only optimize the five pages that exist; they can't manufacture topical coverage that doesn't exist yet.

**Evidence:**
- Full route inventory confirmed via `Z:\kath\src\pages\`: `index.astro`, `about.astro`, `collection.astro`, `contact.astro`, `privacy.astro`, plus 3 checkout routes. No blog/journal/FAQ route exists.
- No `<h2>`/`<h3>` on any page is phrased as a query, and no page exceeds a few hundred words of body copy (About page, the most content-rich page, totals well under 600 words including the process steps).

**Recommendation:**
Post-launch, add a small, low-maintenance "Journal" or "Notes from the Studio" section — even 3–5 short posts (300–500 words each) on topics like the cutting process, fabric sourcing, or "why we don't restock" — written as direct, self-contained answers to likely questions. This is the standard lever for building topical authority that AI Overviews/ChatGPT/Perplexity draw on for category-level (not just brand-level) queries, and it also gives the brand pages to earn backlinks/shares that a 5-page storefront cannot.

---

## Finding 5: Brand mention and third-party authority signals are effectively zero — this must be treated as the site's actual starting point, not understated

**Severity:** High

**Description:**
This is a brand-new, pre-launch label with no meaningful third-party footprint yet, and the audit should not overstate current readiness here. Realistically: **current AI visibility for "Studio Kath" is at or near zero** across ChatGPT, Google AI Overviews, and Perplexity, because none of the signals these systems correlate with citation-worthiness exist yet.

Checked against the known correlation signals:
- **YouTube mentions (~0.737 correlation, strongest signal):** None found. No YouTube channel or third-party video content referencing the brand.
- **Reddit presence (high correlation):** None found. No evidence of organic discussion on r/femalefashionadvice, r/BangkokExpats, Thai fashion subreddits, or elsewhere.
- **Wikipedia entity (high correlation):** None. Expected — pre-launch micro-brands essentially never have a Wikipedia entry, and pursuing one now would be premature/against notability guidelines.
- **Domain Rating / backlinks (weak correlation, ~0.266, but still a floor signal):** The domain has **no record at all** in Common Crawl's web graph (`in_crawl: false`, `in_rankings: false` — confirmed in the companion backlinks audit), meaning there isn't even a weak/negative signal to read, just an absence. Consistent with a domain that has never been crawled or linked to from any indexed page.
- **LinkedIn:** No company page found/linked from the site.
- **Owned social channels exist but are not yet third-party signal:** Instagram (`instagram.com/studio.kath`), Facebook (`facebook.com/kathh.studio`), Shopee (`shopee.co.th/studio.kath`), Lazada (marketplace storefront), and LINE are all linked from the site header/footer/menu. These are valuable *distribution* channels and a reasonable starting point for building the above signals, but they are self-owned and do not themselves function as third-party citation or "trust" signals the way a Reddit thread, YouTube review, or press mention would. None of them are currently referenced back *to* the site via structured data (no `sameAs`, per Finding 2), which also means search/AI engines can't even confidently confirm these profiles belong to the same entity as the website.

Only ~11% of domains are cited by both ChatGPT and Google AI Overviews simultaneously — for a domain with zero external signal today, the realistic near-term goal should be modest, incremental presence (being findable and accurately described when asked directly about "Studio Kath"), not competing for AI Overview citations on generic category queries, which will require sustained third-party coverage this brand does not yet have.

**Evidence:**
- Companion backlink audit (`Z:\kath\kath-ebon.vercel.app-audit\findings\backlinks.md`): Common Crawl `in_crawl: false`, `in_rankings: false`, `pagerank: null` — domain has no recorded web graph presence at all.
- Social links present in site HTML (header menu, footer) on every page: Instagram, Facebook, Shopee, Lazada, LINE — confirmed via `href` audit of `/` and `/about` HTML. No YouTube, Reddit, LinkedIn, or Wikipedia links found anywhere on the site.
- No `sameAs` structured data linking these profiles to the site entity (see Finding 2).
- No press, blog, or third-party mentions were surfaced in the render/crawl data gathered for this audit; the domain itself is unindexed by Common Crawl, which is the strongest available proxy for "has this been linked to/discussed anywhere on the crawlable web."

**Recommendation:**
Set expectations accordingly: do not expect AI Overview/ChatGPT/Perplexity citations at launch. Prioritize, roughly in order of correlation strength and feasibility for a small Bangkok studio: (1) get product photography/behind-the-scenes content onto YouTube/Instagram Reels/TikTok with consistent brand naming — video is the strongest correlated signal and cheapest to start; (2) seed genuine (not manufactured) presence in relevant Reddit communities once there's something worth discussing (a drop, a press mention, a real customer story) rather than promotional posts; (3) add `sameAs` structured data (Finding 2) so existing Instagram/Facebook/Shopee/Lazada profiles are machine-linked to the site entity now, at zero incremental cost; (4) pursue small local/regional press or Bangkok lifestyle-blog coverage, which is a more realistic near-term win than Wikipedia or major backlinks for a brand at this stage. Revisit this specific finding in 6–12 months post-launch — it is expected to change the most of any dimension in this audit.

---

## Finding 6: Site is technically accessible to AI crawlers today — static/SSR HTML with no JavaScript-rendering dependency (positive finding, verify before launch)

**Severity:** Info

**Description:**
Unlike the ambiguity around robots.txt, this is an unambiguous strength worth confirming explicitly: all four content pages tested (`/`, `/about`, `/collection`, `/contact`) are server-rendered/static Astro output. Raw, no-JavaScript fetches (`--mode never`) return complete, fully-populated HTML with all body copy, headings, product names, and prices present — no client-side hydration is required to see the content a crawler like GPTBot, ClaudeBot, or PerplexityBot would need. `is_spa: false` was confirmed on every page. This means the technical-accessibility half of GEO readiness is already largely solved; the gaps in this audit are content/markup gaps (Findings 1–5), not rendering-architecture gaps.

One related gap: no Open Graph (`og:*`) or Twitter Card meta tags were found on any page, which affects how the pages are represented when shared/previewed by AI chat tools and social platforms, even though the underlying content itself is crawlable.

**Evidence:**
- `render_page.py --mode never --json` for `/` and `/about`: `"is_spa": false`, `"mode_used": "raw"`, full content present in `raw_content`/`content` without any Playwright render needed.
- `<meta name="generator" content="Astro v7.1.6">` confirms static-site generation.
- Pattern search for `<meta property="og:` and `<meta name="twitter:` across `/`, `/about`, `/collection`, `/contact` returned zero matches on any page.

**Recommendation:**
No action needed on rendering architecture — keep it this way as the site grows (avoid moving core content behind client-side-only rendering). Add basic Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Card tags site-wide; low effort, and improves how the brand is represented when links are shared into or summarized by AI chat interfaces.

---

## Top 5 Highest-Impact Changes (prioritized)

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Rewrite/remove the contradictory "bespoke, made-to-measure, founded 2019" copy in `about.founding1–3` (Finding 1) | Critical — prevents AI from citing false facts about founding date and business model | Low (content edit, 3 strings in `dict.ts`) |
| 2 | Add `Organization`/`LocalBusiness` JSON-LD sitewide with `sameAs` links to Instagram/Facebook/Shopee/Lazada, plus `Product`/`Offer` schema on `/collection` (Finding 2) | High — machine-readable entity + shopping data for AI Overviews/ChatGPT/Perplexity | Low–Medium (one layout component + one collection-loop template) |
| 3 | Consolidate scattered process/model facts into 1–2 self-contained ~140–160 word answer passages, plus a few question-phrased headings (Finding 3) | Medium–High — directly targets the citability mechanic AI engines use | Low (content rewrite, no new pages) |
| 4 | Add `llms.txt` and an explicit `robots.txt` that allows GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot (turns the current ambiguous-by-omission state into a deliberate, documented allow) | Medium — removes ambiguity, signals intentional AI-search openness | Low |
| 5 | Begin building third-party/brand-mention signal: video content (YouTube/Reels), `sameAs`-linked social profiles, and eventually local press (Finding 5) | High long-term, but slow to materialize | Medium–High, ongoing |

---

## Platform-Specific Notes

**Google AI Overviews:** No structured data, no sitemap, and no Common Crawl footprint mean the site likely isn't indexed deeply enough yet to surface in AI Overviews for any query, brand or category. Once indexed, `Product`/`Offer` schema (Finding 2) is the single highest-leverage addition for Google's shopping-integrated AI Overviews specifically.

**ChatGPT (browsing/search):** Static HTML with no JS dependency (Finding 6) means content is technically fetchable today. But with zero brand-mention signal (Finding 5) and a contradictory About page (Finding 1), a direct query like "tell me about Studio Kath, Bangkok" would currently return either nothing or, worse, the incorrect "bespoke, founded 2019" narrative if the About page is the only source found. Fixing Finding 1 before any broader visibility push is the priority specifically for this platform, since ChatGPT tends to lean on single-source page content more than aggregating across many mentions for niche/new entities.

**Perplexity:** Perplexity weights citation diversity and recency highly. With no blog/article content (Finding 4) and no third-party mentions (Finding 5), there is currently no diverse citation set for Perplexity to draw from beyond the storefront itself — expect it to either not surface the brand for category queries or, for direct brand-name queries, to cite the homepage/about page only (making Finding 1's accuracy fix directly load-bearing here too).

**Bing Copilot:** Bing indexing tends to track Bing Webmaster Tools / IndexNow more directly than organic crawl discovery. The companion backlinks audit confirms no Bing Webmaster API key/data was available to check current Bing index status; recommend the team verify Bing Webmaster Tools verification status directly as a follow-up, since Copilot draws from Bing's index.

---

## Files Referenced

- `Z:\kath\src\i18n\dict.ts` (lines 148–166) — source of the contradictory About page copy (Finding 1)
- `Z:\kath\src\pages\about.astro`, `index.astro`, `collection.astro`, `contact.astro` — page templates confirmed to have no JSON-LD injection point
- `Z:\kath\astro.config.mjs` — no `site` URL configured (also blocks sitemap generation per companion sitemap audit)
- `Z:\kath\kath-ebon.vercel.app-audit\findings\backlinks.md` — Common Crawl zero-footprint evidence reused in Finding 5
- `Z:\kath\kath-ebon.vercel.app-audit\findings\sitemap.md` — no sitemap/robots.txt evidence reused in header summary
