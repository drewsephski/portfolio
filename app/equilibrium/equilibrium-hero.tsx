"use client";

import { ChevronDown, Infinity, Menu, X } from "lucide-react";
import { useState } from "react";

import styles from "./equilibrium.module.css";

const BG_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4";

const navLinks = [
  { label: "Home", active: true },
  { label: "Wellness", dropdown: true },
  { label: "Routine" },
  { label: "Our Team" },
];

export function EquilibriumHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className={`${styles.page} relative h-screen w-full overflow-hidden`}>
      <video
        className="absolute h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src={BG_VIDEO}
      />

      <nav className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2 text-base font-medium text-white">
          <Infinity size={22} strokeWidth={1.5} aria-hidden="true" />
          <span>Equilibrium</span>
        </div>

        <div className={`${styles.liquidGlass} hidden items-center gap-1 rounded-xl px-2 py-2 md:flex`}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className={`flex items-center gap-0.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                link.active ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
              {link.dropdown && <ChevronDown size={13} className="mt-px" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className={`${styles.liquidGlass} rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5`}
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Begin Now
          </button>
        </div>

        <button
          type="button"
          className={`${styles.liquidGlass} rounded-lg p-2 text-white md:hidden`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="equilibrium-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="equilibrium-mobile-menu"
          className={`${styles.liquidGlass} absolute top-[72px] right-4 left-4 z-30 flex flex-col gap-1 rounded-2xl p-4 md:hidden`}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                link.active ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
              {link.dropdown && <ChevronDown size={13} aria-hidden="true" />}
            </button>
          ))}
          <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
            <button
              type="button"
              className={`${styles.liquidGlass} flex-1 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5`}
            >
              Log in
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Begin Now
            </button>
          </div>
        </div>
      )}

      <section className="absolute bottom-0 left-0 z-20 max-w-2xl px-6 pb-10 sm:px-12 sm:pb-16">
        <h1 className="mb-4 text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
          Live Better, Feel Whole Every Day
        </h1>
        <p className="mb-7 max-w-md text-sm leading-relaxed text-white/60">
          Take charge of how you feel with a companion built for your journey—build routines, follow your
          growth, and unlock tailored insights for a steadier, more vibrant life each day.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:px-7 sm:text-base"
          >
            Start Today
          </button>
          <button
            type="button"
            className={`${styles.liquidGlass} rounded-full px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 sm:px-7 sm:text-base`}
          >
            Discover How
          </button>
        </div>
      </section>
    </main>
  );
}
