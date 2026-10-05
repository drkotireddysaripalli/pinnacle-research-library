import test from 'node:test';
import assert from 'node:assert/strict';
import {serveSpeech,PUBLIC_DOCUMENT_ROUTES,isRetiredLeadershipPath} from '../deployment/speech-handler.mjs';
import {aboutAsset,aboutHash} from '../deployment/about-assets.mjs';
const origin='https://www.pinnacleblooms.org';
for(const[path,id]of Object.entries(PUBLIC_DOCUMENT_ROUTES)){
 const md=id+(['self-sufficient','mainstream','about','leadership','framework'].includes(id)?'-machine.md':'-policy.md');
 const inv={['/pinnacle-pages-html/'+id+'.html']:'public',['/pinnacle-pages-data/'+md]:'reading'};
 let assetRequest;
 const env={ASSETS:{fetch:async r=>{assetRequest=r;return new Response(r.method==='HEAD'?null:r.url.endsWith('.md')?'# reading':'public');}}};
 test(id+': current representation for clean, returning and credentialed public visitors',async()=>{
  for(const headers of [{},{cookie:'_gcl_au=fixture; __Host-appgarden-visitor=fixture; _ga=fixture'},{cookie:'session=fixture; unknown=fixture'},{cookie:'CF_Authorization=fixture'},{authorization:'Bearer fixture'},{range:'bytes=0-1'},{'cache-control':'no-transform'}]){
   for(const[method,accept,expected]of [['GET','text/html','public'],['GET','text/markdown','# reading'],['HEAD','text/html','']]){
    const r=await serveSpeech(new Request(origin+path,{method,headers:{...headers,accept}}),env,inv);
    assert.equal(r.status,200);assert.equal(await r.text(),id==='about'&&method!=='HEAD'?await aboutAsset('/pinnacle-pages-'+(accept==='text/markdown'?'data/about-machine.md':'html/about.html'),'GET').text():expected);assert.equal(r.headers.get('vary'),'Accept');
    if(id!=='about')for(const header of ['cookie','authorization','range'])assert.equal(assetRequest.headers.has(header),false);else assert.equal(assetRequest,undefined,'Compiled About must not fall back to an old asset');
    assert(r.headers.get('cache-control').includes(headers.cookie||headers.authorization?'private, no-store':'public, max-age=0, must-revalidate'));
   }
   const alias=await serveSpeech(new Request(origin+path+'/?x=one',{headers}),env,inv);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),origin+path+'?x=one');if(headers.cookie||headers.authorization)assert.equal(alias.headers.get('cache-control'),'private, no-store');
  }
 });
 test(id+': credentials never304; adjacent private/application paths preserve origin',async()=>{
  for(const headers of [{cookie:'session=fixture'},{authorization:'fixture'}])assert.equal((await serveSpeech(new Request(origin+path,{headers:{...headers,'if-none-match':id==='about'?'"speech-'+aboutHash('/pinnacle-pages-html/about.html')+'"':'"speech-public"'}}),env,inv)).status,200);
  assert.equal((await serveSpeech(new Request(origin+path,{headers:{'if-none-match':id==='about'?'"speech-'+aboutHash('/pinnacle-pages-html/about.html')+'"':'"speech-public"'}}),env,inv)).status,304);
  for(const headers of [{},{cookie:'session=fixture'},{authorization:'fixture'},{range:'bytes=0-1'}])assert.equal(await serveSpeech(new Request(origin+path+'/private',{headers}),env,inv),null);
  assert.equal(await serveSpeech(new Request(origin+path,{method:'POST'}),env,inv),null);
 });
}
test('uppercase leadership index converges; exact retired profiles/portraits410; retained/application neighbours stay outside',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('current')}},inv={'/pinnacle-pages-html/leadership.html':'public'};
 for(const path of ['/Leadership','/Leadership/','/LEADERSHIP']){const r=await serveSpeech(new Request(origin+path+'?entry=old',{headers:{cookie:'unknown=fixture'}}),env,inv);assert.equal(r.status,301);assert.equal(r.headers.get('location'),origin+'/leadership?entry=old');assert.equal(r.headers.get('cache-control'),'private, no-store');}
 for(const slug of ['Prudhvi-Matsa','prudhvi-masta','Maheshwari','Shoban-Kumar','sobhan-kumar'])for(const prefix of ['/Leadership/','/leadership/'])for(const suffix of ['','/'])for(const method of ['GET','HEAD']){
  const path=prefix+slug+suffix;assert(isRetiredLeadershipPath(path));const r=await serveSpeech(new Request(origin+path,{method,headers:{cookie:'session=fixture',authorization:'fixture'}}),env,inv);assert.equal(r.status,410);assert.equal(r.headers.get('cache-control'),'no-store');assert(r.headers.get('x-robots-tag').includes('noindex'));const text=await r.text();assert.equal(/Prudhvi|Maheshwari|Shoban|Sobhan/i.test(text),false);if(method==='HEAD')assert.equal(text,'');
 }
 for(const path of ['/Images/LeadershipImages/prudhvi_big_image.jpeg','/Images/leadershipimages/maheshwari_big_image.png','/Images/LeadershipImages/shoban_big_image.jpeg','/leadership/%6daheshwari','/leadership/Prudhvi%2dMatsa','/Images/LeadershipImages/%6daheshwari_big_image.png'])assert.equal((await serveSpeech(new Request(origin+path),env,inv)).status,410);
 for(const path of ['/leadership/dr-koti-reddy-saripalli','/leadership/dr-sreeja-reddy-saripalli','/leadership/private','/Images/LeadershipImages/koti_1000.jpg','/epass','/payonline','/api/sendotp'])assert.equal(await serveSpeech(new Request(origin+path,{headers:{cookie:'session=fixture',authorization:'fixture'}}),env,inv),null);
});

test('Books public billing policy converges; private and payment neighbours retain their existing handler',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('current')}};
 for(const path of ['/payment-and-billing','/payment-and-billing/'])for(const method of ['GET','HEAD'])for(const headers of [{},{cookie:'session=fixture'},{authorization:'fixture'}]){
  const r=await serveSpeech(new Request('https://books.pinnacleblooms.org'+path,{method,headers}),env,{});
  assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://www.pinnacleblooms.org/payment-and-billing');
  assert.equal(r.headers.get('cache-control'),headers.cookie||headers.authorization?'private, no-store':'public, max-age=0, must-revalidate');
 }
 for(const path of ['/payment-and-billing/private','/epass','/payonline','/api/payment','/login'])assert.equal(await serveSpeech(new Request('https://books.pinnacleblooms.org'+path),env,{}),null);
 assert.equal(await serveSpeech(new Request('https://books.pinnacleblooms.org/payment-and-billing',{method:'POST'}),env,{}),null);
});
