import { useState } from 'react';
import styles from './FAQ.module.css';

type Item = { q: string; a: string };

const FAQ_ITEMS: Item[] = [
  {
    q: "TilliT, c'est légal ?",
    a: "Oui, complètement. TilliT s'appuie sur la reconnaissance de dette (article 1359 du Code civil français) et, dans la formule ZEN, sur la signature électronique qualifiée eIDAS. TilliT n'étant ni banque ni établissement de paiement, aucun agrément n'est requis — c'est l'utilisateur qui contractualise, TilliT fournit l'outil.",
  },
  {
    q: 'Que se passe-t-il si mon proche ne rembourse pas ?',
    a: "TilliT ne garantit pas le remboursement — mais il rend les choses claires. En cas de retard, l'app envoie des rappels doux à ta place. Sur la formule ZEN, tu disposes déjà d'un dossier juridique complet, et l'option Sérénité permet de déclencher une mise en demeure via un partenaire juridique.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Oui. Toutes tes données sont hébergées en Union européenne, chiffrées, et conformes RGPD. Les fonds ne transitent jamais par TilliT — les virements se font directement de compte à compte via Open Banking.',
  },
  {
    q: 'Pourquoi payer pour TilliT ZEN ?',
    a: "NOTE est parfait pour les prêts en toute confiance jusqu'à 1 500 €. ZEN, c'est pour les montants importants ou les situations sensibles : reconnaissance de dette officielle, signature eIDAS, KYC, dossier de preuves — au cas où la relation aurait besoin de plus qu'une confiance verbale.",
  },
  {
    q: 'TilliT facture-t-il des intérêts ?',
    a: 'Zéro intérêt. Zéro commission sur la dette. TilliT ne gagne jamais d\'argent sur les sommes prêtées. Le tarif ZEN correspond uniquement au service de formalisation juridique — un paiement unique, jamais lié au montant remboursé.',
  },
  {
    q: 'Quelle est la différence entre TilliT et une banque ?',
    a: "Une banque prête son argent avec intérêts et gère les flux. TilliT ne prête rien : c'est toi qui prêtes à ton proche. Nous fournissons juste le cadre pour rendre ce geste clair, structuré, et sans malaise.",
  },
  {
    q: 'Mon proche doit-il déjà avoir TilliT ?',
    a: "Non. Quand tu crées un prêt, ton proche reçoit une invitation. Il télécharge l'app, s'inscrit en 2 minutes, et peut accepter, négocier ou refuser directement. Aucun frais pour lui.",
  },
  {
    q: 'Comment annuler ou modifier un prêt en cours ?',
    a: "Toute modification (report d'échéance, étalement, annulation) se négocie à deux dans l'espace de dialogue in-app. Une fois validée, l'échéancier est mis à jour automatiquement et les deux parties gardent l'historique.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen((current) => (current === i ? null : i));

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-title">
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.orbit1} aria-hidden="true" />
      <div className={styles.orbit2} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.layout}>
          <header className={styles.head} data-reveal>
            <span className={styles.eyebrow}>FAQ</span>
            <h2 id="faq-title" className={styles.title}>
              Questions{' '}
              <span className={styles.titleAccent}>fréquentes</span>
              <i
                className={`fa-solid fa-circle-question ${styles.titleIcon}`}
                aria-hidden="true"
              />
            </h2>
            <p className={styles.lead}>
              Tout ce qu'il faut savoir sur TilliT — sans jargon, sans zone d'ombre.
            </p>

            <div className={styles.moreHelp}>
              <span className={styles.moreIcon} aria-hidden="true">
                <i className="fa-solid fa-comments" />
              </span>
              <div>
                <p className={styles.moreTitle}>Une autre question ?</p>
                <p className={styles.moreDesc}>
                  Notre assistant TilliT est là pour t'aider, en bas à droite.
                </p>
              </div>
              <a className={styles.moreCta} href="mailto:tillit@tillitapp.fr">
                Nous écrire
              </a>
            </div>
          </header>

          <ul className={styles.list} role="list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                className={styles.item}
                data-reveal
                style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
              >
                <button
                  type="button"
                  className={`${styles.trigger} ${
                    isOpen ? styles.triggerOpen : ''
                  }`}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className={styles.qNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.qText}>{item.q}</span>
                  <span className={styles.chevron} aria-hidden="true">
                    <i className="fa-solid fa-chevron-down" />
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
                  role="region"
                >
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </section>
  );
}
