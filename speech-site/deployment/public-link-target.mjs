import {currentStaffPaths} from './legacy-social-metadata/staff-records.mjs';
// Only known public aliases. Keep tracking queries/fragments and case-sensitive
// documents, downloads, authentication and arbitrary external destinations intact.
export function publicLinkTarget(href) {
 if(typeof href!=='string'||!(/^(?:https?:\/\/(?:www\.)?pinnacleblooms\.org(?:[/?#]|$)|\/(?!\/))/.test(href)))return href;
 let url;try{url=new URL(href,'https://www.pinnacleblooms.org');}catch{return href;}
 if(!['pinnacleblooms.org','www.pinnacleblooms.org'].includes(url.hostname)||url.port||url.username||url.password)return href;
 if(/^\/(?:api|cdn-cgi|Images|Assets|downloads|verify\/documents)(?:\/|$)/i.test(url.pathname)||/^\/ask\/(?:auth|account)(?:\/|$)/i.test(url.pathname)||/\.[a-z0-9]{2,8}$/i.test(url.pathname))return href;
 let changed=false;
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
 return new HTMLRewriter().on('a[href]',{element(el){const before=el.getAttribute('href'),after=publicLinkTarget(before);if(after!==before)el.setAttribute('href',after);}}).transform(response);
}
