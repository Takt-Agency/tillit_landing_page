/* ==========================================================================
   TilliT prototype · calculs.js (lot 0)
   Toutes les règles de calcul (spec 00 §6 et 09) : bornes, échéancier,
   prix de Zen, référence de dossier, plafond annuel, dates, état des
   échéances, flamme, séries, paliers, Carnet, montant en lettres.
   Fonctions pures : elles reçoivent ce dont elles ont besoin (prêt, état,
   date du jour) et ne modifient rien. Montants en centimes, dates AAAA-MM-JJ.
   Vérification : verifierCalculs() dans la console.
   ========================================================================== */
(function () {
  'use strict';

  const BORNES = Object.freeze({
    montantMin: 10000,      // 100 €
    montantMax: 500000,     // 5 000 €
    noteMax: 150000,        // Note jusqu'à 1 500 € inclus
    mensualiteMin: 1000,    // 10 €
    dureeMin: 1,
    dureeMax: 60,
    plafondAnnuel: 500000,  // 5 000 € prêtés, 5 000 € empruntés, par année civile
    supplementFC: 150,      // signature FranceConnect : 1,50 €
    expirationJours: 4,     // 96 h
    confirmationJours: 5,   // flamme : confirmée dans les 5 jours
    confirmationDofficeJours: 14   // remboursement déclaré et laissé sans réponse : confirmé d'office (décision P-8 n° 6)
  });
  const GRILLE_ZEN = [[30000, 299], [50000, 499], [100000, 999], [200000, 1999],
                      [300000, 2999], [400000, 3999], [500000, 4999]];
  const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';   // sans I, L, O, U
  const PALIERS = Object.freeze([1, 3, 6, 12, 18, 24, 30, 36, 48, 60]);
  const STATUTS_PLAFOND = ['valide', 'en_cours', 'rembourse', 'cloture'];

  /* ---------- Dates (chaînes AAAA-MM-JJ, calcul en UTC pour éviter l'heure d'été) ---------- */
  const versUTC = iso => { const [a, m, j] = iso.split('-').map(Number); return Date.UTC(a, m - 1, j); };
  const versISO = ms => new Date(ms).toISOString().slice(0, 10);
  const deux = n => String(n).padStart(2, '0');
  function isoLocal(d = new Date()) { return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`; }
  function joursEntre(a, b) { return Math.round((versUTC(b) - versUTC(a)) / 864e5); }
  function ajouterJours(iso, n) { return versISO(versUTC(iso) + n * 864e5); }
  // Même jour du mois ; si ce jour n'existe pas, dernier jour du mois.
  function ajouterMois(iso, n) {
    const [a, m, j] = iso.split('-').map(Number);
    const cible = new Date(Date.UTC(a, m - 1 + n, 1));
    const dernier = new Date(Date.UTC(cible.getUTCFullYear(), cible.getUTCMonth() + 1, 0)).getUTCDate();
    return `${cible.getUTCFullYear()}-${deux(cible.getUTCMonth() + 1)}-${deux(Math.min(j, dernier))}`;
  }
  const premiereDateParDefaut = aujourdhui => ajouterMois(aujourdhui, 1);

  /* ---------- Échéancier ---------- */
  // Cœur du calcul : A montant à répartir, mode 'mensualite' (M) ou 'duree' (n).
  // Décision de Yohann du 25/09 : en mode durée, la mensualité s'arrondit au centime
  // inférieur et la dernière échéance ramasse le reste. Elle vaut donc au moins la
  // mensualité, et la durée demandée n'est jamais raccourcie. En mode mensualité, le
  // nombre d'échéances s'arrondit à l'entier supérieur : les échéances régulières valent
  // la mensualité choisie et la dernière vaut le reste, donc au plus une mensualité.
  // Le minimum de 10 € porte sur la mensualité, pas sur la dernière échéance : payer
  // cinq euros au dernier mois ne pèse sur personne, une dernière échéance doublée si.
  function plan(A, mode, mensualite, duree, dureeMax = BORNES.dureeMax) {
    const erreurs = [];
    let M, n;
    if (mode === 'mensualite') {
      M = Math.round(mensualite);
      if (!(M > 0)) return { n: 0, mensualite: 0, derniere: 0, erreurs: [{ code: 'mensualite_min', mensualite: M || 0 }] };
      n = A > 0 ? Math.ceil(A / M) : 0;   // montant nul : aucune échéance, il est refusé ailleurs
    } else {
      n = Math.round(duree);
      if (!(n >= BORNES.dureeMin)) return { n: n || 0, mensualite: 0, derniere: 0, erreurs: [{ code: 'duree_min', duree: n || 0 }] };
      M = Math.floor(A / n);
    }
    const derniere = A - M * (n - 1);
    if (M < BORNES.mensualiteMin) erreurs.push({ code: 'mensualite_min', mensualite: M });
    if (n > dureeMax) erreurs.push({ code: 'duree_max', duree: n, dureeMax });
    return { n, mensualite: M, derniere, erreurs };
  }

  function datesEcheances(premiereDate, n) {
    const r = [];
    for (let k = 1; k <= n; k++) r.push(ajouterMois(premiereDate, k - 1));
    return r;
  }

  // termes : { montant, mode, mensualite, duree, premiereDate }
  // Rend { n, mensualite, derniere, echeances, erreurs, valide, zenImpose }.
  function echeancier(termes) {
    const A = Math.round(termes.montant);
    const erreurs = [];
    if (!(A > 0) || A % 100 !== 0) erreurs.push({ code: 'montant_entier' });
    if (A < BORNES.montantMin) erreurs.push({ code: 'montant_min' });
    if (A > BORNES.montantMax) erreurs.push({ code: 'montant_max' });
    const p = plan(A > 0 ? A : 0, termes.mode, termes.mensualite, termes.duree);
    erreurs.push(...p.erreurs);
    const echeances = [];
    if (p.n > 0 && p.n <= BORNES.dureeMax && termes.premiereDate) {
      datesEcheances(termes.premiereDate, p.n).forEach((date, i) => echeances.push({
        numero: i + 1, date, montant: i === p.n - 1 ? p.derniere : p.mensualite, dateInitiale: null
      }));
    }
    return { n: p.n, mensualite: p.mensualite, derniere: p.derniere, echeances,
             erreurs, valide: erreurs.length === 0, zenImpose: A > BORNES.noteMax };
  }

  // Termes complétés (mensualite, duree, derniere recalculés) sans toucher aux autres champs.
  // Le mode saisi est conservé : sur des termes normalisés, les deux modes rendent le même
  // échéancier. Des termes hors bornes ne sont pas corrigés, ils restent refusés.
  function normaliserTermes(termes) {
    const e = echeancier(termes);
    if (!(e.n > 0 && e.mensualite > 0)) return Object.assign({}, termes);
    return Object.assign({}, termes, { mensualite: e.mensualite, duree: e.n, derniere: e.derniere });
  }

  const CHAMPS_NEGOCIABLES = ['montant', 'mensualite', 'duree', 'derniere', 'premiereDate', 'formule', 'payeurZenId'];
  // Liste des champs qui changent entre deux termes (qui paie Zen ne compte que pour Zen).
  function differences(a, b) {
    const na = normaliserTermes(a), nb = normaliserTermes(b);
    return CHAMPS_NEGOCIABLES.filter(c => {
      if (c === 'payeurZenId' && na.formule !== 'zen' && nb.formule !== 'zen') return false;
      return (na[c] ?? null) !== (nb[c] ?? null);
    });
  }
  const termesIdentiques = (a, b) => differences(a, b).length === 0;

  /* ---------- Prix de Zen ---------- */
  function prixZen(montant) {
    if (!(montant >= BORNES.montantMin && montant <= BORNES.montantMax)) return null;
    for (const [max, prix] of GRILLE_ZEN) if (montant <= max) return prix;
    return null;
  }

  /* ---------- Référence de dossier ---------- */
  function genererReference(existantes = [], aleatoire = Math.random) {
    for (;;) {
      let s = 'TILLIT-';
      for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(aleatoire() * ALPHABET.length)];
      if (!existantes.includes(s)) return s;
    }
  }
  const referenceVersement = ref => `${ref}-V`;
  const referenceRemboursement = (ref, numero) => `${ref}-R${deux(numero)}`;

  /* ---------- Plafond annuel ---------- */
  // sens : 'prete' ou 'emprunte'. On compte les prêts valide, en_cours, rembourse,
  // cloture rattachés à l'année de leur passage à « valide » (pret.dateValide),
  // plus le montant examiné. pretIdExclu : le prêt examiné, s'il est déjà compté.
  function plafondAnnuel(etat, personneId, sens, montantPropose, annee, pretIdExclu) {
    const cle = sens === 'prete' ? 'preteurId' : 'emprunteurId';
    let total = 0;
    for (const p of etat.prets) {
      if (p.id === pretIdExclu || p[cle] !== personneId || !STATUTS_PLAFOND.includes(p.statut)) continue;
      if (!p.dateValide || Number(p.dateValide.slice(0, 4)) !== Number(annee)) continue;
      total += p.termes.montant;
    }
    const reste = Math.max(0, BORNES.plafondAnnuel - total);
    return { total, reste, atteint: reste === 0, depasse: total + (montantPropose || 0) > BORNES.plafondAnnuel };
  }

  // Cumul de l'année civile entre deux personnes, dans les deux sens (seuil des impôts, décision P-8 n° 2).
  // Mêmes prêts comptés que plafondAnnuel : valide, en_cours, rembourse, cloture, rattachés à l'année
  // de leur passage à « valide » (pret.dateValide) ; plus le montant examiné.
  function cumulEntreProches(etat, personneId, autreId, montantPropose, annee, pretIdExclu) {
    let total = 0;
    for (const p of etat.prets) {
      if (p.id === pretIdExclu || !STATUTS_PLAFOND.includes(p.statut)) continue;
      const entreEux = (p.preteurId === personneId && p.emprunteurId === autreId)
                    || (p.preteurId === autreId && p.emprunteurId === personneId);
      if (!entreEux) continue;
      if (!p.dateValide || Number(p.dateValide.slice(0, 4)) !== Number(annee)) continue;
      total += p.termes.montant;
    }
    const cumul = total + (montantPropose || 0);
    return { total, cumul, depasse: cumul > BORNES.plafondAnnuel };
  }

  /* ---------- Vérification complète de termes (bornes + plafond) ---------- */
  // contexte : { etat, personneId, role ('preteur'|'emprunteur'), pretId, aujourdhui }
  function verifierTermes(termes, contexte) {
    const e = echeancier(termes);
    const erreurs = e.erreurs.slice();
    if (contexte && contexte.etat && contexte.role) {
      const sens = contexte.role === 'preteur' ? 'prete' : 'emprunte';
      const pl = plafondAnnuel(contexte.etat, contexte.personneId || 'moi', sens, termes.montant,
                               contexte.aujourdhui.slice(0, 4), contexte.pretId);
      if (pl.atteint) erreurs.push({ code: 'plafond_atteint', sens });
      else if (pl.depasse) erreurs.push({ code: 'plafond_depasse', sens, reste: pl.reste });
    }
    return Object.assign({}, e, { erreurs, valide: erreurs.length === 0 });
  }

  /* ---------- État des échéances (spec 00 §4.2), toujours calculé ---------- */
  const LIBELLES_ECHEANCE = Object.freeze({
    remboursee: 'Remboursée', remboursee_avance: 'Remboursée en avance',
    en_attente: 'En attente de confirmation', non_recue: "Non reçu pour l'instant",
    a_declarer: 'À déclarer', prochaine: 'Prochaine', a_venir: 'À venir'
  });
  const parDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.numero - b.numero);

  function declarationsDe(pret, numero) {
    return pret.declarations.filter(d => d.type === 'remboursement' && d.numeros.includes(numero));
  }

  // Rend les échéances triées par date, chacune avec : etat, enAvance, declaration, reference.
  // Un prêt qui n'est ni en cours ni remboursé ne fait courir aucune échéance : tout est « a_venir ».
  // Prêt clôturé : les échéances non réglées restent « a_venir » (le lot J les grise).
  function etatsEcheances(pret, aujourdhui) {
    const actif = pret.statut === 'en_cours' || pret.statut === 'rembourse';
    let prochaineVue = false;
    return pret.echeances.slice().sort(parDate).map(e => {
      const decl = declarationsDe(pret, e.numero);
      const confirmee = decl.find(d => d.statut === 'confirmee');
      const declaree = decl.find(d => d.statut === 'declaree');
      const nonRecue = decl.find(d => d.statut === 'non_recue');
      let etat, declaration = null, enAvance = false;
      if (confirmee) { etat = 'remboursee'; declaration = confirmee; enAvance = confirmee.date.slice(0, 7) < e.date.slice(0, 7); }
      else if (declaree) { etat = 'en_attente'; declaration = declaree; }
      else if (nonRecue) { etat = 'non_recue'; declaration = nonRecue; }
      else if (!actif) etat = 'a_venir';
      else if (e.date < aujourdhui) etat = 'a_declarer';
      else if (!prochaineVue) { etat = 'prochaine'; prochaineVue = true; }
      else etat = 'a_venir';
      return Object.assign({}, e, { etat, enAvance, declaration,
        reference: pret.reference ? referenceRemboursement(pret.reference, e.numero) : null });
    });
  }
  function libelleEcheance(e) { return e.etat === 'remboursee' && e.enAvance ? LIBELLES_ECHEANCE.remboursee_avance : LIBELLES_ECHEANCE[e.etat]; }

  const somme = (liste, f) => liste.reduce((s, x) => s + f(x), 0);
  function montantRembourse(pret, aujourdhui) { return somme(etatsEcheances(pret, aujourdhui).filter(e => e.etat === 'remboursee'), e => e.montant); }
  // Reste à rembourser : tout ce qui n'est pas confirmé (un prêt validé non versé : le montant entier).
  function resteARembourser(pret, aujourdhui) {
    if (!pret.echeances.length) return pret.termes ? pret.termes.montant : 0;
    return somme(etatsEcheances(pret, aujourdhui).filter(e => e.etat !== 'remboursee'), e => e.montant);
  }
  // Ni remboursé ni déclaré (base d'un nouveau calendrier).
  const ETATS_LIBRES = ['a_declarer', 'prochaine', 'a_venir'];
  function resteNonDeclare(pret, aujourdhui) { return somme(etatsEcheances(pret, aujourdhui).filter(e => ETATS_LIBRES.includes(e.etat)), e => e.montant); }
  function nbConfirmees(pret, aujourdhui) { return etatsEcheances(pret, aujourdhui).filter(e => e.etat === 'remboursee').length; }
  function nbRestantes(pret, aujourdhui) { return etatsEcheances(pret, aujourdhui).filter(e => e.etat !== 'remboursee').length; }

  /* ---------- Nouveau calendrier sur le reste (spec 08) ---------- */
  // termes : { mode, mensualite, duree, premiereDate }. Les échéances libres sont remplacées ;
  // la numérotation reprend à la suite du dernier numéro utilisé (déclaré ou gardé).
  function calendrierDuReste(pret, termes, aujourdhui) {
    const etats = etatsEcheances(pret, aujourdhui);
    const avant = etats.filter(e => ETATS_LIBRES.includes(e.etat));
    const gardees = etats.filter(e => !ETATS_LIBRES.includes(e.etat));
    const utilises = [0, ...gardees.map(e => e.numero), ...pret.declarations.flatMap(d => d.numeros || [])];
    const depart = Math.max(...utilises) + 1;
    const reste = somme(avant, e => e.montant);
    const p = plan(reste, termes.mode, termes.mensualite, termes.duree, BORNES.dureeMax - depart + 1);
    const echeances = [];
    if (!p.erreurs.length && termes.premiereDate) {
      datesEcheances(termes.premiereDate, p.n).forEach((date, i) => echeances.push({
        numero: depart + i, date, montant: i === p.n - 1 ? p.derniere : p.mensualite,
        dateInitiale: avant[i] ? (avant[i].dateInitiale || avant[i].date) : null
      }));
    }
    return { avant: avant.map(({ numero, date, montant, dateInitiale }) => ({ numero, date, montant, dateInitiale })),
             reste, n: p.n, mensualite: p.mensualite, derniere: p.derniere,
             echeances, erreurs: p.erreurs, valide: p.erreurs.length === 0 && echeances.length > 0 };
  }

  /* ---------- Flamme, séries, paliers (spec 09) ---------- */
  // Date de référence d'une échéance : sa date, sauf si elle a été déplacée par un
  // changement accepté APRÈS la date initiale (alors la date initiale compte).
  function dateReference(pret, e) {
    if (!e.dateInitiale) return e.date;
    const chg = pret.changements.filter(c => c.statut === 'acceptee' && (c.apres || []).some(a => a.numero === e.numero)).pop();
    const accord = chg ? ((chg.reponses || []).slice(-1)[0] || {}).date || chg.date : null;
    return accord && accord <= e.dateInitiale ? e.date : e.dateInitiale;
  }
  // Statut « à l'heure » d'une échéance : 'plus' (+1), 'attente', 'neutre' (confirmée tard),
  // 'zero' (date passée sans déclaration, ou déclarée après la date), 'futur'.
  function statutFlamme(pret, e, aujourdhui) {
    const ref = dateReference(pret, e);
    if (e.declaration) {
      const d = e.declaration;
      if (d.date > ref) return 'zero';
      if (e.etat === 'remboursee') return joursEntre(d.date, d.dateConfirmation || d.date) <= BORNES.confirmationJours ? 'plus' : 'neutre';
      return 'attente';
    }
    return ref < aujourdhui ? 'zero' : 'futur';
  }
  function compterSerie(entrees) {
    let valeur = 0, attenue = false;
    for (const s of entrees) {
      if (s === 'futur') break;
      if (s === 'zero') { valeur = 0; attenue = false; }
      else if (s === 'plus') valeur++;
      else if (s === 'attente') attenue = true;
    }
    return { valeur, allumee: valeur > 0, attenue };
  }
  function flamme(pret, aujourdhui) {
    if (!['en_cours', 'rembourse', 'cloture'].includes(pret.statut)) return { valeur: 0, allumee: false, attenue: false };
    return compterSerie(etatsEcheances(pret, aujourdhui).map(e => statutFlamme(pret, e, aujourdhui)));
  }
  // Séries personnelles (privées). Emprunteur : échéances à l'heure d'affilée, tous prêts confondus.
  function serieEmprunteur(etat, personneId, aujourdhui) {
    const entrees = [];
    for (const p of etat.prets) {
      if (p.emprunteurId !== personneId || !['en_cours', 'rembourse', 'cloture'].includes(p.statut)) continue;
      for (const e of etatsEcheances(p, aujourdhui)) entrees.push({ date: dateReference(p, e), s: statutFlamme(p, e, aujourdhui) });
    }
    entrees.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    // Les échéances futures d'un prêt ne coupent pas celles, passées, d'un autre prêt.
    return compterSerie(entrees.filter(x => x.s !== 'futur').map(x => x.s)).valeur;
  }
  // Prêteur : confirmations dans les 5 jours d'affilée, et prêts accompagnés jusqu'au bout.
  function seriePreteur(etat, personneId, aujourdhui) {
    const decl = [];
    for (const p of etat.prets) {
      if (p.preteurId !== personneId) continue;
      for (const d of p.declarations) if (d.type === 'remboursement') decl.push(d);
    }
    decl.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    let confirmations = 0;
    for (const d of decl) {
      if (d.statut === 'confirmee') confirmations = joursEntre(d.date, d.dateConfirmation || d.date) <= BORNES.confirmationJours ? confirmations + 1 : 0;
      else if (joursEntre(d.date, aujourdhui) > BORNES.confirmationJours) confirmations = 0;
    }
    const accompagnes = etat.prets.filter(p => p.preteurId === personneId && p.statut === 'rembourse').length;
    return { confirmations, accompagnes };
  }
  function paliersAtteints(pret, aujourdhui) {
    const k = nbConfirmees(pret, aujourdhui);
    return PALIERS.filter(p => p <= k && (p !== 30 || (pret.termes && pret.termes.duree === 60)));
  }
  // Le plus haut palier atteint et pas encore fêté, ou null.
  function palierAFeter(pret, aujourdhui) {
    const fetes = (pret.gamification && pret.gamification.paliersFetes) || [];
    const a = paliersAtteints(pret, aujourdhui).filter(p => !fetes.includes(p));
    return a.length ? Math.max(...a) : null;
  }
  function pretParfait(pret, aujourdhui) {
    const etats = etatsEcheances(pret, aujourdhui);
    return etats.length > 0 && etats.every(e => statutFlamme(pret, e, aujourdhui) === 'plus');
  }

  /* ---------- Carnet de prêt (spec 09, décision n° 2) ---------- */
  // Un prêt clôturé avec cadeau du reste va dans « Clôturés, reste offert » (ligne neutre) ;
  // seul un prêt clôturé sans cadeau compte dans « Non remboursés ». Jamais un prêt annulé.
  function carnet(etat, personneId, aujourdhui) {
    const vide = () => ({ total: 0, rembourses: 0, nonRembourses: 0, clotureResteOffert: 0, enCours: 0 });
    const r = { recus: vide(), accordes: vide(), enCoursListe: [] };
    for (const p of etat.prets) {
      const cote = p.emprunteurId === personneId ? 'recus' : p.preteurId === personneId ? 'accordes' : null;
      if (!cote) continue;
      const c = r[cote];
      if (p.statut === 'rembourse') c.rembourses++;
      else if (p.statut === 'cloture') { if (p.fin && p.fin.cadeauReste != null) c.clotureResteOffert++; else c.nonRembourses++; }
      else if (p.statut === 'valide' || p.statut === 'en_cours') {
        c.enCours++;
        r.enCoursListe.push({ pretId: p.id, sens: cote === 'recus' ? 'recu' : 'accorde',
                              k: nbConfirmees(p, aujourdhui), n: p.echeances.length });
      } else continue;
      c.total++;
    }
    return r;
  }

  /* ---------- Rappels d'échéance (spec 12 §1) ---------- */
  // Rappels qui partent ce jour-là pour une personne de rôle `role`, selon ses jours choisis.
  // Rend [{ cle, echeance, jour }]. La clé n'est rendue que si ce rôle a un texte pour elle.
  function rappelsDuJour(pret, aujourdhui, joursRappel, role) {
    if (pret.statut !== 'en_cours') return [];
    const r = [];
    for (const e of etatsEcheances(pret, aujourdhui)) {
      const j = joursEntre(e.date, aujourdhui);
      if (!joursRappel.includes(j)) continue;
      let cle = null;
      if ((e.etat === 'prochaine' || e.etat === 'a_venir') && j <= 0) cle = { '-5': 'rappel_jm5', '-1': 'rappel_jm1', '0': 'rappel_j0' }[j];
      else if (e.etat === 'a_declarer') cle = { 3: 'rappel_jp3', 5: 'rappel_jp5', 7: 'rappel_jp7' }[j];
      else if (e.etat === 'en_attente' && (j === 0 || j === 3) && role === 'preteur') cle = 'rappel_confirmation';
      else if (e.etat === 'non_recue' && j === 3 && role === 'emprunteur') cle = 'rappel_non_recu';
      if (cle) r.push({ cle, echeance: e, jour: j });
    }
    return r;
  }

  /* ---------- Montant en lettres (reconnaissance de dette, spec 05) ---------- */
  const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze',
    'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const DIZAINES = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  function moinsDeCent(n) {
    if (n < 20) return UNITES[n];
    const d = Math.floor(n / 10), u = n % 10;
    if (d === 7 || d === 9) return d === 7 && u === 1 ? 'soixante et onze' : `${DIZAINES[d]}-${UNITES[10 + u]}`;
    if (u === 0) return d === 8 ? 'quatre-vingts' : DIZAINES[d];
    if (u === 1 && d !== 8) return `${DIZAINES[d]} et un`;
    return `${DIZAINES[d]}-${UNITES[u]}`;
  }
  function moinsDeMille(n) {
    const c = Math.floor(n / 100), r = n % 100;
    let s = c === 1 ? 'cent' : c > 1 ? `${UNITES[c]} ${r === 0 ? 'cents' : 'cent'}` : '';
    if (r) s += (s ? ' ' : '') + moinsDeCent(r);
    return s;
  }
  function nombreEnLettres(n) {
    if (n === 0) return 'zéro';
    const m = Math.floor(n / 1000), r = n % 1000;
    let s = m === 1 ? 'mille' : m > 1 ? `${moinsDeMille(m).replace(/cents$/, 'cent').replace(/vingts$/, 'vingt')} mille` : '';
    if (r) s += (s ? ' ' : '') + moinsDeMille(r);
    return s;
  }
  function enLettres(centimes) {
    const e = Math.floor(centimes / 100), c = centimes % 100;
    const partE = `${nombreEnLettres(e)} ${e > 1 ? 'euros' : 'euro'}`;
    if (!c) return partE;
    const partC = `${nombreEnLettres(c)} ${c > 1 ? 'centimes' : 'centime'}`;
    return e ? `${partE} et ${partC}` : partC;
  }

  window.calculs = Object.freeze({
    BORNES, PALIERS, LIBELLES_ECHEANCE,
    isoLocal, joursEntre, ajouterJours, ajouterMois, premiereDateParDefaut, datesEcheances,
    plan, echeancier, normaliserTermes, differences, termesIdentiques, verifierTermes,
    prixZen, genererReference, referenceVersement, referenceRemboursement,
    plafondAnnuel, cumulEntreProches,
    etatsEcheances, libelleEcheance, montantRembourse, resteARembourser, resteNonDeclare,
    nbConfirmees, nbRestantes, calendrierDuReste,
    dateReference, flamme, serieEmprunteur, seriePreteur, paliersAtteints, palierAFeter, pretParfait,
    carnet, rappelsDuJour, enLettres
  });

  /* ==========================================================================
     verifierCalculs() : cas chiffrés de la spec (00 §6, 05), puis cas ajoutés
     par le lot 0 pour les décisions du coordinateur et les règles de 09.
     Affiche OK ou ÉCHEC pour chaque cas et rend { ok, resultats }.
     ========================================================================== */
  function verifierCalculs() {
    const resultats = [];
    const cas = (nom, attendu, obtenu) => {
      const ok = JSON.stringify(attendu) === JSON.stringify(obtenu);
      resultats.push({ nom, ok, attendu, obtenu });
    };
    const resume = e => ({ n: e.n, mensualite: e.mensualite, derniere: e.derniere, valide: e.valide, erreurs: e.erreurs.map(x => x.code) });
    const d0 = '2026-09-21';

    // Spec 00 §6
    cas('500 €, durée 5 : 5 × 100,00 €, dernière 100,00 €',
      { n: 5, mensualite: 10000, derniere: 10000, valide: true, erreurs: [] },
      resume(echeancier({ montant: 50000, mode: 'duree', duree: 5, premiereDate: d0 })));
    cas('400 €, durée 3 : 2 × 133,33 € puis 133,34 €',
      { n: 3, mensualite: 13333, derniere: 13334, valide: true, erreurs: [] },
      resume(echeancier({ montant: 40000, mode: 'duree', duree: 3, premiereDate: d0 })));
    cas('1 850 €, mensualité 80,65 € : 23 échéances, 22 × 80,65 € puis 75,70 €',
      { n: 23, mensualite: 8065, derniere: 7570, valide: true, erreurs: [] },
      resume(echeancier({ montant: 185000, mode: 'mensualite', mensualite: 8065, premiereDate: d0 })));
    const e100 = echeancier({ montant: 10000, mode: 'duree', duree: 60, premiereDate: d0 });
    cas('100 €, durée 60 : refusé, mensualité 1,66 €, sous 10 €',
      { valide: false, mensualite: 166, erreur: 'mensualite_min' },
      { valide: e100.valide, mensualite: e100.mensualite, erreur: (e100.erreurs[0] || {}).code });
    const e5000 = echeancier({ montant: 500000, mode: 'mensualite', mensualite: 5000, premiereDate: d0 });
    cas('5 000 €, mensualité 50 € : refusé, 100 mois, au-delà de 60',
      { valide: false, n: 100, erreur: 'duree_max' },
      { valide: e5000.valide, n: e5000.n, erreur: (e5000.erreurs[0] || {}).code });
    cas('Première date 31 janvier : 2e échéance le dernier jour de février (2027 puis 2028 bissextile)',
      ['2027-02-28', '2028-02-29'],
      [datesEcheances('2027-01-31', 2)[1], datesEcheances('2028-01-31', 2)[1]]);
    cas('Échéancier 31 janvier : la 3e échéance revient au 31 mars',
      '2027-03-31', datesEcheances('2027-01-31', 3)[2]);
    cas('Prix Zen 300 €, 301 €, 1 500 €, 5 000 € : 2,99 €, 4,99 €, 19,99 €, 49,99 €',
      [299, 499, 1999, 4999], [prixZen(30000), prixZen(30100), prixZen(150000), prixZen(500000)]);
    const refs = [];
    for (let i = 0; i < 500; i++) refs.push(genererReference(refs));
    const refOk = refs.every(r => /^TILLIT-[0-9A-HJKMNP-TV-Z]{6}$/.test(r) && !/[ILOU]/.test(r.slice(7))
      && referenceRemboursement(r, 60).length === 17 && referenceVersement(r).length <= 17);
    cas('Référence générée : 17 caractères avec suffixe, aucun I, L, O, U dans les 6 caractères, unique',
      { formats: true, uniques: 500 }, { formats: refOk, uniques: new Set(refs).size });
    // Spec 05 : montant en lettres
    cas('En lettres : 500 € = « cinq cents euros »', 'cinq cents euros', enLettres(50000));
    cas('En lettres : 80,65 € = « quatre-vingts euros et soixante-cinq centimes »',
      'quatre-vingts euros et soixante-cinq centimes', enLettres(8065));

    // Ajoutés par le lot 0, mis à jour le 25/09 : en mode durée, arrondi au centime inférieur, la
    // dernière échéance ramasse le reste, durée demandée jamais raccourcie. En mode mensualité,
    // arrondi du nombre d'échéances à l'entier supérieur, la dernière peut tomber sous 10 €.
    cas('Arrondi inférieur : 181 €, durée 18 : 18 échéances, 17 × 10,05 € puis 10,15 €',
      { n: 18, mensualite: 1005, derniere: 1015, valide: true, erreurs: [] },
      resume(echeancier({ montant: 18100, mode: 'duree', duree: 18, premiereDate: d0 })));
    cas('Mode mensualité : 505 €, mensualité 10 € : 51 échéances, 50 × 10,00 € puis 5,00 € (la dernière prend le reste, même sous 10 €)',
      { n: 51, mensualite: 1000, derniere: 500, valide: true, erreurs: [] },
      resume(echeancier({ montant: 50500, mode: 'mensualite', mensualite: 1000, premiereDate: d0 })));
    cas('Arrondi inférieur : 599 €, durée 59 : 59 échéances, 58 × 10,15 € puis 10,30 €',
      { n: 59, mensualite: 1015, derniere: 1030, valide: true, erreurs: [] },
      resume(echeancier({ montant: 59900, mode: 'duree', duree: 59, premiereDate: d0 })));
    cas('Mode mensualité : 601 €, mensualité 10 € : 61 échéances, refusé au-delà de 60 mois',
      { n: 61, mensualite: 1000, derniere: 100, valide: false, erreurs: ['duree_max'] },
      resume(echeancier({ montant: 60100, mode: 'mensualite', mensualite: 1000, premiereDate: d0 })));
    const toutes = [];
    for (let a = 100; a <= 5000; a += 7) for (const n of [1, 2, 3, 7, 12, 24, 59, 60]) {
      const e = echeancier({ montant: a * 100, mode: 'duree', duree: n, premiereDate: d0 });
      if (e.valide) toutes.push({ e, A: a * 100, n });
    }
    const t599 = { montant: 59900, mode: 'duree', duree: 59, mensualite: 0, premiereDate: d0 };
    const n599 = normaliserTermes(t599);
    cas('Arrondi inférieur : 599 € sur 59 mois, brouillon puis envoi (termes renormalisés deux fois) : même échéancier, 58 × 10,15 € puis 10,30 €',
      [resume(echeancier(t599)), resume(echeancier(t599))],
      [resume(echeancier(n599)), resume(echeancier(normaliserTermes(n599)))]);
    cas('Arrondi inférieur : sur ' + toutes.length + ' échéanciers valides, renormaliser les termes ne change aucune échéance',
      true, toutes.every(({ A, n }) => { const t = { montant: A, mode: 'duree', duree: n, premiereDate: d0 };
        const r = echeancier(normaliserTermes(normaliserTermes(t)));
        return JSON.stringify(r.echeances) === JSON.stringify(echeancier(t).echeances); }));
    cas('Arrondi inférieur : sur ' + toutes.length + ' échéanciers valides, aucune échéance sous 10 € et la somme vaut le montant',
      true, toutes.every(({ e, A }) => e.echeances.every(x => x.montant >= 1000)
        && e.echeances.reduce((s, x) => s + x.montant, 0) === A));

    // Balayage exhaustif, mode durée : tous les montants entiers de 100 à 5 000 €, toutes les durées
    // autorisées (au plus 60 mois, et au plus le montant divisé par 10 €). Trois invariants par
    // combinaison : somme exacte, aucune échéance sous 10 €, nombre d'échéances égal à la durée demandée.
    // ponytail: environ 6 s parce que chaque combinaison pose ses dates. Le mode mensualité suit.
    let combinaisons = 0, echecsBalayage = 0;
    for (let a = 100; a <= 5000; a++) {
      const A = a * 100, nMax = Math.min(BORNES.dureeMax, Math.floor(A / BORNES.mensualiteMin));
      for (let n = 1; n <= nMax; n++) {
        combinaisons++;
        const e = echeancier({ montant: A, mode: 'duree', duree: n, premiereDate: d0 });
        const m = e.echeances.map(x => x.montant);
        if (!(e.valide && e.n === n && m.length === n && Math.min.apply(null, m) >= BORNES.mensualiteMin
          && m.reduce((s, x) => s + x, 0) === A)) echecsBalayage++;
      }
    }
    cas('Balayage exhaustif, mode durée : sur ' + combinaisons + ' combinaisons montant et durée, somme exacte, aucune échéance sous 10 €, durée jamais raccourcie',
      { echecs: 0 }, { echecs: echecsBalayage });

    // Balayage exhaustif, mode mensualité : montants de 100 à 5 000 €, toutes les mensualités entières
    // de 10 € au montant. Quatre invariants par combinaison acceptée : somme exacte, échéances régulières
    // égales à la mensualité choisie, dernière au plus égale aux autres, 60 échéances au plus. Au-delà de
    // 60 échéances, la combinaison doit être refusée pour duree_max.
    // ponytail: montants de 10 en 10, environ 5 s. Le balayage complet, 12,4 millions de combinaisons,
    // demande près d'une minute ; il a été passé une fois hors navigateur le 25/09, sans échec.
    // Pour l'élargir, ramener le pas à 1 en dehors de verifierCalculs().
    let combMens = 0, echecsMens = 0;
    for (let a = 100; a <= 5000; a += 10) {
      const A = a * 100;
      for (let euros = 10; euros <= a; euros++) {
        const M = euros * 100, n = Math.ceil(A / M);
        combMens++;
        const e = echeancier({ montant: A, mode: 'mensualite', mensualite: M, premiereDate: d0 });
        if (n > BORNES.dureeMax) {
          if (!(e.n === n && !e.valide && e.erreurs.some(x => x.code === 'duree_max'))) echecsMens++;
          continue;
        }
        const m = e.echeances.map(x => x.montant);
        if (!(e.valide && e.n === n && m.length === n && m.slice(0, n - 1).every(x => x === M)
          && m[n - 1] <= M && m.reduce((s, x) => s + x, 0) === A)) echecsMens++;
      }
    }
    cas('Balayage exhaustif, mode mensualité : sur ' + combMens + ' combinaisons montant et mensualité, somme exacte, échéances régulières à la mensualité choisie, dernière au plus égale aux autres, 60 échéances au plus',
      { echecs: 0 }, { echecs: echecsMens });

    // Ajoutés : bornes et plafond
    cas('Montant 99 € : refusé (sous 100 €) ; 5 001 € : refusé (au-delà de 5 000 €)',
      ['montant_min', 'montant_max'],
      [echeancier({ montant: 9900, mode: 'duree', duree: 1, premiereDate: d0 }).erreurs[0].code,
       echeancier({ montant: 500100, mode: 'duree', duree: 60, premiereDate: d0 }).erreurs[0].code]);
    const etatPl = { prets: [
      { id: 'a', preteurId: 'moi', emprunteurId: 'x', statut: 'en_cours', dateValide: '2026-02-01', termes: { montant: 300000 } },
      { id: 'b', preteurId: 'moi', emprunteurId: 'y', statut: 'rembourse', dateValide: '2026-05-01', termes: { montant: 180000 } },
      { id: 'c', preteurId: 'moi', emprunteurId: 'y', statut: 'annule', dateValide: '2026-05-01', termes: { montant: 100000 } },
      { id: 'd', preteurId: 'moi', emprunteurId: 'y', statut: 'rembourse', dateValide: '2025-05-01', termes: { montant: 100000 } }] };
    cas('Plafond : 4 800 € prêtés en 2026 (annulé et 2025 exclus), 300 € proposés : dépassé, reste 200 €',
      { total: 480000, reste: 20000, depasse: true }, (({ total, reste, depasse }) => ({ total, reste, depasse }))(plafondAnnuel(etatPl, 'moi', 'prete', 30000, 2026)));
    cas('Plafond : rien emprunté en 2026 : 5 000 € proposés acceptés, 5 100 € refusés',
      [false, true], [plafondAnnuel(etatPl, 'moi', 'emprunte', 500000, 2026).depasse, plafondAnnuel(etatPl, 'moi', 'emprunte', 510000, 2026).depasse]);

    // Ajouté par P-8 : cumul de l'année entre les deux mêmes personnes, dans les deux sens (décision 2)
    const etatCumul = { prets: [
      { id: 'a', preteurId: 'moi', emprunteurId: 'c-thomas', statut: 'en_cours', dateValide: '2026-02-01', termes: { montant: 300000 } },
      { id: 'b', preteurId: 'c-thomas', emprunteurId: 'moi', statut: 'rembourse', dateValide: '2026-06-01', termes: { montant: 200000 } },
      { id: 'c', preteurId: 'moi', emprunteurId: 'c-nadia', statut: 'en_cours', dateValide: '2026-03-01', termes: { montant: 400000 } },
      { id: 'd', preteurId: 'c-thomas', emprunteurId: 'moi', statut: 'annule', dateValide: '2026-04-01', termes: { montant: 100000 } },
      { id: 'e', preteurId: 'moi', emprunteurId: 'c-thomas', statut: 'rembourse', dateValide: '2025-07-01', termes: { montant: 250000 } }] };
    cas('P-8 : cumul avec Thomas en 2026 dans les deux sens : 5 000 € (annulé et 2025 exclus), 1 € de plus dépasse',
      [{ total: 500000, cumul: 500000, depasse: false }, { total: 500000, cumul: 500100, depasse: true }],
      [cumulEntreProches(etatCumul, 'moi', 'c-thomas', 0, 2026), cumulEntreProches(etatCumul, 'moi', 'c-thomas', 100, 2026)]);
    cas('P-8 : cumul avec Nadia : seuls leurs prêts comptent ; le prêt examiné est exclu du total',
      [{ total: 400000, cumul: 450000, depasse: false }, { total: 200000, cumul: 200000, depasse: false }],
      [cumulEntreProches(etatCumul, 'moi', 'c-nadia', 50000, 2026), cumulEntreProches(etatCumul, 'moi', 'c-thomas', 0, 2026, 'a')]);

    // Ajoutés : état des échéances et flamme (règles 00 §4.2 et 09)
    const pretT = st => ({ statut: st, reference: 'TILLIT-7KQ4M9', changements: [], gamification: { paliersFetes: [] },
      termes: { montant: 50000, duree: 5 },
      echeances: [1, 2, 3, 4, 5].map(k => ({ numero: k, date: ajouterMois('2026-01-10', k - 1), montant: 10000, dateInitiale: null })),
      declarations: [
        { id: 'd1', type: 'remboursement', numeros: [1], montant: 10000, date: '2026-01-10', statut: 'confirmee', dateConfirmation: '2026-01-12' },
        { id: 'd2', type: 'remboursement', numeros: [2], montant: 10000, date: '2026-02-09', statut: 'confirmee', dateConfirmation: '2026-02-20' },
        { id: 'd3', type: 'remboursement', numeros: [3], montant: 10000, date: '2026-03-10', statut: 'declaree', dateConfirmation: null }] });
    const pt = pretT('en_cours');
    cas('États au 2026-04-15 : remboursée, remboursée, en attente, à déclarer, prochaine',
      ['remboursee', 'remboursee', 'en_attente', 'a_declarer', 'prochaine'], etatsEcheances(pt, '2026-04-15').map(e => e.etat));
    cas('États d\'un prêt validé non versé : tout « à venir », aucune échéance ne court',
      ['a_venir', 'a_venir', 'a_venir', 'a_venir', 'a_venir'], etatsEcheances(Object.assign(pretT('valide'), { declarations: [] }), '2026-04-15').map(e => e.etat));
    cas('Flamme au 2026-03-20 : 1 (la 2e, confirmée après 11 jours, ne compte pas sans éteindre ; la 3e attend : atténuée)',
      { valeur: 1, allumee: true, attenue: true }, flamme(pt, '2026-03-20'));
    cas('Flamme au 2026-04-15 : 0 (la 4e est passée sans déclaration)',
      { valeur: 0, allumee: false, attenue: false }, flamme(pt, '2026-04-15'));
    cas('Reste à rembourser : 300 € ; ni remboursé ni déclaré : 200 €', [30000, 20000],
      [resteARembourser(pt, '2026-04-15'), resteNonDeclare(pt, '2026-04-15')]);
    const cal = calendrierDuReste(pt, { mode: 'duree', duree: 4, premiereDate: '2026-05-01' }, '2026-04-15');
    cas('Nouveau calendrier sur 200 € en 4 : numéros 4 à 7 (à la suite de R03, dernier numéro utilisé), 4 × 50 €',
      { numeros: [4, 5, 6, 7], montants: [5000, 5000, 5000, 5000], avant: [4, 5] },
      { numeros: cal.echeances.map(e => e.numero), montants: cal.echeances.map(e => e.montant), avant: cal.avant.map(e => e.numero) });
    cas('Paliers : 2 remboursements confirmés : palier 1 atteint, à fêter', { atteints: [1], aFeter: 1 },
      { atteints: paliersAtteints(pt, '2026-04-15'), aFeter: palierAFeter(pt, '2026-04-15') });
    cas('Rappels J+3 pour le prêteur le 2026-04-13 : échéance du 10 avril à déclarer', ['rappel_jp3'],
      rappelsDuJour(pt, '2026-04-13', [-5, 0, 3, 5, 7], 'preteur').map(r => r.cle));
    cas('Rappel J0 d\'une échéance en attente : le prêteur reçoit « rappel_confirmation », l\'emprunteur rien',
      [['rappel_confirmation'], []],
      [rappelsDuJour(pt, '2026-03-10', [-5, 0, 3, 5, 7], 'preteur').map(r => r.cle), rappelsDuJour(pt, '2026-03-10', [-5, 0, 3, 5, 7], 'emprunteur').map(r => r.cle)]);
    const etatCarnet = { prets: [
      { preteurId: 'x', emprunteurId: 'moi', statut: 'cloture', fin: { cadeauReste: 20000 }, echeances: [], declarations: [] },
      { preteurId: 'x', emprunteurId: 'moi', statut: 'cloture', fin: { cadeauReste: null }, echeances: [], declarations: [] },
      { preteurId: 'x', emprunteurId: 'moi', statut: 'rembourse', fin: {}, echeances: [], declarations: [] },
      { preteurId: 'x', emprunteurId: 'moi', statut: 'annule', fin: {}, echeances: [], declarations: [] }] };
    cas('Décision 2 : Carnet, clôturé avec cadeau à part, sans cadeau en « Non remboursés », annulé exclu',
      { total: 3, rembourses: 1, nonRembourses: 1, clotureResteOffert: 1, enCours: 0 }, carnet(etatCarnet, 'moi', d0).recus);

    // Formats (textes.js), si chargé
    if (window.textes) {
      cas('Formats : 1 500 € et 80,65 € avec espace insécable avant €', ['1 500 €', '80,65 €'],
        [window.textes.euros(150000), window.textes.euros(8065)]);
    }

    let ok = true;
    for (const r of resultats) {
      ok = ok && r.ok;
      if (r.ok) console.log(`OK · ${r.nom}`);
      else console.log(`ÉCHEC · ${r.nom}\n   attendu : ${JSON.stringify(r.attendu)}\n   obtenu  : ${JSON.stringify(r.obtenu)}`);
    }
    console.log(ok ? `verifierCalculs : ${resultats.length} cas, tous OK` : `verifierCalculs : ${resultats.filter(r => !r.ok).length} ÉCHEC sur ${resultats.length}`);
    return { ok, resultats };
  }
  window.verifierCalculs = verifierCalculs;
})();
