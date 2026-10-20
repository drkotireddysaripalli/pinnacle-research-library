import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {PUBLIC_AD_CALL_PATH,publicAdCallPage,servePublicAdCall} from '../deployment/public-ad-call.mjs';
import {augmentCsp} from '../src/lib/ad-call-csp.mjs';

test('automatic call measurement extends only the necessary CSP directives',()=>{
 const headers=new Headers({'content-security-policy':"default-src 'self'; script-src 'self' https://www.googletagmanager.com; script-src-elem 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; object-src 'none'"});
 augmentCsp(headers);const csp=headers.get('content-security-policy');
 for(const directive of ['script-src','script-src-elem','connect-src'])assert(csp.split(';').find(x=>x.trim().startsWith(directive+' ')).includes('https://www.googleadservices.com'));
 const images=csp.split(';').find(x=>x.trim().startsWith('img-src ')).trim().split(/\s+/).slice(1);
 assert(images.includes('https://www.googletagmanager.com'));
 assert(!images.some(x=>x.includes('*')));
 assert(csp.includes("object-src 'none'"));assert(csp.includes('https://www.youtube-nocookie.com'));assert(!csp.includes("default-src *"));assert(!csp.includes('unsafe-eval'));
 const before=csp;augmentCsp(headers);assert.equal(headers.get('content-security-policy'),before);
 const connections=csp.split(';').find(x=>x.trim().startsWith('connect-src ')).trim().split(/\s+/);
 for(const host of ['https://analytics.google.com','https://stats.g.doubleclick.net'])assert(connections.includes(host));
});

test('browser policy blocks the old analytics apex and permits only the repaired contained collector probes',async()=>{
 const {chromium}=await import('@playwright/test');const browser=await chromium.launch({headless:true});
 const endpoints=['https://analytics.google.com/g/collect','https://stats.g.doubleclick.net/g/collect'];
 try{for(const repaired of [false,true]){
  const context=await browser.newContext(),received=[],violations=[],consoleErrors=[];
  const headers=new Headers({'content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com"});if(repaired)augmentCsp(headers);
  await context.exposeBinding('recordPolicyViolation',(_,value)=>violations.push(value));
  await context.addInitScript(()=>document.addEventListener('securitypolicyviolation',e=>window.recordPolicyViolation({directive:e.effectiveDirective,blockedURI:e.blockedURI})));
  await context.route('**/*',route=>{const req=route.request();if(endpoints.some(u=>req.url().startsWith(u))){received.push(new URL(req.url()).origin);return route.fulfill({status:204,body:''});}return route.fulfill({status:200,headers:Object.fromEntries(headers),contentType:'text/html',body:'<script>window.probes=Promise.allSettled('+JSON.stringify(endpoints)+'.map(url=>fetch(url,{method:"POST",body:"contained-csp-probe",mode:"no-cors"}))).then(()=>window.probesDone=true)</script>'});});
  const page=await context.newPage();page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text());});
  await page.goto('https://www.pinnacleblooms.org/autism-therapy');await page.waitForFunction(()=>window.probesDone);await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));
  if(repaired){assert.deepEqual(received.sort(),endpoints.map(u=>new URL(u).origin).sort());assert.equal(violations.length,0);assert.equal(consoleErrors.length,0);}
  else{assert.equal(received.length,0);assert.equal(violations.filter(v=>v.directive==='connect-src').length,2);assert(consoleErrors.some(v=>v.includes('Content Security Policy')));}
  await context.close();
 }}finally{await browser.close();}
});
test('active CSP builders and generated helpline retain the exact supported collection destinations',async()=>{
 for(const file of ['speech-handler.mjs','book-attribution-handler.mjs','first-conversation-handler.mjs','seva-handler.mjs']){
  const source=await fs.readFile(new URL('../deployment/'+file,import.meta.url),'utf8');
  for(const host of ['https://analytics.google.com','https://stats.g.doubleclick.net'])assert(source.includes(host),file+' missing '+host);
 }
 const source=await fs.readFile(new URL('../src/lib/ad-call-csp.mjs',import.meta.url),'utf8');assert.equal(await fs.readFile(new URL('../deployment/ad-call-csp.mjs',import.meta.url),'utf8'),'// Generated from src/lib/ad-call-csp.mjs.\n'+source);
 const {default:helpline}=await import('../../helpline-site/worker.mjs');const response=await helpline.fetch(new Request('https://www.pinnacleblooms.org/national-autism-helpline'));
 const csp=response.headers.get('content-security-policy'),connect=csp.split(';').find(p=>p.trim().startsWith('connect-src '));
 for(const host of ['https://analytics.google.com/g/collect','https://stats.g.doubleclick.net/g/collect'])assert(connect.split(/\s+/).includes(host));
 assert(csp.includes("default-src 'none'"));assert(!csp.includes('unsafe-eval'));assert(!connect.includes('*'));
});

test('current public centre register and paid templates share one current module; private endpoints stay excluded',async()=>{
 const centres=JSON.parse(await fs.readFile('src/data/centre-register.json','utf8')).centres;
 for(const centre of centres)assert(publicAdCallPage(new URL(centre.profileUrl).pathname));
 for(const path of ['/centers','/speech-aba-autism-assessments','/enroll-autism-speech-aba-therapies-india','/best-aba-therapy-center-india-proven-improvement-rate'])assert(publicAdCallPage(path));
 for(const path of ['/api/enrolment','/shop/cart','/ask/account','/private/record','/reports/example'])assert.equal(publicAdCallPage(path),false);
 const url='https://www.pinnacleblooms.org'+PUBLIC_AD_CALL_PATH;
 assert.equal(await servePublicAdCall(new Request(url)).text(),await fs.readFile('src/lib/google-ads-call-consent.mjs','utf8'));
 assert.equal(await servePublicAdCall(new Request(url,{method:'HEAD'})).text(),'');
 assert.equal(servePublicAdCall(new Request(url,{method:'POST'})).status,405);
 assert.equal(servePublicAdCall(new Request('https://other.example'+PUBLIC_AD_CALL_PATH)),null);
});

test('deployed HTML transform replaces stale modules once without adding visitor controls',async()=>{
 const html='<html><head><title>Keep</title><script type="module" src="/pinnacle-pages-assets/google-ads-call-consent.CycsBYjf.mjs"></script></head><body><main>Keep family story <a href="tel:+919100181181">9100 181 181</a></main><footer>Keep footer</footer></body></html>';
 const output=await build({stdin:{contents:`import {repairSharedNavigation} from './deployment/shared-navigation.mjs';export default{fetch(r){const u=new URL(r.url),html=${JSON.stringify(html)}.replace(u.searchParams.has('legacy')?' type="module" src="/pinnacle-pages-assets/google-ads-call-consent.CycsBYjf.mjs"':'REMOVE-NOTHING','');const response=new Response(html,{headers:{'content-type':u.searchParams.has('json')?'application/json':'text/html','cache-control':u.searchParams.has('private')?'private, no-store':'public,max-age=300'}});return repairSharedNavigation(r,repairSharedNavigation(r,response));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:output.outputFiles[0].text,compatibilityDate:'2026-10-04'}));
 try{
  for(const query of ['','?legacy','?private']){const response=await mf.dispatchFetch('https://www.pinnacleblooms.org/centers'+query),result=await response.text();assert.equal((result.match(new RegExp(PUBLIC_AD_CALL_PATH,'g'))||[]).length,1);assert.equal((result.match(/data-ad-call-preferences/g)||[]).length,0);assert(result.includes('<main>Keep family story <a href="tel:+919100181181">9100 181 181</a></main><footer>Keep footer</footer>'));if(query==='?private')assert.equal(response.headers.get('cache-control'),'private, no-store');}
  const json=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/centers?json')).text();assert.equal(json,html);
  const unrelated=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/ask/account')).text();assert(unrelated.includes('google-ads-call-consent.CycsBYjf.mjs'));assert(!unrelated.includes(PUBLIC_AD_CALL_PATH));assert(!unrelated.includes('data-ad-call-preferences'));
 }finally{await mf.dispose();}
});
