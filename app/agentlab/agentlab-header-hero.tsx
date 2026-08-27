"use client";

import Image from "next/image";
import { useState } from "react";

import { ArrowIcon, PlusIcon } from "./icons";
import styles from "./agentlab-header-hero.module.css";

const navigation = ["Product", "Case Study", "Pricing", "Company"];
const actions = [
  "Customer Support Agent",
  "Sales Lead Qualifier",
  "Data Analysis Agent",
  "Email Responder",
];

function RollingLabel({ children }: { children: string }) {
  return (
    <span className={styles.rollWindow}>
      <span className={styles.rollTrack}>
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

export function AgentLabHeaderHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={styles.marquee} aria-label="AgentLab funding announcement">
        <div className={styles.marqueeTrack}>
          {[0, 1, 2, 3].map((item) => (
            <span key={item}>
              AgentLab Raises $5M+ Seed To Build the Future <ArrowIcon />
            </span>
          ))}
        </div>
      </aside>

      <header className={styles.header}>
        <a className={styles.logo} href="#" aria-label="AgentLab home">
          <span className={styles.logoMark} aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
          </span>
          <span>AgentLab</span>
        </a>

        <nav id="agentlab-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <a className={styles.mobileCta} href="#get-started"><RollingLabel>Get Started</RollingLabel></a>
        </nav>

        <a className={styles.headerCta} href="#get-started"><RollingLabel>Get Started</RollingLabel></a>
        <button
          className={styles.menuToggle}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="agentlab-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main className={styles.hero}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}><b>Y</b> BACKED BY Y COMBINATOR</p>
          <h1>Turn Your AI Product Into a<br className={styles.desktopBreak} /> Website That Sells</h1>
          <p className={styles.copy}>Create intelligent agents that understand context, automate workflows, and execute tasks reliably across your operations.</p>
          <div className={styles.buttons}>
            <a className={styles.secondaryButton} href="#sales"><RollingLabel>Talk to Sales</RollingLabel></a>
            <a className={styles.primaryButton} href="#start"><ArrowIcon /><RollingLabel>Start for Free</RollingLabel></a>
          </div>
        </section>

        <section className={styles.mediaGrid} aria-label="AgentLab product preview">
          <div className={styles.agentVisual}>
            <div className={styles.blueGeometry} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.agentCard}>
              <h2>AUTOMATE TASKS WITH AI AGENT</h2>
              <div className={styles.prompt}>
                <span>How can I help you today?</span>
                <button type="button" aria-label="Send prompt"><ArrowIcon /></button>
              </div>
              <p className={styles.actionsLabel}>ACTIONS</p>
              <div className={styles.actionList}>
                {actions.map((action) => <button type="button" key={action}><PlusIcon />{action}</button>)}
              </div>
            </div>
          </div>
          <div className={styles.portrait}>
            <Image src="/agentlab/asset-001.png" alt="AgentLab user working with an AI agent" fill sizes="(max-width: 767px) 100vw, 33vw" priority />
            <span className={styles.pixelVeil} aria-hidden="true" />
          </div>
        </section>
      </main>
    </div>
  );
}
