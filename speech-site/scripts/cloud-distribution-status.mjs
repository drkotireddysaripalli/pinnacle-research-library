const acknowledged=s=>Number.isInteger(s?.httpStatus)&&s.httpStatus>=200&&s.httpStatus<300&&Number.isFinite(Date.parse(s.submittedAt));
const readable=s=>!s?.authStatus&&!(s?.readbackStatus>=400);
function sitemapAccepted(job){
 if(!['download-verified','submission-or-processing-pending'].includes(job.status))return false;
 const g=job.google,b=job.bing;
 if(!acknowledged(g)||!acknowledged(b)||!readable(g)||!readable(b))return false;
 if(!['submitted-pending-download','download-verified-not-page-indexing'].includes(g.status)||!['submitted-processing-readback-pending','processing-verified'].includes(b.status))return false;
 if(g.readback&&(g.readback.path!==job.root||Number(g.readback.errors)>0))return false;
 if(b.readback&&(b.readback.url!==job.root||!['Pending','Success'].includes(b.readback.status)))return false;
 return true;
}
export function sourceJobConclusion(sourceCoverageHealthy,plan){
 const submissionsAccepted=(plan.indexnow||[]).every(j=>j.status==='submitted-not-indexed'&&[200,202].includes(j.httpStatus))&&(plan.sitemaps||[]).every(sitemapAccepted);
 const engineProcessingPending=submissionsAccepted&&(plan.sitemaps||[]).some(j=>j.status!=='download-verified');
 const status=!sourceCoverageHealthy?'source-verified-source-holds-pending':!submissionsAccepted?'source-verified-submission-pending':engineProcessingPending?'source-verified-engine-processing-pending':'verified-cloud-source-and-distribution';
 return{status,exitCode:sourceCoverageHealthy&&submissionsAccepted?0:2,submissionsAccepted,engineProcessingPending};
}
