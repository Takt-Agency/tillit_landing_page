import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './StatsBanner.module.css';
import { useLang } from '../../i18n';

export type Stat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  source: string;
  sourceUrl?: string;
  accent: 'violet' | 'coral' | 'blue';
  icon: string;
};

type Props = {
  stats?: Stat[];
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: string;
  outro?: string;
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

const STATS_EN: Stat[] = [
  {
    value: 73,
    decimals: 0,
    suffix: '%',
    label: 'of people who lent to someone close were not repaid in full.',
    source: 'LendingTree',
    accent: 'violet',
    icon: 'fa-hand-holding-dollar',
  },
  {
    value: 30,
    decimals: 0,
    suffix: '%',
    label: 'of people who borrowed from someone close admit they never repaid it.',
    source: 'Bread Financial',
    accent: 'coral',
    icon: 'fa-user-clock',
  },
  {
    value: 1.2,
    decimals: 1,
    suffix: 'bn',
    label: 'adults around the world borrow from family and friends every year.',
    source: 'Global Findex',
    accent: 'blue',
    icon: 'fa-earth-europe',
  },
];

const COPY = {
  fr: {
    stats: STATS,
    lead: 'Ce simple geste peut parfois fragiliser une relation.',
    newTab: ' (s’ouvre dans un nouvel onglet)',
    locale: 'fr-FR',
  },
  en: {
    stats: STATS_EN,
    lead: 'That simple gesture can sometimes strain a relationship.',
    newTab: ' (opens in a new tab)',
    locale: 'en-GB',
  },
};

function formatNumber(value: number, decimals: number, locale: string) {
  return value.toLocaleString(locale, {
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
  const t = COPY[useLang()];
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
        <span className={styles.number}>{formatNumber(current, stat.decimals, t.locale)}</span>
        <span className={styles.suffix}>{stat.suffix}</span>
      </p>
      <p className={styles.label}>{stat.label}</p>
      <p className={styles.source}>
        <span className={styles.sourceDot} aria-hidden="true" />
        Source ·{' '}
        {stat.sourceUrl ? (
          <a
            href={stat.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            <em>{stat.source}</em>
            <span className="sr-only">{t.newTab}</span>
          </a>
        ) : (
          <em>{stat.source}</em>
        )}
      </p>
    </article>
  );
}

export default function StatsBanner({
  stats,
  id = 'statistiques',
  eyebrow,
  title,
  lead,
  outro,
}: Props = {}) {
  const lang = useLang();
  const t = COPY[lang];
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
      id={id}
      ref={sectionRef}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 id={`${id}-title`} className={styles.title}>
            {title ??
              (lang === 'en' ? (
                <>
                  Every year, millions of people lend
                  <br />
                  <span className={styles.titleAccent}>money to those close to them.</span>
                </>
              ) : (
                <>
                  Chaque année, des millions de personnes prêtent
                  <br />
                  <span className={styles.titleAccent}>
                    de l'argent à leurs proches.
                  </span>
                </>
              ))}
          </h2>
          <p className={styles.lead}>{lead ?? t.lead}</p>
        </header>

        <div className={styles.grid}>
          {(stats ?? t.stats).map((stat, i) => (
            <StatCard key={stat.source} stat={stat} active={active} index={i} />
          ))}
        </div>

        {outro && (
          <p className={styles.outro} data-reveal>
            {outro}
          </p>
        )}
      </div>
    </section>
  );
}
