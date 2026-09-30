import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';

const canonical='https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate';
const mode=process.argv[2]==='live'?'live':'local';
const html=mode==='live' ? await fetch(canonical,{headers:{'cache-control':'no-cache'}}).then(async response=>{assert.equal(response.status,200);return response.text();}) : await readFile('dist/best-aba-therapy-center-india-proven-improvement-rate.html','utf8');
const response=await fetch('https://validator.w3.org/nu/?out=json',{method:'POST',headers:{'content-type':'text/html; charset=utf-8','user-agent':'Pinnacle-ABA-release-validation/1.0'},body:html,signal:AbortSignal.timeout(45000)});
assert.equal(response.status,200);
const messages=(await response.json()).messages||[];
const errors=messages.filter(message=>message.type==='error');
const report={checkedAt:new Date().toISOString(),mode,canonical,status:response.status,errorCount:errors.length,warningCount:messages.length-errors.length,messages};
const output=`deployment/aba-w3c-${mode}-20260930.json`;
await writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,errorCount:report.errorCount,warningCount:report.warningCount,messages:errors},null,2));
assert.equal(errors.length,0,'W3C Nu reported HTML errors');
