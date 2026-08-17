import styles from './Pricing.module.css';

type Feature = { icon: string; label: string };

const NOTE_FEATURES: Feature[] = [
  { icon: 'fa-pen-to-square', label: 'Création de prêt guidée en 2 minutes' },
  { icon: 'fa-calendar-days', label: 'Échéancier partagé clair' },
  { icon: 'fa-bell', label: 'Rappels bienveillants automatiques' },
  { icon: 'fa-clock-rotate-left', label: 'Historique partagé du prêt' },
  { icon: 'fa-id-badge', label: 'Passeport de fiabilité' },
];

const ZEN_FEATURES: Feature[] = [
  { icon: 'fa-star', label: 'Tout ce qui est inclus dans Note' },
  { icon: 'fa-file-signature', label: 'Reconnaissance de dette électronique' },
  { icon: 'fa-signature', label: 'Signature électronique' },
  { icon: 'fa-user-shield', label: "Vérification d'identité" },
  { icon: 'fa-shield-halved', label: "Conservation sécurisée de l'acte" },
  { icon: 'fa-scale-balanced', label: 'Guide pas à pas en cas de recours' },
];

function FeatureIcon({ icon }: { icon: string }) {
  return (
    <span className={styles.featureIcon} aria-hidden="true">
      <i className={`fa-solid ${icon}`} />
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
                <li key={f.label}>
                  <FeatureIcon icon={f.icon} />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>

            <div className={`${styles.cardFoot} ${styles.footNote}`}>
              <span className={styles.footIcon} aria-hidden="true">
                <i className="fa-solid fa-infinity" />
              </span>
              <div className={styles.footText}>
                <p className={styles.footTitle}>Gratuit dès le premier jour</p>
                <p className={styles.footSub}>Pour toujours.</p>
              </div>
            </div>
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
                <li key={f.label}>
                  <FeatureIcon icon={f.icon} />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>

            <div className={`${styles.cardFoot} ${styles.footZen}`}>
              <span className={styles.footIcon} aria-hidden="true">
                <i className="fa-solid fa-hourglass-start" />
              </span>
              <div className={styles.footText}>
                <p className={styles.footTitle}>Bientôt disponible</p>
                <p className={styles.footSub}>Rejoins la liste d'attente.</p>
              </div>
            </div>
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
