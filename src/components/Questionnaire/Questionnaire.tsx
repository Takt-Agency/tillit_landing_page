import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Questionnaire.module.css';
import { AUTO_ADVANCE_MS, OTHER_MAX, QUESTIONS, type Question } from './questions';
import { fr } from '../../lib/typo';

type Answers = Record<string, string[]>;
type Others = Record<string, string>;

type Props = { prenom: string; email: string };

const LAST = QUESTIONS.length - 1;

export default function Questionnaire({ prenom, email }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<number | 'intro'>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [others, setOthers] = useState<Others>({});
  const [announce, setAnnounce] = useState('');
  const [sending, setSending] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef(0);

  const leave = useCallback(() => navigate('/confirmation'), [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && leave();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      window.clearTimeout(advanceTimer.current);
    };
  }, [leave]);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, [step]);

  const q: Question | null = step === 'intro' ? null : QUESTIONS[step];
  const selected = q ? answers[q.field] ?? [] : [];
  const hasAnswer = selected.length > 0;

  const goTo = (next: number) => {
    setAnnounce('');
    setStep(next);
  };

  const submit = async () => {
    setSending(true);
    const body = new URLSearchParams({ 'form-name': 'questionnaire', prenom, email });
    for (const question of QUESTIONS) {
      body.append(question.field, (answers[question.field] ?? []).join(' ; '));
      if (question.otherField) {
        const wantsOther = (answers[question.field] ?? []).includes('Autre');
        body.append(question.otherField, wantsOther ? others[question.otherField] ?? '' : '');
      }
    }
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    } catch {
      // The sign-up is already saved; answers are optional, so never block the visitor.
    }
    leave();
  };

  const pickSingle = (value: string) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.field]: [value] }));
    window.clearTimeout(advanceTimer.current);
    const current = step as number;
    advanceTimer.current = window.setTimeout(() => goTo(current + 1), AUTO_ADVANCE_MS);
  };

  const toggleMulti = (value: string) => {
    if (!q) return;
    const cur = answers[q.field] ?? [];
    let next: string[];
    if (cur.includes(value)) {
      next = cur.filter((v) => v !== value);
      setAnnounce('');
    } else if (q.exclusive && value === q.exclusive) {
      next = [value];
      setAnnounce(
        cur.length ? `« ${value} » est cochée : les autres réponses ont été décochées.` : '',
      );
    } else if (q.exclusive && cur.includes(q.exclusive)) {
      next = [value];
      setAnnounce(`« ${q.exclusive} » a été décochée.`);
    } else {
      next = [...cur, value];
      setAnnounce('');
    }
    setAnswers((a) => ({ ...a, [q.field]: next }));
  };

  const progress = step === 'intro' ? 0 : ((step + 1) / QUESTIONS.length) * 100;

  return createPortal(
    <div className={styles.overlay} onClick={leave}>
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${q && q.options.length > 7 ? styles.dialogWide : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="questionnaire-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={leave} aria-label="Fermer">
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        {step === 'intro' ? (
          <div className={styles.intro}>
            <span className={styles.introIcon} aria-hidden="true">
              <i className="fa-solid fa-check" />
            </span>
            <h2 id="questionnaire-title" className={styles.introTitle}>
              Merci&nbsp;!
              <span>Une dernière chose pour nous aider&nbsp;?</span>
            </h2>
            <p className={styles.introText}>Cinq questions, moins de 30 secondes.</p>
            <div className={styles.introActions}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => goTo(0)}
                data-autofocus
              >
                C’est parti
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </button>
              <button type="button" className={styles.ghost} onClick={leave}>
                Passer le questionnaire
              </button>
            </div>
          </div>
        ) : (
          q && (
            <div className={styles.question} key={q.field}>
              <div className={styles.top}>
                <p className={styles.counter} aria-live="polite">
                  Question {(step as number) + 1} / {QUESTIONS.length}
                </p>
                <button type="button" className={styles.skip} onClick={leave}>
                  Passer
                </button>
              </div>
              <div className={styles.bar} aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>

              <fieldset className={styles.fieldset}>
                <legend id="questionnaire-title" className={styles.title}>
                  {fr(q.title)}
                </legend>
                {q.multiple && (
                  <p className={styles.hintMulti}>Plusieurs réponses possibles</p>
                )}

                <div className={`${styles.options} ${q.options.length > 7 ? styles.optionsGrid : ''}`}>
                  {q.options.map((o, i) => {
                    const checked = selected.includes(o.value);
                    return (
                      <label
                        key={o.value}
                        className={`${styles.option} ${checked ? styles.optionOn : ''} ${
                          q.multiple ? styles.optionMulti : ''
                        }`}
                      >
                        <input
                          type={q.multiple ? 'checkbox' : 'radio'}
                          name={q.field}
                          value={o.value}
                          checked={checked}
                          onChange={() =>
                            q.multiple ? toggleMulti(o.value) : pickSingle(o.value)
                          }
                          data-autofocus={i === 0 ? true : undefined}
                        />
                        <span className={styles.mark} aria-hidden="true">
                          <i className="fa-solid fa-check" />
                        </span>
                        <span>{o.label}</span>
                      </label>
                    );
                  })}
                </div>

                {q.otherField && selected.includes('Autre') && (
                  <label className={styles.other}>
                    <span className="sr-only">Précise ta réponse « Autre »</span>
                    <textarea
                      placeholder="Précise…"
                      maxLength={OTHER_MAX}
                      rows={3}
                      value={others[q.otherField] ?? ''}
                      onChange={(e) =>
                        setOthers((o) => ({ ...o, [q.otherField!]: e.target.value }))
                      }
                    />
                    <span className={styles.count} aria-hidden="true">
                      {(others[q.otherField] ?? '').length} / {OTHER_MAX}
                    </span>
                  </label>
                )}
              </fieldset>

              <p className="sr-only" role="status" aria-live="polite">
                {announce}
              </p>

              <div className={styles.footer}>
                {(step as number) > 0 ? (
                  <button
                    type="button"
                    className={styles.back}
                    onClick={() => goTo((step as number) - 1)}
                  >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                    Retour
                  </button>
                ) : (
                  <span />
                )}
                <div className={styles.next}>
                  {!hasAnswer && (
                    <p className={styles.hint}>Choisis une réponse pour continuer.</p>
                  )}
                  <button
                    type="button"
                    className={styles.primary}
                    disabled={!hasAnswer || sending}
                    onClick={() => (step === LAST ? submit() : goTo((step as number) + 1))}
                  >
                    {step === LAST ? (sending ? 'Envoi…' : 'Terminer') : 'Continuer'}
                    {step !== LAST && <i className="fa-solid fa-arrow-right" aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>,
    document.body,
  );
}
