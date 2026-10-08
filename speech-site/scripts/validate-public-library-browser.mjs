// Exact prepared asset union, actual shared shell, no production enquiry or tags.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';import {serveSpeech} from '../deployment/speech-handler.mjs';
const root=path.resolve('release-public-completion-20261008'),out=path.resolve('../../website-completion-20261008/public-library-candidate');await fs.mkdir(out,{recursive:true});
const mime={'.json':'application/json','.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.md':'text/markdown'};
const ASSETS={fetch:async q=>{const key=new URL(typeof q==='string'?q:q.url).pathname;try{return new Response(await fs.readFile(path.join(root,key)),{headers:{'content-type':mime[path.extname(key)]||'application/octet-stream'}})}catch{return new Response('Not found',{status:404})}}};
const inventory=JSON.parse((await fs.readFile('deployment/pinnacle-route-v12.mjs','utf8')).match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]);
const catalogue=JSON.parse(await fs.readFile(path.join(root,'mirracles-library-data/catalogue.json'),'utf8'));const material=catalogue.records.find(r=>r.category==='Materials'&&catalogue.order.includes(r.id));
const rows=[];
for(const [kind,engine,width] of [['edge',chromium,390],['webkit',webkit,390],['edge',chromium,1440]]){
 const browser=await engine.launch({headless:true,...(kind==='edge'?{channel:'msedge'}:{})}),page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/google-analytics|googletagmanager|doubleclick|googleadservices|youtube-nocookie.com\/embed|\/api\/enrolment/,r=>r.abort());
 await page.route('https://www.pinnacleblooms.org/**',async route=>{const q=route.request(),r=await serveSpeech(new Request(q.url(),{method:q.method(),headers:q.headers()}),{ASSETS},inventory);if(r)await route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});else await route.abort();});
 for(const [name,p] of [['main','/allmirracles'],['category','/allmirracles/category/Materials'],['video',material.path],['study','/everyday-therapy-home-study']]){
  await page.goto('https://www.pinnacleblooms.org'+p,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,header:!!document.querySelector('.portal-header'),footer:!!document.querySelector('.portal-site-footer'),cards:document.querySelectorAll('.card').length,iframe:document.querySelectorAll('iframe').length,phone:[...document.querySelectorAll('a[href]')].some(a=>a.getAttribute('href')==='tel:+919100181181'),json:[...document.querySelectorAll('script[type="application/ld+json"]')].every(s=>{JSON.parse(s.textContent);return true})}));
  if(state.overflow){await page.screenshot({path:path.join(out,kind+'-'+width+'-'+name+'-failure.png')});console.log(JSON.stringify(await page.evaluate(()=>({viewport:innerWidth,body:document.body.scrollWidth,doc:document.documentElement.scrollWidth,nodes:[...document.querySelectorAll('body *')].filter(x=>x.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(x).position!=='absolute').slice(0,20).map(x=>({tag:x.tagName,cls:x.className,text:x.textContent?.slice(0,80),rect:{width:x.getBoundingClientRect().width,right:x.getBoundingClientRect().right},overflow:getComputedStyle(x).overflow,minWidth:getComputedStyle(x).minWidth}))}))));}
  assert(!state.overflow&&state.h1===1&&state.header&&state.footer&&state.phone&&state.json,JSON.stringify({kind,width,name,state}));if(['main','category'].includes(name))assert.equal(state.cards,24);assert.equal(state.iframe,0);
  await page.screenshot({path:path.join(out,kind+'-'+width+'-'+name+'.png')});
  if(name==='video'){await page.locator('[data-mirracles-player]').click();assert.equal(await page.locator('iframe').count(),1);}
  rows.push({kind,width,name,...state,passed:true});
 }assert.deepEqual(errors,[]);await browser.close();
}
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({at:new Date().toISOString(),rows,passed:rows.length,productionRequests:false,submissions:false},null,2));console.log(JSON.stringify({passed:rows.length,submissions:false}));
