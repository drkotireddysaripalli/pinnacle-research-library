import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import worker, { HELPLINE_HTML, HELPLINE_ETAG, HELPLINE_ASSETS, CANONICAL_URL } from './worker.mjs';

const results = [];
async function check(name, run) { await run(); results.push({name, passed:true}); }
const request = (path = '', options = {}) => new Request(CANONICAL_URL + path, options);
await check('GET serves the static page and correct canonical', async () => {
  const r = await worker.fetch(request()); assert.equal(r.status,200);
  assert.match(r.headers.get('content-type'),/text\/html/);
  const html = await r.text(); assert.equal(html, HELPLINE_HTML);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
  assert.ok(html.includes('<link rel="canonical" href="'+CANONICAL_URL+'">'));
});
await check('HEAD returns headers and no body', async () => { const r=await worker.fetch(request('',{method:'HEAD'})); assert.equal(r.status,200); assert.equal(await r.text(),''); assert.equal(r.headers.get('etag'),HELPLINE_ETAG); });
await check('Trailing slash redirects to the one canonical page', async () => { const r=await worker.fetch(request('/')); assert.equal(r.status,301); assert.equal(r.headers.get('location'),CANONICAL_URL); });
await check('Non-canonical scheme redirects', async () => { const r=await worker.fetch(new Request(CANONICAL_URL.replace('https:','http:'))); assert.equal(r.status,301); assert.equal(r.headers.get('location'),CANONICAL_URL); });
await check('Unrelated paths, suffix paths and wrong hosts return 404', async () => {
  for(const url of ['https://www.pinnacleblooms.org/contact','https://www.pinnacleblooms.org/national-autism-helpline-extra',CANONICAL_URL+'/child-record','https://other.example/national-autism-helpline']) assert.equal((await worker.fetch(new Request(url))).status,404);
});
await check('POST is refused without collecting a form', async () => { const r=await worker.fetch(request('',{method:'POST',body:'test'})); assert.equal(r.status,405); assert.equal(r.headers.get('allow'),'GET, HEAD'); });
await check('ETag validator returns 304 without a body', async () => { const r=await worker.fetch(request('',{headers:{'If-None-Match':'W/'+HELPLINE_ETAG}})); assert.equal(r.status,304); assert.equal(await r.text(),''); });
await check('Query parameters do not change or enter page output', async () => {const r=await worker.fetch(request('?test_private_marker=do-not-reflect')); assert.equal(await r.text(),HELPLINE_HTML); });
await check('Single URL sitemap supports GET and HEAD', async () => { const r=await worker.fetch(request('/sitemap.xml')); assert.equal(r.status,200); assert.match(r.headers.get('content-type'),/application\/xml/); const xml=await r.text(); assert.equal((xml.match(/<loc>/g)||[]).length,1); assert.ok(xml.includes('<loc>'+CANONICAL_URL+'</loc>')); const head=await worker.fetch(request('/sitemap.xml',{method:'HEAD'})); assert.equal(head.status,200); assert.equal(await head.text(),''); });
await check('CSP allows same-origin images and embedded fonts without external sources', async () => {
  const r=await worker.fetch(request()); const csp=r.headers.get('content-security-policy');
  assert.match(csp,/(?:^|;\s*)img-src 'self'(?:;|$)/); assert.match(csp,/(?:^|;\s*)font-src data:(?:;|$)/);
  assert.match(csp,/default-src 'none'/); assert.match(csp,/script-src 'sha256-[^']+'/); assert.doesNotMatch(csp,/https?:|\*/);
});
await check('Unknown image paths and non-image paths return no-store404 without fetching', async () => {
  const originalFetch=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('Static asset routing must not fetch a remote origin');};
  try {
    for(const suffix of ['/assets/missing-artwork.webp','/assets/','/assets/page.html','/assets/__proto__','/assets/missing-artwork.webp/extra']) {
      assert.ok(!Object.hasOwn(HELPLINE_ASSETS,'/national-autism-helpline'+suffix));
      for(const method of ['GET','HEAD']){const r=await worker.fetch(request(suffix,{method})); assert.equal(r.status,404);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(r.headers.get('x-robots-tag'),'noindex');if(method==='HEAD')assert.equal(await r.text(),'');}
    }
  } finally { globalThis.fetch=originalFetch; }
});
const assetEntries=Object.entries(HELPLINE_ASSETS);
if(assetEntries.length) {
  await check('Every embedded image serves exact bytes, safe MIME and matching GET/HEAD headers', async () => {
    for(const [assetPath,asset] of assetEntries) {
      const url='https://www.pinnacleblooms.org'+assetPath;
      const r=await worker.fetch(new Request(url)); assert.equal(r.status,200);
      assert.deepEqual(Buffer.from(await r.arrayBuffer()),Buffer.from(asset.base64,'base64'));
      assert.equal(r.headers.get('content-type'),asset.contentType); assert.equal(r.headers.get('content-length'),String(asset.byteLength));
      assert.equal(r.headers.get('etag'),asset.etag); assert.equal(r.headers.get('cache-control'),'public, max-age=300'); assert.equal(r.headers.get('x-content-type-options'),'nosniff');
      assert.match(r.headers.get('content-security-policy'),/default-src 'none'/);
      const head=await worker.fetch(new Request(url,{method:'HEAD',headers:{'Content-Length':'0'}})); assert.equal(head.status,200); assert.equal(await head.text(),'');
      for(const header of ['content-type','content-length','etag','cache-control','referrer-policy','content-security-policy'])assert.equal(head.headers.get(header),r.headers.get(header));
      const query=await worker.fetch(new Request(url+'?private_marker=not-reflected')); assert.deepEqual(Buffer.from(await query.arrayBuffer()),Buffer.from(asset.base64,'base64'));
    }
  });
  await check('Asset validators, method limits, canonical scheme and host guards work', async () => {
    const [assetPath,asset]=assetEntries[0], url='https://www.pinnacleblooms.org'+assetPath;
    for(const method of ['GET','HEAD'])for(const validator of [asset.etag,'W/'+asset.etag,'"unrelated", W/'+asset.etag,'*']){
      const r=await worker.fetch(new Request(url,{method,headers:{'If-None-Match':validator}})); assert.equal(r.status,304);assert.equal(await r.text(),'');assert.equal(r.headers.get('etag'),asset.etag);
    }
    const changed=await worker.fetch(new Request(url,{headers:{'If-None-Match':'"unrelated"'}}));assert.equal(changed.status,200);
    const post=await worker.fetch(new Request(url,{method:'POST',body:'not-collected'}));assert.equal(post.status,405);assert.equal(post.headers.get('allow'),'GET, HEAD');
    const redirect=await worker.fetch(new Request(url.replace('https:','http:')));assert.equal(redirect.status,301);assert.equal(redirect.headers.get('location'),url);
    assert.equal((await worker.fetch(new Request('https://other.example'+assetPath))).status,404);
  });
} else results.push({name:'Embedded asset GET/HEAD and conditional response checks',passed:false,skipped:true,reason:'No image assets bundled; rerun once images are present.'});
await check('Every page image references an explicitly bundled same-origin asset', async () => {
  for(const match of HELPLINE_HTML.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
    const url=new URL(match[1],CANONICAL_URL);assert.equal(url.origin,'https://www.pinnacleblooms.org');assert.ok(Object.hasOwn(HELPLINE_ASSETS,url.pathname),'Image not bundled: '+url.pathname);
  }
});
await check('Every call link uses the one international phone target', async () => {const matches=[...HELPLINE_HTML.matchAll(/href="(tel:[^"]+)"/g)].map(m=>m[1]); assert.ok(matches.length>=5); assert.ok(matches.every(x=>x==='tel:+919100181181'));});
await check('No forms, executable scripts, trackers, external assets or unresolved placeholders', async () => { assert.doesNotMatch(HELPLINE_HTML,/<form\b|<iframe\b|<script(?! type="application\/ld\+json")|\son[a-z]+\s*=|@@/i); assert.doesNotMatch(HELPLINE_HTML,/(?:src|srcset)="https?:|url\(['"]?https?:|googletagmanager|google-analytics|facebook\.net/i); });
await check('Five service cards and seven journey steps exist', async () => {assert.equal((HELPLINE_HTML.match(/class="service"/g)||[]).length,5); assert.equal((HELPLINE_HTML.match(/class="step-no"/g)||[]).length,7);});
await check('Structured data is factual and exactly matches the visible FAQ', async () => {
  const schema=JSON.parse(HELPLINE_HTML.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const org=schema['@graph'].find(x=>x['@type']==='Organization'), page=schema['@graph'].find(x=>Array.isArray(x['@type'])&&x['@type'].includes('FAQPage')), contact=schema['@graph'].find(x=>x['@type']==='ContactPoint'), service=schema['@graph'].find(x=>x['@type']==='Service');
  assert.equal(org.name,'Bharath Healthcare Laboratories Private Limited'); assert.equal(contact.telephone,'+919100181181'); assert.equal(page.url,CANONICAL_URL);
  assert.equal(service.provider['@id'],org['@id']); assert.equal(service.availableChannel.servicePhone['@id'],contact['@id']); assert.equal(page.mainEntity.length,10);
  for(const q of page.mainEntity){assert.ok(HELPLINE_HTML.includes('<summary>'+q.name+'</summary>'));assert.ok(HELPLINE_HTML.includes(q.acceptedAnswer.text));}
  assert.ok(!JSON.stringify(schema).includes('GovernmentService')); assert.ok(!JSON.stringify(schema).includes('reviewedBy'));
});
await check('Public exports match service identity and reject unsupported methods', async()=>{
  for(const suffix of ['/facts.json','/facts.txt','/llms.txt']){
    const r=await worker.fetch(request(suffix)); assert.equal(r.status,200); const text=await r.text(); assert.ok(text.includes('9100 181 181'));assert.ok(text.includes('Pinnacle'));
    assert.equal((await worker.fetch(request(suffix,{method:'POST'}))).status,405);
    assert.equal(await (await worker.fetch(request(suffix,{method:'HEAD'}))).text(),'');
  }
  const facts=await (await worker.fetch(request('/facts.json'))).json(); assert.equal(facts.questions.length,10);assert.equal(facts.telephone,'+919100181181');assert.deepEqual(facts.telephoneLanguages,['English','Telugu','Hindi']);
});
const report={time:new Date().toISOString(),passed:results.filter(result=>result.passed).length,skipped:results.filter(result=>result.skipped).length,assetCount:assetEntries.length,assetBytes:assetEntries.reduce((total,[,asset])=>total+asset.byteLength,0),htmlBytes:Buffer.byteLength(HELPLINE_HTML),gzipBytes:gzipSync(HELPLINE_HTML).length,results,visualReview:'Pending root browser review; local server provided.'};
await writeFile(new URL('./readiness-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
