import { Link } from 'react-router-dom';
import styles from './Histoire.module.css';
import PageHero from '../PageHero/PageHero';
import StatsBanner, { type Stat } from '../StatsBanner/StatsBanner';
import statsStyles from '../StatsBanner/StatsBanner.module.css';
import coverUrl from '../../amies-canape-rire.webp';
import mascotUrl from '../../millions-mascotte.png';

const STATS: Stat[] = [
  {
    value: 58,
    decimals: 0,
    suffix: '%',
    label: 'des Français disent ne pas parler facilement d’argent.',
    source: 'Yomoni / BuzzPress',
    sourceUrl:
      'https://blog.yomoni.fr/les-francais-disent-ils-toute-la-verite-sur-leurs-finances-en-societe/',
    accent: 'violet',
    icon: 'fa-comment-dots',
  },
  {
    value: 30,
    decimals: 0,
    suffix: '%',
    label:
      'des personnes ayant emprunté de l’argent à un ami reconnaissent ne l’avoir jamais remboursé.',
    source: 'Bread Financial',
    sourceUrl:
      'https://newsroom.breadfinancial.com/from-friends-to-foes-financial-incompatibility-study',
    accent: 'coral',
    icon: 'fa-user-clock',
  },
  {
    value: 19,
    decimals: 0,
    suffix: '%',
    label:
      'des prêteurs et emprunteurs disent avoir correctement formalisé les conditions et le remboursement d’un prêt à un proche.',
    source: 'LendingTree',
    sourceUrl: 'https://www.lendingtree.com/personal/study-lending-between-family-friends/',
    accent: 'blue',
    icon: 'fa-file-circle-check',
  },
];

export default function Histoire() {
  return (
    <>
      <PageHero
        eyebrow="Notre histoire"
        title="D’où vient TilliT."
        lead="Le nom vient d’un mot du Nord. L’idée vient de cinq histoires vraies."
      />

      {/* --- Le mot --- */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={`${styles.narrow} ${styles.wordGrid}`}>
          <div className={styles.prose} data-reveal>
            <h2>Un mot du Nord. Dans les deux sens.</h2>
            <p>
              TilliT vient de <em>tillit</em>, un mot norvégien et suédois qui veut dire
              confiance.
            </p>
            <p>
              Le suédois va plus loin&nbsp;: <em>tillit</em>, c’est la conviction que l’autre
              tient à toi et pense à toi. En vieux norrois, <em>tillit</em> veut dire le regard,
              l’égard, le respect.
            </p>
            <p>Le mot se lit dans les deux sens. Comme kayak, ou ici.</p>
            <p>Un prêt tient à ça. L’équilibre. Ça va, ça vient, et ça doit revenir.</p>
          </div>

          <div className={styles.palindrome} aria-hidden="true" data-reveal="right">
            <span className={styles.dictTag}>nom · norvégien, suédois</span>

            <div className={styles.loop}>
              <span className={`${styles.flow} ${styles.flowTop}`}>ça va</span>
              <svg className={styles.arc} viewBox="0 0 300 48" fill="none">
                <path className={styles.arcTop} d="M28 44 C 80 4, 220 4, 272 44" />
                <path className={styles.arcTopHead} d="M262 32 L273 45 L256 45" />
              </svg>

              <span className={styles.word}>
                {'TilliT'.split('').map((l, i) => (
                  <span
                    key={i}
                    className={i === 0 || i === 5 ? styles.letterEdge : ''}
                    style={{ ['--i' as string]: Math.min(i, 5 - i) }}
                  >
                    {l}
                  </span>
                ))}
                <i className={styles.axis} />
              </span>

              <svg className={styles.arc} viewBox="0 0 300 48" fill="none">
                <path className={styles.arcBottom} d="M272 4 C 220 44, 80 44, 28 4" />
                <path className={styles.arcBottomHead} d="M38 16 L27 3 L44 3" />
              </svg>
              <span className={`${styles.flow} ${styles.flowBottom}`}>ça vient</span>
            </div>

            <p className={styles.definition}>
              <span>=</span> confiance
            </p>
          </div>
        </div>
      </section>

      {/* --- Les histoires --- */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.narrow}>
          <div className={styles.prose} data-reveal>
            <h2>Cinq prêts. Cinq histoires.</h2>
            <p>
              L’argent est un sujet difficile entre proches, en famille comme entre amis. On
              n’ose pas demander. On n’ose pas relancer. Et plus personne n’en parle.
            </p>
          </div>

          <ol className={styles.stories}>
            <li className={styles.story} data-reveal>
              <span className={styles.amount}>40&nbsp;€</span>
              <p>
                Un ami en dépanne un autre de 40&nbsp;€. Plusieurs mois passent, et toujours
                rien. Il relance. Réponse&nbsp;:{' '}
                <span className={styles.quote}>«&nbsp;pleure pas pour 40&nbsp;€&nbsp;»</span>.
              </p>
            </li>
            <li className={styles.story} data-reveal>
              <span className={styles.amount}>300&nbsp;€</span>
              <p>
                Un autre prêt, 300&nbsp;€. Deux ans passent. Au retour de vacances, le prêteur
                demande son argent. Réponse&nbsp;:{' '}
                <span className={styles.quote}>«&nbsp;tu pars tout le temps en vacances&nbsp;»</span>. Donc il a de
                l’argent. Donc il n’a pas besoin d’être remboursé. On ne parle plus des dates. On
                parle de ses vacances.
              </p>
            </li>
            <li className={styles.story} data-reveal>
              <span className={styles.amount}>500&nbsp;€</span>
              <p>
                Un troisième prêt, 500&nbsp;€. Trois ou quatre mois sans nouvelles. Il appelle. Il
                écrit. Rien. Il passe chez lui&nbsp;: l’ami a déménagé. Il finit par écrire aux
                amis communs, qui écrivent à leur tour. L’autre répond enfin. Il demande qu’on
                supprime les messages, et rembourse une fois la pression arrivée. L’amitié
                s’arrête là. S’il était venu en parler, un autre calendrier était possible.
              </p>
            </li>
          </ol>

          <aside className={styles.callout} data-reveal>
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-user-shield" />
            </span>
            <p>
              C’est de là que vient le <strong>Tiers de confiance</strong>. Une personne que vous
              choisissez tous les deux au moment du prêt, pour vous aider à reprendre la
              discussion. Pas un groupe d’amis.
            </p>
          </aside>

          <figure className={styles.cover} data-reveal>
            <img
              src={coverUrl}
              alt="Deux amies rient, assises sur un canapé."
              width={1290}
              height={860}
              loading="lazy"
              decoding="async"
            />
          </figure>

          <ol className={styles.stories} start={4}>
            <li className={`${styles.story} ${styles.storyWin}`} data-reveal>
              <span className={styles.amount}>3&nbsp;000&nbsp;€</span>
              <p>
                Et il y a la fois où ça marche. 3&nbsp;000&nbsp;€ empruntés à un ami, pour un
                achat immobilier. Chaque mois, un message&nbsp;: pour confirmer, pour décaler si
                besoin, pour prévenir quand ça coince. Remboursé en six mois au lieu de douze. À
                la fin, il l’invite au restaurant. Rien n’était convenu d’avance. L’amitié en sort
                plus forte. <strong>TilliT est né pour garder ce fil sans avoir à y penser chaque
                mois.</strong>
              </p>
            </li>
            <li className={styles.story} data-reveal>
              <span className={styles.amount}>2&nbsp;500&nbsp;€</span>
              <p>
                Ce même ami prête 2&nbsp;500&nbsp;€ à son père. Rien d’écrit, aucun suivi. Il
                n’est pas remboursé.
              </p>
            </li>
          </ol>

          <p className={styles.statement} data-reveal>
            Le problème n’est jamais l’argent. <span>C’est le flou autour.</span>
          </p>
        </div>
      </section>

      <StatsBanner
        id="constat"
        eyebrow="Le constat"
        stats={STATS}
        title={
          <>
            Chaque année,{' '}
            <span className={statsStyles.titleAccentCoral}>des millions de personnes</span>{' '}
            prêtent de l’argent à leurs proches.
          </>
        }
        lead="Ce simple geste peut parfois fragiliser une relation."
        outro="C’est justement pour ça qu’on a créé TilliT."
      />

      {/* --- Pourquoi un cadre --- */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.narrow}>
          <h2 className={styles.frameTitle} data-reveal>
            Pourquoi un cadre
          </h2>
          <div className={styles.gestures}>
            <p className={styles.gesture} data-reveal="left">
              <span className={styles.gestureIcon} aria-hidden="true">
                <i className="fa-solid fa-heart" />
              </span>
              <span>Prêter de l’argent à un proche, c’est</span>
              <strong>un geste d’amitié.</strong>
            </p>
            <span className={styles.gesturePlus} aria-hidden="true">
              +
            </span>
            <p className={`${styles.gesture} ${styles.gestureAlt}`} data-reveal="right">
              <span className={styles.gestureIcon} aria-hidden="true">
                <i className="fa-solid fa-handshake" />
              </span>
              <span>Le cadre qu’on met autour, c’est</span>
              <strong>un geste de respect.</strong>
            </p>
          </div>
          <p className={styles.frameLink} data-reveal>
            <Link to="/difference" className={styles.textLink}>
              Partage de dépenses ou TilliT&nbsp;?
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* --- Et maintenant --- */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.finalWrap}>
          <div className={styles.finalCard} data-reveal>
            <div className={styles.finalText}>
              <h2 className={styles.finalTitle}>Et maintenant&nbsp;?</h2>
              <p className={styles.finalLead}>
                TilliT n’est pas encore sorti. On t’écrit dès l’ouverture.
              </p>
              <ul className={styles.facts}>
                <li>
                  <i className="fa-solid fa-percent" aria-hidden="true" />
                  Le prêt est à 0&nbsp;% d’intérêt
                </li>
                <li>
                  <i className="fa-solid fa-building-columns" aria-hidden="true" />
                  TilliT ne détient jamais les fonds
                </li>
                <li>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                  TilliT ne garantit pas le remboursement
                </li>
              </ul>
              <Link to="/#cta" className={styles.finalBtn}>
                Être prévenu du lancement
                <i className="fa-solid fa-bell" aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.finalVisual}>
              <p className={styles.nextLoan}>
                <span className={styles.nextLoanLabel}>Au prochain prêt&nbsp;:</span>
                <span className={styles.nextLoanBubble}>«&nbsp;On utilise TilliT.&nbsp;»</span>
              </p>
              <img
                src={mascotUrl}
                alt=""
                aria-hidden="true"
                className={styles.finalMascot}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
