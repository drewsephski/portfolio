"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./vesper.module.css";

type MotionStyle = CSSProperties & { "--d": string };

function motionStyle(delay: string): MotionStyle {
  return { "--d": delay };
}

function classes(...names: Array<string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => styles[name])
    .join(" ");
}

function LogoMark() {
  return (
    <svg className={classes("logo-mark")} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <g transform="rotate(-30 12 12)">
        <circle cx="7.3" cy="3.2" r="1.45" />
        <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <circle cx="16.7" cy="20.8" r="1.45" />
      </g>
    </svg>
  );
}

function BadgeStar() {
  return (
    <svg className={classes("badge-star")} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg className={classes("stat-icon")} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="workflow-left" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0.38" stopColor="#ffffff" />
          <stop offset="0.62" stopColor="#3a3a3a" />
        </linearGradient>
        <linearGradient id="workflow-right" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0.38" stopColor="#3a3a3a" />
          <stop offset="0.62" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#workflow-left)" />
      <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#workflow-right)" />
      <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className={classes("stat-icon")} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
      <path d="M12 7.1v7.4M8.15 12.35L12 16.2l3.85-3.85" fill="none" stroke="#111111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamAvatarsIcon() {
  return (
    <svg className={classes("stat-icon-wide")} viewBox="0 0 40 22" aria-hidden="true">
      <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
      <path d="M6.8 9.5 7.45 5.9l2.2 2.4M13.6 9.5l-.65-3.6-2.2 2.4" fill="#f4f4f4" />
      <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
      <circle cx="8.75" cy="11.8" r="0.7" fill="#1a1a1a" />
      <circle cx="11.65" cy="11.8" r="0.7" fill="#1a1a1a" />
      <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
      <circle cx="17.1" cy="10.5" r="1.7" fill="#111111" />
      <circle cx="23.3" cy="10.5" r="1.7" fill="#111111" />
      <ellipse cx="20.2" cy="12.7" rx="1.15" ry="0.85" fill="#111111" />
      <path d="M17.55 14.2c1.45 1.55 3.85 1.55 5.3 0" fill="none" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
      <text x="30.2" y="15.1" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="12.5" fontWeight="700" textAnchor="middle">e</text>
    </svg>
  );
}

const navItems = [
  { label: "Benefits", href: "#benefits", motion: "appear--scale", delay: "0.16s" },
  { label: "How It Works", href: "#how-it-works", motion: "appear--soft", delay: "0.28s" },
  { label: "FAQs", href: "#faqs", motion: "appear--scale", delay: "0.40s" },
  { label: "Pricing", href: "#pricing", motion: "appear--soft", delay: "0.52s" },
] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const animated = [...root.querySelectorAll<HTMLElement>(`.${styles.appear}`)];
    const photo = root.querySelector<HTMLElement>(`.${styles["hero-photo"]}`);
    const cleanups = animated.map((element) => {
      const finish = () => element.classList.add(styles["is-in"]);
      element.addEventListener("animationend", finish, { once: true });
      return () => element.removeEventListener("animationend", finish);
    });

    const frameOne = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        [...animated, photo].filter((element): element is HTMLElement => Boolean(element)).forEach((element) => {
          const hasActiveAnimation = element
            .getAnimations()
            .some((animation) => animation.playState === "running" || animation.playState === "finished");
          if (!hasActiveAnimation) element.classList.add(styles["is-in"]);
        });
      });
    });
    const settleAnimations = window.setTimeout(() => {
      animated.forEach((element) => element.classList.add(styles["is-in"]));
      photo?.classList.add(styles["is-in"]);
    }, 2600);

    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      cancelAnimationFrame(frameOne);
      window.clearTimeout(settleAnimations);
      cleanups.forEach((cleanup) => cleanup());
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={classes("vesper", menuOpen && "menu-open")}>
      <div className={classes("grain")} aria-hidden="true" />
      <div className={classes("hero-photo")} aria-hidden="true">
        <video className={classes("hero-video")} autoPlay muted loop playsInline preload="auto">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={classes("page")}>
        <div className={classes("menu-backdrop")} aria-hidden="true" />
        <header className={classes("header")}>
          <a className={classes("logo", "appear", "appear--scale")} href="#top" aria-label="Vesper.ai" style={motionStyle("0.08s")}>
            <LogoMark />
            <span>Vesper<span className={classes("logo-suffix")}>.ai</span></span>
          </a>

          <nav className={classes("site-nav")} id="site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.label} className={classes("nav-link", "appear", item.motion)} href={item.href} style={motionStyle(item.delay)} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className={classes("btn", "btn-solid", "header-cta", "appear", "appear--scale")} href="#start" style={motionStyle("0.34s")}>Start for Free</a>
          <button className={classes("menu-toggle", "appear", "appear--scale")} type="button" aria-controls="site-nav" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} style={motionStyle("0.34s")} onClick={() => setMenuOpen((open) => !open)}>
            <span className={classes("menu-bars")} aria-hidden="true">
              <span className={classes("menu-bar")} />
              <span className={classes("menu-bar")} />
              <span className={classes("menu-bar")} />
            </span>
          </button>
        </header>

        <main className={classes("hero")} id="top">
          <div className={classes("hero-copy")}>
            <div className={classes("badge", "appear", "appear--pop")} style={motionStyle("0.22s")}>
              <BadgeStar />
              <span>Operational AI Infrastructure</span>
            </div>
            <h1>
              <span className={classes("headline-line", "appear", "appear--mask")} style={motionStyle("0.42s")}>Train <em>AI agents</em> on your</span>
              <span className={classes("headline-line", "appear", "appear--mask")} style={motionStyle("0.62s")}>workflows in minutes.</span>
            </h1>
            <p className={classes("lede", "appear", "appear--soft")} style={motionStyle("0.82s")}>
              Deploy adaptive AI agents that learn, execute, and scale operational tasks across your business.
            </p>
            <div className={classes("hero-actions")}>
              <a className={classes("btn", "btn-solid", "appear", "appear--btn")} href="#start" style={motionStyle("0.96s")}>Start for Free</a>
              <a className={classes("btn", "btn-ghost", "appear", "appear--side")} href="#demo" style={motionStyle("1.10s")}>See it in action</a>
            </div>
          </div>
        </main>

        <footer className={classes("stats")} aria-label="Platform statistics">
          <div className={classes("stat", "appear", "appear--stat")} style={motionStyle("1.12s")}>
            <WorkflowIcon />
            <span>4.2M+ workflows automated</span>
          </div>
          <div className={classes("stat", "appear", "appear--stat")} style={motionStyle("1.28s")}>
            <DownloadIcon />
            <span>92% reduction in manual operations</span>
          </div>
          <div className={classes("stat", "appear", "appear--stat")} style={motionStyle("1.44s")}>
            <TeamAvatarsIcon />
            <span>180+ operational teams onboarded</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
