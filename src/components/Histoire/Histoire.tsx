import { Link } from 'react-router-dom';
import styles from './Histoire.module.css';
import PageHero from '../PageHero/PageHero';
import StatsBanner, { type Stat } from '../StatsBanner/StatsBanner';
import statsStyles from '../StatsBanner/StatsBanner.module.css';
import coverUrl from '../../amies-canape-rire.webp';
import mascotUrl from '../../millions-mascotte.png';
import { useLang, useLocalize, type Lang } from '../../i18n';

const STAT_SOURCES = [
  {
    value: 58,
    source: 'Yomoni / BuzzPress',
    sourceUrl:
      'https://blog.yomoni.fr/les-francais-disent-ils-toute-la-verite-sur-leurs-finances-en-societe/',
    accent: 'violet',
    icon: 'fa-comment-dots',
  },
  {
    value: 30,
    source: 'Bread Financial',
    sourceUrl:
      'https://newsroom.breadfinancial.com/from-friends-to-foes-financial-incompatibility-study',
    accent: 'coral',
    icon: 'fa-user-clock',
  },
  {
    value: 19,
    source: 'LendingTree',
    sourceUrl: 'https://www.lendingtree.com/personal/study-lending-between-family-friends/',
    accent: 'blue',
    icon: 'fa-file-circle-check',
  },
] as const;

const STAT_LABELS: Record<Lang, string[]> = {
  fr: [
    'des Français disent ne pas parler facilement d’argent.',
    'des personnes ayant emprunté de l’argent à un ami reconnaissent ne l’avoir jamais remboursé.',
    'des prêteurs et emprunteurs disent avoir correctement formalisé les conditions et le remboursement d’un prêt à un proche.',
  ],
  en: [
    'of French people say they don’t talk easily about money.',
    'of people who borrowed money from a friend admit they never repaid it.',
    'of lenders and borrowers say they properly set out the terms and the repayment of a loan to someone close.',
  ],
};

const statsFor = (lang: Lang): Stat[] =>
  STAT_SOURCES.map((s, i) => ({
    ...s,
    decimals: 0,
    suffix: '%',
    label: STAT_LABELS[lang][i],
  }));

const COPY = {
  fr: {
    heroEyebrow: 'Notre histoire',
    heroTitle: 'D’où vient TilliT.',
    heroLead: 'Le nom vient d’un mot du Nord. L’idée vient de cinq histoires vraies.',
    dictTag: 'nom · norvégien, suédois',
    flowTop: 'ça va',
    flowBottom: 'ça vient',
    definition: 'confiance',
    storiesTitle: 'Cinq prêts. Cinq histoires.',
    coverAlt: 'Deux amies rient, assises sur un canapé.',
    statsEyebrow: 'Le constat',
    statsLead: 'Ce simple geste peut parfois fragiliser une relation.',
    statsOutro: 'C’est justement pour ça qu’on a créé TilliT.',
    frameTitle: 'Pourquoi un cadre',
    gesture1: 'Prêter de l’argent à un proche, c’est',
    gesture1Strong: 'un geste d’amitié.',
    gesture2: 'Le cadre qu’on met autour, c’est',
    gesture2Strong: 'un geste de respect.',
    finalTitle: 'Et maintenant ?',
    finalLead: 'TilliT n’est pas encore sorti. On t’écrit dès l’ouverture.',
    fact1: 'Le prêt est à 0 % d’intérêt, et TilliT ne détient jamais les fonds.',
    fact2: 'TilliT ne garantit pas le remboursement.',
    finalBtn: 'Être prévenu du lancement',
    nextLoanLabel: 'Au prochain prêt :',
    nextLoanBubble: '« On utilise TilliT. »',
  },
  en: {
    heroEyebrow: 'Our story',
    heroTitle: 'Where TilliT comes from.',
    heroLead: 'The name comes from a word from the North. The idea comes from five true stories.',
    dictTag: 'noun · Norwegian, Swedish',
    flowTop: 'it goes',
    flowBottom: 'it comes',
    definition: 'trust',
    storiesTitle: 'Five loans. Five stories.',
    coverAlt: 'Two friends laughing, sitting on a sofa.',
    statsEyebrow: 'What we found',
    statsLead: 'That simple gesture can sometimes strain a relationship.',
    statsOutro: 'That’s exactly why we built TilliT.',
    frameTitle: 'Why a frame',
    gesture1: 'Lending money to someone close is',
    gesture1Strong: 'an act of friendship.',
    gesture2: 'The frame you put around it is',
    gesture2Strong: 'an act of respect.',
    finalTitle: 'What now?',
    finalLead: 'TilliT isn’t out yet. We’ll write to you as soon as it opens.',
    fact1: 'The loan is at 0% interest, and TilliT never holds the money.',
    fact2: 'TilliT does not guarantee repayment.',
    finalBtn: 'Get notified at launch',
    nextLoanLabel: 'At the next loan:',
    nextLoanBubble: '“We’re using TilliT.”',
  },
};

export default function Histoire() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const en = lang === 'en';

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} lead={t.heroLead} />

      {/* --- Le mot --- */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={`${styles.narrow} ${styles.wordGrid}`}>
          {en ? (
            <div className={styles.prose} data-reveal>
              <h2>A word from the North. Both ways round.</h2>
              <p>
                TilliT comes from <em>tillit</em>, a Norwegian and Swedish word that means trust.
              </p>
              <p>
                Swedish goes further: <em>tillit</em> is the belief that the other person cares
                about you and thinks of you. In Old Norse, <em>tillit</em> means the look, the
                regard, the respect.
              </p>
              <p>The word reads the same in both directions. Like kayak, or level.</p>
              <p>A loan rests on that. Balance. It goes, it comes, and it has to come back.</p>
            </div>
          ) : (
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
          )}

          <div className={styles.palindrome} aria-hidden="true" data-reveal="right">
            <span className={styles.dictTag}>{t.dictTag}</span>

            <div className={styles.loop}>
              <span className={`${styles.flow} ${styles.flowTop}`}>{t.flowTop}</span>
              <svg className={styles.arc} viewBox="0 0 300 48" fill="none">
                <path className={styles.arcTop} d="M28 44 C 80 4, 220 4, 272 44" />
                <path className={styles.arcTopHead} d="M262 32 L273 45 L256 45" />
              </svg>

              <span className={styles.word}>
                {'TilliT'.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={i === 0 || i === 5 ? styles.letterEdge : ''}
                    style={{ ['--i' as string]: Math.min(i, 5 - i) }}
                  >
                    {letter}
                  </span>
                ))}
                <i className={styles.axis} />
              </span>

              <svg className={styles.arc} viewBox="0 0 300 48" fill="none">
                <path className={styles.arcBottom} d="M272 4 C 220 44, 80 44, 28 4" />
                <path className={styles.arcBottomHead} d="M38 16 L27 3 L44 3" />
              </svg>
              <span className={`${styles.flow} ${styles.flowBottom}`}>{t.flowBottom}</span>
            </div>

            <p className={styles.definition}>
              <span>=</span> {t.definition}
            </p>
          </div>
        </div>
      </section>

      {/* --- Les histoires --- */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.narrow}>
          <div className={styles.prose} data-reveal>
            <h2>{t.storiesTitle}</h2>
            {en ? (
              <p>
                Money is a hard subject between people who are close, in families as much as
                between friends. Nobody dares ask. Nobody dares follow up. And then nobody talks
                about it at all.
              </p>
            ) : (
              <p>
                L’argent est un sujet difficile entre proches, en famille comme entre amis. On
                n’ose pas demander. On n’ose pas relancer. Et plus personne n’en parle.
              </p>
            )}
          </div>

          {en ? (
            <ol className={styles.stories}>
              <li className={styles.story} data-reveal>
                <span className={styles.amount}>€40</span>
                <p>
                  One friend helps another out with €40. Several months go by, and still
                  nothing. He follows up. The answer:{' '}
                  <span className={styles.quote}>“don’t cry over €40”</span>.
                </p>
              </li>
              <li className={styles.story} data-reveal>
                <span className={styles.amount}>€300</span>
                <p>
                  Another loan, €300. Two years go by. Back from his holidays, the lender asks for
                  his money. The answer:{' '}
                  <span className={styles.quote}>“you’re off on holiday all the time”</span>. So
                  he has money. So he doesn’t need repaying. The dates are no longer the subject.
                  His holidays are.
                </p>
              </li>
              <li className={styles.story} data-reveal>
                <span className={styles.amount}>€500</span>
                <p>
                  A third loan, €500. Three or four months with no news. He calls. He writes.
                  Nothing. He drops by the flat: his friend has moved out. In the end he writes to
                  their mutual friends, who write in turn. The other man finally replies. He asks
                  for the messages to be deleted, and repays once the pressure arrives. The
                  friendship ends there. If he’d come and talked about it, another calendar was
                  possible.
                </p>
              </li>
            </ol>
          ) : (
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
          )}

          <aside className={styles.callout} data-reveal>
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-user-shield" />
            </span>
            {en ? (
              <p>
                That’s where the <strong>trusted third party</strong> comes from. One person you
                both choose when the loan is set up, to help you start talking again. Not a group
                of friends.
              </p>
            ) : (
              <p>
                C’est de là que vient le <strong>Tiers de confiance</strong>. Une personne que vous
                choisissez tous les deux au moment du prêt, pour vous aider à reprendre la
                discussion. Pas un groupe d’amis.
              </p>
            )}
          </aside>

          <figure className={styles.cover} data-reveal>
            <img
              src={coverUrl}
              alt={t.coverAlt}
              width={1290}
              height={860}
              loading="lazy"
              decoding="async"
            />
          </figure>

          {en ? (
            <ol className={styles.stories} start={4}>
              <li className={`${styles.story} ${styles.storyWin}`} data-reveal>
                <span className={styles.amount}>€3,000</span>
                <p>
                  And then there’s the time it works. €3,000 borrowed from a friend, for a
                  property purchase. Every month, a message: to confirm, to move a date if needed,
                  to speak up when things get tight. Repaid in six months instead of twelve. At the
                  end, he takes his friend out to dinner. Nothing had been agreed in advance. The
                  friendship comes out stronger.{' '}
                  <strong>
                    TilliT was born to keep that thread going without having to think about it
                    every month.
                  </strong>
                </p>
              </li>
              <li className={styles.story} data-reveal>
                <span className={styles.amount}>€2,500</span>
                <p>
                  That same friend lends €2,500 to his father. Nothing written down, no tracking.
                  He isn’t repaid.
                </p>
              </li>
            </ol>
          ) : (
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
          )}

          {en ? (
            <p className={styles.statement} data-reveal>
              The problem is never the money. <span>It’s the vagueness around it.</span>
            </p>
          ) : (
            <p className={styles.statement} data-reveal>
              Le problème n’est jamais l’argent. <span>C’est le flou autour.</span>
            </p>
          )}
        </div>
      </section>

      <StatsBanner
        id="constat"
        eyebrow={t.statsEyebrow}
        stats={statsFor(lang)}
        title={
          en ? (
            <>
              Every year,{' '}
              <span className={statsStyles.titleAccentCoral}>millions of people</span> lend
              money to those close to them.
            </>
          ) : (
            <>
              Chaque année,{' '}
              <span className={statsStyles.titleAccentCoral}>des millions de personnes</span>{' '}
              prêtent de l’argent à leurs proches.
            </>
          )
        }
        lead={t.statsLead}
        outro={t.statsOutro}
      />

      {/* --- Pourquoi un cadre --- */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.narrow}>
          <h2 className={styles.frameTitle} data-reveal>
            {t.frameTitle}
          </h2>
          <div className={styles.gestures}>
            <p className={styles.gesture} data-reveal="left">
              <span className={styles.gestureIcon} aria-hidden="true">
                <i className="fa-solid fa-heart" />
              </span>
              <span>{t.gesture1}</span>
              <strong>{t.gesture1Strong}</strong>
            </p>
            <span className={styles.gesturePlus} aria-hidden="true">
              +
            </span>
            <p className={`${styles.gesture} ${styles.gestureAlt}`} data-reveal="right">
              <span className={styles.gestureIcon} aria-hidden="true">
                <i className="fa-solid fa-handshake" />
              </span>
              <span>{t.gesture2}</span>
              <strong>{t.gesture2Strong}</strong>
            </p>
          </div>
          <p className={styles.frameLink} data-reveal>
            <Link to={l('/difference')} className={styles.textLink}>
              {en ? 'Expense splitting or TilliT?' : <>Partage de dépenses ou TilliT&nbsp;?</>}
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
              <h2 className={styles.finalTitle}>{t.finalTitle}</h2>
              <p className={styles.finalLead}>{t.finalLead}</p>
              <ul className={styles.facts}>
                <li>
                  <i className="fa-solid fa-percent" aria-hidden="true" />
                  <span>{t.fact1}</span>
                </li>
                <li>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                  <span>{t.fact2}</span>
                </li>
              </ul>
              <Link to={l('/#waitlist')} className={styles.finalBtn}>
                {t.finalBtn}
                <i className="fa-solid fa-bell" aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.finalVisual}>
              <p className={styles.nextLoan}>
                <span className={styles.nextLoanLabel}>{t.nextLoanLabel}</span>
                <span className={styles.nextLoanBubble}>{t.nextLoanBubble}</span>
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
