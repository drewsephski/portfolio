"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, ShoppingCart } from "lucide-react";
import styles from "./convix.module.css";

const links = ["Home", "Features", "About", "Pages"] as const;

function FlowerLogo() {
  const petals = Array.from({ length: 8 }, (_, index) => {
    const angle = (index * Math.PI) / 4;
    return {
      cx: 16 + Math.cos(angle) * 10,
      cy: 16 + Math.sin(angle) * 10,
    };
  });

  return (
    <a className={styles.logo} href="#" aria-label="Convix Software home">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        {petals.map(({ cx, cy }, index) => (
          <circle key={index} cx={cx} cy={cy} r="3.5" />
        ))}
        <circle cx="16" cy="16" r="3.5" />
      </svg>
    </a>
  );
}

function NavLink({ label, mobile = false }: { label: (typeof links)[number]; mobile?: boolean }) {
  const isHome = label === "Home";
  const isPages = label === "Pages";

  return (
    <a
      className={`${styles.navLink} ${mobile ? styles.mobileNavLink : ""} ${
        isPages ? styles.pagesLink : ""
      }`}
      href="#"
    >
      {isHome && <span className={styles.homeDot} aria-hidden="true" />}
      {label}
      {isPages && <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />}
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Primary navigation">
        <FlowerLogo />

        <div className={styles.desktopLinks}>
          {links.map((link) => (
            <NavLink key={link} label={link} />
          ))}
        </div>

        <div className={styles.navActions}>
          <a className={styles.cartButton} href="#" aria-label="Shopping cart">
            <ShoppingCart size={19} strokeWidth={1.7} />
          </a>
          <a className={styles.earlyAccess} href="#">
            <span className={styles.earlyAccessDesktop}>Get early access</span>
            <span className={styles.earlyAccessMobile}>Early access</span>
            <span className={styles.earlyAccessIcon} aria-hidden="true">
              <ChevronRight size={15} strokeWidth={1.8} />
            </span>
          </a>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="convix-mobile-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            <Menu size={21} strokeWidth={1.8} />
          </button>
        </div>

        {open && (
          <div className={styles.mobileMenu} id="convix-mobile-navigation">
            {links.map((link) => (
              <NavLink key={link} label={link} mobile />
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
