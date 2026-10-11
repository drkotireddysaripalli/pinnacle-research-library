// Repairs exact, reproduced public URL defects; never rewrites API/auth routes.
import {repairKnownBrokenMedia} from './legacy-social-metadata/media.mjs';
import {publicLinkTarget} from './public-link-target.mjs';
import {repairKnownLegacySchema} from './legacy-social-metadata/schema.mjs';
import {RepeatedFontFaces} from './legacy-social-metadata/reading-directory.mjs';
import {repairReadingPaint} from './reading-paint.mjs';
import {repairKnownLegacyPerformance} from './legacy-social-metadata/performance.mjs';
const ORIGIN='https://www.pinnacleblooms.org';
export const URL_ALIASES={
 '/groupteaching':'/group-teaching','/parenttraining':'/parent-training',
 '/privacypolicy':'/privacy-policy','/teachertraining':'/teacher-training',
 '/certifiedcourses':'/certified-courses','/abatherapy':'/best-aba-therapy-center-india-proven-improvement-rate',
 '/schooltraining':'/school-training',
 '/ABA / Behavioral Therapy':'/best-aba-therapy-center-india-proven-improvement-rate',
 '/Special Education / Cognitive Therapy':'/best-special-education-center-call-9100181181',
 '/Special Education/Cognitive Behavioral Therapy':'/best-special-education-center-call-9100181181',
 '/allmirracles-sitemap.xml':'/sitemaps/miracles.xml',
 // Shared legacy navigation still emits these redirecting destinations on
 // hundreds of pages. Point both incoming aliases and rendered links at the
 // sole maintained destination so crawlers and parents do not pay a hop.
 '/verify':'/verify/',
 '/innovation':'/pinnacle-ai-innovations-revolutionizing-autism-history',
 '/franchises':'/franchise-autism-therapy-center',
 // Historical centre ribbons used the pre-records evidence location.
 '/verify/evidence/operating-metrics.html':'/verify/evidence/records/operating-metrics.html',
 // Consolidate search-shaped aliases into the maintained service and centre
 // destinations. These aliases must not become thin, competing landing pages.
 '/child-psychologist':'/child-psychological-counseling',
 '/child-psychologist-near-me':'/child-psychological-counseling',
 '/child-counselor-near-me':'/child-psychological-counseling',
 '/speech-therapist-near-me':'/top-speech-therapy-center-india-proven-improvement-rate',
 '/occupational-therapist-near-me':'/best-occupational-therapy-center-india-proven-improvement-rate',
 '/autism-center-near-me':'/centers',
 // Exact live 404s reported by the 10 October Semrush full crawl. Keep the
 // old identities available while consolidating them into maintained pages.
 '/centers/best-autism-speech-aba-occupational-therapy-center-srikakulkam-ap-india':'/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india',
 '/b/activities-of-daily-living':'/c/activities-of-daily-living',
 '/autism-therapy-centers/kukatpally':'/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india'
};
const FAQ_LANGUAGES={english:'en-IN',hindi:'hi',telugu:'te',tamil:'ta',kannada:'kn',malayalam:'ml',bengali:'bn'};
const metadataPaths=new Map([
 ['/child-psychological-counseling',new Set(['https://mobile.pinnacleblooms.org/child-psychological-counseling','http://www.pinnacleblooms.org/child-psychological-counseling','http://mobile.pinnacleblooms.org/child-psychological-counseling'])],
 ['/franchise-autism-therapy-center',new Set(['https://mobile.pinnacleblooms.org/franchises','http://mobile.pinnacleblooms.org/franchises','https://www.pinnacleblooms.org/franchises','http://www.pinnacleblooms.org/franchises'])]
]);
export function urlHealthAlias(request){
 const u=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method)||u.origin!==ORIGIN||request.headers.has('authorization')||request.headers.has('range'))return null;
 let p;try{p=decodeURIComponent(u.pathname).replace(/\/$/,'');}catch{return null;}
 const target=URL_ALIASES[p];if(!target)return null;
 // A canonical trailing-slash URL normalises to the same alias key. Do not
 // redirect that already-canonical request back to itself.
 if(u.pathname===target)return null;
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
  const value=e.getAttribute('href'),target=publicLinkTarget(healthLinkTarget(value));if(target===null)e.remove();else if(target!==value)e.setAttribute('href',target);
  let link;try{link=new URL(value,ORIGIN);}catch{return;}
  // Internal discovery links must remain followable. Retain any other rel
  // tokens (for example noopener) while removing the repeated legacy nofollow.
  if(link.origin===ORIGIN){
   const rel=(e.getAttribute('rel')||'').split(/\s+/).filter(Boolean).filter(token=>token.toLowerCase()!=='nofollow');
   if(rel.length)e.setAttribute('rel',rel.join(' '));else e.removeAttribute('rel');
  }
  // The nine study templates link to a PDF that was never published.
  // Provide the existing dated evidence register without pretending it is a download.
  if(link.origin===ORIGIN&&link.pathname==='/assets/abilityscore-summary.pdf'){
   e.setAttribute('href','/verify/evidence/records/study-portfolio.html');e.removeAttribute('download');e.removeAttribute('target');e.setInnerContent('Read study evidence');
  }
 }});
 const faqLanguage=u.pathname.match(/^\/faq\/([^/]+)(?:\/|$)/i)?.[1]?.toLowerCase();
 if(FAQ_LANGUAGES[faqLanguage])rewrite.on('html',{element(e){e.setAttribute('lang',FAQ_LANGUAGES[faqLanguage]);}});
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
 // Origin templates repeat identical Google Fonts links in every sidebar.
 // Remove only exact stylesheet requests before Cloudflare Fonts expands them.
 const fonts=new Set();
 rewrite.on('style:not([src])',new RepeatedFontFaces());
 rewrite.on('link[rel="stylesheet"]',{element(e){
  const href=e.getAttribute('href');let font;try{font=new URL(href,u.origin);}catch{return;}
  if(font.hostname!=='fonts.googleapis.com'||!['/css','/css2'].includes(font.pathname)||font.protocol!=='https:'||font.port||font.username||font.password)return;
  const key=font.href+'|'+(e.getAttribute('media')||'')+'|'+(e.getAttribute('disabled')??'enabled');
  if(fonts.has(key))e.remove();else fonts.add(key);
 }});
 if(u.pathname==='/speech-aba-autism-assessments')rewrite.on('main',{element(e){e.append('<section data-pinnacle-assessment-guides><h2>Read about assessment approaches</h2><p>These reference guides explain distinct assessments. The receiving professional confirms which, if any, is appropriate for your child.</p><ul><li><a href="/assessments/speech-and-language-evaluation-assessment">Speech and language evaluation</a></li><li><a href="/assessments/hamilton-depression-rating-scale-ham-d">Hamilton Depression Rating Scale: professional reference</a></li></ul></section>',{html:true});}});
 let repaired=repairKnownLegacySchema(repairKnownBrokenMedia(request,rewrite.transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}))),request.url);
 if(!repaired.headers.has('x-pinnacle-reading-performance'))repaired=repairKnownLegacyPerformance(repaired,request);
 return repairReadingPaint(request,repaired);
}

