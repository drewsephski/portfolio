"use client";

import { useEffect, useState } from "react";
import styles from "./meridian.module.css";

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

export function MeridianMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className={`${styles.burger} ${isOpen ? styles.isOpen : ""}`}
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div className={styles.mobileMenu} id="mobile-menu" hidden={!isOpen}>
        <nav className={styles.mobileLinks} aria-label="Mobile primary">
          <a href="#" onClick={closeMenu}>Platform</a>
          <a href="#" onClick={closeMenu}>Solutions</a>
          <a href="#" onClick={closeMenu}>Company</a>
          <a href="#" onClick={closeMenu}>Pricing</a>
        </nav>

        <a className={`${styles.button} ${styles.buttonNav}`} href="#" onClick={closeMenu}>
          <span className={styles.buttonLabel}>Book Demo</span>
          <ArrowIcon />
        </a>
      </div>
    </>
  );
}
