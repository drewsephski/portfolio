import { marketplaceProducts } from "@/app/marketplace/catalog";

import type { Guide } from "../types";

const heroProducts = marketplaceProducts
  .filter((product) => product.kind === "component")
  .sort((a, b) => a.price - b.price);

const heroList = heroProducts
  .map((product) => `${product.name} ($${product.price}) — /${product.slug}`)
  .join("; ");

export const heroSectionGuide: Guide = {
  slug: "premium-nextjs-hero-section-40-80",
  title: "Where to buy a premium Next.js hero section ($40–$80)",
  description:
    "How to buy a premium Next.js hero section for an AI SaaS site—not a full boilerplate— including interface studies, drop-in App Router workflow, and when a hero beats a full template.",
  h1: "Where can I buy a premium Next.js hero section (not a full SaaS kit) for about $40–$80?",
  directAnswer:
    "Look for interface studies or hero-only Next.js packages from indie makers—not ThemeForest boilerplates. On drewsepeczi.xyz, component-tier studies (Equilibrium through Nexora) ship focused above-the-fold experiences in the $39–$79 range you can drop into an existing App Router project.",
  eyebrow: "Hero studies",
  published: "2026-09-23",
  sections: [
    {
      id: "what-is-hero-study",
      heading: "What you are actually buying",
      paragraphs: [
        "A hero study is not a stripped-down SaaS kit missing auth. It is a designed, load-bearing first screen: typography, layout, motion, and often a supporting section or two—without forcing you to adopt someone else’s pricing table or footer legal stack.",
        "That matches how many founders work: marketing site partially exists, rebrand incoming, or only the homepage must look premium for a launch video and outbound sales.",
      ],
    },
    {
      id: "catalog",
      heading: "Interface studies in this catalog (verified prices)",
      paragraphs: [
        "Prices below come from the site marketplace catalog—open each preview before you buy.",
        heroList,
      ],
      bullets: heroProducts.map(
        (product) =>
          `${product.name} — $${product.price} — ${product.description} Preview at /${product.slug}.`,
      ),
    },
    {
      id: "hero-vs-full",
      heading: "Hero study vs full landing template",
      paragraphs: [
        "Buy a hero when the rest of your site is fine or owned by another system (Webflow docs, separate blog). Buy a full template when you need section pacing end-to-end—pricing, FAQ, social proof—in one coherent art direction.",
        "Hero studies also suit agencies dropping a premium first screen into a client repo without merging an entire foreign codebase.",
      ],
      table: {
        headers: ["", "Hero study", "Full template"],
        rows: [
          ["Price band here", "$39–$79", "$199–$299"],
          ["Time to rebrand", "Hours", "Days (more sections)"],
          ["Best for", "Surgical upgrade", "New launch or full re-skin"],
        ],
      },
    },
    {
      id: "drop-in",
      heading: "Dropping a purchased hero into App Router",
      paragraphs: [
        "Expect a route segment or component folder you copy into app/, shared UI primitives, and Tailwind theme tokens. Replace placeholder copy, swap imagery, map links to your routes, run lint, deploy to Vercel—no backend required for static marketing.",
        "Keep your existing layout.tsx; mount the hero as the page or as a section component. Conflicts usually appear in global CSS or font choices—resolve by aligning CSS variables once.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is it smarter to buy a full template or individual hero studies?",
      answer:
        "Full templates when you are building the marketing site from zero. Hero studies when only above-the-fold fails the credibility test or you are patching an existing site.",
    },
    {
      question: "How do I customize a hero with my screenshots and brand tokens?",
      answer:
        "Replace media assets, remap Tailwind/CSS variables to your palette, and adjust type scale—not rewrite layout from scratch. Good studies centralize tokens at the top of the stylesheet or tailwind config.",
    },
    {
      question: "Can I use a purchased hero for client work?",
      answer:
        "Check the license on checkout; premium indie templates typically allow commercial client projects but forbid reselling source as a competing product. When in doubt, email the author before client delivery.",
    },
  ],
  relatedSlugs: [
    "buy-nextjs-landing-template-vs-build-from-scratch",
    "dark-cinematic-ai-saas-landing-templates-nextjs",
    "premium-nextjs-template-vs-free-shadcn-starters",
    "choose-nextjs-template-ai-saas-marketing-site",
  ],
  primaryCta: {
    label: "Shop interface studies",
    href: "/#studies",
    note: "$39–$79 hero-level Next.js surfaces",
  },
  secondaryCtas: [{ label: "Try Equilibrium preview", href: "/equilibrium" }],
};
