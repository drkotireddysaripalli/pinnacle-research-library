import books from '../src/data/book-catalog.json' with {type:'json'};
import {BOOK_ROUTES} from '../deployment/speech-handler.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pinnacleWave} from '../src/data/pinnacleai-wave.ts';
import {centreDetails} from '../src/data/centre-detail-content.ts';
import {lifePages} from '../src/data/life-outcomes.ts';
import policies from '../src/data/policy-presentation.ts';
import institutional from '../src/data/institutional-content.json' with {type:'json'};
const root=process.cwd(),parent=path.dirname(root),out=path.resolve(process.argv[2]||path.join(root,'release-union'));
const verifyRoot=process.argv[3]?path.resolve(process.argv[3]):await fs.access(path.join(parent,'verify-site/dist')).then(()=>path.join(parent,'verify-site')).catch(()=>path.join(parent,'pinnacle-verify-fsc'));
await fs.mkdir(out,{recursive:false});
await fs.cp(path.join(verifyRoot,'dist'),out,{recursive:true});
const before=await fs.readFile(path.join(out,'index.html'));
for(const dir of ['pinnacle-pages-assets','pinnacle-pages-fonts','pinnacle-pages-scripts','pinnacle-pages-data'])await fs.cp(path.join(root,'dist',dir),path.join(out,dir),{recursive:true});
await fs.mkdir(path.join(out,'pinnacle-pages-html'));
const html=await fs.readFile(path.join(root,'dist/index.html'),'utf8');
assert(html.includes('index, follow, max-image-preview:large')&&!html.includes('class="preview-note"'));
assert((await fs.readFile(path.join(root,'dist/speech-campaign.html'),'utf8')).includes('noindex, nofollow'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/speech.html'),html);
await fs.copyFile(path.join(root,'dist/speech-therapy/service-information.html'),path.join(out,'pinnacle-pages-html/service-information.html'));
for(const guide of ['first-visit-guide','teacher-observation-guide'])await fs.copyFile(path.join(root,'dist/speech-therapy/'+guide+'.html'),path.join(out,'pinnacle-pages-html/'+guide+'.html'));
const enrolmentPreview=await fs.readFile(path.join(root,'dist/enrolment-preview.html'),'utf8');
assert(enrolmentPreview.includes('noindex, nofollow')&&enrolmentPreview.includes('data-preview="true"'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/enrolment-preview.html'),enrolmentPreview);
const enrolment=await fs.readFile(path.join(root,'dist/enroll-autism-speech-aba-therapies-india.html'),'utf8');
assert(enrolment.includes('index, follow, max-image-preview:large')&&enrolment.includes('data-preview="false"')&&enrolment.includes('data-api-endpoint="/api/enrolment"')&&!enrolment.includes('Design preview'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/enrolment.html'),enrolment);
const occupational=await fs.readFile(path.join(root,'dist/best-occupational-therapy-center-india-proven-improvement-rate.html'),'utf8');
assert(occupational.includes('index, follow, max-image-preview:large')&&occupational.includes('Occupational Therapy for Children in India')&&occupational.includes('occupational-therapy-evidence.json'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/occupational-therapy.html'),occupational);
const aba=await fs.readFile(path.join(root,'dist/best-aba-therapy-center-india-proven-improvement-rate.html'),'utf8');
assert(aba.includes('index, follow, max-image-preview:large')&&aba.includes('ABA Therapy for Children in India')&&aba.includes('aba-therapy-evidence.json')&&aba.includes('Applied Behavior Analysis'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/aba-therapy.html'),aba);
const specialEducation=await fs.readFile(path.join(root,'dist/best-special-education-center-call-9100181181.html'),'utf8');
assert(specialEducation.includes('index, follow, max-image-preview:large')&&specialEducation.includes('Special Education Support for Children in India')&&specialEducation.includes('special-education-evidence.json')&&specialEducation.includes('What is special education support?'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/special-education.html'),specialEducation);
const autismTherapy=await fs.readFile(path.join(root,'dist/autism-therapy.html'),'utf8');
assert(autismTherapy.includes('index, follow, max-image-preview:large')&&autismTherapy.includes('Autism Therapy &amp; Developmental Support for Children')&&autismTherapy.includes('autism-therapy-evidence.json')&&autismTherapy.includes('Autism therapy is not one fixed programme'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/autism-therapy.html'),autismTherapy);
const assessment=await fs.readFile(path.join(root,'dist/speech-aba-autism-assessments.html'),'utf8');
assert(assessment.includes('index, follow, max-image-preview:large')&&assessment.includes('Child Development Assessment')&&assessment.includes('assessment-evidence.json'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/assessment.html'),assessment);
const centers=await fs.readFile(path.join(root,'dist/centers.html'),'utf8');
assert(centers.includes('index, follow, max-image-preview:large')&&centers.includes('Find a Pinnacle Blooms Centre')&&centers.includes('centers-evidence.json')&&centers.includes('Browse every published listing by state or region'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/centers.html'),centers);
const suchitra=await fs.readFile(path.join(root,'dist/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india.html'),'utf8');
assert(suchitra.includes('index, follow, max-image-preview:large')&&suchitra.includes('suchitra-evidence.json')&&suchitra.includes('Query Raised'));
await fs.writeFile(path.join(out,'pinnacle-pages-html/suchitra.html'),suchitra);
for(const page of centreDetails){
 const centreHtml=await fs.readFile(path.join(root,'dist',page.path+'.html'),'utf8');
 assert(centreHtml.includes('index, follow, max-image-preview:large')&&centreHtml.includes(page.id+'-evidence.json')&&centreHtml.includes(page.hfr));
 await fs.writeFile(path.join(out,'pinnacle-pages-html',page.id+'.html'),centreHtml);
}
for(const page of pinnacleWave){
 const pageHtml=await fs.readFile(path.join(root,'dist',page.slug+'.html'),'utf8');
 assert(pageHtml.includes('index, follow, max-image-preview:large')&&pageHtml.includes(page.title)&&pageHtml.includes('application/ld+json')&&pageHtml.includes('id="worked-example"'));
 await fs.writeFile(path.join(out,'pinnacle-pages-html',page.slug+'.html'),pageHtml);
}
for(const page of [...policies,...lifePages,...institutional]){const text=await fs.readFile(path.join(root,'dist',page.slug+'.html'),'utf8');assert(text.includes('index, follow, max-image-preview:large')&&text.includes(page.title));await fs.writeFile(path.join(out,'pinnacle-pages-html',page.slug+'.html'),text);}
await fs.copyFile(path.join(root,'dist/policies.html'),path.join(out,'pinnacle-pages-html/policies.html'));
assert.deepEqual(await fs.readFile(path.join(out,'index.html')),before,'Verify index must be unchanged');
for(const [route,id] of Object.entries(BOOK_ROUTES)){const html=await fs.readFile(path.join(root,'dist',route.slice(1)+'.html'),'utf8');assert(html.includes('index, follow, max-image-preview:large'));await fs.writeFile(path.join(out,'pinnacle-pages-html',id+'.html'),html);}
const inventory={};
async function walk(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const f=path.join(dir,item.name);if(item.isDirectory())await walk(f);else{const key='/'+path.relative(out,f).replaceAll('\\','/');inventory[key]=crypto.createHash('sha256').update(await fs.readFile(f)).digest('hex').slice(0,16);}}}
for(const dir of ['pinnacle-pages-assets','pinnacle-pages-fonts','pinnacle-pages-scripts','pinnacle-pages-data','pinnacle-pages-html'])await walk(path.join(out,dir));
const base=await fs.readFile(path.join(verifyRoot,'pinnacle-route-v11.mjs'),'utf8');
const needle='  const incoming=new URL(request.url),isVerify=';
assert(base.includes(needle));
let worker="import {serveRootDiscovery} from './discovery-handler.mjs';\nimport {serveSpeechEnquiry} from './speech-enquiry-handler.mjs';\nimport {serveSpeech} from './speech-handler.mjs';\nimport {serveEnrolmentApi} from './enrolment-handler.mjs';\nconst SPEECH_INVENTORY="+JSON.stringify(inventory)+";\n"+base.replace(needle,'  const discoveryResponse=await serveRootDiscovery(request,env);if(discoveryResponse)return discoveryResponse;\n  const enrolmentApiResponse=await serveEnrolmentApi(request,env);if(enrolmentApiResponse)return enrolmentApiResponse;\n  const speechResponse=await serveSpeech(request,env,SPEECH_INVENTORY);if(speechResponse)return speechResponse;\n  const enquiryResponse=await serveSpeechEnquiry(request,env);if(enquiryResponse)return enquiryResponse;\n'+needle);
worker=worker.replace("['https://www.pinnacleblooms.org/national-autism-helpline/sitemap.xml','https://pinnacleblooms.org/ask/sitemap.xml']","['https://www.pinnacleblooms.org/national-autism-helpline/sitemap.xml','https://pinnacleblooms.org/ask/sitemap.xml','https://www.pinnacleblooms.org/speech-therapy/sitemap.xml','https://www.pinnacleblooms.org/pinnacleai/sitemap.xml']");
worker="import {repairSharedNavigation} from './shared-navigation.mjs';\n"+worker.replace('export default {','const portalWorker = {')+"\nexport default {async fetch(request,env,ctx){return repairSharedNavigation(request,await portalWorker.fetch(request,env,ctx));}};\n";
await fs.writeFile('deployment/pinnacle-route-v12.mjs',worker);
await fs.writeFile('deployment/speech-inventory.json',JSON.stringify(inventory,null,2)+'\n');
console.log(JSON.stringify({out,newAssets:Object.keys(inventory).length,verifyIndexPreserved:true,baseWorkerSha256:crypto.createHash('sha256').update(base).digest('hex'),workerSha256:crypto.createHash('sha256').update(worker).digest('hex')}));
