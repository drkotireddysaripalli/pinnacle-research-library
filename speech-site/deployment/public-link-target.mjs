import {currentStaffPaths} from './legacy-social-metadata/staff-records.mjs';
import {recoveryPath,invalidSunshineLinks} from './sunshine-recovery-routes.mjs';
import {CENTRE_CANONICAL_PATHS} from './centre-canonical-paths.mjs';
// Existing compatibility routes, publicly reconciled on 7 October. Link to
// their actual final page while keeping source parameters and fragments.
export const PUBLIC_PAGE_ALIASES={
 '/centres':'/centers','/locations':'/centers','/pinnacle-ai':'/pinnacleai',
 '/ability-score':'/abilityscore',
 '/t/occupational-therapy':'/best-occupational-therapy-center-india-proven-improvement-rate',
 '/t/aba-therapy':'/best-aba-therapy-center-india-proven-improvement-rate',
 '/speech-therapy':'/top-speech-therapy-center-india-proven-improvement-rate',
 '/enroll':'/enroll-autism-speech-aba-therapies-india'
};
// Only known public aliases. Keep tracking queries/fragments and case-sensitive
// documents, downloads, authentication and arbitrary external destinations intact.
export function publicLinkTarget(href) {
 if(typeof href!=='string'||!(/^(?:https?:\/\/(?:www\.)?pinnacleblooms\.org(?:[/?#]|$)|\/(?!\/))/.test(href)))return href;
 // HTMLRewriter exposes character references in legacy attribute values.
 // Decode only ampersands for URL matching; untouched links retain their source.
 const decodedHref=href.replace(/&(?:amp|#0*38|#x0*26);/gi,'&');
 let url;try{url=new URL(decodedHref,'https://www.pinnacleblooms.org');}catch{return href;}
 if(!['pinnacleblooms.org','www.pinnacleblooms.org'].includes(url.hostname)||url.port||url.username||url.password)return href;
 let decoded;try{decoded=decodeURIComponent(url.pathname).replace(/\/$/,'');}catch{return href;}
 if(invalidSunshineLinks.has(decoded))return null;
 const recovered=recoveryPath(url.pathname);
 if(recovered)return 'https://www.pinnacleblooms.org'+recovered+url.search+url.hash;
 if(/^\/(?:api|cdn-cgi|Images|Assets|downloads|verify\/documents)(?:\/|$)/i.test(url.pathname)||/^\/ask\/(?:auth|account)(?:\/|$)/i.test(url.pathname)||/\.[a-z0-9]{2,8}$/i.test(url.pathname))return href;
 let changed=false;
 const centrePath=url.pathname.replace(/\/$/,'').toLowerCase();
 if(CENTRE_CANONICAL_PATHS.has(centrePath)&&url.pathname!==centrePath){url.protocol='https:';url.hostname='www.pinnacleblooms.org';url.pathname=centrePath;changed=true;}
 if(Object.hasOwn(PUBLIC_PAGE_ALIASES,url.pathname.replace(/\/$/,''))){url.protocol='https:';url.hostname='www.pinnacleblooms.org';url.pathname=PUBLIC_PAGE_ALIASES[url.pathname.replace(/\/$/,'')];changed=true;}
 if(url.hostname==='www.pinnacleblooms.org'&&url.protocol==='http:'){url.protocol='https:';changed=true;}
 if(/^\/(?:ask|Ask)\/?$/.test(url.pathname)){url.protocol='https:';url.hostname='pinnacleblooms.org';url.pathname='/ask';changed=true;}
 if(url.hostname==='www.pinnacleblooms.org'){
  const staff=/^\/staff\/[^/]+\/([1-9]\d*)\/?$/.exec(url.pathname),target=staff&&currentStaffPaths[staff[1]];
  if(target&&url.pathname!==target){url.pathname=target;changed=true;}
  if(/^\/physio-therapy\/?$/.test(url.pathname)){url.pathname='/physiotherapy';changed=true;}
 }
 if(!changed)return href;
 return href.startsWith('/')&&url.hostname==='www.pinnacleblooms.org'?url.pathname+url.search+url.hash:url.href;
}
export function repairPublicLinks(response){
 return new HTMLRewriter().on('a[href]',{element(el){const before=el.getAttribute('href'),after=publicLinkTarget(before);if(after===null)el.remove();else if(after!==before)el.setAttribute('href',after);}}).transform(response);
}
