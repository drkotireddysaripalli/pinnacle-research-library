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
// The authorised public /verify/ route is indexable; hosting access controls are unchanged.
const robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const date = '2026-09-19';
const sourceDate = '2026-09-15';
const title = 'Verify Pinnacle Blooms Network | Evidence, Care Pathway & Scale';
const description = 'Explore PinnacleAI®’s developmental pathway: AbilityScore, daily practice and monthly review toward self-sufficiency and participation, with MD-5, BIS and source-linked evidence.';
const e = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const absolute = p => new URL(p, origin+'/').href;
const recordPath = r => `/evidence/records/${r.id}.html`;
const safeUrl = value => { if (!/^(https:\/\/|evidence\/|\/evidence\/)/.test(value)) throw new Error('Unexpected evidence URL'); return value.startsWith('evidence/')?'/'+value:value; };
const categories = ['All evidence','Legal identity','Medical device regulation','Quality & security','Research & outcomes','Centre registrations','Government recognition','Source publications'];
const labels = {original:'Original reviewed',published:'Company-published',reconcile:'Evidence scope note',missing:'Source needed',matched:'Registry record matched'};
const categoryIcons = {'All evidence':'files','Legal identity':'building-2','Medical device regulation':'file-cog','Quality & security':'shield','Research & outcomes':'flask-conical','Centre registrations':'map-pin','Government recognition':'landmark','Source publications':'book-open'};
const statusIcons = {original:'file-search',matched:'badge-check',published:'file-text',reconcile:'file-clock',missing:'circle-help'};
const icon = (name,extra='') => {
  const source = fs.readFileSync(path.join(root,'assets','lucide',name+'.svg'),'utf8');
  const inner = source.slice(source.indexOf('>',source.indexOf('<svg'))+1,source.lastIndexOf('</svg>')).trim();
  return `<svg class="truth-icon ${extra}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
};
const impact = require('./impact-content.cjs')({e,icon});
const metrics = require('./metrics-content.cjs')({e,icon});
const hfr = require('./hfr-content.cjs')({e,icon});
const world = require('./world-content.cjs')({e,icon,origin});
const research = require('./research-content.cjs')({e,origin});
for(const r of records.filter(r=>['books','whitebook','study-portfolio','methodology','external-validation'].includes(r.id))){
 const anchor=r.id==='books'?'parent-books':r.id==='whitebook'?'global-research-whitebook':r.id==='study-portfolio'?'company-studies':r.id==='methodology'?'zenodo-19482123':'zenodo-19482476';
 r.links=[...(r.links||[]),{label:'Research, books & author profiles',url:'/evidence/research-library.html#'+anchor}];
}
impact.scale=impact.scale.replace('<details class="context-disclosure">',world.observations+'<details class="context-disclosure">');
impact.regulatory=impact.regulatory.replace('<div class="licensed-functions">',world.parentRole+world.scope+'<div class="licensed-functions">');
for (const r of records) r.familyMeaning = impact.data.familyMeaning[r.id];
const familyMeaning = r => r.familyMeaning ? `<div class="record-family"><span class="section-icon">${icon('users')}</span><div><h4>What this means for your family</h4><p>${e(r.familyMeaning)}</p></div></div>` : '';
const reviewLabel = r => r.reviewLabel || labels[r.status];
const badge = r => `<span class="badge ${e(r.status)}">${icon(statusIcons[r.status])}${e(reviewLabel(r))}</span>${r.scopeLabel?`<span class="badge scoped">${icon('scan-eye')}${e(r.scopeLabel)}</span>`:''}`;
const conclusion = r => r.reviewConclusion ? `<div class="record-conclusion">${icon('file-search')}<div><h4>Source review conclusion</h4><p>${e(r.reviewConclusion)}</p></div></div>` : '';
const statusText = r => r.verificationNote || (r.issuerMatched?'Exact official registry record checked.':r.category==='Source publications'?'Company-authored source; underlying claims need their own evidence.':['methodology','external-validation'].includes(r.id)?'Repository metadata checked; journal peer review not established.':['sae3000','srs4400'].includes(r.id)?'Report inspected; UDIN not independently matched in this review.':'Current issuer or registry status: not independently confirmed.');
const recordBody = (r,linkToPage=true) => `<div class="record-body">${familyMeaning(r)}${conclusion(r)}<dl class="record-fields">${Object.entries(r.fields||{}).map(([k,v])=>`<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl><div class="scope-columns"><div><h4>${icon('file-text')}What this supports</h4><p>${e(r.supports)}</p></div><div><h4>${icon('scan-eye')}Scope & limits</h4><p>${e(r.limits)}</p></div></div>${r.note?`<p class="evidence-note">${e(r.note)}</p>`:''}<div class="record-actions"><a class="u-url" href="${recordPath(r)}">${icon('link')}Permanent record</a>${(r.links||[]).map(l=>`<a href="${e(safeUrl(l.url))}"${l.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${icon(/\.pdf$/.test(l.url)?'download':'external-link')}${e(l.label)}</a>`).join('')}<a href="mailto:care@pinnacleblooms.org?subject=Pinnacle%20verification%20question%3A%20${encodeURIComponent(r.title)}">${icon('mail')}Ask about this record</a></div><p class="record-citation"><strong>Source:</strong> ${e(r.citation)}<br>Reviewed: <time datetime="${r.reviewedOn||sourceDate}">${e(r.reviewedDate||data.reviewed)}</time>${r.scopeReviewed?` · Scope rechecked: ${e(r.scopeReviewed)}`:''} · ${e(statusText(r))}</p></div>`;
const renderRecord = r => `<details class="evidence-record" id="${e(r.id)}" data-category="${e(r.category)}" data-status="${e(r.status)}" data-original="${Boolean(r.originalReviewed)}" data-scoped="${Boolean(r.reviewConclusion)}" data-search="${e(r.searchTerms||'')}"><summary><div><div class="record-topline"><span class="record-category">${icon(categoryIcons[r.category])}${e(r.category)}</span>${badge(r)}</div><h3 class="record-title">${e(r.title)}</h3><p class="record-subtitle">${e(r.subtitle)}</p></div><span class="expand-sign" aria-hidden="true">${icon('plus')}</span></summary>${recordBody(r)}</details>`;
const brand = {'@type':'Brand','@id':origin+'/#pinnacle-brand',name:'Pinnacle Blooms Network',url:'https://www.pinnacleblooms.org/',logo:{'@type':'ImageObject',url:origin+'/favicon.png',contentUrl:origin+'/favicon.png',width:50,height:50,caption:'Official Pinnacle Blooms Network emblem'}};
const organization = {'@type':'Organization','@id':origin+'/#organization',name:'Bharath Healthcare Laboratories Private Limited',legalName:'Bharath Healthcare Laboratories Private Limited',brand:{'@id':brand['@id']},url:'https://www.pinnacleblooms.org/',identifier:[{'@type':'PropertyValue',propertyID:'CIN',value:'U74999TG2016PTC113063'},{'@type':'PropertyValue',propertyID:'LEI',value:'894500OJYBVC18BUDN89'}],contactPoint:{'@type':'ContactPoint',contactType:'verification enquiries',email:'care@pinnacleblooms.org',telephone:'+919100181181'}};
const semantic = require('./semantic-content.cjs')({e,icon,origin,date,organization,brand,recordIds:records.map(r=>r.id)});
const website = {'@type':'WebSite','@id':origin+'/#website',name:'Pinnacle Verification Centre',url:origin+'/',inLanguage:'en-IN',publisher:{'@id':organization['@id']}};
const breadcrumb = (items,url) => ({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item[0],item:absolute(item[1])}))});
const listSchema = {'@type':'ItemList','@id':origin+'/#evidence-list',name:'Pinnacle evidence records',numberOfItems:records.length,itemListElement:records.map((r,i)=>({'@type':'ListItem',position:i+1,name:r.title,url:absolute(recordPath(r))}))};
const head = (pageTitle,desc,url,graph,scripts=false) => `<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="google-site-verification" content="lxrRvKgDv43c28DuT_1uMBEJdkOErCekj9NNRjh4p-w">
<title>${e(pageTitle)}</title><meta name="description" content="${e(desc)}">
<meta name="robots" content="${robots}"><meta name="theme-color" content="#007f86"><meta name="application-name" content="Pinnacle Verify"><meta name="color-scheme" content="light">
<link rel="canonical" href="${e(url)}"><meta property="og:type" content="website"><meta property="og:locale" content="en_IN"><meta property="og:site_name" content="Pinnacle Verification Centre"><meta property="og:title" content="${e(pageTitle)}"><meta property="og:description" content="${e(desc)}"><meta property="og:url" content="${e(url)}">
<meta property="og:image" content="${origin}/images/pinnacle-verify-social-20260918.jpg"><meta property="og:image:secure_url" content="${origin}/images/pinnacle-verify-social-20260918.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Pinnacle Blooms Network — Verify Pinnacle. Licences. Records. Sources."><meta name="twitter:image" content="${origin}/images/pinnacle-verify-social-20260918.jpg"><meta name="twitter:image:alt" content="Pinnacle Blooms Network — Verify Pinnacle. Licences. Records. Sources."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(pageTitle)}"><meta name="twitter:description" content="${e(desc)}">
<link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/upgrade.css"><link rel="stylesheet" href="/evidence-design.css"><link rel="stylesheet" href="/impact.css"><link rel="stylesheet" href="/semantic.css"><link rel="stylesheet" href="/world.css"><link rel="stylesheet" href="/reader.css">
<link rel="icon" href="/favicon.ico" sizes="50x50"><link rel="icon" type="image/png" sizes="50x50" href="/favicon.png"><link rel="apple-touch-icon" sizes="50x50" href="/favicon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/json" href="/evidence/research-library.json" title="Research and book catalogue"><link rel="alternate" type="application/json" href="/evidence/evidence.json" title="Pinnacle evidence register"><link rel="alternate" type="text/plain" href="/llms-full.txt" title="Pinnacle evidence in plain text">
<link rel="alternate" type="application/json" href="/evidence/section-index.json" title="Page sections and their source links"><link rel="alternate" type="application/json" href="/evidence/answers.json" title="Source-linked verification questions and answers"><link rel="sitemap" type="application/xml" href="/sitemap.xml"><link rel="alternate" type="text/plain" href="/llms.txt" title="Source index for automated readers">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>
${scripts?'<script defer src="/app.js"></script><script defer src="/reader.js"></script>':''}
</head>`;
const pageHeader = `<div class="review-strip"><span>EVIDENCE & CONTEXT</span> Updated: 19 September 2026</div><header class="wrap site-header"><a href="/" aria-label="Pinnacle verification home" class="brand"><span class="logo-crop"><img src="/images/pinnacle-logo.webp" alt="Pinnacle Blooms Network" width="420" height="158"></span></a><a class="outline-link" href="/#records">${icon('arrow-left')}Evidence library</a></header>`;
const footer = `<footer class="wrap"><div class="h-card"><strong><a class="p-name u-url" href="https://www.pinnacleblooms.org/">Pinnacle Blooms Network</a></strong><p>Verification contact: Gokul Rao · <a class="u-email" href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a> · <a class="p-tel" href="tel:+919100181181">9100 181 181</a></p></div><a href="/#method">How we review evidence</a></footer>`;
const crumbsHTML = items => `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((x,i)=>i===items.length-1?`<span aria-current="page">${e(x[0])}</span>`:`<a href="${e(x[1])}">${e(x[0])}</a>${icon('chevron-right')}`).join('')}</nav>`;
const faq = [
 {q:'What is PinnacleAI® GPT-OS licensed for?',a:'The supplied MD-5 lists PinnacleAI® GPT-OS v1.0.0 as a Class B, non-diagnostic developmental-support device. Its scope is tied to the named device, version, intended use and premises; it does not establish diagnostic authority or guarantee clinical outcomes.',id:'md5'},
 {q:'Are an MD-3 application and an MD-5 licence the same?',a:'No. MD-3 is an application for a manufacturing licence. MD-5 is the issued manufacturing licence. The original application is reviewed; Class B is recorded on the issued MD-5. The separate issued classification decision copy was not available for inspection.',id:'md3'},
 {q:'What do the BIS and ISO records establish?',a:'They describe specified management systems and the activities and locations within their scope. They do not establish the effectiveness of every intervention or promise a particular outcome for a child.',id:'bis'},
 {q:'Does a research protocol prove external validation?',a:'No. A protocol describes planned methods. The AbilityScore external-validation record here is a protocol; completed results and their limitations are needed before treating that study as completed validation.',id:'external-validation'},
 {q:'Does one credential cover every Pinnacle centre?',a:'No. Match the named institution and premises on each document. This collection contains all 52 workbook centres and 53 distinct HFR identifiers across the workbook and certificate copies. Eight district summaries are separate; these are not counts of verified active centres.',id:'hfr'},
 {q:'Who can help with a correction or a current document?',a:'Contact Gokul Rao at care@pinnacleblooms.org or 9100 181 181. Include the record title, reference number and source date so the relevant document can be located.',id:null}
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
faq.push(...impact.data.faq);
const faqSchema = {'@type':'FAQPage','@id':origin+'/#questions',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))};
let body = fs.readFileSync(templatePath,'utf8');
const worldHero=`<section class="intro world-intro wrap" aria-labelledby="page-title"><div class="world-intro-copy"><p class="eyebrow">VERIFY PINNACLE BLOOMS NETWORK</p><h1 id="page-title">Every child deserves<br><em>a wonderful life.</em></h1><p class="intro-purpose">Growing toward self-sufficiency.<br>Participating in mainstream life.</p><p class="intro-copy">Understand your child’s abilities. Build a personal plan. Connect professional support, everyday practice and monthly progress review. Explore the evidence behind PinnacleAI® and the people who put that journey into practice.</p><div class="hero-actions"><a class="primary-link" href="#care">${icon('network')}Explore the developmental journey</a><a class="outline-link" href="#records">${icon('file-search')}Inspect the evidence</a></div><p class="hero-scope">PinnacleAI® GPT-OS · Non-diagnostic Class B SaMD · Ages 0–12.<br>Developmental support toward individual goals; outcomes vary.</p></div>${world.hero}</section><div class="wrap">${world.proof}</div>`;
body=body.replace('<!-- WORLD HERO -->',worldHero).replace('<!-- LIFECYCLE -->',world.lifecycle).replace('<!-- STANDARDS -->',world.standards).replace('<!-- SDGS -->',world.sdgs);
body=body.replace('<!-- METRICS -->',semantic.profile+'<!-- METRICS -->').replace('<!-- CTA -->',semantic.glossary+'<!-- CTA -->');
body=body.replace('<!-- METRICS -->',metrics.section).replace('<!-- HFR SUMMARY -->',hfr.summary);
body=body.replace('<!-- HFR NOTE -->',hfr.note);
for(const name of ['impact','scale','regulatory','principles','comparisons','cta']) body=body.replace('<!-- '+name.toUpperCase()+' -->',impact[name]);
body = body.replace('<div id="evidence-list"></div>',`<div id="evidence-list">${records.map(renderRecord).join('\n')}</div>`);
body = body.replace('<select id="mobile-category" class="mobile-category"></select>',`<select id="mobile-category" class="mobile-category">${categories.map(c=>`<option value="${e(c)}">${e(c)} (${records.filter(r=>c==='All evidence'||r.category===c).length})</option>`).join('')}</select>`);
body = body.replace('<div id="category-list" class="category-list" role="group" aria-label="Evidence categories"></div>',`<div id="category-list" class="category-list" role="group" aria-label="Evidence categories">${categories.map(c=>`<button type="button" data-category="${e(c)}" aria-pressed="${c==='All evidence'}"><span>${icon(categoryIcons[c])}${e(c)}</span><span class="count">${records.filter(r=>c==='All evidence'||r.category===c).length}</span></button>`).join('')}</div>`);
body = body.replace('id="total-count">—','id="total-count">'+records.length).replace('id="original-count">—','id="original-count">'+records.filter(r=>r.originalReviewed).length).replace('id="registry-count">—','id="registry-count">'+records.filter(r=>r.issuerMatched).length);
body = body.replace('id="result-count" role="status" aria-live="polite"></p>',`id="result-count" role="status" aria-live="polite">${records.length} records</p>`);
body = body.replace('<span aria-hidden="true">⌕</span>',icon('search','search-icon'));
body = body.replace('PINNACLE TRANSPARENCY CENTRE','VERIFY PINNACLE BLOOMS NETWORK');
body = body.replace('Understand the licences, research and registrations behind Pinnacle’s care.','Explore Pinnacle Blooms Network’s licences, research and registrations.');
body = body.replace('<span>Human page approval</span><strong id="reviewer-name">Not yet recorded</strong><p id="reviewer-detail">Pinnacle’s responsible page reviewer is awaiting assignment.</p>','<span>Named verification contact</span><strong id="reviewer-name">Gokul Rao</strong><p id="reviewer-detail"><a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a> · <a href="tel:+919100181181">9100 181 181</a><br>Human approval of this page has not yet been recorded.</p>');
body = body.replace('<div id="review-queue" class="review-queue"></div>',`<div id="review-queue" class="review-queue">${queue.map(x=>`<article class="queue-item"><span class="conclusion-icon">${icon(x.icon)}</span><div><span class="conclusion-label">${e(x.label)}</span><h4>${e(x.title)}</h4><p class="conclusion-finding">${e(x.finding)}</p><p class="conclusion-boundary"><strong>Evidence scope:</strong> ${e(x.boundary)}</p><a class="conclusion-link" href="#${e(x.id)}">Read the source record ${icon('arrow-up-right')}</a></div></article>`).join('')}</div>`);
const familyIcons = ['file-search','scan-eye','chart-no-axes-combined'];
body = body.replace(/<span class="step-number">0([1-3])<\/span>/g,(_,n)=>`<span class="section-icon">${icon(familyIcons[Number(n)-1])}</span>`);
const methodIcons = ['files','building-2','flask-conical'];
body = body.replace(/<article><span>(0[1-3] \/ [A-Z]+)<\/span><h3>/g,(_,s)=>`<article><span class="method-kicker">${icon(methodIcons[Number(s.slice(0,2))-1])}${s}</span><h3>`);
body = body.replace('<span class="badge scoped">Evidence scope</span>',`<span class="badge scoped">${icon('scan-eye')}Evidence scope</span>`);
body = body.replace('Print this page</button>',`${icon('printer')}Print this page</button>`);
body = body.replace('<ul><li><strong>15 September 2026 · Experience update:', '<ul><li><strong>15 September 2026 · Evidence navigation update:</strong> added permanent record pages, readable text and data exports, matching page metadata, and consistent evidence-type and review-status icons.</li><li><strong>15 September 2026 · Experience update:');
body = body.replace('Verification contact: care@pinnacleblooms.org, as listed in the Evidence Dossier.','Verification contact supplied for this page: Gokul Rao · care@pinnacleblooms.org · 9100 181 181.');
const stageIcons = ['scan-eye','clipboard-list','users','house','chart-no-axes-combined','rotate-ccw','network'];
body = body.replace(/<li><span>(0[1-7])<\/span><h3>/g,(_,n)=>`<li><span aria-hidden="true">${icon(stageIcons[Number(n)-1])}</span><h3><small>${n}</small> `);
body = body.replace(/<span class="badge (original|published|reconcile|missing)">([^<]+)<\/span>/g,(_,s,t)=>`<span class="badge ${t==='Registry record matched'?'matched':s}">${icon(t==='Registry record matched'?'badge-check':statusIcons[s])}${t}</span>`);
body = body.replaceAll('<span aria-hidden="true">↗</span>',icon('arrow-up-right'));
body = body.replace(' <section class="family-section',` <section class="family-section`);
body = body.replace('<noscript>',`<section class="faq-section wrap" id="questions"><p class="eyebrow">COMMON VERIFICATION QUESTIONS</p><h2>Clear answers. Connected to the source.</h2>${faq.map(f=>`<details class="faq-item"><summary>${icon('circle-help')}${e(f.q)}${icon('plus','faq-toggle')}</summary><div><p>${e(f.a)}</p>${f.id?`<a href="${recordPath({id:f.id})}">Read the evidence record ${icon('arrow-up-right')}</a>`:'<a href="mailto:care@pinnacleblooms.org">Email the verification contact</a>'}</div></details>`).join('')}</section><section class="format-section wrap" aria-labelledby="format-title"><div><p class="eyebrow">REFERENCE & REUSE</p><h2 id="format-title">Take the source with you.</h2><p>Readable records retain their review status, source references and limitations in every format.</p></div><div class="format-links"><a href="/evidence/evidence-register.html">${icon('book-open')}Complete evidence register</a><a href="/llms-full.txt">${icon('file-text')}Plain-text evidence</a><a href="/evidence/evidence.json">${icon('files')}Evidence data · JSON</a><a href="/llms.txt">${icon('link')}Source index</a><a href="/evidence/global-context.html">${icon('network')}Global context & references</a><a href="/evidence/global-context.json">${icon('files')}Global context · JSON</a><a href="/evidence/section-index.json">${icon('link')}Page sections & sources · JSON</a><a href="/evidence/answers.json">${icon('circle-help')}Questions & answers · JSON</a><a href="/evidence/developmental-pathway.json">${icon('network')}Developmental pathway · JSON</a></div></section><noscript>`);
body = body.replace('Interactive search needs JavaScript. You can still read the','Search filters need JavaScript. All evidence is readable on this page, or in the');
// Centre table summaries are rendered at build time; browser search only filters them.
const decode = s => s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim().replace(/\s+/g,' ');
const centreRows = (file,kind) => [...read(file).matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].flatMap(m=>[...m[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row=>{
 const c=[...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x=>decode(x[1]));
 return {kind,name:c[0],identifier:kind==='hfr'?c[1]:c[1]+' reported copies',date:c[2],source:kind==='hfr'?'Recognitions bundle · physical '+c[3]:'September handout and selected originals',note:kind==='hfr'?'Printed certificate date; current HFR status was not queried.':c[3],search:c.join(' ').toLocaleLowerCase()};
}));
const centres=[...hfr.centres,...centreRows('evidence/district-register.html','district')].sort((a,b)=>a.name.localeCompare(b.name));
const centreCard=(r,i)=>`<article class="centre-card" data-centre-index="${i}" data-kind="${r.kind}"><div><span class="record-category">${icon(r.kind==='hfr'?'map-pin':'landmark')}${r.kind==='hfr'?'HFR identifier':'District group summary'}</span><span class="badge ${r.kind==='hfr'&&r.sourceLevel!=='Workbook-listed'?'original':'published'}">${icon(r.kind==='hfr'?'file-search':'files')}${e(r.sourceLevel||'Group summary')}</span></div><h3>${e(r.name)}</h3><dl><div><dt>${r.kind==='hfr'?'HFR identifier':'Copies reported'}</dt><dd>${e(r.identifier)}</dd></div><div><dt>Printed date / period</dt><dd>${e(r.date)}</dd></div><div><dt>Source</dt><dd>${e(r.source)}</dd></div></dl>${r.address?'<p class="centre-address">'+e(r.address)+(r.postcode?'<br>Postcode column: '+e(r.postcode):'')+'</p>':''}<p>${e(r.note)}</p><a class="centre-source" href="${r.sourceUrl||'/evidence/district-register.html'}">${icon('arrow-up-right')}View this source record</a></article>`;
body=body.replace('<div id="centre-list" class="centre-list"></div>',`<div id="centre-list" class="centre-list">${centres.map(centreCard).join('')}</div>`);
body=body.replace('id="centre-count" role="status" aria-live="polite"></p>','id="centre-count" role="status" aria-live="polite">53 HFR identifiers · 8 district summaries</p>');
body=body.replace('<option value="district">District / DDEW registration</option>','<option value="district">District / DDEW summaries</option>');
body=body.replace('HFR identifiers and district registrations answer different questions and are listed separately.','All 52 workbook centres and 53 distinct HFR identifiers across both source sets are available above. Eight district summaries describe 29 certificate copies; four district originals were individually inspected.');
write('centre-data.js',`window.PINNACLE_CENTRES = ${JSON.stringify(centres)};\n`);
body=require('./reader-content.cjs')(body,research.teaser);
write('index.html','<!doctype html>\n<html lang="en-IN">\n'+head(title,description,origin+'/',[organization,website,{'@type':'CollectionPage','@id':origin+'/#page',name:title,url:origin+'/',description,inLanguage:'en-IN',dateModified:date,isPartOf:{'@id':website['@id']},about:{'@id':organization['@id']},mainEntity:{'@id':listSchema['@id']}},listSchema,faqSchema],true)+'\n<body>'+body+'</body></html>\n');

for (const r of records) {
 const url=absolute(recordPath(r)), name=r.title+' | Verify Pinnacle';
 const desc=`${r.subtitle}. ${reviewLabel(r)}. Read the source, permitted scope and limitations.`;
 const crumbs=[['Verify Pinnacle','/'],['Evidence register','/evidence/evidence-register.html'],[r.title,recordPath(r)]];
 const recordSchema={'@type':'CreativeWork','@id':url+'#evidence-summary',name:r.title,description:r.subtitle,url,inLanguage:'en-IN',dateModified:date,about:{'@id':organization['@id']},text:`Review status: ${reviewLabel(r)}. ${r.scopeLabel?"Evidence scope: "+r.scopeLabel+". ":""}${r.reviewConclusion?r.reviewConclusion+" ":""}${statusText(r)} Family relevance: ${r.familyMeaning} What this supports: ${r.supports} Scope and limits: ${r.limits}${r.note?' '+r.note:''}`,citation:[r.citation,...(r.links||[]).map(l=>absolute(safeUrl(l.url)))],additionalProperty:undefined};
 delete recordSchema.additionalProperty;
 const graph=[organization,website,{'@type':'WebPage','@id':url+'#page',name,url,description:desc,inLanguage:'en-IN',isPartOf:{'@id':website['@id']},dateModified:date,mainEntity:{'@id':recordSchema['@id']},breadcrumb:{'@id':url+'#breadcrumb'}},recordSchema,breadcrumb(crumbs,url)];
 const related=records.filter(x=>x.category===r.category&&x.id!==r.id).slice(0,4);
 write(recordPath(r).slice(1),'<!doctype html><html lang="en-IN">'+head(name,desc,url,graph)+'<body>'+pageHeader+`<main class="wrap record-page">${crumbsHTML(crumbs)}<article class="h-entry"><div class="record-topline"><span class="record-category">${icon(categoryIcons[r.category])}${e(r.category)}</span>${badge(r)}</div><h1 class="p-name">${e(r.title)}</h1><p class="intro-copy p-summary">${e(r.subtitle)}</p><div class="e-content">${recordBody(r,false)}</div><p class="record-page-boundary">This page summarizes the listed evidence; it is not an issuer’s verification service. A source review is separate from checking current issuer status.</p></article>${related.length?`<aside class="related-records"><h2>Related evidence</h2><ul>${related.map(x=>`<li><a href="${recordPath(x)}">${e(x.title)} ${icon('arrow-up-right')}</a></li>`).join('')}</ul></aside>`:''}</main>`+footer+'</body></html>');
}
const registerUrl=origin+'/evidence/evidence-register.html';
const registerCrumbs=[['Verify Pinnacle','/'],['Evidence register','/evidence/evidence-register.html']];
write('evidence/evidence-register.html','<!doctype html><html lang="en-IN">'+head('Pinnacle Evidence Register | '+records.length+' Source Records',description,registerUrl,[organization,website,{'@type':'CollectionPage',name:'Pinnacle evidence register',url:registerUrl,mainEntity:{'@id':listSchema['@id']},breadcrumb:{'@id':registerUrl+'#breadcrumb'},isPartOf:{'@id':website['@id']},dateModified:date},listSchema,breadcrumb(registerCrumbs,registerUrl)])+'<body>'+pageHeader+`<main class="wrap record-page">${crumbsHTML(registerCrumbs)}<h1>The complete evidence register</h1><p class="intro-copy">All ${records.length} records, with source references and limits. Source review dates appear on each record. Open any record below or follow its permanent link.</p><nav class="register-categories" aria-label="Evidence categories">${categories.slice(1).map((c,i)=>`<a href="#category-${i}">${icon(categoryIcons[c])}${e(c)}</a>`).join('')}</nav>${categories.slice(1).map((c,i)=>`<section class="register-category" id="category-${i}"><h2>${icon(categoryIcons[c])}${e(c)}</h2>${records.filter(r=>r.category===c).map(renderRecord).join('')}</section>`).join('')}</main>`+footer+'</body></html>');

const hfrUrl=origin+'/evidence/hfr-register.html';
const hfrCrumbs=[['Verify Pinnacle','/'],['Complete HFR register','/evidence/hfr-register.html']];
write('evidence/hfr-register.html','<!doctype html><html lang="en-IN">'+head('Pinnacle HFR Register | All 52 Workbook Centres','All 52 supplied workbook centres, addresses and HFR IDs; reconciled into 53 distinct identifiers with certificate-source dates and clear review levels.',hfrUrl,[organization,website,{'@type':'CollectionPage',name:'Pinnacle complete HFR source inventory',url:hfrUrl,dateModified:date,description:hfr.note},breadcrumb(hfrCrumbs,hfrUrl)])+'<body>'+pageHeader+'<main class="wrap record-page hfr-page">'+crumbsHTML(hfrCrumbs)+hfr.content+'</main>'+footer+'<script defer src="/hfr-register.js"></script></body></html>');
write('evidence/hfr-register.json',JSON.stringify(hfr.data,null,2));
write('evidence/hfr-register.csv',hfr.csv);
const scaleUrl=origin+'/evidence/scale-register.html';
const scaleCrumbs=[['Verify Pinnacle','/'],['Statistics & evidence','/evidence/scale-register.html']];
write('evidence/scale-register.html','<!doctype html><html lang="en-IN">'+head('Pinnacle Statistics | Six Measures & Their Evidence','Understand the reported 2.7B records, 31M services, technique library, family registrations, international reach and centre network with definitions and source links.',scaleUrl,[organization,website,{'@type':'Article',headline:'Pinnacle statistics and their evidence',url:scaleUrl,dateModified:date,about:{'@id':organization['@id']},citation:records.filter(r=>['sae3000','srs4400','operating-metrics','hfr','dossier','september-handout'].includes(r.id)).map(r=>absolute(recordPath(r)))},breadcrumb(scaleCrumbs,scaleUrl)])+'<body>'+pageHeader+'<main><div class="wrap context-intro">'+crumbsHTML(scaleCrumbs)+'<h1>Pinnacle’s scale.<br>Defined and connected to evidence.</h1><p class="intro-copy">Six figures, with their source, reporting date and meaning. Updated 18 September 2026.</p></div>'+metrics.section.replace('href="#centres"','href="/#centres"')+'</main>'+footer+'</body></html>');
write('evidence/scale-register.json',JSON.stringify({...metrics.data,canonical:scaleUrl},null,2));
write('evidence/scale-register.txt',metrics.text);

const registerMeta={
 'district-register.html':['Pinnacle District Registrations | Scope & Source Review','Eight district summaries describe 29 certificate copies. Read the four-original review boundary and institution-specific scope.'],
 'recognition-register.html':['Pinnacle Government Appreciation | Seven Source Letters','Review seven government appreciation letters, their source references and scope. Appreciation is separate from regulatory approval.'],
 'study-index.html':['Pinnacle Research Index | Twelve-Study Portfolio','Read the company-reported twelve-study portfolio with source references, publication status and limits on clinical interpretation.']
};
for(const [file,[name,desc]] of Object.entries(registerMeta)){
 const p='evidence/'+file,url=absolute(p),crumbs=[['Verify Pinnacle','/'],[name.split(' | ')[0],'/'+p]];
 let html=read(p).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 html=html.replace(/<head>[\s\S]*?<\/head>/,head(name,desc,url,[website,{'@type':'WebPage',name,url,description:desc,inLanguage:'en-IN',dateModified:date,breadcrumb:{'@id':url+'#breadcrumb'},isPartOf:{'@id':website['@id']}},breadcrumb(crumbs,url)]));
 if(!html.includes('class="breadcrumbs"')) html=html.replace(/(<main[^>]*>)/,'$1'+crumbsHTML(crumbs));
 write(p,html);
}

const contextUrl=origin+'/evidence/global-context.html';
const contextCrumbs=[['Verify Pinnacle','/'],['Family relevance & global context','/evidence/global-context.html']];
const contextTitle='Pinnacle in Global Context | Family Meaning, MD-5 & Data Scale';
const contextDescription='Compare documented child-development approaches, understand Pinnacle’s reported data and licence scope, and explore WHO, CDC, NICE, UNESCO and IMDRF guidance.';
write('evidence/global-context.html','<!doctype html><html lang="en-IN">'+head(contextTitle,contextDescription,contextUrl,[organization,website,{'@type':'Article','@id':contextUrl+'#article',headline:contextTitle,description:contextDescription,url:contextUrl,dateModified:date,inLanguage:'en-IN',about:{'@id':organization['@id']},citation:impact.data.sources.map(s=>s.url)},breadcrumb(contextCrumbs,contextUrl)])+'<body>'+pageHeader+'<main class="context-page"><div class="wrap context-intro">'+crumbsHTML(contextCrumbs)+'<p class="eyebrow">FAMILY RELEVANCE & GLOBAL CONTEXT</p><h1>A connected plan.<br>Evidence in perspective.</h1><p class="intro-copy">'+e(impact.data.positioning)+'</p><p>Primary-source context reviewed 18 September 2026. Comparisons describe different intended uses and evidence types; they do not rank clinical effectiveness.</p><nav class="register-categories" aria-label="Context sections"><a href="#data-scale">Data scale</a><a href="#regulated-purpose">Regulatory scope</a><a href="#global-principles">Global principles</a><a href="#global-context">Comparisons</a><a href="#context-sources">Sources</a></nav></div>'+impact.scale+impact.regulatory+world.standards+world.sdgs+impact.principles+impact.comparisons+'<div class="wrap">'+impact.sourceList+'</div></main>'+footer+'</body></html>');
write('evidence/developmental-pathway.json',JSON.stringify({...world.data,canonical:origin+'/#care'},null,2));
write('evidence/developmental-pathway.txt',world.text);
write('evidence/global-context.json',JSON.stringify({...impact.data,canonical:contextUrl,comparisonBoundary:'Targeted review of five examples; no global exclusivity, dataset-size ranking, regulatory equivalence or comparative effectiveness established.'},null,2));
write('evidence/global-context.txt',impact.contextText+'\n'+impact.data.faq.map(f=>f.q+'\n'+f.a+'\n').join('\n'));

const exportRecords=records.map(r=>({...r,url:absolute(recordPath(r)),statusLabel:reviewLabel(r),reviewStatusNote:statusText(r),links:(r.links||[]).map(l=>({...l,url:absolute(safeUrl(l.url))}))}));
write('evidence/evidence.json',JSON.stringify({title:'Pinnacle evidence register',canonical:origin+'/',sourceReviewed:sourceDate,conclusionsUpdated:date,audience:'Public evidence and context',contact:{name:'Gokul Rao',email:'care@pinnacleblooms.org',telephone:'+919100181181'},reviewBoundary:'Source inspection is separate from current issuer verification. Source review does not establish endorsement by the issuing organisations.',records:exportRecords},null,2));
const intro=`# Pinnacle Verification Centre\n\n> Source-led evidence for Pinnacle Blooms Network and Bharath Healthcare Laboratories Private Limited.\n\nSource review: ${data.reviewed}. Selected originals and review conclusions rechecked: ${data.updated}. This site summarizes documentary evidence and is not a regulator’s certification service. Preserve the review status and scope limits when citing a record. A protocol is not completed validation; a management-system certificate does not guarantee a child’s outcome. Source review does not establish endorsement by the issuing organisations.\n\nContact: Gokul Rao · care@pinnacleblooms.org · +91 9100 181 181.\n\n`;
write('llms.txt',intro+`## Reference files\n- [Verification centre](${origin}/): human-readable evidence and review method.\n- [Complete register](${registerUrl}): all ${records.length} source records.\n- [Plain-text evidence](${origin}/llms-full.txt): full record summaries with limitations.\n- [Evidence JSON](${origin}/evidence/evidence.json): the same records as structured data.\n\n- [Family meaning and global context](${contextUrl}): selected comparisons and international guidance.\n- [Global context JSON](${origin}/evidence/global-context.json): references, scope and comparison definitions.\n\n- [Complete HFR register](${hfrUrl}): all 52 workbook centres; 53 distinct IDs across source sets.\n- [Statistics and evidence](${scaleUrl}): six figures with definitions, dates and source mapping.\n- [Statistics JSON](${origin}/evidence/scale-register.json): the same visible metric definitions.\n\n## Evidence records\n`+exportRecords.map(r=>`- [${r.title}](${r.url}): ${r.statusLabel}. ${r.subtitle}`).join('\n')+'\n');
write('llms-full.txt',intro+exportRecords.map(r=>`## ${r.title}\n\nCanonical: ${r.url}\nCategory: ${r.category}\nReview status: ${r.statusLabel}\n${r.scopeLabel?"Evidence scope: "+r.scopeLabel+"\n":""}${r.reviewConclusion?"Source review conclusion: "+r.reviewConclusion+"\n":""}${r.reviewStatusNote}\n\n${r.subtitle}\n\n${Object.entries(r.fields||{}).map(([k,v])=>`${k}: ${v}`).join('\n')}\n\nFamily relevance: ${r.familyMeaning}\n\nWhat this supports: ${r.supports}\n\nScope and limits: ${r.limits}${r.note?'\n\nSource note: '+r.note:''}\n\nSource citation: ${r.citation}\nReviewed: ${r.reviewedDate||data.reviewed}\n${r.links.map(l=>`- [${l.label}](${l.url})`).join('\n')}`).join('\n\n---\n\n')+'\n');
write('llms-full.txt',read('llms-full.txt')+'\n---\n\n'+read('evidence/global-context.txt'));
write('llms-full.txt',read('llms-full.txt')+'\n---\n\n'+metrics.text+'\n## Complete supplied HFR inventory\n'+hfr.note+'\n'+hfr.data.rows.map(r=>[r.name,r.id,r.address,r.sourceLevel,'Workbook row '+(r.workbookRow||'not listed'),r.certificate?'Certificate '+r.certificate.date+' p'+r.certificate.pages:'No inspected certificate copy','Workbook RS: '+(r.sourceFlag||'not listed')+' (undefined)'].join(' | ')).join('\n')+'\n');
const urls=['/',research.route,'/evidence/hfr-register.html','/evidence/scale-register.html','/evidence/global-context.html','/evidence/evidence-register.html',...records.map(recordPath),...Object.keys(registerMeta).map(p=>'/evidence/'+p)];
const researchCrumbs=[['Verify Pinnacle','/'],['Research, books & authors',research.route]];
write(research.route.slice(1),'<!doctype html><html lang="en-IN">'+head('Pinnacle Research Library | Papers, Books, DOI & Author Profiles','Read seven DOI-linked works, original parent books, the twelve-study portfolio and verified author profiles with publication status and source links.',research.url,[organization,website,{'@type':'CollectionPage','@id':research.url+'#page',url:research.url,name:'Pinnacle research, books and authors',dateModified:date,mainEntity:research.graph.filter(r=>['Book','ScholarlyArticle','Report'].includes(r['@type'])).map(r=>({'@id':r['@id']}))},...research.graph,breadcrumb(researchCrumbs,research.url)])+'<body>'+pageHeader+'<main>'+crumbsHTML(researchCrumbs)+research.content+'</main>'+footer+'</body></html>');
write('evidence/research-library.json',JSON.stringify({...research.data,canonical:research.url},null,2));
write('evidence/research-library.txt',research.text);
write('evidence/research-library.ris',research.ris);
write('llms.txt',read('llms.txt')+'\n## Research, books and authors\n- [Research library]('+research.url+'): seven DOI-linked works, original books, company-study sources and matched author profiles.\n- [Research JSON]('+origin+'/evidence/research-library.json): publication dates, DOI identifiers, authors and source URLs.\n- [Bibliography]('+origin+'/evidence/research-library.txt): readable citations with research-stage labels.\n');
write('llms-full.txt',read('llms-full.txt')+'\n\n'+research.text);
// Apply the same semantic coverage to every page without maintaining a second claim set.
const sectionPages=[];
const sharePages=[];
const addSharing=require('./sharing-content.cjs');
for(const p of urls){
 const file=p==='/'?'index.html':p.slice(1),url=absolute(p);
 let html=read(file).replace(/<p class="entity-line wrap">[\s\S]*?<\/p>/g,'').replace(/<!-- share:start -->[\s\S]*?<!-- share:end -->/g,'').replace(/<svg class="share-symbols"[\s\S]*?<\/svg>/g,'').replace(/<p class="share-status"[\s\S]*?<\/dialog>/g,'');
 if(p!=='/')html=html.replace('</main>','<p class="entity-line wrap">Pinnacle Blooms Network is a brand of Bharath Healthcare Laboratories Private Limited. <a href="/evidence/records/lei.html">View legal identity evidence</a>.</p></main>');
 const enhanced=semantic.enhance(html,url);
 const page={url,title:html.match(/<title>(.*?)<\/title>/)[1],sections:enhanced.blocks};sectionPages.push(page);
 const shared=addSharing(enhanced.html,page,exportRecords);
 // Keep the crawler-facing head short; structured data remains server-rendered in the body.
 const schema=shared.html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)?.[0]||'';
 write(file,shared.html.replace(schema,'').replace('</body>',schema+'</body>').replace('</head>','<link rel="stylesheet" href="/share.css"><script defer src="/share.js"></script></head>'));
 sharePages.push({url,items:shared.rows});
}
write('evidence/share-index.json',JSON.stringify({updated:date,description:'Ready-to-share drafts retain source scope. Visitors choose whether to post.',pages:sharePages},null,2));
write('evidence/section-index.json',JSON.stringify({title:'Pinnacle page sections and sources',canonical:origin+'/',updated:date,organization,brand,description:'An index derived from the visible page content. Source links, reporting definitions and evidence limitations travel with each block.',pages:sectionPages},null,2));
const sectionText='\n\n## Pinnacle identity and documented approach\nPinnacle Blooms Network is a brand of Bharath Healthcare Laboratories Private Limited. Company CIN: U74999TG2016PTC113063. LEI: 894500OJYBVC18BUDN89.\nThe company describes a seven-stage developmental pathway connecting measurement, planning, integrated support, parent-guided practice and progress review. Its supplied MD-5 names non-diagnostic Class B developmental-support software. The BIS scope names connected software modules. Individual outcomes vary.\n\n## Main page sections\n'+sectionPages[0].sections.filter(s=>s.kind==='section').map(s=>`- [${s.name}](${s.url}): ${s.description}`).join('\n')+'\n\n## Terms explained\n'+semantic.terms.map(t=>`${t.name} — ${t.expanded}: ${t.description}\nSource: ${origin}/evidence/records/${t.record}.html`).join('\n\n')+'\n';
write('llms-full.txt',read('llms-full.txt')+sectionText+'\n'+world.text);
write('llms.txt',read('llms.txt')+'\n## Purpose and developmental pathway\n- [How PinnacleAI® works]('+origin+'/#how-pinnacleai-works): observations, child-specific planning, guided practice, feedback and human review, with source-linked explanations.\n- [Seven-stage journey]('+origin+'/#care): documented measurement layers, daily practice and monthly reassessment.\n- [Pathway JSON]('+origin+'/evidence/developmental-pathway.json): the same visible description with source references.\n- [Pathway text]('+origin+'/evidence/developmental-pathway.txt): readable lifecycle and international context.\n');
write('llms.txt',read('llms.txt')+'\n## Section navigation and terminology\n- [Section and source index]('+origin+'/evidence/section-index.json): visible page blocks, source links and scoped descriptions.\n- [Pinnacle at a glance]('+origin+'/#pinnacle-profile): legal identity and documented approach.\n- [Terms explained]('+origin+'/#terminology): SaMD, MD-3, MD-5, BIS, HFR, UDIN and report types.\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(p=>`<url><loc>${e(absolute(p))}</loc><lastmod>${date}</lastmod></url>`).join('')+'</urlset>\n');
write('evidence/answers.json',JSON.stringify({title:'Pinnacle verification questions and answers',canonical:origin+'/#questions',updated:date,publisher:organization.name,description:'Answers match the visible questions on the verification page. Source scope and limitations remain part of each answer.',questions:faq.map(f=>({question:f.q,answer:f.a,url:sectionPages[0].sections.find(s=>s.kind==='details'&&s.name===f.q)?.url,...(f.id?{source:absolute(recordPath({id:f.id}))}:{contact:'mailto:care@pinnacleblooms.org'})}))},null,2));
write('llms.txt',read('llms.txt')+'\n## Direct answers\n- [Verification questions]('+origin+'/#questions): seventeen visible, source-linked answers.\n- [Questions and answers JSON]('+origin+'/evidence/answers.json): the same answers with their evidence links.\n');
write('robots.txt',`# Public verification content. Domain-level crawl policy is served at /robots.txt.\nUser-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
write('THIRD-PARTY-NOTICES.txt','Fonts: DM Sans and Manrope, SIL Open Font License 1.1. See /fonts/dm-sans-OFL.txt and /fonts/manrope-OFL.txt.\n\nLucide static SVG icons, version 1.46.0. https://lucide.dev\nOnly used icons are included inline.\n\n'+fs.readFileSync(path.join(root,'assets/lucide/LICENSE.txt'),'utf8'));
require('./build-performance.cjs');
require('./build-discovery.cjs');
console.log(JSON.stringify({records:records.length,originals:records.filter(r=>r.originalReviewed).length,registryMatches:records.filter(r=>r.issuerMatched).length,hfr:centres.filter(r=>r.kind==='hfr').length,districtSummaries:centres.filter(r=>r.kind==='district').length,htmlPages:urls.length,robots}));
