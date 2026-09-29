import { useState, type ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import ArticleLayout, { Callout, Caveat } from '../components/Blog/ArticleLayout';
import articleStyles from '../components/Blog/Article.module.css';
import Footer from '../components/Footer/Footer';
import coverUrl from '../amies-canape-rire.webp';
import { useLang, type Lang } from '../i18n';

type Copy = {
  category: string;
  title: ReactNode;
  lead: string;
  coverAlt: string;
  cta: { title: string; text: string };
  tocLabel: string;
  toc: { id: string; label: string }[];
};

const COPY: Record<Lang, Copy> = {
  fr: {
    category: 'Prêter à un proche',
    title: (
      <>
        Prêter à un proche&nbsp;:
        <br />
        ce qu’il faut poser avant le virement
      </>
    ),
    lead: 'Le moment où l’on prête est presque toujours agréable. On aide quelqu’un qu’on aime, on ne veut pas alourdir l’instant avec des questions d’intendance. C’est précisément pour ça que rien n’est dit. Et c’est précisément là que les ennuis commencent.',
    coverAlt: 'Deux jeunes femmes rient sur un canapé, l’une enlace l’autre',
    cta: {
      title: 'TilliT posera ce cadre à ta place',
      text: 'Montant, échéances, calendrier et rappels automatiques : ce qui est convenu sera écrit une bonne fois, et visible par vous deux.',
    },
    tocLabel: 'Dans cet article',
    toc: [
      { id: 'pret-ou-cadeau', label: 'Est-ce un prêt ou un cadeau ?' },
      { id: 'montant-exact', label: 'Le montant exact, écrit quelque part' },
      { id: 'combien-de-fois', label: 'En combien de fois' },
      { id: 'les-dates', label: 'Les dates, et surtout celle de la fin' },
      { id: 'si-ca-coince', label: 'Ce qui se passe si ça coince' },
    ],
  },
  en: {
    category: 'Lending to a friend',
    title: (
      <>
        Lending to a friend:
        <br />
        what to settle before you transfer the money
      </>
    ),
    lead: 'Lending usually feels good. You’re helping someone you love, and you don’t want to weigh the moment down with admin. That’s exactly why nothing gets said. And that’s exactly where the trouble starts.',
    coverAlt: 'Two young women laugh on a sofa, one with her arm around the other',
    cta: {
      title: 'TilliT will set all that out for you',
      text: 'Amount, instalments, calendar and automatic reminders: what you agree will be written down once, and you will both see it.',
    },
    tocLabel: 'In this article',
    toc: [
      { id: 'loan-or-gift', label: 'Is this a loan or a gift?' },
      { id: 'exact-amount', label: 'The exact amount, written down' },
      { id: 'how-many-instalments', label: 'How many instalments' },
      { id: 'the-dates', label: 'The dates, and the last one above all' },
      { id: 'if-it-gets-stuck', label: 'What happens if it gets stuck' },
    ],
  },
};

export default function ArticlePreter() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const lang = useLang();
  const t = COPY[lang];
  const [toc1, toc2, toc3, toc4, toc5] = t.toc;

  const toc = (
    <nav className={articleStyles.toc} aria-labelledby="sommaire-titre">
      <p className={articleStyles.tocLabel} id="sommaire-titre">
        {t.tocLabel}
      </p>
      <ol>
        {t.toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <>
      <main>
        <ArticleLayout
          category={t.category}
          title={t.title}
          lead={t.lead}
          cover={coverUrl}
          coverAlt={t.coverAlt}
          cta={t.cta}
        >
          {lang === 'en' ? (
            <>
              <p>
                Five minutes of conversation up front save months of things left unsaid. Here are
                the five points to settle <strong>before</strong> you tap “confirm transfer”.
              </p>

              {toc}

              <h2 id={toc1.id}>1. Is this a loan or a gift?</h2>
              <p>
                It’s the most awkward question, and the most useful one. A lot of tension comes from
                two people who never had the same answer in mind: one meant to tide the other over,
                the other heard a gift with no strings.
              </p>
              <p>
                Say it out loud, even clumsily. “I’m lending it to you, pay me back when you can”
                stays vague. “I’m lending it to you, let’s agree on when” does not.
              </p>
              <Callout label="A line that works">
                “I can help you out. Shall we agree right now on how much you pay back each month?
                That way neither of us has to think about it.”
              </Callout>

              <h2 id={toc2.id}>2. The exact amount, written down</h2>
              <p>
                “Around 500” becomes “450” for one of you and “550” for the other within four
                months. Over time, the two of you can remember the same plan differently.
              </p>
              <p>
                One written message removes that risk. You write it down so that neither of you has
                to remember.
              </p>

              <h2 id={toc3.id}>3. How many instalments</h2>
              <p>
                An amount with no breakdown is an amount people put off. €600 feels heavy;
                6&nbsp;×&nbsp;€100 looks doable. Repayments that fit someone’s budget help them keep
                to what they promised.
              </p>
              <p>
                Let the person repaying suggest the pace. They know their budget better than you do,
                and a schedule they chose is a schedule they will keep to.
              </p>

              <h2 id={toc4.id}>4. The dates, and the last one above all</h2>
              <p>
                This is the point most often forgotten, and the one that matters most. A loan with
                no end date never really ends: it stays in the air between you, even once it’s
                repaid.
              </p>
              <p>
                Pick a day of the month (“the 5th”) rather than a vague window (“early in the
                month”), and write down the date of the last payment. Knowing it ends on 5&nbsp;May
                changes how the whole thing feels, on both sides.
              </p>

              <h2 id={toc5.id}>5. What happens if it gets stuck</h2>
              <p>
                Plan for the breakdown while the sun is out. One sentence does it: “If you can see
                you won’t manage the date we agreed, tell me. We’ll find a way together.”
              </p>
              <p>
                That one sentence heads off the worst run of events: someone who can’t pay, daren’t
                say so, takes longer and longer to answer, then goes quiet. Embarrassment makes the
                conversation hard, above all when you don’t yet have a solution to offer.
              </p>
              <Caveat>
                <strong>Worth repeating:</strong> only lend what you can afford not to see again. No
                agreement, however clear, guarantees repayment. It cuts down misunderstandings. It
                leaves the risk in place.
              </Caveat>

              <h2>If you take one thing away</h2>
              <p>
                When the dates stay vague, each of you can picture something different. Setting them
                together keeps the conversation open. Agree it all at the start and you spare
                yourself the talk later.
              </p>
            </>
          ) : (
            <>
              <p>
                Cinq minutes de conversation au départ évitent des mois de non-dits. Voici les cinq
                points à régler <strong>avant</strong> d’appuyer sur «&nbsp;valider le virement&nbsp;».
              </p>

              {toc}

              <h2 id={toc1.id}>1. Est-ce un prêt ou un cadeau&nbsp;?</h2>
              <p>
                C’est la question la plus inconfortable et la plus utile. Beaucoup de tensions viennent
                de deux personnes qui n’ont jamais eu la même réponse en tête&nbsp;: l’une pensait
                dépanner, l’autre pensait recevoir un coup de pouce définitif.
              </p>
              <p>
                Dites-le explicitement, même maladroitement. «&nbsp;Je te le prête, tu me le rends quand
                tu peux&nbsp;» reste ambigu. «&nbsp;Je te le prête, on se met d’accord sur quand&nbsp;» ne
                l’est pas.
              </p>
              <Callout label="Une formulation qui marche">
                «&nbsp;Je peux te dépanner. Est-ce qu’on se met d’accord tout de suite sur combien tu me
                rends chaque mois&nbsp;? Comme ça, ni toi ni moi n’y pensons.&nbsp;»
              </Callout>

              <h2 id={toc2.id}>2. Le montant exact, écrit quelque part</h2>
              <p>
                «&nbsp;Environ 500&nbsp;» devient «&nbsp;450&nbsp;» pour l’un et «&nbsp;550&nbsp;» pour l’autre en
                quatre mois. Avec le temps, vous pouvez vous souvenir différemment de ce qui était prévu.
              </p>
              <p>
                Un simple message écrit suffit à supprimer ce risque. L’écrit ne sert pas à se méfier, il
                sert à ne plus avoir à se souvenir.
              </p>

              <h2 id={toc3.id}>3. En combien de fois</h2>
              <p>
                Un montant sans découpage est un montant qu’on repousse. 600&nbsp;€ font peur&nbsp;;
                6&nbsp;×&nbsp;100&nbsp;€ ressemblent à quelque chose de faisable. Des remboursements adaptés à
                son budget aident l’emprunteur à tenir ses engagements.
              </p>
              <p>
                Laisse la personne qui rembourse proposer le rythme. Elle connaît son budget mieux que
                toi, et un échéancier qu’elle a choisi est un échéancier qu’elle tiendra.
              </p>

              <h2 id={toc4.id}>4. Les dates, et surtout celle de la fin</h2>
              <p>
                C’est le point le plus souvent oublié, et le plus important. Un prêt sans date de fin ne
                se termine jamais vraiment&nbsp;: il reste en suspens dans la relation, même une fois
                remboursé.
              </p>
              <p>
                Fixe le jour du mois («&nbsp;le 5&nbsp;») plutôt qu’une période floue («&nbsp;début de
                mois&nbsp;»), et écris la date du dernier versement. Savoir que ça s’arrête au 5 mai change
                complètement le vécu des deux côtés.
              </p>

              <h2 id={toc5.id}>5. Ce qui se passe si ça coince</h2>
              <p>
                Prévoyez la panne pendant qu’il fait beau. Une phrase suffit&nbsp;: «&nbsp;Si tu vois que tu
                ne pourras pas rembourser à la date prévue, préviens-moi. On cherchera une solution
                ensemble.&nbsp;»
              </p>
              <p>
                Cette phrase-là évite le scénario le plus destructeur&nbsp;: la personne qui ne peut pas
                payer, qui n’ose pas le dire, qui espace les réponses, puis qui disparaît. La gêne peut
                rendre la discussion difficile, surtout quand on ne sait pas encore quelle solution
                proposer.
              </p>
              <Caveat>
                <strong>Un rappel utile&nbsp;:</strong> ne prête que ce que tu peux te permettre de ne pas
                revoir. Aucun cadre, aussi clair soit-il, ne garantit un remboursement. Il réduit les
                malentendus, il ne supprime pas le risque.
              </Caveat>

              <h2>Et si tu ne devais retenir qu’une chose</h2>
              <p>
                Quand les dates restent floues, chacun peut comprendre autre chose. Les fixer ensemble
                aide à garder le dialogue ouvert. Poser le cadre au départ, c’est s’épargner d’avoir à en
                parler ensuite.
              </p>
            </>
          )}
        </ArticleLayout>
      </main>
      <Footer onOpenLegal={setLegalTab} />
      <LegalModal
        tab={legalTab}
        onClose={() => setLegalTab(null)}
        onSelectTab={setLegalTab}
      />
    </>
  );
}
