// One bounded daily execution. No customer records, calls, purchases or OAuth.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {pageManifest} from '../tests/testingbot/page-manifest.mjs';
import {dailyPlan} from '../tests/testingbot/daily-plan.mjs';
import {writeJson} from './testingbot-client.mjs';
import {recordCoverage,evidencePriorities} from '../tests/testingbot/evidence-priorities.mjs';
const root=path.resolve('audits/testingbot-daily'),lock=root+'/active.lock',stateFile=root+'/state.json';
const read=async file=>{try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return {};throw e;}};
const state=await read(stateFile),manifest=await pageManifest(),now=new Date();
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
const planOnly=process.argv.includes('--plan');
if(planOnly){const profile=await read(root+'/evidence-profile.json');console.log(JSON.stringify({day,plan:dailyPlan(manifest,state,now,profile),evidenceAt:profile.generated_at||null,pending:manifest.filter(r=>!r.published)},null,2));process.exit(0);}
if(state.lastDay===day&&!process.argv.includes('--force')){console.log(JSON.stringify({status:'already-executed',day,report:state.lastReport}));process.exit(0);}
await fs.mkdir(root,{recursive:true});
try{await fs.mkdir(lock);}catch(e){if(e.code!=='EEXIST')throw e;console.log(JSON.stringify({status:'active-or-unreconciled',lock,action:'Inspect owner.json and provider session outcomes before removing a stale lock; no overlap started'}));process.exit(2);}
const report={schemaVersion:2,day,startedAt:now.toISOString(),pendingPages:manifest.filter(r=>!r.published),runs:[],coverage:{defined:manifest.length,published:manifest.filter(r=>r.published).length},overall:'running'};
const dir=root+'/'+now.toISOString().replace(/[:.]/g,'-');await fs.mkdir(dir,{recursive:true});
await writeJson(lock+'/owner.json',{pid:process.pid,startedAt:report.startedAt,report:dir+'/report.json'});
try{
  const python=process.env.PYTHON_EXECUTABLE||(process.platform==='win32'?'C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe':'python3');
  const profileFile=root+'/evidence-profile.json';
  try{
    const code=await new Promise((resolve,reject)=>{const child=spawn(python,['scripts/growth-evidence-profile.py','--output',profileFile],{stdio:'inherit',windowsHide:true,timeout:20000});child.once('error',reject);child.once('close',resolve);});
    if(code!==0)throw Error('Offline adapter exited '+code);
    report.evidence={status:'reused-saved-inputs',report:profileFile};
  }catch(e){report.evidence={status:'unavailable',error:e.message,meaning:'Fixed critical and inventory rotation remain; missing inputs are not fabricated'};}
  const profile=report.evidence.status==='reused-saved-inputs'?await read(profileFile):{};
  const plan=dailyPlan(manifest,state,now,profile);report.plan=plan;report.evidence.generatedAt=profile.generated_at||null;
  const priorities=evidencePriorities(manifest,profile,state);
  report.evidence.selectedPriorities=Object.fromEntries(plan.flatMap(job=>job.ids||[]).map(id=>[id,priorities[id]]));
  for(const job of plan){
    const out=dir+'/'+job.name,args=['scripts/testingbot-suite.mjs','--suite',job.suite,'--matrix',job.matrix,'--visual','--out',out,...(job.ids?['--cases',job.ids.join(',')]:[]),...(job.network?['--network']:[])];
    await writeJson(lock+'/owner.json',{pid:process.pid,startedAt:report.startedAt,report:dir+'/report.json',activeReport:out+'/report.json'});
    const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{stdio:'inherit',windowsHide:true});child.once('error',reject);child.once('close',resolve);});
    const evidence=await read(out+'/report.json');
    report.runs.push({name:job.name,report:path.relative(path.resolve('.'),out+'/report.json'),exitCode:code,overall:evidence.overall||'missing-report',visualAcceptance:evidence.visualAcceptance||'not-established',counts:evidence.counts,providerSessionSeconds:evidence.providerSessionSeconds});
    recordCoverage(state,evidence);
    await writeJson(dir+'/report.json',report);
    // A rejected account/startup is a genuine dependency, not permission to queue more sessions.
    if(!(evidence.sessions||[]).some(s=>s.sessionId)){report.stoppedReason='No remote session established; reconcile provider access before starting remaining jobs';break;}
  }
  report.finishedAt=new Date().toISOString();report.overall=report.runs.length===plan.length&&report.runs.every(r=>r.exitCode===0&&r.overall==='functional-pass')?'functional-checks-pass':'failed-or-incomplete';
  report.visualAcceptance='Review individual approved/provisional/skipped comparisons; functional status is not visual approval';
  report.coverage.everExecuted=Object.keys(state.coverage||{}).length;report.coverage.notYetExecuted=manifest.filter(r=>r.published&&!state.coverage?.[r.id]).map(r=>r.id);
  state.lastDay=day;state.lastReport=dir+'/report.json';await writeJson(stateFile,state);await writeJson(dir+'/report.json',report);
  console.log(JSON.stringify({report:dir+'/report.json',overall:report.overall,coverage:{defined:report.coverage.defined,published:report.coverage.published,everExecuted:report.coverage.everExecuted,notYetExecuted:report.coverage.notYetExecuted.length}}));
  if(report.overall!=='functional-checks-pass')process.exitCode=1;
}finally{await fs.rm(lock,{recursive:true,force:true});}
