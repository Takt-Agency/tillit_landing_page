import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Article.module.css';
import { useLang, useLocalize, type Lang } from '../../i18n';

const COPY: Record<Lang, { back: string; plans: string }> = {
  fr: { back: 'Conseils', plans: 'Découvrir les formules' },
  en: { back: 'Advice', plans: 'See the plans' },
};

type Props = {
  category: string;
  title: ReactNode;
  lead: string;
  cover: string;
  coverAlt: string;
  cta: { title: string; text: string };
  children: ReactNode;
};

export function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.callout}>
      <p className={styles.calloutLabel}>
        <i className="fa-solid fa-quote-left" aria-hidden="true" />
        {label}
      </p>
      <p>{children}</p>
    </div>
  );
}

export function Caveat({ children }: { children: ReactNode }) {
  return (
    <div className={styles.caveat}>
      <i className="fa-solid fa-circle-info" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

export default function ArticleLayout({
  category,
  title,
  lead,
  cover,
  coverAlt,
  cta,
  children,
}: Props) {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.wrap} data-reveal>
          <p className={styles.crumbs}>
            <Link to={l('/blog')}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true" /> {t.back}
            </Link>
            <span aria-hidden="true">·</span>
            {category}
          </p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
        </div>
      </header>

      <div className={styles.wrap}>
        <figure className={styles.cover} data-reveal>
          <img src={cover} alt={coverAlt} width={1290} height={860} />
        </figure>

        <div className={styles.prose}>{children}</div>

        <div className={styles.post} data-reveal>
          <h2>{cta.title}</h2>
          <p>{cta.text}</p>
          <Link to={l('/tarifs')} className={styles.postBtn}>
            {t.plans}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
