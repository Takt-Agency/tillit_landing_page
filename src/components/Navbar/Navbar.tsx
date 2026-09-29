import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from '../Logo/Logo';
import { switchLang, useLang, useLocalize, type Lang } from '../../i18n';

type DropdownItem = {
  href: string;
  label: string;
  icon: string;
  hasSubmenu?: boolean;
};

type NavLink = {
  href: string;
  label: string;
  icon: string;
  route?: string;
  dropdown?: DropdownItem[];
};

type Copy = {
  resources: DropdownItem[];
  links: NavLink[];
  home: string;
  navLabel: string;
  cta: string;
  ctaShort: string;
  menuNote: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  skip: string;
};

// Hrefs are FRENCH paths; they are localised with useLocalize() at render time.
const COPY: Record<Lang, Copy> = {
  fr: {
    resources: [
      {
        href: '/confiance',
        label: 'Carnet & Tiers de confiance',
        icon: 'fa-address-book',
        hasSubmenu: true,
      },
      {
        href: '/difference',
        label: 'Partage de dépenses ou TilliT ?',
        icon: 'fa-scale-balanced',
      },
      { href: '/recours', label: 'Si ça coince', icon: 'fa-triangle-exclamation' },
      { href: '/cas-usage', label: "Cas d'usage", icon: 'fa-lightbulb' },
      { href: '/blog', label: 'Conseils', icon: 'fa-comments' },
      {
        href: '/prototype',
        label: "Prototype de l'application",
        icon: 'fa-mobile-screen',
      },
    ],
    links: [
      {
        href: '/notre-histoire',
        label: 'Pourquoi TilliT ?',
        icon: 'fa-lightbulb',
        route: '/notre-histoire',
      },
      {
        href: '/comment-ca-marche',
        label: 'Comment ça marche',
        icon: 'fa-list-check',
        route: '/comment-ca-marche',
      },
      { href: '/tarifs', label: 'Tarifs', icon: 'fa-tag', route: '/tarifs' },
      { href: '#ressources', label: 'Ressources', icon: 'fa-book-open', dropdown: [] },
      { href: '/faq', label: 'FAQ', icon: 'fa-circle-question', route: '/faq' },
    ],
    home: 'TilliT — accueil',
    navLabel: 'Navigation principale',
    cta: 'Être prévenu du lancement',
    ctaShort: 'Être prévenu',
    menuNote: 'TilliT arrive bientôt.',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
    skip: 'Aller au contenu',
  },
  en: {
    resources: [
      {
        href: '/confiance',
        label: 'Carnet de prêt & trusted third party',
        icon: 'fa-address-book',
        hasSubmenu: true,
      },
      {
        href: '/difference',
        label: 'Expense splitting or TilliT?',
        icon: 'fa-scale-balanced',
      },
      { href: '/recours', label: 'If it gets stuck', icon: 'fa-triangle-exclamation' },
      { href: '/cas-usage', label: 'Use cases', icon: 'fa-lightbulb' },
      { href: '/blog', label: 'Advice', icon: 'fa-comments' },
      { href: '/prototype', label: 'App prototype', icon: 'fa-mobile-screen' },
    ],
    links: [
      {
        href: '/notre-histoire',
        label: 'Why TilliT?',
        icon: 'fa-lightbulb',
        route: '/notre-histoire',
      },
      {
        href: '/comment-ca-marche',
        label: 'How it works',
        icon: 'fa-list-check',
        route: '/comment-ca-marche',
      },
      { href: '/tarifs', label: 'Pricing', icon: 'fa-tag', route: '/tarifs' },
      { href: '#ressources', label: 'Resources', icon: 'fa-book-open', dropdown: [] },
      { href: '/faq', label: 'FAQ', icon: 'fa-circle-question', route: '/faq' },
    ],
    home: 'TilliT — home',
    navLabel: 'Main navigation',
    cta: 'Get notified at launch',
    ctaShort: 'Get notified',
    menuNote: 'TilliT is on its way.',
    openMenu: 'Open the menu',
    closeMenu: 'Close the menu',
    language: 'Language',
    skip: 'Skip to content',
  },
};

const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
];

const DESKTOP_HOVER_QUERY = '(hover: hover) and (min-width: 1024px)';
const MOBILE_QUERY = '(max-width: 1023px)';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
  const NAV_LINKS = t.links.map((link) =>
    link.dropdown ? { ...link, dropdown: t.resources } : link,
  );
  const isHome = location.pathname === l('/') || location.pathname === '/en';
  const canHover = useMediaQuery(DESKTOP_HOVER_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const ctaHref = isHome ? '#waitlist' : l('/#waitlist');

  const closeMenu = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActive('');
      return;
    }
    const ids = NAV_LINKS.filter((l) => l.href.startsWith('/#')).map((l) =>
      l.href.slice(2),
    );
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive('/#' + visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!open && !dropdownOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (open) {
        closeMenu();
        burgerRef.current?.focus();
      } else {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, dropdownOpen]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Skip link: move keyboard focus to the page content, past the navigation.
  const skipToContent = (e: MouseEvent) => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    e.preventDefault();
    main.setAttribute('tabindex', '-1');
    main.focus();
  };

  const hoverHandlers = canHover
    ? {
        onMouseEnter: () => setDropdownOpen(true),
        onMouseLeave: () => setDropdownOpen(false),
      }
    : {};

  return (
    <div className={styles.wrapper}>
      <a href="#contenu" className={styles.skip} onClick={skipToContent}>
        {t.skip}
      </a>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${
          open ? styles.headerMenuOpen : ''
        }`}
      >
        <Link to={l('/')} className={styles.brand} aria-label={t.home}>
          <Logo />
        </Link>

        <nav
          id="main-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label={t.navLabel}
        >
          <ul className={styles.navList}>
            {NAV_LINKS.map((link, index) => {
              const isRoute = Boolean(link.route);
              const itemStyle = { ['--i' as string]: index };

              if (link.dropdown) {
                return (
                  <li
                    key={link.href}
                    className={`${styles.navItem} ${styles.dropdownWrap}`}
                    style={itemStyle}
                    {...hoverHandlers}
                  >
                    <button
                      type="button"
                      className={`${styles.navLink} ${styles.navLinkButton} ${
                        dropdownOpen ? styles.navLinkExpanded : ''
                      }`}
                      aria-expanded={dropdownOpen}
                      aria-controls="resources-menu"
                      onClick={(e) =>
                        canHover && e.detail > 0
                          ? setDropdownOpen(true)
                          : setDropdownOpen((v) => !v)
                      }
                    >
                      <i
                        className={`fa-solid ${link.icon} ${styles.navIcon}`}
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                      <i
                        className={`fa-solid fa-chevron-down ${styles.chevron} ${
                          dropdownOpen ? styles.chevronOpen : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      id="resources-menu"
                      className={`${styles.dropdown} ${
                        dropdownOpen ? styles.dropdownOpen : ''
                      }`}
                    >
                      <ul className={styles.dropdownList}>
                        {link.dropdown.map((item) => (
                          <li key={item.label}>
                            <Link
                              to={l(item.href)}
                              className={`${styles.dropdownItem} ${
                                item.hasSubmenu ? styles.dropdownItemWithArrow : ''
                              }`}
                              onClick={closeMenu}
                            >
                              <i
                                className={`fa-solid ${item.icon} ${styles.dropdownIcon}`}
                                aria-hidden="true"
                              />
                              <span className={styles.dropdownLabel}>
                                {item.label}
                              </span>
                              <i
                                className={`fa-solid fa-chevron-right ${styles.dropdownArrow}`}
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              const isActive = isRoute
                ? location.pathname === l(link.route!)
                : active === link.href;
              const commonProps = {
                className: `${styles.navLink} ${
                  isActive ? styles.navLinkActive : ''
                }`,
                onClick: closeMenu,
                'aria-current': (isActive ? 'page' : undefined) as
                  | 'page'
                  | undefined,
              };
              const inner = (
                <>
                  <i
                    className={`fa-solid ${link.icon} ${styles.navIcon}`}
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </>
              );
              return (
                <li key={link.href} className={styles.navItem} style={itemStyle}>
                  {isRoute ? (
                    <Link to={l(link.route!)} {...commonProps}>
                      {inner}
                    </Link>
                  ) : (
                    <a href={link.href} {...commonProps}>
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className={styles.menuFooter}>
            <a className={styles.menuCta} href={ctaHref} onClick={closeMenu}>
              <i className="fa-solid fa-bell" aria-hidden="true" />
              {t.cta}
            </a>
            <p className={styles.menuNote}>{t.menuNote}</p>
          </div>
        </nav>

        <div className={styles.actions}>
          <div className={styles.lang} role="group" aria-label={t.language}>
            {LANGS.map((o) =>
              o.code === lang ? (
                <span key={o.code} className={styles.langOn} lang={o.code} aria-current="true">
                  {o.label}
                </span>
              ) : (
                <Link
                  key={o.code}
                  to={switchLang(location.pathname, location.hash, o.code)}
                  className={styles.langLink}
                  lang={o.code}
                  hrefLang={o.code}
                >
                  {o.label}
                  <span className="sr-only"> · {o.name}</span>
                </Link>
              ),
            )}
          </div>
          <a
            className={`${styles.cta} ${open ? styles.ctaHidden : ''}`}
            href={ctaHref}
            aria-label={t.cta}
          >
            <i className="fa-solid fa-bell" aria-hidden="true" />
            <span className={styles.ctaText}>{t.ctaShort}</span>
          </a>
          <button
            ref={burgerRef}
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => (open ? closeMenu() : setOpen(true))}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </div>
  );
}
