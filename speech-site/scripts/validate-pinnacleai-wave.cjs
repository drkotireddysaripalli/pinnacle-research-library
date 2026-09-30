const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const slugs=['pinnacleai','abilityscore','seven-readiness-indexes','personal-development-kernel','prognose','therapeuticai','everyday-therapy','fusion-module','reassess-review-repeat'];
const base=process.argv[2]||'http://127.0.0.1:4338';
const out=path.join(process.env.TEMP||process.cwd(),'pinnacleai-wave-check-20260930');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const results=[];
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:860},deviceScaleFactor:1});
  for(const slug of slugs){
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/'+slug,{waitUntil:'networkidle'});
   const data=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),width:document.documentElement.scrollWidth,viewport:innerWidth,brokenImages:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src),duplicateIds:(()=>{const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})(),anchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).map(a=>a.getAttribute('href')),shell:!!document.querySelector('.portal-header')&&!!document.querySelector('.portal-footer'),call:!!document.querySelector('a[href="tel:+919100181181"]'),sourceLinks:[...document.querySelectorAll('#sources a[href*="/verify/"]')].length,heroImage:!!document.querySelector('.wave2-hero-art img'),faqVisible:[...document.querySelectorAll('#questions summary')].length,canonical:document.querySelector('link[rel="canonical"]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,robots:document.querySelector('meta[name="robots"]')?.content,closeColor:getComputedStyle(document.querySelector('.wave2-close h2')).color}));
   const row={slug,width,status:response.status(),...data,errors};results.push(row);
   assert.equal(row.status,200,slug+' HTTP');assert.equal(row.h1.length,1,slug+' H1');assert(row.width<=row.viewport+1,slug+' overflow '+width);assert.equal(row.brokenImages.length,0,slug+' images');assert.equal(row.duplicateIds.length,0,slug+' duplicate IDs');assert.equal(row.anchors.length,0,slug+' anchors');assert(row.shell&&row.call&&row.sourceLinks>=2&&row.heroImage&&row.faqVisible===3,slug+' core');assert.equal(row.canonical,'https://www.pinnacleblooms.org/'+slug);assert(row.og?.includes('pinnacle-pages-assets'));assert.equal(row.robots,'index, follow, max-image-preview:large');assert.equal(row.closeColor,'rgb(255, 255, 255)',slug+' close contrast');assert.equal(errors.length,0,slug+' errors');
   if([390,1440].includes(width)){
    for(const img of await page.locator('img[loading="lazy"]').all()){
     await img.scrollIntoViewIfNeeded();
     await img.evaluate(element=>element.decode().catch(()=>{}));
    }
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(out,`${slug}-${width}.png`),fullPage:true});
    await page.screenshot({path:path.join(out,`${slug}-${width}-first-screen.png`)});
   }
  }
  await page.close();
 }
 await browser.close();
  const report={checkedAt:new Date().toISOString(),base,pages:slugs.length,viewports:[320,390,768,1440],checks:results.length,output:out,results};
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({pages:report.pages,viewports:report.viewports,checks:report.checks,output:out,status:'passed'}));
})().catch(e=>{console.error(e);process.exitCode=1});
