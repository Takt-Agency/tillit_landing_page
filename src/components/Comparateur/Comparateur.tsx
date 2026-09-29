import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Comparateur.module.css';
import InfoTip from '../InfoTip/InfoTip';
import {
  CONSO_BRACKETS,
  FRANCECONNECT_FEE,
  MAX_AMOUNT,
  MIN_AMOUNT,
  NOTE_FREE_LIMIT,
  REVOLV_BRACKETS,
  bracketRate,
  eur,
  instalments,
  loanInterest,
  rateFmt,
  zenPrice,
} from '../../lib/loanPricing';

const DURATIONS = [1, 3, 6, 9, 12, 18, 24, 36, 48, 60];
const DIRECTION_SWITCH_MS = 3200;

type Offer = 'note' | 'zen';
type Signer = 'preteur' | 'emprunteur';

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
      <b className={styles.linePrice}>{eur(cost)}</b>
      <span className={styles.lineSub}>
        Taux : {rateFmt(rate)} %{edited ? ' (personnalisé)' : ''} ·{' '}
        <button
          type="button"
          className={styles.lineLink}
          aria-expanded={editing}
          aria-controls={editorId}
          onClick={() => setEditing((v) => !v)}
        >
          Modifier
        </button>
        {edited && (
          <>
            {' '}
            <button
              type="button"
              className={styles.lineLink}
              aria-label={`Rétablir le taux de référence, ${rateFmt(refRate)} %`}
              onClick={() => onRate(null)}
            >
              Rétablir {rateFmt(refRate)} %
            </button>
          </>
        )}
      </span>
      {editing && (
        <span className={styles.editor} id={editorId}>
          <label>
            Taux annuel simulé
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
      <p className="sr-only">
        Le prêteur vire l’argent de sa banque à celle de son proche, et chaque remboursement
        fait le chemin inverse.
      </p>
      <p className={styles.fundsText}>
        TilliT ne détient jamais les fonds.
        <InfoTip
          label="Ce que TilliT n’est pas"
          text="TilliT n’est ni une banque, ni un organisme de crédit."
        />
      </p>
      <div className={styles.schema} aria-hidden="true">
        <span className={styles.node}>
          <span className={styles.nodeIcon}>
            <i className="fa-solid fa-building-columns" />
          </span>
          <b>Ta banque</b>
        </span>
        <span className={styles.link}>
          <span className={styles.linkLabel}>Virement classique</span>
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
                Au moment du prêt
              </span>
            )}
            {(!animated || !toProche) && (
              <span className={styles.whenItem} key="remb">
                À chaque remboursement
              </span>
            )}
          </span>
        </span>
        <span className={styles.node}>
          <span className={styles.nodeIcon}>
            <i className="fa-regular fa-user" />
          </span>
          <b>Ton proche</b>
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

  const info = !hasInput
    ? ''
    : !inRange
      ? `Le montant doit être compris entre ${eur(MIN_AMOUNT)} et ${eur(MAX_AMOUNT)}.`
      : noteTooHigh
        ? `Note couvre les prêts jusqu’à ${eur(NOTE_FREE_LIMIT)}. Au-delà, c’est Zen.`
        : '';

  const waiting = !inRange && !months
    ? full
      ? 'Saisis un montant et choisis une durée.'
      : 'Saisis un montant.'
    : !inRange
      ? 'Saisis un montant.'
      : 'Choisis une durée.';

  const announce = result
    ? `${eur(result.schedule.monthly)} par mois pendant ${months} mois. TilliT ${
        isZen ? 'Zen' : 'Note'
      } : ${eur(result.tillit)}. Crédit à la consommation simulé : ${eur(
        result.conso,
      )}. Crédit renouvelable simulé : ${eur(result.revo)}.`
    : '';

  const detailHref = `/tarifs?montant=${inRange ? amount : ''}&duree=${months}&offre=${effectiveOffer}#simulateur`;
  const toggleSigner = (s: Signer) =>
    setSigners((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const TitleTag = full ? 'h3' : 'h2';

  return (
    <div className={styles.card} id={full ? 'simulateur' : undefined} data-reveal>
      <div className={styles.head}>
        <TitleTag className={styles.title} id={full ? undefined : 'comparateur-titre'}>
          {full ? 'Simule le coût de ton prêt' : 'Combien coûte ton prêt avec TilliT ?'}
        </TitleTag>

        {full ? (
          <p className={styles.precision}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            <span>
              TilliT organise le prêt.{' '}
              <b>L’argent circule directement entre vous, hors de l’application.</b> TilliT ne
              détient jamais les fonds.
              <InfoTip
                label="Ce que TilliT n’est pas"
                text="TilliT n’est ni une banque, ni un organisme de crédit, ni un établissement de paiement, ni un service de recouvrement."
              />
            </span>
          </p>
        ) : (
          <FundsBanner />
        )}
      </div>

      <div className={styles.inputs}>
        <label className={styles.field}>
          <span className={styles.label}>Montant prêté</span>
          <span className={styles.control}>
            <input
              type="number"
              placeholder="Saisis un montant"
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
          <span className={styles.label}>Durée</span>
          <span className={`${styles.control} ${styles.selectControl}`}>
            <select value={months} onChange={(e) => setMonths(Number(e.target.value))} required>
              <option value={0} disabled>
                Choisis une durée
              </option>
              {DURATIONS.map((m) => (
                <option key={m} value={m}>
                  {m === 60 ? '60 mois (5 ans)' : `${m} mois`}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          </span>
        </label>

        <fieldset className={styles.offers}>
          <legend className={styles.label}>Offre</legend>
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
          <legend className={styles.label}>Signature avec Zen</legend>
          <div className={styles.checks}>
            {(['preteur', 'emprunteur'] as Signer[]).map((s) => (
              <label key={s} className={styles.check}>
                <input
                  type="checkbox"
                  checked={signers.includes(s)}
                  onChange={() => toggleSigner(s)}
                  aria-describedby="simulateur-signature-aide"
                />
                <span>
                  {s === 'preteur' ? 'Le prêteur' : 'L’emprunteur'} signe avec FranceConnect
                  (+1,50&nbsp;€)
                </span>
              </label>
            ))}
          </div>
          <p className={styles.help} id="simulateur-signature-aide">
            Signature avec France Identité&nbsp;: incluse. Le supplément FranceConnect est payé
            uniquement par la personne qui choisit ce parcours pour signer.
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
                <p className={styles.ecoTitle}>
                  <b>{eur(result.savings)}</b> d’économie estimée avec TilliT
                </p>
                <p className={styles.ecoSub}>
                  Par rapport au crédit renouvelable simulé
                  {full ? (
                    <>
                      {' · '}
                      <a href="#detail-calculs">Voir le détail des calculs&nbsp;→</a>
                    </>
                  ) : (
                    <>
                      {' · '}
                      <Link to={detailHref}>Voir le détail des calculs&nbsp;→</Link>
                    </>
                  )}
                </p>
              </div>
            )}
            <p className={styles.remb}>
              <i className="fa-regular fa-calendar" aria-hidden="true" />
              <span>
                {eur(result.schedule.monthly)} par mois pendant {months} mois
              </span>
              {result.schedule.last !== result.schedule.monthly && (
                <InfoTip
                  label="Comment la mensualité est arrondie"
                  text={`Mensualité arrondie au centime inférieur. La dernière échéance absorbe la différence : ${eur(
                    result.schedule.last,
                  )}.`}
                />
              )}
            </p>
          </div>

          <p className={styles.legend}>
            <i className="fa-solid fa-chart-column" aria-hidden="true" />
            Comparaison des coûts
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
                TilliT {isZen ? 'Zen' : 'Note'}
                <span className={styles.linePill}>0&nbsp;% d’intérêt</span>
              </span>
              <b className={styles.linePrice}>{eur(result.tillit)}</b>
              <span className={styles.lineSub}>
                {isZen
                  ? 'Paiement unique. Signature avec France Identité : incluse. Signature avec FranceConnect : +1,50 € par signataire qui l’utilise.'
                  : `Sans frais, de ${eur(MIN_AMOUNT)} à ${eur(NOTE_FREE_LIMIT)} par prêt.`}
              </span>
            </li>
            <RateLine
              n={2}
              name="Crédit à la consommation simulé"
              cost={result.conso}
              width={result.widths[1]}
              rate={consoRate}
              refRate={refConso}
              onRate={setConsoOverride}
            />
            <RateLine
              n={3}
              name="Crédit renouvelable simulé"
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
                <summary>Détail des calculs</summary>
                <ul className={styles.detail}>
                  <li>
                    Montant prêté&nbsp;: <b>{eur(amount)}</b>, remboursé en {months}{' '}
                    {months > 1 ? 'mensualités' : 'mensualité'} de{' '}
                    <b>{eur(result.schedule.monthly)}</b>
                    {result.schedule.last !== result.schedule.monthly &&
                      ` (dernière : ${eur(result.schedule.last)})`}
                    , sans intérêts.
                  </li>
                  {isZen ? (
                    <li>
                      TilliT Zen&nbsp;: <b>{eur(result.zen)}</b>, prix de la grille pour ce
                      montant, payé une seule fois.
                      {fcCount > 0 &&
                        ` Supplément FranceConnect : ${fcCount} × ${eur(FRANCECONNECT_FEE)} = ${eur(
                          result.fc,
                        )}.`}
                    </li>
                  ) : (
                    <li>
                      TilliT Note&nbsp;: <b>{eur(0)}</b>, sans frais.
                    </li>
                  )}
                  <li>
                    Crédit à la consommation simulé à {rateFmt(consoRate)}&nbsp;% sur {months}{' '}
                    mois&nbsp;: mensualité de {eur((amount + result.conso) / months)}, coût{' '}
                    <b>{eur(result.conso)}</b>.
                  </li>
                  <li>
                    Crédit renouvelable simulé à {rateFmt(revoRate)}&nbsp;% sur {months}{' '}
                    mois&nbsp;: mensualité de {eur((amount + result.revo) / months)}, coût{' '}
                    <b>{eur(result.revo)}</b>.
                  </li>
                  <li>
                    Économie estimée&nbsp;: {eur(result.revo)}
                    {isZen && ` − ${eur(result.zen)}`}
                    {result.fc > 0 && ` − ${eur(result.fc)}`} ={' '}
                    <b>{eur(result.savings)}</b>.
                  </li>
                </ul>
              </details>

              <details className={styles.more}>
                <summary>Échéancier du remboursement · {months} échéances</summary>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th scope="col">Échéance</th>
                        <th scope="col">Montant</th>
                        <th scope="col">Reste à rembourser</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.rows.map((r) => (
                        <tr key={r.n}>
                          <td>{r.n}</td>
                          <td>{eur(r.amount)}</td>
                          <td>{eur(r.remaining)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={styles.tableNote}>
                  Sans intérêts. Le prix de Zen se paie à part des échéances.
                </p>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Comparateur() {
  return (
    <section className={styles.section} id="comparateur" aria-labelledby="comparateur-titre">
      <div className={styles.inner}>
        <SimulatorCard />

        <p className={styles.closing} data-reveal>
          <span>On ne remplace pas la confiance.</span>{' '}
          <span>
            On lui donne <span className={styles.cadre}>un cadre</span>.
          </span>
        </p>
      </div>
    </section>
  );
}
