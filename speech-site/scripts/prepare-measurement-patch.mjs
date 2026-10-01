// Publish only the reviewed measurement scripts over an already verified union.
// Pending page/common-shell source work must not enter this release accidentally.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root=process.cwd();
const [priorName,priorUploadName,nextName,nextUploadName]=process.argv.slice(2);
assert(priorName&&priorUploadName&&nextName&&nextUploadName,'Explicit prior/new stage and upload paths required');
function resolveInside(name){
  const target=path.resolve(root,name),relative=path.relative(root,target);
  assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative),'Paths must remain inside the project');
  return target;
}
const [prior,priorUpload,next,nextUpload]=[priorName,priorUploadName,nextName,nextUploadName].map(resolveInside);
assert(prior!==next&&priorUpload!==nextUpload);
await fs.access(path.join(prior,'index.html'));
await fs.access(path.join(priorUpload,'wrangler.jsonc'));
await fs.mkdir(next,{recursive:false});
await fs.cp(prior,next,{recursive:true});
await fs.mkdir(nextUpload,{recursive:false});
await fs.cp(priorUpload,nextUpload,{recursive:true});
const scripts=['speech-measurement.js','enrolment.js'];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const workerPath=path.join(nextUpload,'pinnacle-route-v12.mjs');
let worker=await fs.readFile(workerPath,'utf8');
const match=worker.match(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/);
assert(match,'Frozen Worker inventory required');
const inventory=JSON.parse(match[1]),changes=[];
for(const file of scripts){
  const publicPath='/pinnacle-pages-scripts/'+file,bytes=await fs.readFile(path.join(root,'public',publicPath));
  assert(publicPath in inventory,'Known script only');
  const previous=await fs.readFile(path.join(prior,publicPath));
  assert.equal(sha(previous).slice(0,16),inventory[publicPath],'Prior script matches frozen inventory');
  inventory[publicPath]=sha(bytes).slice(0,16);
  await fs.writeFile(path.join(next,publicPath),bytes);
  changes.push({path:publicPath,previousSha256:sha(previous),sha256:sha(bytes)});
}
// One reviewed accessibility correction discovered by the new standard audit.
// Derive it from frozen bytes, excluding all pending common-shell changes.
const cssEntries=Object.keys(inventory).filter(p=>p.endsWith('.css'));
let contrast;
for(const publicPath of cssEntries){
  const css=await fs.readFile(path.join(prior,publicPath),'utf8');
  const rule=css.match(/\.ot-final-guidance\{[^}]*\}/);
  if(!rule)continue;
  assert(!contrast,'One occupational stylesheet required');
  assert(rule[0].includes('opacity:.93'),'Frozen contrast defect required');
  const corrected=css.replace(rule[0],rule[0].replace('opacity:.93','opacity:1'));
  contrast={oldPath:publicPath,newPath:'/pinnacle-pages-assets/occupational-contrast-'+sha(corrected).slice(0,12)+'.css',css:corrected};
}
assert(contrast,'Occupational stylesheet found');
await fs.writeFile(path.join(next,contrast.newPath),contrast.css);
inventory[contrast.newPath]=sha(contrast.css).slice(0,16);
const htmlPaths=Object.keys(inventory).filter(p=>p.startsWith('/pinnacle-pages-html/')&&p.endsWith('.html'));
let correctedHtmlPath;
for(const publicPath of htmlPaths){
  const html=await fs.readFile(path.join(prior,publicPath),'utf8');
  if(!html.includes(contrast.oldPath))continue;
  assert(!correctedHtmlPath,'Stylesheet belongs only to the occupational page');
  correctedHtmlPath=publicPath;
  const corrected=html.replaceAll(contrast.oldPath,contrast.newPath);
  await fs.writeFile(path.join(next,publicPath),corrected);
  inventory[publicPath]=sha(corrected).slice(0,16);
}
assert(correctedHtmlPath);
changes.push({path:correctedHtmlPath,change:'Only stylesheet URL changed; all content/header/footer retained'},{path:contrast.newPath,change:'Only .ot-final-guidance opacity .93 -> 1',sha256:sha(contrast.css)});
worker=worker.replace(match[0],'const SPEECH_INVENTORY='+JSON.stringify(inventory)+';');
await fs.writeFile(workerPath,worker);
const config=JSON.parse(await fs.readFile(path.join(nextUpload,'wrangler.jsonc'),'utf8'));
config.assets.directory=path.relative(nextUpload,next).replaceAll('\\','/');
await fs.writeFile(path.join(nextUpload,'wrangler.jsonc'),JSON.stringify(config,null,2)+'\n');

async function files(dir,prefix=''){
  const out=[];
  for(const item of await fs.readdir(dir,{withFileTypes:true})){
    const relative=path.join(prefix,item.name);
    if(item.isDirectory())out.push(...await files(path.join(dir,item.name),relative));
    else out.push(relative);
  }
  return out.sort();
}
const before=await files(prior),after=await files(next);
assert.deepEqual(after.filter(f=>f!==contrast.newPath.slice(1).split('/').join(path.sep)),before,'Complete prior union file set retained');
const allowed=new Set([...scripts.map(file=>path.join('pinnacle-pages-scripts',file)),correctedHtmlPath.slice(1).split('/').join(path.sep)]);
let unchanged=0;
for(const file of before){
  if(allowed.has(file))continue;
  assert.equal(sha(await fs.readFile(path.join(next,file))),sha(await fs.readFile(path.join(prior,file))),file+' retained');
  unchanged++;
}
for(const file of ['discovery-handler.mjs','speech-handler.mjs','speech-enquiry-handler.mjs','centre-facilities.mjs','enrolment-handler.mjs']){
  assert.equal(sha(await fs.readFile(path.join(nextUpload,file))),sha(await fs.readFile(path.join(priorUpload,file))),file+' runtime retained');
}
const receipt={at:new Date().toISOString(),prior:priorName,stage:nextName,upload:nextUploadName,changed:changes,unchangedUnionFiles:unchanged,htmlContentAndVerifyPreserved:true,runtimeModulesPreserved:true,workerChange:'Two script hashes, occupational stylesheet link hash and new contrast stylesheet only',sourceShellChangesExcluded:true};
await fs.writeFile('deployment/measurement-v150-staged-20261001.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
