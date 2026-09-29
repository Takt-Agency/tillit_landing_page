/* ==========================================================================
   TilliT prototype · lot G · Parcours du prêt et remboursements
   Spec : 07-parcours-remboursements.md (et 09 pour la flamme et les paliers).
   Contrat : LISEZMOI-lots.md. Ce fichier appartient au lot G.

   Routes : parcours ({ pretId } facultatif), remboursement-declarer et
   recu-preteur (écrans ; depuis le Parcours, les mêmes formulaires s'ouvrent
   en feuille du bas), historique, guide-coince.
   Le bloc « Outils du test » en bas d'un prêt en cours est au lot K.
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, delai, echapper, selonRole, pluriel, insecables } = textes;
  const E = window.ecrans, A = window.actions, S = window.saisies, C = window.calculs;
  const esc = echapper;
  // Ce que declarerRemboursement et declarerRecuPreteur acceptent (etat.js).
  const DECLARABLES = ['non_recue', 'a_declarer', 'prochaine', 'a_venir'];
  const LIBRES = ['a_declarer', 'prochaine', 'a_venir'];
  const A_VALIDER = ['propose', 'negociation', 'attente_paiement_zen', 'signatures', 'valide'];
  const TERMINES = ['rembourse', 'cloture', 'annule', 'refuse', 'retire', 'expire'];

  /* ---------- État local de l'écran (jamais dans l'état du prêt) ---------- */
  let pretAffiche = null;     // prêt montré par le dernier rendu du Parcours
  let visite = 0;             // compte les arrivées sur le Parcours
  let flash = null;           // { pretId, type: 'confirme' | 'palier', palier, numeros, visite, date } : « juste après »
  const flashPour = p => (flash && flash.pretId === p.id && flash.date === modele.aujourdhui() ? flash : null);
  let form = null;            // formulaire de déclaration : { type: 'decl' | 'recu', pretId, k, moyen, date, contexte }

  /* ---------- Petites aides ---------- */
  const autreId = p => modele.autre(p);
  const autreDe = p => modele.prenom(modele.autre(p));
  const termesDe = p => (['propose', 'negociation'].includes(p.statut) && modele.derniereVersion(p) ? modele.derniereVersion(p).termes : p.termes) || {};
  const nbEcheances = p => (p.echeances.length ? p.echeances.length : C.echeancier(termesDe(p)).echeances.length || termesDe(p).duree || 0);
  const somme = liste => liste.reduce((s, e) => s + e.montant, 0);
  const tousSignes = p => !!(p.zen && p.zen.signatures[p.preteurId] && p.zen.signatures[p.emprunteurId]);
  const p1 = t => insecables(t);
  // « Échéance du 12 octobre », « Échéances du 12 octobre et du 12 novembre », « 3 échéances, du … au … »
  function phraseEcheances(liste) {
    if (!liste.length) return '';
    if (liste.length === 1) return `Échéance du ${date(liste[0].date)}`;
    if (liste.length === 2) return `Échéances du ${date(liste[0].date)} et du ${date(liste[1].date)}`;
    return `${liste.length} échéances, du ${date(liste[0].date)} au ${date(liste[liste.length - 1].date)}`;
  }
  const libelleConfirmes = (k, n) => `${k} ${k > 1 ? 'remboursements confirmés' : 'remboursement confirmé'} sur ${n}`;
  const libelleRestantes = r => `${r} ${r > 1 ? 'échéances restantes' : 'échéance restante'}`;
  // Paliers (spec 09) et récompenses associées (proposition à valider par Yohann).
  const libellePalier = n => (n === 1 ? 'Premier remboursement confirmé' : n === 30 ? 'À mi-chemin' : `${n} remboursements confirmés`);
  // Correspondance palier et récompense : socle (modele.recompensePalier), qui débloque aussi la récompense.
  const recompenseDe = n => (modele.recompensePalier(n) || {}).libelle || 'une récompense';
  // Variante du prototype (spec 08) : « Prévenir {tiers} » après le rappel J+7 d'une échéance ni déclarée ni réaménagée.
  // Même règle dans changer.js (écran tiers-prevenir).
  function peutPrevenirTiers(p) {
    if (p.statut !== 'en_cours' || !p.tiers || !p.tiers.accepte || p.tiers.alerte || modele.role(p) !== 'preteur') return false;
    if (modele.changementEnAttente(p)) return false;
    const auj = modele.aujourdhui();
    return modele.echeances(p).some(e => e.etat === 'a_declarer' && C.joursEntre(e.date, auj) >= 7);
  }
  const bouton = (libelle, action, p, params = {}, variante = 'principal') =>
    ui.bouton(libelle, { action, variante, params: Object.assign({ pretId: p.id }, params), classe: variante === 'discret' ? 'btn--centre' : '' });
  const allerVers = (libelle, route, p, params = {}, variante = 'principal') => bouton(libelle, 'aller', p, Object.assign({ route }, params), variante);

  /* ==========================================================================
     Carte d'action du moment (spec 07 §6). Rend { phrase, contenu } :
     phrase = texte brut (affiché dans le titre d'état), contenu = HTML sûr
     (boutons, consigne). Sans phrase : « Tout est à jour. »
     ========================================================================== */
  function situation(p) {
    const role = modele.role(p), P = role === 'preteur', autre = autreDe(p);
    const montantPret = euros(termesDe(p).montant || 0);
    switch (p.statut) {
      case 'propose': case 'negociation':
        // P-9 n° 6 : le titre dit ce que le proche propose, pas seulement qu'il attend.
        if (modele.aMoiDeRepondre(p)) return { phrase: p.statut === 'negociation' ? `${autre} propose autre chose.`
            : (P ? `${autre} te demande un prêt.` : `${autre} te propose un prêt.`),
          contenu: allerVers('Voir la proposition', 'proposition-recue', p) };
        return { phrase: `En attente de la réponse de ${autre}.`, contenu: bouton('Retirer ma proposition', 'parcours-retirer', p, {}, 'discret') };
      case 'attente_paiement_zen': return situationZen(p, autre) || {};
      case 'signatures': return situationZen(p, autre) || {};
      case 'valide': {
        const v = p.versement;
        if (!v) return P
          ? { phrase: `Envoie ${montantPret} à ${autre}, puis indique-le ici.`, contenu: allerVers("Indiquer que c'est parti", 'versement-declarer', p) }
          : { phrase: `${autre} va t'envoyer ${montantPret}.`, contenu: bouton("J'ai reçu l'argent", 'versement-recu', p, {}, 'secondaire') };
        return P ? { phrase: `On attend la confirmation de ${autre}.` }
          : { phrase: `${autre} a envoyé ${montantPret}. Tu l'as reçu ?`,
              contenu: bouton("Oui, j'ai reçu", 'parcours-versement-oui', p) + bouton('Pas encore', 'parcours-versement-pas-encore', p, {}, 'secondaire') };
      }
      case 'en_cours': return situationEnCours(p, role, autre);
      case 'rembourse': {
        const merci = p.fin && p.fin.merci;
        if (P) return { phrase: 'Prêt remboursé ! Carnet mis à jour.',
          contenu: merci ? `<blockquote class="parcours-merci"><p>${esc(merci)}</p><footer>${esc(autre)}</footer></blockquote>` : '' };
        return { phrase: 'Prêt remboursé ! Carnet mis à jour.',
          contenu: (merci ? '' : allerVers('Dire merci', 'dire-merci', p))
            + (p.fin && p.fin.petitGeste ? '' : allerVers('Offrir un petit geste', 'petit-geste', p, {}, 'secondaire')) };
      }
      case 'cloture': {
        const cadeau = p.fin && p.fin.cadeauReste;
        let t = `Prêt clôturé le ${date(p.dateFin)}.`;
        if (cadeau != null) t += P ? ` Tu as fait cadeau des ${euros(cadeau)} restants.` : ` ${autre} t'a fait cadeau des ${euros(cadeau)} restants.`;
        return { phrase: t };
      }
      case 'annule': return { phrase: `Prêt annulé le ${date((p.annulation && p.annulation.date) || p.dateFin)}.` };
      case 'refuse': case 'retire': case 'expire': {
        const v = modele.derniereVersion(p) || {};
        const moiAuteur = v.auteurId === 'moi';
        const t = p.statut === 'expire' ? 'Cette proposition a expiré sans réponse.'
          : p.statut === 'retire' ? (moiAuteur ? 'Tu as retiré ta proposition.' : `${autre} a retiré sa proposition.`)
          : (moiAuteur ? `${autre} a refusé cette proposition.` : 'Ta réponse est envoyée.');
        return { phrase: t, contenu: ui.bouton("Revenir à l'accueil", { action: 'onglet', params: { route: 'accueil' }, variante: 'secondaire' }) };
      }
      default: return {};
    }
  }
  // Zen à payer ou à signer (avant la validation, ou après un passage en Zen accepté).
  function situationZen(p, autre) {
    if (!p.zen) return null;
    if (!p.zen.paye) return p.zen.payeurId === 'moi'
      ? { phrase: `Il reste à payer Zen : ${euros(p.zen.prix)}.`, contenu: bouton('Payer Zen', 'zen-payer', p) }
      : { phrase: `En attente du paiement de Zen par ${autre}.` };
    if (!tousSignes(p)) return p.zen.signatures.moi
      ? { phrase: `Signature de ${autre} attendue.` }
      : { phrase: 'La reconnaissance de dette est prête.', contenu: allerVers('Signer', 'zen-document', p) };
    return null;
  }
  const FELICITATION = "Tu fais partie des XX % qui remboursent à l'heure.";
  const DEMO = "Chiffre de démonstration. Dans l'application, il sera calculé sur les vrais remboursements.";
  function situationEnCours(p, role, autre) {
    const P = role === 'preteur';
    const ech = modele.echeances(p);
    const premiere = etat => ech.find(e => e.etat === etat);
    const enAttente = premiere('en_attente'), nonRecue = premiere('non_recue'), aDeclarer = premiere('a_declarer'), prochaine = premiere('prochaine');
    const chg = modele.changementEnAttente(p);
    const recu = chg && chg.auteurId !== 'moi' ? chg : null, envoye = chg && chg.auteurId === 'moi' ? chg : null;
    const siRecu = () => recu && { phrase: recu.type === 'passage_zen' ? `${autre} propose de passer le prêt en Zen.` : `${autre} propose un nouveau calendrier.`,
                                   contenu: allerVers('Voir la proposition', 'changement-recu', p) };
    const siEnvoye = () => envoye && (envoye.type === 'passage_zen' ? { phrase: `En attente de la réponse de ${autre}.` }
      : { phrase: `C'est envoyé. Le nouveau calendrier s'applique quand ${autre} l'aura accepté. En attendant, le calendrier prévu reste en place.` });
    const siADeclarer = () => {
      if (!aDeclarer) return null;
      const d = date(aDeclarer.date), pose = ui.retardLong(aDeclarer) ? 'refus' : null;   // seule place de 32-refus, textes inchangés
      if (P) return { pose, phrase: `L'échéance du ${d} est passée. ${autre} n'a rien déclaré pour l'instant.`,
        contenu: `<p class="parcours-consigne">${esc(p1(`Pour relancer, parle de la date : « L'échéance du ${d} est passée, tu me dis où tu en es ? »`))}</p>`
          + allerVers(`Écrire à ${autre}`, 'fil', p, { modele: 'relance', numero: aDeclarer.numero })
          + bouton("J'ai reçu", 'parcours-recu', p, {}, 'secondaire')
          + (peutPrevenirTiers(p) ? allerVers(`Prévenir ${modele.prenom(p.tiers.contactId)}`, 'tiers-prevenir', p, {}, 'discret') : '') };
      return { pose, phrase: `L'échéance du ${d} est passée. Tu as remboursé ? Déclare-le.`,
        contenu: bouton("J'ai remboursé", 'parcours-declarer', p)
          + allerVers('Ça va être compliqué ? Proposer une nouvelle date', 'decaler', p, { numero: aDeclarer.numero }, 'discret') };
    };
    const siEnAttente = () => enAttente && (P
      ? { phrase: `${autre} a déclaré un remboursement de ${euros(enAttente.declaration.montant)}. Tu confirmes l'avoir reçu ?`,
          contenu: bouton('Oui, reçu', 'parcours-confirmer', p, { declId: enAttente.declaration.id })
            + bouton("Je n'ai rien vu", 'parcours-rien-vu', p, { declId: enAttente.declaration.id }, 'secondaire') }
      : { phrase: `En attente de confirmation. ${autre} va confirmer la réception de tes ${euros(enAttente.declaration.montant)}.` });
    const siNonRecue = () => nonRecue && (P
      ? { phrase: `Tu n'as pas encore vu arriver les ${euros(nonRecue.declaration.montant)}. Tu pourras confirmer dès qu'ils arrivent.`,
          contenu: bouton('Oui, reçu', 'parcours-confirmer', p, { declId: nonRecue.declaration.id }) }
      : { phrase: `${autre} n'a pas encore vu arriver tes ${euros(nonRecue.declaration.montant)}. Vérifie ton virement, puis déclare-le à nouveau ou écris-lui.`,
          contenu: bouton('Déclarer à nouveau', 'parcours-declarer', p) + allerVers(`Écrire à ${autre}`, 'fil', p, {}, 'secondaire') });
    const siFlash = () => {
      if (!flashPour(p)) return null;
      if (flash.type === 'palier') {
        let contenu = allerVers('Voir mes récompenses', 'recompenses', p, {}, 'secondaire');
        // Félicitation privée (spec 09) : emprunteur seulement, si tous les remboursements confirmés étaient à l'heure.
        if (!P && modele.flamme(p).valeur >= C.nbConfirmees(p, modele.aujourdhui()))
          contenu = `<p class="parcours-felicitation">${esc(p1(FELICITATION))}</p><p class="parcours-demo">${esc(DEMO)}</p>` + contenu;
        return { phrase: `Palier fêté : ${libellePalier(flash.palier)}. Vous débloquez ${recompenseDe(flash.palier)}.`, contenu };
      }
      const enAvance = !P && ech.some(e => (flash.numeros || []).includes(e.numero) && e.etat === 'remboursee' && e.enAvance);
      return { phrase: prochaine ? `Remboursement confirmé. Prochaine échéance le ${date(prochaine.date)}.` : 'Remboursement confirmé.',
               contenu: enAvance ? '<p class="parcours-felicitation">Tu as remboursé une échéance en avance. Bien joué !</p>' : '' };
    };
    const siProchaine = () => prochaine && (P
      ? { phrase: `Tout est à jour. Prochaine échéance le ${date(prochaine.date)} : ${euros(prochaine.montant)}.` }
      : { phrase: `Prochaine échéance : ${euros(prochaine.montant)} le ${date(prochaine.date)} · ${delai(prochaine.date)}.`,
          contenu: bouton("Je l'ai remboursée", 'parcours-declarer', p)
            + `<div class="parcours-copier">${ui.boutonCopier(prochaine.reference)}</div>`
            + allerVers('Ça va être compliqué ? On peut réaménager ton échéance ensemble.', 'difficulte', p, {}, 'discret') });
    const ordre = P ? [siEnAttente, siNonRecue, siRecu, siEnvoye, siADeclarer, () => situationZen(p, autre), siFlash, siProchaine]
                    : [siNonRecue, siRecu, siEnvoye, siADeclarer, siEnAttente, () => situationZen(p, autre), siFlash, siProchaine];
    for (const f of ordre) { const s = f(); if (s) return s; }
    return {};
  }

  /* ==========================================================================
     Carte du prêt (spec 07 §4)
     ========================================================================== */
  function carteDuPret(p) {
    const role = modele.role(p), P = role === 'preteur', autre = autreDe(p), t = termesDe(p);
    const n = nbEcheances(p);
    // Suivi de la proposition (décision P-8 n° 3), sauf si la puce du titre d'état le dit déjà.
    const suiviBrut = modele.suiviProposition(p), puce = modele.puce(p);
    const suivi = suiviBrut && (!puce || puce.texte !== suiviBrut.texte) ? suiviBrut : null;
    const montant = p.echeances.length ? somme(p.echeances) : (t.montant || 0);
    const actif = ['valide', 'en_cours', 'rembourse', 'cloture'].includes(p.statut) && p.echeances.length;
    let h = `<div class="parcours-carte-tete">${ui.avatar(autreId(p), { taille: 'm' })}<div>`
      + `<p class="parcours-carte-qui">${esc(P ? `${autre} te rembourse` : `Tu rembourses ${autre}`)}</p>`
      + `<p class="parcours-carte-termes">${esc(euros(montant))} · ${esc(`${n} mois`)}${t.motif ? ` · ${esc(t.motif)}` : ''}</p>`
      // Où en est la proposition envoyée (décision P-8 n° 3), vue par celui qui l'a envoyée.
      + (suivi ? `<p class="parcours-carte-suivi">${esc(suivi.texte)}</p>` : '') + '</div></div>';
    if (actif) {
      const ech = modele.echeances(p);
      const k = ech.filter(e => e.etat === 'remboursee').length;
      const r = n - k;
      const rembourse = modele.rembourse(p);
      const reste = modele.reste(p);
      const libelle = libelleConfirmes(k, n);
      h += `<div class="parcours-carte-corps">${ui.anneau(n ? k / n : 0, { libelle, centre: `${k}/${n}` })}<div class="parcours-carte-chiffres">`
        // Prêt clôturé : plus rien ne se suit dans TilliT (reste offert ou réglé entre vous), on garde les faits.
        + (p.statut === 'cloture' ? '' : `<p class="parcours-carte-reste">${esc(P ? `Il te reste à recevoir ${euros(reste)}` : `Il te reste ${euros(reste)} à rembourser`)}</p>`)
        + `<p class="parcours-carte-detail">${esc(`${euros(rembourse)} remboursés sur ${euros(montant)}`)}</p>`
        + (p.statut === 'cloture' ? '' : `<p class="parcours-carte-detail">${esc(libelleRestantes(r))}</p>`)
        + `<p class="parcours-carte-confirmes">${esc(libelle)}</p></div></div>`;
      const f = modele.flamme(p);
      const message = p.statut === 'en_cours' ? messageProgression(k, r, n, rembourse, montant) : '';
      if (f.allumee || message) {
        h += '<div class="parcours-carte-pied">'
          + (f.allumee ? `<p class="parcours-flamme${f.attenue ? ' parcours-flamme--attenue' : ''}">${ui.icone('flamme', { taille: 22 })}<span>${esc(`Votre flamme : ${f.valeur}`)}</span></p>` : '')
          + (message ? `<p class="parcours-progres">${esc(message)}</p>` : '') + '</div>';
      }
    }
    return `<section class="carte parcours-carte" aria-label="Le prêt">${h}</section>`;
  }
  // Message de progression (spec 07 §4, A-51) : le premier qui s'applique, dans l'ordre de la spec.
  function messageProgression(k, r, n, rembourse, montant) {
    if (r === 1) return 'Dernière échéance';
    if (r === 2 || r === 3) return `Plus que ${r}`;
    if (k > 0 && k * 2 >= n) return 'À mi-chemin';
    if (montant && rembourse * 4 >= montant * 3) return '75 % remboursé';
    return '';
  }

  /* ---------- Rangée d'actions (spec 07 §5) ---------- */
  function rangee(p) {
    const role = modele.role(p), autre = autreDe(p);
    const rond = (libelle, icone, action, params = {}, desactive = false) =>
      `<button type="button" class="parcours-rond" data-action="${action}" data-pret-id="${esc(p.id)}"`
      + Object.entries(params).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('') + (desactive ? ' disabled' : '') + '>'
      + `<span class="parcours-rond-icone">${ui.icone(icone)}</span><span class="parcours-rond-texte">${esc(libelle)}</span></button>`;
    const ecrire = rond(`Écrire à ${autre}`, 'message', 'aller', { route: 'fil' });
    if (p.statut !== 'en_cours') return `<div class="parcours-rangee parcours-rangee--seul">${ecrire}</div>`;
    const ech = modele.echeances(p);
    const rienADeclarer = !ech.some(e => DECLARABLES.includes(e.etat));
    const chg = modele.changementEnAttente(p);
    if (role === 'emprunteur') {
      return `<div class="parcours-rangee">${rond("J'ai remboursé", 'coche', 'parcours-declarer', {}, rienADeclarer)}`
        + rond('Ça va être compliqué ?', 'interrogation', 'aller', { route: 'difficulte' }) + ecrire + '</div>';
    }
    // P-9 n° 2 : plus de pastille ronde « J'ai reçu », elle doublait les gros boutons de la carte d'action
    // et le « J'ai reçu » de la feuille d'un nœud. Deux pastilles : « Nouveau calendrier » et « Écrire à ».
    return `<div class="parcours-rangee parcours-rangee--deux">`
      + rond('Nouveau calendrier', 'calendrier', 'aller', { route: 'nouveau-calendrier' }, !!chg || !ech.some(e => LIBRES.includes(e.etat))) + ecrire + '</div>';
  }

  /* ==========================================================================
     Chemin (spec 07 §7) : Départ, un nœud par échéance, arrivée avec podium.
     Le chemin serpente ; le tracé SVG relie les centres des nœuds.
     ========================================================================== */
  const MOTIF = [0, -10, -16, -10, 0, 10, 16, 10];   // décalage horizontal, en % de la largeur
  const HAUTEUR = 96;                               // hauteur d'une rangée, en px (même valeur dans ecrans.css)
  function decalage(i, detour) {
    const dx = MOTIF[i % MOTIF.length];
    if (!detour) return dx;
    return dx === 0 ? -12 : Math.max(-22, Math.min(22, dx + Math.sign(dx) * 6));   // petit détour vers les nouvelles dates
  }
  const reamenagees = p => new Set(p.changements.filter(c => c.statut === 'acceptee' && c.type !== 'passage_zen').flatMap(c => c.apres.map(a => a.numero)));
  const deplacee = e => !!e.dateInitiale && e.dateInitiale !== e.date;
  function focusMascotte(p, ech) {
    if (p.statut === 'rembourse') return { cible: 'arrivee', pose: 'coup-de-coeur' };
    if (p.statut !== 'en_cours') return null;
    // Même ordre que la carte d'action : une échéance à déclarer ou en attente passe avant une fête.
    const aDeclarer = ech.find(e => e.etat === 'a_declarer' || e.etat === 'non_recue');
    if (aDeclarer) return { cible: aDeclarer.numero, pose: ui.retardLong(aDeclarer) ? 'refus' : 'attentive' };
    const attente = ech.find(e => e.etat === 'en_attente');
    if (attente) return { cible: attente.numero, pose: 'en-attente' };
    const derniereConfirmee = ech.filter(e => e.etat === 'remboursee').pop();
    if (flashPour(p) && derniereConfirmee) return { cible: derniereConfirmee.numero, pose: flash.type === 'palier' ? 'celebration' : derniereConfirmee.enAvance ? 'anticipe' : 'heureuse' };
    const prochaine = ech.find(e => e.etat === 'prochaine');
    if (prochaine) return { cible: prochaine.numero, pose: reamenagees(p).has(prochaine.numero) ? 'reamenagee' : 'attentive' };
    return null;
  }
  function chemin(p) {
    if (!p.echeances.length || ['propose', 'negociation', 'refuse', 'retire', 'expire'].includes(p.statut)) return '';
    const ech = modele.echeances(p);
    const fige = p.statut === 'cloture' || p.statut === 'annule';
    const actif = p.statut === 'en_cours' || p.statut === 'valide';
    const k = ech.filter(e => e.etat === 'remboursee').length;
    const paliers = actif ? C.PALIERS.filter(x => x > k && x <= ech.length && (x !== 30 || p.termes.duree === 60)) : [];
    const focus = focusMascotte(p, ech);
    const detours = reamenagees(p);
    const rangs = [{ type: 'depart', dx: 0, fait: !!(p.versement && p.versement.confirmePar) && p.statut !== 'annule' }];
    ech.forEach((e, i) => rangs.push({ type: 'echeance', e, dx: decalage(i + 1, detours.has(e.numero)), fait: e.etat === 'remboursee' }));
    rangs.push({ type: 'arrivee', dx: 0, fait: p.statut === 'rembourse' });
    const H = rangs.length * HAUTEUR;
    // Tracé : une courbe par segment ; fait (plein), à venir (pointillé), détour (vers une date réaménagée).
    let trace = '';
    for (let i = 1; i < rangs.length; i++) {
      const a = rangs[i - 1], b = rangs[i];
      const x1 = 50 + a.dx, y1 = (i - 1) * HAUTEUR + HAUTEUR / 2, x2 = 50 + b.dx, y2 = i * HAUTEUR + HAUTEUR / 2, ym = (y1 + y2) / 2;
      const classe = fige && !b.fait ? 'gris' : b.fait ? 'fait' : (b.e && detours.has(b.e.numero) ? 'detour' : 'avenir');
      trace += `<path class="parcours-seg parcours-seg--${classe}" vector-effect="non-scaling-stroke" d="M${x1} ${y1} C${x1} ${ym} ${x2} ${ym} ${x2} ${y2}"/>`;
    }
    const items = rangs.map((r, i) => {
      const cote = r.dx > 0 ? 'gauche' : 'droite';   // le libellé se met du côté libre
      const style = `style="--dx:${r.dx}%"`;
      const mascotte = focus && ((r.type === 'arrivee' && focus.cible === 'arrivee') || (r.e && r.e.numero === focus.cible))
        ? `<span class="parcours-mascotte parcours-mascotte--${cote === 'droite' ? 'gauche' : 'droite'}">${ui.mascotte(focus.pose, { taille: 'petite' })}</span>` : '';
      if (r.type === 'depart') {
        const v = p.versement;
        return `<li class="parcours-rang" ${style}><button type="button" class="parcours-noeud parcours-noeud--depart${r.fait ? ' parcours-noeud--fait' : ''}" data-action="parcours-noeud" data-pret-id="${esc(p.id)}" data-numero="depart" aria-label="${esc(`Départ${v && v.confirmePar ? `, versement du ${date(v.dateConfirmation || v.date)}` : ''}`)}">${ui.icone('echange')}</button>`
          + `<div class="parcours-libelle parcours-libelle--${cote}"><p class="parcours-l-titre">Départ</p>${v && v.confirmePar ? `<p class="parcours-l-date">${esc(date(v.dateConfirmation || v.date))}</p>` : ''}</div></li>`;
      }
      if (r.type === 'arrivee') {
        return `<li class="parcours-rang parcours-rang--arrivee" ${style}><div class="parcours-arrivee${r.fait ? ' parcours-arrivee--fait' : ''}" role="img" aria-label="Arrivée">`
          + `${ui.icone('drapeau', { taille: 26 })}<svg class="parcours-podium" viewBox="0 0 60 26" aria-hidden="true" focusable="false"><rect x="0" y="10" width="20" height="16" rx="2"/><rect x="20" y="0" width="20" height="26" rx="2"/><rect x="40" y="14" width="20" height="12" rx="2"/></svg></div>`
          + `<div class="parcours-libelle parcours-libelle--${cote}"><p class="parcours-l-titre">Arrivée</p></div>${mascotte}</li>`;
      }
      const e = r.e;
      const etatVu = fige && e.etat !== 'remboursee' ? 'fige' : e.etat === 'remboursee' && e.enAvance ? 'avance' : e.etat;
      const libelleEtat = etatVu === 'fige' ? '' : C.libelleEcheance(e);
      const contenu = { remboursee: ui.icone('coche'), avance: ui.icone('coche'), en_attente: ui.icone('sablier', { taille: 22 }),
                        non_recue: ui.icone('interrogation') }[etatVu] || `<span>${i}</span>`;
      const palier = paliers.includes(i) ? `<span class="parcours-cadeau">${ui.icone('cadeau', { taille: 18 })}</span>` : '';
      const sansReponse = !!(e.declaration && e.declaration.confirmeeSansReponse);
      const aria = [`Échéance du ${date(e.date)}`, euros(e.montant), libelleEtat, sansReponse ? 'confirmée sans réponse' : '', palier ? 'palier à venir' : ''].filter(Boolean).join(', ');
      return `<li class="parcours-rang" ${style}><button type="button" class="parcours-noeud parcours-noeud--${etatVu}" data-action="parcours-noeud" data-pret-id="${esc(p.id)}" data-numero="${e.numero}" aria-label="${esc(aria)}">${contenu}${palier}</button>`
        + `<div class="parcours-libelle parcours-libelle--${cote}"><p class="parcours-l-titre">${esc(euros(e.montant))}</p>`
        + `<p class="parcours-l-date">${deplacee(e) ? `<span class="parcours-ancienne"><span class="visuellement-cache">Ancienne date : </span>${esc(date(e.dateInitiale))}</span> ` : ''}${esc(date(e.date))}</p>`
        + (libelleEtat ? `<p class="parcours-l-etat parcours-l-etat--${etatVu}">${esc(libelleEtat)}</p>` : '')
        + (sansReponse ? `<p class="parcours-l-mention">${esc('Confirmée sans réponse')}</p>` : '') + `</div>${mascotte}</li>`;
    }).join('');
    return `<section class="parcours-chemin${fige ? ' parcours-chemin--fige' : ''}" aria-label="Chemin du prêt">`
      + `<svg class="parcours-trace" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${trace}</svg>`
      + `<ol class="parcours-rangs">${items}</ol></section>`;
  }

  /* ==========================================================================
     Prêt affiché par défaut (spec 07 §1) : l'action la plus urgente,
     sinon le dernier prêt en cours. À égalité, le plus récent.
     ========================================================================== */
  function urgence(p) {
    const role = modele.role(p);
    switch (p.statut) {
      case 'propose': case 'negociation': return modele.aMoiDeRepondre(p) ? 90 : 20;
      case 'attente_paiement_zen': return p.zen && p.zen.payeurId === 'moi' ? 85 : 20;
      case 'signatures': return p.zen && !p.zen.signatures.moi ? 85 : 20;
      case 'valide': return (!p.versement && role === 'preteur') || (p.versement && !p.versement.confirmePar && role === 'emprunteur') ? 80 : 30;
      case 'en_cours': {
        const ech = modele.echeances(p), chg = modele.changementEnAttente(p);
        if (role === 'preteur' && ech.some(e => e.etat === 'en_attente')) return 100;
        if (chg && chg.auteurId !== 'moi') return 95;
        if (ech.some(e => e.etat === 'a_declarer' || (role === 'emprunteur' && e.etat === 'non_recue'))) return 90;
        if (p.zen && ((!p.zen.paye && p.zen.payeurId === 'moi') || (p.zen.paye && !p.zen.signatures.moi))) return 85;
        return 50;
      }
      default: return 0;
    }
  }
  function pretParDefaut() {
    let meilleur = null, score = -1;
    for (const p of modele.prets()) { const s = urgence(p); if (s >= score) { score = s; meilleur = p; } }
    return meilleur;
  }

  /* ==========================================================================
     Écran « parcours »
     ========================================================================== */
  function rendreParcours(etat, params) {
    // P-9 n° 4 : sans prêt nommé (onglet Parcours), on montre d'abord la liste.
    // Un seul prêt : on l'ouvre directement, c'est le seul raccourci.
    if (!params.pretId && modele.prets().length > 1) {
      pretAffiche = null;
      return `<div class="parcours parcours-liste"><h1 class="titre">Tes prêts</h1>`
        + `<p class="parcours-liste-texte">Choisis le prêt à suivre.</p>${groupesPrets()}</div>`;
    }
    const p = (params.pretId && modele.pret(params.pretId)) || pretParDefaut();
    pretAffiche = p ? p.id : null;
    const retour = routeur.peutRevenir() ? ui.boutonIcone('fleche-gauche', 'Retour') : '';
    if (!p || p.statut === 'brouillon') {
      return `<div class="parcours parcours--vide">${retour ? `<div class="parcours-haut">${retour}</div>` : ''}`
        + `${ui.mascotte('attentive', { taille: 'moyenne' })}<p class="parcours-vide-texte">Ton premier prêt apparaîtra ici.</p>`
        + ui.bouton('Nouveau prêt', { action: 'nouveau-pret', icone: 'plus' }) + '</div>';
    }
    const autre = autreDe(p), t = termesDe(p);
    const s = situation(p);
    const phrase = p1(s.phrase || 'Tout est à jour.');
    const haut = `<div class="parcours-haut">${retour}`
      + `<button type="button" class="parcours-selecteur" data-action="parcours-selecteur" aria-haspopup="dialog" aria-label="${esc(`Prêt affiché : ${autre}${ui.certifie(autreId(p)) ? ', compte certifié' : ''}, ${euros(t.montant || 0)}. Changer de prêt`)}">`
      + `${ui.avatar(autreId(p), { taille: 's' })}<span class="parcours-selecteur-texte">${esc(autre)}${ui.certifie(autreId(p))}${esc(` · ${euros(t.montant || 0)}`)}</span>${ui.icone('chevron-bas', { taille: 20 })}</button>`
      + `<button type="button" class="icone-bouton parcours-menu" data-action="parcours-menu" data-pret-id="${esc(p.id)}" aria-haspopup="dialog" aria-label="Menu du prêt">${ui.icone('points')}</button></div>`;
    const titre = `<section class="parcours-etat">${ui.pucePret(p)}<h1 class="parcours-phrase" id="parcours-phrase">${esc(phrase)}</h1></section>`;
    const action = s.contenu ? `<section class="carte parcours-action" aria-labelledby="parcours-phrase">${s.pose ? ui.mascotte(s.pose, { taille: 'petite' }) : ''}${s.contenu}</section>` : '';
    // Bloc « Outils du test » du lot K (simulation.js), en bas d'un prêt en cours.
    // Aussi pendant l'attente des signatures Zen (relances), avec « Passer au lendemain ».
    const outils = (p.statut === 'en_cours' || p.statut === 'signatures') && window.simulation && typeof window.simulation.outilsDuTest === 'function' ? window.simulation.outilsDuTest(p.id) || '' : '';
    return `<div class="parcours">${haut}${titre}${carteDuPret(p)}${rangee(p)}${action}${chemin(p)}${outils}</div>`;
  }
  E.parcours = {
    rendu: rendreParcours,
    arrivee() {
      visite++;
      if (flash && flash.visite !== visite) { flash = null; routeur.rafraichir(); }
      routeur.plusTard(verifierPalier, 450);
    }
  };

  /* ---------- Liste des prêts : feuille du sélecteur et écran d'accueil du Parcours (P-9 n° 4) ---------- */
  function groupesPrets() {
    const prets = modele.prets().slice().reverse();
    const groupe = (titre, liste) => liste.length ? `<h3 class="parcours-groupe">${esc(titre)}</h3><div class="options">` + liste.map(p => {
      const t = termesDe(p), courant = p.id === pretAffiche;
      return `<button type="button" class="option parcours-option" data-action="parcours-choisir" data-pret-id="${esc(p.id)}"${courant ? ' aria-current="true"' : ''}>`
        + `${ui.avatar(autreId(p), { taille: 's' })}<span class="parcours-option-texte"><span class="option-titre">${esc(`${autreDe(p)} · ${euros(t.montant || 0)}`)}</span>`
        + `<span class="parcours-option-puce">${ui.pucePret(p)}</span></span>${courant ? ui.icone('coche', { libelle: 'Prêt affiché' }) : ui.icone('chevron-droite')}</button>`;
    }).join('') + '</div>' : '';
    return groupe('En cours', prets.filter(p => p.statut === 'en_cours'))
      + groupe('À valider', prets.filter(p => A_VALIDER.includes(p.statut)))
      + groupe('Terminés', prets.filter(p => TERMINES.includes(p.statut)));
  }
  A['parcours-selecteur'] = () => ui.feuille.ouvrir(groupesPrets(), { titre: 'Tes prêts' });
  // Depuis la feuille du sélecteur : on remplace le prêt affiché. Depuis la liste (P-9 n° 4) :
  // on empile, pour que la flèche de retour ramène à la liste.
  A['parcours-choisir'] = el => routeur.aller('parcours', { pretId: el.dataset.pretId }, { remplacer: !!routeur.courant().params.pretId });

  /* ---------- Menu « ⋯ » (spec 07 §2) ---------- */
  A['parcours-menu'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p) return;
    const role = modele.role(p), P = role === 'preteur';
    const ligne = (libelle, action, params = {}, attention = false) => `<button type="button" class="option parcours-ligne${attention ? ' parcours-ligne--attention' : ''}" data-action="${action}" data-pret-id="${esc(p.id)}"`
      + Object.entries(params).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('') + `><span class="option-titre">${esc(libelle)}</span>${ui.icone('chevron-droite')}</button>`;
    const chg = modele.changementEnAttente(p);
    const v = modele.derniereVersion(p);
    let h = ligne("Tout l'historique", 'aller', { route: 'historique' });
    if (tousSignes(p)) h += ligne('Reconnaissance de dette', 'aller', { route: 'document-apercu' });
    h += ligne('Si un jour ça coince', 'aller', { route: 'guide-coince' });
    if (['valide', 'en_cours'].includes(p.statut) && p.termes.formule === 'note' && !p.zen && !(chg && chg.type === 'passage_zen'))
      h += ligne('Passer le prêt en Zen', 'aller', { route: 'passage-zen' });
    if (peutPrevenirTiers(p)) h += ligne(`Prévenir ${modele.prenom(p.tiers.contactId)}`, 'aller', { route: 'tiers-prevenir' });
    if (['propose', 'negociation'].includes(p.statut) && v && v.auteurId === 'moi' && v.statut === 'en_attente') h += ligne('Retirer ma proposition', 'parcours-retirer');
    if (['attente_paiement_zen', 'signatures', 'valide'].includes(p.statut) && !(p.versement && p.versement.confirmePar)) h += ligne('Annuler le prêt', 'aller', { route: 'annuler' }, true);
    if (P && p.statut === 'en_cours') h += ligne('Clôturer le prêt', 'aller', { route: 'cloturer' }, true);
    ui.feuille.ouvrir(`<div class="options">${h}</div>`, { titre: `${autreDe(p)} · ${euros(termesDe(p).montant || 0)}` });
  };

  /* ---------- Retirer ma proposition (spec 04, sur le Parcours) ---------- */
  A['parcours-retirer'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p) return;
    ui.feuille.ouvrir(`<p>${esc(`${autreDe(p)} ne pourra plus l'accepter.`)}</p><div class="pile-reponses">`
      + ui.bouton('Retirer', { action: 'parcours-retirer-oui', params: { pretId: p.id } })
      + ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>', { titre: 'Retirer ta proposition ?' });
  };
  A['parcours-retirer-oui'] = el => {
    const r = retirer(el.dataset.pretId);
    if (!r.ok) console.warn('[TilliT] retirer :', r.erreur);
    ui.feuille.fermer(true);
  };

  /* ---------- Toucher un nœud : détail de l'échéance (spec 07 §7) ---------- */
  A['parcours-noeud'] = el => {
    const p = modele.pret(el.dataset.pretId);
    if (!p) return;
    const role = modele.role(p), P = role === 'preteur';
    const qui = id => (id === 'moi' ? 'Toi' : modele.prenom(id));
    const moyenTexte = m => (m === 'especes' ? 'Espèces' : 'Virement');
    if (el.dataset.numero === 'depart') {
      const v = p.versement;
      const lignes = [['Montant', euros(p.termes.montant)]];
      if (v) {
        lignes.push(['Moyen', moyenTexte(v.moyen)], ['Déclaré par', `${qui(v.declarePar)}, le ${date(v.date)}`]);
        if (v.confirmePar) lignes.push(['Confirmé par', `${qui(v.confirmePar)}, le ${date(v.dateConfirmation)}`]);
        if (v.moyen === 'virement' && p.reference) lignes.push(['Référence', C.referenceVersement(p.reference)]);
      }
      ui.feuille.ouvrir(ui.lignesRecap(lignes), { titre: 'Départ' });
      return;
    }
    const numero = Number(el.dataset.numero);
    const ech = modele.echeances(p);
    const e = ech.find(x => x.numero === numero);
    if (!e) return;
    const fige = p.statut === 'cloture' || p.statut === 'annule';
    const d = e.declaration;
    const lignes = [['Date', date(e.date)]];
    if (deplacee(e)) lignes.push(['Ancienne date', date(e.dateInitiale)]);
    lignes.push(['Montant', euros(e.montant)]);
    // Confirmation d'office (décision P-8 n° 6) : la mention suit l'état.
    const office = !!(d && d.confirmeeSansReponse);
    if (!fige || e.etat === 'remboursee') lignes.push(['État', C.libelleEcheance(e) + (office ? ' · Confirmée sans réponse' : '')]);
    if (d || e.reference) lignes.push(['Référence', d ? d.reference : e.reference]);
    if (d) {
      lignes.push(['Déclaré par', `${qui(d.auteurId)}, le ${date(d.date)}`]);
      if (office) lignes.push(['Confirmé', `Sans réponse, le ${date(d.dateConfirmation)}`]);
      else if (d.statut === 'confirmee') lignes.push(['Confirmé par', `${qui(p.preteurId)}, le ${date(d.dateConfirmation)}`]);
      lignes.push(['Moyen', moyenTexte(d.moyen)]);
    }
    let actions = '';
    // Reçu d'un remboursement confirmé (décision P-8 n° 1).
    if (d && d.statut === 'confirmee') {
      const l = lienRecu(p, d.id);
      actions += ui.bouton(l.libelle, { action: l.action, params: l.params, variante: 'secondaire' });
    }
    // Confirmé sans réponse : le prêteur garde la main pour en parler (décision P-8 n° 6).
    if (office && P) actions += allerVers(`Écrire à ${autreDe(p)}`, 'fil', p, {}, 'discret');
    if (p.statut === 'en_cours') {
      const libres = ech.filter(x => DECLARABLES.includes(x.etat));
      const rang = libres.findIndex(x => x.numero === numero) + 1;   // déclarer jusqu'à cette échéance
      if (P && e.etat === 'en_attente') actions += bouton('Oui, reçu', 'parcours-confirmer', p, { declId: d.id }) + bouton("Je n'ai rien vu", 'parcours-rien-vu', p, { declId: d.id }, 'secondaire');
      else if (P && e.etat === 'non_recue') actions += bouton('Oui, reçu', 'parcours-confirmer', p, { declId: d.id });
      else if (P && rang) actions += bouton("J'ai reçu", 'parcours-recu', p, { k: rang }, 'secondaire');
      else if (!P && e.etat === 'non_recue') actions += bouton('Déclarer à nouveau', 'parcours-declarer', p, { k: rang });
      else if (!P && rang) {
        actions += bouton("J'ai remboursé", 'parcours-declarer', p, { k: rang })
          + (e.reference ? `<div class="parcours-copier">${ui.boutonCopier(e.reference)}</div>` : '')
          + allerVers('Décaler cette échéance', 'decaler', p, { numero }, 'discret');
      }
    }
    const avance = !P && e.etat === 'remboursee' && e.enAvance ? '<p class="parcours-felicitation">Tu as remboursé une échéance en avance. Bien joué !</p>' : '';
    ui.feuille.ouvrir(ui.lignesRecap(lignes) + avance + (actions ? `<div class="pile-reponses">${actions}</div>` : ''), { titre: `Échéance du ${date(e.date)}` });
  };

  /* ==========================================================================
     Déclarer (emprunteur) ou « J'ai reçu » (prêteur) : un formulaire, deux
     présentations (feuille depuis le Parcours, écran depuis ailleurs).
     ========================================================================== */
  function nouveauForm(type, pretId, k, contexte) {
    form = { type, pretId, k: Math.max(1, Number(k) || 1), moyen: 'virement', date: modele.aujourdhui(), contexte };
    return form;
  }
  function htmlForm() {
    const p = modele.pret(form.pretId);
    if (!p) return '';
    const autre = autreDe(p);
    const libres = modele.echeances(p).filter(e => DECLARABLES.includes(e.etat));
    if (p.statut !== 'en_cours' || !libres.length) return `<p class="parcours-form-vide">${esc(p1('Tout est à jour.'))}</p>`;
    form.k = Math.min(Math.max(1, form.k), libres.length);
    const choisies = libres.slice(0, form.k);
    const montant = somme(choisies);
    const decl = form.type === 'decl';
    let h = `<div class="parcours-form"><div class="parcours-form-ligne"><span class="parcours-form-lib" id="parcours-form-ech">Échéances</span>`
      + `<div class="parcours-compteur" role="group" aria-labelledby="parcours-form-ech">`
      + `<button type="button" class="icone-bouton bt-pas" id="parcours-form-moins" data-action="parcours-form-moins" aria-label="Une échéance de moins"${form.k <= 1 ? ' disabled' : ''}><span aria-hidden="true">−</span></button>`
      + `<output class="parcours-compteur-val" aria-live="polite">${form.k}</output>`
      + `<button type="button" class="icone-bouton bt-pas" id="parcours-form-plus" data-action="parcours-form-plus" aria-label="Une échéance de plus"${form.k >= libres.length ? ' disabled' : ''}><span aria-hidden="true">+</span></button></div></div>`
      + `<p class="parcours-form-quoi">${esc(phraseEcheances(choisies))}</p>`
      // Décision P-8 n° 5 : c'est écrit là où l'on peut prendre de l'avance (plusieurs échéances d'un coup).
      + (decl && libres.length > 1 ? `<p class="parcours-form-avance">${esc('Rembourser en avance ne coûte rien.')}</p>` : '')
      + ui.lignesRecap([['Montant', euros(montant), { forte: true }]])
      + `<p class="champ-libelle" id="parcours-form-comment">Comment</p>`
      + `<div class="pastilles" role="group" aria-labelledby="parcours-form-comment">`
      + [['virement', 'Virement'], ['especes', 'Espèces']].map(([v, l]) => `<button type="button" class="pastille" data-action="parcours-form-moyen" data-valeur="${v}" aria-pressed="${form.moyen === v}">${l}</button>`).join('') + '</div>';
    if (decl) {
      if (form.moyen === 'virement') h += `<div class="parcours-form-ref">${ui.lignesRecap([['Référence', choisies[0].reference]])}${ui.boutonCopier(choisies[0].reference, { libelle: 'Copier' })}</div>`;
      const partie = choisies[0].etat !== 'non_recue' && LIBRES.includes(choisies[0].etat);
      if (partie) h += `<p class="parcours-form-partie">Tu as remboursé une partie seulement ?</p>`
        + ui.bouton('Payer une partie', { action: 'aller', variante: 'discret', params: { route: 'payer-partie', pretId: p.id, numero: choisies[0].numero }, classe: 'btn--centre' });
      h += ui.bouton(`Je déclare ${euros(montant)}`, { action: 'parcours-form-envoyer', id: 'parcours-form-envoyer' })
        + `<p class="parcours-form-note">${esc(`${autre} confirmera la réception.`)}</p>`;
    } else {
      h += ui.champ({ id: 'parcours-form-date', libelle: 'Quand', type: 'date', valeur: form.date, max: modele.aujourdhui(), saisie: 'parcours-form-date' })
        + ui.bouton(`Oui, j'ai reçu ${euros(montant)}`, { action: 'parcours-form-envoyer', id: 'parcours-form-envoyer' });
    }
    return h + '</div>';
  }
  function majForm(el) {
    if (form.contexte !== 'feuille') { routeur.rafraichir(); return; }
    const action = el && el.dataset.action, valeur = el && el.dataset.valeur;
    ui.feuille.maj(htmlForm());
    const cible = action && document.querySelector(`#feuille-corps [data-action="${action}"]${valeur ? `[data-valeur="${valeur}"]` : ''}`);
    const repli = document.querySelector('#feuille-corps button:not([disabled])');
    if (cible && !cible.disabled) cible.focus({ preventScroll: true }); else if (repli) repli.focus({ preventScroll: true });
  }
  function ouvrirForm(type, el) {
    nouveauForm(type, el.dataset.pretId, el.dataset.k, 'feuille');
    ui.feuille.ouvrir(htmlForm(), { titre: type === 'decl' ? "J'ai remboursé" : 'Tu as reçu un remboursement ?' });
  }
  A['parcours-declarer'] = el => ouvrirForm('decl', el);
  A['parcours-recu'] = el => ouvrirForm('recu', el);
  A['parcours-form-moins'] = el => { if (form) { form.k--; majForm(el); } };
  A['parcours-form-plus'] = el => { if (form) { form.k++; majForm(el); } };
  A['parcours-form-moyen'] = el => { if (form) { form.moyen = el.dataset.valeur === 'especes' ? 'especes' : 'virement'; majForm(el); } };
  S['parcours-form-date'] = (el, etat, params, type) => {
    if (!form || type !== 'change' || !el.value) return;
    form.date = el.value > modele.aujourdhui() ? modele.aujourdhui() : el.value;   // jamais dans le futur
    if (el.value !== form.date) el.value = form.date;
  };
  A['parcours-form-envoyer'] = () => {
    if (!form) return;
    const p = modele.pret(form.pretId);
    const libres = modele.echeances(p).filter(e => DECLARABLES.includes(e.etat));
    const choisies = libres.slice(0, form.k);
    if (!choisies.length) return;
    const numeros = choisies.map(e => e.numero), montant = somme(choisies);
    const dansFeuille = form.contexte === 'feuille';
    const retourPret = dansFeuille ? { libelle: 'Retour au prêt', action: 'fermer-feuille' } : { libelle: 'Retour au prêt', action: 'parcours-voir', params: { pretId: p.id } };
    if (form.type === 'decl') {
      const r = declarerRemboursement(p.id, numeros, form.moyen);
      if (!r.ok) { console.warn('[TilliT] declarerRemboursement :', r.erreur); return; }
      const succes = ui.carteSucces({ titre: "C'est noté.", texte: `${autreDe(p)} va confirmer la réception de tes ${euros(montant)}.`, bouton: retourPret });
      form = null;
      if (dansFeuille) ui.feuille.maj(succes); else routeur.aller('parcours-succes', { pretId: p.id, html: 'decl', montant }, { remplacer: true });
      return;
    }
    const avant = modele.rembourse(p);
    const r = declarerRecuPreteur(p.id, numeros, form.moyen, form.date);
    if (!r.ok) { console.warn('[TilliT] declarerRecuPreteur :', r.erreur); return; }
    form = null;
    apresConfirmation(p.id, montant, avant, numeros, r.rembourse, dansFeuille, r.declId);
  };

  /* ---------- Confirmer ou non un remboursement (prêteur) ---------- */
  A['parcours-confirmer'] = el => {
    const p = modele.pret(el.dataset.pretId);
    const d = p && p.declarations.find(x => x.id === el.dataset.declId);
    if (!d) return;
    const avant = modele.rembourse(p);
    const r = confirmerRemboursement(d.id);
    if (!r.ok) { console.warn('[TilliT] confirmerRemboursement :', r.erreur); return; }
    apresConfirmation(p.id, d.montant, avant, d.numeros, r.rembourse, true, d.id);
  };
  // P-9 n° 3 : après « Je n'ai rien vu », la feuille dit la suite au lieu de se refermer :
  // ce qui est noté, ce que {autre} reçoit, ce que le prêteur peut faire ensuite.
  function htmlRienVu(p, montant) {
    const autre = autreDe(p);
    return `<div class="parcours-rien-vu">
        <p>${esc(`Le remboursement de ${euros(montant)} reste en attente. Tu le confirmeras dès qu'il arrive.`)}</p>
        <p>${esc(p1(`${autre} est prévenu, avec la marche à suivre : vérifier le virement, le déclarer à nouveau ou t'écrire.`))}</p>
        <p class="texte-mute">${esc(`Un virement met parfois quelques jours à arriver. Regarde ton compte, puis reviens confirmer ici.`)}</p>
      </div>` + bouton('Voir le prêt', 'fermer-feuille', p)
      + allerVers(`Écrire à ${autre}`, 'fil', p, {}, 'secondaire');
  }
  A['parcours-rien-vu'] = el => {
    const p0 = modele.pret(el.dataset.pretId);
    const d = p0 && p0.declarations.find(x => x.id === el.dataset.declId);
    const montant = d ? d.montant : 0;
    const r = rienVu(el.dataset.declId);
    if (!r.ok) { console.warn('[TilliT] rienVu :', r.erreur); ui.feuille.fermer(true); return; }
    ui.feuille.ouvrir(htmlRienVu(modele.pret(r.pretId), montant), { titre: "C'est noté." });
  };
  // Carte de succès G-22 : « C'est noté. », « Il reste {reste} » et « -{montant} », barre recalculée, échéances restantes.
  function htmlSuccesConfirmation(p, montant, avant, bouton, declId) {
    const total = somme(p.echeances), reste = modele.reste(p), apres = modele.rembourse(p);
    const r = modele.echeances(p).filter(e => e.etat !== 'remboursee').length;
    return ui.carteSucces({ titre: "C'est noté.", bouton, lien: declId ? lienRecu(p, declId) : null,
      contenu: `<div class="parcours-succes"><p class="parcours-succes-reste">${esc(`Il reste ${euros(reste)}`)} <span class="parcours-succes-moins">${esc(`-${euros(montant)}`)}</span></p>`
        + `<div id="parcours-succes-barre" data-valeur="${total ? Math.round(apres / total * 100) : 0}">${ui.progression(total ? avant / total : 0, { libelle: 'Remboursé sur le total' })}</div>`
        + `<p>${esc(libelleRestantes(r))}</p><p class="texte-mute">${esc(`${autreDe(p)} voit la même chose que toi.`)}</p></div>` });
  }
  function animerBarre() {
    routeur.plusTard(() => {
      const z = document.getElementById('parcours-succes-barre');
      const s = z && z.querySelector('.progression > span'), b = z && z.querySelector('.progression');
      if (!s) return;
      s.style.width = `${z.dataset.valeur}%`;
      b.setAttribute('aria-valuenow', z.dataset.valeur);
    }, 80);
  }
  function apresConfirmation(pretId, montant, avant, numeros, rembourse, dansFeuille, declId) {
    if (rembourse) { routeur.aller('fin-pret', { pretId }); return; }
    flash = { pretId, type: 'confirme', numeros, visite, date: modele.aujourdhui() };
    const p = modele.pret(pretId);
    if (dansFeuille) {
      ui.feuille.ouvrir(htmlSuccesConfirmation(p, montant, avant, { libelle: 'Voir le prêt', action: 'parcours-succes-fermer' }, declId), {});
      animerBarre();
    } else routeur.aller('parcours-succes', { pretId, html: 'confirme', montant, avant, declId }, { remplacer: true });
  }
  A['parcours-succes-fermer'] = () => { ui.feuille.fermer(); routeur.plusTard(verifierPalier, 300); };
  A['parcours-voir'] = el => routeur.aller('parcours', { pretId: el.dataset.pretId }, { racine: true });
  // Écran de succès des formulaires ouverts en écran (depuis l'accueil, par exemple).
  E['parcours-succes'] = {
    rendu(etat, params) {
      const p = modele.pret(params.pretId);
      if (!p) return ui.enteteRetour({});
      const b = { libelle: params.html === 'confirme' ? 'Voir le prêt' : 'Retour au prêt', action: 'parcours-voir', params: { pretId: p.id } };
      return `<div class="parcours-ecran-succes">${params.html === 'confirme' ? htmlSuccesConfirmation(p, Number(params.montant), Number(params.avant), b, params.declId)
        : ui.carteSucces({ titre: "C'est noté.", texte: `${autreDe(p)} va confirmer la réception de tes ${euros(Number(params.montant))}.`, bouton: b })}</div>`;
    },
    arrivee(params) { if (params.html === 'confirme') animerBarre(); }
  };

  /* ==========================================================================
     Reçu d'un remboursement confirmé (décision P-8 n° 1) : affiché à l'écran,
     rien ne se télécharge dans le prototype.
     ========================================================================== */
  // Reste dû après ce remboursement : total des échéances moins les remboursements
  // confirmés jusqu'à celui-ci compris (par date de confirmation, puis ordre de déclaration).
  function resteApres(p, d) {
    const rang = x => [x.dateConfirmation || x.date, p.declarations.indexOf(x)];
    const [dDate, dOrdre] = rang(d);
    let cumul = 0;
    for (const x of p.declarations) {
      if (x.type !== 'remboursement' || x.statut !== 'confirmee') continue;
      const [xDate, xOrdre] = rang(x);
      if (xDate < dDate || (xDate === dDate && xOrdre <= dOrdre)) cumul += x.montant;
    }
    return somme(p.echeances) - cumul;
  }
  const lienRecu = (p, declId, libelle = 'Voir le reçu') =>
    ({ libelle, action: 'aller', params: { route: 'recu-remboursement', pretId: p.id, declId } });
  E['recu-remboursement'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    const d = p && p.declarations.find(x => x.id === params.declId);
    if (!p || !d || d.statut !== 'confirmee') return ui.enteteRetour({}) + `<p class="texte-mute">${esc(p1('Tout est à jour.'))}</p>`;
    const qui = id => (id === 'moi' ? modele.prenom('moi') || 'Toi' : modele.prenom(id));
    const confirmePar = d.confirmeeSansReponse ? 'Confirmé sans réponse, après 14 jours' : qui(p.preteurId);
    const lignes = [
      ['Prêt', `${autreDe(p)} · ${euros(somme(p.echeances) || p.termes.montant)}`],
      ['Référence', d.reference],
      ['Montant', euros(d.montant), { forte: true }],
      ['Déclaré le', date(d.date)],
      ['Confirmé le', date(d.dateConfirmation)],
      ['Moyen', d.moyen === 'especes' ? 'Espèces' : 'Virement'],
      ['Déclaré par', qui(d.auteurId)],
      ['Confirmé par', confirmePar],
      ['Reste dû après ce remboursement', euros(resteApres(p, d))]
    ];
    return ui.enteteRetour({}) + '<h1 class="titre">Reçu de remboursement</h1>'
      + ui.carte(ui.lignesRecap(lignes, { classe: 'parcours-recu-doc' }))
      + `<p class="texte-mute parcours-recu-mention">${esc('Document généré par TilliT pour votre suivi.')}</p>`
      + ui.bouton('Partager', { action: 'parcours-recu-partager', variante: 'secondaire' });
  };
  A['parcours-recu-partager'] = () => {
    ui.feuille.ouvrir('<p class="parcours-simulation">Simulation</p>'
      + `<p>${esc(p1("Dans ce prototype, le reçu reste à l'écran : rien ne part et rien ne se télécharge."))}</p>`
      + ui.bouton('Fermer', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }), { titre: 'Partager le reçu' });
  };

  /* ---------- Écrans remboursement-declarer et recu-preteur ---------- */
  function ecranForm(type) {
    return (etat, params) => {
      if (!form || form.pretId !== params.pretId || form.type !== type || form.contexte !== 'ecran') nouveauForm(type, params.pretId, params.k, 'ecran');
      const titre = type === 'decl' ? "J'ai remboursé" : 'Tu as reçu un remboursement ?';
      return ui.enteteRetour({ type: 'croix' }) + `<h1 class="titre">${esc(titre)}</h1>${htmlForm()}`;
    };
  }
  E['remboursement-declarer'] = ecranForm('decl');
  E['recu-preteur'] = ecranForm('recu');

  /* ---------- Versement vu de l'emprunteur (carte d'action, spec 06) ---------- */
  A['parcours-versement-oui'] = el => {
    const r = confirmerVersement(el.dataset.pretId);
    if (!r.ok) { console.warn('[TilliT] confirmerVersement :', r.erreur); return; }
    routeur.aller('pret-demarre', { pretId: el.dataset.pretId });
  };
  A['parcours-versement-pas-encore'] = el => {
    const r = pasEncoreVersement(el.dataset.pretId);
    if (!r.ok) { console.warn('[TilliT] pasEncoreVersement :', r.erreur); return; }
    ui.feuille.ouvrir(ui.carteSucces({ titre: "D'accord. Tu pourras confirmer dès que l'argent arrive.",
      bouton: { libelle: 'Retour au prêt', action: 'fermer-feuille' } }), {});
  };

  /* ==========================================================================
     Paliers (spec 09) : célébration plein écran, une seule fois par palier.
     ========================================================================== */
  function verifierPalier() {
    if (routeur.courant().route !== 'parcours' || !pretAffiche || ui.feuille.ouverte()) return;
    const p = modele.pret(pretAffiche);
    if (!p || p.statut !== 'en_cours') return;
    const palier = modele.palierAFeter(p);
    if (!palier) return;
    ui.celebration({ titre: libellePalier(palier), texte: `Vous débloquez ${recompenseDe(palier)}.`,
                     action: 'parcours-palier-continuer', params: { pretId: p.id, palier } });
  }
  A['parcours-palier-continuer'] = el => {
    const p = modele.pret(el.dataset.pretId), palier = Number(el.dataset.palier);
    ui.feuille.fermer(true);
    if (!p) return;
    // Le palier fêté, et ceux en dessous qui n'avaient pas été fêtés (plusieurs échéances d'un coup).
    const fetes = p.gamification.paliersFetes;
    for (const x of C.paliersAtteints(p, modele.aujourdhui())) if (x <= palier && !fetes.includes(x)) marquerPalierFete(p.id, x);
    flash = { pretId: p.id, type: 'palier', palier, visite, date: modele.aujourdhui() };
  };

  /* ---------- Ce qui arrive d'ailleurs (proche simulé) sur le prêt affiché ---------- */
  surEvenement(evt => {
    if (evt.type === 'reinitialisation') { flash = null; form = null; pretAffiche = null; return; }
    if (evt.type !== 'action' || !evt.pretId || evt.pretId !== pretAffiche || routeur.courant().route !== 'parcours') return;
    if (evt.acteurId !== 'moi' && (evt.nom === 'confirmerRemboursement' || evt.nom === 'declarerRecuPreteur')) {
      const r = evt.resultat || {};
      if (r.rembourse) { const id = evt.pretId; routeur.plusTard(() => routeur.aller('fin-pret', { pretId: id }), 600); return; }
      const p = modele.pret(evt.pretId), d = p && p.declarations.find(x => x.id === r.declId);
      flash = { pretId: evt.pretId, type: 'confirme', numeros: d ? d.numeros : [], visite, date: modele.aujourdhui() };
    }
    routeur.plusTard(verifierPalier, 450);
  });

  /* ==========================================================================
     historique (spec 07) : quoi, qui, quand ; groupé par mois ; lecture seule.
     Versement et remboursements viennent des données du prêt (une ligne par
     remboursement, même après une avance rapide) ; le reste vient du fil.
     ========================================================================== */
  const DU_PRET = ['versement_declare', 'versement_confirme', 'versement_recu', 'remboursement_declare', 'remboursement_confirme', 'remboursement_confirme_office', 'remboursement_recu'];
  function lignesHistorique(p) {
    const qui = id => (id === 'moi' ? 'toi' : modele.prenom(id));
    const moyen = m => (m === 'especes' ? 'espèces' : 'virement');
    const lignes = [];   // { date, ordre, texte, ancien }
    const fil = p.fil;
    const rang = (predicat) => { const i = fil.findIndex(predicat); return i < 0 ? fil.length : i; };
    fil.forEach((f, i) => {
      if (f.auteur !== 'tillit' || DU_PRET.includes(f.evt)) return;
      const l = { date: f.date, ordre: i, texte: modele.texteFil(f) };
      if (f.evt === 'changement_accepte' && f.donnees && f.donnees.type !== 'passage_zen') {
        const n = fil.slice(0, i + 1).filter(x => x.evt === 'changement_accepte' && x.donnees && x.donnees.type !== 'passage_zen').length;
        const c = p.changements.filter(x => x.statut === 'acceptee' && x.type !== 'passage_zen')[n - 1];
        if (c) l.ancien = c.avant;
      }
      lignes.push(l);
    });
    const v = p.versement;
    if (v) {
      const m = euros(p.termes.montant);
      const texte = !v.confirmePar ? `Versement de ${m} · envoyé par ${qui(v.declarePar)}`
        : v.declarePar === v.confirmePar ? `Versement de ${m} · reçu par ${qui(v.confirmePar)}`
        : `Versement de ${m} · envoyé par ${qui(v.declarePar)}, confirmé par ${qui(v.confirmePar)}`;
      const d = v.confirmePar ? v.dateConfirmation : v.date;
      lignes.push({ date: d, ordre: rang(f => ['versement_confirme', 'versement_recu', 'versement_declare'].includes(f.evt) && f.date === d), texte });
    }
    for (const dcl of p.declarations.filter(x => x.type === 'remboursement')) {
      const base = `Remboursement de ${euros(dcl.montant)} · ${dcl.reference} · ${moyen(dcl.moyen)}`;
      let texte, d;
      if (dcl.statut === 'confirmee' && dcl.auteurId === p.preteurId) { texte = `${base} · reçu par ${qui(p.preteurId)}`; d = dcl.date; }
      else if (dcl.statut === 'confirmee' && dcl.confirmeeSansReponse) { texte = `${base} · noté par ${qui(dcl.auteurId)}, confirmé sans réponse`; d = dcl.dateConfirmation; }
      else if (dcl.statut === 'confirmee') { texte = `${base} · noté par ${qui(dcl.auteurId)}, confirmé par ${qui(p.preteurId)}`; d = dcl.dateConfirmation; }
      else { texte = `${base} · noté par ${qui(dcl.auteurId)}`; d = dcl.date; }
      lignes.push({ date: d, ordre: rang(f => ['remboursement_confirme', 'remboursement_confirme_office', 'remboursement_recu', 'remboursement_declare'].includes(f.evt) && f.date === d
        && f.donnees && f.donnees.montant === dcl.montant), texte });
    }
    return lignes.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.ordre - b.ordre));
  }
  E.historique = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return ui.enteteRetour({}) + `<p class="texte-mute">${esc(p1('Tout est à jour.'))}</p>`;
    const lignes = lignesHistorique(p);
    const debut = lignes.length ? lignes[0].date : modele.aujourdhui();
    let h = '', mois = '';
    for (const l of lignes) {
      const m = textes.moisAnnee(l.date);
      if (m !== mois) { if (mois) h += '</ol>'; h += `<h2 class="parcours-mois">${esc(m)}</h2><ol class="parcours-histo">`; mois = m; }
      const ancien = l.ancien && l.ancien.length ? `<details class="parcours-ancien"><summary>Ancien calendrier</summary><ul>`
        + l.ancien.map(e => `<li>${esc(`${date(e.date)} · ${euros(e.montant)}`)}</li>`).join('') + '</ul></details>' : '';
      h += `<li><p>${esc(p1(`${l.texte} · ${date(l.date)}`))}</p>${ancien}</li>`;
    }
    if (mois) h += '</ol>';
    return ui.enteteRetour({}) + `<h1 class="titre">Tout l'historique</h1>`
      + `<p class="sous-titre">${esc(`${autreDe(p)} · ${euros(termesDe(p).montant || 0)} · depuis ${textes.moisAnnee(debut)}`)}</p>${h}`;
  };

  /* ---------- guide-coince (spec 07) : contenu à venir, renvoie aux outils du prêt ---------- */
  E['guide-coince'] = (etat, params) => {
    const p = params.pretId ? modele.pret(params.pretId) : null;
    let outils = '';
    if (p && modele.autre(p)) {
      outils = allerVers(`Écrire à ${autreDe(p)}`, 'fil', p);
      if (p.statut === 'en_cours' && modele.echeances(p).some(e => LIBRES.includes(e.etat)) && !modele.changementEnAttente(p))
        outils += allerVers('Proposer un nouveau calendrier', 'nouveau-calendrier', p, {}, 'secondaire');
    }
    return ui.enteteRetour({}) + ui.mascotte('guide', { taille: 'moyenne' }) + '<h1 class="titre">Si un jour ça coince</h1><p>Ce guide est en préparation.</p>'
      + (outils ? `<div class="pile-reponses">${outils}</div>` : '');
  };
})();
