import { useState } from 'react';
import styles from './Outcomes.module.css';

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

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const PATHS: Path[] = [
  {
    key: 'avec',
    label: 'Avec tillit',
    cards: [
      {
        chip: 'Lundi',
        title: 'Le besoin',
        img: IMG('photo-1611944212129-29977ae1398c'),
        imgAlt: "Deux proches sur un canapé, l'un explique un besoin",
        caption: "« J'aurais besoin de 500 €… »",
      },
      {
        chip: 'Mardi',
        title: "L'accord",
        img: IMG('photo-1600880292203-757bb62b4baf'),
        imgAlt: "Poignée de main entre deux personnes après un accord",
        caption: 'Prêt entre proches · 500 € · Accepté',
      },
      {
        chip: 'Le 5 du mois',
        title: 'Le rappel',
        img: IMG('photo-1512428559087-560fa5ceab42'),
        imgAlt: "Notification sur un téléphone",
        caption: 'Prêt terminé · Bravo ! 500 € remboursés',
      },
      {
        chip: 'Trois mois plus tard',
        title: 'Le sourire',
        img: IMG('photo-1543269865-cbf427effbad'),
        imgAlt: 'Deux proches heureux au café',
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
        img: IMG('photo-1611944212129-29977ae1398c'),
        imgAlt: 'Une personne demande un service',
        caption: "« J'aurais besoin de 500 €… »",
      },
      {
        chip: 'Mardi',
        title: "L'accord",
        img: IMG('photo-1521791136064-7986c2920216'),
        imgAlt: 'Un billet passé de la main à la main',
        caption: 'On se fait confiance 💜',
      },
      {
        chip: 'Le 5 du mois',
        title: 'Le rappel',
        img: IMG('photo-1512428559087-560fa5ceab42'),
        imgAlt: 'Téléphone avec des appels manqués',
        caption: 'Appels manqués · Silence radio',
      },
      {
        chip: 'Trois mois plus tard',
        title: 'La distance',
        img: IMG('photo-1476900164809-ff19b8ae5968'),
        imgAlt: "Personne seule dans une rue d'automne",
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
