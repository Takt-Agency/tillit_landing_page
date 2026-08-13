import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', email: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) return;
    const body = encodeURIComponent(
      `Prénom : ${form.firstName}\nEmail : ${form.email}\n\nJe souhaite être prévenu·e du lancement de tillit.`,
    );
    window.location.href = `mailto:tillit@tillitapp.fr?subject=${encodeURIComponent(
      'Waitlist tillit — Prévenez-moi du lancement',
    )}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3200);
  };

  return (
    <section
      className={styles.section}
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.card} data-reveal>
          <header className={styles.head}>
            <span className={styles.mascotBadge} aria-hidden="true">
              <i className="fa-solid fa-face-smile-beam" />
            </span>
            <div className={styles.headText}>
              <h2 id="contact-title" className={styles.title}>
                <span className={styles.brand}>tillit</span> arrive bientôt.
              </h2>
              <p className={styles.lead}>
                Nous construisons la manière la plus simple d'organiser un prêt
                d'argent entre proches, sans malaise ni relances gênantes.
              </p>
            </div>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Prénom</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Alex"
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@exemple.com"
                  className={styles.input}
                  required
                />
              </label>
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                className={styles.submit}
                disabled={sent || !form.firstName.trim() || !form.email.trim()}
              >
                {sent ? (
                  <>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                    Merci, à très vite !
                  </>
                ) : (
                  'Me prévenir du lancement'
                )}
              </button>
              <p className={styles.note}>
                Quelques clics pour nous aider à construire une application vraiment
                utile. <strong>Pas de spam</strong>, désinscription en un clic.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
