// Handover only the explicitly migrated public families. All other owners stay exact.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const release='knowledge-recovery-20261005',root='ask-private/'+release,receiptPath='deployment/'+release+'-routes.json';
const mode=process.argv[2];assert(['promote-routes','verify'].includes(mode));
const before=JSON.parse(await fs.readFile(root+'/before.json','utf8')),releaseReceipt=JSON.parse(await fs.readFile('deployment/'+release+'.json','utf8'));
assert.equal(releaseReceipt.phase,'promoted-awaiting-public-check');
const token=(await fs.readFile(process.env.APPDATA+'/xdg.config/.wrangler/config/default.toml','utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token);
const routesAPI='/zones/8b13f18e0589996b5d6512552372b434/workers/routes',scripts='/accounts/862998def1cd610fdb86b8e5c1d6ed4d/workers/scripts/';
async function api(p,method='GET',body){const r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});const j=await r.json();assert(r.ok&&j.success,JSON.stringify(j.errors));return j.result;}
const changes=['www.pinnacleblooms.org/faq*','www.pinnacleblooms.org/allmirracles*'];
const additions=['pinnacleblooms.org/faq*','www.pinnacleblooms.org/sunshine*','pinnacleblooms.org/sunshine*','pinnacleblooms.org/allmirracles*'];
const normal=rows=>rows.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern));
const latest=x=>x.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0].versions;
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const g=args=>execFileSync(git,args,{encoding:'utf8'}).trim();
const commit=g(['rev-parse','HEAD']);assert.equal(g(['ls-remote','origin','refs/heads/main']).split(/\s/)[0],commit,'Push exact code before route handover');
const now=normal(await api(routesAPI));assert.deepEqual(latest(await api(scripts+'pinnacle-ask/deployments')),[{version_id:releaseReceipt.candidate,percentage:100}]);
for(const [name,key] of [['pinnacle-verify-route','portal'],['pinnacle-ask-mcp','mcp']])assert.deepEqual(latest(await api(scripts+name+'/deployments')),before[key].versions,'Protected version changed');
const currentBindings=(await api(scripts+'pinnacle-ask/settings')).bindings;assert.deepEqual(currentBindings.map(({name,type})=>({name,type})).sort((a,b)=>a.name.localeCompare(b.name)),before.settings.bindings.map(({name,type})=>({name,type})).sort((a,b)=>a.name.localeCompare(b.name)));
let receipt=await fs.readFile(receiptPath,'utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return {at:new Date().toISOString(),commit,workerVersion:releaseReceipt.candidate,changed:[],added:[],beforeRouteCount:before.routes.length};throw e;});
const save=()=>fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));
function check(rows){
 for(const r of before.routes){const current=rows.find(x=>x.id===r.id);assert(current,'Missing original route');assert.deepEqual(current,{...r,script:receipt.changed.some(x=>x.id===r.id)?'pinnacle-ask':r.script},'Unexpected route drift '+r.pattern);}
 assert.equal(rows.length,before.routes.length+receipt.added.length);for(const r of receipt.added)assert.deepEqual(rows.find(x=>x.id===r.id),r);
}
check(now);
if(mode==='promote-routes'){
 for(const pattern of changes){if(receipt.changed.some(x=>x.pattern===pattern))continue;const old=before.routes.find(x=>x.pattern===pattern);assert(old?.script==='pinnacle-legacy-social-metadata');await api(routesAPI+'/'+old.id,'PUT',{pattern,script:'pinnacle-ask'});receipt.changed.push({...old,previousScript:old.script});await save();}
 for(const pattern of additions){if(receipt.added.some(x=>x.pattern===pattern))continue;check(normal(await api(routesAPI)));assert(!before.routes.some(x=>x.pattern===pattern));const created=await api(routesAPI,'POST',{pattern,script:'pinnacle-ask',request_limit_fail_open:true});receipt.added.push({id:created.id,pattern:created.pattern,script:created.script});await save();}
}
const after=normal(await api(routesAPI));check(after);assert.equal(receipt.changed.length,2);assert.equal(receipt.added.length,4);receipt.verifiedAt=new Date().toISOString();receipt.afterRouteCount=after.length;receipt.protectedVersionsAndBindingsPreserved=true;await save();console.log(JSON.stringify(receipt));
