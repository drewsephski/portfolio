"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

type LandingPage = {
  name: string;
  description: string;
  href: string;
  screenshot: string;
  price: number;
};

type LandingPageListProps = {
  landingPages: readonly LandingPage[];
};

export function LandingPageList({ landingPages }: LandingPageListProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (selectedPage && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [selectedPage]);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <ul className={styles.list}>
        {landingPages.map((landingPage, index) => (
          <li className={styles.row} key={landingPage.href}>
            <button
              className={styles.preview}
              type="button"
              aria-label={`Open ${landingPage.name} screenshot`}
              aria-haspopup="dialog"
              onClick={() => setSelectedPage(landingPage)}
            >
              <Image
                className={styles.screenshot}
                src={landingPage.screenshot}
                alt=""
                width={1440}
                height={900}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 520px) 112px, 168px"
              />
            </button>
            <Link className={styles.link} href={landingPage.href}>
              <span className={styles.copy}>
                <span className={styles.name}>{landingPage.name}</span>
                <span className={styles.description}>{landingPage.description}</span>
                <span className={styles.studyPrice}>${landingPage.price} · Next.js hero</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <dialog
        className={styles.dialog}
        ref={dialogRef}
        aria-labelledby="screenshot-dialog-title"
        onCancel={closeDialog}
        onClose={() => setSelectedPage(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        {selectedPage ? (
          <div className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <h2 id="screenshot-dialog-title">{selectedPage.name}</h2>
              <button
                className={styles.dialogClose}
                type="button"
                aria-label="Close screenshot"
                onClick={closeDialog}
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className={styles.dialogImageFrame}>
              <Image
                className={styles.dialogImage}
                src={selectedPage.screenshot}
                alt={`${selectedPage.name} landing page screenshot`}
                width={1440}
                height={900}
                loading="eager"
                sizes="(max-width: 520px) calc(100vw - 48px), 1080px"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
