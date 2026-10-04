import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const source=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(process.argv[3]),mode=process.argv[2];
const account='/accounts/862998def1cd610fdb86b8e5c1d6ed4d',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes',worker='pinnacle-legacy-social-metadata',api=account+'/workers/scripts/'+worker;
const names=['pinnacle-verify-route','pinnacle-ask','pinnacle-centre-search-repair','pinnacle-helpline',worker],baselineVersion='5b62fc46-9772-4e09-8a80-0ae1115b4026';
const auth=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(auth);
const sha=value=>crypto.createHash('sha256').update(value).digest('hex'),save=(n,v)=>fs.writeFile(path.join(root,n),JSON.stringify(v,null,2)+'\n');
async function call(p,o={}){const r=await fetch('https://api.cloudflare.com/client/v4'+p,{...o,headers:{authorization:'Bearer '+auth,...o.headers},signal:AbortSignal.timeout(45000)});const j=await r.json();assert(r.ok&&j.success,JSON.stringify({path:p,status:r.status,errors:j.errors}));return j.result;}
const latest=async n=>(await call(account+'/workers/scripts/'+n+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
const repo=path.resolve(source,'../../..'),git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
if(mode==='prepare'){
 const routes=await call(routePath),versions={},bindings={};assert.equal(routes.length,191);
 for(const n of names){versions[n]=await latest(n);const s=await call(account+'/workers/scripts/'+n+'/settings');bindings[n]={hash:sha(JSON.stringify(s.bindings)),names:s.bindings.map(b=>({name:b.name,type:b.type}))};}
 assert.equal(versions[worker].versions[0].version_id,baselineVersion);
 const r=await fetch('https://api.cloudflare.com/client/v4'+api+'/content/v2',{headers:{authorization:'Bearer '+auth}});assert(r.ok);const form=await r.formData(),modules=[];
 for(const [key,value]of form)if(typeof value!=='string'){const name=value.name||key;assert.equal(name,'entry.mjs');const bytes=Buffer.from(await value.arrayBuffer());await fs.writeFile(path.join(root,'baseline-entry.mjs'),bytes);modules.push({name,sha256:sha(bytes)});const committed=execFileSync(git,['-C',repo,'show','HEAD:speech-site/deployment/legacy-social-metadata/entry.mjs']);assert.equal(sha(bytes.toString().replaceAll('\r\n','\n')),sha(committed.toString().replaceAll('\r\n','\n')));}
 await save('baseline.json',{at:new Date().toISOString(),routes,versions,bindings,modules,settings:await call(api+'/settings')});console.log(JSON.stringify({prepared:true,routes:routes.length,version:baselineVersion}));
}else{
 const b=JSON.parse(await fs.readFile(path.join(root,'baseline.json')));assert.deepEqual(await call(routePath),b.routes);
 for(const n of names){if(mode==='verify'&&n===worker)continue;assert.deepEqual((await latest(n)).versions,b.versions[n].versions,n+' changed');}
 if(mode==='upload'){
  const commit=execFileSync(git,['-C',repo,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),remote=execFileSync(git,['-C',repo,'ls-remote','origin','refs/heads/main'],{encoding:'utf8'}).split(/\s/)[0];assert.equal(commit,remote);
  assert.equal(b.settings.bindings.length,0);const form=new FormData(),modules=[];
  form.set('metadata',JSON.stringify({main_module:'entry.mjs',compatibility_date:b.settings.compatibility_date,compatibility_flags:b.settings.compatibility_flags||[],bindings:[],annotations:{'workers/message':'Remove fingerprinted invalid legacy FAQ debug dump; preserve answers, schema, design and routes'}}));
  for(const name of ['entry.mjs','payload.mjs']){const bytes=await fs.readFile(path.join(source,name)),committed=execFileSync(git,['-C',repo,'show','HEAD:speech-site/deployment/legacy-social-metadata/'+name]);assert.equal(sha(bytes.toString().replaceAll('\r\n','\n')),sha(committed.toString().replaceAll('\r\n','\n')));form.set(name,new Blob([bytes],{type:'application/javascript+module'}),name);modules.push({name,sha256:sha(bytes)});}
  const result=await call(api+'/versions',{method:'POST',body:form});await save('upload.json',{at:new Date().toISOString(),commit,result,modules,rollback:baselineVersion});console.log(JSON.stringify({uploaded:result.id,commit}));
 }else if(mode==='deploy'){
  const u=JSON.parse(await fs.readFile(path.join(root,'upload.json')));const result=await call(api+'/deployments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({strategy:'percentage',versions:[{version_id:u.result.id,percentage:100}]})});await save('deployment.json',{version:u.result.id,commit:u.commit,result,rollback:baselineVersion});console.log(JSON.stringify({version:u.result.id,deployment:result.id}));
 }else if(mode==='verify'){
  const d=JSON.parse(await fs.readFile(path.join(root,'deployment.json'))),u=JSON.parse(await fs.readFile(path.join(root,'upload.json')));assert.equal((await latest(worker)).versions[0].version_id,d.version);
  for(const n of names){const s=await call(account+'/workers/scripts/'+n+'/settings');assert.equal(sha(JSON.stringify(s.bindings)),b.bindings[n].hash,n+' bindings changed');}
  const r=await fetch('https://api.cloudflare.com/client/v4'+api+'/content/v2',{headers:{authorization:'Bearer '+auth}});assert(r.ok);const form=await r.formData(),modules=[];
  for(const [key,v]of form)if(typeof v!=='string'){const name=v.name||key,bytes=Buffer.from(await v.arrayBuffer());assert.equal(sha(bytes),u.modules.find(m=>m.name===name)?.sha256,name);modules.push(name);}assert.equal(modules.length,2);
  await save('infrastructure-proof.json',{at:new Date().toISOString(),routesPreserved:191,bindingsPreserved:true,otherApplicationVersionsPreserved:true,version:d.version,modules,sourceMatched:true,rollback:baselineVersion});console.log(JSON.stringify({verified:true,routes:191,sourceMatched:true}));
 }else throw Error('Use prepare, upload, deploy or verify');
}
