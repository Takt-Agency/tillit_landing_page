import { useCallback, useRef, useState } from 'react';
import styles from './Roles.module.css';

type SlideBase = { type: 'photo' | 'why' };

type PhotoSlide = SlideBase & {
  type: 'photo';
  src: string;
  srcset: string;
  alt: string;
  caption: string;
};

type WhyItem = { icon: string; text: string };

type WhySlide = SlideBase & {
  type: 'why';
  keyword: string;
  title: string;
  items: WhyItem[];
  foot?: string;
};

type Slide = PhotoSlide | WhySlide;

type RoleKey = 'preter' | 'emprunter' | 'rembourser';

type Role = {
  key: RoleKey;
  label: string;
  accent: 'violet' | 'coral' | 'green';
  slides: Slide[];
  outro?: string;
};

const IMG_1200 = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`;
const IMG_SRCSET = (id: string) =>
  `https://images.unsplash.com/${id}?w=480&auto=format&fit=crop&q=80 480w, https://images.unsplash.com/${id}?w=760&auto=format&fit=crop&q=80 760w, https://images.unsplash.com/${id}?w=1100&auto=format&fit=crop&q=80 1100w, https://images.unsplash.com/${id}?w=1500&auto=format&fit=crop&q=80 1500w`;

const ROLES: Role[] = [
  {
    key: 'preter',
    label: 'Prêter',
    accent: 'violet',
    slides: [
      {
        type: 'photo',
        src: IMG_1200('photo-1739303987880-59aa505ecfa6'),
        srcset: IMG_SRCSET('photo-1739303987880-59aa505ecfa6'),
        alt: 'Deux sœurs assises sur un canapé',
        caption: 'Tu avances le permis à ta sœur · 1 200 €',
      },
      {
        type: 'why',
        keyword: 'Pourquoi tillit ici',
        title: "Tu n'as plus à relancer toi-même.",
        items: [
          {
            icon: 'fa-bell-slash',
            text: "tillit envoie le rappel avant l'échéance. Tu n'as plus à relancer.",
          },
          {
            icon: 'fa-calendar-check',
            text: 'Ce qui est convenu est écrit avant le virement, pas après.',
          },
        ],
      },
      {
        type: 'photo',
        src: IMG_1200('photo-1764173039259-3cdf3d9a56e2'),
        srcset: IMG_SRCSET('photo-1764173039259-3cdf3d9a56e2'),
        alt: 'Deux amis à une table de café',
        caption: 'Tu dépannes un ami en fin de mois · 200 €',
      },
      {
        type: 'why',
        keyword: 'Pourquoi tillit ici',
        title: 'Une trace commune, et un recours si besoin.',
        items: [
          {
            icon: 'fa-arrows-rotate',
            text: 'Le même historique des deux côtés : plus de malentendu possible.',
          },
          {
            icon: 'fa-file-signature',
            text: 'Avec Zen, une reconnaissance de dette signée. Au cas où.',
          },
        ],
        foot: "Tu espères ne jamais en avoir besoin.",
      },
      {
        type: 'photo',
        src: IMG_1200('photo-1758274533800-6a5fe97f53f6'),
        srcset: IMG_SRCSET('photo-1758274533800-6a5fe97f53f6'),
        alt: 'Quatre amis dans un parc',
        caption: "Tu avances le billet d'avion du groupe · 600 €",
      },
    ],
  },
  {
    key: 'emprunter',
    label: 'Emprunter',
    accent: 'coral',
    slides: [
      {
        type: 'photo',
        src: IMG_1200('photo-1758274252264-004520474c0c'),
        srcset: IMG_SRCSET('photo-1758274252264-004520474c0c'),
        alt: 'Jeune femme consultant son téléphone en terrasse',
        caption: 'Un imprévu. Il te manque 300 €.',
      },
      {
        type: 'why',
        keyword: 'Pourquoi tillit ici',
        title: 'Demander devient beaucoup plus simple.',
        items: [
          {
            icon: 'fa-comment-dots',
            text: "Tu annonces d'emblée comment tu comptes rembourser.",
          },
          {
            icon: 'fa-bell',
            text: "Tu n'as plus à retenir seul les dates : le rappel arrive avant.",
          },
        ],
        foot: "Un plan vaut mieux qu'une promesse.",
      },
      {
        type: 'photo',
        src: IMG_1200('photo-1772724317856-156cf12b366f'),
        srcset: IMG_SRCSET('photo-1772724317856-156cf12b366f'),
        alt: 'Colocataires dans leur cuisine',
        caption: 'Le déménagement coûte plus que prévu.',
      },
      {
        type: 'why',
        keyword: 'Pourquoi tillit ici',
        title: "Et si ça coince, tu le dis dans l'application.",
        items: [
          {
            icon: 'fa-comment-dots',
            text: 'Signaler une difficulté ne demande plus de conversation gênante.',
          },
          {
            icon: 'fa-calendar-plus',
            text: "Tu réaménages une échéance sans avoir à trouver les mots : tillit les trouve.",
          },
        ],
        foot: "Un ajustement demandé à temps n'est pas un retard.",
      },
      {
        type: 'photo',
        src: IMG_1200('photo-1761839257349-037aea1d94de'),
        srcset: IMG_SRCSET('photo-1761839257349-037aea1d94de'),
        alt: 'Trois amis discutant dehors',
        caption: "Le billet d'avion pour le mariage · 600 €",
      },
    ],
  },
  {
    key: 'rembourser',
    label: 'Rembourser',
    accent: 'green',
    slides: [
      {
        type: 'photo',
        src: IMG_1200('photo-1758272420171-6e7de7b36789'),
        srcset: IMG_SRCSET('photo-1758272420171-6e7de7b36789'),
        alt: 'Femme souriante marchant en consultant son téléphone',
        caption: "Dernière échéance envoyée. C'est fini.",
      },
      {
        type: 'why',
        keyword: 'Pourquoi tillit ici',
        title: 'Tu vois la fin arriver.',
        items: [
          {
            icon: 'fa-chart-line',
            text: "Tu vois le chemin parcouru, pas seulement ce qu'il reste à rendre.",
          },
          {
            icon: 'fa-bolt',
            text: 'Tu peux solder en avance si ta situation le permet.',
          },
        ],
        foot: "0 % d'intérêt, quel que soit le rythme.",
      },
      {
        type: 'photo',
        src: IMG_1200('photo-1779089746428-bb3d3148d5c4'),
        srcset: IMG_SRCSET('photo-1779089746428-bb3d3148d5c4'),
        alt: 'Quatre amis en voiture pendant un voyage',
        caption: 'Le prêt est terminé. Le voyage continue.',
      },
      {
        type: 'why',
        keyword: 'Pourquoi tillit ici',
        title: 'Une clôture nette, sans avoir à la réclamer.',
        items: [
          {
            icon: 'fa-circle-check',
            text: 'Le prêt se termine officiellement, des deux côtés en même temps.',
          },
          {
            icon: 'fa-heart',
            text: 'Tu montres, sans rien dire, que tu tiens à la relation.',
          },
        ],
        foot: "Le prêt se termine, l'amitié non.",
      },
      {
        type: 'photo',
        src: IMG_1200('photo-1770563182237-915707b86c9e'),
        srcset: IMG_SRCSET('photo-1770563182237-915707b86c9e'),
        alt: "Groupe d'amis marchant ensemble",
        caption: 'La relation, intacte.',
      },
    ],
    outro:
      "Un rappel automatique est plus simple à recevoir qu'un message gêné de quelqu'un que tu aimes.",
  },
];

function Slide({ slide, role }: { slide: Slide; role: Role }) {
  if (slide.type === 'photo') {
    return (
      <article className={`${styles.slide} ${styles.slidePhoto}`}>
        <img
          src={slide.src}
          srcSet={slide.srcset}
          sizes="(max-width:700px) 92vw, (max-width:1100px) 48vw, 560px"
          alt={slide.alt}
          loading="lazy"
          decoding="async"
        />
        <p className={styles.slidePhotoCap}>{slide.caption}</p>
      </article>
    );
  }
  return (
    <article
      className={`${styles.slide} ${styles.slideWhy} ${
        styles[`slideWhy_${role.accent}`]
      }`}
    >
      <span className={styles.slideAccent} aria-hidden="true" />
      <span className={styles.slideKeyword}>{slide.keyword}</span>
      <h4 className={styles.slideTitle}>{slide.title}</h4>
      <ul className={styles.slideList}>
        {slide.items.map((item, j) => (
          <li key={j}>
            <span className={styles.slideIcon} aria-hidden="true">
              <i className={`fa-solid ${item.icon}`} />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      {slide.foot && <p className={styles.slideFoot}>{slide.foot}</p>}
    </article>
  );
}

function Carousel({ role }: { role: Role }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollByDir = useCallback((dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(`.${styles.slide}`);
    const gap = 16;
    const step = (first?.offsetWidth ?? 340) + gap;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.carousel}>
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navBtnPrev}`}
        onClick={() => scrollByDir(-1)}
        aria-label="Slide précédente"
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.track}>
          {role.slides.map((slide, i) => (
            <Slide key={i} slide={slide} role={role} />
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.navBtn} ${styles.navBtnNext}`}
        onClick={() => scrollByDir(1)}
        aria-label="Slide suivante"
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>

      <div className={styles.nav}>
        <span className={styles.navHint}>
          <i className="fa-solid fa-circle-info" aria-hidden="true" />
          <span>
            <strong>tillit</strong> ne garantit pas le remboursement.
          </span>
        </span>
      </div>
    </div>
  );
}

export default function Roles() {
  const [active, setActive] = useState<RoleKey>('preter');
  const activeRole = ROLES.find((r) => r.key === active) ?? ROLES[0];
  const activeIndex = ROLES.findIndex((r) => r.key === active);

  return (
    <section className={styles.section} id="roles" aria-labelledby="roles-title">
      <div className={styles.decorBlob} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="roles-title" className={styles.title}>
            Un même prêt, <span className={styles.titleAccent}>trois points de vue.</span>
          </h2>
          <p className={styles.lead}>
            Que tu prêtes, empruntes ou rembourses — tillit est de ton côté.
          </p>
        </header>

        <div className={styles.tabsWrap}>
          <div className={styles.tabs} role="tablist" aria-label="Rôle">
            <span
              className={styles.pill}
              aria-hidden="true"
              style={{
                transform: `translateX(calc(${activeIndex} * (100% + 4px)))`,
              }}
            />
            {ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                className={`${styles.tab} ${active === role.key ? styles.tabActive : ''}`}
                onClick={() => setActive(role.key)}
                role="tab"
                aria-selected={active === role.key}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel} role="tabpanel">
          <Carousel key={activeRole.key} role={activeRole} />
        </div>
      </div>
    </section>
  );
}
