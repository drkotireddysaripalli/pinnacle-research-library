// Bounded repair on three current Worker owners. Preserve all routes, asset
// versions, unrelated modules/settings and private services; keep per-step receipts.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {build} from 'esbuild';
const phase=process.argv[2],id='semrush-mobile-media-20261008',site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment',id+'.json');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe',g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true}).trim();
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const portal='pinnacle-verify-route',legacy='pinnacle-legacy-social-metadata',materials='materials-mobile-desktop-tracker',changed=[portal,legacy,materials],protectedNames=['pbn-planetscale','pinnacle-ask','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-helpline','pinnacle-root-sitemap'];
const sha=x=>createHash('sha256').update(x).digest('hex'),norm=x=>x.toString().replaceAll('\r\n','\n').trim(),save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
async function api(p,method='GET',body){const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;}
async function state(){const [routes,workers]=await Promise.all([api(routePath),Promise.all([...changed,...protectedNames].map(async n=>{const [d,s]=await Promise.all([api(base+n+'/deployments'),api(base+n+'/settings')]);return[n,{versions:d.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions,settings:s}];}))]);return{at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),workers:Object.fromEntries(workers)};}
async function modules(worker){const r=await fetch('https://api.cloudflare.com/client/v4'+base+worker+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)});assert(r.ok);const mods=[];for(const[k,v]of await r.formData())if(typeof v!=='string'){assert(/^[\w.-]+\.mjs$/.test(v.name||k));mods.push({name:v.name||k,base64:Buffer.from(await v.arrayBuffer()).toString('base64')});}return mods;}
async function legacyBundle(ref,recoveryRef=ref){const result=await build({absWorkingDir:path.resolve(site,'../../..'),entryPoints:[path.join(site,'deployment/legacy-social-metadata/entry.mjs')],bundle:true,format:'esm',write:false,plugins:[{name:'committed-source',setup(b){b.onLoad({filter:/\.mjs$/},args=>({contents:g(['show',(path.basename(args.path)==='public-mobile-recovery.mjs'?recoveryRef:ref)+':'+path.relative(repo,args.path).replaceAll('\\','/')]),loader:'js',resolveDir:path.dirname(args.path)}));}}]});return Buffer.from(result.outputFiles[0].text);}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Reconcile an existing receipt; do not repeat preparation');
 const [before,modRows]=await Promise.all([state(),Promise.all(changed.map(async n=>[n,await modules(n)]))]),allMods=Object.fromEntries(modRows);
 const paid=JSON.parse(await fs.readFile(path.join(site,'deployment/paid-journey-20261008.json'),'utf8')),oldLegacy=JSON.parse(await fs.readFile(path.join(site,'deployment/content-priority-legacy-20261008.json'),'utf8'));
 assert.deepEqual(before.workers[portal].versions,[{version_id:paid.candidate,percentage:100}]);
 assert.deepEqual(before.workers[legacy].versions,[{version_id:oldLegacy.candidate,percentage:100}]);
 const materialIntake=JSON.parse(await fs.readFile(path.join(priv,'materials-before.json'),'utf8'));
 assert.deepEqual(before.workers[materials].versions,materialIntake.deployments.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions);
 assert.equal(sha(norm(Buffer.from(allMods[portal].find(m=>m.name==='pinnacle-route-v12.mjs').base64,'base64'))),sha(norm(g(['show','HEAD:speech-site/deployment/pinnacle-route-v12.mjs']))));
 assert.equal(sha(norm(Buffer.from(allMods[legacy].find(m=>m.name==='entry.mjs').base64,'base64'))),sha(norm(await legacyBundle(oldLegacy.commit))),'Legacy source baseline differs');
 for(const m of materialIntake.mods)assert.equal(sha(Buffer.from(m.base64,'base64')),sha(Buffer.from(allMods[materials].find(n=>n.name===m.name)?.base64||'','base64')),'Materials changed since intake');
 const manifest=JSON.parse(await fs.readFile(path.join(site,'ask-private/paid-journey-20261008/manifest.json'),'utf8'));assert.equal(Object.keys(manifest).length,3706);
 const assets=await api(base+portal+'/assets-upload-session','POST',{manifest});assert.equal(assets.buckets.length,0,'No assets should change');
 const runtime=(await api(base+portal+'/versions/'+paid.candidate)).resources.script_runtime.assets;
 assert.deepEqual({html_handling:runtime.html_handling,not_found_handling:runtime.not_found_handling,run_worker_first:runtime.raw_run_worker_first},{html_handling:'none',not_found_handling:'none',run_worker_first:true});
 await save(path.join(priv,'before.json'),before);await save(path.join(priv,'modules.json'),allMods);await save(path.join(priv,'assets.json'),assets);
 const receipt={id,phase:'prepared',at:before.at,baseCommit:g(['rev-parse','HEAD']),legacyBaselineCommit:oldLegacy.commit,routeCount:before.routes.length,retainedAssets:3706,uploadedAssets:0,workers:Object.fromEntries(changed.map(n=>[n,{rollback:before.workers[n].versions,moduleCount:allMods[n].length,originalHashes:Object.fromEntries(allMods[n].map(m=>[m.name,sha(Buffer.from(m.base64,'base64'))]))}]))};
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,routes:receipt.routeCount,workers:changed,retainedAssets:3706}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8')),now=await state();assert.deepEqual(now.routes,before.routes,'Route drift');
 for(const n of protectedNames)assert.deepEqual(now.workers[n],before.workers[n],n+' drift');
 for(const n of changed){const expected=receipt.workers[n].deployment?[{version_id:receipt.workers[n].candidate,percentage:100}]:before.workers[n].versions;assert.deepEqual(now.workers[n].versions,expected,n+' version drift');for(const k of ['bindings','compatibility_date','compatibility_flags','placement','tail_consumers','logpush','observability','limits','usage_model'])assert.deepEqual(now.workers[n].settings[k],before.workers[n].settings[k],n+' '+k+' drift');}
 if(phase==='upload'){
  assert.equal(receipt.phase,'prepared');const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Push first');const ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));assert.equal(ci.head_sha,commit);assert.equal(ci.status,'completed');assert.equal(ci.conclusion,'success');
  const originals=JSON.parse(await fs.readFile(path.join(priv,'modules.json'),'utf8')),committed=p=>Buffer.from(g(['show','HEAD:speech-site/'+p]));
  for(const n of changed){
   assert(!receipt.workers[n].candidate,'Reconcile an already uploaded candidate');const mods=originals[n].map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')})),set=(name,bytes)=>{const old=mods.find(m=>m.name===name);if(old)old.bytes=bytes;else mods.push({name,bytes});};
   if(n===portal)set('public-mobile-recovery.mjs',committed('deployment/public-mobile-recovery.mjs'));
   if(n===legacy)set('entry.mjs',await legacyBundle(receipt.legacyBaselineCommit,'HEAD'));
   if(n===materials){const source=committed('deployment/materials-worker.mjs'),original=mods.find(m=>m.name==='worker.mjs').bytes.toString(),expected="import { repairMaterialsMedia } from './materials-media-repair.mjs';\n"+original.replace('response = await repairResponse(response, url);','response = repairMaterialsMedia(request, await repairResponse(response, url));');assert.equal(norm(source),norm(expected),'Only declared media wrapper may change');set('worker.mjs',source);set('materials-media-repair.mjs',committed('deployment/materials-media-repair.mjs'));}
   const s=before.workers[n].settings,meta={main_module:n===portal?'pinnacle-route-v12.mjs':n===legacy?'entry.mjs':'worker.mjs',compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{'workers/message':id}};
   for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)meta[k]=s[k];
   if(n===portal){const assets=JSON.parse(await fs.readFile(path.join(priv,'assets.json'),'utf8'));meta.assets={jwt:assets.jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}};}
   const form=new FormData();form.set('metadata',JSON.stringify(meta));for(const m of mods)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
   const result=await api(base+n+'/versions?bindings_inherit=strict','POST',form);Object.assign(receipt.workers[n],{candidate:result.id,hashes:Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]))});receipt.commit=commit;await save(receiptPath,receipt);
  }receipt.phase='uploaded';
 }else if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');for(const n of changed){if(receipt.workers[n].deployment)continue;const result=await api(base+n+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.workers[n].candidate,percentage:100}]});receipt.workers[n].deployment=result.id;receipt.workers[n].promotedAt=new Date().toISOString();await save(receiptPath,receipt);}receipt.phase='promoted';
 }else if(phase==='verify'){
  assert.equal(receipt.phase,'promoted');for(const n of changed){const mods=await modules(n),hashes=receipt.workers[n].hashes;assert.equal(mods.length,Object.keys(hashes).length);for(const m of mods)assert.equal(sha(Buffer.from(m.base64,'base64')),hashes[m.name],n+' '+m.name+' bytes differ');}receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.routesPreserved=now.routes.length;receipt.bindingsPreserved=true;receipt.protectedWorkersUnchanged=protectedNames;
 }else throw Error('Use prepare/upload/promote/verify');
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,workers:Object.fromEntries(changed.map(n=>[n,{version:receipt.workers[n].candidate,deployment:receipt.workers[n].deployment}]))}));
}
