import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {sha,cssPath,oldCssPath,cssSHA,fixtureSHA,assertDelta} from './centres-css-patch.mjs';
const out=path.resolve(process.argv[2]),site=path.resolve(import.meta.dirname,'..'),worker='pinnacle-verify-route';
const proof=JSON.parse(await fs.readFile(path.join(out,'candidate-proof.json'),'utf8'));
for(const [w,modules]of Object.entries(proof.hashes))for(const [n,h]of Object.entries(modules))assert.equal(sha(await fs.readFile(path.join(out,'candidate',w,n))),h);
const before={},after={};for(const n of ['enrolment-assets.mjs','speech-handler.mjs']){before[n]=await fs.readFile(path.join(out,'preimage',worker,n),'utf8');after[n]=await fs.readFile(path.join(out,'candidate',worker,n),'utf8');}
for(const [n,text] of Object.entries(after))assert.equal(text,await fs.readFile(path.join(site,'deployment',n),'utf8'),'Candidate must match current tracked source: '+n);
const css=await fs.readFile(path.join(site,'public'+cssPath));assertDelta(before,after,css);
const html=await fs.readFile(path.join(out,'P8-PUBLIC/centres.html'));assert.equal(sha(html),fixtureSHA);
const dir=path.join(out,'preservation');await fs.mkdir(dir,{recursive:true});
for(const n of Object.keys(before)){await fs.writeFile(path.join(dir,'BASELINE-'+n),before[n]);await fs.writeFile(path.join(dir,n),after[n]);}
await fs.writeFile(path.join(dir,'centers.DUTsoQ8n.css'),css);
await fs.writeFile(path.join(dir,'MANIFEST.json'),JSON.stringify({sourceRoot:path.join(out,'preimage',worker),sourceFiles:Object.fromEntries(Object.entries(before).map(([n,s])=>[n,sha(s)])),stylesheet:{oldPath:oldCssPath,newPath:cssPath,sha256:cssSHA},fixture:{sha256:fixtureSHA}}));
const log=execFileSync(process.execPath,['--test',path.join(site,'scripts/centres-css-preservation.mjs')],{env:{...process.env,PINNACLE_CENTRES_TEST_DIR:dir},encoding:'utf8'});process.stdout.write(log);
const result=JSON.parse(await fs.readFile(path.join(dir,'TEST-RESULT.json'),'utf8'));assert.equal(result.checksPassed,8);assert.equal(result.state,'PASS');
await fs.writeFile(path.join(out,'runtime-preservation.json'),JSON.stringify(result,null,2)+'\n');
