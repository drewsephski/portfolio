import {
  ChevronDown,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Gauge } from "./gauge";
import styles from "./convix.module.css";

function Toggle({ active, inactive }: { active: string; inactive: string }) {
  return (
    <div className={styles.toggle}>
      <button className={styles.toggleActive} type="button">
        {active}
      </button>
      <button type="button">{inactive}</button>
    </div>
  );
}

function DropdownField({ label, value }: { label: string; value: string }) {
  return (
    <label className={styles.formField}>
      <span>{label}</span>
      <button className={styles.selectButton} type="button">
        {value}
        <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </label>
  );
}

function NumberField({ label, value }: { label: string; value: string }) {
  return (
    <label className={styles.formField}>
      <span>{label}</span>
      <span className={styles.numberInput}>
        <span aria-hidden="true">#</span>
        <input type="text" inputMode="numeric" defaultValue={value} aria-label={label} />
      </span>
    </label>
  );
}

export function DashboardPreview() {
  return (
    <div className={styles.dashboardOuter}>
      <section className={styles.dashboard} aria-label="Convix analytics dashboard preview">
        <div className={styles.dashboardGrid}>
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Clicks</span>
              <span>This Month</span>
            </div>
            <div className={styles.metricRow}>
              <strong>6,896</strong>
              <span className={styles.metricDown}>
                <TrendingDown size={12} strokeWidth={2} aria-hidden="true" />
                -3,382 (33%)
              </span>
            </div>
            <p className={styles.comparison}>Compared to yesterday</p>
            <p className={styles.targetLabel}>Month Target achieved</p>
            <Gauge value={92} showLabels min="389K" max="425K" />
            <Toggle active="Impressions" inactive="Clicks" />
          </article>

          <article className={`${styles.card} ${styles.formCard}`}>
            <DropdownField label="Show figures for" value="This month" />
            <DropdownField label="Compare period by" value="Month-to-date (MTD)" />
            <NumberField label="Ste targets (This month)" value="10" />
            <NumberField label="Ste targets (This year)" value="100" />
            <div className={styles.formFooter}>
              <button className={styles.saveButton} type="button">Save</button>
              <button className={styles.cancelButton} type="button">Cancel</button>
              <button className={styles.closeButton} type="button" aria-label="Close form">
                <X size={17} strokeWidth={1.8} />
              </button>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Video Starts</span>
              <span>today</span>
            </div>
            <div className={styles.metricRow}>
              <strong>0</strong>
              <span className={styles.metricNeutral}>
                <TrendingUp size={12} strokeWidth={2} aria-hidden="true" />
                0
              </span>
            </div>
            <p className={styles.comparison}>Compared to yesterday</p>
            <div className={styles.gaugeSpacer} aria-hidden="true" />
            <Gauge value={68} color="#9ca3af" />
            <Toggle active="Video Clicks" inactive="Video Starts" />
          </article>
        </div>
      </section>
    </div>
  );
}
