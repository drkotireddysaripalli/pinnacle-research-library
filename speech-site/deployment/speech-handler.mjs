// Exact public speech routes only. Returning null preserves the existing Worker/origin path.
export const SPEECH_CANONICAL='/top-speech-therapy-center-india-proven-improvement-rate';
export const ENROLMENT_CANONICAL='/enroll-autism-speech-aba-therapies-india';
export const OCCUPATIONAL_CANONICAL='/best-occupational-therapy-center-india-proven-improvement-rate';
export const ABA_CANONICAL='/best-aba-therapy-center-india-proven-improvement-rate';
export const SPECIAL_EDUCATION_CANONICAL='/best-special-education-center-call-9100181181';
export const AUTISM_CANONICAL='/autism-therapy';
export const ASSESSMENT_CANONICAL='/speech-aba-autism-assessments';
export const CENTERS_CANONICAL='/centers';
export const SUCHITRA_CANONICAL='/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india';
export const CENTRE_DETAIL_ROUTES={
 [SUCHITRA_CANONICAL]:'suchitra',
 '/centers/best-autism-speech-aba-occupational-therapy-center-dilsukhnagar-hyderabad-telangana-india':'dilsukhnagar',
 '/centers/best-autism-speech-aba-occupational-therapy-center-gurunanak-road-vijayawada-ap-india':'gurunanak',
 '/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india':'delhi',
 '/centers/best-autism-speech-aba-occupational-therapy-center-anathapuram-ap-india':'ananthapuram',
 '/centers/best-autism-speech-aba-occupational-therapy-center-nandyala-ap-india':'nandyala',
 '/centers/best-autism-speech-aba-occupational-therapy-center-ongole-ap-india':'ongole',
 '/centers/best-autism-speech-aba-occupational-therapy-center-tirupati-ap-india':'tirupati',
 '/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india':'srikakulam'
};
export const PUBLIC_DOCUMENT_ROUTES={"/privacy-policy":"privacy-policy","/terms-of-use":"terms-of-use","/terms-of-service":"terms-of-service","/cookie-policy":"cookie-policy","/copyright-and-intellectual":"copyright-and-intellectual","/age-restriction-policy":"age-restriction-policy","/contact-information":"contact-information","/disclaimer-and-limitations-of-liabilities":"disclaimer-and-limitations-of-liabilities","/endorsement-and-testimonial":"endorsement-and-testimonial","/governing-and-jurisdiction":"governing-and-jurisdiction","/third-party-inegration":"third-party-inegration","/refund-policy":"refund-policy","/staff-declaration":"staff-declaration","/ethics-charter":"ethics-charter","/self-sufficient":"self-sufficient","/mainstream":"mainstream","/about-pinnacle-proven-improvement-rate":"about","/leadership":"leadership","/pinnacle-global-autism-framework":"framework"};
export const PINNACLEAI_PATHS=['/pinnacleai','/abilityscore','/seven-readiness-indexes','/personal-development-kernel','/prognose','/therapeuticai','/everyday-therapy','/fusion-module','/reassess-review-repeat'];
const DOCUMENT='/speech-therapy/service-information';
const ENROLMENT_PREVIEW='/pinnacle-pages-preview/enrolment';
const GUIDES=['first-visit-guide','teacher-observation-guide'];
const MIME={'.mjs':'text/javascript; charset=utf-8','.vcf':'text/vcard; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8','.xml':'application/xml; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'};
function acceptsMarkdown(value=''){return value.split(',').some(entry=>{const [type,...parameters]=entry.trim().split(';');if(type.toLowerCase()!=='text/markdown')return false;const quality=parameters.map(parameter=>parameter.trim()).find(parameter=>parameter.toLowerCase().startsWith('q='));return quality?Number(quality.slice(2))>0:true;});}
export async function serveSpeech(request,env,inventory){
 const u=new URL(request.url);
 const preview=u.pathname===ENROLMENT_PREVIEW;
 const enrolment=u.pathname===ENROLMENT_CANONICAL||u.pathname==='/enroll'||u.pathname==='/enroll/';
 if(u.hostname==='www.pinnacleblooms.org'&&(preview||enrolment)&&!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD','cache-control':'no-store','x-robots-tag':preview?'noindex, nofollow':'index, follow'}});
 if(u.hostname!=='www.pinnacleblooms.org'||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization'))return null;
 // Preserve session/private handling on the five exact migrated centre routes.
 // Known analytics and Cloudflare challenge cookies carry no page-personalisation input here.
 const centrePath=u.pathname.endsWith('/')?u.pathname.slice(0,-1):u.pathname;
 const managedDocument=Object.hasOwn(CENTRE_DETAIL_ROUTES,centrePath)||Object.hasOwn(PUBLIC_DOCUMENT_ROUTES,centrePath);
 if(managedDocument&&(request.headers.has('range')||/\bno-transform\b/i.test(request.headers.get('cache-control')||'')))return null;
 if(managedDocument&&request.headers.has('cookie')){
  const names=(request.headers.get('cookie')||'').split(';').map(cookie=>cookie.trim().split('=')[0]).filter(Boolean);
  if(names.some(name=>!/^((?:_ga|ps_ga)(?:_[A-Za-z0-9]+)?|_gid|_gat(?:_gtag_.+)?|__cf_bm|cf_clearance)$/.test(name)))return null;
 }
 const aliases=new Map([['/speech-therapy',SPEECH_CANONICAL],['/speech-therapy/',SPEECH_CANONICAL],[SPEECH_CANONICAL+'/',SPEECH_CANONICAL],['/occupational-therapy',OCCUPATIONAL_CANONICAL],['/occupational-therapy/',OCCUPATIONAL_CANONICAL],['/t/occupational-therapy',OCCUPATIONAL_CANONICAL],['/t/occupational-therapy/',OCCUPATIONAL_CANONICAL],[OCCUPATIONAL_CANONICAL+'/',OCCUPATIONAL_CANONICAL],['/aba-therapy',ABA_CANONICAL],['/aba-therapy/',ABA_CANONICAL],['/t/aba-therapy',ABA_CANONICAL],['/t/aba-therapy/',ABA_CANONICAL],[ABA_CANONICAL+'/',ABA_CANONICAL],['/special-education',SPECIAL_EDUCATION_CANONICAL],['/special-education/',SPECIAL_EDUCATION_CANONICAL],['/Special-Education',SPECIAL_EDUCATION_CANONICAL],['/Special-Education/',SPECIAL_EDUCATION_CANONICAL],['/t/special-education',SPECIAL_EDUCATION_CANONICAL],['/t/special-education/',SPECIAL_EDUCATION_CANONICAL],[SPECIAL_EDUCATION_CANONICAL+'/',SPECIAL_EDUCATION_CANONICAL],[AUTISM_CANONICAL+'/',AUTISM_CANONICAL],[ASSESSMENT_CANONICAL+'/',ASSESSMENT_CANONICAL],['/t/autism-therapy',AUTISM_CANONICAL],['/t/autism-therapy/',AUTISM_CANONICAL],[CENTERS_CANONICAL+'/',CENTERS_CANONICAL],['/Centers',CENTERS_CANONICAL],['/Centers/',CENTERS_CANONICAL],['/centres',CENTERS_CANONICAL],['/centres/',CENTERS_CANONICAL],['/Centres',CENTERS_CANONICAL],['/Centres/',CENTERS_CANONICAL],['/locations',CENTERS_CANONICAL],['/locations/',CENTERS_CANONICAL],['/Locations',CENTERS_CANONICAL],['/Locations/',CENTERS_CANONICAL],['/enroll',ENROLMENT_CANONICAL],['/enroll/',ENROLMENT_CANONICAL],[ENROLMENT_CANONICAL+'/',ENROLMENT_CANONICAL],[ENROLMENT_PREVIEW,ENROLMENT_CANONICAL],[DOCUMENT+'/',DOCUMENT],[DOCUMENT+'.html',DOCUMENT]]);
 for(const product of PINNACLEAI_PATHS)aliases.set(product+'/',product);
 for(const centre of Object.keys(CENTRE_DETAIL_ROUTES))aliases.set(centre+'/',centre);
 for(const document of Object.keys(PUBLIC_DOCUMENT_ROUTES))aliases.set(document+'/',document);
 aliases.set('/pinnacle-ai','/pinnacleai');aliases.set('/pinnacle-ai/','/pinnacleai');
 aliases.set('/ability-score','/abilityscore');aliases.set('/ability-score/','/abilityscore');
 for(const guide of GUIDES)for(const suffix of ['/', '.html'])aliases.set('/speech-therapy/'+guide+suffix,'/speech-therapy/'+guide);
 if(aliases.has(u.pathname)){u.pathname=aliases.get(u.pathname);return new Response(null,{status:301,headers:{location:u.href,'cache-control':'public, max-age=300'}});}
 let key=u.pathname;
 if(preview)key='/pinnacle-pages-html/enrolment-preview.html';
 else if(key===ENROLMENT_CANONICAL)key='/pinnacle-pages-html/enrolment.html';
 else if(key===OCCUPATIONAL_CANONICAL)key='/pinnacle-pages-html/occupational-therapy.html';
 else if(key===ABA_CANONICAL)key='/pinnacle-pages-html/aba-therapy.html';
 else if(key===SPECIAL_EDUCATION_CANONICAL)key='/pinnacle-pages-html/special-education.html';
 else if(key===AUTISM_CANONICAL)key='/pinnacle-pages-html/autism-therapy.html';
 else if(key===ASSESSMENT_CANONICAL)key='/pinnacle-pages-html/assessment.html';
 else if(key===CENTERS_CANONICAL)key='/pinnacle-pages-html/centers.html';
 else if(Object.hasOwn(CENTRE_DETAIL_ROUTES,key))key='/pinnacle-pages-html/'+CENTRE_DETAIL_ROUTES[key]+'.html';
 else if(Object.hasOwn(PUBLIC_DOCUMENT_ROUTES,key))key='/pinnacle-pages-html/'+PUBLIC_DOCUMENT_ROUTES[key]+'.html';
 else if(PINNACLEAI_PATHS.includes(key))key='/pinnacle-pages-html/'+key.slice(1)+'.html';
 else if(key===SPEECH_CANONICAL)key='/pinnacle-pages-html/speech.html';
 else if(key===DOCUMENT)key='/pinnacle-pages-html/service-information.html';
 else if(GUIDES.some(g=>key==='/speech-therapy/'+g))key='/pinnacle-pages-html/'+key.split('/').pop()+'.html';
 else if(key==='/speech-therapy/sitemap.xml')key='/pinnacle-pages-data/speech-sitemap.xml';
 else if(key==='/speech-therapy/llms.txt')key='/pinnacle-pages-data/speech-llms.txt';
 else if(key==='/pinnacleai/sitemap.xml')key='/pinnacle-pages-data/pinnacleai-sitemap.xml';
 else if(key==='/pinnacleai/llms.txt')key='/pinnacle-pages-data/pinnacleai-llms.txt';
 else if(!/^\/pinnacle-pages-(?:assets|fonts|scripts|data)\//.test(key))return null;
 const wantsMarkdown=acceptsMarkdown(request.headers.get('accept')||'');
 if(wantsMarkdown&&Object.hasOwn(PUBLIC_DOCUMENT_ROUTES,u.pathname))key='/pinnacle-pages-data/'+PUBLIC_DOCUMENT_ROUTES[u.pathname]+(['self-sufficient','mainstream','about','leadership','framework'].includes(PUBLIC_DOCUMENT_ROUTES[u.pathname])?'-machine.md':'-policy.md');
 if(wantsMarkdown&&key==='/pinnacle-pages-html/enrolment.html')key='/pinnacle-pages-data/enrolment-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/occupational-therapy.html')key='/pinnacle-pages-data/occupational-therapy-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/aba-therapy.html')key='/pinnacle-pages-data/aba-therapy-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/special-education.html')key='/pinnacle-pages-data/special-education-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/autism-therapy.html')key='/pinnacle-pages-data/autism-therapy-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/assessment.html')key='/pinnacle-pages-data/assessment-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/centers.html')key='/pinnacle-pages-data/centers-machine.md';
 else if(wantsMarkdown&&Object.values(CENTRE_DETAIL_ROUTES).some(id=>key==='/pinnacle-pages-html/'+id+'.html'))key=key.replace('/pinnacle-pages-html/','/pinnacle-pages-data/').replace('.html','-machine.md');
 else if(wantsMarkdown&&key.startsWith('/pinnacle-pages-html/')&&PINNACLEAI_PATHS.some(path=>key==='/pinnacle-pages-html/'+path.slice(1)+'.html'))key=key.replace('/pinnacle-pages-html/','/pinnacle-pages-data/').replace('.html','-reading.md');
 if(!Object.hasOwn(inventory,key))return null;
 const isHtml=key.endsWith('.html');
 const isMachineDocument=key.endsWith('.md');
 if(isHtml&&!preview&&(request.headers.has('range')||/\bno-transform\b/i.test(request.headers.get('cache-control')||'')))return null;
 if(!env.ASSETS)return new Response('Temporarily unavailable',{status:503,headers:{'cache-control':'no-store'}});
 // Serve complete small assets; ignoring Range also prevents mixing bytes across releases.
 const source=await env.ASSETS.fetch(new Request('https://assets.local'+key,{method:request.method}));
 if(![200,206,304].includes(source.status))return new Response(request.method==='HEAD'?null:'Temporarily unavailable',{status:503,headers:{'cache-control':'no-store','retry-after':'30'}});
 const headers=new Headers(source.headers);
 for(const k of ['set-cookie','age','expires','content-encoding'])headers.delete(k);
 headers.set('content-type',MIME[key.slice(key.lastIndexOf('.'))]||'application/octet-stream');
 headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');
 headers.set('x-pinnacle-speech-release','2026-09-29');
 // Preserve search and answer retrieval signals in Cloudflare Markdown conversion.
 if(isHtml||isMachineDocument)headers.set('content-signal','search=yes, ai-input=yes');
 headers.set('cache-control',key.startsWith('/pinnacle-pages-assets/')?'public, max-age=31536000, immutable':'public, max-age=60, must-revalidate');
 const etag='"speech-'+inventory[key]+'"';headers.set('etag',etag);
 if(isHtml){headers.set('vary','Accept');headers.set('x-robots-tag','index, follow, max-image-preview:large');headers.set('link','<https://www.pinnacleblooms.org'+u.pathname+'>; rel="canonical"');headers.set('content-security-policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests");}
 if(isMachineDocument){headers.set('vary','Accept');headers.set('link','<https://www.pinnacleblooms.org'+u.pathname+'>; rel="canonical"');}
 if(preview){headers.set('x-robots-tag','noindex, nofollow, nosnippet');headers.set('cache-control','no-store');headers.set('content-signal','search=no, ai-input=no');headers.set('referrer-policy','no-referrer');headers.set('content-security-policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests");}
 if(!preview&&request.headers.get('if-none-match')===etag){headers.delete('content-length');return new Response(null,{status:304,headers});}
 return new Response(request.method==='HEAD'?null:source.body,{status:source.status,headers});
}
