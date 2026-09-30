const PUBLIC='https://www.pinnacleblooms.org';
const CHILD_SITEMAP=PUBLIC+'/speech-therapy/sitemap.xml';
const ROOT_SITEMAPS=[
 '/sitemaps/core.xml','/sitemaps/centres.xml','/sitemaps/staff.xml','/sitemaps/bots.xml','/sitemaps/miracles.xml',
 '/sitemaps/faq-en.xml','/sitemaps/faq-te.xml','/sitemaps/faq-hi.xml','/sitemaps/faq-kn.xml','/sitemaps/faq-mr.xml','/sitemaps/faq-ta.xml','/sitemaps/faq-ml.xml',
 '/verify/sitemap.xml','/speech-therapy/sitemap.xml','/pinnacleai/sitemap.xml','/pinnacle-pages-data/public-documents-sitemap.xml'
];
const MANAGED_SECTION=`

## Service and next-step pages
- [Suchitra, Hyderabad centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india): sourced location and real premises photos, published professional profiles, visit questions and life-first support. Confirm the appointment, professional and fees.
- [Dilsukhnagar, Hyderabad centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-dilsukhnagar-hyderabad-telangana-india): Chaitanyapuri directions, real photos, family choice example and dated facility trail.
- [Gurunanak Road, Vijayawada centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-gurunanak-road-vijayawada-ap-india): second-floor directions, real interiors and an illustrative getting-ready journey.
- [South Extension, New Delhi centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india): E17 location and access questions, real frontage and first-play conversation.
- [Ananthapuram centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-anathapuram-ap-india): Ashoknagar directions, real premises photos and an everyday participation example. For all centres confirm current professional, service, appointment and fees.
- [Nandyala centre](${PUBLIC}/centers/best-autism-speech-aba-occupational-therapy-center-nandyala-ap-india): second-floor arrival above Domino’s, real premises photos and an illustrative getting-ready goal.
- [Ongole centre](${PUBLIC}/centers/best-autism-speech-aba-occupational-therapy-center-ongole-ap-india): frontage near Gummadi Chest Hospital, real premises and a family-table choice example.
- [Tirupati centre](${PUBLIC}/centers/best-autism-speech-aba-occupational-therapy-center-tirupati-ap-india): Air Bypass Road arrival guidance, eligible interior and an illustrative shared-picture-book example.
- [Srikakulam centre](${PUBLIC}/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india): above Indian Bank directions, matched premises and a shared-learning example. Confirm current appointments, professional, service, fees and access with the receiving team.
- [Child development assessment](${PUBLIC}/speech-aba-autism-assessments): family priorities, present abilities, suitable professional assessment and a life-first next-step conversation. Fees, service and appointment are confirmed by the team.
- [Speech therapy for children](${PUBLIC}/top-speech-therapy-center-india-proven-improvement-rate): everyday communication, professional assessment, family-guided practice, review and listed centres.
- [Occupational therapy for children](${PUBLIC}/best-occupational-therapy-center-india-proven-improvement-rate): everyday routines, play, learning, self-care and participation connected to assessment and review.
- [ABA therapy and behavioural support for children](${PUBLIC}/best-aba-therapy-center-india-proven-improvement-rate): respectful, function-led support for communication, routines, safety and everyday participation, connected to family knowledge and review.
- [Special education support for children](${PUBLIC}/best-special-education-center-call-9100181181): child-specific teaching for learning access, communication, classroom participation and abilities used in everyday life.
- [Autism therapy and developmental support for children](${PUBLIC}/autism-therapy): child-specific coordination for communication, routines, learning, play and participation, with relevant professional contributions selected by assessment.
- [Enrol at Pinnacle](${PUBLIC}/enroll-autism-speech-aba-therapies-india): a minimal family enquiry; the team confirms service, centre, professional, appointment and fees.
- [Find a Pinnacle centre](${PUBLIC}/centers): 62 published listings with sourced addresses, map links, selected photographs, centre preferences and national guidance. Confirm service, professional and appointment availability before travelling.
- [Pinnacle / BHCL National Autism Helpline](${PUBLIC}/national-autism-helpline): 9100 181 181; free guidance and appointment enquiries, 24/7.
- [Service reading guide](${PUBLIC}/speech-therapy/llms.txt): therapy pages, evidence boundaries and machine-readable sources.

## Policies and life-outcome pages
- [Policies and governance](https://www.pinnacleblooms.org/privacy-policy): existing privacy and related policy documents, printed revisions and preserved wording.
- [Growing independence](https://www.pinnacleblooms.org/self-sufficient): everyday self-sufficiency as the purpose for goals, support, family practice and review.
- [Mainstream participation](https://www.pinnacleblooms.org/mainstream): meaningful school, play, family and community participation, suitable support and review.

## PinnacleAI product and module pages
- [PinnacleAI ecosystem](${PUBLIC}/pinnacleai): child-centred overview, licensed non-diagnostic scope, documented scale and the connected system.
- [AbilityScore](${PUBLIC}/abilityscore): developmental ability starting picture with a 0–1000 display and professional interpretation.
- [Seven Readiness Indexes](${PUBLIC}/seven-readiness-indexes): seven separate planning views and their boundaries.
- [Personal Development Kernel](${PUBLIC}/personal-development-kernel): child-specific context and authorised review.
- [Prognose](${PUBLIC}/prognose): revisable forecasting and goal checkpoints.
- [TherapeuticAI](${PUBLIC}/therapeuticai): professionally chosen support connected to everyday goals.
- [Everyday Therapy](${PUBLIC}/everyday-therapy): guided practice in natural family and school moments.
- [Fusion](${PUBLIC}/fusion-module): relevant observations and plan correction.
- [Reassess, review and repeat](${PUBLIC}/reassess-review-repeat): compare change and adapt the plan.
- [PinnacleAI reading guide](${PUBLIC}/pinnacleai/llms.txt): module source maps and evidence limits.
`;

function cleaned(headers,type){const out=new Headers(headers);for(const name of ['content-length','content-encoding','etag','last-modified','age','expires'])out.delete(name);out.set('content-type',type);out.set('cache-control','public, max-age=300');out.set('x-content-type-options','nosniff');return out;}

export async function serveRootDiscovery(request,env){
 const u=new URL(request.url);
 if(u.hostname!=='www.pinnacleblooms.org'||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization'))return null;
 if(u.pathname==='/llms.txt'){
  if(!env.ASSETS)return null;
  const source=await env.ASSETS.fetch(new Request('https://assets.local/llms.txt',{method:'GET'}));
  if(source.status!==200)return null;
  let body=await source.text();
  body=body.replaceAll('https://pinnacle-verify.saripalli.chatgpt.site','https://www.pinnacleblooms.org/verify');
  if(!body.includes('## Service and next-step pages'))body=body.trimEnd()+MANAGED_SECTION;
  const headers=cleaned(source.headers,'text/plain; charset=utf-8');headers.set('content-signal','search=yes, ai-input=yes');headers.set('x-robots-tag','index, follow');
  return new Response(request.method==='HEAD'?null:body+'\n',{status:200,headers});
 }
 if(u.pathname==='/sitemaps/centres.xml'){
  if(!env.ASSETS)return null;
  const source=await env.ASSETS.fetch(new Request('https://assets.local/pinnacle-pages-data/centres-sitemap.xml',{method:request.method}));
  if(source.status!==200)return null;
  const headers=cleaned(source.headers,'application/xml; charset=utf-8');headers.set('x-robots-tag','index, follow');
  return new Response(request.method==='HEAD'?null:source.body,{status:200,headers});
 }
 if(u.pathname!=='/sitemap.xml')return null;
 const entries=ROOT_SITEMAPS.map(path=>'  <sitemap><loc>'+PUBLIC+path+'</loc></sitemap>').join('\n');
 const body='<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+entries+'\n</sitemapindex>\n';
 const headers=cleaned(new Headers(),'application/xml; charset=utf-8');
 return new Response(request.method==='HEAD'?null:body,{status:200,headers});
}
