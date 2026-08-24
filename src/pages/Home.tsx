import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import Hero from '../components/Hero/Hero';
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
import FAQ from '../components/FAQ/FAQ';
import Contact from '../components/Contact/Contact';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

export default function Home() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main>
        <Hero />
        <StatsBanner />
        <Roles />
        <Problem />
        <FourThings />
        <Situations />
        <Outcomes />
        <Pricing />
        <Signature />
        <Partners />
        <Solution />
        <FAQ />
        <Contact />
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
