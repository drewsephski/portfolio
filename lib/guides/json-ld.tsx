import { guideCanonicalUrl, siteUrl } from "./site";
import type { Guide, GuideFaq } from "./types";

function faqPageJsonLd(faqs: GuideFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function articleJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.published,
    author: {
      "@type": "Person",
      name: "Drew Sepeczi",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Drew Sepeczi",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": guideCanonicalUrl(guide.slug),
    },
  };
}

export function GuideStructuredData({ guide }: { guide: Guide }) {
  const payload = [articleJsonLd(guide), faqPageJsonLd(guide.faqs)];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
