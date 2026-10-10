import assert from 'node:assert/strict';
import {transformReviewedHomepageMeasurement} from '../deployment/pinnacle-route-v12.mjs';

const loader='<script data-cfasync="false" async src="https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ"></script>';
const config=`<script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-2BYLRLFRDJ');

        /**/</script>`;
const fixture='<!doctype html><html><head><script>GTM-W9ZHX459</script><script>AW-10810823199</script><script>gtag(\'config\', \'AW-10810823199\')</script>'+loader+config+'</head><body><details data-ad-call-preferences></details></body></html>';
const response=()=>new Response(fixture,{headers:{'content-type':'text/html; charset=utf-8','content-length':String(Buffer.byteLength(fixture)),'etag':'legacy'}});

const transformed=await transformReviewedHomepageMeasurement(new Request('https://www.pinnacleblooms.org/'),response());
const html=await transformed.text();
assert(!html.includes('gtag/js?id=G-2BYLRLFRDJ'));
assert(!html.includes("gtag('config', 'G-2BYLRLFRDJ')"));
assert.equal((html.match(/data-speech-measurement/g)||[]).length,1);
assert.equal((html.match(/speech-measurement\.js/g)||[]).length,1);
assert(html.includes('GTM-W9ZHX459'));
assert(html.includes("gtag('config', 'AW-10810823199')"));
assert(html.includes('data-ad-call-preferences'));
assert.equal(transformed.headers.get('etag'),null);

for(const request of [
 new Request('https://www.pinnacleblooms.org/?campaign=test'),
 new Request('https://www.pinnacleblooms.org/',{headers:{cookie:'private=1'}}),
 new Request('https://www.pinnacleblooms.org/',{method:'HEAD'})
]){
 const untouched=await transformReviewedHomepageMeasurement(request,response());
 assert.equal(await untouched.text(),fixture);
}

const changedFixture=fixture.replace('data-ad-call-preferences','data-call-preferences');
const changed=await transformReviewedHomepageMeasurement(new Request('https://www.pinnacleblooms.org/'),new Response(changedFixture,{headers:{'content-type':'text/html'}}));
assert.equal(await changed.text(),changedFixture);

const alreadyShared=fixture.replace('</body>','<details data-speech-measurement></details></body>');
const idempotent=await transformReviewedHomepageMeasurement(new Request('https://www.pinnacleblooms.org/'),new Response(alreadyShared,{headers:{'content-type':'text/html'}}));
assert.equal(await idempotent.text(),alreadyShared);

console.log(JSON.stringify({passed:14,failed:0,scope:'guarded homepage GA4 migration'}));
