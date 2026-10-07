import {PUBLIC_AD_CALL_PATH,publicAdCallPage,publicAdCallMarkup} from './public-ad-call.mjs';
import {augmentCsp} from '../src/lib/ad-call-csp.mjs';

// Public route membership is independent of visitor cookies. Preserve private
// cache headers for returning visitors; never touch account, API or cart routes.
export function applyPublicAdCall(request,response){
 const u=new URL(request.url);
 if(request.method!=='GET'||u.hostname!=='www.pinnacleblooms.org'||!publicAdCallPage(u.pathname)||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!response.headers.get('content-type')?.includes('text/html')||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const headers=new Headers(response.headers);
 augmentCsp(headers);
 for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(key);
 headers.set('x-pinnacle-ad-call-coverage','public-20261007');
 let script=false,panel=false;
 return new HTMLRewriter()
  .on('script[src]',{element(el){const src=el.getAttribute('src')||'';if(!/^(?:\/pinnacle-pages-assets\/google-ads-call-consent\.[\w-]+\.mjs|\/pinnacle-pages-scripts\/(?:google-ads-call\.js|portal-ad-call-[\da-f]+\.mjs))(?:\?|$)/.test(src))return;if(script){el.remove();return;}script=true;el.setAttribute('src',PUBLIC_AD_CALL_PATH);el.setAttribute('type','module');el.setAttribute('data-pinnacle-ad-call-module','');}})
  .on('[data-ad-call-preferences]',{element(){panel=true;}})
  .on('body',{element(el){el.onEndTag(end=>{if(!panel)end.before(publicAdCallMarkup,{html:true});if(!script)end.before(`<script type="module" src="${PUBLIC_AD_CALL_PATH}" data-pinnacle-ad-call-module></script>`,{html:true});});}})
  .transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
