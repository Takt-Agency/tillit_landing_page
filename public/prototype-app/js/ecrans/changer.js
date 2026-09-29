/* ==========================================================================
   TilliT prototype · lot H · Quand ça change : réaménager, payer une partie, écrire, tiers
   Spec : 08-quand-ca-change.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot H.

   Routes : difficulte, nouveau-calendrier, decaler, payer-partie, changement-envoye,
   changement-recu, changement-accepte, changement-refuse, fil, tiers-prevenir.
   Paramètres : { pretId } partout ; { numero } pour decaler et payer-partie ;
   { chgId } pour répondre « Proposer autre chose » ; fil : { modele: 'prevenir' | 'relance', numero }
   pour un message prérempli.
   ========================================================================== */
(function () {
  'use strict';
  const { euros, date, echapper, selonRole, insecables, moisAnnee } = textes;
  const E = window.ecrans, A = window.actions, S = window.saisies, C = window.calculs;
  const esc = echapper;
  const LIBRES = ['a_declarer', 'prochaine', 'a_venir'];

  /* ---------- Aides ---------- */
  const autreDe = p => modele.prenom(modele.autre(p));
  const demain = () => C.ajouterJours(modele.aujourdhui(), 1);
  const auPlusTot = d => (!d || d < demain() ? demain() : d);
  const libres = p => modele.echeances(p).filter(e => LIBRES.includes(e.etat));
  const somme = l => l.reduce((s, e) => s + e.montant, 0);
  // Mensualité d'une liste d'échéances : le montant le plus fréquent (une échéance coupée ou la dernière peuvent différer).
  function mensualite(l) {
    const n = {};
    for (const e of l) n[e.montant] = (n[e.montant] || 0) + 1;
    return Number(Object.keys(n).sort((a, b) => n[b] - n[a])[0] || 0);
  }
  const concernee = p => { const l = libres(p); return l.find(e => e.etat === 'a_declarer') || l.find(e => e.etat === 'prochaine') || l[0] || null; };
  const introuvable = () => ui.enteteRetour({});
  const retourPret = (pretId, variante = 'principal') => ui.bouton('Retour au prêt', { action: 'changer-voir-pret', variante, params: { pretId } });
  A['changer-voir-pret'] = el => routeur.aller('parcours', { pretId: el.dataset.pretId }, { racine: true });
  // Même règle que dans parcours.js (variante du prototype, spec 08).
  function peutPrevenirTiers(p) {
    if (p.statut !== 'en_cours' || !p.tiers || !p.tiers.accepte || p.tiers.alerte || modele.role(p) !== 'preteur') return false;
    if (modele.changementEnAttente(p)) return false;
    return modele.echeances(p).some(e => e.etat === 'a_declarer' && C.joursEntre(e.date, modele.aujourdhui()) >= 7);
  }
  // Message prérempli, modifiable : il suit les choix tant que le testeur ne l'a pas retouché.
  function champMessage(etat) {
    return ui.zoneTexte({ id: 'changer-message', libelle: 'Message', valeur: etat.message, saisie: 'changer-message', lignes: 3 });
  }
  let courant = null;   // état local de l'écran de saisie ouvert (nc, decaler ou partie)
  S['changer-message'] = el => { if (courant) { courant.message = el.value; courant.modifie = el.value !== courant.defaut; } };
  function majMessage(defaut) {
    if (!courant) return;
    courant.defaut = defaut;
    if (courant.modifie) return;
    courant.message = defaut;
    const z = document.getElementById('changer-message');
    if (z) z.value = defaut;
  }
  function majBouton(actif) { const b = document.getElementById('changer-envoyer'); if (b) b.disabled = !actif; }
  // En attente d'une réponse : rien d'autre ne s'envoie (etat.js le refuse), on le dit avec les phrases de la spec 07.
  function blocEnAttente(p, chg) {
    const autre = autreDe(p);
    if (chg.auteurId === 'moi') return `<p class="changer-attente">${esc(insecables(chg.type === 'passage_zen' ? `En attente de la réponse de ${autre}.`
      : `C'est envoyé. Le nouveau calendrier s'applique quand ${autre} l'aura accepté. En attendant, le calendrier prévu reste en place.`))}</p>`;
    return `<p class="changer-attente">${esc(chg.type === 'passage_zen' ? `${autre} propose de passer le prêt en Zen.` : `${autre} propose un nouveau calendrier.`)}</p>`
      + ui.bouton('Voir la proposition', { action: 'aller', params: { route: 'changement-recu', pretId: p.id } });
  }

  /* ==========================================================================
     difficulte (spec 08) : cartes de choix, chacune ouvre son écran.
     ========================================================================== */
  E.difficulte = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p), e = concernee(p), chg = modele.changementEnAttente(p);
    const carte = (titre, sous, route, extra = {}, desactive = false) => `<button type="button" class="option changer-choix" data-action="aller" data-route="${route}" data-pret-id="${esc(p.id)}"`
      + Object.entries(extra).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('') + (desactive ? ' disabled' : '') + '>'
      + `<span class="option-titre">${esc(titre)}</span><span class="option-sous">${esc(insecables(sous))}</span>${ui.icone('chevron-droite')}</button>`;
    let h = ui.enteteRetour({}) + '<h1 class="titre">Ce mois-ci est compliqué ?</h1>'
      + `<p class="sous-titre">${esc(`Préviens ${autre}, et propose-lui un autre calendrier.`)}</p>`;
    if (chg) h += blocEnAttente(p, chg);
    const bloque = !!chg || !e || p.statut !== 'en_cours';
    h += '<div class="options changer-choix-liste">';
    if (e) {
      h += carte('Décaler cette échéance', `Une nouvelle date pour l'échéance du ${date(e.date)}.`, 'decaler', { numero: e.numero }, bloque)
        + carte('Revoir tout le plan', `Un nouveau rythme pour ce qui reste : ${euros(somme(libres(p)))}.`, 'nouveau-calendrier', {}, bloque)
        + carte('Payer une partie', 'Tu règles une partie maintenant, le reste à une date que tu proposes.', 'payer-partie', { numero: e.numero }, bloque || modele.role(p) !== 'emprunteur')
        + carte(`Prévenir ${autre}`, "Un message dans le fil du prêt, sans rien changer pour l'instant.", 'fil', { modele: 'prevenir', numero: e.numero });
    }
    h += '</div>' + ui.bulle("Prévenir tôt, c'est déjà prendre soin de l'autre. Le reste se décide à deux.", { pose: modele.role(p) === 'emprunteur' ? 'preoccupee' : 'attentive' });
    return h;
  };

  /* ==========================================================================
     Barres avant / après (spec 08, G-24) : une barre par échéance.
     ========================================================================== */
  function colonne(titre, liste, max, nouveau) {
    const n = liste.length;
    const barres = liste.map(e => `<span class="changer-barre" style="height:${Math.max(6, Math.round(e.montant / max * 100))}%"></span>`).join('');
    const lignes = n ? [`${n} × ${euros(mensualite(liste))}`, `Fin en ${moisAnnee(liste[n - 1].date)}`] : [];
    const aria = n ? `${titre} : ${lignes.join(', ')}` : titre;
    return `<div class="changer-col${nouveau ? ' changer-col--nouveau' : ''}"><p class="changer-col-titre">${esc(titre)}</p>`
      + `<div class="changer-graphe anim-appear${n > 24 ? ' changer-graphe--serre' : ''}" role="img" aria-label="${esc(aria)}">${barres}</div>`
      + lignes.map(l => `<p class="changer-col-ligne">${esc(l)}</p>`).join('') + '</div>';
  }
  function barres(avant, apres, titres) {
    const max = Math.max(1, ...avant.map(e => e.montant), ...apres.map(e => e.montant));
    return `<div class="changer-barres">${colonne(titres[0], avant, max, false)}${colonne(titres[1], apres, max, true)}</div>`;
  }
  const pareil = (a, b) => a.length === b.length && a.every((e, i) => e.date === b[i].date && e.montant === b[i].montant);

  /* ==========================================================================
     nouveau-calendrier (spec 08) : sur le reste réel, total inchangé écrit.
     Aussi « Proposer autre chose » en réponse à un calendrier reçu ({ chgId }).
     ========================================================================== */
  const MESSAGE_CALENDRIER = 'Je te propose un nouveau calendrier pour la suite. Le total ne change pas.';
  function initCalendrier(p, chgId) {
    const recu = chgId ? p.changements.find(c => c.id === chgId) : null;
    let termes;
    if (recu && recu.termes) termes = Object.assign({}, recu.termes);
    else {
      const l = libres(p);
      termes = { mode: 'mensualite', mensualite: l.length ? mensualite(l) : p.termes.mensualite, duree: l.length || 1, premiereDate: l.length ? l[0].date : demain() };
    }
    termes.premiereDate = auPlusTot(termes.premiereDate);
    return { ecran: 'calendrier', pretId: p.id, chgId: chgId || null, termes, message: MESSAGE_CALENDRIER, defaut: MESSAGE_CALENDRIER, modifie: false };
  }
  function calendrierEnvoyable(p, v) {
    if (!v.valide || pareil(v.echeances, v.avant)) return false;
    const recu = courant.chgId ? p.changements.find(c => c.id === courant.chgId) : null;
    return !(recu && pareil(v.echeances, recu.apres));
  }
  E['nouveau-calendrier'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p), chgId = params.chgId || null;
    const chg = modele.changementEnAttente(p);
    let h = ui.enteteRetour({}) + '<h1 class="titre">Voilà ce que ça donne</h1>'
      + `<p class="sous-titre">${esc(`${autre} devra l'accepter avant que ça s'applique.`)}</p>`;
    if (p.statut !== 'en_cours' || (chg && chg.id !== chgId)) return h + (chg ? blocEnAttente(p, chg) : '');
    if (!courant || courant.ecran !== 'calendrier' || courant.pretId !== p.id || courant.chgId !== chgId) courant = initCalendrier(p, chgId);
    courant.termes.premiereDate = auPlusTot(courant.termes.premiereDate);
    const cfg = { id: 'changer-bt', termes: courant.termes, role: modele.role(p), autreId: modele.autre(p), pretId: p.id,
                  avecMontant: false, surLeReste: true, surChangement: (t, v) => majCalendrier(p.id, t, v) };
    const v = ui.verdictTermes(cfg);
    return h + `<p class="changer-reste">${esc(insecables(`Reste à rembourser : ${euros(v.reste)}`))}</p>`
      + ui.blocTermes(cfg)
      + `<div id="changer-barres">${barres(v.avant, v.echeances, ["Aujourd'hui", 'Nouvelle proposition'])}</div>`
      + `<p class="changer-total">${esc(`Montant total · ${euros(somme(p.echeances))} · inchangé`)}</p>`
      + champMessage(courant)
      + ui.bouton(`Envoyer à ${autre}`, { action: 'changer-envoyer-calendrier', id: 'changer-envoyer', params: { pretId: p.id }, desactive: !calendrierEnvoyable(p, v) });
  };
  function majCalendrier(pretId, t, v) {
    if (!courant || courant.ecran !== 'calendrier') return;
    courant.termes = { mode: t.mode, mensualite: t.mensualite, duree: t.duree, premiereDate: t.premiereDate };
    const p = modele.pret(pretId);
    ui.majZone('changer-barres', barres(v.avant, v.echeances, ["Aujourd'hui", 'Nouvelle proposition']));
    majBouton(calendrierEnvoyable(p, v));
  }
  A['changer-envoyer-calendrier'] = el => {
    if (!courant || courant.ecran !== 'calendrier') return;
    const p = modele.pret(el.dataset.pretId);
    const chg = { type: 'calendrier', termes: Object.assign({}, courant.termes), message: courant.message };
    const r = courant.chgId ? repondreChangement(courant.chgId, 'autre', chg) : proposerChangement(p.id, chg);
    if (!r.ok) { console.warn('[TilliT] nouveau calendrier :', r.erreur); return; }
    courant = null;
    routeur.aller('changement-envoye', { pretId: p.id }, { remplacer: true });
  };

  /* ==========================================================================
     decaler (spec 08) : une nouvelle date pour une échéance, jamais avant demain.
     Aussi « Proposer autre chose » en réponse à une date décalée ou à une partie ({ chgId }).
     ========================================================================== */
  const messageDecaler = (e, d) => insecables(`Je te propose de décaler l'échéance du ${date(e.date)} au ${date(d)}. Le total ne change pas.`);
  E.decaler = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p), numero = Number(params.numero), chgId = params.chgId || null;
    const e = modele.echeances(p).find(x => x.numero === numero && LIBRES.includes(x.etat));
    const chg = modele.changementEnAttente(p);
    let h = ui.enteteRetour({}) + '<h1 class="titre">Décaler cette échéance</h1>';
    if (!e || p.statut !== 'en_cours') return h;
    h += `<p class="sous-titre">${esc(`Échéance du ${date(e.date)} · ${euros(e.montant)}`)}</p>`;
    if (chg && chg.id !== chgId) return h + blocEnAttente(p, chg);
    if (!courant || courant.ecran !== 'decaler' || courant.pretId !== p.id || courant.numero !== numero || courant.chgId !== chgId) {
      const recu = chgId ? p.changements.find(c => c.id === chgId) : null;
      const d = auPlusTot(recu ? recu.apres[0].date : C.ajouterJours(e.date, 14));
      courant = { ecran: 'decaler', pretId: p.id, numero, chgId, nouvelleDate: d, message: messageDecaler(e, d), defaut: messageDecaler(e, d), modifie: false };
    }
    return h + ui.champ({ id: 'changer-date', libelle: 'Nouvelle date', type: 'date', valeur: courant.nouvelleDate, min: demain(), saisie: 'changer-date' })
      + `<p class="changer-avant-apres"><del><span class="visuellement-cache">Avant : </span>${esc(date(e.date))}</del> <span id="changer-nouvelle">${esc(date(courant.nouvelleDate))}</span></p>`
      + '<p class="changer-note">Le montant total ne change pas. Seule la date bouge.</p>'
      + champMessage(courant)
      + ui.bouton(`Envoyer à ${autre}`, { action: 'changer-envoyer-decaler', id: 'changer-envoyer', params: { pretId: p.id }, desactive: courant.nouvelleDate === e.date });
  };
  S['changer-date'] = (el, etat, params, type) => {
    if (!courant || courant.ecran !== 'decaler' || type !== 'change' || !el.value) return;
    const p = modele.pret(courant.pretId), e = p && modele.echeances(p).find(x => x.numero === courant.numero);
    if (!e) return;
    courant.nouvelleDate = auPlusTot(el.value);
    if (el.value !== courant.nouvelleDate) el.value = courant.nouvelleDate;
    ui.majZone('changer-nouvelle', esc(date(courant.nouvelleDate)));
    majMessage(messageDecaler(e, courant.nouvelleDate));
    majBouton(courant.nouvelleDate !== e.date);
  };
  A['changer-envoyer-decaler'] = el => {
    if (!courant || courant.ecran !== 'decaler') return;
    const chg = { type: 'decaler', numero: courant.numero, nouvelleDate: courant.nouvelleDate, message: courant.message };
    const r = courant.chgId ? repondreChangement(courant.chgId, 'autre', chg) : proposerChangement(el.dataset.pretId, chg);
    if (!r.ok) { console.warn('[TilliT] décaler :', r.erreur); return; }
    courant = null;
    routeur.aller('changement-envoye', { pretId: el.dataset.pretId }, { remplacer: true });
  };

  /* ==========================================================================
     payer-partie (spec 08, D-29) : la partie est déclarée tout de suite,
     le report du reste attend l'accord de l'autre (voir 91).
     ========================================================================== */
  const messagePartie = (partie, reste, d) => insecables(`Je te rembourse ${euros(partie)} maintenant. Je te propose de régler les ${euros(reste)} restants le ${date(d)}.`);
  const partieValide = (e, c) => c.partie != null && c.partie > 0 && c.partie < e.montant;
  E['payer-partie'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p);
    const e = modele.echeances(p).find(x => x.numero === Number(params.numero) && LIBRES.includes(x.etat)) || concernee(p);
    const chg = modele.changementEnAttente(p);
    let h = ui.enteteRetour({}) + '<h1 class="titre">Payer une partie</h1>';
    if (!e || p.statut !== 'en_cours' || modele.role(p) !== 'emprunteur') return h;
    h += `<p class="sous-titre">${esc(`Échéance du ${date(e.date)} · ${euros(e.montant)}`)}</p>`;
    if (chg) return h + blocEnAttente(p, chg);
    if (!courant || courant.ecran !== 'partie' || courant.pretId !== p.id || courant.numero !== e.numero) {
      courant = { ecran: 'partie', pretId: p.id, numero: e.numero, saisie: '', partie: null, moyen: 'virement',
                  nouvelleDate: auPlusTot(C.ajouterJours(e.date, 14)), message: '', defaut: '', modifie: false };
    }
    const ok = partieValide(e, courant);
    const reste = ok ? e.montant - courant.partie : e.montant;
    const trop = courant.partie != null && courant.partie >= e.montant;
    return h + ui.champ({ id: 'changer-partie', libelle: 'Je rembourse maintenant', valeur: courant.saisie, inputmode: 'decimal', suffixe: '€', saisie: 'changer-partie' })
      + `<p class="champ-erreur changer-partie-erreur" id="changer-partie-erreur"${trop ? '' : ' hidden'}>${esc(`Un montant inférieur à ${euros(e.montant)}.`)}</p>`
      + '<p class="champ-libelle" id="changer-comment">Comment</p><div class="pastilles" role="group" aria-labelledby="changer-comment">'
      + [['virement', 'Virement'], ['especes', 'Espèces']].map(([v, l]) => `<button type="button" class="pastille" data-action="changer-moyen" data-valeur="${v}" aria-pressed="${courant.moyen === v}">${l}</button>`).join('') + '</div>'
      + `<div id="changer-ref">${htmlReference(e)}</div>`
      + ui.champ({ id: 'changer-reste-date', libelle: `Le reste, ${euros(reste)}, le`, type: 'date', valeur: courant.nouvelleDate, min: demain(), saisie: 'changer-reste-date' })
      + champMessage(courant)
      + ui.bouton(`Envoyer à ${autre}`, { action: 'changer-envoyer-partie', id: 'changer-envoyer', params: { pretId: p.id }, desactive: !ok });
  };
  function htmlReference(e) {
    if (courant.moyen !== 'virement' || !e.reference) return '';
    return `<div class="changer-ref">${ui.lignesRecap([['Référence', e.reference]])}${ui.boutonCopier(e.reference, { libelle: 'Copier' })}</div>`;
  }
  function majPartie() {
    const p = modele.pret(courant.pretId), e = p && modele.echeances(p).find(x => x.numero === courant.numero);
    if (!e) return;
    const ok = partieValide(e, courant), trop = courant.partie != null && courant.partie >= e.montant;
    const reste = ok ? e.montant - courant.partie : e.montant;
    const lib = document.querySelector('label[for="changer-reste-date"]');
    if (lib) lib.textContent = `Le reste, ${euros(reste)}, le`;
    const err = document.getElementById('changer-partie-erreur'), champ = document.getElementById('changer-partie');
    if (err) err.hidden = !trop;
    if (champ) { if (trop) { champ.setAttribute('aria-invalid', 'true'); champ.setAttribute('aria-describedby', 'changer-partie-erreur'); } else { champ.removeAttribute('aria-invalid'); champ.removeAttribute('aria-describedby'); } }
    if (ok) majMessage(messagePartie(courant.partie, reste, courant.nouvelleDate));
    majBouton(ok);
  }
  S['changer-partie'] = el => {
    if (!courant || courant.ecran !== 'partie') return;
    courant.saisie = el.value;
    courant.partie = textes.versCentimes(el.value);
    majPartie();
  };
  S['changer-reste-date'] = (el, etat, params, type) => {
    if (!courant || courant.ecran !== 'partie' || type !== 'change' || !el.value) return;
    courant.nouvelleDate = auPlusTot(el.value);
    if (el.value !== courant.nouvelleDate) el.value = courant.nouvelleDate;
    majPartie();
  };
  A['changer-moyen'] = el => {
    if (!courant || courant.ecran !== 'partie') return;
    courant.moyen = el.dataset.valeur === 'especes' ? 'especes' : 'virement';
    document.querySelectorAll('[data-action="changer-moyen"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.valeur === courant.moyen)));
    const p = modele.pret(courant.pretId), e = p && modele.echeances(p).find(x => x.numero === courant.numero);
    if (e) ui.majZone('changer-ref', htmlReference(e));
  };
  A['changer-envoyer-partie'] = el => {
    if (!courant || courant.ecran !== 'partie') return;
    const r = proposerChangement(el.dataset.pretId, { type: 'partie', numero: courant.numero, partiePayee: courant.partie, moyen: courant.moyen,
                                                       nouvelleDate: courant.nouvelleDate, message: courant.message });
    if (!r.ok) { console.warn('[TilliT] payer une partie :', r.erreur); return; }
    courant = null;
    routeur.aller('changement-envoye', { pretId: el.dataset.pretId }, { remplacer: true });
  };

  /* ---------- changement-envoye (spec 08, A-24) ---------- */
  E['changement-envoye'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    return `<div class="changer-centre">${ui.mascotte('envoi', { taille: 'moyenne' })}<h1 class="titre">C'est envoyé.</h1>`
      + `<p>${esc(`Le nouveau calendrier s'applique quand ${autreDe(p)} l'aura accepté. En attendant, le calendrier prévu reste en place.`)}</p>`
      + retourPret(p.id) + '</div>';
  };

  /* ==========================================================================
     changement-recu (spec 08, A-25, A-37, A-40) : trois réponses empilées.
     ========================================================================== */
  // Échéances libres telles qu'elles seraient avec le changement (pour la colonne « Proposé »).
  function avecChangement(p, c) {
    if (c.type === 'calendrier') return { avant: c.avant, apres: c.apres };
    const avant = libres(p).map(e => ({ numero: e.numero, date: e.date, montant: e.montant }));
    const apres = avant.map(e => { const a = c.apres.find(x => x.numero === e.numero); return a ? Object.assign({}, e, { date: a.date }) : e; })
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.numero - b.numero));
    return { avant, apres };
  }
  const barre = (ancien, nouveau) => `<del><span class="visuellement-cache">Avant : </span>${esc(ancien)}</del> <strong>${esc(nouveau)}</strong>`;
  E['changement-recu'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p), role = modele.role(p);
    const c = params.chgId ? p.changements.find(x => x.id === params.chgId) : modele.changementEnAttente(p);
    if (!c || c.statut !== 'en_attente' || c.auteurId === 'moi') {
      return ui.enteteRetour({}) + `<div class="changer-centre"><h1 class="titre">Ta réponse est envoyée.</h1>${retourPret(p.id)}</div>`;
    }
    const titre = c.type === 'passage_zen' ? `${autre} propose de passer le prêt en Zen`
      : c.type === 'partie' ? `${autre} propose de payer une partie`
      : selonRole(role, `${autre} propose un nouveau calendrier`, `${autre} propose un autre calendrier`);
    let h = ui.enteteRetour({}) + `<h1 class="titre">${esc(titre)}</h1>`;
    const dateConcernee = c.type === 'partie' ? c.apres[0].dateInitiale : c.avant[0] ? c.avant[0].date : null;
    if (dateConcernee && dateConcernee >= modele.aujourdhui()) h += `<p class="sous-titre">${esc(`${autre} te prévient avant l'échéance.`)}</p>`;
    if (c.type === 'passage_zen') {
      const prix = C.prixZen(p.termes.montant);
      h += `<p>${esc(insecables(`Vous signez tous les deux une reconnaissance de dette pour ce prêt. Le prix dépend du montant du prêt : ${euros(prix)} pour ${euros(p.termes.montant)}.`))}</p>`
        + `<p class="changer-note">${esc(c.payeurZenId === 'moi' ? `Tu paies ${euros(prix)}, une seule fois.` : `${autre} paie ${euros(prix)}, une seule fois.`)}</p>`;
    } else {
      const { avant, apres } = avecChangement(p, c);
      h += barres(avant, apres, ['Prévu', 'Proposé']) + '<h2 class="changer-intertitre">Ce qui change</h2>';
      let lignes;
      if (c.type === 'calendrier') {
        const a = c.avant, b = c.apres;
        lignes = [['Par mois', ui.brut(barre(euros(mensualite(a)), euros(mensualite(b))))],
                  ['Durée', ui.brut(barre(`${a.length} mois`, `${b.length} mois`))],
                  ['Fin', ui.brut(barre(moisAnnee(a[a.length - 1].date), moisAnnee(b[b.length - 1].date)))]];
      } else if (c.type === 'decaler') {
        lignes = [['Date', ui.brut(barre(date(c.avant[0].date), date(c.apres[0].date)))]];
      } else {
        lignes = [['Remboursé maintenant', euros(c.partiePayee)],
                  [`Le reste, ${euros(c.apres[0].montant)}`, ui.brut(barre(`le ${date(c.apres[0].dateInitiale)}`, `le ${date(c.apres[0].date)}`))]];
      }
      h += ui.lignesRecap(lignes, { classe: 'changer-change' }) + '<p class="changer-note">Le montant total ne change pas. Seul le calendrier bouge.</p>';
    }
    if (c.message) h += `<blockquote class="changer-citation"><p>${esc(c.message)}</p><footer>${esc(autre)}</footer></blockquote>`;
    return h + ui.boutonsReponse({ accepter: 'changer-accepter', autre: 'changer-autre', refuser: 'changer-refuser', params: { pretId: p.id, chgId: c.id } });
  };
  A['changer-accepter'] = el => {
    const r = repondreChangement(el.dataset.chgId, 'accepte');
    if (!r.ok) { console.warn('[TilliT] accepter le changement :', r.erreur); return; }
    routeur.aller('changement-accepte', { pretId: el.dataset.pretId, chgId: el.dataset.chgId }, { remplacer: true });
  };
  A['changer-autre'] = el => {
    const p = modele.pret(el.dataset.pretId), c = p && p.changements.find(x => x.id === el.dataset.chgId);
    if (!c) return;
    if (c.type === 'calendrier') routeur.aller('nouveau-calendrier', { pretId: p.id, chgId: c.id });
    else if (c.type === 'passage_zen') ouvrirPayeurZen(p, c, c.payeurZenId === 'moi' ? modele.autre(p) : 'moi');
    else routeur.aller('decaler', { pretId: p.id, numero: c.apres[0].numero, chgId: c.id });
  };
  // Passage en Zen : « Proposer autre chose » ne change que le payeur (spec 05).
  function ouvrirPayeurZen(p, c, payeur) {
    const autre = autreDe(p), prix = C.prixZen(p.termes.montant);
    ui.feuille.ouvrir(ui.interrupteur({ id: 'changer-payeur', libelle: "C'est moi qui paie Zen", coche: payeur === 'moi', saisie: 'changer-payeur' })
      + `<p class="changer-note" id="changer-payeur-ligne">${esc(payeur === 'moi' ? `Tu paies ${euros(prix)}, une seule fois.` : `${autre} paie ${euros(prix)}, une seule fois.`)}</p>`
      + ui.bouton(`Envoyer à ${autre}`, { action: 'changer-envoyer-payeur', id: 'changer-envoyer', params: { pretId: p.id, chgId: c.id }, desactive: payeur === c.payeurZenId }),
    { titre: 'Proposer autre chose' });
  }
  S['changer-payeur'] = el => {
    const b = document.getElementById('changer-envoyer');
    const p = b && modele.pret(b.dataset.pretId), c = p && p.changements.find(x => x.id === b.dataset.chgId);
    if (!c) return;
    const payeur = el.checked ? 'moi' : modele.autre(p), prix = C.prixZen(p.termes.montant);
    ui.majZone('changer-payeur-ligne', esc(payeur === 'moi' ? `Tu paies ${euros(prix)}, une seule fois.` : `${autreDe(p)} paie ${euros(prix)}, une seule fois.`));
    b.disabled = payeur === c.payeurZenId;
  };
  A['changer-envoyer-payeur'] = el => {
    const p = modele.pret(el.dataset.pretId), champ = document.getElementById('changer-payeur');
    const r = repondreChangement(el.dataset.chgId, 'autre', { type: 'passage_zen', payeurZenId: champ && champ.checked ? 'moi' : modele.autre(p) });
    if (!r.ok) { console.warn('[TilliT] passage en Zen :', r.erreur); return; }
    routeur.aller('parcours', { pretId: p.id }, { racine: true });
  };
  A['changer-refuser'] = el => {
    const p = modele.pret(el.dataset.pretId), c = p && p.changements.find(x => x.id === el.dataset.chgId);
    if (!c) return;
    if (c.type === 'passage_zen') { refuserChangement(el.dataset.chgId, p.id, false); return; }
    ui.feuille.ouvrir('<p>Le calendrier prévu reste en place.</p><div class="pile-reponses">'
      + ui.bouton('Refuser', { action: 'changer-refuser-oui', params: { pretId: p.id, chgId: c.id } })
      + ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>', { titre: 'Refuser ce calendrier ?' });
  };
  A['changer-refuser-oui'] = el => refuserChangement(el.dataset.chgId, el.dataset.pretId, true);
  function refuserChangement(chgId, pretId, calendrier) {
    const r = repondreChangement(chgId, 'refuse');
    if (!r.ok) { console.warn('[TilliT] refuser le changement :', r.erreur); return; }
    const succes = ui.carteSucces({ titre: 'Ta réponse est envoyée.', texte: calendrier ? 'Le calendrier prévu reste en place.' : '',
                                    bouton: { libelle: 'Retour au prêt', action: 'changer-voir-pret', params: { pretId } } });
    if (ui.feuille.ouverte()) ui.feuille.maj(succes); else ui.feuille.ouvrir(succes, {});
  }

  /* ---------- changement-accepte (spec 08, G-25, C-46) ---------- */
  E['changement-accepte'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p);
    const c = params.chgId ? p.changements.find(x => x.id === params.chgId) : p.changements.filter(x => x.statut === 'acceptee').pop();
    if (!c || c.statut !== 'acceptee') return introuvable();
    const moiAccepte = (c.reponses[c.reponses.length - 1] || {}).auteurId === 'moi';
    if (c.type === 'passage_zen') {
      const payer = p.zen && !p.zen.paye && p.zen.payeurId === 'moi';
      return `<div class="changer-centre">${ui.mascotte('confiante', { taille: 'moyenne', anim: 'pop' })}`
        + `<h1 class="titre">${esc(moiAccepte ? 'Passage en Zen accepté par vous deux' : `${autre} a accepté`)}</h1>`
        + (moiAccepte ? '' : `<p>${esc(`${autre} a accepté de passer le prêt en Zen.`)}</p>`)
        + (payer ? ui.bouton('Payer Zen', { action: 'zen-payer', params: { pretId: p.id } }) : '')
        + retourPret(p.id, payer ? 'secondaire' : 'principal') + '</div>';
    }
    const ech = modele.echeances(p);
    const prochaine = ech.find(e => e.etat === 'prochaine') || ech.find(e => LIBRES.includes(e.etat));
    const fin = p.echeances.map(e => e.date).sort().pop();
    const lignes = [];
    if (c.type === 'calendrier') lignes.push(['Nouvelle mensualité', euros(mensualite(c.apres))]);
    if (prochaine) lignes.push(['Prochaine échéance', `${date(prochaine.date)} · ${euros(prochaine.montant)}`]);
    lignes.push(['Nouvelle fin', date(fin)]);
    return `<div class="changer-centre"><div class="succes-coche anim-pop">${ui.icone('coche', { taille: 34 })}</div>${ui.mascotte('reamenagee', { taille: 'moyenne' })}`
      + `<h1 class="titre">${esc(moiAccepte ? 'Nouveau calendrier en place' : `${autre} a accepté`)}</h1>`
      + '<p>Le nouveau plan est en place. Vos deux applications affichent les mêmes dates.</p></div>'
      + ui.carte(ui.lignesRecap(lignes))
      + "<p class=\"changer-note\">Ce changement est consigné dans l'historique du prêt, avec la date et l'accord de chacun.</p>"
      + retourPret(p.id);
  };

  /* ---------- changement-refuse, côté auteur (spec 08, A-26) ---------- */
  E['changement-refuse'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p) return introuvable();
    const autre = autreDe(p);
    const c = p.changements.filter(x => x.statut === 'refusee' && x.auteurId === 'moi').pop();
    const t = c && c.type === 'passage_zen' ? `${autre} préfère garder le prêt sur Note.` : `${autre} préfère garder le calendrier prévu.`;
    return ui.enteteRetour({}) + `<div class="changer-centre">${ui.mascotte('desaccord', { taille: 'moyenne' })}<h1 class="titre">${esc(t)}</h1></div>`
      + '<div class="pile-reponses">' + ui.bouton(`Écrire à ${autre}`, { action: 'aller', params: { route: 'fil', pretId: p.id } })
      + ui.bouton('Voir le prêt', { action: 'changer-voir-pret', variante: 'secondaire', params: { pretId: p.id } }) + '</div>';
  };

  /* ==========================================================================
     fil (spec 08, D-30) : un fil par prêt, visible par les deux proches ;
     le tiers de confiance le rejoint seulement une fois prévenu.
     ========================================================================== */
  function prerempli(p, params) {
    const e = p.echeances.find(x => x.numero === Number(params.numero));
    if (!e) return '';
    if (params.modele === 'prevenir') return insecables(`Je préfère te prévenir : l'échéance du ${date(e.date)} va être compliquée pour moi. On en parle ?`);
    if (params.modele === 'relance') return insecables(`L'échéance du ${date(e.date)} est passée, tu me dis où tu en es ?`);
    return '';
  }
  // Message envoyé au tiers à la fin du prêt (spec 10, 12) : montré aux deux proches, sans aucun chiffre.
  function apercuFinTiers(p, tiers) {
    if (!tiers || (p.statut !== 'rembourse' && p.statut !== 'cloture')) return '';
    const m = window.TEXTES_HORS_NOTIF.messageFinTiers({ tiers, preteur: modele.prenom(p.preteurId), emprunteur: modele.prenom(p.emprunteurId) });
    return `<p class="changer-fil-info">${esc(`On a prévenu ${tiers} que votre prêt est terminé.`)}</p>`
      + `<blockquote class="changer-apercu"><p>${esc(insecables(m))}</p></blockquote>`;
  }
  E.fil = {
    rendu(etat, params) {
      const p = modele.pret(params.pretId);
      if (!p) return introuvable();
      const autre = autreDe(p), role = modele.role(p);
      const tiers = p.tiers && p.tiers.alerte ? modele.prenom(p.tiers.contactId) : null;
      const titre = ui.brut(`<span class="changer-fil-avatars">${ui.avatar(modele.autre(p), { taille: 's' })}${ui.avatar('moi', { taille: 's' })}${tiers ? ui.avatar(p.tiers.contactId, { taille: 's' }) : ''}</span>`
        + `<span>${esc(autre)}${ui.certifie(modele.autre(p))}${esc(` · ${euros(p.termes.montant)}`)}</span>`);
      // P-11 (décision de Yohann du 24/09/2026) : le tiers ne voit ni montant ni date. On le dit ici aux deux proches.
      let h = ui.enteteRetour({ titre }) + '<p class="changer-fil-info">' + ui.mascotte('explication', { taille: 'petite' }) + 'Ce fil est visible par vous deux.'
        + (tiers ? ` ${esc(`${tiers}, votre tiers de confiance, l'a rejoint le ${date(p.tiers.alerte)}. Vos messages lui sont visibles à partir de ce jour. Les montants et les dates ne lui sont pas montrés.`)}` : '')
        + '</p>' + apercuFinTiers(p, tiers) + '<ol class="changer-fil">';
      for (const f of p.fil) {
        if (f.auteur === 'tillit') { h += `<li class="changer-evt">${esc(`TilliT · ${modele.texteFil(f)} · ${date(f.date)}`)}</li>`; continue; }
        const moi = f.auteurId ? f.auteurId === 'moi' : f.auteur === role;
        const mention = f.auteur === 'tiers' ? `<span class="changer-mention">${esc(`${modele.prenom(f.auteurId)} · tiers de confiance`)}</span>` : '';
        h += `<li class="changer-bulle changer-bulle--${moi ? 'moi' : f.auteur === 'tiers' ? 'tiers' : 'autre'}">${mention}<p>${esc(f.texte)}</p>`
          + `<span class="changer-bulle-date">${esc(moi ? date(f.date) : `${modele.prenom(f.auteurId || modele.autre(p))} · ${date(f.date)}`)}</span></li>`;
      }
      const texte = prerempli(p, params);
      return h + '</ol><div class="changer-composer">'
        + `<label class="visuellement-cache" for="changer-fil-texte">${esc(`Écris à ${autre}`)}</label>`
        + `<textarea class="champ-input changer-fil-texte" id="changer-fil-texte" rows="2" maxlength="2000" placeholder="${esc(`Écris à ${autre}`)}" data-saisie="changer-fil-saisie">${esc(texte)}</textarea>`
        + ui.bouton('Envoyer', { action: 'changer-fil-envoyer', id: 'changer-fil-envoyer', params: { pretId: p.id }, pleine: false, desactive: !texte }) + '</div>';
    },
    arrivee() { defilerEnBas(); }
  };
  function defilerEnBas() { const m = document.getElementById('ecran'); if (m) m.scrollTop = m.scrollHeight; }
  S['changer-fil-saisie'] = el => { const b = document.getElementById('changer-fil-envoyer'); if (b) b.disabled = !el.value.trim(); };
  A['changer-fil-envoyer'] = el => {
    const champ = document.getElementById('changer-fil-texte');
    const texte = champ ? champ.value.trim() : '';
    if (!texte) { if (champ) champ.focus(); return; }
    const r = ecrire(el.dataset.pretId, texte);
    if (!r.ok) { console.warn('[TilliT] écrire :', r.erreur); return; }
    champ.value = '';
    const c = routeur.courant();
    if (c.params.modele) routeur.aller('fil', { pretId: el.dataset.pretId }, { remplacer: true });   // plus de texte prérempli
    else routeur.plusTard(() => { defilerEnBas(); const z = document.getElementById('changer-fil-texte'); if (z) z.focus({ preventScroll: true }); }, 0);
  };

  /* ---------- tiers-prevenir (spec 08) : message factuel, sans jugement, sans montant ni date ---------- */
  E['tiers-prevenir'] = (etat, params) => {
    const p = modele.pret(params.pretId);
    if (!p || !p.tiers) return introuvable();
    const tiers = modele.prenom(p.tiers.contactId);
    if (p.tiers.alerte) {
      return ui.enteteRetour({}) + `<h1 class="titre">${esc(`Prévenir ${tiers} ?`)}</h1>`
        + `<p>${esc(`${tiers}, votre tiers de confiance, l'a rejoint le ${date(p.tiers.alerte)}.`)}</p>`
        + ui.bouton(`Écrire à ${autreDe(p)}`, { action: 'aller', params: { route: 'fil', pretId: p.id } });
    }
    const apercu = insecables(`Bonjour ${tiers}. ${modele.prenom(p.preteurId)} et ${modele.prenom(p.emprunteurId)} t'ont choisi(e) comme tiers de confiance pour un prêt entre eux. `
      + "Ils ont besoin de reprendre la discussion : un remboursement attend. TilliT ne te donne ni montant ni date, cela reste entre eux. "
      + "TilliT leur propose de déclarer un remboursement ou de proposer un nouveau calendrier. Peux-tu leur proposer d'en parler ?");
    return ui.enteteRetour({ type: 'croix' }) + `<h1 class="titre">${esc(`Prévenir ${tiers} ?`)}</h1>`
      + `<p>${esc(`TilliT envoie à ${tiers} un message factuel. ${tiers} rejoint ensuite le fil du prêt.`)}</p>`
      + `<blockquote class="changer-apercu"><p>${esc(apercu)}</p></blockquote>`
      + '<div class="pile-reponses">' + ui.bouton(`Prévenir ${tiers}`, { action: 'changer-tiers-oui', params: { pretId: p.id }, desactive: p.statut !== 'en_cours' || !p.tiers.accepte })
      + ui.bouton('Annuler', { action: 'retour', variante: 'discret', classe: 'btn--centre' }) + '</div>';
  };
  A['changer-tiers-oui'] = el => {
    const r = alerterTiers(el.dataset.pretId);
    if (!r.ok) { console.warn('[TilliT] prévenir le tiers :', r.erreur); return; }
    routeur.aller('fil', { pretId: el.dataset.pretId }, { remplacer: true });
  };

  /* ---------- Ce qui arrive d'ailleurs ---------- */
  surEvenement(evt => {
    if (evt.type === 'reinitialisation') { courant = null; return; }
    const c = routeur.courant();
    if (evt.type === 'action' && evt.nom === 'ecrire' && c.route === 'fil' && c.params.pretId === evt.pretId) routeur.plusTard(defilerEnBas, 30);
  });
})();
