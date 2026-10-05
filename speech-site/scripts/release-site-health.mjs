// Exact-version, route-preserving release for the two existing legacy Workers.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const mode=process.argv[2],id='site-health-shared-v2-20261005',privateDir='ask-private/'+id,receiptPath='deployment/'+id+'.json';
const account='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',routeAPI='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const changed=['pinnacle-legacy-social-metadata','pinnacle-root-sitemap'],protectedNames=['pinnacle-verify-route','pinnacle-ask','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-helpline'];
const extraRoutes=['www.pinnacleblooms.org/staff/*','www.pinnacleblooms.org/franchise-autism-therapy-center'];
const token=(await fs.readFile(process.env.APPDATA+'/xdg.config/.wrangler/config/default.toml','utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe',g=args=>execFileSync(git,args,{encoding:'utf8'}).trim();
const hash=x=>createHash('sha256').update(x).digest('hex');
const norm=rows=>rows.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern));
async function api(p,method='GET',body){const form=body instanceof FormData;const r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)});const j=await r.json();assert(r.ok&&j.success,JSON.stringify({path:p,status:r.status,errors:j.errors}));return j.result;}
async function state(){const records=await Promise.all([...changed,...protectedNames].map(async name=>{const [d,s]=await Promise.all([api(account+name+'/deployments'),api(account+name+'/settings')]);return [name,{versions:d.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions,settings:s}];}));return {at:new Date().toISOString(),routes:norm(await api(routeAPI)),workers:Object.fromEntries(records)};}
const save=(p,v)=>fs.writeFile(p,JSON.stringify(v,null,2)+'\n');await fs.mkdir(privateDir,{recursive:true});
if(mode==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Existing release receipt: reconcile before retry');
 const before=await state();assert.equal(before.routes.length,207);assert.equal(before.workers['pinnacle-legacy-social-metadata'].versions[0].version_id,'5d338157-d8ca-4c50-90b5-2db2ba1cca88');
 for(const name of changed)assert.equal(before.workers[name].settings.bindings.length,0);
 await save(privateDir+'/before.json',before);await save(receiptPath,{id,phase:'prepared',at:before.at,sourceCommit:g(['rev-parse','HEAD']),beforeRouteCount:before.routes.length,rollback:Object.fromEntries(changed.map(n=>[n,before.workers[n].versions])),candidates:{},promoted:[],routesAdded:[]});console.log('Prepared exact live baseline, 207 routes.');
}else{
 const before=JSON.parse(await fs.readFile(privateDir+'/before.json','utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));const now=await state();
 for(const name of [...changed,...protectedNames]){const expected=receipt.promoted.includes(name)?[{version_id:receipt.candidates[name].id,percentage:100}]:before.workers[name].versions;assert.deepEqual(now.workers[name].versions,expected,name+' version drift');assert.equal(hash(JSON.stringify(now.workers[name].settings.bindings)),hash(JSON.stringify(before.workers[name].settings.bindings)),name+' binding drift');}
 function checkRoutes(rows){for(const r of before.routes)assert.deepEqual(rows.find(x=>x.id===r.id),r,'Existing route drift');assert.equal(rows.length,before.routes.length+receipt.routesAdded.length);for(const r of receipt.routesAdded)assert.deepEqual(rows.find(x=>x.id===r.id),r);}
 checkRoutes(now.routes);
 if(mode==='upload'){
  assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],receipt.sourceCommit,'Exact source must be pushed');assert.equal(g(['rev-parse','HEAD']),receipt.sourceCommit);
  for(const name of changed){assert(!receipt.candidates[name],'Reconcile already uploaded version');const modules=name==='pinnacle-root-sitemap'?{'index.mjs':'deployment/root-sitemap/index.mjs'}:Object.fromEntries(['entry.mjs','payload.mjs','schema.mjs','discovery.mjs','organization.mjs','staff-records.mjs','staff-routes.mjs','franchise-canonical.mjs'].map(n=>[n,'deployment/legacy-social-metadata/'+n]));const form=new FormData(),s=before.workers[name].settings;form.set('metadata',JSON.stringify({main_module:name==='pinnacle-root-sitemap'?'index.mjs':'entry.mjs',compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:[],...(s.observability?{observability:s.observability}:{}),annotations:{'workers/message':id}}));const hashes={};
   for(const [module,file]of Object.entries(modules)){const bytes=await fs.readFile(file),committed=execFileSync(git,['show','HEAD:speech-site/'+file]);assert.equal(hash(bytes.toString().replaceAll('\r\n','\n')),hash(committed.toString().replaceAll('\r\n','\n')));form.set(module,new Blob([bytes],{type:'application/javascript+module'}),module);hashes[module]=hash(bytes);}
   const result=await api(account+name+'/versions','POST',form);receipt.candidates[name]={id:result.id,modules:hashes};await save(receiptPath,receipt);
  }receipt.phase='uploaded';
 }else if(mode==='promote'){
  for(const name of changed){if(receipt.promoted.includes(name))continue;assert(receipt.candidates[name]);await api(account+name+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidates[name].id,percentage:100}]});receipt.promoted.push(name);await save(receiptPath,receipt);}
  for(const pattern of extraRoutes){if(receipt.routesAdded.some(r=>r.pattern===pattern))continue;checkRoutes(norm(await api(routeAPI)));assert(!before.routes.some(r=>r.pattern===pattern));const r=await api(routeAPI,'POST',{pattern,script:'pinnacle-legacy-social-metadata',request_limit_fail_open:true});receipt.routesAdded.push({id:r.id,pattern:r.pattern,script:r.script});await save(receiptPath,receipt);}
  receipt.phase='promoted';
 }else if(mode==='verify'){
  assert.equal(receipt.promoted.length,2);assert.equal(receipt.routesAdded.length,2);
  for(const name of changed){const r=await fetch('https://api.cloudflare.com/client/v4'+account+name+'/content/v2',{headers:{authorization:'Bearer '+token}});assert(r.ok);const form=await r.formData(),found=[];for(const [k,v]of form)if(typeof v!=='string'){const n=v.name||k;assert.equal(hash(Buffer.from(await v.arrayBuffer())),receipt.candidates[name].modules[n]);found.push(n);}assert.equal(found.length,Object.keys(receipt.candidates[name].modules).length);}
  receipt.infrastructureVerifiedAt=new Date().toISOString();receipt.protectedWorkersAndBindingsUnchanged=true;receipt.afterRouteCount=now.routes.length;
 }else throw Error('Use prepare/upload/promote/verify');
 await save(receiptPath,receipt);console.log(JSON.stringify(receipt));
}
