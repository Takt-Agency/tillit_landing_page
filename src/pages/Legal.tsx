import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import { CONTENT, LEGAL_COPY, type LegalTab } from '../components/Legal/legalContent';
import { useLang, useLocalize } from '../i18n';
import styles from './Legal.module.css';

export default function LegalPage({ tab }: { tab: LegalTab }) {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const lang = useLang();
  const l = useLocalize();
  const copy = LEGAL_COPY[lang];
  const Content = CONTENT[tab];
  const current = copy.tabs.find((t) => t.key === tab)!;
  const activeRef = useRef<HTMLAnchorElement>(null);

  // On mobile the nav scrolls sideways: keep the current page's tab in view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [tab]);

  return (
    <>
      <main className={styles.main}>
        <PageHero eyebrow={copy.eyebrow} title={current.label} lead={current.lead} />

        <section className={styles.section}>
          <div className={styles.layout}>
            <nav className={styles.nav} aria-label={copy.eyebrow}>
              <ul>
                {copy.tabs.map((t) => {
                  const active = t.key === tab;
                  return (
                    <li key={t.key}>
                      <Link
                        ref={active ? activeRef : undefined}
                        to={l(t.route)}
                        className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className={styles.navIcon} aria-hidden="true">
                          <i className={`fa-solid ${t.icon}`} />
                        </span>
                        {t.shortLabel}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <article className={styles.card} key={tab}>
              <header className={styles.cardHead}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <i className={`fa-solid ${current.icon}`} />
                </span>
                <div>
                  <h2 className={styles.cardTitle}>{current.label}</h2>
                  <p className={styles.cardUpdate}>{copy.lastUpdate}</p>
                </div>
              </header>
              <p className={styles.review}>
                <i className="fa-solid fa-circle-info" aria-hidden="true" />
                {copy.reviewNote}
              </p>
              <div className={styles.content}>
                <Content />
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer onOpenLegal={setLegalTab} />
      <LegalModal tab={legalTab} onClose={() => setLegalTab(null)} onSelectTab={setLegalTab} />
    </>
  );
}
