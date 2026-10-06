// Shared legacy metadata repair. The Astro portal, Ask and other route owners
// remain independent. Inspect a bounded head; separately filter a known invalid
// FAQ debug payload while streaming all remaining content unchanged.
import {repairFranchiseCanonical} from './franchise-canonical.mjs';
import {staffRoute} from './staff-routes.mjs';
import {reduceKnownLegacyPayload} from './payload.mjs';
import {SERVICES_PATH, SERVICES_URL, physiotherapyRedirect, repairServiceLinks} from './discovery.mjs';
import {repairKnownLegacySchema} from './schema.mjs';
import {repairKnownBrokenMedia} from './media.mjs';
import {repairPublicLinks} from '../public-link-target.mjs';
import {sunshineRedirect} from '../sunshine-recovery-routes.mjs';
export const RELEASE = 'legacy-social-https-20261004';
export const HEAD_LIMIT = 64 * 1024;
// Existing legacy templates with the same measured HTTP social/HTTPS canonical defect.
export const ADDITIONAL_LEGACY_PATHS = ['/allmirracles', '/yoga-therapy', '/teachertraining', '/teacher-training', '/staff', '/careers', '/dance-therapy', '/certified-courses', '/certifiedcourses', '/courses/466/Afraid', '/courses/466/afraid'];
export const ADDITIONAL_LEGACY_ROUTES = ['www.pinnacleblooms.org/t/*', 'www.pinnacleblooms.org/mirracles/*', ...ADDITIONAL_LEGACY_PATHS.map(p => 'www.pinnacleblooms.org' + p + '*')];
const encoder = new TextEncoder();
const transformedResponses = new WeakSet();

export function isEligible(request) {
  const url = new URL(request.url);
  return request.method === 'GET' && url.protocol === 'https:' &&
    url.hostname === 'www.pinnacleblooms.org' &&
    (url.pathname === '/faq' || url.pathname.startsWith('/faq/') ||
      /^\/(?:t|c|ma|b|m|a|abs|abilities|skills)\/[^/]+\/?$/.test(url.pathname) || /^\/mirracles\/\d+\/[^/]+\/?$/.test(url.pathname) ||
      /^\/staff\/[^/]+\/\d+\/?$/.test(url.pathname) ||
      ADDITIONAL_LEGACY_PATHS.includes(url.pathname.replace(/\/$/, '')) ||
      ['/physiotherapy', '/physiotherapy/', SERVICES_PATH, SERVICES_PATH + '/'].includes(url.pathname)) &&
    !request.headers.has('authorization') && !request.headers.has('range');
}

function concatenate(parts) {
  const bytes = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  return bytes;
}

function resumedBody(parts, reader) {
  return new ReadableStream({
    async pull(controller) {
      if (parts.length) { controller.enqueue(parts.shift()); return; }
      try {
        const {done, value} = await reader.read();
        if (done) { reader.releaseLock(); controller.close(); }
        else controller.enqueue(value);
      } catch (error) { reader.releaseLock(); controller.error(error); }
    },
    async cancel(reason) { try { await reader.cancel(reason); } finally { reader.releaseLock(); } }
  });
}

async function repairHead(head, request) {
  const canonical = [], social = [], robots = [];
  // A parsing pass makes attribute order, casing, entities and comments safe.
  await new HTMLRewriter()
    .on('head > link', {element(el) {
      if ((el.getAttribute('rel') || '').toLowerCase().split(/\s+/).includes('canonical')) canonical.push(el.getAttribute('href'));
    }})
    .on('head > meta', {element(el) {
      if ((el.getAttribute('property') || '').toLowerCase() === 'og:url') social.push(el.getAttribute('content'));
      if (['robots', 'googlebot'].includes((el.getAttribute('name') || '').toLowerCase())) robots.push(el.getAttribute('content') || '');
    }})
    .transform(new Response(head)).text();
  if (canonical.length !== 1 || social.length !== 1 || robots.some(v => /noindex/i.test(v))) return null;
  const target = canonical[0], previous = social[0];
  const requestUrl = new URL(request.url);
  // This public service hub incorrectly inherits the books subdomain identity.
  // Require the exact observed pair; all other canonical choices pass through.
  if (requestUrl.pathname.replace(/\/$/, '') === SERVICES_PATH &&
      target === 'https://books.pinnacleblooms.org' + SERVICES_PATH &&
      previous === 'http://books.pinnacleblooms.org' + SERVICES_PATH) {
    return new HTMLRewriter()
      .on('head > link', {element(el) {
        if ((el.getAttribute('rel') || '').toLowerCase().split(/\s+/).includes('canonical')) el.setAttribute('href', SERVICES_URL);
      }})
      .on('head > meta', {element(el) {
        if ((el.getAttribute('property') || '').toLowerCase() === 'og:url') el.setAttribute('content', SERVICES_URL);
      }}).transform(new Response(head)).text();
  }
  let parsed;
  try { parsed = new URL(target); } catch { return null; }
  const samePath = parsed.pathname.replace(/\/$/, '') === requestUrl.pathname.replace(/\/$/, '');
  // The legacy numeric Mirracles routes publish lowercase canonical slugs.
  // Only that documented route family permits a case-normalized comparison.
  const sameMirracle = /^\/mirracles\/\d+\/[^/]+\/?$/.test(requestUrl.pathname) &&
    parsed.pathname.replace(/\/$/, '') === requestUrl.pathname.replace(/\/$/, '').toLowerCase();
  const sameRecordedCourse = requestUrl.pathname.replace(/\/$/,'')==='/courses/466/Afraid' && parsed.pathname==='/courses/466/afraid';
  // Published numeric staff profiles likewise use lowercase canonical slugs.
  // Retired profiles and recorded canonical redirects are handled before here.
  const sameStaff = /^\/staff\/[^/]+\/\d+\/?$/.test(requestUrl.pathname) &&
    parsed.pathname.replace(/\/$/, '') === requestUrl.pathname.replace(/\/$/, '').toLowerCase();
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'www.pinnacleblooms.org' ||
      parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash ||
      !(samePath || sameMirracle || sameRecordedCourse || sameStaff) ||
      ![target,target.replace(/^https:/, 'http:')].includes(previous)) return null;
  // A previously corrected social URL must not suppress the independent
  // JSON-LD repair. The same self-canonical/privacy guards still apply.
  if(previous===target)return head;
  return new HTMLRewriter().on('head > meta', {element(el) {
    if ((el.getAttribute('property') || '').toLowerCase() === 'og:url' && el.getAttribute('content') === previous) el.setAttribute('content', target);
  }}).transform(new Response(head)).text();
}

export async function transform(request, response) {
  if (!isEligible(request) || response.status !== 200 || !response.body ||
      !/^text\/html(?:\s*;|$)/i.test(response.headers.get('content-type') || '') ||
      /charset\s*=\s*(?!utf-8(?:\s|;|$))/i.test(response.headers.get('content-type') || '') ||
      response.headers.has('set-cookie') || /noindex/i.test(response.headers.get('x-robots-tag') || '') ||
      /no-store|no-transform/i.test(response.headers.get('cache-control') || '')) return response;

  const reader = response.body.getReader(), parts = [];
  let size = 0, headEnd = 0, combined;
  while (size < HEAD_LIMIT) {
    const {done, value} = await reader.read();
    if (done) break;
    parts.push(value); size += value.length;
    combined = concatenate(parts);
    const probe = new TextDecoder().decode(combined.subarray(0, HEAD_LIMIT));
    const close = /<\/head\s*>/i.exec(probe);
    if (close) { headEnd = encoder.encode(probe.slice(0, close.index + close[0].length)).length; break; }
  }
  let replacement = null, originalHead = null;
  const hasBom = combined?.[0] === 0xef && combined?.[1] === 0xbb && combined?.[2] === 0xbf;
  if (headEnd && !hasBom) {
    try {
      const head = new TextDecoder('utf-8', {fatal: true}).decode(combined.subarray(0, headEnd));
      originalHead = head;
      replacement = await repairHead(head, request);
    } catch { /* Unknown or malformed head: preserve the origin response. */ }
  }
  const headers = new Headers(response.headers);
  let output = parts;
  if (replacement !== null) {
    output = [encoder.encode(replacement), combined.subarray(headEnd)];
    // Keep origin privacy/cache/cookie semantics; never introduce shared caching.
    for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest']) headers.delete(name);
    if(replacement!==originalHead)headers.set('x-pinnacle-social-metadata', RELEASE);
  }
  const result = new Response(resumedBody(output, reader), {status: response.status, statusText: response.statusText, headers});
  if (replacement !== null) transformedResponses.add(result);
  return result;
}

export async function handle(request, fetcher = fetch) {
  const redirect = sunshineRedirect(request) || staffRoute(request) || physiotherapyRedirect(request);
  if (redirect) return redirect;
  if (request.method === 'GET' && new URL(request.url).origin + new URL(request.url).pathname === 'https://www.pinnacleblooms.org/franchise-autism-therapy-center' && !request.headers.has('authorization') && !request.headers.has('range')) {
    const headers = new Headers(request.headers);
    headers.delete('if-none-match'); headers.delete('if-modified-since');
    return repairFranchiseCanonical(request, await fetcher(new Request(request, {headers})));
  }
  if (!isEligible(request)) return fetcher(request);
  const headers = new Headers(request.headers);
  // An origin validator could otherwise restore a cached pre-repair head via 304.
  headers.delete('if-none-match'); headers.delete('if-modified-since');
  const upstream = new Request(request, {headers});
  const response = await transform(request, await fetcher(upstream));
  return transformedResponses.has(response) ? repairPublicLinks(repairKnownBrokenMedia(repairKnownLegacySchema(repairServiceLinks(request, reduceKnownLegacyPayload(request, response))))) : response;
}

export default {fetch: request => handle(request)};
