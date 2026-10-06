import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {Miniflare, convertV4MiniflareOptions} from 'miniflare';
import {repairSchemaText, repairLegacyGraph, SCHEMA_LIMIT} from '../deployment/legacy-social-metadata/schema.mjs';
import {repairLegacyIdentity, organization} from '../deployment/legacy-social-metadata/organization.mjs';
import {isMissingMedia,BRAND_IMAGE} from '../deployment/legacy-social-metadata/media.mjs';

test('missing portraits are omitted from schema without substituting a logo as a person image',()=>{
 const image='https://www.pinnacleblooms.org/Images/ProfileImages/20708623831.jpg';
 for(const raw of [`{"@context":"https://schema.org","image":"${image}","@type":"Physician","identifier":90071992547409931234}`,`{"@context":"https://schema.org","@type":"Physician","image":"${image}"}`]){
  const out=repairSchemaText(raw);assert.equal(JSON.parse(out).image,undefined);assert(!out.includes(BRAND_IMAGE));if(raw.includes('90071992547409931234'))assert(out.includes('90071992547409931234'));
 }
 assert(!isMissingMedia('https://other.example/Images/ProfileImages/20708623831.jpg'));
 const normal='{"@context":"https://schema.org","@type":"Person","image":"https://www.pinnacleblooms.org/Images/ProfileImages/keep.jpg"}';assert.equal(repairSchemaText(normal),normal);
});

test('edge media repair changes exact dead images and retains working images and page content',async()=>{
 const {outputFiles}=await build({stdin:{contents:`import {repairKnownBrokenMedia} from './deployment/legacy-social-metadata/media.mjs';export default {fetch(){return repairKnownBrokenMedia(new Response('<html><head><meta property="og:image" content="https://www.pinnacleblooms.org/Images/ProfileImages/20708623831.jpg"></head><body><h1>Published profile</h1><img src="/Images/ProfileImages/20708623831.jpg" srcset="bad.jpg 2x" alt="Portrait"><img src="/keep.jpg" alt="Keep"></body></html>',{headers:{'content-type':'text/html','cache-control':'private, max-age=60'}}));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
 const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:outputFiles[0].text}));
 try{const r=await runtime.dispatchFetch('https://example.test'),t=await r.text();assert(t.includes('Pinnacle Blooms Network logo'));assert(t.includes('src="'+BRAND_IMAGE+'"'));assert(t.includes('<h1>Published profile</h1>'));assert(t.includes('<img src="/keep.jpg" alt="Keep">'));assert(!t.includes('srcset='));assert.equal(r.headers.get('cache-control'),'private, max-age=60');}finally{await runtime.dispose();}
});

const sample = {'@context':'https://schema.org', '@type':'Webpage', name:'తెలుగు family', description:'The text Webpage and xPath must remain.', speakable:{'@type':'SpeakableSpecification',xPath:['/html/head/title']}};
test('corrects only term spelling, retaining values and Unicode',()=>{
  const out=JSON.parse(repairSchemaText(JSON.stringify(sample)));
  assert.deepEqual(out,{...sample,'@type':'WebPage',speakable:{'@type':'SpeakableSpecification',xpath:['/html/head/title']}});
});
test('unknown context, malformed JSON, oversized scripts, competing keys and correct JSON pass through',()=>{
  for(const text of ['broken JSON',JSON.stringify({...sample,'@context':'https://example.org'}),' '.repeat(SCHEMA_LIMIT)+JSON.stringify(sample),JSON.stringify({'@context':'https://schema.org','@type':'SpeakableSpecification',xPath:['old'],xpath:['keep']}),JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:'Correct'})]) assert.equal(repairSchemaText(text),text);
});
test('graph and array nesting; all unrelated bytes stay exact',()=>{
  const text=JSON.stringify({'@context':'http://schema.org/','@graph':[{'@type':'Webpage',name:'<script>Text & 中文'}]});
  const out=repairSchemaText(text);assert.equal(out,text.replace('"Webpage"','"WebPage"'));assert.equal(JSON.parse(out)['@graph'][0].name,'<script>Text & 中文');assert.equal(JSON.parse(out)['@graph'][0]['@type'],'WebPage');
  assert.equal(JSON.parse(repairSchemaText(JSON.stringify([sample])))[0]['@type'],'WebPage');
});
test('nested foreign/reset contexts and duplicate keys pass through unchanged',()=>{
  for(const context of ['https://example.org/vocab',null,{'@vocab':'https://schema.org/'}]){
    const text=JSON.stringify({'@context':'https://schema.org','@type':'Webpage',child:{'@context':context,'@type':'Webpage'}});assert.equal(repairSchemaText(text),text);
  }
  const text='{"@context":"https://schema.org","@type":"Webpage","name":"A","name":"B"}';assert.equal(repairSchemaText(text),text);
});
test('large numeric identifiers, decimal precision and escapes stay byte-exact',()=>{
  const text='{"@context":"https://schema.org","@type":"Webpage","identifier":9007199254740993,"value":0.123456789012345678901,"text":"\\u003cText"}';
  assert.equal(repairSchemaText(text),text.replace('"Webpage"','"WebPage"'));
});

test('known book and page entities have valid types without changing names or precision',()=>{
  const text='{"@context":"https://schema.org","@type":"Book","author":"Dr. Sreeja Reddy Saripalli","publisher":"notionpress","identifier":9007199254740993,"name":"తెలుగు"}';
  assert.equal(repairSchemaText(text),text.replace('"author":"Dr. Sreeja Reddy Saripalli"','"author":{"@type":"Person","name":"Dr. Sreeja Reddy Saripalli"}').replace('"publisher":"notionpress"','"publisher":{"@type":"Organization","name":"notionpress"}'));
  const page='{"@context":"https://schema.org","@type":"WebPage","publisher":"Pinnacle"}';
  assert.equal(JSON.parse(repairSchemaText(page)).publisher['@type'],'Organization');
  const unknown=text.replace('Dr. Sreeja Reddy Saripalli','Unknown author').replace('notionpress','Unknown publisher');
  assert.equal(repairSchemaText(unknown),unknown);
});

test('captured valid-but-outdated organisation is replaced only on an exact match',async()=>{
  const text=await fs.readFile('tests/fixtures/legacy-organization-valid-outdated.txt','utf8');
  assert.deepEqual(JSON.parse(await repairLegacyIdentity(text)),organization);
  const changed=text.replace('Koti Reddy Saripalli','Changed source name');
  assert.notEqual(changed,text);assert.equal(await repairLegacyIdentity(changed),changed);
});

test('captured physiotherapy collection becomes valid JSON with canonical identities and unchanged content',async()=>{
  const input=await fs.readFile('tests/fixtures/legacy-physiotherapy-collection.txt','utf8');
  const canonical='https://www.pinnacleblooms.org/physiotherapy',origin=canonical.replace('https:','http:');
  const source=JSON.parse(input.replace('//begin bracket for multiple entries under image','').replace('//end bracket for ImageGallery > image(s)','').replace('//end bracket for mainEntityOfPage',''));
  for(const query of ['', '?utm_source=release&utm_medium=email&utm_campaign=parent-guide','?utm_source=release&amp;utm_medium=email&amp;utm_campaign=parent-guide','?utm_source=release&amp;amp;utm_medium=email&amp;amp;utm_campaign=parent-guide']){
    const output=JSON.parse(await repairLegacyGraph(input.replaceAll(origin,origin+query)));
    assert.deepEqual(output,{...Object.fromEntries(Object.entries(source).filter(([k])=>k!=='id')),'@context':'https://schema.org',url:canonical,'@id':canonical});
  }
  for(const changed of [input.replace('Best Physio Therapy','Changed source text'),input.replaceAll('/physiotherapy','/other'),input.replaceAll('http://www.pinnacleblooms.org/physiotherapy','http://other.example/physiotherapy'),input.replace('//end bracket for mainEntityOfPage','//different comment')])assert.equal(await repairLegacyGraph(changed),changed);
});

test('two captured physiotherapy WebPage identities are canonical only in the guarded page scope',async()=>{
  const canonical='https://www.pinnacleblooms.org/physiotherapy',origin=canonical.replace('https:','http:');
  for(const index of [5,7]){
    const raw=await fs.readFile(`tests/fixtures/legacy-physiotherapy-webpage-${index}.txt`,'utf8');
    for(const query of ['', '?utm_source=release&utm_medium=email&gclid=fixture']){
      for(const encoded of [query,query.replaceAll('&','&amp;'),query.replaceAll('&','&amp;amp;')]){
        const input=raw.replaceAll(origin,origin+encoded),out=await repairLegacyGraph(input,canonical+query);
        assert.equal(out,raw.replaceAll(origin,canonical));
        assert.equal(await repairLegacyGraph(out,canonical+query),out);
      }
    }
    for(const scope of [undefined,'https://www.pinnacleblooms.org/other','http://www.pinnacleblooms.org/physiotherapy','https://other.example/physiotherapy'])assert.equal(await repairLegacyGraph(raw,scope),raw);
    const mismatch=raw.replaceAll(origin,origin+'?utm_source=other');assert.equal(await repairLegacyGraph(mismatch,canonical+'?utm_source=release'),mismatch);
    const malformed=raw.replace(origin,'\\q');assert.equal(await repairLegacyGraph(malformed,canonical),malformed);
    for(const query of ['?service=speech','?lang=te','?unknown=fixture']){
      const input=raw.replaceAll(origin,origin+query);assert.equal(await repairLegacyGraph(input,canonical+query),input);
    }
    for(const changed of [raw.replace('Best Physio Therapy','Changed Physio Therapy').replace('Physio-Therapy','Changed Therapy'),raw.replaceAll(origin,'http://other.example/physiotherapy'),raw.replaceAll(origin,origin+'#other')])assert.equal(await repairLegacyGraph(changed,canonical),changed);
  }
});

test('Cloudflare streamed response, source fixtures and bypasses',async t=>{
  let fixture, chunkSize=7, sourceHeaders={};
  const bundled=await build({stdin:{contents:`import {handle} from './deployment/legacy-social-metadata/entry.mjs';export default {fetch(r,env){return handle(r,q=>env.ORIGIN.fetch(q));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
  const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:bundled.outputFiles[0].text,serviceBindings:{ORIGIN:async()=>{
    const bytes=Buffer.from(fixture);let pos=0;
    return new Response(new ReadableStream({pull(c){if(pos===bytes.length){c.close();return;}const end=Math.min(pos+chunkSize,bytes.length);c.enqueue(bytes.subarray(pos,end));pos=end;}}),{headers:{'content-type':'text/html; charset=utf-8',...sourceHeaders}});
  }}}));
  const prefix='<html><head><link rel="canonical" href="https://www.pinnacleblooms.org/physiotherapy"><meta property="og:url" content="http://www.pinnacleblooms.org/physiotherapy"></head><body>';
  const raw=JSON.stringify(sample);
  const original=prefix+'<h1>Family 🌸</h1><script type="application/ld+json">'+raw+'</script><script>const text="Webpage";</script><footer>Approved footer</footer></body></html>';
  try{
    await t.test('chunked content keeps rendered HTML and unrelated JavaScript intact',async()=>{
      fixture=original;const r=await runtime.dispatchFetch('https://www.pinnacleblooms.org/physiotherapy');const out=await r.text();
      assert.equal(out,original.replace('content="http:','content="https:').replace(raw,repairSchemaText(raw)));assert(r.headers.has('x-pinnacle-legacy-schema'));
    });
    await t.test('correct social URL still allows the independent schema repair',async()=>{
      fixture=original.replace('content="http:','content="https:');
      const r=await runtime.dispatchFetch('https://www.pinnacleblooms.org/physiotherapy');
      assert.equal(await r.text(),fixture.replace(raw,repairSchemaText(raw)));
      assert.equal(r.headers.get('x-pinnacle-social-metadata'),null);
      assert.equal(r.headers.get('x-pinnacle-legacy-schema'),'schema-entity-types-20261006');
    });
    await t.test('captured collection in campaign response preserves query, call link and visible HTML',async()=>{
      const captured=await fs.readFile('tests/fixtures/legacy-physiotherapy-collection.txt','utf8');
      const query='?utm_source=release&utm_medium=email&utm_campaign=parent-guide';
      const payload=captured.replaceAll('http://www.pinnacleblooms.org/physiotherapy','http://www.pinnacleblooms.org/physiotherapy'+query.replaceAll('&','&amp;'));
      const visible='<h1>Family 🌸</h1><a href="tel:9100181181">Call Pinnacle</a><footer>Approved footer</footer>';
      fixture=prefix.replaceAll('/physiotherapy"','/physiotherapy'+query.replaceAll('&','&amp;')+'"')+visible+'<script type="application/ld+json">'+payload+'</script></body></html>';
      const response=await runtime.dispatchFetch('https://www.pinnacleblooms.org/physiotherapy'+query),out=await response.text();
      assert(out.includes(visible));assert.equal(JSON.parse(out.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]).url,'https://www.pinnacleblooms.org/physiotherapy');
      assert(out.includes('href="https://www.pinnacleblooms.org/physiotherapy"'));assert(response.headers.has('x-pinnacle-legacy-schema'));
    });
    await t.test('both captured WebPage scripts retain all other bytes and source query while correcting identities',async()=>{
      const canonical='https://www.pinnacleblooms.org/physiotherapy',origin=canonical.replace('https:','http:');
      const query='?utm_source=release&utm_medium=email&gclid=fixture';
      const scripts=await Promise.all([5,7].map(index=>fs.readFile(`tests/fixtures/legacy-physiotherapy-webpage-${index}.txt`,'utf8')));
      const visible='<h1>Current clinical copy</h1><a href="tel:9100181181">Call</a><a href="/enroll?service=speech&centre=suchitra">Enrol</a><footer>Approved footer</footer>';
      for(const campaign of ['',query]){
        fixture=prefix.replaceAll('/physiotherapy"','/physiotherapy'+campaign.replaceAll('&','&amp;')+'"')+visible+scripts.map(raw=>'<script type="application/ld+json">'+raw.replaceAll(origin,origin+campaign.replaceAll('&','&amp;'))+'</script>').join('')+'</body></html>';
        const out=await(await runtime.dispatchFetch(canonical+campaign)).text();
        const expected=prefix.replace('content="http:','content="https:')+visible+scripts.map(raw=>'<script type="application/ld+json">'+raw.replaceAll(origin,canonical)+'</script>').join('')+'</body></html>';
        assert.equal(out,expected);
      }
    });
    await t.test('malformed URL tokens and clean-head functional queries preserve schema without breaking the stream',async()=>{
      const canonical='https://www.pinnacleblooms.org/physiotherapy',origin=canonical.replace('https:','http:');
      const raw=await fs.readFile('tests/fixtures/legacy-physiotherapy-webpage-5.txt','utf8');
      const head=prefix.replace('content="http:','content="https:');
      for(const [query,payload]of [['',raw.replace(origin,'\\q')],['?service=speech',raw.replaceAll(origin,origin+'?service=speech')],['?unknown=fixture',raw.replaceAll(origin,origin+'?unknown=fixture')]]){
        fixture=head+'<h1>Preserved family guidance</h1><script type="application/ld+json">'+payload+'</script></body></html>';
        assert.equal(await(await runtime.dispatchFetch(canonical+query)).text(),fixture);
      }
    });
    await t.test('malformed and over-limit JSON-LD preserved byte for byte',async()=>{
      for(const text of ['{bad json}', ' '.repeat(SCHEMA_LIMIT)+raw]){
        fixture=original.replace(raw,text);chunkSize=4096;
        const out=await (await runtime.dispatchFetch('https://www.pinnacleblooms.org/physiotherapy')).text();assert.equal(out,fixture.replace('content="http:','content="https:'));
      }
    });
    await t.test('existing auth/privacy/route guards retain source bytes',async()=>{
      fixture=original;chunkSize=4096;
      for(const [url,headers,responseHeaders]of [['/ask',{},{}],['/physiotherapy',{authorization:'Bearer fixture'},{}],['/physiotherapy',{}, {'cache-control':'no-store'}],['/physiotherapy',{}, {'set-cookie':'session=fixture'}]]){
        sourceHeaders=responseHeaders;const r=await runtime.dispatchFetch('https://www.pinnacleblooms.org'+url,{headers});assert.equal(await r.text(),fixture);assert.equal(r.headers.get('x-pinnacle-legacy-schema'),null);
      }
      sourceHeaders={};
    });
    if(process.env.LEGACY_SCHEMA_FIXTURES){
      const rows=JSON.parse(await fs.readFile(path.join(process.env.LEGACY_SCHEMA_FIXTURES,'before-public.json'),'utf8'));
      for(const row of rows.filter(x=>x.target))await t.test('captured current production '+row.name,async()=>{
        fixture=await fs.readFile(path.join(process.env.LEGACY_SCHEMA_FIXTURES,'before',row.name+'.html'),'utf8');
        // Public capture already has prior og:url correction; simulate its exact origin value.
        fixture=fixture.replace('content="'+row.canonical+'"','content="'+row.canonical.replace(/^https:/,'http:')+'"');
        const expected=fixture.replace('content="http://www.pinnacleblooms.org','content="https://www.pinnacleblooms.org').replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/gi,(_,open,body,close)=>open+repairSchemaText(body)+close);
        const out=await (await runtime.dispatchFetch(row.url)).text();assert.equal(out,expected);
      });
    }
  }finally{await runtime.dispose();}
});
