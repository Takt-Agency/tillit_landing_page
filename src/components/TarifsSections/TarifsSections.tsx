import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TarifsSections.module.css';
import InfoTip from '../InfoTip/InfoTip';
import { typo, useLang, useLocalize } from '../../i18n';
import mascotUrl from '../../millions-mascotte.png';
import { SimulatorCard } from '../Comparateur/Comparateur';
import {
  CONSO_BRACKETS,
  REVOLV_BRACKETS,
  ZEN_TIERS,
  eur,
  eurWhole,
  rateFmt,
  zenTierIndex,
} from '../../lib/loanPricing';

const BEATS = {
  fr: [
    {
      tone: 'violet',
      icon: 'fa-hourglass-half',
      label: 'Durée',
      title: 'Le prix ne bouge pas avec le temps',
      text: 'Le prix de Zen reste le même pendant toute la durée du prêt. Tu paies une seule fois, sans abonnement.',
    },
    {
      tone: 'coral',
      icon: 'fa-tag',
      label: 'Montant',
      title: 'Un prix fixe, selon le montant',
      text: 'Le prix dépend du montant prêté. Il comprend la création, la signature et la conservation de la reconnaissance de dette.',
    },
    {
      tone: 'blue',
      icon: 'fa-user-group',
      label: 'Qui paie',
      title: 'Vous choisissez ensemble',
      text: 'TilliT Zen peut être payé par le prêteur ou l’emprunteur. À vous de décider ensemble. Le supplément FranceConnect, lui, est payé uniquement par la personne qui choisit ce parcours pour signer.',
    },
  ],
  en: [
    {
      tone: 'violet',
      icon: 'fa-hourglass-half',
      label: 'How long',
      title: 'The price doesn’t change over time',
      text: 'The price of Zen stays the same for the whole loan. You pay once, with no subscription.',
    },
    {
      tone: 'coral',
      icon: 'fa-tag',
      label: 'Amount',
      title: 'A fixed price, based on the amount',
      text: 'The price depends on the amount lent. It covers drawing up, signing and securely keeping the acknowledgement of debt.',
    },
    {
      tone: 'blue',
      icon: 'fa-user-group',
      label: 'Who pays',
      title: 'You choose together',
      text: 'TilliT Zen can be paid by the lender or by the borrower. The two of you decide. The FranceConnect extra is paid only by the person who chooses that route to sign.',
    },
  ],
};

const PRICE_FAQ = {
  fr: [
    {
      q: 'Que comprend le prix ?',
      a: 'Le prix de TilliT Zen dépend du montant prêté. Il comprend la création, la signature et la conservation de la reconnaissance de dette. Signature avec France Identité : incluse. Signature avec FranceConnect : +1,50 € par signataire qui l’utilise.',
    },
    {
      q: 'Puis-je commencer gratuitement ?',
      a: 'Oui, avec Note. Il organise gratuitement ton prêt jusqu’à 1 500 € : montant, échéances, rappels et suivi.',
    },
    {
      q: 'Qui paie Zen ?',
      a: 'TilliT Zen peut être payé par le prêteur ou l’emprunteur. À vous de décider ensemble.',
    },
    {
      q: 'Le prix change-t-il avec la durée ?',
      a: 'Non. Le prix de Zen reste le même pendant toute la durée du prêt. Tu paies une seule fois, sans abonnement.',
    },
  ],
  en: [
    {
      q: 'What does the price cover?',
      a: 'The price of TilliT Zen depends on the amount lent. It covers drawing up, signing and securely keeping the acknowledgement of debt. Signing with France Identité: included. Signing with FranceConnect: +€1.50 per signatory who uses it.',
    },
    {
      q: 'Can I start for free?',
      a: 'Yes, with Note. It organises your loan free of charge up to €1,500: amount, instalments, reminders and tracking.',
    },
    {
      q: 'Who pays for Zen?',
      a: 'TilliT Zen can be paid by the lender or by the borrower. The two of you decide.',
    },
    {
      q: 'Does the price change with the length of the loan?',
      a: 'No. The price of Zen stays the same for the whole loan. You pay once, with no subscription.',
    },
  ],
};

const HERO_COPY = {
  fr: {
    note: 'Les informations juridiques de cette page sont en cours de relecture par notre conseil.',
    noteLine: <>&nbsp;: sans frais, de 100 à 1&nbsp;500&nbsp;€ par prêt.</>,
    zenLine: <>&nbsp;: dès 2,99&nbsp;€, en un seul paiement, de 100 à 5&nbsp;000&nbsp;€ par prêt.</>,
    cta: 'Être prévenu du lancement',
  },
  en: {
    note: 'The legal information on this page is being reviewed by our legal counsel.',
    noteLine: <>: no fees, from €100 to €1,500 per loan.</>,
    zenLine: <>: from €2.99, in one payment, from €100 to €5,000 per loan.</>,
    cta: 'Get notified at launch',
  },
};

export function TarifsHeroExtras() {
  const lang = useLang();
  const l = useLocalize();
  const t = HERO_COPY[lang];
  return (
    <>
      <p className={styles.heroNote}>{t.note}</p>
      <ul className={styles.heroSummary}>
        <li>
          <span className={styles.heroBadge}>Note</span>
          <span>{t.noteLine}</span>
        </li>
        <li>
          <span className={`${styles.heroBadge} ${styles.heroBadgeZen}`}>Zen</span>
          <span>{t.zenLine}</span>
        </li>
      </ul>
      <Link to={l('/#waitlist')} className={styles.heroCta}>
        {t.cta}
        <i className="fa-solid fa-bell" aria-hidden="true" />
      </Link>
    </>
  );
}

const PRINCIPE_COPY = {
  fr: {
    kicker: 'Ce qu’il faut comprendre',
    title: 'Un paiement. Une fois.',
    figures: (
      <>
        <span className={styles.figure}>500&nbsp;€</span> prêtés.{' '}
        <span className={styles.figure}>500&nbsp;€</span> remboursés.{' '}
        <span className={`${styles.figure} ${styles.figureZero}`}>0&nbsp;%</span> d’intérêt.
      </>
    ),
    reserve: (
      <>
        TilliT aide à réduire les oublis et les malentendus.{' '}
        <b>Il ne garantit pas le remboursement.</b>
      </>
    ),
  },
  en: {
    kicker: 'What to know',
    title: 'One payment. Once.',
    figures: (
      <>
        <span className={styles.figure}>€500</span> lent.{' '}
        <span className={styles.figure}>€500</span> repaid.{' '}
        <span className={`${styles.figure} ${styles.figureZero}`}>0%</span> interest.
      </>
    ),
    reserve: (
      <>
        TilliT helps cut down forgotten dates and misunderstandings.{' '}
        <b>It does not guarantee repayment.</b>
      </>
    ),
  },
};

export function TarifsPrincipe() {
  const lang = useLang();
  const t = PRINCIPE_COPY[lang];
  return (
    <section className={`${styles.section} ${styles.cream}`}>
      <div className={styles.container}>
        <header className={styles.head} data-reveal>
          <span className={styles.kicker}>{t.kicker}</span>
          <h2 className={styles.title}>{t.title}</h2>
        </header>

        <div className={styles.beats}>
          {BEATS[lang].map((b, i) => (
            <article
              key={b.label}
              className={`${styles.beat} ${styles[`tone_${b.tone}`]}`}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 110}ms` }}
            >
              <span className={styles.beatIcon} aria-hidden="true">
                <i className={`fa-solid ${b.icon}`} />
              </span>
              <p className={styles.beatLabel}>{b.label}</p>
              <h3 className={styles.beatTitle}>{b.title}</h3>
              <p className={styles.beatText}>{typo(b.text, lang)}</p>
            </article>
          ))}
        </div>

        <p className={styles.figures} data-reveal>
          {t.figures}
        </p>

        <p className={styles.reserve} data-reveal>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          <span>{t.reserve}</span>
        </p>
      </div>
    </section>
  );
}

const GRILLE_COPY = {
  fr: {
    kicker: 'Simulateur',
    title: (
      <>
        Le prix exact,
        <br />
        <span className={styles.titleAccent}>selon le montant&nbsp;prêté.</span>
      </>
    ),
    pill: 'Grille TilliT Zen',
    intro:
      'Un paiement unique, selon le montant prêté. Le prix reste le même, quelle que soit la durée du prêt.',
    outro: <>Jusqu’à 1&nbsp;500&nbsp;€, tu choisis entre Note et Zen. Au-delà, c’est Zen.</>,
  },
  en: {
    kicker: 'Simulator',
    title: (
      <>
        The exact price,
        <br />
        <span className={styles.titleAccent}>for the amount you&nbsp;lend.</span>
      </>
    ),
    pill: 'TilliT Zen price grid',
    intro:
      'One payment, based on the amount lent. The price stays the same, whatever the length of the loan.',
    outro: <>Up to €1,500, you choose between Note and Zen. Above that, it’s Zen.</>,
  },
};

export function TarifsGrille() {
  const lang = useLang();
  const t = GRILLE_COPY[lang];
  const [amount, setAmount] = useState<number | null>(null);
  const onAmountChange = useCallback((a: number | null) => setAmount(a), []);
  const match = amount === null ? -1 : zenTierIndex(amount);

  return (
    <section className={`${styles.section} ${styles.violet}`} id="grille">
      <div className={styles.container}>
        <header className={styles.head} data-reveal>
          <span className={`${styles.kicker} ${styles.kickerLight}`}>{t.kicker}</span>
          <h2 className={`${styles.title} ${styles.titleLight}`}>{t.title}</h2>
        </header>

        <div className={styles.narrow}>
          <SimulatorCard full onAmountChange={onAmountChange} />

          <div className={styles.grid} data-reveal>
            <h3 className={styles.gridPill}>{t.pill}</h3>
            <p className={styles.gridText}>{t.intro}</p>
            <ul className={styles.tiers}>
              {ZEN_TIERS.map((tier, i) => (
                <li
                  key={tier.min}
                  className={`${styles.tier} ${i === match ? styles.tierMatch : ''}`}
                  aria-current={i === match ? 'true' : undefined}
                >
                  <span className={styles.tierRange}>
                    {lang === 'en' ? (
                      <>
                        €{eurWhole(tier.min, 'en')} – €{eurWhole(tier.max, 'en')}
                      </>
                    ) : (
                      <>
                        {eurWhole(tier.min)}&nbsp;€ – {eurWhole(tier.max)}&nbsp;€
                      </>
                    )}
                  </span>
                  <span className={styles.tierPrice}>{eur(tier.price, lang)}</span>
                </li>
              ))}
            </ul>
            <p className={styles.gridText}>{t.outro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TarifsSuite() {
  const lang = useLang();
  const l = useLocalize();
  const en = lang === 'en';
  const conso0 = rateFmt(CONSO_BRACKETS[0].rate, lang);
  const conso1 = rateFmt(CONSO_BRACKETS[1].rate, lang);
  const revolv0 = rateFmt(REVOLV_BRACKETS[0].rate, lang);
  const revolv1 = rateFmt(REVOLV_BRACKETS[1].rate, lang);

  return (
    <section className={`${styles.section} ${styles.tint}`}>
      <div className={`${styles.container} ${styles.narrow}`}>
        {/* --- Signature --- */}
        <div className={styles.ways} id="signature" data-reveal>
          <p className={styles.waysTitle}>
            {en
              ? 'Two ways to sign your acknowledgement of debt'
              : 'Deux façons de signer ta reconnaissance de dette'}
            <InfoTip
              label={
                en
                  ? 'How the acknowledgement of debt is signed'
                  : 'Comment la reconnaissance de dette est signée'
              }
              text={
                en
                  ? 'Acknowledgement of debt signed electronically, under articles 1366 and 1367 of the Code civil, through the Goodflag service. Both of you state that this electronic signature has the same value as your handwritten signature, and give it date certaine, an established date.'
                  : 'Reconnaissance de dette signée électroniquement, conformément aux articles 1366 et 1367 du Code civil, par le biais du service Goodflag, dont les parties ont déclaré reconnaître à cette signature électronique la même valeur que leur signature manuscrite et lui conférer date certaine.'
              }
            />
          </p>
          <div className={styles.wayPair}>
            <div className={styles.way}>
              <span className={styles.wayIcon} aria-hidden="true">
                <i className="fa-solid fa-id-card" />
              </span>
              <div>
                <h3 className={styles.wayTitle}>
                  France Identité{' '}
                  <b className={`${styles.wayPrice} ${styles.wayFree}`}>
                    {en ? 'included' : 'inclus'}
                  </b>
                </h3>
                <p className={styles.wayText}>
                  {en ? (
                    <>
                      You sign with the official app tied to the new French ID card. It’s included
                      in the price of Zen.
                    </>
                  ) : (
                    <>
                      Tu signes avec l’application officielle liée à la nouvelle carte d’identité.
                      C’est inclus dans le prix de Zen.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className={styles.way}>
              <span className={styles.wayIcon} aria-hidden="true">
                <i className="fa-solid fa-right-to-bracket" />
              </span>
              <div>
                <h3 className={styles.wayTitle}>
                  FranceConnect{' '}
                  <b className={styles.wayPrice}>{en ? '+€1.50' : <>+&nbsp;1,50&nbsp;€</>}</b>
                </h3>
                <p className={styles.wayText}>
                  {en ? (
                    <>
                      Signing with France Identité: included. Signing with FranceConnect: +€1.50
                      per signatory who uses it.
                    </>
                  ) : (
                    <>
                      Signature avec France Identité&nbsp;: incluse. Signature avec
                      FranceConnect&nbsp;: +1,50&nbsp;€ par signataire qui l’utilise.
                    </>
                  )}
                  <InfoTip
                    label={
                      en
                        ? 'Who pays the FranceConnect extra'
                        : 'Qui paie le supplément FranceConnect'
                    }
                    text={
                      en
                        ? 'The FranceConnect extra is paid only by the person who chooses that route to sign.'
                        : 'Le supplément FranceConnect est payé uniquement par la personne qui choisit ce parcours pour signer.'
                    }
                  />
                </p>
              </div>
            </div>
          </div>
          <p className={styles.waysFoot}>
            {en ? (
              <>
                With Zen, you both sign the acknowledgement of debt. Each of you chooses how to
                sign. The FranceConnect extra is paid only by the person who chooses that route.
              </>
            ) : (
              <>
                Avec Zen, vous signez tous les deux la reconnaissance de dette. Chacun choisit son
                parcours pour signer. Le supplément FranceConnect est payé uniquement par la
                personne qui choisit ce parcours.
              </>
            )}
          </p>
          <dl className={styles.waysDetail}>
            <div>
              <dt>{en ? 'Timestamping' : 'Horodatage'}</dt>
              <dd>
                {en ? (
                  <>
                    Every signature is timestamped by Goodflag’s SunTSA service, to the RFC 3161
                    standard.
                  </>
                ) : (
                  <>
                    Chaque signature est horodatée par le service SunTSA de Goodflag, selon la
                    norme RFC 3161.
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>{en ? 'Storage' : 'Conservation'}</dt>
              <dd>
                {en
                  ? 'Today, Goodflag keeps the evidence file for ten years.'
                  : 'Aujourd’hui, Goodflag conserve le dossier de preuves pendant dix ans.'}
              </dd>
            </div>
          </dl>
          <p className={styles.waysNote}>
            {en ? (
              <>
                The level of the electronic signature under the eIDAS regulation depends on the
                route actually used. Articles 1366 and 1367 of the Code civil · to be validated by
                our legal counsel.
              </>
            ) : (
              <>
                Le niveau de la signature électronique au sens du règlement eIDAS dépend du
                parcours réellement utilisé. Articles 1366 et 1367 du Code civil · à faire valider
                par notre conseil.
              </>
            )}
          </p>
          <p className={styles.waysNote}>
            {en ? (
              'Timestamping and storage: to be validated by our legal counsel.'
            ) : (
              <>Horodatage et conservation&nbsp;: à faire valider par notre conseil.</>
            )}
          </p>
        </div>

        {/* --- Hypothèses --- */}
        <div className={styles.hypotheses} id="hypotheses" data-reveal>
          <h3 className={styles.hypoTitle}>
            <span className={styles.hypoTitleIcon} aria-hidden="true">
              <i className="fa-solid fa-scale-balanced" />
            </span>
            {en
              ? 'Sources, method and limits of the comparison'
              : 'Sources, méthode et limites de la comparaison'}
          </h3>

          <div className={styles.hypoGrid}>
            <article className={`${styles.hypoCard} ${styles.hypoStrip}`}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-building-columns" aria-hidden="true" />
                {en ? 'Sources and date.' : 'Sources et date.'}
              </p>
              {en ? (
                <p>
                  Banque de France, average effective rates and usury ceilings for the third
                  quarter of 2026. These values are revised every three months: to be checked
                  again each quarter.
                </p>
              ) : (
                <p>
                  Banque de France, taux effectifs moyens et seuils de l’usure du
                  3<sup>e</sup> trimestre 2026. Ces valeurs sont révisées tous les trois
                  mois&nbsp;: à revérifier à chaque trimestre.
                </p>
              )}
            </article>

            <article className={`${styles.hypoCard} ${styles.hypoWide}`}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-percent" aria-hidden="true" />
                {en ? 'Reference rates.' : 'Taux de référence.'}
              </p>
              {en ? (
                <p>
                  Consumer credit: average effective rate recorded, {conso0}% up to €3,000 and{' '}
                  {conso1}% above. Revolving credit: simulated at the legal usury ceiling,{' '}
                  {revolv0}% up to €3,000 and {revolv1}%{' '}
                  <span className={styles.nowrap}>above</span>. That ceiling is a legal maximum,
                  not an average rate. Each rate can be replaced with your own, for example the
                  TAEG, the APR, of a real offer: it is then flagged as a custom rate.
                </p>
              ) : (
                <p>
                  Crédit à la consommation&nbsp;: taux effectif moyen constaté, {conso0}&nbsp;%
                  jusqu’à 3&nbsp;000&nbsp;€ et {conso1}&nbsp;% au-delà. Crédit
                  renouvelable&nbsp;: simulé au plafond légal de l’usure, {revolv0}&nbsp;% jusqu’à
                  3&nbsp;000&nbsp;€ et {revolv1}&nbsp;%{' '}
                  <span className={styles.nowrap}>au-delà</span>. Ce plafond est un maximum légal,
                  pas un taux moyen. Chaque taux peut être remplacé par le tien, par exemple le
                  TAEG d’une offre réelle&nbsp;: il est alors signalé comme taux personnalisé.
                </p>
              )}
            </article>

            <article className={styles.hypoCard}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-calculator" aria-hidden="true" />
                {en ? 'Method.' : 'Méthode.'}
              </p>
              {en ? (
                <p>
                  Each credit is simulated as an amortising loan with equal monthly payments over
                  the length you choose; its cost is the sum of the monthly payments, minus the
                  capital. The price of Zen is the one in the grid, paid once, whatever the
                  length. The estimated saving is the cost of the simulated revolving credit,
                  minus the price of Zen when that is the plan chosen, and minus the FranceConnect
                  extra for each signatory ticked; with Note, there is nothing to subtract.
                </p>
              ) : (
                <p>
                  Chaque crédit est simulé comme un prêt amortissable à mensualités constantes sur
                  la durée choisie&nbsp;; son coût est la somme des mensualités, moins le capital.
                  Le prix de Zen est celui de la grille, payé une seule fois, quelle que soit la
                  durée. L’économie estimée est le coût du crédit renouvelable simulé, moins le
                  prix de Zen quand c’est l’offre choisie, et moins le supplément FranceConnect de
                  chaque signataire coché&nbsp;; avec Note, il n’y a rien à retrancher.
                </p>
              )}
            </article>

            <article className={`${styles.hypoCard} ${styles.hypoCardWarn}`}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                {en ? 'The limits of the comparison.' : 'Les limites de la comparaison.'}
              </p>
              {en ? (
                <p>
                  It compares costs. TilliT offers no financing and never advances the money. An
                  indicative estimate: no arrangement fees, no insurance, and not how a revolving
                  credit really works, with its reserve and its variable repayments. The Zen price
                  shown includes signing with France Identité. The FranceConnect extra, +€1.50 per
                  signatory who uses it, is counted only if you tick that signatory’s box: only
                  the person who chooses that route pays it. The price of TilliT Zen pays for
                  preparing, signing and securely keeping the acknowledgement of debt. It is shown
                  in euros in this simulation.
                </p>
              ) : (
                <p>
                  Elle porte sur des coûts. TilliT ne propose aucun financement et n’avance jamais
                  les fonds. Estimation indicative&nbsp;: ni frais de dossier, ni assurance, ni
                  fonctionnement réel d’un crédit renouvelable, qui repose sur une réserve et des
                  remboursements variables. Le prix Zen affiché inclut la signature avec France
                  Identité. Le supplément FranceConnect, +1,50&nbsp;€ par signataire qui
                  l’utilise, n’est compté que si tu coches la case de ce signataire&nbsp;: seule
                  la personne qui choisit ce parcours le paie. Le prix de TilliT Zen rémunère la
                  préparation, la signature et la conservation de la reconnaissance de dette. Il
                  est présenté en euros dans cette simulation.
                </p>
              )}
            </article>
          </div>
        </div>

        {/* --- FAQ prix --- */}
        <div className={styles.faq} data-reveal>
          <h3 className={styles.faqTitle}>
            {en ? 'Your questions about the price' : 'Tes questions sur le prix'}
          </h3>
          {PRICE_FAQ[lang].map((item, i) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>
                <span className={styles.faqNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {typo(item.q, lang)}
              </summary>
              <p className={styles.faqAnswer}>{typo(item.a, lang)}</p>
            </details>
          ))}
          <details className={styles.faqItem}>
            <summary>
              <span className={styles.faqNum} aria-hidden="true">
                05
              </span>
              {en ? 'Note or Zen?' : <>Note ou Zen&nbsp;?</>}
            </summary>
            {en ? (
              <p className={styles.faqAnswer}>
                Note organises your loan free of charge up to €1,500. With Zen, you add a signed
                acknowledgement of debt, for a loan up to the Zen ceiling of €5,000. One payment,
                from €2.99.
                <br />
                Above €1,500, it’s Zen. A loan of that size is proved by something in writing, and
                Zen provides that writing.
                <br />
                <small className={styles.muted}>
                  Article 1359 of the Code civil · to be validated by our legal counsel
                </small>
              </p>
            ) : (
              <p className={styles.faqAnswer}>
                Note organise gratuitement ton prêt jusqu’à 1&nbsp;500&nbsp;€. Avec Zen, tu ajoutes
                une reconnaissance de dette signée, pour un prêt jusqu’au plafond Zen de
                5&nbsp;000&nbsp;€. Un seul paiement, dès 2,99&nbsp;€.
                <br />
                Au-delà de 1&nbsp;500&nbsp;€, c’est Zen. Un prêt de ce montant se prouve par un
                écrit, et c’est Zen qui l’établit.
                <br />
                <small className={styles.muted}>
                  Article 1359 du Code civil · à faire valider par notre conseil
                </small>
              </p>
            )}
          </details>
          <p className={styles.faqMore}>
            {en ? 'Another question?' : <>Une autre question&nbsp;?</>}{' '}
            <Link to={l('/faq')}>{en ? 'See the FAQ' : 'Consulter la FAQ'}</Link>
          </p>
        </div>

        <div className={styles.pullquote} data-reveal>
          <span className={styles.pullLabel}>
            {en ? 'At the next loan:' : <>Au prochain prêt&nbsp;:</>}
          </span>
          <p className={styles.pullBubble}>
            {en ? '“We’re using TilliT.”' : <>«&nbsp;On utilise TilliT.&nbsp;»</>}
          </p>
        </div>

        <div className={styles.postCta} data-reveal>
          <div className={styles.postText}>
            <span className={styles.postIcon} aria-hidden="true">
              <i className="fa-solid fa-bell" />
            </span>
            <h3>{en ? 'Save your place' : 'Réserve ta place'}</h3>
            <p>
              {en
                ? 'We’ll write to you as soon as TilliT opens.'
                : 'On t’écrit dès l’ouverture de TilliT.'}
            </p>
            <Link to={l('/#waitlist')} className={styles.postBtn}>
              {en ? 'Get notified at launch' : 'Être prévenu du lancement'}
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <img
            src={mascotUrl}
            alt=""
            aria-hidden="true"
            className={styles.postMascot}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
