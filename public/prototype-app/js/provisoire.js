/* ==========================================================================
   TilliT prototype · provisoire.js (lot 0)
   Écrans provisoires pour que l'appli tourne avant les lots. Chaque lot
   remplace le sien en enregistrant la même route dans son fichier (chargé
   après celui-ci) : aucune alerte, rien à supprimer ici.
     compte-creer   -> lot A (compte.js)
     accueil, notifications -> lot B (accueil.js)
     parcours       -> lot G (parcours.js)
     carnet, profil -> lot I (carnet.js)
   ========================================================================== */
(function () {
  'use strict';
  const { echapper } = window.textes;
  const E = window.ecrans, A = window.actions;
  const provisoire = (registre, cle) => window.routeur.marquerProvisoire(registre, cle);

  E['compte-creer'] = () => `
    <div class="provisoire">
      <p class="bandeau-prototype">Prototype de test. Aucune donnée réelle, aucun paiement réel. Ce que tu saisis reste sur ce téléphone.</p>
      <h1 class="titre">Créer mon compte</h1>
      <p class="texte-mute">Écran provisoire du socle.</p>
      ${window.ui.bouton('Créer un compte de test', { action: 'provisoire-creer-compte' })}
    </div>`;
  A['provisoire-creer-compte'] = () => {
    const r = window.creerCompte({});
    if (r.ok) window.routeur.aller('accueil', {}, { racine: true });
  };

  E.accueil = etat => `
    <div class="provisoire">
      <h1 class="titre">Salut ${echapper(etat.moi.prenom)},</h1>
      ${window.ui.mascotte('heureuse', { taille: 'moyenne' })}
      <p class="texte-mute">Accueil provisoire.</p>
      ${window.ui.bouton('Nouveau prêt', { action: 'nouveau-pret' })}
    </div>`;

  E.parcours = () => `
    <div class="provisoire">
      <h1 class="titre">Parcours</h1>
      ${window.ui.mascotte('attentive', { taille: 'moyenne' })}
      <p>Ton premier prêt apparaîtra ici.</p>
      ${window.ui.bouton('Nouveau prêt', { action: 'nouveau-pret' })}
    </div>`;

  E.carnet = () => `
    <div class="provisoire">
      <p class="surtitre">Carnet de prêt</p>
      <h1 class="titre">Ce que tu as fait, pas ce que tu vaux.</h1>
      <p class="texte-mute">Carnet provisoire.</p>
    </div>`;

  E.profil = etat => `
    <div class="provisoire">
      ${window.ui.avatar('moi', { taille: 'xl' })}
      <h1 class="titre">${echapper([etat.moi.prenom, etat.moi.nom].filter(Boolean).join(' '))}</h1>
      <p class="texte-mute">Profil provisoire.</p>
      ${window.ui.bouton('Se déconnecter', { action: 'provisoire-deconnecter', variante: 'secondaire', icone: 'sortie' })}
    </div>`;
  // Spec 01 : feuille « Se déconnecter ? », puis remise à zéro et compte-creer.
  A['provisoire-deconnecter'] = () => window.ui.feuille.ouvrir(
    '<p>Dans ce prototype, tout est remis à zéro : ton compte, tes prêts et tes notifications.</p>'
    + '<div class="pile-reponses">' + window.ui.bouton('Se déconnecter', { action: 'provisoire-deconnecter-oui' })
    + window.ui.bouton('Annuler', { action: 'fermer-feuille', variante: 'discret', classe: 'btn--centre' }) + '</div>',
    { titre: 'Se déconnecter ?' });
  A['provisoire-deconnecter-oui'] = () => {
    window.seDeconnecter();
    window.routeur.aller('compte-creer', {}, { racine: true });
  };

  E.notifications = etat => window.ui.enteteRetour({ titre: 'Notifications' }) + (etat.notifications.length
    ? '<ul class="liste-notifs">' + etat.notifications.map(n => `<li><button type="button" class="notif${n.lue ? '' : ' notif--non-lue'}" data-action="provisoire-notif" data-id="${echapper(n.id)}">`
      + `${n.lue ? '' : '<span class="visuellement-cache">Non lue. </span>'}<span>${echapper(n.texte)}</span><span class="notif-date">${echapper(window.textes.delai(n.date))}</span></button></li>`).join('') + '</ul>'
    : '<p class="provisoire texte-mute">Rien de nouveau pour l\'instant.</p>');
  A['provisoire-notif'] = el => {
    const n = window.modele.lire().notifications.find(x => x.id === el.dataset.id);
    if (!n) return;
    window.marquerLue(n.id);
    if (n.lien) window.routeur.aller(n.lien.route, n.lien.pretId ? { pretId: n.lien.pretId } : {});
  };

  for (const r of ['compte-creer', 'accueil', 'parcours', 'carnet', 'profil', 'notifications']) provisoire('ecrans', r);
  for (const a of ['provisoire-creer-compte', 'provisoire-deconnecter', 'provisoire-deconnecter-oui', 'provisoire-notif']) provisoire('actions', a);
})();
