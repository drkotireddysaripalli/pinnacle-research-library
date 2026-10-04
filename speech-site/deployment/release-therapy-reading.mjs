// Bounded release compiled from shared Astro source; retain the current asset binding.
// node deployment/release-therapy-reading.mjs upload|deploy|verify <absolute receipt folder>
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const [mode,out]=process.argv.slice(2);assert(['upload','deploy','verify'].includes(mode)&&path.isAbsolute(out));
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../..'),worker='pinnacle-verify-route';
const baseline=JSON.parse(await fs.readFile(path.join(out,'baseline.json'),'utf8')),apiRoot='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',routeApi='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),save=(name,v)=>fs.writeFile(path.join(out,name),JSON.stringify(v,null,2)+'\n');
async function raw(p,o={}){const r=await fetch('https://api.cloudflare.com/client/v4'+p,{...o,headers:{authorization:'Bearer '+token,...o.headers},signal:AbortSignal.timeout(45000)});assert(r.ok,'Cloudflare HTTP '+r.status);return r;}
async function api(p,o){const j=await(await raw(p,o)).json();assert(j.success,JSON.stringify(j.errors));return j.result;}
const latest=j=>j.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
async function snapshot(){const routes=(await api(routeApi)).sort((a,b)=>a.pattern.localeCompare(b.pattern));const workers={};await Promise.all(Object.keys(baseline.workers).map(async name=>{const [settings,d]=await Promise.all([api(apiRoot+name+'/settings'),api(apiRoot+name+'/deployments')]);workers[name]={settings,deployment:latest(d)};}));return {at:new Date().toISOString(),routes,workers};}
const state=await snapshot(),active=state.workers[worker],old=baseline.workers[worker];assert.deepEqual(state.routes,baseline.routes,'Route drift');
for(const [name,b]of Object.entries(baseline.workers)){assert.deepEqual(state.workers[name].settings.bindings,b.settings.bindings,name+' binding drift');if(name!==worker)assert.deepEqual(state.workers[name].deployment.versions,b.deployment.versions,name+' version drift');}
const changed=['speech-handler.mjs'],added=['therapy-reading.mjs','therapy-reading-content.mjs'];
const sourcePath=name=>changed.includes(name)||added.includes(name)?path.join(here,name):path.join(out,'baseline-'+name);
if(mode==='upload'){
 assert.deepEqual(active.deployment.versions,old.deployment.versions,'Live main version drift');
 const f=await(await raw(apiRoot+worker+'/content/v2')).formData(),live=[...f].filter(([,v])=>typeof v!=='string');assert.equal(live.length,baseline.modules.length);
 for(const [key,v]of live)assert.equal(sha(Buffer.from(await v.arrayBuffer())),baseline.modules.find(m=>m.name===(v.name||key))?.sha256,'Live source drift');
 const s=active.settings,metadata={main_module:'pinnacle-route-v12.mjs',keep_assets:true,compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{'workers/message':'Source-built speech and OT book samples/language choices; preserve all live assets and routes'}};
 for(const k of ['placement','tail_consumers','logpush','observability'])if(s[k]!==undefined)metadata[k]=s[k];
 const form=new FormData();form.set('metadata',JSON.stringify(metadata));const hashes=[];
 for(const m of [...baseline.modules,...added.map(name=>({name}))]){const bytes=await fs.readFile(sourcePath(m.name));if(!changed.includes(m.name)&&!added.includes(m.name))assert.equal(sha(bytes),m.sha256);form.set(m.name,new Blob([bytes],{type:'application/javascript+module'}),m.name);hashes.push({name:m.name,sha256:sha(bytes)});}
 const result=await api(apiRoot+worker+'/versions?bindings_inherit=strict',{method:'POST',body:form});await save('release-upload.json',{result,modules:hashes,rollback:old.deployment.versions});console.log(JSON.stringify({uploaded:result.id,modules:hashes.length,routes:state.routes.length}));
}else{
 const upload=JSON.parse(await fs.readFile(path.join(out,'release-upload.json'),'utf8'));
 if(mode==='deploy'){
  assert.deepEqual(active.deployment.versions,old.deployment.versions,'Live main version drift');
  const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe',g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8'}).trim(),commit=g(['rev-parse','HEAD']);
  assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Exact source not pushed');assert.equal(g(['diff','--name-only','HEAD','--','speech-site']),'','Uncommitted source changes');
  for(const m of upload.modules)assert.equal(sha(await fs.readFile(sourcePath(m.name))),m.sha256,'Source changed after upload');
  const d=await api(apiRoot+worker+'/deployments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({strategy:'percentage',versions:[{version_id:upload.result.id,percentage:100}]})});
  await save('release-deployment.json',{at:new Date().toISOString(),commit,version:upload.result.id,deployment:d.id,rollback:upload.rollback});console.log(JSON.stringify({deployed:true,commit,version:upload.result.id,deployment:d.id}));
 }else{
  assert.deepEqual(active.deployment.versions,[{version_id:upload.result.id,percentage:100}]);
  const f=await(await raw(apiRoot+worker+'/content/v2')).formData(),live=[...f].filter(([,v])=>typeof v!=='string');assert.equal(live.length,upload.modules.length);
  for(const [key,v]of live)assert.equal(sha(Buffer.from(await v.arrayBuffer())),upload.modules.find(m=>m.name===(v.name||key))?.sha256);
  await save('cloudflare-after.json',{...state,sourceBytesMatch:true,bindingsAndOtherVersionsPreserved:true,totalRoutes:state.routes.length});console.log(JSON.stringify({verified:true,modules:live.length,routes:state.routes.length,bindings:active.settings.bindings.length}));
 }
}
