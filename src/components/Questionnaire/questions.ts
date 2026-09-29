import type { Lang } from '../../i18n';

/** `value` is what the form keeps: always the French answer, in both languages. */
export type Option = { label: Record<Lang, string>; value: string };

export type Question = {
  field: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: Record<Lang, string>;
  multiple: boolean;
  options: Option[];
  /** Field sent for the free text shown when « Autre » is checked. */
  otherField?: 'q3_autre' | 'q4_autre' | 'q5_autre';
  /** Answer that unchecks every other one (and is unchecked by any other). */
  exclusive?: string;
};

/** [French label = value, English label] pairs. */
const same = (pairs: [fr: string, en: string][]): Option[] =>
  pairs.map(([fr, en]) => ({ label: { fr, en }, value: fr }));

export const QUESTIONS: Question[] = [
  {
    field: 'q1',
    title: {
      fr: 'As-tu déjà prêté ou emprunté de l’argent à un proche ?',
      en: 'Have you ever lent money to someone close to you, or borrowed from them?',
    },
    multiple: false,
    options: [
      { label: { fr: 'Oui, j’ai prêté', en: 'Yes, I’ve lent' }, value: 'Oui, j’ai prêté' },
      { label: { fr: 'Oui, j’ai emprunté', en: 'Yes, I’ve borrowed' }, value: 'Oui, j’ai emprunté' },
      { label: { fr: 'Oui, les deux', en: 'Yes, both' }, value: 'Oui, j’ai prêté et emprunté' },
      {
        label: { fr: 'Non, mais cela pourrait m’arriver', en: 'No, but it could happen' },
        value: 'Non, mais cela pourrait m’arriver',
      },
    ],
  },
  {
    field: 'q2',
    title: {
      fr: 'Quel était le montant de ton dernier prêt ?',
      en: 'How much was your last loan?',
    },
    multiple: false,
    options: same([
      ['Moins de 100 €', 'Less than €100'],
      ['De 100 à 300 €', '€100 to €300'],
      ['De 301 à 500 €', '€301 to €500'],
      ['De 501 à 1 000 €', '€501 to €1,000'],
      ['De 1 001 à 1 500 €', '€1,001 to €1,500'],
      ['Plus de 1 500 €', 'More than €1,500'],
    ]),
  },
  {
    field: 'q3',
    title: {
      fr: 'Dans quel(s) contexte(s) as-tu déjà prêté ou emprunté ?',
      en: 'In what situations have you lent or borrowed?',
    },
    multiple: true,
    otherField: 'q3_autre',
    options: same([
      ['Finir le mois', 'Making it to payday'],
      ['Réparer une voiture', 'Fixing a car'],
      ['Acheter une voiture', 'Buying a car'],
      ['Caution/logement', 'Deposit or housing'],
      ['Voyage entre amis', 'A trip with friends'],
      ['Dépenses partagées', 'Shared expenses'],
      ['Permis', 'Driving licence'],
      ['Études', 'Studies'],
      ['Santé', 'Health'],
      ['Dépense imprévue', 'An unexpected expense'],
      [
        'Incident de la vie (accident, décès, séparation…)',
        'A life event (accident, bereavement, separation…)',
      ],
      ['Immobilier', 'Property'],
      ['Autre', 'Something else'],
    ]),
  },
  {
    field: 'q4',
    title: {
      fr: 'Quelles difficultés as-tu déjà rencontrées ?',
      en: 'What went wrong for you?',
    },
    multiple: true,
    otherField: 'q4_autre',
    exclusive: 'Aucune difficulté',
    options: same([
      ['Je n’osais pas demander l’argent', 'I didn’t dare ask for the money'],
      ['Je n’osais pas relancer', 'I didn’t dare follow up'],
      ['Pas de date définie', 'No date was set'],
      ['Retard des remboursements', 'Late repayments'],
      ['Échéances oubliées', 'Forgotten instalments'],
      ['Difficile de savoir où on en était', 'Hard to know where we stood'],
      ['Tension dans la relation', 'Tension in the relationship'],
      ['On a coupé les ponts', 'We stopped speaking'],
      ['Violence physique', 'Physical violence'],
      ['Justice', 'Court'],
      ['Jamais récupéré l’argent', 'Never got the money back'],
      ['Récupéré qu’une partie', 'Got only part of it back'],
      ['Autre', 'Something else'],
      ['Aucune difficulté', 'Nothing went wrong'],
    ]),
  },
  {
    field: 'q5',
    title: {
      fr: 'Quels outils as-tu utilisés pour gérer ce prêt ?',
      en: 'What did you use to keep track of that loan?',
    },
    multiple: true,
    otherField: 'q5_autre',
    exclusive: 'Aucun',
    options: same([
      ['Messages (SMS, WhatsApp…)', 'Messages (SMS, WhatsApp…)'],
      [
        'Application de partage de dépenses (Tricount, Splitwise…)',
        'An expense-splitting app (Tricount, Splitwise…)',
      ],
      ['Notes du téléphone', 'Notes on my phone'],
      ['Tableur (Excel, Google Sheets…)', 'A spreadsheet (Excel, Google Sheets…)'],
      ['Virement bancaire uniquement', 'Bank transfers only'],
      ['Autre', 'Something else'],
      ['Aucun', 'None of these'],
    ]),
  },
];

export const AUTO_ADVANCE_MS = 180;
export const OTHER_MAX = 300;
