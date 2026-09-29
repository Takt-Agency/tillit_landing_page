/* ==========================================================================
   TilliT prototype · lot F · Versement et démarrage du prêt
   Spec : 06-versement.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot F. N'écris que dans ce fichier et dans la
   section « lot F » de css/ecrans.css.

   Routes : versement-declarer, versement-attente, versement-confirmer, recu-declarer, pret-demarre
   Chaque route montre l'étape réelle du versement pour le rôle du testeur (un prêteur
   ne voit jamais « versement-confirmer », un prêt démarré montre « Le prêt démarre »).
   Entrées pour les autres lots (params { pretId }) :
     - « Indiquer que c'est parti » : data-action="aller" data-route="versement-declarer" data-pret-id="…"
     - « Oui, j'ai reçu » / « Pas encore » : data-route="versement-confirmer"
     - « J'ai reçu l'argent » (emprunteur qui déclare le premier), en feuille du bas :
       <button data-action="versement-recu" data-pret-id="…"> (ou data-route="recu-declarer", écran plein)
   Aucune échéance ne court tant que le prêt est « valide ».
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, echapper, insecables } = textes;
  const E = window.ecrans, A = window.actions, S = window.saisies;
  const C = window.calculs;
  const MOYENS = [{ valeur: 'virement', libelle: 'Virement' }, { valeur: 'especes', libelle: 'Espèces' }];

  /* ---------- Outils communs ---------- */
  const pretDe = params => (params && params.pretId ? modele.pret(params.pretId) : null);
  const autreId = pret => modele.autre(pret);
  const prenomHtml = id => echapper(modele.prenom(id));
  const auj = () => modele.aujourdhui();
  const p = t => `<p class="versement-texte">${t}</p>`;
  const retourPret = pret => ui.bouton('Retour au prêt', { action: 'versement-voir-pret', params: { pretId: pret.id } });
  // Prêt introuvable (lien périmé, état remis à zéro) : texte hors spec, le plus court possible.
  const introuvable = () => ui.enteteRetour({}) + p("Ce prêt n'est plus disponible.");

  // « Retour au prêt », « Voir le Parcours » : le Parcours du prêt, comme les notifications du socle ({ pretId }).
  A['versement-voir-pret'] = el => routeur.aller('parcours', { pretId: el.dataset.pretId }, { racine: true });

  /* ---------- Saisies en cours (moyen, date), remises à zéro à chaque arrivée ---------- */
  const saisie = { declarer: {}, recu: {} };
  const choixDe = (quoi, id) => saisie[quoi][id] || { moyen: 'virement', date: auj() };
  const retenir = (quoi, id, champs) => { saisie[quoi][id] = Object.assign({}, choixDe(quoi, id), champs); };
  const vuPasEncore = {};   // pretId -> true : carte « D'accord. » après « Pas encore »
  let recuPretId = null;    // prêt de la feuille « J'ai reçu l'argent »
  // Date : jamais dans le futur ; un champ vidé reprend la dernière date valable.
  function majDate(quoi, id, el, type) {
    const v = /^\d{4}-\d{2}-\d{2}$/.test(el.value) ? (el.value > auj() ? auj() : el.value) : null;
    if (v) retenir(quoi, id, { date: v });
    if (type === 'change' && el.value !== choixDe(quoi, id).date) el.value = choixDe(quoi, id).date;
  }
  const champDate = (id, valeur, saisieNom) => ui.champ({ id, libelle: 'Quand', type: 'date', valeur, max: auj(), saisie: saisieNom });
  const pastillesMoyen = (valeur, action, pretId) => '<p class="champ-libelle versement-libelle">Comment</p>'
    + ui.pastilles({ options: MOYENS, valeur, action, libelle: 'Comment', params: { pretId } });

  /* ---------- versement-declarer (prêteur) ---------- */
  function htmlDeclarer(pret) {
    const id = pret.id, c = choixDe('declarer', id), autre = prenomHtml(autreId(pret));
    const ref = C.referenceVersement(pret.reference);
    return ui.enteteRetour({})
      + `<h1 class="titre">${insecables("Tu as envoyé l'argent ?")}</h1>`
      + "<p class=\"sous-titre\">Dis-nous juste quand c'est parti.</p>"
      + `<div class="versement-somme"><p class="montant-grand">${euros(pret.termes.montant)}</p><p class="versement-a">à ${autre}</p></div>`
      + p('TilliT ne détient jamais les fonds. Le virement va de ta banque à la sienne.')
      + pastillesMoyen(c.moyen, 'versement-moyen', id)
      + champDate('versement-date', c.date, 'versement-date')
      + (c.moyen === 'virement'
        ? `<div class="versement-ref"><p class="versement-ref-libelle">Référence à mettre dans le libellé du virement</p><p class="versement-ref-code">${echapper(ref)}</p>${ui.boutonCopier(ref)}</div>`
        : '')
      + ui.bouton("J'ai envoyé l'argent", { action: 'versement-envoye', params: { pretId: id } })
      + `<p class="versement-note">Le prêt ne démarrera qu'une fois que ${autre} aura confirmé avoir reçu la somme.</p>`;
  }
  A['versement-moyen'] = el => { retenir('declarer', el.dataset.pretId, { moyen: el.dataset.valeur === 'especes' ? 'especes' : 'virement' }); routeur.rafraichir(); };
  S['versement-date'] = (el, etat, params, type) => majDate('declarer', params.pretId, el, type);
  A['versement-envoye'] = el => {
    const id = el.dataset.pretId, c = choixDe('declarer', id);
    if (!declarerVersement(id, c.moyen, c.date).ok) return;
    delete saisie.declarer[id];
    routeur.aller('versement-attente', { pretId: id }, { remplacer: true });   // le prêteur reste de son côté [C-34]
  };

  /* ---------- versement-attente (prêteur) ---------- */
  function htmlAttente(pret) {
    const aId = autreId(pret), autre = prenomHtml(aId);
    return '<div class="versement-centre">' + ui.mascotte('validation')
      + `<h1 class="titre">${insecables(`C'est noté ! On attend la confirmation de ${autre}.`)}</h1></div>`
      + ui.carte(`<div class="versement-pret">${ui.avatar(aId)}<div class="versement-pret-corps"><p class="versement-pret-nom">${autre} · ${euros(pret.termes.montant)}</p>${ui.pucePret(pret)}</div></div>`)
      + p('Aucune échéance ne court avant sa réponse.')
      + retourPret(pret);
  }

  /* ---------- versement-confirmer (emprunteur) ---------- */
  function htmlConfirmer(pret) {
    const id = pret.id, aId = autreId(pret), v = pret.versement;
    if (vuPasEncore[id]) {
      return ui.carteSucces({ titre: "D'accord.", texte: "Tu pourras confirmer dès que l'argent arrive.",
        bouton: { libelle: 'Retour au prêt', action: 'versement-voir-pret', params: { pretId: id } } });
    }
    const quand = v.moyen === 'especes' ? `Espèces, le ${date(v.date)}` : `Virement du ${date(v.date)}`;
    return ui.enteteRetour({})
      + '<div class="versement-centre">' + ui.avatar(aId, { taille: 'l' })
      + `<h1 class="titre">${prenomHtml(aId)} a envoyé ${euros(pret.termes.montant)}</h1>`
      + `<p class="versement-sous">${quand}</p>`
      + (v.moyen === 'virement' ? `<p class="versement-sous">${insecables(`Référence : ${echapper(C.referenceVersement(pret.reference))}`)}</p>` : '')
      + '</div>'
      + `<h2 class="versement-question">${insecables("Tu as bien reçu l'argent ?")}</h2>`
      + p("Le calendrier et les rappels ne démarrent qu'après ta confirmation.")
      + '<div class="pile-reponses">' + ui.bouton("Oui, j'ai reçu", { action: 'versement-oui', params: { pretId: id } })
      + ui.bouton('Pas encore', { action: 'versement-pas-encore', variante: 'secondaire', params: { pretId: id } }) + '</div>'
      + ui.bulle("Tant que tu n'as pas confirmé, le prêt reste en attente. Aucune échéance ne court.", { pose: 'attentive' });
  }
  A['versement-oui'] = el => { if (confirmerVersement(el.dataset.pretId).ok) routeur.aller('pret-demarre', { pretId: el.dataset.pretId }, { racine: true }); };
  // « Pas encore » : le statut ne change pas [D-22] ; le routeur re-rend la carte « D'accord. ».
  A['versement-pas-encore'] = el => { if (pasEncoreVersement(el.dataset.pretId).ok) vuPasEncore[el.dataset.pretId] = true; };

  /* ---------- recu-declarer (emprunteur qui déclare le premier) : feuille ou écran plein ---------- */
  const titreRecu = pret => insecables(`Tu as reçu ${euros(pret.termes.montant)} de ${modele.prenom(autreId(pret))} ?`);   // texte brut
  function htmlRecu(pret, enFeuille) {
    const id = pret.id, c = choixDe('recu', id);
    return (enFeuille ? '' : ui.enteteRetour({}) + `<h1 class="titre">${echapper(titreRecu(pret))}</h1>`)
      + ui.lignesRecap([['Montant', euros(pret.termes.montant)]])
      + pastillesMoyen(c.moyen, 'versement-recu-moyen', id)
      + champDate('versement-recu-date', c.date, 'versement-recu-date')
      + ui.bouton("Oui, j'ai reçu", { action: 'versement-recu-oui', params: { pretId: id } });
  }
  const recuPossible = pret => modele.role(pret) === 'emprunteur' && pret.statut === 'valide' && !pret.versement;
  A['versement-recu'] = el => {
    const pret = modele.pret(el.dataset.pretId);
    if (!pret) return;
    if (!recuPossible(pret)) { routeur.aller('recu-declarer', { pretId: pret.id }); return; }   // l'écran montre l'étape réelle
    recuPretId = pret.id;
    delete saisie.recu[pret.id];
    ui.feuille.ouvrir(htmlRecu(pret, true), { titre: titreRecu(pret) });
  };
  A['versement-recu-moyen'] = el => {
    const id = el.dataset.pretId, pret = modele.pret(id);
    if (!pret) return;
    retenir('recu', id, { moyen: el.dataset.valeur === 'especes' ? 'especes' : 'virement' });
    if (!ui.feuille.ouverte()) { routeur.rafraichir(); return; }
    ui.feuille.maj(htmlRecu(pret, true));
    const b = document.querySelector(`#feuille-corps [data-action="versement-recu-moyen"][data-valeur="${choixDe('recu', id).moyen}"]`);
    if (b) b.focus();
  };
  S['versement-recu-date'] = (el, etat, params, type) => { if (recuPretId) majDate('recu', recuPretId, el, type); };
  A['versement-recu-oui'] = el => {
    const id = el.dataset.pretId, pret = modele.pret(id), c = choixDe('recu', id);
    if (!pret) return;
    // Le prêteur a pu déclarer l'envoi entre-temps : « Oui, j'ai reçu » vaut alors confirmation.
    const r = pret.versement && !pret.versement.confirmePar ? confirmerVersement(id) : declarerRecuEmprunteur(id, c.moyen, c.date);
    if (!r.ok) { if (ui.feuille.ouverte()) ui.feuille.fermer(); return; }
    delete saisie.recu[id];
    routeur.aller('pret-demarre', { pretId: id }, { racine: true });
  };

  /* ---------- pret-demarre ---------- */
  function htmlDemarre(pret) {
    const aId = autreId(pret), autre = prenomHtml(aId), v = pret.versement || {};
    const ech = modele.echeances(pret);
    const texte = modele.role(pret) === 'preteur'
      ? (v.declarePar === pret.emprunteurId ? `${autre} a déclaré avoir reçu l'argent.` : `${autre} a confirmé la réception.`)
      : `Merci d'avoir confirmé. Ton premier remboursement est prévu le ${date(ech[0].date)}.`;
    return '<div class="versement-centre">'
      + `<div class="versement-pastille anim-pop">${ui.icone('coche', { taille: 34 })}</div>`
      + ui.mascotte('soulagee') + ui.puce('Prêt en cours', 'actif')
      + '<h1 class="titre">Le prêt démarre</h1>' + p(texte) + '</div>'
      + `<ol class="versement-calendrier" aria-label="Calendrier">${ech.map(e => `<li>${date(e.date)} · ${euros(e.montant)}</li>`).join('')}</ol>`
      + ui.bouton('Voir le Parcours', { action: 'versement-voir-pret', params: { pretId: pret.id } });
  }

  /* ---------- Routes : l'étape réelle du versement, selon le statut et le rôle ---------- */
  function vueVersement(pret) {
    const v = pret.versement;
    if (pret.statut === 'en_cours') return htmlDemarre(pret);
    if (pret.statut === 'valide') {
      if (modele.role(pret) === 'preteur') return v ? htmlAttente(pret) : htmlDeclarer(pret);
      return v ? htmlConfirmer(pret) : htmlRecu(pret, false);
    }
    return ui.enteteRetour({}) + `<div class="versement-etat">${ui.pucePret(pret)}</div>` + retourPret(pret);
  }
  const routeVersement = {
    rendu: (etat, params) => { const pret = pretDe(params); return pret ? vueVersement(pret) : introuvable(); },
    // Chaque arrivée repart des valeurs par défaut (Virement, date du jour, question « Tu as bien reçu l'argent ? »).
    arrivee: params => {
      const id = params.pretId;
      recuPretId = id || null;
      const avait = (id in saisie.declarer) || (id in saisie.recu) || (id in vuPasEncore);
      delete saisie.declarer[id]; delete saisie.recu[id]; delete vuPasEncore[id];
      if (avait) routeur.rafraichir();
    }
  };
  for (const r of ['versement-declarer', 'versement-attente', 'versement-confirmer', 'recu-declarer', 'pret-demarre']) E[r] = routeVersement;
})();
