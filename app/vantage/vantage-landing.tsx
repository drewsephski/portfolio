"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./vantage.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4";

const COMPACT_NAVIGATION_QUERY =
  "(max-width: 790px), (min-width: 620px) and (max-width: 1100px) and (orientation: portrait), (max-width: 950px) and (max-height: 520px) and (orientation: landscape)";

type MotionWindow = Window & {
  __vantageMotionFallback?: number;
};

function Logo() {
  return (
    <svg viewBox="0 0 25 25" aria-hidden="true">
      <defs>
        <clipPath id="vantage-disc">
          <circle cx="12.5" cy="12.5" r="12.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#vantage-disc)">
        <path fill="#ededed" d="M0 0h25v25H0z" />
        <path fill="#050606" d="M-1 4.2 9.7-1l4.6 8.2-7.6 5.2z" />
        <path fill="#737778" d="m14.3 7.2 4.5-5.3 7.4 3.9-8 8.1z" />
        <path fill="#fafafa" d="m6.7 12.4 7.6-5.2 3.9 6.7-7.9 5.2z" />
        <path fill="#0a0b0b" d="m10.3 19.1 7.9-5.2 7.1 7.3-12.1 5.2z" />
        <path fill="#737778" d="m-1 18.4 7.7-6 3.6 6.7L3.4 27z" />
      </g>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.2 7h8.7M7.4 3.35 11.1 7l-3.7 3.65"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="m8.1 5.9 8 5.1-8 5.1V5.9Z" fill="currentColor" />
    </svg>
  );
}

export function VantageLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const compactNavigation = window.matchMedia(COMPACT_NAVIGATION_QUERY);
    const navigation = navigationRef.current;

    const syncNavigation = () => {
      if (!navigation) return;
      navigation.inert = compactNavigation.matches && !menuOpen;
      if (!compactNavigation.matches) setMenuOpen(false);
    };

    syncNavigation();
    compactNavigation.addEventListener("change", syncNavigation);

    return () => compactNavigation.removeEventListener("change", syncNavigation);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    navigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };

    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      const motionWindow = window as MotionWindow;
      if (motionWindow.__vantageMotionFallback) {
        window.clearTimeout(motionWindow.__vantageMotionFallback);
      }
      document.documentElement.classList.remove("motion-pending");
    };
  }, []);

  const finishEntrance = () => {
    const motionWindow = window as MotionWindow;
    document.documentElement.classList.remove("motion-pending");
    if (motionWindow.__vantageMotionFallback) {
      window.clearTimeout(motionWindow.__vantageMotionFallback);
      delete motionWindow.__vantageMotionFallback;
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={styles.viewport}>
      <section className={styles.screen} id="screen">
        <video
          className={styles.background}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        <header
          ref={headerRef}
          className={`${styles.header} ${menuOpen ? styles.menuOpen : ""}`}
        >
          <a className={styles.brand} href="#screen" aria-label="Vantage home">
            <Logo />
          </a>

          <div
            ref={navigationRef}
            className={styles.headerActions}
            id="tablet-navigation"
          >
            <nav className={styles.nav} aria-label="Primary navigation">
              <a className={styles.active} href="#screen" onClick={closeMenu}>
                Home
              </a>
              <a href="#" onClick={closeMenu}>About</a>
              <a href="#" onClick={closeMenu}>Services</a>
              <a href="#" onClick={closeMenu}>Contact</a>
            </nav>

            <div className={styles.timePanel}>
              <span className={styles.timeLabel}>Timezone</span>
              <span className={styles.timeValue}>9:47 PM&nbsp; • &nbsp;14 July 2026</span>
            </div>

            <button className={styles.signUp} type="button">Sign Up</button>
          </div>

          <button
            ref={toggleRef}
            className={styles.menuToggle}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="tablet-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path className={styles.menuLineTop} d="M5 8.5h14" />
              <path className={styles.menuLineBottom} d="M5 15.5h14" />
            </svg>
          </button>
        </header>

        <section className={styles.hero} aria-labelledby="vantage-title">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} id="vantage-title">
              <span className={`${styles.line} ${styles.lineOne}`}>
                <span className={styles.lineReveal}>Stop Digging</span>
              </span>
              <span className={`${styles.line} ${styles.lineTwo}`}>
                <span className={styles.lineReveal}>Through Dashboards.</span>
              </span>
            </h1>

            <p className={styles.heroCopy}>
              Your metrics are scattered across a dozen dashboards.<br />
              Vantage bring them into one clear signal, so every<br />
              decision is backed by data you actually trust.
            </p>

            <button className={styles.primaryCta} type="button">
              <span className={styles.ctaLabel}>Get Started</span>
              <span className={styles.arrowBox}>
                <ArrowIcon />
              </span>
            </button>
          </div>

          <article className={styles.demoCard} onAnimationEnd={finishEntrance}>
            <div className={styles.demoVisual}>
              <Image
                src="/vantage/watch-demo-thumbnail.png"
                alt="Abstract red and blue smoke"
                fill
                priority
                sizes="(max-width: 619px) 150px, 200px"
              />
              <button className={styles.play} type="button" aria-label="Play demo">
                <PlayIcon />
              </button>
            </div>
            <button className={styles.watchButton} type="button">Watch Demo</button>
          </article>
        </section>
      </section>
    </main>
  );
}
