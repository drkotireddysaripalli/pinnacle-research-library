// Three explicit loopback URLs and basic CSV exports; refuse cached API state.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {requireCandidate} from './candidate.mjs';
import {assertLocalFrogSettings} from './frog-settings.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here),results=path.join(here,'results');
const settingsPreflight=assertLocalFrogSettings();
const candidate=requireCandidate(root,results);
const executable=process.env.PINNACLE_FROG_EXE || (process.platform==='darwin'
  ? '/Applications/Screaming Frog SEO Spider.app/Contents/MacOS/ScreamingFrogSEOSpiderLauncher'
  : process.platform==='win32' ? 'C:\\Program Files (x86)\\Screaming Frog SEO Spider\\ScreamingFrogSEOSpiderCli.exe' : '/usr/bin/screamingfrogseospider');
if(!fs.existsSync(executable)) throw new Error('Install the official SEO Spider or set PINNACLE_FROG_EXE to its local CLI.');
const port=process.env.PINNACLE_PREVIEW_PORT || '4340';
if(!/^\d+$/.test(port)||Number(port)<1024||Number(port)>65535) throw new Error('Choose an unprivileged local preview port.');
const urls=['/pinnacleai','/enroll-autism-speech-aba-therapies-india','/shop'].map(p=>'http://127.0.0.1:'+port+p);
for(const url of urls) {
  const response=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(2000)});
  if(response.status!==200) throw new Error('Start the verified local preview first: '+url+' returned '+response.status);
}
const startedAt=new Date().toISOString(),output=path.join(results,'frog-local',startedAt.replace(/[:.]/g,'-'));
fs.mkdirSync(output,{recursive:true});
const list=path.join(output,'urls.txt');fs.writeFileSync(list,urls.join('\n')+'\n');
const args=['--headless','--crawl-list',list,'--output-folder',output,'--export-tabs','Internal:All,Response Codes:All,Page Titles:All,Meta Description:All,H1:All,Canonicals:All'];
assertLocalFrogSettings(); // Recheck immediately before launching the native process.
const run=spawnSync(executable,args,{stdio:'inherit',windowsHide:true});
const exports=['internal_all.csv','response_codes_all.csv','page_titles_all.csv','meta_description_all.csv','h1_all.csv','canonicals_all.csv'];
const missing=exports.filter(p=>!fs.existsSync(path.join(output,p)));
const passed=!run.error && run.status===0 && missing.length===0;
const receipt={status:passed?'passed':'failed',startedAt,completedAt:new Date().toISOString(),candidateSource:candidate.source,
  candidateFingerprint:candidate.fingerprint,urls,output,executable,exitCode:run.status,missingExports:missing,error:run.error?.message,
  settingsPreflight,
  scope:'Three static local candidate URLs; six basic exports. Shared provider settings/cache preflight passed; this receipt does not establish isolated network execution or zero API attempts. No public whole-site crawl, licence purchase or indexing submission.'};
fs.writeFileSync(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
fs.writeFileSync(path.join(results,'frog-local.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));process.exitCode=passed?0:1;
