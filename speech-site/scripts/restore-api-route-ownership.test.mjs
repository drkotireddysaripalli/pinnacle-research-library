import test from 'node:test';
import assert from 'node:assert/strict';
import {planApiRestoration, RESTORE_HOSTS} from './restore-api-route-ownership.mjs';
const base = RESTORE_HOSTS.map((host,i)=>({id:`catch${i}`,pattern:`${host}/*`,script:'portal'}));
test('restores existing API owners without creating a broad API catch-all or touching enrolment',()=>{
  const routes = [...base,{id:'gl',pattern:'*pinnacleblooms.org/api/gl/*',script:'db',request_limit_fail_open:false}, {id:'form',pattern:'www.pinnacleblooms.org/api/enrolment*',script:'portal'},{id:'page',pattern:'*pinnacleblooms.org/faq/*',script:'faq'}];
  const plan=planApiRestoration(routes);
  assert.equal(plan.length,2);
  assert.ok(plan.every(r=>r.script==='db' && r.pattern.endsWith('/api/gl/*') && !r.request_limit_fail_open));
  assert.deepEqual(planApiRestoration([...routes,...plan]),[]);
});
test('retains the original more-specific Mirracle socket owner',()=>{
  const plan=planApiRestoration([...base,{id:'general',pattern:'*pinnacleblooms.org/ws*',script:'socket'}, {id:'mirracle',pattern:'*mirracle.pinnacleblooms.org/ws*',script:'db'}]);
  assert.equal(plan.find(r=>r.pattern.startsWith('mirracle.')).script,'db');
  assert.equal(plan.find(r=>r.pattern.startsWith('www.')).script,'socket');
});
test('refuses a conflicting exact API owner instead of overwriting it',()=>{
  assert.throws(()=>planApiRestoration([...base,{id:'a',pattern:'*pinnacleblooms.org/api/gl/*',script:'db'},{id:'b',pattern:'www.pinnacleblooms.org/api/gl/*',script:'other'}]), /owner conflict/);
});
test('restricts host matching and preserves paths, schemes and disabled owners',()=>{
  const plan=planApiRestoration([...base,{id:'a',pattern:'https://*.pinnacleblooms.org/api/Foo*',script:null},{id:'b',pattern:'*.other.org/api/gl/*',script:'other'}]);
  assert.equal(plan.length,2); assert.ok(plan.every(r=>r.pattern.endsWith('/api/Foo*') && r.pattern.startsWith('https://') && r.script===null));
});
