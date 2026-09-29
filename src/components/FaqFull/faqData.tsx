import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { localize } from '../../i18n';

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

/** English links: the French path, mapped to the English slug. */
const en = (frHref: string) => localize(frHref, 'en');

/**
 * English version of THEMES: same shape, same theme and item ids, same roles,
 * same order. Copy taken verbatim from the English site (/en/faq).
 */
export const THEMES_EN: FaqTheme[] = [
  {
    id: 'faq-theme-essentiel',
    title: 'The essentials',
    icon: 'fa-star',
    items: [
      {
        id: '01',
        roles: BOTH,
        q: 'Is TilliT a bank or a credit provider?',
        a: 'No. TilliT is not a bank or a credit provider. TilliT will help you organise a loan between friends and family: the agreement, the schedule, the tracking, the reminders and, with Zen, an acknowledgement of debt. The money doesn’t pass through TilliT and no interest is charged.',
      },
      {
        id: '15',
        roles: BOTH,
        q: 'Can you charge interest?',
        a: 'No. With TilliT, a loan is at 0% interest: the person you lent to gives you back the amount you lent, on the dates you set together. The only possible cost is TilliT Zen, paid once. The lender or the borrower can pay it: you choose together.',
      },
      {
        id: '02',
        roles: BOTH,
        q: 'How does the money move?',
        a: 'Directly between you, by ordinary bank transfer. The lender will send the money to the borrower from their own bank, and the repayments will take the same route.',
      },
      {
        id: '11',
        roles: BOTH,
        q: 'Can I use it with my family?',
        a: 'Yes. A parent fronting the money for a driving licence, a sister helping out at the end of the month, a cousin lending for a ticket. TilliT will keep the subject from coming back at every family meal.',
      },
      {
        id: '10',
        roles: BOTH,
        q: 'Is my data shared?',
        a: (
          <>
            The app isn’t out yet. Your loan information will be visible only to you and to the
            person concerned. It will never be sold on, or used for advertising. Your data will be
            handled under the GDPR: you’ll be able to see it, correct it, export it or ask for it to
            be deleted. For the website, the detail is on the{' '}
            <Link to={en('/confidentialite')}>Privacy page</Link>. You’ll also be able to lodge a
            complaint with the CNIL.
          </>
        ),
        legal: 'To be validated by our legal counsel',
      },
      {
        id: '16',
        roles: ['p'],
        q: 'Is my loan reported to a credit provider?',
        a: (
          <>
            No. TilliT is not a bank or a credit provider. Your Carnet de prêt, your loan record
            book, isn’t shared without your agreement. It’s never passed to a credit provider, or to
            any commercial third party. And a refusal to lend doesn’t appear in it: saying no to
            someone stays your right. <Link to={en('/confiance#carnet')}>The Carnet de prêt</Link>
          </>
        ),
      },
      {
        id: '19',
        roles: ['e'],
        q: 'Can this get me listed by the Banque de France?',
        a: 'No. TilliT is not a bank or a credit provider, and grants no credit: the money comes from someone close to you, by bank transfer, from one bank to the other. Your Carnet de prêt, your loan record book, isn’t shared without your agreement. It’s never passed to a credit provider, or to any commercial third party. And a refusal to lend doesn’t appear in it.',
        legal: 'To be validated by our legal counsel',
      },
      {
        id: '18',
        roles: ['e'],
        q: 'What does the other person see about me?',
        a: (
          <>
            The loan you organise together: the amount, the instalments and the repayments already
            confirmed, in the same place for you both. Nothing else: your loan information will be
            visible only to you and to the person concerned. Your Carnet de prêt isn’t shared
            without your agreement. <Link to={en('/confiance#carnet')}>The Carnet de prêt</Link>
          </>
        ),
      },
    ],
  },
  {
    id: 'faq-theme-prix',
    title: 'Price and plans',
    icon: 'fa-tag',
    items: [
      {
        id: '03',
        roles: BOTH,
        q: 'What does the price of Zen cover?',
        a: 'The price of Zen covers drawing up, signing electronically and securely keeping the acknowledgement of debt. Signing with France Identité: included. Signing with FranceConnect: +€1.50 per signatory who uses it. The price depends on the amount lent and is paid once, with no subscription. The lender or the borrower can pay for TilliT Zen: you choose together.',
      },
      {
        id: '20',
        roles: ['e'],
        q: 'As the borrower, do I pay anything?',
        a: (
          <>
            With Note, you pay nothing for a loan of up to €1,500. With Zen, the price is paid once,
            with no subscription, and you choose together who pays: if it’s the other person, you
            have nothing to pay. One exception: if you choose FranceConnect to sign, that route
            costs €1.50 more, paid only by the person who chooses it. Either way, the loan stays at
            0% interest. <Link to={en('/tarifs')}>See the plans</Link>
          </>
        ),
      },
      {
        id: '04',
        roles: BOTH,
        q: 'Why does €1,500 keep coming up?',
        a: 'It’s the evidence threshold set by French law. For small amounts, messages, a bank transfer or a witness can help prove the loan. Keeping something in writing is still useful, to pin down the amount and the repayment agreed. Above that, you need something in writing. That’s exactly why Note stops at €1,500 per loan and Zen takes over, with a signed document.',
        legal: 'Article 1359 of the Code civil · to be validated by our legal counsel',
      },
    ],
  },
  {
    id: 'faq-theme-pendant',
    title: 'During the loan',
    icon: 'fa-calendar-days',
    items: [
      {
        id: '14',
        roles: BOTH,
        q: 'Can the repayment dates be changed?',
        a: 'The app isn’t out yet. One of you will propose a new schedule. The other will be able to accept it, propose something else or say no. The change will apply once you’ve both accepted it.',
      },
      {
        id: '21',
        roles: ['e'],
        q: 'What if I can’t pay one month?',
        a: (
          <>
            Say so before the due date, and propose other dates. The other person can accept,
            propose something else or say no. Once you’ve both accepted, the new schedule replaces
            the old one. Speaking up early is already taking care of the other person.{' '}
            <Link to={en('/article-imprevu-echeancier')}>
              When someone can no longer keep to the schedule
            </Link>
          </>
        ),
      },
      {
        id: '17',
        roles: BOTH,
        q: 'Can the loan be repaid early?',
        a: (
          <>
            Yes, in part or in full. Paying early settles the next instalments; the others keep
            their amount and their date. Repaying early costs nothing more: the loan is at 0%
            interest, and Zen is paid once.{' '}
            <Link to={en('/comment-ca-marche')}>How a loan runs</Link>
          </>
        ),
      },
      {
        id: '08',
        roles: ['p'],
        q: 'What happens if the other person doesn’t repay?',
        a: (
          <>
            TilliT does not guarantee repayment, and does not do debt collection. What you have in
            hand is your file: the amount, the schedule you both accepted, every confirmed
            repayment, the dates and your messages. With Zen, the signed acknowledgement of debt is
            added to it. So you’ll have the essentials if you have to take it further. What comes
            next is written out step by step, from the registered letter to the judge. TilliT
            doesn’t replace a lawyer. <Link to={en('/recours')}>The steps to follow</Link>
          </>
        ),
        legal: 'To be validated by our legal counsel',
      },
      {
        id: '09',
        roles: ['p'],
        q: 'Does TilliT guarantee repayment?',
        a: (
          <>
            No, and we’ll never claim it does. TilliT will help the lender keep evidence of the
            debt, if repayment doesn’t come or there’s a dispute. It will also cut the risk of
            misunderstandings, of forgetting, of things left unsaid. We don’t replace trust. We give
            it a frame. If the conversation stops,{' '}
            <Link to={en('/confiance#temoin')}>the trusted third party</Link> can help you pick it
            up again.
          </>
        ),
        legal: 'To be validated by our legal counsel',
      },
    ],
  },
  {
    id: 'faq-theme-loi',
    title: 'Law and tax',
    icon: 'fa-scale-balanced',
    items: [
      {
        id: '05',
        roles: BOTH,
        q: 'Do I have to declare the loan to the tax office?',
        a: 'Yes, as soon as the total goes over the €5,000 declaration threshold within the same calendar year. You add up all the loans of the year: none of them has to reach €5,000 on its own. Two loans of €3,000, and both are to be declared, even if they go to different people. A single loan of €5,000 doesn’t go over the threshold on its own. Several loans made within the year with the same person can go over it in total, and trigger the declaration. The rule works both ways, for what you lend as for what you borrow. It’s a simple declaration (the formulaire n° 2062), to attach to your income tax return; it falls to the borrower, unless you have lent several people amounts each under the threshold, in which case it falls to you. This declaration informs the tax authorities: declaring the loan doesn’t, in itself, create tax to pay.',
        legal:
          'Article 49 B of Annexe III to the CGI · arrêté of 23 September 2020 · to be validated by our legal counsel',
      },
      {
        id: '06',
        roles: BOTH,
        q: 'Can a loan be reclassified as a gift?',
        a: (
          <>
            A late payment doesn’t turn a loan into a gift. The question comes up if the lender ends
            up giving up on repayment: the sum can then be counted as a donation, a gift in tax
            terms, and the person who received the money can be taxed on it, depending on how the
            two of you are related. Putting the loan in writing from the start makes clear that the
            sum is to be repaid. A loan repaid then leaves a trace in{' '}
            <Link to={en('/confiance#carnet')}>your Carnet de prêt</Link>.
          </>
        ),
        legal: 'To be validated by our legal counsel',
      },
      {
        id: '07',
        roles: ['p'],
        q: 'How long do I have to claim repayment?',
        a: 'The time limit to act is five years. It runs from the date the repayment was due. If the loan is repaid in instalments, each instalment has its own time limit, running from its own date. So the oldest ones can fall out of time before the others. Don’t wait for the end of the schedule. It’s one more reason to set dated instalments rather than a vague “whenever you can”.',
        legal:
          'Articles 2224 and 2233 of the Code civil · Cour de cassation, 1re civ., 11 February 2016, n° 14-28.383 · to be validated by our legal counsel',
      },
      {
        id: '12',
        roles: BOTH,
        q: 'What happens if someone dies?',
        a: 'As a rule, the loan doesn’t disappear. If the lender dies, their heirs take over the right to be repaid. If it’s the borrower, the debt goes into their estate. What their heirs have to pay depends on their choice: accepting the estate, accepting it up to what it contains, or turning it down. Either way, a written document keeps the subject from landing on people who weren’t there at the start.',
        legal: 'To be validated by our legal counsel',
      },
      {
        id: '13',
        roles: BOTH,
        q: 'Is the Zen acknowledgement of debt enough in a dispute?',
        a: 'It provides evidence relating to the agreement and what it contains. It is not a titre exécutoire, a document that on its own allows enforcement. Going all the way still means going before a judge.',
        legal: 'To be validated by our legal counsel',
      },
    ],
  },
];
