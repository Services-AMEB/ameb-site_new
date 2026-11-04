interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_TURNSTILE_SITEKEY?: string;
  readonly PUBLIC_ANALYTICS_SRC?: string;
  readonly PUBLIC_ANALYTICS_ID?: string;
  readonly PUBLIC_BOOKING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  umami?: { track: (name: string, data?: Record<string, string | number>) => void };
  plausible?: (name: string, options?: { props?: Record<string, string | number> }) => void;
  turnstile?: {
    render: (el: HTMLElement | string, options: Record<string, unknown>) => string;
    reset: (id?: string) => void;
    getResponse: (id?: string) => string | undefined;
  };
}
