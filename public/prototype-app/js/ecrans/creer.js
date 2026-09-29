/* ==========================================================================
   TilliT prototype · lot C · Créer un prêt
   Spec : 03-creer.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot C. N'écris que dans ce fichier et dans la
   section « lot C » de css/ecrans.css.

   Routes : creer-qui (params { role: 'preteur' | 'emprunteur' }, ouvert par la feuille « Nouveau prêt » du lot 0), creer-montant, creer-details, creer-verifier, creer-envoyer, creer-envoye
   P-9 n° 8 : l'écran « La formule » a disparu. Zen se choisit sur creer-montant, dans le bloc des termes (avecFormule).
   API utile : creerBrouillon, majBrouillon, envoyerProposition, ajouterContact, abandonnerBrouillon, modele.brouillon, ui.blocTermes, ui.enteteEtape, calculs.prixZen
   Le bloc des termes se met à jour pendant la frappe ; passe majBrouillon dans surChangement.
   Un sous-écran ouvert par « Changer » (creer-verifier) reçoit { depuis: 'verifier' } : « Continuer » y revient.
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, echapper, selonRole, insecables } = textes;
  const E = ecrans, A = actions, S = saisies;
  const ins = insecables;

  const MOTIFS = ['Réparer une voiture', 'Finir le mois', 'Caution logement', 'Voyage', 'Permis', 'Études', 'Santé', 'Imprévu', 'Autre'];
  // Barre : un tiers du premier tiers par sous-écran, puis 2/3 et 3/3 (spec 03 ; P-9 n° 8 : trois sous-écrans).
  const ETAPES = {
    'creer-qui': ['1/3 · Le prêt', 1 / 9], 'creer-montant': ['1/3 · Le prêt', 2 / 9],
    'creer-details': ['1/3 · Le prêt', 3 / 9],
    'creer-verifier': ['2/3 · Vérifier', 2 / 3], 'creer-envoyer': ['3/3 · Envoyer', 1]
  };

  // État d'écran, hors de l'état du prototype (rien à garder d'une session à l'autre).
  let recherche = '';            // filtre de creer-qui
  let tiersOuvert = false;       // interrupteur du tiers allumé, aucun tiers encore choisi
  let canal = 'whatsapp';        // pastille de la feuille « Inviter un proche »
  let repertoire = false;        // accès au répertoire accordé (simulation), le temps de la session
  // Répertoire du téléphone, fictif : un proche déjà sur TilliT se choisit directement, les autres s'invitent.
  // Jamais Camille, Léa ni Marc (spec 00 §3).
  const REPERTOIRE = [{ contact: 'c-leonie' }, { contact: 'c-karim' }, { contact: 'c-sofia' },
    { prenom: 'Yanis', nom: 'Faure', tel: '06 00 00 00 01' }, { prenom: 'Chloé', nom: 'Petit', tel: '06 00 00 00 02' },
    { prenom: 'Samir', nom: 'Mansour', tel: '06 00 00 00 03' }, { prenom: 'Élodie', nom: 'Roux', tel: '06 00 00 00 04' },
    { prenom: 'Bastien', nom: 'Leroy', tel: '06 00 00 00 05' }];

  const sansAccent = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const roleDe = params => params.role || (modele.brouillon() && modele.role(modele.brouillon())) || 'preteur';
  const autreBrut = p => modele.prenom(modele.autre(p));
  const autreHtml = p => echapper(autreBrut(p));

  function entete(route) {
    const [compteur, v] = ETAPES[route];
    return ui.enteteEtape({ compteur, progression: v, fermer: 'creer-quitter', retour: route === 'creer-qui' ? null : 'retour' });
  }
  // Écran qui a besoin du brouillon : sans brouillon (création quittée, prêt envoyé), retour à l'accueil.
  function ecranBrouillon(route, corps) {
    E[route] = {
      rendu: (etat, params) => { const p = modele.brouillon(); return p ? corps(etat, params, p) : ''; },
      arrivee: () => { if (!modele.brouillon()) routeur.aller('accueil', {}, { racine: true }); }
    };
  }
  function remboursement(v) {
    return v.n > 1 && v.derniere !== v.mensualite
      ? `${v.n - 1} × ${euros(v.mensualite)} puis ${euros(v.derniere)}` : `${v.n} × ${euros(v.mensualite)}`;
  }
  const verdict = p => ui.verdictTermes({ termes: p.termes, role: modele.role(p), pretId: p.id });

  /* ---------- Quitter, continuer ---------- */
  A['creer-quitter'] = () => {
    if (!modele.brouillon()) { routeur.retour(); return; }
    ui.feuille.ouvrir('<p>Ce que tu as saisi sera perdu.</p><div class="pile-reponses">'
      + ui.bouton('Quitter', { action: 'creer-quitter-oui' })
      + ui.bouton('Continuer la création', { action: 'fermer-feuille', variante: 'secondaire' }) + '</div>',
      { titre: 'Quitter la création ?' });
  };
  A['creer-quitter-oui'] = () => { abandonnerBrouillon(); routeur.aller('accueil', {}, { racine: true }); };
  // data-suite : sous-écran suivant. Ouvert depuis « Changer », on revient au récapitulatif.
  A['creer-suivant'] = (el, etat, params) => {
    const p = modele.brouillon();
    if (!p) return;
    if (el.dataset.suite === 'creer-details' && !verdict(p).valide) return;
    if (params.depuis === 'verifier') routeur.retour(); else routeur.aller(el.dataset.suite);
  };
  A['creer-changer'] = el => routeur.aller(el.dataset.suite, { depuis: 'verifier' });

  /* ---------- creer-qui ---------- */
  function sousLigne(c) {
    const ensemble = modele.prets().filter(p => p.preteurId === c.id || p.emprunteurId === c.id);
    const enCours = ensemble.filter(p => p.statut === 'en_cours').length;
    const rembourses = ensemble.filter(p => p.statut === 'rembourse').length;
    if (enCours) return enCours === 1 ? 'Un prêt en cours ensemble' : `${enCours} prêts en cours ensemble`;
    if (rembourses) return rembourses === 1 ? '1 prêt remboursé ensemble' : `${rembourses} prêts remboursés ensemble`;
    return 'Sur TilliT';
  }
  function listeContacts() {
    const q = sansAccent(recherche);
    const contacts = modele.lire().contacts.filter(c => c.surTilliT && (!q || sansAccent(`${c.prenom} ${c.nom}`).includes(q)));
    return contacts.map(c => `<li><button type="button" class="creer-contact" data-action="creer-choisir" data-contact="${echapper(c.id)}">`
      + ui.avatar(c, { taille: 'm' })
      + `<span class="creer-contact-texte"><span class="creer-contact-nom">${echapper(modele.nomComplet(c.id))}${ui.certifie(c)}</span>`
      + `<span class="creer-contact-sous">${echapper(sousLigne(c))}</span></span>${ui.icone('chevron-droite')}</button></li>`).join('')
      + `<li><button type="button" class="creer-contact creer-contact--inviter" data-action="creer-inviter" data-pour="qui">`
      + `<span class="creer-contact-plus" aria-hidden="true">${ui.icone('plus')}</span>`
      + `<span class="creer-contact-texte"><span class="creer-contact-nom">Inviter un proche</span></span>${ui.icone('chevron-droite')}</button></li>`;
  }
  // La recherche filtre aussi le répertoire importé.
  function listeRepertoire() {
    if (!repertoire) return ui.bouton('Importer depuis mon répertoire', { action: 'creer-repertoire', variante: 'secondaire' });
    const q = sansAccent(recherche);
    const lignes = REPERTOIRE.map(r => (r.contact ? Object.assign({ sur: true }, modele.personne(r.contact)) : r))
      .filter(x => x.prenom && (!q || sansAccent(`${x.prenom} ${x.nom}`).includes(q)));
    const ligne = x => (x.sur
      ? `<li><button type="button" class="creer-contact" data-action="creer-choisir" data-contact="${echapper(x.id)}">${ui.avatar(x, { taille: 'm' })}`
        + `<span class="creer-contact-texte"><span class="creer-contact-nom">${echapper(modele.nomComplet(x.id))}${ui.certifie(x)}</span>`
        + `<span class="creer-contact-sous">Sur TilliT</span></span>${ui.icone('chevron-droite')}</button></li>`
      : `<li class="creer-contact creer-contact--repertoire">${ui.avatar(x, { taille: 'm' })}`
        + `<span class="creer-contact-texte"><span class="creer-contact-nom">${echapper(`${x.prenom} ${x.nom}`)}</span><span class="creer-contact-sous">Pas encore sur TilliT</span></span>`
        + ui.bouton('Inviter', { action: 'creer-inviter', params: { pour: 'qui', prenom: x.prenom, adresse: x.tel }, variante: 'secondaire', pleine: false, aria: `Inviter ${x.prenom}` }) + '</li>');
    return '<h2 class="creer-intertitre" id="creer-repertoire-titre">Ton répertoire</h2>'
      + (lignes.length ? `<ul class="creer-liste" aria-labelledby="creer-repertoire-titre">${lignes.map(ligne).join('')}</ul>`
        : '<p class="creer-repertoire-vide">Personne de ton répertoire ne correspond.</p>');
  }
  E['creer-qui'] = {
    rendu: (etat, params) => {
      const role = roleDe(params);
      return entete('creer-qui')
        + '<h1 class="titre">Avec qui ?</h1>'
        + `<p class="sous-titre">${selonRole(role, 'Choisis la personne à qui tu prêtes.', 'Choisis la personne à qui tu demandes.')}</p>`
        + ui.champ({ id: 'creer-recherche', libelle: 'Rechercher un contact', type: 'search', valeur: recherche, saisie: 'creer-recherche' })
        + `<ul class="creer-liste" id="creer-liste">${listeContacts()}</ul>`
        + `<div class="creer-repertoire" id="creer-repertoire">${listeRepertoire()}</div>`
        + ui.bulle("Ton proche recevra la proposition et pourra l'accepter, la refuser ou proposer autre chose. Rien n'est validé sans lui.", { pose: 'proposition' });
    },
    // Nouvelle création : on repart d'un écran propre.
    arrivee: () => {
      tiersOuvert = false;
      if (!recherche) return;
      recherche = '';
      const champ = document.getElementById('creer-recherche');
      if (champ) champ.value = '';
      ui.majZone('creer-liste', listeContacts());
      ui.majZone('creer-repertoire', listeRepertoire());
    }
  };
  S['creer-recherche'] = el => { recherche = el.value; ui.majZone('creer-liste', listeContacts()); ui.majZone('creer-repertoire', listeRepertoire()); };
  // Demande d'accès simulée, neutre : la feuille de TilliT, pas l'écran du téléphone.
  A['creer-repertoire'] = () => {
    ui.feuille.ouvrir('<p class="creer-simulation">Simulation</p>'
      + `<p>${ins("Ici, ton téléphone te demanderait si TilliT peut lire tes contacts. Dans ce prototype, aucun contact réel n'est lu : la liste est fictive.")}</p>`
      + '<div class="pile-reponses">' + ui.bouton('Autoriser', { action: 'creer-repertoire-oui' })
      + ui.bouton('Pas maintenant', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>',
      { titre: 'Accès à ton répertoire' });
  };
  A['creer-repertoire-oui'] = () => { repertoire = true; ui.feuille.fermer(); ui.majZone('creer-repertoire', listeRepertoire()); };
  A['creer-choisir'] = (el, etat, params) => {
    const r = creerBrouillon(roleDe(params), el.dataset.contact);
    if (r.ok) routeur.aller('creer-montant');
  };

  /* ---------- Feuille « Inviter un proche » (aussi pour le tiers de confiance) ---------- */
  A['creer-inviter'] = el => {
    canal = 'whatsapp';
    ui.feuille.ouvrir(
      ui.champ({ id: 'creer-inv-prenom', libelle: 'Prénom', maxlength: 60, valeur: el.dataset.prenom || '' })
      + ui.champ({ id: 'creer-inv-adresse', libelle: 'Numéro de téléphone ou e-mail', maxlength: 120, valeur: el.dataset.adresse || '' })
      + ui.pastilles({ options: [{ valeur: 'whatsapp', libelle: 'WhatsApp' }, { valeur: 'email', libelle: 'E-mail' }],
                       valeur: canal, action: 'creer-inv-canal', libelle: "Canal de l'invitation" })
      + `<p class="champ-aide">L'invitation partira avec ta proposition, quand tu l'enverras.</p>`
      + ui.bouton('Ajouter', { action: 'creer-inv-ajouter', params: { pour: el.dataset.pour } }),
      { titre: 'Inviter un proche' });
  };
  A['creer-inv-canal'] = el => {
    canal = el.dataset.valeur === 'email' ? 'email' : 'whatsapp';
    el.parentElement.querySelectorAll('.pastille').forEach(b => b.setAttribute('aria-pressed', String(b === el)));
  };
  A['creer-inv-ajouter'] = (el, etat, params) => {
    const val = id => (document.getElementById(id) || {}).value || '';
    const r = ajouterContact({ prenom: val('creer-inv-prenom'), adresse: val('creer-inv-adresse'), canal });
    if (!r.ok) return;
    if (el.dataset.pour === 'tiers') { majBrouillon({ tiersContactId: r.contactId }); ui.feuille.fermer(); return; }
    if (creerBrouillon(roleDe(params), r.contactId).ok) routeur.aller('creer-montant');
  };

  /* ---------- creer-montant : montant, devise, calendrier et formule (P-9 n° 7, 8 et 12) ---------- */
  const ligneMontant = (role, autre, montant) => ins(selonRole(role,
    `0 % d'intérêt. ${autre} te rendra exactement ${euros(montant)}.`,
    `0 % d'intérêt. Tu rendras exactement ${euros(montant)} à ${autre}.`));
  // P-9 n° 12 : l'euro est choisi, les autres devises se voient et attendent. Aucune conversion.
  const DEVISES = [{ code: 'EUR', libelle: '€ EUR' }, { code: 'USD', libelle: '$ USD' },
    { code: 'GBP', libelle: '£ GBP' }, { code: 'CHF', libelle: 'CHF' }, { code: 'MAD', libelle: 'MAD' }];
  const htmlDevises = () => '<div class="creer-devises" role="group" aria-label="Devise">' + DEVISES.map(d => d.code === 'EUR'
    ? `<button type="button" class="pastille creer-devise" aria-pressed="true">${echapper(d.libelle)}</button>`
    : `<button type="button" class="pastille creer-devise creer-devise--bientot" aria-pressed="false" disabled>`
      + `${echapper(d.libelle)}<span class="creer-devise-bientot">bientôt</span></button>`).join('')
    + '<p class="creer-devises-note">Les prêts se font en euros. Les autres devises arrivent.</p></div>';
  // Ce que Zen apporte, deux lignes au plus (P-9 n° 8).
  const zenTexte = (role, autre, montant) => `<p>${ins('Une reconnaissance de dette signée par vous deux, conservée en sécurité.')}</p>`
    + `<p>${ins(selonRole(role, `Le prêt reste à 0 % : ${autre} te rendra exactement ${euros(montant)}.`,
      `Le prêt reste à 0 % : tu rendras exactement ${euros(montant)} à ${autre}.`))}</p>`;
  ecranBrouillon('creer-montant', (etat, params, p) => {
    const role = modele.role(p), autre = autreHtml(p);
    const ligne = `<p class="creer-ligne-montant" id="creer-ligne-montant">${ligneMontant(role, autre, p.termes.montant)}</p>`;
    const bloc = ui.blocTermes({
      id: 'creer-bt', termes: p.termes, role, autreId: modele.autre(p), pretId: p.id,
      apresMontant: ligne + htmlDevises(), avecFormule: true, zenTexte: zenTexte(role, autre, p.termes.montant),
      surChangement: (t, v) => {
        // ui.blocTermes impose Zen au-delà de 1 500 € et rend la formule choisie si le montant redescend.
        majBrouillon(t);
        ui.majZone('creer-ligne-montant', ligneMontant(role, autre, t.montant));
        const b = document.getElementById('creer-continuer');
        if (b) b.disabled = !v.valide;
      }
    });
    return entete('creer-montant')
      + `<h1 class="titre">${ins(selonRole(role, `Combien tu prêtes à ${autre} ?`, `Combien tu demandes à ${autre} ?`))}</h1>`
      + `<p class="sous-titre">${selonRole(role, `Dis combien, et comment ${autre} te rembourse.`, 'Dis combien, et comment tu rembourses.')}</p>`
      + bloc
      + ui.bouton('Découvrir Zen', { action: 'aller', params: { route: 'zen-decouvrir' }, variante: 'discret', classe: 'btn--centre' })
      + ui.bouton('Continuer', { action: 'creer-suivant', id: 'creer-continuer', params: { suite: 'creer-details' }, desactive: !verdict(p).valide });
  });
  // Les interrupteurs Zen et payeur du bloc des termes (ui.js) écrivent dans le brouillon par surChangement.

  /* ---------- creer-details ---------- */
  // Le motif tient dans termes.motif : « {pastille} · {précision} », ou l'un des deux.
  const ecrireMotif = (pastille, precision) => [pastille, String(precision || '').trim()].filter(Boolean).join(' · ') || null;
  function lireMotif(m) {
    if (!m) return { pastille: null, precision: '' };
    const pa = MOTIFS.find(x => m === x || m.startsWith(x + ' · '));
    return pa ? { pastille: pa, precision: m.slice(pa.length + 3) } : { pastille: null, precision: m };
  }
  ecranBrouillon('creer-details', (etat, params, p) => {
    const motif = lireMotif(p.termes.motif);
    const autreId = modele.autre(p), tiersId = p.termes.tiersContactId;
    const ouvert = tiersOuvert || !!tiersId;
    let h = entete('creer-details')
      + `<h1 class="titre">${ins('Un motif, un tiers de confiance ?')}</h1>`
      + '<p class="sous-titre">Les deux sont facultatifs.</p>'
      + `<h2 class="creer-h2">${ins("C'est pour quoi ?")}</h2>`
      + ui.pastilles({ options: MOTIFS.map(m => ({ valeur: m, libelle: m })), valeur: motif.pastille, action: 'creer-motif', libelle: ins("C'est pour quoi ?") })
      + ui.champ({ id: 'creer-precision', libelle: 'Précise si tu veux', valeur: motif.precision, exemple: 'Embrayage à changer',
                   saisie: 'creer-precision', maxlength: 80, aide: 'Vous vous en souviendrez tous les deux dans six mois.' })
      + '<div class="creer-tiers">'
      + ui.interrupteur({ id: 'creer-tiers', libelle: 'Ajouter un tiers de confiance', coche: ouvert, saisie: 'creer-tiers',
                          aide: 'Une personne de confiance, choisie à deux. Si un jour vous avez besoin de reprendre la discussion, TilliT peut la prévenir.' });
    if (ouvert) {
      const candidats = modele.lire().contacts.filter(c => c.id !== autreId);
      h += ui.pastilles({ options: candidats.map(c => ({ valeur: c.id, libelle: c.prenom })), valeur: tiersId, action: 'creer-tiers-choix', libelle: 'Tiers de confiance' })
        + ui.bouton("Inviter quelqu'un", { action: 'creer-inviter', params: { pour: 'tiers' }, variante: 'secondaire', pleine: false, icone: 'plus' })
        + (tiersId ? `<p class="creer-tiers-ligne">${echapper(modele.prenom(tiersId))} recevra une invitation et devra l'accepter.</p>` : '');
    }
    return h + '</div>'
      + ui.bouton('Continuer', { action: 'creer-suivant', params: { suite: 'creer-verifier' } })
      + ui.bouton('Passer', { action: 'creer-suivant', params: { suite: 'creer-verifier' }, variante: 'discret', classe: 'btn--centre' });
  });
  // Une seule pastille à la fois ; la toucher de nouveau la retire. Rien ne change d'écran.
  A['creer-motif'] = el => {
    const p = modele.brouillon();
    if (!p) return;
    const actuel = lireMotif(p.termes.motif);
    const champ = document.getElementById('creer-precision');
    majBrouillon({ motif: ecrireMotif(actuel.pastille === el.dataset.valeur ? null : el.dataset.valeur, champ ? champ.value : actuel.precision) });
  };
  S['creer-precision'] = el => {
    const p = modele.brouillon();
    if (p) majBrouillon({ motif: ecrireMotif(lireMotif(p.termes.motif).pastille, el.value) });
  };
  S['creer-tiers'] = el => {
    tiersOuvert = el.checked;
    const p = modele.brouillon();
    if (!el.checked && p && p.termes.tiersContactId) majBrouillon({ tiersContactId: null });
    routeur.rafraichir();
  };
  A['creer-tiers-choix'] = el => {
    const p = modele.brouillon();
    if (p) majBrouillon({ tiersContactId: p.termes.tiersContactId === el.dataset.valeur ? null : el.dataset.valeur });
  };

  /* ---------- Seuil des impôts (décision P-8 n° 2) ---------- */
  // Cumul de l'année civile entre les deux mêmes personnes, ce prêt compris (calculs.cumulEntreProches).
  function cumulDepasse(p) {
    const autre = modele.autre(p);
    if (!autre) return false;
    return calculs.cumulEntreProches(modele.lire(), 'moi', autre, p.termes.montant || 0,
                                     modele.aujourdhui().slice(0, 4), p.id).depasse;
  }
  // Guide ouvert par « Comment ça se passe » (ui.encartCumul), ici et à l'acceptation (lot D).
  // Rien de plus que ce que dit l'encart : le reste attend la relecture juridique.
  E['guide-impots'] = () => ui.enteteRetour({})
    + '<h1 class="titre">Déclarer un prêt aux impôts</h1>'
    + `<p class="creer-texte">${ins("Au-delà de 5 000 € prêtés à la même personne dans l'année, le prêt se déclare aux impôts (formulaire 2062).")}</p>`
    + `<p class="creer-texte">${ins("C'est à vous deux de le faire, TilliT ne déclare rien.")}</p>`
    + '<p class="creer-texte">Le reste de ce guide est en préparation.</p>';

  /* ---------- creer-verifier, 2/3 ---------- */
  ecranBrouillon('creer-verifier', (etat, params, p) => {
    const role = modele.role(p), autre = autreHtml(p), t = p.termes, v = verdict(p);
    const dates = v.echeances || [];
    const changer = (route, quoi) => ui.bouton('Changer', { action: 'creer-changer', params: { suite: route }, variante: 'discret', aria: `Changer ${quoi}`, classe: 'creer-changer' });
    const ligne = (libelle, valeur, route, quoi, o) => [libelle, ui.brut(`<span>${valeur}</span>${route ? changer(route, quoi) : ''}`), o];
    const zen = t.formule === 'zen';
    const lignes = [
      ligne('Montant', euros(t.montant), 'creer-montant', 'le montant'),
      ligne('Remboursement', remboursement(v), 'creer-montant', 'le remboursement'),
      ligne('Première échéance', dates[0] ? date(dates[0].date) : '', 'creer-montant', 'la première échéance'),
      ligne('Dernière échéance', dates.length ? date(dates[dates.length - 1].date) : '', 'creer-montant', 'la dernière échéance'),
      ['Intérêts', '0 %'],
      ['Remboursement en avance', 'Sans frais'],
      ligne('Formule', zen ? `TilliT Zen · ${euros(calculs.prixZen(t.montant) || 0)}` : 'TilliT Note · sans frais', 'creer-montant', 'la formule'),
      zen && ligne('Qui paie Zen', t.payeurZenId === 'moi' ? 'Toi' : autre, 'creer-montant', 'qui paie Zen', { corail: true }),
      ligne('Tiers de confiance', t.tiersContactId ? echapper(modele.prenom(t.tiersContactId)) : 'Aucun', 'creer-details', 'le tiers de confiance')
    ];
    return entete('creer-verifier')
      + `<h1 class="titre">${ins('On relit ensemble ?')}</h1>`
      + ui.carte(`<div class="creer-recap-tete">${ui.avatar(modele.autre(p), { taille: 'm' })}<div>`
        + `<p class="creer-recap-qui">${selonRole(role, `Tu prêtes à ${autre}`, `Tu demandes à ${autre}`)}</p>`
        + (t.motif ? `<p class="creer-recap-motif">${echapper(t.motif)}</p>` : '') + '</div></div>'
        + ui.lignesRecap(lignes, { classe: 'creer-recap' }))
      + (cumulDepasse(p) ? ui.encartCumul() : '')
      + `<p class="creer-texte">${selonRole(role, `Tu verseras l'argent directement à ${autre}, par virement ou en espèces. TilliT ne touche pas aux fonds.`,
                          `${autre} te versera l'argent directement, par virement ou en espèces. TilliT ne touche pas aux fonds.`)}</p>`
      + ui.bouton('Continuer', { action: 'creer-suivant', params: { suite: 'creer-envoyer' }, desactive: !v.valide });
  });

  /* ---------- creer-envoyer, 3/3 ---------- */
  ecranBrouillon('creer-envoyer', (etat, params, p) => {
    const role = modele.role(p), autre = autreHtml(p), c = modele.personne(modele.autre(p)) || {};
    let h = entete('creer-envoyer') + '<h1 class="titre">Tout est prêt.</h1>';
    if (!c.surTilliT) {
      const parEmail = c.invitation && c.invitation.canal === 'email';
      h += ui.carte('<p class="creer-apercu-titre">Aperçu du message</p>'
        + `<p class="creer-apercu-texte">${TEXTES_HORS_NOTIF.invitation(role, { moi: echapper(etat.moi.prenom) })}</p>`
        + '<p class="creer-apercu-lien">Voir la proposition</p>'
        + `<p class="creer-apercu-canal">${parEmail ? 'Envoyé par e-mail' : 'Envoyé par WhatsApp'}</p>`, { classe: 'creer-apercu' });
    } else h += `<p class="creer-texte">${autre} recevra une notification dans TilliT.</p>`;
    return h + '<p class="creer-texte">Rien ne démarre avant votre accord à tous les deux.</p>'
      + ui.bouton('Envoyer la proposition', { action: 'creer-envoyer', desactive: !verdict(p).valide });
  });
  A['creer-envoyer'] = () => {
    const p = modele.brouillon();
    if (!p) return;
    const r = envoyerProposition(p.id);
    if (r.ok) routeur.aller('creer-envoye', { pretId: p.id }, { racine: true });
  };

  /* ---------- creer-envoye ---------- */
  E['creer-envoye'] = {
    rendu: (etat, params) => {
      const p = modele.pret(params.pretId);
      if (!p) return '';
      const v = modele.derniereVersion(p);
      const attend = (p.statut === 'propose' || p.statut === 'negociation') && v && v.auteurId === 'moi' && v.statut === 'en_attente';
      return '<div class="creer-envoye">'
        + `<div class="creer-pastille anim-pop">${ui.icone('coche', { taille: 30 })}</div>`
        + ui.mascotte('envoi', { taille: 'moyenne' })
        + '<h1 class="titre">C\'est envoyé.</h1>'
        + `<p>${autreHtml(p)} pourra accepter, refuser ou proposer autre chose. Rien ne démarre avant votre accord à tous les deux.</p>`
        + ui.carte(`${ui.avatar(modele.autre(p), { taille: 'm' })}<span class="creer-envoye-nom">${autreHtml(p)}</span>`
          + (attend ? '<span class="creer-envoye-etat">En attente de sa réponse</span>' : ui.pucePret(p)), { classe: 'creer-envoye-carte' })
        + ui.bouton("Revenir à l'accueil", { action: 'onglet', params: { route: 'accueil' } })
        + '</div>';
    },
    arrivee: params => { if (!modele.pret(params.pretId)) routeur.aller('accueil', {}, { racine: true }); }
  };
})();
