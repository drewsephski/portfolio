import { describe, expect, test } from "@jest/globals";
import nextConfig from "../../../next.config";
import sitemap from "../../../app/sitemap";
import { marketplaceProducts } from "../../../app/marketplace/catalog";
import { productMetadata, type ProductSlug } from "../../../app/marketplace/seo";
import { productJsonLd } from "../../../app/marketplace/product-structured-data";
import { allGuides } from "../../guides/catalog";
import { articleJsonLd } from "../../guides/json-ld";
import { createGuideMetadata } from "../../guides/metadata";
import { serializeJsonLd } from "../../json-ld";
import { canonicalUrl } from "../../site";

describe("SEO consistency", () => {
  test("www permanently redirects to the canonical host while retaining the path", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toContainEqual({
      source: "/:path*",
      has: [{ type: "host", value: "www.drewsepeczi.xyz" }],
      destination: `${canonicalUrl()}/:path*`,
      statusCode: 301,
    });
  });

  test("every paid preview has a unique description with its current price and a matching canonical", () => {
    const descriptions = marketplaceProducts.map((product) => {
      const metadata = productMetadata(product.slug as ProductSlug);
      const description = metadata.description!;
      expect(description.length).toBeGreaterThanOrEqual(120);
      expect(description.length).toBeLessThanOrEqual(158);
      expect(description).toContain(product.name);
      expect(description).toContain(`$${product.price}`);
      expect(metadata.alternates?.canonical).toBe(canonicalUrl(`/${product.slug}`));
      expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical);
      return description;
    });
    expect(new Set(descriptions).size).toBe(marketplaceProducts.length);
  });

  test("Product offers use catalog prices, preview images, and the same canonical URL", () => {
    for (const product of marketplaceProducts) {
      const data = productJsonLd(product.slug as ProductSlug);
      expect(data["@type"]).toBe("Product");
      expect(data.name).toBe(product.name);
      expect(data.image).toBe(canonicalUrl(product.screenshot));
      expect(data.offers.price).toBe(product.price);
      expect(data.offers.priceCurrency).toBe("USD");
      expect(data.offers.url).toBe(canonicalUrl(`/${product.slug}`));
      expect(data.description).toBe(productMetadata(product.slug as ProductSlug).description);
    }
  });

  test("all guides retain their publication dates, authors, and self-referencing canonicals", () => {
    for (const guide of allGuides) {
      const article = articleJsonLd(guide);
      expect(article.headline).toBe(guide.h1);
      expect(article.author.name).toBe("Drew Sepeczi");
      expect(article.datePublished).toBe(guide.published);
      expect(Number.isNaN(Date.parse(article.datePublished))).toBe(false);
      expect(article.dateModified).toBe(guide.modified ?? guide.published);
      expect(article.mainEntityOfPage["@id"]).toBe(createGuideMetadata(guide).alternates?.canonical);
    }
    const updated = { ...allGuides[0], modified: "2026-09-24" };
    expect(articleJsonLd(updated).datePublished).toBe(updated.published);
    expect(articleJsonLd(updated).dateModified).toBe(updated.modified);
    expect(createGuideMetadata(updated).openGraph).toMatchObject({ modifiedTime: updated.modified });
  });

  test("the sitemap contains every product and guide once, with only the canonical host", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(new URL(url).origin).toBe(canonicalUrl());
    for (const product of marketplaceProducts) expect(urls).toContain(canonicalUrl(`/${product.slug}`));
    for (const guide of allGuides) expect(urls).toContain(canonicalUrl(`/guides/${guide.slug}`));
    expect(urls.some((url) => url.includes("/inbox"))).toBe(false);
  });

  test("JSON-LD cannot close its script element and remains valid JSON", () => {
    const data = { name: '</script><script>alert("test")</script>' };
    const serialized = serializeJsonLd(data);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(data);
  });
});
