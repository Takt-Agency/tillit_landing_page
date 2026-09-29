import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Questionnaire.module.css';
import { AUTO_ADVANCE_MS, OTHER_MAX, QUESTIONS, type Question } from './questions';
import { typo, useLang, useLocalize } from '../../i18n';

type Answers = Record<string, string[]>;
type Others = Record<string, string>;

const LAST = QUESTIONS.length - 1;

const COPY = {
  fr: {
    close: 'Fermer',
    thanks: 'Merci !',
    oneLast: 'Une dernière chose pour nous aider ?',
    intro: 'Cinq questions, moins de 30 secondes.',
    go: 'C’est parti',
    skipAll: 'Passer le questionnaire',
    counter: (n: number, total: number) => `Question ${n} / ${total}`,
    skip: 'Passer',
    multi: 'Plusieurs réponses possibles',
    otherSr: 'Précise ta réponse « Autre »',
    otherPh: 'Précise…',
    back: 'Retour',
    hint: 'Choisis une réponse pour continuer.',
    finish: 'Terminer',
    next: 'Continuer',
    clearedOthers: 'Les autres réponses ont été décochées.',
    clearedOne: (answer: string) => `La réponse « ${answer} » a été décochée.`,
  },
  en: {
    close: 'Close',
    thanks: 'Thank you!',
    oneLast: 'One last thing to help us?',
    intro: 'Five questions, under 30 seconds.',
    go: 'Let’s go',
    skipAll: 'Skip the questions',
    counter: (n: number, total: number) => `Question ${n} of ${total}`,
    skip: 'Skip',
    multi: 'You can choose more than one',
    otherSr: 'Tell us more',
    otherPh: 'Tell us more…',
    back: 'Back',
    hint: 'Pick an answer to carry on.',
    finish: 'Finish',
    next: 'Continue',
    clearedOthers: 'The other answers have been cleared.',
    clearedOne: (answer: string) => `The answer “${answer}” has been cleared.`,
  },
};

export default function Questionnaire() {
  const navigate = useNavigate();
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const [step, setStep] = useState<number | 'intro'>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [others, setOthers] = useState<Others>({});
  const [announce, setAnnounce] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef(0);

  const leave = useCallback(() => navigate(l('/confirmation')), [navigate, l]);

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
      setAnnounce(cur.length ? t.clearedOthers : '');
    } else if (q.exclusive && cur.includes(q.exclusive)) {
      next = [value];
      // Announce the label read on screen: in English the value stays French.
      const exclusive = q.options.find((o) => o.value === q.exclusive);
      setAnnounce(t.clearedOne(exclusive ? exclusive.label[lang] : q.exclusive));
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
        <button type="button" className={styles.close} onClick={leave} aria-label={t.close}>
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        {step === 'intro' ? (
          <div className={styles.intro}>
            <span className={styles.introIcon} aria-hidden="true">
              <i className="fa-solid fa-check" />
            </span>
            <h2 id="questionnaire-title" className={styles.introTitle}>
              {t.thanks}
              <span>{t.oneLast}</span>
            </h2>
            <p className={styles.introText}>{t.intro}</p>
            <div className={styles.introActions}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => goTo(0)}
                data-autofocus
              >
                {t.go}
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </button>
              <button type="button" className={styles.ghost} onClick={leave}>
                {t.skipAll}
              </button>
            </div>
          </div>
        ) : (
          q && (
            <div className={styles.question} key={q.field}>
              <div className={styles.top}>
                <p className={styles.counter} aria-live="polite">
                  {t.counter((step as number) + 1, QUESTIONS.length)}
                </p>
                <button type="button" className={styles.skip} onClick={leave}>
                  {t.skip}
                </button>
              </div>
              <div className={styles.bar} aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>

              <fieldset className={styles.fieldset}>
                <legend id="questionnaire-title" className={styles.title}>
                  {typo(q.title[lang], lang)}
                </legend>
                {q.multiple && <p className={styles.hintMulti}>{t.multi}</p>}

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
                        <span>{o.label[lang]}</span>
                      </label>
                    );
                  })}
                </div>

                {q.otherField && selected.includes('Autre') && (
                  <label className={styles.other}>
                    <span className="sr-only">{t.otherSr}</span>
                    <textarea
                      placeholder={t.otherPh}
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
                    {t.back}
                  </button>
                ) : (
                  <span />
                )}
                <div className={styles.next}>
                  {!hasAnswer && <p className={styles.hint}>{t.hint}</p>}
                  <button
                    type="button"
                    className={styles.primary}
                    disabled={!hasAnswer}
                    onClick={() => (step === LAST ? leave() : goTo((step as number) + 1))}
                  >
                    {step === LAST ? t.finish : t.next}
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
