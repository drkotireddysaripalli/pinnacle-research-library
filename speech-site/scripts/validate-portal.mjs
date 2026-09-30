import fs from 'node:fs';
import assert from 'node:assert/strict';
import nav from '../src/data/portal-navigation.json' with {type:'json'};
const html=fs.readFileSync('dist/index.html','utf8');
const managedHtml=[
  'dist/index.html',
  'dist/enroll-autism-speech-aba-therapies-india.html',
  'dist/best-occupational-therapy-center-india-proven-improvement-rate.html',
  'dist/best-aba-therapy-center-india-proven-improvement-rate.html',
  'dist/best-special-education-center-call-9100181181.html',
  'dist/autism-therapy.html',
  'dist/centers.html',
  'dist/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india.html',
  'dist/speech-aba-autism-assessments.html',
  ...['pinnacleai','abilityscore','seven-readiness-indexes','personal-development-kernel','prognose','therapeuticai','everyday-therapy','fusion-module','reassess-review-repeat'].map(slug=>'dist/'+slug+'.html'),
  'dist/speech-therapy/service-information.html',
  'dist/speech-therapy/first-visit-guide.html',
  'dist/speech-therapy/teacher-observation-guide.html'
].map(file=>fs.readFileSync(file,'utf8'));
const checks=[];
function check(name,value){assert(value,name);checks.push(name);}
const hrefs=new Set([...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&')));
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
function full(u){return u.startsWith('/')?'https://www.pinnacleblooms.org'+u:u;}
const links=[...nav.main,...nav.mobileExtras,...nav.aboutContact,...nav.therapy.flatMap(x=>[{url:x.url},...x.links]),...nav.footerColumns.flat().flatMap(x=>x.links),...nav.community,...nav.locations,...nav.legal];
check('Complete documented portal navigation is present',links.every(x=>hrefs.has(full(x.url))));
check('Five priority therapy menus have native disclosure controls',(html.match(/class="portal-therapy-menu"/g)||[]).length===5);
check('Header and footer navigation are server rendered',html.includes('aria-label="Complete site navigation"')&&html.includes('aria-label="Research Studies"'));
const priorityLabels=['Verify','PinnacleAI®','Research','AbilityScore®','7 Readiness Indexes','Self-Sufficient','Mainstream','160Yrs Paradigm Shift','Citations'];
const priorityDetails=['4 Billion DataPoints for 900Million Children','Class B SaMD · MD-5 licence &amp; BIS scope','Study Journals &amp; Publications','0–1000 developmental ability scale','Your Child Life As it could be','Growing everyday independence','School &amp; community participation','Life-first child development','Quote · link · download'];
check('Authority strip follows the proof-to-purpose narrative order',nav.main.map(link=>link.label).join('|')===priorityLabels.join('|'));
check('Reader-facing authority header is identical across every managed public page',managedHtml.every(page=>priorityLabels.every(label=>page.includes(`class="portal-nav-label">${label}</span>`))&&priorityDetails.every(detail=>page.includes(detail))&&page.includes('data-cta="header-enrol"')));
check('Priority therapy order and labels are exact',nav.therapy.map(group=>group.label).join('|')==='Autism Therapy|Speech Therapy|Occupational Therapy|ABA Therapy|Special Education');
check('Legacy Behavioral label is removed from priority therapy navigation',!nav.therapy.some(group=>group.label==='Behavioral'));
check('Updated Pinnacle Blooms Network lockup is shared by header and footer',managedHtml.every(page=>(page.match(/pinnacle-blooms-network-lockup/g)||[]).length>=2));
check('Recognition, awards and citation destinations are preserved',managedHtml.every(page=>['Recognition register','Government appreciation · source letters','Awards &amp; nominations · documented stage','Citation library &amp; downloads'].every(label=>page.includes(label))));
check('Helpline number is strong, vertically centred and has no redundant support line',managedHtml.every(page=>page.includes('National Autism Helpline')&&page.includes('Free guidance · 24/7')&&page.includes('data-cta="header-call"')&&page.includes('>9100 181 181</strong></a>')&&!page.includes('Call For Your Child')&&page.includes('Find a centre')));
check('About and Contact is visible and More remains the final primary-menu option',managedHtml.every(page=>page.indexOf('>About &amp; Contact</a>')<page.indexOf('class="portal-more-trigger"')&&page.includes('<span>More</span>')&&page.includes('aria-label="About and Contact menu"')));
check('About and Contact routes are available in both direct and complete navigation',managedHtml.every(page=>['About Pinnacle Blooms Network','Bharath Healthcare Laboratories Private Limited','Leadership','Recognition','Awards','Contact'].every(label=>page.includes(label))));
check('Complete menu has a touch-accessible close control',managedHtml.every(page=>page.includes('class="portal-menu-close"')&&page.includes('Close <span aria-hidden="true">×</span>')));
check('Citation library is promoted in the authority strip and complete menu',managedHtml.every(page=>(page.match(/href="https:\/\/www\.pinnacleblooms\.org\/verify\/evidence\/cite\.html"/g)||[]).length>=2));
check('Unverified registered marks are not asserted',nav.main.some(link=>link.label==='Verify')&&nav.main.some(link=>link.label==='7 Readiness Indexes')&&!nav.main.some(link=>link.label==='Verify®'||link.label==='7 Readiness Indexes®'));
check('Research navigation uses the curated evidence library',managedHtml.every(page=>page.includes('href="https://www.pinnacleblooms.org/verify/evidence/research-library.html"')));
check('Donate is removed from every managed shared header',managedHtml.every(page=>!page.includes('class="portal-donate"')&&!page.includes('href="https://www.pinnacleblooms.org/donate"')));
const sharedFooters=managedHtml.map(page=>page.slice(page.indexOf('<footer class="portal-site-footer"'),page.indexOf('</footer>')+'</footer>'.length));
check('Verify block is inside the shared footer on every managed public page',sharedFooters.every(footer=>footer.startsWith('<footer class="portal-site-footer"')&&footer.includes('<section class="verify-footer"')&&footer.includes('Explore Pinnacle Verify')&&footer.includes('portal-footer-evidence')));
check('Verify block and full footer are identical across every managed public page',new Set(sharedFooters).size===1);
check('Footer uses the exact legal identity and current approved footprint',sharedFooters.every(footer=>footer.includes('Bharath Healthcare Laboratories Private Limited')&&!footer.includes('Bharath HealthCare P LIMITED')&&!footer.includes('Maharashtra')));
check('Legacy speech section targets retained',['what-section','why-section','Advantages-section','ChildrenServices-section','assessment-section','admission-section','procedure-section','Cost-section'].every(x=>ids.has(x)));
check('New speech submenu targets exist',nav.therapy.find(x=>x.label==='Speech Therapy').links.filter(x=>x.url.includes('#')).every(x=>ids.has(x.url.split('#')[1])));
check('No duplicate HTML IDs',ids.size===[...html.matchAll(/\bid="([^"]+)"/g)].length);
check('Official Pinnacle TV channel preserved',hrefs.has('https://www.youtube.com/channel/UCAAuGmvPSBRiCnDlEcXYwEQ'));
check('Footer portal destinations preserved',['https://materials.pinnacleblooms.org/','https://interventions.pinnacleblooms.org/','https://pediatricians.pinnacleblooms.org/'].every(x=>hrefs.has(x)));
check('Complete navigation exposes all high-value site hubs',[
  'https://pinnacleblooms.org/ask/',
  full('/staff'),
  full('/allmirracles'),
  full('/top-autism-therapy-services-india-proven-improvement-rate'),
  full('/media-coverage'),
  full('/events')
].every(x=>hrefs.has(x)));
check('Footer uses canonical policy destinations',[
  '/privacy-policy',
  '/terms-of-use',
  '/cookie-policy',
  'https://books.pinnacleblooms.org/payment-and-billing',
  '/copyright-and-intellectual'
].every(x=>hrefs.has(full(x)))&&!hrefs.has(full('/terms-of-service')));
check('Redirecting utility aliases are replaced with direct canonicals',[
  '/speech-aba-autism-assessments',
  '/autism-speech-aba-parent-family-resources',
  '/autism-speech-aba-news',
  '/contact-national-autism-helpline-24-7'
].every(x=>hrefs.has(full(x)))&&!['/assesments','/all-resources','/news','/contact'].some(x=>hrefs.has(full(x))));
check('Certified-course destination retained in complete navigation',hrefs.has(full('/certified-courses')));
const result={checkedAt:new Date().toISOString(),checksPassed:checks.length,documentedLinkEntries:links.length,checks};
fs.writeFileSync('PORTAL-VALIDATION-20260927.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
