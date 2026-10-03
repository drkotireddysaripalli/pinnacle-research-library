// Read-only release guard using the existing Wrangler account authentication.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const [configPath,output,beforeFile,expectedVersion]=process.argv.slice(2);
assert(configPath&&output,'Pass Wrangler config and output receipt');
const config=JSON.parse(await fs.readFile(configPath,'utf8'));
const authFile=path.join(process.env.APPDATA,'xdg.config','.wrangler','config','default.toml');
const auth=process.env.CLOUDFLARE_API_TOKEN||(await fs.readFile(authFile,'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
assert(auth,'Existing Cloudflare authentication is required');
async function get(suffix){const r=await fetch('https://api.cloudflare.com/client/v4'+suffix,{headers:{authorization:'Bearer '+auth},signal:AbortSignal.timeout(30000)});const j=await r.json();assert(r.ok&&j.success,'Cloudflare read failed: '+r.status);return j.result;}
const zones=await get('/zones?name=pinnacleblooms.org');assert.equal(zones.length,1);
const base='/accounts/'+config.account_id+'/workers/scripts/'+config.name;
const [routes,settings,deployments]=await Promise.all([get('/zones/'+zones[0].id+'/workers/routes'),get(base+'/settings'),get(base+'/deployments')]);
const latest=(deployments.deployments||deployments).sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];
const bindings=settings.bindings.map(({name,type,service,environment})=>({name,type,service:service||null,environment:environment||null})).sort((a,b)=>a.name.localeCompare(b.name));
const report={at:new Date().toISOString(),worker:config.name,zoneId:zones[0].id,routes:routes.map(({id,pattern,script})=>({id,pattern,script:script||null})).sort((a,b)=>a.pattern.localeCompare(b.pattern)),bindings,deployment:latest};
// Both hosts are required: an apex-only check previously missed a public www 404.
for(const [pattern,script] of [['pinnacleblooms.org/ask*','pinnacle-ask'],['www.pinnacleblooms.org/ask*','pinnacle-verify-route']]){
 assert(report.routes.some(r=>r.pattern===pattern&&r.script===script),'Required separate Ask route is missing: '+pattern);
}
if(beforeFile){const before=JSON.parse(await fs.readFile(beforeFile,'utf8'));assert.deepEqual(report.routes,before.routes,'Zone routes changed');assert.deepEqual(report.bindings,before.bindings,'Worker bindings changed');assert(latest.versions.some(v=>v.version_id===expectedVersion&&v.percentage===100),'Expected version must serve 100%');report.routesAndBindingsUnchanged=true;report.rollback=before.deployment.versions;}
await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,routes:routes.length,assigned:routes.filter(r=>r.script===config.name).length,bindings:bindings.length,deployment:latest,verified:!!beforeFile}));
