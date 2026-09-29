import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import ArticleLayout, { Callout, Caveat } from '../components/Blog/ArticleLayout';
import Footer from '../components/Footer/Footer';
import coverUrl from '../assets/amies-canape-ordinateur.webp';
import { useLang, useLocalize, type Lang } from '../i18n';

const COPY: Record<
  Lang,
  {
    category: string;
    title: string;
    lead: string;
    coverAlt: string;
    cta: { title: string; text: string };
  }
> = {
  fr: {
    category: 'Remboursement & imprévus',
    title: 'Quand un proche ne peut plus suivre l’échéancier',
    lead: 'Un mois plus difficile que prévu, ça arrive à tout le monde. Quand un remboursement prend du retard, le silence peut aussi peser sur la relation.',
    coverAlt: 'Deux femmes rient sur un canapé, l’une avec un ordinateur portable sur les genoux',
    cta: {
      title: 'Dans TilliT, ce message sera un bouton',
      text: 'Signaler une difficulté et proposer un nouveau calendrier se fera dans l’application. Personne n’aura à trouver les mots, et le nouvel accord sera enregistré pour vous deux.',
    },
  },
  en: {
    category: 'Repayment & setbacks',
    title: 'When a friend can’t keep up with the instalments',
    lead: 'A harder month than expected happens to everyone. When a repayment runs late, the silence can weigh on the relationship too.',
    coverAlt: 'Two women laugh on a sofa, one with a laptop on her knees',
    cta: {
      title: 'In TilliT, that message will be a button',
      text: 'Flagging a problem and offering a new calendar will happen inside the app. Nobody will have to find the words, and the new agreement will be saved for you both.',
    },
  },
};

export default function ArticleImprevu() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const lang = useLang();
  const l = useLocalize();
  const t = COPY[lang];
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
              <h2>The pattern, always the same</h2>
              <p>It plays out in four steps, and it’s oddly predictable:</p>
              <ol>
                <li>
                  <span>The instalment is coming up, and they know they can’t make it.</span>
                </li>
                <li>
                  <span>They daren’t say so: they hope to sort it out before anyone notices.</span>
                </li>
                <li>
                  <span>
                    The lender notices, but holds back on asking so as not to make the other
                    uncomfortable.
                  </span>
                </li>
                <li>
                  <span>Both start avoiding the subject, then avoiding the conversation.</span>
                </li>
              </ol>
              <p>
                Nobody behaved badly at any point. That’s what makes this so good at wrecking a
                friendship: each of them thinks they’re protecting the other.
              </p>

              <h2>If you’re repaying: say&nbsp;it before the date</h2>
              <p>
                A message sent <strong>before</strong> the date lands as taking it seriously. The
                same message three weeks later lands as an excuse. That’s the only difference, and
                it changes everything.
              </p>
              <Callout label="All you have to say">
                “I can’t manage the €80 this month. I can put in €40 now and catch up over the next
                two months. Does that work for you?”
              </Callout>
              <p>
                That message works because it holds three things: a fact, a figure and a question.
                It comes with a solution attached.
              </p>
              <h3>What to steer clear of</h3>
              <ul>
                <li>
                  <span>“I’ll keep you posted” with no date. That’s what starts the endless wait.</span>
                </li>
                <li>
                  <span>A long personal explanation. What the lender mostly wants to know is when.</span>
                </li>
                <li>
                  <span>
                    Silence, hoping to catch up next month. Next month means two instalments at
                    once.
                  </span>
                </li>
              </ul>

              <h2>If you’re the lender: keep the reminder clear of blame</h2>
              <p>
                If you have to follow up, follow up on the calendar, not on the person. “Shall we
                move the March one?” is a practical question. “You said you’d pay” is a verdict.
              </p>
              <p>
                And take it that a reworked schedule beats a theoretical one nobody follows.
                Spreading €240 over six months instead of three costs you nothing. A calendar that
                fits real life can help the money come back, and it calms the conversation down.
              </p>

              <h2>Rework it, then write it down</h2>
              <p>
                One spoken agreement replaces another spoken agreement: after two adjustments,
                nobody knows what was agreed. As soon as the two of you settle on a new pace, write
                it in the same place as the first one.
              </p>
              <p>
                Three things belong in there: the new amount per instalment, the new dates, and the
                total still owed. You’re changing the dates or the pace of the repayments. The
                amount left to repay stays the same.
              </p>
              <Callout label="A real example">
                €1,200 lent, €100 a month. In June, something comes up. The new agreement: €60 a
                month from June through to April. The total stays €1,200, only the pace changes,
                and both of you have it in black and white.
              </Callout>

              <h2>If the conversation never reopens</h2>
              <p>
                Sometimes the silence settles in anyway. Then the only thing that counts is what you
                kept: the amount, the dates you agreed, the record of the payments already made.
              </p>
              <Caveat>
                <strong>On the legal side:</strong> the French rules on proving a loan between
                private individuals, and the remedies open to you, sit outside this article. See{' '}
                <Link to={l('/recours')}>what to do when a loan isn’t&nbsp;repaid</Link>. A lawyer
                stays the right person to ask.
              </Caveat>

              <h2>What to take away</h2>
              <p>
                A delay you mention gets sorted in two messages. A delay kept quiet becomes a
                subject you both skirt, then a friendship you avoid. One move separates the two:
                saying it first.
              </p>
            </>
          ) : (
            <>
              <h2>Le mécanisme, toujours le même</h2>
              <p>Il se déroule en quatre temps, et il est étonnamment prévisible&nbsp;:</p>
              <ol>
                <li>
                  <span>L’échéance approche, la personne sait qu’elle ne pourra pas.</span>
                </li>
                <li>
                  <span>Elle n’ose pas le dire&nbsp;: elle espère régler ça avant qu’on remarque.</span>
                </li>
                <li>
                  <span>
                    Le prêteur remarque, mais n’ose pas relancer pour ne pas mettre l’autre mal à l’aise.
                  </span>
                </li>
                <li>
                  <span>Les deux se mettent à éviter le sujet, puis à éviter la conversation.</span>
                </li>
              </ol>
              <p>
                À aucun moment quelqu’un ne s’est mal comporté. C’est ce qui rend cette mécanique si
                efficace pour détruire une relation&nbsp;: chacun croit protéger l’autre.
              </p>

              <h2>Côté emprunteur&nbsp;: dis-le avant l’échéance</h2>
              <p>
                Un message envoyé <strong>avant</strong> l’échéance est reçu comme du sérieux. Le même
                message envoyé trois semaines après est reçu comme une excuse. C’est la seule différence,
                et elle change tout.
              </p>
              <Callout label="Ce qu’il suffit de dire">
                «&nbsp;Ce mois-ci, je ne vais pas pouvoir mettre les 80&nbsp;€. Je peux en mettre 40
                maintenant et rattraper le reste sur les deux mois suivants. Est-ce que ça te va&nbsp;?&nbsp;»
              </Callout>
              <p>
                Ce message fonctionne parce qu’il contient trois choses&nbsp;: un constat, une proposition
                chiffrée, et une question. Il ne demande pas de l’indulgence, il propose une solution.
              </p>
              <h3>Ce qu’il vaut mieux éviter</h3>
              <ul>
                <li>
                  <span>
                    «&nbsp;Je te tiens au courant&nbsp;» sans date, c’est ce qui déclenche l’attente sans
                    fin.
                  </span>
                </li>
                <li>
                  <span>
                    Un long message d’explication personnelle&nbsp;: le prêteur veut surtout savoir quand.
                  </span>
                </li>
                <li>
                  <span>
                    Le silence en espérant se rattraper le mois suivant. Le mois suivant, c’est deux
                    échéances.
                  </span>
                </li>
              </ul>

              <h2>Côté prêteur&nbsp;: séparer la relance du reproche</h2>
              <p>
                Si tu dois relancer, relance sur le calendrier, pas sur la personne. «&nbsp;Est-ce qu’on
                décale celle de mars&nbsp;?&nbsp;» est une question opérationnelle. «&nbsp;Tu avais dit que tu
                paierais&nbsp;» est un procès.
              </p>
              <p>
                Et accepte l’idée qu’un échéancier réaménagé vaut mieux qu’un échéancier théorique que
                personne ne respecte. Étaler 240&nbsp;€ sur six mois au lieu de trois ne te fait rien
                perdre. Un calendrier plus réaliste peut aider au remboursement et apaiser la discussion.
              </p>

              <h2>Réaménager, puis l’écrire</h2>
              <p>
                Un nouvel accord oral remplace un ancien accord oral&nbsp;: au bout de deux ajustements,
                plus personne ne sait ce qui a été convenu. Dès que vous vous mettez d’accord sur un
                nouveau rythme, écris-le au même endroit que le premier.
              </p>
              <p>
                Trois choses doivent y figurer&nbsp;: le nouveau montant par échéance, les nouvelles dates,
                et le total restant dû. Vous changez les dates ou le rythme des remboursements. Le montant
                qu’il reste à rembourser reste le même.
              </p>
              <Callout label="Exemple concret">
                1&nbsp;200&nbsp;€ prêtés, 100&nbsp;€ par mois. En juin, un imprévu. Le nouvel accord&nbsp;:
                60&nbsp;€ par mois à partir de juin, jusqu’en avril. Le total reste 1&nbsp;200&nbsp;€, seul le
                rythme change, et c’est écrit noir sur blanc des deux côtés.
              </Callout>

              <h2>Si la conversation ne se rouvre plus</h2>
              <p>
                Il arrive que le silence s’installe malgré tout. Dans ce cas, la seule chose qui compte
                est ce que tu as conservé&nbsp;: le montant, les dates convenues, la trace des versements
                déjà effectués.
              </p>
              <Caveat>
                <strong>Sur le plan juridique&nbsp;:</strong> les règles françaises encadrant la preuve
                d’un prêt entre particuliers et les recours possibles sortent du cadre de cet article.
                Voir <Link to={l('/recours')}>la marche à suivre en cas de non&#8209;remboursement</Link>. Un
                professionnel du droit reste le bon interlocuteur.
              </Caveat>

              <h2>Ce qu’il faut retenir</h2>
              <p>
                Un retard annoncé se règle en deux messages. Un retard tu devient un sujet qu’on n’aborde
                plus, puis une relation qu’on évite. La différence entre les deux tient à un seul
                geste&nbsp;: le dire avant.
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
