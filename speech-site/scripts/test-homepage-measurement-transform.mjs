import fs from 'node:fs';
import assert from 'node:assert/strict';
import {transformReviewedHomepageMeasurement} from '../deployment/pinnacle-route-v12.mjs';

const loader='<script data-cfasync="false" async src="https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ"></script>';
const config=`<script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-2BYLRLFRDJ');

        /**/</script>`;
// This is the origin-stage fingerprint. The ad-call preference panel is added
// later by the outer shared-navigation transform and is intentionally absent.
const fixture='<!doctype html><html><head><!-- Google Tag Manager --><script>GTM-W9ZHX459</script><script>AW-10810823199</script><script>gtag(\'config\', \'AW-10810823199\')</script>'+loader+config+'</head><body></body></html>';
const response=()=>new Response(fixture,{headers:{'content-type':'text/html; charset=utf-8','content-length':String(Buffer.byteLength(fixture)),'etag':'legacy'}});

for(const [url,source] of [
 ['https://www.pinnacleblooms.org/',fixture],
 ['https://www.pinnacleblooms.org/?utm_source=google&utm_medium=cpc&utm_campaign=therapy',fixture],
 ['https://www.pinnacleblooms.org/?validation_test=ga4-readback',fixture],
 ['https://www.pinnacleblooms.org/',fixture.replaceAll('\n','\r\n')]
]){
 const transformed=await transformReviewedHomepageMeasurement(new Request(url),new Response(source,{headers:{'content-type':'text/html; charset=utf-8','content-length':String(Buffer.byteLength(source)),'etag':'legacy'}}));
 const html=await transformed.text();
 assert(!html.includes('gtag/js?id=G-2BYLRLFRDJ'));
 assert(!html.includes("gtag('config', 'G-2BYLRLFRDJ')"));
 assert.equal((html.match(/data-speech-measurement/g)||[]).length,0);
 assert.equal((html.match(/speech-measurement\.js/g)||[]).length,1);
 assert(html.includes('GTM-W9ZHX459'));
 assert(html.includes("gtag('config', 'AW-10810823199')"));
 assert(!html.includes('data-ad-call-preferences'));
 assert.equal((html.match(/pinnacle-measurement-privacy-bootstrap/g)||[]).length,1);
 assert(html.indexOf('pinnacle-measurement-privacy-bootstrap')<html.indexOf('GTM-W9ZHX459'));
 assert(html.indexOf('pinnacle_canonical_measurement:true')<html.indexOf('GTM-W9ZHX459'),'canonical ownership must precede GTM initialization');
 assert(html.includes('pinnacle_protection_allowed:false'),'vendor protection stays guarded until canonical scope is checked');
 assert(html.includes('analytics_storage:"granted"'));assert(html.includes('ad_storage:"granted"'));assert(html.includes('ad_user_data:"granted"'));assert(html.includes('ad_personalization:"denied"'));assert(html.includes('ads_data_redaction",false'));
 assert.equal(transformed.headers.get('etag'),null);
}

for(const request of [
 new Request('https://www.pinnacleblooms.org/',{headers:{authorization:'Bearer private'}}),
 new Request('https://www.pinnacleblooms.org/',{method:'HEAD'})
]){
 const untouched=await transformReviewedHomepageMeasurement(request,response());
 assert.equal(await untouched.text(),fixture);
}

const changedFixture=fixture.replace('GTM-W9ZHX459','GTM-CHANGED');
const changed=await transformReviewedHomepageMeasurement(new Request('https://www.pinnacleblooms.org/'),new Response(changedFixture,{headers:{'content-type':'text/html'}}));
assert.equal(await changed.text(),changedFixture);

const alreadyShared=fixture.replace('</body>','<details data-speech-measurement></details><script defer src="/pinnacle-pages-scripts/speech-measurement.js?v=old"></script><script defer src="/pinnacle-pages-scripts/speech-measurement.js?v=duplicate"></script></body>');
const migratedShared=await transformReviewedHomepageMeasurement(new Request('https://www.pinnacleblooms.org/'),new Response(alreadyShared,{headers:{'content-type':'text/html'}}));
const migratedHtml=await migratedShared.text();assert.equal((migratedHtml.match(/speech-measurement\.js/g)||[]).length,1);assert(migratedHtml.includes('v=measurement-completion-20261020'));assert(migratedHtml.includes('data-speech-measurement'));

for(const recovery of [false,true]){
 const r=new Request('https://www.pinnacleblooms.org/?utm_source=google&centre=suchitra',{headers:{cookie:'_ga=GA1.1.123.456; _gcl_au=abc'}});
 const headers={'content-type':'text/html',...(recovery?{'cache-control':'private, no-store','x-pinnacle-public-render-recovery':'mobile-origin-20261008'}:{})};
 const result=await transformReviewedHomepageMeasurement(r,new Response(fixture,{headers}));
 const html=await result.text();assert.equal((html.match(/speech-measurement\.js/g)||[]).length,1);assert(html.indexOf('pinnacle_canonical_measurement:true')<html.indexOf('GTM-W9ZHX459'));
 if(recovery)assert.equal(result.headers.get('cache-control'),'private, no-store');
 assert(r.url.includes('centre=suchitra'));assert(r.headers.get('cookie').includes('_ga='));
}
console.log(JSON.stringify({passed:41,failed:0,scope:'guarded homepage GA4 migration'}));

const mobileBlock=JSON.parse(fs.readFileSync('scripts/fixtures/home-mobile-google-block-20261020.json','utf8'));
const mobileFixture=fixture.replace(loader,'').replace(config,'<script>setTimeout(function(){try{'+mobileBlock+"// gtag('config', 'G-2BYLRLFRDJ');\n}catch(e){}setTimeout(function(){loadjscssfile('https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js')},6000)},4000)</script>");
for(const raw of [mobileFixture,mobileFixture.replaceAll('\n','\r\n')]){
 const transformed=await transformReviewedHomepageMeasurement(new Request('https://www.pinnacleblooms.org/?centre=suchitra'),new Response(raw,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}}));const s=await transformed.text();
 assert.equal((s.match(/speech-measurement\.js/g)||[]).length,1);assert(!s.includes('gtagScript'));assert(!s.includes('G-2BYLRLFRDJ'));assert(s.includes('AW-10810823199'));assert(s.includes('widget.trustpilot.com'));assert(s.indexOf('pinnacle_canonical_measurement:true')<s.indexOf('GTM-W9ZHX459'));assert.equal(transformed.headers.get('cache-control'),'no-store');
}
