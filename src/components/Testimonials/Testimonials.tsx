import { useEffect, useState } from 'react';
import styles from './Testimonials.module.css';

function useIsMobile(query = '(max-width: 720px)') {
  const [is, setIs] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setIs(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return is;
}

type Testimonial = {
  name: string;
  location: string;
  color: string;
  initial: string;
  verified?: boolean;
  quote: JSX.Element;
};

const H = ({ children }: { children: React.ReactNode }) => (
  <mark className={styles.mark}>{children}</mark>
);

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah M.',
    location: 'Paris, France',
    color: '#ef8068',
    initial: 'S',
    quote: (
      <>
        tillit m'a permis d'emprunter rapidement auprès de mes proches sans aucune
        gêne. Tout est <H>clair</H>, <H>simple et sécurisé</H>.
      </>
    ),
  },
  {
    name: 'Thomas L.',
    location: 'Lyon, France',
    color: '#8b63e8',
    initial: 'T',
    verified: true,
    quote: (
      <>
        L'interface est intuitive et les remboursements sont super bien organisés.{' '}
        <H>Fini les oublis et les tensions !</H>
      </>
    ),
  },
  {
    name: 'David K.',
    location: 'Bruxelles, Belgique',
    color: '#4ec18a',
    initial: 'D',
    quote: (
      <>
        J'adore le système de cagnotte entre amis, parfait pour nos{' '}
        <H>projets de voyage</H> et <H>cadeaux communs</H>.
      </>
    ),
  },
  {
    name: 'Amina B.',
    location: 'Marseille, France',
    color: '#f4b942',
    initial: 'A',
    quote: (
      <>
        Prêter à mon frère sans jamais avoir à relancer — <H>ça change tout</H>.
        Les rappels doux sont géniaux.
      </>
    ),
  },
  {
    name: 'Karim H.',
    location: 'Genève, Suisse',
    color: '#6bb1f2',
    initial: 'K',
    verified: true,
    quote: (
      <>
        J'ai utilisé tillit ZEN pour un prêt important. Le dossier{' '}
        <H>eIDAS et le suivi</H> m'ont totalement rassuré.
      </>
    ),
  },
  {
    name: 'Léa P.',
    location: 'Nantes, France',
    color: '#b599f2',
    initial: 'L',
    quote: (
      <>
        Enfin une app qui parle des prêts entre proches{' '}
        <H>sans culpabiliser personne</H>. Bravo à l'équipe !
      </>
    ),
  },
];

const STATS = [
  { icon: 'fa-users', value: '15 000+', label: 'Utilisateurs actifs' },
  { icon: 'fa-star', value: '4,9 / 5', label: 'Note moyenne' },
  { icon: 'fa-shield-halved', value: '100 %', label: 'Sécurisé et confidentiel' },
  { icon: 'fa-face-smile', value: '1 800+', label: 'Avis positifs' },
];

const PAGE_SIZE = 3;

export default function Testimonials() {
  const totalPages = Math.ceil(TESTIMONIALS.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const isMobile = useIsMobile();

  const visible = isMobile
    ? TESTIMONIALS
    : TESTIMONIALS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (delta: number) =>
    setPage((p) => (p + delta + totalPages) % totalPages);

  return (
    <section
      className={styles.section}
      id="avis"
      aria-labelledby="testimonials-title"
    >
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>
            <i className="fa-solid fa-heart" aria-hidden="true" />
            Ils nous font confiance
          </span>
          <h2 id="testimonials-title" className={styles.title}>
            Ce que disent <span className={styles.titleAccent}>nos utilisateurs</span>
          </h2>
          <p className={styles.lead}>
            Des milliers de personnes ont déjà rejoint tillit pour prêter, emprunter
            et gérer leur argent en toute confiance.
          </p>
        </header>

        <div className={styles.carousel}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(-1)}
            aria-label="Avis précédents"
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <div
            className={`${styles.cards} ${isMobile ? styles.cardsSwipe : ''}`}
            key={isMobile ? 'swipe' : page}
          >
            {visible.map((t, i) => {
              const isHighlighted = !isMobile && i === 1; // middle card highlighted on desktop
              return (
                <article
                  key={t.name}
                  className={`${styles.card} ${
                    isHighlighted ? styles.cardHighlight : ''
                  }`}
                  data-reveal
                  style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
                >
                  {t.verified && (
                    <span className={styles.verified}>
                      <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                      Utilisateur vérifié
                    </span>
                  )}
                  <i
                    className={`fa-solid fa-quote-left ${styles.quoteMark}`}
                    aria-hidden="true"
                  />
                  <p className={styles.quote}>{t.quote}</p>
                  <div className={styles.author}>
                    <span
                      className={styles.avatar}
                      style={{ background: t.color }}
                      aria-hidden="true"
                    >
                      {t.initial}
                    </span>
                    <div className={styles.authorInfo}>
                      <p className={styles.authorName}>{t.name}</p>
                      <p className={styles.authorLocation}>{t.location}</p>
                    </div>
                    <span className={styles.stars} aria-label="5 étoiles sur 5">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <i key={k} className="fa-solid fa-star" aria-hidden="true" />
                      ))}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(1)}
            aria-label="Avis suivants"
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>

        {!isMobile && (
          <div className={styles.dots} role="tablist" aria-label="Pages d'avis">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
                onClick={() => setPage(i)}
                aria-selected={i === page}
                aria-label={`Page ${i + 1}`}
                role="tab"
              />
            ))}
          </div>
        )}
        {isMobile && (
          <p className={styles.swipeHint}>
            <i className="fa-solid fa-arrows-left-right" aria-hidden="true" />
            Glisse pour voir plus d'avis
          </p>
        )}

        <div className={styles.statsBanner} data-reveal>
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statIcon} aria-hidden="true">
                  <i className={`fa-solid ${s.icon}`} />
                </span>
                <div className={styles.statText}>
                  <p className={styles.statValue}>{s.value}</p>
                  <p className={styles.statLabel}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
