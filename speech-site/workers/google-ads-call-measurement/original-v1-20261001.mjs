var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.mjs
var GOOGLE_ADS_ID = "AW-10810823199";
var GOOGLE_ADS_LABEL = "VNUcCMSy3YobEJ-kgKMo";
var PHONE_NUMBER = "9100181181";
var BOOTSTRAP_PATH = "/pinnacle-pages-scripts/google-ads-call.js";
var MEASURED_PATHS = /* @__PURE__ */ new Set([
  "/top-speech-therapy-center-india-proven-improvement-rate",
  "/speech-therapy/service-information",
  "/verify/guides/everyday-practice.html",
  "/verify/guides/abilityscore.html",
  "/verify/evidence/pinnacle-paradigm-shift.html"
]);
var VERIFY_PATHS = /* @__PURE__ */ new Set([
  "/verify/guides/everyday-practice.html",
  "/verify/guides/abilityscore.html",
  "/verify/evidence/pinnacle-paradigm-shift.html"
]);
var BOOTSTRAP = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
gtag('config', '${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABEL}', {
  'phone_conversion_number': '${PHONE_NUMBER}'
});
`;
var LOADER_MARKUP = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}"><\/script>`;
var BOOTSTRAP_MARKUP = `<script src="https://www.pinnacleblooms.org${BOOTSTRAP_PATH}"><\/script>`;
var VERIFY_MOBILE_CTA_STYLE = `<style id="pinnacle-mobile-call-cta-style">.pinnacle-mobile-call-cta{display:none!important}@media(max-width:700px){.site-header>.pinnacle-mobile-call-cta{display:inline-flex!important;grid-column:1/-1;align-items:center;justify-content:center;justify-self:start;min-height:44px;padding:8px 16px;border-radius:999px;background:#c8102e;color:#fff;font:700 16px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;text-decoration:none}}</style>`;
var VERIFY_MOBILE_CTA_MARKUP = `<a class="pinnacle-mobile-call-cta" data-pinnacle-mobile-call-cta href="tel:+919100181181" aria-label="Call Pinnacle Blooms Network at 9100 181 181">Call 9100 181 181</a>`;
function augmentDirective(csp, directive, sources) {
  const parts = csp.split(";").map((part) => part.trim()).filter(Boolean);
  const index = parts.findIndex((part) => part === directive || part.startsWith(`${directive} `));
  if (index < 0) {
    parts.push(`${directive} ${sources.join(" ")}`);
  } else {
    const existing = new Set(parts[index].split(/\s+/));
    for (const source of sources) existing.add(source);
    parts[index] = [...existing].join(" ");
  }
  return `${parts.join("; ")};`;
}
__name(augmentDirective, "augmentDirective");
function augmentCsp(headers) {
  const csp = headers.get("content-security-policy");
  if (!csp) return;
  let next = augmentDirective(csp, "script-src", [
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://www.google.com",
    "https://www.gstatic.com",
    "https://googleads.g.doubleclick.net"
  ]);
  if (/(?:^|;)\s*script-src-elem(?:\s|;)/i.test(next)) {
    next = augmentDirective(next, "script-src-elem", [
      "https://www.googletagmanager.com",
      "https://www.googleadservices.com",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://googleads.g.doubleclick.net"
    ]);
  }
  next = augmentDirective(next, "img-src", [
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    "https://www.google.co.in"
  ]);
  next = augmentDirective(next, "connect-src", [
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    "https://pagead2.googlesyndication.com",
    "https://www.google.com",
    "https://www.google.co.in",
    "https://ad.doubleclick.net",
    "https://*.google-analytics.com"
  ]);
  next = augmentDirective(next, "frame-src", ["https://www.googletagmanager.com"]);
  headers.set("content-security-policy", next);
}
__name(augmentCsp, "augmentCsp");
async function addMeasurement(response, includeVerifyCta = false) {
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }
  let html = await response.text();
  const additions = [];
  if (!html.includes(`gtag/js?id=${GOOGLE_ADS_ID}`)) additions.push(LOADER_MARKUP);
  if (!html.includes(BOOTSTRAP_PATH) && !html.includes(`${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABEL}`)) {
    additions.push(BOOTSTRAP_MARKUP);
  }
  const addVerifyCta = includeVerifyCta && !html.includes("data-pinnacle-mobile-call-cta");
  if (additions.length === 0 && !addVerifyCta) return new Response(html, response);
  if (addVerifyCta && !html.includes('id="pinnacle-mobile-call-cta-style"')) {
    additions.push(VERIFY_MOBILE_CTA_STYLE);
  }
  const markup = additions.join("");
  if (/<\/head\s*>/i.test(html)) html = html.replace(/<\/head\s*>/i, `${markup}</head>`);
  else html = `${markup}${html}`;
  if (addVerifyCta) {
    if (/<\/header\s*>/i.test(html)) {
      html = html.replace(/<\/header\s*>/i, `${VERIFY_MOBILE_CTA_MARKUP}</header>`);
    } else if (/<body(?:\s[^>]*)?>/i.test(html)) {
      html = html.replace(/<body(?:\s[^>]*)?>/i, (body) => `${body}${VERIFY_MOBILE_CTA_MARKUP}`);
    } else {
      html = `${VERIFY_MOBILE_CTA_MARKUP}${html}`;
    }
  }
  const headers = new Headers(response.headers);
  for (const name of [
    "content-length",
    "content-encoding",
    "etag",
    "last-modified",
    "content-md5",
    "digest",
    "content-digest",
    "repr-digest",
    "accept-ranges"
  ]) headers.delete(name);
  augmentCsp(headers);
  headers.set("x-pinnacle-google-ads-call-measurement", "v1");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
__name(addMeasurement, "addMeasurement");
var index_default = {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    if (incoming.pathname === BOOTSTRAP_PATH) {
      if (!["GET", "HEAD"].includes(request.method)) {
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "GET, HEAD", "cache-control": "no-store" }
        });
      }
      return new Response(request.method === "HEAD" ? null : BOOTSTRAP, {
        status: 200,
        headers: {
          "content-type": "text/javascript; charset=utf-8",
          "cache-control": "public, max-age=3600",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin"
        }
      });
    }
    const upstreamUrl = new URL(`${incoming.pathname}${incoming.search}`, "https://www.pinnacleblooms.org");
    const upstreamRequest = new Request(upstreamUrl, request);
    const response = await env.PINNACLE_VERIFY.fetch(upstreamRequest);
    if (request.method !== "GET" || !MEASURED_PATHS.has(incoming.pathname)) return response;
    return addMeasurement(response, VERIFY_PATHS.has(incoming.pathname));
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

