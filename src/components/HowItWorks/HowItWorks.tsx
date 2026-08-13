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
  Screen: () => JSX.Element;
};

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Tu crées le prêt',
    desc: 'Montant, durée, échéancier partagé. Un cadre clair posé à deux, en 2 minutes.',
    duration: '≈ 2 min',
    accent: 'violet',
    Screen: ScreenCreate,
  },
  {
    n: '02',
    title: "L'autre accepte",
    desc: 'Notification, lecture, signature en un tap. Chacun sait où il en est.',
    duration: 'En un tap',
    accent: 'coral',
    Screen: ScreenAccept,
  },
  {
    n: '03',
    title: 'tillit suit tout',
    desc: 'Les rappels arrivent en douceur, à la bonne date. Plus jamais à relancer soi-même.',
    duration: 'Automatique',
    accent: 'blue',
    Screen: ScreenTrack,
  },
  {
    n: '04',
    title: 'Le lien est préservé',
    desc: 'Prêt remboursé, Passeport de Fiabilité mis à jour. La relation, elle, est intacte.',
    duration: 'Zéro gêne',
    accent: 'green',
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

  return (
    <section
      className={styles.section}
      id="comment-ca-marche"
      aria-labelledby="how-title"
    >
      <div className={styles.inner}>
        <div className={styles.showcase}>
          <div className={styles.left}>
            <header className={styles.head} data-reveal>
              <span className={styles.eyebrow}>La solution</span>
              <h2 id="how-title" className={styles.title}>
                Quatre étapes.{' '}
                <span className={styles.titleAccent}>Zéro malaise.</span>
              </h2>
              <p className={styles.lead}>
                Une promesse verbale devient un engagement structuré. Sans banque,
                sans intérêts, sans commission — juste un cadre partagé qui protège
                la relation.
              </p>
            </header>

            <ol className={styles.steps} role="list">
            {STEPS.map((step, i) => {
              const isActive = i === active;
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
                    }`}
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    aria-pressed={isActive}
                    aria-label={`Étape ${step.n} : ${step.title}`}
                  >
                    <span className={styles.node}>
                      <span className={styles.nodeInner}>{step.n}</span>
                    </span>
                    <span className={styles.stepBody}>
                      <span className={styles.stepHead}>
                        <span className={styles.stepTitle}>{step.title}</span>
                        <span className={styles.chip}>{step.duration}</span>
                      </span>
                      <span className={styles.stepDesc}>{step.desc}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            </ol>
          </div>

          <PhoneShowcase active={active}>
            <ActiveScreen />
          </PhoneShowcase>
        </div>

        <div className={styles.banner} data-reveal>
          <span className={styles.bannerIcon} aria-hidden="true">
            <i className="fa-solid fa-shield-halved" />
          </span>
          <p>
            <strong>Pas de banque. Pas d'intérêts.</strong> Juste de la clarté entre
            vous.
          </p>
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
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.phone}>
        <div className={styles.notch} aria-hidden="true" />
        <div key={key} className={styles.phoneScreen}>
          {children}
        </div>
      </div>
    </div>
  );
}
