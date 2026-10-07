import {centreStoryPlaylists} from './centre-story.ts';

// Network commitments supplied by the owner on 7 October 2026. These do not
// assign a named speaker to a branch or substitute for individual credentials.
export const centreStaffCommitment={
 source:'Owner-confirmed network staffing commitment',confirmedOn:'2026-10-07',
 headline:'Qualified. Appropriately certified. Full-time. Permanent.',
 text:'Pinnacle’s network staffing commitment is qualified, appropriately certified, full-time and permanent therapy staff, with no freelance or part-time therapy staffing.',
 reasons:['Continuity of care','Clear accountability','Child safety','Growing independence'],
 sourceUrl:'/staff-declaration'
};

export const centreHoursPolicy={
 opens:'09:00',closes:'19:00',display:'9:00 am–7:00 pm',confirmedOn:'2026-10-07',
 exclusions:'Closed Sundays, the second Saturday of each month, national holidays and dates in the published holiday calendar.',
 calendarYear:2026,calendarUrl:'https://www.pinnacleblooms.org/assets/Pinnacle-Holiday-Calendar-2026.pdf',
 note:'Confirm your appointment and any branch-specific change before travelling.'
};

export const centreTrustSources=[
 {label:'PopulationScale',icon:'people',text:'Inspect the dated network service and beneficiary figures, their definitions and original reports.',url:'/verify/evidence/operating-metrics.html'},
 {label:'SovereignGrade',icon:'shield',text:'Inspect original software licences and quality and security records with their named scopes.',url:'/verify/'},
 {label:'Network recognition',icon:'award',text:'Read the recognition register and original government appreciation letters in their specific contexts.',url:'/verify/evidence/recognition-register.html'}
];

export const centreTrustImages={
 staff:{file:'centre-trust-people-20261007.png',alt:'Illustrative Pinnacle professionals supporting a child and family with continuity and care.'},
 families:{file:'centre-trust-families-20261007.png',alt:'Illustrative Pinnacle parents and children sharing hopeful everyday moments.'},
 visit:{file:'centre-trust-first-visit-20261007.png',alt:'Illustrative first conversation: a Pinnacle professional listens to a parent and child and explains the next step.'},
 life:{file:'centre-trust-life-20261007.png',alt:'Illustrative child participating in school, family and everyday life with growing independence.'}
};

// These are actual seed videos already retained in the approved playlist data.
// No playlist total or number of unique people is inferred from the previews.
export const centreTrustVideos={
 staff:[centreStoryPlaylists[0],centreStoryPlaylists[2]],
 families:[centreStoryPlaylists[1],centreStoryPlaylists[3]]
};
export const centreTrustCollections={
 staff:[
  {label:'AbilityScore explanations',icon:'measure',list:centreStoryPlaylists[0].list},
  {label:'Our professionals’ Soul Promise',icon:'heart',list:centreStoryPlaylists[2].list},
  {label:'Staff voices',icon:'people',list:'PL0lwT9W0zVpjQqvH9N7SRnoU-7Bf-Eg9J'}
 ],
 families:[
  {label:'Parents on AbilityScore',icon:'measure',list:centreStoryPlaylists[1].list},
  {label:'Everyday family experiences',icon:'home',list:centreStoryPlaylists[3].list},
  {label:'Telugu parent stories',icon:'voice',list:'PL0lwT9W0zVpiLzk_r8kAcZyj7GP3VKeBx'},
  {label:'Hindi parent stories',icon:'voice',list:'PL0lwT9W0zVpg2CkzXyMhuAoRStYgnD7eM'},
  {label:'English parent stories',icon:'voice',list:'PL0lwT9W0zVpi9IP0yiRylaeLsB922vyjY'}
 ]
};

export type CentreCertificateDocument={centreId:string;driveUrl:string;hfrId:string;title:string;date:string;kind:'issued'|'application'};
export function matchedIssuedCertificates(branch:{id:string;facilityEvidence?:{id?:string}|null},documents:CentreCertificateDocument[]){
 const hfr=branch.facilityEvidence?.id;
 if(!hfr)return [];
 return documents.filter(document=>document.kind==='issued'&&document.centreId===branch.id&&document.hfrId===hfr&&/^https:\/\/drive\.google\.com\//.test(document.driveUrl));
}
