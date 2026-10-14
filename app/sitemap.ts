import type { MetadataRoute } from "next";

import { allGuides } from "@/lib/guides/catalog";
import { marketplaceProducts } from "@/app/marketplace/catalog";
import { canonicalUrl, siteContentUpdated } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const guideEntries = allGuides.map((guide) => ({
    url: canonicalUrl(`/guides/${guide.slug}`),
    lastModified: guide.modified ?? guide.published,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const latestGuideUpdate = allGuides
    .map((guide) => guide.modified ?? guide.published)
    .sort()
    .at(-1) ?? siteContentUpdated;

  return [
    {
      url: canonicalUrl(),
      lastModified: siteContentUpdated,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: canonicalUrl("/guides"),
      lastModified: latestGuideUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...marketplaceProducts.map((product) => ({
      url: canonicalUrl(`/${product.slug}`),
      lastModified: siteContentUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...guideEntries,
  ];
}
