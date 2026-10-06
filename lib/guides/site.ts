import { canonicalUrl } from "@/lib/site";

export { siteUrl } from "@/lib/site";

export function guideCanonicalPath(slug: string) {
  return `/guides/${slug}`;
}

export function guideCanonicalUrl(slug: string) {
  return canonicalUrl(guideCanonicalPath(slug));
}
