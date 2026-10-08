'use strict';
(() => {
  const id = 'G-2BYLRLFRDJ';
  const origin = 'https://www.pinnacleblooms.org';
  const pages = {
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
  const privateAskPath = /^\/ask\/(?:te\/)?(?:account|auth|api|search)(?:\/|$)/.test(pagePath);
  const isAsk = location.origin === 'https://pinnacleblooms.org' && /^\/ask(?:\/|$)/.test(pagePath) && !privateAskPath && document.body?.dataset.pageVariant === 'ask';
  // Knowledge families use fixed buckets: never send questions, story IDs or searches.
  const knowledgePath = location.origin === origin && document.body?.dataset.pageVariant === 'knowledge'
    ? pagePath.match(/^\/(faq|sunshine|allmirracles)(?:\/|$)/)?.[1] : null;
  const knowledgeSearch = !!knowledgePath && new URL(location.href).searchParams.has('q');
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
  const campaigns = Object.fromEntries(Object.values(campaignFields).map(field=>[field,'']));
  const measurementURL = new URL(canonical);
  const safeAttribution = (value, click) => {
    if (typeof value !== 'string') return null;
    value = value.trim();
    if (!value || value.length > (click ? 256 : 128) ||
        !(click ? /^[A-Za-z0-9._~-]+$/ : /^[A-Za-z0-9][A-Za-z0-9._~ -]*$/).test(value)) return null;
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
      const value = safeAttribution(values[0],clickKeys.includes(key));
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
  if (!panel || !status) return;
  if (pageGroup === 'bookshop') {
    const copy = panel.querySelector?.('p');
    if (copy) copy.textContent = 'With your permission, Google Analytics measures the book journey, including the referring search or social platform, book views, sample clicks, book-bag changes, checkout starts and contact-link clicks. It can connect that journey to our Shopify checkout. A checkout start is not a completed purchase. We exclude customer details, search terms and checkout links from our event data. Advertising personalisation is off.';
  }
  const production = isAsk || !!knowledgePath || (location.origin === origin && routes.has(location.pathname) && !!pageConfig);
  if (isAsk) routes.add('/ask');
  if (knowledgePath) routes.add('/'+knowledgePath);
  const blocked = navigator.globalPrivacyControl === true;
  const callPlacements = new Set(['knowledge-call','ask-call','ask-answer-call','header-call','hero-call','centre-call','final-call','footer-call','mobile-call','directory-national-call','centre-national-call','centre-enquiry','ot-hero-call','ot-first-call','ot-final-call','aba-first-call','aba-final-call','autism-first-call','family-journey-call','example-call','pinnacleai-call','pinnacleai-close-call']);
  const enquiryPlacements = new Set(['knowledge-enrol','header-enrol','hero-assessment','early-assessment','visit-enquiry','final-enquiry','final-assessment','mobile-assessment','centre-enquiry','ot-final-enrol','aba-final-enrol','autism-first-enquiry']);
  const occupationalNavigation = new Set(['ot-hero-centres','ot-final-centres']);
  const abaNavigation = new Set(['aba-first-centres','aba-final-centres']);
  const directoryPlacements = new Set(['centre-profile','centre-maps','centre-whatsapp','centre-vcard','centre-share','centre-copy-link','centre-copy-citation']);
  // Dated, verified form choices. Tests require this list to match centre-directory.json.
  const centreIds = ["suchitra","gurunanak","jayanagar","annanagar","delhi","warangal","asraonagar","ananthapuram","attapur","bnreddynagar","begumpet","bhimavaram","chandanagar","dilsukhnagar","eastmarredpally","eluru","gachibowli","guntur","habsiguda","hayathnagar","himayatnagar","madhapur","hydernagar","indiranagar","jublieehills","kachiguda","kadapa","kakinada","karimnagar","khajaguda","khammam","kondapur","kukatpally","kurnool","lbnagar","labbipet","mvp","madhurawada","mahbubnagar","marathahalli","miryalaguda","nad","nallagandla","nandyala","nellore","nizamabad","nizampet","ongole","pragathinagar","rajahmundry","srnagar","santoshnagar","srikakulam","suchitraii","tirupati","uppal","vanasthalipuram","vidyanagar","vikrampuri"];
  let enabled = false, loaded = false;
  // The cart asks at navigation time, so withdrawal also stops a pending handoff.
  if (isBookshop) window.pinnacleBookAnalyticsAllowed = () => production && enabled && !navigator.globalPrivacyControl;
  const tell = text => { status.textContent = text; };
  const send = (name, parameters) => {
    if (!production || !enabled || blocked || knowledgeSearch) return;
    try { window.gtag('event', name, {...parameters, page_variant:variant, page_location:measurementLocation, page_title:pageTitle, page_referrer:safeReferrer, send_to:id}); } catch {}
  };
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
  const start = () => {
    if (!production || blocked || knowledgeSearch) return;
    enabled = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (loaded) { window.gtag('consent','update',{analytics_storage:'granted'}); return; }
    loaded = true;
    if (!window.__pinnacleConsentDefaults) {
      window.__pinnacleConsentDefaults = true;
      window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    }
    window.gtag('consent','update',{analytics_storage:'granted'});
    window.gtag('js',new Date());
    window.gtag('config',id,{
      send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      cookie_prefix:isBookshop?'pbn_books':'ps',cookie_path:isBookshop?'/':isAsk?'/ask':knowledgePath?'/'+knowledgePath:location.pathname,cookie_domain:isAsk?'pinnacleblooms.org':'www.pinnacleblooms.org',cookie_flags:'SameSite=Lax;Secure',cookie_expires:lifetime/1000,cookie_update:false,
      page_location:measurementLocation,page_title:pageTitle,page_referrer:safeReferrer,ignore_referrer:!safeReferrer,
      ...campaigns
    });
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script=document.createElement('script');
      script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;
      document.head.append(script);
    }
    send('page_view',{page_group:pageGroup,schema_version:2});
    const viewed = Object.entries(commerceCatalogue).find(([, item]) => item.path === pagePath);
    if (viewed) sendCommerce('view_item', [{sku:viewed[0],quantity:1,price:viewed[1].price}]);
  };
  const choose = (value, persist = true) => {
    if (!['accepted','declined'].includes(value)) return;
    if (!production) { tell('Preview: analytics is disabled. No analytics data is sent.'); return; }
    if (persist) { try { localStorage.setItem(key,JSON.stringify({value,at:Date.now()})); } catch {} }
    if (value==='accepted' && !blocked && !knowledgeSearch) {
      try { start(); tell('Optional analytics is on. Turn it off here at any time.'); }
      catch { enabled=false; tell('Analytics is unavailable. Your enquiry and call links still work.'); }
    } else {
      enabled=false;window['ga-disable-'+id]=true;
      if (loaded) { try { window.gtag('consent','update',{analytics_storage:'denied'}); } catch {} }
      clearCookies();
      tell(knowledgeSearch ? 'Your choice is saved. Analytics is disabled on search result pages.' : blocked ? 'Analytics is off because Global Privacy Control is enabled.' : 'Optional analytics is off. Your enquiry and call links still work.');
    }
  };
  panel.hidden=false;
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
  // Fixed event vocabulary only; arbitrary query values and form data are excluded.
  let acceptanceRecorded = false;
  document.addEventListener('pinnacle:enquiry-accepted', () => {
    if (pageGroup !== 'enrolment' || acceptanceRecorded || !production || !enabled || blocked) return;
    acceptanceRecorded = true;
    send('enquiry_accepted',{schema_version:2,page_group:'enrolment',destination:'existing_enrolment_workflow'});
  });
  document.addEventListener('click',event=>{
    if (pageGroup === 'family_resource') {
      const resourceLink=event.target?.closest?.('a[data-resource="first_conversation_v1"]');
      if(resourceLink?.getAttribute('href') === '/books/resources/Pinnacle-First-Conversation-v1.pdf') send('resource_download_click',{schema_version:3,page_group:'family_resource',resource_id:'first_conversation_v1',format:'pdf',language:'en'});
    }
    const contactLink = event.target?.closest?.('a[href]');
    const contactHref = contactLink?.getAttribute('href');
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
        send('whatsapp_click',{schema_version:3,page_group:pageGroup,link_placement:placements.has(placement)?placement:isBookshop?'bookshop-contact':'central-whatsapp',destination:'national_helpline_9100181181'});
        return; // One event per contact tap; sharing text never enters the event.
      }
    } catch {}
    if (pageGroup === 'bookshop') {
      const href = contactHref;
      if (href) {
        if (href === 'tel:+919100181181' || (href.startsWith('tel:') && contactLink.dataset?.pinnacleAdCallTarget === 'central')) {
          const placement = contactLink.dataset?.cta;
          send('phone_link_click', {schema_version:2,page_group:'bookshop',link_placement:callPlacements.has(placement)?placement:'bookshop-contact',destination:'national_helpline_9100181181'});
          return;
        }
        try {
          const target = new URL(href, origin);
          const destination = target.href;
          const sample = Object.values(commerceCatalogue).flatMap(item => Array.isArray(item.books) ? item.books : [])
            .find(book => typeof book.sample === 'string' && new URL(book.sample, origin).href === destination);
          if (sample) send('sample_preview', {schema_version:3,page_group:'bookshop',item_id:sample.sku,item_name:sample.title});
        } catch {}
      }
    }
    const link=event.target?.closest?.('[data-cta]');
    if (!link) return;
    const placement=link.dataset.cta,href=link.getAttribute('href');
    if (directoryPlacements.has(placement)) send('centre_directory_action',{schema_version:2,page_group:pageGroup,action:placement.replace('centre-','')});
    if (!href) return;
    if (callPlacements.has(placement) && (href==='tel:+919100181181' || (href.startsWith('tel:') && link.dataset.pinnacleAdCallTarget==='central'))) send('phone_link_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'national_helpline_9100181181'});
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
    if (enquiryPlacements.has(placement) && validEnquiry) send('enquiry_link_click',{schema_version:2,page_group:pageGroup,link_placement:placement,destination:'existing_enrolment_form'});
  });
})();

// Reuse one first-party installer; its own page/consent guards keep it dormant.
if (location.origin === 'https://www.pinnacleblooms.org' && !document.querySelector('script[data-pinnacle-cheq-loader]')) {
  const protection = document.createElement('script');
  protection.src = '/pinnacle-pages-scripts/cheq-protection.js';
  protection.defer = true;
  protection.setAttribute('data-pinnacle-cheq-loader','');
  document.head.append(protection);
}
