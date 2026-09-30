import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Reconcile a release against the saved population. No network crawl or submission.
const base='https://www.pinnacleblooms.org',stamp='20260930';
const receiptPath=process.argv[2]||'deployment/shared-shell-live-v133-20261001.json';
const receipt=JSON.parse(await fs.readFile(receiptPath,'utf8'));
assert(receipt.shells?.length===25,'Expected the current bounded 25-page release');
const managed=new Set(receipt.shells.map(row=>row.path));
const privateDir=path.resolve('audits/whole-portal-register-'+stamp);
const inventory=JSON.parse(await fs.readFile(path.join(privateDir,'whole-route-register.json'),'utf8'));
const summaryPath='reviews/WHOLE-PORTAL-SITEMAP-SUMMARY-'+stamp+'.json';
const summary=JSON.parse(await fs.readFile(summaryPath,'utf8'));
assert.equal(inventory.rows.length,summary.uniqueExactSitemapUrls);
assert.equal(inventory.checkedAt,summary.checkedAt,'Keep the dated population observation');
const updatedAt=new Date().toISOString();
for(const row of inventory.rows){const parsed=new URL(row.url);if(parsed.origin===base&&!parsed.search&&!parsed.hash&&managed.has(parsed.pathname)){
 row.state='released_managed_v133_portfolio';row.releaseEvidence=receiptPath;row.canonicalVerified=true;
 row.nextCondition='Preserve accepted body and common v133 shell; observe actual discovery, citation and calls. Reopen only for a concrete defect, evidence change or explicit useful example package.';
}}
inventory.releaseStateUpdatedAt=updatedAt;inventory.releaseEvidence=receiptPath;
const csv=rows=>{const keys=[...new Set(rows.flatMap(row=>Object.keys(row)))];const quote=value=>'"'+String(Array.isArray(value)?value.join(' | '):value??'').replaceAll('"','""')+'"';return[keys.map(quote).join(','),...rows.map(row=>keys.map(key=>quote(row[key])).join(','))].join('\n')+'\n';};
const navigation=JSON.parse(await fs.readFile('src/data/portal-navigation.json','utf8'));
const cards=JSON.parse(await fs.readFile('src/data/verify-cards.json','utf8'));
const occurrences=[];
function collect(value,section){if(Array.isArray(value))return value.forEach(child=>collect(child,section));if(!value||typeof value!=='object')return;if(typeof value.url==='string')occurrences.push({url:value.url,label:value.label||value.title||value.id||'',section});for(const[key,child]of Object.entries(value))if(key!=='url')collect(child,section);}
for(const[section,value]of Object.entries(navigation))if(Array.isArray(value))collect(value,section);
for(const card of cards)occurrences.push({url:'/verify/evidence/records/'+card.id+'.html',label:card.title,section:'verifyFooterCards'});
for(const[url,label]of [['/','Home'],['/verify/','Verify evidence hub'],['/verify/#organization','Organisation source identity'],['/verify/evidence/cite.html','Citations and downloads'],['/verify/evidence/pinnacleai-regulatory-journey.html','PinnacleAI regulatory journey'],['/national-autism-helpline','National Autism Helpline'],['/centers','Find a centre'],['/sitemap','Human sitemap'],['tel:+919100181181','National phone'],['https://wa.me/919100181181','WhatsApp'],['mailto:care@pinnacleblooms.org','Care email'],['https://www.bhclpl.org','Legal operator website'],['https://www.trustpilot.com/review/pinnacleblooms.org','Trustpilot review destination']])occurrences.push({url,label,section:'sharedShellDirectLinks'});
for(const[url,label,section]of [['/research-studies','Explore Research Studies','footerHeadingOverview'],['https://www.youtube.com/channel/UCAAuGmvPSBRiCnDlEcXYwEQ','Explore Pinnacle TV','footerHeadingOverview'],['/franchises','Explore Franchise Opportunity','footerHeadingOverview'],['/search','GET search form','headerFormAction'],['/verify/evidence/scale-and-mission.html','Figures, sources and mission','headerAuthorityContext'],['/verify/evidence/scale-and-mission.html','Counting definitions and dated findings','headerMoreContext'],['/verify/evidence/pinnacle-paradigm-shift.html#the-historical-challenge','Pinnacle historical case','headerMoreContext']])occurrences.push({url,label,section});
const listed=new Set(inventory.rows.map(row=>row.url));
const navRows=occurrences.map(row=>{const absolute=new URL(row.url,base),lookup=new URL(absolute);lookup.hash='';const internal=['www.pinnacleblooms.org','pinnacleblooms.org'].includes(absolute.hostname);const isManaged=internal&&managed.has(absolute.pathname);return{...row,absoluteUrl:absolute.href,internal,pagePath:internal?absolute.pathname:'',hasFragment:!!absolute.hash,sitemapListedExactUrl:listed.has(lookup.href),state:row.section==='headerFormAction'?'retained_get_search_utility':isManaged?'released_managed_page; fragment_not_rechecked_here':['tel:','mailto:'].includes(absolute.protocol)?'retained_contact_utility':internal&&absolute.pathname.startsWith('/verify/')?'retained_evidence_link':internal?'retained_legacy_destination; role_and_fragment_review_pending':'retained_external_destination; identity_review_as_needed',nextCondition:row.section==='headerFormAction'?'Preserve existing GET search function; search-result parameters are not new page canonicals.':isManaged?'Preserve approved page; validate anchor only when affected by edits.':internal?'Verify exact destination role/content/anchor in its source before edits; absence from sitemap alone is not a defect.':'Preserve useful official/contact/platform role; do not imply platform endorsement.'};});
for(const family of summary.families){const rows=inventory.rows.filter(row=>row.family===family.family);family.states=Object.fromEntries([...new Set(rows.map(row=>row.state))].map(state=>[state,rows.filter(row=>row.state===state).length]));}
summary.releaseStateUpdatedAt=updatedAt;summary.releaseEvidence=receiptPath;
summary.releaseStateMethod='Release and navigation states reconciled from v133 public readback. Dated sitemap population retained; no estate recrawl.';
summary.navigationOccurrences=navRows.length;summary.navigationUniqueAbsoluteHrefs=new Set(navRows.map(row=>row.absoluteUrl)).size;summary.navigationInternalPagePaths=new Set(navRows.filter(row=>row.internal).map(row=>row.pagePath)).size;
summary.navigationRegisterMethod='Source metadata, 36 cards, shared direct links, footer overview links and header source-context/form-action origins; not every repeated rendered DOM href.';
await fs.writeFile(path.join(privateDir,'whole-route-register.json'),JSON.stringify(inventory,null,2)+'\n');await fs.writeFile(path.join(privateDir,'whole-route-register.csv'),csv(inventory.rows));
await fs.writeFile(summaryPath,JSON.stringify(summary,null,2)+'\n');await fs.writeFile('reviews/PORTAL-NAVIGATION-REGISTER-'+stamp+'.csv',csv(navRows));
// The public delivery queue contains only established public pages/locations.
// The larger child-associated sitemap population stays in the private register.
function parseCSV(text){const records=[],cells=[];let cell='',quoted=false;for(let i=0;i<text.length;i++){const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(char===','&&!quoted){cells.push(cell);cell='';}else if(char==='\n'&&!quoted){cells.push(cell.replace(/\r$/,''));records.push(cells.splice(0));cell='';}else cell+=char;}if(cell||cells.length){cells.push(cell);records.push(cells);}const keys=records.shift();return records.filter(row=>row.length===keys.length).map(row=>Object.fromEntries(keys.map((key,i)=>[key,row[i]])));}
const centresPath='reviews/CENTRE-PAGE-CONTINUATION-QUEUE-'+stamp+'.csv';
const centres=parseCSV(await fs.readFile(centresPath,'utf8'));
assert.equal(centres.length,62);
for(const centre of centres){const url=new URL(centre.existing_profile_url);centre.shared_shell_release=!url.hash&&managed.has(url.pathname)?'v133; public common-shell readback passed':'retained origin; migrate on individual page release';}
await fs.writeFile(centresPath,csv(centres));
const ledger=await fs.readFile('PORTAL-PAGE-LEDGER-AND-SITEMAP-'+stamp+'.md','utf8');
const queue=[];
for(const line of ledger.split(/\r?\n/)){if(!/^\| (REF-|A-\d|B-\d|CENTRE-|GUIDE-)/.test(line))continue;const[id,canonical,audienceJob,contentState,nextCondition]=line.split('|').slice(1,-1).map(value=>value.trim());const pathname=canonical.replaceAll('`','');assert(managed.has(pathname),'Published ledger route absent from live release: '+pathname);queue.push({id,url:base+pathname,family:id.startsWith('CENTRE-')?'centres':id.startsWith('GUIDE-')?'guides':id.startsWith('B-')?'pinnacleai':'services',state:'PUBLISHED; PUBLIC_READBACK_PASSED',content_state:contentState,shell_state:'COMMON_V133',priority:0,audience_job:audienceJob,next_condition:nextCondition,release_evidence:receiptPath});}
assert.equal(queue.length,25,'Exact managed page ledger completeness');
for(const centre of centres){const url=new URL(centre.existing_profile_url);if(!url.hash&&managed.has(url.pathname))continue;const prepared=['nandyala','ongole','tirupati','srikakulam'].includes(centre.id);queue.push({id:'CENTRE-'+centre.id,url:centre.existing_profile_url,family:'centres',state:url.hash?'SECTION_ONLY_DESTINATION_DECISION':prepared?'SOURCE_PREPARED; NOT_BUILT':'QUEUED_FOR_BRANCH_REVIEW',content_state:centre.state,shell_state:centre.shared_shell_release,priority:prepared?1:url.hash?2:3,audience_job:'Find '+centre.name+'; confirm the current branch and useful first conversation',next_condition:centre.next_condition,release_evidence:prepared?'reviews/NEXT-CENTRE-BATCH-SOURCES-20261001.md':''});}
assert.equal(queue.length,82);assert.equal(new Set(queue.map(row=>row.url)).size,82);
await fs.writeFile('reviews/PORTAL-DELIVERY-QUEUE-20261001.csv',csv(queue));
console.log(JSON.stringify({datedPopulationAt:summary.checkedAt,distinctUrls:inventory.rows.length,releaseManaged:managed.size,navigationOccurrences:navRows.length,uniqueNavigationHrefs:summary.navigationUniqueAbsoluteHrefs,internalPaths:summary.navigationInternalPagePaths,noNetworkCrawl:true}));
