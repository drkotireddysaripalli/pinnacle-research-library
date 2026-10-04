// Reconcile the already-linked legacy physiotherapy alias with its public page.
// No common-shell text/design or directory membership is changed.
export const SERVICES_PATH = '/top-autism-therapy-services-india-proven-improvement-rate';
export const SERVICES_URL = 'https://www.pinnacleblooms.org' + SERVICES_PATH;
export function physiotherapyRedirect(request) {
  const url = new URL(request.url);
  if (!['GET','HEAD'].includes(request.method) || url.protocol !== 'https:' ||
      url.hostname !== 'www.pinnacleblooms.org' ||
      !['/physio-therapy','/physio-therapy/'].includes(url.pathname) ||
      request.headers.has('authorization') || request.headers.has('range')) return null;
  url.pathname = '/physiotherapy';
  return new Response(null, {status:301, headers:{location:url.href,
    'cache-control':'public, max-age=300', 'x-pinnacle-discovery':'physiotherapy-alias-20261004'}});
}

// Only run after the exact services-page metadata guards have passed.
export function repairServiceLinks(request, response) {
  if (new URL(request.url).pathname.replace(/\/$/,'') !== SERVICES_PATH) return response;
  return new HTMLRewriter().on('a[href]', {element(el) {
    const href = el.getAttribute('href');
    if (/^\/physio-therapy\/?(?:[?#]|$)/.test(href || ''))
      el.setAttribute('href',href.replace(/^\/physio-therapy\/?/,'/physiotherapy'));
  }}).transform(response);
}
