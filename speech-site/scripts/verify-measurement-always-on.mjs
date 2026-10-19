import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';

const root=process.cwd(),parent=path.dirname(root);
const evidenceDir=path.resolve(process.env.MEASUREMENT_ALWAYS_ON_EVIDENCE_DIR||path.join(parent,'artifacts/measurement-always-on-20261019/final'));
const skipBuild=process.argv.includes('--no-build');
const resume=process.argv.includes('--resume');
await fs.mkdir(evidenceDir,{recursive:true});
const stages=[
 ...(!skipBuild?[{name:'production-build',cwd:root,command:'npm',args:['run','build'],env:{PINNACLE_RELEASE:'production'}},
  {name:'verify-build',cwd:path.join(parent,'verify-site'),command:process.execPath,args:['scripts/build-content.cjs']},
  {name:'helpline-build',cwd:path.join(parent,'helpline-site'),command:process.execPath,args:['build.mjs']}]:[]),
 {name:'unit-tests',cwd:root,command:'npm',args:['run','test:unit']},
 {name:'measurement-integration',cwd:root,command:process.execPath,args:['--test','scripts/test-homepage-measurement-transform.mjs','scripts/test-book-attribution.mjs']},
 {name:'helpline-acquisition',cwd:root,command:process.execPath,args:['--test','scripts/test-helpline-acquisition.mjs']},
 {name:'shared-assets',cwd:root,command:'npm',args:['run','test:shared-assets-repair']},
 {name:'helpline-tests',cwd:path.join(parent,'helpline-site'),command:process.execPath,args:['phone-analytics-tests.mjs']},
 {name:'types',cwd:root,command:'npm',args:['run','check:types']},
 {name:'runtime-scan',cwd:root,command:process.execPath,args:['scripts/check-measurement-always-on-runtime.mjs']},
 {name:'browser-contract',cwd:root,command:process.execPath,args:['scripts/test-measurement-always-on-browser.mjs']},
 {name:'diff-check',cwd:parent,command:'git',args:['diff','--check','--','.']}
];
let receipt={schemaVersion:1,startedAt:new Date().toISOString(),root,evidenceDir,skipBuild,stages:[]};
if(resume){
 try{
  const previous=JSON.parse(await fs.readFile(path.join(evidenceDir,'receipt.json'),'utf8'));
  const successful=new Map((previous.stages||[]).filter(stage=>stage.exitCode===0).map(stage=>[stage.name,stage]));
  receipt={...previous,resumedAt:new Date().toISOString(),skipBuild,stages:stages.flatMap(stage=>successful.has(stage.name)?[successful.get(stage.name)]:[])};
 }catch{}
}
const run=stage=>new Promise(resolve=>{
 const startedAt=new Date().toISOString(),logPath=path.join(evidenceDir,stage.name+'.log'),chunks=[];
 const child=spawn(stage.command,stage.args,{cwd:stage.cwd,env:{...process.env,...stage.env},stdio:['ignore','pipe','pipe']});
 const record=chunk=>{chunks.push(chunk);process.stdout.write(chunk);};child.stdout.on('data',record);child.stderr.on('data',record);child.on('error',error=>record(Buffer.from((error.stack||error)+'\n')));
 child.on('close',async(exitCode,signal)=>{await fs.writeFile(logPath,Buffer.concat(chunks));resolve({name:stage.name,command:[stage.command,...stage.args].join(' '),cwd:stage.cwd,startedAt,completedAt:new Date().toISOString(),exitCode,signal,logPath});});
});
for(const stage of stages){if(receipt.stages.some(result=>result.name===stage.name&&result.exitCode===0))continue;const result=await run(stage);receipt.stages=receipt.stages.filter(existing=>existing.name!==stage.name);receipt.stages.push(result);await fs.writeFile(path.join(evidenceDir,'checkpoint.json'),JSON.stringify(receipt,null,2)+'\n');if(result.exitCode!==0){Object.assign(receipt,{completedAt:new Date().toISOString(),passed:false,failedStage:result.name});await fs.writeFile(path.join(evidenceDir,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');process.exit(result.exitCode||1);}}
Object.assign(receipt,{completedAt:new Date().toISOString(),passed:true,failedStage:null});await fs.writeFile(path.join(evidenceDir,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({passed:true,evidenceDir,stages:receipt.stages.map(stage=>stage.name)}));
