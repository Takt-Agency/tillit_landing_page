import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './FaqFull.module.css';
import { THEMES, THEMES_EN, type Role } from './faqData';
import { askAssistant } from '../../lib/assistant';
import { typo, useLang, useLocalize } from '../../i18n';

const COPY = {
  fr: {
    rolesLabel: 'Ton rôle',
    roles: { p: 'Je prête', e: 'J’emprunte' },
    themesLabel: 'Thèmes de la FAQ',
    emptyError: 'Écris ta question avant de l’envoyer.',
    askTitle: 'Une autre question\u00a0?',
    askText: 'Notre assistant TilliT est là pour t’aider.',
    askLabel: 'Ta question',
    askSend: 'Envoyer',
    askMail: 'Nous écrire',
    finalTitle: 'Deux formules pour organiser ton prêt',
    finalText:
      'Avec Note, tu ne paies rien pour un prêt jusqu’à 1\u00a0500\u00a0€. Zen ajoute une reconnaissance de dette signée.',
    finalBtn: 'Découvrir les formules',
  },
  en: {
    rolesLabel: 'Your role',
    roles: { p: 'I’m lending', e: 'I’m borrowing' },
    themesLabel: 'FAQ themes',
    emptyError: 'Write your question before sending it.',
    askTitle: 'Another question?',
    askText: 'Our TilliT assistant answers in French, on the French version of this page.',
    askLabel: 'Your question',
    askSend: 'Send',
    askMail: 'Write to us',
    finalTitle: 'Two plans to organise your loan',
    finalText:
      'With Note, you pay nothing for a loan of up to €1,500. Zen adds a signed acknowledgement of debt.',
    finalBtn: 'Discover the plans',
  },
};

export default function FaqFull() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const [role, setRole] = useState<Role>('p');
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const themes = lang === 'en' ? THEMES_EN : THEMES;

  const visible = useMemo(() => {
    let n = 0;
    return themes.map((t) => ({
      ...t,
      items: t.items
        .filter((it) => it.roles.includes(role))
        .map((it) => ({ ...it, n: String(++n).padStart(2, '0') })),
    }));
  }, [themes, role]);

  const toggle = (id: string) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError(t.emptyError);
      return;
    }
    setError('');
    askAssistant(question);
    setQuestion('');
  };

  return (
    <section className={styles.section}>
      <span className={styles.arches} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.controls} data-reveal>
          <div className={styles.roles} role="tablist" aria-label={t.rolesLabel}>
            <span
              className={`${styles.roleThumb} ${role === 'e' ? styles.roleThumbRight : ''}`}
              aria-hidden="true"
            />
            {(['p', 'e'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={role === r}
                aria-controls="faq-questions"
                className={`${styles.role} ${role === r ? styles.roleActive : ''}`}
                onClick={() => setRole(r)}
              >
                <i
                  className={`fa-solid ${r === 'p' ? 'fa-hand-holding-heart' : 'fa-hand-holding-dollar'}`}
                  aria-hidden="true"
                />
                {t.roles[r]}
              </button>
            ))}
          </div>

          <nav className={styles.themesNav} aria-label={t.themesLabel}>
            <ul>
              {visible.map((th) => (
                <li key={th.id}>
                  <a href={`#${th.id}`} className={styles.themeChip}>
                    <i className={`fa-solid ${th.icon}`} aria-hidden="true" />
                    {th.title}
                    <span className={styles.themeCount}>{th.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div id="faq-questions" role="tabpanel" className={styles.panel}>
          {visible.map((th) => (
            <div key={th.id} className={styles.theme}>
              <h2 className={styles.themeTitle} id={th.id}>
                <span className={styles.themeIcon} aria-hidden="true">
                  <i className={`fa-solid ${th.icon}`} />
                </span>
                {th.title}
              </h2>
              <ol className={styles.list}>
                {th.items.map((it) => {
                  const isOpen = open.has(it.id);
                  return (
                    <li key={it.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                      <h3 className={styles.itemHead}>
                        <button
                          type="button"
                          className={styles.trigger}
                          id={`faq-b-${it.id}`}
                          aria-expanded={isOpen}
                          aria-controls={`faq-p-${it.id}`}
                          onClick={() => toggle(it.id)}
                        >
                          <span className={styles.num} aria-hidden="true">
                            {it.n}
                          </span>
                          <span className={styles.q}>{typo(it.q, lang)}</span>
                          <span className={styles.chev} aria-hidden="true">
                            <i className="fa-solid fa-chevron-down" />
                          </span>
                        </button>
                      </h3>
                      <div
                        className={styles.answerWrap}
                        id={`faq-p-${it.id}`}
                        role="region"
                        aria-labelledby={`faq-b-${it.id}`}
                        hidden={!isOpen}
                      >
                        <div className={styles.answer}>
                          <p>{it.a}</p>
                          {it.legal && (
                            <p className={styles.legal}>
                              <i className="fa-solid fa-scale-balanced" aria-hidden="true" />
                              {it.legal}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>

        <div className={styles.ask} data-reveal>
          <span className={styles.askIcon} aria-hidden="true">
            <i className="fa-solid fa-comments" />
          </span>
          <h2 className={styles.askTitle}>{t.askTitle}</h2>
          <p className={styles.askText}>{t.askText}</p>
          {/* English: the assistant is hidden on /en/ pages, so the card keeps only
              its title and the contact link, as on the English reference site. */}
          {lang === 'fr' && (
            <form className={styles.askForm} onSubmit={submit} noValidate>
              <label className="sr-only" htmlFor="faq-question">
                {t.askLabel}
              </label>
              <div className={styles.askField}>
                <input
                  id="faq-question"
                  type="text"
                  placeholder={t.askLabel}
                  autoComplete="off"
                  enterKeyHint="send"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  aria-describedby="faq-question-error"
                  aria-invalid={Boolean(error)}
                />
                <button type="submit" className={styles.askSend}>
                  {t.askSend}
                  <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                </button>
              </div>
              <p className={styles.askError} id="faq-question-error" role="status">
                {error}
              </p>
            </form>
          )}
          {lang === 'en' ? (
            <Link className={styles.askMail} to={l('/contact#formulaire')}>
              <i className="fa-regular fa-envelope" aria-hidden="true" />
              {t.askMail}
            </Link>
          ) : (
            <a className={styles.askMail} href="mailto:tillit@tillitapp.fr">
              <i className="fa-regular fa-envelope" aria-hidden="true" />
              {t.askMail}
            </a>
          )}
        </div>

        <div className={styles.final} data-reveal>
          <h2>{t.finalTitle}</h2>
          <p>{t.finalText}</p>
          <Link to={l('/tarifs')} className={styles.finalBtn}>
            {t.finalBtn}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
