'use strict';
const {tree}=require('./semantic-content.cjs');
const groups=[
 ['journey','Your child’s journey','Abilities, a personal plan, everyday practice and progress.',['care'],'network','teal'],
 ['family-meaning','What it means for families','Connect the evidence with the goals that matter at home.',['impact'],'users','purple'],
 ['choosing-care','Questions before choosing care','Know what to ask, compare and discuss with the care team.',['family'],'circle-help','rose'],
 ['identity','Pinnacle at a glance','The organisation, its identity and its documented approach.',['pinnacle-profile'],'building-2','teal'],
 ['licences','Licences & software scope','MD-3, MD-5, BIS and the intended users and purpose.',['regulated-purpose'],'file-cog','purple'],
 ['proof','Explore the original evidence','Search all 34 records and follow the source documents.',['records'],'file-search','teal'],
 ['scale','Understand the six figures','Definitions, reporting dates and evidence for each measure.',['scale'],'chart-no-axes-combined','purple'],
 ['data','Developmental data, explained','What the record counts mean and how observations connect.',['data-scale'],'clipboard-list','teal'],
 ['network','Find your centre','Explore every recorded HFR ID, dated account details and district registration sources.',['centres'],'map-pin','rose'],
 ['research','Research, books & authors','DOI-linked works, parent books and researcher profiles.',['research'],'book-open','purple'],
 ['standards','International standards','Understand ICD-11, ICF, ICHI and SNOMED CT in context.',['international-standards'],'scan-eye','teal'],
 ['goals','Health, learning & inclusion','How the stated purpose connects with UN SDGs 3, 4, 10 and 17.',['global-goals'],'landmark','rose'],
 ['principles','Guidance from global bodies','Monitoring, family participation, coordination and inclusion.',['global-principles'],'house','teal'],
 ['context','Compare the wider picture','Compare intended uses and evidence across selected approaches.',['global-context'],'flask-conical','purple'],
 ['understand','Questions & clear terms','Direct answers and plain-language explanations.',['questions','terminology'],'file-text','teal'],
 ['accountability','Review & accountability','Findings, review methods, updates and the contact for corrections.',['review-summary','review','method'],'shield','rose']
];
function organize(body,teaser='',{icon,e}){
 const nodes=tree(body),sections=nodes.filter(n=>n.tag==='section'&&n.parent?.tag==='main');
 const byId=new Map(sections.map(n=>[n.open.match(/\bid="([^"]+)"/)?.[1],n]));
 const ids=groups.flatMap(g=>g[3]);
 if(new Set(ids).size!==ids.length)throw Error('A reading section was assigned twice');
 for(const id of ids)if(id!=='research'&&!byId.has(id))throw Error('Missing reading section: '+id);
 if(!teaser.includes('id="research"'))throw Error('Research chapter requires the existing research teaser');
 const selected=ids.map(id=>byId.get(id)).filter(Boolean),anchor=Math.min(...selected.map(n=>n.start));
 const number=i=>String(i+1).padStart(2,'0');
 const nav=`<div class="reader-tools wrap" aria-label="Reading controls"><label for="reader-jump">Explore at your pace</label><select id="reader-jump"><option value="">Choose one of 16 topics…</option>${groups.map((g,i)=>`<option value="chapter-${g[0]}">${number(i)} · ${e(g[1])}</option>`).join('')}</select><button type="button" id="reader-open" hidden>Open all topics</button><button type="button" id="reader-close" hidden>Close all topics</button><a href="#page-title" class="reader-top">Back to top ↑</a></div>`;
 const visuals={journey:[['scan-eye','Understand abilities'],['clipboard-list','Agree a plan'],['house','Practise & review'],['network','Everyday participation']],data:[['file-text','Observations'],['users','Shared context'],['scan-eye','Professional review'],['rotate-ccw','Plan correction']],accountability:[['files','Original source'],['search','Source review'],['file-text','Scope & findings'],['mail','Questions & corrections']]};
 const visual=g=>visuals[g[0]]?`<div class="chapter-visual" aria-label="${e(g[1])}: connected steps">${visuals[g[0]].map(([i,t],n)=>`${n?icon('chevron-right','visual-arrow'):''}<span>${icon(i)}${e(t)}</span>`).join('')}</div>`:'';
 const chapters=groups.map((g,i)=>`<details class="reader-chapter" id="chapter-${g[0]}" data-topic-tone="${g[5]}"><summary><span class="chapter-icon" aria-hidden="true">${icon(g[4])}</span><span class="chapter-heading"><span class="chapter-number">TOPIC ${number(i)}</span><strong>${e(g[1])}</strong><span class="chapter-description">${e(g[2])}</span></span><span class="chapter-plus" aria-hidden="true">${icon('plus')}</span></summary><div class="chapter-content">${visual(g)}${g[3].map(id=>id==='research'?teaser:body.slice(byId.get(id).start,byId.get(id).close)).join('\n')}<a class="chapter-back" href="#reader-guide">${icon('arrow-left')}Choose another topic</a></div></details>`).join('\n');
 const intro=`<div class="reader-guide wrap" id="reader-guide"><div><p class="eyebrow">16 TOPICS · YOUR QUESTIONS. YOUR PACE.</p><h2>Explore what matters to you.</h2><p>Open a topic for the explanation, visuals and original sources. Keep several open to compare, or read one at a time.</p></div><div class="reader-key" aria-label="How to read the evidence"><span>${icon('file-text')}Read the source</span><span>${icon('scan-eye')}Understand its scope</span><span>${icon('users')}Connect it to your family</span></div></div>`;
 const edits=selected.map(n=>({start:n.start,end:n.close,value:''}));
 edits.push({start:anchor,end:anchor,value:intro+nav+`<div class="reader-topics wrap" aria-label="Sixteen reading topics">${chapters}</div>`});
 edits.sort((a,b)=>b.start-a.start||b.end-a.end);
 for(const edit of edits)body=body.slice(0,edit.start)+edit.value+body.slice(edit.end);
 return body;
}
module.exports=organize;
module.exports.topics=groups.map((g,i)=>({number:i+1,id:'chapter-'+g[0],title:g[1],description:g[2],sections:g[3],icon:g[4]}));
