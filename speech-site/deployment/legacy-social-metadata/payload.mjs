// Remove one fingerprinted, invalid console.log dump from legacy FAQ documents.
// All unknown/changed scripts pass through, including legitimate console calls.
export const DEBUG_SHA256 = '4a0bbd8996a569108cc0176dd270f916d9237a90a639f8dea27d340fff47a9dc';
export const DEBUG_BYTES = 195721;
const LIMIT = 256 * 1024;
const PREFIX = /^\s*console\.log\(\[\{&quot;DisplayTitle&quot;/;
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');

class KnownInvalidDebugScript {
  element(element) {
    const type = (element.getAttribute('type') || '').trim().toLowerCase();
    this.pass = !['', 'text/javascript', 'application/javascript'].includes(type);
    this.buffer = '';
  }

  async text(chunk) {
    if (this.pass) return;
    this.buffer += chunk.text;
    if (this.buffer.length > LIMIT || (this.buffer.length > 100 && !PREFIX.test(this.buffer))) {
      chunk.replace(this.buffer, {html: true});
      this.buffer = ''; this.pass = true;
      return;
    }
    if (!chunk.lastInTextNode) { chunk.remove(); return; }
    const bytes = new TextEncoder().encode(this.buffer);
    let known = false;
    if (bytes.length === DEBUG_BYTES && PREFIX.test(this.buffer)) {
      try { known = hex(await crypto.subtle.digest('SHA-256', bytes)) === DEBUG_SHA256; }
      catch { /* A failed fingerprint check must preserve the origin script. */ }
    }
    if (known) chunk.remove();
    else chunk.replace(this.buffer, {html: true});
    this.buffer = '';
  }
}

export function reduceKnownLegacyPayload(request, response) {
  const path = new URL(request.url).pathname;
  // Called only for a response recorded in the entry handler's internal WeakSet
  // after its public HTML guards pass. An origin-supplied header is not authority.
  if (!(path === '/faq' || path.startsWith('/faq/'))) return response;
  const headers = new Headers(response.headers);
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest']) headers.delete(name);
  headers.set('x-pinnacle-legacy-payload', 'fingerprinted-debug-filter-20261004');
  return new HTMLRewriter().on('script:not([src])', new KnownInvalidDebugScript())
    .transform(new Response(response.body, {status: response.status, statusText: response.statusText, headers}));
}
