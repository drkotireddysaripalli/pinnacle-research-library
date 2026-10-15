import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import mime from 'mime';
import sharp from 'sharp';
import {reassessContent as c} from '../src/data/reassess-content.ts';
const out='reviews/reassess-20261015';await fs.mkdir(out,{recursive:true});
const html=await fs.readFile('dist/reassess-review-repeat.html','utf8');
assert(html.includes('<title>'+c.title.replaceAll('&','&amp;')+'</title>'));
assert(html.includes('href="https://www.pinnacleblooms.org/reassess-review-repeat"'));
assert(html.includes('index, follow, max-image-preview:large'));assert(!html.includes('noindex'));
const graphs=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const graph=graphs.find(x=>x['@graph'])['@graph'];
assert.equal(graph.find(x=>x['@type']==='WebPage').dateModified,c.updatedOn);
assert.equal(graph.find(x=>x['@type']==='FAQPage').mainEntity.length,c.faqs.length);
const evidence=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/reassess-review-repeat-sources.json','utf8'));
assert.equal(evidence.updated,c.updatedOn);assert.equal(evidence.illustrativeExample.observations.length,3);assert.equal(evidence.stages.length,7);assert.equal(evidence.reviewCycle.length,4);
const md=await fs.readFile('dist/pinnacle-pages-data/reassess-review-repeat-reading.md','utf8');
for(const f of c.faqs){assert(html.includes(f.question));assert(md.includes(f.question)&&md.includes(f.answer));}
for(const x of [c.direct,c.example.decision,c.example.family,c.example.checkpoint])assert(md.includes(x));
const assets=new Set([...html.matchAll(/\/pinnacle-pages-assets\/[A-Za-z0-9_./-]+/g)].map(m=>m[0]));
for(const key of assets)assert((await fs.stat('dist'+key)).size>0,key);
const og=new URL(html.match(/<meta property="og:image" content="([^"]+)"/)[1]);const ogMeta=await sharp('dist'+og.pathname).metadata();assert.equal(ogMeta.width,1200);assert.equal(ogMeta.height,630);
const server=http.createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://local').pathname);assert(!p.includes('..'));if(p==='/reassess-review-repeat')p+='.html';const b=await fs.readFile(path.join(process.cwd(),'dist',p));res.writeHead(200,{'content-type':mime.getType(p)||'application/octet-stream'}).end(b);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,results=[];
try{for(const [engine,type,widths]of[['Chrome',chromium,[320,390,768,1024,1440]],['WebKit',webkit,[390]]]){
 const browser=await type.launch({...(engine==='Chrome'?{channel:'chrome'}:{}),headless:true});
 try{for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:950}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(origin+c.path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  for(const [label,selector]of[['hero','.rr-hero'],['definition','#what-review-does'],['example','#worked-example'],['family','#next-review']]){await page.locator(selector).scrollIntoViewIfNeeded();if(label==='hero')await page.locator('.rr-hero-art img').evaluate(i=>i.decode());if(engine==='Chrome'&&[390,768,1440].includes(width))await page.locator(selector).screenshot({path:out+'/'+label+'-'+width+'.png'});}
  const result=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,ids:[...document.querySelectorAll('[id]')].map(x=>x.id),brokenAnchors:[...document.querySelectorAll('main a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id)),header:!!document.querySelector('.portal-header'),footer:!!document.querySelector('.portal-site-footer'),verify:!!document.querySelector('.verify-footer'),call:!!document.querySelector('a[href="tel:+919100181181"]'),stages:document.querySelectorAll('.rr-stages li').length,faq:document.querySelectorAll('#questions details').length,image:{width:document.querySelector('.rr-hero-art img').naturalWidth,height:document.querySelector('.rr-hero-art img').naturalHeight},bodyColor:getComputedStyle(document.querySelector('.rr-lead')).color,sourceLinks:document.querySelectorAll('#sources a[href*="/verify/"]').length}));
  assert(!result.overflow);assert.equal(result.h1,1);assert.equal(new Set(result.ids).size,result.ids.length);assert.equal(result.brokenAnchors.length,0);assert(result.header&&result.footer&&result.verify&&result.call);assert.equal(result.stages,7);assert.equal(result.faq,10);assert(result.image.width>0&&result.image.width/result.image.height>1.4&&result.image.width/result.image.height<1.6);assert(result.sourceLinks>=5);assert.equal(errors.length,0);
  const faq=page.locator('#questions summary').first();await faq.scrollIntoViewIfNeeded();await faq.focus();await page.keyboard.press('Enter');assert(await page.locator('#questions details').first().evaluate(e=>e.open));
  results.push({engine,...result,ids:result.ids.length,errors,keyboardFaq:true});await page.close();
 }}finally{await browser.close();}
}
const report={passed:true,at:new Date().toISOString(),checks:['Title/canonical/indexability','visible FAQ/schema/source parity','7 stages and 4 review steps','fictional example and open checkpoint agree across formats','all page asset files present','1200x630 social card','5 responsive widths','Chrome and WebKit render','unique anchors and keyboard FAQ','current common header/footer/Verify and contact'],assets:assets.size,results};await fs.writeFile(out+'/validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,cases:results.length,assets:assets.size}));
}finally{server.close();}
