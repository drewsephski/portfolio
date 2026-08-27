/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
} from "react";
import styles from "./vantage.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4";

const navItems = ["Home", "About", "Services", "Contact"] as const;

function BrandMark() {
  return (
    <svg viewBox="0 0 25 25" role="img" aria-hidden="true">
      <defs>
        <clipPath id="vantage-disc">
          <circle cx="12.5" cy="12.5" r="12.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#vantage-disc)">
        <rect width="25" height="25" fill="#ededed" />
        <path d="M-2 3.2 10.7 12.5-1 22.6Z" fill="#050606" />
        <path d="m10.7 12.5 6.5-14.2 3.2 14.2Z" fill="#737778" />
        <path d="m10.7 12.5 9.7 0 6.8 13.8Z" fill="#0a0b0b" />
        <path d="m10.7 12.5 16.5 13.8H1.2Z" fill="#fafafa" />
        <path d="m10.7 12.5-9.5 13.8L-2 22.6Z" fill="#737778" />
      </g>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 11 11 3m0 0H5m6 0v6"
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
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="m6.7 4.8 7 4.2-7 4.2Z" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <span className={styles.menuIcon} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export function VantageClient({ fontClassName }: { fontClassName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPending, setMotionPending] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const fallbackRef = useRef<number | null>(null);

  const finishEntrance = () => {
    setMotionPending(false);
    document.documentElement.classList.remove("motion-pending");
    if (fallbackRef.current !== null) {
      window.clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previous = {
      rootOverflow: root.style.overflow,
      rootBackground: root.style.background,
      bodyOverflow: body.style.overflow,
      bodyBackground: body.style.background,
    };

    root.style.overflow = "hidden";
    root.style.background = "#000";
    body.style.overflow = "hidden";
    body.style.background = "#000";

    if (reducedMotion.matches) {
      fallbackRef.current = window.setTimeout(finishEntrance, 0);
    } else {
      root.classList.add("motion-pending");
      fallbackRef.current = window.setTimeout(finishEntrance, 3500);
    }

    return () => {
      if (fallbackRef.current !== null) {
        window.clearTimeout(fallbackRef.current);
      }
      root.classList.remove("motion-pending");
      root.style.overflow = previous.rootOverflow;
      root.style.background = previous.rootBackground;
      body.style.overflow = previous.bodyOverflow;
      body.style.background = previous.bodyBackground;
    };
  }, []);

  useEffect(() => {
    const navigation = navigationRef.current;
    const toggle = toggleRef.current;
    if (!navigation || !toggle) return;

    const syncNavigation = () => {
      const toggleVisible = window.getComputedStyle(toggle).display !== "none";
      navigation.inert = toggleVisible && !menuOpen;
      if (!toggleVisible && menuOpen) setMenuOpen(false);
    };

    syncNavigation();
    window.addEventListener("resize", syncNavigation);

    return () => {
      navigation.inert = false;
      window.removeEventListener("resize", syncNavigation);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeFromOutside = (event: PointerEvent) => {
      const header = headerRef.current;
      if (header && !header.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);
    requestAnimationFrame(() => {
      navigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    });

    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, [menuOpen]);

  const handleCardAnimationEnd = (
    event: ReactAnimationEvent<HTMLElement>,
  ) => {
    if (event.target === event.currentTarget) finishEntrance();
  };

  return (
    <main
      className={`${styles.viewport} ${fontClassName} ${
        motionPending ? styles.motionPending : ""
      }`}
    >
      <section className={styles.screen} id="screen">
        <video
          className={styles.background}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        <header
          ref={headerRef}
          className={`${styles.header} ${menuOpen ? styles.menuOpen : ""}`}
        >
          <a className={styles.brand} href="#screen" aria-label="Vantage home">
            <BrandMark />
          </a>

          <div
            ref={navigationRef}
            className={styles.headerActions}
            id="tablet-navigation"
          >
            <nav className={styles.nav} aria-label="Primary navigation">
              {navItems.map((item) => (
                <a
                  key={item}
                  className={item === "Home" ? styles.active : undefined}
                  href={`#${item.toLowerCase()}`}
                  aria-current={item === "Home" ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className={styles.timePanel}>
              <span className={styles.timeLabel}>Timezone</span>
              <span className={styles.timeValue}>
                9:47 PM&nbsp; • &nbsp;14 July 2026
              </span>
            </div>

            <button className={styles.signUp} type="button">
              <span>Sign Up</span>
            </button>
          </div>

          <button
            ref={toggleRef}
            className={styles.menuToggle}
            type="button"
            aria-controls="tablet-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </header>

        <section className={styles.hero} aria-labelledby="vantage-heading">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} id="vantage-heading">
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

          <article
            className={styles.demoCard}
            onAnimationEnd={handleCardAnimationEnd}
          >
            <div className={styles.demoVisual}>
              <img
                src="/assets/watch-demo-thumbnail.png"
                alt="Abstract red and blue smoke"
              />
              <button className={styles.play} type="button" aria-label="Play demo">
                <PlayIcon />
              </button>
            </div>
            <button className={styles.watchButton} type="button">
              <span>Watch Demo</span>
            </button>
          </article>
        </section>
      </section>
    </main>
  );
}
