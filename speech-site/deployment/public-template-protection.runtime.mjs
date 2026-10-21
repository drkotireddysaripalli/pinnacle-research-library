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
      const source = new URL(element.getAttribute("src") || "", request.url);
      if (source.origin === new URL(request.url).origin && source.pathname === "/pinnacle-pages-scripts/protection-consumer.mjs") existing = true;
    } catch {
    }
  } }).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
  return protectionCsp(request, rewritten);
}
function withPublicTemplateProtection(original) {
  return { ...original, async fetch(request, env, ctx) {
    return repairPublicTemplateProtection(request, await original.fetch(request, env, ctx));
  } };
}
export {
  PUBLIC_TEMPLATE_PROTECTION_SOURCE,
  repairPublicTemplateProtection,
  withPublicTemplateProtection
};
