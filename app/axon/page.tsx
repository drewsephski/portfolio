import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import styles from "./axon.module.css";

const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-axon-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-axon-instrument-serif",
});

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4";

const navigationItems = ["Features", "Plans", "Security", "About"] as const;

export const metadata = productMetadata("axon");

function AxonLogo() {
  return (
    <svg
      aria-hidden="true"
      className={styles.logo}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
      <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
  );
}

export default function AxonPage() {
  return (
    <main className={`${styles.page} ${inter.variable} ${instrumentSerif.variable}`}>
      <ProductStructuredData slug="axon" />
      <div className={styles.videoLayer} aria-hidden="true">
        <video
          className={styles.backgroundVideo}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      <header className={styles.navigation}>
        <nav className={styles.navigationPill} aria-label="Primary navigation">
          <AxonLogo />
          <div className={styles.navigationLinks}>
            {navigationItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="axon-heading">
        <div className={styles.badge}>
          <span className={styles.badgeIcon} aria-hidden="true">
            Y
          </span>
          <span>Funded by Y Combinator</span>
        </div>

        <h1 id="axon-heading" className={styles.heading}>
          <span>Deploy digital workers</span>
          <span>for mundane workflows</span>
        </h1>

        <p className={styles.subtitle}>
          Eliminate your tedious browser work and 10x your team&apos;s capacity. Put
          intelligent agents on every routine process so you grow faster and deliver more
          for clients — effortlessly.
        </p>

        <button className={styles.cta} type="button">
          Get Early Access
        </button>
      </section>
    </main>
  );
}
