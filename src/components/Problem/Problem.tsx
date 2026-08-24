import styles from './Problem.module.css';
import mascotUrl from '../../millions-mascotte.png';

type Accent = 'violet' | 'coral' | 'blue';

type Card = {
  n: string;
  title: string;
  quote: string;
  icon: string;
  accent: Accent;
};

const CARDS: Card[] = [
  {
    n: '01',
    title: 'Tout commence simplement',
    quote: '« Je te rembourse bientôt. »',
    icon: 'fa-handshake',
    accent: 'violet',
  },
  {
    n: '02',
    title: 'Puis chacun attend',
    quote: '« Je ne vais pas lui courir après quand même… »',
    icon: 'fa-hourglass-half',
    accent: 'coral',
  },
  {
    n: '03',
    title: 'Le silence fait le reste',
    quote: "Certaines amitiés ne s'en remettent pas.",
    icon: 'fa-heart-crack',
    accent: 'blue',
  },
];

const TAGS = [
  {
    label: 'Clarté',
    icon: 'fa-magnifying-glass',
    accent: 'violet',
    position: 'tag1',
  },
  {
    label: 'Sérénité',
    icon: 'fa-face-smile',
    accent: 'coral',
    position: 'tag2',
  },
  {
    label: 'Confiance',
    icon: 'fa-shield-halved',
    accent: 'blue',
    position: 'tag3',
  },
  {
    label: 'Respect',
    icon: 'fa-heart',
    accent: 'green',
    position: 'tag4',
  },
];

export default function Problem() {
  return (
    <section className={styles.section} id="probleme" aria-labelledby="probleme-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="probleme-title" className={styles.title}>
            Le problème n'est jamais{' '}
            <span className={styles.titleAccent}>l'argent.</span>
          </h2>
          <p className={styles.lead}>C'est le flou autour.</p>
        </header>

        <div className={styles.stage} data-reveal>
          <div className={styles.confetti} aria-hidden="true">
            <span className={styles.c1} />
            <span className={styles.c2} />
            <span className={styles.c3} />
            <span className={styles.c4} />
            <span className={styles.c5} />
            <span className={styles.c6} />
            <span className={styles.c7} />
            <span className={styles.c8} />
          </div>

          {TAGS.map((tag) => (
            <span
              key={tag.label}
              className={`${styles.tag} ${styles[tag.position]} ${
                styles[`tagAccent_${tag.accent}`]
              }`}
              aria-hidden="true"
            >
              <span className={styles.tagText}>{tag.label}</span>
              <span className={styles.tagIcon}>
                <i className={`fa-solid ${tag.icon}`} />
              </span>
            </span>
          ))}

          <img
            src={mascotUrl}
            alt="Mascotte tillit célébrant"
            className={styles.mascot}
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
          />
        </div>

        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <article
              key={card.n}
              className={`${styles.card} ${styles[`accent_${card.accent}`]}`}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 120}ms` }}
            >
              <div className={styles.cardHead}>
                <span className={styles.cardBadge}>
                  <i className={`fa-solid ${card.icon}`} aria-hidden="true" />
                </span>
                <span className={styles.cardNum}>{card.n}</span>
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.cardQuoteWrap}>
                <p className={styles.cardQuote}>{card.quote}</p>
                <i
                  className={`fa-solid fa-quote-right ${styles.quoteMark}`}
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>

        <div className={styles.outro} data-reveal>
          <p className={styles.outroText}>
            Et pourtant, il existe une façon simple d'éviter tout ça.
          </p>
          <a href="#comment-ca-marche" className={styles.outroCta}>
            Pourquoi tillit
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
