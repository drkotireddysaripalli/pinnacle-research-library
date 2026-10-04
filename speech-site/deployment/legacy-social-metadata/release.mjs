import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const source=path.dirname(fileURLToPath(import.meta.url));
const mode=process.argv[2],root=path.resolve(process.argv[3]||'.');
const account='/accounts/862998def1cd610fdb86b8e5c1d6ed4d';
const routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const worker='pinnacle-legacy-social-metadata',api=account+'/workers/scripts/'+worker;
const patterns=['www.pinnacleblooms.org/faq*','www.pinnacleblooms.org/physiotherapy*'];
const auth=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
assert(auth);
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const save=(name,value)=>fs.writeFile(path.join(root,name),JSON.stringify(value,null,2)+'\n');
async function call(p,options={}){
 const r=await fetch('https://api.cloudflare.com/client/v4'+p,{...options,headers:{authorization:'Bearer '+auth,...options.headers},signal:AbortSignal.timeout(45000)});
 const j=await r.json();assert(r.ok&&j.success,JSON.stringify({path:p,status:r.status,errors:j.errors}));return j.result;
}
const send=(p,method,body)=>call(p,{method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
const latest=async name=>(await call(account+'/workers/scripts/'+name+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
const baseline=JSON.parse(await fs.readFile(path.join(root,'baseline.json'),'utf8'));
assert.equal(baseline.routes.length,189);assert.equal(baseline.workerExists,false);
async function guardOriginals(routes){
 for(const original of baseline.routes) assert.deepEqual(routes.find(r=>r.id===original.id),original,'Existing route changed: '+original.pattern);
 for(const [name,deployment] of Object.entries(baseline.versions))assert.deepEqual((await latest(name)).versions,deployment.versions,'Existing Worker changed: '+name);
}
if(mode==='prepare'){
 const routes=await call(routePath);await guardOriginals(routes);assert.deepEqual(routes,baseline.routes);
 const bindings={};
 for(const name of Object.keys(baseline.versions)){const s=await call(account+'/workers/scripts/'+name+'/settings');bindings[name]={hash:sha(JSON.stringify(s.bindings)),names:s.bindings.map(b=>({name:b.name,type:b.type}))};}
 await save('binding-baseline.json',bindings);console.log(JSON.stringify({prepared:true,existingRoutes:routes.length,workers:Object.keys(bindings)}));
}else if(mode==='deploy'){
 const routes=await call(routePath);await guardOriginals(routes);assert.deepEqual(routes,baseline.routes);
 const scripts=await call(account+'/workers/scripts');assert(!scripts.some(s=>s.id===worker),'Worker already exists; reconcile before retry');
 const repo=path.resolve(source,'../../..'),git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
 const commit=execFileSync(git,['-C',repo,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const remote=execFileSync(git,['-C',repo,'ls-remote','origin','refs/heads/main'],{encoding:'utf8'}).split(/\s/)[0];assert.equal(remote,commit,'Exact source must be pushed before activation');
 const bytes=await fs.readFile(path.join(source,'entry.mjs'));
 const saved=execFileSync(git,['-C',repo,'show','HEAD:speech-site/deployment/legacy-social-metadata/entry.mjs']);
 assert.equal(sha(saved.toString().replaceAll('\r\n','\n')),sha(bytes.toString().replaceAll('\r\n','\n')),'Source differs from commit');
 const form=new FormData();form.set('metadata',JSON.stringify({main_module:'entry.mjs',compatibility_date:'2026-10-04',bindings:[],annotations:{'workers/message':'Guarded HTTPS social URL correction for legacy FAQ and physiotherapy; no page content changes'}}));
 form.set('entry.mjs',new Blob([bytes],{type:'application/javascript+module'}),'entry.mjs');
 const uploaded=await call(api,{method:'PUT',body:form});
 await save('upload.json',{at:new Date().toISOString(),commit,sourceSha256:sha(bytes),uploaded});
 await send(api+'/subdomain','POST',{enabled:false,previews_enabled:false});
 const deployment=await latest(worker),created=[];
 await save('deployment.json',{commit,deployment,created,rollback:'Delete only the two route IDs recorded in created; no existing route or application version was changed.'});
 for(const pattern of patterns){
  const current=await call(routePath);await guardOriginals(current);assert.equal(current.length,189+created.length);assert(!current.some(r=>r.pattern===pattern));
  created.push(await send(routePath,'POST',{pattern,script:worker,request_limit_fail_open:true}));
  await save('deployment.json',{commit,deployment,created,rollback:'Delete only the two route IDs in created to restore exact origin serving. The metadata Worker has no application bindings or stored data.'});
 }
 console.log(JSON.stringify({commit,worker,version:deployment.versions,created}));
}else if(mode==='verify'){
 const d=JSON.parse(await fs.readFile(path.join(root,'deployment.json'))),bindings=JSON.parse(await fs.readFile(path.join(root,'binding-baseline.json')));
 const routes=await call(routePath);await guardOriginals(routes);assert.equal(routes.length,191);
 for(const item of d.created)assert.deepEqual(routes.find(r=>r.id===item.id),item);
 for(const [name,prior] of Object.entries(bindings)){const s=await call(account+'/workers/scripts/'+name+'/settings');assert.equal(sha(JSON.stringify(s.bindings)),prior.hash,name+' bindings changed');}
 const current=await latest(worker);assert.deepEqual(current.versions,d.deployment.versions);
 const settings=await call(api+'/settings');assert.equal(settings.bindings.length,0);
 const response=await fetch('https://api.cloudflare.com/client/v4'+api+'/content/v2',{headers:{authorization:'Bearer '+auth}});assert(response.ok);const modules=await response.formData();let deployed;
 for(const [name,v]of modules)if(typeof v!=='string'&&(v.name==='entry.mjs'||name==='entry.mjs'))deployed=Buffer.from(await v.arrayBuffer());
 assert(deployed);assert.equal(sha(deployed),sha(await fs.readFile(path.join(source,'entry.mjs'))));
 await save('infrastructure-proof.json',{at:new Date().toISOString(),existingRoutesPreserved:189,totalRoutes:191,existingWorkerVersionsPreserved:true,existingBindingsPreserved:true,created:d.created,workerVersion:current.versions[0].version_id,sourceSha256:sha(deployed),rollback:d.rollback});
 console.log(JSON.stringify({verified:true,existingRoutesPreserved:189,totalRoutes:191,sourceMatches:true}));
}else throw Error('Use prepare, deploy or verify plus absolute receipt directory');
