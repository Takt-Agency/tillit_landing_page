import styles from './Problem.module.css';

type Card = {
  title: string;
  desc: string;
  quote: string;
  accent: 'coral' | 'blue' | 'yellow';
  icon: JSX.Element;
};

const CARDS: Card[] = [
  {
    title: 'Le flou',
    desc: 'On dit « je te rembourse bientôt » — mais bientôt, c\'est quand exactement ?',
    quote: '« Il m\'a dit la semaine prochaine… il y a trois mois. »',
    accent: 'coral',
    icon: <i className="fa-solid fa-hourglass-half" aria-hidden="true" />,
  },
  {
    title: 'Le silence qui pèse',
    desc: "On n'ose plus parler d'argent. Alors, petit à petit, on n'ose plus se voir tout court.",
    quote: '« On ne se parle plus vraiment depuis. »',
    accent: 'blue',
    icon: <i className="fa-solid fa-comment-slash" aria-hidden="true" />,
  },
  {
    title: 'La gêne de relancer',
    desc: "Chaque rappel ressemble à un reproche. On préfère laisser tomber… et laisser filer.",
    quote: '« Je n\'ai pas eu le cœur de lui redemander. »',
    accent: 'yellow',
    icon: <i className="fa-solid fa-face-frown" aria-hidden="true" />,
  },
];

export default function Problem() {
  return (
    <section className={styles.section} id="probleme" aria-labelledby="probleme-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.orbits} aria-hidden="true">
        <span />
        <span />
      </div>

      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>Ce qui casse la relation</span>
          <h2 id="probleme-title" className={styles.title}>
            La confiance permet le prêt.
            <br />
            <span className={styles.titleAccent}>Le flou, lui, l'abîme.</span>
          </h2>
          <p className={styles.lead}>
            Le problème n'est jamais l'argent. C'est ce qui se glisse autour : les
            silences, les non-dits, les rendez-vous manqués. TilliT s'occupe du cadre
            pour que vous puissiez continuer à vous parler.
          </p>
        </header>

        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`${styles.card} ${styles[`accent_${card.accent}`]}`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className={styles.iconWrap}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
              <p className={styles.cardQuote}>{card.quote}</p>
            </article>
          ))}
        </div>

        <p className={styles.outro}>
          <i
            className={`fa-solid fa-heart ${styles.outroIcon}`}
            aria-hidden="true"
          />
          Formaliser un prêt, ce n'est pas se méfier. C'est dire « je tiens à toi ».
        </p>
      </div>
    </section>
  );
}
