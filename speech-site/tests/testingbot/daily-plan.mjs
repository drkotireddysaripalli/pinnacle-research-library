import {evidencePriorities,evidenceCases,sampleRank} from './evidence-priorities.mjs';
export function dailyPlan(manifest,state={},date=new Date(),profile={}){
  const day=Math.floor(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())/86400000);
  const risk=evidencePriorities(manifest,profile,state);
  const oldest=rows=>[...rows].sort((a,b)=>(state.coverage?.[a.id]?.at||'').localeCompare(state.coverage?.[b.id]?.at||'')||a.id.localeCompare(b.id));
  const rotate=(priority,count,reserved)=>{
    const rows=manifest.filter(r=>r.priority===priority&&r.published),ids=[];
    // Most slots guarantee progress through the inventory; bounded remaining
    // slots revisit failures/demand or provide a reproducible varied sample.
    const important=[...rows].sort((a,b)=>(risk[b.id]?.score||0)-(risk[a.id]?.score||0)||sampleRank(a.id,day)-sampleRank(b.id,day));
    ids.push(...important.slice(0,reserved).map(r=>r.id));
    ids.push(...oldest(rows.filter(r=>!ids.includes(r.id))).slice(0,count-ids.length).map(r=>r.id));
    return ids;
  };
  const critical=['pinnacleai','speech','enrolment'];
  const plan=[
    {name:'daily-critical',suite:'daily',matrix:'chrome'},
    {name:'daily-presentation',suite:'p2',matrix:'edge',ids:[...critical,'shop','centre-suchitra',...rotate('p2',3,1)],network:date.getUTCDay()===2||date.getUTCDay()===5},
    {name:'daily-records',suite:'p3',matrix:'chrome',ids:rotate('p3',28,6)},
    {name:'daily-browser',suite:'bvt',matrix:['firefox','safari','edge'][day%3],ids:critical},
    {name:'daily-physical',suite:'bvt',matrix:['ios','android','ipad','iosSmall'][day%4],ids:critical}
  ];
  const failed=evidenceCases(profile,state).filter(r=>r.functional==='fail'&&!r.candidate_build&&['bvt','p1','p2','p3'].includes(r.suite)&&manifest.some(p=>p.id===r.case_id&&p.published));
  const covered=r=>plan.some(job=>job.matrix===r.matrix&&(job.suite==='daily'?'p1':job.suite)===r.suite&&(!job.ids||job.ids.includes(r.case_id)));
  const needed=failed.filter(r=>!covered(r)).sort((a,b)=>a.at.localeCompare(b.at)||a.case_id.localeCompare(b.case_id));
  if(needed.length){
    const first=needed[0],ids=[...new Set(needed.filter(r=>r.matrix===first.matrix&&r.suite===first.suite).map(r=>r.case_id))].slice(0,3);
    ids.push(...critical.filter(id=>!ids.includes(id)).slice(0,3-ids.length));
    // Reuse the three-case secondary job; no extra session or suite expansion.
    plan[3]={name:'daily-targeted-retry',suite:first.suite,matrix:first.matrix,ids,reason:'Retry actual unresolved browser/suite; rotation resumes when cleared'};
  }
  return plan;
}
