// One hosted Chrome diagnostic. Stops at Google; never enters an identity or sends an OTP.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const credentialFile=path.join(os.homedir(),'.testingbot','pinnacle-credentials.clixml');
const ps="$c=Import-Clixml -LiteralPath '"+credentialFile.replaceAll("'","''")+"'; @{key=$c.UserName;secret=$c.GetNetworkCredential().Password}|ConvertTo-Json -Compress";
const {key,secret}=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','ignore']}));
const authorization='Basic '+Buffer.from(key+':'+secret).toString('base64');
async function request(url,method='GET',body){const r=await fetch(url,{method,headers:{authorization,'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(60000),redirect:'error'});const j=await r.json();if(!r.ok||j.value?.error)throw Error('Hosted browser request failed: '+r.status+' '+(j.value?.error||''));return j;}
const user=await request('https://api.testingbot.com/v1/user');assert(Number(user.seconds)>90,'Insufficient existing device-test allowance');
const result={at:new Date().toISOString(),scope:'Public account layout and Google redirect only; no identity, OTP or lead submitted',screenshots:[]};
let session;
const wd=async(suffix,method='GET',body)=>(await request('https://hub.testingbot.com/wd/hub/session/'+session+suffix,method,body)).value;
try{
 const created=await request('https://hub.testingbot.com/wd/hub/session','POST',{capabilities:{alwaysMatch:{platformName:'WIN11',browserName:'chrome',browserVersion:'153','tb:options':{name:'Ask Google redirect diagnostic',build:'ask-auth-20261003',maxduration:180,idleTimeout:60,recordVideo:true}}}});
 session=created.value?.sessionId||created.sessionId;assert(session);result.sessionId=session;
 await wd('/timeouts','POST',{pageLoad:40000,script:10000,implicit:2000});
 await wd('/window/rect','POST',{width:1440,height:1000});
 await wd('/url','POST',{url:'https://pinnacleblooms.org/ask/account'});
 for(const width of [1440,768,390]){
  await wd('/window/rect','POST',{width,height:1000});
  await wd('/execute/sync','POST',{script:"document.querySelector('.ask-account-card').scrollIntoView({block:'start'});return true",args:[]});
  const file='reviews/ask-account-hosted-'+width+'-20261003.png';await fs.writeFile(file,Buffer.from(await wd('/screenshot'),'base64'));result.screenshots.push(file);
 }
 const el=await wd('/element','POST',{using:'css selector',value:'form[action="/ask/auth/google"] button'});
 await wd('/element/'+el['element-6066-11e4-a52e-4f735466cecf']+'/click','POST',{});
 const url=new URL(await wd('/url'));result.destination=url.origin+url.pathname;
 result.title=await wd('/title');
 result.reachedGoogle=url.hostname==='accounts.google.com';
 const file='reviews/ask-google-hosted-redirect-20261003.png';await fs.writeFile(file,Buffer.from(await wd('/screenshot'),'base64'));result.screenshots.push(file);
 console.log(JSON.stringify(result));
 assert(result.reachedGoogle,'Native form did not reach Google; inspect captured screenshot');
}finally{
 if(session)await wd('','DELETE').catch(()=>{});
 await fs.writeFile('deployment/ask-oauth-hosted-diagnostic-20261003.json',JSON.stringify(result,null,2)+'\n');
}
