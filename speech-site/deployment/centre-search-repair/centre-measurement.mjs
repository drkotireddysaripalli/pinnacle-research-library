// Existing-tag bridge: never loads Analytics, changes consent or reads form data.
export const MEASUREMENT_RELEASE = 'centre-contact-measurement-20261005';
export const CENTRE_ROUTES = {
  '/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india': {id:'kukatpally',service:'speech'},
  '/centers/best-autism-speech-aba-occupational-therapy-center-lbnagar-hyderabad-telangana-india': {id:'lbnagar',service:'help'},
  '/centers/best-autism-speech-aba-occupational-therapy-center-labbipet-vijayawada-ap-india': {id:'labbipet',service:'help'},
  '/centers/best-autism-speech-aba-occupational-therapy-center-anna-nagar-chennai-tamilnadu-india': {id:'annanagar',service:'help'}
};

export function centreContactMeasurement(config) {
  'use strict';
  const origin = 'https://www.pinnacleblooms.org', id = 'G-2BYLRLFRDJ';
  if (location.origin !== origin || location.pathname !== config.path ||
      window.pinnacleCentreContactMeasurement || document.querySelector('[data-speech-measurement]')) return;
  window.pinnacleCentreContactMeasurement = true;
  const allowed = () => {
    if (navigator.globalPrivacyControl === true || window['ga-disable-' + id] === true || typeof window.gtag !== 'function') return false;
    try {
      const consent = JSON.parse(localStorage.getItem('pinnacle-speech-analytics-v1'));
      return consent?.value === 'accepted' && Number.isFinite(consent.at) &&
        consent.at <= Date.now() && Date.now() - consent.at < 180 * 86400000;
    } catch { return false; }
  };
  const send = (name, destination, placement) => {
    if (!allowed()) return;
    try {
      window.gtag('event', name, {
        schema_version:2,page_group:'centre_detail',page_variant:'service',
        link_placement:placement,destination,
        event_category:'centre_contact',event_label:placement,
        page_location:origin + '/centers',page_title:'Pinnacle Centre',page_referrer:'',
        send_to:id,transport_type:'beacon'
      });
    } catch { /* Contact navigation must work even when measurement cannot. */ }
  };
  document.addEventListener('click', event => {
    if (!allowed()) return;
    const link = event.target?.closest?.('a[href]');
    const href = link?.getAttribute('href');
    if (!href) return;
    if (['tel:+919100181181','tel:919100181181','tel:9100181181'].includes(href)) {
      send('phone_link_click','national_helpline_9100181181',config.id + '-call');
      return;
    }
    try {
      const target = new URL(href, origin);
      const keys = [...target.searchParams.keys()];
      if (target.origin !== origin || target.username || target.password ||
          target.pathname !== '/enroll-autism-speech-aba-therapies-india' ||
          keys.some(key => !['service','centre'].includes(key)) || new Set(keys).size !== keys.length) return;
      const centre = target.searchParams.get('centre'), service = target.searchParams.get('service');
      if ((centre !== null && centre !== config.id) || (service !== null && service !== config.service)) return;
      send('enquiry_link_click','existing_enrolment_form',config.id + '-enquiry');
    } catch { /* Ignore non-enrolment destinations. */ }
  });
  // This page never emits enquiry_accepted. Only the enrolment API success does.
}

export function measurementScript(path) {
  const config = CENTRE_ROUTES[path];
  if (!config) return '';
  return '<script id="pinnacle-centre-contact-measurement" data-cfasync="false">(' +
    centreContactMeasurement.toString() + ')(' + JSON.stringify({...config,path}) + ');</script>';
}

export async function addCentreMeasurement(request,response) {
  const path = new URL(request.url).pathname;
  if (!CENTRE_ROUTES[path] || response.status !== 200 || !response.headers.get('x-pinnacle-local-journey') ||
      !/^text\/html\b/i.test(response.headers.get('content-type') || '')) return response;
  const html = await response.clone().text();
  // Fail closed on a different template; the original Analytics tags stay byte-identical.
  if (!html.includes("gtag('config', 'G-2BYLRLFRDJ')") || html.includes('pinnacle-centre-contact-measurement') ||
      html.includes('data-speech-measurement') || (html.match(/<\/body>/gi) || []).length !== 1) return response;
  const next = html.replace(/<\/body>/i, measurementScript(path) + '</body>');
  const headers = new Headers(response.headers);
  for (const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges','age']) headers.delete(key);
  headers.set('x-pinnacle-centre-measurement', MEASUREMENT_RELEASE);
  return new Response(next,{status:response.status,statusText:response.statusText,headers});
}
