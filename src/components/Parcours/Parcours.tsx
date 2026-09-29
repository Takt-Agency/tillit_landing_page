import { useState, type ReactNode } from 'react';
import styles from './Parcours.module.css';
import mascotUrl from '../../mascotte-coup-de-coeur.webp';
import { typo, useLang, type Lang } from '../../i18n';

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

type Step = { title: string; chip: string; desc: ReactNode; tone: string; icon: string };

const STEPS_FR: Step[] = [
  {
    title: 'On se met d’accord',
    chip: '≈ 2 min',
    tone: 'violet',
    icon: 'fa-handshake',
    desc: (
      <>
        «&nbsp;100&nbsp;€ par mois, ça te va&nbsp;?&nbsp;» Vous fixez le montant et les dates de remboursement{' '}
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
        <b>banque à banque</b>&nbsp;: TilliT ne détient jamais les fonds.
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

const STEPS_EN: Step[] = [
  {
    title: 'You two agree',
    chip: '≈ 2 min',
    tone: 'violet',
    icon: 'fa-handshake',
    desc: (
      <>
        “€100 a month, does that work?” You set the amount and the repayment dates{' '}
        <b>before the transfer</b>. Either of you can suggest something else.
      </>
    ),
  },
  {
    title: 'The loan starts',
    chip: 'Confirmed by both',
    tone: 'coral',
    icon: 'fa-building-columns',
    desc: (
      <>
        Léonie confirms she’s sent it, Thomas confirms he’s received it. The money goes straight
        from <b>bank to bank</b>: TilliT never holds the money.
      </>
    ),
  },
  {
    title: 'It moves along',
    chip: 'Automatic reminders',
    tone: 'blue',
    icon: 'fa-bell',
    desc: (
      <>
        Thomas records <b>each repayment</b>, Léonie confirms it. You share the same tracking, and
        TilliT takes care of the reminders.
      </>
    ),
  },
  {
    title: 'Loan done',
    chip: 'A thank you',
    tone: 'green',
    icon: 'fa-heart',
    desc: (
      <>
        Once the last repayment is confirmed, the loan is marked as <b>repaid</b> for you both.
      </>
    ),
  },
];

const STEPS: Record<Lang, Step[]> = { fr: STEPS_FR, en: STEPS_EN };

const VIEWS_FR: Record<string, View> = {
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

const VIEWS_EN: Record<string, View> = {
  'p-0': {
    screen: {
      head: 'Thomas is asking you for €500',
      sub: 'Nothing starts without your answer.',
      amount: '€500.00',
      rows: [
        ['Pace', '5 × €100'],
        ['First instalment', '12 April'],
        ['Interest', '0%'],
      ],
      btns: [
        { label: 'I accept' },
        { label: 'Suggest something else', kind: 'ghost' },
        { label: 'Decline', kind: 'danger' },
      ],
    },
    benefit:
      'Léonie gets a clear request: €500, in five instalments. She knows what she’s saying yes to.',
  },
  'p-1': {
    screen: {
      head: 'Has the money gone out?',
      sub: 'The loan starts once you’ve both confirmed it.',
      rows: [
        ['Léonie → Thomas', '€500.00'],
        ['Bank transfer', '12 March'],
      ],
      btns: [{ label: 'I’ve sent the €500' }],
      note: 'TilliT never holds the money. The transfer goes from your bank to his.',
    },
    benefit: 'Léonie makes the transfer from her bank, as usual, then notes it in the app.',
  },
  'p-2': {
    screen: {
      head: 'Thomas has repaid €100',
      sub: 'Can you confirm it’s arrived?',
      amount: '€200.00',
      amountSub: 'repaid of €500',
      gauge: 40,
      btns: [{ label: 'Yes, I confirm' }, { label: 'I haven’t seen it', kind: 'ghost' }],
      note: 'Thomas got his reminder. You don’t have to bring it up yourself.',
    },
    benefit:
      'Léonie never had to write “did you remember the transfer?”. The reminder went out on its own.',
  },
  'p-3': {
    screen: {
      head: 'Loan repaid!',
      ok: true,
      amount: '€500.00',
      amountSub: 'repaid by Thomas · never late',
      gauge: 100,
      rows: [
        ['Length', '5 months'],
        ['Interest paid', '€0.00'],
      ],
      btns: [{ label: 'See the summary' }],
    },
    benefit: 'The reminders go out on their own. Léonie never had to bring it up.',
  },
  'p-2-difficile': {
    screen: {
      head: 'Thomas suggests moving a date',
      sub: 'He tells you before the due date.',
      rows: [
        ['Planned', '€100 on 12 June'],
        ['Suggested', '€50 on the 12th · €50 on the 25th'],
      ],
      btns: [{ label: 'I accept' }, { label: 'Suggest something else', kind: 'ghost' }],
      note: 'The total doesn’t change. Only the calendar moves.',
    },
    benefit: 'Léonie hears about it in time. Nothing moves without her agreement.',
  },
  'p-2-avance': {
    screen: {
      head: 'Thomas has repaid €200',
      sub: 'Two instalments ahead.',
      amount: '€400.00',
      amountSub: 'repaid of €500',
      gauge: 80,
      btns: [{ label: 'I confirm' }],
      note: 'Next and last instalment: 12 August.',
    },
    benefit: 'Léonie sees the amount left to repay drop faster than planned.',
  },
  'e-0': {
    screen: {
      head: 'Ask Léonie',
      sub: 'Say how much, and how you’ll repay.',
      amount: '€500.00',
      rows: [
        ['How many instalments', '5 × €100'],
        ['Starting', '12 April'],
        ['Planned end', '12 August'],
      ],
      btns: [{ label: 'Send to Léonie' }],
      note: 'Léonie can accept, decline or suggest something else.',
    },
    benefit:
      'No more “er, I wanted to ask you something…”. Thomas sends the amount and the dates in one go.',
  },
  'e-1': {
    screen: {
      head: 'Léonie has sent the €500',
      sub: 'Can you confirm it’s arrived?',
      amount: '€500.00',
      amountSub: 'received on 12 March',
      btns: [{ label: 'Yes, it’s arrived' }, { label: 'Not yet', kind: 'ghost' }],
      note: 'Until that’s confirmed, no instalment is running.',
    },
    benefit: '“It’s arrived.” Thomas confirms it, and the schedule starts.',
  },
  'e-2': {
    screen: {
      head: 'Loan in progress',
      sub: 'Everything’s up to date.',
      amount: '€200.00',
      amountSub: 'repaid of €500',
      gauge: 40,
      rows: [
        ['Next instalment', '12 June'],
        ['Amount', '€100.00'],
      ],
      btns: [{ label: 'I’ve repaid' }, { label: 'It’s going to be tight', kind: 'ghost' }],
    },
    benefit: 'Thomas knows when to pay and how much is left. No surprises.',
  },
  'e-3': {
    screen: {
      head: 'Loan repaid!',
      ok: true,
      amount: '€500.00',
      amountSub: 'repaid to Léonie, on time',
      gauge: 100,
      btns: [{ label: 'Send Léonie a thank you' }],
      note: 'Your Carnet de prêt (loan record book) has just been updated.',
    },
    benefit: 'Thomas kept every date. He and Léonie have already moved on.',
  },
  'e-2-difficile': {
    screen: {
      head: 'This month is tight',
      sub: 'Tell Léonie, and suggest another calendar.',
      rows: [
        ['Instalment due', '12 June'],
        ['Amount', '€100.00'],
      ],
      btns: [{ label: 'Move this instalment' }, { label: 'Pay part of it', kind: 'ghost' }],
      note: 'The change applies once you’ve both accepted it.',
    },
    benefit: 'Thomas speaks up in time, without the phone call everyone dreads.',
  },
  'e-2-avance': {
    screen: {
      head: 'Pay ahead',
      sub: 'Your next instalments will be settled.',
      rows: [
        ['2 instalments', '€200.00'],
        ['Next one after that', '12 August'],
      ],
      btns: [{ label: 'Pay €200' }, { label: 'Repay it all (€300)', kind: 'ghost' }],
    },
    benefit: 'Thomas gets ahead when he can, with nothing to renegotiate.',
  },
};

const VIEWS: Record<Lang, Record<string, View>> = { fr: VIEWS_FR, en: VIEWS_EN };

type VariantItem = {
  key: Exclude<Variant, ''>;
  title: string;
  text: string;
  icon: string;
  common: ReactNode;
};

const VARIANTS_FR: VariantItem[] = [
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

const VARIANTS_EN: VariantItem[] = [
  {
    key: 'difficile',
    title: 'What if this month is tight?',
    text: 'Say so before the due date, and suggest other dates.',
    icon: 'fa-cloud-rain',
    common: 'Speaking up early already looks after the other person. The rest you decide together.',
  },
  {
    key: 'avance',
    title: 'What if I can repay sooner?',
    text: 'Settle several instalments at once, or repay it all.',
    icon: 'fa-forward-fast',
    common: (
      <>
        Paying sooner settles the <b>next instalments</b>. The others keep their amount and their
        date.
      </>
    ),
  },
];

const VARIANTS: Record<Lang, VariantItem[]> = { fr: VARIANTS_FR, en: VARIANTS_EN };

const UI = {
  fr: {
    kicker: 'La solution',
    bubble: '« Je te rends ça vite. »',
    intro2: 'Avec TilliT, vous savez tous les deux où vous en êtes.',
    hint: 'Choisis une étape, puis change de côté.',
    stepsLabel: 'Les quatre moments du prêt',
    rolesLabel: 'Voir le prêt côté prêteur ou côté emprunteur',
    lender: 'Prêteur',
    borrower: 'Emprunteur',
    lenderWho: 'elle prête',
    borrowerWho: 'il emprunte',
    prev: 'Étape précédente',
    next: 'Étape suivante',
    stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
    variantsLabel: 'Deux cas particuliers de l’étape 3',
  },
  en: {
    kicker: 'The solution',
    bubble: '“I’ll pay you back soon.”',
    intro2: 'With TilliT, you both know where things stand.',
    hint: 'Pick a step, then switch sides.',
    stepsLabel: 'The four moments of the loan',
    rolesLabel: 'See the loan from the lender’s side or the borrower’s side',
    lender: 'Lender',
    borrower: 'Borrower',
    lenderWho: 'she lends',
    borrowerWho: 'he borrows',
    prev: 'Previous step',
    next: 'Next step',
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    variantsLabel: 'Two special cases in step 3',
  },
};

function PhoneScreen({ screen, lang }: { screen: Screen; lang: Lang }) {
  return (
    <div className={styles.app}>
      {screen.ok && (
        <img src={mascotUrl} alt="" className={styles.appMascot} width={111} height={120} />
      )}
      <p className={`${styles.appHead} ${screen.ok ? styles.appHeadOk : ''}`}>{typo(screen.head, lang)}</p>
      {screen.sub && <p className={styles.appSub}>{typo(screen.sub, lang)}</p>}
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
            {typo(b.label, lang)}
          </span>
        ))}
      </div>
      {screen.note && <p className={styles.appNote}>{typo(screen.note, lang)}</p>}
    </div>
  );
}

export default function Parcours() {
  const lang = useLang();
  const t = UI[lang];
  const steps = STEPS[lang];
  const variants = VARIANTS[lang];
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>('p');
  const [variant, setVariant] = useState<Variant>('');

  const activeVariant = step === 2 ? variant : '';
  const key = `${role}-${step}${activeVariant ? `-${activeVariant}` : ''}`;
  const view = VIEWS[lang][key];
  const common = variants.find((v) => v.key === activeVariant)?.common;

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
          <span className={styles.kicker}>{t.kicker}</span>
          <h2 className={styles.intro} id="parcours-title">
            <span className={styles.bubble}>{t.bubble}</span>
            <span className={styles.intro2}>
              {t.intro2}
            </span>
          </h2>
          <p className={styles.hint}>
            <i className="fa-solid fa-hand-pointer" aria-hidden="true" />
            {t.hint}
          </p>
        </header>

        <div className={styles.layout} data-reveal>
          <ol
            className={styles.steps}
            aria-label={t.stepsLabel}
            style={{ ['--progress' as string]: step / (steps.length - 1) }}
          >
            {steps.map((s, i) => (
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

          <div className={`${styles.stage} ${styles[`tone_${steps[step].tone}`]}`}>
            <div
              className={styles.roles}
              role="tablist"
              aria-label={t.rolesLabel}
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
                  {r === 'p' ? t.lender : t.borrower}
                </button>
              ))}
            </div>

            <div id="parcours-scene" className={styles.scene} role="tabpanel" aria-live="polite">
              <p className={styles.who}>
                {role === 'p' ? (
                  <>
                    <b>Léonie</b> · {t.lenderWho}
                  </>
                ) : (
                  <>
                    <b>Thomas</b> · {t.borrowerWho}
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
                    <PhoneScreen screen={view.screen} lang={lang} />
                  </div>
                </div>
              </div>

              <p className={styles.benefit} key={`b-${key}`}>
                <span className={styles.benefitIcon} aria-hidden="true">
                  <i className="fa-solid fa-heart" />
                </span>
                <span>{typo(view.benefit, lang)}</span>
              </p>
            </div>

            <div className={styles.nav}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => selectStep(step - 1)}
                disabled={step === 0}
                aria-label={t.prev}
              >
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              </button>
              <span className={styles.navDots} aria-live="polite">
                <span className="sr-only">
                  {t.stepOf(step + 1, steps.length)}
                </span>
                {steps.map((s, i) => (
                  <i
                    key={s.title}
                    aria-hidden="true"
                    className={i === step ? styles.navDotActive : ''}
                  />
                ))}
                <b aria-hidden="true">
                  {step + 1} / {steps.length}
                </b>
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => selectStep(step + 1)}
                disabled={step === steps.length - 1}
                aria-label={t.next}
              >
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </button>
            </div>

            {step === 2 && (
              <div
                className={styles.variants}
                role="group"
                aria-label={t.variantsLabel}
              >
                {variants.map((v) => (
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
                      <b>{typo(v.title, lang)}</b>
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
