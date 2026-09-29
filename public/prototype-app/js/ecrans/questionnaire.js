/* ==========================================================================
   TilliT prototype · lot K · Questionnaire
   Spec : 11-simulation-et-test.md §4. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot K. N'écris que dans ce fichier et dans la
   section « lot K » de css/ecrans.css.

   Routes :
   - questionnaire-proposition (params { pretId }) : lot J, au premier « Terminer » après un « Prêt remboursé ! »,
     quand modele.lire().questionnaire.propose est faux. « Plus tard » revient à l'écran d'avant (le Parcours, empilé par le lot J).
   - questionnaire : Profil > « Donner mon avis » (lot I), ou « Répondre ».
   - questionnaire-merci : confirmation après un envoi réussi.
   Envoi : envoyerQuestionnaire(reponses) du socle (formulaire Netlify « avis-prototype » de index.html).
   En local, il échoue volontairement : jamais de faux succès.
   Mention complète sur les données (RGPD) : à compléter avant la mise en ligne (spec 91).
   ========================================================================== */
(function () {
  'use strict';
  const { echapper, insecables } = textes;

  const QUESTIONS = [
    { id: 'q1', texte: 'En une phrase, à quoi sert TilliT selon toi ?' },
    { id: 'q2', texte: "Qu'est-ce qui t'a semblé le plus clair ?" },
    { id: 'q3', texte: 'À quel moment as-tu hésité ou été perdu ?' },
    { id: 'q4', texte: 'Au prochain prêt entre proches, tu proposerais TilliT ?', choix: ['Oui', 'Peut-être', 'Non'] },
    { id: 'q5', texte: "Qu'est-ce qui te ferait choisir Zen plutôt que Note ?" }
  ];
  const ENVOYER = 'Envoyer mes réponses', ENVOI = 'Envoi en cours…';
  const ECHEC = "Tes réponses n'ont pas pu partir. Tu peux réessayer.";
  let envoiEnCours = false, echec = false;

  /* ---------- questionnaire-proposition ---------- */
  ecrans['questionnaire-proposition'] = {
    rendu: () => `<div class="questionnaire-proposition">`
      + ui.mascotte('merci', { taille: 'moyenne' })
      + `<h1 class="titre">${insecables("Merci d'avoir testé TilliT !")}</h1>`
      + `<p>${insecables("Tu as vécu un prêt jusqu'au bout. Tu nous dis ce que tu en as pensé ? Cinq questions, sans ton nom ni tes coordonnées.")}</p>`
      + `<div class="pile-reponses">`
      + ui.bouton('Répondre', { action: 'questionnaire-repondre' })
      + ui.bouton('Plus tard', { action: 'retour', variante: 'secondaire' })
      + `</div>`
      + `<p class="texte-mute">${insecables("Tu peux aussi continuer : crée un autre prêt, dans l'autre rôle si tu veux. Pour tout recommencer : Profil, puis « Se déconnecter ».")}</p>`
      + `</div>`,
    // Vue une fois : elle n'est plus proposée ensuite (hors du rendu, qui ne modifie jamais l'état).
    arrivee: () => { if (!modele.lire().questionnaire.propose) marquerQuestionnairePropose(); }
  };
  actions['questionnaire-repondre'] = () => routeur.aller('questionnaire');

  /* ---------- questionnaire ---------- */
  const champ = q => (q.choix
    ? `<div class="questionnaire-choix" role="radiogroup" aria-labelledby="questionnaire-${q.id}-titre"><p class="champ-libelle" id="questionnaire-${q.id}-titre">${echapper(insecables(q.texte))}</p><div class="questionnaire-options">`
      + q.choix.map((c, i) => `<input type="radio" class="questionnaire-radio" id="questionnaire-${q.id}-${i}" name="questionnaire-${q.id}" value="${echapper(c)}">`
        + `<label class="questionnaire-option" for="questionnaire-${q.id}-${i}">${echapper(c)}</label>`).join('')
      + `</div></div>`
    : ui.zoneTexte({ id: `questionnaire-${q.id}`, libelle: insecables(q.texte), lignes: 3 }));
  const htmlEchec = () => (echec ? `<p class="questionnaire-erreur">${echapper(ECHEC)}</p>` : '');

  ecrans.questionnaire = {
    rendu: () => ui.enteteRetour({ titre: '' })
      + `<div class="questionnaire">`
      + `<h1 class="titre">Donner mon avis</h1>`
      + `<p class="questionnaire-mention">Tes réponses sont enregistrées sans ton nom ni tes coordonnées.</p>`
      + `<p class="texte-mute">N'écris ni nom ni coordonnées dans tes réponses.</p>`
      + `<ol class="questionnaire-questions">${QUESTIONS.map(q => `<li>${champ(q)}</li>`).join('')}</ol>`
      + `<div id="questionnaire-retour" role="alert">${htmlEchec()}</div>`
      + ui.bouton(envoiEnCours ? ENVOI : ENVOYER, { action: 'questionnaire-envoyer', id: 'questionnaire-envoyer' })
      + `</div>`,
    arrivee: () => { echec = false; ui.majZone('questionnaire-retour', ''); }
  };

  // Pendant l'envoi, le bouton reste focalisable (aria-disabled, que le routeur respecte) et dit ce qui se passe.
  function majBouton() {
    const b = document.getElementById('questionnaire-envoyer');
    if (!b) return;
    b.setAttribute('aria-disabled', String(envoiEnCours));
    b.classList.toggle('questionnaire-envoi', envoiEnCours);
    b.querySelector('span').textContent = envoiEnCours ? ENVOI : ENVOYER;
  }
  actions['questionnaire-envoyer'] = async () => {
    if (envoiEnCours) return;
    const texte = id => ((document.getElementById(`questionnaire-${id}`) || {}).value || '').trim();
    const q4 = document.querySelector('input[name="questionnaire-q4"]:checked');
    const reponses = { q1: texte('q1'), q2: texte('q2'), q3: texte('q3'), q4: q4 ? q4.value : '', q5: texte('q5') };
    envoiEnCours = true; echec = false;
    majBouton(); ui.majZone('questionnaire-retour', '');
    let r;
    try { r = await envoyerQuestionnaire(reponses); } catch (err) { r = { ok: false }; }
    envoiEnCours = false;
    if (r && r.ok) { routeur.aller('questionnaire-merci', {}, { remplacer: true }); return; }
    echec = true;
    majBouton(); ui.majZone('questionnaire-retour', htmlEchec());
  };

  /* ---------- questionnaire-merci ---------- */
  ecrans['questionnaire-merci'] = () => ui.carteSucces({
    titre: insecables('Merci pour tes réponses !'),
    bouton: { libelle: "Revenir à l'accueil", action: 'onglet', params: { route: 'accueil' } }
  });
})();
