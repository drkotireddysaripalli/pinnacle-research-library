import {replaceCentreIntroduction,optimiseCentreMediaHtml,MEDIA_RELEASE} from './centre-media.mjs';
export const CHANDANAGAR_PATH='/centers/best-autism-speech-aba-occupational-therapy-center-chanda-nagar-hyderabad-telangana-india';
export const CHANDANAGAR_URL='https://www.pinnacleblooms.org'+CHANDANAGAR_PATH;
export const RELEASE='chandanagar-parent-journey-20261006';
const title='Autism &amp; Speech Therapy in Chanda Nagar, Hyderabad | Pinnacle Blooms';
const description='Explore autism and speech support at Pinnacle Blooms in Chanda Nagar, Hyderabad. Discuss everyday goals, suitable therapies, a first visit and fees. Call 9100 181 181.';
const phone='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"/></svg>';
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const faq=[
 {question:'How do I arrange a first visit to Pinnacle Chanda Nagar?',answer:'Call <a href="tel:+919100181181">9100 181 181</a> or <a href="/enroll-autism-speech-aba-therapies-india?service=help&amp;centre=chandanagar">send an Chanda Nagar enquiry</a>. Tell us your child’s age and what you would like help with. The team will confirm the appointment, relevant professional and next step.'},
 {question:'What should I ask about assessment and therapy fees?',answer:'Ask the team for current assessment charges, therapy session fees, session duration, what is included and the cancellation policy before booking. You can discuss suitable support before deciding.'},
 {question:'Where can I check Pinnacle’s organisation, licences and evidence?',answer:'Pinnacle Blooms Network is operated by Bharath Healthcare Laboratories Private Limited. <a href="/verify/">Pinnacle Verify</a> brings together the legal identity, licences, research and dated source records. Each record explains its scope and what it supports.'}
];
export const CHANDANAGAR_MARKUP=`<div class="center-about-description" id="pinnacle-chandanagar-start">
<style>
#pinnacle-chandanagar-start{color:#18315d;text-align:left;padding:28px 22px 34px;max-width:1120px;margin:auto;box-sizing:border-box}
#pinnacle-chandanagar-start *{box-sizing:border-box}#pinnacle-chandanagar-start p{font-size:17px;line-height:1.7;text-align:left;margin:0 0 16px;color:#243a57}
#pinnacle-chandanagar-start .chn-kicker{font-size:14px;font-weight:700;color:#8a217e;letter-spacing:.04em;margin-bottom:10px}
#pinnacle-chandanagar-start h1{font-size:clamp(28px,3vw,42px);line-height:1.22;color:#18315d;text-align:left;margin:0 0 16px;font-weight:700}
#pinnacle-chandanagar-start h2{font-size:25px;line-height:1.3;color:#18315d;margin:0 0 12px}#pinnacle-chandanagar-start h3{font-size:18px;line-height:1.35;margin:0 0 8px;color:#007b7c}
#pinnacle-chandanagar-start .chn-lead{font-size:21px;line-height:1.5;font-weight:600;color:#18315d}
#pinnacle-chandanagar-start a{color:#78238b;text-decoration:underline;text-underline-offset:4px;font-weight:600}
#pinnacle-chandanagar-start a:focus-visible{outline:3px solid #18315d;outline-offset:4px}
#pinnacle-chandanagar-start .chn-actions{display:flex;flex-wrap:wrap;gap:12px;margin:23px 0 15px}
#pinnacle-chandanagar-start .chn-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:12px 19px;border:2px solid #bc137d;border-radius:12px;background:#bc137d;color:white;font-size:17px;line-height:1.4;text-decoration:none}
#pinnacle-chandanagar-start .chn-button.chn-outline{background:white;color:#8a217e;border-color:#8a217e}
#pinnacle-chandanagar-start svg{width:21px;height:21px;flex:0 0 21px}
#pinnacle-chandanagar-start .chn-small{font-size:15px;line-height:1.65;color:#34445c}
#pinnacle-chandanagar-start .chn-visit{margin:25px 0;border-left:4px solid #008b87;background:#f2faf9;border-radius:0 14px 14px 0;padding:21px 24px}
#pinnacle-chandanagar-start .chn-visit p:last-child{margin-bottom:0}
#pinnacle-chandanagar-start .chn-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin:24px 0 29px}
#pinnacle-chandanagar-start .chn-step{padding-top:15px;border-top:3px solid #d6258b}#pinnacle-chandanagar-start .chn-step:nth-child(2){border-color:#008b87}#pinnacle-chandanagar-start .chn-step:nth-child(3){border-color:#8a47b7}
#pinnacle-chandanagar-start .chn-step p{font-size:16px;margin-bottom:0}#pinnacle-chandanagar-start .chn-links{display:flex;flex-wrap:wrap;gap:10px 22px;margin:18px 0}
#pinnacle-chandanagar-start .chn-links a{padding:8px 0;min-height:44px;display:inline-flex;align-items:center;gap:6px}
#pinnacle-chandanagar-start details{border-bottom:1px solid #dbe3ed;padding:14px 0}#pinnacle-chandanagar-start summary{cursor:pointer;font-size:18px;font-weight:700;line-height:1.5;color:#18315d;min-height:44px;padding:9px 0}#pinnacle-chandanagar-start details p{margin:10px 0 4px}#pinnacle-chandanagar-start summary:focus-visible{outline:3px solid #18315d;outline-offset:4px}
#pinnacle-chandanagar-start .chn-evidence{padding:19px 0 0;border-top:1px solid #dbe3ed;margin-top:25px}
@media(max-width:700px){#pinnacle-chandanagar-start{padding:24px 12px}#pinnacle-chandanagar-start .chn-lead{font-size:19px}#pinnacle-chandanagar-start .chn-steps{grid-template-columns:1fr;gap:18px}#pinnacle-chandanagar-start .chn-actions{flex-direction:column}#pinnacle-chandanagar-start .chn-button{width:100%}#pinnacle-chandanagar-start .chn-visit{padding:19px 17px}#pinnacle-chandanagar-start h2{font-size:23px}}
</style>
<p class="chn-kicker">Pinnacle Blooms Network · Chanda Nagar, Hyderabad</p>
<h1>Autism and speech support in Chanda Nagar.<br>Begin with your child’s everyday life.</h1>
<p class="chn-lead">A gesture that becomes a shared choice. A routine your child can join. A school day with more participation. Start with the everyday change your family wants to make possible.</p>
<p>Your child’s <strong>self-sufficient, mainstream-included life is the purpose from the beginning.</strong> With PinnacleAI®, that purpose guides the abilities we understand, the goals we choose, the people and therapies we bring together, everyday practice and review. Your family helps shape the journey.</p>
<div class="chn-actions"><a class="chn-button" href="tel:+919100181181" data-cta="chandanagar-call">${phone} Call 9100 181 181</a><a class="chn-button chn-outline" href="/enroll-autism-speech-aba-therapies-india?service=help&amp;centre=chandanagar" data-cta="chandanagar-enquiry">Plan a visit to Chanda Nagar ${arrow}</a></div>
<p class="chn-small">Share your priorities with the Pinnacle team. We’ll discuss suitable support and confirm the professional, appointment and fees before you visit.</p>
<div class="chn-visit"><h2>Find Pinnacle in Chanda Nagar / Madeenaguda.</h2><p><strong>Above Twins Toy Store, Happy Hospital, Madeenaguda, Hyderabad 500049.</strong><br>Beside Croma, above Raymond Store, in Chanda Nagar / Madeenaguda.</p><p><a href="https://maps.google.com/maps?cid=6267432914811534928" target="_blank" rel="noopener">Open centre directions ↗</a> · <a href="/national-autism-helpline">Speak with the Pinnacle guidance team</a></p></div>
<h2>From a favourite toy to a shared choice.</h2><p>For example, a child already reaches for a favourite toy. The family and professional may choose a reliable way to ask for it, then agree how to practise during a familiar game and what to review. This is an illustrative process, not a promised result. Communication, comfort, learning and participation guide which support is useful.</p><h2>One child’s life. Connected priorities.</h2>
<div class="chn-steps"><section class="chn-step"><h3>1 · Start with your child</h3><p>Tell us what your child enjoys and can already do. Bring the moments that matter to you: communication, mealtimes, dressing, play, learning or joining others.</p></section><section class="chn-step"><h3>2 · Understand the plan</h3><p>Ask how each goal supports your child’s life, which professionals should be involved and how you can take part. Start with a conversation if you are unsure which therapy to ask for.</p></section><section class="chn-step"><h3>3 · Connect home, school and review</h3><p>Practise with guidance and bring your observations into review. Use what is changing in everyday life to help the team adjust the next step.</p></section></div>
<h2>Explore how the therapies work together.</h2>
<p>Communication, daily routines, behaviour and learning connect in a child’s life. A child-specific plan brings relevant disciplines together around those goals. Discuss the support and practitioners appropriate for your child with our Chanda Nagar team.</p>
<nav class="chn-links" aria-label="Explore integrated support"><a href="/autism-therapy">Integrated autism support ${arrow}</a><a href="/top-speech-therapy-center-india-proven-improvement-rate">Speech therapy</a><a href="/best-occupational-therapy-center-india-proven-improvement-rate">Occupational therapy</a><a href="/best-aba-therapy-center-india-proven-improvement-rate">ABA support</a><a href="/best-special-education-center-call-9100181181">Special education</a></nav>
<div class="chn-evidence"><h2>Questions before your first visit.</h2>
${faq.map(({question,answer})=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}
<nav class="chn-links" aria-label="Prepare for your conversation"><a href="https://pinnacleblooms.org/ask/what-happens-during-speech-and-language-therapy-sessions">What happens in a speech session?</a><a href="https://pinnacleblooms.org/ask/how-much-does-autism-or-speech-therapy-cost-in-india">Understanding therapy fees</a><a href="/books/resources/first-conversation">A free one-page conversation planner</a><a href="/verify/evidence/pinnacle-paradigm-shift.html">The PinnacleAI® paradigm shift</a><a href="/verify/">Explore licences, research and evidence</a></nav></div>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','@id':CHANDANAGAR_URL+'#parent-questions',url:CHANDANAGAR_URL,mainEntity:faq.map(({question,answer})=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer.replace(/<[^>]*>/g,'')}}))})}</script>
</div>`;

const trackingOnly=url=>[...url.searchParams.keys()].every(key=>/^(?:utm_[a-z_]+|gclid|dclid|fbclid|msclkid|gbraid|wbraid|gad_source|gad_campaignid)$/i.test(key));
export function isChandaNagarRequest(request){
 const u=new URL(request.url);
 return u.origin==='https://www.pinnacleblooms.org'&&u.pathname===CHANDANAGAR_PATH&&trackingOnly(u)&&['GET','HEAD'].includes(request.method)&&!request.headers.has('authorization')&&!request.headers.has('range')&&!request.headers.has('if-range')&&!/\bno-transform\b/i.test(request.headers.get('cache-control')||'');
}
export function reviseChandaNagarHtml(html){
 if(html.includes('id="pinnacle-chandanagar-start"'))return optimiseCentreMediaHtml(html,'13689513037');
 const canonical=html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi)||[];
 if(canonical.length!==1||!html.includes('/Images/ProfileImages/13689513037.jpg'))return null;
 // The legacy origin echoes tracking parameters into its canonical. Accept only
 // the exact centre identity plus known tracking keys, then use the clean URL.
 let identity;try{identity=new URL(canonical[0].match(/\bhref=["']([^"']+)["']/)?.[1].replaceAll('&amp;','&'));}catch{return null;}
 if(identity.origin+identity.pathname!==CHANDANAGAR_URL||identity.hash||!trackingOnly(identity))return null;
 if(/<meta\b(?=[^>]*\bname=["'](?:robots|googlebot|bingbot)["'])(?=[^>]*\bcontent=["'][^"']*(?:noindex|none))[^>]*>/i.test(html))return null;
 const replaced=replaceCentreIntroduction(html,'Chanda Nagar',CHANDANAGAR_MARKUP,'');if(replaced===null)return null;
 const introChanged=replaced;
 // The local story changes; preserve all other legacy content and assets verbatim.
 return optimiseCentreMediaHtml(introChanged.replace(canonical[0],'<link rel="canonical" href="'+CHANDANAGAR_URL+'">').replace(/<title>[\s\S]*?<\/title>/,'<title>'+title+'</title>')
  .replace(/<meta\b(?=[^>]*\bname="description")[^>]*>/,'<meta name="description" content="'+description+'">')
  .replace(/<meta\b(?=[^>]*\bproperty="og:title")[^>]*>/,'<meta property="og:title" content="'+title+'">')
  .replace(/<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/,'<meta property="og:description" content="'+description+'">')
  .replace(/<meta\b(?=[^>]*\bname="twitter:title")[^>]*>/,'<meta name="twitter:title" content="'+title+'">')
  .replace(/<meta\b(?=[^>]*\bname="twitter:description")[^>]*>/,'<meta name="twitter:description" content="'+description+'">'),'13689513037');
}
export async function transformChandaNagar(request,response){
 if(!isChandaNagarRequest(request)||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||response.headers.has('set-cookie')||/private|no-store|no-transform/i.test(response.headers.get('cache-control')||'')||/noindex|none/i.test(response.headers.get('x-robots-tag')||'')||/(?:^|,)\s*(?:cookie|authorization|\*)\s*(?:,|$)/i.test(response.headers.get('vary')||''))return response;
 const declared=Number(response.headers.get('content-length'));if(declared>2000000)return response;
 const reader=response.clone().body.getReader(),decoder=new TextDecoder();let html='',bytes=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2000000){void reader.cancel();return response;}html+=decoder.decode(value,{stream:true});}html+=decoder.decode();}catch{return response;}finally{reader.releaseLock();}
 const changed=reviseChandaNagarHtml(html);if(changed===null)return response;
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges','age'])headers.delete(key);
 headers.set('x-pinnacle-local-journey',RELEASE);headers.set('x-pinnacle-centre-media',MEDIA_RELEASE);
 // Cookie-bearing visitors receive the same local journey, but their response
 // must never be promoted into shared/browser caching by this transformation.
 headers.set('cache-control',request.headers.has('cookie')?'private, no-store, max-age=0':'public, max-age=60');
 return new Response(changed,{status:response.status,statusText:response.statusText,headers});
}
