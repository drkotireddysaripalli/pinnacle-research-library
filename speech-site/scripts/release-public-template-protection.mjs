// Existing module-release procedure: replace one generated module in the live
// composition, keep all assets/routes/bindings, and retain a rollback receipt.
import fs from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fingerprint} from './change-test-plan.mjs';
import {assertLabelSourceDelta,patchCompiledLabels,patchCompiledAsset,assertGeneratedLabels} from './campaign-label-patch.mjs';

const [phase, directory, baseline='origin/main']=process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
const restoreReceipt=process.argv.includes('--restore-receipt'),campaignLabels=process.argv.includes('--campaign-labels'),contactScript=process.argv.includes('--contact-script'),sharedScript=restoreReceipt||campaignLabels||contactScript||process.argv.includes('--shared-script');
assert(['prepare','upload','promote','verify','rollback'].includes(phase)&&directory,'Pass phase and evidence directory');
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),out=path.resolve(directory);
const worker=restoreReceipt?'pbn-planetscale':sharedScript?'pinnacle-verify-route':'pinnacle-legacy-social-metadata',moduleName=restoreReceipt?'index.js':contactScript?'shared-clearance-runtime.mjs':sharedScript?'book-attribution-assets.mjs':'public-template-protection.runtime.mjs',entryName='public-template-protection-entry.mjs';
const sourceModuleName=contactScript?'contact-receipt-assets.mjs':moduleName;
const changedModules=restoreReceipt?['index.js','website-enrolment-receipt.mjs','website-enrolment-analytics.mjs']:campaignLabels?['book-attribution-assets.mjs','shared-clearance-runtime.mjs','enrolment-handler.mjs']:sharedScript?[moduleName]:[moduleName,entryName];
const account='862998def1cd610fdb86b8e5c1d6ed4d',zone='8b13f18e0589996b5d6512552372b434';
const protectedNames=['pinnacle-verify-route','pinnacle-legacy-social-metadata','pinnacle-root-sitemap','materials-mobile-desktop-tracker','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-ask','pinnacle-google-ads-call-measurement','pinnacle-helpline','pbn-planetscale'].filter(name=>name!==worker);
const g=args=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
const gitBytes=args=>execFileSync('git',args,{cwd:repo,maxBuffer:64*1024*1024});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const save=async(name,value)=>fs.writeFile(path.join(out,name),JSON.stringify(value,null,2)+'\n',{mode:0o600});
const read=async name=>JSON.parse(await fs.readFile(path.join(out,name),'utf8'));
const raw=await fs.readFile(path.join(process.env.HOME,'Library/Preferences/.wrangler/config/default.toml'),'utf8');
const token=raw.match(/^(?:oauth_token|api_token)\s*=\s*"([^"]+)"/m)?.[1];assert(token,'Existing Wrangler authentication required');
const base=name=>`/accounts/${account}/workers/scripts/${name}`;
async function api(resource,method='GET',body){
 const form=body instanceof FormData,response=await fetch('https://api.cloudflare.com/client/v4'+resource,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(60000)});
 const value=await response.json();assert(response.ok&&value.success,JSON.stringify({resource,status:response.status,errors:value.errors}));return value.result;
}
async function versions(name){const value=await api(base(name)+'/deployments');return value.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;}
const stable=s=>Object.fromEntries(['compatibility_date','compatibility_flags','bindings','placement','tail_consumers','logpush','observability','limits','usage_model'].filter(k=>s[k]!==undefined).map(k=>[k,s[k]]));
async function snapshot(){
 const [routes,settings,workers]=await Promise.all([api(`/zones/${zone}/workers/routes`),api(base(worker)+'/settings'),Promise.all([worker,...protectedNames].map(async name=>[name,await versions(name)]))]);
 const all=Object.fromEntries(workers),details=await api(base(worker)+'/versions/'+all[worker][0].version_id);
 return {at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),settings,workers:all,assets:details.resources?.script_runtime?.assets||null};
}
async function modules(){
 const response=await fetch('https://api.cloudflare.com/client/v4'+base(worker)+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(60000)});assert(response.ok,'Read live Worker modules');
 const entries=[];let entry=response.headers.get('cf-entrypoint');
 for(const [key,value]of await response.formData()){
  if(typeof value==='string'){if(key==='metadata'){try{entry ||= JSON.parse(value).main_module;}catch{}}continue;}
  entries.push({name:value.name||key,type:value.type||'application/javascript+module',bytes:Buffer.from(await value.arrayBuffer())});
 }
 assert(entry&&entries.some(m=>m.name===entry),'Current live entrypoint required');return {entry,entries};
}
function unchanged(now,before,expected=before.workers[worker]){
 assert.deepEqual(now.routes,before.routes,'Route drift');assert.deepEqual(stable(now.settings),stable(before.settings),'Settings or binding drift');assert.deepEqual(now.assets,before.assets,'Asset runtime drift');
 assert.deepEqual(now.workers[worker],expected,'Serving Worker version drift');for(const name of protectedNames)assert.deepEqual(now.workers[name],before.workers[name],name+' version drift');
}
async function receiptCandidates(original){
 const arg=process.argv.indexOf('--candidate-dir');assert(arg>=0,'Pass tested private candidate directory');const dir=path.resolve(process.argv[arg+1]);
 const proof=JSON.parse(await fs.readFile(path.join(dir,'../private-contract-proof.json'),'utf8'));
 const contract=JSON.parse(await fs.readFile(path.join(dir,'../private-candidate-proof.json'),'utf8'));
 const runtime=JSON.parse(await fs.readFile(path.join(dir,'../private-workerd-proof.json'),'utf8'));
 const exports=JSON.parse(await fs.readFile(path.join(dir,'../private-export-proof.json'),'utf8'));assert.equal(exports.status,'passed');for(const name of ['default','Organs','organTOSkillMapped','WebsiteEnrolmentReceipts'])assert(exports.exports.includes(name));
 assert.equal(proof.status,'PASS');assert.equal(proof.cases.length,8);assert(proof.cases.every(c=>c.status==='PASS'));assert.equal(proof.realDatabaseWrites,0);assert.equal(runtime.workerdParse,'PASS');
 const result=new Map();for(const name of changedModules){const bytes=await fs.readFile(path.join(dir,name));assert.equal(sha(bytes),proof.modules[name]);result.set(name,bytes);}
 assert.equal(sha(original),exports.baselineSha256);assert.equal(sha(result.get('index.js')),exports.candidateSha256);
 assert.equal(sha(original),contract.originalSha256);assert.equal(sha(result.get('index.js')),contract.candidateSha256);assert(result.get('index.js').subarray(0,original.length).equals(original),'All current staff bytes retained');
 assert(result.get('index.js').toString().includes('export {WebsiteEnrolmentReceipts};'));
 return result;
}
async function campaignCandidates(entries,beforeRef,afterRef){
 const readSource=(ref,name)=>gitBytes(['show',ref+':speech-site/public/pinnacle-pages-scripts/'+name]).toString();
 const previous={},next={};for(const name of ['speech-measurement.js','enrolment-source.mjs']){
  previous[name]=readSource(beforeRef,name);next[name]=afterRef?readSource(afterRef,name):await fs.readFile(path.join(site,'public/pinnacle-pages-scripts',name),'utf8');assertLabelSourceDelta(previous[name],next[name]);
 }
 const book=afterRef?gitBytes(['show',afterRef+':speech-site/deployment/book-attribution-assets.mjs']):await fs.readFile(path.join(site,'deployment/book-attribution-assets.mjs'));
 assertGeneratedLabels(gitBytes(['show',beforeRef+':speech-site/deployment/book-attribution-assets.mjs']),book,'attributionScripts',['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js'].map(key=>[key,previous['speech-measurement.js'],next['speech-measurement.js'],'text']));
 const contact=afterRef?gitBytes(['show',afterRef+':speech-site/deployment/contact-receipt-assets.mjs']):await fs.readFile(path.join(site,'deployment/contact-receipt-assets.mjs'));
 assertGeneratedLabels(gitBytes(['show',beforeRef+':speech-site/deployment/contact-receipt-assets.mjs']),contact,'contactReceiptAssetSources',Object.keys(previous).map(name=>['/pinnacle-pages-scripts/'+name,previous[name],next[name],'body']));
 const byName=new Map(entries.map(m=>[m.name,m.bytes]));
 assert.equal(sha(byName.get('book-attribution-assets.mjs')),sha(gitBytes(['show',beforeRef+':speech-site/deployment/book-attribution-assets.mjs'])));
 let shared=patchCompiledLabels(byName.get('shared-clearance-runtime.mjs').toString());
 for(const name of Object.keys(previous))shared=patchCompiledAsset(shared,'/pinnacle-pages-scripts/'+name,previous[name],next[name]);
 return new Map([['book-attribution-assets.mjs',book],['shared-clearance-runtime.mjs',Buffer.from(shared)],['enrolment-handler.mjs',Buffer.from(patchCompiledLabels(byName.get('enrolment-handler.mjs').toString(),{numericInventory:true}))]]);
}
function contactRecord(bytes){return JSON.parse(bytes.toString().match(/export const contactReceiptAssetSources=(\{[^\n]+\});/)?.[1]||'null')['/pinnacle-pages-scripts/speech-measurement.js'];}
function patchCapturedContact(bytes,previous,next){
 const text=bytes.toString(),pattern=/("\/pinnacle-pages-scripts\/speech-measurement\.js":\{body:)(`(?:\\[\s\S]|[^`\\])*`)(,sha256:")([a-f0-9]{64})("\})/g;
 const matches=[...text.matchAll(pattern)];assert.equal(matches.length,1,'One compiled contact measurement record required');
 const m=matches[0];assert.equal(vm.runInNewContext(m[2]),previous.body,'Captured compiled measurement preimage');assert.equal(m[4],previous.sha256);
 const literal=m[2].replaceAll(",ad_personalization:'denied'",'').replace(',allow_google_signals:false,allow_ad_personalization_signals:false','');
 assert.equal(vm.runInNewContext(literal),next.body,'Only authorized properties removed in compiled string');assert.equal(sha(next.body),next.sha256);
 return Buffer.from(text.slice(0,m.index)+m[1]+literal+m[3]+next.sha256+m[5]+text.slice(m.index+m[0].length));
}
await fs.mkdir(out,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(path.join(out,'release.json')).catch(()=>null)),'Resume the existing release receipt');
 const before=await snapshot(),captured=await modules();
 for(const pattern of restoreReceipt?[]:sharedScript?['www.pinnacleblooms.org/pinnacle-pages-scripts/*','www.pinnacleblooms.org/books/*']:['www.pinnacleblooms.org/m/*','www.pinnacleblooms.org/skills/*'])assert(before.routes.some(r=>r.pattern===pattern&&r.script===worker),'Affected route belongs to another Worker: '+pattern);
 if(restoreReceipt)await receiptCandidates(captured.entries.find(m=>m.name==='index.js').bytes);
 else if(campaignLabels)await campaignCandidates(captured.entries,baseline);
 else if(contactScript){const original=contactRecord(gitBytes(['show',baseline+':speech-site/deployment/'+sourceModuleName]));const bytes=captured.entries.find(m=>m.name===moduleName)?.bytes;assert(bytes);assert(patchCapturedContact(bytes,original,{body:original.body.replaceAll(",ad_personalization:'denied'",'').replace(',allow_google_signals:false,allow_ad_personalization_signals:false',''),sha256:sha(original.body.replaceAll(",ad_personalization:'denied'",'').replace(',allow_google_signals:false,allow_ad_personalization_signals:false',''))}));}
 else if(sharedScript)assert.equal(sha(captured.entries.find(m=>m.name===moduleName)?.bytes||''),sha(gitBytes(['show',baseline+':speech-site/deployment/'+sourceModuleName])),'Live shared scripts differ from canonical baseline');
 else assert(!captured.entries.some(m=>[moduleName,entryName].includes(m.name)),'Protection wrapper already exists; reconcile the existing release');
 await save('before.json',before);await fs.mkdir(path.join(out,'captured'),{recursive:true});
 for(const m of captured.entries){const file=path.join(out,'captured',m.name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,m.bytes,{mode:0o600});}
 const receipt={phase:'prepared',sharedScript,preparedAt:before.at,baseline:g(['rev-parse',baseline]),worker,entry:captured.entry,changedModules,originalHashes:Object.fromEntries(captured.entries.map(m=>[m.name,sha(m.bytes)])),contentTypes:Object.fromEntries(captured.entries.map(m=>[m.name,m.type])),rollback:before.workers[worker],moduleCount:captured.entries.length};await save('release.json',receipt);console.log(JSON.stringify({phase:receipt.phase,modules:receipt.moduleCount,routes:before.routes.length,rollback:receipt.rollback}));
}else{
 const receipt=await read('release.json'),before=await read('before.json');
 assert.equal(receipt.sharedScript??false,sharedScript,'Resume with the same release scope');
 assert(receipt.changedModules.includes(moduleName),'Resume the same asset module');
 if(phase==='rollback'){
  assert(receipt.deployment,'Nothing has been promoted');unchanged(await snapshot(),before,[{version_id:receipt.version,percentage:100}]);const result=await api(base(worker)+'/deployments','POST',{strategy:'percentage',versions:receipt.rollback});receipt.rollbackDeployment=result.id;receipt.phase='rolled-back';await save('release.json',receipt);console.log(JSON.stringify({phase:receipt.phase,deployment:result.id}));
 }else if(phase==='upload'){
  assert.equal(receipt.phase,'prepared');unchanged(await snapshot(),before);
  const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Merge the exact source to canonical main before upload');
  assert.equal(g(['diff','HEAD','--','speech-site/deployment','speech-site/scripts']),'','Tracked release inputs must be committed');
  const runs=JSON.parse(execFileSync('gh',['run','list','--workflow','portal-quality.yml','--event','push','--commit',commit,'--json','databaseId,headSha,status,conclusion,url'],{cwd:repo,encoding:'utf8'}));let ci=runs.find(r=>r.headSha===commit&&r.status==='completed'&&r.conclusion==='success');
  const localIndex=process.argv.indexOf('--local-acceptance');
  if(localIndex!==-1){
   assert(sharedScript,'Local acceptance is scoped to this shared-script repair');
   const file=path.resolve(process.argv[localIndex+1]||''),proof=JSON.parse(await fs.readFile(file,'utf8'));
   assert.deepEqual(proof.plan.components,[campaignLabels||restoreReceipt?'campaign-labels':'native-ad-settings']);assert.equal(proof.plan.scope,'runtime');assert(!proof.plan.portal&&!proof.plan.ask);
   const commands=[...proof.plan.suites.map(suite=>['--test',suite]),...proof.plan.commands.map(stage=>stage.args)];
   assert(campaignLabels||restoreReceipt?proof.plan.suites.includes('scripts/test-campaign-label-patch.mjs'):JSON.stringify(commands)===JSON.stringify([['--test','scripts/test-change-test-plan.mjs'],['--test','--test-name-pattern=eligible public pages|existing Google tag','scripts/test-measurement.mjs'],['--check','scripts/release-public-template-protection.mjs']]));
   assert.equal(proof.results.length,commands.length);
   for(const command of commands){
    const matches=proof.results.filter(record=>JSON.stringify(record.command)===JSON.stringify(command));assert.equal(matches.length,1);
    const record=matches[0];assert.equal(record.source,commit);assert.equal(record.status,'passed');assert.equal(record.exitCode,0);assert(record.cacheable&&!record.reused);assert.equal(record.context.node,process.version);
    assert.equal(sha(await fs.readFile(record.log)),record.logSHA256);
    assert.equal(g(['diff','HEAD','--']),'','All tracked local acceptance inputs must match HEAD');
    assert.equal(fingerprint({files:record.inputs,readFile:f=>readFileSync(path.join(repo,f)),command,context:record.context}),record.key,'Current committed input fingerprint');
   }
   ci={type:'verified-local-acceptance',headSha:commit,status:'completed',conclusion:'success',evidence:file,sha256:sha(await fs.readFile(file)),remoteStatus:runs};
  }
  assert(ci,'Exact main source acceptance must pass before upload');
  let candidate;if(!restoreReceipt){candidate=await fs.readFile(path.join(site,'deployment',sourceModuleName));assert.equal(sha(candidate),sha(gitBytes(['show',commit+':speech-site/deployment/'+sourceModuleName])),'Generated candidate differs from commit');}
  const entries=await Promise.all(Object.keys(receipt.originalHashes).map(async name=>({name,bytes:await fs.readFile(path.join(out,'captured',name))})));
  for(const m of entries)assert.equal(sha(m.bytes),receipt.originalHashes[m.name],'Captured module changed: '+m.name);
  if(restoreReceipt){
   const candidates=await receiptCandidates(entries.find(m=>m.name==='index.js').bytes);for(const [name,bytes]of candidates){const old=entries.find(m=>m.name===name);if(old)old.bytes=bytes;else entries.push({name,bytes});}
  }else if(campaignLabels){
   const candidates=await campaignCandidates(entries,receipt.baseline,commit);for(const item of entries)if(candidates.has(item.name))item.bytes=candidates.get(item.name);
  }else if(sharedScript){
   const current=entries.find(m=>m.name===moduleName);assert(current,'Shared script module absent');
   const pattern=contactScript?/export const contactReceiptAssetSources=(\{[^\n]+\});/:/export const attributionScripts=(\{[^\n]+\});/;
   const exportName=contactScript?'contactReceiptAssetSources':'attributionScripts',bodyKey=contactScript?'body':'text';
   const parse=b=>JSON.parse(b.toString().match(pattern)?.[1]||'null');const originalSource=contactScript?gitBytes(['show',receipt.baseline+':speech-site/deployment/'+sourceModuleName]):current.bytes;const previous=parse(originalSource),next=parse(candidate);assert(previous&&next);assert.deepEqual(Object.keys(next),Object.keys(previous));
   for(const key of Object.keys(previous))if(['/pinnacle-pages-scripts/speech-measurement.js',...(!contactScript?['/books/resources/measurement-v1.js']:[])].includes(key)){
    const body=previous[key][bodyKey].replaceAll(",ad_personalization:'denied'",'').replace(',allow_google_signals:false,allow_ad_personalization_signals:false','');
    assert.deepEqual(next[key],{...previous[key],[bodyKey]:body,sha256:sha(body)});
   }else assert.deepEqual(next[key],previous[key],'Unrelated shared asset changed: '+key);
   assert.equal(candidate.toString(),originalSource.toString().replace(pattern,'export const '+exportName+'='+JSON.stringify(next)+';'),'Unrelated generated module code changed');
   if(contactScript)candidate=patchCapturedContact(current.bytes,contactRecord(originalSource),contactRecord(candidate));
   current.bytes=candidate;
  }else{
   const entry=Buffer.from("import original from './"+receipt.entry+"';export * from './"+receipt.entry+"';import {withPublicTemplateProtection} from './"+moduleName+"';export default withPublicTemplateProtection(original);\n");
   entries.push({name:moduleName,bytes:candidate},{name:entryName,bytes:entry});
  }
  const s=before.settings,metadata={main_module:sharedScript?receipt.entry:entryName,...(before.assets?{keep_assets:true}:{}),compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(b=>({name:b.name,type:'inherit'})),annotations:{'workers/message':restoreReceipt?'restore-receipt-additive-20261021':campaignLabels?'campaign-labels-20261021':sharedScript?'native-ad-settings-20261021':'public-template-protection-20261021'}};
  for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)metadata[k]=s[k];
  const body=new FormData();body.set('metadata',JSON.stringify(metadata));for(const m of entries)body.set(m.name,new Blob([m.bytes],{type:receipt.contentTypes[m.name]||'application/javascript+module'}),m.name);
  const uploaded=await api(base(worker)+'/versions?bindings_inherit=strict','POST',body);receipt.commit=commit;receipt.ci=ci;receipt.version=uploaded.id;receipt.hashes=Object.fromEntries(entries.map(m=>[m.name,sha(m.bytes)]));receipt.phase='uploaded';receipt.uploadedAt=new Date().toISOString();await save('release.json',receipt);console.log(JSON.stringify({phase:receipt.phase,commit,version:receipt.version,changedModules:receipt.changedModules}));
 }else if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');unchanged(await snapshot(),before);const result=await api(base(worker)+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.version,percentage:100}]});receipt.deployment=result.id;receipt.phase='promoted';receipt.promotedAt=new Date().toISOString();await save('release.json',receipt);console.log(JSON.stringify({phase:receipt.phase,version:receipt.version,deployment:receipt.deployment}));
 }else{
  assert.equal(receipt.phase,'promoted');const now=await snapshot();unchanged(now,before,[{version_id:receipt.version,percentage:100}]);const current=await modules();assert.equal(current.entry,sharedScript?receipt.entry:entryName);assert.equal(current.entries.length,receipt.moduleCount+(restoreReceipt?2:sharedScript?0:2));for(const m of current.entries)assert.equal(sha(m.bytes),receipt.hashes[m.name],'Live module differs: '+m.name);
  receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.routesPreserved=now.routes.length;receipt.assetsPreserved=true;receipt.settingsAndBindingsPreserved=true;receipt.protectedWorkersUnchanged=protectedNames;await save('after.json',now);await save('release.json',receipt);console.log(JSON.stringify({phase:receipt.phase,version:receipt.version,deployment:receipt.deployment,routes:receipt.routesPreserved,modules:receipt.moduleCount+(restoreReceipt?2:sharedScript?0:2)}));
 }
}
