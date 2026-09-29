import { useState } from 'react';
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

type Scene = { title: string; caption: string; img: string; alt: string };

const DAYS = ['Lundi', 'Mardi', 'Le 5 du mois', 'Trois mois plus tard'];

const SCENES: Record<Mode, Scene[]> = {
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
};

export default function Problem() {
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
          <span className={styles.eyebrow}>Le problème</span>
          <h2 id="probleme-title" className={styles.title}>
            Prêter de l’argent ne devrait pas compliquer{' '}
            <span className={styles.titleAccent}>tes relations.</span>
          </h2>
          <p className={styles.lead}>
            Entre amis ou en famille, un simple « je te rembourse bientôt » peut
            vite devenir flou : dates oubliées, montants incertains, relances
            gênantes.
          </p>

          <div className={styles.switch} role="group" aria-label="Comparer le scénario">
            <span className={styles.switchThumb} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.switchBtn} ${mode === 'sans' ? styles.switchBtnActive : ''}`}
              aria-pressed={mode === 'sans'}
              onClick={() => setMode('sans')}
            >
              Sans TilliT
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${mode === 'avec' ? styles.switchBtnActive : ''}`}
              aria-pressed={mode === 'avec'}
              onClick={() => setMode('avec')}
            >
              Avec TilliT
            </button>
          </div>
        </header>

        <div className={styles.board} data-reveal>
          <ol className={styles.steps} aria-live="polite">
            {DAYS.map((day, i) => {
              const scene = SCENES[mode][i];
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
                        src={SCENES[m][i].img}
                        alt={m === mode ? SCENES[m][i].alt : ''}
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
