import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import InfoTip from '../InfoTip/InfoTip';
import coupleUrl from '../../../src/couple-hero.png';

type Mode = 'lend' | 'borrow';

type Loan = {
  name: string;
  date: string;
  amount: string;
  status: string;
  tone: 'success' | 'warning' | 'progress';
  color: string;
};

const CARD_DATA: Record<
  Mode,
  { balanceLabel: string; balance: string; title: string; loans: Loan[] }
> = {
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
};

const AUTO_SWITCH_MS = 5000;

export default function Hero() {
  const [mode, setMode] = useState<Mode>('lend');
  const [autoSwitch, setAutoSwitch] = useState(true);
  const card = CARD_DATA[mode];

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

          <div className={styles.ctas}>
            <Link className={styles.ctaPrimary} to="/tarifs">
              Découvrir les formules
            </Link>
            <Link className={styles.ctaSecondary} to="/comment-ca-marche">
              Voir comment ça marche
            </Link>
          </div>

          <ul className={styles.trustBadges}>
            <li className={styles.trustBadge}>
              <span className={styles.trustIcon} aria-hidden="true">
                <i className="fa-solid fa-percent" />
              </span>
              <span className={styles.trustText}>
                <span className={styles.trustValue}>0 %</span>
                <span className={styles.trustLabel}>d'intérêt</span>
              </span>
            </li>
            <li className={styles.trustBadge}>
              <span className={styles.trustIcon} aria-hidden="true">
                <i className="fa-regular fa-credit-card" />
              </span>
              <span className={styles.trustText}>
                <span className={styles.trustValue}>0 €</span>
                <span className={styles.trustLabel}>d'abonnement</span>
              </span>
            </li>
            <li className={`${styles.trustBadge} ${styles.trustBadgeWide}`}>
              <span className={styles.trustIcon} aria-hidden="true">
                <i className="fa-solid fa-shield-halved" />
              </span>
              <span className={styles.trustText}>
                <span className={`${styles.trustValue} ${styles.trustValueAccent}`}>
                  Sans avocat
                </span>
                <span className={styles.trustLabel}>
                  Reconnaissance de dette signée, avec&nbsp;Zen
                  <InfoTip
                    light
                    label="Comment la reconnaissance de dette Zen est signée"
                    text="Ton identité est vérifiée, avec France Identité ou avec FranceConnect. La reconnaissance de dette est signée par le service Goodflag. La date et l’heure de chaque signature sont enregistrées. Aujourd’hui, le document est conservé dix ans. Il faudra passer par un juge pour aller au bout. À faire valider par notre conseil."
                  />
                </span>
              </span>
            </li>
          </ul>

          <p className={styles.note}>
            <i className="fa-solid fa-check-double" aria-hidden="true" />
            Note sans frais, de 100 à 1 500 € par prêt
          </p>
        </div>

        <div className={styles.visual}>
          <img
            src={coupleUrl}
            alt="Deux proches consultant l'application TilliT avec la mascotte"
            className={styles.couple}
            loading="eager"
            decoding="async"
            {...{ fetchpriority: 'high' }}
            width={720}
            height={720}
          />

          <div className={styles.loanCard} aria-label="Aperçu de l'application TilliT">
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
              <span className={styles.loansAll}>Voir tout</span>
            </div>

            <ul className={styles.loanList} key={mode}>
              {card.loans.map((l) => (
                <li key={l.name} className={styles.loan}>
                  <span
                    className={styles.loanAvatar}
                    style={{ background: l.color }}
                    aria-hidden="true"
                  >
                    {l.name[0]}
                  </span>
                  <div className={styles.loanInfo}>
                    <p className={styles.loanName}>{l.name}</p>
                    <p className={styles.loanDate}>{l.date}</p>
                  </div>
                  <div className={styles.loanRight}>
                    <p
                      className={`${styles.loanAmount} ${
                        styles[`amount_${l.tone}`]
                      }`}
                    >
                      {l.amount}
                    </p>
                    <span
                      className={`${styles.loanStatus} ${
                        styles[`status_${l.tone}`]
                      }`}
                    >
                      {l.status}
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
                On te doit
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${styles.modeBtnBorrow} ${
                  mode === 'borrow' ? styles.modeBtnActive : ''
                }`}
                aria-pressed={mode === 'borrow'}
                onClick={() => selectMode('borrow')}
              >
                Tu dois
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
