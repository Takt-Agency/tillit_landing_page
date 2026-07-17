import { useState } from 'react';
import styles from './Contact.module.css';
import mascotUrl from '../../mascoote avis.png';

const INFO = [
  {
    icon: 'fa-envelope',
    label: 'Écris-nous',
    value: 'tillit@tillitapp.fr',
    href: 'mailto:tillit@tillitapp.fr',
  },
  {
    icon: 'fa-clock',
    label: 'Réponse moyenne',
    value: 'Sous 24 h ouvrées',
  },
  {
    icon: 'fa-location-dot',
    label: 'Basés en',
    value: 'Union européenne 🇪🇺',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`,
    );
    const subject = encodeURIComponent(form.subject || 'Contact TilliT');
    window.location.href = `mailto:tillit@tillitapp.fr?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3200);
  };

  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-title">
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrow}>
            <i className="fa-solid fa-envelope-open-text" aria-hidden="true" />
            Contact
          </span>
          <h2 id="contact-title" className={styles.title}>
            Une question ?{' '}
            <span className={styles.titleAccent}>On est là.</span>
          </h2>
          <p className={styles.lead}>
            L'équipe TilliT te répond avec le sourire — pas de robot, pas de bot,
            juste des humains bienveillants.
          </p>
        </header>

        <div className={styles.grid}>
          <aside className={styles.side} data-reveal="left">
            <div className={styles.mascotCard}>
              <img
                src={mascotUrl}
                alt=""
                aria-hidden="true"
                className={styles.mascot}
              />
              <div className={styles.mascotBubble}>
                <p className={styles.bubbleTitle}>Salut, moi c'est TilliT !</p>
                <p className={styles.bubbleText}>
                  Une remarque, une idée, un bug ? Je fais passer le message.
                </p>
              </div>
            </div>

            <ul className={styles.infoList}>
              {INFO.map((info) => {
                const content = (
                  <>
                    <span className={styles.infoIcon}>
                      <i className={`fa-solid ${info.icon}`} aria-hidden="true" />
                    </span>
                    <div>
                      <p className={styles.infoLabel}>{info.label}</p>
                      <p className={styles.infoValue}>{info.value}</p>
                    </div>
                  </>
                );
                return (
                  <li key={info.label} className={styles.infoItem}>
                    {info.href ? (
                      <a href={info.href} className={styles.infoLink}>
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Ton nom</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Martin"
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Ton email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@exemple.com"
                  required
                  className={styles.input}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Sujet</span>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Une question sur TilliT ZEN…"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Ton message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Raconte-nous tout, on t'écoute 👂"
                required
                rows={5}
                className={styles.textarea}
              />
            </label>

            <button type="submit" className={styles.submit} disabled={sent}>
              {sent ? (
                <>
                  <i className="fa-solid fa-check" aria-hidden="true" />
                  Message envoyé, merci !
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  Envoyer le message
                </>
              )}
            </button>

            <p className={styles.privacy}>
              <i className="fa-solid fa-lock" aria-hidden="true" />
              Ton message reste privé — aucun partage, jamais.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
