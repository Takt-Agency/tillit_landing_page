import { motion } from 'motion/react';
import styles from './Partners.module.css';
import goodflagLogo from '../../logo-goodflag.svg';
import nexiaLogo from '../../nexia digital.png';
import numixsLogo from '../../station-numixs-logo-DN9Ujo5B.png';
import franceIdentityLogo from '../../logo-france-identity.png';
import mieuxLogo from '../../mieuxentreprendre.svg';

type Partner = {
  name: string;
  logo?: string;
};

const PARTNERS: Partner[] = [
  { name: 'France Identité', logo: franceIdentityLogo },
  { name: 'Goodflag', logo: goodflagLogo },
  { name: 'Station Numixs', logo: numixsLogo },
  { name: 'Mieux Entreprendre', logo: mieuxLogo },
  { name: 'Nexia Digital', logo: nexiaLogo },
];

// Duplicate the list so the marquee loop is seamless (translate -50% shows the copy)
const MARQUEE_ITEMS = [...PARTNERS, ...PARTNERS];

export default function Partners() {
  return (
    <section
      className={styles.section}
      id="partenaires"
      aria-labelledby="partners-title"
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>Nos partenaires</span>
          <h2 id="partners-title" className={styles.title}>
            Nos <span className={styles.titleAccent}>partenaires</span> de confiance
          </h2>
        </header>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />

        <motion.ul
          className={styles.track}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 28,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {MARQUEE_ITEMS.map((p, i) => (
            <li key={`${p.name}-${i}`} className={styles.item}>
              {p.logo ? (
                <img src={p.logo} alt={p.name} className={styles.logo} />
              ) : (
                <span className={styles.placeholder}>{p.name}</span>
              )}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Accessible list (visually hidden) */}
      <ul className={styles.srList}>
        {PARTNERS.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </section>
  );
}
