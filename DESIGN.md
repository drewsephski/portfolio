---
name: Pontail
description: A premium proof-led portfolio for Drew Sepeczi's shipped software and interface work.
colors:
  canvas-black: "#080808"
  raised-black: "#101010"
  inset-black: "#111111"
  modal-black: "#0c0c0c"
  warm-white: "#f1f1ef"
  pure-white: "#ffffff"
  body-gray: "#93938e"
  quiet-gray: "#777773"
  dim-gray: "#656561"
  hairline-gray: "#292929"
  control-gray: "#3a3a37"
  signal-lime: "#c8f55f"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(54px, 7.2vw, 92px)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(28px, 3.5vw, 42px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(20px, 3vw, 27px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.12em"
rounded:
  square: "0px"
  preview: "4px"
  dialog: "8px"
  circle: "9999px"
spacing:
  xs: "6px"
  sm: "14px"
  md: "18px"
  lg: "28px"
  xl: "54px"
components:
  product-card:
    backgroundColor: "{colors.canvas-black}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.square}"
    padding: "28px"
  product-card-hover:
    backgroundColor: "{colors.raised-black}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.square}"
    padding: "28px"
  arrow-control:
    backgroundColor: "{colors.canvas-black}"
    textColor: "{colors.signal-lime}"
    rounded: "{rounded.circle}"
    size: "26px"
  arrow-control-hover:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.canvas-black}"
    rounded: "{rounded.circle}"
    size: "26px"
  preview-control:
    backgroundColor: "{colors.inset-black}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.preview}"
---

# Design System: Pontail

## Overview

**Creative North Star: "The Proof Wall"**

Pontail presents shipped products as a premium gallery of evidence. A near-black canvas, large neo-grotesque typography, disciplined hairline grids, and carefully staged product imagery let the work command attention without agency-style theatrics.

The system is restrained at rest and expressive in response. Its premium quality comes from exact spacing, scale, and kinetic detail: arrows lift with intent, imagery gains clarity and motion, and surfaces change tone without introducing decorative noise. Enhancement should sharpen this behavior while preserving the incumbent identity.

**Key Characteristics:**

- Near-black, warm-white, and calibrated gray hierarchy.
- Oversized, tightly tracked headlines with concise supporting copy.
- Square editorial grids and hairline structural borders.
- Product imagery as the dominant proof layer.
- Rare signal-lime accents reserved for meaningful interaction.
- Smooth, coordinated motion that respects reduced-motion preferences.

## Colors

The palette is almost monochromatic, using warm neutrals for hierarchy and one electric lime signal for directional interaction.

### Primary

- **Signal Lime** (#c8f55f): Reserved for directional arrows and high-value interactive responses; its rarity makes it feel precise and premium.

### Neutral

- **Canvas Black** (#080808): The uninterrupted page background and default card surface.
- **Raised Black** (#101010): The restrained hover state for interactive cards.
- **Inset Black** (#111111): Preview and media surfaces contained within the canvas.
- **Modal Black** (#0c0c0c): The screenshot dialog surface.
- **Warm White** (#f1f1ef): Primary text and high-confidence interface copy.
- **Body Gray** (#93938e): Descriptive product copy.
- **Quiet Gray** (#777773): Secondary labels, descriptions, arrows, and footer content.
- **Dim Gray** (#656561): Indices and deliberately recessive metadata.
- **Hairline Gray** (#292929): The primary grid, divider, and boundary color.
- **Control Gray** (#3a3a37): Resting borders for compact controls.

### Named Rules

**The Rare Signal Rule.** Signal Lime belongs to small, meaningful interaction cues; never spread it across large surfaces or decorative gradients.

**The Warm Hierarchy Rule.** Prefer the established warm whites and green-gray neutrals over cold pure grays; pure white is an interaction peak, not the default.

## Typography

**Display Font:** Arial (with Helvetica and sans-serif fallbacks)  
**Body Font:** Arial (with Helvetica and sans-serif fallbacks)

**Character:** A single utilitarian neo-grotesque family creates authority through scale, weight, and tracking rather than font novelty. Display typography is expansive and tightly tracked; supporting text stays compact and highly legible.

### Hierarchy

- **Display** (500, `clamp(54px, 7.2vw, 92px)`, 0.94): Hero statements; keep to approximately 13 characters per line and use balanced wrapping.
- **Headline** (500, `clamp(28px, 3.5vw, 42px)`, 1): Product names inside the proof grid.
- **Title** (400, `clamp(20px, 3vw, 27px)`, 1.2): Interface-study names.
- **Body** (400, 14px, 1.55): Product descriptions, generally limited to 40–48 characters per line.
- **Label** (600, 11–13px, 0.08–0.12em, uppercase): Eyebrows, section headings, product types, and compact metadata.

### Named Rules

**The Scale Before Ornament Rule.** Create hierarchy with size, weight, tracking, and whitespace before introducing color or decoration.

## Layout

The primary container is capped at 1120px with 32px desktop gutters. Large vertical intervals separate navigation, hero, products, studies, and footer; the system should feel deliberate and unhurried rather than sparse by accident.

The product proof wall is a two-column grid with shared hairline borders and equal-height content rows for metadata, title, description, visual, and CTA. Product cards use 28px padding and a 14px row rhythm. Interface studies pair a fixed 168px preview with flexible copy. At 700px and below, the container uses 20px gutters, grids collapse to one column, product cards use 22px padding, study previews narrow to 104px, and supporting layouts stack without losing hierarchy.

## Elevation & Depth

The system is flat at rest and lifted through interaction. Page structure comes from tonal layering, hairline borders, product-image depth, and controlled opacity rather than persistent shadows. Shadows and blur are reserved for modal separation and small premium interaction cues.

### Shadow Vocabulary

- **Signal Lift** (`0 5px 18px rgb(200 245 95 / 18%)`): A small glow beneath an activated lime arrow control.
- **Modal Depth** (`0 32px 100px rgb(0 0 0 / 72%)`): Strong separation for the screenshot dialog above a blurred dark backdrop.
- **Focus Line** (`0 2px 0 #fff`): A precise keyboard-focus indicator on study links.

### Named Rules

**The Flat-at-Rest Rule.** Surfaces stay flat until state or hierarchy requires depth; shadows must communicate interaction or modal layering.

## Shapes

The core silhouette is square and architectural. Product cards, grids, navigation, and content boundaries use zero radius and one-pixel rules. Small media previews use a restrained 4px radius, dialogs use 8px, and circular geometry is reserved for arrow and close controls. Rounded containers should never soften the primary proof grid.

## Components

### Product Cards

- **Character:** Editorial proof panels with product imagery staged as the focal evidence.
- **Corner Style:** Square (`0px`).
- **Background:** Canvas Black at rest; Raised Black on hover and keyboard focus.
- **Border:** Shared 1px Hairline Gray grid.
- **Internal Padding:** 28px desktop and 22px mobile.
- **Behavior:** Image opacity rises and the visual lifts slightly; CTA text sharpens while the lime arrow fills and moves diagonally.

### Directional CTA

- **Character:** Restrained copy paired with a precise kinetic signal.
- **Shape:** 26px circular arrow control with a 1px Control Gray border.
- **Default:** Quiet gray label and lime arrow on the canvas.
- **Hover / Focus:** Label brightens and gains visual weight; the control fills lime, gains a restrained glow, and translates up and right with a slight rotation.

### Interface Study Rows

- **Character:** Compact index rows that balance visual evidence with direct navigation.
- **Structure:** Fixed-ratio screenshot preview, flexible name and description, trailing horizontal arrow.
- **Hover / Focus:** Screenshot saturation increases; arrow brightens and moves horizontally. Keyboard focus is expressed with a crisp white underline or outlined preview.

### Navigation

- **Character:** Quiet utility framing the work rather than competing with it.
- **Typography:** 13px with a semibold wordmark and muted navigation links.
- **States:** Links transition from Quiet Gray to white; focus uses the same visible high-contrast response.
- **Mobile:** Secondary study navigation is removed when space becomes constrained, while products, portfolio, and contact remain available.

### Screenshot Dialog

- **Character:** A cinematic inspection surface for interface studies.
- **Shape:** 8px dialog radius, 4px image-frame radius, and a circular close control.
- **Depth:** Deep modal shadow above a 76% black blurred backdrop.
- **Motion:** Short fade, lift, and scale response with discrete dialog transitions.

## Do's and Don'ts

### Do:

- **Do** preserve the near-black canvas, warm neutral hierarchy, and square proof grid.
- **Do** let product imagery and shipped-work copy provide the visual interest.
- **Do** coordinate hover motion across text, arrow, image, and surface as one response.
- **Do** use Signal Lime rarely and at compact scale for meaningful interaction.
- **Do** preserve visible keyboard focus and reduced-motion behavior whenever animation is enhanced.
- **Do** improve premium perception through spacing, timing, easing, and alignment before adding decoration.

### Don't:

- **Don't** replace the incumbent system with glossy startup gradients, glassmorphism, playful illustration, or decorative clutter.
- **Don't** round the primary product grid or turn every surface into a floating card.
- **Don't** use lime as a large background, ambient wash, or repeated decorative accent.
- **Don't** add motion that is constant, disconnected from user intent, or necessary for comprehension.
- **Don't** fabricate awards, testimonials, client logos, benchmarks, or product proof.
