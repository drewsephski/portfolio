export type MarketplaceProduct = {
  slug: string;
  name: string;
  kind: "component" | "template";
  price: number;
  stripePriceId: string;
  description: string;
  screenshot: string;
};

const productCatalog = [
  { slug: "equilibrium", name: "Equilibrium", kind: "component", price: 39, stripePriceId: "price_1U9B5VDb3MpqRvArX8AGq9Xr", description: "Wellness for a steadier everyday life", screenshot: "/screenshots/equilibrium.webp" },
  { slug: "palomar", name: "Palomar", kind: "component", price: 49, stripePriceId: "price_1U9B5sDb3MpqRvArgOSaL9bC", description: "One unified system for LLMs", screenshot: "/screenshots/palomar.webp" },
  { slug: "axon", name: "Axon", kind: "component", price: 49, stripePriceId: "price_1U9B5nDb3MpqRvArwmR4W5AT", description: "Digital workers for mundane workflows", screenshot: "/screenshots/axon.webp" },
  { slug: "vesper", name: "Vesper", kind: "component", price: 69, stripePriceId: "price_1U9B5rDb3MpqRvArXoVhhLZo", description: "Operational AI infrastructure", screenshot: "/screenshots/vesper.webp" },
  { slug: "nexora", name: "Nexora", kind: "component", price: 79, stripePriceId: "price_1U9B5lDb3MpqRvArE5tm4l8q", description: "Automation for busywork", screenshot: "/screenshots/nexora.webp" },
  { slug: "next-layer-of-intelligence", name: "The Next Layer of Intelligence", kind: "component", price: 69, stripePriceId: "price_1U9B5mDb3MpqRvArPhKSQTva", description: "Infrastructure for scaling AI systems", screenshot: "/screenshots/next-layer-of-intelligence.webp" },
  { slug: "convix", name: "Convix Software", kind: "component", price: 59, stripePriceId: "price_1U9B5uDb3MpqRvArF7vpyiR4", description: "The future of PR agency operations", screenshot: "/screenshots/convix.webp" },
  { slug: "vantage", name: "Vantage", kind: "component", price: 79, stripePriceId: "price_1U9B5pDb3MpqRvArznAhvZlg", description: "A clear signal across every dashboard", screenshot: "/screenshots/vantage.webp" },
  { slug: "meridian", name: "Meridian", kind: "component", price: 59, stripePriceId: "price_1U9B5oDb3MpqRvArZCpl5434", description: "Revenue intelligence for SaaS", screenshot: "/screenshots/meridian.webp" },
  { slug: "infranex", name: "Infranex", kind: "template", price: 249, stripePriceId: "price_1U9B5qDb3MpqRvArJonX4okY", description: "A dark, cinematic AI SaaS template with a complete conversion journey.", screenshot: "/screenshots/infranex-hero.webp" },
  { slug: "salix", name: "Salix", kind: "template", price: 199, stripePriceId: "price_1U9B5tDb3MpqRvAr4I5gBufW", description: "A premium sales SaaS template with product storytelling and analytics.", screenshot: "/screenshots/salix-premium.png" },
  { slug: "dreammotion", name: "DreamMotion", kind: "template", price: 249, stripePriceId: "price_1U9B5vDb3MpqRvAr6cU4mXdL", description: "A cinematic AI image and video template with rich galleries and interactions.", screenshot: "/screenshots/dreammotion.webp" },
  { slug: "agentlab", name: "AgentLab", kind: "template", price: 299, stripePriceId: "price_1U9B5wDb3MpqRvArSAGcJcur", description: "A deep automation platform template with workflows, proof, and industry pages.", screenshot: "/screenshots/agentlab.webp" },
  { slug: "fusion-ai", name: "Fusion AI", kind: "template", price: 299, stripePriceId: "price_1U9B5wDb3MpqRvArdqX1lJ7O", description: "A polished AI automation template with motion, integrations, and social proof.", screenshot: "/screenshots/fusion-ai.webp" },
] satisfies MarketplaceProduct[];

export const marketplaceProducts: MarketplaceProduct[] = productCatalog;

export const marketplaceBySlug = new Map(marketplaceProducts.map((product) => [product.slug, product]));
