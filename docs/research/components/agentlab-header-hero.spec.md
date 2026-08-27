# AgentLabHeaderHero Specification

## Overview
- Target file: `app/agentlab/agentlab-header-hero.tsx`
- Screenshot: `docs/design-references/agentlab.framer.ai/desktop-1440-01.png`
- Interaction model: time-driven marquee; click-driven mobile navigation.

## Exact visual contract
- Page width observed: 1425px. Nav: y 30px, height 74px. Hero: y 104px, height 1110px.
- Mobile nav: height 72px, padding 20px 20px 0. Hero: height 1427.67px, padding 100px 16px 48px.
- Fonts: Merriweather serif headings; Cabin uppercase controls; Inter body copy.
- Colors: white `#fff`, black `#000`, blue `#558bfb`, pale blue `#c4e4ff`.
- Hero headline: “Turn Your AI Product Into a Website That Sells”. Supporting copy and labels must be verbatim from extraction.
- Desktop nav links: Product, Case Study, Pricing, Company, Get started. Mobile collapses links.
- Media: local downloaded hero visual/video when available; blue abstract fallback panel remains layered behind agent UI.

## States
- Rolling buttons translate one line-height on hover over 250ms.
- Mobile menu toggles expanded link panel and updates `aria-expanded`.
- Marquee runs linearly and pauses for reduced motion.

## Responsive
- Desktop centers content in 1344px with 40px side padding.
- Mobile stacks copy, buttons, and media; headline scales to about 48px with tight line height.
