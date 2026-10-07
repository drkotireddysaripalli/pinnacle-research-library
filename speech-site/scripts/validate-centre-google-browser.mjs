// Candidate UI proof uses explicit synthetic public fixtures and never calls Windsor or submits anything.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import {selectPublicGoogleContent} from '../deployment/centre-google-feed.mjs';
import mapping from '../src/data/centre-google-locations.json' with {type:'json'};
import register from '../src/data/centre-register.json' with {type:'json'};
const base=process.env.CENTRE_GOOGLE_TEST_BASE||'http://127.0.0.1:4368';
const branch=register.centres.find(c=>c.id==='guntur'),identity=mapping.centres.find(c=>c.centreId==='guntur'),resource=identity.locationResource,clock=Date.now();
const original='The original public review.\nLiteral <b>words</b> stay as written  with two spaces.';
const reviews=Array.from({length:6},(_,i)=>({location_id:resource,review_id:'synthetic-'+i,review_comment:i===0?original:'Public UI fixture review '+i,review_reviewer:'Public test author '+i,review_star_rating:'FIVE',review_create_time:new Date(clock-i*3600000).toISOString(),review_update_time:new Date(clock-i*3600000).toISOString(),review_average_rating_total:4.7,review_total_count:321,data_fetched_at:new Date(clock).toISOString()}));
const posts=Array.from({length:3},(_,i)=>({location_id:resource,post_id:'synthetic-post-'+i,post_summary:i===0?'Original public update. '.repeat(25):'Public UI fixture update '+i,post_state:'LIVE',post_search_url:'https://www.google.com/search?q=synthetic-public-update-'+i,post_create_time:new Date(clock-i*3600000).toISOString(),data_fetched_at:new Date(clock).toISOString()}));
const feed={...selectPublicGoogleContent([...reviews,{...reviews[0],review_id:'four-star',review_star_rating:'FOUR',review_comment:'This four-star fixture must stay excluded.'}],posts,resource,clock),centreId:'guntur',state:'ready',reviewsState:'ready',postsState:'ready',sourceFetchedAt:new Date(clock-5*86400000).toISOString(),retrievedAt:new Date(clock).toISOString(),expiresAt:new Date(clock+86400000).toISOString()};
const out=path.resolve('ask-private/centre-google-20261007/candidate-ui');await fs.mkdir(out,{recursive:true});const rows=[];
for(const [engine,kind,width] of [[chromium,process.platform==='win32'?'edge':'chromium',320],[chromium,process.platform==='win32'?'edge':'chromium',1440],[webkit,'webkit',390]]){
 const browser=await engine.launch({headless:true,...(kind==='edge'?{channel:'msedge'}:{})});
 for(const failed of [false,true]){
  const context=await browser.newContext({viewport:{width,height:900}});let requests=0;const errors=[];
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.pathname==='/centers/_google/guntur'){requests++;return failed?route.abort('failed'):route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(feed)});}
   if(url.origin!==base)return route.abort();
   return route.continue();
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+new URL(branch.profileUrl).pathname,{waitUntil:'networkidle'});
  assert.equal(requests,0,'Google feed must not load with the hero');assert.equal(await page.locator('iframe').count(),0,'No eager third-party player');
  const section=page.locator('#google-reviews');await section.scrollIntoViewIfNeeded();
  await section.locator('[data-google-status]').filter({hasText:failed?'temporarily unavailable':'Website feed retrieved'}).waitFor();assert.equal(requests,1,'One lazy client request');
  const all=section.getByRole('link',{name:'Read all reviews on Google'});assert(await all.isVisible());assert.equal(await all.getAttribute('href'),branch.googleBusinessUrl||branch.mapsUrl);
  if(!failed){
   const status=await section.locator('[data-google-status]').textContent(),fmt=new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});assert(status.includes('Website feed retrieved '+fmt.format(new Date(clock))));assert(status.includes('Google source data fetched '+fmt.format(new Date(clock-5*86400000))));assert(!status.includes('Google data refreshed'),'Website retrieval must not imply a fresh provider fetch');
   assert.match(await section.locator('[data-google-overall]').textContent(),/4\.7 \/ 5 overall Google rating · 321/);
   assert(await section.getByRole('heading',{name:'Selected 5-star Google reviews'}).isVisible());assert.equal(await section.locator('.google-review-card').count(),6);
   assert.equal(await section.locator('.google-review-card blockquote').first().textContent(),original);assert.equal(await section.locator('.google-review-card blockquote b').count(),0,'Public review is text, never HTML');
   assert.equal(await section.locator('.google-review-author').first().textContent(),'Public test author 0');assert.equal(await section.locator('.google-review-card time').first().getAttribute('datetime'),reviews[0].review_create_time);assert.equal(await section.locator('.google-review-card [aria-label="5 out of 5 stars"]').count(),6);
   assert.equal(await section.getByRole('link',{name:'Review published on Google'}).count(),6);assert(!(await section.textContent()).includes('four-star fixture'));
   assert.equal(await section.locator('.google-post-card').count(),3);await section.getByText('Read the full update',{exact:true}).click();assert.equal(await section.locator('.google-post-card details p').textContent(),posts[0].post_summary);
   const rail=section.locator('[data-google-review-rail]');await section.getByRole('button',{name:'Next Google reviews'}).click();await page.waitForTimeout(400);assert(await rail.evaluate(n=>n.scrollLeft>0),'Review controls move the horizontal rail');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Cards must not overflow the page');
  }else{assert.equal(await section.locator('.google-review-card').count(),0);assert.equal(await section.locator('[data-google-review-section]').isVisible(),false);}
  assert.deepEqual(errors,[]);rows.push({kind,width,case:failed?'failed-load-fallback':'public-selection-render',lazySingleRequest:true,passed:true});await context.close();
 }
 await browser.close();
}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({at:new Date().toISOString(),base,syntheticFixtures:true,noProviderRequests:true,rows,passed:rows.length},null,2)+'\n');console.log(JSON.stringify({passed:rows.length,base,out}));
