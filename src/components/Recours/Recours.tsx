import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Recours.module.css';
import PageHero from '../PageHero/PageHero';
import { useLang, useLocalize, type Lang } from '../../i18n';

function Legal({ children }: { children: ReactNode }) {
  return (
    <p className={styles.legal}>
      <i className="fa-solid fa-scale-balanced" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

type Step = {
  key: string;
  icon: string;
  title: string;
  warn?: boolean;
  body: ReactNode;
};

const STEPS_FR: Step[] = [
  {
    key: 'Lettre recommandée',
    icon: 'fa-envelope-circle-check',
    title: 'La mise en demeure',
    body: (
      <>
        <p>
          Une lettre recommandée avec accusé de réception. Elle rappelle la somme, la date
          d’échéance dépassée, et demande le paiement sous un délai précis.
        </p>
        <Legal>Article 1344 du Code civil · à faire valider par notre conseil</Legal>
      </>
    ),
  },
  {
    key: 'Conciliation gratuite',
    icon: 'fa-handshake-angle',
    title: 'La conciliation, pour renouer le dialogue',
    body: (
      <>
        <p>
          Un conciliateur de justice peut vous aider gratuitement à trouver une solution à
          l’amiable. Pour une injonction de payer, ce n’est pas obligatoire. Pour une autre action
          en justice qui réclame 5&nbsp;000&nbsp;€ ou moins, ça l’est, sauf exceptions&nbsp;: sinon,
          le juge peut rejeter ta demande sans l’examiner.
        </p>
        <Legal>
          Article 750-1 du Code de procédure civile · avis n° 25-70.013 du 25 septembre 2025 · à
          faire valider par notre conseil
        </Legal>
      </>
    ),
  },
  {
    key: 'Sans avocat',
    icon: 'fa-file-signature',
    title: 'La requête en injonction de payer',
    body: (
      <>
        <p>
          Tu déposes ta demande au greffe du tribunal du domicile de la personne qui doit
          l’argent, parfois un tribunal de proximité.{' '}
          <strong>Pour les montants couverts par TilliT, l’avocat n’est pas obligatoire.</strong>
        </p>
        <p>
          Elle contient le calcul de ce qui reste dû, combien prêté, combien remboursé, combien
          manque, et la liste des pièces jointes&nbsp;: ce qui montre qu’il s’agit d’un prêt, le
          montant versé et les dates prévues.
        </p>
        <p>
          Le juge examine les justificatifs&nbsp;: il peut accepter tout ou partie de la demande, ou
          la rejeter. Elle est <strong>exonérée de la contribution de 50&nbsp;€</strong>.
        </p>
        <Legal>
          Articles 1405 et 1407 du Code de procédure civile · article 1635 bis Q, III, 7° du CGI ·
          à faire valider par notre conseil
        </Legal>
      </>
    ),
  },
  {
    key: '3 mois pour la faire remettre',
    icon: 'fa-hourglass-half',
    title: 'Faire remettre l’ordonnance',
    warn: true,
    body: (
      <>
        <p>
          Une fois l’ordonnance obtenue, tu la fais remettre à la personne par un commissaire de
          justice, l’ancien huissier, avec une date qui fait foi.{' '}
          <strong>Tu as trois mois.</strong> Passé ce délai, l’ordonnance ne compte plus&nbsp;: ce
          qu’on te doit reste dû, mais la demande est à redéposer depuis le début.
        </p>
        <div className={styles.stepAlert}>
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
          <strong>
            Pour les ordonnances rendues à compter du 1er septembre 2026, ce délai passe de six à
            trois mois.
          </strong>
        </div>
        <Legal>Décret n° 2026-96 du 16 février 2026 · article 1411 du Code de procédure civile</Legal>
      </>
    ),
  },
  {
    key: 'Saisie possible',
    icon: 'fa-gavel',
    title: 'Contester, ou faire saisir',
    body: (
      <>
        <p>
          Une fois l’ordonnance remise, la personne a <strong>un mois</strong> pour la contester
          devant le tribunal.
        </p>
        <p>
          Le délai pour faire saisir est différent&nbsp;: deux mois après la remise, pour une
          ordonnance rendue à compter du 1er septembre 2026, si le tribunal ne t’a signalé aucune
          contestation. Un commissaire de justice peut alors faire une saisie sur compte bancaire
          ou sur salaire.
        </p>
        <details className={styles.more}>
          <summary>Et si l’emprunteur conteste&nbsp;?</summary>
          <p>
            Il peut demander au tribunal de réexaminer la situation. La procédure rapide s’arrête
            alors&nbsp;: vous êtes convoqués tous les deux, vous présentez vos arguments et vos
            documents, et le juge tranche. Garde le document que le commissaire de justice te
            remet, et apporte-le&nbsp;: devant certains tribunaux, sans lui, le juge referme le
            dossier sans regarder qui a raison.
          </p>
        </details>
        <Legal>
          Articles 1415, 1416, 1418 et 1422 du Code de procédure civile · article L. 111-3 du Code
          des procédures civiles d’exécution · à faire valider par notre conseil
        </Legal>
      </>
    ),
  },
];

const STEPS_EN: Step[] = [
  {
    key: 'Registered letter',
    icon: 'fa-envelope-circle-check',
    title: 'The mise en demeure, a formal demand for payment',
    body: (
      <>
        <p>
          A registered letter with proof of receipt, the lettre recommandée avec accusé de réception.
          It sets out the amount, the due date that has passed, and asks for payment within a stated
          time.
        </p>
        <Legal>Article 1344 of the Code civil · to be validated by our legal counsel</Legal>
      </>
    ),
  },
  {
    key: 'Free conciliation',
    icon: 'fa-handshake-angle',
    title: 'Conciliation, to get the conversation going again',
    body: (
      <>
        <p>
          A conciliateur de justice can help you, free of charge, to find an amicable solution. For
          an injonction de payer, this isn’t compulsory. For another court claim of €5,000 or less,
          it is, with some exceptions: otherwise, the judge can reject your claim without looking at
          it.
        </p>
        <Legal>
          Article 750-1 of the Code de procédure civile · avis n° 25-70.013 of 25 September 2025 · to
          be validated by our legal counsel
        </Legal>
      </>
    ),
  },
  {
    key: 'No lawyer',
    icon: 'fa-file-signature',
    title: 'The requête, your application for an injonction de payer',
    body: (
      <>
        <p>
          You file your application with the greffe, the court office, at the court for the place
          where the person who owes the money lives, sometimes a tribunal de proximité.{' '}
          <strong>For the amounts TilliT covers, a lawyer isn’t required.</strong>
        </p>
        <p>
          It contains the calculation of what is still owed, how much was lent, how much has been
          repaid, how much is missing, and the list of documents attached: what shows this is a
          loan, the amount paid over and the dates agreed.
        </p>
        <p>
          The judge looks at the evidence: they can accept all or part of the claim, or reject it.
          The application is <strong>exempt from the €50 contribution</strong>.
        </p>
        <Legal>
          Articles 1405 and 1407 of the Code de procédure civile · article 1635 bis Q, III, 7° of the
          CGI · to be validated by our legal counsel
        </Legal>
      </>
    ),
  },
  {
    key: 'Three months to have it served',
    icon: 'fa-hourglass-half',
    title: 'Having the ordonnance served',
    warn: true,
    body: (
      <>
        <p>
          Once you have the ordonnance, the order the judge issues, you have it served on the person
          by a commissaire de justice, the officer formerly called huissier, with a date that counts
          as proof. <strong>You have three months.</strong> After that, the ordonnance no longer
          counts: what you are owed is still owed, but the application has to be filed again from
          the start.
        </p>
        <div className={styles.stepAlert}>
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
          <strong>
            For ordonnances issued on or after 1 September 2026, this time limit goes from six
            months to three.
          </strong>
        </div>
        <Legal>
          Décret n° 2026-96 of 16 February 2026 · article 1411 of the Code de procédure civile
        </Legal>
      </>
    ),
  },
  {
    key: 'Seizure possible',
    icon: 'fa-gavel',
    title: 'Challenging it, or enforcing it',
    body: (
      <>
        <p>
          Once the ordonnance has been served, the person has <strong>one month</strong> to challenge
          it before the court.
        </p>
        <p>
          The time limit for enforcing is a different one: two months after it is served, for an
          ordonnance issued on or after 1 September 2026, if the court hasn’t told you of any
          challenge. A commissaire de justice can then carry out a saisie, a seizure on a bank
          account or on wages.
        </p>
        <details className={styles.more}>
          <summary>And if the borrower challenges it?</summary>
          <p>
            They can ask the court to look at the situation again. The fast procedure stops there:
            you are both called in, you each present your arguments and your documents, and the
            judge decides. Keep the document the commissaire de justice hands you, and bring it
            along: before some courts, without it, the judge closes the file without looking at who
            is right.
          </p>
        </details>
        <Legal>
          Articles 1415, 1416, 1418 and 1422 of the Code de procédure civile · article L. 111-3 of
          the Code des procédures civiles d’exécution · to be validated by our legal counsel
        </Legal>
      </>
    ),
  },
];

const STEPS: Record<Lang, Step[]> = { fr: STEPS_FR, en: STEPS_EN };

type Fee = { range: string; value: string; factor: string };

const FEES: Record<Lang, Fee[]> = {
  fr: [
    { range: 'Jusqu’à 128 € réclamés :', value: 'la moitié de la base', factor: '½' },
    {
      range: 'Plus de 128 € et jusqu’à 1 280 € :',
      value: 'la base',
      factor: '×1',
    },
    { range: 'Plus de 1 280 € :', value: 'le double de la base', factor: '×2' },
  ],
  en: [
    { range: 'Up to €128 claimed:', value: 'half the base', factor: '½' },
    { range: 'More than €128 and up to €1,280:', value: 'the base', factor: '×1' },
    { range: 'More than €1,280:', value: 'twice the base', factor: '×2' },
  ],
};

const COPY = {
  fr: {
    eyebrow: 'Si ça tourne mal',
    title: (
      <>
        Le remboursement ne vient pas.
        <br />
        Voilà la marche à&nbsp;suivre.
      </>
    ),
    lead: 'Si le remboursement ne se fait toujours pas malgré les relances, il existe une procédure pour demander le paiement à un juge : l’injonction de payer.',
    heroNote:
      'Les informations juridiques de cette page sont en cours de relecture par notre conseil.',
    calloutTitle: <>Et si l’argent ne revient pas&nbsp;?</>,
    calloutText: (
      <>
        TilliT ne fait pas de recouvrement, et ne remplace pas un avocat. Avec Zen, la
        reconnaissance de dette signée, le montant, l’échéancier et l’historique restent au même
        endroit, à présenter si une démarche devient nécessaire.
      </>
    ),
    calloutLegal: 'À faire valider par notre conseil',
    stepsTitle: 'Les cinq étapes, dans l’ordre',
    delayTitle: 'Le délai pour agir',
    stepsAria: 'Les cinq étapes de la procédure, dans l’ordre',
    costTitle: 'Combien ça coûte',
    notaryTitle: <>Et l’acte notarié, alors&nbsp;?</>,
    notaryCard: 'Acte notarié',
    zenCard: 'Reconnaissance de dette TilliT Zen',
    sourcesTitle: 'Sources',
    sourcesText: 'Chaque affirmation de cette page porte sa source juste en dessous.',
    sourcesNote: (
      <>
        Textes à revérifier avant toute action&nbsp;: les délais et montants évoluent. Dernière
        mise à jour&nbsp;: 25 septembre 2026.
      </>
    ),
    postTitle: 'Avec Zen, ta reconnaissance de dette signée reste avec le prêt.',
    postText: 'Montant, échéancier et historique, au même endroit.',
    postBtn: 'Voir ce que coûte Zen',
  },
  en: {
    eyebrow: 'If things go wrong',
    title: (
      <>
        Repayment isn’t coming.
        <br />
        Here are the steps to&nbsp;follow.
      </>
    ),
    lead: 'If repayment still doesn’t come despite the reminders, there’s a procedure for asking a judge to order payment: the injonction de payer.',
    heroNote: 'The legal information on this page is being reviewed by our legal counsel.',
    calloutTitle: <>And if the money doesn’t come back?</>,
    calloutText: (
      <>
        TilliT does not do debt collection, and does not replace a lawyer. With Zen, the signed
        acknowledgement of debt, the amount, the schedule and the history stay in the same place,
        ready to show if a formal step becomes necessary.
      </>
    ),
    calloutLegal: 'To be validated by our legal counsel',
    stepsTitle: 'The five steps, in order',
    delayTitle: 'The time limit to act',
    stepsAria: 'The five steps of the procedure, in order',
    costTitle: 'What it costs',
    notaryTitle: <>What about an acte notarié?</>,
    notaryCard: 'Acte notarié',
    zenCard: 'TilliT Zen acknowledgement of debt',
    sourcesTitle: 'Sources',
    sourcesText: 'Every statement on this page carries its source just below it.',
    sourcesNote: (
      <>
        Check the texts again before taking any step: time limits and amounts change. Last updated:
        25 September 2026.
      </>
    ),
    postTitle: 'With Zen, your signed acknowledgement of debt stays with the loan.',
    postText: 'Amount, schedule and history, in the same place.',
    postBtn: 'See what Zen costs',
  },
};

export default function Recours() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const en = lang === 'en';
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
        <p className={styles.heroNote}>{t.heroNote}</p>
      </PageHero>

      {/* --- Procédure --- */}
      <section className={`${styles.section} ${styles.white}`} id="etapes">
        <div className={styles.narrow}>
          <div className={styles.callout} data-reveal>
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-folder-open" />
            </span>
            <div>
              <p className={styles.calloutTitle}>{t.calloutTitle}</p>
              <p className={styles.calloutText}>{t.calloutText}</p>
              <Legal>{t.calloutLegal}</Legal>
            </div>
          </div>

          <h2 className={styles.h2} data-reveal>
            {t.stepsTitle}
          </h2>

          <div className={styles.delay} data-reveal>
            <span className={styles.delayIcon} aria-hidden="true">
              <i className="fa-solid fa-clock" />
            </span>
            <div>
              <p className={styles.delayTitle}>{t.delayTitle}</p>
              {en ? (
                <>
                  <p className={styles.delayText}>
                    The time limit to act is five years. It runs from{' '}
                    <strong>the date the repayment was due</strong>. If the loan is repaid in
                    instalments, each instalment has its own time limit, running from its own date.
                    So the oldest ones can fall out of time before the others. Don’t wait for the
                    end of the schedule.
                  </p>
                  <Legal>
                    Articles 2224 and 2233 of the Code civil · Cour de cassation, 1re civ., 11
                    February 2016, n° 14-28.383 · to be validated by our legal counsel
                  </Legal>
                </>
              ) : (
                <>
                  <p className={styles.delayText}>
                    Le délai pour agir est de cinq ans. Il part de{' '}
                    <strong>la date à laquelle le remboursement était dû</strong>. Si le prêt se
                    rembourse en plusieurs fois, chaque échéance a son propre délai, qui part de sa
                    date. Les plus anciennes peuvent donc être hors délai avant les autres.
                    N’attends pas la fin de l’échéancier.
                  </p>
                  <Legal>
                    Articles 2224 et 2233 du Code civil · Cour de cassation, 1re civ., 11 février
                    2016, n° 14-28.383 · à faire valider par notre conseil
                  </Legal>
                </>
              )}
            </div>
          </div>

          <ol className={styles.steps} aria-label={t.stepsAria}>
            {STEPS[lang].map((s, i) => (
              <li
                key={s.title}
                className={`${styles.step} ${s.warn ? styles.stepWarn : ''}`}
                data-reveal
              >
                <div className={styles.rail}>
                  <span className={styles.num}>{i + 1}</span>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.chip}>
                      <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                      {s.key}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <div className={styles.cardBody}>{s.body}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- Coût --- */}
      <section className={`${styles.section} ${styles.tint}`} id="couts">
        <div className={styles.narrow}>
          <div className={styles.prose} data-reveal>
            <h2 className={styles.h2}>{t.costTitle}</h2>
            {en ? (
              <>
                <p>
                  You pay the costs up front. If the judge accepts your claim, they can{' '}
                  <strong>put them on the person who didn’t pay</strong>. The costs of a saisie are
                  in principle theirs. What you spend before you hold a decision that allows
                  enforcement stays in principle yours, unless the law requires you to take the
                  step.
                </p>
                <Legal>
                  Article L. 111-8 of the Code des procédures civiles d’exécution · to be validated
                  by our legal counsel
                </Legal>
                <p>
                  The main cost is having the ordonnance served. The commissaire de justice’s fee is
                  set by regulation and depends on the amount claimed. The base is €25.79:
                </p>
              </>
            ) : (
              <>
                <p>
                  Tu avances les frais. Si le juge accepte ta demande, il peut{' '}
                  <strong>les mettre à la charge de la personne qui n’a pas payé</strong>. Les frais
                  de saisie sont en principe pour elle. Ce que tu dépenses avant d’avoir une
                  décision qui permet de faire saisir reste en principe à ta charge, sauf si la loi
                  t’impose la démarche.
                </p>
                <Legal>
                  Article L. 111-8 du Code des procédures civiles d’exécution · à faire valider par
                  notre conseil
                </Legal>
                <p>
                  Le principal coût est la remise de l’ordonnance. Le tarif du commissaire de
                  justice est fixé par la réglementation et dépend du montant réclamé. La base est
                  de 25,79&nbsp;€&nbsp;:
                </p>
              </>
            )}
          </div>

          <ul className={styles.fees} data-reveal>
            {FEES[lang].map((f) => (
              <li key={f.range} className={styles.fee}>
                <span className={styles.feeFactor} aria-hidden="true">
                  {f.factor}
                </span>
                <span className={styles.feeRange}>{f.range}</span>
                <span className={styles.feeValue}>{f.value}</span>
              </li>
            ))}
          </ul>

          <div className={styles.prose} data-reveal>
            {en ? (
              <>
                <p>
                  On top of that come a flat travel charge and VAT, sometimes extras such as
                  postage. Each further step, a saisie for instance, has its own cost.{' '}
                  <strong>Ask for a quote before you start.</strong>
                </p>
                <Legal>
                  Articles A. 444-11, A. 444-46 and A. 444-48 of the Code de commerce · indicative
                  amounts · to be validated by our legal counsel
                </Legal>
              </>
            ) : (
              <>
                <p>
                  S’ajoutent un forfait de déplacement et la TVA, parfois des frais divers comme
                  l’affranchissement. Chaque acte suivant, comme une saisie, a son coût.{' '}
                  <strong>Demande un devis avant de te lancer.</strong>
                </p>
                <Legal>
                  Articles A. 444-11, A. 444-46 et A. 444-48 du Code de commerce · montants
                  indicatifs · à faire valider par notre conseil
                </Legal>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- Acte notarié --- */}
      <section className={`${styles.section} ${styles.white}`} id="notaire">
        <div className={styles.narrow}>
          <h2 className={styles.h2} data-reveal>
            {t.notaryTitle}
          </h2>

          <div className={styles.compare}>
            <article className={styles.compareCard} data-reveal="left">
              <span className={styles.compareIcon} aria-hidden="true">
                <i className="fa-solid fa-stamp" />
              </span>
              <h3>{t.notaryCard}</h3>
              {en ? (
                <p>
                  A loan signed before a notaire can carry the official wording that allows
                  enforcement without going before a judge again. If it isn’t repaid, you still have
                  to send a mise en demeure. A commissaire de justice can then recover the money,
                  for instance by a seizure on a bank account. An acte notarié has a cost: ask for a
                  quote.
                </p>
              ) : (
                <p>
                  Un prêt signé devant notaire peut porter la mention officielle qui permet de faire
                  saisir sans repasser devant un juge. S’il n’est pas remboursé, il faut quand même
                  envoyer une mise en demeure. Un commissaire de justice peut ensuite récupérer la
                  somme, par exemple par une saisie sur compte bancaire. Un acte notarié a un
                  coût&nbsp;: demande un devis.
                </p>
              )}
            </article>
            <article
              className={`${styles.compareCard} ${styles.compareZen}`}
              data-reveal="right"
            >
              <span className={styles.compareIcon} aria-hidden="true">
                <i className="fa-solid fa-file-signature" />
              </span>
              <h3>{t.zenCard}</h3>
              {en ? (
                <p>
                  The acknowledgement of debt signed with TilliT Zen proves what you both decided,
                  and on which dates. It does not allow enforcement on its own: for that, you have
                  to go before a judge, or to have signed before a notaire.
                </p>
              ) : (
                <p>
                  La reconnaissance de dette signée avec TilliT Zen prouve ce que vous avez décidé,
                  et à quelles dates. Elle ne permet pas de faire saisir directement&nbsp;: pour
                  cela, il faut passer par un juge, ou avoir signé devant notaire.
                </p>
              )}
            </article>
          </div>

          <div className={styles.info} data-reveal>
            <span className={styles.infoIcon} aria-hidden="true">
              <i className="fa-solid fa-circle-info" />
            </span>
            {en ? (
              <p>
                <strong>This page is for information.</strong> It describes a general procedure, to
                be adapted to your situation, and several points call for a professional opinion. In
                a real dispute, see a lawyer or a point-justice, the local legal information
                service: the first consultation there is often free.
              </p>
            ) : (
              <p>
                <strong>Cette page est informative.</strong> Elle décrit une procédure générale, à
                adapter à ta situation, et plusieurs points demandent l’avis d’un professionnel. En
                cas de litige réel, consulte un avocat ou un point-justice&nbsp;: la première
                consultation y est souvent gratuite.
              </p>
            )}
          </div>

          <div className={styles.sources} data-reveal>
            <h2>
              <i className="fa-solid fa-book" aria-hidden="true" /> {t.sourcesTitle}
            </h2>
            <p>{t.sourcesText}</p>
            <p className={styles.sourcesNote}>{t.sourcesNote}</p>
          </div>

          <div className={styles.post} data-reveal>
            <h3>{t.postTitle}</h3>
            <p>{t.postText}</p>
            <Link to={l('/tarifs')} className={styles.postBtn}>
              {t.postBtn}
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
