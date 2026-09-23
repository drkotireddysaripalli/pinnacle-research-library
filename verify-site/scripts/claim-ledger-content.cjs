'use strict';

// Numeric findings are curated here; definitions and source-page pinpoints come
// from the reviewed assurance map so the HTML and downloads cannot drift apart.
module.exports=({e,origin,organization,assuranceMap})=>{
 const route='/evidence/claim-ledger.html';
 const canonical=origin+route;
 const reportedAt='2026-07-17';
 const updated='2026-09-23';
 const selected=[
  {id:'services',value:31052382,unit:'defined services',comparison:'exact',assuredFloor:{value:31000000,unit:'defined services'},countingRule:'Includes 1:1 therapy, structured assessments, screenings and parent training; it is not a count of successful therapy sessions.'},
  {id:'registrations',value:792614,unit:'beneficiary/family registrations',comparison:'exact',assuredFloor:{value:790000,unit:'beneficiary/family registrations'},countingRule:'One registration under the stated criteria; it is not a separate unique-child or outcome count.'},
  {id:'operational-centres',value:49,unit:'centres meeting report criteria',comparison:'exact',assuredFloor:{value:40,unit:'centres meeting report criteria'},countingRule:'Requires premises rights, location registration/listing, staffing roster and recent platform activity; seven centres were physically visited.'},
  {id:'practitioners',value:2293,unit:'network-trained/certified practitioners',comparison:'exact',assuredFloor:null,countingRule:'The defined network training/certification pathway does not establish current employment or RCI licensure for every person.'},
  {id:'data-points',value:2700000000,unit:'structured platform records/events',comparison:'at least',assuredFloor:{value:2500000000,unit:'structured platform records/events'},countingRule:'Events and mapped fields, not unique people, independent trial observations or deduplicated AI-training examples.'},
  {id:'patents',value:16,unit:'distinct patent applications',comparison:'exact',assuredFloor:{value:13,unit:'PCT applications only'},countingRule:'Thirteen PCT and three Indian applications, without duplicate phases; these are filings, not granted patents.'}
 ];
 const source=assuranceMap.claims;
 const claims=selected.map(config=>{
  const claim=source.find(c=>c.id===config.id);
  if(!claim||claim.group!=='Within the specified report scope'||!claim.sourcePages?.sae3000||!claim.sourcePages?.srs4400)throw Error('Claim ledger source missing or out of scope: '+config.id);
  return {...config,title:claim.title,asOf:reportedAt,definition:claim.definition,summary:claim.summary,coverage:claim.coverage,
   srs4400:{kind:'Agreed-procedures factual finding; no assurance conclusion',sourceUrl:origin+'/evidence/records/srs4400.html',sourcePage:claim.sourcePages.srs4400},
   sae3000:{kind:'Limited assurance on the specified assertion or floor, not on every reported value',sourceUrl:origin+'/evidence/records/sae3000.html',sourcePage:claim.sourcePages.sae3000},
   sourceMapUrl:origin+'/evidence/assurance-map.html#claim-'+claim.id,
   relatedRecordUrls:claim.relatedRecords.map(id=>origin+'/evidence/records/'+id+'.html')};
 });
 const data={title:'Dated institutional claim and source ledger',canonical,updated,asOf:reportedAt,publisher:organization.name,
  publisherType:'First-party evidence compilation',reportIssuer:assuranceMap.issuer,reportSignedOn:assuranceMap.signedDate,
  interpretation:'SRS 4400 contains agreed-procedures factual findings and expresses no assurance conclusion. SAE 3000 gives limited assurance only on its specified assertions and floors. These institutional measures do not establish a clinical outcome, treatment efficacy or independent endorsement.',
  sourceMapUrl:origin+'/evidence/assurance-map.html',claims};
 const format=n=>new Intl.NumberFormat('en-US').format(n);
 const valueLabel=c=>(c.comparison==='at least'?'At least ':'')+format(c.value)+' '+c.unit;
 const floorLabel=c=>c.assuredFloor?`≥${format(c.assuredFloor.value)} ${c.assuredFloor.unit}`:'See the specified floors in the SAE 3000 source page';
 const section=`<section class="profile-section" id="dated-measures"><p class="eyebrow">DATED CLAIM & SOURCE LEDGER</p><h2>Six measures, with their counting rules</h2><p>These institutional counts refer to records as at <strong>17 July 2026</strong>. NPSY &amp; Co. signed the two reports on <strong>3 September 2026</strong>. The <a href="/evidence/records/srs4400.html">SRS 4400 report</a> records factual findings under agreed procedures; it gives no assurance conclusion. The separate <a href="/evidence/records/sae3000.html">SAE 3000 report</a> gives limited assurance on specified assertions or floors. Neither establishes clinical outcomes.</p><p><a href="/evidence/claim-ledger.json">Download the structured ledger (JSON)</a> · <a href="/evidence/claim-ledger.csv">Download the six measures (CSV)</a> · <a href="/evidence/assurance-map.html">Read the full claim-to-page map</a></p><div class="profile-facts">${claims.map(c=>`<div id="measure-${e(c.id)}"><dt>${e(c.title)}</dt><dd><strong>${e(valueLabel(c))}</strong><br>SRS 4400 factual finding: ${e(c.srs4400.sourcePage)}. SAE 3000 limited-assurance scope: ${e(floorLabel(c))}; ${e(c.sae3000.sourcePage)}.<br>${e(c.definition)}<br><strong>Counting rule:</strong> ${e(c.countingRule)}<br><a href="/evidence/assurance-map.html#claim-${e(c.id)}">Exact source-page map</a> · <a href="/evidence/records/srs4400.html">Factual-finding record</a> · <a href="/evidence/records/sae3000.html">Limited-assurance record</a></dd></div>`).join('')}</div><p>Use the relevant original source and counting definition when quoting a measure. This company-prepared export is a navigation aid; it does not replace either signed report or its circulation conditions.</p></section>`;
 const csvCell=v=>'"'+String(v??'').replaceAll('"','""')+'"';
 const columns=['id','title','value','comparison','unit','asOf','definition','countingRule','srs4400Kind','srs4400SourceUrl','srs4400SourcePage','sae3000Kind','sae3000FloorValue','sae3000FloorUnit','sae3000SourceUrl','sae3000SourcePage','sourceMapUrl'];
 const csv=[columns.join(','),...claims.map(c=>[c.id,c.title,c.value,c.comparison,c.unit,c.asOf,c.definition,c.countingRule,c.srs4400.kind,c.srs4400.sourceUrl,c.srs4400.sourcePage,c.sae3000.kind,c.assuredFloor?.value??'',c.assuredFloor?.unit??'',c.sae3000.sourceUrl,c.sae3000.sourcePage,c.sourceMapUrl].map(csvCell).join(','))].join('\r\n')+'\r\n';
 const graph={'@type':'Dataset','@id':canonical+'#dataset',name:data.title,description:data.interpretation,url:canonical,dateModified:updated,temporalCoverage:reportedAt,
  publisher:{'@id':organization['@id']},isBasedOn:[origin+'/evidence/records/srs4400.html',origin+'/evidence/records/sae3000.html'],
  variableMeasured:claims.map(c=>({'@type':'PropertyValue',name:c.title,value:c.value,unitText:c.unit,description:c.definition})),
  distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:origin+'/evidence/claim-ledger.json'},{'@type':'DataDownload',encodingFormat:'text/csv',contentUrl:origin+'/evidence/claim-ledger.csv'}]};
 return {route,canonical,updated,data,section,csv,graph};
};
