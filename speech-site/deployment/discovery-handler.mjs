const PUBLIC='https://www.pinnacleblooms.org';
const CHILD_SITEMAP=PUBLIC+'/speech-therapy/sitemap.xml';
const ROOT_SITEMAPS=[
 '/sitemaps/core.xml','/sitemaps/centres.xml','/sitemaps/staff.xml','/sitemaps/bots.xml','/sitemaps/miracles.xml',
 '/sitemaps/faq-en.xml','/sitemaps/faq-te.xml','/sitemaps/faq-hi.xml','/sitemaps/faq-kn.xml','/sitemaps/faq-mr.xml','/sitemaps/faq-ta.xml','/sitemaps/faq-ml.xml',
 '/verify/sitemap.xml','/speech-therapy/sitemap.xml'
];
const MANAGED_SECTION=`

## Service and next-step pages
- [Speech therapy for children](${PUBLIC}/top-speech-therapy-center-india-proven-improvement-rate): everyday communication, professional assessment, family-guided practice, review and listed centres.
- [Occupational therapy for children](${PUBLIC}/best-occupational-therapy-center-india-proven-improvement-rate): everyday routines, play, learning, self-care and participation connected to assessment and review.
- [ABA therapy and behavioural support for children](${PUBLIC}/best-aba-therapy-center-india-proven-improvement-rate): respectful, function-led support for communication, routines, safety and everyday participation, connected to family knowledge and review.
- [Special education support for children](${PUBLIC}/best-special-education-center-call-9100181181): child-specific teaching for learning access, communication, classroom participation and abilities used in everyday life.
- [Enrol at Pinnacle](${PUBLIC}/enroll-autism-speech-aba-therapies-india): a minimal family enquiry; the team confirms service, centre, professional, appointment and fees.
- [Find a Pinnacle centre](${PUBLIC}/top-speech-therapy-center-india-proven-improvement-rate#centres): listed locations, centre pages, directions and contact options.
- [Pinnacle / BHCL National Autism Helpline](${PUBLIC}/national-autism-helpline): 9100 181 181; free guidance and appointment enquiries, 24/7.
- [Service reading guide](${PUBLIC}/speech-therapy/llms.txt): therapy pages, evidence boundaries and machine-readable sources.
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
 if(u.pathname!=='/sitemap.xml')return null;
 const entries=ROOT_SITEMAPS.map(path=>'  <sitemap><loc>'+PUBLIC+path+'</loc></sitemap>').join('\n');
 const body='<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+entries+'\n</sitemapindex>\n';
 const headers=cleaned(new Headers(),'application/xml; charset=utf-8');
 return new Response(request.method==='HEAD'?null:body,{status:200,headers});
}
