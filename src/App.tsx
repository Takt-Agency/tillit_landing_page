import Navbar from './components/Navbar/Navbar';
import Hero, { HeroSocialProof } from './components/Hero/Hero';
import StatsBanner from './components/StatsBanner/StatsBanner';
import Problem from './components/Problem/Problem';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Pricing from './components/Pricing/Pricing';
import Testimonials from './components/Testimonials/Testimonials';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HeroSocialProof />
        <StatsBanner />
        <Problem />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <ChatAssistant />
    </>
  );
}
