import fs from 'node:fs/promises';import path from 'node:path';
const stages=new Set(['auth','r2-cache-validation','r2-cache-rederive','r2-segment-0','r2-segment-1','r2-segment-2','source-publisher','source-publisher-read-retry','source-snapshot','source-delta','r2-source','qualify-r2','generate','resource-label-equivalence','publish']);
const summaries=r=>(r?.steps||[]).filter(s=>stages.has(s.label)).map(s=>({stage:s.label,exit:Number.isInteger(s.exitCode)?s.exitCode:null}));
const phases=new Set(['started','verified_unchanged_publication','verified_published','failed-last-good-preserved','verified','running','source-verified-pending-source-holds-or-R2-coverage','coverage-pending-last-good-preserved']);
const count=v=>Number.isSafeInteger(v)&&v>=0?v:null;
const boolean=v=>typeof v==='boolean'?v:null;
const iso=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT/.test(v)&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
const pickCounts=(value,keys)=>Object.fromEntries(keys.map(k=>[k,count(value?.[k])]));
function safeCheckpoint(value){if(!value)return null;return{...pickCounts(value,['pass','scope','page']),startedAt:iso(value.startedAt),completedAt:iso(value.completedAt),complete:boolean(value.complete),cursorPresent:boolean(value.cursorPresent)};}
function safeProof(value){
 if(!value)return null;
 const result=pickCounts(value,['totalQueriesInCycle','approvedKeys','completePasses','matchedInFirstPass','matchedInSecondPass','confirmedAbsent','stableChanges','metadataInitializations','unstableHeld','metadataPages','queriesThisInvocation','mediaBytesDownloaded','unknownKeysPersisted']);
 if(/^[a-f0-9]{64}$/.test(value.registrySHA256||''))result.registrySHA256=value.registrySHA256;
 const f=value.coverageFreshness;if(f)result.coverageFreshness={oldestPageObservedAt:iso(f.oldestPageObservedAt),newestPageObservedAt:iso(f.newestPageObservedAt),fresh:boolean(f.fresh),observedMetadataPages:count(f.observedMetadataPages),passObservations:(Array.isArray(f.passObservations)?f.passObservations:[]).slice(0,2).map(p=>({pass:count(p.pass),pages:count(p.pages),firstObservedAt:iso(p.firstObservedAt),lastObservedAt:iso(p.lastObservedAt)}))};
 return result;
}
function exceptionCategory(value){
 const known=[['unapproved-parent','New public publisher identity'],['unmapped-media','New/unmapped media reference'],['serving-proof','Fresh serving metadata'],['resource-delivery','public source HTTP'],['resource-delivery','Current serving evidence incomplete'],['video-metadata','Changed/deleted video storage'],['r2-unstable','Object metadata unstable'],['indexability','current public robots/canonical']];
 return known.find(([,prefix])=>typeof value==='string'&&value.startsWith(prefix))?.[0]||'qualification-unknown';
}
async function read(file){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch{return null;}}
export async function privateSourceDiagnostics(id,cwd=process.cwd()){
 if(!/^[a-z0-9-]{8,80}$/.test(id))throw Error('Invalid diagnostics identity');
 const job='cloud-'+id,source=await read(path.join(cwd,'outputs',job+'-source','source-release.json')),file=source?.delta?path.resolve(cwd,source.delta):null,fence=path.resolve(cwd,'ask-private',job+'-source')+path.sep;
 const delta=file?.startsWith(fence)&&file.endsWith('.json')?await read(file):null;
 return{schema:1,dispatchId:id,context:await cloudFailureContext(id,cwd),sourceExceptions:(delta?.exceptions||[]).map(x=>Object.fromEntries(['url','media_url','condition','owner','subject_sha256'].filter(k=>typeof x[k]==='string').map(k=>[k,x[k]])))};
}
export async function cloudFailureContext(id,cwd=process.cwd()){
 if(!/^[a-z0-9-]{8,80}$/.test(id))throw Error('Invalid diagnostics identity');
 const job='cloud-'+id,maintenance=await read(path.join(cwd,'outputs',job,'report.json')),source=await read(path.join(cwd,'outputs',job+'-source','source-release.json'));
 const result={maintenanceReceipt:maintenance?'present':'unavailable',sourceReceipt:source?'present':'unavailable',maintenanceStatus:phases.has(maintenance?.status)?maintenance.status:'unknown',sourcePhase:phases.has(source?.phase)?source.phase:'unknown',maintenanceSteps:summaries(maintenance),sourceSteps:summaries(source),publicationJournal:{archiveRecorded:!!source?.archive,pushRecorded:!!source?.pushed,versionRecorded:!!source?.version,deploymentRecorded:!!source?.deployment,pendingMutation:!!source?.pending}};
 const nested=await read(path.join(cwd,'outputs',job+'-source-release','publisher-event.json'))||await read(path.join(cwd,'outputs',job+'-frozen-release','publisher-event.json'));
 const release=await read(path.join(cwd,'outputs',job+'-source-release','release.json'))||await read(path.join(cwd,'outputs',job+'-frozen-release','release.json'));
 const publishStages=new Set(['capture','regenerate-publication','prepare','source','ci','upload','deploy','verify']);
 result.publicationSteps=(nested?.steps||[]).filter(s=>publishStages.has(s.label)).map(s=>({stage:s.label,exit:count(s.exitCode)}));
 const releasePhases=new Set(['captured','prepared','uploaded','deployed-awaiting-verification','verified_complete','rolled-back-verified']);
 result.publicationPhase=releasePhases.has(release?.phase)?release.phase:'unavailable';
 result.publicationJournal.versionRecorded ||= !!release?.candidateVersion;
 result.publicationJournal.deploymentRecorded ||= !!release?.deployment;
 result.publicationJournal.pendingMutation ||= !!release?.pending;
 result.coverage={r2Complete:boolean(maintenance?.r2Complete),metadataPages:count(maintenance?.r2MetadataPages),pendingR2Changes:count(maintenance?.pendingR2Changes),unstableR2Holds:count(maintenance?.unstableR2Holds),sourceExceptions:count(source?.sourceExceptions),r2Proof:safeProof(maintenance?.r2Proof),r2Checkpoint:safeCheckpoint(maintenance?.r2Checkpoint)};
 const deltaPath=source?.delta?path.resolve(cwd,source.delta):null,deltaFence=path.resolve(cwd,'ask-private',job+'-source')+path.sep;
 const delta=deltaPath?.startsWith(deltaFence)&&deltaPath.endsWith('.json')?await read(deltaPath):null;
 if(delta)result.sourceExceptionGroups=Object.entries((delta.exceptions||[]).reduce((groups,x)=>{const key=exceptionCategory(x.condition);groups[key]=(groups[key]||0)+1;return groups;},{})).map(([category,count])=>({category,count}));
 const logStep=[...(nested?.steps||[]),...(source?.steps||[]),...(maintenance?.steps||[])].find(s=>(stages.has(s.label)||publishStages.has(s.label))&&s.exitCode!==0&&s.log);
 if(logStep){const file=path.resolve(cwd,logStep.log),fences=[path.resolve(cwd,'ask-private',job)+path.sep,path.resolve(cwd,'ask-private',job+'-source')+path.sep,path.resolve(cwd,'ask-private',job+'-source-release')+path.sep,path.resolve(cwd,'ask-private',job+'-frozen-release')+path.sep];if(fences.some(p=>file.startsWith(p))&&file.endsWith('.log')){const text=await fs.readFile(file,'utf8').catch(()=>''),tail=text.slice(-16000);result.failureSignals={frames:[...tail.matchAll(/((?:r2-approved-rotation|public-source-snapshot|publish-public-source|publisher-source-maintenance|build-managed-sitemaps|release-managed-refresh)\.mjs):(\d+):(\d+)/g)].slice(0,5).map(m=>({file:m[1],line:Number(m[2]),column:Number(m[3])})),errorTypes:['AssertionError','TypeError','FileNotFoundError','PermissionError'].filter(x=>tail.includes(x)),codes:['ENOENT','EACCES','ERR_ASSERTION','ETIMEDOUT','ENOTFOUND'].filter(x=>tail.includes(x)),hints:[['r2-read-failed','R2 read failed'],['public-rpc-failed','Public source RPC failed'],['source-membership-changed','Source membership changed'],['source-unstable','Source changed between complete reads'],['wrangler-authentication','Authentication error'],['wrangler-account-selection','account ID'],['source-path-missing','No such file or directory'],['shared-template-missing',"dist/policies.html"]].filter(([,s])=>tail.includes(s)).map(([k])=>k)};}}
 return result;
}
