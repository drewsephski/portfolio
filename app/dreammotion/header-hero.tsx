import Image from "next/image";

import styles from "./header-hero.module.css";

const navigation = [
  ["Feature", "#features"],
  ["Usecases", "#usecases"],
  ["Gallary", "#gallery"],
  ["Pricing", "#pricing"],
  ["Blogs", "#blogs"],
] as const;

const models = ["Veo 3.1", "Ideogram", "Runway", "Luma", "Flux", "Gemini"];

export function HeaderHero() {
  return (
    <section className={styles.hero} aria-labelledby="dreammotion-heading">
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="DreamMotion home">
          DreamMotion
        </a>

        <nav className={styles.navigation} aria-label="Primary navigation">
          {navigation.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className={styles.signup} href="#signup">
          Sign Up
        </a>
      </header>

      <div className={styles.artwork} aria-hidden="true">
        <Image
          className={styles.artworkImage}
          src="/dreammotion/assets/4911cb7de867c47e.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>

      <div id="top" className={styles.content}>
        <h1 id="dreammotion-heading">
          DreamMotion turns prompts into cinematic visuals.
        </h1>
        <p>
          Create polished AI images and short videos for ads, social posts and
          more.
        </p>
        <a className={styles.cta} href="#signup">
          Start Creating
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className={styles.models} aria-label="Supported AI models">
        <p>The best AI image and video models in one creative workspace.</p>
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[...models, ...models].map((model, index) => (
              <span key={`${model}-${index}`} aria-hidden={index >= models.length}>
                {model}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
