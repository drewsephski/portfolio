"use client";

import { useEffect, useState } from "react";
import styles from "./lower-page.module.css";

const A = "/dreammotion/assets/";

const steps = [
  { n: "01", title: "Describe the scene", body: "Write the image or video you want, then add details for style, mood, subject, and format.", image: "830077e971f56b13.png" },
  { n: "02", title: "Refine the direction", body: "Adjust style, aspect ratio, motion, references, or keyframes until the output matches your vision.", image: "37ed420614699ac3.png" },
  { n: "03", title: "Export and publish", body: "Download polished visuals for ads, social content, product pages, storyboards, and campaigns.", image: "ae4ad21773fe6fba.png" },
];

const testimonials = [
  ["DreamMotion helped us turn a week of ad concepting into one afternoon. The image quality and style control made every round sharper.", "Maya S.", "Growth Creative Lead"],
  ["I can storyboard product videos, create thumbnails, and test visual hooks before opening any editing software.", "Dev K.", "Founder"],
  ["The best part is consistency. DreamMotion keeps our product shots, colors, and campaign mood aligned across every format.", "Ari L.", "Brand Designer"],
  ["DreamMotion makes AI video feel practical. I can generate quick motion concepts and share them with clients the same day.", "Ethan R.", "Creative Director"],
];

const gallery = ["1c67cfd7530debf0.png", "ce33b31fca3f7e50.png", "c7aae4bad5689bdf.png", "a0435336cdb19a9d.png", "b6dff5c92a8ea8df.png", "f93db879446c2d1c.png", "762a288963f4a08c.png", "d83e33697b17bf88.png", "f7f6d55bd49761f0.png", "a57c846b5de913d6.png", "a83064472d8cd827.png", "c6174a44f5e7180e.png", "4fde7007c87c2100.png"];

const faqs = [
  ["What can I create with DreamMotion?", "Create AI images and video concepts for ads, social posts, product stories, campaigns, thumbnails, and storyboards."],
  ["Do I need design or video skills?", "No. Describe what you want in plain language, then refine the style and format with simple controls."],
  ["Does DreamMotion support both images and video?", "Yes. DreamMotion is designed for both AI image generation and fast video concept creation."],
  ["Is there a free plan available?", "Yes. You can start on the free plan and explore DreamMotion before upgrading."],
  ["Can I use DreamMotion for commercial work?", "Yes. You can create visuals for commercial campaigns, product pages, advertisements, and social content."],
  ["How do credits work?", "Each generation uses credits based on its format and settings. Your plan shows your available balance before you create."],
];

function GalleryRow({ images, reverse = false }: { images: string[]; reverse?: boolean }) {
  const doubled = [...images, ...images];
  return <div className={styles.marquee}><div className={`${styles.track} ${reverse ? styles.reverse : ""}`}>{doubled.map((src, i) => <img key={`${src}-${i}`} src={A + src} alt="DreamMotion creation" />)}</div></div>;
}

export default function LowerPage() {
  const [testimonial, setTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTestimonial((value) => (value + 1) % testimonials.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  return <div className={styles.lower}>
    <section className={`${styles.section} ${styles.works}`} id="use-cases">
      <div className={styles.heading}><span>How It Works</span><h2>From prompt to finished visual<br />in three simple steps.</h2></div>
      <div className={styles.steps}>
        {steps.map((step) => <article className={styles.step} key={step.n}>
          <div className={styles.stepVisual}><img className={styles.frame} src={A + "32202a06dd111275.png"} alt="" /><img className={styles.stepImage} src={A + step.image} alt="" /></div>
          <div className={styles.stepCopy}><b>{step.n}</b><h3>{step.title}</h3><p>{step.body}</p></div>
        </article>)}
      </div>
    </section>

    <section className={`${styles.section} ${styles.testimonials}`} id="testimonials">
      <div className={styles.testimonialTop}><div className={styles.heading}><span>Testimonials</span><h2>What creators say about us.</h2></div><div className={styles.controls}><button onClick={() => setTestimonial((testimonial + 3) % 4)} aria-label="Previous testimonial">←</button><button onClick={() => setTestimonial((testimonial + 1) % 4)} aria-label="Next testimonial">→</button></div></div>
      <div className={styles.testimonialViewport}><div className={styles.testimonialTrack} style={{ transform: `translateX(calc(${testimonial} * (var(--card-width) + 16px) * -1))` }}>{[...testimonials, ...testimonials].map(([quote, name, role], i) => <article className={styles.quote} key={`${name}-${i}`}><div className={styles.stars}>★★★★★</div><blockquote>“{quote}”</blockquote><div><strong>{name}</strong><small>{role}</small></div></article>)}</div></div>
    </section>

    <section className={`${styles.gallery} ${styles.section}`} id="gallery">
      <div className={styles.heading}><span>Creations</span><h2>See DreamMachine in Action.</h2></div>
      <GalleryRow images={gallery.slice(0, 7)} /><GalleryRow images={gallery.slice(6)} reverse />
    </section>

    <section className={`${styles.section} ${styles.faq}`} id="faq">
      <div className={styles.heading}><span>FAQ</span><h2>Your Questions,<br />Answered clearly.</h2></div>
      <div className={styles.faqList}>{faqs.map(([question, answer], i) => <div className={styles.faqItem} key={question}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{question}</span><i>{openFaq === i ? "−" : "+"}</i></button><div className={`${styles.answer} ${openFaq === i ? styles.answerOpen : ""}`}><p>{answer}</p></div></div>)}</div>
    </section>

    <section className={styles.cta}><img src={A + "4b66c8d1da7317e6.png"} alt="DreamMotion generated artwork" /><div className={styles.ctaCopy}><h2>Start creating with<br />DreamMotion today.</h2><p>Generate your next image, video concept, product shot, or campaign scene with AI in seconds.</p><a href="#top">Try Now <span>↗</span></a></div></section>

    <footer className={styles.footer}>
      <div className={styles.footerGrid}><div className={styles.brand}><strong>DreamMotion</strong><p>AI image and video generation for campaigns, product stories, ads, and social content.</p></div><nav><strong>Explore</strong>{["Home", "Features", "Use Cases", "Testimonials", "Gallary", "FAQ"].map(x => <a key={x} href={x === "Home" ? "#top" : `#${x.toLowerCase().replace(" ", "-").replace("gallary", "gallery")}`}>{x}</a>)}</nav><nav><strong>Pages</strong>{["Home", "Blog", "Pricing", "Terms", "Privacy"].map(x => <a key={x} href="#top">{x}</a>)}</nav><div className={styles.promo}><span>V2 Launch</span><b>30% OFF</b><code>CODE: 30OFF</code></div></div>
      <div className={styles.footerBottom}><span>© 2026 DreamMotion</span><span>Built with love by Dev Dsgn.</span></div>
    </footer>
  </div>;
}
