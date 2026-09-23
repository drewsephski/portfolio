import Link from "next/link";

import { BoldArrowLink } from "@/app/bold-arrow-link";
import { profile } from "@/lib/portfolio/content";
import { getRelatedGuides } from "@/lib/guides/catalog";
import type { Guide, GuideCta, GuideSection } from "@/lib/guides/types";

import styles from "./guides.module.css";

function GuideTable({ table }: { table: NonNullable<GuideSection["table"]> }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        {table.caption ? <caption>{table.caption}</caption> : null}
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) => (
                <td key={`${index}-${cell.slice(0, 24)}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuideSectionBlock({ section }: { section: GuideSection }) {
  return (
    <section className={styles.section} id={section.id} aria-labelledby={section.id ? `${section.id}-heading` : undefined}>
      <h2 id={section.id ? `${section.id}-heading` : undefined}>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      {section.bullets ? (
        <ul>
          {section.bullets.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.table ? <GuideTable table={section.table} /> : null}
    </section>
  );
}

function GuideCtaBand({ primary, secondary }: { primary: GuideCta; secondary?: GuideCta[] }) {
  return (
    <aside className={styles.ctaBand} aria-label="Recommended next step">
      <div>
        <p className={styles.ctaEyebrow}>Next step</p>
        <p className={styles.ctaLead}>
          <BoldArrowLink href={primary.href}>{primary.label}</BoldArrowLink>
        </p>
        {primary.note ? <p className={styles.ctaNote}>{primary.note}</p> : null}
      </div>
      {secondary && secondary.length > 0 ? (
        <div className={styles.ctaSecondary}>
          {secondary.map((cta) => (
            <Link key={cta.href} href={cta.href}>
              {cta.label}
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export function GuideArticle({ guide }: { guide: Guide }) {
  const related = getRelatedGuides(guide);

  return (
    <article className={styles.article}>
      <header className={styles.articleHeader}>
        <p className={styles.eyebrow}>{guide.eyebrow}</p>
        <h1>{guide.h1}</h1>
        <p className={styles.directAnswer}>{guide.directAnswer}</p>
        <p className={styles.meta}>
          <time dateTime={guide.published}>Updated {guide.published}</time>
          <span aria-hidden="true"> · </span>
          <span>{profile.name}</span>
        </p>
      </header>

      <div className={styles.body}>
        {guide.sections.map((section) => (
          <GuideSectionBlock key={section.heading} section={section} />
        ))}
      </div>

      <GuideCtaBand primary={guide.primaryCta} secondary={guide.secondaryCtas} />

      <section className={styles.faq} aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQ</h2>
        <dl className={styles.faqList}>
          {guide.faqs.map((faq) => (
            <div key={faq.question} className={styles.faqItem}>
              <dt>{faq.question}</dt>
              <dd>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 ? (
        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading">Related guides</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/guides/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

export function GuidesIndexList({ guides }: { guides: Guide[] }) {
  return (
    <ul className={styles.indexList}>
      {guides.map((guide) => (
        <li key={guide.slug} className={styles.indexRow}>
          <Link className={styles.indexLink} href={`/guides/${guide.slug}`}>
            <span className={styles.indexCopy}>
              <span className={styles.indexEyebrow}>{guide.eyebrow}</span>
              <span className={styles.indexTitle}>{guide.title}</span>
              <span className={styles.indexDescription}>{guide.description}</span>
            </span>
            <span className={styles.indexArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
