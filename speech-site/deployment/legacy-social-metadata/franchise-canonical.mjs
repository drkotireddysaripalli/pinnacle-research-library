const canonical='https://www.pinnacleblooms.org/franchise-autism-therapy-center';
// /franchises already redirects to this live page; canonicalising back creates a cycle.
const old=new Set(['https://www.pinnacleblooms.org/franchises','http://www.pinnacleblooms.org/franchises','https://mobile.pinnacleblooms.org/franchises','http://mobile.pinnacleblooms.org/franchises']);
export function repairFranchiseCanonical(request,response){
 const u=new URL(request.url);
 if(request.method!=='GET'||u.origin+u.pathname!==canonical||request.headers.has('authorization')||response.status!==200||!response.headers.get('content-type')?.includes('text/html'))return response;
 let seen=false;const headers=new Headers(response.headers);
 for(const key of ['content-length','content-encoding','etag','last-modified'])headers.delete(key);
 headers.set('x-pinnacle-canonical-repair','franchise-20261005');
 return new HTMLRewriter().on('link[rel="canonical"]',{element(el){
  const href=el.getAttribute('href');if(!old.has(href)&&href!==canonical)return;
  if(seen)el.remove();else{el.setAttribute('href',canonical);seen=true;}
 }}).on('meta[property="og:url"]',{element(el){if(old.has(el.getAttribute('content')))el.setAttribute('content',canonical);}})
 .transform(new Response(response.body,{status:response.status,headers}));
}
