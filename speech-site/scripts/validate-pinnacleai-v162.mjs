import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {pinnacleWave} from '../src/data/pinnacleai-wave.ts';
import {overviewArchitecture,overviewDefinition,overviewOutcomes} from '../src/data/pinnacleai-overview.ts';
import {measurePinnacleLifecycle} from '../tests/browser/pinnacle-lifecycle-contract.mjs';
const root=process.argv[2]||'audits/pinnacleai-v162',receiptFile=process.argv[3]||'deployment/pinnacleai-v162-responsive-20261001.json',origin='http://127.0.0.1:4342';
await fs.mkdir(root,{recursive:true});
const server=spawn(process.execPath,['scripts/serve-quality-preview.mjs'],{env:{...process.env,QUALITY_PREVIEW_PORT:'4342'},stdio:'ignore',windowsHide:true});
let browser;const rows=[];
try{
 for(let i=0;i<30;i++){try{if((await fetch(origin+'/pinnacleai')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({headless:true});
 for(const width of [320,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/pinnacleai',{waitUntil:'load'});
  const result=await page.evaluate(()=>{
   const b=document.querySelector('[data-wave-module="pinnacleai"]'),ids=[...document.querySelectorAll('[id]')].map(x=>x.id);
   const call=b.querySelector('.wave2-hero-detail [data-cta="pinnacleai-call"]').getBoundingClientRect(),art=b.querySelector('.wave2-hero-art').getBoundingClientRect();
   return {overflow:document.documentElement.scrollWidth>innerWidth+1,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),missingAnchors:[...b.querySelectorAll('a[href^="#"]')].map(a=>a.hash).filter(h=>!document.getElementById(h.slice(1))),architecture:b.querySelectorAll('.overview-architecture>li').length,stages:b.querySelectorAll('.overview-lifecycle li').length,faqs:b.querySelectorAll('.wave2-faq details').length,callBeforeArt:call.bottom<=art.top,h1:b.querySelector('h1').innerText,sections:[...b.querySelectorAll('section[id]')].map(x=>x.id)};
  });
  assert.equal(result.overflow,false,'overflow '+width);assert.deepEqual(result.duplicateIds,[]);assert.deepEqual(result.missingAnchors,[]);
  assert.equal(result.architecture,7);assert.equal(result.stages,7);assert.equal(result.faqs,10);assert.match(result.h1,/PinnacleAI®/);assert.match(result.h1,/Your child’s whole life/);
  assert(await page.locator('.wave2-lead').innerText().then(t=>t.includes('self-sufficient, mainstream-included')),'Life purpose retained in the opening');
  assert(result.sections.indexOf('worked-example')<result.sections.indexOf('what-it-does'),'Concrete example before architecture');
  assert(result.sections.indexOf('sources')>result.sections.indexOf('mainstream'),'Full evidence after the product narrative');
  assert.equal(await page.locator('.overview-module-detail').count(),7);
  const lifecycle=await page.evaluate(measurePinnacleLifecycle);assert.deepEqual(lifecycle.failures,[],'readable lifecycle '+width);result.lifecycle=lifecycle;
  for(const id of ['paradigm-shift','sources','what-it-does','therapies','family-journey','worked-example','self-sufficient','mainstream','first-visit'])assert(result.sections.includes(id),id);
  if(width<=850)assert.equal(result.callBeforeArt,true);
  for(const part of overviewArchitecture)for(const [,slug]of part.links)assert.equal(await page.locator('.overview-module-links a[href="https://www.pinnacleblooms.org/'+slug+'"]').count(),1);
  assert.equal(await page.locator('#first-visit a[href="tel:+919100181181"]').count(),1);
  for(const id of ['self-sufficient','mainstream'])assert.equal(await page.locator('#'+id+' a[href="https://www.pinnacleblooms.org/'+id+'"]').count(),1);
  const faq=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.flatMap(n=>{const x=JSON.parse(n.textContent);return x['@graph']||[x];}).find(x=>x['@type']==='FAQPage')?.mainEntity);
  assert.deepEqual(faq.map(x=>({question:x.name,answer:x.acceptedAnswer.text})),pinnacleWave[0].faqs);
  const detail=page.locator('.life-research').first();await detail.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await detail.getAttribute('open'),'');
  await detail.locator('summary').click();
  for(const selector of ['.wave2-hero','.overview-lifecycle','.overview-intro','.life-evidence','.overview-system','.life-therapies','.overview-family','.overview-story','#self-sufficient','#mainstream','#first-visit']){
   const el=page.locator(selector);await el.scrollIntoViewIfNeeded();
   await el.locator('img').evaluateAll(async nodes=>{for(const n of nodes){n.loading='eager';await n.decode();}});
   if([390,768,1440].includes(width))await el.screenshot({path:root+'/'+width+'-'+selector.replace(/[.#]/g,'')+'.png'});
  }
  assert.deepEqual(errors,[]);rows.push({width,...result,faqSchemaMatches:true,keyboardDisclosure:true,imagesDecoded:true,errors});await page.close();
 }
 const fallback=await browser.newPage({viewport:{width:320,height:568}});
 await fallback.route('**/*.woff2',route=>route.abort());
 await fallback.goto(origin+'/pinnacleai',{waitUntil:'load'});
 assert.equal(await fallback.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),true,'320px fallback fonts must not widen the lifecycle grid');
 assert.deepEqual((await fallback.evaluate(measurePinnacleLifecycle)).failures,[],'Readable cards with fallback fonts');
 await fallback.close();
 const json=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/pinnacleai-sources.json','utf8'));
 assert.equal(json.paradigmShift,overviewDefinition);assert.equal(json.outcomeChapters.length,2);assert.equal(json.researchNotes.length,2);
 for(const suffix of ['sources.txt','reading.md']){
  const text=await fs.readFile('dist/pinnacle-pages-data/pinnacleai-'+suffix,'utf8');assert(text.includes(overviewDefinition));
  for(const p of overviewOutcomes)assert(text.includes(p.answer));
 }
 await fs.writeFile(receiptFile,JSON.stringify({at:new Date().toISOString(),rows,fallbackFonts320:true,exportsMatch:true,noLeadSubmitted:true},null,2)+'\n');
 console.log(JSON.stringify({passed:true,widths:rows.map(r=>r.width),architecture:7,stages:7,faqs:10,exportsMatch:true,imagesDecoded:true}));
}finally{if(browser)await browser.close();if(server.exitCode===null)server.kill();}
