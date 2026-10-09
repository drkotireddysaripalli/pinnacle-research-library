import test from 'node:test';
import assert from 'node:assert/strict';
import {readingContent} from '../deployment/therapy-reading-content.mjs';
import {readingEntry,addTherapyReading,READING_RELEASE} from '../deployment/therapy-reading.mjs';
import {serveSpeech} from '../deployment/speech-handler.mjs';
import {updateReadingMarkdown} from './therapy-reading-markdown.mjs';
for(const newline of ['\n','\r\n'])test(`public reading build replaces its existing section with ${JSON.stringify(newline)} input`,()=>{
 const markdown='\n\n## Reading\n\nCurrent book links\n';
 const prior='Original care\n\n## Reading\n\nOld book links\n\n## Reading\n\nDuplicate book links\n';
 const actual=updateReadingMarkdown(prior.replaceAll('\n',newline),'Reading',markdown);
 assert.equal(actual,'Original care'+markdown);
 assert.equal(updateReadingMarkdown(actual,'Reading',markdown),actual);
});
for(const [kind,content] of Object.entries(readingContent)){
 const key=`/pinnacle-pages-html/${kind==='speech'?'speech':'occupational-therapy'}.html`;
 const fixture=`<html><head><link rel="canonical" href="https://www.pinnacleblooms.org${content.path}"></head><body><a href="tel:+919100181181">Call</a><section id="${content.anchor}">Preserved care</section></body></html>`;
 const entry=readingEntry(content.path,key);
 test(`${kind}: exact insertion, original care intact and idempotent`,()=>{
  const result=addTherapyReading(fixture,entry);
  assert.equal(result.replace(content.html,''),fixture);
  assert(result.includes(content.html));assert.equal(addTherapyReading(result,entry),result);
  assert.equal(addTherapyReading(fixture.replace(content.path,'/unrelated'),entry),fixture.replace(content.path,'/unrelated'));
  const duplicate=fixture.replace('</body>',`<section id="${content.anchor}"></section></body>`);
  assert.equal(addTherapyReading(duplicate,entry),duplicate);
  const missing=fixture.replace(`id="${content.anchor}"`,'id="other"');assert.equal(addTherapyReading(missing,entry),missing);
  assert.match(content.html,/loading="lazy"/);assert.match(content.html,/\/cdn-cgi\/image\/width=400/);
  assert.match(content.html,/Read the free English sample/);assert.match(content.html,/complete books are sold separately/);
  assert.equal((content.html.match(/hreflang=/g)||[]).length,3);assert(!content.html.includes('<script'));
 });
 test(`${kind}: GET, HEAD, conditional and private-cache behavior`,async()=>{
  const env={ASSETS:{fetch:async()=>new Response(fixture,{headers:{'content-length':String(Buffer.byteLength(fixture)),'last-modified':'Mon, 28 Sep 2026 00:00:00 GMT'}})}};
  const request=(headers={},method='GET')=>new Request('https://www.pinnacleblooms.org'+content.path,{headers,method});
  const response=await serveSpeech(request({'if-none-match':'"speech-original"'}),env,{[key]:'original'});
  assert.equal(response.status,200);assert.equal(response.headers.get('content-length'),null);assert.equal(response.headers.get('last-modified'),null);
  assert.equal(response.headers.get('x-pinnacle-reading'),READING_RELEASE);const delivered=await response.text();if(kind==='occupational'){assert.match(delivered,/data-therapy-reading="occupational"/);assert(delivered.includes(content.html.match(/<h2[^>]*>(.*?)<\/h2>/)[1]));// Scoped callback styles are legitimate; keep the runtime reading-widget CSS guard.
  const readingStyle=content.html.match(/<style>([\s\S]*?)<\/style>/)?.[0];if(readingStyle)assert(!delivered.includes(readingStyle));}else assert(delivered.includes(content.html));
  const etag=response.headers.get('etag');assert(etag.includes(READING_RELEASE));
  const conditional=await serveSpeech(request({'if-none-match':etag}),env,{[key]:'original'});assert.equal(conditional.status,304);
  const head=await serveSpeech(request({},'HEAD'),env,{[key]:'original'});assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),etag);
  const privateResponse=await serveSpeech(request({cookie:'session=fixture','if-none-match':etag}),env,{[key]:'original'});
  assert.equal(privateResponse.status,200);assert.equal(privateResponse.headers.get('cache-control'),'private, no-store');
 });
 test(`${kind}: equivalent reading aid, no duplicate text`,()=>{
  const textKey=kind==='speech'?'/pinnacle-pages-data/speech-llms.txt':'/pinnacle-pages-data/occupational-therapy-machine.md';
  const textEntry=readingEntry(textKey,textKey),result=addTherapyReading('Original reading aid\n',textEntry);
  assert(result.startsWith('Original reading aid'));assert(result.includes(content.markdown));assert.equal(addTherapyReading(result,textEntry),result);
 });
}
test('unrelated content and existing aliases retain behavior',async()=>{
 assert.equal(readingEntry('/ask','/ask.html'),null);assert.equal(readingEntry('/pinnacleai','/pinnacle-pages-html/pinnacleai.html'),null);
 assert.equal(addTherapyReading('original',null),'original');
 for(const alias of ['/speech-therapy','/occupational-therapy']){
  const r=await serveSpeech(new Request('https://www.pinnacleblooms.org'+alias+'?source=parent'),{},{});assert.equal(r.status,301);assert(r.headers.get('location').endsWith('?source=parent'));
 }
});
