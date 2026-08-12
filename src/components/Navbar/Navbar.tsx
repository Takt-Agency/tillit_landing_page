import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import Logo from '../Logo/Logo';

const NAV_LINKS = [
  { href: '#probleme', label: 'Pourquoi TilliT', icon: 'fa-lightbulb' },
  { href: '#comment-ca-marche', label: 'Comment ça marche', icon: 'fa-list-check' },
  { href: '#tarifs', label: 'Tarifs', icon: 'fa-tag' },
  { href: '#faq', label: 'FAQ', icon: 'fa-circle-question' },
  { href: '#contact', label: 'Contact', icon: 'fa-envelope' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive('#' + visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.wrapper}>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#top" className={styles.brand} aria-label="TilliT — accueil">
          <Logo />
        </a>

        <nav
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label="Navigation principale"
        >
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`${styles.navLink} ${
                      isActive ? styles.navLinkActive : ''
                    }`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <i
                      className={`fa-solid ${link.icon} ${styles.navIcon}`}
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                    <i
                      className={`fa-solid fa-chevron-right ${styles.navArrow}`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            className={styles.cta}
            href="#cta"
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
