// Repairs exact, reproduced public URL defects; never rewrites API/auth routes.
import {repairKnownBrokenMedia} from './legacy-social-metadata/media.mjs';
const ORIGIN='https://www.pinnacleblooms.org';
export const URL_ALIASES={
 '/ABA / Behavioral Therapy':'/best-aba-therapy-center-india-proven-improvement-rate',
 '/Special Education / Cognitive Therapy':'/best-special-education-center-call-9100181181',
 '/Special Education/Cognitive Behavioral Therapy':'/best-special-education-center-call-9100181181',
 '/allmirracles-sitemap.xml':'/sitemaps/miracles.xml',
 // Consolidate search-shaped aliases into the maintained service and centre
 // destinations. These aliases must not become thin, competing landing pages.
 '/child-psychologist':'/child-psychological-counseling',
 '/child-psychologist-near-me':'/child-psychological-counseling',
 '/child-counselor-near-me':'/child-psychological-counseling',
 '/speech-therapist-near-me':'/top-speech-therapy-center-india-proven-improvement-rate',
 '/occupational-therapist-near-me':'/best-occupational-therapy-center-india-proven-improvement-rate',
 '/autism-center-near-me':'/centers'
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
  const sameIdentity=value=>{try{const target=new URL(value,ORIGIN);return target.origin===ORIGIN&&target.pathname===u.pathname;}catch{return false;}};
  rewrite.on('link[rel="canonical"]',{element(e){const href=e.getAttribute('href');if(href!==canonical&&!old.has(href)&&!sameIdentity(href))return;if(seen)e.remove();else{e.setAttribute('href',canonical);seen=true;}}});
  rewrite.on('meta[property="og:url"]',{element(e){const value=e.getAttribute('content');if(old.has(value)||sameIdentity(value))e.setAttribute('content',canonical);}});
  if(u.pathname==='/child-psychological-counseling'){
   let title=false,description=false,heading=false;
   rewrite.on('title',{element(e){if(title)return;title=true;e.setInnerContent('Child Psychologist & Psychological Counselling | Pinnacle Blooms');}});
   rewrite.on('meta[name="description"]',{element(e){if(description)return;description=true;e.setAttribute('content','Child psychology and counselling guidance for children and families. Find a Pinnacle centre and call 9100 181 181 to confirm the professional, appointment and fee.');}});
   rewrite.on('h1',{element(e){if(heading)return;heading=true;e.setInnerContent('Child psychology and counselling support for children and families');e.after('<section id="child-psychology-next-step" aria-label="Talk with Pinnacle about child psychology and counselling" style="box-sizing:border-box;max-width:980px;margin:18px auto;padding:20px;border:1px solid #d9bfd6;border-radius:16px;background:#fff;color:#18233f;box-shadow:0 10px 28px rgba(24,35,63,.08)"><p style="margin:0 0 14px;font-size:1.05rem;line-height:1.65">Talk through concerns about emotions, behaviour, learning or participation. Pinnacle will help you identify an appropriate centre and confirm the available qualified professional, appointment and fee before you visit.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a href="tel:+919100181181" data-cta="child-psychology-call" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border-radius:999px;background:#652579;color:#fff;text-decoration:none;font-weight:800">Call 9100 181 181</a><a href="/enroll-autism-speech-aba-therapies-india?service=psychological-counselling" data-cta="child-psychology-assessment" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border:2px solid #652579;border-radius:999px;background:#fff;color:#652579;text-decoration:none;font-weight:800">Request an assessment</a><a href="/centers" style="display:inline-flex;align-items:center;min-height:48px;color:#315c80;font-weight:800">Find a Pinnacle centre near you</a></div><p style="margin:14px 0 0;font-size:.92rem;line-height:1.55">Pinnacle does not diagnose from this page. Confirm the suitable service and professional for your child with the receiving team.</p></section>',{html:true});}});
  }
 }
 return repairKnownBrokenMedia(rewrite.transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers})));
}

