// One bounded daily execution. No customer records, calls, purchases or OAuth.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {pageManifest} from '../tests/testingbot/page-manifest.mjs';
import {dailyPlan} from '../tests/testingbot/daily-plan.mjs';
import {writeJson} from './testingbot-client.mjs';
const root=path.resolve('audits/testingbot-daily'),lock=root+'/active.lock',stateFile=root+'/state.json';
const read=async file=>{try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return {};throw e;}};
const state=await read(stateFile),manifest=await pageManifest(),now=new Date();
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
const plan=dailyPlan(manifest,state,now);
if(process.argv.includes('--plan')){console.log(JSON.stringify({day,plan,pending:manifest.filter(r=>!r.published)},null,2));process.exit(0);}
if(state.lastDay===day&&!process.argv.includes('--force')){console.log(JSON.stringify({status:'already-executed',day,report:state.lastReport}));process.exit(0);}
await fs.mkdir(root,{recursive:true});
try{await fs.mkdir(lock);}catch(e){if(e.code!=='EEXIST')throw e;console.log(JSON.stringify({status:'active-or-unreconciled',lock,action:'Inspect owner.json and provider session outcomes before removing a stale lock; no overlap started'}));process.exit(2);}
const report={schemaVersion:1,day,startedAt:now.toISOString(),plan,pendingPages:manifest.filter(r=>!r.published),runs:[],coverage:{defined:manifest.length,published:manifest.filter(r=>r.published).length},overall:'running'};
const dir=root+'/'+now.toISOString().replace(/[:.]/g,'-');await fs.mkdir(dir,{recursive:true});
await writeJson(lock+'/owner.json',{pid:process.pid,startedAt:report.startedAt,report:dir+'/report.json'});
try{
  for(const job of plan){
    const out=dir+'/'+job.name,args=['scripts/testingbot-suite.mjs','--suite',job.suite,'--matrix',job.matrix,'--visual','--out',out,...(job.ids?['--cases',job.ids.join(',')]:[]),...(job.network?['--network']:[])];
    await writeJson(lock+'/owner.json',{pid:process.pid,startedAt:report.startedAt,report:dir+'/report.json',activeReport:out+'/report.json'});
    const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{stdio:'inherit',windowsHide:true});child.once('error',reject);child.once('close',resolve);});
    const evidence=await read(out+'/report.json');
    report.runs.push({name:job.name,report:path.relative(path.resolve('.'),out+'/report.json'),exitCode:code,overall:evidence.overall||'missing-report',counts:evidence.counts,providerSessionSeconds:evidence.providerSessionSeconds});
    state.coverage??={};
    for(const s of evidence.sessions||[])for(const c of s.cases||[])if(['passed','failed'].includes(c.status))state.coverage[c.id]={at:c.finishedAt||new Date().toISOString(),matrix:s.matrix,status:c.status,report:out+'/report.json'};
    await writeJson(dir+'/report.json',report);
    // A rejected account/startup is a genuine dependency, not permission to queue more sessions.
    if(!(evidence.sessions||[]).some(s=>s.sessionId)){report.stoppedReason='No remote session established; reconcile provider access before starting remaining jobs';break;}
  }
  report.finishedAt=new Date().toISOString();report.overall=report.runs.length===plan.length&&report.runs.every(r=>r.exitCode===0&&r.overall==='functional-pass')?'defined-checks-pass':'failed-or-incomplete';
  report.coverage.everExecuted=Object.keys(state.coverage||{}).length;report.coverage.notYetExecuted=manifest.filter(r=>r.published&&!state.coverage?.[r.id]).map(r=>r.id);
  state.lastDay=day;state.lastReport=dir+'/report.json';await writeJson(stateFile,state);await writeJson(dir+'/report.json',report);
  console.log(JSON.stringify({report:dir+'/report.json',overall:report.overall,coverage:report.coverage}));
  if(report.overall!=='defined-checks-pass')process.exitCode=1;
}finally{await fs.rm(lock,{recursive:true,force:true});}
