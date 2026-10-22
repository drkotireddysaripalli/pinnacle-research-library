// Bounded three-worker release. Keep the captured module union, routes, assets,
// settings and rollback versions; use local exact-source acceptance.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {replaceBundledCall,replaceSelectedReference,replaceAutomaticLegacyDefaults} from './asset-regression-patch.mjs';
import {LEGACY_TAGS} from '../deployment/legacy-measurement-fingerprints.mjs';
import {PUBLIC_AD_CALL_PATH} from '../deployment/public-ad-call.mjs';
const [phase,folder]=process.argv.slice(2);
const completion=process.argv.includes('--completion');
assert(['prepare','check','upload','promote','verify','rollback'].includes(phase)&&folder);
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),out=path.resolve(folder);
const manifest=JSON.parse(await fs.readFile(path.join(out,'preimage/manifest.json'),'utf8'));
const names=['pinnacle-verify-route','pinnacle-legacy-social-metadata','materials-mobile-desktop-tracker'];
assert.deepEqual(manifest.workers.map(w=>w.name),names);
const sha=b=>createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
const save=(name,value)=>fs.writeFile(path.join(out,name),JSON.stringify(value,null,2)+'\n',{mode:0o600});
const load=async name=>JSON.parse(await fs.readFile(path.join(out,name),'utf8'));
const read=name=>fs.readFile(path.join(site,name));
const raw=await fs.readFile(path.join(process.env.HOME,'Library/Preferences/.wrangler/config/default.toml'),'utf8');
const token=raw.match(/^(?:oauth_token|api_token)\s*=\s*"([^"]+)"/m)?.[1];assert(token);
const account='862998def1cd610fdb86b8e5c1d6ed4d',zone='8b13f18e0589996b5d6512552372b434';
const base=name=>`/accounts/${account}/workers/scripts/${name}`;
async function api(route,method='GET',body){
  const form=body instanceof FormData;
  const r=await fetch('https://api.cloudflare.com/client/v4'+route,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(60000)});
  const value=await r.json();assert(r.ok&&value.success,JSON.stringify({route,status:r.status,errors:value.errors}));return value.result;
}
const stable=s=>Object.fromEntries(['compatibility_date','compatibility_flags','bindings','placement','tail_consumers','logpush','observability','limits','usage_model'].filter(k=>s[k]!==undefined).map(k=>[k,s[k]]));
const routes=rs=>rs.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern));
async function assertUnchanged(receipt={workers:{}}){
  assert.deepEqual(routes(await api(`/zones/${zone}/workers/routes`)),routes(manifest.routes),'Full route union changed');
  for(const w of manifest.workers){
    const [ds,s]=await Promise.all([api(base(w.name)+'/deployments'),api(base(w.name)+'/settings')]);
    const d=ds.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
    const expected=receipt.workers[w.name]?.promoted?[{version_id:receipt.workers[w.name].version,percentage:100}]:w.deployment.versions;
    assert.deepEqual(d.versions,expected,w.name+' deployment changed');assert.deepEqual(stable(s),stable(w.settings),w.name+' settings changed');
  }
}
async function candidates(){
  const generated=(await read('deployment/legacy-measurement.runtime.mjs')).toString(),result={};
  for(const w of manifest.workers){
    result[w.name]={};
    for(const m of w.modules){
      const bytes=await fs.readFile(path.join(out,'preimage',w.name,m.name));assert.equal(sha(bytes),m.sha256);
      result[w.name][m.name]=bytes;
    }
  }
  if(completion){
    const portalEntry='call-asset-priority-entry-20261022.mjs',legacyEntry='courses-tracking-entry-20261022.mjs';
    const original=manifest.workers[0].entry,legacyOriginal=manifest.workers[1].entry;
    assert(original!==portalEntry&&legacyOriginal!==legacyEntry,'Completion wrappers already installed');
    result[names[0]][portalEntry]=Buffer.from(`import original from './${original}';export * from './${original}';import {servePublicAdCall} from './public-ad-call.mjs';export default {...original,async fetch(request,env,ctx){return servePublicAdCall(request)||await original.fetch(request,env,ctx);}};\n`);
    result[names[1]][legacyEntry]=Buffer.from(`import original from './${legacyOriginal}';export * from './${legacyOriginal}';import {repairCourseTracking} from './legacy-courses-tracking.mjs';import {repairLegacyMeasurement} from './legacy-measurement.runtime.mjs';export default {...original,async fetch(request,env,ctx){return repairCourseTracking(request,await original.fetch(request,env,ctx),repairLegacyMeasurement);}};\n`);
    result[names[1]]['legacy-courses-tracking.mjs']=await read('deployment/legacy-courses-tracking.mjs');
    return result;
  }
  result[names[0]]['public-ad-call.mjs']=await read('deployment/public-ad-call.mjs');
  for(const name of names.slice(0,2))result[name]['legacy-measurement.runtime.mjs']=Buffer.from(replaceAutomaticLegacyDefaults(replaceBundledCall(result[name]['legacy-measurement.runtime.mjs'].toString(),generated),generated));
  result[names[1]]['selected-reference-legacy-runtime.mjs']=Buffer.from(replaceAutomaticLegacyDefaults(replaceSelectedReference(result[names[1]]['selected-reference-legacy-runtime.mjs'].toString(),PUBLIC_AD_CALL_PATH),generated));
  result[names[2]]['interventions-index-runtime-20261016.mjs']=await read('deployment/interventions-index-root.mjs');
  return result;
}
const candidate=await candidates();
const inputFiles=['deployment/public-ad-call.mjs','deployment/legacy-measurement.runtime.mjs','deployment/legacy-measurement-fingerprints.mjs','deployment/interventions-index-root.mjs','src/lib/google-ads-call-consent.mjs','src/lib/public-ad-call-aliases.json','scripts/build-public-ad-call.mjs','scripts/build-legacy-measurement.mjs','scripts/asset-regression-patch.mjs','scripts/release-asset-regressions.mjs','scripts/test-asset-regressions.mjs','scripts/test-ad-call-consent.mjs','scripts/test-interventions-index-root.mjs',...(completion?['deployment/legacy-courses-tracking.mjs','scripts/test-call-asset-priority.mjs']:[])];
const inputs=Object.fromEntries(await Promise.all(inputFiles.map(async f=>[f,sha(await read(f))])));
if(phase==='prepare'){
  assert(!(await fs.stat(path.join(out,'release.json')).catch(()=>null)),'Reuse existing receipt');await assertUnchanged();
  const workers={};
  for(const w of manifest.workers){
    const old=Object.fromEntries(w.modules.map(m=>[m.name,m.sha256]));
    const changed=Object.entries(candidate[w.name]).filter(([name,bytes])=>sha(bytes)!==old[name]).map(([name])=>name);
    workers[w.name]={changed,entry:completion?(w.name===names[0]?'call-asset-priority-entry-20261022.mjs':w.name===names[1]?'courses-tracking-entry-20261022.mjs':w.entry):w.entry,rollback:w.deployment.versions,moduleCount:Object.keys(candidate[w.name]).length};
  }
  assert.deepEqual(workers[names[0]].changed.sort(),completion?['call-asset-priority-entry-20261022.mjs']:['legacy-measurement.runtime.mjs','public-ad-call.mjs']);
  assert.deepEqual(workers[names[1]].changed.sort(),completion?['courses-tracking-entry-20261022.mjs','legacy-courses-tracking.mjs']:['legacy-measurement.runtime.mjs','selected-reference-legacy-runtime.mjs']);
  assert.deepEqual(workers[names[2]].changed,completion?[]:['interventions-index-runtime-20261016.mjs']);
  await save('release.json',{phase:'prepared',at:new Date().toISOString(),inputs,workers,currentPath:PUBLIC_AD_CALL_PATH});
  console.log(JSON.stringify({phase:'prepared',workers}));
}else if(phase==='check'){
  const tests=['scripts/test-asset-regressions.mjs','scripts/test-ad-call-consent.mjs','scripts/test-interventions-index-root.mjs',...(completion?['scripts/test-call-asset-priority.mjs']:[])];
  const log=execFileSync(process.execPath,['--test',...tests],{cwd:site,encoding:'utf8'});
  await fs.writeFile(path.join(out,'acceptance.log'),log,{mode:0o600});
  for(const [worker,modules]of Object.entries(candidate)){
    const dir=path.join(out,'candidate',worker);await fs.mkdir(dir,{recursive:true});
    for(const [name,bytes]of Object.entries(modules))await fs.writeFile(path.join(dir,name),bytes,{mode:0o600});
  }
  const module=await import(path.join(out,'candidate',names[1],'legacy-measurement.runtime.mjs')+'?check='+Date.now());
  const r=module.serveLegacyMeasurementCall(new Request('https://www.pinnacleblooms.org'+PUBLIC_AD_CALL_PATH));
  assert.equal(await r.text(),(await read('src/lib/google-ads-call-consent.mjs')).toString().replace(/\r\n/g,'\n'));
  const testPath='/t/bead-stringing-therapy',url='https://www.pinnacleblooms.org'+testPath;
  const fixture='<html><head><link rel="canonical" href="'+url+'">'+LEGACY_TAGS.join('')+'</head><body><h1>Retained content</h1></body></html>';
  const migrated=module.migrateLegacyPrefix(fixture,new Request(url));
  assert(migrated);assert.equal(migrated.controls,'');assert(migrated.html.includes(PUBLIC_AD_CALL_PATH));assert(migrated.html.includes('Retained content'));assert(!migrated.html.includes('pinnacle-speech-analytics-v1'));
  if(completion){
    const {repairCourseTracking}=await import(path.join(out,'candidate',names[1],'legacy-courses-tracking.mjs'));
    const course=await fs.readFile(path.join(out,'../courseplain.html'),'utf8');
    const result=await repairCourseTracking(new Request('https://www.pinnacleblooms.org/certified-courses'),new Response(course,{headers:{'content-type':'text/html'}}),async(req,res,options)=>{
      const value=module.migrateLegacyPrefix(await res.text(),req,options);assert(value,'Captured course migrates after exact canonical repair');assert.equal(value.controls,'');return new Response(value.html);
    });
    assert((await result.text()).includes(PUBLIC_AD_CALL_PATH));
  }
  const receipt=await load('release.json');assert.equal(receipt.phase,'prepared');receipt.inputs=inputs;await save('release.json',receipt);
  await save('acceptance.json',{status:'passed',commit:git(['rev-parse','HEAD']),at:new Date().toISOString(),inputs,logSHA256:sha(log),candidateHashes:Object.fromEntries(Object.entries(candidate).map(([w,ms])=>[w,Object.fromEntries(Object.entries(ms).map(([n,b])=>[n,sha(b)]))]))});
  console.log(log.trim());console.log('Captured legacy composition and full candidate hashes passed.');
}else{
  const receipt=await load('release.json');assert.deepEqual(receipt.inputs,inputs);await assertUnchanged(receipt);
  if(phase==='upload'){
    assert.equal(receipt.phase,'prepared');assert.equal(git(['diff','HEAD','--']),'');
    const commit=git(['rev-parse','HEAD']);assert.equal(git(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit);
    const proof=await load('acceptance.json');assert.equal(proof.status,'passed');assert.equal(proof.commit,commit);assert.deepEqual(proof.inputs,inputs);assert.equal(proof.logSHA256,sha(await fs.readFile(path.join(out,'acceptance.log'))));
    for(const w of manifest.workers){
      if(!receipt.workers[w.name].changed.length)continue;
      const s=w.settings,metadata={main_module:receipt.workers[w.name].entry,...(w.details.resources?.script_runtime?.assets?{keep_assets:true}:{}),compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(b=>({name:b.name,type:'inherit'})),annotations:{'workers/message':'reviewed-asset-regressions-20261022'}};
      for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)metadata[k]=s[k];
      const body=new FormData();body.set('metadata',JSON.stringify(metadata));
      for(const [name,bytes]of Object.entries(candidate[w.name])){assert.equal(sha(bytes),proof.candidateHashes[w.name][name]);body.set(name,new Blob([bytes],{type:'application/javascript+module'}),name);}
      const v=await api(base(w.name)+'/versions?bindings_inherit=strict','POST',body);receipt.workers[w.name].version=v.id;await save('release.json',receipt);
    }
    receipt.commit=commit;receipt.phase='uploaded';await save('release.json',receipt);
  }else if(phase==='promote'){
    assert.equal(receipt.phase,'uploaded');
    for(const w of manifest.workers){if(receipt.workers[w.name].promoted||!receipt.workers[w.name].version)continue;await assertUnchanged(receipt);const d=await api(base(w.name)+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.workers[w.name].version,percentage:100}]});Object.assign(receipt.workers[w.name],{promoted:true,deployment:d.id,promotedAt:new Date().toISOString()});await save('release.json',receipt);}
    receipt.phase='promoted';await save('release.json',receipt);
  }else if(phase==='verify'){
    assert.equal(receipt.phase,'promoted');const proof=await load('acceptance.json');
    for(const w of manifest.workers){const r=await fetch('https://api.cloudflare.com/client/v4'+base(w.name)+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(60000)});assert(r.ok);assert.equal(r.headers.get('cf-entrypoint'),receipt.workers[w.name].entry);const found={};for(const [key,v]of await r.formData())if(typeof v!=='string')found[v.name||key]=sha(Buffer.from(await v.arrayBuffer()));assert.deepEqual(found,proof.candidateHashes[w.name]);const details=await api(base(w.name)+'/versions/'+(receipt.workers[w.name].version||w.deployment.versions[0].version_id));assert.deepEqual(details.resources?.script_runtime?.assets||null,w.details.resources?.script_runtime?.assets||null);}
    receipt.phase='verified-configuration';receipt.verifiedAt=new Date().toISOString();await save('release.json',receipt);
  }else{
    for(const w of [...manifest.workers].reverse())if(receipt.workers[w.name].promoted){await assertUnchanged(receipt);await api(base(w.name)+'/deployments','POST',{strategy:'percentage',versions:receipt.workers[w.name].rollback});receipt.workers[w.name].promoted=false;await save('release.json',receipt);}receipt.phase='rolled-back';await save('release.json',receipt);
  }
  console.log(JSON.stringify({phase:receipt.phase,workers:receipt.workers}));
}
