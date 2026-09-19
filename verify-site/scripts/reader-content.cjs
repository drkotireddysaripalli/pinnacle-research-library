'use strict';
const {tree}=require('./semantic-content.cjs');
const groups=[
 ['journey','Your child’s journey','Abilities, a personal plan, everyday practice and progress.',['care','pinnacle-profile','impact','family']],
 ['proof','Licences & evidence','Read the originals, intended use and source review.',['records','regulated-purpose']],
 ['network','Scale & your centre','Six measures, their sources, and the complete centre lookup.',['scale','data-scale','centres']],
 ['context','The wider picture','International standards, SDGs and sourced comparisons.',['international-standards','global-goals','global-principles','global-context']],
 ['understand','Questions & clear terms','Find an answer and understand what each document means.',['questions','terminology']],
 ['accountability','Review & accountability','Review conclusions, methods, updates and corrections.',['review','method']]
];
module.exports=function organize(body,teaser=''){
 const nodes=tree(body),sections=nodes.filter(n=>n.tag==='section'&&n.parent?.tag==='main');
 const byId=new Map(sections.map(n=>[n.open.match(/\bid="([^"]+)"/)?.[1],n]));
 const selected=groups.flatMap(g=>g[3]).map(id=>byId.get(id)).filter(Boolean);
 const anchor=Math.min(...selected.map(n=>n.start));
 const nav=`<div class="reader-tools wrap" aria-label="Reading controls"><label for="reader-jump">Explore at your pace</label><select id="reader-jump"><option value="">Choose a topic…</option>${groups.map(g=>`<option value="chapter-${g[0]}">${g[1]}</option>`).join('')}<option value="research">Research & books</option></select><button type="button" id="reader-open" hidden>Open all topics</button><button type="button" id="reader-close" hidden>Close all topics</button><a href="#page-title" class="reader-top">Back to top ↑</a></div>`;
 const chapters=groups.map((g,i)=>`<details class="reader-chapter wrap" id="chapter-${g[0]}"><summary><span class="chapter-number">0${i+1}</span><span><strong>${g[1]}</strong><span class="chapter-description">${g[2]}</span></span><span class="chapter-plus" aria-hidden="true">+</span></summary><div class="chapter-content">${g[3].map(id=>{const n=byId.get(id);return n?body.slice(n.start,n.close):'';}).join('\n')}<a class="chapter-back" href="#reader-guide">Choose another topic ↑</a></div></details>`).join('\n');
 const intro=`<div class="reader-guide wrap" id="reader-guide"><p class="eyebrow">YOUR QUESTIONS. YOUR PACE.</p><h2>Start with what matters to you.</h2><p>Open a topic to explore it. Every source stays available, and links take you straight to the relevant evidence.</p></div>`;
 const edits=selected.map(n=>({start:n.start,end:n.close,value:''}));
 edits.push({start:anchor,end:anchor,value:teaser+intro+nav+chapters});
 edits.sort((a,b)=>b.start-a.start||b.end-a.end);
 for(const edit of edits)body=body.slice(0,edit.start)+edit.value+body.slice(edit.end);
 return body;
};
