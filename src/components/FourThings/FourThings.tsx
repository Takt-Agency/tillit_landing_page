import styles from './FourThings.module.css';
import mascotUrl from '../../mascott.png';

const ITEMS = [
  {
    n: '1',
    strong: 'Le montant.',
    text: 'Ce qui est prêté, écrit noir sur blanc.',
  },
  {
    n: '2',
    strong: 'Combien par mois.',
    text: 'Et donc en combien de fois.',
  },
  {
    n: '3',
    strong: "Jusqu'à quand.",
    text: 'Les dates exactes, et surtout celle de la fin.',
  },
  {
    n: '4',
    strong: 'Le suivi.',
    text: 'Au même endroit, visible par vous deux.',
  },
];

const SCHEDULE = [
  { month: 'Mars', amount: '200 €' },
  { month: 'Avril', amount: '200 €' },
  { month: 'Mai', amount: '200 €' },
];

export default function FourThings() {
  return (
    <section
      className={styles.section}
      id="fourthings"
      aria-labelledby="fourthings-title"
    >
      <div className={styles.decorTop} aria-hidden="true" />
      <div className={styles.decorBottom} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.content} data-reveal="left">
            <span className={styles.eyebrow}>
              La façon simple d'éviter tout ça
            </span>
            <h2 id="fourthings-title" className={styles.title}>
              Quatre choses
              <br />
              <span className={styles.titleAccent}>à se dire.</span>
            </h2>

            <ul className={styles.list}>
              {ITEMS.map((item, i) => (
                <li
                  key={item.n}
                  className={styles.item}
                  style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
                  data-reveal
                >
                  <span className={styles.itemNum}>{item.n}</span>
                  <span className={styles.itemText}>
                    <strong>{item.strong}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.visual} data-reveal="right">
            <div className={styles.mascotStage}>
              <div className={styles.mascotBlob} aria-hidden="true" />
              <img
                src={mascotUrl}
                alt=""
                aria-hidden="true"
                className={styles.mascot}
                loading="lazy"
                decoding="async"
                width={400}
                height={400}
              />
            </div>

            {/* Card 1 — Ama demande */}
            <div className={styles.demandeCard}>
              <div className={styles.demandeHead}>
                <span className={styles.demandeAvatar}>A</span>
                <div className={styles.demandeInfo}>
                  <p className={styles.demandeName}>Ama</p>
                  <p className={styles.demandeSub}>
                    te demande · billet d'avion
                  </p>
                </div>
                <p className={styles.demandeAmount}>600,00 €</p>
              </div>
              <div className={styles.demandeActions}>
                <button type="button" className={styles.btnPrimary}>
                  Accepter
                </button>
                <button type="button" className={styles.btnGhost}>
                  Proposer
                </button>
                <button type="button" className={styles.btnSoft}>
                  Refuser
                </button>
              </div>
            </div>

            {/* Card 2 — Échéancier proposé */}
            <div className={styles.scheduleCard}>
              <p className={styles.scheduleTitle}>Échéancier proposé</p>
              <ul className={styles.scheduleList}>
                {SCHEDULE.map((row) => (
                  <li key={row.month}>
                    <span>{row.month}</span>
                    <strong>{row.amount}</strong>
                  </li>
                ))}
              </ul>
              <p className={styles.scheduleFoot}>
                Terminé le 5 mai · <span>0 % d'intérêt</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
