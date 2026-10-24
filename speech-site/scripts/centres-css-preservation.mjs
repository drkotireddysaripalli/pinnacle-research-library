import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const dir=process.env.PINNACLE_CENTRES_TEST_DIR;assert(dir);
const manifest=JSON.parse(await fs.readFile(path.join(dir,'MANIFEST.json'),'utf8'));
const source=process.env.PINNACLE_SOURCE_ROOT||manifest.sourceRoot;
const hash=x=>createHash('sha256').update(x instanceof ArrayBuffer?Buffer.from(x):x).digest('hex');
const html=await fs.readFile(path.join(dir,'../P8-PUBLIC/centres.html'),'utf8');
assert.equal(hash(html),manifest.fixture.sha256,'Public fixture drifted; recheck directory before applying');
const css=await fs.readFile(path.join(dir,'centers.DUTsoQ8n.css'));
const baseAssetsText=await fs.readFile(path.join(dir,'BASELINE-enrolment-assets.mjs'),'utf8');
const candidateAssetsText=await fs.readFile(path.join(dir,'enrolment-assets.mjs'),'utf8');
const baseAssets=await import(pathToFileURL(path.join(dir,'BASELINE-enrolment-assets.mjs')).href);
const candidateAssets=await import(pathToFileURL(path.join(dir,'enrolment-assets.mjs')).href);
async function loadHandler(file,candidate){
 let text=await fs.readFile(file,'utf8');
 text=text.replace(/from\s+(['"])(\.\/[^'"]+)\1/g,(_,quote,rel)=>{
  const target=candidate&&rel==='./enrolment-assets.mjs'?path.join(dir,'enrolment-assets.mjs'):path.resolve(source,rel);
  return 'from '+JSON.stringify(pathToFileURL(target).href);
 });
 return import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));
}
const before=await loadHandler(path.join(dir,'BASELINE-speech-handler.mjs'),false);
const after=await loadHandler(path.join(dir,'speech-handler.mjs'),true);
const inventory={'/pinnacle-pages-html/centers.html':'fixture-centres','/pinnacle-pages-data/centers-machine.md':'fixture-md','/pinnacle-pages-html/speech.html':'fixture-speech','/pinnacle-pages-assets/unrelated.css':'fixture-css'};
function environment(){return {ASSETS:{fetch:async request=>{
 const p=new URL(request.url).pathname;
 if(p==='/pinnacle-pages-html/centers.html')return new Response(html,{headers:{'content-type':'text/html','content-length':String(Buffer.byteLength(html)),'last-modified':'Sat, 24 Oct 2026 08:00:00 GMT'}});
 if(p==='/pinnacle-pages-data/centers-machine.md')return new Response('# Existing directory',{headers:{'content-type':'text/markdown'}});
 return new Response('UNCHANGED '+p,{headers:{'content-type':p.endsWith('.css')?'text/css':'text/html'}});
}}};}
async function snapshot(handler,url,init){const r=await handler.serveSpeech(new Request(url,init),environment(),inventory);return r?{status:r.status,headers:[...r.headers],body:await r.text()}:null;}
let checks=0;function check(name,fn){test(name,async()=>{await fn();checks++;});}
check('only one embedded CSS record is added; all existing records byte-identical',async()=>{
 const old=JSON.parse(baseAssetsText.match(/const records=(\{[^\n]+\});/)[1]);
 const same=JSON.parse(candidateAssetsText.match(/const records=(\{[^\n]+\});/)[1]);
 assert.deepEqual(same,old);
 for(const [key,record]of Object.entries(old)){
  assert.equal(candidateAssets.enrolmentHash(key),baseAssets.enrolmentHash(key));
  assert.equal(hash(await (candidateAssets.enrolmentAsset(key,'GET')).arrayBuffer()),hash(Buffer.from(record.body,'base64')));
 }
 assert.equal(baseAssets.enrolmentHash(manifest.stylesheet.newPath),undefined);
 assert.equal(candidateAssets.enrolmentHash(manifest.stylesheet.newPath),manifest.stylesheet.sha256.slice(0,16));
});
check('new CSS is served by the actual handler with exact bytes and CSS headers',async()=>{
 const r=await after.serveSpeech(new Request('https://www.pinnacleblooms.org'+manifest.stylesheet.newPath),environment(),inventory);
 assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/css/);assert.equal(hash(await r.arrayBuffer()),manifest.stylesheet.sha256);
 const head=await after.serveSpeech(new Request('https://www.pinnacleblooms.org'+manifest.stylesheet.newPath,{method:'HEAD'}),environment(),inventory);
 assert.equal(head.status,200);assert.equal(await head.text(),'');
});
check('live directory HTML changes only its exact missing stylesheet tag to the two required existing build styles',async()=>{
 assert.equal(html.split(manifest.stylesheet.oldPath).length-1,1);assert(html.includes('href="'+manifest.stylesheet.oldPath+'"')); 
 const a=await snapshot(before,'https://www.pinnacleblooms.org/centers?utm_source=google&centre=warangal&service=speech');
 const b=await snapshot(after,'https://www.pinnacleblooms.org/centers?utm_source=google&centre=warangal&service=speech');
 assert.equal(a.status,200);assert.equal(b.status,200);assert.equal(b.body,a.body.replace('<link rel="stylesheet" href="'+manifest.stylesheet.oldPath+'">','<link rel="stylesheet" href="/pinnacle-pages-assets/PageLayout.C7sOKZ93.css"><link rel="stylesheet" href="'+manifest.stylesheet.newPath+'">'));
 assert.equal(new Map(b.headers).get('x-pinnacle-centres-css'),'centres-css-20261024');
 assert.notEqual(new Map(a.headers).get('etag'),new Map(b.headers).get('etag'));
 assert.equal(new Map(a.headers).get('link'),new Map(b.headers).get('link'));
});
check('old ETag does not incorrectly suppress the repaired HTML; new ETag gets304',async()=>{
 const old=await snapshot(before,'https://www.pinnacleblooms.org/centers');
 const cur=await snapshot(after,'https://www.pinnacleblooms.org/centers');
 const a=await snapshot(after,'https://www.pinnacleblooms.org/centers',{headers:{'if-none-match':new Map(old.headers).get('etag')}});
 const b=await snapshot(after,'https://www.pinnacleblooms.org/centers',{headers:{'if-none-match':new Map(cur.headers).get('etag')}});
 assert.equal(a.status,200);assert.equal(b.status,304);assert.equal(b.body,'');
});
check('directoryHEAD keeps body empty and private directory request remains no-store',async()=>{
 const h=await snapshot(after,'https://www.pinnacleblooms.org/centers',{method:'HEAD'});assert.equal(h.status,200);assert.equal(h.body,'');
 const p=await snapshot(after,'https://www.pinnacleblooms.org/centers',{headers:{cookie:'existing-consent=declined'}});assert.match(new Map(p.headers).get('cache-control'),/no-store/);assert(p.body.includes(manifest.stylesheet.newPath));
});
check('aliases, querystrings, Markdown and unrelated routes/assets are unchanged',async()=>{
 const cases=[['/centres?utm_source=google&service=speech&centre=warangal'],['/locations?utm_source=google'],['/enroll?service=ot&centre=warangal'],['/centers',{headers:{accept:'text/markdown'}}],['/speech-therapy'],['/pinnacle-pages-assets/unrelated.css'],['/not-owned-by-this-handler']];
 for(const [u,init]of cases)assert.deepEqual(await snapshot(after,'https://www.pinnacleblooms.org'+u,init),await snapshot(before,'https://www.pinnacleblooms.org'+u,init),u);
});
check('compiled stylesheet classes and component scope all exist in live HTML',async()=>{
 const text=css.toString();const classes=new Set([...text.matchAll(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g)].map(m=>m[1]));
 const htmlClasses=new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/)));
 assert.equal(classes.size,27);for(const c of classes)assert(htmlClasses.has(c),c);
 const tokens=new Set([...text.matchAll(/data-astro-cid-([a-z0-9]+)/g)].map(m=>m[1]));assert.deepEqual([...tokens],['32fvjbkh']);for(const t of tokens)assert(html.includes('data-astro-cid-'+t));
});
check('captured baseline modules remain byte-identical',async()=>{
 for(const [relative,expected]of Object.entries(manifest.sourceFiles))assert.equal(hash(await fs.readFile(path.join(source,relative))),expected,relative);
});
process.once('beforeExit',()=>{if(checks===8)fs.writeFile(path.join(dir,'TEST-RESULT.json'),JSON.stringify({state:'PASS',checksPassed:checks,testsRunAgainst:'actual serveSpeech handlers and embedded asset functions',networkRequests:0,formsSubmitted:0,phoneCalls:0,capturedBaselineModified:false},null,2));});
