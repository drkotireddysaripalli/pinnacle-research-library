// Read push CI without exposing the existing Git credential.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
const [sha,output]=process.argv.slice(2);if(!/^[a-f0-9]{40}$/.test(sha||''))throw Error('Exact commit SHA required');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const result=spawnSync(git,['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true});
if(result.status!==0)throw Error('Existing Git credential unavailable');
const password=result.stdout.split('\n').find(line=>line.startsWith('password='))?.slice(9).trim();if(!password)throw Error('Existing Git credential unavailable');
const response=await fetch('https://api.github.com/repos/drkotireddysaripalli/pinnacle-research-library/actions/runs?head_sha='+sha,{headers:{authorization:'Bearer '+password,'x-github-api-version':'2022-11-28','user-agent':'Pinnacle-release-check'}});
if(!response.ok)throw Error('GitHub CI read failed '+response.status);
const data=await response.json(),receipt={at:new Date().toISOString(),commit:sha,runs:data.workflow_runs.map(r=>({id:r.id,name:r.name,event:r.event,status:r.status,conclusion:r.conclusion,url:r.html_url}))};
if(output)await fs.writeFile(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
