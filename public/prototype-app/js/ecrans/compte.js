/* ==========================================================================
   TilliT prototype · lot A · Lancement, compte et connexion
   Spec : 01-compte.md. Contrat : LISEZMOI-lots.md.
   Ce fichier appartient au lot A. N'écris que dans ce fichier et dans la
   section « lot A » de css/ecrans.css.

   Routes : lancement, onboarding-1, onboarding-2, onboarding-3, compte-creer (remplace l'écran provisoire), simulation-france-identite, compte-email, compte-code, notifications-autoriser, connexion, invitation-message, page-en-preparation
   API utile : creerCompte, seConnecter, ouvrirInvitation, majReglages, notifier('code_connexion', { code, auToucher, cloche: false })
   Le routeur ouvre « lancement » s'il existe, sinon « compte-creer » ; « invitation-message » si l'adresse finit par #invitation.
   ========================================================================== */
(function () {
  'use strict';
  const { euros, echapper, emailSimule, insecables, NBSP } = textes;
  const E = ecrans, A = actions, S = saisies;

  const PROTOTYPE = 'Prototype de test. Aucune donnée réelle, aucun paiement réel. Ce que tu saisis reste sur ce téléphone.';
  const bandeauPrototype = () => `<p class="bandeau-prototype">${PROTOTYPE}</p>`;
  // Flèche de retour seulement s'il y a un écran d'où l'on vient (compte-creer peut être le premier écran).
  const retourSiPossible = () => (routeur.peutRevenir() ? ui.enteteRetour({}) : '');
  const valeurDe = (id, max = 60) => String((document.getElementById(id) || {}).value || '').trim().slice(0, max);

  // Prêt de l'invitation (#invitation), tant que l'entrée est une invitation.
  function pretInvitation(etat) {
    if (etat.session.entree !== 'invitation' || !etat.session.pretInvitationId) return null;
    return modele.pret(etat.session.pretInvitationId);
  }
  // Après la création du compte ou la connexion : droit à la proposition en attente si l'on vient d'une invitation [A-07].
  function apresCompte(suite) {
    const p = pretInvitation(modele.lire());
    if (p) routeur.aller('proposition-recue', { pretId: p.id }, { racine: true });
    else routeur.aller(suite, {}, { racine: true });
  }

  /* ---------- lancement [G-05, C-04] ---------- */
  E.lancement = {
    rendu: () => `<button type="button" class="compte-lancement" data-action="compte-lancement-suivant">
        <img class="compte-lancement-logo" src="assets/brand/tillit-logo-blanc.webp" alt="TilliT" width="440" height="156">
        ${ui.mascotte('salut', { taille: 'grande', anim: 'bob' })}
        <span class="compte-lancement-accroche">Prêter sereinement.</span>
      </button>`,
    arrivee: () => routeur.plusTard(() => routeur.aller('onboarding-1', {}, { remplacer: true }), 2000)
  };
  A['compte-lancement-suivant'] = () => routeur.aller('onboarding-1', {}, { remplacer: true });

  /* ---------- onboarding 1 à 3 [G-03, C-05, C-69, D-45, D-46] ---------- */
  const pagination = n => `<div class="compte-pagination" role="img" aria-label="Étape ${n} sur 3">`
    + [1, 2, 3].map(i => `<span class="compte-trait${i === n ? ' compte-trait--actif' : ''}"></span>`).join('') + '</div>';
  const onboarding = ({ n, illustration, titre, texte, bas }) => `<div class="compte-onb">
      <div class="compte-onb-illu${n === 2 ? ' compte-onb-illu--lavande' : ''}">${illustration}</div>
      ${pagination(n)}
      <h1 class="titre">${titre}</h1>
      <p class="compte-onb-texte">${texte}</p>
      <div class="compte-onb-bas">${bas}</div>
    </div>`;

  E['onboarding-1'] = () => onboarding({
    n: 1,
    illustration: ui.mascotte('heureuse', { taille: 'grande' }),
    titre: 'Un prêt entre proches, écrit noir sur blanc.',
    texte: "Le montant, les dates, le rythme. Vous vous mettez d'accord une fois, l'app s'occupe du reste.",
    bas: ui.bouton('Continuer', { action: 'aller', params: { route: 'onboarding-2' } })
  });

  E['onboarding-2'] = () => onboarding({
    n: 2,
    illustration: `<div class="compte-notif-exemple">
        <img class="compte-notif-exemple-icone" src="assets/brand/icone-tillit-180.png" alt="" width="36" height="36">
        <p class="compte-notif-exemple-texte"><span class="compte-notif-exemple-haut"><strong>Rappel envoyé</strong><span>à l'instant</span></span>
        <span>L'échéance de ${euros(10000)} arrive vendredi.</span></p>
      </div>${ui.mascotte('relance-douce', { taille: 'moyenne' })}`,
    titre: 'Les rappels partent tout seuls.',
    texte: "Un rappel automatique est plus simple à recevoir qu'un message gêné de quelqu'un que tu aimes.",
    bas: ui.bouton('Continuer', { action: 'aller', params: { route: 'onboarding-3' } })
  });

  E['onboarding-3'] = () => onboarding({
    n: 3,
    illustration: ui.mascotte('securite', { taille: 'grande' }),
    titre: "L'argent reste entre vous deux.",
    texte: 'TilliT ne détient jamais ton argent et ne prend aucun intérêt.',
    bas: ui.bouton('Créer mon compte', { action: 'aller', params: { route: 'compte-creer' } })
      + ui.bouton("J'ai déjà un compte", { action: 'aller', params: { route: 'connexion' }, variante: 'discret', classe: 'btn--centre' })
  });

  /* ---------- compte-creer [C-06, C-07, C-08, C-10, D-11, A-04, A-06, D-07] ---------- */
  E['compte-creer'] = etat => {
    const inv = pretInvitation(etat);
    const autre = inv ? echapper(modele.prenom(inv.preteurId)) : '';
    return retourSiPossible() + `<div class="compte-page">
        ${bandeauPrototype()}
        ${inv ? `<p class="compte-bandeau-invitation">${autre} t'a envoyé une proposition de prêt. Crée ton compte pour la voir et y répondre.</p>` : ''}
        <h1 class="titre">Créer mon compte</h1>
        <button type="button" class="btn btn--principal btn--pleine compte-fi" data-action="aller" data-route="simulation-france-identite" aria-describedby="compte-fi-note">
          <span class="compte-fi-logo"><img src="assets/brand/partners/france-identite.webp" alt="" width="240" height="240"></span>
          <span>Continuer avec France Identité</span>
        </button>
        <p class="compte-fi-note" id="compte-fi-note">Ton compte est certifié.</p>
        <p class="compte-ou"><span>ou</span></p>
        ${ui.bouton('Continuer avec mon adresse e-mail', { action: 'aller', params: { route: 'compte-email' }, variante: 'secondaire' })}
        ${ui.bouton("J'ai déjà un compte", { action: 'aller', params: { route: 'connexion' }, variante: 'discret', classe: 'btn--centre' })}
      </div>`;
  };

  /* ---------- simulation-france-identite [A-04, C-10] : neutre, aucun logo, aucune couleur de l'État ---------- */
  E['simulation-france-identite'] = () => ui.enteteRetour({}) + `<div class="compte-page">
      ${ui.mascotte('identite', { taille: 'moyenne' })}
      <h1 class="titre">Simulation</h1>
      <p class="compte-texte">Ici, tu serais redirigé vers France Identité pour créer ton compte TilliT avec ta carte d'identité au nouveau format. Dans ce prototype, rien n'est vérifié.</p>
      ${ui.champ({ id: 'compte-fi-prenom', libelle: 'Prénom', autocomplete: 'given-name', maxlength: 60 })}
      ${ui.champ({ id: 'compte-fi-nom', libelle: 'Nom', autocomplete: 'family-name', maxlength: 60, aide: 'Ils apparaîtront auprès de tes proches.' })}
      ${ui.bouton('Revenir sur TilliT', { action: 'compte-fi-valider' })}
    </div>`;
  // Champs vides : Alex, Moreau, e-mail simulé (creerCompte) [D-08].
  A['compte-fi-valider'] = () => {
    const r = creerCompte({ moyenCompte: 'france_identite', certifie: true, prenom: valeurDe('compte-fi-prenom'), nom: valeurDe('compte-fi-nom') });
    if (r.ok) apresCompte('compte-avatar');
  };

  /* ---------- compte-email [C-07, C-09, C-68, D-08] ---------- */
  E['compte-email'] = () => ui.enteteRetour({}) + `<div class="compte-page">
      <h1 class="titre">On fait connaissance${NBSP}?</h1>
      <p class="sous-titre">Ton prénom et ton nom apparaîtront auprès de tes proches.</p>
      ${ui.champ({ id: 'compte-email-prenom', libelle: 'Prénom', autocomplete: 'given-name', maxlength: 60 })}
      ${ui.champ({ id: 'compte-email-nom', libelle: 'Nom', autocomplete: 'family-name', maxlength: 60 })}
      ${ui.champ({ id: 'compte-email-adresse', libelle: 'E-mail', type: 'email', inputmode: 'email', autocomplete: 'email', maxlength: 120 })}
      <div class="compte-cgu">
        <label class="case compte-cgu-case" for="compte-cgu">
          <input type="checkbox" id="compte-cgu" name="compte-cgu" aria-labelledby="compte-cgu-texte">
          <span class="case-boite" aria-hidden="true">${ui.icone('coche', { taille: 16 })}</span>
        </label>
        <p class="case-texte compte-cgu-texte" id="compte-cgu-texte">J'accepte les
          <button type="button" class="compte-lien" data-action="aller" data-route="page-en-preparation">conditions d'utilisation</button>
          et la <button type="button" class="compte-lien" data-action="aller" data-route="page-en-preparation">politique de confidentialité</button>.</p>
      </div>
      ${ui.bouton('Recevoir mon code', { action: 'compte-email-code' })}
    </div>`;
  // Toujours actif : rien ne bloque, la case ne conditionne rien [D-08].
  A['compte-email-code'] = () => routeur.aller('compte-code', {
    mode: 'email', prenom: valeurDe('compte-email-prenom'), nom: valeurDe('compte-email-nom'), email: valeurDe('compte-email-adresse', 120)
  });

  /* ---------- compte-code [D-11, S-03] ---------- */
  function envoyerCode() {
    const code = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    notifier('code_connexion', { code, cloche: false, auToucher: () => remplirCode(code) });
  }
  // Toucher la bannière remplit les cases (si l'on est encore sur l'écran du code).
  function remplirCode(code) {
    [...code].forEach((chiffre, i) => { const el = document.getElementById(`compte-code-${i + 1}`); if (el) el.value = chiffre; });
    const valider = document.getElementById('compte-code-valider');
    if (valider) valider.focus();
  }
  E['compte-code'] = {
    rendu: (etat, params) => {
      const email = params.email || (params.mode === 'connexion' ? 'alex@exemple.fr' : emailSimule(params.prenom || 'Alex'));
      const cases = [1, 2, 3, 4].map(i => `<label class="visuellement-cache" for="compte-code-${i}">Chiffre ${i} sur 4</label>`
        + `<input class="compte-code-case" id="compte-code-${i}" name="compte-code-${i}" type="text" inputmode="numeric" pattern="[0-9]*"`
        + ` autocomplete="${i === 1 ? 'one-time-code' : 'off'}" data-saisie="compte-code" data-rang="${i}">`).join('');
      return ui.enteteRetour({}) + `<div class="compte-page">
          <h1 class="titre">Ton code à 4 chiffres</h1>
          <p class="sous-titre">Envoyé à ${echapper(email)}.</p>
          <fieldset class="compte-code"><legend class="visuellement-cache">Ton code à 4 chiffres</legend>${cases}</fieldset>
          ${ui.bouton('Renvoyer le code', { action: 'compte-renvoyer', variante: 'discret', classe: 'btn--centre' })}
          ${ui.bouton('Valider', { action: 'compte-valider-code', id: 'compte-code-valider' })}
        </div>`;
    },
    arrivee: () => routeur.plusTard(envoyerCode, 1000)
  };
  // Un chiffre par case ; on passe tout seul à la case suivante.
  S['compte-code'] = (el, etat, params, type) => {
    if (type !== 'input') return;
    const chiffre = el.value.replace(/\D/g, '').slice(-1);
    if (el.value !== chiffre) el.value = chiffre;
    const suivante = chiffre && document.getElementById(`compte-code-${Number(el.dataset.rang) + 1}`);
    if (suivante) suivante.focus();
  };
  A['compte-renvoyer'] = () => envoyerCode();
  // « Valider » accepte tout, même des cases vides.
  A['compte-valider-code'] = (el, etat, params) => {
    if (params.mode === 'connexion') {
      const r = seConnecter(params.email || '');
      if (r.ok) apresCompte('accueil');
      return;
    }
    const r = creerCompte({ moyenCompte: 'email', certifie: false, prenom: params.prenom || '', nom: params.nom || '', email: params.email || '' });
    if (r.ok) apresCompte('compte-avatar');
  };

  /* ---------- compte-avatar (P-9 n° 10) : galerie d'images de profil, aucun téléversement ---------- */
  // Teintes déjà posées par ui.avatar, illustrations déjà présentes dans assets/mascotte.
  const TEINTES_PHOTO = [['moi', 'violet'], ['lavande', 'lavande'], ['peche', 'pêche'], ['menthe', 'menthe'], ['bleu', 'bleu']];
  const POSES_PHOTO = [['salut', 'qui salue'], ['heureuse', 'heureuse'], ['confiante', 'confiante'],
    ['coup-de-coeur', 'avec un cœur'], ['anticipe', "qui prend de l'avance"], ['merci', 'qui remercie']];
  function choixAvatar(moi, teinte, pose, libelle) {
    const a = moi.avatar || {};
    const pris = (a.teinte || (moi.avatar ? '' : 'moi')) === teinte && (a.pose || null) === (pose || null);
    return `<button type="button" class="compte-avatar-choix" data-action="compte-avatar-choisir" data-teinte="${teinte}" data-pose="${pose || ''}"`
      + ` aria-pressed="${pris}" aria-label="${echapper(libelle)}">`
      + ui.avatar(Object.assign({}, moi, { avatar: { teinte, pose: pose || null } }), { taille: 'l' }) + '</button>';
  }
  E['compte-avatar'] = (etat, params) => {
    const depuis = params.depuis === 'profil';
    const moi = etat.moi;
    return (depuis ? ui.enteteRetour({}) : '') + `<div class="compte-page compte-avatar">
        <h1 class="titre">Choisis ton image.</h1>
        <p class="compte-texte">Tes proches la verront à côté de ton prénom.</p>
        <div class="compte-avatar-apercu">${ui.avatar(moi, { taille: 'xl' })}</div>
        <h2 class="compte-h2">Couleur et initiales</h2>
        <div class="compte-avatar-grille" role="group" aria-label="Couleur et initiales">`
      + TEINTES_PHOTO.map(([t, nom]) => choixAvatar(moi, t, null, `Initiales sur fond ${nom}`)).join('')
      + `</div><h2 class="compte-h2">Illustrations</h2>
        <div class="compte-avatar-grille" role="group" aria-label="Illustrations">`
      + POSES_PHOTO.map(([p, nom]) => choixAvatar(moi, (moi.avatar && moi.avatar.teinte) || 'lavande', p, `TilliT, la mascotte, ${nom}`)).join('')
      + `</div>
        <p class="compte-avatar-note">Envoyer une vraie photo viendra dans l'application. Ici, tu choisis dans cette galerie.</p>`
      + (depuis ? ui.bouton('Terminé', { action: 'retour' })
        : ui.bouton('Continuer', { action: 'compte-avatar-suite' })) + '</div>';
  };
  A['compte-avatar-choisir'] = el => choisirAvatar({ teinte: el.dataset.teinte, pose: el.dataset.pose || null });
  A['compte-avatar-suite'] = () => routeur.aller('notifications-autoriser', {}, { racine: true });

  /* ---------- tutoriel (P-9 n° 11) : les trois gestes, une seule fois, revu depuis le profil ---------- */
  const GESTES = [
    ['plus', 'Proposer un prêt', 'Le bouton (+) ouvre la création : montant, échéances, première date.'],
    ['chemin', 'Suivre les remboursements', "L'onglet Parcours montre où en est chaque prêt, échéance par échéance."],
    ['carnet', 'Retrouver tes prêts passés', 'Le Carnet de prêt garde ton historique et ta série de remboursements.']
  ];
  E.tutoriel = (etat, params) => `<div class="compte-page compte-tuto">
      ${ui.mascotte('guide', { taille: 'moyenne' })}
      <h1 class="titre">Trois gestes pour commencer.</h1>
      <ul class="compte-tuto-liste">`
    + GESTES.map(([ic, titre, texte]) => `<li class="compte-tuto-geste"><span class="compte-tuto-icone">${ui.icone(ic)}</span>`
      + `<span><span class="compte-tuto-titre">${echapper(titre)}</span><span class="compte-tuto-texte">${echapper(insecables(texte))}</span></span></li>`).join('')
    + `</ul>`
    + ui.bouton(params.revoir ? 'Terminé' : 'Commencer', { action: 'tutoriel-fini', params })
    + (params.revoir ? '' : ui.bouton('Passer', { action: 'tutoriel-fini', params, variante: 'discret', classe: 'btn--centre' }))
    + '</div>';
  A['tutoriel-fini'] = (el, etat, params) => {
    if (!etat.moi.tutorielVu) marquerTutorielVu();
    if (params.revoir) { routeur.retour(); return; }
    if (params.pretId) routeur.aller('parcours', { pretId: params.pretId }, { racine: true });
    else routeur.aller('accueil', {}, { racine: true });
  };

  /* ---------- notifications-autoriser [G-04, C-11, C-69] ---------- */
  E['notifications-autoriser'] = etat => {
    const n = etat.moi.reglages.notif;
    const inter = (cle, libelle) => ui.interrupteur({ id: `compte-notif-${cle}`, libelle, coche: n[cle], saisie: 'compte-notif' });
    return `<div class="compte-page compte-notifs">
        ${ui.mascotte('relance-douce', { taille: 'moyenne' })}
        <h1 class="titre">On te prévient au bon moment.</h1>
        <p class="compte-texte">Autorise les notifications pour recevoir les rappels de tes échéances.</p>
        ${ui.carte(inter('echeance', 'Échéance à venir') + inter('remboursement', 'Remboursement reçu') + inter('proposition', 'Nouvelle proposition'), { classe: 'compte-notifs-carte' })}
        ${ui.bouton('Activer les rappels', { action: 'compte-vers-accueil' })}
        ${ui.bouton('Plus tard', { action: 'compte-vers-accueil', variante: 'discret', classe: 'btn--centre' })}
      </div>`;
  };
  S['compte-notif'] = el => majReglages({ notif: { [el.id.replace('compte-notif-', '')]: el.checked } });
  // Aucune vraie demande de permission du navigateur. Après la première réponse à une invitation (lot D,
  // params { apres, pretId }), on reprend là où la personne allait : le Parcours du prêt ou l'accueil.
  A['compte-vers-accueil'] = (el, etat, params) => {
    const pretId = params.apres === 'parcours' && params.pretId ? params.pretId : null;
    // P-9 n° 11 : le tutoriel d'arrivée s'intercale au tout premier passage, puis plus jamais.
    if (!etat.moi.tutorielVu) routeur.aller('tutoriel', pretId ? { pretId } : {}, { racine: true });
    else if (pretId) routeur.aller('parcours', { pretId }, { racine: true });
    else routeur.aller('accueil', {}, { racine: true });
  };

  /* ---------- connexion [A-07, D-07] ---------- */
  E.connexion = () => retourSiPossible() + `<div class="compte-page">
      ${bandeauPrototype()}
      <h1 class="titre">Te revoilà.</h1>
      ${ui.champ({ id: 'compte-connexion-email', libelle: 'E-mail', type: 'email', inputmode: 'email', autocomplete: 'email', maxlength: 120 })}
      ${ui.bouton('Recevoir mon code', { action: 'compte-connexion-code' })}
    </div>`;
  A['compte-connexion-code'] = () => routeur.aller('compte-code', { mode: 'connexion', email: valeurDe('compte-connexion-email', 120) });

  /* ---------- invitation-message [A-05, D-12, D-13] ---------- */
  E['invitation-message'] = {
    rendu: etat => {
      const p = etat.session.pretInvitationId ? modele.pret(etat.session.pretInvitationId) : null;
      const qui = (p && modele.prenom(p.preteurId)) || 'Léonie';   // le prêt de référence est créé à l'arrivée [D-43]
      return `<div class="compte-invitation">
          <p class="compte-invitation-note">Simulation d'un message reçu par WhatsApp ou par e-mail.</p>
          <div class="compte-message">
            <p>${echapper(TEXTES_HORS_NOTIF.invitation('preteur', { moi: qui }))}</p>
            <button type="button" class="compte-lien compte-message-lien" data-action="aller" data-route="compte-creer">Voir la proposition</button>
          </div>
        </div>`;
    },
    // Léonie prête 500 € en 5 × 100 € au testeur, Note, statut « propose » (action du socle, jamais pendant le rendu).
    arrivee: () => ouvrirInvitation()
  };

  /* ---------- page-en-preparation [C-68] ---------- */
  E['page-en-preparation'] = () => ui.enteteRetour({}) + `<div class="compte-page">
      <p class="compte-texte">Prototype de test. Ces documents sont en préparation.</p>
      ${ui.bouton('Retour', { action: 'retour' })}
    </div>`;
})();
