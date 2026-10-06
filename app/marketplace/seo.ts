import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site";
import { marketplaceBySlug } from "./catalog";

const productCopy = {
  "equilibrium": "Launch a wellness brand with a calm hero, responsive layout, and editable React source.",
  "palomar": "Present your LLM platform with a polished AI hero, cinematic visuals, and editable React source.",
  "axon": "Showcase AI workflow automation with a bold hero, responsive design, and editable React source.",
  "vesper": "Market an AI infrastructure product with a dark hero, animated visuals, and editable React source.",
  "nexora": "Launch your automation product with a refined hero, responsive visuals, and editable React source.",
  "next-layer-of-intelligence": "Launch an AI infrastructure site with a responsive hero and editable source.",
  "convix": "Present PR agency software with a cinematic hero, dashboard preview, and editable React source.",
  "vantage": "Showcase a dashboard analytics product with a focused hero, responsive layout, and editable source.",
  "meridian": "Launch a SaaS revenue analytics site with a polished hero, responsive design, and editable source.",
  "infranex": "Launch an AI SaaS marketing site with cinematic visuals, feature sections, and a full conversion flow.",
  "salix": "Launch a sales SaaS marketing site with product storytelling, analytics visuals, and conversion sections.",
  "dreammotion": "Build an AI image and video marketing site with rich galleries, responsive sections, and interactions.",
  "agentlab": "Market an AI automation platform with workflow demos, industry sections, and a complete landing page.",
  "fusion-ai": "Launch an AI automation marketing site with motion, integrations, social proof, and editable source.",
};

export type ProductSlug = keyof typeof productCopy;

export function productSeoDescription(slug: ProductSlug) {
  const product = marketplaceBySlug.get(slug);
  if (!product) throw new Error(`Unknown marketplace product: ${slug}`);
  return `${product.name} Next.js ${product.kind} for $${product.price}. ${productCopy[slug]}`;
}

export function productMetadata(slug: ProductSlug): Metadata {
  const product = marketplaceBySlug.get(slug);
  if (!product) throw new Error(`Unknown marketplace product: ${slug}`);
  const title = `${product.name} — Next.js ${product.kind} | Drew Sepeczi`;
  const description = productSeoDescription(slug);
  const url = canonicalUrl(`/${slug}`);
  const image = canonicalUrl(product.screenshot);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "Drew Sepeczi",
      images: [{ url: image, alt: `${product.name} Next.js ${product.kind} preview` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
