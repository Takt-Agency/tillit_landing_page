import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Difference.module.css';
import PageHero, { pageHeroStyles } from '../PageHero/PageHero';
import { useLang, useLocalize, type Lang } from '../../i18n';

type Copy = {
  heroEyebrow: string;
  heroTitle: ReactNode;
  heroLead: string;
  splitTag: string;
  splitAsk: ReactNode;
  splitQuestion: ReactNode;
  splitText: ReactNode;
  tillitAsk: ReactNode;
  tillitQuestion: ReactNode;
  tillitText: ReactNode;
  storyKicker: string;
  storyTitle: string;
  storyText1: ReactNode;
  storyText2: ReactNode;
  barLabel: string;
  total: ReactNode;
  paid: ReactNode;
  instalment: ReactNode;
  legendPaid: string;
  legendTillit: string;
  keepTitle: ReactNode;
  keepText: string;
  postTitle: string;
  postText: string;
  postBtn: string;
};

const COPY: Record<Lang, Copy> = {
  fr: {
    heroEyebrow: 'La différence',
    heroTitle: (
      <>
        Ton partage est terminé.
        <br />
        <span className={pageHeroStyles.accent}>Pas forcément le&nbsp;remboursement.</span>
      </>
    ),
    heroLead:
      'Tricount et Splitwise font très bien leur travail : dire qui doit combien à qui après des dépenses communes. TilliT s’occupe d’un prêt entre proches, et de son remboursement dans le temps.',
    splitTag: 'Partage de dépenses',
    splitAsk: <>Répond à une question&nbsp;:</>,
    splitQuestion: <>Qui doit combien&nbsp;?</>,
    splitText: (
      <>
        Restaurant, vacances, courses, colocation&nbsp;: l’application répartit les dépenses
        communes et montre le solde de chacun.
      </>
    ),
    tillitAsk: <>Répond à la suivante&nbsp;:</>,
    tillitQuestion: <>Quand et comment rembourser&nbsp;?</>,
    tillitText: (
      <>
        TilliT organise le prêt&nbsp;: le montant, les dates, les échéances et le suivi de
        chaque remboursement.
      </>
    ),
    storyKicker: 'Exemple',
    storyTitle: 'Les deux se complètent',
    storyText1: (
      <>
        Le week-end se termine. L’application de partage annonce que Natan doit{' '}
        <mark className={styles.hlInk}>360&nbsp;€</mark>. Il rembourse{' '}
        <mark className={styles.hlGreen}>120&nbsp;€</mark> tout de suite, et demande du temps
        pour les <mark className={styles.hlViolet}>240&nbsp;€</mark> qui restent.
      </>
    ),
    storyText2: (
      <>
        TilliT organise ces 240&nbsp;€&nbsp;: en trois fois, à des dates convenues à deux, avec
        le suivi de chaque remboursement.
      </>
    ),
    barLabel: 'Solde du week-end',
    total: <>360&nbsp;€</>,
    paid: <>120&nbsp;€</>,
    instalment: <>80&nbsp;€</>,
    legendPaid: 'Tout de suite',
    legendTillit: 'Avec TilliT, en trois fois',
    keepTitle: <>Faut-il abandonner son application de partage&nbsp;?</>,
    keepText:
      'Garde-la pour répartir les dépenses communes. TilliT prend le relais quand une somme doit être remboursée dans le temps.',
    postTitle: 'Réserve ta place',
    postText: 'On t’écrit dès l’ouverture de TilliT.',
    postBtn: 'Être prévenu du lancement',
  },
  en: {
    heroEyebrow: 'The difference',
    heroTitle: (
      <>
        Your split is done.
        <br />
        <span className={pageHeroStyles.accent}>The repayment may not&nbsp;be.</span>
      </>
    ),
    heroLead:
      'Tricount and Splitwise do their job very well: saying who owes what to whom after shared expenses. TilliT looks after a loan between friends and family, and its repayment over time.',
    splitTag: 'Expense splitting',
    splitAsk: 'Answers one question:',
    splitQuestion: 'Who owes what?',
    splitText:
      'Restaurant, holidays, groceries, flatshare: the app splits the shared expenses and shows each person’s balance.',
    tillitAsk: 'Answers the next one:',
    tillitQuestion: 'When and how to repay?',
    tillitText:
      'TilliT organises the loan: the amount, the dates, the instalments and the tracking of each repayment.',
    storyKicker: 'Example',
    storyTitle: 'The two work together',
    storyText1: (
      <>
        The weekend ends. The splitting app says Natan owes{' '}
        <mark className={styles.hlInk}>€360</mark>. He repays{' '}
        <mark className={styles.hlGreen}>€120</mark> straight away, and asks for time on the
        remaining <mark className={styles.hlViolet}>€240</mark>.
      </>
    ),
    storyText2:
      'TilliT organises that €240: in three instalments, on dates you agree together, with each repayment tracked.',
    barLabel: 'Weekend balance',
    total: '€360',
    paid: '€120',
    instalment: '€80',
    legendPaid: 'Straight away',
    legendTillit: 'With TilliT, in three instalments',
    keepTitle: 'Should you drop your splitting app?',
    keepText:
      'Keep it for splitting shared expenses. TilliT takes over when an amount has to be repaid over time.',
    postTitle: 'Save your place',
    postText: 'We’ll write to you as soon as TilliT opens.',
    postBtn: 'Get notified at launch',
  },
};

export default function Difference() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} lead={t.heroLead} />

      {/* --- Deux questions --- */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.container}>
          <div className={styles.split}>
            <article className={`${styles.col} ${styles.colBefore}`} data-reveal="left">
              <span className={styles.colIcon} aria-hidden="true">
                <i className="fa-solid fa-receipt" />
              </span>
              <span className={styles.tag}>{t.splitTag}</span>
              <p className={styles.ask}>{t.splitAsk}</p>
              <h2 className={styles.question}>{t.splitQuestion}</h2>
              <p className={styles.colText}>{t.splitText}</p>
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
              <p className={styles.ask}>{t.tillitAsk}</p>
              <h2 className={styles.question}>{t.tillitQuestion}</h2>
              <p className={styles.colText}>{t.tillitText}</p>
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
              {t.storyKicker}
            </span>
            <h2 className={styles.storyTitle}>{t.storyTitle}</h2>
            <p className={styles.storyText}>{t.storyText1}</p>
            <p className={styles.storyText}>{t.storyText2}</p>

            <div className={styles.bar} aria-hidden="true">
              <div className={styles.barHead}>
                <span>
                  <i className="fa-solid fa-receipt" /> {t.barLabel}
                </span>
                <b>{t.total}</b>
              </div>
              <div className={styles.barTrack}>
                <span className={styles.segPaid}>
                  <i className="fa-solid fa-check" /> {t.paid}
                </span>
                <span className={styles.segTillit}>
                  <span>{t.instalment}</span>
                  <span>{t.instalment}</span>
                  <span>{t.instalment}</span>
                </span>
              </div>
              <div className={styles.legend}>
                <span className={styles.legendPaid}>{t.legendPaid}</span>
                <span className={styles.legendTillit}>{t.legendTillit}</span>
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
              <h2 className={styles.keepTitle}>{t.keepTitle}</h2>
              <p className={styles.keepText}>{t.keepText}</p>
            </div>
          </div>

          <div className={styles.post} data-reveal>
            <h3>{t.postTitle}</h3>
            <p>{t.postText}</p>
            <Link to={l('/#waitlist')} className={styles.postBtn}>
              {t.postBtn}
              <i className="fa-solid fa-bell" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
