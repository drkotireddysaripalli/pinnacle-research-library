// Activate only the reproduced public mobile recovery cases after the tested
// Portal version is live. Record every route mutation for exact rollback.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const phase=process.argv[2],site=path.resolve(import.meta.dirname,'..'),file=path.join(site,'deployment/acquisition-mobile-routes-20261008.json');
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const routeAPI='/zones/8b13f18e0589996b5d6512552372b434/workers/routes',worker='pinnacle-verify-route';
const patterns=['www.pinnacleblooms.org/child-psychological-counseling*','www.pinnacleblooms.org/franchise-autism-therapy-center*','www.pinnacleblooms.org/epass*','www.pinnacleblooms.org/TOS*','www.pinnacleblooms.org/tos*'];
async function api(p,method='GET',body){const r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(45000)}),j=await r.json();assert(r.ok&&j.success,JSON.stringify({status:r.status,errors:j.errors}));return j.result;}
const save=j=>fs.writeFile(file,JSON.stringify(j,null,2)+'\n');
if(phase==='activate'){
 assert(!(await fs.stat(file).catch(()=>null)),'Reconcile recorded route changes before retrying');
 const release=JSON.parse(await fs.readFile(path.join(site,'deployment/automatic-enquiry-20261008.json'),'utf8'));assert.equal(release.phase,'verified-configuration');
 const versions=(await api('/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/'+worker+'/deployments')).deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
 assert.deepEqual(versions,[{version_id:release.candidate,percentage:100}]);
 const before=await api(routeAPI),baseline=JSON.parse(await fs.readFile(path.join(site,'ask-private/automatic-enquiry-20261008/before.json'),'utf8')).routes;
 const normal=a=>a.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern));assert.deepEqual(normal(before),baseline);
 const receipt={at:new Date().toISOString(),phase:'activating',commit:release.commit,deployment:release.deployment,before,changes:[],additions:[],targets:patterns};await save(receipt);
 const franchise=before.find(r=>r.pattern==='www.pinnacleblooms.org/franchise-autism-therapy-center');assert(franchise&&franchise.script==='pinnacle-legacy-social-metadata');
 const changed=await api(routeAPI+'/'+franchise.id,'PUT',{pattern:franchise.pattern,script:worker,request_limit_fail_open:franchise.request_limit_fail_open});receipt.changes.push({before:franchise,after:changed});await save(receipt);
 for(const pattern of patterns){assert(!before.some(r=>r.pattern===pattern),'Existing recovery pattern requires reconciliation');const added=await api(routeAPI,'POST',{pattern,script:worker});receipt.additions.push(added);await save(receipt);}
 receipt.phase='activated';await save(receipt);
}else assert.equal(phase,'verify');
const receipt=JSON.parse(await fs.readFile(file,'utf8')),after=await api(routeAPI);
for(const old of receipt.before){const change=receipt.changes.find(c=>c.before.id===old.id),expected=change?{...old,script:worker}:old;assert.deepEqual(after.find(r=>r.id===old.id),expected,'Undeclared route change '+old.pattern);}
assert.equal(after.length,receipt.before.length+receipt.additions.length);for(const added of receipt.additions)assert.deepEqual(after.find(r=>r.id===added.id),added);
receipt.phase='verified-routes';receipt.verifiedAt=new Date().toISOString();receipt.afterCount=after.length;await save(receipt);console.log(JSON.stringify({phase:receipt.phase,before:receipt.before.length,after:after.length,changed:receipt.changes.length,added:receipt.additions.length}));
