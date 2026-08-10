import styles from './Problem.module.css';

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
                <i
                  className={`fa-solid fa-quote-right ${styles.quoteMark}`}
                  aria-hidden="true"
                />
                <p className={styles.cardQuote}>{card.quote}</p>
              </div>
              <div className={styles.cardConnector} aria-hidden="true">
                {i < CARDS.length - 1 && (
                  <i className="fa-solid fa-arrow-right-long" />
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.outro} data-reveal>
          <p className={styles.outroText}>
            Et pourtant, il existe une façon simple d'éviter tout ça.
          </p>
          <a href="#comment-ca-marche" className={styles.outroCta}>
            Pourquoi TilliT
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
