const acknowledged=s=>Number.isInteger(s?.httpStatus)&&s.httpStatus>=200&&s.httpStatus<300&&Number.isFinite(Date.parse(s.submittedAt));
const readable=s=>!s?.authStatus&&!(s?.readbackStatus>=400);
function settledProof(job){
 const g=job.google,b=job.bing,match=b?.readback?.lastCrawled?.match?.(/^\/Date\((\d+)/),crawled=match?Number(match[1]):Date.parse(b?.readback?.lastCrawled);
 return g?.status==='download-verified-not-page-indexing'&&b?.status==='processing-verified'&&g.readback?.isPending===false&&Number(g.readback?.errors)===0&&Number(g.readback?.warnings)===0&&Date.parse(g.readback.lastDownloaded)>=Date.parse(g.submittedAt)&&b.readback?.status==='Success'&&crawled>=Date.parse(b.submittedAt);
}
function sitemapAccepted(job){
 if(!['download-verified','submission-or-processing-pending'].includes(job.status))return false;
 const g=job.google,b=job.bing;
 if(!acknowledged(g)||!acknowledged(b)||!readable(g)||!readable(b))return false;
 if(!['submitted-pending-download','download-verified-not-page-indexing'].includes(g.status)||!['submitted-processing-readback-pending','processing-verified'].includes(b.status))return false;
 if(g.readback&&(g.readback.path!==job.root||Number(g.readback.errors)>0||Number(g.readback.warnings)>0))return false;
 if(b.readback&&(b.readback.url!==job.root||!['Pending','Success'].includes(b.readback.status)))return false;
 return job.status!=='download-verified'||settledProof(job);
}
export function sourceJobConclusion(sourceCoverageHealthy,plan){
 const submissionsAccepted=(plan.indexnow||[]).every(j=>j.status==='submitted-not-indexed'&&[200,202].includes(j.httpStatus)&&Number.isFinite(Date.parse(j.submittedAt)))&&(plan.sitemaps||[]).every(sitemapAccepted);
 const engineProcessingPending=submissionsAccepted&&(plan.sitemaps||[]).some(j=>j.status!=='download-verified');
 const status=!sourceCoverageHealthy?'source-verified-source-holds-pending':!submissionsAccepted?'source-verified-submission-pending':engineProcessingPending?'source-verified-engine-processing-pending':'verified-cloud-source-and-distribution';
 return{status,exitCode:sourceCoverageHealthy&&submissionsAccepted?0:2,submissionsAccepted,engineProcessingPending};
}
