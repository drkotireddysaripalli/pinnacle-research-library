import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';import {createHash} from 'node:crypto';
import {pageContracts as contracts} from './page-quality-contracts.mjs';
import {runFocused} from './change-test-plan.mjs';

const id=process.argv[2]||'occupational';
if(!contracts[id])throw Error('Choose a registered page: '+Object.keys(contracts).join(', '));
const config=contracts[id],completed=[];
const planArg=process.argv.indexOf('--plan'),plan=planArg<0?null:JSON.parse(fs.readFileSync(process.argv[planArg+1],'utf8')),scoped=plan?.scope==='component';
const selectedPages=scoped&&plan.pages?.length?plan.pages:[id];for(const page of selectedPages)if(!contracts[page])throw Error('Unregistered changed page: '+page);
const npm=process.env.npm_execpath;
function run(label,args,pageConfig=config){
  const r=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,PINNACLE_RELEASE:'production',PAGE_PATH:pageConfig.path,CANONICAL_PATH:pageConfig.canonical}});
  if(r.error)throw r.error;
  if(r.status!==0)throw Error(label+' failed; repair the finding before repeating that check.');
  completed.push(label);
}
if(!npm)throw Error('Use npm run check:page -- '+id+' so the local package runtime is explicit.');
try{
  run('types',[npm,'run','check:types']);
  run('build',[npm,'run','build']);
  if(scoped){const h=createHash('sha256');for(const entry of fs.readdirSync('dist',{recursive:true,withFileTypes:true}).filter(x=>x.isFile()&&/\.(?:html|css|m?js|json)$/.test(x.name)).sort((a,b)=>(a.parentPath+a.name).localeCompare(b.parentPath+b.name))){const file=path.join(entry.parentPath||entry.path,entry.name);h.update(file);h.update(fs.readFileSync(file));}runFocused({...plan,buildSHA:h.digest('hex'),commands:[]});completed.push('unit');}else run('unit',[npm,'run','test:unit']);
  for(const page of selectedPages){const c=contracts[page];if(c.static)run('page contract '+page,[c.static],c);if(scoped)run('browser '+page,[npm,'exec','--','playwright','test',...plan.browserFiles,...plan.projects.map(p=>'--project='+p)],c);}
  if(!scoped)run('browser',[npm,'run','test:browser']);else completed.push('browser');
}finally{
  fs.mkdirSync('audits',{recursive:true});
  fs.writeFileSync('audits/check-page-latest.json',JSON.stringify({at:new Date().toISOString(),id,route:config.path,selectedPages,scope:plan?.scope||'full',browserFiles:scoped?plan.browserFiles:'all',completed,passed:completed.includes('browser'),notEstablished:['Actual iOS devices','Rankings','AI citations','Connected calls','Admissions']},null,2)+'\n');
}
