import styles from "./home.module.css";
import { BoldArrowLink } from "./bold-arrow-link";
import { LandingPageList } from "./landing-page-list";
import { PaidTemplateList } from "./paid-template-list";
import { ProductGrid } from "./product-grid";
import { ScrollRevealText } from "./scroll-reveal-text";

const products = [
  { name: "Sitterfolio", type: "SaaS product", description: "Pet sitters build polished websites and manage every inquiry in one workspace.", href: "https://www.sitterfolio.com", visual: "sitterfolio", preview: { mp4: "/assets/product-previews/sitterfolio-20260827.mp4", webm: "/assets/product-previews/sitterfolio-20260827.webm", poster: "/assets/product-previews/sitterfolio-20260827-poster.jpg" } },
  { name: "Vault Zero", type: "Voice AI", description: "AI receptionist answers missed calls while keeping customers connected to a human.", href: "https://vaultzero.dev", visual: "voice", preview: { mp4: "/assets/product-previews/vault-zero-20260824.mp4", webm: "/assets/product-previews/vault-zero-20260824.webm", poster: "/assets/product-previews/vault-zero-20260824-poster.jpg" } },
  { name: "Vault Zero CRM", type: "AI workflow", description: "CRM researches businesses, checks buyer fit, and supports every recommendation with evidence.", href: "https://crm.vaultzero.dev", visual: "crm", preview: { mp4: "/assets/product-previews/vault-zero-crm-20260827.mp4", webm: "/assets/product-previews/vault-zero-crm-20260827.webm", poster: "/assets/product-previews/vault-zero-crm-20260827-poster.jpg" } },
  { name: "Squid Agent", type: "Developer tool", description: "Turns prompts, screenshots, and live sites into React prototypes with revision evidence.", href: "https://squidagent.app", visual: "agent", preview: { mp4: "/assets/product-previews/squid-agent-20260824.mp4", webm: "/assets/product-previews/squid-agent-20260824.webm", poster: "/assets/product-previews/squid-agent-20260824-poster.jpg" } },
  { name: "SquidCrawl", type: "Developer API", description: "Scraper API gives AI agents clean page content instead of raw HTML.", href: "https://squidcrawl.dev", visual: "crawl", preview: { mp4: "/assets/product-previews/squidcrawl-20260824.mp4", webm: "/assets/product-previews/squidcrawl-20260824.webm", poster: "/assets/product-previews/squidcrawl-20260824-poster.jpg" } },
  { name: "Phoenix Design Lab", type: "Design system", description: "A design agency demo pairing bold art direction with an editorial portfolio.", href: "https://phoenixdev.agency/demo", visual: "design", preview: { mp4: "/assets/product-previews/phoenix-design-lab-20260827.mp4", webm: "/assets/product-previews/phoenix-design-lab-20260827.webm", poster: "/assets/product-previews/phoenix-design-lab-20260827-poster.jpg" } },
] as const;

const landingPages = [
  { name: "Equilibrium", description: "Wellness for a steadier everyday life", href: "/equilibrium", screenshot: "/screenshots/equilibrium.webp" },
  { name: "Palomar", description: "One unified system for LLMs", href: "/palomar", screenshot: "/screenshots/palomar.webp" },
  { name: "Axon", description: "Digital workers for mundane workflows", href: "/axon", screenshot: "/screenshots/axon.webp" },
  { name: "Vesper", description: "Operational AI infrastructure", href: "/vesper", screenshot: "/screenshots/vesper.webp" },
  { name: "Nexora", description: "Automation for busywork", href: "/nexora", screenshot: "/screenshots/nexora.webp" },
  { name: "The Next Layer of Intelligence", description: "Infrastructure for scaling AI systems", href: "/next-layer-of-intelligence", screenshot: "/screenshots/next-layer-of-intelligence.webp" },
  { name: "Convix Software", description: "The future of PR agency operations", href: "/convix", screenshot: "/screenshots/convix.webp" },
  { name: "Vantage", description: "A clear signal across every dashboard", href: "/vantage", screenshot: "/screenshots/vantage.webp" },
  { name: "Meridian", description: "Revenue intelligence for SaaS", href: "/meridian", screenshot: "/screenshots/meridian.webp" },
] as const;

const paidTemplates = [
  {
    name: "Infranex",
    description: "A dark, cinematic AI SaaS template with feature bento grids, integration motion, testimonials, pricing, comparisons, FAQ, and launch-ready conversion sections.",
    previewHref: "/infranex",
    purchaseHref: "mailto:hello@drewsepeczi.xyz?subject=Purchase%20Infranex%20template",
    screenshot: "/screenshots/infranex-hero.webp",
  },
  {
    name: "Salix",
    description: "A premium sales SaaS landing page with product storytelling, analytics, testimonials, pricing, and conversion-focused interactions.",
    previewHref: "/salix",
    purchaseHref: "mailto:hello@drewsepeczi.xyz?subject=Purchase%20Salix%20template",
    screenshot: "/screenshots/salix-premium.png",
  },
  {
    name: "DreamMotion",
    description: "A cinematic AI image and video product landing page with galleries, testimonials, use cases, and interactive FAQ.",
    previewHref: "/dreammotion",
    purchaseHref: "mailto:hello@drewsepeczi.xyz?subject=Purchase%20DreamMotion%20template",
    screenshot: "/screenshots/dreammotion.webp",
  },
  {
    name: "AgentLab",
    description: "A premium AI automation platform template with agent workflows, capability bento grids, industry use cases, testimonials, compliance, and interactive FAQ.",
    previewHref: "/agentlab",
    purchaseHref: "mailto:hello@drewsepeczi.xyz?subject=Purchase%20AgentLab%20template",
    screenshot: "/screenshots/agentlab.webp",
  },
  {
    name: "Fusion AI",
    description: "A premium AI automation landing page with product storytelling, integration rails, social proof, workflow previews, and interactive FAQ.",
    previewHref: "/fusion-ai",
    purchaseHref: "mailto:hello@drewsepeczi.xyz?subject=Purchase%20Fusion%20AI%20template",
    screenshot: "/screenshots/fusion-ai.webp",
  },
] as const;

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.wordmark} href="#top">Drew Sepeczi</a>
          <div className={styles.navLinks}>
            <a href="#products">Products</a>
            <a href="#studies">Studies</a>
            <BoldArrowLink href="https://portfolio.drewsepeczi.xyz" target="_blank" rel="noreferrer">
              Portfolio
            </BoldArrowLink>
            <a href="mailto:hello@drewsepeczi.xyz">Contact</a>
          </div>
        </nav>
        <header className={styles.hero} id="top">
          <p className={styles.eyebrow}>Software engineer · Chicago</p>
          <h1 className={styles.heroTitle}>I design and build software people can actually use.</h1>
          <div className={styles.heroDetails}>
            <p>AI products, developer tools, and full-stack web apps. <br/>From the first useful workflow through production.</p>
            <BoldArrowLink className={styles.heroCta} href="mailto:hello@drewsepeczi.xyz">Let&apos;s work together</BoldArrowLink>
          </div>
        </header>
        <section className={styles.products} id="products" aria-labelledby="products-title">
          <div className={styles.sectionHeader}><h2 id="products-title">Selected products</h2><p>{products.length} shipped &amp; active</p></div>
          <ProductGrid products={products} />
        </section>
        <section className={styles.about} id="about" aria-labelledby="about-title">
          <div className={styles.aboutSticky}>
            <div className={styles.aboutHeader}>
              <h2 id="about-title">About</h2>
              <p>Product engineer · Chicago</p>
            </div>
            <ScrollRevealText className={styles.aboutReveal} mode="letters" progressTarget="section" showGhost textAlign="center">
              I’m Drew, a product engineer in Chicago. I design and build AI products, developer tools, and full-stack software from early product decisions through production. I care about useful workflows, clear interfaces, and software people can confidently own.
            </ScrollRevealText>
          </div>
        </section>
        <section className={styles.studies} id="studies" aria-labelledby="studies-title">
          <div className={styles.sectionHeader}><h2 id="studies-title">Interface studies</h2><p>Landing pages for software products</p></div>
          <LandingPageList landingPages={landingPages} />
        </section>
        <section className={styles.templates} id="templates" aria-labelledby="templates-title">
          <div className={styles.sectionHeader}>
            <h2 id="templates-title">Paid templates</h2>
            <p>Production-ready pages for your next launch</p>
          </div>
          <PaidTemplateList templates={paidTemplates} />
        </section>
        <footer className={styles.footer}>
          <p>Available for product engineering work.</p>
          <div>
            <BoldArrowLink href="https://github.com/drewsephski" target="_blank" rel="noreferrer">GitHub</BoldArrowLink>
            <BoldArrowLink href="https://linkedin.com/in/drewsepeczi" target="_blank" rel="noreferrer">LinkedIn</BoldArrowLink>
          </div>
          <p>© {new Date().getFullYear()} Drew Sepeczi</p>
        </footer>
      </div>
    </main>
  );
}
