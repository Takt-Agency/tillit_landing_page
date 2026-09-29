import { Link } from 'react-router-dom';
import styles from './Prototype.module.css';
import PageHero, { pageHeroStyles } from '../PageHero/PageHero';
import { useLang, useLocalize } from '../../i18n';

const APP_URL = '/prototype-app/index.html';

const COPY = {
  fr: {
    eyebrow: 'Prototype de l’application',
    titleStart: 'Essaie TilliT',
    titleAccent: 'avant sa sortie.',
    lead: 'Prototype de test de l’application TilliT : prêter de l’argent entre proches, à 0 % d’intérêt.',
    heroNote: 'Aucune donnée réelle, aucun paiement réel. Ce que tu saisis reste sur ton téléphone.',
    tryHere: 'Essayer ici',
    fullscreen: 'Ouvrir en plein écran',
    featuresKicker: 'À tester',
    featuresTitle: 'Ce que tu peux faire',
    features: [
      { icon: 'fa-hand-holding-heart', label: 'Créer un prêt ou une demande' },
      { icon: 'fa-comments', label: 'Négocier le montant et les dates' },
      { icon: 'fa-file-signature', label: 'Signer avec Zen' },
      { icon: 'fa-money-bill-transfer', label: 'Déclarer et confirmer un remboursement' },
      { icon: 'fa-calendar-days', label: 'Décaler une échéance ou payer une partie' },
      { icon: 'fa-book-open', label: 'Consulter ton Carnet de prêt' },
    ],
    frameTitle: 'Prototype de l’application TilliT',
    tipsKicker: 'Bon à savoir',
    tipsTitle: 'Un prototype, pas l’application',
    tips: [
      {
        icon: 'fa-flask',
        text: 'C’est une version de test : aucune donnée réelle, aucun paiement réel.',
      },
      { icon: 'fa-mobile-screen', text: 'Ce que tu saisis reste sur ton téléphone.' },
      {
        icon: 'fa-comment-dots',
        text: 'Un court questionnaire te demande ton avis : il nous aide à l’améliorer.',
      },
    ],
    afterTitle: 'Tu veux la vraie application ?',
    afterText: 'On t’écrit dès l’ouverture de TilliT.',
    afterBtn: 'Être prévenu du lancement',
  },
  en: {
    eyebrow: 'App prototype',
    titleStart: 'Try TilliT',
    titleAccent: 'before it launches.',
    lead: 'A test prototype of the TilliT app: lend money between friends and family, at 0% interest.',
    heroNote: 'No real data, no real payments. What you enter stays on your phone.',
    tryHere: 'Try it here',
    fullscreen: 'Open full screen',
    featuresKicker: 'To try',
    featuresTitle: 'What you can do',
    features: [
      { icon: 'fa-hand-holding-heart', label: 'Create a loan or a request' },
      { icon: 'fa-comments', label: 'Negotiate the amount and the dates' },
      { icon: 'fa-file-signature', label: 'Sign with Zen' },
      { icon: 'fa-money-bill-transfer', label: 'Declare and confirm a repayment' },
      { icon: 'fa-calendar-days', label: 'Move a due date or pay part of it' },
      { icon: 'fa-book-open', label: 'Look through your Carnet de prêt' },
    ],
    frameTitle: 'TilliT app prototype',
    tipsKicker: 'Good to know',
    tipsTitle: 'A prototype, not the app',
    tips: [
      { icon: 'fa-flask', text: 'It’s a test version: no real data, no real payments.' },
      { icon: 'fa-mobile-screen', text: 'What you enter stays on your phone.' },
      {
        icon: 'fa-comment-dots',
        text: 'A short questionnaire asks what you think: it helps us improve it.',
      },
      { icon: 'fa-language', text: 'The prototype itself is in French for now.' },
    ],
    afterTitle: 'Want the real app?',
    afterText: 'We’ll write to you as soon as TilliT opens.',
    afterBtn: 'Get notified at launch',
  },
};

export default function Prototype() {
  const t = COPY[useLang()];
  const l = useLocalize();
  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={
          <>
            {t.titleStart} <span className={pageHeroStyles.accent}>{t.titleAccent}</span>
          </>
        }
        lead={t.lead}
      >
        <p className={styles.heroNote}>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          {t.heroNote}
        </p>
        <div className={styles.heroActions}>
          <a href="#essayer" className={styles.heroPrimary}>
            {t.tryHere}
            <i className="fa-solid fa-arrow-down" aria-hidden="true" />
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener"
            className={styles.heroSecondary}
          >
            {t.fullscreen}
            <i className="fa-solid fa-up-right-from-square" aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <section className={styles.section} id="essayer">
        <div className={styles.container}>
          <aside className={`${styles.side} ${styles.sideLeft}`} data-reveal="left">
            <span className={styles.kicker}>{t.featuresKicker}</span>
            <h2 className={styles.sideTitle}>{t.featuresTitle}</h2>
            <ul className={styles.features}>
              {t.features.map((f) => (
                <li key={f.label}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <i className={`fa-solid ${f.icon}`} />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.stage} data-reveal="zoom">
            <span className={styles.glow} aria-hidden="true" />
            <div className={styles.phone}>
              <span className={styles.notch} aria-hidden="true" />
              <iframe
                className={styles.frame}
                src={APP_URL}
                title={t.frameTitle}
                loading="lazy"
              />
            </div>
            <a href={APP_URL} target="_blank" rel="noopener" className={styles.fullscreen}>
              <i className="fa-solid fa-expand" aria-hidden="true" />
              {t.fullscreen}
            </a>
          </div>

          <aside className={`${styles.side} ${styles.sideRight}`} data-reveal="right">
            <span className={styles.kicker}>{t.tipsKicker}</span>
            <h2 className={styles.sideTitle}>{t.tipsTitle}</h2>
            <div className={styles.tips}>
              {t.tips.map((tip) => (
                <p key={tip.icon}>
                  <i className={`fa-solid ${tip.icon}`} aria-hidden="true" />
                  <span>{tip.text}</span>
                </p>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.after}>
        <div className={styles.post} data-reveal>
          <h2>{t.afterTitle}</h2>
          <p>{t.afterText}</p>
          <Link to={l('/#waitlist')} className={styles.postBtn}>
            {t.afterBtn}
            <i className="fa-solid fa-bell" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
