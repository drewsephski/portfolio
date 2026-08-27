/* eslint-disable @next/next/no-page-custom-font */
import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { MeridianMobileNavigation } from "./meridian-mobile-navigation";
import styles from "./meridian.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_075824_7c8a2ef3-826c-43ca-81a1-162429faa306.mp4";

export const metadata: Metadata = {
  title: "Meridian — Revenue Intelligence for SaaS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type DelayStyle = CSSProperties & { "--d": string };

function delay(value: string): DelayStyle {
  return { "--d": value };
}

function ArrowIcon() {
  return (
    <span className={styles.buttonIcon} aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M4 10h10.2M10.4 5.6 15.2 10l-4.8 4.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function DemoButton({ className }: { className: string }) {
  return (
    <a className={`${styles.button} ${className}`} href="#">
      <span className={styles.buttonLabel}>Book Demo</span>
      <ArrowIcon />
    </a>
  );
}

function Logo() {
  return (
    <a className={styles.logo} href="#" aria-label="Meridian">
      <svg viewBox="0 0 42 34" aria-hidden="true">
        <polygon points="12,0 30,0 33.2,3.2 15.2,3.2" />
        <polygon points="14.6,5.6 32.6,5.6 35.8,8.8 17.8,8.8" />
        <polygon points="17.2,11.2 35.2,11.2 38.4,14.4 20.4,14.4" />
        <polygon points="3.2,16.8 21.2,16.8 24.4,20 6.4,20" />
        <polygon points="5.8,22.4 23.8,22.4 27,25.6 9,25.6" />
        <polygon points="8.4,28 26.4,28 29.6,31.2 11.6,31.2" />
      </svg>
    </a>
  );
}

export default function MeridianPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      />

      <main className={styles.page}>
        <div className={styles.background} aria-hidden="true">
          <video className={styles.backgroundVideo} autoPlay muted loop playsInline>
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </div>

        <header className={styles.navigation}>
          <nav className={styles.navigationLinks} aria-label="Primary">
            <a href="#" style={delay("0.02s")}>Platform</a>
            <a href="#" style={delay("0.08s")}>Solutions</a>
            <a href="#" style={delay("0.14s")}>Company</a>
            <a href="#" style={delay("0.2s")}>Pricing</a>
          </nav>

          <Logo />

          <DemoButton className={`${styles.buttonNav} ${styles.navigationDemo}`} />

          <MeridianMobileNavigation />
        </header>

        <section className={styles.hero} aria-labelledby="meridian-heading">
          <div className={`${styles.badge} ${styles.wipe}`} style={delay("0.18s")}>
            <span className={styles.badgeMark} aria-hidden="true" />
            <span>Revenue Intelligence for SaaS</span>
          </div>

          <h1 className={styles.headline} id="meridian-heading">
            <span className={styles.headlineMask}>
              <span className={styles.headlineRise} style={delay("0.26s")}>
                Every revenue decision
              </span>
            </span>
            <span className={styles.headlineMask}>
              <span
                className={`${styles.headlineRise} ${styles.headlineLine}`}
                style={delay("0.4s")}
              >
                <span className={styles.headlineMuted}>starts with a </span>
                <span className={styles.headlineAccent} data-text="better question.">
                  better question.
                </span>
              </span>
            </span>
          </h1>

          <div className={styles.actions}>
            <DemoButton
              className={`${styles.buttonLight} ${styles.wipe}`}
            />
            <a
              className={`${styles.button} ${styles.buttonGhost} ${styles.wipe}`}
              href="#"
              style={delay("0.66s")}
            >
              <span className={styles.buttonLabel}>See Meridian in Action</span>
            </a>
          </div>
        </section>

        <p className={styles.lede}>
          <span className={styles.ledeRise} style={delay("0.78s")}>
            Meridian continuously analyzes product usage, customer behavior and commercial data to identify
            expansion opportunities, predict revenue risk, and recommend the highest-impact actions for your
            team.
          </span>
        </p>
      </main>
    </>
  );
}
