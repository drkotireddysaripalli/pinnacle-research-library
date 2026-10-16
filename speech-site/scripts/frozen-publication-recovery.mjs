import assert from 'node:assert/strict';
// Owner-reconciled recovery reuses a reviewed archive, never untrusted branch code.
export function validateFrozenRecovery(r,{id,baseline,selection,archiveSHA,source,sourceTree,trustedTree,pr}){
 assert.equal(r.dispatchId,id);assert.equal(r.baselineVersion,baseline.candidateVersion);
 assert.match(r.branch,/^codex\/cloud-source-[a-z0-9-]+$/);assert.match(r.source,/^[a-f0-9]{40}$/);
 assert.equal(source,r.source);assert.equal(sourceTree,trustedTree,'Recovery code must be the exact trusted main tree');
 assert(pr.merged&&pr.base.ref==='main'&&pr.head.sha===source&&pr.head.repo.full_name==='drkotireddysaripalli/pinnacle-research-library','Recovery source must have an exact merged first-party PR');
 assert.equal(selection.archive_sha256,r.archiveSHA256);assert.equal(archiveSHA,r.archiveSHA256);
 assert.equal(selection.release_id,r.releaseId);assert.match(r.archiveSHA256,/^[a-f0-9]{64}$/);assert.match(r.releaseId,/^[a-f0-9]{64}$/);
 assert.equal(baseline.phase,'verified_complete');
 return true;
}
