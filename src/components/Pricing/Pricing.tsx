import { Link } from 'react-router-dom';
import styles from './Pricing.module.css';

type Feature = { icon: string; label: string };

const NOTE_FEATURES: Feature[] = [
  { icon: 'fa-list-ul', label: 'Création de prêt guidée en 2 minutes' },
  { icon: 'fa-calendar-days', label: 'Échéancier partagé clair' },
  { icon: 'fa-bell', label: 'Rappels bienveillants automatiques' },
  { icon: 'fa-clock-rotate-left', label: 'Historique partagé du prêt' },
];

const ZEN_FEATURES: Feature[] = [
  { icon: 'fa-infinity', label: 'Tout ce que fait Note' },
  {
    icon: 'fa-file-signature',
    label: 'Reconnaissance de dette signée électroniquement, avec Goodflag',
  },
  { icon: 'fa-user-shield', label: 'Ton identité vérifiée avant la signature' },
  { icon: 'fa-box-archive', label: 'Conservation du dossier de preuve' },
];

const EXTRAS = [
  {
    to: '/confiance#carnet',
    icon: 'fa-address-book',
    title: 'Découvrir le Carnet de prêt',
    sub: 'Garde une trace claire de l’historique de tes prêts.',
  },
  {
    to: '/recours',
    icon: 'fa-scale-balanced',
    title: 'Guide pas à pas en cas de recours',
    sub: 'Les étapes à suivre si le remboursement ne se fait pas malgré les relances.',
  },
];

export default function Pricing() {
  return (
    <section className={styles.section} id="tarifs" aria-labelledby="pricing-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>Les formules</span>
          <h2 id="pricing-title" className={styles.title}>
            Deux formules pour organiser ton prêt.
          </h2>
          <p className={styles.lead}>
            Zen ajoutera une reconnaissance de dette signée.
          </p>
        </header>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.cardNote}`} data-reveal="left">
            <span className={styles.badge}>Gratuit</span>
            <div className={styles.cardTop}>
              <div className={styles.cardTopRow}>
                <h3 className={styles.cardTitle}>TilliT Note</h3>
                <p className={styles.price}>0 €</p>
              </div>
              <p className={styles.meta}>
                Sans frais, de <strong>100 à 1 500 €</strong> par prêt
              </p>
            </div>

            <div className={styles.cardBody}>
              <ul className={styles.features}>
                {NOTE_FEATURES.map((f) => (
                  <li key={f.label}>
                    <span className={styles.featureIcon} aria-hidden="true">
                      <i className={`fa-solid ${f.icon}`} />
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              <a href="#cta" className={`${styles.btn} ${styles.btnSoft}`}>
                Être prévenu du lancement
              </a>
            </div>
          </article>

          <article
            className={`${styles.card} ${styles.cardZen}`}
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            <span className={`${styles.badge} ${styles.badgeZen}`}>
              Avec document signé
            </span>
            <div className={styles.cardTop}>
              <div className={styles.cardTopRow}>
                <h3 className={styles.cardTitle}>TilliT Zen</h3>
                <p className={styles.price}>Dès 2,99 €</p>
              </div>
              <p className={styles.meta}>
                De <strong>100 à 5 000 €</strong> par prêt
              </p>
              <p className={styles.metaSoft}>Au-delà de 1 500 €, c’est Zen.</p>
              <p className={styles.metaStrong}>Paiement unique · aucun abonnement</p>
              <p className={styles.meta}>
                <strong>« Qui paie ? »</strong> Vous choisissez ensemble.{' '}
                <span
                  className={styles.infoDot}
                  role="img"
                  aria-label="Le prêteur ou l’emprunteur : vous décidez ensemble qui règle Zen."
                  title="Le prêteur ou l’emprunteur : vous décidez ensemble qui règle Zen."
                >
                  i
                </span>
              </p>
              <Link to="/#comparateur" className={styles.inlineLink}>
                Calculer le prix pour mon prêt
              </Link>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.intro}>
                Pour ceux qui souhaitent formaliser davantage leur prêt.
              </p>
              <ul className={styles.features}>
                {ZEN_FEATURES.map((f) => (
                  <li key={f.label}>
                    <span className={styles.featureIcon} aria-hidden="true">
                      <i className={`fa-solid ${f.icon}`} />
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
              <Link to="/tarifs#signature" className={styles.inlineLink}>
                Le détail de la signature et de la conservation
              </Link>

              <Link to="/tarifs" className={`${styles.btn} ${styles.btnWhite}`}>
                Voir tous les tarifs
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>

        <p className={styles.tagline} data-reveal>
          Vous gardez la confiance, <strong>on s’occupe des détails.</strong>
        </p>

        <p className={styles.disclaimer} data-reveal>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          <span>
            TilliT aide à réduire les oublis et les malentendus.{' '}
            <strong>Il ne garantit pas le remboursement.</strong>
          </span>
        </p>

        <div className={styles.extras} data-reveal>
          {EXTRAS.map((e) => (
            <Link key={e.title} to={e.to} className={styles.extra}>
              <span className={styles.extraIcon} aria-hidden="true">
                <i className={`fa-solid ${e.icon}`} />
              </span>
              <span className={styles.extraText}>
                <span className={styles.extraTitle}>{e.title}</span>
                <span className={styles.extraSub}>{e.sub}</span>
              </span>
              <i
                className={`fa-solid fa-arrow-right ${styles.extraArrow}`}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
