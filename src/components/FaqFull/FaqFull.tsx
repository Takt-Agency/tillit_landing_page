import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './FaqFull.module.css';
import { THEMES, type Role } from './faqData';
import { askAssistant } from '../../lib/assistant';
import { fr } from '../../lib/typo';

export default function FaqFull() {
  const [role, setRole] = useState<Role>('p');
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const themes = THEMES;

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
      setError('Écris ta question avant de l’envoyer.');
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
          <div className={styles.roles} role="tablist" aria-label="Ton rôle">
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
                {r === 'p' ? 'Je prête' : 'J’emprunte'}
              </button>
            ))}
          </div>

          <nav className={styles.themesNav} aria-label="Thèmes de la FAQ">
            <ul>
              {visible.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={styles.themeChip}>
                    <i className={`fa-solid ${t.icon}`} aria-hidden="true" />
                    {t.title}
                    <span className={styles.themeCount}>{t.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div id="faq-questions" role="tabpanel" className={styles.panel}>
          {visible.map((t) => (
            <div key={t.id} className={styles.theme}>
              <h2 className={styles.themeTitle} id={t.id}>
                <span className={styles.themeIcon} aria-hidden="true">
                  <i className={`fa-solid ${t.icon}`} />
                </span>
                {t.title}
              </h2>
              <ol className={styles.list}>
                {t.items.map((it) => {
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
                          <span className={styles.q}>{fr(it.q)}</span>
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
          <h2 className={styles.askTitle}>Une autre question&nbsp;?</h2>
          <p className={styles.askText}>Notre assistant TilliT est là pour t’aider.</p>
          <form className={styles.askForm} onSubmit={submit} noValidate>
            <label className="sr-only" htmlFor="faq-question">
              Ta question
            </label>
            <div className={styles.askField}>
              <input
                id="faq-question"
                type="text"
                placeholder="Ta question"
                autoComplete="off"
                enterKeyHint="send"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                aria-describedby="faq-question-error"
                aria-invalid={Boolean(error)}
              />
              <button type="submit" className={styles.askSend}>
                Envoyer
                <i className="fa-solid fa-paper-plane" aria-hidden="true" />
              </button>
            </div>
            <p className={styles.askError} id="faq-question-error" role="status">
              {error}
            </p>
          </form>
          <a className={styles.askMail} href="mailto:tillit@tillitapp.fr">
            <i className="fa-regular fa-envelope" aria-hidden="true" />
            Nous écrire
          </a>
        </div>

        <div className={styles.final} data-reveal>
          <h2>Deux formules pour organiser ton prêt</h2>
          <p>
            Avec Note, tu ne paies rien pour un prêt jusqu’à 1&nbsp;500&nbsp;€. Zen ajoute une
            reconnaissance de dette signée.
          </p>
          <Link to="/tarifs" className={styles.finalBtn}>
            Découvrir les formules
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
