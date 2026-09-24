// This isolated Worker serves only the new helpline route. It never fetches or rewrites the ASP.NET origin.
export const HELPLINE_PATH = '/national-autism-helpline';
export const CANONICAL_URL = 'https://www.pinnacleblooms.org' + HELPLINE_PATH;
export const SITEMAP_PATH = HELPLINE_PATH + '/sitemap.xml';
export const SITEMAP_XML = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + CANONICAL_URL + '</loc><lastmod>2026-09-24</lastmod></url></urlset>\n';

function responseHeaders() {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
    'ETag': HELPLINE_ETAG,
    'Link': '<' + CANONICAL_URL + '/sitemap.xml>; rel="sitemap"; type="application/xml"',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; font-src 'self'; script-src 'sha256-" + JSONLD_CSP_HASH + "'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

function isNotModified(request, etag) {
  const validators = (request.headers.get('If-None-Match') || '').split(',').map(value => value.trim().replace(/^W\//, ''));
  return validators.includes(etag) || validators.includes('*');
}

function assetResponse(request, asset) {
  const headers = {
    'Content-Type': asset.contentType,
    'Cache-Control': 'public, max-age=300',
    'ETag': asset.etag,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; sandbox",
  };
  if (isNotModified(request, asset.etag)) return new Response(null, { status: 304, headers });
  headers['Content-Length'] = String(asset.byteLength);
  // HEAD never decodes or allocates the embedded image body.
  const body = request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.base64), character => character.charCodeAt(0));
  return new Response(body, { status: 200, headers });
}

export function handleRequest(request) {
  const url = new URL(request.url);
  const asset = Object.hasOwn(HELPLINE_ASSETS, url.pathname) ? HELPLINE_ASSETS[url.pathname] : null;
  const exportFile = Object.hasOwn(SERVICE_EXPORTS,url.pathname) ? SERVICE_EXPORTS[url.pathname] : null;
  const isSitemap = url.pathname === SITEMAP_PATH;
  const isPath = url.pathname === HELPLINE_PATH || url.pathname === HELPLINE_PATH + '/' || isSitemap || exportFile !== null || asset !== null;
  if (url.hostname !== 'www.pinnacleblooms.org' || !isPath) {
    return new Response(request.method === 'HEAD' ? null : 'Not found', {
      status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
    });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', {
      status: 405, headers: { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  if (exportFile) {
    if(url.protocol!=='https:') return Response.redirect('https://www.pinnacleblooms.org'+url.pathname,301);
    return new Response(request.method==='HEAD'?null:exportFile.body,{headers:{'Content-Type':exportFile.contentType,'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff','Link':'<'+CANONICAL_URL+'>; rel=\"describedby\"'}});
  }
  if (asset) {
    if (url.protocol !== 'https:') return new Response(null, { status: 301, headers: { 'Location': 'https://www.pinnacleblooms.org' + url.pathname, 'Cache-Control': 'public, max-age=300' } });
    return assetResponse(request, asset);
  }
  if (isSitemap) {
    if (url.protocol !== 'https:') return new Response(null, { status: 301, headers: { 'Location': CANONICAL_URL + '/sitemap.xml', 'Cache-Control': 'public, max-age=300' } });
    return new Response(request.method === 'HEAD' ? null : SITEMAP_XML, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } });
  }
  if (url.pathname.endsWith('/') || url.protocol !== 'https:') {
    return new Response(null, { status: 301, headers: { 'Location': CANONICAL_URL, 'Cache-Control': 'public, max-age=300' } });
  }
  if (isNotModified(request, HELPLINE_ETAG)) {
    return new Response(null, { status: 304, headers: responseHeaders() });
  }
  return new Response(request.method === 'HEAD' ? null : HELPLINE_HTML, { status: 200, headers: responseHeaders() });
}

export default {
  async fetch(request) { return handleRequest(request); },
};
