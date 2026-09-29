/* ==========================================================================
   TilliT prototype · lot E · TilliT Zen
   Spec : 05-zen.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot E. N'écris que dans ce fichier et dans la
   section « lot E » de css/ecrans.css.

   Routes : zen-decouvrir, zen-payer, zen-document, zen-signer-choix,
            simulation-goodflag, zen-signatures, zen-signe, document-apercu, passage-zen
   Entrées pour les autres lots (params { pretId }) :
     - « Payer Zen » en feuille du bas : <button data-action="zen-payer" data-pret-id="…">
       (la route « zen-payer » existe aussi, en écran plein, pour un appel par « aller »)
     - « Signer » : data-action="aller" data-route="zen-document" data-pret-id="…"
     - Reconnaissance de dette signée : data-route="document-apercu"
     - « Passer le prêt en Zen » (menu « ⋯ ») : data-route="passage-zen"
   L'écran « annuler » (fichier 10) appartient au lot J.
   La mention « Modèle de document pour le test, à faire valider par notre conseil. » se garde mot pour mot.
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, dateLongue, echapper, selonRole, insecables } = textes;
  const E = window.ecrans, A = window.actions, S = window.saisies;
  const C = window.calculs;
  const FC = C.BORNES.supplementFC;

  /* ---------- Outils communs ---------- */
  const pretDe = params => (params && params.pretId ? modele.pret(params.pretId) : null);
  const autreId = pret => modele.autre(pret);
  const prenomBrut = id => modele.prenom(id);                 // pour ui.* (qui échappe)
  const prenomHtml = id => echapper(modele.prenom(id));       // pour du HTML écrit ici
  const deuxSignatures = pret => !!(pret.zen && pret.zen.signatures[pret.preteurId] && pret.zen.signatures[pret.emprunteurId]);
  const derniereSignature = pret => [pret.zen.signatures[pret.preteurId], pret.zen.signatures[pret.emprunteurId]].filter(Boolean).sort().pop() || null;
  // Date du document : celle de la seconde signature une fois signé, sinon la date simulée du jour.
  const dateDocument = pret => (deuxSignatures(pret) ? derniereSignature(pret) : modele.aujourdhui());
  const p = t => `<p class="zen-texte">${t}</p>`;
  const voirPret = (pret, variante = 'principal') => ui.bouton('Voir le prêt', { action: 'zen-voir-pret', variante, params: { pretId: pret.id }, classe: variante === 'discret' ? 'btn--centre' : '' });
  const retourPret = pret => ui.bouton('Retour au prêt', { action: 'zen-voir-pret', params: { pretId: pret.id } });
  // Prêt introuvable (lien périmé, état remis à zéro) : texte hors spec, le plus court possible.
  const introuvable = () => ui.enteteRetour({}) + p("Ce prêt n'est plus disponible.");

  // « Retour au prêt », « Voir le prêt » : le Parcours du prêt, comme les notifications du socle ({ pretId }).
  A['zen-voir-pret'] = el => routeur.aller('parcours', { pretId: el.dataset.pretId }, { racine: true });

  // Paiement et signature proposés seulement sur un prêt vivant (le socle refuse aussi de signer un prêt annulé).
  const zenActif = pret => ['attente_paiement_zen', 'signatures', 'valide', 'en_cours'].includes(pret.statut);

  // Étape Zen du moment (textes de la carte d'action, fichier 07), pour un écran ouvert hors de son étape.
  function etapeZen(pret) {
    const z = pret.zen, autre = prenomHtml(autreId(pret));
    if (!zenActif(pret)) return `<div class="zen-etape">${ui.pucePret(pret)}</div>` + voirPret(pret);   // annulé, refusé…
    if (!z.paye) {
      return z.payeurId === 'moi'
        ? p(insecables(`Il reste à payer Zen : ${euros(z.prix)}.`)) + ui.bouton('Payer Zen', { action: 'zen-payer', params: { pretId: pret.id } })
        : p(`En attente du paiement de Zen par ${autre}.`) + voirPret(pret);
    }
    if (!z.signatures.moi) return p('La reconnaissance de dette est prête.') + ui.bouton('Signer', { action: 'aller', params: { route: 'zen-document', pretId: pret.id } });
    if (!deuxSignatures(pret)) return p(`Signature de ${autre} attendue.`) + voirPret(pret);
    return p('Signé par vous deux') + voirPret(pret);
  }

  /* ---------- Document : reconnaissance de dette (zen-document, document-apercu) ---------- */
  // Rempli avec les données du prêt, jamais en dur. niveau : balise du titre du document.
  function htmlDocument(pret, niveau = 'h2') {
    const nomE = echapper(modele.nomComplet(pret.emprunteurId));
    const nomP = echapper(modele.nomComplet(pret.preteurId));
    const montant = pret.termes.montant;
    const src = pret.echeances && pret.echeances.length ? pret.echeances : C.echeancier(pret.termes).echeances;
    const ech = [...src].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.numero - b.numero));
    const n = ech.length, prem = ech[0], der = ech[n - 1], m = prem.montant;
    const jour = Number(prem.date.slice(8, 10));
    const signe = id => (pret.zen && pret.zen.signatures[id] ? `Signé le ${dateLongue(pret.zen.signatures[id])}` : 'En attente de signature');
    const signataire = (role, id, nom) => `<div class="zen-doc-signataire"><p class="zen-doc-role">${role}</p><p class="zen-doc-nom">${nom}</p><p class="zen-doc-etat">${signe(id)}</p></div>`;
    return `<article class="zen-doc" aria-label="Reconnaissance de dette"><${niveau} class="zen-doc-titre">Reconnaissance de dette</${niveau}>`
      + `<p>Je soussigné(e) ${nomE}, reconnais avoir reçu de ${nomP} la somme de ${C.enLettres(montant)} (${euros(montant)}) à titre de prêt sans intérêt.</p>`
      + (n === 1 ? `<p>Je m'engage à la rembourser en une fois, le ${dateLongue(prem.date)}.`   // remboursé en une fois (Z1)
        : `<p>Je m'engage à la rembourser en ${n} versements mensuels de ${C.enLettres(m)} (${euros(m)}), le ${jour === 1 ? '1er' : jour} de chaque mois, à compter du ${dateLongue(prem.date)}.`)
      + (n > 1 && der.montant !== m ? ` Le dernier versement, le ${dateLongue(der.date)}, sera de ${euros(der.montant)}.` : '') + '</p>'
      + `<p>Fait le ${dateLongue(dateDocument(pret))}.</p>`
      + `<div class="zen-doc-signataires">${signataire('Le prêteur', pret.preteurId, nomP)}${signataire("L'emprunteur", pret.emprunteurId, nomE)}</div>`
      + '<p class="zen-doc-mention">Modèle de document pour le test, à faire valider par notre conseil.</p></article>';
  }

  /* ---------- zen-decouvrir (depuis « Découvrir Zen » de creer-montant, sur le brouillon) ---------- */
  E['zen-decouvrir'] = (etat, params) => {
    const pret = pretDe(params) || modele.brouillon();
    let encadre = '', lienNote = '';
    if (pret) {
      const montant = pret.termes.montant, prix = C.prixZen(montant), autre = prenomHtml(autreId(pret));
      encadre = `<div class="zen-encadre"><p>${euros(prix)} pour un prêt de ${euros(montant)}. Le prix dépend du montant prêté. Il comprend la création, la signature et la conservation de la reconnaissance de dette.</p>`
        + `<p>${insecables(selonRole(modele.role(pret), `Ce prix paie le document signé, une seule fois. Le prêt reste à 0 % : ${autre} te rendra exactement ${euros(montant)}.`, `Ce prix paie le document signé, une seule fois. Le prêt reste à 0 % : tu rendras exactement ${euros(montant)} à ${autre}.`))}</p></div>`;
      if (montant <= C.BORNES.noteMax) lienNote = ui.bouton("Rester sur Note, c'est gratuit", { action: 'zen-decouvrir-note', variante: 'discret', classe: 'btn--centre' });
    }
    return ui.enteteRetour({})
      + ui.puce('TilliT Zen', 'zen')
      + '<h1 class="titre">Mettre le prêt noir sur blanc</h1>'
      + '<p class="sous-titre">Un document signé par vous deux, conservé en sécurité. Utile si un jour la mémoire flanche.</p>'
      + '<div class="carte"><ul class="zen-apports">'
      + `<li class="zen-apport">${ui.icone('coche', { libelle: 'Inclus' })}<div class="zen-apport-corps"><div class="zen-apport-ligne"><span>Reconnaissance de dette signée électroniquement</span>`
      + `<button type="button" class="zen-apport-plus" data-action="infobulle" aria-expanded="false" aria-controls="zen-apport-detail" aria-label="Détail de la signature">${ui.icone('plus', { taille: 20 })}</button></div>`
      + `<p class="zen-apport-detail" id="zen-apport-detail" hidden>${insecables("Signature avec France Identité : incluse. Signature avec FranceConnect : +1,50 € par signataire qui l'utilise.")}</p></div></li>`
      + `<li class="zen-apport">${ui.icone('coche', { libelle: 'Inclus' })}<div class="zen-apport-corps"><span>Conservation sécurisée de l'acte</span></div></li>`
      + '</ul></div>'
      + encadre
      + ui.bouton('Ajouter Zen', { action: 'zen-decouvrir-ajouter' })
      + lienNote;
  };
  // Allume ou éteint Zen sur le brouillon, puis revient à l'écran du montant.
  A['zen-decouvrir-ajouter'] = () => { if (modele.brouillon()) majBrouillon({ formule: 'zen' }); routeur.retour(); };
  A['zen-decouvrir-note'] = () => { if (modele.brouillon()) majBrouillon({ formule: 'note' }); routeur.retour(); };

  /* ---------- zen-payer : feuille du bas (action « zen-payer ») ou écran plein (route) ---------- */
  const piece = {};   // pretId -> 'fi' | 'fc' : pièce choisie avant le paiement
  function htmlPaye(pret) {
    return ui.carteSucces({ titre: 'Zen est payé.',
      texte: `On a prévenu ${prenomBrut(autreId(pret))}. Vous pouvez maintenant signer la reconnaissance de dette, dans l'ordre que vous voulez.`,
      bouton: { libelle: 'Signer maintenant', action: 'aller', params: { route: 'zen-document', pretId: pret.id } },
      lien: { libelle: 'Retour au prêt', action: 'zen-voir-pret', params: { pretId: pret.id } } });
  }
  function htmlPayer(pret, enFeuille) {
    const z = pret.zen, id = pret.id;
    const tete = enFeuille ? '' : ui.enteteRetour({ type: 'croix' });
    if (z.payeurId !== 'moi' || !zenActif(pret)) return tete + etapeZen(pret);    // seul le payeur désigné paie, sur un prêt vivant
    if (z.paye) return tete + htmlPaye(pret);                  // personne ne repaie
    const fc = piece[id] === 'fc';
    const credit = Math.min(modele.lire().moi.creditZen || 0, z.prix);
    const total = z.prix - credit + (fc ? FC : 0);
    const autre = prenomBrut(autreId(pret));
    return tete
      + '<p class="zen-simulation">Simulation · aucun paiement réel</p>'
      + (enFeuille ? '' : '<h1 class="titre">Payer TilliT Zen</h1>')
      + `<p class="zen-question">${insecables('Tu signeras avec quelle pièce ?')}</p>`
      + '<div class="zen-pieces">' + ui.pastilles({ options: [
          { valeur: 'fi', libelle: "Carte d'identité au nouveau format · France Identité, inclus" },
          { valeur: 'fc', libelle: `Autre pièce · FranceConnect, +${euros(FC)}` }],
        valeur: fc ? 'fc' : 'fi', action: 'zen-payer-piece', libelle: 'Tu signeras avec quelle pièce ?', params: { pretId: id } }) + '</div>'
      + ui.lignesRecap([
          ['Prêt', `${autre} · ${euros(pret.termes.montant)}`],
          ['Prix de TilliT Zen', euros(z.prix)],
          fc && ['Supplément FranceConnect', euros(FC)],
          credit > 0 && ['Crédit Zen utilisé', euros(-credit)],
          ['Total', euros(total), { forte: true }],
          ['Payé par', 'Toi']])
      + `<p class="zen-aide">Le supplément FranceConnect ne concerne que toi. ${echapper(autre)} choisit son parcours de son côté.</p>`
      + ui.bouton(`Payer ${euros(total)}`, { action: 'zen-payer-confirmer', params: { pretId: id } });
  }
  A['zen-payer'] = el => {
    const pret = modele.pret(el.dataset.pretId);
    if (!pret || !pret.zen) return;
    delete piece[pret.id];
    ui.feuille.ouvrir(htmlPayer(pret, true), { titre: 'Payer TilliT Zen' });
  };
  A['zen-payer-piece'] = el => {
    const id = el.dataset.pretId, pret = modele.pret(id);
    if (!pret || !pret.zen) return;
    piece[id] = el.dataset.valeur === 'fc' ? 'fc' : 'fi';
    if (!ui.feuille.ouverte()) { routeur.rafraichir(); return; }
    ui.feuille.maj(htmlPayer(pret, true));
    const b = document.querySelector(`#feuille-corps [data-action="zen-payer-piece"][data-valeur="${piece[id]}"]`);
    if (b) b.focus();
  };
  A['zen-payer-confirmer'] = el => {
    const id = el.dataset.pretId;
    const r = payerZen(id, piece[id] === 'fc');
    delete piece[id];
    if (!ui.feuille.ouverte()) return;             // écran plein : le routeur re-rend l'écran payé
    if (!r.ok) { ui.feuille.fermer(); return; }    // l'écran dessous montre l'état réel
    ui.feuille.maj(htmlPaye(modele.pret(id)));
    const b = document.querySelector('#feuille-corps button');
    if (b) b.focus();
  };
  E['zen-payer'] = {
    rendu: (etat, params) => { const pret = pretDe(params); return pret && pret.zen ? htmlPayer(pret, false) : introuvable(); },
    arrivee: params => { if (params.pretId in piece) { delete piece[params.pretId]; routeur.rafraichir(); } }
  };

  /* ---------- zen-document ---------- */
  let lu = false;   // case « J'ai lu le document… » : décochée à chaque arrivée
  E['zen-document'] = {
    rendu(etat, params) {
      const pret = pretDe(params);
      if (!pret || !pret.zen) return introuvable();
      const z = pret.zen, aId = autreId(pret);
      const peutSigner = zenActif(pret) && z.paye && !z.signatures.moi;
      const sous = peutSigner ? `<p class="sous-titre">Relis, puis signe.${z.signatures[aId] ? '' : ` ${prenomHtml(aId)} signera aussi.`}</p>` : '';
      const bas = peutSigner
        ? ui.caseACocher({ id: 'zen-lu', libelle: "J'ai lu le document et je le signe électroniquement.", coche: lu, saisie: 'zen-lu' })
          + '<p class="zen-mention">Signature électronique fournie par Goodflag.</p>'
          + ui.bouton('Signer', { action: 'aller', id: 'zen-signer', desactive: !lu, params: { route: 'zen-signer-choix', pretId: pret.id } })
        : etapeZen(pret);
      return ui.enteteRetour({}) + '<h1 class="titre">Reconnaissance de dette</h1>' + sous + htmlDocument(pret) + bas;
    },
    arrivee() { if (lu) { lu = false; routeur.rafraichir(); } }
  };
  S['zen-lu'] = el => { lu = el.checked; const b = document.getElementById('zen-signer'); if (b) b.disabled = !lu; };

  /* ---------- zen-signer-choix ---------- */
  const parcoursChoisi = {};   // pretId -> 'france_identite' | 'franceconnect'
  function parcoursDe(pret) {
    const z = pret.zen;
    const verrou = z.payeurId === 'moi' && !!z.parcoursSignature.moi;   // choisi au paiement de Zen
    return { verrou, choix: verrou ? z.parcoursSignature.moi : (parcoursChoisi[pret.id] || z.parcoursSignature.moi || 'france_identite') };
  }
  E['zen-signer-choix'] = {
    rendu(etat, params) {
      const pret = pretDe(params);
      if (!pret || !pret.zen) return introuvable();
      if (!zenActif(pret) || !pret.zen.paye || pret.zen.signatures.moi) return ui.enteteRetour({}) + etapeZen(pret);
      const { verrou, choix } = parcoursDe(pret);
      const carteChoix = (valeur, titre, sous) => `<button type="button" class="zen-choix" data-action="zen-choix-parcours" data-valeur="${valeur}" data-pret-id="${echapper(pret.id)}" aria-pressed="${choix === valeur}"${verrou ? ' disabled' : ''}>`
        + `<span class="zen-choix-titre">${titre}</span><span class="zen-choix-sous">${sous}</span></button>`;
      return ui.enteteRetour({})
        + `<h1 class="titre">${insecables('Comment veux-tu signer ?')}</h1>`
        + '<p class="sous-titre">Tu vas être redirigé vers Goodflag, qui vérifie ton identité au moment de signer.</p>'
        + '<div class="zen-choix-liste" role="group" aria-label="Parcours de signature">'
        + carteChoix('france_identite', 'Signer avec France Identité', 'Inclus')
        + carteChoix('franceconnect', 'Signer avec FranceConnect', `+${euros(FC)}, payés par toi`)
        + '</div>'
        + (verrou ? p('Choisi au paiement de Zen.') : '')
        + p(`${prenomHtml(autreId(pret))} choisit son parcours de son côté.`)
        + ui.bouton('Continuer', { action: 'zen-signer-continuer', params: { pretId: pret.id } });
    },
    arrivee(params) { if (params.pretId in parcoursChoisi) { delete parcoursChoisi[params.pretId]; routeur.rafraichir(); } }
  };
  A['zen-choix-parcours'] = el => {
    parcoursChoisi[el.dataset.pretId] = el.dataset.valeur === 'franceconnect' ? 'franceconnect' : 'france_identite';
    routeur.rafraichir();
  };
  A['zen-signer-continuer'] = el => {
    const pret = modele.pret(el.dataset.pretId);
    if (!pret || !pret.zen) return;
    const { choix } = parcoursDe(pret);
    // Le non-payeur qui choisit FranceConnect paie son supplément (simulé) avant d'aller signer.
    if (choix === 'franceconnect' && pret.zen.payeurId !== 'moi' && !pret.zen.supplementFC.moi) {
      ui.feuille.ouvrir(ui.lignesRecap([['Supplément', euros(FC)], ['Payé par', 'Toi']])
        + '<p class="zen-simulation">Simulation · aucun paiement réel</p>'
        + ui.bouton(`Payer ${euros(FC)}`, { action: 'zen-supplement-payer', params: { pretId: pret.id } }),
        { titre: 'Supplément FranceConnect' });
      return;
    }
    if (choisirParcoursSignature(pret.id, choix).ok) routeur.aller('simulation-goodflag', { pretId: pret.id });
  };
  A['zen-supplement-payer'] = el => {
    if (choisirParcoursSignature(el.dataset.pretId, 'franceconnect').ok) routeur.aller('simulation-goodflag', { pretId: el.dataset.pretId });
    else ui.feuille.fermer();
  };

  /* ---------- simulation-goodflag : écran neutre, aucun logo, aucune imitation ---------- */
  E['simulation-goodflag'] = (etat, params) => {
    const pret = pretDe(params);
    if (!pret || !pret.zen) return introuvable();
    if (!zenActif(pret) || !pret.zen.paye) return ui.enteteRetour({}) + etapeZen(pret);
    const avec = pret.zen.parcoursSignature.moi === 'franceconnect' ? 'FranceConnect' : 'France Identité';
    return ui.enteteRetour({})
      + '<div class="zen-goodflag"><h1 class="titre">Simulation</h1>'
      + p(`Ici, tu serais redirigé vers Goodflag pour signer la reconnaissance de dette avec ${avec}. Dans ce prototype, rien n'est signé pour de vrai.`)
      + ui.bouton('Revenir sur TilliT', { action: 'zen-goodflag-revenir', params: { pretId: pret.id } }) + '</div>';
  };
  A['zen-goodflag-revenir'] = el => {
    const id = el.dataset.pretId, pret = modele.pret(id);
    if (!pret || !pret.zen) return;
    if (!pret.zen.signatures.moi && !(zenActif(pret) && signer(id).ok)) { routeur.rafraichir(); return; }
    // Pile vidée : la flèche ne ramène pas vers des écrans de signature périmés.
    routeur.aller(deuxSignatures(modele.pret(id)) ? 'zen-signe' : 'zen-signatures', { pretId: id }, { racine: true });
  };

  /* ---------- zen-signatures, zen-signe ---------- */
  function htmlSigne(pret) {
    const aId = autreId(pret), autre = prenomHtml(aId), m = pret.termes.montant, id = pret.id;
    const role = modele.role(pret);
    const aVerser = pret.statut === 'valide' && !pret.versement;   // passage en Zen d'un prêt en cours : rien à verser
    const etape = aVerser ? p(selonRole(role, `Envoie les ${euros(m)} à ${autre} depuis ta banque, puis indique-le ici.`, `${autre} va t'envoyer l'argent. Tu confirmeras quand tu l'as reçu.`)) : '';
    const boutons = aVerser && role === 'preteur'
      ? ui.bouton("Indiquer que c'est parti", { action: 'aller', params: { route: 'versement-declarer', pretId: id } }) + voirPret(pret, 'discret')
      : voirPret(pret);
    return '<div class="zen-centre">'
      + `<div class="zen-pastille anim-pop">${ui.icone('coche', { taille: 34 })}</div>`
      + ui.mascotte('signature')
      + '<h1 class="titre">Signé par vous deux</h1>'
      + p('La reconnaissance de dette est conservée. Tu la retrouves dans le menu du prêt et dans Mes documents.') + '</div>'
      + `<button type="button" class="zen-doc-carte" data-action="aller" data-route="document-apercu" data-pret-id="${echapper(id)}">`
      + '<span class="zen-pdf" aria-hidden="true">PDF</span><span class="zen-doc-carte-texte"><span class="zen-doc-carte-titre">Reconnaissance de dette</span>'
      + `<span class="zen-doc-carte-sous">${autre} · ${euros(m)} · ${date(derniereSignature(pret))}</span></span></button>`
      + "<p class=\"zen-limite\">TilliT ne garantit pas le remboursement. La reconnaissance de dette peut appuyer une demande de remboursement. Elle n'est pas un titre exécutoire.</p>"
      + `<div class="zen-etape">${ui.pucePret(pret)}${etape}</div>` + boutons;
  }
  E['zen-signe'] = (etat, params) => {
    const pret = pretDe(params);
    if (!pret || !pret.zen) return introuvable();
    return deuxSignatures(pret) ? htmlSigne(pret) : ui.enteteRetour({}) + etapeZen(pret);
  };
  E['zen-signatures'] = (etat, params) => {
    const pret = pretDe(params);
    if (!pret || !pret.zen) return introuvable();
    if (deuxSignatures(pret)) return htmlSigne(pret);   // l'autre vient de signer : l'écran suit
    if (!pret.zen.signatures.moi) return ui.enteteRetour({}) + etapeZen(pret);
    const aId = autreId(pret);
    const ligne = id => `<li class="zen-signataire">${ui.avatar(id)}<span class="zen-signataire-nom">${prenomHtml(id)}</span>`
      + `<span class="zen-signataire-etat">${pret.zen.signatures[id] ? `Signé le ${date(pret.zen.signatures[id])}` : 'En attente'}</span></li>`;
    return '<div class="zen-centre">' + ui.mascotte('sablier') + '<h1 class="titre">Ta signature est enregistrée.</h1></div>'
      + `<ul class="zen-signataires">${ligne('moi')}${ligne(aId)}</ul>`
      // Passage en Zen d'un prêt déjà validé ou en cours : il ne devient pas « validé », il passe en Zen.
      + p(`On a prévenu ${prenomHtml(aId)}. Dès sa signature, ${pret.statut === 'signatures' ? 'le prêt est validé' : 'le prêt passe en Zen'}.`)
      + retourPret(pret);
  };

  /* ---------- document-apercu : lecture seule, aucun téléchargement ---------- */
  E['document-apercu'] = (etat, params) => {
    const pret = pretDe(params);
    if (!pret || !pret.zen) return introuvable();
    return ui.enteteRetour({}) + htmlDocument(pret, 'h1');
  };

  /* ---------- passage-zen (menu « ⋯ » d'un prêt Note validé ou en cours) ---------- */
  const moiPaiePassage = {};   // pretId -> bool : interrupteur « C'est moi qui paie Zen »
  const moiPaie = pret => (pret.id in moiPaiePassage ? moiPaiePassage[pret.id] : modele.role(pret) === 'preteur');   // défaut du fichier 03
  const ligneQuiPaie = (pret, moi) => {
    const prix = euros(C.prixZen(pret.termes.montant));
    return moi ? `Tu paies ${prix}, une seule fois.` : `${prenomBrut(autreId(pret))} paie ${prix}, une seule fois.`;
  };
  E['passage-zen'] = {
    rendu(etat, params) {
      const pret = pretDe(params);
      if (!pret) return introuvable();
      const autre = prenomHtml(autreId(pret)), id = pret.id, tete = ui.enteteRetour({});
      const chg = modele.changementEnAttente(pret);
      if (chg && chg.type === 'passage_zen') {
        return chg.auteurId === 'moi'
          ? tete + '<div class="zen-centre">' + ui.mascotte('envoi') + "<h1 class=\"titre\">C'est envoyé.</h1></div>" + retourPret(pret)
          : tete + p(`${autre} propose de passer le prêt en Zen.`) + ui.bouton('Voir la proposition', { action: 'aller', params: { route: 'changement-recu', pretId: id } });
      }
      // Demande acceptée : paiement puis signatures, comme pour un prêt Zen.
      if (pret.zen) return tete + '<h1 class="titre">Passer le prêt en Zen</h1>' + etapeZen(pret);
      if (chg) {   // un autre changement attend une réponse (textes de la carte d'action, fichier 07)
        return tete + p(chg.auteurId === 'moi'
          ? `C'est envoyé. Le nouveau calendrier s'applique quand ${autre} l'aura accepté. En attendant, le calendrier prévu reste en place.`
          : `${autre} propose un nouveau calendrier.`) + retourPret(pret);
      }
      if (pret.termes.formule !== 'note' || !['valide', 'en_cours'].includes(pret.statut)) return tete + ui.pucePret(pret) + retourPret(pret);
      const moi = moiPaie(pret);
      return tete + '<h1 class="titre">Passer le prêt en Zen</h1>'
        + p(insecables(`Vous signez tous les deux une reconnaissance de dette pour ce prêt. Le prix dépend du montant du prêt : ${euros(C.prixZen(pret.termes.montant))} pour ${euros(pret.termes.montant)}.`))
        + ui.interrupteur({ id: 'zen-passage-payeur', libelle: "C'est moi qui paie Zen", coche: moi, saisie: 'zen-passage-payeur', aide: ligneQuiPaie(pret, moi) })
        + ui.bouton('Envoyer la demande', { action: 'zen-passage-envoyer', params: { pretId: id } });
    },
    arrivee(params) { if (params.pretId in moiPaiePassage) { delete moiPaiePassage[params.pretId]; routeur.rafraichir(); } }
  };
  S['zen-passage-payeur'] = (el, etat, params) => {
    const pret = modele.pret(params.pretId);
    if (!pret) return;
    moiPaiePassage[pret.id] = el.checked;
    const aide = document.getElementById('zen-passage-payeur-aide');
    if (aide) aide.textContent = ligneQuiPaie(pret, el.checked);
  };
  A['zen-passage-envoyer'] = el => {
    const pret = modele.pret(el.dataset.pretId);
    if (!pret) return;
    const r = proposerChangement(pret.id, { type: 'passage_zen', payeurZenId: moiPaie(pret) ? 'moi' : autreId(pret) });
    if (r.ok) delete moiPaiePassage[pret.id];   // le routeur re-rend : « C'est envoyé. »
  };
})();
