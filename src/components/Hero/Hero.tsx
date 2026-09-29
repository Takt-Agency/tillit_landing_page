import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import InfoTip from '../InfoTip/InfoTip';
import coupleUrl from '../../../src/couple-hero.png';
import { useLang, useLocalize, type Lang } from '../../i18n';

type Mode = 'lend' | 'borrow';

type Loan = {
  name: string;
  date: string;
  amount: string;
  status: string;
  tone: 'success' | 'warning' | 'progress';
  color: string;
};

type Card = { balanceLabel: string; balance: string; title: string; loans: Loan[] };

const CARD_DATA: Record<Lang, Record<Mode, Card>> = {
  fr: {
    lend: {
      balanceLabel: 'On te doit',
      balance: '220,00 €',
      title: 'Mes prêts',
      loans: [
        { name: 'Thomas', date: 'Prêt le 12 mars', amount: '150,00 €', status: 'Remboursé', tone: 'success', color: '#4ec18a' },
        { name: 'Sarah', date: 'Avant le 30 juin', amount: '100,00 €', status: 'En attente', tone: 'warning', color: '#ef8068' },
        { name: 'Zahia', date: 'Prêt le 10 avril', amount: '120,00 €', status: 'À venir', tone: 'progress', color: '#a785f0' },
      ],
    },
    borrow: {
      balanceLabel: 'Tu dois',
      balance: '300,00 €',
      title: 'Mes emprunts',
      loans: [
        { name: 'Inès', date: 'Emprunté le 2 mars', amount: '100,00 €', status: 'Remboursé', tone: 'success', color: '#4ec18a' },
        { name: 'Dawe', date: 'Avant le 5 juin', amount: '200,00 €', status: 'En attente', tone: 'warning', color: '#8b63e8' },
        { name: 'Karim', date: 'Emprunté le 18 avril', amount: '100,00 €', status: 'À venir', tone: 'progress', color: '#6bb3f0' },
      ],
    },
  },
  en: {
    lend: {
      balanceLabel: 'You’re owed',
      balance: '€220.00',
      title: 'Money I lent',
      loans: [
        { name: 'Thomas', date: 'Lent on 12 March', amount: '€150.00', status: 'Repaid', tone: 'success', color: '#4ec18a' },
        { name: 'Sarah', date: 'By 30 June', amount: '€100.00', status: 'Pending', tone: 'warning', color: '#ef8068' },
        { name: 'Zahia', date: 'Lent on 10 April', amount: '€120.00', status: 'Upcoming', tone: 'progress', color: '#a785f0' },
      ],
    },
    borrow: {
      balanceLabel: 'You owe',
      balance: '€300.00',
      title: 'Money I borrowed',
      loans: [
        { name: 'Inès', date: 'Borrowed on 2 March', amount: '€100.00', status: 'Repaid', tone: 'success', color: '#4ec18a' },
        { name: 'Dawe', date: 'By 5 June', amount: '€200.00', status: 'Pending', tone: 'warning', color: '#8b63e8' },
        { name: 'Karim', date: 'Borrowed on 18 April', amount: '€100.00', status: 'Upcoming', tone: 'progress', color: '#6bb3f0' },
      ],
    },
  },
};

const COPY = {
  fr: {
    cta1: 'Découvrir les formules',
    cta2: 'Voir comment ça marche',
    interestValue: '0 %',
    interestLabel: "d'intérêt",
    subValue: '0 €',
    subLabel: "d'abonnement",
    lawyerValue: 'Sans avocat',
    lawyerLabel: 'Reconnaissance de dette signée, avec Zen',
    tipLabel: 'Comment la reconnaissance de dette est établie',
    tipText:
      'Ton identité est vérifiée, avec France Identité ou avec FranceConnect. La reconnaissance de dette est signée par le service Goodflag. La date et l’heure de chaque signature sont enregistrées. Aujourd’hui, le document est conservé dix ans. Il faudra passer par un juge pour aller au bout. À faire valider par notre conseil.',
    note: 'Note sans frais, de 100 à 1 500 € par prêt',
    coupleAlt: "Deux proches consultant l'application TilliT avec la mascotte",
    previewLabel: "Aperçu de l'application TilliT",
    seeAll: 'Voir tout',
    lendTab: 'On te doit',
    borrowTab: 'Tu dois',
  },
  en: {
    cta1: 'See the two plans',
    cta2: 'See how it works',
    interestValue: '0%',
    interestLabel: 'interest',
    subValue: '€0',
    subLabel: 'subscription',
    lawyerValue: 'No lawyer',
    lawyerLabel: 'Signed acknowledgement of debt, with Zen',
    tipLabel: 'How the acknowledgement of debt is drawn up',
    tipText:
      'Your identity is checked, with France Identité or with FranceConnect. The acknowledgement of debt is signed through Goodflag. The date and time of each signature are recorded. Today the document is kept for ten years. Going all the way still means going before a judge. To be validated by our legal counsel.',
    note: 'Note is free, from €100 to €1,500 per loan',
    coupleAlt: 'Two friends look at the app together, with the TilliT mascot beside them',
    previewLabel: 'App preview',
    seeAll: 'See all',
    lendTab: 'You’re owed',
    borrowTab: 'You owe',
  },
};

const AUTO_SWITCH_MS = 5000;

export default function Hero() {
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const [mode, setMode] = useState<Mode>('lend');
  const [autoSwitch, setAutoSwitch] = useState(true);
  const card = CARD_DATA[lang][mode];

  useEffect(() => {
    if (!autoSwitch) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setMode((m) => (m === 'lend' ? 'borrow' : 'lend')),
      AUTO_SWITCH_MS,
    );
    return () => window.clearInterval(id);
  }, [autoSwitch]);

  const selectMode = (next: Mode) => {
    setAutoSwitch(false);
    setMode(next);
  };

  return (
    <section className={styles.hero} id="top">
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          {lang === 'en' ? (
            <>
              <h1 className={styles.title}>
                Lend to friends
                <br />
                and family
                <br />
                <span className={styles.titleAccent}>without worry.</span>
              </h1>

              <p className={styles.subtitle}>
                To help out a friend, support your family or fund a project,{' '}
                <strong>
                  TilliT organises the loan, the instalments and the repayments.
                </strong>
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>
                Prêter
                <br />à ses proches
                <br />
                <span className={styles.titleAccent}>sereinement.</span>
              </h1>

              <p className={styles.subtitle}>
                Pour dépanner un ami, aider sa famille ou financer un projet,{' '}
                <strong>
                  TilliT organise simplement le prêt, les échéances et les
                  remboursements.
                </strong>
              </p>
            </>
          )}

          <div className={styles.ctas}>
            <Link className={styles.ctaPrimary} to={l('/tarifs')}>
              {t.cta1}
            </Link>
            <Link className={styles.ctaSecondary} to={l('/comment-ca-marche')}>
              {t.cta2}
            </Link>
          </div>

          <ul className={styles.trustBadges}>
            <li className={styles.trustBadge}>
              <span className={styles.trustIcon} aria-hidden="true">
                <i className="fa-solid fa-percent" />
              </span>
              <span className={styles.trustText}>
                <span className={styles.trustValue}>{t.interestValue}</span>
                <span className={styles.trustLabel}>{t.interestLabel}</span>
              </span>
            </li>
            <li className={styles.trustBadge}>
              <span className={styles.trustIcon} aria-hidden="true">
                <i className="fa-regular fa-credit-card" />
              </span>
              <span className={styles.trustText}>
                <span className={styles.trustValue}>{t.subValue}</span>
                <span className={styles.trustLabel}>{t.subLabel}</span>
              </span>
            </li>
            <li className={`${styles.trustBadge} ${styles.trustBadgeWide}`}>
              <span className={styles.trustIcon} aria-hidden="true">
                <i className="fa-solid fa-shield-halved" />
              </span>
              <span className={styles.trustText}>
                <span className={`${styles.trustValue} ${styles.trustValueAccent}`}>
                  {t.lawyerValue}
                </span>
                <span className={styles.trustLabel}>
                  {t.lawyerLabel}
                  <InfoTip light label={t.tipLabel} text={t.tipText} />
                </span>
              </span>
            </li>
          </ul>

          <p className={styles.note}>
            <i className="fa-solid fa-check-double" aria-hidden="true" />
            {t.note}
          </p>
          {lang === 'en' && (
            <p className={`${styles.note} ${styles.noteNext}`}>
              <i className="fa-solid fa-check-double" aria-hidden="true" />
              <span>
                A <b>French</b> service. Identity with France Identité, loan
                under French law.
              </span>
            </p>
          )}
        </div>

        <div className={styles.visual}>
          <img
            src={coupleUrl}
            alt={t.coupleAlt}
            className={styles.couple}
            loading="eager"
            decoding="async"
            {...{ fetchpriority: 'high' }}
            width={720}
            height={720}
          />

          <div className={styles.loanCard} aria-label={t.previewLabel}>
            <div
              className={`${styles.balance} ${
                mode === 'borrow' ? styles.balanceBorrow : ''
              }`}
            >
              <div>
                <p className={styles.balanceLabel}>{card.balanceLabel}</p>
                <p className={styles.balanceAmount}>{card.balance}</p>
              </div>
              <span className={styles.balanceIcon} aria-hidden="true">
                <i className="fa-solid fa-user-group" />
              </span>
            </div>

            <div className={styles.loansHeader}>
              <p className={styles.loansTitle}>{card.title}</p>
              <span className={styles.loansAll}>{t.seeAll}</span>
            </div>

            <ul className={styles.loanList} key={mode}>
              {card.loans.map((loan) => (
                <li key={loan.name} className={styles.loan}>
                  <span
                    className={styles.loanAvatar}
                    style={{ background: loan.color }}
                    aria-hidden="true"
                  >
                    {loan.name[0]}
                  </span>
                  <div className={styles.loanInfo}>
                    <p className={styles.loanName}>{loan.name}</p>
                    <p className={styles.loanDate}>{loan.date}</p>
                  </div>
                  <div className={styles.loanRight}>
                    <p
                      className={`${styles.loanAmount} ${
                        styles[`amount_${loan.tone}`]
                      }`}
                    >
                      {loan.amount}
                    </p>
                    <span
                      className={`${styles.loanStatus} ${
                        styles[`status_${loan.tone}`]
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.modeSwitch}>
              <button
                type="button"
                className={`${styles.modeBtn} ${
                  mode === 'lend' ? styles.modeBtnActive : ''
                }`}
                aria-pressed={mode === 'lend'}
                onClick={() => selectMode('lend')}
              >
                {t.lendTab}
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${styles.modeBtnBorrow} ${
                  mode === 'borrow' ? styles.modeBtnActive : ''
                }`}
                aria-pressed={mode === 'borrow'}
                onClick={() => selectMode('borrow')}
              >
                {t.borrowTab}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
