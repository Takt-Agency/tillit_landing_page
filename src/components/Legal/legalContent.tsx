import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { fr } from '../../lib/typo';
import { useLang, useLocalize, type Lang } from '../../i18n';
import cs from './legalContent.module.css';

export type LegalTab = 'mentions' | 'conditions' | 'confidentialite' | 'cookies';

export type LegalPage = {
  key: LegalTab;
  /** Full title (page hero, card, modal). */
  label: string;
  /** Short label for navigation (side nav, footer). */
  shortLabel: string;
  icon: string;
  route: string;
  /** Intro sentence shown under the page title. */
  lead: string;
};

export const TABS: LegalPage[] = [
  {
    key: 'mentions',
    label: 'Mentions légales',
    shortLabel: 'Mentions légales',
    icon: 'fa-scale-balanced',
    route: '/mentions-legales',
    lead: 'Qui édite ce site, qui l’héberge, et à qui s’adresser.',
  },
  {
    key: 'conditions',
    label: 'Conditions d’utilisation',
    shortLabel: 'Conditions',
    icon: 'fa-file-contract',
    route: '/conditions',
    lead: 'Les règles d’usage de ce site, en attendant celles de l’application.',
  },
  {
    key: 'confidentialite',
    label: 'Confidentialité',
    shortLabel: 'Confidentialité',
    icon: 'fa-user-shield',
    route: '/confidentialite',
    lead: 'Les données que ce site collecte, pourquoi, combien de temps, et comment les faire effacer.',
  },
  {
    key: 'cookies',
    label: 'Cookies',
    shortLabel: 'Cookies',
    icon: 'fa-cookie-bite',
    route: '/cookies',
    lead: 'Ce site n’en dépose aucun. Voici comment on l’a vérifié.',
  },
];

/** Same date on the four legal pages. */
export const LAST_UPDATE = fr('Dernière mise à jour : 15 septembre 2026.');

export const REVIEW_NOTE =
  'Les informations juridiques de cette page sont en cours de relecture par notre conseil.';

/** Every legal text has its own page. */
export const LEGAL_ROUTES: Record<LegalTab, string> = {
  mentions: '/mentions-legales',
  conditions: '/conditions',
  confidentialite: '/confidentialite',
  cookies: '/cookies',
};

/** English tabs. `route` stays the French path: localise it with `useLocalize()`. */
export const TABS_EN: LegalPage[] = [
  {
    key: 'mentions',
    label: 'Legal notice',
    shortLabel: 'Legal notice',
    icon: 'fa-scale-balanced',
    route: '/mentions-legales',
    lead: 'Who publishes this site, who hosts it, and who to contact.',
  },
  {
    key: 'conditions',
    label: 'Terms of use',
    shortLabel: 'Terms',
    icon: 'fa-file-contract',
    route: '/conditions',
    lead: 'The rules for using this site, until the app has its own.',
  },
  {
    key: 'confidentialite',
    label: 'Privacy',
    shortLabel: 'Privacy',
    icon: 'fa-user-shield',
    route: '/confidentialite',
    lead: 'The data this site collects, why, for how long, and how to have it erased.',
  },
  {
    key: 'cookies',
    label: 'Cookies',
    shortLabel: 'Cookies',
    icon: 'fa-cookie-bite',
    route: '/cookies',
    lead: 'This site sets none. Here is how we checked.',
  },
];

/** Page chrome of the legal pages, per language. */
export const LEGAL_COPY: Record<
  Lang,
  { tabs: LegalPage[]; eyebrow: string; lastUpdate: string; reviewNote: string }
> = {
  fr: {
    tabs: TABS,
    eyebrow: 'Informations légales',
    lastUpdate: LAST_UPDATE,
    reviewNote: REVIEW_NOTE,
  },
  en: {
    tabs: TABS_EN,
    eyebrow: 'Legal information',
    lastUpdate: 'Last updated: 15 September 2026.',
    reviewNote: 'The legal information on this page is being reviewed by our legal counsel.',
  },
};

/* ------------------------------------------------------------------ */

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/** "À compléter par TilliT" block: information TilliT still has to provide. */
function ToFill({ children }: { children: ReactNode }) {
  const lang = useLang();
  return (
    <div className={cs.todo}>
      <p className={cs.todoTitle}>
        <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
        <strong>{lang === 'en' ? 'To be completed by TilliT' : 'À compléter par TilliT'}</strong>
      </p>
      {children}
    </div>
  );
}

/** Links take FRENCH paths; they are localised for the current language. */
function SeeAlso({ links }: { links: { to: string; label: string }[] }) {
  const lang = useLang();
  const loc = useLocalize();
  return (
    <p className={cs.seeAlso}>
      {lang === 'en' ? 'See also:' : <>Voir aussi&nbsp;:</>}{' '}
      {links.map((l, i) => (
        <span key={l.to}>
          {i > 0 && ' · '}
          <Link to={loc(l.to)}>{l.label}</Link>
        </span>
      ))}
    </p>
  );
}

/** English pages only: the French text is the legally binding one. */
function Translation({ to, title }: { to: string; title: string }) {
  return (
    <div className={cs.translation}>
      <p className={cs.translationTitle}>
        <i className="fa-solid fa-language" aria-hidden="true" />
        <strong>Translation</strong>
      </p>
      <p>
        This is a translation provided for convenience. The French version,{' '}
        <Link to={to} lang="fr" hrefLang="fr">
          {title}
        </Link>
        , is the legally binding one.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Mentions() {
  return (
    <>
      <h3>L’éditeur du site</h3>
      <ToFill>
        <ul>
          <li>Raison sociale et forme juridique (SAS, SASU, SARL, entreprise individuelle…)</li>
          <li>Adresse du siège social</li>
          <li>Numéro SIREN ou SIRET, et ville du greffe d’immatriculation</li>
          <li>Numéro de TVA intracommunautaire, s’il y en a un</li>
          <li>Capital social, si la forme juridique en comporte un</li>
          <li>Nom du directeur de la publication</li>
          <li>Adresse électronique et numéro de téléphone de contact</li>
        </ul>
        <p>
          Ces éléments sont obligatoires pour tout site accessible au public (article{' '}
          <span className={cs.nowrap}>1-1</span> de la loi du 21 juin 2004 pour la confiance dans
          l’économie numérique).
        </p>
      </ToFill>

      <h3>L’hébergeur</h3>
      <p>
        Ce site est hébergé par <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200, San
        Francisco, CA 94107, États-Unis. Site&nbsp;:{' '}
        <External href="https://www.netlify.com">netlify.com</External>.
      </p>
      <ToFill>
        <ul>
          <li>Numéro de téléphone de l’hébergeur</li>
        </ul>
      </ToFill>

      <h3>Ce que TilliT est, et ce qu’il n’est pas</h3>
      <p>
        TilliT n’est ni une banque, ni un organisme de crédit, ni un établissement de paiement, ni
        un service de recouvrement. Les fonds ne transitent jamais par TilliT&nbsp;: le prêteur
        verse directement l’argent à l’emprunteur, et les remboursements suivent le même chemin.
        Aucun intérêt n’est appliqué.
      </p>
      <p>
        TilliT aide à réduire les malentendus et les oublis. Il ne garantit pas qu’un prêt sera
        remboursé, et ne le prétendra jamais.
      </p>

      <h3>Propriété intellectuelle</h3>
      <p>
        La marque TilliT, son logo, les textes, la charte graphique et le code de ce site sont
        protégés. Toute reproduction sans autorisation écrite préalable est interdite.
      </p>
      <p>
        Les photographies d’illustration proviennent d’Unsplash et de Pexels et sont utilisées selon
        la licence de ces services.
      </p>

      <h3>Signaler un problème</h3>
      <p>
        Pour toute question sur ce site ou son contenu, écris-nous depuis la{' '}
        <Link to="/contact">page contact</Link>.
      </p>
    </>
  );
}

function Conditions() {
  return (
    <>
      <p className={cs.chapo}>
        Cette page couvre l’usage de <strong>ce site</strong>. L’application TilliT n’étant pas
        encore sortie, ses conditions d’utilisation et de vente seront publiées avec elle, et
        acceptées dans l’application.
      </p>

      <h3>Ce que ce site propose aujourd’hui</h3>
      <p>
        Ce site présente TilliT, explique comment un prêt entre proches peut s’organiser, et permet
        de laisser un prénom et une adresse électronique pour être prévenu du lancement. Il ne
        permet ni de créer un prêt, ni de signer un document, ni de faire circuler de l’argent.
      </p>

      <h3>La valeur de ce qui est écrit ici</h3>
      <p>
        Les informations juridiques et fiscales présentées sur ce site (seuil de 1&nbsp;500&nbsp;€,
        article 1359 du Code civil, déclaration n°&nbsp;2062, prescription de cinq ans, règlement
        eIDAS) sont données à titre d’information générale et reflètent l’état du droit à la date de
        rédaction. Elles ne constituent pas un conseil juridique ni fiscal. Chaque situation est
        particulière&nbsp;: pour une décision qui engage, fais valider ton cas par un professionnel.
      </p>

      <h3>Ce que TilliT ne fait pas</h3>
      <p>
        TilliT n’est ni une banque, ni un organisme de crédit, ni un établissement de paiement, ni
        un service de recouvrement. Les fonds ne transitent jamais par TilliT. Aucun intérêt n’est
        appliqué. <strong>TilliT ne garantit pas qu’un prêt sera remboursé</strong>&nbsp;: il réduit
        les risques de malentendu, d’oubli et de non-dit, ce qui n’est pas la même chose.
      </p>

      <h3>Disponibilité</h3>
      <p>
        Ce site est fourni en l’état. Il peut être modifié, interrompu ou indisponible, notamment
        pendant une mise à jour.
      </p>

      <h3>Le contenu du site</h3>
      <p>
        La marque, le logo, les textes, la charte graphique et le code sont protégés. Tu peux citer
        et partager un lien vers une page&nbsp;; en revanche, reproduire tout ou partie du site sans
        autorisation écrite ne l’est pas.
      </p>

      <h3>Droit applicable</h3>
      <p>Ces conditions sont soumises au droit français.</p>
      <ToFill>
        <ul>
          <li>
            L’identité de la société éditrice (elle apparaîtra aussi dans les mentions légales)
          </li>
          <li>L’adresse électronique pour toute réclamation</li>
          <li>La date d’entrée en vigueur de ces conditions</li>
          <li>
            Le jour venu&nbsp;: les conditions générales d’utilisation et de vente de l’application,
            notamment pour la formule Zen
          </li>
        </ul>
      </ToFill>

      <SeeAlso
        links={[
          { to: '/mentions-legales', label: 'Mentions légales' },
          { to: '/confidentialite', label: 'Confidentialité' },
          { to: '/cookies', label: 'Cookies' },
        ]}
      />
    </>
  );
}

/** One of the four data collections: a bold title followed by its list. */
function Collect({ children }: { children: ReactNode }) {
  return <div className={cs.collect}>{children}</div>;
}

function Confidentialite() {
  return (
    <>
      <p className={cs.chapo}>
        Ce site collecte des données dans quatre formulaires. Rien n’est obligatoire pour le lire,
        et aucun traceur publicitaire ne te suit.
      </p>

      <h3>Les données que TilliT collecte</h3>
      <p>
        Quatre collectes ont lieu sur ce site. Chacune part vers le service de formulaires de notre
        hébergeur, Netlify. Aucune n’est nécessaire pour lire le site. Y ont accès l’équipe TilliT,
        et Netlify en tant que <span className={cs.nowrap}>sous-traitant</span> technique.
      </p>

      <Collect>
        <strong>1. Le formulaire «&nbsp;Me prévenir du lancement&nbsp;»</strong>
        <ul>
          <li>
            <strong>Pourquoi&nbsp;:</strong> te prévenir le jour où l’application sort.
          </li>
          <li>
            <strong>Ce qui est envoyé&nbsp;:</strong> ton prénom et ton adresse électronique.
          </li>
          <li>
            <strong>Sur quelle base&nbsp;:</strong> ton consentement, donné en envoyant le
            formulaire.
          </li>
          <li>
            <strong>Combien de temps&nbsp;:</strong> au maximum trois ans à partir de ton
            inscription, ou de la dernière fois que tu nous as contactés.
          </li>
        </ul>
      </Collect>

      <Collect>
        <strong>2. Le questionnaire en cinq questions</strong>
        <ul>
          <li>
            <strong>Pourquoi&nbsp;:</strong> comprendre les besoins avant de construire
            l’application. Il s’ouvre après l’inscription, et tu peux le passer.
          </li>
          <li>
            <strong>Ce qui est envoyé&nbsp;:</strong> tes cinq réponses, les précisions que tu écris
            toi-même dans les champs libres, et le prénom et l’adresse électronique laissés juste
            avant.
          </li>
          <li>
            <strong>Combien de temps&nbsp;:</strong> aucune durée n’est arrêtée à ce jour.
          </li>
        </ul>
      </Collect>

      <Collect>
        <strong>3. Les questions posées à l’assistant</strong>
        <ul>
          <li>
            <strong>Pourquoi&nbsp;:</strong> quand l’assistant du site n’a pas de réponse, ta
            question nous est transmise, pour compléter la FAQ.
          </li>
          <li>
            <strong>Ce qui est envoyé&nbsp;:</strong> le texte de ta question et l’adresse de la
            page où tu l’as posée. Rien d’autre, et seulement dans ce cas-là.
          </li>
          <li>
            <strong>Combien de temps&nbsp;:</strong> aucune durée n’est arrêtée à ce jour.
          </li>
        </ul>
      </Collect>

      <Collect>
        <strong>4. Le formulaire de contact</strong>
        <ul>
          <li>
            <strong>Pourquoi&nbsp;:</strong> te répondre.
          </li>
          <li>
            <strong>Ce qui est envoyé&nbsp;:</strong> ton e-mail et ta question.
          </li>
          <li>
            <strong>Combien de temps&nbsp;:</strong> À compléter.
          </li>
        </ul>
      </Collect>

      <ToFill>
        <ul>
          <li>La durée de conservation des réponses au questionnaire</li>
          <li>La durée de conservation des questions posées à l’assistant</li>
          <li>La durée de conservation des messages du formulaire de contact</li>
          <li>La base juridique de ces trois collectes, à faire valider par notre conseil</li>
        </ul>
      </ToFill>

      <h3>Aucun cookie, aucun traceur</h3>
      <p>
        Ce site ne dépose aucun cookie, n’utilise aucun outil de mesure d’audience et aucun pixel
        publicitaire.
      </p>
      <p>
        Une seule chose est écrite dans la mémoire de ton navigateur. Quand tu fermes la bulle de
        l’assistant, le site enregistre la clé{' '}
        <strong className={cs.nowrap}>aide-bulle-fermee</strong> dans le stockage de session, pour
        garder la trace de ce refus pendant ta visite. Elle disparaît quand tu fermes l’onglet. Rien
        n’est envoyé ailleurs, et elle ne sert à aucune mesure d’audience.
      </p>
      <p>
        Ce site n’affiche pas de bandeau de consentement aujourd’hui. Ce point est en cours de
        relecture par notre conseil, et cette page sera mise à jour selon sa réponse.
      </p>

      <h3>Les services extérieurs que la page appelle</h3>
      <ul>
        <li>
          <strong>Netlify</strong> (hébergement et formulaires). Comme tout hébergeur, il voit ton
          adresse IP dans ses journaux techniques.
        </li>
        <li>
          Les polices de caractères, elles, sont servies par notre propre hébergeur&nbsp;: aucune
          donnée ne part chez Google.
        </li>
      </ul>

      <h3>Les données de l’application</h3>
      <p>
        L’application TilliT n’est pas encore sortie. Les traitements qu’elle mettra en œuvre
        (identité, prêts, échéanciers, reconnaissances de dette) feront l’objet de leur propre
        information, dans l’application. Ce qui est écrit ici ne concerne que ce site.
      </p>

      <h3>Tes droits</h3>
      <p>
        Tu peux à tout moment demander à consulter tes données, les corriger, les faire effacer, en
        obtenir une copie, ou retirer ton consentement. Chaque message que nous t’enverrons
        comportera un lien de désinscription en un clic.
      </p>
      <ToFill>
        <ul>
          <li>
            Le nom du responsable de traitement (la personne ou la société qui décide de la
            collecte)
          </li>
          <li>L’adresse électronique à laquelle exercer ces droits</li>
          <li>Un délégué à la protection des données, s’il y en a un de désigné</li>
        </ul>
      </ToFill>
      <p>
        Tu peux aussi saisir la CNIL, l’autorité française de contrôle&nbsp;:{' '}
        <External href="https://www.cnil.fr">cnil.fr</External>.
      </p>
    </>
  );
}

function Cookies() {
  return (
    <>
      <p className={cs.chapo}>
        Ce site ne dépose <strong>aucun cookie</strong>. Ni de mesure d’audience, ni de publicité,
        ni de préférence. Il écrit une seule chose dans la mémoire de ton navigateur, et la voici.
      </p>

      <h3>La seule chose écrite dans ton navigateur</h3>
      <p>
        Quand tu fermes la bulle de l’assistant, le site enregistre la clé{' '}
        <strong className={cs.nowrap}>aide-bulle-fermee</strong> dans le stockage de session, pour
        garder la trace de ce refus pendant ta visite. Elle disparaît quand tu fermes l’onglet. Rien
        n’est envoyé ailleurs, et elle ne sert à aucune mesure d’audience.
      </p>

      <h3>Le bandeau de consentement</h3>
      <p>
        Ce site n’en affiche pas aujourd’hui. Ce point est en cours de relecture par notre conseil,
        et cette page sera mise à jour selon sa réponse.
      </p>

      <h3>Ce que le site charge quand même</h3>
      <p>
        Charger une page demande toujours des fichiers à des serveurs, et un serveur voit l’adresse
        IP qui les demande. C’est le cas de notre hébergeur, qui sert aussi les polices de
        caractères. Aucun de ces appels ne dépose de cookie sur ta machine, mais ils ne sont pas
        invisibles pour autant, et il est plus honnête de le dire.
      </p>

      <h3>Le jour où cela changera</h3>
      <p>
        Si on ajoute un jour un outil de mesure d’audience, cette page sera mise à jour avant sa
        mise en service, et un vrai choix te sera proposé.
      </p>

      <SeeAlso
        links={[
          { to: '/confidentialite', label: 'Confidentialité' },
          { to: '/mentions-legales', label: 'Mentions légales' },
        ]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* English versions (verbatim from the English reference site).        */

function MentionsEn() {
  const l = useLocalize();
  return (
    <>
      <Translation to="/mentions-legales" title="Mentions légales" />

      <h3>The site's publisher</h3>
      <ToFill>
        <ul>
          <li>
            Raison sociale (company name) and forme juridique (legal form: SAS, SASU, SARL,
            entreprise individuelle and so on)
          </li>
          <li>Address of the registered office</li>
          <li>
            SIREN or SIRET number, and the town of the greffe (court registry) where it is
            registered
          </li>
          <li>Intra-Community VAT number (TVA intracommunautaire), if there is one</li>
          <li>Share capital (capital social), if the legal form has one</li>
          <li>Name of the directeur de la publication (publication director)</li>
          <li>Contact email address and telephone number</li>
        </ul>
        <p>
          These details are required for any site accessible to the public (article{' '}
          <span className={cs.nowrap}>1-1</span> of the loi du 21 juin 2004 pour la confiance dans
          l'économie numérique, the French law of 21 June 2004 on confidence in the digital
          economy).
        </p>
      </ToFill>

      <h3>The host</h3>
      <p>
        This site is hosted by <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200, San
        Francisco, CA 94107, United States. Website:{' '}
        <External href="https://www.netlify.com">netlify.com</External>.
      </p>
      <ToFill>
        <ul>
          <li>The host's telephone number</li>
        </ul>
      </ToFill>

      <h3>What TilliT is, and what it is not</h3>
      <p>
        TilliT is not a bank, a credit provider, a payment institution or a debt collection
        service. Money never passes through TilliT: the lender pays the money directly to the
        borrower, and repayments follow the same path. No interest is applied.
      </p>
      <p>
        TilliT helps reduce misunderstandings and oversights. It does not guarantee that a loan
        will be repaid, and will never claim to.
      </p>

      <h3>Intellectual property</h3>
      <p>
        The TilliT brand, its logo, the texts, the visual identity and the code of this site are
        protected. Any reproduction without prior written permission is prohibited.
      </p>
      <p>
        The illustration photographs come from Unsplash and Pexels and are used under the licence
        of those services.
      </p>

      <h3>Reporting a problem</h3>
      <p>
        For any question about this site or its content, write to us from the{' '}
        <Link to={l('/contact')}>contact page</Link>.
      </p>
    </>
  );
}

function ConditionsEn() {
  return (
    <>
      <Translation to="/conditions" title="Conditions d'utilisation" />

      <p className={cs.chapo}>
        This page covers the use of <strong>this site</strong>. The TilliT app has not been
        released yet, so its terms of use and of sale will be published with it, and accepted in
        the app.
      </p>

      <h3>What this site offers today</h3>
      <p>
        This site introduces TilliT, explains how a loan between friends or family can be
        organised, and lets you leave a first name and an email address to be notified at launch.
        It does not let you create a loan, sign a document or move money.
      </p>

      <h3>The value of what is written here</h3>
      <p>
        The legal and tax information presented on this site (the €1,500 threshold, article 1359
        of the Code civil, the French civil code, déclaration n°&nbsp;2062, the five-year
        limitation period, the eIDAS Regulation) is given as general information and reflects the
        state of the law at the date of writing. It is not legal or tax advice. Every situation is
        specific: for a decision that commits you, have your case checked by a professional.
      </p>

      <h3>What TilliT does not do</h3>
      <p>
        TilliT is not a bank, a credit provider, a payment institution or a debt collection
        service. Money never passes through TilliT. No interest is applied.{' '}
        <strong>TilliT does not guarantee that a loan will be repaid</strong>: it reduces the risk
        of misunderstanding, of oversight and of things left unsaid, which is not the same thing.
      </p>

      <h3>Availability</h3>
      <p>
        This site is provided as is. It may be changed, interrupted or unavailable, in particular
        during an update.
      </p>

      <h3>The site's content</h3>
      <p>
        The brand, the logo, the texts, the visual identity and the code are protected. You may
        quote a page and share a link to it; reproducing all or part of the site without written
        permission, on the other hand, is not.
      </p>

      <h3>Applicable law</h3>
      <p>These terms are subject to French law.</p>
      <ToFill>
        <ul>
          <li>
            The identity of the publishing company (it will also appear in the mentions légales,
            the legal notice)
          </li>
          <li>The email address for any complaint</li>
          <li>The date these terms come into force</li>
          <li>
            When the time comes: the conditions générales d'utilisation et de vente (general terms
            of use and of sale) of the app, in particular for the Zen plan
          </li>
        </ul>
      </ToFill>

      <SeeAlso
        links={[
          { to: '/mentions-legales', label: 'Legal notice' },
          { to: '/confidentialite', label: 'Privacy' },
          { to: '/cookies', label: 'Cookies' },
        ]}
      />
    </>
  );
}

function ConfidentialiteEn() {
  return (
    <>
      <Translation to="/confidentialite" title="Confidentialité" />

      <p className={cs.chapo}>
        This site collects data through four forms. None of it is required in order to read the
        site, and no advertising tracker follows you.
      </p>

      <h3>The data TilliT collects</h3>
      <p>
        Four collections take place on this site. Each one goes to the form service of our host,
        Netlify. None of them is necessary in order to read the site. The TilliT team has access
        to them, and Netlify as a technical sous-traitant (processor).
      </p>

      <Collect>
        <strong>1. The “Get notified at launch” form</strong>
        <ul>
          <li>
            <strong>Why:</strong> to let you know the day the app comes out.
          </li>
          <li>
            <strong>What is sent:</strong> your first name and your email address.
          </li>
          <li>
            <strong>On what basis:</strong> your consent, given by sending the form.
          </li>
          <li>
            <strong>For how long:</strong> three years at most from your sign-up, or from the last
            time you contacted us.
          </li>
        </ul>
      </Collect>

      <Collect>
        <strong>2. The five-question survey</strong>
        <ul>
          <li>
            <strong>Why:</strong> to understand what people need before building the app. It opens
            after you sign up, and you can skip it.
          </li>
          <li>
            <strong>What is sent:</strong> your five answers, the details you write yourself in the
            free-text fields, and the first name and email address left just before.
          </li>
          <li>
            <strong>For how long:</strong> no period has been set to date.
          </li>
        </ul>
      </Collect>

      <Collect>
        <strong>3. The questions asked of the assistant</strong>
        <ul>
          <li>
            <strong>Why:</strong> when the site's assistant has no answer, your question is passed
            on to us, to add to the FAQ.
          </li>
          <li>
            <strong>What is sent:</strong> the text of your question and the address of the page
            where you asked it. Nothing else, and only in that case.
          </li>
          <li>
            <strong>For how long:</strong> no period has been set to date.
          </li>
        </ul>
      </Collect>

      <Collect>
        <strong>4. The contact form</strong>
        <ul>
          <li>
            <strong>Why:</strong> to reply to you.
          </li>
          <li>
            <strong>What is sent:</strong> your email and your question.
          </li>
          <li>
            <strong>For how long:</strong> To be completed.
          </li>
        </ul>
      </Collect>

      <ToFill>
        <ul>
          <li>How long the survey answers are kept</li>
          <li>How long the questions asked of the assistant are kept</li>
          <li>How long the contact form messages are kept</li>
          <li>
            The legal basis for these three collections, to be validated by our legal counsel
          </li>
        </ul>
      </ToFill>

      <h3>No cookies, no trackers</h3>
      <p>This site sets no cookies, uses no analytics tool and no advertising pixel.</p>
      <p>
        One single thing is written in your browser's memory. When you close the assistant's
        bubble, the site records the key <strong className={cs.nowrap}>aide-bulle-fermee</strong>{' '}
        in session storage, to keep track of that refusal during your visit. It disappears when
        you close the tab. Nothing is sent anywhere, and it serves no analytics purpose.
      </p>
      <p>
        This site does not show a consent banner today. This point is being reviewed by our legal
        counsel, and this page will be updated according to their answer.
      </p>

      <h3>The outside services the page calls</h3>
      <ul>
        <li>
          <strong>Netlify</strong> (hosting and forms). Like any host, it sees your IP address in
          its technical logs.
        </li>
        <li>
          The fonts, for their part, are served by our own host: no data goes to Google.
        </li>
      </ul>

      <h3>The app's data</h3>
      <p>
        The TilliT app has not been released yet. The processing it will carry out (identity,
        loans, schedules, acknowledgements of debt, reconnaissances de dette) will be covered by
        its own information notice, in the app. What is written here concerns this site only.
      </p>

      <h3>Your rights</h3>
      <p>
        At any time you can ask to see your data, to correct it, to have it erased, to obtain a
        copy of it, or to withdraw your consent. Every message we send you will include a
        one-click unsubscribe link.
      </p>
      <ToFill>
        <ul>
          <li>
            The name of the responsable de traitement (data controller: the person or company that
            decides on the collection)
          </li>
          <li>The email address at which to exercise these rights</li>
          <li>
            A délégué à la protection des données (data protection officer), if one has been
            appointed
          </li>
        </ul>
      </ToFill>
      <p>
        You can also refer the matter to the CNIL, the French supervisory authority:{' '}
        <External href="https://www.cnil.fr">cnil.fr</External>.
      </p>
    </>
  );
}

function CookiesEn() {
  return (
    <>
      <Translation to="/cookies" title="Cookies" />

      <p className={cs.chapo}>
        This site sets <strong>no cookies</strong>. None for analytics, none for advertising, none
        for preferences. It writes one single thing in your browser's memory, and here it is.
      </p>

      <h3>The only thing written in your browser</h3>
      <p>
        When you close the assistant's bubble, the site records the key{' '}
        <strong className={cs.nowrap}>aide-bulle-fermee</strong> in session storage, to keep track
        of that refusal during your visit. It disappears when you close the tab. Nothing is sent
        anywhere, and it serves no analytics purpose.
      </p>

      <h3>The consent banner</h3>
      <p>
        This site does not show one today. This point is being reviewed by our legal counsel, and
        this page will be updated according to their answer.
      </p>

      <h3>What the site loads anyway</h3>
      <p>
        Loading a page always asks servers for files, and a server sees the IP address that asks
        for them. That is the case for our host, which also serves the fonts. None of these calls
        sets a cookie on your machine, but they are not invisible for all that, and it is more
        honest to say so.
      </p>

      <h3>The day this changes</h3>
      <p>
        If we ever add an analytics tool, this page will be updated before it goes into service,
        and you will be offered a real choice.
      </p>

      <SeeAlso
        links={[
          { to: '/confidentialite', label: 'Privacy' },
          { to: '/mentions-legales', label: 'Legal notice' },
        ]}
      />
    </>
  );
}

/** Picks the French or English text from the URL (/en/… pages). */
function bilingual(Fr: () => JSX.Element, En: () => JSX.Element) {
  return function LegalText() {
    return useLang() === 'en' ? <En /> : <Fr />;
  };
}

export const CONTENT: Record<LegalTab, () => JSX.Element> = {
  mentions: bilingual(Mentions, MentionsEn),
  conditions: bilingual(Conditions, ConditionsEn),
  confidentialite: bilingual(Confidentialite, ConfidentialiteEn),
  cookies: bilingual(Cookies, CookiesEn),
};
