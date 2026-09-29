import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './CasUsage.module.css';
import PageHero from '../PageHero/PageHero';
import { useLang, useLocalize, typo, type Lang } from '../../i18n';
import cafeImg from '../../assets/cas-usage/cas-usage-amis-cafe-1320.webp';
import decapotableImg from '../../assets/cas-usage/cas-usage-amis-decapotable-1460.webp';
import soeursImg from '../../assets/cas-usage/cas-usage-soeurs-canape-1320.webp';
import rentreeImg from '../../assets/cas-usage/cas-usage-rentree.webp';
import demenagementImg from '../../assets/cas-usage/cas-usage-demenagement-cartons-1320.webp';
import cautionImg from '../../assets/cas-usage/cas-usage-caution.webp';

type Role = 'p' | 'e';

type Case = {
  amount: string;
  status: string;
  tone: 'green' | 'violet';
  title: string;
  situation: string;
  benefits: ReactNode[];
  img: string;
  alt: string;
};

/** Link to the "if it gets stuck" page, localised for the current language. */
function RecoursLink({ children }: { children: ReactNode }) {
  const l = useLocalize();
  return <Link to={l('/recours')}>{children}</Link>;
}

const CASES: Record<Lang, Record<Role, Case[]>> = {
  fr: {
    p: [
      {
        amount: '200 €',
        status: 'Confirmé à deux',
        tone: 'green',
        title: '« Je dépanne un ami de 200 € en fin de mois. »',
        situation: '« Je te rends ça bientôt. » Reste à savoir quand.',
        benefits: [
          'Avec Note, vous choisissez une date et suivez le remboursement ensemble, gratuitement',
        ],
        img: cafeImg,
        alt: 'Deux amis à une table de café',
      },
      {
        amount: '600 €',
        status: 'Rappel envoyé',
        tone: 'violet',
        title: '« J’avance 600 € pour le billet d’avion d’un ami. »',
        situation: 'Tu paies le billet maintenant, il te rembourse après le voyage.',
        benefits: [
          'La date du remboursement est fixée avant que tu paies',
          'Il voit ce qu’il te doit, tu n’as pas à le redire',
        ],
        img: decapotableImg,
        alt: 'Des amis, vus de dos, debout autour d’une décapotable ancienne dans une rue animée',
      },
      {
        amount: '1 200 €',
        status: 'Accepté',
        tone: 'green',
        title: '« J’avance 1 200 € à ma sœur pour son permis. »',
        situation: 'Tu veux l’aider sans que la somme revienne à chaque repas de famille.',
        benefits: [
          'Le montant, les mensualités et la date de fin sont fixés avant le virement',
          'TilliT envoie les rappels',
        ],
        img: soeursImg,
        alt: 'Deux sœurs assises sur un canapé',
      },
    ],
    e: [
      {
        amount: 'il me manque 300 €',
        status: 'Demande envoyée',
        tone: 'violet',
        title: '« Il me manque 300 € pour la rentrée de mon fils. »',
        situation:
          'Demander, c’est souvent le plus dur. Tu arrives avec un montant et des dates, et la conversation est plus simple.',
        benefits: [
          'Tu proposes le montant et les dates. Ton proche accepte, propose autre chose ou refuse',
          'Le prêt est à 0 % d’intérêt',
        ],
        img: rentreeImg,
        alt: 'Un carnet, des crayons et des trombones, prêts pour la rentrée.',
      },
      {
        amount: '800 €',
        status: 'Remboursement confirmé',
        tone: 'green',
        title: '« Mes parents avancent 800 € pour mon déménagement. »',
        situation: 'Tu veux que tout soit clair, pour eux comme pour toi.',
        benefits: [
          'Vous choisissez des dates adaptées à ta situation et suivez ensemble ce qui est remboursé',
          'Au dernier remboursement confirmé, le prêt est marqué comme remboursé pour vous deux',
        ],
        img: demenagementImg,
        alt: 'Des cartons de déménagement empilés, une plante en pot posée dessus.',
      },
      {
        amount: '1 100 €',
        status: 'Signé',
        tone: 'green',
        title: '« Un proche me prête 1 100 € pour la caution. »',
        situation: 'Tu veux montrer que tu prends l’engagement au sérieux.',
        benefits: [
          <>
            Vous voulez aussi un document signé&nbsp;? Avec Zen, vous signez une reconnaissance de
            dette. Elle n’est pas un titre exécutoire. <RecoursLink>Ce qu’elle permet</RecoursLink>
          </>,
          'Le prêt et ses remboursements restent dans ton Carnet de prêt',
        ],
        img: cautionImg,
        alt: 'Une main tient un trousseau de clés devant une porte d’entrée ouverte.',
      },
    ],
  },
  en: {
    p: [
      {
        amount: '€200',
        status: 'Confirmed by both',
        tone: 'green',
        title: '“I’m helping a friend out with €200 at the end of the month.”',
        situation: '“I’ll pay you back soon.” The question is when.',
        benefits: [
          'With Note, you pick a date and track the repayment together, free of charge',
        ],
        img: cafeImg,
        alt: 'Two friends at a café table',
      },
      {
        amount: '€600',
        status: 'Reminder sent',
        tone: 'violet',
        title: '“I’m fronting €600 for a friend’s plane ticket.”',
        situation: 'You pay for the ticket now, he repays you after the trip.',
        benefits: [
          'The repayment date is set before you pay',
          'He can see what he owes you, so you don’t have to say it again',
        ],
        img: decapotableImg,
        alt: 'Friends seen from behind, standing around a vintage convertible on a busy street',
      },
      {
        amount: '€1,200',
        status: 'Accepted',
        tone: 'green',
        title: '“I’m fronting €1,200 to my sister for her driving licence.”',
        situation: 'You want to help without the money coming up at every family meal.',
        benefits: [
          'The amount, the monthly instalments and the end date are set before the transfer',
          'TilliT sends the reminders',
        ],
        img: soeursImg,
        alt: 'Two sisters sitting on a sofa',
      },
    ],
    e: [
      {
        amount: 'I’m €300 short',
        status: 'Request sent',
        tone: 'violet',
        title: '“I’m €300 short for my son’s new school year.”',
        situation:
          'Asking is often the hardest part. You arrive with an amount and dates, and the conversation gets easier.',
        benefits: [
          'You suggest the amount and the dates. The other person accepts, suggests something else or says no',
          'The loan is at 0% interest',
        ],
        img: rentreeImg,
        alt: 'A notebook, pencils and paper clips, ready for the new school year.',
      },
      {
        amount: '€800',
        status: 'Repayment confirmed',
        tone: 'green',
        title: '“My parents are fronting €800 for my move.”',
        situation: 'You want it clear for them as much as for you.',
        benefits: [
          'You choose dates that fit your situation, and track together what’s been repaid',
          'At the last confirmed repayment, the loan is marked as repaid for you both',
        ],
        img: demenagementImg,
        alt: 'Stacked moving boxes with a potted plant on top.',
      },
      {
        amount: '€1,100',
        status: 'Signed',
        tone: 'green',
        title: '“Someone close is lending me €1,100 for the deposit.”',
        situation: 'You want to show you’re taking the commitment seriously.',
        benefits: [
          <>
            Want a signed document too? With Zen, you sign an acknowledgement of debt. It is not an
            enforceable order (titre exécutoire).{' '}
            <RecoursLink>What it does for you</RecoursLink>
          </>,
          'The loan and its repayments stay in your Carnet de prêt, your loan record book',
        ],
        img: cautionImg,
        alt: 'A hand holding a set of keys in front of an open front door.',
      },
    ],
  },
};

const COPY = {
  fr: {
    eyebrow: 'Cas d’usage',
    title: (
      <>
        Un prêt, ça se vit.
        <br />
        Voilà comment.
      </>
    ),
    lead: 'Des situations du quotidien, et comment TilliT aide à organiser le prêt.',
    heading: 'Exemples de prêts entre proches',
    pick: 'Choisis le côté où tu te trouves.',
    rolesAria: 'Ton rôle',
    roles: { p: 'Je prête', e: 'J’emprunte' } as Record<Role, string>,
    postTitle: 'Deux formules pour organiser ton prêt',
    postText: 'TilliT organise le prêt et son suivi. Il ne garantit pas le remboursement.',
    postBtn: 'Découvrir les formules',
  },
  en: {
    eyebrow: 'Use cases',
    title: (
      <>
        A loan happens in real life.
        <br />
        Here’s how.
      </>
    ),
    lead: 'Everyday situations, and how TilliT helps organise the loan.',
    heading: 'Examples of loans between friends and family',
    pick: 'Pick the side you’re on.',
    rolesAria: 'Your role',
    roles: { p: 'I’m lending', e: 'I’m borrowing' } as Record<Role, string>,
    postTitle: 'Two plans to organise your loan',
    postText: 'TilliT organises the loan and its tracking. It does not guarantee repayment.',
    postBtn: 'See the plans',
  },
};

export default function CasUsage() {
  const [role, setRole] = useState<Role>('p');
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      <section className={styles.section} id="situations">
        <div className={styles.container}>
          <header className={styles.head} data-reveal>
            <h2 className={styles.title}>{t.heading}</h2>
            <p className={styles.lead}>{t.pick}</p>

            <div className={styles.roles} role="tablist" aria-label={t.rolesAria}>
              <span
                className={`${styles.roleThumb} ${role === 'e' ? styles.roleThumbRight : ''}`}
                aria-hidden="true"
              />
              {(['p', 'e'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={role === r}
                  aria-controls="cas-liste"
                  className={`${styles.role} ${role === r ? styles.roleActive : ''}`}
                  onClick={() => setRole(r)}
                >
                  <i
                    className={`fa-solid ${
                      r === 'p' ? 'fa-hand-holding-heart' : 'fa-hand-holding-dollar'
                    }`}
                    aria-hidden="true"
                  />
                  {t.roles[r]}
                </button>
              ))}
            </div>
          </header>

          <div id="cas-liste" role="tabpanel" className={styles.list} key={role}>
            {CASES[lang][role].map((c, i) => (
              <article
                key={c.title}
                className={`${styles.case} ${i % 2 ? styles.caseReverse : ''}`}
                style={{ ['--i' as string]: i }}
              >
                <div className={styles.photo}>
                  <img src={c.img} alt={c.alt} loading="lazy" decoding="async" />
                  <span className={styles.amount}>{c.amount}</span>
                </div>
                <div className={styles.text}>
                  <span className={`${styles.status} ${styles[`status_${c.tone}`]}`}>
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                    {c.status}
                  </span>
                  <h3 className={styles.caseTitle}>{typo(c.title, lang)}</h3>
                  <p className={styles.situation}>{typo(c.situation, lang)}</p>
                  <ul className={styles.benefits}>
                    {c.benefits.map((b, j) => (
                      <li key={j}>
                        <span>{typeof b === 'string' ? typo(b, lang) : b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

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
