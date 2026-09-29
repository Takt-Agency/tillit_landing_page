/* ==========================================================================
   TilliT prototype · lot B · Accueil, cloche, en-tête
   Spec : 02-accueil-navigation.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot B. N'écris que dans ce fichier et dans la
   section « lot B » de css/ecrans.css.

   Routes : accueil et notifications (remplacent les écrans provisoires). L'en-tête, la barre et la feuille « Nouveau prêt » sont au lot 0.
   API utile : modele.prets, modele.puce / ui.pucePret, modele.reste, modele.flamme, marquerLue, marquerToutesLues, simulerScenarios, confirmerVersement, pasEncoreVersement, confirmerRemboursement, rienVu, repondreCarnet
   Bulle de la mascotte : TEXTES_HORS_NOTIF.bulleRappel et calculs.rappelsDuJour(pret, date, [-5, 0, 3, 5, 7], rôle de l'autre).
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, delai, echapper, pluriel, NBSP } = textes;
  const E = ecrans, A = actions;
  const TERMINES = ['rembourse', 'cloture', 'annule', 'refuse', 'retire', 'expire'];
  const EN_NEGOCIATION = ['propose', 'negociation'];
  const VISIBLES = 3;          // cartes « À faire » montrées avant « Tout voir »
  const DUREE_NOTE = 1800;     // « C'est noté. » reste 1,8 s dans la carte, puis la carte disparaît

  // Choix d'affichage de l'accueil (face, filtre, dépliés) : gardés ici, jamais dans l'état du prototype.
  const vue = { face: null, filtre: 'tous', toutVoir: false, termines: { preteur: false, emprunteur: false } };
  let notes = [];              // cartes « C'est noté. » : { cle, rang, autreId, jusqua }
  let dernierGlisse = 0;       // un glissé horizontal n'ouvre pas la carte sous le doigt

  const parDate = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  // Termes montrés : la dernière version tant qu'on négocie, sinon les termes du prêt.
  const termesAffiches = p => ((EN_NEGOCIATION.includes(p.statut) && modele.derniereVersion(p)) || p).termes;

  /* ==========================================================================
     « À faire » [A-56, C-15, décision coordinateur 7] : une carte par action,
     faisable depuis l'accueil dès qu'elle ne demande rien à remplir.
     prio : 1 échéance passée, 2 confirmation attendue, 3 réponse attendue,
            4 paiement, signature ou envoi, 5 prochaine échéance, 6 merci.
     ========================================================================== */
  function cartesAction(p) {
    const role = modele.role(p), autreId = modele.autre(p);
    const brut = modele.prenom(autreId), autre = echapper(brut);   // brut pour ui.* (qui échappe), autre pour le HTML écrit ici
    const cartes = [];
    const carte = (type, prio, quand, texte, boutons, ligne = '', cle = `${type}:${p.id}`) =>
      cartes.push({ cle, type, prio, quand: quand || '', pretId: p.id, autreId, texte, ligne, boutons });
    const bouton = (libelle, action, params, variante = 'principal') =>
      ui.bouton(libelle, { action, params: Object.assign({ pretId: p.id }, params), variante, pleine: false, classe: 'accueil-btn' });
    const vers = (libelle, route, params = {}, variante) => bouton(libelle, 'aller', Object.assign({ route }, params), variante);

    if (modele.aMoiDeRepondre(p)) {
      const v = modele.derniereVersion(p);
      if (p.statut === 'negociation') carte('nouvelle', 3, v.date, `${autre} propose autre chose`, vers('Voir la proposition', 'proposition-recue'));
      else {
        const t = v.termes;
        carte('proposition', 3, v.date,
          role === 'emprunteur' ? `${autre} te propose un prêt de ${euros(t.montant)}` : `${autre} te demande ${euros(t.montant)}`,
          vers('Voir la proposition', 'proposition-recue'), `${t.duree} × ${euros(t.mensualite)} · ${t.formule === 'zen' ? 'Zen' : 'Note'}`);
      }
    }
    if (role === 'emprunteur' && EN_NEGOCIATION.includes(p.statut) && p.carnet && p.carnet.demandeVoir === 'en_attente') {
      const cle = `carnet:${p.id}`;
      carte('carnet', 3, '', `${autre} demande à voir ton Carnet de prêt.`,
        bouton('Montrer mon Carnet', 'accueil-carnet', { cle, reponse: 'oui' }) + bouton('Refuser', 'accueil-carnet', { cle, reponse: 'non' }, 'secondaire'));
    }
    // Zen à payer ou à signer : avant la validation, ou après un passage en Zen accepté (prêt validé ou en cours).
    if (p.zen && p.zen.payeurId === 'moi' && !p.zen.paye && ['attente_paiement_zen', 'valide', 'en_cours'].includes(p.statut))
      carte('zen', 4, '', `Accord trouvé. Il reste à payer Zen${NBSP}: ${euros(p.zen.prix)}.`, bouton('Payer Zen', 'zen-payer'));
    if (p.zen && p.zen.paye && !p.zen.signatures.moi && ['signatures', 'valide', 'en_cours'].includes(p.statut))
      carte('signer', 4, '', 'La reconnaissance de dette est prête.', vers('Signer', 'zen-document'));
    if (p.statut === 'valide' && role === 'preteur' && !p.versement)
      carte('versement', 4, p.dateValide, `Envoie ${euros(p.termes.montant)} à ${autre}, puis indique-le ici.`, vers("Indiquer que c'est parti", 'versement-declarer'));
    // Emprunteur, rien de déclaré par le prêteur : « J'ai reçu l'argent » en secondaire (spec 06, texte de la spec 07).
    if (p.statut === 'valide' && role === 'emprunteur' && !p.versement && !(p.zen && !(p.zen.signatures[p.preteurId] && p.zen.signatures[p.emprunteurId])))
      carte('versement-attendu', 4, p.dateValide, `${autre} va t'envoyer ${euros(p.termes.montant)}.`, bouton("J'ai reçu l'argent", 'versement-recu', {}, 'secondaire'));
    if (p.statut === 'valide' && role === 'emprunteur' && p.versement && !p.versement.confirmePar && !p.versement.pasEncore) {
      const cle = `versement-recu:${p.id}`;
      carte('versement-recu', 2, p.versement.date, `${autre} a envoyé ${euros(p.termes.montant)}. Tu l'as reçu${NBSP}?`,
        bouton("Oui, j'ai reçu", 'accueil-versement-oui', { cle }) + bouton('Pas encore', 'accueil-versement-pas-encore', { cle }, 'secondaire'));
    }
    if (p.statut === 'en_cours') {
      if (role === 'preteur') {
        for (const d of p.declarations) {
          if (d.type !== 'remboursement' || d.statut !== 'declaree') continue;
          const cle = `rembt:${d.id}`;
          carte('rembt', 2, d.date, `${autre} a déclaré un remboursement de ${euros(d.montant)}. Tu confirmes l'avoir reçu${NBSP}?`,
            bouton('Oui, reçu', 'accueil-rembt-oui', { cle, declId: d.id }) + bouton("Je n'ai rien vu", 'accueil-rembt-rien', { cle, declId: d.id }, 'secondaire'), '', cle);
        }
      }
      const ech = modele.echeances(p);
      const passee = ech.find(e => e.etat === 'a_declarer');
      if (passee && role === 'emprunteur') {
        carte('a-declarer', 1, passee.date, `L'échéance du ${date(passee.date)} est passée.`,
          vers("J'ai remboursé", 'remboursement-declarer') + vers('Proposer une nouvelle date', 'decaler', { numero: passee.numero }, 'secondaire'));
      } else if (passee) {
        carte('a-declarer', 1, passee.date, `L'échéance du ${date(passee.date)} est passée. ${autre} n'a rien déclaré pour l'instant.`,
          vers("J'ai reçu", 'recu-preteur') + vers(`Écrire à ${brut}`, 'fil', {}, 'secondaire'));
      } else if (role === 'emprunteur') {
        const e = ech.find(x => x.etat === 'prochaine');
        if (e) carte('prochaine', 5, e.date, `Échéance le ${date(e.date)} · ${delai(e.date)}`,
          vers("J'ai remboursé", 'remboursement-declarer') + (e.reference ? ui.boutonCopier(e.reference) : ''), `${euros(e.montant)} pour ${autre}`);
      }
      if (passee && ui.retardLong(passee)) cartes[cartes.length - 1].pose = 'refus';   // seule place de 32-refus, textes inchangés
      const chg = modele.changementEnAttente(p);
      if (chg && chg.auteurId !== 'moi' && chg.type !== 'passage_zen')
        carte('calendrier', 3, chg.date, `${autre} propose un nouveau calendrier.`, vers('Voir la proposition', 'changement-recu'));
    }
    // Demande de passage en Zen reçue (prêt validé ou en cours) : même texte que le Parcours et la notification.
    const passage = ['valide', 'en_cours'].includes(p.statut) && modele.changementEnAttente(p);
    if (passage && passage.type === 'passage_zen' && passage.auteurId !== 'moi')
      carte('passage-zen', 3, passage.date, `${autre} propose de passer le prêt en Zen.`, vers('Voir la proposition', 'changement-recu'));
    if (p.statut === 'rembourse' && role === 'emprunteur' && !(p.fin && p.fin.merci))
      carte('merci', 6, p.dateFin, `Prêt remboursé${NBSP}! Tu peux dire merci à ${autre}.`, vers('Dire merci', 'dire-merci'));
    return cartes;
  }
  const parUrgence = (a, b) => a.prio - b.prio || parDate(a.quand, b.quand);

  // Filtre « À faire » : répondre, payer, signer, confirmer, déclarer (pas une échéance à venir, pas le merci).
  function aFaire(p) {
    const chg = p.statut === 'en_cours' && modele.changementEnAttente(p);
    return cartesAction(p).some(c => c.type !== 'prochaine' && c.type !== 'merci' && c.type !== 'versement-attendu') || !!(chg && chg.auteurId !== 'moi');
  }

  const enteteCarte = (autreId, pose) => `<div class="accueil-action-haut">${ui.avatar(autreId, { taille: 's' })}<span class="accueil-action-qui">${echapper(modele.prenom(autreId))}</span>${pose ? ui.mascotte(pose, { taille: 'petite' }) : ''}</div>`;
  const htmlCarteAction = c => `<li class="accueil-action">${enteteCarte(c.autreId, c.pose)}
      <p class="accueil-action-texte">${c.texte}</p>${c.ligne ? `<p class="accueil-action-ligne">${c.ligne}</p>` : ''}
      <div class="accueil-action-boutons">${c.boutons}</div></li>`;
  const htmlNote = n => `<li class="accueil-action accueil-action--note">${n.autreId ? enteteCarte(n.autreId) : ''}
      <p class="accueil-note" role="status"><span class="accueil-note-coche anim-pop">${ui.icone('coche', { taille: 20 })}</span><span>C'est noté.</span></p></li>`;

  function htmlAFaire(cartes) {
    const maintenant = Date.now();
    const liste = cartes.map(c => ({ c }));
    for (const n of notes) {
      if (n.jusqua > maintenant && !cartes.some(c => c.cle === n.cle)) liste.splice(Math.min(n.rang, liste.length), 0, { n });
    }
    if (!liste.length) return '';
    const montrees = vue.toutVoir ? liste : liste.slice(0, VISIBLES);
    return `<section class="accueil-section" aria-labelledby="accueil-a-faire-titre">
        <h2 class="accueil-h2" id="accueil-a-faire-titre">À faire</h2>
        <ul class="accueil-actions">${montrees.map(x => (x.c ? htmlCarteAction(x.c) : htmlNote(x.n))).join('')}</ul>
        ${!vue.toutVoir && cartes.length > VISIBLES ? ui.bouton(`Tout voir (${cartes.length})`, { action: 'accueil-tout-voir', variante: 'discret', classe: 'btn--centre' }) : ''}
      </section>`;
  }

  /* ---------- Carte à deux faces [D-81, C-12] : reste à rembourser des prêts en cours ---------- */
  function htmlFaces(prets) {
    const moitie = (role, titre) => {
      const ps = prets.filter(p => p.statut === 'en_cours' && modele.role(p) === role);
      const total = ps.reduce((s, p) => s + modele.reste(p), 0);
      return `<button type="button" class="accueil-face" data-action="accueil-face" data-face="${role}" data-defiler="oui">
          <span class="accueil-face-titre">${titre}</span>
          ${ps.length ? `<span class="accueil-face-total">${euros(total)}</span><span class="accueil-face-sous">sur ${pluriel(ps.length, 'prêt', 'prêts')}</span>`
            : `<span class="accueil-face-vide">Rien pour l'instant</span>`}
        </button>`;
    };
    return `<div class="accueil-faces">${moitie('preteur', 'On te doit')}${moitie('emprunteur', 'Tu dois')}</div>`;
  }

  /* ---------- Mes prêts [G-06, G-09, C-18, A-55, C-14] : calculé depuis l'état ---------- */
  function cartePret(p) {
    const role = modele.role(p), autreId = modele.autre(p), t = termesAffiches(p);
    const f = modele.flamme(p), rembourse = modele.rembourse(p);
    // Où en est la proposition envoyée (décision P-8 n° 3), sauf si la puce le dit déjà.
    const suiviBrut = modele.suiviProposition(p), puce = modele.puce(p);
    const suivi = suiviBrut && (!puce || puce.texte !== suiviBrut.texte) ? suiviBrut : null;
    const e = p.statut === 'en_cours' ? modele.echeances(p).find(x => x.etat === 'a_declarer' || x.etat === 'prochaine') : null;
    const pct = t.montant ? Math.round(Math.min(1, rembourse / t.montant) * 100) : 0;
    const flamme = f.allumee ? `<span class="accueil-flamme${f.attenue ? ' accueil-flamme--attenue' : ''}">${ui.icone('flamme', { taille: 20 })}`
      + `<span class="visuellement-cache">Votre flamme${NBSP}: </span>${f.valeur}</span>` : '';
    return `<li><button type="button" class="accueil-pret" data-action="accueil-ouvrir" data-pret-id="${echapper(p.id)}">
        <span class="accueil-pret-haut">${ui.avatar(autreId)}
          <span class="accueil-pret-qui"><span class="accueil-pret-nom">${echapper(modele.prenom(autreId))}</span>
          <span class="accueil-pret-role">${role === 'preteur' ? 'Tu prêtes' : 'Tu empruntes'}</span></span>
          <span class="accueil-pret-montant">${euros(t.montant)}</span></span>
        <span class="accueil-pret-etat">${ui.pucePret(p)}${flamme}</span>
        ${suivi ? `<span class="accueil-pret-suivi">${echapper(suivi.texte)}</span>` : ''}
        ${e ? `<span class="accueil-pret-echeance">Échéance le ${date(e.date)} · ${delai(e.date)}</span>` : ''}
        <span class="accueil-barre" aria-hidden="true"><span style="width:${pct}%"></span></span>
        <span class="visuellement-cache">${euros(rembourse)} remboursés sur ${euros(t.montant)}</span>
      </button></li>`;
  }

  function htmlMesPrets(prets, face) {
    const deLaFace = prets.filter(p => modele.role(p) === face);
    const actifs = deLaFace.filter(p => !TERMINES.includes(p.statut)).reverse();   // le plus récent d'abord
    const termines = deLaFace.filter(p => TERMINES.includes(p.statut)).reverse();
    const visibles = vue.filtre === 'a-faire' ? actifs.filter(aFaire) : actifs;
    const segment = (role, libelle) => `<button type="button" class="accueil-segment" data-action="accueil-face" data-face="${role}" aria-pressed="${face === role}">${libelle}</button>`;
    let h = `<section class="accueil-section" id="accueil-prets" aria-labelledby="accueil-prets-titre">
        <h2 class="accueil-h2" id="accueil-prets-titre">Mes prêts</h2>
        <div class="accueil-collant">
          <div class="accueil-segments" role="group" aria-labelledby="accueil-prets-titre">${segment('preteur', "Ce qu'on te doit")}${segment('emprunteur', 'Ce que tu dois')}</div>
          ${ui.pastilles({ options: [{ valeur: 'tous', libelle: 'Tous' }, { valeur: 'a-faire', libelle: 'À faire' }], valeur: vue.filtre, action: 'accueil-filtre', libelle: 'Filtrer les prêts' })}
        </div>
        <div class="accueil-liste" data-accueil-glisse>`;
    h += visibles.length ? `<ul class="accueil-prets">${visibles.map(cartePret).join('')}</ul>` : `<p class="accueil-rien">Rien pour l'instant.</p>`;
    if (vue.filtre === 'tous' && termines.length) {
      const ouvert = vue.termines[face];
      h += `<button type="button" class="accueil-termines" data-action="accueil-termines" data-face="${face}" aria-expanded="${ouvert}" aria-controls="accueil-termines-liste">`
        + `${ui.icone('chevron-bas', { taille: 20 })}<span>Terminés (${termines.length})</span></button>`
        + `<ul class="accueil-prets" id="accueil-termines-liste"${ouvert ? '' : ' hidden'}>${termines.map(cartePret).join('')}</ul>`;
    }
    return h + '</div></section>';
  }

  /* ---------- Bulle de la mascotte [G-07, C-16, D-45] : P, quand un rappel vient de partir chez l'autre ---------- */
  function htmlBulle(prets) {
    for (const p of prets) {
      if (p.statut !== 'en_cours' || modele.role(p) !== 'preteur') continue;
      const r = calculs.rappelsDuJour(p, modele.aujourdhui(), [-5, 0, 3, 5, 7], 'emprunteur');
      if (r.length) return ui.bulle(TEXTES_HORS_NOTIF.bulleRappel({ autre: modele.prenom(modele.autre(p)), date: date(r[0].echeance.date) }), { pose: 'relance-douce' });
    }
    return '';
  }

  /* ---------- accueil vide [A-08, D-74] et accueil avec des prêts ---------- */
  const salutation = etat => `<h1 class="titre accueil-salut">Salut ${echapper(etat.moi.prenom || '')},</h1>`;
  const htmlVide = etat => `<div class="accueil accueil--vide">
      ${salutation(etat)}
      ${ui.mascotte('salut', { taille: 'grande' })}
      <p class="accueil-vide-texte">Prête ou demande de l'argent à un proche. Rien ne démarre sans votre accord à tous les deux.</p>
      ${ui.bouton('Nouveau prêt', { action: 'nouveau-pret' })}
      <div class="accueil-simuler">${ui.bouton('Simuler', { action: 'simulation-simuler', variante: 'discret', classe: 'btn--centre' })}
        <p class="accueil-simuler-note">Ajoute des prêts d'exemple pour explorer l'app.</p></div>
    </div>`;

  E.accueil = etat => {
    const prets = modele.prets();
    if (!prets.length) return htmlVide(etat);
    const face = vue.face || (prets.some(p => modele.role(p) === 'preteur') || !prets.some(p => modele.role(p) === 'emprunteur') ? 'preteur' : 'emprunteur');
    const cartes = prets.flatMap(cartesAction).sort(parUrgence);
    return `<div class="accueil">
        ${salutation(etat)}
        ${htmlFaces(prets)}
        ${htmlAFaire(cartes)}
        ${htmlMesPrets(prets, face)}
        ${htmlBulle(prets)}
      </div>`;
  };

  /* ---------- Actions de l'accueil ---------- */
  // P-10 : « Simuler » de l'accueil vide passe par l'action du lot K, qui gère aussi le deuxième appel.
  const mouvementReduit = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Toucher une moitié de la carte (ou un segment) sélectionne la face de « Mes prêts ».
  A['accueil-face'] = el => {
    vue.face = el.dataset.face;
    routeur.rafraichir();
    if (!el.dataset.defiler) return;
    const segment = document.querySelector(`.accueil-segment[data-face="${vue.face}"]`);
    const section = document.getElementById('accueil-prets');
    const ecran = document.getElementById('ecran');
    if (segment) segment.focus({ preventScroll: true });
    // Défile #ecran seul (scrollIntoView ferait aussi défiler le cadre #app).
    if (section && ecran) ecran.scrollTo({ top: ecran.scrollTop + section.getBoundingClientRect().top - ecran.getBoundingClientRect().top - 8, behavior: mouvementReduit() ? 'auto' : 'smooth' });
  };
  A['accueil-filtre'] = el => { vue.filtre = el.dataset.valeur === 'a-faire' ? 'a-faire' : 'tous'; routeur.rafraichir(); };
  A['accueil-termines'] = el => { const f = el.dataset.face; vue.termines[f] = !vue.termines[f]; routeur.rafraichir(); };
  A['accueil-tout-voir'] = () => { vue.toutVoir = true; routeur.rafraichir(); };
  // Toucher une carte ouvre le Parcours de ce prêt (fichier 07), avec une flèche de retour.
  A['accueil-ouvrir'] = el => { if (Date.now() - dernierGlisse < 500) return; routeur.aller('parcours', { pretId: el.dataset.pretId }); };

  // Action directe : « C'est noté. » dans la carte, puis la carte disparaît.
  function direct(el, faire) {
    const carteEl = el.closest('.accueil-action');
    const rang = Math.max(0, [...document.querySelectorAll('.accueil-action')].indexOf(carteEl));
    const pret = modele.pret(el.dataset.pretId);
    const r = faire();
    if (!r.ok) return r;   // refus : le socle l'a signalé en console, le rendu suit l'état
    notes.push({ cle: el.dataset.cle, rang, autreId: pret ? modele.autre(pret) : null, jusqua: Date.now() + DUREE_NOTE });
    routeur.plusTard(() => routeur.rafraichir(), DUREE_NOTE + 50);
    return r;
  }
  A['accueil-versement-oui'] = el => direct(el, () => confirmerVersement(el.dataset.pretId));
  A['accueil-versement-pas-encore'] = el => direct(el, () => pasEncoreVersement(el.dataset.pretId));
  // Dernier remboursement confirmé : écran de fin (fichier 10, « les deux reçoivent leur écran de fin »).
  A['accueil-rembt-oui'] = el => {
    const r = direct(el, () => confirmerRemboursement(el.dataset.declId));
    if (r.ok && r.rembourse) routeur.aller('fin-pret', { pretId: el.dataset.pretId });
  };
  A['accueil-rembt-rien'] = el => direct(el, () => rienVu(el.dataset.declId));
  A['accueil-carnet'] = el => direct(el, () => repondreCarnet(el.dataset.pretId, el.dataset.reponse === 'oui'));

  // Glissé horizontal sur la liste : change de face (vers la gauche : « Ce que tu dois »).
  let depart = null;
  document.addEventListener('pointerdown', ev => {
    const zone = ev.isPrimary && ev.target.closest && ev.target.closest('[data-accueil-glisse]');
    depart = zone ? { x: ev.clientX, y: ev.clientY } : null;
  });
  document.addEventListener('pointercancel', () => { depart = null; });
  document.addEventListener('pointerup', ev => {
    if (!depart) return;
    const dx = ev.clientX - depart.x, dy = ev.clientY - depart.y;
    depart = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < 2 * Math.abs(dy)) return;
    dernierGlisse = Date.now();
    if (routeur.courant().route !== 'accueil') return;
    vue.face = dx < 0 ? 'emprunteur' : 'preteur';
    routeur.rafraichir();
  });

  /* ==========================================================================
     notifications [D-14, A-02] : fil de la cloche, du plus récent au plus ancien.
     ========================================================================== */
  const ICONES = [
    [/^rappel_/, 'calendrier'],
    [/^(proposition_|nouvelle_proposition|changement_|passage_zen)/, 'echange'],
    [/^carnet_/, 'carnet'],
    [/^(zen_|signature_|relance_signature)/, 'drapeau'],
    [/(pas_encore|non_recu|_declare)$/, 'sablier'],
    [/^(versement_|rembt_|pret_rembourse|avance_rapide)/, 'coche'],
    [/^(message_recu|tiers_)/, 'message'],
    [/^(merci_recu|petit_geste_recu|cloture_cadeau)/, 'cadeau'],
    [/^pret_annule/, 'croix']
  ];
  const iconeDe = cle => (ICONES.find(([re]) => re.test(cle)) || [null, 'cloche'])[1];
  const ligneNotif = n => `<li><button type="button" class="notif accueil-notif${n.lue ? '' : ' notif--non-lue'}" data-action="accueil-notif" data-id="${echapper(n.id)}">
      <span class="accueil-notif-icone">${ui.icone(iconeDe(n.cle), { taille: 20 })}</span>
      <span class="accueil-notif-corps">${n.lue ? '' : '<span class="visuellement-cache">Non lue. </span>'}<span class="accueil-notif-texte">${echapper(n.texte)}</span>
      <span class="notif-date">${echapper(delai(n.date))}</span></span></button></li>`;

  E.notifications = etat => {
    const entete = ui.enteteRetour({ titre: 'Notifications' });
    if (!etat.notifications.length) return entete + `<p class="accueil-notifs-vide">Rien de nouveau pour l'instant.</p>`;
    const auj = modele.aujourdhui();
    const groupes = [["Aujourd'hui", []], ['Cette semaine', []], ['Plus tôt', []]];
    const liste = etat.notifications.map((n, i) => ({ n, i })).sort((a, b) => parDate(b.n.date, a.n.date) || a.i - b.i);
    for (const { n } of liste) {
      const age = calculs.joursEntre(n.date, auj);   // en jours, sur la date simulée
      groupes[age <= 0 ? 0 : age < 7 ? 1 : 2][1].push(n);
    }
    return entete + groupes.map(([titre, l], k) => (l.length ? `<section class="accueil-notifs-groupe" aria-labelledby="accueil-notifs-${k}">
        <h2 class="accueil-h2" id="accueil-notifs-${k}">${titre}</h2><ul class="liste-notifs">${l.map(ligneNotif).join('')}</ul></section>` : '')).join('');
  };
  // Toucher une ligne la marque comme lue et ouvre l'écran lié.
  A['accueil-notif'] = el => {
    const n = modele.lire().notifications.find(x => x.id === el.dataset.id);
    if (!n) return;
    if (!n.lue) marquerLue(n.id);
    if (n.lien && n.lien.route) routeur.aller(n.lien.route, n.lien.pretId ? { pretId: n.lien.pretId } : {});
  };
})();
