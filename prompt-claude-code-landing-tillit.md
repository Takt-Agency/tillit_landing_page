# PROMPT CLAUDE CODE — Landing Page TilliT

> Copie tout ce qui suit dans Claude Code.

---

Tu es un développeur front-end senior spécialisé en landing pages SaaS/fintech à forte conversion. Crée la **landing page officielle de TilliT**, une application mobile française de prêt entre proches.

## 1. Contexte produit (à respecter strictement)

TilliT est une application qui permet d'organiser, suivre et formaliser les prêts d'argent entre proches. Elle transforme une promesse verbale en engagement structuré.

**Cadrage légal impératif (à afficher clairement sur la page, notamment en footer) :**
- TilliT n'est ni une banque, ni un organisme de crédit, ni un établissement de paiement.
- Les fonds ne transitent JAMAIS par TilliT (virements de compte à compte via Open Banking).
- TilliT ne garantit pas le remboursement et n'évalue pas la solvabilité.
- 0 % d'intérêt, 0 commission sur la dette. La monétisation repose uniquement sur le service.

**Insight central du positionnement :**
« Le problème n'est pas l'argent. C'est le flou, le silence, la gêne et le ghosting. »
TilliT ne sécurise pas seulement l'argent : TilliT sécurise la relation.

**Baseline / slogans :**
- « Simple entre nous » (signature du logo)
- « La finance qui préserve les liens »
- « Prêter sans douter »
- « Parlez sur WhatsApp. Clarifiez sur TilliT. »

## 2. Charte graphique TilliT

- **Violet principal** : `#8B63E8` (fonds héros, titres, accents) + violet clair `#EDE7FB` pour les fonds de cartes
- **Corail secondaire** : `#EF8068` (CTA secondaires, sections alternées, highlights) + corail pâle `#FDF1EC`
- **Crème / fond clair** : `#FBF7F2` (fond général des sections claires)
- **Vert TilliT** : `#1E8A4C` (uniquement en accent ponctuel : badges "Gratuit", validations)
- **Blanc** `#FFFFFF` pour les cartes, texte sur fonds colorés
- **Typographie** : titres arrondis et chaleureux (Google Fonts : "Quicksand" ou "Baloo 2" en bold), corps de texte lisible ("Nunito" ou "Inter")
- **Style** : coins très arrondis (border-radius généreux, 16–24 px), ombres douces, motif décoratif en filigrane rappelant le "ll" cursif du logo, illustrations chaleureuses, beaucoup d'air
- **Mascotte / logo** : deux personnages qui s'enlacent (utiliser un placeholder SVG simple de deux silhouettes se prenant dans les bras si l'asset n'est pas fourni)
- **Ton** : bienveillant, jamais culpabilisant, jamais anxiogène. Filtre de wording : chaque phrase doit donner l'impression que l'utilisateur est une bonne personne (formaliser = protéger, pas se méfier). On vend la paix d'esprit et la protection de la relation, PAS la peur du non-remboursement ni la sécurité juridique comme argument premier.

## 3. Structure de la page (dans cet ordre)

1. **Header sticky** : logo TilliT + nav (Fonctionnalités, Comment ça marche, Tarifs, FAQ) + CTA « Essayer le prototype » → https://tillitapp.fr
2. **Hero** (fond violet #8B63E8, motif filigrane) :
   - H1 : « L'argent entre proches, sans le malaise. »
   - Sous-titre : « Le problème n'est pas l'argent. C'est le flou, le silence, la gêne et le ghosting. TilliT transforme une promesse verbale en engagement structuré — et préserve la relation. »
   - 2 CTA : « Découvrir TilliT » (blanc) + « Voir le prototype » (outline)
   - Mockup smartphone de l'app à droite (placeholder stylisé)
3. **Bandeau statistiques** (4 chiffres animés au scroll) :
   - 1,2 Md d'adultes dans le monde ont emprunté à un proche (Global Findex, 2025)
   - 6,5 M de Français prêtent ou empruntent à un proche chaque année (Insee)
   - 73 % des prêteurs ne récupèrent pas l'intégralité de leur argent (LendingTree, 2023)
   - 30 % des emprunteurs reconnaissent ne jamais avoir remboursé (Bread Financial, 2024)
4. **Le problème** (fond crème) : « La confiance permet le prêt. L'absence de cadre détruit la relation. » — 3 cartes : le flou, le silence qui pèse, la gêne de relancer.
5. **La solution — Comment ça marche** (4 étapes numérotées, style timeline) :
   - 01 Tu crées le prêt (montant, durée, échéancier — en 2 minutes)
   - 02 L'autre accepte (notification, signature en un tap)
   - 03 TilliT suit tout (rappels automatiques doux, aucune gêne à gérer)
   - 04 Le lien est préservé (prêt remboursé, Passeport de Fiabilité mis à jour)
   - Bandeau : « Pas de banque. Pas d'intérêts. Juste de la clarté entre vous. »
6. **Fonctionnalités clés** (grille de cartes) :
   - Prêt structuré en quelques clics (échéancier clair, partagé)
   - Rappels bienveillants (la mascotte relance à ta place, avec douceur)
   - Reconnaissance de dette 2.0 (signature électronique certifiée eIDAS, valeur légale, dossier de preuve clé en main)
   - Passeport de Fiabilité (historique de confiance partageable, facultatif et révocable)
   - Espace de dialogue (négociation bilatérale : accepter, refuser, contre-proposer)
   - Remboursements flexibles (in-app via Open Banking, ou hors app validé par le prêteur)
7. **Tarifs** (3 cartes, fond corail pâle) :
   - **NOTE — Gratuit** : prêts jusqu'à 1 500 €, échéancier partagé, rappels automatiques, espace de dialogue, historique. Badge vert « Gratuit ».
   - **ZEN — Premium** (carte mise en avant) : reconnaissance de dette, signature eIDAS, KYC, dossier juridique complet. Tarification par paliers : de 4,99 € (100–500 €) à 49,99 € (4 001–5 000 €) — paiement unique, afficher le tableau des paliers en accordéon ou mini-tableau. Mention : « ZEN responsabilise juridiquement l'emprunteur. Il ne garantit pas le remboursement. »
   - **Sérénité — 39,99 €** (upsell) : activable uniquement sur un prêt ZEN en cas de litige. Constitution du dossier, mise en demeure, transmission à un partenaire juridique.
   - Bandeau sous les cartes : « Zéro intérêt. Zéro commission sur la dette. TilliT ne gagne jamais d'argent sur la dette. »
8. **Cas d'usage / cible** : citation mise en scène — « Un ami me demande 500 € pour réparer sa voiture. Je veux l'aider, mais j'ai peur qu'on se fâche. » + chips : panne de voiture, caution logement, facture imprévue, dépannage entre amis, colocations, prêts familiaux.
9. **Section confiance / valeurs** (fond violet) : compatible finance éthique et sans intérêt (Riba-free), hébergement des données en UE, conformité RGPD, « Les fonds ne transitent jamais par TilliT ».
10. **FAQ** (accordéon, 6 questions) : TilliT est-il une banque ? / L'argent passe-t-il par TilliT ? / La reconnaissance de dette a-t-elle une valeur légale ? / Combien ça coûte ? / Que se passe-t-il en cas de retard ? / Puis-je déclarer un remboursement fait en espèces ?
11. **CTA final** (fond corail) : « Demain, on ne dira plus "je te fais un virement", on dira "on passe par TilliT". » + bouton prototype.
12. **Footer** : logo, liens, contact tillit@tillitapp.fr, mention « Société en cours de création », disclaimers légaux complets, © TilliT 2026.

## 4. Exigences techniques

- **Un seul fichier `index.html`** autonome : HTML + CSS (variables CSS pour la charte) + JS vanilla. Pas de framework, pas de build. Tailwind interdit — CSS custom propre.
- Responsive mobile-first (la cible utilise l'app sur mobile), breakpoints 640 / 1024 px.
- Animations légères : compteurs animés au scroll (IntersectionObserver), fade-in des sections, hover doux sur les cartes. `prefers-reduced-motion` respecté.
- Accessibilité : contrastes AA, navigation clavier, aria sur l'accordéon FAQ, alt sur les images.
- SEO : title, meta description, Open Graph, balises sémantiques (header/main/section/footer), un seul H1.
- Langue : tout en **français** (lang="fr").
- Performance : aucune dépendance externe hormis Google Fonts, images en SVG/placeholder.

## 5. Ce qu'il ne faut PAS faire

- Pas de vocabulaire anxiogène (« impayé », « débiteur », « recouvrement », « se protéger contre ») dans les sections marketing — réserver le vocabulaire juridique à la carte ZEN/Sérénité et au footer.
- Ne jamais présenter TilliT comme un moyen de « se méfier » : le geste TilliT signifie « je tiens à toi », pas « je ne te fais pas confiance ».
- Pas de dark patterns, pas de fausse urgence, pas de faux témoignages chiffrés inventés.

Livre le fichier complet, prêt à ouvrir dans un navigateur.
