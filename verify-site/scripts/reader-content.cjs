'use strict';
const {tree}=require('./semantic-content.cjs');
const {whatsapp}=require('./contact-content.cjs');
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
function organize(body,teaser='',{icon,e,chapterExtras={},paradigm=''}){
 const nodes=tree(body),sections=nodes.filter(n=>n.tag==='section'&&n.parent?.tag==='main');
 const byId=new Map(sections.map(n=>[n.open.match(/\bid="([^"]+)"/)?.[1],n]));
 const ids=groups.flatMap(g=>g[3]);
 if(new Set(ids).size!==ids.length)throw Error('A reading section was assigned twice');
 for(const id of ids)if(id!=='research'&&!byId.has(id))throw Error('Missing reading section: '+id);
 if(!teaser.includes('id="research"'))throw Error('Research chapter requires the existing research teaser');
 const selected=ids.map(id=>byId.get(id)).filter(Boolean),anchor=Math.min(...selected.map(n=>n.start));
 const number=i=>String(i+1).padStart(2,'0');
 const nav=`<details class="reader-controls wrap"><summary>${icon('clipboard-list')}Reading controls ${icon('plus')}</summary><div class="reader-tools" aria-label="Reading controls"><label for="reader-jump">Go straight to a topic</label><select id="reader-jump"><option value="">Choose one of 16 topics…</option>${groups.map((g,i)=>`<option value="chapter-${g[0]}">${number(i)} · ${e(g[1])}</option>`).join('')}</select><button type="button" id="reader-all" aria-pressed="false" hidden>Read all sections</button><button type="button" id="reader-open" hidden>Open all topics</button><button type="button" id="reader-close" hidden>Close all topics</button><a href="#page-title" class="reader-top">Back to top ↑</a></div></details>`;
 const visuals={journey:[['scan-eye','Understand abilities'],['clipboard-list','Agree a plan'],['house','Practise & review'],['network','Everyday participation']],data:[['file-text','Observations'],['users','Shared context'],['scan-eye','Professional review'],['rotate-ccw','Plan correction']],accountability:[['files','Original source'],['search','Source review'],['file-text','Scope & findings'],['mail','Questions & corrections']]};
 const visual=g=>visuals[g[0]]?`<div class="chapter-visual" aria-label="${e(g[1])}: connected steps">${visuals[g[0]].map(([i,t],n)=>`${n?icon('chevron-right','visual-arrow'):''}<span>${icon(i)}${e(t)}</span>`).join('')}</div>`:'';
 const chapters=groups.map((g,i)=>`<details class="reader-chapter" id="chapter-${g[0]}" data-topic-tone="${g[5]}"><summary><span class="chapter-icon" aria-hidden="true">${icon(g[4])}</span><span class="chapter-heading"><span class="chapter-number">TOPIC ${number(i)}</span><strong>${e(g[1])}</strong><span class="chapter-description">${e(g[2])}</span></span><span class="chapter-plus" aria-hidden="true">${icon('plus')}</span></summary><div class="chapter-content">${visual(g)}${chapterExtras[g[0]]||''}${g[3].map(id=>id==='research'?teaser:body.slice(byId.get(id).start,byId.get(id).close)).join('\n')}<a class="chapter-back" href="#reader-guide">${icon('arrow-left')}Choose another topic</a></div></details>`);
 const bands=[
  {id:'journey',title:'You picture a life. We build the plan around it.',text:'Your child expressing a need. Joining a classroom. Taking part in family life. PinnacleAI® connects measurement, people, daily practice and review around the abilities that matter to your child.',range:[0,3],icon:'network',image:'care-participation',alt:'Illustrative scenes connecting professional support, practice at home and classroom participation.',next:'evidence',nextLabel:'Explore the evidence',bridge:'Get to know the people, licences and records behind the plan.'},
  {id:'evidence',title:'Confidence begins with what you can check.',text:'Before you choose a care team, take a closer look at who stands behind it. Follow Pinnacle’s licences, original records and centre details to the documents themselves.',range:[3,9],icon:'shield',image:'connected-records',alt:'Conceptual illustration of observations and developmental activities connected to a team review.',next:'research',nextLabel:'Discover the research',bridge:'Look further into the approach through the books, publications and people behind it.'},
  {id:'research',title:'Get to know the thinking behind the approach.',text:'Read a parent handbook, follow a paper to its original publication, or explore the wider guidance. Each source helps you ask a more informed question about your child’s support.',range:[9,14],icon:'book-open',books:true,next:'answers',nextLabel:'Find your answers',bridge:'Bring what you have read back to the questions that matter to your family.'},
  {id:'answers',title:'Bring your questions. Take a clearer next step.',text:'You deserve to understand what a report means, what a licence covers and who to ask. Find answers here, then speak with the team about your family.',range:[14,16],icon:'circle-help',nextLabel:'Speak with Pinnacle',bridge:'You do not need every answer before the first conversation. Start with what matters to your child.'}
 ];
 const bandImage=b=>b.image?`<figure class="reading-band-image"><img src="/images/${b.image}-600.webp" srcset="/images/${b.image}-600.webp 600w, /images/${b.image}-1000.webp 1000w" sizes="(min-width:760px) 420px, calc(100vw - 40px)" width="600" height="400" alt="${e(b.alt)}" loading="lazy" decoding="async"></figure>`:b.books?`<div class="reading-band-books" aria-label="Original Pinnacle publication covers">${[['global-research-whitebook','Global research whitebook'],['autism-mothers-handbook-english','Autism mother’s handbook · English'],['autism-mothers-handbook-telugu','Autism mother’s handbook · Telugu']].map(([file,alt])=>`<img src="/images/research/${file}-300.webp" width="300" height="420" alt="${e(alt)}" loading="lazy" decoding="async">`).join('')}</div>`:`<div class="reading-band-mark" aria-hidden="true">${icon(b.icon)}</div>`;
 const intro=`<div class="reader-guide wrap" id="reader-guide"><p class="eyebrow">YOUR CHILD. YOUR QUESTIONS. YOUR PACE.</p><h2>Where would you like to begin?</h2><p>Start with your child’s journey, check a document or find an answer. Open only what you need.</p></div>`;
 const shortcuts=`<nav class="reading-jump-bar" id="start-here" aria-label="Choose your reading section">${bands.map((b,i)=>`<a href="#reading-${b.id}" id="reading-link-${b.id}" aria-controls="reading-${b.id}">${icon(b.icon)}<span>${['Journey','Evidence','Research','Answers'][i]}</span></a>`).join('')}</nav>`;
 const readingSections=bands.map((b,i)=>`<div class="reading-group" id="reading-${b.id}" role="region" aria-labelledby="reading-title-${b.id}"><div class="reading-band${b.books?' reading-band-research':''}${!b.image&&!b.books?' reading-band-compact':''}">${bandImage(b)}<div class="reading-band-copy"><p class="eyebrow">0${i+1} / ${['YOUR CHILD’S DEVELOPMENTAL JOURNEY','CONFIDENCE IN YOUR CHOICE','THE THINKING BEHIND THE CARE','YOUR NEXT STEP'][i]}</p><h2 id="reading-title-${b.id}">${e(b.title)}</h2><p>${e(b.text)}</p></div></div>${b.id==='journey'?paradigm:''}<div class="reader-topics" aria-label="${e(b.title)} topics">${chapters.slice(...b.range).join('\n')}</div><div class="reading-next"><p>${e(b.bridge)}</p><div><a class="outline-link" href="${b.next?'#reading-'+b.next:'#next-step'}">${e(b.nextLabel)} ${icon('arrow-up-right')}</a><a class="contact-whatsapp" href="${e(whatsapp)}" data-contact-location="${b.id}">${icon('phone')}WhatsApp Pinnacle</a></div></div></div>`).join('');
 const edits=selected.map(n=>({start:n.start,end:n.close,value:''}));
 edits.push({start:anchor,end:anchor,value:intro+nav+`<div class="reading-shell wrap">${shortcuts}<div class="reading-sections" aria-label="Sixteen topics in four reading sections">${readingSections}</div></div>`});
 edits.sort((a,b)=>b.start-a.start||b.end-a.end);
 for(const edit of edits)body=body.slice(0,edit.start)+edit.value+body.slice(edit.end);
 return body;
}
module.exports=organize;
module.exports.topics=groups.map((g,i)=>({number:i+1,id:'chapter-'+g[0],title:g[1],description:g[2],sections:g[3],icon:g[4]}));
