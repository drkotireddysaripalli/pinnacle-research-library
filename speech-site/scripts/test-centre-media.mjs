import test from 'node:test';import assert from 'node:assert/strict';
import {optimiseCentreMediaHtml,replaceCentreIntroduction,PLAY_SVG} from '../deployment/centre-search-repair/centre-media.mjs';
const id='20708282153',video='71610XG2tPM';
const frame='<iframe src="https://www.youtube.com/embed/'+video+'" allowfullscreen></iframe>';
const mobile='<div class="center-about-description"><h1>Anna Nagar</h1><div class="pinncle-round"><div class="youtube-container" style="padding-bottom: 57%;">'+frame+'</div><p>Old generic copy.</p></div></div>';
test('known mobile nested template gets the approved journey and retains its exact video',()=>{
 const out=replaceCentreIntroduction('before'+mobile+'after','Anna Nagar','<article>Approved journey</article>',video);
 assert(out.startsWith('before<article>Approved journey</article>'));assert(out.endsWith('after'));assert(out.includes(frame));assert(!out.includes('Old generic copy'));
});
for(const [label,html]of [['wrong video',mobile.replace(video,'00000000000')],['unexpected content',mobile.replace('<p>','<section>extra</section><p>')],['duplicate introduction',mobile+mobile],['truncated wrapper',mobile.slice(0,-6)]])test('unknown '+label+' fails closed',()=>assert.equal(replaceCentreIntroduction(html,'Anna Nagar','approved',video),null));
test('known desktop template still works',()=>assert.equal(replaceCentreIntroduction('<div class="center-about-description"><h1>Anna Nagar</h1><p>Old</p></div>','Anna Nagar','approved',video),'approved'));
test('exact images use native Cloudflare compression with original fallback; other images untouched',()=>{
 const images='<img class="existing class" src="https://www.pinnacleblooms.org/Images/ProfileImages/'+id+'.jpg?v=1" alt="Anna Nagar, Chennai" loading="lazy"><img src=https://www.pinnacleblooms.org/Images/Reviews/1.png /><img src="https://other.example/Images/Reviews/1.png">';
 const out=optimiseCentreMediaHtml(images,id);assert(out.includes('format=auto,quality=90,onerror=redirect/Images/ProfileImages/'+id+'.jpg?v=1'));assert(out.includes('alt="Anna Nagar, Chennai"'));assert(out.includes('class="existing class"'));assert(out.includes('loading="eager"'));assert(out.includes('fetchpriority="high"'));assert(out.includes('loading="lazy"'));assert(out.endsWith('<img src="https://other.example/Images/Reviews/1.png">'));assert.equal(optimiseCentreMediaHtml(out,id),out);
});
test('functional image query and data-src remain unchanged',()=>{
 for(const img of ['<img src="https://www.pinnacleblooms.org/Images/ProfileImages/'+id+'.jpg?token=private">','<img data-src="https://www.pinnacleblooms.org/Images/ProfileImages/'+id+'.jpg" src="placeholder.png">'])assert.equal(optimiseCentreMediaHtml(img,id),img);
});
test('deduplicate only the exact repeated article icon and preserve card wrappers',()=>{
 const item='<div class="card-r-set" data-url="example" data-id="1"><div class="play-btn">'+PLAY_SVG+'</div><img src="thumb.jpg"></div>';
 const before='<header>'+PLAY_SVG+'</header><section class="blogs-section c-section">'+item+item+'</section><footer>Keep</footer>';
 const out=optimiseCentreMediaHtml(before,id);assert(out.startsWith('<header>'+PLAY_SVG+'</header>'));assert.equal((out.match(/<symbol /g)||[]).length,1);assert.equal((out.match(/<use /g)||[]).length,2);assert.equal((out.match(/data-url="example"/g)||[]).length,2);assert(out.endsWith('<footer>Keep</footer>'));assert.equal(optimiseCentreMediaHtml(out,id),out);
});
test('only known YouTube embed loads lazily, keeping permissions and existing title',()=>{
 const original=frame.replace('allowfullscreen','title="Existing title with spaces" allowfullscreen');const other='<iframe src="https://example.org/auth" title="Sign in"></iframe>';
 const out=optimiseCentreMediaHtml(original+other,id);assert(out.includes('loading="lazy"'));assert(out.includes('title="Existing title with spaces"'));assert(out.includes('allowfullscreen'));assert(out.endsWith(other));assert.equal(optimiseCentreMediaHtml(out,id),out);
});
