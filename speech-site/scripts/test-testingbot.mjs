// Unattended physical-device and hosted desktop-browser checks. No leads or calls.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {measurePinnacleLifecycle} from '../tests/browser/pinnacle-lifecycle-contract.mjs';

const target = new URL(process.env.TESTINGBOT_URL || 'https://www.pinnacleblooms.org/pinnacleai');
const isAsk=target.hostname==='pinnacleblooms.org' && /^\/ask(?:\/|$)/.test(target.pathname);
if (target.protocol !== 'https:' || !(target.hostname==='www.pinnacleblooms.org'||isAsk) || target.search) throw new Error('Use a public canonical Pinnacle URL without query parameters');
let key=process.env.TESTINGBOT_KEY, secret=process.env.TESTINGBOT_SECRET;
if (!key || !secret) {
  const credentialFile=path.join(os.homedir(),'.testingbot','pinnacle-credentials.clixml');
  const ps="$c=Import-Clixml -LiteralPath '"+credentialFile.replaceAll("'","''")+"'; @{key=$c.UserName;secret=$c.GetNetworkCredential().Password}|ConvertTo-Json -Compress";
  const creds=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','ignore']}));
  ({key,secret}=creds);
}
const authorization='Basic '+Buffer.from(key+':'+secret).toString('base64');
const redact=text=>String(text).replaceAll(key,'[redacted]').replaceAll(secret,'[redacted]').replaceAll(authorization,'[redacted]');
async function request(url,method='GET',body,timeout=45000){
  const form=body instanceof URLSearchParams;
  const response=await fetch(url,{method,headers:{Authorization:authorization,...(body?{'Content-Type':form?'application/x-www-form-urlencoded':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(timeout),redirect:'error'});
  const data=await response.json();
  if(!response.ok || data.value?.error)throw new Error(redact(data.value?.message || data.error || JSON.stringify(data)).slice(0,1600));
  return data;
}
const api=(suffix,method,body)=>request('https://api.testingbot.com/v1'+suffix,method,body);
const account=await api('/user');
const desktop=process.argv.includes('--desktop');
const report={startedAt:new Date().toISOString(),mode:desktop?'hosted-desktop':'physical-mobile',target:target.href,account:{plan:account.plan,seconds:account.seconds,maxDesktop:account.max_concurrent,maxPhysical:account.max_concurrent_mobile},sessions:[],noLeadSubmitted:true,noCallInitiated:true};
report.runnerSha256=createHash('sha256').update(await fs.readFile(new URL(import.meta.url))).digest('hex');
const delivered=await fetch(target,{signal:AbortSignal.timeout(30000)});
if(!delivered.ok)throw new Error('Target returned HTTP '+delivered.status);
report.delivery={url:delivered.url,htmlSha256:createHash('sha256').update(await delivered.text()).digest('hex'),etag:delivered.headers.get('etag'),checkedAt:new Date().toISOString()};
const out='audits/testingbot/'+report.startedAt.replace(/[:.]/g,'-');
await fs.mkdir(out,{recursive:true});
const save=()=>fs.writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({account:report.account,report:out+'/report.json'}));
// Pin the release matrix to catalogue versions; update deliberately when coverage changes.
const desktopMatrix=[
  {id:'safari',name:'Safari',browserName:'safari',platform_name:'TAHOE',version:'26',catalogueId:7613},
  {id:'chrome',name:'Chrome',browserName:'chrome',platform_name:'WIN11',version:'153',catalogueId:31412},
  {id:'edge',name:'Edge',browserName:'MicrosoftEdge',platform_name:'WIN11',version:'153',catalogueId:31502},
  {id:'firefox',name:'Firefox',browserName:'firefox',platform_name:'WIN11',version:'155',catalogueId:31556}
];
let choices,devices;
if(desktop){
  choices=process.env.TESTINGBOT_BROWSERS?.split(',').map(s=>s.trim())||desktopMatrix.map(d=>d.id);
  if(!choices.length || choices.some(id=>!desktopMatrix.some(d=>d.id===id)))throw new Error('Unknown TESTINGBOT_BROWSERS entry');
  const catalogue=await api('/browsers');
  devices=desktopMatrix.filter(d=>catalogue.some(c=>Number(c.browser_id)===d.catalogueId && c.platform===d.platform_name && c.version===d.version));
}else{
  choices=process.env.TESTINGBOT_DEVICE_IDS?.split(',').map(Number)||[22,29];
  devices=await api('/devices/available');
}
for(const id of choices){
  const device=devices.find(d=>d.id===id);
  if(!device){report.sessions.push({requestedId:id,status:'unavailable'});continue;}
  const row={kind:report.mode,device:{id:device.id,name:device.name,platform:device.platform_name,version:device.version},status:'starting',checks:[],screenshots:[]};
  report.sessions.push(row);await save();
  let sessionId;
  const wd=async(suffix,method='GET',body)=>{
    const data=await request('https://hub.testingbot.com/wd/hub/session/'+sessionId+suffix,method,body);
    return data.value;
  };
  const evaluate=(script,...args)=>wd('/execute/sync','POST',{script,args});
  const visible=selector=>evaluate("const e=document.querySelector(arguments[0]);return !!e && e.getBoundingClientRect().width>0 && e.getBoundingClientRect().height>0",selector);
  const click=async selector=>{
    // WebDriver's default bottom alignment can put controls under the fixed call bar.
    // Scroll into the usable centre, then use a genuine WebDriver click (never JS click).
    await evaluate("document.querySelector(arguments[0])?.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});return true",selector);
    const el=await wd('/element','POST',{using:'css selector',value:selector});
    await wd('/element/'+el['element-6066-11e4-a52e-4f735466cecf']+'/click','POST',{});
  };
  const check=async(name,fn)=>{
    try{const value=await fn();if(!value)throw new Error('Assertion was false');row.checks.push({name,passed:true});}
    catch(e){row.checks.push({name,passed:false,error:redact(e.message)});}
  };
  const screenshot=async name=>{
    // Let physical Safari/Chrome finish painting after a scroll before capture.
    await new Promise(resolve=>setTimeout(resolve,750));
    const bytes=await wd('/screenshot');const file=device.id+'-'+name+'.png';
    await fs.writeFile(out+'/'+file,Buffer.from(bytes,'base64'));row.screenshots.push(file);
  };
  try{
    console.log('Starting '+report.mode+' '+device.name+' '+device.version);
    const browserOptions=desktop?{browserName:device.browserName,browserVersion:device.version}:{browserName:device.platform_name==='iOS'?'safari':'chrome','appium:automationName':device.platform_name==='iOS'?'XCUITest':'UiAutomator2','appium:deviceName':device.name,'appium:platformVersion':device.version,'appium:newCommandTimeout':60};
    const created=await request('https://hub.testingbot.com/wd/hub/session','POST',{capabilities:{alwaysMatch:{platformName:device.platform_name,...browserOptions,'tb:options':{...(desktop?{'screen-resolution':'1920x1080'}:{realDevice:true}),name:'Pinnacle '+device.name+' '+target.pathname,build:'pinnacle-api-'+report.startedAt,maxduration:300,idleTimeout:60,recordVideo:true}}}},150000);
    sessionId=created.value?.sessionId || created.sessionId;
    if(!sessionId)throw new Error('No WebDriver session ID returned');
    row.sessionId=sessionId;row.status='running';await save();
    const caps=created.value?.capabilities||{};
    row.actualBrowser={name:caps.browserName,version:caps.browserVersion,platform:caps.platformName};
    await wd('/timeouts','POST',{pageLoad:45000,script:15000,implicit:3000});
    if(desktop)await wd('/window/rect','POST',{width:1440,height:1000});
    await wd('/url','POST',{url:target.href});
    if(desktop){
      const viewport=await evaluate('return {width:innerWidth,height:innerHeight}');
      await wd('/window/rect','POST',{width:1440+(1440-viewport.width),height:1000+(900-viewport.height)});
    }
    await evaluate('return document.fonts.ready.then(()=>true)');
    row.document=await evaluate("return {title:document.title,url:location.href,ua:navigator.userAgent,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,screen:{width:screen.width,height:screen.height},canonical:document.querySelector('link[rel=canonical]')?.href,h1:document.querySelector('h1')?.innerText}");
    await screenshot('header');
    if(desktop){
      await check('Requested desktop browser and CSS viewport',async()=>{
        const normal=name=>String(name||'').toLowerCase().replace('microsoft','');
        const platformOK=desktop && (device.platform_name==='WIN11'?/windows/i:/mac/i).test(row.actualBrowser.platform||'');
        return platformOK && normal(row.actualBrowser.name)===normal(device.browserName) && String(row.actualBrowser.version).split('.')[0]===device.version && row.document.width===1440 && Math.abs(row.document.height-900)<=1;
      });
      await check('Desktop navigation controls',async()=>!await visible('.portal-mobile-menu-trigger') && await visible('.portal-therapy-menu'));
    }
    await check('Canonical and main heading',async()=>row.document.canonical===target.href && !!row.document.h1);
    await check('No horizontal page overflow',()=>evaluate('return document.documentElement.scrollWidth<=innerWidth+1'));
    await check('Nine authority destinations with visible subtexts',()=>evaluate("return document.querySelectorAll('.portal-main-list>a').length===9 && [...document.querySelectorAll('.portal-nav-detail')].every(e=>e.getBoundingClientRect().height>0)"));
    await check('Call destination',()=>evaluate("return !!document.querySelector('main a[href=\"tel:+919100181181\"]')"));
    await check('Navigation menu opens and closes',async()=>{
      if(!await visible('.portal-mobile-menu-trigger')){
        // Desktop menus open on pointerenter. Clicking after moving in would close them.
        const trigger=await wd('/element','POST',{using:'css selector',value:'.portal-therapy-menu summary'});
        await wd('/actions','POST',{actions:[{type:'pointer',id:'desktop-mouse',parameters:{pointerType:'mouse'},actions:[{type:'pointerMove',duration:200,origin:trigger,x:0,y:0}]}]});
        const open=await evaluate("const m=document.querySelector('.portal-therapy-menu');return m.open && m.querySelector('ul').getBoundingClientRect().height>0");
        await screenshot('menu');await click('h1');
        return open && await evaluate("return !document.querySelector('.portal-therapy-menu').open");
      }
      await click('.portal-mobile-menu-trigger');
      const open=await evaluate("return document.querySelector('.portal-directory-panel').getAttribute('aria-modal')==='true' && document.querySelector('main').hasAttribute('inert')");
      await screenshot('menu');await click('.portal-menu-close');
      return open && await evaluate("return !document.querySelector('main').hasAttribute('inert')");
    });
    await check('Authority rail reaches Citations',async()=>{
      if(await evaluate("const r=document.getElementById('portal-authority-rail');return r.scrollWidth<=r.clientWidth+1"))return true;
      await evaluate("const rail=document.getElementById('portal-authority-rail');rail.scrollLeft=rail.scrollWidth;return true");
      return evaluate("const rail=document.getElementById('portal-authority-rail'),a=rail.querySelector('a:last-child'),r=a.getBoundingClientRect();return rail.scrollLeft>0 && r.left<innerWidth && r.right<=innerWidth+1");
    });
    if(target.pathname==='/pinnacleai'){
      await check('PinnacleAI product story and usable module cards',async()=>{
        row.productStory=await evaluate("const example=document.getElementById('worked-example'),system=document.getElementById('what-it-does'),cards=[...document.querySelectorAll('.overview-architecture>li')];return {exampleBeforeSystem:!!(example.compareDocumentPosition(system)&Node.DOCUMENT_POSITION_FOLLOWING),cards:cards.map(e=>{const r=e.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}}),viewport:innerWidth,disclosures:document.querySelectorAll('.overview-module-detail').length}");
        const x=row.productStory;
        if(!x.exampleBeforeSystem||x.disclosures!==7||x.cards.length!==7||x.cards.some(c=>c.width<Math.min(240,x.viewport-40)||c.left<0||c.right>x.viewport+1))return false;
        await click('.overview-module-detail summary');
        const open=await evaluate("return document.querySelector('.overview-module-detail').open && document.querySelector('.overview-io').getBoundingClientRect().height>0");
        await screenshot('product-module-open');await click('.overview-module-detail summary');return open;
      });
      await check('Seven stages and ten visible FAQ questions',()=>evaluate("return document.querySelectorAll('.overview-lifecycle li').length===7 && document.querySelectorAll('.wave2-faq details').length===10"));
      await check('Lifecycle cards fill section and remain readable',async()=>{
        row.lifecycleGeometry=await evaluate('return ('+measurePinnacleLifecycle.toString()+')()');
        await evaluate("document.querySelector('nav[aria-label=\"The PinnacleAI circle in seven readable stages\"]').scrollIntoView({block:'center',behavior:'instant'});return true");
        await screenshot('lifecycle-cards');
        if(!row.lifecycleGeometry.passed)throw new Error(row.lifecycleGeometry.failures.join('; '));
        return true;
      });
      await check('FAQ disclosure works',async()=>{await click('.wave2-faq details summary');return evaluate("return document.querySelector('.wave2-faq details').open");});
      await evaluate("document.querySelector('.wave2-hero-art').scrollIntoView({block:'center',behavior:'instant'});return true");
      await screenshot('lifecycle');
      await check('Lifecycle image loaded',()=>evaluate("return [...document.querySelectorAll('.wave2-hero-art img')].every(e=>e.complete && e.naturalWidth>0)"));
    }
    if(target.pathname==='/seven-readiness-indexes'){
      await check('Readiness areas and stages have usable independent widths',async()=>{
        row.readinessGeometry=await evaluate("const cards=[...document.querySelectorAll('.ready-index,.ready-journey li')];return {areas:document.querySelectorAll('.ready-index').length,stages:document.querySelectorAll('.ready-journey li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.readinessGeometry;return r.areas===7&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#what-it-does').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('readiness-intro');
      await evaluate("document.querySelector('#pinnacleai-journey').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('readiness-stages');
      await check('Readiness FAQ disclosure works',async()=>{await click('.ready-faq summary');return evaluate("return document.querySelector('.ready-faq details').open && document.querySelectorAll('.ready-faq details').length===8");});
    }
    if(target.pathname==='/abilityscore'){
      await check('AbilityScore areas and stages have usable independent widths',async()=>{
        row.abilityscoreGeometry=await evaluate("const cards=[...document.querySelectorAll('.ability-review-grid article,.ability-journey li')];return {areas:document.querySelectorAll('.ability-architecture>div').length,reviews:document.querySelectorAll('.ability-review-grid article').length,stages:document.querySelectorAll('.ability-journey li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.abilityscoreGeometry;return r.areas===4&&r.reviews===2&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#what-it-does').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('abilityscore-intro');
      await evaluate("document.querySelector('#pinnacleai-journey').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('abilityscore-stages');
      await check('AbilityScore FAQ disclosure works',async()=>{await click('.ability-faq summary');return evaluate("return document.querySelector('.ability-faq details').open && document.querySelectorAll('.ability-faq details').length===8");});
    }
    if(target.pathname==='/everyday-therapy'){
      await check('Everyday Therapy areas and stages have usable independent widths',async()=>{
        row.everydayGeometry=await evaluate("const cards=[...document.querySelectorAll('.everyday-review-grid article,.everyday-journey li')];return {areas:document.querySelectorAll('.everyday-moments article').length,reviews:document.querySelectorAll('.everyday-review-grid article').length,stages:document.querySelectorAll('.everyday-journey li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.everydayGeometry;return r.areas===4&&r.reviews===2&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#what-it-does').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('everyday-intro');
      await evaluate("document.querySelector('#pinnacleai-journey').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('everyday-stages');
      await check('Everyday Therapy FAQ disclosure works',async()=>{await click('.everyday-faq summary');return evaluate("return document.querySelector('.everyday-faq details').open && document.querySelectorAll('.everyday-faq details').length===8");});
    }
    if(target.pathname==='/best-aba-therapy-center-india-proven-improvement-rate'){
      await check('ABA example, review choices and seven stages remain readable',async()=>{
        row.abaGeometry=await evaluate("const cards=[...document.querySelectorAll('.aba-cycle li,.aba-stage-grid li,.aba-review-branches article')];return {steps:document.querySelectorAll('.aba-cycle li').length,stages:document.querySelectorAll('.aba-stage-grid li').length,reviews:document.querySelectorAll('.aba-review-branches article').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.abaGeometry;return r.steps===4&&r.stages===7&&r.reviews===2&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#everyday-example').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('aba-example');
      await evaluate("document.querySelector('.aba-next-decision').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('aba-review');
      await check('ABA FAQ disclosure works',async()=>{await click('#questions summary');return evaluate("return document.querySelector('#questions details').open && document.querySelectorAll('#questions details').length===11");});
    }
    if(target.pathname==='/therapeuticai'){
      await check('TherapeuticAI observations, architecture and seven stages are readable',async()=>{
        row.therapeuticaiGeometry=await evaluate("const cards=[...document.querySelectorAll('.therapeuticai-observations li,.therapeuticai-architecture li,.therapeuticai-stages li,.therapeuticai-review-branches article')];return {records:document.querySelectorAll('.therapeuticai-observations li').length,stages:document.querySelectorAll('.therapeuticai-stages li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.therapeuticaiGeometry;return r.records===3&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#worked-example').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('therapeuticai-example');
      await evaluate("document.querySelector('#architecture').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('therapeuticai-architecture');
      await check('TherapeuticAI FAQ disclosure works',async()=>{await click('.therapeuticai-faq summary');return evaluate("return document.querySelector('.therapeuticai-faq details').open && document.querySelectorAll('.therapeuticai-faq details').length===8");});
    }
    if(target.pathname==='/prognose'){
      await check('Prognose observations, architecture and seven stages are readable',async()=>{
        row.prognoseGeometry=await evaluate("const cards=[...document.querySelectorAll('.prognose-observations li,.prognose-architecture li,.prognose-stages li,.prognose-review-branches article')];return {records:document.querySelectorAll('.prognose-observations li').length,stages:document.querySelectorAll('.prognose-stages li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.prognoseGeometry;return r.records===3&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#worked-example').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('prognose-example');
      await evaluate("document.querySelector('#architecture').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('prognose-architecture');
      await check('Prognose FAQ disclosure works',async()=>{await click('.prognose-faq summary');return evaluate("return document.querySelector('.prognose-faq details').open && document.querySelectorAll('.prognose-faq details').length===8");});
    }
    if(target.pathname==='/personal-development-kernel'){
      await check('PDK observations, architecture and seven stages are readable',async()=>{
        row.pdkGeometry=await evaluate("const cards=[...document.querySelectorAll('.pdk-record,.pdk-architecture li,.pdk-stages li,.pdk-review-branches article')];return {records:document.querySelectorAll('.pdk-record').length,stages:document.querySelectorAll('.pdk-stages li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.pdkGeometry;return r.records===2&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#worked-example').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('pdk-example');
      await evaluate("document.querySelector('#architecture').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('pdk-architecture');
      await check('PDK FAQ disclosure works',async()=>{await click('.pdk-faq summary');return evaluate("return document.querySelector('.pdk-faq details').open && document.querySelectorAll('.pdk-faq details').length===8");});
    }
    if(target.pathname==='/best-occupational-therapy-center-india-proven-improvement-rate'){
      await check('Occupational Therapy areas and stages have usable independent widths',async()=>{
        row.occupationalGeometry=await evaluate("const cards=[...document.querySelectorAll('.ot-goal-cycle li,.ot-other-examples article')];return {areas:document.querySelectorAll('.ot-route').length,reviews:document.querySelectorAll('.ot-other-examples article').length,stages:document.querySelectorAll('.ot-stage-peek li').length,width:innerWidth,cards:cards.map(c=>{const r=c.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right}})}");
        const r=row.occupationalGeometry;return r.areas===5&&r.reviews===2&&r.stages===7&&r.cards.every(c=>c.width>180&&c.left>=0&&c.right<=r.width+1);
      });
      await evaluate("document.querySelector('#goal-in-life').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('occupational-example');
      await evaluate("document.querySelector('#pinnacle-difference').scrollIntoView({block:'start',behavior:'instant'});return true");await screenshot('occupational-stages');
      await check('Occupational Therapy FAQ disclosure works',async()=>{await click('.ot-faq summary');return evaluate("return document.querySelector('.ot-faq details').open && document.querySelectorAll('.ot-faq details').length===8");});
    }
      if(isAsk){
      await check('Both approved Sintony weights loaded',()=>evaluate("return document.fonts.check('400 16px Sintony') && document.fonts.check('700 16px Sintony')"));
      await check('Answer text and source section remain readable',()=>evaluate("const p=document.querySelector('#explanation'),s=document.querySelector('#sources');return !!p && p.innerText.length>200 && p.getBoundingClientRect().width>=Math.min(280,innerWidth-48) && !!s"));
      await check('Answer FAQ disclosure opens',async()=>{await click('.ask-faq details summary');return evaluate("return document.querySelector('.ask-faq details').open");});
      await evaluate("document.getElementById('explanation').scrollIntoView({block:'start',behavior:'instant'});return true");
      await screenshot('answer');
      await check('Citations and share destinations',()=>evaluate("return !!document.querySelector('[data-ask-share=citation]') && !!document.querySelector('.ask-share a[href$=\".md\"]') && !!document.querySelector('.ask-share a[href^=\"https://wa.me/\"]')"));
    }
    await check('Verify footer cards and policy link',()=>evaluate("return document.querySelectorAll('.verify-card').length===36 && !!document.querySelector('footer a[href$=\"/policies\"]')"));
    const footerToggleVisible=await visible('.footer-group-toggle');
    if(footerToggleVisible)await click('.footer-group-toggle');
    else await evaluate("document.querySelector('.portal-footer-columns').scrollIntoView({block:'center'});return true");
    await screenshot('footer');
    if(footerToggleVisible)await click('.footer-group-toggle');
    await check('Optional analytics decline control and cookies',async()=>{await click('#website-preferences>summary');await click('[data-measurement-choice=declined]');return evaluate("return JSON.parse(localStorage.getItem('pinnacle-speech-analytics-v1'))?.value==='declined' && !document.cookie.split(';').some(c=>/^\\s*(?:_ga|ps_ga|_gcl_)/.test(c))");});
    const enrol=await evaluate("return document.querySelector('.portal-enrol').href");
    await wd('/url','POST',{url:enrol});
    await check('Enrolment destination opens without submitting',()=>evaluate("return location.hostname==='www.pinnacleblooms.org' && !!document.querySelector('main form') && !!document.querySelector('h1')"));
    row.status=row.checks.every(c=>c.passed)?'passed':'failed';
  }catch(e){row.status=sessionId?'failed':'session-not-started';row.error=redact(e.message);}
  finally{
    if(sessionId){
      try{await wd('','DELETE');row.sessionClosed=true;}catch(e){
        row.closeError=redact(e.message);
        try{const stopped=await api('/tests/'+sessionId+'/stop','PUT');row.sessionClosed=stopped.success===true;}catch(stopError){row.stopError=redact(stopError.message);}
        if(!row.sessionClosed)row.status='cleanup-unconfirmed';
      }
      try{const updated=await api('/tests/'+sessionId,'PUT',new URLSearchParams({'test[success]':row.status==='passed'?'1':'0','test[status_message]':(row.error || row.checks.filter(c=>!c.passed).map(c=>c.name).join('; ') || 'All defined smoke checks passed').slice(0,240)}));row.resultRecorded=updated.success===true;if(!row.resultRecorded)row.resultUpdateResponse=JSON.parse(redact(JSON.stringify(updated)));}catch(e){row.resultUpdateError=redact(e.message);}
      try{
        const response=await api('/tests/'+sessionId),result=response.test||response;
        row.provider={testId:result.id,success:result.success,deviceName:result.device_name,durationSeconds:result.duration,assetsAvailable:result.assets_available};
        if(result.assets_available){
          const assets=await api('/tests/'+sessionId+'/assets');
          // Signed artifact URLs stay out of committed reports and console output.
          row.provider.assets={videoAvailable:!!assets.video,screenshotCount:assets.screenshots?.length||0,logKinds:Object.keys(assets.logs||{})};
        }
      }catch(e){row.reportError=redact(e.message);}
    }
    await save();console.log(JSON.stringify(row));
  }
  if(row.status==='session-not-started' && /trial|upgrade|subscription|credit|not allowed/i.test(row.error||''))break;
}
report.finishedAt=new Date().toISOString();
const end=await api('/user');report.secondsRemaining=end.seconds;report.physicalSessionsStillRunning=end.current_physical_concurrency;report.desktopSessionsStillRunning=end.current_vm_concurrency;
await save();
console.log(JSON.stringify({report:out+'/report.json',sessions:report.sessions.map(r=>({device:r.device?.name,status:r.status})),secondsRemaining:report.secondsRemaining}));
if(report.sessions.some(r=>r.status!=='passed'))process.exitCode=1;
