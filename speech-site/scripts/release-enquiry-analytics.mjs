// Adds bounded private reporting to the existing receipt entrypoint. No public
// endpoint, database mutation, new credential, binding or receiving change.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {build} from 'esbuild';
import {patchEnquiryAnalyticsReceiver} from './prepare-enrolment-receiver.mjs';
const [phase]=process.argv.slice(2),id='automatic-enquiry-20261008',site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private',id),receiptPath=path.join(site,'deployment','enquiry-analytics-receiver-20261008.json');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe',g=args=>execFileSync(git,['-C',repo,...args],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024}).trim(),sha=b=>createHash('sha256').update(b).digest('hex'),normal=b=>b.toString().replaceAll('\r\n','\n').trim(),save=(p,j)=>fs.writeFile(p,JSON.stringify(j,null,2)+'\n');
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const base='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/pbn-planetscale';
async function api(p,method='GET',body){const form=body instanceof FormData,r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,...(!form?{'content-type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(45000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,path:p,errors:j.errors}));return j.result;}
async function versions(){return (await api(base+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;}
async function modules(){const r=await fetch('https://api.cloudflare.com/client/v4'+base+'/content/v2',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)});assert(r.ok);const a=[];for(const[k,v]of await r.formData())if(typeof v!=='string')a.push({name:v.name||k,bytes:Buffer.from(await v.arrayBuffer())});return a;}
await fs.mkdir(priv,{recursive:true});
if(phase==='prepare'){
 assert(!(await fs.stat(receiptPath).catch(()=>null)),'Reconcile the existing receiver receipt');
 const [settings,rollback,mods]=await Promise.all([api(base+'/settings'),versions(),modules()]);
 const prior=JSON.parse(await fs.readFile(path.join(site,'deployment/enquiry-source-20261008.json'),'utf8'));assert.equal(rollback[0].version_id,prior.receiverVersion);assert.equal(rollback.length,1);
 const main=mods.find(m=>m.name==='index.js');assert(main);const expected=prior.receiverHashes['index.js'];assert.equal(sha(main.bytes),expected);
 const candidate=patchEnquiryAnalyticsReceiver(main.bytes,expected);await fs.writeFile(path.join(priv,'receiver-index.js'),candidate);
 await build({entryPoints:[path.join(site,'deployment/enrolment-analytics.mjs')],outfile:path.join(priv,'website-enrolment-analytics.mjs'),bundle:true,format:'esm',platform:'neutral',target:'es2022'});
 await save(path.join(priv,'receiver-before.json'),{settings,rollback,modules:mods.map(m=>({name:m.name,base64:m.bytes.toString('base64')}))});
 await save(receiptPath,{id,phase:'prepared',at:new Date().toISOString(),baseCommit:g(['rev-parse','HEAD']),rollback,baselineIndexHash:expected,databaseMutation:false,publicEndpoint:false,bindingsChanged:false});
 console.log(JSON.stringify({phase:'prepared',worker:'pbn-planetscale',rollback,moduleCount:mods.length+1}));
}else{
 const before=JSON.parse(await fs.readFile(path.join(priv,'receiver-before.json'),'utf8')),receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));
 if(phase==='upload'){
  assert.equal(receipt.phase,'prepared');assert.deepEqual(await versions(),before.rollback);assert.deepEqual(await api(base+'/settings'),before.settings);
  const commit=g(['rev-parse','HEAD']),ci=JSON.parse(await fs.readFile(path.join(priv,'ci.json'),'utf8'));assert.equal(ci.head_sha,commit);assert.equal(ci.conclusion,'success');assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit);
  for(const file of ['deployment/enrolment-analytics.mjs','scripts/prepare-enrolment-receiver.mjs'])assert.equal(sha(normal(await fs.readFile(path.join(site,file)))),sha(normal(g(['show','HEAD:speech-site/'+file]))));
  const old=before.modules.map(m=>({name:m.name,bytes:Buffer.from(m.base64,'base64')}));
  old.find(m=>m.name==='index.js').bytes=Buffer.from(patchEnquiryAnalyticsReceiver(old.find(m=>m.name==='index.js').bytes,receipt.baselineIndexHash));
  assert.equal(sha(old.find(m=>m.name==='index.js').bytes),sha(await fs.readFile(path.join(priv,'receiver-index.js'))));
  await build({entryPoints:[path.join(site,'deployment/enrolment-analytics.mjs')],outfile:path.join(priv,'receiver-analytics-committed.mjs'),bundle:true,format:'esm',platform:'neutral',target:'es2022'});
  const helper=await fs.readFile(path.join(priv,'website-enrolment-analytics.mjs'));assert.equal(sha(helper),sha(await fs.readFile(path.join(priv,'receiver-analytics-committed.mjs'))));old.push({name:'website-enrolment-analytics.mjs',bytes:helper});
  const s=before.settings,metadata={main_module:'index.js',compatibility_date:s.compatibility_date,compatibility_flags:s.compatibility_flags||[],bindings:s.bindings.map(b=>({name:b.name,type:'inherit'})),annotations:{'workers/message':id+'-private-reporting'}};
  for(const k of ['placement','tail_consumers','logpush','observability','limits','usage_model'])if(s[k]!==undefined)metadata[k]=s[k];
  const form=new FormData();form.set('metadata',JSON.stringify(metadata));for(const m of old)form.set(m.name,new Blob([m.bytes],{type:'application/javascript+module'}),m.name);
  const r=await api(base+'/versions?bindings_inherit=strict','POST',form);receipt.candidate=r.id;receipt.commit=commit;receipt.hashes=Object.fromEntries(old.map(m=>[m.name,sha(m.bytes)]));receipt.phase='uploaded';
 }else if(phase==='promote'){
  assert.equal(receipt.phase,'uploaded');assert.deepEqual(await versions(),before.rollback);const d=await api(base+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidate,percentage:100}]});receipt.deployment=d.id;receipt.phase='promoted';receipt.promotedAt=new Date().toISOString();
 }else if(phase==='verify'){
  assert.deepEqual(await versions(),[{version_id:receipt.candidate,percentage:100}]);const m=await modules();assert.deepEqual(Object.fromEntries(m.map(x=>[x.name,sha(x.bytes)])),receipt.hashes);
  const actual=await api(base+'/settings'),expected=structuredClone(before.settings);expected.annotations={...expected.annotations,'workers/message':id+'-private-reporting'};assert.deepEqual(actual,expected);
  receipt.phase='verified-configuration';receipt.verifiedAt=new Date().toISOString();
 }else if(phase==='report-ready'){
  assert.equal(receipt.phase,'verified-configuration');
  await fs.writeFile(path.join(priv,'analytics-driver.toml'),'name="pinnacle-private-enquiry-report-local"\nmain="analytics-driver.mjs"\ncompatibility_date="2026-10-07"\naccount_id="862998def1cd610fdb86b8e5c1d6ed4d"\n[[services]]\nbinding="RECEIVER"\nservice="pbn-planetscale"\nentrypoint="WebsiteEnrolmentReceipts"\nremote=true\n');
  await fs.writeFile(path.join(priv,'analytics-driver.mjs'),'export default {async fetch(request,env){return Response.json(await env.RECEIVER.analytics({startMs:Date.parse("2026-10-08T00:00:00+05:30"),endMs:Date.now(),limit:1000}));}};\n');
 }else throw Error('Use prepare/upload/promote/verify/report-ready');
 await save(receiptPath,receipt);console.log(JSON.stringify({phase:receipt.phase,version:receipt.candidate,commit:receipt.commit,publicEndpoint:false,databaseMutation:false}));
}
