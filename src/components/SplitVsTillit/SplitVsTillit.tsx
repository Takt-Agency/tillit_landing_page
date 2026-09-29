import styles from './SplitVsTillit.module.css';
import { useLang } from '../../i18n';

type Expense = { label: string; payer: string; amount: string; color: string };

type Step = {
  label: string;
  meta: string;
  amount?: string;
  tone: 'done' | 'notice' | 'next' | 'later';
};

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
    progressLabel: '50 € remboursés sur 150 €',
    steps: [
      { label: 'Échéance 1/3', meta: '5 juil. · Remboursée', amount: '50,00 €', tone: 'done' },
      { label: 'Report accepté', meta: 'Échéance 2/3 déplacée du 5 août au 5 septembre', tone: 'notice' },
      { label: 'Échéance 2/3', meta: '5 sept. · Prochaine', amount: '50,00 €', tone: 'next' },
      { label: 'Échéance 3/3', meta: '5 oct. · À venir', amount: '50,00 €', tone: 'later' },
    ] as Step[],
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
    progressLabel: '€50 repaid of €150',
    steps: [
      { label: 'Instalment 1 of 3', meta: '5 Jul · Repaid', amount: '€50.00', tone: 'done' },
      { label: 'Postponement agreed', meta: 'Instalment 2 of 3 moved from 5 August to 5 September', tone: 'notice' },
      { label: 'Instalment 2 of 3', meta: '5 Sep · Next', amount: '€50.00', tone: 'next' },
      { label: 'Instalment 3 of 3', meta: '5 Oct · Upcoming', amount: '€50.00', tone: 'later' },
    ] as Step[],
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

              {lang === 'en' ? (
                <p className={styles.result}>
                  <strong>Julie</strong> owes <span className={styles.coral}>€150</span> to{' '}
                  <strong>Emma</strong>.
                </p>
              ) : (
                <p className={styles.result}>
                  <strong>Julie</strong> doit <span className={styles.coral}>150 €</span> à{' '}
                  <strong>Emma</strong>.
                </p>
              )}
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
                {lang === 'en' ? (
                  <p className={styles.progressText}>
                    <span className={styles.violet}>€50</span> repaid of{' '}
                    <span className={styles.coral}>€150</span> · Ends 5 October.
                  </p>
                ) : (
                  <p className={styles.progressText}>
                    <span className={styles.violet}>50 €</span> remboursés sur{' '}
                    <span className={styles.coral}>150 €</span> · Fin prévue le 5 octobre.
                  </p>
                )}
                <div
                  className={styles.progress}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={150}
                  aria-valuenow={50}
                  aria-label={t.progressLabel}
                >
                  <span className={styles.progressFill} />
                </div>
              </div>

              <ol className={styles.timeline}>
                {t.steps.map((s) => (
                  <li key={s.label} className={`${styles.step} ${styles[`step_${s.tone}`]}`}>
                    <span className={styles.dot} aria-hidden="true">
                      <i className={`fa-solid ${STEP_ICON[s.tone]}`} />
                    </span>
                    <div className={styles.rowText}>
                      <p className={styles.rowLabel}>{s.label}</p>
                      <p className={styles.stepMeta}>{s.meta}</p>
                    </div>
                    {s.amount && <p className={styles.rowAmount}>{s.amount}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
