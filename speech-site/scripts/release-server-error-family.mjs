// Shared server-error repairs over the exact current live portal. Preserve its
// full asset union, every other module, routes, bindings and protected services.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const [phase,id]=process.argv.slice(2);
assert(/^[a-z0-9-]{6,80}$/.test(id||''),'Unique release ID required');
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment',id+'.json');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024}).trim();
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare login required');
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',worker='pinnacle-verify-route',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const protectedNames=['pbn-planetscale','pinnacle-ask','pinnacle-ask-mcp','pinnacle-legacy-social-metadata','pinnacle-centre-search-repair','pinnacle-helpline','pinnacle-root-sitemap','materials-mobile-desktop-tracker'];
const sha=x=>createHash('sha256').update(x).digest('hex'),normalise=x=>x.toString().replaceAll('\r\n','\n').trim();
const save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
async function api(p,method='GET',body,bearer=token){
 const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+bearer,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)}),j=await r.json();
 assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;
}
const latest=async n=>(await api(base+n+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
async function state(){
 const [routes,settings,protectedRows]=await Promise.all([api(routePath),api(base+worker+'/settings'),Promise.all([worker,...protectedNames].map(async n=>[n,{versions:await latest(n),bindings:(await api(base+n+'/settings')).bindings}]))]);
 return {at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),settings,workers:Object.fromEntries(protectedRows)};
}
async function modules(name=worker){
 const r=await fetch('https://api.cloudflare.com/client/v4'+base+name+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)});assert(r.ok);
 const out=[];for(const [key,v] of await r.formData())if(typeof v!=='string'){const name=v.name||key;assert(/^[\w.-]+\.mjs$/.test(name));out.push({name,bytes:Buffer.from(await v.arrayBuffer())});}return out;
}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Receipt exists; reconcile instead of repeating');
 const [before,mods]=await Promise.all([state(),modules()]);
 const live=mods.find(m=>m.name==='speech-handler.mjs');assert(live,'Live shared script module absent');
 assert.equal(sha(normalise(live.bytes)),sha(normalise(g(['show','HEAD:speech-site/deployment/speech-handler.mjs']))),'HEAD baseline differs from live');
 await save(path.join(priv,'before.json'),before);await save(path.join(priv,'modules.json'),mods.map(m=>({name:m.name,base64:m.bytes.toString('base64')})));
 const manifest=JSON.parse(await fs.readFile(path.resolve(site,'../../ask-distribution-release-20261003/speech-site/ask-private/paid-journey-20261008/manifest.json'),'utf8'));assert.equal(Object.keys(manifest).length,3706);
 await save(path.join(priv,'manifest.json'),manifest);
 const key='/mirracles-library-data/catalogue.json',bytes=await fs.readFile(path.join(site,'deployment/mirracles-library-20261008/data/catalogue.json')),blake=createRequire(path.join(site,'package.json'))('blake3-wasm');
 manifest[key]={hash:blake.hash(bytes.toString('base64')+'json').toString('hex').slice(0,32),size:bytes.length};
 await save(path.join(priv,'manifest.json'),manifest);

 const runtime=(await api(base+worker+'/versions/'+before.workers[worker].versions[0].version_id)).resources.script_runtime.assets;
 assert.deepEqual({html_handling:runtime.html_handling,not_found_handling:runtime.not_found_handling,run_worker_first:runtime.raw_run_worker_first},{html_handling:'none',not_found_handling:'none',run_worker_first:true});
 const receipt={id,phase:'prepared',at:before.at,baseCommit:g(['rev-parse','HEAD']),rollback:before.workers[worker].versions,routeCount:before.routes.length,moduleCount:mods.length,retainedAssets:3706,changedAssets:[key],originalHashes:Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]))};
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,routes:receipt.routeCount,modules:receipt.moduleCount,rollback:receipt.rollback,retainedAssets:3706}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8')),now=await state();
 const expectedSettings=structuredClone(before.settings);
 // A version upload updates this declared release annotation before promotion.
 if(receipt.candidate)expectedSettings.annotations={...expectedSettings.annotations,'workers/message':id};
 const expectedRoutes=before.routes.map(r=>receipt.guruRouteMoved&&r.pattern==='www.pinnacleblooms.org/guru/*'?{...r,script:worker}:r);
 assert.deepEqual(now.routes,expectedRoutes,'Route drift');assert.deepEqual(now.settings,expectedSettings,'Portal settings drift');
 for(const n of protectedNames){const expected=structuredClone(before.workers[n]);if(n==='pinnacle-legacy-social-metadata'&&receipt.legacyPromoted)expected.versions=[{version_id:receipt.legacyCandidate,percentage:100}];assert.deepEqual(now.workers[n],expected,n+' changed');}
 assert.deepEqual(now.workers[worker].versions,receipt.portalPromoted?[{version_id:receipt.candidate,percentage:100}]:before.workers[worker].versions,'Portal version drift');
 if(phase==='refresh'){
  assert.equal(receipt.phase,'prepared');const manifest=JSON.parse(await fs.readFile(path.join(priv,'manifest.json'),'utf8')),blake=createRequire(path.join(site,'package.json'))('blake3-wasm');
  const changed={'/mirracles-library-data/catalogue.json':'mirracles-library-20261008/data/catalogue.json','/guru-recovery-data/articles.json':'guru-recovery-20261009/data/articles.json'};
  for(const [key,file]of Object.entries(changed)){const bytes=await fs.readFile(path.join(site,'deployment',file));manifest[key]={hash:blake.hash(bytes.toString('base64')+'json').toString('hex').slice(0,32),size:bytes.length};}
  assert.equal(Object.keys(manifest).length,3707);receipt.assetSources=changed;receipt.changedAssets=Object.keys(changed);receipt.totalAssets=3707;receipt.retainedAssets=3705;await save(path.join(priv,'manifest.json'),manifest);
 }else if(phase==='upload'){
  assert.equal(receipt.phase,'prepared');const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/'+g(['branch','--show-current'])]).split(/\s/)[0],commit,'Push exact source branch before upload');
  const ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));assert.equal(ci.commit,commit);assert(ci.runs.some(r=>r.name==='Portal quality'&&r.status==='completed'&&r.conclusion==='success'),'Exact source CI required');
  const mods=JSON.parse(await fs.readFile(path.join(priv,'modules.json'),'utf8')).map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')})),targets=['mirracles-library.mjs','speech-handler.mjs','guru-recovery.mjs','public-mobile-recovery.mjs'];
  for(const name of targets){
   const committed=Buffer.from(g(['show','HEAD:speech-site/deployment/'+name])),local=await fs.readFile(path.join(site,'deployment',name));
   assert.equal(sha(normalise(local)),sha(normalise(committed)),'Source changed after commit: '+name);
   const old=mods.find(m=>m.name===name);if(old)old.bytes=committed;else mods.push({name,bytes:committed});
  }
  const manifest=JSON.parse(await fs.readFile(path.join(priv,'manifest.json'),'utf8')),assets=await api(base+worker+'/assets-upload-session','POST',{manifest});
  assert.equal(Object.keys(manifest).length,3707);assert(receipt.assetSources,'Refresh candidate assets before upload');
  const byHash=new Map();for(const [key,file]of Object.entries(receipt.assetSources)){const bytes=await fs.readFile(path.join(site,'deployment',file));assert.equal(sha(normalise(bytes)),sha(normalise(g(['show','HEAD:speech-site/deployment/'+file]))),'Asset source changed after commit: '+file);const blake=createRequire(path.join(site,'package.json'))('blake3-wasm');assert.equal(blake.hash(bytes.toString('base64')+'json').toString('hex').slice(0,32),manifest[key].hash);byHash.set(manifest[key].hash,bytes);}
  assert(assets.buckets.flat().every(h=>byHash.has(h)),'Unexpected asset gap; preserve complete live union');
  for(const bucket of assets.buckets){const form=new FormData();for(const hash of bucket)form.set(hash,new Blob([byHash.get(hash).toString('base64')],{type:'application/json'}),hash);const r=await api('/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/assets/upload?base64=true','POST',form,assets.jwt);assets.jwt=r.jwt||assets.jwt;}
  await save(path.join(priv,'assets.json'),assets);receipt.uploadedAssets=assets.buckets.flat().length;
  const s=before.settings,metadata={main_module:'pinnacle-route-v12.mjs',assets:{jwt:assets.jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}},compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{'workers/message':id}};
  for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)metadata[k]=s[k];
  const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const m of mods)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
  const result=await api(base+worker+'/versions?bindings_inherit=strict','POST',form);receipt.commit=commit;receipt.candidate=result.id;receipt.phase='uploaded';receipt.changedModules=targets;receipt.hashes=Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]));
  await save(receiptPath,receipt);
  const legacyName='pinnacle-legacy-social-metadata',legacyMods=JSON.parse(await fs.readFile(path.join(priv,'legacy-modules.json'),'utf8')).map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')})),legacySettings=JSON.parse(await fs.readFile(path.join(priv,'legacy-settings.json'),'utf8'));
  const legacyBytes=await fs.readFile(path.join(site,'deployment/legacy-recovery-entry.mjs'));assert.equal(sha(normalise(legacyBytes)),sha(normalise(g(['show','HEAD:speech-site/deployment/legacy-recovery-entry.mjs']))));
  assert.equal(legacySettings.bindings.length,0);legacyMods.find(m=>m.name==='entry.mjs').bytes=legacyBytes;
  const lm={main_module:'entry.mjs',compatibility_date:legacySettings.compatibility_date,compatibility_flags:legacySettings.compatibility_flags||[],bindings:[],annotations:{'workers/message':id}};for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(legacySettings[k]!==undefined)lm[k]=legacySettings[k];
  const lf=new FormData();lf.set('metadata',JSON.stringify(lm));for(const m of legacyMods)lf.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
  const lu=await api(base+legacyName+'/versions?bindings_inherit=strict','POST',lf);receipt.legacyCandidate=lu.id;receipt.legacyHashes=Object.fromEntries(legacyMods.map(m=>[m.name,sha(m.bytes)]));
 }else if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');assert(receipt.legacyCandidate);
  const legacyResult=await api(base+'pinnacle-legacy-social-metadata/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.legacyCandidate,percentage:100}]});receipt.legacyDeployment=legacyResult.id;receipt.legacyPromoted=true;await save(receiptPath,receipt);
  const result=await api(base+worker+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidate,percentage:100}]});receipt.deployment=result.id;receipt.portalPromoted=true;receipt.phase='promoted';receipt.promotedAt=new Date().toISOString();
 }else if(phase==='routes'){
  assert.equal(receipt.phase,'promoted');const old=before.routes.find(r=>r.pattern==='www.pinnacleblooms.org/guru/*');assert(old&&old.script==='pinnacle-legacy-social-metadata');
  await api(routePath+'/'+old.id,'PUT',{pattern:old.pattern,script:worker});receipt.guruRouteMoved=true;receipt.previousGuruRoute=old;receipt.phase='routed';
 }else if(phase==='verify'){
  const mods=await modules();assert.equal(mods.length,Object.keys(receipt.hashes).length);for(const m of mods)assert.equal(sha(m.bytes),receipt.hashes[m.name],m.name+' differs');
  const legacyMods=await modules('pinnacle-legacy-social-metadata');assert.equal(legacyMods.length,Object.keys(receipt.legacyHashes).length);for(const m of legacyMods)assert.equal(sha(m.bytes),receipt.legacyHashes[m.name],'Legacy module drift '+m.name);
  const legacySettings=await api(base+'pinnacle-legacy-social-metadata/settings'),originalLegacySettings=JSON.parse(await fs.readFile(path.join(priv,'legacy-settings.json'),'utf8'));for(const k of ['bindings','compatibility_date','compatibility_flags','placement','tail_consumers','logpush','observability','limits','usage_model'])if(originalLegacySettings[k]!==undefined)assert.deepEqual(legacySettings[k],originalLegacySettings[k],'Legacy setting drift '+k);
  assert(receipt.guruRouteMoved);receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.protectedWorkersUnchanged=protectedNames.filter(n=>n!=='pinnacle-legacy-social-metadata');receipt.routesPreserved=now.routes.length;receipt.bindingsPreserved=true;
 }else throw Error('Use prepare/upload/promote/verify');
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,version:receipt.candidate,deployment:receipt.deployment,routes:receipt.routesPreserved}));
}
