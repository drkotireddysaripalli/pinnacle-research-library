// Published Guru articles recovered from the original public API. No operational
// data, private routes, new claims, centre-ID defaults or customer writes.
export const GURU_RECOVERY_RELEASE='guru-public-recovery-20261009';
const ORIGIN='https://www.pinnacleblooms.org';
const PHONE='tel:+919100181181';
// Eight existing public Guru pages, fetched and source-matched 9 October; their origin content stays intact.
const existingArticles=[{"canonicalPath":"/guru/5974/daptation","title":"daptation"},{"canonicalPath":"/guru/5979/unusual-behaviours-in-adhd","title":"unusual behaviours in adhd"},{"canonicalPath":"/guru/6015/differentiated","title":"differentiated"},{"canonicalPath":"/guru/6129/monday-morning-smiles-%F0%9F%98%8A","title":"Monday morning smiles 😊"},{"canonicalPath":"/guru/6380/%F0%9F%8C%B8-navratri-day-9-%E2%80%93-sri-durga-devi-amma-bala-roopam-%F0%9F%8C%B8","title":"🌸 Navratri Day 9 – Sri Durga Devi Amma Bala Roopam 🌸"},{"canonicalPath":"/guru/6381/%F0%9F%8C%B8-day-8-%E2%80%93-navratri-blessings-of-sri-saraswati-devi-amma-%F0%9F%8C%B8","title":"🌸 Day 8 – Navratri Blessings of Sri Saraswati Devi Amma 🌸"},{"canonicalPath":"/guru/6382/%F0%9F%8C%B8-day-8-%E2%80%93-navratri-blessings-of-sri-saraswati-devi-amma-%F0%9F%8C%B8","title":"🌸 Day 8 – Navratri Blessings of Sri Saraswati Devi Amma 🌸"},{"canonicalPath":"/guru/6383/%F0%9F%8C%B8-navaratri-day-7-%E2%80%93-sri-maha-chandi-devi-amma-%F0%9F%8C%B8","title":"🌸 Navaratri Day 7 – Sri Maha Chandi Devi Amma 🌸"}];
const ENQUIRY='/enroll-autism-speech-aba-therapies-india';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const css=`.guru-recovery :is([lang="und-Deva"],[lang="und-Deva"] *){font-family:'Pinnacle Anek',Sintony,Arial,sans-serif!important;letter-spacing:0!important;font-weight:600;font-synthesis:none}.guru-recovery :is(h1,h2,h3,h4,h5,h6)[lang="und-Deva"],.guru-recovery [lang="und-Deva"] :is(h1,h2,h3,h4,h5,h6){font-weight:800;line-height:1.45}.guru-recovery{width:min(1100px,calc(100% - 36px));margin:24px auto 64px;color:#122b49}.guru-recovery h1{font-size:clamp(1.9rem,5vw,3rem);line-height:1.18;overflow-wrap:anywhere}.guru-recovery .guru-kicker{font-weight:700;color:#087c83}.guru-actions{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}.guru-actions a{min-height:48px;padding:12px 18px;border:1px solid #087c83;border-radius:10px;font-weight:700;display:inline-flex;align-items:center;color:#087c83}.guru-actions .guru-call{background:#d5263b;border-color:#d5263b;color:#fff}.guru-recovery a:focus-visible{outline:3px solid #ae2789;outline-offset:4px}.guru-archive-context{padding:18px 20px;border-left:4px solid #087c83;background:#f4fafb;margin:24px 0;font-size:1rem;line-height:1.65}.guru-article{max-width:85ch;margin:32px 0;font-size:1.1rem;line-height:1.75;overflow-wrap:anywhere}.guru-article img,.guru-gallery img{display:block;max-width:100%;height:auto}.guru-article table{display:block;max-width:100%;overflow:auto}.guru-article pre{white-space:pre-wrap}.guru-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:18px;margin:24px 0}.guru-gallery figure{margin:0}.guru-gallery img{width:100%;object-fit:contain}.guru-next{padding:24px;border:1px solid #dce7ec;border-radius:12px}.guru-next nav{display:flex;flex-wrap:wrap;gap:12px 20px}.guru-mobile-call{display:none}@media(max-width:760px){.guru-recovery{margin-bottom:100px}.guru-mobile-call{display:block;position:fixed;bottom:0;left:0;right:0;padding:9px 18px calc(9px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #dce7ec;z-index:90}.guru-mobile-call a{display:block;text-align:center;background:#d5263b;color:white;border-radius:10px;padding:12px;font-weight:700;min-height:48px}.guru-article{font-size:1.05rem}}`;

function response(body,request,{status=200,headers:extra={}}={}){
 const headers=new Headers(extra);
 headers.set('content-type','text/html; charset=utf-8');
 headers.set('cache-control',request.headers.has('cookie')||new URL(request.url).search||status!==200?'private, no-store':'public, max-age=0, s-maxage=300');
 headers.set('x-content-type-options','nosniff');
 headers.set('referrer-policy','strict-origin');
 headers.set('x-robots-tag',status===200?'index, follow, max-image-preview:large':'noindex, follow');
 headers.set('x-pinnacle-guru-recovery',GURU_RECOVERY_RELEASE);
 headers.set('content-security-policy',"object-src 'none'; base-uri 'self'; frame-ancestors 'self'");
 return new Response(request.method==='HEAD'?null:body,{status,headers});
}
function document(record,shell){
 const canonical=ORIGIN+record.canonicalPath;
 const description='Read this dated Pinnacle Guru article: '+record.title;
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':canonical+'#page',url:canonical,name:record.title},
  {'@type':'Article','@id':canonical+'#article',headline:record.title,url:canonical,mainEntityOfPage:{'@id':canonical+'#page'},...(record.published?{datePublished:record.published}:{}),publisher:{'@id':ORIGIN+'/verify/#organization'}}
 ]};
 const images=record.images||[];
 const articleLanguage=record.language||'en';
 const actions=`<div class="guru-actions"><a class="guru-call" href="${PHONE}">Call 9100 181 181</a><a href="${ENQUIRY}">Request an assessment</a></div>`;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(record.title)} | Pinnacle Blooms Network</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${escape(record.title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}">${images[0]?`<meta property="og:image" content="${escape(images[0].src)}">`:''}${shell.head}<style>${css}</style><script type="application/ld+json">${json(schema)}</script></head><body data-page-variant="knowledge">${shell.header}<main id="main" class="guru-recovery"><nav aria-label="Breadcrumb"><a href="/">Pinnacle Blooms</a> / <a href="/guru">Pinnacle Guru articles</a></nav><header><p class="guru-kicker">Pinnacle Guru · Published archive</p><h1 lang="${escape(articleLanguage)}">${escape(record.title)}</h1>${record.published?`<p>Published <time datetime="${record.published}">${record.published}</time></p>`:''}${actions}</header><aside class="guru-archive-context" aria-label="Article context">This dated article is retained in its original context. For current service, regulatory and research information, <a href="/verify/">visit Pinnacle Verify</a>. Developmental information is general; assessment, support and progress are individual. <a href="/disclaimer-and-limitations-of-liabilities">Read the information policy</a>.</aside>${images.length?`<div class="guru-gallery">${images.map((img,i)=>`<figure><img src="${escape(img.src)}" alt="${escape(img.alt)}" loading="${i===0?'eager':'lazy'}" decoding="async" referrerpolicy="no-referrer"></figure>`).join('')}</div>`:''}<article class="guru-article" lang="${escape(articleLanguage)}" aria-label="Published article">${record.body}</article>${record.video?`<p><a href="${escape(record.video)}" rel="noopener noreferrer">Open the original linked media</a></p>`:''}<section class="guru-next"><h2>Discuss a useful next step for your child</h2><p>Speak with Pinnacle about your questions, a child-specific assessment and everyday support.</p>${actions}<nav aria-label="Related Pinnacle resources"><a href="/centers">Find a Pinnacle centre</a><a href="/ask">Ask Pinnacle</a><a href="/faq">Parent questions</a><a href="/sunshine">Development resources</a><a href="/verify/">Evidence and verification</a></nav></section></main>${shell.footer}<nav class="guru-mobile-call" aria-label="Contact Pinnacle"><a href="${PHONE}">Call 9100 181 181</a></nav></body></html>`;
}

export function createGuruRecovery({loadJson,shell}={}){

function directory(data,shell,request){
 const u=new URL(request.url),raw=u.searchParams.get('page')||'1';
 const records=[...Object.values(data.records),...existingArticles],size=24,pages=Math.ceil(records.length/size);
 if(!/^[1-9]\d{0,3}$/.test(raw)||Number(raw)>pages)return response('<!doctype html><html lang="en"><title>Page not found</title><main><h1>Article page not found</h1><a href="/guru">Browse articles</a></main></html>',request,{status:404});
 const page=Number(raw),pagePath=n=>'/guru'+(n===1?'':'?page='+n),canonical=ORIGIN+pagePath(page);
 const items=records.slice((page-1)*size,page*size);
 return response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pinnacle Guru articles'+(page>1?' · Page '+page:'')+' | Pinnacle Blooms</title><meta name="description" content="Browse dated Pinnacle Guru articles and connect your questions with current guidance, evidence and child-specific support."><link rel="canonical" href="'+canonical+'">'+shell.head+'<style>'+css+'</style></head><body data-page-variant="knowledge">'+shell.header+'<main id="main" class="guru-recovery"><p class="guru-kicker">Pinnacle Blooms Network · Knowledge library</p><h1>Pinnacle Guru articles</h1><p>Explore dated articles in their original context. For current research, service and regulatory information, <a href="/verify/">read Pinnacle Verify</a>. Discuss what is relevant to your child with a qualified professional.</p><div class="guru-actions"><a class="guru-call" href="'+PHONE+'">Call 9100 181 181</a><a href="'+ENQUIRY+'">Request an assessment</a><a href="/allmirracles">Browse published videos</a></div><p>Page '+page+' of '+pages+'</p><ul>'+items.map(r=>'<li><h2><a href="'+escape(r.canonicalPath)+'">'+escape(r.title)+'</a></h2></li>').join('')+'</ul><nav class="guru-actions" aria-label="Article pages">'+Array.from({length:pages},(_,i)=>'<a href="'+pagePath(i+1)+'"'+(i+1===page?' aria-current="page"':'')+'>Page '+(i+1)+'</a>').join('')+'</nav></main>'+shell.footer+'</body></html>',request);
}

 if(typeof loadJson!=='function'||!shell)throw new TypeError('Published article loader and established common shell required');
 let sourcePromise;
 const read=()=>sourcePromise??=Promise.resolve().then(()=>loadJson('articles')).then(data=>{
  if(data.version!==GURU_RECOVERY_RELEASE||!data.records)throw Error('Unexpected published article source');
  return data;
 }).catch(error=>{sourcePromise=undefined;throw error});
 return async function handleGuruRecovery(request){
  const url=new URL(request.url);
  if(url.protocol!=='https:'||!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(url.hostname)||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization')||request.headers.has('range'))return null;
  const match=url.pathname.match(/^\/guru\/(\d+)(?:\/([^/]+))?\/?$/);
   const isDirectory=url.pathname==='/guru'||url.pathname==='/guru/';
   if(!match&&!isDirectory)return null;
   try{if(match?.[2]&&/[\\/?#\x00-\x1f\x7f]/.test(decodeURIComponent(match[2])))return null;}catch{return null;}
  try{
    const data=await read();
    if(isDirectory){
     if(url.hostname!=='www.pinnacleblooms.org'||url.pathname==='/guru/'){url.hostname='www.pinnacleblooms.org';url.pathname='/guru';return new Response(null,{status:308,headers:{location:url.href,'cache-control':'private, no-store'}});}
     const shared=typeof shell==='function'?await shell():shell;
     if(!shared?.head||!shared.header||!shared.footer)throw Error('Common shell unavailable');
     return directory(data,shared,request);
    }
    const record=data.records[match[1]];
   if(!record)return null;
   if(url.hostname!== 'www.pinnacleblooms.org'||!record.paths.includes(url.pathname.replace(/\/$/,''))){
    return new Response(null,{status:308,headers:{location:ORIGIN+record.canonicalPath+url.search,'cache-control':'private, no-store'}});
   }
   const shared=typeof shell==='function'?await shell():shell;
   if(!shared?.head||!shared.header||!shared.footer)throw Error('Common shell unavailable');
   return response(document(record,shared),request);
  }catch{
   return response('<!doctype html><html lang="en"><head><title>Article temporarily unavailable | Pinnacle Blooms</title></head><body><main><h1>This article is temporarily unavailable</h1><p>Please try again shortly.</p><p><a href="'+PHONE+'">Call 9100 181 181</a></p></main></body></html>',request,{status:503,headers:{'retry-after':'60'}});
  }
 };
}
