import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LegalModal.module.css';
import {
  CONTENT,
  LAST_UPDATE,
  LEGAL_ROUTES,
  TABS,
  type LegalTab,
} from '../Legal/legalContent';

export type { LegalTab };

type Props = {
  tab: LegalTab | null;
  onClose: () => void;
  onSelectTab: (tab: LegalTab) => void;
};

export default function LegalModal({ tab, onClose, onSelectTab }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const isOpen = tab !== null;

  const selectTab = (key: LegalTab) => {
    const route = LEGAL_ROUTES[key];
    if (route) {
      onClose();
      navigate(route);
    } else {
      onSelectTab(key);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 100);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ActiveContent = CONTENT[tab];
  const activeLabel = TABS.find((t) => t.key === tab)?.label ?? '';

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Informations légales</p>
            <h2 id="legal-title" className={styles.title}>
              {activeLabel}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fermer"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <nav className={styles.tabs} aria-label="Onglets légaux">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`${styles.tab} ${
                tab === t.key ? styles.tabActive : ''
              }`}
              onClick={() => selectTab(t.key)}
              aria-current={tab === t.key ? 'page' : undefined}
            >
              <i className={`fa-solid ${t.icon}`} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className={styles.body}>
          <p className={styles.lastUpdate}>{LAST_UPDATE}</p>
          <div className={styles.content}>
            <ActiveContent />
          </div>
        </div>
      </div>
    </div>
  );
}
