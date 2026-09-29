import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type Role = 'p' | 'e';

export type FaqItem = {
  id: string;
  roles: Role[];
  q: string;
  a: ReactNode;
  legal?: string;
};

export type FaqTheme = { id: string; title: string; icon: string; items: FaqItem[] };

const BOTH: Role[] = ['p', 'e'];

export const THEMES: FaqTheme[] = [
    {
      id: 'faq-theme-essentiel',
      title: 'L’essentiel',
      icon: 'fa-star',
      items: [
        {
          id: '01',
          roles: BOTH,
          q: 'TilliT est-il une banque ou un organisme de crédit ?',
          a: 'Non. TilliT n’est ni une banque ni un organisme de crédit. TilliT permettra d’organiser un prêt entre proches : accord, échéancier, suivi, rappels et, avec Zen, reconnaissance de dette. Les fonds ne transitent pas par TilliT et aucun intérêt n’est appliqué.',
        },
        {
          id: '15',
          roles: BOTH,
          q: 'Peut-on demander des intérêts ?',
          a: 'Non. Avec TilliT, un prêt est à 0 % d’intérêt : ton proche te rend la somme prêtée, aux dates que vous avez fixées ensemble. Le seul prix possible est celui de TilliT Zen, payé une seule fois. Le prêteur ou l’emprunteur peut le payer : vous choisissez ensemble.',
        },
        {
          id: '02',
          roles: BOTH,
          q: 'Comment se font les versements ?',
          a: 'Directement entre vous, par virement classique. Le prêteur enverra l’argent à l’emprunteur depuis sa banque, et les remboursements suivront le même chemin.',
        },
        {
          id: '11',
          roles: BOTH,
          q: 'Puis-je l’utiliser en famille ?',
          a: 'Oui. Un parent qui avance le permis, une sœur qui dépanne en fin de mois, un cousin qui prête pour un billet. TilliT évitera que le sujet revienne à chaque repas de famille.',
        },
        {
          id: '10',
          roles: BOTH,
          q: 'Mes données sont-elles partagées ?',
          a: (
            <>
              L’application n’est pas encore sortie. Tes informations de prêt seront visibles
              uniquement par toi et par la personne concernée. Elles ne seront jamais revendues
              ni utilisées à des fins publicitaires. Le traitement de tes données sera soumis au
              RGPD : tu pourras y accéder, les corriger, les exporter ou demander leur
              suppression. Pour le site, le détail est sur la{' '}
              <Link to="/confidentialite">page Confidentialité</Link>
              . Tu pourras aussi saisir la CNIL.
            </>
          ),
          legal: 'À faire valider par notre conseil',
        },
        {
          id: '16',
          roles: ['p'],
          q: 'Mon prêt est-il transmis à un organisme de crédit ?',
          a: (
            <>
              Non. TilliT n’est ni une banque ni un organisme de crédit. Ton Carnet de prêt n’est
              pas partagé sans ton accord. Il n’est jamais transmis à un organisme de crédit ni à
              un tiers commercial. Et un refus de prêt n’y figure pas : dire non à quelqu’un reste
              un droit. <Link to="/confiance#carnet">Le Carnet de prêt</Link>
            </>
          ),
        },
        {
          id: '19',
          roles: ['e'],
          q: 'Est-ce que ça peut me ficher à la Banque de France ?',
          a: 'Non. TilliT n’est ni une banque ni un organisme de crédit, et n’accorde aucun crédit : l’argent vient de ton proche, par virement, d’une banque à l’autre. Ton Carnet de prêt n’est pas partagé sans ton accord. Il n’est jamais transmis à un organisme de crédit ni à un tiers commercial. Et un refus de prêt n’y figure pas.',
          legal: 'À faire valider par notre conseil',
        },
        {
          id: '18',
          roles: ['e'],
          q: 'Qu’est-ce que mon proche voit de moi ?',
          a: (
            <>
              Le prêt que vous organisez ensemble : le montant, les échéances et les
              remboursements déjà confirmés, au même endroit pour vous deux. Rien d’autre : tes
              informations de prêt seront visibles uniquement par toi et par la personne
              concernée. Ton Carnet de prêt, lui, n’est pas partagé sans ton accord.{' '}
              <Link to="/confiance#carnet">Le Carnet de prêt</Link>
            </>
          ),
        },
      ],
    },
    {
      id: 'faq-theme-prix',
      title: 'Prix et formules',
      icon: 'fa-tag',
      items: [
        {
          id: '03',
          roles: BOTH,
          q: 'Que comprend le prix de Zen ?',
          a: 'Le prix de Zen couvre la création, la signature électronique et la conservation sécurisée de la reconnaissance de dette. Signature avec France Identité : incluse. Signature avec FranceConnect : +1,50 € par signataire qui l’utilise. Le prix dépend du montant prêté et se paie une seule fois, sans abonnement. Le prêteur ou l’emprunteur peut payer TilliT Zen : vous choisissez ensemble.',
        },
        {
          id: '20',
          roles: ['e'],
          q: 'Côté emprunteur, est-ce que je paie quelque chose ?',
          a: (
            <>
              Avec Note, tu ne paies rien pour un prêt jusqu’à 1 500 €. Avec Zen, le prix se paie
              une seule fois, sans abonnement, et vous choisissez ensemble qui le paie : si c’est
              ton proche, tu n’as rien à régler. Une exception : si tu choisis FranceConnect pour
              signer, ce parcours coûte 1,50 € de plus, payés uniquement par la personne qui le
              choisit. Dans tous les cas, le prêt reste à 0 % d’intérêt.{' '}
              <Link to="/tarifs">Voir les formules</Link>
            </>
          ),
        },
        {
          id: '04',
          roles: BOTH,
          q: 'Pourquoi 1 500 € revient-il souvent ?',
          a: 'C’est le seuil de preuve que fixe la loi française. Pour les petits montants, des messages, un virement ou un témoignage peuvent contribuer à prouver le prêt. Garder un écrit reste utile pour préciser le montant et le remboursement prévu. Au-dessus, il faut un écrit. C’est exactement pour ça que Note s’arrête à 1 500 € par prêt et que Zen prend le relais avec un document signé.',
          legal: 'Article 1359 du Code civil · à faire valider par notre conseil',
        },
      ],
    },
    {
      id: 'faq-theme-pendant',
      title: 'Pendant le prêt',
      icon: 'fa-calendar-days',
      items: [
        {
          id: '14',
          roles: BOTH,
          q: 'Peut-on changer les dates de remboursement ?',
          a: 'L’application n’est pas encore sortie. L’un de vous proposera un nouveau calendrier. L’autre pourra accepter, proposer autre chose ou refuser. Le changement s’appliquera une fois accepté par vous deux.',
        },
        {
          id: '21',
          roles: ['e'],
          q: 'Et si un mois je ne peux pas payer ?',
          a: (
            <>
              Dis-le avant l’échéance, et propose d’autres dates. Ton proche pourra accepter,
              proposer autre chose ou refuser. Une fois accepté par vous deux, le nouveau calendrier
              remplace l’ancien. Prévenir tôt, c’est déjà prendre soin de l’autre.{' '}
              <Link to="/article-imprevu-echeancier">
                Quand un proche ne peut plus suivre l’échéancier
              </Link>
            </>
          ),
        },
        {
          id: '17',
          roles: BOTH,
          q: 'Peut-on rembourser plus tôt ?',
          a: (
            <>
              Oui, en partie ou en totalité. Payer plus tôt règle les prochaines échéances ; les
              autres gardent leur montant et leur date. Rembourser en avance ne coûte rien de plus
              : le prêt est à 0 % d’intérêt, et Zen se paie une seule fois.{' '}
              <Link to="/comment-ca-marche">Le déroulé d’un prêt</Link>
            </>
          ),
        },
        {
          id: '08',
          roles: ['p'],
          q: 'Que se passe-t-il si mon proche ne rembourse pas ?',
          a: (
            <>
              TilliT ne garantit pas le remboursement, et ne fait pas de recouvrement. Ce que tu
              as en main, c’est ton dossier : le montant, l’échéancier accepté par vous deux,
              chaque remboursement confirmé, les dates et vos échanges. Avec Zen, s’y ajoute la
              reconnaissance de dette signée. Tu auras donc les éléments essentiels si tu dois
              aller plus loin. La suite est écrite pas à pas, de la lettre recommandée jusqu’au
              juge. TilliT ne remplace pas un avocat.{' '}
              <Link to="/recours">La marche à suivre</Link>
            </>
          ),
          legal: 'À faire valider par notre conseil',
        },
        {
          id: '09',
          roles: ['p'],
          q: 'TilliT garantit-il le remboursement ?',
          a: (
            <>
              Non, et on ne le prétendra jamais. TilliT aidera celui qui prête à se ménager une
              preuve de la dette, en cas de non-remboursement ou de litige. Il réduira aussi les
              risques de malentendus, d’oubli et de non-dits. On ne remplace pas la confiance. On
              lui donne un cadre. Si la conversation s’arrête,{' '}
              <Link to="/confiance#temoin">le Tiers de confiance</Link> peut vous aider à la
              reprendre.
            </>
          ),
          legal: 'À faire valider par notre conseil',
        },
      ],
    },
    {
      id: 'faq-theme-loi',
      title: 'Loi et impôts',
      icon: 'fa-scale-balanced',
      items: [
        {
          id: '05',
          roles: BOTH,
          q: 'Dois-je déclarer le prêt aux impôts ?',
          a: 'Oui, dès que le total dépasse le seuil de déclaration de 5 000 € sur une même année civile. On additionne tous les prêts de l’année : aucun n’a besoin d’atteindre 5 000 € à lui seul. Deux prêts de 3 000 €, et les deux sont à déclarer, même s’ils vont à des personnes différentes. Un prêt de 5 000 € ne dépasse pas le seuil à lui seul. Plusieurs prêts conclus dans l’année avec la même personne peuvent le dépasser au total, et déclencher la déclaration. La règle vaut dans les deux sens, pour ce que tu prêtes comme pour ce que tu empruntes. C’est une simple déclaration (le formulaire n° 2062), à joindre à la déclaration de revenus ; elle revient à celui qui emprunte, sauf si tu as prêté à plusieurs personnes des montants chacun sous le seuil, auquel cas elle te revient. Cette déclaration informe l’administration : déclarer le prêt ne crée pas, à lui seul, un impôt à payer.',
          legal:
            'Article 49 B de l’annexe III au CGI · arrêté du 23 septembre 2020 · à faire valider par notre conseil',
        },
        {
          id: '06',
          roles: BOTH,
          q: 'Un prêt peut-il être requalifié en cadeau ?',
          a: (
            <>
              Un retard ne transforme pas un prêt en cadeau. La question se pose si celui qui a
              prêté renonce finalement au remboursement : la somme peut alors être considérée
              comme une donation, et celui qui a reçu l’argent peut être imposé, selon votre lien
              de parenté. Mettre le prêt par écrit dès le départ permet de préciser que la somme
              doit être remboursée. Un prêt remboursé laisse ensuite une trace dans{' '}
              <Link to="/confiance#carnet">ton Carnet de prêt</Link>.
            </>
          ),
          legal: 'À faire valider par notre conseil',
        },
        {
          id: '07',
          roles: ['p'],
          q: 'Quel délai pour réclamer un remboursement ?',
          a: 'Le délai pour agir est de cinq ans. Il part de la date à laquelle le remboursement était dû. Si le prêt se rembourse en plusieurs fois, chaque échéance a son propre délai, qui part de sa date. Les plus anciennes peuvent donc être hors délai avant les autres. N’attends pas la fin de l’échéancier. C’est une raison de plus de fixer des échéances datées plutôt qu’un vague « quand tu peux ».',
          legal:
            'Articles 2224 et 2233 du Code civil · Cour de cassation, 1re civ., 11 février 2016, n° 14-28.383 · à faire valider par notre conseil',
        },
        {
          id: '12',
          roles: BOTH,
          q: 'Que se passe-t-il en cas de décès ?',
          a: 'Par principe, le prêt ne disparaît pas. Si celui qui a prêté décède, ses héritiers reprennent le droit d’être remboursés. Si c’est celui qui a emprunté, la dette entre dans sa succession. Ce que ses héritiers auront à payer dépend de leur choix : accepter la succession, l’accepter dans la limite de ce qu’elle contient, ou y renoncer. Dans les deux cas, un document écrit évite de faire porter le sujet à des gens qui n’étaient pas là au départ.',
          legal: 'À faire valider par notre conseil',
        },
        {
          id: '13',
          roles: BOTH,
          q: 'La reconnaissance de dette Zen suffit-elle en cas de litige ?',
          a: 'Elle apporte une preuve relative à l’accord et son contenu. Elle n’est pas un titre exécutoire. Il faudra passer par un juge pour aller au bout.',
          legal: 'À faire valider par notre conseil',
        },
      ],
    },
];
