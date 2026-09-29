import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const html=await fs.readFile('dist/enrolment-preview.html','utf8');
const response=await fetch('https://validator.w3.org/nu/?out=json',{method:'POST',headers:{'content-type':'text/html; charset=utf-8','user-agent':'Pinnacle-release-validation/1.0'},body:html,signal:AbortSignal.timeout(45000)});
const report=await response.json();
await fs.writeFile('reviews/W3C-ENROLMENT-20260929.json',JSON.stringify({checkedAt:new Date().toISOString(),status:response.status,...report},null,2));
assert(response.ok);assert.equal(report.messages.filter(m=>m.type==='error').length,0,JSON.stringify(report.messages));
assert(html.includes('noindex, nofollow')&&html.includes('data-preview="true"'));
assert(html.includes('id="enrol-preferences"')&&html.includes('Choose a service or centre'));
assert(html.includes('id="enrol-preferences" open'));
assert(html.indexOf('id="enrolment-form"')<html.indexOf('id="why-pinnacle-title"'));
assert(html.includes('greater independence and participation in family, learning, school and community')&&html.includes('The PinnacleAI® paradigm shift'));
for(const marker of ['Bricks matter. The home gives them purpose.','Every part matters. The journey gives it direction.','From guided work to everyday life.','SELF-SUFFICIENT · MAINSTREAM · WONDERFUL LIFE · POSSIBLE.'])assert(html.includes(marker),marker);
for(const alt of ['A mother and child walking toward a home, illustrating how individual parts serve a whole life.','A completed car beside individual components, illustrating how specialised work serves a shared purpose.','A child practising a useful everyday routine with family and professional guidance.']){
 const index=html.indexOf(`alt="${alt}"`);assert(index>0,alt);const imageStart=html.lastIndexOf('<img',index);const imageEnd=html.indexOf('>',index);const tag=html.slice(imageStart,imageEnd+1);assert(tag.includes('loading="lazy"'),tag);assert(tag.includes('width=')&&tag.includes('height=')&&tag.includes('srcset='),tag);
}
assert.equal((html.match(/data-enrol-centre=/g)||[]).length,62);
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert(!JSON.stringify(graph).includes('aggregateRating'));
let baselinePages=0;
if(process.env.PINNACLE_CAPTURE_BASELINE==='1'){
 const paths=['/verify/','/verify/evidence/evidence.json','/verify/evidence/fsc.pdf','/verify/evidence/pinnacleai-regulatory-journey.html','/national-autism-helpline','/enroll','/payonline','/robots.txt','/top-speech-therapy-center-india-proven-improvement-rate'];
 const results=await Promise.all(paths.map(async path=>{const r=await fetch('https://www.pinnacleblooms.org'+path);const bytes=Buffer.from(await r.arrayBuffer());return{path,status:r.status,bodySha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};}));
 await fs.writeFile('deployment/production-before-20260929.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
 assert(results.every(r=>r.status===200));baselinePages=results.length;
}
console.log(JSON.stringify({w3cMessages:report.messages.length,w3cErrors:0,centreTemplates:62,visualNarrativeImages:3,baselinePages,htmlBytes:Buffer.byteLength(html)}));
