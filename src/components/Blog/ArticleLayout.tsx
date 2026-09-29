import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Article.module.css';

type Props = {
  category: string;
  title: ReactNode;
  lead: string;
  readTime: string;
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
  readTime,
  cover,
  coverAlt,
  cta,
  children,
}: Props) {
  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.wrap} data-reveal>
          <p className={styles.crumbs}>
            <Link to="/blog">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Conseils
            </Link>
            <span aria-hidden="true">·</span>
            {category}
          </p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          <p className={styles.meta}>
            <i className="fa-regular fa-clock" aria-hidden="true" /> {readTime}
          </p>
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
          <Link to="/tarifs" className={styles.postBtn}>
            Découvrir les formules
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <p className={styles.back}>
          <Link to="/blog">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Tous les conseils
          </Link>
        </p>
      </div>
    </article>
  );
}
