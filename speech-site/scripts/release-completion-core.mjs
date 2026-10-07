// Existing live Worker settings/bindings/routes are the release baseline.
// Private receiver code is read from ask-private and never enters Git.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {build} from 'esbuild';
const [target,phase]=process.argv.slice(2);assert(['receiver-stage','receiver-final','sitemap'].includes(target));assert(['upload','promote','verify'].includes(phase));
const dir=path.resolve('ask-private/completion-20261007'),site=path.resolve('.'),repo=path.dirname(site);
const worker=target==='sitemap'?'pinnacle-root-sitemap':'pbn-planetscale',base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/';
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const g=args=>execFileSync('C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe',['-C',repo,...args],{encoding:'utf8',windowsHide:true}).trim();
const sha=x=>createHash('sha256').update(x).digest('hex'),receiptPath=path.join(site,'deployment','completion-'+target+'-20261007.json');
const api=async(p,method='GET',body)=>{const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(60000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;};
const current=async()=>(await api(base+worker+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
const snapshot=JSON.parse(await fs.readFile(path.join(dir,'snapshot.json'),'utf8')),settings=JSON.parse(await fs.readFile(path.join(dir,worker+'-settings.json'),'utf8'));
const expected=target==='receiver-final'?JSON.parse(await fs.readFile(path.join(site,'deployment/completion-receiver-stage-20261007.json'),'utf8')).version:snapshot.workers[worker].versions[0].version_id;
if(phase==='upload'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Existing release must be reconciled');
 assert.deepEqual((await current()).versions,[{version_id:expected,percentage:100}],'Live version drift');
 const liveSettings=await api(base+worker+'/settings');assert.deepEqual(liveSettings,settings,'Worker settings changed; reconcile');
 const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Committed source must be pushed');
 const modules=[];
 if(target==='sitemap'){
  const built=await build({entryPoints:['deployment/root-sitemap/index.mjs'],bundle:true,format:'esm',write:false});modules.push({name:'index.mjs',bytes:Buffer.from(built.outputFiles[0].contents)});
 }else{
  const candidate='ask-private/completion-receiver-20261007';
  modules.push({name:'index.js',bytes:await fs.readFile(path.join(candidate,target==='receiver-final'?'production-index.js':'index.js'))});
  modules.push({name:'website-enrolment-receipt.mjs',bytes:await fs.readFile(path.join(candidate,'website-enrolment-receipt.mjs'))});
  if(target==='receiver-stage')modules.push({name:'enrolment-receipt-qa.mjs',bytes:await fs.readFile(path.join(candidate,'enrolment-receipt-qa.mjs'))});
 }
 const metadata={main_module:target==='sitemap'?'index.mjs':'index.js',compatibility_date:settings.compatibility_date,compatibility_flags:settings.compatibility_flags||[],bindings:settings.bindings.map(b=>({name:b.name,type:'inherit'})),annotations:settings.annotations||{}};
 for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(settings[k]!==undefined)metadata[k]=settings[k];
 const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const m of modules)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
 const result=await api(base+worker+'/versions?bindings_inherit=strict','POST',form),receipt={target,worker,phase:'uploaded',commit,rollback:[{version_id:expected,percentage:100}],version:result.id,at:new Date().toISOString(),hashes:Object.fromEntries(modules.map(m=>[m.name,sha(m.bytes)])),existingBindingsPreserved:settings.bindings.map(b=>b.name),newPublicRoutes:0};
 await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));console.log(JSON.stringify({target,phase:receipt.phase,version:receipt.version,commit}));
}else{
 const receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));
 if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');assert.deepEqual((await current()).versions,receipt.rollback,'Live version drift');const d=await api(base+worker+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.version,percentage:100}]});receipt.deployment=d.id;receipt.phase='promoted';
 }else{
  assert.deepEqual((await current()).versions,[{version_id:receipt.version,percentage:100}]);assert.deepEqual(await api(base+worker+'/settings'),settings);
  const r=await fetch('https://api.cloudflare.com/client/v4'+base+worker+'/content/v2',{headers:{authorization:'Bearer '+token}});assert(r.ok);const actual={};for(const [key,v]of await r.formData())if(typeof v!=='string')actual[v.name||key]=sha(Buffer.from(await v.arrayBuffer()));assert.deepEqual(actual,receipt.hashes);receipt.phase='verified-configuration';
 }
 receipt.updatedAt=new Date().toISOString();await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));console.log(JSON.stringify({target,phase:receipt.phase,version:receipt.version,deployment:receipt.deployment}));
}
