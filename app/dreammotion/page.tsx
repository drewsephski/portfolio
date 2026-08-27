import { FeaturesStudio } from "./features-studio";
import { HeaderHero } from "./header-hero";
import LowerPage from "./lower-page";
import styles from "./page.module.css";

export default function DreamMotionPage() {
  return (
    <main className={styles.page}>
      <HeaderHero />
      <FeaturesStudio />
      <LowerPage />
    </main>
  );
}
