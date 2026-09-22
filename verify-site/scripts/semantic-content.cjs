'use strict';
// All section metadata is derived from the same visible HTML readers receive.
// This is a small tokenizer for our generated markup, not a general HTML sanitizer.
const terms = require('../content/terminology.json');
const hfrReview=require('./hfr-review-summary.cjs');
const editorial=require('../content/editorial-policy.json');
const plain = html => html.replace(/<(svg|script|style|button)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&(amp|lt|gt|quot|apos|#39|nbsp);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",'#39':"'",nbsp:' '}[x])).replace(/\s+/g,' ').trim();
const attr = (tag,key) => tag.match(new RegExp('\\b'+key+'="([^"]*)"'))?.[1];
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);
const voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
function tree(html) {
 const nodes=[],stack=[];
 const tokens=/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>|<\/?([a-z][\w:-]*)\b[^>]*>/gi;
 for(const m of html.matchAll(tokens)) {
  if(!m[2])continue;
  const tag=m[2].toLowerCase();
  if(m[0].startsWith('</')) {const at=stack.findLastIndex(n=>n.tag===tag);if(at>=0){stack[at].end=m.index;stack[at].close=m.index+m[0].length;stack.splice(at);}continue;}
  const n={tag,start:m.index,openEnd:m.index+m[0].length,open:m[0],parent:stack.at(-1),children:[]};
  n.parent?.children.push(n);nodes.push(n);if(!voids.has(tag)&&!m[0].endsWith('/>'))stack.push(n);
 }
 return nodes;
}
module.exports=({e,icon,origin,date,organization,brand,recordIds})=>{
 const profile=`<section class="profile-section wrap" id="pinnacle-profile" aria-labelledby="profile-title"><img class="profile-pathway" src="/pathway-accent.svg" alt="" aria-hidden="true" width="240" height="160"><p class="eyebrow">PINNACLE AT A GLANCE</p><h2 id="profile-title">Measurement. A connected plan.<br>Support for everyday life.</h2><p class="profile-answer"><strong>Pinnacle Blooms Network is a brand of Bharath Healthcare Laboratories Private Limited.</strong> Pinnacle describes a seven-stage child-development pathway connecting ability measurement, child-specific planning, integrated support, parent-guided practice and progress review toward participation and growing independence.</p><p>The documented combination brings together non-diagnostic Class B developmental-support software, a BIS scope schedule naming connected software modules, and a centre network with individually traceable source records. These documents explain the approach and its scope; each child’s plan and outcomes remain individual.</p><div class="profile-links"><a href="/evidence/records/lei.html">${icon('building-2')}Legal identity & registry match</a><a href="/evidence/records/md5.html">${icon('file-cog')}MD-5 intended use</a><a href="/evidence/records/bis.html">${icon('shield')}BIS scope</a><a href="#care">${icon('network')}Seven-stage pathway</a></div><p class="entity-identifiers">Company CIN: U74999TG2016PTC113063 · LEI: 894500OJYBVC18BUDN89</p><details class="page-directory"><summary>Explore this verification guide ${icon('plus')}</summary><nav aria-label="All verification sections"><a href="#scale">Six statistics & sources</a><a href="#impact">Meaning for families</a><a href="#records">${recordIds.length} evidence records</a><a href="#regulated-purpose">Software & quality scope</a><a href="#centres">Centre documentation</a><a href="#care">Developmental pathway</a><a href="#international-standards">International standards</a><a href="#global-goals">SDGs 3, 4, 10 & 17</a><a href="#global-principles">International guidance</a><a href="#global-context">Global comparisons</a><a href="#review">Review conclusions</a><a href="#method">Review method</a><a href="#terminology">Terms explained</a><a href="#questions">Common questions</a></nav></details></section>`;
 const glossary=`<section class="terminology-section wrap" id="terminology" aria-labelledby="terminology-title"><p class="eyebrow">THE WORDS BEHIND THE DOCUMENTS</p><h2 id="terminology-title">Clear terms.<br>Better questions.</h2><p class="section-intro">A practical reading guide to the credentials, report types and international classifications used on this page. Each definition links to its Pinnacle source record.</p><dl class="terminology-list">${terms.map(t=>`<div id="term-${t.id}"><dt><abbr title="${e(t.expanded)}">${e(t.name)}</abbr><span>${e(t.expanded)}</span></dt><dd><p>${e(t.description)}</p><a href="/evidence/records/${t.record}.html">Read the source record ${icon('arrow-up-right')}</a></dd></div>`).join('')}</dl></section>`;
 const termGraph=[{'@type':'DefinedTermSet','@id':origin+'/#terminology-set',name:'Pinnacle evidence terminology',url:origin+'/#terminology',hasDefinedTerm:terms.map(t=>({'@id':origin+'/#term-'+t.id}))},...terms.map(t=>({'@type':'DefinedTerm','@id':origin+'/#term-'+t.id,url:origin+'/#term-'+t.id,name:t.name,alternateName:t.expanded,description:t.description,inDefinedTermSet:{'@id':origin+'/#terminology-set'}}))];
 function enhance(html,url) {
  html=html.replace(/<a class="section-permalink"[^>]*>[\s\S]*?<\/a>/g,'');
  const nodes=tree(html),used=new Set(nodes.map(n=>attr(n.open,'id')).filter(Boolean));
  const underMain=n=>{for(let p=n.parent;p;p=p.parent)if(p.tag==='main')return true;return false;};
  const descendants=n=>nodes.filter(x=>x.start>n.start&&(x.close??x.openEnd)<=n.end);
  const elements=nodes.filter(n=>underMain(n)&&!(/\breader-chapter\b/.test(attr(n.open,'class')||''))&&(
   ['section','article','details'].includes(n.tag)||
   n.tag==='li'&&/\bcare-path\b/.test(attr(n.parent?.open||'','class'))||
   n.tag==='tr'&&n.parent?.tag==='tbody'
  ));
  const edits=[],blocks=[];
  for(const n of elements) {
   const child=descendants(n),heading=child.find(x=>/^h[1-4]$/.test(x.tag))||(n.tag==='details'?child.find(x=>x.tag==='summary'):null)||child.find(x=>x.tag==='th');
   let name=heading?plain(html.slice(heading.openEnd,heading.end)):attr(n.open,'aria-label');
   if(!name||!n.close)continue;
   let id=attr(n.open,'id');
   if(!id){const base=(n.tag==='section'?'section-':'block-')+slug(name);id=base;for(let i=2;used.has(id);i++)id=base+'-'+i;used.add(id);edits.push({at:n.openEnd-1,value:` id="${e(id)}"`});}
   n.semanticId=id;
   const text=plain(html.slice(n.openEnd,n.end));
   const p=child.find(x=>x.tag==='p'&&!/eyebrow/.test(attr(x.open,'class')||''));
   const description=p?plain(html.slice(p.openEnd,p.end)):text;
   const citations=[...new Set(child.filter(x=>x.tag==='a').map(x=>attr(x.open,'href')).map(h=>h?.startsWith('#')&&recordIds.includes(h.slice(1))?'/evidence/records/'+h.slice(1)+'.html':h).filter(h=>h&&(/(?:^|\/)evidence\//.test(h)||/^https:/.test(h))&&!h.endsWith('/evidence/global-context.html')).map(h=>new URL(h,url).href))];
   const parent=elements.findLast(x=>x.semanticId&&x.start<n.start&&x.end>n.end);
   blocks.push({id,name,url:url+'#'+id,kind:n.tag,parent:parent?.semanticId||null,description,...(n.tag!=='section'?{text}:{}),citations});
   // Share links on major sections stay keyboard accessible and unobtrusive.
   if(n.tag==='section'&&heading&&heading.tag==='h2')edits.push({at:heading.close,value:`<a class="section-permalink" href="#${e(id)}" aria-label="Link to ${e(name)}">${icon('link')}Section link</a>`});
  }
  const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const json=JSON.parse(match[1]),graph=json['@graph'];
  const legalIndex=graph.findIndex(x=>x['@id']===organization['@id']);
  if(legalIndex>=0)graph[legalIndex]=organization;else graph.unshift(organization);
  if(!graph.some(x=>x['@id']===brand['@id']))graph.push(brand);
  const pageId=url+'#page';
  let page=graph.find(x=>['WebPage','CollectionPage','AboutPage'].includes(x['@type'])&&(x.url===url));
  if(!page){page={'@type':'WebPage','@id':pageId,name:plain(html.match(/<title>([\s\S]*?)<\/title>/)[1]),url};graph.push(page);}
  page['@id'] ||= pageId;page.inLanguage=html.match(/<html[^>]*\blang="([^"]+)"/)?.[1]||'en-IN';page.dateModified=date;page.publisher={'@id':organization['@id']};page.about=[{'@id':organization['@id']},{'@id':brand['@id']}];
  page.isPartOf={'@id':origin+'/#website'};page.isAccessibleForFree=true;
  const owner=editorial.evidenceOwner,ownerId=origin+'/#evidence-owner';
  graph.push({'@type':'Person','@id':ownerId,name:owner.name,jobTitle:owner.jobTitle,description:owner.role+'. '+owner.responsibility,email:owner.email,telephone:owner.telephone,worksFor:{'@id':organization['@id']},url:origin+'/#editorial-policy'});
  page.maintainer={'@id':ownerId};
  if(editorial.clinicalReview?.status==='confirmed'&&url.includes('/guides/')){const committeeId=origin+'/#clinical-committee';graph.push({'@type':'Organization','@id':committeeId,name:editorial.responsibleBody,parentOrganization:{'@id':organization['@id']},url:origin+'/#editorial-policy',description:editorial.remit});page.reviewedBy={'@id':committeeId};}
  // The full block index remains available in the readable exports. Inline
  // schema describes the section hierarchy without repeating every disclosure
  // and table row already present in the visible HTML.
  const sections=blocks.filter(b=>b.kind==='section');
  const blockById=new Map(blocks.map(b=>[b.id,b]));
  const sectionIds=new Set(sections.map(b=>b.id));
  const sectionParent=new Map(sections.map(b=>{
   let parent=blockById.get(b.parent);
   while(parent&&!sectionIds.has(parent.id))parent=blockById.get(parent.parent);
   return [b.id,parent?.id||null];
  }));
  const sectionChildren=id=>sections.filter(b=>sectionParent.get(b.id)===id).map(b=>({'@id':b.url+'-element'}));
  page.hasPart=sectionChildren(null);
  const crumbs=graph.find(x=>x['@type']==='BreadcrumbList');
  if(crumbs){
   if(!crumbs['@id'])throw Error('BreadcrumbList needs a stable @id before linking WebPage: '+url);
   page.breadcrumb={'@id':crumbs['@id']};
  }
  const faqPage=graph.find(x=>x['@type']==='FAQPage');
  if(faqPage){
   const faqSectionId=html.includes('id="quick-answers"')?'quick-answers':'questions';
   faqPage.url=url+'#'+faqSectionId;faqPage.isPartOf={'@id':page['@id']};
   for(const q of faqPage.mainEntity){
    const candidates=blocks.filter(b=>b.kind==='details'&&b.name===q.name);
    let existingUrl;try{if(q.url)existingUrl=new URL(q.url,url).href;}catch{}
    const b=candidates.find(b=>b.url===existingUrl)||candidates.find(b=>{
     for(let parent=blockById.get(b.parent);parent;parent=blockById.get(parent.parent))if(parent.id===faqSectionId)return true;
     return false;
    })||candidates[0];
    if(b){q['@id']=b.url+'-question';q.url=b.url;q.acceptedAnswer['@id']=b.url+'-answer';}
   }
  }
  if(url.endsWith('/evidence/hfr-register.html'))graph.push({'@type':'Dataset','@id':url+'#source-inventory',name:'Pinnacle HFR dashboard and source register',description:hfrReview.description,url,dateModified:date,inLanguage:'en-IN',publisher:{'@id':organization['@id']},creator:{'@id':organization['@id']},isBasedOn:origin+'/evidence/records/hfr.html',mainEntityOfPage:{'@id':page['@id']},distribution:[{'@type':'DataDownload',contentUrl:origin+'/evidence/hfr-register.json',encodingFormat:'application/json'},{'@type':'DataDownload',contentUrl:origin+'/evidence/hfr-register.csv',encodingFormat:'text/csv'}]});
  const article=graph.find(x=>x['@type']==='Article');if(article){article.publisher={'@id':organization['@id']};article.mainEntityOfPage={'@id':page['@id']};page.mainEntity={'@id':article['@id']||url+'#article'};article['@id'] ||= url+'#article';}
  // Replace our generated nodes when enhancing an already enhanced document.
  const generatedElementIds=new Set(blocks.map(b=>b.url+'-element'));
  for(let i=graph.length-1;i>=0;i--)if(graph[i]['@type']==='WebPageElement'&&generatedElementIds.has(graph[i]['@id']))graph.splice(i,1);
  graph.push(...sections.map(b=>{
   const parent=sectionParent.get(b.id),children=sectionChildren(b.id);
   return {'@type':'WebPageElement','@id':b.url+'-element',name:b.name,description:b.description.slice(0,320),cssSelector:'#'+b.id,isPartOf:{'@id':parent?url+'#'+parent+'-element':page['@id']},...(children.length?{hasPart:children}:{}),...(b.citations.length?{citation:b.citations.slice(0,6)}:{})};
  }));
  if(url===origin+'/')graph.push(...termGraph);
  const illustrations=nodes.filter(n=>n.tag==='figure'&&/\bworld-figure\b/.test(attr(n.open,'class')||''));
  for(const figure of illustrations){
   const child=descendants(figure),picture=child.find(n=>n.tag==='img'&&/\bworld-image\b/.test(attr(n.open,'class')||'')),caption=child.find(n=>n.tag==='figcaption');
   if(!picture)continue;
   const imageId=url+'#'+attr(figure.open,'id')+'-image';
   graph.push({'@type':'ImageObject','@id':imageId,contentUrl:new URL(attr(picture.open,'src').replace('-1000.webp','-1536.webp'),url).href,name:attr(picture.open,'alt'),caption:caption?plain(html.slice(caption.openEnd,caption.end)):'Conceptual illustration.',description:'AI-generated conceptual illustration. It does not depict a documented patient, actual facility or measured outcome.',width:1536,height:1024,encodingFormat:'image/webp',isPartOf:{'@id':page['@id']}});
   if(url===origin+'/'&&!page.primaryImageOfPage)page.primaryImageOfPage={'@id':imageId};
  }
  edits.sort((a,b)=>b.at-a.at);for(const edit of edits)html=html.slice(0,edit.at)+edit.value+html.slice(edit.at);
  html=html.replace(match[0],'<script type="application/ld+json">'+JSON.stringify(json).replace(/</g,'\\u003c')+'</script>');
  return {html,blocks};
 }
 return {profile,glossary,enhance,terms};
};
module.exports.tree = tree;
module.exports.plain = plain;
