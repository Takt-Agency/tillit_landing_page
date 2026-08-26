import { useCallback, useRef } from 'react';
import styles from './Situations.module.css';

type Badge =
  | { kind: 'amount'; label: string; value: string; progress?: number }
  | { kind: 'chip'; label: string; chipLabel: string; chipTone: 'green' | 'violet' | 'coral' }
  | { kind: 'notif'; title: string; sub: string };

type Situation = {
  kicker: string;
  title: string;
  desc: string;
  img: string;
  imgAlt: string;
  badge: Badge;
  accent: 'violet' | 'coral' | 'green' | 'blue';
};

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`;

const SITUATIONS: Situation[] = [
  {
    kicker: 'Après les vacances',
    title: '240 € étalés sur six mois',
    desc:
      'Il reste 240 € après le voyage. Tu choisis 40 € par mois. La date de fin est connue dès le premier jour.',
    img: IMG('photo-1566234800933-1d946a937fd9'),
    imgAlt: 'Deux amies rentrant de voyage avec leurs bagages',
    accent: 'violet',
    badge: {
      kind: 'amount',
      label: 'Reste à rembourser',
      value: '120,00 €',
      progress: 50,
    },
  },
  {
    kicker: 'Fin du mois',
    title: 'La même vue des deux côtés',
    desc:
      "Tu prêtes 200 € à ton colocataire. Ni l'un ni l'autre ne peut dire « je ne savais pas ».",
    img: IMG('photo-1758874960877-1a579d6c159e'),
    imgAlt: 'Une jeune femme consulte son téléphone à la table de sa cuisine',
    accent: 'coral',
    badge: {
      kind: 'chip',
      label: 'Prêteur & Emprunteur',
      chipLabel: 'Synchronisé',
      chipTone: 'violet',
    },
  },
  {
    kicker: 'Le permis',
    title: "Un imprévu, réglé dans l'application",
    desc:
      "1 200 € avancés à ta sœur. En juin, un coup dur. Elle t'en parle sur tillit, vous ajustez ensemble, et le remboursement continue.",
    img: IMG('photo-1612709060421-596380268eaf'),
    imgAlt: 'Jeune femme au volant de sa voiture',
    accent: 'blue',
    badge: {
      kind: 'chip',
      label: 'Nouvel échéancier',
      chipLabel: 'Accepté ✓',
      chipTone: 'green',
    },
  },
  {
    kicker: 'tillit Zen',
    title: '600 € et un document officiel',
    desc:
      "Les nouvelles se font rares, tu n'oses plus relancer. Avec Zen, la reconnaissance de dette est signée et conservée.",
    img: IMG('photo-1600880292203-757bb62b4baf'),
    imgAlt: 'Deux personnes se serrant la main après un accord',
    accent: 'violet',
    badge: {
      kind: 'chip',
      label: 'Reconnaissance de dette',
      chipLabel: 'Signée ✓',
      chipTone: 'green',
    },
  },
  {
    kicker: 'Le 5 du mois',
    title: 'Le rappel part tout seul',
    desc:
      "Personne n'a eu à écrire « tu as pensé au virement ? ». Le rappel est parti tout seul, la veille.",
    img: IMG('photo-1758522489023-d95ecf789fe0'),
    imgAlt: 'Homme consultant son téléphone dans sa cuisine',
    accent: 'coral',
    badge: {
      kind: 'notif',
      title: 'Échéance vendredi',
      sub: '60 € · rappel envoyé',
    },
  },
  {
    kicker: 'Le dernier euro',
    title: 'Clôturé, sans un mot de trop',
    desc:
      "500 € prêtés, 500 € remboursés, 0 % d'intérêt. L'historique reste, et la gêne n'a jamais eu lieu d'être.",
    img: IMG('photo-1768508664523-b705fbc07dcf'),
    imgAlt: "Proches qui s'embrassent et célèbrent",
    accent: 'green',
    badge: {
      kind: 'amount',
      label: 'Prêt terminé',
      value: '500 € / 500 €',
      progress: 100,
    },
  },
];

function BadgeRender({ badge }: { badge: Badge }) {
  if (badge.kind === 'amount') {
    return (
      <div className={styles.badgeAmount}>
        <p className={styles.badgeLabel}>{badge.label}</p>
        <p className={styles.badgeValue}>{badge.value}</p>
        {badge.progress !== undefined && (
          <div className={styles.progress}>
            <span style={{ width: `${badge.progress}%` }} />
          </div>
        )}
      </div>
    );
  }
  if (badge.kind === 'chip') {
    return (
      <div className={styles.badgeChip}>
        <p className={styles.badgeLabel}>{badge.label}</p>
        <span
          className={`${styles.chip} ${styles[`chip_${badge.chipTone}`]}`}
        >
          {badge.chipLabel}
        </span>
      </div>
    );
  }
  return (
    <div className={styles.badgeNotif}>
      <span className={styles.notifIcon} aria-hidden="true">
        <i className="fa-solid fa-bell" />
      </span>
      <div>
        <p className={styles.notifTitle}>{badge.title}</p>
        <p className={styles.notifSub}>{badge.sub}</p>
      </div>
    </div>
  );
}

export default function Situations() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollByDir = useCallback((dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(`.${styles.card}`);
    const gap = 20;
    const step = (first?.offsetWidth ?? 360) + gap;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  }, []);

  return (
    <section
      className={styles.section}
      id="situations"
      aria-labelledby="situations-title"
    >
      <div className={styles.decorTop} aria-hidden="true" />
      <div className={styles.decorBottom} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>Une fois le montant connu</span>
          <h2 id="situations-title" className={styles.title}>
            Le montant est décidé.{' '}
            <span className={styles.titleAccent}>Reste à choisir quand.</span>
          </h2>
          <p className={styles.lead}>
            En une fois ou en plusieurs fois, à votre rythme. tillit vous aide à
            poser ensemble les échéances et la date de fin.
          </p>
        </header>

        <div className={styles.carousel}>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnPrev}`}
            onClick={() => scrollByDir(-1)}
            aria-label="Situation précédente"
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <div className={styles.marquee} ref={viewportRef}>
            <div className={styles.track}>
              {SITUATIONS.map((s, i) => (
                <article
                  key={`${s.title}-${i}`}
                  className={`${styles.card} ${styles[`accent_${s.accent}`]}`}
                >
                  <div className={styles.imageWrap}>
                    <img
                      src={s.img}
                      alt={s.imgAlt}
                      loading="lazy"
                      decoding="async"
                      width={900}
                      height={600}
                    />
                    <div className={styles.badgeOverlay}>
                      <BadgeRender badge={s.badge} />
                    </div>
                  </div>
                  <div className={styles.body}>
                    <span className={styles.cardKicker}>{s.kicker}</span>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.cardDesc}>{s.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnNext}`}
            onClick={() => scrollByDir(1)}
            aria-label="Situation suivante"
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
