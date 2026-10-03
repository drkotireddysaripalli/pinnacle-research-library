// Adds only the already-authorised Ask secrets to an uploaded, unpromoted version.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const releaseId=process.argv[2];
assert(/^[a-z0-9][a-z0-9-]{5,90}$/.test(releaseId||''),'Pass the prepared release ID');
const dir='ask-private/'+releaseId,receiptPath='deployment/'+releaseId+'.json';
const receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));
assert.equal(receipt.phase,'uploaded-not-promoted');
const account='862998def1cd610fdb86b8e5c1d6ed4d',name='pinnacle-ask';
const token=(await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8')).match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
assert(token);
async function api(suffix){const r=await fetch('https://api.cloudflare.com/client/v4/accounts/'+account+'/workers/'+suffix,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});const data=await r.json();assert(r.ok&&data.success,'Cloudflare staging read failed: '+r.status);return data.result;}
const original=await api('scripts/'+name+'/versions/'+receipt.candidate);
const latest=await api('workers/'+name+'/versions/latest');
assert.equal(latest.id,receipt.candidate,'Latest version changed; do not attach secrets to another version');
const wati=JSON.parse(await fs.readFile('ask-private/wati-existing-access.json','utf8'));
const supabase=JSON.parse(await fs.readFile('ask-private/supabase-existing-access.json','utf8'));
const hook=JSON.parse(await fs.readFile('ask-private/supabase-hook-access.json','utf8'));
assert.equal(wati.endpoint,'https://live-mt-server.wati.io/531');
assert.equal(supabase.url,'https://lyjwsaiqvgwyautowhlx.supabase.co');
assert.equal(hook.endpoint,'https://pinnacleblooms.org/ask/auth/whatsapp-hook');
const secrets={WATI_API_TOKEN:wati.token,ASK_AUTH_PUBLISHABLE_KEY:supabase.publishable,ASK_AUTH_SECRET_KEY:supabase.secret,SUPABASE_SMS_HOOK_SECRET:hook.secret};
for(const value of Object.values(secrets))assert(typeof value==='string'&&value.length>20,'Required private credential is missing');
const bundle=dir+'/secrets-upload.json';await fs.writeFile(bundle,JSON.stringify(secrets));
let output;
try{output=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','versions','secret','bulk',bundle,'--name',name,'--config','dist-ask/server/wrangler.json','--message',releaseId+' signed delivery'],{windowsHide:true,env:{...process.env,CLOUDFLARE_API_TOKEN:token,CLOUDFLARE_ACCOUNT_ID:account},stdio:['ignore','pipe','pipe']});let s='';child.stdout.on('data',c=>s+=c);child.stderr.on('data',c=>s+=c);child.on('error',reject);child.on('close',async code=>{await fs.writeFile(dir+'/secret-stage.log',s);code===0?resolve(s):reject(new Error('Secret staging failed; inspect the private log'));});});}finally{await fs.unlink(bundle);}
const id=output.match(/Created version\s+([0-9a-f-]{36})\s+with\s+\d+\s+secrets/i)?.[1];assert(id,'New version ID absent; inspect the log before retrying');
const version=await api('scripts/'+name+'/versions/'+id);
await fs.writeFile(dir+'/secret-candidate.json',JSON.stringify(version));
const expected=original.resources?.bindings||[],actual=version.resources?.bindings||[];
for(const binding of expected){if(Object.hasOwn(secrets,binding.name))continue;assert.deepEqual(actual.find(x=>x.name===binding.name),binding,'Binding changed: '+binding.name);}
for(const name of Object.keys(secrets))assert.equal(actual.find(x=>x.name===name)?.type,'secret_text','Secret binding missing: '+name);
assert.deepEqual(version.resources?.script,original.resources?.script,'Code metadata changed while staging secrets');
assert.deepEqual(version.resources?.assets,original.resources?.assets,'Assets changed while staging secrets');
receipt.codeCandidate=receipt.candidate;receipt.candidate=id;receipt.secretNames=Object.keys(secrets);receipt.secretBindingsVerified=true;receipt.candidateBindings=actual.map(({name,type})=>({name,type}));
receipt.rollbackNote='After secret changes, recover by uploading the known-good code/assets with identity flags false and current secrets; do not force a prior secret snapshot.';
await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));
console.log(JSON.stringify({phase:'secrets-staged-not-promoted',candidate:id,secretNames:receipt.secretNames,codeAssetsBindingsPreserved:true}));
