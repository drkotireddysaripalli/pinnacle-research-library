import {enqueueCloudSource} from './cloud-source-enqueue.mjs';
// One native source job. No model, messages, customer records or new credentials.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {createHash} from 'node:crypto';import {acquirePublisherLock} from './public-source-lock.mjs';
import {verifiedR2Source} from './verified-r2-source.mjs';
const configPath='ask-private/public-publisher-config.json',hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>fs.readFile(p,'utf8').then(JSON.parse),save=async(p,v)=>{await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,JSON.stringify(v,null,2)+'\n')};
const installedCloud=JSON.parse(await fs.readFile(configPath,'utf8')).cloud;if(installedCloud?.enabled&&process.env.PINNACLE_CLOUD_RUNNER!=='1'){console.log(JSON.stringify(await enqueueCloudSource(installedCloud)));process.exit(0);}
const now=new Date(),id=process.env.PINNACLE_SOURCE_EVENT_ID||'maintenance-'+now.toISOString().replace(/[^0-9]/g,'');assert(/^[a-z0-9-]{8,80}$/.test(id));const root=path.resolve('ask-private',id),out=path.resolve('outputs',id);await fs.mkdir(root,{recursive:true});await fs.mkdir(out,{recursive:true});
const releaseLock=acquirePublisherLock(path.resolve(process.env.PINNACLE_SOURCE_MAINTENANCE_LOCK||'../../../work/pinnacle-growth-system/native-source-maintenance.lock'),id),receipt={id,startedAt:now.toISOString(),modelCalls:0,newCredentials:false,steps:[],status:'running'},report=out+'/report.json';await save(report,receipt);
async function run(label,args){const log=root+'/'+label+'.log',stream=await fs.open(log,'w');try{const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{windowsHide:true,stdio:['ignore',stream.fd,stream.fd],env:{...process.env,PINNACLE_SOURCE_PUBLISHER_ACTIVE:'1',PINNACLE_RELEASE:'production'}});child.once('error',reject);child.once('close',resolve)});receipt.steps.push({label,exitCode:code,log,finishedAt:new Date().toISOString()});await save(report,receipt);return code;}finally{await stream.close();}}
try{
 assert.equal(await run('auth',['node_modules/wrangler/bin/wrangler.js','whoami']),0);
 const cfg=await read(configPath),approved=await read(cfg.r2_associations),registrySHA=hash(await fs.readFile(cfg.r2_associations));let r2root='ask-private/r2-approved-current';
 // The first invocation can reuse the just-verified full estate observation;
 // the receipt exposes its original time. Daily runs start a fresh cycle.
 const recent=await read(r2root+'/state.json').catch(()=>null);
 if(recent?.complete&&recent.schemaVersion===2&&recent.registrySHA256===registrySHA&&Date.now()-Date.parse(recent.completedAt)<3600000){assert.equal(await run('r2-cache-validation',['scripts/verify-r2-progress.mjs',r2root,'--require-fresh-complete']),0);assert.equal(await run('r2-cache-rederive',['scripts/r2-approved-rotation.mjs','--root',r2root]),0);const freshProof=await read(r2root+'/proof.json');assert.equal(freshProof.queriesThisInvocation,0);assert.equal(freshProof.registrySHA256,registrySHA);receipt.r2ReusedVerifiedObservation=recent.completedAt;receipt.r2QueriesThisMaintenance=0;}
 else{
  const state=await read(r2root+'/state.json').catch(()=>null);const reset=state&&(state.complete||state.schemaVersion!==2||state.registrySHA256!==registrySHA||Date.now()-Date.parse(state.startedAt)>23*3600000);const priorQueries=reset?0:state?.totalQueries||0;
  if(reset)await fs.rename(r2root,root+'/previous-r2-cycle');
  for(let segment=0;segment<3;segment++){assert.equal(await run('r2-segment-'+segment,['scripts/r2-approved-rotation.mjs','--root',r2root]),0);if((await read(r2root+'/state.json')).complete)break;}receipt.r2QueriesThisMaintenance=(await read(r2root+'/state.json')).totalQueries-priorQueries;
 }
 const r2state=await read(r2root+'/state.json');receipt.r2Complete=r2state.complete;receipt.r2MetadataPages=r2state.completedPages;receipt.r2Checkpoint={startedAt:r2state.startedAt,completedAt:r2state.completedAt||null,pass:r2state.pass,scope:r2state.scope,page:r2state.page,cursorPresent:!!r2state.cursor,complete:r2state.complete};await save(report,receipt);
 if(process.env.PINNACLE_CLOUD_RUNNER==='1'){const c=spawn(process.env.PYTHON_EXECUTABLE||'python3',['scripts/cloud-source-state.py','rotation-store'],{windowsHide:true,stdio:'inherit'});assert.equal(await new Promise((resolve,reject)=>{c.once('error',reject);c.once('close',resolve)}),0,'R2 checkpoint must persist separately from accepted publication');}let qualifiedR2;
 if(!r2state.complete){receipt.status='coverage-pending-last-good-preserved';receipt.finishedAt=new Date().toISOString();await save(report,receipt);const e=Error('Bounded R2 coverage incomplete; read-only progress persisted');e.coveragePending=true;throw e;}
 if(r2state.complete){const p=await read(r2root+'/proof.json'),delta=await read(r2root+'/qualified-changes.json');receipt.r2Proof=p;receipt.r2ObservedAt=r2state.completedAt;assert(p.coverageFreshness?.fresh,'Complete R2 metadata coverage is stale; last-good preserved');await save(report,receipt);
  // Initialization records are metadata only; never a reason to remove video.
  if(delta.initializations?.length){for(const x of delta.initializations)if(approved[x.id]&&!approved[x.id].etag)approved[x.id].etag=x.etag;cfg.r2_associations=root+'/initialized-r2-associations.json';await save(cfg.r2_associations,approved);await save(configPath,cfg);receipt.metadataInitializations=delta.initializations.length;}
  qualifiedR2=verifiedR2Source(p,delta,approved,registrySHA,r2state.completedAt);receipt.r2StableChangesDrained=qualifiedR2.totalStableChangesApplied;receipt.pendingR2Changes=qualifiedR2.remainingStableChanges;receipt.unstableR2Holds=delta.holds.length;
 }
 const sourceId=id+'-source',jobConfig={...await read(configPath)};
 if(qualifiedR2){const file=root+'/qualified-r2-source.json';await save(file,qualifiedR2);jobConfig.reuse_r2=file;}
 const jobConfigPath=root+'/job-config.json';await save(jobConfigPath,jobConfig);const args=['scripts/publish-public-source.mjs','--config',jobConfigPath,'--id',sourceId];
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
 const source=await read('outputs/'+sourceId+'/source-release.json');assert(['verified_unchanged_publication','verified_published'].includes(source.phase));receipt.sourcePhase=source.phase;receipt.sourceReceipt='outputs/'+sourceId+'/source-release.json';receipt.status=r2state.complete&&!receipt.pendingR2Changes&&!receipt.unstableR2Holds&&!source.sourceExceptions?'verified':'source-verified-pending-source-holds-or-R2-coverage';receipt.finishedAt=new Date().toISOString();await save(report,receipt);console.log(JSON.stringify({status:receipt.status,sourcePhase:source.phase,r2Complete:r2state.complete,report}));
}catch(error){receipt.status=error.coveragePending?'coverage-pending-last-good-preserved':'failed-last-good-preserved';receipt.error=error.message;receipt.finishedAt=new Date().toISOString();await save(report,receipt);process.exitCode=error.coveragePending?2:1;}
finally{releaseLock();}
