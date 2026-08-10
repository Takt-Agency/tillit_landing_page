import { useEffect, useRef, useState } from 'react';
import styles from './StatsBanner.module.css';

type Stat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  source: string;
  accent: 'violet' | 'coral' | 'blue';
  icon: string;
};

const STATS: Stat[] = [
  {
    value: 73,
    decimals: 0,
    suffix: '%',
    label:
      "des personnes ayant prêté à un proche n'ont pas été remboursées intégralement.",
    source: 'LendingTree',
    accent: 'violet',
    icon: 'fa-hand-holding-dollar',
  },
  {
    value: 30,
    decimals: 0,
    suffix: '%',
    label:
      "des personnes ayant emprunté à un proche reconnaissent ne l'avoir jamais remboursé.",
    source: 'Bread Financial',
    accent: 'coral',
    icon: 'fa-user-clock',
  },
  {
    value: 1.2,
    decimals: 1,
    suffix: 'Md',
    label:
      "d'adultes empruntent chaque année auprès de leurs proches à travers le monde.",
    source: 'Global Findex',
    accent: 'blue',
    icon: 'fa-earth-europe',
  },
];

function formatFR(value: number, decimals: number) {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function useCountUp(target: number, decimals: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, target, decimals, duration]);

  return value;
}

function StatCard({
  stat,
  active,
  index,
}: {
  stat: Stat;
  active: boolean;
  index: number;
}) {
  const current = useCountUp(stat.value, stat.decimals, active);
  return (
    <article
      className={`${styles.card} ${styles[`accent_${stat.accent}`]}`}
      data-reveal
      style={{ ['--reveal-delay' as string]: `${index * 120}ms` }}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        <i className={`fa-solid ${stat.icon}`} />
      </span>
      <p className={styles.value}>
        <span className={styles.number}>{formatFR(current, stat.decimals)}</span>
        <span className={styles.suffix}>{stat.suffix}</span>
      </p>
      <p className={styles.label}>{stat.label}</p>
      <p className={styles.source}>
        <span className={styles.sourceDot} aria-hidden="true" />
        Source · <em>{stat.source}</em>
      </p>
    </article>
  );
}

export default function StatsBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={styles.section}
      id="statistiques"
      ref={sectionRef}
      aria-labelledby="statistiques-title"
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="statistiques-title" className={styles.title}>
            Chaque année, des millions de personnes prêtent
            <br />
            <span className={styles.titleAccent}>
              de l'argent à leurs proches.
            </span>
          </h2>
          <p className={styles.lead}>
            Ce simple geste peut parfois fragiliser une relation.
          </p>
        </header>

        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.source} stat={stat} active={active} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
