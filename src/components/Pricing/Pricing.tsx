import styles from './Pricing.module.css';

const NOTE_FEATURES = [
  'Création du prêt (montant, durée, calendrier)',
  'Rappels automatiques bienveillants (J-2, J, J+7)',
  'Historique factuel des remboursements',
  'Espace de dialogue in-app',
  'Négociation et modulation (report, étalement)',
  'Gamification légère (badges, célébration finale)',
];

const ZEN_TIERS: [string, string][] = [
  ['100–500 €', '4,99 €'],
  ['501–1 000 €', '9,99 €'],
  ['1 001–2 000 €', '19,99 €'],
  ['2 001–3 000 €', '29,99 €'],
  ['3 001–5 000 €', '49,99 €'],
];

const ZEN_FEATURES = [
  'Reconnaissance de dette PDF conforme',
  'Signature électronique qualifiée (GoodFlag, certifié eIDAS)',
  'KYC inclus via France Connect',
  'Dossier exportable complet (contrat + historique + preuves)',
  "Manuel d'accompagnement : procédure simplifiée si litige",
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
        <header className={styles.head}>
          <span className={styles.eyebrow}>Tarifs</span>
          <h2 id="pricing-title" className={styles.title}>
            Deux formules, un seul objectif :{' '}
            <span className={styles.titleAccent}>la sérénité.</span>
          </h2>
          <p className={styles.lead}>
            NOTE organise la confiance. ZEN ajoute la sécurité juridique.
          </p>
        </header>

        <div className={styles.grid}>
          {/* NOTE */}
          <article className={`${styles.card} ${styles.cardNote}`}>
            <span className={`${styles.badge} ${styles.badgeGreen}`}>
              Gratuit pour toujours
            </span>
            <h3 className={styles.cardTitle}>
              TilliT NOTE{' '}
              <i
                className={`fa-solid fa-handshake-angle ${styles.cardTitleIcon} ${styles.iconGreen}`}
                aria-hidden="true"
              />
            </h3>
            <p className={styles.price}>
              <span className={styles.priceValue}>0 €</span>
            </p>
            <p className={styles.desc}>
              Pour les prêts entre proches en toute confiance
            </p>
            <p className={styles.meta}>
              Jusqu'à 1 500 € · 12 ou 60 mois max
            </p>

            <ul className={styles.features}>
              {NOTE_FEATURES.map((f) => (
                <li key={f}>
                  <Check tone="green" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button type="button" className={`${styles.cta} ${styles.ctaGhost}`}>
              Commencer avec NOTE
            </button>
          </article>

          {/* ZEN */}
          <article className={`${styles.card} ${styles.cardZen}`}>
            <span className={styles.recommended}>Recommandé</span>
            <span className={`${styles.badge} ${styles.badgeViolet}`}>
              Sécurité juridique
            </span>
            <h3 className={styles.cardTitle}>
              TilliT ZEN{' '}
              <i
                className={`fa-solid fa-scale-balanced ${styles.cardTitleIcon} ${styles.iconViolet}`}
                aria-hidden="true"
              />
            </h3>
            <p className={styles.price}>
              <span className={styles.priceFrom}>À partir de</span>
              <span className={styles.priceValue}>4,99 €</span>
            </p>
            <p className={styles.desc}>
              Pour les montants importants ou les situations sensibles
            </p>
            <p className={styles.meta}>100 € à 5 000 € · jusqu'à 60 mois</p>

            <div className={styles.tiers}>
              {ZEN_TIERS.map(([range, price]) => (
                <div key={range} className={styles.tierRow}>
                  <span>{range}</span>
                  <strong>{price}</strong>
                </div>
              ))}
            </div>

            <p className={styles.plusLabel}>Tout TilliT NOTE, PLUS :</p>
            <ul className={styles.features}>
              {ZEN_FEATURES.map((f) => (
                <li key={f}>
                  <Check tone="violet" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button type="button" className={`${styles.cta} ${styles.ctaSolid}`}>
              Commencer avec ZEN
            </button>
          </article>
        </div>

        <p className={styles.disclaimer}>
          <span className={styles.warn} aria-hidden="true">
            <i className="fa-solid fa-shield-halved" />
          </span>
          <span>
            <strong>ZEN réduit drastiquement le risque relationnel et juridique.</strong>{' '}
            On ne promet pas le risque zéro. On réduit le risque de 80 %, on ne
            l'élimine pas.
          </span>
        </p>
      </div>
    </section>
  );
}
