'use strict';
// Citations describe the actual source type; a website summary is not the original report.
module.exports=({e,origin,date,records,research,write})=>{
 const items=[];
 const bibEscape=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/[{}%&#_$]/g,c=>'\\'+c).replace(/[\r\n]+/g,' ');
 const line=s=>String(s??'').replace(/[\r\n]+/g,' ').trim();
 const add=item=>{
  const authors=item.authors.map(line),year=item.date?.slice(0,4);
  const citation=`${authors.join('; ')}. (${item.date||'n.d.'}). ${item.title}${item.version?' (Version '+item.version+')':''}. ${item.kind}. ${item.doi?'https://doi.org/'+item.doi:item.url}`;
  const notes=[item.status,item.scope,item.version?'Version '+item.version:null].filter(Boolean).join(' ');
  const ris=[`TY  - ${item.book?'BOOK':item.summary?'ELEC':item.report?'RPRT':'UNPB'}`,`TI  - ${line(item.title)}`,...authors.map(a=>'AU  - '+a),...(year?['PY  - '+year,'DA  - '+item.date.replaceAll('-','/')]:[]),...(item.doi?['DO  - '+item.doi]:[]),...(item.isbn?['SN  - '+item.isbn]:[]),...(item.version?['ET  - '+line(item.version)]:[]),'UR  - '+item.url,'Y2  - '+date.replaceAll('-','/'),'N1  - '+line(notes),'ER  -'].join('\n')+'\n';
  const fields={title:item.title,author:authors.join(' and '),...(year?{year,date:item.date}:{}),...(item.doi?{doi:item.doi}:{}),...(item.isbn?{isbn:item.isbn}:{}),...(item.version?{version:item.version}:{}),url:item.url,note:notes,urldate:date};
  const bib=`@${item.book?'book':item.summary?'misc':item.report?'techreport':'unpublished'}{pinnacle-${item.id},\n${Object.entries(fields).map(([k,v])=>'  '+k+' = {'+bibEscape(v)+'}').join(',\n')}\n}\n`;
  const base='/evidence/citations/'+item.id;
  write(base.slice(1)+'.txt',citation+'\n\n'+notes+'\n');write(base.slice(1)+'.ris',ris);write(base.slice(1)+'.bib',bib);
  const entry={...item,citation,ris,bib,downloads:{text:base+'.txt',ris:base+'.ris',bibtex:base+'.bib'}};items.push(entry);return entry;
 };
 for(const r of records)add({id:'record-'+r.id,title:r.title,authors:['Bharath Healthcare Laboratories Private Limited'],date,kind:'Pinnacle Verification Centre evidence summary',summary:true,url:origin+'/evidence/records/'+r.id+'.html',status:r.reviewLabel||r.status,scope:r.supports+' '+r.limits+' Original source: '+r.citation});
 for(const r of research.records.filter(r=>r.id.startsWith('zenodo-')||r.type==='book'))add({id:r.id,title:r.title,authors:r.authors.map(a=>typeof a==='string'?a:a.name),date:r.publicationDate,version:r.version,kind:r.type==='book'?'Book':r.publicationStatus,book:r.type==='book',report:r.type==='report',url:r.doiUrl||r.url||origin+'/evidence/publications/'+r.id+'.html',doi:r.doi,isbn:r.bookISBN,status:r.publicationStatus,scope:r.scopeNote});
 const controls=id=>{
  const item=items.find(x=>x.id===id);if(!item)return '';
  return `<details class="citation-box" id="cite-${e(id)}"><summary>Cite ${item.summary?'this evidence summary':'this publication'}</summary><div class="citation-content"><p>${item.summary?'This citation identifies Pinnacle’s evidence summary. Follow the original-source links when citing the underlying document.':'Use the original publication’s authors, date, version and DOI. The publication status remains part of the citation.'}</p><label for="citation-${e(id)}">Formatted citation</label><textarea readonly id="citation-${e(id)}" rows="5">${e(item.citation)}</textarea><div class="citation-actions"><button type="button" data-copy-citation="citation-${e(id)}" hidden>Copy citation</button><a href="${item.downloads.bibtex}" download>BibTeX</a><a href="${item.downloads.ris}" download>RIS</a><a href="${item.downloads.text}">Plain text</a></div><p class="citation-status" role="status" aria-live="polite"></p></div></details>`;
 };
 write('evidence/citation-index.json',JSON.stringify({updated:date,description:'Citations preserve the distinction between original publications and Pinnacle website evidence summaries.',items:items.map(({ris,bib,...x})=>x)},null,2));
 write('evidence/research-library.ris',items.filter(x=>!x.summary).map(x=>x.ris).join('\n'));
 write('evidence/research-library.bib',items.filter(x=>!x.summary).map(x=>x.bib).join('\n'));
 return {items,controls};
};
