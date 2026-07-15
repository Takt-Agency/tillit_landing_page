import styles from './StepScreens.module.css';

export function ScreenCreate() {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <span className={styles.back}>
          <i className="fa-solid fa-chevron-left" aria-hidden="true" />
        </span>
        <p className={styles.topTitle}>Nouveau prêt</p>
        <span className={styles.back} style={{ visibility: 'hidden' }}>
          <i className="fa-solid fa-chevron-left" aria-hidden="true" />
        </span>
      </div>

      <div className={styles.stack}>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Montant</p>
          <p className={styles.fieldValue}>
            <span className={styles.amount}>500</span>
            <span className={styles.amountUnit}>€</span>
          </p>
        </div>

        <div className={styles.field}>
          <p className={styles.fieldLabel}>Bénéficiaire</p>
          <div className={styles.pill}>
            <span className={styles.avatar} style={{ background: '#ef8068' }}>
              S
            </span>
            <span>Sarah Kabbaj</span>
          </div>
        </div>

        <div className={styles.field}>
          <p className={styles.fieldLabel}>Durée</p>
          <div className={styles.chipsRow}>
            <span className={styles.chip}>1 mois</span>
            <span className={`${styles.chip} ${styles.chipActive}`}>3 mois</span>
            <span className={styles.chip}>6 mois</span>
          </div>
        </div>

        <div className={styles.field}>
          <p className={styles.fieldLabel}>Échéancier</p>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span>15 août</span>
              <strong>166,67 €</strong>
            </div>
            <div className={styles.row}>
              <span>15 sept.</span>
              <strong>166,67 €</strong>
            </div>
            <div className={styles.row}>
              <span>15 oct.</span>
              <strong>166,66 €</strong>
            </div>
          </div>
        </div>
      </div>

      <button className={styles.cta}>Créer le prêt</button>
    </div>
  );
}

export function ScreenAccept() {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <span className={styles.dotLive} /> Nouvelle proposition
      </div>

      <div className={styles.hero}>
        <span className={styles.heroAvatar} style={{ background: '#8b63e8' }}>
          A
        </span>
        <p className={styles.heroTitle}>Anna vous propose un prêt</p>
        <p className={styles.heroSub}>Il y a 2 min · Panne de voiture</p>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.detailRow}>
          <span>Montant</span>
          <strong>500,00 €</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Durée</span>
          <strong>3 mois</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Intérêts</span>
          <strong style={{ color: 'var(--color-green)' }}>0 %</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Commission</span>
          <strong style={{ color: 'var(--color-green)' }}>Aucune</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.ctaSecondary}>Négocier</button>
        <button className={styles.cta}>Accepter</button>
      </div>
    </div>
  );
}

export function ScreenTrack() {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <p className={styles.topTitle}>Suivi des prêts</p>
        <span className={styles.bell}>
          <i className="fa-solid fa-bell" aria-hidden="true" />
          <span className={styles.bellDot} aria-hidden="true" />
        </span>
      </div>

      <div className={styles.progressCard}>
        <div className={styles.progressHead}>
          <span
            className={styles.avatar}
            style={{ background: '#ef8068', width: 32, height: 32 }}
          >
            S
          </span>
          <div>
            <p className={styles.progressName}>Prêt à Sarah</p>
            <p className={styles.progressSub}>2 échéances sur 3</p>
          </div>
          <strong className={styles.progressAmount}>333,34 €</strong>
        </div>
        <div className={styles.bar}>
          <div className={styles.barFill} style={{ width: '66%' }} />
        </div>
      </div>

      <div className={styles.stack}>
        <p className={styles.sectionLabel}>Rappels envoyés</p>
        <div className={styles.reminder}>
          <span className={styles.reminderIcon}>💜</span>
          <div>
            <p className={styles.reminderTitle}>Rappel doux · 14 sept.</p>
            <p className={styles.reminderSub}>
              « Petit rappel bienveillant, sans pression 🌱 »
            </p>
          </div>
        </div>
        <div className={styles.reminder}>
          <span className={styles.reminderIcon}>✨</span>
          <div>
            <p className={styles.reminderTitle}>Échéance à venir · 15 oct.</p>
            <p className={styles.reminderSub}>Notification prévue 2 jours avant</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScreenDone() {
  return (
    <div className={styles.screen}>
      <div className={styles.doneCenter}>
        <div className={styles.checkCircle}>
          <i className="fa-solid fa-check" aria-hidden="true" />
        </div>
        <h4 className={styles.doneTitle}>Prêt remboursé !</h4>
        <p className={styles.doneSub}>
          500 € sur 500 € · Merci Sarah 💜
        </p>
      </div>

      <div className={styles.passport}>
        <div className={styles.passportHead}>
          <span className={styles.passportBadge}>Passeport de Fiabilité</span>
          <span className={styles.stars}>★ 4,9</span>
        </div>
        <div className={styles.passportRow}>
          <span>Prêts remboursés</span>
          <strong>12 / 12</strong>
        </div>
        <div className={styles.passportRow}>
          <span>Retards</span>
          <strong style={{ color: 'var(--color-green)' }}>0</strong>
        </div>
        <div className={styles.passportRow}>
          <span>Confiance moyenne</span>
          <strong>Excellente</strong>
        </div>
      </div>

      <div className={styles.chipInline}>La relation, elle, est intacte</div>
    </div>
  );
}
