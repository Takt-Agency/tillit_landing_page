import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './CasUsage.module.css';
import PageHero from '../PageHero/PageHero';
import cafeImg from '../../assets/cas-usage/cas-usage-amis-cafe-1320.webp';
import decapotableImg from '../../assets/cas-usage/cas-usage-amis-decapotable-1460.webp';
import soeursImg from '../../assets/cas-usage/cas-usage-soeurs-canape-1320.webp';
import rentreeImg from '../../assets/cas-usage/cas-usage-rentree.webp';
import demenagementImg from '../../assets/cas-usage/cas-usage-demenagement-cartons-1320.webp';
import cautionImg from '../../assets/cas-usage/cas-usage-caution.webp';

type Role = 'p' | 'e';

type Case = {
  amount: string;
  status: string;
  tone: 'green' | 'violet';
  title: string;
  situation: string;
  benefits: ReactNode[];
  img: string;
  alt: string;
};

const CASES: Record<Role, Case[]> = {
  p: [
    {
      amount: '200 €',
      status: 'Confirmé à deux',
      tone: 'green',
      title: '« Je dépanne un ami de 200 € en fin de mois. »',
      situation: '« Je te rends ça bientôt. » Reste à savoir quand.',
      benefits: [
        'Avec Note, vous choisissez une date et suivez le remboursement ensemble, gratuitement',
      ],
      img: cafeImg,
      alt: 'Deux amis à une table de café',
    },
    {
      amount: '600 €',
      status: 'Rappel envoyé',
      tone: 'violet',
      title: '« J’avance 600 € pour le billet d’avion d’un ami. »',
      situation: 'Tu paies le billet maintenant, il te rembourse après le voyage.',
      benefits: [
        'La date du remboursement est fixée avant que tu paies',
        'Il voit ce qu’il te doit, tu n’as pas à le redire',
      ],
      img: decapotableImg,
      alt: 'Des amis, vus de dos, debout autour d’une décapotable ancienne dans une rue animée',
    },
    {
      amount: '1 200 €',
      status: 'Accepté',
      tone: 'green',
      title: '« J’avance 1 200 € à ma sœur pour son permis. »',
      situation: 'Tu veux l’aider sans que la somme revienne à chaque repas de famille.',
      benefits: [
        'Le montant, les mensualités et la date de fin sont fixés avant le virement',
        'TilliT envoie les rappels',
      ],
      img: soeursImg,
      alt: 'Deux sœurs assises sur un canapé',
    },
  ],
  e: [
    {
      amount: 'il me manque 300 €',
      status: 'Demande envoyée',
      tone: 'violet',
      title: '« Il me manque 300 € pour la rentrée de mon fils. »',
      situation:
        'Demander, c’est souvent le plus dur. Tu arrives avec un montant et des dates, et la conversation est plus simple.',
      benefits: [
        'Tu proposes le montant et les dates. Ton proche accepte, propose autre chose ou refuse',
        'Le prêt est à 0 % d’intérêt',
      ],
      img: rentreeImg,
      alt: 'Un carnet, des crayons et des trombones, prêts pour la rentrée.',
    },
    {
      amount: '800 €',
      status: 'Remboursement confirmé',
      tone: 'green',
      title: '« Mes parents avancent 800 € pour mon déménagement. »',
      situation: 'Tu veux que tout soit clair, pour eux comme pour toi.',
      benefits: [
        'Vous choisissez des dates adaptées à ta situation et suivez ensemble ce qui est remboursé',
        'Au dernier remboursement confirmé, le prêt est marqué comme remboursé pour vous deux',
      ],
      img: demenagementImg,
      alt: 'Des cartons de déménagement empilés, une plante en pot posée dessus.',
    },
    {
      amount: '1 100 €',
      status: 'Signé',
      tone: 'green',
      title: '« Un proche me prête 1 100 € pour la caution. »',
      situation: 'Tu veux montrer que tu prends l’engagement au sérieux.',
      benefits: [
        <>
          Vous voulez aussi un document signé&nbsp;? Avec Zen, vous signez une reconnaissance de
          dette. Elle n’est pas un titre exécutoire. <Link to="/recours">Ce qu’elle permet</Link>
        </>,
        'Le prêt et ses remboursements restent dans ton Carnet de prêt',
      ],
      img: cautionImg,
      alt: 'Une main tient un trousseau de clés devant une porte d’entrée ouverte.',
    },
  ],
};

export default function CasUsage() {
  const [role, setRole] = useState<Role>('p');

  return (
    <>
      <PageHero
        eyebrow="Cas d’usage"
        title={
          <>
            Un prêt, ça se vit.
            <br />
            Voilà comment.
          </>
        }
        lead="Des situations du quotidien, et comment TilliT aide à organiser le prêt."
      />

      <section className={styles.section} id="situations">
        <div className={styles.container}>
          <header className={styles.head} data-reveal>
            <h2 className={styles.title}>Exemples de prêts entre proches</h2>
            <p className={styles.lead}>Choisis le côté où tu te trouves.</p>

            <div className={styles.roles} role="tablist" aria-label="Ton rôle">
              <span
                className={`${styles.roleThumb} ${role === 'e' ? styles.roleThumbRight : ''}`}
                aria-hidden="true"
              />
              {(['p', 'e'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={role === r}
                  aria-controls="cas-liste"
                  className={`${styles.role} ${role === r ? styles.roleActive : ''}`}
                  onClick={() => setRole(r)}
                >
                  <i
                    className={`fa-solid ${
                      r === 'p' ? 'fa-hand-holding-heart' : 'fa-hand-holding-dollar'
                    }`}
                    aria-hidden="true"
                  />
                  {r === 'p' ? 'Je prête' : 'J’emprunte'}
                </button>
              ))}
            </div>
          </header>

          <div id="cas-liste" role="tabpanel" className={styles.list} key={role}>
            {CASES[role].map((c, i) => (
              <article
                key={c.title}
                className={`${styles.case} ${i % 2 ? styles.caseReverse : ''}`}
                style={{ ['--i' as string]: i }}
              >
                <div className={styles.photo}>
                  <img src={c.img} alt={c.alt} loading="lazy" decoding="async" />
                  <span className={styles.amount}>{c.amount}</span>
                </div>
                <div className={styles.text}>
                  <span className={`${styles.status} ${styles[`status_${c.tone}`]}`}>
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                    {c.status}
                  </span>
                  <h3 className={styles.caseTitle}>{c.title}</h3>
                  <p className={styles.situation}>{c.situation}</p>
                  <ul className={styles.benefits}>
                    {c.benefits.map((b, j) => (
                      <li key={j}>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.post} data-reveal>
            <h3>Deux formules pour organiser ton prêt</h3>
            <p>TilliT organise le prêt et son suivi. Il ne garantit pas le remboursement.</p>
            <Link to="/tarifs" className={styles.postBtn}>
              Découvrir les formules
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
