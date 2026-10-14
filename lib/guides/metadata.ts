import type { Metadata } from "next";

import { guideCanonicalUrl, siteUrl } from "./site";
import type { Guide } from "./types";

const defaultOgImage = `${siteUrl}/screenshots/infranex-hero.webp`;

const brandSuffix = " | Drew Sepeczi";
const maxTitleLength = 60;

export function guideDocumentTitle(guide: Guide) {
  const base = guide.metaTitle ?? guide.title;
  return base.length + brandSuffix.length <= maxTitleLength ? `${base}${brandSuffix}` : base;
}

export function createGuideMetadata(guide: Guide): Metadata {
  const url = guideCanonicalUrl(guide.slug);
  const socialTitle = guide.metaTitle ?? guide.title;

  return {
    title: guideDocumentTitle(guide),
    description: guide.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: socialTitle,
      description: guide.description,
      siteName: "Drew Sepeczi",
      publishedTime: guide.published,
      modifiedTime: guide.modified ?? guide.published,
      authors: [siteUrl],
      images: [{ url: defaultOgImage, alt: "Drew Sepeczi — Next.js templates and interface studies" }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: guide.description,
      images: [defaultOgImage],
    },
  };
}

export function createGuidesIndexMetadata(): Metadata {
  const url = `${siteUrl}/guides`;

  return {
    title: "Next.js Template & SaaS Marketing Guides | Drew Sepeczi",
    description:
      "Buyer guides for Next.js landing templates, interface studies, and AI SaaS marketing sites—buy vs build, stack choices, and honest comparisons.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title: "Guides — Next.js landing templates & SaaS marketing",
      description:
        "Buyer guides for Next.js landing templates, interface studies, and AI SaaS marketing sites.",
      siteName: "Drew Sepeczi",
    },
    twitter: {
      card: "summary",
      title: "Guides — Next.js landing templates & SaaS marketing",
      description:
        "Buyer guides for Next.js landing templates, interface studies, and AI SaaS marketing sites.",
    },
  };
}
