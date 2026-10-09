// One mobile-heading repair over the verified current two-Worker release.
// This helper never changes routes or asset content. An uncertain remote mutation
// is recorded before it starts and must be reconciled before any retry.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const [phase,id='server-error-mobile-20261009']=process.argv.slice(2);
assert.equal(id,'server-error-mobile-20261009','Use the reviewed unique follow-up identity');
assert(['prepare','upload','promote','verify'].includes(phase),'Use prepare/upload/promote/verify');
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment',id+'.json');
const predecessor='server-error-family-20261009',previousPriv=path.join(site,'ask-private',predecessor);
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024}).trim();
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare login required');
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const portal='pinnacle-verify-route',legacy='pinnacle-legacy-social-metadata',targets=[portal,legacy];
const protectedNames=['pbn-planetscale','pinnacle-ask','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-helpline','pinnacle-root-sitemap','materials-mobile-desktop-tracker'];
const specs={
 [portal]:{module:'public-mobile-recovery.mjs',file:'public-mobile-recovery.mjs',main:'pinnacle-route-v12.mjs',modules:49},
 [legacy]:{module:'entry.mjs',file:'legacy-recovery-entry.mjs',main:'entry.mjs',modules:9}
};
const sha=x=>createHash('sha256').update(x).digest('hex'),norm=x=>x.toString().replaceAll('\r\n','\n').trim();
const save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
async function api(p,method='GET',body){
 const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)}),j=await r.json();
 assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;
}
const latest=async n=>(await api(base+n+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
async function state(){
 const [routes,rows]=await Promise.all([api(routePath),Promise.all([...targets,...protectedNames].map(async n=>[n,{versions:await latest(n),settings:await api(base+n+'/settings')}]))]);
 return {at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),workers:Object.fromEntries(rows)};
}
async function modules(n){
 const r=await fetch('https://api.cloudflare.com/client/v4'+base+n+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)});assert(r.ok,'Unable to read current '+n+' modules');
 const out=[];for(const [key,v] of await r.formData())if(typeof v!=='string'){const name=v.name||key;assert(/^[\w.-]+\.mjs$/.test(name));out.push({name,bytes:Buffer.from(await v.arrayBuffer())});}return out;
}
async function committedSource(spec){
 const local=await fs.readFile(path.join(site,'deployment',spec.file)),committed=Buffer.from(g(['show','HEAD:speech-site/deployment/'+spec.file]));
 assert.equal(sha(norm(local)),sha(norm(committed)),'Uncommitted module source: '+spec.file);return committed;
}
function metadata(settings,spec,assets){
 const m={main_module:spec.main,compatibility_date:settings.compatibility_date,compatibility_flags:settings.compatibility_flags||[],bindings:settings.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{...settings.annotations,'workers/message':id}};
 if(assets)m.assets={jwt:assets.jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}};
 for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(settings[k]!==undefined)m[k]=settings[k];return m;
}
async function requireExactCI(receipt){
 const commit=g(['rev-parse','HEAD']);assert.equal(commit,receipt.commit,'Source commit changed after preparation');
 const branch=g(['branch','--show-current']);assert(branch,'Named source branch required');assert.equal(g(['ls-remote','origin','refs/heads/'+branch]).split(/\s/)[0],commit,'Push exact source branch before upload/promotion');
 const ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));assert.equal(ci.commit,commit);assert(ci.runs.some(r=>r.name==='Portal quality'&&r.status==='completed'&&r.conclusion==='success'),'Exact-source Portal quality pass required');
}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Receipt exists: resume its recorded phase, do not prepare again');
 const previous=JSON.parse(await fs.readFile(path.join(site,'deployment',predecessor+'.json'),'utf8'));assert.equal(previous.phase,'verified-configuration');assert(previous.guruRouteMoved&&previous.bindingsPreserved);
 const [before,portalModules,legacyModules]=await Promise.all([state(),modules(portal),modules(legacy)]);
 assert.equal(before.routes.length,307);assert.equal(before.routes.find(r=>r.pattern==='www.pinnacleblooms.org/guru/*')?.script,portal);
 assert.deepEqual(before.workers[portal].versions,[{version_id:previous.candidate,percentage:100}]);assert.deepEqual(before.workers[legacy].versions,[{version_id:previous.legacyCandidate,percentage:100}]);
 const captured={[portal]:portalModules,[legacy]:legacyModules};
 for(const n of targets){const expected=n===portal?previous.hashes:previous.legacyHashes;assert.equal(captured[n].length,specs[n].modules);assert.equal(Object.keys(expected).length,captured[n].length);for(const m of captured[n])assert.equal(sha(m.bytes),expected[m.name],'Predecessor module differs: '+n+'/'+m.name);await committedSource(specs[n]);await save(path.join(priv,n+'-modules.json'),captured[n].map(m=>({name:m.name,base64:m.bytes.toString('base64')})));}
 const manifest=JSON.parse(await fs.readFile(path.join(previousPriv,'manifest.json'),'utf8'));assert.equal(Object.keys(manifest).length,3707);
 const runtime=(await api(base+portal+'/versions/'+previous.candidate)).resources.script_runtime.assets;
 assert.deepEqual({html_handling:runtime.html_handling,not_found_handling:runtime.not_found_handling,run_worker_first:runtime.raw_run_worker_first},{html_handling:'none',not_found_handling:'none',run_worker_first:true});
 await save(path.join(priv,'manifest.json'),manifest);await save(path.join(priv,'before.json'),before);
 const receipt={id,phase:'prepared',at:before.at,commit:g(['rev-parse','HEAD']),predecessor,routeCount:307,retainedAssets:3707,uploadedAssets:0,manifestSha256:sha(JSON.stringify(manifest)),workers:Object.fromEntries(targets.map(n=>[n,{rollback:before.workers[n].versions,changedModule:specs[n].module,originalHashes:Object.fromEntries(captured[n].map(m=>[m.name,sha(m.bytes)]))}]))};
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,routes:307,assets:3707,modules:[49,9]}));
}else{
 const receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));assert(!receipt.pending,'Uncertain remote mutation: reconcile exact recorded worker/action before clearing pending; never retry blindly');
 const before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8')),now=await state();assert.deepEqual(now.routes,before.routes,'Route drift');
 for(const n of [...targets,...protectedNames]){
  const expected=structuredClone(before.workers[n]),record=receipt.workers[n];
  if(record?.candidate)expected.settings.annotations={...expected.settings.annotations,'workers/message':id};
  if(record?.promoted)expected.versions=[{version_id:record.candidate,percentage:100}];
  assert.deepEqual(now.workers[n],expected,'Worker drift: '+n);
 }
 async function mutation(n,kind,action){
  receipt.pending={worker:n,kind,startedAt:new Date().toISOString()};await save(receiptPath,receipt);
  const result=await action();return result;
 }
 if(phase==='upload'){
  assert(['prepared','partially-uploaded','uploaded'].includes(receipt.phase));await requireExactCI(receipt);
  for(const n of targets){
   const record=receipt.workers[n];if(record.candidate)continue;
   const spec=specs[n],mods=JSON.parse(await fs.readFile(path.join(priv,n+'-modules.json'),'utf8')).map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')}));
   const original=mods.find(m=>m.name===spec.module);assert(original,'Missing exact module '+spec.module);original.bytes=await committedSource(spec);
   let assets;
   if(n===portal){const manifest=JSON.parse(await fs.readFile(path.join(priv,'manifest.json'),'utf8'));assert.equal(Object.keys(manifest).length,3707);assert.equal(sha(JSON.stringify(manifest)),receipt.manifestSha256);assets=await api(base+portal+'/assets-upload-session','POST',{manifest});assert.equal(assets.buckets.flat().length,0,'Unchanged complete asset union must already exist');await save(path.join(priv,'assets.json'),assets);}
   const form=new FormData();form.set('metadata',JSON.stringify(metadata(before.workers[n].settings,spec,assets)));for(const m of mods)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
   const result=await mutation(n,'upload-version',()=>api(base+n+'/versions?bindings_inherit=strict','POST',form));record.candidate=result.id;record.hashes=Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]));delete receipt.pending;receipt.phase='partially-uploaded';await save(receiptPath,receipt);
  }
  receipt.phase='uploaded';
 }else if(phase==='promote'){
  assert(['uploaded','partially-promoted','promoted'].includes(receipt.phase));await requireExactCI(receipt);assert(targets.every(n=>receipt.workers[n].candidate));
  for(const n of [legacy,portal]){
   const record=receipt.workers[n];if(record.promoted)continue;
   const result=await mutation(n,'promote-version',()=>api(base+n+'/deployments','POST',{strategy:'percentage',versions:[{version_id:record.candidate,percentage:100}]}));record.deployment=result.id;record.promoted=true;record.promotedAt=new Date().toISOString();delete receipt.pending;receipt.phase='partially-promoted';await save(receiptPath,receipt);
  }
  receipt.phase='promoted';
 }else if(phase==='verify'){
  assert.equal(receipt.phase,'promoted');assert(targets.every(n=>receipt.workers[n].promoted));
  const outputs=await Promise.all(targets.map(async n=>[n,await modules(n)]));
  for(const [n,mods]of outputs){const expected=receipt.workers[n].hashes;assert.equal(mods.length,Object.keys(expected).length);for(const m of mods)assert.equal(sha(m.bytes),expected[m.name],'Deployed module differs: '+n+'/'+m.name);}
  const runtime=(await api(base+portal+'/versions/'+receipt.workers[portal].candidate)).resources.script_runtime.assets;
  assert.deepEqual({html_handling:runtime.html_handling,not_found_handling:runtime.not_found_handling,run_worker_first:runtime.raw_run_worker_first},{html_handling:'none',not_found_handling:'none',run_worker_first:true});
  receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.routesPreserved=307;receipt.bindingsPreserved=true;receipt.protectedWorkersUnchanged=protectedNames;
 }
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,workers:Object.fromEntries(targets.map(n=>[n,{candidate:receipt.workers[n].candidate,promoted:receipt.workers[n].promoted||false}])),routes:receipt.routesPreserved}));
}
