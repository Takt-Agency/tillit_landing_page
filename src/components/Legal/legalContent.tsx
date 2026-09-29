export type LegalTab =
  | 'mentions'
  | 'cgu'
  | 'cgv'
  | 'confidentialite'
  | 'cookies';

export const TABS: { key: LegalTab; label: string; icon: string }[] = [
  { key: 'mentions', label: 'Mentions légales', icon: 'fa-scale-balanced' },
  { key: 'cgu', label: "CGU", icon: 'fa-file-contract' },
  { key: 'cgv', label: 'CGV', icon: 'fa-file-invoice' },
  {
    key: 'confidentialite',
    label: 'Confidentialité',
    icon: 'fa-user-shield',
  },
  { key: 'cookies', label: 'Cookies', icon: 'fa-cookie-bite' },
];

export const LAST_UPDATE = 'Dernière mise à jour : 15 janvier 2026';

function Mentions() {
  return (
    <>
      <h3>Éditeur du site</h3>
      <p>
        Le site <strong>tillitapp.fr</strong> est édité par <strong>TilliT</strong>,
        société en cours de création. Adresse de correspondance disponible sur
        demande.
      </p>

      <h3>Contact</h3>
      <p>
        Email : <a href="mailto:tillit@tillitapp.fr">tillit@tillitapp.fr</a>
      </p>

      <h3>Directeur de la publication</h3>
      <p>L'équipe fondatrice de TilliT.</p>

      <h3>Hébergement</h3>
      <p>
        Le site est hébergé au sein de l'Union européenne, dans le respect des
        obligations en matière de protection des données.
      </p>

      <h3>Propriété intellectuelle</h3>
      <p>
        L'ensemble des contenus présents sur ce site (textes, illustrations, logos,
        marques) sont la propriété exclusive de TilliT ou de leurs auteurs
        respectifs. Toute reproduction, représentation ou diffusion, totale ou
        partielle, sans autorisation écrite préalable est interdite.
      </p>
    </>
  );
}

function CGU() {
  return (
    <>
      <h3>Objet</h3>
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et
        l'utilisation de l'application TilliT, destinée à faciliter la
        formalisation et le suivi de prêts d'argent entre proches.
      </p>

      <h3>Nature du service</h3>
      <p>
        TilliT n'est <strong>ni une banque, ni un organisme de crédit, ni un
        établissement de paiement</strong>. Les fonds ne transitent jamais par
        TilliT. TilliT ne garantit pas le remboursement des prêts et n'évalue pas
        la solvabilité des utilisateurs.
      </p>

      <h3>Acceptation</h3>
      <p>
        L'utilisation du service implique l'acceptation pleine et entière des
        présentes CGU. TilliT se réserve le droit de modifier les CGU à tout
        moment ; les utilisateurs seront informés des mises à jour substantielles.
      </p>

      <h3>Responsabilités de l'utilisateur</h3>
      <p>
        L'utilisateur s'engage à fournir des informations exactes et à utiliser le
        service dans le respect des lois et règlements en vigueur.
      </p>

      <h3>Résiliation</h3>
      <p>
        L'utilisateur peut supprimer son compte à tout moment depuis les paramètres
        de l'application. TilliT peut suspendre un compte en cas d'utilisation
        abusive.
      </p>
    </>
  );
}

function CGV() {
  return (
    <>
      <h3>Formules payantes</h3>
      <p>
        L'accès à la formule <strong>TilliT Zen</strong> est payant. Le tarif
        dépend du montant du prêt structuré, à partir de <strong>2,99 €</strong>{' '}
        (paiement unique par prêt).
      </p>

      <h3>Modalités de paiement</h3>
      <p>
        Le paiement s'effectue en ligne, par carte bancaire, via un prestataire de
        paiement sécurisé. La facture est disponible dans l'espace utilisateur.
      </p>

      <h3>Rétractation</h3>
      <p>
        Conformément à l'article L221-28 du Code de la consommation,
        l'utilisateur reconnaît que le service est fourni immédiatement et renonce
        expressément à son droit de rétractation dès la validation de la commande.
      </p>

      <h3>Zéro intérêt, zéro commission</h3>
      <p>
        TilliT ne facture <strong>aucun intérêt</strong> ni{' '}
        <strong>aucune commission sur la dette</strong>. La monétisation repose
        uniquement sur les services de formalisation juridique.
      </p>
    </>
  );
}

function Confidentialite() {
  return (
    <>
      <h3>Données collectées</h3>
      <p>
        TilliT collecte les données nécessaires au bon fonctionnement du service :
        identité, coordonnées, informations relatives aux prêts créés,
        conversations dans l'espace de dialogue.
      </p>

      <h3>Finalités</h3>
      <p>
        Les données sont utilisées pour fournir le service, gérer le compte
        utilisateur, envoyer les rappels et améliorer l'application. Aucune donnée
        n'est vendue à des tiers.
      </p>

      <h3>Hébergement</h3>
      <p>
        L'ensemble des données est hébergé dans l'Union européenne, dans le
        respect du Règlement Général sur la Protection des Données (RGPD).
      </p>

      <h3>Vos droits</h3>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
        d'effacement et de portabilité de vos données. Pour les exercer, écrivez à{' '}
        <a href="mailto:tillit@tillitapp.fr">tillit@tillitapp.fr</a>.
      </p>

      <h3>Durée de conservation</h3>
      <p>
        Les données sont conservées pendant toute la durée du compte, puis
        anonymisées ou supprimées dans les 12 mois suivant la clôture, sauf
        obligation légale contraire.
      </p>
    </>
  );
}

function Cookies() {
  return (
    <>
      <h3>Qu'est-ce qu'un cookie ?</h3>
      <p>
        Un cookie est un petit fichier déposé sur votre terminal lors de la visite
        d'un site. Il permet de reconnaître votre navigateur et de mémoriser
        certaines informations.
      </p>

      <h3>Cookies utilisés</h3>
      <p>
        tillitapp.fr utilise exclusivement des <strong>cookies techniques</strong>{' '}
        nécessaires au fonctionnement du site (préférences d'affichage, session).
        Aucun cookie publicitaire ou de suivi tiers n'est déposé.
      </p>

      <h3>Gestion des cookies</h3>
      <p>
        Vous pouvez à tout moment paramétrer votre navigateur pour bloquer les
        cookies. Le refus des cookies techniques peut entraîner une dégradation
        des fonctionnalités du site.
      </p>

      <h3>Contact</h3>
      <p>
        Pour toute question relative aux cookies :{' '}
        <a href="mailto:tillit@tillitapp.fr">tillit@tillitapp.fr</a>
      </p>
    </>
  );
}

export const CONTENT: Record<LegalTab, () => JSX.Element> = {
  mentions: Mentions,
  cgu: CGU,
  cgv: CGV,
  confidentialite: Confidentialite,
  cookies: Cookies,
};

/** Legal texts that have their own page; the others still open in the modal. */
export const LEGAL_ROUTES: Partial<Record<LegalTab, string>> = {
  cgv: '/cgv',
  confidentialite: '/confidentialite',
  cookies: '/cookies',
};
