// Repairs exact, reproduced public URL defects; never rewrites API/auth routes.
import {repairKnownBrokenMedia} from './legacy-social-metadata/media.mjs';
const ORIGIN='https://www.pinnacleblooms.org';
export const URL_ALIASES={
 '/ABA / Behavioral Therapy':'/best-aba-therapy-center-india-proven-improvement-rate',
 '/Special Education / Cognitive Therapy':'/best-special-education-center-call-9100181181',
 '/Special Education/Cognitive Behavioral Therapy':'/best-special-education-center-call-9100181181',
 '/allmirracles-sitemap.xml':'/sitemaps/miracles.xml'
};
const metadataPaths=new Map([
 ['/child-psychological-counseling',new Set(['https://mobile.pinnacleblooms.org/child-psychological-counseling','http://www.pinnacleblooms.org/child-psychological-counseling','http://mobile.pinnacleblooms.org/child-psychological-counseling'])],
 ['/franchise-autism-therapy-center',new Set(['https://mobile.pinnacleblooms.org/franchises','http://mobile.pinnacleblooms.org/franchises','https://www.pinnacleblooms.org/franchises','http://www.pinnacleblooms.org/franchises'])]
]);
export function urlHealthAlias(request){
 const u=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method)||u.origin!==ORIGIN||request.headers.has('authorization')||request.headers.has('range'))return null;
 let p;try{p=decodeURIComponent(u.pathname).replace(/\/$/,'');}catch{return null;}
 const target=URL_ALIASES[p];if(!target)return null;
 u.pathname=target;return new Response(null,{status:301,headers:{location:u.href,'cache-control':'public, max-age=300','x-pinnacle-url-repair':'shared-url-health-20261009'}});
}
export function healthLinkTarget(value){
 let u;try{u=new URL(value,ORIGIN);}catch{return value;}
 if(!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(u.hostname)||!['http:','https:'].includes(u.protocol)||u.port||u.username||u.password)return value;
 let p;try{p=decodeURIComponent(u.pathname).replace(/\/$/,'');}catch{return value;}
 const target=URL_ALIASES[p];return target?ORIGIN+target+u.search+u.hash:value;
}
export function repairUrlHealth(request,response){
 const u=new URL(request.url);
 if(request.method!=='GET'||u.origin!==ORIGIN||request.headers.has('authorization')||request.headers.has('range')||
  response.status!==200||!response.headers.get('content-type')?.includes('text/html')||
  /no-transform/i.test(response.headers.get('cache-control')||'')||
  /^\/(?:api|cdn-cgi|ask|account|payment)(?:\/|$)/i.test(u.pathname))return response;
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(k);
 headers.set('x-pinnacle-url-repair','shared-url-health-20261009');
 const old=metadataPaths.get(u.pathname),canonical=ORIGIN+u.pathname;
 const rewrite=new HTMLRewriter().on('a[href]',{element(e){
  const value=e.getAttribute('href'),target=healthLinkTarget(value);if(target!==value)e.setAttribute('href',target);
  let link;try{link=new URL(value,ORIGIN);}catch{return;}
  // The nine study templates link to a PDF that was never published.
  // Provide the existing dated evidence register without pretending it is a download.
  if(link.origin===ORIGIN&&link.pathname==='/assets/abilityscore-summary.pdf'){
   e.setAttribute('href','/verify/evidence/records/study-portfolio.html');e.removeAttribute('download');e.removeAttribute('target');e.setInnerContent('Read study evidence');
  }
 }});
 if(old){
  let seen=false;
  rewrite.on('link[rel="canonical"]',{element(e){const href=e.getAttribute('href');if(href!==canonical&&!old.has(href))return;if(seen)e.remove();else{e.setAttribute('href',canonical);seen=true;}}});
  rewrite.on('meta[property="og:url"]',{element(e){if(old.has(e.getAttribute('content')))e.setAttribute('content',canonical);}});
 }
 return repairKnownBrokenMedia(rewrite.transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers})));
}

