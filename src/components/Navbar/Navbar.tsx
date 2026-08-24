import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logo from '../Logo/Logo';

type NavLink = {
  href: string;
  label: string;
  icon: string;
  route?: string;
};

const NAV_LINKS: NavLink[] = [
  { href: '/#probleme', label: 'Pourquoi tillit', icon: 'fa-lightbulb' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche', icon: 'fa-list-check' },
  { href: '/tarifs', label: 'Tarifs', icon: 'fa-tag', route: '/tarifs' },
  { href: '/#faq', label: 'FAQ', icon: 'fa-circle-question' },
  { href: '/#contact', label: 'Contact', icon: 'fa-envelope' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const location = useLocation();
  const isHome = location.pathname === '/';

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

  return (
    <div className={styles.wrapper}>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <Link to="/" className={styles.brand} aria-label="tillit — accueil">
          <Logo />
        </Link>

        <nav
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label="Navigation principale"
        >
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => {
              const isRoute = Boolean(link.route);
              const isActive = isRoute
                ? location.pathname === link.route
                : active === link.href;
              const commonProps = {
                className: `${styles.navLink} ${
                  isActive ? styles.navLinkActive : ''
                }`,
                onClick: () => setOpen(false),
                'aria-current': (isActive ? 'true' : undefined) as
                  | 'true'
                  | undefined,
              };
              const inner = (
                <>
                  <i
                    className={`fa-solid ${link.icon} ${styles.navIcon}`}
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                  <i
                    className={`fa-solid fa-chevron-right ${styles.navArrow}`}
                    aria-hidden="true"
                  />
                </>
              );
              return (
                <li key={link.href}>
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
        </nav>

        <div className={styles.actions}>
          <a
            className={styles.cta}
            href={isHome ? '#cta' : '/#cta'}
            aria-label="Télécharger l'app"
          >
            <i className="fa-solid fa-download" aria-hidden="true" />
            <span className={styles.ctaText}>Télécharger l'app</span>
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
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
