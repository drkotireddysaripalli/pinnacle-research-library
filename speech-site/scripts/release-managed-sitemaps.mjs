import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {parse} from 'parse5';
export const id='managed-sitemaps-20261013',out='outputs/'+id,priv='ask-private/'+id;
export const names=['pinnacle-verify-route','pinnacle-legacy-social-metadata','pinnacle-ask','pinnacle-root-sitemap','materials-mobile-desktop-tracker','pbn-planetscale','pinnacle-helpline','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-google-ads-call-measurement'];
export const hosts=['www.pinnacleblooms.org','pinnacleblooms.org','interventions.pinnacleblooms.org','materials.pinnacleblooms.org','pediatricians.pinnacleblooms.org'];
export const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',zone='/zones/8b13f18e0589996b5d6512552372b434';
export const sha=b=>createHash('sha256').update(b).digest('hex');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=args=>execFileSync(git,args,{encoding:'utf8',windowsHide:true}).trim();
function ghHeaders(){const raw=execFileSync(git,['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true,env:{...process.env,GCM_INTERACTIVE:'Never',GIT_TERMINAL_PROMPT:'0'}}),c=Object.fromEntries(raw.trim().split('\n').map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)]}));return{authorization:'Basic '+Buffer.from(c.username+':'+c.password).toString('base64'),'User-Agent':'Pinnacle-managed-release','Content-Type':'application/json'};}
export async function gh(route,method='GET',body){const r=await fetch('https://api.github.com/repos/drkotireddysaripalli/pinnacle-research-library'+route,{method,headers:ghHeaders(),body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(60000)}),raw=await r.text(),j=raw?JSON.parse(raw):{};assert(r.ok,j.message||'GitHub readback');return j;}
export async function save(p,j){await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,JSON.stringify(j,null,2)+'\n');}
export const read=p=>fs.readFile(p,'utf8').then(JSON.parse);
export async function api(p,method='GET',body,auth){
 const token=auth||(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
 const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body===undefined?undefined:form?body:JSON.stringify(body),signal:AbortSignal.timeout(60000)}),j=await r.json();
 assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;
}
export async function state(){const [routes,workers]=await Promise.all([api(zone+'/workers/routes'),Promise.all(names.map(async n=>{const [d,s]=await Promise.all([api(base+n+'/deployments'),api(base+n+'/settings')]);return[n,{versions:d.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions,settings:s}]}))]);return{at:new Date().toISOString(),routes:routes.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),workers:Object.fromEntries(workers)};}
export async function modules(n){const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)[1],r=await fetch('https://api.cloudflare.com/client/v4'+base+n+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(60000)});assert(r.ok,'Module read '+n+' '+r.status);const items=[];for(const [k,v]of await r.formData())if(typeof v!=='string')items.push({name:v.name||k,type:v.type,base64:Buffer.from(await v.arrayBuffer()).toString('base64')});return{entry:r.headers.get('cf-entrypoint'),items};}
async function capture(){
 assert(!(await fs.stat(priv+'/before.json').catch(()=>null)),'Reuse existing capture');
 const before=await state();await save(priv+'/before.json',before);
 const targets=names.slice(0,5);await Promise.all(targets.map(async n=>save(priv+'/'+n+'-original.json',await modules(n))));
 const publicRoots=[];for(const host of hosts)for(const route of ['/robots.txt','/llms.txt']){
  const r=await fetch('https://'+host+route,{redirect:'manual',signal:AbortSignal.timeout(20000)}),body=await r.text();
  publicRoots.push({host,path:route,status:r.status,type:r.headers.get('content-type'),location:r.headers.get('location'),sha256:sha(body),body});
 }await save(priv+'/public-roots-before.json',publicRoots);
 await save(out+'/release.json',{id,phase:'captured',at:before.at,pending:null,routeCount:before.routes.length,changedWorkers:[],routeAdditions:[],deployed:false});
 console.log(JSON.stringify({phase:'captured',routes:before.routes.length,workers:targets.map(n=>({name:n,assets:before.workers[n].settings.bindings.filter(b=>b.type==='assets').map(b=>b.name)})),roots:publicRoots.map(({body,...r})=>r)}));
}
async function prepare(){
 const before=await read(priv+'/before.json'),current=await state();
 assert.deepEqual(current.routes,before.routes,'Reconcile route changes before assembly');
 for(const n of names)assert.deepEqual(current.workers[n].versions,before.workers[n].versions,'Live version changed: '+n);
 const manifest=await read('release-managed-sitemaps-20261013/manifest.json');
 const original=await read(priv+'/pinnacle-verify-route-original.json');
 const sourceDir=path.resolve('../../pf12-offer-integration-20261011/speech-site/release-navratri-discount-20261011');
 const assetManifest=await read('../../pf12-offer-integration-20261011/speech-site/ask-private/navratri-discount-20261011/manifest.json');
 const blake3=createRequire(path.resolve('package.json'))('blake3-wasm');
 const assetHash=(bytes,name)=>blake3.hash(bytes.toString('base64')+path.extname(name).slice(1)).toString('hex').slice(0,32);
 const fullDir=path.resolve('release-managed-sitemap-union-20261013');await fs.mkdir(fullDir,{recursive:true});
 const searchRoots=[];
 for(const folder of ['../../pf12-offer-integration-20261011/speech-site','../../seo-shared-repairs-20261011/speech-site','../../server-error-family-20261009/speech-site','../../ask-distribution-release-20261003/speech-site']){
  for(const d of (await fs.readdir(folder,{withFileTypes:true})).filter(x=>x.isDirectory()&&x.name.startsWith('release-')).reverse())searchRoots.push(path.resolve(folder,d.name));
 }
 let retained=0;
 for(const [name,meta] of Object.entries(assetManifest)){
  let b;
  for(const folder of searchRoots){const found=await fs.readFile(path.join(folder,name)).catch(e=>{if(e.code==='ENOENT')return null;throw e;});if(found?.length===meta.size&&assetHash(found,name)===meta.hash){b=found;break;}}
  assert(b,'No hash-matching retained public asset: '+name);
  const target=path.join(fullDir,name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,b);
  if(++retained%500===0)console.log('Verified retained assets '+retained);
 }
 const fullManifest=structuredClone(assetManifest),changed=[];
 async function add(name,b){const key='/'+name.replace(/^\//,'');assert(!fullManifest[key],'Unexpected managed namespace collision '+key);const target=path.join(fullDir,key);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,b);fullManifest[key]={hash:assetHash(b,key),size:b.length};changed.push(key);}
 for(const f of manifest.files.filter(x=>!['robots_addition','llms_addition'].includes(x.kind))){const b=await fs.readFile('release-managed-sitemaps-20261013/'+f.path);assert.equal(sha(b),f.sha256);await add('_managed_sitemaps/'+f.path,b);}
 // Add only missing built shared resources. Existing asset bytes remain frozen.
 const references=new Set();
 for(const f of manifest.files.filter(x=>x.kind==='html')){const html=await fs.readFile('release-managed-sitemaps-20261013/'+f.path,'utf8');for(const m of html.matchAll(/(?:https:\/\/www\.pinnacleblooms\.org)?(\/pinnacle-pages-(?:assets|scripts|styles|fonts)\/[A-Za-z0-9_./-]+)/g))references.add(m[1]);}
 for(const key of references)if(!fullManifest[key])await add(key,await fs.readFile('dist'+key));
 const roots=await read(priv+'/public-roots-before.json'),config={roots:{},html:{},publicAssets:changed.filter(p=>!p.startsWith('/_managed_sitemaps/'))};
 for(const host of hosts)for(const kind of ['robots','llms']){
  const suffix='/'+kind+'.txt',row=roots.find(r=>r.host===host&&r.path===suffix),fallback=roots.find(r=>r.host==='www.pinnacleblooms.org'&&r.path===suffix);
  const valid=row?.status===200&&row.type?.includes('text/plain');
  const baseText=valid?row.body:host==='pinnacleblooms.org'?fallback.body:kind==='robots'?'User-agent: *\nAllow: /\n':'# Pinnacle Blooms Network\n\nPublic resources and their original sources.\n';
  const addition=await fs.readFile('release-managed-sitemaps-20261013/'+host+'/'+kind+'-addition.txt','utf8');config.roots[host+suffix]={base:baseText,addition};
 }
 const policyResponse=await fetch('https://www.pinnacleblooms.org/policies',{signal:AbortSignal.timeout(20000)});assert(policyResponse.ok);await policyResponse.body.cancel();
 const policy=policyResponse.headers.get('Content-Security-Policy');assert(policy,'Current policy CSP required');
 const traverse=(n,fn)=>{fn(n);for(const c of n.childNodes||[])traverse(c,fn);};
 for(const f of manifest.files.filter(x=>x.kind==='html')){
  const html=await fs.readFile('release-managed-sitemaps-20261013/'+f.path,'utf8'),hashes=[];
  traverse(parse(html),n=>{if(n.tagName==='script'&&!n.attrs.some(a=>a.name==='src'))hashes.push("'sha256-"+createHash('sha256').update((n.childNodes||[]).map(c=>c.value||'').join('')).digest('base64')+"'");});
  let csp=policy.replace(/\s+'sha256-[^']+'/g,'');
  csp=csp.replace(/script-src ([^;]*)/,(_,v)=>'script-src '+v+' https://www.pinnacleblooms.org '+hashes.join(' '));
  for(const k of ['style-src','img-src','font-src','connect-src'])csp=csp.replace(new RegExp(k+' ([^;]*)'),(_,v)=>k+' '+v+' https://www.pinnacleblooms.org');
  config.html[f.path]={csp};
 }
 await save(priv+'/runtime-config.json',config);await save(priv+'/manifest.json',fullManifest);
 await build({entryPoints:['deployment/managed-sitemap-runtime.mjs'],outfile:priv+'/managed-sitemap-runtime.mjs',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,charset:'utf8'});
 const runtime=await fs.readFile(priv+'/managed-sitemap-runtime.mjs');
 const entry="import original from './"+original.entry+"';export * from './"+original.entry+"';import{withManagedSitemaps}from'./managed-sitemap-runtime.mjs';import config from './managed-sitemap-config.mjs';export default withManagedSitemaps(original,config);\n";
 const candidate=structuredClone(original);candidate.entry='managed-sitemap-entry.mjs';
 for(const [name,b]of [['managed-sitemap-entry.mjs',Buffer.from(entry)],['managed-sitemap-runtime.mjs',runtime],['managed-sitemap-config.mjs',Buffer.from('export default '+JSON.stringify(config)+';\n')]]){assert(!candidate.items.some(x=>x.name===name));candidate.items.push({name,type:'application/javascript+module',base64:b.toString('base64')});}
 await save(priv+'/candidate.json',candidate);
 const patterns=[...manifest.files.filter(f=>['index','pages','images','videos','news'].includes(f.kind)).map(f=>f.host+new URL(f.public_url).pathname),...hosts.flatMap(host=>['/site-map','/site-map/*','/robots.txt','/llms.txt'].map(p=>host+p))];
 const additions=patterns.filter(p=>!before.routes.some(r=>r.pattern===p));
 for(const p of patterns){const r=before.routes.find(r=>r.pattern===p);if(r)assert.equal(r.script,'pinnacle-verify-route','Existing exact route owner '+p);}
 const record=await read(out+'/release.json');Object.assign(record,{phase:'prepared',baseAssets:Object.keys(assetManifest).length,totalAssets:Object.keys(fullManifest).length,newAssetPaths:changed,managedPublicFiles:215,discoveryFragments:10,releaseId:manifest.release_id,plannedRouteAdditions:additions,originalModuleHashes:Object.fromEntries(original.items.map(x=>[x.name,sha(Buffer.from(x.base64,'base64'))])),candidateModuleHashes:Object.fromEntries(candidate.items.map(x=>[x.name,sha(Buffer.from(x.base64,'base64'))])),baseAssetSource:sourceDir,fullUnion:fullDir});await save(out+'/release.json',record);
 console.log(JSON.stringify({phase:record.phase,baseAssets:record.baseAssets,totalAssets:record.totalAssets,newAssets:changed.length,managedFiles:215,routeAdditions:additions.length,originalModules:original.items.length,addedModules:3,release:manifest.release_id}));
}
async function planRoutes(){
 const rec=await read(out+'/release.json');assert.equal(rec.phase,'prepared');assert(!rec.candidateVersion);
 const before=await read(priv+'/before.json'),manifest=await read('release-managed-sitemaps-20261013/manifest.json');
 const patterns=[...manifest.files.filter(f=>['index','pages','images','videos','news'].includes(f.kind)).map(f=>f.host+new URL(f.public_url).pathname),...hosts.flatMap(host=>['/site-map','/site-map/*','/robots.txt','/llms.txt'].map(p=>host+p))];
 for(const p of patterns){const r=before.routes.find(r=>r.pattern===p);if(r)assert.equal(r.script,'pinnacle-verify-route');}
 rec.plannedRouteAdditions=patterns.filter(p=>!before.routes.some(r=>r.pattern===p));await save(out+'/release.json',rec);
 console.log(JSON.stringify({exactXmlRoutes:44,newRoutes:rec.plannedRouteAdditions.length,existingRoutesPreserved:before.routes.length}));
}
async function source(){
 const rec=await read(out+'/release.json');assert.equal(rec.phase,'prepared');const commit=g(['rev-parse','HEAD']),branch=g(['branch','--show-current']);
 assert.equal(g(['ls-remote','origin','refs/heads/'+branch]).split(/\s/)[0],commit);
 const existing=await gh('/pulls?state=open&head=drkotireddysaripalli:'+branch);
 const pr=existing[0]||await gh('/pulls','POST',{head:branch,base:'main',title:'Publish managed sitemaps and shared navigation across five hosts',body:'Integrate the reviewed PR58 catalogue baseline into the existing portal. Publish 44 flat XML files and 171 navigation/text files for 71,047 eligible URLs across five exact hosts. The ten discovery fragments are composed into roots, not published as separate files. Render human navigation with the approved shared header/footer and Anek typography. Preserve the entire live asset and Worker-module union, every existing route and protected flow; add narrowly scoped discovery routes only.\n\nExact-source Portal quality and TestingBot BVT gate the release. Local source/adapter tests and rendered mobile/desktop navigation checks accompany full public 200/MIME/hash readback. Private catalogue loading, expanded media coverage and search-engine processing remain separate and are not claimed complete.'});
 rec.source=commit;rec.branch=branch;rec.pr={number:pr.number,url:pr.html_url};await save(out+'/release.json',rec);console.log(JSON.stringify({source:commit,pr:rec.pr}));
}
async function ci(){
 const rec=await read(out+'/release.json');assert.equal(g(['rev-parse','HEAD']),rec.source);
 const deadline=Date.now()+25*60*1000;let last;
 while(Date.now()<deadline){const result=await gh('/actions/runs?head_sha='+rec.source+'&per_page=30'),runs=result.workflow_runs.filter(r=>['Portal quality','Sitemap manager contracts'].includes(r.name)&&(r.name==='Sitemap manager contracts'||r.event!=='pull_request'));
  const latest=[...new Map(runs.map(r=>[r.name,r])).values()];const summary=latest.map(r=>({id:r.id,name:r.name,status:r.status,conclusion:r.conclusion,source:r.head_sha,url:r.html_url}));await save(out+'/ci.json',{source:rec.source,at:new Date().toISOString(),runs:summary});
  const mark=JSON.stringify(summary.map(r=>[r.name,r.status,r.conclusion]));if(mark!==last){console.log(mark);last=mark;}
  if(latest.length>=2&&latest.every(r=>r.status==='completed')){assert(latest.every(r=>r.conclusion==='success'),'Exact-source CI failed; inspect retained run IDs');return;}
  await new Promise(r=>setTimeout(r,15000));
 }throw Error('CI checkpoint saved; workflow not complete');
}
async function assertUnchanged(rec){const before=await read(priv+'/before.json'),now=await state();assert.deepEqual(now.routes,before.routes);for(const n of names)assert.deepEqual(now.workers[n].versions,before.workers[n].versions,n+' changed during preparation');assert.equal(g(['rev-parse','HEAD']),rec.source);return before;}
async function upload(){
 const rec=await read(out+'/release.json');assert(!rec.pending,'Reconcile uncertain operation before retrying');assert(!rec.candidateVersion,'Version already uploaded');
 const ci=await read(out+'/ci.json');assert.equal(ci.source,rec.source);assert(ci.runs.length>=2&&ci.runs.every(r=>r.status==='completed'&&r.conclusion==='success'));
 const before=await assertUnchanged(rec),manifest=await read(priv+'/manifest.json'),original=await read(priv+'/candidate.json');
 async function mutate(kind,fn){rec.pending={kind,at:new Date().toISOString()};await save(out+'/release.json',rec);const result=await fn();rec.pending=null;await save(out+'/release.json',rec);return result;}
 const session=await mutate('assets-upload-session',()=>api(base+'pinnacle-verify-route/assets-upload-session','POST',{manifest}));await save(priv+'/upload-session.json',session);
 const lookup=new Map(Object.entries(manifest).map(([key,m])=>[m.hash,key]));let jwt=session.jwt,uploaded=0;
 const single=JSON.parse(Buffer.from(session.jwt.split('.')[1],'base64url')).wrangler_single_asset_uploads;
 assert(!single,'Provider uses a different upload contract; checkpoint retained');
 for(const [i,bucket] of session.buckets.entries()){
  const form=new FormData();for(const hash of bucket){const key=lookup.get(hash);assert(key);const bytes=await fs.readFile(path.join(rec.fullUnion,key));const mime=(await import('mime')).default.getType(key)||'application/octet-stream';form.set(hash,new Blob([bytes.toString('base64')],{type:mime}),hash);}
  const result=await mutate('assets-bucket-'+i,()=>api('/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/assets/upload?base64=true','POST',form,session.jwt));jwt=result.jwt||jwt;uploaded+=bucket.length;console.log('Uploaded required assets '+uploaded);
 }await save(priv+'/assets.json',{jwt,uploaded});
 const s=before.workers['pinnacle-verify-route'].settings;
 const metadata={main_module:original.entry,assets:{jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}},compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(b=>b.type==='assets'?{name:b.name,type:'assets'}:{name:b.name,type:'inherit'}),annotations:{'workers/message':id}};
 for(const key of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[key]!==undefined)metadata[key]=s[key];
 const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const m of original.items)form.set(m.name,new Blob([Buffer.from(m.base64,'base64')],{type:m.type||'application/javascript+module'}),m.name);
 const v=await mutate('upload-worker-version',()=>api(base+'pinnacle-verify-route/versions?bindings_inherit=strict','POST',form));
 rec.candidateVersion=v.id;rec.uploadedAssets=uploaded;rec.phase='uploaded';await save(out+'/release.json',rec);console.log(JSON.stringify({phase:rec.phase,version:v.id,uploadedAssets:uploaded}));
}
async function deploy(){
 const rec=await read(out+'/release.json');assert(!rec.pending);assert(rec.candidateVersion);assert(!rec.deployment);await assertUnchanged(rec);
 async function mutate(kind,fn){rec.pending={kind,at:new Date().toISOString()};await save(out+'/release.json',rec);const result=await fn();rec.pending=null;await save(out+'/release.json',rec);return result;}
 const pr=await gh('/pulls/'+rec.pr.number);assert.equal(pr.head.sha,rec.source);
 rec.merge=pr.merged?{merged:true,sha:pr.merge_commit_sha}:await mutate('merge-source',()=>gh('/pulls/'+rec.pr.number+'/merge','PUT',{sha:rec.source,merge_method:'merge'}));assert(rec.merge.merged);await save(out+'/release.json',rec);
 const promoted=await mutate('promote-worker',()=>api(base+'pinnacle-verify-route/deployments','POST',{strategy:'percentage',versions:[{version_id:rec.candidateVersion,percentage:100}]}));rec.deployment=promoted.id;await save(out+'/release.json',rec);
 for(const pattern of rec.plannedRouteAdditions){const r=await mutate('route:'+pattern,()=>api(zone+'/workers/routes','POST',{pattern,script:'pinnacle-verify-route'}));rec.routeAdditions.push({id:r.id,pattern:r.pattern,script:r.script});await save(out+'/release.json',rec);}
 rec.phase='deployed-awaiting-public-verification';rec.deployed=true;await save(out+'/release.json',rec);console.log(JSON.stringify({phase:rec.phase,version:rec.candidateVersion,deployment:rec.deployment,routesAdded:rec.routeAdditions.length}));
}
async function verify(){
 const rec=await read(out+'/release.json'),before=await read(priv+'/before.json'),after=await state();assert(rec.deployment);assert(!rec.pending);
 for(const route of before.routes)assert.deepEqual(after.routes.find(r=>r.id===route.id),route);
 assert.equal(after.routes.length,before.routes.length+rec.routeAdditions.length);
 for(const route of rec.routeAdditions)assert.deepEqual(after.routes.find(r=>r.id===route.id),route);
 for(const n of names)assert.deepEqual(after.workers[n].versions,n==='pinnacle-verify-route'?[{version_id:rec.candidateVersion,percentage:100}]:before.workers[n].versions,n+' deployment changed');
 for(const n of names){const clean=s=>{const c=structuredClone(s);delete c.annotations;c.bindings.sort((a,b)=>a.name.localeCompare(b.name));return c;};assert.deepEqual(clean(after.workers[n].settings),clean(before.workers[n].settings),n+' config changed');}
 const actual=await modules('pinnacle-verify-route');assert.deepEqual(Object.fromEntries(actual.items.map(m=>[m.name,sha(Buffer.from(m.base64,'base64'))])),rec.candidateModuleHashes);
 const manifest=await read('release-managed-sitemaps-20261013/manifest.json'),queue=manifest.files.filter(f=>!['robots_addition','llms_addition'].includes(f.kind)),checks=[];
 let cursor=0;await Promise.all(Array.from({length:4},async()=>{while(cursor<queue.length){const f=queue[cursor++];try{const r=await fetch(f.public_url,{redirect:'manual',signal:AbortSignal.timeout(30000),headers:{'Accept-Encoding':'identity'}}),bytes=Buffer.from(await r.arrayBuffer()),type=r.headers.get('Content-Type');checks.push({url:f.public_url,status:r.status,type,bytes:bytes.length,sha256:sha(bytes),expected:f.sha256,passed:r.status===200&&sha(bytes)===f.sha256&&(f.kind==='html'?type?.includes('text/html'):['pages','videos','images','index','news'].includes(f.kind)?type?.includes('xml'):type?.includes('text/plain'))});}catch(e){checks.push({url:f.public_url,passed:false,error:e.message});}}}));
 await save(out+'/public-readback.json',{at:new Date().toISOString(),releaseId:manifest.release_id,checks,passed:checks.filter(c=>c.passed).length,failed:checks.filter(c=>!c.passed).length});
 assert(checks.every(c=>c.passed),'Public serving mismatch; use saved failures, no submission');rec.phase='public-files-verified';rec.verifiedAt=new Date().toISOString();rec.publicFilesVerified=checks.length;rec.configurationPreserved=true;await save(out+'/release.json',rec);console.log(JSON.stringify({phase:rec.phase,files:checks.length,version:rec.candidateVersion,deployment:rec.deployment}));
}
if(process.argv[1]?.endsWith('release-managed-sitemaps.mjs')){
 const phase=process.argv[2];if(phase==='capture')await capture();else if(phase==='prepare')await prepare();else if(phase==='plan-routes')await planRoutes();else if(phase==='source')await source();else if(phase==='ci')await ci();else if(phase==='upload')await upload();else if(phase==='deploy')await deploy();else if(phase==='verify')await verify();else throw Error('Unknown phase '+phase);
}
