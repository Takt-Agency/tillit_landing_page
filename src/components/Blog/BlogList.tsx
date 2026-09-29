import { Link } from 'react-router-dom';
import styles from './BlogList.module.css';
import PageHero from '../PageHero/PageHero';
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

const POSTS: Post[] = [
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
];

export default function BlogList() {
  return (
    <>
      <PageHero
        eyebrow="Conseils"
        title="Parler d’argent entre proches."
        lead="Des repères courts et concrets pour prêter, emprunter et rembourser sans abîmer la relation. On écrit comme on parle, et on va au fait."
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {POSTS.map((p, i) => {
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
                        <span className={styles.soon}>En préparation</span>
                      </span>
                    )}
                  </div>
                  <div className={styles.body}>
                    <span className={styles.category}>{p.category}</span>
                    <h3 className={styles.title}>
                      {p.to ? (
                        <Link to={p.to} className={styles.titleLink}>
                          {p.title}
                        </Link>
                      ) : (
                        p.title
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
                          Lire <i className="fa-solid fa-arrow-right" />
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
