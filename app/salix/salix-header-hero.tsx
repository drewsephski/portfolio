"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import styles from "./salix.module.css";

const trustedLogos = [1, 2, 3, 4] as const;

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function SalixHeaderHero() {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <>
      <header className={styles.header}>
        <a className={styles.logoLink} href="#" aria-label="Salix home">
          <Image className={styles.logo} src="/salix/logo.svg" alt="Salix" width={149} height={57} priority />
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <a href="#all-pages">All Pages</a>
          <a href="#product">Product</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className={styles.headerActions}>
          <a className={styles.loginLink} href="#login">Login</a>
          <a className={styles.templateButton} href="#template">Get This Template</a>
        </div>

        <button className={styles.mobileMenu} type="button" aria-label="Open navigation menu">
          <MenuIcon />
        </button>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="salix-hero-title">
          <div className={styles.heroCopy}>
            <motion.p className={styles.eyebrow} {...rise(0.05)}>
              Join +1000 scaling business
            </motion.p>
            <motion.h1 id="salix-hero-title" className={styles.heroTitle} {...rise(0.12)}>
              The Smartest Way to Bring Best ROI for Sales
            </motion.h1>
            <motion.p className={styles.heroDescription} {...rise(0.2)}>
              The smarter way to manage sales starts with using tools that streamline every step of the process
            </motion.p>
            <motion.div className={styles.heroActions} {...rise(0.28)}>
              <a className={styles.primaryCta} href="#trial">Get 14 Days Free Trial</a>
              <span className={styles.ctaNote}>No Credit Card Required</span>
            </motion.div>
          </div>

          <motion.div className={styles.heroVisual} {...rise(0.38)}>
            <Image className={styles.heroOrbit} src="/salix/hero-orbit.svg" alt="" width={1262} height={546} aria-hidden="true" priority />
            <Image
              className={styles.heroDashboard}
              src="/salix/hero-dashboard.png"
              alt="Salix sales analytics dashboard"
              width={2048}
              height={1560}
              priority
            />
          </motion.div>
        </section>

        <motion.section className={styles.trusted} aria-label="Trusted customers" {...rise(0.48)}>
          <p className={styles.trustedLabel}>Trusted by 17,000+ founders &amp; business owners</p>
          <div className={styles.trustedLogos}>
            {trustedLogos.map((logo) => (
              <Image key={logo} src={`/salix/trusted-logo-${logo}.svg`} alt="" width={135} height={30} aria-hidden="true" />
            ))}
          </div>
        </motion.section>
      </main>
    </>
  );
}
