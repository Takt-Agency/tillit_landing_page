import { useState, type FormEvent } from 'react';
import styles from './CTA.module.css';
import mascotUrl from '../../millions-mascotte.png';
import Questionnaire from '../Questionnaire/Questionnaire';
import { useLang } from '../../i18n';

type Status = 'idle' | 'done';
type ErrorKey = '' | 'prenom' | 'email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  fr: {
    eyebrow: 'Bientôt disponible',
    title: 'TilliT arrive bientôt.',
    lead: 'On construit la manière la plus simple d’organiser un prêt d’argent entre proches, sans malaise ni relances gênantes.',
    errors: { prenom: 'Prénom requis', email: 'Email invalide' },
    successTitle: (name: string) => `Merci ${name}, c’est noté !`,
    successText: 'On te prévient par email dès que TilliT est disponible.',
    firstName: 'Prénom',
    email: 'Email',
    submit: 'Me prévenir du lancement',
    note: 'Quelques clics pour nous aider à construire une application vraiment utile. Pas de spam, désinscription en un clic.',
    storesTitle: 'Bientôt sur iOS et Android',
    soon: 'Bientôt',
    launchDay: 'Jour du lancement',
    now: 'maintenant',
    notif: 'Ça y est, TilliT est disponible ! Organise ton premier prêt entre proches.',
  },
  en: {
    eyebrow: 'Coming soon',
    title: 'TilliT is on its way.',
    lead: 'We’re building the simplest way to organise a loan between friends and family, with no awkwardness and no uncomfortable reminders.',
    errors: { prenom: 'First name required', email: 'Invalid email' },
    successTitle: (name: string) => `Thank you, ${name}! Your place is saved.`,
    successText: 'We’ll write to you as soon as TilliT opens.',
    firstName: 'First name',
    email: 'Email',
    submit: 'Notify me at launch',
    note: 'A few clicks to help us build an app that’s really useful. No spam, unsubscribe in one click.',
    storesTitle: 'Coming soon on iOS and Android',
    soon: 'Soon',
    launchDay: 'Launch day',
    now: 'now',
    notif: 'That’s it, TilliT is available! Organise your first loan between friends and family.',
  },
};

export default function CTA() {
  const lang = useLang();
  const t = COPY[lang];
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<ErrorKey>('');

  // Static site: nothing is sent to a server, the sign-up is only validated in the browser.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prenom.trim()) return setError('prenom');
    if (!EMAIL_RE.test(email.trim())) return setError('email');
    setError('');
    setStatus('done');
  };

  return (
    <section className={styles.section} id="waitlist" aria-labelledby="cta-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.card} data-reveal>
          <div className={styles.inner}>
            <span className={styles.eyebrow}>{t.eyebrow}</span>
            <h2 id="cta-title" className={styles.title}>
              {t.title}
            </h2>
            <p className={styles.lead}>{t.lead}</p>

            {status === 'done' ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon} aria-hidden="true">
                  <i className="fa-solid fa-check" />
                </span>
                <div>
                  <p className={styles.successTitle}>{t.successTitle(prenom.trim())}</p>
                  <p className={styles.successText}>{t.successText}</p>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fields}>
                  <label className={styles.field}>
                    <span className="sr-only">{t.firstName}</span>
                    <input
                      type="text"
                      name="prenom"
                      placeholder={t.firstName}
                      autoComplete="given-name"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      aria-invalid={error === 'prenom'}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className="sr-only">{t.email}</span>
                    <input
                      type="email"
                      name="email"
                      placeholder={t.email}
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={error === 'email'}
                    />
                  </label>
                </div>

                <button type="submit" className={styles.submit}>
                  {t.submit}
                </button>

                <p className={styles.error} role="alert">
                  {error && t.errors[error]}
                </p>
              </form>
            )}

            <p className={styles.note}>{t.note}</p>

            <p className={styles.storesTitle}>{t.storesTitle}</p>
            <ul className={styles.stores}>
              <li className={styles.store}>
                <i className="fa-brands fa-apple" aria-hidden="true" />
                <span className={styles.storeText}>
                  <span className={styles.storeSmall}>{t.soon}</span>
                  <span className={styles.storeBig}>App Store</span>
                </span>
              </li>
              <li className={styles.store}>
                <i className="fa-brands fa-google-play" aria-hidden="true" />
                <span className={styles.storeText}>
                  <span className={styles.storeSmall}>{t.soon}</span>
                  <span className={styles.storeBig}>Google Play</span>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.phone}>
              <div className={styles.screen}>
                <span className={styles.notch} />
                <p className={styles.clock}>9:41</p>
                <p className={styles.date}>{t.launchDay}</p>
                <div className={styles.notif}>
                  <img src="/favicon.png" alt="" className={styles.notifIcon} />
                  <div className={styles.notifBody}>
                    <p className={styles.notifHead}>
                      <b>TilliT</b>
                      <span>{t.now}</span>
                    </p>
                    <p className={styles.notifText}>{t.notif}</p>
                  </div>
                </div>
                <div className={`${styles.notif} ${styles.notifGhost}`} />
              </div>
            </div>
            <img src={mascotUrl} alt="" className={styles.mascot} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      {status === 'done' && <Questionnaire />}
    </section>
  );
}
