// Focused real-device regression for the changed legacy directory only.
import fs from 'node:fs/promises';import path from 'node:path';import {testingBotClient,writeJson} from './testingbot-client.mjs';
const out=path.resolve('../../../work/website-completion-20261008/testingbot-directory');await fs.mkdir(out,{recursive:true});const c=testingBotClient();
const source=JSON.parse(await fs.readFile('deployment/completion-directory-20261008.json','utf8')).commit;
const pages=JSON.parse(await fs.readFile(path.join(out,'../public-structure.json'),'utf8'));
const [devices,browsers]=await Promise.all([c.api('/devices/available'),c.api('/browsers')]);
const chrome=browsers.filter(b=>b.platform==='WIN11'&&/chrome/i.test(b.name||b.browser||'')&&/^\d/.test(b.version)).sort((a,b)=>parseFloat(b.version)-parseFloat(a.version))[0];
const ios=[22,44,33].map(id=>devices.find(d=>d.id===id&&d.platform_name==='iOS')).find(Boolean)||devices.find(d=>d.platform_name==='iOS'&&d.name.includes('iPhone'));
const report={at:new Date().toISOString(),source,scope:'Three changed reading families; Chrome/Windows and a physical iPhone/Safari. No actual contact, login or lead submission.',sessions:[]};
for(const [kind,d] of [['chrome',chrome],['ios',ios]]){
 const row={kind,device:d?.name,version:d?.version,cases:[]};report.sessions.push(row);if(!d){row.status='unavailable';continue;}let sid;
 try{
  const cap=kind==='ios'?{platformName:'iOS',browserName:'safari','appium:automationName':'XCUITest','appium:deviceName':d.name,'appium:platformVersion':d.version,'appium:newCommandTimeout':90,'tb:options':{realDevice:true,name:'Pinnacle directory '+source.slice(0,10),screenrecorder:true,maxduration:600}}:{platformName:'WIN11',browserName:'chrome',browserVersion:d.version,'tb:options':{name:'Pinnacle directory '+source.slice(0,10),screenrecorder:true,'screen-resolution':'1440x900',maxduration:600}};
  const created=await c.request(c.hub+'/session','POST',{capabilities:{alwaysMatch:cap}});sid=created.value.sessionId;const wd=async(p,m='GET',b)=>(await c.request(c.hub+'/session/'+sid+p,m,b)).value;
  if(kind==='chrome')await wd('/window/rect','POST',{width:390,height:844});
  for(const id of ['materials','abilities','blog']){
   await wd('/url','POST',{url:pages[id].url});
   const measure="return {marker:document.querySelector('.sunshine-all-sections')?.getAttribute('data-pinnacle-topic-directory'),groups:document.querySelectorAll('details.pinnacle-topic-directory').length,closed:[...document.querySelectorAll('details.pinnacle-topic-directory')].every(e=>!e.open),overflow:document.documentElement.scrollWidth>innerWidth,phone:[...document.querySelectorAll('a[href]')].some(a=>a.getAttribute('href')==='tel:+919100181181'),width:innerWidth}";
   const state=await wd('/execute/sync','POST',{script:measure,args:[]});
   const element=await wd('/element','POST',{using:'css selector',value:'details.pinnacle-topic-directory > summary'});await wd('/element/'+element['element-6066-11e4-a52e-4f735466cecf']+'/click','POST',{});
   const opened=await wd('/execute/sync','POST',{script:"const e=document.querySelector('details.pinnacle-topic-directory');return {open:e.open,visibleLink:e.querySelector('a').getBoundingClientRect().height>0,links:e.querySelectorAll('a[href]').length}",args:[]});
   const png=await wd('/screenshot');await fs.writeFile(path.join(out,kind+'-'+id+'.png'),Buffer.from(png,'base64'));
   const result={id,...state,opened,passed:state.marker==='20261008'&&state.groups===9&&state.closed&&!state.overflow&&state.phone&&opened.open&&opened.visibleLink};row.cases.push(result);await writeJson(path.join(out,'report.json'),report);console.log(JSON.stringify({kind,id,passed:result.passed,width:state.width}));
  }row.status=row.cases.every(x=>x.passed)?'passed':'failed';
 }catch(e){row.status='failed';row.error=c.redact(e.message);}finally{if(sid)await c.request(c.hub+'/session/'+sid,'DELETE').catch(()=>{});await writeJson(path.join(out,'report.json'),report);}
}
report.passed=report.sessions.length===2&&report.sessions.every(s=>s.status==='passed');await writeJson(path.join(out,'report.json'),report);if(!report.passed)process.exitCode=1;
