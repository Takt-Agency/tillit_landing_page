import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import PageHero from '../components/PageHero/PageHero';
import Footer from '../components/Footer/Footer';
import { typo, useLang, useLocalize } from '../i18n';
import styles from './Contact.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ANSWER_LINKS = [
  { to: '/faq', icon: 'fa-circle-question' },
  { to: '/tarifs', icon: 'fa-tag' },
  { to: '/recours', icon: 'fa-life-ring' },
  { to: '/difference', icon: 'fa-scale-unbalanced' },
];

const COPY = {
  fr: {
    eyebrow: 'Contact',
    title: 'Écris-nous',
    lead: 'Une question, une remarque, une idée : ça nous intéresse.',
    chapo:
      'Tes retours nous aident à améliorer TilliT. Les remarques de ceux qui ont déjà prêté ou emprunté à un proche valent plus que n’importe quelle étude de marché.',
    successTitle: 'Merci, c’est noté\u00a0!',
    successText: 'On te répond par e-mail.',
    emailLabel: 'E-mail',
    emailError: 'Indique une adresse e-mail valide.',
    questionLabel: 'Ta question',
    questionError: 'Écris ta question avant d’envoyer.',
    submit: 'Envoyer ma question',
    note: 'Ton e-mail sert seulement à te répondre.',
    privacy: 'Confidentialité',
    contactTitle: 'Les coordonnées de TilliT',
    answersTitle: 'Les réponses sont peut-être déjà écrites',
    answers: [
      {
        label: 'La FAQ',
        desc: '· banque, versements, fiscalité, litiges, décès',
      },
      { label: 'Les tarifs', desc: '· ce que coûte Zen, et pourquoi' },
      { label: 'Si ça coince', desc: '· la marche à suivre' },
      {
        label: 'Partage de dépenses ou TilliT ?',
        desc: '· ce qui les distingue',
      },
    ],
  },
  en: {
    eyebrow: 'Contact',
    title: 'Write to us',
    lead: 'A question, a remark, an idea: we want to hear it.',
    chapo:
      'Your feedback helps us make TilliT better. A remark from someone who has already lent to a friend, or borrowed from one, is worth more than any market study.',
    successTitle: 'Thanks, got it!',
    successText: 'We’ll reply to you by email.',
    emailLabel: 'Email',
    emailError: 'Write a valid email address, for example name@example.com.',
    questionLabel: 'Your question',
    questionError: 'Write your question before sending it.',
    submit: 'Send my question',
    note: 'Your email is only used to reply to you.',
    privacy: 'Privacy',
    contactTitle: 'How to reach TilliT',
    answersTitle: 'The answer may already be written',
    answers: [
      { label: 'The FAQ', desc: '· banks, transfers, tax, disputes, death' },
      { label: 'Pricing', desc: '· what Zen costs, and why' },
      { label: 'If it gets stuck', desc: '· what to do' },
      { label: 'Expense splitting or TilliT?', desc: '· what sets them apart' },
    ],
  },
};

type Errors = { email?: string; question?: string };

export default function ContactPage() {
  useScrollReveal();
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  // Static site: nothing is sent to a server, the form is only validated in the browser.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = t.emailError;
    if (!question.trim()) next.question = t.questionError;
    setErrors(next);
    if (next.email) {
      document.getElementById('contactEmail')?.focus();
      return;
    }
    if (next.question) {
      document.getElementById('contactQuestion')?.focus();
      return;
    }
    setSent(true);
  };

  return (
    <>
      <main className={styles.main}>
        <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <section className={styles.section}>
          <div className={styles.layout}>
            <div className={styles.card} data-reveal>
              <p className={styles.chapo}>{t.chapo}</p>

              {sent ? (
                <div className={styles.success} role="status">
                  <span className={styles.successIcon} aria-hidden="true">
                    <i className="fa-solid fa-check" />
                  </span>
                  <div>
                    <p className={styles.successTitle}>{t.successTitle}</p>
                    <p className={styles.successText}>{t.successText}</p>
                  </div>
                </div>
              ) : (
                <form className={styles.form} id="formulaire" onSubmit={handleSubmit} noValidate>
                  <label className={styles.label} htmlFor="contactEmail">
                    {t.emailLabel}
                  </label>
                  <input
                    className={styles.field}
                    type="email"
                    id="contactEmail"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby="contactEmailErreur"
                  />
                  <p className={styles.error} id="contactEmailErreur" role="alert">
                    {errors.email}
                  </p>

                  <label className={styles.label} htmlFor="contactQuestion">
                    {t.questionLabel}
                  </label>
                  <textarea
                    className={`${styles.field} ${styles.textarea}`}
                    id="contactQuestion"
                    name="question"
                    rows={5}
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    aria-invalid={errors.question ? true : undefined}
                    aria-describedby="contactQuestionErreur"
                  />
                  <p className={styles.error} id="contactQuestionErreur" role="alert">
                    {errors.question}
                  </p>

                  <button className={styles.submit} type="submit">
                    {t.submit}
                    <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  </button>
                  <p className={styles.note}>
                    <i className="fa-solid fa-lock" aria-hidden="true" />
                    <span>
                      {t.note} <Link to={l('/confidentialite')}>{t.privacy}</Link>
                    </span>
                  </p>
                </form>
              )}
            </div>

            <aside className={styles.aside}>
              <div className={styles.block} data-reveal>
                <h2 className={styles.blockTitle}>{t.contactTitle}</h2>
                <a className={styles.mail} href="mailto:tillit@tillitapp.fr">
                  <span className={styles.mailIcon} aria-hidden="true">
                    <i className="fa-solid fa-envelope" />
                  </span>
                  tillit@tillitapp.fr
                </a>
              </div>

              <div className={styles.block} data-reveal>
                <h2 className={styles.blockTitle}>{t.answersTitle}</h2>
                <ul className={styles.links}>
                  {ANSWER_LINKS.map((a, i) => (
                    <li key={a.to}>
                      <Link to={l(a.to)} className={styles.link}>
                        <span className={styles.linkIcon} aria-hidden="true">
                          <i className={`fa-solid ${a.icon}`} />
                        </span>
                        <span className={styles.linkText}>
                          <span className={styles.linkLabel}>{typo(t.answers[i].label, lang)}</span>{' '}
                          <span className={styles.linkDesc}>{t.answers[i].desc}</span>
                        </span>
                        <i
                          className={`fa-solid fa-arrow-right ${styles.arrow}`}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer onOpenLegal={setLegalTab} />
      <LegalModal tab={legalTab} onClose={() => setLegalTab(null)} onSelectTab={setLegalTab} />
    </>
  );
}
