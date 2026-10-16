import assert from 'node:assert/strict';
import {graphFingerprint,publicCanonical} from './sitemap-submission-plan.mjs';

// A failed publish may be reconciled locally without repeating database/R2 work.
// This mode only drains a protected outbox bound to that exact verified release.
export function validateDistributionResume({id,receipt,manifestSHA256,plan,graphs}) {
 assert(/^distribution-only-[a-z0-9-]{8,60}$/.test(id),'Explicit distribution-only dispatch required');
 assert.equal(receipt.phase,'verified_complete','Actual public verification required');
 assert.equal(receipt.pending,null,'Uncertain publication mutation remains');
 const b=plan.publicationBinding;assert(b,'Outbox publication binding required');
 assert.equal(b.version,receipt.candidateVersion);assert.equal(b.releaseId,receipt.releaseId);assert.equal(b.source,receipt.source);assert.equal(b.manifestSHA256,manifestSHA256);
 assert(Array.isArray(plan.indexnow)&&Array.isArray(plan.sitemaps));
 const fingerprints=new Map(graphs.map(g=>[g.root,graphFingerprint(g.root,g.files)]));
 for(const job of plan.sitemaps){assert(fingerprints.has(job.root),'Unmanaged sitemap');if(!job.google?.submittedAt||!job.bing?.submittedAt)assert.equal(job.fingerprint,fingerprints.get(job.root),'Unsubmitted graph is stale');}
 for(const job of plan.indexnow){assert(Array.isArray(job.urls)&&job.urls.length>0&&job.urls.length<=10000);for(const url of job.urls)assert(publicCanonical(url)===url&&new URL(url).hostname===job.host,'Unapproved notification URL');}
 return {sourceQueries:0,r2InventoryQueries:0,publicationMutations:0};
}
