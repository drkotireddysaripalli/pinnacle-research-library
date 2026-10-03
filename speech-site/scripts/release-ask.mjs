import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn,execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const account='862998def1cd610fdb86b8e5c1d6ed4d',zone='8b13f18e0589996b5d6512552372b434',name='pinnacle-ask';
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const auth=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(auth,'Existing Cloudflare login required');
const root='/accounts/'+account+'/workers/scripts/';
async function api(p,method='GET',body){const r=await fetch('https://api.cloudflare.com/client/v4'+p,{method,headers:{authorization:'Bearer '+auth,'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});const j=await r.json();assert(r.ok&&j.success,'Cloudflare request failed: '+r.status+' '+p+' '+JSON.stringify(j.errors?.map(e=>({code:e.code,message:e.message}))));return j.result;}
const normalise=r=>r.map(({id,pattern,script})=>({id,pattern,script})).sort((a,b)=>a.pattern.localeCompare(b.pattern));
async function state(){const [routes,ask,portal,mcp,settings]=await Promise.all([api('/zones/'+zone+'/workers/routes'),api(root+name+'/deployments'),api(root+'pinnacle-verify-route/deployments'),api(root+'pinnacle-ask-mcp/deployments'),api(root+name+'/settings')]);const latest=x=>x.deployments.sort((a,b)=>b.created_on.localeCompare(a.created_on))[0];return {at:new Date().toISOString(),routes:normalise(routes),ask:latest(ask),portal:latest(portal),mcp:latest(mcp),settings};}
await fs.mkdir('ask-private',{recursive:true});await fs.mkdir('deployment',{recursive:true});
const phase=process.argv[2]||'prepare';
const receiptPath='deployment/ask-astro-release-20261003.json';
if(phase==='prepare'){const before=await state();assert(before.routes.some(r=>r.pattern==='pinnacleblooms.org/ask*'&&r.script===name));await fs.writeFile('ask-private/before.json',JSON.stringify(before));const receipt={phase,sourceCommit:execFileSync(git,['rev-parse','HEAD'],{encoding:'utf8'}).trim(),at:before.at,routeCount:before.routes.length,rollback:before.ask.versions,protected:{portal:before.portal.versions,mcp:before.mcp.versions},bindings:before.settings.bindings.map(({name,type})=>({name,type}))};await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));}
else{
const before=JSON.parse(await fs.readFile('ask-private/before.json','utf8'));const receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));
if(phase==='upload'){
const output=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','versions','upload','--config','dist-ask/server/wrangler.json','--keep-vars','--message','Ask Astro common portal release 20261003'],{windowsHide:true,env:{...process.env,CLOUDFLARE_API_TOKEN:auth,CLOUDFLARE_ACCOUNT_ID:account},stdio:['ignore','pipe','pipe']});let s='';child.stdout.on('data',c=>s+=c);child.stderr.on('data',c=>s+=c);child.on('error',reject);child.on('close',async n=>{await fs.writeFile('ask-private/upload.log',s);n===0?resolve(s):reject(new Error('Worker version upload failed; inspect private upload log. Exit '+n));});});
const id=String(output).match(/Worker Version ID:\s*([0-9a-f-]{36})/i)?.[1];assert(id,'Version ID absent; inspect private upload log before retrying');
const version=await api(root+name+'/versions/'+id);await fs.writeFile('ask-private/candidate.json',JSON.stringify(version));
const bindings=version.resources?.bindings||[];const names=bindings.map(x=>x.name);
for(const x of before.settings.bindings)assert(names.includes(x.name),'Existing binding missing: '+x.name);
receipt.candidate=id;receipt.phase='uploaded-not-promoted';receipt.candidateBindings=bindings.map(({name,type})=>({name,type}));receipt.bundleSHA256=createHash('sha256').update(await fs.readFile('dist-ask/server/entry.mjs')).digest('hex');await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}else if(phase==='promote'){
assert(receipt.candidate,'Upload first');const now=await state();assert.deepEqual(now.routes,before.routes,'Routes changed; inspect before promotion');assert.deepEqual(now.portal.versions,before.portal.versions,'Portal changed');assert.deepEqual(now.mcp.versions,before.mcp.versions,'MCP changed');assert.deepEqual(now.ask.versions,before.ask.versions,'Ask changed');
await api(root+name+'/deployments','POST',{strategy:'percentage',versions:[{version_id:receipt.candidate,percentage:100}]});
const after=await state();assert.deepEqual(after.routes,before.routes);assert.deepEqual(after.portal.versions,before.portal.versions);assert.deepEqual(after.mcp.versions,before.mcp.versions);
assert.equal(after.ask.versions[0].version_id,receipt.candidate);receipt.phase='promoted-awaiting-public-check';receipt.promotedAt=new Date().toISOString();receipt.afterRouteCount=after.routes.length;receipt.protectedUnchanged=true;await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}else if(phase==='rollback'){await api(root+name+'/deployments','POST',{strategy:'percentage',versions:before.ask.versions});console.log('Restored previous Ask deployment.');}
else throw new Error('Unknown release phase');
}
