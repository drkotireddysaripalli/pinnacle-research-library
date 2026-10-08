import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';

// Run from the canonical site. The optional path supports reviewing this draft
// before the release owner copies it to src/lib/ask/priority-editorial.ts.
const {build}=createRequire(resolve('package.json'))('esbuild');
const entry=resolve(process.env.ASK_PRIORITY_MODULE||'src/lib/ask/priority-editorial.ts');
const bundle=await build({entryPoints:[entry],bundle:true,format:'esm',platform:'node',write:false,plugins:[{name:'draft-content-context',setup(b){b.onResolve({filter:/^\.\/content$/},()=>({path:resolve('src/lib/ask/content.ts')}));}}]});
const {priorityEditorialAnswer,priorityEditorialSlugs,curatedPriorityAnswer,curatedPrioritySlugs,specifiedDisabilities}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const answer=(slug)=>priorityEditorialAnswer({slug,lang:'en',canonical:'https://pinnacleblooms.org/ask/'+slug,answer_md:'Original record'});
const copy=(a)=>[a.summary,a.answer_md,a.everyday_tip,a.what_to_watch,...a.faq.flatMap(f=>[f.q,f.a])].join('\n');

test('bounded editorial overlay preserves real record identity, publication and relationships',()=>{
 assert.equal(priorityEditorialSlugs.length,5);
 const untouched={slug:'unrelated-published-answer',lang:'en'};
 assert.equal(priorityEditorialAnswer(untouched),untouched);
 assert.equal(priorityEditorialAnswer(null),null);
 for(const slug of priorityEditorialSlugs){
  const original={slug,lang:'en',id:321,canonical:'https://pinnacleblooms.org/ask/'+slug,meta_robots:'index, follow',published_at:'2026-06-11',last_reviewed_at:'2026-06-11',editorial:{reviewed_by:null,reviewed_at:'2026-06-11'},og_image:'/existing-public-image.webp',qr_source:'https://pinnacleblooms.org/ask/'+slug,related:[{slug:'existing-related'}],related_materials:{count:1,items:[{slug:'existing-material'}]},reading_paths:[{kind:'skill'}],alternates:[{lang:'te'}],entity:{key:'existing-key'},lenses:[{kind:'route',value:'existing'}]};
  const actual=priorityEditorialAnswer(original);
  for(const field of ['id','slug','lang','canonical','meta_robots','published_at','last_reviewed_at','editorial','og_image','qr_source','related','related_materials','reading_paths','alternates','entity','lenses'])assert.equal(actual[field],original[field],slug+': '+field);
  assert.equal(actual.content_updated_at,'2026-10-08');
  assert.equal(priorityEditorialAnswer({...original,lang:'te'}).title,undefined);
  for(const link of actual.authority_links)assert(actual.answer_md.includes(link.url),slug+': source visible beside guidance');
 }
});

test('IEP guidance separates India planning from US IDEA and removes the old diagnosis claim',()=>{
 const a=answer('what-is-an-iep-individualised-education-plan');
 assert.match(copy(a),/US IDEA|United States/);
 assert.match(copy(a),/do not automatically apply to an Indian school|do not copy them/i);
 assert.match(copy(a),/NCERT|ncert\.nic\.in/);
 assert.match(copy(a),/review date|review period/);
 assert.match(copy(a),/not a diagnosis|not a medical diagnosis|No\. An IEP is an education plan/i);
 assert.doesNotMatch(copy(a),/diagnosis.*only at a Pinnacle|speeds progress/i);
});

test('pincer advice removes unsafe small-object practice from every public copy field',()=>{
 const a=answer('how-can-i-work-on-pincer-grasp-with-my-child-at-home');
 assert.match(copy(a),/under three/);
 assert.match(copy(a),/supervision does not (?:remove|make)/i);
 assert.match(copy(a),/coins.*beads|beads.*coins/i);
 assert.doesNotMatch(copy(a),/posting coins|posting.*pom-poms|well-cooked peas|puffed snacks/i);
 assert.match(copy(a),/lost skills|loss of a skill/);
 assert(a.authority_links.some(s=>s.url.includes('cpsc.gov')));
 assert(a.authority_links.some(s=>s.url.endsWith('/1-year.html')));
});

test('certificate hub keeps official authority, categories, eligibility and renewal distinct',()=>{
 const a=answer('how-do-i-get-a-disability-certificate-for-my-child-in-india');
 assert.equal(specifiedDisabilities.length,21);
 assert.equal(new Set(specifiedDisabilities).size,21);
 for(const name of specifiedDisabilities)assert(a.answer_md.includes(name));
 assert.match(copy(a),/Pinnacle does not issue|Pinnacle.*does not issue/s);
 assert.match(copy(a),/40% is not a universal certificate threshold/);
 assert.match(copy(a),/ADHD is not separately named/);
 assert.match(copy(a),/Telangana|Andhra Pradesh/);
 assert.match(copy(a),/State or Union Territory and district/);
 assert.match(copy(a),/temporary.*renewal|renewal.*temporary/is);
 assert.doesNotMatch(copy(a),/issued free of charge|there is no application fee/i);
 assert.match(copy(a),/Do not assume.*guarantees a scholarship/);
});

test('stimming guidance protects harmless regulation and routes harm or distress to support',()=>{
 const a=answer('is-stimming-always-a-bad-sign-that-must-be-stopped');
 assert.match(copy(a),/harmless|Harmless/);
 assert.match(copy(a),/punishment/);
 assert.match(copy(a),/injury|injur/);
 assert.match(copy(a),/physical or mental health|pain or illness/);
 assert.match(copy(a),/harmless stimming itself does not create a need for therapy/);
 assert(a.authority_links.some(s=>s.url.includes('nhs.uk')));
});

test('shadow teacher guidance avoids blanket need, credentials and placement guarantees',()=>{
 const a=answer('what-is-a-shadow-teacher-and-does-my-child-need-one');
 assert.match(copy(a),/title alone does not establish/);
 assert.match(copy(a),/diagnosis alone does not/);
 assert.match(copy(a),/fees|Fees/);
 assert.match(copy(a),/safeguarding|Safeguarding/);
 assert.match(copy(a),/retaining accommodations|receiving appropriate support|help remains necessary/);
 assert.match(copy(a),/does not promise a shadow-teacher placement/);
});

test('curated source-backed records carry truthful dates and no fabricated reviewer or database id',()=>{
 assert.deepEqual(curatedPrioritySlugs,['what-is-virtual-autism','what-is-high-functioning-autism']);
 assert.equal(curatedPriorityAnswer('unpublished-invented-slug'),null);
 for(const slug of curatedPrioritySlugs){
  const a=curatedPriorityAnswer(slug);
  assert.equal(a.lang,'en');assert.equal(a.content_updated_at,'2026-10-08');
  assert.equal(a.canonical,'https://pinnacleblooms.org/ask/'+slug);
  assert.equal(a.editorial.reviewed_by,null);assert.equal(a.id,undefined);assert.equal(a.editorial.reviewed_at,undefined);
  for(const source of a.authority_links)assert(a.answer_md.includes(source.url));
  assert.match(copy(a),/non-diagnostic developmental-support/);
 }
 const virtual=copy(curatedPriorityAnswer('what-is-virtual-autism'));
 assert.match(virtual,/does not establish|does not prove/);
 assert.match(virtual,/not proof of the cause or a cure/);
 assert.match(virtual,/do not delay|without waiting/i);
 const functioning=copy(curatedPriorityAnswer('what-is-high-functioning-autism'));
 assert.match(functioning,/not a separate current diagnosis/);
 assert.match(functioning,/support needs|support is needed/);
});

test('all answers supply a practical call, centre and supported enquiry route without a free offer',()=>{
 for(const a of [...priorityEditorialSlugs.map(answer),...curatedPrioritySlugs.map(curatedPriorityAnswer)]){
  assert.match(a.answer_md,/tel:\+919100181181/);
  assert.match(a.answer_md,/\/centers\)/);
  assert.match(a.answer_md,/\/enroll-autism-speech-aba-therapies-india(?:\?service=(?:education|occupational|autism))?\)/);
  assert.doesNotMatch(copy(a),/free assessment|guaranteed graduation|patent granted|world.?s only/i);
 }
});
