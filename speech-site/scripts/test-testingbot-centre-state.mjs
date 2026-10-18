import test from'node:test';import assert from'node:assert/strict';
import{publicDocumentAllowed,heldCentreSnapshotAllowed}from'../tests/testingbot/centre-state.mjs';
import{CENTRE_OPERATING_HOLDS}from'../public/pinnacle-pages-scripts/centre-operating-holds.mjs';
test('only explicit maintained location status pages may retain intentional noindex',()=>{
 const status={kind:'centre',status:'location-status'},open={kind:'centre',status:'centre-enquiry'};
 assert(publicDocumentAllowed(status,{status:200,xRobots:'noindex, follow'}));
 for(const row of[open,{kind:'portal'},{status:'location-status'}])assert(!publicDocumentAllowed(row,{status:200,xRobots:'noindex, follow'}));
 assert(publicDocumentAllowed(open,{status:200,xRobots:null}));
 for(const http of[{status:404,xRobots:'noindex, follow'},{status:200,xRobots:null},{status:200,xRobots:'noindex, nofollow'}])assert(!publicDocumentAllowed(status,http));
});
test('every actual held branch requires central help and no branch assignment',()=>{
 assert.equal(CENTRE_OPERATING_HOLDS.length,4);
 for(const hold of CENTRE_OPERATING_HOLDS){
  const good={noticeId:hold.id,closedNotice:true,centralCall:true,form:true,defaultCentre:'',selectedCentre:'',option:{value:hold.id,disabled:true,selected:false},heldAssignmentLinks:0,directBranchCall:false,safeHero:true};
  assert(heldCentreSnapshotAllowed(good,hold.id));
  for(const change of[{noticeId:'other'},{closedNotice:false},{centralCall:false},{form:false},{defaultCentre:hold.id},{selectedCentre:hold.id},{option:{...good.option,disabled:false}},{option:{...good.option,selected:true}},{heldAssignmentLinks:1},{directBranchCall:true},{safeHero:false}])assert(!heldCentreSnapshotAllowed({...good,...change},hold.id));
 }
});
