import { useEffect, useId, useState } from 'react';
import styles from './InfoTip.module.css';

type Props = { label: string; text: string; light?: boolean };

export default function InfoTip({ label, text, light = false }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

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
      <span id={id} role="tooltip" className={`${styles.bubble} ${open ? styles.open : ''}`}>
        {text}
      </span>
    </span>
  );
}
