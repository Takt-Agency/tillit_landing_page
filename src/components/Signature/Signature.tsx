import styles from './Signature.module.css';

const POINTS = [
  {
    icon: 'fa-certificate',
    title: 'Signature qualifiée',
    desc: 'Le format officiel qui identifie sans ambiguïté chaque signataire.',
  },
  {
    icon: 'fa-shield-halved',
    title: 'Reconnue en Europe',
    desc: "Le plus haut niveau de signature électronique selon le règlement eIDAS.",
  },
  {
    icon: 'fa-feather-pointed',
    title: 'Valeur juridique',
    desc: 'Équivalente à une signature manuscrite devant un tribunal.',
  },
];

export default function Signature() {
  return (
    <section
      className={styles.section}
      id="signature"
      aria-labelledby="signature-title"
    >
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.textCol} data-reveal="left">
            <span className={styles.eyebrow}>Signature électronique</span>
            <h2 id="signature-title" className={styles.title}>
              Ce que ça apporte,{' '}
              <span className={styles.titleAccent}>réellement.</span>
            </h2>
            <p className={styles.lead}>
              Aujourd'hui on parle beaucoup de signature électronique. Voici ce que
              vous obtenez concrètement avec tillit Zen — pour que vous compreniez
              pourquoi ce parcours en vaut la peine.
            </p>

            <div className={styles.badge}>
              <span className={styles.badgeIcon}>
                <i className="fa-solid fa-check-double" aria-hidden="true" />
              </span>
              <div>
                <p className={styles.badgeTitle}>Certifié eIDAS</p>
                <p className={styles.badgeDesc}>
                  Règlement européen n°910/2014 — niveau qualifié
                </p>
              </div>
            </div>
          </div>

          <ul className={styles.points}>
            {POINTS.map((p, i) => (
              <li
                key={p.title}
                className={styles.point}
                data-reveal="right"
                style={{ ['--reveal-delay' as string]: `${i * 120}ms` }}
              >
                <span className={styles.pointIcon}>
                  <i className={`fa-solid ${p.icon}`} aria-hidden="true" />
                </span>
                <div className={styles.pointText}>
                  <h3 className={styles.pointTitle}>{p.title}</h3>
                  <p className={styles.pointDesc}>{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
