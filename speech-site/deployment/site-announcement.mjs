import {centreOperatingHold} from '../public/pinnacle-pages-scripts/centre-operating-holds.mjs';
import {assets,centrePaths,excludedCentres} from './site-announcement-assets.mjs';
export const ANNOUNCEMENT_KEY='active';
export const ANNOUNCEMENT_CONFIG_PATH='/pinnacle-pages-data/site-announcement.json';
const scriptPath='/pinnacle-pages-scripts/site-announcement.js',stylePath='/pinnacle-pages-styles/site-announcement.css',enrolmentScriptPath='/pinnacle-pages-scripts/enrolment.js',routingPath='/pinnacle-pages-scripts/enrolment-routing.mjs';
const origin='https://www.pinnacleblooms.org';
const activeCentreIds=[...new Set(Object.entries(centrePaths).filter(([path,id])=>!excludedCentres.includes(path)&&!centreOperatingHold(id)).map(([,id])=>id))];
const servicePaths={ '/top-speech-therapy-center-india-proven-improvement-rate':'speech','/speech-therapy/service-information':'speech','/best-occupational-therapy-center-india-proven-improvement-rate':'occupational','/best-aba-therapy-center-india-proven-improvement-rate':'aba','/best-special-education-center-call-9100181181':'education' };
const escaped=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const phoneIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C10 20 4 14 3 5a2 2 0 0 1 2-2Z"/></svg>';
const arrowIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';
export function validAnnouncement(value){
 if(!value||value.schema!==1||typeof value.enabled!=='boolean')return null;
 if(!/^[a-z0-9-]{1,80}$/.test(value.id)||!/^[a-zA-Z0-9.-]{1,50}$/.test(value.revision))return null;
 const start=Date.parse(value.startsAt),end=Date.parse(value.expiresAt);if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return null;
 const fields={title:140,summary:220,regularPrice:40,offerPrice:40,limit:200,description:600,terms:1000,expiryLabel:220,enquiryLabel:80,phoneLabel:80};
 for(const [key,max]of Object.entries(fields))if(typeof value[key]!=='string'||value[key].length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value[key]))return null;
 for(const key of ['detailsPath','enquiryPath']){let u;try{u=new URL(value[key],origin)}catch{return null}if(!value[key]?.startsWith('/')||value[key].startsWith('//')||u.origin!==origin||u.username||u.password)return null;}
 if(value.phone!=='tel:+919100181181')return null;
 return Object.fromEntries(['schema','id','revision','enabled','startsAt','expiresAt','detailsPath','enquiryPath','phone',...Object.keys(fields)].map(k=>[k,value[k]]));
}
export function announcementActive(config,now=Date.now()){return !!config?.enabled&&now>=Date.parse(config.startsAt)&&now<Date.parse(config.expiresAt);}
export async function readAnnouncement(env,now=Date.now()){
 try{const config=validAnnouncement(await env.PINNACLE_ANNOUNCEMENTS?.get(ANNOUNCEMENT_KEY,{type:'json',cacheTtl:60}));return {active:announcementActive(config,now),config,serverNow:now};}catch{return {active:false,config:null,serverNow:now};}
}
export function announcementEligible(request,response){
 const u=new URL(request.url),p=u.pathname.toLowerCase();
 if(![origin,'https://pinnacleblooms.org'].includes(u.origin)||request.method!=='GET'||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||''))return false;
 if(/\bno-transform\b/i.test(request.headers.get('cache-control')||'')||request.headers.has('authorization')||request.headers.has('range'))return false;
 if(response.headers.has('set-cookie')||response.headers.get('content-disposition')?.includes('attachment'))return false;
 if(/\/(?:api|auth|login|logout|account|dashboard|payonline|checkout|cart|invoice|report|reports|children|private)(?:\/|$)/.test(p)||p.startsWith('/pinnacle-pages-preview')||p.startsWith('/verify/')||excludedCentres.includes(u.pathname))return false;
 return true;
}
export async function serveAnnouncement(request,env,now=Date.now()){
 const path=new URL(request.url).pathname;if(![scriptPath,stylePath,ANNOUNCEMENT_CONFIG_PATH,enrolmentScriptPath,routingPath].includes(path))return null;
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD'}});
 if(path===ANNOUNCEMENT_CONFIG_PATH){const state=await readAnnouncement(env,now),headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','vary':'Origin'};if(request.headers.get('origin')==='https://pinnacleblooms.org')headers['access-control-allow-origin']='https://pinnacleblooms.org';return new Response(request.method==='HEAD'?null:JSON.stringify(state.active?state:{active:false,config:null,serverNow:now}),{headers});}
 return new Response(request.method==='HEAD'?null:assets[path===scriptPath?'script':path===enrolmentScriptPath?'enrolment':path===routingPath?'routing':'style'],{headers:{'content-type':path===stylePath?'text/css; charset=utf-8':'text/javascript; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff',...([routingPath,enrolmentScriptPath].includes(path)?{'x-pinnacle-paid-locality':'native-paid-locality-20261017-regional'}:{})}});
}
function markup(config,path){
 const x=Object.fromEntries(Object.entries(config).map(([k,v])=>[k,escaped(v)])),centre=activeCentreIds.includes(centrePaths[path])?centrePaths[path]:'',service=servicePaths[path]||'';
 const enquiry=new URL(config.enquiryPath,origin);if(centre)enquiry.searchParams.set('centre',centre);if(service)enquiry.searchParams.set('service',service);
 const links=`<a class="pna-primary" data-announcement-enquiry data-cta="announcement-enquiry" href="${escaped(enquiry.href)}">${x.enquiryLabel}${arrowIcon}</a><a data-cta="announcement-call" href="${x.phone}">${phoneIcon}${x.phoneLabel}</a>`;
 return `<aside id="pinnacle-site-announcement" aria-label="Pinnacle announcement" data-announcement-id="${x.id}" data-announcement-revision="${x.revision}" data-announcement-centre="${escaped(centre)}" data-announcement-centres="${escaped(activeCentreIds.join(','))}" data-announcement-service="${escaped(service)}"><div class="pna-inner"><div class="pna-copy"><span class="pna-title">${x.title}</span><div class="pna-prices"><s>${x.regularPrice}</s><strong class="pna-price">${x.offerPrice}</strong><span class="pna-limit">${x.limit}</span></div><span class="pna-summary">${x.summary}</span></div><div class="pna-actions">${links}<button type="button" data-announcement-open data-details-path="${x.detailsPath}" aria-controls="pinnacle-announcement-details">Details</button></div><button class="pna-dismiss" type="button" data-announcement-dismiss aria-label="Dismiss announcement">×</button></div></aside><dialog id="pinnacle-announcement-details" aria-labelledby="pna-dialog-title"><button class="pna-dialog-close" type="button" data-announcement-close aria-label="Close offer details">×</button><h2 id="pna-dialog-title">${x.title}</h2><p><s>${x.regularPrice}</s><strong class="pna-price">${x.offerPrice}</strong></p><p class="pna-limit">${x.limit}</p><p>${x.description}</p><p>${x.terms}</p><p class="pna-expiry">${x.expiryLabel}</p><div class="pna-actions">${links}<a href="${x.detailsPath}">Read full announcement${arrowIcon}</a></div></dialog>`;
}
export async function applySiteAnnouncement(request,response,env,now=Date.now()){
 if(response.headers.has('x-pinnacle-announcement')||!announcementEligible(request,response))return response;
 const {active,config}=await readAnnouncement(env,now),monthly=active&&config.id==='navratri-one-service-month-2026',enrolment=new URL(request.url).pathname==='/enroll-autism-speech-aba-therapies-india';if(!active&&!enrolment)return response;
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges'])headers.delete(key);
 headers.set('cache-control','no-store');if(active)headers.set('x-pinnacle-announcement',config.id);
 const assetOrigin='';
 return new HTMLRewriter().on('head',{element(e){if(active)e.append(`<link rel="stylesheet" href="${assetOrigin}${stylePath}?v=20261012"><script defer src="${assetOrigin}${scriptPath}?v=held-links-20261018"></script>`,{html:true});}}).on('body',{element(e){if(active&&!e.hasAttribute('data-pinnacle-announcement')){e.setAttribute('data-pinnacle-announcement',config.id);e.prepend(markup(config,new URL(request.url).pathname),{html:true});}}}).on('#navratri-one-service-month-offer',{element(e){if(!monthly)e.remove();}}).on('#navratri-paid-plan-discount-2026',{element(e){if(now>=Date.parse('2026-10-26T00:00:00+05:30'))e.remove();}}).on('form[data-offer-reference="navratri-one-service-month-2026"]',{element(e){e.setAttribute('data-offer-enabled',String(monthly));if(!monthly)e.removeAttribute('data-offer-reference');}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
