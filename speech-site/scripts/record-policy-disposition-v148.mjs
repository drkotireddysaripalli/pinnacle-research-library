import fs from 'node:fs';
import assert from 'node:assert/strict';
const gates={
 'terms-of-use':'Confirm the intended agreement title and scope, the contracting party where Muscle-UP appears, and the intended opt-out recipient care@pinnaclblooms.org.',
 'cookie-policy':'Confirm whether the defined Site covers Pinnacle Clinics, Pinnacle Blooms or both, and approve consent wording that matches the actual controls.',
 'copyright-and-intellectual':'Confirm the duplicate clauses 19.1/19.2 and provide the designated Copyright Agent name or role and working contact.',
 'contact-information':'Confirm the usable mailing address, office/team hours and Saturday schedule; telephone guidance hours must not be substituted for office hours.',
 'endorsement-and-testimonial':'Confirm the intended meaning of clause 5.2 on wilful defamatory actions and the material-connection disclosure instruction.',
 'third-party-inegration':'Confirm the identity, version and accessible location of the referenced Security Policy and Data Protection Policy.',
 'refund-policy':'Confirm the intended refund email and reconcile section 4 written exceptions with sections 9 and 19.',
 'staff-declaration':'Confirm the operative edition, issuer/approval/creator, L4/L5 mapping and edition-specific 344-skills and 21-million-service references.',
 'ethics-charter':'Confirm implemented reporting routes and deadlines, which programmes/badges are implemented or planned, and the operative edition/date for the 19-million-service reference.'
};
const json='reviews/PAGE-CLEANUP-REGISTER-20261001.json',register=JSON.parse(fs.readFileSync(json));
const cf=JSON.parse(fs.readFileSync('deployment/policy-cloudflare-v148-20261001.json'));
const live=JSON.parse(fs.readFileSync('deployment/page-correction-v148-live-20261001.json'));
const version=cf.deployments[0].versions[0].version_id,receipt='RELEASE-POLICY-PRESENTATION-V148-20261001.md';
assert.equal(cf.routeCount,177);assert.deepEqual(cf.routeChanges,[]);assert.equal(live.changed.length,14);
let md=fs.readFileSync('reviews/PAGE-CLEANUP-REGISTER-20261001.md','utf8');
for(const [id,gate] of Object.entries(gates)){
 const row=register.rows.find(x=>x.id===id);assert(row&&row.state==='queued');assert(live.changed.includes(id));
 Object.assign(row,{state:'source-pending',presentationCompletedOn:'2026-10-01',sourceCommit:'15c0482',workerVersion:version,receipt,sourceDecision:gate,nextCondition:'A confirmed source or operating decision for the named point, followed by one bounded source revision; no repeat presentation cleanup.'});
 const name=row.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 md=md.replace(new RegExp('(### \\d+\\. '+name+' · )[^\\n]+'),`$1PRESENTATION COMPLETE · SOURCE DECISION PENDING\n\nPresentation: [V148 release receipt](../${receipt}).\n\nRemaining source decision: ${gate}\n\nThe original task is retained below; do not repeat its completed formatting pass.`);
}
register.counts=Object.fromEntries(['keep','completed','queued','source-pending'].map(k=>[k,register.rows.filter(x=>x.state===k).length]));
const next=register.rows.filter(x=>x.state==='queued').sort((a,b)=>a.sequence-b.sequence)[0];
md=md.replace(/\*\*15\s*keep,[^\n]*/,`**15 keep, ${register.counts.completed} completed, ${register.counts.queued} executable tasks remaining, 9 source decisions pending.** V148 presentation is live on all 14 policy pages. Next: ${next.name}; the shared source fix will close the eight centre voice rows.`);
fs.writeFileSync(json,JSON.stringify(register,null,2)+'\n');fs.writeFileSync('reviews/PAGE-CLEANUP-REGISTER-20261001.md',md);
let active=fs.readFileSync('ACTIVE-PAGE-WORK-ORDER.md','utf8');active=active.replace(/\*\*NOW —[^\n]*/,`**NOW — eight centre voice rows, starting with ${next.name}:** Fix the direct introduction, arrival instructions and matching FAQs once in the common centre source; retain local examples, media, maps and evidence. Nine policy source decisions stay recorded separately.`);fs.writeFileSync('ACTIVE-PAGE-WORK-ORDER.md',active);
fs.appendFileSync(receipt,'\n### Exact remaining source decisions\n\n'+Object.entries(gates).map(([id,gate])=>`- ${id}: ${gate}`).join('\n')+'\n\nThese are source decisions, not uncompleted presentation work. Do not silently invent an officer, recipient, policy version, implemented reporting route or contract term.\n');
console.log(JSON.stringify({counts:register.counts,next:next.id,sourcePending:Object.keys(gates)}));
