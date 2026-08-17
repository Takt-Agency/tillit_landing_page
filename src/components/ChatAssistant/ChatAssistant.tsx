import { useEffect, useRef, useState } from 'react';
import styles from './ChatAssistant.module.css';
import mascotUrl from '../../mascotte-besoin-aide.png';

type Message = { id: number; role: 'bot' | 'user'; text: string };

const QUICK_REPLIES = [
  'Comment ça marche ?',
  'Est-ce vraiment gratuit ?',
  'Mes données sont-elles protégées ?',
];

const BOT_ANSWERS: Record<string, string> = {
  'comment ça marche':
    'Tu crées un prêt en 2 minutes (montant, durée), ton proche accepte en un tap, et tillit s\'occupe des rappels doux à ta place. La relation reste intacte 💜',
  gratuit:
    'Oui, la formule NOTE est 100 % gratuite pour les prêts jusqu\'à 1 500 € (échéancier, rappels, historique). Aucun intérêt, aucune commission sur la dette.',
  données:
    'Tes données sont hébergées en Union européenne, conformes RGPD, et les fonds ne transitent jamais par tillit — les virements se font de compte à compte.',
  default:
    'Je transmets ça à l\'équipe tillit. En attendant, tu peux essayer le prototype ou m\'écrire une autre question 🙂',
};

function botReply(input: string): string {
  const lower = input.toLowerCase();
  for (const key of Object.keys(BOT_ANSWERS)) {
    if (key !== 'default' && lower.includes(key)) return BOT_ANSWERS[key];
  }
  return BOT_ANSWERS.default;
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: 'Salut 👋 Je suis tillit. Une question sur les prêts entre proches ?',
    },
  ]);
  const idRef = useRef(2);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setBubble(true), 2800);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (open) {
      setBubble(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const userMsg: Message = { id: idRef.current++, role: 'user', text: value };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: 'bot', text: botReply(value) },
      ]);
    }, 650);
  };

  return (
    <div className={styles.root}>
      {bubble && !open && (
        <div
          className={styles.bubble}
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
          aria-label="Ouvrir l'assistant tillit"
        >
          <span className={styles.bubbleText}>Besoin d'aide ?</span>
          <span className={styles.bubbleSub}>Je suis là 💜</span>
          <button
            type="button"
            className={styles.bubbleClose}
            onClick={(e) => {
              e.stopPropagation();
              setBubble(false);
            }}
            aria-label="Fermer le message"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        aria-expanded={open}
      >
        <img src={mascotUrl} alt="" className={styles.mascot} />
        <span className={styles.pulse} aria-hidden="true" />
      </button>

      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label="Assistant tillit"
        aria-hidden={!open}
      >
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={mascotUrl} alt="" className={styles.headerAvatar} />
            <div>
              <p className={styles.headerTitle}>Assistant tillit</p>
              <p className={styles.headerSub}>
                <span className={styles.dot} /> En ligne · réponse en quelques secondes
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Fermer le chat"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <div className={styles.messages} ref={scrollRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.msg} ${
                m.role === 'user' ? styles.msgUser : styles.msgBot
              }`}
            >
              {m.text}
            </div>
          ))}

          {messages.length === 1 && (
            <div className={styles.quickReplies}>
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={styles.chip}
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className={styles.inputRow}
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ton message…"
            className={styles.input}
            aria-label="Message"
          />
          <button
            type="submit"
            className={styles.send}
            aria-label="Envoyer"
            disabled={!input.trim()}
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
