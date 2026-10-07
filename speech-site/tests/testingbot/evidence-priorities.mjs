// Offline selection only. It neither queries vendors nor creates a repair/send.
export function evidenceCases(profile={},state={}){
  const latest=new Map();
  for(const record of profile.testingbot?.records||[]){
    if(record.candidate_build)continue;
    const key=[record.case_id,record.matrix,record.suite].join('|');
    if(!latest.has(key)||record.at>latest.get(key).at)latest.set(key,record);
  }
  for(const [key,record] of Object.entries(state.coverageByProfile||{})){
    if(!latest.has(key)||record.at>latest.get(key).at)latest.set(key,{...record,functional:record.status==='failed'?'fail':record.status==='passed'?'pass':'unconfirmed'});
  }
  return [...latest.values()];
}
export function evidencePriorities(manifest,profile={},state={}){
  const scores={};
  const observations=profile.url_observations||{};
  const latest=evidenceCases(profile,state);
  for(const row of manifest.filter(r=>r.published)){
    const evidence=observations[row.canonical]||{};const reasons=[];
    let score=0;
    const gsc=evidence.gsc;
    if(gsc?.clicks>0){score+=Math.min(60,Math.round(Math.log2(gsc.clicks+1)*8));reasons.push('Saved GSC landing demand '+gsc.start+' to '+gsc.end);}
    const queries=evidence.ahrefs_india_queries||[];
    if(queries.length){score+=Math.min(15,queries.length*3);reasons.push('Saved Ahrefs India query observations; estimates remain separate');}
    const frog=evidence.screaming_frog;
    if(Number(frog?.['Status Code'])>=400){score+=40;reasons.push('Saved completed crawl response; '+frog.completed_at+' is historical evidence, not current failure proof');}
    const failed=latest.filter(r=>r.case_id===row.id&&r.functional==='fail');
    if(failed.length){score+=1000;reasons.push('Unresolved same-suite/browser test findings: '+failed.map(r=>r.matrix+'/'+r.suite).join(', '));}
    if(profile.pitchbox?.public_destinations?.includes(row.canonical)){score+=20;reasons.push('Existing referenced outreach resource; no sending is implied');}
    scores[row.id]={score,reasons};
  }
  return scores;
}

export function sampleRank(id,day){
  // Stable daily variation is reproducible from the report, not Math.random().
  let h=2166136261;for(const char of day+'|'+id){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;
}

export function recordCoverage(state,report){
  state.coverage??={};state.coverageByProfile??={};
  if(!report.finishedAt)return;
  for(const session of report.sessions||[]){
    if(session.closed!==true||session.resultRecorded!==true)continue;
    for(const c of session.cases||[]){
      if(!['passed','failed'].includes(c.status)||!c.finishedAt)continue;
      if(c.status==='passed'&&(!c.checks?.length||!c.checks.every(x=>x.passed===true)))continue;
      const scope=report.suite==='daily'?'p1':report.suite;
      const key=[c.id,session.matrix,scope].join('|');
      const previous=state.coverageByProfile[key]||{};
      const observation={case_id:c.id,at:c.finishedAt,matrix:session.matrix,suite:scope,status:c.status,
        lastPassed:c.status==='passed'?c.finishedAt:previous.lastPassed,
        unresolvedFailure:c.status==='failed'?{at:c.finishedAt,checks:c.checks.filter(x=>!x.passed).map(x=>x.name)}:null};
      if(!previous.at||observation.at>=previous.at)state.coverageByProfile[key]=observation;
      if(!state.coverage[c.id]?.at||c.finishedAt>=state.coverage[c.id].at)state.coverage[c.id]={at:c.finishedAt,matrix:session.matrix,status:c.status};
    }
  }
}
