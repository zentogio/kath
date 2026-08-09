# Visual / Mobile Rendering Audit — kath-ebon.vercel.app

Captured with Playwright (Chromium) at Desktop (1920×1080) and Mobile (375×812, iPhone-class) viewports for `/`, `/collection`, `/about`, `/contact`, plus the cart drawer overlay. Full-page captures were taken with simulated incremental scrolling to correctly trigger scroll-based reveal animations. Raw HTML was also fetched directly (no JS) to cross-check the alt-attribute claims against rendered DOM state.

Screenshots: `Z:\kath\kath-ebon.vercel.app-audit\screenshots\`
- `home-desktop.png` / `home-mobile.png` (above-the-fold) + `home-desktop-full.png` / `home-mobile-full.png` (full page)
- `collection-desktop.png` / `collection-mobile.png` + `-full` variants
- `about-desktop.png` / `about-mobile.png` + `-full` variants
- `contact-desktop.png` / `contact-mobile.png` + `-full` variants
- `cart-drawer-desktop.png` / `cart-drawer-mobile.png`
- `audit_data.json` (raw measurements: touch targets, image alt data, viewport meta, scroll width checks, H1/CTA fold visibility)

---

## Finding 1: Above-the-fold value proposition is strong on both desktop and mobile — PASS

**Severity:** Info (no action needed)

**Description / Evidence:** On every page tested, the H1 and primary CTA render fully within the first viewport on both desktop and mobile, with no layout shift risk observed (images have explicit `width`/`height` attributes reserving space).

- Home (mobile, 375×812): H1 "Cut by hand. Made in small batches." renders at y=305–448, fully visible; the "EXPLORE THE COLLECTION" / "ABOUT THE STUDIO" CTA pair sits directly beneath it at y=593–703, also fully visible. Supporting one-line copy ("Every piece starts as a length of cloth and a chalk line...") communicates the brand's small-batch/handmade positioning within the first screen, no scrolling required. See `home-mobile.png`.
- Home (desktop): three-column parallax editorial photography + H1 + dual CTA all visible without scrolling. See `home-desktop.png`.
- Collection: H1 "Cut in limited numbers." + supporting copy ("made in small runs... we don't restock mid-season") visible above the fold on both viewports, reinforcing the scarcity/quiet-luxury positioning before any product grid is seen.
- About: H1 "Slow, on purpose." + founder-frustration framing visible above the fold on both viewports.
- Contact: H1 "Let's talk about a piece." + intro line visible above the fold on both viewports.

**Recommendation:** No change needed. This is a genuine strength — keep hero copy short if it's ever revised, since the current line lengths are what keep the CTA above the fold on the 375px viewport.

---

## Finding 2: Hero carousel product photography (home page) is missing descriptive alt text

**Severity:** Medium

**Description / Evidence:** Raw HTML inspection (bypassing JS) confirms two distinct alt-text patterns are being conflated in the "9/9/9/9/14 missing alt" count referenced in the brief. They need to be prioritized very differently:

1. **Decorative UI icons — not a real problem.** On every page, the LINE icon and the Instagram/Facebook/Shopee/Lazada social icons (in the mobile menu dialog and site footer) use a *bare* `alt` attribute with no value, e.g.:
   `<img src="/_astro/instagram-mark...webp" alt data-astro-cid-y2qsmizv="true" ... class="social-links__icon">`
   Per the HTML spec, a valueless `alt` attribute is equivalent to `alt=""` — it renders as decorative/empty in the accessibility tree exactly like `alt=""`. This is confirmed correct here because the parent `<a>` link already carries an accessible name ("Instagram", "Facebook", "Shopee", "Lazada" — confirmed via computed `innerText`/`aria-label` in the rendered DOM). **This is the majority of the flagged count** (9 on home/about/collection/checkout, 14 on contact — contact has an extra LINE CTA icon plus a duplicated social row). It is a false positive for any alt-text scanner that regexes for `alt="..."` and misses bare `alt`.
   *Recommendation:* Cosmetic only — normalize `alt` → `alt=""` explicitly in the icon/social-link component so linters and third-party SEO/accessibility scanners stop flagging it. No user-facing impact.

2. **Real empty `alt=""` on genuine product photography — this is the actual issue.** The home page hero is a 3-column parallax carousel that cycles through **8 rotating product photos** (`trousers-sand.webp`, `crop-top-yellow-gingham.webp`, `trousers-azure.webp`, `blouse-papaya-puff.webp`, `trousers-sage.webp`, `vest-set-dusty-blue-2.webp`, `satin-set-powder-blue.webp`, `trousers-taupe-plaid.webp`) with class `hero__slide`. These carry a genuine, explicit `alt=""` — not a bare attribute. This is the single most prominent, above-the-fold visual on the entire site, yet it is invisible to screen readers and gives search engines zero context. Notably, several of these exact same photos **do** have well-written descriptive alt text elsewhere on the same page (e.g. `trousers-indigo-gingham.webp` → *"A model in the indigo gingham wide-leg trousers"* in the "flanked" section further down), proving the content team already writes good alt copy — it just wasn't applied to the hero component.
   All other content/product photography sitewide (collection product grid — 17 images, all with full descriptive alt like *"A model in bright papaya orange pleated wide-leg trousers with a white crop top"*; About page founder/process photography; Contact page has none) is correctly and consistently described. This confirms the hero carousel is an isolated gap, not a site-wide practice problem.

**Recommendation:** Add descriptive alt text to the 8 `hero__slide` images on the home page, reusing/adapting the descriptive copy already written for the same photos elsewhere (e.g. product names/descriptions from the collection page). Leave the social/nav icon `alt` attributes as low-priority cosmetic cleanup.

---

## Finding 3: Mobile touch targets — nav menu links and language toggle are below recommended size

**Severity:** Low

**Description / Evidence:** Measured via `getBoundingClientRect()` on the rendered mobile DOM (375×812). Primary icon buttons meet the 44×44px minimum:
- "Open menu" hamburger: 44×44px ✓
- "Open cart" icon: 44×44px ✓
- "Close menu": 44×44px ✓

However, several interactive elements fall short of the commonly recommended ~44–48px touch target:
- Mobile menu nav links (Home, Collection, About, Contact): **35px tall** (widths 69–117px), e.g. "Collection" is 117×35.
- Language toggle buttons ("EN" / "ไทย"): **33×26px and 37×26px** — notably small and close together, raising mis-tap risk.
- Footer/menu social icons (Instagram, Facebook, Shopee, Lazada): **32×32px** each.

By contrast, product cards on the Collection page are a good example done right — the entire card (335×419px on mobile) is one large tappable target ("View Pleated Wide-Leg Trousers, Sand").

**Recommendation:** Increase the vertical padding on mobile menu nav links and the language toggle buttons to reach at least 44px tall (WCAG 2.5.5 / mobile platform guidance). Social icon hit areas can keep their 32px visual size but should have their tappable area padded out to ~44px via invisible padding, without changing the visual icon size — this preserves the minimal aesthetic while improving usability.

---

## Finding 4: Minor horizontal overflow on mobile (Home & About only)

**Severity:** Low

**Description / Evidence:** `document.documentElement.scrollWidth` vs `clientWidth` at 375px viewport:
- Home: 388px vs 375px client width → **13px of horizontal overflow**
- About: 388px vs 375px → **13px of horizontal overflow**
- Collection: 375px vs 375px → no overflow
- Contact: 375px vs 375px → no overflow

This means the Home and About pages can be scrolled/rubber-banded slightly sideways on mobile, which is a subtle but noticeable break in the otherwise very polished, whitespace-driven layout. It did not visibly clip any content in the screenshots, but the underlying element causing the extra 13px (likely something in the 3-column hero on Home, or a full-bleed image on About not accounting for the scrollbar/gutter) should be tracked down before launch, since horizontal scroll is a classic "cheap-looking" mobile bug that stands out on a quiet-luxury site.

**Recommendation:** Inspect for an element wider than 100vw (common culprits: a flex/grid row with `gap` but no `overflow-x: hidden` on a parent, or a full-bleed image/marquee container missing a negative-margin correction). Add `overflow-x: hidden` on `html`/`body` as a safety net regardless of the root cause.

---

## Finding 5: Cart drawer — fully designed and functional, correctly reflects pre-launch state

**Severity:** Info (no action needed — confirmed working as intended)

**Description / Evidence:** Triggered via the `[data-cart-open]` button in the nav on both desktop and mobile. On desktop (`cart-drawer-desktop.png`) it opens as a right-hand slide-over panel with a dimmed backdrop over the page; on mobile (`cart-drawer-mobile.png`) it correctly expands to a full-width/full-height panel. Both show a clean "CART" header, a close (×) button, an "Your cart is empty." empty state, and a "BROWSE THE COLLECTION" CTA — consistent with the site's black-and-white, underline-link visual language. No overlapping elements, no layout breakage. As noted in the brief, checkout/payment is not wired to a real processor yet — this is expected pre-launch behavior, not a defect, and the drawer itself gives no false signal that payment is live.

**Recommendation:** None for the drawer UI itself. Before public launch, confirm the "BROWSE THE COLLECTION" empty-state CTA and the eventual checkout CTA both make it unambiguous that payment/ordering isn't live yet, if the site goes public before that is wired up.

---

## Finding 6: Scroll-triggered reveal animations can appear as "blank sections" to naive full-page screenshot tools — verified false alarm, but flag as a robustness risk

**Severity:** Info / Low (informational — for awareness of other automated tooling in this audit, plus one small hardening recommendation)

**Description / Evidence:** An initial full-page screenshot of `/about` (captured via a single `page.screenshot(full_page=True)` call without simulating scroll) showed the "How a piece gets made" section heading followed by a large empty gap, then another empty full-bleed color block, before the closing CTA banner — appearing as if the 4-step process content ("01 Pattern / 02 Cut / 03 Sew / 04 Number") and the 3-photo detail strip had failed to render or load.

This was investigated further: raw HTML confirms the content **is** present in the markup (all 4 process steps with real copy, all 3 images with correct `src` and descriptive `alt`). The elements use `data-reveal` / `data-reveal-group` attributes, indicating an IntersectionObserver-driven scroll-fade-in animation. Re-capturing with the page incrementally scrolled (simulating a real user) confirms every one of these elements transitions from its hidden initial state to `opacity: 1`, `transform: none`, class `is-visible` correctly — see `about-desktop-full.png`, which now shows the process steps and detail-strip photography rendering exactly as intended. **This is not a live bug for real visitors.**

It is worth flagging for two reasons:
1. Any other automated tool in this audit (or third-party SEO grader, social-preview generator, or scraper) that takes a single non-scrolling full-page screenshot or renders the DOM without dispatching scroll/intersection events may falsely report "thin content" or a "broken section" on `/about`. If another finding in this audit describes an empty/broken About page section, it should be disregarded/superseded by this finding.
2. There is inherent fragility in gating real content visibility behind JS/IntersectionObserver: if the reveal script fails to execute (JS error, aggressive ad/privacy blocker, or a user with JavaScript disabled) and the initial CSS state is `opacity: 0`, that content could remain permanently invisible with no fallback.

**Recommendation:** No urgent action — confirmed working for real users on both viewports. As a hardening measure, consider a CSS-only fallback (e.g. a `<noscript>` style override, or gating the initial hidden state behind a `.js-enabled` class added by an early inline script) so `data-reveal` content degrades to always-visible rather than always-hidden if the reveal script never runs. Also worth respecting `prefers-reduced-motion` if not already handled.

---

## Finding 7: General mobile responsiveness and layout — PASS

**Severity:** Info

**Description / Evidence:**
- Viewport meta confirmed present and correct on all 4 pages: `width=device-width, initial-scale=1`.
- Base body font size on mobile: `16px` on all pages — meets the 16px+ readability guideline, no pinch-zoom needed.
- Multi-column desktop layouts (3-column hero, 4-column collection grid, 2-column about sections) collapse cleanly to single-column stacks on mobile with no overlapping elements, no text clipping/overflow, and images scale/crop correctly across both viewports on all 4 pages and in the full-page scroll-through captures.
- Navigation is accessible on mobile via a hamburger menu (44×44px icon, opens a full-panel `menu-dialog` with nav links, language toggle, and contact/social links).
- Visual identity (black-and-white palette, warm off-white background, serif display type + sans-serif body, generous whitespace, full-bleed editorial photography) is consistent across every page and viewport — reads as intended "quiet luxury," no jarring inconsistencies found.

**Recommendation:** No action needed beyond the specific items in Findings 2–4 above.

---

## Summary Table

| # | Finding | Severity |
|---|---|---|
| 1 | Above-the-fold H1 + CTA visible on all pages, desktop & mobile | Info (Pass) |
| 2 | Home hero carousel (8 images) has empty `alt=""` despite being primary content photography; nav/footer social icons' bare `alt` is a false-positive, not a real issue | Medium (hero images) / Info (icons) |
| 3 | Mobile menu nav links (35px), language toggle (26px), social icons (32px) below 44px touch-target guidance | Low |
| 4 | 13px horizontal overflow on mobile for Home and About (not Collection/Contact) | Low |
| 5 | Cart drawer fully functional and on-brand on desktop + mobile; empty state and CTA correct for pre-launch | Info (Pass) |
| 6 | About page "How a piece gets made" section is scroll-reveal driven; renders correctly for real users but can false-flag in naive full-page-screenshot/crawl tools | Info / Low (hardening) |
| 7 | Overall mobile responsiveness, viewport meta, base font size, layout collapse | Info (Pass) |
