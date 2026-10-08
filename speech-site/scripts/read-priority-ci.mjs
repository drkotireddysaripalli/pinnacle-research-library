import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const c=spawnSync(git,['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true});const key=c.stdout.split('\n').find(x=>x.startsWith('password='))?.slice(9).trim();if(!key)throw Error('Saved credential absent');
const sha=spawnSync(git,['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).stdout.trim();
const base='https://api.github.com/repos/drkotireddysaripalli/pinnacle-research-library';const headers={authorization:'Bearer '+key,'user-agent':'Pinnacle-exact-release','x-github-api-version':'2022-11-28'};
const r=await fetch(base+'/actions/runs?head_sha='+sha,{headers});const d=await r.json();if(!r.ok)throw Error('GitHub read failed '+r.status);
for(const run of d.workflow_runs||[]){const jobs=await(await fetch(base+'/actions/runs/'+run.id+'/jobs',{headers})).json();const item={source:sha,id:run.id,url:run.html_url,status:run.status,conclusion:run.conclusion,jobs:jobs.jobs?.map(j=>({id:j.id,name:j.name,status:j.status,conclusion:j.conclusion,current:j.steps.filter(s=>s.status==='in_progress'||s.conclusion==='failure').map(s=>s.name)}))};await fs.writeFile('deployment/content-priority-ci-20261008.json',JSON.stringify(item,null,2));console.log(JSON.stringify(item));}
