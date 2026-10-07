import test from 'node:test';import assert from 'node:assert/strict';
import {pageManifest,selectCases} from '../tests/testingbot/page-manifest.mjs';
import {suiteVerdict} from '../tests/testingbot/verdict.mjs';
import {dailyPlan} from '../tests/testingbot/daily-plan.mjs';
import fs from 'node:fs/promises';
import ts from 'typescript';
import {recordShards} from '../tests/testingbot/record-shards.mjs';
import {headerReferenceName,imageInViewport,desktopScreenResolution,fitCssViewport} from '../tests/testingbot/presentation-state.mjs';
import {evidencePriorities,recordCoverage} from '../tests/testingbot/evidence-priorities.mjs';
const good=()=>({requestedMatrix:['chrome'],selectedIds:['enrolment'],sessions:[{matrix:'chrome',status:'passed',closed:true,resultRecorded:true,provider:{success:true},cases:[{id:'enrolment',status:'passed',checks:[{passed:true}]}]}]});
test('Missing, unavailable or unexecuted browser/page cannot be green',()=>{
  assert.equal(suiteVerdict(good()),true);
  for(const change of [r=>r.sessions=[],r=>r.sessions[0].status='unavailable',r=>r.sessions[0].closed=false,r=>r.sessions[0].resultRecorded=false,r=>r.sessions[0].provider.success=false,r=>delete r.sessions[0].provider,r=>r.sessions[0].cases=[],r=>r.sessions[0].cases[0].checks=[],r=>r.sessions[0].cases[0].checks[0].passed=false,r=>r.requestedMatrix.push('ios'),r=>r.requestedMatrix.push('chrome'),r=>r.selectedIds.push('speech')]){const r=good();change(r);assert.equal(suiteVerdict(r),false);}
});
test('Build cases use actual build locations and retain public canonicals',async()=>{const m=await pageManifest(),b=selectCases(m,'bvt',{build:true});assert(b.length>=4);assert(b.every(r=>r.buildPath));assert.equal(b.find(r=>r.id==='speech').buildPath,'/');assert.equal(b.find(r=>r.id==='speech').canonical,'https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate');assert(!b.some(r=>r.id==='verify'||r.id==='ask-answer'));});
test('Existing page priorities and unpublished libraries remain accountable',async()=>{const m=await pageManifest();assert.equal(new Set(m.map(r=>r.canonical)).size,m.length);assert.equal(m.filter(r=>r.kind==='centre').length,62);assert.deepEqual(m.filter(r=>!r.published).map(r=>r.id),['materials','interventions']);assert.throws(()=>selectCases(m,'p99'));assert.throws(()=>selectCases(m,'bvt',{ids:['unknown']}));assert(selectCases(m,'p1').some(r=>r.id==='autism'));assert(selectCases(m,'p3').some(r=>r.family==='centre-status'));});
test('Daily coverage reserves bounded revisits while progressing through every published record',async()=>{
  const m=await pageManifest(),state={coverage:{}},seen=new Set();
  for(let day=7;day<16;day++){
    const date=new Date('2026-10-'+String(day).padStart(2,'0')+'T03:00:00Z'),plan=dailyPlan(m,state,date),ids=plan.find(p=>p.suite==='p3').ids;
    assert.equal(plan.length,5);assert.equal(ids.length,28);assert.equal(new Set(ids).size,28);
    assert(!plan.flatMap(p=>p.ids||[]).includes('materials'));
    for(const id of ids){seen.add(id);state.coverage[id]={at:date.toISOString()};}
  }
  assert.equal(seen.size,m.filter(r=>r.priority==='p3'&&r.published).length);
});
test('Remote JavaScript assertions parse inside the async callback wrapper used by Appium',async()=>{const source=await fs.readFile(new URL('./testingbot-suite.mjs',import.meta.url),'utf8'),tree=ts.createSourceFile('runner.mjs',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);let count=0;const visit=n=>{if(ts.isCallExpression(n)&&n.expression.getText(tree)==='evaluate'&&n.arguments[0]&&ts.isStringLiteral(n.arguments[0])&&!n.arguments[0].text.startsWith('tb:')){assert.doesNotThrow(()=>new Function('return (function(){\n'+n.arguments[0].text+'\n});'));count++;}ts.forEachChild(n,visit);};visit(tree);assert(count>20);});
test('Full record coverage is bounded, complete, unique and keeps unpublished pages pending',async()=>{const m=await pageManifest(),p3=recordShards(selectCases(m,'p3'));assert.equal(p3.length,7);assert(p3.every(s=>s.length<=28));assert.equal(p3.flat().length,195);assert.equal(new Set(p3.flat()).size,195);assert(!recordShards(m).flat().includes('materials'));assert.throws(()=>recordShards(m,100));});
test('Approved neutral header is not reused for current-page highlights or a reader backdrop',()=>{const id='chrome-WIN11-1440x900';assert.equal(headerReferenceName(id),'pinnacle-common-v159-'+id);assert.notEqual(headerReferenceName(id,{activePath:'/abilityscore'}),headerReferenceName(id));assert.notEqual(headerReferenceName(id,{gate:true}),headerReferenceName(id));assert.notEqual(headerReferenceName(id,{activePath:'/abilityscore'}),headerReferenceName(id,{activePath:'/pinnacleai'}));});
test('Tall Edge tablet viewport receives sufficient VM screen height',()=>{assert.equal(desktopScreenResolution({width:768,height:1024}),'1920x1200');assert.equal(desktopScreenResolution({width:1440,height:900}),'1920x1080');});
test('Viewport calibration uses actual clamped outer bounds and rejects impossible dimensions',async()=>{
  let outer={width:800,height:1180},moves=0;
  const io={viewport:async()=>({width:outer.width-32,height:outer.height-122}),rect:async()=>outer,resize:async r=>{moves++;outer=r;}};
  assert.deepEqual(await fitCssViewport({width:768,height:1024},io),{width:768,height:1024});assert.equal(moves,1);
  moves=0;await assert.rejects(fitCssViewport({width:768,height:1024},{viewport:async()=>({width:768,height:961}),rect:async()=>({width:800,height:1080}),resize:async()=>{moves++;}}),/unavailable/);assert.equal(moves,3);
});
test('Image visibility excludes closed disclosures and horizontal offscreen images',()=>{
  globalThis.innerWidth=1440;globalThis.innerHeight=900;
  const img=({hidden=false,closed=false,summary=false,left=0,right=100}={})=>({closest:s=>s==='[hidden]'?(hidden?{}:null):(closed?{querySelector:()=>({contains:()=>summary})}:null),getBoundingClientRect:()=>({left,right,top:0,bottom:100,width:100,height:100})});
  try{assert.equal(imageInViewport(img()),true);assert.equal(imageInViewport(img({closed:true})),false);assert.equal(imageInViewport(img({closed:true,summary:true})),true);assert.equal(imageInViewport(img({hidden:true})),false);assert.equal(imageInViewport(img({left:1600,right:1700})),false);}finally{delete globalThis.innerWidth;delete globalThis.innerHeight;}
});
test('Stories archive retains its existing public layout while Ask/FAQ/Sunshine reader gates stay required',async()=>{const manifest=await pageManifest(),source=await fs.readFile(new URL('../ask-runtime/pages/allmirracles.astro',import.meta.url),'utf8');assert.match(source,/reader=\{false\}/);assert.equal(manifest.find(r=>r.id==='stories').gate,false);for(const id of ['ask-answer','ask-home','faq','faq-answer','sunshine','sunshine-category'])assert.equal(manifest.find(r=>r.id===id).gate,true);});
test('Saved failures outrank demand and P1 cannot clear a P2 failure or another browser',async()=>{
  const manifest=await pageManifest(),row=manifest.find(r=>r.priority==='p3'),profile={testingbot:{records:[
    {case_id:row.id,matrix:'safari',suite:'p2',functional:'fail',at:'2026-10-06'},
    {case_id:row.id,matrix:'chrome',suite:'p1',functional:'pass',at:'2026-10-07'}]}};
  assert(evidencePriorities(manifest,profile)[row.id].score>=1000);
  assert(dailyPlan(manifest,{},new Date('2026-10-07'),profile).find(r=>r.suite==='p3').ids.includes(row.id));
  const retry=dailyPlan(manifest,{},new Date('2026-10-07'),profile).find(r=>r.name==='daily-targeted-retry');
  assert.equal(retry.matrix,'safari');assert.equal(retry.suite,'p2');assert(retry.ids.includes(row.id));assert.equal(retry.ids.length,3);
  profile.testingbot.records.push({case_id:row.id,matrix:'safari',suite:'p2',functional:'pass',at:'2026-10-08'});
  assert(evidencePriorities(manifest,profile)[row.id].score<1000);
});
test('Unclosed or incomplete runs never advance coverage and last pass remains distinct from failure',()=>{
  const state={},report={suite:'p3',finishedAt:'2026-10-07',sessions:[{matrix:'chrome',closed:false,resultRecorded:true,cases:[{id:'x',finishedAt:'2026-10-07',status:'passed',checks:[{passed:true}]}]}]};
  recordCoverage(state,report);assert.equal(Object.keys(state.coverage).length,0);
  report.sessions[0].closed=true;recordCoverage(state,report);
  report.sessions[0].cases[0]={id:'x',finishedAt:'2026-10-08',status:'failed',checks:[{name:'canonical',passed:false}]};recordCoverage(state,report);
  assert.equal(state.coverageByProfile['x|chrome|p3'].lastPassed,'2026-10-07');assert.deepEqual(state.coverageByProfile['x|chrome|p3'].unresolvedFailure.checks,['canonical']);
});
