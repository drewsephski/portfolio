import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./home.module.css";

type PaidTemplate = {
  name: string;
  description: string;
  previewHref: string;
  screenshot: string;
  price: number;
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
              sizes="(max-width: 700px) calc(100vw - 40px), 610px"
            />
          </Link>
          <div className={styles.templateDetails}>
            <div>
              <p className={styles.templateLabel}>Complete Next.js template · ${template.price}</p>
              <h3>{template.name}</h3>
              <p className={styles.templateDescription}>{template.description}</p>
            </div>
            <div className={styles.templateActions}>
              <Link href={template.previewHref}>Live preview</Link>
              <Link href={template.previewHref}>Buy now · ${template.price} <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
