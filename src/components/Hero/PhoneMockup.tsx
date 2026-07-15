import styles from './PhoneMockup.module.css';
import mockupUrl from '../../Mockup phone.png';

export default function PhoneMockup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.glow} aria-hidden="true" />
      <img
        src={mockupUrl}
        alt="Aperçu de l'application TilliT — écran d'accueil avec le solde à rembourser et la liste des prêts entre proches."
        className={styles.image}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
