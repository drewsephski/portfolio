import "server-only";

import type { MarketplaceProduct } from "./catalog";

export function getAgentPrompt(name: string, kind: MarketplaceProduct["kind"]) {
  return `Recreate the ${name} ${kind === "component" ? "hero section" : "website template"} in my existing Next.js App Router project. Preserve its visual hierarchy, responsive behavior, typography, spacing, motion, and accessibility. Adapt the copy and brand tokens to my product, keep the implementation componentized, and avoid adding dependencies unless they are necessary.`;
}
