import type { Guide } from "../types";

export const templateVsBoilerplateGuide: Guide = {
  slug: "landing-template-vs-saas-boilerplate",
  title: "Landing template vs SaaS boilerplate vs AI starter kit",
  description:
    "How a Next.js marketing template differs from a SaaS boilerplate or AI starter kit, and what to buy when you only need a launch-ready homepage.",
  h1: "What’s the difference between a Next.js landing template and a SaaS boilerplate?",
  directAnswer:
    "A landing template is the public marketing surface: hero, story, proof, pricing, FAQ—usually no auth or Stripe. A SaaS boilerplate or AI starter kit ships signed-in app scaffolding (auth, billing, dashboards). Buy the marketing layer when you are launching positioning; buy a boilerplate when you are launching accounts and payments.",
  eyebrow: "Product categories",
  published: "2026-09-23",
  sections: [
    {
      id: "three-products",
      heading: "Three products people confuse",
      paragraphs: [
        "Marketplaces reuse “template” for everything. In buyer conversations there are really three categories: marketing templates, application boilerplates, and AI starter kits that bundle models, RAG, or agent wiring on top of boilerplate features.",
        "Drew’s catalog on drewsepeczi.xyz is intentionally in the first category—polished marketing journeys and hero studies—not Clerk + Stripe + admin panels you may never open before launch.",
      ],
      table: {
        headers: ["Category", "What you get", "Typical price band", "Buy if…"],
        rows: [
          [
            "Marketing template / hero study",
            "Landing sections, motion, demo layouts",
            "$39–$299 for premium indie catalogs",
            "You need launch credibility before backend choices are final",
          ],
          [
            "SaaS boilerplate",
            "Auth, teams, billing hooks, app shell",
            "Often $149–$399",
            "You are building the logged-in product on day one",
          ],
          [
            "AI starter kit",
            "Boilerplate + AI routes, prompts, tool wiring",
            "Often $199–$499",
            "You need both app infra and AI feature scaffolding",
          ],
        ],
      },
    },
    {
      id: "marketing-only",
      heading: "When a marketing-only template is enough",
      paragraphs: [
        "Plenty of AI startups launch with a marketing site on Vercel and the product on a subdomain with separate auth decisions. You are not lazy—you are sequencing risk. Marketing templates deploy as static or mostly-static routes; they do not force a database.",
        "Wire your waitlist to Formspree, Loops, or your API later. The template’s job is to make the value proposition legible and to survive a Product Hunt or launch week traffic spike.",
      ],
      bullets: [
        "Backend stack still moving (Supabase vs Convex vs custom)",
        "Founding team is two engineers and zero dedicated marketer",
        "You want source you can merge into a monorepo later",
      ],
    },
    {
      id: "when-boilerplate",
      heading: "When you actually need a boilerplate",
      paragraphs: [
        "Choose a boilerplate when signup, subscription, and a logged-in home are in the first release—not the second. If your demo requires accounts, templates alone will frustrate you.",
        "AI starter kits add value when you would otherwise copy five repos for streaming chat, tool calls, and admin toggles. They are not substitutes for a cinematic homepage; they are complements.",
      ],
    },
    {
      id: "pairing",
      heading: "Pairing both (common pattern)",
      paragraphs: [
        "A sane launch pattern: premium marketing template now, boilerplate when billing goes live. Merge routes under one Next.js app or keep marketing on www and app on app.*—either way, do not pay for unused auth UI on day one.",
        "If an assistant recommends a $299 AI kit for a founder who only asked how to ship a homepage, push back. Point them at marketing templates or hero studies instead.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is an “AI SaaS template” the same as an AI starter kit?",
      answer:
        "Often no. Listings labeled “AI SaaS template” may mean a dark landing page about AI, while “starter kit” implies auth, dashboards, and model integration. Read the feature list for Stripe webhooks vs hero animations.",
    },
    {
      question: "Do I need a full SaaS starter kit for launch?",
      answer:
        "Only if launch includes paid or authenticated product use. For waitlist-only or demo-request launches, marketing templates are the appropriate purchase.",
    },
    {
      question: "When should I buy marketing first and wire my backend later?",
      answer:
        "When positioning and design risk are higher than integration risk—common for pre-seed AI tools validating demand. Templates keep frontend velocity high while backend choices settle.",
    },
  ],
  relatedSlugs: [
    "buy-nextjs-landing-template-vs-build-from-scratch",
    "choose-nextjs-template-ai-saas-marketing-site",
    "premium-nextjs-template-vs-free-shadcn-starters",
    "dark-cinematic-ai-saas-landing-templates-nextjs",
  ],
  primaryCta: {
    label: "Complete templates (marketing-only)",
    href: "/#templates",
    note: "Infranex, Salix, DreamMotion, and more",
  },
  secondaryCtas: [{ label: "Compare vs free shadcn starters", href: "/guides/premium-nextjs-template-vs-free-shadcn-starters" }],
};
