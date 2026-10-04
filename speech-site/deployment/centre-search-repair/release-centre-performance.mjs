// Centre performance release: captured live source, unchanged routes/bindings.
// Usage: node release-centre-performance.mjs upload|deploy|verify <absolute receipt directory>
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const [mode,out]=process.argv.slice(2);assert(['upload','deploy','verify'].includes(mode)&&path.isAbsolute(out));
const here=path.dirname(fileURLToPath(import.meta.url)),apiRoot='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',worker='pinnacle-centre-search-repair',routeApi='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const baseline=JSON.parse(await fs.readFile(path.join(out,'baseline.json'),'utf8'));
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),save=(name,v)=>fs.writeFile(path.join(out,name),JSON.stringify(v,null,2)+'\n');
async function raw(url,options={}){const r=await fetch('https://api.cloudflare.com/client/v4'+url,{...options,headers:{authorization:'Bearer '+token,...options.headers},signal:AbortSignal.timeout(45000)});assert(r.ok,'Cloudflare HTTP '+r.status);return r;}
async function api(url,options){const j=await(await raw(url,options)).json();assert(j.success,JSON.stringify(j.errors));return j.result;}
const latest=j=>j.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
async function snapshot(){
 const result={at:new Date().toISOString(),routes:(await api(routeApi)).sort((a,b)=>a.pattern.localeCompare(b.pattern)),workers:{}};
 for(const name of Object.keys(baseline.workers)){const [settings,d]=await Promise.all([api(apiRoot+name+'/settings'),api(apiRoot+name+'/deployments')]);result.workers[name]={settings,deployment:latest(d)};}
 return result;
}
function guardOthers(state){
 for(const [name,b]of Object.entries(baseline.workers)){
  assert.deepEqual(state.workers[name].settings.bindings,b.settings.bindings,name+' binding drift');
  if(name!==worker)assert.deepEqual(state.workers[name].deployment.versions,b.deployment.versions,name+' version drift');
 }
}
const state=await snapshot();guardOthers(state);const active=state.workers[worker],old=baseline.workers[worker];
const modules=['entry.mjs','legacy-v11.mjs','kukatpally.mjs','lbnagar.mjs','labbipet.mjs','annanagar.mjs','centre-media.mjs'];
if(mode==='upload'){
 assert.deepEqual(state.routes,baseline.routes,'Route drift');assert.deepEqual(active.deployment.versions,old.deployment.versions,'Centre version drift');
 const form=await(await raw(apiRoot+worker+'/content/v2')).formData(),live=[...form].filter(([,v])=>typeof v!=='string');assert.equal(live.length,baseline.modules.length);
 for(const [key,value]of live){const name=value.name||key;const found=baseline.modules.find(x=>x.name===name);assert(found,'Unexpected live module '+name);assert.equal(sha(Buffer.from(await value.arrayBuffer())),found.sha256,name+' live source drift');}
 for(const name of ['entry.mjs','legacy-v11.mjs'])assert.equal(sha(await fs.readFile(path.join(here,name))),baseline.modules.find(x=>x.name===name).sha256,name+' protected module drift');
 const metadata={main_module:'entry.mjs',compatibility_date:active.settings.compatibility_date,compatibility_flags:active.settings.compatibility_flags||[],bindings:active.settings.bindings,annotations:{'workers/message':'Four centres: mobile journey parity, original image optimisation and repeated icon reduction'}};
 for(const key of ['placement','tail_consumers','logpush','observability'])if(active.settings[key]!==undefined)metadata[key]=active.settings[key];
 const body=new FormData();body.set('metadata',JSON.stringify(metadata));const hashes=[];
 for(const name of modules){const bytes=await fs.readFile(path.join(here,name));body.set(name,new Blob([bytes],{type:'application/javascript+module'}),name);hashes.push({name,sha256:sha(bytes)});}
 const result=await api(apiRoot+worker+'/versions',{method:'POST',body});await save('release-upload.json',{result,modules:hashes,rollback:old.deployment.versions});
 console.log(JSON.stringify({uploaded:true,version:result.id,existingRoutes:state.routes.length}));
}else{
 const upload=JSON.parse(await fs.readFile(path.join(out,'release-upload.json'),'utf8'));
 if(mode==='deploy'){
  assert.deepEqual(state.routes,baseline.routes);assert.deepEqual(active.deployment.versions,old.deployment.versions);
  const git=process.env.PINNACLE_GIT||'C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
  const g=args=>execFileSync(git,args,{cwd:here,encoding:'utf8'}).trim();
  const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Exact source not pushed');assert.equal(g(['status','--porcelain','--','.']), '','Uncommitted deployment source');
  for(const m of upload.modules)assert.equal(sha(await fs.readFile(path.join(here,m.name))),m.sha256,'Changed source after upload');
  const d=await api(apiRoot+worker+'/deployments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({strategy:'percentage',versions:[{version_id:upload.result.id,percentage:100}]})});
  await save('release-deployment.json',{at:new Date().toISOString(),commit,version:upload.result.id,deployment:d.id,rollback:upload.rollback});
  console.log(JSON.stringify({deployed:true,commit,version:upload.result.id,deployment:d.id}));
 }else{
  const d=JSON.parse(await fs.readFile(path.join(out,'release-deployment.json'),'utf8'));
  assert.deepEqual(active.deployment.versions,[{version_id:upload.result.id,percentage:100}]);
  assert.deepEqual(state.routes,baseline.routes,'Route drift');
  const form=await(await raw(apiRoot+worker+'/content/v2')).formData(),live=[...form].filter(([,v])=>typeof v!=='string');assert.equal(live.length,upload.modules.length);
  for(const [key,value]of live)assert.equal(sha(Buffer.from(await value.arrayBuffer())),upload.modules.find(x=>x.name===(value.name||key))?.sha256);
  await save('cloudflare-after.json',{...state,priorRoutesPreserved:baseline.routes.length,totalRoutes:state.routes.length,bindingsPreserved:true,otherVersionsPreserved:true,sourceBytesMatch:true});
  console.log(JSON.stringify({verified:true,priorRoutesPreserved:baseline.routes.length,totalRoutes:state.routes.length,sourceBytesMatch:true,bindingsAndOtherVersionsPreserved:true}));
 }
}

