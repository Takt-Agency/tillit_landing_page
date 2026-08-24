import styles from './Footer.module.css';
import Logo from '../Logo/Logo';
import type { LegalTab } from '../LegalModal/LegalModal';

const PRODUCT = [
  { label: 'Pourquoi tillit', href: '/#probleme' },
  { label: 'Comment ça marche', href: '/#comment-ca-marche' },
  { label: 'Signature électronique', href: '/#signature' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'FAQ', href: '/#faq' },
];

const COMPANY = [
  { label: 'Nos partenaires', href: '#partenaires' },
  { label: 'Contact', href: '#contact' },
  { label: 'Télécharger l\'app', href: '#cta' },
];

const LEGAL: { label: string; tab: LegalTab }[] = [
  { label: 'Mentions légales', tab: 'mentions' },
  { label: 'CGU', tab: 'cgu' },
  { label: 'CGV', tab: 'cgv' },
  { label: 'Confidentialité', tab: 'confidentialite' },
  { label: 'Cookies', tab: 'cookies' },
];

const SOCIAL = [
  { label: 'LinkedIn', href: '#', icon: 'fa-linkedin-in' },
  { label: 'Instagram', href: '#', icon: 'fa-instagram' },
  { label: 'X (Twitter)', href: '#', icon: 'fa-x-twitter' },
  { label: 'TikTok', href: '#', icon: 'fa-tiktok' },
];

type Props = {
  onOpenLegal: (tab: LegalTab) => void;
};

export default function Footer({ onOpenLegal }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand} data-reveal="left">
            <Logo className={styles.logo} />
            <p className={styles.tagline}>
              La finance qui préserve les liens. Prêter, emprunter et suivre les
              remboursements entre proches — sans le malaise.
            </p>
            <a href="mailto:tillit@tillitapp.fr" className={styles.contact}>
              <i className="fa-solid fa-envelope" aria-hidden="true" />
              tillit@tillitapp.fr
            </a>
            <ul className={styles.social} aria-label="Réseaux sociaux">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className={styles.socialLink}
                    aria-label={s.label}
                  >
                    <i className={`fa-brands ${s.icon}`} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={styles.columns}
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '80ms' }}
          >
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Produit</h4>
              <ul>
                {PRODUCT.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Société</h4>
              <ul>
                {COMPANY.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Légal</h4>
              <ul>
                {LEGAL.map((l) => (
                  <li key={l.tab}>
                    <button
                      type="button"
                      className={styles.legalBtn}
                      onClick={() => onOpenLegal(l.tab)}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2026 tillit</p>
          <p className={styles.madeIn}>
            Développé par{' '}
            <a
              href="https://nexia-digital.net"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.credit}
            >
              Nexia Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
