import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import {
  TarifsGrille,
  TarifsHeroExtras,
  TarifsPrincipe,
  TarifsSuite,
} from '../components/TarifsSections/TarifsSections';
import Footer from '../components/Footer/Footer';
import { useLang } from '../i18n';

const HERO = {
  fr: {
    eyebrow: 'Tarifs',
    title: 'Combien coûte TilliT ?',
    lead: 'Deux formules : Note, sans frais, et Zen, payant une seule fois.',
  },
  en: {
    eyebrow: 'Pricing',
    title: 'How much does TilliT cost?',
    lead: 'Two plans: Note, with no fees, and Zen, paid once.',
  },
};

export default function Tarifs() {
  useScrollReveal();
  const lang = useLang();
  const hero = HERO[lang];
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main style={{ background: 'var(--color-cream)' }}>
        <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead}>
          <TarifsHeroExtras />
        </PageHero>
        <TarifsPrincipe />
        <TarifsGrille />
        <TarifsSuite />
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
