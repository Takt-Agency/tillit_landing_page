import { useState } from 'react';
import { useLang, type Lang } from '../../i18n';
import styles from './Problem.module.css';
import sans1 from '../../sans tillit 1.png';
import sans2 from '../../sans tillit 2.png';
import sans3 from '../../sans tillit 3.png';
import sans4 from '../../sans tillit 4.png';
import avec1 from '../../Avec tillit 1.png';
import avec2 from '../../Avec tillit 2.jpg';
import avec3 from '../../avec tillit 3.png';
import avec4 from '../../avec tillit 4.png';

type Mode = 'sans' | 'avec';

const COPY = {
  fr: {
    eyebrow: 'Le problème',
    switchLabel: 'Comparer le scénario',
    sans: 'Sans TilliT',
    avec: 'Avec TilliT',
  },
  en: {
    eyebrow: 'The problem',
    switchLabel: 'The same loan, with or without TilliT',
    sans: 'Without TilliT',
    avec: 'With TilliT',
  },
};

type Scene = { title: string; caption: string; img: string; alt: string };

const DAYS: Record<Lang, string[]> = {
  fr: ['Lundi', 'Mardi', 'Le 5 du mois', 'Trois mois plus tard'],
  en: ['Monday', 'Tuesday', 'The 5th of the month', 'Three months later'],
};

const SCENES: Record<Lang, Record<Mode, Scene[]>> = {
  fr: {
    sans: [
      {
        title: 'Le besoin',
        caption: '« J’aurais besoin de 500 €… »',
        img: sans1,
        alt: 'Un ami demande 500 € à un autre, assis sur un canapé.',
      },
      {
        title: 'L’accord',
        caption: 'On se fait confiance',
        img: sans2,
        alt: 'Les deux amis se serrent la main pour conclure le prêt.',
      },
      {
        title: 'Le rappel',
        caption: 'Appels manqués · Silence radio',
        img: sans3,
        alt: 'Le prêteur, agacé, regarde une liste d’appels manqués sur son téléphone.',
      },
      {
        title: 'La distance',
        caption: 'On se voit, on n’en parle pas.',
        img: sans4,
        alt: 'Les deux amis se croisent dans la rue, mal à l’aise.',
      },
    ],
    avec: [
      {
        title: 'Le besoin',
        caption: '« J’aurais besoin de 500 €… »',
        img: avec1,
        alt: 'Un ami demande 500 € à un autre, avec la mascotte TilliT entre eux.',
      },
      {
        title: 'L’accord',
        caption: 'Prêt entre proches · 500 € · Accepté',
        img: avec2,
        alt: 'Les deux amis montrent le prêt de 500 € accepté dans l’application TilliT.',
      },
      {
        title: 'Le remboursement',
        caption: 'Prêt remboursé ! · Bravo ! Tu as remboursé 500 €',
        img: avec3,
        alt: 'Les deux amis célèbrent le remboursement du prêt avec la mascotte.',
      },
      {
        title: 'Le sourire',
        caption: 'La relation, intacte.',
        img: avec4,
        alt: 'Les deux amis prennent un café ensemble, la mascotte leur sert à boire.',
      },
    ],
  },
  en: {
    sans: [
      {
        title: 'The need',
        caption: '“I could really use €500…”',
        img: sans1,
        alt: 'One friend asks another for €500, sitting on a sofa.',
      },
      {
        title: 'The agreement',
        caption: 'We trust each other',
        img: sans2,
        alt: 'The two friends shake hands to seal the loan.',
      },
      {
        title: 'The reminder',
        caption: 'Missed calls · No answer',
        img: sans3,
        alt: 'The lender, annoyed, looks at a list of missed calls on his phone.',
      },
      {
        title: 'The distance',
        caption: 'We still see each other, we never mention it.',
        img: sans4,
        alt: 'The two friends run into each other in the street, ill at ease.',
      },
    ],
    avec: [
      {
        title: 'The need',
        caption: '“I could really use €500…”',
        img: avec1,
        alt: 'One friend asks another for €500, with the TilliT mascot between them.',
      },
      {
        title: 'The agreement',
        caption: 'Loan between friends · €500 · Accepted',
        img: avec2,
        alt: 'The two friends show the accepted €500 loan in the TilliT app.',
      },
      {
        title: 'The repayment',
        caption: 'Loan repaid! · Well done! You’ve repaid €500',
        img: avec3,
        alt: 'The two friends celebrate the loan being repaid, with the mascot.',
      },
      {
        title: 'The smile',
        caption: 'The friendship, intact.',
        img: avec4,
        alt: 'The two friends have a coffee together, the mascot serving them.',
      },
    ],
  },
};

export default function Problem() {
  const lang = useLang();
  const t = COPY[lang];
  const [mode, setMode] = useState<Mode>('sans');

  return (
    <section
      className={`${styles.section} ${mode === 'avec' ? styles.modeAvec : ''}`}
      id="probleme"
      aria-labelledby="probleme-title"
    >
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          {lang === 'en' ? (
            <>
              <h2 id="probleme-title" className={styles.title}>
                Lending money shouldn’t complicate{' '}
                <span className={styles.titleAccent}>your relationships.</span>
              </h2>
              <p className={styles.lead}>
                Between friends or family, a simple “I’ll pay you back soon”
                quickly turns vague: forgotten dates, amounts nobody is sure of,
                awkward reminders.
              </p>
            </>
          ) : (
            <>
              <h2 id="probleme-title" className={styles.title}>
                Prêter de l’argent ne devrait pas compliquer{' '}
                <span className={styles.titleAccent}>tes relations.</span>
              </h2>
              <p className={styles.lead}>
                Entre amis ou en famille, un simple « je te rembourse bientôt » peut
                vite devenir flou : dates oubliées, montants incertains, relances
                gênantes.
              </p>
            </>
          )}

          <div className={styles.switch} role="group" aria-label={t.switchLabel}>
            <span className={styles.switchThumb} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.switchBtn} ${mode === 'sans' ? styles.switchBtnActive : ''}`}
              aria-pressed={mode === 'sans'}
              onClick={() => setMode('sans')}
            >
              {t.sans}
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${mode === 'avec' ? styles.switchBtnActive : ''}`}
              aria-pressed={mode === 'avec'}
              onClick={() => setMode('avec')}
            >
              {t.avec}
            </button>
          </div>
        </header>

        <div className={styles.board} data-reveal>
          <ol className={styles.steps} aria-live="polite">
            {DAYS[lang].map((day, i) => {
              const scene = SCENES[lang][mode][i];
              return (
                <li key={day} className={styles.step}>
                  <span className={styles.day}>{day}</span>
                  <h3 className={styles.stepTitle} key={`${mode}-t`}>
                    {scene.title}
                  </h3>

                  <figure className={styles.frame}>
                    {(['sans', 'avec'] as Mode[]).map((m) => (
                      <img
                        key={m}
                        src={SCENES[lang][m][i].img}
                        alt={m === mode ? SCENES[lang][m][i].alt : ''}
                        aria-hidden={m !== mode}
                        className={`${styles.photo} ${m === mode ? styles.photoVisible : ''}`}
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                    <figcaption className={styles.caption} key={`${mode}-c`}>
                      {scene.caption}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
