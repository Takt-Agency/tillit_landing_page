import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import { useLang, useLocalize, type Lang } from '../i18n';
import styles from './NotFound.module.css';

type Suggestion = {
  to: string;
  icon: string;
  label: string;
  desc?: string;
};

const SUGGESTIONS: Record<Lang, Suggestion[]> = {
  fr: [
    {
      to: '/',
      icon: 'fa-house',
      label: 'L’accueil',
      desc: '· comment TilliT organise un prêt entre proches',
    },
    {
      to: '/comment-ca-marche',
      icon: 'fa-list-check',
      label: 'Comment ça marche',
      desc: '· les quatre étapes',
    },
    {
      to: '/tarifs',
      icon: 'fa-tag',
      label: 'Les tarifs',
      desc: '· Note est gratuit, Zen est un paiement unique',
    },
    {
      to: '/blog',
      icon: 'fa-lightbulb',
      label: 'Les conseils',
      desc: '· prêter, emprunter, rembourser sans casse',
    },
    { to: '/faq', icon: 'fa-circle-question', label: 'Consulter la FAQ' },
    { to: '/contact', icon: 'fa-envelope', label: 'Écris-nous' },
  ],
  en: [
    {
      to: '/',
      icon: 'fa-house',
      label: 'Home',
      desc: '· how TilliT organises a loan between friends and family',
    },
    {
      to: '/comment-ca-marche',
      icon: 'fa-list-check',
      label: 'How it works',
      desc: '· the four steps',
    },
    {
      to: '/tarifs',
      icon: 'fa-tag',
      label: 'Pricing',
      desc: '· Note is free, Zen is a one-off payment',
    },
    {
      to: '/blog',
      icon: 'fa-lightbulb',
      label: 'Advice',
      desc: '· lending, borrowing and repaying without damage',
    },
    { to: '/faq', icon: 'fa-circle-question', label: 'Read the FAQ' },
    { to: '/contact', icon: 'fa-envelope', label: 'Write to us' },
  ],
};

const COPY = {
  fr: {
    eyebrow: 'Erreur 404',
    title: 'Cette page n’existe pas',
    lead: 'Le lien est peut-être ancien, ou l’adresse comporte une coquille.',
    chapo: 'Rien de grave. Voici où aller.',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'This page doesn’t exist',
    lead: 'The link may be old, or the address has a typo in it.',
    chapo: 'No harm done. Here’s where to go.',
  },
};

export default function NotFound() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const lang = useLang();
  const loc = useLocalize();
  const t = COPY[lang];
  return (
    <>
      <main className={styles.main}>
        <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <section className={styles.section}>
          <div className={styles.card} data-reveal>
            <p className={styles.chapo}>{t.chapo}</p>
            <ul className={styles.links}>
              {SUGGESTIONS[lang].map((s) => (
                <li key={s.to}>
                  <Link to={loc(s.to)} className={styles.link}>
                    <span className={styles.linkIcon} aria-hidden="true">
                      <i className={`fa-solid ${s.icon}`} />
                    </span>
                    <span className={styles.linkText}>
                      <span className={styles.linkLabel}>{s.label}</span>{' '}
                      {s.desc && <span className={styles.linkDesc}>{s.desc}</span>}
                    </span>
                    <i className={`fa-solid fa-arrow-right ${styles.arrow}`} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer onOpenLegal={setLegalTab} />
      <LegalModal tab={legalTab} onClose={() => setLegalTab(null)} onSelectTab={setLegalTab} />
    </>
  );
}
