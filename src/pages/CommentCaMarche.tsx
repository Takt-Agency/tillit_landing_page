import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLang, useLocalize } from '../i18n';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero, { pageHeroStyles } from '../components/PageHero/PageHero';
import Parcours from '../components/Parcours/Parcours';
import Footer from '../components/Footer/Footer';
import styles from './CommentCaMarche.module.css';

const TRACK_COLORS = ['#8b63e8', '#ef8068', '#4f9ee3', '#2fae6d'];

const COPY = {
  fr: {
    eyebrow: 'Comment ça marche',
    title: 'Un prêt entre proches,',
    titleAccent: 'en quatre étapes.',
    lead: 'Le même prêt, vu des deux côtés : Léonie prête, Thomas emprunte.',
    track: ['On se met d’accord', 'Le prêt démarre', 'Ça avance', 'Prêt terminé'],
    reserveTitle: 'Réserve ta place',
    reserveText: 'On t’écrit dès l’ouverture de TilliT.',
    reserveBtn: 'Être prévenu du lancement',
  },
  en: {
    eyebrow: 'How it works',
    title: 'A loan between friends and family,',
    titleAccent: 'in four steps.',
    lead: 'The same loan, seen from both sides: Léonie lends, Thomas borrows.',
    track: ['You two agree', 'The loan starts', 'It moves along', 'Loan done'],
    reserveTitle: 'Save your place',
    reserveText: 'We’ll write to you as soon as TilliT opens.',
    reserveBtn: 'Get notified at launch',
  },
};

export default function CommentCaMarche() {
  useScrollReveal();
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main className={styles.main}>
        <PageHero
          eyebrow={t.eyebrow}
          title={
            <>
              {t.title}{' '}
              <span className={pageHeroStyles.accent}>{t.titleAccent}</span>
            </>
          }
          lead={t.lead}
        >
          <ol className={pageHeroStyles.track}>
            {t.track.map((label, i) => (
              <li key={label}>
                <a
                  href="#parcours"
                  className={pageHeroStyles.trackItem}
                  style={{ ['--dot' as string]: TRACK_COLORS[i] }}
                >
                  <span className={pageHeroStyles.trackNum}>{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </PageHero>
        <Parcours />
        <section className={styles.reserve}>
          <div className={styles.card} data-reveal>
            <h2 className={styles.title}>{t.reserveTitle}</h2>
            <p className={styles.text}>{t.reserveText}</p>
            <Link to={l('/#waitlist')} className={styles.btn}>
              {t.reserveBtn}
              <i className="fa-solid fa-bell" aria-hidden="true" />
            </Link>
          </div>
        </section>
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
