'use strict';
(() => {
  const id = 'G-H9CLX1WJ7R'; // Existing approved evidence stream; enhanced measurement is off.
  const canonical = 'https://www.pinnacleblooms.org/national-autism-helpline';
  const storageKey = 'pinnacle-helpline-measurement-choice-v4';
  const sourceKey = 'pinnacle-enquiry-source-v1', sourceLifetime = 30 * 86400000;
  const landingPath = '/national-autism-helpline', capturedAt = Date.now();
  // Only the two fixed ad campaign labels may enter optional analytics.
  // Never forward the full URL, unrecognised UTMs, click IDs or visitor input.
  const allowedCampaigns = new Set(['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries']);
  const campaign = (() => {
    try {
      const params = new URL(location.href).searchParams;
      const source = params.getAll('utm_source'), medium = params.getAll('utm_medium'), name = params.getAll('utm_campaign');
      if (source.length !== 1 || medium.length !== 1 || name.length !== 1 ||
          source[0] !== 'chatgpt' || medium[0] !== 'paid' || !allowedCampaigns.has(name[0])) return {};
      return {campaign_source:'chatgpt',campaign_medium:'paid',campaign_name:name[0]};
    } catch { return {}; }
  })();
  // PR12's fixed analytics labels are unchanged. The new retained source is
  // stricter: other campaign fields or click IDs cannot enter its handoff.
  const sourceCampaignAllowed = ![...new URL(location.href).searchParams.keys()].some(key => (/^utm_/i.test(key) || /^(?:gclid|dclid|msclkid|fbclid|gbraid|wbraid|oppref)$/i.test(key)) && !['utm_source','utm_medium','utm_campaign'].includes(key));
  const lifetime = 180 * 86400000;
  const placements = new Set(['nav','hero','concerns','first_call','telugu','service_reference','closing','mobile_sticky']);
  const panel = document.querySelector('[data-analytics-panel]');
  const status = document.querySelector('[data-analytics-status]');
  if (!panel || !status) return;
  const production = location.origin === 'https://www.pinnacleblooms.org' && location.pathname === '/national-autism-helpline';
  const blocked = navigator.globalPrivacyControl === true;
  let validationTraffic = new URL(location.href).searchParams.has('validation_test');
  try {
    if (validationTraffic) sessionStorage.setItem('pinnacle-validation-v1', String(Date.now()));
    else { const at = Number(sessionStorage.getItem('pinnacle-validation-v1')); validationTraffic = at > 0 && at <= Date.now() && Date.now() - at < 86400000; }
  } catch {}
  let enabled = false, loaded = false;
  const currentPermission = () => {
    try { const choice = JSON.parse(localStorage.getItem(storageKey)); return choice?.value === 'accepted' && Number.isFinite(choice.at) && choice.at <= Date.now() && Date.now() - choice.at < lifetime; } catch { return false; }
  };
  const forgetHelplineSource = () => {
    try { if (JSON.parse(localStorage.getItem(sourceKey))?.landingPath === landingPath) localStorage.removeItem(sourceKey); } catch {}
  };
  const rememberSource = () => {
    if (!production || blocked || navigator.globalPrivacyControl || validationTraffic || !currentPermission() || !campaign.campaign_name || !sourceCampaignAllowed) return;
    const fields = {utm_source:'chatgpt',utm_medium:'paid',utm_campaign:campaign.campaign_name};
    try {
      const prior = JSON.parse(localStorage.getItem(sourceKey));
      if (prior?.schemaVersion === 1 && prior.consent === 'analytics_accepted' && prior.landingPath === landingPath && Number.isSafeInteger(prior.capturedAt) && prior.capturedAt <= Date.now() && Date.now() - prior.capturedAt <= sourceLifetime && Object.keys(prior.fields || {}).length === 3 && Object.entries(fields).every(([key,value]) => prior.fields[key] === value)) return;
      localStorage.setItem(sourceKey, JSON.stringify({schemaVersion:1,consent:'analytics_accepted',capturedAt,landingPath,fields}));
    } catch {} // Optional source storage must never obstruct calling or the callback link.
  };
  const tell = text => { status.textContent = text; };
  const clearCookies = () => {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!name.startsWith('ph_ga')) continue;
      for (const domain of ['', 'www.pinnacleblooms.org']) document.cookie = name + '=; Max-Age=0; path=/national-autism-helpline;' + (domain ? ' domain=' + domain + ';' : '') + ' SameSite=Lax; Secure';
    }
  };
  const send = (name, parameters) => {
    if (!enabled || blocked || navigator.globalPrivacyControl || validationTraffic || !currentPermission()) return;
    try {
      window.gtag('event', name, { ...parameters, ...campaign, page_location: canonical, page_title: 'Pinnacle National Autism Helpline', page_referrer: '', send_to: id });
    } catch { /* Collection must never interrupt a telephone link. */ }
  };
  const start = () => {
    if (!production || blocked || navigator.globalPrivacyControl || validationTraffic) return;
    enabled = true;
    rememberSource();
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (loaded) { window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
    loaded = true;
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('set', 'url_passthrough', false);
    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_prefix: 'ph', cookie_path: '/national-autism-helpline', cookie_domain: 'www.pinnacleblooms.org',
      cookie_flags: 'SameSite=Lax;Secure', cookie_expires: lifetime / 1000, cookie_update: false,
      page_location: canonical, page_title: 'Pinnacle National Autism Helpline', page_referrer: '', ignore_referrer: true,
      campaign_id: '', campaign_source: '', campaign_medium: '', campaign_name: '', campaign_term: '', campaign_content: '', ...campaign
    });
    // Ads base tag only: no conversion event and no personalized advertising.
    window.gtag('config', 'AW-10810823199', {
      allow_ad_personalization_signals: false, restricted_data_processing: true,
      page_location: canonical, page_title: 'Pinnacle National Autism Helpline', page_referrer: ''
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
    send('page_view', { content_group: 'national_helpline' });
  };
  const choose = value => {
    if (!['accepted','declined'].includes(value)) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ value, at: Date.now() })); } catch {}
    if (value === 'accepted' && !blocked) {
      try { start(); tell('Optional measurement allowed. You can turn it off here at any time.'); }
      catch { enabled = false; tell('Analytics is unavailable. You can still call as usual.'); }
    } else {
      enabled = false;
      window['ga-disable-' + id] = true;
      if (loaded) { try { window.gtag('consent','update',{ analytics_storage:'denied' }); } catch {} }
      clearCookies();
      forgetHelplineSource();
      tell(blocked ? 'Optional measurement is off because Global Privacy Control is enabled.' : 'Optional measurement is off. You can call as usual.');
    }
  };
  document.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => choose(button.dataset.analyticsChoice));
    if (blocked && button.dataset.analyticsChoice === 'accepted') button.disabled = true;
  });
  panel.hidden = false;
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  if (blocked) choose('declined');
  else if (saved && Number.isFinite(saved.at) && saved.at <= Date.now() && Date.now() - saved.at < lifetime) {
    if (saved.value === 'accepted') { try { start(); tell('Optional measurement allowed. You can turn it off here at any time.'); } catch { enabled = false; } }
    else if (saved.value === 'declined') tell('Optional measurement is off. You can call as usual.');
  }
  if (!currentPermission() || validationTraffic) forgetHelplineSource();
  window.addEventListener?.('storage', event => {
    if ((event.key === storageKey || event.key === null) && !currentPermission()) {
      enabled = false; window['ga-disable-' + id] = true; clearCookies(); forgetHelplineSource();
      if (loaded) { try { window.gtag('consent','update',{analytics_storage:'denied'}); } catch {} }
      tell('Optional measurement is off. You can call or request a callback as usual.');
    }
  });
  // One bubbling click listener also covers keyboard activation; never intercept dialing.
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[data-call-placement]');
    if (!link || link.getAttribute('href') !== 'tel:+919100181181' || !placements.has(link.dataset.callPlacement)) return;
    send('phone_link_click', { schema_version: 1, page_group: 'national_helpline', link_placement: link.dataset.callPlacement, destination: 'national_helpline_9100181181' });
  });
})();
