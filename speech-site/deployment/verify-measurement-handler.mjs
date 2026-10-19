import {verifyMeasurementPrivacyHtml} from './verify-measurement-repair.mjs';

export const VERIFY_MEASUREMENT_READER = '/pinnacle-pages-scripts/google-ads-call.js?module=verify-reader&v=4';

export function projectVerifyMeasurementHtml(pathname, source) {
  let html = pathname === '/verify/evidence/privacy.html' ? verifyMeasurementPrivacyHtml : source;
  html = html
    .replace(/<aside\b(?=[^>]*\bclass=["'][^"']*\banalytics-choice\b)[^>]*>[\s\S]*?<\/aside\s*>/gi, '')
    .replace(/<p\b(?=[^>]*\bclass=["'][^"']*\banalytics-choice-status\b)[^>]*>[\s\S]*?<\/p\s*>/gi, '')
    .replace(/<button\b(?=[^>]*\bdata-analytics-settings\b)[^>]*>[\s\S]*?<\/button\s*>/gi, '');

  let readerSeen = false;
  html = html.replace(/(<script\b[^>]*\bsrc=["'])(?:(?:https:\/\/www\.pinnacleblooms\.org)?\/verify\/(?:_assets\/reader-extras\.[a-f0-9]+\.js|reader-extras\.js)(?:\?[^"']*)?|\/pinnacle-pages-scripts\/google-ads-call\.js\?module=verify-reader(?:&amp;|&)v=4)(["'][^>]*>\s*<\/script\s*>)/gi, (_whole, open, close) => {
    if (readerSeen) return '';
    readerSeen = true;
    return `${open}${VERIFY_MEASUREMENT_READER}${close}`;
  });
  if (!readerSeen) {
    const script = `<script defer src="${VERIFY_MEASUREMENT_READER}"></script>`;
    html = /<\/head\s*>/i.test(html) ? html.replace(/<\/head\s*>/i, `${script}</head>`) : `${script}${html}`;
  }
  return html;
}

export async function repairVerifyMeasurement(request, response) {
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.hostname !== 'www.pinnacleblooms.org' ||
      !(url.pathname === '/verify/' || url.pathname.startsWith('/verify/')) ||
      response.status !== 200 || !response.headers.get('content-type')?.includes('text/html') ||
      request.headers.has('authorization') || request.headers.has('range') ||
      response.headers.has('set-cookie') || /\bno-transform\b/i.test(response.headers.get('cache-control') || '')) return response;

  const html = projectVerifyMeasurementHtml(url.pathname, await response.text());
  const headers = new Headers(response.headers);
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'content-md5', 'digest', 'content-digest', 'repr-digest', 'accept-ranges']) headers.delete(name);
  headers.set('x-pinnacle-verify-measurement', 'automatic-20261019');
  return new Response(html, {status: response.status, statusText: response.statusText, headers});
}
