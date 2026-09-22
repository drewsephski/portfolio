import styles from "./home.module.css";
import { AskDrewButton } from "./portfolio-chat/ask-drew-button";
import { FeaturedApps } from "./featured-apps";
import { BoldArrowLink } from "./bold-arrow-link";
import { LandingPageList } from "./landing-page-list";
import { PaidTemplateList } from "./paid-template-list";
import { PortfolioBento } from "./portfolio-bento";
import { ProductGrid } from "./product-grid";
import { ScrollRevealText } from "./scroll-reveal-text";
import { profile, selectedProducts } from "@/lib/portfolio/content";
import { marketplaceProducts } from "./marketplace/catalog";

const landingPages = marketplaceProducts.filter((product) => product.kind === "component").map((product) => ({ ...product, href: `/${product.slug}` }));

const paidTemplates = marketplaceProducts.filter((product) => product.kind === "template").map((product) => ({ ...product, previewHref: `/${product.slug}` }));

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.wordmark} href="#top">{profile.name}</a>
          <div className={styles.navLinks}>
            <a href="#featured-projects">Work</a>
            <a href="#products">Products</a>
            <a href="#studies">Studies</a>
            <a href="#templates">Templates</a>
            <BoldArrowLink href={profile.emailHref}>Contact</BoldArrowLink>
          </div>
        </nav>
        <header className={styles.hero} id="top">
          <p className={styles.eyebrow}>{profile.eyebrow}</p>
          <h1 className={styles.heroTitle}>{profile.statement}</h1>
          <div className={styles.heroDetails}>
            <p>{profile.focus} <br/>{profile.focusContinued}</p>
            <div className={styles.heroActions}>
              <AskDrewButton />
              <BoldArrowLink className={styles.heroCta} href={profile.emailHref}>Let&apos;s work together</BoldArrowLink>
            </div>
          </div>
        </header>
        <FeaturedApps />
        <section className={styles.products} id="products" aria-labelledby="products-title">
          <div className={styles.sectionHeader}><h2 id="products-title">Selected products</h2></div>
          <ProductGrid products={selectedProducts} />
        </section>
        <section className={styles.capabilities} aria-labelledby="capabilities-title">
          <div className={styles.sectionHeader}>
            <h2 id="capabilities-title">How I build</h2>
          </div>
          <PortfolioBento />
        </section>
        <section className={styles.about} id="about" aria-labelledby="about-title">
          <div className={styles.aboutContent}>
            <div className={styles.aboutHeader}>
              <h2 id="about-title">About</h2>
              <p>{profile.aboutLabel}</p>
            </div>
            <ScrollRevealText className={styles.aboutReveal} mode="letters" showGhost textAlign="center">
              {profile.about}
            </ScrollRevealText>
          </div>
        </section>
        <section className={styles.studies} id="studies" aria-labelledby="studies-title">
          <div className={styles.sectionHeader}><h2 id="studies-title">Interface studies</h2></div>
          <LandingPageList landingPages={landingPages} />
        </section>
        <section className={styles.templates} id="templates" aria-labelledby="templates-title">
          <div className={styles.sectionHeader}>
            <h2 id="templates-title">Complete templates</h2>
          </div>
          <PaidTemplateList templates={paidTemplates} />
        </section>
        <section className={styles.contactCta} id="contact" aria-labelledby="contact-cta-title">
          <div>
            <p className={styles.contactCtaEyebrow}>Have a useful idea?</p>
            <h2 id="contact-cta-title">Let&apos;s make it real.</h2>
          </div>
          <BoldArrowLink href={profile.emailHref}>Start a conversation</BoldArrowLink>
        </section>
        <footer className={styles.footer}>
          <p>{profile.availability}</p>
          <div>
            <BoldArrowLink href={profile.github} target="_blank" rel="noreferrer">GitHub</BoldArrowLink>
            <BoldArrowLink href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</BoldArrowLink>
          </div>
          <p>© {new Date().getFullYear()} {profile.name}</p>
        </footer>
      </div>
    </main>
  );
}
