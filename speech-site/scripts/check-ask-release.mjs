import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {parse} from 'parse5';
const base=process.argv[2]||'http://127.0.0.1:4330';const results=[];function all(n,a=[]){if(n.tagName)a.push(n);for(const x of n.childNodes||[])all(x,a);return a}const attr=(n,k)=>n?.attrs?.find(x=>x.name===k)?.value;
async function get(path,bodyCheck){const start=Date.now();const r=await fetch(base+path,{signal:AbortSignal.timeout(20000)});const t=await r.text();assert.equal(r.status,200,path);if(bodyCheck)bodyCheck(t,r);results.push({path,status:r.status,ms:Date.now()-start,bytes:Buffer.byteLength(t)});return t;}
const home=await get('/ask?q=ask-private-cache-probe-20261003',t=>assert(!t.includes('ask-private-cache-probe-20261003')));
await get('/ask',t=>assert(!t.includes('ask-private-cache-probe-20261003')));
await get('/ask/search?q=speech',(t,r)=>{assert(t.includes('ask-answer-card'));assert(r.headers.get('cache-control').includes('no-store'));});
await get('/ask/te/search?q=speech',(t,r)=>assert(r.headers.get('cache-control').includes('no-store')));
await get('/ask/te/conditions',t=>assert(t.includes('/ask/te/adhd')));
await get('/ask/lens/entity%3Atherapy_modality/ot',t=>assert(t.includes('ask-answer-card')));
await get('/ask/are-there-successful-adults-who-grew-up-with-cerebral-palsy-te',t=>assert(t.includes('lang="te"')));
await get('/ask/sitemap-topics.xml',t=>assert(t.includes('<urlset')));
await get('/ask/what-happens-during-occupational-therapy-sessions.json',t=>{const a=JSON.parse(t);assert(a.title);assert(!t.includes('SUPABASE'));assert(!a.answer_md.includes('any diagnosis are formed only'));});
for(const n of all(parse(home)).filter(n=>n.tagName==='img').slice(0,2)){
 const src=attr(n,'src');if(src){const r=await fetch(new URL(src,base));assert.equal(r.status,200);assert(r.headers.get('content-type').startsWith('image/'));const bytes=(await r.arrayBuffer()).byteLength;results.push({image:src,status:r.status,bytes});assert(bytes>100);}
}
for(const path of ['/ask/og/default.png','/ask/what-happens-during-occupational-therapy-sessions.png','/ask/f/te-sans400.woff2']){const r=await fetch(base+path,{signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,path);const bytes=(await r.arrayBuffer()).byteLength;results.push({path,status:r.status,bytes});assert(bytes>100);}
await fs.writeFile('reviews/ask-'+(base.includes('127.0.0.1')?'local':'production')+'-release-checks.json',JSON.stringify({at:new Date().toISOString(),base,results},null,2));console.log(JSON.stringify({passed:results.length,results},null,2));
