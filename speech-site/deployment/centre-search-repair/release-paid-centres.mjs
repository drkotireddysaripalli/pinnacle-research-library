// Replace only the declared modules in a freshly captured live centre Worker.
// No route, binding, asset, secret or other Worker mutation is performed.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const [mode,out]=process.argv.slice(2);assert(['upload','deploy','verify'].includes(mode)&&path.isAbsolute(out));
const here=path.dirname(fileURLToPath(import.meta.url)),worker='pinnacle-centre-search-repair';
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',routeApi='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const baseline=JSON.parse(await fs.readFile(path.join(out,'baseline.json'),'utf8'));
const changed=new Set(['entry.mjs','centre-measurement.mjs','paid-centre-entry.mjs']);
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),save=(name,value)=>fs.writeFile(path.join(out,name),JSON.stringify(value,null,2)+'\n');
async function raw(endpoint,options={}){const r=await fetch('https://api.cloudflare.com/client/v4'+endpoint,{...options,headers:{authorization:'Bearer '+token,...options.headers},signal:AbortSignal.timeout(45000)});assert(r.ok,'Cloudflare '+r.status+' '+endpoint);return r;}
async function api(endpoint,options){const j=await(await raw(endpoint,options)).json();assert(j.success,JSON.stringify(j.errors));return j.result;}
async function snapshot(){const state={at:new Date().toISOString(),routes:await api(routeApi),workers:{}};await Promise.all(Object.keys(baseline.workers).map(async name=>{const [settings,d]=await Promise.all([api(base+name+'/settings'),api(base+name+'/deployments')]);state.workers[name]={settings,deployment:d.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0]};}));return state;}
const stableRoutes=rows=>rows.map(r=>({...r})).sort((a,b)=>a.pattern.localeCompare(b.pattern));
function guard(state,expectCentre){assert.deepEqual(stableRoutes(state.routes),stableRoutes(baseline.routes),'Full route set changed');for(const [name,b]of Object.entries(baseline.workers)){assert.deepEqual(state.workers[name].settings.bindings,b.settings.bindings,name+' bindings changed');if(name!==worker)assert.deepEqual(state.workers[name].deployment.versions,b.deployment.versions,name+' version changed');}if(expectCentre)assert.deepEqual(state.workers[worker].deployment.versions,expectCentre,'Centre live version changed');}
async function modules(){const form=await(await raw(base+worker+'/content/v2')).formData();const values=[];for(const [key,value]of form){if(typeof value==='string')continue;const name=value.name||key;const bytes=Buffer.from(await value.arrayBuffer());values.push({name,bytes,sha256:sha(bytes)});}return values;}
const state=await snapshot();const old=baseline.workers[worker];
if(mode==='upload'){
 guard(state,old.deployment.versions);const live=await modules();assert.equal(live.length,baseline.modules.length);for(const m of live)assert.equal(m.sha256,baseline.modules.find(b=>b.name===m.name)?.sha256,m.name+' live source drift');
 const settings=state.workers[worker].settings;const metadata={main_module:'entry.mjs',compatibility_date:settings.compatibility_date,compatibility_flags:settings.compatibility_flags||[],bindings:settings.bindings,annotations:{'workers/message':'Paid-centre mobile entry, existing assessment handoff and click-to-load video'}};for(const key of ['placement','tail_consumers','logpush','observability'])if(settings[key]!==undefined)metadata[key]=settings[key];
 const body=new FormData();body.set('metadata',JSON.stringify(metadata));const manifest=[];
 for(const name of new Set([...live.map(m=>m.name),'paid-centre-entry.mjs'])){const bytes=await fs.readFile(path.join(here,name));if(!changed.has(name))assert.equal(sha(bytes),live.find(m=>m.name===name)?.sha256,name+' protected local source drift');body.set(name,new Blob([bytes],{type:'application/javascript+module'}),name);manifest.push({name,size:bytes.length,sha256:sha(bytes)});}
 const result=await api(base+worker+'/versions',{method:'POST',body});await save('release-upload.json',{at:new Date().toISOString(),version:result.id,modules:manifest,rollback:old.deployment.versions});console.log(JSON.stringify({uploaded:true,version:result.id,modules:manifest.length,routes:state.routes.length}));
}else{
 const upload=JSON.parse(await fs.readFile(path.join(out,'release-upload.json'),'utf8'));
 if(mode==='deploy'){
  guard(state,old.deployment.versions);const git=process.env.PINNACLE_GIT||'C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';const g=args=>execFileSync(git,args,{cwd:here,encoding:'utf8'}).trim();const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Source not pushed');assert.equal(g(['status','--porcelain','--','.']), '','Uncommitted centre code');for(const m of upload.modules)assert.equal(sha(await fs.readFile(path.join(here,m.name))),m.sha256,m.name+' changed after upload');
  const ci=JSON.parse(await fs.readFile(path.join(out,'ci.json'),'utf8'));assert.equal(ci.head_sha,commit);assert.equal(ci.conclusion,'success','Exact source CI not successful');
  const d=await api(base+worker+'/deployments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({strategy:'percentage',versions:[{version_id:upload.version,percentage:100}]})});await save('release-deployment.json',{at:new Date().toISOString(),commit,version:upload.version,deployment:d.id,rollback:upload.rollback,ci:ci.html_url});console.log(JSON.stringify({deployed:true,commit,version:upload.version,deployment:d.id}));
 }else{
  guard(state,[{version_id:upload.version,percentage:100}]);const live=await modules();assert.equal(live.length,upload.modules.length);for(const m of live)assert.equal(m.sha256,upload.modules.find(b=>b.name===m.name)?.sha256,m.name+' live mismatch');await save('cloudflare-after.json',{...state,routeCount:state.routes.length,otherWorkersUnchanged:true,bindingsUnchanged:true,sourceBytesMatch:true});console.log(JSON.stringify({verified:true,routes:state.routes.length,modules:live.length,otherWorkersUnchanged:true,bindingsUnchanged:true}));
 }
}
