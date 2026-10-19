// One optional fraud-measurement installation on public commercial pages.
// The vendor response is observed, never used to reject a family's enquiry.
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
  const panelAnchor = document.querySelector('[data-speech-measurement]');
  if (document.querySelector('script.ct_clicktrue_102663')) return;
  const state = window.__pinnacleCheq = {started:false,enabled:false,responses:0};
  const key = 'pinnacle-cheq-consent-v1', lifetime = 90 * 86400000;
  const blocked = () => navigator.globalPrivacyControl === true;
  const safeContext = () => {
    if (location.hash || new URL(location.href).searchParams.has('__pinnacle_no_query_parameter__')) return false;
    if (!document.referrer) return true;
    try {
      const ref = new URL(document.referrer);
      if (ref.hash || ref.username || ref.password || ref.protocol !== 'https:' || ref.searchParams.has('__pinnacle_no_query_parameter__')) return false;
      if (ref.hostname === location.hostname) return safePath(ref.pathname);
      return ['google.com','www.google.com','google.co.in','www.google.co.in','bing.com','www.bing.com','duckduckgo.com','www.duckduckgo.com','www.facebook.com','m.facebook.com','l.facebook.com','www.instagram.com','l.instagram.com','www.linkedin.com','t.co'].includes(ref.hostname);
    } catch { return false; }
  };
  const panel = document.querySelector('[data-cheq-preferences]');
  if(panel) panel.hidden=false;
  const status = panel?.querySelector('[data-cheq-status]');
  const tell = text => { if(status) status.textContent = text; };
  const clearCookies = () => {
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (!/^_cq_(?:duid|suid|tuid|session|pvid)$/.test(name)) continue;
      for (const domain of ['',location.hostname,'pinnacleblooms.org']) document.cookie = name+'=; Max-Age=0; Path=/;'+(domain?' Domain='+domain+';':'')+' SameSite=Lax; Secure';
    }
    for (const name of ['_cq_tuid','_cq_suid']) { try { sessionStorage.removeItem(name); } catch {} }
  };
  const choose = (value, persist = true) => {
    if (!['accepted','declined'].includes(value)) return;
    let saved = !persist;
    if (persist) try {localStorage.setItem(key,JSON.stringify({value,at:Date.now()}));saved = JSON.parse(localStorage.getItem(key))?.value === value;} catch {}
    if (value !== 'accepted' || blocked() || !saved || !safeContext()) {
      state.enabled = false; clearCookies();
      tell(blocked() ? 'Traffic measurement is off because Global Privacy Control is enabled.' : !safeContext() ? 'Traffic measurement stays off for this page context. Calling and enquiries still work.' : 'Traffic measurement is off. Calling and enquiries still work.');
      if (state.started && saved) location.reload();
      else if (state.started) tell('Close this page to finish stopping traffic measurement; this browser could not save your withdrawal.');
      return;
    }
    state.enabled = true;
    if (state.started) return;
    state.started = true;
    if (typeof window.onCheqResponse !== 'function') window.onCheqResponse = () => {if(state.enabled) state.responses++;};
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://ob.aseasky.link/i/00b2b59a2f9c3717e415ed4d55bb642f.js';
    script.className = 'ct_clicktrue_102663';
    script.dataset.ch = 'www.pinnacleblooms.org';
    script.dataset.jsonp = 'onCheqResponse';
    // The supplied tag's incQs allowlist applies to URL and referrer. A name
    // absent from both removes every query parameter; fragments are excluded above.
    script.setAttribute('data-include-qs','__pinnacle_no_query_parameter__');
    script.referrerPolicy = 'no-referrer';
    script.onerror = () => {state.enabled=false;tell('Traffic measurement is unavailable. Calling and enquiries still work.');};
    document.head.appendChild(script);
    tell('Optional traffic measurement is on. You can turn it off here.');
  };
  (panel?.querySelectorAll('[data-cheq-choice]') || []).forEach(button => {
    button.addEventListener('click',() => choose(button.dataset.cheqChoice));
    if (blocked() && button.dataset.cheqChoice === 'accepted') button.disabled = true;
  });
  let saved; try {saved=JSON.parse(localStorage.getItem(key));}catch{}
  if (saved && Number.isFinite(saved.at) && saved.at<=Date.now() && Date.now()-saved.at<lifetime) choose(saved.value,false);
  window.addEventListener('storage',event => {if(event.storageArea!==localStorage || event.key!==key || !state.enabled)return;let next;try{next=JSON.parse(event.newValue);}catch{}if(next?.value!=='accepted')choose('declined',false);});
  document.addEventListener('visibilitychange',() => {if(blocked()&&state.enabled)choose('declined');});
})();
