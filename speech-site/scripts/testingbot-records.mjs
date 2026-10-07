// Explicit full record run, sharded to avoid an oversized browser session.
import fs from 'node:fs/promises';import path from 'node:path';import {spawn} from 'node:child_process';
import {pageManifest,selectCases} from '../tests/testingbot/page-manifest.mjs';
import {recordShards} from '../tests/testingbot/record-shards.mjs';import {writeJson} from './testingbot-client.mjs';
const option=(name,fallback)=>{const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1];};
const suite=option('suite','p3'),matrix=option('matrix','chrome'),manifest=await pageManifest(),records=selectCases(manifest,suite,{ids:option('cases','').split(',').filter(Boolean)}),shards=recordShards(records);
if(process.argv.includes('--list')){console.log(JSON.stringify({suite,matrix,shards,pending:records.filter(r=>!r.published)},null,2));process.exit(0);}
const out=path.resolve(option('out','audits/testingbot-records/'+new Date().toISOString().replace(/[:.]/g,'-')));
const report={suite,matrix,startedAt:new Date().toISOString(),selectedIds:shards.flat(),pending:records.filter(r=>!r.published),runs:[],overall:'running'};
await writeJson(out+'/report.json',report);
for(const [i,ids] of shards.entries()){
  const dir=out+'/shard-'+String(i+1).padStart(2,'0'),args=['scripts/testingbot-suite.mjs','--suite',suite,'--matrix',matrix,'--cases',ids.join(','),'--out',dir,'--visual'];
  if(suite==='p2'&&i===0)args.push('--network');
  const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{stdio:'inherit',windowsHide:true});child.once('error',reject);child.once('close',resolve);});
  let r;try{r=JSON.parse(await fs.readFile(dir+'/report.json','utf8'));}catch{r={overall:'missing-report',sessions:[]};}
  report.runs.push({index:i+1,ids,executedIds:[...new Set((r.sessions||[]).flatMap(s=>(s.cases||[]).filter(c=>['passed','failed'].includes(c.status)).map(c=>c.id)))],exitCode:code,report:dir+'/report.json',overall:r.overall,counts:r.counts});await writeJson(out+'/report.json',report);
  if(!r.sessions?.some(s=>s.sessionId)){report.stoppedReason='Provider session unavailable; remaining shards did not execute';break;}
}
report.finishedAt=new Date().toISOString();report.overall=report.runs.length===shards.length&&report.runs.every(r=>r.exitCode===0&&r.overall==='functional-pass')&&!report.pending.length?'defined-records-pass':'failed-or-incomplete';
report.notExecutedIds=report.selectedIds.filter(id=>!report.runs.some(r=>r.executedIds.includes(id)));await writeJson(out+'/report.json',report);
console.log(JSON.stringify({report:out+'/report.json',overall:report.overall,attemptedShards:report.runs.length,totalShards:shards.length,pending:report.pending.length,notExecuted:report.notExecutedIds.length}));
if(report.overall!=='defined-records-pass')process.exitCode=1;
