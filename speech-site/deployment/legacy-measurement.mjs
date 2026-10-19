import {LEGACY_TAGS,LEGACY_NOSCRIPT_TAGS,LEGACY_TAG_REPLACEMENTS} from './legacy-measurement-fingerprints.mjs';
import {PUBLIC_AD_CALL_PATH,publicAdCallMarkup,servePublicAdCall} from './public-ad-call.mjs';
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
const managedPreferenceCentre='<details id="website-preferences" aria-label="Optional measurement preferences" class="measurement-preference-centre" data-pinnacle-managed-preferences style="box-sizing:border-box;background:#fff;color:#18233f;padding:8px 12px"><summary style="min-height:44px;cursor:pointer;font-weight:700">Privacy and optional measurement</summary><div><section class="measurement-settings portal-measurement" data-speech-measurement hidden aria-labelledby="analytics-preference-title"><h3 id="analytics-preference-title">Optional analytics</h3><p>With your permission, Google Analytics measures page visits and call or enquiry-link clicks. These are not completed calls or bookings. We exclude form details, private answer paths and unrecognised URL fields. With permission, validated campaign labels and advertising click identifiers can measure how you reached us. Advertising personalisation is off.</p><div><button type="button" data-measurement-choice="accepted">Allow analytics</button><button type="button" data-measurement-choice="declined">Keep analytics off</button></div><p data-measurement-status role="status">Optional analytics is off until you choose.</p></section><section class="measurement-settings portal-measurement" data-cheq-preferences hidden aria-labelledby="traffic-preference-title"><h3 id="traffic-preference-title">Optional invalid-traffic measurement</h3><p>With your permission, CHEQ uses limited browser and device signals, advertising identifiers and cookies to measure invalid visits on public landing pages. Private reading, sign-in, enquiry-form and checkout pages stay excluded.</p><div><button type="button" data-cheq-choice="accepted">Allow traffic measurement</button><button type="button" data-cheq-choice="declined">Keep traffic measurement off</button></div><p data-cheq-status role="status">Traffic measurement is off until you choose.</p></section>'+publicAdCallMarkup+'<p><a href="https://www.pinnacleblooms.org/privacy-policy">Privacy policy</a> · <a href="https://www.pinnacleblooms.org/cookie-policy">Cookie policy and choices</a></p></div></details>';
const detailsElement=(attribute,html)=>{const pattern=new RegExp('<details\\b(?=[^>]*\\b'+attribute+'(?:\\s|=|>))[^>]*>[\\s\\S]*?<\\/details>','gi'),matches=[...html.matchAll(pattern)];return matches.length===1?matches[0]:null;};
const voidElement=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const openElementsAt=(html,end)=>{const stack=[];for(const match of html.slice(0,end).matchAll(/<\/?([a-z][\w:-]*)\b[^>]*>/gi)){const tag=match[1].toLowerCase(),closing=match[0][1]==='/';if(closing){const index=stack.findLastIndex(node=>node.tag===tag);if(index>=0)stack.length=index;}else if(!voidElement.has(tag)&&!match[0].endsWith('/>'))stack.push({tag,start:match.index,markup:match[0]});}return stack;};
export function projectManagedPreferenceHtml(html,request){
 const u=new URL(request.url);
 if(request.method!=='GET'||u.origin!=='https://www.pinnacleblooms.org'||request.headers.has('authorization')||request.headers.has('range')||(!managedPreferenceRoutes.has(u.pathname)&&!managedCentreRoute.test(u.pathname))||html.includes('data-pinnacle-managed-preferences'))return null;
 const canonical=/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i.exec(html)?.[1];
 if(canonical!==u.origin+u.pathname)return null;
 const footer=/<footer\b[^>]*\bclass=["'][^"']*\bportal-site-footer\b[^"']*["'][^>]*>/i.exec(html),footerStart=footer?.index??-1,footerEnd=html.indexOf('</footer>',footerStart);if(footerStart<0||footerEnd<0)return null;
 const analytics=detailsElement('data-speech-measurement',html),adCall=detailsElement('data-ad-call-preferences',html);if(!analytics||!adCall||analytics.index<footerStart||adCall.index<footerStart||analytics.index>footerEnd||adCall.index>footerEnd||analytics.index>=adCall.index||html.slice(analytics.index+analytics[0].length,adCall.index).trim())return null;
 const footerHtml=html.slice(footerStart,footerEnd),analyticsParents=openElementsAt(footerHtml,analytics.index-footerStart),adCallParents=openElementsAt(footerHtml,adCall.index-footerStart);if(!analyticsParents||!adCallParents||analyticsParents.length!==adCallParents.length||analyticsParents.some((parent,index)=>parent.start!==adCallParents[index].start))return null;
 const parent=analyticsParents.at(-1);if(parent?.tag!=='div'||!/\bclass=["'][^"']*\bportal-container\b[^"']*["']/i.test(parent.markup)||!analyticsParents.some(node=>node.tag==='footer'&&/\bportal-site-footer\b/.test(node.markup)))return null;
 const outside=html.slice(0,analytics.index)+managedPreferenceCentre+html.slice(analytics.index+analytics[0].length,adCall.index)+html.slice(adCall.index+adCall[0].length);
 return outside;
}
async function projectManagedPreferences(request,response){
 const u=new URL(request.url);if(request.method!=='GET'||u.origin!=='https://www.pinnacleblooms.org'||request.headers.has('authorization')||request.headers.has('range')||(!managedPreferenceRoutes.has(u.pathname)&&!managedCentreRoute.test(u.pathname)))return response;
 if(response.status!==200||!response.body||response.headers.has('set-cookie')||!response.headers.get('content-type')?.includes('text/html')||/private|no-store|no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const html=await response.text(),projected=projectManagedPreferenceHtml(html,request);if(!projected)return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(k);headers.set('x-pinnacle-preference-centre','managed-20261019');
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
const panel='<details class="measurement-settings" data-speech-measurement hidden style="box-sizing:border-box;flex:1;min-width:150px;padding:4px 12px;font-size:14px;color:#18233f"><summary style="min-height:44px;cursor:pointer">Optional analytics preferences</summary><p>With your permission, Google Analytics measures visits and contact clicks using a fixed knowledge-library identity. We exclude article paths, form details and link text. Calling works with analytics off.</p><button type="button" data-measurement-choice="accepted">Allow analytics</button><button type="button" data-measurement-choice="declined">Keep analytics off</button><p data-measurement-status role="status">Optional analytics is off until you choose.</p></details>';
const earlyCapture='(()=>{const queue=[];const listener=e=>{if(navigator.globalPrivacyControl===true)return;let permission;try{permission=JSON.parse(localStorage.getItem("pinnacle-speech-analytics-v1"));}catch{return;}if(permission?.value!=="accepted"||!Number.isFinite(permission.at)||permission.at>Date.now()||Date.now()-permission.at>=180*86400000)return;const a=e.target?.closest?.("a[href]");if(!a||queue.length>=10)return;const href=a.getAttribute("href");if(href==="tel:+919100181181")queue.push("call");else{try{const u=new URL(href,location.origin);if((u.hostname==="wa.me"&&u.pathname==="/919100181181")||(u.hostname==="api.whatsapp.com"&&u.pathname==="/send"&&u.searchParams.get("phone")==="919100181181"))queue.push("whatsapp");}catch{}}};document.addEventListener("click",listener);window.__pinnacleLegacyCapture={queue,stop(){document.removeEventListener("click",listener);}};})();';
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
  const canonicalMatches=canonical===u.origin+u.pathname||(u.pathname==='/certified-courses/'&&canonical===u.origin+'/certified-courses')||(scope==='reviewed-public-template'&&canonical?.replaceAll('&amp;','&')===u.href);
  if(!canonicalMatches||!tags.some(t=>t.includes('GTM-W9ZHX459'))||!tags.some(t=>t.includes("gtag('config', 'G-2BYLRLFRDJ')"))||!tags.some(t=>t.includes("'AW-10810823199/VNUcCMSy3YobEJ-kgKMo'")))return null;
 }
 let result=prefix.replace(tagPattern,tag=>analyticsTag(tag)?(preserveGtm&&isKnownGtmLoader(tag)?tag:replacements.get(normal(tag))||''):tag);
 if(scope==='private')return {scope,html:result,removed:tags.length};
 // A tiny, permission-checked fixed-event queue captures native early contact.
 // Both full installers are deferred until parsing, never window.load. Controls
 // remain reachable in the footer instead of displacing the parent journey.
 const controls='<details aria-label="Optional measurement preferences" class="measurement-preference-centre" style="box-sizing:border-box;background:#fff;color:#18233f;padding:8px 12px"><summary style="min-height:44px;cursor:pointer;font-weight:700">Privacy and optional measurement</summary><div>'+(preserveGtm?panel.replace('fixed knowledge-library identity','fixed public-page identity'):panel)+publicAdCallMarkup+'</div></details>';
 const inserted=(preserveGtm?'':'<script data-pinnacle-legacy-collector="early-v3">'+earlyCapture+'</script>')+'<script defer src="/pinnacle-pages-scripts/speech-measurement.js?v=legacy-cohorts-20261011-v3"></script><script type="module" src="'+PUBLIC_AD_CALL_PATH+'"></script>';
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
