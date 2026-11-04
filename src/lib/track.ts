/**
 * Événements d'analytics sans témoins (Umami ou Plausible).
 * Ne fait rien si PUBLIC_ANALYTICS_SRC est vide.
 */
export type TrackEvent =
  | 'cta_diagnostic'
  | 'form_diagnostic_submit'
  | 'booking_click'
  | 'calc_complete'
  | 'quiz_complete'
  | 'report_request'
  | 'lang_switch'
  | 'case_view'
  | 'tel_click'
  | 'email_click';

const ENABLED = Boolean(import.meta.env.PUBLIC_ANALYTICS_SRC);

export function track(name: TrackEvent, props?: Record<string, string | number>): void {
  if (!ENABLED || typeof window === 'undefined') return;
  try {
    if (window.umami) window.umami.track(name, props);
    else if (window.plausible) window.plausible(name, props ? { props } : undefined);
  } catch {
    /* l'analytics ne doit jamais casser la page */
  }
}

/** Suivi délégué : clics sur [data-track], liens tel:, mailto: et prise de rendez-vous. */
export function initTracking(): void {
  if (!ENABLED) return;
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('a, button, [data-track]');
    if (!el) return;
    const named = el.dataset.track as TrackEvent | undefined;
    if (named) {
      const placement = el.dataset.trackPlacement;
      track(named, placement ? { placement } : undefined);
      return;
    }
    const href = el.getAttribute('href') ?? '';
    if (href.startsWith('tel:')) track('tel_click');
    else if (href.startsWith('mailto:')) track('email_click');
  });
}
