import { Link } from 'react-router-dom';
import styles from './Pricing.module.css';
import { useLang, useLocalize } from '../../i18n';

type Feature = { icon: string; label: string };

const COPY = {
  fr: {
    eyebrow: 'Les formules',
    title: 'Deux formules pour organiser ton prêt.',
    lead: 'Zen ajoutera une reconnaissance de dette signée.',
    free: 'Gratuit',
    notePrice: '0 €',
    noteMeta: (
      <>
        Sans frais, de <strong>100 à 1 500 €</strong> par prêt
      </>
    ),
    noteFeatures: [
      { icon: 'fa-list-ul', label: 'Création de prêt guidée en 2 minutes' },
      { icon: 'fa-calendar-days', label: 'Échéancier partagé clair' },
      { icon: 'fa-bell', label: 'Rappels bienveillants automatiques' },
      { icon: 'fa-clock-rotate-left', label: 'Historique partagé du prêt' },
    ] as Feature[],
    notify: 'Être prévenu du lancement',
    zenBadge: 'Avec document signé',
    zenPrice: 'Dès 2,99 €',
    zenMeta: (
      <>
        De <strong>100 à 5 000 €</strong> par prêt
      </>
    ),
    zenAbove: 'Au-delà de 1 500 €, c’est Zen.',
    oneOff: 'Paiement unique · aucun abonnement',
    whoPays: '« Qui paie ? »',
    together: 'Vous choisissez ensemble.',
    whoPaysTip: 'Le prêteur ou l’emprunteur : vous décidez ensemble qui règle Zen.',
    calc: 'Calculer le prix pour mon prêt',
    zenIntro: 'Pour ceux qui souhaitent formaliser davantage leur prêt.',
    zenFeatures: [
      { icon: 'fa-infinity', label: 'Tout ce que fait Note' },
      {
        icon: 'fa-file-signature',
        label: 'Reconnaissance de dette signée électroniquement, avec Goodflag',
      },
      { icon: 'fa-user-shield', label: 'Ton identité vérifiée avant la signature' },
      { icon: 'fa-box-archive', label: 'Conservation du dossier de preuve' },
    ] as Feature[],
    signDetail: 'Le détail de la signature et de la conservation',
    allPrices: 'Voir tous les tarifs',
    tagline: (
      <>
        Vous gardez la confiance, <strong>on s’occupe des détails.</strong>
      </>
    ),
    disclaimer: (
      <>
        TilliT aide à réduire les oublis et les malentendus.{' '}
        <strong>Il ne garantit pas le remboursement.</strong>
      </>
    ),
    extras: [
      {
        to: '/confiance#carnet',
        icon: 'fa-address-book',
        title: 'Découvrir le Carnet de prêt',
        sub: 'Garde une trace claire de l’historique de tes prêts.',
      },
      {
        to: '/recours',
        icon: 'fa-scale-balanced',
        title: 'Guide pas à pas en cas de recours',
        sub: 'Les étapes à suivre si le remboursement ne se fait pas malgré les relances.',
      },
    ],
  },
  en: {
    eyebrow: 'The plans',
    title: 'Two plans to organise your loan.',
    lead: 'Zen will add a signed acknowledgement of debt.',
    free: 'Free',
    notePrice: '€0',
    noteMeta: (
      <>
        Free, from <strong>€100 to €1,500</strong> per loan
      </>
    ),
    noteFeatures: [
      { icon: 'fa-list-ul', label: 'Guided loan setup in 2 minutes' },
      { icon: 'fa-calendar-days', label: 'A clear shared schedule' },
      { icon: 'fa-bell', label: 'Automatic, kind reminders' },
      { icon: 'fa-clock-rotate-left', label: 'Shared loan history' },
    ] as Feature[],
    notify: 'Get notified at launch',
    zenBadge: 'With a signed document',
    zenPrice: 'From €2.99',
    zenMeta: (
      <>
        From <strong>€100 to €5,000</strong> per loan
      </>
    ),
    zenAbove: 'Above €1,500, it’s Zen.',
    oneOff: 'One payment · no subscription',
    whoPays: '“Who pays?”',
    together: 'You two choose together.',
    whoPaysTip: 'TilliT Zen can be paid by the lender or by the borrower. The two of you decide.',
    calc: 'Work out the price for my loan',
    zenIntro: 'For those who want to put their loan on firmer ground.',
    zenFeatures: [
      { icon: 'fa-infinity', label: 'Everything Note does' },
      {
        icon: 'fa-file-signature',
        label: 'Acknowledgement of debt signed electronically, with Goodflag',
      },
      { icon: 'fa-user-shield', label: 'Your identity checked before signing' },
      { icon: 'fa-box-archive', label: 'The evidence file kept safe' },
    ] as Feature[],
    signDetail: 'The detail of signing and storage',
    allPrices: 'See all prices',
    tagline: (
      <>
        You keep the trust, <strong>we take care of the details.</strong>
      </>
    ),
    disclaimer: (
      <>
        TilliT helps cut down forgotten dates and misunderstandings.{' '}
        <strong>It does not guarantee repayment.</strong>
      </>
    ),
    extras: [
      {
        to: '/confiance#carnet',
        icon: 'fa-address-book',
        title: 'Discover the Carnet de prêt, your loan record book',
        sub: 'It keeps a clear history of your loans.',
      },
      {
        to: '/recours',
        icon: 'fa-scale-balanced',
        title: 'Step-by-step guide if you have to take it further',
        sub: 'What to do when repayment doesn’t come, despite the reminders.',
      },
    ],
  },
};

export default function Pricing() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];

  return (
    <section className={styles.section} id="offres" aria-labelledby="pricing-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h2 id="pricing-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.lead}>{t.lead}</p>
        </header>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.cardNote}`} data-reveal="left">
            <span className={styles.badge}>{t.free}</span>
            <div className={styles.cardTop}>
              <div className={styles.cardTopRow}>
                <h3 className={styles.cardTitle}>TilliT Note</h3>
                <p className={styles.price}>{t.notePrice}</p>
              </div>
              <p className={styles.meta}>{t.noteMeta}</p>
            </div>

            <div className={styles.cardBody}>
              <ul className={styles.features}>
                {t.noteFeatures.map((f) => (
                  <li key={f.label}>
                    <span className={styles.featureIcon} aria-hidden="true">
                      <i className={`fa-solid ${f.icon}`} />
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              <a href="#waitlist" className={`${styles.btn} ${styles.btnSoft}`}>
                {t.notify}
              </a>
            </div>
          </article>

          <article
            className={`${styles.card} ${styles.cardZen}`}
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            <span className={`${styles.badge} ${styles.badgeZen}`}>{t.zenBadge}</span>
            <div className={styles.cardTop}>
              <div className={styles.cardTopRow}>
                <h3 className={styles.cardTitle}>TilliT Zen</h3>
                <p className={styles.price}>{t.zenPrice}</p>
              </div>
              <p className={styles.meta}>{t.zenMeta}</p>
              <p className={styles.metaSoft}>{t.zenAbove}</p>
              <p className={styles.metaStrong}>{t.oneOff}</p>
              <p className={styles.meta}>
                <strong>{t.whoPays}</strong> {t.together}{' '}
                <span
                  className={styles.infoDot}
                  role="img"
                  aria-label={t.whoPaysTip}
                  title={t.whoPaysTip}
                >
                  i
                </span>
              </p>
              <Link to={l('/#comparateur')} className={styles.inlineLink}>
                {t.calc}
              </Link>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.intro}>{t.zenIntro}</p>
              <ul className={styles.features}>
                {t.zenFeatures.map((f) => (
                  <li key={f.label}>
                    <span className={styles.featureIcon} aria-hidden="true">
                      <i className={`fa-solid ${f.icon}`} />
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
              <Link to={l('/tarifs#signature')} className={styles.inlineLink}>
                {t.signDetail}
              </Link>

              <Link to={l('/tarifs')} className={`${styles.btn} ${styles.btnWhite}`}>
                {t.allPrices}
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>

        <p className={styles.tagline} data-reveal>
          {t.tagline}
        </p>

        <p className={styles.disclaimer} data-reveal>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          <span>{t.disclaimer}</span>
        </p>

        <div className={styles.extras} data-reveal>
          {t.extras.map((e) => (
            <Link key={e.title} to={l(e.to)} className={styles.extra}>
              <span className={styles.extraIcon} aria-hidden="true">
                <i className={`fa-solid ${e.icon}`} />
              </span>
              <span className={styles.extraText}>
                <span className={styles.extraTitle}>{e.title}</span>
                <span className={styles.extraSub}>{e.sub}</span>
              </span>
              <i
                className={`fa-solid fa-arrow-right ${styles.extraArrow}`}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
