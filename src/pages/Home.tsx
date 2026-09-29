import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import Hero from '../components/Hero/Hero';
import SplitVsTillit from '../components/SplitVsTillit/SplitVsTillit';
import StatsBanner from '../components/StatsBanner/StatsBanner';
import Roles from '../components/Roles/Roles';
import Problem from '../components/Problem/Problem';
import FourThings from '../components/FourThings/FourThings';
import Situations from '../components/Situations/Situations';
import Outcomes from '../components/Outcomes/Outcomes';
import Signature from '../components/Signature/Signature';
import Partners from '../components/Partners/Partners';
import Solution from '../components/Solution/Solution';
import Pricing from '../components/Pricing/Pricing';
import Comparateur from '../components/Comparateur/Comparateur';
import FaqTeaser from '../components/FaqTeaser/FaqTeaser';
import Contact from '../components/Contact/Contact';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

// Temporarily hidden sections — set to true to show them again.
const SHOW_HIDDEN_SECTIONS = false;

export default function Home() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main>
        <Hero />
        <SplitVsTillit />
        <Problem />
        <FourThings />
        <Pricing />
        <Comparateur />
        <Partners />
        <FaqTeaser />
        <CTA />
        {SHOW_HIDDEN_SECTIONS && (
          <>
            <StatsBanner />
            <Roles />
            <Situations />
            <Outcomes />
            <Signature />
            <Solution />
            <Contact />
          </>
        )}
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
