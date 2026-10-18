export function publicDocumentAllowed(row,http){
 if(http.status!==200)return false;
 const noindex=/\bnoindex\b/i.test(http.xRobots||'');
 return row.kind==='centre'&&row.status==='location-status'?noindex&&!/\bnofollow\b/i.test(http.xRobots||''):!noindex;
}
export function heldCentreSnapshotAllowed(s,id){
 return !!s&&s.noticeId===id&&s.closedNotice===true&&s.centralCall===true&&s.form===true&&s.defaultCentre===''&&s.selectedCentre===''&&s.option?.value===id&&s.option.disabled===true&&s.option.selected===false&&s.heldAssignmentLinks===0&&s.directBranchCall===false&&s.safeHero===true;
}
