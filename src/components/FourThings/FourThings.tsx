import { Link } from 'react-router-dom';
import styles from './FourThings.module.css';
import { useLang, useLocalize, type Lang } from '../../i18n';
import mascotUrl from '../../millions-mascotte.png';
import montantUrl from '../../assets/quatre/quatre-montant-96.webp';
import echeancesUrl from '../../assets/quatre/quatre-echeances-96.webp';
import datesUrl from '../../assets/quatre/quatre-dates-96.webp';
import suiviUrl from '../../assets/quatre/quatre-suivi-96.webp';

type Accent = 'violet' | 'coral' | 'blue' | 'green';

type Item = {
  n: number;
  tag: string;
  tagIcon: string;
  img: string;
  alt: string;
  accent: Accent;
  strong: string;
  text: string;
};

const LEFT_FR: Item[] = [
  {
    n: 1,
    tag: 'Clarté',
    tagIcon: 'fa-magnifying-glass',
    img: montantUrl,
    alt: 'Le montant du prêt, écrit noir sur blanc',
    accent: 'violet',
    strong: 'Le montant.',
    text: 'Ce qui est prêté, écrit noir sur blanc.',
  },
  {
    n: 3,
    tag: 'Sérénité',
    tagIcon: 'fa-face-smile',
    img: datesUrl,
    alt: 'Les dates du prêt, jusqu’à celle de la fin',
    accent: 'coral',
    strong: 'Jusqu’à quand.',
    text: 'Les dates exactes, et surtout celle de la fin.',
  },
];

const RIGHT_FR: Item[] = [
  {
    n: 2,
    tag: 'Confiance',
    tagIcon: 'fa-shield-halved',
    img: echeancesUrl,
    alt: 'Le remboursement, mois après mois',
    accent: 'blue',
    strong: 'Combien par mois.',
    text: 'Et donc en combien de fois.',
  },
  {
    n: 4,
    tag: 'Respect',
    tagIcon: 'fa-heart',
    img: suiviUrl,
    alt: 'Le suivi du prêt, au même endroit pour vous deux',
    accent: 'green',
    strong: 'Le suivi.',
    text: 'Au même endroit, visible par vous deux.',
  },
];

const LEFT_EN: Item[] = [
  {
    n: 1,
    tag: 'Clarity',
    tagIcon: 'fa-magnifying-glass',
    img: montantUrl,
    alt: 'The loan amount, in black and white',
    accent: 'violet',
    strong: 'The amount.',
    text: 'What’s lent, in black and white.',
  },
  {
    n: 3,
    tag: 'Calm',
    tagIcon: 'fa-face-smile',
    img: datesUrl,
    alt: 'The loan dates, up to the last one',
    accent: 'coral',
    strong: 'Until when.',
    text: 'The exact dates, and above all the last one.',
  },
];

const RIGHT_EN: Item[] = [
  {
    n: 2,
    tag: 'Trust',
    tagIcon: 'fa-shield-halved',
    img: echeancesUrl,
    alt: 'The repayment, month after month',
    accent: 'blue',
    strong: 'How much a month.',
    text: 'And so, in how many payments.',
  },
  {
    n: 4,
    tag: 'Respect',
    tagIcon: 'fa-heart',
    img: suiviUrl,
    alt: 'The loan tracking, in one place for both of you',
    accent: 'green',
    strong: 'The tracking.',
    text: 'In one place, visible to both of you.',
  },
];

const ITEMS: Record<Lang, { left: Item[]; right: Item[] }> = {
  fr: { left: LEFT_FR, right: RIGHT_FR },
  en: { left: LEFT_EN, right: RIGHT_EN },
};

const COPY = {
  fr: { eyebrow: 'La solution', cta: 'Voir comment ça marche' },
  en: { eyebrow: 'The solution', cta: 'See how it works' },
};

function Card({ item, side }: { item: Item; side: 'left' | 'right' }) {
  return (
    <div
      className={`${styles.cardWrap} ${styles[`side_${side}`]} ${
        styles[`accent_${item.accent}`]
      }`}
      data-reveal={side}
      style={{
        ['--reveal-delay' as string]: `${(item.n - 1) * 110}ms`,
        order: item.n,
      }}
    >
      <article className={styles.card}>
        {/* Yohann's illustrations, in a square lavender frame */}
        <span className={styles.cardIcon}>
          <img
            src={item.img}
            alt={item.alt}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
          />
        </span>
        <div className={styles.cardBody}>
          <span className={styles.tag}>
            {item.tag}
            <span className={styles.tagIcon} aria-hidden="true">
              <i className={`fa-solid ${item.tagIcon}`} />
            </span>
          </span>
          <p className={styles.cardText}>
            <strong>{item.strong}</strong> {item.text}
          </p>
        </div>
      </article>
    </div>
  );
}

export default function FourThings() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const { left, right } = ITEMS[lang];
  return (
    <section className={styles.section} id="solution" aria-labelledby="solution-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h2 id="solution-title" className={styles.title}>
            {lang === 'en' ? (
              <>
                Four things <span className={styles.titleAccent}>to agree on.</span>
              </>
            ) : (
              <>
                Quatre choses <span className={styles.titleAccent}>à se dire.</span>
              </>
            )}
          </h2>
        </header>

        <div className={styles.layout}>
          <div className={styles.column}>
            {left.map((item) => (
              <Card key={item.tag} item={item} side="left" />
            ))}
          </div>

          <div className={styles.center} data-reveal="zoom">
            <span className={styles.orbit} aria-hidden="true" />
            <span className={styles.platform} aria-hidden="true" />
            <div className={styles.confetti} aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={styles[`c${i + 1}`]} />
              ))}
            </div>
            <img
              src={mascotUrl}
              alt=""
              aria-hidden="true"
              className={styles.mascot}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
            />
          </div>

          <div className={styles.column}>
            {right.map((item) => (
              <Card key={item.tag} item={item} side="right" />
            ))}
          </div>
        </div>

        <div className={styles.ctaWrap} data-reveal>
          <Link to={l('/comment-ca-marche')} className={styles.cta}>
            {t.cta}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
