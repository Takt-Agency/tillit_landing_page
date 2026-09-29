import { useState } from 'react';
import { Link } from 'react-router-dom';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import styles from './NotFound.module.css';

const SUGGESTIONS = [
  { to: '/', icon: 'fa-house', label: 'Accueil' },
  { to: '/comment-ca-marche', icon: 'fa-list-check', label: 'Comment ça marche' },
  { to: '/tarifs', icon: 'fa-tag', label: 'Tarifs' },
  { to: '/faq', icon: 'fa-circle-question', label: 'FAQ' },
];

export default function NotFound() {
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main className={styles.main}>
        <PageHero
          eyebrow="Erreur 404"
          title="Cette page n’existe pas."
          lead="Le lien est peut-être ancien, ou l’adresse contient une faute de frappe."
        >
          <ul className={styles.links}>
            {SUGGESTIONS.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className={styles.link}>
                  <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </PageHero>
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
