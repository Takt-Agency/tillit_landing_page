import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import styles from './Recours.module.css';

const easeOut = [0.2, 0.9, 0.3, 1] as const;

type Step = {
  n: string;
  title: string;
  desc: string;
  ref: string;
  icon: string;
  warn?: boolean;
};

const STEPS: Step[] = [
  {
    n: '1',
    title: 'La mise en demeure',
    desc: "Une lettre recommandée avec accusé de réception qui rappelle la somme, la date d'échéance dépassée, et demande le paiement sous un délai précis. Ce n'est pas une formalité : c'est elle qui fait courir les intérêts de retard et qui prouve que tu as réclamé.",
    ref: 'Article 1344 du Code civil',
    icon: 'fa-solid fa-envelope-open-text',
  },
  {
    n: '2',
    title: 'La conciliation, si la somme est inférieure à 5 000 €',
    desc: "En dessous de ce seuil, tenter une conciliation ou une médiation est obligatoire avant de saisir un juge. Ce n'est pas une punition : un conciliateur de justice est gratuit, et beaucoup de dossiers se règlent là. Sans cette tentative, ta demande sera rejetée sans être examinée.",
    ref: 'Article 750-1 du Code de procédure civile',
    icon: 'fa-solid fa-handshake',
  },
  {
    n: '3',
    title: 'La requête en injonction de payer',
    desc: "C'est le cœur du dispositif. Tu déposes une requête au greffe du tribunal judiciaire, avec ta reconnaissance de dette et les preuves de non-paiement. Pas d'avocat, pas d'audience : un juge examine ton dossier sur pièces et rend une ordonnance. Cette procédure est aussi exonérée de la contribution de 50 € qui s'applique à d'autres saisines.",
    ref: 'Articles 1405 et 1407 du Code de procédure civile · art. 1635 bis Q du CGI',
    icon: 'fa-solid fa-gavel',
  },
  {
    n: '4',
    title: 'La signification, l\'étape où les dossiers meurent',
    desc: "Une fois l'ordonnance obtenue, tu dois la faire remettre officiellement à la personne par un commissaire de justice (l'ancien huissier). Tu as trois mois. Passé ce délai, l'ordonnance est nulle et tout est à refaire. C'est l'erreur la plus fréquente. Le délai est passé de six à trois mois. Et si la personne conteste, tu devras présenter l'original de l'acte de signification à l'audience : sans lui, ta demande est irrecevable, même si tu as raison sur le fond.",
    ref: 'Décret n° 2026-96 du 16 février 2026 · article 1418 du Code de procédure civile',
    icon: 'fa-solid fa-triangle-exclamation',
    warn: true,
  },
  {
    n: '5',
    title: "L'exécution",
    desc: "Si la personne ne conteste pas dans les deux mois qui suivent la signification, l'ordonnance devient définitive. Le commissaire de justice peut alors procéder à une saisie sur compte bancaire ou sur salaire.",
    ref: "Article L. 111-3 du Code des procédures civiles d'exécution",
    icon: 'fa-solid fa-scale-balanced',
  },
];

const COSTS = [
  { range: 'Moins de 128 € réclamés', price: '18 à 27 €' },
  { range: 'De 128 € à 1 280 €', price: '31 à 42 €' },
  { range: 'Plus de 1 280 €', price: '62 à 73 €' },
];

const SOURCES = [
  'Code civil, articles 1344 (mise en demeure) et 2224 (prescription).',
  'Code de procédure civile, articles 750-1 (conciliation préalable), 1405, 1407 et 1418 (injonction de payer).',
  "Code des procédures civiles d'exécution, articles L. 111-3 et L. 111-8.",
  'Code général des impôts, article 1635 bis Q (exonération de contribution).',
  'Décret n° 2026-96 du 16 février 2026 (délais de signification).',
];

export default function Recours() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className={styles.hero} id="recours-hero">
        <div className={styles.heroBlob1} aria-hidden="true" />
        <div className={styles.heroBlob2} aria-hidden="true" />

        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <span className={styles.kicker}>
            <i
              className="fa-solid fa-triangle-exclamation"
              aria-hidden="true"
            />{' '}
            Si ça tourne mal
          </span>
          <h1 className={styles.heroTitle}>
            On ne te rembourse pas.{' '}
            <span className={styles.heroAccent}>
              Voilà ce que tu peux faire.
            </span>
          </h1>
          <p className={styles.heroLead}>
            Personne ne prête en pensant en arriver là. Mais si ça arrive, il
            existe une procédure simple, peu coûteuse, et qui ne demande pas
            d'avocat. Elle s'appelle{' '}
            <strong>l'injonction de payer</strong>.
          </p>
        </motion.div>
      </section>

      {/* ─── D'abord, la bonne nouvelle ─── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.goodNews}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.goodNewsIcon} aria-hidden="true">
              <i className="fa-solid fa-lightbulb" />
            </span>
            <div>
              <p className={styles.goodNewsLabel}>D'abord, la bonne nouvelle</p>
              <p className={styles.goodNewsText}>
                Une procédure de ce type repose entièrement sur ta capacité à
                prouver trois choses : <b>qu'il y a eu un prêt</b>, pour{' '}
                <b>quel montant</b>, et <b>qu'il devait être remboursé à
                telle date</b>. Si tu es passé par tillit, tu as déjà les
                trois. C'est exactement pour ce moment-là que l'application
                existe.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Les cinq étapes ─── */}
      <section
        className={`${styles.section} ${styles.sectionAlt}`}
        id="etapes"
        aria-labelledby="etapes-title"
      >
        <div className={styles.container}>
          <motion.header
            className={styles.head}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.eyebrow}>La procédure</span>
            <h2 id="etapes-title" className={styles.sectionTitle}>
              Les cinq étapes,{' '}
              <span className={styles.titleAccent}>dans l'ordre.</span>
            </h2>
            <p className={styles.sectionLead}>
              Ne saute pas d'étape : chacune conditionne la suivante. Un juge
              refusera un dossier qui commence directement au tribunal.
            </p>
          </motion.header>

          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                className={`${styles.step} ${step.warn ? styles.stepWarn : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  ease: easeOut,
                  delay: i * 0.05,
                }}
              >
                <div className={styles.stepBadge}>
                  <span className={styles.stepNum}>{step.n}</span>
                  <span className={styles.stepIcon} aria-hidden="true">
                    <i className={step.icon} />
                  </span>
                </div>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                  <p className={styles.stepRef}>
                    <i
                      className="fa-solid fa-book"
                      aria-hidden="true"
                    />
                    {step.ref}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Combien ça coûte ─── */}
      <section className={styles.section} aria-labelledby="costs-title">
        <div className={styles.container}>
          <motion.header
            className={styles.head}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.eyebrow}>Le coût</span>
            <h2 id="costs-title" className={styles.sectionTitle}>
              Combien{' '}
              <span className={styles.titleAccent}>ça coûte.</span>
            </h2>
            <p className={styles.sectionLead}>
              Les frais sont en principe à la charge de la personne qui n'a
              pas payé, mais tu dois les avancer. L'essentiel du coût est la
              signification par commissaire de justice, qui dépend du montant
              réclamé.
            </p>
          </motion.header>

          <ul className={styles.costs}>
            {COSTS.map((c) => (
              <li key={c.range} className={styles.costRow}>
                <span className={styles.costRange}>{c.range}</span>
                <span className={styles.costPrice}>≈ {c.price}</span>
              </li>
            ))}
          </ul>

          <p className={styles.costRef}>
            Article L. 111-8 du Code des procédures civiles d'exécution ·
            montants indicatifs.
          </p>
        </div>
      </section>

      {/* ─── Prescription 5 ans ─── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <motion.div
            className={styles.callout}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-hourglass-half" />
            </span>
            <div>
              <p className={styles.calloutTitle}>
                Tu as cinq ans, pas plus.
              </p>
              <p className={styles.calloutText}>
                Le délai pour agir est de <b>cinq ans</b>. Il ne part pas de la
                signature du prêt mais de la date à laquelle le remboursement
                était dû. C'est une raison de plus de fixer des échéances
                datées plutôt qu'un «&nbsp;quand tu peux&nbsp;» qui ne fait
                jamais courir le compteur.
              </p>
              <p className={styles.calloutRef}>
                Article 2224 du Code civil
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Acte notarié ─── */}
      <section className={styles.section} aria-labelledby="notaire-title">
        <div className={styles.container}>
          <motion.div
            className={styles.tradeoff}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.eyebrow}>L'alternative</span>
            <h2 id="notaire-title" className={styles.sectionTitle}>
              Et l'acte notarié,{' '}
              <span className={styles.titleAccent}>alors ?</span>
            </h2>
            <p className={styles.tradeoffText}>
              Un prêt passé devant notaire permet de sauter toute la
              procédure judiciaire : c'est un <b>titre exécutoire</b>, on va
              directement à la saisie. Mais il coûte environ{' '}
              <b>125 €</b> plus les émoluments, souvent plus cher que la
              somme prêtée entre proches.
            </p>
            <p className={styles.tradeoffText}>
              C'est le vrai arbitrage : la reconnaissance de dette{' '}
              <b>tillit Zen</b> prouve l'accord et son contenu, et te permet
              de gagner une injonction de payer. Elle ne remplace pas un acte
              notarié, qui seul permet de saisir sans passer par un juge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Zen CTA ─── */}
      <section className={styles.zenCta} aria-labelledby="zen-cta-title">
        <div className={styles.zenInner}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span className={styles.zenBadge}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />{' '}
              tillit Zen
            </span>
            <h2 id="zen-cta-title" className={styles.zenTitle}>
              Avec Zen, le dossier est{' '}
              <span className={styles.zenAccent}>déjà prêt.</span>
            </h2>
            <p className={styles.zenLead}>
              Reconnaissance de dette signée, identités vérifiées, échéancier
              daté, historique des remboursements. C'est exactement ce qu'un
              juge demande.
            </p>
            <Link to="/tarifs" className={styles.zenBtn}>
              Voir ce que coûte Zen{' '}
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Disclaimer + sources ─── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.disclaimer}>
            <span className={styles.disclaimerIcon} aria-hidden="true">
              <i className="fa-solid fa-circle-info" />
            </span>
            <p>
              <b>Cette page est informative.</b> Elle décrit une procédure
              générale, pas ta situation. Plusieurs points demandent l'avis
              d'un professionnel : la notion d'impossibilité morale entre
              proches, le cas de plusieurs emprunteurs, ou la résidence à
              l'étranger de l'une des parties. En cas de litige réel, consulte
              un avocat ou un point-justice : la première consultation y est
              souvent gratuite.
            </p>
          </div>

          <div className={styles.sources}>
            <h3 className={styles.sourcesTitle}>Sources</h3>
            <ol className={styles.sourcesList}>
              {SOURCES.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <p className={styles.sourcesNote}>
              Textes à revérifier avant toute action : les délais et montants
              évoluent. Dernière mise à jour de cette page : août 2026.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
