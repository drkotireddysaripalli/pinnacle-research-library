import fs from 'node:fs';import assert from 'node:assert/strict';import {HELPLINE_HTML} from './worker.mjs';
const base='https://www.pinnacleblooms.org/national-autism-helpline',results=[];
for(const suffix of ['','/facts.json','/facts.txt','/llms.txt','/sitemap.xml','/assets/care-participation.webp']){
 const r=await fetch(base+suffix);assert.equal(r.status,200); const body=await r.text();
 if(suffix===''){assert.equal(body,HELPLINE_HTML);assert.equal((body.match(/<details>/g)||[]).length,10);assert.ok(body.includes('verify/#organization'));}
 if(suffix==='/facts.json')assert.equal(JSON.parse(body).telephone,'+919100181181');
 if(suffix==='/sitemap.xml')assert.ok(body.includes('2026-09-24'));
 results.push({url:base+suffix,status:r.status,type:r.headers.get('content-type')});
}
for(const suffix of ['','/facts.json']){const r=await fetch(base+suffix,{method:'HEAD'});assert.equal(r.status,200);assert.equal(await r.text(),'');}
assert.equal((await fetch(base+'/unlisted-path')).status,404);
assert.equal((await fetch(base,{method:'POST'})).status,405);
for(const url of ['https://www.pinnacleblooms.org/verify/','https://www.pinnacleblooms.org/']){const r=await fetch(url);assert.equal(r.status,200);results.push({url,status:r.status});}
fs.writeFileSync('production-results.json',JSON.stringify({date:new Date().toISOString(),exactHtml:true,faqs:10,results},null,2));console.log('Production exact HTML, 10 FAQs, exports, sitemap, OG, HEAD/method/404 and homepage/Verify controls passed');
