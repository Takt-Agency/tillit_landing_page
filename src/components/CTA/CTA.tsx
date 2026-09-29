import { useState, type FormEvent } from 'react';
import styles from './CTA.module.css';
import mascotUrl from '../../millions-mascotte.png';
import Questionnaire from '../Questionnaire/Questionnaire';

type Status = 'idle' | 'sending' | 'done' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CTA() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!prenom.trim()) return setError('Indique ton prénom.');
    if (!EMAIL_RE.test(email.trim())) return setError('Indique une adresse email valide.');
    setError('');
    setStatus('sending');

    // Netlify Forms only exists once deployed: locally, simulate success so the flow can be tested.
    if (import.meta.env.DEV) {
      setStatus('done');
      return;
    }

    const body = new URLSearchParams({
      'form-name': 'lancement',
      prenom: prenom.trim(),
      email: email.trim(),
      'bot-field': (form.elements.namedItem('bot-field') as HTMLInputElement).value,
    });

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
    } catch {
      setStatus('error');
      setError('L’inscription n’a pas pu être envoyée. Réessaie dans un instant.');
    }
  };

  return (
    <section className={styles.section} id="cta" aria-labelledby="cta-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.card} data-reveal>
          <div className={styles.inner}>
            <span className={styles.eyebrow}>Bientôt disponible</span>
            <h2 id="cta-title" className={styles.title}>
              TilliT arrive bientôt.
            </h2>
            <p className={styles.lead}>
              On construit la manière la plus simple d’organiser un prêt d’argent entre
              proches, sans malaise ni relances gênantes.
            </p>

            {status === 'done' ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon} aria-hidden="true">
                  <i className="fa-solid fa-check" />
                </span>
                <div>
                  <p className={styles.successTitle}>Merci {prenom.trim()}, c’est noté !</p>
                  <p className={styles.successText}>
                    On te prévient par email dès que TilliT est disponible.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className={styles.form}
                name="lancement"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                noValidate
              >
                <input type="hidden" name="form-name" value="lancement" />
                <p className={styles.honeypot} aria-hidden="true">
                  <label>
                    Ne pas remplir <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className={styles.fields}>
                  <label className={styles.field}>
                    <span className="sr-only">Prénom</span>
                    <input
                      type="text"
                      name="prenom"
                      placeholder="Prénom"
                      autoComplete="given-name"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      aria-invalid={error.includes('prénom')}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className="sr-only">Email</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={error.includes('email')}
                    />
                  </label>
                </div>

                <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                      Envoi…
                    </>
                  ) : (
                    'Me prévenir du lancement'
                  )}
                </button>

                <p className={styles.error} role="alert">
                  {error}
                </p>
              </form>
            )}

            <p className={styles.note}>
              Quelques clics pour nous aider à construire une application vraiment utile.
              Pas de spam, désinscription en un clic.
            </p>

            <p className={styles.storesTitle}>Bientôt sur iOS et Android</p>
            <ul className={styles.stores}>
              <li className={styles.store}>
                <i className="fa-brands fa-apple" aria-hidden="true" />
                <span className={styles.storeText}>
                  <span className={styles.storeSmall}>Bientôt</span>
                  <span className={styles.storeBig}>App Store</span>
                </span>
              </li>
              <li className={styles.store}>
                <i className="fa-brands fa-google-play" aria-hidden="true" />
                <span className={styles.storeText}>
                  <span className={styles.storeSmall}>Bientôt</span>
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
                <p className={styles.date}>Jour du lancement</p>
                <div className={styles.notif}>
                  <img src="/favicon.png" alt="" className={styles.notifIcon} />
                  <div className={styles.notifBody}>
                    <p className={styles.notifHead}>
                      <b>TilliT</b>
                      <span>maintenant</span>
                    </p>
                    <p className={styles.notifText}>
                      Ça y est, TilliT est disponible ! Organise ton premier prêt entre proches.
                    </p>
                  </div>
                </div>
                <div className={`${styles.notif} ${styles.notifGhost}`} />
              </div>
            </div>
            <img src={mascotUrl} alt="" className={styles.mascot} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      {status === 'done' && <Questionnaire prenom={prenom.trim()} email={email.trim()} />}
    </section>
  );
}
