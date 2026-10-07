import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const root='../../website-completion-20261007',origin='https://mirracle.pinnacleblooms.org';
const cases=[{name:'no-choice',gpc:false},{name:'GPC',gpc:true},{name:'prior-accepted',gpc:false,choice:'granted'},{name:'prior-refused',gpc:false,choice:'denied'}];
const browser=await chromium.launch(),results=[];
try{for(const fixture of cases){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await ctx.addInitScript(({gpc,choice})=>{Object.defineProperty(navigator,'globalPrivacyControl',{get:()=>gpc});if(choice)for(const key of ['pinnacle-speech-analytics-v1','pinnacle-cheq-consent-v1'])localStorage.setItem(key,JSON.stringify({value:choice,at:Date.now()}));},fixture);
 const attempts=[];await ctx.route('**/*',r=>{const q=r.request(),u=new URL(q.url());const telemetry=/google-analytics|analytics\.google|cloudflareinsights|sentry|aseasky/.test(u.hostname);if(telemetry)attempts.push({host:u.hostname,path:u.pathname,method:q.method(),inventedPrivateMarker:/INVENTED_QA/.test(q.postData()||q.url())});if(telemetry||q.method()!=='GET'||/psapi\.|\/api\//.test(q.url()))return r.abort();return r.continue();});
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const r=await p.goto(origin+'/private/INVENTED_QA_REPORT?child=INVENTED_QA_CHILD',{waitUntil:'domcontentloaded',referer:origin+'/private/INVENTED_QA_REFERRER',timeout:60000});
 await p.waitForTimeout(2500);
 const state=await p.evaluate(()=>({route:location.pathname,main:[...document.scripts].map(s=>s.src).find(s=>s.includes('main.c607521b')),beacons:[...document.scripts].filter(s=>/cloudflareinsights/.test(s.src)).length,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,hero:[...document.images].find(i=>i.src.includes('sanjeevani-2'))?.outerHTML,bodyText:document.body.innerText.slice(0,500)}));
 assert.equal(state.beacons,0);assert(state.main?.includes('privacy-20261007'));assert.equal(attempts.length,0,'No measurement collector may load or receive private route data');assert(state.scrollWidth<=390);assert(state.bodyText.trim().length>20);
 const row={...fixture,status:r.status(),privacyHeader:r.headers()['x-pinnacle-app-privacy'],state,telemetryAttempts:attempts,errors};
 if(fixture.name==='GPC')await p.screenshot({path:root+'/mirracle-privacy-after-390.png'});
 await p.goto(origin+'/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(800);assert.equal(attempts.length,0,'Returning navigation stays free of telemetry');row.returningNavigation='passed';results.push(row);await ctx.close();
 console.log(JSON.stringify({case:fixture.name,status:row.status,telemetryAttempts:attempts.length,returningNavigation:row.returningNavigation}));
}}finally{await browser.close();await fs.writeFile(root+'/mirracle-privacy-after.json',JSON.stringify({at:new Date().toISOString(),scope:'Invented public-sign-in fixture; all writes, data APIs and telemetry aborted; no customer record or sign-in submitted. Portal prior-choice storage fixtures are ignored by this app, whose measurement is disabled for every case.',results},null,2));}
