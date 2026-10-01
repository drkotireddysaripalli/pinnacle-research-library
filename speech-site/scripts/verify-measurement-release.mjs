import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import vm from 'node:vm';

const stage=process.argv[2];
assert(stage,'Explicit published stage required');
const origin='https://www.pinnacleblooms.org';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const owned=t=>t.replace('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','').replace('<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>','');
async function read(publicPath,options={}){
  const r=await fetch(origin+publicPath,{redirect:'manual',...options});
  return {status:r.status,bytes:Buffer.from(await r.arrayBuffer()),type:r.headers.get('content-type'),cache:r.headers.get('cache-control')};
}
const record={at:new Date().toISOString(),stage,changed:[],pages:[],controls:[]};
const change=JSON.parse(await fs.readFile('deployment/measurement-v150-staged-20261001.json','utf8'));
const files=(await fs.readdir(stage+'/pinnacle-pages-html')).filter(x=>x.endsWith('.html')&&!x.includes('preview'));
let index=0;
await Promise.all(Array.from({length:4},async()=>{
  while(index<files.length){
    const file=files[index++],expected=await fs.readFile(stage+'/pinnacle-pages-html/'+file,'utf8');
    const path=new URL(expected.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
    const response=await read(path);
    assert.equal(response.status,200,path);
    assert.equal(sha(owned(response.bytes.toString('utf8'))),sha(expected),path+' published HTML');
    record.pages.push({path,matched:true});
  }
}));
for(const entry of change.changed.filter(x=>!x.path.startsWith('/pinnacle-pages-html/'))){
  const live=await read(entry.path);
  assert.equal(live.status,200,entry.path);
  assert.equal(sha(live.bytes),sha(await fs.readFile(stage+entry.path)),entry.path+' bytes');
  record.changed.push({path:entry.path,sha256:sha(live.bytes),cache:live.cache,type:live.type});
}
const cookie='unknown=fixture; _gcl_au=fixture; __Host-appgarden-visitor=fixture';
for(const path of ['/best-occupational-therapy-center-india-proven-improvement-rate','/enroll-autism-speech-aba-therapies-india']){
  const regular=await read(path),variant=await read(path,{headers:{cookie,authorization:'Bearer fixture',range:'bytes=0-1','cache-control':'no-transform'}});
  assert.equal(variant.status,200);assert.equal(sha(regular.bytes),sha(variant.bytes));
  record.controls.push({path,cookieCredentialRangeRetained:true});
}
const verify=await read('/verify/');
assert.equal(verify.status,200);
const frozenWorker=await fs.readFile(stage.replace(/^release-/,'.worker-upload-')+'/pinnacle-route-v12.mjs','utf8');
const publicMapping=frozenWorker.split('\n').find(line=>line.startsWith('function publicBody('));
assert(publicMapping,'Existing Verify URL-mapping function required');
const mapVerify=vm.runInNewContext(publicMapping+'; publicBody',{ORIGIN:'https://pinnacle-verify.saripalli.chatgpt.site',PUBLIC:origin+'/verify'});
assert.equal(sha(owned(verify.bytes.toString('utf8'))),sha(mapVerify(await fs.readFile(stage+'/index.html','utf8'))),'Verify retained through the existing public URL mapping');
for(const [path,status] of [['/api/enrolment',405],['/Leadership/Maheshwari',410],['/leadership/Prudhvi%2dMatsa',410],['/national-autism-helpline',200],['/epass',200],['/',200]]){
  assert.equal((await read(path)).status,status,path);record.controls.push({path,status});
}
record.verifyRetained=true;
record.verifyMapping='Frozen runtime publicBody URL mapping; no content normalization';
record.passed=true;
record.liveSubmissionsMade=0;
await fs.writeFile('deployment/measurement-v150-live-20261001.json',JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({pages:record.pages.length,changedAssets:record.changed.length,controls:record.controls.length,verifyRetained:true,passed:true}));
