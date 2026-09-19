'use strict';
const fs=require('node:fs'),path=require('node:path');
const {tree,plain}=require('./semantic-content.cjs');
const copy=require('../content/share-copy.json');
const metrics=require('../content/metrics.json').metrics;
const hfr=require('../content/hfr-register.json').rows;
const social=require('./social-content.cjs');
const PUBLIC='https://www.pinnacleblooms.org/verify';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ascii=s=>s.normalize('NFC').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7e\u00ae]/g,' ').replace(/\s+/g,' ').trim();
const snippet=s=>{const text=ascii(s),short=text.length>115?text.slice(0,115).replace(/\s+\S*$/,''):text;return short.replace(/[.!?]+$/,'');};
const attr=(n,k)=>n.open.match(new RegExp('\\b'+k+'="([^"]*)"'))?.[1];
const mark=id=>`<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24"><use href="#share-icon-${id}"></use></svg>`;
const sprite='<svg class="share-symbols" aria-hidden="true" width="0" height="0"><defs><symbol id="share-icon-wa" viewBox="0 0 24 24"><path d="M20 11.6a8 8 0 0 1-11.9 7L3 20l1.4-4.8A8 8 0 1 1 20 11.6Z"/><path d="M8.1 7.6c.3-.5.9-.1 1.1.4l.6 1.4c.2.4-.2.7-.5 1 .8 1.5 1.8 2.5 3.5 3.2.4-.5.8-1.3 1.3-1l1.6.8c.6.3.6.9.2 1.3-1.5 1.8-4.1.5-6.1-1.3-1.9-1.8-3.3-4.2-1.7-5.8Z"/></symbol><symbol id="share-icon-x" viewBox="0 0 24 24"><path d="m4 3 16 18M20 3 4 21M3 3h5l13 18h-5Z"/></symbol><symbol id="share-icon-link" viewBox="0 0 24 24"><path d="m9 15 6-6m-7 9-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 6a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-1 1"/></symbol><symbol id="share-icon-more" viewBox="0 0 24 24"><path d="M12 16V3m-5 5 5-5 5 5M5 12v9h14v-9"/></symbol></defs></svg>';
module.exports=function addSharing(html,page,records){
 const nodes=tree(html),edits=[],rows=[];
 const publicUrl=url=>url.replace('https://pinnacle-verify.saripalli.chatgpt.site',PUBLIC);
 const recordById=new Map(records.map(r=>[r.id,r]));
 const sections=[{id:'page',name:plain(html.match(/<title>(.*?)<\/title>/)[1]),url:page.url,kind:'page'},...page.sections];
 for(const b of sections){
  const node=b.kind==='page'?null:nodes.find(n=>attr(n,'id')===b.id);
  if(b.kind!=='page'&&!node?.end)continue;
  if(node?.tag==='section'&&nodes.some(n=>n.tag==='h1'&&n.start>node.start&&n.end<node.end))continue;
  const record=recordById.get(b.id)||records.find(r=>page.url.endsWith('/records/'+r.id+'.html')&&(b.kind==='article'||b.kind==='page'));
  const metric=metrics.find(m=>m.id===b.id);
  const centre=hfr.find(r=>b.id==='hfr-'+r.id)||(node&&/centre-card/.test(attr(node,'class')||'')?hfr.find(r=>html.slice(node.openEnd,node.end).includes(r.id)):null);
  const target=social.shareTarget(page.url,b.id);
  let url=publicUrl(record?record.url:centre?'https://pinnacle-verify.saripalli.chatgpt.site/evidence/hfr-register.html#hfr-'+centre.id:target||b.url);
  const card=social.cardFor(url),image=PUBLIC+card.image;
  let short=copy[record?.id||b.id]||`Explore Pinnacle's evidence on ${snippet(b.name)}. Read the source, review date and scope before drawing conclusions.`;
  if(centre)short=`Explore ${snippet(centre.name)}: HFR ID ${centre.id} in Pinnacle's source inventory. An identifier does not establish current operating status or clinical outcomes.`;
  if(b.kind==='page'&&!record)short=page.url.endsWith('/')?copy.page:`Explore ${snippet(b.name.split(' | ')[0])}. Read the source records, review dates and evidence scope.`;
  short=ascii(short);if(short.length+24>280)short=`Explore Pinnacle's evidence on ${snippet(b.name)}. Read the source and scope.`;
  if(short.length+24>280)throw Error('Share draft too long: '+b.id);
  let full=short;
  if(record)full+='\n\nReview: '+record.statusLabel+'.\n'+record.reviewStatusNote+'\nScope: '+record.limits;
  if(metric)full+='\n\n'+metric.basis+'\n'+metric.boundary;
  if(centre)full+='\nSource level: '+centre.sourceLevel+'. Current registry status was not independently queried.';
  const wa='https://wa.me/?text='+encodeURIComponent(full+'\n\n'+url);
  const x='https://twitter.com/intent/tweet?text='+encodeURIComponent(short)+'&url='+encodeURIComponent(url);
  const bar=`<!-- share:start --><div class="fact-share" data-share-url="${e(url)}" data-share-title="${e(b.name)}"><span class="share-context">Share ${record?'evidence':b.kind==='page'?'this page':'this'}</span><a class="share-wa" href="${e(wa)}" target="_blank" rel="noopener noreferrer" aria-label="Share ${e(b.name)} on WhatsApp">${mark('wa')}WhatsApp</a><button type="button" class="share-toggle" hidden aria-expanded="false" aria-label="More ways to share ${e(b.name)}">${mark('more')}More</button><div class="share-options"><a class="share-x" href="${e(x)}" target="_blank" rel="noopener noreferrer" aria-label="Share ${e(b.name)} on X">${mark('x')}X</a><button type="button" class="copy-share" aria-label="Copy link to ${e(b.name)}">${mark('link')}Copy link</button><a class="share-image" href="${e(image)}" download="${e(card.id)}.jpg" aria-label="Download share image for ${e(card.title)}">${mark('more')}Share image</a><button type="button" class="device-share" hidden aria-label="More sharing options for ${e(b.name)}">${mark('more')}Share</button></div></div><!-- share:end -->`;
  let at;
  if(b.kind==='page'){const slot=nodes.find(n=>/hero-share-slot/.test(attr(n,'class')||'')),h=nodes.find(n=>n.tag==='h1');at=slot?.end||h?.close;}
  else if(node.tag==='tr'){const td=nodes.filter(n=>n.tag==='td'&&n.start>node.start&&n.end<node.end).at(-1);at=td?.end;}
  else if(node.tag==='section'){at=node.end;}
  else if(/(?:^|\s)(?:queue-item|lifecycle-scope)(?:\s|$)/.test(attr(node,'class')||'')){at=node.children.find(n=>n.tag==='div')?.end??node.end;}
  else if(node.children.some(n=>/(?:^|\s)stage-content(?:\s|$)/.test(attr(n,'class')||''))){at=node.children.find(n=>/(?:^|\s)stage-content(?:\s|$)/.test(attr(n,'class')||''))?.end??node.end;}
  else at=node.end;
  if(at){edits.push({at,value:bar});rows.push({id:b.id,url,image,text:short,whatsapp:full,xLength:short.length+24});}
 }
 edits.sort((a,b)=>b.at-a.at);for(const edit of edits)html=html.slice(0,edit.at)+edit.value+html.slice(edit.at);
 html=html.replace('</body>',sprite+'<p class="share-status" role="status" aria-live="polite"></p><dialog class="share-fallback" aria-labelledby="share-fallback-title"><h2 id="share-fallback-title">Copy this evidence link</h2><p>Select and copy the link below.</p><input readonly aria-label="Evidence link"><form method="dialog"><button>Close</button></form></dialog></body>');
 return {html,rows};
};
