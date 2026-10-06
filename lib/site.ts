export const siteUrl = "https://drewsepeczi.xyz";

export function canonicalUrl(path: string = "/") {
  return `${siteUrl}${path === "/" ? "" : path}`;
}
