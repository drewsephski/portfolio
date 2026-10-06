import { JsonLd } from "@/lib/json-ld";
import { canonicalUrl } from "@/lib/site";
import { marketplaceBySlug } from "./catalog";
import { productSeoDescription, type ProductSlug } from "./seo";

export function productJsonLd(slug: ProductSlug) {
  const product = marketplaceBySlug.get(slug);
  if (!product) throw new Error(`Unknown marketplace product: ${slug}`);
  const url = canonicalUrl(`/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: productSeoDescription(slug),
    image: canonicalUrl(product.screenshot),
    url,
    sku: product.slug,
    category: `Next.js ${product.kind}`,
    brand: { "@type": "Brand", name: "Drew Sepeczi" },
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Person", name: "Drew Sepeczi", url: canonicalUrl() },
    },
  };
}

export function ProductStructuredData({ slug }: { slug: ProductSlug }) {
  return <JsonLd data={productJsonLd(slug)} />;
}
