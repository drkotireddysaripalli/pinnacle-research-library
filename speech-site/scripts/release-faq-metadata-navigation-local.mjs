// Checkpointed, exact-source release. Credentials stay in local secure stores.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {build} from 'esbuild';
const phase=process.argv[2],id='faq-metadata-navigation-20261012',priv='ask-private/'+id,out='outputs/'+id,file=out+'/release.json';
const targets=['pinnacle-ask','pinnacle-verify-route','pinnacle-legacy-social-metadata'],names=[...targets,'pbn-planetscale','pinnacle-root-sitemap','pinnacle-helpline','pinnacle-ask-mcp','pinnacle-centre-search-repair','pinnacle-google-ads-call-measurement'];
const account='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/',zone='/zones/8b13f18e0589996b5d6512552372b434';
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=a=>execFileSync(git,a,{encoding:'utf8',windowsHide:true}).trim(),source=g(['rev-parse','HEAD']),sha=b=>createHash('sha256').update(b).digest('hex');
await fs.mkdir(priv,{recursive:true});await fs.mkdir(out,{recursive:true});
const save=(p,j)=>fs.writeFile(p,JSON.stringify(j,null,2)+'\n'),read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Existing Cloudflare login unavailable');
async function api(p,method='GET',body){const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body===undefined?undefined:form?body:JSON.stringify(body),signal:AbortSignal.timeout(60000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;}
async function mods(n){const r=await fetch('https://api.cloudflare.com/client/v4'+account+n+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(60000)});assert(r.ok,'Worker source read failed '+n);const items=[];for(const[k,v]of await r.formData())if(typeof v!=='string')items.push({name:v.name||k,type:v.type,base64:Buffer.from(await v.arrayBuffer()).toString('base64')});return{entry:r.headers.get('cf-entrypoint'),items};}
async function state(){const[r,w]=await Promise.all([api(zone+'/workers/routes'),Promise.all(names.map(async n=>{const[d,s]=await Promise.all([api(account+n+'/deployments'),api(account+n+'/settings')]);return[n,{versions:d.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions,settings:s}]}))]);return{routes:r,workers:Object.fromEntries(w)};}
const hashes=m=>Object.fromEntries(m.items.map(x=>[x.name,sha(Buffer.from(x.base64,'base64'))]));
const routes=r=>r.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern));
const settings=s=>{const c=structuredClone(s);delete c.annotations;c.bindings.sort((a,b)=>a.name.localeCompare(b.name));return c;};
function ghHeaders(){const raw=execFileSync(git,['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true,stdio:['pipe','pipe','pipe'],env:{...process.env,GCM_INTERACTIVE:'Never',GIT_TERMINAL_PROMPT:'0'}}),c=Object.fromEntries(raw.trim().split('\n').map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)]}));return{authorization:'Basic '+Buffer.from(c.username+':'+c.password).toString('base64'),'User-Agent':'Pinnacle-FAQ-release','Content-Type':'application/json'};}
const ghBase='https://api.github.com/repos/drkotireddysaripalli/pinnacle-research-library',branch='codex/faq-metadata-navigation-20261012';
if(phase==='prepare'){
 assert(!(await fs.stat(file).catch(()=>null)),'Reconcile existing release instead of preparing twice');
 const before=await state();await save(priv+'/before.json',before);
 const previous=await read('outputs/shared-titles-receiver-20261012/release.json');
 for(const n of ['pinnacle-ask','pinnacle-verify-route'])assert.deepEqual(before.workers[n].versions,[{version_id:previous.workers[n].candidate,percentage:100}],'Production drift '+n);
 const compiled=(await build({entryPoints:['deployment/canonical-navigation-aliases.mjs'],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022',minify:true})).outputFiles[0].contents;
 const helper=(await build({entryPoints:['src/lib/knowledge/metadata.mjs'],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022',minify:true})).outputFiles[0].contents;
 const workers={};
 for(const n of targets){const original=await mods(n),candidate=structuredClone(original);await save(priv+'/'+n+'-before.json',original);let changed=[];
  if(n==='pinnacle-ask'){
   const found=candidate.items.filter(m=>Buffer.from(m.base64,'base64').toString().includes('answer ? answer.metaTitle :'));assert.equal(found.length,1);
   const m=found[0],s=Buffer.from(m.base64,'base64').toString(),a='const canonical = answer ? answer.url : pageURL(base, Math.max(1, page), q);',d='const description = answer?.description ||';
   assert.equal(s.split(a).length,2);assert.equal(s.split(d).length,2);
   const updated="import {faqMetadataMap} from './faq-metadata-20261012.mjs';\n"+s.replace(a,'const metadata = answer ? faqMetadataMap(index).get(answer.url) : null;\n'+a).replace('answer ? answer.metaTitle :','answer ? metadata.title :').replace(d,'const description = metadata?.description ||');
   m.base64=Buffer.from(updated).toString('base64');changed.push(m.name);candidate.items.push({name:'chunks/faq-metadata-20261012.mjs',type:'application/javascript+module',base64:Buffer.from(helper).toString('base64')});
  }
  assert(!candidate.items.some(x=>x.name==='canonical-navigation-20261012.mjs'||x.name==='faq-navigation-entry.mjs'));
  candidate.items.push({name:'canonical-navigation-20261012.mjs',type:'application/javascript+module',base64:Buffer.from(compiled).toString('base64')});
  candidate.entry='faq-navigation-entry.mjs';
  const wrapper="import original from './"+original.entry+"';import {repairCanonicalNavigation} from './canonical-navigation-20261012.mjs';export * from './"+original.entry+"';export default {...original,async fetch(request,env,ctx){return repairCanonicalNavigation(request,await original.fetch(request,env,ctx))}};";
  candidate.items.push({name:candidate.entry,type:'application/javascript+module',base64:Buffer.from(wrapper).toString('base64')});
  await save(priv+'/'+n+'-candidate.json',candidate);workers[n]={rollback:before.workers[n].versions,entry:candidate.entry,originalModuleHashes:hashes(original),moduleHashes:hashes(candidate),changedModules:changed,addedModules:candidate.items.filter(x=>!original.items.some(o=>o.name===x.name)).map(x=>x.name)};
 }
 await save(file,{id,source,phase:'prepared',workers,routes:before.routes.length,pending:null});console.log(JSON.stringify({phase:'prepared',source,routes:before.routes.length,targets}));
}else if(phase==='draft'||phase==='watch'){
 const headers=ghHeaders(),rec=await read(file);assert.equal(source,rec.source);
 if(phase==='draft'){
  const list=await(await fetch(ghBase+'/pulls?state=open&head=drkotireddysaripalli:'+branch,{headers})).json();let pr=list[0];
  if(!pr){const r=await fetch(ghBase+'/pulls',{method:'POST',headers,body:JSON.stringify({head:branch,base:'main',title:'Repair shared FAQ metadata and legacy navigation aliases',body:'FAQ answer pages use imported long metadata directly, leaving 2,010 reported long-title URLs after the Ask/Mirracles repair. Generate source-based native titles and descriptions across all 4,564 FAQs, with a concise Pinnacle identity and national contact; resolve collisions using actual question/topic distinctions. Retain complete questions, answers, URLs, alternates, reader identity and Anek.\n\nEmit the final live destinations for only /about, /all-resources and /assesments across public templates. Keep redirects alive and preserve source parameters/fragments, forms, calls, payments, private responses and existing routes/assets/bindings.\n\nValidation: complete metadata corpus and immutable-source checks; real Worker transform fixtures; existing catalogue/language/alias regressions; exact-source Portal quality and TestingBot BVT before deployment. Vendor recrawl clearance and real business outcomes remain separate.'})});pr=await r.json();assert(r.ok,pr.message);}
  await save(out+'/pr.json',{number:pr.number,url:pr.html_url,source});console.log(JSON.stringify({pr:pr.html_url,source}));
 }
 if(phase==='watch'){for(let i=0;i<90;i++){const r=await fetch(ghBase+'/actions/runs?branch='+encodeURIComponent(branch)+'&per_page=8',{headers});assert(r.ok);const run=(await r.json()).workflow_runs.find(x=>x.head_sha===source&&x.event==='push'&&x.name==='Portal quality');if(run){const ci={id:run.id,source,status:run.status,conclusion:run.conclusion,url:run.html_url,at:new Date().toISOString()};await save(out+'/ci.json',ci);if(run.status==='completed'){console.log(JSON.stringify(ci));assert.equal(run.conclusion,'success');break;}}if(i===89)throw Error('CI checkpoint retained, not complete');await new Promise(r=>setTimeout(r,15000));}}
}else{
 const before=await read(priv+'/before.json'),rec=await read(file);assert.equal(source,rec.source);assert(!rec.pending,'Reconcile pending external outcome');
 async function mutate(kind,fn){rec.pending={kind,at:new Date().toISOString()};await save(file,rec);const x=await fn();rec.pending=null;await save(file,rec);return x;}
 if(phase==='deliver'){
  const ci=await read(out+'/ci.json');assert.equal(ci.source,source);assert.equal(ci.status,'completed');assert.equal(ci.conclusion,'success');rec.ci=ci;
  const current=await state();assert.deepEqual(routes(current.routes),routes(before.routes));for(const n of names){assert.deepEqual(current.workers[n].versions,rec.workers[n]?.deployment?[{version_id:rec.workers[n].candidate,percentage:100}]:before.workers[n].versions);assert.deepEqual(settings(current.workers[n].settings),settings(before.workers[n].settings));}
  const headers=ghHeaders(),pr=await read(out+'/pr.json'),url=ghBase+'/pulls/'+pr.number,p=await(await fetch(url,{headers})).json();assert.equal(p.head.sha,source);
  if(!rec.merge){assert(p.mergeable&&p.state==='open');const r=await fetch(url+'/merge',{method:'PUT',headers,body:JSON.stringify({sha:source,merge_method:'merge',commit_title:'Repair shared FAQ metadata and direct legacy navigation'})}),j=await r.json();assert(r.ok&&j.merged,j.message);rec.merge=j;await save(file,rec);}else assert(p.merged&&p.merge_commit_sha===rec.merge.sha);
  for(const n of targets){if(rec.workers[n].candidate)continue;const c=await read(priv+'/'+n+'-candidate.json'),s=before.workers[n].settings,meta={main_module:c.entry,keep_assets:true,compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(b=>({name:b.name,type:'inherit'})),annotations:{'workers/message':id}};
   for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)meta[k]=s[k];const form=new FormData();form.set('metadata',JSON.stringify(meta));for(const m of c.items)form.set(m.name,new Blob([Buffer.from(m.base64,'base64')],{type:m.type||'application/javascript+module'}),m.name);
   const x=await mutate('upload:'+n,()=>api(account+n+'/versions?bindings_inherit=strict','POST',form));rec.workers[n].candidate=x.id;await save(file,rec);console.log('Uploaded '+n);
  }
  for(const n of targets){if(rec.workers[n].deployment)continue;const x=await mutate('promote:'+n,()=>api(account+n+'/deployments','POST',{strategy:'percentage',versions:[{version_id:rec.workers[n].candidate,percentage:100}]}));rec.workers[n].deployment=x.id;await save(file,rec);console.log('Promoted '+n);}
  rec.phase='promoted';await save(file,rec);
 }
 if(phase==='verify'||rec.phase==='promoted'){
  const current=await state();assert.deepEqual(routes(current.routes),routes(before.routes));
  for(const n of names){assert.deepEqual(settings(current.workers[n].settings),settings(before.workers[n].settings));if(targets.includes(n)){assert.deepEqual(current.workers[n].versions,[{version_id:rec.workers[n].candidate,percentage:100}]);assert.deepEqual(hashes(await mods(n)),rec.workers[n].moduleHashes);}else assert.deepEqual(current.workers[n].versions,before.workers[n].versions);}
  rec.phase='verified-modules-and-configuration';rec.verifiedAt=new Date().toISOString();await save(file,rec);console.log(JSON.stringify({phase:rec.phase,source,routesPreserved:current.routes.length,versions:Object.fromEntries(targets.map(n=>[n,rec.workers[n].candidate]))}));
 }
}

