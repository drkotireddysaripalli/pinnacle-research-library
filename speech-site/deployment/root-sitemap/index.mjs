import {retiredStaffIds,currentStaffPaths} from '../legacy-social-metadata/staff-records.mjs';
import {faqPaths} from './faq-paths.mjs';
import {repairVideoSitemap} from './video-output.mjs';
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var SITE_ORIGIN = "https://www.pinnacleblooms.org";
var CORE_URLS = [
  "/",
  "/enroll-autism-speech-aba-therapies-india",
  "/top-autism-therapy-services-india-proven-improvement-rate",
  "/pinnacle-ai-innovations-revolutionizing-autism-history",
  "/about-pinnacle-proven-improvement-rate",
  "/top-speech-therapy-center-india-proven-improvement-rate",
  "/best-aba-therapy-center-india-proven-improvement-rate",
  "/best-occupational-therapy-center-india-proven-improvement-rate",
  "/best-special-education-center-call-9100181181",
  "/staff",
  "/allmirracles",
  "/faq",
  "/sunshine",
  "/autism-therapy",
  "/contact-national-autism-helpline-24-7",
  "/careers",
  "/franchise-autism-therapy-center",
  "/speech-aba-autism-assessments",
  "/autism-speech-aba-parent-family-resources",
  "/autism-speech-aba-news",
  "/teacher-training",
  "/certified-courses",
  "/parent-training",
  "/school-training",
  "/group-teaching",
  "/physiotherapy",
  "/child-psychological-counseling",
  "/dance-therapy",
  "/music-therapy",
  "/yoga-therapy",
  "/hydro-therapy",
  "/media-coverage",
  "/events",
  "/privacy-policy",
  "/terms-of-use",
  "/age-restriction-policy",
  "/contact-information",
  "/disclaimer-and-limitations-of-liabilities",
  "/endorsement-and-testimonial",
  "/governing-and-jurisdiction",
  "/third-party-inegration",
  "/refund-policy",
  "/cookie-policy",
  "/leadership",
  "/payment-and-billing",
  "/copyright-and-intellectual",
  "/sitemap"
];
var CHILD_SITEMAPS = [
  "/faq/sitemap.xml",
  "/sunshine/sitemap.xml",
  "/allmirracles-sitemap.xml",
  "/sitemaps/core.xml",
  "/sitemaps/centres.xml",
  "/sitemaps/staff.xml",
  "/sitemaps/bots.xml",
  "/sitemaps/miracles.xml",
  "/sitemaps/faq-en.xml",
  "/sitemaps/faq-te.xml",
  "/sitemaps/faq-hi.xml",
  "/sitemaps/faq-kn.xml",
  "/sitemaps/faq-mr.xml",
  "/sitemaps/faq-ta.xml",
  "/sitemaps/faq-ml.xml",
  "/verify/sitemap.xml"
];
var PROXY_TARGETS = /* @__PURE__ */ new Map([
  ["/sitemaps/centres.xml", `${SITE_ORIGIN}/centerssitemap`],
  ["/sitemaps/staff.xml", "https://psapi.pinnacleblooms.org/staffsitemap"],
  ["/sitemaps/bots.xml", "https://psapi.pinnacleblooms.org/botsitemap"],
  ["/sitemaps/miracles.xml", `${SITE_ORIGIN}/mirraclesitemap?count=23000`],
  ["/sitemaps/faq-en.xml", `${SITE_ORIGIN}/faqenglishsitemap.xml`],
  ["/sitemaps/faq-te.xml", `${SITE_ORIGIN}/faqtelugusitemap.xml`],
  ["/sitemaps/faq-hi.xml", `${SITE_ORIGIN}/faqhindisitemap.xml`],
  ["/sitemaps/faq-kn.xml", `${SITE_ORIGIN}/faqkannadasitemap.xml`],
  ["/sitemaps/faq-mr.xml", `${SITE_ORIGIN}/faqmarathisitemap.xml`],
  ["/sitemaps/faq-ta.xml", `${SITE_ORIGIN}/faqtamilsitemap.xml`],
  ["/sitemaps/faq-ml.xml", `${SITE_ORIGIN}/faqmalayalmsitemap.xml`]
]);
var XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
  "X-Content-Type-Options": "nosniff"
};
function xmlResponse(body, status = 200, method = "GET", cacheControl = XML_HEADERS["Cache-Control"]) {
  return new Response(method === "HEAD" ? null : body, {
    status,
    headers: {
      ...XML_HEADERS,
      "Cache-Control": cacheControl
    }
  });
}
__name(xmlResponse, "xmlResponse");
function sitemapIndexXml() {
  const entries = CHILD_SITEMAPS.map((path) => `  <sitemap><loc>${SITE_ORIGIN}${path}</loc></sitemap>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
}
__name(sitemapIndexXml, "sitemapIndexXml");
function coreSitemapXml() {
  const entries = CORE_URLS.map((path) => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}
__name(coreSitemapXml, "coreSitemapXml");
async function proxySitemap(target, method) {
  let upstream;
  try {
    upstream = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/xml,text/xml;q=0.9,*/*;q=0.1",
        "User-Agent": "Pinnacle-Sitemap-Edge/1.0"
      }
    });
  } catch {
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Temporary upstream failure</error>\n', 502, method, "no-store");
  }
  if (!upstream.ok) {
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Temporary upstream failure</error>\n', 502, method, "no-store");
  }
  const headers = new Headers(upstream.headers);
  headers.set("Content-Type", XML_HEADERS["Content-Type"]);
  headers.set("Cache-Control", XML_HEADERS["Cache-Control"]);
  headers.set("X-Content-Type-Options", XML_HEADERS["X-Content-Type-Options"]);
  headers.delete("Content-Length");
  headers.delete("Content-Encoding");
  return new Response(method === "HEAD" ? null : upstream.body, {
    status: 200,
    headers
  });
}
__name(proxySitemap, "proxySitemap");
async function normalizedUrlsetSitemap(target, method, stripVolatileMetadata = false) {
  let upstream;
  try {
    upstream = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/xml,text/xml;q=0.9,*/*;q=0.1",
        "User-Agent": "Pinnacle-Sitemap-Edge/1.0"
      }
    });
  } catch {
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Temporary upstream failure</error>\n', 502, method, "no-store");
  }
  if (!upstream.ok) {
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Temporary upstream failure</error>\n', 502, method, "no-store");
  }
  const source = await upstream.text();
  const entries = source.match(/<url\b[\s\S]*?<\/url>/gi) ?? [];
  const seenLocations = /* @__PURE__ */ new Set();
  const uniqueEntries = [];
  for (let entry of entries) {
    let location = entry.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim();
    // The older bots feed includes the same staff records as the dedicated
    // staff feed. Apply the approved retirement/canonical source to both.
    // Match page <loc> only; image:loc and all nonstaff entries are preserved.
    const staff = location?.match(/^https?:\/\/www\.pinnacleblooms\.org\/staff\/[^/?#]+\/([1-9][0-9]*)\/?$/);
    if (staff) {
      if (retiredStaffIds.has(Number(staff[1]))) continue;
      const canonical = currentStaffPaths[staff[1]];
      if (canonical) {
        const previous = location;
        location = SITE_ORIGIN + canonical;
        entry = entry.replace(/<loc>[\s\S]*?<\/loc>/i, '<loc>'+location+'</loc>');
        if (previous !== location) entry = entry.replace(/<lastmod>[^<]*<\/lastmod>/gi, '');
      }
    }
    if (!location || seenLocations.has(location)) continue;
    seenLocations.add(location);
    uniqueEntries.push(stripVolatileMetadata ? entry.replace(/<lastmod>[^<]*<\/lastmod>/gi, "").replace(/<changefreq>[^<]*<\/changefreq>/gi, "").replace(/<priority>[^<]*<\/priority>/gi, "") : entry);
  }
  if (uniqueEntries.length === 0 || uniqueEntries.length > 5e4) {
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Invalid upstream sitemap</error>\n', 502, method, "no-store");
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniqueEntries.join("\n")}
</urlset>
`;
  const response = xmlResponse(body, 200, method);
  response.headers.set('x-pinnacle-sitemap-eligibility', 'staff-source-20261006');
  return response;
}
__name(normalizedUrlsetSitemap, "normalizedUrlsetSitemap");

async function greenvilleCentreSitemap(target, method) {
  let upstream;
  try {
    upstream = await fetch(target, {method:"GET",headers:{Accept:"application/xml,text/xml;q=0.9,*/*;q=0.1","User-Agent":"Pinnacle-Sitemap-Edge/1.0"}});
  } catch {
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Temporary upstream failure</error>\n',502,method,"no-store");
  }
  if (!upstream.ok) return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Temporary upstream failure</error>\n',502,method,"no-store");
  const source = await upstream.text();
  const oldUrl = "https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-california-usa";
  const newUrl = "https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-greenville-south-carolina-usa";
  const entries = source.match(/<url\b[\s\S]*?<\/url>/gi) ?? [];
  const matches = entries.filter(entry => entry.includes("<loc>"+oldUrl+"</loc>"));
  if (matches.length !== 1 || source.includes("<loc>"+newUrl+"</loc>") || entries.length !== 63) return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Invalid upstream centre sitemap</error>\n',502,method,"no-store");
  const corrected = matches[0].replace(oldUrl,newUrl).replace("Center at USA","Center at Greenville, South Carolina").replace(/<lastmod>[^<]*<\/lastmod>/i,"<lastmod>2026-09-24</lastmod>");
  const body = source.replace(matches[0],corrected);
  const response = xmlResponse(body,200,method);
  response.headers.set("x-pinnacle-sitemap-repair","greenville-20260924-v1");
  return response;
}
__name(greenvilleCentreSitemap, "greenvilleCentreSitemap");
var index_default = {
  async fetch(request) {
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" }
      });
    }
    const requestUrl=new URL(request.url),{ pathname }=requestUrl;
    if(pathname==='/mirraclesitemap' && requestUrl.origin===SITE_ORIGIN &&
       [...requestUrl.searchParams.keys()].every(k=>k==='count') &&
       (!requestUrl.searchParams.has('count')||/^\d{1,5}$/.test(requestUrl.searchParams.get('count'))) &&
       !request.headers.has('authorization')&&!request.headers.has('range')){
      const upstream=await fetch(new Request(request,{method:'GET'}));
      return repairVideoSitemap(upstream,method);
    }
    if(pathname.startsWith('/mirraclesitemap'))return fetch(request);
    if (pathname === "/sitemap.xml") {
      return xmlResponse(sitemapIndexXml(), 200, method);
    }
    if (pathname === "/sitemaps/core.xml") {
      return xmlResponse(coreSitemapXml(), 200, method);
    }
    const language=pathname.match(/^\/sitemaps\/faq-(en|te|hi|kn|mr|ta|ml)\.xml$/)?.[1];
    if (language) {
      const body='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+faqPaths[language].map(p=>'<url><loc>'+SITE_ORIGIN+p+'</loc></url>').join('')+'</urlset>';
      const response=xmlResponse(body,200,method);
      response.headers.set('x-pinnacle-sitemap-eligibility','faq-source-20261006');
      return response;
    }
    if (pathname === "/sitemaps/bots.xml" || pathname === "/sitemaps/staff.xml") {
      return normalizedUrlsetSitemap(PROXY_TARGETS.get(pathname), method, pathname === "/sitemaps/staff.xml");
    }
    if (pathname === "/sitemaps/centres.xml") {
      return greenvilleCentreSitemap(PROXY_TARGETS.get(pathname), method);
    }
    const target = PROXY_TARGETS.get(pathname);
    if (target) {
      const response=await proxySitemap(target, method);
      return pathname==='/sitemaps/miracles.xml'?repairVideoSitemap(response,method):response;
    }
    return xmlResponse('<?xml version="1.0" encoding="UTF-8"?><error>Not found</error>\n', 404, method, "public, max-age=60");
  }
};
export {
  index_default as default
};

