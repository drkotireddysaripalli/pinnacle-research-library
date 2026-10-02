// Unattended real-device smoke checks. No patient data, calls or lead submissions.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const target = new URL(process.env.TESTINGBOT_URL || 'https://www.pinnacleblooms.org/pinnacleai');
if (target.protocol !== 'https:' || target.hostname !== 'www.pinnacleblooms.org' || target.search) throw new Error('Use a public canonical Pinnacle URL without query parameters');
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
const report={startedAt:new Date().toISOString(),target:target.href,account:{plan:account.plan,seconds:account.seconds,maxPhysical:account.max_concurrent_mobile},sessions:[],noLeadSubmitted:true,noCallInitiated:true};
const out='audits/testingbot/'+report.startedAt.replace(/[:.]/g,'-');
await fs.mkdir(out,{recursive:true});
const save=()=>fs.writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({account:report.account,report:out+'/report.json'}));
const choices=process.env.TESTINGBOT_DEVICE_IDS?.split(',').map(Number)||[22,29];
const devices=await api('/devices/available');
for(const id of choices){
  const device=devices.find(d=>d.id===id);
  if(!device){report.sessions.push({deviceId:id,status:'unavailable'});continue;}
  const row={device:{id:device.id,name:device.name,platform:device.platform_name,version:device.version},status:'starting',checks:[],screenshots:[]};
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
    console.log('Starting physical '+device.name+' '+device.version);
    const created=await request('https://hub.testingbot.com/wd/hub/session','POST',{capabilities:{alwaysMatch:{platformName:device.platform_name,browserName:device.platform_name==='iOS'?'safari':'chrome','appium:automationName':device.platform_name==='iOS'?'XCUITest':'UiAutomator2','appium:deviceName':device.name,'appium:platformVersion':device.version,'appium:newCommandTimeout':60,'tb:options':{realDevice:true,name:'Pinnacle API smoke '+target.pathname,build:'pinnacle-api-'+report.startedAt,maxduration:300,idleTimeout:60,recordVideo:true}}}},150000);
    sessionId=created.value?.sessionId || created.sessionId;
    if(!sessionId)throw new Error('No WebDriver session ID returned');
    row.sessionId=sessionId;row.status='running';await save();
    await wd('/timeouts','POST',{pageLoad:45000,script:15000,implicit:3000});
    await wd('/url','POST',{url:target.href});
    row.document=await evaluate("return {title:document.title,url:location.href,ua:navigator.userAgent,width:innerWidth,canonical:document.querySelector('link[rel=canonical]')?.href,h1:document.querySelector('h1')?.innerText}");
    await screenshot('header');
    await check('Canonical and main heading',async()=>row.document.canonical===target.href && !!row.document.h1);
    await check('No horizontal page overflow',()=>evaluate('return document.documentElement.scrollWidth<=innerWidth+1'));
    await check('Nine authority destinations with visible subtexts',()=>evaluate("return document.querySelectorAll('.portal-main-list>a').length===9 && [...document.querySelectorAll('.portal-nav-detail')].every(e=>e.getBoundingClientRect().height>0)"));
    await check('Call destination',()=>evaluate("return !!document.querySelector('main a[href=\"tel:+919100181181\"]')"));
    await check('Mobile menu opens and closes',async()=>{
      if(!await visible('.portal-mobile-menu-trigger'))return visible('.portal-therapy-menu');
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
      await check('Seven stages and ten visible FAQ questions',()=>evaluate("return document.querySelectorAll('.life-stages li').length===7 && document.querySelectorAll('.wave2-faq details').length===10"));
      await check('FAQ disclosure works',async()=>{await click('.wave2-faq details summary');return evaluate("return document.querySelector('.wave2-faq details').open");});
      await evaluate("document.querySelector('.wave2-hero-art').scrollIntoView({block:'center',behavior:'instant'});return true");
      await screenshot('lifecycle');
      await check('Lifecycle image loaded',()=>evaluate("return [...document.querySelectorAll('.wave2-hero-art img')].every(e=>e.complete && e.naturalWidth>0)"));
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
const end=await api('/user');report.secondsRemaining=end.seconds;report.physicalSessionsStillRunning=end.current_physical_concurrency;
await save();
console.log(JSON.stringify({report:out+'/report.json',sessions:report.sessions.map(r=>({device:r.device?.name,status:r.status})),secondsRemaining:report.secondsRemaining}));
if(report.sessions.some(r=>r.status!=='passed'))process.exitCode=1;
