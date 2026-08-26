import { useState } from 'react';
import styles from './Outcomes.module.css';
import avecTillit1 from '../../Avec tillit 1.png';
import avecTillit2 from '../../Avec tillit 2.jpg';
import avecTillit3 from '../../avec tillit 3.png';
import avecTillit4 from '../../avec tillit 4.png';
import sansTillit1 from '../../sans tillit 1.png';
import sansTillit2 from '../../sans tillit 2.png';
import sansTillit3 from '../../sans tillit 3.png';
import sansTillit4 from '../../sans tillit 4.png';

type Card = {
  chip: string;
  title: string;
  img: string;
  imgAlt: string;
  caption?: string;
};

type Path = {
  key: 'avec' | 'sans';
  label: string;
  cards: Card[];
};

const PATHS: Path[] = [
  {
    key: 'avec',
    label: 'Avec tillit',
    cards: [
      {
        chip: 'Lundi',
        title: 'Le besoin',
        img: avecTillit1,
        imgAlt: "Deux proches sur un canapé, l'un explique un besoin",
        caption: "« J'aurais besoin de 500 €… »",
      },
      {
        chip: 'Mardi',
        title: "L'accord",
        img: avecTillit2,
        imgAlt: 'Prêt formalisé dans tillit, accepté par les deux parties',
        caption: 'Prêt entre proches · 500 € · Accepté',
      },
      {
        chip: 'Le 5 du mois',
        title: 'Le rappel',
        img: avecTillit3,
        imgAlt: 'Notification tillit — remboursement enregistré',
        caption: 'Prêt terminé · Bravo ! 500 € remboursés',
      },
      {
        chip: 'Trois mois plus tard',
        title: 'Le sourire',
        img: avecTillit4,
        imgAlt: 'Deux proches heureux, la relation intacte',
        caption: 'La relation, intacte.',
      },
    ],
  },
  {
    key: 'sans',
    label: 'Sans tillit',
    cards: [
      {
        chip: 'Lundi',
        title: 'Le besoin',
        img: sansTillit1,
        imgAlt: 'Une personne demande un service à un proche',
        caption: "« J'aurais besoin de 500 €… »",
      },
      {
        chip: 'Mardi',
        title: "L'accord",
        img: sansTillit2,
        imgAlt: 'Un billet passé de la main à la main',
        caption: 'On se fait confiance 💜',
      },
      {
        chip: 'Le 5 du mois',
        title: 'Le rappel',
        img: sansTillit3,
        imgAlt: 'Téléphone avec des appels manqués',
        caption: 'Appels manqués · Silence radio',
      },
      {
        chip: 'Trois mois plus tard',
        title: 'La distance',
        img: sansTillit4,
        imgAlt: "Le lien s'est effacé, sans un mot",
        caption: 'Le lien s\'est effacé, sans un mot.',
      },
    ],
  },
];

export default function Outcomes() {
  const [active, setActive] = useState<'avec' | 'sans'>('avec');
  const activePath = PATHS.find((p) => p.key === active) ?? PATHS[0];
  const activeIndex = PATHS.findIndex((p) => p.key === active);

  return (
    <section className={styles.section} id="outcomes" aria-labelledby="outcomes-title">
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="outcomes-title" className={styles.title}>
            Le même prêt.
            <br />
            <span className={styles.titleAccent}>Deux issues différentes.</span>
          </h2>
        </header>

        <div className={styles.tabsWrap}>
          <div className={styles.tabs} role="tablist" aria-label="Parcours">
            <span
              className={`${styles.pill} ${
                active === 'sans' ? styles.pillCoral : styles.pillViolet
              }`}
              aria-hidden="true"
              style={{
                transform: `translateX(calc(${activeIndex} * (100% + 4px)))`,
              }}
            />
            {PATHS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`${styles.tab} ${active === p.key ? styles.tabActive : ''}`}
                onClick={() => setActive(p.key)}
                role="tab"
                aria-selected={active === p.key}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div
          key={activePath.key}
          className={`${styles.panel} ${
            active === 'sans' ? styles.panelCoral : styles.panelViolet
          }`}
          role="tabpanel"
        >
          {activePath.cards.map((card, i) => (
            <article
              key={i}
              className={styles.card}
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
              data-reveal
            >
              <div className={styles.cardHead}>
                <span
                  className={`${styles.chip} ${
                    active === 'sans' ? styles.chipCoral : styles.chipViolet
                  }`}
                >
                  {card.chip}
                </span>
                <p className={styles.cardTitle}>{card.title}</p>
              </div>
              <div className={styles.cardImage}>
                <img
                  src={card.img}
                  alt={card.imgAlt}
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={1500}
                />
                {card.caption && (
                  <p className={styles.cardCaption}>{card.caption}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
