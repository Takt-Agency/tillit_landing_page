import { Link } from 'react-router-dom';
import styles from './Difference.module.css';
import PageHero, { pageHeroStyles } from '../PageHero/PageHero';

export default function Difference() {
  return (
    <>
      <PageHero
        eyebrow="La différence"
        title={
          <>
            Ton partage est terminé.
            <br />
            <span className={pageHeroStyles.accent}>Pas forcément le&nbsp;remboursement.</span>
          </>
        }
        lead="Tricount et Splitwise font très bien leur travail : dire qui doit combien à qui après des dépenses communes. TilliT s’occupe d’un prêt entre proches, et de son remboursement dans le temps."
      />

      {/* --- Deux questions --- */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.container}>
          <div className={styles.split}>
            <article className={`${styles.col} ${styles.colBefore}`} data-reveal="left">
              <span className={styles.colIcon} aria-hidden="true">
                <i className="fa-solid fa-receipt" />
              </span>
              <span className={styles.tag}>Partage de dépenses</span>
              <p className={styles.ask}>Répond à une question&nbsp;:</p>
              <h2 className={styles.question}>Qui doit combien&nbsp;?</h2>
              <p className={styles.colText}>
                Restaurant, vacances, courses, colocation&nbsp;: l’application répartit les dépenses
                communes et montre le solde de chacun.
              </p>
            </article>

            <span className={styles.then} aria-hidden="true">
              <i className="fa-solid fa-arrow-right" />
            </span>

            <article
              className={`${styles.col} ${styles.colAfter}`}
              data-reveal="right"
              style={{ ['--reveal-delay' as string]: '120ms' }}
            >
              <span className={styles.colIcon} aria-hidden="true">
                <i className="fa-solid fa-calendar-check" />
              </span>
              <span className={styles.tag}>TilliT</span>
              <p className={styles.ask}>Répond à la suivante&nbsp;:</p>
              <h2 className={styles.question}>Quand et comment rembourser&nbsp;?</h2>
              <p className={styles.colText}>
                TilliT organise le prêt&nbsp;: le montant, les dates, les échéances et le suivi de
                chaque remboursement.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* --- Les deux se complètent --- */}
      <section className={`${styles.section} ${styles.storySection}`}>
        <div className={styles.narrow}>
          <div className={styles.story} data-reveal>
            <span className={styles.storyKicker}>
              <i className="fa-solid fa-puzzle-piece" aria-hidden="true" />
              Exemple
            </span>
            <h2 className={styles.storyTitle}>Les deux se complètent</h2>
            <p className={styles.storyText}>
              Le week-end se termine. L’application de partage annonce que Natan doit{' '}
              <mark className={styles.hlInk}>360&nbsp;€</mark>. Il rembourse{' '}
              <mark className={styles.hlGreen}>120&nbsp;€</mark> tout de suite, et demande du
              temps pour les <mark className={styles.hlViolet}>240&nbsp;€</mark> qui restent.
            </p>
            <p className={styles.storyText}>
              TilliT organise ces 240&nbsp;€&nbsp;: en trois fois, à des dates convenues à deux,
              avec le suivi de chaque remboursement.
            </p>

            <div className={styles.bar} aria-hidden="true">
              <div className={styles.barHead}>
                <span>
                  <i className="fa-solid fa-receipt" /> Solde du week-end
                </span>
                <b>360&nbsp;€</b>
              </div>
              <div className={styles.barTrack}>
                <span className={styles.segPaid}>
                  <i className="fa-solid fa-check" /> 120&nbsp;€
                </span>
                <span className={styles.segTillit}>
                  <span>80&nbsp;€</span>
                  <span>80&nbsp;€</span>
                  <span>80&nbsp;€</span>
                </span>
              </div>
              <div className={styles.legend}>
                <span className={styles.legendPaid}>Tout de suite</span>
                <span className={styles.legendTillit}>Avec TilliT, en trois fois</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.narrow}>
          <div className={styles.keep} data-reveal>
            <span className={styles.keepIcon} aria-hidden="true">
              <i className="fa-solid fa-handshake" />
            </span>
            <div>
              <h2 className={styles.keepTitle}>
                Faut-il abandonner son application de partage&nbsp;?
              </h2>
              <p className={styles.keepText}>
                Garde-la pour répartir les dépenses communes. TilliT prend le relais quand une
                somme doit être remboursée dans le temps.
              </p>
            </div>
          </div>

          <div className={styles.post} data-reveal>
            <h3>Réserve ta place</h3>
            <p>On t’écrit dès l’ouverture de TilliT.</p>
            <Link to="/#cta" className={styles.postBtn}>
              Être prévenu du lancement
              <i className="fa-solid fa-bell" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
