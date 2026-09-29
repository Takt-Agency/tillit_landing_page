import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import { useLang, useLocalize } from '../i18n';
import styles from './Confirmation.module.css';

const COPY = {
  fr: {
    eyebrow: 'Inscription confirmée',
    title: 'Merci !',
    lead: 'Ta place est réservée. On t’écrit dès l’ouverture de TilliT.',
    chapo: 'Rien d’autre à faire. On t’écrit quand TilliT ouvre.',
    meantime: 'En attendant',
    back: 'Retour à l’accueil',
    links: [
      { to: '/cas-usage', icon: 'fa-lightbulb', label: 'Des exemples de prêts entre proches' },
      { to: '/confiance', icon: 'fa-book-open', label: 'Le Carnet de prêt et le Tiers de confiance' },
      { to: '/tarifs', icon: 'fa-tag', label: 'Ce que ça coûte' },
      { to: '/faq', icon: 'fa-circle-question', label: 'Les questions fréquentes' },
    ],
  },
  en: {
    eyebrow: 'You’re on the list',
    title: 'Thank you!',
    lead: 'Your place is saved. We’ll write to you as soon as TilliT opens.',
    chapo: 'Nothing else to do. We’ll write when TilliT opens.',
    meantime: 'In the meantime',
    back: 'Back to the home page',
    links: [
      {
        to: '/cas-usage',
        icon: 'fa-lightbulb',
        label: 'Examples of loans between friends and family',
      },
      {
        to: '/confiance',
        icon: 'fa-book-open',
        label: 'The Carnet de prêt, your loan record book, and the trusted third party',
      },
      { to: '/tarifs', icon: 'fa-tag', label: 'What it costs' },
      { to: '/faq', icon: 'fa-circle-question', label: 'Common questions' },
    ],
  },
};

export default function ConfirmationPage() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const t = COPY[useLang()];
  const loc = useLocalize();
  return (
    <>
      <main className={styles.main}>
        <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
          <span className={styles.check} aria-hidden="true">
            <i className="fa-solid fa-check" />
          </span>
        </PageHero>

        <section className={styles.section}>
          <div className={styles.card} data-reveal>
            <p className={styles.chapo}>{t.chapo}</p>
            <h2 className={styles.title}>{t.meantime}</h2>
            <ul className={styles.links}>
              {t.links.map((l) => (
                <li key={l.to}>
                  <Link to={loc(l.to)} className={styles.link}>
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
              <Link to={loc('/')}>
                <span aria-hidden="true">←</span> {t.back}
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
