# HeaderHero Specification

## Overview
- Target: `app/dreammotion/header-hero.tsx`
- Screenshot: `docs/design-references/dreammotion/desktop-1440-animated.png`
- Interaction: fixed navigation, anchor clicks, time-driven model marquee.

## Structure and content
- Header wordmark: `DreamMotion`.
- Links: `Feature`, `Usecases`, `Gallary`, `Pricing`, `Blogs`; right pill `Sign Up`.
- Hero heading: `DreamMotion turns prompts into cinematic visuals`.
- Body: `Create polished AI images and short videos for ads, social posts and more.`
- CTA: `Start Creating`.
- Marquee caption: `The best AI image and video models in one creative workspace.`
- Models: Veo 3.1, Ideogram, Runway, Luma, Flux, Gemini.

## Exact visual values
- Page background `rgb(10,10,10)`; foreground white; muted `rgb(133,133,133)`.
- Display face: Instrument Serif; UI face: Satoshi with sans-serif fallback.
- Desktop hero is about 936px tall including marquee; image fills width with bottom black vignette.
- Desktop H1 is centered and narrow, Instrument Serif, approximately 64px/0.95.
- Mobile H1 computed at 40px/48px and 343px wide.
- Desktop content max-width 1080px; header inset 24px; pill radius 999px.
- Hero artwork: `/dreammotion/assets/4911cb7de867c47e.png`.

## Responsive
- At 390px: hide text navigation and Sign Up, hero height 640px, H1 40/48, horizontal padding 24px.
- At 768px: use the compact/mobile content arrangement.
