// Focused regression for the changed legacy directory. Each run preserves prior device evidence.
import fs from 'node:fs/promises';import path from 'node:path';import {parseArgs} from 'node:util';import {pathToFileURL} from 'node:url';import {testingBotClient,writeJson} from './testingbot-client.mjs';
export function readingOptions(args=process.argv.slice(2)){
 const {values}=parseArgs({args,options:{'chrome-only':{type:'boolean',default:false},receipt:{type:'string',default:'deployment/completion-directory-phone-20261008.json'},help:{type:'boolean',default:false}},allowPositionals:false});
 return {chromeOnly:values['chrome-only'],receipt:path.resolve(values.receipt),help:values.help};
}
export function readingRunPrefix(options,source){
 if(typeof source!=='string'||! /^[a-f0-9]{40,64}$/i.test(source))throw new Error('Release receipt must contain a valid commit before a TestingBot run.');
 return (options.chromeOnly?'chrome-only-':'devices-')+source.slice(0,10)+'-';
}
export async function runReadingDirectory(options){
const base=path.resolve('../../../work/website-completion-20261008/testingbot-directory');
const source=JSON.parse(await fs.readFile(options.receipt,'utf8')).commit;
const prefix=readingRunPrefix(options,source);
const pages=JSON.parse(await fs.readFile(path.join(base,'../public-structure.json'),'utf8'));
await fs.mkdir(base,{recursive:true});const out=await fs.mkdtemp(path.join(base,prefix));const c=testingBotClient();
const [devices,browsers]=await Promise.all([options.chromeOnly?Promise.resolve([]):c.api('/devices/available'),c.api('/browsers')]);
const chrome=browsers.filter(b=>b.platform==='WIN11'&&/chrome/i.test(b.name||b.browser||'')&&/^\d/.test(b.version)).sort((a,b)=>parseFloat(b.version)-parseFloat(a.version))[0];
const ios=[22,44,33].map(id=>devices.find(d=>d.id===id&&d.platform_name==='iOS')).find(Boolean)||devices.find(d=>d.platform_name==='iOS'&&d.name.includes('iPhone'));
const requested=options.chromeOnly?[['chrome',chrome]]:[['chrome',chrome],['ios',ios]];
const report={at:new Date().toISOString(),source,receipt:options.receipt,chromeOnly:options.chromeOnly,scope:'Three changed reading families; '+(options.chromeOnly?'Chrome/Windows only.':'Chrome/Windows and a physical iPhone/Safari.')+' No actual contact, login or lead submission.',sessions:[]};
console.log(JSON.stringify({receipt:options.receipt,output:out,chromeOnly:options.chromeOnly}));
for(const [kind,d] of requested){
 const row={kind,device:d?.name,version:d?.version,cases:[]};report.sessions.push(row);if(!d){row.status='unavailable';continue;}let sid;
 try{
  const cap=kind==='ios'?{platformName:'iOS',browserName:'safari','appium:automationName':'XCUITest','appium:deviceName':d.name,'appium:platformVersion':d.version,'appium:newCommandTimeout':90,'tb:options':{realDevice:true,name:'Pinnacle directory '+source.slice(0,10),screenrecorder:true,maxduration:600}}:{platformName:'WIN11',browserName:'chrome',browserVersion:d.version,'tb:options':{name:'Pinnacle directory '+source.slice(0,10),screenrecorder:true,'screen-resolution':'1440x900',maxduration:600}};
  const created=await c.request(c.hub+'/session','POST',{capabilities:{alwaysMatch:cap}});sid=created.value.sessionId;const wd=async(p,m='GET',b)=>(await c.request(c.hub+'/session/'+sid+p,m,b)).value;
  if(kind==='chrome')await wd('/window/rect','POST',{width:1440,height:900});
  await wd('/timeouts','POST',{pageLoad:45000,script:30000,implicit:0});
  for(const id of ['materials','abilities','blog']){
   await c.request(c.hub+'/session/'+sid+'/url','POST',{url:pages[id].url},120000);
   const measure="return {marker:document.querySelector('.sunshine-all-sections')?.getAttribute('data-pinnacle-topic-directory'),groups:document.querySelectorAll('details.pinnacle-topic-directory').length,closed:[...document.querySelectorAll('details.pinnacle-topic-directory')].every(e=>!e.open),overflow:document.documentElement.scrollWidth>innerWidth,phone:[...document.querySelectorAll('a[href]')].some(a=>a.getAttribute('href')==='tel:+919100181181'),width:innerWidth}";
   const state=await wd('/execute/sync','POST',{script:measure,args:[]});
   await wd('/execute/sync','POST',{script:"document.querySelector('details.pinnacle-topic-directory > summary').scrollIntoView({block:'center'});return true",args:[]});
   const beforeClick=await wd('/screenshot');await fs.writeFile(path.join(out,kind+'-'+id+'-before-click.png'),Buffer.from(beforeClick,'base64'));
   const element=await wd('/element','POST',{using:'css selector',value:'details.pinnacle-topic-directory > summary'});await wd('/element/'+element['element-6066-11e4-a52e-4f735466cecf']+'/click','POST',{});
   const opened=await wd('/execute/sync','POST',{script:"const e=document.querySelector('details.pinnacle-topic-directory');return {open:e.open,visibleLink:e.querySelector('a').getBoundingClientRect().height>0,links:e.querySelectorAll('a[href]').length}",args:[]});
   const png=await wd('/screenshot');await fs.writeFile(path.join(out,kind+'-'+id+'.png'),Buffer.from(png,'base64'));
   const result={id,...state,opened,passed:state.marker==='20261008'&&state.groups===9&&state.closed&&!state.overflow&&state.phone&&opened.open&&opened.visibleLink};row.cases.push(result);await writeJson(path.join(out,'report.json'),report);console.log(JSON.stringify({kind,id,passed:result.passed,width:state.width}));
  }row.status=row.cases.every(x=>x.passed)?'passed':'failed';
 }catch(e){row.status='failed';row.error=c.redact(e.message);}finally{if(sid)await c.request(c.hub+'/session/'+sid,'DELETE').catch(()=>{});await writeJson(path.join(out,'report.json'),report);}
}
report.passed=report.sessions.length===requested.length&&report.sessions.every(s=>s.status==='passed');await writeJson(path.join(out,'report.json'),report);if(!report.passed)process.exitCode=1;return report;
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 const options=readingOptions();
 if(options.help)console.log('Usage: node scripts/testingbot-reading-directory.mjs [--chrome-only] [--receipt deployment/latest-release.json]\nEach run writes to a fresh folder and preserves the earlier physical-device report.');
 else await runReadingDirectory(options);
}
