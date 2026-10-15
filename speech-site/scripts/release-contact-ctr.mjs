// Bounded follow-up to the accepted 15 October union. Keep all managed
// publication bytes and protected Workers; change one wrapper and five assets.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {api,state,modules,gh,read,save,sha,base} from './release-managed-sitemaps.mjs';
import {publisherGit} from './publisher-platform.mjs';

const followup=process.argv.includes('--dependency-followup');
const id=followup?'contact-dependency-20261015':'contact-ctr-20261015',priv='ask-private/'+id,out='outputs/'+id,phase=process.argv[2];
const baseline=path.resolve(followup?'outputs/contact-ctr-20261015/release.json':'../../reassess-page-20261015/speech-site/outputs/reassess-page-20261015/release.json');
const baselineManifest=path.resolve(followup?'ask-private/contact-ctr-20261015/manifest.json':'../../reassess-page-20261015/speech-site/ask-private/reassess-page-20261015/manifest.json');
const nativeVersion='97c61ed1-6ba0-4534-a175-5e26798ffa9f';
const g=args=>execFileSync(publisherGit,args,{encoding:'utf8',windowsHide:true}).trim();
const run=args=>execFileSync(process.execPath,['scripts/release-managed-refresh.mjs',...args,'--id',id],{stdio:'inherit',windowsHide:true});
const moduleHashes=m=>Object.fromEntries(m.items.map(m=>[m.name,sha(Buffer.from(m.base64,'base64'))]));
await fs.mkdir(priv,{recursive:true});await fs.mkdir(out,{recursive:true});

if(phase==='capture'){
 const old=await read(baseline);assert.equal(old.phase,'verified_complete');
 run(['capture','--baseline-receipt',baseline,'--baseline-manifest',baselineManifest,'--previous-release',old.selectedRelease]);
}else if(phase==='prepare'){
 const rec=await read(out+'/release.json'),old=await read(baseline),before=await read(priv+'/before.json');
 assert.equal(rec.phase,'captured');assert(!rec.pending);
 const current=await state();assert.deepEqual(current.routes,before.routes);
 for(const n of Object.keys(before.workers))assert.deepEqual(current.workers[n].versions,before.workers[n].versions,n);
 assert.equal(before.workers['pbn-planetscale'].versions[0].version_id,nativeVersion,'Preserve the accepted contact receiver');
 assert.equal(before.routes.length,402);assert.equal(before.workers['pinnacle-verify-route'].versions[0].version_id,old.candidateVersion);
 const original=await read(priv+'/original.json');assert.deepEqual(moduleHashes(original),old.candidateModuleHashes,'Latest upload must match the deployed union');
 assert.equal(g(['diff','--name-only','HEAD','--','deployment','public','scripts','src','../tooling']), '','Commit effective release inputs');
 const source=g(['rev-parse','HEAD']),branch=g(['branch','--show-current']);
 const compiled=await build({entryPoints:['deployment/shared-clearance.mjs'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,charset:'utf8',write:false});
 const candidate=structuredClone(original),runtime=candidate.items.find(m=>m.name==='shared-clearance-runtime.mjs');assert(runtime);
 runtime.base64=Buffer.from(compiled.outputFiles[0].contents).toString('base64');
 const changed=Object.keys(moduleHashes(candidate)).filter(n=>moduleHashes(candidate)[n]!==moduleHashes(original)[n]);assert.deepEqual(changed,['shared-clearance-runtime.mjs']);
 const manifest=await read(baselineManifest),fullUnion=path.resolve(priv,'full-union');
 assert(!(await fs.stat(fullUnion).catch(()=>null)),'Reconcile prior assembly before retrying');
 await fs.cp(old.fullUnion,fullUnion,{recursive:true,errorOnExist:true,force:false});
 const blake=createRequire(path.resolve('package.json'))('blake3-wasm');
 const assetHash=(b,n)=>blake.hash(b.toString('base64')+path.extname(n).slice(1)).toString('hex').slice(0,32);
 const paths=['contact-receipt.js','contact-api.mjs','contact-options.mjs','enrolment-api.mjs',...(followup?['enrolment-source.mjs']:[]),'speech-measurement.js'].map(n=>'/pinnacle-pages-scripts/'+n),assetChanges=[];
 for(const p of paths){const b=await fs.readFile('public'+p),target=path.join(fullUnion,p),previous=manifest[p];
  await fs.rm(target,{force:true});await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,b);
  manifest[p]={hash:assetHash(b,p),size:b.length};assetChanges.push({path:p,sha256:sha(b),bytes:b.length,change:previous?(previous.hash===manifest[p].hash?'unchanged':'updated'):'added'});
 }
 assert.equal(assetChanges.filter(x=>x.change==='added').length,followup?0:3);assert.equal(Object.keys(manifest).length,3964);
 if(followup)assert.deepEqual(assetChanges.filter(x=>x.change==='updated').map(x=>x.path),['/pinnacle-pages-scripts/contact-api.mjs','/pinnacle-pages-scripts/enrolment-source.mjs']);
 for(const [p,m] of Object.entries(manifest)){const b=await fs.readFile(path.join(fullUnion,p));assert.equal(b.length,m.size,p);assert.equal(assetHash(b,p),m.hash,p);}
 const selectedRelease=rec.previousRelease,published=await read(selectedRelease+'/manifest.json');assert.equal(published.release_id,old.releaseId);
 for(const f of published.files.filter(f=>!['robots_addition','llms_addition'].includes(f.kind)))assert.equal(sha(await fs.readFile(path.join(fullUnion,'/_managed_sitemaps/',f.path))),f.sha256,f.path);
 await save(priv+'/candidate.json',candidate);await save(priv+'/manifest.json',manifest);
 Object.assign(rec,{phase:'prepared',source,preparedSource:source,branch,releaseId:old.releaseId,sourceRelease:old.sourceRelease,selectedRelease,fullUnion,baseAssets:old.totalAssets,totalAssets:3964,publicFiles:228,eligiblePages:71099,changedModules:changed,oldModuleHashes:moduleHashes(original),candidateModuleHashes:moduleHashes(candidate),candidateArtifactSHA256:sha(await fs.readFile(priv+'/candidate.json')),assetManifestSHA256:sha(await fs.readFile(priv+'/manifest.json')),assetChanges,retiredPublicPaths:[],plannedRouteAdditions:[],extraSitemapAssets:old.extraSitemapAssets||[],nativeVersion,firstSnippetCutoverUTC:followup?(old.firstSnippetCutoverUTC||old.cutoverUTC):undefined,scope:followup?'Restore maintained/native-approved attribution dependency; preserve the accepted contact and two-page snippet release':'contact receipt bridge and two head-only search snippets; managed publication unchanged'});
 await save(out+'/release.json',rec);console.log(JSON.stringify({phase:rec.phase,source,assets:3964,changedModules:changed,managedPublicationUnchanged:true,nativeVersion}));
}else if(phase==='source'){
 const rec=await read(out+'/release.json');assert.equal(rec.phase,'prepared');assert.equal(g(['rev-parse','HEAD']),rec.source);
 assert.equal(g(['ls-remote','origin','refs/heads/'+rec.branch]).split(/\s/)[0],rec.source);
 const list=await gh('/pulls?state=open&head=drkotireddysaripalli:'+rec.branch);
 const pr=list[0]||await gh('/pulls','POST',{head:rec.branch,base:'main',title:followup?'Serve the approved contact attribution dependency before the old embedded copy':'Accept legacy contact messages once and test two local search snippets',body:followup?'Public contact imports were reaching an older embedded enrolment-source module. It discarded the two already-approved helpline campaign envelopes that current source and native97c accept. Add that exact maintained dependency to the outer asset handler and frozen union. No additional paths, campaign labels or permissions.\n\nVerify complete six-module asset precedence, existing consent/source regressions, isolated browser journeys and exact-source TestingBot BVT. Reuse sitemap contracts only with identical manager/build/workflow input trees. Preserve the first snippet activation, nine centre bodies, all228 publication files,402 routes, other64 modules and native97c. No customer intake or analytics event is generated by verification.':'The legacy contact form now uses the existing durable enquiry receiver, a matching receipt and safe same-request retries. Only Therapy Services and Assessments count as parent enquiries; other contact topics remain separate. Preserve phone access, existing consent/GA rules and protected handoff. Remove two optional fixed decorations that obscure the mobile form and escape literal line breaks in existing map labels.\n\nApply reviewed title/description changes to Jayanagar and NAD only, retaining all nine treatment/control bodies and the current 60 enquiry / 2 status centre policy.\n\nRelease replaces one shared wrapper and five public assets in the current full union. All 228 managed publication files, 402 routes, other modules, bindings and native contact receiver remain pinned. Isolated browser cases intercept intake and analytics; exact-source Portal quality and TestingBot BVT gate promotion. No synthetic customer, call or production conversion.'});
 rec.pr={number:pr.number,url:pr.html_url};await save(out+'/release.json',rec);console.log(JSON.stringify(rec.pr));
}else if(phase==='ci'&&followup){
 const rec=await read(out+'/release.json'),old=await read(baseline),prior=await read('outputs/contact-ctr-20261015/ci.json');assert.equal(g(['rev-parse','HEAD']),rec.source);
 const reuse=prior.runs.find(r=>r.name==='Sitemap manager contracts'&&r.conclusion==='success');assert(reuse);
 const trees={};for(const p of ['tooling/sitemap-manager','build-window','.github/workflows']){const before=g(['rev-parse',old.source+':'+p]),after=g(['rev-parse',rec.source+':'+p]);assert.equal(after,before,'Changed sitemap contract input '+p);trees[p]=after;}
 const deadline=Date.now()+30*60*1000;let last;
 while(Date.now()<deadline){const runs=await gh('/actions/runs?head_sha='+rec.source+'&per_page=30'),run=runs.workflow_runs.find(r=>r.name==='Portal quality'&&r.event!=='pull_request');
  if(run){const item={name:run.name,id:run.id,source:run.head_sha,status:run.status,conclusion:run.conclusion,url:run.html_url},summary={source:rec.source,runs:[item,{...reuse,reused:true}],reuseProof:{source:old.source,unchangedGitTrees:trees,scope:'Sitemap contracts only; exact new source Portal/TestingBot still required'}};await save(out+'/ci.json',summary);const line=JSON.stringify(item);if(line!==last){console.log(line);last=line;}if(run.status==='completed'){assert.equal(run.conclusion,'success');break;}
  }else if(!rec.ciDispatchRequested){rec.ciDispatchRequested={source:rec.source,at:new Date().toISOString()};await save(out+'/release.json',rec);await gh('/actions/workflows/portal-quality.yml/dispatches','POST',{ref:rec.branch,inputs:{speed:false}});}
  await new Promise(r=>setTimeout(r,15000));
 }
 const ci=await read(out+'/ci.json');assert(ci.runs.every(r=>r.status==='completed'&&r.conclusion==='success'),'CI waiting checkpoint retained');
}else if(['ci','upload','deploy','rollback','restore','verify'].includes(phase)){
 if(phase==='upload'||phase==='deploy'){const rec=await read(out+'/release.json'),s=await state();assert.equal(s.workers['pbn-planetscale'].versions[0].version_id,nativeVersion);assert.equal(s.routes.length,402);assert.equal(rec.nativeVersion,nativeVersion);}
 run([phase]);
}else throw Error('Use capture, prepare, source, ci, upload, deploy, verify or rollback');
