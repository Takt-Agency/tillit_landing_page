import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './InfoTip.module.css';

type Props = { label: string; text: string; light?: boolean };

export default function InfoTip({ label, text, light = false }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  // The bubble is centred on the (i); near a screen edge, slide it back inside the viewport.
  useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (!open || !el) return;
    const MARGIN = 12;
    const r = el.getBoundingClientRect();
    const left = r.left - shift;
    const right = r.right - shift;
    let next = 0;
    if (right > window.innerWidth - MARGIN) next = window.innerWidth - MARGIN - right;
    if (left + next < MARGIN) next = MARGIN - left;
    if (next !== shift) setShift(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <span
      className={styles.tip}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${styles.btn} ${light ? styles.btnLight : ''}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        <span aria-hidden="true">i</span>
        <span className="sr-only">{label}</span>
      </button>
      <span
        ref={bubbleRef}
        id={id}
        role="tooltip"
        className={`${styles.bubble} ${open ? styles.open : ''}`}
        style={{ ['--shift' as string]: `${shift}px` }}
      >
        {text}
      </span>
    </span>
  );
}
