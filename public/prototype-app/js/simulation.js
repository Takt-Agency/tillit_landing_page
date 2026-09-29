/* ==========================================================================
   TilliT prototype · lot K · Proche simulé, temps, outils du test
   Spec : 11-simulation-et-test.md §1 à §3 et §6. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot K. N'écris que dans ce fichier et dans la
   section « lot K » de css/ecrans.css.

   Le proche simulé agit par les actions du socle, 3 à 5 s après le testeur ;
   ces actions émettent elles-mêmes bannières et notifications (fichier 12).
   - examiner() relit l'état et planifie ce que le proche doit faire : répondre,
     payer Zen, signer, verser, confirmer, dire merci. Une clé par situation,
     jamais deux réactions à la même chose. Relancé après chaque action du
     testeur et au chargement : une réaction perdue par un rechargement repart.
   - Événements : message du testeur dans le fil, demande de Carnet du prêteur
     simulé, déclaration à J0 pendant l'avance du temps (en ligne, sans délai).

   Exposé aux autres lots :
   - simulation.outilsDuTest(pretId) : HTML du bloc « Outils du test » (lot G, bas du Parcours d'un prêt en cours)
   - route 'simulation-outils' (lot I, Profil > Outils du test, avec « Simuler »)
   - action 'simulation-simuler' (lot B, lien « Simuler » de l'accueil vide)
   - simulation.graine(n) : tirages reproductibles (tests) ; simulation.graine() revient au hasard
   - verifierSimulation() : console, spec 11 §6
   ========================================================================== */
(function () {
  'use strict';
  const C = window.calculs, T = window.textes;
  const { euros, echapper } = T;
  const LIBRES = ['a_declarer', 'prochaine', 'a_venir'];
  const EN_NEGOCIATION = ['propose', 'negociation'];

  /* ---------- Hasard ---------- */
  // mulberry32 : générateur à graine, pour rejouer les mêmes tirages.
  function generateur(graine) {
    let a = graine >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let hasard = Math.random;
  const delai = () => 3000 + Math.round(Math.random() * 2000);   // 3 à 5 s (spec 11 §1)

  /* ==========================================================================
     Décisions (fonctions pures, contrôlées par verifierSimulation)
     ========================================================================== */
  // 50 / 35 / 15 tant qu'il n'a pas proposé autre chose sur ce prêt, puis 85 / 15.
  function tirerReponse(dejaContrePropose, u) {
    if (dejaContrePropose) return u < 0.85 ? 'accepte' : 'refuse';
    return u < 0.50 ? 'accepte' : u < 0.85 ? 'autre' : 'refuse';
  }

  // Ce qu'une nouvelle proposition du proche simulé peut changer, un seul élément à la fois.
  // ctx : { pret, simId, etat, aujourdhui }
  const autreQue = (pret, id) => (id === pret.preteurId ? pret.emprunteurId : pret.preteurId);
  // Même rythme : le mode « mensualité » garde la mensualité déjà calculée, donc le même échéancier.
  const memeRythme = (t, champs) => Object.assign({}, t, { mode: 'mensualite' }, champs);
  const ELEMENTS = [
    { nom: 'montant', applique: () => true,
      faire: t => {
        const montant = t.montant === C.BORNES.montantMin ? t.montant + 10000 : t.montant - 10000;
        return { termes: Object.assign({}, t, { montant, mode: 'duree', duree: t.duree }), message: `Je préfère partir sur ${euros(montant)}.` };
      } },
    { nom: 'rythme', applique: () => true,
      faire: (t, ctx) => {
        const plus = t.duree <= 58;
        // ponytail: « Un peu plus étalé » serait faux quand la durée baisse (au-delà de 58 mois) : on prend alors la phrase P de la spec.
        const message = ctx.simId === ctx.pret.preteurId || !plus ? 'Je préfère un rythme un peu différent.' : 'Un peu plus étalé, ce serait plus simple pour moi.';
        return { termes: Object.assign({}, t, { mode: 'duree', duree: t.duree + (plus ? 2 : -2) }), message };
      } },
    { nom: 'date', applique: () => true,
      faire: t => ({ termes: memeRythme(t, { premiereDate: C.ajouterMois(t.premiereDate, 1) }), message: 'Je préfère commencer un mois plus tard.' }) },
    { nom: 'payeur', applique: t => t.formule === 'zen',
      faire: (t, ctx) => {
        const payeurZenId = autreQue(ctx.pret, t.payeurZenId);
        return { termes: memeRythme(t, { payeurZenId }), message: payeurZenId === ctx.simId ? 'Je peux payer Zen, si tu veux.' : 'Tu pourrais prendre Zen à ta charge ?' };
      } },
    { nom: 'versNote', applique: t => t.formule === 'zen' && t.montant <= C.BORNES.noteMax,
      faire: t => ({ termes: memeRythme(t, { formule: 'note' }), message: "Je préfère qu'on reste sur Note." }) },
    { nom: 'versZen', applique: t => t.formule === 'note',
      faire: (t, ctx) => ({ termes: memeRythme(t, { formule: 'zen', payeurZenId: ctx.pret.preteurId }), message: "Je préfère qu'on signe une reconnaissance de dette avec Zen." }) }
  ];

  // Éléments changés entre deux termes déjà calculés, au sens du tableau de la spec 11 §1. Champs comparés
  // tels quels, sans repasser par calculs.differences qui les recalcule.
  const CHAMPS = ['montant', 'mensualite', 'duree', 'derniere', 'premiereDate', 'formule', 'payeurZenId'];
  function elementsChanges(a, b) {
    const d = CHAMPS.filter(c => !(c === 'payeurZenId' && a.formule !== 'zen' && b.formule !== 'zen') && (a[c] ?? null) !== (b[c] ?? null));
    const el = [];
    if (d.includes('montant')) el.push('montant');
    if (d.includes('duree') || (!d.includes('montant') && (d.includes('mensualite') || d.includes('derniere')))) el.push('rythme');
    if (d.includes('premiereDate')) el.push('date');
    if (d.includes('formule')) el.push('formule');
    else if (d.includes('payeurZenId')) el.push('payeur');
    return el;
  }

  // Valide : bornes (00 §6), Note jusqu'à 1 500 €, payeur de Zen parmi les deux, première date au plus tôt
  // demain, plafonds annuels des deux proches, et un seul élément changé par rapport à la version reçue.
  function propositionValide(t, recue, ctx) {
    if (!C.echeancier(t).valide) return false;
    if (t.formule !== 'zen' && t.montant > C.BORNES.noteMax) return false;
    if (t.formule === 'zen' && t.payeurZenId !== ctx.pret.preteurId && t.payeurZenId !== ctx.pret.emprunteurId) return false;
    if (!(t.premiereDate > ctx.aujourdhui)) return false;
    const annee = ctx.aujourdhui.slice(0, 4);
    if (C.plafondAnnuel(ctx.etat, ctx.pret.preteurId, 'prete', t.montant, annee, ctx.pret.id).depasse) return false;
    if (C.plafondAnnuel(ctx.etat, ctx.pret.emprunteurId, 'emprunte', t.montant, annee, ctx.pret.id).depasse) return false;
    return elementsChanges(recue, t).length === 1;
  }

  // Un élément tiré au hasard parmi ceux qui s'appliquent ; s'il ne donne pas une proposition valide,
  // on en tire un autre. Rend { element, termes, message } ou null.
  function contreProposition(recue, ctx, alea) {
    const candidats = ELEMENTS.filter(x => x.applique(recue));
    while (candidats.length) {
      const x = candidats.splice(Math.floor(alea() * candidats.length), 1)[0];
      const r = x.faire(recue, ctx);
      const termes = C.normaliserTermes(r.termes);
      if (propositionValide(termes, recue, ctx)) return { element: x.nom, termes, message: T.insecables(r.message) };
    }
    return null;
  }

  // Réponse à une proposition du testeur : { reponse: 'accepte' | 'autre' | 'refuse', contre }.
  function deciderProposition(recue, ctx, alea) {
    let reponse = tirerReponse(ctx.pret.contrePropositionsSimulees > 0, alea());
    let contre = null;
    if (reponse === 'autre') {
      contre = contreProposition(recue, ctx, alea);
      if (!contre) reponse = tirerReponse(true, alea());   // aucune variante valide : il accepte ou refuse
    }
    if (reponse === 'accepte') {
      // Plafonds annuels : le sien (il n'a pas d'autre prêt hors de l'état), et celui du testeur, contrôlé à
      // l'acceptation (00 §6) ; le socle ne le contrôle que quand c'est le testeur qui accepte.
      const annee = ctx.aujourdhui.slice(0, 4);
      if (C.plafondAnnuel(ctx.etat, ctx.pret.preteurId, 'prete', recue.montant, annee, ctx.pret.id).depasse
        || C.plafondAnnuel(ctx.etat, ctx.pret.emprunteurId, 'emprunte', recue.montant, annee, ctx.pret.id).depasse) reponse = 'refuse';
    }
    return contre ? { reponse, contre } : { reponse };
  }

  // Contre-proposition à un changement : durée ±1 mois (calendrier), date +7 jours (décaler, partie),
  // payeur inversé (passage en Zen). Jamais une partie (le socle le refuse). Rend le changement ou null.
  const memesEcheances = (a, b) => a.length === b.length && a.every((e, i) => e.date === b[i].date && e.montant === b[i].montant);
  function contreChangement(c, pret, aujourdhui) {
    if (c.type === 'calendrier') {
      const n = c.apres.length;
      const premiereDate = (c.termes && c.termes.premiereDate) || c.apres[0].date;
      for (const duree of [n + 1, n - 1]) {
        if (duree < 1) continue;
        const termes = { mode: 'duree', duree, mensualite: 0, premiereDate };
        const r = C.calendrierDuReste(pret, termes, aujourdhui);
        if (r.valide && !memesEcheances(r.echeances, r.avant) && !memesEcheances(r.echeances, c.apres)) return { type: 'calendrier', termes };
      }
      return null;
    }
    if (c.type === 'decaler' || c.type === 'partie') {
      const cible = c.apres[0];
      const nouvelleDate = C.ajouterJours(cible.date, 7);
      return nouvelleDate > aujourdhui ? { type: 'decaler', numero: cible.numero, nouvelleDate } : null;
    }
    if (c.type === 'passage_zen') return { type: 'passage_zen', payeurZenId: autreQue(pret, c.payeurZenId) };
    return null;
  }
  // Mêmes probabilités, même compteur que pour les propositions (une seule contre-proposition par prêt).
  function deciderChangement(c, pret, aujourdhui, alea) {
    let reponse = tirerReponse(pret.contrePropositionsSimulees > 0, alea());
    let contre = null;
    if (reponse === 'autre') {
      contre = contreChangement(c, pret, aujourdhui);
      if (!contre) reponse = tirerReponse(true, alea());
    }
    return contre ? { reponse, contre } : { reponse };
  }

  // Échéances que l'emprunteur simulé déclare le jour d, qui est leur date (J0).
  const aDeclarerAJ0 = (etatsEcheances, d) => etatsEcheances.filter(e => e.date === d && LIBRES.includes(e.etat)).map(e => e.numero);

  /* ==========================================================================
     Réactions du proche simulé (spec 11 §1)
     ========================================================================== */
  const minuteries = new Map();   // clé -> minuterie en cours
  const faites = new Set();       // clés déjà jouées : une seule réaction par situation
  let enAction = 0;               // > 0 pendant une action du proche simulé : ses propres événements sont ignorés
  let nMessages = 0;

  const connecte = () => window.modele.lire().session.connecte;
  function jouer(fn) {
    enAction++;
    try { return fn(); }
    catch (err) { console.error('[TilliT] proche simulé en erreur', err); return null; }
    finally { enAction--; }
  }
  // P-9 (outils de test) : « L'autre ne répond pas » suspend tout ce que le proche simulé ferait.
  // Rien n'est marqué comme fait : à la reprise, examiner() replanifie ce qui restait.
  let muet = false;
  function taire(oui) {
    muet = !!oui;
    if (!muet) { examiner(); return; }
    for (const m of minuteries.values()) clearTimeout(m);
    minuteries.clear();
  }
  // Joue fn 3 à 5 s plus tard, une seule fois pour cette clé, puis réexamine l'état (la suite : accord
  // puis versement, paiement puis signature…).
  function planifier(cle, fn, ms) {
    if (muet || faites.has(cle) || minuteries.has(cle)) return;
    minuteries.set(cle, setTimeout(() => {
      minuteries.delete(cle);
      faites.add(cle);
      if (!connecte()) return;
      jouer(fn);
      examiner();
    }, ms || delai()));
  }
  function toutAnnuler() {
    for (const m of minuteries.values()) clearTimeout(m);
    minuteries.clear();
    faites.clear();
  }
  const contexte = (p, simId) => ({ pret: p, simId, etat: window.modele.lire(), aujourdhui: window.modele.aujourdhui() });

  // Mot du refus (décision P-8 n° 4) : facultatif, une fois sur deux, sans reproche.
  const MOT_REFUS = "Je ne peux pas m'engager là-dessus en ce moment. On en reparle bientôt.";
  function repondreProposition(p, v, simId) {
    const d = deciderProposition(v.termes, contexte(p, simId), hasard);
    if (d.reponse === 'accepte') return window.accepter(p.id);
    if (d.reponse === 'refuse') return window.refuser(p.id, hasard() < 0.5 ? MOT_REFUS : null);
    return window.proposerAutreChose(p.id, d.contre.termes, d.contre.message);
  }
  function repondreAuChangement(p, c) {
    const d = deciderChangement(c, p, window.modele.aujourdhui(), hasard);
    if (d.reponse === 'autre') return window.repondreChangement(c.id, 'autre', d.contre);
    const r = window.repondreChangement(c.id, d.reponse);
    // Le calendrier a bougé depuis la proposition (déclaration entre-temps) : il ne peut plus accepter, il refuse.
    return r.ok || d.reponse !== 'accepte' ? r : window.repondreChangement(c.id, 'refuse');
  }

  // Suivi de la proposition envoyée par le testeur (décision P-8 n° 3) : le proche ouvre le lien de
  // l'invitation, puis voit la proposition, avant de répondre (3 à 5 s). Un proche déjà sur TilliT
  // n'ouvre aucune invitation : il voit la proposition, c'est tout.
  function marquerSuivi(pretId, etape) {
    const q = window.modele.pret(pretId), v = q && window.modele.derniereVersion(q);
    return v && v.auteurId === 'moi' && v.statut === 'en_attente' ? window.marquerInvitation(pretId, etape) : null;
  }
  function suivreInvitation(p) {
    const v = window.modele.derniereVersion(p);
    if (!v || v.auteurId !== 'moi' || v.statut !== 'en_attente') return;
    const invite = (window.modele.personne(window.modele.autre(p)) || {}).surTilliT === false;
    // 1,5 s puis 2,5 s : les deux pas se voient avant la réponse, qui n'arrive jamais avant 3 s.
    if (invite) planifier(`invitation-ouverte:${p.id}:${v.n}`, () => marquerSuivi(p.id, 'ouverte'), 1500);
    planifier(`invitation-vue:${p.id}:${v.n}`, () => marquerSuivi(p.id, 'vue'), 2500);
  }

  // Ce que le proche simulé doit faire sur ce prêt, d'après l'état : [{ cle, faire }].
  function aFaire(p) {
    const M = window.modele;
    const simId = M.autre(p);
    if (!simId || p.statut === 'brouillon') return [];
    const r = [], simPreteur = p.preteurId === simId, v = M.derniereVersion(p);
    const ajouter = (cle, faire) => r.push({ cle, faire });
    // Proposition du testeur (après la demande de Carnet du prêteur simulé, s'il y en a une en route).
    if (EN_NEGOCIATION.includes(p.statut) && v && v.statut === 'en_attente' && v.auteurId === 'moi' && !minuteries.has(`carnet-demande:${p.id}`))
      ajouter(`proposition:${p.id}:${v.n}`, () => repondreProposition(p, v, simId));
    // Zen : le payeur simulé paie après l'accord ; le signataire simulé signe après le paiement.
    if (p.zen && !p.zen.paye && p.zen.payeurId === simId && ['attente_paiement_zen', 'valide', 'en_cours'].includes(p.statut))
      ajouter(`payer:${p.id}`, () => window.payerZen(p.id, false));
    if (p.zen && p.zen.paye && !p.zen.signatures[simId] && ['signatures', 'valide', 'en_cours'].includes(p.statut))
      ajouter(`signer:${p.id}`, () => window.signer(p.id, simId));
    // Versement : le prêteur simulé déclare (prêt validé, Zen signé par les deux s'il y en a un, virement, date du jour) ;
    // l'emprunteur simulé confirme.
    if (p.statut === 'valide' && simPreteur && !p.versement && (!p.zen || (p.zen.signatures[p.preteurId] && p.zen.signatures[p.emprunteurId])))
      ajouter(`verser:${p.id}`, () => window.declarerVersement(p.id, 'virement', M.aujourdhui()));
    if (p.statut === 'valide' && !simPreteur && p.versement && !p.versement.confirmePar)
      ajouter(`recu:${p.id}`, () => window.confirmerVersement(p.id));
    // Remboursements : le prêteur simulé confirme chaque déclaration du testeur.
    if (p.statut === 'en_cours' && simPreteur) {
      for (const d of p.declarations) {
        if (d.type === 'remboursement' && d.statut === 'declaree' && d.auteurId === 'moi') ajouter(`confirmer:${d.id}`, () => window.confirmerRemboursement(d.id));
      }
    }
    // Changement proposé par le testeur : accepte, propose autre chose ou refuse.
    for (const c of p.changements) {
      if (c.statut === 'en_attente' && c.auteurId === 'moi') ajouter(`changement:${c.id}`, () => repondreAuChangement(p, c));
    }
    // Carnet demandé par le testeur prêteur : l'emprunteur simulé accepte ou refuse, une chance sur deux.
    if (!simPreteur && p.carnet.demandeVoir === 'en_attente') ajouter(`carnet:${p.id}`, () => window.repondreCarnet(p.id, hasard() < 0.5));
    // Fin du prêt, testeur prêteur : merci de l'emprunteur simulé. Jamais de petit geste (voir 91).
    if (p.statut === 'rembourse' && !simPreteur && !p.fin.merci)
      ajouter(`merci:${p.id}`, () => window.direMerci(p.id, `Merci ${M.prenom('moi')}, pour ton aide.`));
    // Tiers prévenu : il écrit une fois dans le fil.
    if (p.tiers && p.tiers.alerte && !p.fil.some(f => f.auteur === 'tiers'))
      ajouter(`tiers:${p.id}`, () => window.ecrire(p.id, 'Bonjour à vous deux. Je suis là si vous voulez en parler.', p.tiers.contactId));
    return r;
  }

  // Planifie tout ce que l'état demande. Au moment d'agir, la situation est relue : si elle a changé
  // (proposition retirée, prêt annulé…), le proche ne fait rien.
  function examiner() {
    if (!connecte()) return;
    for (const p of window.modele.prets()) {
      for (const { cle } of aFaire(p)) {
        planifier(cle, () => {
          const q = window.modele.pret(p.id);
          const t = q && aFaire(q).find(x => x.cle === cle);
          return t ? t.faire() : null;
        });
      }
    }
  }

  // Carnet du testeur : sur la première négociation où il est emprunteur et garde son Carnet masqué,
  // le prêteur simulé demande une fois à le voir, 3 à 5 s après l'arrivée de la proposition (voir 91).
  function demandeCarnetAttendue(p) {
    const etat = window.modele.lire();
    const dejaVue = [...faites, ...minuteries.keys()].some(k => k.startsWith('carnet-demande:'));
    return !dejaVue && p.emprunteurId === 'moi' && EN_NEGOCIATION.includes(p.statut) && p.carnet.demandeVoir === 'aucune'
      && !etat.moi.reglages.carnetPartageAuto
      && !etat.prets.some(x => x.emprunteurId === 'moi' && x.carnet.demandeVoir !== 'aucune');
  }

  // Temps simulé : à J0, l'emprunteur simulé déclare par virement, tout de suite (pendant l'action du testeur).
  // « L'autre oublie la prochaine échéance » (décision 3) : il saute cette déclaration, puis le drapeau retombe.
  function declarerAJ0(d) {
    for (const p of window.modele.prets()) {
      if (p.statut !== 'en_cours' || p.preteurId !== 'moi') continue;
      const numeros = aDeclarerAJ0(window.modele.echeances(p), d);
      if (!numeros.length) continue;
      if (p.test && p.test.oublieProchaineEcheance) jouer(() => window.oublierProchaineEcheance(p.id, false));
      else jouer(() => window.declarerRemboursement(p.id, numeros, 'virement'));
    }
  }

  window.surEvenement(evt => {
    if (evt.type === 'reinitialisation') { muet = false; toutAnnuler(); return; }
    if (evt.type === 'jour') { declarerAJ0(evt.date); return; }
    if (evt.type !== 'action' || enAction) return;   // jamais de réaction à ses propres actions
    const p = evt.pretId ? window.modele.pret(evt.pretId) : null;
    if (p && evt.acteurId === 'moi') {
      const simId = window.modele.autre(p);
      // Fil : à chaque message du testeur, une réponse.
      if (evt.nom === 'ecrire' && simId) planifier(`fil:${p.id}:${++nMessages}`, () => window.ecrire(p.id, "Bien reçu, merci de m'avoir écrit.", simId));
      if (evt.nom === 'envoyerProposition' || evt.nom === 'proposerAutreChose') suivreInvitation(p);
      if ((evt.nom === 'envoyerProposition' || evt.nom === 'proposerAutreChose') && demandeCarnetAttendue(p)) {
        planifier(`carnet-demande:${p.id}`, () => {
          const q = window.modele.pret(p.id);
          return q && EN_NEGOCIATION.includes(q.statut) && q.carnet.demandeVoir === 'aucune' ? window.demanderCarnet(q.id) : null;
        });
      }
    }
    examiner();
  });
  examiner();   // au chargement : reprend ce qu'un rechargement de la page aurait interrompu

  /* ==========================================================================
     Outils du test (spec 11 §2 et §3)
     ========================================================================== */
  const prochaineDate = p => window.modele.echeances(p).filter(e => e.etat !== 'remboursee' && e.date > window.modele.aujourdhui()).map(e => e.date)[0] || null;
  // Le prêt sur lequel le temps avance : celui affiché, sinon (Profil) le prêt en cours dont l'échéance
  // à venir est la plus proche, comme le socle.
  function pretDuTemps(pretId) {
    if (pretId) return window.modele.pret(pretId);
    return window.modele.prets().filter(p => p.statut === 'en_cours' && prochaineDate(p))
      .sort((a, b) => (prochaineDate(a) < prochaineDate(b) ? -1 : 1))[0] || null;
  }
  function peutAvancerVite(p) {
    const e = window.modele.echeances(p), derniere = e[e.length - 1];
    return !!derniere && derniere.etat !== 'remboursee' && derniere.date > window.modele.aujourdhui();
  }

  // HTML du bloc « Outils du test ». pretId : le prêt affiché (Parcours) ; sans pretId (Profil), le prêt
  // dont l'échéance vient en premier. avecSimuler : lien « Simuler » tant que les scénarios n'ont pas été ajoutés.
  // titre : 'h1' quand le bloc est seul sur son écran.
  function outilsDuTest(pretId, { avecSimuler = false, titre = 'h2' } = {}) {
    const etat = window.modele.lire();
    const p = pretDuTemps(pretId);
    const enCours = !!p && p.statut === 'en_cours';
    const params = pretId ? { pretId } : null;
    const h = titre === 'h1' ? 'h1' : 'h2';
    const oubli = pretId && enCours && p.preteurId === 'moi'
      ? window.ui.interrupteur({ id: `simulation-oubli-${p.id}`, libelle: "L'autre oublie la prochaine échéance",
                                 coche: !!(p.test && p.test.oublieProchaineEcheance), saisie: 'simulation-oubli' })
      : '';
    // Signature Zen attendue sur le prêt affiché : un jour de plus, pour vivre les relances de signature.
    const z = pretId && p && p.zen;
    const signature = !!z && z.paye && !(z.signatures[p.preteurId] && z.signatures[p.emprunteurId]) && ['signatures', 'valide', 'en_cours'].includes(p.statut);
    const lendemain = signature ? window.ui.bouton('Passer au lendemain', { action: 'simulation-lendemain', variante: 'discret', params }) : '';
    // P-9 : avancer de 3 jours, et faire taire le proche simulé (proposition qui expire, confirmation d'office).
    const jours3 = window.ui.bouton('Avancer de 3 jours', { action: 'simulation-3-jours', variante: 'discret', params });
    const silence = window.ui.interrupteur({ id: 'simulation-muet', libelle: "L'autre ne répond pas", coche: muet, saisie: 'simulation-muet',
      aide: "Le proche simulé ne répond plus. Une proposition peut expirer, un remboursement se confirmer d'office." });
    // P-10 : « Simuler » reste toujours là. Une fois les prêts d'exemple posés, il demande d'abord ce qu'on veut.
    const simuler = avecSimuler
      ? window.ui.bouton('Simuler', { action: 'simulation-simuler', variante: 'discret' })
        + `<p class="simulation-outils-legende">${etat.test.scenariosAjoutes
          ? "Des prêts d'exemple sont déjà là. Tu choisis la suite."
          : "Ajoute des prêts d'exemple pour explorer l'app."}</p>`
      : '';
    // P-10 : effacer et recommencer, sans passer par « Se déconnecter » du Profil.
    const zero = avecSimuler
      ? window.ui.bouton('Repartir de zéro', { action: 'simulation-zero', variante: 'discret' })
        + `<p class="simulation-outils-legende">Efface le compte, les prêts et les notifications.</p>`
      : '';
    return `<section class="simulation-outils${h === 'h1' ? ' simulation-outils--ecran' : ''}" aria-labelledby="simulation-outils-titre">`
      + `<${h} class="simulation-outils-titre" id="simulation-outils-titre">Outils du test</${h}>`
      + `<p>Date simulée : ${echapper(T.dateLongue(window.modele.aujourdhui()))}</p>`
      + (pretId && !enCours ? lendemain : `<p class="simulation-outils-legende">Vivre les échéances une par une</p>`
        + window.ui.bouton('Passer à la prochaine échéance', { action: 'simulation-avancer', variante: 'discret', params, desactive: !(enCours && prochaineDate(p)) })
        + window.ui.bouton('Avance rapide', { action: 'simulation-avance-rapide', variante: 'discret', params, desactive: !(enCours && peutAvancerVite(p)) })
        + lendemain)
      + jours3 + oubli + silence + simuler + zero + `</section>`;
  }

  window.ecrans['simulation-outils'] = (etat, params) =>
    window.ui.enteteRetour({ titre: '' }) + outilsDuTest(params.pretId, { avecSimuler: true, titre: 'h1' });
  window.actions['simulation-avancer'] = el => window.avancerProchaineEcheance(el.dataset.pretId || undefined);
  window.actions['simulation-avance-rapide'] = el => window.avanceRapide(el.dataset.pretId || undefined);
  // P-10 : première fois, les prêts d'exemple arrivent tout de suite. Ensuite, on dit ce qui va se passer.
  window.actions['simulation-simuler'] = () => {
    if (!window.modele.lire().test.scenariosAjoutes) { window.simulerScenarios(); return; }
    window.ui.feuille.ouvrir(
      `<p>Des prêts d'exemple sont déjà dans ton compte. Tu peux en ajouter une nouvelle série, ou tout effacer et recommencer.</p>`
      + '<div class="pile-reponses">'
      + window.ui.bouton("Ajouter d'autres prêts d'exemple", { action: 'simulation-simuler-encore' })
      + window.ui.bouton('Repartir de zéro', { action: 'simulation-zero', variante: 'secondaire' })
      + window.ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' })
      + '</div>', { titre: T.insecables('Simuler à nouveau ?') });
  };
  window.actions['simulation-simuler-encore'] = () => { window.ui.feuille.fermer(true); window.simulerScenarios(); };
  // P-10 : le geste efface tout, il se confirme. seDeconnecter() vide déjà sessionStorage et l'état (etat.js).
  window.actions['simulation-zero'] = () => window.ui.feuille.ouvrir(
    `<p>Ton compte, tes prêts et tes notifications sont effacés. Le prototype repart à son premier écran.</p>`
    + '<div class="pile-reponses">'
    + window.ui.bouton('Tout effacer', { action: 'simulation-zero-oui' })
    + window.ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' })
    + '</div>', { titre: T.insecables('Repartir de zéro ?') });
  window.actions['simulation-zero-oui'] = () => { window.seDeconnecter(); window.routeur.aller('lancement', {}, { racine: true }); };
  // P-10 : les outils, atteignables depuis n'importe quel écran (bouton posé dans #app, plus bas).
  window.actions['simulation-ouvrir'] = () => window.routeur.aller('simulation-outils', {});
  window.actions['simulation-lendemain'] = el => window.avancerUnJour(el.dataset.pretId);
  window.actions['simulation-3-jours'] = el => window.avancerJours(el.dataset.pretId || undefined, 3);
  window.saisies['simulation-muet'] = el => { taire(el.checked); window.routeur.rafraichir(); };
  // Re-rendu tout de suite : la valeur de départ de la case suit l'état. Sinon, quand le drapeau retombe à J0,
  // le routeur garderait la case cochée (valeur « saisie ») alors que l'oubli est passé.
  window.saisies['simulation-oubli'] = el => {
    window.oublierProchaineEcheance(el.id.slice('simulation-oubli-'.length), el.checked);
    window.routeur.rafraichir();
  };

  /* ==========================================================================
     verifierSimulation(tirages = 10000) (spec 11 §6) : tirages à graine fixe sur des prêts fictifs,
     sans toucher à l'état. Affiche OK ou ÉCHEC pour chaque cas et rend { ok, resultats }.
     ========================================================================== */
  function verifierSimulation(tirages = 10000) {
    const resultats = [];
    const cas = (nom, ok, exemple) => resultats.push({ nom, ok: !!ok, exemple });
    const alea = generateur(20260921);
    const auj = window.modele.aujourdhui(), annee = auj.slice(0, 4);
    const entier = (min, max) => min + Math.floor(alea() * (max - min + 1));
    const CONTACTS = ['c-leonie', 'c-thomas', 'c-nadia', 'c-karim', 'c-sofia'];
    const etatVide = { prets: [] };
    const pct = (n, total) => Math.round(1000 * n / total) / 10;
    const proche = (n, total, cible) => Math.abs(100 * n / total - cible) <= 2;
    const repartition = o => `${pct(o.accepte, o.n)} / ${pct(o.autre, o.n)} / ${pct(o.refuse, o.n)} sur ${o.n}`;
    const compteur = () => ({ accepte: 0, autre: 0, refuse: 0, n: 0 });
    const compter = (o, reponse) => { o[reponse]++; o.n++; };

    function nouveauPret(i, prefixe) {
      const simId = CONTACTS[i % CONTACTS.length], testeurPreteur = alea() < 0.5;
      return { simId, pret: { id: `verif-${prefixe}-${i}`, reference: 'TILLIT-VERIF0', preteurId: testeurPreteur ? 'moi' : simId,
        emprunteurId: testeurPreteur ? simId : 'moi', statut: 'propose', contrePropositionsSimulees: 0, echeances: [], declarations: [] } };
    }
    // Termes valides tirés dans tout l'espace des bornes.
    function termesAuHasard(pret, premiereDate) {
      for (;;) {
        const montant = entier(1, 50) * 10000;
        const t = C.normaliserTermes({ montant, mode: alea() < 0.5 ? 'duree' : 'mensualite', duree: entier(1, 60),
          mensualite: entier(10, 500) * 100 + (alea() < 0.2 ? entier(1, 99) : 0), premiereDate: premiereDate || C.ajouterJours(auj, entier(1, 90)),
          formule: montant > C.BORNES.noteMax || alea() < 0.4 ? 'zen' : 'note', payeurZenId: alea() < 0.5 ? pret.preteurId : pret.emprunteurId,
          motif: null, tiersContactId: null });
        if (C.echeancier(t).valide) return t;
      }
    }
    // Contrôles indépendants de ceux du proche simulé.
    function dansLesBornes(t, pret) {
      const e = C.echeancier(t);
      return e.valide && t.montant % 100 === 0 && t.montant >= C.BORNES.montantMin && t.montant <= C.BORNES.montantMax
        && e.n >= C.BORNES.dureeMin && e.n <= C.BORNES.dureeMax && e.mensualite >= C.BORNES.mensualiteMin
        && (t.formule === 'zen' || t.montant <= C.BORNES.noteMax)
        && (t.formule !== 'zen' || t.payeurZenId === pret.preteurId || t.payeurZenId === pret.emprunteurId)
        && t.premiereDate > auj;
    }
    // L'élément annoncé est le seul qui change, de la façon décrite par le tableau de la spec 11 §1.
    function conforme(r, c, pret) {
      const t = c.termes, meme = k => (t[k] ?? null) === (r[k] ?? null);
      const memeRythme = meme('duree') && meme('mensualite') && meme('derniere');
      const memePayeur = (t.formule !== 'zen' && r.formule !== 'zen') || meme('payeurZenId');
      switch (c.element) {
        case 'montant': return t.montant === (r.montant === C.BORNES.montantMin ? r.montant + 10000 : r.montant - 10000)
          && t.duree === r.duree && meme('premiereDate') && meme('formule') && memePayeur;
        case 'rythme': return meme('montant') && t.duree === r.duree + (r.duree <= 58 ? 2 : -2) && meme('premiereDate') && meme('formule') && memePayeur;
        case 'date': return t.premiereDate === C.ajouterMois(r.premiereDate, 1) && meme('montant') && memeRythme && meme('formule') && memePayeur;
        case 'payeur': return r.formule === 'zen' && t.formule === 'zen' && t.payeurZenId === autreQue(pret, r.payeurZenId)
          && meme('montant') && memeRythme && meme('premiereDate');
        case 'versNote': return r.formule === 'zen' && r.montant <= C.BORNES.noteMax && t.formule === 'note' && meme('montant') && memeRythme && meme('premiereDate');
        case 'versZen': return r.formule === 'note' && t.formule === 'zen' && t.payeurZenId === pret.preteurId && meme('montant') && memeRythme && meme('premiereDate');
        default: return false;
      }
    }
    const MESSAGES = ['Un peu plus étalé, ce serait plus simple pour moi.', 'Je préfère un rythme un peu différent.',
      'Je préfère commencer un mois plus tard.', 'Tu pourrais prendre Zen à ta charge ?', 'Je peux payer Zen, si tu veux.',
      "Je préfère qu'on reste sur Note.", "Je préfère qu'on signe une reconnaissance de dette avec Zen."].map(T.insecables);
    const messageExact = c => (c.element === 'montant' ? c.message === T.insecables(`Je préfère partir sur ${euros(c.termes.montant)}.`) : MESSAGES.includes(c.message));

    // 1. Propositions : le testeur propose, le proche répond ; après une contre-proposition, le testeur propose encore.
    const premieres = compteur(), suivantes = compteur(), elementsVus = {};
    let nContres = 0, deuxContres = 0;
    const horsBornes = [], nonConformes = [], mauvaisMessage = [];
    for (let i = 0; i < tirages; i++) {
      const { pret, simId } = nouveauPret(i, 'p');
      let recue = termesAuHasard(pret), contres = 0;
      for (let tour = 0; tour < 5; tour++) {
        const d = deciderProposition(recue, { pret, simId, etat: etatVide, aujourdhui: auj }, alea);
        compter(pret.contrePropositionsSimulees ? suivantes : premieres, d.reponse);
        if (d.reponse !== 'autre') break;
        contres++; nContres++;
        pret.contrePropositionsSimulees++;   // ce que fait proposerAutreChose() du socle pour le proche simulé
        elementsVus[d.contre.element] = (elementsVus[d.contre.element] || 0) + 1;
        if (!dansLesBornes(d.contre.termes, pret)) horsBornes.push({ recue, contre: d.contre });
        if (!conforme(recue, d.contre, pret)) nonConformes.push({ recue, contre: d.contre });
        if (!messageExact(d.contre)) mauvaisMessage.push(d.contre);
        recue = termesAuHasard(pret);
      }
      if (contres > 1) deuxContres++;
    }
    cas(`Première réponse à une proposition ≈ 50 / 35 / 15 à ±2 points (${repartition(premieres)})`,
      proche(premieres.accepte, premieres.n, 50) && proche(premieres.autre, premieres.n, 35) && proche(premieres.refuse, premieres.n, 15));
    cas(`Après sa contre-proposition ≈ 85 / 15 à ±2 points, jamais « autre » (${repartition(suivantes)})`,
      proche(suivantes.accepte, suivantes.n, 85) && proche(suivantes.refuse, suivantes.n, 15) && suivantes.autre === 0);
    cas(`Jamais deux contre-propositions simulées sur un même prêt (${tirages} prêts, ${nContres} contre-propositions)`, deuxContres === 0 && nContres > 0);
    cas(`Chaque contre-proposition respecte les bornes (${nContres})`, horsBornes.length === 0, horsBornes[0]);
    cas('Chaque contre-proposition change un seul élément, comme le décrit la spec', nonConformes.length === 0, nonConformes[0]);
    cas('Chaque message joint est un texte exact de la spec', mauvaisMessage.length === 0, mauvaisMessage[0]);
    cas(`Les six éléments sont tirés (${Object.entries(elementsVus).map(([k, n]) => `${k} ${n}`).join(', ')})`, Object.keys(elementsVus).length === ELEMENTS.length);

    // 2. Plafonds annuels.
    const t100 = C.normaliserTermes({ montant: 10000, mode: 'duree', duree: 5, mensualite: 0, premiereDate: C.ajouterJours(auj, 10),
      formule: 'note', payeurZenId: 'moi', motif: null, tiersContactId: null });
    const etatTesteur = { prets: [{ id: 'verif-autre', preteurId: 'moi', emprunteurId: 'c-sofia', statut: 'en_cours', dateValide: auj, termes: { montant: 490000 } }] };
    const pretPlafond = { id: 'verif-plafond', preteurId: 'moi', emprunteurId: 'c-leonie', contrePropositionsSimulees: 0 };
    let depasse = 0;
    for (let i = 0; i < 200; i++) {
      const c = contreProposition(t100, { pret: pretPlafond, simId: 'c-leonie', etat: etatTesteur, aujourdhui: auj }, alea);
      if (!c || C.plafondAnnuel(etatTesteur, 'moi', 'prete', c.termes.montant, annee, pretPlafond.id).depasse) depasse++;
    }
    cas('Testeur à 4 900 € prêtés : « +100 € » sur 100 € n\'est jamais proposé, un autre élément l\'est (200 tirages)', depasse === 0);
    const etatSimule = { prets: [{ id: 'verif-sim', preteurId: 'c-leonie', emprunteurId: 'c-sofia', statut: 'en_cours', dateValide: auj, termes: { montant: 500000 } }] };
    const pretSim = { id: 'verif-sim-2', preteurId: 'c-leonie', emprunteurId: 'moi', contrePropositionsSimulees: 1 };
    let accepteMalgre = 0;
    for (let i = 0; i < 200; i++) {
      if (deciderProposition(t100, { pret: pretSim, simId: 'c-leonie', etat: etatSimule, aujourdhui: auj }, alea).reponse === 'accepte') accepteMalgre++;
    }
    cas('Proche simulé à son plafond : il n\'accepte jamais (200 tirages)', accepteMalgre === 0);
    // Deux propositions parties en même temps : chacune tenait sous le plafond à l'envoi, pas les deux.
    const t200 = C.normaliserTermes(Object.assign({}, t100, { montant: 20000 }));
    const pretApres = Object.assign({}, pretPlafond, { contrePropositionsSimulees: 1 });
    let accepteTesteur = 0;
    for (let i = 0; i < 200; i++) {
      if (deciderProposition(t200, { pret: pretApres, simId: 'c-leonie', etat: etatTesteur, aujourdhui: auj }, alea).reponse === 'accepte') accepteTesteur++;
    }
    cas('Testeur à 4 900 € prêtés, 200 € proposés : le proche n\'accepte jamais (200 tirages)', accepteTesteur === 0);

    // 3. Changements (calendrier, date décalée, partie, passage en Zen) : mêmes probabilités, même compteur.
    function pretEnCours(i) {
      const x = nouveauPret(i, 'c');
      const p = x.pret;
      p.statut = 'en_cours';
      p.contrePropositionsSimulees = alea() < 0.3 ? 1 : 0;   // a déjà contre-proposé pendant la négociation
      p.termes = termesAuHasard(p, C.ajouterJours(auj, entier(-400, 60)));
      p.echeances = C.echeancier(p.termes).echeances;
      for (const e of p.echeances) {
        if (e.date < auj && alea() < 0.8) p.declarations.push({ id: `d-${e.numero}`, type: 'remboursement', auteurId: p.emprunteurId, numeros: [e.numero],
          montant: e.montant, moyen: 'virement', date: e.date, statut: 'confirmee', dateConfirmation: e.date });
      }
      return x;
    }
    const chgPremieres = compteur();
    let chgContres = 0, chgDeux = 0;
    const chgInvalides = [];
    for (let i = 0; i < tirages; i++) {
      const { pret } = pretEnCours(i);
      const libres = C.etatsEcheances(pret, auj).filter(e => LIBRES.includes(e.etat));
      if (!libres.length) continue;
      const type = ['calendrier', 'decaler', 'partie', 'passage_zen'][entier(0, 3)];
      let c = null;
      if (type === 'calendrier') {
        const termes = { mode: 'duree', duree: entier(1, 24), mensualite: 0, premiereDate: C.ajouterJours(auj, entier(1, 60)) };
        const r = C.calendrierDuReste(pret, termes, auj);
        if (r.valide) c = { type, termes, avant: r.avant, apres: r.echeances };
      } else if (type === 'decaler') {
        const e = libres[entier(0, libres.length - 1)];
        c = { type, avant: [e], apres: [{ numero: e.numero, date: C.ajouterJours(auj, entier(1, 40)), montant: e.montant, dateInitiale: e.date }] };
      } else if (type === 'partie') {
        const e = libres[0], maxNum = Math.max(...pret.echeances.map(x => x.numero)), partie = Math.floor(e.montant / 2);
        if (maxNum < C.BORNES.dureeMax) {   // comme le socle : l'échéance est coupée, la partie est déclarée
          pret.echeances = pret.echeances.map(x => (x.numero === e.numero ? Object.assign({}, x, { montant: partie }) : x))
            .concat([{ numero: maxNum + 1, date: e.date, montant: e.montant - partie, dateInitiale: null }]);
          pret.declarations.push({ id: 'd-partie', type: 'remboursement', auteurId: pret.emprunteurId, numeros: [e.numero], montant: partie,
            moyen: 'virement', date: auj, statut: 'declaree', dateConfirmation: null });
          c = { type, avant: [{ numero: maxNum + 1, date: e.date, montant: e.montant - partie }],
                apres: [{ numero: maxNum + 1, date: C.ajouterJours(auj, entier(1, 40)), montant: e.montant - partie, dateInitiale: e.date }] };
        }
      } else if (pret.termes.formule === 'note') c = { type, payeurZenId: alea() < 0.5 ? pret.preteurId : pret.emprunteurId };
      if (!c) continue;
      const d = deciderChangement(c, pret, auj, alea);
      if (!pret.contrePropositionsSimulees) compter(chgPremieres, d.reponse);
      if (d.reponse !== 'autre') continue;
      if (pret.contrePropositionsSimulees) chgDeux++;   // il avait déjà contre-proposé sur ce prêt
      chgContres++;
      const k = d.contre;
      let valide = false;
      if (c.type === 'calendrier') {
        const r = C.calendrierDuReste(pret, k.termes, auj);
        valide = k.type === 'calendrier' && Math.abs(k.termes.duree - c.apres.length) === 1 && r.valide && !memesEcheances(r.echeances, r.avant);
      } else if (c.type === 'decaler' || c.type === 'partie') {
        const cible = C.etatsEcheances(pret, auj).find(e => e.numero === k.numero);
        valide = k.type === 'decaler' && k.numero === c.apres[0].numero && k.nouvelleDate === C.ajouterJours(c.apres[0].date, 7)
          && k.nouvelleDate > auj && !!cible && LIBRES.includes(cible.etat);
      } else valide = k.type === 'passage_zen' && k.payeurZenId === autreQue(pret, c.payeurZenId);
      if (!valide) chgInvalides.push({ changement: c, contre: k });
      pret.contrePropositionsSimulees++;
      if (deciderChangement(c, pret, auj, alea).reponse === 'autre') chgDeux++;
    }
    cas(`Première réponse à un changement ≈ 50 / 35 / 15 à ±2 points (${repartition(chgPremieres)})`,
      proche(chgPremieres.accepte, chgPremieres.n, 50) && proche(chgPremieres.autre, chgPremieres.n, 35) && proche(chgPremieres.refuse, chgPremieres.n, 15));
    cas(`Changements : jamais deux contre-propositions sur un même prêt, négociation comprise (${chgContres} contre-propositions)`, chgDeux === 0 && chgContres > 0);
    cas('Changements : durée ±1 mois, date +7 jours ou payeur inversé, toujours valides', chgInvalides.length === 0, chgInvalides[0]);

    // 4. Avance rapide et J0. Réplique, sur 200 prêts fictifs, de ce que fait avanceRapide() du socle
    //    (échéances sautées confirmées, date portée à la dernière échéance) ; l'action elle-même se
    //    contrôle dans le navigateur. Puis la déclaration de l'emprunteur simulé ce jour-là.
    let arTestes = 0, arEchecs = 0, j0Echecs = 0;
    for (let i = 0; i < 200; i++) {
      const { pret } = pretEnCours(i + tirages);
      const etats = C.etatsEcheances(pret, auj), der = etats[etats.length - 1];
      if (!(der && der.etat !== 'remboursee' && der.date > auj)) continue;
      arTestes++;
      for (const e of etats.slice(0, -1)) {
        if (e.etat !== 'remboursee') pret.declarations.push({ id: `ar-${e.numero}`, type: 'remboursement', auteurId: pret.emprunteurId, numeros: [e.numero],
          montant: e.montant, moyen: 'virement', date: e.date > auj ? e.date : auj, statut: 'confirmee', dateConfirmation: e.date > auj ? e.date : auj });
      }
      const aVivre = C.etatsEcheances(pret, der.date).filter(e => e.etat !== 'remboursee');
      if (aVivre.length !== 1 || aVivre[0].numero !== der.numero) arEchecs++;
      const j0 = aDeclarerAJ0(C.etatsEcheances(pret, der.date), der.date);
      if (j0.length !== 1 || j0[0] !== der.numero || aDeclarerAJ0(C.etatsEcheances(pret, C.ajouterJours(der.date, -1)), C.ajouterJours(der.date, -1)).length) j0Echecs++;
    }
    cas(`« Avance rapide » laisse exactement une échéance à vivre, la dernière (réplique sur ${arTestes} prêts fictifs)`, arEchecs === 0 && arTestes > 0);
    cas('À J0 de la dernière échéance, l\'emprunteur simulé déclare celle-ci et rien la veille', j0Echecs === 0 && arTestes > 0);

    let ok = true;
    for (const r of resultats) {
      ok = ok && r.ok;
      console.log(r.ok ? `OK · ${r.nom}` : `ÉCHEC · ${r.nom}` + (r.exemple ? `\n   exemple : ${JSON.stringify(r.exemple)}` : ''));
    }
    console.log(ok ? `verifierSimulation : ${resultats.length} cas, tous OK` : `verifierSimulation : ${resultats.filter(r => !r.ok).length} ÉCHEC sur ${resultats.length}`);
    return { ok, resultats };
  }
  window.verifierSimulation = verifierSimulation;

  /* ---------- P-10 · accès aux outils depuis n'importe quel écran ----------
     Posé une fois dans #app, hors de #ecran : aucun re-rendu ne l'efface, et la barre du bas
     reste intacte. Discret par défaut pour ne pas peser sur la lecture des maquettes.
     Le CSS le retire quand on est déjà sur l'écran des outils (la flèche de retour y suffit). */
  (function poserBouton() {
    const app = document.getElementById('app');
    if (!app || document.getElementById('outils-test')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'outils-test';
    b.className = 'outils-test';
    b.dataset.action = 'simulation-ouvrir';
    b.setAttribute('aria-label', 'Outils du test');
    b.innerHTML = window.ui.icone('sablier');
    app.appendChild(b);
  })();

  window.simulation = Object.freeze({
    outilsDuTest,
    taire,
    estMuet: () => muet,
    graine: n => { hasard = n == null ? Math.random : generateur(n); }
  });
})();
