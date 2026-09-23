import type { MetadataRoute } from "next";

import { allGuides } from "@/lib/guides/catalog";
import { siteUrl } from "@/lib/guides/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const guideEntries = allGuides.map((guide) => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified: guide.published,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...guideEntries,
  ];
}
