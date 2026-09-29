/* ==========================================================================
   TilliT prototype · etat.js (lot 0)
   Modèle de données (spec 00 §4), persistance sessionStorage, machine à
   états du prêt (§5), API d'actions (§4.3), notifier(cle, donnees).

   Règle d'or : personne n'écrit dans l'état sauf les actions de ce fichier.
   Les écrans reçoivent une copie gelée (lecture seule). Chaque action :
   vérifie ses préconditions, modifie l'état, l'enregistre, ajoute
   l'événement au fil du prêt, émet les notifications du fichier 12, puis
   rend { ok: true, ... } ou { ok: false, erreur }.

   Qui agit ? Le testeur a l'id 'moi'. Quand le rôle suffit à le savoir
   (déclarer un versement = le prêteur), l'action le déduit. Sinon, un
   dernier paramètre facultatif acteurId (par défaut 'moi') permet au
   proche simulé (lot K) d'agir : signer, choisirParcoursSignature, ecrire,
   annuler, proposerChangement.
   ========================================================================== */
(function () {
  'use strict';
  const C = window.calculs, T = window.textes;
  const CLE = 'tillit-prototype-etat';
  const ETATS_LIBRES = ['a_declarer', 'prochaine', 'a_venir'];
  const JOURS_RAPPEL_POSSIBLES = [-5, -1, 0, 3, 5, 7];
  // P-9 n° 10 : galerie de la photo de profil. Teintes déjà posées dans ui.avatar,
  // illustrations déjà présentes dans assets/mascotte (table POSES de ui.js).
  const TEINTES_AVATAR = ['moi', 'lavande', 'peche', 'menthe', 'bleu'];
  const POSES_AVATAR = ['salut', 'heureuse', 'confiante', 'coup-de-coeur', 'anticipe', 'merci'];
  const CONTACTS_DEFAUT = [
    { id: 'c-leonie', prenom: 'Léonie', nom: 'Garnier', remplacant: 'Inès', certifie: true },
    { id: 'c-thomas', prenom: 'Thomas', nom: 'Berger', remplacant: 'Hugo', certifie: false },
    { id: 'c-nadia', prenom: 'Nadia', nom: 'Benali', certifie: false },
    { id: 'c-karim', prenom: 'Karim', nom: 'Haddad', certifie: true },
    { id: 'c-sofia', prenom: 'Sofia', nom: 'Lopes', certifie: false }
  ];

  function initial() {
    return {
      version: 1,
      horloge: { aujourdhui: C.isoLocal(), modeTemps: 'une_par_une' },
      session: { connecte: false, entree: 'normale', pretInvitationId: null },
      // P-9 n° 10 : avatar = { teinte, pose } ou null (initiales et teinte par défaut). P-9 n° 11 : tutorielVu.
      moi: { id: 'moi', prenom: null, nom: null, email: null, moyenCompte: null, certifie: false, depuis: null, creditZen: 0,
             avatar: null, tutorielVu: false,
             reglages: { joursRappel: [-5, 0, 3, 5, 7],
                         notif: { echeance: true, remboursement: true, proposition: true },
                         carnetPartageAuto: false } },
      contacts: [],
      prets: [],
      notifications: [],
      recompenses: { debloquees: [], titreActif: null },
      questionnaire: { propose: false, envoye: false },
      test: { scenariosAjoutes: false }
    };
  }

  /* ---------- Persistance et lecture ---------- */
  function charger() {
    try {
      const s = sessionStorage.getItem(CLE);
      if (!s) return null;
      const e = JSON.parse(s);
      return e && e.version === 1 ? e : null;
    } catch (err) { return null; }
  }
  let E = charger() || initial();
  let instantane = null;
  const ecouteurs = [];

  function geler(o) {
    Object.freeze(o);
    for (const k of Object.keys(o)) if (o[k] && typeof o[k] === 'object' && !Object.isFrozen(o[k])) geler(o[k]);
    return o;
  }
  // Copie gelée de l'état : ce que reçoivent les écrans et les gestionnaires.
  function lire() { if (!instantane) instantane = geler(structuredClone(E)); return instantane; }
  function emettre(evt) {
    for (const f of ecouteurs.slice()) {
      try { f(evt); } catch (err) { console.error('[TilliT] écouteur en erreur', err); }
    }
  }
  function enregistrer(evt) {
    instantane = null;
    try { sessionStorage.setItem(CLE, JSON.stringify(E)); } catch (err) { console.warn('[TilliT] sessionStorage indisponible', err); }
    emettre(evt);
  }
  function surEvenement(f) {
    ecouteurs.push(f);
    return () => { const i = ecouteurs.indexOf(f); if (i >= 0) ecouteurs.splice(i, 1); };
  }

  /* ---------- Outils internes ---------- */
  class Refus extends Error {}
  function exiger(condition, message) { if (!condition) throw new Refus(message); }
  const nouvelId = prefixe => `${prefixe}-${Math.random().toString(36).slice(2, 9)}`;
  const auj = () => E.horloge.aujourdhui;
  const copie = o => JSON.parse(JSON.stringify(o));
  const sansAccent = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  function trouverPret(id) { const p = E.prets.find(x => x.id === id); exiger(p, `prêt introuvable (${id})`); return p; }
  function trouverDecl(declId) {
    for (const p of E.prets) { const d = p.declarations.find(x => x.id === declId); if (d) return [p, d]; }
    throw new Refus(`déclaration introuvable (${declId})`);
  }
  function trouverChg(chgId) {
    for (const p of E.prets) { const c = p.changements.find(x => x.id === chgId); if (c) return [p, c]; }
    throw new Refus(`changement introuvable (${chgId})`);
  }
  const roleDe = (p, id = 'moi') => (p.preteurId === id ? 'preteur' : p.emprunteurId === id ? 'emprunteur' : null);
  const autreDe = (p, id = 'moi') => (p.preteurId === id ? p.emprunteurId : p.emprunteurId === id ? p.preteurId : null);
  const personneBrute = id => (id === 'moi' ? E.moi : E.contacts.find(c => c.id === id) || null);
  const prenomDe = id => (personneBrute(id) || {}).prenom || '';
  const derniere = p => p.versions[p.versions.length - 1] || null;
  const referencesPrises = () => E.prets.map(x => x.reference).filter(Boolean);
  const bothSigned = p => !!(p.zen && p.zen.signatures[p.preteurId] && p.zen.signatures[p.emprunteurId]);

  function assurerContacts() {
    for (const c of CONTACTS_DEFAUT) {
      if (!E.contacts.some(x => x.id === c.id)) E.contacts.push({ id: c.id, prenom: c.prenom, nom: c.nom, surTilliT: true, certifie: c.certifie, invitation: null });
      const x = E.contacts.find(y => y.id === c.id);
      if (typeof x.certifie !== 'boolean') x.certifie = c.certifie;   // état enregistré avant la pastille « Certifié »
    }
    // Un contact qui porte le prénom du testeur prend son prénom de remplacement (spec 00 §3).
    if (E.moi.prenom) {
      for (const c of CONTACTS_DEFAUT) {
        const x = E.contacts.find(y => y.id === c.id);
        if (c.remplacant && x && sansAccent(x.prenom) === sansAccent(E.moi.prenom)) x.prenom = c.remplacant;
      }
    }
  }

  function nouveauPret(preteurId, emprunteurId, initiateurId, termes) {
    return {
      id: nouvelId('p'), reference: null, preteurId, emprunteurId, initiateurId, statut: 'brouillon',
      versions: [], termes, zen: null, versement: null, echeances: [], declarations: [], changements: [], fil: [],
      tiers: null, carnet: { demandeVoir: 'aucune' }, gamification: { paliersFetes: [], pretParfait: false },
      fin: { merci: null, petitGeste: null, cadeauReste: null, resteCloture: null },
      annulation: null, contrePropositionsSimulees: 0,
      // Ajouts du lot 0 : date du passage à « valide » (plafond annuel), date de fin, drapeau de test (décision 3).
      dateValide: null, dateFin: null, test: { oublieProchaineEcheance: false }
    };
  }
  function termesParDefaut(preteurId, premiereDate) {
    return C.normaliserTermes({ montant: 50000, mode: 'duree', mensualite: 10000, duree: 5, derniere: 10000,
      premiereDate: premiereDate || C.premiereDateParDefaut(auj()), formule: 'note', payeurZenId: preteurId,
      motif: null, tiersContactId: null });
  }
  function zenInitial(p, payeurId) {
    return { payeurId, prix: C.prixZen(p.termes.montant), paye: false, datePaiement: null, creditUtilise: 0,
             supplementFC: {}, parcoursSignature: { [p.preteurId]: null, [p.emprunteurId]: null },
             signatures: { [p.preteurId]: null, [p.emprunteurId]: null }, relances: [] };
  }

  /* ---------- Fil du prêt : événements TilliT ---------- */
  const EVTS = {
    proposition_envoyee: n => `Proposition envoyée par ${n}`,
    proposition_nouvelle: n => `Nouvelle proposition de ${n}`,
    proposition_acceptee: n => `Conditions acceptées par ${n}`,
    proposition_refusee: n => `Proposition refusée par ${n}`,
    proposition_retiree: n => `Proposition retirée par ${n}`,
    proposition_expiree: () => 'Proposition expirée sans réponse',
    zen_paye: n => `Zen payé par ${n}`,
    signature: n => `Reconnaissance de dette signée par ${n}`,
    zen_signe: () => 'Signé par vous deux',
    pret_valide: () => 'Prêt validé',
    versement_declare: (n, d) => `Versement de ${d.montant} envoyé par ${n}`,
    versement_pas_encore: n => `Versement pas encore reçu, d'après ${n}`,
    versement_confirme: (n, d) => `Versement de ${d.montant} confirmé par ${n}`,
    versement_recu: (n, d) => `Versement de ${d.montant} reçu par ${n}`,
    remboursement_declare: (n, d) => `Remboursement de ${d.montant} noté par ${n}`,
    remboursement_confirme: (n, d) => `Remboursement de ${d.montant} confirmé par ${n}`,
    remboursement_confirme_office: (n, d) => `Remboursement de ${d.montant} confirmé sans réponse`,
    remboursement_non_recu: (n, d) => `Remboursement de ${d.montant} pas encore vu par ${n}`,
    remboursement_recu: (n, d) => `Remboursement de ${d.montant} reçu par ${n}`,
    pret_rembourse: () => 'Prêt remboursé',
    changement_propose: (n, d) => ({ decaler: `Nouvelle date proposée par ${n}`, partie: `Paiement d'une partie proposé par ${n}`,
                                     passage_zen: `Passage en Zen proposé par ${n}` }[d.type] || `Nouveau calendrier proposé par ${n}`),
    changement_accepte: (n, d) => (d.type === 'passage_zen' ? 'Passage en Zen accepté par vous deux'
      : d.type === 'decaler' ? 'Nouvelle date acceptée par vous deux' : 'Nouveau calendrier accepté par vous deux'),
    changement_refuse: (n, d) => {
      const quoi = d.type === 'passage_zen' ? 'le prêt sur Note' : 'le calendrier prévu';
      return n === 'toi' ? `Tu préfères garder ${quoi}` : `${n} préfère garder ${quoi}`;
    },
    tiers_accepte: (n, d) => `${d.tiers} a accepté d'être tiers de confiance`,
    tiers_alerte: (n, d) => `${d.tiers}, votre tiers de confiance, a rejoint le fil`,
    tiers_fin: (n, d) => `On a prévenu ${d.tiers} que le prêt est terminé`,   // aucun accord : le tiers peut être une femme
    pret_annule: n => `Prêt annulé par ${n}`,
    pret_cloture: (n, d) => (d.cadeau ? `Prêt clôturé par ${n}, reste offert : ${d.cadeau}` : `Prêt clôturé par ${n}`),
    petit_geste: (n, d) => `Petit geste de ${d.montant} offert par ${n}`
  };
  function texteEvenement(entree, toi) {
    const f = EVTS[entree.evt];
    if (!f) return entree.texte || '';
    const d = entree.donnees || {};
    const n = entree.acteurId === 'moi' && toi ? 'toi' : prenomDe(entree.acteurId);
    return f(n, { type: d.type, montant: d.montant != null ? T.euros(d.montant) : '',
                  cadeau: d.cadeau != null ? T.euros(d.cadeau) : null, tiers: prenomDe(d.tiersId) });
  }
  function evenement(p, evt, acteurId, donnees = {}, date) {
    const entree = { id: nouvelId('f'), auteur: 'tillit', evt, acteurId: acteurId || null, donnees, texte: '', date: date || auj() };
    entree.texte = texteEvenement(entree, false);
    p.fil.push(entree);
  }

  /* ---------- Notifications ---------- */
  let profondeur = 0;          // > 0 pendant une action (les actions imbriquées s'exécutent en ligne)
  let file = [];               // notifications à émettre après l'action
  let avance = null;           // pendant l'avance du temps : { pretId (prêt affiché), sansRappels }
  function notifPour(destinataireId, cle, donnees) {
    if (destinataireId !== 'moi') return;   // le proche simulé ne voit rien : seul le testeur reçoit
    const d = Object.assign({ quand: auj() }, donnees);
    // Bannières : prêt affiché seulement (spec 11 §2), et seulement pour le jour d'arrivée : un rappel d'un jour
    // déjà passé (« dans 5 jours » montré à J0) va dans la cloche sans bannière.
    if (avance && (d.pretId !== avance.pretId || (avance.cible && d.quand < avance.cible))) d.banniere = false;
    file.push([cle, d]);
  }

  function valeursNotif(p, d) {
    const v = {};
    if (p) {
      const autreId = autreDe(p);
      const t = (derniere(p) || {}).termes || p.termes || {};
      v.autre = prenomDe(autreId);
      v.tiers = p.tiers ? prenomDe(p.tiers.contactId) : (t.tiersContactId ? prenomDe(t.tiersContactId) : '');
      const payeurId = p.zen ? p.zen.payeurId : t.payeurZenId;
      v.payeur = payeurId === 'moi' ? 'toi' : prenomDe(payeurId);
      v.formule = (p.termes && p.termes.formule) || t.formule;
      v.montant = T.euros(t.montant || 0);
    }
    v.moi = E.moi.prenom || '';
    if (d.montant != null) v.montant = T.euros(d.montant);
    if (d.reste != null) v.reste = T.euros(d.reste);
    for (const k of ['date', 'nouvelle_date', 'date_declaration']) if (d[k]) v[k] = T.date(d[k], auj());
    for (const k of ['k', 'code', 'type', 'moyen', 'cas', 'envoyee', 'parTiers']) if (d[k] != null) v[k] = d[k];
    if (d.message != null) v.message = T.debut(d.message);
    return v;
  }

  // Interrupteurs « Notifications » des réglages (spec 09). Hors de cette liste, tout part toujours
  // (code de connexion, fin du prêt, rappels après l'échéance réglés par les jours choisis…).
  const REGLAGE_NOTIF = Object.freeze({
    rappel_jm5: 'echeance', rappel_jm1: 'echeance', rappel_j0: 'echeance',
    rembt_declare: 'remboursement', rembt_confirme: 'remboursement', rembt_recu_declare_par_preteur: 'remboursement',
    proposition_recue_e: 'proposition', proposition_recue_p: 'proposition', nouvelle_proposition: 'proposition'
  });
  // notifier(cle, donnees) : ajoute la notification à la cloche et montre la bannière.
  // donnees : { pretId, montant (centimes), date (AAAA-MM-JJ), ... , banniere: false, cloche: false, auToucher: fn,
  //             toujours: true (ignore les réglages : notifications de « Simuler ») }
  // Rend la notification créée, ou null si ce rôle n'a pas de texte pour cette clé.
  function notifier(cle, donnees = {}) {
    const def = window.TEXTES_NOTIF[cle];
    if (!def) { console.error(`[TilliT] notifier : clé inconnue « ${cle} ». Demande-la au lot 0, ne l'invente pas.`); return null; }
    if (profondeur > 0) { notifPour('moi', cle, donnees); return null; }
    if (REGLAGE_NOTIF[cle] && E.moi.reglages.notif[REGLAGE_NOTIF[cle]] === false && !donnees.toujours) return null;
    const p = donnees.pretId ? E.prets.find(x => x.id === donnees.pretId) : null;
    const role = p ? roleDe(p) : null;
    const gabarit = (role === 'preteur' ? def.P : role === 'emprunteur' ? def.E : undefined) || def.tous;
    if (!gabarit) return null;
    const v = valeursNotif(p, donnees);
    const texte = T.insecables(gabarit(v));
    const route = typeof def.ouvre === 'function' ? def.ouvre(v) : def.ouvre;
    const n = { id: nouvelId('n'), date: donnees.quand || auj(), cle, texte,
                lien: route ? { route, pretId: p ? p.id : null } : null, lue: false };
    if (donnees.cloche !== false) {
      E.notifications.unshift(n);
      enregistrer({ type: 'notification', notification: n });
    }
    if (donnees.banniere !== false && window.ui && window.ui.banniere) window.ui.banniere(n, donnees.auToucher);
    return n;
  }

  /* ---------- Enveloppe des actions ---------- */
  function action(nom, fn) {
    return function (...args) {
      if (profondeur > 0) {
        // Action imbriquée (proche simulé pendant l'avance du temps) : en ligne, dans l'action en cours.
        try { const r = fn(...args) || {}; instantane = null; emettre({ type: 'action', nom, pretId: r.pretId || null, acteurId: r.acteurId || 'moi', resultat: r, args }); return Object.assign({ ok: true }, r); }
        catch (err) { if (err instanceof Refus) { console.warn(`[TilliT] ${nom} refusé : ${err.message}`); return { ok: false, erreur: err.message }; } throw err; }
      }
      const sauvegarde = structuredClone(E);
      file = [];
      profondeur = 1;
      let r;
      try { r = fn(...args) || {}; debloquerRecompensesAtteintes(); }
      catch (err) {
        E = sauvegarde; file = []; instantane = null;
        if (err instanceof Refus) { console.warn(`[TilliT] ${nom} refusé : ${err.message}`); return { ok: false, erreur: err.message }; }
        console.error(`[TilliT] ${nom} : erreur interne`, err);
        return { ok: false, erreur: 'erreur interne' };
      } finally { profondeur = 0; avance = null; }
      const envois = file; file = [];
      enregistrer({ type: 'action', nom, pretId: r.pretId || null, acteurId: r.acteurId || 'moi', resultat: r, args });
      for (const [cle, d] of envois) notifier(cle, d);
      return Object.assign({ ok: true }, r);
    };
  }

  // Récompense de chaque palier (proposition de la spec 09 ; identifiants de l'écran des récompenses, carnet.js).
  const RECOMPENSE_DU_PALIER = Object.freeze({
    1: { id: 'conseil-1', libelle: 'un conseil' }, 3: { id: 'emoji-1', libelle: 'un emoji' },
    6: { id: 'tenue-lunettes', libelle: 'la tenue Lunettes de TilliT' }, 12: { id: 'tenue-plage', libelle: 'la tenue Plage de TilliT' },
    18: { id: 'titre-maitre-calendrier', libelle: 'le titre « Maître du calendrier »' }, 24: { id: 'tenue-noel', libelle: 'la tenue Noël de TilliT' },
    30: { id: 'conseil-2', libelle: 'un conseil' }, 36: { id: 'tenue-halloween', libelle: 'la tenue Halloween de TilliT' },
    48: { id: 'titre-pro-reference', libelle: 'le titre « Pro de la référence »' }, 60: { id: 'titre-pilier-echeances', libelle: 'le titre « Pilier des échéances »' }
  });
  // Après chaque action : un palier atteint (ou fêté) débloque sa récompense, une seule fois ;
  // un prêt remboursé et parfait débloque « Baron du remboursement ».
  function debloquerRecompensesAtteintes() {
    const ids = E.recompenses.debloquees;
    const ajouter = id => { if (id && !ids.includes(id)) ids.push(id); };
    for (const p of E.prets) {
      if (!roleDe(p) || p.statut === 'brouillon') continue;
      for (const n of new Set([...p.gamification.paliersFetes, ...C.paliersAtteints(p, auj())])) ajouter((RECOMPENSE_DU_PALIER[n] || {}).id);
      if (p.statut === 'rembourse' && p.gamification.pretParfait) ajouter('titre-baron');
    }
  }

  function verifierTermesOuRefus(t, p, acteurId) {
    const v = C.echeancier(t);
    exiger(v.valide, 'termes hors bornes : ' + v.erreurs.map(e => e.code).join(', '));
    exiger(t.formule === 'zen' || t.montant <= C.BORNES.noteMax, 'au-delà de 1 500 €, le prêt se fait avec Zen');
    exiger(t.formule !== 'zen' || t.payeurZenId === p.preteurId || t.payeurZenId === p.emprunteurId, 'payeur de Zen attendu');
    if (acteurId === 'moi') {
      const pl = C.plafondAnnuel(E, 'moi', roleDe(p) === 'preteur' ? 'prete' : 'emprunte', t.montant, auj().slice(0, 4), p.id);
      exiger(!pl.depasse, 'plafond annuel de 5 000 € dépassé');
    }
  }
  function passerValide(p) {
    p.statut = 'valide';
    p.dateValide = auj();
    evenement(p, 'pret_valide', null);
    // Tiers simulé : il accepte quand le prêt passe « valide » (spec 08, 11).
    if (p.tiers && !p.tiers.accepte) {
      p.tiers.accepte = true;
      evenement(p, 'tiers_accepte', null, { tiersId: p.tiers.contactId });
      notifPour('moi', 'tiers_accepte', { pretId: p.id });
    }
  }
  // P-11 (décision de Yohann du 24/09/2026) : le tiers prévenu pendant le prêt apprend que le prêt est
  // terminé (spec 10). Un tiers qui a seulement accepté le rôle ne reçoit rien. Aucun chiffre ne part chez lui.
  function prevenirTiersFin(p) {
    if (!p.tiers || !p.tiers.alerte) return;
    evenement(p, 'tiers_fin', null, { tiersId: p.tiers.contactId });
    notifPour('moi', 'tiers_fin', { pretId: p.id });
  }
  function terminerSiRembourse(p) {
    const etats = C.etatsEcheances(p, auj());
    if (!etats.length || !etats.every(e => e.etat === 'remboursee')) return false;
    p.statut = 'rembourse';
    p.dateFin = auj();
    p.gamification.pretParfait = C.pretParfait(p, auj());
    evenement(p, 'pret_rembourse', null);
    prevenirTiersFin(p);
    return true;
  }

  /* ==========================================================================
     API d'actions (spec 00 §4.3)
     ========================================================================== */
  const API = {};

  /* ----- Compte ----- */
  API.creerCompte = action('creerCompte', (infos = {}) => {
    const prenom = String(infos.prenom || '').trim() || 'Alex';
    const nom = String(infos.nom || '').trim() || 'Moreau';
    const moyen = infos.moyenCompte === 'france_identite' ? 'france_identite' : 'email';
    Object.assign(E.moi, {
      prenom, nom, email: String(infos.email || '').trim() || T.emailSimule(prenom), moyenCompte: moyen,
      certifie: typeof infos.certifie === 'boolean' ? infos.certifie : moyen === 'france_identite',
      depuis: E.moi.depuis || auj()
    });
    E.session.connecte = true;
    assurerContacts();
    return {};
  });
  API.seConnecter = action('seConnecter', (email) => {
    if (!E.moi.prenom) {
      Object.assign(E.moi, { prenom: 'Alex', nom: 'Moreau', email: String(email || '').trim() || 'alex@exemple.fr',
                             moyenCompte: 'email', certifie: false, depuis: auj() });
    }
    E.session.connecte = true;
    assurerContacts();
    return {};
  });
  // Remet tout à zéro : sessionStorage vidé, état initial (spec 01, D-06).
  function seDeconnecter() {
    try { sessionStorage.clear(); } catch (err) { /* navigation privée stricte : rien à vider */ }
    E = initial();
    instantane = null;
    file = [];
    emettre({ type: 'reinitialisation' });
    return { ok: true };
  }

  /* ----- Création et négociation ----- */
  // role : rôle du testeur dans ce prêt. Un seul brouillon à la fois ; changer de proche garde les termes saisis.
  API.creerBrouillon = action('creerBrouillon', (role, contactId) => {
    exiger(role === 'preteur' || role === 'emprunteur', 'rôle attendu : preteur ou emprunteur');
    exiger(contactId !== 'moi' && E.contacts.some(c => c.id === contactId), 'contact introuvable');
    const ancien = E.prets.find(x => x.statut === 'brouillon');
    const preteurId = role === 'preteur' ? 'moi' : contactId, emprunteurId = role === 'preteur' ? contactId : 'moi';
    let p;
    if (ancien && roleDe(ancien) === role) {
      p = ancien;
      p.preteurId = preteurId; p.emprunteurId = emprunteurId;
      if (p.termes.payeurZenId !== 'moi') p.termes.payeurZenId = contactId;
      if (p.termes.tiersContactId === contactId) p.termes.tiersContactId = null;
    } else {
      if (ancien) E.prets.splice(E.prets.indexOf(ancien), 1);
      p = nouveauPret(preteurId, emprunteurId, 'moi', termesParDefaut(preteurId));
      E.prets.push(p);
    }
    return { pretId: p.id };
  });
  // Met à jour les termes du brouillon en cours (fusion). Au-delà de 1 500 €, Zen est imposé.
  API.majBrouillon = action('majBrouillon', (termes = {}) => {
    const p = E.prets.find(x => x.statut === 'brouillon');
    exiger(p, 'aucun brouillon en cours');
    p.termes = C.normaliserTermes(Object.assign({}, p.termes, termes));
    if (p.termes.montant > C.BORNES.noteMax) p.termes.formule = 'zen';
    return { pretId: p.id };
  });
  API.envoyerProposition = action('envoyerProposition', (pretId) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'brouillon', "seul un brouillon s'envoie");
    const t = C.normaliserTermes(p.termes);
    verifierTermesOuRefus(t, p, 'moi');
    p.termes = t;
    p.reference = C.genererReference(referencesPrises());
    p.initiateurId = 'moi';
    p.versions.push({ n: 1, auteurId: 'moi', date: auj(), termes: copie(t), message: null, statut: 'en_attente' });
    p.statut = 'propose';
    evenement(p, 'proposition_envoyee', 'moi');
    return { pretId: p.id, reference: p.reference, acteurId: 'moi' };
  });
  function propositionEnAttente(p) {
    exiger(p.statut === 'propose' || p.statut === 'negociation', 'aucune proposition en cours sur ce prêt');
    const v = derniere(p);
    exiger(v && v.statut === 'en_attente', "la dernière proposition n'attend pas de réponse");
    return v;
  }
  // Répond celui qui n'est pas l'auteur de la dernière version.
  API.accepter = action('accepter', (pretId) => {
    const p = trouverPret(pretId);
    const v = propositionEnAttente(p);
    const acteurId = autreDe(p, v.auteurId);
    // Plafond du testeur contrôlé quel que soit celui qui accepte (deux propositions en parallèle).
    const pl = C.plafondAnnuel(E, 'moi', roleDe(p) === 'preteur' ? 'prete' : 'emprunte', v.termes.montant, auj().slice(0, 4), p.id);
    exiger(!pl.depasse, 'plafond annuel de 5 000 € dépassé');
    v.statut = 'acceptee';
    p.termes = copie(v.termes);
    p.echeances = C.echeancier(p.termes).echeances;
    if (p.termes.tiersContactId) p.tiers = { contactId: p.termes.tiersContactId, accepte: false, alerte: null };
    evenement(p, 'proposition_acceptee', acteurId);
    notifPour(v.auteurId, 'proposition_acceptee', { pretId: p.id });
    if (p.termes.formule === 'zen') { p.zen = zenInitial(p, p.termes.payeurZenId); p.statut = 'attente_paiement_zen'; }
    else passerValide(p);
    return { pretId: p.id, acteurId };
  });
  // termes : champs qui changent (fusionnés avec la version reçue). Refusé si rien ne change [C-31].
  API.proposerAutreChose = action('proposerAutreChose', (pretId, termes = {}, message = null) => {
    const p = trouverPret(pretId);
    const v = propositionEnAttente(p);
    const acteurId = autreDe(p, v.auteurId);
    const t = C.normaliserTermes(Object.assign({}, v.termes, termes));
    if (t.montant > C.BORNES.noteMax) t.formule = 'zen';
    exiger(!C.termesIdentiques(t, v.termes), "une proposition identique à la précédente ne s'envoie pas");
    verifierTermesOuRefus(t, p, acteurId);
    v.statut = 'remplacee';
    p.versions.push({ n: v.n + 1, auteurId: acteurId, date: auj(), termes: t, message: String(message || '').trim() || null, statut: 'en_attente' });
    p.termes = copie(t);
    p.statut = 'negociation';
    if (acteurId !== 'moi') p.contrePropositionsSimulees++;
    evenement(p, 'proposition_nouvelle', acteurId);
    notifPour(v.auteurId, 'nouvelle_proposition', { pretId: p.id });
    return { pretId: p.id, acteurId };
  });
  // message : un mot court, facultatif, montré à l'autre avec le refus (décision P-8 n° 4).
  API.refuser = action('refuser', (pretId, message = null) => {
    const p = trouverPret(pretId);
    const v = propositionEnAttente(p);
    const acteurId = autreDe(p, v.auteurId);
    v.statut = 'refusee';
    v.messageRefus = String(message || '').trim().slice(0, 500) || null;
    p.statut = 'refuse';
    p.dateFin = auj();
    evenement(p, 'proposition_refusee', acteurId);
    notifPour(v.auteurId, 'proposition_refusee', { pretId: p.id });
    return { pretId: p.id, acteurId };
  });
  // Seul l'auteur de la dernière version la retire, tant qu'elle n'est pas acceptée [D-21].
  API.retirer = action('retirer', (pretId) => {
    const p = trouverPret(pretId);
    const v = propositionEnAttente(p);
    v.statut = 'retiree';
    p.statut = 'retire';
    p.dateFin = auj();
    evenement(p, 'proposition_retiree', v.auteurId);
    notifPour(autreDe(p, v.auteurId), 'proposition_retiree', { pretId: p.id });
    return { pretId: p.id, acteurId: v.auteurId };
  });

  /* ----- Zen ----- */
  // Payé par le payeur désigné. Le crédit Zen du testeur se déduit ; le supplément FranceConnect s'ajoute.
  API.payerZen = action('payerZen', (pretId, avecFC = false) => {
    const p = trouverPret(pretId);
    exiger(p.zen && !p.zen.paye, "Zen n'est pas à payer sur ce prêt");
    exiger(['attente_paiement_zen', 'valide', 'en_cours'].includes(p.statut), 'statut incompatible avec le paiement de Zen');
    const payeur = p.zen.payeurId;
    let credit = 0;
    if (payeur === 'moi' && E.moi.creditZen > 0) { credit = Math.min(E.moi.creditZen, p.zen.prix); E.moi.creditZen -= credit; }
    Object.assign(p.zen, { paye: true, datePaiement: auj(), creditUtilise: credit });
    p.zen.supplementFC[payeur] = !!avecFC;
    p.zen.parcoursSignature[payeur] = avecFC ? 'franceconnect' : 'france_identite';
    if (p.statut === 'attente_paiement_zen') p.statut = 'signatures';
    evenement(p, 'zen_paye', payeur);
    notifPour(autreDe(p, payeur), 'zen_paye_par_autre', { pretId: p.id });
    return { pretId: p.id, acteurId: payeur, creditUtilise: credit,
             total: p.zen.prix - credit + (avecFC ? C.BORNES.supplementFC : 0) };
  });
  API.choisirParcoursSignature = action('choisirParcoursSignature', (pretId, parcours, acteurId = 'moi') => {
    const p = trouverPret(pretId);
    exiger(parcours === 'france_identite' || parcours === 'franceconnect', 'parcours : france_identite ou franceconnect');
    exiger(['signatures', 'valide', 'en_cours'].includes(p.statut), 'prêt annulé ou terminé');
    exiger(p.zen && p.zen.paye, 'Zen doit être payé avant la signature');
    exiger(roleDe(p, acteurId), 'seuls les deux proches signent');
    exiger(!p.zen.signatures[acteurId], 'déjà signé');
    if (acteurId === p.zen.payeurId && p.zen.parcoursSignature[acteurId]) {
      exiger(p.zen.parcoursSignature[acteurId] === parcours, 'parcours déjà choisi au paiement de Zen');
    }
    p.zen.parcoursSignature[acteurId] = parcours;
    if (parcours === 'franceconnect') p.zen.supplementFC[acteurId] = true;
    return { pretId: p.id, acteurId };
  });
  API.signer = action('signer', (pretId, acteurId = 'moi') => {
    const p = trouverPret(pretId);
    exiger(['signatures', 'valide', 'en_cours'].includes(p.statut), 'prêt annulé ou terminé');
    exiger(p.zen && p.zen.paye, 'Zen doit être payé avant la signature');
    exiger(roleDe(p, acteurId), 'seuls les deux proches signent');
    exiger(!p.zen.signatures[acteurId], 'déjà signé');
    if (!p.zen.parcoursSignature[acteurId]) p.zen.parcoursSignature[acteurId] = 'france_identite';
    p.zen.signatures[acteurId] = auj();
    evenement(p, 'signature', acteurId);
    if (bothSigned(p)) {
      evenement(p, 'zen_signe', null);
      // « Les deux » reçoivent zen_signe_par_deux ; le testeur qui vient de signer la voit dans la cloche, sans bannière.
      notifPour('moi', p.statut === 'signatures' ? 'zen_signe_par_deux' : 'zen_signe_passage', { pretId: p.id, banniere: acteurId !== 'moi' });
      if (p.statut === 'signatures') passerValide(p);
      else { p.termes.formule = 'zen'; p.termes.payeurZenId = p.zen.payeurId; }   // passage en Zen d'un prêt Note
    } else notifPour(autreDe(p, acteurId), 'signature_autre', { pretId: p.id });
    return { pretId: p.id, acteurId, lesDeux: bothSigned(p) };
  });

  /* ----- Versement ----- */
  API.declarerVersement = action('declarerVersement', (pretId, moyen = 'virement', date) => {
    const p = trouverPret(pretId);
    const quand = date || auj();
    exiger(p.statut === 'valide', 'le versement se déclare sur un prêt validé');
    exiger(!(p.versement && p.versement.confirmePar), 'versement déjà confirmé');
    exiger(moyen === 'virement' || moyen === 'especes', 'moyen : virement ou especes');
    exiger(quand <= auj(), 'la date ne peut pas être dans le futur');
    p.versement = { declarePar: p.preteurId, date: quand, moyen, confirmePar: null, dateConfirmation: null, pasEncore: false };
    evenement(p, 'versement_declare', p.preteurId, { montant: p.termes.montant });
    notifPour(p.emprunteurId, 'versement_declare', { pretId: p.id, montant: p.termes.montant });
    return { pretId: p.id, acteurId: p.preteurId };
  });
  API.confirmerVersement = action('confirmerVersement', (pretId) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'valide' && p.versement && !p.versement.confirmePar, 'aucun versement à confirmer');
    Object.assign(p.versement, { confirmePar: p.emprunteurId, dateConfirmation: auj(), pasEncore: false });
    p.statut = 'en_cours';
    evenement(p, 'versement_confirme', p.emprunteurId, { montant: p.termes.montant });
    notifPour(p.preteurId, 'versement_confirme', { pretId: p.id });
    return { pretId: p.id, acteurId: p.emprunteurId };
  });
  // « Pas encore » : le statut ne change pas [D-22].
  API.pasEncoreVersement = action('pasEncoreVersement', (pretId) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'valide' && p.versement && !p.versement.confirmePar, 'aucun versement à confirmer');
    p.versement.pasEncore = true;
    evenement(p, 'versement_pas_encore', p.emprunteurId);
    notifPour(p.preteurId, 'versement_pas_encore', { pretId: p.id, montant: p.termes.montant, moyen: p.versement.moyen });
    return { pretId: p.id, acteurId: p.emprunteurId };
  });
  // L'emprunteur déclare le premier « J'ai reçu » [A-43]. moyen et date sont facultatifs.
  API.declarerRecuEmprunteur = action('declarerRecuEmprunteur', (pretId, moyen = 'virement', date) => {
    const p = trouverPret(pretId);
    const quand = date || auj();
    exiger(p.statut === 'valide', 'le prêt doit être validé');
    exiger(!p.versement, "le prêteur a déjà déclaré l'envoi : utilise confirmerVersement");
    exiger(moyen === 'virement' || moyen === 'especes', 'moyen : virement ou especes');
    exiger(quand <= auj(), 'la date ne peut pas être dans le futur');
    p.versement = { declarePar: p.emprunteurId, date: quand, moyen, confirmePar: p.emprunteurId, dateConfirmation: auj(), pasEncore: false };
    p.statut = 'en_cours';
    evenement(p, 'versement_recu', p.emprunteurId, { montant: p.termes.montant });
    notifPour(p.preteurId, 'versement_recu_declare_par_emprunteur', { pretId: p.id, montant: p.termes.montant });
    return { pretId: p.id, acteurId: p.emprunteurId };
  });

  /* ----- Remboursements ----- */
  function echeancesLibres(p, numeros, etatsPermis) {
    const nums = [...new Set(numeros || [])];
    exiger(nums.length > 0, 'au moins une échéance');
    const etats = C.etatsEcheances(p, auj());
    const choisies = etats.filter(e => nums.includes(e.numero));
    exiger(choisies.length === nums.length, 'échéance inconnue');
    for (const e of choisies) exiger(etatsPermis.includes(e.etat), `échéance ${e.numero} déjà déclarée ou remboursée`);
    return choisies;   // triées par date
  }
  API.declarerRemboursement = action('declarerRemboursement', (pretId, numeros, moyen = 'virement') => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
    exiger(moyen === 'virement' || moyen === 'especes', 'moyen : virement ou especes');
    const choisies = echeancesLibres(p, numeros, [...ETATS_LIBRES, 'non_recue']);
    const montant = choisies.reduce((s, e) => s + e.montant, 0);
    const d = { id: nouvelId('d'), type: 'remboursement', auteurId: p.emprunteurId, numeros: choisies.map(e => e.numero),
                montant, moyen, reference: C.referenceRemboursement(p.reference, choisies[0].numero),
                date: auj(), statut: 'declaree', dateConfirmation: null };
    p.declarations.push(d);
    evenement(p, 'remboursement_declare', p.emprunteurId, { montant });
    notifPour(p.preteurId, 'rembt_declare', { pretId: p.id, montant });
    return { pretId: p.id, declId: d.id, acteurId: p.emprunteurId };
  });
  API.confirmerRemboursement = action('confirmerRemboursement', (declId) => {
    const [p, d] = trouverDecl(declId);
    exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
    exiger(d.type === 'remboursement' && (d.statut === 'declaree' || d.statut === 'non_recue'), 'rien à confirmer');
    d.statut = 'confirmee';
    d.dateConfirmation = auj();
    evenement(p, 'remboursement_confirme', p.preteurId, { montant: d.montant });
    const fini = terminerSiRembourse(p);
    notifPour(p.emprunteurId, fini ? 'pret_rembourse' : 'rembt_confirme', { pretId: p.id, montant: d.montant });
    return { pretId: p.id, declId, acteurId: p.preteurId, rembourse: fini };
  });
  API.rienVu = action('rienVu', (declId) => {
    const [p, d] = trouverDecl(declId);
    exiger(p.statut === 'en_cours' && d.type === 'remboursement' && d.statut === 'declaree', 'rien à marquer');
    d.statut = 'non_recue';
    evenement(p, 'remboursement_non_recu', p.preteurId, { montant: d.montant });
    notifPour(p.emprunteurId, 'rembt_non_recu', { pretId: p.id, montant: d.montant });
    return { pretId: p.id, declId, acteurId: p.preteurId };
  });
  // Le prêteur déclare avoir reçu : vaut confirmation, à sa date. moyen et date sont facultatifs.
  API.declarerRecuPreteur = action('declarerRecuPreteur', (pretId, numeros, moyen = 'virement', date) => {
    const p = trouverPret(pretId);
    const quand = date || auj();
    exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
    exiger(moyen === 'virement' || moyen === 'especes', 'moyen : virement ou especes');
    exiger(quand <= auj(), 'la date ne peut pas être dans le futur');
    const choisies = echeancesLibres(p, numeros, [...ETATS_LIBRES, 'non_recue']);
    const montant = choisies.reduce((s, e) => s + e.montant, 0);
    const d = { id: nouvelId('d'), type: 'remboursement', auteurId: p.preteurId, numeros: choisies.map(e => e.numero),
                montant, moyen, reference: C.referenceRemboursement(p.reference, choisies[0].numero),
                date: quand, statut: 'confirmee', dateConfirmation: quand };
    p.declarations.push(d);
    evenement(p, 'remboursement_recu', p.preteurId, { montant });
    const fini = terminerSiRembourse(p);
    notifPour(p.emprunteurId, fini ? 'pret_rembourse' : 'rembt_recu_declare_par_preteur', { pretId: p.id, montant });
    return { pretId: p.id, declId: d.id, acteurId: p.preteurId, rembourse: fini };
  });

  /* ----- Changements (spec 08) ----- */
  // chg : { type: 'calendrier', termes: { mode, mensualite, duree, premiereDate }, message }
  //     | { type: 'decaler', numero, nouvelleDate, message }
  //     | { type: 'partie', numero, partiePayee (centimes), moyen, nouvelleDate, message }
  //     | { type: 'passage_zen', payeurZenId, message }
  function construireChangement(p, chg, acteurId, partiePermise) {
    const c = { id: nouvelId('c'), type: chg.type, auteurId: acteurId, date: auj(), avant: [], apres: [],
                partiePayee: null, payeurZenId: null, termes: null, message: String(chg.message || '').trim() || null,
                statut: 'en_attente', reponses: [] };
    const etats = C.etatsEcheances(p, auj());
    const brut = e => ({ numero: e.numero, date: e.date, montant: e.montant, dateInitiale: e.dateInitiale || null });
    if (chg.type === 'calendrier') {
      exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
      const r = C.calendrierDuReste(p, chg.termes || {}, auj());
      exiger(r.valide, 'calendrier hors bornes : ' + r.erreurs.map(e => e.code).join(', '));
      const pareil = r.echeances.length === r.avant.length && r.echeances.every((e, i) => e.date === r.avant[i].date && e.montant === r.avant[i].montant);
      exiger(!pareil, 'rien ne change');
      c.avant = r.avant; c.apres = r.echeances; c.termes = copie(chg.termes);
    } else if (chg.type === 'decaler') {
      exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
      const e = etats.find(x => x.numero === chg.numero);
      exiger(e && ETATS_LIBRES.includes(e.etat), 'échéance à décaler introuvable, déjà déclarée ou remboursée');
      exiger(chg.nouvelleDate && chg.nouvelleDate > auj(), 'nouvelle date : au plus tôt demain');
      exiger(chg.nouvelleDate !== e.date, 'rien ne change');
      c.avant = [brut(e)];
      c.apres = [{ numero: e.numero, date: chg.nouvelleDate, montant: e.montant, dateInitiale: e.dateInitiale || e.date }];
    } else if (chg.type === 'partie') {
      exiger(partiePermise, 'on ne répond pas à un changement par un paiement partiel');
      exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
      exiger(acteurId === p.emprunteurId, "seul l'emprunteur paie une partie");
      const e = etats.find(x => x.numero === chg.numero);
      exiger(e && ETATS_LIBRES.includes(e.etat), 'échéance introuvable, déjà déclarée ou remboursée');
      const partie = Math.round(chg.partiePayee);
      exiger(partie > 0 && partie < e.montant, "la partie doit être inférieure au montant de l'échéance");
      exiger(chg.nouvelleDate && chg.nouvelleDate > auj(), 'date du reste : au plus tôt demain');
      const moyen = chg.moyen === 'especes' ? 'especes' : 'virement';
      const maxNum = Math.max(...p.echeances.map(x => x.numero));
      exiger(maxNum + 1 <= C.BORNES.dureeMax, 'plus de 60 échéances');
      // L'échéance est coupée en deux à la même date ; la partie payée est déclarée tout de suite (spec 08, voir 91).
      const orig = p.echeances.find(x => x.numero === e.numero);
      const reste = orig.montant - partie;
      orig.montant = partie;
      const nouvelle = { numero: maxNum + 1, date: orig.date, montant: reste, dateInitiale: null };
      p.echeances.push(nouvelle);
      const d = { id: nouvelId('d'), type: 'remboursement', auteurId: acteurId, numeros: [orig.numero], montant: partie, moyen,
                  reference: C.referenceRemboursement(p.reference, orig.numero), date: auj(), statut: 'declaree', dateConfirmation: null };
      p.declarations.push(d);
      evenement(p, 'remboursement_declare', acteurId, { montant: partie });
      notifPour(p.preteurId, 'rembt_declare', { pretId: p.id, montant: partie });
      c.partiePayee = partie; c.declId = d.id; c.numeroPartie = orig.numero;
      c.avant = [brut(nouvelle)];
      c.apres = [{ numero: nouvelle.numero, date: chg.nouvelleDate, montant: reste, dateInitiale: orig.date }];
    } else if (chg.type === 'passage_zen') {
      exiger(p.statut === 'valide' || p.statut === 'en_cours', 'le passage en Zen se fait sur un prêt validé ou en cours');
      exiger(p.termes.formule === 'note' && !p.zen, 'le prêt est déjà en Zen');
      exiger(chg.payeurZenId === p.preteurId || chg.payeurZenId === p.emprunteurId, 'payeur de Zen attendu');
      c.payeurZenId = chg.payeurZenId;
    } else throw new Refus('type de changement inconnu');
    return c;
  }
  function donneesChangement(p, c) {
    const d = { pretId: p.id, type: c.type };
    if (c.type === 'decaler') { d.date = c.avant[0].date; d.nouvelle_date = c.apres[0].date; }
    if (c.type === 'partie') { d.date = c.apres[0].dateInitiale; d.nouvelle_date = c.apres[0].date; }
    return d;
  }
  API.proposerChangement = action('proposerChangement', (pretId, chg = {}, acteurId = 'moi') => {
    const p = trouverPret(pretId);
    exiger(roleDe(p, acteurId), 'seuls les deux proches proposent un changement');
    exiger(!p.changements.some(c => c.statut === 'en_attente'), 'un changement attend déjà une réponse');
    const c = construireChangement(p, chg, acteurId, true);
    p.changements.push(c);
    evenement(p, 'changement_propose', acteurId, { type: c.type });
    notifPour(autreDe(p, acteurId), c.type === 'passage_zen' ? 'passage_zen_recu' : 'changement_recu', donneesChangement(p, c));
    return { pretId: p.id, chgId: c.id, declId: c.declId || null, acteurId };
  });
  function appliquerChangement(p, c) {
    if (c.type === 'passage_zen') { exiger(!p.zen, 'le prêt est déjà en Zen'); p.zen = zenInitial(p, c.payeurZenId); return; }
    const etats = C.etatsEcheances(p, auj());
    for (const a of c.avant) {
      const e = etats.find(x => x.numero === a.numero);
      exiger(e && ETATS_LIBRES.includes(e.etat), 'le calendrier a changé depuis la proposition');
    }
    if (c.type === 'calendrier') {
      const nums = c.avant.map(a => a.numero);
      p.echeances = p.echeances.filter(e => !nums.includes(e.numero)).concat(copie(c.apres));
      Object.assign(p.termes, { duree: p.echeances.length, mensualite: c.apres[0].montant, derniere: c.apres[c.apres.length - 1].montant });
    } else {
      for (const a of c.apres) Object.assign(p.echeances.find(x => x.numero === a.numero), { date: a.date, dateInitiale: a.dateInitiale });
    }
  }
  // reponse : 'accepte' | 'refuse' | 'autre' (avec contreProposition, même forme que proposerChangement, sauf 'partie').
  API.repondreChangement = action('repondreChangement', (chgId, reponse, contreProposition) => {
    const [p, c] = trouverChg(chgId);
    exiger(c.statut === 'en_attente', "ce changement n'attend plus de réponse");
    exiger(['accepte', 'refuse', 'autre'].includes(reponse), 'réponse : accepte, refuse ou autre');
    const acteurId = autreDe(p, c.auteurId);
    if (reponse === 'autre') {
      exiger(contreProposition && contreProposition.type, 'contre-proposition attendue');
      const n = construireChangement(p, contreProposition, acteurId, false);
      c.statut = 'remplace';
      c.reponses.push({ auteurId: acteurId, date: auj(), reponse: 'autre' });
      p.changements.push(n);
      if (acteurId !== 'moi') p.contrePropositionsSimulees++;
      evenement(p, 'changement_propose', acteurId, { type: n.type });
      notifPour(c.auteurId, n.type === 'passage_zen' ? 'passage_zen_recu' : 'changement_contre', donneesChangement(p, n));
      return { pretId: p.id, chgId: n.id, acteurId };
    }
    if (reponse === 'accepte') appliquerChangement(p, c);
    c.statut = reponse === 'accepte' ? 'acceptee' : 'refusee';
    c.reponses.push({ auteurId: acteurId, date: auj(), reponse });
    evenement(p, reponse === 'accepte' ? 'changement_accepte' : 'changement_refuse', acteurId, { type: c.type });
    notifPour(c.auteurId, reponse === 'accepte' ? 'changement_accepte' : 'changement_refuse', donneesChangement(p, c));
    return { pretId: p.id, chgId: c.id, acteurId };
  });

  /* ----- Fil, tiers, Carnet ----- */
  // acteurId : 'moi', l'autre proche, ou le contact tiers de confiance.
  API.ecrire = action('ecrire', (pretId, texte, acteurId = 'moi') => {
    const p = trouverPret(pretId);
    const t = String(texte || '').trim();
    exiger(t.length > 0, 'message vide');
    exiger(t.length <= 2000, 'message trop long (2 000 caractères au plus)');
    const parTiers = !!(p.tiers && p.tiers.contactId === acteurId);
    const auteur = parTiers ? 'tiers' : roleDe(p, acteurId);
    exiger(auteur, 'auteur inconnu pour ce prêt');
    p.fil.push({ id: nouvelId('f'), auteur, auteurId: acteurId, texte: t, date: auj() });
    if (acteurId !== 'moi') notifPour('moi', 'message_recu', { pretId: p.id, message: t, parTiers });
    return { pretId: p.id, acteurId };
  });
  API.alerterTiers = action('alerterTiers', (pretId) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'en_cours', 'le prêt doit être en cours');
    exiger(p.tiers && p.tiers.accepte, 'aucun tiers de confiance sur ce prêt');
    exiger(!p.tiers.alerte, 'le tiers a déjà été prévenu');
    p.tiers.alerte = auj();
    evenement(p, 'tiers_alerte', p.preteurId, { tiersId: p.tiers.contactId });
    notifPour('moi', 'tiers_alerte', { pretId: p.id });
    return { pretId: p.id, acteurId: p.preteurId };
  });
  API.demanderCarnet = action('demanderCarnet', (pretId) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'propose' || p.statut === 'negociation', 'seulement pendant une négociation');
    exiger(p.carnet.demandeVoir === 'aucune', 'le Carnet a déjà été demandé');
    p.carnet.demandeVoir = 'en_attente';
    notifPour(p.emprunteurId, 'carnet_demande', { pretId: p.id });
    return { pretId: p.id, acteurId: p.preteurId };
  });
  API.repondreCarnet = action('repondreCarnet', (pretId, oui) => {
    const p = trouverPret(pretId);
    exiger(p.carnet.demandeVoir === 'en_attente', 'aucune demande de Carnet en attente');
    p.carnet.demandeVoir = oui ? 'acceptee' : 'refusee';
    notifPour(p.preteurId, oui ? 'carnet_accepte' : 'carnet_refuse', { pretId: p.id });
    return { pretId: p.id, acteurId: p.emprunteurId };
  });

  /* ----- Fin du prêt ----- */
  // Possible pour l'un ou l'autre tant que le versement n'est pas confirmé (décision Q3).
  API.annuler = action('annuler', (pretId, acteurId = 'moi') => {
    const p = trouverPret(pretId);
    exiger(['attente_paiement_zen', 'signatures', 'valide'].includes(p.statut), "on annule seulement avant la confirmation du versement");
    exiger(!(p.versement && p.versement.confirmePar), 'versement confirmé : le prêt se clôture');
    exiger(roleDe(p, acteurId), 'seuls les deux proches annulent');
    let cas = null, credit = 0;
    if (p.zen && p.zen.paye) {
      if (bothSigned(p)) cas = 'zen_signe';
      else if (p.zen.payeurId === 'moi') { cas = 'credit_moi'; credit = p.zen.prix; E.moi.creditZen += credit; }
      else cas = 'credit_autre';
    }
    p.annulation = { parId: acteurId, date: auj(), creditZen: cas === 'credit_moi' || cas === 'credit_autre' };
    p.statut = 'annule';
    p.dateFin = auj();
    evenement(p, 'pret_annule', acteurId);
    notifPour(autreDe(p, acteurId), 'pret_annule', { pretId: p.id, cas });
    return { pretId: p.id, acteurId, cas, creditZen: credit };
  });
  // Décision n° 2 : avecCadeau vrai = « Faire cadeau du reste » ; faux = « Clôturer sans cadeau »
  // (le reste reste dû entre vous, hors de TilliT). Le reste est calculé ici.
  API.cloturer = action('cloturer', (pretId, avecCadeau) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'en_cours', 'seul un prêt en cours se clôture');
    const reste = C.resteARembourser(p, auj());
    p.fin.cadeauReste = avecCadeau ? reste : null;
    p.fin.resteCloture = reste;
    p.statut = 'cloture';
    p.dateFin = auj();
    evenement(p, 'pret_cloture', p.preteurId, { cadeau: avecCadeau ? reste : null });
    if (avecCadeau) notifPour(p.emprunteurId, 'cloture_cadeau', { pretId: p.id, reste });
    prevenirTiersFin(p);
    return { pretId: p.id, acteurId: p.preteurId, reste, cadeau: !!avecCadeau };
  });
  API.direMerci = action('direMerci', (pretId, texte) => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'rembourse', 'le merci se dit une fois le prêt remboursé');
    const t = String(texte || '').trim();
    exiger(t.length > 0 && t.length <= 2000, 'message vide ou trop long');
    p.fin.merci = t;
    p.fil.push({ id: nouvelId('f'), auteur: 'emprunteur', auteurId: p.emprunteurId, texte: t, date: auj() });
    notifPour(p.preteurId, 'merci_recu', { pretId: p.id });
    return { pretId: p.id, acteurId: p.emprunteurId };
  });
  API.declarerPetitGeste = action('declarerPetitGeste', (pretId, montant, moyen = 'virement') => {
    const p = trouverPret(pretId);
    exiger(p.statut === 'rembourse', 'le petit geste vient une fois le prêt remboursé');
    exiger(!p.fin.petitGeste, 'petit geste déjà déclaré');
    const m = Math.round(montant);
    exiger(m > 0 && m <= C.BORNES.montantMax, 'montant attendu');
    exiger(moyen === 'virement' || moyen === 'especes', 'moyen : virement ou especes');
    p.fin.petitGeste = { montant: m, moyen, date: auj() };
    evenement(p, 'petit_geste', p.emprunteurId, { montant: m });
    notifPour(p.preteurId, 'petit_geste_recu', { pretId: p.id, montant: m });
    return { pretId: p.id, acteurId: p.emprunteurId };
  });

  /* ----- Temps simulé (spec 11 §2) ----- */
  function pretPourLeTemps(pretId) {
    if (pretId) return trouverPret(pretId);
    const candidats = E.prets.filter(p => p.statut === 'en_cours').map(p => ({
      p, d: C.etatsEcheances(p, auj()).filter(e => e.etat !== 'remboursee' && e.date > auj()).map(e => e.date)[0] }))
      .filter(x => x.d).sort((a, b) => (a.d < b.d ? -1 : 1));
    exiger(candidats.length, 'aucun prêt en cours avec une échéance à venir');
    return candidats[0].p;
  }
  // Un jour simulé, pour tous les prêts : expiration (96 h), relances de signature, rappels, puis
  // l'événement { type: 'jour' } pour le proche simulé (lot K : déclaration à J0).
  function unJour(d) {
    E.horloge.aujourdhui = d;
    for (const p of E.prets) {
      if (p.statut === 'propose' || p.statut === 'negociation') {
        const v = derniere(p);
        if (v && v.statut === 'en_attente' && C.joursEntre(v.date, d) >= C.BORNES.expirationJours) {
          v.statut = 'expiree'; p.statut = 'expire'; p.dateFin = d;
          evenement(p, 'proposition_expiree', null);
          notifPour('moi', 'proposition_expiree', { pretId: p.id, envoyee: v.auteurId === 'moi' });
        }
      }
      if (p.zen && p.zen.paye && !bothSigned(p)) {
        const j = C.joursEntre(p.zen.datePaiement, d);
        if (j >= 1 && j <= 3) {
          p.zen.relances.push(d);
          if (roleDe(p) && !p.zen.signatures.moi) notifPour('moi', 'relance_signature', { pretId: p.id });
        }
      }
      // Remboursement déclaré par l'emprunteur et laissé sans réponse (décision P-8 n° 6) :
      // rappel au prêteur à J+3 et à J+10, confirmation d'office au 14e jour.
      if (p.statut === 'en_cours') {
        for (const decl of p.declarations.slice()) {
          if (decl.type !== 'remboursement' || decl.statut !== 'declaree' || decl.auteurId !== p.emprunteurId) continue;
          const j = C.joursEntre(decl.date, d);
          if (j === 3 || j === 10) {
            notifPour(p.preteurId, 'rappel_confirmation_office',
              { pretId: p.id, montant: decl.montant, date: C.ajouterJours(decl.date, C.BORNES.confirmationDofficeJours), quand: d });
          } else if (j >= C.BORNES.confirmationDofficeJours) {
            decl.statut = 'confirmee';
            decl.dateConfirmation = d;
            decl.confirmeeSansReponse = true;
            evenement(p, 'remboursement_confirme_office', null, { montant: decl.montant }, d);
            const fini = terminerSiRembourse(p);
            notifPour(p.preteurId, 'rembt_confirme_office', { pretId: p.id, montant: decl.montant, quand: d });
            notifPour(p.emprunteurId, fini ? 'pret_rembourse' : 'rembt_confirme_office', { pretId: p.id, montant: decl.montant, quand: d });
          }
        }
      }
      const role = roleDe(p);
      if (role && !(avance && avance.sansRappels && p.id === avance.pretId)) {
        for (const r of C.rappelsDuJour(p, d, E.moi.reglages.joursRappel, role)) {
          notifPour('moi', r.cle, { pretId: p.id, montant: r.cle === 'rappel_confirmation' || r.cle === 'rappel_non_recu' ? r.echeance.declaration.montant : r.echeance.montant,
            date: r.echeance.date, date_declaration: r.echeance.declaration ? r.echeance.declaration.date : null });
        }
      }
    }
    instantane = null;
    emettre({ type: 'jour', date: d, pretAffiche: avance ? avance.pretId : null });
  }
  function avancerJusqua(cible, pretAffiche, sansRappels = false) {
    avance = { pretId: pretAffiche, sansRappels, cible };
    let d = auj();
    while (d < cible) { d = C.ajouterJours(d, 1); unJour(d); }
  }
  // « Passer à la prochaine échéance » : jusqu'à la prochaine date d'échéance du prêt affiché, arrêt à J0.
  // pretId facultatif (le prêt affiché) ; sinon, le prêt en cours dont l'échéance à venir est la plus proche.
  API.avancerProchaineEcheance = action('avancerProchaineEcheance', (pretId) => {
    const p = pretPourLeTemps(pretId);
    exiger(p.statut === 'en_cours', 'le temps avance sur un prêt en cours');
    const cible = C.etatsEcheances(p, auj()).filter(e => e.etat !== 'remboursee' && e.date > auj()).map(e => e.date)[0];
    exiger(cible, 'aucune échéance à venir sur ce prêt');
    E.horloge.modeTemps = 'une_par_une';
    avancerJusqua(cible, p.id);
    return { pretId: p.id, date: cible };
  });
  // « Avance rapide » : jusqu'à la dernière échéance ; les autres sont marquées remboursées à l'heure
  // et confirmées ; une seule notification résume ; seul le plus haut palier franchi reste à fêter.
  API.avanceRapide = action('avanceRapide', (pretId) => {
    const p = pretPourLeTemps(pretId);
    exiger(p.statut === 'en_cours', 'le temps avance sur un prêt en cours');
    const etats = C.etatsEcheances(p, auj());
    const derniereE = etats[etats.length - 1];
    exiger(derniereE && derniereE.etat !== 'remboursee' && derniereE.date > auj(), 'rien à avancer sur ce prêt');
    const fetesAvant = p.gamification.paliersFetes.slice();
    const atteintsAvant = C.paliersAtteints(p, auj());
    let k = 0;
    for (const e of etats.slice(0, -1)) {
      if (e.etat === 'remboursee') continue;
      if (e.etat === 'en_attente' || e.etat === 'non_recue') {
        const d = p.declarations.find(x => x.id === e.declaration.id);
        d.statut = 'confirmee'; d.dateConfirmation = d.date;
      } else {
        const date = e.date > auj() ? e.date : auj();
        p.declarations.push({ id: nouvelId('d'), type: 'remboursement', auteurId: p.emprunteurId, numeros: [e.numero], montant: e.montant,
          moyen: 'virement', reference: C.referenceRemboursement(p.reference, e.numero), date, statut: 'confirmee', dateConfirmation: date });
      }
      k++;
    }
    const nouveaux = C.paliersAtteints(p, auj()).filter(x => !atteintsAvant.includes(x) && !fetesAvant.includes(x));
    if (nouveaux.length > 1) p.gamification.paliersFetes.push(...nouveaux.slice(0, -1));
    E.horloge.modeTemps = 'avance_rapide';
    // Le résumé passe en premier ; les rappels de ce prêt se taisent pendant l'avance ; la déclaration
    // du proche simulé à J0 de la dernière échéance (lot K) arrive ensuite normalement.
    notifPour('moi', 'avance_rapide_resume', { pretId: p.id, date: derniereE.date, k, quand: derniereE.date });
    avancerJusqua(derniereE.date, p.id, true);
    return { pretId: p.id, date: derniereE.date, k };
  });

  // Outil de test (Z1) : un jour de plus pendant l'attente des signatures Zen, pour vivre les relances
  // (toutes les 24 h pendant 3 jours, spec 11 §2), même quand aucun prêt n'est en cours.
  // P-9 (outils de test) : « Avancer de 3 jours », quel que soit le statut du prêt. Sert à voir une
  // proposition expirer (96 h) et la confirmation d'office arriver, sans rien bricoler.
  API.avancerJours = action('avancerJours', (pretId, n = 3) => {
    exiger(Number.isInteger(n) && n >= 1 && n <= 31, 'de 1 à 31 jours');
    const p = pretId ? trouverPret(pretId) : null;
    avancerJusqua(C.ajouterJours(auj(), n), p ? p.id : null);
    return { pretId: p ? p.id : null, date: auj() };
  });
  API.avancerUnJour = action('avancerUnJour', (pretId) => {
    const p = trouverPret(pretId);
    exiger(p.zen && p.zen.paye && !bothSigned(p) && ['signatures', 'valide', 'en_cours'].includes(p.statut), 'aucune signature Zen attendue sur ce prêt');
    avancerJusqua(C.ajouterJours(auj(), 1), p.id);
    return { pretId: p.id, date: auj() };
  });

  /* ----- Scénarios « Simuler » (spec 11 §3) ----- */
  function declConfirmee(p, e, auteurId) {
    return { id: nouvelId('d'), type: 'remboursement', auteurId, numeros: [e.numero], montant: e.montant, moyen: 'virement',
             reference: C.referenceRemboursement(p.reference, e.numero), date: e.date, statut: 'confirmee', dateConfirmation: e.date };
  }
  function pretEnCoursSimule(preteurId, emprunteurId, initiateurId, termes, dateAccord, nbRembourses) {
    const p = nouveauPret(preteurId, emprunteurId, initiateurId, termes);
    p.reference = C.genererReference(referencesPrises());
    E.prets.push(p);
    p.versions.push({ n: 1, auteurId: initiateurId, date: dateAccord, termes: copie(termes), message: null, statut: 'acceptee' });
    p.echeances = C.echeancier(termes).echeances;
    p.statut = 'en_cours';
    p.dateValide = dateAccord;
    p.versement = { declarePar: preteurId, date: dateAccord, moyen: 'virement', confirmePar: emprunteurId, dateConfirmation: dateAccord, pasEncore: false };
    evenement(p, 'proposition_envoyee', initiateurId, {}, dateAccord);
    evenement(p, 'proposition_acceptee', autreDe(p, initiateurId), {}, dateAccord);
    evenement(p, 'pret_valide', null, {}, dateAccord);
    evenement(p, 'versement_declare', preteurId, { montant: termes.montant }, dateAccord);
    evenement(p, 'versement_confirme', emprunteurId, { montant: termes.montant }, dateAccord);
    for (const e of p.echeances.slice(0, nbRembourses)) {
      p.declarations.push(declConfirmee(p, e, emprunteurId));
      evenement(p, 'remboursement_declare', emprunteurId, { montant: e.montant }, e.date);
      evenement(p, 'remboursement_confirme', preteurId, { montant: e.montant }, e.date);
    }
    return p;
  }
  // P-10 : rappelable. Une deuxième série s'ajoute à la première, avec de nouveaux identifiants
  // et de nouvelles références. scenariosAjoutes reste le drapeau « des prêts d'exemple sont là ».
  API.simulerScenarios = action('simulerScenarios', () => {
    assurerContacts();
    const T0 = auj();
    const base = (montant, duree, premiereDate, formule, payeurZenId) => C.normaliserTermes({ montant, mode: 'duree', duree, mensualite: 0,
      derniere: 0, premiereDate, formule, payeurZenId, motif: null, tiersContactId: null });

    // S1 · Tu empruntes, prêt en cours depuis 6 mois : Léonie, 1 200 € en 12 × 100 €, Note.
    const prem1 = C.ajouterMois(C.ajouterJours(T0, 5), -6);
    const p1 = pretEnCoursSimule('c-leonie', 'moi', 'c-leonie', base(120000, 12, prem1, 'note', 'c-leonie'), C.ajouterMois(prem1, -1), 6);
    p1.gamification.paliersFetes = [1, 3, 6];
    notifPour('moi', 'rappel_jm5', { pretId: p1.id, montant: p1.echeances[6].montant, date: p1.echeances[6].date, toujours: true });

    // S2 · Tu prêtes, le prêt se termine : Thomas, 500 € en 5 × 100 €, Zen payé par Thomas, signé par les deux.
    const prem2 = C.ajouterMois(T0, -4);
    const acc2 = C.ajouterMois(prem2, -1);
    const p2 = pretEnCoursSimule('moi', 'c-thomas', 'moi', base(50000, 5, prem2, 'zen', 'c-thomas'), acc2, 4);
    p2.zen = Object.assign(zenInitial(p2, 'c-thomas'), { paye: true, datePaiement: acc2,
      supplementFC: { 'c-thomas': false }, parcoursSignature: { moi: 'france_identite', 'c-thomas': 'france_identite' },
      signatures: { moi: acc2, 'c-thomas': acc2 } });
    evenement(p2, 'zen_paye', 'c-thomas', {}, acc2);
    evenement(p2, 'signature', 'c-thomas', {}, acc2);
    evenement(p2, 'signature', 'moi', {}, acc2);
    p2.gamification.paliersFetes = [1, 3];   // paliers passés : pas de célébration surprise (choix du lot 0)
    const e5 = p2.echeances[4];
    p2.declarations.push({ id: nouvelId('d'), type: 'remboursement', auteurId: 'c-thomas', numeros: [e5.numero], montant: e5.montant,
      moyen: 'virement', reference: C.referenceRemboursement(p2.reference, e5.numero), date: T0, statut: 'declaree', dateConfirmation: null });
    evenement(p2, 'remboursement_declare', 'c-thomas', { montant: e5.montant });
    notifPour('moi', 'rembt_declare', { pretId: p2.id, montant: e5.montant, toujours: true });

    // S3 · Négociation en cours : le testeur demande 800 € à Nadia (8 × 100 €, Note) ; Nadia propose 10 × 80 €.
    const t3a = base(80000, 8, C.premiereDateParDefaut(T0), 'note', 'c-nadia');
    const t3b = base(80000, 10, C.premiereDateParDefaut(T0), 'note', 'c-nadia');
    const p3 = nouveauPret('c-nadia', 'moi', 'moi', copie(t3b));
    p3.reference = C.genererReference(referencesPrises());
    E.prets.push(p3);
    p3.versions.push({ n: 1, auteurId: 'moi', date: T0, termes: t3a, message: null, statut: 'remplacee' });
    p3.versions.push({ n: 2, auteurId: 'c-nadia', date: T0, termes: t3b, message: 'Un peu plus étalé, ce serait plus simple pour moi.', statut: 'en_attente' });
    p3.statut = 'negociation';
    p3.contrePropositionsSimulees = 1;
    evenement(p3, 'proposition_envoyee', 'moi');
    evenement(p3, 'proposition_nouvelle', 'c-nadia');
    notifPour('moi', 'nouvelle_proposition', { pretId: p3.id, toujours: true });

    // S4 · Invitation reçue d'un prêteur : Karim propose 400 € en 4 × 100 €, Zen payé par le testeur.
    const t4 = base(40000, 4, C.premiereDateParDefaut(T0), 'zen', 'moi');
    const p4 = nouveauPret('c-karim', 'moi', 'c-karim', copie(t4));
    p4.reference = C.genererReference(referencesPrises());
    E.prets.push(p4);
    p4.versions.push({ n: 1, auteurId: 'c-karim', date: T0, termes: t4, message: null, statut: 'en_attente' });
    p4.statut = 'propose';
    evenement(p4, 'proposition_envoyee', 'c-karim');
    notifPour('moi', 'proposition_recue_e', { pretId: p4.id, montant: t4.montant, toujours: true });

    E.test.scenariosAjoutes = true;
    return { pretIds: [p1.id, p2.id, p3.id, p4.id] };
  });

  /* ----- Questionnaire (spec 11 §4) : seul envoi réseau du prototype, et seulement en ligne ----- */
  const marquerQuestionnaireEnvoye = action('marquerQuestionnaireEnvoye', () => { E.questionnaire.envoye = true; return {}; });
  // Rend une promesse { ok } ou { ok: false, erreur }. En local (localhost, fichier), rien ne part : échec honnête.
  async function envoyerQuestionnaire(reponses = {}) {
    const h = location.hostname;
    if (location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '') {
      return { ok: false, erreur: 'prototype ouvert en local : le formulaire ne part qu’une fois en ligne' };
    }
    const corps = new URLSearchParams({ 'form-name': 'avis-prototype' });
    for (const k of ['q1', 'q2', 'q3', 'q4', 'q5']) corps.append(k, String(reponses[k] ?? '').slice(0, 2000));
    try {
      // Adresse de la page elle-même, sans chemin écrit en dur : marche à la racine comme dans /prototype/.
      const r = await fetch(location.href.split('#')[0], { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: corps.toString() });
      if (!r.ok) return { ok: false, erreur: `réponse ${r.status}` };
      marquerQuestionnaireEnvoye();
      return { ok: true };
    } catch (err) { return { ok: false, erreur: 'réseau indisponible' }; }
  }

  /* ==========================================================================
     Actions complémentaires (hors 4.3), nécessaires aux lots pour ne jamais
     écrire directement dans l'état.
     ========================================================================== */
  // Lot C (inviter un proche, inviter un tiers) : crée un contact qui n'est pas sur TilliT.
  API.ajouterContact = action('ajouterContact', (infos = {}) => {
    const prenom = String(infos.prenom || '').trim() || 'Sam';
    const canal = infos.canal === 'email' ? 'email' : 'whatsapp';
    const adresse = String(infos.adresse || '').trim() || (canal === 'email' ? T.emailSimule(prenom) : '06 00 00 00 00');
    const c = { id: nouvelId('c'), prenom: prenom.slice(0, 60), nom: String(infos.nom || '').trim().slice(0, 60), surTilliT: false,
                invitation: { canal, adresse: adresse.slice(0, 120) } };
    E.contacts.push(c);
    return { contactId: c.id };
  });
  // Décision P-8 n° 3 : suivi de la proposition envoyée, vu par celui qui l'envoie.
  // etape : 'ouverte' (le lien de l'invitation a été ouvert) ou 'vue' (la proposition a été vue).
  // Les dates se posent sur la version en attente : une nouvelle proposition repart de zéro.
  API.marquerInvitation = action('marquerInvitation', (pretId, etape) => {
    const p = trouverPret(pretId);
    const v = propositionEnAttente(p);
    exiger(etape === 'ouverte' || etape === 'vue', "etape : 'ouverte' ou 'vue'");
    if (etape === 'vue' && !v.ouverte) v.ouverte = auj();
    if (!v[etape]) v[etape] = auj();
    return { pretId: p.id, acteurId: autreDe(p, v.auteurId), etape };
  });
  // Lot C : « Quitter la création ? Ce que tu as saisi sera perdu. »
  API.abandonnerBrouillon = action('abandonnerBrouillon', () => {
    E.prets = E.prets.filter(p => p.statut !== 'brouillon');
    return {};
  });
  // Lot A (#invitation) : crée le prêt de référence, Léonie prête 500 € en 5 × 100 € au testeur, Note [D-43].
  API.ouvrirInvitation = action('ouvrirInvitation', () => {
    assurerContacts();
    const deja = E.session.pretInvitationId && E.prets.find(p => p.id === E.session.pretInvitationId);
    if (deja) return { pretId: deja.id };
    const p = nouveauPret('c-leonie', 'moi', 'c-leonie', termesParDefaut('c-leonie'));
    p.reference = C.genererReference(referencesPrises());
    p.versions.push({ n: 1, auteurId: 'c-leonie', date: auj(), termes: copie(p.termes), message: null, statut: 'en_attente' });
    p.statut = 'propose';
    evenement(p, 'proposition_envoyee', 'c-leonie');
    E.prets.push(p);
    E.session.entree = 'invitation';
    E.session.pretInvitationId = p.id;
    return { pretId: p.id };
  });
  // Lot B : cloche.
  API.marquerLue = action('marquerLue', (notifId) => {
    const n = E.notifications.find(x => x.id === notifId);
    exiger(n, 'notification introuvable');
    n.lue = true;
    return {};
  });
  API.marquerToutesLues = action('marquerToutesLues', () => { for (const n of E.notifications) n.lue = true; return {}; });
  // Lots A et I : réglages. partiel : { joursRappel: [...], notif: { echeance, remboursement, proposition }, carnetPartageAuto }
  API.majReglages = action('majReglages', (partiel = {}) => {
    const r = E.moi.reglages;
    if (partiel.joursRappel) {
      exiger(Array.isArray(partiel.joursRappel) && partiel.joursRappel.every(j => JOURS_RAPPEL_POSSIBLES.includes(j)), 'jours de rappel : -5, -1, 0, 3, 5, 7');
      r.joursRappel = [...new Set(partiel.joursRappel)].sort((a, b) => a - b);
    }
    if (partiel.notif) for (const k of ['echeance', 'remboursement', 'proposition']) if (k in partiel.notif) r.notif[k] = !!partiel.notif[k];
    if ('carnetPartageAuto' in partiel) r.carnetPartageAuto = !!partiel.carnetPartageAuto;
    return {};
  });
  // Lots G et I : gamification.
  API.marquerPalierFete = action('marquerPalierFete', (pretId, palier) => {
    const p = trouverPret(pretId);
    exiger(C.PALIERS.includes(palier), 'palier inconnu');
    if (!p.gamification.paliersFetes.includes(palier)) p.gamification.paliersFetes.push(palier);
    return { pretId: p.id };
  });
  API.debloquerRecompense = action('debloquerRecompense', (id) => {
    exiger(typeof id === 'string' && id, 'identifiant de récompense attendu');
    if (!E.recompenses.debloquees.includes(id)) E.recompenses.debloquees.push(id);
    return {};
  });
  API.choisirTitre = action('choisirTitre', (id) => {
    exiger(id === null || E.recompenses.debloquees.includes(id), 'titre non débloqué');
    E.recompenses.titreActif = id;
    return {};
  });
  // Lot K : proposition du questionnaire vue ; outil de test « L'autre oublie la prochaine échéance » (décision 3).
  API.marquerQuestionnairePropose = action('marquerQuestionnairePropose', () => { E.questionnaire.propose = true; return {}; });
  // P-9 n° 10 : image de profil choisie dans la galerie (aucun téléversement dans le prototype).
  API.choisirAvatar = action('choisirAvatar', (avatar) => {
    if (avatar == null) { E.moi.avatar = null; return {}; }
    exiger(avatar && typeof avatar === 'object', 'avatar : { teinte, pose } ou null');
    exiger(TEINTES_AVATAR.includes(avatar.teinte), 'teinte inconnue');
    exiger(avatar.pose == null || POSES_AVATAR.includes(avatar.pose), 'illustration inconnue');
    E.moi.avatar = { teinte: avatar.teinte, pose: avatar.pose || null };
    return {};
  });
  // P-9 n° 11 : le tutoriel d'arrivée ne se montre qu'une fois tout seul.
  API.marquerTutorielVu = action('marquerTutorielVu', () => { E.moi.tutorielVu = true; return {}; });
  API.oublierProchaineEcheance = action('oublierProchaineEcheance', (pretId, oui = true) => {
    const p = trouverPret(pretId);
    p.test.oublieProchaineEcheance = !!oui;
    return { pretId: p.id };
  });

  /* ==========================================================================
     Lecture (modele.*) : toujours sur la copie gelée.
     ========================================================================== */
  const modele = {
    lire,
    aujourdhui: () => E.horloge.aujourdhui,
    pret: id => lire().prets.find(p => p.id === id) || null,
    brouillon: () => lire().prets.find(p => p.statut === 'brouillon') || null,
    // Tous les prêts visibles du testeur (sans le brouillon).
    prets: () => lire().prets.filter(p => p.statut !== 'brouillon'),
    personne: id => (id === 'moi' ? lire().moi : lire().contacts.find(c => c.id === id)) || null,
    prenom: id => ((id === 'moi' ? lire().moi : lire().contacts.find(c => c.id === id)) || {}).prenom || '',
    nomComplet: id => { const x = modele.personne(id) || {}; return [x.prenom, x.nom].filter(Boolean).join(' '); },
    role: (pret, id = 'moi') => roleDe(pret, id),
    autre: (pret, id = 'moi') => autreDe(pret, id),
    derniereVersion: pret => derniere(pret),
    aMoiDeRepondre: pret => (pret.statut === 'propose' || pret.statut === 'negociation') && !!derniere(pret)
      && derniere(pret).statut === 'en_attente' && derniere(pret).auteurId !== 'moi',
    changementEnAttente: pret => pret.changements.find(c => c.statut === 'en_attente') || null,
    echeances: pret => C.etatsEcheances(pret, E.horloge.aujourdhui),
    reste: pret => C.resteARembourser(pret, E.horloge.aujourdhui),
    rembourse: pret => C.montantRembourse(pret, E.horloge.aujourdhui),
    flamme: pret => C.flamme(pret, E.horloge.aujourdhui),
    palierAFeter: pret => C.palierAFeter(pret, E.horloge.aujourdhui),
    recompensePalier: n => RECOMPENSE_DU_PALIER[n] || null,   // { id, libelle } ou null
    plafond: (role, montant, pretIdExclu) => C.plafondAnnuel(lire(), 'moi', role === 'preteur' ? 'prete' : 'emprunte', montant,
                                                             E.horloge.aujourdhui.slice(0, 4), pretIdExclu),
    carnet: (id = 'moi') => C.carnet(lire(), id, E.horloge.aujourdhui),
    series: () => ({ emprunteur: C.serieEmprunteur(lire(), 'moi', E.horloge.aujourdhui),
                     preteur: C.seriePreteur(lire(), 'moi', E.horloge.aujourdhui) }),
    nonLues: () => lire().notifications.filter(n => !n.lue).length,
    // Texte d'une entrée du fil ; « toi » remplace le prénom du testeur dans les événements TilliT.
    texteFil: entree => (entree.auteur === 'tillit' ? texteEvenement(entree, true) : entree.texte),
    // Décision P-8 n° 3 : où en est la proposition que le testeur a envoyée. Rend { cle, texte } ou null.
    // Les deux premiers états ne valent que pour un proche invité (pas encore sur TilliT).
    suiviProposition: pret => {
      const v = derniere(pret);
      if (!v || v.auteurId !== 'moi') return null;
      // Le suivi ne concerne que la proposition : une fois le prêt en cours, il n'a plus rien à dire.
      if (['en_cours', 'rembourse', 'cloture', 'annule'].includes(pret.statut)) return null;
      if (v.statut === 'acceptee') return { cle: 'acceptee', texte: 'Acceptée' };
      if (v.statut === 'refusee') return { cle: 'refusee', texte: 'Refusée' };
      if (v.statut === 'expiree') return { cle: 'expiree', texte: 'Expirée' };
      if (v.statut !== 'en_attente') return null;
      if (v.vue) return { cle: 'vue', texte: 'Proposition vue' };
      const surTilliT = (personneBrute(autreDe(pret)) || {}).surTilliT !== false;
      if (surTilliT) return null;
      return v.ouverte ? { cle: 'ouverte', texte: 'Invitation ouverte' } : { cle: 'envoyee', texte: 'Invitation envoyée' };
    },
    // Puce de statut, vue du testeur (spec 00 §5). ton : 'action' | 'attente' | 'actif' | 'ok' | 'fin'.
    puce: pret => {
      const moiRole = roleDe(pret), autre = prenomDe(autreDe(pret));
      switch (pret.statut) {
        case 'propose': case 'negociation':
          return modele.aMoiDeRepondre(pret) ? { texte: 'Attend ta réponse', ton: 'action' } : { texte: 'Demande envoyée', ton: 'attente' };
        case 'refuse': return { texte: 'Refusée', ton: 'fin' };
        case 'retire': return { texte: 'Retirée', ton: 'fin' };
        case 'expire': return { texte: 'Expirée', ton: 'fin' };
        case 'attente_paiement_zen': {
          const moiPaie = pret.zen && pret.zen.payeurId === 'moi';
          return { texte: `Accord trouvé, en attente du paiement de Zen par ${moiPaie ? 'toi' : prenomDe(pret.zen && pret.zen.payeurId)}`, ton: moiPaie ? 'action' : 'attente' };
        }
        case 'signatures':
          return pret.zen && pret.zen.signatures.moi ? { texte: `Signature de ${autre} attendue`, ton: 'attente' } : { texte: 'À signer', ton: 'action' };
        case 'valide':
          if (pret.versement && !pret.versement.confirmePar) return { texte: 'Versement à confirmer', ton: moiRole === 'emprunteur' ? 'action' : 'attente' };
          return { texte: 'Prêt validé', ton: 'actif' };
        case 'en_cours': {
          if (moiRole === 'preteur' && pret.declarations.some(d => d.type === 'remboursement' && d.statut === 'declaree')) return { texte: 'Remboursement à confirmer', ton: 'action' };
          const c = modele.changementEnAttente(pret);
          if (c && c.type !== 'passage_zen') return { texte: 'Nouveau calendrier proposé', ton: c.auteurId === 'moi' ? 'attente' : 'action' };
          return { texte: 'Prêt en cours', ton: 'actif' };
        }
        case 'rembourse': return { texte: 'Remboursé', ton: 'ok' };
        case 'cloture': return { texte: 'Clôturé', ton: 'fin' };
        case 'annule': return { texte: 'Annulé', ton: 'fin' };
        default: return null;   // brouillon : aucune puce
      }
    }
  };

  /* ---------- Exposition : fonctions globales non réinscriptibles ---------- */
  const exposer = (nom, valeur) => Object.defineProperty(window, nom, { value: valeur, writable: false, configurable: false, enumerable: true });
  for (const nom of Object.keys(API)) exposer(nom, API[nom]);
  exposer('seDeconnecter', seDeconnecter);
  exposer('envoyerQuestionnaire', envoyerQuestionnaire);
  exposer('notifier', notifier);
  exposer('surEvenement', surEvenement);
  exposer('modele', Object.freeze(modele));
})();
