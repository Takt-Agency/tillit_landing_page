export type Option = { label: string; value: string };

export type Question = {
  field: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  multiple: boolean;
  options: Option[];
  /** Field sent for the free text shown when « Autre » is checked. */
  otherField?: 'q3_autre' | 'q4_autre' | 'q5_autre';
  /** Answer that unchecks every other one (and is unchecked by any other). */
  exclusive?: string;
};

const same = (labels: string[]): Option[] => labels.map((l) => ({ label: l, value: l }));

export const QUESTIONS: Question[] = [
  {
    field: 'q1',
    title: 'As-tu déjà prêté ou emprunté de l’argent à un proche ?',
    multiple: false,
    options: [
      { label: 'Oui, j’ai prêté', value: 'Oui, j’ai prêté' },
      { label: 'Oui, j’ai emprunté', value: 'Oui, j’ai emprunté' },
      { label: 'Oui, les deux', value: 'Oui, j’ai prêté et emprunté' },
      { label: 'Non, mais cela pourrait m’arriver', value: 'Non, mais cela pourrait m’arriver' },
    ],
  },
  {
    field: 'q2',
    title: 'Quel était le montant de ton dernier prêt ?',
    multiple: false,
    options: same([
      'Moins de 100 €',
      'De 100 à 300 €',
      'De 301 à 500 €',
      'De 501 à 1 000 €',
      'De 1 001 à 1 500 €',
      'Plus de 1 500 €',
    ]),
  },
  {
    field: 'q3',
    title: 'Dans quel(s) contexte(s) as-tu déjà prêté ou emprunté ?',
    multiple: true,
    otherField: 'q3_autre',
    options: same([
      'Finir le mois',
      'Réparer une voiture',
      'Acheter une voiture',
      'Caution/logement',
      'Voyage entre amis',
      'Dépenses partagées',
      'Permis',
      'Études',
      'Santé',
      'Dépense imprévue',
      'Incident de la vie (accident, décès, séparation…)',
      'Immobilier',
      'Autre',
    ]),
  },
  {
    field: 'q4',
    title: 'Quelles difficultés as-tu déjà rencontrées ?',
    multiple: true,
    otherField: 'q4_autre',
    exclusive: 'Aucune difficulté',
    options: same([
      'Je n’osais pas demander l’argent',
      'Je n’osais pas relancer',
      'Pas de date définie',
      'Retard des remboursements',
      'Échéances oubliées',
      'Difficile de savoir où on en était',
      'Tension dans la relation',
      'On a coupé les ponts',
      'Violence physique',
      'Justice',
      'Jamais récupéré l’argent',
      'Récupéré qu’une partie',
      'Autre',
      'Aucune difficulté',
    ]),
  },
  {
    field: 'q5',
    title: 'Quels outils as-tu utilisés pour gérer ce prêt ?',
    multiple: true,
    otherField: 'q5_autre',
    exclusive: 'Aucun',
    options: same([
      'Messages (SMS, WhatsApp…)',
      'Application de partage de dépenses (Tricount, Splitwise…)',
      'Notes du téléphone',
      'Tableur (Excel, Google Sheets…)',
      'Virement bancaire uniquement',
      'Autre',
      'Aucun',
    ]),
  },
];

export const AUTO_ADVANCE_MS = 180;
export const OTHER_MAX = 300;
