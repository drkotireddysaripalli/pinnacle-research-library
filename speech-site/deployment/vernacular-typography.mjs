// One typography contract for Astro, Ask/FAQ and already-published Verify pages.
// Reuse the licensed, self-hosted, weight-variable Anek fonts in Verify.
export const VERNACULAR_RELEASE = 'anek-20261006';
export const ANEK_SCRIPTS = [
  ['devanagari', 'U+0900-097F,U+1CD0-1CFF,U+A8E0-A8FF'],
  ['bangla', 'U+0980-09FF'], ['gurmukhi', 'U+0A00-0A7F'],
  ['gujarati', 'U+0A80-0AFF'], ['odia', 'U+0B00-0B7F'],
  ['tamil', 'U+0B80-0BFF'], ['telugu', 'U+0C00-0C7F'],
  ['kannada', 'U+0C80-0CFF'], ['malayalam', 'U+0D00-0D7F'],
];
const native = ':is(:lang(te),:lang(hi),:lang(mr),:lang(sa),:lang(ne),:lang(kok),:lang(bn),:lang(as),:lang(pa),:lang(gu),:lang(or),:lang(od),:lang(ta),:lang(kn),:lang(ml))';
// Sintony's Indic-only faces also cover native language labels on English pages.
// No Latin range is replaced: the approved English typography stays intact.
export const VERNACULAR_CSS = ANEK_SCRIPTS.flatMap(([script, range]) =>
  ['Pinnacle Anek', 'Sintony'].map(family => `@font-face{font-family:'${family}';font-style:normal;font-weight:100 800;font-display:swap;src:url('https://www.pinnacleblooms.org/verify/fonts/anek-${script}.woff2') format('woff2');unicode-range:${range}}`)
).join('\n') + `
${native}{font-family:'Pinnacle Anek',Sintony,Arial,sans-serif!important;letter-spacing:0!important;font-synthesis:none}
:is(body,main,article,p,li,dd,td,blockquote)${native}{font-weight:600!important}
:is(h1,h2,h3,h4,h5,h6)${native}{font-weight:800!important;line-height:1.45!important}
:is(button,input,select,textarea,summary,label)${native}{font-weight:700!important}
:is(strong,b,th)${native}{font-weight:800!important}
:is(a[lang],a[hreflang],.knowledge-pills a,.guide-lang-nav a,.guide-languages a,.pbn-native-button)${native}{font-weight:700!important}
`;
export const VERNACULAR_STYLE = `<style data-pinnacle-vernacular="${VERNACULAR_RELEASE}">${VERNACULAR_CSS}</style>`;

export function applyVernacularTypography(request, response, Rewriter = globalThis.HTMLRewriter) {
  const url = new URL(request.url);
  // Only public documents; never auth callbacks, APIs, exports or arbitrary hosts.
  if (!['www.pinnacleblooms.org', 'pinnacleblooms.org'].includes(url.hostname) ||
      request.method !== 'GET' || request.headers.has('range') ||
      /^\/ask\/(?:auth|account)(?:\/|$)/.test(url.pathname) ||
      response.status !== 200 || !response.headers.get('content-type')?.includes('text/html') ||
      /\bno-transform\b/i.test(response.headers.get('cache-control') || '') || !Rewriter) return response;
  const headers = new Headers(response.headers);
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest', 'content-digest', 'repr-digest']) headers.delete(name);
  headers.set('x-pinnacle-typography', VERNACULAR_RELEASE);
  // Public returning visitors get the same typography; retain their cache/privacy policy.
  return new Rewriter()
    .on('style[data-pinnacle-vernacular]', {element(el) {el.remove();}})
    .on('head', {element(el) {el.append(VERNACULAR_STYLE, {html: true});}})
    .transform(new Response(response.body, {status: response.status, statusText: response.statusText, headers}));
}
