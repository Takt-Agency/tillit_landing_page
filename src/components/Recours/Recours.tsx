import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Recours.module.css';
import PageHero from '../PageHero/PageHero';

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

const STEPS: Step[] = [
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

const FEES = [
  { range: 'Jusqu’à 128 € réclamés', value: 'la moitié de la base', factor: '½' },
  { range: 'Plus de 128 € et jusqu’à 1 280 €', value: 'la base', factor: '×1' },
  { range: 'Plus de 1 280 €', value: 'le double de la base', factor: '×2' },
];

export default function Recours() {
  return (
    <>
      <PageHero
        eyebrow="Si ça tourne mal"
        title={
          <>
            Le remboursement ne vient pas.
            <br />
            Voilà la marche à&nbsp;suivre.
          </>
        }
        lead="Si le remboursement ne se fait toujours pas malgré les relances, il existe une procédure pour demander le paiement à un juge : l’injonction de payer."
      >
        <p className={styles.heroNote}>
          Les informations juridiques de cette page sont en cours de relecture par notre conseil.
        </p>
      </PageHero>

      {/* --- Procédure --- */}
      <section className={`${styles.section} ${styles.white}`} id="etapes">
        <div className={styles.narrow}>
          <div className={styles.callout} data-reveal>
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-folder-open" />
            </span>
            <div>
              <p className={styles.calloutTitle}>Et si l’argent ne revient pas&nbsp;?</p>
              <p className={styles.calloutText}>
                TilliT ne fait pas de recouvrement, et ne remplace pas un avocat. Avec Zen, la
                reconnaissance de dette signée, le montant, l’échéancier et l’historique restent au
                même endroit, à présenter si une démarche devient nécessaire.
              </p>
              <Legal>À faire valider par notre conseil</Legal>
            </div>
          </div>

          <h2 className={styles.h2} data-reveal>
            Les cinq étapes, dans l’ordre
          </h2>

          <div className={styles.delay} data-reveal>
            <span className={styles.delayIcon} aria-hidden="true">
              <i className="fa-solid fa-clock" />
            </span>
            <div>
              <p className={styles.delayTitle}>Le délai pour agir</p>
              <p className={styles.delayText}>
                Le délai pour agir est de cinq ans. Il part de{' '}
                <strong>la date à laquelle le remboursement était dû</strong>. Si le prêt se
                rembourse en plusieurs fois, chaque échéance a son propre délai, qui part de sa
                date. Les plus anciennes peuvent donc être hors délai avant les autres. N’attends
                pas la fin de l’échéancier.
              </p>
              <Legal>
                Articles 2224 et 2233 du Code civil · Cour de cassation, 1re civ., 11 février 2016,
                n° 14-28.383 · à faire valider par notre conseil
              </Legal>
            </div>
          </div>

          <ol className={styles.steps} aria-label="Les cinq étapes de la procédure, dans l’ordre">
            {STEPS.map((s, i) => (
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
            <h2 className={styles.h2}>Combien ça coûte</h2>
            <p>
              Tu avances les frais. Si le juge accepte ta demande, il peut{' '}
              <strong>les mettre à la charge de la personne qui n’a pas payé</strong>. Les frais de
              saisie sont en principe pour elle. Ce que tu dépenses avant d’avoir une décision qui
              permet de faire saisir reste en principe à ta charge, sauf si la loi t’impose la
              démarche.
            </p>
            <Legal>
              Article L. 111-8 du Code des procédures civiles d’exécution · à faire valider par notre
              conseil
            </Legal>
            <p>
              Le principal coût est la remise de l’ordonnance. Le tarif du commissaire de justice
              est fixé par la réglementation et dépend du montant réclamé. La base est de
              25,79&nbsp;€&nbsp;:
            </p>
          </div>

          <ul className={styles.fees} data-reveal>
            {FEES.map((f) => (
              <li key={f.range} className={styles.fee}>
                <span className={styles.feeFactor} aria-hidden="true">
                  {f.factor}
                </span>
                <span className={styles.feeRange}>{f.range}</span>
                <span className={styles.feeValue}>
                  <span className="sr-only">&nbsp;: </span>
                  {f.value}
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.prose} data-reveal>
            <p>
              S’ajoutent un forfait de déplacement et la TVA, parfois des frais divers comme
              l’affranchissement. Chaque acte suivant, comme une saisie, a son coût.{' '}
              <strong>Demande un devis avant de te lancer.</strong>
            </p>
            <Legal>
              Articles A. 444-11, A. 444-46 et A. 444-48 du Code de commerce · montants indicatifs ·
              à faire valider par notre conseil
            </Legal>
          </div>
        </div>
      </section>

      {/* --- Acte notarié --- */}
      <section className={`${styles.section} ${styles.white}`} id="notaire">
        <div className={styles.narrow}>
          <h2 className={styles.h2} data-reveal>
            Et l’acte notarié, alors&nbsp;?
          </h2>

          <div className={styles.compare}>
            <article className={styles.compareCard} data-reveal="left">
              <span className={styles.compareIcon} aria-hidden="true">
                <i className="fa-solid fa-stamp" />
              </span>
              <h3>Acte notarié</h3>
              <p>
                Un prêt signé devant notaire peut porter la mention officielle qui permet de faire
                saisir sans repasser devant un juge. S’il n’est pas remboursé, il faut quand même
                envoyer une mise en demeure. Un commissaire de justice peut ensuite récupérer la
                somme, par exemple par une saisie sur compte bancaire. Un acte notarié a un
                coût&nbsp;: demande un devis.
              </p>
            </article>
            <article
              className={`${styles.compareCard} ${styles.compareZen}`}
              data-reveal="right"
            >
              <span className={styles.compareIcon} aria-hidden="true">
                <i className="fa-solid fa-file-signature" />
              </span>
              <h3>Reconnaissance de dette TilliT Zen</h3>
              <p>
                La reconnaissance de dette signée avec TilliT Zen prouve ce que vous avez décidé, et
                à quelles dates. Elle ne permet pas de faire saisir directement&nbsp;: pour cela, il
                faut passer par un juge, ou avoir signé devant notaire.
              </p>
            </article>
          </div>

          <div className={styles.info} data-reveal>
            <span className={styles.infoIcon} aria-hidden="true">
              <i className="fa-solid fa-circle-info" />
            </span>
            <p>
              <strong>Cette page est informative.</strong> Elle décrit une procédure générale, à
              adapter à ta situation, et plusieurs points demandent l’avis d’un professionnel. En
              cas de litige réel, consulte un avocat ou un point-justice&nbsp;: la première
              consultation y est souvent gratuite.
            </p>
          </div>

          <div className={styles.sources} data-reveal>
            <h2>
              <i className="fa-solid fa-book" aria-hidden="true" /> Sources
            </h2>
            <p>Chaque affirmation de cette page porte sa source juste en dessous.</p>
            <p className={styles.sourcesNote}>
              Textes à revérifier avant toute action&nbsp;: les délais et montants évoluent.
              Dernière mise à jour&nbsp;: 25 septembre 2026.
            </p>
          </div>

          <div className={styles.post} data-reveal>
            <h3>Avec Zen, ta reconnaissance de dette signée reste avec le prêt.</h3>
            <p>Montant, échéancier et historique, au même endroit.</p>
            <Link to="/tarifs" className={styles.postBtn}>
              Voir ce que coûte Zen
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
