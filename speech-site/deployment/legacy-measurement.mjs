import {LEGACY_TAGS,LEGACY_NOSCRIPT_TAGS,LEGACY_TAG_REPLACEMENTS} from './legacy-measurement-fingerprints.mjs';
import {PUBLIC_AD_CALL_PATH,servePublicAdCall} from './public-ad-call.mjs';
export const serveLegacyMeasurementCall=servePublicAdCall;
const normal=text=>text.replaceAll('\r\n','\n').trim();
const fingerprints=new Set(LEGACY_TAGS.map(normal));
const replacements=new Map(LEGACY_TAG_REPLACEMENTS.map(([old,next])=>[normal(old),next]));
for(const old of replacements.keys())fingerprints.add(old);
const tagPattern=/<script\b[^>]*>[\s\S]*?<\/script>/gi;
const analyticsTag=tag=>/googletagmanager|googleadservices|G-2BYLRLFRDJ|AW-10810823199|GTM-W9ZHX459|_googWcm/.test(tag);
const reviewedPublicTemplates=new Set(['/assessments/stuttering-assessment','/certified-courses','/certified-courses/']);
const managedPreferenceRoutes=new Set(['/','/centers','/autism-therapy','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/best-special-education-center-call-9100181181','/speech-aba-autism-assessments','/about-us','/contact','/top-speech-therapy-center-india-proven-improvement-rate']);
const managedCentreRoute=/^\/centers\/best-autism-speech-aba-occupational-therapy-center-[a-z0-9-]+$/;
const removeBalanced=(html,tag,attribute)=>{
 const open=new RegExp('<'+tag+'\\b[^>]*'+attribute+'[^>]*>','i').exec(html);if(!open)return html;
 const token=new RegExp('<\\/?'+tag+'\\b[^>]*>','gi');token.lastIndex=open.index;let depth=0,match;
 while((match=token.exec(html))){if(match[0][1]==='/')depth--;else depth++;if(depth===0)return html.slice(0,open.index)+html.slice(token.lastIndex);}
 return html;
};
export function projectManagedPreferenceHtml(html,request){
 const u=new URL(request.url);
 if(request.method!=='GET'||u.origin!=='https://www.pinnacleblooms.org'||request.headers.has('authorization')||request.headers.has('range')||(!managedPreferenceRoutes.has(u.pathname)&&!managedCentreRoute.test(u.pathname)))return null;
 const canonical=/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i.exec(html)?.[1];
 let canonicalMatches=canonical===u.origin+u.pathname;if(u.pathname==='/')try{const parsed=new URL(canonical.replaceAll('&amp;','&'));canonicalMatches=parsed.origin===u.origin&&parsed.pathname===u.pathname&&parsed.search===u.search&&!parsed.hash;}catch{canonicalMatches=false;}if(!canonicalMatches)return null;
 let result=html;
 for(const attribute of ['(?:id=["\']website-preferences["\']|data-pinnacle-managed-preferences)','data-speech-measurement','data-cheq-preferences','data-ad-call-preferences']){
  let previous;do{previous=result;result=removeBalanced(result,'details',attribute);}while(result!==previous);
 }
 result=result.replace(/<section\b[^>]*data-(?:speech-measurement|cheq-preferences)[^>]*>[\s\S]*?<\/section>/gi,'');
 // Returning visitors receive the same public document with private/no-store
 // cache headers. Version its existing collector as well as removing retired
 // controls, so a cached historical script cannot restore those controls.
 result=result.replace(/(<script\b[^>]*\bsrc=)(["'])([^"']+)\2/gi,(tag,prefix,quote,raw)=>{
  try{const src=new URL(raw.replaceAll('&amp;','&'),u);if(src.origin!==u.origin||src.pathname!=='/pinnacle-pages-scripts/speech-measurement.js')return tag;src.searchParams.set('v','measurement-completion-20261020');return prefix+quote+(raw.startsWith('/')?src.pathname+src.search:src.href).replaceAll('&','&amp;')+quote;}catch{return tag;}
 });
 return result===html?null:result;
}
async function projectManagedPreferences(request,response){
 const u=new URL(request.url);if(request.method!=='GET'||u.origin!=='https://www.pinnacleblooms.org'||request.headers.has('authorization')||request.headers.has('range')||(!managedPreferenceRoutes.has(u.pathname)&&!managedCentreRoute.test(u.pathname)))return response;
 if(response.status!==200||!response.body||response.headers.has('set-cookie')||!response.headers.get('content-type')?.includes('text/html')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const html=await response.text(),projected=projectManagedPreferenceHtml(html,request);if(!projected)return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(k);headers.set('x-pinnacle-measurement-ui','removed-20261019');
 return new Response(projected,{status:response.status,statusText:response.statusText,headers});
}
const isKnownGtmLoader=tag=>normal(tag)===normal(LEGACY_TAGS[0]);
export function legacyMeasurementScope(request){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||request.method!=='GET'||request.headers.has('range'))return null;
 if(/^\/(?:account|auth|admin|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(u.pathname))return 'private';
 if(reviewedPublicTemplates.has(u.pathname))return 'reviewed-public-template';
 if(/^\/(?:ma|t|b|c)\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(u.pathname))return 'knowledge';
 if(u.pathname==='/contact-national-autism-helpline-24-7')return 'helpline';
 return null;
}
const earlyCapture='(()=>{const queue=[];const validation=new URL(location.href).searchParams.has("validation_test");const listener=e=>{if(validation)return;const a=e.target?.closest?.("a[href]");if(!a||queue.length>=10)return;const href=a.getAttribute("href");if(href==="tel:+919100181181")queue.push("call");else{try{const u=new URL(href,location.origin);if((u.hostname==="wa.me"&&u.pathname==="/919100181181")||(u.hostname==="api.whatsapp.com"&&u.pathname==="/send"&&u.searchParams.get("phone")==="919100181181"))queue.push("whatsapp");}catch{}}};document.addEventListener("click",listener);window.__pinnacleLegacyCapture={queue,stop(){document.removeEventListener("click",listener);}};})();';
function taggedContactCanonicalMatches(canonical,requestUrl){
 if(!canonical||!requestUrl.search)return false;
 try{
  const parsed=new URL(canonical.replaceAll('&amp;','&'));
  if(parsed.origin!==requestUrl.origin||parsed.pathname!==requestUrl.pathname||parsed.hash)return false;
  const actual=[...requestUrl.searchParams].map(([key,value])=>[key.toLowerCase(),value.toLowerCase()]);
  const published=[...parsed.searchParams].map(([key,value])=>[key.toLowerCase(),value.toLowerCase()]);
  return actual.length===published.length&&actual.every(([key,value],index)=>published[index]?.[0]===key&&published[index]?.[1]===value);
 }catch{return false;}
}
export function migrateLegacyPrefix(prefix,request,{preserveGtm=false}={}){
 const scope=legacyMeasurementScope(request);if(!scope||prefix.includes('data-pinnacle-legacy-measurement'))return null;
 // These two templates are enabled only with the matched published GTM GA4
 // exceptions. Never remove their existing ClickGUARD container as a shortcut.
 if(scope==='reviewed-public-template'&&!preserveGtm)return null;
 preserveGtm=preserveGtm&&scope==='reviewed-public-template';
 const tags=[...prefix.matchAll(tagPattern)].map(m=>m[0]).filter(analyticsTag);
 if(!tags.length||tags.some(tag=>!fingerprints.has(normal(tag))))return null;
 if(scope!=='private'){
  const u=new URL(request.url),canonical=/\blink\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i.exec(prefix)?.[1];
  // Preserve the exact self canonical, including the legacy origin’s escaped
  // query. It must equal this request; no different route/host is accepted.
  const canonicalMatches=canonical===u.origin+u.pathname||(u.pathname==='/certified-courses/'&&canonical===u.origin+'/certified-courses')||(scope==='reviewed-public-template'&&canonical?.replaceAll('&amp;','&')===u.href)||(scope==='helpline'&&taggedContactCanonicalMatches(canonical,u));
  if(!canonicalMatches||!tags.some(t=>t.includes('GTM-W9ZHX459'))||!tags.some(t=>t.includes("gtag('config', 'G-2BYLRLFRDJ')"))||!tags.some(t=>t.includes("'AW-10810823199/VNUcCMSy3YobEJ-kgKMo'")))return null;
 }
 let result=prefix.replace(tagPattern,tag=>analyticsTag(tag)?(preserveGtm&&isKnownGtmLoader(tag)?tag:replacements.get(normal(tag))||''):tag);
 if(scope==='private')return {scope,html:result,removed:tags.length};
 // A tiny fixed-event queue captures native early contact without private values.
 // Both full installers are deferred until parsing, never window.load.
 const controls='';
 const inserted=(preserveGtm?'':'<script data-pinnacle-legacy-collector="early-v4">'+earlyCapture+'</script>')+'<script defer src="/pinnacle-pages-scripts/speech-measurement.js?v=measurement-completion-20261020"></script><script type="module" src="'+PUBLIC_AD_CALL_PATH+'"></script>';
 result=result.replace(/<body\b([^>]*)>/i,(_,attributes)=>'<body'+attributes+' data-page-variant="'+(preserveGtm?'legacy_public_template':'legacy_knowledge')+'" data-pinnacle-legacy-measurement="'+scope+'">'+inserted);
 return {scope,html:result,controls,preserveGtm,removed:tags.filter(tag=>!(preserveGtm&&isKnownGtmLoader(tag))).length};
}
function resume(parts,reader){return new ReadableStream({start(c){for(const part of parts)if(part.length)c.enqueue(part);},async pull(c){try{const {value,done}=await reader.read();if(done){reader.releaseLock();c.close();}else c.enqueue(value);}catch(e){reader.releaseLock();c.error(e);}},cancel(reason){return reader.cancel(reason);}});}
// Exact reviewed noscript bytes can cross arbitrary origin chunks. Preserve a
// bounded tail, UTF-8 and every unrelated noscript block without buffering HTML.
export function stripLegacyNoscript(body){
 const tokens=[...new Set(LEGACY_NOSCRIPT_TAGS.flatMap(t=>[t,t.replaceAll('\r\n','\n')]))],keep=Math.max(...tokens.map(t=>t.length))-1,decoder=new TextDecoder(),encoder=new TextEncoder();let pending='';
 return body.pipeThrough(new TransformStream({transform(bytes,c){pending+=decoder.decode(bytes,{stream:true});for(const token of tokens)pending=pending.replaceAll(token,'');if(pending.length>keep){c.enqueue(encoder.encode(pending.slice(0,-keep)));pending=pending.slice(-keep);}},flush(c){pending+=decoder.decode();for(const token of tokens)pending=pending.replaceAll(token,'');c.enqueue(encoder.encode(pending));}}));
}
// The two fingerprinted templates are enabled after published GTM v7 ownership
// exclusions. Every other public family retains its previous exclusion policy.
export async function repairLegacyExclusions(request,response,{reviewedPublicTemplates=true}={}){
 response=await projectManagedPreferences(request,response);
 const scope=legacyMeasurementScope(request);
 if(scope==='reviewed-public-template')return reviewedPublicTemplates?repairLegacyMeasurement(request,response,{preserveGtm:true}):response;
 if(scope!=='private'&&(request.headers.has('authorization')||response.headers.has('set-cookie')))return response;
 if(!scope||response.status!==200||!response.body||!response.headers.get('content-type')?.includes('text/html')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 if(scope==='private')return repairLegacyMeasurement(request,response);
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(k);
 headers.set('x-pinnacle-legacy-exclusion','exact-noscript-only');
 return new Response(stripLegacyNoscript(response.body),{status:response.status,statusText:response.statusText,headers});
}
export async function repairLegacyMeasurement(request,response,{preserveGtm=false}={}){
 const scope=legacyMeasurementScope(request);
 if(scope!=='private'&&(request.headers.has('authorization')||response.headers.has('set-cookie')))return response;
 if(!scope||response.status!==200||!response.body||response.headers.has('content-security-policy')||!response.headers.get('content-type')?.includes('text/html')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const reader=response.body.getReader(),decoder=new TextDecoder(),encoder=new TextEncoder(),chunks=[];let prefix='',done=false;
 // The maintained Android contact variant places its known delayed analytics
 // installer after the form. Its complete bounded body must be fingerprinted;
 // a header-only migration would leave a second competing collector behind.
 const completeContact=scope==='helpline'||scope==='reviewed-public-template',limit=completeContact?2097152:131072;let bytesRead=0;
 while(bytesRead<limit&&(completeContact||!/<body\b[^>]*>/i.test(prefix))){const part=await reader.read();if(part.done){done=true;break;}chunks.push(part.value);bytesRead+=part.value.length;prefix+=decoder.decode(part.value,{stream:true});}
 if(done)prefix+=decoder.decode();
 const raw=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));let offset=0;for(const part of chunks){raw.set(part,offset);offset+=part.length;}
 const migrated=completeContact&&!done?null:migrateLegacyPrefix(prefix,request,{preserveGtm}),headers=new Headers(response.headers),pending=raw.subarray(encoder.encode(prefix).length);
 if(migrated){for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(k);headers.set('x-pinnacle-legacy-measurement',migrated.scope);headers.set('x-pinnacle-removed-tag-count',String(migrated.removed));}
 const parts=migrated?[encoder.encode(migrated.html),pending]:[raw];if(done)reader.releaseLock();
 let result=new Response(done?(migrated?migrated.html:raw):resume(parts,reader),{status:response.status,statusText:response.statusText,headers});
 if(!migrated)return result;
 if(!migrated.preserveGtm)result=new Response(stripLegacyNoscript(result.body),{status:result.status,statusText:result.statusText,headers:result.headers});
 return new HTMLRewriter().on('body',{element(e){if(migrated.controls)e.append(migrated.controls,{html:true});}}).on('iframe[src]',{element(e){if(migrated.preserveGtm)return;const src=e.getAttribute('src');try{const u=new URL(src,request.url);if(u.hostname==='www.googletagmanager.com'&&u.pathname==='/ns.html'&&u.searchParams.get('id')==='GTM-W9ZHX459')e.remove();}catch{}}}).on('a[href]',{element(e){if(migrated.scope==='private')return;let u;try{u=new URL(e.getAttribute('href'),request.url);}catch{return;}if(u.protocol==='tel:'&&/^\+?919100181181$|^9100181181$/.test(u.pathname.replace(/[ ()-]/g,''))){e.setAttribute('href','tel:+919100181181');e.setAttribute('data-cta','knowledge-call');}if((u.hostname==='wa.me'&&u.pathname==='/919100181181')||(u.hostname==='api.whatsapp.com'&&u.pathname==='/send'&&u.searchParams.get('phone')==='919100181181'))e.setAttribute('data-cta','knowledge-whatsapp');}}).transform(result);
}
