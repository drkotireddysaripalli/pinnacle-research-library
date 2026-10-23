import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {sha,patchSpeechNav,assertSourceDelta} from './speech-nav-label-patch.mjs';
const out=path.resolve(process.argv[2]),baseline=process.argv[3];assert(out&&/^[a-f0-9]{40}$/.test(baseline||''));
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),manifest=JSON.parse(await fs.readFile(out+'/preimage/manifest.json','utf8'));
assert(!(await fs.stat(out+'/candidate-proof.json').catch(()=>null)),'Reuse prepared candidate');
const old=execFileSync('git',['show',baseline+':speech-site/deployment/centre-operating-holds.mjs'],{cwd:repo,encoding:'utf8'});
assertSourceDelta(old,await fs.readFile(site+'/deployment/centre-operating-holds.mjs','utf8'));
const hashes={},changed={};for(const w of manifest.workers){hashes[w.name]={};changed[w.name]=[];await fs.mkdir(out+'/candidate/'+w.name,{recursive:true});for(const m of w.modules){let b=await fs.readFile(out+'/preimage/'+w.name+'/'+m.name);assert.equal(sha(b),m.sha256);if(w.name==='pinnacle-verify-route'&&m.name==='shared-clearance-runtime.mjs'){b=Buffer.from(patchSpeechNav(b.toString()));changed[w.name].push(m.name);}await fs.writeFile(out+'/candidate/'+w.name+'/'+m.name,b,{mode:0o600});hashes[w.name][m.name]=sha(b);}}
assert.deepEqual(changed,{'pbn-planetscale':[],'pinnacle-verify-route':['shared-clearance-runtime.mjs'],'pinnacle-legacy-social-metadata':[],'pinnacle-helpline':[]});
await fs.writeFile(out+'/candidate-proof.json',JSON.stringify({at:new Date().toISOString(),baseline,changed,hashes},null,2)+'\n',{mode:0o600});console.log(JSON.stringify({changed}));
