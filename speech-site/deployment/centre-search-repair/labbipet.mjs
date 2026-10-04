import {replaceCentreIntroduction,optimiseCentreMediaHtml,MEDIA_RELEASE} from './centre-media.mjs';
export const LABBIPET_PATH='/centers/best-autism-speech-aba-occupational-therapy-center-labbipet-vijayawada-ap-india';
export const LABBIPET_URL='https://www.pinnacleblooms.org'+LABBIPET_PATH;
export const RELEASE='labbipet-parent-journey-20261004';
const title='Autism &amp; Speech Therapy in Labbipet, Vijayawada | Pinnacle Blooms';
const description='Visit Pinnacle Blooms in Labbipet, Vijayawada. Explore autism, speech and ABA support, Temple Street directions and a child-specific first step. Call 9100 181 181.';
const phone='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"/></svg>';
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const faq=[
 {question:'How do I arrange a first visit to Pinnacle Labbipet?',answer:'Call <a href="tel:+919100181181">9100 181 181</a> or <a href="/enroll-autism-speech-aba-therapies-india?service=help&amp;centre=labbipet">send a Labbipet enquiry</a>. Tell us your child’s age and what you would like help with. The team will confirm the appointment, relevant professional and next step.'},
 {question:'What should I ask about assessment and therapy fees?',answer:'Ask the team for current assessment charges, therapy session fees, session duration, what is included and the cancellation policy before booking. You can discuss suitable support before deciding.'},
 {question:'Where can I check Pinnacle’s organisation, licences and evidence?',answer:'Pinnacle Blooms Network is operated by Bharath Healthcare Laboratories Private Limited. <a href="/verify/">Pinnacle Verify</a> brings together the legal identity, licences, research and dated source records. Each record explains its scope and what it supports.'}
];
export const LABBIPET_MARKUP=`<div class="center-about-description" id="pinnacle-labbipet-start">
<style>
#pinnacle-labbipet-start{color:#18315d;text-align:left;padding:28px 22px 34px;max-width:1120px;margin:auto;box-sizing:border-box}
#pinnacle-labbipet-start *{box-sizing:border-box}#pinnacle-labbipet-start p{font-size:17px;line-height:1.7;text-align:left;margin:0 0 16px;color:#243a57}
#pinnacle-labbipet-start .lbp-kicker{font-size:14px;font-weight:700;color:#8a217e;letter-spacing:.04em;margin-bottom:10px}
#pinnacle-labbipet-start h1{font-size:clamp(28px,3vw,42px);line-height:1.22;color:#18315d;text-align:left;margin:0 0 16px;font-weight:700}
#pinnacle-labbipet-start h2{font-size:25px;line-height:1.3;color:#18315d;margin:0 0 12px}#pinnacle-labbipet-start h3{font-size:18px;line-height:1.35;margin:0 0 8px;color:#007b7c}
#pinnacle-labbipet-start .lbp-lead{font-size:21px;line-height:1.5;font-weight:600;color:#18315d}
#pinnacle-labbipet-start a{color:#78238b;text-decoration:underline;text-underline-offset:4px;font-weight:600}
#pinnacle-labbipet-start a:focus-visible{outline:3px solid #18315d;outline-offset:4px}
#pinnacle-labbipet-start .lbp-actions{display:flex;flex-wrap:wrap;gap:12px;margin:23px 0 15px}
#pinnacle-labbipet-start .lbp-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:12px 19px;border:2px solid #bc137d;border-radius:12px;background:#bc137d;color:white;font-size:17px;line-height:1.4;text-decoration:none}
#pinnacle-labbipet-start .lbp-button.lbp-outline{background:white;color:#8a217e;border-color:#8a217e}
#pinnacle-labbipet-start svg{width:21px;height:21px;flex:0 0 21px}
#pinnacle-labbipet-start .lbp-small{font-size:15px;line-height:1.65;color:#34445c}
#pinnacle-labbipet-start .lbp-visit{margin:25px 0;border-left:4px solid #008b87;background:#f2faf9;border-radius:0 14px 14px 0;padding:21px 24px}
#pinnacle-labbipet-start .lbp-visit p:last-child{margin-bottom:0}
#pinnacle-labbipet-start .lbp-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin:24px 0 29px}
#pinnacle-labbipet-start .lbp-step{padding-top:15px;border-top:3px solid #d6258b}#pinnacle-labbipet-start .lbp-step:nth-child(2){border-color:#008b87}#pinnacle-labbipet-start .lbp-step:nth-child(3){border-color:#8a47b7}
#pinnacle-labbipet-start .lbp-step p{font-size:16px;margin-bottom:0}#pinnacle-labbipet-start .lbp-links{display:flex;flex-wrap:wrap;gap:10px 22px;margin:18px 0}
#pinnacle-labbipet-start .lbp-links a{padding:8px 0;min-height:44px;display:inline-flex;align-items:center;gap:6px}
#pinnacle-labbipet-start details{border-bottom:1px solid #dbe3ed;padding:14px 0}#pinnacle-labbipet-start summary{cursor:pointer;font-size:18px;font-weight:700;line-height:1.5;color:#18315d;min-height:44px;padding:9px 0}#pinnacle-labbipet-start details p{margin:10px 0 4px}#pinnacle-labbipet-start summary:focus-visible{outline:3px solid #18315d;outline-offset:4px}
#pinnacle-labbipet-start .lbp-evidence{padding:19px 0 0;border-top:1px solid #dbe3ed;margin-top:25px}
@media(max-width:700px){#pinnacle-labbipet-start{padding:24px 12px}#pinnacle-labbipet-start .lbp-lead{font-size:19px}#pinnacle-labbipet-start .lbp-steps{grid-template-columns:1fr;gap:18px}#pinnacle-labbipet-start .lbp-actions{flex-direction:column}#pinnacle-labbipet-start .lbp-button{width:100%}#pinnacle-labbipet-start .lbp-visit{padding:19px 17px}#pinnacle-labbipet-start h2{font-size:23px}}
</style>
<p class="lbp-kicker">Pinnacle Blooms Network · Labbipet, Vijayawada</p>
<h1>Autism and speech support in Labbipet.<br>A first step toward your child’s everyday independence.</h1>
<p class="lbp-lead">Asking for what they need. Joining play. Feeling ready for a daily routine. Start with the moments you want to make easier for your child.</p>
<div class="lbp-actions"><a class="lbp-button" href="tel:+919100181181" data-cta="labbipet-call">${phone} Call 9100 181 181</a><a class="lbp-button lbp-outline" href="/enroll-autism-speech-aba-therapies-india?service=help&amp;centre=labbipet" data-cta="labbipet-enquiry">Plan a visit to Labbipet ${arrow}</a></div>
<p class="lbp-small">Tell our team your child’s age and what matters to your family. We’ll discuss suitable support and confirm the professional, appointment and fees before you visit.</p>
<p>Your child’s <strong>self-sufficient, mainstream-included life is the purpose from the beginning.</strong> With PinnacleAI®, that purpose guides the abilities we understand, the goals we choose, the people and therapies we bring together, everyday practice and review. Your family helps shape the journey.</p>
<div class="lbp-visit"><h2>Find Pinnacle on Temple Street, Labbipet.</h2><p><strong>Door No. 39-9-7, Temple Street, Labbi Pet,<br>Vijayawada, Andhra Pradesh 520007.</strong></p><p><a href="https://goo.gl/maps/22jHXzGQ7kBhiWY38" target="_blank" rel="noopener">Open Labbipet centre directions ↗</a> · <a href="/national-autism-helpline">Speak with the Pinnacle guidance team</a></p><p class="lbp-small">Ask for <strong>Labbipet, Temple Street</strong> when you call, so we can guide you to the right Vijayawada location.</p></div>
<h2>Make the plan useful in your child’s day.</h2>
<div class="lbp-steps"><section class="lbp-step"><h3>1 · Bring one everyday priority</h3><p>Perhaps your child needs a clearer way to ask for help or a break. Tell us how they communicate now, what they enjoy and which moments need support.</p></section><section class="lbp-step"><h3>2 · Understand why each support matters</h3><p>Discuss a meaningful goal and the professionals who can help. Speech support may address communication; behavioural support explores what happens around a difficult moment and useful alternatives. Your child’s comfort and choices matter.</p></section><section class="lbp-step"><h3>3 · Connect practice with review</h3><p>Ask what to practise at home, how school can be involved and what to observe. Bring those everyday observations back to the team to review and adjust the next step.</p></section></div>
<h2>Speech, ABA and other support: where should we begin?</h2>
<p>You do not have to choose a therapy on your own. Start with your child’s capabilities and your family’s priorities. Explore how speech, occupational therapy, behavioural support and special education can contribute to a child-specific plan, then ask our team which support and practitioners are appropriate and available for your child.</p>
<nav class="lbp-links" aria-label="Explore integrated support"><a href="/autism-therapy">Integrated autism support ${arrow}</a><a href="/top-speech-therapy-center-india-proven-improvement-rate">Speech therapy</a><a href="/best-aba-therapy-center-india-proven-improvement-rate">ABA and behavioural support</a><a href="/best-occupational-therapy-center-india-proven-improvement-rate">Occupational therapy</a><a href="/best-special-education-center-call-9100181181">Special education</a></nav>
<div class="lbp-evidence" id="labbipet-parent-questions"><h2>Feel clearer before your first visit.</h2>
${faq.map(({question,answer})=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}
<nav class="lbp-links" aria-label="Prepare for your conversation"><a href="https://pinnacleblooms.org/ask/what-happens-during-speech-and-language-therapy-sessions">What happens in a speech session?</a><a href="https://pinnacleblooms.org/ask/how-much-does-autism-or-speech-therapy-cost-in-india">Understanding therapy fees</a><a href="/books/resources/first-conversation">A free one-page conversation planner</a><a href="/pinnacleai">Explore the PinnacleAI® system</a><a href="/verify/evidence/pinnacle-paradigm-shift.html">Our life-first paradigm shift</a><a href="/verify/">Inspect licences, research and evidence</a></nav></div>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','@id':LABBIPET_URL+'#labbipet-parent-questions',url:LABBIPET_URL,mainEntity:faq.map(({question,answer})=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer.replace(/<[^>]*>/g,'')}}))})}</script>
</div>`;

const trackingOnly=url=>[...url.searchParams.keys()].every(key=>/^(?:utm_[a-z_]+|gclid|dclid|fbclid|msclkid|gbraid|wbraid|gad_source|gad_campaignid)$/i.test(key));
export function isLabbipetRequest(request){
 const u=new URL(request.url);
 return u.origin==='https://www.pinnacleblooms.org'&&u.pathname===LABBIPET_PATH&&trackingOnly(u)&&['GET','HEAD'].includes(request.method)&&!request.headers.has('authorization')&&!request.headers.has('range')&&!request.headers.has('if-range')&&!/\bno-transform\b/i.test(request.headers.get('cache-control')||'');
}
// Reconcile the postcode only for this exact local entity/address. Keep every
// other structured-data value and original formatting intact.
export function alignLabbipetPostalCode(html){
 return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(block,json)=>{
  let data;try{data=JSON.parse(json);}catch{return block;}
  const oldUrl=LABBIPET_URL.replace('vijayawada','vijyawada');
  if(data['@type']!=='LocalBusiness'||![LABBIPET_URL,oldUrl].includes(data['@id'])||data.url!==data['@id'])return block;
  if(data.image!=='https://www.pinnacleblooms.org/Images/ProfileImages/3062523180.jpg')return block;
  return block.replaceAll(oldUrl,LABBIPET_URL).replace(/("streetAddress":\s*"Door No 39-9-7, Temple Street, Labbi Pet, Vijayawada, Andhra pradesh-520007"[^{}]*?"postalCode":\s*")520010(")/g,'$1520007$2');
 });
}
export function reviseLabbipetHtml(html){
 if(html.includes('id="pinnacle-labbipet-start"'))return optimiseCentreMediaHtml(html,'3062523180');
 const canonical=html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi)||[];
 if(canonical.length!==1||!html.includes('/Images/ProfileImages/3062523180.jpg'))return null;
 // The legacy origin echoes tracking parameters into its canonical. Accept only
 // the exact centre identity plus known tracking keys, then use the clean URL.
 let identity;try{identity=new URL(canonical[0].match(/\bhref=["']([^"']+)["']/)?.[1].replaceAll('&amp;','&'));}catch{return null;}
 if(identity.origin+identity.pathname!==LABBIPET_URL||identity.hash||!trackingOnly(identity))return null;
 if(/<meta\b(?=[^>]*\bname=["'](?:robots|googlebot|bingbot)["'])(?=[^>]*\bcontent=["'][^"']*(?:noindex|none))[^>]*>/i.test(html))return null;
 const replaced=replaceCentreIntroduction(html,'Labbipet',LABBIPET_MARKUP,'YkcZ_lRJxNY');if(replaced===null)return null;
 const introChanged=alignLabbipetPostalCode(replaced);
 // The local story changes; preserve all other legacy content and assets verbatim.
 return optimiseCentreMediaHtml(introChanged.replace(canonical[0],'<link rel="canonical" href="'+LABBIPET_URL+'">').replace(/<title>[\s\S]*?<\/title>/,'<title>'+title+'</title>')
  .replace(/<meta\b(?=[^>]*\bname="keywords")[^>]*>/,'<meta name="keywords" content="Pinnacle Labbipet, Vijayawada, child development, autism support, speech therapy, ABA support, occupational therapy, special education">')
  .replace(/<meta\b(?=[^>]*\bname="description")[^>]*>/,'<meta name="description" content="'+description+'">')
  .replace(/<meta\b(?=[^>]*\bproperty="og:title")[^>]*>/,'<meta property="og:title" content="'+title+'">')
  .replace(/<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/,'<meta property="og:description" content="'+description+'">')
  .replace(/<meta\b(?=[^>]*\bname="twitter:title")[^>]*>/,'<meta name="twitter:title" content="'+title+'">')
  .replace(/<meta\b(?=[^>]*\bname="twitter:description")[^>]*>/,'<meta name="twitter:description" content="'+description+'">'),'3062523180');
}
export async function transformLabbipet(request,response){
 if(!isLabbipetRequest(request)||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||response.headers.has('set-cookie')||/private|no-store|no-transform/i.test(response.headers.get('cache-control')||'')||/noindex|none/i.test(response.headers.get('x-robots-tag')||'')||/(?:^|,)\s*(?:cookie|authorization|\*)\s*(?:,|$)/i.test(response.headers.get('vary')||''))return response;
 const declared=Number(response.headers.get('content-length'));if(declared>2000000)return response;
 const reader=response.clone().body.getReader(),decoder=new TextDecoder();let html='',bytes=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2000000){void reader.cancel();return response;}html+=decoder.decode(value,{stream:true});}html+=decoder.decode();}catch{return response;}finally{reader.releaseLock();}
 const changed=reviseLabbipetHtml(html);if(changed===null)return response;
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges','age'])headers.delete(key);
 headers.set('x-pinnacle-local-journey',RELEASE);headers.set('x-pinnacle-centre-media',MEDIA_RELEASE);
 // Cookie-bearing visitors receive the same local journey, but their response
 // must never be promoted into shared/browser caching by this transformation.
 headers.set('cache-control',request.headers.has('cookie')?'private, no-store, max-age=0':'public, max-age=60');
 return new Response(changed,{status:response.status,statusText:response.statusText,headers});
}
