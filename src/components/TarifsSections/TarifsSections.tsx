import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TarifsSections.module.css';
import InfoTip from '../InfoTip/InfoTip';
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

const BEATS = [
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
];

const PRICE_FAQ = [
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
];

export function TarifsHeroExtras() {
  return (
    <>
      <p className={styles.heroNote}>
        Les informations juridiques de cette page sont en cours de relecture par notre conseil.
      </p>
      <ul className={styles.heroSummary}>
        <li>
          <span className={styles.heroBadge}>Note</span>
          <span>Sans frais, de 100 à 1&nbsp;500&nbsp;€ par prêt.</span>
        </li>
        <li>
          <span className={`${styles.heroBadge} ${styles.heroBadgeZen}`}>Zen</span>
          <span>Dès 2,99&nbsp;€, en un seul paiement, de 100 à 5&nbsp;000&nbsp;€ par prêt.</span>
        </li>
      </ul>
      <Link to="/#cta" className={styles.heroCta}>
        Être prévenu du lancement
        <i className="fa-solid fa-bell" aria-hidden="true" />
      </Link>
    </>
  );
}

export function TarifsPrincipe() {
  return (
    <section className={`${styles.section} ${styles.cream}`}>
      <div className={styles.container}>
        <header className={styles.head} data-reveal>
          <span className={styles.kicker}>Ce qu’il faut comprendre</span>
          <h2 className={styles.title}>Un paiement. Une fois.</h2>
        </header>

        <div className={styles.beats}>
          {BEATS.map((b, i) => (
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
              <p className={styles.beatText}>{b.text}</p>
            </article>
          ))}
        </div>

        <p className={styles.figures} data-reveal>
          <span className={styles.figure}>500&nbsp;€</span> prêtés.{' '}
          <span className={styles.figure}>500&nbsp;€</span> remboursés.{' '}
          <span className={`${styles.figure} ${styles.figureZero}`}>0&nbsp;%</span> d’intérêt.
        </p>

        <p className={styles.reserve} data-reveal>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          <span>
            TilliT aide à réduire les oublis et les malentendus.{' '}
            <b>Il ne garantit pas le remboursement.</b>
          </span>
        </p>
      </div>
    </section>
  );
}

export function TarifsGrille() {
  const [amount, setAmount] = useState<number | null>(null);
  const onAmountChange = useCallback((a: number | null) => setAmount(a), []);
  const match = amount === null ? -1 : zenTierIndex(amount);

  return (
    <section className={`${styles.section} ${styles.violet}`} id="grille">
      <div className={styles.container}>
        <header className={styles.head} data-reveal>
          <span className={`${styles.kicker} ${styles.kickerLight}`}>Simulateur</span>
          <h2 className={`${styles.title} ${styles.titleLight}`}>
            Le prix exact,
            <br />
            <span className={styles.titleAccent}>selon le montant&nbsp;prêté.</span>
          </h2>
        </header>

        <div className={styles.narrow}>
          <SimulatorCard full onAmountChange={onAmountChange} />

          <div className={styles.grid} data-reveal>
            <h3 className={styles.gridPill}>Grille TilliT Zen</h3>
            <p className={styles.gridText}>
              Un paiement unique, selon le montant prêté. Le prix reste le même, quelle que soit
              la durée du prêt.
            </p>
            <ul className={styles.tiers}>
              {ZEN_TIERS.map((t, i) => (
                <li
                  key={t.min}
                  className={`${styles.tier} ${i === match ? styles.tierMatch : ''}`}
                  aria-current={i === match ? 'true' : undefined}
                >
                  <span className={styles.tierRange}>
                    {eurWhole(t.min)}&nbsp;€ – {eurWhole(t.max)}&nbsp;€
                  </span>
                  <span className={styles.tierPrice}>{eur(t.price)}</span>
                </li>
              ))}
            </ul>
            <p className={styles.gridText}>
              Jusqu’à 1&nbsp;500&nbsp;€, tu choisis entre Note et Zen. Au-delà, c’est Zen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TarifsSuite() {
  return (
    <section className={`${styles.section} ${styles.tint}`}>
      <div className={`${styles.container} ${styles.narrow}`}>
        {/* --- Signature --- */}
        <div className={styles.ways} id="signature" data-reveal>
          <p className={styles.waysTitle}>
            Deux façons de signer ta reconnaissance de dette
            <InfoTip
              label="Comment la reconnaissance de dette est signée"
              text="Reconnaissance de dette signée électroniquement, conformément aux articles 1366 et 1367 du Code civil, par le biais du service Goodflag, dont les parties ont déclaré reconnaître à cette signature électronique la même valeur que leur signature manuscrite et lui conférer date certaine."
            />
          </p>
          <div className={styles.wayPair}>
            <div className={styles.way}>
              <span className={styles.wayIcon} aria-hidden="true">
                <i className="fa-solid fa-id-card" />
              </span>
              <div>
                <h3 className={styles.wayTitle}>
                  France Identité <b className={`${styles.wayPrice} ${styles.wayFree}`}>inclus</b>
                </h3>
                <p className={styles.wayText}>
                  Tu signes avec l’application officielle liée à la nouvelle carte d’identité.
                  C’est inclus dans le prix de Zen.
                </p>
              </div>
            </div>
            <div className={styles.way}>
              <span className={styles.wayIcon} aria-hidden="true">
                <i className="fa-solid fa-right-to-bracket" />
              </span>
              <div>
                <h3 className={styles.wayTitle}>
                  FranceConnect <b className={styles.wayPrice}>+&nbsp;1,50&nbsp;€</b>
                </h3>
                <p className={styles.wayText}>
                  Signature avec France Identité&nbsp;: incluse. Signature avec
                  FranceConnect&nbsp;: +1,50&nbsp;€ par signataire qui l’utilise.
                  <InfoTip
                    label="Qui paie le supplément FranceConnect"
                    text="Le supplément FranceConnect est payé uniquement par la personne qui choisit ce parcours pour signer."
                  />
                </p>
              </div>
            </div>
          </div>
          <p className={styles.waysFoot}>
            Avec Zen, vous signez tous les deux la reconnaissance de dette. Chacun choisit son
            parcours pour signer. Le supplément FranceConnect est payé uniquement par la personne
            qui choisit ce parcours.
          </p>
          <dl className={styles.waysDetail}>
            <div>
              <dt>Horodatage</dt>
              <dd>
                Chaque signature est horodatée par le service SunTSA de Goodflag, selon la norme
                RFC 3161.
              </dd>
            </div>
            <div>
              <dt>Conservation</dt>
              <dd>Aujourd’hui, Goodflag conserve le dossier de preuves pendant dix ans.</dd>
            </div>
          </dl>
          <p className={styles.waysNote}>
            Le niveau de la signature électronique au sens du règlement eIDAS dépend du parcours
            réellement utilisé. Articles 1366 et 1367 du Code civil · à faire valider par notre
            conseil.
          </p>
          <p className={styles.waysNote}>
            Horodatage et conservation&nbsp;: à faire valider par notre conseil.
          </p>
        </div>

        {/* --- Hypothèses --- */}
        <div className={styles.hypotheses} id="hypotheses" data-reveal>
          <h3 className={styles.hypoTitle}>
            <span className={styles.hypoTitleIcon} aria-hidden="true">
              <i className="fa-solid fa-scale-balanced" />
            </span>
            Sources, méthode et limites de la comparaison
          </h3>

          <div className={styles.hypoGrid}>
            <article className={`${styles.hypoCard} ${styles.hypoStrip}`}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-building-columns" aria-hidden="true" />
                Sources et date
              </p>
              <p>
                Banque de France, taux effectifs moyens et seuils de l’usure du
                3<sup>e</sup> trimestre 2026. Ces valeurs sont révisées tous les trois mois&nbsp;:
                à revérifier à chaque trimestre.
              </p>
            </article>

            <article className={`${styles.hypoCard} ${styles.hypoWide}`}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-percent" aria-hidden="true" />
                Taux de référence
              </p>
              <div className={styles.hypoSplit}>
                <table className={styles.rates}>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="sr-only">Crédit</span>
                      </th>
                      <th scope="col">Jusqu’à 3&nbsp;000&nbsp;€</th>
                      <th scope="col">Au-delà</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Consommation</th>
                      <td>{rateFmt(CONSO_BRACKETS[0].rate)}&nbsp;%</td>
                      <td>{rateFmt(CONSO_BRACKETS[1].rate)}&nbsp;%</td>
                    </tr>
                    <tr>
                      <th scope="row">Renouvelable</th>
                      <td>{rateFmt(REVOLV_BRACKETS[0].rate)}&nbsp;%</td>
                      <td>{rateFmt(REVOLV_BRACKETS[1].rate)}&nbsp;%</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  Crédit à la consommation&nbsp;: taux effectif moyen constaté. Crédit
                  renouvelable&nbsp;: simulé au plafond légal de l’usure. Ce plafond est un maximum
                  légal, pas un taux moyen. Chaque taux peut être remplacé par le tien, par exemple
                  le TAEG d’une offre réelle&nbsp;: il est alors signalé comme taux personnalisé.
                </p>
              </div>
            </article>

            <article className={styles.hypoCard}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-calculator" aria-hidden="true" />
                Méthode
              </p>
              <p>
                Chaque crédit est simulé comme un prêt amortissable à mensualités constantes sur
                la durée choisie&nbsp;; son coût est la somme des mensualités, moins le capital.
                Le prix de Zen est celui de la grille, payé une seule fois, quelle que soit la
                durée. L’économie estimée est le coût du crédit renouvelable simulé, moins le prix
                de Zen quand c’est l’offre choisie, et moins le supplément FranceConnect de chaque
                signataire coché&nbsp;; avec Note, il n’y a rien à retrancher.
              </p>
            </article>

            <article className={`${styles.hypoCard} ${styles.hypoCardWarn}`}>
              <p className={styles.hypoHead}>
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                Les limites de la comparaison
              </p>
              <p>
                Elle porte sur des coûts. TilliT ne propose aucun financement et n’avance jamais
                les fonds. Estimation indicative&nbsp;: ni frais de dossier, ni assurance, ni
                fonctionnement réel d’un crédit renouvelable, qui repose sur une réserve et des
                remboursements variables. Le prix Zen affiché inclut la signature avec France
                Identité. Le supplément FranceConnect, +1,50&nbsp;€ par signataire qui l’utilise,
                n’est compté que si tu coches la case de ce signataire&nbsp;: seule la personne qui
                choisit ce parcours le paie. Le prix de TilliT Zen rémunère la préparation, la
                signature et la conservation de la reconnaissance de dette. Il est présenté en
                euros dans cette simulation.
              </p>
            </article>
          </div>
        </div>

        {/* --- FAQ prix --- */}
        <div className={styles.faq} data-reveal>
          <h3 className={styles.faqTitle}>Tes questions sur le prix</h3>
          {PRICE_FAQ.map((item, i) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>
                <span className={styles.faqNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.q}
              </summary>
              <p className={styles.faqAnswer}>{item.a}</p>
            </details>
          ))}
          <details className={styles.faqItem}>
            <summary>
              <span className={styles.faqNum} aria-hidden="true">
                05
              </span>
              Note ou Zen&nbsp;?
            </summary>
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
          </details>
          <p className={styles.faqMore}>
            Une autre question&nbsp;? <Link to="/faq">Consulter la FAQ</Link>
          </p>
        </div>

        <div className={styles.pullquote} data-reveal>
          <span className={styles.pullLabel}>Au prochain prêt</span>
          <p className={styles.pullBubble}>«&nbsp;On utilise TilliT.&nbsp;»</p>
        </div>

        <div className={styles.postCta} data-reveal>
          <div className={styles.postText}>
            <span className={styles.postIcon} aria-hidden="true">
              <i className="fa-solid fa-bell" />
            </span>
            <h3>Réserve ta place</h3>
            <p>On t’écrit dès l’ouverture de TilliT.</p>
            <Link to="/#cta" className={styles.postBtn}>
              Être prévenu du lancement
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
