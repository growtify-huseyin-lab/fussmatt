// Google Tag Manager + Consent Mode v2
// GTM container loads only when NEXT_PUBLIC_GTM_ID is set

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

/**
 * Consent Mode v2 default state — all denied until user interacts with banner.
 * This script MUST run before GTM container loads.
 */
export function getConsentModeDefaultScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'wait_for_update': 500
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'url_passthrough', true);
  `;
}

/**
 * GTM container snippet
 */
export function getGTMScript(gtmId: string): string {
  return `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
}

/**
 * GTM noscript iframe
 */
export function getGTMNoscript(gtmId: string): string {
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}

/**
 * Push consent update to dataLayer — called from CookieConsent component
 */
export function updateConsentMode(analytics: boolean, marketing: boolean): void {
  if (typeof window === "undefined") return;

  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];

  function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  }

  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });

  // Push event for GTM triggers
  w.dataLayer.push({
    event: "consent_update",
    analytics_consent: analytics,
    marketing_consent: marketing,
  });
}
