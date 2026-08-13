import { useState } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar/Navbar';
import LegalModal, { type LegalTab } from './components/LegalModal/LegalModal';
import Hero, { HeroSocialProof } from './components/Hero/Hero';
import StatsBanner from './components/StatsBanner/StatsBanner';
import Problem from './components/Problem/Problem';
import Comparison from './components/Comparison/Comparison';
import Benefits from './components/Benefits/Benefits';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Signature from './components/Signature/Signature';
import Partners from './components/Partners/Partners';
import Pricing from './components/Pricing/Pricing';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';

export default function App() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HeroSocialProof />
        <StatsBanner />
        <Problem />
        <Comparison />
        <Benefits />
        <HowItWorks />
        <Signature />
        <Pricing />
        <Partners />
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
      <ChatAssistant />
    </>
  );
}
