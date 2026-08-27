# ProductCapabilities V2 Specification

## Overview
- Target files: `app/infranex/infranex-capabilities.tsx`, `app/infranex/capabilities.module.css`
- Reference y=1702.969..5828.594 desktop
- Interaction model: viewport reveal, Lottie-like CSS/SVG motion, hover cards, time-driven logo marquee

## Exact section geometry
- How It Works: 846.406 desktop / 1436.953 mobile.
- Features: 1262.406 / 1696.797.
- Why Choose: 964.406 / 1948.797.
- Integration: 1052.406 / 629.922.
- Padding exactly 100px desktop, 60px mobile. Max content width 1200.
- Heading: Inter Display 40px desktop; 24px/28.8 mobile. Card title 18px/25.2. Background #0a0a0a.

## Real assets
- Shared card background `/infranex-live/qiM3KKH1kz79AFK3sIAsnEZrcA.svg`.
- How It Works product UI: `WZaTQrTQXTQLxzaYPeajVLuOM.png`, `4pqPEybK047t1CUEhnDxM8bw1E.webp`.
- Features large dashboard: `GDjODqPtfNZgQeT0MPGXvrBCf3c.webp`.
- Why icons: `z4Kb...svg`, `IQUx...svg`, `ez2...svg`, `9Xgo...svg`, `0Ay...svg`, `g35...svg`.
- Integration logos: bHy..., 6dX..., xf1..., xET..., dtN..., wO4..., 86y..., j0F..., DFC..., nG3..., o9X..., u2P..., vxO..., MZw..., BLa..., yl0..., Duw....

## Content/layout
- Preserve exact current copy from the live page.
- How It Works desktop: 3 equal cards with actual image layered over shared SVG; mobile stacked.
- Features desktop: one large image card then four product cards in source topology; mobile stacked exactly in captured order.
- Why Choose: 3x2 exact icon cards; mobile single column.
- Integrations: two continuously moving alternating logo rows, edge masks, Explore All button.

## Behaviors
- Headings/cards start opacity 0 translateY(24px), enter at IntersectionObserver threshold .15 over .7s cubic-bezier(.16,1,.3,1), stagger 70ms.
- Card hover border brightens and actual image scales 1.025.
- Decorative Lottie replacements must animate using the actual SVG layers: rotate, pulse, trace; never generic numbered circles.
- Integration rows translate continuously in opposite directions and pause on hover; reduced motion disables transforms.
