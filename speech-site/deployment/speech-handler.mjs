import {hasStoreChoices,addStoreChoices,STORE_CHOICE_RELEASE} from './book-store-choices.mjs';
import {createMirraclesLibrary} from './mirracles-library.mjs';
import {createGuruRecovery} from './guru-recovery.mjs';
import {suchitraAsset,suchitraHash} from './suchitra-assets.mjs';
import {enrolmentAsset,enrolmentHash} from './enrolment-assets.mjs';
import {hasHardcoverEdition,addHardcoverLinks,HARDCOVER_LINK_RELEASE} from './book-hardcover-links.mjs';
import {hasPaperbackEdition,addPaperbackLinks,PAPERBACK_LINK_RELEASE} from './book-paperback-links.mjs';
import {autismAsset,autismHash} from './autism-assets.mjs';
import {aboutAsset,aboutHash} from './about-assets.mjs';
import {specialEducationAsset,specialEducationHash} from './special-education-assets.mjs';
import {fusionAsset,fusionHash} from './fusion-assets.mjs';
import {abaAsset,abaHash} from './aba-assets.mjs';
import {hasKindleEdition,addKindleLinks,KINDLE_LINK_RELEASE} from './book-kindle-links.mjs';
import {therapeuticaiAsset,therapeuticaiHash} from './therapeuticai-assets.mjs';
import {prognoseAsset,prognoseHash} from './prognose-assets.mjs';
import {pdkAsset,pdkHash} from './pdk-assets.mjs';
import {occupationalAsset,occupationalHash} from './occupational-assets.mjs';
import {everydayAsset,everydayHash} from './everyday-assets.mjs';
import {abilityscoreAsset,abilityscoreHash} from './abilityscore-assets.mjs';
import {editionSearchEntry,rewriteEditionSearch,EDITION_SEARCH_RELEASE} from './book-edition-search.mjs';
import {readinessAsset,readinessHash} from './readiness-assets.mjs';
import {readingEntry,addTherapyReading,READING_RELEASE} from './therapy-reading.mjs';
import {serveSeva} from './seva-handler.mjs';
import {serveFirstConversation} from './first-conversation-handler.mjs';
import {serveBookAttribution} from './book-attribution-handler.mjs';
import {FIRST_CONVERSATION_LINK} from './first-conversation-links.mjs';
export const BOOK_ROUTES={"/shop":"shop-index","/books":"books-index","/books/hi":"books-hi-index","/books/te":"books-te-index","/books/editions/hi/speech-101":"book-edition-hi-speech-101","/books/editions/hi/ot-101":"book-edition-hi-ot-101","/books/editions/hi/aba-101":"book-edition-hi-aba-101","/books/editions/hi/special-education-101":"book-edition-hi-special-education-101","/books/editions/hi/speech-ot-101":"book-edition-hi-speech-ot-101","/books/editions/hi/speech-aba-101":"book-edition-hi-speech-aba-101","/books/editions/hi/speech-special-education-101":"book-edition-hi-speech-special-education-101","/books/editions/hi/ot-aba-101":"book-edition-hi-ot-aba-101","/books/editions/hi/ot-special-education-101":"book-edition-hi-ot-special-education-101","/books/editions/hi/aba-special-education-101":"book-edition-hi-aba-special-education-101","/books/editions/hi/speech-ot-aba-special-education-101":"book-edition-hi-speech-ot-aba-special-education-101","/books/editions/te/speech-101":"book-edition-te-speech-101","/books/editions/te/ot-101":"book-edition-te-ot-101","/books/editions/te/aba-101":"book-edition-te-aba-101","/books/editions/te/special-education-101":"book-edition-te-special-education-101","/books/editions/te/speech-ot-101":"book-edition-te-speech-ot-101","/books/editions/te/speech-aba-101":"book-edition-te-speech-aba-101","/books/editions/te/speech-special-education-101":"book-edition-te-speech-special-education-101","/books/editions/te/ot-aba-101":"book-edition-te-ot-aba-101","/books/editions/te/ot-special-education-101":"book-edition-te-ot-special-education-101","/books/editions/te/aba-special-education-101":"book-edition-te-aba-special-education-101","/books/editions/te/four-book-101":"book-edition-te-four-book-101","/books/hi/speech-101":"book-hi-speech-101","/books/hi/ot-101":"book-hi-ot-101-20261003","/books/hi/aba-101":"book-hi-aba-101","/books/hi/special-education-101":"book-hi-special-education-101","/books/hi/speech-ot-101":"book-hi-speech-ot-101","/books/hi/speech-aba-101":"book-hi-speech-aba-101","/books/hi/speech-special-education-101":"book-hi-speech-special-education-101","/books/hi/ot-aba-101":"book-hi-ot-aba-101","/books/hi/ot-special-education-101":"book-hi-ot-special-education-101","/books/hi/aba-special-education-101":"book-hi-aba-special-education-101","/books/hi/speech-ot-aba-special-education-101":"book-hi-speech-ot-aba-special-education-101","/books/te/speech-101":"book-te-speech-101","/books/te/ot-101":"book-te-ot-101","/books/te/aba-101":"book-te-aba-101","/books/te/special-education-101":"book-te-special-education-101","/books/te/speech-ot-101":"book-te-speech-ot-101","/books/te/speech-aba-101":"book-te-speech-aba-101","/books/te/speech-special-education-101":"book-te-speech-special-education-101","/books/te/ot-aba-101":"book-te-ot-aba-101","/books/te/ot-special-education-101":"book-te-ot-special-education-101","/books/te/aba-special-education-101":"book-te-aba-special-education-101","/books/te/four-book-101":"book-te-four-book-101","/books/speech-communication-101-my-message-matters":"book-speech-communication-101-my-message-matters","/books/speech-communication-101-my-message-matters-softcover":"book-speech-communication-101-my-message-matters-softcover","/books/speech-communication-101-my-message-matters-hardbound":"book-speech-communication-101-my-message-matters-hardbound","/books/occupational-therapy-101-i-belong-in-everyday-life":"book-occupational-therapy-101-i-belong-in-everyday-life","/books/occupational-therapy-101-i-belong-in-everyday-life-softcover":"book-occupational-therapy-101-i-belong-in-everyday-life-softcover","/books/occupational-therapy-101-i-belong-in-everyday-life-hardbound":"book-occupational-therapy-101-i-belong-in-everyday-life-hardbound","/books/aba-parent-education-101-understanding-everyday-behaviour":"book-aba-parent-education-101-understanding-everyday-behaviour","/books/aba-parent-education-101-understanding-everyday-behaviour-softcover":"book-aba-parent-education-101-understanding-everyday-behaviour-softcover","/books/aba-parent-education-101-understanding-everyday-behaviour-hardbound":"book-aba-parent-education-101-understanding-everyday-behaviour-hardbound","/books/special-education-101-learning-through-everyday-play":"book-special-education-101-learning-through-everyday-play","/books/special-education-101-learning-through-everyday-play-softcover":"book-special-education-101-learning-through-everyday-play-softcover","/books/special-education-101-learning-through-everyday-play-hardbound":"book-special-education-101-learning-through-everyday-play-hardbound","/books/pinnacle-101-speech-occupational-pdf-pair":"book-pinnacle-101-speech-occupational-pdf-pair","/books/pinnacle-101-speech-occupational-softcover-pair":"book-pinnacle-101-speech-occupational-softcover-pair","/books/pinnacle-101-speech-occupational-hardbound-pair":"book-pinnacle-101-speech-occupational-hardbound-pair","/books/pinnacle-101-speech-behaviour-pdf-pair":"book-pinnacle-101-speech-behaviour-pdf-pair","/books/pinnacle-101-speech-behaviour-softcover-pair":"book-pinnacle-101-speech-behaviour-softcover-pair","/books/pinnacle-101-speech-behaviour-hardbound-pair":"book-pinnacle-101-speech-behaviour-hardbound-pair","/books/pinnacle-101-speech-learning-pdf-pair":"book-pinnacle-101-speech-learning-pdf-pair","/books/pinnacle-101-speech-learning-softcover-pair":"book-pinnacle-101-speech-learning-softcover-pair","/books/pinnacle-101-speech-learning-hardbound-pair":"book-pinnacle-101-speech-learning-hardbound-pair","/books/pinnacle-101-occupational-behaviour-pdf-pair":"book-pinnacle-101-occupational-behaviour-pdf-pair","/books/pinnacle-101-occupational-behaviour-softcover-pair":"book-pinnacle-101-occupational-behaviour-softcover-pair","/books/pinnacle-101-occupational-behaviour-hardbound-pair":"book-pinnacle-101-occupational-behaviour-hardbound-pair","/books/pinnacle-101-occupational-learning-pdf-pair":"book-pinnacle-101-occupational-learning-pdf-pair","/books/pinnacle-101-occupational-learning-softcover-pair":"book-pinnacle-101-occupational-learning-softcover-pair","/books/pinnacle-101-occupational-learning-hardbound-pair":"book-pinnacle-101-occupational-learning-hardbound-pair","/books/pinnacle-101-behaviour-learning-pdf-pair":"book-pinnacle-101-behaviour-learning-pdf-pair","/books/pinnacle-101-behaviour-learning-softcover-pair":"book-pinnacle-101-behaviour-learning-softcover-pair","/books/pinnacle-101-behaviour-learning-hardbound-pair":"book-pinnacle-101-behaviour-learning-hardbound-pair","/books/pinnacle-101-four-book-pdf-collection":"book-pinnacle-101-four-book-pdf-collection","/books/pinnacle-101-four-book-softcover-collection":"book-pinnacle-101-four-book-softcover-collection","/books/pinnacle-101-four-book-hardbound-collection":"book-pinnacle-101-four-book-hardbound-collection"};
import {serveShopifyPhysicalFeed} from './shopify-physical-feed.mjs';
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
export {CENTRE_DETAIL_ROUTES} from './centre-routes.mjs';
import {CENTRE_DETAIL_ROUTES} from './centre-routes.mjs';
export const PUBLIC_DOCUMENT_ROUTES={"/everyday-therapy-home-study":"everyday-home-study","/policies":"policies","/payment-and-billing":"payment-and-billing","/privacy-policy":"privacy-policy","/terms-of-use":"terms-of-use","/terms-of-service":"terms-of-service","/cookie-policy":"cookie-policy","/copyright-and-intellectual":"copyright-and-intellectual","/age-restriction-policy":"age-restriction-policy","/contact-information":"contact-information","/disclaimer-and-limitations-of-liabilities":"disclaimer-and-limitations-of-liabilities","/endorsement-and-testimonial":"endorsement-and-testimonial","/governing-and-jurisdiction":"governing-and-jurisdiction","/third-party-inegration":"third-party-inegration","/refund-policy":"refund-policy","/staff-declaration":"staff-declaration","/ethics-charter":"ethics-charter","/self-sufficient":"self-sufficient","/mainstream":"mainstream","/about-pinnacle-proven-improvement-rate":"about","/leadership":"leadership","/pinnacle-global-autism-framework":"framework"};
export const PINNACLEAI_PATHS=['/pinnacleai','/abilityscore','/seven-readiness-indexes','/personal-development-kernel','/prognose','/therapeuticai','/everyday-therapy','/fusion-module','/reassess-review-repeat'];
const DOCUMENT='/speech-therapy/service-information';
const ENROLMENT_PREVIEW='/pinnacle-pages-preview/enrolment';
const GUIDES=['first-visit-guide','teacher-observation-guide'];
const MIME={'.pdf':'application/pdf','.mjs':'text/javascript; charset=utf-8','.vcf':'text/vcard; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8','.xml':'application/xml; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'};
function acceptsMarkdown(value=''){return value.split(',').some(entry=>{const [type,...parameters]=entry.trim().split(';');if(type.toLowerCase()!=='text/markdown')return false;const quality=parameters.map(parameter=>parameter.trim()).find(parameter=>parameter.toLowerCase().startsWith('q='));return quality?Number(quality.slice(2))>0:true;});}
// Exact retired public profiles/assets. Other leadership and image paths keep origin handling.
export function isRetiredLeadershipPath(path){let decoded;try{decoded=decodeURIComponent(path);}catch{return false;}return /^\/leadership\/(?:prudhvi-(?:matsa|masta)|maheshwari|(?:shoban|sobhan)-kumar)\/?$/i.test(decoded)||/^\/images\/leadershipimages\/(?:prudhvi|maheshwari|shoban|sobhan)_big_image\.(?:jpe?g|png)$/i.test(decoded);}
// Read only published video assets through the existing public binding. No app,
// account, payment, report or database routes are owned by this library.
let mirraclesPublicHandler;
async function serveMirraclesLibrary(request,env){
 const u=new URL(request.url);
 if(!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(u.hostname)||!(/^\/allmirracles(?:\/|$)/.test(u.pathname)||/^\/mirracles\/\d+(?:\/|$)/.test(u.pathname))||!env.ASSETS)return null;
 if(!mirraclesPublicHandler){
  let shellPromise;
  const read=async name=>{if(!/^(?:catalogue|details-\d+|shell|reader)$/.test(name))throw Error('Unknown public video asset');const r=await env.ASSETS.fetch(new Request('https://assets.local/mirracles-library-data/'+name+'.json'));if(r.status!==200)throw Error('Public video asset unavailable');return r.json();};
  mirraclesPublicHandler=createMirraclesLibrary({loadJson:read,shell:async()=>{shellPromise??=Promise.all([read('shell'),read('reader')]).then(([shell,reader])=>({...shell,reader})).catch(e=>{shellPromise=undefined;throw e});return shellPromise},responseHeaders:{'Content-Security-Policy':"object-src 'none'; base-uri 'self'; frame-ancestors 'self'",'X-Pinnacle-Mirracles-Library':'public-reader-20261008'}});
 }
 if(u.hostname==='pinnacleblooms.org'){u.hostname='www.pinnacleblooms.org';const known=await mirraclesPublicHandler(new Request(u.href,request));return known?new Response(null,{status:301,headers:{location:u.href,'cache-control':'private, no-store'}}):null;}
 return mirraclesPublicHandler(request);
}

let guruPublicHandler;
async function serveGuruRecovery(request,env){
 const u=new URL(request.url);
 if(!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(u.hostname)||!/^\/guru\/\d+(?:\/|$)/.test(u.pathname)||!env.ASSETS)return null;
 if(!guruPublicHandler){
  let shellPromise;
  const read=async asset=>{const r=await env.ASSETS.fetch(new Request('https://assets.local'+asset));if(!r.ok)throw Error('Published article asset unavailable');return r.json();};
  guruPublicHandler=createGuruRecovery({loadJson:async name=>{if(name!=='articles')throw Error('Unknown public article asset');return read('/guru-recovery-data/articles.json');},shell:async()=>{shellPromise??=read('/mirracles-library-data/shell.json').catch(e=>{shellPromise=undefined;throw e;});return shellPromise;}});
 }
 return guruPublicHandler(request);
}

export async function serveSpeech(request,env,inventory){
 const guru=await serveGuruRecovery(request,env);if(guru)return guru;
 const videos=await serveMirraclesLibrary(request,env);if(videos)return videos;
 const seva=serveSeva(request);if(seva)return seva;
 // Cloudflare matches query strings in route patterns. The /seva* trigger must
 // pass unowned neighbouring paths directly to their unchanged legacy origin.
 const sevaScope=new URL(request.url);
 if(sevaScope.hostname==='www.pinnacleblooms.org'&&sevaScope.pathname.startsWith('/seva'))return fetch(request);
 const attribution=serveBookAttribution(request);if(attribution)return attribution;
 const resource=serveFirstConversation(request);if(resource)return resource;
 const physicalFeed=await serveShopifyPhysicalFeed(request);if(physicalFeed)return physicalFeed;
 const u=new URL(request.url);
 if(u.hostname==='books.pinnacleblooms.org'&&/^\/payment-and-billing\/?$/.test(u.pathname)&&['GET','HEAD'].includes(request.method))return new Response(null,{status:301,headers:{location:'https://www.pinnacleblooms.org/payment-and-billing','cache-control':request.headers.has('cookie')||request.headers.has('authorization')?'private, no-store':'public, max-age=0, must-revalidate'}});
 const preview=u.pathname===ENROLMENT_PREVIEW;
 const enrolment=u.pathname===ENROLMENT_CANONICAL||u.pathname==='/enroll'||u.pathname==='/enroll/';
 if(u.hostname==='www.pinnacleblooms.org'&&(preview||enrolment)&&!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD','cache-control':'no-store','x-robots-tag':preview?'noindex, nofollow':'index, follow'}});
 if(u.hostname!=='www.pinnacleblooms.org'||!['GET','HEAD'].includes(request.method))return null;
 // Only recognised public routes are handled below. Never forward cookies/credentials
 // to ASSETS or vary the public presentation based on them; never cache such responses.
 const privateResponse=request.headers.has('cookie')||request.headers.has('authorization')||u.pathname==='/shop/cart';
 if(isRetiredLeadershipPath(u.pathname))return new Response(request.method==='HEAD'?null:'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Profile no longer available | Pinnacle Blooms Network</title><main><h1>This profile is no longer available.</h1><p><a href="/leadership">Meet Pinnacle’s leadership</a></p></main></html>',{status:410,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, noarchive','x-content-type-options':'nosniff'}});
 if(/^\/leadership\/?$/i.test(u.pathname)&&u.pathname!=='/leadership'){u.pathname='/leadership';return new Response(null,{status:301,headers:{location:u.href,'cache-control':privateResponse?'private, no-store':'public, max-age=0, must-revalidate'}});}
 const aliases=new Map([['/speech-therapy',SPEECH_CANONICAL],['/speech-therapy/',SPEECH_CANONICAL],[SPEECH_CANONICAL+'/',SPEECH_CANONICAL],['/occupational-therapy',OCCUPATIONAL_CANONICAL],['/occupational-therapy/',OCCUPATIONAL_CANONICAL],['/t/occupational-therapy',OCCUPATIONAL_CANONICAL],['/t/occupational-therapy/',OCCUPATIONAL_CANONICAL],[OCCUPATIONAL_CANONICAL+'/',OCCUPATIONAL_CANONICAL],['/aba-therapy',ABA_CANONICAL],['/aba-therapy/',ABA_CANONICAL],['/t/aba-therapy',ABA_CANONICAL],['/t/aba-therapy/',ABA_CANONICAL],[ABA_CANONICAL+'/',ABA_CANONICAL],['/special-education',SPECIAL_EDUCATION_CANONICAL],['/special-education/',SPECIAL_EDUCATION_CANONICAL],['/Special-Education',SPECIAL_EDUCATION_CANONICAL],['/Special-Education/',SPECIAL_EDUCATION_CANONICAL],['/t/special-education',SPECIAL_EDUCATION_CANONICAL],['/t/special-education/',SPECIAL_EDUCATION_CANONICAL],[SPECIAL_EDUCATION_CANONICAL+'/',SPECIAL_EDUCATION_CANONICAL],[AUTISM_CANONICAL+'/',AUTISM_CANONICAL],[ASSESSMENT_CANONICAL+'/',ASSESSMENT_CANONICAL],['/t/autism-therapy',AUTISM_CANONICAL],['/t/autism-therapy/',AUTISM_CANONICAL],[CENTERS_CANONICAL+'/',CENTERS_CANONICAL],['/Centers',CENTERS_CANONICAL],['/Centers/',CENTERS_CANONICAL],['/centres',CENTERS_CANONICAL],['/centres/',CENTERS_CANONICAL],['/Centres',CENTERS_CANONICAL],['/Centres/',CENTERS_CANONICAL],['/locations',CENTERS_CANONICAL],['/locations/',CENTERS_CANONICAL],['/Locations',CENTERS_CANONICAL],['/Locations/',CENTERS_CANONICAL],['/enrol',ENROLMENT_CANONICAL],['/enrol/',ENROLMENT_CANONICAL],['/enroll',ENROLMENT_CANONICAL],['/enroll/',ENROLMENT_CANONICAL],[ENROLMENT_CANONICAL+'/',ENROLMENT_CANONICAL],[ENROLMENT_PREVIEW,ENROLMENT_CANONICAL],[DOCUMENT+'/',DOCUMENT],[DOCUMENT+'.html',DOCUMENT]]);
 for(const product of PINNACLEAI_PATHS)aliases.set(product+'/',product);
 for(const centre of Object.keys(CENTRE_DETAIL_ROUTES))aliases.set(centre+'/',centre);
 for(const document of Object.keys(PUBLIC_DOCUMENT_ROUTES))aliases.set(document+'/',document);
 for(const book of Object.keys(BOOK_ROUTES))aliases.set(book+'/',book);
 aliases.set('/everyday-therapy-program','/everyday-therapy-home-study');aliases.set('/everyday-therapy-program/','/everyday-therapy-home-study');
 aliases.set('/pinnacle-ai','/pinnacleai');aliases.set('/pinnacle-ai/','/pinnacleai');
 aliases.set('/ability-score','/abilityscore');aliases.set('/ability-score/','/abilityscore');
 for(const guide of GUIDES)for(const suffix of ['/', '.html'])aliases.set('/speech-therapy/'+guide+suffix,'/speech-therapy/'+guide);
 if(aliases.has(u.pathname)){u.pathname=aliases.get(u.pathname);return new Response(null,{status:301,headers:{location:u.href,'cache-control':privateResponse?'private, no-store':'public, max-age=0, must-revalidate'}});}
 let key=u.pathname;
 if(u.pathname==='/shop/cart')key='/pinnacle-pages-html/shop-index.html';
 else if(preview)key='/pinnacle-pages-html/enrolment-preview.html';
 else if(key===ENROLMENT_CANONICAL)key='/pinnacle-pages-html/enrolment.html';
 else if(key===OCCUPATIONAL_CANONICAL)key='/pinnacle-pages-html/occupational-therapy.html';
 else if(key===ABA_CANONICAL)key='/pinnacle-pages-html/aba-therapy.html';
 else if(key===SPECIAL_EDUCATION_CANONICAL)key='/pinnacle-pages-html/special-education.html';
 else if(key===AUTISM_CANONICAL)key='/pinnacle-pages-html/autism-therapy.html';
 else if(key===ASSESSMENT_CANONICAL)key='/pinnacle-pages-html/assessment.html';
 else if(key===CENTERS_CANONICAL)key='/pinnacle-pages-html/centers.html';
 else if(Object.hasOwn(CENTRE_DETAIL_ROUTES,key))key='/pinnacle-pages-html/'+CENTRE_DETAIL_ROUTES[key]+'.html';
 else if(Object.hasOwn(BOOK_ROUTES,key))key='/pinnacle-pages-html/'+BOOK_ROUTES[key]+'.html';
 else if(key==='/books/sitemap.xml')key='/pinnacle-pages-data/books-sitemap.xml';
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
 if(wantsMarkdown&&Object.hasOwn(PUBLIC_DOCUMENT_ROUTES,u.pathname))key='/pinnacle-pages-data/'+PUBLIC_DOCUMENT_ROUTES[u.pathname]+(['self-sufficient','mainstream','about','leadership','framework','everyday-home-study'].includes(PUBLIC_DOCUMENT_ROUTES[u.pathname])?'-machine.md':'-policy.md');
 if(wantsMarkdown&&key==='/pinnacle-pages-html/enrolment.html')key='/pinnacle-pages-data/enrolment-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/occupational-therapy.html')key='/pinnacle-pages-data/occupational-therapy-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/aba-therapy.html')key='/pinnacle-pages-data/aba-therapy-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/special-education.html')key='/pinnacle-pages-data/special-education-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/autism-therapy.html')key='/pinnacle-pages-data/autism-therapy-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/assessment.html')key='/pinnacle-pages-data/assessment-machine.md';
 else if(wantsMarkdown&&key==='/pinnacle-pages-html/centers.html')key='/pinnacle-pages-data/centers-machine.md';
 else if(wantsMarkdown&&Object.values(CENTRE_DETAIL_ROUTES).some(id=>key==='/pinnacle-pages-html/'+id+'.html'))key=key.replace('/pinnacle-pages-html/','/pinnacle-pages-data/').replace('.html','-machine.md');
 else if(wantsMarkdown&&key.startsWith('/pinnacle-pages-html/')&&PINNACLEAI_PATHS.some(path=>key==='/pinnacle-pages-html/'+path.slice(1)+'.html'))key=key.replace('/pinnacle-pages-html/','/pinnacle-pages-data/').replace('.html','-reading.md');
 if(!Object.hasOwn(inventory,key)&&!readinessHash(key)&&!abilityscoreHash(key)&&!everydayHash(key)&&!occupationalHash(key)&&!pdkHash(key)&&!prognoseHash(key)&&!therapeuticaiHash(key)&&!abaHash(key)&&!fusionHash(key)&&!specialEducationHash(key)&&!aboutHash(key)&&!autismHash(key)&&!enrolmentHash(key)&&!suchitraHash(key))return null;
 // These common files belong to the complete live release, rather than a
 // therapy page's historical embedded snapshot of the same mutable file.
 const commonAsset=key==='/pinnacle-pages-data/speech-sitemap.xml'||key==='/pinnacle-pages-scripts/speech-measurement.js';
 const isHtml=key.endsWith('.html');
 const isMachineDocument=key.endsWith('.md');
 if(!env.ASSETS)return new Response('Temporarily unavailable',{status:503,headers:{'cache-control':'no-store'}});
 // Serve complete small assets; ignoring Range also prevents mixing bytes across releases.
 const fetchLiveAsset=()=>env.ASSETS.fetch(new Request('https://assets.local'+key,{method:request.method}));
 const source=commonAsset?await fetchLiveAsset():suchitraAsset(key,request.method)||enrolmentAsset(key,request.method)||autismAsset(key,request.method)||aboutAsset(key,request.method)||specialEducationAsset(key,request.method)||fusionAsset(key,request.method)||abaAsset(key,request.method)||therapeuticaiAsset(key,request.method)||prognoseAsset(key,request.method)||pdkAsset(key,request.method)||occupationalAsset(key,request.method)||everydayAsset(key,request.method)||abilityscoreAsset(key,request.method)||readinessAsset(key,request.method)||await fetchLiveAsset();
 if(![200,206,304].includes(source.status))return new Response(request.method==='HEAD'?null:'Temporarily unavailable',{status:503,headers:{'cache-control':'no-store','retry-after':'30'}});
 const headers=new Headers(source.headers);
 for(const k of ['set-cookie','age','expires','content-encoding'])headers.delete(k);
 headers.set('content-type',MIME[key.slice(key.lastIndexOf('.'))]||'application/octet-stream');
 headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');
 headers.set('x-pinnacle-speech-release','2026-09-29');
 // Preserve search and answer retrieval signals in Cloudflare Markdown conversion.
 if(isHtml||isMachineDocument)headers.set('content-signal','search=yes, ai-input=yes');
 headers.set('cache-control',privateResponse?'private, no-store':key.startsWith('/pinnacle-pages-assets/')?'public, max-age=31536000, immutable':(isHtml||isMachineDocument)?'public, max-age=0, must-revalidate':'public, max-age=60, must-revalidate');
 if(/\bno-transform\b/i.test(request.headers.get('cache-control')||''))headers.append('cache-control','no-transform');
 // Compatibility repair for the three existing immutable library-page assets.
 // The Astro template also emits the corrected destination on future builds.
 const collectionAction=isHtml&&/^\/books\/pinnacle-101-four-book-(?:pdf|softcover|hardbound)-collection$/.test(u.pathname);
 const resourceLink=isHtml&&u.pathname==='/books';
 const parentReading=readingEntry(u.pathname,key);
 const editionSummary=isHtml&&editionSearchEntry(u.pathname);
 const kindleLinks=isHtml&&hasKindleEdition(u.pathname);
 const hardcoverLinks=isHtml&&hasHardcoverEdition(u.pathname);
 const paperbackLinks=isHtml&&hasPaperbackEdition(u.pathname);
 const storeChoices=isHtml&&hasStoreChoices(u.pathname);
 const etag='"speech-'+(commonAsset?inventory[key]:(suchitraHash(key)||enrolmentHash(key)||autismHash(key)||aboutHash(key)||specialEducationHash(key)||fusionHash(key)||abaHash(key)||therapeuticaiHash(key)||prognoseHash(key)||pdkHash(key)||occupationalHash(key)||everydayHash(key)||abilityscoreHash(key)||readinessHash(key)||inventory[key]))+(collectionAction?'-collection-links-20261004':'')+(resourceLink?'-first-conversation-v1':'')+(parentReading?'-'+READING_RELEASE:'')+(editionSummary?'-'+EDITION_SEARCH_RELEASE:'')+(kindleLinks?'-'+KINDLE_LINK_RELEASE:'')+(hardcoverLinks?'-'+HARDCOVER_LINK_RELEASE:'')+(paperbackLinks?'-'+PAPERBACK_LINK_RELEASE:'')+(storeChoices?'-'+STORE_CHOICE_RELEASE:'')+'"';headers.set('etag',etag);
 if(isHtml){headers.set('vary','Accept');headers.set('x-robots-tag','index, follow, max-image-preview:large');headers.set('link','<https://www.pinnacleblooms.org'+u.pathname+'>; rel="canonical"');headers.set('content-security-policy',"default-src 'self'; img-src 'self' data: https://i.ytimg.com https://obs.aseasky.link; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com https://ob.aseasky.link https://obs.aseasky.link; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://obs.aseasky.link"+((Object.hasOwn(BOOK_ROUTES,u.pathname)||u.pathname==='/shop/cart')?" https://pinnacleblooms.myshopify.com":"")+(Object.hasOwn(CENTRE_DETAIL_ROUTES,u.pathname)?"; frame-src https://www.youtube-nocookie.com https://www.google.com https://drive.google.com":"")+"; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests");}
 if(u.pathname==='/shop/cart'){headers.set('x-robots-tag','noindex, follow');headers.set('link','<https://www.pinnacleblooms.org/shop>; rel="canonical"');}
 if(isMachineDocument){headers.set('vary','Accept');headers.set('link','<https://www.pinnacleblooms.org'+u.pathname+'>; rel="canonical"');}
 if(preview){headers.set('x-robots-tag','noindex, nofollow, nosnippet');headers.set('cache-control','no-store');headers.set('content-signal','search=no, ai-input=no');headers.set('referrer-policy','no-referrer');headers.set('content-security-policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests");}
 if(!preview&&!privateResponse&&request.headers.get('if-none-match')===etag){headers.delete('content-length');return new Response(null,{status:304,headers});}
 let body=request.method==='HEAD'?null:source.body;
 if(parentReading){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);
  headers.set('x-pinnacle-reading',READING_RELEASE);
  if(body)body=addTherapyReading(await source.text(),parentReading);
 }
 if(editionSummary){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);
  headers.set('x-pinnacle-edition-search',EDITION_SEARCH_RELEASE);
  if(body)body=rewriteEditionSearch(await source.text(),u.pathname);
 }
 if(resourceLink){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest'])headers.delete(name);
  if(body){let html=await source.text();if(!html.includes('data-first-conversation-link'))html=html.replace('<h3>Connect with Pinnacle</h3>','<h3>Connect with Pinnacle</h3>'+FIRST_CONVERSATION_LINK);body=html;}
 }
 if(collectionAction){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest'])headers.delete(name);
  if(body)body=(await source.text()).replace('<a href="#collections">Explore the complete collection ↓</a>','<a href="/books#collections">Compare all collections and formats →</a>');
 }
 if(kindleLinks){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);
  headers.set('x-pinnacle-kindle-links',KINDLE_LINK_RELEASE);
  if(body)body=addKindleLinks(typeof body==='string'?body:await new Response(body).text(),u.pathname);
 }
 if(hardcoverLinks){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);
  headers.set('x-pinnacle-hardcover-links',HARDCOVER_LINK_RELEASE);
  if(body)body=addHardcoverLinks(typeof body==='string'?body:await new Response(body).text(),u.pathname);
 }
 if(paperbackLinks){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);
  headers.set('x-pinnacle-paperback-links',PAPERBACK_LINK_RELEASE);
  if(body)body=addPaperbackLinks(typeof body==='string'?body:await new Response(body).text(),u.pathname);
 }
 if(storeChoices){
  for(const name of ['content-length','content-md5','digest','content-digest','repr-digest','last-modified'])headers.delete(name);
  headers.set('x-pinnacle-store-choices',STORE_CHOICE_RELEASE);
  if(body)body=addStoreChoices(typeof body==='string'?body:await new Response(body).text(),u.pathname);
 }
 return new Response(body,{status:source.status,headers});
}
