import fs from 'node:fs/promises';import {spawnSync} from 'node:child_process';
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const commit=spawnSync(git,['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).stdout.trim();
const credential=spawnSync(git,['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true}).stdout;const token=credential.split('\n').find(x=>x.startsWith('password='))?.slice(9).trim();if(!token)throw Error('Existing credential unavailable');
const base='https://api.github.com/repos/drkotireddysaripalli/pinnacle-research-library';const headers={authorization:'Bearer '+token,'x-github-api-version':'2022-11-28','user-agent':'Pinnacle-exact-release'};
const r=await fetch(base+'/actions/runs?head_sha='+commit+'&per_page=5',{headers});if(!r.ok)throw Error('GitHub status '+r.status);const j=await r.json();const run=j.workflow_runs.find(x=>x.name==='Portal quality'&&x.head_sha===commit);if(!run){console.log(JSON.stringify({commit,run:'not yet listed'}));} else {
console.log(JSON.stringify({commit,run:run.id,status:run.status,conclusion:run.conclusion,url:run.html_url}));
if(run.status==='completed'&&run.conclusion==='success')await fs.writeFile('ask-private/'+(process.argv[2]||'public-completion-20261008')+'/ci.json',JSON.stringify(run,null,2));
if(run.conclusion==='failure'){const jobs=await(await fetch(base+'/actions/runs/'+run.id+'/jobs',{headers})).json();for(const job of jobs.jobs.filter(x=>x.conclusion==='failure')){console.log(JSON.stringify({job:job.name,failedSteps:job.steps.filter(x=>x.conclusion==='failure')}));const lines=(await(await fetch(base+'/actions/jobs/'+job.id+'/logs',{headers})).text()).split('\n');console.log(lines.filter(x=>/Error|fail|not ok/i.test(x)).map(x=>x.slice(0,700)).join('\n').slice(-9500));}}

}
