export function dailyPlan(manifest,state={},date=new Date()){
  const day=Math.floor(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())/86400000);
  const oldest=(priority,count)=>manifest.filter(r=>r.priority===priority&&r.published).sort((a,b)=>(state.coverage?.[a.id]?.at||'').localeCompare(state.coverage?.[b.id]?.at||'')||a.id.localeCompare(b.id)).slice(0,count).map(r=>r.id);
  const critical=['pinnacleai','speech','enrolment'];
  return [
    {name:'daily-critical',suite:'daily',matrix:'chrome'},
    {name:'daily-presentation',suite:'p2',matrix:'edge',ids:[...critical,'shop','centre-suchitra',...oldest('p2',3)],network:date.getUTCDay()===2||date.getUTCDay()===5},
    {name:'daily-records',suite:'p3',matrix:'chrome',ids:oldest('p3',28)},
    {name:'daily-browser',suite:'bvt',matrix:['firefox','safari','edge'][day%3],ids:critical},
    {name:'daily-physical',suite:'bvt',matrix:['ios','android','ipad','iosSmall'][day%4],ids:critical}
  ];
}
