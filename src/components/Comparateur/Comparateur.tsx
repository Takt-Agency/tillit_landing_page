import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Comparateur.module.css';
import InfoTip from '../InfoTip/InfoTip';
import { useLang, useLocalize, type Lang } from '../../i18n';
import {
  CONSO_BRACKETS,
  FRANCECONNECT_FEE,
  MAX_AMOUNT,
  MIN_AMOUNT,
  NOTE_FREE_LIMIT,
  REVOLV_BRACKETS,
  bracketRate,
  eur,
  eurWhole,
  instalments,
  loanInterest,
  rateFmt,
  zenPrice,
} from '../../lib/loanPricing';

const DURATIONS = [1, 3, 6, 9, 12, 18, 24, 36, 48, 60];
const DIRECTION_SWITCH_MS = 3200;

type Offer = 'note' | 'zen';
type Signer = 'preteur' | 'emprunteur';

/** A round amount in an English sentence: €1,500 (the reference site's `eurCourt`). */
const eurShortEn = (v: number) => `€${eurWhole(v, 'en')}`;

/*
 * All the simulator copy, both languages. The French is the site's text as it
 * was; the English is the reference site's (/en/ and /en/pricing, and the
 * phrase table of its comparateur.js). Rates and amounts arrive pre-formatted.
 */
const COPY = {
  fr: {
    // Rate lines
    rateText: (rate: string, edited: boolean) =>
      `Taux : ${rate} %${edited ? ' (personnalisé)' : ''}`,
    change: 'Modifier',
    resetAria: (ref: string) => `Rétablir le taux de référence, ${ref} %`,
    reset: (ref: string) => `Rétablir ${ref} %`,
    annualRate: 'Taux annuel simulé',

    // Funds banner (home)
    fundsSr:
      'Le prêteur vire l’argent de sa banque à celle de son proche, et chaque remboursement fait le chemin inverse.',
    fundsText: 'TilliT ne détient jamais les fonds.',
    notLabel: 'Ce que TilliT n’est pas',
    notShort: 'TilliT n’est ni une banque, ni un organisme de crédit.',
    bank: 'Ta banque',
    transfer: 'Virement classique',
    whenLoan: 'Au moment du prêt',
    whenRepay: 'À chaque remboursement',
    friend: 'Ton proche',

    // Card head
    titleFull: 'Simule le coût de ton prêt',
    titleHome: 'Combien coûte ton prêt avec TilliT ?',
    precision: (
      <>
        TilliT organise le prêt.{' '}
        <b>L’argent circule directement entre vous, hors de l’application.</b> TilliT ne
        détient jamais les fonds.
      </>
    ),
    notFull:
      'TilliT n’est ni une banque, ni un organisme de crédit, ni un établissement de paiement, ni un service de recouvrement.',

    // Inputs
    amountLabel: 'Montant prêté',
    amountPlaceholder: 'Saisis un montant',
    durationLabel: 'Durée',
    durationPlaceholder: 'Choisis une durée',
    durationOption: (m: number) => (m === 60 ? '60 mois (5 ans)' : `${m} mois`),
    offerLabel: 'Offre',
    signLegend: 'Signature avec Zen',
    signer: (s: Signer) =>
      `${s === 'preteur' ? 'Le prêteur' : 'L’emprunteur'} signe avec FranceConnect (+1,50 €)`,
    signHelp:
      'Signature avec France Identité : incluse. Le supplément FranceConnect est payé uniquement par la personne qui choisit ce parcours pour signer.',

    // Messages
    outOfRange: (_amount: number) =>
      `Le montant doit être compris entre ${eur(MIN_AMOUNT)} et ${eur(MAX_AMOUNT)}.`,
    noteTooHigh: `Note couvre les prêts jusqu’à ${eur(NOTE_FREE_LIMIT)}. Au-delà, c’est Zen.`,
    waitBoth: 'Saisis un montant et choisis une durée.',
    waitAmount: 'Saisis un montant.',
    waitDuration: 'Choisis une durée.',
    announce: (remb: string, offer: string, tillit: number, conso: number, revo: number) =>
      `${remb}. TilliT ${offer} : ${eur(tillit)}. Crédit à la consommation simulé : ${eur(
        conso,
      )}. Crédit renouvelable simulé : ${eur(revo)}.`,

    // Results
    savingsTitle: (v: number) => (
      <>
        <b>{eur(v)}</b> d’économie estimée avec TilliT
      </>
    ),
    savingsSub: 'Par rapport au crédit renouvelable simulé',
    detailLink: 'Voir le détail des calculs →',
    remb: (monthly: number, months: number, _amount: number) =>
      `${eur(monthly)} par mois pendant ${months} mois`,
    roundLabel: 'Comment la mensualité est arrondie',
    roundText: (last: number) =>
      `Mensualité arrondie au centime inférieur. La dernière échéance absorbe la différence : ${eur(
        last,
      )}.`,
    legend: 'Comparaison des coûts',
    pill: '0 % d’intérêt',
    zenSub:
      'Paiement unique. Signature avec France Identité : incluse. Signature avec FranceConnect : +1,50 € par signataire qui l’utilise.',
    noteSub: `Sans frais, de ${eur(MIN_AMOUNT)} à ${eur(NOTE_FREE_LIMIT)} par prêt.`,
    consoName: 'Crédit à la consommation simulé',
    revoName: 'Crédit renouvelable simulé',

    // Full mode: detail of the calculation
    detailSummary: 'Détail des calculs',
    detailAmount: (amount: number, months: number, monthly: number, last: number) => (
      <>
        Montant prêté&nbsp;: <b>{eur(amount)}</b>, remboursé en {months}{' '}
        {months > 1 ? 'mensualités' : 'mensualité'} de <b>{eur(monthly)}</b>
        {last !== monthly && ` (dernière : ${eur(last)})`}, sans intérêts.
      </>
    ),
    detailZen: (zen: number, fcCount: number, fc: number) => (
      <>
        TilliT Zen&nbsp;: <b>{eur(zen)}</b>, prix de la grille pour ce montant, payé une seule
        fois.
        {fcCount > 0 &&
          ` Supplément FranceConnect : ${fcCount} × ${eur(FRANCECONNECT_FEE)} = ${eur(fc)}.`}
      </>
    ),
    detailNote: (
      <>
        TilliT Note&nbsp;: <b>{eur(0)}</b>, sans frais.
      </>
    ),
    detailCredit: (name: string, rate: number, months: number, monthly: number, cost: number) => (
      <>
        {name} à {rateFmt(rate)}&nbsp;% sur {months} mois&nbsp;: mensualité de {eur(monthly)},
        coût <b>{eur(cost)}</b>.
      </>
    ),
    detailSavings: (revo: number, zen: number | null, fc: number, savings: number) => (
      <>
        Économie estimée&nbsp;: {eur(revo)}
        {zen !== null && ` − ${eur(zen)}`}
        {fc > 0 && ` − ${eur(fc)}`} = <b>{eur(savings)}</b>.
      </>
    ),
    scheduleSummary: (months: number) => `Échéancier du remboursement · ${months} échéances`,
    colInstalment: 'Échéance',
    colAmount: 'Montant',
    colLeft: 'Reste à rembourser',
    tableNote: 'Sans intérêts. Le prix de Zen se paie à part des échéances.',

    // Closing sentence (home)
    closing1: 'On ne remplace pas la confiance.',
    closing2: (frame: ReactNode) => <>On lui donne {frame}.</>,
    frame: 'un cadre',
  },

  en: {
    rateText: (rate: string, edited: boolean) => `${edited ? 'Custom rate: ' : 'Rate: '}${rate}%`,
    change: 'Change',
    resetAria: (ref: string) => `Reset to the reference rate, ${ref}%`,
    reset: (ref: string) => `Reset to ${ref}%`,
    annualRate: 'Simulated annual rate',

    fundsSr:
      'The lender transfers the money from their bank to the other person’s, and each repayment takes the same road back.',
    fundsText: 'TilliT never holds the money.',
    notLabel: 'What TilliT is not',
    notShort: 'TilliT is not a bank, and not a credit provider.',
    bank: 'Your bank',
    transfer: 'Ordinary bank transfer',
    whenLoan: 'When the loan starts',
    whenRepay: 'With each repayment',
    friend: 'Your friend',

    titleFull: 'Work out the cost of your loan',
    titleHome: 'How much does your loan cost with TilliT?',
    precision: (
      <>
        TilliT organises the loan. <b>The money moves directly between you, outside the app.</b>{' '}
        TilliT never holds the money.
      </>
    ),
    notFull:
      'TilliT is not a bank, a credit provider, a payment institution or a debt collection service.',

    amountLabel: 'Amount lent',
    amountPlaceholder: 'Enter an amount',
    durationLabel: 'Over how long',
    durationPlaceholder: 'Choose how long',
    durationOption: (m: number) =>
      m === 60 ? '60 months (5 years)' : `${m} ${m > 1 ? 'months' : 'month'}`,
    offerLabel: 'Plan',
    signLegend: 'Signing with Zen',
    signer: (s: Signer) =>
      `${s === 'preteur' ? 'The lender' : 'The borrower'} signs with FranceConnect (+€1.50)`,
    signHelp:
      'Signing with France Identité: included. The FranceConnect extra is paid only by the person who chooses that route to sign.',

    outOfRange: (amount: number) =>
      MIN_AMOUNT > amount
        ? `The calculation starts at ${eurShortEn(MIN_AMOUNT)}.`
        : `TilliT organises loans up to ${eurShortEn(MAX_AMOUNT)}.`,
    noteTooHigh: `Note covers loans up to ${eurShortEn(NOTE_FREE_LIMIT)}. Above that, it’s Zen.`,
    waitBoth: 'Enter an amount and choose how long.',
    waitAmount: 'Enter an amount.',
    waitDuration: 'Choose how long.',
    announce: (remb: string, offer: string, tillit: number, conso: number, revo: number) =>
      `${remb}. TilliT ${offer}: ${eur(tillit, 'en')}. Simulated consumer credit: ${eur(
        conso,
        'en',
      )}. Simulated revolving credit: ${eur(revo, 'en')}.`,

    savingsTitle: (v: number) => (
      <>
        <b>{eur(v, 'en')}</b> estimated saving with TilliT
      </>
    ),
    savingsSub: 'Compared with the simulated revolving credit',
    detailLink: 'See how it’s worked out →',
    remb: (monthly: number, months: number, amount: number) =>
      months === 1
        ? `${eur(amount, 'en')} in one go`
        : `${eur(monthly, 'en')} a month for ${months} months`,
    roundLabel: 'How the monthly payment is rounded',
    roundText: (last: number) =>
      `Monthly payment rounded down to the cent. The last instalment makes up the difference: ${eur(
        last,
        'en',
      )}.`,
    legend: 'Cost comparison',
    pill: '0% interest',
    zenSub:
      'One payment. Signing with France Identité: included. Signing with FranceConnect: +€1.50 per signatory who uses it.',
    noteSub: `No fees, from ${eurShortEn(MIN_AMOUNT)} to ${eurShortEn(NOTE_FREE_LIMIT)} per loan.`,
    consoName: 'Simulated consumer credit',
    revoName: 'Simulated revolving credit',

    detailSummary: 'How it’s worked out',
    detailAmount: (amount: number, months: number, monthly: number, last: number) => (
      <>
        Amount lent: <b>{eur(amount, 'en')}</b>, repaid in {months}{' '}
        {months > 1 ? 'instalments' : 'instalment'} of <b>{eur(monthly, 'en')}</b>
        {last !== monthly && ` (last one: ${eur(last, 'en')})`}, with no interest.
      </>
    ),
    detailZen: (zen: number, fcCount: number, fc: number) => (
      <>
        TilliT Zen: <b>{eur(zen, 'en')}</b>, the grid price for this amount, paid once.
        {fcCount > 0 &&
          ` FranceConnect extra: ${fcCount} × ${eur(FRANCECONNECT_FEE, 'en')} = ${eur(fc, 'en')}.`}
      </>
    ),
    detailNote: (
      <>
        TilliT Note: <b>{eur(0, 'en')}</b>, no fees.
      </>
    ),
    detailCredit: (name: string, rate: number, months: number, monthly: number, cost: number) => (
      <>
        {name} at {rateFmt(rate, 'en')}% over {months} {months > 1 ? 'months' : 'month'}: monthly
        payment of {eur(monthly, 'en')}, cost <b>{eur(cost, 'en')}</b>.
      </>
    ),
    detailSavings: (revo: number, zen: number | null, fc: number, savings: number) => (
      <>
        Estimated saving: {eur(revo, 'en')}
        {zen !== null && ` − ${eur(zen, 'en')}`}
        {fc > 0 && ` − ${eur(fc, 'en')}`} = <b>{eur(savings, 'en')}</b>.
      </>
    ),
    scheduleSummary: (months: number) =>
      `Repayment schedule · ${months} ${months > 1 ? 'instalments' : 'instalment'}`,
    colInstalment: 'Instalment',
    colAmount: 'Amount',
    colLeft: 'Left to repay',
    tableNote: 'No interest. The price of Zen is paid separately from the instalments.',

    closing1: 'We don’t replace trust.',
    closing2: (frame: ReactNode) => <>We give it {frame}.</>,
    frame: 'a frame',
  },
} satisfies Record<Lang, unknown>;

function RateLine({
  n,
  name,
  cost,
  width,
  rate,
  refRate,
  onRate,
}: {
  n: number;
  name: string;
  cost: number;
  width: number;
  rate: number;
  refRate: number;
  onRate: (v: number | null) => void;
}) {
  const lang = useLang();
  const t = COPY[lang];
  const [editing, setEditing] = useState(false);
  const editorId = useId();
  const edited = rate !== refRate;

  return (
    <li className={styles.line}>
      <i className={styles.bar} style={{ width: `${width}%` }} aria-hidden="true" />
      <span className={styles.lineName}>
        <i className={styles.linePoint} aria-hidden="true">
          {n}
        </i>
        {name}
      </span>
      <b className={styles.linePrice}>{eur(cost, lang)}</b>
      <span className={styles.lineSub}>
        {t.rateText(rateFmt(rate, lang), edited)} ·{' '}
        <button
          type="button"
          className={styles.lineLink}
          aria-expanded={editing}
          aria-controls={editorId}
          onClick={() => setEditing((v) => !v)}
        >
          {t.change}
        </button>
        {edited && (
          <>
            {' '}
            <button
              type="button"
              className={styles.lineLink}
              aria-label={t.resetAria(rateFmt(refRate, lang))}
              onClick={() => onRate(null)}
            >
              {t.reset(rateFmt(refRate, lang))}
            </button>
          </>
        )}
      </span>
      {editing && (
        <span className={styles.editor} id={editorId}>
          <label>
            {t.annualRate}
            <span className={styles.editorInput}>
              <input
                type="number"
                min={0}
                max={50}
                step={0.01}
                inputMode="decimal"
                value={rate}
                autoFocus
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v)) onRate(Math.min(50, Math.max(0, v)));
                }}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              />
              <i aria-hidden="true">%</i>
            </span>
          </label>
          <button type="button" className={styles.editorOk} onClick={() => setEditing(false)}>
            OK
          </button>
        </span>
      )}
    </li>
  );
}

function FundsBanner() {
  const t = COPY[useLang()];
  const [toProche, setToProche] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAnimated(true);
    const id = window.setInterval(() => setToProche((v) => !v), DIRECTION_SWITCH_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`${styles.funds} ${animated ? styles.fundsAnimated : ''}`}>
      <p className="sr-only">{t.fundsSr}</p>
      <p className={styles.fundsText}>
        {t.fundsText}
        <InfoTip label={t.notLabel} text={t.notShort} />
      </p>
      <div className={styles.schema} aria-hidden="true">
        <span className={styles.node}>
          <span className={styles.nodeIcon}>
            <i className="fa-solid fa-building-columns" />
          </span>
          <b>{t.bank}</b>
        </span>
        <span className={styles.link}>
          <span className={styles.linkLabel}>{t.transfer}</span>
          <svg
            className={`${styles.arrow} ${
              animated ? (toProche ? styles.arrowRight : styles.arrowLeft) : ''
            }`}
            viewBox="0 0 120 16"
            fill="none"
          >
            <path d="M8 8h104" />
            <path className={styles.headRight} d="M106.5 3 112 8l-5.5 5" />
            <path className={styles.headLeft} d="M13.5 3 8 8l5.5 5" />
          </svg>
          <span className={styles.when}>
            {(!animated || toProche) && (
              <span className={styles.whenItem} key="pret">
                {t.whenLoan}
              </span>
            )}
            {(!animated || !toProche) && (
              <span className={styles.whenItem} key="remb">
                {t.whenRepay}
              </span>
            )}
          </span>
        </span>
        <span className={styles.node}>
          <span className={styles.nodeIcon}>
            <i className="fa-regular fa-user" />
          </span>
          <b>{t.friend}</b>
        </span>
      </div>
    </div>
  );
}

function initialState(full: boolean) {
  if (!full) return { amountStr: '', months: 6, offer: 'zen' as Offer };
  const params = new URLSearchParams(window.location.search);
  const montant = params.get('montant') ?? '';
  const duree = Number(params.get('duree'));
  const offre = params.get('offre');
  return {
    amountStr: /^\d+(\.\d+)?$/.test(montant) ? montant : '',
    months: DURATIONS.includes(duree) ? duree : 0,
    offer: (offre === 'zen' || offre === 'note' ? offre : 'note') as Offer,
  };
}

type CardProps = {
  full?: boolean;
  onAmountChange?: (amount: number | null) => void;
};

export function SimulatorCard({ full = false, onAmountChange }: CardProps) {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const [init] = useState(() => initialState(full));
  const [amountStr, setAmountStr] = useState(init.amountStr);
  const [months, setMonths] = useState(init.months);
  const [offer, setOffer] = useState<Offer>(init.offer);
  const [signers, setSigners] = useState<Signer[]>([]);
  const [consoOverride, setConsoOverride] = useState<number | null>(null);
  const [revoOverride, setRevoOverride] = useState<number | null>(null);

  const amount = Number(amountStr.replace(',', '.'));
  const hasInput = amountStr.trim() !== '' && Number.isFinite(amount);
  const inRange = hasInput && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  const noteTooHigh = inRange && offer === 'note' && amount > NOTE_FREE_LIMIT;
  const effectiveOffer: Offer = noteTooHigh ? 'zen' : offer;
  const isZen = effectiveOffer === 'zen';

  useEffect(() => {
    onAmountChange?.(inRange ? amount : null);
  }, [inRange, amount, onAmountChange]);

  const refConso = bracketRate(inRange ? amount : MIN_AMOUNT, CONSO_BRACKETS);
  const refRevo = bracketRate(inRange ? amount : MIN_AMOUNT, REVOLV_BRACKETS);
  const consoRate = consoOverride ?? refConso;
  const revoRate = revoOverride ?? refRevo;
  const fcCount = full && isZen ? signers.length : 0;

  const result = useMemo(() => {
    if (!inRange || !months) return null;
    const zen = isZen ? zenPrice(amount) : 0;
    const fc = fcCount * FRANCECONNECT_FEE;
    const tillit = zen + fc;
    const conso = loanInterest(amount, months, consoRate);
    const revo = loanInterest(amount, months, revoRate);
    const max = Math.max(tillit, conso, revo, 0.01);
    return {
      zen,
      fc,
      tillit,
      conso,
      revo,
      widths: [tillit, conso, revo].map((v) => Math.max(2, (v / max) * 100)),
      savings: revo - tillit,
      schedule: instalments(amount, months),
    };
  }, [inRange, isZen, amount, months, consoRate, revoRate, fcCount]);

  const info = !hasInput ? '' : !inRange ? t.outOfRange(amount) : noteTooHigh ? t.noteTooHigh : '';

  const waiting = !inRange && !months
    ? full
      ? t.waitBoth
      : t.waitAmount
    : !inRange
      ? t.waitAmount
      : t.waitDuration;

  const offerName = isZen ? 'Zen' : 'Note';
  const remb = result ? t.remb(result.schedule.monthly, months, amount) : '';
  const announce = result
    ? t.announce(remb, offerName, result.tillit, result.conso, result.revo)
    : '';

  const detailHref = l(
    `/tarifs?montant=${inRange ? amount : ''}&duree=${months}&offre=${effectiveOffer}#simulateur`,
  );
  const toggleSigner = (s: Signer) =>
    setSigners((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const TitleTag = full ? 'h3' : 'h2';

  return (
    <div className={styles.card} id={full ? 'simulateur' : undefined} data-reveal>
      <div className={styles.head}>
        <TitleTag className={styles.title} id={full ? undefined : 'comparateur-titre'}>
          {full ? t.titleFull : t.titleHome}
        </TitleTag>

        {full ? (
          <p className={styles.precision}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            <span>
              {t.precision}
              <InfoTip label={t.notLabel} text={t.notFull} />
            </span>
          </p>
        ) : (
          <FundsBanner />
        )}
      </div>

      <div className={styles.inputs}>
        <label className={styles.field}>
          <span className={styles.label}>{t.amountLabel}</span>
          <span className={styles.control}>
            <input
              type="number"
              placeholder={t.amountPlaceholder}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step="any"
              inputMode="decimal"
              autoComplete="off"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
            />
            <i aria-hidden="true">€</i>
          </span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.durationLabel}</span>
          <span className={`${styles.control} ${styles.selectControl}`}>
            <select value={months} onChange={(e) => setMonths(Number(e.target.value))} required>
              <option value={0} disabled>
                {t.durationPlaceholder}
              </option>
              {DURATIONS.map((m) => (
                <option key={m} value={m}>
                  {t.durationOption(m)}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          </span>
        </label>

        <fieldset className={styles.offers}>
          <legend className={styles.label}>{t.offerLabel}</legend>
          <div className={styles.segment}>
            {(['note', 'zen'] as Offer[]).map((o) => (
              <label key={o} className={effectiveOffer === o ? styles.segmentActive : ''}>
                <input
                  type="radio"
                  name={full ? 'simulateur-offre' : 'comparateur-offre'}
                  value={o}
                  checked={offer === o}
                  onChange={() => setOffer(o)}
                />
                <span>{o === 'note' ? 'Note' : 'Zen'}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {full && isZen && (
        <fieldset className={styles.signature}>
          <legend className={styles.label}>{t.signLegend}</legend>
          <div className={styles.checks}>
            {(['preteur', 'emprunteur'] as Signer[]).map((s) => (
              <label key={s} className={styles.check}>
                <input
                  type="checkbox"
                  checked={signers.includes(s)}
                  onChange={() => toggleSigner(s)}
                  aria-describedby="simulateur-signature-aide"
                />
                <span>{t.signer(s)}</span>
              </label>
            ))}
          </div>
          <p className={styles.help} id="simulateur-signature-aide">
            {t.signHelp}
          </p>
        </fieldset>
      )}

      <p className={styles.info} role="status" aria-live="polite">
        {info}
      </p>

      {!result && <p className={styles.waiting}>{waiting}</p>}
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {result && (
        <div className={styles.results}>
          <div className={styles.eco}>
            <span className={styles.ecoIcon} aria-hidden="true">
              <i className="fa-solid fa-piggy-bank" />
            </span>
            {result.savings > 0 && (
              <div className={styles.ecoGain}>
                <p className={styles.ecoTitle}>{t.savingsTitle(result.savings)}</p>
                <p className={styles.ecoSub}>
                  {t.savingsSub}
                  {' · '}
                  {full ? (
                    <a href="#detail-calculs">{t.detailLink}</a>
                  ) : (
                    <Link to={detailHref}>{t.detailLink}</Link>
                  )}
                </p>
              </div>
            )}
            <p className={styles.remb}>
              <i className="fa-regular fa-calendar" aria-hidden="true" />
              <span>{remb}</span>
              {result.schedule.last !== result.schedule.monthly && (
                <InfoTip label={t.roundLabel} text={t.roundText(result.schedule.last)} />
              )}
            </p>
          </div>

          <p className={styles.legend}>
            <i className="fa-solid fa-chart-column" aria-hidden="true" />
            {t.legend}
          </p>

          <ul className={styles.lines}>
            <li className={`${styles.line} ${styles.lineTillit}`}>
              <i
                className={styles.bar}
                style={{ width: `${result.widths[0]}%` }}
                aria-hidden="true"
              />
              <span className={styles.lineName}>
                <i className={styles.linePoint} aria-hidden="true">
                  <i className="fa-solid fa-star" />
                </i>
                TilliT {offerName}
                <span className={styles.linePill}>{t.pill}</span>
              </span>
              <b className={styles.linePrice}>{eur(result.tillit, lang)}</b>
              <span className={styles.lineSub}>{isZen ? t.zenSub : t.noteSub}</span>
            </li>
            <RateLine
              n={2}
              name={t.consoName}
              cost={result.conso}
              width={result.widths[1]}
              rate={consoRate}
              refRate={refConso}
              onRate={setConsoOverride}
            />
            <RateLine
              n={3}
              name={t.revoName}
              cost={result.revo}
              width={result.widths[2]}
              rate={revoRate}
              refRate={refRevo}
              onRate={setRevoOverride}
            />
          </ul>

          {full && (
            <>
              <details className={styles.more} id="detail-calculs" open>
                <summary>{t.detailSummary}</summary>
                <ul className={styles.detail}>
                  <li>
                    {t.detailAmount(
                      amount,
                      months,
                      result.schedule.monthly,
                      result.schedule.last,
                    )}
                  </li>
                  <li>{isZen ? t.detailZen(result.zen, fcCount, result.fc) : t.detailNote}</li>
                  <li>
                    {t.detailCredit(
                      t.consoName,
                      consoRate,
                      months,
                      (amount + result.conso) / months,
                      result.conso,
                    )}
                  </li>
                  <li>
                    {t.detailCredit(
                      t.revoName,
                      revoRate,
                      months,
                      (amount + result.revo) / months,
                      result.revo,
                    )}
                  </li>
                  <li>
                    {t.detailSavings(
                      result.revo,
                      isZen ? result.zen : null,
                      result.fc,
                      result.savings,
                    )}
                  </li>
                </ul>
              </details>

              <details className={styles.more}>
                <summary>{t.scheduleSummary(months)}</summary>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th scope="col">{t.colInstalment}</th>
                        <th scope="col">{t.colAmount}</th>
                        <th scope="col">{t.colLeft}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.rows.map((r) => (
                        <tr key={r.n}>
                          <td>{r.n}</td>
                          <td>{eur(r.amount, lang)}</td>
                          <td>{eur(r.remaining, lang)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={styles.tableNote}>{t.tableNote}</p>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Comparateur() {
  const t = COPY[useLang()];
  return (
    <section className={styles.section} id="comparateur" aria-labelledby="comparateur-titre">
      <div className={styles.inner}>
        <SimulatorCard />

        <p className={styles.closing} data-reveal>
          <span>{t.closing1}</span>{' '}
          <span>{t.closing2(<span className={styles.cadre}>{t.frame}</span>)}</span>
        </p>
      </div>
    </section>
  );
}
