import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

export function testingBotClient(){
  let key=process.env.TESTINGBOT_KEY,secret=process.env.TESTINGBOT_SECRET;
  if(!key||!secret){
    if(process.platform!=='win32')throw Error('TestingBot credentials are required; no unauthenticated fallback');
    const file=path.join(os.homedir(),'.testingbot','pinnacle-credentials.clixml');
    const ps="$c=Import-Clixml -LiteralPath '"+file.replaceAll("'","''")+"'; @{key=$c.UserName;secret=$c.GetNetworkCredential().Password}|ConvertTo-Json -Compress";
    ({key,secret}=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','ignore']})));
  }
  const authorization='Basic '+Buffer.from(key+':'+secret).toString('base64');
  const redact=s=>String(s).replaceAll(key,'[redacted]').replaceAll(secret,'[redacted]').replaceAll(authorization,'[redacted]');
  const request=async(url,method='GET',body,timeout=60000)=>{
    const form=body instanceof URLSearchParams;
    const r=await fetch(url,{method,headers:{Authorization:authorization,...(body?{'Content-Type':form?'application/x-www-form-urlencoded':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,redirect:'error',signal:AbortSignal.timeout(timeout)});
    const raw=await r.text();let data;try{data=JSON.parse(raw);}catch{throw Error('TestingBot returned non-JSON HTTP '+r.status);}
    if(!r.ok||data.value?.error)throw Error(redact(data.value?.message||data.error||raw).slice(0,1200));
    return data;
  };
  return {redact,request,api:(suffix,method,body)=>request('https://api.testingbot.com/v1'+suffix,method,body),
    hub:process.env.TESTINGBOT_HUB||'https://hub.testingbot.com/wd/hub'};
}

export async function writeJson(file,data){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(data,null,2)+'\n');}
