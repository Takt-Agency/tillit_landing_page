import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './ScrollTimeline.module.css';

export type TimelineStep = {
  id: string | number;
  number: string;
  title: string;
  description: string;
  visual: ReactNode;
  visualAlt?: string;
};

type Props = {
  steps: TimelineStep[];
  /** Height per step in viewport heights (default: 1 = 100vh per step) */
  stepHeight?: number;
  className?: string;
};

export default function ScrollTimeline({
  steps,
  stepHeight = 1,
  className,
}: Props) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setActive(0);
        return;
      }
      const scrolled = Math.max(0, Math.min(total, -rect.top));
      const progress = scrolled / total;
      const idx = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length),
      );
      setActive(idx);
    };
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [steps.length]);

  const activeStep = steps[active];
  const onRight = active % 2 === 0; // 01, 03 → right | 02, 04 → left

  return (
    <div
      className={`${styles.wrap} ${className ?? ''}`}
      style={{ height: `${steps.length * stepHeight * 100}vh` }}
      ref={sectionRef}
    >
      <div className={styles.pin}>
        <div className={styles.stage}>
          {/* Left slot — card appears here for odd indices (02, 04) */}
          <div className={`${styles.slot} ${styles.slotLeft}`}>
            {!onRight && (
              <article
                key={`left-${active}`}
                className={styles.card}
                aria-current="step"
              >
                <span className={styles.stepNumber}>{activeStep.number}</span>
                <h3 className={styles.stepTitle}>{activeStep.title}</h3>
                <p className={styles.stepDesc}>{activeStep.description}</p>
              </article>
            )}
          </div>

          {/* Center phone / visual — always shows the active step's visual */}
          <div className={styles.visualWrap}>
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`${styles.visualSlot} ${
                  i === active ? styles.visualSlotActive : ''
                }`}
                aria-hidden={i !== active}
              >
                {step.visual}
              </div>
            ))}
          </div>

          {/* Right slot — card appears here for even indices (01, 03) */}
          <div className={`${styles.slot} ${styles.slotRight}`}>
            {onRight && (
              <article
                key={`right-${active}`}
                className={styles.card}
                aria-current="step"
              >
                <span className={styles.stepNumber}>{activeStep.number}</span>
                <h3 className={styles.stepTitle}>{activeStep.title}</h3>
                <p className={styles.stepDesc}>{activeStep.description}</p>
              </article>
            )}
          </div>
        </div>

        {/* Progress indicator (dots at bottom, non-interactive) */}
        <div className={styles.progress} aria-hidden="true">
          {steps.map((step, i) => (
            <span
              key={step.id}
              className={`${styles.dot} ${i <= active ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
