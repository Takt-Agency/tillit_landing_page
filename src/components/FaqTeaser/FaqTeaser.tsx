import { Link } from 'react-router-dom';
import styles from './FaqTeaser.module.css';
import { fr } from '../../lib/typo';

const PREVIEW = [
  { q: 'TilliT est-il une banque ?', side: 'left' },
  { q: 'Peut-on demander des intérêts ?', side: 'right' },
  { q: 'Et si un mois je ne peux pas payer ?', side: 'left' },
] as const;

export default function FaqTeaser() {
  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-teaser-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content} data-reveal="left">
          <span className={styles.eyebrow}>FAQ</span>
          <h2 id="faq-teaser-title" className={styles.title}>
            Questions{' '}
            <span className={styles.titleEnd}>
              fréquentes
              <span className={styles.titleIcon} aria-hidden="true">
                <i className="fa-solid fa-question" />
              </span>
            </span>
          </h2>
          <p className={styles.lead}>
            Les questions qu’on se pose avant de prêter, et celles qui arrivent après.
          </p>
          <Link to="/faq" className={styles.cta}>
            Toutes les questions
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <ul className={styles.bubbles} data-reveal="right">
          {PREVIEW.map((item, i) => (
            <li
              key={item.q}
              className={`${styles.bubbleRow} ${item.side === 'right' ? styles.bubbleRight : ''}`}
              style={{ ['--i' as string]: i }}
            >
              <Link to="/faq" className={styles.bubble}>
                <span className={styles.bubbleIcon} aria-hidden="true">
                  <i className="fa-solid fa-comment-dots" />
                </span>
                <span>{fr(item.q)}</span>
                <i className={`fa-solid fa-chevron-right ${styles.bubbleArrow}`} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
