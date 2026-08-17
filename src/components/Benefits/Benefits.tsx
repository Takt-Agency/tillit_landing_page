import styles from './Benefits.module.css';

type LenderItem = { icon: string; text: string };
type BorrowerItem =
  | { icon: string; text: string }
  | { icon: string; text: string; accent: string };

const LENDER_ITEMS: LenderItem[] = [
  { icon: 'fa-calculator', text: 'Vous savez exactement combien il reste.' },
  { icon: 'fa-calendar-days', text: 'Vous voyez les prochaines échéances.' },
  { icon: 'fa-bell-slash', text: "Vous n'avez plus besoin de relancer." },
  { icon: 'fa-clock-rotate-left', text: "Vous conservez l'historique." },
];

const BORROWER_ITEMS: BorrowerItem[] = [
  {
    icon: 'fa-file-invoice-dollar',
    text: 'Vous savez exactement ce que vous devez.',
  },
  { icon: 'fa-list-check', text: 'Vous voyez toutes vos échéances.' },
  { icon: 'fa-bell', text: "Vous recevez un rappel avant d'oublier." },
  {
    icon: 'fa-arrows-rotate',
    text: "Vous pouvez réaménager vos échéances sans avoir à être gêné, directement depuis l'app.",
    accent: 'tillit trouvera les mots.',
  },
  {
    icon: 'fa-heart',
    text: 'Vous montrez, sans rien dire, que vous tenez à la relation.',
  },
];

const FEATURES = [
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'Les rappels sont automatiques',
    desc: "Plus besoin d'écrire : « Tu as pensé au virement ? »",
  },
  {
    icon: 'fa-chart-line',
    title: 'Vous savez où vous en êtes',
    desc: 'Le montant restant est mis à jour après chaque remboursement.',
  },
  {
    icon: 'fa-flag-checkered',
    title: 'Une date de fin claire',
    desc: 'Dès le départ, chacun sait quand le prêt sera terminé.',
  },
];

function ItemIcon({ icon }: { icon: string }) {
  return (
    <span className={styles.itemIcon} aria-hidden="true">
      <i className={`fa-solid ${icon}`} />
    </span>
  );
}

export default function Benefits() {
  return (
    <section
      className={styles.section}
      id="benefits"
      aria-labelledby="benefits-title"
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="benefits-title" className={styles.title}>
            <span className={styles.titleLine}>Utile pour celui qui prête.</span>
            <span className={styles.titleLine}>
              Rassurant pour{' '}
              <span className={styles.titleAccent}>celui qui rembourse.</span>
            </span>
          </h2>
          <p className={styles.lead}>
            Que vous prêtiez ou que vous remboursiez,{' '}
            <span className={styles.leadAccent}>tillit</span> fonctionne pour vous
            deux.
          </p>
        </header>

        <div className={styles.sides}>
          <article
            className={styles.side}
            data-reveal="left"
            style={{ ['--reveal-delay' as string]: '100ms' }}
          >
            <div className={styles.sideHead}>
              <span className={styles.sideIcon}>
                <i className="fa-solid fa-hand-holding-dollar" aria-hidden="true" />
              </span>
              <h3 className={styles.sideTitle}>Côté prêteur</h3>
            </div>
            <ul className={styles.list}>
              {LENDER_ITEMS.map((item) => (
                <li key={item.text}>
                  <ItemIcon icon={item.icon} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </article>

          <article
            className={`${styles.side} ${styles.sideZen}`}
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '200ms' }}
          >
            <div className={styles.sideHead}>
              <span className={styles.sideIcon}>
                <i className="fa-solid fa-user-check" aria-hidden="true" />
              </span>
              <h3 className={styles.sideTitle}>Côté emprunteur</h3>
            </div>
            <ul className={styles.list}>
              {BORROWER_ITEMS.map((item, i) => (
                <li key={i}>
                  <ItemIcon icon={item.icon} />
                  <span>
                    {item.text}
                    {'accent' in item && (
                      <>
                        {' '}
                        <span className={styles.itemAccent}>{item.accent}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <blockquote className={styles.quote} data-reveal>
          <i
            className={`fa-solid fa-quote-left ${styles.quoteMark}`}
            aria-hidden="true"
          />
          <p>
            Un rappel automatique est plus simple à recevoir qu'un message gêné de
            quelqu'un que vous aimez.
          </p>
          <i
            className={`fa-solid fa-quote-right ${styles.quoteMark} ${styles.quoteMarkRight}`}
            aria-hidden="true"
          />
        </blockquote>

        <div className={styles.features}>
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className={styles.feature}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}
            >
              <span className={styles.featureIcon} aria-hidden="true">
                <i className={`fa-solid ${f.icon}`} />
              </span>
              <h4 className={styles.featureTitle}>{f.title}</h4>
              <p className={styles.featureDesc}>{f.desc}</p>
            </article>
          ))}
        </div>

        <div className={styles.outro} data-reveal>
          <a href="#comment-ca-marche" className={styles.outroCta}>
            Tous les cas d'usage
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
