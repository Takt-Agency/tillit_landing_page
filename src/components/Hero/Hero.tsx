import styles from './Hero.module.css';
import coupleUrl from '../../../src/couple-hero.png';

const AVATARS = ['A', 'M', 'S', 'K', 'L'];

type Loan = {
  name: string;
  date: string;
  amount: string;
  status: string;
  tone: 'success' | 'warning' | 'progress';
  initial: string;
  color: string;
};

const LOANS: Loan[] = [
  {
    name: 'Thomas',
    date: 'Prêt le 12 mars 2024',
    amount: '150,00 €',
    status: 'Remboursé',
    tone: 'success',
    initial: 'T',
    color: '#4ec18a',
  },
  {
    name: 'Sarah',
    date: 'Remboursement avant le 30 juin',
    amount: '80,00 €',
    status: 'En attente',
    tone: 'warning',
    initial: 'S',
    color: '#ef8068',
  },
  {
    name: 'Pape',
    date: 'Prêt le 10 avril 2024',
    amount: '120,00 €',
    status: 'Remboursement à venir',
    tone: 'progress',
    initial: 'P',
    color: '#a785f0',
  },
];

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Prêter{' '}
            <span className={styles.titleAccent}>sereinement.</span>
          </h1>

          <p className={styles.subtitle}>
            Entre proches, un prêt devrait rester un geste simple. Pas une raison
            de s'éviter, ni de compter deux fois. <strong>tillit</strong> pose un
            cadre clair entre vous : montant, échéances, rappels bienveillants —
            sans que personne n'ait à relancer.
          </p>

          <p className={styles.subtitleLight}>
            Vous gardez la confiance,{' '}
            <span className={styles.subtitleAccent}>
              on s'occupe des détails
            </span>
            .
          </p>

          <div className={styles.ctas}>
            <a className={styles.ctaPrimary} href="#cta">
              Commencer gratuitement
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
            <a className={styles.ctaSecondary} href="#comment-ca-marche">
              Découvrir comment ça marche
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.visual}>
          <img
            src={coupleUrl}
            alt="Deux proches consultant l'application tillit avec la mascotte"
            className={styles.couple}
            loading="eager"
            decoding="async"
          />

          <div className={styles.loanCard} aria-hidden="true">
            <div className={styles.balance}>
              <div>
                <p className={styles.balanceLabel}>Solde à me rembourser</p>
                <p className={styles.balanceAmount}>250,00 €</p>
              </div>
              <span className={styles.balanceIcon}>
                <i className="fa-solid fa-user-group" />
              </span>
            </div>

            <div className={styles.loansHeader}>
              <p className={styles.loansTitle}>Mes prêts</p>
              <span className={styles.loansAll}>Voir tout</span>
            </div>

            <ul className={styles.loanList}>
              {LOANS.map((l) => (
                <li key={l.name} className={styles.loan}>
                  <span
                    className={styles.loanAvatar}
                    style={{ background: l.color }}
                  >
                    {l.initial}
                  </span>
                  <div className={styles.loanInfo}>
                    <p className={styles.loanName}>{l.name}</p>
                    <p className={styles.loanDate}>{l.date}</p>
                  </div>
                  <div className={styles.loanRight}>
                    <p
                      className={`${styles.loanAmount} ${
                        styles[`amount_${l.tone}`]
                      }`}
                    >
                      {l.amount}
                    </p>
                    <span
                      className={`${styles.loanStatus} ${
                        styles[`status_${l.tone}`]
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <span className={`${styles.sparkle} ${styles.sparkle1}`} aria-hidden="true">
            <i className="fa-solid fa-sparkles" />
          </span>
          <span className={`${styles.sparkle} ${styles.sparkle2}`} aria-hidden="true">
            <i className="fa-solid fa-sparkles" />
          </span>
        </div>
      </div>

      <svg
        className={styles.wave}
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 C 240 90 480 90 720 60 S 1200 30 1440 60 L1440 90 L0 90 Z"
          fill="var(--color-cream)"
        />
      </svg>
    </section>
  );
}

export function HeroSocialProof() {
  return (
    <div className={styles.socialProof}>
      <div className={styles.socialProofInner}>
        <p className={styles.proofLabel}>Déjà adopté par des milliers de personnes</p>
        <div className={styles.proofRight}>
          <div className={styles.avatars} aria-hidden="true">
            {AVATARS.map((letter, i) => (
              <span key={i} className={styles.avatar} data-i={i}>
                {letter}
              </span>
            ))}
          </div>
          <div className={styles.rating}>
            <span className={styles.stars} aria-hidden="true">
              ★★★★★
            </span>
            <span className={styles.ratingText}>4,9/5 sur plus de 1 800 avis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
