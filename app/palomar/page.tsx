"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Triangle } from "lucide-react";
import styles from "./palomar.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4";

type NavbarProps = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

function Navbar({ menuOpen, onToggleMenu, onCloseMenu }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateNavbar = () => setScrolled(window.scrollY > 20);

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    return () => window.removeEventListener("scroll", updateNavbar);
  }, []);

  return (
    <>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
        aria-label="Primary navigation"
      >
        <div className={styles.navContainer}>
          <div className={styles.navBar}>
            <div className={`${styles.desktopLinks} ${styles.animateFadeDown} ${styles.stagger1}`}>
              <button type="button" className={styles.solutionsButton}>
                Solutions
                <ChevronDown className={styles.smallIcon} aria-hidden="true" />
              </button>
              <a href="#" className={styles.desktopLink}>
                Plans
              </a>
              <a href="#" className={styles.desktopLink}>
                News
              </a>
            </div>

            <a
              href="#top"
              className={`${styles.logo} ${styles.animateFadeDown} ${styles.stagger2}`}
              aria-label="Palomar home"
            >
              <Triangle className={styles.logoIcon} aria-hidden="true" />
              <span className={styles.logoText}>Palomar</span>
            </a>

            <a
              href="#"
              className={`${styles.desktopCta} ${styles.animateFadeDown} ${styles.stagger3}`}
            >
              Try It Free
            </a>

            <button
              type="button"
              className={styles.menuToggle}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={onToggleMenu}
            >
              <span className={styles.menuBars} aria-hidden="true">
                <span
                  className={`${styles.menuBar} ${styles.menuBarTop} ${
                    menuOpen ? styles.menuBarTopOpen : ""
                  }`}
                />
                <span
                  className={`${styles.menuBar} ${styles.menuBarBottom} ${
                    menuOpen ? styles.menuBarBottomOpen : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
          <a href="#" className={styles.mobileLink} onClick={onCloseMenu}>
            Solutions
          </a>
          <a href="#" className={styles.mobileLink} onClick={onCloseMenu}>
            Plans
          </a>
          <a href="#" className={styles.mobileLink} onClick={onCloseMenu}>
            News
          </a>
          <a href="#" className={styles.mobileCta} onClick={onCloseMenu}>
            Try It Free
          </a>
        </div>
      </div>
    </>
  );
}

function TrustedBy() {
  return (
    <div className={`${styles.trusted} ${styles.animateFadeUp} ${styles.stagger5}`}>
      <p className={styles.trustedLabel}>Backed by</p>
      <div className={`${styles.logoRow} ${styles.animateFadeUp} ${styles.stagger6}`}>
        <span className={`${styles.wordmark} ${styles.meridian}`}>Meridian</span>
        <span className={`${styles.wordmark} ${styles.stellex}`}>STELLEX</span>
        <span className={`${styles.wordmark} ${styles.luminar}`}>Luminar</span>
        <span className={`${styles.wordmark} ${styles.overland}`}>OVERLAND</span>
        <span className={`${styles.wordmark} ${styles.kinetic}`}>Kinetic</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.videoLayer}>
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className={styles.video}
        />
      </div>

      <div className={styles.heroContent}>
        <a href="#" className={`${styles.announcement} ${styles.animateFadeUp} ${styles.stagger3}`}>
          <span>Live for everyone today! Offering $1MM in credits.</span>
          <ArrowRight className={styles.smallIcon} aria-hidden="true" />
        </a>

        <h1 className={`${styles.headline} ${styles.animateFadeUp} ${styles.stagger4}`}>
          One unified system to build,
          <br className={styles.desktopBreak} /> test, ship, and observe LLMs
        </h1>

        <TrustedBy />
      </div>
    </section>
  );
}

export default function PalomarPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <main className={styles.page}>
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      <Hero />
    </main>
  );
}
