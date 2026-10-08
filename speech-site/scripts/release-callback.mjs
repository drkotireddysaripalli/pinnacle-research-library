// Shared callback release over the reconciled full live portal union.
// Preserve unchanged modules, every route, binding and protected service.
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
const g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true}).trim();
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare login required');
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',worker='pinnacle-verify-route',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const protectedNames=['pinnacle-ask','pinnacle-ask-mcp','pinnacle-legacy-social-metadata','pinnacle-centre-search-repair','pinnacle-helpline','pinnacle-root-sitemap','pbn-planetscale'];
const sha=x=>createHash('sha256').update(x).digest('hex'),normalise=x=>x.toString().replaceAll('\r\n','\n').trim();
const save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
async function api(p,method='GET',body){
 const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)}),j=await r.json();
 assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;
}
const latest=async n=>(await api(base+n+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
async function state(){
 const [routes,settings,protectedRows]=await Promise.all([api(routePath),api(base+worker+'/settings'),Promise.all([worker,...protectedNames].map(async n=>[n,{versions:await latest(n),bindings:(await api(base+n+'/settings')).bindings}]))]);
 return {at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),settings,workers:Object.fromEntries(protectedRows)};
}
async function modules(){
 const r=await fetch('https://api.cloudflare.com/client/v4'+base+worker+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)});assert(r.ok);
 const out=[];for(const [key,v] of await r.formData())if(typeof v!=='string'){const name=v.name||key;assert(/^[\w.-]+\.mjs$/.test(name));out.push({name,bytes:Buffer.from(await v.arrayBuffer())});}return out;
}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Receipt exists; reconcile instead of repeating');
 const [before,mods]=await Promise.all([state(),modules()]);
 const live=mods.find(m=>m.name==='pinnacle-route-v12.mjs');assert(live,'Live shared script module absent');
 assert.equal(sha(normalise(live.bytes)),sha(normalise(g(['show','HEAD:speech-site/deployment/pinnacle-route-v12.mjs']))),'HEAD baseline differs from live');
 await save(path.join(priv,'before.json'),before);await save(path.join(priv,'modules.json'),mods.map(m=>({name:m.name,base64:m.bytes.toString('base64')})));
 const union=path.join(site,'release-'+id);assert(!(await fs.stat(union).catch(()=>null)),'Reconcile existing asset union');
 await fs.cp(path.join(site,'release-enquiry-source-20261008'),union,{recursive:true});
 const readerKey='/mirracles-library-data/reader.json';await fs.mkdir(path.dirname(path.join(union,readerKey)),{recursive:true});await fs.copyFile(path.join(site,'ask-private/knowledge-journey-20261008/reader.json'),path.join(union,readerKey));
 const blake3=createRequire(path.join(site,'package.json'))('blake3-wasm'),priorManifest=JSON.parse(await fs.readFile(path.join(site,'ask-private/knowledge-journey-portal-20261008/manifest.json'),'utf8'));
 const assetHash=(bytes,key)=>blake3.hash(bytes.toString('base64')+path.extname(key).slice(1)).toString('hex').slice(0,32);
 assert.equal(Object.keys(priorManifest).length,3690,'Current retained asset count');
 for(const [key,r]of Object.entries(priorManifest)){const b=await fs.readFile(path.join(union,key));assert.equal(assetHash(b,key),r.hash,'Baseline mismatch '+key);assert.equal(b.length,r.size);}
 const changed=new Set(),htmlPaths=[];
 async function overlay(key,file){const bytes=await fs.readFile(file),target=path.join(union,key),old=await fs.readFile(target).catch(()=>null);await fs.mkdir(path.dirname(target),{recursive:true});if(!old||!old.equals(bytes)){await fs.writeFile(target,bytes);changed.add(key);}return bytes;}
 const directory=JSON.parse(await fs.readFile(path.join(site,'src/data/centre-directory.json'),'utf8'));
 for(const c of directory){const pathname=new URL(c.profileUrl).pathname,file=path.join(site,'dist',pathname+'.html');if(!(await fs.stat(file).catch(()=>null)))continue;const html=await fs.readFile(file,'utf8');if(!html.includes('data-callback-contract="durable-enrolment-v1"'))continue;htmlPaths.push({url:'https://www.pinnacleblooms.org'+pathname,key:'/pinnacle-pages-html/'+c.id+'.html',file});}
 htmlPaths.push({url:'https://www.pinnacleblooms.org/centers',key:'/pinnacle-pages-html/centers.html',file:path.join(site,'dist/centers.html')},{url:'https://www.pinnacleblooms.org/speech-therapy/service-information',key:'/pinnacle-pages-html/service-information.html',file:path.join(site,'dist/speech-therapy/service-information.html')},{url:'https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india',key:'/pinnacle-pages-html/enrolment.html',file:path.join(site,'dist/enroll-autism-speech-aba-therapies-india.html')});
 assert(htmlPaths.length>=60&&htmlPaths.length<=64,'Bounded current centre callback cohort');
 for(const page of htmlPaths){const html=(await overlay(page.key,page.file)).toString();for(const key of new Set(html.match(/\/pinnacle-pages-(?:assets|fonts|scripts)\/[\w./-]+/g)||[]))await overlay(key,path.join(site,'dist',key));}
 const clients=['/pinnacle-pages-scripts/enrolment.js','/pinnacle-pages-scripts/speech-measurement.js'];for(const key of clients)await overlay(key,path.join(site,'public',key));
 const htmlKeys=new Set(htmlPaths.map(p=>p.key)),changedModules=[];
 for(const mod of mods){let text=mod.bytes.toString(),next=text;const match=text.match(/const records=(\{[^\n]+\});/);if(match){const records=JSON.parse(match[1]);let update=false;for(const key of [...htmlKeys,...clients])if(records[key]){const b=await fs.readFile(path.join(union,key));records[key]={hash:sha(b).slice(0,16),body:b.toString('base64')};update=true;}if(update)next=text.replace(match[0],'const records='+JSON.stringify(records)+';');}
 if(mod.name==='pinnacle-route-v12.mjs'){const match=next.match(/const SPEECH_INVENTORY=(\{[^\n]+\});/);assert(match);const inventory=JSON.parse(match[1]);for(const key of changed)inventory[key]=sha(await fs.readFile(path.join(union,key))).slice(0,16);next=next.replace(match[0],'const SPEECH_INVENTORY='+JSON.stringify(inventory)+';');}
 if(next!==text){changedModules.push(mod.name);await fs.writeFile(path.join(site,'deployment',mod.name),next);}}
 const manifest={};for(const e of await fs.readdir(union,{recursive:true,withFileTypes:true}))if(e.isFile()){const file=path.join(e.parentPath,e.name),key='/'+path.relative(union,file).replaceAll('\\','/'),bytes=await fs.readFile(file);manifest[key]={hash:assetHash(bytes,key),size:bytes.length};}
 for(const key of Object.keys(priorManifest))assert(manifest[key],'Retained asset missing '+key);
 await save(path.join(priv,'manifest.json'),manifest);await save(path.join(priv,'changed-assets.json'),[...changed]);await save(path.join(priv,'html-paths.json'),htmlPaths.map(({url,key})=>({url,key})));
 await save(path.join(priv,'candidate-modules.json'),changedModules);
 const runtime=(await api(base+worker+'/versions/'+before.workers[worker].versions[0].version_id)).resources.script_runtime.assets;
 assert.deepEqual({html_handling:runtime.html_handling,not_found_handling:runtime.not_found_handling,run_worker_first:runtime.raw_run_worker_first},{html_handling:'none',not_found_handling:'none',run_worker_first:true});
 const receipt={id,phase:'prepared',at:before.at,baseCommit:g(['rev-parse','HEAD']),rollback:before.workers[worker].versions,routeCount:before.routes.length,moduleCount:mods.length,retainedAssets:3690,changedAssets:changed.size,totalAssets:Object.keys(manifest).length,changedModules,htmlCount:htmlPaths.length,originalHashes:Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]))};
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,routes:receipt.routeCount,modules:receipt.moduleCount,rollback:receipt.rollback,retainedAssets:3690,totalAssets:receipt.totalAssets,changedAssets:receipt.changedAssets,changedModules,htmlCount:receipt.htmlCount}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8')),now=await state();
 const expectedSettings=structuredClone(before.settings);
 // A version upload updates this declared release annotation before promotion.
 if(receipt.candidate)expectedSettings.annotations={...expectedSettings.annotations,'workers/message':id};
 assert.deepEqual(now.routes,before.routes,'Route drift');assert.deepEqual(now.settings,expectedSettings,'Portal settings drift');
 for(const n of protectedNames)assert.deepEqual(now.workers[n],before.workers[n],n+' changed');
 assert.deepEqual(now.workers[worker].versions,phase==='verify'?[{version_id:receipt.candidate,percentage:100}]:before.workers[worker].versions,'Portal version drift');
 if(phase==='upload'){
  assert.equal(receipt.phase,'prepared');const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Push source before upload');
  const ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));assert.equal(ci.head_sha,commit);assert.equal(ci.status,'completed');assert.equal(ci.conclusion,'success','Exact source CI required');
  const mods=JSON.parse(await fs.readFile(path.join(priv,'modules.json'),'utf8')).map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')})),targets=receipt.changedModules;
  for(const target of targets){let bytes=await fs.readFile(path.join(site,'deployment',target));assert.equal(sha(normalise(bytes)),sha(normalise(g(['show','HEAD:speech-site/deployment/'+target]))),'Source changed after commit');const existing=mods.find(m=>m.name===target);if(existing)existing.bytes=bytes;else mods.push({name:target,bytes});}
  const manifest=JSON.parse(await fs.readFile(path.join(priv,'manifest.json'),'utf8')),session=await api(base+worker+'/assets-upload-session','POST',{manifest}),lookup=new Map(Object.entries(manifest).map(([key,r])=>[r.hash,key])),changed=new Set(JSON.parse(await fs.readFile(path.join(priv,'changed-assets.json'),'utf8')));let jwt=session.jwt,uploaded=0;
  for(const bucket of session.buckets){const form=new FormData();for(const hash of bucket){const key=lookup.get(hash);assert(changed.has(key),'Unexpected upload '+key);const b=await fs.readFile(path.join(site,'release-'+id,key));form.set(hash,new Blob([b.toString('base64')],{type:(await import('mime')).default.getType(key)||'application/octet-stream'}),hash);}const upload=await fetch('https://api.cloudflare.com/client/v4/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/assets/upload?base64=true',{method:'POST',headers:{authorization:'Bearer '+jwt},body:form,signal:AbortSignal.timeout(45000)}),j=await upload.json();assert(upload.ok&&j.success);jwt=j.result.jwt||jwt;uploaded+=bucket.length;}
  const assets={jwt,uploaded};await save(path.join(priv,'assets.json'),assets);receipt.uploadedAssets=uploaded;
  const s=before.settings,metadata={main_module:'pinnacle-route-v12.mjs',assets:{jwt:assets.jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}},compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{'workers/message':id}};
  for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)metadata[k]=s[k];
  const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const m of mods)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
  const result=await api(base+worker+'/versions?bindings_inherit=strict','POST',form);receipt.commit=commit;receipt.candidate=result.id;receipt.phase='uploaded';receipt.changedModules=targets;receipt.hashes=Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]));
 }else if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');const result=await api(base+worker+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidate,percentage:100}]});receipt.deployment=result.id;receipt.phase='promoted';receipt.promotedAt=new Date().toISOString();
 }else if(phase==='verify'){
  const mods=await modules();assert.equal(mods.length,Object.keys(receipt.hashes).length);for(const m of mods)assert.equal(sha(m.bytes),receipt.hashes[m.name],m.name+' differs');
  receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.protectedWorkersUnchanged=protectedNames;receipt.routesPreserved=now.routes.length;receipt.bindingsPreserved=true;
 }else throw Error('Use prepare/upload/promote/verify');
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,version:receipt.candidate,deployment:receipt.deployment,routes:receipt.routesPreserved}));
}
