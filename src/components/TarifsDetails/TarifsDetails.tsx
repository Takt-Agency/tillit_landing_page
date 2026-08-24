import { motion } from 'motion/react';
import styles from './TarifsDetails.module.css';

const easeOut = [0.2, 0.9, 0.3, 1] as const;

type Card = {
  eyebrow: string;
  title: string;
  desc: string;
  icon: string;
  color: 'violet' | 'coral' | 'blue';
};

const CARDS: Card[] = [
  {
    eyebrow: 'Durée',
    title: 'Le prix ne bouge pas avec le temps',
    desc: "Que le prêt se rembourse en 3 mois ou en 5 ans, tu paies le même montant, une seule fois. Ce n'est pas un abonnement.",
    icon: 'fa-solid fa-hourglass-half',
    color: 'violet',
  },
  {
    eyebrow: 'Montant',
    title: "Ce n'est jamais un pourcentage",
    desc: 'Zen ne prend aucune part de la somme prêtée. Le prix couvre la création, la signature et la conservation du document.',
    icon: 'fa-solid fa-percent',
    color: 'coral',
  },
  {
    eyebrow: 'Qui paie',
    title: 'Celui des deux qui le souhaite',
    desc: "Prêteur ou emprunteur, indifféremment. Le payer peut d'ailleurs être une façon de montrer sa bonne foi.",
    icon: 'fa-solid fa-hand-holding-dollar',
    color: 'blue',
  },
];

export default function TarifsDetails() {
  return (
    <section
      className={styles.section}
      id="tarifs-details"
      aria-labelledby="tarifs-details-title"
    >
      <div className={styles.container}>
        <motion.header
          className={styles.head}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className={styles.kicker}>Le principe</span>
          <h2 id="tarifs-details-title" className={styles.title}>
            <span className={styles.amount}>500 €</span> prêtés.{' '}
            <span className={styles.amount}>500 €</span> remboursés.{' '}
            <span className={styles.zero}>0 %</span> d'intérêt.
          </h2>
          <p className={styles.lead}>
            tillit ne prend jamais un centime sur la somme prêtée. Le prix, si
            prix il y a, est fixe et transparent.
          </p>
        </motion.header>

        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <motion.article
              key={card.eyebrow}
              className={`${styles.card} ${styles[`card_${card.color}`]}`}
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
                className={`${styles.icon} ${styles[`icon_${card.color}`]}`}
                aria-hidden="true"
              >
                <i className={card.icon} />
              </span>
              <span className={styles.eyebrow}>{card.eyebrow}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
