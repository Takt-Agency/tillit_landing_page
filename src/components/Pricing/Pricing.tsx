import styles from './Pricing.module.css';

const NOTE_FEATURES = [
  'Création de prêt guidée en 2 minutes',
  'Échéancier partagé clair',
  'Rappels bienveillants automatiques',
  'Historique partagé du prêt',
  'Passeport de fiabilité',
];

const ZEN_FEATURES = [
  'Tout ce qui est inclus dans Note',
  'Reconnaissance de dette électronique',
  'Signature électronique',
  "Vérification d'identité",
  "Conservation sécurisée de l'acte",
  'Guide pas à pas en cas de recours',
];

function Check({ tone }: { tone: 'green' | 'violet' }) {
  return (
    <span
      className={`${styles.check} ${
        tone === 'violet' ? styles.checkViolet : styles.checkGreen
      }`}
      aria-hidden="true"
    >
      <i className="fa-solid fa-check" />
    </span>
  );
}

export default function Pricing() {
  return (
    <section className={styles.section} id="tarifs" aria-labelledby="pricing-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>Deux formules</span>
          <h2 id="pricing-title" className={styles.title}>
            Un même objectif :{' '}
            <span className={styles.titleAccent}>préserver vos relations.</span>
          </h2>
          <p className={styles.lead}>
            Utilisez gratuitement <strong>Note</strong> pour organiser votre prêt.
            Choisissez <strong>Zen</strong> lorsque vous souhaitez ajouter une
            reconnaissance de dette sécurisée.
          </p>
        </header>

        <div className={styles.grid}>
          {/* NOTE */}
          <article
            className={`${styles.card} ${styles.cardNote}`}
            data-reveal
            style={{ ['--reveal-delay' as string]: '0ms' }}
          >
            <div className={styles.cardTopRow}>
              <h3 className={styles.cardTitle}>tillit Note</h3>
              <span className={styles.tag}>Le plus utilisé</span>
            </div>

            <p className={styles.price}>
              <span className={styles.priceValue}>Gratuit</span>
            </p>
            <p className={styles.priceMeta}>Jusqu'à 1 500 €</p>

            <p className={styles.desc}>
              Pour structurer un prêt entre proches, sans frais.
            </p>

            <ul className={styles.features}>
              {NOTE_FEATURES.map((f) => (
                <li key={f}>
                  <Check tone="violet" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className={styles.cardFoot}>
              Gratuit dès le premier jour. Pour toujours.
            </p>
          </article>

          {/* ZEN */}
          <article
            className={`${styles.card} ${styles.cardZen}`}
            data-reveal
            style={{ ['--reveal-delay' as string]: '150ms' }}
          >
            <div className={styles.cardTopRow}>
              <h3 className={styles.cardTitle}>tillit Zen</h3>
              <span className={`${styles.tag} ${styles.tagSoon}`}>Bientôt</span>
            </div>

            <p className={styles.price}>
              <span className={styles.priceValue}>Dès 4,99 €</span>
            </p>
            <p className={styles.priceMeta}>Jusqu'à 5 000 €</p>

            <p className={styles.desc}>
              Pour les prêts plus importants, avec valeur juridique.
            </p>

            <ul className={styles.features}>
              {ZEN_FEATURES.map((f) => (
                <li key={f}>
                  <Check tone="violet" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className={styles.cardFoot}>Bientôt disponible</p>
          </article>
        </div>

        <p className={styles.disclaimer} data-reveal>
          <span className={styles.warn} aria-hidden="true">
            <i className="fa-solid fa-shield-halved" />
          </span>
          <span>
            tillit aide à réduire les risques de malentendus, mais ne garantit
            jamais qu'un prêt sera remboursé.
          </span>
        </p>
      </div>
    </section>
  );
}
