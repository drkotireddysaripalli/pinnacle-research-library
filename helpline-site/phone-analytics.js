'use strict';
(() => {
  const id = 'G-H9CLX1WJ7R';
  const adsId = 'AW-10810823199';
  const callAction = adsId + '/VNUcCMSy3YobEJ-kgKMo';
  const canonical = 'https://www.pinnacleblooms.org/national-autism-helpline';
  const sourceKey = 'pinnacle-enquiry-source-v1', sourceLifetime = 30 * 86400000;
  const landingPath = '/national-autism-helpline', capturedAt = Date.now();
  const production = location.origin === 'https://www.pinnacleblooms.org' && location.pathname === landingPath;
  let validationTraffic = new URL(location.href).searchParams.has('validation_test');
  try {
    if (validationTraffic) sessionStorage.setItem('pinnacle-validation-v1', String(Date.now()));
    else {
      const at = Number(sessionStorage.getItem('pinnacle-validation-v1'));
      validationTraffic = at > 0 && at <= Date.now() && Date.now() - at < 86400000;
    }
  } catch {}
  if (!production || validationTraffic) return;

  // Only the two reviewed ChatGPT campaign tuples can enter this helpline's
  // retained source record. Never forward the full URL, unknown fields, click
  // identifiers, fragments or visitor input.
  const allowedCampaigns = new Set(['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries']);
  const params = new URL(location.href).searchParams;
  const campaign = (() => {
    try {
      const source = params.getAll('utm_source'), medium = params.getAll('utm_medium'), name = params.getAll('utm_campaign');
      if (source.length !== 1 || medium.length !== 1 || name.length !== 1 || source[0] !== 'chatgpt' || medium[0] !== 'paid' || !allowedCampaigns.has(name[0])) return {};
      return {campaign_source:'chatgpt',campaign_medium:'paid',campaign_name:name[0]};
    } catch { return {}; }
  })();
  const sourceCampaignAllowed = ![...params.keys()].some(key => (/^utm_/i.test(key) || /^(?:gclid|dclid|msclkid|fbclid|gbraid|wbraid|oppref)$/i.test(key)) && !['utm_source','utm_medium','utm_campaign'].includes(key));
  if (campaign.campaign_name && sourceCampaignAllowed) {
    const fields = {utm_source:'chatgpt',utm_medium:'paid',utm_campaign:campaign.campaign_name};
    try {
      const prior = JSON.parse(localStorage.getItem(sourceKey));
      const current = prior?.schemaVersion === 1 && prior.consent === 'analytics_accepted' && prior.landingPath === landingPath && Number.isSafeInteger(prior.capturedAt) && prior.capturedAt <= Date.now() && Date.now() - prior.capturedAt <= sourceLifetime && Object.keys(prior.fields || {}).length === 3 && Object.entries(fields).every(([key,value]) => prior.fields[key] === value);
      if (!current) localStorage.setItem(sourceKey, JSON.stringify({schemaVersion:1,consent:'analytics_accepted',capturedAt,landingPath,fields}));
    } catch {} // Attribution storage must never obstruct calling or callback.
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
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
    try { window.gtag('event', name, {...parameters,...campaign,page_location:canonical,page_title:'Pinnacle National Autism Helpline',page_referrer:'',send_to:id}); }
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
