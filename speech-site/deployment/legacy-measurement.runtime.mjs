// deployment/legacy-measurement-fingerprints.mjs
var LEGACY_TAGS = ["<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\r\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\r\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\r\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\r\n})(window,document,'script','dataLayer','GTM-W9ZHX459');<\/script>", '<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"><\/script>', "<script>\r\n        window.dataLayer = window.dataLayer || [];\r\n        function gtag() { dataLayer.push(arguments); }\r\n        gtag('js', new Date());\r\n\r\n        gtag('config', 'AW-10810823199');\r\n    <\/script>", "<script>\r\n        window.dataLayer = window.dataLayer || [];\r\n        function gtag() { dataLayer.push(arguments); }\r\n        gtag('js', new Date());\r\n\r\n        gtag('config', 'G-2BYLRLFRDJ');\r\n\r\n        /**/<\/script>", "<script>\r\n  gtag('config', 'AW-10810823199/VNUcCMSy3YobEJ-kgKMo', {\r\n    'phone_conversion_number': '9100181181'\r\n  });\r\n<\/script>", '<script data-cfasync="false" async src="https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ"><\/script>'];
var LEGACY_NOSCRIPT_TAGS = ['<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W9ZHX459"\r\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'];
var LEGACY_TAG_REPLACEMENTS = [[`<script>\r
        // document.addEventListener('DOMContentLoaded', function () {\r
        setTimeout(function () {\r
            try {\r
                console.log("done");\r
\r
\r
                let gtagScript = document.createElement('script');\r
                gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ";\r
                gtagScript.async = true;\r
				gtagScript.setAttribute("data-cfasync", "false"); // \u2705 important\r
                document.head.appendChild(gtagScript);\r
\r
                gtagScript.onload = function () {\r
                    window.dataLayer = window.dataLayer || [];\r
                    function gtag() { dataLayer.push(arguments); }\r
                    gtag('js', new Date());\r
                    gtag('config', 'G-2BYLRLFRDJ');\r
                    gtag('config', 'AW-10810823199');\r
					gtag('config', 'AW-10810823199/VNUcCMSy3YobEJ-kgKMo', {\r
    'phone_conversion_number': '9100181181'\r
  });\r
                };\r
\r
				\r
\r
\r
                // loadjscssfile('https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ', "js", false);\r
                // window.dataLayer = window.dataLayer || [];\r
                // function gtag() { dataLayer.push(arguments); }\r
                // gtag('js', new Date());\r
\r
                // gtag('config', 'G-2BYLRLFRDJ');\r
                //gtag('config', 'AW-10810823199');\r
            }\r
            catch (e) {\r
                console.log(e);\r
            }\r
            try {\r
                loadjscssfile('https://kit.fontawesome.com/f61cb0b5c9.js', "js", false);\r
            }\r
            catch (e) {\r
                console.log(e);\r
            }\r
\r
            setTimeout(function () {\r
                try {\r
                    loadjscssfile('//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js', "js", false);\r
                }\r
                catch (e) {\r
                }\r
            }, 6000);\r
\r
        }, 4000);\r
    <\/script>`, `<script>\r
        // document.addEventListener('DOMContentLoaded', function () {\r
        setTimeout(function () {\r
            try {\r
                loadjscssfile('https://kit.fontawesome.com/f61cb0b5c9.js', "js", false);\r
            }\r
            catch (e) {\r
                console.log(e);\r
            }\r
\r
            setTimeout(function () {\r
                try {\r
                    loadjscssfile('//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js', "js", false);\r
                }\r
                catch (e) {\r
                }\r
            }, 6000);\r
\r
        }, 4000);\r
    <\/script>`]];

// deployment/public-ad-call.mjs
var PUBLIC_AD_CALL_PATH = "/pinnacle-pages-scripts/portal-ad-call-1b357bec67c18321.mjs";
var publicAdCallMarkup = '<details class="measurement-settings portal-measurement" data-ad-call-preferences hidden style="box-sizing:border-box;max-width:100%;padding:16px;margin-bottom:88px;border:1px solid #d9bfd6;border-radius:8px;background:#fff;color:#302638;font-size:14px;line-height:1.65;font-family:inherit"><summary style="min-height:44px;color:#652579;font-weight:700;cursor:pointer">Optional advertising call measurement</summary><p style="color:#302638;max-width:850px">With your permission, Google may use advertising cookies and temporarily show a forwarding number that connects to Pinnacle at 9100 181 181. This helps measure calls from our ads. Calling works without permission. This does not enable personalised advertising.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><button style="min-height:44px;padding:10px 16px;background:#fff;color:#652579;border:1px solid #652579;border-radius:6px;font:inherit;cursor:pointer" type="button" data-ad-call-choice="accepted">Allow call measurement</button><button style="min-height:44px;padding:10px 16px;background:#fff;color:#652579;border:1px solid #652579;border-radius:6px;font:inherit;cursor:pointer" type="button" data-ad-call-choice="declined">Keep call measurement off</button></div><p style="color:#302638" data-ad-call-status role="status">Advertising call measurement is off until you choose.</p></details>';
var source = `// Shared advertising call measurement. No advertising helper runs before opt-in.\r
export const preferencesMarkup = \`<details class="measurement-settings portal-measurement" data-ad-call-preferences hidden style="box-sizing:border-box;max-width:100%;padding:16px;margin-bottom:88px;border:1px solid #d9bfd6;border-radius:8px;background:#fff;color:#302638;font-size:14px;line-height:1.65;font-family:inherit"><summary style="min-height:44px;color:#652579;font-weight:700;cursor:pointer">Optional advertising call measurement</summary><p style="color:#302638;max-width:850px">With your permission, Google may use advertising cookies and temporarily show a forwarding number that connects to Pinnacle at 9100 181 181. This helps measure calls from our ads. Calling works without permission. This does not enable personalised advertising.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><button style="min-height:44px;padding:10px 16px;background:#fff;color:#652579;border:1px solid #652579;border-radius:6px;font:inherit;cursor:pointer" type="button" data-ad-call-choice="accepted">Allow call measurement</button><button style="min-height:44px;padding:10px 16px;background:#fff;color:#652579;border:1px solid #652579;border-radius:6px;font:inherit;cursor:pointer" type="button" data-ad-call-choice="declined">Keep call measurement off</button></div><p style="color:#302638" data-ad-call-status role="status">Advertising call measurement is off until you choose.</p></details>\`;\r
\r
// Keep this function self-contained: the existing wrapper can serve its body too.\r
export function installAdCallConsent() {\r
  if (window.__pinnacleAdCallConsent) return;\r
  const hosts = new Set(['www.pinnacleblooms.org', 'pinnacleblooms.org']);\r
  const paths = new Set([\r
    '/',\r
    '/centers',\r
    '/autism-therapy',\r
    '/best-occupational-therapy-center-india-proven-improvement-rate',\r
    '/best-aba-therapy-center-india-proven-improvement-rate',\r
    '/best-special-education-center-call-9100181181',\r
    '/speech-aba-autism-assessments',\r
    '/enroll-autism-speech-aba-therapies-india',\r
    '/about-us',\r
    '/contact',\r
    '/top-speech-therapy-center-india-proven-improvement-rate',\r
    '/speech-therapy/service-information',\r
    '/verify/guides/everyday-practice.html',\r
    '/verify/guides/abilityscore.html',\r
    '/verify/evidence/pinnacle-paradigm-shift.html'\r
  ]);\r
  const publicAsk = /^\\/ask(?:\\/|$)/.test(location.pathname) &&\r
    !/^\\/ask\\/(?:te\\/)?(?:account|auth|search|api)(?:\\/|$)/.test(location.pathname);\r
  const publicCentre = /^\\/centers\\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/.test(location.pathname);\r
  const publicLegacy=document.body?.dataset?.pageVariant==='legacy_knowledge'&&(/^\\/(?:ma|t|b|c)\\/[a-z0-9-]+\\/?$/.test(location.pathname)||location.pathname==='/contact-national-autism-helpline-24-7');\r
  if (location.protocol !== 'https:' || !hosts.has(location.hostname) ||\r
      !(paths.has(location.pathname) || publicAsk || publicCentre || publicLegacy)) return;\r
  const state = {enabled: false, started: false};\r
  window.__pinnacleAdCallConsent = state;\r
  const id = 'AW-10810823199';\r
  const action = id + '/VNUcCMSy3YobEJ-kgKMo';\r
  const key = 'pinnacle-ad-call-consent-v1';\r
  const withdrawnKey = key + '-withdrawn';\r
  const lifetime = 180 * 86400000;\r
  const originalDisplay = '9100 181 181';\r
  const originals = new Map();\r
  let replacement = null;\r
  const blocked = () => navigator.globalPrivacyControl === true;\r
  window.dataLayer = window.dataLayer || [];\r
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };\r
  if (!window.__pinnacleConsentDefaults) {\r
    window.__pinnacleConsentDefaults = true;\r
    window.gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});\r
  }\r
  window.gtag('set', 'ads_data_redaction', true);\r
  const numberPattern = /(?:\\+?91[\\s-]*)?9100[\\s-]*181[\\s-]*181/g;\r
  const central = href => ['919100181181','9100181181','09100181181'].includes(String(href || '').replace(/^tel:/, '').replace(/[\\s+().-]/g, ''));\r
  const restore = () => {\r
    replacement = null;\r
    for (const [link, before] of originals) {\r
      link.setAttribute('href', before.href);\r
      if (before.aria === null) link.removeAttribute('aria-label');\r
      else link.setAttribute('aria-label', before.aria);\r
      if (before.marker === null) link.removeAttribute('data-pinnacle-ad-call-target');\r
      else link.setAttribute('data-pinnacle-ad-call-target', before.marker);\r
      for (const [node, text] of before.text) node.nodeValue = text;\r
    }\r
    originals.clear();\r
  };\r
  const apply = () => {\r
    if (!state.enabled || blocked() || !replacement) return;\r
    for (const link of document.querySelectorAll('a[href^="tel:"]')) {\r
      if (!originals.has(link)) {\r
        const href = link.getAttribute('href');\r
        if (!central(href)) continue;\r
        const text = [];\r
        const walk = document.createTreeWalker(link, 4);\r
        while (walk.nextNode()) text.push([walk.currentNode, walk.currentNode.nodeValue]);\r
        originals.set(link, {href, aria: link.getAttribute('aria-label'), marker: link.getAttribute('data-pinnacle-ad-call-target'), text});\r
      }\r
      const before = originals.get(link);\r
      link.setAttribute('href', 'tel:' + replacement.mobile);\r
      link.setAttribute('data-pinnacle-ad-call-target', 'central');\r
      if (before.aria) link.setAttribute('aria-label', before.aria.replace(numberPattern, replacement.formatted));\r
      for (const [node, text] of before.text) node.nodeValue = text.replace(numberPattern, replacement.formatted);\r
    }\r
  };\r
  const callback = (formatted, mobile) => {\r
    if (!state.enabled || blocked()) return;\r
    if (typeof formatted !== 'string' || !/^[+\\d\\s().-]{7,30}$/.test(formatted)) return;\r
    if (typeof mobile !== 'string' || !/^\\+?[\\d\\s().-]{7,25}$/.test(mobile)) return;\r
    const dial = mobile.replace(/[\\s().-]/g, '');\r
    if (!/^\\+?\\d{7,15}$/.test(dial)) return;\r
    replacement = {formatted, mobile: dial};\r
    apply();\r
  };\r
  const clearOwnedCookies = () => {\r
    // Phone-conversion and this site's Google click-measurement cookies only.\r
    for (const raw of document.cookie.split(';')) {\r
      const name = raw.trim().split('=')[0];\r
      if (!/^(?:gwcc|_gcl_(?:aw|au|dc|gf|gs))$/.test(name)) continue;\r
      for (const domain of ['', location.hostname, 'pinnacleblooms.org']) {\r
        document.cookie = name + '=; Max-Age=0; Path=/;' + (domain ? ' Domain=' + domain + ';' : '') + ' SameSite=Lax; Secure';\r
      }\r
    }\r
  };\r
  const start = () => {\r
    state.enabled = true;\r
    window.gtag('consent', 'update', {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied'});\r
    if (state.started) return;\r
    state.started = true;\r
    window.gtag('js', new Date());\r
    window.gtag('config', action, {\r
      ...(publicLegacy?{page_location:'https://www.pinnacleblooms.org/legacy-knowledge',page_title:'Pinnacle Knowledge Library',page_referrer:'',ignore_referrer:true}:{}),\r
      phone_conversion_number: originalDisplay,\r
      phone_conversion_callback: callback,\r
      send_page_view: false,\r
      allow_google_signals: false,\r
      allow_ad_personalization_signals: false\r
    });\r
    if (!document.querySelector('script[data-pinnacle-ad-call-loader]') &&\r
        !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {\r
      const script = document.createElement('script');\r
      script.async = true;\r
      script.referrerPolicy = 'no-referrer';\r
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;\r
      script.setAttribute('data-pinnacle-ad-call-loader', '');\r
      document.head.appendChild(script);\r
    }\r
  };\r
  const init = () => {\r
    const panel = document.querySelector('[data-ad-call-preferences]');\r
    const status = document.querySelector('[data-ad-call-status]');\r
    if (!panel || !status) return; // No consent UI, no phone-helper configuration.\r
    panel.hidden = false;\r
    const choose = (value, persist = true) => {\r
      if (!['accepted', 'declined'].includes(value)) return;\r
      let accepted = value === 'accepted' && !blocked();\r
      let savedChoice = false;\r
      if (accepted) {\r
        // Require readable/writable storage so withdrawal can survive the reload.\r
        try {\r
          const probe = key + '-probe';\r
          sessionStorage.setItem(probe, '1');\r
          if (sessionStorage.getItem(probe) !== '1') throw new Error('Storage unavailable');\r
          sessionStorage.removeItem(probe);\r
          if (!persist && sessionStorage.getItem(withdrawnKey) === '1') throw new Error('Withdrawn');\r
          const choice = JSON.stringify({value: 'accepted', at: Date.now()});\r
          if (persist) localStorage.setItem(key, choice);\r
          // A cached grant also requires writable local storage, without extending expiry.\r
          else localStorage.setItem(key, localStorage.getItem(key));\r
          savedChoice = JSON.parse(localStorage.getItem(key))?.value === 'accepted';\r
          if (!savedChoice) throw new Error('Choice not saved');\r
          if (persist) sessionStorage.removeItem(withdrawnKey);\r
        } catch { accepted = false; }\r
      } else {\r
        if (persist || state.started) {\r
          try { sessionStorage.setItem(withdrawnKey, '1'); savedChoice = sessionStorage.getItem(withdrawnKey) === '1'; } catch {}\r
        }\r
        if (persist) {\r
          try {\r
            localStorage.removeItem(key);\r
            localStorage.setItem(key, JSON.stringify({value: 'declined', at: Date.now()}));\r
            savedChoice = savedChoice || JSON.parse(localStorage.getItem(key))?.value === 'declined';\r
          } catch {}\r
        }\r
        // Keep the tab-local fallback only when persistent denial could not be saved.\r
        // A later explicit choice in another tab must not be mistaken for a storage failure.\r
        try {\r
          if (JSON.parse(localStorage.getItem(key))?.value !== 'accepted') {\r
            savedChoice = true;\r
            sessionStorage.removeItem(withdrawnKey);\r
          }\r
        } catch {}\r
      }\r
      if (accepted) {\r
        start();\r
        status.textContent = 'Advertising call measurement is on. You can turn it off here at any time.';\r
      } else {\r
        state.enabled = false;\r
        window.gtag('consent', 'update', {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});\r
        restore(); clearOwnedCookies();\r
        status.textContent = blocked() ? 'Call measurement is off because Global Privacy Control is enabled.' :\r
          value === 'accepted' ? 'Call measurement stays off because this browser could not save your choice. Calling still works.' : 'Call measurement is off. Calling still works.';\r
        // Phone Call Conversions does not support Consent Mode. Unload its code.\r
        if (state.started && savedChoice) location.reload();\r
        else if (state.started) status.textContent = 'Close this page to finish stopping measurement; this browser could not save your withdrawal.';\r
      }\r
    };\r
    for (const button of panel.querySelectorAll('[data-ad-call-choice]')) {\r
      button.addEventListener('click', () => choose(button.dataset.adCallChoice));\r
      if (blocked() && button.dataset.adCallChoice === 'accepted') button.disabled = true;\r
    }\r
    let saved;\r
    try { saved = JSON.parse(localStorage.getItem(key)); } catch {}\r
    const valid = saved && Number.isFinite(saved.at) && saved.at <= Date.now() && Date.now() - saved.at < lifetime;\r
    if (blocked()) choose('declined');\r
    else if (valid) choose(saved.value, false);\r
    else choose('declined', false);\r
    new MutationObserver(apply).observe(document.body, {childList: true, subtree: true});\r
    document.addEventListener('visibilitychange', () => { if (blocked() && state.enabled) choose('declined'); });\r
    window.addEventListener('storage', event => {\r
      if (event.storageArea !== localStorage || (event.key !== key && event.key !== null) || !state.enabled) return;\r
      let next; try { next = JSON.parse(event.newValue); } catch {}\r
      if (!next || next.value !== 'accepted' || !Number.isFinite(next.at) || next.at > Date.now() || Date.now() - next.at >= lifetime) choose('declined', false);\r
    });\r
  };\r
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});\r
  else init();\r
}\r
\r
if (typeof window !== 'undefined' && typeof document !== 'undefined') installAdCallConsent();\r
`;
function servePublicAdCall(request) {
  const u = new URL(request.url);
  if (u.hostname !== "www.pinnacleblooms.org" || u.pathname !== PUBLIC_AD_CALL_PATH) return null;
  return new Response(["GET", "HEAD"].includes(request.method) && request.method !== "HEAD" ? source : null, { status: ["GET", "HEAD"].includes(request.method) ? 200 : 405, headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff", allow: "GET, HEAD" } });
}

// deployment/legacy-measurement.mjs
var serveLegacyMeasurementCall = servePublicAdCall;
var normal = (text) => text.replaceAll("\r\n", "\n").trim();
var fingerprints = new Set(LEGACY_TAGS.map(normal));
var replacements = new Map(LEGACY_TAG_REPLACEMENTS.map(([old, next]) => [normal(old), next]));
for (const old of replacements.keys()) fingerprints.add(old);
var tagPattern = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
var analyticsTag = (tag) => /googletagmanager|googleadservices|G-2BYLRLFRDJ|AW-10810823199|GTM-W9ZHX459|_googWcm/.test(tag);
function legacyMeasurementScope(request) {
  const u = new URL(request.url);
  if (u.origin !== "https://www.pinnacleblooms.org" || request.method !== "GET" || request.headers.has("range")) return null;
  if (/^\/(?:account|auth|admin|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(u.pathname)) return "private";
  if (/^\/(?:ma|t|b|c)\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(u.pathname)) return "knowledge";
  if (u.pathname === "/contact-national-autism-helpline-24-7") return "helpline";
  return null;
}
var panel = '<details class="measurement-settings" data-speech-measurement hidden style="box-sizing:border-box;flex:1;min-width:150px;padding:4px 12px;font-size:14px;color:#18233f"><summary style="min-height:44px;cursor:pointer">Optional analytics preferences</summary><p>With your permission, Google Analytics measures visits and contact clicks using a fixed knowledge-library identity. We exclude article paths, form details and link text. Calling works with analytics off.</p><button type="button" data-measurement-choice="accepted">Allow analytics</button><button type="button" data-measurement-choice="declined">Keep analytics off</button><p data-measurement-status role="status">Optional analytics is off until you choose.</p></details>';
var earlyCapture = '(()=>{const queue=[];const listener=e=>{if(navigator.globalPrivacyControl===true)return;let permission;try{permission=JSON.parse(localStorage.getItem("pinnacle-speech-analytics-v1"));}catch{return;}if(permission?.value!=="accepted"||!Number.isFinite(permission.at)||permission.at>Date.now()||Date.now()-permission.at>=180*86400000)return;const a=e.target?.closest?.("a[href]");if(!a||queue.length>=10)return;const href=a.getAttribute("href");if(href==="tel:+919100181181")queue.push("call");else{try{const u=new URL(href,location.origin);if((u.hostname==="wa.me"&&u.pathname==="/919100181181")||(u.hostname==="api.whatsapp.com"&&u.pathname==="/send"&&u.searchParams.get("phone")==="919100181181"))queue.push("whatsapp");}catch{}}};document.addEventListener("click",listener);window.__pinnacleLegacyCapture={queue,stop(){document.removeEventListener("click",listener);}};})();';
function migrateLegacyPrefix(prefix, request) {
  const scope = legacyMeasurementScope(request);
  if (!scope || prefix.includes("data-pinnacle-legacy-measurement")) return null;
  const tags = [...prefix.matchAll(tagPattern)].map((m) => m[0]).filter(analyticsTag);
  if (!tags.length || tags.some((tag) => !fingerprints.has(normal(tag)))) return null;
  if (scope !== "private") {
    const u = new URL(request.url), canonical = /\blink\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i.exec(prefix)?.[1];
    if (canonical !== u.origin + u.pathname || !tags.some((t) => t.includes("GTM-W9ZHX459")) || !tags.some((t) => t.includes("gtag('config', 'G-2BYLRLFRDJ')")) || !tags.some((t) => t.includes("'AW-10810823199/VNUcCMSy3YobEJ-kgKMo'"))) return null;
  }
  let result = prefix.replace(tagPattern, (tag) => analyticsTag(tag) ? replacements.get(normal(tag)) || "" : tag);
  if (scope === "private") return { scope, html: result, removed: tags.length };
  const controls = '<aside aria-label="Optional measurement preferences" style="display:flex;flex-wrap:wrap;align-items:start;background:#fff">' + panel + publicAdCallMarkup.replace("padding:16px", "flex:1;min-width:150px;padding:4px 12px").replace("margin-bottom:88px", "margin-bottom:0") + "</aside>";
  const inserted = '<script data-pinnacle-legacy-collector="early-v3">' + earlyCapture + '<\/script><script defer src="/pinnacle-pages-scripts/speech-measurement.js?v=legacy-cohorts-20261011-v3"><\/script><script type="module" src="' + PUBLIC_AD_CALL_PATH + '"><\/script>';
  result = result.replace(/<body\b([^>]*)>/i, (_, attributes) => "<body" + attributes + ' data-page-variant="legacy_knowledge" data-pinnacle-legacy-measurement="' + scope + '">' + inserted);
  return { scope, html: result, controls, removed: tags.length };
}
function resume(parts, reader) {
  return new ReadableStream({ start(c) {
    for (const part of parts) if (part.length) c.enqueue(part);
  }, async pull(c) {
    try {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        c.close();
      } else c.enqueue(value);
    } catch (e) {
      reader.releaseLock();
      c.error(e);
    }
  }, cancel(reason) {
    return reader.cancel(reason);
  } });
}
function stripLegacyNoscript(body) {
  const tokens = [...new Set(LEGACY_NOSCRIPT_TAGS.flatMap((t) => [t, t.replaceAll("\r\n", "\n")]))], keep = Math.max(...tokens.map((t) => t.length)) - 1, decoder = new TextDecoder(), encoder = new TextEncoder();
  let pending = "";
  return body.pipeThrough(new TransformStream({ transform(bytes, c) {
    pending += decoder.decode(bytes, { stream: true });
    for (const token of tokens) pending = pending.replaceAll(token, "");
    if (pending.length > keep) {
      c.enqueue(encoder.encode(pending.slice(0, -keep)));
      pending = pending.slice(-keep);
    }
  }, flush(c) {
    pending += decoder.decode();
    for (const token of tokens) pending = pending.replaceAll(token, "");
    c.enqueue(encoder.encode(pending));
  } }));
}
async function repairLegacyExclusions(request, response) {
  const scope = legacyMeasurementScope(request);
  if (scope !== "private" && (request.headers.has("authorization") || response.headers.has("set-cookie"))) return response;
  if (!scope || response.status !== 200 || !response.body || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  if (scope === "private") return repairLegacyMeasurement(request, response);
  const headers = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(k);
  headers.set("x-pinnacle-legacy-exclusion", "exact-noscript-only");
  return new Response(stripLegacyNoscript(response.body), { status: response.status, statusText: response.statusText, headers });
}
async function repairLegacyMeasurement(request, response) {
  const scope = legacyMeasurementScope(request);
  if (scope !== "private" && (request.headers.has("authorization") || response.headers.has("set-cookie"))) return response;
  if (!scope || response.status !== 200 || !response.body || response.headers.has("content-security-policy") || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  const reader = response.body.getReader(), decoder = new TextDecoder(), encoder = new TextEncoder(), chunks = [];
  let prefix = "", done = false;
  const completeContact = scope === "helpline", limit = completeContact ? 2097152 : 131072;
  let bytesRead = 0;
  while (bytesRead < limit && (completeContact || !/<body\b[^>]*>/i.test(prefix))) {
    const part = await reader.read();
    if (part.done) {
      done = true;
      break;
    }
    chunks.push(part.value);
    bytesRead += part.value.length;
    prefix += decoder.decode(part.value, { stream: true });
  }
  if (done) prefix += decoder.decode();
  const raw = new Uint8Array(chunks.reduce((n, b) => n + b.length, 0));
  let offset = 0;
  for (const part of chunks) {
    raw.set(part, offset);
    offset += part.length;
  }
  const migrated = completeContact && !done ? null : migrateLegacyPrefix(prefix, request), headers = new Headers(response.headers), pending = raw.subarray(encoder.encode(prefix).length);
  if (migrated) {
    for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(k);
    headers.set("x-pinnacle-legacy-measurement", migrated.scope);
    headers.set("x-pinnacle-removed-tag-count", String(migrated.removed));
  }
  const parts = migrated ? [encoder.encode(migrated.html), pending] : [raw];
  if (done) reader.releaseLock();
  let result = new Response(done ? migrated ? migrated.html : raw : resume(parts, reader), { status: response.status, statusText: response.statusText, headers });
  if (!migrated) return result;
  result = new Response(stripLegacyNoscript(result.body), { status: result.status, statusText: result.statusText, headers: result.headers });
  return new HTMLRewriter().on("body", { element(e) {
    if (migrated.controls) e.append(migrated.controls, { html: true });
  } }).on("iframe[src]", { element(e) {
    const src = e.getAttribute("src");
    try {
      const u = new URL(src, request.url);
      if (u.hostname === "www.googletagmanager.com" && u.pathname === "/ns.html" && u.searchParams.get("id") === "GTM-W9ZHX459") e.remove();
    } catch {
    }
  } }).on("a[href]", { element(e) {
    if (migrated.scope === "private") return;
    let u;
    try {
      u = new URL(e.getAttribute("href"), request.url);
    } catch {
      return;
    }
    if (u.protocol === "tel:" && /^\+?919100181181$|^9100181181$/.test(u.pathname.replace(/[ ()-]/g, ""))) {
      e.setAttribute("href", "tel:+919100181181");
      e.setAttribute("data-cta", "knowledge-call");
    }
    if (u.hostname === "wa.me" && u.pathname === "/919100181181" || u.hostname === "api.whatsapp.com" && u.pathname === "/send" && u.searchParams.get("phone") === "919100181181") e.setAttribute("data-cta", "knowledge-whatsapp");
  } }).transform(result);
}
export {
  legacyMeasurementScope,
  migrateLegacyPrefix,
  repairLegacyExclusions,
  repairLegacyMeasurement,
  serveLegacyMeasurementCall,
  stripLegacyNoscript
};
