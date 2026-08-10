import styles from './Benefits.module.css';

const LENDER_ITEMS = [
  'Vous savez exactement combien il reste.',
  'Vous voyez les prochaines échéances.',
  "Vous n'avez plus besoin de relancer.",
  "Vous conservez l'historique.",
];

const BORROWER_ITEMS = [
  'Vous savez exactement ce que vous devez.',
  'Vous voyez toutes vos échéances.',
  "Vous recevez un rappel avant d'oublier.",
  {
    text: 'Vous pouvez réaménager vos échéances sans avoir à être gêné, directement depuis l\'app.',
    accent: 'TilliT trouvera les mots.',
  },
  'Vous montrez, sans rien dire, que vous tenez à la relation.',
];

const FEATURES = [
  {
    title: 'Les rappels sont automatiques',
    desc: 'Plus besoin d\'écrire : « Tu as pensé au virement ? »',
  },
  {
    title: 'Vous savez où vous en êtes',
    desc: 'Le montant restant est mis à jour après chaque remboursement.',
  },
  {
    title: 'Une date de fin claire',
    desc: 'Dès le départ, chacun sait quand le prêt sera terminé.',
  },
];

function Check() {
  return (
    <span className={styles.check} aria-hidden="true">
      <i className="fa-solid fa-check" />
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
            <span className={styles.leadAccent}>TilliT</span> fonctionne pour vous
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
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article
            className={styles.side}
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
                  <Check />
                  <span>
                    {typeof item === 'string' ? (
                      item
                    ) : (
                      <>
                        {item.text}{' '}
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
