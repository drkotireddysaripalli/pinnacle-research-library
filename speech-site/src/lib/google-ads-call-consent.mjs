// Shared advertising call measurement. No advertising helper runs before opt-in.
export const preferencesMarkup = `<details class="measurement-settings portal-measurement" data-ad-call-preferences hidden style="box-sizing:border-box;max-width:100%;padding:16px;margin-bottom:88px;border:1px solid #d9bfd6;border-radius:8px;background:#fff;color:#302638;font-size:14px;line-height:1.65;font-family:inherit"><summary style="min-height:44px;color:#652579;font-weight:700;cursor:pointer">Optional advertising call measurement</summary><p style="color:#302638;max-width:850px">With your permission, Google may use advertising cookies and temporarily show a forwarding number that connects to Pinnacle at 9100 181 181. This helps measure calls from our ads. Calling works without permission. This does not enable personalised advertising.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><button style="min-height:44px;padding:10px 16px;background:#fff;color:#652579;border:1px solid #652579;border-radius:6px;font:inherit;cursor:pointer" type="button" data-ad-call-choice="accepted">Allow call measurement</button><button style="min-height:44px;padding:10px 16px;background:#fff;color:#652579;border:1px solid #652579;border-radius:6px;font:inherit;cursor:pointer" type="button" data-ad-call-choice="declined">Keep call measurement off</button></div><p style="color:#302638" data-ad-call-status role="status">Advertising call measurement is off until you choose.</p></details>`;

// Keep this function self-contained: the existing wrapper can serve its body too.
export function installAdCallConsent() {
  if (window.__pinnacleAdCallConsent) return;
  const hosts = new Set(['www.pinnacleblooms.org', 'pinnacleblooms.org']);
  const paths = new Set([
    '/top-speech-therapy-center-india-proven-improvement-rate',
    '/speech-therapy/service-information',
    '/verify/guides/everyday-practice.html',
    '/verify/guides/abilityscore.html',
    '/verify/evidence/pinnacle-paradigm-shift.html'
  ]);
  const publicAsk = /^\/ask(?:\/|$)/.test(location.pathname) &&
    !/^\/ask\/(?:te\/)?(?:account|auth|search|api)(?:\/|$)/.test(location.pathname);
  if (location.protocol !== 'https:' || !hosts.has(location.hostname) ||
      !(paths.has(location.pathname) || publicAsk)) return;
  const state = {enabled: false, started: false};
  window.__pinnacleAdCallConsent = state;
  const id = 'AW-10810823199';
  const action = id + '/VNUcCMSy3YobEJ-kgKMo';
  const key = 'pinnacle-ad-call-consent-v1';
  const withdrawnKey = key + '-withdrawn';
  const lifetime = 180 * 86400000;
  const originalDisplay = '9100 181 181';
  const originals = new Map();
  let replacement = null;
  const blocked = () => navigator.globalPrivacyControl === true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!window.__pinnacleConsentDefaults) {
    window.__pinnacleConsentDefaults = true;
    window.gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
  }
  window.gtag('set', 'ads_data_redaction', true);
  const numberPattern = /(?:\+?91[\s-]*)?9100[\s-]*181[\s-]*181/g;
  const central = href => ['919100181181','9100181181','09100181181'].includes(String(href || '').replace(/^tel:/, '').replace(/[\s+().-]/g, ''));
  const restore = () => {
    replacement = null;
    for (const [link, before] of originals) {
      link.setAttribute('href', before.href);
      if (before.aria === null) link.removeAttribute('aria-label');
      else link.setAttribute('aria-label', before.aria);
      if (before.marker === null) link.removeAttribute('data-pinnacle-ad-call-target');
      else link.setAttribute('data-pinnacle-ad-call-target', before.marker);
      for (const [node, text] of before.text) node.nodeValue = text;
    }
    originals.clear();
  };
  const apply = () => {
    if (!state.enabled || blocked() || !replacement) return;
    for (const link of document.querySelectorAll('a[href^="tel:"]')) {
      if (!originals.has(link)) {
        const href = link.getAttribute('href');
        if (!central(href)) continue;
        const text = [];
        const walk = document.createTreeWalker(link, 4);
        while (walk.nextNode()) text.push([walk.currentNode, walk.currentNode.nodeValue]);
        originals.set(link, {href, aria: link.getAttribute('aria-label'), marker: link.getAttribute('data-pinnacle-ad-call-target'), text});
      }
      const before = originals.get(link);
      link.setAttribute('href', 'tel:' + replacement.mobile);
      link.setAttribute('data-pinnacle-ad-call-target', 'central');
      if (before.aria) link.setAttribute('aria-label', before.aria.replace(numberPattern, replacement.formatted));
      for (const [node, text] of before.text) node.nodeValue = text.replace(numberPattern, replacement.formatted);
    }
  };
  const callback = (formatted, mobile) => {
    if (!state.enabled || blocked()) return;
    if (typeof formatted !== 'string' || !/^[+\d\s().-]{7,30}$/.test(formatted)) return;
    if (typeof mobile !== 'string' || !/^\+?[\d\s().-]{7,25}$/.test(mobile)) return;
    const dial = mobile.replace(/[\s().-]/g, '');
    if (!/^\+?\d{7,15}$/.test(dial)) return;
    replacement = {formatted, mobile: dial};
    apply();
  };
  const clearOwnedCookies = () => {
    // Phone-conversion and this site's Google click-measurement cookies only.
    for (const raw of document.cookie.split(';')) {
      const name = raw.trim().split('=')[0];
      if (!/^(?:gwcc|_gcl_(?:aw|au|dc|gf|gs))$/.test(name)) continue;
      for (const domain of ['', location.hostname, 'pinnacleblooms.org']) {
        document.cookie = name + '=; Max-Age=0; Path=/;' + (domain ? ' Domain=' + domain + ';' : '') + ' SameSite=Lax; Secure';
      }
    }
  };
  const start = () => {
    state.enabled = true;
    window.gtag('consent', 'update', {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied'});
    if (state.started) return;
    state.started = true;
    window.gtag('js', new Date());
    window.gtag('config', action, {
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
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      script.setAttribute('data-pinnacle-ad-call-loader', '');
      document.head.appendChild(script);
    }
  };
  const init = () => {
    const panel = document.querySelector('[data-ad-call-preferences]');
    const status = document.querySelector('[data-ad-call-status]');
    if (!panel || !status) return; // No consent UI, no phone-helper configuration.
    panel.hidden = false;
    const choose = (value, persist = true) => {
      if (!['accepted', 'declined'].includes(value)) return;
      let accepted = value === 'accepted' && !blocked();
      let savedChoice = false;
      if (accepted) {
        // Require readable/writable storage so withdrawal can survive the reload.
        try {
          const probe = key + '-probe';
          sessionStorage.setItem(probe, '1');
          if (sessionStorage.getItem(probe) !== '1') throw new Error('Storage unavailable');
          sessionStorage.removeItem(probe);
          if (!persist && sessionStorage.getItem(withdrawnKey) === '1') throw new Error('Withdrawn');
          const choice = JSON.stringify({value: 'accepted', at: Date.now()});
          if (persist) localStorage.setItem(key, choice);
          // A cached grant also requires writable local storage, without extending expiry.
          else localStorage.setItem(key, localStorage.getItem(key));
          savedChoice = JSON.parse(localStorage.getItem(key))?.value === 'accepted';
          if (!savedChoice) throw new Error('Choice not saved');
          if (persist) sessionStorage.removeItem(withdrawnKey);
        } catch { accepted = false; }
      } else {
        if (persist || state.started) {
          try { sessionStorage.setItem(withdrawnKey, '1'); savedChoice = sessionStorage.getItem(withdrawnKey) === '1'; } catch {}
        }
        if (persist) {
          try {
            localStorage.removeItem(key);
            localStorage.setItem(key, JSON.stringify({value: 'declined', at: Date.now()}));
            savedChoice = savedChoice || JSON.parse(localStorage.getItem(key))?.value === 'declined';
          } catch {}
        }
        // Keep the tab-local fallback only when persistent denial could not be saved.
        // A later explicit choice in another tab must not be mistaken for a storage failure.
        try {
          if (JSON.parse(localStorage.getItem(key))?.value !== 'accepted') {
            savedChoice = true;
            sessionStorage.removeItem(withdrawnKey);
          }
        } catch {}
      }
      if (accepted) {
        start();
        status.textContent = 'Advertising call measurement is on. You can turn it off here at any time.';
      } else {
        state.enabled = false;
        window.gtag('consent', 'update', {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
        restore(); clearOwnedCookies();
        status.textContent = blocked() ? 'Call measurement is off because Global Privacy Control is enabled.' :
          value === 'accepted' ? 'Call measurement stays off because this browser could not save your choice. Calling still works.' : 'Call measurement is off. Calling still works.';
        // Phone Call Conversions does not support Consent Mode. Unload its code.
        if (state.started && savedChoice) location.reload();
        else if (state.started) status.textContent = 'Close this page to finish stopping measurement; this browser could not save your withdrawal.';
      }
    };
    for (const button of panel.querySelectorAll('[data-ad-call-choice]')) {
      button.addEventListener('click', () => choose(button.dataset.adCallChoice));
      if (blocked() && button.dataset.adCallChoice === 'accepted') button.disabled = true;
    }
    let saved;
    try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
    const valid = saved && Number.isFinite(saved.at) && saved.at <= Date.now() && Date.now() - saved.at < lifetime;
    if (blocked()) choose('declined');
    else if (valid) choose(saved.value, false);
    else choose('declined', false);
    new MutationObserver(apply).observe(document.body, {childList: true, subtree: true});
    document.addEventListener('visibilitychange', () => { if (blocked() && state.enabled) choose('declined'); });
    window.addEventListener('storage', event => {
      if (event.storageArea !== localStorage || (event.key !== key && event.key !== null) || !state.enabled) return;
      let next; try { next = JSON.parse(event.newValue); } catch {}
      if (!next || next.value !== 'accepted' || !Number.isFinite(next.at) || next.at > Date.now() || Date.now() - next.at >= lifetime) choose('declined', false);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') installAdCallConsent();
