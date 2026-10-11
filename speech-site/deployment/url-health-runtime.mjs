// deployment/legacy-social-metadata/media.mjs
var BRAND_IMAGE = "https://www.pinnacleblooms.org/pinnacle-pages-assets/pinnacle-blooms-network-lockup.CUnZranx_Z2nTFgn.webp";
var missing = /* @__PURE__ */ new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
missing.add("/Assets/Materials/318.jpg");
for (const p of ["/Assets/AbilityScore_Universal_0-1000_Child%20Development_Metric.jpg", "/Assets/Materials/20707167545.jpg", "/Assets/Materials/962.jpg", "/Assets/OG/495.jpg", "/images/therapysphere-room.jpg"]) missing.add(p);
function isMissingMedia(value) {
  try {
    const u = new URL(value, "https://www.pinnacleblooms.org");
    return ["https://www.pinnacleblooms.org", "https://pinnacleblooms.org"].includes(u.origin) && missing.has(u.pathname);
  } catch {
    return false;
  }
}
var legacyMaterialPage = /^\/(?:ma|m|a)\//i;
var legacyMaterialImage = /^\/Assets\/Materials\/\d+\.jpg$/i;
function repairKnownBrokenMedia(request, response) {
  const pagePath = typeof request === "string" ? new URL(request).pathname : new URL(request.url).pathname;
  const unusable = (value) => isMissingMedia(value) || (() => {
    try {
      return legacyMaterialPage.test(pagePath) && legacyMaterialImage.test(new URL(value, "https://www.pinnacleblooms.org").pathname);
    } catch {
      return false;
    }
  })();
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(key);
  headers.set("x-pinnacle-known-media", "verified-missing-20261011");
  return new HTMLRewriter().on("img", { element(el) {
    if (!unusable(el.getAttribute("src"))) return;
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
    if (["og:image", "twitter:image"].includes(el.getAttribute("property") || el.getAttribute("name")) && unusable(el.getAttribute("content"))) el.setAttribute("content", BRAND_IMAGE);
  } }).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

// deployment/url-health-repair.mjs
var ORIGIN = "https://www.pinnacleblooms.org";
var URL_ALIASES = {
  "/ABA / Behavioral Therapy": "/best-aba-therapy-center-india-proven-improvement-rate",
  "/Special Education / Cognitive Therapy": "/best-special-education-center-call-9100181181",
  "/Special Education/Cognitive Behavioral Therapy": "/best-special-education-center-call-9100181181",
  "/allmirracles-sitemap.xml": "/sitemaps/miracles.xml",
  // Shared legacy navigation still emits these redirecting destinations on
  // hundreds of pages. Point both incoming aliases and rendered links at the
  // sole maintained destination so crawlers and parents do not pay a hop.
  "/verify": "/verify/",
  "/innovation": "/pinnacle-ai-innovations-revolutionizing-autism-history",
  "/franchises": "/franchise-autism-therapy-center",
  // Historical centre ribbons used the pre-records evidence location.
  "/verify/evidence/operating-metrics.html": "/verify/evidence/records/operating-metrics.html",
  // Consolidate search-shaped aliases into the maintained service and centre
  // destinations. These aliases must not become thin, competing landing pages.
  "/child-psychologist": "/child-psychological-counseling",
  "/child-psychologist-near-me": "/child-psychological-counseling",
  "/child-counselor-near-me": "/child-psychological-counseling",
  "/speech-therapist-near-me": "/top-speech-therapy-center-india-proven-improvement-rate",
  "/occupational-therapist-near-me": "/best-occupational-therapy-center-india-proven-improvement-rate",
  "/autism-center-near-me": "/centers",
  // Exact live 404s reported by the 10 October Semrush full crawl. Keep the
  // old identities available while consolidating them into maintained pages.
  "/centers/best-autism-speech-aba-occupational-therapy-center-srikakulkam-ap-india": "/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india",
  "/b/activities-of-daily-living": "/c/activities-of-daily-living",
  "/autism-therapy-centers/kukatpally": "/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india"
};
var FAQ_LANGUAGES = { english: "en-IN", hindi: "hi", telugu: "te", tamil: "ta", kannada: "kn", malayalam: "ml", bengali: "bn" };
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
  if (u.pathname === target) return null;
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
    if (link.origin === ORIGIN) {
      const rel = (e.getAttribute("rel") || "").split(/\s+/).filter(Boolean).filter((token) => token.toLowerCase() !== "nofollow");
      if (rel.length) e.setAttribute("rel", rel.join(" "));
      else e.removeAttribute("rel");
    }
    if (link.origin === ORIGIN && link.pathname === "/assets/abilityscore-summary.pdf") {
      e.setAttribute("href", "/verify/evidence/records/study-portfolio.html");
      e.removeAttribute("download");
      e.removeAttribute("target");
      e.setInnerContent("Read study evidence");
    }
  } });
  const faqLanguage = u.pathname.match(/^\/faq\/([^/]+)(?:\/|$)/i)?.[1]?.toLowerCase();
  if (FAQ_LANGUAGES[faqLanguage]) rewrite.on("html", { element(e) {
    e.setAttribute("lang", FAQ_LANGUAGES[faqLanguage]);
  } });
  if (old) {
    let seen = false;
    const sameIdentity = (value) => {
      try {
        const target = new URL(value, ORIGIN);
        return target.origin === ORIGIN && target.pathname === u.pathname;
      } catch {
        return false;
      }
    };
    rewrite.on('link[rel="canonical"]', { element(e) {
      const href = e.getAttribute("href");
      if (href !== canonical && !old.has(href) && !sameIdentity(href)) return;
      if (seen) e.remove();
      else {
        e.setAttribute("href", canonical);
        seen = true;
      }
    } });
    rewrite.on('meta[property="og:url"]', { element(e) {
      const value = e.getAttribute("content");
      if (old.has(value) || sameIdentity(value)) e.setAttribute("content", canonical);
    } });
    if (u.pathname === "/child-psychological-counseling") {
      let title = false, description = false, heading = false;
      rewrite.on("title", { element(e) {
        if (title) return;
        title = true;
        e.setInnerContent("Child Psychologist & Psychological Counselling | Pinnacle Blooms");
      } });
      rewrite.on('meta[name="description"]', { element(e) {
        if (description) return;
        description = true;
        e.setAttribute("content", "Child psychology and counselling guidance for children and families. Find a Pinnacle centre and call 9100 181 181 to confirm the professional, appointment and fee.");
      } });
      rewrite.on("h1", { element(e) {
        if (heading) return;
        heading = true;
        e.setInnerContent("Child psychology and counselling support for children and families");
        e.after('<section id="child-psychology-next-step" aria-label="Talk with Pinnacle about child psychology and counselling" style="box-sizing:border-box;max-width:980px;margin:18px auto;padding:20px;border:1px solid #d9bfd6;border-radius:16px;background:#fff;color:#18233f;box-shadow:0 10px 28px rgba(24,35,63,.08)"><p style="margin:0 0 14px;font-size:1.05rem;line-height:1.65">Talk through concerns about emotions, behaviour, learning or participation. Pinnacle will help you identify an appropriate centre and confirm the available qualified professional, appointment and fee before you visit.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a href="tel:+919100181181" data-cta="child-psychology-call" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border-radius:999px;background:#652579;color:#fff;text-decoration:none;font-weight:800">Call 9100 181 181</a><a href="/enroll-autism-speech-aba-therapies-india?service=psychological-counselling" data-cta="child-psychology-assessment" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border:2px solid #652579;border-radius:999px;background:#fff;color:#652579;text-decoration:none;font-weight:800">Request an assessment</a><a href="/centers" style="display:inline-flex;align-items:center;min-height:48px;color:#315c80;font-weight:800">Find a Pinnacle centre near you</a></div><p style="margin:14px 0 0;font-size:.92rem;line-height:1.55">Pinnacle does not diagnose from this page. Confirm the suitable service and professional for your child with the receiving team.</p></section>', { html: true });
      } });
    }
  }
  return repairKnownBrokenMedia(request, rewrite.transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers })));
}
export {
  URL_ALIASES,
  healthLinkTarget,
  repairUrlHealth,
  urlHealthAlias
};
