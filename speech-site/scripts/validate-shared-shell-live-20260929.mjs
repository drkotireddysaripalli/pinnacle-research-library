import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const origin='https://www.pinnacleblooms.org';
const paths=[
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/speech-therapy/service-information',
  '/speech-therapy/first-visit-guide',
  '/speech-therapy/teacher-observation-guide'
];
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const results=[];
const headers=[];
const footers=[];

for(const path of paths){
  const response=await fetch(`${origin}${path}?release=shared-shell-20260929`,{headers:{'cache-control':'no-cache'}});
  const html=await response.text();
  assert.equal(response.status,200,path);
  assert.match(response.headers.get('x-robots-tag')||'',/^index, follow/,path);
  assert.equal(response.headers.get('content-signal'),'search=yes, ai-input=yes',path);
  assert(html.includes('index, follow, max-image-preview:large'),path);
  assert(html.includes('data-cta="header-enrol"'),path);
  assert(html.includes('tel:+919100181181'),path);
  assert(!html.includes('portal-donate')&&!html.includes('/donate'),path);
  for(const label of ['PinnacleAI®','Verify','Research','Whitebook','News','Centres','Contact'])assert(html.includes(`>${label}</a>`),`${path}: ${label}`);
  const headerStart=html.indexOf('<header class="portal-header"');
  const headerEnd=html.indexOf('</header>',headerStart)+'</header>'.length;
  const footerStart=html.indexOf('<footer class="portal-site-footer"');
  const footerEnd=html.indexOf('</footer>',footerStart)+'</footer>'.length;
  assert(headerStart>=0&&headerEnd>'</header>'.length,path);
  assert(footerStart>=0&&footerEnd>'</footer>'.length,path);
  const header=html.slice(headerStart,headerEnd).replaceAll(' aria-current="page"','');
  const footer=html.slice(footerStart,footerEnd);
  assert.equal((footer.match(/<section class="verify-footer"/g)||[]).length,1,path);
  assert(footer.indexOf('<section class="verify-footer"')<footer.indexOf('<div class="portal-footer"'),path);
  assert(footer.includes('Explore all 36 evidence records')&&footer.includes('Explore Pinnacle Verify'),path);
  headers.push(header);footers.push(footer);
  results.push({path,status:response.status,headerSha256:sha(header),footerSha256:sha(footer),htmlSha256:sha(html)});
}
assert.equal(new Set(headers).size,1,'Rendered shared header differs across managed pages after active-state normalization');
assert.equal(new Set(footers).size,1,'Rendered Verify block and full footer differ across managed pages');
const report={
  checkedAt:new Date().toISOString(),
  version:101,
  managedPages:paths.length,
  sharedHeaderIdentical:true,
  verifyInsideSharedFooter:true,
  sharedFooterIdentical:true,
  donateRemoved:true,
  priorityNavigation:['PinnacleAI®','Verify','Research','Whitebook','News','Centres','Contact','Enroll'],
  results
};
await fs.writeFile('deployment/shared-shell-production-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
