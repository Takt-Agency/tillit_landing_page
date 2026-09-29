/* ==========================================================================
   TilliT prototype · ui.js (lot 0)
   Composants partagés (spec 00 §7). Chaque composant rend une chaîne HTML.
   Échappement : les paramètres texte (libellé, titre, texte, valeur) sont
   échappés par le composant. Pour passer du HTML déjà sûr, utilise
   ui.brut('<strong>…</strong>') ; les paramètres nommés `contenu` sont du
   HTML, à échapper par l'appelant (textes.echapper).
   ========================================================================== */
(function () {
  'use strict';
  const T = window.textes, C = window.calculs;
  const esc = T.echapper;
  const brut = html => ({ html: String(html) });
  const txt = v => (v && typeof v === 'object' && 'html' in v ? v.html : esc(v));
  let compteurId = 0;
  const idUnique = prefixe => `${prefixe}-${++compteurId}`;
  // data-* à partir d'un objet { pretId: 'p-1' } -> data-pret-id="p-1"
  const donnees = params => Object.entries(params || {}).filter(([, v]) => v != null)
    .map(([k, v]) => ` data-${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}="${esc(v)}"`).join('');

  /* ---------- Icônes au trait (SVG), jamais d'emoji ---------- */
  const TRACES = {
    maison: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9.5V20h4.5v-5.5h4V20h4.5V9.5"/>',
    profil: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0"/>',
    chemin: '<circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="5.5" r="2"/><path d="M8 18.5h7.5a3.25 3.25 0 0 0 0-6.5h-7a3.25 3.25 0 0 1 0-6.5H16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    carnet: '<path d="M6.5 3.5H19v15H6.5A1.5 1.5 0 0 0 5 20V5a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M5 20a1.5 1.5 0 0 0 1.5 1.5H19"/><path d="M9 8h6M9 11.5h4"/>',
    cloche: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    cadeau: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5"/><path d="M12 8C10.5 5 7 4.5 7 6.8 7 8 9.5 8 12 8zm0 0c1.5-3 5-3.5 5-1.2C17 8 14.5 8 12 8z"/>',
    'fleche-gauche': '<path d="M15 5l-7 7 7 7"/>',
    croix: '<path d="M6 6l12 12M18 6 6 18"/>',
    flamme: '<path d="M12 3c1 3.5 5 5.6 5 10a5 5 0 0 1-10 0c0-2.4 1.4-4 2.5-5 .3 1.6 1.2 2.6 2.5 3 .6-2.6-.5-5.4 0-8z"/>',
    coche: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    sablier: '<path d="M7 3.5h10M7 20.5h10M8 3.5v3l4 5.5-4 5.5v3M16 3.5v3L12 12l4 5.5v3"/>',
    interrogation: '<path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5"/><path d="M12 17.5v.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.01"/>',
    copier: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9.5a1 1 0 0 0 1 1h3.5"/>',
    'chevron-bas': '<path d="M6 9l6 6 6-6"/>',
    'chevron-droite': '<path d="M9 6l6 6-6 6"/>',
    echange: '<path d="M7 7.5h11l-3-3M17 16.5H6l3 3"/>',
    points: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>',
    message: '<path d="M4.5 5.5h15v10.5H10l-5.5 4z"/>',
    drapeau: '<path d="M5.5 21V4M5.5 4.5h11l-2 4 2 4h-11"/>',
    calendrier: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    sortie: '<path d="M14 4.5h4a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10"/>'
  };
  // icone('cloche') : décorative (aria-hidden). icone('cloche', { libelle: 'Notifications' }) : lue par les lecteurs d'écran.
  function icone(nom, { libelle = null, taille = 24, classe = '' } = {}) {
    const trace = TRACES[nom];
    if (!trace) { console.warn(`[TilliT] icône inconnue « ${nom} »`); return ''; }
    const a11y = libelle ? `role="img" aria-label="${esc(libelle)}"` : 'aria-hidden="true" focusable="false"';
    const plein = nom === 'points' ? ' fill="currentColor"' : ' fill="none"';
    return `<svg class="icone ${classe}" width="${taille}" height="${taille}" viewBox="0 0 24 24"${plein} stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${trace}</svg>`;
  }

  /* ---------- Boutons ---------- */
  // variante : 'principal' (pilule violette) | 'secondaire' (bordure) | 'discret' (texte) | 'attention' (texte corail foncé) | 'blanc' (sur fond violet)
  function bouton(libelle, { action, variante = 'principal', params, desactive = false, id, icone: ic, pleine = true, classe = '', aria, type = 'button' } = {}) {
    return `<button type="${type}" class="btn btn--${variante}${pleine && variante !== 'discret' ? ' btn--pleine' : ''} ${classe}"`
      + (action ? ` data-action="${esc(action)}"` : '') + donnees(params) + (id ? ` id="${esc(id)}"` : '')
      + (aria ? ` aria-label="${esc(aria)}"` : '') + (desactive ? ' disabled' : '') + `>`
      + (ic ? icone(ic) : '') + `<span>${txt(libelle)}</span></button>`;
  }
  // Les trois réponses empilées, dans cet ordre, libellés fixes [D-61, C-70].
  function boutonsReponse({ accepter, autre, refuser, params } = {}) {
    return `<div class="pile-reponses">${bouton("J'accepte", { action: accepter, params })}`
      + bouton('Proposer autre chose', { action: autre, variante: 'secondaire', params })
      + bouton('Refuser', { action: refuser, variante: 'discret', params, pleine: true, classe: 'btn--centre' }) + '</div>';
  }
  function boutonIcone(nomIcone, libelle, { action = 'retour', params, id } = {}) {
    return `<button type="button" class="icone-bouton" data-action="${esc(action)}"${donnees(params)}${id ? ` id="${esc(id)}"` : ''} aria-label="${esc(libelle)}">${icone(nomIcone)}</button>`;
  }
  // Copie dans le presse-papiers, puis « Référence copiée » pendant 2 s.
  function boutonCopier(texte, { libelle = 'Copier la référence', variante = 'secondaire', pleine = false } = {}) {
    return `<button type="button" class="btn btn--${variante} btn--copier${pleine ? ' btn--pleine' : ''}" data-action="copier" data-texte="${esc(texte)}">${icone('copier', { taille: 20 })}<span>${esc(libelle)}</span></button>`;
  }

  /* ---------- Cartes, lignes, puces ---------- */
  const carte = (contenu, { classe = '' } = {}) => `<div class="carte ${classe}">${contenu}</div>`;
  // lignes : [[libellé, valeur], ...] ; valeur ui.brut(...) pour du HTML. { forte: true } en 3e position met la ligne en avant.
  function lignesRecap(lignes, { classe = '' } = {}) {
    return `<dl class="lignes ${classe}">` + lignes.filter(Boolean).map(([l, v, o = {}]) =>
      `<div class="ligne${o.forte ? ' ligne--forte' : ''}${o.corail ? ' ligne--corail' : ''}"><dt>${txt(l)}</dt><dd>${txt(v)}</dd></div>`).join('') + '</dl>';
  }
  // ton : 'action' | 'attente' | 'actif' | 'ok' | 'fin' | 'zen'
  const puce = (texte, ton = 'actif') => `<span class="puce puce--${esc(ton)}">${txt(texte)}</span>`;
  function pucePret(pret) { const p = window.modele.puce(pret); return p ? puce(p.texte, p.ton) : ''; }

  /* ---------- Avatar à initiales, jamais de photo ---------- */
  const TEINTES = ['lavande', 'peche', 'menthe', 'bleu'];
  function avatar(personneOuId, { taille = 'm', libelle = false } = {}) {
    const p = typeof personneOuId === 'string' ? window.modele.personne(personneOuId) : personneOuId;
    const prenom = (p && p.prenom) || '?', nom = (p && p.nom) || '';
    const initiales = (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
    const id = (p && p.id) || prenom;
    // P-9 n° 10 : image de profil choisie dans la galerie ({ teinte, pose }), sinon teinte calculée et initiales.
    const choisi = p && p.avatar;
    const teinte = (choisi && choisi.teinte) || (id === 'moi' ? 'moi' : TEINTES[[...id].reduce((s, c) => s + c.charCodeAt(0), 0) % TEINTES.length]);
    const a11y = libelle ? `role="img" aria-label="${esc([prenom, nom].join(' ').trim())}"` : 'aria-hidden="true"';
    const dedans = choisi && choisi.pose && POSES[choisi.pose]
      ? `<img class="avatar-illu" src="assets/mascotte/${POSES[choisi.pose][0]}-240.webp" alt="" width="${POSES[choisi.pose][2]}" height="240" decoding="async">`
      : esc(initiales);
    return `<span class="avatar avatar--${esc(taille)} avatar--${teinte}" ${a11y}>${dedans}</span>`;
  }

  /* ---------- Mascotte TilliT (poses MX-1 : la seule table pose → fichier) ---------- */
  // pose : [fichier de assets/mascotte/, texte alternatif, largeur du -240.webp, largeur du -480.webp] ; hauteurs 240 et 480.
  // Absentes exprès : 05-inquiete, 06-grave, 17-a-terre (jamais face à un retard) ; 13-tiers, 18-en-course, 19-bravo (aucun écran pour l'instant).
  // 32-refus : seulement une échéance passée depuis plus de 7 jours, ni déclarée ni confirmée (retardLong).
  const POSES = {
    heureuse: ['01-heureuse', 'heureuse', 236, 472],
    confiante: ['02-confiante', 'confiante, les deux pouces levés', 251, 503],
    attentive: ['03-attentive', "attentive, l'index levé", 233, 466],
    preoccupee: ['04-preoccupee', 'préoccupée', 196, 392],
    soulagee: ['07-soulagee', 'les mains sur le cœur', 205, 410],
    celebration: ['08-celebration', 'qui fête, avec un trophée', 231, 463],
    signature: ['09-signature', 'qui signe', 258, 515],
    'en-attente': ['10-en-attente', 'en attente, assise sur un banc', 212, 423],
    proposition: ['11-proposition', 'avec une proposition', 197, 394],
    reamenagee: ['12-reamenagee', 'avec un nouveau calendrier', 196, 391],
    desaccord: ['14a-desaccord', 'avec une flèche vers la gauche', 191, 382],
    anticipe: ['15-anticipe', 'en avance, avec des pièces', 292, 584],
    merci: ['16-merci', 'qui dit merci', 230, 459],
    'coup-de-coeur': ['20-coup-de-coeur', 'les mains en cœur', 222, 444],
    'relance-douce': ['21-relance-douce', 'au téléphone', 254, 507],
    guide: ['22-guide', 'avec un guide en trois étapes', 264, 529],
    salut: ['23-salut', 'qui fait coucou', 249, 497],
    aide: ['24-aide', 'qui se pose une question', 183, 367],
    validation: ['25-validation', 'avec une coche', 258, 516],
    certifie: ['26-certifie', 'avec une pastille Certifié', 282, 564],
    identite: ['27-identite', "avec une carte d'identité", 284, 569],
    envoi: ['28-envoi', 'qui envoie une feuille', 291, 582],
    sablier: ['29-sablier', 'avec un sablier', 257, 514],
    explication: ['30-explication', 'qui explique', 262, 523],
    securite: ['31-securite', 'avec un bouclier', 250, 500],
    refus: ['32-refus', 'la main levée', 260, 521],
    'tenue-noel': ['tenue-noel', 'en tenue de Noël', 222, 444],
    'tenue-halloween': ['tenue-halloween', "en tenue d'Halloween", 211, 422],
    'tenue-plage': ['tenue-plage', 'en tenue de plage', 225, 449],
    'tenue-lunettes': ['tenue-lunettes', 'avec de grosses lunettes', 235, 470]
  };
  const TAILLES = { grande: '200px', moyenne: '140px', petite: '64px' };
  // taille : 'grande' | 'moyenne' | 'petite' (srcset 240/480). anim : 'bob' | 'pop' | null
  // Largeur et hauteur réelles du fichier 480 déclarées : le navigateur réserve la place avant le chargement (pas de bouton qui bouge sous le doigt).
  function mascotte(pose, { taille = 'moyenne', anim = null, alt } = {}) {
    const m = POSES[pose];
    if (!m) { console.warn(`[TilliT] pose de mascotte inconnue « ${pose} »`); return ''; }
    const [fichier, texte, l240, l480] = m, base = `assets/mascotte/${fichier}`;
    return `<img class="mascotte mascotte--${taille}${anim ? ' anim-' + anim : ''}" src="${base}-${taille === 'grande' ? 480 : 240}.webp"`
      + ` srcset="${base}-240.webp ${l240}w, ${base}-480.webp ${l480}w" sizes="${TAILLES[taille] || TAILLES.moyenne}"`
      + ` alt="${esc(alt || `TilliT, la mascotte, ${texte}`)}" width="${l480}" height="480" decoding="async">`;
  }
  // Échéance passée depuis plus de 7 jours (après le rappel J+7), ni déclarée ni confirmée.
  const retardLong = e => !!e && e.etat === 'a_declarer' && window.calculs.joursEntre(e.date, window.modele.aujourdhui()) > 7;
  // Pastille « Certifié » (compte créé avec France Identité) à côté d'un nom : elle informe, elle ne bloque rien.
  function certifie(personneOuId) {
    const p = typeof personneOuId === 'string' ? window.modele.personne(personneOuId) : personneOuId;
    return p && p.certifie ? `<span class="certifie" role="img" aria-label="Compte certifié" title="Compte certifié">${icone('coche', { taille: 12 })}</span>` : '';
  }
  const bulle = (texte, { pose = 'attentive' } = {}) =>
    `<div class="bulle">${mascotte(pose, { taille: 'petite' })}<p class="bulle-texte">${txt(texte)}</p></div>`;

  /* ---------- Progression ---------- */
  function progression(valeur, { libelle = 'Progression', classe = '' } = {}) {
    const v = Math.max(0, Math.min(1, valeur || 0)), pct = Math.round(v * 100);
    return `<div class="progression ${classe}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${esc(libelle)}"><span style="width:${pct}%"></span></div>`;
  }
  function anneau(valeur, { libelle = 'Progression', centre = '', taille = 88 } = {}) {
    const v = Math.max(0, Math.min(1, valeur || 0)), r = 38, L = 2 * Math.PI * r;
    return `<div class="anneau" style="width:${taille}px;height:${taille}px" role="img" aria-label="${esc(libelle)}">`
      + `<svg viewBox="0 0 88 88" width="${taille}" height="${taille}" aria-hidden="true"><circle cx="44" cy="44" r="${r}" class="anneau-fond"/>`
      + `<circle cx="44" cy="44" r="${r}" class="anneau-plein" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L * (1 - v)).toFixed(1)}"/></svg>`
      + `<span class="anneau-centre" aria-hidden="true">${txt(centre)}</span></div>`;
  }

  /* ---------- En-têtes ---------- */
  // Écrans secondaires : flèche (ou croix) qui revient à l'écran d'origine [C-03].
  function enteteRetour({ titre = '', type = 'fleche', action = 'retour', params, droite = '' } = {}) {
    return `<header class="entete-retour">${boutonIcone(type === 'croix' ? 'croix' : 'fleche-gauche', type === 'croix' ? 'Fermer' : 'Retour', { action, params })}`
      + `<p class="entete-retour-titre">${txt(titre)}</p><div class="entete-retour-droite">${droite}</div></header>`;
  }
  // Création d'un prêt : croix à gauche, compteur au centre, barre dessous (spec 03).
  function enteteEtape({ compteur, progression: v = 0, fermer = 'retour', retour = null, params } = {}) {
    return `<header class="etape"><div class="etape-gauche">${fermer ? boutonIcone('croix', 'Quitter', { action: fermer, params }) : ''}`
      + `${retour ? boutonIcone('fleche-gauche', 'Étape précédente', { action: retour, params }) : ''}</div>`
      + `<p class="etape-compteur">${txt(compteur)}</p><div class="etape-droite"></div></header>`
      + progression(v, { libelle: `Avancement : ${typeof compteur === 'string' ? compteur : ''}`, classe: 'etape-barre' });
  }

  /* ---------- Champs ---------- */
  // saisie : nom du gestionnaire dans saisies[...] (événements input et change).
  function champ({ id, libelle, type = 'text', valeur = '', exemple = '', aide = '', saisie, inputmode, min, max, erreur = '', autocomplete = 'off', maxlength, suffixe = '', classe = '' } = {}) {
    const idAide = aide ? `${id}-aide` : '', idErreur = erreur ? `${id}-erreur` : '';
    const decrit = [idAide, idErreur].filter(Boolean).join(' ');
    return `<div class="champ ${classe}"><label class="champ-libelle" for="${esc(id)}">${txt(libelle)}</label>`
      + `<div class="champ-boite${suffixe ? ' champ-boite--suffixe' : ''}"><input class="champ-input" id="${esc(id)}" name="${esc(id)}" type="${esc(type)}" value="${esc(valeur)}"`
      + (exemple ? ` placeholder="${esc(exemple)}"` : '') + (saisie ? ` data-saisie="${esc(saisie)}"` : '')
      + (inputmode ? ` inputmode="${esc(inputmode)}"` : '') + (min != null ? ` min="${esc(min)}"` : '') + (max != null ? ` max="${esc(max)}"` : '')
      + (maxlength ? ` maxlength="${esc(maxlength)}"` : '') + ` autocomplete="${esc(autocomplete)}"`
      + (decrit ? ` aria-describedby="${decrit}"` : '') + (erreur ? ' aria-invalid="true"' : '') + '>'
      + (suffixe ? `<span class="champ-suffixe" aria-hidden="true">${txt(suffixe)}</span>` : '') + '</div>'
      + (aide ? `<p class="champ-aide" id="${idAide}">${txt(aide)}</p>` : '')
      + (erreur ? `<p class="champ-erreur" id="${idErreur}">${txt(erreur)}</p>` : '') + '</div>';
  }
  function zoneTexte({ id, libelle, valeur = '', exemple = '', aide = '', saisie, lignes = 3, maxlength = 2000 } = {}) {
    return `<div class="champ"><label class="champ-libelle" for="${esc(id)}">${txt(libelle)}</label>`
      + `<textarea class="champ-input champ-texte" id="${esc(id)}" name="${esc(id)}" rows="${lignes}" maxlength="${maxlength}"`
      + (exemple ? ` placeholder="${esc(exemple)}"` : '') + (saisie ? ` data-saisie="${esc(saisie)}"` : '')
      + (aide ? ` aria-describedby="${esc(id)}-aide"` : '') + `>${esc(valeur)}</textarea>`
      + (aide ? `<p class="champ-aide" id="${esc(id)}-aide">${txt(aide)}</p>` : '') + '</div>';
  }
  function caseACocher({ id, libelle, coche = false, saisie } = {}) {
    return `<label class="case" for="${esc(id)}"><input type="checkbox" id="${esc(id)}" name="${esc(id)}"${coche ? ' checked' : ''}${saisie ? ` data-saisie="${esc(saisie)}"` : ''}>`
      + `<span class="case-boite" aria-hidden="true">${icone('coche', { taille: 16 })}</span><span class="case-texte">${txt(libelle)}</span></label>`;
  }
  // Interrupteur : vraie case à cocher avec role="switch" ; verrouille = allumé et non modifiable.
  function interrupteur({ id, libelle, coche = false, saisie, verrouille = false, aide = '' } = {}) {
    return `<div class="interrupteur-bloc"><label class="interrupteur" for="${esc(id)}"><span class="interrupteur-texte">${txt(libelle)}</span>`
      + `<input type="checkbox" role="switch" class="interrupteur-input" id="${esc(id)}" name="${esc(id)}"${coche || verrouille ? ' checked' : ''}`
      + `${verrouille ? ' disabled aria-disabled="true"' : ''}${saisie ? ` data-saisie="${esc(saisie)}"` : ''}${aide ? ` aria-describedby="${esc(id)}-aide"` : ''}>`
      + `<span class="interrupteur-piste" aria-hidden="true"></span></label>`
      + (aide ? `<p class="champ-aide" id="${esc(id)}-aide">${txt(aide)}</p>` : '') + '</div>';
  }
  // Pastilles de choix : options [{ valeur, libelle }] ; la sélection porte aria-pressed="true".
  // Le gestionnaire `action` reçoit el.dataset.valeur.
  function pastilles({ options = [], valeur = null, action, libelle = '', params, multiple = false } = {}) {
    const choisies = multiple ? (valeur || []) : [valeur];
    return `<div class="pastilles" role="group"${libelle ? ` aria-label="${esc(libelle)}"` : ''}>` + options.map(o =>
      `<button type="button" class="pastille" data-action="${esc(action)}" data-valeur="${esc(o.valeur)}"${donnees(params)} aria-pressed="${choisies.includes(o.valeur)}">${txt(o.libelle)}</button>`).join('') + '</div>';
  }
  // Infobulle (i) : un bouton qui déplie le texte en dessous.
  function infobulle(texte, { libelle = "Plus d'informations" } = {}) {
    const id = idUnique('ib');
    return `<span class="infobulle"><button type="button" class="infobulle-bouton" data-action="infobulle" aria-expanded="false" aria-controls="${id}" aria-label="${esc(libelle)}">${icone('info', { taille: 20 })}</button></span>`
      + `<span class="infobulle-texte" id="${id}" role="note" hidden>${txt(texte)}</span>`;
  }

  // Encart du seuil des impôts (décision P-8 n° 2) : calme, il ne bloque rien.
  // Montré au récapitulatif de la création et à l'acceptation, quand le cumul de l'année entre les
  // deux mêmes personnes dépasse 5 000 € en comptant ce prêt (calculs.cumulEntreProches).
  const TEXTE_CUMUL = "Au-delà de 5 000 € prêtés à la même personne dans l'année, le prêt se déclare aux impôts (formulaire 2062). C'est à vous deux de le faire, TilliT ne déclare rien.";
  function encartCumul() {
    return `<div class="bt-message bt-message--info"><p>${txt(T.insecables(TEXTE_CUMUL))}</p>`
      + bouton('Comment ça se passe', { action: 'aller', params: { route: 'guide-impots' }, variante: 'discret' }) + '</div>';
  }

  /* ---------- Succès, célébration ---------- */
  // Carte de succès : coche animée, titre, texte, un seul bouton (par défaut « Retour au prêt »).
  function carteSucces({ titre, texte = '', bouton: b = { libelle: 'Retour au prêt', action: 'retour' }, lien = null, contenu = '' } = {}) {
    return `<div class="succes"><div class="succes-coche anim-pop">${icone('coche', { taille: 34 })}</div>`
      + `<h2 class="succes-titre">${txt(titre)}</h2>` + (texte ? `<p class="succes-texte">${txt(texte)}</p>` : '') + contenu
      + bouton(b.libelle, { action: b.action, params: b.params })
      + (lien ? bouton(lien.libelle, { action: lien.action, params: lien.params, variante: 'discret', classe: 'btn--centre' }) : '') + '</div>';
  }
  // Célébration plein écran (paliers, fin) : mascotte « celebration », titre, texte, « Continuer ».
  function celebration({ titre, texte = '', bouton: libelleBouton = 'Continuer', action = 'fermer-feuille', params, pose = 'celebration', contenu = '' } = {}) {
    const hote = document.getElementById('feuilles');
    feuille.fermer(true);
    hote.hidden = false;
    hote.innerHTML = `<section class="celebration" role="dialog" aria-modal="true" aria-labelledby="celebration-titre">`
      + mascotte(pose, { taille: 'grande', anim: 'bob' })
      + `<h2 class="celebration-titre anim-pop" id="celebration-titre">${txt(titre)}</h2>`
      + (texte ? `<p class="celebration-texte">${txt(texte)}</p>` : '') + contenu
      + bouton(libelleBouton, { action, params, variante: 'blanc' }) + '</section>';
    etatFeuille.ouverte = true;
    etatFeuille.retourFocus = document.activeElement;
    const b = hote.querySelector('button'); if (b) b.focus();
  }

  /* ---------- Feuille du bas ---------- */
  const etatFeuille = { ouverte: false, retourFocus: null, surFermeture: null };
  const feuille = {
    // html : contenu (HTML) ; titre : texte (échappé). Fermée par la croix, le fond, Échap ou feuille.fermer().
    ouvrir(html, { titre = '', surFermeture = null, sansFermer = false } = {}) {
      const hote = document.getElementById('feuilles');
      if (!etatFeuille.ouverte) etatFeuille.retourFocus = document.activeElement;
      etatFeuille.ouverte = true;
      etatFeuille.surFermeture = surFermeture;
      const idTitre = idUnique('feuille-titre');
      hote.hidden = false;
      hote.innerHTML = `<div class="feuille-fond"${sansFermer ? '' : ' data-action="fermer-feuille"'}></div>`
        + `<section class="feuille" role="dialog" aria-modal="true"${titre ? ` aria-labelledby="${idTitre}"` : ' aria-label="Fenêtre"'}>`
        + `<div class="feuille-poignee" aria-hidden="true"></div>`
        + `<div class="feuille-haut">${titre ? `<h2 class="feuille-titre" id="${idTitre}">${txt(titre)}</h2>` : '<span></span>'}`
        + (sansFermer ? '' : boutonIcone('croix', 'Fermer', { action: 'fermer-feuille' })) + `</div>`
        + `<div class="feuille-corps" id="feuille-corps">${html}</div></section>`;
      const cible = hote.querySelector('.feuille-corps button, .feuille-corps input, .feuille-corps textarea, .feuille-corps [tabindex]') || hote.querySelector('.feuille button');
      if (cible) cible.focus({ preventScroll: true });
    },
    // Remplace le contenu (par exemple par une carte de succès) sans refermer.
    maj(html) { const c = document.getElementById('feuille-corps'); if (c) c.innerHTML = html; },
    fermer(sansFocus = false) {
      const hote = document.getElementById('feuilles');
      if (!hote || !etatFeuille.ouverte) return;
      hote.innerHTML = ''; hote.hidden = true;
      etatFeuille.ouverte = false;
      const f = etatFeuille.surFermeture; etatFeuille.surFermeture = null;
      if (!sansFocus && etatFeuille.retourFocus && document.contains(etatFeuille.retourFocus)) etatFeuille.retourFocus.focus({ preventScroll: true });
      if (f) try { f(); } catch (err) { console.error(err); }
    },
    ouverte: () => etatFeuille.ouverte
  };

  /* ---------- Bannière de notification simulée (spec 02) ---------- */
  // Une à la fois, 5 s à l'écran, 1,5 s d'écart ; fermeture par la croix ou un glissé vers le haut ;
  // toucher ouvre l'écran lié (ou appelle auToucher).
  const fileBannieres = [];
  let banniereActive = null, minuteurBanniere = null;
  function banniere(notification, auToucher) {
    fileBannieres.push({ n: notification, auToucher });
    if (!banniereActive) montrerSuivante();
  }
  function montrerSuivante() {
    const hote = document.getElementById('bannieres');
    const suivante = fileBannieres.shift();
    if (!suivante || !hote) { banniereActive = null; return; }
    banniereActive = suivante;
    hote.innerHTML = `<div class="banniere" role="status">`
      + `<button type="button" class="banniere-corps" data-banniere="ouvrir"><img class="banniere-icone" src="assets/brand/icone-tillit-180.png" alt="" width="36" height="36">`
      + `<span class="banniere-texte"><span class="banniere-app">TilliT · à l'instant</span><span>${esc(suivante.n.texte)}</span></span></button>`
      + `<button type="button" class="icone-bouton banniere-fermer" data-banniere="fermer" aria-label="Fermer la notification">${icone('croix', { taille: 20 })}</button></div>`;
    const el = hote.firstElementChild;
    let y0 = null;
    el.addEventListener('pointerdown', e => { y0 = e.clientY; });
    el.addEventListener('pointerup', e => { if (y0 != null && e.clientY - y0 < -30) fermerBanniere(); y0 = null; });
    clearTimeout(minuteurBanniere);
    minuteurBanniere = setTimeout(fermerBanniere, 5000);
  }
  function fermerBanniere() {
    clearTimeout(minuteurBanniere);
    const hote = document.getElementById('bannieres');
    if (hote) hote.innerHTML = '';
    banniereActive = null;
    if (fileBannieres.length) minuteurBanniere = setTimeout(montrerSuivante, 1500);
  }
  function viderBannieres() { fileBannieres.length = 0; fermerBanniere(); }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-banniere]');
    if (!b || !banniereActive) return;
    const { n, auToucher } = banniereActive;
    fermerBanniere();
    if (b.dataset.banniere !== 'ouvrir') return;
    if (auToucher) { auToucher(n); return; }
    if (n.lien) {
      if (!n.lue && window.modele.lire().notifications.some(x => x.id === n.id)) window.marquerLue(n.id);
      // Déjà sur l'écran visé (par exemple fin-pret ouvert tout seul) : on n'empile pas un second passage.
      const c = window.routeur.courant();
      if (c.route === n.lien.route && (c.params.pretId || null) === (n.lien.pretId || null)) return;
      window.routeur.aller(n.lien.route, n.lien.pretId ? { pretId: n.lien.pretId } : {});
    }
  });

  /* ---------- Mise à jour partielle ---------- */
  // Remplace le contenu d'une zone, sauf s'il n'a pas changé (un remplacement inutile peut avaler un clic en cours).
  const derniersHtml = new WeakMap();
  function majZone(id, html) {
    const el = document.getElementById(id);
    if (!el || derniersHtml.get(el) === html) return;
    derniersHtml.set(el, html);
    el.innerHTML = html;
  }

  /* ==========================================================================
     Bloc des termes (spec 00 §7, 03, 04, 08) : montant, « Par mois » et
     « Durée » liés, première date, Zen et payeur, messages de bornes.
     ui.blocTermes({
       id: 'bt',                       identifiant unique dans l'écran
       termes,                         { montant, mode, mensualite, duree, premiereDate, formule, payeurZenId, ... }
       role: 'preteur'|'emprunteur',   rôle du testeur (textes et plafond)
       autreId, pretId,                l'autre proche ; le prêt examiné (exclu du plafond)
       avecMontant: true,              false pour un nouveau calendrier
       apresMontant: '',               HTML sûr placé juste sous le montant et ses pastilles
       avecFormule: false,             true : interrupteurs « Ajouter TilliT Zen » et « C'est moi qui paie Zen »
       surLeReste: false,              true : calcule sur le reste du prêt (nouveau calendrier, spec 08)
       surChangement(termes, verdict)  appelé à chaque changement ; verdict.valide dit si « Continuer » est actif
     })
     Le bloc se met à jour lui-même pendant la saisie, sans re-rendre l'écran.
     ui.verdictTermes(config) rend le même verdict, pour l'état initial du bouton.
     ========================================================================== */
  const blocs = {};
  const ICI = () => window.modele.aujourdhui();
  function verdictTermes(cfg) {
    const t = cfg.t || cfg.termes;
    if (cfg.surLeReste) {
      const r = C.calendrierDuReste(window.modele.pret(cfg.pretId), t, ICI());
      return Object.assign({}, r, { montant: r.reste, zenImpose: false });
    }
    const v = C.verifierTermes(t, cfg.role ? { etat: window.modele.lire(), personneId: 'moi', role: cfg.role, pretId: cfg.pretId, aujourdhui: ICI() } : null);
    return Object.assign(v, { montant: t.montant });
  }
  const MESSAGES = {
    // P-9 n° 9 : plus de bouton « Mettre X » sur les bornes, la valeur revient d'elle-même (corrigerBornes).
    montant_min: () => ({ texte: `Un prêt TilliT commence à ${T.euros(10000)}.` }),
    montant_max: () => ({ texte: `Un prêt TilliT va jusqu'à ${T.euros(500000)}.` }),
    mensualite_min: () => ({ texte: `Une échéance fait au moins ${T.euros(1000)}.` }),
    duree_max: () => ({ texte: 'Un prêt TilliT dure 60 mois au plus.' }),
    plafond_depasse: (e, role) => ({
      texte: role === 'preteur'
        ? `Avec ce prêt, tu dépasserais ${T.euros(500000)} prêtés cette année. Tu peux encore prêter ${T.euros(e.reste)} jusqu'au 31 décembre.`
        : `Avec ce prêt, tu dépasserais ${T.euros(500000)} empruntés cette année. Tu peux encore demander ${T.euros(e.reste)} jusqu'au 31 décembre.`,
      correction: `Mettre ${T.euros(Math.floor(e.reste / 100) * 100)}`, plafond: true }),
    plafond_atteint: (e, role) => ({
      texte: role === 'preteur'
        ? `Tu as atteint ${T.euros(500000)} prêtés cette année. Tu pourras prêter à nouveau à partir du 1er janvier.`
        : `Tu as atteint ${T.euros(500000)} empruntés cette année. Tu pourras emprunter à nouveau à partir du 1er janvier.`, plafond: true })
  };
  const INFO_1500 = `Au-delà de ${T.euros(150000)}, un prêt se prouve par un écrit (article 1359 du Code civil). Avec Zen, vous signez tous les deux une reconnaissance de dette.`;
  const ZEN_1500 = `Au-delà de ${T.euros(150000)}, ton prêt se fait avec TilliT Zen.`;
  const INFO_PLAFOND = `Sur TilliT, chaque personne peut prêter jusqu'à ${T.euros(500000)} et emprunter jusqu'à ${T.euros(500000)} par année civile, tous proches confondus.`;

  function htmlResultat(cfg, v) {
    const t = cfg.t;
    if (!t.premiereDate || !(v.n > 0 && v.mensualite > 0) || v.erreurs.some(e => e.code === 'mensualite_min' || e.code === 'duree_max' || e.code === 'duree_min')) return '';
    const dates = C.datesEcheances(t.premiereDate, v.n);
    if (v.n === 1) return `<p class="bt-resultat-ligne">Remboursé en une fois, le ${esc(T.date(dates[0]))}.</p>`;
    const differe = v.derniere !== v.mensualite;
    return `<p class="bt-resultat-ligne"><strong>${esc(T.euros(v.mensualite))} par mois, soit ${v.n} mois</strong>${differe ? `. Dernière échéance\u00a0: ${esc(T.euros(v.derniere))}.` : ''}</p>`
      + `<p class="bt-echeancier">${differe ? `${v.n - 1} × ${esc(T.euros(v.mensualite))} puis ${esc(T.euros(v.derniere))}, du` : `${v.n} × ${esc(T.euros(v.mensualite))} du`} ${esc(T.date(dates[0]))} au ${esc(T.date(dates[dates.length - 1]))}</p>`;
  }
  function htmlMessages(cfg, v) {
    // P-9 n° 9 : la phrase qui dit qu'une valeur est revenue dans les bornes, avant les autres messages.
    let h = cfg.retour ? `<div class="bt-message bt-message--info bt-retour"><p>${esc(T.insecables(cfg.retour))}</p></div>` : '';
    // Au-delà de 5 000 €, un seul message : la borne si le plafond annuel est entier, sinon le plafond (il dit ce qui reste).
    const plafond = v.erreurs.find(e => e.code === 'plafond_depasse' || e.code === 'plafond_atteint');
    const plafondEntier = plafond && plafond.code === 'plafond_depasse' && plafond.reste >= C.BORNES.montantMax;
    const erreurs = v.erreurs.filter(e => (plafondEntier ? e !== plafond : !(plafond && e.code === 'montant_max')));
    for (const e of erreurs) {
      const m = MESSAGES[e.code] && MESSAGES[e.code](e, cfg.role);
      if (!m) continue;
      h += `<div class="bt-message"><p>${esc(T.insecables(m.texte))}${m.plafond ? infobulle(INFO_PLAFOND, { libelle: 'À propos du plafond annuel' }) : ''}</p>`
        + (m.correction ? bouton(m.correction, { action: 'termes-corriger', variante: 'secondaire', pleine: false, params: { bloc: cfg.id, code: e.code, reste: e.reste } }) : '') + '</div>';
    }
    // Avec les interrupteurs Zen, la ligne « Au-delà de 1 500 € » est déjà dans la zone de la formule.
    if (cfg.avecMontant !== false && !cfg.avecFormule && v.zenImpose && !(v.montant > C.BORNES.montantMax))
      h += `<div class="bt-message bt-message--info"><p>${esc(ZEN_1500)}${infobulle(INFO_1500, { libelle: `Pourquoi Zen au-delà de ${T.euros(150000)}` })}</p></div>`;
    return h;
  }
  // P-9 n° 7 et n° 8 : le choix de la formule vit sur l'écran du montant. Sous 1 500 €, Note reste
  // sans frais et Zen est une option ; au-dessus, Zen est nécessaire, avec son prix et qui le paie.
  // cfg.zenTexte : deux lignes au plus sur ce qu'apporte Zen (HTML sûr fourni par l'écran).
  function htmlFormule(cfg, v) {
    const t = cfg.t, id = cfg.id;
    const impose = t.montant > C.BORNES.noteMax;
    const zen = impose || t.formule === 'zen';
    const prix = C.prixZen(t.montant);
    const autre = esc(window.modele.prenom(cfg.autreId));
    let h = `<p class="bt-seuil">${impose ? esc(T.insecables(ZEN_1500))
      : esc(T.insecables(`Jusqu'à ${T.euros(C.BORNES.noteMax)}, ton prêt est sans frais avec TilliT Note.`))}`
      + `${infobulle(INFO_1500, { libelle: `Pourquoi Zen au-delà de ${T.euros(150000)}` })}</p>`
      + interrupteur({ id: `${id}-zen`, libelle: 'Ajouter TilliT Zen', coche: zen, verrouille: impose, saisie: 'termes-zen' });
    if (zen) {
      const moi = t.payeurZenId === 'moi';
      h += `<div class="bt-zen">`
        + (prix ? `<p class="bt-zen-prix">${esc(`TilliT Zen · ${T.euros(prix)}`)}</p>` : '')
        + (cfg.zenTexte || '')
        + interrupteur({ id: `${id}-payeur`, libelle: "C'est moi qui paie Zen", coche: moi, saisie: 'termes-payeur' })
        + `<p class="bt-note">${prix ? (moi ? `Tu paies ${esc(T.euros(prix))}, une seule fois.` : `${autre} paie ${esc(T.euros(prix))}, une seule fois.`) : ''}</p>`
        + '</div>';
    }
    return h;
  }
  // P-9 n° 9 : une valeur hors bornes revient d'elle-même, et l'écran le dit en une phrase courte.
  // Déclenché à la sortie du champ et après une pause de frappe (une correction pendant la frappe
  // empêcherait de taper « 100 », dont le premier chiffre vaut 1 €).
  const PAUSE_FRAPPE = 900;
  function corrigerBornes(cfg) {
    if (!cfg || !document.getElementById(cfg.id)) return false;
    const t = cfg.t, v = verdictTermes(cfg), code = c => v.erreurs.some(e => e.code === c);
    let phrase = '';
    if (code('montant_max')) { t.montant = C.BORNES.montantMax; phrase = `Le montant est revenu à ${T.euros(C.BORNES.montantMax)}, le maximum sur TilliT.`; }
    else if (code('montant_min')) { t.montant = C.BORNES.montantMin; phrase = `Le montant est revenu à ${T.euros(C.BORNES.montantMin)}, le minimum sur TilliT.`; }
    if (code('duree_max')) {
      const e = v.erreurs.find(x => x.code === 'duree_max'), n = (e && e.dureeMax) || C.BORNES.dureeMax;
      t.mode = 'duree'; t.duree = n; phrase = `La durée est revenue à ${n} mois, le maximum.`;
    } else if (code('duree_min')) { t.mode = 'duree'; t.duree = C.BORNES.dureeMin; phrase = `La durée est revenue à ${C.BORNES.dureeMin} mois, le minimum.`; }
    else if (code('mensualite_min')) { t.mode = 'mensualite'; t.mensualite = C.BORNES.mensualiteMin; phrase = `L'échéance est revenue à ${T.euros(C.BORNES.mensualiteMin)}, le minimum.`; }
    if (!phrase) return false;
    cfg.retour = phrase;
    majBloc(cfg);
    return true;
  }
  const plusTardBornes = cfg => { clearTimeout(cfg.minuteurBornes); cfg.minuteurBornes = setTimeout(() => corrigerBornes(cfg), PAUSE_FRAPPE); };
  function blocTermes(config) {
    const cfg = Object.assign({ avecMontant: true, avecFormule: false, surLeReste: false }, config);
    cfg.t = Object.assign({}, config.termes);
    if (!cfg.t.mode) cfg.t.mode = 'duree';
    // La phrase de retour dans les bornes (P-9 n° 9) et la formule choisie sous 1 500 € (P-9 n° 7) survivent
    // au re-rendu que provoque surChangement, mais pas à un vrai changement d'écran (le bloc a disparu du document).
    const avant = document.getElementById(cfg.id) ? blocs[cfg.id] : null;
    cfg.retour = (avant && avant.retour) || '';
    cfg.formuleVoulue = avant ? avant.formuleVoulue : null;
    blocs[cfg.id] = cfg;
    const id = cfg.id, t = cfg.t, v = verdictTermes(cfg);
    const demain = C.ajouterJours(ICI(), 1);
    const valeurs = [100, 500, 1500, 3000, 5000];   // P-9 n° 7 : jusqu'au plafond de 5 000 €
    let h = `<div class="bloc-termes" id="${esc(id)}">`;
    if (cfg.avecMontant) {
      h += `<div class="bt-montant"><label class="visuellement-cache" for="${id}-montant">Montant en euros</label>`
        + `<input class="bt-montant-input" id="${id}-montant" type="text" inputmode="numeric" autocomplete="off" maxlength="5" value="${esc(Math.round((t.montant || 0) / 100))}" data-saisie="termes-montant" data-bloc="${esc(id)}">`
        + `<span class="bt-montant-euro" aria-hidden="true">€</span></div>`
        + `<div class="pastilles bt-pastilles" role="group" aria-label="Montants rapides">` + valeurs.map(e =>
          `<button type="button" class="pastille" data-action="termes-pastille" data-bloc="${esc(id)}" data-valeur="${e * 100}" aria-pressed="${t.montant === e * 100}">${esc(T.euros(e * 100))}</button>`).join('') + '</div>'
        + (cfg.apresMontant || '');   // HTML sûr fourni par l'écran, sous le montant (lot C)
    }
    h += `<fieldset class="bt-mensuel"><legend class="champ-libelle">Remboursement mensuel</legend><div class="bt-deux">`
      + `<div class="champ"><label class="champ-libelle champ-libelle--petit" for="${id}-mensualite">Par mois</label><div class="champ-boite champ-boite--suffixe">`
      + `<input class="champ-input" id="${id}-mensualite" type="text" inputmode="decimal" autocomplete="off" value="${esc(T.pourChamp(v.mensualite || t.mensualite))}" data-saisie="termes-mensualite" data-bloc="${esc(id)}"><span class="champ-suffixe" aria-hidden="true">€</span></div></div>`
      + `<div class="champ"><label class="champ-libelle champ-libelle--petit" for="${id}-duree">Durée</label><div class="bt-duree">`
      + `<button type="button" class="icone-bouton bt-pas" id="${id}-moins" data-action="termes-moins" data-bloc="${esc(id)}" aria-label="Un mois de moins"><span aria-hidden="true">−</span></button>`
      + `<div class="champ-boite champ-boite--suffixe"><input class="champ-input bt-duree-input" id="${id}-duree" type="text" inputmode="numeric" autocomplete="off" maxlength="3" value="${esc(v.n || t.duree)}" data-saisie="termes-duree" data-bloc="${esc(id)}"><span class="champ-suffixe" aria-hidden="true">mois</span></div>`
      + `<button type="button" class="icone-bouton bt-pas" id="${id}-plus" data-action="termes-plus" data-bloc="${esc(id)}" aria-label="Un mois de plus"><span aria-hidden="true">+</span></button>`
      + `</div></div></div></fieldset>`
      + `<div class="bt-resultat" id="${id}-resultat" aria-live="polite">${htmlResultat(cfg, v)}</div>`
      + champ({ id: `${id}-date`, libelle: 'À partir du', type: 'date', valeur: t.premiereDate, min: demain, saisie: 'termes-date' })
      + `<div class="bt-messages" id="${id}-messages" aria-live="polite">${htmlMessages(cfg, v)}</div>`;
    if (cfg.avecFormule) h += `<div class="bt-formule" id="${id}-formule">${htmlFormule(cfg, v)}</div>`;
    return h + '</div>';
  }
  // Recalcule, met à jour les zones du bloc (jamais le champ en cours de saisie), prévient l'écran.
  function majBloc(cfg, source) {
    const t = cfg.t;
    // Au-delà de 1 500 €, Zen s'impose ; sous le seuil, on retrouve la formule choisie (P-9 n° 7).
    if (t.montant > C.BORNES.noteMax) { if (cfg.formuleVoulue == null) cfg.formuleVoulue = t.formule || 'note'; t.formule = 'zen'; }
    else if (cfg.formuleVoulue != null) { t.formule = cfg.formuleVoulue; cfg.formuleVoulue = null; }
    const v = verdictTermes(cfg);
    const $ = s => document.getElementById(`${cfg.id}-${s}`);
    if (source !== 'montant' && $('montant')) $('montant').value = Math.round(t.montant / 100);
    if (source !== 'mensualite' && $('mensualite') && v.mensualite > 0) $('mensualite').value = T.pourChamp(v.mensualite);
    if (source !== 'duree' && $('duree') && v.n > 0) $('duree').value = v.n;
    if (source !== 'date' && $('date')) $('date').value = t.premiereDate;
    document.querySelectorAll(`[data-action="termes-pastille"][data-bloc="${cfg.id}"]`).forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.valeur) === t.montant)));
    majZone(`${cfg.id}-resultat`, htmlResultat(cfg, v));
    majZone(`${cfg.id}-messages`, htmlMessages(cfg, v));
    if (cfg.avecFormule && source !== 'zen-interne') majZone(`${cfg.id}-formule`, htmlFormule(cfg, v));
    if (cfg.surChangement) {
      const sortie = Object.assign({}, t);
      if (v.n > 0 && v.mensualite > 0) Object.assign(sortie, { mensualite: v.mensualite, duree: v.n, derniere: v.derniere });
      try { cfg.surChangement(sortie, v); } catch (err) { console.error('[TilliT] surChangement en erreur', err); }
    }
  }
  const cfgDe = el => blocs[el.dataset.bloc || (el.closest('.bloc-termes') || {}).id];

  /* ---------- Gestionnaires intégrés (routeur : actions[], saisies[]) ---------- */
  function enregistrerIntegres() {
    const A = window.actions, S = window.saisies;
    A['fermer-feuille'] = () => feuille.fermer();
    A.infobulle = el => {
      const cible = document.getElementById(el.getAttribute('aria-controls'));
      const ouvert = el.getAttribute('aria-expanded') === 'true';
      el.setAttribute('aria-expanded', String(!ouvert));
      if (cible) cible.hidden = ouvert;
    };
    A.copier = el => {
      const texte = el.dataset.texte || '';
      const fini = () => {
        const s = el.querySelector('span');
        if (!s || el.dataset.copie) return;
        el.dataset.copie = s.textContent;
        s.textContent = 'Référence copiée';
        setTimeout(() => { if (document.contains(el)) { s.textContent = el.dataset.copie; delete el.dataset.copie; } }, 2000);
      };
      const secours = () => {
        const z = document.createElement('textarea');
        z.value = texte; z.setAttribute('readonly', ''); z.style.position = 'fixed'; z.style.opacity = '0';
        document.body.appendChild(z); z.select();
        try { document.execCommand('copy'); } catch (err) { /* rien de plus à faire */ }
        z.remove(); fini();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texte).then(fini, secours); else secours();
    };
    A['termes-pastille'] = el => { const c = cfgDe(el); if (!c) return; c.t.montant = Number(el.dataset.valeur); c.retour = ''; majBloc(c); };
    A['termes-moins'] = el => { const c = cfgDe(el); if (!c) return; const v = verdictTermes(c); c.t.mode = 'duree'; c.t.duree = Math.max(1, (v.n || c.t.duree || 1) - 1); majBloc(c); };
    A['termes-plus'] = el => { const c = cfgDe(el); if (!c) return; const v = verdictTermes(c); c.t.mode = 'duree'; c.t.duree = Math.min(C.BORNES.dureeMax, (v.n || c.t.duree || 0) + 1); majBloc(c); };
    // P-9 n° 9 : les bornes se corrigent toutes seules ; seul le plafond annuel garde son bouton.
    A['termes-corriger'] = el => {
      const c = cfgDe(el); if (!c) return;
      if (el.dataset.code === 'plafond_depasse') c.t.montant = Math.floor(Number(el.dataset.reste) / 100) * 100;
      c.retour = '';
      majBloc(c);
    };
    S['termes-montant'] = (el, etat, params, type) => {
      const c = cfgDe(el); if (!c) return;
      const chiffres = el.value.replace(/\D/g, '');
      if (chiffres !== el.value) el.value = chiffres;
      if (type === 'change') { if (!chiffres) el.value = '500'; clearTimeout(c.minuteurBornes); corrigerBornes(c); return; }
      c.t.montant = chiffres ? Number(chiffres) * 100 : 50000;   // champ vidé : 500 € (spec 03)
      c.retour = '';
      majBloc(c, 'montant');
      plusTardBornes(c);
    };
    S['termes-mensualite'] = (el, etat, params, type) => {
      const c = cfgDe(el); if (!c) return;
      if (type === 'change') { clearTimeout(c.minuteurBornes); if (!corrigerBornes(c)) { const v = verdictTermes(c); if (v.mensualite > 0) el.value = T.pourChamp(v.mensualite); } return; }
      const m = T.versCentimes(el.value);
      if (m == null || m <= 0) return;
      c.t.mode = 'mensualite'; c.t.mensualite = m;
      c.retour = '';
      majBloc(c, 'mensualite');
      plusTardBornes(c);
    };
    S['termes-duree'] = (el, etat, params, type) => {
      const c = cfgDe(el); if (!c) return;
      if (type === 'change') { clearTimeout(c.minuteurBornes); if (!corrigerBornes(c)) el.value = verdictTermes(c).n || c.t.duree; return; }
      const n = parseInt(el.value.replace(/\D/g, ''), 10);
      if (!(n >= 1)) return;
      c.t.mode = 'duree'; c.t.duree = n;
      c.retour = '';
      majBloc(c, 'duree');
      plusTardBornes(c);
    };
    S['termes-date'] = (el, etat, params, type) => {
      const c = cfgDe(el); if (!c || type !== 'change' || !el.value) return;
      const demain = C.ajouterJours(ICI(), 1);
      c.t.premiereDate = el.value < demain ? demain : el.value;   // jamais avant demain (spec 03, A-09)
      majBloc(c);
    };
    S['termes-zen'] = el => { const c = cfgDe(el); if (!c) return; c.t.formule = el.checked ? 'zen' : 'note'; majBloc(c); };
    S['termes-payeur'] = el => { const c = cfgDe(el); if (!c) return; c.t.payeurZenId = el.checked ? 'moi' : c.autreId; majBloc(c); };
  }

  /* ---------- Chrome : en-tête et barre des écrans principaux (décision Q4) ---------- */
  function entetePrincipal() {
    const n = window.modele.nonLues();
    return `<button type="button" class="icone-bouton" data-action="aller" data-route="recompenses" aria-label="Récompenses">${icone('cadeau')}</button>`
      + `<div class="entete-droite"><button type="button" class="icone-bouton cloche" id="bouton-cloche" data-action="aller" data-route="notifications" aria-label="Notifications, ${n} non lue${n > 1 ? 's' : ''}">${icone('cloche')}`
      + (n ? `<span class="pastille-compte" aria-hidden="true">${n > 9 ? '9+' : n}</span>` : '') + `</button>`
      + `<button type="button" class="avatar-bouton" id="bouton-profil" data-action="onglet" data-route="profil" aria-label="Profil">${avatar('moi', { taille: 's' })}</button></div>`;
  }
  function barreNavigation(active) {
    const onglet = (route, libelle, ic, aria) => `<button type="button" class="onglet" data-action="onglet" data-route="${route}"`
      + (aria ? ` aria-label="${esc(aria)}"` : '') + (active === route ? ' aria-current="page"' : '') + `>${icone(ic)}<span>${esc(libelle)}</span></button>`;
    return onglet('accueil', 'Accueil', 'maison') + onglet('parcours', 'Parcours', 'chemin')
      + `<button type="button" class="onglet-plus" id="bouton-nouveau-pret" data-action="nouveau-pret" aria-label="Nouveau prêt" aria-haspopup="dialog">${icone('plus')}</button>`
      + onglet('carnet', 'Carnet', 'carnet', 'Carnet de prêt')
      + onglet('profil', 'Profil', 'profil');
  }

  window.ui = Object.freeze({
    brut, icone, bouton, boutonsReponse, boutonIcone, boutonCopier,
    carte, lignesRecap, puce, pucePret, avatar, mascotte, retardLong, certifie, bulle, progression, anneau,
    enteteRetour, enteteEtape, champ, zoneTexte, caseACocher, interrupteur, pastilles, infobulle, encartCumul,
    carteSucces, celebration, feuille, banniere, viderBannieres, majZone,
    blocTermes, verdictTermes, entetePrincipal, barreNavigation
  });
  enregistrerIntegres();   // routeur.js est chargé avant : les registres existent
})();
