// Execute real Google libraries while containing every measurement and intake.
// Local fixtures exercise maintained templates; production mode reads actual serving HTML.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from '@playwright/test';
import mime from 'mime';
import {pageManifest} from '../tests/testingbot/page-manifest.mjs';
import {LEGACY_TAGS} from '../deployment/legacy-measurement-fingerprints.mjs';
import {transformReviewedHomepageMeasurement} from '../deployment/pinnacle-route-v12.mjs';
import {migrateLegacyPrefix} from '../deployment/legacy-measurement.mjs';
import {servePublicAdCall} from '../deployment/public-ad-call.mjs';
import {projectVerifyMeasurementHtml} from '../deployment/verify-measurement-handler.mjs';
import {serveContactReceiptAsset} from '../deployment/contact-receipt.mjs';
import callWorker from '../workers/google-ads-call-measurement/index.mjs';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';

const output=path.resolve(process.argv[2]||'../artifacts/measurement-completion-20261020/google-wire.json');
const local=process.argv.includes('--dist'),origin='https://www.pinnacleblooms.org',measurementId='G-2BYLRLFRDJ',helplineId='G-H9CLX1WJ7R';
const centre='/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india';
const contact='/contact-national-autism-helpline-24-7',enrolment='/enroll-autism-speech-aba-therapies-india';
const templates=[
 {path:'/',family:'legacy-home',width:1440,gtm:true,taps:['phone','whatsapp']},
 {path:'/',family:'legacy-home-mobile',width:390,homeMobile:true,gtm:true,taps:['phone']},
 {path:'/best-aba-therapy-center-india-proven-improvement-rate',family:'managed-service',width:390,taps:['phone','whatsapp']},
 {path:contact,family:'durable-contact',width:1440,taps:local?['phone']:['phone','whatsapp']},
 {path:'/centers',family:'centre-directory',width:1440,taps:['phone']},
 {path:centre,family:'centre-detail',width:1440,taps:['phone']},
 {path:enrolment,family:'enrolment',width:390,taps:['phone']},
 {path:'/ask',host:'pinnacleblooms.org',family:'ask-public',width:390,taps:['phone']},
 {path:'/faq',family:'knowledge-public',width:1440,taps:['phone']},
 {path:'/books',family:'commerce-library',width:1440,taps:[]},
 {path:'/verify/evidence/privacy.html',family:'verify-reader',width:1440,id:helplineId,taps:[],automaticMode:false},
 {path:'/certified-courses',family:'retained-gtm-template',width:1440,gtm:true,taps:['phone']},
 {path:'/national-autism-helpline',family:'helpline-separate-stream',width:390,id:helplineId,taps:['phone']}
];
const cspProbe=process.argv.includes('--csp-probe');
if(cspProbe)templates.splice(0,templates.length,
 {path:'/autism-therapy',family:'managed-service-csp',width:390,taps:['phone','whatsapp']},
 {path:'/ask',host:'pinnacleblooms.org',family:'ask-public-csp',width:390,taps:['phone']},
 {path:'/verify/guides/abilityscore.html',family:'verify-reader-csp',width:1440,id:helplineId,taps:[],automaticMode:false},
 {path:'/national-autism-helpline',family:'helpline-csp',width:390,id:helplineId,taps:['phone']});
const primaryCollector=row=>row.transportHost==='analytics.google.com'||row.transportHost?.endsWith('.analytics.google.com')||row.transportHost==='google-analytics.com'||row.transportHost?.endsWith('.google-analytics.com');
const collectorPolicyViolation=row=>/^(?:https?:\/\/)?(?:analytics\.google\.com|[^/]*\.analytics\.google\.com|(?:[^/]*\.)?google-analytics\.com|stats\.g\.doubleclick\.net)(?:\/|$)/.test(row.blockedURI||'');
const manifest=await pageManifest(),scripts=new Map(),fixtures=new Map();
const evidence={schemaVersion:2,at:new Date().toISOString(),mode:local?'built-dist-and-declared-legacy-fixtures':'production',googleSupportCase:'0-6004000041976',googleMeasurementRequestsSent:0,productionIntakes:0,pages:[],scripts:[],requirements:[],inventory:{records:manifest.length,published:manifest.filter(p=>p.published).length,families:[...new Set(manifest.map(p=>p.family))].sort(),representatives:templates.map(p=>({path:p.path,family:p.family})),scope:'Existing page manifest plus representative browser families; not a URL-by-device Cartesian crawl. Unvisited routes rely on named source/inventory assertions, not fresh rendered universal coverage.'}};
const requirement=(id,assertion,pageFamilies,devices=['Chromium'])=>evidence.requirements.push({id,status:'Pass',assertion,pageFamilies,devices,evidencePaths:[output]});
const waitFor=async predicate=>{const deadline=Date.now()+20000;while(Date.now()<deadline){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,50));}throw Error('Timed out waiting for Google collect payload');};
await fs.mkdir(path.dirname(output),{recursive:true});
if(local){
 fixtures.set('/verify/evidence/privacy.html',projectVerifyMeasurementHtml('/verify/evidence/privacy.html',await fs.readFile('../verify-site/dist/evidence/privacy.html','utf8')));
 const controls='<a href="tel:+919100181181" data-cta="hero-call">Call</a><a href="https://wa.me/919100181181" data-cta="hero-whatsapp">WhatsApp</a>';
 const head='<!-- Google Tag Manager -->'+LEGACY_TAGS.join('');
 const raw='<!doctype html><html><head>'+head+'</head><body>'+controls+'</body></html>';
 fixtures.set('/',await(await transformReviewedHomepageMeasurement(new Request(origin+'/'),new Response(raw,{headers:{'content-type':'text/html'}}))).text());
 const mobileBlock=JSON.parse(await fs.readFile('scripts/fixtures/home-mobile-google-block-20261020.json','utf8'));
 const mobileRaw='<!doctype html><html><head><!-- Google Tag Manager -->'+LEGACY_TAGS.find(t=>t.includes('GTM-W9ZHX459'))+'<script>setTimeout(function(){'+mobileBlock+'},4000);</script></head><body>'+controls+'</body></html>';
 fixtures.set('home-mobile',await(await transformReviewedHomepageMeasurement(new Request(origin+'/'),new Response(mobileRaw,{headers:{'content-type':'text/html','cache-control':'no-store'}}))).text());
 const course='<!doctype html><html><head><link rel="canonical" href="'+origin+'/certified-courses">'+LEGACY_TAGS.join('')+'</head><body>'+controls+'</body></html>';
 const migrated=migrateLegacyPrefix(course,new Request(origin+'/certified-courses'),{preserveGtm:true});assert(migrated);fixtures.set('/certified-courses',migrated.html);
 const knowledge=await build({stdin:{contents:"import{createPublicMeasurementWrapper}from'./deployment/public-measurement-wrapper.mjs';export default createPublicMeasurementWrapper({fetch(r,e){return e.ORIGIN.fetch(r)}});",resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const kmf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:knowledge.outputFiles[0].text,serviceBindings:{ORIGIN:request=>new Response('<html><head></head><body data-page-variant="'+(new URL(request.url).pathname==='/ask'?'ask':'knowledge')+'">'+controls+'<details id="website-preferences" data-speech-measurement>Old choice</details><script type="module">import("/ask/_assets/speech-measurement.zFQspfZI.js");import("/ask/_assets/google-ads-call-consent.FqeWzaS9.mjs");</script></body></html>',{headers:{'content-type':'text/html'}})}}));
 try{for(const p of ['/ask','/faq'])fixtures.set(p,await(await kmf.dispatchFetch('https://'+(p==='/ask'?'pinnacleblooms.org':'www.pinnacleblooms.org')+p)).text());}finally{await kmf.dispose();}
 const fixture=await fs.readFile('scripts/fixtures/contact-published-form-20261015.html','utf8');
 const compiled=await build({stdin:{contents:"import{createClearanceWrapper}from'./deployment/shared-clearance.mjs';export default createClearanceWrapper({async fetch(r,e){return e.ORIGIN.fetch(r)}});",resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:compiled.outputFiles[0].text,serviceBindings:{ORIGIN:()=>new Response(fixture,{headers:{'content-type':'text/html'}})}}));
 try{fixtures.set(contact,await(await mf.dispatchFetch(origin+contact)).text());}finally{await mf.dispose();}
}
const browser=await chromium.launch({headless:true});
try{
 for(const spec of templates){
  const pathname=spec.path,id=spec.id||measurementId;
  const context=await browser.newContext({viewport:{width:spec.width,height:844},...(spec.homeMobile?{isMobile:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Version/18.5 Mobile/15E148 Safari/604.1'}:{})}),collect=[],blocked=[],errors=[];
  const entry={pathname,family:spec.family,viewport:{width:spec.width,height:844},source:local&&fixtures.has(pathname)?'declared transformed legacy fixture':local?'built distribution':'actual production HTML',declaredTaps:spec.taps,expectedOwner:spec.gtm?'direct_gtag_with_retained_GTM':'direct_gtag',passed:false,collect,blocked,errors};evidence.pages.push(entry);
  entry.consoleErrors=[];entry.failedRequests=[];
  await context.addInitScript(()=>{window.__pinnacleWirePolicyViolations=[];document.addEventListener('securitypolicyviolation',event=>window.__pinnacleWirePolicyViolations.push({directive:event.effectiveDirective,blockedURI:event.blockedURI,disposition:event.disposition}));});
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(/\/collect$/.test(url.pathname)){
    const common=Object.fromEntries(url.searchParams),body=request.postData()||'';
    for(const line of body.split('\n'))collect.push({...common,...Object.fromEntries(new URLSearchParams(line)),transportHost:url.hostname,transportPath:url.pathname});
    return route.fulfill({status:204,body:''});
   }
   if(url.hostname==='www.googletagmanager.com'&&request.resourceType()==='script'&&request.method()==='GET'){
    if(!scripts.has(url.href))scripts.set(url.href,(async()=>{const response=await fetch(url.href,{signal:AbortSignal.timeout(45000)});assert.equal(response.status,200);const bytes=Buffer.from(await response.arrayBuffer());evidence.scripts.push({url:url.href,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});return bytes;})());
    return route.fulfill({status:200,contentType:'text/javascript',body:await scripts.get(url.href)});
   }
   if(['www.pinnacleblooms.org','pinnacleblooms.org'].includes(url.hostname)&&['GET','HEAD'].includes(request.method())){
    if(!local)return route.continue();
    if(fixtures.has(url.pathname))return route.fulfill({status:200,contentType:'text/html',body:fixtures.get(spec.homeMobile&&url.pathname==='/'?'home-mobile':url.pathname)});
    if(url.pathname==='/pinnacle-pages-scripts/google-ads-call.js'){const r=await callWorker.fetch(new Request(url.href),{});return route.fulfill({status:r.status,contentType:'text/javascript',body:await r.text()});}
    const asset=await serveContactReceiptAsset(new Request(url.href));if(asset)return route.fulfill({status:asset.status,headers:Object.fromEntries(asset.headers),body:await asset.text()});
    const call=servePublicAdCall(new Request(url.href));if(call)return route.fulfill({status:call.status,headers:Object.fromEntries(call.headers),body:await call.text()});
    if(url.pathname==='/api/gl/getkvforwebsite')return route.fulfill({status:200,body:'[]'});
    if(url.pathname==='/national-autism-helpline')return route.fulfill({status:200,contentType:'text/html',body:await fs.readFile('../helpline-site/preview.html')});
    if(url.pathname.includes('phone-analytics.js'))return route.fulfill({status:200,contentType:'text/javascript',body:await fs.readFile('../helpline-site/phone-analytics.js')});
    let relative=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!path.extname(relative))relative+='.html';
    // Scripts use maintained source; HTML/CSS/assets use the exact local build.
    const source=url.pathname.startsWith('/pinnacle-pages-scripts/')?path.resolve('public',url.pathname.slice(1)):path.resolve('dist',relative);
    assert(source.startsWith(path.resolve('public')+path.sep)||source.startsWith(path.resolve('dist')+path.sep));
    const bytes=await fs.readFile(source).catch(()=>null);
    return route.fulfill({status:bytes?200:404,body:bytes||'',contentType:mime.getType(source)||'application/octet-stream'});
   }
   blocked.push({method:request.method(),host:url.hostname,path:url.pathname});
   return route.fulfill({status:request.resourceType()==='script'?200:204,contentType:'text/javascript',body:''});
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')entry.consoleErrors.push(message.text().replace(/https?:\/\/[^\s'"<>]+/g,value=>{try{const u=new URL(value);return u.origin+u.pathname;}catch{return '[url]';}}));});
  page.on('requestfailed',request=>{const u=new URL(request.url());entry.failedRequests.push({origin:u.origin,path:u.pathname,error:request.failure()?.errorText});});
  page.on('response',response=>{if(response.request().isNavigationRequest()&&new URL(response.url()).pathname===pathname)entry.contentSecurityPolicy=response.headers()['content-security-policy']||null;});
  try{
   const query='?utm_source=google&utm_medium=cpc&utm_campaign=isolated_wire_check&unknown_field=discard_me';
   await page.goto('https://'+(spec.host||'www.pinnacleblooms.org')+pathname+query,{waitUntil:'domcontentloaded',timeout:45000});
   await waitFor(()=>collect.some(row=>primaryCollector(row)&&row.tid===id&&row.en==='page_view'));
   await page.evaluate(()=>document.addEventListener('click',event=>{const a=event.target?.closest?.('a[href]');if(a&&/^(?:tel:|https:\/\/(?:wa\.me|api\.whatsapp\.com)\/)/.test(a.href))event.preventDefault();},true));
   for(const tap of spec.taps){
    const selector=tap==='phone'?'a[href="tel:+919100181181"]:visible,a[data-pinnacle-ad-call-target="central"]:visible':'a[href^="https://wa.me/919100181181"]:visible,a[href^="https://api.whatsapp.com/send"][href*="919100181181"]:visible';
    const modal=page.locator('dialog[open]');const scoped=await modal.count()&&await modal.locator(selector).count()?modal.locator(selector):page.locator(selector);await scoped.first().click();await waitFor(()=>collect.some(row=>primaryCollector(row)&&row.tid===id&&row.en===(tap==='phone'?'phone_link_click':'whatsapp_link_click')));
   }
   const allRows=collect.filter(row=>row.tid===id),rows=allRows.filter(primaryCollector),views=rows.filter(row=>row.en==='page_view');
   entry.securityPolicyViolations=await page.evaluate(()=>window.__pinnacleWirePolicyViolations||[]);
   assert.equal(entry.securityPolicyViolations.filter(collectorPolicyViolation).length,0,'Google collector blocked by browser CSP');
   entry.primaryCollectorOrigins=[...new Set(rows.map(row=>'https://'+row.transportHost))];entry.secondaryCollectCount=allRows.length-rows.length;
   if(cspProbe&&pathname==='/autism-therapy')assert(entry.primaryCollectorOrigins.includes('https://analytics.google.com'),'Actual primary analytics apex must reach interception');
   assert.equal(views.length,1,pathname+' duplicate/absent page_view');
   assert.equal(collect.filter(row=>row.tid===(id===helplineId?measurementId:helplineId)&&row.en==='page_view').length,0,'stream scope crossed');
   for(const tap of spec.taps)assert.equal(rows.filter(row=>row.en===(tap==='phone'?'phone_link_click':'whatsapp_link_click')).length,1,pathname+' duplicate/absent '+tap);
   for(const row of allRows.filter(r=>r.en))assert(!JSON.stringify(row).includes('discard_me'),'Unbounded URL value in event');
   if(id===measurementId&&spec.automaticMode!==false)for(const row of rows.filter(r=>['page_view','phone_link_click','whatsapp_link_click'].includes(r.en)))assert.equal(row['ep.measurement_mode'],'automatic');
   entry.passed=true;entry.pageViews=views.length;entry.events=rows.filter(r=>r.en).map(row=>({name:row.en,measurementId:row.tid,page:row.dl,mode:row['ep.measurement_mode'],placement:row['ep.link_placement'],destination:row['ep.destination']}));
   await page.screenshot({path:output.replace(/\.json$/,'')+'-'+(pathname==='/'?'home':pathname.slice(1).replaceAll('/','-'))+'.png',fullPage:false});
  }finally{entry.securityPolicyViolations=await page.evaluate(()=>window.__pinnacleWirePolicyViolations||[]).catch(()=>[]);entry.state=await page.evaluate(()=>({dataLayer:(window.dataLayer||[]).map(row=>row?.event?row:Array.from(row).slice(0,3)),tags:Object.keys(window.google_tag_manager||{}),choiceUI:document.querySelectorAll('[data-measurement-choice],[data-ad-call-choice],[data-speech-measurement]').length})).catch(()=>null);await context.close();}
 }
 requirement('public-template-inventory','Existing TestingBot manifest inventory and explicit maintained representative templates are recorded',evidence.inventory.families);
 requirement('ga4-page-view-once','Each declared eligible initial document emits exactly one decoded page_view to its own measurement ID',templates.map(p=>p.family));
 requirement('ga4-contact-clicks-once','Each declared visible central phone/WhatsApp activation emits its exact canonical event once',templates.filter(p=>p.taps.length).map(p=>p.family));
 if(!cspProbe)requirement('gtm-direct-owner-once','Actual retained Google GTM library executes alongside canonical direct owner; initial page_view remains once',['legacy-home','retained-gtm-template']);
 if(!cspProbe){const contactDir=output.replace(/\.json$/,'')+'-contact';
 execFileSync(process.execPath,['scripts/check-contact-receipt-browser.mjs','--google-wire','--out',contactDir],{cwd:process.cwd(),stdio:'inherit',env:process.env});
 const contract=JSON.parse(await fs.readFile(path.join(contactDir,'browser-proof.json'),'utf8'));assert.equal(contract.executed,7);assert(contract.results.every(r=>r.passed));
 evidence.receiptCases=contract;
 requirement('receipt-accepted-once','Actual Google SDK emits one accepted event only after matching durable-response fixture; duplicate submission remains one',['durable-contact']);
 requirement('receipt-failure-retry-refresh','Rejected/conflict/mismatched/validation responses emit zero; unknown retry preserves request; confirmation refresh adds zero accepted events',['durable-contact']);
 }
 requirement('ga4-primary-csp','Actual GA4 primary collectors reach contained interception, with zero Google-collection CSP violations; console and policy events are recorded',templates.map(p=>p.family));
 requirement('wire-no-pii','Wire assertions exclude canary form values and request/receipt identities; unknown URL values excluded',templates.map(p=>p.family));
 evidence.passed=true;
 console.log(JSON.stringify({passed:true,pages:evidence.pages.length,receiptCases:evidence.receiptCases?.executed||0,output}));
}catch(error){evidence.passed=false;evidence.error=error.stack;throw error;}
finally{await browser.close();await fs.writeFile(output,JSON.stringify(evidence,null,2)+'\n');}
