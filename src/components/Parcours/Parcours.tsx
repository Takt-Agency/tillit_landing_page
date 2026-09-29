import { useState, type ReactNode } from 'react';
import styles from './Parcours.module.css';
import mascotUrl from '../../mascotte-coup-de-coeur.webp';

type Role = 'p' | 'e';
type Variant = '' | 'difficile' | 'avance';

type Screen = {
  head: string;
  ok?: boolean;
  sub?: string;
  amount?: string;
  amountSub?: string;
  gauge?: number;
  rows?: [string, string][];
  btns: { label: string; kind?: 'ghost' | 'danger' }[];
  note?: string;
};

type View = { screen: Screen; benefit: string };

const STEPS: { title: string; chip: string; desc: ReactNode; tone: string; icon: string }[] = [
  {
    title: 'On se met d’accord',
    chip: '≈ 2 min',
    tone: 'violet',
    icon: 'fa-handshake',
    desc: (
      <>
        « 100 € par mois, ça te va ? » Vous fixez le montant et les dates de remboursement{' '}
        <b>avant le virement</b>. Chacun peut proposer autre chose.
      </>
    ),
  },
  {
    title: 'Le prêt démarre',
    chip: 'Confirmé à deux',
    tone: 'coral',
    icon: 'fa-building-columns',
    desc: (
      <>
        Léonie confirme l’envoi, Thomas confirme la réception. L’argent va directement de{' '}
        <b>banque à banque</b> : TilliT ne détient jamais les fonds.
      </>
    ),
  },
  {
    title: 'Ça avance',
    chip: 'Rappels automatiques',
    tone: 'blue',
    icon: 'fa-bell',
    desc: (
      <>
        Thomas déclare <b>chaque remboursement</b>, Léonie le confirme. Vous partagez le même
        suivi et TilliT s’occupe des rappels.
      </>
    ),
  },
  {
    title: 'Prêt terminé',
    chip: 'Un merci',
    tone: 'green',
    icon: 'fa-heart',
    desc: (
      <>
        Une fois le dernier remboursement confirmé, le prêt est marqué comme <b>remboursé</b>{' '}
        pour vous deux.
      </>
    ),
  },
];

const VIEWS: Record<string, View> = {
  'p-0': {
    screen: {
      head: 'Thomas te demande 500 €',
      sub: 'Rien ne démarre sans ta réponse.',
      amount: '500,00 €',
      rows: [
        ['Rythme', '5 × 100 €'],
        ['Première échéance', '12 avril'],
        ['Intérêts', '0 %'],
      ],
      btns: [
        { label: 'J’accepte' },
        { label: 'Proposer autre chose', kind: 'ghost' },
        { label: 'Refuser', kind: 'danger' },
      ],
    },
    benefit:
      'Léonie reçoit une demande claire : 500 €, en cinq fois. Elle sait à quoi elle dit oui.',
  },
  'p-1': {
    screen: {
      head: 'L’argent est-il parti ?',
      sub: 'Le prêt démarre quand vous l’avez confirmé tous les deux.',
      rows: [
        ['Léonie → Thomas', '500,00 €'],
        ['Virement bancaire', '12 mars'],
      ],
      btns: [{ label: 'J’ai envoyé les 500 €' }],
      note: 'TilliT ne détient jamais les fonds. Le virement va de ta banque à la sienne.',
    },
    benefit:
      'Léonie fait son virement depuis sa banque, comme d’habitude, puis l’indique dans l’application.',
  },
  'p-2': {
    screen: {
      head: 'Thomas a remboursé 100 €',
      sub: 'Tu confirmes les avoir reçus ?',
      amount: '200,00 €',
      amountSub: 'remboursés sur 500 €',
      gauge: 40,
      btns: [{ label: 'Oui, je confirme' }, { label: 'Je n’ai rien vu', kind: 'ghost' }],
      note: 'Thomas a reçu son rappel. Tu n’as plus à relancer toi-même.',
    },
    benefit: 'Léonie n’a jamais écrit « tu as pensé au virement ? ». Le rappel est parti tout seul.',
  },
  'p-3': {
    screen: {
      head: 'Prêt remboursé !',
      ok: true,
      amount: '500,00 €',
      amountSub: 'remboursés par Thomas · aucun retard',
      gauge: 100,
      rows: [
        ['Durée', '5 mois'],
        ['Intérêts payés', '0,00 €'],
      ],
      btns: [{ label: 'Voir le récapitulatif' }],
    },
    benefit: 'Les rappels partent tout seuls. Léonie n’a pas eu à relancer.',
  },
  'p-2-difficile': {
    screen: {
      head: 'Thomas propose de décaler',
      sub: 'Il te prévient avant l’échéance.',
      rows: [
        ['Prévu', '100 € le 12 juin'],
        ['Proposé', '50 € le 12 · 50 € le 25'],
      ],
      btns: [{ label: 'J’accepte' }, { label: 'Proposer autre chose', kind: 'ghost' }],
      note: 'Le montant total ne change pas. Seul le calendrier bouge.',
    },
    benefit: 'Léonie est prévenue à temps. Rien ne bouge sans son accord.',
  },
  'p-2-avance': {
    screen: {
      head: 'Thomas a remboursé 200 €',
      sub: 'Deux échéances d’avance.',
      amount: '400,00 €',
      amountSub: 'remboursés sur 500 €',
      gauge: 80,
      btns: [{ label: 'Je confirme' }],
      note: 'Prochaine et dernière échéance : le 12 août.',
    },
    benefit: 'Léonie voit le reste à rembourser baisser plus vite que prévu.',
  },
  'e-0': {
    screen: {
      head: 'Demander à Léonie',
      sub: 'Dis combien, et comment tu rembourses.',
      amount: '500,00 €',
      rows: [
        ['En combien de fois', '5 × 100 €'],
        ['À partir du', '12 avril'],
        ['Fin prévue', '12 août'],
      ],
      btns: [{ label: 'Envoyer à Léonie' }],
      note: 'Léonie pourra accepter, refuser ou proposer autre chose.',
    },
    benefit:
      'Plus besoin de « euh, je voulais te demander… ». Thomas envoie montant et calendrier d’un coup.',
  },
  'e-1': {
    screen: {
      head: 'Léonie a envoyé les 500 €',
      sub: 'Tu confirmes les avoir reçus ?',
      amount: '500,00 €',
      amountSub: 'reçus le 12 mars',
      btns: [{ label: 'Oui, j’ai bien reçu' }, { label: 'Pas encore', kind: 'ghost' }],
      note: 'Tant que ce n’est pas confirmé, aucune échéance ne court.',
    },
    benefit: '« C’est bien arrivé. » Thomas le confirme, et l’échéancier démarre.',
  },
  'e-2': {
    screen: {
      head: 'Prêt en cours',
      sub: 'Tout est à jour.',
      amount: '200,00 €',
      amountSub: 'remboursés sur 500 €',
      gauge: 40,
      rows: [
        ['Prochaine échéance', '12 juin'],
        ['Montant', '100,00 €'],
      ],
      btns: [{ label: 'J’ai remboursé' }, { label: 'Ça va être compliqué', kind: 'ghost' }],
    },
    benefit: 'Thomas sait quand payer et combien il reste. Aucune surprise.',
  },
  'e-3': {
    screen: {
      head: 'Prêt remboursé !',
      ok: true,
      amount: '500,00 €',
      amountSub: 'remboursés à Léonie, dans les temps',
      gauge: 100,
      btns: [{ label: 'Envoyer un merci à Léonie' }],
      note: 'Ton Carnet de prêt vient d’être mis à jour.',
    },
    benefit: 'Thomas a tenu toutes ses dates. Léonie et lui n’en parlent déjà plus.',
  },
  'e-2-difficile': {
    screen: {
      head: 'Ce mois-ci, c’est tendu',
      sub: 'Préviens Léonie, et propose-lui un autre calendrier.',
      rows: [
        ['Échéance du', '12 juin'],
        ['Montant', '100,00 €'],
      ],
      btns: [{ label: 'Décaler cette échéance' }, { label: 'Payer une partie', kind: 'ghost' }],
      note: 'Le changement s’applique une fois accepté par vous deux.',
    },
    benefit: 'Thomas prévient à temps, sans ce coup de fil qu’on redoute.',
  },
  'e-2-avance': {
    screen: {
      head: 'Payer en avance',
      sub: 'Tes prochaines échéances seront réglées.',
      rows: [
        ['2 échéances', '200,00 €'],
        ['Prochaine ensuite', '12 août'],
      ],
      btns: [{ label: 'Régler 200 €' }, { label: 'Tout rembourser (300 €)', kind: 'ghost' }],
    },
    benefit: 'Thomas prend de l’avance quand il peut, sans rien renégocier.',
  },
};

const VARIANTS: { key: Exclude<Variant, ''>; title: string; text: string; icon: string; common: ReactNode }[] = [
  {
    key: 'difficile',
    title: 'Et si c’est tendu ce mois-ci ?',
    text: 'Le dire avant l’échéance, et proposer d’autres dates.',
    icon: 'fa-cloud-rain',
    common: 'Prévenir tôt, c’est déjà prendre soin de l’autre. Le reste se décide à deux.',
  },
  {
    key: 'avance',
    title: 'Et si je peux rendre plus tôt ?',
    text: 'Régler plusieurs échéances d’un coup, ou tout rembourser.',
    icon: 'fa-forward-fast',
    common: (
      <>
        Payer plus tôt règle les <b>prochaines échéances</b>. Les autres gardent leur montant et
        leur date.
      </>
    ),
  },
];

function PhoneScreen({ screen }: { screen: Screen }) {
  return (
    <div className={styles.app}>
      {screen.ok && (
        <img src={mascotUrl} alt="" className={styles.appMascot} width={111} height={120} />
      )}
      <p className={`${styles.appHead} ${screen.ok ? styles.appHeadOk : ''}`}>{screen.head}</p>
      {screen.sub && <p className={styles.appSub}>{screen.sub}</p>}
      {screen.amount && <p className={styles.appAmount}>{screen.amount}</p>}
      {screen.amountSub && <p className={styles.appSub}>{screen.amountSub}</p>}
      {screen.gauge !== undefined && (
        <div className={styles.gauge}>
          <i style={{ width: `${screen.gauge}%` }} />
        </div>
      )}
      {screen.rows && (
        <div className={styles.appCard}>
          {screen.rows.map(([k, v]) => (
            <div key={k} className={styles.appRow}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
      )}
      <div className={styles.appBtns}>
        {screen.btns.map((b) => (
          <span
            key={b.label}
            className={`${styles.appBtn} ${b.kind ? styles[`appBtn_${b.kind}`] : ''}`}
          >
            {b.label}
          </span>
        ))}
      </div>
      {screen.note && <p className={styles.appNote}>{screen.note}</p>}
    </div>
  );
}

export default function Parcours() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>('p');
  const [variant, setVariant] = useState<Variant>('');

  const activeVariant = step === 2 ? variant : '';
  const key = `${role}-${step}${activeVariant ? `-${activeVariant}` : ''}`;
  const view = VIEWS[key];
  const common = VARIANTS.find((v) => v.key === activeVariant)?.common;

  const selectStep = (i: number, reveal = false) => {
    setStep(i);
    setVariant('');
    // On one-column layouts the phone sits below the list: bring it into view.
    if (reveal && window.matchMedia('(max-width: 900px)').matches) {
      document.getElementById('parcours-scene')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className={styles.section} id="parcours" aria-labelledby="parcours-title">
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <span className={styles.kicker}>La solution</span>
          <h2 className={styles.intro} id="parcours-title">
            <span className={styles.bubble}>« Je te rends ça vite. »</span>
            <span className={styles.intro2}>
              Avec TilliT, vous savez tous les deux où vous en êtes.
            </span>
          </h2>
          <p className={styles.hint}>
            <i className="fa-solid fa-hand-pointer" aria-hidden="true" />
            Choisis une étape, puis change de côté.
          </p>
        </header>

        <div className={styles.layout} data-reveal>
          <ol
            className={styles.steps}
            aria-label="Les quatre moments du prêt"
            style={{ ['--progress' as string]: step / (STEPS.length - 1) }}
          >
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  className={`${styles.step} ${styles[`tone_${s.tone}`]} ${
                    i === step ? styles.stepActive : ''
                  } ${i < step ? styles.stepDone : ''}`}
                  aria-pressed={i === step}
                  aria-controls="parcours-scene"
                  onClick={() => selectStep(i, true)}
                >
                  <span className={styles.stepDot}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.stepBody}>
                    <span className={styles.stepHead}>
                      <span className={styles.stepTitle}>{s.title}</span>
                      <span className={styles.stepChip}>{s.chip}</span>
                    </span>
                    <span className={styles.stepDesc}>{s.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className={`${styles.stage} ${styles[`tone_${STEPS[step].tone}`]}`}>
            <div
              className={styles.roles}
              role="tablist"
              aria-label="Voir le prêt côté prêteur ou côté emprunteur"
            >
              <span
                className={`${styles.roleThumb} ${role === 'e' ? styles.roleThumbRight : ''}`}
                aria-hidden="true"
              />
              {(['p', 'e'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={role === r}
                  aria-controls="parcours-scene"
                  className={`${styles.role} ${role === r ? styles.roleActive : ''}`}
                  onClick={() => setRole(r)}
                >
                  <span
                    className={`${styles.avatar} ${r === 'e' ? styles.avatarE : ''}`}
                    aria-hidden="true"
                  >
                    {r === 'p' ? 'L' : 'T'}
                  </span>
                  {r === 'p' ? 'Prêteur' : 'Emprunteur'}
                </button>
              ))}
            </div>

            <div id="parcours-scene" className={styles.scene} role="tabpanel" aria-live="polite">
              <p className={styles.who}>
                {role === 'p' ? (
                  <>
                    <b>Léonie</b> · elle prête
                  </>
                ) : (
                  <>
                    <b>Thomas</b> · il emprunte
                  </>
                )}
              </p>

              <div className={styles.phoneWrap}>
                <span className={styles.rings} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <div className={styles.phone}>
                  <span className={styles.notch} aria-hidden="true" />
                  <div className={styles.screen} key={key}>
                    <PhoneScreen screen={view.screen} />
                  </div>
                </div>
              </div>

              <p className={styles.benefit} key={`b-${key}`}>
                <span className={styles.benefitIcon} aria-hidden="true">
                  <i className="fa-solid fa-heart" />
                </span>
                <span>{view.benefit}</span>
              </p>
            </div>

            <div className={styles.nav}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => selectStep(step - 1)}
                disabled={step === 0}
                aria-label="Étape précédente"
              >
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              </button>
              <span className={styles.navDots} aria-live="polite">
                <span className="sr-only">
                  Étape {step + 1} sur {STEPS.length}
                </span>
                {STEPS.map((s, i) => (
                  <i
                    key={s.title}
                    aria-hidden="true"
                    className={i === step ? styles.navDotActive : ''}
                  />
                ))}
                <b aria-hidden="true">
                  {step + 1} / {STEPS.length}
                </b>
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => selectStep(step + 1)}
                disabled={step === STEPS.length - 1}
                aria-label="Étape suivante"
              >
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </button>
            </div>

            {step === 2 && (
              <div
                className={styles.variants}
                role="group"
                aria-label="Deux cas particuliers de l’étape 3"
              >
                {VARIANTS.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    className={`${styles.variant} ${variant === v.key ? styles.variantActive : ''}`}
                    aria-pressed={variant === v.key}
                    aria-controls="parcours-scene"
                    onClick={() => setVariant((cur) => (cur === v.key ? '' : v.key))}
                  >
                    <span className={styles.variantIcon} aria-hidden="true">
                      <i className={`fa-solid ${v.icon}`} />
                    </span>
                    <span className={styles.variantText}>
                      <b>{v.title}</b>
                      <span>{v.text}</span>
                    </span>
                  </button>
                ))}
                {common && <p className={styles.common}>{common}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
