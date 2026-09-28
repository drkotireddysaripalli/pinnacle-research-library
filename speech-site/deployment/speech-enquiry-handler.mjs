// Only the explicitly tagged speech-assessment GET entry is enhanced.
export const ENQUIRY_PATH='/enroll-autism-speech-aba-therapies-india';
export const ENQUIRY_BUNDLE='/pinnacle-pages-scripts/speech-enquiry-origin-v42.js';
export function isSpeechEntry(request){
 const u=new URL(request.url);
 return u.hostname==='www.pinnacleblooms.org'&&u.pathname===ENQUIRY_PATH&&u.searchParams.getAll('entry').length===1&&u.searchParams.get('entry')==='speech-assessment'&&request.method==='GET'&&!request.headers.has('authorization')&&!request.headers.has('range')&&!/no-transform/i.test(request.headers.get('cache-control')||'');
}
export function prepareSpeechEntry(html){
 // Fail open if the known origin form contract changed, rather than rewrite an unknown form.
 if(!html.includes('/bundles/newmirracleportal?v=42')||!html.includes('id="contact-form-services-offered-sp"')||!html.includes('id="contact-form-message"')||!html.includes('enroll-form-submit'))return null;
 // The speech entry has no general analytics or advertising tags. Functional origin scripts remain.
 html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(all,attrs,body)=>{
  if(/googletagmanager|google-analytics|cloudflareinsights|gtag\s*\(|GTM-|twitter-wjs|platform\.twitter|trustpilot|tidio/i.test(attrs+' '+body))return '';
  if(/type\s*=\s*["']application\/ld\+json/i.test(attrs))return '';
  return all.replace('/bundles/newmirracleportal?v=42',ENQUIRY_BUNDLE);
 });
 html=html.replace(/<iframe\b[^>]*googletagmanager[^>]*>[\s\S]*?<\/iframe>/gi,'');
 return html;
}
export async function serveSpeechEnquiry(request,env,fetchOrigin=fetch){
 if(!isSpeechEntry(request))return null;
 const origin=await fetchOrigin(request);
 if(origin.status!==200||!origin.headers.get('content-type')?.includes('text/html'))return origin;
 const raw=await origin.clone().text(),html=prepareSpeechEntry(raw);
 if(html===null)return origin;
 const headers=new Headers(origin.headers);
 for(const name of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(name);
 headers.set('cache-control','private, no-store');headers.set('x-pinnacle-speech-entry','2026-09-28');
 headers.set('x-robots-tag','noindex, follow');headers.set('referrer-policy','strict-origin');
 headers.set('link','<https://www.pinnacleblooms.org'+ENQUIRY_PATH+'>; rel="canonical"');
 const note='<aside id="speech-assessment-enquiry" aria-label="Speech assessment enquiry" class="speech-entry-note"><strong>Arrange your FREE speech and language assessment</strong><p><del>₹25,999</del> <b>FREE</b> · Assessment only. Ongoing therapy is priced separately.</p><p>Send your enquiry below. Our team will contact you to confirm the centre, professional and appointment.</p><p>Please leave a brief enquiry; detailed clinical records can be discussed privately with your care team.</p><a href="tel:+919100181181">Call 9100 181 181</a> · <a href="/speech-therapy/first-visit-guide">Your first-visit guide</a></aside>';
 return new HTMLRewriter()
 .on('head',{element(e){e.append('<style>.speech-entry-note{background:#fff;border:2px solid #8f2879;border-radius:18px;padding:22px;margin:0 0 25px;color:#172341;line-height:1.65}.speech-entry-note strong{display:block;color:#8f2879;font-size:24px}.speech-entry-note b{color:#bf0047}.speech-entry-note a{color:#8f2879;text-decoration:underline}.speech-entry-note del{margin-right:8px}.enroll-form-submit:focus-visible{outline:3px solid #162645;outline-offset:5px}#contact-form-message{min-height:120px}</style>',{html:true});}})
 .on('.cm-form-section form',{element(e){e.prepend(note,{html:true});}})
 .on('#contact-form-services-offered-sp',{element(e){e.setAttribute('checked','checked');}})
 .on('#contact-form-message',{element(e){e.setAttribute('rows','5');e.setInnerContent('I would like to arrange the FREE speech and language assessment.');}})
 .on('.enroll-form-submit',{element(e){e.tagName='button';e.setAttribute('type','button');e.setAttribute('aria-label','Request your FREE speech assessment');}})
 .on('.enroll-form-submit .submit-wrapper > span:not(.svg)',{element(e){e.setInnerContent('Request FREE assessment');}})
 .transform(new Response(html,{headers}));
}
