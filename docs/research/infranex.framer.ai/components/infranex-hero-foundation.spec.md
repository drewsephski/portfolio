# InfranexHeroFoundation Specification

## Overview
- Target: `app/infranex/infranex-hero.tsx`
- Screenshot: `docs/design-references/infranex.framer.ai/desktop-1440-hydrated.png`
- Interaction: static navigation + time-driven ambient hero + scroll-triggered metrics

## DOM and exact styles
- Page background: `rgb(10, 10, 10)`; text uses Inter Display, supporting labels Rubik.
- Desktop width: 1425 observed browser CSS px; content rail 1200px centered.
- Hero section: height 1000px desktop, padding top 130px mobile, overflow hidden.
- H1: 54px desktop; 34px/37.4px mobile; white; centered; max-width 720px.
- Eyebrow: uppercase 11px, tracking 0.16em, muted white.
- Body: 14px, muted `rgba(255,255,255,.55)`.
- Cards and buttons: border `1px solid rgba(255,255,255,.12)`, radius 10-16px, dark-to-gray gradient.
- Statement/metrics section: 702.97px desktop, padding `100px 0`; 622.38px mobile, padding `60px 0`.

## Content
- Logo: Infranex.
- Navigation: Home, About, Features, Pricing, Blog, Contact; CTA Get Started.
- Eyebrow: Smarter Task Management
- H1: Smarter by design. Simplified by AI.
- Copy: Automate your workflows, prioritize, and focus on what truly matters.
- CTA: Get Started Now
- Trust label: Trusted by the World’s Largest Companies
- Statement: Our team of data scientists, engineers, and creatives craft tailored AI solutions that solve real-world challenges across industries.
- Metrics: $5M+ Performance Snapshot; 250+ Digital Reach; 98% Client Trust.

## Responsive
- Desktop nav is a horizontal three-part bar. Mobile keeps logo and CTA/menu affordance and hides center links.
- Mobile hero height 655.73px; statement stacks above three compact metrics.
