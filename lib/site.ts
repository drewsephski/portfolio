export const siteUrl = "https://drewsepeczi.xyz";

export function canonicalUrl(path: string = "/") {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

/**
 * Last meaningful content change to the homepage and product pages.
 * Bump this when you ship visible changes so the sitemap's lastmod stays honest.
 */
export const siteContentUpdated = "2026-10-14";
