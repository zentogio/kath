---
name: Studio Kath
description: A hand-cut, small-batch clothing studio's home online — quiet luxury in black and white, with color-true photography.
colors:
  ink: 'oklch(20% 0.006 25)'
  ink-soft: 'oklch(30% 0.006 25)'
  accent: 'oklch(38% 0.15 25)'
  accent-ink: 'oklch(30% 0.15 25)'
  paper: 'oklch(98.6% 0.003 25)'
  paper-sunk: 'oklch(96% 0.004 25)'
  graphite: 'oklch(40% 0.008 25)'
  graphite-soft: 'oklch(62% 0.008 25)'
  border: 'oklch(89% 0.006 25)'
  border-strong: 'oklch(78% 0.007 25)'
typography:
  display:
    fontFamily: "'Libre Caslon Display', Georgia, 'Times New Roman', serif"
    fontSize: 'clamp(2.75rem, 1.6rem + 4.5vw, 5.5rem)'
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: '-0.02em'
  body:
    fontFamily: "'Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.55
---

# Design System: Studio Kath

## 1. Overview

**Creative North Star: "The Tailor's Chalk Line"**

Studio Kath's visual system takes its cue from the cutting table, not the sale rack: a disciplined black-and-white *interface* wrapped around full-color *photography*. UI chrome — nav, type, buttons, borders — stays achromatic, the way a tailor's workroom stays neutral so the cloth can be the color in the room. The garments are the color; the frame around them is not. A single accent, Oxblood Thread, appears only where it means something, the way a hand-stitched thread of color shows up at a seam.

This system explicitly rejects the discount-marketplace register named in PRODUCT.md: no promo banners, no coupon-code callouts, no crowded grids competing for the eye. Nothing here should read as mass retail. Motion is part of the craft story, not decoration bolted on afterward — it should feel considered and precise, never bouncy or gimmicky, and it must stay fast: lots of movement is welcome, but every frame has to hold 60fps.

**Key Characteristics:**
- Achromatic UI, color-true photography: chrome (nav, type, borders, buttons) runs Ink/Paper/Graphite; product and editorial photography renders in its real, natural color — never desaturated.
- One accent color, used sparingly and only with intent (badges, active/hover states, a rare emphasis mark) — never as a background wash.
- The brand mark is the actual Studio Kath wordmark lockup (a cropped PNG of the logo), not a CSS type recreation — inverted to paper-white wherever it sits on the dark ink surface (footer, mobile menu).
- Serif headlines (Libre Caslon Display, matching the character of the wordmark) paired with a quiet, restrained sans (Switzer) for everything read at length.
- Motion is choreographed but disciplined: scroll-driven reveals, native scroll-linked type/parallax effects, and confident transitions — always performant, always reducible.

## 2. Colors

Two-color UI system by design — near-black ink and near-white paper, with one accent reserved for meaning rather than decoration — layered under full-color photography that the UI deliberately does not touch.

### Primary
- **Ink Black** (`oklch(20% 0.006 25)`): dominant text and display color; the "chalk line" the whole system is drawn around. `ink-soft` (`oklch(30% 0.006 25)`) is the secondary-text step.

### Secondary
- **Oxblood Thread** (`oklch(38% 0.15 25)`): the single accent. Reserved for things that need to be noticed once, deliberately — a "limited" or "sold out" mark, an active nav state, a cart-count badge, a focus ring. Never a background fill.

### Neutral
- **Paper White** (`oklch(98.6% 0.003 25)`): dominant background. `paper-sunk` (`oklch(96% 0.004 25)`) sits under images while they load.
- **Graphite** (`oklch(40% 0.008 25)`): secondary text, dividers, disabled states — never light gray-on-white for body copy (contrast must stay ≥4.5:1). `border` / `border-strong` are the same family, lighter, for hairlines.

### Photography (outside the UI palette)
Product and editorial photography is **not** desaturated — it renders in its real, natural color, treated only with a light `contrast(1.03) saturate(1.05)` polish for consistency across source images. The achromatic rule governs interface chrome (nav, type, buttons, borders); it does not extend to imagery. Color photography against a black-and-white frame is the point: the clothes are the color in the room.

### Named Rules
**The One Thread Rule.** Oxblood Thread appears on no more than ~5% of any given screen's surface. If more than one thing on a page is trying to be "the accent," the accent has failed.
**The Frame, Not the Cloth Rule.** Achromatic discipline applies to UI chrome only. Photography always renders in true color — the frame is neutral so the garment can be the color.

## 3. Typography

**Display Font:** Libre Caslon Display — a refined, moderate-contrast transitional serif that shares the character of the existing STUDIO KATH wordmark, without tipping into a heavy Didone.
**Body Font:** Switzer — a quiet, restrained grotesk sans for everything functional.

**Character:** Serif carries the brand's voice at headline size — the same confidence as the wordmark; sans carries everything functional (body copy, labels, nav, cart UI) without competing for attention.

### Hierarchy
- **Display** (light–regular weight, `clamp(2.5rem, 6vw, 5.5rem)`, tight leading): hero statements, section openers — capped at a 6rem ceiling per house rule, never louder than that.
- **Headline** (regular weight, `clamp(1.75rem, 3vw, 2.75rem)`): section titles, product names on detail pages.
- **Title** (medium weight, `1.25–1.5rem`): card/product titles, subsection headers.
- **Body** (regular weight, `1rem–1.125rem`, 1.5–1.6 line-height, capped 65–75ch): descriptions, About copy, product details.
- **Label** (medium weight, `0.75–0.8125rem`, slight letter-spacing, uppercase sparingly): nav items, price tags, form labels, button text.

### Named Rules
**The One Voice Rule.** Serif is for things the brand *says* (headlines, statements); sans is for things the brand *does* (navigation, actions, prices). Don't mix them within the same line of text.

## 4. Elevation

Flat by default — Studio Kath doesn't lean on drop shadows to feel premium; it leans on space and restraint. Depth, where it exists at all, comes from layering (a product image over paper-white ground, a sticky nav with a hairline border) rather than shadow. The one exception: the cart drawer/panel may use a soft, ambient shadow purely to separate it from page content while open, not as a decorative flourish.

### Shadow Vocabulary
- **Ambient overlay** (`box-shadow: 0 8px 40px rgba(0,0,0,0.12)`, exact tuning TBD at implementation): the cart drawer and any modal only. Nowhere else.

### Named Rules
**The Flat-By-Default Rule.** No shadows on cards, buttons, or nav in their resting state. Shadow appears only as a functional separator for overlays, never as decoration.

## 5. Components

Components are described here at a directional level; exact CSS lands once real pages are built (this is a seed document).

### Buttons
- **Shape:** Sharp or minimally-rounded corners (`0–2px` radius) — softness reads as generic, not tailored.
- **Primary:** Ink Black background, Paper White text, generous horizontal padding, uppercase label-scale type with slight letter-spacing.
- **Hover / Focus:** A precise, fast transition (invert to outline, or a subtle scale/underline) — never a color-shift toward the accent; the accent is reserved per the One Thread Rule.
- **Secondary / Ghost:** Outline only (1px Ink Black border), transparent fill, fills solid on hover.

### Cards / Containers (product cards)
- **Corner Style:** Sharp (0px radius) — product photography is the focal point, not a rounded frame.
- **Background:** Paper White; no border by default, a hairline divider only where grid separation is needed.
- **Shadow Strategy:** None at rest (see Elevation).
- **Internal Padding:** Generous — let whitespace breathe around each product.

### Inputs / Fields (contact form)
- **Style:** Underline-only or hairline full-border, Paper White background, Ink Black text.
- **Focus:** Border/underline shifts to Oxblood Thread — one of the accent's few sanctioned appearances.
- **Error / Disabled:** Error text in Oxblood Thread; disabled fields drop to Graphite at reduced opacity.

### Navigation
- Sticky top nav on a translucent Paper White (blurred) background, three-column layout: Home/Collection on the left, the **Studio Kath brand mark centered**, About/Contact plus the cart icon on the right. The brand mark is the real logo image (cropped to its content bounding box), not CSS type. Links use Label-scale sans type; active/current page indicated by an Oxblood Thread underline, not a filled background. Below the nav breakpoint, the left slot becomes a hamburger trigger and the right slot keeps the cart icon — the logo stays centered via the same 3-column grid (`1fr auto 1fr`) regardless of viewport. Mobile menu opens as a full-screen overlay, not a cramped dropdown; the brand mark appears there too, inverted to paper-white via the `brand-mark--invert` utility since it sits on the dark ink surface.

### Cart Drawer (signature component)
- Slides in from the right as an overlay panel (see Elevation's one shadow exception). Line items show product image, name, price, quantity stepper. Checkout button is disabled/styled as "Coming soon" or routes to the Contact page — no live payment per PRODUCT.md scope.

## 6. Do's and Don'ts

### Do:
- **Do** keep UI chrome to Ink Black, Paper White, Graphite, and Oxblood Thread — nothing else, per the One Thread Rule.
- **Do** render all photography in true, natural color — never grayscale/desaturated — per the Frame, Not the Cloth Rule.
- **Do** let product photography and whitespace carry visual weight; restraint is the luxury signal.
- **Do** make motion feel considered and precise — smooth 60fps, purposeful easing, never bouncy or elastic.
- **Do** provide a `prefers-reduced-motion` fallback for every animation.
- **Do** keep body text contrast ≥4.5:1 against Paper White — Graphite, not light gray.

### Don't:
- **Don't** design anything that reads as a discount marketplace (Shopee/Lazada-style): no promo banners, no coupon-code callouts, no cluttered competing grids — carried directly from PRODUCT.md's anti-reference.
- **Don't** use the accent color as a background wash or on more than ~5% of a screen.
- **Don't** add drop shadows to cards, buttons, or resting-state nav.
- **Don't** fake urgency with countdown timers or manufactured scarcity — PRODUCT.md is explicit that scarcity must read as real.
- **Don't** wire the cart to real payment — it's a designed UI only at this stage.
