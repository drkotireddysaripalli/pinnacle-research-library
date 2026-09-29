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
  let previousAuthorityIndex=-1;
  for(const label of ['Verify','Citations','PinnacleAI®','Research','AbilityScore®','7 Readiness Indexes','Self-Sufficient','Mainstream','160-Year Challenge']){
    const authorityIndex=html.indexOf(`class="portal-nav-label">${label}</span>`);
    assert(authorityIndex>previousAuthorityIndex,`${path}: authority order ${label}`);
    previousAuthorityIndex=authorityIndex;
  }
  for(const detail of ['Regulated developmental support','Understand present abilities','Discuss the next priorities','Everyday independence','School &amp; community participation','The PinnacleAI® paradigm shift','36 evidence records','Quote, link &amp; download','Studies &amp; publications'])assert(html.includes(detail),`${path}: ${detail}`);
  for(const label of ['Autism Therapy','Speech Therapy','Occupational Therapy','ABA Therapy','Special Education'])assert(html.includes(`class="portal-therapy-title"`)&&html.includes(`>${label}</a>`),`${path}: ${label}`);
  assert((html.match(/class="portal-therapy-menu"/g)||[]).length===5,`${path}: five priority therapy menus`);
  assert((html.match(/pinnacle-blooms-network-lockup/g)||[]).length>=2,`${path}: updated shared logo`);
  for(const label of ['Recognition register','Government appreciation · source letters','Awards &amp; nominations · documented stage','Citation library &amp; downloads'])assert(html.includes(label),`${path}: ${label}`);
  assert(html.includes('National Autism Helpline')&&html.includes('Free guidance · 24/7'),`${path}: helpline context`);
  assert(html.includes('>9100 181 181</strong>'),`${path}: strong phone`);
  assert(html.includes('<small>Call For Your Child</small>'),`${path}: child-focused phone support`);
  assert(html.includes('Find a centre'),`${path}: centre finder`);
  assert(html.includes('class="portal-more-trigger"')&&html.includes('<span>More</span>'),`${path}: final More trigger`);
  assert(html.includes('class="portal-menu-close"'),`${path}: touch-accessible menu close control`);
  assert((html.match(/href="https:\/\/www\.pinnacleblooms\.org\/verify\/evidence\/cite\.html"/g)||[]).length>=2,`${path}: citations promoted`);
  assert(html.includes('href="https://www.pinnacleblooms.org/verify/evidence/research-library.html"'),`${path}: curated research destination`);
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
  assert(footer.includes('Bharath Healthcare Laboratories Private Limited')&&!footer.includes('Bharath HealthCare P LIMITED')&&!footer.includes('Maharashtra'),`${path}: exact legal identity and current footprint`);
  headers.push(header);footers.push(footer);
  results.push({path,status:response.status,headerSha256:sha(header),footerSha256:sha(footer),htmlSha256:sha(html)});
}
assert.equal(new Set(headers).size,1,'Rendered shared header differs across managed pages after active-state normalization');
assert.equal(new Set(footers).size,1,'Rendered Verify block and full footer differ across managed pages');
const report={
  checkedAt:new Date().toISOString(),
  version:104,
  managedPages:paths.length,
  sharedHeaderIdentical:true,
  verifyInsideSharedFooter:true,
  sharedFooterIdentical:true,
  donateRemoved:true,
  priorityNavigation:['Verify — 36 evidence records','Citations — Quote, link & download','PinnacleAI® — Regulated developmental support','Research — Studies & publications','AbilityScore® — Understand present abilities','7 Readiness Indexes — Discuss the next priorities','Self-Sufficient — Everyday independence','Mainstream — School & community participation','160-Year Challenge — The PinnacleAI® paradigm shift'],
  priorityTherapies:['Autism Therapy','Speech Therapy','Occupational Therapy','ABA Therapy','Special Education'],
  results
};
await fs.writeFile('deployment/shared-shell-production-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
