export function reuseAcceptedSeed(source, delta, maintenance) {
  return maintenance.status === 'verified' &&
    source.phase === 'verified_unchanged_publication' &&
    Array.isArray(delta.changes) && delta.changes.length === 0 &&
    !maintenance.metadataInitializations && !maintenance.r2StableChangesDrained;
}
export function servedPublicationFiles(manifest) {
  return manifest.files.filter(f => !['robots_addition', 'llms_addition'].includes(f.kind));
}
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
export function publisherContentVersion(snapshot,resources=[],r2={}) {
  if(!snapshot.complete||!snapshot.stable||! /^[a-f0-9]{64}$/.test(snapshot.sourceSHA256||''))throw Error('Stable publisher content fingerprint required');
  const rows=resources.map(r=>[r.page_url,r.content_sha256,r.reading_text_sha256,r.etag||'']).sort((a,b)=>String(a[0]).localeCompare(String(b[0])));
  const storage=(r2.records||[]).map(r=>[r.id||r.bucket+'/'+r.key,r.etag||'',r.present!==false]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])));
  return createHash('sha256').update(JSON.stringify([snapshot.sourceSHA256,rows,storage])).digest('hex');
}
export function mayRecoverReadOnly(source,before,after,count=0) {
  if(count>=3||source?.phase!=='started'||source.archive||source.pushed||source.version||source.deployment||source.pending)return false;
  if(!before||!after||!isDeepStrictEqual(before.routes,after.routes))return false;
  return isDeepStrictEqual(before.workers,after.workers)&&!(source.steps||[]).some(s=>s.label==='publish');
}
export function priorJobPermitsExecution(job) {
  return !job||['verified-cloud-source-and-distribution','source-verified-submission-pending','owner-reconciled-last-good'].includes(job.status)||
    (job.status==='verified-read-only-failure'&&Number(job.readOnlyRecoveries)<3)||
    (job.status==='source-verified-source-holds-pending'&&['verified_unchanged_publication','verified_published'].includes(job.sourcePhase)&&typeof job.version==='string'&&job.version.length>0&&Number(job.publicFilesVerified)>0);
}
