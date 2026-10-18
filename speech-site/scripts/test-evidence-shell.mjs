import test from 'node:test';
import assert from 'node:assert/strict';
import {evidenceShell} from '../tests/testingbot/evidence-shell.mjs';
const origin='https://www.pinnacleblooms.org';
function fixture({parent=origin+'/verify/',section='records',footer=true,footerLinks=31,header=true,breadcrumb=false,brand=false,brandSrc=origin+'/verify/images/paradigm-finale/brand-header-600.webp',headerHrefs}={}) {
 const links=(headerHrefs||[parent,parent+'#'+section]).map(href=>({href}));
 const foot=[origin+'/','tel:+919100181181',origin+'/verify/evidence/cite.html',origin+'/verify/evidence/privacy.html',...Array(Math.max(0,footerLinks-4)).fill(origin+'/verify/#records')].slice(0,footerLinks).map(href=>({href}));
 const nav={querySelectorAll:()=>links,querySelector:s=>s==='img.brand-header'&&brand?{src:brandSrc}:null};
 return {querySelector(selector){
  if(selector==='header')return header?nav:null;
  if(selector==='footer.evidence-footer'&&footer)return {querySelectorAll:()=>foot};
  if(selector==='main > p:first-of-type'&&breadcrumb)return {querySelectorAll:()=>[{href:parent},{href:origin+'/verify/evidence/cite.html'}]};
  return null;
 }};
}
test('Maintained compact evidence and native parent guides retain their actual parent links',()=>{
 for(const name of ['research-library','scale-register','scale-and-mission','hfr-register','global-context','evidence-register','assurance-map','centre-entity-reference','cite','claim-ledger','hyderabad-telangana-andhra-pradesh-contact','organisation-profile','pinnacleai-regulatory-journey','privacy'])assert(evidenceShell(fixture(),'/verify/evidence/'+name+'.html'),name);
 for(const lang of ['','te/','hi/'])for(const name of ['abilityscore','everyday-practice','licences-and-scope'])assert(evidenceShell(fixture(),'/verify/guides/'+lang+name+'.html'));
 assert(evidenceShell(fixture({section:'study-portfolio'}),'/verify/evidence/study-index.html'));
 assert(evidenceShell(fixture({section:'appreciations'}),'/verify/evidence/recognition-register.html'));
 assert(evidenceShell(fixture(),'/verify/evidence/records/md5.html'));
});
test('Missing or misdirected evidence navigation and incomplete full footer still fail',()=>{
 for(const path of ['/verify/guides/abilityscore.html','/verify/evidence/hfr-register.html','/verify/evidence/global-context.html','/verify/evidence/evidence-register.html'])for(const options of [{footer:false},{footerLinks:4},{parent:'https://unrelated.example/'},{section:'wrong'}])assert.equal(evidenceShell(fixture(options),path),false);
 assert.equal(evidenceShell(fixture(),'/unrelated'),false);
 assert.equal(evidenceShell(fixture(),'/verify/guides/unknown.html'),false);
 assert.equal(evidenceShell(fixture(),'/verify/evidence/unreviewed-register.html'),false);
});
test('District navigation must reach its actual district section',()=>{
 assert(evidenceShell(fixture({section:'district-register'}),'/verify/evidence/district-register.html'));
 assert.equal(evidenceShell(fixture(),'/verify/evidence/district-register.html'),false);
});
test('Only the exact dataset reuse document may use its existing breadcrumb navigation',()=>{
 const path='/verify/evidence/dataset-reuse-v1.html',options={header:false,breadcrumb:true};
 assert(evidenceShell(fixture(options),path));
 for(const change of [{breadcrumb:false},{footer:false},{parent:'https://unrelated.example/'}])assert.equal(evidenceShell(fixture({...options,...change}),path),false);
 assert.equal(evidenceShell(fixture(options),'/verify/evidence/dataset-reuse-v2.html'),false);
});
test('Designed paradigm header retains its own brand, evidence parent and central call',()=>{
 const path='/verify/evidence/pinnacle-paradigm-shift.html',options={brand:true,headerHrefs:[origin+'/verify/','tel:+919100181181']};
 assert(evidenceShell(fixture(options),path));
 for(const change of [{brand:false},{brandSrc:'https://unrelated.example/verify/images/paradigm-finale/brand-header-600.webp'},{headerHrefs:[origin+'/verify/']},{headerHrefs:['tel:+919100181181']},{footerLinks:4}])assert.equal(evidenceShell(fixture({...options,...change}),path),false);
});
