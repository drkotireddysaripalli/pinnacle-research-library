import selection from './selected-reference-data.json';
import optimized from './selected-reference-optimized.json';
const origin='https://www.pinnacleblooms.org';
const key=value=>{const u=new URL(value);return u.origin+u.pathname.replace(/%[0-9a-f]{2}/gi,v=>v.toUpperCase());};
const selected=new Map(Object.entries(selection).map(([u,r])=>[key(u),r]));
export const referenceStylePath='/pinnacle-pages-styles/selected-reference-20261016.css';
export const referenceCSS=`#ability-reference-illustrations,[data-guru-gallery-source]{font-family:'Pinnacle Anek',Sintony,Arial,sans-serif;font-weight:600}#ability-reference-illustrations :is(h2,h3),[data-guru-gallery-source] h2{font-weight:800}#ability-reference-illustrations,[data-guru-gallery-source]{margin:2rem 0;padding:clamp(1rem,3vw,2rem);border:1px solid #dce7ec;border-radius:16px;background:#f7fbfc;color:#122b49;line-height:1.7;overflow-wrap:anywhere}#ability-reference-illustrations h2,[data-guru-gallery-source] h2{font-size:clamp(1.35rem,3vw,1.9rem);line-height:1.4}#ability-reference-illustrations h3{font-size:1.1rem;line-height:1.6}#ability-reference-illustrations figure,[data-guru-gallery-source] figure{margin:1.25rem 0;padding:1rem;background:#fff;border:1px solid #e3ebef;border-radius:12px;content-visibility:auto;contain-intrinsic-size:auto 400px}#ability-reference-illustrations img,[data-guru-gallery-source] img{display:block;width:auto;max-width:100%;height:auto;max-height:520px;object-fit:contain;margin-inline:auto}#ability-reference-illustrations figcaption,[data-guru-gallery-source] figcaption{margin-top:.8rem;font-size:1rem}#ability-reference-illustrations a,[data-guru-gallery-source] a{text-decoration:underline;text-underline-offset:.18em}#ability-reference-illustrations :is([lang=te],[lang=hi]){font-family:'Pinnacle Anek',Arial,sans-serif;font-weight:600}#ability-reference-illustrations :is(h2,h3)[lang]{font-weight:800}`;
const derivativePaths=new Map(Object.values(optimized).map(r=>[r.path,r]));
export function serveSelectedReferenceAsset(request){
 const u=new URL(request.url);if(u.origin!==origin||!['GET','HEAD'].includes(request.method))return null;
 if(u.pathname===referenceStylePath)return new Response(request.method==='HEAD'?null:referenceCSS,{headers:{'content-type':'text/css; charset=utf-8','cache-control':'public,max-age=31536000,immutable','x-content-type-options':'nosniff'}});
 const image=derivativePaths.get(u.pathname);if(!image)return null;
 const bytes=request.method==='HEAD'?null:Uint8Array.from(atob(image.base64),c=>c.charCodeAt(0));
 return new Response(bytes,{headers:{'content-type':'image/webp','content-length':String(image.bytes),'cache-control':'public,max-age=31536000,immutable','x-content-type-options':'nosniff'}});
}
export function repairSelectedReferences(request,response,Rewriter=globalThis.HTMLRewriter){
 const u=new URL(request.url),row=selected.get(key(u));
 if(u.origin!==origin||!row||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||!Rewriter)return response;
 const headers=new Headers(response.headers);for(const name of ['content-length','content-encoding','etag','last-modified','digest','content-digest','repr-digest','content-md5'])headers.delete(name);
 headers.set('x-pinnacle-selected-reference','20261016');
 let canonicalCount=0,canonicalOK=false,inserted=false;
 const exactCanonical=value=>{try{const v=new URL(value);return !v.search&&!v.hash&&key(v)===key(u);}catch{return false;}};
 const permitted=(slot,value)=>row.kind==='guru'&&canonicalCount===1&&canonicalOK&&row.replacement[slot]?.fallback_permitted_for_integration&&row.replacement[slot].observed_exact_urls.includes(value);
 const insert={element(e){if(canonicalCount!==1||!canonicalOK||inserted)return;inserted=true;e.append(row.html,{html:true});}};
 let rewriter=new Rewriter().on('link[rel=canonical]',{element(e){canonicalCount++;canonicalOK=exactCanonical(e.getAttribute('href'));}})
  .on('head',{element(e){e.onEndTag(t=>{if(canonicalCount===1&&canonicalOK)t.before(`<link rel="stylesheet" data-selected-reference-style href="${referenceStylePath}">`,{html:true});});}})
  .on('link[data-selected-reference-style]',{element(e){e.remove();}})
  .on('#ability-reference-illustrations,[data-guru-gallery-source]',{element(e){e.remove();}})
  .on('meta[property="og:image"]',{element(e){if(permitted('og_image',e.getAttribute('content')))e.setAttribute('content',row.replacement.sequence_zero_url);}})
  .on('.guru-gallery > figure > img',{element(e){
   if(!permitted('visible_primary',e.getAttribute('src')))return;
   const url=row.replacement.sequence_zero_url,image=optimized[url];e.setAttribute('src',url);e.setAttribute('data-selected-reference-primary','20261016');
   if(image){e.before(`<picture><source type="image/webp" srcset="${image.path}">`,{html:true});e.after('</picture>',{html:true});e.setAttribute('width',String(image.width));e.setAttribute('height',String(image.height));}
  }});
 rewriter=row.kind==='guru'?rewriter.on('article.guru-article',insert):rewriter.on('main',insert);
 return rewriter.transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
