"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./next-layer.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4";

const navigation = ["About", "Features", "FAQ", "Contact"] as const;

function BrandMark() {
  return (
    <svg viewBox="0 0 31.5 48.5" aria-hidden="true">
      <defs>
        <linearGradient id="next-layer-brand" x1="8" y1="0" x2="34.1" y2="28.9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9e9e9e" />
          <stop offset=".28" stopColor="#a6a6a6" />
          <stop offset=".34" stopColor="#a3a3a3" />
          <stop offset=".40" stopColor="#3a3a3a" />
          <stop offset=".55" stopColor="#414141" />
          <stop offset=".60" stopColor="#7a7a7a" />
          <stop offset=".68" stopColor="#8e8e8e" />
          <stop offset=".80" stopColor="#a9a9a9" />
          <stop offset=".95" stopColor="#c4c4c4" />
          <stop offset="1" stopColor="#cccccc" />
        </linearGradient>
      </defs>
      <path d="M21.5 0 L21.5 19.5 L31.5 19.5 L31.5 29 L10 48.5 L10 28.5 L0.5 28.5 L0.5 18.5 Z" fill="url(#next-layer-brand)" />
      <rect x="0.5" y="18.5" width="9" height="10" fill="#fdfdfd" />
      <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
    </svg>
  );
}

function PartnerOne() {
  return (
    <svg viewBox="0 0 30 31" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M1 1h28v29H1V1Zm4 4v21h20V5H5Zm14.5 11.1a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2Z" clipRule="evenodd" />
      <circle cx="11" cy="20.5" r="5.2" fill="currentColor" />
    </svg>
  );
}

function PartnerTwo() {
  return (
    <svg viewBox="0 0 25 30" aria-hidden="true">
      <rect y="0" width="4.2" height="30" rx="2.1" fill="currentColor" />
      <path fill="currentColor" d="M14.2 1.2a9.8 9.8 0 1 0 0 19.6 4.9 4.9 0 1 1 0 9.8 9.8 9.8 0 1 0 0-19.6 4.9 4.9 0 1 1 0-9.8Z" />
      <circle cx="14.2" cy="6.1" r="1.65" fill="#050505" />
      <circle cx="14.2" cy="25.7" r="1.65" fill="#050505" />
    </svg>
  );
}

function PartnerThree() {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12.35" stroke="currentColor" strokeWidth="3.1" />
      <path d="M6.6 13.3c2.4-4.5 6.5-5.4 10.1-3.3 2.5 1.5 3.5 4.7 1.8 7.1-1.5 2.1-4.7 2.4-6.3.6-1.2-1.3-.8-3.5.8-4.3 1.2-.6 2.8 0 3 1.3" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M9.1 19.4c-1.6-1.5-2.5-3.5-2.5-5.7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function PartnerFour() {
  return (
    <svg viewBox="0 0 28 25.5" fill="none" aria-hidden="true">
      <path d="M1.1 11.8C4.5 3.9 9.2.2 14.1.2c5 0 9.6 3.7 12.8 11.6-3.9-2.4-8.1-3.6-12.8-3.6-4.7 0-9 1.2-13 3.6Z" fill="currentColor" />
      <path d="M2.2 15.8c7.8 4.6 15.9 4.6 23.6 0M4.6 21.7c6.3 3 12.6 3 18.9 0" stroke="currentColor" strokeWidth="3.05" strokeLinecap="round" />
    </svg>
  );
}

const partnerMarks = [PartnerOne, PartnerTwo, PartnerThree, PartnerFour];

export function NextLayerClient({ fontClassName }: { fontClassName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previous = {
      rootHeight: root.style.height,
      rootBackground: root.style.background,
      bodyHeight: body.style.height,
      bodyOverflow: body.style.overflow,
      bodyBackground: body.style.background,
    };

    root.style.height = "100%";
    root.style.background = "#050505";
    body.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.background = "#050505";

    return () => {
      root.style.height = previous.rootHeight;
      root.style.background = previous.rootBackground;
      body.style.height = previous.bodyHeight;
      body.style.overflow = previous.bodyOverflow;
      body.style.background = previous.bodyBackground;
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const closeOnLandscape = () => {
      if (window.innerWidth / window.innerHeight > 1.1) setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnLandscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnLandscape);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      className={`${styles.stage} ${fontClassName} ${menuOpen ? styles.open : ""}`}
      id="top"
    >
      <div className={styles.plate} aria-hidden="true">
        <video className={styles.plateVideo} autoPlay muted loop playsInline preload="auto" tabIndex={-1}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      <header className={styles.topbar}>
        <a className={styles.brand} href="#top" aria-label="Home">
          <BrandMark />
        </a>

        <nav className={styles.links} aria-label="Primary">
          {navigation.map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`}>{label}</a>
          ))}
        </nav>

        <a className={`${styles.pill} ${styles.pillNav}`} href="#get-started">
          <span>Get Started</span>
        </a>

        <button
          ref={burgerRef}
          className={styles.burger}
          id="burger"
          type="button"
          aria-controls="next-layer-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i />
          <i />
        </button>
      </header>

      <nav
        className={styles.menu}
        id="next-layer-menu"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.menuInner}>
          <p className={styles.menuEyebrow}>Menu</p>
          <ul className={styles.menuList}>
            {navigation.map((label) => (
              <li key={label}>
                <a href={`#${label.toLowerCase()}`} onClick={closeMenu}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.menuFoot}>
            <a className={`${styles.pill} ${styles.menuPill}`} href="#get-started" onClick={closeMenu}>
              <span>Get Started</span>
            </a>
            <a className={styles.menuGhost} href="#architecture" onClick={closeMenu}>View Architecture</a>
          </div>
        </div>
      </nav>

      <main className={styles.hero}>
        <h1 className={styles.headline}>
          <span>The Next Layer</span>
          <span>of Intelligence</span>
        </h1>
        <p className={styles.subcopy}>
          <span>A unified infrastructure platform to help teams build,</span>
          <span>ship, and scale AI systems with confidence.</span>
        </p>
        <div className={styles.actions}>
          <a className={`${styles.pill} ${styles.pillCta}`} href="#get-started">
            <span>Get Started</span>
          </a>
          <a className={styles.ghost} href="#architecture">View Architecture</a>
        </div>
      </main>

      <div className={styles.logos} aria-label="Trusted partners">
        {partnerMarks.map((Mark, index) => (
          <div className={`${styles.logo} ${styles[`logo${index + 1}`]}`} key={index}>
            <Mark />
            <span className={styles.wordmark}>
              logoipsum{index === 1 ? <i className={styles.dot} /> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
