import styles from './Comparison.module.css';

export default function Comparison() {
  return (
    <section
      className={styles.section}
      id="difference"
      aria-labelledby="comparison-title"
    >
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>
            Vous utilisez déjà une app de partage de frais ?
          </span>
          <h2 id="comparison-title" className={styles.title}>
            Votre partage est terminé.
            <br />
            Pas forcément{' '}
            <span className={styles.titleAccent}>le remboursement.</span>
          </h2>
        </header>

        <div className={styles.grid}>
          <article
            className={`${styles.card} ${styles.cardPlain}`}
            data-reveal
            style={{ ['--reveal-delay' as string]: '100ms' }}
          >
            <p className={styles.cardLabel}>Ces applications répondent à une question :</p>
            <p className={styles.cardQuestion}>Qui doit combien ?</p>
            <span className={styles.cardTag}>
              <i className="fa-solid fa-users" aria-hidden="true" />
              Partage
            </span>
          </article>

          <article
            className={`${styles.card} ${styles.cardHighlight}`}
            data-reveal
            style={{ ['--reveal-delay' as string]: '220ms' }}
          >
            <p className={styles.cardLabel}>tillit répond à la suivante :</p>
            <p className={styles.cardQuestion}>
              Comment ce montant sera remboursé ?
            </p>
            <span className={`${styles.cardTag} ${styles.cardTagAccent}`}>
              <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />
              Remboursement
            </span>
          </article>
        </div>

        <div className={styles.outro} data-reveal>
          <a href="#comment-ca-marche" className={styles.outroCta}>
            Découvrir les différences
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
