import { Link, useLocation } from 'react-router-dom';
import { switchLang, useLang, useLocalize, type Lang } from '../../i18n';
import styles from './Footer.module.css';
import Logo from '../Logo/Logo';
import type { LegalTab } from '../Legal/legalContent';

type FooterLink = { label: string; href: string };

// Hrefs are FRENCH paths; they are localised with useLocalize() at render time.
const COLUMNS: Record<Lang, { title: string; links: FooterLink[] }[]> = {
  fr: [
    {
      title: 'Produit',
      links: [
        { label: 'Comment ça marche', href: '/comment-ca-marche' },
        { label: 'Cas d’usage', href: '/cas-usage' },
        { label: 'Offres', href: '/#offres' },
        { label: 'Tarifs', href: '/tarifs' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Conseils', href: '/blog' },
        { label: 'Carnet & Tiers de confiance', href: '/confiance' },
        { label: 'Partage de dépenses ou TilliT ?', href: '/difference' },
        { label: 'Si ça coince', href: '/recours' },
        { label: 'Notre histoire', href: '/notre-histoire' },
        { label: 'Manifeste', href: '/#probleme' },
        { label: 'Nous écrire', href: '/contact' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'Mentions légales', href: '/mentions-legales' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Confidentialité', href: '/confidentialite' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },
  ],
  en: [
    {
      title: 'Product',
      links: [
        { label: 'How it works', href: '/comment-ca-marche' },
        { label: 'Use cases', href: '/cas-usage' },
        { label: 'Plans', href: '/#offres' },
        { label: 'Pricing', href: '/tarifs' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Advice', href: '/blog' },
        { label: 'Carnet de prêt & trusted third party', href: '/confiance' },
        { label: 'Expense splitting or TilliT?', href: '/difference' },
        { label: 'If it gets stuck', href: '/recours' },
        { label: 'Our story', href: '/notre-histoire' },
        { label: 'Manifesto', href: '/#probleme' },
        { label: 'Write to us', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Legal notice', href: '/mentions-legales' },
        { label: 'Terms', href: '/conditions' },
        { label: 'Privacy', href: '/confidentialite' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },
  ],
};

const TEXT = {
  fr: {
    tagline:
      'La finance qui préserve les liens. Prêter, emprunter et suivre les remboursements entre proches, sans le malaise.',
    disclaimer:
      'TilliT n’est ni une banque, ni un organisme de crédit, ni un établissement de paiement, ni un service de recouvrement. Les fonds ne transitent jamais par TilliT.',
    motto: 'Simple entre nous.',
    madeBy: 'Développé par',
  },
  en: {
    tagline:
      'Money that keeps relationships whole. Lend, borrow and track repayments between friends and family, without the awkwardness.',
    disclaimer:
      'TilliT is not a bank, a credit provider, a payment institution or a debt collection service. Money never passes through TilliT.',
    motto: 'Simple, between us.',
    madeBy: 'Developed by',
  },
};

const NOMS = 'Les noms cités appartiennent à leurs propriétaires respectifs.';
const INFORMATIF = 'Contenu informatif : TilliT ne fournit pas de conseil juridique.';
const NAMES_BELONG = 'The names mentioned belong to their respective owners.';
const NAMES_PROPERTY = 'The names mentioned are the property of their respective owners.';
const FOR_INFO = 'For information only: TilliT does not give legal advice.';

// Sentence each reference page adds after the common disclaimer, keyed by the FRENCH path.
const PAGE_DISCLAIMER: Record<Lang, Record<string, string>> = {
  fr: {
    '/tarifs': 'Aucun intérêt n’est appliqué.',
    '/confiance':
      'Le Carnet de prêt n’est pas un score de solvabilité, et TilliT ne le transmet à personne.',
    '/recours': INFORMATIF,
    '/article-preter-avant-virement': INFORMATIF,
    '/article-imprevu-echeancier': INFORMATIF,
    '/blog':
      'Les contenus de cette rubrique sont informatifs et ne constituent pas un conseil juridique.',
    '/faq': NOMS,
    '/contact': NOMS,
    '/confirmation': NOMS,
    '/mentions-legales': NOMS,
    '/conditions': NOMS,
    '/confidentialite': NOMS,
    '/cookies': NOMS,
    '/404': NOMS,
  },
  en: {
    '/tarifs': 'No interest is charged.',
    '/confiance':
      'The Carnet de prêt is not a credit score, and TilliT passes it to nobody.',
    '/recours': 'Informational content: TilliT does not provide legal advice.',
    '/article-preter-avant-virement': FOR_INFO,
    '/article-imprevu-echeancier': FOR_INFO,
    '/blog':
      'Everything in this section is for information, and none of it is legal advice.',
    '/faq': NAMES_BELONG,
    '/contact': NAMES_BELONG,
    '/confirmation': NAMES_BELONG,
    '/404': NAMES_BELONG,
    '/mentions-legales': NAMES_PROPERTY,
    '/conditions': NAMES_PROPERTY,
    '/confidentialite': NAMES_PROPERTY,
    '/cookies': NAMES_PROPERTY,
  },
};

type Props = {
  onOpenLegal: (tab: LegalTab) => void;
};

// onOpenLegal is kept for the pages that still pass it; every legal text is now a page.
export default function Footer(_props: Props) {
  const { pathname } = useLocation();
  const lang = useLang();
  const l = useLocalize();
  const t = TEXT[lang];
  // French path of the current page; unknown addresses resolve to /404.
  const frPath = lang === 'fr' ? switchLang(switchLang(pathname, '', 'en'), '', 'fr') : switchLang(pathname, '', 'fr');
  const extra = PAGE_DISCLAIMER[lang][frPath];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand} data-reveal="left">
            <Logo className={styles.logo} />
            <p className={styles.tagline}>{t.tagline}</p>
          </div>

          <div
            className={styles.columns}
            data-reveal="right"
            style={{ ['--reveal-delay' as string]: '80ms' }}
          >
            {COLUMNS[lang].map((c) => (
              <div className={styles.col} key={c.title}>
                <h4 className={styles.colTitle}>{c.title}</h4>
                <ul>
                  {c.links.map((link) => (
                    <li key={link.href}>
                      <Link to={l(link.href)}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.disclaimer}>
          {t.disclaimer}
          {extra && ` ${extra}`}
        </p>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 TilliT <span className={styles.motto}>{t.motto}</span>
          </p>
          <p className={styles.madeIn}>
            {t.madeBy}{' '}
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
