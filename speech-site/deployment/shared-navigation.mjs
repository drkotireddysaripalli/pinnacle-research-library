// Common navigation destination, matching src/data/portal-navigation.json.
// Apply to already-released HTML without rebuilding unrelated page bodies.
import {FOOTER_ART_STYLE,footerArtImage} from './footer-art.mjs';
import {publicLinkTarget} from './public-link-target.mjs';
import {applyPublicAdCall} from './public-ad-call-handler.mjs';
export function repairSharedNavigation(request,response){
 response=applyPublicAdCall(request,response);
 if(request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||
 response.status!==200||!response.headers.get('content-type')?.includes('text/html')||
 response.headers.has('set-cookie')||/private|no-store|no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const headers=new Headers(response.headers);
 for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(key);
 headers.set('x-pinnacle-navigation','canonical-ask-20261005');
 let artwork='';
 return new HTMLRewriter().on('a[href]',{element(el){const before=el.getAttribute('href'),after=publicLinkTarget(before);if(after===null)el.remove();else if(after!==before)el.setAttribute('href',after);}})
  .on('style[data-pinnacle-footer-art]',{element(el){el.remove();}})
  .on('head',{element(el){el.append(FOOTER_ART_STYLE,{html:true});}})
  .on('.portal-footer[style]',{element(el){
   const style=el.getAttribute('style')||'';
   const match=/--portal-footer-art\s*:\s*url\(['"]?(\/pinnacle-pages-assets\/portal-footer-shapes\.[\w.-]+\.webp)['"]?\)\s*;?/.exec(style);
   if(!match)return;
   artwork=footerArtImage(match[1]);
   el.setAttribute('style',style.replace(match[0],''));
  }})
  .on('.portal-footer-art',{element(el){if(artwork&&!el.getAttribute('class')?.split(/\s+/).includes('portal-footer-art--lazy')){
   el.setAttribute('class',(el.getAttribute('class')||'')+' portal-footer-art--lazy');el.prepend(artwork,{html:true});
  }}})
  .transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
