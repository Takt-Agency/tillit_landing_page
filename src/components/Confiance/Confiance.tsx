import { motion } from 'motion/react';
import styles from './Confiance.module.css';

const easeOut = [0.2, 0.9, 0.3, 1] as const;

type CarnetItem = {
  eyebrow: string;
  title: string;
  desc: string;
  icon: string;
  color: 'violet' | 'coral' | 'blue';
};

const CARNET_ITEMS: CarnetItem[] = [
  {
    eyebrow: "Ce que c'est",
    title: "Un historique qui t'appartient",
    desc: 'Le nombre de prêts que tu as menés à terme, les échéances tenues, les réaménagements demandés à temps. Des faits, datés.',
    icon: 'fa-solid fa-book-open',
    color: 'violet',
  },
  {
    eyebrow: 'À quoi ça sert',
    title: 'À demander plus facilement',
    desc: "Quand tu proposes un prêt à quelqu'un, tu peux choisir de lui montrer ton Carnet. C'est toi qui décides, à chaque fois.",
    icon: 'fa-solid fa-hand-holding-heart',
    color: 'coral',
  },
  {
    eyebrow: "Ce que ce n'est pas",
    title: 'Un score de solvabilité',
    desc: "Aucune note, aucune lettre, aucun calcul de risque. Ce n'est ni un fichier bancaire, ni un dossier consultable par des tiers.",
    icon: 'fa-solid fa-ban',
    color: 'blue',
  },
];

const SANS_TEMOIN = [
  'Le sujet devient impossible à aborder',
  "Chacun interprète le silence de l'autre",
  "La relation s'éteint avant la dette",
];

const AVEC_TEMOIN = [
  "Ce n'est ni le prêteur ni l'emprunteur qui doit faire le premier pas",
  "Aucun montant, aucun détail ne lui est communiqué",
  'Elle peut refuser ce rôle à tout moment',
];

export default function Confiance() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className={styles.hero} id="confiance-hero">
        <div className={styles.heroBlob1} aria-hidden="true" />
        <div className={styles.heroBlob2} aria-hidden="true" />

        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <span className={styles.kicker}>
            <i className="fa-solid fa-id-badge" aria-hidden="true" /> Le Carnet
            & le Témoin
          </span>
          <h1 className={styles.heroTitle}>
            Ce que tu as fait,{' '}
            <span className={styles.heroAccent}>pas ce que tu vaux.</span>
          </h1>
          <p className={styles.heroLead}>
            Entre proches, on ne se demande pas de garanties. tillit ne t'en
            demandera pas non plus. En revanche, deux mécanismes font en sorte
            que la confiance ne repose pas uniquement sur la mémoire de chacun.
          </p>
        </motion.div>
      </section>

      {/* ─── Carnet de Confiance ─── */}
      <section
        className={styles.section}
        aria-labelledby="carnet-title"
        id="carnet"
      >
        <div className={styles.container}>
          <motion.header
            className={styles.head}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.eyebrow}>Le Carnet de Confiance</span>
            <h2 id="carnet-title" className={styles.sectionTitle}>
              La confiance ne se décrète pas.{' '}
              <span className={styles.titleAccent}>Elle se constate.</span>
            </h2>
            <p className={styles.sectionLead}>
              Chaque prêt mené jusqu'au bout laisse une trace dans ton Carnet.
              Pas une note, pas une lettre, pas un classement : simplement le
              compte de ce qui s'est passé.
            </p>
            <p className={styles.imageCaption}>
              <i
                className="fa-solid fa-quote-left"
                aria-hidden="true"
              />
              Un prêt mené jusqu'au bout ne laisse pas de trace dans la
              relation. Seulement dans ton Carnet.
            </p>
          </motion.header>

          <div className={styles.grid}>
            {CARNET_ITEMS.map((item, i) => (
              <motion.article
                key={item.eyebrow}
                className={`${styles.card} ${styles[`card_${item.color}`]}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  ease: easeOut,
                  delay: i * 0.1,
                }}
                whileHover={{ y: -6 }}
              >
                <span
                  className={`${styles.cardIcon} ${styles[`icon_${item.color}`]}`}
                  aria-hidden="true"
                >
                  <i className={item.icon} />
                </span>
                <span className={styles.cardEyebrow}>{item.eyebrow}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            className={styles.callout}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-shield-halved" />
            </span>
            <p>
              <strong>Trois choses que le Carnet ne fera jamais.</strong> Il
              n'est pas partagé sans ton accord. Il n'est jamais transmis à un
              organisme de crédit ni à un tiers commercial. Et un refus de
              prêt n'y figure pas : dire non à quelqu'un est un droit, pas un
              incident.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Témoin de confiance ─── */}
      <section
        className={`${styles.section} ${styles.sectionAlt}`}
        aria-labelledby="temoin-title"
        id="temoin"
      >
        <div className={styles.container}>
          <motion.header
            className={styles.head}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.eyebrow}>Le Témoin de confiance</span>
            <h2 id="temoin-title" className={styles.sectionTitle}>
              Quand la conversation{' '}
              <span className={styles.titleAccent}>s'arrête d'un coup.</span>
            </h2>
            <p className={styles.sectionLead}>
              Il arrive qu'un remboursement ne s'arrête pas par mauvaise foi,
              mais par gêne. La personne n'ose plus répondre, et plus le
              silence dure, plus il devient difficile à rompre. Le Témoin
              existe pour ce moment précis.
            </p>
            <p className={styles.imageCaption}>
              <i className="fa-solid fa-quote-left" aria-hidden="true" />
              Le témoin ne tranche rien. Il fait seulement en sorte que
              quelqu'un reprenne la parole.
            </p>
          </motion.header>

          <div className={styles.compareGrid}>
            <motion.article
              className={`${styles.compareCard} ${styles.compareCardCoral}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              <span className={styles.compareBadge}>Sans témoin</span>
              <h3 className={styles.compareTitle}>
                Personne ne rouvre la conversation
              </h3>
              <p className={styles.compareDesc}>
                Celui qui a prêté n'ose pas relancer pour ne pas humilier.
                Celui qui doit rembourser n'ose pas expliquer. Les deux
                attendent que l'autre commence.
              </p>
              <ul className={styles.compareList}>
                {SANS_TEMOIN.map((line) => (
                  <li key={line}>
                    <i
                      className="fa-solid fa-xmark"
                      aria-hidden="true"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            <motion.article
              className={`${styles.compareCard} ${styles.compareCardViolet}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
            >
              <span
                className={`${styles.compareBadge} ${styles.compareBadgeViolet}`}
              >
                Avec un témoin
              </span>
              <h3 className={styles.compareTitle}>
                Quelqu'un de neutre reprend le fil
              </h3>
              <p className={styles.compareDesc}>
                Une personne choisie <strong>par vous deux au moment du
                prêt</strong> est prévenue si le silence dure. Elle n'a aucun
                pouvoir : elle rouvre simplement la discussion.
              </p>
              <ul className={styles.compareList}>
                {AVEC_TEMOIN.map((line) => (
                  <li key={line}>
                    <i
                      className="fa-solid fa-check"
                      aria-hidden="true"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </div>

          <motion.div
            className={styles.message}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <div className={styles.messageHead}>
              <span className={styles.messageIcon} aria-hidden="true">
                <i className="fa-solid fa-envelope-open-text" />
              </span>
              <div>
                <p className={styles.messageLabel}>Ce que le témoin reçoit</p>
                <p className={styles.messageSub}>Rien de plus.</p>
              </div>
            </div>
            <blockquote className={styles.messageQuote}>
              «&nbsp;Camille et Thomas t'ont désigné comme témoin d'un accord
              entre eux. Il est en suspens depuis un moment. Peux-tu leur
              proposer d'en reparler&nbsp;?&nbsp;»
            </blockquote>
            <p className={styles.messageNote}>
              Ni la somme, ni les dates, ni qui doit à qui.
            </p>
          </motion.div>

          <motion.div
            className={styles.callout}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className={styles.calloutIcon} aria-hidden="true">
              <i className="fa-solid fa-circle-info" />
            </span>
            <p>
              <strong>Le témoin n'est pas un recours.</strong> Il ne recouvre
              rien, ne juge personne et n'a accès à aucun document. Si le
              dialogue ne reprend pas, la suite se passe ailleurs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Le principe commun ─── */}
      <section
        className={styles.principle}
        aria-labelledby="principe-title"
        id="principe"
      >
        <div className={styles.container}>
          <motion.div
            className={styles.principleInner}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span className={styles.eyebrowLight}>Le principe commun</span>
            <h2 id="principe-title" className={styles.principleTitle}>
              On ne remplace pas la confiance.{' '}
              <span className={styles.principleAccent}>
                On lui donne un cadre.
              </span>
            </h2>
            <p className={styles.principleLead}>
              Le Carnet évite d'avoir à se justifier. Le Témoin évite d'avoir
              à se relancer. Ni l'un ni l'autre ne prétend garantir quoi que
              ce soit : ils rendent seulement moins probable le scénario où
              deux personnes cessent de se parler pour une somme d'argent.
            </p>

            <blockquote className={styles.finalQuote}>
              <i className="fa-solid fa-quote-left" aria-hidden="true" />
              Un rappel automatique est plus simple à recevoir qu'un message
              gêné de quelqu'un que tu aimes.
            </blockquote>
          </motion.div>
        </div>
      </section>
    </>
  );
}
