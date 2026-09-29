import { Link } from 'react-router-dom';
import styles from './FaqTeaser.module.css';
import { typo, useLang, useLocalize } from '../../i18n';

const COPY = {
  fr: {
    title: 'Questions',
    titleEnd: 'fréquentes',
    lead: 'Les questions qu’on se pose avant de prêter, et celles qui arrivent après.',
    cta: 'Toutes les questions',
    preview: [
      { q: 'TilliT est-il une banque ?', side: 'left' },
      { q: 'Peut-on demander des intérêts ?', side: 'right' },
      { q: 'Et si un mois je ne peux pas payer ?', side: 'left' },
    ],
  },
  en: {
    title: 'Common',
    titleEnd: 'questions',
    lead: 'The questions you ask before lending, and the ones that come afterwards.',
    cta: 'All the questions',
    preview: [
      { q: 'Is TilliT a bank?', side: 'left' },
      { q: 'Can you charge interest?', side: 'right' },
      { q: 'What if I can’t pay one month?', side: 'left' },
    ],
  },
} as const;

export default function FaqTeaser() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-teaser-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content} data-reveal="left">
          <span className={styles.eyebrow}>FAQ</span>
          <h2 id="faq-teaser-title" className={styles.title}>
            {t.title}{' '}
            <span className={styles.titleEnd}>
              {t.titleEnd}
              <span className={styles.titleIcon} aria-hidden="true">
                <i className="fa-solid fa-question" />
              </span>
            </span>
          </h2>
          <p className={styles.lead}>{t.lead}</p>
          <Link to={l('/faq')} className={styles.cta}>
            {t.cta}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <ul className={styles.bubbles} data-reveal="right">
          {t.preview.map((item, i) => (
            <li
              key={item.q}
              className={`${styles.bubbleRow} ${item.side === 'right' ? styles.bubbleRight : ''}`}
              style={{ ['--i' as string]: i }}
            >
              <Link to={l('/faq')} className={styles.bubble}>
                <span className={styles.bubbleIcon} aria-hidden="true">
                  <i className="fa-solid fa-comment-dots" />
                </span>
                <span>{typo(item.q, lang)}</span>
                <i className={`fa-solid fa-chevron-right ${styles.bubbleArrow}`} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
