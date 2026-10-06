import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {askRouteAlias} from '../src/lib/ask/route-aliases.ts';
import {canonicalContentLink} from '../src/lib/ask/links.ts';
import {reviseChandaNagarHtml,CHANDANAGAR_URL,isChandaNagarRequest} from '../deployment/centre-search-repair/chandanagar.mjs';
test('only verified English aliases resolve; unknown codes and translations retain their own route',()=>{
 for(const p of ['aac','wppsi4','lens/organ/anus','code/XA0604']){assert(askRouteAlias(p));assert(canonicalContentLink('https://pinnacleblooms.org/ask/'+p).endsWith(askRouteAlias(p)));assert.equal(askRouteAlias(p,'te'),null);}
 for(const p of ['code/UNKNOWN','auth/callback','search','aacc'])assert.equal(askRouteAlias(p),null);
});
test('Chanda Nagar shared transform is exact, repeatable and preserves unrelated content',()=>{
 const fixture='<html><head><title>Old</title><link rel="canonical" href="'+CHANDANAGAR_URL+'"><meta name="description" content="Old"></head><body><header>Keep</header><img src="/Images/ProfileImages/13689513037.jpg"><div class="center-about-description"><h1>Chanda Nagar</h1><p>Old intro</p></div><footer>Keep</footer></body></html>';
 const html=reviseChandaNagarHtml(fixture);assert(html);assert(html.includes('6267432914811534928'));assert(html.includes('centre=chandanagar'));assert(html.includes('<header>Keep</header>'));assert(html.includes('<footer>Keep</footer>'));assert(!html.includes('LB Nagar'));assert.equal(reviseChandaNagarHtml(html),html);
 assert.equal(reviseChandaNagarHtml(fixture.replace('13689513037','not-this-centre')),null);
 assert.equal(isChandaNagarRequest(new Request(CHANDANAGAR_URL+'?private=child')),false);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema.mainEntity.length,3);assert.equal((html.match(/<details>/g)||[]).length,3);
});
test('actual captured Chanda Nagar origin accepts the bounded transform',()=>{
 const file='ask-private/six-step-release-20261006/page-6.html';if(!fs.existsSync(file))return;
 const output=reviseChandaNagarHtml(fs.readFileSync(file,'utf8'));assert(output);assert(output.includes('id="pinnacle-chandanagar-start"'));assert(!output.includes('Successfully delivered 31Million+ Therapies'));
 assert(!output.includes('id="video-container"'),'Legacy autoplay banner must not precede the frontage');assert(!output.includes('setTimeout(loadVideo'),'No deferred autoplay');assert(output.includes('data-centre-frontage'));assert(output.includes('<template>')&&output.includes('youtube-nocookie.com/embed/rPl_kZm7LiE?rel=0'));assert.equal(reviseChandaNagarHtml(output),output);
});
