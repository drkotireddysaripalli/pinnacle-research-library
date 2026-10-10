import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const origin='https://www.pinnacleblooms.org';
const out=path.resolve(process.argv[2]||'ask-private/semrush-prime-pages-20261010');
const pages=[
 ['/best-aba-therapy-center-india-proven-improvement-rate','speech'],
 ['/top-speech-therapy-center-india-proven-improvement-rate','speech'],
 ['/speech-therapy/service-information','speech'],
 ['/best-occupational-therapy-center-india-proven-improvement-rate','speech'],
 ['/autism-therapy','speech'],
 ['/best-special-education-center-call-9100181181','speech'],
 ['/speech-aba-autism-assessments','core'],
 ['/enroll-autism-speech-aba-therapies-india','speech'],
 ['/national-autism-helpline','helpline'],
 ['/pinnacleai','pinnacle'],
 ['/verify/','verify'],
 ['/verify/evidence/pinnacleai-regulatory-journey.html','verify'],
 ['/verify/evidence/scale-and-mission.html','verify'],
 ['/verify/evidence/research-library.html','verify'],
 ['/abilityscore','pinnacle'],
 ['/seven-readiness-indexes','pinnacle'],
 ['/self-sufficient','core'],
 ['/mainstream','core'],
 ['/verify/evidence/pinnacle-paradigm-shift.html','verify'],
 ['/verify/evidence/cite.html','verify']
];
const acquisition=[
 '/best-aba-therapy-center-india-proven-improvement-rate',
 '/top-speech-therapy-center-india-proven-improvement-rate',
 '/best-occupational-therapy-center-india-proven-improvement-rate',
 '/autism-therapy',
 '/best-special-education-center-call-9100181181',
 '/speech-aba-autism-assessments',
 '/enroll-autism-speech-aba-therapies-india',
 '/national-autism-helpline'
];
const get=async(url,options={})=>fetch(url,{redirect:'manual',signal:AbortSignal.timeout(30000),...options});
const textValue=(html,tag)=>html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`,'i'))?.[1].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()||'';
const tagAttr=(tag,name)=>tag.match(new RegExp(`${name}=["']([^"']+)["']`,'i'))?.[1]||'';
const matchingTag=(html,selector,predicate)=>[...html.matchAll(new RegExp(`<${selector}\\b[^>]*>`,'gi'))].map(x=>x[0]).find(predicate)||'';
async function chain(route){
 let url=origin+route;const rows=[];
 for(let i=0;i<5;i++){
  const r=await get(url);rows.push({url,status:r.status,location:r.headers.get('location')});
  if(![301,302,307,308].includes(r.status)||!r.headers.get('location'))return {rows,response:r};
  url=new URL(r.headers.get('location'),url).href;
 }
 throw Error('Redirect chain exceeded five hops: '+route);
}
await fs.mkdir(out,{recursive:true});
const sitemapText={
 core:await (await fetch(origin+'/sitemaps/core.xml')).text(),
 speech:await (await fetch(origin+'/speech-therapy/sitemap.xml')).text(),
 pinnacle:await (await fetch(origin+'/pinnacleai/sitemap.xml')).text(),
 verify:await (await fetch(origin+'/verify/sitemap.xml')).text(),
 helpline:await (await fetch(origin+'/national-autism-helpline/sitemap.xml')).text()
};
const records=[];
for(const [route,map] of pages){
 const {rows,response}=await chain(route);assert.equal(rows.length,1,route+' must not redirect');assert.equal(response.status,200,route);
 const html=await response.text(),canonical=tagAttr(matchingTag(html,'link',x=>/rel=["']canonical["']/i.test(x)),'href'),robots=tagAttr(matchingTag(html,'meta',x=>/name=["']robots["']/i.test(x)),'content'),title=textValue(html,'title'),h1=textValue(html,'h1'),description=tagAttr(matchingTag(html,'meta',x=>/name=["']description["']/i.test(x)),'content');
 const schemas=[];for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{const parsed=JSON.parse(m[1]);schemas.push({valid:true,types:(Array.isArray(parsed)?parsed:[parsed]).flatMap(x=>x?.['@graph']||x).map(x=>x?.['@type']).filter(Boolean)});}catch(error){schemas.push({valid:false,error:String(error)})}}
 assert.equal(canonical,origin+route,route+' canonical');assert(title&&description&&h1,route+' metadata/H1');assert(!/noindex/i.test(robots),route+' indexability');assert(schemas.every(x=>x.valid),route+' JSON-LD parse');
 const sitemapNeedle='<loc>'+origin+route+'</loc>',inSitemap=sitemapText[map].includes(sitemapNeedle);assert(inSitemap,route+' sitemap');
 records.push({route,status:response.status,canonical,robots:robots||'header/default indexable',title,description,h1,schemas,inSitemap,sitemap:map});
}
const aba=await chain('/aba-therapy');assert.equal(aba.rows.length,2);assert.equal(aba.rows[0].status,301);assert.equal(aba.rows[0].location,origin+'/best-aba-therapy-center-india-proven-improvement-rate');assert.equal(aba.rows[1].status,200);
const redirects={aba:aba.rows};
const captures=[];const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{name:'mobile-390x844',width:390,height:844},{name:'desktop-1440x1000',width:1440,height:1000}]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});const page=await context.newPage();
  for(const route of acquisition){
   const errors=[];page.removeAllListeners('pageerror');page.on('pageerror',e=>errors.push(String(e)));
   const response=await page.goto(origin+route+'?utm_source=validation_test',{waitUntil:'domcontentloaded',timeout:45000});await page.waitForTimeout(500);
   const result=await page.evaluate(()=>({title:document.title,h1:(document.querySelector('h1')?.textContent||'').replace(/\s+/g,' ').trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,callLinks:[...document.querySelectorAll('a[href^="tel:+919100181181"]')].length,assessmentLinks:[...document.querySelectorAll('a[href*="enroll-autism-speech-aba-therapies-india"]')].length,canonical:document.querySelector('link[rel="canonical"]')?.href||''}));
   assert.equal(response?.status(),200,route);assert(result.h1&&!result.overflow,route+' '+viewport.name);assert(result.callLinks+result.assessmentLinks>0,route+' contact action');
   const file=(route==='/'?'home':route.slice(1).replaceAll('/','--'))+'--'+viewport.name+'.png';await page.screenshot({path:path.join(out,file),fullPage:false});captures.push({route,viewport:viewport.name,status:response?.status(),...result,pageErrors:errors,screenshot:file});
  }
  await context.close();
 }
}finally{await browser.close();}
const report={at:new Date().toISOString(),origin,pages:records.length,acquisitionPages:acquisition.length,metadataChecks:records,redirects,captures,passed:true,limits:['Static/browser acceptance; not field Core Web Vitals.','No form submission, call, OTP, purchase or conversion record was created.','Fresh Semrush issue counts require the campaign owner’s scheduled recrawl.']};
await fs.writeFile(path.join(out,'acceptance.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,pages:records.length,captures:captures.length,out}));
