"use client";

import { ExternalLink, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BoldArrow, boldArrowGroupClassName } from "./bold-arrow-link";
import styles from "./home.module.css";
import { ProductCardVisual } from "./product-card-visual";

type Product = {
  name: string;
  type: string;
  description: string;
  href: string;
  visual: "sitterfolio" | "voice" | "crm" | "agent" | "crawl" | "design";
  preview: {
    mp4: string;
    webm: string;
    poster: string;
  };
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function ProductGrid({ products }: { products: readonly Product[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (selectedProduct && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [selectedProduct]);

  const closeDialog = () => dialogRef.current?.close();

  return (
    <>
      <div className={styles.productGrid}>
        {products.map((product, index) => (
          <article className={styles.productCard} key={product.name}>
            <button
              className={styles.productPreviewButton}
              type="button"
              aria-label={`Preview ${product.name} landing page`}
              aria-haspopup="dialog"
              onClick={() => setSelectedProduct(product)}
            >
              <span className={styles.productIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.productType}>{product.type}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span className={styles.productVisual} data-visual={product.visual}>
                <ProductCardVisual kind={product.visual} loading={index === 0 ? "eager" : "lazy"} />
              </span>
            </button>
            <a className={`${styles.visit} ${boldArrowGroupClassName}`} href={product.href} target="_blank" rel="noreferrer" aria-label={`Visit ${product.name} (opens in a new tab)`}>
              Visit product <BoldArrow />
            </a>
          </article>
        ))}
      </div>

      <dialog
        className={`${styles.dialog} ${styles.productDialog}`}
        ref={dialogRef}
        aria-labelledby="product-dialog-title"
        onCancel={closeDialog}
        onClose={() => setSelectedProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        {selectedProduct ? (
          <div className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <div>
                <p className={styles.dialogEyebrow}>Live-site preview</p>
                <h2 id="product-dialog-title">{selectedProduct.name}</h2>
              </div>
              <div className={styles.dialogActions}>
                <a href={selectedProduct.href} target="_blank" rel="noreferrer" aria-label={`Visit ${selectedProduct.name} (opens in a new tab)`}>
                  <span className={styles.dialogActionLabel}>Visit product</span>
                  <ExternalLink aria-hidden="true" />
                </a>
                <button className={styles.dialogClose} type="button" aria-label="Close preview" onClick={closeDialog}>
                  <X aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className={`${styles.dialogImageFrame} ${styles.dialogVideoFrame}`}>
              <video
                key={selectedProduct.preview.mp4}
                className={styles.dialogVideo}
                poster={selectedProduct.preview.poster}
                autoPlay={!reducedMotion}
                muted
                playsInline
                loop
                controls
                preload="metadata"
                aria-label={`Smooth scrolling preview of the ${selectedProduct.name} landing page`}
              >
                <source src={selectedProduct.preview.webm} type="video/webm" />
                <source src={selectedProduct.preview.mp4} type="video/mp4" />
              </video>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
