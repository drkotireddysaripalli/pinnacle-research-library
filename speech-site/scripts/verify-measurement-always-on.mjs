import fs from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawn, execFileSync} from 'node:child_process';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const canonical=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
export const acceptanceInputDigest=value=>sha(canonical(value));
const inside=(file,directory)=>file===directory||file.startsWith(directory+path.sep);
export async function assertAcceptancePath(file,workspace,{allowOutside=false}={}){
 const absolute=path.resolve(file),stat=await fs.lstat(absolute),real=await fs.realpath(absolute),root=await fs.realpath(workspace);
 if(stat.isSymbolicLink()||!allowOutside&&!inside(real,root))throw Error('Acceptance path escapes its workspace or is linked: '+absolute);
 return stat;
}
export function createAcceptanceFileHasher(workspace){
 const cache=new Map();return async(file,{required=false,allowOutside=false}={})=>{
  let stat;try{stat=await fs.lstat(file,{bigint:true});}catch(error){if(error.code==='ENOENT'&&!required)return {path:path.relative(workspace,file).split(path.sep).join('/'),missing:true};throw error;}
  await assertAcceptancePath(file,workspace,{allowOutside});if(!stat.isFile())throw Error('Expected a regular acceptance file: '+file);
  const key=[stat.dev,stat.ino,stat.size,stat.mtimeNs,stat.ctimeNs].join(':');if(cache.get(file)?.key===key)return cache.get(file).value;
  const value={path:path.relative(workspace,file).split(path.sep).join('/'),bytes:Number(stat.size),sha256:sha(await fs.readFile(file))};cache.set(file,{key,value});return value;
 };
}
export async function checkAcceptanceReuse({schemaVersion,stage,old,inputFingerprint,verifyEvidence}){
 if(schemaVersion!==2)return 'Legacy receipt has no verified input/evidence fingerprint';
 if(stage.reusable===false)return 'Stage depends on current Git state or unpinned remote Google libraries';
 if(old.exitCode!==0)return 'Previous execution failed';
 if(old.inputFingerprint!==inputFingerprint)return 'Relevant source/dependency/configuration/acceptance input changed';
 if(!old.log?.sha256||!old.evidence?.length)return 'Previous receipt has no hashed log/evidence';
 for(const saved of [old.log,...old.evidence])if(!await verifyEvidence(saved))return 'Saved evidence missing or changed: '+saved.path;
 return null;
}

export async function main(){
const root=process.cwd(),parent=path.dirname(root);
const option=(name,fallback=null)=>{const index=process.argv.indexOf('--'+name);if(index<0)return fallback;const value=process.argv[index+1];if(!value||value.startsWith('--'))throw Error('--'+name+' needs a value');return value;};
const focused=process.argv.includes('--focused'),skipBuild=process.argv.includes('--no-build'),resume=process.argv.includes('--resume');
const evidenceDir=path.resolve(process.env.MEASUREMENT_ALWAYS_ON_EVIDENCE_DIR||path.join(parent,'artifacts/measurement-always-on-20261020',focused?'focused':'final'));
const contractPath=path.resolve(option('contract',path.join(root,'scripts/measurement-acceptance-contract.json')));
// This optional file must be a public deployment/configuration fingerprint receipt, never a credential file.
const contextPath=option('context')?path.resolve(option('context')):null;
const externalPath=option('external-evidence')?path.resolve(option('external-evidence')):null;
const scriptPath=fileURLToPath(import.meta.url),digest=acceptanceInputDigest,json=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const save=async(file,value)=>{const temporary=file+'.tmp-'+process.pid;await fs.writeFile(temporary,JSON.stringify(value,null,2)+'\n');await fs.rename(temporary,file);};
const git=args=>execFileSync('git',args,{cwd:parent,encoding:'utf8',maxBuffer:16*1024*1024}).trim();
const relative=file=>path.relative(parent,file).split(path.sep).join('/');
await fs.mkdir(evidenceDir,{recursive:true});
const contract=await json(contractPath);
if(contract.schemaVersion!==1||!Array.isArray(contract.wireRequirements)||!Array.isArray(contract.externalRequirements))throw Error('Invalid measurement acceptance contract');
const runtime={node:process.version,versions:process.versions,platform:process.platform,arch:process.arch,execPath:process.execPath,execArgvSha256:digest(process.execArgv)};
const context=contextPath?{path:contextPath,sha256:sha(await fs.readFile(contextPath))}:null;
const recordedEnv=Object.fromEntries(['CI','NODE_ENV','PINNACLE_RELEASE'].map(key=>[key,process.env[key]??null]));
// These values can contain local paths; retain only hashes and never enumerate unrelated environment variables.
const environmentHashes=Object.fromEntries(['NODE_OPTIONS','TZ','LANG','LC_ALL','PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD'].map(key=>[key,process.env[key]===undefined?null:sha(process.env[key])]));
const fixturePaths=[
 'speech-site/ask-private/acquisition-receiver-20261007/index.js',
 'speech-site/ask-private/book-store-choices-20261009/public-before.json',
 'speech-site/ask-private/six-step-release-20261006/page-6.html'
];
// Enumerate only versioned/public source roots and exact known optional fixtures. Never recurse private stores, caches or user data.
const sourceRoots=['speech-site/src','speech-site/public','speech-site/scripts','speech-site/tests','speech-site/deployment','verify-site/content','verify-site/scripts','helpline-site'];
for(const directory of sourceRoots){try{await assertAcceptancePath(path.join(parent,directory),parent);}catch(error){if(error.code!=='ENOENT')throw error;}}
const generatedObservations=new Set(['helpline-site/phone-analytics-test-results.json','helpline-site/measurement-browser-receipt-20260925.json']);
const sourceFiles=()=>git(['ls-files','-z','--cached','--others','--exclude-standard','--',...sourceRoots]).split('\0').filter(Boolean).filter(file=>!generatedObservations.has(file)&&!/(?:^|\/)(?:node_modules|\.git|\.astro|\.wrangler|outputs|artifacts|release[^/]*|dist|ask-private|intake)(?:\/|$)/.test(file));
const packageFiles=['speech-site/package.json','speech-site/package-lock.json','speech-site/node_modules/.package-lock.json','speech-site/node_modules/playwright-core/browsers.json','speech-site/astro.config.mjs','speech-site/astro.ask.config.mjs','speech-site/tsconfig.json','speech-site/playwright.config.mjs','speech-site/wrangler.ask.jsonc','verify-site/package.json','verify-site/package-lock.json','helpline-site/package.json','helpline-site/package-lock.json'];
const fixedFiles=[...packageFiles,...fixturePaths];
const code=/\.(?:mjs|cjs|js|ts|tsx|astro|json|jsonc|css|html|toml|yaml|yml|md)$/;
const measurementName=/(?:measurement|protection|cheq|contact|enrolment|enroll|acquisition|attribution|public-ad-call|ad-call|ads-consent|homepage|paid-locality|centre-operating|centre-measurement|shared-assets|shared-navigation|pinnacle-route|speech-handler|legacy-payload|legacy-measurement)/i;
const inputSets=tracked=>({
 portal:tracked.filter(file=>file.startsWith('speech-site/src/')||file.startsWith('speech-site/public/')||file.startsWith('speech-site/deployment/')&&code.test(file)||file.startsWith('speech-site/scripts/')&&code.test(file)),
 tests:tracked.filter(file=>code.test(file)&&file.startsWith('speech-site/')),
 measurement:tracked.filter(file=>code.test(file)&&(measurementName.test(file)||file.startsWith('speech-site/tests/fixtures/')||file.startsWith('speech-site/src/data/'))),
 helpline:tracked.filter(file=>code.test(file)&&(file.startsWith('helpline-site/')||file.startsWith('speech-site/')&&measurementName.test(file))),
 verify:tracked.filter(file=>file.startsWith('verify-site/')&&code.test(file))
});
const hasher=createAcceptanceFileHasher(parent);
const fileHash=(file,required=false,explicitEvidence=false)=>hasher(file,{required,allowOutside:explicitEvidence||file===contextPath||file===externalPath||inside(path.resolve(file),evidenceDir)});
async function walkFiles(directory){
 try{await assertAcceptancePath(directory,parent,{allowOutside:inside(path.resolve(directory),evidenceDir)});}catch(error){if(error.code==='ENOENT')return [];throw error;}
 const files=[];for(const entry of await fs.readdir(directory,{withFileTypes:true}).catch(error=>{if(error.code==='ENOENT')return [];throw error;})){
  const file=path.join(directory,entry.name);if(entry.isDirectory())files.push(...await walkFiles(file));else if(entry.isFile())files.push(file);else throw Error('Unexpected linked acceptance output: '+file);
 }return files.sort();
}
const buildStages=[
 {name:'production-build',cwd:root,command:'npm',args:['run','build'],env:{PINNACLE_RELEASE:'production'},inputs:['portal'],outputs:[path.join(root,'dist')],requires:['speech-site/package.json']},
 {name:'verify-build',cwd:path.join(parent,'verify-site'),command:process.execPath,args:['scripts/build-content.cjs'],inputs:['verify'],outputs:[path.join(parent,'verify-site/dist')],requires:['verify-site/scripts/build-content.cjs']},
 {name:'helpline-build',cwd:path.join(parent,'helpline-site'),command:process.execPath,args:['build.mjs'],inputs:['helpline'],outputs:['page.html','preview.html','phone-analytics.js','worker.mjs'].map(name=>path.join(parent,'helpline-site',name)),requires:['helpline-site/build.mjs']}
];
const focusedTests=['test-measurement.mjs','test-protection-consumer.mjs','test-cheq-protection.mjs','test-protection-csp.mjs','test-homepage-measurement-transform.mjs','test-homepage-intake-source.mjs','test-book-attribution.mjs','test-contact-receipt.mjs','test-enrolment.mjs','test-enrolment-receipt.mjs','test-form-reliability.mjs','test-paid-locality.mjs','test-public-ad-call.mjs','test-ad-call-consent.mjs','test-ads-consent-wrapper.mjs','test-centre-measurement.mjs','test-legacy-measurement.mjs','test-public-measurement-wrapper.mjs'];
const stages=[
 ...(!skipBuild?buildStages:[]),
 {name:'acceptance-runner-tests',cwd:root,command:process.execPath,args:['--test','scripts/test-measurement-acceptance-runner.mjs'],inputs:['measurement'],requires:['speech-site/scripts/test-measurement-acceptance-runner.mjs']},
 ...(focused?[{name:'focused-unit-tests',cwd:root,command:process.execPath,args:['--test',...focusedTests.map(name=>'scripts/'+name)],inputs:['measurement'],builtInputs:['portal','verify','helpline'],requires:focusedTests.map(name=>'speech-site/scripts/'+name)}]:[
  {name:'unit-tests',cwd:root,command:'npm',args:['run','test:unit'],inputs:['tests','helpline','verify'],builtInputs:['portal','verify','helpline']},
  {name:'measurement-integration',cwd:root,command:process.execPath,args:['--test','scripts/test-homepage-measurement-transform.mjs','scripts/test-book-attribution.mjs'],inputs:['measurement']}
 ]),
 {name:'helpline-acquisition',cwd:root,command:process.execPath,args:['--test','scripts/test-helpline-acquisition.mjs'],inputs:['helpline','measurement']},
 {name:'shared-assets',cwd:root,command:'npm',args:['run','test:shared-assets-repair'],inputs:['measurement']},
 {name:'helpline-tests',cwd:path.join(parent,'helpline-site'),command:process.execPath,args:['phone-analytics-tests.mjs'],inputs:['helpline']},
 ...(!focused?[{name:'types',cwd:root,command:'npm',args:['run','check:types'],inputs:['portal']}]:[]),
 {name:'runtime-scan',cwd:root,command:process.execPath,args:['scripts/check-measurement-always-on-runtime.mjs'],inputs:['measurement'],builtInputs:['portal','verify','helpline'],parseStdout:true},
 {name:'browser-contract',cwd:root,command:process.execPath,args:['scripts/test-measurement-always-on-browser.mjs'],inputs:['measurement'],builtInputs:['portal'],parseStdout:true},
 {name:'shared-asset-browser-contract',cwd:root,command:process.execPath,args:['scripts/check-shared-assets-browser.mjs'],inputs:['measurement'],outputs:[path.join(root,'outputs/semrush-assets-20261012')],report:path.join(root,'outputs/semrush-assets-20261012/browser-fixture.json')},
 {name:'accepted-contact-receipt-browser-contract',cwd:root,command:process.execPath,args:['scripts/check-contact-receipt-browser.mjs','--out',path.join(evidenceDir,'contact-browser')],inputs:['measurement'],outputs:[path.join(evidenceDir,'contact-browser')],report:path.join(evidenceDir,'contact-browser/browser-proof.json')},
 // The real Google libraries run, but the existing harness intercepts measurement/intake transports. It must never submit a fake production lead.
 {name:'google-wire',cwd:root,command:process.execPath,args:['scripts/verify-google-click-wire.mjs',path.join(evidenceDir,'google-wire.json'),'--dist'],inputs:['measurement'],builtInputs:['portal','helpline','verify'],outputs:[path.join(evidenceDir,'google-wire.json')],report:path.join(evidenceDir,'google-wire.json'),reusable:false},
 {name:'diff-check',cwd:parent,command:'git',args:['diff','--check','--','.'],inputs:['tests','helpline','verify'],reusable:false}
];
const builtFiles=async names=>{
 const files=[];for(const name of names||[]){if(name==='portal')files.push(...await walkFiles(path.join(root,'dist')));if(name==='verify')files.push(...await walkFiles(path.join(parent,'verify-site/dist')));if(name==='helpline')files.push(...['page.html','preview.html','phone-analytics.js','worker.mjs'].map(file=>path.join(parent,'helpline-site',file)));}return files;
};
async function fingerprint(stage){
 const sets=inputSets(sourceFiles());
 const files=new Set([...fixedFiles,...(stage.inputs||[]).flatMap(name=>sets[name]),...(stage.requires||[])].map(file=>path.join(parent,file)));
 for(const file of [scriptPath,contractPath,...(contextPath?[contextPath]:[]),...await builtFiles(stage.builtInputs)])files.add(file);
 const required=new Set((stage.requires||[]).map(file=>path.join(parent,file)));const inputs=[];
 for(const file of [...files].sort())inputs.push(await fileHash(file,required.has(file)));
 const descriptor={name:stage.name,command:stage.command,args:stage.args.map(value=>value.replaceAll(evidenceDir,'<EVIDENCE_DIR>')),cwd:relative(stage.cwd),env:{...recordedEnv,...stage.env},environmentHashes,runtime,context,acceptanceVersion:contract.acceptanceVersion,inputs};
 return {sha256:digest(descriptor),descriptor};
}
const source={commit:git(['rev-parse','HEAD']),gitTree:git(['rev-parse','HEAD^{tree}']),trackedDirty:git(['status','--porcelain=v1','--untracked-files=no']).split('\n').filter(Boolean),runtime,context};
let previous=null;if(resume)try{previous=await json(path.join(evidenceDir,'receipt.json'));}catch(error){if(error.code!=='ENOENT')throw error;}
const receipt={schemaVersion:2,startedAt:new Date().toISOString(),root,evidenceDir,mode:focused?'focused':'full',skipBuild,source,contract:{path:contractPath,sha256:sha(await fs.readFile(contractPath)),acceptanceVersion:contract.acceptanceVersion},resumedFrom:previous?{schemaVersion:previous.schemaVersion,startedAt:previous.startedAt}:null,stages:[],invalidations:[],executablePassed:false,overallComplete:false};
async function outputHashes(stage){
 const files=[];for(const file of stage.outputs||[]){const stat=await fs.stat(file).catch(error=>{if(error.code==='ENOENT')return null;throw error;});if(!stat)throw Error('Expected evidence output missing: '+file);files.push(...(stat.isDirectory()?await walkFiles(file):[file]));}
 return Promise.all([...new Set(files)].sort().map(file=>fileHash(file,true)));
}
async function canReuse(stage,input){
 const old=previous?.stages?.find(item=>item.name===stage.name);
 if(!resume||!old)return null;
 const reason=await checkAcceptanceReuse({schemaVersion:previous.schemaVersion,stage,old,inputFingerprint:input.sha256,verifyEvidence:async saved=>{const actual=await fileHash(path.join(parent,saved.path));return !actual.missing&&actual.sha256===saved.sha256;}});
 if(reason){receipt.invalidations.push({stage:stage.name,reason});return null;}
 return {...old,reused:true,reusedAt:new Date().toISOString(),reusedFromStartedAt:previous.startedAt};
}
function parseLastJson(text){
 const lines=text.trim().split('\n');for(let index=lines.length-1;index>=0;index--){if(!lines[index].trimStart().startsWith('{'))continue;try{return JSON.parse(lines.slice(index).join('\n'));}catch{}}return null;
}
async function run(stage,input){
 const startedAt=new Date().toISOString(),logPath=path.join(evidenceDir,stage.name+'.log');
 const output=createWriteStream(logPath,{flags:'w'});const endLog=()=>new Promise((resolve,reject)=>{output.once('error',reject);output.end(resolve);});
 const result=await new Promise(resolve=>{
  let error=null;const child=spawn(stage.command,stage.args,{cwd:stage.cwd,env:{...process.env,...stage.env},stdio:['ignore','pipe','pipe']});
  const record=chunk=>{output.write(chunk);process.stdout.write(chunk);};child.stdout.on('data',record);child.stderr.on('data',record);
  child.on('error',failure=>{error=String(failure.message);record(Buffer.from(error+'\n'));});
  child.on('close',(code,signal)=>resolve({name:stage.name,command:[stage.command,...stage.args].join(' '),cwd:stage.cwd,startedAt,completedAt:new Date().toISOString(),exitCode:code??1,signal,error,inputFingerprint:input.sha256,inputManifest:input.descriptor,reused:false}));
 });
 await endLog();result.log=await fileHash(logPath,true);
 try{
  result.evidence=await outputHashes(stage);if(!result.evidence.length)result.evidence=[result.log];
  result.report=stage.report?await json(stage.report):stage.parseStdout?parseLastJson(await fs.readFile(logPath,'utf8')):null;
  // A concurrent edit or a non-idempotent generator must not make an old execution appear current.
  const after=await fingerprint(stage);if(after.sha256!==input.sha256){result.exitCode=1;result.error='Acceptance inputs changed during the stage; rerun the affected stage on stable inputs';result.inputFingerprintAfter=after.sha256;}
 }catch(error){result.exitCode=1;result.error=String(error.message);result.evidence||=[result.log];}
 return result;
}
async function coverage(){
 const rows=stages.map(plan=>{const stage=receipt.stages.find(item=>item.name===plan.name);return {id:'execution:'+plan.name,layer:'local-execution',status:!stage?'Not tested':stage.exitCode===0?'Pass':'Fail',assertion:'The declared existing stage completed successfully; semantic scope is limited to its recorded assertions.',pageFamilies:[],devices:[],stage:plan.name,inputFingerprint:stage?.inputFingerprint||null,evidence:stage?[stage.log,...(stage.evidence||[])]:[],reused:stage?.reused||false};});
 for(const requirement of contract.wireRequirements){
  const requiredStage=requirement.stage||'google-wire',wire=receipt.stages.find(stage=>stage.name===requiredStage),reported=wire?.report?.requirements||[];
  const matches=reported.filter(item=>item.id===requirement.id),claim=matches.length===1?matches[0]:null;
  let status=claim&&contract.statuses.includes(claim.status)?claim.status:'Not tested';
  if(wire?.exitCode!==0&&status==='Pass')status='Fail';
  // Every required semantic assertion must carry actual family/device scope, not just a stage exit code.
  if(status==='Pass'&&(!claim.assertion||!claim.pageFamilies?.length||!claim.devices?.length))status='Fail';
  rows.push({...requirement,status,pageFamilies:claim?.pageFamilies||[],devices:claim?.devices||[],assertion:claim?.assertion||requirement.assertion,stage:requiredStage,inputFingerprint:wire?.inputFingerprint||null,evidence:wire?[wire.log,...(wire.evidence||[])]:[],evidencePaths:claim?.evidencePaths||[],reason:matches.length>1?'Duplicate requirement ID':!claim?'No explicit assertion result from '+requiredStage:status==='Fail'&&claim.status==='Pass'?'Claim lacks required scope or its stage failed':claim.reason||null});
 }
 const external=externalPath?await json(externalPath):null;
 for(const requirement of contract.externalRequirements){
  const claim=external?.requirements?.find(item=>item.id===requirement.id);let status=requirement.defaultStatus,evidence=[],reason='No current, explicit native/receiving owner evidence attached';
  if(claim){
   if(!contract.statuses.includes(claim.status))throw Error('Invalid external status: '+requirement.id);
   // Native receipts are separate, explicit owner attestations. Local loader/dispatch success cannot create a native Pass.
   const scopeMatches=external.schemaVersion===1&&external.acceptanceVersion===contract.acceptanceVersion&&external.sourceCommit===source.commit&&context?.sha256&&external.contextSha256===context.sha256;
   for(const proof of claim.evidence||[]){if(!proof.path||!proof.sha256)continue;const actual=await fileHash(path.resolve(path.dirname(externalPath),proof.path),false,true);if(actual.sha256===proof.sha256)evidence.push(actual);}
   if(scopeMatches&&evidence.length&&claim.observedAt&&claim.owner&&claim.assertion){status=claim.status;reason=claim.reason||null;}else reason='External claim is missing matching source/config scope, dated owner attestation, or hash-verified proof';
  }
  rows.push({...requirement,status,assertion:claim?.assertion||requirement.assertion,pageFamilies:claim?.pageFamilies||[],devices:claim?.devices||[],owner:claim?.owner||requirement.owner,observedAt:claim?.observedAt||null,evidence,reason});
 }
 const required=rows.filter(row=>row.layer!=='local-execution'&&!contract.externalRequirements.some(item=>item.id===row.id));
 const executablePassed=receipt.stages.length===stages.length&&receipt.stages.every(stage=>stage.exitCode===0)&&required.every(row=>row.status==='Pass');
 const counts=Object.fromEntries(contract.statuses.map(status=>[status,rows.filter(row=>row.status===status).length]));
 const report={schemaVersion:1,at:new Date().toISOString(),mode:receipt.mode,skipBuild,source,acceptance:receipt.contract,sourceInputDigest:digest(receipt.stages.map(stage=>({name:stage.name,sha256:stage.inputFingerprint}))),executablePassed,overallComplete:!skipBuild&&executablePassed&&rows.every(row=>row.status==='Pass'),counts,requirements:rows.map(row=>({...row,sourceCommit:source.commit,contextSha256:context?.sha256||null,acceptanceSha256:receipt.contract.sha256,runtimeSha256:digest(runtime)})),externalEvidenceFile:externalPath?await fileHash(externalPath,true):null,limits:['Contained measurement/intake transports do not prove provider receipt, Ads import, a genuine lead or staff acknowledgement.','Desktop WebKit is not physical iOS.','Unpinned remote Google-wire evidence is not reused by --resume.',...(skipBuild?['--no-build deliberately skips compilation provenance; this invocation alone cannot establish overall completion.']:[])]};
 await save(path.join(evidenceDir,'coverage.json'),report);return report;
}
async function checkpoint(){await save(path.join(evidenceDir,'checkpoint.json'),receipt);await save(path.join(evidenceDir,'receipt.json'),receipt);}
try{
 for(const stage of stages){
  const input=await fingerprint(stage),old=await canReuse(stage,input);receipt.runningStage=old?null:{name:stage.name,startedAt:new Date().toISOString(),inputFingerprint:input.sha256,logPath:path.join(evidenceDir,stage.name+'.log')};await checkpoint();
  const result=old||await run(stage,input);receipt.runningStage=null;receipt.stages.push(result);await checkpoint();
  if(result.exitCode!==0){receipt.failedStage=result.name;break;}
 }
 const report=await coverage();Object.assign(receipt,{completedAt:new Date().toISOString(),executablePassed:report.executablePassed,overallComplete:report.overallComplete,passed:report.executablePassed,failedStage:receipt.failedStage||null,coverage:path.join(evidenceDir,'coverage.json')});await checkpoint();
 console.log(JSON.stringify({executablePassed:receipt.executablePassed,overallComplete:receipt.overallComplete,mode:receipt.mode,evidenceDir,counts:report.counts,failedStage:receipt.failedStage,reused:receipt.stages.filter(stage=>stage.reused).map(stage=>stage.name),invalidations:receipt.invalidations}));
 process.exitCode=receipt.executablePassed?0:1;
}catch(error){
 Object.assign(receipt,{completedAt:new Date().toISOString(),executablePassed:false,overallComplete:false,passed:false,error:String(error.message)});await checkpoint();console.error(receipt.error);process.exitCode=1;
}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
