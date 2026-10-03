import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.argv[2]||'https://pinnacleblooms.org';
const out=process.argv[3]||'deployment/ask-browser-cache.json';
const answer='/ask/what-happens-during-occupational-therapy-sessions';
const results=[];
for(const path of [answer,answer,answer,'/ask/auth/session']){
 const response=await fetch(base+path,{signal:AbortSignal.timeout(20000)});
 const body=await response.text();
 const cacheControl=response.headers.get('cache-control')||'';
 if(path.endsWith('/session')){
  assert.match(cacheControl,/no-store/,'private session must not be cached');
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/);
 }else{
  assert.equal(response.status,200);
  assert.match(cacheControl,/(?:^|,\s*)max-age=0(?:,|$)/,'HTML must revalidate in browsers on both miss and hit');
  assert.match(cacheControl,/s-maxage=300/,'retain five-minute public edge caching');
  assert(body.includes('ask-reading-paths-title'),'current answer template');
 }
 results.push({path,status:response.status,cacheControl,cacheStatus:response.headers.get('cf-cache-status'),age:response.headers.get('age')});
}
await fs.writeFile(out,JSON.stringify({at:new Date().toISOString(),base,results,passed:true},null,2));
console.log(JSON.stringify({passed:true,results,out}));
