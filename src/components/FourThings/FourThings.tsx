import { Link } from 'react-router-dom';
import styles from './FourThings.module.css';
import mascotUrl from '../../millions-mascotte.png';

type Accent = 'violet' | 'coral' | 'blue' | 'green';

type Item = {
  n: number;
  tag: string;
  tagIcon: string;
  icon: string;
  accent: Accent;
  strong: string;
  text: string;
};

const LEFT: Item[] = [
  {
    n: 1,
    tag: 'Clarté',
    tagIcon: 'fa-magnifying-glass',
    icon: 'fa-file-invoice',
    accent: 'violet',
    strong: 'Le montant.',
    text: 'Ce qui est prêté, écrit noir sur blanc.',
  },
  {
    n: 3,
    tag: 'Sérénité',
    tagIcon: 'fa-face-smile',
    icon: 'fa-calendar-days',
    accent: 'coral',
    strong: 'Jusqu’à quand.',
    text: 'Les dates exactes, et surtout celle de la fin.',
  },
];

const RIGHT: Item[] = [
  {
    n: 2,
    tag: 'Confiance',
    tagIcon: 'fa-shield-halved',
    icon: 'fa-coins',
    accent: 'blue',
    strong: 'Combien par mois.',
    text: 'Et donc en combien de fois.',
  },
  {
    n: 4,
    tag: 'Respect',
    tagIcon: 'fa-heart',
    icon: 'fa-list-check',
    accent: 'green',
    strong: 'Le suivi.',
    text: 'Au même endroit, visible par vous deux.',
  },
];

function Card({ item, side }: { item: Item; side: 'left' | 'right' }) {
  return (
    <div
      className={`${styles.cardWrap} ${styles[`side_${side}`]} ${
        styles[`accent_${item.accent}`]
      }`}
      data-reveal={side}
      style={{
        ['--reveal-delay' as string]: `${(item.n - 1) * 110}ms`,
        order: item.n,
      }}
    >
      <article className={styles.card}>
        <span className={styles.cardNum} aria-hidden="true">
          {item.n}
        </span>
        <span className={styles.cardIcon} aria-hidden="true">
          <i className={`fa-solid ${item.icon}`} />
        </span>
        <div className={styles.cardBody}>
          <span className={styles.tag}>
            {item.tag}
            <span className={styles.tagIcon} aria-hidden="true">
              <i className={`fa-solid ${item.tagIcon}`} />
            </span>
          </span>
          <p className={styles.cardText}>
            <strong>{item.strong}</strong> {item.text}
          </p>
        </div>
      </article>
    </div>
  );
}

export default function FourThings() {
  return (
    <section className={styles.section} id="solution" aria-labelledby="solution-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>La solution</span>
          <h2 id="solution-title" className={styles.title}>
            Quatre choses <span className={styles.titleAccent}>à se dire.</span>
          </h2>
        </header>

        <div className={styles.layout}>
          <div className={styles.column}>
            {LEFT.map((item) => (
              <Card key={item.tag} item={item} side="left" />
            ))}
          </div>

          <div className={styles.center} data-reveal="zoom">
            <span className={styles.orbit} aria-hidden="true" />
            <span className={styles.platform} aria-hidden="true" />
            <div className={styles.confetti} aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={styles[`c${i + 1}`]} />
              ))}
            </div>
            <img
              src={mascotUrl}
              alt=""
              aria-hidden="true"
              className={styles.mascot}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
            />
          </div>

          <div className={styles.column}>
            {RIGHT.map((item) => (
              <Card key={item.tag} item={item} side="right" />
            ))}
          </div>
        </div>

        <div className={styles.ctaWrap} data-reveal>
          <Link to="/comment-ca-marche" className={styles.cta}>
            Voir comment ça marche
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
