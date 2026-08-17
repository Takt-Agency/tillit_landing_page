import { useEffect, useRef, useState } from 'react';
import styles from './HowItWorks.module.css';
import {
  ScreenAccept,
  ScreenCreate,
  ScreenDone,
  ScreenTrack,
} from './StepScreens';

type Accent = 'violet' | 'coral' | 'blue' | 'green';

type Step = {
  n: string;
  title: string;
  desc: string;
  duration: string;
  accent: Accent;
  icon: string;
  Screen: () => JSX.Element;
};

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Tu crées le prêt',
    desc: 'Montant, durée, échéancier partagé. Un cadre clair posé à deux, en 2 minutes.',
    duration: '≈ 2 min',
    accent: 'violet',
    icon: 'fa-pen-to-square',
    Screen: ScreenCreate,
  },
  {
    n: '02',
    title: "L'autre accepte",
    desc: 'Notification, lecture, signature en un tap. Chacun sait où il en est.',
    duration: 'En un tap',
    accent: 'coral',
    icon: 'fa-hand-pointer',
    Screen: ScreenAccept,
  },
  {
    n: '03',
    title: 'tillit suit tout',
    desc: 'Les rappels arrivent en douceur, à la bonne date. Plus jamais à relancer soi-même.',
    duration: 'Automatique',
    accent: 'blue',
    icon: 'fa-bell',
    Screen: ScreenTrack,
  },
  {
    n: '04',
    title: 'Le lien est préservé',
    desc: 'Prêt remboursé, Passeport de Fiabilité mis à jour. La relation, elle, est intacte.',
    duration: 'Zéro gêne',
    accent: 'green',
    icon: 'fa-heart',
    Screen: ScreenDone,
  },
];

const AUTOPLAY_MS = 4500;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  const select = (i: number) => {
    setActive(i);
    setPaused(true);
  };

  const ActiveScreen = STEPS[active].Screen;
  const progressPercent = ((active + 1) / STEPS.length) * 100;

  return (
    <section
      className={styles.section}
      id="comment-ca-marche"
      aria-labelledby="how-title"
    >
      <div className={styles.decorTop} aria-hidden="true" />
      <div className={styles.decorBottom} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>
            <span
              className={styles.eyebrowFlag}
              role="img"
              aria-label="Fabriqué en France"
            >
              <span className={styles.flagBlue} />
              <span className={styles.flagWhite} />
              <span className={styles.flagRed} />
            </span>
            La solution
          </span>
          <h2 id="how-title" className={styles.title}>
            Quatre étapes.{' '}
            <span className={styles.titleAccent}>Zéro malaise.</span>
          </h2>
          <p className={styles.lead}>
            Une promesse verbale devient un engagement structuré. Sans banque, sans
            intérêts, sans commission — juste un cadre partagé qui protège la
            relation.
          </p>

          <div className={styles.progressBar} aria-hidden="true">
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
            <span className={styles.progressLabel}>
              Étape {active + 1} sur {STEPS.length}
            </span>
          </div>
        </header>

        <div className={styles.showcase}>
          <ol className={styles.steps} role="list">
            <div className={styles.rail} aria-hidden="true">
              <div
                className={styles.railFill}
                style={{ height: `${progressPercent}%` }}
              />
            </div>

            {STEPS.map((step, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li
                  key={step.n}
                  data-reveal
                  style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
                >
                  <button
                    type="button"
                    className={`${styles.step} ${styles[`accent_${step.accent}`]} ${
                      isActive ? styles.stepActive : ''
                    } ${isDone ? styles.stepDone : ''}`}
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    aria-pressed={isActive}
                    aria-label={`Étape ${step.n} : ${step.title}`}
                  >
                    <span className={styles.node}>
                      <span className={styles.nodeInner}>
                        {isDone ? (
                          <i className="fa-solid fa-check" aria-hidden="true" />
                        ) : (
                          <span className={styles.nodeNumber}>{step.n}</span>
                        )}
                      </span>
                      <span className={styles.nodeIcon} aria-hidden="true">
                        <i className={`fa-solid ${step.icon}`} />
                      </span>
                    </span>
                    <span className={styles.stepBody}>
                      <span className={styles.stepHead}>
                        <span className={styles.stepTitle}>{step.title}</span>
                        <span className={styles.chip}>
                          <i
                            className="fa-solid fa-clock"
                            aria-hidden="true"
                          />
                          {step.duration}
                        </span>
                      </span>
                      <span className={styles.stepDesc}>{step.desc}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <PhoneShowcase active={active}>
            <ActiveScreen />
          </PhoneShowcase>
        </div>

        <div className={styles.banner} data-reveal>
          <div className={styles.bannerBadge}>
            <span className={styles.bannerIcon}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            </span>
            <span className={styles.bannerBadgeText}>Sans risque</span>
          </div>
          <p className={styles.bannerText}>
            <strong>Pas de banque. Pas d'intérêts.</strong>
            <span>Juste de la clarté entre vous.</span>
          </p>
          <a
            className={styles.bannerCta}
            href="#tarifs"
            aria-label="Voir les tarifs"
          >
            <span>Voir les tarifs</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function PhoneShowcase({
  children,
  active,
}: {
  children: React.ReactNode;
  active: number;
}) {
  const [key, setKey] = useState(active);
  const prevRef = useRef(active);

  useEffect(() => {
    if (prevRef.current !== active) {
      setKey(active);
      prevRef.current = active;
    }
  }, [active]);

  return (
    <div className={styles.phoneWrap}>
      <div className={styles.phoneRings} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.phone}>
        <div className={styles.notch} aria-hidden="true" />
        <div key={key} className={styles.phoneScreen}>
          {children}
        </div>
      </div>

      <span className={styles.floatDot1} aria-hidden="true" />
      <span className={styles.floatDot2} aria-hidden="true" />
    </div>
  );
}
