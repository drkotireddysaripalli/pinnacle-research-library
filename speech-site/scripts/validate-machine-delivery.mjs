import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const origin='https://www.pinnacleblooms.org';
const paths=['/top-speech-therapy-center-india-proven-improvement-rate','/speech-therapy/service-information','/speech-therapy/first-visit-guide','/speech-therapy/teacher-observation-guide'];
const inventory=JSON.parse(await readFile(new URL('../deployment/speech-inventory.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const results=await Promise.all(paths.map(async path=>{
 const [h,m]=await Promise.all([fetch(origin+path,{headers:{accept:'text/html'}}),fetch(origin+path,{headers:{accept:'text/markdown'}})]);
 const [html,md]=await Promise.all([h.text(),m.text()]);
 const result={path,htmlStatus:h.status,htmlType:h.headers.get('content-type'),htmlSha256:sha(html),htmlMatchesStagedBuild:sha(html).slice(0,16)===inventory[path===paths[0]?'/pinnacle-pages-html/speech.html':'/pinnacle-pages-html/'+path.split('/').pop()+'.html'],markdownStatus:m.status,markdownType:m.headers.get('content-type'),vary:m.headers.get('vary'),contentSignal:m.headers.get('content-signal'),markdownBytes:Buffer.byteLength(md),htmlBytes:Buffer.byteLength(html),structuredDataRetained:md.includes('schema.org')&&md.includes('@graph'),hasOrganization:md.includes('Bharath Healthcare'),hasTelephone:md.includes('9100181181'),isActuallyMarkdown:!md.startsWith('<!DOCTYPE')};
 await writeFile(new URL('../reviews/machine-response-'+path.split('/').pop()+'.md',import.meta.url),md);
 return result;
}));
const controls=await Promise.all(['/verify/','/verify/evidence/records/fsc.html','/national-autism-helpline','/enroll','/enroll-autism-speech-aba-therapies-india?entry=speech-assessment'].map(async path=>{const r=await fetch(origin+path,{headers:{accept:'text/markdown'}});return{path,status:r.status,type:r.headers.get('content-type'),cache:r.headers.get('cf-cache-status'),cacheControl:r.headers.get('cache-control')};}));
const report={checkedAt:new Date().toISOString(),results,controls};
await writeFile(new URL('../reviews/CLOUDFLARE-MACHINE-FINAL-20260928.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(results.some(r=>r.htmlStatus!==200||r.markdownStatus!==200||!r.htmlMatchesStagedBuild||!r.markdownType?.includes('text/markdown')||r.contentSignal!=='search=yes, ai-input=yes'))process.exitCode=1;
