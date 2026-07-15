import styles from './Hero.module.css';
import PhoneMockup from './PhoneMockup';

const FEATURES = [
  {
    title: '0 %',
    label: "0 % d'intérêt entre proches",
    icon: <i className="fa-solid fa-percent" aria-hidden="true" />,
  },
  {
    title: 'Aucune commission',
    label: 'Aucune commission sur la dette',
    icon: <i className="fa-solid fa-shield-halved" aria-hidden="true" />,
  },
  {
    title: 'Vos données',
    label: 'Vos données sont sécurisées',
    icon: <i className="fa-solid fa-lock" aria-hidden="true" />,
  },
];

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
            <span className={styles.eyebrowDot} aria-hidden="true">
              <i className="fa-solid fa-heart" />
            </span>
            La finance qui préserve les liens
            <span className={styles.eyebrowShine} aria-hidden="true" />
          </span>

          <h1 className={styles.title}>
            L'argent entre proches,
            <br />
            <span className={styles.titleAccent}>sans le malaise.</span>
          </h1>

          <p className={styles.subtitle}>
            Le problème n'est pas l'argent. C'est le flou, le silence, la gêne et le
            ghosting. TilliT transforme une promesse verbale en engagement structuré —
            et préserve la relation.
          </p>

          <div className={styles.ctas}>
            <a className={styles.ctaPrimary} href="#cta">
              <i className="fa-solid fa-download" aria-hidden="true" />
              Télécharger l'app
            </a>
            <a className={styles.ctaSecondary} href="#comment-ca-marche">
              Comment ça marche
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </div>

          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f.label} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>
                  <strong>{f.title}</strong>
                  <em>{f.label.replace(f.title, '').trim() || f.label}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual}>
          <PhoneMockup />
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
