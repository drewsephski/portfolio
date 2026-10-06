// Downloaded templates must not inherit this portfolio's canonicals or marketplace imports.
export function stripMarketplaceSeo(contents, slug) {
  return contents
    .replace(/^import .* from "@\/app\/marketplace\/(?:seo|product-structured-data)";\r?\n/gm, "")
    .replace(/<ProductStructuredData\s+slug="[^"]+"\s*\/>/g, "")
    .replace(/productMetadata\("[^"]+"\)/g, `{ title: ${JSON.stringify(`${slug} template`)} }`);
}
