import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const rows=[];
try {
for(const width of [320,390,768,1024,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4342/',{waitUntil:'networkidle'});
 const facts=await page.evaluate(()=>{
 const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
 const links=[...document.querySelectorAll('.speech-revision a[href^="#"]')].map(e=>e.getAttribute('href').slice(1));
 return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),missingAnchors:links.filter(id=>!document.getElementById(id)),centres:document.querySelectorAll('.directory-card').length,stages:document.querySelectorAll('.speech-stages>li').length,resources:document.querySelectorAll('.speech-government-grid>a').length,mainHeight:document.querySelector('main').getBoundingClientRect().height,centresHeight:document.querySelector('#centres').getBoundingClientRect().height,firstExampleY:document.querySelector('#everyday-communication').getBoundingClientRect().top+scrollY};
 });
 assert(!facts.overflow);assert.deepEqual(facts.duplicateIds,[]);assert.deepEqual(facts.missingAnchors,[]);assert.equal(facts.centres,62);assert.equal(facts.stages,7);assert.equal(facts.resources,6);
 const graph=await page.locator('script[type="application/ld+json"]').first().evaluate(n=>JSON.parse(n.textContent)['@graph']);
 assert.equal(graph.find(n=>n['@type']==='FAQPage').mainEntity.length,await page.locator('#questions details').count());
 for(const [section,name] of [['.speech-actions','actions'],['.speech-example-grid','example'],['.visit-story','visit'],['.visit-story-art','visit-art'],['.speech-example-creative','example-art'],['.speech-stages','stages'],['#centres','centres']]){
  const loc=page.locator(section);await loc.evaluate(n=>n.scrollIntoView({block:'start'}));
  await loc.locator('img').evaluateAll(async nodes=>Promise.all(nodes.filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;}).map(n=>{n.loading='eager';return n.decode().catch(()=>{});})));
  if([390,768,1440].includes(width)){
   await page.screenshot({path:'audits/speech-v160-'+width+'-'+name+'.png'});
  }
 }
 const pic=page.locator('.speech-example-creative img');assert(await pic.evaluate(n=>n.complete&&n.naturalWidth>0));
 const details=page.locator('.compact-centre-details').first();await details.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert(await details.evaluate(n=>n.open));await page.keyboard.press('Enter');assert(!(await details.evaluate(n=>n.open)));
 await page.locator('#centre-search').fill('Suchitra');assert(await page.locator('.directory-card:visible').count()>0);
 const choice=page.locator('.directory-card:visible a[data-cta="centre-enquiry"]').first();
 const href=await choice.getAttribute('href');const chosen=new URL(href);assert(chosen.searchParams.has('centre'));assert.equal(chosen.searchParams.get('entry'),'speech-assessment');
 await page.locator('#centre-reset').click();await page.locator('#centre-all').click();assert.equal(await page.locator('.directory-card:visible').count(),62);
 await page.locator('.technical-walkthrough summary').focus();await page.keyboard.press('Enter');assert(await page.locator('.technical-walkthrough').evaluate(n=>n.open));
 assert.deepEqual(errors,[]);rows.push({...facts,faqParity:true,keyboard:true,centrePreference:true,errors});await page.close();
}
const receipt={at:new Date().toISOString(),rows,noFormSubmitted:true};
await fs.writeFile('audits/speech-v160-responsive.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
}finally{await browser.close();}
