import type { Guide } from "../types";

export const buyVsBuildGuide: Guide = {
  slug: "buy-nextjs-landing-template-vs-build-from-scratch",
  title: "Buy a Next.js landing template or build from scratch?",
  description:
    "When founders should buy a Next.js landing template, assemble free blocks, use Framer, or design a SaaS marketing site from scratch—and what each path costs in time and polish.",
  h1: "Should you buy a Next.js landing page template or build your SaaS marketing site from scratch?",
  directAnswer:
    "Build from scratch only when the homepage is your core product experiment. For most AI and SaaS launches, a premium Next.js template or a focused hero study gets you to credible polish in days—not weeks—without paying for auth, billing, or agency rates.",
  eyebrow: "Buy vs build",
  published: "2026-09-23",
  sections: [
    {
      id: "four-paths",
      heading: "Four realistic paths (not a false binary)",
      paragraphs: [
        "The debate is rarely “hire a designer” vs “white screen.” Founders usually choose between four paths: a blank create-next-app repo, free component paste (shadcn, Launch UI, Magic UI snippets), a paid marketing template or hero study, or a no-code surface like Framer while the product stays in Next.js.",
        "Each path optimizes for something different. Free blocks optimize for learning and control. Templates optimize for time-to-credible and conversion structure. Framer optimizes for marketer-owned edits. Custom build optimizes for uniqueness when you already know exactly what story the page must tell.",
      ],
      table: {
        caption: "Quick comparison",
        headers: ["Path", "Best when", "Watch out for"],
        rows: [
          [
            "Blank Next.js app",
            "You enjoy layout work and have reference sites to copy",
            "Weeks of micro-decisions before the page feels “real”",
          ],
          [
            "Free block libraries",
            "You only need a hero + pricing and can wire sections yourself",
            "Visual sameness; motion and hierarchy still on you",
          ],
          [
            "Premium template / hero study",
            "Launch deadline; you want designer-level craft in source you own",
            "Pick marketing templates—not SaaS boilerplates with auth you will not use",
          ],
          [
            "Framer / Webflow first",
            "Non-engineers will own copy and layout after launch",
            "Migration cost if the app team standardizes on Next.js later",
          ],
        ],
      },
    },
    {
      id: "when-build",
      heading: "When building from scratch still makes sense",
      paragraphs: [
        "Scratch is rational when the marketing page is the product: interactive demos, novel data viz, or a workflow that is inseparable from the hero. It also makes sense when you already have a design system from a prior raise and a designer in the loop weekly.",
        "If you know React well, scratch feels virtuous—but launch calendars rarely reward virtue. Indie Hackers threads still show founders buying templates because the last 20% of polish (spacing, motion, responsive edge cases) eats the schedule.",
      ],
      bullets: [
        "You have Figma parity and a fixed launch narrative already approved",
        "The homepage IS the product experience (not just positioning)",
        "You will reuse the same layout system across many subpages immediately",
      ],
    },
    {
      id: "when-buy",
      heading: "When a template or hero study is the better trade",
      paragraphs: [
        "Buy when your bottleneck is credibility, not capability. Investors, design-sensitive users, and comparison shoppers decide in seconds whether your AI product looks like a side project. A complete template gives you section rhythm—social proof, feature story, pricing, FAQ—without debating order from zero.",
        "Hero-only purchases fit when the rest of your site already exists (docs, blog on another stack) but the above-the-fold must carry the brand. Interface studies in the $39–$79 band on this site are built for that: one cinematic surface you drop into App Router, retheme, and ship.",
      ],
      bullets: [
        "Launch in weeks, not months, with production-ready Tailwind + motion",
        "You need a dark, cinematic AI aesthetic without cloning another shadcn landing",
        "Engineering time should go to the app, not marketing CSS",
      ],
    },
    {
      id: "decision-tree",
      heading: "A simple decision tree",
      paragraphs: [
        "Start with who edits the page after day one. If marketers need autonomy, weigh Framer or Webflow (see the stack comparison guide). If engineers own the surface and deploy on Vercel, stay in Next.js—but do not start from an empty page unless you budget design time explicitly.",
        "Next ask whether you need a full journey or only the first screen. Full journeys → complete templates like Infranex or DreamMotion. First screen only → an interface study (Equilibrium, Palomar, Vesper, Nexora, and others on the catalog).",
      ],
    },
  ],
  faqs: [
    {
      question: "Is a premium landing template worth it if I already know React?",
      answer:
        "Knowing React gets you a working layout; it does not automatically buy hierarchy, motion, and section pacing. Templates trade cash for the weeks you would spend tuning typography and responsive breakpoints. If your hourly rate for product work is higher than the template price, buying is usually rational.",
    },
    {
      question: "Do indie hackers still buy landing page templates?",
      answer:
        "Yes—especially for launches where the founder is solo and the homepage must look agency-grade. Many teams pair a template or hero study for marketing with a separate boilerplate for the signed-in app.",
    },
    {
      question: "When is create-next-app enough?",
      answer:
        "When your audience tolerates a plain page, you have almost no visual competition, or you are validating demand before investing in brand. Once you compare against polished AI SaaS sites, a designed starting point saves rework.",
    },
    {
      question: "Template vs copying shadcn / Magic UI blocks?",
      answer:
        "Blocks are great for dashboards and UI-heavy apps. Marketing pages need narrative flow between sections; pasting blocks often yields a disjointed scroll. Templates encode that flow; block libraries encode components.",
    },
  ],
  relatedSlugs: [
    "premium-nextjs-template-vs-free-shadcn-starters",
    "landing-template-vs-saas-boilerplate",
    "nextjs-vs-framer-vs-webflow-saas-marketing",
    "premium-nextjs-hero-section-40-80",
  ],
  primaryCta: {
    label: "Browse interface studies",
    href: "/#studies",
    note: "Hero-level Next.js surfaces from $39",
  },
  secondaryCtas: [
    { label: "See complete templates", href: "/#templates" },
    { label: "Preview Infranex", href: "/infranex" },
  ],
};
