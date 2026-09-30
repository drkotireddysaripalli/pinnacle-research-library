import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const keepReleaseCurrent=process.argv.includes('--keep-release-current');
const removed=[];

function insideRoot(target){
  const relative=path.relative(root,target);
  return relative && !relative.startsWith('..')&&!path.isAbsolute(relative);
}
async function remove(target){
  const absolute=path.resolve(target);
  if(!insideRoot(absolute))throw new Error(`Refusing cleanup outside project: ${absolute}`);
  await fs.rm(absolute,{recursive:true,force:true,maxRetries:10,retryDelay:100});
  removed.push(path.relative(root,absolute).replaceAll('\\','/'));
}

for(const name of ['.astro','dist'])await remove(path.join(root,name));
for(const item of await fs.readdir(root,{withFileTypes:true})){
  if(item.isDirectory()&&item.name.startsWith('release-')&&!(keepReleaseCurrent&&item.name==='release-current'))await remove(path.join(root,item.name));
  if(item.isDirectory()&&(item.name.startsWith('.worker-upload-')||item.name.startsWith('dryrun-worker-')||item.name.startsWith('dryrun-autism-')))await remove(path.join(root,item.name));
  if(item.isFile()&&(item.name.startsWith('Pinnacle-')&&item.name.endsWith('.zip')||item.name==='BEFORE-REVIEW-index.astro.txt'))await remove(path.join(root,item.name));
}

const deployment=path.join(root,'deployment');
for(const item of await fs.readdir(deployment,{withFileTypes:true})){
  const generatedDirectory=item.isDirectory()&&(item.name==='.wrangler'||item.name.startsWith('dryrun-enrolment-')||item.name.startsWith('dryrun-production-config-')||item.name.startsWith('live-enrolment-upload-')||item.name.startsWith('visual-upload-worker-'));
  const generatedFile=item.isFile()&&(item.name==='production-speech.html'||item.name.startsWith('current-origin-enrolment-')||item.name.startsWith('enrolment-api-test-')||item.name.startsWith('wrangler-enrolment-live-')||item.name==='wrangler-enrolment-visual-20260929.jsonc');
  if(generatedDirectory||generatedFile)await remove(path.join(deployment,item.name));
}

for(const directory of [path.join(root,'scripts','__pycache__')])await remove(directory);
const reviews=path.join(root,'reviews');
for(const item of await fs.readdir(reviews,{withFileTypes:true}).catch(()=>[]))if(item.isFile()&&item.name.endsWith('.log'))await remove(path.join(reviews,item.name));

console.log(JSON.stringify({removed:removed.length,keepReleaseCurrent,paths:removed},null,2));
