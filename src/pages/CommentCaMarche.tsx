import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero, { pageHeroStyles } from '../components/PageHero/PageHero';
import Parcours from '../components/Parcours/Parcours';
import Footer from '../components/Footer/Footer';
import styles from './CommentCaMarche.module.css';

const TRACK = [
  { label: 'On se met d’accord', color: '#8b63e8' },
  { label: 'Le prêt démarre', color: '#ef8068' },
  { label: 'Ça avance', color: '#4f9ee3' },
  { label: 'Prêt terminé', color: '#2fae6d' },
];

export default function CommentCaMarche() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main className={styles.main}>
        <PageHero
          eyebrow="Comment ça marche"
          title={
            <>
              Un prêt entre proches,{' '}
              <span className={pageHeroStyles.accent}>en quatre étapes.</span>
            </>
          }
          lead="Le même prêt, vu des deux côtés : Léonie prête, Thomas emprunte."
        >
          <ol className={pageHeroStyles.track}>
            {TRACK.map((t, i) => (
              <li key={t.label}>
                <a
                  href="#parcours"
                  className={pageHeroStyles.trackItem}
                  style={{ ['--dot' as string]: t.color }}
                >
                  <span className={pageHeroStyles.trackNum}>{String(i + 1).padStart(2, '0')}</span>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </PageHero>
        <Parcours />
        <section className={styles.reserve}>
          <div className={styles.card} data-reveal>
            <h2 className={styles.title}>Réserve ta place</h2>
            <p className={styles.text}>On t’écrit dès l’ouverture de TilliT.</p>
            <Link to="/#cta" className={styles.btn}>
              Être prévenu du lancement
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
