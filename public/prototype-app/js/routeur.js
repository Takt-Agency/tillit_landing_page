/* ==========================================================================
   TilliT prototype · routeur.js (lot 0)
   Registres ecrans / actions / saisies, pile d'historique, fondu de 0,3 s,
   en-tête et barre de navigation des écrans principaux, délégation des
   data-action (clic) et data-saisie (input, change), démarrage.

   Écran :   ecrans['route'] = (etat, params) => html
             ou { rendu: (etat, params) => html, arrivee: params => {…} }
             (arrivee : une fois à l'arrivée sur l'écran, jamais au re-rendu)
   Action :  actions['nom'] = (el, etat, params) => {…}   (clic sur [data-action="nom"])
   Saisie :  saisies['nom'] = (el, etat, params, type) => {…}   ([data-saisie="nom"], type 'input' | 'change')
   Re-rendu : après une action, l'écran est re-rendu si l'état a changé.
   Après une saisie, jamais (la frappe reste fluide) : appelle routeur.rafraichir()
   si besoin. Un changement d'état venu d'ailleurs (proche simulé, notification)
   re-rend l'écran en gardant le texte saisi, le focus et le défilement.
   ========================================================================== */
(function () {
  'use strict';
  const PRINCIPAUX = ['accueil', 'parcours', 'carnet', 'profil'];
  const CLE_NAV = 'tillit-prototype-nav';

  /* ---------- Registres, avec alerte si deux lots prennent le même nom ---------- */
  const provisoires = new Set();
  function registre(nom) {
    return new Proxy({}, {
      set(cible, cle, valeur) {
        if (cle in cible && !provisoires.has(`${nom}:${String(cle)}`)) console.warn(`[TilliT] ${nom}['${String(cle)}'] est enregistré deux fois : le dernier gagne.`);
        provisoires.delete(`${nom}:${String(cle)}`);
        cible[cle] = valeur;
        return true;
      }
    });
  }
  for (const nom of ['ecrans', 'actions', 'saisies']) {
    Object.defineProperty(window, nom, { value: registre(nom), writable: false, configurable: false, enumerable: true });
  }
  // Écran ou action provisoire du lot 0 : un lot peut le remplacer sans alerte.
  const marquerProvisoire = (registreNom, cle) => provisoires.add(`${registreNom}:${cle}`);

  /* ---------- Navigation ---------- */
  let courant = { route: null, params: {} };
  let pile = [];
  let minuteries = [];
  let enDispatch = false, enRendu = false, versionEtat = 0, planifie = false;

  const $ = id => document.getElementById(id);
  function sauverNav() { try { sessionStorage.setItem(CLE_NAV, JSON.stringify({ courant, pile })); } catch (err) { /* sans stockage : rien */ } }
  function annulerMinuteries() { for (const m of minuteries) clearTimeout(m); minuteries = []; }

  // aller(route, params, { racine: true } vide la pile, { remplacer: true } remplace l'écran courant)
  function aller(route, params = {}, options = {}) {
    if (options.racine) pile = [];
    else if (courant.route && !options.remplacer) pile.push(courant);
    courant = { route, params: Object.assign({}, params) };
    naviguer();
  }
  function retour() {
    if (!pile.length) { aller(window.modele.lire().session.connecte ? 'accueil' : 'compte-creer', {}, { racine: true }); return; }
    courant = pile.pop();
    naviguer();
  }
  function naviguer() {
    annulerMinuteries();
    window.ui.feuille.fermer(true);
    sauverNav();
    rendre({ fondu: true, arrivee: true });
  }
  const peutRevenir = () => pile.length > 0;
  // Minuterie liée à l'écran : annulée si l'on quitte l'écran (lancement 2 s, code 1 s…).
  function plusTard(fn, ms) { const m = setTimeout(fn, ms); minuteries.push(m); return m; }

  /* ---------- Rendu ---------- */
  function ecranInconnu(etat, params) {
    return window.ui.enteteRetour({ titre: '' })
      + `<div class="provisoire"><h1 class="titre">Écran en préparation</h1><p class="texte-mute">Cet écran arrive bientôt.</p></div>`;
  }
  function capturer(main) {
    const valeurs = {};
    main.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
      valeurs[el.id] = el.type === 'checkbox' || el.type === 'radio'
        ? { checked: el.checked, defaut: el.defaultChecked } : { value: el.value, defaut: el.tagName === 'SELECT' ? null : el.defaultValue };
    });
    const actif = document.activeElement;
    let focus = null;
    if (actif && main.contains(actif) && actif !== main) {
      if (actif.id) focus = { id: actif.id };
      else if (actif.dataset && actif.dataset.action) {
        const memes = [...main.querySelectorAll(`[data-action="${CSS.escape(actif.dataset.action)}"]`)];
        focus = { action: actif.dataset.action, index: memes.indexOf(actif) };
      }
      try { if (focus && actif.selectionStart != null) focus.sel = [actif.selectionStart, actif.selectionEnd]; } catch (err) { /* type sans sélection */ }
    }
    return { valeurs, focus, scroll: main.scrollTop };
  }
  // Un champ garde ce que le testeur a saisi, sauf si le nouveau rendu change sa valeur de départ.
  function restaurer(main, c) {
    for (const [id, v] of Object.entries(c.valeurs)) {
      const el = document.getElementById(id);
      if (!el || !main.contains(el)) continue;
      if ('checked' in v) { if (el.defaultChecked === v.defaut) el.checked = v.checked; }
      else if (v.defaut === null || el.defaultValue === v.defaut) { if (el.value !== v.value) el.value = v.value; }
    }
    main.scrollTop = c.scroll;
    if (!c.focus) return;
    const el = c.focus.id ? document.getElementById(c.focus.id)
      : main.querySelectorAll(`[data-action="${CSS.escape(c.focus.action)}"]`)[c.focus.index];
    if (!el) return;
    el.focus({ preventScroll: true });
    if (c.focus.sel) try { el.setSelectionRange(c.focus.sel[0], c.focus.sel[1]); } catch (err) { /* type sans sélection */ }
  }
  // Remplace le contenu seulement s'il change : un re-rendu identique n'avale pas un clic en cours.
  const derniersHtml = new Map();
  function remplir(el, html, force) {
    if (!force && derniersHtml.get(el) === html) return false;
    el.innerHTML = html;
    derniersHtml.set(el, html);
    return true;
  }
  function rendreChrome() {
    const principal = PRINCIPAUX.includes(courant.route) && window.modele.lire().session.connecte;
    const entete = $('entete'), barre = $('barre');
    entete.hidden = !principal; barre.hidden = !principal;
    $('app').classList.toggle('app--principal', principal);
    remplir(entete, principal ? window.ui.entetePrincipal() : '');
    remplir(barre, principal ? window.ui.barreNavigation(courant.route) : '');
  }
  // fondu : navigation. Sans fondu (re-rendu), saisies, focus et défilement sont gardés.
  function rendre({ fondu = false, arrivee = false } = {}) {
    const main = $('ecran');
    const def = window.ecrans[courant.route] || ecranInconnu;
    const fn = typeof def === 'function' ? def : def.rendu;
    let html;
    enRendu = true;
    try { html = fn(window.modele.lire(), courant.params) || ''; }
    catch (err) {
      console.error(`[TilliT] l'écran « ${courant.route} » est en erreur`, err);
      html = window.ui.enteteRetour({}) + '<div class="provisoire"><h1 class="titre">Cet écran a un souci.</h1><p class="texte-mute">Reviens en arrière et réessaie.</p></div>';
    } finally { enRendu = false; }
    const avant = fondu ? null : capturer(main);
    const change = remplir(main, html, fondu || main.dataset.route !== courant.route);
    main.dataset.route = courant.route;
    rendreChrome();
    if (fondu) {
      main.classList.remove('ecran--fondu');
      void main.offsetWidth;   // relance l'animation
      main.classList.add('ecran--fondu');
      main.scrollTop = 0;
      main.focus({ preventScroll: true });
    } else if (change) restaurer(main, avant);
    if (arrivee && def.arrivee) { try { def.arrivee(courant.params); } catch (err) { console.error(`[TilliT] arrivee de « ${courant.route} » en erreur`, err); } }
  }
  function rafraichir() { if (courant.route) rendre({}); }

  // Tout changement d'état hors d'une action ou d'une saisie re-rend l'écran (une fois par tâche).
  window.surEvenement(evt => {
    versionEtat++;
    if (evt.type === 'reinitialisation') { annulerMinuteries(); window.ui.viderBannieres(); window.ui.feuille.fermer(true); pile = []; }
    if (enRendu) { console.warn('[TilliT] un écran a modifié l\'état pendant son rendu : interdit, rien n\'est re-rendu.'); return; }
    if (enDispatch || evt.type === 'reinitialisation' || planifie || !courant.route) return;
    planifie = true;
    queueMicrotask(() => { planifie = false; rafraichir(); });
  });

  /* ---------- Délégation ---------- */
  function dispatch(fn) {
    const avant = versionEtat, ecranAvant = courant;
    enDispatch = true;
    try { fn(); } catch (err) { console.error('[TilliT] gestionnaire en erreur', err); }
    finally { enDispatch = false; }
    if (courant === ecranAvant && versionEtat !== avant) rendre({});
  }
  function paramsDe(el) {
    const p = {};
    for (const [k, v] of Object.entries(el.dataset)) if (k !== 'action' && k !== 'route') p[k] = v;
    return p;
  }
  function brancher() {
    const app = $('app');
    app.addEventListener('click', ev => {
      const el = ev.target.closest('[data-action]');
      if (!el || !app.contains(el) || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      const h = window.actions[el.dataset.action];
      if (!h) { console.warn(`[TilliT] aucune action « ${el.dataset.action} » n'est enregistrée`); return; }
      ev.preventDefault();
      dispatch(() => h(el, window.modele.lire(), courant.params));
    });
    const surSaisie = ev => {
      const el = ev.target.closest('[data-saisie]');
      if (!el || !app.contains(el)) return;
      if (ev.type === 'input' && (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT')) return;
      const h = window.saisies[el.dataset.saisie];
      if (!h) { console.warn(`[TilliT] aucune saisie « ${el.dataset.saisie} » n'est enregistrée`); return; }
      enDispatch = true;
      try { h(el, window.modele.lire(), courant.params, ev.type); } catch (err) { console.error('[TilliT] saisie en erreur', err); }
      finally { enDispatch = false; }
    };
    app.addEventListener('input', surSaisie);
    app.addEventListener('change', surSaisie);
    // Un formulaire ne recharge jamais la page.
    app.addEventListener('submit', ev => ev.preventDefault());
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && window.ui.feuille.ouverte()) window.ui.feuille.fermer(); });
  }

  /* ---------- Actions intégrées ---------- */
  const A = window.actions;
  A.retour = () => retour();
  // <button data-action="aller" data-route="fil" data-pret-id="p-1"> : params = autres data-*
  A.aller = el => aller(el.dataset.route, paramsDe(el));
  A.onglet = el => aller(el.dataset.route, paramsDe(el), { racine: true });
  A['nouveau-pret'] = () => {
    const option = (role, titre, sous) => `<button type="button" class="option" data-action="nouveau-pret-choix" data-role="${role}">`
      + `<span class="option-titre">${titre}</span><span class="option-sous">${sous}</span>${window.ui.icone('chevron-droite')}</button>`;
    window.ui.feuille.ouvrir('<div class="options">'
      + option('preteur', "Prêter de l'argent", 'Tu proposes un prêt à un proche.')
      + option('emprunteur', 'Demander un prêt', "Tu demandes de l'argent à un proche.") + '</div>', { titre: 'Nouveau prêt' });
  };
  // Ouvre la création (lot C, spec 03) avec le rôle choisi : params { role: 'preteur' | 'emprunteur' }.
  A['nouveau-pret-choix'] = el => aller('creer-qui', { role: el.dataset.role });

  /* ---------- Démarrage (spec 01 : ordre d'ouverture) ---------- */
  function demarrer() {
    brancher();
    const e = window.modele.lire();
    let nav = null;
    try { nav = JSON.parse(sessionStorage.getItem(CLE_NAV)); } catch (err) { nav = null; }
    const connu = r => r && window.ecrans[r.route];
    if (location.hash === '#invitation' && !e.session.connecte && window.ecrans['invitation-message'] && !(nav && connu(nav.courant))) {
      aller('invitation-message', {}, { racine: true }); return;
    }
    // Rechargement : on revient là où l'on était.
    if (nav && connu(nav.courant) && (e.session.connecte || !PRINCIPAUX.includes(nav.courant.route))) {
      pile = (nav.pile || []).filter(connu);
      courant = nav.courant;
      naviguer();
      return;
    }
    if (e.session.connecte) { aller('accueil', {}, { racine: true }); return; }
    aller(window.ecrans.lancement ? 'lancement' : 'compte-creer', {}, { racine: true });
  }
  document.addEventListener('DOMContentLoaded', demarrer);

  window.routeur = Object.freeze({
    aller, retour, rafraichir, peutRevenir, plusTard, marquerProvisoire,
    courant: () => ({ route: courant.route, params: Object.assign({}, courant.params) }),
    PRINCIPAUX
  });
})();
