// deployment/legacy-social-metadata/media.mjs
var BRAND_IMAGE = "https://www.pinnacleblooms.org/pinnacle-pages-assets/pinnacle-blooms-network-lockup.CUnZranx_Z2nTFgn.webp";
var missing = /* @__PURE__ */ new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
missing.add("/Assets/Materials/318.jpg");
for (const p of ["/Assets/AbilityScore_Universal_0-1000_Child%20Development_Metric.jpg", "/Assets/Materials/20707167545.jpg", "/Assets/Materials/962.jpg", "/Assets/OG/495.jpg", "/images/therapysphere-room.jpg"]) missing.add(p);
function isMissingMedia(value) {
  try {
    const u = new URL(value, "https://www.pinnacleblooms.org");
    return u.origin === "https://www.pinnacleblooms.org" && missing.has(u.pathname);
  } catch {
    return false;
  }
}
function repairKnownBrokenMedia(response) {
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(key);
  headers.set("x-pinnacle-known-media", "verified-missing-20261006");
  return new HTMLRewriter().on("img", { element(el) {
    if (!isMissingMedia(el.getAttribute("src"))) return;
    if (new URL(el.getAttribute("src"), "https://www.pinnacleblooms.org").pathname === "/Assets/Materials/318.jpg") {
      el.remove();
      return;
    }
    el.setAttribute("src", BRAND_IMAGE);
    el.setAttribute("alt", "Pinnacle Blooms Network logo");
    el.setAttribute("data-pinnacle-brand-fallback", "true");
    el.setAttribute("style", (el.getAttribute("style") || "") + ";object-fit:contain;background:#fff;padding:12px;box-sizing:border-box;");
    for (const name of ["srcset", "data-src", "data-srcset"]) el.removeAttribute(name);
  } }).on("meta", { element(el) {
    if (["og:image", "twitter:image"].includes(el.getAttribute("property") || el.getAttribute("name")) && isMissingMedia(el.getAttribute("content"))) el.setAttribute("content", BRAND_IMAGE);
  } }).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

// deployment/url-health-repair.mjs
var ORIGIN = "https://www.pinnacleblooms.org";
var URL_ALIASES = {
  "/ABA / Behavioral Therapy": "/best-aba-therapy-center-india-proven-improvement-rate",
  "/Special Education / Cognitive Therapy": "/best-special-education-center-call-9100181181",
  "/Special Education/Cognitive Behavioral Therapy": "/best-special-education-center-call-9100181181",
  "/allmirracles-sitemap.xml": "/sitemaps/miracles.xml"
};
var metadataPaths = /* @__PURE__ */ new Map([
  ["/child-psychological-counseling", /* @__PURE__ */ new Set(["https://mobile.pinnacleblooms.org/child-psychological-counseling", "http://www.pinnacleblooms.org/child-psychological-counseling", "http://mobile.pinnacleblooms.org/child-psychological-counseling"])],
  ["/franchise-autism-therapy-center", /* @__PURE__ */ new Set(["https://mobile.pinnacleblooms.org/franchises", "http://mobile.pinnacleblooms.org/franchises", "https://www.pinnacleblooms.org/franchises", "http://www.pinnacleblooms.org/franchises"])]
]);
function urlHealthAlias(request) {
  const u = new URL(request.url);
  if (!["GET", "HEAD"].includes(request.method) || u.origin !== ORIGIN || request.headers.has("authorization") || request.headers.has("range")) return null;
  let p;
  try {
    p = decodeURIComponent(u.pathname).replace(/\/$/, "");
  } catch {
    return null;
  }
  const target = URL_ALIASES[p];
  if (!target) return null;
  u.pathname = target;
  return new Response(null, { status: 301, headers: { location: u.href, "cache-control": "public, max-age=300", "x-pinnacle-url-repair": "shared-url-health-20261009" } });
}
function healthLinkTarget(value) {
  let u;
  try {
    u = new URL(value, ORIGIN);
  } catch {
    return value;
  }
  if (!["www.pinnacleblooms.org", "pinnacleblooms.org"].includes(u.hostname) || !["http:", "https:"].includes(u.protocol) || u.port || u.username || u.password) return value;
  let p;
  try {
    p = decodeURIComponent(u.pathname).replace(/\/$/, "");
  } catch {
    return value;
  }
  const target = URL_ALIASES[p];
  return target ? ORIGIN + target + u.search + u.hash : value;
}
function repairUrlHealth(request, response) {
  const u = new URL(request.url);
  if (request.method !== "GET" || u.origin !== ORIGIN || request.headers.has("authorization") || request.headers.has("range") || response.status !== 200 || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "") || /^\/(?:api|cdn-cgi|ask|account|payment)(?:\/|$)/i.test(u.pathname)) return response;
  const headers = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(k);
  headers.set("x-pinnacle-url-repair", "shared-url-health-20261009");
  const old = metadataPaths.get(u.pathname), canonical = ORIGIN + u.pathname;
  const rewrite = new HTMLRewriter().on("a[href]", { element(e) {
    const value = e.getAttribute("href"), target = healthLinkTarget(value);
    if (target !== value) e.setAttribute("href", target);
    let link;
    try {
      link = new URL(value, ORIGIN);
    } catch {
      return;
    }
    if (link.origin === ORIGIN && link.pathname === "/assets/abilityscore-summary.pdf") {
      e.setAttribute("href", "/verify/evidence/records/study-portfolio.html");
      e.removeAttribute("download");
      e.removeAttribute("target");
      e.setInnerContent("Read study evidence");
    }
  } });
  if (old) {
    let seen = false;
    rewrite.on('link[rel="canonical"]', { element(e) {
      const href = e.getAttribute("href");
      if (href !== canonical && !old.has(href)) return;
      if (seen) e.remove();
      else {
        e.setAttribute("href", canonical);
        seen = true;
      }
    } });
    rewrite.on('meta[property="og:url"]', { element(e) {
      if (old.has(e.getAttribute("content"))) e.setAttribute("content", canonical);
    } });
  }
  return repairKnownBrokenMedia(rewrite.transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers })));
}
export {
  URL_ALIASES,
  healthLinkTarget,
  repairUrlHealth,
  urlHealthAlias
};
