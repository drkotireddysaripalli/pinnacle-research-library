// Same scoped corrections as the maintained Astro styles, for already-published
// documents in the current complete asset union. No contact or intake changes.
export const presentationPath='/pinnacle-pages-scripts/presentation-repair-20261016.css';
export const presentationCSS=`.centre-proof-context{grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))!important}@media(max-width:760px){.centre-proof-context{grid-template-columns:1fr!important}}.institutional-hero~section p a,.institutional-research-aliases p a{text-decoration:underline;text-underline-offset:.18em}@media(max-width:600px){.pbn-book-upsells{grid-template-columns:minmax(0,1fr)!important}}`;
export function servePresentationRepair(request){
 const u=new URL(request.url);if(u.origin!=='https://www.pinnacleblooms.org'||u.pathname!==presentationPath||!['GET','HEAD'].includes(request.method))return null;
 return new Response(request.method==='HEAD'?null:presentationCSS,{headers:{'content-type':'text/css; charset=utf-8','cache-control':'public,max-age=31536000,immutable','x-content-type-options':'nosniff'}});
}
export function repairPublicPresentation(request,response,Rewriter=globalThis.HTMLRewriter){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||!Rewriter)return response;
 if(!(/^\/centers\/[^/]+$/.test(u.pathname)||u.pathname==='/pinnacle-global-autism-framework'||/^\/books(?:\/|$)/.test(u.pathname)))return response;
 const h=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','digest','content-digest','repr-digest','content-md5'])h.delete(key);
 h.set('x-pinnacle-presentation','targeted-regressions-20261016');
 return new Rewriter().on('link[data-pinnacle-presentation]',{element(e){e.remove();}}).on('head',{element(e){e.append(`<link rel="stylesheet" data-pinnacle-presentation="20261016" href="${presentationPath}">`,{html:true});}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers:h}));
}
