import type { ReactNode } from 'react';
import styles from './PageHero.module.css';
import { typo, useLang } from '../../i18n';

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, lead, children }: Props) {
  const lang = useLang();
  return (
    <header className={styles.hero}>
      <span className={styles.arches} aria-hidden="true" />
      <span className={styles.glowA} aria-hidden="true" />
      <span className={styles.glowB} aria-hidden="true" />
      <div className={styles.inner} data-reveal>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{typeof title === 'string' ? typo(title, lang) : title}</h1>
        <p className={styles.lead}>{typo(lead, lang)}</p>
        {children}
      </div>
    </header>
  );
}

export { styles as pageHeroStyles };
