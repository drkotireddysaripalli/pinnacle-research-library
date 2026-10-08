import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {knowledgeJourney,readerLibrary} from '../src/lib/knowledge/journey.mjs';
import {safeReturn,readerLibrary as registeredLibrary} from '../src/lib/ask/auth.mjs';
test('Relevant knowledge keeps the selected service editable in the existing enquiry',()=>{
 for(const [title,service]of [['Speech delay','speech'],['Pincer grasp','occupational'],['What is an IEP?','education'],['ABA therapy','aba'],['Autism support','autism']])assert.equal(knowledgeJourney({title}).enrol,'/enroll-autism-speech-aba-therapies-india?service='+service);
 assert.equal(knowledgeJourney({title:'General questions'}).enrol,'/enroll-autism-speech-aba-therapies-india');assert.equal(knowledgeJourney({category:'franchise'}).business,true);
});
test('Reader registration buckets contain no question, identity or diagnosis history',()=>{
 for(const [path,bucket]of [['/ask/pincer-grasp','ask'],['/faq/hindi/speech-therapy','faq'],['/sunshine/materials/3394','sunshine'],['/allmirracles/category/Parents','mirracles'],['/mirracles/132/video-title','mirracles'],['/materials/example','materials'],['/interventions/example','interventions']])assert.equal(readerLibrary(path),bucket);
 for(const value of ['my-child-diagnosis','https://evil.example','care@pinnacleblooms.org',''])assert.equal(registeredLibrary(value),null);
 assert.equal(readerLibrary('/shop/cart'),null);assert.equal(readerLibrary('/api/gl/swfs'),null);
});
test('Exact approved library returns and permitted campaign identifiers survive Google',()=>{
 for(const path of ['/allmirracles','/allmirracles/category/Speech%20Therapy','/mirracles/10369/published-video','/faq/hindi/speech-therapy?gclid=qaClickAbc123','/ask/pincer-grasp?utm_source=google&utm_medium=cpc&page=1'])assert.equal(safeReturn(path),path);
 for(const path of ['//evil.example','/mirracles/account','/mirracles/1/../account','/allmirracles/category/%2faccount','/ask/auth/google','/ask/reader-shell','/materials/not-migrated','/ask/pincer-grasp?email=private@example.org','/faq?gclid=a&gclid=b'])assert.equal(safeReturn(path),'/ask');
});
test('One shared reading block preserves medical-care and franchise exceptions',async()=>{
 const answer=await fs.readFile('src/components/ask/AskAnswer.astro','utf8');assert(answer.indexOf('<ReaderJourney')>answer.indexOf('data-ask-answer'));assert(answer.includes('a.medicalSafetyPage?'));
 const component=await fs.readFile('src/components/knowledge/ReaderJourney.astro','utf8');assert(component.includes('!journey.business'));assert(component.includes('tel:+919100181181'));assert(!component.includes('free assessment'));
});
test('Shared video reader assembly preserves public content and crawler registration disclosure',async()=>{
 const source=await fs.readFile('deployment/mirracles-library.mjs','utf8');assert(source.includes('reader?.html'));assert(source.includes('reader?.journey'));assert(source.includes('isAccessibleForFree:!reader'));assert(source.includes('ask-registration-content'));assert(source.includes('data-page-variant="knowledge"'));
 const maintained=await fs.readFile('deployment/mirracles-library-20261008/library.mjs','utf8');assert.equal(source,maintained.replace("from './assets.mjs'","from './mirracles-library-assets.mjs'"));
});
