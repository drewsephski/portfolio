import type { MetadataRoute } from "next";

import { allGuides } from "@/lib/guides/catalog";
import { marketplaceProducts } from "@/app/marketplace/catalog";
import { canonicalUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const guideEntries = allGuides.map((guide) => ({
    url: canonicalUrl(`/guides/${guide.slug}`),
    lastModified: guide.modified ?? guide.published,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: canonicalUrl(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: canonicalUrl("/guides"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...marketplaceProducts.map((product) => ({
      url: canonicalUrl(`/${product.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...guideEntries,
  ];
}
