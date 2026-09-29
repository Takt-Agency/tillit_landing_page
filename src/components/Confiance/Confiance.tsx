import { Link } from 'react-router-dom';
import styles from './Confiance.module.css';
import PageHero from '../PageHero/PageHero';
import accordImg from '../../assets/confiance/confiance-accord-terrasse.webp';
import telephoneImg from '../../assets/confiance/confiance-telephone-main.webp';
import carnetImg from '../../assets/confiance/carnet-pret-ouvert.webp';
import calinImg from '../../assets/confiance/carnet-calin.webp';

const STEPS = [
  {
    title: 'Vous vous mettez d’accord',
    text: 'Le montant, les échéances, la date de fin. Ce qui est convenu est écrit avant le virement.',
    img: accordImg,
    height: 1300,
    alt: 'Deux amies qui se mettent d’accord à la terrasse d’un café',
  },
  {
    title: 'Chaque remboursement est confirmé',
    text: 'Tu déclares ton remboursement, l’autre le confirme. Ce remboursement confirmé rejoint l’historique partagé.',
    img: telephoneImg,
    height: 1300,
    alt: 'Un téléphone tenu à la main, en gros plan',
  },
  {
    title: 'Ton Carnet se remplit',
    text: 'Chaque prêt remboursé y laisse une trace datée. Il reste à toi.',
    img: carnetImg,
    height: 1387,
    alt: 'Un Carnet de prêt TilliT ouvert, tenu à la main, avec l’historique daté des prêts remboursés d’Agathe',
  },
  {
    title: 'Le prêt est remboursé',
    text: 'Au dernier remboursement confirmé, il est marqué comme remboursé pour vous deux.',
    img: calinImg,
    height: 1387,
    alt: 'Une femme et un homme qui s’enlacent en souriant, elle tient un Carnet TilliT violet à la main',
  },
];

export default function Confiance() {
  return (
    <>
      <PageHero
        eyebrow="Le Carnet de prêt et le Tiers de confiance"
        title={
          <>
            Ce que tu as fait,
            <br />
            pas ce que tu vaux.
          </>
        }
        lead="Garder une trace de ce qui a été remboursé, et pouvoir se reparler si ça coince : c’est le rôle du Carnet de prêt et du Tiers de confiance."
      />

      {/* --- Le Carnet --- */}
      <section className={`${styles.section} ${styles.white}`} id="carnet">
        <span className={styles.blob} aria-hidden="true" />
        <div className={styles.container}>
          <header className={styles.head} data-reveal>
            <span className={styles.kicker}>
              <i className="fa-solid fa-book-open" aria-hidden="true" />
              Le Carnet de prêt
            </span>
            <h2 className={styles.title}>
              La confiance se constate,
              <br />
              <span className={styles.accent}>prêt après prêt.</span>
            </h2>
            <p className={styles.lead}>Chaque prêt remboursé laisse une trace dans ton Carnet.</p>
          </header>

          <div className={styles.howHead} data-reveal>
            <span className={styles.howKicker}>Comment ça marche&nbsp;?</span>
            <h3 className={styles.howTitle}>
              Du prêt au Carnet,
              <br />
              en quatre étapes.
            </h3>
          </div>

          <div className={styles.stepsZone}>
            <svg
              className={styles.path}
              viewBox="0 0 1000 90"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M10 30 C 120 30, 170 75, 290 72 S 470 70, 560 72 S 720 50, 790 30 S 930 26, 990 30" />
            </svg>

            <ol className={styles.steps}>
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className={styles.step}
                  data-reveal
                  style={{ ['--reveal-delay' as string]: `${i * 110}ms` }}
                >
                  <p className={styles.stepHead}>
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.stepTitle}>{s.title}</span>
                  </p>
                  <figure className={styles.polaroid}>
                    <img
                      src={s.img}
                      alt={s.alt}
                      width={1040}
                      height={s.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className={styles.stepText}>{s.text}</figcaption>
                  </figure>
                </li>
              ))}
            </ol>
          </div>

          <p className={styles.choice} data-reveal>
            <i className="fa-solid fa-eye" aria-hidden="true" />
            Tu choisis de le montrer, ou non. Il n’attribue aucune note et ne classe personne.
          </p>

          <div className={styles.caveat} data-reveal>
            <span className={styles.caveatIcon} aria-hidden="true">
              <i className="fa-solid fa-shield-halved" />
            </span>
            <p>
              <strong>Trois choses que le Carnet ne fera jamais.</strong> Il n’est pas partagé
              sans ton accord. Il n’est jamais transmis à un organisme de crédit ni à un tiers
              commercial. Et un refus de prêt n’y figure pas&nbsp;: dire non à quelqu’un reste un
              droit.
            </p>
          </div>
        </div>
      </section>

      {/* --- Le Tiers --- */}
      <section className={`${styles.section} ${styles.tint}`} id="temoin">
        <div className={styles.container}>
          <header className={styles.head} data-reveal>
            <span className={styles.kicker}>
              <i className="fa-solid fa-user-shield" aria-hidden="true" />
              Le Tiers de confiance
            </span>
            <h2 className={styles.title}>Quand la conversation s’arrête d’un coup.</h2>
            <p className={styles.lead}>
              Quand un remboursement prend du retard, on peut avoir du mal à en parler. La
              personne n’ose plus répondre, et plus le silence dure, plus il devient difficile à
              rompre. Le Tiers existe pour ce moment précis.
            </p>
          </header>

          <div className={styles.split}>
            <article className={`${styles.col} ${styles.colBefore}`} data-reveal="left">
              <span className={styles.tag}>Sans tiers</span>
              <h3 className={styles.colTitle}>Personne ne rouvre la conversation</h3>
              <p className={styles.colText}>
                Celui qui a prêté n’ose pas relancer, de peur de gêner. Celui qui doit rembourser
                n’ose pas expliquer. Chacun attend le premier pas de l’autre.
              </p>
              <ul className={styles.colList}>
                <li>Le sujet devient impossible à aborder</li>
                <li>Chacun interprète le silence de l’autre</li>
                <li>La relation s’éteint avant la dette</li>
              </ul>
            </article>

            <span className={styles.splitArrow} aria-hidden="true">
              <i className="fa-solid fa-arrow-right" />
            </span>

            <article className={`${styles.col} ${styles.colAfter}`} data-reveal="right">
              <span className={styles.tag}>Avec un tiers</span>
              <h3 className={styles.colTitle}>Quelqu’un de neutre reprend le fil</h3>
              <p className={styles.colText}>
                Vous choisissez cette personne ensemble, au moment du prêt. Si l’autre ne répond
                plus, celui qui a prêté peut faire appel à elle. Elle sait qu’un prêt existe, et
                sur combien de temps. Elle ne connaît ni le montant ni les remboursements. Elle
                est prévenue à la fin du prêt.
              </p>
              <ul className={styles.colList}>
                <li>
                  Elle peut renouer le contact et chercher avec vous comment reprendre les
                  remboursements
                </li>
                <li>Elle peut refuser ce rôle à tout moment</li>
              </ul>
            </article>
          </div>

          <div className={styles.messageRow}>
            <article className={styles.message} data-reveal="left">
              <h3 className={styles.messageTitle}>
                <span className={styles.messageTitleIcon} aria-hidden="true">
                  <i className="fa-solid fa-envelope-open-text" />
                </span>
                Exemple de message au tiers
              </h3>

              <div className={styles.trio} aria-hidden="true">
                <span className={`${styles.person} ${styles.personL}`}>L</span>
                <span className={styles.trioLine} />
                <span className={`${styles.person} ${styles.personTiers}`}>
                  <i className="fa-solid fa-user-shield" />
                </span>
                <span className={styles.trioLine} />
                <span className={`${styles.person} ${styles.personT}`}>T</span>
              </div>

              <div className={styles.notif}>
                <div className={styles.notifHead}>
                  <img src="/favicon.png" alt="" width={28} height={28} />
                  <b>TilliT</b>
                  <span>maintenant</span>
                </div>
                <p className={styles.notifText}>
                  «&nbsp;Léonie et Thomas t’ont choisi comme tiers de confiance pour un prêt entre
                  eux. Ils ont besoin de reprendre la discussion. Peux-tu leur proposer d’en
                  parler&nbsp;?&nbsp;»
                </p>
              </div>
            </article>

            <aside className={styles.notRecourse} data-reveal="right">
              <span className={styles.notRecourseIcon} aria-hidden="true">
                <i className="fa-solid fa-scale-unbalanced" />
              </span>
              <h3 className={styles.notRecourseTitle}>Le tiers n’est pas un recours.</h3>
              <p className={styles.notRecourseText}>
                Il ne recouvre rien et ne juge personne. Si le dialogue ne reprend pas, la suite se
                passe ailleurs&nbsp;:
              </p>
              <Link to="/recours" className={styles.notRecourseLink}>
                La marche à suivre en cas de non&#8209;remboursement
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* --- Principe commun --- */}
      <section className={styles.principle}>
        <span className={styles.arches} aria-hidden="true" />
        <div className={styles.container} data-reveal>
          <span className={`${styles.kicker} ${styles.kickerLight}`}>Le principe commun</span>
          <h2 className={styles.principleTitle}>
            On ne remplace pas la confiance.
            <br />
            <span className={styles.principleAccent}>On lui donne un&nbsp;cadre.</span>
          </h2>
          <p className={styles.principleLead}>
            Le Carnet garde la trace, le Tiers aide à renouer le dialogue. Aucun des deux ne
            garantit le remboursement.
          </p>
          <div className={styles.duo} aria-hidden="true">
            <span className={styles.duoIcon}>
              <i className="fa-solid fa-book-open" />
            </span>
            <span className={styles.duoPlus}>+</span>
            <span className={styles.duoIcon}>
              <i className="fa-solid fa-comments" />
            </span>
          </div>
        </div>
      </section>

      {/* --- Post CTA --- */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.narrow}>
          <div className={styles.post} data-reveal>
            <h3>Organisez votre prêt ensemble.</h3>
            <p>Vous gardez la confiance, on s’occupe des détails.</p>
            <Link to="/tarifs" className={styles.postBtn}>
              Découvrir les formules
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
