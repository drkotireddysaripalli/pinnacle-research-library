// Hosted workflow's local gates, through the existing candidate-guarded launcher.
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';
import {activeQualityPage,pageContracts} from '../speech-site/scripts/page-quality-contracts.mjs';
import {requireCandidate,browserTestFingerprint} from './candidate.mjs';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const site=path.join(root,'speech-site'),launcher=path.join(root,'build-window/workspace.mjs');
const page=process.argv[2]||activeQualityPage;
if(!pageContracts[page])throw Error('Unknown registered page: '+page);
const port=process.env.PINNACLE_PREVIEW_PORT||'4348';
if(!/^\d+$/.test(port)||Number(port)<1024||Number(port)>65535)throw Error('Invalid loopback port');
const origin='http://127.0.0.1:'+port;
const env={...process.env,PINNACLE_PREVIEW_PORT:port,PINNACLE_RELEASE:'production'};
delete env.PORTAL_ORIGIN;
const source=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'});
if(source.status!==0)throw Error('Git source unavailable');
const results=path.join(root,'build-window/results');fs.mkdirSync(results,{recursive:true});
const toolFiles=['build-window/ci-local.mjs','build-window/ci-focused.mjs','build-window/workspace.mjs','build-window/candidate.mjs','build-window/frog-settings.mjs','build-window/frog-local.mjs','build-window/.node-version','build-window/.npm-version','.github/workflows/portal-quality.yml'];
const toolHashes=()=>Object.fromEntries(toolFiles.map(file=>[file,createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
const receiptPath=path.join(results,'ci-local-receipt.json');
const receipt={source:source.stdout.trim(),page,startedAt:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,previewURL:origin,stages:[],status:'running',notEstablished:['Trusted exact-source cloud BVT','Physical devices','Private Worker runtime/full production union','Public release','Accepted lead/person URL/Slack member opening','Business outcomes']};
receipt.toolHashesBefore=toolHashes();receipt.browserTestFingerprintBefore=browserTestFingerprint(root);
const save=()=>fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');save();
function run(label,args,cwd=root,childEnv=env){
  if(interrupted)throw Error('Interrupted: '+interrupted);
  const stage={label,args,startedAt:new Date().toISOString(),status:'running'};receipt.stages.push(stage);save();
  console.log('\nRunning '+label);
  const result=spawnSync(process.execPath,args,{cwd,stdio:'inherit',env:childEnv});
  Object.assign(stage,{completedAt:new Date().toISOString(),exitCode:result.status,status:!result.error&&result.status===0?'passed':'failed'});save();
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(label+' failed; inspect its receipt before rerunning');
  if(label==='centre-contract'){
    receipt.centreValidationReceiptSha256=createHash('sha256').update(fs.readFileSync(path.join(site,'deployment/centre-network-contract-20261007.json'))).digest('hex');save();
  }
}
const workspace=(action,selected)=>run(action,[launcher,action,...(selected?[selected]:[])]);
let preview,previewOutput,interrupted;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{interrupted=signal;preview?.kill(signal);});
try{
  for(const action of ['types','build','unit','centre-contract','contracts','evidence-contract','ask-auth','ask-content','ci-focused','ask-build']){
    if(interrupted)throw Error('Interrupted: '+interrupted);workspace(action);
  }
  const contract=pageContracts[page];
  if(contract.static)run('page contract',[contract.static],site,{...env,PAGE_PATH:contract.path,CANONICAL_PATH:contract.canonical});
  await new Promise((resolve,reject)=>{const socket=net.createServer();socket.once('error',reject);socket.listen(Number(port),'127.0.0.1',()=>socket.close(resolve));});
  previewOutput=fs.openSync(path.join(results,'ci-local-preview.log'),'w');
  preview=spawn(process.execPath,[launcher,'preview'],{cwd:root,env,stdio:['ignore',previewOutput,previewOutput]});
  let previewError;preview.on('error',error=>{previewError=error;});
  let ready=false;
  for(let attempt=0;attempt<30;attempt++){
    if(interrupted)throw Error('Interrupted: '+interrupted);
    if(previewError)throw previewError;
    if(preview.exitCode!==null)throw Error('Owned preview exited before readiness');
    try{const response=await fetch(origin+'/',{signal:AbortSignal.timeout(1000)});await response.body?.cancel();if(response.ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!ready)throw Error('Owned loopback preview did not become ready');
  workspace('browser-all',page);workspace('browser-firefox',page);workspace('browser-webkit-all',page);
  run('centre gallery browser regressions',['scripts/validate-centre-trust-browser.mjs'],site,{...env,CENTRE_TRUST_TEST_BASE:origin});
  run('centre Google browser regressions',['scripts/validate-centre-google-browser.mjs'],site,{...env,CENTRE_GOOGLE_TEST_BASE:origin});
  if(interrupted)throw Error('Interrupted: '+interrupted);receipt.status='passed';
}catch(error){receipt.status='failed';receipt.error=error.message;process.exitCode=1;}
finally{
  if(preview&&preview.exitCode===null&&preview.signalCode===null){
    receipt.ownedPreviewPid=preview.pid;
    const closed=await new Promise(resolve=>{
      const timer=setTimeout(()=>resolve(false),5000);
      preview.once('close',()=>{clearTimeout(timer);resolve(true);});preview.kill('SIGTERM');
    });
    receipt.previewCloseConfirmed=closed;
    if(!closed){receipt.status='failed';receipt.error='Owned preview shutdown was not confirmed';process.exitCode=1;}
  }else if(preview){receipt.previewCloseConfirmed=true;}
  if(previewOutput!==undefined)fs.closeSync(previewOutput);
  try{
    receipt.toolHashesAfter=toolHashes();receipt.browserTestFingerprintAfter=browserTestFingerprint(root);
    if(JSON.stringify(receipt.toolHashesBefore)!==JSON.stringify(receipt.toolHashesAfter)||receipt.browserTestFingerprintBefore!==receipt.browserTestFingerprintAfter)throw Error('Tooling or browser-test source changed during acceptance');
  }catch(error){receipt.status='failed';receipt.error=error.message;process.exitCode=1;}
  if(receipt.status==='passed'){
    try{const candidate=requireCandidate(root,results);receipt.candidateFingerprint=candidate.fingerprint;receipt.builtSource=candidate.source;}
    catch(error){receipt.status='failed';receipt.error=error.message;process.exitCode=1;}
  }
  receipt.completedAt=new Date().toISOString();save();
  console.log(JSON.stringify({status:receipt.status,receipt:receiptPath,completedStages:receipt.stages.filter(x=>x.status==='passed').length,error:receipt.error}));
}
