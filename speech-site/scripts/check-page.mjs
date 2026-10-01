import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import {pageContracts as contracts} from './page-quality-contracts.mjs';

const id=process.argv[2]||'occupational';
if(!contracts[id])throw Error('Choose a registered page: '+Object.keys(contracts).join(', '));
const config=contracts[id],completed=[];
const npm=process.env.npm_execpath;
function run(label,args){
  const r=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,PINNACLE_RELEASE:'production',PAGE_PATH:config.path,CANONICAL_PATH:config.canonical}});
  if(r.error)throw r.error;
  if(r.status!==0)throw Error(label+' failed; repair the finding before repeating that check.');
  completed.push(label);
}
if(!npm)throw Error('Use npm run check:page -- '+id+' so the local package runtime is explicit.');
try{
  run('types',[npm,'run','check:types']);
  run('build',[npm,'run','build']);
  run('unit',[npm,'run','test:unit']);
  if(config.static)run('page contract',[config.static]);
  run('browser',[npm,'run','test:browser']);
}finally{
  fs.mkdirSync('audits',{recursive:true});
  fs.writeFileSync('audits/check-page-latest.json',JSON.stringify({at:new Date().toISOString(),id,route:config.path,completed,passed:completed.includes('browser'),notEstablished:['Actual iOS devices','Rankings','AI citations','Connected calls','Admissions']},null,2)+'\n');
}
