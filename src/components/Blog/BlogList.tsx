import { Link } from 'react-router-dom';
import styles from './BlogList.module.css';
import PageHero from '../PageHero/PageHero';
import { typo, useLang, useLocalize, type Lang } from '../../i18n';
import preterCover from '../../amies-canape-rire.webp';
import imprevuCover from '../../assets/amies-canape-ordinateur.webp';

type Post = {
  to?: string;
  cover?: string;
  alt?: string;
  category: string;
  title: string;
  excerpt: string;
  meta: string;
};

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  soon: string;
  read: string;
  posts: Post[];
};

const COPY: Record<Lang, Copy> = {
  fr: {
    eyebrow: 'Conseils',
    title: 'Parler d’argent entre proches.',
    lead: 'Des repères courts et concrets pour prêter, emprunter et rembourser sans abîmer la relation. On écrit comme on parle, et on va au fait.',
    soon: 'En préparation',
    read: 'Lire',
    posts: [
      {
        to: '/article-preter-avant-virement',
        cover: preterCover,
        alt: 'Deux proches en pleine conversation dans un salon',
        category: 'Prêter à un proche',
        title: 'Prêter à un proche : ce qu’il faut poser avant le virement',
        excerpt:
          'Cinq points à régler pendant que tout va bien. C’est le seul moment où c’est facile à dire.',
        meta: '5 min de lecture',
      },
      {
        to: '/article-imprevu-echeancier',
        cover: imprevuCover,
        alt: 'Deux femmes rient sur un canapé, l’une avec un ordinateur portable sur les genoux',
        category: 'Remboursement & imprévus',
        title: 'Quand un proche ne peut plus suivre l’échéancier',
        excerpt:
          'Le silence coûte plus cher que le retard. Comment rouvrir la conversation avant qu’elle ne devienne impossible.',
        meta: '6 min de lecture',
      },
      {
        category: 'Cadre pratique',
        title: 'Reconnaissance de dette entre proches : à quoi sert-elle ?',
        excerpt:
          'Article en cours de rédaction. Il ne sera publié qu’une fois chaque point vérifié auprès de Service-Public.fr et du Code civil.',
        meta: 'Bientôt',
      },
    ],
  },
  en: {
    eyebrow: 'Advice',
    title: 'Talking about money with friends and family.',
    lead: 'Short, concrete pointers to lend, borrow and repay without damaging the relationship. We write the way we talk, and we get to the point.',
    soon: 'In the works',
    read: 'Read',
    posts: [
      {
        to: '/article-preter-avant-virement',
        cover: preterCover,
        alt: 'Two friends deep in conversation in a living room',
        category: 'Lending to a friend',
        title: 'Lending to a friend: what to settle before you transfer the money',
        excerpt:
          'Five things to settle while everything is fine. It’s the only time they’re easy to say.',
        meta: '5 min read',
      },
      {
        to: '/article-imprevu-echeancier',
        cover: imprevuCover,
        alt: 'Two women laugh on a sofa, one with a laptop on her knees',
        category: 'Repayment & setbacks',
        title: 'When a friend can’t keep up with the instalments',
        excerpt:
          'Silence costs more than the delay. How to reopen the conversation before it becomes impossible.',
        meta: '6 min read',
      },
      {
        category: 'The practical side',
        title: 'Acknowledgement of debt between friends and family: what is it for?',
        excerpt:
          'We’re still writing it. It goes live once every point is checked against Service-Public.fr and the Code civil.',
        meta: 'Soon',
      },
    ],
  },
};

export default function BlogList() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {t.posts.map((p, i) => {
              const upcoming = !p.to;
              return (
                <article
                  key={p.title}
                  className={`${styles.post} ${upcoming ? styles.postUpcoming : ''}`}
                  data-reveal
                  style={{ ['--reveal-delay' as string]: `${i * 110}ms` }}
                >
                  <div className={styles.media}>
                    {p.cover ? (
                      <img src={p.cover} alt={p.alt} loading="lazy" decoding="async" />
                    ) : (
                      <span className={styles.placeholder}>
                        <i className="fa-solid fa-pen-nib" aria-hidden="true" />
                        <span className={styles.soon}>{t.soon}</span>
                      </span>
                    )}
                  </div>
                  <div className={styles.body}>
                    <span className={styles.category}>{p.category}</span>
                    <h3 className={styles.title}>
                      {p.to ? (
                        <Link to={l(p.to)} className={styles.titleLink}>
                          {typo(p.title, lang)}
                        </Link>
                      ) : (
                        typo(p.title, lang)
                      )}
                    </h3>
                    <p className={styles.excerpt}>{p.excerpt}</p>
                    <div className={styles.foot}>
                      <span className={styles.meta}>
                        <i
                          className={`fa-regular ${upcoming ? 'fa-hourglass' : 'fa-clock'}`}
                          aria-hidden="true"
                        />
                        {p.meta}
                      </span>
                      {p.to && (
                        <span className={styles.read} aria-hidden="true">
                          {t.read} <i className="fa-solid fa-arrow-right" />
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
