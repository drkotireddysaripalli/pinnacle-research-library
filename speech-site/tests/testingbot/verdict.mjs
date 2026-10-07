export function suiteVerdict(report){
  const expected=report.requestedMatrix||[],ids=report.selectedIds||[];
  if(!expected.length||!ids.length||new Set(expected).size!==expected.length||new Set(ids).size!==ids.length||report.sessions.length!==expected.length)return false;
  return expected.every(id=>{
    const s=report.sessions.find(s=>s.matrix===id);
    return s?.status==='passed'&&s.closed===true&&s.resultRecorded===true&&s.provider?.success===true&&s.cases.length===ids.length&&ids.every(id=>{const c=s.cases.find(c=>c.id===id);return c?.status==='passed'&&c.checks.length>0&&c.checks.every(x=>x.passed===true);});
  });
}
