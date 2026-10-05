import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
const base=process.env.KNOWLEDGE_BASE||'http://127.0.0.1:4330',dir='deployment/knowledge-local-20261005';await fs.mkdir(dir,{recursive:true});
const paths=['/faq','/faq/english/speech-therapy/autism-speech-therapy','/faq/telugu','/sunshine','/sunshine/techniques','/allmirracles'];
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const width of [320,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900}});
 // A synthetic local session exercises the signed-in presentation without creating a user.
 await context.route('**/ask/auth/session',r=>r.fulfill({json:{profile:{name:'Preview reader',whatsappVerified:false},csrf:'00000000-0000-4000-8000-000000000001'}}));
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const p of paths){const response=await page.goto(base+p,{waitUntil:'networkidle',timeout:30000});assert.equal(response.status(),200,p);await page.waitForFunction(()=>!document.querySelector('#ask-reader-gate')?.open);
 const row=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,duplicateIds:[...document.querySelectorAll('[id]')].map(x=>x.id).filter((x,i,a)=>a.indexOf(x)!==i),canonical:document.querySelector('link[rel=canonical]')?.href,header:document.querySelectorAll('.portal-site-header').length,footer:document.querySelectorAll('.portal-site-footer').length,cards:[...document.querySelectorAll('.knowledge-card')].map(x=>({w:x.clientWidth,h:x.clientHeight})),schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent))}));
 assert(row.scroll<=width,p+' overflow');assert.equal(row.h1,1,p+' H1');assert.equal(row.duplicateIds.length,0,p+' duplicate IDs');assert.equal(row.footer,1);assert(row.cards.every(x=>x.w>200),p+' readable cards');
 const stem=p.replace(/[^a-z0-9]/g,'-')+'-'+width;
 await page.screenshot({path:dir+'/'+stem+'-top.png'});
 await page.locator('.knowledge-hero').scrollIntoViewIfNeeded();await page.screenshot({path:dir+'/'+stem+'-content.png'});
 if(p==='/faq/english/speech-therapy/autism-speech-therapy'){await page.locator('#answer-text').scrollIntoViewIfNeeded();await page.screenshot({path:dir+'/'+stem+'-answer.png'});const visible=await page.locator('#answer-text>div').innerText();const graph=row.schema.flatMap(x=>x['@graph']||[]).find(x=>x['@type']==='FAQPage');assert(graph.mainEntity[0].acceptedAnswer.text.length>100);assert(visible.length>100);}
 if(p==='/faq'){await page.getByRole('link',{name:'Next →',exact:true}).click();await page.waitForURL('**?page=2');assert(await page.getByRole('link',{name:'2',exact:true}).getAttribute('aria-current')==='page');}
 results.push({path:p,width,overflow:row.scroll>width,h1:row.h1,duplicateIds:row.duplicateIds,footer:row.footer,canonical:row.canonical,cards:row.cards.length});}
 assert.deepEqual(errors,[]);await context.close();}
 const context=await browser.newContext({viewport:{width:390,height:844}});await context.route('**/ask/auth/session',r=>r.fulfill({json:{profile:null,csrf:'00000000-0000-4000-8000-000000000001'}}));const page=await context.newPage();await page.goto(base+'/faq',{waitUntil:'networkidle'});assert(await page.locator('#ask-reader-gate').isVisible());await page.screenshot({path:dir+'/google-reader-overlay-390.png'});assert.equal(await page.locator('[name=returnTo]').first().inputValue(),'/faq');await page.keyboard.press('Escape');assert(await page.locator('#ask-reader-gate').isVisible());await context.close();
}finally{await browser.close();}
await fs.writeFile(dir+'/results.json',JSON.stringify({at:new Date().toISOString(),base,results,anonymousGate:true,physicalDevices:false},null,2));console.log(JSON.stringify({pages:paths.length,widths:[320,768,1440],checks:results.length,anonymousGate:true}));
