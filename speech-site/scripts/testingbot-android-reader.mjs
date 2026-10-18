// Android reader only: reuse the official scoped tunnel proven by a real device.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {pageManifest,selectCases} from '../tests/testingbot/page-manifest.mjs';
import {writeJson} from './testingbot-client.mjs';
import {nativeBlockedHosts} from './testingbot-native-policy.mjs';

export const androidReaderHosts=Object.freeze(['www.pinnacleblooms.org','pinnacleblooms.org','i.ytimg.com']);
export const androidTunnelJarSha256='171fb4012ed2375313c5b6a63c305fa1c6e33e0371c3eb4c7304ecee935492f8';
export function validateAndroidReaderConfig(config,actual){
 if(config?.schemaVersion!==1||!['javaPath','jarPath','shortSocketDir'].every(k=>typeof config[k]==='string'&&path.isAbsolute(config[k]))||config.jarSha256!==androidTunnelJarSha256||actual.jarSha256!==config.jarSha256||!/^[a-f0-9]{64}$/.test(config.javaSha256||'')||actual.javaSha256!==config.javaSha256)throw Error('Pinned Android tunnel runtime configuration is unavailable or changed; revalidate before allocation');
 return true;
}
export function readerReportCanCloseTunnel(report){
 return Boolean(report?.finishedAt&&Array.isArray(report.sessions)&&report.sessions.length&&report.sessions.every(s=>!s.sessionId?s.status==='unavailable':s.providerClosed===true));
}
export function assertOwnedReaderIdentity(owner,expected){
 if(!Number.isInteger(expected.pid)||expected.pid<=0||owner?.pid!==expected.pid||owner.identifier!==expected.identifier||owner.pidfile!==expected.pidfile||(expected.marker!==null&&!expected.marker.includes('TestingBot Tunnel, Remove this file to shutdown the tunnel')))throw Error('Owned tunnel identity/marker mismatch; no file removed');
 return true;
}
export async function ownedAndroidTunnelLifecycle(io,job){
 const owner=await io.start();let ready=false,report;
 try{await io.ready(owner);ready=true;report=await job();return report;}
 finally{if(!ready||io.providerFree===true||readerReportCanCloseTunnel(report))await io.stop(owner);else await io.hold(owner,'Provider outcome unconfirmed; retain owned tunnel and reconcile exact report before cleanup');}
}
const digest=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');
async function main(){
 const args=process.argv.slice(2),option=(name,fallback)=>{const i=args.indexOf('--'+name);return i<0?fallback:args[i+1];};
 if(option('matrix','android')!=='android')throw Error('The scoped reader wrapper covers Android only; no iOS/Safari coverage substitution');
 if(args.includes('--build')||process.env.TESTINGBOT_BASE_URL)throw Error('The scoped Android reader covers public production reads only; no candidate tunnel substitution');
 const out=path.resolve(option('out','audits/testingbot-android/'+new Date().toISOString().replace(/[:.]/g,'-'))),lifecycleDir=out+'/native-tunnel';
 for(const file of [out+'/report.json',lifecycleDir+'/ready',lifecycleDir+'/lifecycle.json'])if(await fs.stat(file).then(()=>true,()=>false))throw Error('Existing reader evidence/readiness must be reconciled; refusing to overwrite or reuse stale output');
 const suite=option('suite','bvt'),manifest=await pageManifest(),selected=selectCases(manifest,suite,{ids:option('cases','').split(',').filter(Boolean)});
 await fs.mkdir(lifecycleDir,{recursive:true});
 let config;
 try{config=JSON.parse((await fs.readFile(process.env.TESTINGBOT_ANDROID_READER_CONFIG||path.join(os.homedir(),'.testingbot','pinnacle-android-reader.json'),'utf8')).replace(/^\uFEFF/,''));validateAndroidReaderConfig(config,{javaSha256:await digest(config.javaPath),jarSha256:await digest(config.jarPath)});}
 catch(error){await writeJson(out+'/report.json',{schemaVersion:1,suite,startedAt:new Date().toISOString(),finishedAt:new Date().toISOString(),requestedMatrix:['android'],selectedIds:selected.map(r=>r.id),overall:'unavailable-essential-coverage',functionalPassed:false,sessions:[{matrix:'android',kind:'physical',status:'unavailable',cases:[],skipped:['Verified Android reader runtime configuration is unavailable; no provider allocation'],error:error.message}],declaredLimits:['Configuration absence is unavailable coverage, not a page failure or pass']});process.exitCode=1;return;}
 const credentialFile=path.join(os.homedir(),'.testingbot','pinnacle-credentials.clixml');
 let key=process.env.TESTINGBOT_KEY,secret=process.env.TESTINGBOT_SECRET;
 if(!key||!secret){if(process.platform!=='win32')throw Error('Existing TestingBot credentials are required');const command="$c=Import-Clixml -LiteralPath '"+credentialFile.replaceAll("'","''")+"'; @{key=$c.UserName;secret=$c.GetNetworkCredential().Password}|ConvertTo-Json -Compress";({key,secret}=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','ignore']})));}
 const redact=s=>String(s).replaceAll(key,'[redacted]').replaceAll(secret,'[redacted]'),identifier='pbn-android-'+process.pid+'-'+Date.now().toString(36),readyFile=lifecycleDir+'/ready';
 const properties=['tunnel-identifier = '+identifier,'bind-address = 127.0.0.1','localhost-policy = deny','se-port = 4456','localproxy = 8088','metrics-port = 8016','nobump = true','nocache = true','allow-hosts = '+androidReaderHosts.join(','),'fast-fail-regexps = '+nativeBlockedHosts.map(h=>'^'+h.replaceAll('.','\\\\.')+'$').join(','),'readyfile = '+readyFile.replaceAll('\\','/'),'log-level = info','log-http = errors'].join('\n')+'\n';
 const configFile=lifecycleDir+'/tunnel.properties';await fs.writeFile(configFile,properties);await fs.mkdir(config.shortSocketDir,{recursive:true});
 let child,exit,log,receipt={schemaVersion:1,identifier,startedAt:new Date().toISOString(),configSha256:createHash('sha256').update(properties).digest('hex'),jarSha256:config.jarSha256,javaSha256:config.javaSha256,allowHosts:androidReaderHosts,bindAddress:'127.0.0.1',localhostPolicy:'deny',credentials:'Existing protected credential; child environment only, no secret in config/arguments/logs'};
 const save=()=>writeJson(lifecycleDir+'/lifecycle.json',receipt);
 const io={
  providerFree:args.includes('--lifecycle-check'),
  start:async()=>{log=await fs.open(lifecycleDir+'/tunnel.log','a');child=spawn(config.javaPath,['-Duser.home='+lifecycleDir,'-Djdk.net.unixdomain.tmpdir='+config.shortSocketDir,'-jar',config.jarPath,'--config',configFile],{cwd:lifecycleDir,env:{...process.env,TESTINGBOT_KEY:key,TESTINGBOT_SECRET:secret},windowsHide:true,stdio:['ignore','pipe','pipe']});receipt.pid=child.pid;child.stdout.on('data',c=>log.write(redact(c)).catch(()=>{}));child.stderr.on('data',c=>log.write(redact(c)).catch(()=>{}));child.once('error',error=>{exit={at:new Date().toISOString(),error:redact(error.message),code:null};});child.once('exit',(code,signal)=>{exit={at:new Date().toISOString(),code,signal};});await save();return {pid:child.pid,identifier,pidfile:lifecycleDir+'/testingbot-tunnel-'+identifier+'.pid'};},
  ready:async()=>{for(let i=0;i<90;i++){if(exit)throw Error('Owned official tunnel exited before readiness');if(await fs.stat(readyFile).then(()=>true,()=>false)){receipt.readyAt=new Date().toISOString();await save();return;}await new Promise(r=>setTimeout(r,2000));}throw Error('Owned official tunnel readiness unavailable; no provider allocation');},
  stop:async owner=>{if(!exit){const marker=await fs.readFile(owner.pidfile,'utf8').catch(()=>null);assertOwnedReaderIdentity(owner,{pid:child.pid,identifier,pidfile:lifecycleDir+'/testingbot-tunnel-'+identifier+'.pid',marker});if(marker!==null){await fs.unlink(owner.pidfile);receipt.stopRequestedAt=new Date().toISOString();}else if(!receipt.readyAt){child.kill('SIGTERM');receipt.stopRequestedAt=new Date().toISOString();receipt.stopMethod='Stopped only exact pre-readiness owned Java child';}for(let i=0;i<45&&!exit;i++)await new Promise(r=>setTimeout(r,1000));}receipt.exit=exit||null;await save();await log?.close();if(!exit)throw Error('Owned tunnel shutdown unconfirmed; reconcile exact PID/identifier');},
  hold:async(_owner,reason)=>{receipt.cleanupHeld=reason;await save();await log?.close();child.stdout.destroy();child.stderr.destroy();child.unref();}
 };
 await ownedAndroidTunnelLifecycle(io,async()=>{if(io.providerFree){receipt.lifecycleOnly=true;receipt.providerSessionsAllocated=0;await save();return;}const forwarded=[...args];if(!args.includes('--out'))forwarded.push('--out',out);if(!args.includes('--matrix'))forwarded.push('--matrix','android');const code=await new Promise((resolve,reject)=>{const run=spawn(process.execPath,[fileURLToPath(new URL('./testingbot-suite.mjs',import.meta.url)),...forwarded],{env:{...process.env,TESTINGBOT_TUNNEL_ID:identifier},windowsHide:true,stdio:'inherit'});run.once('error',reject);run.once('close',resolve);});process.exitCode=code||0;return JSON.parse(await fs.readFile(out+'/report.json','utf8'));});
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await main();
