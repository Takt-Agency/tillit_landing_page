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

export default function Tarifs() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main style={{ background: 'var(--color-cream)' }}>
        <PageHero
          eyebrow="Tarifs"
          title="Combien coûte TilliT ?"
          lead="Deux formules : Note, sans frais, et Zen, payant une seule fois."
        >
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
