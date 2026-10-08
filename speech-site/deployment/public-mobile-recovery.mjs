// Bounded recovery of a reproduced ASP.NET mobile-rendering exception on four
// named public destinations. It preserves the original URL, headers and query for attribution.
// It owns no account, API, payment, form submission or child-report route.
const identities=new Map([
 ['/',/^#1 Autism Therapy Centres Network/i],
 ['/contact-national-autism-helpline-24-7',/^Contact Us - Pinnacle Blooms Network/i],
 ['/careers',/^Careers at Pinnacle Blooms Network/i],
 ['/research-studies',/^Pinnacle Research Studies/i],
 ['/child-psychological-counseling',/^Best Child Counselling Centers/i],
 ['/franchise-autism-therapy-center',/^Advantages of pinnacle blooms network franchises/i],
 ['/epass',/^#1 Autism Therapy Centres Network/i],
 ['/TOS',/^Pinnacle Blooms - Terms of usage/i],
 ['/tos',/^Pinnacle Blooms - Terms of usage/i]
]);
const desktop='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
export function knownMobilePublicRequest(request){
 const u=new URL(request.url);
 return ['GET','HEAD'].includes(request.method)&&u.origin==='https://www.pinnacleblooms.org'&&identities.has(u.pathname)&&/Android|iPhone|iPad|Mobile/i.test(request.headers.get('user-agent')||'')&&!['authorization','range','if-range','if-match','if-none-match','if-modified-since','if-unmodified-since'].some(k=>request.headers.has(k))&&!/\bno-transform\b/i.test(request.headers.get('cache-control')||'');
}
async function boundedText(response){
 const reader=response.body?.getReader();if(!reader)return '';let bytes=0;const chunks=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>4*1024*1024){await reader.cancel();throw Error('Public HTML exceeds known recovery limit');}chunks.push(value);}}finally{reader.releaseLock();}
 const data=new Uint8Array(bytes);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.length;}return new TextDecoder('utf-8',{fatal:true}).decode(data);
}
function canonicalPath(html){
 const tag=html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];const href=tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
 try{const u=new URL(href?.replaceAll('&amp;','&'));return u.origin==='https://www.pinnacleblooms.org'?u.pathname:null;}catch{return null;}
}
export async function fetchPublicOrigin(request,fetcher=fetch){
 const original=await fetcher(request);
 if(!knownMobilePublicRequest(request)||original.status!==500||!original.headers.get('content-type')?.includes('text/html'))return original;
 try{
  if(request.method==='GET'){
   const error=await boundedText(original.clone());
   const path=new URL(request.url).pathname;
   const rootFaqFailure=['/','/epass'].includes(path)&&[
    'Unexpected character encountered while parsing value: &lt;. Path &#39;&#39;, line 0, position 0.',
    'PinnacleBlooms.MISC.Utility.GetFaqs(String lang, String category)',
    'ASP._Page_Views_Home_Index_V9_Mobile_cshtml.Execute()',
    'Index-V9.Mobile.cshtml:line 11'
   ].every(fragment=>error.includes(fragment));
   const counsellingFaqFailure=path==='/child-psychological-counseling'&&error.includes('PinnacleBlooms.MISC.Utility.GetFaqs(String lang, String category)')&&error.includes('ASP._Page_Views_Home_PsychologicalCounselling_V9_Mobile_cshtml.Execute()');
   if(!/<title>\s*Error\s*<\/title>/i.test(error)||!error.includes('Newtonsoft.Json.JsonReaderException')||!(error.includes('GetStaffandCentersData')||rootFaqFailure||counsellingFaqFailure))return original;
  }
  const headers=new Headers(request.headers);headers.set('user-agent',desktop);headers.set('sec-ch-ua-mobile','?0');
  const retry=await fetcher(new Request(request,{method:'GET',headers}));
  if(retry.status!==200||!retry.headers.get('content-type')?.includes('text/html'))return original;
  let html=await boundedText(retry);const u=new URL(request.url),title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()||'';
  const canonical=canonicalPath(html);
  if(!identities.get(u.pathname).test(title)||!(canonical===u.pathname||(u.pathname==='/TOS'&&canonical==='/tos')||(u.pathname==='/franchise-autism-therapy-center'&&canonical==='/franchises')))return original;
  // Campaigns remain in the browser URL; the public canonical/OG identity is clean.
  html=html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i,`<link rel="canonical" href="${u.origin+canonical}">`);
  const out=new Headers(retry.headers);for(const k of ['content-length','content-encoding','etag','last-modified','age','expires'])out.delete(k);
  out.set('cache-control','private, no-store');out.set('x-pinnacle-public-render-recovery','mobile-origin-20261008');out.set('vary',[...new Set((out.get('vary')||'').split(',').map(v=>v.trim()).filter(Boolean).concat('User-Agent'))].join(', '));
  return new Response(request.method==='HEAD'?null:html,{status:200,headers:out});
 }catch{return original;}
}
