import { useState, type KeyboardEvent } from 'react';
import styles from './SplitVsTillit.module.css';
import { useLang } from '../../i18n';

type Expense = { label: string; payer: string; amount: string; color: string };

type Step = {
  label: string;
  meta: string;
  amount?: string;
  tone: 'done' | 'notice' | 'next' | 'later';
  /** Total repaid once this instalment is paid (instalments only). */
  cumul?: number;
  /** Meta shown when the instalment is displayed as repaid. */
  metaRepaid?: string;
};

// The loan at rest: instalment 1 repaid, 50 € of 150 €.
const REST = 50;
const TOTAL = 150;

const COPY = {
  fr: {
    leadStrong: "TilliT organise ce qu'on se prête.",
    lead: "Les applications de partage de dépenses organisent ce qu'on dépense ensemble.",
    splitEyebrow: 'Application de partage de dépenses',
    splitTitle: 'Qui doit combien à qui ?',
    splitExamples: 'Restaurant, vacances, courses, colocation…',
    splitDesc: 'Elle répartit les dépenses communes entre plusieurs personnes.',
    panelTitle: 'Week-end entre amis',
    participants: 'Participants',
    total: 'Total',
    splitTotal: '960,00 €',
    paidBy: 'Payé par',
    expenses: [
      { label: 'Location', payer: 'Emma', amount: '390,00 €', color: '#8b63e8' },
      { label: 'Courses', payer: 'Martin', amount: '240,00 €', color: '#7cbfe6' },
      { label: 'Restaurant', payer: 'Thomas', amount: '240,00 €', color: '#4ec18a' },
      { label: 'Essence', payer: 'Julie', amount: '90,00 €', color: '#ef8068' },
    ] as Expense[],
    tillitEyebrow: 'TilliT · Prêt entre proches',
    tillitTitle: 'Quand et comment rembourser ?',
    tillitExamples: 'Coup de pouce, imprévu, solde de vacances…',
    tillitDesc:
      'TilliT organise le montant prêté, les échéances et le suivi du remboursement.',
    lent: 'Prêté',
    lentAmount: '150,00 €',
    interest: 'Intérêts',
    interestValue: '0 %',
    steps: [
      { label: 'Échéance 1/3', meta: '5 juil. · Remboursée', amount: '50,00 €', tone: 'done', cumul: 50 },
      { label: 'Report accepté', meta: 'Échéance 2/3 déplacée du 5 août au 5 septembre', tone: 'notice' },
      { label: 'Échéance 2/3', meta: '5 sept. · Prochaine', metaRepaid: '5 sept. · Remboursée', amount: '50,00 €', tone: 'next', cumul: 100 },
      { label: 'Échéance 3/3', meta: '5 oct. · À venir', metaRepaid: '5 oct. · Remboursée', amount: '50,00 €', tone: 'later', cumul: 150 },
    ] as Step[],
    money: (v: number) => `${v} €`,
    repaidOf: 'remboursés sur',
    endsOn: 'Fin prévue le 5 octobre.',
    loanRepaid: 'Prêt remboursé.',
    hint: 'Touche une échéance pour voir le remboursement avancer.',
  },
  en: {
    leadStrong: 'TilliT organises what you lend each other.',
    lead: 'Expense-splitting apps organise what you spend together.',
    splitEyebrow: 'Expense-splitting app',
    splitTitle: 'Who owes what to whom?',
    splitExamples: 'Dinner, holidays, groceries, flatshare…',
    splitDesc: 'It splits shared expenses between several people.',
    panelTitle: 'Weekend with friends',
    participants: 'People',
    total: 'Total',
    splitTotal: '€960.00',
    paidBy: 'Paid by',
    expenses: [
      { label: 'The place', payer: 'Emma', amount: '€390.00', color: '#8b63e8' },
      { label: 'Groceries', payer: 'Martin', amount: '€240.00', color: '#7cbfe6' },
      { label: 'Restaurant', payer: 'Thomas', amount: '€240.00', color: '#4ec18a' },
      { label: 'Petrol', payer: 'Julie', amount: '€90.00', color: '#ef8068' },
    ] as Expense[],
    tillitEyebrow: 'TilliT · a loan between friends and family',
    tillitTitle: 'When and how to repay?',
    tillitExamples: 'A helping hand, an unexpected bill, the rest of a holiday…',
    tillitDesc:
      'TilliT organises the amount lent, the instalments and how repayment is tracked.',
    lent: 'Lent',
    lentAmount: '€150.00',
    interest: 'Interest',
    interestValue: '0%',
    steps: [
      { label: 'Instalment 1 of 3', meta: '5 Jul · Repaid', amount: '€50.00', tone: 'done', cumul: 50 },
      { label: 'Postponement agreed', meta: 'Instalment 2 of 3 moved from 5 August to 5 September', tone: 'notice' },
      { label: 'Instalment 2 of 3', meta: '5 Sep · Next', metaRepaid: '5 Sep · Repaid', amount: '€50.00', tone: 'next', cumul: 100 },
      { label: 'Instalment 3 of 3', meta: '5 Oct · Upcoming', metaRepaid: '5 Oct · Repaid', amount: '€50.00', tone: 'later', cumul: 150 },
    ] as Step[],
    money: (v: number) => `€${v}`,
    repaidOf: 'repaid of',
    endsOn: 'Ends 5 October.',
    loanRepaid: 'Loan repaid.',
    hint: 'Tap an instalment to watch the repayment move forward.',
  },
};

const STEP_ICON: Record<Step['tone'], string> = {
  done: 'fa-check',
  notice: 'fa-rotate-right',
  next: 'fa-circle',
  later: 'fa-circle',
};

export default function SplitVsTillit() {
  const lang = useLang();
  const t = COPY[lang];
  const payerColor = (name: string) => t.expenses.find((e) => e.payer === name)?.color;

  // Pointing at an instalment shows the loan at that date (hover, focus or tap);
  // a click keeps it selected, which is what a finger needs on mobile.
  const [hovered, setHovered] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const active = hovered ?? picked;
  const cumul = active !== null ? (t.steps[active].cumul ?? REST) : REST;
  const full = cumul === TOTAL;
  const toggle = (i: number) => setPicked((p) => (p === i ? null : i));
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(i);
    }
  };

  return (
    <section
      className={styles.section}
      id="positionnement"
      aria-labelledby="partage-depenses-title"
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="partage-depenses-title" className={styles.title}>
            {lang === 'en' ? (
              <>
                <span className={styles.titleMark}>Already</span> using an
                expense-splitting app?
              </>
            ) : (
              <>
                <span className={styles.titleMark}>Tu</span> utilises déjà une
                application de partage de dépenses ?
              </>
            )}
          </h2>
          <p className={styles.lead}>{t.lead}</p>
          <p className={styles.leadStrong}>{t.leadStrong}</p>
        </header>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.cardSplit}`} data-reveal="left">
            <div className={styles.cardHead}>
              <span className={styles.cardIcon} aria-hidden="true">
                <i className="fa-solid fa-receipt" />
              </span>
              <p className={styles.eyebrow}>{t.splitEyebrow}</p>
            </div>
            <h3 className={styles.cardTitle}>{t.splitTitle}</h3>

            {/* The answer to the title, right under it: what the app ends up telling you */}
            <p className={styles.answer}>
              <span className={styles.answerAvatar} style={{ background: payerColor('Julie') }} aria-hidden="true">
                J
              </span>
              {lang === 'en' ? (
                <span className={styles.answerText}>
                  <strong>Julie</strong> owes <span className={styles.answerAmount}>€150</span> to{' '}
                  <strong>Emma</strong>.
                </span>
              ) : (
                <span className={styles.answerText}>
                  <strong>Julie</strong> doit <span className={styles.answerAmount}>150&nbsp;€</span> à{' '}
                  <strong>Emma</strong>.
                </span>
              )}
              <span className={styles.answerAvatar} style={{ background: payerColor('Emma') }} aria-hidden="true">
                E
              </span>
            </p>

            <p className={styles.examples}>{t.splitExamples}</p>
            <p className={styles.desc}>{t.splitDesc}</p>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <p className={styles.panelTitle}>{t.panelTitle}</p>
                <dl className={styles.stats}>
                  <div>
                    <dt>{t.participants}</dt>
                    <dd>4</dd>
                  </div>
                  <div>
                    <dt>{t.total}</dt>
                    <dd>{t.splitTotal}</dd>
                  </div>
                </dl>
              </div>

              <ul className={styles.receipt}>
                {t.expenses.map((e) => (
                  <li key={e.label} className={styles.receiptRow}>
                    <span
                      className={styles.avatar}
                      style={{ background: e.color }}
                      aria-hidden="true"
                    >
                      {e.payer[0]}
                    </span>
                    <div className={styles.rowText}>
                      <p className={styles.rowLabel}>{e.label}</p>
                      <p className={styles.rowMeta}>
                        {t.paidBy} {e.payer}
                      </p>
                    </div>
                    <p className={styles.rowAmount}>{e.amount}</p>
                  </li>
                ))}
              </ul>

            </div>
          </article>

          <span className={styles.vs} aria-hidden="true">
            VS
          </span>

          <article
            className={`${styles.card} ${styles.cardTillit}`}
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            <div className={styles.cardHead}>
              <span className={styles.cardIcon} aria-hidden="true">
                <i className="fa-solid fa-hand-holding-heart" />
              </span>
              <p className={styles.eyebrow}>{t.tillitEyebrow}</p>
            </div>
            <h3 className={styles.cardTitle}>{t.tillitTitle}</h3>
            <p className={styles.examples}>{t.tillitExamples}</p>
            <p className={styles.desc}>{t.tillitDesc}</p>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <p className={styles.panelTitle}>{t.panelTitle}</p>
                <dl className={styles.stats}>
                  <div>
                    <dt>{t.lent}</dt>
                    <dd>{t.lentAmount}</dd>
                  </div>
                  <div>
                    <dt>{t.interest}</dt>
                    <dd className={styles.coral}>{t.interestValue}</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.progressBlock}>
                <p className={styles.progressText} aria-live="polite">
                  <span className={full ? styles.green : styles.violet}>{t.money(cumul)}</span>{' '}
                  {t.repaidOf} <span className={styles.coral}>{t.money(TOTAL)}</span> ·{' '}
                  {full ? t.loanRepaid : t.endsOn}
                </p>
                <div
                  className={styles.progress}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={150}
                  aria-valuenow={cumul}
                  aria-label={`${t.money(cumul)} ${t.repaidOf} ${t.money(TOTAL)}`}
                >
                  <span
                    className={`${styles.progressFill} ${full ? styles.progressFull : ''}`}
                    style={{ width: `${(cumul / TOTAL) * 100}%` }}
                  />
                </div>
              </div>

              <ol className={styles.timeline}>
                {t.steps.map((s, i) => {
                  const interactive = s.cumul !== undefined;
                  const repaid = interactive && s.cumul! <= cumul;
                  const tone = repaid ? 'done' : s.tone;
                  const meta = repaid && s.metaRepaid ? s.metaRepaid : s.meta;
                  return (
                    <li
                      key={s.label}
                      className={`${styles.step} ${styles[`step_${tone}`]} ${
                        interactive ? styles.stepInteractive : ''
                      } ${active === i ? styles.stepActive : ''}`}
                      {...(interactive && {
                        role: 'button',
                        tabIndex: 0,
                        'aria-pressed': picked === i,
                        onClick: () => toggle(i),
                        onKeyDown: (e: KeyboardEvent) => onKey(e, i),
                        onMouseEnter: () => setHovered(i),
                        onMouseLeave: () => setHovered(null),
                      })}
                    >
                      <span className={styles.dot} aria-hidden="true">
                        <i className={`fa-solid ${STEP_ICON[tone]}`} />
                      </span>
                      <div className={styles.rowText}>
                        <p className={styles.rowLabel}>{s.label}</p>
                        <p className={styles.stepMeta}>{meta}</p>
                      </div>
                      {s.amount && <p className={styles.rowAmount}>{s.amount}</p>}
                    </li>
                  );
                })}
              </ol>
              <p className={styles.hint}>
                <i className="fa-solid fa-hand-pointer" aria-hidden="true" />
                {t.hint}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
