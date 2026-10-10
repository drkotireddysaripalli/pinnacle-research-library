// Exact-current, route-preserving release for shared Semrush and prime-page repairs.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';

const phase=process.argv[2],id='semrush-prime-pages-20261010';
assert(['prepare','upload','promote','verify'].includes(phase),'Use prepare/upload/promote/verify');
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment',id+'.json');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024}).trim();
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare login required');
const account='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',routeAPI='/zones/8b13f18e0589996b5d6512552372b434/workers/routes';
const portal='pinnacle-verify-route',legacy='pinnacle-legacy-social-metadata',sitemap='pinnacle-root-sitemap',targets=[portal,legacy,sitemap];
const protectedNames=['pbn-planetscale','pinnacle-ask','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-helpline','materials-mobile-desktop-tracker'];
const specs={
 [portal]:{main:'pinnacle-route-v12.mjs',replacements:[['url-health-repair.mjs','deployment/url-health-repair.mjs'],['aba-assets.mjs','deployment/aba-assets.mjs']],assets:true},
 [legacy]:{main:'entry.mjs',module:'entry.mjs',entry:'deployment/legacy-social-metadata/entry.mjs'},
 [sitemap]:{main:'index.mjs',module:'index.mjs',entry:'deployment/root-sitemap/index.mjs'}
};
const sha=x=>createHash('sha256').update(x).digest('hex'),norm=x=>x.toString().replaceAll('\r\n','\n').trim(),save=(p,x)=>fs.writeFile(p,JSON.stringify(x,null,2)+'\n');
async function api(p,method='GET',body){const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(60000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;}
const latest=async n=>(await api(account+n+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
async function state(){const [routes,rows]=await Promise.all([api(routeAPI),Promise.all([...targets,...protectedNames].map(async n=>[n,{versions:await latest(n),settings:await api(account+n+'/settings')}]))]);return{at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),workers:Object.fromEntries(rows)};}
async function modules(n){const r=await fetch('https://api.cloudflare.com/client/v4'+account+n+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(60000)});assert(r.ok,'Unable to read '+n);const out=[];for(const[k,v]of await r.formData())if(typeof v!=='string')out.push({name:v.name||k,bytes:Buffer.from(await v.arrayBuffer())});return out;}
async function bundle(entry,ref){const result=await build({entryPoints:[path.join(site,entry)],bundle:true,format:'esm',write:false,plugins:ref?[{name:'git-source',setup(b){b.onLoad({filter:/\.mjs$/},args=>({contents:g(['show',ref+':'+path.relative(repo,args.path).replaceAll('\\','/')]),loader:'js',resolveDir:path.dirname(args.path)}));}}]:[]});return Buffer.from(result.outputFiles[0].contents);}
function metadata(settings,spec,assets){const m={main_module:spec.main,compatibility_date:settings.compatibility_date,compatibility_flags:settings.compatibility_flags||[],bindings:settings.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{'workers/message':id}};if(assets)m.assets={jwt:assets.jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}};for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(settings[k]!==undefined)m[k]=settings[k];return m;}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Existing receipt: reconcile its phase');
 const base=g(['rev-parse','origin/main']),[before,...moduleRows]=await Promise.all([state(),...targets.map(modules)]),captured=Object.fromEntries(targets.map((n,i)=>[n,moduleRows[i]]));
 for(const n of targets){const spec=specs[n];if(n===portal){for(const [module,entry] of spec.replacements){const live=captured[n].find(m=>m.name===module);assert(live,'Missing '+n+'/'+module);const expected=await bundle(entry,base);assert.equal(sha(norm(live.bytes)),sha(norm(expected)),n+'/'+module+' live baseline differs from origin/main');}}else{const live=captured[n].find(m=>m.name===spec.module);assert(live,'Missing '+n+'/'+spec.module);if(n!==legacy){const expected=await bundle(spec.entry,base);assert.equal(sha(norm(live.bytes)),sha(norm(expected)),n+' live baseline differs from origin/main');}}await save(path.join(priv,n+'-modules.json'),captured[n].map(m=>({name:m.name,base64:m.bytes.toString('base64')})));}
 const manifest=JSON.parse(await fs.readFile(path.join(site,'ask-private/testingbot-regression-20261010/manifest.json'),'utf8'));assert(Object.keys(manifest).length>=3707,'Complete current portal asset union required');
 const assets=await api(account+portal+'/assets-upload-session','POST',{manifest});assert.equal(assets.buckets.flat().length,0,'Portal assets changed unexpectedly');
 await save(path.join(priv,'before.json'),before);await save(path.join(priv,'assets.json'),assets);await save(path.join(priv,'manifest.json'),manifest);
 const receipt={id,phase:'prepared',at:before.at,base,commit:null,routeCount:before.routes.length,assetCount:Object.keys(manifest).length,workers:Object.fromEntries(targets.map(n=>[n,{rollback:before.workers[n].versions,originalHashes:Object.fromEntries(captured[n].map(m=>[m.name,sha(m.bytes)]))}]))};await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,base,routes:receipt.routeCount,assets:receipt.assetCount,workers:targets}));
}else{
 const receipt=JSON.parse(await fs.readFile(receiptPath,'utf8')),before=JSON.parse(await fs.readFile(path.join(priv,'before.json'),'utf8'));assert(!receipt.pending,'Reconcile recorded pending mutation before retry');const now=await state();assert.deepEqual(now.routes,before.routes,'Route drift');
 for(const n of [...targets,...protectedNames]){const expected=structuredClone(before.workers[n]);if(receipt.workers[n]?.candidate)expected.settings.annotations={...expected.settings.annotations,'workers/message':id};if(receipt.workers[n]?.promoted)expected.versions=[{version_id:receipt.workers[n].candidate,percentage:100}];assert.deepEqual(now.workers[n],expected,n+' drift');}
 const checkpoint=async(n,kind,fn)=>{receipt.pending={worker:n,kind,startedAt:new Date().toISOString()};await save(receiptPath,receipt);return fn();};
 if(phase==='upload'){
  assert(['prepared','partially-uploaded','uploaded'].includes(receipt.phase));const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Merge exact source to main before upload');receipt.commit=commit;
  const ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));assert.equal(ci.head_sha,commit);assert.equal(ci.status,'completed');assert.equal(ci.conclusion,'success','Exact source CI required');
  for(const n of targets){const record=receipt.workers[n];if(record.candidate)continue;const spec=specs[n],mods=JSON.parse(await fs.readFile(path.join(priv,n+'-modules.json'),'utf8')).map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')}));
   if(n===legacy){
    const live=mods.find(m=>m.name==='entry.mjs');assert(live&&!mods.some(m=>m.name==='entry-base.mjs'),'Unexpected legacy wrapper baseline');live.name='entry-base.mjs';
    const health=await bundle('deployment/url-health-repair.mjs');mods.push({name:'url-health-repair.mjs',bytes:health});
    mods.push({name:'entry.mjs',bytes:Buffer.from("import base from './entry-base.mjs';import{urlHealthAlias,repairUrlHealth}from './url-health-repair.mjs';export default{async fetch(request,env,ctx){const alias=urlHealthAlias(request);if(alias)return alias;const response=await base.fetch(request,env,ctx);return repairUrlHealth(request,response);}};\n")});
   }else if(n===portal){for(const [module,entry] of spec.replacements){const current=mods.find(m=>m.name===module);assert(current);current.bytes=await bundle(entry);}}
   else{const replacement=await bundle(spec.entry),current=mods.find(m=>m.name===spec.module);assert(current);current.bytes=replacement;}
   const assets=spec.assets?JSON.parse(await fs.readFile(path.join(priv,'assets.json'),'utf8')):null,form=new FormData();form.set('metadata',JSON.stringify(metadata(before.workers[n].settings,spec,assets)));for(const m of mods)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);const result=await checkpoint(n,'upload',()=>api(account+n+'/versions?bindings_inherit=strict','POST',form));record.candidate=result.id;record.hashes=Object.fromEntries(mods.map(m=>[m.name,sha(m.bytes)]));delete receipt.pending;receipt.phase='partially-uploaded';await save(receiptPath,receipt);}receipt.phase='uploaded';
 }else if(phase==='promote'){
  assert(['uploaded','partially-promoted','promoted'].includes(receipt.phase));for(const n of [sitemap,legacy,portal]){const record=receipt.workers[n];if(record.promoted)continue;const result=await checkpoint(n,'promote',()=>api(account+n+'/deployments','POST',{strategy:'percentage',versions:[{version_id:record.candidate,percentage:100}]}));record.deployment=result.id;record.promoted=true;record.promotedAt=new Date().toISOString();delete receipt.pending;receipt.phase='partially-promoted';await save(receiptPath,receipt);}receipt.phase='promoted';
 }else if(phase==='verify'){
  assert.equal(receipt.phase,'promoted');for(const n of targets){const rows=await modules(n),hashes=receipt.workers[n].hashes;assert.equal(rows.length,Object.keys(hashes).length);for(const m of rows)assert.equal(sha(m.bytes),hashes[m.name],n+'/'+m.name);}receipt.phase='verified-configuration';receipt.verifiedAt=now.at;receipt.routesPreserved=now.routes.length;receipt.bindingsPreserved=true;receipt.protectedWorkersUnchanged=protectedNames;
 }else throw Error('Use prepare/upload/promote/verify');await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,commit:receipt.commit,routes:receipt.routesPreserved,workers:Object.fromEntries(targets.map(n=>[n,{candidate:receipt.workers[n].candidate,deployment:receipt.workers[n].deployment}]))}));
}
