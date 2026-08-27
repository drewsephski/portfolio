# HeroOverview V2 Specification

## Overview
- Target files: `app/infranex/infranex-hero.tsx`, `app/infranex/hero.module.css`
- Reference: `docs/design-references/infranex.framer.ai/reference-desktop-hydrated.png`, pixels y=0..1703
- Interaction model: autoplay video, hover buttons, scroll-triggered counter reveal

## Exact geometry and styling
- Hero: 1440x1000 desktop; 390x655.734 mobile. Background video fills exact section with `object-fit: cover`, dark overlay.
- Nav max width 1200, 20px high logo, centered links; mobile collapses to logo + menu.
- Hero H1: Inter Display 54px desktop, 34px/37.4 mobile, centered; copy 14px; eyebrow Rubik 10px uppercase.
- Overview section: 702.969px desktop/625.375px mobile, black, 100px/60px vertical padding.
- All background `#0a0a0a`; white text; muted `rgba(255,255,255,.55)`; hairlines rgba white .1.

## Assets
- `/infranex-live/hero.webm` is the exact hero video.
- `/infranex-live/features.webm` is the exact overview background video, desktop 1440x700 and mobile 996px wide centered at x=-303.
- Logo `/infranex-live/Pfz7HDkRJDSNaoNeKKqjcirubo.svg`.
- Eyebrow icon `9MgzCqL6RYOVADFY6awtidfluA.svg`, arrows `dvNbIo7IbmzkaOdtCN5qcUchpM.svg`.
- Company marks: dY6g..., GO2..., ik68..., GQK4..., VPPD..., syEf....

## Content
Use the exact live navigation, hero, trust copy, overview statement, learn-more button, and metrics already captured in the current component/live DOM. Preserve duplicate button-label sliding spans.

## Behaviors
- Videos autoplay, loop, muted, playsInline.
- Buttons clip two vertically stacked labels; hover translates label track by -50% and arrow moves 3px.
- Nav links brighten on hover.
- Metrics animate from 0 on first viewport entry; reduced motion shows final values.

## Responsive
- Desktop/tablet retain full nav until 768px. Mobile hides link rail and main Get Started button, showing menu affordance.
- Logos remain horizontally clipped/moving on mobile.
