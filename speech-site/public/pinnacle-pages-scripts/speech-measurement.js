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
  if(/^\/(?:account|auth|admin|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(pagePath))return;
  const legacyKnowledge=!contactPage&&location.origin===origin&&document.body?.dataset.pageVariant==='legacy_knowledge'&&(/^(?:\/ma|\/t|\/b|\/c)\/[a-z0-9-]+\/?$/.test(pagePath)||pagePath==='/contact-national-autism-helpline-24-7');
  const privateAskPath = /^\/ask\/(?:te\/)?(?:account|auth|api|search)(?:\/|$)/.test(pagePath);
  const isAsk = location.origin === 'https://pinnacleblooms.org' && /^\/ask(?:\/|$)/.test(pagePath) && !privateAskPath && document.body?.dataset.pageVariant === 'ask';
  // Knowledge families use fixed buckets: never send questions, story IDs or searches.
  const knowledgePath = legacyKnowledge?'legacy-knowledge':location.origin === origin && document.body?.dataset.pageVariant === 'knowledge'
    ? (/^\/mirracles\/\d+(?:\/|$)/.test(pagePath)?'allmirracles':pagePath.match(/^\/(faq|sunshine|allmirracles|materials|interventions)(?:\/|$)/)?.[1]) : null;
  const knowledgeSearch = (!!knowledgePath||legacyPublicTemplate) && new URL(location.href).searchParams.has('q');
  const canonical = isAsk ? 'https://pinnacleblooms.org/ask' : origin + (knowledgePath ? '/'+knowledgePath : pages[pagePath]?.measurementPath || pagePath);
  const pageConfig = pages[pagePath] || (knowledgePath ? {title:'Pinnacle Knowledge Library',group:'knowledge',service:'help'} : null) || (isAsk ? {title:'Ask Pinnacle',group:'ask',service:'help'} : null) || (Object.hasOwn(documents,pagePath)?{title:documents[pagePath],group:'speech_therapy',service:'speech'}:null);
  const pageTitle = pageConfig?.title || document.title;
  const pageGroup = pageConfig?.group || 'managed_page';
  const isBookshop = pageGroup === 'bookshop';
  // Retain bounded attribution identifiers only. The page identity remains the
  // public/coarse canonical: no answer slug, search, child field or fragment.
  const campaignFields = {utm_id:'campaign_id',utm_source:'campaign_source',utm_medium:'campaign_medium',utm_campaign:'campaign_name',utm_term:'campaign_term',utm_content:'campaign_content'};
  const campaignKeys = [...Object.keys(campaignFields),'utm_source_platform','utm_creative_format','utm_marketing_tactic'];
  const clickKeys = ['gclid','dclid','msclkid','fbclid','gbraid','wbraid'];
  const helplinePath='/national-autism-helpline',helplineChoiceKey='pinnacle-helpline-measurement-choice-v4';
  const helplineCampaigns=new Set(['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries']);
  const validHelplineFields=fields=>!!fields&&typeof fields==='object'&&!Array.isArray(fields)&&Object.keys(fields).length===3&&fields.utm_source==='chatgpt'&&fields.utm_medium==='paid'&&helplineCampaigns.has(fields.utm_campaign);
  const campaigns = Object.fromEntries(Object.values(campaignFields).map(field=>[field,'']));
  const measurementURL = new URL(canonical);
  // Keep this explicit public-ID set in parity with the shared receiver validator.
  const knownGoogleAdsCampaignIds = new Set(["15340172547","15342772051","15345343142","15354492632","15410631276","15413188987","15416361515","15420705510","15422686714","15432947413","15454505906","16267659093","17430732638","17437197720","17714915698","18396274735","18590437867","20544678845","20544772051","20545400635","20548667278","20548688812","20588599080","20637879982","20726403779","20737568791","21097964139","21104736236","21106795656","21108028792","21108070054","21781203250","21814666781","21818529070","21822581429","21834560771","21834624209","21841955750","21842000123","21845614507","21845755342","21860786291","21873580048","21876816365","22297271692","22834256612","22838210062","23717098995","23722206176","23722246949","23722546298","23726650789","23726936563","23729053395","23729053632","23732018301","23732073522","23732073549","23732073552","23732073744","23732096874","23732098053","23732098203","23732111226","23732126781","23732188203","23732219493","23732280408","23732280432","23732280606","23732280645","23732335416","23732372055","23732372862","23732373063","23732466957","23732475522","23733005883","23733006126","23733029721","23733043878","23733044052","23734264760","23737227821","23737228001","23737239545","23737250090","23737250108","23737250849","23737280393","23737302131","23737312049","23737326926","23737327157","23737341104","23737341119","23737378787","23737386947","23737421507","23737421939","23737421987","23737421990","23737539791","23738212283","23738212460","23738212697","23738913244","23738913274","23741866921","23741867182","23741881591","23741940367","23741951650","23741951653","23741951887","23741967052","23741967058","23741979580","23741980078","23741980201","23742023941","23742023965","23742116110","23742170623","23742171022","23742171088","23742210124","23742210181","23742304498","23742304522","23742304534","23742817573","23742817582","23742818389","23742841894","23742854764","23742855046","23742855550","24295750691","24318442248","24318505173","24318506094","24323765198","24332444156","24334732992","24335035560","24335145489","24339607862","24340273595","24340279580","24346349935","24346359358","24346769519","24346889656","24352675399"]);
  const safeAttribution = (value, key) => {
    const click = clickKeys.includes(key);
    if (typeof value !== 'string') return null;
    value = value.trim();
    if (!value || value.length > (click ? 256 : 128) ||
        !(click ? /^[A-Za-z0-9._~-]+$/ : /^[A-Za-z0-9][A-Za-z0-9._~ -]*$/).test(value)) return null;
    if (key === 'utm_id' && knownGoogleAdsCampaignIds.has(value)) return value;
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
    if(parameters.getAll('utm_source').some(value=>value.toLowerCase()==='chatgpt')){
      if(!['utm_source','utm_medium','utm_campaign'].every(key=>parameters.getAll(key).length===1)||!validHelplineFields(Object.fromEntries([...parameters].filter(([key])=>[...campaignKeys,...clickKeys,'oppref'].includes(key)))))throw Error('Unapproved ChatGPT tuple');
    }
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
  // Send only a known referring platform's origin, never its paths, search
  // terms or private referring domains.
  let safeReferrer = '';
  // Keep only a recognised public platform's origin. Never send its query,
  // private path or the medical topic being read. This also preserves source
  // attribution for consented Ask, knowledge and therapy visits.
  try {
    const ref = new URL(document.referrer);
    const sources = new Set(['google.com','www.google.com','google.co.in','www.google.co.in','bing.com','www.bing.com','duckduckgo.com','www.duckduckgo.com','search.yahoo.com','chatgpt.com','www.perplexity.ai','perplexity.ai','gemini.google.com','claude.ai','www.facebook.com','m.facebook.com','l.facebook.com','www.instagram.com','l.instagram.com','www.linkedin.com','www.youtube.com','t.co']);
    if (ref.protocol === 'https:' && !ref.username && !ref.password && !ref.port && sources.has(ref.hostname)) safeReferrer = ref.origin + '/';
  } catch {}
  const routes = new Set([...Object.keys(pages), ...Object.keys(documents)]);
  const key = pageGroup === 'bookshop' ? 'pinnacle-book-analytics-v1' : 'pinnacle-speech-analytics-v1';
  const variant = document.body?.dataset.pageVariant === 'focused' ? 'focused' : 'service';
  const lifetime = 180 * 86400000;
  const panel = document.querySelector('[data-speech-measurement]');
  const status = document.querySelector('[data-measurement-status]');
  if (pageGroup === 'bookshop') {
    const copy = panel?.querySelector?.('p');
    if (copy) copy.textContent = 'With your permission, Google Analytics measures the book journey, including the referring search or social platform, book views, sample clicks, book-bag changes, checkout starts and contact-link clicks. It can connect that journey to our Shopify checkout. A checkout start is not a completed purchase. We exclude customer details, search terms and checkout links from our event data. Advertising personalisation is off.';
  }
  const disclosure = panel?.querySelector?.('p');
  if (disclosure) disclosure.textContent = (pageGroup === 'bookshop' ? disclosure.textContent : 'With your permission, Google Analytics measures page visits and call, WhatsApp or enquiry-link clicks. These are not completed calls or bookings. Advertising personalisation is off.') + ' Validated campaign labels and advertising click identifiers may accompany a coarse public page address to measure how you reached us. Form details, private answer paths and unrecognised URL fields stay excluded.';
  const production = isAsk || !!knowledgePath || (location.origin === origin && routes.has(location.pathname) && !!pageConfig);
  if (isAsk) routes.add('/ask');
  if (knowledgePath) routes.add('/'+knowledgePath);
  const blocked = navigator.globalPrivacyControl === true;
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
  // Functional preference handoff is independent of optional analytics storage.
  if(['speech','occupational','aba','autism','education'].includes(pageConfig?.service)){
    import('/pinnacle-pages-scripts/enrolment-routing.mjs?v=paid-locality-20261017-regional').then(({applyPaidEnquiryLinks,paidCentreAliases})=>applyPaidEnquiryLinks(document,location.href,{service:pageConfig?.service||'help',centres:new Set(Object.values(paidCentreAliases))})).catch(()=>{});
  }
  let enabled = false, loaded = false, tagStarted = false, preference = 'unset';
  const sourceKey='pinnacle-enquiry-source-v1',sourceLifetime=30*86400000;
  const acquisitionPath=location.pathname==='/speech-therapy/service-information'?'/top-speech-therapy-center-india-proven-improvement-rate':new URL(canonical).pathname;
  const acquisitionPaths=new Set(['/','/centers','/autism-therapy','/speech-aba-autism-assessments','/top-speech-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/best-special-education-center-call-9100181181','/enroll-autism-speech-aba-therapies-india','/pinnacleai','/abilityscore','/seven-readiness-indexes','/personal-development-kernel','/prognose','/therapeuticai','/everyday-therapy','/fusion-module','/reassess-review-repeat','/self-sufficient','/mainstream','/faq','/sunshine','/allmirracles']);
  acquisitionPaths.add(helplinePath);
  acquisitionPaths.add('/certified-courses');
  if(disclosure&&!isBookshop)disclosure.textContent+=' With permission, a validated campaign record can stay on this device for up to 30 days and accompany your enquiry into our protected receiving system. Turning analytics off removes this optional device record.';
  const handedOffLinks=new Map();
  const forgetSource=()=>{for(const [link,href]of handedOffLinks)link.href=href;handedOffLinks.clear();try{localStorage.removeItem(sourceKey);}catch{}};
  const savedPermission=choiceKey=>{
    try{const choice=JSON.parse(localStorage.getItem(choiceKey));return choice?.value==='accepted'&&Number.isFinite(choice.at)&&choice.at<=Date.now()&&Date.now()-choice.at<lifetime;}catch{return false;}
  };
  const readSource=(snapshot)=>{
    // Neither stream's choice grants permission to the other. Check at use time
    // so expiry and withdrawal in another tab cannot revive optional attribution.
    if(!enabled||navigator.globalPrivacyControl||!savedPermission(key))return null;
    try{
      const saved=snapshot===undefined?JSON.parse(localStorage.getItem(sourceKey)):snapshot;
      if(!saved||Object.keys(saved).some(key=>!['schemaVersion','consent','capturedAt','landingPath','fields'].includes(key))||saved.schemaVersion!==1||saved.consent!=='analytics_accepted'||!Number.isSafeInteger(saved.capturedAt)||saved.capturedAt>Date.now()||Date.now()-saved.capturedAt>sourceLifetime||!acquisitionPaths.has(saved.landingPath)){if(saved&&snapshot===undefined)localStorage.removeItem(sourceKey);return null;}
      if(saved.landingPath===helplinePath&&(!savedPermission(helplineChoiceKey)||!validHelplineFields(saved.fields))){if(snapshot===undefined)localStorage.removeItem(sourceKey);return null;}
      const fields={};for(const [field,value]of Object.entries(saved.fields||{})){if(![...campaignKeys,...clickKeys].includes(field)||safeAttribution(value,field)!==value)return null;fields[field]=value;}
      if(!Object.keys(fields).length)return null;
      return {schemaVersion:1,consent:'analytics_accepted',capturedAt:saved.capturedAt,landingPath:saved.landingPath,fields};
    }catch{return null;}
  };
  const rememberSource=()=>{
    if(!production||blocked||knowledgeSearch||isBookshop||validationTraffic||!acquisitionPaths.has(acquisitionPath))return;
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
  // Form submission must still work when measurement is declined or unavailable.
  window.pinnacleEnquirySource=()=>production&&enabled&&!blocked&&!knowledgeSearch&&!isBookshop&&!validationTraffic?readSource():null;
  const permittedCampaigns=()=>{
    const retained=window.pinnacleEnquirySource();
    if(!Object.keys(Object.fromEntries(measurementURL.searchParams)).length&&retained?.landingPath===helplinePath){
      return {...campaigns,campaign_source:retained.fields.utm_source,campaign_medium:retained.fields.utm_medium,campaign_name:retained.fields.utm_campaign};
    }
    return campaigns;
  };
  // The cart asks at navigation time, so withdrawal also stops a pending handoff.
  if (isBookshop) window.pinnacleBookAnalyticsAllowed = () => production && enabled && !navigator.globalPrivacyControl;
  const tell = text => { if(status) status.textContent = text; };
  const send = (name, parameters) => {
    if (!production || !enabled || blocked || navigator.globalPrivacyControl || knowledgeSearch || validationTraffic) return;
    try { window.gtag('event', name, {...permittedCampaigns(), page_group:pageGroup, measurement_mode:'consented', ...parameters, page_variant:variant, page_location:measurementLocation, page_title:pageTitle, page_referrer:safeReferrer, send_to:id}); } catch {}
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
    if (vitalsStarted || !production || !enabled || blocked || navigator.globalPrivacyControl || knowledgeSearch || validationTraffic || typeof PerformanceObserver !== 'function' || Math.random() >= 0.1) return;
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
      if (!enabled || blocked || navigator.globalPrivacyControl || validationTraffic) return;
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
  // or qualified leads. Never replay after refusal, QA, or an unavailable vendor.
  const protectionEvents = window.__pinnacleProtectionEvents || (window.__pinnacleProtectionEvents = new Set());
  const labelledProtectionQA = value => typeof value === 'string' && /(?:^|[ _.-])(?:qa|fixture|validation)(?:$|[ _.-])/i.test(value);
  const protectionAccountId='adaEbXowXfmZM';
  // HELD native snapshot completed 2026-10-19T02:16:49.154144Z: 155 campaigns, 322 groups, 2978 positive-keyword rows and 297 ads. Unknown later values fail closed.
  const protectionKeywords=new Set(["aba agencies near me","aba and speech therapy","aba and speech therapy near me","aba assessment near me","aba behavior therapist","aba behavioral therapist","aba center near me","aba centers near me","aba clinic","aba clinic near me","aba clinics near me","aba company near me","aba definition","aba home therapy near me","aba in home therapy near me","aba meaning","aba near me","aba preschool near me","aba program","aba providers near me","aba schools near me","aba services","aba services for autism","aba services for autism near me","aba services near me","aba skills","aba speech and occupational therapy","aba speech therapy","aba speech therapy near me","aba therapy","aba therapy aba therapy near me","aba therapy anantapur","aba therapy anathapuram","aba therapy appointment","aba therapy as rao nagar","aba therapy assessment","aba therapy at home","aba therapy at home near me","aba therapy attapur","aba therapy autism","aba therapy bangalore","aba therapy begumpet","aba therapy bhimavaram","aba therapy center","aba therapy center near me","aba therapy centers","aba therapy centers near me","aba therapy centre","aba therapy chanda nagar","aba therapy clinic","aba therapy cost","aba therapy dilsukhnagar","aba therapy eluru","aba therapy fees","aba therapy fees anantapur","aba therapy fees bhimavaram","aba therapy fees eluru","aba therapy fees guntur","aba therapy fees hyderabad","aba therapy fees kadapa","aba therapy fees kakinada","aba therapy fees karimnagar","aba therapy fees khammam","aba therapy fees kurnool","aba therapy fees mahbubnagar","aba therapy fees miryalaguda","aba therapy fees nandyala","aba therapy fees nellore","aba therapy fees nizamabad","aba therapy fees ongole","aba therapy fees rajahmundry","aba therapy fees srikakulam","aba therapy fees tirupati","aba therapy fees vijayawada","aba therapy fees vizag","aba therapy fees warangal","aba therapy for adhd","aba therapy for adults","aba therapy for autism","aba therapy for autism near me","aba therapy for children","aba therapy for developmental delay","aba therapy for kids with autism","aba therapy for teenager near me","aba therapy gajuwaka","aba therapy guntur","aba therapy gurunanak road","aba therapy habsiguda","aba therapy hayathnagar","aba therapy himayatnagar","aba therapy home services","aba therapy hyderabad","aba therapy hydernagar","aba therapy in home near me","aba therapy in hyderabad","aba therapy in online","aba therapy jagadamba","aba therapy kachiguda","aba therapy kadapa","aba therapy kakinada","aba therapy karimnagar","aba therapy khajaguda mehdipatnam","aba therapy khammam","aba therapy kondapur","aba therapy kukatpally","aba therapy kurnool","aba therapy labbipet","aba therapy lakshmipuram","aba therapy lb nagar","aba therapy madhapur","aba therapy madhurawada","aba therapy mahbubnagar","aba therapy meaning","aba therapy miryalaguda","aba therapy nad","aba therapy nallagandla","aba therapy nandyala","aba therapy near karkhana","aba therapy near me","aba therapy near me in home","aba therapy near vikrampuri","aba therapy nellore","aba therapy nizamabad","aba therapy nizampet","aba therapy ongole","aba therapy online","aba therapy paradise","aba therapy pragathi nagar","aba therapy rajahmundry","aba therapy santosh nagar","aba therapy sr nagar","aba therapy srikakulam","aba therapy studies","aba therapy success rate","aba therapy suchitra","aba therapy suchitra2","aba therapy tirupati","aba therapy uppal","aba therapy vidyanagar","aba therapy vijayawada","aba therapy vikrampuri","aba therapy vizag","aba therapy warangal","aba treatment","aba treatment for autism","about autism","about occupational therapy","above and beyond therapy","action behavior centers","action behavior centers near me","adhd autism","adhd parent training and therapy","adhd support for children","adhd therapy for children","advanced autism center for treatment","applied behavior analysis autism","applied behavior analysis for kids","applied behavior analysis therapy","applied behavior analysis therapy near me","asd assessment","asd behaviour","asd diagnostic assessment","asd disability","asd disorder","asd evaluation near me","asd in special education","asd therapy","asd therapy near me","ashoka child development centre","at home aba therapy near me","autism aba therapy near me","autism and speech","autism and speech therapy","autism asd","autism ashram hyderabad","autism assessment for kids","autism assessment near me","autism assessment test","autism assistance near me","autism behavior center","autism behavior management","autism behavior treatment center","autism can be cured","autism can be treated","autism care","autism care centre","autism care services","autism care therapy","autism center","autism center hyderabad","autism center in bangalore","autism center near me","autism centers near me","autism centre","autism centre in delhi","autism centre near me","autism child development centre vijayawada","autism clinic","autism clinic near me","autism communication skills","autism condition","autism counseling near me","autism cure","autism disease","autism disorder","autism doctor","autism doctors in hyderabad","autism education","autism evaluation","autism help for parents","autism help near me","autism in india","autism information","autism intervention program","autism learning center near me","autism medical treatment","autism medication","autism medicine","autism near me","autism occupational therapy near me","autism programs near me","autism providers near me","autism school near me","autism services","autism services near me","autism signs and symptoms","autism signs in children","autism signs in toddlers","autism skills","autism special schools","autism specialist doctor","autism specialist near me","autism spectrum disorder asd","autism spectrum disorder causes","autism spectrum disorder treatment","autism spectrum disorders","autism speech","autism speech and ot therapy","autism speech delay","autism speech delay treatment","autism support","autism test","autism therapist near me","autism therapy","autism therapy anantapur","autism therapy at home","autism therapy bhimavaram","autism therapy center","autism therapy center in anantapur","autism therapy center in bhimavaram","autism therapy center in eluru","autism therapy center in guntur","autism therapy center in hyderabad","autism therapy center in kadapa","autism therapy center in kakinada","autism therapy center in karimnagar","autism therapy center in khammam","autism therapy center in miryalaguda","autism therapy center in nellore","autism therapy center in ongole","autism therapy center in rajahmundry","autism therapy center in srikakulam","autism therapy center in tirupati","autism therapy center in vijayawada","autism therapy center in visakhapatnam","autism therapy center in vizag","autism therapy center in warangal","autism therapy center near me","autism therapy centre","autism therapy centre hyderabad","autism therapy centre in kurnool","autism therapy centre in vijayawada","autism therapy centre near me","autism therapy cost in india","autism therapy eluru","autism therapy for children","autism therapy for my kid","autism therapy for toddlers","autism therapy hyderabad","autism therapy in anantapur","autism therapy in bhimavaram","autism therapy in eluru","autism therapy in guntur","autism therapy in kadapa","autism therapy in kakinada","autism therapy in karimnagar","autism therapy in khammam","autism therapy in miryalaguda","autism therapy in nellore","autism therapy in ongole","autism therapy in rajahmundry","autism therapy in srikakulam","autism therapy in warangal","autism therapy kadapa","autism therapy kakinada","autism therapy karimnagar","autism therapy khammam","autism therapy miryalaguda","autism therapy near karkhana","autism therapy near me","autism therapy near vikrampuri","autism therapy nellore","autism therapy ongole","autism therapy programs","autism therapy providers","autism therapy rajahmundry","autism therapy services","autism therapy srikakulam","autism therapy tirupati","autism therapy vizag","autism therapy warangal","autism treatment","autism treatment center","autism treatment centre","autism treatment for children","autism treatment in india","autism treatment in telugu","autism websites for parents","baby therapy near me","behavior analysis and intervention center","behavior modification therapy for children","behavior therapy for adhd","behavior therapy for toddlers","behavioral therapy autism","behavioral therapy autism near me","behavioral therapy for autism spectrum disorders","behavioral therapy for children","behavioral therapy near karkhana","behavioral therapy near me","behavioral therapy near vikrampuri","behaviour therapist","behaviour therapy centre near me","behaviour therapy for adhd","behaviour therapy for children","behavioural therapy","best aba behavioral therapy centers near me","best aba services near me","best aba therapy center","best aba therapy center in hyderabad","best aba therapy center in india","best aba therapy for autism","best aba therapy near me","best autism assessment","best autism center anantapur","best autism center bhimavaram","best autism center eluru","best autism center in hyderabad","best autism center kadapa","best autism center kakinada","best autism center karimnagar","best autism center khammam","best autism center miryalaguda","best autism center nellore","best autism center ongole","best autism center rajahmundry","best autism center srikakulam","best autism center warangal","best autism doctor","best autism schools","best autism therapy center","best autism therapy center in bengaluru","best autism therapy center in bhimavaram","best autism therapy center in eluru","best autism therapy center in guntur","best autism therapy center in kakinada","best autism therapy center in karimnagar","best autism therapy center in kurnool","best autism therapy center in nellore","best autism therapy center in rajahmundry","best autism therapy center in warangal","best autism therapy center near me","best autism therapy centers near me","best autism therapy for kids","best autism therapy in hyderabad","best autism therapy in visakhapatnam","best autism therapy near me","best autism therpy center in vijayawada","best autism treatment centers in hyderabad","best autism treatment centers in the world","best autism treatment in delhi","best autism treatment in india","best child psychologist near me","best child therapist near me","best doctor for autism in india","best early intervention programs for autism","best occupational therapist","best occupational therapy center","best occupational therapy center in hyderabad","best occupational therapy center near me","best occupational therapy for kids","best psychologists near me","best public schools for autism","best schools for autism near me","best special education near me","best speech pathologist near me","best speech therapist","best speech therapist in hyderabad","best speech therapist near me","best speech therapy center","best speech therapy center in bengaluru","best speech therapy center in bhimavaram","best speech therapy center in chennai","best speech therapy center in eluru","best speech therapy center in guntur","best speech therapy center in hyderabad","best speech therapy center in kakinada","best speech therapy center in karimnagar","best speech therapy center in nellore","best speech therapy center in nizamabad","best speech therapy center in rajahmundry","best speech therapy center in secunderabad","best speech therapy center in suchitra","best speech therapy center in vijayawada","best speech therapy center in visakhapatnam","best speech therapy center in vizag","best speech therapy center in warangal","best speech therapy center near me","best speech therapy for kids","best speech therapy near me","best therapy for adhd kids","best therapy for autism","best therapy for autistic child","best treatment for autism","best treatment for autism in the world","book aba therapy assessment","book occupational therapy assessment","book speech therapy assessment","care for autism","cbt clinic","cbt for mental health","cbt near me","center based aba therapy near me","center for autism and related disorders","child aba therapy","child adhd therapy near me","child autism assessment","child behavior problems treatment","child behavior specialist","child behavior therapist near me","child behavioral modification therapy","child behavioral therapy","child behavioral therapy near me","child behaviour therapy","child behaviour therapy near me","child development assessment near me","child development center near me","child development problems","child development therapy","child development therapy near me","child gross motor therapy","child not talking at 2 years","child occupational therapist","child occupational therapist near me","child psychologist near me","child speech and language therapist near me","child speech delay treatment","child speech therapy hyderabad","child speech therapy near me","child speech therapy vijayawada","child therapy near me","children occupational therapy","children with asd","circle city aba","cognitive behavioral therapy","cognitive mental health","communication activities for autism","counseling and therapy near me","counseling around me","counseling center near me","counseling centre near me","counseling couples near me","counseling near me","counselling centre near me","counselling near me","counselling service near me","counselling therapist near me","couple counselling near me","cure for autism","developmental assessment for children","developmental delay therapy","developmental delay therapy near me","developmental delay treatment","developmental therapy for children","dyslexia special education","early autism services","early autism signs in children","early intervention aba for autism","early intervention for autism","early intervention speech therapy","early intervention therapy","early intervention therapy for autism","early intervention therapy near me","education and autism","exceptional education","family counseling near me","family counselling near me","family counsellors near me","find a counsellor near me","fine motor activities for occupational therapy","fine motor exercises occupational therapy","fine motor ot","fine motor skill therapy for toddlers","fine motor skills activities occupational therapy","fine motor skills ot","fine motor skills therapy","fine motor therapy","florida autism center","for speech therapy","gold-standard autism assessment and treatment","good psychologists near me","handwriting improvement therapy","home aba therapy near me","home based aba therapy","home based aba therapy near me","home program for autism","hyderabad","hydro therapists near me","hydro therapy centers near me","hydro therapy hydro therapy near me","hyperactive child treatment","in bloom autism","in home aba","in home aba near me","in home aba services near me","in home aba therapy near me","in home autism therapy","in home therapy for autism","in person marriage counseling near me","inclusive schools in bangalore","integrated therapy for special needs children","intervention speech therapy","key autism services","kids psychologist near me","language delay treatment","language speech therapist","language therapy for kids","late talker therapy","learners with special needs","learning disability treatment","life skills autism academy","mental counselling near me","mental health cbt therapy","mental health counselling near me","motor skill therapy","my child is not speaking","need a therapist near me","neurodevelopmental disorder therapy","new therapy for autism","occupancy therapy","occupational therapist","occupational therapist therapy","occupational therapy","occupational therapy anantapur","occupational therapy anathapuram","occupational therapy and autism","occupational therapy appointment","occupational therapy as rao nagar","occupational therapy assessment","occupational therapy assessment for children","occupational therapy assessment near me","occupational therapy attapur","occupational therapy begumpet","occupational therapy bhimavaram","occupational therapy center","occupational therapy center for kids with autism","occupational therapy centre","occupational therapy centre near me","occupational therapy chanda nagar","occupational therapy clinic","occupational therapy cost","occupational therapy delhi","occupational therapy dilsukhnagar","occupational therapy eluru","occupational therapy fees","occupational therapy fees anantapur","occupational therapy fees bhimavaram","occupational therapy fees eluru","occupational therapy fees guntur","occupational therapy fees hyderabad","occupational therapy fees kadapa","occupational therapy fees kakinada","occupational therapy fees karimnagar","occupational therapy fees khammam","occupational therapy fees kurnool","occupational therapy fees mahbubnagar","occupational therapy fees miryalaguda","occupational therapy fees nandyala","occupational therapy fees nellore","occupational therapy fees nizamabad","occupational therapy fees ongole","occupational therapy fees rajahmundry","occupational therapy fees srikakulam","occupational therapy fees tirupati","occupational therapy fees vijayawada","occupational therapy fees vizag","occupational therapy fees warangal","occupational therapy for adhd","occupational therapy for autism","occupational therapy for autism at home","occupational therapy for autism near me","occupational therapy for children","occupational therapy for developmental delay","occupational therapy for kids","occupational therapy for sensory processing disorder","occupational therapy gajuwaka","occupational therapy guntur","occupational therapy gurunanak road","occupational therapy habsiguda","occupational therapy hayathnagar","occupational therapy himayatnagar","occupational therapy hyderabad","occupational therapy hydernagar","occupational therapy in hyderabad","occupational therapy jagadamba","occupational therapy kachiguda","occupational therapy kadapa","occupational therapy kakinada","occupational therapy karimnagar","occupational therapy khajaguda mehdipatnam","occupational therapy khammam","occupational therapy kondapur","occupational therapy kukatpally","occupational therapy kurnool","occupational therapy labbipet","occupational therapy lakshmipuram","occupational therapy lb nagar","occupational therapy madhapur","occupational therapy madhurawada","occupational therapy mahbubnagar","occupational therapy miryalaguda","occupational therapy nad","occupational therapy nallagandla","occupational therapy nandyala","occupational therapy near karkhana","occupational therapy near me","occupational therapy near vikrampuri","occupational therapy nellore","occupational therapy nizamabad","occupational therapy nizampet","occupational therapy ongole","occupational therapy online","occupational therapy paradise","occupational therapy places near me","occupational therapy pragathi nagar","occupational therapy rajahmundry","occupational therapy santosh nagar","occupational therapy sr nagar","occupational therapy srikakulam","occupational therapy suchitra","occupational therapy suchitra2","occupational therapy tirupati","occupational therapy treatment for autism","occupational therapy uppal","occupational therapy vidyanagar","occupational therapy vijayawada","occupational therapy vikrampuri","occupational therapy vizag","occupational therapy warangal","online child psychologist","online learning special education","online speech pathologist","online speech therapy cost","ot clinics near me","ot exercises for autism","ot exercises for fine motor skills","ot fine motor activities","ot for adhd kids","ot for autism","ot therapy","ots occupational therapy","outpatient speech therapy near me","paediatric occupational therapy","paediatric occupational therapy for autism","paediatric occupational therapy near me","paediatric speech therapist near me","paediatric speech therapy","paediatric speech therapy near me","pediatric aba therapy near me","pediatric developmental therapy","pediatric occupational therapy","pediatric occupational therapy for autism","pediatric occupational therapy near me","pediatric ot","pediatric ot center near me","pediatric speech therapy","pediatric speech therapy near me","pediatric therapy","pediatric therapy near me","personal counseling near me","personal counselling near me","pinnacle","pinnacle aba therapy","pinnacle autism center","pinnacle autism therapy","pinnacle autism therapy center","pinnacle bloom network","pinnacle blooms","pinnacle blooms anantapur","pinnacle blooms anathapuram","pinnacle blooms as rao nagar","pinnacle blooms autism center","pinnacle blooms bangalore","pinnacle blooms bhimavaram","pinnacle blooms centre","pinnacle blooms chennai","pinnacle blooms delhi","pinnacle blooms dilsukhnagar","pinnacle blooms eluru","pinnacle blooms guntur","pinnacle blooms himayat nagar","pinnacle blooms hyderabad","pinnacle blooms in hyderabad","pinnacle blooms kadapa","pinnacle blooms kakinada","pinnacle blooms karimnagar","pinnacle blooms khajaguda","pinnacle blooms khammam","pinnacle blooms kurnool","pinnacle blooms mahbubnagar","pinnacle blooms miryalaguda","pinnacle blooms nandyal","pinnacle blooms nandyala","pinnacle blooms near me","pinnacle blooms nellore","pinnacle blooms network","pinnacle blooms network bangalore","pinnacle blooms network hyderabad","pinnacle blooms ongole","pinnacle blooms rajahmundry","pinnacle blooms santosh nagar","pinnacle blooms sr nagar","pinnacle blooms srikakulam","pinnacle blooms suchitra","pinnacle blooms tirupati","pinnacle blooms vijayawada","pinnacle blooms visakhapatnam","pinnacle blooms vizag","pinnacle blooms warangal","pinnacle hyderabad","pinnacle occupational therapy","pinnacle speech therapy center","pinnacle speech therapy hyderabad","pinnacle therapy center","pinnacle therapy centre near me","play therapy for autism","private speech and language therapy","private speech therapy near me","programs for autism","programs for autism near me","psychiatric counseling near me","psychiatric therapist near me","psychological counselling near me","psychologist center near me","psychologist near me for child","psychologist teenager near me","psychologists near me","rehab near me","rehabilitation center near me","rehabilitation near me","relationship counselling near me","relationship counselors for couples near me","relationship therapist near me","sensory integration therapy","sensory integration therapy for children","sensory integration therapy near me","sensory processing disorder","speaking of speech","special ed center","special ed near me","special ed schools near me","special education","special education centers","special education centre","special education centre near me","special education for children","special education learning","special education near karkhana","special education near me","special education near vikrampuri","special education programs near me","special education teacher","special education teacher near me","special education therapist","special educator","special educator near me","special needs child therapy","special needs education near me","special needs programs near me","special needs therapy near me","special schools for autism","special schools in bangalore","special schools in delhi","special schools in hyderabad","special teacher","speech and aba therapy","speech and behavior therapy","speech and hearing centre near me","speech and language","speech and language at home","speech and language development","speech and language pathology","speech and language therapy","speech and ot therapy near me","speech assessment anantapur","speech assessment bhimavaram","speech assessment eluru","speech assessment for children","speech assessment guntur","speech assessment hyderabad","speech assessment kadapa","speech assessment kakinada","speech assessment karimnagar","speech assessment khammam","speech assessment kurnool","speech assessment mahbubnagar","speech assessment miryalaguda","speech assessment nandyal","speech assessment near me","speech assessment nellore","speech assessment ongole","speech assessment rajahmundry","speech assessment srikakulam","speech assessment tirupati","speech assessment vijayawada","speech assessment visakhapatnam","speech assessment warangal","speech correction therapy","speech delay in toddlers","speech delay signs","speech delay therapy","speech delay therapy near me","speech delay treatment hyderabad","speech development","speech disorders autism","speech evaluation","speech evaluation near me","speech language pathologist near me","speech near me","speech pathologist for stuttering","speech pathologist near me","speech pathology","speech pathology in online","speech problems","speech services","speech services near me","speech therapist","speech therapist bangalore","speech therapist for child near me","speech therapist for home visit","speech therapist for kids near me","speech therapist hyderabad","speech therapist in hyderabad","speech therapist near me","speech therapist near me for adults","speech therapist vijayawada","speech therapist work","speech therapy","speech therapy anantapur","speech therapy anathapuram","speech therapy appointment","speech therapy as rao nagar","speech therapy assessment","speech therapy assessment hyderabad","speech therapy attapur","speech therapy bangalore","speech therapy begumpet","speech therapy bhimavaram","speech therapy center","speech therapy center hyderabad","speech therapy center near me","speech therapy centers","speech therapy centre in delhi","speech therapy centre near me","speech therapy chanda nagar","speech therapy clinics near me","speech therapy cost","speech therapy dilsukhnagar","speech therapy doctor near me","speech therapy eluru","speech therapy exercises","speech therapy fees","speech therapy fees anantapur","speech therapy fees bhimavaram","speech therapy fees eluru","speech therapy fees guntur","speech therapy fees hyderabad","speech therapy fees kadapa","speech therapy fees kakinada","speech therapy fees karimnagar","speech therapy fees khammam","speech therapy fees kurnool","speech therapy fees mahbubnagar","speech therapy fees miryalaguda","speech therapy fees nandyala","speech therapy fees nellore","speech therapy fees nizamabad","speech therapy fees ongole","speech therapy fees rajahmundry","speech therapy fees srikakulam","speech therapy fees tirupati","speech therapy fees vijayawada","speech therapy fees vizag","speech therapy fees warangal","speech therapy for adhd","speech therapy for autism","speech therapy for autism at home","speech therapy for autism near me","speech therapy for children","speech therapy for children near me","speech therapy for developmental delay","speech therapy for kids","speech therapy for kids in guntur","speech therapy for kids near me","speech therapy for nonverbal autism","speech therapy for stammering","speech therapy for toddlers","speech therapy gajuwaka","speech therapy guntur","speech therapy gurunanak road","speech therapy habsiguda","speech therapy hayathnagar","speech therapy himayatnagar","speech therapy hyderabad","speech therapy hydernagar","speech therapy jagadamba","speech therapy kachiguda","speech therapy kadapa","speech therapy kakinada","speech therapy karimnagar","speech therapy khajaguda mehdipatnam","speech therapy khammam","speech therapy kondapur","speech therapy kukatpally","speech therapy kurnool","speech therapy labbipet","speech therapy lakshmipuram","speech therapy lb nagar","speech therapy madhapur","speech therapy madhurawada","speech therapy mahbubnagar","speech therapy miryalaguda","speech therapy nad","speech therapy nallagandla","speech therapy nandyala","speech therapy near karkhana","speech therapy near me","speech therapy near vikrampuri","speech therapy nellore","speech therapy nizamabad","speech therapy nizampet","speech therapy ongole","speech therapy paradise","speech therapy pragathi nagar","speech therapy rajahmundry","speech therapy santosh nagar","speech therapy secunderabad","speech therapy services near me","speech therapy sr nagar","speech therapy srikakulam","speech therapy suchitra","speech therapy suchitra2","speech therapy telugu","speech therapy tirupati","speech therapy uppal","speech therapy vidyanagar","speech therapy vijayawada","speech therapy vikrampuri","speech therapy vizag","speech therapy warangal","speech therapy with autism","stammering therapy for children","students with special educational needs","the autism therapy group","therapist nearby counselling","therapist's near me","therapists in my area","therapueticai","therapy and beyond","therapy center near me","therapy family near me","therapy for autism","therapy for kids near me","therapy for me","therapy near me","therapy places near me","toddler speech milestones therapy","top 10 speech therapist in hyderabad","top aba therapy near me","top child psychologist near me","treatment centers near me","treatment for stammering","virtual aba therapy","voice therapy at home"]);
  const protectionAdGroupIds=new Set(["128678790365","129731953853","130230171099","130696127896","130696385416","130696987856","130862630072","133473267067","133903244135","133998676287","136834470624","138274573835","138294998306","138927006468","139136886364","145156222249","152980089789","153006383966","157932553430","158746076041","161552399002","162839903431","163067063667","164553797730","167076028726","167578384697","167770107485","169055569883","169751130180","170172267300","170645184202","172841931791","173107387630","174434702374","174593102328","174876622248","186863724230","190412899810","192145696221","192445919942","192445920382","192985534777","192985534977","193560932845","193910507014","193912666014","193922399414","193922399694","193922733966","194452318079","194726879266","194872554643","194883964509","194885050269","194885689123","194885690563","194886106749","194886107429","194886872869","194886874229","194891231749","194937582213","195104035093","195105231733","195105276453","195133424556","195135516676","195250043957","195258328717","195272334939","195290735956","195292333836","195303748476","195439445499","195509599575","195509601255","195552706015","195553085735","195778972032","195906308875","195964487460","196108065838","196108066038","196108066478","196224759818","196224761218","196226523738","196231700378","196529539433","196691368793","196691372593","196836840364","196839564684","196847606044","196847607764","197716516040","197800792929","197997833421","198059365902","198081084151","198081826071","198086970431","198258030187","198262310834","198627859577","198769425241","198769857817","198770884537","198775542177","198927002047","198928793407","199032653990","199032654630","199032654870","199035445430","199036063910","199327687583","200096983679","200287719589","200365510452","200366515372","200493690203","200850383448","200850384688","200850385648","200851943728","200856627531","200856627971","200890954997","200890959037","200905890611","200905891091","200912981411","201034990056","201150822215","201290891495","201499668638","201676714715","201693550978","201737869918","201737870078","201737870118","201737870158","201737870318","201737870358","201737870398","201737870558","201737870598","201737870638","201737870798","201737870838","201854297658","201993775578","201993821698","201999928944","202395260842","203558747169","203666424388","203667157428","203667158148","203678785348","203678785868","203678787268","203726004671","203726004711","203726004871","203726004911","203726004951","203726005111","203726005151","203726005191","203726005351","203726005391","203726005431","203726005591","203726005631","203726005671","203726005831","203726005871","203726005911","203726006071","203726006111","203726006151","203726006311","203726006351","203726006391","203726006551","203726006591","203726006631","203726006791","203726006831","203726006871","203726007031","203726007071","203726007111","203726007271","203726007311","203726007351","203726007511","203726007551","203726007591","203726007751","203726007791","203726007831","203726007991","203726008031","203726008071","203726008231","203726008271","203726008311","203726008471","203726008511","203726008551","203726008711","203726008751","203726008791","203726008951","203726008991","203726009031","203726009191","203726009231","203726009271","203726009431","203726009471","203726009511","203726009671","203726009711","203726009751","203726009911","203726009951","203726009991","203726010151","203726010191","203726010231","203726010391","203726010431","203726010471","203726010631","203726010671","203726010711","203726010871","203726010911","203726010951","203726011111","203726011151","203726011191","203726011351","203726011391","203726011431","203726011591","203726011631","203726011671","203726011831","203726011871","203726011911","203726012071","203726012111","203726012151","203726012311","203726012351","203726012391","203726012551","203726012591","203726012631","203726012791","203726012831","203726012871","203726013031","203726013071","203726013111","203726013271","203726013311","203726013351","203726013511","203726013551","203726013591","203726013751","203726013791","203726013831","203726013991","203726014031","203726014071","203726014231","203726014271","203726014311","203726014471","203726014511","203726014551","203726014711","203726014751","203726014791","203726014951","203726014991","203726015031","203726015191","203726015231","203726015271","203726015431","203726015471","203925241434","203925354474","204196925641","204570544287","206481806528","206481806568","206481806608","206481806768","206481806808","206481806848","206481807008","206481807048","206481807088","206481807248","206481807288","206481807328","206481807488","206481807528","206481807568","206627218968","206683741808","206689300051","209044495388"]);
  const protectionAdIds=new Set(["565556438562","566185600781","582982024020","627906623022","629852776271","675324082554","693854147993","694060977249","717318491652","735277245291","735392961353","803705401581","803732282388","803771382601","803780185405","803825967008","803852301497","804376134686","804376134689","804376134692","804376134695","804376134698","804397659801","804397659804","804397659807","804397659810","804397659813","804399390852","804399390855","804399390858","804399390861","804399390864","804403636443","804403636446","804403636449","804403636452","804403636455","804406589691","804406589694","804406589697","804406589700","804406589703","804432442501","804432442504","804432442507","804432442510","804432442513","804434409304","804434409307","804434409310","804434409313","804434409316","804450388768","804450388771","804450388774","804450388777","804450388780","804457180047","804457180050","804457180053","804457180056","804457180059","804457779117","804457779240","804457779243","804457779246","804457779249","804458341344","804458341347","804458341350","804458341353","804458341356","804459503275","804459503278","804459503401","804459503404","804459503407","804508625036","804508625039","804508625162","804508625165","804508625168","804512031983","804512031986","804512031989","804512031992","804512031995","804514220813","804514220816","804514220819","804514220822","804514220825","804518577821","804518577824","804518577827","804518577830","804518577833","804524376890","804524376893","804524376896","804524376899","804524376902","826182675756","826216004142","826221724319","826221870848","826281718983","826281834177","826281842853","826318327408","826319550868","826325900541","826326816910","826337311664","826338354860","826404848300","826411996247","826540403416","827054863176","827054882136","827054898129","827054907999","827069631304","827069640166","827097874210","827097910006","827097928987","827153006351","827153006354","827153006357","827153006360","827153006363","827153006366","827153006369","827153006372","827153006375","827153006378","827153006381","827153006384","827153006387","827153006390","827153006393","827153006396","827153006399","827153006522","827153006525","827153006528","827153006531","827153006534","827153006537","827153006540","827153006543","827153006546","827153006549","827153006552","827153006555","827153006558","827153006561","827153006564","827153006567","827153006570","827153006573","827153006576","827153006579","827153006582","827153006585","827153006588","827153006591","827153006594","827153006597","827153006600","827153006603","827153006606","827153006609","827153006612","827153006615","827153006618","827153006621","827153006624","827153006627","827153006630","827153006633","827153006636","827153006639","827153006762","827153006765","827153006768","827153006771","827153006774","827153006777","827153006780","827153006783","827153006786","827153006789","827153006792","827153006795","827153006798","827153006801","827153006804","827153006807","827153006810","827153006813","827153006816","827153006819","827153006822","827153006825","827153006828","827153006831","827153006834","827153006837","827153006840","827153006843","827153006846","827153006849","827153006852","827153006855","827153006858","827153006861","827153006864","827153006867","827153006870","827153006873","827153006876","827153006879","827153007002","827153007005","827153007008","827153007011","827153007014","827153007017","827153007020","827153007023","827153007026","827153007029","827153007032","827153007035","827153007038","827153007041","827153007044","827153007047","827153007050","827153007053","827153007056","827153007059","827153007062","827153007065","827153007068","827153007071","827153007074","827153007077","827153007080","827153007083","827153007086","827153007089","827153007092","827153007095","827153007098","827153007101","827153007104","827153007107","827153007110","827153007113","827153007116","827153007119","827153007242","827153007245","827153007248","827153007251","827153007254","827153007257","827153007260","827153007263","827153007266","827153007269","827153007272","827153007275","827153007278","827153007281","827153007284","827153007287","827153007290","827153007293","827153007296","827153007299","827153007302","827153007305","827153007308","827153007311","827153007314","827153007317","827178677959","827178688990","827179773794","827179846499","827179860230","827179871183","827260365044"]);
  const protectionSuffixSafe=(key,value)=>{
    if(typeof value!=='string'||value.length>128||/%[0-9a-f]{2}|[<>{}@\\]/i.test(value))return false;
    if(key==='tm')return value==='tt';
    if(key==='ap')return value==='gads';
    if(key==='aaid')return value===protectionAccountId;
    if(key==='cid'||key==='gad_campaignid')return knownGoogleAdsCampaignIds.has(value);
    // Google expands these ValueTrack fields to public numeric entity IDs.
    if(key==='agid')return protectionAdGroupIds.has(value);
    if(key==='aid')return value==='0'||protectionAdIds.has(value);
    if(key==='kid')return /^(?:kwd|dsa|aud|pla)-\d{1,20}$/.test(value);
    if(key==='kw')return protectionKeywords.has(value.toLowerCase());
    if(key==='nw')return value==='g';
    if(key==='dv')return ['m','c','t'].includes(value);
    if(key==='mt')return ['b','e','p'].includes(value);
    if(key==='pl')return value==='';
    if(key==='gad_source')return value==='1';
    return false;
  };
  // The vendor can inspect the real document, not GA4's coarse page_location.
  // Only reviewed public journeys with bounded URL/referrer fields may load it.
  const protectionGroups=new Set(['home','speech_therapy','occupational_therapy','aba_therapy','special_education','autism_therapy','developmental_assessment','enrolment','centre_directory','centre_detail','public_courses']);
  const protectionURLSafe=(value,referrer=false)=>{
    try{
      if(referrer&&!value)return true;
      const u=new URL(value);
      if(u.protocol!=='https:'||u.username||u.password||u.port)return false;
      if(u.origin!==origin)return referrer&&['www.google.com','www.google.co.in','www.bing.com','chatgpt.com'].includes(u.hostname)&&u.pathname==='/'&&!u.search&&!u.hash;
      const config=pages[u.pathname],reviewed=['/assessments/stuttering-assessment','/certified-courses','/certified-courses/'].includes(u.pathname);
      if(!(config&&protectionGroups.has(config.group))&&!Object.hasOwn(documents,u.pathname)&&!reviewed)return false;
      if(u.hash&&!['#enrolment-form','#speech-assessment-enquiry','#navratri-one-service-month-offer'].includes(u.hash))return false;
      const seen=new Set();
      for(const[k,v]of u.searchParams){
        if(seen.has(k))return false;seen.add(k);
        if([...campaignKeys,...clickKeys].includes(k)){if(safeAttribution(v,k)!==v||labelledProtectionQA(v))return false;continue;}
        if(['tm','ap','aaid','cid','agid','aid','kid','kw','nw','dv','mt','pl','gad_source','gad_campaignid'].includes(k)){if(!protectionSuffixSafe(k,v))return false;continue;}
        if(k==='service'&&['speech','occupational','aba','education','autism','help','assessment'].includes(v))continue;
        if(k==='entry'&&v==='speech-assessment')continue;
        if(k==='offer'&&v==='navratri-one-service-month-2026')continue;
        // Unknown routing fields, fragments and free text do not go to a vendor.
        // They never prevent the family's call, navigation or enquiry.
        return false;
      }
      return true;
    }catch{return false;}
  };
  // The deferred SDK consumer must recheck permission when it actually calls
  // the vendor. This API exposes only a boolean, never attribution or identity.
  window.pinnacleProtectionAllowed = () => {
    try {
      const currentURL = new URL(location.href);
      return !!(production && enabled && preference === 'accepted' && savedPermission(key) &&
        !blocked && !navigator.globalPrivacyControl && !knowledgeSearch && !validationTraffic &&
        !currentURL.searchParams.has('validation_test') &&
        !/^\/(?:account|auth|admin|internal|private|customer|customers|patient|patients|payroll|reports|report|documents|document)(?:\/|$)/i.test(location.pathname) &&
        !/^\/ask\/(?:te\/)?(?:account|auth|api|search)(?:\/|$)/.test(location.pathname) &&
        !labelledProtectionQA(currentURL.searchParams.get('utm_campaign')) &&
        !labelledProtectionQA(readSource()?.fields?.utm_campaign)&&
        protectionURLSafe(location.href)&&protectionURLSafe(document.referrer||'',true));
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
    script.id='pinnacle-protection-container';script.src='/pinnacle-pages-scripts/protection-consumer.mjs?v=protection-20261018';
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
        !window.pinnacleProtectionAllowed() || protectionEvents.has(name) ||
        labelledProtectionQA(acceptedSource?.fields?.utm_campaign)) return false;
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
    if (!production || blocked || navigator.globalPrivacyControl || knowledgeSearch || validationTraffic || preference==='declined' || googleAdsEvents.has(name)) return;
    const attribution = googleAdsSource(allowJourney);
    if (!attribution) return;
    try {
      const payload={schema_version:1,page_group:pageGroup,measurement_mode:enabled?'consented':'denied_storage',...(enabled?attribution:{traffic_source:'google_ads'}),...parameters};
      if (enabled) send(name,payload);
      else {
        configureTag('denied',canonical);
        window.gtag('event',name,{...payload,page_variant:variant,page_location:canonical,page_title:pageTitle,page_referrer:'',send_to:id,transport_type:'beacon'});
      }
      googleAdsEvents.add(name);
    } catch {} // Measurement failure must not stop native calling or WhatsApp.
  };
  // A navigation handoff carries only already validated campaign fields, with
  // permission. It carries no reader identity, question, history or child data.
  document.addEventListener('click',event=>{
    const link=event.target?.closest?.('a[href]');if(!link||!(isAsk||knowledgePath))return;
    if(handedOffLinks.has(link)){link.href=handedOffLinks.get(link);handedOffLinks.delete(link);}
    const library=isAsk?'ask':knowledgePath==='allmirracles'?'mirracles':knowledgePath;
    const action=link.dataset?.cta;
    if(action==='knowledge-enrol')send('enquiry_link_click',{schema_version:2,page_group:pageGroup,library,link_placement:action,destination:'existing_enrolment_form'});
    if(action==='knowledge-service')send('knowledge_service_click',{schema_version:1,page_group:'knowledge',library,link_placement:action,destination:'therapy_services'});
    if(action==='knowledge-centres')send('knowledge_centres_click',{schema_version:1,page_group:'knowledge',library,link_placement:action,destination:'published_centre_directory'});
    if(!production||!enabled||blocked||knowledgeSearch||validationTraffic)return;
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
  const clearCookies = () => {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      const bookCookie = name.startsWith('pbn_books_ga');
      if (bookCookie ? !isBookshop : !name.startsWith('ps_ga')) continue;
      // Root-scoped book cookies use their own namespace. Retire visible old
      // book-path cookies without deleting therapy/Ask measurement cookies.
      const cookiePaths = bookCookie ? ['/'] : isBookshop ? [...routes].filter(route => pages[route]?.group === 'bookshop') : routes;
      for (const route of cookiePaths) for (const domain of ['', 'www.pinnacleblooms.org', 'pinnacleblooms.org']) {
        document.cookie = name + '=; Max-Age=0; path=' + route + ';' + (domain ? ' domain=' + domain + ';' : '') + ' SameSite=Lax; Secure';
      }
    }
  };
  // Actual receipt events do not wait for an optional browsing-analytics choice.
  // An undecided visitor uses denied storage; an explicit refusal or GPC sends
  // nothing. The protected receiver ledger remains the business authority.
  const configureTag = (storage, measuredLocation, fields = {}) => {
    // Visible legacy per-page cookies can otherwise shadow the shared root
    // identity on a returning browser. Expire only that page's old scope,
    // after permission; leave root, book, Ask and knowledge cookies intact.
    if(storage==='granted'&&!isBookshop&&!isAsk&&!knowledgePath&&pagePath!=='/'){
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
      window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    }
    // Advertising call measurement has its own explicit choice. Preserve its
    // granted/denied state instead of overriding it from Analytics settings.
    window.gtag('consent','update',{analytics_storage:storage,ad_personalization:'denied'});
    window.gtag('set','ads_data_redaction',true);
    window.gtag('set','url_passthrough',false);
    if (!tagStarted) window.gtag('js',new Date());
    window.gtag('config',id,{
      send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      // One consented public-site visit must keep its GA4 identity when a
      // family moves from a service/centre page to Enrolment. Per-page cookie
      // paths create a new client/session at that handoff. Keep the existing
      // separate book namespace and Ask/knowledge scopes.
      cookie_prefix:isBookshop?'pbn_books':'ps',cookie_path:isBookshop?'/':isAsk?'/ask':knowledgePath?'/'+knowledgePath:'/',cookie_domain:isAsk?'pinnacleblooms.org':'www.pinnacleblooms.org',cookie_flags:'SameSite=Lax;Secure',cookie_expires:lifetime/1000,cookie_update:false,
      page_location:measuredLocation,page_title:pageTitle,page_referrer:storage==='granted'?safeReferrer:'',ignore_referrer:storage!=='granted'||!safeReferrer,
      ...Object.fromEntries(Object.values(campaignFields).map(field=>[field,''])),...fields
    });
    if (!tagStarted && !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script=document.createElement('script');
      script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;
      document.head.append(script);
    }
    tagStarted = true;
  };
  const start = () => {
    if (!production || blocked || knowledgeSearch) return;
    enabled = true;
    rememberSource();
    if(validationTraffic)return;
    try { ensureProtectionContainer(); } catch {} // Optional protection never disables analytics/contact.
    if (loaded) { window.gtag('consent','update',{analytics_storage:'granted'}); return; }
    configureTag('granted',measurementLocation,permittedCampaigns());
    loaded = true;
    send('page_view',{page_group:pageGroup,schema_version:2});
    startWebVitals();
    sendGoogleAds('google_ads_arrival',{interaction_kind:'navigation'},false);
    const viewed = Object.entries(commerceCatalogue).find(([, item]) => item.path === pagePath);
    if (viewed) sendCommerce('view_item', [{sku:viewed[0],quantity:1,price:viewed[1].price}]);
  };
  const choose = (value, persist = true) => {
    if (!['accepted','declined'].includes(value)) return;
    if (!production) { tell('Preview: analytics is disabled. No analytics data is sent.'); return; }
    preference = value;
    if (persist) { try { localStorage.setItem(key,JSON.stringify({value,at:Date.now()})); } catch {} }
    if (value==='accepted' && !blocked && !knowledgeSearch) {
      try { start(); tell('Optional analytics is on. Turn it off here at any time.'); }
      catch { enabled=false; tell('Analytics is unavailable. Your enquiry and call links still work.'); }
    } else {
      enabled=false;window['ga-disable-'+id]=true;
      try { window.dataLayer?.push({pinnacle_protection_allowed:false}); } catch {}
      // Cancel an already queued SDK consumer on refusal/GPC. No payload,
      // conversion or GA4 behaviour is added; its pending work must not replay.
      try { document.dispatchEvent(new Event('pinnacle_protection_cancel')); } catch {}
      if(!isBookshop)forgetSource();
      if (tagStarted) { try { window.gtag('consent','update',{analytics_storage:'denied'}); } catch {} }
      clearCookies();
      tell(knowledgeSearch ? 'Your choice is saved. Analytics is disabled on search result pages.' : blocked ? 'Analytics is off because Global Privacy Control is enabled.' : 'Optional analytics is off. Your enquiry and call links still work.');
    }
  };
  if(panel)panel.hidden=false;
  document.querySelectorAll('[data-measurement-choice]').forEach(button=>{
    button.addEventListener('click',()=>choose(button.dataset.measurementChoice));
    if (blocked && button.dataset.measurementChoice==='accepted') button.disabled=true;
  });
  if (!production) tell('Preview: analytics is disabled. No analytics data is sent.');
  else if (blocked) choose('declined');
  else {
    let saved;try { saved=JSON.parse(localStorage.getItem(key)); } catch {}
    if (saved && Number.isFinite(saved.at) && saved.at<=Date.now() && Date.now()-saved.at<lifetime) choose(saved.value, false);
  }
  window.addEventListener?.('storage',event=>{
    if(event.key===key||event.key===null){if(!savedPermission(key))choose('declined',false);}
    if(event.key===helplineChoiceKey&&!savedPermission(helplineChoiceKey)){
      try{if(JSON.parse(localStorage.getItem(sourceKey))?.landingPath===helplinePath)forgetSource();}catch{}
    }
  });
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
    if(detail.stage==='start'&&production&&enabled&&!blocked&&!navigator.globalPrivacyControl&&!knowledgeSearch&&!validationTraffic)formStarted=true;
  });
  const contactRequests=new Set();
  document.addEventListener('pinnacle:contact-accepted',event=>{
    const receipt=event?.detail?.receipt;
    if(!contactPage||event.detail.contract!=='website_contact_v1'||!receipt||receipt.schemaVersion!==1||typeof receipt.requestId!=='string'||typeof receipt.id!=='string'||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.requestId)||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.id)||Object.keys(receipt).some(k=>!['schemaVersion','requestId','id'].includes(k))||contactRequests.has(receipt.requestId)||!enabled||preference==='declined'||!savedPermission(key))return;
    send('contact_received',{schema_version:1,link_placement:'contact-form',destination:'existing_contact_workflow'});
    contactRequests.add(receipt.requestId);
  });
  document.addEventListener('pinnacle:enquiry-accepted', event => {
    const receipt=event?.detail?.receipt;
    if(!receipt||receipt.schemaVersion!==1||typeof receipt.requestId!=='string'||typeof receipt.id!=='string'||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.requestId)||!/^[A-Za-z0-9-]{8,100}$/.test(receipt.id)||Object.keys(receipt).some(k=>!['schemaVersion','requestId','id'].includes(k)))return;
    const callbackPage=(['centre_detail','centre_directory','occupational_therapy','aba_therapy','autism_therapy'].includes(pageGroup)||location.pathname==='/speech-therapy/service-information')&&document.querySelector('#pinnacle-enrolment[data-callback-contract="durable-enrolment-v1"][data-api-endpoint="/api/enrolment"]');
    const parentContact=contactPage&&event.detail?.contract==='website_contact_v1'&&['Therapy Services','Assessments'].includes(event.detail.topic);
    if ((pageGroup !== 'enrolment'&&!callbackPage&&!parentContact) || acceptedRequests.has(receipt.requestId) || !production || blocked || navigator.globalPrivacyControl || knowledgeSearch || validationTraffic || preference==='declined' || (enabled&&!savedPermission(key))) return;
    try {
      if (!enabled) configureTag('denied',canonical);
      const parameters={schema_version:4,page_group:parentContact?'contact':'enrolment',link_placement:parentContact?'contact-form':callbackPage?'inline-callback-form':'enrolment-form',destination:parentContact?'existing_contact_workflow':'existing_enrolment_workflow',measurement_mode:enabled?'consented':'denied_storage'};
      if (enabled) {
        // The receipt belongs to the submitted snapshot, not a later tab/URL.
        // Revalidate its expiry and both applicable permissions at emission.
        const acceptedSource=readSource(event.detail?.acquisition||null);
        const acceptedCampaigns=Object.fromEntries(Object.values(campaignFields).map(field=>[field,'']));
        for(const [field,name]of Object.entries(campaignFields))if(acceptedSource?.fields[field])acceptedCampaigns[name]=acceptedSource.fields[field];
        send('enquiry_accepted',{...parameters,...acceptedCampaigns});
        queueProtectionEvent('pinnacle_enquiry_accepted',acceptedSource);
      }
      else window.gtag('event','enquiry_accepted',{...parameters,page_variant:variant,page_location:canonical,page_title:pageTitle,page_referrer:'',send_to:id,transport_type:'beacon'});
      acceptedRequests.add(receipt.requestId);
    } catch {} // The receipt and parent confirmation survive a vendor failure.
  });
  if(disclosure){
    if(!isBookshop)disclosure.textContent+=' Accepted enquiries are always recorded in our protected receiving system. With no analytics choice, a minimal accepted-enquiry event may be sent to Google with analytics storage denied.';
    disclosure.textContent+=' Tagged Google Ads arrivals and central contact taps may also send minimal events with analytics storage denied and no campaign identifiers until you choose. Advertising call measurement follows its separate choice. Choosing to keep analytics off, or using Global Privacy Control, stops these Google events.';
  }
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
      send('phone_link_click',{schema_version:2,page_group:pageGroup,link_placement:callPlacements.has(placement)?placement:isBookshop?'bookshop-contact':'central-phone',destination:'national_helpline'});
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
        send('whatsapp_link_click',{schema_version:4,page_group:pageGroup,link_placement:placements.has(placement)?placement:isBookshop?'bookshop-contact':'central-whatsapp',destination:'national_helpline'});
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
      const destination=new URL(href,origin),keys=[...destination.searchParams.keys()];
      const knownKeys=keys.every(key=>['entry','service','centre'].includes(key));
      const validCentre=!destination.searchParams.has('centre')||centreIds.includes(destination.searchParams.get('centre'));
      const service=destination.searchParams.get('service'),entry=destination.searchParams.get('entry');
      const validService=!service||service===pageConfig?.service;
      const validEntry=!entry||(pageConfig?.service==='speech'&&entry==='speech-assessment');
      validEnquiry=destination.origin===origin&&destination.pathname==='/enroll-autism-speech-aba-therapies-india'&&knownKeys&&validCentre&&validService&&validEntry;
    } catch {}
    if (enquiryPlacements.has(placement) && validEnquiry && !(placement==='knowledge-enrol'&&(isAsk||knowledgePath))) send('enquiry_link_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'existing_enrolment_form'});
  });
  if(legacyKnowledge&&window.__pinnacleLegacyCapture){
    const capture=window.__pinnacleLegacyCapture;capture.stop?.();
    for(const kind of Array.isArray(capture.queue)?capture.queue.splice(0,10):[]){
      if(kind==='call')send('phone_link_click',{schema_version:2,page_group:pageGroup,link_placement:'knowledge-call',destination:'national_helpline'});
      if(kind==='whatsapp')send('whatsapp_link_click',{schema_version:4,page_group:pageGroup,link_placement:'knowledge-whatsapp',destination:'national_helpline'});
    }
  }
})();

// Reuse one first-party installer; its own page/consent guards keep it dormant.
if (location.origin === 'https://www.pinnacleblooms.org' && !document.querySelector('script[data-pinnacle-cheq-loader]')) {
  const protection = document.createElement('script');
  protection.src = '/pinnacle-pages-scripts/cheq-protection.js';
  protection.defer = true;
  protection.setAttribute('data-pinnacle-cheq-loader','');
  document.head.append(protection);
}
