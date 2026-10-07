import fs from 'node:fs/promises';import path from 'node:path';
import {centreRegister,centreWalkthrough} from '../src/data/centre-network-content.ts';
import {centreEcosystem,centreStoryPlaylists,centreNarrativeChapters,centreHomeParticipation} from '../src/data/centre-story.ts';
import {centreHoursPolicy,centreStaffCommitment,matchedIssuedCertificates} from '../src/data/centre-trust.ts';
const root=path.resolve(import.meta.dirname,'..'),dir=path.join(root,'public/pinnacle-pages-data');
const certificateDocuments=JSON.parse(await fs.readFile(path.join(root,'src/data/centre-certificates-20261007.json'),'utf8'));
const googleLocations=JSON.parse(await fs.readFile(path.join(root,'src/data/centre-google-locations.json'),'utf8'));
const rows=[];
for(const c of centreRegister){
 const file=path.join(dir,c.id+'-evidence.json'),record=JSON.parse(await fs.readFile(file,'utf8'));
 Object.assign(record,{updated:'2026-10-07',localTelephone:c.directTelephone,coordinates:c.coordinates,nearbyCentres:c.nearbyCentres,catchmentLocalities:c.catchmentLocalities,catchmentPostcodes:c.catchmentPostcodes,walkthrough:centreWalkthrough(c.id),googleBusinessUrl:c.googleBusinessUrl,reviewSnapshot:c.reviewSnapshot,resources:['https://pinnacleblooms.org/ask','https://www.pinnacleblooms.org/faq','https://www.pinnacleblooms.org/sunshine','https://materials.pinnacleblooms.org/','https://www.pinnacleblooms.org/books','https://www.pinnacleblooms.org/shop']});
 if(c.pageStatus==='centre-enquiry'){
  record.openingHours=centreHoursPolicy;record.staffingCommitment=centreStaffCommitment;
  record.issuedFacilityDocuments=matchedIssuedCertificates(c,certificateDocuments);
  const google=googleLocations.centres.find(row=>row.centreId===c.id&&row.status==='matched');
  if(google)record.googleContent={endpoint:'/centers/_google/'+c.id,source:'Google Business Profile via authenticated Windsor connection',refresh:'On-demand after a 24-hour cache; dated provider content is attributed in the visible section. The featured five-star selection is separate from the overall Google rating.'};
  record.pinnacleEcosystem=centreEcosystem;record.networkStoryPlaylists=centreStoryPlaylists;
  record.pinnacleJourney={chapters:centreNarrativeChapters,homeParticipation:centreHomeParticipation,individualProgress:true,source:'https://www.pinnacleblooms.org/pinnacleai'};
  const extra=['Centre network narrative', 'Primary contact: 9100 181 181. The local centre telephone is an alternative.',...(c.directTelephone?['Local alternative: '+c.directTelephone]:[]),'Nearby centres: '+c.nearbyCentres.map(p=>p.name+' '+p.url).join('; '),'Nearby localities: '+c.catchmentLocalities.join(', '),'Nearby postcodes: '+c.catchmentPostcodes.join(', '),'Google listing: '+c.googleBusinessUrl,...(centreWalkthrough(c.id)?['Centre walkthrough: '+centreWalkthrough(c.id).url]:[]),...centreEcosystem.map(p=>p.title+' — '+p.role+'\n'+p.text+'\nhttps://www.pinnacleblooms.org'+p.path),...centreStoryPlaylists.map(p=>p.title+'\n'+p.text+'\n'+p.url),'Network stories are not a roster of this branch’s current staff. Individual experiences do not guarantee every child’s outcome.','Resources:',...record.resources];
  const journey=centreNarrativeChapters.map(chapter=>`Chapter ${chapter.letter}: ${chapter.title}\n${chapter.purpose}\nFamily participation: ${chapter.family}\n${c.profileUrl}#centre-chapter-${chapter.id}`);
  journey.push(...centreHomeParticipation.map(scene=>scene.title+'\n'+scene.text));
  for(const ext of ['txt','md']){const p=path.join(dir,c.id+(ext==='md'?'-machine.md':'-evidence.txt')),text=(await fs.readFile(p,'utf8')).split('\n<!-- centre-network-story -->')[0];await fs.writeFile(p,text+'\n<!-- centre-network-story -->\n'+extra.concat(journey).join('\n\n')+'\n');}
 }
 if(c.id==='usa'){record.locationStatus={currentUSClinicVerified:false};record.address=null;record.operationalBoundary='Historical location guidance. No current US clinic, address, local service or appointment is asserted.';record.directAnswer='Contact Pinnacle for location guidance and explore the network’s evidence and family resources.';record.questions=[];record.example=null;}
 await fs.writeFile(file,JSON.stringify(record,null,2)+'\n');
 if(c.id==='usa')for(const ext of ['txt','md'])await fs.writeFile(path.join(dir,c.id+(ext==='md'?'-machine.md':'-evidence.txt')),`${ext==='md'?'# ':''}Pinnacle — United States guidance\nCanonical: ${c.profileUrl}\n${record.directAnswer}\n${record.operationalBoundary}\nPrimary contact: +919100181181\nhttps://www.pinnacleblooms.org/centers\nhttps://www.pinnacleblooms.org/verify/\n`);
 rows.push({id:c.id,name:c.name,canonical:c.profileUrl,status:c.pageStatus,address:c.address,localTelephone:c.directTelephone,photos:c.images,emblem:c.emblem,walkthrough:centreWalkthrough(c.id),nearby:c.nearbyCentres,catchmentLocalities:c.catchmentLocalities,catchmentPostcodes:c.catchmentPostcodes,googleBusinessUrl:c.googleBusinessUrl,reviewSnapshot:c.reviewSnapshot});
}
await fs.writeFile(path.join(dir,'centre-network.json'),JSON.stringify({updatedOn:'2026-10-07',primaryTelephone:'+919100181181',distanceBasis:'Approximate straight-line distance from supplied coordinates; not road distance or travel time',centres:rows},null,2)+'\n');
const sitemapFile=path.join(dir,'speech-sitemap.xml');let sitemap=await fs.readFile(sitemapFile,'utf8');sitemap=sitemap.replace(/<url>\s*<loc>https:\/\/www\.pinnacleblooms\.org\/centers\/[^<]+<\/loc>[\s\S]*?<\/url>\s*/g,'');
sitemap=sitemap.replace('</urlset>',rows.map(c=>`<url><loc>${c.canonical}</loc><lastmod>2026-10-07</lastmod></url>`).join('\n')+'\n</urlset>');await fs.writeFile(sitemapFile,sitemap);
await fs.writeFile(path.join(root,'src/data/centre-page-releases.json'),JSON.stringify(rows.map(c=>({id:c.id,path:new URL(c.canonical).pathname,status:c.status,updatedOn:'2026-10-07'})),null,2)+'\n');
for(const c of centreRegister)for(const suffix of ['evidence.txt','machine.md']){const file=path.join(dir,c.id+'-'+suffix);await fs.writeFile(file,(await fs.readFile(file,'utf8')).replace(/[ \t]+$/gm,''));}
console.log(`Centre network: ${rows.length} registered public routes, reading packages and sitemap entries.`);
