// Narrow page release: capture current modules; preserve every route, binding,
// protected service and baseline asset. Never rebuild a historic Worker.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {createRequire} from 'node:module';import {execFileSync} from 'node:child_process';
import {api,state,modules,save,read,sha,base,names} from './release-managed-sitemaps.mjs';
import {publisherGit} from './publisher-platform.mjs';
const id='centre-directory-20261015',priv='ask-private/'+id,out='reviews/centres-20261015',phase=process.argv[2];
const baselineRoot=path.resolve('../../managed-media-refresh-20261013/speech-site');
const baseline=await read(baselineRoot+'/outputs/ga4-handoff-receiver-20261015/release.json');
const receipt=out+'/release.json';
const assetHash=(b,n)=>createRequire(import.meta.url)('blake3-wasm').hash(b.toString('base64')+path.extname(n).slice(1)).toString('hex').slice(0,32);
const git=args=>execFileSync(publisherGit,args,{encoding:'utf8',windowsHide:true}).trim();
function preservedSettings(actual,expected){const a=structuredClone(actual),b=structuredClone(expected);assert([b.annotations?.['workers/message'],id].includes(a.annotations?.['workers/message']),'Unexpected release annotation');if(a.annotations&&b.annotations)a.annotations['workers/message']=b.annotations['workers/message'];assert.deepEqual(a,b,'Worker settings changed');}
async function unchanged(){const before=await read(priv+'/before.json'),now=await state();assert.deepEqual(now.routes,before.routes,'Routes changed');for(const n of names){assert.deepEqual(now.workers[n].versions,before.workers[n].versions,'Live version changed: '+n);if(n===names[0])preservedSettings(now.workers[n].settings,before.workers[n].settings);else assert.deepEqual(now.workers[n],before.workers[n],'Protected worker changed: '+n);}return before;}
await fs.mkdir(out,{recursive:true});
if(phase==='prepare'){
 const before=await unchanged();assert.equal(before.workers[names[0]].versions[0].version_id,baseline.candidateVersion);
 assert.equal((await read(out+'/validation.json')).passed,true);
 const original=await read(priv+'/original.json'),manifest=await read(baselineRoot+'/ask-private/ga4-handoff-receiver-20261015/manifest.json');
 const union=path.resolve(priv,'full-union');assert(!(await fs.stat(receipt).catch(()=>null)),'Preparation already complete; resume upload');await fs.cp(baseline.fullUnion,union,{recursive:true,force:true});
 const html=await fs.readFile('dist/centers.html','utf8'),keys=new Set(['/pinnacle-pages-html/centers.html',...['centers-evidence.json','centers-evidence.txt','centers-machine.md','centres-sitemap.xml'].map(x=>'/pinnacle-pages-data/'+x),...[...html.matchAll(/\/pinnacle-pages-assets\/[A-Za-z0-9_./-]+/g)].map(m=>m[0])]);
 const changed=[],hashes={},baseCount=Object.keys(manifest).length;
 for(const key of keys){const b=await fs.readFile(key.endsWith('/centers.html')?'dist/centers.html':'dist'+key),h=assetHash(b,key);if(manifest[key]?.hash===h)continue;
  if(key.startsWith('/pinnacle-pages-assets/'))assert(!manifest[key],'Immutable asset collision: '+key);
  const dest=path.join(union,key);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,b);manifest[key]={hash:h,size:b.length};changed.push(key);hashes[key]=sha(b).slice(0,16);
 }
 const main=original.items.find(x=>x.name==='pinnacle-route-v12.mjs');let code=Buffer.from(main.base64,'base64').toString();const m=code.match(/const SPEECH_INVENTORY=(\{[^\n]+\});/);assert(m,'Missing asset inventory');const inventory=JSON.parse(m[1]);Object.assign(inventory,hashes);code=code.replace(m[0],'const SPEECH_INVENTORY='+JSON.stringify(inventory)+';');main.base64=Buffer.from(code).toString('base64');
 await save(priv+'/manifest.json',manifest);await save(priv+'/candidate.json',original);
 await save(receipt,{id,phase:'prepared',at:new Date().toISOString(),rollbackVersion:baseline.candidateVersion,fullUnion:union,baselineReceipt:baselineRoot+'/outputs/ga4-handoff-receiver-20261015/release.json',baselineManifest:baselineRoot+'/ask-private/ga4-handoff-receiver-20261015/manifest.json',baseAssets:baseCount,totalAssets:Object.keys(manifest).length,changedAssets:changed,modifiedModules:['pinnacle-route-v12.mjs'],routes:before.routes.length});
 console.log(JSON.stringify({phase:'prepared',changedAssets:changed.length,totalAssets:Object.keys(manifest).length}));
}else if(phase==='upload'){
 const rec=await read(receipt);assert.equal(rec.phase,'prepared');const before=await unchanged();const candidate=await read(priv+'/candidate.json'),manifest=await read(priv+'/manifest.json');
 const session=await api(base+names[0]+'/assets-upload-session','POST',{manifest});const lookup=new Map(Object.entries(manifest).map(([p,m])=>[m.hash,p]));let jwt=session.jwt,uploaded=0;
 for(const bucket of session.buckets){const form=new FormData();for(const h of bucket){const p=lookup.get(h);assert(p);const b=await fs.readFile(path.join(rec.fullUnion,p));assert.equal(assetHash(b,p),h);form.set(h,new Blob([b.toString('base64')],{type:(await import('mime')).default.getType(p)||'application/octet-stream'}),h);}const r=await api('/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/assets/upload?base64=true','POST',form,session.jwt);jwt=r.jwt||jwt;uploaded+=bucket.length;}
 const s=before.workers[names[0]].settings,metadata={main_module:candidate.entry,assets:{jwt,config:{html_handling:'none',not_found_handling:'none',run_worker_first:true}},compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(x=>x.type==='assets'?{name:x.name,type:'assets'}:{name:x.name,type:'inherit'}),annotations:{'workers/message':id}};
 for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)metadata[k]=s[k];const f=new FormData();f.set('metadata',JSON.stringify(metadata));for(const m of candidate.items)f.set(m.name,new Blob([Buffer.from(m.base64,'base64')],{type:m.type}),m.name);
 const v=await api(base+names[0]+'/versions?bindings_inherit=strict','POST',f);Object.assign(rec,{phase:'uploaded',candidateVersion:v.id,uploadedAssets:uploaded,source:git(['rev-parse','HEAD'])});await save(receipt,rec);console.log(JSON.stringify({phase:rec.phase,version:v.id,uploaded}));
}else if(phase==='deploy'){
 const rec=await read(receipt);assert.equal(rec.phase,'uploaded');await unchanged();assert.equal(git(['rev-parse','HEAD']),rec.source);const d=await api(base+names[0]+'/deployments','POST',{strategy:'percentage',versions:[{version_id:rec.candidateVersion,percentage:100}]});Object.assign(rec,{phase:'deployed-awaiting-verification',deployment:d.id,cutoverUTC:new Date().toISOString()});await save(receipt,rec);console.log(JSON.stringify({version:rec.candidateVersion,deployment:d.id}));
}else if(phase==='verify'){
 const rec=await read(receipt),before=await read(priv+'/before.json'),now=await state();assert.deepEqual(now.routes,before.routes);preservedSettings(now.workers[names[0]].settings,before.workers[names[0]].settings);assert.deepEqual(now.workers[names[0]].versions,[{version_id:rec.candidateVersion,percentage:100}]);for(const n of names.slice(1))assert.deepEqual(now.workers[n],before.workers[n]);
 const actual=await modules(names[0]),expected=await read(priv+'/candidate.json');assert.equal(actual.entry,expected.entry);for(const m of expected.items)assert.equal(actual.items.find(x=>x.name===m.name)?.base64,m.base64,'Module readback '+m.name);
 const checks=[];for(const p of ['/centers','/pinnacle-pages-data/centers-evidence.json','/pinnacle-pages-data/centers-evidence.txt','/pinnacle-pages-data/centers-machine.md','/pinnacle-pages-data/centres-sitemap.xml']){const r=await fetch('https://www.pinnacleblooms.org'+p,{signal:AbortSignal.timeout(30000)}),b=await r.text();assert.equal(r.status,200,p);if(p==='/centers'){assert(b.includes('Begin with your child’s life.')&&b.includes('centres-life-path-20261015'));assert(!b.includes('noindex'));}else assert.equal(sha(b),sha(await fs.readFile(path.join(rec.fullUnion,p))),p);checks.push({path:p,status:r.status,type:r.headers.get('content-type'),sha256:sha(b)});}
 const md=await fetch('https://www.pinnacleblooms.org/centers',{headers:{Accept:'text/markdown'}});assert.equal(md.status,200);assert((await md.text()).includes('A centre visit starts the work'));assert(md.headers.get('content-type').includes('text/markdown'));
 Object.assign(rec,{phase:'verified_complete',verifiedAt:new Date().toISOString(),routesPreserved:now.routes.length,bindingsPreserved:true,protectedWorkersUnchanged:names.slice(1),publicChecks:checks,markdownNegotiation:true});await save(receipt,rec);console.log(JSON.stringify({phase:rec.phase,version:rec.candidateVersion,routes:now.routes.length,checks:checks.length}));
}else throw Error('Use prepare/upload/deploy/verify');
