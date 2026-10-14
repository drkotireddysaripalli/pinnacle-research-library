import assert from 'node:assert/strict';
const owned=new Set(['www.pinnacleblooms.org','pinnacleblooms.org','materials.pinnacleblooms.org','interventions.pinnacleblooms.org','pediatricians.pinnacleblooms.org']);
const normal=p=>p.replace(/^https?:\/\//,'');
export function routeCovered(routes,path,publisher='pinnacle-verify-route') {
  routes=routes.filter(r=>!r.pattern.startsWith('http://'));const exacts=routes.filter(r=>normal(r.pattern)===path);assert(new Set(exacts.map(r=>r.script)).size<=1,'Ambiguous exact route owners');const exact=exacts[0];
  if(exact){assert.equal(exact.script,publisher,'Exact managed destination belongs to another owner');return true;}
  const matching=routes.filter(r=>normal(r.pattern).endsWith('*')&&path.startsWith(normal(r.pattern).slice(0,-1))).sort((a,b)=>normal(b.pattern).length-normal(a.pattern).length);if(matching.length){const rank=normal(matching[0].pattern).length;assert(new Set(matching.filter(r=>normal(r.pattern).length===rank).map(r=>r.script)).size<=1,'Ambiguous wildcard owners');}
  return matching[0]?.script===publisher;
}
export function discoveryRoutePlan(routes,paths,{allowAdd=true}={}) {
  const additions=[];
  for(const path of new Set(paths)){assert(owned.has(path.split('/')[0])&&/^\/sitemap-[a-z0-9-]+\.xml$/.test('/'+path.split('/').slice(1).join('/')),'Only managed discovery XML may use this planner');if(!routeCovered(routes,path)){assert(allowAdd,'Unattended source refresh needs an owner-managed discovery route before publication');additions.push(path);}}
  return additions;
}
