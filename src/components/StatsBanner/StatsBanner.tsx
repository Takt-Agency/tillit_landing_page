import { useEffect, useRef, useState } from 'react';
import styles from './StatsBanner.module.css';

type Stat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  source: string;
  accent: 'violet' | 'coral' | 'green' | 'blue';
  icon: string;
};

const STATS: Stat[] = [
  {
    value: 1.2,
    decimals: 1,
    suffix: 'Md',
    label: "d'adultes dans le monde ont emprunté à un proche",
    source: 'Global Findex, 2025',
    accent: 'violet',
    icon: 'fa-users',
  },
  {
    value: 6.5,
    decimals: 1,
    suffix: 'M',
    label: 'de Français prêtent ou empruntent à un proche chaque année',
    source: 'Insee',
    accent: 'coral',
    icon: 'fa-user-group',
  },
  {
    value: 73,
    decimals: 0,
    suffix: '%',
    label: "des prêteurs ne récupèrent pas l'intégralité de leur argent",
    source: 'LendingTree, 2023',
    accent: 'blue',
    icon: 'fa-shield-halved',
  },
  {
    value: 30,
    decimals: 0,
    suffix: '%',
    label: 'des emprunteurs reconnaissent ne jamais avoir remboursé',
    source: 'Bread Financial, 2024',
    accent: 'green',
    icon: 'fa-wallet',
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

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const current = useCountUp(stat.value, stat.decimals, active);
  return (
    <article className={`${styles.card} ${styles[`accent_${stat.accent}`]}`}>
      <div className={styles.valueRow}>
        <span className={styles.iconWrap} aria-hidden="true">
          <i className={`fa-solid ${stat.icon}`} />
        </span>
        <p className={styles.value}>
          <span className={styles.number}>{formatFR(current, stat.decimals)}</span>
          <span className={styles.suffix}>{stat.suffix}</span>
        </p>
      </div>
      <p className={styles.label}>{stat.label}</p>
      <p className={styles.source}>
        <span className={styles.sourceDot} aria-hidden="true" />
        <em>{stat.source}</em>
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
      { threshold: 0.25 },
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
        <header className={styles.head}>
          <span className={styles.eyebrow}>En chiffres</span>
          <h2 id="statistiques-title" className={styles.title}>
            L'argent entre proches, ce n'est pas rare —{' '}
            <span className={styles.titleAccent}>c'est massif.</span>
          </h2>
          <p className={styles.lead}>
            Prêter à un ami, un frère, une sœur : un geste quotidien à l'échelle
            mondiale. Et pourtant, sans cadre, la relation en paie souvent le prix.
          </p>
        </header>

        <div className={styles.grid}>
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
