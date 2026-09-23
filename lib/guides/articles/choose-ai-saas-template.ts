import type { Guide } from "../types";

export const chooseAiSaasTemplateGuide: Guide = {
  slug: "choose-nextjs-template-ai-saas-marketing-site",
  title: "How to choose a Next.js template for an AI SaaS marketing site",
  description:
    "A practical checklist for evaluating Next.js + Tailwind marketing templates for AI SaaS: stack, demo quality, sections, motion, licensing, and maintainability— with examples from a premium catalog.",
  h1: "How do I choose the right Next.js template for an AI SaaS marketing site?",
  directAnswer:
    "Filter on five checks before you pay: modern App Router + TypeScript stack, a live demo that matches your aesthetic, conversion sections you will not delete, motion that feels intentional (not noisy), and a license that covers commercial use. Open the repo structure—not just the screenshot.",
  eyebrow: "Buyer checklist",
  published: "2026-09-23",
  sections: [
    {
      id: "stack",
      heading: "Stack signals that age well",
      paragraphs: [
        "Prefer App Router, TypeScript, and Tailwind versions the template author actually maintains. Templates stuck on Pages Router or legacy CSS-in-JS cost migration tax the first time you add a server component or cache directive.",
        "Tailwind v4 is rolling through ecosystems; a template should not fight your config. Check whether tokens live in CSS variables you can remap to brand colors in an afternoon.",
      ],
      bullets: [
        "App Router layouts for marketing vs future app routes",
        "Type-safe content patterns (even if MDX is not required)",
        "Framer Motion or CSS motion with prefers-reduced-motion respect",
        "No secret env vars required to render the marketing page",
      ],
    },
    {
      id: "demo",
      heading: "Demo quality: spot slop before checkout",
      paragraphs: [
        "AI-generated marketplaces flooded cheap templates with identical gradients and lorem ipsum feature grids. Zoom the demo: typography hierarchy, spacing consistency, and mobile nav behavior.",
        "Ask whether the demo tells a product story or lists buzzwords. Strong AI SaaS pages show workflow, proof, and pricing tension—not twelve equal feature cards.",
      ],
      bullets: [
        "Hero communicates category + outcome in one glance",
        "Screenshots or UI mockups match credible product density",
        "Footer/legal links feel intentional, not bolted on",
      ],
    },
    {
      id: "sections",
      heading: "Sections a conversion-ready page still needs",
      paragraphs: [
        "You can trim sections later; you cannot invent social proof you never designed for. A good template reserves rhythm for logo strip, problem/solution, deep feature, integration or workflow, pricing or CTA, FAQ, and footer.",
        "AI SaaS often adds a “how it works” lane with three steps and an embed-friendly demo area. Confirm those exist or are easy to fork from an adjacent section.",
      ],
    },
    {
      id: "catalog-examples",
      heading: "Examples from this catalog (what each optimizes for)",
      paragraphs: [
        "Use live previews on drewsepeczi.xyz as reference points—not rankings.",
      ],
      table: {
        headers: ["Product", "Type", "Good fit when…"],
        rows: [
          [
            "Infranex",
            "Complete template",
            "You want a dark, cinematic AI infra story with a full scroll journey",
          ],
          [
            "DreamMotion",
            "Complete template",
            "Creative AI (image/video) needs galleries and rich media sections",
          ],
          [
            "Salix",
            "Complete template",
            "Sales/revenue SaaS narrative with analytics flavor",
          ],
          [
            "Vesper / Nexora",
            "Interface study",
            "You need a premium hero and will assemble lower sections yourself",
          ],
          [
            "Palomar / Axon",
            "Interface study",
            "LLM / agent positioning with strong above-the-fold craft",
          ],
        ],
      },
    },
    {
      id: "license",
      heading: "License and maintainability",
      paragraphs: [
        "Commercial use for your startup is table stakes. Client work rights matter if you are an agency. Redistribution of source as a competing template is usually prohibited—read once.",
        "Maintainability means you can bump Next.js without rewriting every component. Favor readable Tailwind over deep abstraction layers unless you want a design system course bundled with your launch.",
      ],
    },
  ],
  faqs: [
    {
      question: "What sections does a SaaS landing template need?",
      answer:
        "At minimum: hero with primary CTA, credibility (logos or metrics), problem/solution, feature depth, pricing or trial CTA, FAQ, and footer. AI products benefit from workflow steps and integration proof.",
    },
    {
      question: "How do I spot vibe-coded templates before buying?",
      answer:
        "Identical hero gradients, mismatched icon sets, broken mobile spacing, and generic AI copy on every section. Preview on a phone and scroll fast—slop shows up in inconsistent type scale.",
    },
    {
      question: "How important is App Router + TypeScript + Tailwind v4?",
      answer:
        "App Router + TypeScript is the default for new SaaS marketing on Next.js; skipping it buys debt. Tailwind major version matters for config and token strategy—prefer templates whose dependencies match what you will run in production.",
    },
  ],
  relatedSlugs: [
    "dark-cinematic-ai-saas-landing-templates-nextjs",
    "buy-nextjs-landing-template-vs-build-from-scratch",
    "cruip-tailwind-ui-magic-ui-vs-premium-nextjs-template",
    "landing-template-vs-saas-boilerplate",
  ],
  primaryCta: {
    label: "Preview Infranex",
    href: "/infranex",
    note: "Dark cinematic AI SaaS journey — $249",
  },
  secondaryCtas: [
    { label: "Preview DreamMotion", href: "/dreammotion" },
    { label: "All interface studies", href: "/#studies" },
  ],
};
