import fs from 'node:fs/promises';
import path from 'node:path';
const site=path.resolve(import.meta.dirname,'..');
const identities=JSON.parse(await fs.readFile(path.join(site,'ask-private/centre-google-20261007/identities.json'),'utf8'));
const register=JSON.parse(await fs.readFile(path.join(site,'src/data/centre-register.json'),'utf8'));
export function googleCid(value){
 try{
  const url=new URL(value);
  if((url.hostname==='google.com'||url.hostname.endsWith('.google.com'))&&/^\d+$/.test(url.searchParams.get('cid')||''))return url.searchParams.get('cid');
  const code=url.hostname==='g.page'?url.pathname.match(/^\/r\/([^/]+)/)?.[1]:null;
  if(code){const bytes=Buffer.from(code,'base64url');if(bytes.length===11&&(bytes[0]===9||bytes[0]===13))return bytes.readBigUInt64LE(1).toString();}
 }catch{}
 return null;
}
function compact(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function distance(c,r){
 if(!c.coordinates||!r.location_latitude||!r.location_longitude)return Infinity;
 const rad=Math.PI/180,a=c.coordinates.latitude*rad,b=Number(r.location_latitude)*rad;
 const s=Math.sin((b-a)/2)**2+Math.cos(a)*Math.cos(b)*Math.sin((Number(r.location_longitude)-c.coordinates.longitude)*rad/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));
}
const centres=register.centres.map(c=>{
 const base={centreId:c.id,name:c.name,googleUrl:c.googleBusinessUrl||c.mapsUrl,reviewUrl:c.reviewUrl||null};
 if(c.pageStatus!=='centre-enquiry')return {...base,status:'held',reason:'Existing location-status page; no automatic content retrieval.'};
 const cid=[c.reviewUrl,c.mapsUrl,c.googleBusinessUrl].map(googleCid).find(Boolean);
 let matches=cid?identities.filter(r=>googleCid(r.location_metadata_maps_uri)===cid):[];
 let method='Source Google review-link CID matches returned Google maps CID';
 if(!cid){
  const label=compact(c.name.split(',')[0]);
  matches=identities.filter(r=>compact(r.location_title.split('|')[0]).includes(label)&&r.location_address_postal_code===c.postalCode&&distance(c,r)<=250);
  method='Unique centre name, exact postcode and coordinates within 250 metres';
 }
 if(matches.length!==1)return {...base,status:matches.length>1?'ambiguous':'unmatched',reason:matches.length>1?'More than one Google location resource has the source identity.':'No unambiguous source identity match.',candidateCount:matches.length};
 const row=matches[0];
 return {...base,status:'matched',locationResource:row.location_id,googleUrl:row.location_metadata_maps_uri,googleCid:googleCid(row.location_metadata_maps_uri),googleTitle:row.location_title,method,identityFetchedAt:row.data_fetched_at};
});
for(const [id,expected] of Object.entries({suchitra:'locations/17679311780277453396',guntur:'locations/7063963914382159795',gurunanak:'locations/14722062917356395844'})){
 if(centres.find(c=>c.centreId===id)?.locationResource!==expected)throw new Error('Known Google identity does not match: '+id);
}
const result={updatedOn:'2026-10-07',source:'Authenticated Windsor Google Business location identity export',identityRows:identities.length,notes:['CID values retain exact integer precision. No numeric Google ID is converted to a JavaScript Number.','Duplicate location resources and missing identities are held for explicit reconciliation.','Source listing identity is distinct from current branch operation, staff assignment or service availability.'],centres};
await fs.writeFile(path.join(site,'src/data/centre-google-locations.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({records:centres.length,matched:centres.filter(c=>c.status==='matched').length,remaining:centres.filter(c=>c.status!=='matched').map(c=>({centreId:c.centreId,status:c.status,reason:c.reason}))}));
