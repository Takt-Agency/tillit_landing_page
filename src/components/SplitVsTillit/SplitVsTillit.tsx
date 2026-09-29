import styles from './SplitVsTillit.module.css';

const EXPENSES = [
  { label: 'Location', payer: 'Emma', amount: '390,00 €', color: '#8b63e8' },
  { label: 'Courses', payer: 'Martin', amount: '240,00 €', color: '#7cbfe6' },
  { label: 'Restaurant', payer: 'Thomas', amount: '240,00 €', color: '#4ec18a' },
  { label: 'Essence', payer: 'Julie', amount: '90,00 €', color: '#ef8068' },
];

type Step = {
  label: string;
  meta: string;
  amount?: string;
  tone: 'done' | 'notice' | 'next' | 'later';
};

const STEPS: Step[] = [
  { label: 'Échéance 1/3', meta: '5 juil. · Remboursée', amount: '50,00 €', tone: 'done' },
  { label: 'Report accepté', meta: 'Échéance 2/3 déplacée du 5 août au 5 septembre', tone: 'notice' },
  { label: 'Échéance 2/3', meta: '5 sept. · Prochaine', amount: '50,00 €', tone: 'next' },
  { label: 'Échéance 3/3', meta: '5 oct. · À venir', amount: '50,00 €', tone: 'later' },
];

const STEP_ICON: Record<Step['tone'], string> = {
  done: 'fa-check',
  notice: 'fa-rotate-right',
  next: 'fa-circle',
  later: 'fa-circle',
};

export default function SplitVsTillit() {
  return (
    <section
      className={styles.section}
      id="partage-depenses"
      aria-labelledby="partage-depenses-title"
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <h2 id="partage-depenses-title" className={styles.title}>
            <span className={styles.titleMark}>Tu</span> utilises déjà une
            application de partage de dépenses ?
          </h2>
          <p className={styles.lead}>
            Les applications de partage de dépenses organisent ce qu'on dépense
            ensemble.
          </p>
          <p className={styles.leadStrong}>TilliT organise ce qu'on se prête.</p>
        </header>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.cardSplit}`} data-reveal="left">
            <div className={styles.cardHead}>
              <span className={styles.cardIcon} aria-hidden="true">
                <i className="fa-solid fa-receipt" />
              </span>
              <p className={styles.eyebrow}>Application de partage de dépenses</p>
            </div>
            <h3 className={styles.cardTitle}>Qui doit combien à qui ?</h3>
            <p className={styles.examples}>Restaurant, vacances, courses, colocation…</p>
            <p className={styles.desc}>
              Elle répartit les dépenses communes entre plusieurs personnes.
            </p>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <p className={styles.panelTitle}>Week-end entre amis</p>
                <dl className={styles.stats}>
                  <div>
                    <dt>Participants</dt>
                    <dd>4</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>960,00 €</dd>
                  </div>
                </dl>
              </div>

              <ul className={styles.receipt}>
                {EXPENSES.map((e) => (
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
                      <p className={styles.rowMeta}>Payé par {e.payer}</p>
                    </div>
                    <p className={styles.rowAmount}>{e.amount}</p>
                  </li>
                ))}
              </ul>

              <p className={styles.result}>
                <strong>Julie</strong> doit <span className={styles.coral}>150 €</span> à{' '}
                <strong>Emma</strong>.
              </p>
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
              <p className={styles.eyebrow}>TilliT · Prêt entre proches</p>
            </div>
            <h3 className={styles.cardTitle}>Quand et comment rembourser ?</h3>
            <p className={styles.examples}>Coup de pouce, imprévu, solde de vacances…</p>
            <p className={styles.desc}>
              TilliT organise le montant prêté, les échéances et le suivi du
              remboursement.
            </p>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <p className={styles.panelTitle}>Week-end entre amis</p>
                <dl className={styles.stats}>
                  <div>
                    <dt>Prêté</dt>
                    <dd>150,00 €</dd>
                  </div>
                  <div>
                    <dt>Intérêts</dt>
                    <dd className={styles.coral}>0 %</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.progressBlock}>
                <p className={styles.progressText}>
                  <span className={styles.violet}>50 €</span> remboursés sur{' '}
                  <span className={styles.coral}>150 €</span> · Fin prévue le 5 octobre.
                </p>
                <div
                  className={styles.progress}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={150}
                  aria-valuenow={50}
                  aria-label="50 € remboursés sur 150 €"
                >
                  <span className={styles.progressFill} />
                </div>
              </div>

              <ol className={styles.timeline}>
                {STEPS.map((s) => (
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
