import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './TarifsSimulator.module.css';

const easeOut = [0.2, 0.9, 0.3, 1] as const;

type Tier = { min: number; max: number; price: number };

const ZEN_TIERS: Tier[] = [
  { min: 100, max: 500, price: 4.99 },
  { min: 501, max: 1000, price: 9.99 },
  { min: 1001, max: 2000, price: 19.99 },
  { min: 2001, max: 3000, price: 29.99 },
  { min: 3001, max: 4000, price: 39.99 },
  { min: 4001, max: 5000, price: 49.99 },
];

const DURATIONS = [3, 6, 12, 18, 24, 36, 48, 60];

/**
 * Banque de France — taux effectifs moyens & seuils de l'usure (3ᵉ trim. 2026).
 * Rates depend on the amount borrowed.
 */
type RateBracket = { max: number; rate: number };

const CONSO_BRACKETS: RateBracket[] = [
  { max: 3000, rate: 17.65 },
  { max: 6000, rate: 8.35 },
  { max: Infinity, rate: 6.15 },
];

const REVOLV_BRACKETS: RateBracket[] = [
  { max: 3000, rate: 23.53 },
  { max: 6000, rate: 14.75 },
  { max: Infinity, rate: 11.35 },
];

function bracketRate(amount: number, brackets: RateBracket[]): number {
  const b = brackets.find((br) => amount <= br.max);
  return b ? b.rate : brackets[brackets.length - 1].rate;
}

const NOTE_FREE_LIMIT = 1500;
const NOTE_FREE_LABEL = "Jusqu'à 1 500 €, l'offre Note suffit et reste gratuite.";

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(v);

const eurWhole = (v: number) =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(v);

const rateFmt = (v: number) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

function zenPrice(amount: number): number {
  if (amount <= 0) return 0;
  const tier = ZEN_TIERS.find((t) => amount >= t.min && amount <= t.max);
  return tier ? tier.price : ZEN_TIERS[ZEN_TIERS.length - 1].price;
}

function loanInterest(
  principal: number,
  months: number,
  annualRatePct: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return 0;
  const M = (principal * r) / (1 - Math.pow(1 + r, -months));
  const total = M * months;
  return Math.max(0, total - principal);
}

export default function TarifsSimulator() {
  const [amountStr, setAmountStr] = useState('');
  const [months, setMonths] = useState(6);
  const [consoRate, setConsoRate] = useState<number>(CONSO_BRACKETS[0].rate);
  const [revolvRate, setRevolvRate] = useState<number>(REVOLV_BRACKETS[0].rate);
  // Whether the user has manually edited rates — if not, keep them synced
  // with the amount-based Banque de France brackets.
  const [ratesEdited, setRatesEdited] = useState(false);

  const amount = useMemo(() => {
    const n = Number(amountStr.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [amountStr]);

  const refConsoRate = useMemo(
    () => bracketRate(amount || 100, CONSO_BRACKETS),
    [amount],
  );
  const refRevolvRate = useMemo(
    () => bracketRate(amount || 100, REVOLV_BRACKETS),
    [amount],
  );

  useEffect(() => {
    if (!ratesEdited) {
      setConsoRate(refConsoRate);
      setRevolvRate(refRevolvRate);
    }
  }, [refConsoRate, refRevolvRate, ratesEdited]);

  const zen = useMemo(() => zenPrice(amount), [amount]);
  const conso = useMemo(
    () => loanInterest(amount, months, consoRate),
    [amount, months, consoRate],
  );
  const revolv = useMemo(
    () => loanInterest(amount, months, revolvRate),
    [amount, months, revolvRate],
  );

  const monthlyCapital = amount > 0 ? amount / months : 0;

  const resetRates = () => {
    setConsoRate(refConsoRate);
    setRevolvRate(refRevolvRate);
    setRatesEdited(false);
  };

  const hasAmount = amount > 0;

  return (
    <section
      className={styles.section}
      id="simulateur"
      aria-labelledby="simulator-title"
    >
      <div className={styles.container}>
        <motion.header
          className={styles.head}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className={styles.kicker}>
            <i className="fa-solid fa-calculator" aria-hidden="true" />{' '}
            Simulateur
          </span>
          <h2 id="simulator-title" className={styles.title}>
            Compare le coût d'un prêt entre proches avec tillit,{' '}
            <span className={styles.titleAccent}>
              face à un vrai crédit à la conso.
            </span>
          </h2>
          <p className={styles.lead}>
            Saisis une somme, choisis une durée. Tu verras la différence,
            noir sur blanc.
          </p>
        </motion.header>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: easeOut }}
        >
          <div className={styles.inputsRow}>
            <div className={styles.field}>
              <label htmlFor="sim-amount" className={styles.label}>
                Somme prêtée · de 100 € à 5 000 €
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="sim-amount"
                  type="text"
                  inputMode="numeric"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="Ex. 1 000"
                  className={styles.input}
                />
                <span className={styles.inputSuffix}>€</span>
              </div>
              {hasAmount ? (
                <p className={styles.help}>
                  Soit <b>{eur(monthlyCapital)}</b> par mois.
                  {amount <= NOTE_FREE_LIMIT ? ` ${NOTE_FREE_LABEL}` : ''}
                </p>
              ) : (
                <p className={styles.help}>Saisis une somme pour comparer.</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="sim-duration" className={styles.label}>
                Remboursée en
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="sim-duration"
                  className={styles.select}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                >
                  {DURATIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} mois
                    </option>
                  ))}
                </select>
                <i
                  className={`fa-solid fa-chevron-down ${styles.selectArrow}`}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          {(() => {
            type ResultRow = {
              key: 'zen' | 'conso' | 'revolv';
              name: string;
              desc: string;
              descColor?: 'coral';
              value: number;
              zen?: boolean;
            };
            const rows: ResultRow[] = [
              {
                key: 'zen',
                name: 'tillit Zen',
                desc: "Paiement unique, 0 % d'intérêt",
                value: zen,
                zen: true,
              },
              {
                key: 'conso',
                name: 'Crédit à la consommation',
                desc: `Taux moyen ${rateFmt(consoRate)} % · ${months} mois`,
                descColor: 'coral',
                value: conso,
              },
              {
                key: 'revolv',
                name: 'Crédit renouvelable',
                desc: `Proche du plafond ${rateFmt(revolvRate)} % · ${months} mois`,
                descColor: 'coral',
                value: revolv,
              },
            ];

            const ordered = hasAmount
              ? [...rows].sort((a, b) => a.value - b.value)
              : rows;

            const maxVal = Math.max(...rows.map((r) => r.value), 0);
            const widthFor = (v: number) => {
              if (!hasAmount || maxVal <= 0) return 100;
              const ratio = v / maxVal;
              return Math.round(55 + ratio * 45);
            };

            const worst = Math.max(conso, revolv);
            const savings = Math.max(0, worst - zen);

            return (
              <>
                <AnimatePresence mode="wait">
                  {hasAmount && savings > 0 && (
                    <motion.div
                      key="savings"
                      className={styles.savings}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: easeOut }}
                    >
                      <span
                        className={styles.savingsIcon}
                        aria-hidden="true"
                      >
                        <i className="fa-solid fa-piggy-bank" />
                      </span>
                      <div>
                        <p className={styles.savingsLabel}>
                          Avec tillit, tu économises
                        </p>
                        <p className={styles.savingsAmount}>
                          {eur(savings)}
                          <span className={styles.savingsHint}>
                            {' '}
                            face au crédit renouvelable
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={styles.resultsHeader}>
                  <span className={styles.resultsTitle}>
                    <i
                      className="fa-solid fa-chart-column"
                      aria-hidden="true"
                    />{' '}
                    Comparatif
                  </span>
                  <span className={styles.resultsHint}>
                    Coût total, en plus de la somme empruntée
                  </span>
                </div>

                <ul className={styles.results}>
                  {ordered.map((r, idx) => (
                    <motion.li
                      key={r.key}
                      layout
                      className={`${styles.resultLine} ${
                        r.zen ? styles.resultLineZen : ''
                      }`}
                      transition={{
                        layout: { duration: 0.5, ease: easeOut },
                      }}
                    >
                      <motion.div
                        className={`${styles.result} ${
                          r.zen ? styles.resultZen : ''
                        }`}
                        animate={{ width: `${widthFor(r.value)}%` }}
                        transition={{ duration: 0.5, ease: easeOut }}
                      >
                        <span
                          className={`${styles.resultBadge} ${
                            r.zen ? '' : styles.badgeMuted
                          }`}
                          aria-hidden="true"
                        >
                          {r.zen ? (
                            <i className="fa-solid fa-star" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <div className={styles.resultBody}>
                          <span className={styles.resultName}>
                            {r.name}
                            {r.zen && hasAmount && (
                              <span className={styles.bestBadge}>
                                <i
                                  className="fa-solid fa-crown"
                                  aria-hidden="true"
                                />{' '}
                                Meilleur choix
                              </span>
                            )}
                          </span>
                          <span
                            className={`${styles.resultDesc} ${
                              r.descColor === 'coral' ? styles.descCoral : ''
                            }`}
                          >
                            {r.desc}
                          </span>
                        </div>
                      </motion.div>
                      <span
                        className={`${styles.resultAmount} ${
                          r.zen ? styles.resultAmountZen : ''
                        }`}
                      >
                        {eur(r.value)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </>
            );
          })()}

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.ratesPanel}>
            <div className={styles.ratesHeader}>
              <span className={styles.ratesTitle}>
                <i
                  className="fa-solid fa-sliders"
                  aria-hidden="true"
                />{' '}
                Ajuste les taux du marché
              </span>
              {ratesEdited && (
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={resetRates}
                >
                  <i className="fa-solid fa-rotate-left" aria-hidden="true" />{' '}
                  Rétablir la référence
                </button>
              )}
            </div>

            <div className={styles.ratesGrid}>
              <label className={styles.rateField}>
                <span className={styles.rateLabel}>
                  Crédit à la consommation
                </span>
                <span className={styles.rateInputWrap}>
                  <input
                    type="number"
                    step="0.01"
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
                <span className={styles.rateLabel}>Crédit renouvelable</span>
                <span className={styles.rateInputWrap}>
                  <input
                    type="number"
                    step="0.01"
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
              Le prix de tillit Zen est exact&nbsp;: c'est la grille
              ci-dessous, un paiement unique qui ne dépend pas de la durée. Les
              deux autres lignes sont calculées avec les taux réellement
              pratiqués sur le marché, qui dépendent du montant emprunté.
              {hasAmount && (
                <>
                  {' '}
                  Pour <b>{eur(amount)}</b>, le taux moyen constaté est de{' '}
                  <b>{rateFmt(refConsoRate)} %</b>, et le plafond légal de{' '}
                  <b>{rateFmt(refRevolvRate)} %</b>.
                </>
              )}
            </p>
          </div>

          <p className={styles.source}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            <span>
              <b>Source&nbsp;:</b> Banque de France, taux effectifs moyens et
              seuils de l'usure du 3<sup>e</sup> trimestre 2026.{' '}
              <em>
                Ces seuils sont révisés tous les trois mois. Si tu as une offre
                réelle sous les yeux, saisis son TAEG.
              </em>
            </span>
          </p>
        </motion.div>

        <div className={styles.tiersHead}>
          <span className={styles.tiersKicker}>
            <i className="fa-solid fa-tag" aria-hidden="true" /> Grille tillit
            Zen
          </span>
          <p className={styles.tiersLead}>
            Un paiement unique — c'est tout. Aucun autre frais, aucun intérêt.
          </p>
        </div>

        <motion.ul
          className={styles.tiers}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {ZEN_TIERS.map((t) => {
            const isMatch = hasAmount && amount >= t.min && amount <= t.max;
            return (
              <motion.li
                key={t.min}
                className={`${styles.tier} ${isMatch ? styles.tierMatch : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <span className={styles.tierRange}>
                  {eurWhole(t.min)} € – {eurWhole(t.max)} €
                </span>
                <span className={styles.tierPrice}>{eur(t.price)}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
