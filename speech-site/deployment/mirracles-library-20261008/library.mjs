import {css, playerJs, brandLogoBase64} from './assets.mjs';

export const ORIGIN = 'https://www.pinnacleblooms.org';
export const PAGE_SIZE = 24;
const HOME = '/allmirracles';
const ASSETS = HOME + '/_assets/';
const PHONE = 'tel:+919100181181';
const DEFAULT_DESCRIPTION = 'Explore published Pinnacle videos, read the evidence, and discuss a child-specific next step with our team.';
const brandLogoBytes = Uint8Array.from(atob(brandLogoBase64), c=>c.charCodeAt(0));
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsonHtml = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
export function displayTitle(record) {
  const original=String(record.title||'').trim();
  const title=original.replace(/#([^\s#]+)/g,(_,tag)=>
    /^(?:pinnaclemirracles|1autismtherapycentresnetwork)$/i.test(tag)?'':
    ' '+tag.replace(/([a-z])([A-Z])/g,'$1 $2')+' '
  ).replace(/\s+/g,' ').trim();
  return title||original||'Published record '+record.id;
}
const absolute = path => new URL(path, ORIGIN).href;

function pathKey(path) {
  try {
    const parts = path.split('/').map(part => {
      const text = decodeURIComponent(part);
      if (/[\\/?#\x00-\x1f\x7f]/.test(text) || text === '.' || text === '..') throw Error('path');
      return text;
    });
    return parts.join('/').replace(/\/$/, '');
  } catch { return null; }
}
function imageURL(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password &&
      ['www.pinnacleblooms.org','videodelivery.net','i.ytimg.com','images.pinnacleblooms.org'].includes(u.hostname) ? u.href : null;
  } catch { return null; }
}
export function playerURL(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password ||
      !['www.youtube.com','youtube.com','www.youtube-nocookie.com'].includes(u.hostname) ||
      !/^\/embed\/[\w-]{11}$/.test(u.pathname)) return null;
    return 'https://www.youtube-nocookie.com' + u.pathname + '?autoplay=1&rel=0';
  } catch { return null; }
}
function publishedDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return null;
  const [year,month,day] = value.slice(0,10).split('-').map(Number);
  if (year < 1000 || new Date(Date.UTC(year,month-1,day)).toISOString().slice(0,10) !== value.slice(0,10) || Number(value.slice(11,13))>23) return null;
  return value;
}
// Legacy descriptions contain old scale/percentage/patent/superlative claims.
// Preserve the source in the generated candidate data, but do not republish those
// claims as current prose or machine-readable clinical evidence.
function safeDescription(record) {
  const text = String(record.description || '').trim();
  if (!text || text.length > 2048 || /97\s*%|world['’]?s\s+(?:only|first|best|greatest)|patent(?:ed|\s+granted)|\b(?:cure|guaranteed|diagnos(?:es|is|e))\b|\d[\d,.]*\s*(?:million|billion|crore|lakh)|#1\s+autism/i.test(text)) return null;
  return text;
}
export function videoObject(record) {
  const description = safeDescription(record), poster = imageURL(record.poster), uploadDate = publishedDate(record.published);
  const player = playerURL(record.player);
  if (!record.title || !description || !poster || !uploadDate || !player) return null;
  return {'@type':'VideoObject','@id':absolute(record.path)+'#video',name:record.title,description,
    thumbnailUrl:[poster],uploadDate,embedUrl:player.split('?')[0],url:absolute(record.path)};
}
function categoryURL(key) { return HOME + '/category/' + encodeURIComponent(key); }
function pageURL(base, page, q = '') {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (q) params.set('q', q);
  return base + (params.size ? '?' + params : '');
}
const a = (url, label, attrs='') => `<a href="${escapeHtml(url)}"${attrs}>${escapeHtml(label)}</a>`;
const call = () => a(PHONE,'Call 9100 181 181',' class="call"');
function sharedHeader(navigation) {
  return `<a class="skip" href="#main">Skip to content</a><header class="brand-header"><div class="wrap"><div class="brand-row">${a('/', '', ' class="brand-logo" aria-label="Pinnacle Blooms Network home"').replace('</a>',`<img src="${ASSETS}logo.png" width="650" height="242" alt="Pinnacle Blooms Network" loading="eager" decoding="async"></a>`)}<div class="brand-actions">${call()}${a('/centers','Find a centre')}${a('/enroll-autism-speech-aba-therapies-india','Arrange a visit')}</div></div><nav class="brand-nav" aria-label="Pinnacle approach and evidence">${navigation.main.map(x=>a(x.url,x.label)).join('')}</nav></div></header>`;
}
function sharedFooter(navigation) {
  return `<footer class="brand-footer"><div class="wrap"><h2>Support that connects with everyday life</h2><nav class="footer-links" aria-label="Therapies">${navigation.therapy.map(x=>a(x.url,x.label)).join('')}</nav><nav class="footer-links" aria-label="Evidence and contact">${a('/verify/','Verify the evidence')}${a('/faq','Parent questions')}${a('/sunshine','Development resources')}${a('/contact-national-autism-helpline-24-7','Contact Pinnacle')}${a('/policies','Policies and your rights')}${a('/privacy-policy','Privacy')}${a('https://wa.me/919100181181','WhatsApp Pinnacle',' rel="noreferrer"')}</nav><p class="source-note">Information supports a conversation with your care team. Goals, support and progress are individual to each child.</p><p class="source-note">Pinnacle Blooms Network · Operated by Bharath Healthcare Laboratories Private Limited.</p></div></footer>`;
}
function nextStep() {
  return `<section class="next-step"><h2>What would be meaningful for your child?</h2><p>Bring your questions to our team. Discuss assessment, a child-specific plan, everyday practice and how progress will be reviewed.</p><div class="next-actions">${call()}${a('/enroll-autism-speech-aba-therapies-india','Arrange a first conversation')}${a('/verify/','Read the evidence')}</div></section>`;
}
function card(record, level='h2') {
  const poster = imageURL(record.poster);
  return `<article class="card">${a(record.path,'').replace('</a>',`<div class="card-media">${poster?`<img src="${escapeHtml(poster)}" alt="" width="480" height="270" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:'<span>Published archive</span>'}</div><div class="card-copy">${record.category?`<span class="category">${escapeHtml(record.category)}</span>`:''}<${level}>${escapeHtml(displayTitle(record))}</${level}><span class="read">Open this video record →</span></div></a>`)}</article>`;
}
function pagination(base, page, pages, q) {
  if (pages <= 1) return '';
  return `<nav class="pagination" aria-label="Video pages">${page>1?a(pageURL(base,page-1,q),'← Previous',' rel="prev"'):''}<span aria-current="page">Page ${page} of ${pages}</span>${page<pages?a(pageURL(base,page+1,q),'Next →',' rel="next"'):''}</nav>`;
}
function documentHTML({title,description=DEFAULT_DESCRIPTION,canonical,image,body,schema=[],catalogue,noindex=false,shell}) {
  const reader=shell?.reader;
  if(reader?.journey)body=body.includes('</header>')?body.replace('</header>','</header>'+reader.journey):body+reader.journey;
  const footer=reader?String(shell?.footer||'').replace('src="/pinnacle-pages-scripts/speech-measurement.js"','src="'+escapeHtml(reader.measurement)+'"'):shell?.footer;
  const graph = {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage','@id':canonical+'#page',url:canonical,name:title,description,isAccessibleForFree:!reader,...(reader?{hasPart:{'@type':'WebPageElement',isAccessibleForFree:false,cssSelector:'.ask-registration-content'}}:{})},...schema]};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | Pinnacle Blooms Network</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${noindex?'noindex, follow':'index, follow, max-image-preview:large'}"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}">${image?`<meta property="og:image" content="${escapeHtml(image)}">`:''}${shell?.head??''}${reader?.head??''}<link rel="stylesheet" href="${ASSETS}library.css"><script type="application/ld+json">${jsonHtml(graph)}</script></head><body class="ask-page" data-page-variant="knowledge">${shell?.header??sharedHeader(catalogue.navigation)}${reader?.html??''}<main id="main" class="wrap ask-registration-content">${body}</main>${footer??sharedFooter(catalogue.navigation)}<nav class="mobile-call" aria-label="Contact Pinnacle">${call()}</nav></body></html>`;
}
function htmlResponse(html, {status=200,head=false,privatePage=false,noindex=false,responseHeaders}={}) {
  const headers = new Headers({
    'Content-Type':'text/html; charset=utf-8','Cache-Control':privatePage||status!==200?'private, no-store':'public, max-age=0, s-maxage=300',
    'Referrer-Policy':'strict-origin','X-Content-Type-Options':'nosniff','X-Robots-Tag':noindex||status!==200?'noindex, follow':'index, follow, max-image-preview:large',
    'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://videodelivery.net https://i.ytimg.com https://images.pinnacleblooms.org; frame-src https://www.youtube-nocookie.com; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'",
    'X-Pinnacle-Mirracles-Library':'candidate-20261008'
  });
  // Trusted common-shell policy can replace the candidate CSP. Keep HTML/cache
  // semantics under this router so search and cookie responses cannot be cached.
  for (const [name,value] of new Headers(responseHeaders)) headers.set(name,value);
  headers.set('Content-Type','text/html; charset=utf-8');
  headers.set('Cache-Control',privatePage||status!==200?'private, no-store':'public, max-age=0, s-maxage=300');
  headers.set('X-Robots-Tag',noindex||status!==200?'noindex, follow':'index, follow, max-image-preview:large');
  return new Response(head?null:html,{status,headers});
}

/** Root integrates this pure router at public routes only. No bindings or app
 * routes are installed here. loadJson(name) reads generated candidate assets.
 * Optional shell contains trusted, server-rendered existing header/footer HTML.
 */
export function createMirraclesLibrary({loadJson,shell,responseHeaders}={}) {
  if (typeof loadJson !== 'function') throw new TypeError('A public-data asset loader is required');
  let cataloguePromise;
  async function catalogue() {
    cataloguePromise ??= Promise.resolve().then(()=>loadJson('catalogue')).then(c=> {
      const canonicalById = new Map(c.records.map(r=>[r.id,r]));
      const byId = new Map(canonicalById);
      // Authoritative old Id -> existing public F25 identity. No chains or title joins.
      for (const [oldId,targetId] of Object.entries(c.legacyIds||{})) {
        const target=canonicalById.get(targetId);
        if (!/^[0-9]+$/.test(oldId) || typeof targetId!=='string' || !/^[0-9]+$/.test(targetId) ||
            !target || oldId===targetId || canonicalById.has(oldId)) throw Error('Conflicting authoritative legacy identity');
        byId.set(oldId,target);
      }
      const byPath = new Map();
      for (const r of c.records) byPath.set(pathKey(r.path),r);
      for (const [p,id] of Object.entries(c.aliasPaths||{})) {
        const key = pathKey(p), target = canonicalById.get(id);
        const alias = key?.match(/^\/mirracles\/(\d+)\/[^/]+$/);
        if (!alias || !target || (byPath.has(key) && byPath.get(key)!==target) ||
          (byId.has(alias[1]) && byId.get(alias[1])!==target)) throw Error('Conflicting public identity alias');
        byPath.set(key,target);
        // Only source-verified cross-ID paths supply an old numeric identity.
        // Bare IDs and changed slugs then retain the normal canonical redirect.
        byId.set(alias[1],target);
      }
      return {...c,byId,byPath,ordered:c.order.map(id=>byId.get(id)),categoryKeys:new Set(c.categories.map(c=>c.key))};
    }).catch(error=>{cataloguePromise=undefined;throw error;});
    return cataloguePromise;
  }
  return async function handle(request) {
    const url = new URL(request.url), path = pathKey(url.pathname), head = request.method==='HEAD', privatePage = request.headers.has('cookie');
    if (url.origin!==ORIGIN || !['GET','HEAD'].includes(request.method) || request.headers.has('authorization') || request.headers.has('range')) return null;
    if (path===ASSETS+'logo.png') return new Response(head?null:brandLogoBytes,{headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'}});
    if (path===ASSETS+'library.css' || path===ASSETS+'player.js') return new Response(head?null:(path.endsWith('.css')?css:playerJs),{headers:{'Content-Type':path.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
    const numeric = path?.match(/^\/mirracles\/(\d+)(?:\/[^/]*)?$/);
    const categoryPath = path?.match(/^\/allmirracles\/category\/([^/]+)$/);
    const legacyCategory = path?.match(/^\/allmirracles\/([^/]+)$/);
    if (path!==HOME && !numeric && !categoryPath && !legacyCategory) return null;
    try {
      const c = await catalogue();
      // An unknown neighboring path is not a library category or a new app route.
      if (legacyCategory && !c.categoryKeys.has(legacyCategory[1])) return null;
      const trustedShell = typeof shell==='function'?await shell({request,currentPath:url.pathname}):shell;
      const notFound = () => htmlResponse(documentHTML({title:'Video page not found',canonical:absolute(HOME),catalogue:c,shell:trustedShell,noindex:true,body:`<section class="hero"><h1>That video page was not found.</h1><p>${a(HOME,'Browse the published video library')}</p>${nextStep()}</section>`}),{status:404,head,noindex:true,responseHeaders});
      if (numeric) {
        const record = c.byPath.get(path) || c.byId.get(numeric[1]);
        if (!record) return null; // Unknown numeric records keep the existing owner.
        if (!c.byPath.has(path)) {
          const target = new URL(record.path,ORIGIN); target.search=url.search;
          return new Response(null,{status:308,headers:{Location:target.href,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
        }
        const chunk = await loadJson('details-'+record.chunk), detail = chunk[record.id];
        if (!detail || detail.path!==record.path) throw Error('Public detail missing');
        const player = playerURL(detail.player), poster = imageURL(detail.poster), date = publishedDate(detail.published);
        const category = detail.category;
        const related = c.ordered.filter(r=>r.id!==record.id && (category?r.category===category:true)).slice(0,6);
        const description = safeDescription(detail);
        const video = videoObject(detail);
        const body = `<nav class="crumbs" aria-label="Breadcrumb"><ol><li>${a(HOME,'Video library')}</li>${category?`<li>${a(categoryURL(category),category)}</li>`:''}<li aria-current="page">Video record</li></ol></nav><header class="hero"><p class="kicker">Pinnacle Mirracles · Published video</p><h1>${escapeHtml(displayTitle(detail))}</h1>${date?`<p class="caption">Published <time datetime="${escapeHtml(date)}">${escapeHtml(date.slice(0,10))}</time></p>`:''}<p class="source-note">A published record of one experience or explanation. It does not predict another child’s result.</p></header><div class="video-layout"><section aria-label="Published video">${player?`<div class="player"><button type="button" data-mirracles-player="${escapeHtml(player)}" data-video-title="${escapeHtml(displayTitle(detail))}" aria-label="Play video: ${escapeHtml(displayTitle(detail))}">${poster?`<img src="${escapeHtml(poster)}" alt="" width="480" height="270" loading="eager" fetchpriority="high" decoding="async" referrerpolicy="no-referrer">`:''}<span class="play-label"><span>▶ Play video</span></span></button></div><p class="source-note">Selecting Play loads the YouTube player. ${a(detail.player,'Open the published player directly',' rel="noreferrer"')}</p><script src="${ASSETS}player.js" defer></script>`:'<div class="empty"><h2>Published archive record</h2><p>A playable video is not available in the current public source for this record.</p></div>'}</section><aside class="video-aside"><h2>Talk about your child’s next step</h2><p>Ask about assessment, meaningful goals and a plan that connects therapy with daily life.</p>${call()}<ul><li>${a('/centers','Find a centre')}</li><li>${a('/verify/','Read the evidence and its limits')}</li><li>${a('/sunshine','Explore development resources')}</li></ul></aside></div>${description?`<section class="content-section"><h2>Published description</h2><p class="published-description">${escapeHtml(description)}</p></section>`:''}<section class="content-section"><h2>${category?'More in '+escapeHtml(category):'More published videos'}</h2><div class="grid">${related.map(r=>card(r,'h3')).join('')}</div></section>${nextStep()}`;
        const sourceTitle=detail.title&&displayTitle(detail)!==detail.title?`<details class="content-section"><summary>Published source title</summary><p class="published-description">${escapeHtml(detail.title)}</p></details>`:'';
        return htmlResponse(documentHTML({title:displayTitle(detail),description:DEFAULT_DESCRIPTION,canonical:absolute(detail.path),image:poster,body:body+sourceTitle,catalogue:c,shell:trustedShell,schema:video?[video]:[]}),{head,privatePage,responseHeaders});
      }
      const category = categoryPath?.[1] || legacyCategory?.[1] || url.searchParams.get('category') || '';
      if (category && !c.categoryKeys.has(category)) return notFound();
      const rawPage = url.searchParams.get('page');
      if (rawPage && !/^[1-9]\d{0,4}$/.test(rawPage)) return notFound();
      const page = Number(rawPage||1);
      const q = (url.searchParams.get('q')||'').normalize('NFKC').replace(/[\x00-\x1f\x7f]/g,'').trim().slice(0,100);
      const base = category?categoryURL(category):HOME;
      const matches = c.ordered.filter(r=>(!category||r.category===category)&&(!q||displayTitle(r).toLocaleLowerCase().includes(q.toLocaleLowerCase())));
      const pages = Math.max(1,Math.ceil(matches.length/PAGE_SIZE));
      if (page>pages) return notFound();
      const items = matches.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
      const title = category?category+' · Mirracles video library':'Mirracles video library';
      const itemList = {'@type':'ItemList',name:title,itemListElement:items.map((r,i)=>({'@type':'ListItem',position:(page-1)*PAGE_SIZE+i+1,name:displayTitle(r),url:absolute(r.path)}))};
      const body = `<header class="hero"><p class="kicker">Pinnacle Blooms Network · Mirracles</p><h1>${escapeHtml(title)}</h1><p>Explore published videos about development, therapy activities and individual experiences. Choose a subject, shape your questions and discuss what would be meaningful for your child.</p><div class="hero-actions">${call()}${a('/verify/','Explore the evidence')}</div></header><form class="browse-form" method="get" action="${escapeHtml(base)}"><div><label for="video-search">Search published video titles</label><input id="video-search" type="search" name="q" maxlength="100" value="${escapeHtml(q)}"></div><button type="submit">Search videos</button></form><nav aria-label="Video categories"><ul class="category-list"><li>${a(HOME,'All videos',!category?' aria-current="page"':'')}</li>${c.categories.map(cat=>`<li>${a(categoryURL(cat.key),cat.label+' ('+cat.count.toLocaleString('en-IN')+')',category===cat.key?' aria-current="page"':'')}</li>`).join('')}</ul></nav><p class="caption">${matches.length.toLocaleString('en-IN')} published records${q?' matching “'+escapeHtml(q)+'”':''} · Showing ${matches.length?(page-1)*PAGE_SIZE+1:0}–${Math.min(page*PAGE_SIZE,matches.length)}. Individual experiences are not a prediction of another child’s result.</p>${items.length?`<div class="grid">${items.map(r=>card(r)).join('')}</div>`:'<div class="empty"><h2>No matching video titles</h2><p>Try another title or browse a category.</p></div>'}${pagination(base,page,pages,q)}${nextStep()}`;
      // Search terms never enter canonical/OG URLs, JSON-LD or analytics.
      return htmlResponse(documentHTML({title:title+(page>1?' · Page '+page:''),canonical:absolute(pageURL(base,page)),body,catalogue:c,shell:trustedShell,noindex:!!q,schema:[itemList]}),{head,privatePage:privatePage||!!q,noindex:!!q,responseHeaders});
    } catch {
      return htmlResponse('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Video library temporarily unavailable</title><main><h1>The video library is temporarily unavailable.</h1><p>Please try again later or <a href="tel:+919100181181">call 9100 181 181</a>.</p></main></html>',{status:503,head,noindex:true,responseHeaders});
    }
  };
}
