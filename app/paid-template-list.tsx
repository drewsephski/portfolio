import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./home.module.css";

type PaidTemplate = {
  name: string;
  description: string;
  previewHref: string;
  purchaseHref: string;
  screenshot: string;
};

export function PaidTemplateList({ templates }: { templates: readonly PaidTemplate[] }) {
  return (
    <div className={styles.templateGrid}>
      {templates.map((template) => (
        <article className={styles.templateCard} key={template.name}>
          <Link className={styles.templateThumbnail} href={template.previewHref} aria-label={`Preview ${template.name}`}>
            <Image
              src={template.screenshot}
              alt={`${template.name} website template preview`}
              width={1440}
              height={900}
              sizes="(max-width: 700px) calc(100vw - 40px), 720px"
            />
          </Link>
          <div className={styles.templateDetails}>
            <div>
              <p className={styles.templateLabel}>Premium Next.js template</p>
              <h3>{template.name}</h3>
              <p className={styles.templateDescription}>{template.description}</p>
            </div>
            <div className={styles.templateActions}>
              <Link href={template.previewHref}>Live preview</Link>
              <a href={template.purchaseHref}>
                Purchase template <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
