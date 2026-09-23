export const siteUrl = "https://drewsepeczi.xyz";

export function guideCanonicalPath(slug: string) {
  return `/guides/${slug}`;
}

export function guideCanonicalUrl(slug: string) {
  return `${siteUrl}${guideCanonicalPath(slug)}`;
}
