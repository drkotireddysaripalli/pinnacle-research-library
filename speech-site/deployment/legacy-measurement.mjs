import {LEGACY_TAGS} from './legacy-measurement-fingerprints.mjs';
import {PUBLIC_AD_CALL_PATH,publicAdCallMarkup,servePublicAdCall} from './public-ad-call.mjs';
export const serveLegacyMeasurementCall=servePublicAdCall;
const normal=text=>text.replaceAll('\r\n','\n').trim();
const fingerprints=new Set(LEGACY_TAGS.map(normal));
const tagPattern=/<script\b[^>]*>[\s\S]*?<\/script>/gi;
const analyticsTag=tag=>/googletagmanager|googleadservices|G-2BYLRLFRDJ|AW-10810823199|GTM-W9ZHX459|_googWcm/.test(tag);
export function legacyMeasurementScope(request){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||request.method!=='GET'||request.headers.has('range'))return null;
 if(/^\/(?:account|auth|admin|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(u.pathname))return 'private';
 if(/^\/(?:ma|t|b|c)\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(u.pathname))return 'knowledge';
 if(u.pathname==='/contact-national-autism-helpline-24-7')return 'helpline';
 return null;
}
const panel='<details class="measurement-settings" data-speech-measurement hidden style="box-sizing:border-box;flex:1;min-width:150px;padding:4px 12px;font-size:14px;color:#18233f"><summary style="min-height:44px;cursor:pointer">Optional analytics preferences</summary><p>With your permission, Google Analytics measures visits and contact clicks using a fixed knowledge-library identity. We exclude article paths, form details and link text. Calling works with analytics off.</p><button type="button" data-measurement-choice="accepted">Allow analytics</button><button type="button" data-measurement-choice="declined">Keep analytics off</button><p data-measurement-status role="status">Optional analytics is off until you choose.</p></details>';
export function migrateLegacyPrefix(prefix,request){
 const scope=legacyMeasurementScope(request);if(!scope||prefix.includes('data-pinnacle-legacy-measurement'))return null;
 const tags=[...prefix.matchAll(tagPattern)].map(m=>m[0]).filter(analyticsTag);
 if(!tags.length||tags.some(tag=>!fingerprints.has(normal(tag))))return null;
 if(scope!=='private'){
  const u=new URL(request.url),canonical=/\blink\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i.exec(prefix)?.[1];
  if(canonical!==u.origin+u.pathname||!tags.some(t=>t.includes('GTM-W9ZHX459'))||!tags.some(t=>t.includes("gtag('config', 'G-2BYLRLFRDJ')"))||!tags.some(t=>t.includes("'AW-10810823199/VNUcCMSy3YobEJ-kgKMo'")))return null;
 }
 let result=prefix.replace(tagPattern,tag=>analyticsTag(tag)?'':tag);
 if(scope==='private')return {scope,html:result,removed:tags.length};
 // The blocking first-party collector precedes parent-visible links. No Google
 // runtime remains ahead of its applicable permission. Existing call helper is
 // reused with its own independent permission and original-number restoration.
 const inserted='<aside aria-label="Optional measurement preferences" style="display:flex;flex-wrap:wrap;align-items:start;background:#fff">'+panel+publicAdCallMarkup.replace('padding:16px','flex:1;min-width:150px;padding:4px 12px').replace('margin-bottom:88px','margin-bottom:0')+'</aside><script src="/pinnacle-pages-scripts/speech-measurement.js?v=legacy-cohorts-20261011"></script><script type="module" src="'+PUBLIC_AD_CALL_PATH+'"></script>';
 result=result.replace(/<body\b([^>]*)>/i,(_,attributes)=>'<body'+attributes+' data-page-variant="legacy_knowledge" data-pinnacle-legacy-measurement="'+scope+'">'+inserted);
 return {scope,html:result,removed:tags.length};
}
function resume(parts,reader){return new ReadableStream({start(c){for(const part of parts)if(part.length)c.enqueue(part);},async pull(c){try{const {value,done}=await reader.read();if(done){reader.releaseLock();c.close();}else c.enqueue(value);}catch(e){reader.releaseLock();c.error(e);}},cancel(reason){return reader.cancel(reason);}});}
export async function repairLegacyMeasurement(request,response){
 if(!legacyMeasurementScope(request)||response.status!==200||!response.body||response.headers.has('content-security-policy')||!response.headers.get('content-type')?.includes('text/html')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const reader=response.body.getReader(),decoder=new TextDecoder(),encoder=new TextEncoder(),chunks=[];let prefix='',done=false;
 while(prefix.length<131072&&!/<body\b[^>]*>/i.test(prefix)){const part=await reader.read();if(part.done){done=true;break;}chunks.push(part.value);prefix+=decoder.decode(part.value,{stream:true});}
 if(done)prefix+=decoder.decode();
 const raw=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));let offset=0;for(const part of chunks){raw.set(part,offset);offset+=part.length;}
 const migrated=migrateLegacyPrefix(prefix,request),headers=new Headers(response.headers),pending=raw.subarray(encoder.encode(prefix).length);
 if(migrated){for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(k);headers.set('x-pinnacle-legacy-measurement',migrated.scope);headers.set('x-pinnacle-removed-tag-count',String(migrated.removed));}
 const parts=migrated?[encoder.encode(migrated.html),pending]:[raw];if(done)reader.releaseLock();
 let result=new Response(done?(migrated?migrated.html:raw):resume(parts,reader),{status:response.status,statusText:response.statusText,headers});
 if(!migrated)return result;
 return new HTMLRewriter().on('iframe[src]',{element(e){const src=e.getAttribute('src');try{const u=new URL(src,request.url);if(u.hostname==='www.googletagmanager.com'&&u.pathname==='/ns.html'&&u.searchParams.get('id')==='GTM-W9ZHX459')e.remove();}catch{}}}).on('a[href]',{element(e){if(migrated.scope==='private')return;let u;try{u=new URL(e.getAttribute('href'),request.url);}catch{return;}if(u.protocol==='tel:'&&/^\+?919100181181$|^9100181181$/.test(u.pathname.replace(/[ ()-]/g,''))){e.setAttribute('href','tel:+919100181181');e.setAttribute('data-cta','knowledge-call');}if((u.hostname==='wa.me'&&u.pathname==='/919100181181')||(u.hostname==='api.whatsapp.com'&&u.pathname==='/send'&&u.searchParams.get('phone')==='919100181181'))e.setAttribute('data-cta','knowledge-whatsapp');}}).transform(result);
}
