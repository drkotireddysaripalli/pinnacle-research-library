import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {sha} from './qa-measurement-patch.mjs';import {patchAsset} from './qa-provenance-patch.mjs';
const out=path.resolve(process.argv[2]),baseline=process.argv[3];assert(/^[a-f0-9]{40}$/.test(baseline||''));
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),manifest=JSON.parse(await fs.readFile(out+'/preimage/manifest.json','utf8'));
assert(!(await fs.stat(out+'/candidate-proof.json').catch(()=>null)),'Reuse prepared candidate');
const file='speech-site/public/pinnacle-pages-scripts/speech-measurement.js',old=execFileSync('git',['show',baseline+':'+file],{cwd:repo,encoding:'utf8'}),source=await fs.readFile(repo+'/'+file,'utf8');
const hashes={},changed={};for(const w of manifest.workers){hashes[w.name]={};changed[w.name]=[];await fs.mkdir(out+'/candidate/'+w.name,{recursive:true});for(const m of w.modules){
 let b=await fs.readFile(out+'/preimage/'+w.name+'/'+m.name);assert.equal(sha(b),m.sha256);
 if(w.name==='pinnacle-verify-route'&&m.name==='shared-clearance-runtime.mjs')b=Buffer.from(patchAsset(b.toString(),'/pinnacle-pages-scripts/speech-measurement.js',old,source));
 if(w.name==='pinnacle-verify-route'&&m.name==='book-attribution-assets.mjs'){
  const text=b.toString(),re=/export const attributionScripts=(\{[^\n]+\});/,match=text.match(re);assert(match);const records=JSON.parse(match[1]);
  for(const key of ['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js']){assert.equal(records[key].text,old);assert.equal(records[key].sha256,sha(old));records[key]={...records[key],text:source,sha256:sha(source)};}
  b=Buffer.from(text.replace(re,()=> 'export const attributionScripts='+JSON.stringify(records)+';'));
  assert.equal(b.toString(),await fs.readFile(site+'/deployment/book-attribution-assets.mjs','utf8'));
 }
 if(sha(b)!==m.sha256)changed[w.name].push(m.name);hashes[w.name][m.name]=sha(b);await fs.writeFile(out+'/candidate/'+w.name+'/'+m.name,b,{mode:0o600});
 }}
assert.deepEqual(changed,{'pbn-planetscale':[],'pinnacle-verify-route':['book-attribution-assets.mjs','shared-clearance-runtime.mjs'],'pinnacle-legacy-social-metadata':[],'pinnacle-helpline':[],'pinnacle-google-ads-call-measurement':[]});
await fs.writeFile(out+'/candidate-proof.json',JSON.stringify({at:new Date().toISOString(),baseline,changed,hashes,sourceSHA256:sha(source)},null,2)+'\n',{mode:0o600});console.log(JSON.stringify({changed,sourceSHA256:sha(source)}));
