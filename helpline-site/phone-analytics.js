'use strict';
(() => {
  const id = 'G-H9CLX1WJ7R';
  const adsId = 'AW-10810823199';
  const callAction = adsId + '/VNUcCMSy3YobEJ-kgKMo';
  const canonical = 'https://www.pinnacleblooms.org/national-autism-helpline';
  const sourceKey = 'pinnacle-enquiry-source-v1', sourceLifetime = 30 * 86400000;
  const landingPath = '/national-autism-helpline', capturedAt = Date.now();
  const production = location.origin === 'https://www.pinnacleblooms.org' && location.pathname === landingPath;
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
  // Legacy suppression timestamps do not retain the original value and cannot establish provenance.
 }catch{}
 const value=normaliseValidationHints({schemaVersion:1,provenance:'client_observed',hints:[...hints]});
 if(value)try{storage?.setItem(key,JSON.stringify({at:capturedAt,value}));}catch{}
 return value;
}
readClientQaHints();
/* PINNACLE_QA_PROVENANCE_END */
  let validationTraffic = new URL(location.href).searchParams.has('validation_test');
  try {
    if (validationTraffic) sessionStorage.setItem('pinnacle-validation-v1', String(Date.now()));
    else {
      const at = Number(sessionStorage.getItem('pinnacle-validation-v1'));
      validationTraffic = at > 0 && at <= Date.now() && Date.now() - at < 86400000;
    }
  } catch {}
  if (!production || validationTraffic || window.__pinnacleHelplineMeasurement) return;
  window.__pinnacleHelplineMeasurement = true;

  // Build refreshes this exact shared validator; no ESM is placed in the inline script.
  /* PINNACLE_SHARED_ACQUISITION_START */
const ACQUISITION_KEYS=['utm_id','utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid'];
const CLICK_KEYS=new Set(['gclid','dclid','msclkid','fbclid','gbraid','wbraid']);
function safeAcquisitionValue(value,key){
 if(typeof value!=='string'||!ACQUISITION_KEYS.includes(key))return null;
 value=value.trim();const click=CLICK_KEYS.has(key);
 if(!value||value.length>(click?256:128)||!(click?/^[A-Za-z0-9._~-]+$/:/^[A-Za-z0-9][A-Za-z0-9._~ -]*$/).test(value))return null;
 if(key==='utm_id'&&/^[1-9][0-9]{0,19}$/.test(value))return value;
 const words=value.replace(/[._~-]/g,' '),parts=value.match(/(?:^|[^A-Za-z0-9])\+?\d[\d ().-]*\d(?=$|[^A-Za-z0-9])/g)||[];
 if(/@|%[0-9a-f]{2}/i.test(value)||parts.some(p=>p.replace(/\D/g,'').length>=10)||(/^[\d ().+-]+$/.test(value)&&value.replace(/\D/g,'').length>=7)||/\b(?:private|secret|password|token)\b/i.test(words)||/\b(?:my|our)\b.*\b(?:child|son|daughter|patient)\b/i.test(words)||/\b(?:child|patient)\s+(?:name|id|details?|records?)\b/i.test(words)||/\b(?:email|phone|mobile|diagnosis|symptoms|report)\s+(?:address|number|name|id|details?|records?|result|value)\b/i.test(words))return null;
 return value;
}
  /* PINNACLE_SHARED_ACQUISITION_END */
  const params = new URL(location.href).searchParams;
  const fields = {};
  for (const key of ACQUISITION_KEYS) {
    const values = params.getAll(key);
    if (values.length !== 1) continue; // Duplicate optional identifiers are ambiguous, not a reason to block the visit.
    const safe = safeAcquisitionValue(values[0],key);
    if (safe !== null) fields[key] = safe;
  }
  const acquisitionPath = /^\/(?:national-autism-helpline|contact-national-autism-helpline-24-7|centers|autism-therapy|speech-aba-autism-assessments|top-speech-therapy-center-india-proven-improvement-rate|best-occupational-therapy-center-india-proven-improvement-rate|best-aba-therapy-center-india-proven-improvement-rate|best-special-education-center-call-9100181181|enroll-autism-speech-aba-therapies-india|certified-courses|pinnacleai|abilityscore|seven-readiness-indexes|personal-development-kernel|prognose|therapeuticai|everyday-therapy|fusion-module|reassess-review-repeat|self-sufficient|mainstream|faq|sunshine|allmirracles)?$/;
  const readSource = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(sourceKey));
      if (!saved || Object.keys(saved).some(key=>!['schemaVersion','consent','capturedAt','landingPath','fields'].includes(key)) || saved.schemaVersion !== 1 || saved.consent !== 'analytics_accepted' || !Number.isSafeInteger(saved.capturedAt) || saved.capturedAt > Date.now() || Date.now()-saved.capturedAt > sourceLifetime || typeof saved.landingPath !== 'string' || !acquisitionPath.test(saved.landingPath)) return null;
      const entries = Object.entries(saved.fields || {});
      if (!entries.length || entries.length > ACQUISITION_KEYS.length || entries.some(([key,value])=>safeAcquisitionValue(value,key)!==value)) return null;
      return {schemaVersion:1,consent:'analytics_accepted',capturedAt:saved.capturedAt,landingPath:saved.landingPath,fields:{...saved.fields}};
    } catch { return null; }
  };
  const paidEvidence = value => !!value && (['gclid','gbraid','wbraid','dclid','msclkid'].some(key=>!!value[key]) || ['cpc','ppc','paid','paid_search','paidsearch','paid-search','paid search','cpm','cpv','display','paid_social','paid_video'].includes(value.utm_medium?.toLowerCase()));
  if (Object.keys(fields).length) {
    try {
      const prior = readSource();
      const same = prior && Object.keys(prior.fields).length === Object.keys(fields).length && Object.entries(fields).every(([key,value])=>prior.fields[key]===value);
      const gbp = fields.utm_source?.toLowerCase()==='google' && fields.utm_medium?.toLowerCase()==='organic' && fields.utm_campaign?.toLowerCase()==='gbp';
      if (!same && !(gbp && paidEvidence(prior?.fields))) localStorage.setItem(sourceKey,JSON.stringify({schemaVersion:1,consent:'analytics_accepted',capturedAt,landingPath,fields}));
    } catch {} // Optional source storage must never obstruct calling.
  }
  window.pinnacleEnquirySource = readSource;
  const campaignFields = {utm_id:'campaign_id',utm_source:'campaign_source',utm_medium:'campaign_medium',utm_campaign:'campaign_name',utm_term:'campaign_term',utm_content:'campaign_content'};
  const campaignSource = readSource()?.fields || fields;
  const campaign = Object.fromEntries(Object.entries(campaignFields).filter(([key])=>campaignSource[key]).map(([key,name])=>[name,campaignSource[key]]));

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.pinnacleProtectionAllowed = () => {
    try {
      const url = new URL(location.href);
      const at = Number(sessionStorage.getItem('pinnacle-validation-v1'));
      return url.origin === 'https://www.pinnacleblooms.org' && url.pathname === landingPath && !url.searchParams.has('validation_test') && !(at>0 && at<=Date.now() && Date.now()-at<86400000);
    } catch { return false; }
  };
  window.dataLayer.push({pinnacle_canonical_measurement:true,pinnacle_protection_allowed:true});
  if (!window.__pinnacleProtectionContainer && !document.querySelector('script[src*="/pinnacle-pages-scripts/protection-consumer.mjs"]')) {
    const module = document.createElement('script');
    module.type='module';module.referrerPolicy='origin';module.id='pinnacle-protection-container';
    module.src='/pinnacle-pages-scripts/protection-consumer.mjs?v=protection-default-20261020';
    if(document.currentScript?.nonce)module.nonce=document.currentScript.nonce;
    window.__pinnacleProtectionContainer={status:'requested'};
    document.head.append(module);
  }
  if (!window.__pinnacleConsentDefaults) {
    window.__pinnacleConsentDefaults = true;
    window.gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'granted', ad_user_data:'granted', ad_personalization:'denied'});
  }
  window.gtag('consent', 'update', {analytics_storage:'granted', ad_storage:'granted', ad_user_data:'granted', ad_personalization:'denied'});
  window.gtag('set', 'ads_data_redaction', false);
  window.gtag('set', 'url_passthrough', false);
  window.gtag('js', new Date());
  window.gtag('config', id, {
    send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false,
    cookie_prefix:'ph', cookie_path:landingPath, cookie_domain:'www.pinnacleblooms.org',
    cookie_flags:'SameSite=Lax;Secure', cookie_expires:180 * 86400, cookie_update:false,
    page_location:canonical, page_title:'Pinnacle National Autism Helpline', page_referrer:'', ignore_referrer:true,
    campaign_id:'', campaign_source:'', campaign_medium:'', campaign_name:'', campaign_term:'', campaign_content:'', ...campaign
  });
  window.gtag('config', adsId, {
    send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false,
    restricted_data_processing:true, page_location:canonical,
    page_title:'Pinnacle National Autism Helpline', page_referrer:''
  });

  const originalDisplay = '9100 181 181';
  const numberPattern = /(?:\+?91[\s-]*)?9100[\s-]*181[\s-]*181/g;
  let replacement = null;
  const originals = new Map();
  const central = href => ['919100181181','9100181181','09100181181'].includes(String(href || '').replace(/^tel:/, '').replace(/[\s+().-]/g, ''));
  const applyReplacement = () => {
    if (!replacement) return;
    for (const link of document.querySelectorAll('a[href^="tel:"]')) {
      if (!originals.has(link)) {
        const href = link.getAttribute('href');
        if (!central(href)) continue;
        const text = [], walk = document.createTreeWalker(link, 4);
        while (walk.nextNode()) text.push([walk.currentNode, walk.currentNode.nodeValue]);
        originals.set(link, {href, aria:link.getAttribute('aria-label'), text});
      }
      const before = originals.get(link);
      link.setAttribute('href', 'tel:' + replacement.mobile);
      link.setAttribute('data-pinnacle-ad-call-target', 'central');
      if (before.aria) link.setAttribute('aria-label', before.aria.replace(numberPattern, replacement.formatted));
      for (const [node,text] of before.text) node.nodeValue = text.replace(numberPattern, replacement.formatted);
    }
  };
  const callCallback = (formatted,mobile) => {
    if (typeof formatted !== 'string' || !/^[+\d\s().-]{7,30}$/.test(formatted) || typeof mobile !== 'string' || !/^\+?[\d\s().-]{7,25}$/.test(mobile)) return;
    const dial = mobile.replace(/[\s().-]/g, '');
    if (!/^\+?\d{7,15}$/.test(dial)) return;
    replacement = {formatted,mobile:dial};
    applyReplacement();
  };
  window.gtag('config', callAction, {
    phone_conversion_number:originalDisplay,
    phone_conversion_callback:callCallback,
    send_page_view:false,
    allow_google_signals:false,
    allow_ad_personalization_signals:false,
    page_location:canonical,
    page_title:'Pinnacle National Autism Helpline',
    page_referrer:''
  });
  new MutationObserver(applyReplacement).observe(document.body, {childList:true,subtree:true});

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  const send = (name,parameters) => {
    try { window.gtag('event', name, {...parameters,...campaign,measurement_mode:'automatic',page_location:canonical,page_title:'Pinnacle National Autism Helpline',page_referrer:'',send_to:id}); }
    catch {} // Measurement must never interrupt calling.
  };
  send('page_view', {content_group:'national_helpline'});

  const placements = new Set(['nav','hero','concerns','first_call','telugu','service_reference','closing','mobile_sticky']);
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[data-call-placement]');
    if (!link || !(central(link.getAttribute('href')) || link.dataset.pinnacleAdCallTarget === 'central') || !placements.has(link.dataset.callPlacement)) return;
    send('phone_link_click', {schema_version:1,page_group:'national_helpline',link_placement:link.dataset.callPlacement,destination:'national_helpline_9100181181'});
  });
})();
