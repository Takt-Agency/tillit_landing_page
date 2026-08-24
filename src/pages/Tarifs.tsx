import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import TarifsHero from '../components/TarifsHero/TarifsHero';
import TarifsDetails from '../components/TarifsDetails/TarifsDetails';
import TarifsSimulator from '../components/TarifsSimulator/TarifsSimulator';
import Solution from '../components/Solution/Solution';
import FAQ, { type FAQItem } from '../components/FAQ/FAQ';
import Contact from '../components/Contact/Contact';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';
import styles from '../components/FAQ/FAQ.module.css';

const TARIFS_FAQ: FAQItem[] = [
  {
    q: "tillit prend-il des intérêts sur la somme prêtée ?",
    a: "Zéro intérêt, zéro commission. tillit ne gagne jamais d'argent sur la somme prêtée à ton proche. Le seul prix, avec la formule Zen, est un paiement unique pour créer et conserver le document juridique — c'est tout.",
  },
  {
    q: "Combien coûte tillit Zen, exactement ?",
    a: "Un paiement unique qui dépend du montant prêté : 4,99 € pour 100–500 €, 9,99 € pour 501–1 000 €, 19,99 € pour 1 001–2 000 €, 29,99 € pour 2 001–3 000 €, 39,99 € pour 3 001–4 000 €, et 49,99 € pour 4 001–5 000 €. Ni abonnement, ni renouvellement, ni frais cachés.",
  },
  {
    q: "Le prix change-t-il avec la durée du prêt ?",
    a: "Non. Que le prêt se rembourse en 3 mois ou en 5 ans, tu paies le même montant, une seule fois. Le tarif dépend uniquement de la somme prêtée, jamais du temps.",
  },
  {
    q: "Qui paie : le prêteur ou l'emprunteur ?",
    a: "Celui des deux qui le souhaite. Prêteur ou emprunteur, indifféremment. Le payer peut d'ailleurs être une façon de montrer sa bonne foi lorsqu'on emprunte.",
  },
  {
    q: "Quelle est la différence entre l'offre Note (gratuite) et Zen ?",
    a: "Note reste 100 % gratuite : elle suffit largement pour les prêts jusqu'à 1 500 € entre proches en toute confiance — cadre, calendrier, rappels doux. Zen ajoute la reconnaissance de dette officielle avec signature électronique qualifiée eIDAS, KYC et dossier de preuves, pour les montants importants ou les situations sensibles.",
  },
  {
    q: "L'application tillit est-elle vraiment gratuite ?",
    a: "Oui. Créer un compte, poser un prêt entre proches, suivre l'échéancier et recevoir des rappels — tout ça est gratuit, sans limite de temps. Seule la formule Zen (optionnelle) est payante, et uniquement à l'usage.",
  },
  {
    q: "Y a-t-il un abonnement ou des frais cachés ?",
    a: "Aucun. Pas d'abonnement, pas de frais de dossier, pas de commission sur les remboursements, pas de reconduction tacite. Le prix affiché est le prix payé, une fois pour toutes.",
  },
  {
    q: "Puis-je essayer sans payer ?",
    a: "Bien sûr. Télécharge l'app, crée ton premier prêt avec l'offre Note — tu ne paies rien. Tu ne passes à Zen que si tu décides d'ajouter une reconnaissance de dette avec signature, et uniquement au moment où tu en as besoin.",
  },
];

export default function Tarifs() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main>
        <TarifsHero />
        <TarifsDetails />
        <TarifsSimulator />
        <Solution />
        <FAQ
          items={TARIFS_FAQ}
          eyebrow="FAQ · Tarifs"
          title={
            <>
              Les questions{' '}
              <span className={styles.titleAccent}>sur le prix</span>
              <i
                className={`fa-solid fa-tag ${styles.titleIcon}`}
                aria-hidden="true"
              />
            </>
          }
          lead="Ce que ça coûte, ce que ça ne coûte pas, et pourquoi."
        />
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
