import assert from 'node:assert/strict';
export function coverageFreshness(pages,now=new Date(),maxAgeHours=24){
 assert(pages.length&&Number.isFinite(maxAgeHours)&&maxAgeHours>0&&maxAgeHours<=24);
 const observations=pages.map(x=>Date.parse(x.observedAt));assert(observations.every(Number.isFinite),'Every metadata page needs its actual observation time');
 const oldest=Math.min(...observations),newest=Math.max(...observations),oldestAgeMs=now.getTime()-oldest;
 return {oldestPageObservedAt:new Date(oldest).toISOString(),newestPageObservedAt:new Date(newest).toISOString(),oldestPageAgeHours:oldestAgeMs/3600000,maxAgeHours,fresh:oldestAgeMs<=maxAgeHours*3600000&&now.getTime()-newest>=-300000,observedMetadataPages:pages.length,passObservations:[0,1].map(pass=>{const selected=pages.filter(p=>p.pass===pass);return{pass:pass+1,pages:selected.length,firstObservedAt:selected.length?new Date(Math.min(...selected.map(p=>Date.parse(p.observedAt)))).toISOString():null,lastObservedAt:selected.length?new Date(Math.max(...selected.map(p=>Date.parse(p.observedAt)))).toISOString():null};})};
}
