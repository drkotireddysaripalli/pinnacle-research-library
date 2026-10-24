import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {sha,cssPath,assertDelta} from './centres-css-patch.mjs';
const out=path.resolve(process.argv[2]),site=path.resolve(import.meta.dirname,'..');
assert(!(await fs.stat(path.join(out,'release.json')).catch(()=>null)),'Preserve existing release checkpoint');
const manifest=JSON.parse(await fs.readFile(path.join(out,'preimage/manifest.json'),'utf8')),hashes={},changed={};
const replacements={};for(const n of ['enrolment-assets.mjs','speech-handler.mjs'])replacements[n]=await fs.readFile(path.join(site,'deployment',n),'utf8');
const before={};for(const n of Object.keys(replacements))before[n]=await fs.readFile(path.join(out,'preimage/pinnacle-verify-route',n),'utf8');
const guard=assertDelta(before,replacements,await fs.readFile(path.join(site,'public'+cssPath)));
for(const w of manifest.workers){hashes[w.name]={};changed[w.name]=[];const dir=path.join(out,'candidate',w.name);await fs.mkdir(dir,{recursive:true});
 for(const m of w.modules){let b=await fs.readFile(path.join(out,'preimage',w.name,m.name));assert.equal(sha(b),m.sha256);
 if(w.name==='pinnacle-verify-route'&&Object.hasOwn(replacements,m.name)){b=Buffer.from(replacements[m.name]);changed[w.name].push(m.name);}
 await fs.writeFile(path.join(dir,m.name),b,{mode:0o600});hashes[w.name][m.name]=sha(b);}}
await fs.writeFile(path.join(out,'candidate-proof.json'),JSON.stringify({at:new Date().toISOString(),guard,changed,hashes},null,2)+'\n',{mode:0o600});console.log(JSON.stringify({guard,changed}));
