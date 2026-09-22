export const profile = {
  name: "Drew Sepeczi",
  location: "Chicago",
  eyebrow: "Software engineer · Chicago",
  aboutLabel: "Product engineer · Chicago",
  statement: "I design and build software people can actually use.",
  focus: "AI products, developer tools, and full-stack web apps.",
  focusContinued: "From the first useful workflow through production.",
  about:
    "I’m Drew, a product engineer in Chicago. I design and build AI products, developer tools, and full-stack software from early product decisions through production. I care about useful workflows, clear interfaces, and software people can confidently own.",
  availability: "Available for product engineering work.",
  email: "hello@drewsepeczi.xyz",
  emailHref: "mailto:hello@drewsepeczi.xyz",
  github: "https://github.com/drewsephski",
  linkedin: "https://linkedin.com/in/drewsepeczi",
} as const;

export const suggestedPrompts = [
  "What are his best AI projects?",
  "What does he build with?",
  "Tell me about Menace Voice",
  "How can I contact him?",
] as const;

export type FeaturedProject = {
  name: string;
  domain: string;
  category: string;
  description: string;
  slug: string;
  capture: string;
};

export const featuredProjects: readonly FeaturedProject[] = [
  {
    name: "Squid Agent",
    domain: "squidagent.app",
    category: "Developer tool",
    description: "Turn prompts, screenshots, and live sites into React prototypes with revision evidence.",
    slug: "squid-agent",
    capture: "squid-agent-20260824",
  },
  {
    name: "Menace Voice",
    domain: "voice.menaceui.com",
    category: "Voice AI platform",
    description:
      "Turn a brief into a voice agent. Shape the conversation, connect your tools, and bring it together in a visual workflow.",
    slug: "menace-voice",
    capture: "menace-voice-20260907-smooth",
  },
  {
    name: "Elsewhere",
    domain: "elsewhere-alpha-web.fly.dev",
    category: "Agent workspace",
    description:
      "Give AI workers their own computers, memory, routines, and approvals that keep working when you close the laptop.",
    slug: "elsewhere",
    capture: "elsewhere-20260922",
  },
  {
    name: "Menace UI",
    domain: "menaceui.com",
    category: "Components & templates",
    description:
      "Source-ready React interfaces with thoughtful motion, clear hierarchy, and the details that make a product feel finished.",
    slug: "menace-ui",
    capture: "menace-ui-20260907-smooth",
  },
];

export const selectedProducts = [
  {
    slug: "sitterfolio",
    name: "Sitterfolio",
    type: "SaaS product",
    description: "Pet sitters build polished websites and manage every inquiry in one workspace.",
    href: "https://www.sitterfolio.com",
    visual: "sitterfolio",
    preview: {
      mp4: "/assets/product-previews/sitterfolio-20260827.mp4",
      webm: "/assets/product-previews/sitterfolio-20260827.webm",
      poster: "/assets/product-previews/sitterfolio-20260827-poster.jpg",
    },
  },
  {
    slug: "vault-zero",
    name: "Vault Zero",
    type: "Voice AI",
    description: "AI receptionist answers missed calls while keeping customers connected to a human.",
    href: "https://vaultzero.dev",
    visual: "voice",
    preview: {
      mp4: "/assets/product-previews/vault-zero-20260824.mp4",
      webm: "/assets/product-previews/vault-zero-20260824.webm",
      poster: "/assets/product-previews/vault-zero-20260824-poster.jpg",
    },
  },
  {
    slug: "vault-zero-crm",
    name: "Vault Zero CRM",
    type: "AI workflow",
    description: "CRM researches businesses, checks buyer fit, and supports every recommendation with evidence.",
    href: "https://crm.vaultzero.dev",
    visual: "crm",
    preview: {
      mp4: "/assets/product-previews/vault-zero-crm-20260827.mp4",
      webm: "/assets/product-previews/vault-zero-crm-20260827.webm",
      poster: "/assets/product-previews/vault-zero-crm-20260827-poster.jpg",
    },
  },
  {
    slug: "squid-agent",
    name: "Squid Agent",
    type: "Developer tool",
    description: "Turns prompts, screenshots, and live sites into React prototypes with revision evidence.",
    href: "https://squidagent.app",
    visual: "agent",
    preview: {
      mp4: "/assets/product-previews/squid-agent-20260824.mp4",
      webm: "/assets/product-previews/squid-agent-20260824.webm",
      poster: "/assets/product-previews/squid-agent-20260824-poster.jpg",
    },
  },
  {
    slug: "squidcrawl",
    name: "SquidCrawl",
    type: "Developer API",
    description: "Scraper API gives AI agents clean page content instead of raw HTML.",
    href: "https://squidcrawl.dev",
    visual: "crawl",
    preview: {
      mp4: "/assets/product-previews/squidcrawl-20260824.mp4",
      webm: "/assets/product-previews/squidcrawl-20260824.webm",
      poster: "/assets/product-previews/squidcrawl-20260824-poster.jpg",
    },
  },
  {
    slug: "phoenix-design-lab",
    name: "Phoenix Design Lab",
    type: "Design system",
    description: "A design agency demo pairing bold art direction with an editorial portfolio.",
    href: "https://phoenixdev.agency/demo",
    visual: "design",
    preview: {
      mp4: "/assets/product-previews/phoenix-design-lab-20260827.mp4",
      webm: "/assets/product-previews/phoenix-design-lab-20260827.webm",
      poster: "/assets/product-previews/phoenix-design-lab-20260827-poster.jpg",
    },
  },
] as const;

export const capabilities = [
  {
    label: "PRODUCT DIRECTION",
    title: "Find the useful first move",
    description: "Turn an ambiguous idea into a focused workflow people can understand and own.",
    animation: "feature-prioritization.json",
  },
  {
    label: "AI SYSTEMS",
    title: "Intelligence with evidence",
    description: "Build AI features around clear inputs, reviewable outputs, and predictable fallbacks.",
    animation: "feature-automation.json",
  },
  {
    label: "FULL-STACK DELIVERY",
    title: "From interface to infrastructure",
    description: "Connect the product surface to reliable auth, data, billing, and deployment paths.",
    animation: "feature-planning.json",
  },
  {
    label: "PRODUCTION OWNERSHIP",
    title: "Ship, verify, improve",
    description: "Carry each release through responsive QA, observability, and the next real user signal.",
    animation: "feature-collaboration.json",
  },
] as const;
