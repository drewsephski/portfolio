"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./hero.module.css";

const navigation = ["Home", "About", "Features", "Pricing", "Blog", "Contact"];
const marks = ["dY6gFYwTiNDBOpNo0XjrZuC2k0.svg","GO2mgXJdSWHQC4kP9mhLnl2gI.svg","ik68RmZ03YqFseGfuYghKZayI.svg","GQK4qUiDfkbd1MIRLv3w2a00m8.svg","VPPDzyaDcAlhEkw70xfY6wKe0Lg.svg","syEfnea7a159JvcSbIVdHseAe8g.svg"];

function Counter({ prefix = "", target, suffix }: { prefix?: string; target: number; suffix: string }) {
  // Render the final value on the server so crawlers and no-JS visitors see real numbers, then count up on the client.
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now(); let frame = 0;
    const tick = (now: number) => { const p = Math.min((now - start) / 1100, 1); setValue(Math.round(target * (1 - (1 - p) ** 3))); if (p < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{prefix}{value}{suffix}</>;
}
function Arrow() { return <Image aria-hidden src="/infranex-live/dvNbIo7IbmzkaOdtCN5qcUchpM.svg" alt="" width={24} height={24} />; }
function Button({ children, href, primary = false }: { children: string; href: string; primary?: boolean }) {
  return <Link className={`${styles.button} ${primary ? styles.primary : ""}`} href={href}><span className={styles.labelViewport}><span className={styles.labelTrack}><span>{children}</span><span aria-hidden>{children}</span></span></span><span className={styles.arrowViewport}><span className={styles.arrowTrack}><span><Arrow /></span><span aria-hidden><Arrow /></span></span></span></Link>;
}

export function InfranexHero() {
  return <>
    <section className={styles.hero}>
      <video className={styles.video} autoPlay loop muted playsInline aria-hidden><source src="/infranex-live/hero.webm" type="video/webm" /></video><div className={styles.heroShade} />
      <header className={styles.header}><div className={styles.navbar}>
        <Link href="/infranex" aria-label="Infranex home"><Image className={styles.logo} src="/infranex-live/Pfz7HDkRJDSNaoNeKKqjcirubo.svg" alt="Infranex" width={114} height={20} priority /></Link>
        <nav className={styles.navigation}>{navigation.map(item => <Link href={item === "Home" ? "/infranex" : `#${item.toLowerCase()}`} key={item}>{item}</Link>)}</nav>
        <Button href="#contact">Get Started</Button><button className={styles.menu} type="button" aria-label="Open menu"><span /><span /></button>
      </div></header>
      <div className={styles.heroContent}><div className={styles.eyebrow}><Image src="/infranex-live/9MgzCqL6RYOVADFY6awtidfluA.svg" alt="" width={18} height={18} />Smarter Task Management</div><h1>Smarter by design.<br />Simplified by AI.</h1><p>Automate your workflows, prioritize, and focus on what truly matters.</p><Button href="#contact" primary>Get Started Now</Button></div>
      <div className={styles.trust}><p>Trusted by the World’s Largest Companies</p><div className={styles.logoClip}><div className={styles.companyMarks}>{[...marks,...marks].map((mark,i) => <Image src={`/infranex-live/${mark}`} alt="" width={147} height={37} key={`${mark}-${i}`} />)}</div></div></div>
    </section>
    <section className={styles.overview} id="about">
      <video className={styles.overviewVideo} autoPlay loop muted playsInline aria-hidden><source src="/infranex-live/features.webm" type="video/webm" /></video><div className={styles.overviewShade} />
      <div className={styles.overviewContent}><div className={styles.overviewCopy}><Image className={styles.overviewIcon} src="/infranex-live/9MgzCqL6RYOVADFY6awtidfluA.svg" alt="" width={32} height={32}/><p>Our team of data scientists, engineers, and creatives craft tailored AI solutions that solve real-world challenges across industries.</p><Link href="#features">LEARN MORE <Arrow /></Link></div>
      <div className={styles.metrics}><div><span>Performance Snapshot</span><strong><Counter prefix="$" target={5} suffix="M+" /></strong></div><div><span>Digital Reach</span><strong><Counter target={250} suffix="+" /></strong></div><div><span>Client Trust</span><strong><Counter target={98} suffix="%" /></strong></div></div></div>
    </section>
  </>;
}
