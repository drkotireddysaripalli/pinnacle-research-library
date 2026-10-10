// Deterministic local GA4 release verification. The command owns its lock,
// fingerprints its relevant inputs and stores complete logs/checkpoints on disk.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';

const site=path.resolve(import.meta.dirname,'..');
const evidence=path.join(site,'ask-private/ga4-shared-release-20261010/execution');
const checkpoint=path.join(evidence,'checkpoint.json');
const lock=path.join(evidence,'lock.json');
await fs.mkdir(evidence,{recursive:true});
try{await fs.writeFile(lock,JSON.stringify({pid:process.pid,at:new Date().toISOString()}),{flag:'wx'});}catch{throw Error('GA4 verification lock exists; reconcile its recorded process before retrying.');}
let record;try{record=JSON.parse(await fs.readFile(checkpoint));}catch{record={schemaVersion:1,stages:{}};}
const sha=value=>createHash('sha256').update(value).digest('hex');
const inputs=['public/pinnacle-pages-scripts/speech-measurement.js','scripts/test-measurement.mjs','scripts/test-enrolment.mjs','scripts/test-enrolment-receipt.mjs','src/pages/index.astro','src/components/SpeechPage.astro','src/layouts/PageLayout.astro','src/components/SiteFooter.astro','astro.config.mjs','package.json','package-lock.json'];
async function fingerprint(){const files=[];for(const name of inputs){try{files.push([name,sha(await fs.readFile(path.join(site,name)))]);}catch{files.push([name,'absent']);}}return sha(JSON.stringify({files,node:process.version,platform:process.platform,release:'production',acceptance:'ga4-shared-v1-20261010'}));}
async function run(name,args){const key=sha(JSON.stringify({fingerprint:await fingerprint(),args})),prior=record.stages[name];if(prior?.status==='passed'&&prior.key===key){console.log(JSON.stringify({stage:name,status:'reused',log:prior.log}));return;}
 const log=path.join(evidence,name+'.log'),startedAt=new Date().toISOString();record.stages[name]={key,status:'running',startedAt,log,args};await fs.writeFile(checkpoint,JSON.stringify(record,null,2));const output=await fs.open(log,'a');await output.write('\n'+JSON.stringify({startedAt,key,args})+'\n');let code;
 try{code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{cwd:site,env:{...process.env,PINNACLE_RELEASE:'production'},stdio:['ignore',output.fd,output.fd],windowsHide:true});child.once('error',reject);child.once('exit',resolve);});}finally{await output.close();}
 Object.assign(record.stages[name],{status:code===0?'passed':'failed',exitCode:code,endedAt:new Date().toISOString()});await fs.writeFile(checkpoint,JSON.stringify(record,null,2));console.log(JSON.stringify({stage:name,status:record.stages[name].status,log}));assert.equal(code,0,'Failed stage '+name+'; see '+log);
}
try{
 await run('production-build',['node_modules/astro/bin/astro.mjs','build']);
 await run('measurement-contracts',['--test','scripts/test-measurement.mjs','scripts/test-enrolment.mjs','scripts/test-enrolment-receipt.mjs']);
 record.status='verified-local';record.finishedAt=new Date().toISOString();record.fingerprint=await fingerprint();record.productionCustomerEnquiries=0;record.analyticsNetworkHits=0;await fs.writeFile(checkpoint,JSON.stringify(record,null,2));console.log(JSON.stringify({status:record.status,checkpoint,productionCustomerEnquiries:0,analyticsNetworkHits:0}));
}catch(error){record.status='failed';record.failure=error.message;await fs.writeFile(checkpoint,JSON.stringify(record,null,2));console.error(error.message);process.exitCode=1;}finally{await fs.unlink(lock);}
