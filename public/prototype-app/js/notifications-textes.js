/* ==========================================================================
   TilliT prototype · notifications-textes.js
   Tous les textes du fichier 12 (notifications et rappels). Confié au lot 0
   pour que chaque lot puisse appeler notifier(cle, donnees) dès le départ.
   Une clé absente se demande, elle ne s'invente pas.

   Chaque clé : { ouvre, P, E } ou { ouvre, tous }.
   - P : texte reçu quand le testeur est prêteur dans le prêt ; E : emprunteur ;
     tous : même texte quel que soit le rôle (ou pas de prêt).
   - Rôle sans texte = aucune notification (« aucun rappel » dans la spec).
   - ouvre : route ouverte au toucher (chaîne ou fonction des valeurs).
   Les valeurs v arrivent déjà formatées par notifier() (etat.js) :
   v.autre, v.moi, v.tiers, v.payeur (« toi » si c'est le testeur), v.montant,
   v.date, v.nouvelle_date, v.date_declaration, v.reste, v.k, v.code,
   v.formule ('note'|'zen'), v.type (type de changement), v.moyen,
   v.cas (annulation), v.envoyee (expiration), v.parTiers, v.message.
   ========================================================================== */
(function () {
  'use strict';
  const q = t => `« ${t} »`;   // guillemets français

  const TEXTES = {
    /* ---------- 1. Rappels d'échéance (ouvrent le Parcours du prêt) ---------- */
    rappel_jm5: { ouvre: 'parcours',
      P: v => `Échéance du ${v.date} dans 5 jours : ${v.montant} de ${v.autre}. ${v.autre} a reçu son rappel.`,
      E: v => `Dans 5 jours, ${v.montant} à rembourser à ${v.autre}.` },
    rappel_jm1: { ouvre: 'parcours',
      P: v => `Demain, échéance de ${v.montant} avec ${v.autre}.`,
      E: v => `Demain, ${v.montant} à rembourser à ${v.autre}.` },
    rappel_j0: { ouvre: 'parcours',
      P: v => `C'est aujourd'hui : échéance de ${v.montant} avec ${v.autre}. On te prévient dès que le remboursement est déclaré.`,
      E: v => `C'est aujourd'hui : ${v.montant} pour ${v.autre}. Déjà fait ? Déclare-le.` },
    rappel_jp3: { ouvre: 'parcours',
      P: v => `L'échéance du ${v.date} est passée et ${v.autre} n'a rien déclaré pour l'instant. Si tu as reçu l'argent, indique-le.`,
      E: v => `L'échéance du ${v.date} est passée. Si tu as remboursé, déclare-le. Sinon, propose une nouvelle date à ${v.autre}.` },
    rappel_jp5: { ouvre: 'parcours',
      P: v => `Échéance du ${v.date} : toujours rien de déclaré. Tu peux écrire à ${v.autre} depuis le prêt.`,
      E: v => `Échéance du ${v.date} : rien n'est encore déclaré. Déclare ton remboursement, ou propose une nouvelle date à ${v.autre}.` },
    rappel_jp7: { ouvre: 'parcours',
      P: v => `Échéance du ${v.date} : toujours rien de déclaré. Pour relancer, parle de la date : ${q(`L'échéance du ${v.date} est passée, tu me dis où tu en es ?`)}`
        + (v.tiers ? ` Tu peux aussi prévenir ${v.tiers}.` : ''),
      E: v => `L'échéance du ${v.date} attend toujours. Déclare-la si tu as remboursé, ou écris à ${v.autre} pour vous mettre d'accord sur une nouvelle date.` },
    rappel_confirmation: { ouvre: 'parcours',
      P: v => `${v.autre} a déclaré un remboursement de ${v.montant} le ${v.date_declaration}. Tu confirmes l'avoir reçu ?` },
    rappel_non_recu: { ouvre: 'parcours',
      E: v => `${v.autre} n'a pas encore vu arriver tes ${v.montant}. Vérifie ton virement, puis déclare-le à nouveau ou écris-lui.` },

    /* ---------- 2. Compte ---------- */
    code_connexion: { ouvre: null, tous: v => `Ton code TilliT : ${v.code}.` },

    /* ---------- 3. Proposition et négociation ---------- */
    proposition_recue_e: { ouvre: 'proposition-recue', E: v => `${v.autre} te propose un prêt de ${v.montant}.` },
    proposition_recue_p: { ouvre: 'proposition-recue', P: v => `${v.autre} te demande ${v.montant}.` },
    nouvelle_proposition: { ouvre: 'proposition-recue', tous: v => `${v.autre} propose autre chose pour votre prêt.` },
    proposition_acceptee: {
      ouvre: v => (v.formule === 'zen' ? 'accord-zen' : 'accord-note'),
      tous: v => (v.formule === 'zen'
        ? `${v.autre} a accepté. Accord trouvé, en attente du paiement de Zen par ${v.payeur}.`
        : `${v.autre} a accepté. Le prêt est validé.`) },
    proposition_refusee: { ouvre: 'refus-recu', tous: v => `${v.autre} a refusé cette proposition.` },
    proposition_retiree: { ouvre: 'parcours', tous: v => `${v.autre} a retiré sa proposition.` },
    proposition_expiree: { ouvre: 'parcours',
      tous: v => (v.envoyee ? `Ta proposition à ${v.autre} a expiré sans réponse.` : `La proposition de ${v.autre} a expiré sans réponse.`) },
    carnet_demande: { ouvre: 'carnet-demande-recue', E: v => `${v.autre} demande à voir ton Carnet de prêt.` },
    carnet_accepte: { ouvre: 'carnet-proche', P: v => `${v.autre} accepte de te montrer son Carnet de prêt.` },
    carnet_refuse: { ouvre: 'proposition-recue', P: v => `${v.autre} préfère ne pas montrer son Carnet pour l'instant.` },

    /* ---------- 4. Zen ---------- */
    zen_paye_par_autre: { ouvre: 'zen-document', tous: v => `${v.autre} a payé Zen. Vous pouvez signer la reconnaissance de dette.` },
    signature_autre: { ouvre: 'zen-document', tous: v => `${v.autre} a signé la reconnaissance de dette. À toi de signer.` },
    zen_signe_par_deux: { ouvre: 'zen-signe', tous: () => 'Signé par vous deux. Le prêt est validé.' },
    zen_signe_passage: { ouvre: 'zen-signe', tous: () => 'Signé par vous deux. Le prêt passe en Zen.' },   // passage en Zen d'un prêt déjà validé ou en cours (Z1)
    relance_signature: { ouvre: 'zen-document', tous: v => `La reconnaissance de dette de votre prêt avec ${v.autre} attend ta signature.` },
    passage_zen_recu: { ouvre: 'changement-recu', tous: v => `${v.autre} propose de passer le prêt en Zen.` },

    /* ---------- 5. Versement ---------- */
    versement_declare: { ouvre: 'versement-confirmer', E: v => `${v.autre} a envoyé ${v.montant}. Tu confirmes l'avoir reçu ?` },
    versement_pas_encore: { ouvre: 'parcours',
      P: v => (v.moyen === 'especes'
        ? `${v.autre} n'a pas encore reçu les ${v.montant}. Écris-lui pour faire le point.`
        : `${v.autre} n'a pas encore reçu les ${v.montant}. Vérifie que ton virement est bien parti.`) },
    versement_confirme: { ouvre: 'pret-demarre', P: v => `${v.autre} a confirmé la réception. Le prêt démarre.` },
    versement_recu_declare_par_emprunteur: { ouvre: 'pret-demarre', P: v => `${v.autre} a déclaré avoir reçu les ${v.montant}. Le prêt démarre.` },

    /* ---------- 6. Remboursements ---------- */
    rembt_declare: { ouvre: 'parcours', P: v => `${v.autre} a déclaré un remboursement de ${v.montant}. Tu confirmes l'avoir reçu ?` },
    rembt_confirme: { ouvre: 'parcours', E: v => `${v.autre} a confirmé ton remboursement de ${v.montant}.` },
    rembt_non_recu: { ouvre: 'parcours', E: v => `${v.autre} n'a pas encore vu arriver tes ${v.montant}. Vérifie ton virement, puis déclare-le à nouveau ou écris-lui.` },
    rembt_recu_declare_par_preteur: { ouvre: 'parcours', E: v => `${v.autre} a indiqué avoir reçu ton remboursement de ${v.montant}.` },
    // Confirmation d'office après 14 jours (décision P-8 n° 6) : deux rappels au prêteur, puis l'avis aux deux.
    rappel_confirmation_office: { ouvre: 'parcours',
      P: v => `${v.autre} a déclaré ${v.montant}. Sans réponse de ta part, ce remboursement sera confirmé le ${v.date}.` },
    rembt_confirme_office: { ouvre: 'parcours',
      P: v => `Sans réponse de ta part, le remboursement de ${v.montant} déclaré par ${v.autre} est confirmé. Écris-lui si tu ne l'as pas reçu.`,
      E: v => `Ton remboursement de ${v.montant} est confirmé. ${v.autre} n'a pas répondu sous 14 jours.` },
    pret_rembourse: { ouvre: 'fin-pret', E: v => `${v.autre} a confirmé ton dernier remboursement. Prêt remboursé !` },
    avance_rapide_resume: { ouvre: 'parcours',
      tous: v => `On a avancé jusqu'au ${v.date}. ` + (Number(v.k) > 1 ? `${v.k} échéances sont marquées remboursées.` : `${v.k} échéance est marquée remboursée.`) },

    /* ---------- 7. Changements de calendrier ---------- */
    changement_recu: { ouvre: 'changement-recu',
      tous: v => (v.type === 'decaler' ? `${v.autre} propose de décaler l'échéance du ${v.date} au ${v.nouvelle_date}.`
        : v.type === 'partie' ? `${v.autre} propose de payer une partie de l'échéance du ${v.date}.`
        : `${v.autre} propose un nouveau calendrier.`) },
    changement_contre: { ouvre: 'changement-recu', tous: v => `${v.autre} propose un autre calendrier.` },
    changement_accepte: { ouvre: 'changement-accepte',
      tous: v => (v.type === 'decaler' ? `${v.autre} a accepté la nouvelle date.`
        : v.type === 'partie' ? `${v.autre} a accepté ta proposition.`
        : v.type === 'passage_zen' ? `${v.autre} a accepté de passer le prêt en Zen.`
        : `${v.autre} a accepté le nouveau calendrier.`) },
    changement_refuse: { ouvre: 'changement-refuse',
      tous: v => (v.type === 'passage_zen' ? `${v.autre} préfère garder le prêt sur Note.` : `${v.autre} préfère garder le calendrier prévu.`) },

    /* ---------- 8. Fil, tiers de confiance ---------- */
    message_recu: { ouvre: 'fil',
      tous: v => (v.parTiers ? `${v.tiers} a écrit dans le fil du prêt.` : `${v.autre} t'a écrit : ${q(v.message)}`) },
    tiers_accepte: { ouvre: 'parcours', tous: v => `${v.tiers} a accepté d'être tiers de confiance pour votre prêt.` },
    tiers_alerte: { ouvre: 'fil',
      E: v => `TilliT a prévenu ${v.tiers}, votre tiers de confiance, pour vous aider à reprendre la discussion.`,
      P: v => `C'est envoyé. ${v.tiers} rejoint le fil du prêt.` },
    // P-11 (spec 10, 12) : les deux proches apprennent que leur tiers a été prévenu de la fin.
    // Le message reçu par le tiers lui-même est dans AUTRES.messageFinTiers (aucun chiffre).
    tiers_fin: { ouvre: 'fil', tous: v => `On a prévenu ${v.tiers} que votre prêt est terminé.` },

    /* ---------- 9. Fin, clôture, annulation ---------- */
    merci_recu: { ouvre: 'parcours', P: v => `${v.autre} t'a envoyé un merci.` },
    petit_geste_recu: { ouvre: 'parcours', P: v => `${v.autre} t'a offert un petit geste de ${v.montant}.` },
    cloture_cadeau: { ouvre: 'parcours', E: v => `${v.autre} a clôturé le prêt et t'a fait cadeau des ${v.reste} restants.` },
    pret_annule: { ouvre: 'parcours',
      tous: v => `${v.autre} a annulé le prêt.` + ({
        credit_moi: ' Le prix de Zen reste en crédit pour toi.',
        credit_autre: ` Le prix de Zen reste en crédit pour ${v.payeur}.`,
        zen_signe: ' Le paiement de Zen n\'est ni remboursé ni gardé en crédit.'
      }[v.cas] || '') }
  };

  // Textes du fichier 12 qui ne sont pas des notifications.
  const AUTRES = Object.freeze({
    // Bulle de la mascotte sur l'accueil, côté prêteur, quand un rappel vient de partir chez l'autre [C-16].
    bulleRappel: v => `${v.autre} a reçu son rappel pour l'échéance du ${v.date}.`,
    // Aperçu du message d'invitation : selon le rôle de celui qui invite.
    invitation: (roleQuiInvite, v) => (roleQuiInvite === 'preteur'
      ? `${v.moi} te propose un prêt sur TilliT.` : `${v.moi} te demande un prêt sur TilliT.`),
    // Message envoyé au tiers de confiance quand le prêt se termine (spec 10, 12, décision de Yohann
    // du 24/09/2026) : ni montant, ni durée, ni date d'échéance. Montré aux deux proches dans le fil.
    messageFinTiers: v => `Bonjour ${v.tiers}. Le prêt entre ${v.preteur} et ${v.emprunteur} est terminé. `
      + "Merci d'avoir accepté d'être leur tiers de confiance."
  });

  for (const k of Object.keys(TEXTES)) Object.freeze(TEXTES[k]);
  window.TEXTES_NOTIF = Object.freeze(TEXTES);
  window.TEXTES_HORS_NOTIF = AUTRES;
})();
