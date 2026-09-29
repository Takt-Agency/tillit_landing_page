import { isValidElement, type ReactNode } from 'react';

// Same approach as the reference site: answers are written in advance and picked
// by keyword score. Nothing is sent anywhere.

type Entry = { q: string; r: string; source: 'maison' | 'faq'; mq: string[]; mr: string[] };

const MAISON: [string, string][] = [
  [
    'Comment ça marche ?',
    'L’application n’est pas encore sortie. Tu créeras le prêt en deux minutes : le montant, le rythme, la date de fin. ' +
      'Ton proche pourra accepter, proposer autre chose, ou refuser. Ensuite TilliT enverra les rappels à ta ' +
      'place, et tu n’auras plus à relancer. Inscris-toi pour être prévenu du lancement.',
  ],
  [
    'Est-ce vraiment gratuit ?',
    'Oui. L’application n’est pas encore sortie. La formule Note sera sans frais jusqu’à 1 500 € : échéancier, ' +
      'rappels et historique partagé. Aucun intérêt, aucune commission sur la somme prêtée.',
  ],
  [
    'Mes données sont-elles protégées ?',
    'L’application n’est pas encore sortie. Tes informations de prêt seront visibles uniquement par toi et par la personne concernée. ' +
      'On ne revend pas tes données. Leur traitement sera soumis au RGPD : tu pourras y accéder, les corriger, ' +
      'les exporter ou demander leur suppression. Et les fonds ne transitent jamais par TilliT : le virement ' +
      'va de ta banque à la sienne.',
  ],
  [
    'Combien coûte Zen ? Quels sont les tarifs ?',
    'L’application n’est pas encore sortie. Note sera sans frais jusqu’à 1 500 €. Zen sera un paiement unique, ' +
      'selon le montant prêté, à partir de 2,99 €. Le prix reste le même, quelle que soit la durée du prêt. ' +
      'Signature avec France Identité : incluse. Signature avec FranceConnect : +1,50 € par signataire ' +
      'qui l’utilise. La grille complète est sur la page Tarifs.',
  ],
  [
    'Qu’apporte la formule Zen ?',
    'L’application n’est pas encore sortie. Zen ajoutera une reconnaissance de dette signée électroniquement avec Goodflag, puis ' +
      'conservée de façon sécurisée. Pour signer, chacun choisira son parcours. Signature avec France Identité : ' +
      'incluse. Signature avec FranceConnect : +1,50 € par signataire qui l’utilise. Un paiement unique, ' +
      'selon le montant prêté.',
  ],
];

export const DEFAUT =
  'Je ne trouve pas la réponse à celle-là, et je préfère te le dire plutôt ' +
  'que d’inventer. Je la transmets à l’équipe. En attendant, la FAQ couvre ' +
  'la banque, les versements, la fiscalité, les litiges.';

// Below this score the assistant says it doesn't know (value tuned on the reference site).
const SEUIL = 0.22;

const VIDES = new Set(
  (
    'a ai au aux avec avoir ce cet cette ces de des du elle elles en est et eu il ils ' +
    'je la le les leur lui ma mais me mes moi mon ne nos notre nous on ou par pas peu pour que ' +
    'qui sa se ses son sont sur ta te tes toi ton tu un une vos votre vous est-ce puis dois ' +
    'faire fait quoi comment combien pourquoi quand quel quelle quels quelles etre avez avoir ' +
    'plus tres bien alors donc ceci cela'
  ).split(' '),
);

function mots(t: string): string[] {
  return t
    .toLowerCase()
    .replace(/([0-9])[   ](?=[0-9])/g, '$1')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((m) => m.length > 2 && !VIDES.has(m));
}

// Two words match when one starts the other, on five letters at least.
function pareil(a: string, b: string) {
  if (a === b) return true;
  const n = Math.min(a.length, b.length);
  return n >= 5 && a.slice(0, n) === b.slice(0, n);
}

const contient = (liste: string[], m: string) => liste.some((x) => pareil(x, m));

// A word found in the question weighs three times more than in the answer.
function score(mq: string[], e: Entry) {
  if (!mq.length) return 0;
  let n = 0;
  for (const m of mq) {
    if (contient(e.mq, m)) n += 3;
    else if (contient(e.mr, m)) n += 1;
  }
  return n / (mq.length * 3);
}

const entree = (q: string, r: string, source: Entry['source']): Entry => ({
  q,
  r,
  source,
  mq: mots(q),
  mr: mots(r),
});

function toText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return node.type === 'br' ? ' ' : toText(node.props.children);
  }
  return '';
}

let savoir: Entry[] = MAISON.map(([q, r]) => entree(q, r, 'maison'));
let chargement: Promise<void> | null = null;

// The FAQ is read lazily, on first use, so it stays in sync with /faq.
export function charger(): Promise<void> {
  if (!chargement) {
    chargement = import('../FaqFull/faqData')
      .then(({ THEMES }) => {
        const faq = THEMES.flatMap((t) =>
          t.items.map((i) => entree(i.q, toText(i.a).replace(/\s+/g, ' ').trim(), 'faq')),
        );
        savoir = savoir.concat(faq);
      })
      .catch(() => {
        // Without the FAQ, the written answers are enough.
      });
  }
  return chargement;
}

export function repondre(question: string): string {
  const mq = mots(question);
  let meilleur: Entry | null = null;
  let best = 0;
  for (const e of savoir) {
    const s = score(mq, e);
    // On a tie the written answer wins: it is written for the chat.
    if (s > best || (s === best && meilleur && e.source === 'maison' && meilleur.source === 'faq')) {
      best = s;
      meilleur = e;
    }
  }
  return !meilleur || best < SEUIL ? DEFAUT : meilleur.r;
}
