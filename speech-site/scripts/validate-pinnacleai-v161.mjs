import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {pinnacleWave} from '../src/data/pinnacleai-wave.ts';
import {overviewArchitecture} from '../src/data/pinnacleai-overview.ts';
const root='audits/pinnacleai-v161',origin='http://127.0.0.1:4342';
await fs.mkdir(root,{recursive:true});
const server=spawn(process.execPath,['scripts/serve-quality-preview.mjs'],{env:{...process.env,QUALITY_PREVIEW_PORT:'4342'},stdio:'ignore',windowsHide:true});
let browser;
try{
  for(let i=0;i<30;i++){try{if((await fetch(origin+'/pinnacleai')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
  browser=await chromium.launch({headless:true});
  const rows=[];
  for(const width of [320,390,768,1024,1440]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/pinnacleai',{waitUntil:'load'});
    const result=await page.evaluate(()=>{
      const body=document.querySelector('[data-wave-module="pinnacleai"]'),ids=[...document.querySelectorAll('[id]')].map(x=>x.id);
      const call=body.querySelector('[data-cta="pinnacleai-call"]').getBoundingClientRect(),art=body.querySelector('.wave2-hero-art').getBoundingClientRect();
      return {overflow:document.documentElement.scrollWidth>innerWidth+1,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),missingAnchors:[...body.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href')).filter(h=>!document.getElementById(h.slice(1))),architecture:body.querySelectorAll('.overview-architecture>li').length,stages:body.querySelectorAll('.overview-family ol>li').length,faqs:body.querySelectorAll('.wave2-faq details').length,callBeforeArt:call.bottom<=art.top};
    });
    assert.equal(result.overflow,false);assert.deepEqual(result.duplicateIds,[]);assert.deepEqual(result.missingAnchors,[]);
    assert.equal(result.architecture,7);assert.equal(result.stages,7);assert.equal(result.faqs,8);if(width<=850)assert.equal(result.callBeforeArt,true);
    for(const p of overviewArchitecture)for(const [,slug]of p.links)assert.equal(await page.locator('.overview-module-links a[href="https://www.pinnacleblooms.org/'+slug+'"]').count(),1);
    const summary=page.locator('.overview-family summary').first();await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.overview-family details').first().getAttribute('open'),'');
    const faqData=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.flatMap(n=>{const x=JSON.parse(n.textContent);return x['@graph']||[x];}).find(x=>x['@type']==='FAQPage')?.mainEntity);
    assert.deepEqual(faqData.map(x=>({question:x.name,answer:x.acceptedAnswer.text})),pinnacleWave[0].faqs);
    for(const selector of ['.wave2-hero','.overview-story','.overview-system']){
      const el=page.locator(selector);await el.scrollIntoViewIfNeeded();
      await el.locator('img').evaluateAll(async nodes=>Promise.all(nodes.map(n=>n.decode())));
      if(width===390||width===1440)await el.screenshot({path:root+'/'+width+'-'+selector.slice(1)+'.png'});
    }
    assert.deepEqual(errors,[]);rows.push({width,...result,faqSchemaMatches:true,keyboardDisclosure:true,errors});
    await page.close();
  }
  const json=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/pinnacleai-sources.json','utf8'));
  assert.equal(json.architecture.length,7);assert.equal(json.firstConversation.length,3);assert.equal(json.familyStages.length,7);assert.equal(json.questions.length,8);
  for(const suffix of ['sources.txt','reading.md']){const text=await fs.readFile('dist/pinnacle-pages-data/pinnacleai-'+suffix,'utf8');for(const part of pinnacleWave[0].mechanism)assert(text.includes(part));}
  await fs.writeFile('deployment/pinnacleai-v161-responsive-20261001.json',JSON.stringify({at:new Date().toISOString(),rows,exportsMatch:true,noLeadSubmitted:true},null,2)+'\n');
  console.log(JSON.stringify({passed:true,widths:rows.map(x=>x.width),architecture:7,stages:7,faqs:8,exportsMatch:true}));
}finally{if(browser)await browser.close();if(server.exitCode===null)server.kill();}
