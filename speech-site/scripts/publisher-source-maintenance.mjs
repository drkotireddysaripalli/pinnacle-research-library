// One native source job. No model, messages, customer records or new credentials.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {createHash} from 'node:crypto';import {acquirePublisherLock} from './public-source-lock.mjs';
const configPath='ask-private/public-publisher-config.json',hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>fs.readFile(p,'utf8').then(JSON.parse),save=async(p,v)=>{await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,JSON.stringify(v,null,2)+'\n')};
const now=new Date(),id='maintenance-'+now.toISOString().replace(/[^0-9]/g,''),root=path.resolve('ask-private',id),out=path.resolve('outputs',id);await fs.mkdir(root,{recursive:true});await fs.mkdir(out,{recursive:true});
const releaseLock=acquirePublisherLock(path.resolve('../../../work/pinnacle-growth-system/native-source-maintenance.lock'),id),receipt={id,startedAt:now.toISOString(),modelCalls:0,newCredentials:false,steps:[],status:'running'},report=out+'/report.json';await save(report,receipt);
async function run(label,args){const log=root+'/'+label+'.log',stream=await fs.open(log,'w');try{const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{windowsHide:true,stdio:['ignore',stream.fd,stream.fd],env:{...process.env,PINNACLE_SOURCE_PUBLISHER_ACTIVE:'1',PINNACLE_RELEASE:'production'}});child.once('error',reject);child.once('close',resolve)});receipt.steps.push({label,exitCode:code,log,finishedAt:new Date().toISOString()});await save(report,receipt);return code;}finally{await stream.close();}}
try{
 assert.equal(await run('auth',['node_modules/wrangler/bin/wrangler.js','whoami']),0);
 const cfg=await read(configPath),approved=await read(cfg.r2_associations),registrySHA=hash(await fs.readFile(cfg.r2_associations));let r2root='ask-private/r2-approved-current';
 // The first invocation can reuse the just-verified full estate observation;
 // the receipt exposes its original time. Daily runs start a fresh cycle.
 const initial='ask-private/r2-approved-coverage-20261014',seed=await read(initial+'/state.json').catch(()=>null);
 if(seed?.complete&&seed.registrySHA256===registrySHA&&Date.now()-Date.parse(seed.completedAt)<3600000){r2root=initial;receipt.r2ReusedVerifiedObservation=seed.completedAt;}
 else{
  const state=await read(r2root+'/state.json').catch(()=>null);
  if(state&&(state.complete||state.registrySHA256!==registrySHA))await fs.rename(r2root,root+'/previous-r2-cycle');
  for(let segment=0;segment<3;segment++){assert.equal(await run('r2-segment-'+segment,['scripts/r2-approved-rotation.mjs','--root',r2root]),0);if((await read(r2root+'/state.json')).complete)break;}
 }
 const r2state=await read(r2root+'/state.json');receipt.r2Complete=r2state.complete;receipt.r2MetadataPages=r2state.completedPages;
 let events=[];
 if(r2state.complete){const p=await read(r2root+'/proof.json'),delta=await read(r2root+'/qualified-changes.json');receipt.r2Proof=p;receipt.r2ObservedAt=r2state.completedAt;
  // Initialization records are metadata only; never a reason to remove video.
  if(delta.initializations?.length){for(const x of delta.initializations)if(approved[x.id]&&!approved[x.id].etag)approved[x.id].etag=x.etag;cfg.r2_associations=root+'/initialized-r2-associations.json';await save(cfg.r2_associations,approved);await save(configPath,cfg);receipt.metadataInitializations=delta.initializations.length;}
  events=delta.changes.slice(0,128).map(x=>{const i=x.id.indexOf('/');return {bucket:x.id.slice(0,i),key:x.id.slice(i+1),operation:x.operation};});receipt.pendingR2Changes=Math.max(0,delta.changes.length-events.length);receipt.unstableR2Holds=delta.holds.length;
 }
 const sourceId=id+'-source',args=['scripts/publish-public-source.mjs','--config',configPath,'--id',sourceId];
 if(events.length){const file=root+'/r2-events.json';await save(file,{schema_version:1,event_id:id,objects:events});args.push('--r2-events',file);}
 let code=await run('source-publisher',args);
 if(code!==0){
  const failed=await read('outputs/'+sourceId+'/source-release.json').catch(()=>null);
  // Retry only a completed read-only failure. Any possible publication/Git
  // mutation keeps its exact journal and requires reconciliation.
  if(failed?.phase==='started'&&!failed.archive&&!failed.pushed&&!failed.version){
   const latest=await read(configPath),owner=await read(latest.global_lock+'/owner.json');assert.equal(owner.id,sourceId);
   try{process.kill(owner.pid,0);throw Error('Failed child remains active');}catch(error){assert.equal(error.code,'ESRCH');}
   await fs.rename(latest.global_lock,root+'/failed-read-lock');receipt.readOnlyFailureReconciled=true;await save(report,receipt);
   await new Promise(resolve=>setTimeout(resolve,15000));code=await run('source-publisher-read-retry',args);
  }
 }
 if(code!==0){receipt.status='failed-last-good-preserved';receipt.sourceReceipt='outputs/'+sourceId+'/source-release.json';throw Error('Source publisher failed; exact checkpoint retained');}
 const source=await read('outputs/'+sourceId+'/source-release.json');assert(['verified_unchanged_publication','verified_published'].includes(source.phase));receipt.sourcePhase=source.phase;receipt.sourceReceipt='outputs/'+sourceId+'/source-release.json';receipt.status=r2state.complete?'verified':'source-verified-r2-rotation-pending';receipt.finishedAt=new Date().toISOString();await save(report,receipt);console.log(JSON.stringify({status:receipt.status,sourcePhase:source.phase,r2Complete:r2state.complete,report}));
}catch(error){receipt.status='failed-last-good-preserved';receipt.error=error.message;receipt.finishedAt=new Date().toISOString();await save(report,receipt);process.exitCode=1;}
finally{releaseLock();}
