import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from '../Logo/Logo';

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

const RESOURCES_ITEMS: DropdownItem[] = [
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
];

const NAV_LINKS: NavLink[] = [
  {
    href: '/pourquoi-tillit',
    label: 'Pourquoi TilliT ?',
    icon: 'fa-lightbulb',
    route: '/pourquoi-tillit',
  },
  {
    href: '/comment-ca-marche',
    label: 'Comment ça marche',
    icon: 'fa-list-check',
    route: '/comment-ca-marche',
  },
  { href: '/tarifs', label: 'Tarifs', icon: 'fa-tag', route: '/tarifs' },
  {
    href: '#ressources',
    label: 'Ressources',
    icon: 'fa-book-open',
    dropdown: RESOURCES_ITEMS,
  },
  { href: '/faq', label: 'FAQ', icon: 'fa-circle-question', route: '/faq' },
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
  const isHome = location.pathname === '/';
  const canHover = useMediaQuery(DESKTOP_HOVER_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const ctaHref = isHome ? '#cta' : '/#cta';

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

  const hoverHandlers = canHover
    ? {
        onMouseEnter: () => setDropdownOpen(true),
        onMouseLeave: () => setDropdownOpen(false),
      }
    : {};

  return (
    <div className={styles.wrapper}>
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
        <Link to="/" className={styles.brand} aria-label="tillit — accueil">
          <Logo />
        </Link>

        <nav
          id="main-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label="Navigation principale"
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
                            <a
                              href={item.href}
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
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              const isActive = isRoute
                ? location.pathname === link.route
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
                    <Link to={link.route!} {...commonProps}>
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
              Être prévenu du lancement
            </a>
            <p className={styles.menuNote}>
              tillit arrive bientôt — soyez parmi les premiers.
            </p>
          </div>
        </nav>

        <div className={styles.actions}>
          <a
            className={`${styles.cta} ${open ? styles.ctaHidden : ''}`}
            href={ctaHref}
            aria-label="Être prévenu du lancement"
          >
            <i className="fa-solid fa-bell" aria-hidden="true" />
            <span className={styles.ctaText}>Être prévenu</span>
          </a>
          <button
            ref={burgerRef}
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
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
