// Shared advertising call measurement for eligible public Pinnacle pages.
// There is no visitor choice gate: site-owner approved measurement starts once.
export const preferencesMarkup = '';

export function installAdCallMeasurement() {
  if (window.__pinnacleAdCallMeasurement) return;
  const hosts = new Set(['www.pinnacleblooms.org', 'pinnacleblooms.org']);
  const paths = new Set([
    '/',
    '/centers',
    '/autism-therapy',
    '/best-occupational-therapy-center-india-proven-improvement-rate',
    '/best-aba-therapy-center-india-proven-improvement-rate',
    '/best-special-education-center-call-9100181181',
    '/speech-aba-autism-assessments',
    '/enroll-autism-speech-aba-therapies-india',
    '/about-us',
    '/contact',
    '/top-speech-therapy-center-india-proven-improvement-rate',
    '/speech-therapy/service-information',
    '/verify/guides/everyday-practice.html',
    '/verify/guides/abilityscore.html',
    '/verify/evidence/pinnacle-paradigm-shift.html'
  ]);
  const publicAsk = /^\/ask(?:\/|$)/.test(location.pathname) &&
    !/^\/ask\/(?:te\/)?(?:account|auth|search|api)(?:\/|$)/.test(location.pathname);
  const publicCentre = /^\/centers\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/.test(location.pathname);
  const publicLegacy = document.body?.dataset?.pageVariant === 'legacy_knowledge' &&
    (/^\/(?:ma|t|b|c)\/[a-z0-9-]+\/?$/.test(location.pathname) || location.pathname === '/contact-national-autism-helpline-24-7');
  const reviewedPublicTemplate = document.body?.dataset?.pageVariant === 'legacy_public_template' &&
    ['/assessments/stuttering-assessment', '/certified-courses', '/certified-courses/'].includes(location.pathname);
  if (location.protocol !== 'https:' || !hosts.has(location.hostname) ||
      !(paths.has(location.pathname) || publicAsk || publicCentre || publicLegacy || reviewedPublicTemplate)) return;

  const state = window.__pinnacleAdCallMeasurement = {enabled: true, started: false};
  const id = 'AW-10810823199';
  const action = id + '/VNUcCMSy3YobEJ-kgKMo';
  const originalDisplay = '9100 181 181';
  const originals = new Map();
  let replacement = null;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!window.__pinnacleConsentDefaults) {
    window.__pinnacleConsentDefaults = true;
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'denied'
    });
  }
  window.gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'denied'
  });
  window.gtag('set', 'ads_data_redaction', false);

  const numberPattern = /(?:\+?91[\s-]*)?9100[\s-]*181[\s-]*181/g;
  const central = href => ['919100181181', '9100181181', '09100181181'].includes(
    String(href || '').replace(/^tel:/, '').replace(/[\s+().-]/g, '')
  );
  const apply = () => {
    if (!replacement) return;
    for (const link of document.querySelectorAll('a[href^="tel:"]')) {
      if (!originals.has(link)) {
        const href = link.getAttribute('href');
        if (!central(href)) continue;
        const text = [];
        const walk = document.createTreeWalker(link, 4);
        while (walk.nextNode()) text.push([walk.currentNode, walk.currentNode.nodeValue]);
        originals.set(link, {
          href,
          aria: link.getAttribute('aria-label'),
          marker: link.getAttribute('data-pinnacle-ad-call-target'),
          text
        });
      }
      const before = originals.get(link);
      link.setAttribute('href', 'tel:' + replacement.mobile);
      link.setAttribute('data-pinnacle-ad-call-target', 'central');
      if (before.aria) link.setAttribute('aria-label', before.aria.replace(numberPattern, replacement.formatted));
      for (const [node, text] of before.text) node.nodeValue = text.replace(numberPattern, replacement.formatted);
    }
  };
  const callback = (formatted, mobile) => {
    if (typeof formatted !== 'string' || !/^[+\d\s().-]{7,30}$/.test(formatted)) return;
    if (typeof mobile !== 'string' || !/^\+?[\d\s().-]{7,25}$/.test(mobile)) return;
    const dial = mobile.replace(/[\s().-]/g, '');
    if (!/^\+?\d{7,15}$/.test(dial)) return;
    replacement = {formatted, mobile: dial};
    apply();
  };
  const start = () => {
    if (state.started) return;
    state.started = true;
    window.gtag('js', new Date());
    window.gtag('config', action, {
      ...(publicLegacy || reviewedPublicTemplate ? {
        page_location: 'https://www.pinnacleblooms.org' + (reviewedPublicTemplate
          ? (['/certified-courses', '/certified-courses/'].includes(location.pathname) ? '/certified-courses' : '/speech-aba-autism-assessments')
          : '/legacy-knowledge'),
        page_title: reviewedPublicTemplate ? 'Pinnacle Public Information' : 'Pinnacle Knowledge Library',
        page_referrer: '',
        ignore_referrer: true
      } : {}),
      phone_conversion_number: originalDisplay,
      phone_conversion_callback: callback,
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    if (!document.querySelector('script[data-pinnacle-ad-call-loader]') &&
        !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      script.setAttribute('data-pinnacle-ad-call-loader', '');
      document.head.appendChild(script);
    }
    new MutationObserver(apply).observe(document.body, {childList: true, subtree: true});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') installAdCallMeasurement();
