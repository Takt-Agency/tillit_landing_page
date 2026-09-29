/* ==========================================================================
   TilliT prototype · lot J · Fin du prêt : remboursé, clôturé ou annulé
   Spec : 10-fin-du-pret.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot J. N'écris que dans ce fichier et dans la
   section « lot J » de css/ecrans.css.

   Routes (params { pretId }) : fin-pret, dire-merci, petit-geste, annuler, cloturer
   API utile : direMerci, declarerPetitGeste, annuler, cloturer(pretId, avecCadeau), modele.reste, modele.rembourse
   Décision 2 : « Faire cadeau du reste » = cloturer(id, true) ; « Clôturer sans cadeau » = cloturer(id, false) (le reste reste dû entre vous, hors de TilliT).
   Chaque écran lit l'état : une fois l'action faite, il se rend à nouveau (remplacer) et montre sa carte de succès.
   ========================================================================== */
(function () {
  'use strict';
  const { euros, echapper, insecables, versCentimes } = textes;
  const E = window.ecrans, A = window.actions, S = window.saisies;
  const t = s => echapper(insecables(s));
  const prenomAutre = p => modele.prenom(modele.autre(p));
  const versPret = pretId => routeur.aller('parcours', { pretId }, { racine: true });
  const boutonRetourPret = pretId => ({ libelle: 'Retour au prêt', action: 'fin-retour-pret', params: { pretId } });
  A['fin-retour-pret'] = el => versPret(el.dataset.pretId);
  // Écran ouvert hors de son cas (prêt introuvable, statut qui a changé) : la puce du prêt et le retour.
  const horsCas = p => ui.enteteRetour({}) + (p ? `<p class="fin-hors-cas">${ui.pucePret(p)}</p>`
    + '<div class="pile-reponses">' + ui.bouton('Retour au prêt', { action: 'fin-retour-pret', params: { pretId: p.id }, variante: 'secondaire' }) + '</div>' : '');

  /* ---------- fin-pret [G-30, C-54, C-55, S-06, A-32] ---------- */
  // La plus grande célébration du prêt. Aucun point, score ni phrase sur la relation.
  E['fin-pret'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p || p.statut !== 'rembourse' || !modele.role(p)) return horsCas(p);
    const preteur = modele.role(p) === 'preteur', autre = prenomAutre(p), montant = euros(p.termes.montant);
    const texte = preteur ? `${autre} t'a remboursé les ${montant}. Le prêt est marqué comme remboursé pour vous deux.`
                          : `${montant} remboursés à ${autre}. Le prêt est marqué comme remboursé pour vous deux.`;
    const chiffre = (libelle, valeur) => `<div><dt>${t(libelle)}</dt><dd>${t(valeur)}</dd></div>`;
    return '<section class="fin-plein" aria-labelledby="fin-titre">'
      + ui.mascotte('coup-de-coeur', { taille: 'grande', anim: 'bob' })
      + `<h1 class="fin-titre anim-pop" id="fin-titre">${t('Prêt remboursé !')}</h1>`
      + `<p class="fin-texte">${t(texte)}</p>`
      + '<div class="fin-chiffres"><dl class="fin-chiffres-liste">'
      + chiffre('Prêtés', montant) + chiffre('Rendus', euros(modele.rembourse(p))) + chiffre('Intérêts', '0 %') + '</dl>'
      + '<div class="fin-barre" aria-hidden="true"><span class="anim-grow"></span></div></div>'
      + `<p class="fin-carnet">${t("Ton Carnet de prêt vient d'être mis à jour.")}</p>`
      // « Prêt parfait » : visible par le testeur seul (cet écran est le sien).
      + (p.gamification.pretParfait ? '<p class="fin-parfait"><span class="fin-parfait-puce">Prêt parfait</span></p>' : '')
      + '<div class="fin-boutons">'
      + (preteur ? '' : ui.bouton(`Dire merci à ${autre}`, { action: 'aller', variante: 'blanc', params: { route: 'dire-merci', pretId: p.id } })
          + ui.bouton('Offrir un petit geste', { action: 'aller', variante: 'secondaire', params: { route: 'petit-geste', pretId: p.id } }))
      + ui.bouton('Voir le récapitulatif', { action: 'aller', variante: 'discret', classe: 'btn--centre', params: { route: 'historique', pretId: p.id } })
      + ui.bouton('Terminer', { action: 'fin-terminer', variante: preteur ? 'blanc' : 'discret', classe: preteur ? '' : 'btn--centre', params: { pretId: p.id } })
      + '</div></section>';
  };
  // « Terminer » : Parcours du prêt terminé. Au tout premier « Prêt remboursé ! », la proposition du questionnaire
  // (lot K) passe d'abord ; « Plus tard » y revient au Parcours par la pile.
  // Le drapeau questionnaire.propose est posé par le lot K (marquerQuestionnairePropose).
  A['fin-terminer'] = el => {
    const pretId = el.dataset.pretId;
    versPret(pretId);
    if (!modele.lire().questionnaire.propose) routeur.aller('questionnaire-proposition', { pretId });
  };

  /* ---------- dire-merci [A-33, D-39] ---------- */
  E['dire-merci'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (p && params.envoye) {
      return ui.enteteRetour({ type: 'croix', action: 'fin-retour-pret', params: { pretId: p.id } })
        + ui.carteSucces({ titre: 'Ton merci est envoyé.', bouton: boutonRetourPret(p.id) });
    }
    if (!p || p.statut !== 'rembourse' || modele.role(p) !== 'emprunteur') return horsCas(p);
    const autre = prenomAutre(p);
    return ui.enteteRetour({})
      + `<h1 class="titre">${t(`Dire merci à ${autre}`)}</h1>`
      + ui.zoneTexte({ id: 'fin-merci-texte', libelle: 'Ton message', valeur: `Merci ${autre}, pour ton aide.`, saisie: 'fin-merci', lignes: 3 })
      + '<div class="fin-actions">'
      + ui.bouton('Envoyer', { action: 'fin-merci-envoyer', id: 'fin-merci-envoyer', params: { pretId: p.id } })
      + ui.bouton('Offrir un petit geste', { action: 'aller', variante: 'discret', classe: 'btn--centre', params: { route: 'petit-geste', pretId: p.id } })
      + '</div>';
  };
  // Message vide : « Envoyer » s'éteint (direMerci refuse un message vide).
  S['fin-merci'] = el => { const b = document.getElementById('fin-merci-envoyer'); if (b) b.disabled = !el.value.trim(); };
  A['fin-merci-envoyer'] = el => {
    const champ = document.getElementById('fin-merci-texte');
    const r = direMerci(el.dataset.pretId, champ ? champ.value : '');
    if (r.ok) routeur.aller('dire-merci', { pretId: el.dataset.pretId, envoye: '1' }, { remplacer: true });
  };

  /* ---------- petit-geste [D-64, A-33, A-45] ---------- */
  // ALERTE JURIDIQUE [A-45] : à faire valider par César (avocat) avant toute sortie de l'application.
  // Montant vide, sans montant ni pourcentage suggéré, sans valeur simulée. Jamais avant la fin du prêt.
  const geste = {};   // saisie en cours, par prêt : { montant (centimes | null), moyen }
  const gesteDe = pretId => geste[pretId] || (geste[pretId] = { montant: null, moyen: 'virement' });
  const montantValide = c => c != null && c > 0 && c <= calculs.BORNES.montantMax;
  E['petit-geste'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (p && p.fin.petitGeste) {
      return ui.enteteRetour({ type: 'croix', action: 'fin-retour-pret', params: { pretId: p.id } })
        + ui.carteSucces({ titre: insecables("C'est noté. Merci pour ce geste !"), bouton: boutonRetourPret(p.id) });
    }
    if (!p || p.statut !== 'rembourse' || modele.role(p) !== 'emprunteur') return horsCas(p);
    const autre = prenomAutre(p), g = gesteDe(p.id);
    return ui.enteteRetour({})
      + '<h1 class="titre">Offrir un petit geste</h1>'
      + `<p class="sous-titre">${t(`Si tu veux remercier ${autre} autrement, tu peux lui offrir un petit geste. C'est toi qui choisis, et ça reste entre vous.`)}</p>`
      + `<p class="fin-phrase">${t(`L'argent va directement de toi à ${autre}. TilliT ne le détient jamais.`)}</p>`
      + ui.champ({ id: 'fin-geste-montant', libelle: 'Montant', inputmode: 'decimal', suffixe: '€', saisie: 'fin-geste-montant', maxlength: 9 })
      + '<div id="fin-geste-erreur" aria-live="polite"></div>'
      + '<p class="champ-libelle" id="fin-geste-comment">Comment</p>'
      + ui.pastilles({ options: [{ valeur: 'virement', libelle: 'Virement' }, { valeur: 'especes', libelle: 'Espèces' }], valeur: g.moyen,
                       action: 'fin-geste-moyen', libelle: 'Comment', params: { pretId: p.id } })
      + '<div class="fin-actions">'
      + ui.bouton("J'ai offert mon petit geste", { action: 'fin-geste-offrir', id: 'fin-geste-offrir', params: { pretId: p.id }, desactive: !montantValide(g.montant) })
      + ui.bouton('Plus tard', { action: 'retour', variante: 'discret', classe: 'btn--centre' })
      + '</div>';
  };
  S['fin-geste-montant'] = (el, etat, params) => {
    const c = el.value.trim() ? versCentimes(el.value) : null;
    gesteDe(params.pretId).montant = c;
    const b = document.getElementById('fin-geste-offrir');
    if (b) b.disabled = !montantValide(c);
    // Seule borne dite : celle que l'action du socle applique (5 000 € au plus).
    ui.majZone('fin-geste-erreur', c != null && c > calculs.BORNES.montantMax
      ? `<p class="champ-erreur">${t(`Un petit geste va jusqu'à ${euros(calculs.BORNES.montantMax)}.`)}</p>` : '');
  };
  A['fin-geste-moyen'] = (el, etat, params) => { gesteDe(params.pretId).moyen = el.dataset.valeur; routeur.rafraichir(); };
  A['fin-geste-offrir'] = (el, etat, params) => {
    const g = gesteDe(params.pretId);
    if (!montantValide(g.montant)) return;
    const r = declarerPetitGeste(params.pretId, g.montant, g.moyen);
    if (r.ok) { delete geste[params.pretId]; routeur.aller('petit-geste', { pretId: params.pretId }, { remplacer: true }); }
  };

  /* ---------- annuler [A-47, D-36, décision de Yohann sur Q3] ---------- */
  const annulable = p => ['attente_paiement_zen', 'signatures', 'valide'].includes(p.statut)
    && !(p.versement && p.versement.confirmePar) && !!modele.role(p);
  function texteCas(p, autre) {
    if (!p.zen) return "Aucun paiement n'est concerné.";
    const prix = euros(p.zen.prix);
    if (!p.zen.paye) return "Zen n'a pas été payé : aucun paiement n'est concerné.";
    if (p.zen.signatures[p.preteurId] && p.zen.signatures[p.emprunteurId]) {
      return `Zen a été payé (${prix}) et la reconnaissance de dette est signée par vous deux. Si tu annules, ce paiement n'est ni remboursé ni gardé en crédit.`;
    }
    return p.zen.payeurId === 'moi'
      ? `Tu as payé Zen (${prix}). La reconnaissance de dette n'est pas signée par vous deux : ces ${prix} restent en crédit pour ton prochain prêt Zen.`
      : `${autre} a payé Zen (${prix}). La reconnaissance de dette n'est pas signée par vous deux : ces ${prix} restent en crédit pour ${autre}.`;
  }
  E.annuler = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return horsCas(null);
    const autre = prenomAutre(p);
    if (p.statut === 'annule') {
      const parMoi = p.annulation && p.annulation.parId === 'moi';
      const credit = p.annulation && p.annulation.creditZen && p.zen && p.zen.payeurId === 'moi';
      return ui.carteSucces({ titre: 'Prêt annulé.', texte: parMoi ? `On a prévenu ${autre}.` : '',
        contenu: credit ? `<p class="succes-texte">${t(`Ton crédit Zen : ${euros(etat.moi.creditZen)}.`)}</p>` : '',
        bouton: { libelle: "Retour à l'accueil", action: 'onglet', params: { route: 'accueil' } } });
    }
    if (p.statut === 'en_cours') {
      return ui.enteteRetour({}) + `<p class="sous-titre fin-hors-cas">${t('Un prêt en cours ne s\'annule pas.')}</p>`
        + '<div class="pile-reponses">' + ui.bouton('Retour au prêt', { action: 'fin-retour-pret', params: { pretId: p.id }, variante: 'secondaire' }) + '</div>';
    }
    if (!annulable(p)) return horsCas(p);
    const versementDeclare = p.versement && p.versement.declarePar && !p.versement.confirmePar;
    const preteur = modele.role(p) === 'preteur';
    return ui.enteteRetour({})
      + `<h1 class="titre">${t('Annuler le prêt ?')}</h1>`
      + `<p class="sous-titre">${t('Le prêt s\'arrête pour vous deux. Aucune échéance ne démarrera.')}</p>`
      + `<p class="fin-phrase">${t(texteCas(p, autre))}</p>`
      + (versementDeclare ? `<p class="fin-phrase">${t(preteur
        ? "Tu as indiqué avoir envoyé l'argent. S'il est parti, voyez ensemble comment il te revient : TilliT ne détient jamais les fonds."
        : `${autre} a indiqué t'avoir envoyé l'argent. S'il est arrivé, voyez ensemble comment il lui revient : TilliT ne détient jamais les fonds.`)}</p>` : '')
      + '<div class="pile-reponses">'
      + ui.bouton('Garder le prêt', { action: 'retour' })
      + ui.bouton('Annuler le prêt', { action: 'fin-annuler-oui', variante: 'attention', classe: 'btn--centre', params: { pretId: p.id } })
      + '</div>';
  };
  A['fin-annuler-oui'] = el => {
    const r = annuler(el.dataset.pretId);
    if (r.ok) routeur.aller('annuler', { pretId: el.dataset.pretId }, { remplacer: true });
  };

  /* ---------- cloturer (prêteur, prêt en cours) [D-28, décisions du coordinateur 2, 14 et 15] ---------- */
  E.cloturer = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return horsCas(null);
    const autre = prenomAutre(p);
    if (p.statut === 'cloture') {
      // Sans cadeau, aucune notification ne part (décision 2) : on ne dit pas « On a prévenu ».
      return ui.carteSucces({ titre: 'Prêt clôturé.', texte: p.fin.cadeauReste != null ? `On a prévenu ${autre}.` : '', bouton: boutonRetourPret(p.id) });
    }
    if (p.statut !== 'en_cours' || modele.role(p) !== 'preteur') return horsCas(p);
    return ui.enteteRetour({})
      + '<h1 class="titre">Clôturer le prêt</h1>'
      + `<p class="sous-titre">${t(`Un prêt en cours ne s'annule pas. Tu peux le clôturer et faire cadeau du reste à ${autre}.`)}</p>`
      + ui.carte(ui.lignesRecap([['Déjà remboursé', euros(modele.rembourse(p))], ['Reste', euros(modele.reste(p)), { forte: true }]]))
      + '<div class="pile-reponses">'
      + ui.bouton('Faire cadeau du reste et clôturer', { action: 'fin-cadeau', params: { pretId: p.id } })
      + ui.bouton('Clôturer sans cadeau', { action: 'fin-sans-cadeau', variante: 'discret', classe: 'btn--centre', params: { pretId: p.id } })
      + '</div>';
  };
  function feuilleCloture(pretId, avecCadeau) {
    const p = modele.pret(pretId);
    if (!p || p.statut !== 'en_cours') return;
    const autre = prenomAutre(p), reste = euros(modele.reste(p));
    // Clôture sans cadeau : textes de ce lot (la spec 10 ne la prévoyait pas ; décision 2 du coordinateur).
    ui.feuille.ouvrir((avecCadeau
      ? `<p>${t('Le prêt sera clôturé pour vous deux. Ce choix est définitif.')}</p>`
      : `<p>${t(`Le prêt sera clôturé pour vous deux. Les ${reste} restants se règlent entre vous, hors de TilliT. Ce choix est définitif.`)}</p>`)
      + '<div class="pile-reponses">'
      + ui.bouton(avecCadeau ? 'Faire cadeau et clôturer' : 'Clôturer sans cadeau', { action: 'fin-cloturer-oui', params: { pretId, cadeau: avecCadeau ? 'oui' : 'non' } })
      + ui.bouton('Revenir', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>',
      { titre: insecables(avecCadeau ? `Tu fais cadeau de ${reste} à ${autre} ?` : 'Clôturer sans cadeau ?') });
  }
  A['fin-cadeau'] = el => feuilleCloture(el.dataset.pretId, true);
  A['fin-sans-cadeau'] = el => feuilleCloture(el.dataset.pretId, false);
  A['fin-cloturer-oui'] = el => {
    const r = cloturer(el.dataset.pretId, el.dataset.cadeau === 'oui');
    if (r.ok) routeur.aller('cloturer', { pretId: el.dataset.pretId }, { remplacer: true });
  };
})();
