import { motion } from 'motion/react';
import styles from './TarifsHero.module.css';
import mascotte from '../../mascotte-besoin-aide.png';

const easeOut = [0.2, 0.9, 0.3, 1] as const;

export default function TarifsHero() {
  return (
    <section className={styles.section} id="tarifs-hero">
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <span className={styles.kicker}>
            <i className="fa-solid fa-tag" aria-hidden="true" /> Tarifs
          </span>
          <h1 className={styles.title}>
            Combien coûte{' '}
            <span className={styles.brand}>tillit</span>&nbsp;?
          </h1>
          <p className={styles.lead}>
            L'application est <strong>gratuite</strong>. Créer un prêt en
            quelques minutes, suivre l'échéancier, recevoir des rappels — tout
            ça, sans un euro à sortir.
          </p>
          <p className={styles.leadSecondary}>
            Pour les prêts qui méritent un cadre juridique solide, tu peux
            ajouter une <strong>reconnaissance de dette Zen</strong> avec
            signature électronique certifiée. Un paiement unique, sans
            surprise.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>
              <i className="fa-solid fa-check" aria-hidden="true" /> Sans
              abonnement
            </span>
            <span className={styles.chip}>
              <i className="fa-solid fa-check" aria-hidden="true" /> Sans
              commission
            </span>
            <span className={styles.chip}>
              <i className="fa-solid fa-check" aria-hidden="true" /> Sans
              intérêts
            </span>
          </div>
        </motion.div>

        <motion.div
          className={styles.mascotWrap}
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
        >
          <motion.img
            src={mascotte}
            alt="Mascotte tillit"
            className={styles.mascot}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className={styles.bubble}>
            <span className={styles.bubbleAmount}>0 €</span>
            <span className={styles.bubbleLabel}>pour prêter à un proche</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
