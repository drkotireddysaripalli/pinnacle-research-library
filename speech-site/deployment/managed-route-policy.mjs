import assert from 'node:assert/strict';
const owned=new Set(['www.pinnacleblooms.org','pinnacleblooms.org','materials.pinnacleblooms.org','interventions.pinnacleblooms.org','pediatricians.pinnacleblooms.org']);
const normal=p=>p.replace(/^https?:\/\//,'');
export function routeCovered(routes,path,publisher='pinnacle-verify-route') {
  const exact=routes.find(r=>normal(r.pattern)===path);
  if(exact){assert.equal(exact.script,publisher,'Exact managed destination belongs to another owner');return true;}
  const matching=routes.filter(r=>normal(r.pattern).endsWith('*')&&path.startsWith(normal(r.pattern).slice(0,-1))).sort((a,b)=>b.pattern.length-a.pattern.length);
  return matching[0]?.script===publisher;
}
export function discoveryRoutePlan(routes,paths,{allowAdd=true}={}) {
  const additions=[];
  for(const path of new Set(paths)){assert(owned.has(path.split('/')[0])&&/^\/sitemap-[a-z0-9-]+\.xml$/.test('/'+path.split('/').slice(1).join('/')),'Only managed discovery XML may use this planner');if(!routeCovered(routes,path)){assert(allowAdd,'Unattended source refresh needs an owner-managed discovery route before publication');additions.push(path);}}
  return additions;
}
