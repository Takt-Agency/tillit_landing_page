import styles from './Hero.module.css';
import PhoneMockup from './PhoneMockup';

const AVATARS = ['A', 'M', 'S', 'K', 'L'];

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.orbits} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            Simple entre nous
            <span className={styles.eyebrowShine} aria-hidden="true" />
          </span>

          <h1 className={styles.title}>
            Prêter{' '}
            <span className={styles.titleAccent}>sereinement.</span>
          </h1>

          <p className={styles.subtitle}>
            Entre proches, un prêt devrait rester un geste simple. Pas une raison
            de s'éviter.
          </p>
          <p className={styles.subtitleStrong}>
            On ne remplace pas la confiance.{' '}
            <strong>On lui donne un cadre.</strong>
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
          <PhoneMockup />
          <div className={styles.notifCard} aria-hidden="true">
            <span className={styles.notifIcon}>
              <i className="fa-solid fa-bell" />
            </span>
            <div className={styles.notifText}>
              <p className={styles.notifLabel}>Rappel envoyé</p>
              <p className={styles.notifDesc}>
                Plus besoin de relancer vous-même.
              </p>
            </div>
          </div>
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
