import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {chromium} from 'playwright';import mime from 'mime';
import {withManagedSitemaps} from '../deployment/managed-sitemap-runtime.mjs';
const root='release-managed-sitemap-union-20261013',out='outputs/managed-sitemaps-20261013/browser',priv='ask-private/managed-sitemaps-20261013';
await fs.mkdir(out,{recursive:true});
const config=JSON.parse(await fs.readFile(priv+'/runtime-config.json','utf8'));
const assets={async fetch(request){const url=new URL(request.url),file=path.join(root,decodeURIComponent(url.pathname));assert(path.resolve(file).startsWith(path.resolve(root)+path.sep));try{return new Response(await fs.readFile(file),{headers:{'Content-Type':mime.getType(file)||'application/octet-stream'}});}catch(e){if(e.code!=='ENOENT')throw e;if(url.pathname.startsWith('/verify/fonts/'))return fetch('https://www.pinnacleblooms.org'+url.pathname);return new Response('Not found',{status:404});}}};
const app=withManagedSitemaps({fetch:(r)=>assets.fetch(r)},config),browser=await chromium.launch({headless:true}),results=[];
try{
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(['www.pinnacleblooms.org','pinnacleblooms.org','materials.pinnacleblooms.org','interventions.pinnacleblooms.org','pediatricians.pinnacleblooms.org'].includes(url.hostname)&&request.method()==='GET'&&(/^\/site-map(?:\/|$)|^\/pinnacle-pages-|^\/verify\/(?:fonts\/|favicon)/.test(url.pathname))){
    const response=await app.fetch(new Request(request.url(),{headers:request.headers()}),{ASSETS:assets},{});return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
   }
   await route.abort();
  });
  for(const host of ['www.pinnacleblooms.org','pinnacleblooms.org','materials.pinnacleblooms.org','interventions.pinnacleblooms.org','pediatricians.pinnacleblooms.org']){
   const page=await context.newPage(),url='https://'+host+'/site-map/';await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const evidence=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent),header:!!document.querySelector('.portal-header'),footer:!!document.querySelector('.portal-footer'),overflow:document.documentElement.scrollWidth>innerWidth+1,call:[...document.querySelectorAll('a[href="tel:+919100181181"]')].length,canonical:document.querySelector('link[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content,body:document.querySelector('main')?.innerText.length,links:[...document.querySelectorAll('main a')].map(a=>a.href),nativeStyles:!!document.querySelector('[data-pinnacle-vernacular]')}));
   assert(evidence.header&&evidence.footer&&!evidence.overflow&&evidence.call>0&&evidence.h1.length===1&&evidence.links.length>0&&evidence.nativeStyles,JSON.stringify({url,width,evidence}));assert.equal(evidence.canonical,url+'index.html');assert.match(evidence.robots,/noindex, follow/);
   const screenshot=out+'/'+host+'-'+width+'.png';await page.screenshot({path:screenshot});results.push({url,width,passed:true,evidence,screenshot});await page.close();
  }await context.close();
 }
}finally{await browser.close();await fs.writeFile(out+'/report.json',JSON.stringify({at:new Date().toISOString(),scope:'isolated candidate; external analytics and notifications blocked; no calls/enquiries',results},null,2)+'\n');}
console.log(JSON.stringify({browser:'local Chromium',cases:results.length,passed:results.filter(r=>r.passed).length,report:out+'/report.json'}));
