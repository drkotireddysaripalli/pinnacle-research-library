import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
const text=fs.readFileSync('public/pinnacle-pages-scripts/enrolment.js','utf8'),a=text.indexOf(' const offerReference='),b=text.indexOf(' const centreIds=',a);assert(a>=0&&b>a);
const gate=text.slice(a,b)+'\nactiveOffer();',ref='navratri-one-service-month-2026';
test('only one explicit monthly-offer reference labels the enquiry; ordinary, invalid and duplicate queries remain unlabelled',()=>{
 for(const [query,expected]of [['', ''],['?service=speech',''],['?offer='+ref,ref],['?offer=unknown',''],['?offer='+ref+'&offer='+ref,''],['?offer='+ref+'&offer=unknown','']]){
 assert.equal(vm.runInNewContext(gate,{URL,location:{href:'https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india'+query},form:{dataset:{offerReference:ref}}}),expected,query);
 }
 assert.equal(vm.runInNewContext(gate,{URL,location:{href:'https://www.pinnacleblooms.org/?offer=unknown'},form:{dataset:{offerReference:'unknown'}}}),'');
});
