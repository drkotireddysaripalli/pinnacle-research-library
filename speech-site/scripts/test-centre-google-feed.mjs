import test from 'node:test';
import assert from 'node:assert/strict';
import {createCentreGoogleHandler,serveCentreGoogle,selectPublicGoogleContent} from '../deployment/centre-google-feed.mjs';
import register from '../src/data/centre-google-locations.json' with {type:'json'};

const time=Date.parse('2026-10-07T12:00:00Z'),resource='locations/17679311780277453396';
const review=(extra={})=>({location_id:resource,review_id:'review-one',review_comment:'The original public review.\nA second line.',review_reviewer:'Public reviewer',review_star_rating:'FIVE',review_create_time:'2026-10-03T09:12:00Z',review_update_time:'2026-10-04T09:12:00Z',review_average_rating_total:4.8,review_total_count:443,data_fetched_at:'2026-10-07T11:00:00Z',private_email:'never@example.test',...extra});
const post=(extra={})=>({location_id:resource,post_id:'post-one',post_summary:'An original public update. Call our public network number 9100 181 181.',post_state:'LIVE',post_search_url:'https://www.google.com/search?q=public+update',post_create_time:'2026-10-03T09:12:00Z',post_media_google_url:'https://lh3.googleusercontent.com/public-image',data_fetched_at:'2026-10-07T11:00:00Z',...extra});
const request=(id='suchitra',method='GET')=>new Request('https://www.pinnacleblooms.org/centers/_google/'+id,{method});
const env={CENTRE_GOOGLE_WINDSOR_KEY:'unit-test-secret'};
function memoryCache(){const values=new Map();return {values,async match(key){return values.get(key.url)?.clone();},async put(key,value){values.set(key.url,value.clone());},async delete(key){return values.delete(key.url);}};}
function provider(url){const u=new URL(url),fields=u.searchParams.get('fields');assert.equal(u.hostname,'connectors.windsor.ai');assert.equal(u.searchParams.get('select_accounts'),resource);assert.equal(u.searchParams.get('date_preset'),'last_30d');assert(!fields.includes('review_id')||!fields.includes('post_id'),'Reviews and posts must use separate requests');return Response.json({data:fields.includes('review_id')?[review()]:[post()]});}

test('identity coverage is explicit and held or ambiguous centres cannot trigger retrieval',()=>{
 assert.equal(register.centres.length,62);assert.equal(register.centres.filter(c=>c.status==='matched').length,58);
 assert.equal(register.centres.find(c=>c.centreId==='suchitra').locationResource,resource);
 assert.equal(register.centres.find(c=>c.centreId==='guntur').locationResource,'locations/7063963914382159795');
 assert.equal(register.centres.find(c=>c.centreId==='gurunanak').locationResource,'locations/14722062917356395844');
 assert.deepEqual(register.centres.filter(c=>c.status!=='matched').map(c=>[c.centreId,c.status]).sort((a,b)=>a[0].localeCompare(b[0])),[['delhi','held'],['jublieehills','unmatched'],['nad','ambiguous'],['usa','held']]);
 assert(register.centres.filter(c=>c.status==='matched').every(c=>/^locations\/\d+$/.test(c.locationResource)&&typeof c.googleCid==='string'));
});
test('projection keeps exact review text, date and public attribution; five stars are a selection, not overall rating',()=>{
 const exact='Exact <b>public wording</b>.\nKeep spacing  and punctuation!';
 const out=selectPublicGoogleContent([review({review_comment:exact}),review({review_id:'four',review_star_rating:'FOUR'}),review({review_id:'contact',review_comment:'My contact is parent@example.test'}),review({review_id:'old',data_fetched_at:'2026-08-01T00:00:00Z'}),review({review_id:'wrong',location_id:'locations/other'})],[post()],resource,time);
 assert.equal(out.reviews.length,1);assert.equal(out.reviews[0].text,exact);assert.equal(out.reviews[0].author,'Public reviewer');assert.equal(out.reviews[0].createdAt,'2026-10-03T09:12:00.000Z');assert.equal(out.reviews[0].stars,5);
 assert.deepEqual(out.overall,{rating:4.8,count:443});assert(!JSON.stringify(out).includes('private_email'));assert(!JSON.stringify(out).includes('never@example'));assert.equal(out.posts.length,1,'Public business telephone remains part of the original update');
});
test('only LIVE, correctly attributed Google posts are returned; unsafe media is omitted',()=>{
 const out=selectPublicGoogleContent([],[post({post_id:'unsafe-image',post_media_google_url:'https://attacker.test/image'}),post({post_id:'draft',post_state:'DRAFT'}),post({post_id:'host',post_search_url:'https://evilgoogle.com/'}),post({post_id:'wrong',location_id:'locations/other'}),post({post_id:'old',data_fetched_at:'2026-08-01T00:00:00Z'})],resource,time);
 assert.equal(out.posts.length,1);assert.equal(out.posts[0].imageUrl,null);assert.equal(out.posts[0].text,post().post_summary);
});
test('a fresh provider fetch does not make old publications recent; source and website retrieval dates remain separate',async()=>{
 const old='2026-08-01T00:00:00Z',future='2026-10-09T00:00:00Z',olderSource='2026-10-02T11:00:00Z';
 const out=selectPublicGoogleContent([review({review_id:'stale-publication',review_create_time:old,review_update_time:old}),review({review_id:'future',review_create_time:future,review_update_time:future}),review({review_id:'recent-edit',review_create_time:old,data_fetched_at:olderSource})],[post({post_id:'stale-post',post_create_time:old}),post({post_id:'future-post',post_create_time:future}),post({post_id:'recent-post',data_fetched_at:olderSource})],resource,time);
 assert.equal(out.reviews.length,1);assert.equal(out.reviews[0].createdAt,old.replace('Z','.000Z'),'An old review edited recently retains its original date');assert.equal(out.posts.length,1);assert.equal(out.sourceFetchedAt,'2026-10-02T11:00:00.000Z');
 const handler=createCentreGoogleHandler({fetcher:async url=>Response.json({data:new URL(url).searchParams.get('fields').includes('review_id')?[review({data_fetched_at:olderSource})]:[post({data_fetched_at:olderSource})]}),cache:null,now:()=>time});
 const feed=await(await handler(request(),env)).json();assert.equal(feed.sourceFetchedAt,'2026-10-02T11:00:00.000Z');assert.equal(feed.retrievedAt,'2026-10-07T12:00:00.000Z');assert.notEqual(feed.sourceFetchedAt,feed.retrievedAt);
});
test('route returns null outside its scope, 405 for non-GET and 404 for unknown centres',async()=>{
 const handler=createCentreGoogleHandler({fetcher:()=>assert.fail('No provider call expected')});
 assert.equal(await handler(new Request('https://www.pinnacleblooms.org/centers/guntur')),null);
 assert.equal(await handler(new Request('https://www.pinnacleblooms.org/api/centre-google/suchitra')),null);
 assert.equal((await handler(request('suchitra','POST'),env)).status,405);assert.equal((await handler(request('unknown'),env)).status,404);
});
test('missing secret and unmatched/held identities retain a working Google listing without external requests',async()=>{
 const handler=createCentreGoogleHandler({fetcher:()=>assert.fail('No provider call expected')});
 const noKey=await (await serveCentreGoogle(request(),{})).json();assert.equal(noKey.state,'unavailable');assert.match(noKey.googleUrl,/google\.com/);assert.deepEqual(noKey.reviews,[]);
 for(const id of ['nad','jublieehills','delhi','usa']){const out=await(await handler(request(id),env)).json();assert.notEqual(out.state,'ready');assert(out.googleUrl);assert.deepEqual(out.reviews,[]);}
});
test('cache stores only curated public content for 24 hours and avoids another provider call',async()=>{
 const cache=memoryCache();let calls=0;
 const handler=createCentreGoogleHandler({fetcher:async url=>{calls++;return provider(url);},cache,now:()=>time});
 const response=await handler(request(),env),data=await response.json();assert.equal(calls,2);assert.equal(data.state,'ready');assert.equal(Date.parse(data.expiresAt)-Date.parse(data.retrievedAt),86400000);assert.match(response.headers.get('cache-control'),/s-maxage=86400/);
 const cached=await(await handler(request(),env)).json();assert.equal(calls,2);assert.deepEqual(cached,data);assert(!JSON.stringify(cached).includes('unit-test-secret'));assert(!JSON.stringify(cached).includes('review_id'));assert(!JSON.stringify(cached).includes('locationResource'));
});
test('expired cached public data is discarded and refreshed on demand',async()=>{
 const cache=memoryCache();let clock=time,calls=0;const handler=createCentreGoogleHandler({fetcher:async url=>{calls++;return provider(url);},cache,now:()=>clock});
 await handler(request(),env);clock+=86400001;const data=await(await handler(request(),env)).json();assert.equal(calls,4);assert.equal(data.retrievedAt,new Date(clock).toISOString());
});
test('simultaneous requests deduplicate the per-centre fetch inside the isolate',async()=>{
 let calls=0,release;const gate=new Promise(resolve=>{release=resolve;});
 const handler=createCentreGoogleHandler({fetcher:async url=>{calls++;await gate;return provider(url);},cache:null,now:()=>time});
 const one=handler(request(),env),two=handler(request(),env);await new Promise(resolve=>setTimeout(resolve,0));assert.equal(calls,2);release();assert.deepEqual(await(await one).json(),await(await two).json());
});
test('pending 202 responses have only one bounded retry per separate content request',async()=>{
 let calls=0;const handler=createCentreGoogleHandler({fetcher:async()=>{calls++;return new Response('',{status:202});},sleep:async()=>{},cache:null,now:()=>time});
 const data=await(await handler(request(),env)).json();assert.equal(calls,4);assert.equal(data.state,'pending');assert.deepEqual(data.reviews,[]);assert.match(data.googleUrl,/google\.com/);
});
test('provider timeout and errors never expose credentials and retain the listing fallback',async()=>{
 const handler=createCentreGoogleHandler({fetcher:async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error(url)),{once:true})),timeoutMs:15,cache:null,now:()=>time});
 const data=await(await handler(request(),env)).json();assert.equal(data.state,'unavailable');assert.match(data.googleUrl,/google\.com/);assert(!JSON.stringify(data).includes('unit-test-secret'));assert(!JSON.stringify(data).includes('api_key'));
});
test('one failed content request does not discard the other public content',async()=>{
 const handler=createCentreGoogleHandler({fetcher:async url=>new URL(url).searchParams.get('fields').includes('post_id')?new Response('',{status:503}):provider(url),cache:null,now:()=>time});
 const data=await(await handler(request(),env)).json();assert.equal(data.state,'ready');assert.equal(data.reviews.length,1);assert.equal(data.posts.length,0);assert.equal(data.postsState,'unavailable');assert.deepEqual(data.overall,{rating:4.8,count:443});
});
