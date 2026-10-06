# SEO quick-win fixes — drewsepeczi.xyz

Implemented October 6, 2026 on branch `codex/portfolio-seo`, based on production commit `371e7fe`.

## Status and location

The www redirect is already live in Vercel project `pontail`: `www.drewsepeczi.xyz` redirects to `drewsepeczi.xyz` with HTTP 301, preserving paths and query strings. Verified the homepage, a product preview, and a guide. The apex still returns HTTP 200.

The SEO changes are on branch `codex/portfolio-seo`. Production code deployment remains pending; committing and pushing this branch does not promote it to production. Their checkout is `/Users/drewsepeczi/.codex/worktrees/seo-quick-wins-production/pontail`. The chat's original checkout was three commits behind production and omitted all eight guides and the sitemap. Cloud placeholders in its Git storage prevented managed worktree creation, so a clean checkout of the current production source was used. The original source files were preserved.

## Changes in priority order

1. Canonical origin is `https://drewsepeczi.xyz`, shared by redirects, metadata, structured data, sitemap, and robots.txt. The framework also has a host-specific HTTP 301 redirect in `next.config.ts`. Legacy `/privacy.html`, `/terms.html`, and `/sms-opt-in.html` redirect to their Next.js routes. The sitemap now lists all 14 paid previews, the homepage, the guides index, and all eight guides; it avoids artificial modification dates for pages without an editorial date.
2. All five complete templates and all nine paid component/interface studies have distinct descriptions, 126–141 characters, with the product name, primary use case, and catalog price. Prices are interpolated from the same catalog checkout uses. Social metadata uses the same descriptions and URLs.
3. All 27 public pages render exactly one absolute self-referencing canonical. Private inbox pages also have path-specific canonicals that omit query parameters, and retain `noindex`. Unknown routes do not inherit a homepage canonical.
4. Homepage title is `Drew Sepeczi Portfolio | AI Products & Developer Tools` (54 characters).
5. All 14 paid previews render server-side Product JSON-LD with name, description, real preview image, Offer URL, USD price, and availability. Existing guide Article data was preserved and refined to BlogPosting, with original publication dates and an optional editorial `modified` date. The visible guide date, sitemap, social metadata, and schema use the same date. JSON-LD safely escapes `<`. No reviews, ratings, policy promises, or publication timestamps were invented.

Downloaded template packages must be portable: the archive builder strips portfolio SEO imports and markup, supplies standalone metadata, and generates a standalone Next.js config. All 14 download ZIPs were rebuilt and inspected for missing marketplace imports and portfolio redirects. Generated binary changes were discarded after verification; the existing prebuild step regenerates the downloads from the updated source on deployment.

## Verification

- Standard production build, including all 14 download archives: passed.
- Type check: passed.
- Jest: 61 tests in nine suites passed, including six SEO regression tests.
- Existing checkout navigation test: passed.
- Changed-file lint and whitespace checks: passed.
- Full-repository lint: seven pre-existing errors in `app/components/VapiExample.tsx`, `app/hooks/useVapi.tsx`, and `app/inbox/_components/inbox-toolbar.tsx`, plus existing warnings; these unrelated files were not changed.
- Rendered production-server checks: 27 public pages, each with one canonical; 24 unique sitemap URLs; 14 Product and eight BlogPosting entities; 14 portable archives.
- Framework www redirect: HTTP 301 with preserved path and query string; legacy legal HTML redirect and robots sitemap declaration verified.
- Live Vercel www redirect: HTTP 301 with preserved path and query string.
- [Google Rich Results Test](https://search.google.com/test/rich-results/result?id=RwF3LZSuSf8TrH4_58L3mw): code test using structured data extracted from the 22 built pages, 14 valid Product snippets, 14 valid Merchant listings, and eight valid Articles, with no critical errors. Google reported optional non-critical enhancements. This validates the markup; it does not prove Google has crawled the new deployment or guarantee display in search results.

## Manual steps — code publication / Vercel

- [ ] Review branch `codex/portfolio-seo` and deploy it through the usual GitHub/Vercel workflow. No PR or production code deployment has been created.
- [ ] After deployment, confirm `/sitemap.xml` contains 24 URLs and `/robots.txt` advertises the canonical sitemap. Check a template and guide for the new canonical and structured data.
- [ ] In Vercel → `pontail` → Settings → Domains, keep `www.drewsepeczi.xyz` as a **301 redirect** to `drewsepeczi.xyz`. This setting is already applied and verified; no DNS edit or additional redirect setup is needed.

## Manual steps — Google Search Console

- [ ] Use or verify the Domain property `drewsepeczi.xyz`, covering apex, www, and HTTP/HTTPS variants; complete DNS verification only if it is not already verified.
- [ ] Once the code deployment is live, resubmit `https://drewsepeczi.xyz/sitemap.xml` under Sitemaps. Replace an old www sitemap submission if one exists.
- [ ] Use URL Inspection for the canonical homepage and important template/guide pages, test the live URLs, and request indexing.
- [ ] Inspect an old www URL to confirm Google sees the redirect, then monitor Pages and canonical selection as Google recrawls. Existing historical www properties can stay for monitoring.

There is no Search Console "preferred domain" setting to configure. Google [removed that setting](https://developers.google.com/search/blog/2019/06/bye-bye-preferred-domain-setting); the preference is established through the redirect, canonical tags, consistent links, and sitemap already implemented here.

## Manual steps — Google Rich Results Test

- [ ] After deploying, run live URL tests on the templates and guides so Google validates the delivered pages. The code test already passed all 22 requested Product/Article entities. Review any optional warnings if you later add real reviews, article images, or applicable merchant policies.

## Description inventory

| Page | Characters | Meta description |
| --- | ---: | --- |
| `/agentlab` | 137 | AgentLab Next.js template for $299. Market an AI automation platform with workflow demos, industry sections, and a complete landing page. |
| `/axon` | 127 | Axon Next.js component for $49. Showcase AI workflow automation with a bold hero, responsive design, and editable React source. |
| `/convix` | 138 | Convix Software Next.js component for $59. Present PR agency software with a cinematic hero, dashboard preview, and editable React source. |
| `/dreammotion` | 141 | DreamMotion Next.js template for $249. Build an AI image and video marketing site with rich galleries, responsive sections, and interactions. |
| `/equilibrium` | 126 | Equilibrium Next.js component for $39. Launch a wellness brand with a calm hero, responsive layout, and editable React source. |
| `/fusion-ai` | 137 | Fusion AI Next.js template for $299. Launch an AI automation marketing site with motion, integrations, social proof, and editable source. |
| `/infranex` | 138 | Infranex Next.js template for $249. Launch an AI SaaS marketing site with cinematic visuals, feature sections, and a full conversion flow. |
| `/meridian` | 134 | Meridian Next.js component for $59. Launch a SaaS revenue analytics site with a polished hero, responsive design, and editable source. |
| `/nexora` | 132 | Nexora Next.js component for $79. Launch your automation product with a refined hero, responsive visuals, and editable React source. |
| `/next-layer-of-intelligence` | 134 | The Next Layer of Intelligence Next.js component for $69. Launch an AI infrastructure site with a responsive hero and editable source. |
| `/palomar` | 131 | Palomar Next.js component for $49. Present your LLM platform with a polished AI hero, cinematic visuals, and editable React source. |
| `/salix` | 138 | Salix Next.js template for $199. Launch a sales SaaS marketing site with product storytelling, analytics visuals, and conversion sections. |
| `/vantage` | 134 | Vantage Next.js component for $79. Showcase a dashboard analytics product with a focused hero, responsive layout, and editable source. |
| `/vesper` | 132 | Vesper Next.js component for $69. Market an AI infrastructure product with a dark hero, animated visuals, and editable React source. |

## File inventory

- `app/agentlab/layout.tsx` — Wires route metadata and server-side Product structured data.
- `app/axon/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/convix/layout.tsx` — Removes stale duplicate metadata; the page owns its SEO.
- `app/convix/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/dreammotion/layout.tsx` — Wires route metadata and server-side Product structured data.
- `app/equilibrium/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/fusion-ai/layout.tsx` — Wires route metadata and server-side Product structured data.
- `app/guides/guide-content.tsx` — Consistent guide canonicals, publication/update dates, BlogPosting data, and safe rendering.
- `app/inbox/[callId]/page.tsx` — Path-specific canonical without credentials or query parameters; noindex retained.
- `app/inbox/layout.tsx` — Path-specific canonical without credentials or query parameters; noindex retained.
- `app/inbox/unlock/page.tsx` — Path-specific canonical without credentials or query parameters; noindex retained.
- `app/infranex/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/layout.tsx` — Canonical metadata base and expanded homepage title.
- `app/marketplace/product-structured-data.tsx` — Product/Offer JSON-LD sourced from the product catalog.
- `app/marketplace/seo.ts` — Unique catalog-priced descriptions, titles, canonicals, and social metadata.
- `app/meridian/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/nexora/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/next-layer-of-intelligence/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/page.tsx` — Self-referencing homepage canonical.
- `app/palomar/layout.tsx` — Wires route metadata and server-side Product structured data.
- `app/privacy/page.tsx` — Self-referencing canonical for legal/program pages.
- `app/robots.ts` — Canonical sitemap discovery.
- `app/salix/page.tsx` — Wires route metadata and server-side Product structured data.
- `app/sitemap.ts` — Canonical sitemap including products and editorial guide dates.
- `app/sms-opt-in/page.tsx` — Self-referencing canonical for legal/program pages.
- `app/terms/page.tsx` — Self-referencing canonical for legal/program pages.
- `app/vantage/layout.tsx` — Wires route metadata and server-side Product structured data.
- `app/vesper/layout.tsx` — Wires route metadata and server-side Product structured data.
- `jest.config.mjs` — SEO regression coverage and test discovery.
- `lib/guides/json-ld.tsx` — Consistent guide canonicals, publication/update dates, BlogPosting data, and safe rendering.
- `lib/guides/metadata.ts` — Consistent guide canonicals, publication/update dates, BlogPosting data, and safe rendering.
- `lib/guides/site.ts` — Consistent guide canonicals, publication/update dates, BlogPosting data, and safe rendering.
- `lib/guides/types.ts` — Consistent guide canonicals, publication/update dates, BlogPosting data, and safe rendering.
- `lib/json-ld.tsx` — Safe server-side JSON-LD serializer and renderer.
- `lib/seo/__tests__/seo.test.ts` — SEO regression coverage and test discovery.
- `lib/site.ts` — Shared canonical origin and URL helper.
- `next.config.ts` — Host and legacy HTML 301 redirects.
- `scripts/build-marketplace-downloads.mjs` — Keeps downloadable templates portable and free of portfolio canonicals.
- `scripts/marketplace-template-seo.mjs` — Keeps downloadable templates portable and free of portfolio canonicals.
- `docs/seo-quick-wins.md` — Full change inventory, description inventory, verification, and manual checklist.
