import {protectionCsp, publicProtectionTemplateRequest} from './protection-csp.mjs';

export const PUBLIC_TEMPLATE_PROTECTION_SOURCE = '/pinnacle-pages-scripts/protection-consumer.mjs?v=protection-default-20261020';
const marker = 'existing-consumer-v1';

// These public origin templates retain their existing analytics owner. Add
// only the already-published protection consumer, with its shared SDK sentinel.
export function repairPublicTemplateProtection(request, response) {
 if (!publicProtectionTemplateRequest(request) || request.method !== 'GET' ||
     response.status !== 200 || !response.body || response.headers.has('set-cookie') ||
     !response.headers.get('content-type')?.includes('text/html') ||
     /private|no-transform/i.test(response.headers.get('cache-control') || '') ||
     response.headers.has('x-pinnacle-public-protection')) return response;
 const headers = new Headers(response.headers);
 for (const key of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest', 'content-digest', 'repr-digest']) headers.delete(key);
 headers.set('x-pinnacle-public-protection', marker);
 let existing = false, nonce = '';
 const rewritten = new HTMLRewriter()
  .on('head', {element(element) {
   element.onEndTag(end => {
    if (existing) return;
    end.before('<script type="module" id="pinnacle-protection-container" data-pinnacle-public-protection="'+marker+'"'+(nonce?' nonce="'+nonce+'"':'')+' src="'+PUBLIC_TEMPLATE_PROTECTION_SOURCE+'"></script>', {html: true});
   });
  }})
  .on('head script', {element(element) {
   const value = element.getAttribute('nonce');
   if (!nonce && value && /^[A-Za-z0-9+/_=-]+$/.test(value)) nonce = value;
   if (element.getAttribute('id') === 'pinnacle-protection-container') existing = true;
   try {
    const source = new URL(element.getAttribute('src') || '', request.url);
    if (source.origin === new URL(request.url).origin && source.pathname === '/pinnacle-pages-scripts/protection-consumer.mjs') existing = true;
   } catch {}
  }})
  .transform(new Response(response.body, {status: response.status, statusText: response.statusText, headers}));
 return protectionCsp(request, rewritten);
}
