// Patch a committed legacy module into the CURRENT live Worker, retaining every
// other module, route and binding. No route, asset-union or unrelated page rebuild.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
const [phase,id]=process.argv.slice(2);
assert(/^[a-z0-9-]{6,80}$/.test(id||''),'Unique release ID required');
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site);
const priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment',id+'.json');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8'}).trim();
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare login required');
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',worker='pinnacle-legacy-social-metadata',routePath='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const protectedNames=['pinnacle-verify-route','pinnacle-ask','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-helpline'];
const sha=x=>createHash('sha256').update(x).digest('hex');
const normalise=x=>x.toString().replaceAll('\r\n','\n').trim();
async function committedBundle(){
 const output=await build({absWorkingDir:path.resolve(site,'../../..'),entryPoints:[path.join(site,'deployment/legacy-social-metadata/entry.mjs')],bundle:true,format:'esm',write:false,plugins:[{name:'committed-source',setup(b){b.onLoad({filter:/\.mjs$/},async args=>({contents:g(['show','HEAD:'+path.relative(repo,args.path).replaceAll('\\','/')]),loader:'js',resolveDir:path.dirname(args.path)}));}}]});
 return Buffer.from(output.outputFiles[0].text);
}
const save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
async function api(p,method='GET',body){
 const form=body instanceof FormData;
 const r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)});
 const j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;
}
const latest=async n=>(await api(base+n+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
async function state(){
 const [routes,settings,deployments]=await Promise.all([api(routePath),api(base+worker+'/settings'),Promise.all([worker,...protectedNames].map(async n=>[n,(await latest(n)).versions]))]);
 return {at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),settings,versions:Object.fromEntries(deployments)};
}
async function modules(){
 const r=await fetch('https://api.cloudflare.com/client/v4'+base+worker+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)});assert(r.ok);
 const out=[];for(const [key,v] of await r.formData())if(typeof v!=='string')out.push({name:v.name||key,bytes:Buffer.from(await v.arrayBuffer())});return out;
}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Receipt exists; reconcile rather than repeat');
 const before=await state(),mods=await modules();
 const deployed=mods.find(m=>m.name==='entry.mjs');assert(deployed,'Live entry module absent');
 await save(path.join(priv,'before.json'),before);
 await save(path.join(priv,'modules.json'),mods.map(m=>({name:m.name,base64:m.bytes.toString('base64')})));
 await fs.writeFile(path.join(priv,'entry-before.mjs'),deployed.bytes);
 assert.equal(sha(normalise(deployed.bytes)),sha(normalise(await committedBundle())),'Current HEAD bundle does not match the live module; compare captured entry-before.mjs');
 const receipt={id,phase:'prepared',at:before.at,baseCommit:g(['rev-parse','HEAD']),rollback:before.versions[worker],routeCount:before.routes.length,moduleCount:mods.length,originalHashes:Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]))};
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,routeCount:receipt.routeCount,moduleCount:receipt.moduleCount,rollback:receipt.rollback}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));
 const now=await state();assert.deepEqual(now.routes,before.routes,'Route drift');assert.deepEqual(now.settings.bindings,before.settings.bindings,'Binding drift');
 for(const n of protectedNames)assert.deepEqual(now.versions[n],before.versions[n],n+' changed');
 if(phase!=='verify')assert.deepEqual(now.versions[worker],before.versions[worker],'Legacy version changed; reconcile');
 if(phase==='upload'){
  const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Push source before upload');
  const bytes=await committedBundle();
  const mods=JSON.parse(await fs.readFile(path.join(priv,'modules.json'),'utf8')).map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')}));mods.find(m=>m.name==='entry.mjs').bytes=bytes;
  const s=before.settings,meta={main_module:'entry.mjs',compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(x=>({name:x.name,type:'inherit'})),annotations:{'workers/message':id}};
  for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)meta[k]=s[k];
  const form=new FormData();form.set('metadata',JSON.stringify(meta));for(const m of mods)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
  const result=await api(base+worker+'/versions?bindings_inherit=strict','POST',form);
  receipt.commit=commit;receipt.candidate=result.id;receipt.phase='uploaded';receipt.hashes=Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]));
 }else if(phase==='promote'){
  assert(receipt.phase==='uploaded');const result=await api(base+worker+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidate,percentage:100}]});receipt.deployment=result.id;receipt.phase='promoted';receipt.promotedAt=new Date().toISOString();
 }else if(phase==='verify'){
  assert.deepEqual(now.versions[worker],[{version_id:receipt.candidate,percentage:100}]);const mods=await modules();assert.equal(mods.length,Object.keys(receipt.hashes).length);
  for(const m of mods)assert.equal(sha(m.bytes),receipt.hashes[m.name],m.name+' differs');
  receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.protectedWorkersUnchanged=protectedNames;receipt.routesPreserved=now.routes.length;receipt.bindingsPreserved=true;
 }else throw Error('Use prepare/upload/promote/verify');
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,version:receipt.candidate,deployment:receipt.deployment,routes:receipt.routesPreserved}));
}
