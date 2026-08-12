import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar/Navbar';
import Hero, { HeroSocialProof } from './components/Hero/Hero';
import StatsBanner from './components/StatsBanner/StatsBanner';
import Problem from './components/Problem/Problem';
import Comparison from './components/Comparison/Comparison';
import Benefits from './components/Benefits/Benefits';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Pricing from './components/Pricing/Pricing';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';

export default function App() {
  useScrollReveal();
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
        <Pricing />
        <FAQ />
        <Contact />
        <CTA />
      </main>
      <Footer />
      <ChatAssistant />
    </>
  );
}
