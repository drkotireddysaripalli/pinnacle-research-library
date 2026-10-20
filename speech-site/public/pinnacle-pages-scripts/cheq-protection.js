// One automatic fraud-measurement installation on eligible public commercial pages.
// The vendor response is observed, never used to reject or delay a family's enquiry.
(() => {
  if (window.__pinnacleCheq) return;
  const privatePath=/^\/(?:account|auth|admin|api|internal|private|customer|customers|patient|patients|payroll|reports?|documents?|cart|checkout)(?:\/|$)|^\/(?:ask\/(?:te\/)?(?:account|auth|api|search)|shop\/(?:cart|checkout)|books\/download)(?:\/|$)/i;
  if(location.protocol!=='https:'||!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(location.hostname)||privatePath.test(location.pathname))return;
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
  if (validationTraffic) return;

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
  script.onerror = () => { state.enabled = false; };
  document.head.appendChild(script);
})();
