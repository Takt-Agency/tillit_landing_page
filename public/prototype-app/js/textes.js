/* ==========================================================================
   TilliT prototype · textes.js (lot 0)
   Formats français (montants, dates, délais), accords, aide au rôle,
   échappement du texte saisi. S'utilise par textes.euros(…), etc.
   ========================================================================== */
(function () {
  'use strict';
  const NBSP = ' ';      // espace insécable (avant €, dans « », avant : ; ! ?)
  const FINE = ' ';      // espace fine insécable (disponible ; les milliers prennent NBSP, comme le site)
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
                'septembre', 'octobre', 'novembre', 'décembre'];

  const groupes = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);   // milliers : espace insécable, comme le site (1&nbsp;500&nbsp;€)

  // Centimes -> « 1 500 € », « 80,65 € ». Les centimes n'apparaissent que s'il y en a.
  function euros(centimes) {
    const neg = centimes < 0;
    const c = Math.abs(Math.round(centimes || 0));
    const e = Math.floor(c / 100), ct = c % 100;
    return (neg ? '-' : '') + groupes(e) + (ct ? ',' + String(ct).padStart(2, '0') : '') + NBSP + '€';
  }
  // Valeur à mettre dans un champ : « 100 » ou « 80,65 ».
  function pourChamp(centimes) {
    if (centimes == null || isNaN(centimes)) return '';
    const e = Math.floor(centimes / 100), ct = centimes % 100;
    return ct ? `${e},${String(ct).padStart(2, '0')}` : String(e);
  }
  // Saisie « 80,65 », « 80.65 », « 1 500 » -> centimes (entier), ou null si illisible.
  function versCentimes(saisie) {
    const s = String(saisie ?? '').replace(/[\s  €]/g, '').replace(',', '.');
    if (!/^\d+(\.\d{0,2})?$/.test(s)) return null;
    return Math.round(parseFloat(s) * 100);
  }

  const partie = iso => iso.split('-').map(Number);
  const jourDuMois = j => (j === 1 ? '1er' : String(j));
  const aujourdhuiSimule = () => (window.modele ? window.modele.aujourdhui() : window.calculs.isoLocal());

  // « 12 octobre » ; l'année s'ajoute si elle diffère de l'année simulée.
  function date(iso, reference) {
    if (!iso) return '';
    const [a, m, j] = partie(iso);
    const ref = reference || aujourdhuiSimule();
    return `${jourDuMois(j)} ${MOIS[m - 1]}` + (Number(ref.slice(0, 4)) !== a ? ` ${a}` : '');
  }
  // « 12 octobre 2026 »
  function dateLongue(iso) { if (!iso) return ''; const [a, m, j] = partie(iso); return `${jourDuMois(j)} ${MOIS[m - 1]} ${a}`; }
  // « septembre 2026 »
  function moisAnnee(iso) { if (!iso) return ''; const [a, m] = partie(iso); return `${MOIS[m - 1]} ${a}`; }
  // « aujourd'hui », « demain », « dans 3 jours », « hier », « il y a 3 jours » (sur la date simulée)
  function delai(iso, reference) {
    const n = window.calculs.joursEntre(reference || aujourdhuiSimule(), iso);
    if (n === 0) return "aujourd'hui";
    if (n === 1) return 'demain';
    if (n === -1) return 'hier';
    return n > 1 ? `dans ${n} jours` : `il y a ${-n} jours`;
  }

  // Accord : 0 et 1 au singulier. pluriel(2, 'prêt', 'prêts') -> « 2 prêts ».
  const pluriel = (n, singulier, plurielForme) => `${n} ${n > 1 ? plurielForme : singulier}`;
  // Aide au rôle : le texte P pour le prêteur, E pour l'emprunteur.
  const selonRole = (role, textePreteur, texteEmprunteur) => (role === 'preteur' ? textePreteur : texteEmprunteur);

  // Échappement obligatoire de tout texte venant du testeur avant insertion dans le HTML.
  const ENTITES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const echapper = t => String(t ?? '').replace(/[&<>"']/g, c => ENTITES[c]);

  // Remplit « {autre} te propose {montant} » avec un objet de valeurs (déjà formatées).
  const remplir = (gabarit, valeurs) => gabarit.replace(/\{(\w+)\}/g, (m, k) => (valeurs[k] != null ? valeurs[k] : m));

  // Espaces insécables de la typographie française : dans « », avant : ; ! ? et €.
  function insecables(t) {
    return String(t)
      .replace(/« /g, '«' + NBSP).replace(/ »/g, NBSP + '»')
      .replace(/ ([:;!?])(?=\s|$|»| )/g, NBSP + '$1')
      .replace(/ €/g, NBSP + '€');
  }

  // Début d'un message, 60 caractères au plus (notification « message_recu »).
  const debut = (t, max = 60) => { const s = String(t ?? '').trim(); return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s; };

  // Adresse simulée : « Léonie » -> « leonie@exemple.fr ».
  const emailSimule = prenom => String(prenom || 'alex').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') + '@exemple.fr';

  window.textes = Object.freeze({
    NBSP, FINE, MOIS,
    euros, pourChamp, versCentimes,
    date, dateLongue, moisAnnee, delai,
    pluriel, selonRole, echapper, remplir, insecables, debut, emailSimule
  });
})();
