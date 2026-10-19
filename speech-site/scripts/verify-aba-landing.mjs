import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const value=(name,fallback)=>{const i=process.argv.indexOf(name);return i>=0&&process.argv[i+1]?process.argv[i+1]:fallback;};
const stamp=new Date().toISOString().replaceAll(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const output=path.resolve(root,value('--output',`ask-private/aba-landing-verify-${stamp}`));
const port=Number(value('--port',process.env.ABA_VERIFY_PORT||'4366'));
const origin=`http://127.0.0.1:${port}`;
const npm=process.platform==='win32'?'npm.cmd':'npm';
const astro=path.join(root,'node_modules','.bin',process.platform==='win32'?'astro.cmd':'astro');
await fs.mkdir(output,{recursive:true});

const steps=[];
const run=(name,command,args,options={})=>new Promise((resolve,reject)=>{
  const started=new Date().toISOString();
  const logPath=path.join(output,`${name}.log`);
  const chunks=[];
  const child=spawn(command,args,{cwd:root,env:{...process.env,...options.env},stdio:['ignore','pipe','pipe']});
  const collect=chunk=>{chunks.push(chunk);process.stdout.write(chunk);};
  child.stdout.on('data',collect);child.stderr.on('data',collect);
  child.once('error',reject);
  child.once('close',async code=>{
    await fs.writeFile(logPath,Buffer.concat(chunks));
    const result={name,started,finished:new Date().toISOString(),exitCode:code,log:path.relative(root,logPath)};
    steps.push(result);
    if(code===0)resolve(result);else reject(Object.assign(new Error(`${name} failed with exit code ${code}`),{result}));
  });
});

let preview;
let previewError;
let previewLog=[];
let failure=null;
try{
  await run('typecheck',npm,['run','check:types']);
  await run('astro-build',astro,['build'],{env:{PINNACLE_RELEASE:'production'}});
  await run('og-assets',process.execPath,['scripts/apply-og-replacements.mjs']);
  await run('aba-machine',process.execPath,['scripts/build-aba-machine.mjs']);
  await run('aba-release-assets',process.execPath,['scripts/build-aba-release.mjs']);
  await run('aba-build-contract',process.execPath,['scripts/check-aba-build.mjs','--output',path.join(output,'build-contract.json')]);
  await run('aba-unit',process.execPath,['--test','scripts/test-aba-release.mjs']);
  preview=spawn(process.execPath,['scripts/serve-quality-preview.mjs'],{cwd:root,env:{...process.env,QUALITY_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']});
  const collect=chunk=>{previewLog.push(chunk);process.stdout.write(chunk);};
  preview.stdout.on('data',collect);preview.stderr.on('data',collect);preview.once('error',error=>{previewError=error;});
  const deadline=Date.now()+30000;
  while(true){
    if(previewError)throw previewError;if(preview.exitCode!==null)throw new Error('The isolated quality preview exited before it was ready.');
    try{const response=await fetch(origin+'/best-aba-therapy-center-india-proven-improvement-rate');if(response.ok)break;}catch{}
    if(Date.now()>deadline)throw new Error(`Preview did not become ready at ${origin}`);
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  await run('aba-responsive',process.execPath,['scripts/check-aba-page.mjs',origin,path.join(output,'responsive')]);
  await run('aba-lighthouse',process.execPath,['scripts/check-speed.mjs','aba','--enforce','--origin',origin,'--output',path.join(output,'lighthouse')]);
}catch(error){failure=error;process.exitCode=1;
}finally{
  if(preview&&preview.exitCode===null){preview.kill('SIGTERM');await Promise.race([new Promise(resolve=>preview.once('close',resolve)),new Promise(resolve=>setTimeout(resolve,5000))]);if(preview.exitCode===null)preview.kill('SIGKILL');}
  await fs.writeFile(path.join(output,'preview.log'),Buffer.concat(previewLog));
  const files=['src/data/aba-content.ts','src/components/AbaPage.astro','src/components/HeroSlider.astro','src/assets/aba-social-life-first-20260930.png','scripts/check-aba-page.mjs','scripts/check-aba-build.mjs','scripts/build-aba-machine.mjs','scripts/check-speed.mjs','scripts/serve-quality-preview.mjs','scripts/verify-aba-landing.mjs'];
  const hashes={};for(const file of files){const bytes=await fs.readFile(path.join(root,file));hashes[file]=crypto.createHash('sha256').update(bytes).digest('hex');}
  const checkpoint={status:failure?'failed':'passed',at:new Date().toISOString(),origin,output:path.relative(root,output),steps,sourceHashes:hashes,failure:failure?String(failure.stack||failure):null};
  await fs.writeFile(path.join(output,'checkpoint.json'),JSON.stringify(checkpoint,null,2)+'\n');
  console.log(JSON.stringify({status:checkpoint.status,evidence:checkpoint.output,steps:steps.map(({name,exitCode})=>({name,exitCode}))}));
}
