'use strict';
// One source of truth produces HTML, JSON-LD, record pages and text exports.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const content = path.join(root, 'content');
fs.mkdirSync(content, {recursive:true});
const read = p => fs.readFileSync(path.join(dist,p),'utf8');
const write = (p,s) => { fs.mkdirSync(path.dirname(path.join(dist,p)),{recursive:true}); fs.writeFileSync(path.join(dist,p),s); };
const context = {window:{}};
vm.runInNewContext(read('evidence-data.js'), context);
const data = context.window.PINNACLE_EVIDENCE;
const records = data.records;
const origin = 'https://pinnacle-verify.saripalli.chatgpt.site';
// Access policy is intentionally preserved. Public discovery needs a separate audience change.
const robots = 'noindex,nofollow';
const date = '2026-09-15';
const title = 'Verify Pinnacle Blooms | Licences, Registrations & Research';
const description = 'Explore 33 Pinnacle evidence records: MD-5, BIS, ISO, legal and centre registrations, research and source publications, with scope and review status.';
const e = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const absolute = p => new URL(p, origin+'/').href;
const recordPath = r => `/evidence/records/${r.id}.html`;
const safeUrl = value => { if (!/^(https:\/\/|evidence\/|\/evidence\/)/.test(value)) throw new Error('Unexpected evidence URL'); return value.startsWith('evidence/')?'/'+value:value; };
const categories = ['All evidence','Legal identity','Medical device regulation','Quality & security','Research & outcomes','Centre registrations','Government recognition','Source publications'];
const labels = {original:'Original reviewed',published:'Company-published',reconcile:'Needs follow-up',missing:'Source needed',matched:'Registry record matched'};
const categoryIcons = {'All evidence':'files','Legal identity':'building-2','Medical device regulation':'file-cog','Quality & security':'shield','Research & outcomes':'flask-conical','Centre registrations':'map-pin','Government recognition':'landmark','Source publications':'book-open'};
const statusIcons = {original:'file-search',matched:'badge-check',published:'file-text',reconcile:'file-clock',missing:'circle-help'};
const icon = (name,extra='') => {
  const source = fs.readFileSync(path.join(root,'assets','lucide',name+'.svg'),'utf8');
  const inner = source.slice(source.indexOf('>',source.indexOf('<svg'))+1,source.lastIndexOf('</svg>')).trim();
  return `<svg class="truth-icon ${extra}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
};
const badge = r => `<span class="badge ${e(r.status)}">${icon(statusIcons[r.status])}${e(labels[r.status])}</span>`;
const statusText = r => r.verificationNote || (r.issuerMatched?'Exact official registry record checked.':r.category==='Source publications'?'Company-authored source; underlying claims need their own evidence.':['methodology','external-validation'].includes(r.id)?'Repository metadata checked; journal peer review not established.':['sae3000','srs4400'].includes(r.id)?'Report inspected; UDIN not independently matched in this review.':'Current issuer or registry status: not independently confirmed.');
const recordBody = (r,linkToPage=true) => `<div class="record-body"><dl class="record-fields">${Object.entries(r.fields||{}).map(([k,v])=>`<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl><div class="scope-columns"><div><h4>${icon('file-text')}What this supports</h4><p>${e(r.supports)}</p></div><div><h4>${icon('scan-eye')}Scope & limits</h4><p>${e(r.limits)}</p></div></div>${r.note?`<p class="evidence-note">${e(r.note)}</p>`:''}<div class="record-actions">${linkToPage?`<a href="${recordPath(r)}">${icon('link')}Permanent record</a>`:''}${(r.links||[]).map(l=>`<a href="${e(safeUrl(l.url))}"${l.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${icon(/\.pdf$/.test(l.url)?'download':'external-link')}${e(l.label)}</a>`).join('')}<a href="mailto:care@pinnacleblooms.org?subject=Pinnacle%20verification%20question%3A%20${encodeURIComponent(r.title)}">${icon('mail')}Ask about this record</a></div><p class="record-citation"><strong>Source:</strong> ${e(r.citation)}<br>Reviewed: <time datetime="${date}">${e(data.reviewed)}</time> · ${e(statusText(r))}</p></div>`;
const renderRecord = r => `<details class="evidence-record" id="${e(r.id)}"><summary><div><div class="record-topline"><span class="record-category">${icon(categoryIcons[r.category])}${e(r.category)}</span>${badge(r)}</div><h3 class="record-title">${e(r.title)}</h3><p class="record-subtitle">${e(r.subtitle)}</p></div><span class="expand-sign" aria-hidden="true">${icon('plus')}</span></summary>${recordBody(r)}</details>`;
const organization = {'@type':'Organization','@id':origin+'/#organization',name:'Pinnacle Blooms Network',legalName:'Bharath Healthcare Laboratories Private Limited',url:'https://www.pinnacleblooms.org/',identifier:[{'@type':'PropertyValue',propertyID:'CIN',value:'U74999TG2016PTC113063'},{'@type':'PropertyValue',propertyID:'LEI',value:'894500OJYBVC18BUDN89'}],contactPoint:{'@type':'ContactPoint',contactType:'verification enquiries',email:'care@pinnacleblooms.org',telephone:'+919100181181'}};
const website = {'@type':'WebSite','@id':origin+'/#website',name:'Pinnacle Verification Centre',url:origin+'/',inLanguage:'en-IN',publisher:{'@id':organization['@id']}};
const breadcrumb = (items,url) => ({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item[0],item:absolute(item[1])}))});
const listSchema = {'@type':'ItemList','@id':origin+'/#evidence-list',name:'Pinnacle evidence records',numberOfItems:records.length,itemListElement:records.map((r,i)=>({'@type':'ListItem',position:i+1,name:r.title,url:absolute(recordPath(r))}))};
const head = (pageTitle,desc,url,graph,scripts=false) => `<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(pageTitle)}</title><meta name="description" content="${e(desc)}">
<meta name="robots" content="${robots}"><meta name="theme-color" content="#101b48">
<link rel="canonical" href="${e(url)}"><meta property="og:type" content="website"><meta property="og:locale" content="en_IN"><meta property="og:site_name" content="Pinnacle Verification Centre"><meta property="og:title" content="${e(pageTitle)}"><meta property="og:description" content="${e(desc)}"><meta property="og:url" content="${e(url)}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${e(pageTitle)}"><meta name="twitter:description" content="${e(desc)}">
<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/upgrade.css"><link rel="stylesheet" href="/evidence-design.css">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23007f86'/%3E%3Cpath d='M10 7h8l5 5v13H10zM18 7v6h5M14 17h5M14 21h5' fill='none' stroke='white' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E">
<link rel="alternate" type="application/json" href="/evidence/evidence.json" title="Pinnacle evidence register"><link rel="alternate" type="text/plain" href="/llms-full.txt" title="Pinnacle evidence in plain text">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>
${scripts?'<script defer src="/evidence-data.js"></script><script defer src="/centre-data.js"></script><script defer src="/app.js"></script>':''}
</head>`;
const pageHeader = `<div class="review-strip"><span>REVIEW EDITION</span> Source review: 15 September 2026</div><header class="wrap site-header"><a href="/" aria-label="Pinnacle verification home" class="brand"><span class="logo-crop"><img src="/brand-header.jpg" alt="Pinnacle Blooms Network" width="1727" height="242"></span></a><a class="outline-link" href="/#records">${icon('arrow-left')}Evidence library</a></header>`;
const footer = `<footer class="wrap"><div><strong>Pinnacle Blooms Network</strong><p>Verification contact: Gokul Rao · <a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a> · <a href="tel:+919100181181">9100 181 181</a></p></div><a href="/#method">How we review evidence</a></footer>`;
const crumbsHTML = items => `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((x,i)=>i===items.length-1?`<span aria-current="page">${e(x[0])}</span>`:`<a href="${e(x[1])}">${e(x[0])}</a>${icon('chevron-right')}`).join('')}</nav>`;
const faq = [
 {q:'What is PinnacleAI GPT-OS licensed for?',a:'The supplied MD-5 lists PinnacleAI GPT-OS v1.0.0 as a Class B, non-diagnostic developmental-support device. Its scope is tied to the named device, version, intended use and premises; it does not establish diagnostic authority or guarantee clinical outcomes.',id:'md5'},
 {q:'Are an MD-3 application and an MD-5 licence the same?',a:'No. MD-3 is an application for a manufacturing licence. MD-5 is the issued manufacturing licence. The separate CDSCO classification decision is tracked as an open source check.',id:'md3'},
 {q:'What do the BIS and ISO records establish?',a:'They describe specified management systems and the activities and locations within their scope. They do not establish the effectiveness of every intervention or promise a particular outcome for a child.',id:'bis'},
 {q:'Does a research protocol prove external validation?',a:'No. A protocol describes planned methods. The AbilityScore external-validation record here is a protocol; completed results and their limitations are needed before treating that study as completed validation.',id:'external-validation'},
 {q:'Does one credential cover every Pinnacle centre?',a:'No. Match the named institution and premises on each document. This collection contains 28 HFR entries and eight district group summaries; they are different kinds of records and must not be added together as a count of verified centres.',id:'hfr'},
 {q:'Who can help with a correction or a current document?',a:'Contact Gokul Rao at care@pinnacleblooms.org or 9100 181 181. Include the record title, reference number and source date. A named contact is separate from recorded approval of this page.',id:null}
];

// Retain the existing page as an editable source template on the first run.
const templatePath = path.join(content,'page-body.html');
if (!fs.existsSync(templatePath)) fs.writeFileSync(templatePath,read('index.html').match(/<body>([\s\S]*)<\/body>/)[1]);
const queuePath = path.join(content,'review-queue.json');
if (!fs.existsSync(queuePath)) {
  const source = read('app.js').match(/const queue=(\[[\s\S]*?\]);/)[1];
  fs.writeFileSync(queuePath,JSON.stringify(vm.runInNewContext(source),null,2));
}
const queue = JSON.parse(fs.readFileSync(queuePath,'utf8'));
let body = fs.readFileSync(templatePath,'utf8');
body = body.replace('<div id="evidence-list"></div>',`<div id="evidence-list">${records.map(renderRecord).join('\n')}</div>`);
body = body.replace('<select id="mobile-category" class="mobile-category"></select>',`<select id="mobile-category" class="mobile-category">${categories.map(c=>`<option value="${e(c)}">${e(c)} (${records.filter(r=>c==='All evidence'||r.category===c).length})</option>`).join('')}</select>`);
body = body.replace('<div id="category-list" class="category-list" role="group" aria-label="Evidence categories"></div>',`<div id="category-list" class="category-list" role="group" aria-label="Evidence categories">${categories.map(c=>`<button type="button" data-category="${e(c)}" aria-pressed="${c==='All evidence'}"><span>${icon(categoryIcons[c])}${e(c)}</span><span class="count">${records.filter(r=>c==='All evidence'||r.category===c).length}</span></button>`).join('')}</div>`);
body = body.replace('id="total-count">—','id="total-count">'+records.length).replace('id="original-count">—','id="original-count">'+records.filter(r=>r.originalReviewed).length).replace('id="registry-count">—','id="registry-count">'+records.filter(r=>r.issuerMatched).length);
body = body.replace('id="result-count" role="status" aria-live="polite"></p>',`id="result-count" role="status" aria-live="polite">${records.length} records</p>`);
body = body.replace('<span aria-hidden="true">⌕</span>',icon('search','search-icon'));
body = body.replace('PINNACLE TRANSPARENCY CENTRE','VERIFY PINNACLE BLOOMS NETWORK');
body = body.replace('Understand the licences, research and registrations behind Pinnacle’s care.','Explore Pinnacle Blooms Network’s licences, research and registrations.');
body = body.replace('<span>Human page approval</span><strong id="reviewer-name">Not yet recorded</strong><p id="reviewer-detail">Pinnacle’s responsible page reviewer is awaiting assignment.</p>','<span>Named verification contact</span><strong id="reviewer-name">Gokul Rao</strong><p id="reviewer-detail"><a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a> · <a href="tel:+919100181181">9100 181 181</a><br>Human approval of this page has not yet been recorded.</p>');
body = body.replace('<div id="review-queue" class="review-queue"></div>',`<div id="review-queue" class="review-queue">${queue.map((x,i)=>`<article class="queue-item"><span class="queue-number">${String(i+1).padStart(2,'0')}</span><div><h4>${e(x[0])}</h4><p>${e(x[1])}</p><strong>Next step:</strong> ${e(x[2])}</div><span class="badge reconcile">${icon('file-clock')}Open</span></article>`).join('')}</div>`);
body = body.replace('Print this page</button>',`${icon('printer')}Print this page</button>`);
body = body.replace('<ul><li><strong>15 September 2026 · Experience update:', '<ul><li><strong>15 September 2026 · Evidence navigation update:</strong> added permanent record pages, readable text and data exports, matching page metadata, and consistent evidence-type and review-status icons.</li><li><strong>15 September 2026 · Experience update:');
body = body.replace('Verification contact: care@pinnacleblooms.org, as listed in the Evidence Dossier.','Verification contact supplied for this page: Gokul Rao · care@pinnacleblooms.org · 9100 181 181.');
const stageIcons = ['scan-eye','clipboard-list','users','house','chart-no-axes-combined','rotate-ccw','network'];
body = body.replace(/<li><span>(0[1-7])<\/span><h3>/g,(_,n)=>`<li><span aria-hidden="true">${icon(stageIcons[Number(n)-1])}</span><h3><small>${n}</small> `);
body = body.replace(/<span class="badge (original|published|reconcile|missing)">([^<]+)<\/span>/g,(_,s,t)=>`<span class="badge ${t==='Registry record matched'?'matched':s}">${icon(t==='Registry record matched'?'badge-check':statusIcons[s])}${t}</span>`);
body = body.replaceAll('<span aria-hidden="true">↗</span>',icon('arrow-up-right'));
body = body.replace(' <section class="family-section',` <section class="family-section`);
body = body.replace('<noscript>',`<section class="faq-section wrap" id="questions"><p class="eyebrow">COMMON VERIFICATION QUESTIONS</p><h2>Clear answers. Connected to the source.</h2>${faq.map(f=>`<details class="faq-item"><summary>${icon('circle-help')}${e(f.q)}${icon('plus','faq-toggle')}</summary><div><p>${e(f.a)}</p>${f.id?`<a href="${recordPath({id:f.id})}">Read the evidence record ${icon('arrow-up-right')}</a>`:'<a href="mailto:care@pinnacleblooms.org">Email the verification contact</a>'}</div></details>`).join('')}</section><section class="format-section wrap" aria-labelledby="format-title"><div><p class="eyebrow">REFERENCE & REUSE</p><h2 id="format-title">Take the source with you.</h2><p>Readable records retain their review status, source references and limitations in every format.</p></div><div class="format-links"><a href="/evidence/evidence-register.html">${icon('book-open')}Complete evidence register</a><a href="/llms-full.txt">${icon('file-text')}Plain-text evidence</a><a href="/evidence/evidence.json">${icon('files')}Evidence data · JSON</a><a href="/llms.txt">${icon('link')}Source index</a></div></section><noscript>`);
body = body.replace('Interactive search needs JavaScript. You can still read the','Search filters need JavaScript. All evidence is readable on this page, or in the');
// Centre table summaries are rendered at build time; browser search only filters them.
const decode = s => s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim().replace(/\s+/g,' ');
const centreRows = (file,kind) => [...read(file).matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].flatMap(m=>[...m[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>{
 const c=[...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x=>decode(x[1]));
 return {kind,name:c[0],identifier:kind==='hfr'?c[1]:c[1]+' reported copies',date:c[2],source:kind==='hfr'?'Recognitions bundle · physical '+c[3]:'September handout and selected originals',note:kind==='hfr'?'Printed certificate date; current HFR status was not queried.':c[3],search:c.join(' ').toLocaleLowerCase()};
}));
const centres=[...centreRows('evidence/hfr-register.html','hfr'),...centreRows('evidence/district-register.html','district')].sort((a,b)=>a.name.localeCompare(b.name));
const centreCard = (r,i) => `<article class="centre-card" data-centre-index="${i}"><div><span class="record-category">${icon(r.kind==='hfr'?'map-pin':'landmark')}${r.kind==='hfr'?'Health Facility Registry':'District group summary'}</span><span class="badge ${r.kind==='hfr'?'original':'published'}">${icon(r.kind==='hfr'?'file-search':'files')}${r.kind==='hfr'?'Source copy reviewed':'Group summary'}</span></div><h3>${e(r.name)}</h3><dl><div><dt>Identifier / copies</dt><dd>${e(r.identifier)}</dd></div><div><dt>Printed date / period</dt><dd>${e(r.date)}</dd></div><div><dt>Source</dt><dd>${e(r.source)}</dd></div></dl><p>${e(r.note)}</p><a class="centre-source" href="/evidence/${r.kind==='hfr'?'hfr':'district'}-register.html">View the source register ${icon('arrow-up-right')}</a></article>`;
body=body.replace('<div id="centre-list" class="centre-list"></div>',`<div id="centre-list" class="centre-list">${centres.map(centreCard).join('')}</div>`);
body=body.replace('id="centre-count" role="status" aria-live="polite"></p>','id="centre-count" role="status" aria-live="polite">28 facility records · 8 district summaries</p>');
body=body.replace('<option value="district">District / DDEW registration</option>','<option value="district">District / DDEW summaries</option>');
body=body.replace('HFR identifiers and district registrations answer different questions and are listed separately.','28 HFR facility entries and eight district group summaries are listed separately. The district summaries describe 29 certificate copies; four district originals were individually inspected.');
write('centre-data.js',`window.PINNACLE_CENTRES = ${JSON.stringify(centres)};\n`);
write('index.html','<!doctype html>\n<html lang="en-IN">\n'+head(title,description,origin+'/',[organization,website,{'@type':'CollectionPage','@id':origin+'/#page',name:title,url:origin+'/',description,inLanguage:'en-IN',dateModified:date,isPartOf:{'@id':website['@id']},about:{'@id':organization['@id']},mainEntity:{'@id':listSchema['@id']}},listSchema],true)+'\n<body>'+body+'</body></html>\n');

for (const r of records) {
 const url=absolute(recordPath(r)), name=r.title+' | Verify Pinnacle';
 const desc=`${r.subtitle}. ${labels[r.status]}. Read the source, permitted scope and limitations.`;
 const crumbs=[['Verify Pinnacle','/'],['Evidence register','/evidence/evidence-register.html'],[r.title,recordPath(r)]];
 const recordSchema={'@type':'CreativeWork','@id':url+'#evidence-summary',name:r.title,description:r.subtitle,url,inLanguage:'en-IN',dateModified:date,about:{'@id':organization['@id']},text:`Review status: ${labels[r.status]}. ${statusText(r)} What this supports: ${r.supports} Scope and limits: ${r.limits}${r.note?' '+r.note:''}`,citation:[r.citation,...(r.links||[]).map(l=>absolute(safeUrl(l.url)))],additionalProperty:undefined};
 delete recordSchema.additionalProperty;
 const graph=[organization,website,{'@type':'WebPage','@id':url+'#page',name,url,description:desc,inLanguage:'en-IN',isPartOf:{'@id':website['@id']},dateModified:date,mainEntity:{'@id':recordSchema['@id']},breadcrumb:{'@id':url+'#breadcrumb'}},recordSchema,breadcrumb(crumbs,url)];
 const related=records.filter(x=>x.category===r.category&&x.id!==r.id).slice(0,4);
 write(recordPath(r).slice(1),'<!doctype html><html lang="en-IN">'+head(name,desc,url,graph)+'<body>'+pageHeader+`<main class="wrap record-page">${crumbsHTML(crumbs)}<article><div class="record-topline"><span class="record-category">${icon(categoryIcons[r.category])}${e(r.category)}</span>${badge(r)}</div><h1>${e(r.title)}</h1><p class="intro-copy">${e(r.subtitle)}</p>${recordBody(r,false)}<p class="record-page-boundary">This page summarizes the listed evidence; it is not an issuer’s verification service. A source review is separate from checking current issuer status.</p></article>${related.length?`<aside class="related-records"><h2>Related evidence</h2><ul>${related.map(x=>`<li><a href="${recordPath(x)}">${e(x.title)} ${icon('arrow-up-right')}</a></li>`).join('')}</ul></aside>`:''}</main>`+footer+'</body></html>');
}
const registerUrl=origin+'/evidence/evidence-register.html';
const registerCrumbs=[['Verify Pinnacle','/'],['Evidence register','/evidence/evidence-register.html']];
write('evidence/evidence-register.html','<!doctype html><html lang="en-IN">'+head('Pinnacle Evidence Register | 33 Source Records',description,registerUrl,[organization,website,{'@type':'CollectionPage',name:'Pinnacle evidence register',url:registerUrl,mainEntity:{'@id':listSchema['@id']},breadcrumb:{'@id':registerUrl+'#breadcrumb'},isPartOf:{'@id':website['@id']},dateModified:date},listSchema,breadcrumb(registerCrumbs,registerUrl)])+'<body>'+pageHeader+`<main class="wrap record-page">${crumbsHTML(registerCrumbs)}<h1>The complete evidence register</h1><p class="intro-copy">All 33 records, with source references and limits. Reviewed 15 September 2026. Open any record below or follow its permanent link.</p><nav class="register-categories" aria-label="Evidence categories">${categories.slice(1).map((c,i)=>`<a href="#category-${i}">${icon(categoryIcons[c])}${e(c)}</a>`).join('')}</nav>${categories.slice(1).map((c,i)=>`<section class="register-category" id="category-${i}"><h2>${icon(categoryIcons[c])}${e(c)}</h2>${records.filter(r=>r.category===c).map(renderRecord).join('')}</section>`).join('')}</main>`+footer+'</body></html>');

const registerMeta={
 'hfr-register.html':['Pinnacle Health Facility Registry | 28 Source Entries','Read 28 supplied HFR facility records with identifiers, printed dates and source pages. Current registry status requires a separate check.'],
 'district-register.html':['Pinnacle District Registrations | Scope & Source Review','Eight district summaries describe 29 certificate copies. Read the four-original review boundary and institution-specific scope.'],
 'recognition-register.html':['Pinnacle Government Appreciation | Seven Source Letters','Review seven government appreciation letters, their source references and scope. Appreciation is separate from regulatory approval.'],
 'study-index.html':['Pinnacle Research Index | Twelve-Study Portfolio','Read the company-reported twelve-study portfolio with source references, publication status and limits on clinical interpretation.']
};
for(const [file,[name,desc]] of Object.entries(registerMeta)){
 const p='evidence/'+file,url=absolute(p),crumbs=[['Verify Pinnacle','/'],[name.split(' | ')[0],'/'+p]];
 let html=read(p);
 html=html.replace(/<head>[\s\S]*?<\/head>/,head(name,desc,url,[website,{'@type':'WebPage',name,url,description:desc,inLanguage:'en-IN',dateModified:date,breadcrumb:{'@id':url+'#breadcrumb'},isPartOf:{'@id':website['@id']}},breadcrumb(crumbs,url)]));
 if(!html.includes('class="breadcrumbs"')) html=html.replace(/(<main[^>]*>)/,'$1'+crumbsHTML(crumbs));
 write(p,html);
}

const exportRecords=records.map(r=>({...r,url:absolute(recordPath(r)),statusLabel:labels[r.status],reviewStatusNote:statusText(r),links:(r.links||[]).map(l=>({...l,url:absolute(safeUrl(l.url))}))}));
write('evidence/evidence.json',JSON.stringify({title:'Pinnacle evidence register',canonical:origin+'/',sourceReviewed:date,audience:'Private review edition',contact:{name:'Gokul Rao',email:'care@pinnacleblooms.org',telephone:'+919100181181'},reviewBoundary:'Source inspection is separate from current issuer verification. Human page approval has not been recorded.',records:exportRecords},null,2));
const intro=`# Pinnacle Verification Centre\n\n> Source-led evidence for Pinnacle Blooms Network and Bharath Healthcare Laboratories Private Limited.\n\nPrivate review edition. Source review: ${data.reviewed}. This site summarizes documentary evidence and is not a regulator’s certification service. Preserve the review status and scope limits when citing a record. A protocol is not completed validation; a management-system certificate does not guarantee a child’s outcome. Human page approval has not been recorded.\n\nContact: Gokul Rao · care@pinnacleblooms.org · +91 9100 181 181.\n\n`;
write('llms.txt',intro+`## Reference files\n- [Verification centre](${origin}/): human-readable evidence and review method.\n- [Complete register](${registerUrl}): all 33 source records.\n- [Plain-text evidence](${origin}/llms-full.txt): full record summaries with limitations.\n- [Evidence JSON](${origin}/evidence/evidence.json): the same records as structured data.\n\n## Evidence records\n`+exportRecords.map(r=>`- [${r.title}](${r.url}): ${r.statusLabel}. ${r.subtitle}`).join('\n')+'\n');
write('llms-full.txt',intro+exportRecords.map(r=>`## ${r.title}\n\nCanonical: ${r.url}\nCategory: ${r.category}\nReview status: ${r.statusLabel}\n${r.reviewStatusNote}\n\n${r.subtitle}\n\n${Object.entries(r.fields||{}).map(([k,v])=>`${k}: ${v}`).join('\n')}\n\nWhat this supports: ${r.supports}\n\nScope and limits: ${r.limits}${r.note?'\n\nSource note: '+r.note:''}\n\nSource citation: ${r.citation}\nReviewed: ${data.reviewed}\n${r.links.map(l=>`- [${l.label}](${l.url})`).join('\n')}`).join('\n\n---\n\n')+'\n');
const urls=['/','/evidence/evidence-register.html',...records.map(recordPath),...Object.keys(registerMeta).map(p=>'/evidence/'+p)];
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(p=>`<url><loc>${e(absolute(p))}</loc><lastmod>${date}</lastmod></url>`).join('')+'</urlset>\n');
write('robots.txt',`# Private review edition; public discovery is not enabled.\nUser-agent: *\nDisallow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
write('THIRD-PARTY-NOTICES.txt','Lucide static SVG icons, version 1.46.0. https://lucide.dev\nOnly used icons are included inline.\n\n'+fs.readFileSync(path.join(root,'assets/lucide/LICENSE.txt'),'utf8'));
console.log(JSON.stringify({records:records.length,originals:records.filter(r=>r.originalReviewed).length,registryMatches:records.filter(r=>r.issuerMatched).length,hfr:centres.filter(r=>r.kind==='hfr').length,districtSummaries:centres.filter(r=>r.kind==='district').length,htmlPages:urls.length,robots}));
