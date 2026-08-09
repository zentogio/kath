# Content Quality & E-E-A-T Audit — kath-ebon.vercel.app (Studio Kath)

**Pages reviewed:** `/` (home), `/about`, `/collection`, `/contact`, `/privacy`. `/checkout` and subpages excluded (transactional, not content).

**Overall Content Quality Score: 54/100**

| E-E-A-T Factor | Weight | Score | Notes |
|---|---|---|---|
| Experience | 20% | 45/100 | Specific process detail exists (4-step "How a piece gets made") but no photos of the actual studio/maker, no behind-the-scenes proof |
| Expertise | 25% | 35/100 | No named founder, no credentials, no bio anywhere on the site |
| Authoritativeness | 25% | 20/100 | No press, no third-party mentions, no reviews/testimonials, brand-new `*.vercel.app` domain |
| Trustworthiness | 30% | 75/100 | Real phone number + studio street address, specific PDPA-referenced privacy notice, transparent no-cookies statement — but undercut by the Finding 1 inconsistency below and a personal Gmail contact address |

---

## Finding 1: About page contains generic templated "bespoke tailoring" copy that contradicts the site's actual small-batch ready-to-wear business model

**Severity:** High

**Description:**
The `/about` page mixes two distinctly different voices. Most of the page is specific, on-brand, first-hand-sounding copy ("Slow, on purpose," "One studio, one size of ambition," the 4-step "How a piece gets made" process). But embedded in the middle of the page is a block headed "About Studio Kath" that reads as unedited stock/template copy:

> "Founded in 2019, Studio Kath was born from a lifelong passion for bespoke tailoring. Inspired by our founder's mother, a skilled dressmaker, the brand was created to preserve the beauty and craftsmanship of made-to-measure clothing. We believe there is something truly special about designing your own garment—choosing the fabric, creating a style that reflects your personality, and wearing clothing that is tailored to fit you perfectly. Every custom-made piece is unique, made exclusively for you. At Studio Kath, every design can be made to order, allowing each customer to experience the elegance, confidence, and individuality that only bespoke clothing can offer."

This is a factual/business-model contradiction, not just a tonal mismatch:
- It describes a **made-to-measure / bespoke commission** model ("choosing the fabric," "made exclusively for you," "every design can be made to order"). 
- The actual site sells a **fixed, pre-cut, small-batch ready-to-wear collection**: `/collection` lists 14 named SKUs (e.g., "Pleated Wide-Leg Trousers, Papaya") at fixed prices, with "Sold Out" states, an "Add to Cart" / "View Details" flow, and copy stating "Everything shown here is made in small runs... we don't restock mid-season." Customers cannot choose fabric or request a custom fit — they buy what's in stock, sized S–XL against a fixed size chart.
- No founder is named anywhere on the site, and "Founded in 2019" is unverifiable and sits oddly for what the audit brief describes as a **pre-launch** brand — this reads like unedited boilerplate left over from a theme/starter template or AI drafting pass that was never reconciled with the real business.

Per the Sept 2025 QRG, this is close to a textbook example of a low-quality AI-content marker: generic phrasing ("lifelong passion," "elegance, confidence, and individuality"), no first-hand specificity, and — critically — a factual inconsistency with the rest of the site. It sits directly beside genuinely strong, specific copy on the same page, so the contrast is stark and easy for both a human reader and an LLM crawler to notice.

**Evidence:**
- Rendered `/about` HTML (`render_page.py --mode auto`), text-stripped and read in sequence — the block above appears between "One studio, one size of ambition." and the "How a piece gets made" 4-step section.
- `/collection` extracted text confirms fixed-SKU retail model: "The Collection / Everything shown here is made in small runs. Once a size or piece sells out, it's retired until the next cut — we don't restock mid-season." plus 18 price tags (฿650–฿2,290), "Sold Out," "Add to Cart," "View Details," and a fixed Size Guide (S/M/L/XL with waist/hip/length in inches) — none of which is compatible with "choosing the fabric" or true made-to-order bespoke tailoring.
- Footer tagline across all pages: "Hand-cut, small-batch clothing made to last, not to trend." — reinforces the small-batch ready-to-wear positioning, not bespoke.

**Recommendation:**
Delete or fully rewrite the "About Studio Kath / Founded in 2019..." block. Replace it with content consistent with the rest of the page's voice and the actual business model — e.g., expand on who actually cuts the pieces (even a first name and a real photo would help), why the studio chose small-batch ready-to-wear over bespoke, and what "made to last" concretely means (fabric sourcing, construction choices). If there genuinely is a founder's-mother dressmaking origin story, keep it but rewrite it in the site's own specific, restrained voice and make sure any date/founding claim is accurate and — if the brand is pre-launch — do not claim "Founded in 2019" unless that year is accurate for when the underlying craft practice began (as opposed to the brand name/site).

---

## Finding 2: No named founder, maker, or "about the person" credentials anywhere — weak Expertise/Authoritativeness for a craft-quality claim

**Severity:** High

**Description:**
The entire brand promise rests on a craftsmanship claim ("hand-cut," "touched by hand at least three times — cut, sewn, and finished — by someone who'll tell you exactly why it's made the way it is"), but the site never names or shows that person. There is no founder name, no maker bio, no photo of the studio or the cutting/sewing process, no credentials (years of experience, training, prior brand affiliations), and no press or third-party recognition. For a quiet-luxury/craft positioning where the entire value proposition is "a person, not a machine line," this is the single biggest credibility gap on the site — readers (and AI systems evaluating trust) have to take the hand-cut claim entirely on faith.

**Evidence:**
- `/about` extracted text: process and philosophy language throughout ("Every piece that leaves the studio has been touched by hand at least three times," "someone who'll tell you exactly why it's made the way it is") but zero named individuals.
- No `author`, `person`, or biographical schema/markup found in structured data extraction for any page (`structured_data.block_count: 0` on both `/` and `/collection`).
- No Instagram/social proof content pulled into the site itself beyond icon links in the footer (Instagram, Facebook, Shopee, Lazada) — no embedded posts, no press logos, no customer reviews/testimonials anywhere in the reviewed pages.

**Recommendation:**
Add a real "who's behind Studio Kath" element: at minimum a founder/maker first name and a genuine photo (studio, hands cutting fabric, or the person themselves), ideally with a sentence or two of concrete experience (e.g., "trained under X," "N years cutting patterns," "previously at Y atelier"). This single addition would meaningfully lift Experience and Expertise scores and gives AI systems and readers a concrete, citable trust anchor instead of only brand copy.

---

## Finding 3: Collection page has no per-product content — 14 SKUs share one page with name + one-line blurb only, no dedicated product pages

**Severity:** Medium

**Description:**
`/collection` lists all 14 products as cards on a single URL. Extracted text for the page confirms there is no fabric composition, care instructions, sizing notes, or story text per item beyond the product name and price — e.g., home-page teaser copy for individual pieces is limited to one short line each ("Same cut as our Sand trousers, in a warm papaya orange," "An oversized collar, puffed sleeves, matched to pleated shorts"). There are no individual product detail URLs, so:
- Each product has effectively zero unique, indexable, citable content of its own — nothing for Google or an AI assistant to quote about a specific garment beyond its name and price.
- Product-level differentiation (why this piece justifies its price, what fabric it's cut from, why it's "made to last") is entirely absent — which directly undercuts the "quality over quantity" positioning at the exact point (the product itself) where a shopper would want that substantiation.
- This also means there's no way to build topical depth or earn long-tail search/AI-citation visibility for individual pieces (e.g., "papaya wide-leg trousers Bangkok") — everything funnels to one thin `/collection` URL.

**Evidence:**
- `/collection` `extracted_text`: "The Collection / Everything shown here is made in small runs... ฿1,290 ฿1,290 ฿1,390 ฿690 ฿1,290 ฿2,290 ฿650 ฿650 ฿1,490 ฿890 ฿950 ฿1,890 ฿1,390 ฿890 ฿1,990 ฿1,290 ฿1,290 ฿2,190 / Your cart is empty. / Sold Out / All pieces cut to order, in limited numbers. See the full collection." — no fabric, care, or per-item descriptive body copy captured at all; content is essentially name + price + stock state.
- Home page teaser cards ("Now in the Studio") give the fullest per-product copy on the site, and it's a single sentence per item.
- Per the audit brief: confirmed no individual product-detail URLs exist; "View Details" / "Add to Cart" operate against the single collection page/cart drawer rather than routing to dedicated pages.

**Recommendation:**
This is a defer-to-`seo-programmatic`-adjacent thin-content pattern but the fix here is manual, not templated, given only 14 SKUs: give each piece even 80–150 words of real content — fabric and weight, where the cloth is sourced, sizing/fit notes beyond the generic chart, and one sentence tying it back to the hand-cut process (e.g., referencing the specific number in the run, "Cut #14 of 30"). This is low-effort at 14 SKUs and directly strengthens both the quality-over-quantity narrative and AI-citation readiness (numbered, limited-run specifics are exactly the kind of concrete fact an LLM can quote).

---

## Finding 4: Content depth is thin relative to page-type minimums, though partly justified by minimal brand positioning

**Severity:** Medium

**Description:**
Approximate word counts from rendered text (excluding nav/footer boilerplate):
- Home (`/`): roughly 250–300 words of unique body copy (hero line, "A studio, not a factory," three feature blurbs, quote, five product teasers). Homepage floor per this skill's benchmarks is ~500 words — home is under that, though a restrained "quiet luxury" brand can reasonably run leaner than a typical service-page homepage.
- About (`/about`): roughly 350–400 words once the generic block from Finding 1 is excluded/replaced, still short of what a page carrying the entire brand-trust narrative should have.
- Collection (`/collection`): page-level copy is two sentences; all remaining "content" is transactional (prices, sizes, cart) — see Finding 3.
- Contact (`/contact`): ~60 words, appropriate for a contact page.
- Privacy (`/privacy`): specific and appropriately scoped (see Finding 6 — this is a genuine strength, not a gap).

There is also noticeable message repetition rather than depth: the "hand-cut / small-batch / made to last" triad is restated near-verbatim at least three times on the home page alone (hero, feature icon row, mini-blurb row) without adding new information each time. Repetition without elaboration is one of the Sept 2025 QRG's flagged low-value-content patterns even when not AI-generated.

**Evidence:**
- Home page extracted text shows "Hand-Cut / Small Batch / Numbered, Not Mass-Produced / Made to Last" as icon labels, then immediately below, "Cut by hand / Numbered, not mass-produced / Built to outlast the season" as a second near-identical three-item list, then the pull-quote restating the same idea a third time — all before any new information (the product teasers) appears.
- Full home-page body text captured via rendered HTML (see analysis; truncated JSON summary corroborates via `extracted_text` field ending mid-sentence, indicating short overall length).

**Recommendation:**
Don't pad for the sake of a word-count target — Google does not rank on word count directly, and the brand's minimal tone is a deliberate asset. Instead, replace *repetition* with *elaboration*: keep the hand-cut/small-batch claim to one strong statement per page, and use the freed-up space for the kind of concrete process/provenance detail that's already working well in the "How a piece gets made" section (fabric sourcing, run sizes, timelines). This raises both topical coverage and AI-citation value without diluting the brand voice.

---

## Finding 5: AI citation readiness — strong process facts exist but are buried; no structured data to help LLMs extract them

**Severity:** Medium

**Description:**
Positive: the site does contain some genuinely quotable, specific facts that an AI assistant could cite — e.g., "Every piece that leaves the studio has been touched by hand at least three times — cut, sewn, and finished," the 4-step numbered process (Pattern → Cut → Sew → Number), and "We don't use cookies or marketing trackers on this site" (privacy page). These are exactly the kind of concrete, verifiable claims that make content citable.

Negative: 
- Zero structured data (JSON-LD) was found on any page reviewed (`structured_data.block_count: 0` on home and collection). No `Organization`, `LocalBusiness`, `Product`, or `Article` schema — meaning there's no machine-readable layer confirming the studio's name, address, phone, or product data to search engines/LLMs; everything must be inferred from prose.
- No FAQ content, no clear Q&A structure, and heading hierarchy is shallow (mostly H1 + a few short sections) — there's little structural scaffolding for an LLM to segment and attribute facts to specific claims.
- The strongest facts (the 4-step process, the "touched by hand three times" line) live only on `/about`, two clicks from the homepage, rather than being reinforced or interlinked from `/collection` where a shopper (or AI shopping assistant) is more likely to be evaluating the brand.

**Evidence:**
- `structured_data` field returned empty for both `/` and `/collection` renders (`block_count: 0, processed_count: 0`).
- Process facts confirmed present only in `/about` rendered HTML ("How a piece gets made" 4-step section).

**Recommendation:**
Add `Organization`/`LocalBusiness` JSON-LD site-wide (name, address, phone, sameAs links to Instagram/Facebook/Shopee/Lazada — all already present as footer links) and `Product` schema on collection entries (name, price, availability/"Sold Out" state) — this is low-effort since the data already exists in the DOM. Surface one or two of the strongest process facts (hand-touched three times, numbered/logged runs) as a short callout on `/collection` itself, not just buried on `/about`.

---

## Finding 6: Privacy Notice is a genuine trust strength — specific, jurisdictionally relevant, and non-generic

**Severity:** Info (positive finding)

**Description:**
Unlike the templated block in Finding 1, `/privacy` reads as genuinely specific and accurate to this business: it correctly references Thailand's Personal Data Protection Act B.E. 2562 (PDPA), states plainly what data is collected ("name, shipping address, and phone number through the checkout form — nothing more"), and makes a specific, checkable technical claim ("We don't use cookies or marketing trackers on this site... Your cart and order details are stored only in your own browser (local storage)"). This is exactly the kind of concrete, verifiable trust content the Sept 2025 QRG rewards, and it's worth preserving as a model for the tone the rest of the site's "About" content should aim for.

**Evidence:**
- `/privacy` extracted text: "This notice explains how Studio Kath collects, uses, and protects your personal data, in line with the Personal Data Protection Act B.E. 2562 (PDPA)."

**Recommendation:**
No change needed to this page's content quality. Consider only adding a visible "last updated" date to the page itself (not just the HTTP `Last-Modified` header) so visitors and AI crawlers can see freshness at a glance.

---

## Finding 7: Contact trust signals are present but incomplete — personal Gmail address undercuts an otherwise solid NAP block

**Severity:** Low

**Description:**
`/contact` provides a real phone number (+66 8 1563 8883) and a specific street address (39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900) plus a Line handle — a genuinely good, specific NAP (Name/Address/Phone) trust block for a small local brand. However, the sole email address used site-wide (footer and contact page) is `info.studiokath@gmail.com`, a free consumer Gmail address rather than a branded domain email (e.g., `info@studiokath.com`). This is a minor but real trust signal gap for a "quiet luxury" positioned brand — branded email is cheap to set up and is a small but noticeable authoritativeness/professionalism signal, especially once (per the backlinks audit) the site migrates off the `*.vercel.app` subdomain to a real domain.

**Evidence:**
- `/contact` extracted text: "Call +66 8 1563 8883 / Studio 39/1 Soi Thonglor 2, Chomphon, Chatuchak, Bangkok Metropolis 10900 / Chat on Line @studiokath."
- Footer on every page reviewed: "Get in touch / info.studiokath@gmail.com."

**Recommendation:**
Once the custom domain is live (see the backlinks audit's domain-migration recommendation), switch the contact email to a domain-matched address and update it site-wide. Low priority — sequence after the domain migration, not before.

---

## Summary of Recommendations (priority order)

1. **(High)** Rewrite/remove the templated "Founded in 2019... bespoke tailoring... made to order" block on `/about` — it factually contradicts the site's actual ready-to-wear small-batch model and is the clearest AI-boilerplate red flag on the site.
2. **(High)** Name and show the person(s) behind Studio Kath — even one named maker with a real photo meaningfully improves Expertise/Experience signals for a craft-claim brand.
3. **(Medium)** Add ~80–150 words of real per-product content (fabric, sourcing, fit, run number) across the 14 collection SKUs.
4. **(Medium)** Reduce repeated brand-claim phrasing on the homepage; redirect that space toward new, specific process/provenance detail.
5. **(Medium)** Add `Organization`/`LocalBusiness` and `Product` JSON-LD; surface the strongest process facts on `/collection`, not only `/about`.
6. **(Low)** Move off the personal Gmail contact address once a branded domain is live.

No action needed on `/privacy` — it's a genuine strength and a useful template for the tone the rest of the "About" narrative should adopt.
