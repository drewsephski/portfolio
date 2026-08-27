# Infranex Buttons and Cards Refinement Specification

## Overview
- **Target files:** `app/infranex/infranex-hero.tsx`, `app/infranex/hero.module.css`, `app/infranex/infranex-capabilities.tsx`, `app/infranex/capabilities.module.css`, `app/infranex/infranex-conversion.tsx`, `app/infranex/conversion.module.css`
- **Reference screenshot:** `docs/design-references/infranex.framer.ai/reference-desktop-hydrated.png`
- **Interaction model:** hover-driven buttons; static layered cards; existing scroll reveals remain unchanged.

## Button Structure and Exact Styles

### Compact alternative button (nav and pricing)
- Outer link: `position: relative`, `display: flex`, `height: 44px`, `border-radius: 8px`, `border: 1px solid rgba(255,255,255,.12)`.
- Inner title wrapper: `height: 44px`, `padding: 10px 34px`, `border-radius: 8px`, `overflow: hidden`, flex centered.
- Background overlay: absolute inset, `linear-gradient(180deg,#fff 0%,rgba(255,255,255,.32) 100%)`, opacity `.16`.
- Text: duplicated vertical track, white uppercase Rubik label, 10px, medium weight. Hover translates one label-height upward with a smooth cubic easing.

### Primary button (hero and CTA)
- Outer: black, `height: 58px`, `border-radius: 9px`.
- Inner: `padding: 17px 41px`, `border-radius: 9px`.
- Exact shadow stack: `rgba(255,255,255,.06) 0 -12px 16px inset, rgba(255,255,255,.16) 0 4px 16px inset, rgba(255,255,255,.12) 0 .75px .25px inset, rgba(255,255,255,.32) 0 .25px .25px inset, rgba(0,0,0,.06) 0 40px 24px, rgba(0,0,0,.08) 0 23px 14px, rgba(0,0,0,.12) 0 10px 10px, rgba(0,0,0,.19) 0 3px 6px, rgba(0,0,0,.56) 0 0 0 .75px`.
- Two absolute overlays: centered black radial gradient at opacity `.32`; white-to-transparent vertical gradient at opacity `.16`.
- Label and arrow each have clipped duplicate vertical tracks. On hover both tracks translate upward by one item. Preserve exact `dvNbIo7IbmzkaOdtCN5qcUchpM.svg` arrow asset.

### Outline action button (learn more)
- Outer: `height: 54px`, `padding: 1px`, `background: rgba(255,255,255,.12)`, `border-radius: 9px`.
- Inner: `height: 52px`, `padding: 14px 24px`, same radius and a white-to-32%-white overlay at `.16` opacity.
- Duplicated clipped text and arrow tracks move vertically on hover.

## Card Structure and Assets

### How-it-works cards
- Desktop row: three columns, 20px gap. Each card is about `399.33px × 410px`, `padding: 25px 25px 32px`, `border-radius: 16px`, `overflow: hidden`.
- Full-card background layer: `public/infranex-live/qiM3KKH1kz79AFK3sIAsnEZrcA.svg`, absolute inset, 100% width/height, radius 16px.
- Product media for card one: `WZaTQrTQXTQLxzaYPeajVLuOM.png`, about `349.33px × 213.39px`, radius 14px, with `0 4px 32px rgba(0,0,0,.32)` twice and `0 16px 16px rgba(0,0,0,.32) inset`.
- Card two uses `4pqPEybK047t1CUEhnDxM8bw1E.webp`. Card three should not repeat card one as foreground media if the live state has no visible product image.

### Feature cards
- Use the same `qiM...svg` full-card background layer rather than a generic CSS gradient.
- Primary dashboard asset is `GDjODqPtfNZgQeT0MPGXvrBCf3c.webp`; preserve each existing card variant/crop but layer the real frame asset below it.

### Pricing cards
- Each desktop card is about `399.33px × 541px`, 16px radius, 1px frame.
- Use `qiM...svg` as the standard card background. The middle highlighted card uses `KuGkEyS7Y3JaD73Q6ZxG813Zc.png` as its distinct full-card background.
- Feature checks use `Qyi72qIWX0sWmpKMyTcDDxp4s.svg`, not text glyphs.

### Blog image cards
- Image wrapper: about `399.33px × 329.44px`, padding 1px, radius 24px, overflow clipped.
- Inner: padding 11px, radius 24px. Background layer is `GPnLmwqasR5tALdVnBfggdRGdRA.png`; post image sits above it.

## Responsive Behavior
- Desktop reference is 1440px; content max-width is 1238px.
- Mobile remains stacked, cards full width, and button text must stay on one line.
- Preserve existing reduced-motion behavior and reveal animations.

## Text Content
- Keep all current verbatim Infranex text. Only visual structure/styles/assets change.
