const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let initialized = false;
let lastPageView: string | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initializeAnalytics(): void {
  if (!measurementId || initialized || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag('js', new Date());
  // Route changes are tracked manually to avoid duplicate SPA page views.
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.appendChild(script);
  initialized = true;
}

export function trackPageView(path: string, title: string): void {
  if (!measurementId || !window.gtag || lastPageView === path) return;
  lastPageView = path;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title,
  });
}

export function trackEvent(name: 'contact_form_submit' | 'cv_download'): void {
  if (!measurementId || !window.gtag) return;
  window.gtag('event', name);
}
