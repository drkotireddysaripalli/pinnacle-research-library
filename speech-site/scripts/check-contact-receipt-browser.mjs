// All pages, scripts, intake and analytics transports below are intercepted.
// This never submits a customer, call, OTP, WhatsApp or production conversion.
import fs from'node:fs/promises';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';
import{build}from'esbuild';import{Miniflare,convertV4MiniflareOptions}from'miniflare';import{chromium,firefox,webkit}from'@playwright/test';
import{assets}from'../deployment/shared-assets-repair-assets.mjs';import{servePublicAdCall}from'../deployment/public-ad-call.mjs';import{CONTACT_PATH,CONTACT_TOPICS,isParentContact}from'../public/pinnacle-pages-scripts/contact-options.mjs';
const option=(name,fallback)=>{const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1];};
const googleWire=process.argv.includes('--google-wire'),googleScripts=new Map();
const waitWire=async check=>{const deadline=Date.now()+20000;while(Date.now()<deadline){if(check())return;await new Promise(r=>setTimeout(r,50));}throw Error('Google wire deadline exceeded');};
const styled=process.argv.includes('--styled'),origin='https://www.pinnacleblooms.org',out=option('out','outputs/contact-receipt-20261015'+(styled?'-styled':'')),results=[];await fs.mkdir(out,{recursive:true});
const fixture=await fs.readFile(option('fixture',styled?'ask-private/contact-receipt-20261015/public-before.html':'scripts/fixtures/contact-published-form-20261015.html'),'utf8'),legacy=assets['/pinnacle-pages-scripts/newmirracleportal-0b3284dc5de1efb1.js'];assert(legacy);assert.equal(createHash('sha256').update(legacy.body).digest('hex'),'0b3284dc5de1efb1c5ff12746295b41113d377aa32d7ee8a0936fb5902289214');
const styles=styled?JSON.parse(await fs.readFile(option('styles','ask-private/contact-receipt-20261015/styles.json'),'utf8')):{};
const scriptMap=option('script-map','')?JSON.parse(await fs.readFile(option('script-map'),'utf8')):{};
const entry="import{createClearanceWrapper}from'./deployment/shared-clearance.mjs';export default createClearanceWrapper({async fetch(r,e){return e.ORIGIN.fetch(r)}});";
const compiled=await build({stdin:{contents:entry,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:compiled.outputFiles[0].text,serviceBindings:{ORIGIN:()=>new Response(fixture,{headers:{'content-type':'text/html'}})}}));
try{
 const r=await mf.dispatchFetch(origin+CONTACT_PATH);const publishedStyledFixture=styled&&fixture.includes('data-contact-contract="durable-contact-v1"');if(!publishedStyledFixture)assert.equal(r.headers.get('x-pinnacle-contact-receipt'),'durable-contact-v1');const html=await r.text();assert(html.includes('data-contact-contract="durable-contact-v1"'));await fs.writeFile(out+'/isolated-transformed.html',html);
 assert(!html.includes('GTM-W9ZHX459'));assert(!html.includes('class="cm-button-enroll contact-form-submit"'));assert(html.includes('action="/api/enrolment"'));assert(html.includes('data-contact-submit'));assert(html.includes('speech-measurement.js?v=measurement-completion-20261020'));
 for(const [engine,launcher]of Object.entries(googleWire||process.platform==='win32'?{chromium}:{chromium,firefox,webkit})){
  const browser=await launcher.launch({headless:true});
  try{for(const width of(option('width','')?[Number(option('width'))]:(googleWire?[390]:[390,1440]))){
   const cases=[...CONTACT_TOPICS.map(topic=>({name:'topic-'+CONTACT_TOPICS.indexOf(topic),topic,mode:'accepted'})),{name:'validation',mode:'validation'},{name:'rejected',mode:'rejected'},{name:'conflict',mode:'conflict'},{name:'mismatched-receipt',mode:'mismatch'},{name:'unknown-retry',mode:'unknown-retry'},{name:'accepted-reload',mode:'reload'},{name:'no-script',mode:'no-script'},{name:'automatic-source-with-legacy-accepted',mode:'accepted',consent:'accepted'},{name:'automatic-source-with-legacy-declined',mode:'accepted',consent:'declined'},{name:'automatic-source-with-gpc',mode:'accepted',gpc:true}].filter(c=>(!styled||['topic-1','validation','unknown-retry'].includes(c.name))&&(!googleWire||['topic-1','rejected','conflict','mismatched-receipt','unknown-retry','accepted-reload','validation'].includes(c.name))); 
   for(const c of cases){
    const context=await browser.newContext({viewport:{width,height:900},...(option('ua','')?{userAgent:option('ua')}:{})}),requests=[],errors=[],intakes=new Map(),collect=[];let legacyPosts=0;
    await context.addInitScript(({consent,gpc})=>{window.__contactQa=[];window.__contactScriptErrors=[];window.addEventListener('error',e=>window.__contactScriptErrors.push({message:e.message,file:e.filename,line:e.lineno,column:e.colno}));for(const name of['pinnacle:contact-accepted','pinnacle:enquiry-accepted'])document.addEventListener(name,()=>window.__contactQa.push(name));if(gpc)Object.defineProperty(navigator,'globalPrivacyControl',{value:true});if(consent)localStorage.setItem('pinnacle-speech-analytics-v1',JSON.stringify({value:consent,at:Date.now()}));localStorage.setItem('pinnacle-enquiry-source-v1',JSON.stringify({schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:'/centers',fields:{utm_source:'google',utm_medium:'cpc',utm_campaign:'isolated_fixture'}}));},{consent:c.consent,gpc:c.gpc});
    await context.route('**/*',async route=>{
     const req=route.request(),u=new URL(req.url());
     if(googleWire&&/\/collect$/.test(u.pathname)){
      const common=Object.fromEntries(u.searchParams);for(const line of(req.postData()||'').split('\n'))collect.push({...common,...Object.fromEntries(new URLSearchParams(line))});
      return route.fulfill({status:204,body:''});
     }
     if(googleWire&&u.hostname==='www.googletagmanager.com'&&req.resourceType()==='script'&&req.method()==='GET'){
      if(!googleScripts.has(u.href))googleScripts.set(u.href,(async()=>{const r=await fetch(u.href,{signal:AbortSignal.timeout(45000)});assert.equal(r.status,200);return Buffer.from(await r.arrayBuffer());})());
      return route.fulfill({status:200,contentType:'text/javascript',body:await googleScripts.get(u.href)});
     }

     if(scriptMap[u.href]){const s=scriptMap[u.href],body=await fs.readFile(s.file,'utf8');assert.equal(createHash('sha256').update(body).digest('hex'),s.sha256);return route.fulfill({status:200,contentType:'text/javascript',body});}
     if(styles[u.href]){const s=styles[u.href],body=await fs.readFile(s.file,'utf8');assert.equal(createHash('sha256').update(body).digest('hex'),s.sha256);return route.fulfill({status:200,contentType:'text/css',body});}
     if(u.origin===origin&&u.pathname===CONTACT_PATH)return route.fulfill({status:200,contentType:'text/html',body:html});
     if(u.origin===origin&&u.pathname==='/api/enrolment'&&req.method()==='POST'){
      const p=req.postDataJSON();requests.push(p);if(!intakes.has(p.requestId))intakes.set(p.requestId,p);
      if(c.mode==='rejected')return route.fulfill({status:422,json:{status:'rejected'}});
      if(c.mode==='conflict')return route.fulfill({status:409,json:{status:'rejected'}});
      if(c.mode==='unknown-retry'&&requests.length===1)return route.fulfill({status:502,json:{status:'unknown'}});
      return route.fulfill({status:202,json:{status:'accepted',receipt:{schemaVersion:1,requestId:c.mode==='mismatch'?'wrong-fixture-request':p.requestId,id:'qa-contact-receipt'}}});
     }
     if(u.pathname.endsWith('/api/gl/swfs')||/d1(?:send|validate)otp/i.test(u.pathname)){legacyPosts++;return route.fulfill({status:422,json:{status:'rejected'}});}
     if(u.origin===origin&&u.pathname==='/api/gl/getkvforwebsite')return route.fulfill({status:200,contentType:'text/plain',body:'[]'});
     if(u.origin===origin){
      if(c.mode==='no-script'&&u.pathname.endsWith('/contact-receipt.js'))return route.fulfill({status:200,contentType:'text/javascript',body:''});
      const call=servePublicAdCall(new Request(u.href));if(call)return route.fulfill({status:call.status,contentType:'text/javascript',body:await call.text()});
      if(assets[u.pathname])return route.fulfill({status:200,contentType:'text/javascript',body:assets[u.pathname].body});
      if(/^\/pinnacle-pages-scripts\/[a-z0-9-]+\.(?:js|mjs)$/.test(u.pathname))try{return route.fulfill({status:200,contentType:'text/javascript',body:await fs.readFile(path.join('public',u.pathname),'utf8')});}catch{}
     }
     // Read-only bootstrap and optional external vendors never leave fixture.
     return route.fulfill({status:200,contentType:'text/javascript',body:''});
    });
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    try{
     await page.goto(origin+CONTACT_PATH);await page.waitForFunction(()=>!!window.jQuery);
     const button=page.locator('[data-contact-submit]');
     if(googleWire)await waitWire(()=>collect.some(r=>r.tid==='G-2BYLRLFRDJ'&&r.en==='page_view'));
     if(c.mode==='no-script'){assert(await button.isDisabled());assert(await page.locator('#contact-form-name').isDisabled());assert.equal(requests.length,0);}
     else{
      await page.waitForFunction(()=>document.querySelector('#pinnacle-contact')?.dataset.contactClientReady==='true');
      if(c.mode!=='validation'){
       await page.locator('#contact-form-title').selectOption('Mx');await page.locator('#contact-form-name').fill('ISOLATED FIXTURE');await page.locator('#contact-form-email').fill('fixture@example.invalid');await page.locator('#contact-form-mobile').fill('0000000000');await page.locator('#contact-for').selectOption(c.topic||'Therapy Services');await page.locator('#facility-for').selectOption('9353254801');await page.locator('#contact-form-message').fill('Isolated test only. No production intake.');
      }
      if(c.mode==='validation')await button.click();
      else if(c.name==='topic-1')await page.locator('#contact-form-mobile').press('Enter');
      else if(c.mode==='reload')await button.evaluate(el=>{el.click();el.click();});
      else await button.click();
      if(c.mode==='validation'){await page.locator('#pinnacle-contact-errors').waitFor({state:'visible'});assert.equal(requests.length,0);}
      else{
       await page.waitForFunction(()=>!document.querySelector('#pinnacle-contact')?.getAttribute('aria-busy')||document.querySelector('#pinnacle-contact').getAttribute('aria-busy')==='false');
       await page.waitForFunction(()=>/received|not accepted|could not|couldn't|confirm receipt|awaiting confirmation/i.test(document.querySelector('#pinnacle-contact-status')?.textContent||''));
       if(c.mode==='unknown-retry'){if(styled)await page.locator('#pinnacle-contact').screenshot({path:out+'/'+engine+'-'+width+'-unknown-before-retry.png'});await page.getByRole('button',{name:'Retry the same request'}).click();await page.waitForFunction(()=>document.querySelector('[data-contact-submit]').textContent==='Message received');assert.equal(requests.length,2);assert.equal(JSON.stringify(requests[0]),JSON.stringify(requests[1]));}
       else assert.equal(requests.length,1);
       assert.equal(legacyPosts,0);assert.equal(intakes.size,1);
       const accepted=!['rejected','conflict','mismatch'].includes(c.mode),topic=c.topic||'Therapy Services';
       const events=await page.evaluate(()=>window.__contactQa);assert.equal(events.filter(x=>x==='pinnacle:contact-accepted').length,accepted?1:0);assert.equal(events.filter(x=>x==='pinnacle:enquiry-accepted').length,accepted&&isParentContact(topic)?1:0);
       if(!accepted){assert.equal(await page.locator('#contact-form-name').inputValue(),'ISOLATED FIXTURE');assert(!/Thank you/.test(await page.locator('#pinnacle-contact-status').innerText()));}
       const p=requests[0];assert.equal(p.formType,'contact');assert.equal(p.source.page,CONTACT_PATH);assert.equal(p.source.acquisition?.fields.utm_campaign,'isolated_fixture');
       const ga=await page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'&&x[1]==='enquiry_accepted'));
       assert.equal(ga.length,accepted&&isParentContact(topic)?1:0);
       assert(!JSON.stringify(ga).includes('ISOLATED'));assert(!JSON.stringify(ga).includes('qa-contact'));assert(!JSON.stringify(ga).includes('fixture@example'));
       if(googleWire){
        if(accepted&&isParentContact(topic))await waitWire(()=>collect.some(r=>r.tid==='G-2BYLRLFRDJ'&&r.en==='enquiry_accepted'));
        // A normal, contained tap flushes later queued SDK events for negative cases.
        await page.evaluate(()=>document.addEventListener('click',e=>{if(e.target?.closest?.('a[href^="tel:"]'))e.preventDefault();},true));
        await page.locator('a[href="tel:+919100181181"]:visible').first().click();
        await waitWire(()=>collect.some(r=>r.tid==='G-2BYLRLFRDJ'&&r.en==='phone_link_click'));
        const emitted=collect.filter(r=>r.tid==='G-2BYLRLFRDJ'&&r.en==='enquiry_accepted');
        assert.equal(emitted.length,accepted&&isParentContact(topic)?1:0,c.name+' actual Google accepted payload');
        for(const row of emitted){assert.equal(row['ep.measurement_mode'],'automatic');assert.equal(row.cn||row['ep.campaign_name'],'isolated_fixture');}
        const all=JSON.stringify(collect);for(const value of ['ISOLATED FIXTURE','fixture@example.invalid','qa-contact-receipt','Isolated test only.','0000000000'])assert(!all.includes(value),'PII or fixture identity leaked to Google payload');
       }
       if(c.mode==='reload'){await page.reload();await page.waitForFunction(()=>document.querySelector('[data-contact-submit]')?.textContent==='Message received');assert.equal(requests.length,1);assert.deepEqual(await page.evaluate(()=>window.__contactQa),[]);if(googleWire){await waitWire(()=>collect.filter(r=>r.tid==='G-2BYLRLFRDJ'&&r.en==='page_view').length>=2);assert.equal(collect.filter(r=>r.tid==='G-2BYLRLFRDJ'&&r.en==='enquiry_accepted').length,1,'refresh must not re-emit accepted receipt');}}
      }
     }
     assert.deepEqual(errors,[]);
     if(styled){assert.equal(await page.locator('.simple-marquee-container,.cm-mirracle-go-top').count(),0);assert(!await page.getByText('Preparing Request...',{exact:true}).isVisible());const geometry=await page.locator('#pinnacle-contact').evaluate(form=>({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,fixed:[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed'&&e.getBoundingClientRect().height>0).map(e=>({id:e.id,tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,top:e.getBoundingClientRect().top,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,text:e.textContent.trim().slice(0,70)})),fields:[...form.querySelectorAll('input:not([type="submit"]),select,textarea,button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({id:e.id||e.textContent.trim().slice(0,25),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))}));assert(geometry.pageWidth<=width+1,JSON.stringify(geometry));for(const f of geometry.fields)assert(f.left>=-1&&f.right<=width+1,JSON.stringify(f));await fs.writeFile(out+'/'+engine+'-'+width+'-'+c.name+'-geometry.json',JSON.stringify(geometry,null,2));await page.locator('#pinnacle-contact').screenshot({path:out+'/'+engine+'-'+width+'-'+c.name+'.png'});}
     else if(['topic-1','unknown-retry','no-script'].includes(c.name))await page.screenshot({path:out+'/'+engine+'-'+width+'-'+c.name+'.png',fullPage:true});
     const actualViewport=await page.evaluate(()=>({width:innerWidth,height:innerHeight}));assert.equal(actualViewport.width,width);
     results.push({browser:engine,browserVersion:browser.version(),operatingSystem:process.platform,width,actualViewport,case:c.name,passed:true,posts:requests.length,uniqueFixtureIntakes:intakes.size,legacyPosts,...(googleWire?{wire:collect.filter(r=>r.tid==='G-2BYLRLFRDJ').map(r=>({event:r.en,mode:r['ep.measurement_mode']})),collectionDelivered:0}: {})});
    }catch(error){await fs.writeFile(out+'/failure.json',JSON.stringify({browser:engine,width,case:c.name,error:error.message,errors,scriptErrors:await page.evaluate(()=>window.__contactScriptErrors),posts:requests.length,legacyPosts},null,2));await page.screenshot({path:out+'/failure.png',fullPage:true});throw error;}finally{await context.close();}
   }
  }}finally{await browser.close();}
 }
}finally{await mf.dispose();await fs.writeFile(out+'/browser-proof.json',JSON.stringify({results,executed:results.length,realIntakes:0,realCalls:0,realOTPs:0,externalAnalyticsIntercepted:true,googleLibraryFetched:googleWire,measurementRequestsDelivered:0,visualApproval:'not assessed by these functional fixtures'},null,2)+'\n');}
console.log(JSON.stringify({passed:results.length,realIntakes:0,realCalls:0,realOTPs:0}));
