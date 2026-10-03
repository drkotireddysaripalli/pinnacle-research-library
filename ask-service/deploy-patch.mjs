// Existing Workers only. No route writes, no asset replacement, no plaintext secrets in receipts.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const evidence=path.resolve(process.argv[2]);
const auth=process.env.CLOUDFLARE_API_TOKEN||(await fs.readFile(path.join(process.env.APPDATA,'xdg.config','.wrangler','config','default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)[1];
const api='https://api.cloudflare.com/client/v4',account='862998def1cd610fdb86b8e5c1d6ed4d',zone='8b13f18e0589996b5d6512552372b434';
async function call(p,options={}){const r=await fetch(api+p,{...options,headers:{authorization:'Bearer '+auth,...options.headers},signal:AbortSignal.timeout(60000)});const j=await r.json();if(!r.ok||!j.success)throw Error(JSON.stringify({path:p,status:r.status,errors:j.errors}));return j.result;}
const p=name=>`/accounts/${account}/workers/scripts/${name}`;
const before=JSON.parse(await fs.readFile(path.join(evidence,'workers-before.json'),'utf8'));
const routesBefore=await call(`/zones/${zone}/workers/routes`);
const portalBefore=await call(p('pinnacle-verify-route')+'/deployments');
const receipt={at:new Date().toISOString(),routeCountBefore:routesBefore.length,workers:[]};
for(const name of (process.argv.includes('--ask-only')?['pinnacle-ask']:['pinnacle-ask','pinnacle-ask-mcp'])){
 const original=before.workers.find(w=>w.name===name);
 const current=await call(p(name)+'/deployments');
 const explicitVersion=process.argv.find(arg=>arg.startsWith('--expected-version='))?.split('=')[1];
 const expected=explicitVersion?[{version_id:explicitVersion,percentage:100}]:process.argv.includes('--ask-only')?JSON.parse(await fs.readFile(path.join(evidence,'deployment-receipt-initial.json'),'utf8')).workers.find(w=>w.name===name).version:original.deployments.deployments[0].versions;
 assert.deepEqual(current.deployments[0].versions,expected,'Concurrent deployment detected');
 const settings=await call(p(name)+'/settings');
 const originalSettings=JSON.parse(await fs.readFile(path.join(evidence,'.private',name+'.settings.json'),'utf8'));
 assert.deepEqual(settings.bindings,originalSettings.bindings,'Concurrent binding change detected');
 const metadata={main_module:'index.js',bindings:settings.bindings,keep_assets:true,keep_bindings:['secret_text'],compatibility_date:settings.compatibility_date,compatibility_flags:settings.compatibility_flags||[],logpush:settings.logpush||false};
 for(const key of ['limits','placement','observability','tail_consumers','tags','usage_model'])if(settings[key]!==undefined)metadata[key]=settings[key];
 const form=new FormData();form.set('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));
 const dir=path.join(evidence,'.private',name+'-patched');
 for(const m of JSON.parse(await fs.readFile(path.join(dir,'modules.json'),'utf8')))form.set(m.name,new Blob([await fs.readFile(path.join(dir,m.file))],{type:m.type}),m.name);
 const uploaded=await call(p(name),{method:'PUT',body:form});
 const after=await call(p(name)+'/settings');
 assert.deepEqual(after.bindings,settings.bindings,'Bindings changed unexpectedly');
 assert.equal(after.compatibility_date,settings.compatibility_date);
 const deployed=await call(p(name)+'/deployments');
 receipt.workers.push({name,rollbackVersions:current.deployments[0].versions,version:deployed.deployments[0].versions,uploadedId:uploaded.id,bindingsPreserved:true,codeSha256:crypto.createHash('sha256').update(await fs.readFile(path.join(dir,'index.js'))).digest('hex')});
 await fs.writeFile(path.join(evidence,'deployment-receipt.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt.workers.at(-1)));
}
const routesAfter=await call(`/zones/${zone}/workers/routes`);
assert.deepEqual(routesAfter,routesBefore,'Route table changed');
assert.deepEqual((await call(p('pinnacle-verify-route')+'/deployments')).deployments[0].versions,portalBefore.deployments[0].versions,'Portal Worker changed');
receipt.routesPreserved=true;receipt.portalWorkerPreserved=true;receipt.routeCountAfter=routesAfter.length;
await fs.writeFile(path.join(evidence,'routes-before.json'),JSON.stringify(routesBefore,null,2));
await fs.writeFile(path.join(evidence,'deployment-receipt.json'),JSON.stringify(receipt,null,2));
console.log('All routes, bindings, existing assets and portal Worker preserved.');
