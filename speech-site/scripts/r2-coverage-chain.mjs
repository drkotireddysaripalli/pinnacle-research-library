import assert from 'node:assert/strict';import{createHash}from'node:crypto';
export const R2_SCOPES=[['pbn-test','Assets/InterventionTechniques/'],['pbn-test','Assets/InterventionTechniquePdf/'],['pbn-test','Assets/Materials/'],['pbn-test','Ability/Assessments/'],['pinnacle-ask-og','']];
export const pageHash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function validateCoverageChain(state,files){
 assert.equal(state.schemaVersion,2,'Unsupported R2 observation checkpoint');assert(/^[a-f0-9]{64}$/.test(state.registrySHA256||''));assert(Number.isFinite(Date.parse(state.startedAt)));
 const names=Object.keys(files).sort();assert.deepEqual(Object.keys(state.pageHashes||{}).sort(),names,'R2 page membership differs from observation index');
 let pass=0,scope=0,page=0,cursor=null,count=0;const seen=[new Set(),new Set()];
 while(pass<2){
  const name=`pass-${pass}-scope-${scope}-page-${page}.json`;if(!Object.hasOwn(files,name))break;
  const bytes=Buffer.from(files[name]);assert.equal(pageHash(bytes),state.pageHashes[name],'R2 page hash differs');const p=JSON.parse(bytes);
  const[bucket,prefix]=R2_SCOPES[scope];assert.equal(p.registrySHA256,state.registrySHA256);assert.deepEqual([p.pass,p.scope,p.page,p.bucket,p.prefix],[pass,scope,page,bucket,prefix],'R2 observation identity differs');assert.equal(p.inputCursor,cursor);
  assert(Number.isInteger(p.rowsExamined)&&p.rowsExamined>=0&&p.rowsExamined<=1000&&Array.isArray(p.known)&&p.known.length<=p.rowsExamined);
  const observed=Date.parse(p.observedAt);assert(Number.isFinite(observed)&&observed>=Date.parse(state.startedAt)-300000,'R2 observation time missing or older than cycle');
  assert.equal(typeof p.truncated,'boolean');
  if(p.paginationEvidence==='short-terminal-page-without-cursor')assert(!p.truncated&&p.rowsExamined<1000&&p.nextCursor===null);
  else assert.equal(p.paginationEvidence,'explicit-truncation-flag','Missing terminal/continuation evidence');
  if(p.truncated)assert(typeof p.nextCursor==='string'&&p.nextCursor&&p.nextCursor!==cursor);else assert.equal(p.nextCursor,null);
  for(const row of p.known){assert(typeof row.id==='string'&&row.id.startsWith(bucket+'/'+prefix)&&typeof row.etag==='string'&&Number.isFinite(row.size)&&row.size>=0);assert(!seen[pass].has(row.id),'Duplicate key in one R2 pass');seen[pass].add(row.id);}
  count++;page++;if(p.truncated)cursor=p.nextCursor;else{scope++;page=0;cursor=null;if(scope===R2_SCOPES.length){pass++;scope=0;}}
 }
 assert.equal(count,names.length,'Noncontiguous or excess R2 observation pages');assert.equal(state.completedPages,count,'R2 page count differs');assert.deepEqual([state.pass,state.scope,state.page,state.cursor],[pass,scope,page,cursor],'R2 frontier claims unobserved coverage');
 if(state.complete)assert.equal(pass,2,'Two complete five-scope passes required before absence');
 return{validatedMetadataPages:count,completePasses:pass,pass,scope,page,cursorPresent:!!cursor};
}
