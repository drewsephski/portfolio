import styles from "./convix.module.css";

type GaugeProps = {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: string;
  max?: string;
};

const TICK_COUNT = 40;
const CENTER = 100;
const RADIUS = 80;

export function Gauge({
  value,
  color = "#ef4d23",
  showLabels = false,
  min,
  max,
}: GaugeProps) {
  const activeCount = Math.round((value / 100) * TICK_COUNT);

  return (
    <div className={styles.gauge}>
      <svg viewBox="0 0 200 120" role="img" aria-label={`${value}% achieved`}>
        {Array.from({ length: TICK_COUNT }, (_, index) => {
          const angle = Math.PI + (index / (TICK_COUNT - 1)) * Math.PI;
          const innerRadius = RADIUS - 10;

          return (
            <line
              key={index}
              x1={CENTER + Math.cos(angle) * innerRadius}
              y1={CENTER + Math.sin(angle) * innerRadius}
              x2={CENTER + Math.cos(angle) * RADIUS}
              y2={CENTER + Math.sin(angle) * RADIUS}
              stroke={index < activeCount ? color : "#d4d4d8"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        <text x="100" y="105" textAnchor="middle" fontSize="22" fontWeight="600">
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className={styles.gaugeLabels} aria-hidden="true">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
