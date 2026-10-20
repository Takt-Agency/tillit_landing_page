import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import styles from './LoanSimulator.module.css';
import { useLang, useLocalize, type Lang } from '../../i18n';
import {
  CONSO_BRACKETS,
  MAX_AMOUNT,
  MIN_AMOUNT,
  NOTE_FREE_LIMIT,
  RATES_QUARTER,
  REVOLV_BRACKETS,
  bracketRate,
  eur,
  loanInterest,
  rateFmt,
  zenPrice,
} from '../../lib/loanPricing';

const easeOut = [0.2, 0.9, 0.3, 1] as const;
const DURATIONS = [3, 6, 9, 12, 18, 24, 36, 48, 60];
const DEFAULT_MONTHS = 6;

type RowKey = 'note' | 'zen' | 'conso' | 'revolv';

const COPY = {
  fr: {
    amountLabel: `Montant prêté · de ${eur(MIN_AMOUNT).replace(',00', '')} à ${eur(MAX_AMOUNT).replace(',00', '')}`,
    placeholder: 'Saisis un montant',
    durationLabel: 'Remboursé en',
    months: (m: number) => `${m} mois`,
    helpEmpty: 'Saisis un montant pour comparer.',
    helpMonthly: (v: string) => (
      <>
        Soit <b>{v}</b> par mois, sans intérêt.
      </>
    ),
    outOfRange: `Le montant doit être compris entre ${eur(MIN_AMOUNT)} et ${eur(MAX_AMOUNT)}.`,
    savingsLabel: 'Avec TilliT, tu économises',
    savingsHint: 'face au crédit renouvelable',
    resultsTitle: 'Comparatif',
    resultsHint: 'Ce que coûte le prêt, en plus de la somme prêtée',
    noteName: 'TilliT Note',
    noteDesc: 'Sans frais, de 100 à 1 500 €',
    noteBlocked: 'Au-delà de 1 500 €, Zen est obligatoire',
    zenName: 'TilliT Zen',
    zenDesc: 'Paiement unique, 0 % d’intérêt',
    consoName: 'Crédit à la consommation',
    consoDesc: (r: string, m: number) => `Taux moyen ${r} % · ${m} mois`,
    revolvName: 'Crédit renouvelable',
    revolvDesc: (r: string, m: number) => `Plafond légal ${r} % · ${m} mois`,
    best: 'Le moins cher',
    detail: 'Voir le détail sur la page Tarifs',
    ratesTitle: 'Ajuste les taux du marché',
    reset: 'Rétablir la référence',
    rateHint:
      'Si tu as une offre réelle sous les yeux, remplace le taux par son TAEG.',
    explain: (amount: string | null, conso: string, revolv: string): ReactNode => (
      <>
        Le prix de TilliT Zen est exact&nbsp;: c’est la grille ci-dessous, un paiement unique
        qui ne dépend pas de la durée. Les deux crédits sont calculés avec les taux du marché,
        qui dépendent du montant emprunté.
        {amount && (
          <>
            {' '}
            Pour <b>{amount}</b>, le taux moyen constaté est de <b>{conso}&nbsp;%</b>, et le
            plafond légal de <b>{revolv}&nbsp;%</b>.
          </>
        )}
      </>
    ),
    source: (
      <>
        <b>Source&nbsp;:</b> Banque de France, taux effectifs moyens et seuils de l’usure du{' '}
        {RATES_QUARTER.quarter}
        <sup>{RATES_QUARTER.quarter === 1 ? 'er' : 'e'}</sup> trimestre {RATES_QUARTER.year}.
        Ces valeurs sont révisées tous les trois mois.
      </>
    ),
    summary: (zen: string, conso: string, revolv: string) =>
      `TilliT Zen : ${zen}. Crédit à la consommation : ${conso}. Crédit renouvelable : ${revolv}.`,
  },
  en: {
    amountLabel: `Amount lent · from €${MIN_AMOUNT} to €${MAX_AMOUNT.toLocaleString('en-GB')}`,
    placeholder: 'Enter an amount',
    durationLabel: 'Repaid over',
    months: (m: number) => `${m} months`,
    helpEmpty: 'Enter an amount to compare.',
    helpMonthly: (v: string) => (
      <>
        That’s <b>{v}</b> a month, with no interest.
      </>
    ),
    outOfRange: `The amount must be between €${MIN_AMOUNT} and €${MAX_AMOUNT.toLocaleString('en-GB')}.`,
    savingsLabel: 'With TilliT, you save',
    savingsHint: 'compared with revolving credit',
    resultsTitle: 'Comparison',
    resultsHint: 'What the loan costs on top of the amount lent',
    noteName: 'TilliT Note',
    noteDesc: 'No fees, from €100 to €1,500',
    noteBlocked: 'Above €1,500, Zen is required',
    zenName: 'TilliT Zen',
    zenDesc: 'Paid once, 0% interest',
    consoName: 'Consumer credit',
    consoDesc: (r: string, m: number) => `Average rate ${r}% · ${m} months`,
    revolvName: 'Revolving credit',
    revolvDesc: (r: string, m: number) => `Legal ceiling ${r}% · ${m} months`,
    best: 'Cheapest',
    detail: 'See the details on the pricing page',
    ratesTitle: 'Adjust the market rates',
    reset: 'Reset to the reference',
    rateHint: 'If you have a real offer in front of you, replace the rate with its APR.',
    explain: (amount: string | null, conso: string, revolv: string): ReactNode => (
      <>
        The TilliT Zen price is exact: it is the grid below, paid once, whatever the length of
        the loan. Both credits are calculated with market rates, which depend on the amount
        borrowed.
        {amount && (
          <>
            {' '}
            For <b>{amount}</b>, the average rate recorded is <b>{conso}%</b>, and the legal
            ceiling <b>{revolv}%</b>.
          </>
        )}
      </>
    ),
    source: (
      <>
        <b>Source:</b> Banque de France, average effective rates and usury ceilings for the{' '}
        {['', 'first', 'second', 'third', 'fourth'][RATES_QUARTER.quarter]} quarter of{' '}
        {RATES_QUARTER.year}. These values are revised every three months.
      </>
    ),
    summary: (zen: string, conso: string, revolv: string) =>
      `TilliT Zen: ${zen}. Consumer credit: ${conso}. Revolving credit: ${revolv}.`,
  },
} satisfies Record<Lang, unknown>;

/** Full mode (pricing page) reads the amount and duration sent by the home simulator. */
function initialState(full: boolean) {
  if (!full) return { amountStr: '', months: DEFAULT_MONTHS };
  const params = new URLSearchParams(window.location.search);
  const montant = params.get('montant') ?? '';
  const duree = Number(params.get('duree'));
  return {
    amountStr: /^\d+$/.test(montant) ? montant : '',
    months: DURATIONS.includes(duree) ? duree : DEFAULT_MONTHS,
  };
}

type Props = {
  /** 'full' on the pricing page (market rates panel + source), 'mini' on the home page. */
  variant?: 'full' | 'mini';
  /** Amount in range, or null: lets the pricing grid highlight the matching tier. */
  onAmountChange?: (amount: number | null) => void;
};

export default function LoanSimulator({ variant = 'mini', onAmountChange }: Props) {
  const full = variant === 'full';
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const money = (v: number) => eur(v, lang);
  const rate = (v: number) => rateFmt(v, lang);

  const [init] = useState(() => initialState(full));
  const [amountStr, setAmountStr] = useState(init.amountStr);
  const [months, setMonths] = useState(init.months);
  const [ratesEdited, setRatesEdited] = useState(false);
  const [consoRate, setConsoRate] = useState(CONSO_BRACKETS[0].rate);
  const [revolvRate, setRevolvRate] = useState(REVOLV_BRACKETS[0].rate);

  const amount = useMemo(() => {
    const n = Number(amountStr.replace(/[^0-9]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [amountStr]);
  const hasAmount = amount > 0;
  const inRange = amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;

  // Reference rates follow the amount (Banque de France brackets) until edited by hand.
  const refConso = bracketRate(inRange ? amount : MIN_AMOUNT, CONSO_BRACKETS);
  const refRevolv = bracketRate(inRange ? amount : MIN_AMOUNT, REVOLV_BRACKETS);
  useEffect(() => {
    if (!ratesEdited) {
      setConsoRate(refConso);
      setRevolvRate(refRevolv);
    }
  }, [refConso, refRevolv, ratesEdited]);

  useEffect(() => {
    onAmountChange?.(inRange ? amount : null);
  }, [inRange, amount, onAmountChange]);

  const noteOk = amount <= NOTE_FREE_LIMIT;
  const zen = inRange ? zenPrice(amount) : 0;
  const conso = inRange ? loanInterest(amount, months, consoRate) : 0;
  const revolv = inRange ? loanInterest(amount, months, revolvRate) : 0;
  const tillitCost = noteOk ? 0 : zen;
  const savings = Math.max(0, Math.max(conso, revolv) - tillitCost);

  type Row = { key: RowKey; name: string; desc: string; value: number | null; tillit?: boolean };
  const rows: Row[] = [
    {
      key: 'note',
      name: t.noteName,
      desc: noteOk ? t.noteDesc : t.noteBlocked,
      value: noteOk ? 0 : null,
      tillit: true,
    },
    { key: 'zen', name: t.zenName, desc: t.zenDesc, value: zen, tillit: true },
    { key: 'conso', name: t.consoName, desc: t.consoDesc(rate(consoRate), months), value: conso },
    { key: 'revolv', name: t.revolvName, desc: t.revolvDesc(rate(revolvRate), months), value: revolv },
  ];
  // Cheapest first; a plan that isn't available (Note above 1 500 €) goes last.
  const ordered = inRange
    ? [...rows].sort((a, b) => (a.value ?? Infinity) - (b.value ?? Infinity))
    : rows;
  const cheapest = inRange ? ordered[0].key : null;
  const maxVal = Math.max(...rows.map((r) => r.value ?? 0), 0);
  const widthFor = (v: number | null) =>
    !inRange || maxVal <= 0 || v === null ? 100 : Math.round(55 + (v / maxVal) * 45);

  const resetRates = () => {
    setConsoRate(refConso);
    setRevolvRate(refRevolv);
    setRatesEdited(false);
  };

  const detailHref = l(
    `/tarifs?${inRange ? `montant=${amount}&` : ''}duree=${months}#simulateur`,
  );

  return (
    <div className={`${styles.card} ${full ? '' : styles.cardMini}`} id={full ? 'simulateur' : undefined}>
      <div className={styles.inputsRow}>
        <div className={styles.field}>
          <label htmlFor={`sim-amount-${variant}`} className={styles.label}>
            {t.amountLabel}
          </label>
          <div className={styles.inputWrap}>
            <input
              id={`sim-amount-${variant}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder={t.placeholder}
              className={styles.input}
              aria-invalid={hasAmount && !inRange ? true : undefined}
            />
            <span className={styles.inputSuffix} aria-hidden="true">
              €
            </span>
          </div>
          <p className={`${styles.help} ${hasAmount && !inRange ? styles.helpError : ''}`}>
            {!hasAmount ? t.helpEmpty : !inRange ? t.outOfRange : t.helpMonthly(money(amount / months))}
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor={`sim-duration-${variant}`} className={styles.label}>
            {t.durationLabel}
          </label>
          <div className={styles.selectWrap}>
            <select
              id={`sim-duration-${variant}`}
              className={styles.select}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            >
              {DURATIONS.map((m) => (
                <option key={m} value={m}>
                  {t.months(m)}
                </option>
              ))}
            </select>
            <i className={`fa-solid fa-chevron-down ${styles.selectArrow}`} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <AnimatePresence mode="wait">
        {inRange && savings > 0 && (
          <motion.div
            key="savings"
            className={styles.savings}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <span className={styles.savingsIcon} aria-hidden="true">
              <i className="fa-solid fa-piggy-bank" />
            </span>
            <div>
              <p className={styles.savingsLabel}>{t.savingsLabel}</p>
              <p className={styles.savingsAmount}>
                {money(savings)}
                <span className={styles.savingsHint}> {t.savingsHint}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.resultsHeader}>
        <span className={styles.resultsTitle}>
          <i className="fa-solid fa-chart-column" aria-hidden="true" /> {t.resultsTitle}
        </span>
        <span className={styles.resultsHint}>{t.resultsHint}</span>
      </div>

      <p className="sr-only" aria-live="polite">
        {inRange ? t.summary(money(zen), money(conso), money(revolv)) : ''}
      </p>

      <ul className={styles.results}>
        {ordered.map((r, idx) => {
          const blocked = r.value === null;
          return (
            <motion.li
              key={r.key}
              layout
              className={`${styles.resultLine} ${blocked ? styles.resultBlocked : ''}`}
              transition={{ layout: { duration: 0.5, ease: easeOut } }}
            >
              <motion.div
                className={`${styles.result} ${r.key === 'note' ? styles.resultTillit : ''} ${
                  r.key === 'zen' ? styles.resultZen : ''
                }`}
                animate={{ width: `${widthFor(r.value)}%` }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <span
                  className={`${styles.resultBadge} ${r.tillit ? '' : styles.badgeMuted}`}
                  aria-hidden="true"
                >
                  {r.key === 'zen' ? (
                    <i className="fa-solid fa-star" />
                  ) : r.key === 'note' ? (
                    <i className="fa-solid fa-feather" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <div className={styles.resultBody}>
                  <span className={styles.resultName}>
                    {r.name}
                    {cheapest === r.key && (
                      <span className={styles.bestBadge}>
                        <i className="fa-solid fa-crown" aria-hidden="true" /> {t.best}
                      </span>
                    )}
                  </span>
                  <span className={`${styles.resultDesc} ${r.tillit ? '' : styles.descCoral}`}>
                    {r.desc}
                  </span>
                </div>
              </motion.div>
              <span className={`${styles.resultAmount} ${r.tillit ? styles.resultAmountTillit : ''}`}>
                {blocked ? '—' : money(r.value ?? 0)}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {!full && (
        <Link to={detailHref} className={styles.detailLink}>
          {t.detail}
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      )}

      {full && (
        <>
          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.ratesPanel}>
            <div className={styles.ratesHeader}>
              <span className={styles.ratesTitle}>
                <i className="fa-solid fa-sliders" aria-hidden="true" /> {t.ratesTitle}
              </span>
              {ratesEdited && (
                <button type="button" className={styles.resetBtn} onClick={resetRates}>
                  <i className="fa-solid fa-rotate-left" aria-hidden="true" /> {t.reset}
                </button>
              )}
            </div>

            <div className={styles.ratesGrid}>
              <label className={styles.rateField}>
                <span className={styles.rateLabel}>{t.consoName}</span>
                <span className={styles.rateInputWrap}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={consoRate}
                    onChange={(e) => {
                      setConsoRate(Math.max(0, Number(e.target.value)));
                      setRatesEdited(true);
                    }}
                    className={styles.rateInput}
                  />
                  <span className={styles.ratePct}>%</span>
                </span>
              </label>
              <label className={styles.rateField}>
                <span className={styles.rateLabel}>{t.revolvName}</span>
                <span className={styles.rateInputWrap}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={revolvRate}
                    onChange={(e) => {
                      setRevolvRate(Math.max(0, Number(e.target.value)));
                      setRatesEdited(true);
                    }}
                    className={styles.rateInput}
                  />
                  <span className={styles.ratePct}>%</span>
                </span>
              </label>
            </div>

            <p className={styles.explain}>
              {t.explain(inRange ? money(amount) : null, rate(refConso), rate(refRevolv))}{' '}
              {t.rateHint}
            </p>
          </div>

          <p className={styles.source}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            <span>{t.source}</span>
          </p>
        </>
      )}
    </div>
  );
}
