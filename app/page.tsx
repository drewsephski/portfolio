import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { canonicalUrl } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { allGuides } from "@/lib/guides/catalog";
import { homeJsonLd } from "@/lib/portfolio/json-ld";
import styles from "./home.module.css";
import Link from "next/link";
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

const homeTitle = "Drew Sepeczi Portfolio | AI Products & Developer Tools";
const homeDescription =
  "Drew Sepeczi builds AI products, developer tools, and full-stack apps, and sells production-ready Next.js templates and hero sections for SaaS launches.";
const homeImage = { url: canonicalUrl("/readme-cover.png"), width: 1774, height: 887, alt: "Drew Sepeczi — AI products, developer tools, and Next.js templates" };

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: canonicalUrl() },
  openGraph: {
    type: "profile",
    url: canonicalUrl(),
    siteName: "Drew Sepeczi",
    title: homeTitle,
    description: homeDescription,
    locale: "en_US",
    firstName: "Drew",
    lastName: "Sepeczi",
    images: [homeImage],
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription, images: [homeImage.url] },
};

const latestGuides = [...allGuides].sort((a, b) => (b.modified ?? b.published).localeCompare(a.modified ?? a.published));

export default function HomePage() {
  return (
    <main className={styles.page}>
      <JsonLd data={homeJsonLd()} />
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.wordmark} href="#top">{profile.name}</a>
          <div className={styles.navLinks}>
            <a href="#featured-projects">Work</a>
            <a href="#products">Products</a>
            <a href="#studies">Studies</a>
            <a href="#templates">Templates</a>
            <a href="#guides">Guides</a>
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
        <section className={styles.guides} id="guides" aria-labelledby="guides-title">
          <div className={styles.sectionHeader}>
            <h2 id="guides-title">Guides</h2>
            <p><Link href="/guides">All guides</Link></p>
          </div>
          <ul className={styles.list}>
            {latestGuides.map((guide) => (
              <li className={`${styles.row} ${styles.guideRow}`} key={guide.slug}>
                <Link className={styles.link} href={`/guides/${guide.slug}`}>
                  <span className={styles.copy}>
                    <h3 className={styles.name}>{guide.title}</h3>
                    <span className={styles.description}>{guide.description}</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true"><ArrowRight /></span>
                </Link>
              </li>
            ))}
          </ul>
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
            <Link href="/guides">Guides</Link>
            <BoldArrowLink href={profile.github} target="_blank" rel="noreferrer">GitHub</BoldArrowLink>
            <BoldArrowLink href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</BoldArrowLink>
          </div>
          <p>© {new Date().getFullYear()} {profile.name}</p>
        </footer>
      </div>
    </main>
  );
}
