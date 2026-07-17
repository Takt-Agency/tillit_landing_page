import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.section} id="cta" aria-labelledby="cta-title">
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content} data-reveal="left">
          <h2 id="cta-title" className={styles.title}>
            Téléchargez TilliT
          </h2>
          <p className={styles.lead}>
            Disponible sur iOS et Android — gérez vos prêts entre proches en toute
            clarté.
          </p>
        </div>

        <div
          className={styles.stores}
          data-reveal="right"
          style={{ ['--reveal-delay' as string]: '120ms' }}
        >
          <a
            className={styles.store}
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Télécharger sur l'App Store"
          >
            <i className="fa-brands fa-apple" aria-hidden="true" />
            <span className={styles.storeText}>
              <span className={styles.storeSmall}>Télécharger sur</span>
              <span className={styles.storeBig}>App Store</span>
            </span>
          </a>
          <a
            className={styles.store}
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Télécharger sur Google Play"
          >
            <i className="fa-brands fa-google-play" aria-hidden="true" />
            <span className={styles.storeText}>
              <span className={styles.storeSmall}>Disponible sur</span>
              <span className={styles.storeBig}>Google Play</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
