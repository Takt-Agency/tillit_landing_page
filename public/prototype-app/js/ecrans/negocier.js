/* ==========================================================================
   TilliT prototype · lot D · Recevoir une proposition et négocier
   Spec : 04-recevoir-negocier.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot D. N'écris que dans ce fichier et dans la
   section « lot D » de css/ecrans.css.

   Routes : proposition-recue, proposer-autre-chose, proposition-envoyee, accord-note, accord-zen, refus-envoye, refus-recu
   API utile : accepter, proposerAutreChose, refuser, retirer, demanderCarnet, modele.derniereVersion, modele.aMoiDeRepondre, calculs.differences, ui.boutonsReponse, ui.blocTermes (avecFormule: true)
   Le brouillon d'une contre-proposition vit dans une variable de ce fichier (pas dans l'état) jusqu'à proposerAutreChose.
   Pour les autres lots : data-action="nego-retirer" data-pret-id="…" ouvre la feuille « Retirer ta proposition ? » (spec 04, D-21).
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, delai, echapper, selonRole, insecables } = textes;
  const E = ecrans, A = actions, S = saisies;
  const ins = insecables;
  const PLAFOND = calculs.BORNES.plafondAnnuel;
  const INFO_PLAFOND = `Sur TilliT, chaque personne peut prêter jusqu'à ${euros(PLAFOND)} et emprunter jusqu'à ${euros(PLAFOND)} par année civile, tous proches confondus.`;

  let contre = null;   // { pretId, n, termes, message } : contre-proposition en cours, hors état

  const autreBrut = p => modele.prenom(modele.autre(p));
  const autreHtml = p => echapper(autreBrut(p));
  const enNego = p => p.statut === 'propose' || p.statut === 'negociation';
  function jattends(p) { const v = modele.derniereVersion(p); return enNego(p) && !!v && v.auteurId === 'moi' && v.statut === 'en_attente'; }
  const pretDe = params => (params.pretId && modele.pret(params.pretId)) || modele.prets().find(x => modele.aMoiDeRepondre(x)) || null;
  const accueil = libelle => ui.bouton(libelle || "Revenir à l'accueil", { action: 'onglet', params: { route: 'accueil' } });
  const entete = p => ui.enteteRetour({ titre: ui.brut(ui.avatar(modele.autre(p), { taille: 'm', libelle: true })) });
  const vide = () => ui.enteteRetour({}) + `<div class="nego-etat">${accueil()}</div>`;

  /* ---------- Textes des termes ---------- */
  function remboursement(t) {
    const v = calculs.echeancier(t);
    return v.n > 1 && v.derniere !== v.mensualite ? `${v.n - 1} × ${euros(v.mensualite)} puis ${euros(v.derniere)}` : `${v.n} × ${euros(v.mensualite)}`;
  }
  function bornesDates(t) {
    const e = calculs.echeancier(t).echeances;
    return { premiere: e.length ? e[0].date : t.premiereDate, derniere: e.length ? e[e.length - 1].date : null };
  }
  function echeancierTexte(t) {
    const v = calculs.echeancier(t), d = bornesDates(t);
    const du = d.derniere ? `du ${date(d.premiere)} au ${date(d.derniere)}` : '';
    return v.n > 1 && v.derniere !== v.mensualite ? `${v.n - 1} × ${euros(v.mensualite)} puis ${euros(v.derniere)}, ${du}` : `${v.n} × ${euros(v.mensualite)} ${du}`;
  }
  const nomFormule = f => (f === 'zen' ? 'TilliT Zen' : 'TilliT Note');
  const payeur = id => (id === 'moi' ? 'Toi' : modele.prenom(id));

  /* ---------- « Ce qui change » : une ligne par élément, l'ancien barré, le nouveau à côté ---------- */
  function lignesChange(avant, apres) {
    const d = calculs.differences(avant, apres);
    const a = calculs.normaliserTermes(avant), b = calculs.normaliserTermes(apres);
    const L = [];
    const ligne = (libelle, x, y) => L.push(`<li>${libelle} : <del><span class="visuellement-cache">avant </span>${echapper(x)}</del> `
      + `<ins><span class="visuellement-cache">maintenant </span>${echapper(y)}</ins></li>`);
    if (d.includes('montant')) ligne('Montant', euros(a.montant), euros(b.montant));
    if (d.includes('duree')) ligne('Durée', `${a.duree} mois`, `${b.duree} mois`);
    if (d.includes('mensualite')) ligne('Par mois', euros(a.mensualite), euros(b.mensualite));
    if (d.includes('premiereDate')) ligne('Première échéance', date(a.premiereDate), date(b.premiereDate));
    if (d.includes('formule')) ligne('Formule', nomFormule(a.formule), nomFormule(b.formule));
    if (d.includes('payeurZenId') && a.formule === 'zen' && b.formule === 'zen') ligne('Qui paie Zen', payeur(a.payeurZenId), payeur(b.payeurZenId));
    return L;
  }
  function blocChange(avant, apres, message) {
    const L = lignesChange(avant, apres);
    if (!L.length) return '';
    return `<div class="nego-change"><h2 class="nego-h2">Ce qui change</h2><ul class="nego-change-liste">${L.join('')}</ul>`
      + (message ? `<blockquote class="nego-message"><p>${echapper(message)}</p></blockquote>` : '') + '</div>';
  }
  // Carte des conditions : valeurs actuelles ; celles qui ont changé en gras violet.
  function carteConditions(t, avant) {
    const d = bornesDates(t), da = avant ? bornesDates(avant) : null;
    const lignes = [
      t.motif && ['Motif', t.motif],
      ['Remboursement', remboursement(t), { forte: !!avant && remboursement(avant) !== remboursement(t) }],
      ['Première échéance', date(d.premiere), { forte: !!da && da.premiere !== d.premiere }],
      ['Dernière échéance', date(d.derniere), { forte: !!da && da.derniere !== d.derniere }],
      ['Intérêts', '0 %'],
      ['Formule', t.formule === 'zen' ? 'TilliT Zen' : 'TilliT Note · sans frais', { forte: !!avant && avant.formule !== t.formule }],
      t.tiersContactId && ['Tiers de confiance', modele.prenom(t.tiersContactId)]
    ];
    return ui.carte(ui.lignesRecap(lignes, { classe: 'nego-conditions' }));
  }
  const blocZen = (prix, payeurId) => `<div class="nego-zen"><p class="nego-zen-nom">TilliT Zen · ${euros(prix || 0)}</p>`
    + `<p class="nego-zen-payeur">${payeurId === 'moi' ? 'Payé par toi' : `Payé par ${echapper(modele.prenom(payeurId))}`}</p></div>`;
  // Carnet de prêt (testeur prêteur seulement, D-41) : l'écran du Carnet est au lot I.
  function blocCarnet(p) {
    if (modele.role(p) !== 'preteur') return '';
    const autre = autreHtml(p), d = p.carnet.demandeVoir, pretId = p.id;
    let suite = '';
    if (d === 'acceptee') suite = ui.bouton('Voir', { action: 'aller', params: { route: 'carnet-proche', pretId }, variante: 'secondaire', pleine: false });
    else if (d === 'en_attente') suite = ui.puce('Demande envoyée', 'attente');
    else if (d === 'refusee') suite = `<p class="nego-carnet-texte">${autre} préfère ne pas montrer son Carnet pour l'instant.</p>`;
    else suite = ui.bouton('Demander à voir le Carnet', { action: 'nego-carnet', params: { pretId }, variante: 'secondaire', pleine: false });
    return `<div class="nego-carnet"><p class="nego-carnet-titre">Carnet de prêt de ${autre}</p>${suite}</div>`;
  }
  function textePlafond(role, pl) {
    if (pl.atteint) return selonRole(role,
      `Tu as atteint ${euros(PLAFOND)} prêtés cette année. Tu pourras prêter à nouveau à partir du 1er janvier.`,
      `Tu as atteint ${euros(PLAFOND)} empruntés cette année. Tu pourras emprunter à nouveau à partir du 1er janvier.`);
    return selonRole(role,
      `Avec ce prêt, tu dépasserais ${euros(PLAFOND)} prêtés cette année. Tu peux encore prêter ${euros(pl.reste)} jusqu'au 31 décembre.`,
      `Avec ce prêt, tu dépasserais ${euros(PLAFOND)} empruntés cette année. Tu peux encore demander ${euros(pl.reste)} jusqu'au 31 décembre.`);
  }
  // Première réponse d'un testeur arrivé par une invitation : notifications-autoriser (lot A) s'intercale.
  function premiereReponseInvitation(p) {
    const s = modele.lire().session;
    return s.entree === 'invitation' && s.pretInvitationId === p.id && !p.versions.some(v => v.auteurId === 'moi');
  }
  // Bouton de sortie d'un écran de résultat : data-vers = 'accueil' | 'parcours'.
  const sortie = (libelle, vers, params, variante) => ui.bouton(libelle, { action: 'nego-sortie', params: { vers }, variante: variante || 'principal', classe: variante === 'discret' ? 'btn--centre' : '' });
  A['nego-sortie'] = (el, etat, params) => {
    const vers = el.dataset.vers === 'parcours' ? 'parcours' : 'accueil';
    const suite = vers === 'parcours' && params.pretId ? { pretId: params.pretId } : {};
    if (params.autoriser && ecrans['notifications-autoriser']) routeur.aller('notifications-autoriser', { apres: vers, pretId: params.pretId }, { racine: true });
    else routeur.aller(vers, suite, { racine: true });
  };

  /* ---------- État d'une proposition à laquelle le testeur n'a plus à répondre ---------- */
  function etatHorsReponse(p) {
    const autre = autreHtml(p), v = modele.derniereVersion(p);
    let texte = '', suite = '';
    if (p.statut === 'expire') texte = 'Cette proposition a expiré sans réponse.';
    else if (p.statut === 'retire') texte = v && v.auteurId === 'moi' ? 'Tu as retiré ta proposition.' : `${autre} a retiré sa proposition.`;
    else if (jattends(p)) {
      texte = `En attente de la réponse de ${autre}.`;
      suite = ui.bouton('Retirer ma proposition', { action: 'nego-retirer', params: { pretId: p.id }, variante: 'discret', classe: 'btn--centre' });
    } else if (p.statut === 'refuse') texte = v && v.auteurId === 'moi' ? `${autre} a refusé cette proposition.` : 'Ta réponse est envoyée.';
    else if (!enNego(p)) suite = ui.bouton('Voir le prêt', { action: 'onglet', params: { route: 'parcours', pretId: p.id }, variante: 'secondaire' });
    return entete(p) + `<div class="nego-etat">${ui.pucePret(p)}${texte ? `<p class="nego-etat-texte">${texte}</p>` : ''}${suite}${accueil()}</div>`;
  }

  /* ---------- proposition-recue ---------- */
  E['proposition-recue'] = (etat, params) => {
    const p = pretDe(params);
    if (!p) return vide();
    if (!modele.aMoiDeRepondre(p)) return etatHorsReponse(p);
    const v = modele.derniereVersion(p), t = v.termes, role = modele.role(p);
    const autreB = autreBrut(p), autre = echapper(autreB);
    const avant = p.versions.length > 1 ? p.versions[p.versions.length - 2].termes : null;
    const qui = autre + ui.certifie(modele.autre(p));   // pastille « Certifié » à côté du nom
    const titre = avant ? `${qui} propose autre chose` : selonRole(role, `${qui} te demande ${euros(t.montant)}`, `${qui} te propose un prêt`);
    const mensualite = calculs.echeancier(t).mensualite;
    return entete(p)
      + `<h1 class="titre nego-titre">${titre}</h1>`
      + `<p class="nego-recue">Reçue ${delai(v.date)}</p>`
      + `<p class="nego-expire">Sans réponse, elle expire le ${date(calculs.ajouterJours(v.date, calculs.BORNES.expirationJours))}.</p>`
      + (avant ? blocChange(avant, t, v.message) : '')
      + `<div class="nego-montant"><p class="montant-grand${avant && avant.montant !== t.montant ? ' nego-fort' : ''}">${euros(t.montant)}</p>`
      + `<p class="texte-mute">à 0 % d'intérêt</p></div>`
      + carteConditions(t, avant)
      + (t.formule === 'zen' ? blocZen(calculs.prixZen(t.montant), t.payeurZenId) : '')
      + blocCarnet(p)
      + ui.bulle(ins(selonRole(role, `Si ces conditions ne te vont pas, propose autre chose. ${autreB} verra ta proposition.`,
                                    `Si ${euros(mensualite)} par mois te paraît trop, propose un autre rythme. ${autreB} verra ta proposition.`)), { pose: 'proposition' })
      + '<p class="nego-rien">Rien ne démarre sans ta réponse.</p>'
      + ui.boutonsReponse({ accepter: 'nego-accepter', autre: 'nego-autre', refuser: 'nego-refuser', params: { pretId: p.id } });
  };

  // « J'accepte » : feuille de confirmation, avec le contrôle du plafond annuel du testeur.
  A['nego-accepter'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p || !modele.aMoiDeRepondre(p)) return;
    const t = modele.derniereVersion(p).termes, role = modele.role(p);
    const pl = modele.plafond(role, t.montant, p.id);
    const zen = t.formule === 'zen';
    const lignes = ui.lignesRecap([
      ['Montant', euros(t.montant)],
      ['Remboursement', remboursement(t)],
      ['Première échéance', date(bornesDates(t).premiere)],
      ['Formule', zen ? `TilliT Zen · ${euros(calculs.prixZen(t.montant) || 0)}` : 'TilliT Note · sans frais'],
      zen && ['Qui paie Zen', payeur(t.payeurZenId), { corail: true }]
    ]);
    const bas = pl.depasse
      ? `<div class="bt-message"><p>${echapper(ins(textePlafond(role, pl)))}${ui.infobulle(INFO_PLAFOND, { libelle: 'À propos du plafond annuel' })}</p></div>`
        + ui.bouton('Proposer un autre montant', { action: 'nego-autre', params: { pretId: p.id } })
      : ui.bouton("J'accepte", { action: 'nego-accepter-oui', params: { pretId: p.id } });
    const cumul = calculs.cumulEntreProches(modele.lire(), 'moi', modele.autre(p), t.montant, modele.aujourdhui().slice(0, 4), p.id);
    ui.feuille.ouvrir(lignes + (cumul.depasse ? ui.encartCumul() : '') + `<div class="pile-reponses">${bas}</div>`, { titre: ins('Tu acceptes ce prêt ?') });
  };
  A['nego-accepter-oui'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p) return;
    const autoriser = premiereReponseInvitation(p);
    const r = accepter(p.id);
    if (!r.ok) { ui.feuille.fermer(); return; }
    routeur.aller(modele.pret(p.id).termes.formule === 'zen' ? 'accord-zen' : 'accord-note', { pretId: p.id, autoriser }, { remplacer: true });
  };
  A['nego-autre'] = el => { contre = null; routeur.aller('proposer-autre-chose', { pretId: el.dataset.pretId }); };
  A['nego-refuser'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p || !modele.aMoiDeRepondre(p)) return;
    ui.feuille.ouvrir(`<p>On prévient ${autreHtml(p)}. Vous pourrez toujours en reparler.</p>`
      + ui.zoneTexte({ id: 'nego-refus-mot', libelle: ins(`Un mot pour ${autreBrut(p)} ? (facultatif)`), lignes: 2, maxlength: 500 })
      + `<div class="pile-reponses">`
      + ui.bouton('Refuser', { action: 'nego-refuser-oui', params: { pretId: p.id } })
      + ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>',
      { titre: ins('Refuser cette proposition ?') });
  };
  A['nego-refuser-oui'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p) return;
    const autoriser = premiereReponseInvitation(p);
    const mot = document.getElementById('nego-refus-mot');
    const r = refuser(p.id, mot ? mot.value : null);
    if (!r.ok) { ui.feuille.fermer(); return; }
    routeur.aller('refus-envoye', { pretId: p.id, autoriser }, { remplacer: true });
  };

  /* ---------- Retirer sa proposition (D-21) ---------- */
  A['nego-retirer'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p || !jattends(p)) return;
    ui.feuille.ouvrir(`<p>${autreHtml(p)} ne pourra plus l'accepter.</p><div class="pile-reponses">`
      + ui.bouton('Retirer', { action: 'nego-retirer-oui', params: { pretId: p.id } })
      + ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>',
      { titre: ins('Retirer ta proposition ?') });
  };
  A['nego-retirer-oui'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (p && jattends(p)) retirer(p.id);
    ui.feuille.fermer();
  };

  /* ---------- Demander à voir le Carnet (spec 09 ; la réponse vient du proche simulé, lot K) ---------- */
  A['nego-carnet'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p || p.carnet.demandeVoir !== 'aucune') return;
    ui.feuille.ouvrir(`<p>${autreHtml(p)} choisit de te le montrer ou non.</p><div class="pile-reponses">`
      + ui.bouton('Demander', { action: 'nego-carnet-oui', params: { pretId: p.id } }) + '</div>',
      { titre: ins(`Demander à voir le Carnet de ${autreBrut(p)} ?`) });
  };
  A['nego-carnet-oui'] = el => { demanderCarnet(el.dataset.pretId); ui.feuille.fermer(); };

  /* ---------- proposer-autre-chose ---------- */
  function htmlTotal(avant, apres) {
    return avant.montant === apres.montant
      ? ins(`Le montant total ne change pas : ${euros(apres.montant)} prêtés, ${euros(apres.montant)} rendus.`)
      : `${euros(apres.montant)} prêtés, ${euros(apres.montant)} rendus. 0 % d'intérêt.`;
  }
  function majContre(v, verdict) {
    const change = calculs.differences(v.termes, contre.termes).length > 0;
    ui.majZone('nego-apercu', blocChange(v.termes, contre.termes, null));
    ui.majZone('nego-total', htmlTotal(v.termes, contre.termes));
    const $ = id => document.getElementById(id);
    if ($('nego-rappel')) $('nego-rappel').classList.toggle('nego-barre', change);
    if ($('nego-envoyer')) $('nego-envoyer').disabled = !change || !verdict.valide;
    if ($('nego-aide')) $('nego-aide').hidden = change;
  }
  E['proposer-autre-chose'] = (etat, params) => {
    const p = pretDe(params);
    if (!p) return vide();
    if (!modele.aMoiDeRepondre(p)) return etatHorsReponse(p);
    const v = modele.derniereVersion(p), role = modele.role(p), autreB = autreBrut(p);
    if (!contre || contre.pretId !== p.id || contre.n !== v.n) contre = { pretId: p.id, n: v.n, termes: Object.assign({}, v.termes), message: '' };
    const change = calculs.differences(v.termes, contre.termes).length > 0;
    const valide = ui.verdictTermes({ termes: contre.termes, role, pretId: p.id }).valide;
    return ui.enteteRetour({})
      + `<h1 class="titre">${ins("Qu'est-ce qui t'irait mieux ?")}</h1>`
      + `<p class="sous-titre">${echapper(autreB)} ne verra que ce qui change.</p>`
      + `<div class="nego-rappel"><p class="nego-rappel-libelle">Sa proposition</p><p id="nego-rappel" class="nego-rappel-texte${change ? ' nego-barre' : ''}">${echeancierTexte(v.termes)}</p></div>`
      + ui.blocTermes({ id: 'nego-bt', termes: contre.termes, role, autreId: modele.autre(p), pretId: p.id, avecFormule: true,
                        surChangement: (t, verdict) => { contre.termes = t; majContre(v, verdict); } })
      + `<div id="nego-apercu" aria-live="polite">${blocChange(v.termes, contre.termes, null)}</div>`
      + `<p class="nego-total" id="nego-total">${htmlTotal(v.termes, contre.termes)}</p>`
      + ui.zoneTexte({ id: 'nego-mot', libelle: ins(`Un mot pour ${autreB} ?`), valeur: contre.message, lignes: 2, maxlength: 500,
                       exemple: 'Je préfère étaler un peu, je serai plus tranquille.', saisie: 'nego-mot' })
      + ui.bouton('Envoyer ma proposition', { action: 'nego-envoyer', id: 'nego-envoyer', params: { pretId: p.id }, desactive: !change || !valide })
      + `<p class="champ-aide nego-aide" id="nego-aide"${change ? ' hidden' : ''}>Change au moins un élément pour envoyer une nouvelle proposition.</p>`;
  };
  S['nego-mot'] = el => { if (contre) contre.message = el.value; };
  A['nego-envoyer'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p || !contre || contre.pretId !== p.id) return;
    const autoriser = premiereReponseInvitation(p);
    const mot = document.getElementById('nego-mot');
    const r = proposerAutreChose(p.id, contre.termes, mot ? mot.value : contre.message);
    if (!r.ok) return;
    contre = null;
    routeur.aller('proposition-envoyee', { pretId: p.id, autoriser }, { racine: true });
  };

  /* ---------- proposition-envoyee ---------- */
  E['proposition-envoyee'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return vide();
    const autre = autreHtml(p);
    return '<div class="nego-fin">'
      + `<div class="nego-pastille anim-pop">${ui.icone('echange', { taille: 30 })}</div>`
      + ui.mascotte('envoi', { taille: 'moyenne' })
      + '<h1 class="titre">Proposition envoyée</h1>'
      + `<p>${autre} reçoit ta nouvelle proposition. Vous voyez tous les deux la même chose.</p>`
      + '<ol class="nego-etapes">'
      + `<li class="nego-etape nego-etape--faite"><span class="nego-etape-rond">${ui.icone('coche', { taille: 18, libelle: 'Fait' })}</span><span>Ta réponse est enregistrée</span></li>`
      + `<li class="nego-etape"><span class="nego-etape-rond" aria-hidden="true">2</span><span>${autre} accepte, refuse ou propose autre chose</span></li>`
      + '</ol>'
      + sortie("Revenir à l'accueil", 'accueil', params)
      + '</div>';
  };

  /* ---------- accord-note, accord-zen ---------- */
  function ecranAccord(params, zen) {
    const p = modele.pret(params.pretId);
    if (!p) return vide();
    const role = modele.role(p), autre = autreHtml(p), t = p.termes;
    const acceptee = [...p.versions].reverse().find(v => v.statut === 'acceptee');
    const parMoi = !!acceptee && acceptee.auteurId !== 'moi';
    const titre = parMoi ? (zen ? 'Accord trouvé.' : "C'est validé.") : selonRole(role, `${autre} a accepté`, `${autre} a accepté ta proposition`);
    const d = bornesDates(t);
    const conditions = ui.carte(ui.lignesRecap([
      ['Montant', euros(t.montant)],
      ['Remboursement', remboursement(t)],
      ['Première échéance', date(d.premiere)],
      ['Dernière échéance', date(d.derniere)],
      ['Intérêts', '0 %'],
      ['Formule', zen ? 'TilliT Zen' : 'TilliT Note · sans frais']
    ]) + (zen && p.zen ? blocZen(p.zen.prix, p.zen.payeurId) : ''));
    let suite = '', ligne = '';
    if (zen && p.zen) {
      if (p.statut === 'attente_paiement_zen') {
        suite = p.zen.payeurId === 'moi'
          ? `<p>${ins(`Il reste à payer Zen : ${euros(p.zen.prix)}. Ensuite, vous signerez tous les deux la reconnaissance de dette.`)}</p>`
            + ui.bouton('Payer Zen', { action: 'zen-payer', params: { pretId: p.id } })
          : `<p>${ins(`${autre} doit payer Zen : ${euros(p.zen.prix)}. On te prévient dès que c'est fait.`)}</p>` + sortie('Voir le prêt', 'parcours', params);
        ligne = "Rien n'avance tant que Zen n'est pas payé.";
      } else suite = sortie('Voir le prêt', 'parcours', params);
    } else if (p.statut === 'valide' && !p.versement) {
      suite = selonRole(role,
        `<p>Envoie les ${euros(t.montant)} à ${autre} depuis ta banque, puis indique-le ici.</p>`
          + ui.bouton("Indiquer que c'est parti", { action: 'aller', params: { route: 'versement-declarer', pretId: p.id } })
          + sortie('Plus tard', 'accueil', params, 'discret'),
        `<p>${autre} va t'envoyer l'argent. Tu confirmeras quand tu l'as reçu.</p>` + sortie('Voir le prêt', 'parcours', params));
      ligne = 'Aucune échéance ne court avant le versement.';
    } else suite = sortie('Voir le prêt', 'parcours', params);
    return ui.enteteRetour({})
      + '<div class="nego-accord">'
      + ui.mascotte('confiante', { taille: 'moyenne' })
      + `<div class="nego-accord-puce">${ui.pucePret(p)}</div>`
      + `<h1 class="titre">${titre}</h1></div>`
      + conditions
      + `<div class="nego-suite">${suite}</div>`
      + (ligne ? `<p class="nego-ligne">${ligne}</p>` : '');
  }
  E['accord-note'] = (etat, params) => ecranAccord(params, false);
  E['accord-zen'] = (etat, params) => ecranAccord(params, true);

  /* ---------- refus-envoye, refus-recu ---------- */
  E['refus-envoye'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return vide();
    return '<div class="nego-fin"><h1 class="titre">Ta réponse est envoyée.</h1>'
      + `<p>On a prévenu ${autreHtml(p)}.</p>` + sortie("Revenir à l'accueil", 'accueil', params) + '</div>';
  };
  E['refus-recu'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return vide();
    const autre = autreHtml(p);
    const v = modele.derniereVersion(p);
    const mot = v && v.messageRefus ? `<blockquote class="nego-message"><p>${echapper(v.messageRefus)}</p></blockquote>` : '';
    return entete(p)
      + `<div class="nego-fin"><h1 class="titre">${autre} a refusé cette proposition.</h1>`
      + mot
      + '<p>Tu peux lui écrire, ou préparer une autre proposition plus tard.</p>'
      + accueil()
      + ui.bouton(`Écrire à ${autreBrut(p)}`, { action: 'aller', params: { route: 'fil', pretId: p.id }, variante: 'discret', classe: 'btn--centre' })
      + '</div>';
  };
})();
