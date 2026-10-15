/** Call from the EXISTING owner-controlled Worker before its ordinary routing.
 * Returns null for unrelated routes. No route, authentication or binding changes.
 * Managed assets are private-named within the same complete ASSETS collection.
 */
export const HOSTS = new Set(['www.pinnacleblooms.org','pinnacleblooms.org','interventions.pinnacleblooms.org','materials.pinnacleblooms.org','pediatricians.pinnacleblooms.org']);
export async function handleManagedSitemap(request, env) {
  const url = new URL(request.url);
  if (!HOSTS.has(url.hostname) || url.port || url.protocol !== 'https:') return null;
  let path = url.pathname;
  // Never expose the internal asset namespace, even through a catch-all fallback.
  if (path.startsWith('/_managed_sitemaps/')) return new Response('Not found',{status:404});
  const legacyVideo = url.hostname === 'www.pinnacleblooms.org' && path === '/sitemaps/miracles.xml';
  if (!(legacyVideo || path === '/sitemap-managed.xml' || /^\/sitemap-(?:pages|images|videos|news)-[a-z0-9-]+\.xml$/.test(path) || path.startsWith('/site-map/'))) return null;
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  if (url.search || /%|\\|\/\/|(?:^|\/)\.\.?\//.test(path)) return new Response('Not found',{status:404});
  if (path.endsWith('/')) path += 'index.html';
  if (!/\.(?:xml|html|md|txt)$/.test(path)) return new Response('Not found',{status:404});
  if (!env.ASSETS?.fetch) return new Response('Managed asset binding unavailable',{status:503});
  const internal = new URL(`/_managed_sitemaps/${url.hostname}${path}`,url.origin);
  const response = await env.ASSETS.fetch(new Request(internal,{method:'GET'}));
  if (response.status !== 200) return new Response('Not found',{status:404});
  const body = await response.arrayBuffer();
  const xml = path.endsWith('.xml');
  const prefix = new TextDecoder().decode(body.slice(0,512)).trimStart();
  if (xml && !/^<\?xml\s/.test(prefix)) return new Response('Invalid managed XML asset',{status:502});
  if (xml && !/<(?:sitemapindex|urlset)\b/.test(prefix)) return new Response('Invalid managed XML asset',{status:502});
  const type = xml ? 'application/xml; charset=utf-8' : path.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8';
  const headers = new Headers({'Content-Type':type,'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'});
  // Index discovery XML remains crawlable. Navigation/AI companions are supplemental.
  if (!xml) headers.set('X-Robots-Tag','noindex, follow');
  const hash = await crypto.subtle.digest('SHA-256',body);
  const etag = '"'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')+'"';
  headers.set('ETag',etag);
  if (request.headers.get('If-None-Match') === etag) return new Response(null,{status:304,headers});
  return new Response(request.method==='HEAD'?null:body,{status:200,headers});
}
