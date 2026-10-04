// Bounded release of the existing centre repair Worker; never changes routes.
// Usage: node release.mjs upload|deploy|verify <absolute receipt directory>
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const [mode,output]=process.argv.slice(2);assert(['upload','deploy','verify'].includes(mode)&&path.isAbsolute(output));
const here=path.dirname(fileURLToPath(import.meta.url)),account='862998def1cd610fdb86b8e5c1d6ed4d',worker='pinnacle-centre-search-repair';
const baseline='dd7b8619-cbce-4db8-99cb-5e13f3ce6351',portalBaseline='e53a1016-15ab-462b-b005-b996261db856';
const base='/accounts/'+account+'/workers/scripts/'+worker;
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function raw(suffix,options={}){const r=await fetch('https://api.cloudflare.com/client/v4'+suffix,{...options,headers:{authorization:'Bearer '+token,...options.headers},signal:AbortSignal.timeout(45000)});assert(r.ok,'Cloudflare HTTP '+r.status);return r;}
async function api(suffix,options){const j=await(await raw(suffix,options)).json();assert(j.success,JSON.stringify(j.errors));return j.result;}
const latest=j=>j.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
async function snapshot(){
 const zones=await api('/zones?name=pinnacleblooms.org');assert.equal(zones.length,1);
 const [routes,settings,deployments,portal]=await Promise.all([api('/zones/'+zones[0].id+'/workers/routes'),api(base+'/settings'),api(base+'/deployments'),api('/accounts/'+account+'/workers/scripts/pinnacle-verify-route/deployments')]);
 return {at:new Date().toISOString(),worker,routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),settings,deployment:latest(deployments),portal:latest(portal)};
}
const state=await snapshot();assert.deepEqual(state.portal.versions,[{version_id:portalBaseline,percentage:100}],'Main portal changed; reconcile');
const save=(name,data)=>fs.writeFile(path.join(output,name),JSON.stringify(data,null,2)+'\n');
if(mode==='upload'){
 assert.deepEqual(state.deployment.versions,[{version_id:baseline,percentage:100}],'Centre worker changed; reconcile');assert.deepEqual(state.settings.bindings,[]);
 // content/v2 returns the latest uploaded source, even before activation.
 // Reconcile our recorded inactive upload rather than mistaking it for live code.
 const live=await(await raw(base+'/content/v2')).formData();const parts=[...live].filter(([,v])=>typeof v!=='string');
 if(parts.length===1){
  assert.equal(sha(Buffer.from(await parts[0][1].arrayBuffer())),sha(await fs.readFile(path.join(here,'legacy-v11.mjs'))),'Legacy baseline differs');
 }else{
  const prior=JSON.parse(await fs.readFile(path.join(output,'release-upload.json'),'utf8'));assert.equal(parts.length,prior.modules.length);
  for(const [key,value]of parts){const recorded=prior.modules.find(m=>m.name===(value.name||key));assert(recorded,'Unexpected uploaded module');assert.equal(sha(Buffer.from(await value.arrayBuffer())),recorded.sha256,'Unrecorded source upload');}
  assert.equal(prior.modules.find(m=>m.name==='legacy-v11.mjs')?.sha256,sha(await fs.readFile(path.join(here,'legacy-v11.mjs'))),'Legacy baseline differs');
 }
 const modules=await Promise.all(['entry.mjs','legacy-v11.mjs','kukatpally.mjs'].map(async name=>({name,bytes:await fs.readFile(path.join(here,name))})));
 const metadata={main_module:'entry.mjs',compatibility_date:state.settings.compatibility_date,compatibility_flags:state.settings.compatibility_flags||[],bindings:[],annotations:{'workers/message':'Kukatpally: parent goals, clear enquiry, directions and source links; exact legacy worker retained'}};
 for(const key of ['placement','tail_consumers','logpush'])if(state.settings[key]!==undefined)metadata[key]=state.settings[key];
 const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const {name,bytes}of modules)form.set(name,new Blob([bytes],{type:'application/javascript+module'}),name);
 await save('cloudflare-before.json',state);
 const result=await api(base+'/versions',{method:'POST',body:form});
 await save('release-upload.json',{baseline,portalBaseline,modules:modules.map(({name,bytes})=>({name,sha256:sha(bytes)})),result});
 console.log(JSON.stringify({uploaded:true,version:result.id,routes:state.routes.length,legacyUnchanged:true}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(output,'cloudflare-before.json'),'utf8')),saved=JSON.parse(await fs.readFile(path.join(output,'release-upload.json'),'utf8'));
 assert.deepEqual(state.routes,before.routes,'Routes changed; reconcile');assert.deepEqual(state.settings.bindings,before.settings.bindings,'Bindings changed');
 if(mode==='deploy'){
  assert.deepEqual(state.deployment.versions,[{version_id:baseline,percentage:100}]);
  for(const m of saved.modules)assert.equal(sha(await fs.readFile(path.join(here,m.name))),m.sha256,'Source changed after upload');
  const result=await api(base+'/deployments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({strategy:'percentage',versions:[{version_id:saved.result.id,percentage:100}]})});await save('release-deployment.json',result);console.log(JSON.stringify({deployed:true,version:saved.result.id,deployment:result.id}));
 }else{
  assert.deepEqual(state.deployment.versions,[{version_id:saved.result.id,percentage:100}]);await save('cloudflare-after.json',{...state,routesAndBindingsUnchanged:true,mainPortalUnchanged:true});console.log(JSON.stringify({verified:true,version:saved.result.id,routes:state.routes.length,bindings:state.settings.bindings.length,mainPortalUnchanged:true}));
 }
}
