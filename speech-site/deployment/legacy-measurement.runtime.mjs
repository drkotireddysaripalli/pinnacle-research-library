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
var PUBLIC_AD_CALL_PATH = "/pinnacle-pages-scripts/portal-ad-call-7f1663ac50806f5c.mjs";
var source = `// Shared advertising call measurement for eligible public Pinnacle pages.
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
  const publicAsk = /^\\/ask(?:\\/|$)/.test(location.pathname) &&
    !/^\\/ask\\/(?:te\\/)?(?:account|auth|search|api)(?:\\/|$)/.test(location.pathname);
  const publicCentre = /^\\/centers\\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/.test(location.pathname);
  const publicLegacy = document.body?.dataset?.pageVariant === 'legacy_knowledge' &&
    (/^\\/(?:ma|t|b|c)\\/[a-z0-9-]+\\/?$/.test(location.pathname) || location.pathname === '/contact-national-autism-helpline-24-7');
  const reviewedPublicTemplate = document.body?.dataset?.pageVariant === 'legacy_public_template' &&
    ['/assessments/stuttering-assessment', '/certified-courses', '/certified-courses/'].includes(location.pathname);
  const privatePath=/^\\/(?:account|auth|admin|api|internal|private|customer|customers|patient|patients|payroll|reports?|documents?|cart|checkout)(?:\\/|$)|^\\/(?:ask\\/(?:te\\/)?(?:account|auth|api|search)|shop\\/(?:cart|checkout)|books\\/download)(?:\\/|$)/i;
  if(location.protocol!=='https:'||!hosts.has(location.hostname)||privatePath.test(location.pathname))return;
  let qa=false;try{qa=new URL(location.href).searchParams.has('validation_test');if(qa)sessionStorage.setItem('pinnacle-validation-v1',String(Date.now()));else{const at=Number(sessionStorage.getItem('pinnacle-validation-v1'));qa=at>0&&at<=Date.now()&&Date.now()-at<86400000;}}catch{}
  if(qa)return;
  if(!window.__pinnacleProtectionContainer){
   window.__pinnacleProtectionContainer={status:'pending'};
   const script=document.createElement('script');script.type='module';script.id='pinnacle-protection-container';script.src='https://www.pinnacleblooms.org/pinnacle-pages-scripts/protection-consumer.mjs?v=protection-default-20261020';document.head.appendChild(script);
  }

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

  const numberPattern = /(?:\\+?91[\\s-]*)?9100[\\s-]*181[\\s-]*181/g;
  const central = href => ['919100181181', '9100181181', '09100181181'].includes(
    String(href || '').replace(/^tel:/, '').replace(/[\\s+().-]/g, '')
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
    if (typeof formatted !== 'string' || !/^[+\\d\\s().-]{7,30}$/.test(formatted)) return;
    if (typeof mobile !== 'string' || !/^\\+?[\\d\\s().-]{7,25}$/.test(mobile)) return;
    const dial = mobile.replace(/[\\s().-]/g, '');
    if (!/^\\+?\\d{7,15}$/.test(dial)) return;
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
`;
function servePublicAdCall(request) {
  const u = new URL(request.url);
  if (u.hostname !== "www.pinnacleblooms.org" || u.pathname !== PUBLIC_AD_CALL_PATH) return null;
  return new Response(["GET", "HEAD"].includes(request.method) && request.method !== "HEAD" ? source : null, { status: ["GET", "HEAD"].includes(request.method) ? 200 : 405, headers: { "access-control-allow-origin": "*", "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff", allow: "GET, HEAD" } });
}

// deployment/protection-csp.mjs
var origin = "https://www.pinnacleblooms.org";
var protect = "https://protect.pinnacleblooms.org";
var paths = /* @__PURE__ */ new Set(["/", "/centers", "/top-speech-therapy-center-india-proven-improvement-rate", "/best-occupational-therapy-center-india-proven-improvement-rate", "/best-aba-therapy-center-india-proven-improvement-rate", "/best-special-education-center-call-9100181181", "/autism-therapy", "/speech-aba-autism-assessments", "/enroll-autism-speech-aba-therapies-india", "/speech-therapy/service-information", "/speech-therapy/first-visit-guide", "/speech-therapy/teacher-observation-guide"]);
function publicProtectionTemplateRequest(request) {
  const u = new URL(request.url);
  return u.origin === origin && ["GET", "HEAD"].includes(request.method) && !request.headers.has("authorization") && !request.headers.has("range") && !u.searchParams.has("validation_test") && /^\/(?:m|skills)\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(u.pathname);
}
function protectionCsp(request, response) {
  const u = new URL(request.url);
  const cache = response.headers.get("cache-control") || "";
  const template = publicProtectionTemplateRequest(request);
  if (u.origin !== origin || !["GET", "HEAD"].includes(request.method) || request.headers.has("authorization") || request.headers.has("range") || response.status !== 200 || !response.headers.get("content-type")?.includes("text/html") || response.headers.has("set-cookie") || /private/i.test(cache) || template && /no-transform/i.test(cache) || !(paths.has(u.pathname) || /^\/centers\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/.test(u.pathname) || template)) return response;
  const policy = response.headers.get("content-security-policy");
  if (!policy) return response;
  let changed = false;
  const next = policy.split(";").map((part) => {
    const tokens = part.trim().split(/\s+/);
    if (!["script-src", "script-src-elem", "connect-src"].includes(tokens[0]) || tokens.includes("'none'") || tokens.includes(protect)) return part;
    changed = true;
    return part.trim() + " " + protect;
  }).join(";");
  if (!changed) return response;
  const h = new Headers(response.headers);
  h.set("content-security-policy", next);
  h.set("x-pinnacle-protection-csp", "existing-protect-origin-v1");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers: h });
}

// deployment/public-template-protection.mjs
var PUBLIC_TEMPLATE_PROTECTION_SOURCE = "/pinnacle-pages-scripts/protection-consumer.mjs?v=protection-default-20261020";
var marker = "existing-consumer-v1";
function repairPublicTemplateProtection(request, response) {
  if (!publicProtectionTemplateRequest(request) || request.method !== "GET" || response.status !== 200 || !response.body || response.headers.has("set-cookie") || !response.headers.get("content-type")?.includes("text/html") || /private|no-transform/i.test(response.headers.get("cache-control") || "") || response.headers.has("x-pinnacle-public-protection")) return response;
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest", "content-digest", "repr-digest"]) headers.delete(key);
  headers.set("x-pinnacle-public-protection", marker);
  let existing = false, nonce = "";
  const rewritten = new HTMLRewriter().on("head", { element(element) {
    element.onEndTag((end) => {
      if (existing) return;
      end.before('<script type="module" id="pinnacle-protection-container" data-pinnacle-public-protection="' + marker + '"' + (nonce ? ' nonce="' + nonce + '"' : "") + ' src="' + PUBLIC_TEMPLATE_PROTECTION_SOURCE + '"><\/script>', { html: true });
    });
  } }).on("head script", { element(element) {
    const value = element.getAttribute("nonce");
    if (!nonce && value && /^[A-Za-z0-9+/_=-]+$/.test(value)) nonce = value;
    if (element.getAttribute("id") === "pinnacle-protection-container") existing = true;
    try {
      const source2 = new URL(element.getAttribute("src") || "", request.url);
      if (source2.origin === new URL(request.url).origin && source2.pathname === "/pinnacle-pages-scripts/protection-consumer.mjs") existing = true;
    } catch {
    }
  } }).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
  return protectionCsp(request, rewritten);
}

// deployment/legacy-measurement.mjs
var serveLegacyMeasurementCall = servePublicAdCall;
var normal = (text) => text.replaceAll("\r\n", "\n").trim();
var fingerprints = new Set(LEGACY_TAGS.map(normal));
var replacements = new Map(LEGACY_TAG_REPLACEMENTS.map(([old, next]) => [normal(old), next]));
for (const old of replacements.keys()) fingerprints.add(old);
var tagPattern = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
var analyticsTag = (tag) => /googletagmanager|googleadservices|G-2BYLRLFRDJ|AW-10810823199|GTM-W9ZHX459|_googWcm/.test(tag);
var reviewedPublicTemplates = /* @__PURE__ */ new Set(["/assessments/stuttering-assessment", "/certified-courses", "/certified-courses/"]);
var managedPreferenceRoutes = /* @__PURE__ */ new Set(["/", "/centers", "/autism-therapy", "/best-occupational-therapy-center-india-proven-improvement-rate", "/best-aba-therapy-center-india-proven-improvement-rate", "/best-special-education-center-call-9100181181", "/speech-aba-autism-assessments", "/about-us", "/contact", "/top-speech-therapy-center-india-proven-improvement-rate"]);
var managedCentreRoute = /^\/centers\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/;
var removeBalanced = (html, tag, attribute) => {
  const open = new RegExp("<" + tag + "\\b[^>]*" + attribute + "[^>]*>", "i").exec(html);
  if (!open) return html;
  const token = new RegExp("<\\/?" + tag + "\\b[^>]*>", "gi");
  token.lastIndex = open.index;
  let depth = 0, match;
  while (match = token.exec(html)) {
    if (match[0][1] === "/") depth--;
    else depth++;
    if (depth === 0) return html.slice(0, open.index) + html.slice(token.lastIndex);
  }
  return html;
};
function projectManagedPreferenceHtml(html, request) {
  const u = new URL(request.url);
  if (request.method !== "GET" || u.origin !== "https://www.pinnacleblooms.org" || request.headers.has("authorization") || request.headers.has("range") || !managedPreferenceRoutes.has(u.pathname) && !managedCentreRoute.test(u.pathname)) return null;
  const canonical = /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i.exec(html)?.[1];
  let canonicalMatches = canonical === u.origin + u.pathname;
  if (u.pathname === "/") try {
    const parsed = new URL(canonical.replaceAll("&amp;", "&"));
    canonicalMatches = parsed.origin === u.origin && parsed.pathname === u.pathname && parsed.search === u.search && !parsed.hash;
  } catch {
    canonicalMatches = false;
  }
  if (!canonicalMatches) return null;
  let result = html;
  for (const attribute of [`(?:id=["']website-preferences["']|data-pinnacle-managed-preferences)`, "data-speech-measurement", "data-cheq-preferences", "data-ad-call-preferences"]) {
    let previous;
    do {
      previous = result;
      result = removeBalanced(result, "details", attribute);
    } while (result !== previous);
  }
  result = result.replace(/<section\b[^>]*data-(?:speech-measurement|cheq-preferences)[^>]*>[\s\S]*?<\/section>/gi, "");
  result = result.replace(/(<script\b[^>]*\bsrc=)(["'])([^"']+)\2/gi, (tag, prefix, quote, raw) => {
    try {
      const src = new URL(raw.replaceAll("&amp;", "&"), u);
      if (src.origin !== u.origin || src.pathname !== "/pinnacle-pages-scripts/speech-measurement.js") return tag;
      src.searchParams.set("v", "measurement-completion-20261020");
      return prefix + quote + (raw.startsWith("/") ? src.pathname + src.search : src.href).replaceAll("&", "&amp;") + quote;
    } catch {
      return tag;
    }
  });
  return result === html ? null : result;
}
async function projectManagedPreferences(request, response) {
  const u = new URL(request.url);
  if (request.method !== "GET" || u.origin !== "https://www.pinnacleblooms.org" || request.headers.has("authorization") || request.headers.has("range") || !managedPreferenceRoutes.has(u.pathname) && !managedCentreRoute.test(u.pathname)) return response;
  if (response.status !== 200 || !response.body || response.headers.has("set-cookie") || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  const html = await response.text(), projected = projectManagedPreferenceHtml(html, request);
  if (!projected) return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
  const headers = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest", "content-digest", "repr-digest"]) headers.delete(k);
  headers.set("x-pinnacle-measurement-ui", "removed-20261019");
  return new Response(projected, { status: response.status, statusText: response.statusText, headers });
}
var isKnownGtmLoader = (tag) => normal(tag) === normal(LEGACY_TAGS[0]);
function legacyMeasurementScope(request) {
  const u = new URL(request.url);
  if (u.origin !== "https://www.pinnacleblooms.org" || request.method !== "GET" || request.headers.has("range")) return null;
  if (/^\/(?:account|auth|admin|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(u.pathname)) return "private";
  if (reviewedPublicTemplates.has(u.pathname)) return "reviewed-public-template";
  if (/^\/(?:ma|t|b|c)\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(u.pathname)) return "knowledge";
  if (u.pathname === "/contact-national-autism-helpline-24-7") return "helpline";
  return null;
}
var earlyCapture = '(()=>{const queue=[];const validation=new URL(location.href).searchParams.has("validation_test");const listener=e=>{if(validation)return;const a=e.target?.closest?.("a[href]");if(!a||queue.length>=10)return;const href=a.getAttribute("href");if(href==="tel:+919100181181")queue.push("call");else{try{const u=new URL(href,location.origin);if((u.hostname==="wa.me"&&u.pathname==="/919100181181")||(u.hostname==="api.whatsapp.com"&&u.pathname==="/send"&&u.searchParams.get("phone")==="919100181181"))queue.push("whatsapp");}catch{}}};document.addEventListener("click",listener);window.__pinnacleLegacyCapture={queue,stop(){document.removeEventListener("click",listener);}};})();';
function taggedContactCanonicalMatches(canonical, requestUrl) {
  if (!canonical || !requestUrl.search) return false;
  try {
    const parsed = new URL(canonical.replaceAll("&amp;", "&"));
    if (parsed.origin !== requestUrl.origin || parsed.pathname !== requestUrl.pathname || parsed.hash) return false;
    const actual = [...requestUrl.searchParams].map(([key, value]) => [key.toLowerCase(), value.toLowerCase()]);
    const published = [...parsed.searchParams].map(([key, value]) => [key.toLowerCase(), value.toLowerCase()]);
    return actual.length === published.length && actual.every(([key, value], index) => published[index]?.[0] === key && published[index]?.[1] === value);
  } catch {
    return false;
  }
}
function migrateLegacyPrefix(prefix, request, { preserveGtm = false } = {}) {
  const scope = legacyMeasurementScope(request);
  if (!scope || prefix.includes("data-pinnacle-legacy-measurement")) return null;
  if (scope === "reviewed-public-template" && !preserveGtm) return null;
  preserveGtm = preserveGtm && scope === "reviewed-public-template";
  const tags = [...prefix.matchAll(tagPattern)].map((m) => m[0]).filter(analyticsTag);
  if (!tags.length || tags.some((tag) => !fingerprints.has(normal(tag)))) return null;
  if (scope !== "private") {
    const u = new URL(request.url), canonical = /\blink\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i.exec(prefix)?.[1];
    const canonicalMatches = canonical === u.origin + u.pathname || u.pathname === "/certified-courses/" && canonical === u.origin + "/certified-courses" || scope === "reviewed-public-template" && canonical?.replaceAll("&amp;", "&") === u.href || scope === "helpline" && taggedContactCanonicalMatches(canonical, u);
    if (!canonicalMatches || !tags.some((t) => t.includes("GTM-W9ZHX459")) || !tags.some((t) => t.includes("gtag('config', 'G-2BYLRLFRDJ')")) || !tags.some((t) => t.includes("'AW-10810823199/VNUcCMSy3YobEJ-kgKMo'"))) return null;
  }
  let result = prefix.replace(tagPattern, (tag) => analyticsTag(tag) ? preserveGtm && isKnownGtmLoader(tag) ? tag : replacements.get(normal(tag)) || "" : tag);
  if (scope === "private") return { scope, html: result, removed: tags.length };
  const controls = "";
  const inserted = (preserveGtm ? "" : '<script data-pinnacle-legacy-collector="early-v4">' + earlyCapture + "<\/script>") + '<script defer src="/pinnacle-pages-scripts/speech-measurement.js?v=measurement-completion-20261020"><\/script><script type="module" src="' + PUBLIC_AD_CALL_PATH + '"><\/script>';
  result = result.replace(/<body\b([^>]*)>/i, (_, attributes) => "<body" + attributes + ' data-page-variant="' + (preserveGtm ? "legacy_public_template" : "legacy_knowledge") + '" data-pinnacle-legacy-measurement="' + scope + '">' + inserted);
  return { scope, html: result, controls, preserveGtm, removed: tags.filter((tag) => !(preserveGtm && isKnownGtmLoader(tag))).length };
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
async function repairLegacyExclusions(request, response, { reviewedPublicTemplates: reviewedPublicTemplates2 = true } = {}) {
  response = repairPublicTemplateProtection(request, response);
  response = await projectManagedPreferences(request, response);
  const scope = legacyMeasurementScope(request);
  if (scope === "reviewed-public-template") return reviewedPublicTemplates2 ? repairLegacyMeasurement(request, response, { preserveGtm: true }) : response;
  if (scope !== "private" && (request.headers.has("authorization") || response.headers.has("set-cookie"))) return response;
  if (!scope || response.status !== 200 || !response.body || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  if (scope === "private") return repairLegacyMeasurement(request, response);
  const headers = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(k);
  headers.set("x-pinnacle-legacy-exclusion", "exact-noscript-only");
  return new Response(stripLegacyNoscript(response.body), { status: response.status, statusText: response.statusText, headers });
}
async function repairLegacyMeasurement(request, response, { preserveGtm = false } = {}) {
  const scope = legacyMeasurementScope(request);
  if (scope !== "private" && (request.headers.has("authorization") || response.headers.has("set-cookie"))) return response;
  if (!scope || response.status !== 200 || !response.body || response.headers.has("content-security-policy") || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  const reader = response.body.getReader(), decoder = new TextDecoder(), encoder = new TextEncoder(), chunks = [];
  let prefix = "", done = false;
  const completeContact = scope === "helpline" || scope === "reviewed-public-template", limit = completeContact ? 2097152 : 131072;
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
  const migrated = completeContact && !done ? null : migrateLegacyPrefix(prefix, request, { preserveGtm }), headers = new Headers(response.headers), pending = raw.subarray(encoder.encode(prefix).length);
  if (migrated) {
    for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(k);
    headers.set("x-pinnacle-legacy-measurement", migrated.scope);
    headers.set("x-pinnacle-removed-tag-count", String(migrated.removed));
  }
  const parts = migrated ? [encoder.encode(migrated.html), pending] : [raw];
  if (done) reader.releaseLock();
  let result = new Response(done ? migrated ? migrated.html : raw : resume(parts, reader), { status: response.status, statusText: response.statusText, headers });
  if (!migrated) return result;
  if (!migrated.preserveGtm) result = new Response(stripLegacyNoscript(result.body), { status: result.status, statusText: result.statusText, headers: result.headers });
  return new HTMLRewriter().on("body", { element(e) {
    if (migrated.controls) e.append(migrated.controls, { html: true });
  } }).on("iframe[src]", { element(e) {
    if (migrated.preserveGtm) return;
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
  projectManagedPreferenceHtml,
  repairLegacyExclusions,
  repairLegacyMeasurement,
  serveLegacyMeasurementCall,
  stripLegacyNoscript
};
