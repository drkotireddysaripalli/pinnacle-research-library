// Exact aliases read back from the live site on 12 October. This changes
// emitted navigation, not redirects, forms, labels, payments or route ownership.
export const CANONICAL_NAV_ALIASES=Object.freeze({
 '/about':'/about-pinnacle-proven-improvement-rate',
 '/all-resources':'/autism-speech-aba-parent-family-resources',
 '/assesments':'/speech-aba-autism-assessments',
 '/everyday-therapy-program':'/everyday-therapy-home-study'
});
export function canonicalNavigationTarget(href){
 if(typeof href!=='string'||!(/^(?:https?:\/\/(?:www\.)?pinnacleblooms\.org(?:[/?#]|$)|\/(?!\/))/.test(href)))return href;
 let u;try{u=new URL(href.replace(/&(?:amp|#0*38|#x0*26);/gi,'&'),'https://www.pinnacleblooms.org');}catch{return href;}
 if(u.port||u.username||u.password)return href;
 const target=CANONICAL_NAV_ALIASES[u.pathname.replace(/\/$/,'')];if(!target)return href;
 u.protocol='https:';u.hostname='www.pinnacleblooms.org';u.pathname=target;
 return href.startsWith('/')?u.pathname+u.search+u.hash:u.href;
}
export function repairCanonicalNavigation(request,response){
 if(request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||
 !response.headers.get('content-type')?.includes('text/html')||response.headers.has('set-cookie')||
 /private|no-store|no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const headers=new Headers(response.headers);
 for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(key);
 headers.set('x-pinnacle-navigation-aliases','canonical-20261012');
 return new HTMLRewriter().on('a[href]',{element(el){const before=el.getAttribute('href'),after=canonicalNavigationTarget(before);if(after!==before)el.setAttribute('href',after);}})
 .transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
