import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero, { pageHeroStyles } from '../components/PageHero/PageHero';
import FaqFull from '../components/FaqFull/FaqFull';
import Footer from '../components/Footer/Footer';
import styles from './Faq.module.css';

export default function FaqPage() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main className={styles.main}>
        <PageHero
          eyebrow="FAQ"
          title={
            <>
              Questions <span className={pageHeroStyles.accent}>fréquentes</span>
            </>
          }
          lead="Tout ce qu’il faut savoir sur TilliT, sans jargon ni zone d’ombre. Tes questions, avec les réponses qu’on donnerait de vive voix."
        >
          <p className={styles.note}>
            Les informations juridiques de cette page sont en cours de relecture par notre
            conseil.
          </p>
        </PageHero>
        <FaqFull />
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
