import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Confiance.module.css';
import PageHero from '../PageHero/PageHero';
import { useLang, useLocalize, type Lang } from '../../i18n';
import accordImg from '../../assets/confiance/confiance-accord-terrasse.webp';
import telephoneImg from '../../assets/confiance/confiance-telephone-main.webp';
import carnetImg from '../../assets/confiance/carnet-pret-ouvert.webp';
import calinImg from '../../assets/confiance/carnet-calin.webp';

const STEP_IMGS = [
  { img: accordImg, height: 1300 },
  { img: telephoneImg, height: 1300 },
  { img: carnetImg, height: 1387 },
  { img: calinImg, height: 1387 },
];

const STEPS: Record<Lang, { title: string; text: string; alt: string }[]> = {
  fr: [
    {
      title: 'Vous vous mettez d’accord',
      text: 'Le montant, les échéances, la date de fin. Ce qui est convenu est écrit avant le virement.',
      alt: 'Deux amies qui se mettent d’accord à la terrasse d’un café',
    },
    {
      title: 'Chaque remboursement est confirmé',
      text: 'Tu déclares ton remboursement, l’autre le confirme. Ce remboursement confirmé rejoint l’historique partagé.',
      alt: 'Un téléphone tenu à la main, en gros plan',
    },
    {
      title: 'Ton Carnet se remplit',
      text: 'Chaque prêt remboursé y laisse une trace datée. Il reste à toi.',
      alt: 'Un Carnet de prêt TilliT ouvert, tenu à la main, avec l’historique daté des prêts remboursés d’Agathe',
    },
    {
      title: 'Le prêt est remboursé',
      text: 'Au dernier remboursement confirmé, il est marqué comme remboursé pour vous deux.',
      alt: 'Une femme et un homme qui s’enlacent en souriant, elle tient un Carnet TilliT violet à la main',
    },
  ],
  en: [
    {
      title: 'You two agree',
      text: 'The amount, the instalments, the end date. What you agree is written down before the transfer.',
      alt: 'Two friends agreeing on the terrace of a café',
    },
    {
      title: 'Each repayment is confirmed',
      text: 'You record your repayment, the other person confirms it. That confirmed repayment joins the shared history.',
      alt: 'A phone held in one hand, close up',
    },
    {
      title: 'Your Carnet fills up',
      text: 'Every repaid loan leaves a dated trace in it. It stays yours.',
      alt: 'An open TilliT Carnet de prêt held in one hand, showing the dated history of Agathe’s repaid loans',
    },
    {
      title: 'The loan is repaid',
      text: 'At the last confirmed repayment, it’s marked as repaid for you both.',
      alt: 'A woman and a man hugging and smiling, she holds a purple TilliT Carnet in her hand',
    },
  ],
};

type Copy = {
  heroEyebrow: string;
  heroTitle: ReactNode;
  heroLead: string;
  carnetKicker: string;
  carnetTitle: ReactNode;
  carnetLead: string;
  howKicker: ReactNode;
  howTitle: ReactNode;
  choice: string;
  caveatStrong: string;
  caveatText: ReactNode;
  tiersKicker: string;
  tiersTitle: string;
  tiersLead: string;
  beforeTag: string;
  beforeTitle: string;
  beforeText: string;
  beforeList: string[];
  afterTag: string;
  afterTitle: string;
  afterText: string;
  afterList: string[];
  messageTitle: string;
  notifTime: string;
  notifText: ReactNode;
  notRecourseTitle: string;
  notRecourseText: ReactNode;
  notRecourseLink: ReactNode;
  principleKicker: string;
  principleTitle: ReactNode;
  principleAccent: ReactNode;
  principleLead: string;
  postTitle: string;
  postText: string;
  postBtn: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    heroEyebrow: 'Le Carnet de prêt et le Tiers de confiance',
    heroTitle: (
      <>
        Ce que tu as fait,
        <br />
        pas ce que tu vaux.
      </>
    ),
    heroLead:
      'Garder une trace de ce qui a été remboursé, et pouvoir se reparler si ça coince : c’est le rôle du Carnet de prêt et du Tiers de confiance.',
    carnetKicker: 'Le Carnet de prêt',
    carnetTitle: (
      <>
        La confiance se constate,
        <br />
        <span className={styles.accent}>prêt après prêt.</span>
      </>
    ),
    carnetLead: 'Chaque prêt remboursé laisse une trace dans ton Carnet.',
    howKicker: <>Comment ça marche&nbsp;?</>,
    howTitle: (
      <>
        Du prêt au Carnet,
        <br />
        en quatre étapes.
      </>
    ),
    choice:
      'Tu choisis de le montrer, ou non. Il n’attribue aucune note et ne classe personne.',
    caveatStrong: 'Trois choses que le Carnet ne fera jamais.',
    caveatText: (
      <>
        Il n’est pas partagé sans ton accord. Il n’est jamais transmis à un organisme de
        crédit ni à un tiers commercial. Et un refus de prêt n’y figure pas&nbsp;: dire non à
        quelqu’un reste un droit.
      </>
    ),
    tiersKicker: 'Le Tiers de confiance',
    tiersTitle: 'Quand la conversation s’arrête d’un coup.',
    tiersLead:
      'Quand un remboursement prend du retard, on peut avoir du mal à en parler. La personne n’ose plus répondre, et plus le silence dure, plus il devient difficile à rompre. Le Tiers existe pour ce moment précis.',
    beforeTag: 'Sans tiers',
    beforeTitle: 'Personne ne rouvre la conversation',
    beforeText:
      'Celui qui a prêté n’ose pas relancer, de peur de gêner. Celui qui doit rembourser n’ose pas expliquer. Chacun attend le premier pas de l’autre.',
    beforeList: [
      'Le sujet devient impossible à aborder',
      'Chacun interprète le silence de l’autre',
      'La relation s’éteint avant la dette',
    ],
    afterTag: 'Avec un tiers',
    afterTitle: 'Quelqu’un de neutre reprend le fil',
    afterText:
      'Vous choisissez cette personne ensemble, au moment du prêt. Si l’autre ne répond plus, celui qui a prêté peut faire appel à elle. Elle sait qu’un prêt existe, et sur combien de temps. Elle ne connaît ni le montant ni les remboursements. Elle est prévenue à la fin du prêt.',
    afterList: [
      'Elle peut renouer le contact et chercher avec vous comment reprendre les remboursements',
      'Elle peut refuser ce rôle à tout moment',
    ],
    messageTitle: 'Exemple de message au tiers',
    notifTime: 'maintenant',
    notifText: (
      <>
        «&nbsp;Léonie et Thomas t’ont choisi comme tiers de confiance pour un prêt entre eux.
        Ils ont besoin de reprendre la discussion. Peux-tu leur proposer d’en
        parler&nbsp;?&nbsp;»
      </>
    ),
    notRecourseTitle: 'Le tiers n’est pas un recours.',
    notRecourseText: (
      <>
        Il ne recouvre rien et ne juge personne. Si le dialogue ne reprend pas, la suite se
        passe ailleurs&nbsp;: voir
      </>
    ),
    notRecourseLink: <>la marche à suivre en cas de non&#8209;remboursement</>,
    principleKicker: 'Le principe commun',
    principleTitle: <>On ne remplace pas la confiance.</>,
    principleAccent: <>On lui donne un&nbsp;cadre.</>,
    principleLead:
      'Le Carnet garde la trace, le Tiers aide à renouer le dialogue. Aucun des deux ne garantit le remboursement.',
    postTitle: 'Organisez votre prêt ensemble.',
    postText: 'Vous gardez la confiance, on s’occupe des détails.',
    postBtn: 'Découvrir les formules',
  },
  en: {
    heroEyebrow: 'The Carnet de prêt and the trusted third party',
    heroTitle: (
      <>
        What you’ve done,
        <br />
        not what you’re worth.
      </>
    ),
    heroLead:
      'Keeping a record of what’s been repaid, and being able to talk again if things get stuck: that’s the job of the Carnet de prêt, your loan record book, and of the trusted third party.',
    carnetKicker: 'The Carnet de prêt',
    carnetTitle: (
      <>
        Trust shows itself,
        <br />
        <span className={styles.accent}>loan after loan.</span>
      </>
    ),
    carnetLead: 'Every repaid loan leaves a trace in your Carnet.',
    howKicker: 'How does it work?',
    howTitle: (
      <>
        From the loan to the Carnet,
        <br />
        in four steps.
      </>
    ),
    choice: 'You choose whether to show it. It gives no score and ranks nobody.',
    caveatStrong: 'Three things the Carnet will never do.',
    caveatText: (
      <>
        It is not shared without your agreement. It is never passed to a credit provider or to
        a commercial third party. And a refusal to lend does not appear in it: saying no to
        someone stays your right.
      </>
    ),
    tiersKicker: 'The trusted third party',
    tiersTitle: 'When the conversation stops dead.',
    tiersLead:
      'When a repayment runs late, it can get hard to talk about. The other person stops daring to reply, and the longer the silence lasts, the harder it gets to break. The trusted third party exists for that exact moment.',
    beforeTag: 'Without a third party',
    beforeTitle: 'Nobody reopens the conversation',
    beforeText:
      'The person who lent doesn’t dare follow up, for fear of intruding. The person who owes doesn’t dare explain. Each one waits for the other to move first.',
    beforeList: [
      'The subject becomes impossible to raise',
      'Each one reads their own meaning into the other’s silence',
      'The relationship fades before the debt does',
    ],
    afterTag: 'With a third party',
    afterTitle: 'Someone neutral picks up the thread',
    afterText:
      'You choose this person together, when the loan is set up. If the other person stops replying, whoever lent can call on them. They know a loan exists, and over how long. They don’t know the amount or the repayments. They’re told when the loan ends.',
    afterList: [
      'They can get in touch again and look with you at how to restart the repayments',
      'They can turn down the role at any time',
    ],
    messageTitle: 'Example of a message to the third party',
    notifTime: 'now',
    notifText: (
      <>
        “Léonie and Thomas chose you as the trusted third party for a loan between them. They
        need to start talking again. Could you invite them to talk it over?”
      </>
    ),
    notRecourseTitle: 'The third party is not a legal remedy.',
    notRecourseText: (
      <>
        They collect nothing and judge nobody. If the conversation doesn’t restart, what comes
        next happens elsewhere: see
      </>
    ),
    notRecourseLink: <>the steps to follow when a loan isn’t&nbsp;repaid</>,
    principleKicker: 'What they share',
    principleTitle: <>We don’t replace trust.</>,
    principleAccent: <>We give it a&nbsp;frame.</>,
    principleLead:
      'The Carnet keeps the record, the third party helps restart the conversation. Neither of them guarantees repayment.',
    postTitle: 'Organise your loan together.',
    postText: 'You keep the trust, we take care of the details.',
    postBtn: 'See the plans',
  },
};

export default function Confiance() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const steps = STEPS[lang];

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} lead={t.heroLead} />

      {/* --- Le Carnet --- */}
      <section className={`${styles.section} ${styles.white}`} id="carnet">
        <span className={styles.blob} aria-hidden="true" />
        <div className={styles.container}>
          <header className={styles.head} data-reveal>
            <span className={styles.kicker}>
              <i className="fa-solid fa-book-open" aria-hidden="true" />
              {t.carnetKicker}
            </span>
            <h2 className={styles.title}>{t.carnetTitle}</h2>
            <p className={styles.lead}>{t.carnetLead}</p>
          </header>

          <div className={styles.howHead} data-reveal>
            <span className={styles.howKicker}>{t.howKicker}</span>
            <h3 className={styles.howTitle}>{t.howTitle}</h3>
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
              {steps.map((s, i) => (
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
                      src={STEP_IMGS[i].img}
                      alt={s.alt}
                      width={1040}
                      height={STEP_IMGS[i].height}
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
            {t.choice}
          </p>

          <div className={styles.caveat} data-reveal>
            <span className={styles.caveatIcon} aria-hidden="true">
              <i className="fa-solid fa-shield-halved" />
            </span>
            <p>
              <strong>{t.caveatStrong}</strong> {t.caveatText}
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
              {t.tiersKicker}
            </span>
            <h2 className={styles.title}>{t.tiersTitle}</h2>
            <p className={styles.lead}>{t.tiersLead}</p>
          </header>

          <div className={styles.split}>
            <article className={`${styles.col} ${styles.colBefore}`} data-reveal="left">
              <span className={styles.tag}>{t.beforeTag}</span>
              <h3 className={styles.colTitle}>{t.beforeTitle}</h3>
              <p className={styles.colText}>{t.beforeText}</p>
              <ul className={styles.colList}>
                {t.beforeList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <span className={styles.splitArrow} aria-hidden="true">
              <i className="fa-solid fa-arrow-right" />
            </span>

            <article className={`${styles.col} ${styles.colAfter}`} data-reveal="right">
              <span className={styles.tag}>{t.afterTag}</span>
              <h3 className={styles.colTitle}>{t.afterTitle}</h3>
              <p className={styles.colText}>{t.afterText}</p>
              <ul className={styles.colList}>
                {t.afterList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className={styles.messageRow}>
            <article className={styles.message} data-reveal="left">
              <h3 className={styles.messageTitle}>
                <span className={styles.messageTitleIcon} aria-hidden="true">
                  <i className="fa-solid fa-envelope-open-text" />
                </span>
                {t.messageTitle}
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
                  <span>{t.notifTime}</span>
                </div>
                <p className={styles.notifText}>{t.notifText}</p>
              </div>
            </article>

            <aside className={styles.notRecourse} data-reveal="right">
              <span className={styles.notRecourseIcon} aria-hidden="true">
                <i className="fa-solid fa-scale-unbalanced" />
              </span>
              <h3 className={styles.notRecourseTitle}>{t.notRecourseTitle}</h3>
              <p className={styles.notRecourseText}>
                {t.notRecourseText}{' '}
                <Link to={l('/recours')} className={styles.notRecourseLink}>
                  {t.notRecourseLink}
                </Link>
                .
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* --- Principe commun --- */}
      <section className={styles.principle}>
        <span className={styles.arches} aria-hidden="true" />
        <div className={styles.container} data-reveal>
          <span className={`${styles.kicker} ${styles.kickerLight}`}>{t.principleKicker}</span>
          <h2 className={styles.principleTitle}>
            {t.principleTitle}
            <br />
            <span className={styles.principleAccent}>{t.principleAccent}</span>
          </h2>
          <p className={styles.principleLead}>{t.principleLead}</p>
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
            <h3>{t.postTitle}</h3>
            <p>{t.postText}</p>
            <Link to={l('/tarifs')} className={styles.postBtn}>
              {t.postBtn}
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
