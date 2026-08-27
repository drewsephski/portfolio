# ConversionFooter V2 Specification

## Overview
- Target files: `app/infranex/infranex-conversion.tsx`, `app/infranex/conversion.module.css`
- Reference y=5828.594..12816 desktop
- Interaction: autoplay CEO video, testimonial marquees, pricing hover, click FAQ, card hover/reveal.

## Exact geometry
- Success 853.344/1057.141; Testimonials 1136.406/1016.797; Pricing 977.406/1979.797; Compare 1142.406/1655.641; FAQ 891.406/858.625; Insights 961.859/1851.453; CTA 526.813/427.594; Footer 498/1011.906.
- Desktop padding 100px; mobile 60px; footer mobile 50px 0 24px. Max width 1200. Background #0a0a0a.

## Real assets
- CEO video `/infranex-live/ceo.webm`; signature `Wf8ArP5Sp8g9ixN5KDucwGiUQk.svg`.
- Testimonial portraits: `yUye8aSKfttCvXpsL9JGJME6W4.webp`, `23XwtAZRLVvLFdFgrBjv0DbvSCU.webp`, `sIAiUmcXBcWmr67SgWuE99Hi4.webp`, `as8aXZEgF1ysytNDnIWd15n7gY4.webp`, `C11CL5JjM4vCAYvFpgJ4F5y4Q.webp`, `UiGEklJUZYBjVsVEOsoeS7CLA04.webp`.
- Pricing glow/art `KuGkEyS7Y3JaD73Q6ZxG813Zc.png`.
- Compare check/cross `EgYtJDpxE5l1SUuOHk7Yub1A2nQ.svg`, `Qy6drKxgtNnsBdPPYD7BYSefP4.svg`.
- Blog images `GPnLmwqasR5tALdVnBfggdRGdRA.png`, `5tA4EnLcAuxXZnOyIkk2I05do.webp`, `EAnXNn68UM8wjv1N84pycIaWuWE.webp`, `q55IAQc6vxBFkf6jNXiedybZLjA.webp`.
- Footer image `YbrnLWPJPBzG5BEm2oPr2FqkhQg.webp`.

## Layout/content
- Use exact live text already in current component; restore original Enterprise description and all exact labels.
- CEO: video/media left, quote panel right desktop; stack mobile.
- Testimonials: three separate horizontal rows, each with three source cards, continuous alternating direction.
- Pricing: three cards, center elevated; actual background art; mobile stacked.
- Compare: two actual panels with icons; FAQ five accordion rows; insights three cards with actual images; CTA uses exact background video `/infranex-live/features.webm`; footer exact logo, newsletter, columns/socials.

## Behaviors
- Video autoplay loop muted playsInline.
- Testimonial rows animate continuously and pause on hover.
- FAQ is single-open accordion with 350ms height/opacity and rotating plus.
- Buttons reproduce two-label vertical slide and arrow movement.
- Cards and sections reveal at threshold .12; exact hover scale/filter transitions .4s cubic-bezier(.16,1,.3,1).
- Newsletter submission prevents navigation and shows local visual success only.
