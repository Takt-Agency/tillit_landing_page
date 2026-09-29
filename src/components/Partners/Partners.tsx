import styles from './Partners.module.css';
import goodflagLogo from '../../logo-goodflag.svg';
import nexiaLogo from '../../nexia digital.png';
import numixsLogo from '../../station-numixs-logo-DN9Ujo5B.png';
import franceIdentityLogo from '../../logo-france-identity.png';
import mieuxLogo from '../../mieuxentreprendre.svg';

const PARTNERS = [
  { name: 'France Identité Numérique', logo: franceIdentityLogo, wide: false },
  { name: 'Goodflag', logo: goodflagLogo, wide: true },
  { name: 'Station Numixs', logo: numixsLogo, wide: false },
  { name: 'Mieux Entreprendre', logo: mieuxLogo, wide: false },
  { name: 'Nexia Digital', logo: nexiaLogo, wide: true },
];

export default function Partners() {
  return (
    <section className={styles.section} id="partenaires" aria-labelledby="partners-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>Nos partenaires</span>
          <h2 id="partners-title" className={styles.title}>
            Ils nous accompagnent
          </h2>
        </header>

        <ul className={styles.list}>
          {PARTNERS.map((p, i) => (
            <li
              key={p.name}
              className={`${styles.item} ${p.wide ? styles.itemWide : ''}`}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <img
                src={p.logo}
                alt={p.name}
                className={styles.logo}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
