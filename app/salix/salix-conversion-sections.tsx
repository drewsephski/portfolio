"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./salix.module.css";

const analyticsTabs = [
  { label: "Meeting Scheduler", image: "/salix/analytics-scheduler.png" },
  { label: "Territory Management", image: "/salix/analytics-territory.png" },
  { label: "Lead Enrichment", image: "/salix/analytics-enrichment.png" },
] as const;

const plans = [
  {
    name: "Starter",
    price: 39,
    description: "Perfect for individuals and small teams just getting started",
    features: ["Essential tools to get you up", "Up to 5 projects & reporting", "Email support"],
    popular: false,
  },
  {
    name: "Ultimate",
    price: 79,
    description: "Perfect for individuals and small teams just getting started",
    features: ["Essential tools to get you up", "Unlimited projects & reporting", "Email support"],
    popular: true,
  },
] as const;

const faqs = [
  {
    question: "Is my data safe on Salix?",
    answer:
      "Yes. We use industry-grade encryption, secure servers, and role-based access controls to protect your data at all times.",
  },
  {
    question: "How do I get started?",
    answer: "Create your workspace, invite your team, and follow the guided setup to configure your sales process.",
  },
  {
    question: "Does it work with my CRM?",
    answer: "Yes. Salix connects with popular CRM platforms so your contacts and sales activity stay in sync.",
  },
  {
    question: "Can I track sales goals?",
    answer: "Yes. Set team or individual goals and monitor progress with real-time dashboards and reports.",
  },
] as const;

const footerGroups = [
  { title: "Info", links: ["Product", "Company", "Career", "Pricing"] },
  { title: "Resources", links: ["Blog & Article", "Case Studies", "Contact Us", "Integrations"] },
  { title: "Company", links: ["Terms conditions", "404"] },
] as const;

export function SalixConversionSections() {
  const [activeAnalytics, setActiveAnalytics] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section className={styles.growthSection} aria-labelledby="growth-title">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Growth Gear</span>
          <h2 id="growth-title">Advanced analytics &amp; reporting</h2>
          <p>Businesses choose Salix because it simplifies the complexity of sales management.</p>
        </div>
        <div className={styles.analyticsTabs} role="tablist" aria-label="Analytics tools">
          {analyticsTabs.map((tab, index) => (
            <button
              className={index === activeAnalytics ? styles.analyticsTabActive : styles.analyticsTab}
              id={`salix-analytics-tab-${index}`}
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={index === activeAnalytics}
              aria-controls="salix-analytics-panel"
              onClick={() => setActiveAnalytics(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className={styles.analyticsViewport}
          id="salix-analytics-panel"
          role="tabpanel"
          aria-labelledby={`salix-analytics-tab-${activeAnalytics}`}
        >
          <Image
            className={styles.analyticsImage}
            key={analyticsTabs[activeAnalytics].image}
            src={analyticsTabs[activeAnalytics].image}
            alt={`${analyticsTabs[activeAnalytics].label} analytics dashboard`}
            width={1080}
            height={650}
          />
        </div>
      </section>

      <section className={styles.reviewsSection} aria-labelledby="reviews-title">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Customer Reviews</span>
          <h2 id="reviews-title">Trusted by 2500+ growing companies worldwide</h2>
        </div>
        <div className={styles.reviewGrid}>
          <article className={`${styles.metricCard} ${styles.metricPink}`}><strong>60%</strong><span>Admin work reduced</span></article>
          <article className={styles.testimonialCard}>
            <blockquote>“Salix cut our admin work by more than half. Our team now spends more time closing deals than managing spreadsheets.”</blockquote>
            <div><strong>Shon Taite</strong><span>Head of Sales, Grainor</span></div>
          </article>
          <article className={styles.metricCard}><strong>45%</strong><span>Revenue boost per year</span></article>
          <article className={styles.metricCard}><strong>35%</strong><span>rep productivity</span></article>
          <article className={styles.testimonialCard}>
            <blockquote>“Salix isn’t just software—it feels like an extension of our sales team. We’re more organized, focused, and efficient.”</blockquote>
            <div><strong>Mark Demon</strong><span>Co-founder at RevBoost</span></div>
          </article>
          <article className={`${styles.metricCard} ${styles.metricBlue}`}><strong>$45M</strong><span>Revenue boost per year</span></article>
        </div>
      </section>

      <section className={styles.pricingSection} id="pricing" aria-labelledby="pricing-title">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Pricing</span>
          <h2 id="pricing-title">Choose the Perfect Plan</h2>
        </div>
        <div className={styles.billingToggle} aria-label="Billing interval">
          <button type="button" className={!yearly ? styles.billingActive : undefined} onClick={() => setYearly(false)}>Monthly</button>
          <button type="button" className={yearly ? styles.billingActive : undefined} onClick={() => setYearly(true)}>Yearly <span>SAVE 20%</span></button>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan) => {
            const price = yearly ? (plan.price * 0.8).toFixed(2).replace(".00", "") : plan.price;
            return (
              <article className={styles.planCard} key={plan.name}>
                {plan.popular && <span className={styles.popularBadge}>MOST POPULAR</span>}
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <div className={styles.planPrice}><strong>${price}</strong><span>/mo/user</span></div>
                <small>billed {yearly ? "yearly" : "monthly"}</small>
                <a className={styles.planButton} href="#salix-cta">Get 14 Days Free Trial</a>
                <h4>What do you get:</h4>
                <ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title">
        <div className={styles.faqIntro}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2 id="faq-title">Frequently Asked Questions</h2>
          <p>Get answers to common questions here</p>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <article className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`} key={faq.question}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}>
                  <span>{faq.question}</span><span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div
                  className={styles.faqAnswer}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? true : undefined}
                >
                  <div><p>{faq.answer}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.ctaSection} id="salix-cta" aria-labelledby="cta-title">
        <div className={styles.ctaCopy}>
          <span className={styles.eyebrow}>Ready to get started fast?</span>
          <h2 id="cta-title">Start taking control of your business today</h2>
          <a className={styles.ctaButton} href="#pricing">Get This Template</a>
        </div>
        <Image className={styles.ctaImage} src="/salix/cta-dashboard.png" alt="Salix sales dashboard" width={760} height={560} />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLead}>
          <Image src="/salix/logo.svg" alt="Salix" width={96} height={32} />
          <p>Salix AI is designed to revolutionize how businesses operate.</p>
        </div>
        <nav className={styles.footerLinks} aria-label="Footer">
          {footerGroups.map((group) => (
            <div key={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href="#" key={link}>{link}</a>)}</div>
          ))}
        </nav>
        <div className={styles.footerBottom}><span>© 2025 Salix, Inc. All rights reserved.</span><div><a href="#" aria-label="X">X</a><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Instagram">◎</a></div></div>
      </footer>
    </>
  );
}
