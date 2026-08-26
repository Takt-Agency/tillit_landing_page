import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import Recours from '../components/Recours/Recours';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

export default function RecoursPage() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main>
        <Recours />
        <CTA />
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
