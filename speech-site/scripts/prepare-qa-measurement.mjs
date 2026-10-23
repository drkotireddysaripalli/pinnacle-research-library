import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {sha,patchModules,changedModules} from './qa-measurement-patch.mjs';
const out=path.resolve(process.argv[2]),baseline=process.argv[3];assert(/^[a-f0-9]{40}$/.test(baseline||''));
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),manifest=JSON.parse(await fs.readFile(out+'/preimage/manifest.json','utf8'));
assert(!(await fs.stat(out+'/candidate-proof.json').catch(()=>null)),'Reuse the existing candidate');
const files={'speech-measurement.js':'speech-site/public/pinnacle-pages-scripts/speech-measurement.js','protection-consumer.mjs':'speech-site/public/pinnacle-pages-scripts/protection-consumer.mjs','google-ads-call-consent.mjs':'speech-site/src/lib/google-ads-call-consent.mjs','phone-analytics.js':'helpline-site/phone-analytics.js'};
const oldSource={},newSource={};for(const [n,f]of Object.entries(files)){oldSource[n]=execFileSync('git',['show',baseline+':'+f],{cwd:repo,encoding:'utf8',maxBuffer:16e6});newSource[n]=await fs.readFile(repo+'/'+f,'utf8');}
const oldCallModule=execFileSync('git',['show',baseline+':speech-site/deployment/public-ad-call.mjs'],{cwd:repo,encoding:'utf8',maxBuffer:16e6});
const newCallModule=await fs.readFile(site+'/deployment/public-ad-call.mjs','utf8'),newLegacy=await fs.readFile(site+'/deployment/legacy-measurement.runtime.mjs','utf8');
const modules={};for(const w of manifest.workers){modules[w.name]={};for(const m of w.modules){const b=await fs.readFile(out+'/preimage/'+w.name+'/'+m.name);assert.equal(sha(b),m.sha256);modules[w.name][m.name]=b;}}
const candidate=patchModules(modules,{oldSource,newSource,oldCallModule,newCallModule,newLegacy}),changed={},hashes={};
assert.equal(candidate['pinnacle-verify-route']['book-attribution-assets.mjs'].toString(),await fs.readFile(site+'/deployment/book-attribution-assets.mjs','utf8'));
assert.equal(candidate['pinnacle-helpline']['worker.mjs'].toString(),await fs.readFile(repo+'/helpline-site/worker.mjs','utf8'),'Full helpline build must equal exact inline-script/CSP replacement');
for(const [w,ms]of Object.entries(candidate)){changed[w]=[];hashes[w]={};await fs.mkdir(out+'/candidate/'+w,{recursive:true});for(const[n,b]of Object.entries(ms)){if(sha(b)!==sha(modules[w][n]))changed[w].push(n);hashes[w][n]=sha(b);await fs.writeFile(out+'/candidate/'+w+'/'+n,b,{mode:0o600});}changed[w].sort();}
assert.deepEqual(changed,changedModules);
await fs.writeFile(out+'/candidate-proof.json',JSON.stringify({at:new Date().toISOString(),baseline,changed,hashes,sourceHashes:Object.fromEntries(Object.entries(newSource).map(([n,b])=>[n,sha(b)]))},null,2)+'\n',{mode:0o600});
console.log(JSON.stringify({changed,sourceHashes:Object.fromEntries(Object.entries(newSource).map(([n,b])=>[n,sha(b)]))}));
