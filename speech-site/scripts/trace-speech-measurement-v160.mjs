import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext();
 const page=await context.newPage();const events=[];
 page.on('request',r=>{const u=new URL(r.url());if(/googletagmanager|google-analytics|analytics.google|doubleclick|googleadservices/.test(u.hostname)||u.pathname.endsWith('/google-ads-call.js'))events.push({host:u.hostname,path:u.pathname,id:u.searchParams.get('id')});});
 await page.goto('https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate',{waitUntil:'networkidle'});
 const before={cookies:(await context.cookies()).map(c=>({name:c.name,domain:c.domain})),commands:await page.evaluate(()=>(window.dataLayer||[]).map(x=>Array.from(x)).filter(x=>['consent','config'].includes(x[0])))};
 const decline=page.locator('[data-measurement-choice="declined"]');
 await decline.evaluate(n=>{let p=n.parentElement;while(p){if(p instanceof HTMLDetailsElement)p.open=true;p=p.parentElement;}});
 const declineAvailable=await decline.isVisible();if(declineAvailable)await decline.click();
 await page.waitForTimeout(1200);
 const after={cookies:(await context.cookies()).map(c=>({name:c.name,domain:c.domain})),commands:await page.evaluate(()=>(window.dataLayer||[]).map(x=>Array.from(x)).filter(x=>['consent','config'].includes(x[0])))};
 const receipt={at:new Date().toISOString(),phase:'V159 before release',events,before,after,declineAvailable,scope:'One clean anonymous browser observation; cookie names only, no personal details, no form submission, no Ads click or conversion.'};
 await fs.writeFile('audits/speech-v160-measurement-observation.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}finally{await browser.close();}
