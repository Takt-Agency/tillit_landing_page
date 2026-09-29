import { useEffect, useRef, useState } from 'react';
import styles from './ChatAssistant.module.css';
import mascotUrl from '../../mascotte-besoin-aide.png';
import { ASK_ASSISTANT_EVENT } from '../../lib/assistant';
import { charger, repondre } from './knowledge';
import { useLang } from '../../i18n';

type Message = { id: number; role: 'bot' | 'user'; text: string };

const QUICK_REPLIES = [
  'Comment ça marche ?',
  'Est-ce vraiment gratuit ?',
  'Mes données sont-elles protégées ?',
];

// The English reference site has no assistant: it only shows on French pages.
export default function ChatAssistantGate() {
  return useLang() === 'fr' ? <ChatAssistant /> : null;
}

function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: 'Salut 👋 Je suis TilliT. Une question sur les prêts entre proches ?',
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
      charger(); // read the FAQ ahead, before the first question
      setBubble(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, thinking]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const userMsg: Message = { id: idRef.current++, role: 'user', text: value };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    // Wait for the FAQ to be read, then a delay proportional to the answer length.
    charger().then(() => {
      const text = repondre(value);
      setTimeout(() => {
        setThinking(false);
        setMessages((m) => [...m, { id: idRef.current++, role: 'bot', text }]);
      }, Math.min(1500, 480 + text.length * 3.2));
    });
  };

  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    const onAsk = (e: Event) => {
      setOpen(true);
      sendRef.current((e as CustomEvent<string>).detail);
    };
    window.addEventListener(ASK_ASSISTANT_EVENT, onAsk);
    return () => window.removeEventListener(ASK_ASSISTANT_EVENT, onAsk);
  }, []);

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
          aria-label="Ouvrir l’assistant"
        >
          <span className={styles.bubbleText}>Besoin d’aide&nbsp;?</span>
          <span className={styles.bubbleSub}>Je suis là</span>
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
        <img
          src={mascotUrl}
          alt=""
          className={styles.mascot}
          loading="lazy"
          decoding="async"
          width={56}
          height={56}
        />
        <span className={styles.pulse} aria-hidden="true" />
      </button>

      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label="Assistant"
        aria-hidden={!open}
      >
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <img
              src={mascotUrl}
              alt=""
              className={styles.headerAvatar}
              loading="lazy"
              decoding="async"
              width={36}
              height={36}
            />
            <div>
              <p className={styles.headerTitle}>Assistant TilliT</p>
              <p className={styles.headerSub}>
                Je cherche dans la FAQ et je te réponds
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

          {thinking && (
            <div className={styles.typing} aria-label="En train de répondre">
              <i />
              <i />
              <i />
            </div>
          )}

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
