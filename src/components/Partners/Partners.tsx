import styles from './Partners.module.css';
import goodflagLogo from '../../logo-goodflag.svg';
import nexiaLogo from '../../nexia digital.png';
import numixsLogo from '../../station-numixs-logo-DN9Ujo5B.png';

type Partner = {
  name: string;
  logo?: string;
};

const PARTNERS: Partner[] = [
  { name: 'France Identité' },
  { name: 'Goodflag', logo: goodflagLogo },
  { name: 'Station Numixs', logo: numixsLogo },
  { name: 'Mieux Entreprendre' },
  { name: 'Nexia Digital', logo: nexiaLogo },
];

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

        <ul className={styles.list}>
          {PARTNERS.map((p, i) => (
            <li
              key={p.name}
              className={styles.item}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
            >
              {p.logo ? (
                <img src={p.logo} alt={p.name} className={styles.logo} />
              ) : (
                <span className={styles.placeholder}>{p.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
