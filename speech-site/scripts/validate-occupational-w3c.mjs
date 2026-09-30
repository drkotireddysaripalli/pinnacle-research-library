import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const canonical='https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate';
const page=await fetch(canonical,{headers:{'cache-control':'no-cache'}});
assert.equal(page.status,200,'Live Occupational Therapy page must return HTTP 200');
const response=await fetch('https://validator.w3.org/nu/?out=json',{
  method:'POST',
  headers:{'content-type':'text/html; charset=utf-8','user-agent':'Pinnacle-release-validation/1.0'},
  body:await page.text(),
  signal:AbortSignal.timeout(45000)
});
assert.equal(response.status,200,'W3C Nu must accept the validation request');
const data=await response.json();
const messages=data.messages||[];
const errors=messages.filter(message=>message.type==='error');
const report={checkedAt:new Date().toISOString(),canonical,status:response.status,errorCount:errors.length,warningCount:messages.length-errors.length,messages};
await writeFile('deployment/occupational-w3c-20260930.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checkedAt:report.checkedAt,status:report.status,errorCount:report.errorCount,warningCount:report.warningCount},null,2));
assert.equal(errors.length,0,'W3C Nu reported HTML errors');
