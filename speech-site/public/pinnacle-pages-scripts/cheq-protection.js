// One automatic fraud-measurement installation on eligible public commercial pages.
// The vendor response is observed, never used to reject or delay a family's enquiry.
(() => {
  if (window.__pinnacleCheq) return;
  const safePath = path => path === '/centers' || /^\/centers\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/.test(path) || [
    '/pinnacleai', '/top-speech-therapy-center-india-proven-improvement-rate',
    '/best-occupational-therapy-center-india-proven-improvement-rate',
    '/best-aba-therapy-center-india-proven-improvement-rate',
    '/autism-therapy',
    '/best-special-education-center-call-9100181181'
  ].includes(path);
  if (location.protocol !== 'https:' || location.hostname !== 'www.pinnacleblooms.org' || !safePath(location.pathname)) return;
  if (document.querySelector('script.ct_clicktrue_102663')) return;

  const state = window.__pinnacleCheq = {started:false, enabled:false, responses:0};
  let validationTraffic = new URL(location.href).searchParams.has('validation_test');
  try {
    if (validationTraffic) sessionStorage.setItem('pinnacle-validation-v1', String(Date.now()));
    else {
      const at = Number(sessionStorage.getItem('pinnacle-validation-v1'));
      validationTraffic = at > 0 && at <= Date.now() && Date.now() - at < 86400000;
    }
  } catch {}
  const safeContext = () => {
    if (validationTraffic || location.hash || new URL(location.href).searchParams.has('__pinnacle_no_query_parameter__')) return false;
    if (!document.referrer) return true;
    try {
      const ref = new URL(document.referrer);
      if (ref.hash || ref.username || ref.password || ref.protocol !== 'https:' || ref.searchParams.has('__pinnacle_no_query_parameter__')) return false;
      if (ref.hostname === location.hostname) return safePath(ref.pathname);
      return ['google.com','www.google.com','google.co.in','www.google.co.in','bing.com','www.bing.com','duckduckgo.com','www.duckduckgo.com','www.facebook.com','m.facebook.com','l.facebook.com','www.instagram.com','l.instagram.com','www.linkedin.com','t.co'].includes(ref.hostname);
    } catch { return false; }
  };
  if (!safeContext()) return;

  state.enabled = true;
  state.started = true;
  if (typeof window.onCheqResponse !== 'function') {
    window.onCheqResponse = () => { if (state.enabled) state.responses++; };
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://ob.aseasky.link/i/00b2b59a2f9c3717e415ed4d55bb642f.js';
  script.className = 'ct_clicktrue_102663';
  script.dataset.ch = 'www.pinnacleblooms.org';
  script.dataset.jsonp = 'onCheqResponse';
  // The supplied tag's incQs allowlist applies to URL and referrer. A name
  // absent from both removes every query parameter; fragments are excluded above.
  script.setAttribute('data-include-qs', '__pinnacle_no_query_parameter__');
  script.referrerPolicy = 'no-referrer';
  script.onerror = () => { state.enabled = false; };
  document.head.appendChild(script);
})();
