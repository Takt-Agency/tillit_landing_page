import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LegalModal, { type LegalTab } from '../components/LegalModal/LegalModal';
import ArticleLayout, { Callout, Caveat } from '../components/Blog/ArticleLayout';
import Footer from '../components/Footer/Footer';
import coverUrl from '../assets/amies-canape-ordinateur.webp';

export default function ArticleImprevu() {
  useScrollReveal();
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  return (
    <>
      <main>
        <ArticleLayout
          category="Remboursement & imprévus"
          title="Quand un proche ne peut plus suivre l’échéancier"
          lead="Un mois plus difficile que prévu, ça arrive à tout le monde. Quand un remboursement prend du retard, le silence peut aussi peser sur la relation."
          readTime="6 min de lecture"
          cover={coverUrl}
          coverAlt="Deux femmes rient sur un canapé, l’une avec un ordinateur portable sur les genoux"
          cta={{
            title: 'Dans TilliT, ce message sera un bouton',
            text: 'Signaler une difficulté et proposer un nouveau calendrier se fera dans l’application. Personne n’aura à trouver les mots, et le nouvel accord sera enregistré pour vous deux.',
          }}
        >
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
            Voir <Link to="/recours">la marche à suivre en cas de non&#8209;remboursement</Link>. Un
            professionnel du droit reste le bon interlocuteur.
          </Caveat>

          <h2>Ce qu’il faut retenir</h2>
          <p>
            Un retard annoncé se règle en deux messages. Un retard tu devient un sujet qu’on n’aborde
            plus, puis une relation qu’on évite. La différence entre les deux tient à un seul
            geste&nbsp;: le dire avant.
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
