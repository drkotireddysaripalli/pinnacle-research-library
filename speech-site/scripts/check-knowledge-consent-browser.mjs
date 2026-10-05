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

import assert from 'node:assert/strict';
const report={at:new Date().toISOString(),url:target.href,scope:'Previously failed knowledge analytics decline control only',physicalDevice:false};let session;
try {
 const created=await request('https://hub.testingbot.com/wd/hub/session','POST',{capabilities:{alwaysMatch:{platformName:'TAHOE',browserName:'safari',browserVersion:'26','tb:options':{name:'Knowledge consent regression',build:'knowledge-consent-20261005',maxduration:120,recordVideo:true}}}},120000);
 session=created.value?.sessionId||created.sessionId;assert(session);report.sessionId=session;report.browser=created.value.capabilities.browserVersion;
 const wd=async(p,method='GET',body)=>(await request('https://hub.testingbot.com/wd/hub/session/'+session+p,method,body)).value;
 const evaluate=(script,...args)=>wd('/execute/sync','POST',{script,args});
 const click=async(selector)=>{await evaluate('document.querySelector(arguments[0]).scrollIntoView({block:"center"});return true',selector);const e=await wd('/element','POST',{using:'css selector',value:selector});await wd('/element/'+e['element-6066-11e4-a52e-4f735466cecf']+'/click','POST',{});};
 await wd('/url','POST',{url:'https://www.pinnacleblooms.org/allmirracles'});
 await click('#website-preferences>summary');await click('[data-measurement-choice=declined]');
 const state=await evaluate(`return {choice:JSON.parse(localStorage.getItem('pinnacle-speech-analytics-v1'))?.value,status:document.querySelector('[data-measurement-status]').textContent,analyticsCookies:document.cookie.split(';').some(c=>/^\\s*(?:_ga|ps_ga|_gcl_)/.test(c))}`);
 report.state=state;assert.equal(state.choice,'declined');assert.equal(state.analyticsCookies,false);assert.match(state.status,/analytics is off/i);report.passed=true;
 await fs.writeFile('deployment/knowledge-consent-safari.png',Buffer.from(await wd('/screenshot'),'base64'));
} catch(e){report.passed=false;report.error=redact(e.message);process.exitCode=1;}
finally {if(session){try {await request('https://hub.testingbot.com/wd/hub/session/'+session,'DELETE');report.sessionClosed=true;}catch(e){report.closeError=redact(e.message);await api('/tests/'+session+'/stop','PUT');}
 await api('/tests/'+session,'PUT',new URLSearchParams({'test[success]':report.passed?'1':'0','test[status_message]':report.passed?'Knowledge consent regression passed':report.error}));}}
await fs.writeFile('deployment/knowledge-consent-safari-20261005.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
