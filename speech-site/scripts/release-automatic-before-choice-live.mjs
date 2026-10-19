// Guarded five-module release over the exact current live Worker. The current
// static asset binding, routes, settings, unrelated modules and protected
// workers are retained. Run phases in order with one unique release ID:
// prepare -> assemble -> upload -> promote -> verify.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';

const [phase,id]=process.argv.slice(2);
assert(/^[a-z0-9-]{6,80}$/.test(id||''),'Unique release ID required');
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment',id+'.json');
const git=process.env.PINNACLE_GIT||'/usr/bin/git';
const g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true}).trim();
const session=(await fs.readFile(path.join(process.env.HOME,'Library/Preferences/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
assert(session,'Existing Cloudflare login required');
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',worker='pinnacle-verify-route',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const protectedNames=['pinnacle-legacy-social-metadata','pinnacle-ask','pinnacle-root-sitemap','materials-mobile-desktop-tracker','pbn-planetscale','pinnacle-helpline','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-google-ads-call-measurement'];
const exactModules=['legacy-measurement.runtime.mjs','book-attribution-handler.mjs','public-policy-assets.mjs','public-policy-runtime-assets.mjs'];
const patchedModule='book-attribution-assets.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex'),normalise=value=>value.toString().replaceAll('\r\n','\n').trim();
const save=(file,value)=>fs.writeFile(file,JSON.stringify(value,null,2)+'\n');
const assignment=(source,name)=>{const prefix='export const '+name+'=',line=source.split('\n').find(row=>row.startsWith(prefix));assert(line?.endsWith(';'),'Missing generated '+name);return JSON.parse(line.slice(prefix.length,-1));};

async function assertTrustedCi(ci,commit){
 assert.equal(ci.schemaVersion,1,'Unsupported CI evidence schema');assert.equal(ci.commit,commit,'CI evidence is for another commit');
 const runs=(ci.runs||[]).filter(run=>run.name==='Portal quality'&&['push','workflow_dispatch'].includes(run.event)&&run.headSha===commit&&run.status==='completed'&&run.conclusion==='success');assert.equal(runs.length,1,'Exactly one successful trusted Portal quality run is required');const run=runs[0];
 assert(Number.isSafeInteger(run.runId)&&run.runId>0,'Trusted workflow run ID required');assert.equal(run.checksJob?.name,'checks');assert(Number.isSafeInteger(run.checksJob?.jobId)&&run.checksJob.jobId>0,'Trusted checks job ID required');assert.equal(run.checksJob.conclusion,'success');assert.equal(run.testingBotStep?.name,'TestingBot BVT gates this exact build');assert.equal(run.testingBotStep.conclusion,'success');
 const artifact=run.artifact;assert.equal(artifact?.name,'testingbot-build-verification');assert(Number.isSafeInteger(artifact.id)&&artifact.id>0,'TestingBot artifact ID required');
 const evidencePath=relative=>{assert.equal(typeof relative,'string');const resolved=path.resolve(priv,relative);assert(resolved.startsWith(priv+path.sep),'CI evidence path escapes the release directory');return resolved;};
 const archivePath=evidencePath(artifact.archivePath),reportPath=evidencePath(artifact.reportPath),[archive,reportBytes]=await Promise.all([fs.readFile(archivePath),fs.readFile(reportPath)]);assert.match(artifact.archiveSha256,/^[a-f0-9]{64}$/);assert.match(artifact.reportSha256,/^[a-f0-9]{64}$/);assert.equal(sha(archive),artifact.archiveSha256,'TestingBot archive hash differs');assert.equal(sha(reportBytes),artifact.reportSha256,'TestingBot report hash differs');
 execFileSync(process.execPath,[path.join(site,'scripts/assert-testingbot-release.mjs'),reportPath],{cwd:site,encoding:'utf8',windowsHide:true,env:{...process.env,GITHUB_SHA:commit}});
 const report=JSON.parse(reportBytes);assert.equal(report.source,commit);assert.equal(report.suite,'bvt');assert.equal(report.build,true);assert.deepEqual(report.requestedMatrix,['chrome']);assert.equal(report.functionalPassed,true);assert.equal(report.overall,'functional-pass');assert.equal(report.selectedIds?.length,5);assert.equal(new Set(report.selectedIds).size,5);assert.deepEqual(report.counts,{...report.counts,selectedPages:5,pageRuns:5,passed:5,failed:0,unavailable:0});
 assert.equal(report.sessions?.length,1);const session=report.sessions[0];assert.equal(session.matrix,'chrome');assert.equal(session.status,'passed');assert.equal(session.closed,true);assert.equal(session.providerClosed,true);assert.equal(session.resultRecorded,true);assert.equal(session.provider?.success,true);assert.equal(session.cases?.length,5);assert(session.cases.every(test=>test.status==='passed'&&test.checks?.length>0&&test.checks.every(check=>check.passed===true)),'Every exact-build browser case must pass');
 const containment=session.nativeContainment;assert.equal(containment?.browserInterception?.status,'installed');assert(containment.browserInterception.requestedRules>0);assert.equal(containment.browserInterception.installedRules,containment.browserInterception.requestedRules);assert.equal(containment.document?.url,'https://www.pinnacleblooms.org/robots.txt');assert.match(containment.document?.contentType||'',/^text\/plain(?:;|$)/i);assert.equal(containment.document?.scripts,0);assert.deepEqual(containment.probes?.map(({name,expected,outcome,passed})=>({name,expected,outcome,passed})),[{name:'public-control',expected:'reachable',outcome:'reachable',passed:true},{name:'analytics-denied',expected:'blocked',outcome:'blocked',passed:true},{name:'tag-loader-denied',expected:'blocked',outcome:'blocked',passed:true}]);
 return {runId:run.runId,jobId:run.checksJob.jobId,artifactId:artifact.id,reportSha256:artifact.reportSha256};
}

async function api(resource,method='GET',body){
 const form=body instanceof FormData,response=await fetch('https://api.cloudflare.com/client/v4'+resource,{method,headers:{authorization:'Bearer '+session,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)}),json=await response.json();
 assert(response.ok&&json.success,JSON.stringify({status:response.status,resource,errors:json.errors}));return json.result;
}
async function apiBytes(resource){
 const response=await fetch('https://api.cloudflare.com/client/v4'+resource,{headers:{authorization:'Bearer '+session},signal:AbortSignal.timeout(45000)});
 assert(response.ok,JSON.stringify({status:response.status,resource}));return Buffer.from(await response.arrayBuffer());
}
const latest=async name=>(await api(base+name+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
async function state(){
 const [routes,settings,workers]=await Promise.all([api(routePath),api(base+worker+'/settings'),Promise.all([worker,...protectedNames].map(async name=>[name,{versions:await latest(name),bindings:(await api(base+name+'/settings')).bindings}]))]);
 return {at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),settings,workers:Object.fromEntries(workers)};
}
async function modules(){
 const response=await fetch('https://api.cloudflare.com/client/v4'+base+worker+'/content/v2',{headers:{authorization:'Bearer '+session},signal:AbortSignal.timeout(45000)});assert(response.ok);
 const out=[];for(const [key,value] of await response.formData())if(typeof value!=='string'){const name=value.name||key;assert(/^[\w.-]+\.mjs$/.test(name));out.push({name,bytes:Buffer.from(await value.arrayBuffer())});}return out;
}
async function candidateModules(commit){
 const mods=JSON.parse(await fs.readFile(path.join(priv,'modules.json'),'utf8')).map(module=>({name:module.name,bytes:Buffer.from(module.base64,'base64')}));
 for(const name of ['legacy-measurement.runtime.mjs','book-attribution-handler.mjs','book-attribution-assets.mjs','public-ad-call.mjs'])assert(mods.some(module=>module.name===name),'Required captured module absent: '+name);
 const legacyRuntime=mods.find(module=>module.name==='legacy-measurement.runtime.mjs');
 const bundledFingerprints=['var LEGACY_TAGS','var LEGACY_NOSCRIPT_TAGS','var LEGACY_TAG_REPLACEMENTS'].every(marker=>legacyRuntime.bytes.includes(Buffer.from(marker)));
 assert(mods.some(module=>module.name==='legacy-measurement-fingerprints.mjs')||bundledFingerprints,'Captured legacy runtime contains neither bundled nor separate measurement fingerprints');
 for(const name of exactModules){
  const bytes=await fs.readFile(path.join(site,'deployment',name));
  assert.equal(sha(normalise(bytes)),sha(normalise(g(['show',commit+':speech-site/deployment/'+name]))),'Source changed after commit: '+name);
  const current=mods.find(module=>module.name===name);if(current)current.bytes=bytes;else mods.push({name,bytes});
 }
 const committedBytes=await fs.readFile(path.join(site,'deployment',patchedModule));
 assert.equal(sha(normalise(committedBytes)),sha(normalise(g(['show',commit+':speech-site/deployment/'+patchedModule]))),'Source changed after commit: '+patchedModule);
 const committed=assignment(committedBytes.toString(),'attributionScripts'),target=mods.find(module=>module.name===patchedModule),live=assignment(target.bytes.toString(),'attributionScripts');
 for(const [key,value] of Object.entries(committed))live[key]=value;
 target.bytes=Buffer.from('// Preserved live script union with exact committed shared sources.\nexport const attributionScripts='+JSON.stringify(live)+';\n');
 return {mods,targets:[...exactModules,patchedModule],preservedScriptKeys:Object.keys(live).filter(key=>!Object.hasOwn(committed,key)).sort()};
}
async function proveCandidate(commit,candidate){
 const fixture=path.join(priv,'candidate-fixture');await fs.rm(fixture,{recursive:true,force:true});await fs.mkdir(fixture,{recursive:true});
 const fixtureNames=[...candidate.targets,'public-ad-call.mjs'];if(candidate.mods.some(module=>module.name==='legacy-measurement-fingerprints.mjs'))fixtureNames.push('legacy-measurement-fingerprints.mjs');
 for(const name of fixtureNames)await fs.writeFile(path.join(fixture,name),candidate.mods.find(module=>module.name===name).bytes);
 const nonce='?v='+Date.now(),handler=await import(pathToFileURL(path.join(fixture,'book-attribution-handler.mjs'))+nonce),legacy=await import(pathToFileURL(path.join(fixture,'legacy-measurement.runtime.mjs'))+nonce),policy=await import(pathToFileURL(path.join(fixture,'public-policy-assets.mjs'))+nonce),runtime=await import(pathToFileURL(path.join(fixture,'public-policy-runtime-assets.mjs'))+nonce),scripts=await import(pathToFileURL(path.join(fixture,'book-attribution-assets.mjs'))+nonce);
 const collector=await fs.readFile(path.join(site,'public/pinnacle-pages-scripts/speech-measurement.js'),'utf8'),collectorResponse=handler.serveBookAttribution(new Request('https://www.pinnacleblooms.org/pinnacle-pages-scripts/speech-measurement.js'));assert.equal(await collectorResponse.text(),collector);
 const served={};
 for(const [route,keys] of Object.entries(policy.publicPolicyRoutes))for(const [representation,key] of Object.entries(keys)){const response=handler.serveBookAttribution(new Request('https://www.pinnacleblooms.org'+route,{headers:representation==='markdown'?{accept:'text/markdown'}:{}})),expected=policy.publicPolicyAssets[key];assert.equal(sha(Buffer.from(await response.arrayBuffer())),expected.sha256);served[route+':'+representation]=expected.sha256;}
 for(const [key,expected] of [...Object.entries(policy.publicPolicyAssets).filter(([key])=>key.endsWith('.json')),...Object.entries(runtime.publicPolicyRuntimeAssets)]){const response=handler.serveBookAttribution(new Request('https://www.pinnacleblooms.org'+key));assert.equal(sha(Buffer.from(await response.arrayBuffer())),expected.sha256);served[key]=expected.sha256;}
 const analytics='<details class="measurement-settings" data-speech-measurement hidden><summary>Analytics</summary></details>',calls='<details class="measurement-settings" data-ad-call-preferences hidden><summary>Calls</summary></details>',route='/best-aba-therapy-center-india-proven-improvement-rate',html='<html><head><link rel="canonical" href="https://www.pinnacleblooms.org'+route+'"></head><body><footer class="portal-site-footer"><div class="portal-container">'+analytics+calls+'</div></footer></body></html>',projected=legacy.projectManagedPreferenceHtml(html,new Request('https://www.pinnacleblooms.org'+route));
 assert(projected?.includes('one coarse page visit'));assert(projected.includes('Limited cookieless measurement may run'));assert.equal((projected.match(/id="website-preferences"/g)||[]).length,1);
 const proof={commit,moduleCount:candidate.mods.length,changedModules:candidate.targets,preservedScriptKeys:candidate.preservedScriptKeys,collectorSha256:sha(collector),scriptKeys:Object.keys(scripts.attributionScripts).sort(),policyAssets:Object.keys(policy.publicPolicyAssets).length,runtimeAssets:Object.keys(runtime.publicPolicyRuntimeAssets).length,served,moduleHashes:Object.fromEntries(candidate.mods.map(module=>[module.name,sha(module.bytes)]))};await save(path.join(priv,'candidate-proof.json'),proof);return proof;
}
async function proveLive(candidate,before){
 const policySource=await fs.readFile(path.join(site,'deployment/public-policy-assets.mjs'),'utf8'),sourcePolicy=assignment(policySource,'publicPolicyAssets'),routes=assignment(policySource,'publicPolicyRoutes'),runtime=assignment(await fs.readFile(path.join(site,'deployment/public-policy-runtime-assets.mjs'),'utf8'),'publicPolicyRuntimeAssets'),checks=[];
 const fixture=path.join(priv,'live-runtime-fixture');await fs.rm(fixture,{recursive:true,force:true});await fs.mkdir(fixture,{recursive:true});for(const module of candidate.mods)await fs.writeFile(path.join(fixture,module.name),module.bytes);
 const bundle=await build({stdin:{contents:"import worker from './pinnacle-route-v12.mjs'; export default worker;",resolveDir:fixture,sourcefile:'release-entry.mjs'},bundle:true,format:'esm',write:false,platform:'browser'});
 const miniflare=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:before.settings.compatibility_date,compatibilityFlags:before.settings.compatibility_flags||[],script:bundle.outputFiles[0].text,kvNamespaces:['PINNACLE_ANNOUNCEMENTS']}));
 const namespace=before.settings.bindings.find(binding=>binding.name==='PINNACLE_ANNOUNCEMENTS'&&binding.type==='kv_namespace')?.namespace_id;assert(namespace,'Announcement KV binding absent');
 const announcement=await apiBytes('/accounts/862998def1cd610fdb86b8e5c1d6ed4d/storage/kv/namespaces/'+namespace+'/values/active');await (await miniflare.getKVNamespace('PINNACLE_ANNOUNCEMENTS')).put('active',announcement);
 const nonce=id+'-'+Date.now(),url=pathname=>'https://www.pinnacleblooms.org'+pathname+(pathname.includes('?')?'&':'?')+'release_readback='+encodeURIComponent(nonce);
 const local=async(pathname,headers={})=>{const response=await miniflare.dispatchFetch(url(pathname),{headers}),bytes=Buffer.from(await response.arrayBuffer());return {response,bytes};};
 const live=async(pathname,headers={})=>{const response=await fetch(url(pathname),{headers:{'cache-control':'no-cache','pragma':'no-cache',...headers},redirect:'manual',signal:AbortSignal.timeout(30000)}),bytes=Buffer.from(await response.arrayBuffer());return {response,bytes};};
 const compare=async(pathname,headers={},representation)=>{const [expected,out]=await Promise.all([local(pathname,headers),live(pathname,headers)]);assert.equal(out.response.status,expected.response.status,pathname);assert.equal(sha(out.bytes),sha(expected.bytes),pathname+(representation?' '+representation:''));checks.push({path:pathname,...(representation?{representation}:{}),status:out.response.status,sha256:sha(out.bytes)});return out;};
 try{
  for(const [route,keys] of Object.entries(routes))for(const representation of Object.keys(keys)){const out=await compare(route,representation==='markdown'?{accept:'text/markdown'}:{},representation);assert.equal(out.response.headers.get('x-pinnacle-policy-overlay'),'automatic-before-choice-20261019');}
  for(const key of [...Object.keys(sourcePolicy).filter(key=>key.endsWith('.json')),...Object.keys(runtime)])await compare(key);
  const collector=await compare('/pinnacle-pages-scripts/speech-measurement.js'),expectedCollector=await fs.readFile(path.join(site,'public/pinnacle-pages-scripts/speech-measurement.js'));assert.equal(sha(collector.bytes),sha(expectedCollector));
  const managed=await live('/best-aba-therapy-center-india-proven-improvement-rate'),text=managed.bytes.toString();assert.equal(managed.response.status,200);assert.equal((text.match(/id="website-preferences"/g)||[]).length,1);assert(text.includes('one coarse page visit'));assert(text.includes('Limited cookieless measurement may run'));checks.push({path:'/best-aba-therapy-center-india-proven-improvement-rate',status:200,semantic:true});
  return {at:new Date().toISOString(),announcementSha256:sha(announcement),checks,collectorSha256:sha(expectedCollector),managedFooter:true};
 }finally{await miniflare.dispose();}
}

await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Receipt exists; reconcile instead of repeating');
 const [before,mods]=await Promise.all([state(),modules()]);
 await save(path.join(priv,'before.json'),before);await save(path.join(priv,'modules.json'),mods.map(module=>({name:module.name,base64:module.bytes.toString('base64')})));
 const receipt={id,phase:'prepared',at:before.at,baseCommit:g(['rev-parse','HEAD']),rollback:before.workers[worker].versions,routeCount:before.routes.length,moduleCount:mods.length,retainedAssets:'preserved-current-live',uploadedAssets:0,originalHashes:Object.fromEntries(mods.map(module=>[module.name,sha(module.bytes)]))};
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,routes:receipt.routeCount,modules:receipt.moduleCount,rollback:receipt.rollback}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8')),now=await state(),expectedSettings=structuredClone(before.settings);
 if(receipt.candidate)expectedSettings.annotations={...expectedSettings.annotations,'workers/message':id};
 assert.deepEqual(now.routes,before.routes,'Route drift');assert.deepEqual(now.settings,expectedSettings,'Portal settings drift');for(const name of protectedNames)assert.deepEqual(now.workers[name],before.workers[name],name+' changed');assert.deepEqual(now.workers[worker].versions,phase==='verify'?[{version_id:receipt.candidate,percentage:100}]:before.workers[worker].versions,'Portal version drift');
 if(phase==='assemble'){
  assert.equal(receipt.phase,'prepared');const commit=g(['rev-parse','HEAD']),candidate=await candidateModules(commit),proof=await proveCandidate(commit,candidate);receipt.phase='assembled';receipt.commit=commit;receipt.changedModules=candidate.targets;receipt.hashes=proof.moduleHashes;
 }else if(phase==='upload'){
  assert.equal(receipt.phase,'assembled');const commit=g(['rev-parse','HEAD']);assert.equal(receipt.commit,commit);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Push source before upload');const ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));receipt.ci=await assertTrustedCi(ci,commit);
  const candidate=await candidateModules(commit),proof=await proveCandidate(commit,candidate);assert.deepEqual(proof.moduleHashes,receipt.hashes,'Candidate changed after review');const settings=before.settings,metadata={main_module:'pinnacle-route-v12.mjs',keep_assets:true,compatibility_date:settings.compatibility_date,compatibility_flags:settings.compatibility_flags||[],bindings:settings.bindings.map(binding=>binding.type==='assets'?{name:binding.name,type:'assets'}:{name:binding.name,type:'inherit'}),annotations:{'workers/message':id}};for(const key of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(settings[key]!==undefined)metadata[key]=settings[key];const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const module of candidate.mods)form.set(module.name,new Blob([module.bytes],{type:'application/javascript+module'}),module.name);const result=await api(base+worker+'/versions?bindings_inherit=strict','POST',form);receipt.candidate=result.id;receipt.phase='uploaded';receipt.hashes=proof.moduleHashes;
 }else if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');const result=await api(base+worker+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidate,percentage:100}]});receipt.deployment=result.id;receipt.phase='promoted';receipt.promotedAt=new Date().toISOString();
 }else if(phase==='verify'){
  assert.equal(receipt.phase,'promoted');const liveModules=await modules();assert.equal(liveModules.length,Object.keys(receipt.hashes).length);for(const module of liveModules)assert.equal(sha(module.bytes),receipt.hashes[module.name],module.name+' differs');const candidate=await candidateModules(receipt.commit);receipt.live=await proveLive(candidate,before);receipt.phase='verified-live';receipt.verifiedAt=now.at;receipt.protectedWorkersUnchanged=protectedNames;receipt.routesPreserved=now.routes.length;receipt.bindingsPreserved=true;
 }else throw Error('Use prepare, assemble, upload, promote or verify');
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,version:receipt.candidate,deployment:receipt.deployment,routes:receipt.routesPreserved}));
}
