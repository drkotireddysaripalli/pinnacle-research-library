'use strict';
(() => {
  const id = 'G-2BYLRLFRDJ';
  const origin = 'https://www.pinnacleblooms.org';
  const measurementNonce=document.currentScript?.nonce||'';
  const pages = {
    '/': {title:'Pinnacle Blooms Network',group:'home',service:'help'},
    '/top-speech-therapy-center-india-proven-improvement-rate': {title:'Pinnacle Speech Therapy',group:'speech_therapy',service:'speech'},
    '/best-occupational-therapy-center-india-proven-improvement-rate': {title:'Pinnacle Occupational Therapy',group:'occupational_therapy',service:'occupational'},
    '/best-aba-therapy-center-india-proven-improvement-rate': {title:'Pinnacle ABA Therapy',group:'aba_therapy',service:'aba'},
    '/best-special-education-center-call-9100181181': {title:'Pinnacle Special Education',group:'special_education',service:'education'},
    '/autism-therapy': {title:'Pinnacle Autism Therapy',group:'autism_therapy',service:'autism'},
    '/speech-aba-autism-assessments': {title:'Pinnacle Child Development Assessment',group:'developmental_assessment',service:'help'},
    '/centers': {title:'Find a Pinnacle Centre',group:'centre_directory',service:'centres'}
    ,'/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india': {title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'}
    ,'/centers/best-autism-speech-aba-occupational-therapy-center-dilsukhnagar-hyderabad-telangana-india': {title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'}
    ,'/centers/best-autism-speech-aba-occupational-therapy-center-gurunanak-road-vijayawada-ap-india': {title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'}
    ,'/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india': {title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'}
    ,'/centers/best-autism-speech-aba-occupational-therapy-center-anathapuram-ap-india': {title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'}
  };
  // Generated explicit centre allowlist; centre path names are not sent to analytics.
  for(const path of ["/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-gurunanak-road-vijayawada-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-jayanagar-bengaluru-india","/centers/best-autism-speech-aba-occupational-therapy-center-anna-nagar-chennai-tamilnadu-india","/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india","/centers/best-autism-speech-aba-occupational-therapy-center-warangal-ts-india","/centers/best-autism-speech-aba-occupational-therapy-center-asraonagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-anathapuram-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-attapur-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-bn-reddy-nagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-begumpet-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-bhimavaram-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-chanda-nagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-dilsukhnagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-paradise-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-eluru-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-gachibowli-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-gajuwaka-vizag-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-lakshmipuram-guntur-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-habsiguda-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-hayathnagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-himayatnagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-madhapur-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-hydernagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-indiranagar-bengaluru-india","/centers/best-autism-speech-aba-occupational-therapy-center-jagadamba-vizag-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-jubilee-hills-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-kachiguda-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-kadapa-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-kakinada-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-karimnagar-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-khajaguda-mehdipatnam-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-khammam-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-kondapur-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-kurnool-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-lbnagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-labbipet-vijayawada-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-mvp-vizag-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-madhurawada-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-mahbubnagar-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-marathalli-bengaluru-india","/centers/best-autism-speech-aba-occupational-therapy-center-miryalaguda-ts-india","/centers/best-autism-speech-aba-occupational-therapy-center-nad-vizag-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-nallagandla-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-nandyala-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-nellore-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-nizamabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-jntu-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-ongole-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-pragathi-nagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-rajahmundry-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-srnagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-santosh-nagar-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-suchitra2-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-tirupati-ap-india","/centers/best-autism-speech-aba-occupational-therapy-center-california-usa","/centers/best-autism-speech-aba-occupational-therapy-center-uppal-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-vanasthalipuram-hyderabad-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-vidyanagar-telangana-india","/centers/best-autism-speech-aba-occupational-therapy-center-vikrampuri-hyderabad-telangana-india"]) pages[path]={title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'};
  // Exact released public routes. The route-contract test detects future omissions.
  pages['/enroll-autism-speech-aba-therapies-india'] = {title:'Enrol at Pinnacle',group:'enrolment',service:'help'};
  for (const place of ['nandyala','ongole','tirupati','srikakulam']) {
    pages['/centers/best-autism-speech-aba-occupational-therapy-center-'+place+'-ap-india'] = {title:'Pinnacle Centre',group:'centre_detail',service:'help',measurementPath:'/centers'};
  }
  for (const path of ['/pinnacleai','/abilityscore','/seven-readiness-indexes','/personal-development-kernel','/prognose','/therapeuticai','/everyday-therapy','/fusion-module','/reassess-review-repeat']) {
    pages[path] = {title:'PinnacleAI',group:'pinnacleai',service:'help'};
  }
  for (const path of ['/self-sufficient','/mainstream']) pages[path] = {title:'Your Child’s Life at Pinnacle',group:'life_participation',service:'help'};
  pages['/everyday-therapy-home-study'] = {title:'Everyday Therapy Home Study',group:'research_study',service:'help'};
  for (const path of ['/about-pinnacle-proven-improvement-rate','/leadership','/pinnacle-global-autism-framework']) pages[path] = {title:'Pinnacle Blooms Network',group:'organisation',service:'help'};
  for (const path of ['/policies','/payment-and-billing','/privacy-policy','/terms-of-use','/terms-of-service','/cookie-policy','/copyright-and-intellectual','/age-restriction-policy','/contact-information','/disclaimer-and-limitations-of-liabilities','/endorsement-and-testimonial','/governing-and-jurisdiction','/third-party-inegration','/refund-policy','/staff-declaration','/ethics-charter']) {
    pages[path] = {title:'Pinnacle Public Information',group:'public_information',service:'help'};
  }
  // Only known catalogue paths enter the route allowlist; restrict their URL shape as well.
  const isBookPath = path => typeof path === 'string' && /^\/books\/(?:[a-z0-9-]+|(?:hi|te)\/[a-z0-9-]+|editions\/(?:hi|te)\/[a-z0-9-]+)$/.test(path);
  let commerceCatalogue = {};
  try {
    const raw = JSON.parse(document.querySelector('[data-book-commerce]')?.dataset?.cartCatalogue || '{}');
    commerceCatalogue = Object.fromEntries(Object.entries(raw).filter(([sku, item]) =>
      /^PBN-[A-Z0-9-]+$/.test(sku) && item && typeof item.title === 'string' &&
      isBookPath(item.path) && Number.isFinite(item.price) && item.price >= 0
    ));
  } catch {}
  if (Object.keys(commerceCatalogue).length) {
    const bookPaths = ['/shop', '/books', '/books/hi', '/books/te', ...Object.values(commerceCatalogue).flatMap(item =>
      [item.path, ...(Array.isArray(item.editionPaths) ? item.editionPaths.filter(isBookPath) : [])])];
    for (const path of bookPaths) pages[path] = {title:'Pinnacle Bookshop',group:'bookshop',service:'help'};
  }
  const documents = {'/speech-therapy/service-information':'Pinnacle Speech Therapy — Service Information','/speech-therapy/first-visit-guide':'Pinnacle Speech Therapy — First Visit Guide','/speech-therapy/teacher-observation-guide':'Pinnacle Speech Therapy — Teacher Observation Guide'};
  pages['/books/resources/first-conversation'] = {title:'Free First Conversation Planning Sheet',group:'family_resource',service:'help'};
  const pagePath = location.pathname;
  const publicCourses=['/certified-courses','/certified-courses/'].includes(pagePath);
  const legacyPublicTemplate=location.origin===origin&&document.body?.dataset.pageVariant==='legacy_public_template'&&['/assessments/stuttering-assessment','/certified-courses','/certified-courses/'].includes(pagePath);
  if(legacyPublicTemplate){
    pages[pagePath]=publicCourses
      ?{title:'Pinnacle Professional Learning',group:'professional_learning',service:'help',measurementPath:'/certified-courses'}
      :{title:'Pinnacle Assessment Information',group:'developmental_assessment',service:'help',measurementPath:'/speech-aba-autism-assessments'};
  }
  const contactPage=pagePath==='/contact-national-autism-helpline-24-7'&&document.querySelector('#pinnacle-contact[data-contact-contract="durable-contact-v1"]')?.dataset?.contactContract==='durable-contact-v1';
  if(contactPage)pages[pagePath]={title:'Contact Pinnacle Blooms',group:'contact',service:'help'};
  if(/^\/(?:account|auth|admin|api|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document|cart|checkout)(?:\/|$)|^\/shop\/(?:cart|checkout)(?:\/|$)|^\/books\/download(?:\/|$)/i.test(pagePath))return;
  const legacyKnowledge=!contactPage&&location.origin===origin&&document.body?.dataset.pageVariant==='legacy_knowledge'&&(/^(?:\/ma|\/t|\/b|\/c)\/[a-z0-9-]+\/?$/.test(pagePath)||pagePath==='/contact-national-autism-helpline-24-7');
  const privateAskPath = /^\/ask\/(?:te\/)?(?:account|auth|api|search)(?:\/|$)/.test(pagePath);
  const isAsk = location.origin === 'https://pinnacleblooms.org' && /^\/ask(?:\/|$)/.test(pagePath) && !privateAskPath && document.body?.dataset.pageVariant === 'ask';
  // Knowledge families use fixed buckets: never send questions, story IDs or searches.
  const knowledgePath = legacyKnowledge?'legacy-knowledge':location.origin === origin && document.body?.dataset.pageVariant === 'knowledge'
    ? (/^\/mirracles\/\d+(?:\/|$)/.test(pagePath)?'allmirracles':pagePath.match(/^\/(faq|sunshine|allmirracles|materials|interventions)(?:\/|$)/)?.[1]) : null;
  const knowledgeSearch = /^\/ask\/(?:te\/)?(?:account|auth|api|search)(?:\/|$)/.test(location.pathname);
  const canonical = isAsk ? 'https://pinnacleblooms.org/ask' : origin + (knowledgePath ? '/'+knowledgePath : pages[pagePath]?.measurementPath || (pages[pagePath]||Object.hasOwn(documents,pagePath)?pagePath:'/public-information'));
  const pageConfig = pages[pagePath] || (knowledgePath ? {title:'Pinnacle Knowledge Library',group:'knowledge',service:'help'} : null) || (isAsk ? {title:'Ask Pinnacle',group:'ask',service:'help'} : null) || (Object.hasOwn(documents,pagePath)?{title:documents[pagePath],group:'speech_therapy',service:'speech'}:null);
  const pageTitle = pageConfig?.title || 'Pinnacle Public Information';
  const pageGroup = pageConfig?.group || 'managed_page';
  const isBookshop = pageGroup === 'bookshop';
  // Retain bounded attribution identifiers only. The page identity remains the
  // public/coarse canonical: no answer slug, search, child field or fragment.
  const campaignFields = {utm_id:'campaign_id',utm_source:'campaign_source',utm_medium:'campaign_medium',utm_campaign:'campaign_name',utm_term:'campaign_term',utm_content:'campaign_content'};
  const campaignKeys = [...Object.keys(campaignFields),'utm_source_platform','utm_creative_format','utm_marketing_tactic'];
  const clickKeys = ['gclid','dclid','msclkid','fbclid','gbraid','wbraid'];
  const helplinePath='/national-autism-helpline';
  const campaigns = Object.fromEntries(Object.values(campaignFields).map(field=>[field,'']));
  const measurementURL = new URL(canonical);
  const safeAttribution = (value, key) => {
    const click = clickKeys.includes(key);
    if (typeof value !== 'string') return null;
    value = value.trim();
    if (!value || value.length > (click ? 256 : 128) ||
        !(click ? /^[A-Za-z0-9._~-]+$/ : key==='utm_id'?/^[A-Za-z0-9][A-Za-z0-9._~ -]*$/:/^(?![A-Za-z][A-Za-z0-9+.-]*:\/\/)(?![Ww][Ww][Ww]\.)(?![A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+\/)[\p{L}\p{N}][\p{L}\p{M}\p{N} ._~:()&,+\/'’–—-]*$/u).test(value)) return null;
    if (key === 'utm_id' && /^[1-9][0-9]{0,19}$/.test(value)) return value;
    // Encoded/nested values, email addresses, phone-like strings, credentials
    // and private clinical/free-text labels are not campaign identifiers.
    const words = value.replace(/[._~-]/g,' ');
    const numberParts = value.match(/(?:^|[^A-Za-z0-9])\+?\d[\d ().-]*\d(?=$|[^A-Za-z0-9])/g) || [];
    const phoneLike = numberParts.some(part=>part.replace(/\D/g,'').length >= 10) ||
      (/^[\d ().+-]+$/.test(value) && value.replace(/\D/g,'').length >= 7);
    if (/@|%[0-9a-f]{2}/i.test(value) || phoneLike ||
        /\b(?:private|secret|password|token)\b/i.test(words) ||
        /\b(?:my|our)\b.*\b(?:child|son|daughter|patient)\b/i.test(words) ||
        /\b(?:child|patient)\s+(?:name|id|details?|records?)\b/i.test(words) ||
        /\b(?:email|phone|mobile|diagnosis|symptoms|report)\s+(?:address|number|name|id|details?|records?|result|value)\b/i.test(words)) return null;
    return value;
  };
  try {
    const parameters = new URL(location.href).searchParams;
    for (const key of [...campaignKeys,...clickKeys]) {
      const values = parameters.getAll(key);
      if (values.length !== 1) continue;
      const value = safeAttribution(values[0],key);
      if (value === null) continue;
      measurementURL.searchParams.set(key,value);
      if (Object.hasOwn(campaignFields,key)) campaigns[campaignFields[key]] = value;
    }
  } catch {}
  const measurementLocation = measurementURL.href;
  // Ordinary referrals retain their origin; paths, query and fragments are never copied.
  let safeReferrer='';
  try {
    const ref=new URL(document.referrer);
    if(['https:','http:'].includes(ref.protocol)&&!ref.username&&!ref.password)safeReferrer=ref.origin+'/';
  } catch {}
  const routes = new Set([...Object.keys(pages), ...Object.keys(documents)]);
  const variant = document.body?.dataset.pageVariant === 'focused' ? 'focused' : 'service';
  const lifetime = 180 * 86400000;
  const production = location.protocol==='https:'&&['www.pinnacleblooms.org','pinnacleblooms.org'].includes(location.hostname)&&!privateAskPath;
  if (isAsk) routes.add('/ask');
  if (knowledgePath) routes.add('/'+knowledgePath);
/* PINNACLE_QA_PROVENANCE_START */
function normaliseValidationHints(value) {
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!['schemaVersion','provenance','hints'].includes(key))||value.schemaVersion!==1||value.provenance!=='client_observed'||!Array.isArray(value.hints)||value.hints.length<1||value.hints.length>2)return null;
 const allowed=['validation_test','qa_mode'];
 if(value.hints.some(key=>!allowed.includes(key))||new Set(value.hints).size!==value.hints.length)return null;
 return {schemaVersion:1,provenance:'client_observed',hints:allowed.filter(key=>value.hints.includes(key))};
}
function readClientQaHints({search=globalThis.location?.search||'',storage,now=Date.now()}={}) {
 const key='pinnacle-observed-qa-v1',lifetime=86400000;
 try{if(storage===undefined)storage=globalThis.sessionStorage;}catch{}
 const hints=new Set();let capturedAt=now;
 try{
  const params=new URLSearchParams(search);
  for(const name of ['validation_test','qa_mode']){
   const values=params.getAll(name),value=values[0];
   if(values.length===1&&typeof value==='string'&&value.length>0&&value.length<=128&&/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)&&!/^(?:0|false|off|no|none|null|undefined)$/i.test(value)&&(name==='validation_test'||/^(?:1|true|qa|test|validation|internal|fixture)$/i.test(value)))hints.add(name);
  }
 }catch{}
 try{
  const saved=JSON.parse(storage?.getItem(key)||'null');
  const prior=normaliseValidationHints(saved?.value);
  if(prior&&Number.isSafeInteger(saved.at)&&saved.at<=now&&now-saved.at<lifetime){capturedAt=Math.min(capturedAt,saved.at);for(const hint of prior.hints)hints.add(hint);}
  // Preserve the existing tab-level validation marker, whose only meaning is QA.
  const legacyAt=Number(storage?.getItem('pinnacle-validation-v1'));
  if(legacyAt>0&&legacyAt<=now&&now-legacyAt<lifetime){capturedAt=Math.min(capturedAt,legacyAt);hints.add('validation_test');}
 }catch{}
 const value=normaliseValidationHints({schemaVersion:1,provenance:'client_observed',hints:[...hints]});
 if(value)try{storage?.setItem(key,JSON.stringify({at:capturedAt,value}));}catch{}
 return value;
}
readClientQaHints();
/* PINNACLE_QA_PROVENANCE_END */
  let validationTraffic = new URL(location.href).searchParams.has('validation_test');
  // Keep an explicitly labelled QA journey out of live totals after its query
  // disappears during navigation. This tab-only flag contains no URL or user ID.
  try{if(validationTraffic)sessionStorage.setItem('pinnacle-validation-v1',String(Date.now()));else{const at=Number(sessionStorage.getItem('pinnacle-validation-v1'));validationTraffic=at>0&&at<=Date.now()&&Date.now()-at<86400000;}}catch{}
  const callPlacements = new Set(['callback-call','knowledge-call','ask-call','ask-answer-call','header-call','hero-call','centre-call','final-call','footer-call','mobile-call','directory-national-call','centre-national-call','centre-enquiry','ot-hero-call','ot-first-call','ot-final-call','aba-first-call','aba-final-call','autism-first-call','family-journey-call','example-call','pinnacleai-call','pinnacleai-close-call']);
  const enquiryPlacements = new Set(['knowledge-enrol','header-enrol','hero-assessment','early-assessment','visit-enquiry','final-enquiry','final-assessment','mobile-assessment','centre-enquiry','ot-final-enrol','aba-final-enrol','autism-first-enquiry']);
  const occupationalNavigation = new Set(['ot-hero-centres','ot-final-centres']);
  const abaNavigation = new Set(['aba-first-centres','aba-final-centres']);
  const directoryPlacements = new Set(['centre-profile','centre-maps','centre-whatsapp','centre-vcard','centre-share','centre-copy-link','centre-copy-citation']);
  // Dated, verified form choices. Tests require this list to match centre-directory.json.
  const centreIds = ["suchitra","gurunanak","jayanagar","annanagar","delhi","warangal","asraonagar","ananthapuram","attapur","bnreddynagar","begumpet","bhimavaram","chandanagar","dilsukhnagar","eastmarredpally","eluru","gachibowli","guntur","habsiguda","hayathnagar","himayatnagar","madhapur","hydernagar","indiranagar","jublieehills","kachiguda","kadapa","kakinada","karimnagar","khajaguda","khammam","kondapur","kukatpally","kurnool","lbnagar","labbipet","mvp","madhurawada","mahbubnagar","marathahalli","miryalaguda","nad","nallagandla","nandyala","nellore","nizamabad","nizampet","ongole","pragathinagar","rajahmundry","srnagar","santoshnagar","srikakulam","suchitraii","tirupati","uppal","vanasthalipuram","vidyanagar","vikrampuri"];
  // Functional service routing remains independent of measurement.
  if(['speech','occupational','aba','autism','education'].includes(pageConfig?.service)){
    import('/pinnacle-pages-scripts/enrolment-routing.mjs?v=paid-locality-20261017-regional').then(({applyPaidEnquiryLinks,paidCentreAliases})=>applyPaidEnquiryLinks(document,location.href,{service:pageConfig?.service||'help',centres:new Set(Object.values(paidCentreAliases))})).catch(()=>{});
  }
  let enabled = false, loaded = false, tagStarted = false, pageViewSent = false;
  const sourceKey='pinnacle-enquiry-source-v1',sourceLifetime=30*86400000;
  const acquisitionPath=location.pathname==='/speech-therapy/service-information'?'/top-speech-therapy-center-india-proven-improvement-rate':new URL(canonical).pathname;
  const acquisitionPaths=new Set(['/','/contact-national-autism-helpline-24-7','/centers','/autism-therapy','/speech-aba-autism-assessments','/top-speech-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/best-special-education-center-call-9100181181','/enroll-autism-speech-aba-therapies-india','/pinnacleai','/abilityscore','/seven-readiness-indexes','/personal-development-kernel','/prognose','/therapeuticai','/everyday-therapy','/fusion-module','/reassess-review-repeat','/self-sufficient','/mainstream','/faq','/sunshine','/allmirracles']);
  acquisitionPaths.add(helplinePath);
  acquisitionPaths.add('/certified-courses');
  const handedOffLinks=new Map();
  const readSource=(snapshot)=>{
    if(!enabled)return null;
    try{
      const saved=snapshot===undefined?JSON.parse(localStorage.getItem(sourceKey)):snapshot;
      if(!saved||Object.keys(saved).some(key=>!['schemaVersion','consent','capturedAt','landingPath','fields'].includes(key))||saved.schemaVersion!==1||saved.consent!=='analytics_accepted'||!Number.isSafeInteger(saved.capturedAt)||saved.capturedAt>Date.now()||Date.now()-saved.capturedAt>sourceLifetime||!acquisitionPaths.has(saved.landingPath)){if(saved&&snapshot===undefined)localStorage.removeItem(sourceKey);return null;}
      const fields={};for(const [field,value]of Object.entries(saved.fields||{})){if(![...campaignKeys,...clickKeys].includes(field)||safeAttribution(value,field)!==value)return null;fields[field]=value;}
      if(!Object.keys(fields).length)return null;
      return {schemaVersion:1,consent:'analytics_accepted',capturedAt:saved.capturedAt,landingPath:saved.landingPath,fields};
    }catch{return null;}
  };
  const rememberSource=()=>{
    if(!production||knowledgeSearch||isBookshop||validationTraffic||!acquisitionPaths.has(acquisitionPath))return;
    const fields=Object.fromEntries(measurementURL.searchParams);
    // A direct return retains the last permitted campaign instead of erasing it.
    if(!Object.keys(fields).length)return;
    // Internal links may carry the same validated campaign into Enrolment.
    // Keep that journey's original landing and capture time; a different complete
    // field set still starts a new source, without combining old and new fields.
    const retained=readSource();
    if(retained&&Object.keys(fields).length===Object.keys(retained.fields).length&&Object.entries(fields).every(([key,value])=>retained.fields[key]===value))return;
    // A declared GBP visit is weaker evidence than an already permitted paid
    // journey. Keep the complete prior envelope; never attach its click ID to
    // a different listing's UTMs or silently turn a paid source into organic.
    const isGbp=fields.utm_source?.toLowerCase()==='google'&&fields.utm_medium?.toLowerCase()==='organic'&&fields.utm_campaign?.toLowerCase()==='gbp';
    const paidEvidence=value=>!!value&&(['gclid','gbraid','wbraid','dclid','msclkid'].some(key=>!!value[key])||['cpc','ppc','paid','paid_search','paidsearch','paid-search','paid search','cpm','cpv','display','paid_social','paid_video'].includes(value.utm_medium?.toLowerCase()));
    if(isGbp&&!paidEvidence(fields)&&paidEvidence(readSource()?.fields))return;
    try{localStorage.setItem(sourceKey,JSON.stringify({schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:acquisitionPath,fields}));}catch{}
  };
  // Form submission must still work if measurement is unavailable.
  window.pinnacleEnquirySource=()=>production&&enabled&&!knowledgeSearch&&!isBookshop&&!validationTraffic?readSource():null;
  const permittedCampaigns=()=>{
    const retained=window.pinnacleEnquirySource();
    if(!Object.keys(Object.fromEntries(measurementURL.searchParams)).length&&retained?.landingPath===helplinePath){
      return {...campaigns,campaign_source:retained.fields.utm_source,campaign_medium:retained.fields.utm_medium,campaign_name:retained.fields.utm_campaign};
    }
    return campaigns;
  };
  // The cart asks at navigation time and only accepts Google's bounded linker value.
  if (isBookshop) window.pinnacleBookAnalyticsAllowed = () => production && enabled && !validationTraffic;
  const send = (name, parameters) => {
    if (!production || !enabled || knowledgeSearch || validationTraffic) return false;
    try { window.gtag('event', name, {...permittedCampaigns(), page_group:pageGroup, measurement_mode:'automatic', ...parameters, page_variant:variant, page_location:measurementLocation, page_title:pageTitle, page_referrer:safeReferrer, send_to:id}); return true; } catch { return false; }
  };
  const vitalRelease = 'ga4-reliability-20261011';
  let vitalsStarted = false;
  const vitalShape = (name,value) => {
    if (!Number.isFinite(value) || value < 0) return null;
    if (name === 'LCP') return {rating:value<=2500?'good':value<=4000?'needs_improvement':'poor',value_bucket:value<=1000?'le_1s':value<=2500?'1_2_5s':value<=4000?'2_5_4s':'gt_4s'};
    if (name === 'INP') return {rating:value<=200?'good':value<=500?'needs_improvement':'poor',value_bucket:value<=100?'le_100ms':value<=200?'100_200ms':value<=500?'200_500ms':'gt_500ms'};
    if (name === 'CLS') return {rating:value<=0.1?'good':value<=0.25?'needs_improvement':'poor',value_bucket:value<=0.05?'le_0_05':value<=0.1?'0_05_0_1':value<=0.25?'0_1_0_25':'gt_0_25'};
    return null;
  };
  const startWebVitals = () => {
    if (vitalsStarted || !production || !enabled || knowledgeSearch || validationTraffic || typeof PerformanceObserver !== 'function' || Math.random() >= 0.1) return;
    vitalsStarted = true;
    const values={LCP:null,INP:null,CLS:0},seen={CLS:false},sent=new Set(),observers=[],interactions=new Map();
    const watch=(type,receive,options={type,buffered:true})=>{try{const observer=new PerformanceObserver(list=>{for(const entry of list.getEntries())receive(entry);});observer.observe(options);observers.push(observer);}catch{}};
    watch('largest-contentful-paint',entry=>{values.LCP=entry.renderTime||entry.loadTime||entry.startTime;});
    watch('event',entry=>{if(entry.interactionId>0&&Number.isFinite(entry.duration)){interactions.set(entry.interactionId,Math.max(interactions.get(entry.interactionId)||0,entry.duration));const durations=[...interactions.values()].sort((a,b)=>b-a);values.INP=durations[Math.floor(durations.length/50)]||null;}},{type:'event',buffered:true,durationThreshold:40});
    // CLS is the largest session window, not all shifts across a long visit.
    let clsStart=null,clsLast=null,clsWindow=0;
    watch('layout-shift',entry=>{if(!entry.hadRecentInput&&Number.isFinite(entry.value)){
      const at=Number.isFinite(entry.startTime)?entry.startTime:0;
      if(clsStart!==null&&at-clsLast<1000&&at-clsStart<5000)clsWindow+=entry.value;
      else{clsStart=at;clsWindow=entry.value;}
      clsLast=at;values.CLS=Math.max(values.CLS,clsWindow);seen.CLS=true;
    }});
    const emit=()=>{
      if (!enabled || validationTraffic) return;
      for(const name of ['LCP','INP','CLS']){
        if(sent.has(name)||(name==='CLS'?!seen.CLS:values[name]===null))continue;
        const shape=vitalShape(name,values[name]);if(!shape)continue;
        try{window.gtag('event','web_vital_sample',{metric_name:name,...shape,release_id:vitalRelease,page_group:pageGroup,send_to:id});sent.add(name);}catch{}
      }
      for(const observer of observers)try{observer.disconnect();}catch{}
    };
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')emit();});
    window.addEventListener?.('pagehide',emit,{once:true});
  };
  // One fixed signal of each kind per document, with no vendor/user payload.
  // A GTM consumer may use these for traffic protection; they are not Ads goals
  // or qualified leads. Never replay during QA or after an unavailable vendor.
  const protectionEvents = window.__pinnacleProtectionEvents || (window.__pinnacleProtectionEvents = new Set());
  // Standard public-page protection starts independently of URL parameters,
  // fragments, referrers and mutable Ads inventories. The founder removed those
  // load gates on20Oct2026. Private routes and explicit isolated QA stay excluded.
  window.pinnacleProtectionAllowed = () => {
    try {
      return !!(!validationTraffic &&
        location.protocol === 'https:' && ['www.pinnacleblooms.org','pinnacleblooms.org'].includes(location.hostname) &&
        !/^\/(?:account|auth|admin|api|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(location.pathname) &&
        !/^\/ask\/(?:te\/)?(?:account|auth|api|search)(?:\/|$)/.test(location.pathname));
    } catch { return false; }
  };
  // Native GTM Data Layer variables can read these booleans without Custom JS
  // or unsafe-eval. The two source bridge events keep their exact event-only shape.
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({pinnacle_canonical_measurement:true,pinnacle_protection_allowed:false});
  const ensureProtectionContainer=()=>{
    if(!window.pinnacleProtectionAllowed()||window.__pinnacleProtectionContainer)return;
    window.dataLayer.push({pinnacle_protection_allowed:true});
    // External first-party module: no CustomHTML/CustomJS or extra GTM producer
    // is needed on managed pages. Retained legacy GTM uses the ownership flag.
    const state=window.__pinnacleProtectionContainer={status:'pending'};
    const script=document.createElement('script');script.type='module';script.referrerPolicy='origin';
    script.id='pinnacle-protection-container';script.src='https://www.pinnacleblooms.org/pinnacle-pages-scripts/protection-consumer.mjs?v=protection-default-20261020';
    if(measurementNonce)script.nonce=measurementNonce;
    const cancel=()=>{state.status='cancelled';script.remove?.();};
    document.addEventListener('pinnacle_protection_cancel',cancel,{once:true});
    window.addEventListener?.('pagehide',cancel,{once:true});
    // The consumer rechecks before SDK insertion and invocation. Removing a
    // pending module alone is not a browser cancellation guarantee.
    if(!window.pinnacleProtectionAllowed()){cancel();return;}
    document.head.append(script);state.status='requested';
  };
  const queueProtectionEvent = (name, acceptedSource = null) => {
    if (!['pinnacle_contact_intent','pinnacle_enquiry_accepted'].includes(name) ||
        !window.pinnacleProtectionAllowed() || protectionEvents.has(name)) return false;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:name});
      protectionEvents.add(name);
      if(window.__pinnacleProtectionConsumer)window.__pinnacleProtectionConsumer.signal(name);
      else{const pending=window.__pinnacleProtectionPending||(window.__pinnacleProtectionPending=new Set());pending.add(name);try{ensureProtectionContainer();}catch{}}
      return true;
    } catch { return false; } // Never interfere with contact navigation or receipt handling.
  };
  // These identify tagged navigation/contact intent, never completed calls or
  // conversions. Use only the already sanitised current/permitted source fields.
  const paidGoogleMedia = new Set(['cpc','ppc','paid','paid_search','paidsearch','paid-search','paid search','cpm','cpv','display','paid_social','paid_video']);
  const googleAdsEvents = window.__pinnacleGoogleAdsEvents || (window.__pinnacleGoogleAdsEvents = new Set());
  const googleAdsSource = (allowJourney = true) => {
    const current = Object.fromEntries(measurementURL.searchParams);
    const tagged = Object.keys(current).length > 0;
    const fields = tagged ? current : allowJourney && enabled && !isBookshop ? readSource()?.fields : null;
    if (!fields) return null;
    const click = ['gclid','gbraid','wbraid'].some(field => !!fields[field]);
    const paid = fields.utm_source?.toLowerCase() === 'google' && paidGoogleMedia.has(fields.utm_medium?.toLowerCase());
    if (!click && !paid) return null;
    return {traffic_source:'google_ads',source_basis:tagged?'current_url':'permitted_journey',attribution_method:click?'click_id':'paid_utm',
      ...Object.fromEntries(Object.entries(campaignFields).filter(([field])=>fields[field]).map(([field,name])=>[name,fields[field]]))};
  };
  const sendGoogleAds = (name, parameters, allowJourney = true) => {
    if (!production || !enabled || knowledgeSearch || validationTraffic || googleAdsEvents.has(name)) return;
    const attribution = googleAdsSource(allowJourney);
    if (!attribution) return;
    try {
      const payload={schema_version:1,page_group:pageGroup,measurement_mode:'automatic',...attribution,...parameters};
      send(name,payload);
      googleAdsEvents.add(name);
    } catch {} // Measurement failure must not stop native calling or WhatsApp.
  };
  // A navigation handoff carries only already validated campaign fields. It
  // carries no reader identity, question, history or child data.
  document.addEventListener('click',event=>{
    const link=event.target?.closest?.('a[href]');if(!link||!(isAsk||knowledgePath))return;
    if(handedOffLinks.has(link)){link.href=handedOffLinks.get(link);handedOffLinks.delete(link);}
    const library=isAsk?'ask':knowledgePath==='allmirracles'?'mirracles':knowledgePath;
    const action=link.dataset?.cta;
    if(action==='knowledge-enrol')send('enquiry_link_click',{schema_version:2,page_group:pageGroup,library,link_placement:action,destination:'existing_enrolment_form'});
    if(action==='knowledge-service')send('knowledge_service_click',{schema_version:1,page_group:'knowledge',library,link_placement:action,destination:'therapy_services'});
    if(action==='knowledge-centres')send('knowledge_centres_click',{schema_version:1,page_group:'knowledge',library,link_placement:action,destination:'published_centre_directory'});
    if(!production||!enabled||knowledgeSearch||validationTraffic)return;
    try{
      const target=new URL(link.href||link.getAttribute('href'),location.href);
      if(target.origin!==origin||!acquisitionPaths.has(target.pathname))return;
      const fields=readSource()?.fields||Object.fromEntries(measurementURL.searchParams);
      for(const [name,value]of Object.entries(fields))if(!target.searchParams.has(name))target.searchParams.set(name,value);
      handedOffLinks.set(link,link.href||link.getAttribute('href'));link.href=target.href;
    }catch{}
  });
  const commerceNames = new Set(['view_item','view_cart','add_to_cart','remove_from_cart','begin_checkout']);
  const sendCommerce = (name, lines) => {
    if (pageGroup !== 'bookshop' || !commerceNames.has(name) || !Array.isArray(lines) || !lines.length || lines.length > 50) return;
    const items = [];
    for (const line of lines) {
      const entry = line && Object.hasOwn(commerceCatalogue, line.sku) ? commerceCatalogue[line.sku] : null;
      if (!entry || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 50 ||
          !Number.isFinite(line.price) || line.price < 0 || line.price > entry.price) return;
      items.push({item_id:line.sku,item_name:entry.title,item_brand:'Pinnacle Blooms Network',item_category:'Books',item_variant:'PDF',price:line.price,quantity:line.quantity});
    }
    const value = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
    send(name, {schema_version:3,page_group:'bookshop',currency:'INR',value,items,transport_type:'beacon'});
  };
  document.addEventListener('pinnacle:commerce', event => sendCommerce(event.detail?.name, event.detail?.items));
  // The protected receiver ledger remains the business authority. Analytics
  // records only the fixed public event vocabulary and validated campaign fields.
  const configureTag = (measuredLocation, fields = {}) => {
    // Visible legacy per-page cookies can otherwise shadow the shared root
    // identity on a returning browser. Expire only that page's old scope,
    // after the shared root identity is established; leave root, book, Ask and knowledge cookies intact.
    if(!isBookshop&&!isAsk&&!knowledgePath&&pagePath!=='/'){
      for(const cookie of document.cookie.split(';')){
        const name=cookie.trim().split('=')[0];
        if(!/^ps_ga(?:_[A-Za-z0-9_]+)?$/.test(name))continue;
        for(const domain of ['', 'www.pinnacleblooms.org', 'pinnacleblooms.org']){
          document.cookie=name+'=; Max-Age=0; path='+pagePath+';'+(domain?' domain='+domain+';':'')+' SameSite=Lax; Secure';
        }
      }
    }
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (!window.__pinnacleConsentDefaults) {
      window.__pinnacleConsentDefaults = true;
      window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted'});
    }
    window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted'});
    window.gtag('set','ads_data_redaction',false);
    window.gtag('set','url_passthrough',false);
    if (!tagStarted) window.gtag('js',new Date());
    window.gtag('config',id,{
      send_page_view:false,
      // One public-site visit must keep its GA4 identity when a
      // family moves from a service/centre page to Enrolment. Per-page cookie
      // paths create a new client/session at that handoff. Keep the existing
      // separate book namespace and Ask/knowledge scopes.
      cookie_prefix:isBookshop?'pbn_books':'ps',cookie_path:isBookshop?'/':isAsk?'/ask':knowledgePath?'/'+knowledgePath:'/',cookie_domain:isAsk?'pinnacleblooms.org':'www.pinnacleblooms.org',cookie_flags:'SameSite=Lax;Secure',cookie_expires:lifetime/1000,cookie_update:false,
      page_location:measuredLocation,page_title:pageTitle,page_referrer:safeReferrer,ignore_referrer:!safeReferrer,
      ...Object.fromEntries(Object.values(campaignFields).map(field=>[field,''])),...fields
    });
    if (!tagStarted && !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script=document.createElement('script');
      script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;
      document.head.append(script);
    }
    tagStarted = true;
  };
  const limitedActionNames = new Set(['phone_link_click','whatsapp_link_click','enquiry_link_click']);
  const sendPublicIntent = (name, parameters) => {
    if (!limitedActionNames.has(name) || !parameters || parameters.page_group!==pageGroup) return false;
    const placement=parameters.link_placement,destination=parameters.destination;
    if (name==='phone_link_click' && parameters.schema_version===2 && destination==='national_helpline' && (callPlacements.has(placement)||placement==='central-phone')) return send(name,{schema_version:2,link_placement:placement,destination});
    if (name==='whatsapp_link_click' && parameters.schema_version===4 && destination==='national_helpline' && ['header-whatsapp','hero-whatsapp','footer-whatsapp','mobile-whatsapp','centre-whatsapp','knowledge-whatsapp','ask-whatsapp','central-whatsapp'].includes(placement)) return send(name,{schema_version:4,link_placement:placement,destination});
    if (name==='enquiry_link_click' && parameters.schema_version===2 && destination==='existing_enrolment_form' && enquiryPlacements.has(placement)) return send(name,{schema_version:2,link_placement:placement,destination});
    return false;
  };
  const sendPageViewOnce = () => {
    if (pageViewSent) return false;
    const sent=send('page_view',{page_group:pageGroup,schema_version:2});
    if(sent)pageViewSent=true;
    return sent;
  };
  const start = () => {
    if (!production || knowledgeSearch) return;
    enabled = true;
    rememberSource();
    if(validationTraffic)return;
    try { ensureProtectionContainer(); } catch {} // Optional protection never disables analytics/contact.
    if (loaded) return;
    configureTag(measurementLocation,permittedCampaigns());
    loaded = true;
    sendPageViewOnce();
    startWebVitals();
    sendGoogleAds('google_ads_arrival',{interaction_kind:'navigation'},false);
    const viewed = Object.entries(commerceCatalogue).find(([, item]) => item.path === pagePath);
    if (viewed) sendCommerce('view_item', [{sku:viewed[0],quantity:1,price:viewed[1].price}]);
  };
  start();
  // Only a currently tagged landing is an arrival; a retained journey is not.
  sendGoogleAds('google_ads_arrival',{interaction_kind:'navigation'},false);
  // Fixed event vocabulary only; arbitrary query values and form data are excluded.
  const acceptedRequests=window.__pinnacleAcceptedRequests||(window.__pinnacleAcceptedRequests=new Set());
  const formStages=new Set(['start','attempt','error']);
  const formErrors=new Set(['validation','storage_unavailable','endpoint_unavailable','receiver_rejected','receiver_unconfirmed']);
  let formStarted=false;
  document.addEventListener('pinnacle:enquiry-progress',event=>{
    const detail=event?.detail;
    if(!detail||!formStages.has(detail.stage)||Object.keys(detail).some(k=>!['stage','error_category'].includes(k)))return;
    if(!document.querySelector('#pinnacle-enrolment[data-api-endpoint="/api/enrolment"]'))return;
    if(detail.stage==='error'&&!formErrors.has(detail.error_category))return;
    if(detail.stage!=='error'&&detail.error_category!==undefined)return;
    if(detail.stage==='start'&&formStarted)return;
    const name={start:'form_start',attempt:'enquiry_submit_attempt',error:'form_error'}[detail.stage];
    send(name,{schema_version:1,link_placement:pageGroup==='enrolment'?'enrolment-form':'inline-callback-form',destination:'existing_enrolment_workflow',...(detail.stage==='error'?{error_category:detail.error_category}:{}),release_id:vitalRelease});
    if(detail.stage==='start'&&production&&enabled&&!knowledgeSearch&&!validationTraffic)formStarted=true;
  });
  const contactRequests=new Set();
  document.addEventListener('pinnacle:contact-accepted',event=>{
    const receipt=event?.detail?.receipt;
    if(!contactPage||event.detail.contract!=='website_contact_v1'||!receipt||receipt.schemaVersion!==1||typeof receipt.requestId!=='string'||typeof receipt.id!=='string'||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.requestId)||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.id)||Object.keys(receipt).some(k=>!['schemaVersion','requestId','id'].includes(k))||contactRequests.has(receipt.requestId)||!enabled)return;
    send('contact_received',{schema_version:1,link_placement:'contact-form',destination:'existing_contact_workflow'});
    contactRequests.add(receipt.requestId);
  });
  document.addEventListener('pinnacle:enquiry-accepted', event => {
    const receipt=event?.detail?.receipt;
    if(!receipt||receipt.schemaVersion!==1||typeof receipt.requestId!=='string'||typeof receipt.id!=='string'||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.requestId)||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.id)||Object.keys(receipt).some(k=>!['schemaVersion','requestId','id'].includes(k)))return;
    const callbackPage=(['centre_detail','centre_directory','occupational_therapy','aba_therapy','autism_therapy'].includes(pageGroup)||location.pathname==='/speech-therapy/service-information')&&document.querySelector('#pinnacle-enrolment[data-callback-contract="durable-enrolment-v1"][data-api-endpoint="/api/enrolment"]');
    const parentContact=contactPage&&event.detail?.contract==='website_contact_v1'&&['Therapy Services','Assessments'].includes(event.detail.topic);
    if ((pageGroup !== 'enrolment'&&!callbackPage&&!parentContact) || acceptedRequests.has(receipt.requestId) || !production || !enabled || knowledgeSearch || validationTraffic) return;
    try {
      const parameters={schema_version:4,page_group:parentContact?'contact':'enrolment',link_placement:parentContact?'contact-form':callbackPage?'inline-callback-form':'enrolment-form',destination:parentContact?'existing_contact_workflow':'existing_enrolment_workflow',measurement_mode:'automatic'};
      // The receipt belongs to the submitted snapshot, not a later tab/URL.
      const acceptedSource=readSource(event.detail?.acquisition||null);
      const acceptedCampaigns=Object.fromEntries(Object.values(campaignFields).map(field=>[field,'']));
      for(const [field,name]of Object.entries(campaignFields))if(acceptedSource?.fields[field])acceptedCampaigns[name]=acceptedSource.fields[field];
      send('enquiry_accepted',{...parameters,...acceptedCampaigns});
      queueProtectionEvent('pinnacle_enquiry_accepted',acceptedSource);
      acceptedRequests.add(receipt.requestId);
    } catch {} // The receipt and parent confirmation survive a vendor failure.
  });
  document.addEventListener('click',event=>{
    if (pageGroup === 'family_resource') {
      const resourceLink=event.target?.closest?.('a[data-resource="first_conversation_v1"]');
      if(resourceLink?.getAttribute('href') === '/books/resources/Pinnacle-First-Conversation-v1.pdf') send('resource_download_click',{schema_version:3,page_group:'family_resource',resource_id:'first_conversation_v1',format:'pdf',language:'en',link_placement:'resource_download',destination:'first_conversation_pdf'});
    }
    const contactLink = event.target?.closest?.('a[href]');
    const contactHref = contactLink?.getAttribute('href');
    if (contactHref === 'tel:+919100181181' || (contactHref?.startsWith('tel:') && contactLink.dataset?.pinnacleAdCallTarget === 'central')) {
      const placement = contactLink.dataset?.cta;
      sendGoogleAds('google_ads_phone_click',{interaction_kind:'contact_tap',link_placement:callPlacements.has(placement)?placement:'central-phone',destination:'national_helpline'});
      sendPublicIntent('phone_link_click',{schema_version:2,page_group:pageGroup,link_placement:callPlacements.has(placement)?placement:isBookshop?'bookshop-contact':'central-phone',destination:'national_helpline'});
      if (event.isTrusted === true) queueProtectionEvent('pinnacle_contact_intent');
      return; // One canonical central-phone event; keep native navigation unchanged.
    }
    try {
      const target = new URL(contactHref,origin);
      const centralWhatsApp = target.protocol === 'https:' && !target.username && !target.password && !target.port && (
        (target.hostname === 'wa.me' && /^\/919100181181\/?$/.test(target.pathname)) ||
        (target.hostname === 'api.whatsapp.com' && /^\/send\/?$/.test(target.pathname) &&
          target.searchParams.getAll('phone').length === 1 && /^\+?919100181181$/.test(target.searchParams.get('phone')))
      );
      if (centralWhatsApp) {
        const placement = contactLink.dataset?.cta;
        const placements = new Set(['header-whatsapp','hero-whatsapp','footer-whatsapp','mobile-whatsapp','centre-whatsapp','knowledge-whatsapp','ask-whatsapp']);
        sendGoogleAds('google_ads_whatsapp_click',{interaction_kind:'contact_tap',link_placement:placements.has(placement)?placement:'central-whatsapp',destination:'national_helpline'});
        sendPublicIntent('whatsapp_link_click',{schema_version:4,page_group:pageGroup,link_placement:placements.has(placement)?placement:isBookshop?'bookshop-contact':'central-whatsapp',destination:'national_helpline'});
        if (event.isTrusted === true) queueProtectionEvent('pinnacle_contact_intent');
        return; // One event per contact tap; sharing text never enters the event.
      }
    } catch {}
    if (pageGroup === 'bookshop') {
      const href = contactHref;
      if (href) {
        try {
          const target = new URL(href, origin);
          const destination = target.href;
          const sample = Object.values(commerceCatalogue).flatMap(item => Array.isArray(item.books) ? item.books : [])
            .find(book => typeof book.sample === 'string' && new URL(book.sample, origin).href === destination);
          if (sample) send('sample_preview', {schema_version:3,page_group:'bookshop',item_id:sample.sku,item_name:sample.title,link_placement:'book_sample',destination:'book_sample_pdf'});
        } catch {}
      }
    }
    const link=event.target?.closest?.('[data-cta]');
    if (!link) return;
    const placement=link.dataset.cta,href=link.getAttribute('href');
    if (directoryPlacements.has(placement)) send('centre_directory_action',{schema_version:2,page_group:pageGroup,action:placement.replace('centre-',''),link_placement:placement,destination:'published_centre_directory'});
    if (!href) return;
    if (pageGroup==='occupational_therapy' && (occupationalNavigation.has(placement)||placement==='mobile-assessment') && href==='#centres') send('centre_section_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'published_centre_directory'});
    if (pageGroup==='aba_therapy' && abaNavigation.has(placement) && href==='#centres') send('centre_section_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'published_centre_directory'});
    if (pageGroup==='occupational_therapy' && placement==='ot-share-whatsapp' && href.startsWith('https://wa.me/?text=')) send('page_share_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'whatsapp_share'});
    if (pageGroup==='aba_therapy' && placement==='aba-share-whatsapp' && href.startsWith('https://wa.me/?text=')) send('page_share_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'whatsapp_share'});
    let validEnquiry=false;
    try {
      const destination=new URL(href,origin);
      const routingUnambiguous=['entry','service','centre'].every(key=>destination.searchParams.getAll(key).length<=1);
      const validCentre=!destination.searchParams.has('centre')||centreIds.includes(destination.searchParams.get('centre'));
      const service=destination.searchParams.get('service'),entry=destination.searchParams.get('entry');
      const validService=!service||service===pageConfig?.service;
      const validEntry=!entry||(pageConfig?.service==='speech'&&entry==='speech-assessment');
      validEnquiry=destination.origin===origin&&destination.pathname==='/enroll-autism-speech-aba-therapies-india'&&routingUnambiguous&&validCentre&&validService&&validEntry;
    } catch {}
    if (enquiryPlacements.has(placement) && validEnquiry && !(placement==='knowledge-enrol'&&(isAsk||knowledgePath))) sendPublicIntent('enquiry_link_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'existing_enrolment_form'});
  });
  if(legacyKnowledge&&window.__pinnacleLegacyCapture){
    const capture=window.__pinnacleLegacyCapture;capture.stop?.();
    for(const kind of Array.isArray(capture.queue)?capture.queue.splice(0,10):[]){
      if(kind==='call')send('phone_link_click',{schema_version:2,page_group:pageGroup,link_placement:'knowledge-call',destination:'national_helpline'});
      if(kind==='whatsapp')send('whatsapp_link_click',{schema_version:4,page_group:pageGroup,link_placement:'knowledge-whatsapp',destination:'national_helpline'});
    }
  }
})();

// Reuse one first-party installer; its own route, QA and payload guards keep it dormant where ineligible.
if (location.origin === 'https://www.pinnacleblooms.org' && !document.querySelector('script[data-pinnacle-cheq-loader]')) {
  const protection = document.createElement('script');
  protection.src = '/pinnacle-pages-scripts/cheq-protection.js?v=measurement-completion-20261020';
  protection.defer = true;
  protection.setAttribute('data-pinnacle-cheq-loader','');
  document.head.append(protection);
}
