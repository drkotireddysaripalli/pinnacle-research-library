// Residual public legacy families from the 7 October Ahrefs export.
// Reuse the established schema repairs without taking over another route owner.
import {repairKnownLegacySchema} from './legacy-social-metadata/schema.mjs';
import {repairPublicLinks} from './public-link-target.mjs';
export const LEGACY_TEMPLATE_PATHS = new Set([
 '/seva-index','/question-comprehension-study','/therapeuticai-effectiveness-study',
 '/autism-speech-aba-news','/global-research-whitebook','/school-readiness-study',
 '/abilityscore-predictive-study','/music-therapy','/therapysphere-study',
 '/seva-impact-study','/abilityscore-global-study','/parent-training','/research-studies',
 '/parent-led-generalization','/autism-speech-aba-parent-family-resources',
 '/hydro-therapy','/group-teaching','/media-coverage','/therapist-burnout-empathy',
 '/school-training','/multilingual-therapy-outcomes','/contact-national-autism-helpline-24-7',
 '/everyday-therapy-home-study','/events','/accessibility-policy','/acceptable-use-policy',
 '/cancellation-policy','/data-protection-policy','/community-guidelines',
 '/pinnacle-ai-innovations-revolutionizing-autism-history','/shipping-and-delivery-policy',
 '/everyday-therapy-program','/security-policy'
]);
const tracking=new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid']);
const decode=value=>value?.replace(/&(?:amp|#0*38|#x0*26);/gi,'&');
const enc=new TextEncoder();
// Shorten verified titles at a phrase boundary, never by cutting characters
// or rewriting clinical outcomes. A changed origin title cannot opt in.
export const LEGACY_TITLE_REPAIRS={
 '/seva-index':{before:'SEVA™ Social Equity Index Study | Pinnacle® | Autism Therapy Without Exceptions',after:'SEVA™ Social Equity Index Study | Pinnacle Blooms'},
 '/question-comprehension-study':{before:'Study: Structured Receptive Language Therapy Boosts Question Comprehension | Pinnacle Blooms',after:'Question Comprehension Study | Pinnacle Blooms'},
 '/global-research-whitebook':{before:'Pinnacle Global Research Whitebook | Validated Autism Therapy Framework – AbilityScore®, SEVA™, TherapeuticAI®, TherapySphere™',after:'Global Research Whitebook | Pinnacle Blooms'},
 '/school-readiness-study':{before:'School Readiness Study – AbilityScore® & Inclusion Outcomes | Pinnacle Blooms Network',after:'School Readiness & AbilityScore® Study | Pinnacle Blooms'},
 '/abilityscore-predictive-study':{before:'The Compass That Predicts Progress | AbilityScore® Predictive Validity Study',after:'AbilityScore® Predictive Validity Study | Pinnacle Blooms'},
 '/music-therapy':{before:'Best Music Therapy Centers in Hyderabad, Delhi, Vizag, Vija',after:'Music Therapy & Child Development | Pinnacle Blooms'}
};
export function legacyTemplateEligible(request){
 const u=new URL(request.url);
 return request.method==='GET'&&u.origin==='https://www.pinnacleblooms.org'&&
  (LEGACY_TEMPLATE_PATHS.has(u.pathname.replace(/\/$/,''))||/^\/assessments\/[a-z0-9-]+\/?$/.test(u.pathname))&&
  !request.headers.has('authorization')&&!request.headers.has('range')&&
  [...u.searchParams.keys()].every(k=>tracking.has(k));
}
function combine(parts){const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let i=0;for(const p of parts){out.set(p,i);i+=p.length;}return out;}
function resume(parts,reader){return new ReadableStream({async pull(c){if(parts.length){c.enqueue(parts.shift());return;}try{const {done,value}=await reader.read();if(done){reader.releaseLock();c.close();}else c.enqueue(value);}catch(e){reader.releaseLock();c.error(e);}},async cancel(reason){try{await reader.cancel(reason);}finally{reader.releaseLock();}}});}
export async function repairResidualLegacyTemplates(request,response){
 if(!legacyTemplateEligible(request)||response.status!==200||!response.body||
  !/^text\/html(?:\s*;|$)/i.test(response.headers.get('content-type')||'')||
  /charset\s*=\s*(?!utf-8(?:\s|;|$))/i.test(response.headers.get('content-type')||'')||
  response.headers.has('set-cookie')||/noindex/i.test(response.headers.get('x-robots-tag')||'')||
  /no-store|no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const reader=response.body.getReader(),parts=[];let size=0,end=0,bytes;
 while(size<65536){const {done,value}=await reader.read();if(done)break;parts.push(value);size+=value.length;bytes=combine(parts);const probe=new TextDecoder().decode(bytes.subarray(0,65536)),m=/<\/head\s*>/i.exec(probe);if(m){end=enc.encode(probe.slice(0,m.index+m[0].length)).length;break;}}
 let head=null,target=null,previous=null,observedTitle='';
 if(end&&!(bytes[0]===239&&bytes[1]===187&&bytes[2]===191))try{
  head=new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(0,end));
  const canonical=[],social=[],robots=[];
  await new HTMLRewriter().on('head > title',{text(c){observedTitle+=c.text;}}).on('head > link',{element(e){if((e.getAttribute('rel')||'').toLowerCase().split(/\s+/).includes('canonical'))canonical.push(decode(e.getAttribute('href')));}})
   .on('head > meta',{element(e){if((e.getAttribute('property')||'').toLowerCase()==='og:url')social.push(decode(e.getAttribute('content')));if(['robots','googlebot','bingbot'].includes((e.getAttribute('name')||'').toLowerCase()))robots.push(e.getAttribute('content')||'');}}).transform(new Response(head)).text();
  if(canonical.length===1&&social.length===1&&!robots.some(v=>/noindex|none/i.test(v))){
   const u=new URL(canonical[0]),req=new URL(request.url);
   if(u.origin===req.origin&&u.pathname.replace(/\/$/,'')===req.pathname.replace(/\/$/,'')&&!u.hash&&!u.username&&!u.password&&
    (!u.search||u.search===req.search)&&[canonical[0],canonical[0].replace(/^https:/,'http:')].includes(social[0])){
    u.search='';target=u.href;previous=social[0];
   }
  }
 }catch{/* Unknown heads retain their original bytes. */}
 if(!target)return new Response(resume(parts,reader),{status:response.status,statusText:response.statusText,headers:response.headers});
 const title=LEGACY_TITLE_REPAIRS[new URL(request.url).pathname.replace(/\/$/,'')];
 const patched=await new HTMLRewriter().on('head > title',{element(e){if(title&&decode(observedTitle)===title.before)e.setInnerContent(title.after);}}).on('head > link',{element(e){if((e.getAttribute('rel')||'').toLowerCase().split(/\s+/).includes('canonical'))e.setAttribute('href',target);}})
  .on('head > meta',{element(e){if((e.getAttribute('property')||'').toLowerCase()==='og:url'&&decode(e.getAttribute('content'))===previous)e.setAttribute('content',target);}}).transform(new Response(head)).text();
 const headers=new Headers(response.headers);
 for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges'])headers.delete(key);
 headers.set('x-pinnacle-template-coverage','residual-20261007');
 return repairPublicLinks(repairKnownLegacySchema(new Response(resume([enc.encode(patched),bytes.subarray(end)],reader),{status:response.status,statusText:response.statusText,headers}),request.url));
}
