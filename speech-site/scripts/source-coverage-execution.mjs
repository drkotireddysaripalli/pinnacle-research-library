import assert from 'node:assert/strict';
// Only a read-only, explicitly checkpointed partial R2 scan can continue here.
// Source/publication failures and source holds are never retried by this loop.
export async function runBoundedCoverage({run,readMaintenance,checkpoint,maxSegments=2}){
 assert.equal(maxSegments,2);const observations=[];
 for(let pass=0;pass<maxSegments;pass++){
  const exit=await run(pass),receipt=await readMaintenance();
  if(exit===0)return receipt;
  assert.equal(exit,2,'Source failure requires reconciliation');
  assert.equal(receipt.status,'coverage-pending-last-good-preserved');
  assert.equal(receipt.r2Complete,false);assert(!receipt.sourceReceipt&&!receipt.sourcePhase,'A possible source/publication mutation cannot be continued automatically');
  observations.push({pass:pass+1,metadataPages:receipt.r2MetadataPages,checkpoint:receipt.r2Checkpoint});await checkpoint(observations);
 }
 throw Error('R2 coverage remains incomplete after the bounded 1200-query job; checkpoint retained, no source publication started');
}
