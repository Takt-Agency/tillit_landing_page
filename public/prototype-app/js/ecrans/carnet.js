/* ==========================================================================
   TilliT prototype · lot I · Carnet de prêt, gamification, profil, réglages
   Spec : 09-carnet-gamification-profil.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot I. N'écris que dans ce fichier et dans la
   section « lot I » de css/ecrans.css.

   Routes : carnet et profil (remplacent les écrans provisoires), carnet-proche, carnet-demande-recue, recompenses, reglages, documents, coordonnees, aide,
            carnet-palier (célébration d'un palier, params { pretId, palier })
   Action offerte au lot D : carnet-demander (data-pret-id) ouvre la feuille « Demander à voir le Carnet de {autre} ? ».
   API utile : demanderCarnet, repondreCarnet, majReglages, choisirTitre, debloquerRecompense, marquerPalierFete, seDeconnecter, modele.carnet, modele.series, calculs.PALIERS
   Décision 2 : modele.carnet() rend aussi clotureResteOffert (ligne neutre « Clôturés, reste offert »). Se déconnecter : seDeconnecter() puis routeur.aller('compte-creer', {}, { racine: true }).
   ========================================================================== */
(function () {
  'use strict';
  const { date, echapper, moisAnnee, insecables, euros } = textes;
  const E = window.ecrans, A = window.actions, S = window.saisies;
  // Texte fixe ou déjà composé : espaces insécables de la typographie française, puis échappement.
  const t = s => echapper(insecables(s));
  const accord = (n, sing, plur) => (n > 1 ? plur : sing);

  /* ---------- Carnet de prêt : tableau des faits et liste « En cours » ---------- */
  // Décision 2 du coordinateur : « Clôturés, reste offert » est une ligne neutre, hors « Non remboursés ».
  const LIGNES_CARNET = [['Au total', 'total'], ['Remboursés', 'rembourses'], ['Non remboursés', 'nonRembourses'],
                         ['Clôturés, reste offert', 'clotureResteOffert'], ['En cours', 'enCours']];
  function tableauCarnet(c) {
    return '<table class="carnet-tableau"><caption class="visuellement-cache">Prêts reçus et accordés</caption>'
      + '<thead><tr><td></td><th scope="col">Reçus</th><th scope="col">Accordés</th></tr></thead><tbody>'
      + LIGNES_CARNET.map(([libelle, cle]) => `<tr${cle === 'total' ? ' class="carnet-tableau-total"' : ''}>`
        + `<th scope="row">${t(libelle)}</th><td>${c.recus[cle]}</td><td>${c.accordes[cle]}</td></tr>`).join('')
      + '</tbody></table>';
  }
  const texteEnCours = x => `${x.sens === 'recu' ? 'Prêt reçu' : 'Prêt accordé'} · ${x.k} ${accord(x.k, 'échéance', 'échéances')} sur ${x.n}`;
  // liens : dans son propre Carnet, chaque ligne ouvre l'historique du prêt (le testeur en fait partie).
  // Dans le Carnet d'un proche : ni nom ni lien [D-41].
  function listeEnCours(c, liens) {
    if (!c.enCoursListe.length) return '';
    return '<h2 class="carnet-intertitre">En cours</h2><ul class="carnet-liste">' + c.enCoursListe.map(x => (liens
      ? `<li><button type="button" class="carnet-ligne" data-action="aller" data-route="historique" data-pret-id="${echapper(x.pretId)}">`
        + `<span>${t(texteEnCours(x))}</span>${ui.icone('chevron-droite')}</button></li>`
      : `<li class="carnet-ligne carnet-ligne--fixe">${t(texteEnCours(x))}</li>`)).join('') + '</ul>';
  }

  /* ---------- carnet (onglet « Carnet ») [C-60, D-41, G-33, S-09] ---------- */
  const AIDE_PARTAGE = "Un proche ne peut le voir que pendant une négociation de prêt entre vous. S'il est masqué, il peut te demander à le voir, et tu choisis.";
  E.carnet = etat => {
    const c = modele.carnet();
    const auto = etat.moi.reglages.carnetPartageAuto;
    return '<p class="surtitre carnet-surtitre">Carnet de prêt</p>'
      + `<h1 class="titre">${t('Ce que tu as fait, pas ce que tu vaux.')}</h1>`
      + `<p class="sous-titre">${t('Tu choisis à qui le montrer.')}</p>`
      + ui.carte(`<p class="carnet-visibilite">${ui.puce(auto ? 'Montré pendant les négociations' : 'Masqué', auto ? 'actif' : 'fin')}</p>`
        + ui.interrupteur({ id: 'carnet-partage', libelle: 'Le montrer automatiquement quand un proche négocie un prêt avec moi',
                            coche: auto, saisie: 'carnet-partage', aide: ui.brut(t(AIDE_PARTAGE)) }))
      + ui.carte(tableauCarnet(c))
      + listeEnCours(c, true)
      + `<p class="carnet-trace">${t('Chaque prêt remboursé laisse une trace dans ton Carnet de prêt.')}</p>`;
  };
  // Même réglage dans le Carnet et dans « Rappels et notifications ».
  S['carnet-partage'] = el => { const r = majReglages({ carnetPartageAuto: el.checked }); if (r.ok) routeur.rafraichir(); };

  /* ---------- carnet-proche [D-41] ---------- */
  // Visible seulement pendant une négociation où le testeur prête, et si l'autre a accepté la demande.
  // Les proches simulés n'ont pas de réglage de partage automatique dans l'état : seule la demande acceptée ouvre l'écran.
  function carnetProcheVisible(p) {
    return !!p && (p.statut === 'propose' || p.statut === 'negociation') && modele.role(p) === 'preteur'
      && p.carnet.demandeVoir === 'acceptee';
  }
  E['carnet-proche'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    const autreId = p ? modele.autre(p) : null;
    const titre = `Carnet de prêt${autreId ? ` de ${modele.prenom(autreId)}` : ''}`;
    if (!carnetProcheVisible(p)) {
      return ui.enteteRetour({}) + `<h1 class="titre">${t(titre)}${autreId ? ui.certifie(autreId) : ''}</h1>`
        + `<p class="sous-titre">${t('Un proche ne peut le voir que pendant une négociation de prêt entre vous.')}</p>`;
    }
    const c = modele.carnet(autreId);
    return ui.enteteRetour({}) + `<h1 class="titre">${t(titre)}${ui.certifie(autreId)}</h1>`
      + ui.carte(tableauCarnet(c)) + listeEnCours(c, false)
      + `<p class="carnet-trace">${t('Tu le vois parce que vous négociez un prêt ensemble.')}</p>`;
  };

  /* ---------- Demander à voir le Carnet (côté prêteur, depuis proposition-recue du lot D) ---------- */
  A['carnet-demander'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p) return;
    const autre = modele.prenom(modele.autre(p));
    ui.feuille.ouvrir(`<p>${t(`${autre} choisit de te le montrer ou non.`)}</p><div class="pile-reponses">`
      + ui.bouton('Demander', { action: 'carnet-demander-oui', params: { pretId: p.id } }) + '</div>',
      { titre: insecables(`Demander à voir le Carnet de ${autre} ?`) });
  };
  A['carnet-demander-oui'] = el => { const r = demanderCarnet(el.dataset.pretId); if (r.ok) ui.feuille.fermer(); };

  /* ---------- carnet-demande-recue (côté emprunteur, depuis la notification ou l'accueil) ---------- */
  // Écran plutôt que feuille : la notification carnet_demande ouvre une route (notifications-textes.js).
  E['carnet-demande-recue'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return ui.enteteRetour({ type: 'croix' });
    const autre = modele.prenom(modele.autre(p));
    const enAttente = p.carnet.demandeVoir === 'en_attente' && modele.role(p) === 'emprunteur';
    return ui.enteteRetour({ type: 'croix' })
      + `<h1 class="titre">${t(`${autre} demande à voir ton Carnet de prêt.`)}</h1>`
      + `<p class="sous-titre">${t(`${autre} verra combien de tes prêts sont remboursés, non remboursés ou en cours, et l'avancement de ceux en cours. Le détail de tes anciens prêts reste privé.`)}</p>`
      + '<div class="pile-reponses">' + (enAttente
        ? ui.bouton('Montrer mon Carnet', { action: 'carnet-montrer', params: { pretId: p.id } })
          + ui.bouton('Refuser', { action: 'carnet-refuser', variante: 'discret', params: { pretId: p.id }, classe: 'btn--centre' })
        : ui.bouton('Retour', { action: 'retour', variante: 'secondaire' })) + '</div>';
  };
  function repondre(el, oui) { const r = repondreCarnet(el.dataset.pretId, oui); if (r.ok) routeur.retour(); }
  A['carnet-montrer'] = el => repondre(el, true);
  A['carnet-refuser'] = el => repondre(el, false);

  /* ---------- Récompenses [A-46, D-65, D-70, D-72] ---------- */
  // Correspondance palier et récompense : proposition de la spec 09, à valider par Yohann.
  // Tenues : aucune illustration n'existe encore. Emojis : liste à compléter par Yohann, rien n'est inventé ici.
  // Titres : seul « Baron du remboursement » vient de Yohann ; les trois autres sont les propositions de la spec,
  // rattachées dans l'ordre aux paliers « un titre » (18, 48, 60). Conseils 3 et 4 : aucun palier prévu (91).
  const RECOMPENSES = [
    { id: 'tenue-noel', type: 'tenue', nom: 'Noël', palier: 24 },
    { id: 'tenue-halloween', type: 'tenue', nom: 'Halloween', palier: 36 },
    { id: 'tenue-plage', type: 'tenue', nom: 'Plage', palier: 12 },
    { id: 'tenue-lunettes', type: 'tenue', nom: 'Lunettes', palier: 6 },
    { id: 'emoji-1', type: 'emoji', palier: 3 },
    { id: 'titre-baron', type: 'titre', nom: 'Baron du remboursement', parfait: true },
    { id: 'titre-maitre-calendrier', type: 'titre', nom: 'Maître du calendrier', palier: 18 },
    { id: 'titre-pro-reference', type: 'titre', nom: 'Pro de la référence', palier: 48 },
    { id: 'titre-pilier-echeances', type: 'titre', nom: 'Pilier des échéances', palier: 60 },
    { id: 'conseil-1', type: 'conseil', texte: "Copie la référence dans le libellé de ton virement : l'autre s'y retrouve tout de suite.", palier: 1 },
    { id: 'conseil-2', type: 'conseil', texte: "Une date qui ne va plus ? Propose un nouveau calendrier avant l'échéance.", palier: 30 },
    { id: 'conseil-3', type: 'conseil', texte: "Déclare ton remboursement le jour où tu l'envoies.", palier: null },
    { id: 'conseil-4', type: 'conseil', texte: "Prévenir tôt, c'est déjà prendre soin de l'autre.", palier: null }
  ];
  const recompenseDuPalier = n => RECOMPENSES.find(r => r.palier === n) || null;
  const nomRecompense = r => ({ tenue: `la tenue ${r.nom} de TilliT`, emoji: 'un emoji', titre: `le titre « ${r.nom} »`, conseil: 'un conseil' })[r.type];
  // « Elles sont à toi, rien ne se perd » : débloquées = celles enregistrées, plus celles des paliers
  // atteints ou fêtés sur tous les prêts du testeur (prêteur comme emprunteur), plus « Prêt parfait ».
  function debloquees(etat) {
    const ids = new Set(etat.recompenses.debloquees);
    const auj = modele.aujourdhui();
    for (const p of etat.prets) {
      if (!modele.role(p) || p.statut === 'brouillon') continue;
      const paliers = new Set([...(p.gamification.paliersFetes || []), ...calculs.paliersAtteints(p, auj)]);
      for (const r of RECOMPENSES) if (r.palier && paliers.has(r.palier)) ids.add(r.id);
      if (p.statut === 'rembourse' && p.gamification.pretParfait) ids.add('titre-baron');
    }
    return ids;
  }
  const libelleVerrou = r => (r.parfait ? 'Avec un « Prêt parfait »'
    : r.palier === 1 ? 'Au palier du premier remboursement'
    : r.palier ? `Au palier des ${r.palier} remboursements` : 'Palier à compléter');

  function objet(r, ok, titreActif) {
    const visuel = !ok ? `<span class="carnet-objet-visuel carnet-objet-visuel--ferme">${ui.icone('cadeau', { libelle: 'Paquet cadeau fermé' })}</span>`
      : r.type === 'tenue' ? `<span class="carnet-objet-visuel carnet-objet-visuel--tenue">${ui.mascotte(r.id, { taille: 'petite' })}</span>`
      : r.type === 'emoji' ? '<span class="carnet-objet-visuel carnet-objet-visuel--a-venir">Emoji à venir</span>'
      : `<span class="carnet-objet-visuel carnet-objet-visuel--ouvert">${ui.icone(r.type === 'titre' ? 'drapeau' : 'info')}</span>`;
    const nom = r.type === 'tenue' ? `Tenue ${r.nom}` : r.type === 'emoji' ? 'Emoji' : r.type === 'titre' ? `« ${r.nom} »` : 'Conseil';
    let corps = `<span class="carnet-objet-nom">${t(nom)}</span>`;
    if (!ok) corps += `<span class="carnet-objet-sous">${t(libelleVerrou(r))}</span>`;
    else if (r.type === 'conseil') corps += `<span class="carnet-objet-conseil">${t(r.texte)}</span>`;
    else if (r.type === 'titre') {
      const choisi = titreActif === r.id;
      // Libellé fixe, l'état passe par aria-pressed (et le style de pastille choisie).
      corps += `<button type="button" class="pastille carnet-objet-choix" data-action="carnet-titre" data-id="${echapper(r.id)}" aria-pressed="${choisi}">`
        + 'Afficher dans ton profil</button>';
    }
    return `<li class="carnet-objet${ok ? '' : ' carnet-objet--ferme'}">${visuel}<span class="carnet-objet-corps">${corps}</span></li>`;
  }
  E.recompenses = etat => {
    const ok = debloquees(etat), actif = etat.recompenses.titreActif;
    const section = (titre, type) => `<h2 class="carnet-intertitre">${t(titre)}</h2><ul class="carnet-objets">`
      + RECOMPENSES.filter(r => r.type === type).map(r => objet(r, ok.has(r.id), actif)).join('') + '</ul>';
    return ui.enteteRetour({})
      + `<h1 class="titre">Tes récompenses</h1><p class="sous-titre">${t('Débloquées aux paliers de tes prêts. Elles sont à toi, rien ne se perd.')}</p>`
      + section('Tenues de TilliT', 'tenue') + section('Emojis', 'emoji') + section('Titres', 'titre') + section('Conseils', 'conseil');
  };
  // Un titre décrit ce qu'on a fait ; choisi, il s'affiche dans Profil, visible par soi seul. Retoucher le retire.
  A['carnet-titre'] = el => {
    const id = el.dataset.id, etat = modele.lire();
    if (etat.recompenses.titreActif === id) { choisirTitre(null); return; }
    if (!debloquees(etat).has(id)) return;
    if (!etat.recompenses.debloquees.includes(id)) debloquerRecompense(id);
    choisirTitre(id);
  };

  /* ---------- carnet-palier : célébration d'un palier [A-50, D-65, A-52] ---------- */
  // À ouvrir (lot G, après une confirmation) par routeur.aller('carnet-palier', { pretId, palier: modele.palierAFeter(p) }).
  // « Continuer » marque le palier fêté (une seule fois), enregistre la récompense, puis revient à l'écran d'origine.
  const libellePalier = n => (n === 1 ? 'Premier remboursement confirmé' : `${n} remboursements confirmés`);
  // La félicitation privée en pourcentage vit sur le Parcours seulement (spec 09, décision du coordinateur).
  E['carnet-palier'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    const palier = Number(params.palier) || (p ? modele.palierAFeter(p) : null);
    if (!p || !calculs.PALIERS.includes(palier)) {
      return ui.enteteRetour({}) + '<div class="pile-reponses">' + ui.bouton('Voir mes récompenses', { action: 'aller', params: { route: 'recompenses' } }) + '</div>';
    }
    const r = recompenseDuPalier(palier);
    return '<section class="carnet-fete" aria-labelledby="carnet-fete-titre">'
      + (palier === 30 ? '<p class="carnet-fete-surtitre">À mi-chemin</p>' : '')
      + ui.mascotte('celebration', { taille: 'grande', anim: 'bob' })
      + `<h1 class="carnet-fete-titre anim-pop" id="carnet-fete-titre">${t(libellePalier(palier))}</h1>`
      + (r ? `<p class="carnet-fete-texte">${t(`Vous débloquez ${nomRecompense(r)}.`)}</p>` : '')
      + ui.bouton('Continuer', { action: 'carnet-palier-continuer', variante: 'blanc', params: { pretId: p.id, palier } })
      + '</section>';
  };
  A['carnet-palier-continuer'] = el => {
    const palier = Number(el.dataset.palier), r = recompenseDuPalier(palier);
    marquerPalierFete(el.dataset.pretId, palier);
    if (r) debloquerRecompense(r.id);
    routeur.retour();
  };

  /* ---------- profil [G-31, C-58, C-59, D-38, A-49, C-75] ---------- */
  const ligneMenu = (libelle, action, params, droite = '') => `<li><button type="button" class="carnet-menu-ligne" data-action="${action}"`
    + Object.entries(params || {}).map(([k, v]) => ` data-${k}="${echapper(v)}"`).join('')
    + `><span>${t(libelle)}</span>${droite}${ui.icone('chevron-droite')}</button></li>`;
  E.profil = etat => {
    const m = etat.moi, c = modele.carnet(), s = modele.series();
    const rembourses = c.recus.rembourses + c.accordes.rembourses, enCours = c.recus.enCours + c.accordes.enCours;
    const titre = RECOMPENSES.find(r => r.id === etat.recompenses.titreActif);
    const nomComplet = [m.prenom, m.nom].filter(Boolean).join(' ');
    return '<div class="carnet-profil-entete">' + ui.avatar('moi', { taille: 'xl' })
      + `<h1 class="titre">${echapper(nomComplet)}</h1>`
      + (m.certifie ? `<p class="carnet-profil-certifie">${ui.mascotte('certifie', { taille: 'petite' })}${ui.puce('Certifié', 'ok')}</p>` : '')
      + (m.depuis ? `<p class="texte-mute">Sur TilliT depuis ${echapper(moisAnnee(m.depuis))}</p>` : '')
      + (titre ? `<p class="carnet-profil-titre">${t(titre.nom)}</p>` : '') + '</div>'
      // Carte « Carnet de prêt » : des faits, jamais de lettre [C-59].
      + `<button type="button" class="carte carnet-profil-carte" data-action="onglet" data-route="carnet">`
      + '<span class="surtitre">Carnet de prêt</span>'
      + `<span class="carnet-profil-faits"><span>${rembourses} ${accord(rembourses, 'prêt remboursé', 'prêts remboursés')}</span>`
      + `<span>${enCours} en cours</span></span>${ui.icone('chevron-droite')}</button>`
      // Séries personnelles, privées [A-49, D-79] : en échéances, jamais en jours.
      + ui.carte('<h2 class="carnet-carte-titre">Tes séries</h2><ul class="carnet-series">'
        + `<li>${t(`Ta série : ${s.emprunteur} ${accord(s.emprunteur, 'échéance', 'échéances')} à l'heure d'affilée`)}</li>`
        + `<li>${t(`Confirmations dans les temps : ${s.preteur.confirmations} d'affilée`)}</li>`
        + `<li>${t(`Prêts accompagnés jusqu'au bout : ${s.preteur.accompagnes}`)}</li></ul>`
        + '<p class="carnet-petit">Visible par toi seul.</p>')
      + '<ul class="carnet-menu">' + ligneMenu('Récompenses', 'aller', { route: 'recompenses' }) + '</ul>'
      + '<ul class="carnet-menu">'
      + ligneMenu('Ma photo de profil', 'aller', { route: 'compte-avatar', depuis: 'profil' })
      + ligneMenu('Revoir le tutoriel', 'aller', { route: 'tutoriel', revoir: '1' })
      + ligneMenu('Rappels et notifications', 'aller', { route: 'reglages' })
      + ligneMenu('Mes documents', 'aller', { route: 'documents' })
      + ligneMenu('Mes coordonnées', 'aller', { route: 'coordonnees' })
      + ligneMenu('Aide et contact', 'aller', { route: 'aide' })
      + (m.creditZen > 0 ? `<li class="carnet-menu-ligne carnet-menu-ligne--fixe">${t(`Crédit Zen : ${euros(m.creditZen)}`)}</li>` : '')
      + ligneMenu('Donner mon avis', 'aller', { route: 'questionnaire' }, etat.questionnaire.envoye ? ui.puce('Avis envoyé', 'ok') : '')
      + ligneMenu('Outils du test', 'aller', { route: 'simulation-outils' })
      + `<li><button type="button" class="carnet-menu-ligne carnet-menu-ligne--sortie" data-action="carnet-deconnecter">${ui.icone('sortie')}<span>Se déconnecter</span></button></li>`
      + '</ul>'
      // Qualification à faire valider par l'avocat (91).
      + `<p class="carnet-mention">${t("TilliT n'est ni une banque, ni un organisme de crédit, ni un établissement de paiement, ni un service de recouvrement. Les fonds ne transitent jamais par TilliT.")}</p>`;
  };

  // Se déconnecter (spec 01) : feuille, puis remise à zéro et compte-creer.
  A['carnet-deconnecter'] = () => ui.feuille.ouvrir(
    `<p>${t('Dans ce prototype, tout est remis à zéro : ton compte, tes prêts et tes notifications.')}</p><div class="pile-reponses">`
    + ui.bouton('Se déconnecter', { action: 'carnet-deconnecter-oui' })
    + ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>',
    { titre: insecables('Se déconnecter ?') });
  A['carnet-deconnecter-oui'] = () => { seDeconnecter(); routeur.aller('compte-creer', {}, { racine: true }); };

  /* ---------- reglages [G-32, C-61, D-62, D-26] ---------- */
  const JOURS = [[-5, '5 jours avant'], [-1, 'La veille'], [0, 'Le jour même'], [3, '3 jours après'], [5, '5 jours après'], [7, '7 jours après']];
  const RACCOURCIS = { classique: [-5, 0, 3, 5, 7], leger: [-1, 0, 5, 7] };   // « Léger » : exemple de Yohann
  const memesJours = (a, b) => a.length === b.length && a.every(j => b.includes(j));
  E.reglages = etat => {
    const r = etat.moi.reglages;
    const raccourci = Object.keys(RACCOURCIS).find(k => memesJours(r.joursRappel, RACCOURCIS[k])) || null;
    const notif = (cle, libelle) => ui.interrupteur({ id: `carnet-notif-${cle}`, libelle, coche: r.notif[cle], saisie: 'carnet-notif' });
    return ui.enteteRetour({})
      + '<h1 class="titre">Rappels et notifications</h1>'
      + ui.bulle('TilliT envoie tes rappels les jours que tu choisis.', { pose: 'relance-douce' })
      + '<section class="carnet-section" aria-labelledby="carnet-jours-titre"><h2 class="carnet-intertitre" id="carnet-jours-titre">Jours de rappel</h2>'
      + ui.pastilles({ options: JOURS.map(([v, l]) => ({ valeur: String(v), libelle: l })), valeur: r.joursRappel.map(String),
                       action: 'carnet-jour', libelle: 'Jours de rappel', multiple: true })
      + '<p class="carnet-petit" id="carnet-raccourcis">Raccourcis</p>'
      + ui.pastilles({ options: [{ valeur: 'classique', libelle: 'Classique' }, { valeur: 'leger', libelle: 'Léger' }], valeur: raccourci,
                       action: 'carnet-raccourci', libelle: 'Raccourcis' }) + '</section>'
      + '<section class="carnet-section" aria-labelledby="carnet-notif-titre"><h2 class="carnet-intertitre" id="carnet-notif-titre">Notifications</h2>'
      + notif('echeance', 'Échéance à venir') + notif('remboursement', 'Remboursement reçu') + notif('proposition', 'Nouvelle proposition') + '</section>'
      + '<section class="carnet-section" aria-labelledby="carnet-partage-titre"><h2 class="carnet-intertitre" id="carnet-partage-titre">Carnet de prêt</h2>'
      + ui.interrupteur({ id: 'carnet-partage-reglages', libelle: 'Montrer mon Carnet automatiquement pendant une négociation',
                          coche: r.carnetPartageAuto, saisie: 'carnet-partage' }) + '</section>'
      + '<section class="carnet-section" aria-labelledby="carnet-ton-titre"><h2 class="carnet-intertitre" id="carnet-ton-titre">Ton et langue</h2>'
      + ui.lignesRecap([['Langue', 'Français'], ['On se dit', 'tu']]) + '</section>';
  };
  A['carnet-jour'] = el => {
    const j = Number(el.dataset.valeur), jours = modele.lire().moi.reglages.joursRappel;
    majReglages({ joursRappel: jours.includes(j) ? jours.filter(x => x !== j) : [...jours, j] });
  };
  A['carnet-raccourci'] = el => { if (RACCOURCIS[el.dataset.valeur]) majReglages({ joursRappel: RACCOURCIS[el.dataset.valeur] }); };
  S['carnet-notif'] = el => majReglages({ notif: { [el.id.replace('carnet-notif-', '')]: el.checked } });

  /* ---------- documents [C-62] ---------- */
  E.documents = () => {
    const docs = modele.prets().filter(p => p.zen && p.zen.signatures[p.preteurId] && p.zen.signatures[p.emprunteurId]);
    const signee = p => [p.zen.signatures[p.preteurId], p.zen.signatures[p.emprunteurId]].sort().pop();
    return ui.enteteRetour({}) + '<h1 class="titre">Mes documents</h1>' + (docs.length
      ? '<ul class="carnet-menu">' + docs.map(p => ligneMenu(`${modele.prenom(modele.autre(p))} · ${euros(p.termes.montant)} · signée le ${date(signee(p))}`,
          'aller', { route: 'document-apercu', 'pret-id': p.id })).join('') + '</ul>'
      : `<p class="sous-titre">${t('Aucun document pour l\'instant. Les reconnaissances de dette Zen signées apparaîtront ici.')}</p>`);
  };

  /* ---------- coordonnees [A-34] ---------- */
  E.coordonnees = etat => {
    const m = etat.moi;
    return ui.enteteRetour({}) + '<h1 class="titre">Mes coordonnées</h1>'
      + ui.carte(ui.lignesRecap([['Prénom', m.prenom || ''], ['Nom', m.nom || ''], ['E-mail', m.email || ''],
        ['Mode de connexion', m.moyenCompte === 'france_identite' ? 'France Identité' : 'E-mail']])
        + (m.certifie ? `<p class="carnet-badge">${ui.puce('Certifié', 'ok')}</p>` : ''));
  };

  /* ---------- aide [A-34] ---------- */
  // Adresse : réception à vérifier (91).
  E.aide = () => ui.enteteRetour({}) + ui.mascotte('aide', { taille: 'moyenne' }) + '<h1 class="titre">Aide et contact</h1>'
    + `<p class="sous-titre">${t('Une question ? Écris-nous.')}</p>`
    + '<p class="carnet-adresse"><a href="mailto:tillit@tillitapp.fr">tillit@tillitapp.fr</a></p>'
    + '<ul class="carnet-menu">' + ligneMenu('Si un jour ça coince', 'aller', { route: 'guide-coince' }) + '</ul>';
})();
