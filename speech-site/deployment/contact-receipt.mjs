import {repairLegacyMeasurement} from './legacy-measurement.mjs';
import {CONTACT_PATH} from '../public/pinnacle-pages-scripts/contact-options.mjs';
export const contactReceiptAssets=new Set(['contact-receipt.js','contact-api.mjs','contact-options.mjs','enrolment-api.mjs','speech-measurement.js'].map(n=>'/pinnacle-pages-scripts/'+n));
export async function serveContactReceiptAsset(request,env){
 const u=new URL(request.url);if(u.origin!=='https://www.pinnacleblooms.org'||!contactReceiptAssets.has(u.pathname))return null;
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD'}});
 const source=await env.ASSETS.fetch(new Request('https://assets.local'+u.pathname,{method:request.method}));
 if(source.status!==200)return new Response('Temporarily unavailable',{status:503,headers:{'cache-control':'no-store'}});
 const headers=new Headers(source.headers);for(const key of ['set-cookie','age','expires','content-encoding'])headers.delete(key);
 headers.set('content-type','text/javascript; charset=utf-8');headers.set('cache-control','public, max-age=0, must-revalidate');headers.set('x-content-type-options','nosniff');headers.set('x-pinnacle-contact-assets','contact-receipt-20261015');
 return new Response(request.method==='HEAD'?null:source.body,{status:200,headers});
}
export async function repairContactReceipt(request,response){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||u.pathname!==CONTACT_PATH||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||!/^text\/html\b/i.test(response.headers.get('content-type')||''))return response;
 // Activate the existing exact-fingerprint migration only on this contact
 // page. Unknown legacy tag bytes fail the release proof rather than silently
 // installing another competing analytics pipeline.
 const measured=await repairLegacyMeasurement(request,response);
 if(measured.headers.get('x-pinnacle-legacy-measurement')!=='helpline')return measured;
 const headers=new Headers(measured.headers);headers.set('cache-control','private, no-store');headers.set('x-pinnacle-contact-receipt','durable-contact-v1');
 const rewriter=new HTMLRewriter()
  .on('form[method="post"]',{element(e){e.setAttribute('id','pinnacle-contact');e.setAttribute('data-contact-contract','durable-contact-v1');e.setAttribute('method','post');e.setAttribute('action','/api/enrolment');e.setAttribute('novalidate','');e.removeAttribute('onsubmit');e.prepend('<div id="pinnacle-contact-errors" role="alert" tabindex="-1" hidden></div>',{html:true});e.append('<p id="pinnacle-contact-status" role="status" aria-live="polite" tabindex="-1">Your message is sent only after you submit. Calling 9100 181 181 remains available.</p><noscript>Please call 9100 181 181; this form needs JavaScript to confirm receipt safely.</noscript>',{html:true});}})
  .on('form[method="post"] input,form[method="post"] select,form[method="post"] textarea',{element(e){e.setAttribute('disabled','');}})
  .on('.contact-form-submit',{element(e){e.tagName='button';e.setAttribute('type','submit');e.setAttribute('class','cm-button-enroll pbn-contact-submit');e.setAttribute('style','width:auto!important;margin-left:0;border:0;background:transparent;font:inherit;cursor:pointer;min-height:44px');e.setAttribute('data-contact-submit','');e.setAttribute('disabled','');e.removeAttribute('onclick');}})
  .on('#contact-form-name',{element(e){e.setAttribute('maxlength','100');e.setAttribute('autocomplete','name');}})
  .on('#contact-form-mobile',{element(e){e.setAttribute('inputmode','numeric');e.setAttribute('maxlength','10');e.setAttribute('autocomplete','tel-national');}})
  .on('#contact-form-message',{element(e){e.setAttribute('maxlength','1000');e.setAttribute('rows','6');}})
  .on('body',{element(e){e.append('<script type="module" src="/pinnacle-pages-scripts/contact-receipt.js?v=contact-receipt-20261015"></script>',{html:true});}});
 return rewriter.transform(new Response(measured.body,{status:measured.status,statusText:measured.statusText,headers}));
}
