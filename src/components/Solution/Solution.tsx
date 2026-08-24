import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './Solution.module.css';

type Color = 'violet' | 'coral' | 'blue' | 'green';
type Side = 'left' | 'right';

type Step = {
  n: string;
  title: string;
  desc: string;
  pill: string;
  pillIcon: string;
  color: Color;
  side: Side;
};

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Tu crées le prêt',
    desc: 'Montant, durée, échéancier partagé. Un cadre clair posé à deux, en 2 minutes.',
    pill: '≈ 2 min',
    pillIcon: 'fa-solid fa-clock',
    color: 'violet',
    side: 'left',
  },
  {
    n: '02',
    title: "L'autre accepte",
    desc: 'Notification, lecture, signature en un tap. Chacun sait où il en est.',
    pill: 'En un tap',
    pillIcon: 'fa-solid fa-hand-pointer',
    color: 'coral',
    side: 'right',
  },
  {
    n: '03',
    title: 'tillit suit tout',
    desc: 'Les rappels arrivent en douceur, à la bonne date. Plus jamais à relancer soi-même.',
    pill: 'Automatique',
    pillIcon: 'fa-solid fa-bolt',
    color: 'blue',
    side: 'left',
  },
  {
    n: '04',
    title: 'Le lien est préservé',
    desc: 'Prêt remboursé, Passeport de Fiabilité mis à jour. La relation, elle, est intacte.',
    pill: 'Zéro gêne',
    pillIcon: 'fa-solid fa-heart',
    color: 'green',
    side: 'right',
  },
];

function ScreenCreate() {
  return (
    <div className={styles.appScreen}>
      <div className={styles.appHero}>
        <span className={`${styles.appIcon} ${styles.appIconViolet}`} aria-hidden="true">
          <i className="fa-solid fa-file-signature" />
        </span>
        <h4 className={styles.appTitle}>Nouveau prêt</h4>
        <p className={styles.appMeta}>À Sarah · 5 échéances</p>
      </div>
      <div className={styles.appCard}>
        <p className={styles.appAmount}>500 €</p>
        <div className={styles.appRow}><span>Rythme</span><b>5 × 100 €</b></div>
        <div className={styles.appRow}><span>Première échéance</span><b>12 avril</b></div>
        <div className={styles.appRow}><span>Intérêts</span><b className={styles.appGreen}>0 %</b></div>
      </div>
      <button type="button" className={styles.appCta}>Envoyer à Sarah</button>
    </div>
  );
}

function ScreenAccept() {
  return (
    <div className={styles.appScreen}>
      <div className={styles.appHero}>
        <span className={`${styles.appIcon} ${styles.appIconCoral}`} aria-hidden="true">
          <i className="fa-solid fa-bell" />
        </span>
        <h4 className={styles.appTitle}>Camille te propose un prêt</h4>
        <p className={styles.appMeta}>Rien ne démarre sans ta réponse.</p>
      </div>
      <div className={styles.appCard}>
        <p className={styles.appAmount}>500 €</p>
        <div className={styles.appRow}><span>Rythme</span><b>5 × 100 €</b></div>
        <div className={styles.appRow}><span>Première échéance</span><b>12 avril</b></div>
      </div>
      <div className={styles.appActions}>
        <button type="button" className={styles.appCta}>J'accepte</button>
        <button type="button" className={styles.appCtaGhost}>Proposer autre chose</button>
      </div>
    </div>
  );
}

function ScreenTrack() {
  return (
    <div className={styles.appScreen}>
      <div className={styles.appHero}>
        <span className={`${styles.appIcon} ${styles.appIconBlue}`} aria-hidden="true">
          <i className="fa-solid fa-calendar-check" />
        </span>
        <h4 className={styles.appTitle}>Prêt en cours</h4>
        <p className={styles.appMeta}>Reste 200 € sur 500 €</p>
      </div>
      <div className={styles.appCard}>
        <div className={styles.appProgress}>
          <span style={{ width: '60%' }} />
        </div>
        <div className={styles.appProgressLabel}>
          <span>300 € remboursés</span>
          <span>500 € au total</span>
        </div>
      </div>
      <div className={styles.appCard}>
        <div className={styles.appRow}><span>Prochaine · 12 mars</span><b>100 €</b></div>
        <div className={styles.appRow}><span>12 avril</span><b>100 €</b></div>
      </div>
      <p className={styles.appNote}>
        <i className="fa-solid fa-bell" aria-hidden="true" /> Rappel envoyé à Sarah
      </p>
    </div>
  );
}

function ScreenDone() {
  return (
    <div className={styles.appScreen}>
      <div className={styles.appHero}>
        <span className={`${styles.appIcon} ${styles.appIconGreen}`} aria-hidden="true">
          <i className="fa-solid fa-check" />
        </span>
        <h4 className={styles.appTitle}>Prêt remboursé&nbsp;!</h4>
        <p className={styles.appMeta}>
          500 € sur 500 € · Merci Sarah <span aria-hidden="true">💜</span>
        </p>
      </div>
      <div className={`${styles.appCard} ${styles.appPassport}`}>
        <div className={styles.appPassportHead}>
          <span>Passeport de Fiabilité</span>
          <span className={styles.appStars}>
            <i className="fa-solid fa-star" aria-hidden="true" /> 4,9
          </span>
        </div>
        <div className={styles.appRow}><span>Prêts remboursés</span><b>12 / 12</b></div>
        <div className={styles.appRow}><span>Retards</span><b>0</b></div>
        <div className={styles.appRow}><span>Confiance moyenne</span><b className={styles.appGreen}>Excellente</b></div>
      </div>
      <button type="button" className={styles.appCtaSoft}>
        La relation, elle, est intacte
      </button>
    </div>
  );
}

const SCREENS = [ScreenCreate, ScreenAccept, ScreenTrack, ScreenDone];

const easeOut = [0.2, 0.9, 0.3, 1] as const;

type StepCardProps = {
  step: Step;
  index: number;
  isActive: boolean;
  onSelect: (i: number) => void;
};

function StepCard({ step, index, isActive, onSelect }: StepCardProps) {
  const fromX = step.side === 'left' ? -40 : 40;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(index)}
      className={`${styles.card} ${styles[`card_${step.color}`]} ${
        isActive ? styles.cardActive : ''
      }`}
      aria-pressed={isActive}
      aria-controls="solution-phone"
      initial={{ opacity: 0, x: fromX, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: easeOut, delay: index * 0.08 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      animate={{
        scale: isActive ? 1.02 : 1,
        boxShadow: isActive
          ? '0 22px 44px rgba(31, 26, 61, 0.14)'
          : '0 6px 18px rgba(31, 26, 61, 0.06)',
      }}
    >
      <span
        className={`${styles.badge} ${styles[`badge_${step.color}`]}`}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isActive ? (
            <motion.span
              key="num"
              className={styles.badgeNum}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              {step.n}
            </motion.span>
          ) : (
            <motion.i
              key="check"
              className="fa-solid fa-check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: easeOut }}
            />
          )}
        </AnimatePresence>
        {isActive && (
          <motion.span
            className={styles.badgeHeart}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3, ease: easeOut }}
          >
            <i className="fa-solid fa-heart" />
          </motion.span>
        )}
      </span>

      <div className={styles.body}>
        <div className={styles.row}>
          <h3 className={styles.cardTitle}>{step.title}</h3>
          <span className={`${styles.pill} ${styles[`pill_${step.color}`]}`}>
            <i className={step.pillIcon} aria-hidden="true" />
            {step.pill}
          </span>
        </div>
        <p className={styles.cardDesc}>{step.desc}</p>
      </div>
    </motion.button>
  );
}

export default function Solution() {
  const [active, setActive] = useState(3);
  const ActiveScreen = SCREENS[active];
  const activeColor = STEPS[active].color;

  const leftSteps = STEPS.map((s, i) => ({ s, i })).filter(
    ({ s }) => s.side === 'left',
  );
  const rightSteps = STEPS.map((s, i) => ({ s, i })).filter(
    ({ s }) => s.side === 'right',
  );

  return (
    <section
      className={styles.section}
      id="la-solution"
      aria-labelledby="solution-title"
    >
      <div className={styles.arcs} aria-hidden="true">
        <span className={styles.arc1} />
        <span className={styles.arc2} />
        <span className={styles.arc3} />
      </div>

      <div className={styles.container}>
        <header className={styles.head}>
          <span className={styles.kicker}>
            <span className={styles.flag} aria-hidden="true">
              <span className={styles.flagB} />
              <span className={styles.flagW} />
              <span className={styles.flagR} />
            </span>
            La solution
          </span>
          <h2 id="solution-title" className={styles.title}>
            Quatre étapes.{' '}
            <span className={styles.titleAccent}>Zéro malaise.</span>
          </h2>
          <p className={styles.lead}>
            Une promesse verbale devient un engagement structuré. Sans banque,
            sans intérêts, sans commission — juste un cadre partagé qui protège
            la relation.
          </p>
          <span className={styles.headBar} aria-hidden="true" />
        </header>

        <div className={styles.stage}>
          <div className={`${styles.col} ${styles.colLeft}`}>
            {leftSteps.map(({ s, i }) => (
              <StepCard
                key={s.n}
                step={s}
                index={i}
                isActive={i === active}
                onSelect={setActive}
              />
            ))}
          </div>

          <div className={styles.phoneWrap} id="solution-phone">
            <motion.div
              className={styles.phone}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <span className={styles.notch} aria-hidden="true" />
              <div
                className={`${styles.phoneScreen} ${
                  styles[`phoneGlow_${activeColor}`]
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    style={{ height: '100%' }}
                  >
                    <ActiveScreen />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Floating connector dots */}
            <motion.span
              className={`${styles.connectDot} ${styles.connectDotLeft}`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <motion.span
              className={`${styles.connectDot} ${styles.connectDotRight}`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.1,
              }}
              aria-hidden="true"
            />
          </div>

          <div className={`${styles.col} ${styles.colRight}`}>
            {rightSteps.map(({ s, i }) => (
              <StepCard
                key={s.n}
                step={s}
                index={i}
                isActive={i === active}
                onSelect={setActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
