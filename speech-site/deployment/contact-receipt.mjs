import {repairLegacyMeasurement,serveLegacyMeasurementCall} from './legacy-measurement.mjs';
import {CONTACT_PATH} from '../public/pinnacle-pages-scripts/contact-options.mjs';
export const contactReceiptAssets=new Set(['contact-receipt.js','contact-api.mjs','contact-options.mjs','enrolment-api.mjs','enrolment-source.mjs','speech-measurement.js','protection-consumer.mjs'].map(n=>'/pinnacle-pages-scripts/'+n));
// The maintained legacy map emits address text directly into double-quoted
// rows. Preserve every address/coordinate/link and escape only literal line
// breaks in that exact data position, which otherwise invalidate the script.
export function escapeContactMapRows(script){return script.replace(/(myArray\.push\(\s*\[\s*")((?:\\[\s\S]|[^"\\])*)("\s*,\s*-?\d)/g,(_,start,value,end)=>start+value.replace(/\r\n|\r|\n/g,'\\n')+end);}
export async function serveContactReceiptAsset(request,env){
 const call=serveLegacyMeasurementCall(request);if(call)return call;
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
 let inline='';
 const rewriter=new HTMLRewriter()
  // These optional legacy decorations are fixed over the form on phones.
  // Remove them on this contact route; retain every call and consent control.
  .on('.simple-marquee-container,.cm-mirracle-go-top',{element(e){e.remove();}})
  // Returning browsers may have the prior immutable collector cached. Give
  // only this changed contact journey its new version; keep other bodies fixed.
  .on('script[src^="/pinnacle-pages-scripts/speech-measurement.js"]',{element(e){e.setAttribute('src','/pinnacle-pages-scripts/speech-measurement.js?v=contact-receipt-20261015');}})
  .on('head',{element(e){e.append('<style data-pinnacle-contact-style>#pinnacle-contact{max-width:100%;padding-bottom:100px}#pinnacle-contact textarea{display:block;width:100%!important;max-width:100%;min-height:144px;box-sizing:border-box;resize:vertical}#pinnacle-contact input,#pinnacle-contact select{max-width:100%;box-sizing:border-box}#pinnacle-contact [data-contact-submit],#pinnacle-contact [data-contact-secondary]{position:static!important;float:none!important;display:inline-flex!important;align-items:center;justify-content:center;gap:10px;box-sizing:border-box;max-width:100%;min-height:48px;padding:12px 20px!important;margin:12px 0!important;border:2px solid #087f7b!important;border-radius:10px;background:#087f7b!important;color:#fff!important;font:700 16px/1.4 Arial,sans-serif;cursor:pointer;scroll-margin-block:120px}#pinnacle-contact [data-contact-secondary]{background:#fff!important;color:#075f5c!important}#pinnacle-contact [data-contact-submit]:disabled{opacity:.65;cursor:default}#pinnacle-contact [hidden]{display:none!important}#pinnacle-contact-status{clear:both;float:none!important;display:block!important;text-align:left!important;padding:16px;margin:16px 0;color:#182b4b;background:#f0f8f7;border-radius:8px;line-height:1.6}#pinnacle-contact-errors{text-align:left;color:#182b4b;padding:16px;background:#fff6f6;border:1px solid #ecc6cc;border-radius:8px;margin-bottom:16px}#pinnacle-contact-errors a{color:#ae1744;text-decoration:underline}#pinnacle-contact [id$="-receipt-error"]{text-align:left!important;font-size:14px;line-height:1.5;color:#ae1744;margin:4px 0 12px}@media(max-width:600px){#pinnacle-contact [data-contact-submit],#pinnacle-contact [data-contact-secondary]{width:100%!important}}</style>',{html:true});}})
  .on('script:not([src])',{element(){inline='';},text(t){inline+=t.text;t.remove();if(t.lastInTextNode){t.before(escapeContactMapRows(inline),{html:true});inline='';}}})
  .on('form[method="post"]',{element(e){e.setAttribute('id','pinnacle-contact');e.setAttribute('data-contact-contract','durable-contact-v1');e.setAttribute('method','post');e.setAttribute('action','/api/enrolment');e.setAttribute('novalidate','');e.removeAttribute('onsubmit');e.prepend('<div id="pinnacle-contact-errors" role="alert" tabindex="-1" hidden></div>',{html:true});e.append('<p id="pinnacle-contact-status" role="status" aria-live="polite" tabindex="-1">Your message is sent only after you submit. Calling 9100 181 181 remains available.</p><noscript>Please call 9100 181 181; this form needs JavaScript to confirm receipt safely.</noscript>',{html:true});}})
  .on('form[method="post"] input,form[method="post"] select,form[method="post"] textarea',{element(e){e.setAttribute('disabled','');}})
  .on('.contact-form-submit',{element(e){e.tagName='button';e.setAttribute('type','submit');e.setAttribute('class','pbn-contact-submit');e.removeAttribute('style');e.setAttribute('data-contact-submit','');e.setAttribute('disabled','');e.removeAttribute('onclick');e.setInnerContent('<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 3 18 9-18 9 4-9-4-9Zm4 9h14"/></svg><span>Send message</span>',{html:true});}})
  .on('#contact-form-name',{element(e){e.setAttribute('maxlength','100');e.setAttribute('autocomplete','name');}})
  .on('#contact-form-mobile',{element(e){e.setAttribute('inputmode','numeric');e.setAttribute('maxlength','10');e.setAttribute('autocomplete','tel-national');}})
  .on('#contact-form-message',{element(e){e.setAttribute('maxlength','1000');e.setAttribute('rows','6');}})
  .on('body',{element(e){e.append('<script type="module" src="/pinnacle-pages-scripts/contact-receipt.js?v=contact-receipt-20261015"></script>',{html:true});}});
 return rewriter.transform(new Response(measured.body,{status:measured.status,statusText:measured.statusText,headers}));
}
