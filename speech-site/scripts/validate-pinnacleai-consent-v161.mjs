// Read-only production interaction: exercise privacy choices, never a lead or call.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true}),rows=[];
try{
  for(const state of ['declined','gpc']){
    const context=await browser.newContext({viewport:{width:390,height:844}});
    if(state==='gpc')await context.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{get:()=>true}));
    const page=await context.newPage(),requests=[];
    page.on('request',r=>{if(/google-analytics|googletagmanager|doubleclick|googleadservices/.test(r.url()))requests.push(new URL(r.url()).hostname);});
    await page.goto('https://www.pinnacleblooms.org/pinnacleai',{waitUntil:'load'});
    if(state==='declined'){
      await page.locator('#website-preferences > summary').click();
      await page.locator('[data-measurement-choice="declined"]').first().click();
    }
    const call=page.locator('[data-wave-module="pinnacleai"] [data-cta="pinnacleai-call"]');
    assert.equal(await call.getAttribute('href'),'tel:+919100181181');
    assert.equal(await page.locator('.wave2-hero-detail [data-cta="final-enquiry"]').getAttribute('href'),'https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india');
    assert(await page.locator('.overview-module-links a').count()===8);
    assert.deepEqual(requests,[]);
    const cookies=(await context.cookies()).filter(c=>/^(?:_ga|ps|_gcl_|test_cookie)/.test(c.name)).map(c=>c.name);
    assert.deepEqual(cookies,[]);
    rows.push({state,optionalMeasurementRequests:requests,measurementCookies:cookies,callAndEnquiryLinks:true,moduleLinks:8,noLeadSubmitted:true});
    await context.close();
  }
  await fs.writeFile('deployment/pinnacleai-v161-consent-20261001.json',JSON.stringify({at:new Date().toISOString(),rows},null,2)+'\n');
  console.log(JSON.stringify({passed:true,states:rows.map(r=>r.state)}));
}finally{await browser.close();}
