import {clearanceAliases} from './shared-clearance-aliases.mjs';
import {CANONICAL_NAV_ALIASES} from './canonical-navigation-aliases.mjs';
import {repairCentreIndexability} from './centre-indexability.mjs';
import {repairBookSearchMetadata} from './book-search-transform.mjs';
import {repairStaffCanonical} from './staff-canonical-repair.mjs';
import {publicResourceHubTarget} from './public-resource-hubs.mjs';
import {repairContactReceipt,serveContactReceiptAsset} from './contact-receipt.mjs';
import {serveEnrolmentApi} from './enrolment-handler.mjs';
import {servePresentationRepair,repairPublicPresentation} from './public-presentation-repair.mjs';
const origin='https://www.pinnacleblooms.org',aliases=new Map(Object.entries({...clearanceAliases,...CANONICAL_NAV_ALIASES}).map(([a,b])=>[decodeURIComponent(a),b]));
export function clearanceTarget(value){
 if(typeof value!=='string'||!value||!(/^(?:https?:\/\/(?:www\.)?pinnacleblooms\.org(?:[/?#]|$)|\/(?!\/))/.test(value)))return value;
 let u,p;try{u=new URL(value.replace(/&(?:amp|#0*38|#x0*26);/gi,'&'),origin);p=decodeURIComponent(u.pathname).replace(/\/$/,'');}catch{return value;}
 if(u.port||u.username||u.password)return value;const target=aliases.get(p);if(!target)return value;
 u.protocol='https:';u.hostname='www.pinnacleblooms.org';u.pathname=target;return value.startsWith('/')?u.pathname+u.search+u.hash:u.href;
}
export function clearanceRedirect(request){
 const u=new URL(request.url);if(u.origin!==origin||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization')||request.headers.has('range'))return null;
 const target=clearanceTarget(u.href);return target===u.href?null:new Response(null,{status:301,headers:{location:target,'cache-control':'private, no-store','x-pinnacle-clearance':'source-aliases-20261012'}});
}
export function repairClearanceLinks(request,response){
 const u=new URL(request.url);if(u.origin!==origin||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('cookie')||request.headers.has('range')||response.status!==200||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||!/^text\/html\b/i.test(response.headers.get('content-type')||''))return response;
 if(/^\/(?:api|ask\/auth|auth|account|checkout|payonline|shop\/cart|reports?)(?:\/|$)/i.test(u.pathname))return response;
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])h.delete(k);h.set('x-pinnacle-clearance-links','source-aliases-20261012');
 const publicMetadata=value=>{try{const old=new URL(value);return old.hostname==='d.pinnacleblooms.org'&&['http:','https:'].includes(old.protocol)&&!old.port&&!old.username&&!old.password&&old.pathname===u.pathname?origin+u.pathname:value;}catch{return value;}};
 return new HTMLRewriter().on('a[href]',{element(e){const old=e.getAttribute('href'),next=publicResourceHubTarget(clearanceTarget(old));if(next!==old)e.setAttribute('href',next);}}).on('link[rel="canonical"]',{element(e){const old=e.getAttribute('href'),next=publicMetadata(old);if(old!==next)e.setAttribute('href',next);}}).on('meta[property="og:url"],meta[name="twitter:url"]',{element(e){const old=e.getAttribute('content'),next=publicMetadata(old);if(old!==next)e.setAttribute('content',next);}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers:h}));
}
export async function repairBookSitemap(request,response){
 const u=new URL(request.url);if(u.origin!==origin||u.pathname!=='/books/sitemap.xml'||request.method!=='GET'||request.headers.has('authorization')||response.status!==200||!/(?:application|text)\/xml/i.test(response.headers.get('content-type')||''))return response;
 const body=await response.text();if(!/<urlset\b/.test(body))return new Response(body,response);
 const next=body.replace(/<url\b[^>]*>\s*<loc>https:\/\/www\.pinnacleblooms\.org\/shop<\/loc>[\s\S]*?<\/url>/g,'');const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified'])h.delete(k);h.set('x-pinnacle-sitemap-eligibility','noindex-chooser-20261012');return new Response(next,{status:response.status,statusText:response.statusText,headers:h});
}
export function createClearanceWrapper(original){return {...original,async fetch(request,env,ctx){const presentation=servePresentationRepair(request);if(presentation)return presentation;const intake=await serveEnrolmentApi(request,env);if(intake)return intake;const asset=await serveContactReceiptAsset(request,env);if(asset)return asset;const alias=clearanceRedirect(request);if(alias)return alias;const response=await repairContactReceipt(request,await original.fetch(request,env,ctx));return repairPublicPresentation(request,repairClearanceLinks(request,repairStaffCanonical(request,repairBookSearchMetadata(request,repairCentreIndexability(request,await repairBookSitemap(request,response))))));}};}
