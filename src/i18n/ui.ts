/**
 * Chaînes d'interface (FR d'abord, EN équivalent).
 * Le type exige la même clé dans les deux langues.
 */
import type { Lang } from './routes';
import { typo } from '../lib/typo';

const fr = {
  'meta.siteName': 'ameb',
  'meta.titleSuffix': ' | ameb',
  'meta.defaultDescription':
    'ameb analyse votre façon de travailler, puis choisit ce qui vous convient : vos outils actuels, une intégration ou du développement sur mesure. Montréal.',

  'a11y.skip': 'Aller au contenu principal',
  'a11y.homeLabel': 'ameb — accueil',
  'a11y.mainNav': 'Navigation principale',
  'a11y.mobileNav': 'Navigation mobile',
  'a11y.footerNav': 'Navigation du pied de page',
  'a11y.breadcrumb': 'Fil d’Ariane',
  'a11y.openMenu': 'Ouvrir le menu',
  'a11y.closeMenu': 'Fermer le menu',
  'a11y.menuTitle': 'Menu',
  'a11y.newTab': '(s’ouvre dans un nouvel onglet)',
  'a11y.themeDark': 'Activer le mode sombre',
  'a11y.themeLight': 'Revenir au mode clair',
  'a11y.panel': 'Démonstration animée : des outils reliés et un journal d’actions automatiques, avec des données fictives',
  'a11y.vs': 'Un logiciel standard comparé à l’approche ameb',

  'nav.home': 'Accueil',
  'nav.methode': 'Méthode',
  'nav.services': 'Services',
  'nav.secteurs': 'Secteurs',
  'nav.diagnostic': 'Diagnostic',
  'nav.realisations': 'Réalisations',
  'nav.contact': 'Contact',

  'lang.switch': 'English',
  'lang.switchLabel': 'Read this page in English',

  'cta.diagnostic': 'Réserver mon diagnostic',
  'cta.contact': 'Nous écrire',
  'cta.booking': 'Prendre rendez-vous',
  'cta.learnMore': 'En savoir plus',

  'final.title': 'Prêt à savoir quoi automatiser en premier?',
  'final.note': 'Aucun jargon. Aucune pression. Une rencontre, puis un plan clair.',

  'footer.explore': 'Explorer',
  'footer.entreprise': 'Entreprise',
  'footer.legal': 'Légal',
  'footer.tagline': 'La technologie s’adapte à vous. Pas l’inverse.',
  'footer.legalName': 'Services AMEB inc.',
  'footer.city': 'Montréal (Québec)',
  'footer.address': 'Adresse : [À CONFIRMER]',
  'footer.rprp': 'Responsable de la protection des renseignements personnels',
  'footer.rprpValue': '[NOM, COURRIEL À CONFIRMER]',
  'footer.help': 'Besoin d’aide? Écrivez-nous',
  'footer.rights': 'Tous droits réservés.',
  'footer.langNote': '',
  'footer.privacy': 'Politique de confidentialité',
  'footer.accessibility': 'Accessibilité',
  'footer.legalNotice': 'Mentions légales',

  'common.toConfirm': '[À CONFIRMER]',
  'common.updated': 'Mis à jour le',
  'common.anonymized': 'Cas anonymisé à la demande du client.',

  'form.name': 'Nom',
  'form.email': 'Courriel',
  'form.organization': 'Organisation',
  'form.messageDiagnostic': 'Décrivez en une phrase ce qui vous fait perdre le plus de temps',
  'form.message': 'Votre message',
  'form.optional': '(facultatif)',
  'form.submit': 'Envoyer ma demande',
  'form.sending': 'Envoi en cours…',
  'form.success': 'Merci! Votre demande est bien reçue. On vous répond par courriel d’ici un jour ouvrable.',
  'form.error': 'L’envoi n’a pas fonctionné. Réessayez ou écrivez-nous directement.',
  'form.errorSummary': 'Veuillez corriger les champs signalés.',
  'form.errors.name': 'Indiquez votre nom.',
  'form.errors.email': 'Indiquez un courriel valide, par exemple nom@entreprise.ca.',
  'form.errors.organization': 'Indiquez le nom de votre organisation.',
  'form.errors.message': 'Décrivez votre besoin en une phrase ou plus.',
  'form.privacy': 'Vos renseignements servent uniquement à répondre à votre demande. Consultez notre',
  'form.privacyLink': 'politique de confidentialité',
  'form.noscript':
    'Ce formulaire a besoin de JavaScript pour la vérification anti-pourriel. Vous pouvez aussi nous écrire directement par courriel.',

  'calc.about': 'environ',
  'calc.to': 'à',
  'calc.formula': 'Ordre de grandeur : employés × heures par semaine × 48 semaines × coût horaire, arrondi.',

  'contact.phone': 'Téléphone',
  'contact.address': 'Adresse',
  'contact.hours': 'Heures',
} as const;

type Dict = Record<keyof typeof fr, string>;

const en: Dict = {
  'meta.siteName': 'ameb',
  'meta.titleSuffix': ' | ameb',
  'meta.defaultDescription':
    'ameb analyzes the way you work, then chooses what suits you: your current tools, an integration or custom development. Montréal.',

  'a11y.skip': 'Skip to main content',
  'a11y.homeLabel': 'ameb — home',
  'a11y.mainNav': 'Main navigation',
  'a11y.mobileNav': 'Mobile navigation',
  'a11y.footerNav': 'Footer navigation',
  'a11y.breadcrumb': 'Breadcrumb',
  'a11y.openMenu': 'Open menu',
  'a11y.closeMenu': 'Close menu',
  'a11y.menuTitle': 'Menu',
  'a11y.newTab': '(opens in a new tab)',
  'a11y.themeDark': 'Switch to dark mode',
  'a11y.themeLight': 'Back to light mode',
  'a11y.panel': 'Animated demonstration: connected tools and a log of automatic actions, with fictional data',
  'a11y.vs': 'A standard software package compared with the ameb approach',

  'nav.home': 'Home',
  'nav.methode': 'Method',
  'nav.services': 'Services',
  'nav.secteurs': 'Sectors',
  'nav.diagnostic': 'Diagnostic',
  'nav.realisations': 'Case studies',
  'nav.contact': 'Contact',

  'lang.switch': 'Français',
  'lang.switchLabel': 'Lire cette page en français',

  'cta.diagnostic': 'Book my diagnostic',
  'cta.contact': 'Write to us',
  'cta.booking': 'Book a meeting',
  'cta.learnMore': 'Learn more',

  'final.title': 'Ready to know what to automate first?',
  'final.note': 'No jargon. No pressure. One meeting, then a clear plan.',

  'footer.explore': 'Explore',
  'footer.entreprise': 'Company',
  'footer.legal': 'Legal',
  'footer.tagline': 'Technology adapts to you. Not the other way around.',
  'footer.legalName': 'Services AMEB inc.',
  'footer.city': 'Montréal (Québec)',
  'footer.address': 'Address: [TO BE CONFIRMED]',
  'footer.rprp': 'Person in charge of the protection of personal information',
  'footer.rprpValue': '[NAME, EMAIL TO BE CONFIRMED]',
  'footer.help': 'Need help? Write to us',
  'footer.rights': 'All rights reserved.',
  'footer.langNote': 'In case of discrepancy, the French version prevails.',
  'footer.privacy': 'Privacy policy',
  'footer.accessibility': 'Accessibility',
  'footer.legalNotice': 'Legal notice',

  'common.toConfirm': '[TO BE CONFIRMED]',
  'common.updated': 'Updated',
  'common.anonymized': 'Case anonymized at the client’s request.',

  'form.name': 'Name',
  'form.email': 'Email',
  'form.organization': 'Organization',
  'form.messageDiagnostic': 'Describe in one sentence what wastes the most time',
  'form.message': 'Your message',
  'form.optional': '(optional)',
  'form.submit': 'Send my request',
  'form.sending': 'Sending…',
  'form.success': 'Thank you! Your request has been received. We will reply by email within one business day.',
  'form.error': 'Sending failed. Please try again or email us directly.',
  'form.errorSummary': 'Please correct the highlighted fields.',
  'form.errors.name': 'Enter your name.',
  'form.errors.email': 'Enter a valid email, for example name@company.ca.',
  'form.errors.organization': 'Enter the name of your organization.',
  'form.errors.message': 'Describe your need in one sentence or more.',
  'form.privacy': 'Your information is used only to answer your request. See our',
  'form.privacyLink': 'privacy policy',
  'form.noscript': 'This form needs JavaScript for spam protection. You can also email us directly.',

  'calc.about': 'about',
  'calc.to': 'to',
  'calc.formula': 'Order of magnitude: employees × hours per week × 48 weeks × hourly cost, rounded.',

  'contact.phone': 'Phone',
  'contact.address': 'Address',
  'contact.hours': 'Hours',
};

export type UiKey = keyof typeof fr;

const DICTS: Record<Lang, Dict> = { fr, en };

/** Retourne une chaîne d'interface (typographie FR appliquée). */
export function t(lang: Lang, key: UiKey, vars?: Record<string, string | number>): string {
  let s = DICTS[lang][key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return typo(s, lang);
}
