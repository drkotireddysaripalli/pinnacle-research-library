// Fully local browser check: all requests are intercepted; no intake or analytics traffic.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {chromium} from 'playwright';import {assets} from '../deployment/site-announcement-assets.mjs';
const rows=JSON.parse(fs.readFileSync('tests/fixtures/native-paid-locality-routes-20261017.json')).cases;
const cases=[...new Map(rows.filter(r=>r.classification==='EXACT_CAMPAIGN_ALLOWLIST_SCOPE_GAP').map(r=>[r.centre,r])).values()];
const output=process.argv[2];if(!output)throw Error('Evidence output path required');fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});const results=[];let posts=0,blockedExternal=0;
try{
 for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(request.method()!=='GET'){posts++;return route.abort();}
   if(!['local.pinnacle.test','www.pinnacleblooms.org'].includes(url.hostname)){blockedExternal++;return route.abort();}
   if(url.pathname==='/pinnacle-pages-scripts/enrolment-routing.mjs')return route.fulfill({contentType:'text/javascript',body:assets.routing});
   if(url.pathname==='/pinnacle-pages-scripts/enrolment.js')return route.fulfill({contentType:'text/javascript',body:assets.enrolment});
   const relative=decodeURIComponent(url.pathname).replace(/^\//,'');
   if(relative.includes('..'))return route.abort();
   const file=['dist/'+relative,'dist/'+relative+'.html','public/'+relative].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
   if(!file)return route.abort();
   const mime={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'}[path.extname(file)]||'application/octet-stream';
   return route.fulfill({contentType:mime,body:fs.readFileSync(file)});
  });
  const page=await context.newPage();
  for(const row of cases){
   const paid=new URL(row.url);await page.goto('http://local.pinnacle.test/enroll-autism-speech-aba-therapies-india'+paid.search,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!document.querySelector('#enrol-submit')?.disabled);
   const actual=await page.evaluate(()=>({centre:document.querySelector('#preferred-centre').value,service:document.querySelector('input[name=service]:checked').value,phone:document.querySelector('#enrol-centre-card a[href^="tel:"]')?.getAttribute('href')}));
   assert.deepEqual(actual,{centre:row.centre,service:row.service,phone:'tel:+919100181181'});results.push({width,centre:row.centre,service:row.service,result:'PASS'});
   if(results.length===1||results.length===cases.length+1)await page.screenshot({path:path.join(output,'regional-centre-'+width+'.png'),fullPage:false});
  }
  await context.close();
 }
 assert.equal(posts,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({state:'PASS',browser:'local headless Chromium',checks:results.length,results,posts,blockedExternal,production:false,limitations:'No form submitted, no real call, no live website or receiving acceptance tested.'},null,2)+'\n');
 console.log(JSON.stringify({state:'PASS',checks:results.length,posts,blockedExternal}));
}finally{await browser.close();}
