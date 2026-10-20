// Public HTML compatibility adapter around the current deployed knowledge Worker.
// The original Worker, modules, authentication, responses and assets stay intact.
import {augmentCsp} from './ad-call-csp.mjs';
import {PUBLIC_AD_CALL_PATH} from './public-ad-call.mjs';
export function createPublicMeasurementWrapper(inner){
 return {async fetch(request,env,ctx){
  const response=await inner.fetch(request,env,ctx),u=new URL(request.url);
  if(request.method!=='GET'||!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(u.hostname)||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||/^\/(?:account|auth|admin|api|internal|private|customer|customers|patients?|payroll|reports?|documents?|cart|checkout)(?:\/|$)|^\/(?:ask\/(?:te\/)?(?:account|auth|api|search)|shop\/(?:cart|checkout)|books\/download)(?:\/|$)/i.test(u.pathname))return response;
  const measurement='https://www.pinnacleblooms.org/pinnacle-pages-scripts/speech-measurement.js?v=measurement-completion-20261020';
  const adCall='https://www.pinnacleblooms.org'+PUBLIC_AD_CALL_PATH;
  const state={adCall:false,text:''};
  const rewrite=value=>value.replace(/\/ask\/_assets\/speech-measurement\.[A-Za-z0-9_-]+\.js/g,measurement).replace(/\/ask\/_assets\/google-ads-call-consent\.[A-Za-z0-9_-]+\.mjs/g,()=>{state.adCall=true;return adCall;});
  const headers=new Headers(response.headers);augmentCsp(headers);
  for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(key);
  headers.set('x-pinnacle-shared-measurement','default-20261020');
  return new HTMLRewriter()
   .on('#website-preferences,[data-speech-measurement],[data-ad-call-preferences],[data-cheq-preferences]',{element(e){e.remove();}})
   .on('script[src]',{element(e){const value=e.getAttribute('src')||'';const next=rewrite(value);if(value!==next)e.setAttribute('src',next);}})
   .on('script:not([src])',{text(chunk){state.text+=chunk.text;chunk.remove();if(chunk.lastInTextNode){chunk.after(rewrite(state.text),{html:true});state.text='';}}})
   .on('body',{element(e){e.onEndTag(end=>{if(!state.adCall)end.before('<script type="module" src="'+adCall+'"></script>',{html:true});});}})
   .transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
 }};
}
