import { productMetadata } from "@/app/marketplace/seo";
import { ProductStructuredData } from "@/app/marketplace/product-structured-data";
import { ChevronRight } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";
import { Navbar } from "./navbar";
import styles from "./convix.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4";
const POSTER_URL =
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60";

export const metadata = productMetadata("convix");

export default function ConvixPage() {
  const inlineVideoAttributes = {
    "webkit-playsinline": "true",
    "x5-playsinline": "true",
  };

  return (
    <main className={styles.page}>
      <ProductStructuredData slug="convix" />
      <section className={styles.hero} aria-labelledby="convix-heading">
        <video
          className={styles.backgroundVideo}
          src={VIDEO_URL}
          poster={POSTER_URL}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          {...inlineVideoAttributes}
        />
        <div className={styles.videoOverlay} aria-hidden="true" />

        <div className={styles.foreground}>
          <Navbar />

          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span aria-hidden="true" />
              Convix Software
            </div>
            <h1 className={styles.headline} id="convix-heading">
              Shaping <em>Agencies</em>
              <br />
              of tomorrow
            </h1>
            <p className={styles.subtitle}>
              The All-In-One Software Powering the Future of PR Agencies
            </p>
            <a className={styles.cta} href="#">
              Get Started
              <span aria-hidden="true">
                <ChevronRight size={16} strokeWidth={1.8} />
              </span>
            </a>
          </div>

          <DashboardPreview />
        </div>
      </section>
    </main>
  );
}
