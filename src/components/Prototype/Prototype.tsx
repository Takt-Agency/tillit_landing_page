import { Link } from 'react-router-dom';
import styles from './Prototype.module.css';
import PageHero, { pageHeroStyles } from '../PageHero/PageHero';

const APP_URL = '/prototype-app/index.html';

const FEATURES = [
  { icon: 'fa-hand-holding-heart', label: 'Créer un prêt ou une demande' },
  { icon: 'fa-comments', label: 'Négocier le montant et les dates' },
  { icon: 'fa-file-signature', label: 'Signer avec Zen' },
  { icon: 'fa-money-bill-transfer', label: 'Déclarer et confirmer un remboursement' },
  { icon: 'fa-calendar-days', label: 'Décaler une échéance ou payer une partie' },
  { icon: 'fa-book-open', label: 'Consulter ton Carnet de prêt' },
];

export default function Prototype() {
  return (
    <>
      <PageHero
        eyebrow="Prototype de l’application"
        title={
          <>
            Essaie TilliT <span className={pageHeroStyles.accent}>avant sa sortie.</span>
          </>
        }
        lead="Prototype de test de l’application TilliT : prêter de l’argent entre proches, à 0 % d’intérêt."
      >
        <p className={styles.heroNote}>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          Aucune donnée réelle, aucun paiement réel. Ce que tu saisis reste sur ton téléphone.
        </p>
        <div className={styles.heroActions}>
          <a href="#essayer" className={styles.heroPrimary}>
            Essayer ici
            <i className="fa-solid fa-arrow-down" aria-hidden="true" />
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener"
            className={styles.heroSecondary}
          >
            Ouvrir en plein écran
            <i className="fa-solid fa-up-right-from-square" aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <section className={styles.section} id="essayer">
        <div className={styles.container}>
          <aside className={`${styles.side} ${styles.sideLeft}`} data-reveal="left">
            <span className={styles.kicker}>À tester</span>
            <h2 className={styles.sideTitle}>Ce que tu peux faire</h2>
            <ul className={styles.features}>
              {FEATURES.map((f) => (
                <li key={f.label}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <i className={`fa-solid ${f.icon}`} />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.stage} data-reveal="zoom">
            <span className={styles.glow} aria-hidden="true" />
            <div className={styles.phone}>
              <span className={styles.notch} aria-hidden="true" />
              <iframe
                className={styles.frame}
                src={APP_URL}
                title="Prototype de l’application TilliT"
                loading="lazy"
              />
            </div>
            <a href={APP_URL} target="_blank" rel="noopener" className={styles.fullscreen}>
              <i className="fa-solid fa-expand" aria-hidden="true" />
              Ouvrir en plein écran
            </a>
          </div>

          <aside className={`${styles.side} ${styles.sideRight}`} data-reveal="right">
            <span className={styles.kicker}>Bon à savoir</span>
            <h2 className={styles.sideTitle}>Un prototype, pas l’application</h2>
            <div className={styles.tips}>
              <p>
                <i className="fa-solid fa-flask" aria-hidden="true" />
                <span>
                  C’est une version de test&nbsp;: aucune donnée réelle, aucun paiement réel.
                </span>
              </p>
              <p>
                <i className="fa-solid fa-mobile-screen" aria-hidden="true" />
                <span>Ce que tu saisis reste sur ton téléphone.</span>
              </p>
              <p>
                <i className="fa-solid fa-comment-dots" aria-hidden="true" />
                <span>Un court questionnaire te demande ton avis&nbsp;: il nous aide à l’améliorer.</span>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.after}>
        <div className={styles.post} data-reveal>
          <h2>Tu veux la vraie application&nbsp;?</h2>
          <p>On t’écrit dès l’ouverture de TilliT.</p>
          <Link to="/#cta" className={styles.postBtn}>
            Être prévenu du lancement
            <i className="fa-solid fa-bell" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
