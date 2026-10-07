// One shared, identity-guarded entry section for the five remaining paid-centre
// legacy journeys. Existing centre content, navigation, forms and tags remain.
export const PAID_CENTRE_RELEASE='paid-centre-entry-20261007';
const prefix='/centers/best-autism-speech-aba-occupational-therapy-center-';
export const PAID_CENTRES={
 [prefix+'lakshmipuram-guntur-ap-india']:{id:'guntur',facilityId:'3062527489',place:'Guntur',locality:'Lakshmipuram Main Road, beside Sweet Magic'},
 [prefix+'khajaguda-mehdipatnam-hyderabad-telangana-india']:{id:'khajaguda',facilityId:'20708174783',place:'Khajaguda, Hyderabad',locality:'Khajaguda–Nanakramguda Road, Madhura Nagar Colony'},
 [prefix+'kakinada-ap-india']:{id:'kakinada',facilityId:'20688792222',place:'Kakinada',locality:'Subash Road, Phase 2, beside Sai Baba Temple'},
 [prefix+'rajahmundry-ap-india']:{id:'rajahmundry',facilityId:'12834226974',place:'Rajahmundry',locality:'Danvaipeta, opposite Gandhi Park back gate'},
 [prefix+'labbipet-vijayawada-ap-india']:{id:'labbipet',facilityId:'3062523180',place:'Labbipet, Vijayawada',locality:'Temple Street, Door No. 39-9-7'}
};
const tracking=new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid','gad_source','gad_campaignid']);
const services={help:{heading:'Child-development support',benefit:'Help your child communicate, build everyday skills and take part in family, school and community life.'},speech:{heading:'Speech therapy',benefit:'Help your child communicate needs, join conversations and take part in everyday life.'},occupational:{heading:'Occupational therapy',benefit:'Help your child build useful everyday skills for play, mealtimes, dressing and growing independence.'},aba:{heading:'ABA and behavioural support',benefit:'Bring your questions about communication, routines and participation. Begin with goals that matter in your child’s day.'},autism:{heading:'Autism and integrated therapy support',benefit:'Bring the right people and support together around your child’s everyday abilities, growing independence and participation.'}};
// Content changes only for these exact existing campaign values. Unknown values
// retain the general introduction; raw query input never enters the page HTML.
const campaignService={speech:'speech','speech-therapy':'speech',speech_therapy:'speech',occupational:'occupational','occupational-therapy':'occupational',occupational_therapy:'occupational',aba:'aba','aba-therapy':'aba',aba_therapy:'aba',autism:'autism','autism-therapy':'autism',autism_therapy:'autism'};
export function isPaidCentreRequest(request){
 const u=new URL(request.url);
 return ['GET','HEAD'].includes(request.method)&&u.origin==='https://www.pinnacleblooms.org'&&Object.hasOwn(PAID_CENTRES,u.pathname)&&!request.headers.has('authorization')&&!request.headers.has('range')&&[...u.searchParams.keys()].every(k=>tracking.has(k));
}
export function paidCentreConfig(request){const u=new URL(request.url);const centre=PAID_CENTRES[u.pathname];if(!centre)return null;const value=u.searchParams.get('utm_content');return {...centre,path:u.pathname,service:Object.hasOwn(campaignService,value)?campaignService[value]:'help'};}
export function paidCentreMarkup(config){
 const service=services[config.service]||services.help;
 const href='/enroll-autism-speech-aba-therapies-india?service='+config.service+'&amp;centre='+config.id;
 return `<section id="pinnacle-centre-entry" aria-labelledby="pinnacle-centre-entry-title" data-centre="${config.id}">
 <style>
 #pinnacle-centre-entry{box-sizing:border-box;max-width:1120px;margin:0 auto 24px;padding:28px 22px 20px;color:#18315d;background:#fff;text-align:left;font-family:inherit}
 #pinnacle-centre-entry *{box-sizing:border-box}#pinnacle-centre-entry p{margin:0 0 12px;text-align:left;line-height:1.6;color:#243a57}
 #pinnacle-centre-entry .pc-local{font-size:15px;font-weight:700;color:#8a217e}
 #pinnacle-centre-entry h1{font-size:clamp(28px,3.5vw,40px);line-height:1.2;font-weight:700;margin:0 0 14px;color:#18315d;text-align:left;letter-spacing:normal;overflow-wrap:normal;word-break:normal}
 #pinnacle-centre-entry .pc-benefit{font-size:19px;font-weight:600;max-width:750px}
 #pinnacle-centre-entry .pc-actions{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 14px}
 #pinnacle-centre-entry .pc-button{display:inline-flex;gap:8px;align-items:center;justify-content:center;min-height:48px;padding:12px 18px;border:2px solid #bc137d;border-radius:10px;background:#bc137d;color:#fff;font-size:17px;line-height:1.4;font-weight:700;text-decoration:none}
 #pinnacle-centre-entry .pc-outline{background:#fff;color:#8a217e;border-color:#8a217e}
 #pinnacle-centre-entry a:focus-visible{outline:3px solid #18315d;outline-offset:4px}
 #pinnacle-centre-entry svg{width:20px;height:20px;flex:0 0 20px}
 #pinnacle-centre-entry .pc-next{font-size:16px;max-width:850px}#pinnacle-centre-entry .pc-note{font-size:14px;margin-bottom:0;color:#40516b}
 @media(max-width:700px){#pinnacle-centre-entry{padding:20px 68px 18px 12px;margin-bottom:12px}#pinnacle-centre-entry .pc-local{font-size:14px}#pinnacle-centre-entry h1{font-size:28px}#pinnacle-centre-entry .pc-benefit{font-size:18px}#pinnacle-centre-entry .pc-actions{flex-direction:column;margin:16px 0 14px}#pinnacle-centre-entry .pc-button{width:100%}#pinnacle-centre-entry .pc-next{font-size:15px}}
 </style>
 <p class="pc-local">Pinnacle Blooms · ${config.locality}</p>
 <h1 id="pinnacle-centre-entry-title">${service.heading} in ${config.place}</h1>
 <p class="pc-benefit">${service.benefit}</p>
 <div class="pc-actions"><a class="pc-button" href="tel:+919100181181" data-cta="centre-national-call"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"/></svg>Call 9100 181 181</a><a class="pc-button pc-outline" href="${href}" data-cta="centre-enquiry">Request an assessment <span aria-hidden="true">→</span></a></div>
 <p class="pc-next">Bring your questions about your child’s development. Our team will explain the assessment, relevant professional, current fees and available appointment times.</p>
 <p class="pc-note">The team confirms your centre and appointment. An enquiry does not reserve a slot.</p>
 </section>`;
}
export function paidCentreVideoBoot(){
 document.addEventListener('click',event=>{
  const button=event.target?.closest?.('[data-paid-centre-video]');if(!button)return;
  const id=button.getAttribute('data-paid-centre-video');if(!/^[a-zA-Z0-9_-]{11}$/.test(id))return;
  const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';iframe.title=button.getAttribute('data-video-title')||'Pinnacle centre video';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';iframe.allowFullscreen=true;iframe.style.cssText='width:100%;aspect-ratio:16/9;border:0;display:block';button.replaceWith(iframe);
 });
}
const videoMarkup=(id,place)=>`<div class="pc-centre-video" style="max-width:960px;margin:24px auto;padding:0 12px"><button type="button" data-paid-centre-video="${id}" data-video-title="Pinnacle ${place} video" style="display:flex;width:100%;min-height:90px;align-items:center;justify-content:center;gap:12px;padding:20px;border:2px solid #8a217e;border-radius:12px;background:#f8f2fa;color:#652579;font:inherit;font-weight:700;font-size:18px;line-height:1.5;cursor:pointer"><span aria-hidden="true">▶</span>Watch the Pinnacle ${place} video</button></div>`;
export async function transformPaidCentre(request,response,Rewriter=globalThis.HTMLRewriter){
 if(!isPaidCentreRequest(request)||!Rewriter||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||response.headers.has('set-cookie')||/no-store|no-transform/i.test(response.headers.get('cache-control')||'')||/noindex/i.test(response.headers.get('x-robots-tag')||'')||/cookie|authorization/i.test(response.headers.get('vary')||''))return response;
 const config=paidCentreConfig(request);const html=await response.clone().text();
 if(BufferByteLength(html)>4*1024*1024||html.includes('id="pinnacle-centre-entry"')||!html.includes('ProfileImages/'+config.facilityId+'.jpg'))return response;
 // Require the known centre body once. Never alter a different template or a
 // redirected centre identity. Desktop and origin mobile are separate fixtures.
 if((html.match(/<section\b[^>]*class="center-holder"[^>]*>/g)||[]).length!==1||(html.match(/class="center-about-description"/g)||[]).length!==1||(html.match(/<h1\b/gi)||[]).length!==1)return response;
 let videos=0;
 const output=new Rewriter()
  .on('section.center-holder',{element(el){el.prepend(paidCentreMarkup(config),{html:true});}})
  .on('.center-about-description h1',{element(el){el.tagName='h2';el.setInnerContent('About Pinnacle '+config.place);}})
  .on('section.center-holder iframe',{element(el){const src=el.getAttribute('src')||'';const id=src.match(/^https:\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?|$)/)?.[1];if(id){videos++;el.replace(videoMarkup(id,config.place),{html:true});}}})
  .on('body',{element(el){el.append('<script data-cfasync="false">('+paidCentreVideoBoot.toString()+')();</script>',{html:true});}})
  .transform(new Response(html,{headers:{'content-type':'text/html; charset=utf-8'}}));
 const next=await output.text();
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges','age'])headers.delete(key);
 if(request.headers.has('cookie'))headers.set('cache-control','private, no-store');
 headers.set('x-pinnacle-paid-centre-entry',PAID_CENTRE_RELEASE);headers.set('x-pinnacle-local-journey',PAID_CENTRE_RELEASE);
 return new Response(next,{status:response.status,statusText:response.statusText,headers});
}
function BufferByteLength(text){return new TextEncoder().encode(text).length;}
