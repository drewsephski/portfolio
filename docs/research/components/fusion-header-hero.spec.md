# FusionHeaderHero Specification

## Overview
- Target: `app/fusion-ai/fusion-header-hero.tsx`
- Reference: `docs/design-references/fusionai.framer.website/desktop-top.png`
- Interaction: fixed navigation, load reveal, button/card hover.

## Exact desktop geometry
- Navigation: fixed, `height:116px`, `padding:28px`, `gap:10px`, transparent, top z-layer.
- Hero: `height:1499px`, `padding:210px 40px 40px`, black, overflow hidden.
- Content centered with pill, large white display heading, muted centered description, two pill CTAs.
- Dashboard artwork begins around y=863 and renders 1240x596.

## Content
- Brand: Fusion AI
- Nav: About us, Pricing, Integration, Blog, Contact, Waitlist, Get Started
- Eyebrow: Supercharge Your AI Workflows
- Heading: Automate Your AI Workflows with AI Agent
- Description: Connect your favorite apps, set triggers and watch AI handle the rest - no coding required. Get up and running in minutes.
- CTAs: Get Started - Free; View Pricing

## Assets
- `/fusionai/56fd11be3ac55ac2.png` hero dashboard.
- `/fusionai/5be44c708c65e8c7.png` circular mark.

## Responsive
- Mobile nav 96px, padding 16px. Hide desktop links and expose menu icon.
- Mobile hero: `height:637px`, `padding:150px 16px 50px`; dashboard composition is omitted/cropped below fold like source.
