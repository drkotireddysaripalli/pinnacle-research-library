'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const route='/evidence/pinnacle-paradigm-shift.html';
const source=require('../content/paradigm-finale/render.cjs');
const opening=require('../content/paradigm-finale/paradigm-opening.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
// Scope the approved standalone CSS to the story surface; portal utilities keep their own styles.
function scopeCss(css){
 css=css.replace(/\/\*[\s\S]*?\*\//g,'');let out='',offset=0;
 while(offset<css.length){const start=css.indexOf('{',offset);if(start<0){out+=css.slice(offset);break;}const rule=css.slice(offset,start).trim();let end=start+1,depth=1,quote='';
  for(;end<css.length&&depth;end++){const c=css[end];if(quote){if(c===quote&&css[end-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='{')depth++;else if(c==='}')depth--;}
  if(depth)throw Error('Unbalanced campaign CSS');const body=css.slice(start+1,end-1);offset=end;
  if(rule.startsWith('@font-face'))continue;
  if(/^@(media|supports|layer)/.test(rule)){out+=rule+'{'+scopeCss(body)+'}';continue;}
  if(rule.startsWith('@')){out+=rule+'{'+body+'}';continue;}
  const selectors=rule.split(',').map(s=>{s=s.trim();if(s===':root'||s==='html'||s==='body')return '.campaign-finale';if(s.startsWith('.js '))return '.js .campaign-finale '+s.slice(4);return '.campaign-finale '+s;});
  out+=selectors.join(',')+'{'+body+'}';
 }return out;
}
module.exports=({e,origin,date,organization,website,brand,head,footer,write})=>{
 const url=origin+route,publicUrl='https://www.pinnacleblooms.org/verify'+route;
 let raw=source.html;
 const css=scopeCss(raw.match(/<style>([\s\S]*?)<\/style>/)[1].replaceAll('url(assets/anek-latin.woff2)','url(/fonts/anek-latin.woff2)'))+'\n.campaign-finale{--navy:#14204d;--teal:#007d83;--muted:#496371;--line:#d6e6e8;--purple:#8a3bb0;--red:#d52b54;font-family:Anek,system-ui,sans-serif}.campaign-finale .hero-purpose{font-weight:650}.campaign-finale .reader select{background:#fff}.campaign-finale .footer-notes{padding-block:28px}.campaign-finale .narrative-public-citation{padding:25px 0;border-block:1px solid var(--line)}.campaign-finale [data-share-managed] .section-permalink{display:none}';
 const cssRoute='/_assets/finale.'+sha(css)+'.css';write(cssRoute.slice(1),css);
 const script=raw.match(/<script>([\s\S]*?)<\/script>/)[1];const jsRoute='/_assets/finale.'+sha(script)+'.js';write(jsRoute.slice(1),script);
 let body=raw.match(/<body>([\s\S]*?)<script>/)[1];
 body=body.replace(/\b(src|srcset)="assets\//g,'$1="/images/paradigm-finale/').replace(/, assets\//g,', /images/paradigm-finale/');
 body=body.replace('<footer class="footer wrap">','<section class="footer wrap footer-notes" id="campaign-notes">').replace('</footer>','</section>');
 body=body.replace('href="PinnacleAI-Paradigm-Shift-Finale.md"','href="/evidence/pinnacle-paradigm-shift.txt"').replace('Complete manuscript','Read or download the complete text');
 body=body.replace('This is the local campaign finale. The public evidence portal remains linked separately. Product-version and evidence decisions are retained below.','Published 22 September 2026. This source-linked company explanation distinguishes supplied planning examples, reviewed documents and reported outcomes. Product-version and evidence decisions are retained below.');
 body=body.replace('<p class="small">PinnacleAI®','<div class="hero-share-slot"></div><p class="small">PinnacleAI®');
 body=body.replace(/<section\b/g,'<section data-share-managed="true"');
 body=body.replace('id="paradigm-opening-history"', 'id="paradigm-opening-history"').replace('<div class="po-block-heading"><p class="po-kicker">Pinnacle’s historical challenge', '<span id="history-and-purpose" aria-hidden="true"></span><div class="po-block-heading"><p class="po-kicker">Pinnacle’s historical challenge').replace('<div class="po-block-heading"><p class="po-kicker">The PinnacleAI® philosophy', '<span id="change-the-starting-point" aria-hidden="true"></span><span id="from-task-to-life" aria-hidden="true"></span><div class="po-block-heading"><p class="po-kicker">The PinnacleAI® philosophy');
 body=body.replace('class="po-button po-primary" href="/evidence/pinnacle-paradigm-shift.html"','class="po-button po-primary" href="#complete-story"').replace('class="po-button" href="/evidence/pinnacle-paradigm-shift.html#documented-example"','class="po-button" href="#documented-example"');
 const citation=organization.name+'. (2026, September 22). PinnacleAI® Paradigm Shift: Your child’s life is the mission. Pinnacle Verify. '+publicUrl;
 const citationBlock='<section class="wrap narrative-public-citation" id="cite-this-approach" data-share-managed="true"><h2>Cite this explanation</h2><p>'+e(citation)+'</p><p><a href="/evidence/pinnacle-paradigm-shift.txt">Full text and source notes</a> · <a href="/evidence/pinnacle-paradigm-shift.json">Structured explanation</a></p></section>';
 const legacyAliases='<div id="approach"></div><div id="pinnacle-paradigm-shift"></div><div id="paradigm-story-heading"></div><div id="seven-stage-developmental-approach"></div>';
 const parts=source.data.cards.map(c=>({'@type':'CreativeWork','@id':url+'#'+c.id,url:url+'#'+c.id,name:c.title.replace(/\n/g,' '),position:c.number,description:c.pinnacle,citation:c.sources.map(s=>s[1])}));
 const graph=[organization,brand,website,{'@type':'WebPage','@id':url+'#page',url,name:'PinnacleAI® Paradigm Shift — Your child’s life is the mission',dateModified:date,inLanguage:'en-IN',isPartOf:{'@id':website['@id']},publisher:{'@id':organization['@id']},mainEntity:{'@id':url+'#approach'}},{'@type':'CreativeWork','@id':url+'#approach',url,name:'PinnacleAI® Paradigm Shift',headline:source.data.headline.replace(/\n/g,' '),description:'Begin with the child’s self-sufficient, mainstream life. Explore the philosophy, supplied goal and session examples, institutional evidence and eighteen source-linked perspectives.',dateModified:date,author:{'@id':organization['@id']},hasPart:parts.map(x=>({'@id':x['@id']})),citation:[...new Set(parts.flatMap(x=>x.citation))]},...parts,{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Verify Pinnacle',item:origin+'/'},{'@type':'ListItem',position:2,name:'PinnacleAI® Paradigm Shift',item:url}]}];
 const title='PinnacleAI® Paradigm Shift | Your Child’s Life Is the Mission';
 const desc='The child’s self-sufficient, mainstream life is the purpose. Explore the seven-image PinnacleAI® story, historical challenge, philosophy and original evidence.';
 const pageHead=head(title,desc,url,graph).replace('</head>','<link rel="stylesheet" href="'+cssRoute+'"><script defer src="'+jsRoute+'"></script></head>');
 write(route.slice(1),'<!doctype html><html lang="en-IN">'+pageHead+'<body><section class="campaign-finale" aria-label="The PinnacleAI paradigm shift" data-share-managed="true">'+legacyAliases+body+citationBlock+'</section>'+footer+'</body></html>');
 const text=fs.readFileSync(path.join(root,'content/paradigm-finale/PinnacleAI-Paradigm-Shift-Finale.md'),'utf8').replace(/## Production and source register[\s\S]*/, '').replace(/## The principle[\s\S]*?(?=## See what the session)/,opening.markdown)+'\n\n## Citation\n'+citation+'\n';
 write('evidence/pinnacle-paradigm-shift.txt',text);
 const example=require('../content/paradigm-finale/goal-session-example.cjs');
 const data={title,canonical:url,updated:date,publisher:organization.name,sourceType:'Source-linked company explanation',purpose:source.data.purpose,headline:source.data.headline,visualOpening:opening.data,historicalChallenge:opening.data.history,perspectives:source.data.cards,goalSessionExample:{source:'Owner-supplied planning examples, 22 September 2026; shortened and anonymised',scope:'Proposed activities and criteria, not completed feedback or observed outcomes. No shared record is asserted with the separate report excerpt.',suppliedGoalCount:7,selectedGoals:example.goals,activities:example.activities,sessionMinutes:40,separateFamilyMinutes:5},evidenceDecisions:source.data.evidenceRegister,citation};
 write('evidence/pinnacle-paradigm-shift.json',JSON.stringify(data,null,2));
 return {route,url,text,data,index:'\n## PinnacleAI®: life sets the direction\n- [The complete eighteen-part paradigm story]('+url+'): seven-image visual opening, historical issues, PinnacleAI® philosophy, supplied examples and original evidence.\n- [Why change the starting point]('+url+'#change-the-starting-point): the child’s self-sufficient, mainstream life determines the abilities, goals, people and practice.\n- [Inside a supplied session]('+url+'#documented-example): six activities, three selected goals and forty planned minutes plus five minutes of family handover.\n- [Structured explanation]('+origin+'/evidence/pinnacle-paradigm-shift.json): the same visible claims, planning criteria and evidence boundaries.\n'};
};
