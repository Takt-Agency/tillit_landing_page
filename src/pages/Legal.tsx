import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import {
  CONTENT,
  LAST_UPDATE,
  LEGAL_ROUTES,
  TABS,
  type LegalTab,
} from '../components/Legal/legalContent';
import styles from './Legal.module.css';

export default function LegalPage({ tab }: { tab: LegalTab }) {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const Content = CONTENT[tab];
  const current = TABS.find((t) => t.key === tab)!;
  const activeRef = useRef<HTMLAnchorElement>(null);

  // On mobile the nav scrolls sideways: keep the current page's tab in view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [tab]);

  return (
    <>
      <main className={styles.main}>
        <PageHero eyebrow="Informations légales" title={current.label} lead={LAST_UPDATE} />

        <section className={styles.section}>
          <div className={styles.layout}>
            <nav className={styles.nav} aria-label="Informations légales">
              <ul>
                {TABS.map((t) => {
                  const route = LEGAL_ROUTES[t.key];
                  const active = t.key === tab;
                  const inner = (
                    <>
                      <span className={styles.navIcon} aria-hidden="true">
                        <i className={`fa-solid ${t.icon}`} />
                      </span>
                      {t.label}
                    </>
                  );
                  return (
                    <li key={t.key}>
                      {route ? (
                        <Link
                          ref={active ? activeRef : undefined}
                          to={route}
                          className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={styles.navItem}
                          onClick={() => setLegalTab(t.key)}
                        >
                          {inner}
                        </button>
                      )}
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
                  <p className={styles.cardUpdate}>{LAST_UPDATE}</p>
                </div>
              </header>
              <div className={styles.content}>
                <Content />
              </div>
              <p className={styles.contact}>
                <i className="fa-regular fa-envelope" aria-hidden="true" />
                Une question&nbsp;? Écris-nous à{' '}
                <a href="mailto:tillit@tillitapp.fr">tillit@tillitapp.fr</a>
              </p>
            </article>
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
