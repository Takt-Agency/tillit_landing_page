import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import ArticleLayout, { Callout, Caveat } from '../components/Blog/ArticleLayout';
import articleStyles from '../components/Blog/Article.module.css';
import Footer from '../components/Footer/Footer';
import coverUrl from '../amies-canape-rire.webp';

const TOC = [
  { id: 'pret-ou-cadeau', label: 'Est-ce un prêt ou un cadeau ?' },
  { id: 'montant-exact', label: 'Le montant exact, écrit quelque part' },
  { id: 'combien-de-fois', label: 'En combien de fois' },
  { id: 'les-dates', label: 'Les dates, et surtout celle de la fin' },
  { id: 'si-ca-coince', label: 'Ce qui se passe si ça coince' },
];

export default function ArticlePreter() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main>
        <ArticleLayout
          category="Prêter à un proche"
          title={
            <>
              Prêter à un proche&nbsp;: ce qu’il faut poser avant le virement
            </>
          }
          lead="Le moment où l’on prête est presque toujours agréable. On aide quelqu’un qu’on aime, on ne veut pas alourdir l’instant avec des questions d’intendance. C’est précisément pour ça que rien n’est dit. Et c’est précisément là que les ennuis commencent."
          readTime="5 min de lecture"
          cover={coverUrl}
          coverAlt="Deux jeunes femmes rient sur un canapé, l’une enlace l’autre"
          cta={{
            title: 'TilliT posera ce cadre à ta place',
            text: 'Montant, échéances, calendrier et rappels automatiques : ce qui est convenu sera écrit une bonne fois, et visible par vous deux.',
          }}
        >
          <p>
            Cinq minutes de conversation au départ évitent des mois de non-dits. Voici les cinq
            points à régler <strong>avant</strong> d’appuyer sur «&nbsp;valider le virement&nbsp;».
          </p>

          <nav className={articleStyles.toc} aria-labelledby="sommaire-titre">
            <p className={articleStyles.tocLabel} id="sommaire-titre">
              Dans cet article
            </p>
            <ol>
              {TOC.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <h2 id="pret-ou-cadeau">1. Est-ce un prêt ou un cadeau&nbsp;?</h2>
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

          <h2 id="montant-exact">2. Le montant exact, écrit quelque part</h2>
          <p>
            «&nbsp;Environ 500&nbsp;» devient «&nbsp;450&nbsp;» pour l’un et «&nbsp;550&nbsp;» pour l’autre en
            quatre mois. Avec le temps, vous pouvez vous souvenir différemment de ce qui était prévu.
          </p>
          <p>
            Un simple message écrit suffit à supprimer ce risque. L’écrit ne sert pas à se méfier, il
            sert à ne plus avoir à se souvenir.
          </p>

          <h2 id="combien-de-fois">3. En combien de fois</h2>
          <p>
            Un montant sans découpage est un montant qu’on repousse. 600&nbsp;€ font peur&nbsp;;
            6&nbsp;×&nbsp;100&nbsp;€ ressemblent à quelque chose de faisable. Des remboursements adaptés à
            son budget aident l’emprunteur à tenir ses engagements.
          </p>
          <p>
            Laisse la personne qui rembourse proposer le rythme. Elle connaît son budget mieux que
            toi, et un échéancier qu’elle a choisi est un échéancier qu’elle tiendra.
          </p>

          <h2 id="les-dates">4. Les dates, et surtout celle de la fin</h2>
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

          <h2 id="si-ca-coince">5. Ce qui se passe si ça coince</h2>
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
