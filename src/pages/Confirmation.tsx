import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import styles from './Confirmation.module.css';

const LINKS = [
  { to: '/cas-usage', icon: 'fa-lightbulb', label: 'Des exemples de prêts entre proches' },
  { to: '/confiance', icon: 'fa-book-open', label: 'Le Carnet de prêt et le Tiers de confiance' },
  { to: '/tarifs', icon: 'fa-tag', label: 'Ce que ça coûte' },
  { to: '/faq', icon: 'fa-circle-question', label: 'Les questions fréquentes' },
];

export default function ConfirmationPage() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main className={styles.main}>
        <PageHero
          eyebrow="Inscription confirmée"
          title="Merci !"
          lead="Ta place est réservée. On t’écrit dès l’ouverture de TilliT."
        >
          <span className={styles.check} aria-hidden="true">
            <i className="fa-solid fa-check" />
          </span>
        </PageHero>

        <section className={styles.section}>
          <div className={styles.card} data-reveal>
            <p className={styles.chapo}>Rien d’autre à faire. On t’écrit quand TilliT ouvre.</p>
            <h2 className={styles.title}>En attendant</h2>
            <ul className={styles.links}>
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={styles.link}>
                    <span className={styles.linkIcon} aria-hidden="true">
                      <i className={`fa-solid ${l.icon}`} />
                    </span>
                    <span className={styles.linkLabel}>{l.label}</span>
                    <i className={`fa-solid fa-arrow-right ${styles.arrow}`} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className={styles.back}>
              <Link to="/">
                <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Retour à l’accueil
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer onOpenLegal={setLegalTab} />
      <LegalModal
        tab={legalTab}
        onClose={() => setLegalTab(null)}
        onSelectTab={setLegalTab}
      />
    </>
  );
}
