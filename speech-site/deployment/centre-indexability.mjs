// Correct the preview head only on existing maintained public pages that
// already declare index/follow in the receiving handler's HTTP header. This
// changes neither operating status, advertising holds nor unknown profiles.
const ids=['anna-nagar-chennai-tamilnadu-india','jayanagar-bengaluru-india','kukatpally-hyderabad-telangana-india','rajahmundry-ap-india','tirupati-ap-india','labbipet-vijayawada-ap-india','lbnagar-hyderabad-telangana-india','nad-vizag-ap-india'];
export const publishedCentreIndexabilityPaths=new Set(ids.map(x=>'/centers/best-autism-speech-aba-occupational-therapy-center-'+x));
export function repairCentreIndexability(request,response){
 const u=new URL(request.url),robots=response.headers.get('x-robots-tag')||'';
 if(u.origin!=='https://www.pinnacleblooms.org'||!publishedCentreIndexabilityPaths.has(u.pathname)||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||!/\bindex\b/i.test(robots)||/\bnoindex\b/i.test(robots))return response;
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])h.delete(k);h.set('x-pinnacle-centre-indexability','published-header-parity-20261012');
 return new HTMLRewriter().on('head meta[name="robots"]',{element(e){if(/^noindex\s*,\s*nofollow$/i.test(e.getAttribute('content')||''))e.setAttribute('content','index, follow, max-image-preview:large');}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers:h}));
}
