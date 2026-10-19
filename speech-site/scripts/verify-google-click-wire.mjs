// Run the production Google library, but contain every measurement transport.
// This verifies serialization of real button clicks without recording QA conversions.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import mime from 'mime';

const output=path.resolve(process.argv[2]||'../artifacts/contact-source-live-20261020/google-click-wire.json');
const local=process.argv.includes('--dist'),origin='https://www.pinnacleblooms.org',measurementId='G-2BYLRLFRDJ';
const pages=local?['/best-aba-therapy-center-india-proven-improvement-rate']:['/','/best-aba-therapy-center-india-proven-improvement-rate','/contact-national-autism-helpline-24-7'];
const evidence={at:new Date().toISOString(),mode:local?'built-dist':'production',googleSupportCase:'0-6004000041976',googleMeasurementRequestsSent:0,productionIntakes:0,pages:[],scripts:[]};
const browser=await chromium.launch({headless:true});
const waitFor=async predicate=>{const deadline=Date.now()+20000;while(Date.now()<deadline){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,100));}throw Error('Timed out waiting for Google collect payload');};
try{
 for(const pathname of pages){
  // The legacy homepage/contact header exposes WhatsApp at desktop width;
  // the managed ABA page exposes both controls on mobile.
  const width=pathname==='/best-aba-therapy-center-india-proven-improvement-rate'?390:1440;
  const context=await browser.newContext({viewport:{width,height:844}}),collect=[],blocked=[],errors=[];
  const entry={pathname,viewport:{width,height:844},passed:false,collect,blocked,errors};evidence.pages.push(entry);
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(/\/collect$/.test(url.pathname)){
    const common=Object.fromEntries(url.searchParams),body=request.postData()||'';
    for(const line of body.split('\n'))collect.push({...common,...Object.fromEntries(new URLSearchParams(line)),transportHost:url.hostname,transportPath:url.pathname});
    return route.fulfill({status:204,body:''});
   }
   if(url.hostname==='www.googletagmanager.com'&&request.resourceType()==='script'&&request.method()==='GET'){
    const response=await route.fetch();assert.equal(response.status(),200);
    const bytes=await response.body();evidence.scripts.push({url:url.href,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});
    return route.fulfill({response,body:bytes});
   }
   if(url.origin===origin&&['GET','HEAD'].includes(request.method())){
    if(!local)return route.continue();
    let relative=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!path.extname(relative))relative+='.html';
    const file=path.resolve('dist',relative);assert(file.startsWith(path.resolve('dist')+path.sep));
    const bytes=await fs.readFile(file).catch(()=>null);
    return route.fulfill({status:bytes?200:404,body:bytes||'',contentType:mime.getType(file)||'application/octet-stream'});
   }
   blocked.push({method:request.method(),host:url.hostname,path:url.pathname});
   return route.fulfill({status:request.resourceType()==='script'?200:204,contentType:'text/javascript',body:''});
  });
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto(origin+pathname+'?utm_source=google&utm_medium=cpc&utm_campaign=isolated_wire_check&unknown_field=discard_me',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>typeof window.pinnacleEnquirySource==='function');
   await waitFor(()=>collect.some(row=>row.tid===measurementId&&row.en==='page_view'));
   // Prevent native telephone/WhatsApp navigation, while retaining normal click listeners.
   await page.evaluate(()=>document.addEventListener('click',event=>{const a=event.target?.closest?.('a[href]');if(a&&/^(?:tel:|https:\/\/(?:wa\.me|api\.whatsapp\.com)\/)/.test(a.href))event.preventDefault();},true));
   const phone=page.locator('a[href="tel:+919100181181"]:visible,a[data-pinnacle-ad-call-target="central"]:visible').first();
   await phone.click();
   await waitFor(()=>collect.some(row=>row.tid===measurementId&&row.en==='phone_link_click'));
   const whatsapp=page.locator('a[href^="https://wa.me/919100181181"]:visible,a[href^="https://api.whatsapp.com/send"][href*="919100181181"]:visible').first();
   await whatsapp.click();
   await waitFor(()=>collect.some(row=>row.tid===measurementId&&row.en==='whatsapp_link_click'));
   const events=collect.filter(row=>row.tid===measurementId&&['phone_link_click','whatsapp_link_click'].includes(row.en));
   for(const name of ['phone_link_click','whatsapp_link_click'])assert.equal(events.filter(row=>row.en===name).length,1,pathname+' '+name+' duplicate or absent');
   for(const row of events){assert.equal(row['ep.measurement_mode'],'automatic');assert.deepEqual([...new URL(row.dl).searchParams.keys()].sort(),['utm_campaign','utm_medium','utm_source']);assert(!JSON.stringify(row).includes('discard_me'),'Unbounded URL value in event');}
   entry.passed=true;entry.events=events.map(row=>({name:row.en,measurementId:row.tid,page:row.dl,mode:row['ep.measurement_mode'],placement:row['ep.link_placement'],destination:row['ep.destination'],parameters:row}));
   await fs.mkdir(path.dirname(output),{recursive:true});await page.screenshot({path:output.replace(/\.json$/,'')+'-'+(pathname==='/'?'home':pathname.slice(1))+'.png',fullPage:false});
  }finally{entry.state=await page.evaluate(()=>({dataLayer:(window.dataLayer||[]).map(row=>row?.event?row:Array.from(row).slice(0,3)),tags:Object.keys(window.google_tag_manager||{})})).catch(()=>null);await context.close();}
 }
 evidence.passed=true;
 console.log(JSON.stringify({passed:true,pages:evidence.pages.length,events:evidence.pages.flatMap(page=>page.events.map(event=>event.name)),output}));
}catch(error){evidence.passed=false;evidence.error=error.stack;throw error;}
finally{await browser.close();await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(evidence,null,2)+'\n');}
