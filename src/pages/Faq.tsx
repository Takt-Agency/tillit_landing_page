import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero, { pageHeroStyles } from '../components/PageHero/PageHero';
import FaqFull from '../components/FaqFull/FaqFull';
import Footer from '../components/Footer/Footer';
import { useLang } from '../i18n';
import styles from './Faq.module.css';

const COPY = {
  fr: {
    title: (
      <>
        Questions <span className={pageHeroStyles.accent}>fréquentes</span>
      </>
    ),
    lead: 'Tout ce qu’il faut savoir sur TilliT, sans jargon ni zone d’ombre. Tes questions, avec les réponses qu’on donnerait de vive voix.',
    note: 'Les informations juridiques de cette page sont en cours de relecture par notre conseil.',
  },
  en: {
    title: (
      <>
        Frequently asked <span className={pageHeroStyles.accent}>questions</span>
      </>
    ),
    lead: 'Everything you need to know about TilliT, with no jargon and nothing left vague. Your questions, with the answers we’d give you out loud.',
    note: 'The legal information on this page is being reviewed by our legal counsel.',
  },
};

export default function FaqPage() {
  useScrollReveal();
  const t = COPY[useLang()];
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main className={styles.main}>
        <PageHero eyebrow="FAQ" title={t.title} lead={t.lead}>
          <p className={styles.note}>{t.note}</p>
        </PageHero>
        <FaqFull />
      </main>
      <Footer onOpenLegal={setLegalTab} />
      <LegalModal tab={legalTab} onClose={() => setLegalTab(null)} onSelectTab={setLegalTab} />
    </>
  );
}
