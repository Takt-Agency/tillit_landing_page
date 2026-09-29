import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { langOf, switchLang, type Lang } from '../i18n';

type Meta = { title: string; description: string };

// Tab title and meta description of each page, copied from the reference site (FR and EN).
// Keyed by the FRENCH path.
const META: Record<Lang, Record<string, Meta>> = {
  fr: {
    '/': {
      title: "L’argent entre proches, sans le malaise · TilliT",
      description: "TilliT, l’application française qui aide à organiser les prêts d’argent entre proches. Vous gardez la confiance, on s’occupe des détails. Bientôt disponible.",
    },
    '/notre-histoire': {
      title: "D’où vient le nom TilliT · TilliT",
      description: "TilliT vient de tillit, un mot norvégien et suédois qui veut dire confiance. Il se lit dans les deux sens. L’origine du projet, en deux minutes.",
    },
    '/comment-ca-marche': {
      title: "Comment ça marche : ton prêt en quatre étapes · TilliT",
      description: "On se met d’accord, le prêt démarre, ça avance, prêt terminé : les quatre étapes d’un prêt entre proches avec TilliT, côté prêteur et côté emprunteur.",
    },
    '/tarifs': {
      title: "Tarifs · Combien coûte TilliT ?",
      description: "Deux formules : Note, sans frais jusqu’à 1 500 €, et Zen, dès 2,99 € en un seul paiement, avec une reconnaissance de dette signée.",
    },
    '/confiance': {
      title: "Carnet de prêt et Tiers de confiance · TilliT",
      description: "Le Carnet de prêt garde la trace de tes prêts remboursés. Le Tiers de confiance peut aider à reprendre la discussion.",
    },
    '/difference': {
      title: "Partage de dépenses ou prêt organisé ? · TilliT",
      description: "Une application de partage de dépenses répond à « qui doit combien ». TilliT répond à ce qui vient après : quand, en combien de fois, et selon quel calendrier.",
    },
    '/recours': {
      title: "Le remboursement ne vient pas : la marche à suivre · TilliT",
      description: "Mise en demeure, conciliation, injonction de payer : les étapes concrètes pour récupérer une somme prêtée à un proche, et les pièces qui peuvent t’aider.",
    },
    '/cas-usage': {
      title: "Cas d’usage · TilliT",
      description: "Des exemples de prêts d’argent entre proches : dépanner un ami, aider sa famille, suivre les remboursements et parler d’un imprévu.",
    },
    '/blog': {
      title: "Conseils · TilliT",
      description: "Des repères simples sur les prêts d’argent entre proches : ce qu’il faut poser avant de prêter, comment réagir à un imprévu, et comment garder la relation intacte.",
    },
    '/article-preter-avant-virement': {
      title: "Prêter à un proche : ce qu’il faut poser avant le virement · TilliT",
      description: "Montant, dates, échéances, cadeau ou prêt : les cinq points à régler pendant que tout va bien, parce que c’est le seul moment où c’est facile à dire.",
    },
    '/article-imprevu-echeancier': {
      title: "Quand un proche ne peut plus suivre l’échéancier · TilliT",
      description: "Parler tôt, proposer un réaménagement, formaliser le nouvel accord : comment éviter que le retard ne devienne un silence, et le silence une rupture.",
    },
    '/faq': {
      title: "Questions fréquentes · TilliT",
      description: "Les réponses à tes questions sur TilliT et les prêts entre proches : formules, remboursements, imprévus et démarches.",
    },
    '/contact': {
      title: "Écris-nous · TilliT",
      description: "Une question, une remarque, une idée : ça nous intéresse.",
    },
    '/confirmation': {
      title: "Merci ! · TilliT",
      description: "Ta place est réservée. On t’écrit dès l’ouverture de TilliT.",
    },
    '/404': {
      title: "Cette page n’existe pas · TilliT",
      description: "Le lien est peut-être ancien, ou l’adresse comporte une coquille.",
    },
    '/mentions-legales': {
      title: "Mentions légales · TilliT",
      description: "Qui édite ce site, qui l’héberge, et à qui s’adresser.",
    },
    '/conditions': {
      title: "Conditions d’utilisation · TilliT",
      description: "Les règles d’usage de ce site, en attendant celles de l’application.",
    },
    '/confidentialite': {
      title: "Confidentialité · TilliT",
      description: "Les données que ce site collecte, pourquoi, combien de temps, et comment les faire effacer.",
    },
    '/cookies': {
      title: "Cookies · TilliT",
      description: "Ce site n’en dépose aucun. Voici comment on l’a vérifié.",
    },
      '/prototype': {
      title: 'Prototype de l’application · TilliT',
      description: 'Le prototype cliquable de l’application TilliT.',
    },
  },
  en: {
    '/': {
      title: "Money between friends and family, without the awkwardness · TilliT",
      description: "TilliT, the French app that helps organise money lent between friends and family. You keep the trust, we take care of the details. Coming soon.",
    },
    '/notre-histoire': {
      title: "Where the name TilliT comes from · TilliT",
      description: "TilliT comes from tillit, a Norwegian and Swedish word meaning trust. It reads the same both ways. Where the project came from, in two minutes.",
    },
    '/comment-ca-marche': {
      title: "How it works: your loan in four steps · TilliT",
      description: "You agree, the loan starts, it moves along, loan done: the four steps of a loan between friends and family with TilliT, from the lender’s side and the borrower’s side.",
    },
    '/tarifs': {
      title: "Pricing · How much does TilliT cost?",
      description: "Two plans: Note, with no fees up to €1,500, and Zen, from €2.99 in one payment, with a signed acknowledgement of debt.",
    },
    '/confiance': {
      title: "Carnet de prêt and trusted third party · TilliT",
      description: "Your Carnet de prêt, your loan record book, keeps a trace of the loans you’ve repaid. The trusted third party can help you start talking again.",
    },
    '/difference': {
      title: "Expense splitting or an organised loan? · TilliT",
      description: "An expense splitting app answers “who owes what”. TilliT answers what comes next: when, in how many instalments, and on which dates.",
    },
    '/recours': {
      title: "Repayment isn’t coming: the steps to follow · TilliT",
      description: "Mise en demeure, conciliation, injonction de payer: the concrete steps to recover money you lent to someone close, and the documents that can help you.",
    },
    '/cas-usage': {
      title: "Use cases · TilliT",
      description: "Examples of money lent between friends and family: helping out a friend, supporting your family, tracking repayments and talking about the unexpected.",
    },
    '/blog': {
      title: "Advice · TilliT",
      description: "Short, concrete pointers on lending money between friends and family: what to settle before you lend, how to handle a setback, and how to keep the relationship whole.",
    },
    '/article-preter-avant-virement': {
      title: "Lending to a friend: what to settle before you transfer the money · TilliT",
      description: "Amount, dates, instalments, gift or loan: the five things to settle while everything is fine, because that’s the only time they’re easy to say.",
    },
    '/article-imprevu-echeancier': {
      title: "When a friend can’t keep up with the instalments · TilliT",
      description: "Speak up early, offer a new schedule, write the new agreement down: how to keep a late payment from turning into silence, and silence into a rift.",
    },
    '/faq': {
      title: "Frequently asked questions · TilliT",
      description: "Answers to your questions about TilliT and lending money between friends and family: plans, repayments, the unexpected and the paperwork.",
    },
    '/contact': {
      title: "Write to us · TilliT",
      description: "A question, a remark, an idea: we want to hear it.",
    },
    '/confirmation': {
      title: "Thank you! · TilliT",
      description: "Your place is saved. We’ll write to you as soon as TilliT opens.",
    },
    '/404': {
      title: "This page doesn’t exist · TilliT",
      description: "The link may be old, or the address has a typo in it.",
    },
    '/mentions-legales': {
      title: "Legal notice · TilliT",
      description: "Who publishes this site, who hosts it, and who to contact.",
    },
    '/conditions': {
      title: "Terms of use · TilliT",
      description: "The rules for using this site, until the app has its own.",
    },
    '/confidentialite': {
      title: "Privacy · TilliT",
      description: "The data this site collects, why, for how long, and how to have it erased.",
    },
    '/cookies': {
      title: "Cookies · TilliT",
      description: "This site sets none. Here is how we checked.",
    },
    '/prototype': {
      title: 'App prototype · TilliT',
      description: 'The clickable prototype of the TilliT app.',
    },
  },
};

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lang = langOf(pathname);
    // French path of the page; unknown addresses resolve to /404.
    const frPath =
      lang === 'fr'
        ? switchLang(switchLang(pathname, '', 'en'), '', 'fr')
        : switchLang(pathname, '', 'fr');
    const meta = META[lang][frPath] ?? META[lang]['/404'];
    document.documentElement.lang = lang;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname]);

  return null;
}
