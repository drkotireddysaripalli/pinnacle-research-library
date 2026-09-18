// Public verification content and narrowly scoped hostname discovery metadata.
// Existing source access remains protected by the Worker secret binding.
const ORIGIN = 'https://pinnacle-verify.saripalli.chatgpt.site';
const PUBLIC = 'https://www.pinnacleblooms.org/verify';
const PREFIX = '/verify';
const FAVICON_LINKS = '<link rel="icon" type="image/png" sizes="50x50" href="https://www.pinnacleblooms.org/verify/favicon.png"><link rel="icon" sizes="50x50" href="https://www.pinnacleblooms.org/verify/favicon.ico"><link rel="apple-touch-icon" sizes="50x50" href="https://www.pinnacleblooms.org/verify/favicon.png">';
const MIME = {'.png':'image/png','.ico':'image/x-icon','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8','.pdf':'application/pdf'};
// Generated from the published HTML inventory by scripts/build-discovery.cjs.
const HTML_PATHS = ["/evidence/district-register.html","/evidence/evidence-register.html","/evidence/global-context.html","/evidence/hfr-register.html","/evidence/recognition-register.html","/evidence/records/appreciations.html","/evidence/records/awards.html","/evidence/records/bis.html","/evidence/records/books.html","/evidence/records/classification.html","/evidence/records/district-register.html","/evidence/records/dossier.html","/evidence/records/dpiit.html","/evidence/records/external-validation.html","/evidence/records/gst.html","/evidence/records/hfr.html","/evidence/records/iso13485.html","/evidence/records/iso27001.html","/evidence/records/lei.html","/evidence/records/marks-copyright.html","/evidence/records/mca.html","/evidence/records/md3.html","/evidence/records/md5.html","/evidence/records/methodology.html","/evidence/records/operating-metrics.html","/evidence/records/outcome-claim.html","/evidence/records/pan.html","/evidence/records/patents.html","/evidence/records/rpwd-attapur.html","/evidence/records/rpwd-begumpet.html","/evidence/records/rpwd-nellore.html","/evidence/records/rpwd-nizamabad.html","/evidence/records/sae3000.html","/evidence/records/september-handout.html","/evidence/records/sovereign-walkthrough.html","/evidence/records/srs4400.html","/evidence/records/study-portfolio.html","/evidence/records/udyam.html","/evidence/records/whitebook.html","/evidence/scale-register.html","/evidence/study-index.html","/index.html"];

async function readTextLimited(response, limit = 8 * 1024 * 1024) {
  const reader = response.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let total = 0, text = '';
  try {
    for (;;) {
      const {done,value} = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) { await reader.cancel(); throw new Error('Response exceeds text limit'); }
      text += decoder.decode(value,{stream:true});
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}

function transformedHeaders(source, type) {
  const h = new Headers(source);
  for (const key of ['content-length','content-encoding','etag','last-modified','age','expires']) h.delete(key);
  if (type) h.set('content-type',type);
  return h;
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    if (incoming.hostname !== 'www.pinnacleblooms.org') return fetch(request);

    // One favicon per hostname: add the existing brand mark to the homepage head.
    // The site's visible content and existing metadata are preserved.
    if (incoming.pathname === '/') {
      const response = await fetch(request);
      if (response.status !== 200 || !response.headers.get('content-type')?.includes('text/html')) return response;
      const h = transformedHeaders(response.headers);
      h.set('cache-control','public, max-age=60');
      if (request.method === 'HEAD') return new Response(null,{status:response.status,headers:h});
      return new HTMLRewriter().on('head',{element(element){element.append(FAVICON_LINKS,{html:true});}}).transform(new Response(response.body,{status:response.status,headers:h}));
    }

    // Root robots.txt governs this hostname; retain all original disallow rules.
    if (incoming.pathname === '/robots.txt') {
      const upstream = await fetch(new Request(request,{method:'GET'}));
      if (upstream.status !== 200) return upstream;
      let text = await readTextLimited(upstream,65536);
      if (!text.includes(PUBLIC+'/sitemap.xml')) text = text.trimEnd()+'\n\n# Pinnacle verification evidence\nSitemap: '+PUBLIC+'/sitemap.xml\n';
      const h = transformedHeaders(upstream.headers,'text/plain; charset=utf-8');
      h.set('cache-control','public, max-age=300');
      return new Response(request.method === 'HEAD'?null:text,{status:200,headers:h});
    }
    if (incoming.pathname === '/llms.txt') return Response.redirect(PUBLIC+'/llms.txt',308);

    const isVerify = incoming.pathname === PREFIX || incoming.pathname.startsWith(PREFIX+'/');
    if (!isVerify) return fetch(request);
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
    if (incoming.pathname === PREFIX || incoming.pathname === PREFIX+'/index.html' || incoming.pathname === PREFIX+'/index') return Response.redirect(PUBLIC+'/'+incoming.search,308);
    let tail = incoming.pathname.slice(PREFIX.length);
    if (tail !== '/' && HTML_PATHS.includes(tail+'.html')) return Response.redirect(PUBLIC+tail+'.html'+incoming.search,308);
    if (tail.endsWith('.html')) tail = tail.slice(0,-5);
    const upstream = new URL(ORIGIN+tail);upstream.search=incoming.search;
    const headers = new Headers(request.headers);
    headers.set('Host','pinnacle-verify.saripalli.chatgpt.site');
    headers.delete('cookie');headers.delete('if-none-match');headers.delete('if-modified-since');
    headers.set('OAI-Sites-Authorization','Bearer '+env.SITES_BYPASS_TOKEN);
    const response = await fetch(upstream,{method:request.method,headers,redirect:'manual'});
    const out = new Headers(response.headers);
    out.delete('set-cookie');out.delete('content-length');out.delete('age');out.delete('expires');
    if (response.headers.has('location')) {
      const location = new URL(response.headers.get('location'),upstream);
      if (location.origin === ORIGIN) out.set('location',location.href.replace(ORIGIN,PUBLIC));
      return new Response(null,{status:response.status,headers:out});
    }
    const extension = tail.match(/\.[a-z]+$/)?.[0];
    if (response.status === 200 && MIME[extension]) out.set('content-type',MIME[extension]);
    out.set('x-content-type-options','nosniff');
    const type = out.get('content-type') || '';
    const textual = /text\/html|text\/plain|application\/json|xml|manifest\+json/i.test(type);
    out.set('cache-control',textual?'no-store':'public, max-age=3600');
    if (request.method === 'HEAD') return new Response(null,{status:response.status,headers:out});
    if (!textual || !response.ok) return new Response(response.body,{status:response.status,headers:out});
    let body = await readTextLimited(response);
    body = body.replaceAll(ORIGIN,PUBLIC).replaceAll('href="/','href="/verify/').replaceAll('src="/','src="/verify/').replaceAll('action="/','action="/verify/').replaceAll('url(/','url(/verify/').replaceAll('/verify/verify/','/verify/');
    body = body.replace(/\bsrcset="([^"]*)"/g,(_,candidates)=>'srcset="'+candidates.split(',').map(candidate=>candidate.replace(/^(\s*)\/(?!\/|verify(?:\/|$))/,'$1/verify/')).join(',')+'"');
    const h=transformedHeaders(out);
    return new Response(body,{status:response.status,headers:h});
  }
};
