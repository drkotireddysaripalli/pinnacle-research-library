import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {PINNACLEAI_PATHS} from '../deployment/speech-handler.mjs';

const origin='https://www.pinnacleblooms.org';
const mode=process.argv[2]==='local'?'local':'live';
const results=[];
for(const route of PINNACLEAI_PATHS){
 const canonical=origin+route;
 const html=mode==='local'?await readFile('dist'+route+'.html','utf8'):await fetch(canonical,{headers:{'cache-control':'no-cache'}}).then(async page=>{assert.equal(page.status,200,route);return page.text();});
 const validated=await fetch('https://validator.w3.org/nu/?out=json',{
  method:'POST',headers:{'content-type':'text/html; charset=utf-8','user-agent':'PinnacleAI-wave-validation/1.0'},body:html,signal:AbortSignal.timeout(45000)
 });
 assert.equal(validated.status,200,route+' validator');
 const messages=(await validated.json()).messages||[];
 const errors=messages.filter(message=>message.type==='error');
 results.push({route,errorCount:errors.length,warningCount:messages.length-errors.length,messages});
}
const report={checkedAt:new Date().toISOString(),mode,results};
const output=`deployment/pinnacleai-wave-w3c-${mode}-20260930.json`;
await writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,pages:results.length,errors:results.reduce((sum,row)=>sum+row.errorCount,0),warnings:results.reduce((sum,row)=>sum+row.warningCount,0)}));
assert(results.every(row=>row.errorCount===0),'W3C Nu found HTML errors');
