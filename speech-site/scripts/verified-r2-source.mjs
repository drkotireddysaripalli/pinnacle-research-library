import assert from 'node:assert/strict';
export function verifiedR2Source(proof,delta,approved,registrySHA256,observedAt){
 assert.equal(proof.registrySHA256,registrySHA256);assert.equal(proof.approvedKeys,Object.keys(approved).length);assert.equal(proof.completePasses,2);assert(proof.matchedInFirstPass+proof.confirmedAbsent+proof.unstableHeld>=proof.approvedKeys);assert(proof.matchedInSecondPass+proof.confirmedAbsent+proof.unstableHeld>=proof.approvedKeys);
 const records=[],changes=[],holds=[],seen=new Set(),chunks=[];
 for(let offset=0;offset<delta.changes.length;offset+=128){let accepted=0;for(const x of delta.changes.slice(offset,offset+128)){
  assert(!seen.has(x.id));seen.add(x.id);const prior=approved[x.id];assert(prior&&['owned','permission_recorded','licensed','public_domain'].includes(prior.rights_status)&&prior.public_uses.length,'Approved parent/rights association required');const cut=x.id.indexOf('/');assert(cut>0);const deleted=x.operation==='delete';if(deleted)assert(x.confirmedAbsentInTwoCompletePasses);else assert(typeof x.etag==='string'&&x.etag.length&&Number.isFinite(x.size));
  const row={bucket:x.id.slice(0,cut),key:x.id.slice(cut+1),present:!deleted,operation:x.operation,etag:deleted?null:x.etag,size:deleted?null:x.size,parents:prior.public_uses,observed_at:observedAt,metadataOnly:true,mediaBytesDownloaded:false,objectTimeIsNotPageLastmod:true,source:'complete-approved-two-pass-R2-metadata'};records.push(row);changes.push(row);accepted++;
 }chunks.push({offset,count:accepted});}
 for(const id of delta.holds)holds.push({subject_sha256:id,condition:'Object metadata unstable between complete passes; last valid association preserved',owner:'resource publisher'});
 return {records,changes,holds,verifiedTwoPassProof:true,chunks,totalStableChangesApplied:changes.length,remainingStableChanges:0,perObjectRequeries:0};
}
