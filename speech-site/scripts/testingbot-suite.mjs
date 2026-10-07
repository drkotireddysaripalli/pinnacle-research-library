// Real remote WebDriver sessions. No actual sign-in, OTP, call, enquiry or purchase.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {testingBotClient,writeJson} from './testingbot-client.mjs';
import {pageManifest,selectCases,matrix} from '../tests/testingbot/page-manifest.mjs';
import {measurePinnacleLifecycle} from '../tests/browser/pinnacle-lifecycle-contract.mjs';
import {suiteVerdict} from '../tests/testingbot/verdict.mjs';
import {headerReferenceName,imageInViewport,desktopScreenResolution,fitCssViewport} from '../tests/testingbot/presentation-state.mjs';

const option=(name,fallback)=>{const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1];};
const suite=option('suite','bvt'),build=process.argv.includes('--build'),list=process.argv.includes('--list');
const manifest=await pageManifest(),selected=selectCases(manifest,suite,{build,ids:option('cases','').split(',').filter(Boolean)});
const approvedShell=JSON.parse(await fs.readFile(new URL('../tests/fixtures/shared-authority-owner-approved.json',import.meta.url)));
const visualReferences=JSON.parse(await fs.readFile(new URL('../tests/testingbot/visual-references.json',import.meta.url)));
// Broader records default to one browser. Use explicit matrices for changed
// shared templates; the daily plan rotates secondary browsers and devices.
const matrixIds=option('matrix',suite==='p2'?'edge':'chrome').split(',');
if(matrixIds.some(id=>!matrix[id]))throw Error('Unknown matrix entry');
if(!selected.length)throw Error('Empty suite; refusing a vacuous pass');
if(list){console.log(JSON.stringify({suite,build,matrix:matrixIds,cases:selected,pending:manifest.filter(r=>!r.published)},null,2));process.exit(0);}
const client=testingBotClient(),{api,request,redact}=client;
const stamp=new Date().toISOString();
const out=path.resolve(option('out','audits/testingbot-suites/'+stamp.replace(/[:.]/g,'-')+'-'+suite));
const account=await api('/user');
const digest=file=>fs.readFile(file).then(b=>createHash('sha256').update(b).digest('hex'));
let source=process.env.GITHUB_SHA||process.env.TESTINGBOT_SOURCE_SHA;
if(!source)try{const git=process.env.GIT_EXECUTABLE||(process.platform==='win32'?'C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe':'git');source=execFileSync(git,['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();}catch{source='unknown';}
const report={schemaVersion:1,suite,startedAt:stamp,source,build,runnerSha256:await digest(new URL(import.meta.url)),manifestSha256:await digest(new URL('../tests/testingbot/page-manifest.mjs',import.meta.url)),account:{plan:account.plan,secondsBefore:account.seconds,desktopSlots:account.max_concurrent,physicalSlots:account.max_concurrent_mobile},selectedIds:selected.map(r=>r.id),requestedMatrix:matrixIds,sessions:[],pendingPages:manifest.filter(r=>!r.published),declaredLimits:['Public signed-out UI only; actual OAuth/OTP and upstream accepted leads/purchases are not exercised','TestingBot executes our assertions; it does not certify narrative quality or business outcomes','Screenshots require review against approved references; a capture is not visual acceptance','Browser lab timings are not field Core Web Vitals']};
report.presentationStateSha256=await digest(new URL('../tests/testingbot/presentation-state.mjs',import.meta.url));
await fs.mkdir(out,{recursive:true});
const save=()=>writeJson(out+'/report.json',report);
await save();console.log(JSON.stringify({suite,selected:selected.length,matrix:matrixIds,report:out+'/report.json',account:report.account}));
const devices=matrixIds.some(id=>matrix[id].kind==='physical')?await api('/devices/available'):[];
const catalogue=matrixIds.some(id=>matrix[id].kind==='desktop')?await api('/browsers'):[];
const candidateOrigin=process.env.TESTINGBOT_BASE_URL;
if(build&&!candidateOrigin)throw Error('Build BVT requires TESTINGBOT_BASE_URL for this exact build; cannot silently test production');
if(candidateOrigin){const u=new URL(candidateOrigin);if(u.username||u.password||u.search||u.hash)throw Error('Invalid candidate base');if(u.protocol!=='https:'&&!(process.env.TESTINGBOT_HUB&&u.protocol==='http:'&&['localhost','127.0.0.1','testingbot.test'].includes(u.hostname)))throw Error('Candidate requires HTTPS or the configured local TestingBot tunnel');}
const navigateUrl=p=>candidateOrigin?new URL(build?p.buildPath:p.path,candidateOrigin).href:p.canonical;

for(const matrixId of matrixIds){
  const config=matrix[matrixId];
  let device;
  if(config.kind==='physical'){
    const available=devices.filter(d=>d.platform_name===config.platformName&&(!config.devicePattern||d.name.includes(config.devicePattern)));
    device=config.preferred.map(id=>available.find(d=>d.id===id)).find(Boolean)||available[0];
    if(!device){report.sessions.push({matrix:matrixId,status:'unavailable',reason:'No physical '+config.platformName+' device returned by provider',cases:[]});await save();continue;}
  }else{
    const normal=s=>String(s).toLowerCase().replace('microsoft','').replace('google','');
    const available=catalogue.filter(d=>normal(d.name||d.browser||'')===normal(config.browserName)&&d.platform===config.platformName&&/^\d/.test(d.version));
    available.sort((a,b)=>parseFloat(b.version)-parseFloat(a.version));device=available[0];
    if(!device){report.sessions.push({matrix:matrixId,status:'unavailable',reason:'Requested desktop browser/OS absent from provider catalogue',cases:[]});await save();continue;}
  }
  const session={matrix:matrixId,kind:config.kind,requested:{...config,deviceName:device.name,version:device.version},status:'starting',cases:[],artifacts:[],skipped:[]};
  report.sessions.push(session);await save();let sessionId;
  const wd=async(suffix,method='GET',body)=>{const d=await request(client.hub+'/session/'+sessionId+suffix,method,body);return d.value;};
  // Appium Safari does not wait for a Promise returned by execute/sync.
  // Use the standard async callback so physical devices return real evidence.
  const evaluate=async(script,...args)=>{
    if(script.startsWith('tb:'))return wd('/execute/sync','POST',{script,args});
    const wrapped="const input=Array.from(arguments),done=input.pop();try{Promise.resolve((function(){\n"+script+"\n}).apply(null,input)).then(done,e=>done({__testingbotScriptError:String(e.message||e)}))}catch(e){done({__testingbotScriptError:String(e.message||e)})}";
    const result=await wd('/execute/async','POST',{script:wrapped,args});
    if(result?.__testingbotScriptError)throw Error(result.__testingbotScriptError);
    return result;
  };
  const visible=selector=>evaluate("const e=document.querySelector(arguments[0]);if(!e)return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'",selector);
  const click=async selector=>{
    const info=await evaluate("const n=document.querySelector(arguments[0]);return n?{href:n.href||'',tag:n.tagName,type:n.type||''}:null",selector);
    if(!info)throw Error('Missing interaction target '+selector);
    if(/^(tel:|mailto:|https:\/\/wa\.me|https:\/\/.*checkout)/i.test(info.href))throw Error('Refusing a real contact/payment action');
    await evaluate("document.querySelector(arguments[0]).scrollIntoView({block:'center',behavior:'instant'});return true",selector);
    const element=await wd('/element','POST',{using:'css selector',value:selector});
    await wd('/element/'+element['element-6066-11e4-a52e-4f735466cecf']+'/click','POST',{});
  };
  const snap=async(test,name)=>{await evaluate('return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))))');const encoded=await wd('/screenshot');const file=matrixId+'-'+test.id+'-'+name+'.png';await fs.writeFile(out+'/'+file,Buffer.from(encoded,'base64'));test.screenshots.push(file);};
  try{
    const desktop=config.kind==='desktop';
    const caps={platformName:desktop?config.platformName:device.platform_name,browserName:config.browserName,...(desktop?{browserVersion:device.version}:{'appium:automationName':config.platformName==='iOS'?'XCUITest':'UiAutomator2','appium:deviceName':device.name,'appium:platformVersion':device.version,'appium:newCommandTimeout':90}),'tb:options':{name:'Pinnacle '+suite+' '+matrixId+' '+stamp,build:'portal-'+source.slice(0,12)+'-'+suite,...(process.env.TESTINGBOT_TUNNEL_ID?{tunnelIdentifier:process.env.TESTINGBOT_TUNNEL_ID}:{}),...(!desktop?{realDevice:true}:{'screen-resolution':desktopScreenResolution(config)}),debugging:desktop&&['chrome','edge'].includes(matrixId),screenrecorder:true,screenshot:false,maxduration:1800,idleTimeout:90}};
    console.log('Starting '+matrixId+' '+device.name+' '+device.version);
    // Physical allocation/boot can outlast 150s. The provider evidence showed
    // successful Android creation immediately before the old client timed out.
    const created=await request(client.hub+'/session','POST',{capabilities:{alwaysMatch:caps}},desktop?240000:300000);
    sessionId=created.value?.sessionId||created.sessionId;if(!sessionId)throw Error('No session ID');
    session.sessionId=sessionId;session.providerCapabilities=created.value?.capabilities||{};session.dashboard='https://testingbot.com/members/tests/'+sessionId;
    await wd('/timeouts','POST',{pageLoad:60000,script:20000,implicit:1000});
    if(desktop)await wd('/window/rect','POST',{width:Math.max(config.width,500),height:config.height+180});
    for(const p of selected){
      const t={id:p.id,canonical:p.canonical,family:p.family,priority:p.priority,status:'running',checks:[],screenshots:[],warnings:p.knownGap?[p.knownGap]:[],skipped:[],startedAt:new Date().toISOString()};session.cases.push(t);await save();
      if(!p.published){t.status='pending';t.reason=p.reason;continue;}
      const check=async(name,fn)=>{try{const evidence=await fn();if(evidence===false||evidence===null||evidence===undefined)throw Error('Assertion was false');t.checks.push({name,passed:true,evidence});}catch(e){t.checks.push({name,passed:false,error:redact(e.message)});}};
      try{
        const target=navigateUrl(p);t.testedUrl=target;
        const response=await fetch(target,{signal:AbortSignal.timeout(30000)});const html=await response.text();t.http={status:response.status,finalUrl:response.url,sha256:createHash('sha256').update(html).digest('hex'),xRobots:response.headers.get('x-robots-tag')};
        await check('Correct public document loads',()=>response.status===200&&!/noindex/i.test(t.http.xRobots||''));
        if(response.status!==200)throw Error('Target document HTTP '+response.status);
        await wd('/url','POST',{url:target});
        if(desktop)await fitCssViewport(config,{viewport:()=>evaluate('return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r({width:innerWidth,height:innerHeight}))))'),rect:()=>wd('/window/rect'),resize:bounds=>wd('/window/rect','POST',bounds)});
        await evaluate('return document.fonts.ready.then(()=>true)');
        t.document=await evaluate("return {url:location.href,title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,description:document.querySelector('meta[name=description]')?.content,h1:[...document.querySelectorAll('main h1')].map(n=>n.textContent.trim()),width:innerWidth,height:innerHeight,ua:navigator.userAgent,screen:{width:screen.width,height:screen.height},dpr:devicePixelRatio,ready:document.readyState}");
        await check('Browser/OS identity is actual requested coverage',()=>{const c=session.providerCapabilities;const browser=String(c.browserName||'').toLowerCase().replace('microsoft','');const name=config.browserName.toLowerCase().replace('microsoft','');const ua=t.document.ua;return browser===name&&(desktop?(config.platformName==='WIN11'?/Windows/i.test(ua):/Mac/i.test(ua)):(config.platformName==='iOS'?/iPhone|iPad/i.test(ua):/Android/i.test(ua)));});
        if(desktop)await check('Requested CSS viewport is actually delivered',()=>Math.abs(t.document.width-config.width)<=1&&Math.abs(t.document.height-config.height)<=1);
        await check('Canonical and one meaningful main heading',()=>t.document.canonical===p.canonical&&t.document.h1.length===1&&t.document.h1[0].length>8&&t.document.title.length>15&&t.document.description?.length>30);
        await check('Loaded intended route',()=>new URL(t.document.url).pathname===new URL(target).pathname);
        await check('No page overflow',()=>evaluate('return document.documentElement.scrollWidth<=innerWidth+1'));
        if(p.shell==='evidence')await check('Existing evidence header/footer remain present',()=>evaluate("return !!document.querySelector('header')&&!!document.querySelector('footer.evidence-footer')&&document.querySelectorAll('header a').length>=4"));
        else if(p.shell==='helpline')await check('Existing helpline header/footer remain present',()=>evaluate("return !!document.querySelector('header.site-header')&&!!document.querySelector('footer.site-footer')&&!!document.querySelector('header a[href*=\"9100181181\"]')"));
        else await check('Shared header/footer and nine usable authority links',()=>evaluate("const hs=document.querySelectorAll('.portal-site-header,.portal-header'),fs=document.querySelectorAll('.portal-site-footer'),a=[...document.querySelectorAll('.portal-main-list>a')];return hs.length>=1&&fs.length===1&&a.length===9&&a.every(n=>n.href&&n.textContent.trim().length>10)"));
        if(!p.shell)await check('Owner-approved authority wording and full evidence footer are preserved',()=>evaluate("const expected=arguments[0],a=[...document.querySelectorAll('.portal-main-list>a')],normal=s=>s.replace(/\\s+/g,' ').trim();return a.length===expected.main.length&&a.every((n,i)=>normal(n.querySelector('.portal-nav-label')?.textContent||'')===expected.main[i].label&&normal(n.querySelector('.portal-nav-detail')?.textContent||'')===expected.main[i].lines.join(' '))&&document.querySelectorAll('.verify-card').length===36&&document.querySelectorAll('nav.portal-locations li a').length===16&&document.querySelectorAll('nav.portal-community>a').length===8&&document.querySelectorAll('footer a[href$=\"/policies\"]').length===1",approvedShell));
        await check('Structured data parses and social image exists',()=>evaluate("const s=[...document.querySelectorAll('script[type=\"application/ld+json\"]')];return s.length>0&&s.every(n=>{try{return !!JSON.parse(n.textContent)}catch{return false}})&&(document.querySelector('meta[property=\"og:image\"]')?.content||'').startsWith('https://')"));
        await check('Usable helpline destination remains available',()=>evaluate("const a=[...document.querySelectorAll('a[href=\"tel:+919100181181\"]')];return a.length>0&&a.some(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0})"));
        await snap(t,'opening');
        const gated=await visible('#ask-reader-gate[open]');
        if(process.argv.includes('--visual')&&!p.shell){
          const identity=[matrixId,config.kind==='physical'?device.name:config.platformName,t.document.width+'x'+t.document.height].join('-').replace(/[^a-zA-Z0-9-]/g,'-');
          const activePath=await evaluate("return [...new Set([...document.querySelectorAll('.portal-main-nav a[aria-current=page],.portal-therapy-nav a[aria-current=page]')].map(a=>new URL(a.href).pathname))].sort().join('--')");
          const name=config.kind==='physical'?'pinnacle-opening-'+p.id+'-'+identity:headerReferenceName(identity,{gate:gated,activePath});
          const reference=visualReferences.approved.find(r=>r.name===name);
          try{
            // Appium's native interception did not resolve CSS crops on the
            // physical web sessions. Use the documented viewport mode there.
            const result=await evaluate('tb:visual.snapshot='+JSON.stringify({name,options:{...(config.kind==='desktop'?{selector:'.portal-header'}:{}),threshold:0.1,antialiasing:true}}));
            const v=typeof result==='string'?JSON.parse(result):result;
            if(typeof v?.match!=='boolean'||!v.visualId)throw Error('Provider did not return a real visual-comparison result');
            t.visual={name,...v,approval:reference?'approved-reference':'provisional-first-capture',referenceScope:config.kind==='physical'?'Exact page opening on this physical device/viewport':'Shared header only; narrative/body/footer are separate checks and screenshots'};
            if(reference&&(String(reference.visualId)!==String(v.visualId)||!v.match))t.checks.push({name:'Approved visual reference matches',passed:false,error:'Visual ID changed or pixel regression detected',evidence:t.visual});
            else if(!reference)t.skipped.push('First provider screenshot is a provisional baseline; automatic baseline creation is not design approval');
          }catch(e){
            const error='Provider visual comparison unavailable: '+redact(e.message);
            if(reference)t.checks.push({name:'Approved visual reference is verifiable',passed:false,error});
            else t.skipped.push(error);
          }
        }
        if(p.gate){await check('Anonymous reader gets branded Google sign-in gate',()=>evaluate("const d=document.querySelector('#ask-reader-gate');return !!d?.open&&!!d.querySelector('[name=returnTo]')&&!!d.querySelector('img')"));t.skipped.push('Signed-in profile, WhatsApp OTP and protected reader interactions require a separately authorised real-user acceptance; no fake sign-in in this production suite');}
        else await check('Public destination has no unintended reader sign-in gate',()=>!gated);
        if(!gated){
          await check('Mobile navigation opens, isolates content and restores focus',async()=>{
            if(!await visible('.portal-mobile-menu-trigger')){
              if(p.shell==='evidence'||p.shell==='helpline'){t.skipped.push('Portal navigation does not apply to this existing dedicated shell');return {mode:p.shell,applicable:false};}
              const trigger=await wd('/element','POST',{using:'css selector',value:'.portal-therapy-menu summary'});
              // Remote Safari retains the pointer across page navigation. Move
              // out first so this page receives a real pointer-enter event.
              const outside=await wd('/element','POST',{using:'css selector',value:'main h1'});
              await wd('/actions','POST',{actions:[{type:'pointer',id:'desktop-mouse',parameters:{pointerType:'mouse'},actions:[{type:'pointerMove',duration:100,origin:outside,x:0,y:0},{type:'pointerMove',duration:100,origin:trigger,x:0,y:0}]}]});
              const open=await evaluate("return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(document.querySelector('.portal-therapy-menu').open))))");await click('main h1');return open&&!await evaluate("return document.querySelector('.portal-therapy-menu').open");
            }
            await click('.portal-mobile-menu-trigger');const open=await evaluate("return document.querySelector('.portal-directory-panel')?.getAttribute('aria-modal')==='true'&&document.querySelector('main').hasAttribute('inert')");
            await click('.portal-menu-close');return open&&await evaluate("return !document.querySelector('main').hasAttribute('inert')&&document.activeElement===document.querySelector('.portal-mobile-menu-trigger')");
          });
          await check('A content disclosure opens and closes',async()=>{
            const selector=await evaluate("const d=[...document.querySelectorAll('main details')].find(n=>!n.open);if(!d)return '';d.setAttribute('data-tb-disclosure','1');return '[data-tb-disclosure] summary'");
            if(!selector){t.skipped.push('No content disclosure on this page');return {applicable:false};}
            await click(selector);const open=await evaluate("return document.querySelector('[data-tb-disclosure]').open");await click(selector);return open&&!await evaluate("return document.querySelector('[data-tb-disclosure]').open");
          });
          if(p.kind==='pinnacleai')await check('Seven lifecycle cards retain readable widths and words',async()=>{const g=await evaluate('return ('+measurePinnacleLifecycle.toString()+')()');t.lifecycle=g;if(!g.passed)throw Error(g.failures.join('; '));return g;});
          if(p.kind==='enrolment'){
            for(const service of ['autism','speech','occupational','aba']){
              await wd('/url','POST',{url:target+'?service='+service});
              await check('Enrolment incoming '+service+' preference survives',()=>evaluate("return document.querySelector('input[name=service]:checked')?.value===arguments[0]&&!document.querySelector('#enrol-submit').disabled",service));
            }
            await wd('/url','POST',{url:target});
            await check('Service labels do not split words into narrow columns',()=>evaluate("const labels=[...document.querySelectorAll('.enrol-service-choice span')];return labels.length>=4&&labels.every(n=>{const t=n.firstChild;if(t?.nodeType!==3)return false;return [...t.textContent.matchAll(/\\S+/g)].every(m=>{const r=document.createRange();r.setStart(t,m.index);r.setEnd(t,m.index+m[0].length);return new Set([...r.getClientRects()].map(x=>Math.round(x.top))).size<=1})})"));
          }
          if(p.kind==='centre'&&(!p.status||p.status==='centre-enquiry'))await check('Centre assessment keeps actual selected centre',()=>evaluate("const a=document.querySelector('.local-hero a[data-cta=\"hero-assessment\"]');return !!a&&new URL(a.href).searchParams.get('centre')===arguments[0]",p.centre));
          // Exercise lazy loading without external video/map activation or submitting forms.
          await check('Current viewport images actually decode',async()=>{const evidence=await evaluate("return (async()=>{const images=[...document.querySelectorAll('main img')].filter("+imageInViewport.toString()+");await Promise.all(images.map(n=>Promise.race([n.decode().catch(()=>{}),new Promise(r=>setTimeout(r,4000))])));return {count:images.length,broken:images.filter(n=>!n.complete||!n.naturalWidth).map(n=>n.getAttribute('src'))}})()");t.viewportImages=evidence;if(evidence.broken.length)throw Error(JSON.stringify(evidence));return evidence;});
          const reading=await evaluate("const main=document.querySelector('main'),paras=[...main.querySelectorAll('p')].filter(n=>n.innerText.trim().length>30&&n.getBoundingClientRect().height>0),bad=paras.filter(n=>{const s=getComputedStyle(n);return parseFloat(s.fontSize)<12||n.getBoundingClientRect().width<120}).map(n=>({text:n.innerText.slice(0,120),fontSize:getComputedStyle(n).fontSize,width:n.getBoundingClientRect().width}));const broken=[...main.querySelectorAll('a[href^=\"#\"]')].filter(n=>n.hash.length>1&&!document.getElementById(decodeURIComponent(n.hash.slice(1)))).map(n=>n.hash);return {paragraphs:paras.length,smallText:bad,brokenAnchors:broken}");t.readability=reading;
          // Small secondary text belongs to the P2 presentation suite, not the fast BVT release smoke.
          if(reading.smallText.length)t.warnings.push('P2 readability findings: '+JSON.stringify(reading.smallText));
          await check('Main content exists and internal anchors resolve',()=>reading.paragraphs>0&&reading.brokenAnchors.length===0);
          if(suite==='p2')await check('P2 readable paragraph sizes and widths',()=>reading.smallText.length===0);
          if(suite==='p2'){
            if(p.native)await check('Native reading typography uses the appropriate Anek family',()=>evaluate("const script=arguments[0]==='te'?/[\\u0c00-\\u0c7f]/:/[\\u0900-\\u097f]/;const a=[...document.querySelectorAll('main h1,main h2,main p')].filter(n=>script.test(n.textContent));return a.length>0&&a.every(n=>getComputedStyle(n).fontFamily.includes(arguments[0]==='te'?'Anek Telugu':'Anek Devanagari'))",p.native===true?'te':p.native));
            await check('Below-page images resolve after an explicit loading sweep',async()=>{const images=await evaluate("return (async()=>{const a=[...document.querySelectorAll('main img')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0});a.forEach(n=>n.loading='eager');await Promise.all(a.map(n=>Promise.race([n.decode().catch(()=>{}),new Promise(r=>setTimeout(r,6000))])));return {count:a.length,broken:a.filter(n=>!n.complete||!n.naturalWidth).map(n=>n.src)}})()");t.allImages=images;if(images.broken.length)throw Error(JSON.stringify(images));return images;});
            await check('WCAG serious/critical findings are absent in main content',async()=>{const axe=await fs.readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');await evaluate(axe);const results=await evaluate("return axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}).then(r=>r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))");t.accessibility=results;if(results.some(v=>['serious','critical'].includes(v.impact)))throw Error(JSON.stringify(results.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length}))));return {violations:results.length};});
          }
          await evaluate("const main=document.querySelector('main');scrollTo(0,main.offsetTop+Math.min(main.offsetHeight/3,1600));return true");await snap(t,'content');
          await evaluate("document.querySelector('footer').scrollIntoView({block:'start',behavior:'instant'});return true");await snap(t,'footer');
        }else t.skipped.push('Covered anonymous overlay only; page content stays in server HTML but is not visually read through the gate');
        t.performance=await evaluate("return new Promise(resolve=>{let lcp=null,cls=0;try{new PerformanceObserver(l=>{for(const e of l.getEntries())lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)cls+=e.value}).observe({type:'layout-shift',buffered:true})}catch{}requestAnimationFrame(()=>setTimeout(()=>{const n=performance.getEntriesByType('navigation')[0];resolve({ttfbMs:n?.responseStart,domContentLoadedMs:n?.domContentLoadedEventEnd,loadMs:n?.loadEventEnd,lcpMs:lcp,cls,resources:performance.getEntriesByType('resource').length,connection:navigator.connection?{effectiveType:navigator.connection.effectiveType,downlink:navigator.connection.downlink,rtt:navigator.connection.rtt}:null})},200))})");
        if(t.performance.lcpMs>2500)t.warnings.push('Observed unthrottled browser LCP exceeds 2500ms; investigate with repeatable performance baseline, not a field result');
        if(t.performance.cls>0.1)t.warnings.push('Observed page layout shift exceeds 0.1');
        if(matrixId==='chrome'||matrixId==='edge')try{const logs=await wd('/log','POST',{type:'browser'});t.browserErrors=logs.filter(l=>l.level==='SEVERE').map(l=>({level:l.level,message:redact(l.message).slice(0,600)}));if(t.browserErrors.some(l=>/Uncaught|SyntaxError|TypeError|ReferenceError/.test(l.message)))throw Error('Uncaught browser errors');}catch(e){if(/Uncaught browser errors/.test(e.message))t.checks.push({name:'No uncaught browser errors',passed:false,error:e.message});else t.skipped.push('Browser console log unavailable: '+redact(e.message).slice(0,180));}
        t.status=t.checks.length>0&&t.checks.every(c=>c.passed)?'passed':'failed';
      }catch(e){t.status='failed';t.error=redact(e.message);try{await snap(t,'failure');}catch{}}
      t.finishedAt=new Date().toISOString();await save();console.log(JSON.stringify({matrix:matrixId,case:p.id,status:t.status,failed:t.checks.filter(c=>!c.passed).map(c=>c.name),error:t.error}));
      if(t.error?.startsWith('Requested CSS viewport unavailable:')){session.skipped.push('Remaining cases not executed: provider viewport could not be calibrated; no repeated identical setup attempts');break;}
    }
    if(process.argv.includes('--network')){
      if(!['chrome','edge'].includes(matrixId))session.skipped.push('Provider network commands are not enabled for this browser; no Safari/physical throttle claim');
      else{
        session.network={preset:'3G',mode:'provider-emulated',status:'running',cases:[]};
        try{
          await evaluate('tb:throttle','3G');session.network.providerCommandAccepted=true;
          for(const p of manifest.filter(r=>['enrolment','speech'].includes(r.id))){
            const start=Date.now(),target=navigateUrl(p);await wd('/url','POST',{url:target});
            const evidence=await evaluate("const call=[...document.querySelectorAll('a[href=\"tel:+919100181181\"]')].some(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0});const n=performance.getEntriesByType('navigation')[0];return {title:document.title,h1:document.querySelector('main h1')?.textContent,call,overflow:document.documentElement.scrollWidth>innerWidth+1,ttfbMs:n?.responseStart,domContentLoadedMs:n?.domContentLoadedEventEnd,loadMs:n?.loadEventEnd}");
            const passed=!!evidence.h1&&evidence.call&&!evidence.overflow;session.network.cases.push({id:p.id,url:target,passed,elapsedMs:Date.now()-start,evidence});
          }
          const log=await evaluate('tb:network');session.network.log={available:!!log,entryCount:Array.isArray(log)?log.length:null};
          session.network.status=session.network.cases.every(c=>c.passed)?'passed':'failed';
        }catch(e){session.network.status='failed';session.network.error=redact(e.message);}
        finally{try{await evaluate('tb:throttle','disable');session.network.restored=true;}catch(e){session.network.restoreError=redact(e.message);}}
      }
    }
    session.status=session.cases.every(t=>t.status==='passed')?'passed':'failed';
    if(session.network&&(session.network.status!=='passed'||!session.network.restored))session.status='failed';
  }catch(e){session.status='failed';session.error=redact(e.message);}
  finally{
    if(sessionId){
      try{await wd('','DELETE');session.closed=true;}catch(e){session.closeError=redact(e.message);try{const r=await api('/tests/'+sessionId+'/stop','PUT');session.closed=r.success===true;}catch{}}
      if(!session.closed)session.status='cleanup-unconfirmed';
      try{const r=await api('/tests/'+sessionId,'PUT',new URLSearchParams({'test[success]':session.status==='passed'?'1':'0','test[status_message]':suite+': '+session.cases.filter(t=>t.status==='passed').length+'/'+session.cases.length+' page cases passed'}));session.resultRecorded=r.success===true;}catch(e){session.resultError=redact(e.message);}
      try{const r=await api('/tests/'+sessionId),p=r.test||r;session.provider={id:p.id,success:p.success,durationSeconds:p.duration,assetsAvailable:p.assets_available,deviceName:p.device_name,platformName:p.platform_name,os:p.os,browser:p.browser,browserVersion:p.browser_long_version||p.browser_version};if(p.assets_available){const a=await api('/tests/'+sessionId+'/assets');session.provider.artifacts={video:!!a.video,screenshots:a.screenshots?.length||0,logKinds:Object.keys(a.logs||{})};}}catch(e){session.providerReadbackError=redact(e.message);}
    }
    await save();
  }
}
report.finishedAt=new Date().toISOString();const end=await api('/user');report.account.secondsAfter=end.seconds;
report.providerSessionSeconds=report.sessions.reduce((n,s)=>n+(Number(s.provider?.durationSeconds)||0),0);
report.functionalPassed=suiteVerdict(report);
report.counts={selectedPages:selected.length,pageRuns:report.sessions.reduce((n,s)=>n+s.cases.length,0),passed:report.sessions.flatMap(s=>s.cases).filter(t=>t.status==='passed').length,failed:report.sessions.flatMap(s=>s.cases).filter(t=>t.status==='failed').length,unavailable:report.sessions.filter(s=>s.status==='unavailable').length,pending:report.pendingPages.length};
report.visualAcceptance=report.sessions.flatMap(s=>s.cases).some(t=>t.visual?.approval==='provisional-first-capture')?'provisional-baselines-await-review':'captures-await-review';report.overall=report.functionalPassed?'functional-pass':'failed-or-incomplete';
await save();console.log(JSON.stringify({report:out+'/report.json',overall:report.overall,counts:report.counts,providerSessionSeconds:report.providerSessionSeconds}));
if(!report.functionalPassed)process.exitCode=1;
